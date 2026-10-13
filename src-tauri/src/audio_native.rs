//! Original Core Audio/WASAPI implementation, using Microsoft API bindings.
use crate::audio_metrics::{decode, encode, Accumulator, Levels};
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
        unsafe { CoInitializeEx(None, COINIT_MULTITHREADED) }
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
        json!({"endpoints":rows,"errors":errors,"complete":errors.is_empty(),"source":"Windows Core Audio","observedAt":chrono::Utc::now().to_rfc3339()}),
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
pub fn run(id: &str, mode: &str, parent: u32) -> Result<(), String> {
    let owner = crate::raw_input::verify_parent(parent)?;
    if !["left", "right", "tone", "ambient", "speech"].contains(&mode) {
        return Err("Unsupported audio mode".into());
    }
    if !foreground(parent) {
        return output(
            json!({"type":"status","status":"interrupted","reason":"Keep AnyDevice active before starting audio"}),
        );
    }
    let capture_mode = ["ambient", "speech"].contains(&mode);
    let _com = Apartment::new()?;
    let en = enumerator()?;
    let d = device(&en, id)?;
    if unsafe { d.GetState() }.map_err(|e| e.to_string())? != DEVICE_STATE_ACTIVE {
        return Err("Endpoint is not active".into());
    }
    let endpoint: IMMEndpoint = d.cast().map_err(|e| e.to_string())?;
    if unsafe { endpoint.GetDataFlow() }.map_err(|e| e.to_string())?
        != if capture_mode { eCapture } else { eRender }
    {
        return Err("Endpoint flow does not match this test".into());
    }
    let client: IAudioClient =
        unsafe { d.Activate(CLSCTX_ALL, None) }.map_err(|e| e.to_string())?;
    let (owned_format, format) = mix(&client)?;
    if !format.supported {
        return output(
            json!({"type":"status","status":"unsupported","reason":"Shared-mode sample format is not supported"}),
        );
    }
    if ["left", "right"].contains(&mode)
        && (format.channels != 2 || format.channel_mask != 0 && format.channel_mask != 3)
    {
        return output(
            json!({"type":"status","status":"unsupported","reason":"Left/right testing requires standard stereo channel mapping"}),
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
    .map_err(|e| e.to_string())?;
    let stream = Stream(client);
    let size = unsafe { stream.0.GetBufferSize() }.map_err(|e| e.to_string())?;
    if size > format.sample_rate * 2 {
        return Err("Audio buffer exceeds bounded size".into());
    }
    let capture = if capture_mode {
        Some(unsafe { stream.0.GetService::<IAudioCaptureClient>() }.map_err(|e| e.to_string())?)
    } else {
        None
    };
    let render = if !capture_mode {
        Some(unsafe { stream.0.GetService::<IAudioRenderClient>() }.map_err(|e| e.to_string())?)
    } else {
        None
    };
    unsafe { stream.0.Start() }.map_err(|e| e.to_string())?;
    output(
        json!({"type":"status","status":"running","reason":if capture_mode{"Temporary level measurement active; no audio samples retained"}else{"Quiet 3-second tone active; audibility requires your confirmation"}}),
    )?;
    let started = Instant::now();
    let mut published = Instant::now();
    let mut aggregate = vec![Accumulator::default(); format.channels as usize];
    let mut window = aggregate.clone();
    let mut frames_total = 0u64;
    let mut glitches = 0u32;
    let mut timestamp_errors = 0u32;
    let duration = if capture_mode { 8.0 } else { 3.0 };
    while started.elapsed().as_secs_f64() < duration {
        if !owner.alive() || !foreground(parent) {
            return output(
                json!({"type":"status","status":"interrupted","reason":"Audio stopped because AnyDevice lost focus or exited"}),
            );
        }
        if let Some(capture) = &capture {
            for _ in 0..256 {
                if unsafe { capture.GetNextPacketSize() }.map_err(|e| e.to_string())? == 0 {
                    break;
                }
                let mut data = std::ptr::null_mut();
                let mut frames = 0;
                let mut flags = 0;
                unsafe { capture.GetBuffer(&mut data, &mut frames, &mut flags, None, None) }
                    .map_err(|e| e.to_string())?;
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
                unsafe { stream.0.GetCurrentPadding() }.map_err(|e| e.to_string())?,
            );
            let remaining = (format.sample_rate as u64 * 3).saturating_sub(frames_total);
            let frames = available.min(remaining as u32);
            if frames > 0 {
                let data = unsafe { render.GetBuffer(frames) }.map_err(|e| e.to_string())?;
                if data.is_null() {
                    let _ = unsafe {
                        render.ReleaseBuffer(frames, AUDCLNT_BUFFERFLAGS_SILENT.0 as u32)
                    };
                    return Err("Render returned a null buffer".into());
                }
                let slice = unsafe {
                    std::slice::from_raw_parts_mut(
                        data,
                        frames as usize * format.block_align as usize,
                    )
                };
                let step = format.bits as usize / 8;
                let mut failure = None;
                for frame in 0..frames as usize {
                    let phase = (frames_total + frame as u64) as f64 / format.sample_rate as f64;
                    let envelope = (phase / 0.05).min(1.0) * ((3.0 - phase) / 0.05).clamp(0.0, 1.0);
                    let value = 0.03 * envelope * (std::f64::consts::TAU * 440.0 * phase).sin();
                    for ch in 0..format.channels as usize {
                        let sample = if mode == "left" && ch != 0 || mode == "right" && ch != 1 {
                            0.0
                        } else {
                            value
                        };
                        let offset = frame * format.block_align as usize + ch * step;
                        if let Err(e) =
                            encode(sample, &mut slice[offset..offset + step], format.float)
                        {
                            failure = Some(e);
                        }
                    }
                }
                let released =
                    unsafe { render.ReleaseBuffer(frames, 0) }.map_err(|e| e.to_string());
                released?;
                if let Some(e) = failure {
                    return Err(e);
                }
                frames_total += frames as u64;
            }
        }
        if published.elapsed() >= Duration::from_millis(100) {
            output(
                json!({"type":"measurement","format":format,"frames":frames_total,"aggregate":aggregate.iter().map(Accumulator::levels).collect::<Vec<Levels>>(),"window":window.iter().map(Accumulator::levels).collect::<Vec<Levels>>(),"discontinuities":glitches,"timestampErrors":timestamp_errors}),
            )?;
            window = vec![Accumulator::default(); format.channels as usize];
            published = Instant::now();
        }
        std::thread::sleep(Duration::from_millis(10));
    }
    output(
        json!({"type":"measurement","format":format,"frames":frames_total,"aggregate":aggregate.iter().map(Accumulator::levels).collect::<Vec<Levels>>(),"window":window.iter().map(Accumulator::levels).collect::<Vec<Levels>>(),"discontinuities":glitches,"timestampErrors":timestamp_errors}),
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
