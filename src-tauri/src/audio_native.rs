//! Original Core Audio/WASAPI implementation, using Microsoft API bindings.
use crate::audio_metrics::{decode, Accumulator, Levels};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    io::{self, Write},
    time::{Duration, Instant},
};
use windows::{
    core::{Interface, PCWSTR, PWSTR},
    Win32::{
        Devices::FunctionDiscovery::{
            PKEY_Device_ContainerId, PKEY_Device_FriendlyName, PKEY_Device_InstanceId,
        },
        Foundation::PROPERTYKEY,
        Media::{
            Audio::{Endpoints::IAudioEndpointVolume, *},
            KernelStreaming::{KSDATAFORMAT_SUBTYPE_PCM, WAVE_FORMAT_EXTENSIBLE},
            Multimedia::KSDATAFORMAT_SUBTYPE_IEEE_FLOAT,
        },
        System::Com::{
            StructuredStorage::{PropVariantClear, PropVariantToStringAlloc},
            *,
        },
    },
};
struct Apartment;
impl Apartment {
    fn new() -> Result<Self, String> {
        unsafe { CoInitializeEx(None, COINIT_APARTMENTTHREADED) }
            .ok()
            .map_err(|e| e.to_string())?;
        Ok(Self)
    }
}
impl Drop for Apartment {
    fn drop(&mut self) {
        unsafe { CoUninitialize() }
    }
}
fn enumerator() -> Result<IMMDeviceEnumerator, String> {
    unsafe { CoCreateInstance(&MMDeviceEnumerator, None, CLSCTX_ALL) }.map_err(|e| e.to_string())
}
fn string(p: PWSTR) -> Option<String> {
    if p.is_null() {
        return None;
    }
    let value = unsafe { p.to_string() }
        .ok()
        .map(|v| v.chars().take(2048).collect());
    unsafe { CoTaskMemFree(Some(p.0.cast())) };
    value
}
fn prop(d: &IMMDevice, key: &PROPERTYKEY) -> Option<String> {
    let store = unsafe { d.OpenPropertyStore(STGM_READ) }.ok()?;
    let mut v = unsafe { store.GetValue(key) }.ok()?;
    let result = unsafe { PropVariantToStringAlloc(&v) }.ok();
    let _ = unsafe { PropVariantClear(&mut v) };
    result.and_then(string)
}
#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Format {
    pub sample_rate: u32,
    pub channels: u16,
    pub bits: u16,
    pub float: bool,
    pub block_align: u16,
    pub channel_mask: u32,
    pub supported: bool,
}
struct Mix(*mut WAVEFORMATEX);
impl Drop for Mix {
    fn drop(&mut self) {
        unsafe { CoTaskMemFree(Some(self.0.cast())) }
    }
}
fn mix(client: &IAudioClient) -> Result<(Mix, Format), String> {
    let ptr = unsafe { client.GetMixFormat() }.map_err(|e| e.to_string())?;
    if ptr.is_null() {
        return Err("No shared-mode format".into());
    }
    let owned = Mix(ptr);
    let w = unsafe { ptr.read_unaligned() };
    let mut float = w.wFormatTag == 3;
    let mut pcm = w.wFormatTag == 1;
    let mut mask = 0;
    if w.wFormatTag == WAVE_FORMAT_EXTENSIBLE as u16 && w.cbSize >= 22 {
        let x = unsafe { (ptr as *const WAVEFORMATEXTENSIBLE).read_unaligned() };
        let sub = x.SubFormat;
        float = sub == KSDATAFORMAT_SUBTYPE_IEEE_FLOAT;
        pcm = sub == KSDATAFORMAT_SUBTYPE_PCM;
        mask = x.dwChannelMask;
    }
    let bits = w.wBitsPerSample;
    let f = Format {
        sample_rate: w.nSamplesPerSec,
        channels: w.nChannels,
        bits: w.wBitsPerSample,
        float,
        block_align: w.nBlockAlign,
        channel_mask: mask,
        supported: (pcm && [8, 16, 24, 32].contains(&bits) || float && w.wBitsPerSample == 32)
            && w.nChannels > 0
            && w.nChannels <= 8
            && w.nSamplesPerSec >= 8000
            && w.nSamplesPerSec <= 384000
            && w.nBlockAlign == w.nChannels * (w.wBitsPerSample / 8),
    };
    Ok((owned, f))
}
fn volume(d: &IMMDevice) -> Option<IAudioEndpointVolume> {
    unsafe { d.Activate(CLSCTX_ALL, None) }.ok()
}
// Query status only: no service start/stop/configuration rights are requested.
fn services() -> Vec<Value> {
    use windows_sys::Win32::System::Services::*;
    struct Handle(SC_HANDLE);
    impl Drop for Handle {
        fn drop(&mut self) {
            unsafe {
                CloseServiceHandle(self.0);
            }
        }
    }
    let manager = unsafe { OpenSCManagerW(std::ptr::null(), std::ptr::null(), SC_MANAGER_CONNECT) };
    let manager = if manager.is_null() {
        None
    } else {
        Some(Handle(manager))
    };
    let manager_error = if manager.is_none() {
        Some(std::io::Error::last_os_error().to_string())
    } else {
        None
    };
    ["Audiosrv", "AudioEndpointBuilder"].into_iter().map(|name| {
        let result = (|| -> Result<SERVICE_STATUS, String> {
            let manager = manager.as_ref().ok_or_else(|| manager_error.clone().unwrap_or_default())?;
            let name: Vec<u16> = name.encode_utf16().chain(Some(0)).collect();
            let handle = unsafe { OpenServiceW(manager.0, name.as_ptr(), SERVICE_QUERY_STATUS) };
            if handle.is_null() { return Err(std::io::Error::last_os_error().to_string()); }
            let handle = Handle(handle);
            let mut status: SERVICE_STATUS = unsafe { std::mem::zeroed() };
            if unsafe { QueryServiceStatus(handle.0, &mut status) } == 0 { return Err(std::io::Error::last_os_error().to_string()); }
            Ok(status)
        })();
        match result {
            Ok(status) => json!({"name":name,"state":status.dwCurrentState,"win32ExitCode":status.dwWin32ExitCode,"serviceSpecificExitCode":status.dwServiceSpecificExitCode,"error":null}),
            Err(error) => json!({"name":name,"state":null,"win32ExitCode":null,"serviceSpecificExitCode":null,"error":error}),
        }
    }).collect()
}
fn session_volume(client: &IAudioClient) -> Value {
    let result = (|| -> Result<Value, String> {
        let control: ISimpleAudioVolume =
            unsafe { client.GetService() }.map_err(|e| format!("Open session volume: {e}"))?;
        let mute = unsafe { control.GetMute() }
            .map_err(|e| format!("Read session mute: {e}"))?
            .as_bool();
        let level = unsafe { control.GetMasterVolume() }
            .map_err(|e| format!("Read session volume: {e}"))?;
        Ok(json!({"type":"sessionVolume","mute":mute,"level":level,"error":null}))
    })();
    result.unwrap_or_else(
        |error| json!({"type":"sessionVolume","mute":null,"level":null,"error":error}),
    )
}
pub fn inventory() -> Result<Value, String> {
    let _com = Apartment::new()?;
    let en = enumerator()?;
    let mut rows = Vec::new();
    let mut errors = Vec::new();
    for (flow, kind) in [(eRender, "playback"), (eCapture, "recording")] {
        let defaults: Vec<(String, String)> = [
            (eConsole, "console"),
            (eMultimedia, "multimedia"),
            (eCommunications, "communications"),
        ]
        .iter()
        .filter_map(|(role, label)| {
            unsafe { en.GetDefaultAudioEndpoint(flow, *role) }
                .ok()
                .and_then(|d| unsafe { d.GetId() }.ok())
                .and_then(string)
                .map(|id| (id, (*label).into()))
        })
        .collect();
        let list = unsafe { en.EnumAudioEndpoints(flow, DEVICE_STATE(DEVICE_STATEMASK_ALL)) }
            .map_err(|e| e.to_string())?;
        let count = unsafe { list.GetCount() }.map_err(|e| e.to_string())?;
        if count > 128 {
            errors.push("Audio endpoint list truncated at 128 per flow");
        }
        for index in 0..count.min(128) {
            let d = unsafe { list.Item(index) }.map_err(|e| e.to_string())?;
            let id = unsafe { d.GetId() }
                .ok()
                .and_then(string)
                .ok_or("No endpoint ID")?;
            let state = unsafe { d.GetState() }.map_err(|e| e.to_string())?;
            let active = state == DEVICE_STATE_ACTIVE;
            let vol = if active { volume(&d) } else { None };
            let format = if active {
                unsafe { d.Activate::<IAudioClient>(CLSCTX_ALL, None) }
                    .ok()
                    .and_then(|c| mix(&c).ok().map(|(_, f)| f))
            } else {
                None
            };
            let roles: Vec<_> = defaults
                .iter()
                .filter(|(key, _)| key == &id)
                .map(|(_, role)| role.clone())
                .collect();
            rows.push(json!({"id":id,"name":prop(&d,&PKEY_Device_FriendlyName).unwrap_or_else(||format!("Windows {kind} endpoint")),"instanceId":prop(&d,&PKEY_Device_InstanceId),"containerId":prop(&d,&PKEY_Device_ContainerId),"kind":kind,"state":if active{"active"}else if state.0&DEVICE_STATE_DISABLED.0!=0{"disabled"}else if state.0&DEVICE_STATE_UNPLUGGED.0!=0{"unplugged"}else{"notPresent"},"defaultRoles":roles,"mute":vol.as_ref().and_then(|v|unsafe{v.GetMute()}.ok().map(|b|b.as_bool())),"volume":vol.as_ref().and_then(|v|unsafe{v.GetMasterVolumeLevelScalar()}.ok()),"format":format}));
        }
    }
    Ok(
        json!({"endpoints":rows,"services":services(),"errors":errors,"complete":errors.is_empty(),"source":"Windows Core Audio","observedAt":chrono::Utc::now().to_rfc3339()}),
    )
}
fn device(en: &IMMDeviceEnumerator, id: &str) -> Result<IMMDevice, String> {
    if id.is_empty() || id.len() > 2048 || id.contains('\0') {
        return Err("Invalid endpoint ID".into());
    }
    let encoded: Vec<u16> = id.encode_utf16().chain(Some(0)).collect();
    unsafe { en.GetDevice(PCWSTR(encoded.as_ptr())) }.map_err(|e| e.to_string())
}
fn output(value: Value) -> Result<(), String> {
    let mut out = io::stdout().lock();
    writeln!(out, "{value}")
        .and_then(|_| out.flush())
        .map_err(|_| "Audio observation pipe closed".into())
}
fn foreground(pid: u32) -> bool {
    let window = unsafe { windows_sys::Win32::UI::WindowsAndMessaging::GetForegroundWindow() };
    let mut current = 0;
    unsafe {
        windows_sys::Win32::UI::WindowsAndMessaging::GetWindowThreadProcessId(window, &mut current)
    };
    current == pid
}
struct Stream(IAudioClient);
impl Drop for Stream {
    fn drop(&mut self) {
        let _ = unsafe { self.0.Stop() };
    }
}
struct CaptureLease<'a> {
    capture: &'a IAudioCaptureClient,
    frames: u32,
}
impl Drop for CaptureLease<'_> {
    fn drop(&mut self) {
        let _ = unsafe { self.capture.ReleaseBuffer(self.frames) };
    }
}
fn prepare(id: &str, capture_mode: bool, mode: &str) -> Result<(Stream, Format, u32), String> {
    let en = enumerator().map_err(|e| format!("Endpoint enumeration: {e}"))?;
    let d = device(&en, id).map_err(|e| format!("Select exact endpoint: {e}"))?;
    if unsafe { d.GetState() }.map_err(|e| format!("Process WASAPI stream: {e}"))?
        != DEVICE_STATE_ACTIVE
    {
        return Err("Endpoint state: selected endpoint is not active".into());
    }
    let endpoint: IMMEndpoint = d
        .cast()
        .map_err(|e| format!("Process WASAPI stream: {e}"))?;
    if unsafe { endpoint.GetDataFlow() }.map_err(|e| format!("Process WASAPI stream: {e}"))?
        != if capture_mode { eCapture } else { eRender }
    {
        return Err("Endpoint flow: does not match the selected test".into());
    }
    let client: IAudioClient = unsafe { d.Activate(CLSCTX_ALL, None) }
        .map_err(|e| format!("Activate WASAPI client: {e}"))?;
    let (owned_format, format) = mix(&client).map_err(|e| format!("Read shared format: {e}"))?;
    if !format.supported {
        return Err("Format negotiation: shared-mode sample format is not supported".into());
    }
    if ["left", "right"].contains(&mode)
        && !crate::audio_signal::stereo(format.channels, format.channel_mask)
    {
        return Err(
            "Format negotiation: left/right testing requires standard stereo channel mapping"
                .into(),
        );
    }
    unsafe {
        client.Initialize(
            AUDCLNT_SHAREMODE_SHARED,
            0,
            1_000_000,
            0,
            owned_format.0,
            None,
        )
    }
    .map_err(|e| format!("Initialize shared stream: {e}"))?;
    let stream = Stream(client);
    let size =
        unsafe { stream.0.GetBufferSize() }.map_err(|e| format!("Read stream buffer size: {e}"))?;
    if size == 0 || size > format.sample_rate * 2 {
        return Err("Audio buffer exceeds bounded size".into());
    }
    Ok((stream, format, size))
}
pub fn readiness(id: &str, kind: &str) -> Value {
    let observed = chrono::Utc::now().to_rfc3339();
    let result = (|| -> Result<Value, String> {
        if !["playback", "recording"].contains(&kind) {
            return Err("Selection: invalid endpoint kind".into());
        }
        let _com = Apartment::new().map_err(|e| format!("COM initialization: {e}"))?;
        let (stream, format, size) = prepare(
            id,
            kind == "recording",
            if kind == "recording" {
                "ambient"
            } else {
                "tone"
            },
        )?;
        if kind == "recording" {
            let _: IAudioCaptureClient = unsafe { stream.0.GetService() }
                .map_err(|e| format!("Open capture service: {e}"))?;
        } else {
            let _: IAudioRenderClient = unsafe { stream.0.GetService() }
                .map_err(|e| format!("Open render service: {e}"))?;
        }
        let volume = session_volume(&stream.0);
        let session_volume = if volume["error"].is_null() {
            json!({"mute":volume["mute"],"level":volume["level"]})
        } else {
            Value::Null
        };
        let session_volume_error = volume["error"]
            .as_str()
            .map(crate::audio_signal::failure_record);
        Ok(
            json!({"initialized":true,"serviceReady":true,"format":format,"bufferFrames":size,"sessionVolume":session_volume,"sessionVolumeError":session_volume_error}),
        )
    })();
    match result {
        Ok(facts) => {
            json!({"operation":"audio-readiness","targetId":id,"kind":kind,"observedAt":observed,"facts":facts,"started":false,"frames":0,"errors":[],"complete":true})
        }
        Err(reason) => {
            json!({"operation":"audio-readiness","targetId":id,"kind":kind,"observedAt":observed,"facts":null,"started":false,"frames":0,"errors":[crate::audio_signal::failure_record(&reason)],"complete":false})
        }
    }
}
fn render_frames(
    render: &IAudioRenderClient,
    format: &Format,
    frames: u32,
    start: u64,
    mode: &str,
    peak: f64,
    aggregate: &mut [Accumulator],
) -> Result<(), String> {
    let data =
        unsafe { render.GetBuffer(frames) }.map_err(|e| format!("Process WASAPI stream: {e}"))?;
    if data.is_null() {
        let _ = unsafe { render.ReleaseBuffer(frames, AUDCLNT_BUFFERFLAGS_SILENT.0 as u32) };
        return Err("Render returned a null buffer".into());
    }
    let slice = unsafe {
        std::slice::from_raw_parts_mut(data, frames as usize * format.block_align as usize)
    };
    let generated = crate::audio_signal::fill_at_level(
        slice,
        format.channels,
        format.bits,
        format.float,
        format.sample_rate,
        start,
        mode,
        peak,
        aggregate,
    );
    let released = unsafe {
        render.ReleaseBuffer(
            frames,
            if generated.is_err() {
                AUDCLNT_BUFFERFLAGS_SILENT.0 as u32
            } else {
                0
            },
        )
    }
    .map_err(|e| format!("Process WASAPI stream: {e}"));
    released?;
    generated?;
    Ok(())
}
pub fn run(id: &str, mode: &str, parent: u32, signal_level: &str) -> Result<(), String> {
    let owner = crate::raw_input::verify_parent(parent)?;
    let peak = crate::audio_signal::signal_peak(signal_level)?;
    if !["left", "right", "tone", "ambient", "speech"].contains(&mode) {
        return Err("Unsupported audio mode".into());
    }
    if !foreground(parent) {
        return output(
            json!({"type":"status","status":"interrupted","reason":"Keep AnyDevice active before starting audio"}),
        );
    }
    let capture_mode = ["ambient", "speech"].contains(&mode);
    let _com = Apartment::new().map_err(|e| format!("COM initialization: {e}"))?;
    let (stream, format, size) = match prepare(id, capture_mode, mode) {
        Ok(v) => v,
        Err(reason) if reason.starts_with("Format negotiation:") => {
            return output(json!({"type":"status","status":"unsupported","reason":reason}))
        }
        Err(reason) => return Err(reason),
    };
    let capture = if capture_mode {
        Some(
            unsafe { stream.0.GetService::<IAudioCaptureClient>() }
                .map_err(|e| format!("Open capture service: {e}"))?,
        )
    } else {
        None
    };
    let render = if !capture_mode {
        Some(
            unsafe { stream.0.GetService::<IAudioRenderClient>() }
                .map_err(|e| format!("Open render service: {e}"))?,
        )
    } else {
        None
    };
    output(session_volume(&stream.0))?;
    let mut aggregate = vec![Accumulator::default(); format.channels as usize];
    let mut frames_total = 0u64;
    if let Some(render) = &render {
        let initial = size.min(format.sample_rate * 3);
        render_frames(render, &format, initial, 0, mode, peak, &mut aggregate)?;
        frames_total = initial as u64;
    }
    unsafe { stream.0.Start() }.map_err(|e| format!("Start WASAPI stream: {e}"))?;
    output(
        json!({"type":"status","status":"running","reason":if capture_mode{"Temporary level measurement active; no audio samples retained"}else{"Prefilled bounded tone active; audibility requires your confirmation"}}),
    )?;
    let started = Instant::now();
    let mut published = Instant::now();
    let mut window = aggregate.clone();
    let mut glitches = 0u32;
    let mut timestamp_errors = 0u32;
    let duration = if capture_mode { 8.0 } else { 5.0 };
    while started.elapsed().as_secs_f64() < duration {
        if !owner.alive() || !foreground(parent) {
            return output(
                json!({"type":"status","status":"interrupted","reason":"Audio stopped because AnyDevice lost focus or exited"}),
            );
        }
        if let Some(capture) = &capture {
            for _ in 0..256 {
                if unsafe { capture.GetNextPacketSize() }
                    .map_err(|e| format!("Process WASAPI stream: {e}"))?
                    == 0
                {
                    break;
                }
                let mut data = std::ptr::null_mut();
                let mut frames = 0;
                let mut flags = 0;
                unsafe { capture.GetBuffer(&mut data, &mut frames, &mut flags, None, None) }
                    .map_err(|e| format!("Process WASAPI stream: {e}"))?;
                let _lease = CaptureLease { capture, frames };
                let bytes = frames as usize * format.block_align as usize;
                if bytes > 8 * 1024 * 1024 {
                    return Err("Capture packet exceeds 8 MiB".into());
                }
                let silent = flags & AUDCLNT_BUFFERFLAGS_SILENT.0 as u32 != 0;
                if !silent && data.is_null() {
                    return Err("Capture returned a null sample buffer".into());
                }
                let slice = if silent {
                    &[][..]
                } else {
                    unsafe { std::slice::from_raw_parts(data, bytes) }
                };
                let step = format.bits as usize / 8;
                for frame in 0..frames as usize {
                    for ch in 0..format.channels as usize {
                        let offset = frame * format.block_align as usize + ch * step;
                        let value = if silent {
                            0.0
                        } else {
                            decode(&slice[offset..offset + step], format.float)?
                        };
                        aggregate[ch].add(value);
                        window[ch].add(value);
                    }
                }
                frames_total += frames as u64;
                glitches += u32::from(flags & AUDCLNT_BUFFERFLAGS_DATA_DISCONTINUITY.0 as u32 != 0);
                timestamp_errors +=
                    u32::from(flags & AUDCLNT_BUFFERFLAGS_TIMESTAMP_ERROR.0 as u32 != 0);
            }
        }
        if let Some(render) = &render {
            let available = size.saturating_sub(
                unsafe { stream.0.GetCurrentPadding() }
                    .map_err(|e| format!("Process WASAPI stream: {e}"))?,
            );
            let remaining = (format.sample_rate as u64 * 3).saturating_sub(frames_total);
            let frames = available.min(remaining as u32);
            if frames > 0 {
                render_frames(
                    render,
                    &format,
                    frames,
                    frames_total,
                    mode,
                    peak,
                    &mut aggregate,
                )?;
                window = aggregate.clone();
                frames_total += frames as u64;
            }
        }
        if !capture_mode && frames_total >= format.sample_rate as u64 * 3 {
            let pending = unsafe { stream.0.GetCurrentPadding() }
                .map_err(|e| format!("Drain playback buffer: {e}"))?;
            if pending == 0 {
                break;
            }
        }
        if published.elapsed() >= Duration::from_millis(100) {
            output(
                json!({"type":"measurement","format":format,"frames":frames_total,"aggregate":aggregate.iter().map(Accumulator::levels).collect::<Vec<Levels>>(),"window":window.iter().map(Accumulator::levels).collect::<Vec<Levels>>(),"discontinuities":glitches,"timestampErrors":timestamp_errors,"elapsedMs":started.elapsed().as_millis() as u64,"engineConsumedFrames":if capture_mode { None } else { Some(crate::audio_signal::consumed_frames(frames_total, unsafe { stream.0.GetCurrentPadding() }.map_err(|e|format!("Read playback progress: {e}"))?)?) }}),
            )?;
            window = vec![Accumulator::default(); format.channels as usize];
            published = Instant::now();
        }
        std::thread::sleep(Duration::from_millis(10));
    }
    if !capture_mode && frames_total != format.sample_rate as u64 * 3 {
        return Err(
            "Playback submission: deadline expired before the full test signal was submitted"
                .into(),
        );
    }
    if !capture_mode
        && unsafe { stream.0.GetCurrentPadding() }
            .map_err(|e| format!("Final playback padding: {e}"))?
            > 0
    {
        return Err(
            "Drain playback buffer: queued frames remain after the bounded deadline".into(),
        );
    }
    output(session_volume(&stream.0))?;
    output(
        json!({"type":"measurement","format":format,"frames":frames_total,"aggregate":aggregate.iter().map(Accumulator::levels).collect::<Vec<Levels>>(),"window":window.iter().map(Accumulator::levels).collect::<Vec<Levels>>(),"discontinuities":glitches,"timestampErrors":timestamp_errors,"elapsedMs":started.elapsed().as_millis() as u64,"engineConsumedFrames":if capture_mode { None } else { Some(crate::audio_signal::consumed_frames(frames_total, unsafe { stream.0.GetCurrentPadding() }.map_err(|e|format!("Read playback progress: {e}"))?)?) }}),
    )?;
    output(
        json!({"type":"status","status":"completed","reason":"Bounded stream completed; physical function remains user-observed"}),
    )
}
pub fn mute_value(id: &str) -> Result<bool, String> {
    let _com = Apartment::new()?;
    let en = enumerator()?;
    let d = device(&en, id)?;
    let volume = volume(&d).ok_or("Endpoint mute control unavailable")?;
    unsafe { volume.GetMute() }
        .map(|b| b.as_bool())
        .map_err(|e| e.to_string())
}
pub fn change_mute(
    id: &str,
    expected: bool,
    desired: bool,
    owner: &crate::raw_input::OwnedProcess,
) -> Result<bool, String> {
    let _com = Apartment::new()?;
    let en = enumerator()?;
    let d = device(&en, id)?;
    if unsafe { d.GetState() }.map_err(|e| e.to_string())? != DEVICE_STATE_ACTIVE {
        return Err("Endpoint no longer active".into());
    }
    let volume = volume(&d).ok_or("Endpoint mute control unavailable")?;
    let before = unsafe { volume.GetMute() }
        .map_err(|e| e.to_string())?
        .as_bool();
    if before != expected {
        return Err("Mute state changed; prepare a fresh proposal".into());
    }
    if !owner.alive() {
        return Err("Approving app exited before setting change".into());
    }
    unsafe { volume.SetMute(desired, std::ptr::null()) }.map_err(|e| e.to_string())?;
    unsafe { volume.GetMute() }
        .map(|b| b.as_bool())
        .map_err(|e| e.to_string())
}
