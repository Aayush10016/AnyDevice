//! Explicit, short-lived input sessions. No text translation or persistent event storage.
use serde::{Deserialize, Serialize};
use std::{
    collections::{BTreeMap, BTreeSet, VecDeque},
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc, Mutex,
    },
};
use tokio::io::AsyncReadExt;
use tokio_util::sync::CancellationToken;

#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(tag = "kind", rename_all = "camelCase", deny_unknown_fields)]
pub enum InputEvent {
    MouseMove {
        at: String,
        x: i32,
        y: i32,
        absolute: bool,
    },
    MouseButton {
        at: String,
        button: u8,
        down: bool,
    },
    MouseWheel {
        at: String,
        axis: String,
        delta: i16,
    },
    Key {
        at: String,
        vk: u16,
        scan: u16,
        flags: u16,
        down: bool,
    },
}
#[derive(Deserialize)]
#[serde(tag = "type", rename_all = "camelCase", deny_unknown_fields)]
enum Packet {
    Status { status: String, reason: String },
    Event { event: InputEvent },
}
#[derive(Clone, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct KeyCount {
    pub down: u64,
    pub up: u64,
    pub repeat: u64,
    pub held: bool,
}
#[derive(Clone, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Stats {
    #[serde(skip)]
    held_scans: BTreeSet<(u16, u16, u16)>,
    pub events: u64,
    pub movements: u64,
    pub x: i64,
    pub y: i64,
    pub absolute: bool,
    pub buttons: BTreeMap<u8, KeyCount>,
    pub keys: BTreeMap<u16, KeyCount>,
    pub wheel_up: u64,
    pub wheel_down: u64,
    pub horizontal: u64,
}
impl Stats {
    fn observe(&mut self, event: &InputEvent) {
        self.events += 1;
        match event {
            InputEvent::MouseMove { x, y, absolute, .. } => {
                self.movements += 1;
                self.absolute = *absolute;
                if *absolute {
                    self.x = i64::from(*x);
                    self.y = i64::from(*y);
                } else {
                    self.x += i64::from(*x);
                    self.y += i64::from(*y);
                }
            }
            InputEvent::MouseButton { button, down, .. } => {
                update(self.buttons.entry(*button).or_default(), *down)
            }
            InputEvent::Key {
                vk,
                scan,
                flags,
                down,
                ..
            } => {
                let identity = (*vk, *scan, *flags & 6);
                let key = self.keys.entry(*vk).or_default();
                if *down {
                    if self.held_scans.insert(identity) {
                        key.down += 1;
                    } else {
                        key.repeat += 1;
                    }
                } else {
                    self.held_scans.remove(&identity);
                    key.up += 1;
                }
                key.held = self.held_scans.iter().any(|(code, _, _)| code == vk);
            }
            InputEvent::MouseWheel { axis, delta, .. } => {
                if axis == "horizontal" {
                    self.horizontal += 1;
                } else if *delta > 0 {
                    self.wheel_up += 1;
                } else if *delta < 0 {
                    self.wheel_down += 1;
                }
            }
        }
    }
    fn release(&mut self) {
        self.held_scans.clear();
        for key in self.keys.values_mut().chain(self.buttons.values_mut()) {
            key.held = false;
        }
    }
}
fn update(key: &mut KeyCount, down: bool) {
    if down {
        if key.held {
            key.repeat += 1;
        } else {
            key.down += 1;
        }
    } else {
        key.up += 1;
    }
    key.held = down;
}
#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Snapshot {
    pub session_id: u64,
    pub target_id: String,
    pub mode: String,
    pub status: String,
    pub reason: String,
    pub started_at: String,
    pub stats: Stats,
    pub recent: VecDeque<InputEvent>,
    pub history_truncated: bool,
    pub cleanup: bool,
}
#[derive(Default, Clone)]
pub struct InputState(Arc<Mutex<Inner>>);
#[derive(Default)]
struct Inner {
    snapshot: Option<Snapshot>,
    cancel: Option<CancellationToken>,
    stop_reason: Option<String>,
}
static NEXT: AtomicU64 = AtomicU64::new(1);
fn lock(state: &InputState) -> Result<std::sync::MutexGuard<'_, Inner>, String> {
    state.0.lock().map_err(|_| "Input state unavailable".into())
}
fn acceptable(event: &InputEvent, mode: &str) -> bool {
    match event {
        InputEvent::MouseButton { button, .. } => mode == "mouse" && (1..=5).contains(button),
        InputEvent::MouseMove { .. } => mode == "mouse",
        InputEvent::MouseWheel { axis, .. } => {
            mode == "mouse" && ["vertical", "horizontal"].contains(&axis.as_str())
        }
        InputEvent::Key { vk, flags, .. } => {
            mode != "mouse" && *vk < 255 && *flags <= 7 && (mode != "x-key" || *vk == 0x58)
        }
    }
}
fn apply(snapshot: &mut Snapshot, packet: Packet) -> Result<(), String> {
    match packet {
        Packet::Event { event } => {
            if !acceptable(&event, &snapshot.mode) {
                return Err("Unexpected event type".into());
            }
            snapshot.stats.observe(&event);
            if snapshot.recent.len() == 128 {
                snapshot.recent.pop_front();
                snapshot.history_truncated = true;
            }
            snapshot.recent.push_back(event);
            snapshot.status = "eventsObserved".into();
        }
        Packet::Status { status, reason } => {
            if ![
                "testing",
                "completed",
                "disconnected",
                "unsupported",
                "failed",
                "focusLost",
            ]
            .contains(&status.as_str())
                || reason.len() > 256
            {
                return Err("Invalid input status".into());
            }
            snapshot.status = status;
            snapshot.reason = reason;
        }
    }
    Ok(())
}
#[tauri::command]
pub async fn inspect_input_devices() -> Result<serde_json::Value, String> {
    #[cfg(windows)]
    {
        let mut command = tokio::process::Command::new(
            std::env::current_exe().map_err(|_| "Executable unavailable")?,
        );
        command
            .arg("--inspect-input")
            .stdin(std::process::Stdio::null())
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::null())
            .kill_on_drop(true)
            .creation_flags(0x08000000);
        let mut child = command
            .spawn()
            .map_err(|_| "Input inspection could not start")?;
        let output = child
            .stdout
            .take()
            .ok_or("Input inspection output unavailable")?;
        let result = tokio::time::timeout(std::time::Duration::from_secs(20), async {
            let mut bytes = Vec::new();
            output
                .take(2 * 1024 * 1024 + 1)
                .read_to_end(&mut bytes)
                .await
                .map_err(|_| "Input inspection stream failed")?;
            if bytes.len() > 2 * 1024 * 1024 {
                return Err("Input inventory exceeded 2 MiB".into());
            }
            let exit = child
                .wait()
                .await
                .map_err(|_| "Input inspection cleanup failed")?;
            if !exit.success() {
                return Err("Input inspection failed or reached its evidence limits".into());
            }
            serde_json::from_slice(&bytes).map_err(|_| "Invalid input inspection response".into())
        })
        .await
        .map_err(|_| "Input inspection timed out")?;
        result
    }
    #[cfg(not(windows))]
    {
        Err("Windows Raw Input is unsupported on this OS".into())
    }
}
#[tauri::command]
pub async fn start_input_test(
    state: tauri::State<'_, InputState>,
    target_id: String,
    mode: String,
) -> Result<u64, String> {
    if !cfg!(windows) {
        return Err("Windows input testing is unsupported on this OS".into());
    }
    if target_id.is_empty()
        || target_id.len() > 8192
        || target_id.contains('\0')
        || !["mouse", "keyboard", "x-key"].contains(&mode.as_str())
    {
        return Err("Invalid input-test target or mode".into());
    }
    let id = NEXT.fetch_add(1, Ordering::Relaxed);
    let cancel = CancellationToken::new();
    {
        let mut inner = lock(&state)?;
        if inner.cancel.is_some() {
            return Err("Stop the active input test first".into());
        }
        inner.snapshot = Some(Snapshot {
            session_id: id,
            target_id: target_id.clone(),
            mode: mode.clone(),
            status: "testing".into(),
            reason: "Starting selected-device registration".into(),
            started_at: chrono::Utc::now().to_rfc3339(),
            stats: Stats::default(),
            recent: VecDeque::new(),
            history_truncated: false,
            cleanup: false,
        });
        inner.cancel = Some(cancel.clone());
        inner.stop_reason = None;
    }
    let owned = state.inner().clone();
    tokio::spawn(async move {
        let outcome = stream(&owned, id, &target_id, &mode, cancel).await;
        if let Ok(mut inner) = lock(&owned) {
            let stopped = inner.stop_reason.take();
            if let Some(snapshot) = inner.snapshot.as_mut().filter(|s| s.session_id == id) {
                finalize(snapshot, outcome, stopped);
                inner.cancel = None;
            }
        }
    });
    Ok(id)
}
fn finalize(snapshot: &mut Snapshot, outcome: Result<(), String>, stopped: Option<String>) {
    if let Err(reason) = outcome {
        snapshot.status = "failed".into();
        snapshot.reason = reason;
    } else if ["testing", "eventsObserved"].contains(&snapshot.status.as_str()) {
        snapshot.status = if snapshot.stats.events == 0 {
            "noEventsObserved"
        } else {
            "completed"
        }
        .into();
        snapshot.reason = "Session stopped; absence of events is inconclusive".into();
    }
    if snapshot.status == "completed" && snapshot.stats.events == 0 {
        snapshot.status = "noEventsObserved".into();
    }
    if let Some(reason) = stopped {
        snapshot.status = if reason == "focusLost" {
            "focusLost"
        } else {
            "cancelled"
        }
        .into();
        snapshot.reason = format!("Session interrupted: {reason}");
    }
    snapshot.cleanup = true;
    snapshot.stats.release();
}
async fn stream(
    state: &InputState,
    id: u64,
    target: &str,
    mode: &str,
    cancel: CancellationToken,
) -> Result<(), String> {
    let mut command = tokio::process::Command::new(
        std::env::current_exe().map_err(|_| "Executable unavailable")?,
    );
    command.args([
        "--input-test",
        target,
        mode,
        &std::process::id().to_string(),
    ]);
    command
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::null())
        .kill_on_drop(true);
    #[cfg(windows)]
    command.creation_flags(0x08000000);
    let mut child = command
        .spawn()
        .map_err(|_| "Input collector could not start")?;
    let mut output = child.stdout.take().ok_or("Input collector has no output")?;
    let timeout = tokio::time::sleep(std::time::Duration::from_secs(125));
    tokio::pin!(timeout);
    let mut pending = Vec::new();
    let mut chunk = [0u8; 4096];
    let mut total = 0usize;
    let result = loop {
        let read = tokio::select! {
            _=cancel.cancelled()=>break Ok(()),
            _=&mut timeout=>break Err("Input session timed out".into()),
            value=output.read(&mut chunk)=>value,
        };
        let count = match read {
            Ok(n) => n,
            Err(_) => break Err("Input stream failed".into()),
        };
        if count == 0 {
            break if pending.is_empty() {
                Ok(())
            } else {
                Err("Truncated input stream".into())
            };
        }
        total += count;
        if total > 8 * 1024 * 1024 {
            break Err("Input session exceeded 8 MiB".into());
        }
        let mut failure = None;
        for byte in &chunk[..count] {
            if *byte == b'\n' {
                let packet = serde_json::from_slice::<Packet>(&pending)
                    .map_err(|_| "Malformed input event".to_string());
                pending.clear();
                let applied = packet.and_then(|p| {
                    let mut inner = lock(state)?;
                    apply(
                        inner
                            .snapshot
                            .as_mut()
                            .filter(|s| s.session_id == id)
                            .ok_or("Obsolete session")?,
                        p,
                    )
                });
                if let Err(e) = applied {
                    failure = Some(e);
                    break;
                }
            } else {
                pending.push(*byte);
                if pending.len() > 8192 {
                    failure = Some("Input frame exceeded 8 KiB".into());
                    break;
                }
            }
        }
        if let Some(e) = failure {
            break Err(e);
        }
    };
    // Explicit kill+wait: status cleanup is true only after this collector has exited.
    let _ = child.kill().await;
    let waited = child
        .wait()
        .await
        .map_err(|_| "Input collector cleanup failed".to_string());
    let exit = waited?;
    if result.is_ok() && !cancel.is_cancelled() && !exit.success() {
        return Err("Input collector exited unexpectedly".into());
    }
    result
}
#[tauri::command]
pub fn input_test_status(
    state: tauri::State<'_, InputState>,
    session_id: u64,
) -> Result<Snapshot, String> {
    lock(&state)?
        .snapshot
        .as_ref()
        .filter(|s| s.session_id == session_id)
        .cloned()
        .ok_or("Input session unavailable".into())
}
#[tauri::command]
pub fn stop_input_test(
    state: tauri::State<'_, InputState>,
    session_id: u64,
    reason: Option<String>,
) -> Result<(), String> {
    if reason
        .as_deref()
        .is_some_and(|r| !["focusLost", "navigation", "reset"].contains(&r))
    {
        return Err("Invalid stop reason".into());
    }
    let mut inner = lock(&state)?;
    if inner
        .snapshot
        .as_ref()
        .is_some_and(|s| s.session_id == session_id)
    {
        if let Some(cancel) = &inner.cancel {
            cancel.cancel();
            if reason.is_some() {
                inner.stop_reason = reason;
            }
        }
        Ok(())
    } else {
        Err("Obsolete input session".into())
    }
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn interruption_survives_last_queued_event_and_clears_held_state() {
        for cause in ["focusLost", "navigation", "reset"] {
            let mut snapshot = Snapshot {
                session_id: 1,
                target_id: "synthetic".into(),
                mode: "keyboard".into(),
                status: "testing".into(),
                reason: String::new(),
                started_at: "synthetic".into(),
                stats: Stats::default(),
                recent: VecDeque::new(),
                history_truncated: false,
                cleanup: false,
            };
            apply(
                &mut snapshot,
                Packet::Event {
                    event: InputEvent::Key {
                        at: "synthetic".into(),
                        vk: 88,
                        scan: 45,
                        flags: 0,
                        down: true,
                    },
                },
            )
            .unwrap();
            finalize(&mut snapshot, Ok(()), Some(cause.into()));
            assert_eq!(
                snapshot.status,
                if cause == "focusLost" {
                    "focusLost"
                } else {
                    "cancelled"
                }
            );
            assert!(snapshot.cleanup);
            assert!(!snapshot.stats.keys[&88].held);
            assert_eq!(snapshot.stats.keys[&88].down, 1);
        }
    }
    #[test]
    fn same_virtual_key_distinct_scans_do_not_suppress_down_transitions() {
        let mut s = Stats::default();
        for (flags, down) in [(0, true), (2, true), (3, false)] {
            s.observe(&InputEvent::Key {
                at: "synthetic".into(),
                vk: 13,
                scan: 28,
                flags,
                down,
            });
        }
        assert_eq!(s.keys[&13].down, 2);
        assert_eq!(s.keys[&13].repeat, 0);
        assert!(s.keys[&13].held);
        s.observe(&InputEvent::Key {
            at: "synthetic".into(),
            vk: 13,
            scan: 28,
            flags: 1,
            down: false,
        });
        assert_eq!(s.keys[&13].up, 2);
        assert!(!s.keys[&13].held);
        s.release();
        assert!(s.held_scans.is_empty());
    }
    #[test]
    fn rapid_pairs_repeats_and_simultaneous_keys_retain_exact_counts() {
        let mut s = Stats::default();
        for _ in 0..5000 {
            for (vk, scan, down) in [
                (88, 45, true),
                (65, 30, true),
                (88, 45, true),
                (88, 45, false),
                (65, 30, false),
            ] {
                s.observe(&InputEvent::Key {
                    at: "synthetic".into(),
                    vk,
                    scan,
                    flags: if down { 0 } else { 1 },
                    down,
                });
            }
        }
        assert_eq!(s.keys[&88].down, 5000);
        assert_eq!(s.keys[&88].up, 5000);
        assert_eq!(s.keys[&88].repeat, 5000);
        assert_eq!(s.keys[&65].down, 5000);
        assert_eq!(s.events, 25000);
        assert!(!s.keys[&88].held);
        s.release();
        s.observe(&InputEvent::Key {
            at: "synthetic".into(),
            vk: 88,
            scan: 45,
            flags: 0,
            down: true,
        });
        assert_eq!(s.keys[&88].down, 5001);
    }
    #[test]
    fn repeats_do_not_count_as_physical_attempts() {
        let mut s = Stats::default();
        let e = InputEvent::Key {
            at: "synthetic".into(),
            vk: 88,
            scan: 45,
            flags: 0,
            down: true,
        };
        s.observe(&e);
        s.observe(&e);
        assert_eq!(s.keys[&88].down, 1);
        assert_eq!(s.keys[&88].repeat, 1);
        s.release();
        assert!(!s.keys[&88].held);
    }
    #[test]
    fn modes_reject_unselected_key_and_mouse_events() {
        let e = InputEvent::Key {
            at: "synthetic".into(),
            vk: 65,
            scan: 30,
            flags: 0,
            down: true,
        };
        assert!(!acceptable(&e, "x-key"));
        assert!(!acceptable(&e, "mouse"));
        assert!(acceptable(&e, "keyboard"));
    }
    #[test]
    fn wheel_direction_and_absolute_motion_are_distinct() {
        let mut s = Stats::default();
        s.observe(&InputEvent::MouseWheel {
            at: "synthetic".into(),
            axis: "vertical".into(),
            delta: -120,
        });
        s.observe(&InputEvent::MouseMove {
            at: "synthetic".into(),
            x: 500,
            y: 200,
            absolute: true,
        });
        assert_eq!(s.wheel_down, 1);
        assert_eq!(s.x, 500);
    }
    #[test]
    fn bounds_history_while_retaining_aggregate_counts() {
        let mut snapshot = Snapshot {
            session_id: 1,
            target_id: "synthetic".into(),
            mode: "mouse".into(),
            status: "testing".into(),
            reason: String::new(),
            started_at: "synthetic".into(),
            stats: Stats::default(),
            recent: VecDeque::new(),
            history_truncated: false,
            cleanup: false,
        };
        for _ in 0..200 {
            apply(
                &mut snapshot,
                Packet::Event {
                    event: InputEvent::MouseMove {
                        at: "synthetic".into(),
                        x: 1,
                        y: 2,
                        absolute: false,
                    },
                },
            )
            .unwrap();
        }
        assert_eq!(snapshot.recent.len(), 128);
        assert_eq!(snapshot.stats.movements, 200);
        assert!(snapshot.history_truncated);
    }
}

#[tauri::command]
pub async fn discard_input_test(
    state: tauri::State<'_, InputState>,
    session_id: u64,
) -> Result<(), String> {
    {
        let inner = lock(&state)?;
        if !inner
            .snapshot
            .as_ref()
            .is_some_and(|s| s.session_id == session_id)
        {
            return Ok(());
        }
        if let Some(token) = &inner.cancel {
            token.cancel();
        }
    }
    for _ in 0..50 {
        {
            let mut inner = lock(&state)?;
            if !inner
                .snapshot
                .as_ref()
                .is_some_and(|s| s.session_id == session_id)
            {
                return Ok(());
            }
            if inner.cancel.is_none() {
                inner.snapshot = None;
                return Ok(());
            }
        }
        tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    }
    Err("Input collector cleanup has not completed".into())
}
