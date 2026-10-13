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
#[derive(Deserialize)]
#[serde(tag = "type", rename_all = "camelCase", deny_unknown_fields)]
enum Packet {
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
    },
}
fn apply(s: &mut Snapshot, p: Packet) -> Result<(), String> {
    match p {
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
        } => {
            if !(1..=8).contains(&format.channels)
                || !(8000..=384000).contains(&format.sample_rate)
                || frames > format.sample_rate as u64 * 10
                || aggregate.len() != format.channels as usize
                || window.len() != aggregate.len()
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
            s.timestamp_errors = timestamp_errors
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
        let result = stream(&owned, id, &target_id, &mode, cancel, &cleanup).await;
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
        ])
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::null())
        .kill_on_drop(true);
    #[cfg(windows)]
    command.creation_flags(0x08000000);
    let mut child = command
        .spawn()
        .map_err(|_| "Audio helper could not start")?;
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
            Err(_) => break Err("Audio pipe failed".into()),
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
                let packet = serde_json::from_slice(&pending)
                    .map_err(|_| "Malformed audio packet".to_string());
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
        return Err("Audio helper exited with an error".into());
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
    fn audio_packets_reject_stale_counts_invalid_levels_and_unbounded_channels() {
        let mut s = Snapshot::default();
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
                timestamp_errors: 0
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
