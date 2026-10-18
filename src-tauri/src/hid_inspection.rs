//! Read-only Windows interpretation of a collection's HID preparsed data.
//! Metadata-only collection handles may be opened; no input/output/feature payload is transferred.
use serde_json::{json, Value};
use windows_sys::Win32::{Devices::HumanInterfaceDevice::*, Foundation::HANDLE, UI::Input::*};
fn bounded(length: u32, counts: &[u16]) -> bool {
    length > 0 && length <= 65_536 && counts.iter().all(|n| *n <= 128)
}
fn inspect(handle: HANDLE) -> Result<Value, String> {
    let mut length = 0;
    if unsafe {
        GetRawInputDeviceInfoW(
            handle,
            RIDI_PREPARSEDDATA,
            std::ptr::null_mut(),
            &mut length,
        )
    } == u32::MAX
        || !bounded(length, &[])
    {
        return Err("Preparsed data unavailable or exceeds 64 KiB".into());
    }
    // DWORD alignment required by GetRawInputDeviceInfoW; zero-initialized owned allocation.
    let mut data = vec![0u32; (length as usize).div_ceil(4)];
    let capacity = data.len() * 4;
    let returned = unsafe {
        GetRawInputDeviceInfoW(
            handle,
            RIDI_PREPARSEDDATA,
            data.as_mut_ptr().cast(),
            &mut length,
        )
    };
    if returned == u32::MAX
        || returned == 0
        || returned as usize > capacity
        || length as usize > capacity
    {
        return Err("Preparsed data changed or failed bounds checks".into());
    }
    let pointer = data.as_ptr() as PHIDP_PREPARSED_DATA;
    parse(pointer, length)
}
fn parse(pointer: PHIDP_PREPARSED_DATA, length: u32) -> Result<Value, String> {
    let mut caps = HIDP_CAPS::default();
    if unsafe { HidP_GetCaps(pointer, &mut caps) } != HIDP_STATUS_SUCCESS {
        return Err("Windows rejected invalid/unsupported preparsed data".into());
    }
    let counts = [
        caps.NumberInputButtonCaps,
        caps.NumberInputValueCaps,
        caps.NumberOutputButtonCaps,
        caps.NumberOutputValueCaps,
        caps.NumberFeatureButtonCaps,
        caps.NumberFeatureValueCaps,
    ];
    if !bounded(length, &counts) {
        return Err("HID control capabilities exceed inspection budget".into());
    }
    let mut reports = Vec::new();
    for (name, kind, bytes, buttons, values) in [
        (
            "input",
            HidP_Input,
            caps.InputReportByteLength,
            counts[0],
            counts[1],
        ),
        (
            "output",
            HidP_Output,
            caps.OutputReportByteLength,
            counts[2],
            counts[3],
        ),
        (
            "feature",
            HidP_Feature,
            caps.FeatureReportByteLength,
            counts[4],
            counts[5],
        ),
    ] {
        let mut controls = Vec::new();
        let mut errors = Vec::new();
        if buttons > 0 {
            let mut entries = vec![HIDP_BUTTON_CAPS::default(); buttons as usize];
            let mut count = buttons;
            if unsafe { HidP_GetButtonCaps(kind, entries.as_mut_ptr(), &mut count, pointer) }
                == HIDP_STATUS_SUCCESS
                && count <= buttons
            {
                for c in entries.into_iter().take(count as usize) {
                    let (minimum, maximum) = unsafe {
                        if c.IsRange {
                            (c.Anonymous.Range.UsageMin, c.Anonymous.Range.UsageMax)
                        } else {
                            (c.Anonymous.NotRange.Usage, c.Anonymous.NotRange.Usage)
                        }
                    };
                    controls.push(json!({"kind":"button","reportId":c.ReportID,"usagePage":c.UsagePage,"usageMin":minimum,"usageMax":maximum,"linkCollection":c.LinkCollection}));
                }
            } else {
                errors.push("Button capability query failed/bounded");
            }
        }
        if values > 0 {
            let mut entries = vec![HIDP_VALUE_CAPS::default(); values as usize];
            let mut count = values;
            if unsafe { HidP_GetValueCaps(kind, entries.as_mut_ptr(), &mut count, pointer) }
                == HIDP_STATUS_SUCCESS
                && count <= values
            {
                for c in entries.into_iter().take(count as usize) {
                    let (minimum, maximum) = unsafe {
                        if c.IsRange {
                            (c.Anonymous.Range.UsageMin, c.Anonymous.Range.UsageMax)
                        } else {
                            (c.Anonymous.NotRange.Usage, c.Anonymous.NotRange.Usage)
                        }
                    };
                    controls.push(json!({"kind":"value","reportId":c.ReportID,"usagePage":c.UsagePage,"usageMin":minimum,"usageMax":maximum,"linkCollection":c.LinkCollection,"bitSize":c.BitSize,"reportCount":c.ReportCount,"logicalMin":c.LogicalMin,"logicalMax":c.LogicalMax}));
                }
            } else {
                errors.push("Value capability query failed/bounded");
            }
        }
        reports.push(json!({"type":name,"maximumByteLengthIncludingId":bytes,"controls":controls,"errors":errors}));
    }
    Ok(
        json!({"profileVersion":"windows-hid-capabilities-1.0","status":"observed","source":"Windows Raw Input / HidP parser","usagePage":caps.UsagePage,"usage":caps.Usage,"reports":reports,"verifiedModel":false,"validatedHardwareOperations":[],"limitations":["Windows interpreted capabilities, not raw report-descriptor bytes or a reverse-engineered protocol.","Report ID zero means no numbered report; lengths are maximum Windows collection report lengths.","Unknown usages and ranges are preserved numerically. No payload semantics or LED state is inferred."]}),
    )
}
struct HidFile(HANDLE);
impl Drop for HidFile {
    fn drop(&mut self) {
        unsafe {
            windows_sys::Win32::Foundation::CloseHandle(self.0);
        }
    }
}
struct Preparsed(PHIDP_PREPARSED_DATA);
impl Drop for Preparsed {
    fn drop(&mut self) {
        unsafe {
            HidD_FreePreparsedData(self.0);
        }
    }
}
fn collection(path: &str) -> Result<Value, String> {
    use windows_sys::Win32::{Foundation::INVALID_HANDLE_VALUE, Storage::FileSystem::*};
    if path.len() > 8192 || path.contains('\0') || !path.to_uppercase().starts_with(r"\\?\HID#") {
        return Err("No supported native HID collection path".into());
    }
    let wide: Vec<u16> = path.encode_utf16().chain(Some(0)).collect();
    // Zero desired access: metadata queries only. Never ReadFile/WriteFile/GetFeature/SetFeature.
    let handle = unsafe {
        CreateFileW(
            wide.as_ptr(),
            0,
            FILE_SHARE_READ | FILE_SHARE_WRITE,
            std::ptr::null(),
            OPEN_EXISTING,
            0,
            std::ptr::null_mut(),
        )
    };
    if handle == INVALID_HANDLE_VALUE {
        return Err("Collection metadata access unavailable".into());
    }
    let file = HidFile(handle);
    let mut pointer = 0;
    if !unsafe { HidD_GetPreparsedData(file.0, &mut pointer) } || pointer == 0 {
        return Err("Collection preparsed data unavailable".into());
    }
    let data = Preparsed(pointer);
    // Opaque OS-owned buffer length is not exposed; HidP validates it. Control counts remain bounded.
    let mut result = parse(data.0, 1)?;
    result["source"] = json!("Windows zero-access HID collection / HidP parser");
    Ok(result)
}
pub fn read(handle: HANDLE, path: Option<&str>) -> Value {
    inspect(handle).or_else(|_| collection(path.ok_or("HID collection path unavailable")?)).unwrap_or_else(|reason| json!({"profileVersion":"windows-hid-capabilities-1.0","status":"unavailable","reason":reason}))
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn malformed_or_excessive_descriptor_metadata_is_rejected() {
        assert!(!bounded(0, &[]));
        assert!(!bounded(65_537, &[]));
        assert!(!bounded(100, &[129]));
        assert!(bounded(65_536, &[128, 0]));
    }
}
