use crate::audio_metrics::Levels;
use serde::{Deserialize, Serialize};
use std::sync::{
    atomic::{AtomicU64, Ordering},
    Arc, Mutex,
};
use tokio_util::sync::CancellationToken;
#[derive(Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct AudioFormat {
    pub sample_rate: u32,
    pub channels: u16,
    pub bits: u16,
    pub float: bool,
    pub block_align: u16,
    pub channel_mask: u32,
    pub supported: bool,
}
#[derive(Clone, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Snapshot {
    pub session_id: u64,
    pub target_id: String,
    pub mode: String,
    pub status: String,
    pub reason: String,
    pub started_at: String,
    pub format: Option<AudioFormat>,
    pub frames: u64,
    pub engine_consumed_frames: Option<u64>,
    pub elapsed_ms: u64,
    pub signal_peak: Option<f64>,
    pub session_mute: Option<bool>,
    pub session_level: Option<f32>,
    pub session_volume_error: Option<String>,
    pub session_volume_observed_at: Option<String>,
    pub aggregate: Vec<Levels>,
    pub window: Vec<Levels>,
    pub discontinuities: u32,
    pub timestamp_errors: u32,
    pub cleanup: bool,
}
#[derive(Default, Clone)]
pub struct AudioState(Arc<Mutex<Inner>>);
#[derive(Default)]
struct Inner {
    snapshot: Option<Snapshot>,
    cancel: Option<CancellationToken>,
    interrupted: bool,
}
static NEXT: AtomicU64 = AtomicU64::new(1);
// Preserve a validated terminal failure packet when a helper exits nonzero.
// Otherwise the useful WASAPI stage/HRESULT would be overwritten by a generic
// process-exit message in start_audio_test's final snapshot update.
fn helper_exit_error(snapshot: Option<&Snapshot>) -> String {
    snapshot
        .filter(|s| s.status == "failed" && !s.reason.is_empty() && s.reason.len() <= 2048)
        .map(|s| s.reason.clone())
        .unwrap_or_else(|| "Audio helper exited with an error".into())
}
#[derive(Deserialize)]
#[serde(
    tag = "type",
    rename_all = "camelCase",
    rename_all_fields = "camelCase",
    deny_unknown_fields
)]
enum Packet {
    SessionVolume {
        mute: Option<bool>,
        level: Option<f32>,
        error: Option<String>,
    },
    Status {
        status: String,
        reason: String,
    },
    Measurement {
        format: AudioFormat,
        frames: u64,
        aggregate: Vec<Levels>,
        window: Vec<Levels>,
        discontinuities: u32,
        timestamp_errors: u32,
        #[serde(default)]
        engine_consumed_frames: Option<u64>,
        #[serde(default)]
        elapsed_ms: u64,
    },
}
fn decode_packet(bytes: &[u8]) -> Result<Packet, String> {
    serde_json::from_slice(bytes)
        .map_err(|e| format!("Decode audio measurement/status packet: {e}"))
}
fn apply(s: &mut Snapshot, p: Packet) -> Result<(), String> {
    match p {
        Packet::SessionVolume { mute, level, error } => {
            if level.is_some_and(|v| !v.is_finite() || !(0.0..=1.0).contains(&v))
                || error.as_ref().is_some_and(|e| e.len() > 2048)
                || (error.is_none() && (mute.is_none() || level.is_none()))
                || (error.is_some() && (mute.is_some() || level.is_some()))
            {
                return Err("Invalid session volume evidence".into());
            }
            s.session_mute = mute;
            s.session_level = level;
            s.session_volume_error = error;
            s.session_volume_observed_at = Some(chrono::Utc::now().to_rfc3339());
        }
        Packet::Status { status, reason } => {
            if ![
                "running",
                "completed",
                "interrupted",
                "unsupported",
                "failed",
            ]
            .contains(&status.as_str())
                || reason.len() > 2048
            {
                return Err("Invalid audio status".into());
            }
            s.status = status;
            s.reason = reason
        }
        Packet::Measurement {
            format,
            frames,
            aggregate,
            window,
            discontinuities,
            timestamp_errors,
            engine_consumed_frames,
            elapsed_ms,
        } => {
            if !(1..=8).contains(&format.channels)
                || !(8000..=384000).contains(&format.sample_rate)
                || frames > format.sample_rate as u64 * 10
                || aggregate.len() != format.channels as usize
                || window.len() != aggregate.len()
                || elapsed_ms > 12000
                || engine_consumed_frames.is_some_and(|n| n > frames)
                || frames < s.frames
                || aggregate.iter().chain(&window).any(|v| {
                    !v.rms.is_finite()
                        || !v.peak.is_finite()
                        || !v.rms_dbfs.is_finite()
                        || !(0.0..=1.0).contains(&v.clipping_proportion)
                        || !(0.0..=1.0).contains(&v.zero_proportion)
                        || v.samples > frames
                })
            {
                return Err("Invalid audio measurement".into());
            }
            s.format = Some(format);
            s.frames = frames;
            s.aggregate = aggregate;
            s.window = window;
            s.discontinuities = discontinuities;
            s.timestamp_errors = timestamp_errors;
            s.engine_consumed_frames = engine_consumed_frames;
            s.elapsed_ms = elapsed_ms
        }
    }
    Ok(())
}
pub async fn read_inventory() -> Result<serde_json::Value, String> {
    read_inventory_with_token(CancellationToken::new()).await
}
async fn read_inventory_with_token(token: CancellationToken) -> Result<serde_json::Value, String> {
    let mut command =
        tokio::process::Command::new(std::env::current_exe().map_err(|e| e.to_string())?);
    command.arg("--inspect-audio");
    let value = crate::run_adapter(command, token, std::time::Duration::from_secs(15)).await?;
    if !value["endpoints"].is_array() {
        return Err("Invalid audio inventory".into());
    }
    Ok(value)
}
#[tauri::command]
pub async fn inspect_audio(
    state: tauri::State<'_, crate::ScanState>,
) -> Result<serde_json::Value, String> {
    let token = CancellationToken::new();
    {
        let mut active = state.0.lock().map_err(|_| "Scan state unavailable")?;
        if active.is_some() {
            return Err("A metadata scan is already active".into());
        }
        *active = Some(token.clone());
    }
    let result = read_inventory_with_token(token).await;
    if let Ok(mut active) = state.0.lock() {
        *active = None;
    }
    result
}
#[tauri::command]
pub async fn start_audio_test(
    state: tauri::State<'_, AudioState>,
    activity: tauri::State<'_, crate::activity::Activity>,
    target_id: String,
    mode: String,
    approved: bool,
    signal_level: Option<String>,
) -> Result<u64, String> {
    if !approved {
        return Err("Explicit audio test approval is required".into());
    }
    if target_id.is_empty()
        || target_id.len() > 2048
        || target_id.contains('\0')
        || !["left", "right", "tone", "ambient", "speech"].contains(&mode.as_str())
    {
        return Err("Invalid audio target/mode".into());
    }
    let signal_level = signal_level.unwrap_or_else(|| "clearer".into());
    if !["veryQuiet", "clearer"].contains(&signal_level.as_str()) {
        return Err("Unsupported test signal level".into());
    }
    let permit = activity.acquire()?;
    let id = NEXT.fetch_add(1, Ordering::Relaxed);
    let cancel = CancellationToken::new();
    {
        let mut inner = state.0.lock().map_err(|_| "Audio state unavailable")?;
        if inner.cancel.is_some() || inner.snapshot.as_ref().is_some_and(|s| !s.cleanup) {
            return Err("Stop the current audio test first".into());
        }
        inner.snapshot = Some(Snapshot {
            session_id: id,
            target_id: target_id.clone(),
            mode: mode.clone(),
            signal_peak: if ["left", "right", "tone"].contains(&mode.as_str()) {
                Some(if signal_level == "veryQuiet" {
                    0.03
                } else {
                    0.10
                })
            } else {
                None
            },
            status: "starting".into(),
            started_at: chrono::Utc::now().to_rfc3339(),
            ..Default::default()
        });
        inner.cancel = Some(cancel.clone());
        inner.interrupted = false;
    }
    let owned = state.inner().clone();
    tokio::spawn(async move {
        let _permit = permit;
        let cleanup = std::sync::atomic::AtomicBool::new(true);
        let result = stream(
            &owned,
            id,
            &target_id,
            &mode,
            &signal_level,
            cancel,
            &cleanup,
        )
        .await;
        if let Ok(mut inner) = owned.0.lock() {
            let interrupted = inner.interrupted;
            if let Some(s) = inner.snapshot.as_mut().filter(|s| s.session_id == id) {
                if let Err(e) = result {
                    s.status = "failed".into();
                    s.reason = e;
                } else if interrupted {
                    s.status = "interrupted".into();
                    s.reason = "Stopped early or focus/navigation changed".into();
                } else if !["completed", "unsupported", "interrupted"].contains(&s.status.as_str())
                {
                    s.status = "failed".into();
                    s.reason = "Collector exited without terminal evidence".into();
                }
                s.cleanup = cleanup.load(Ordering::Acquire);
                inner.cancel = None;
            }
        }
    });
    Ok(id)
}
async fn stream(
    state: &AudioState,
    id: u64,
    target: &str,
    mode: &str,
    signal_level: &str,
    cancel: CancellationToken,
    cleanup: &std::sync::atomic::AtomicBool,
) -> Result<(), String> {
    use tokio::io::AsyncReadExt;
    let mut command =
        tokio::process::Command::new(std::env::current_exe().map_err(|e| e.to_string())?);
    command
        .args([
            "--audio-test",
            target,
            mode,
            &std::process::id().to_string(),
            signal_level,
        ])
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::null())
        .kill_on_drop(true);
    #[cfg(windows)]
    command.creation_flags(0x08000000);
    let mut child = command
        .spawn()
        .map_err(|e| format!("Start audio helper: {e}"))?;
    cleanup.store(false, Ordering::Release);
    let mut pipe = child
        .stdout
        .take()
        .ok_or("Audio helper has no observations")?;
    #[cfg(windows)]
    let _job = match crate::process_job::attach(child.id().ok_or("Audio PID unavailable")?) {
        Ok(job) => Some(job),
        Err(e) => {
            if child
                .try_wait()
                .map_err(|_| "Audio state unavailable")?
                .is_none()
            {
                let _ = child.kill().await;
                cleanup.store(child.wait().await.is_ok(), Ordering::Release);
                return Err(e);
            } else {
                None
            }
        }
    };
    let timeout = tokio::time::sleep(std::time::Duration::from_secs(15));
    tokio::pin!(timeout);
    let mut pending = Vec::new();
    let mut bytes = [0u8; 4096];
    let mut total = 0;
    let result = loop {
        let read = tokio::select! {_=cancel.cancelled()=>break Ok(()),_=&mut timeout=>break Err("Audio test timed out".into()),read=pipe.read(&mut bytes)=>read};
        let count = match read {
            Ok(n) => n,
            Err(e) => break Err(format!("Read audio helper pipe: {e}")),
        };
        if count == 0 {
            break if pending.is_empty() {
                Ok(())
            } else {
                Err("Truncated audio packet".into())
            };
        }
        total += count;
        if total > 2 * 1024 * 1024 {
            break Err("Audio observations exceed 2 MiB".into());
        }
        let mut failure = None;
        for byte in &bytes[..count] {
            if *byte == b'\n' {
                let packet = decode_packet(&pending);
                pending.clear();
                let applied = packet.and_then(|p| {
                    let mut inner = state.0.lock().map_err(|_| "Audio state unavailable")?;
                    apply(
                        inner
                            .snapshot
                            .as_mut()
                            .filter(|s| s.session_id == id)
                            .ok_or("Obsolete audio session")?,
                        p,
                    )
                });
                if let Err(e) = applied {
                    failure = Some(e);
                    break;
                }
            } else {
                pending.push(*byte);
                if pending.len() > 16384 {
                    failure = Some("Audio packet exceeds 16 KiB".into());
                    break;
                }
            }
        }
        if let Some(e) = failure {
            break Err(e);
        }
    };
    // EOF does not imply the process has exited. Let a completed collector exit
    // normally rather than racing its successful exit with TerminateProcess.
    let exit = if result.is_ok() && !cancel.is_cancelled() {
        match tokio::time::timeout(std::time::Duration::from_secs(2), child.wait()).await {
            Ok(exit) => exit.map_err(|_| "Audio helper cleanup failed")?,
            Err(_) => {
                let _ = child.kill().await;
                cleanup.store(child.wait().await.is_ok(), Ordering::Release);
                return Err("Audio helper did not exit after its observations".into());
            }
        }
    } else {
        let _ = child.kill().await;
        child
            .wait()
            .await
            .map_err(|_| "Audio helper cleanup failed")?
    };
    cleanup.store(true, Ordering::Release);
    if result.is_ok() && !cancel.is_cancelled() && !exit.success() {
        let inner = state.0.lock().map_err(|_| "Audio state unavailable")?;
        return Err(helper_exit_error(
            inner.snapshot.as_ref().filter(|s| s.session_id == id),
        ));
    }
    result
}
#[tauri::command]
pub fn audio_test_status(
    state: tauri::State<'_, AudioState>,
    session_id: u64,
) -> Result<Snapshot, String> {
    state
        .0
        .lock()
        .map_err(|_| "Audio state unavailable")?
        .snapshot
        .as_ref()
        .filter(|s| s.session_id == session_id)
        .cloned()
        .ok_or("Obsolete audio session".into())
}
#[tauri::command]
pub fn stop_audio_test(state: tauri::State<'_, AudioState>, session_id: u64) -> Result<(), String> {
    let mut inner = state.0.lock().map_err(|_| "Audio state unavailable")?;
    if !inner
        .snapshot
        .as_ref()
        .is_some_and(|s| s.session_id == session_id)
    {
        return Err("Obsolete audio session".into());
    }
    if let Some(token) = &inner.cancel {
        token.cancel();
        inner.interrupted = true;
    }
    Ok(())
}
#[tauri::command]
pub async fn discard_audio_test(
    state: tauri::State<'_, AudioState>,
    session_id: u64,
) -> Result<(), String> {
    for _ in 0..50 {
        {
            let mut inner = state.0.lock().map_err(|_| "Audio state unavailable")?;
            if !inner
                .snapshot
                .as_ref()
                .is_some_and(|s| s.session_id == session_id)
            {
                return Ok(());
            }
            if let Some(token) = &inner.cancel {
                token.cancel();
                inner.interrupted = true;
            } else {
                if inner.snapshot.as_ref().is_some_and(|s| !s.cleanup) {
                    return Err(
                        "Audio cleanup unverified; restart AnyDevice before another stream".into(),
                    );
                }
                inner.snapshot = None;
                return Ok(());
            }
        }
        tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    }
    Err("Audio cleanup not confirmed".into())
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn accepts_real_camel_case_measurement_wire_packets_and_rejects_unknown_fields() {
        let level = serde_json::json!({"samples":480,"rms":0.1,"rmsDbfs":-20.0,"peak":0.2,"clippingProportion":0.0,"zeroProportion":0.0,"invalidSamples":0});
        let mut wire = serde_json::json!({"type":"measurement","format":{"sampleRate":48000,"channels":1,"bits":32,"float":true,"blockAlign":4,"channelMask":0,"supported":true},"frames":480,"aggregate":[level.clone()],"window":[level],"discontinuities":0,"timestampErrors":0,"engineConsumedFrames":400,"elapsedMs":10});
        let packet = decode_packet(&serde_json::to_vec(&wire).unwrap())
            .expect("Actual helper wire format must parse");
        let mut snapshot = Snapshot::default();
        apply(&mut snapshot, packet).unwrap();
        assert_eq!(snapshot.frames, 480);
        assert_eq!(snapshot.engine_consumed_frames, Some(400));
        assert_eq!(snapshot.elapsed_ms, 10);
        wire["physicallyHeardFrames"] = serde_json::json!(480);
        let error = decode_packet(&serde_json::to_vec(&wire).unwrap())
            .err()
            .unwrap();
        assert!(error.contains("Decode audio measurement/status packet"));
        assert!(error.contains("physicallyHeardFrames"));
    }
    #[test]
    fn preserves_valid_terminal_native_failure_stage_only() {
        let mut snapshot = Snapshot {
            status: "failed".into(),
            reason: "Initialize shared stream: synthetic HRESULT 0x88890004".into(),
            ..Default::default()
        };
        assert!(helper_exit_error(Some(&snapshot)).starts_with("Initialize shared stream:"));
        snapshot.status = "running".into();
        assert_eq!(
            helper_exit_error(Some(&snapshot)),
            "Audio helper exited with an error"
        );
        snapshot.status = "failed".into();
        snapshot.reason = "x".repeat(2049);
        assert_eq!(
            helper_exit_error(Some(&snapshot)),
            "Audio helper exited with an error"
        );
        assert_eq!(helper_exit_error(None), "Audio helper exited with an error");
    }
    #[test]
    fn audio_packets_reject_stale_counts_invalid_levels_and_unbounded_channels() {
        let mut s = Snapshot::default();
        let level = Levels {
            samples: 1,
            rms: 0.1,
            rms_dbfs: -20.0,
            peak: 0.2,
            clipping_proportion: 0.0,
            zero_proportion: 0.0,
            invalid_samples: 0,
        };
        let packet = |frames, level: Levels| Packet::Measurement {
            format: AudioFormat {
                channels: 1,
                sample_rate: 48000,
                ..Default::default()
            },
            frames,
            aggregate: vec![level.clone()],
            window: vec![level],
            discontinuities: 0,
            timestamp_errors: 0,
            elapsed_ms: 0,
            engine_consumed_frames: None,
        };
        assert!(apply(&mut s, packet(10, level.clone())).is_ok());
        assert!(apply(&mut s, packet(9, level.clone())).is_err());
        let mut invalid = level.clone();
        invalid.rms = f64::NAN;
        assert!(apply(&mut s, packet(10, invalid)).is_err());
        let mut invalid = level;
        invalid.zero_proportion = 1.1;
        assert!(apply(&mut s, packet(10, invalid)).is_err());
        assert!(apply(
            &mut s,
            Packet::Measurement {
                format: AudioFormat {
                    channels: 99,
                    sample_rate: 48000,
                    ..Default::default()
                },
                frames: 1,
                aggregate: vec![],
                window: vec![],
                discontinuities: 0,
                timestamp_errors: 0,
                elapsed_ms: 0,
                engine_consumed_frames: None
            }
        )
        .is_err());
        assert!(apply(
            &mut s,
            Packet::Status {
                status: "good microphone".into(),
                reason: "fake".into()
            }
        )
        .is_err());
    }
}

#[cfg(test)]
mod session_volume_tests {
    use super::*;
    #[test]
    fn actual_session_volume_wire_is_bounded_and_cannot_reuse_old_success() {
        let mut snapshot = Snapshot::default();
        apply(
            &mut snapshot,
            decode_packet(br#"{"type":"sessionVolume","mute":true,"level":0.0,"error":null}"#)
                .unwrap(),
        )
        .unwrap();
        assert_eq!(snapshot.session_mute, Some(true));
        assert_eq!(snapshot.session_level, Some(0.0));
        apply(&mut snapshot, decode_packet(br#"{"type":"sessionVolume","mute":null,"level":null,"error":"Original API failure"}"#).unwrap()).unwrap();
        assert!(snapshot.session_mute.is_none());
        assert!(snapshot.session_level.is_none());
        assert_eq!(
            snapshot.session_volume_error.as_deref(),
            Some("Original API failure")
        );
        assert!(apply(
            &mut snapshot,
            decode_packet(br#"{"type":"sessionVolume","mute":false,"level":2.0,"error":null}"#)
                .unwrap()
        )
        .is_err());
        assert!(Snapshot::default().session_level.is_none());
    }
}
