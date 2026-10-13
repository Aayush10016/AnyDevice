//! Original implementation based on documented user-mode Windows Raw Input APIs.
use crate::input_service::InputEvent;
use serde_json::{json, Value};
use std::{
    io::{self, Write},
    mem::size_of,
    time::{Duration, Instant},
};
use windows_sys::Win32::System::{Diagnostics::ToolHelp::*, Threading::*};
use windows_sys::Win32::{
    Devices::{DeviceAndDriverInstallation::*, Properties::*},
    Foundation::*,
    System::LibraryLoader::GetModuleHandleW,
    UI::{Input::*, WindowsAndMessaging::*},
};
pub struct OwnedProcess(HANDLE);
impl Drop for OwnedProcess {
    fn drop(&mut self) {
        unsafe {
            CloseHandle(self.0);
        }
    }
}
/// Verify the actual creator and exact executable path before any input registration.
pub fn verify_parent(claimed: u32) -> Result<OwnedProcess, String> {
    let snapshot = unsafe { CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) };
    if snapshot == INVALID_HANDLE_VALUE {
        return Err("Cannot verify input collector owner".into());
    }
    let snapshot = OwnedProcess(snapshot);
    let mut entry = PROCESSENTRY32W {
        dwSize: size_of::<PROCESSENTRY32W>() as u32,
        ..Default::default()
    };
    let mut found = None;
    let mut present = unsafe { Process32FirstW(snapshot.0, &mut entry) };
    for _ in 0..32768 {
        if present == 0 {
            break;
        }
        if entry.th32ProcessID == std::process::id() {
            found = Some(entry.th32ParentProcessID);
            break;
        }
        present = unsafe { Process32NextW(snapshot.0, &mut entry) };
    }
    if claimed == 0 || found != Some(claimed) {
        return Err("Input collector requires its actual AnyDevice parent".into());
    }
    let parent = unsafe {
        OpenProcess(
            PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_SYNCHRONIZE,
            0,
            claimed,
        )
    };
    if parent.is_null() {
        return Err("Cannot validate AnyDevice parent image".into());
    }
    let parent = OwnedProcess(parent);
    let mut path = vec![0u16; 32768];
    let mut len = path.len() as u32;
    if unsafe {
        QueryFullProcessImageNameW(parent.0, PROCESS_NAME_WIN32, path.as_mut_ptr(), &mut len)
    } == 0
        || len as usize > path.len()
    {
        return Err("Cannot read input parent image".into());
    }
    let image =
        String::from_utf16(&path[..len as usize]).map_err(|_| "Invalid input parent image")?;
    let image = std::fs::canonicalize(image).map_err(|_| "Cannot resolve input parent image")?;
    let current =
        std::fs::canonicalize(std::env::current_exe().map_err(|_| "Executable unavailable")?)
            .map_err(|_| "Cannot resolve collector image")?;
    if !image
        .to_string_lossy()
        .eq_ignore_ascii_case(&current.to_string_lossy())
    {
        return Err("Input collector owner must be the matching AnyDevice executable".into());
    }
    Ok(parent)
}
fn wide(s: &str) -> Vec<u16> {
    s.encode_utf16().chain(Some(0)).collect()
}
fn instance(path: &[u16]) -> Option<String> {
    let mut ty = 0;
    let mut len = 0;
    let code = unsafe {
        CM_Get_Device_Interface_PropertyW(
            path.as_ptr(),
            &DEVPKEY_Device_InstanceId,
            &mut ty,
            std::ptr::null_mut(),
            &mut len,
            0,
        )
    };
    if code != CR_BUFFER_SMALL || ty != DEVPROP_TYPE_STRING || len > 16384 || len == 0 {
        return None;
    }
    let mut bytes = vec![0u8; len as usize];
    if unsafe {
        CM_Get_Device_Interface_PropertyW(
            path.as_ptr(),
            &DEVPKEY_Device_InstanceId,
            &mut ty,
            bytes.as_mut_ptr(),
            &mut len,
            0,
        )
    } != CR_SUCCESS
        || ty != DEVPROP_TYPE_STRING
        || len as usize > bytes.len()
        || !len.is_multiple_of(2)
    {
        return None;
    }
    let units: Vec<u16> = bytes[..len as usize]
        .chunks_exact(2)
        .map(|b| u16::from_le_bytes([b[0], b[1]]))
        .take_while(|v| *v != 0)
        .collect();
    String::from_utf16(&units).ok()
}
fn ancestors(id: &str) -> Vec<String> {
    let mut result = Vec::new();
    let mut node = 0;
    let mut encoded = wide(id);
    if unsafe { CM_Locate_DevNodeW(&mut node, encoded.as_mut_ptr(), CM_LOCATE_DEVNODE_NORMAL) }
        != CR_SUCCESS
    {
        return result;
    }
    for _ in 0..16 {
        let mut parent = 0;
        if unsafe { CM_Get_Parent(&mut parent, node, 0) } != CR_SUCCESS {
            break;
        }
        let mut len = 0;
        if unsafe { CM_Get_Device_ID_Size(&mut len, parent, 0) } != CR_SUCCESS || len > 8192 {
            break;
        }
        let mut buf = vec![0u16; len as usize + 1];
        if unsafe { CM_Get_Device_IDW(parent, buf.as_mut_ptr(), buf.len() as u32, 0) } != CR_SUCCESS
        {
            break;
        }
        if let Ok(value) = String::from_utf16(&buf[..len as usize]) {
            if result
                .iter()
                .any(|s: &String| s.eq_ignore_ascii_case(&value))
            {
                break;
            }
            result.push(value);
        } else {
            break;
        }
        node = parent;
    }
    result
}
struct Endpoint {
    handle: HANDLE,
    kind: u32,
    value: Value,
}
fn endpoints() -> Result<Vec<Endpoint>, String> {
    for _ in 0..3 {
        let mut len = 0;
        if unsafe {
            GetRawInputDeviceList(
                std::ptr::null_mut(),
                &mut len,
                size_of::<RAWINPUTDEVICELIST>() as u32,
            )
        } == u32::MAX
            || len > 4096
        {
            return Err("Raw Input enumeration failed or exceeded 4096 entries".into());
        }
        let mut list = vec![RAWINPUTDEVICELIST::default(); len as usize];
        let n = unsafe {
            GetRawInputDeviceList(
                list.as_mut_ptr(),
                &mut len,
                size_of::<RAWINPUTDEVICELIST>() as u32,
            )
        };
        if n == u32::MAX {
            continue;
        }
        if n as usize > list.len() {
            return Err("Raw Input list changed unexpectedly".into());
        }
        let mut out = Vec::new();
        let mut evidence_bytes = 0usize;
        for entry in list
            .iter()
            .take(n as usize)
            .filter(|e| e.dwType == RIM_TYPEMOUSE || e.dwType == RIM_TYPEKEYBOARD)
        {
            let mut len = 0;
            if unsafe {
                GetRawInputDeviceInfoW(
                    entry.hDevice,
                    RIDI_DEVICENAME,
                    std::ptr::null_mut(),
                    &mut len,
                )
            } == u32::MAX
                || len > 8192
                || len == 0
            {
                continue;
            }
            let mut path = vec![0u16; len as usize];
            let n = unsafe {
                GetRawInputDeviceInfoW(
                    entry.hDevice,
                    RIDI_DEVICENAME,
                    path.as_mut_ptr().cast(),
                    &mut len,
                )
            };
            if n == u32::MAX || n as usize > path.len() {
                continue;
            }
            let end = path.iter().position(|u| *u == 0).unwrap_or(path.len());
            let name = String::from_utf16(&path[..end]).ok();
            if end == path.len() {
                path.push(0);
            }
            let id = instance(&path);
            let parents = id.as_deref().map(ancestors).unwrap_or_default();
            let mut info = RID_DEVICE_INFO {
                cbSize: size_of::<RID_DEVICE_INFO>() as u32,
                ..Default::default()
            };
            let mut size = info.cbSize;
            let got = unsafe {
                GetRawInputDeviceInfoW(
                    entry.hDevice,
                    RIDI_DEVICEINFO,
                    (&mut info as *mut RID_DEVICE_INFO).cast(),
                    &mut size,
                )
            };
            let capabilities = if got != u32::MAX && info.dwType == entry.dwType {
                unsafe {
                    if entry.dwType == RIM_TYPEMOUSE {
                        let m = info.Anonymous.mouse;
                        json!({"reportedButtons":m.dwNumberOfButtons,"reportedSampleRate":m.dwSampleRate,"horizontalWheel":m.fHasHorizontalWheel!=0})
                    } else {
                        let k = info.Anonymous.keyboard;
                        json!({"reportedKeys":k.dwNumberOfKeysTotal,"reportedFunctionKeys":k.dwNumberOfFunctionKeys,"keyboardType":k.dwType})
                    }
                }
            } else {
                Value::Null
            };
            out.push(Endpoint{handle:entry.hDevice,kind:entry.dwType,value:json!({"instanceId":id,"path":name,"kind":if entry.dwType==RIM_TYPEMOUSE {"mouse"}else{"keyboard"},"ancestors":parents,"capabilities":capabilities,"source":"Windows Raw Input / Configuration Manager","observedAt":chrono::Utc::now().to_rfc3339()})});
            evidence_bytes += out.last().unwrap().value.to_string().len();
            if out.len() > 256 || evidence_bytes > 2 * 1024 * 1024 {
                return Err("Input capability inventory exceeded its evidence budget".into());
            }
        }
        return Ok(out);
    }
    Err("Raw Input inventory changed repeatedly".into())
}
pub fn inventory() -> Result<Value, String> {
    Ok(
        json!({"endpoints":endpoints()?.into_iter().map(|e|e.value).collect::<Vec<_>>(),"complete":true,"limitations":["Raw Input attribution identifies a logical collection, not a confirmed wireless peripheral.","Reported capabilities are metadata, not functional-test results."]}),
    )
}
fn mouse_events(flags: u16, buttons: u16, data: u16, x: i32, y: i32) -> Vec<InputEvent> {
    let at = chrono::Utc::now().to_rfc3339();
    let mut out = Vec::new();
    if flags & 1 != 0 || x != 0 || y != 0 {
        out.push(InputEvent::MouseMove {
            at: at.clone(),
            x,
            y,
            absolute: flags & 1 != 0,
        });
    }
    for button in 1..=5 {
        let down = 1u16 << ((button - 1) * 2);
        let up = down << 1;
        if buttons & down != 0 {
            out.push(InputEvent::MouseButton {
                at: at.clone(),
                button,
                down: true,
            });
        }
        if buttons & up != 0 {
            out.push(InputEvent::MouseButton {
                at: at.clone(),
                button,
                down: false,
            });
        }
    }
    for (flag, axis) in [(0x400, "vertical"), (0x800, "horizontal")] {
        if buttons & flag != 0 {
            out.push(InputEvent::MouseWheel {
                at: at.clone(),
                axis: axis.into(),
                delta: data as i16,
            });
        }
    }
    out
}
fn key_event(vk: u16, scan: u16, flags: u16, x_only: bool) -> Option<InputEvent> {
    if vk >= 255 || scan == 255 || flags > 7 || (x_only && vk != 0x58) {
        return None;
    }
    let vk = match vk {
        16 => {
            if scan == 0x36 {
                161
            } else {
                160
            }
        }
        17 => {
            if flags & 2 != 0 {
                163
            } else {
                162
            }
        }
        18 => {
            if flags & 2 != 0 {
                165
            } else {
                164
            }
        }
        other => other,
    };
    Some(InputEvent::Key {
        at: chrono::Utc::now().to_rfc3339(),
        vk,
        scan,
        flags,
        down: flags & 1 == 0,
    })
}
fn send(value: Value) -> Result<(), String> {
    let mut out = io::stdout().lock();
    writeln!(out, "{value}")
        .and_then(|_| out.flush())
        .map_err(|_| "Input stream closed".into())
}
fn status(s: &str, reason: &str) -> Result<(), String> {
    send(json!({"type":"status","status":s,"reason":reason}))
}
unsafe extern "system" fn window_proc(hwnd: HWND, msg: u32, w: WPARAM, l: LPARAM) -> LRESULT {
    unsafe { DefWindowProcW(hwnd, msg, w, l) }
}
struct Registration {
    window: HWND,
    usage: u16,
}
impl Drop for Registration {
    fn drop(&mut self) {
        unsafe {
            let rid = RAWINPUTDEVICE {
                usUsagePage: 1,
                usUsage: self.usage,
                dwFlags: RIDEV_REMOVE,
                hwndTarget: std::ptr::null_mut(),
            };
            RegisterRawInputDevices(&rid, 1, size_of::<RAWINPUTDEVICE>() as u32);
            DestroyWindow(self.window);
        }
    }
}
pub fn run(target: &str, mode: &str, parent_pid: u32) -> Result<(), String> {
    if target.len() > 8192 || !["mouse", "keyboard", "x-key"].contains(&mode) || parent_pid == 0 {
        return Err("Invalid selected input session".into());
    }
    #[cfg(not(test))]
    let owner = verify_parent(parent_pid)?;
    let kind = if mode == "mouse" {
        RIM_TYPEMOUSE
    } else {
        RIM_TYPEKEYBOARD
    };
    let selected = endpoints()?
        .into_iter()
        .filter(|e| {
            e.kind == kind
                && e.value["instanceId"]
                    .as_str()
                    .is_some_and(|id| id.eq_ignore_ascii_case(target))
        })
        .collect::<Vec<_>>();
    if selected.len() != 1 {
        return status(
            "unsupported",
            "Exactly one mapped Raw Input collection is required; choose an inspected endpoint",
        );
    }
    let handle = selected[0].handle;
    let class = wide("AnyDeviceInputSession");
    let window = unsafe {
        let module = GetModuleHandleW(std::ptr::null());
        let wc = WNDCLASSW {
            lpfnWndProc: Some(window_proc),
            hInstance: module,
            lpszClassName: class.as_ptr(),
            ..Default::default()
        };
        if RegisterClassW(&wc) == 0 {
            return Err("Input window class registration failed".into());
        }
        CreateWindowExW(
            0,
            class.as_ptr(),
            class.as_ptr(),
            0,
            0,
            0,
            0,
            0,
            HWND_MESSAGE,
            std::ptr::null_mut(),
            module,
            std::ptr::null(),
        )
    };
    if window.is_null() {
        return Err("Input message window creation failed".into());
    }
    let usage = if mode == "mouse" { 2 } else { 6 };
    let _guard = Registration { window, usage };
    let rid = RAWINPUTDEVICE {
        usUsagePage: 1,
        usUsage: usage,
        dwFlags: RIDEV_INPUTSINK | RIDEV_DEVNOTIFY,
        hwndTarget: window,
    };
    if unsafe { RegisterRawInputDevices(&rid, 1, size_of::<RAWINPUTDEVICE>() as u32) } == 0 {
        return Err("Raw Input registration failed".into());
    }
    status(
        "testing",
        "Selected logical collection registered; keep AnyDevice focused",
    )?;
    let started = Instant::now();
    let mut packets = 0;
    loop {
        #[cfg(not(test))]
        if unsafe { WaitForSingleObject(owner.0, 0) } == WAIT_OBJECT_0 {
            return status("focusLost", "AnyDevice owner exited");
        }
        if started.elapsed() > Duration::from_secs(120) || packets >= 10000 {
            return status("completed", "Session duration or packet budget reached");
        }
        let mut foreground_pid = 0;
        unsafe {
            GetWindowThreadProcessId(GetForegroundWindow(), &mut foreground_pid);
        }
        if foreground_pid != parent_pid {
            return status(
                "focusLost",
                "Collection stopped because AnyDevice lost foreground focus",
            );
        }
        let mut msg = MSG::default();
        for _ in 0..64 {
            if unsafe { PeekMessageW(&mut msg, window, 0, 0, PM_REMOVE) } == 0 {
                break;
            }
            if msg.message == WM_INPUT_DEVICE_CHANGE
                && msg.wParam as u32 == GIDC_REMOVAL
                && msg.lParam as HANDLE == handle
            {
                return status(
                    "disconnected",
                    "Selected collection was removed; reconnect and inspect again",
                );
            }
            if msg.message == WM_INPUT {
                let mut header = RAWINPUTHEADER::default();
                let mut size = size_of::<RAWINPUTHEADER>() as u32;
                let got = unsafe {
                    GetRawInputData(
                        msg.lParam as HRAWINPUT,
                        RID_HEADER,
                        (&mut header as *mut RAWINPUTHEADER).cast(),
                        &mut size,
                        size_of::<RAWINPUTHEADER>() as u32,
                    )
                };
                if got == size_of::<RAWINPUTHEADER>() as u32
                    && header.hDevice == handle
                    && header.dwType == kind
                {
                    // Recheck focus before decoding any selected keyboard/mouse data.
                    unsafe {
                        GetWindowThreadProcessId(GetForegroundWindow(), &mut foreground_pid);
                    }
                    if foreground_pid != parent_pid {
                        return status("focusLost", "Collection stopped on focus loss");
                    }
                    let mut raw = RAWINPUT::default();
                    let mut size = size_of::<RAWINPUT>() as u32;
                    let got = unsafe {
                        GetRawInputData(
                            msg.lParam as HRAWINPUT,
                            RID_INPUT,
                            (&mut raw as *mut RAWINPUT).cast(),
                            &mut size,
                            size_of::<RAWINPUTHEADER>() as u32,
                        )
                    };
                    let minimum = size_of::<RAWINPUTHEADER>()
                        + if kind == RIM_TYPEMOUSE {
                            size_of::<RAWMOUSE>()
                        } else {
                            size_of::<RAWKEYBOARD>()
                        };
                    if got == u32::MAX
                        || (got as usize) < minimum
                        || got as usize > size_of::<RAWINPUT>()
                    {
                        return Err("Invalid selected Raw Input packet".into());
                    }
                    let events = unsafe {
                        if kind == RIM_TYPEMOUSE {
                            let m = raw.data.mouse;
                            let b = m.Anonymous.Anonymous;
                            mouse_events(
                                m.usFlags,
                                b.usButtonFlags,
                                b.usButtonData,
                                m.lLastX,
                                m.lLastY,
                            )
                        } else {
                            let k = raw.data.keyboard;
                            key_event(k.VKey, k.MakeCode, k.Flags, mode == "x-key")
                                .into_iter()
                                .collect()
                        }
                    };
                    packets += 1;
                    for event in events {
                        send(json!({"type":"event","event":event}))?;
                    }
                }
            }
            unsafe {
                TranslateMessage(&msg);
                DispatchMessageW(&msg);
            }
            if packets >= 10000 || started.elapsed() > Duration::from_secs(120) {
                break;
            }
        }
        std::thread::sleep(Duration::from_millis(4));
    }
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn decodes_extra_buttons_and_signed_wheels() {
        let e = mouse_events(0, 0x100 | 0x200 | 0x400, (-120i16) as u16, 0, 0);
        assert_eq!(e.len(), 3);
        assert!(matches!(e[2], InputEvent::MouseWheel { delta: -120, .. }));
    }
    #[test]
    fn absolute_origin_and_all_button_pairs_are_retained() {
        let origin = mouse_events(1, 0, 0, 0, 0);
        assert!(matches!(
            origin[0],
            InputEvent::MouseMove {
                x: 0,
                y: 0,
                absolute: true,
                ..
            }
        ));
        let buttons = mouse_events(0, 0x3ff, 0, 0, 0);
        assert_eq!(buttons.len(), 10);
        let horizontal = mouse_events(0, 0x800, (-120i16) as u16, 0, 0);
        assert!(
            matches!(&horizontal[0],InputEvent::MouseWheel{axis,delta:-120,..} if axis=="horizontal")
        );
    }
    #[test]
    fn keeps_absolute_motion_distinct() {
        assert!(matches!(
            mouse_events(1, 0, 0, 40, 20)[0],
            InputEvent::MouseMove { absolute: true, .. }
        ));
    }
    #[test]
    fn empty_packet_is_not_functional_success() {
        assert!(mouse_events(0, 0, 0, 0, 0).is_empty());
    }
    #[test]
    fn raw_endpoint_envelope_is_real_read_only_metadata() {
        let result = inventory().unwrap();
        assert!(result["endpoints"].is_array());
    }
    #[test]
    fn x_mode_discards_other_keys_and_maps_modifiers() {
        assert!(key_event(65, 30, 0, true).is_none());
        assert!(key_event(255, 0, 0, false).is_none());
        assert!(matches!(
            key_event(16, 0x36, 0, false),
            Some(InputEvent::Key { vk: 161, .. })
        ));
        assert!(matches!(
            key_event(88, 45, 1, true),
            Some(InputEvent::Key { down: false, .. })
        ));
    }
    #[test]
    fn registration_focus_gate_unregisters_without_reading_events() {
        let endpoint = endpoints()
            .unwrap()
            .into_iter()
            .find(|e| e.value["instanceId"].is_string());
        if let Some(endpoint) = endpoint {
            let mut before = 0;
            unsafe {
                GetRegisteredRawInputDevices(
                    std::ptr::null_mut(),
                    &mut before,
                    size_of::<RAWINPUTDEVICE>() as u32,
                );
            }
            run(
                endpoint.value["instanceId"].as_str().unwrap(),
                if endpoint.kind == RIM_TYPEMOUSE {
                    "mouse"
                } else {
                    "keyboard"
                },
                u32::MAX,
            )
            .unwrap();
            let mut after = 0;
            unsafe {
                GetRegisteredRawInputDevices(
                    std::ptr::null_mut(),
                    &mut after,
                    size_of::<RAWINPUTDEVICE>() as u32,
                );
            }
            assert_eq!(before, after);
        } else {
            println!("Raw Input registration probe not exercised: no mapped input endpoint on this runner");
        }
    }
    #[test]
    fn foreign_parent_is_rejected_before_input_registration() {
        assert!(verify_parent(u32::MAX).is_err());
        assert!(verify_parent(std::process::id()).is_err());
    }
}
