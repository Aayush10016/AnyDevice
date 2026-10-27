use serde_json::Value;
use tokio_util::sync::CancellationToken;
async fn probe(state: tauri::State<'_, crate::ScanState>, args: &[&str]) -> Result<Value, String> {
    let token = CancellationToken::new();
    {
        let mut active = state.0.lock().map_err(|_| "Discovery state unavailable")?;
        if active.is_some() {
            return Err("Another metadata scan is active".into());
        }
        *active = Some(token.clone());
    }
    let result = async {
        let mut command =
            tokio::process::Command::new(std::env::current_exe().map_err(|e| e.to_string())?);
        command.args(args);
        crate::run_adapter(command, token, std::time::Duration::from_secs(35)).await
    }
    .await;
    if let Ok(mut active) = state.0.lock() {
        *active = None;
    }
    result
}
#[tauri::command]
pub async fn probe_device(
    state: tauri::State<'_, crate::ScanState>,
    activity: tauri::State<'_, crate::activity::Activity>,
    target_id: String,
) -> Result<Value, String> {
    if target_id.is_empty()
        || target_id.encode_utf16().count() > 2048
        || target_id.chars().any(char::is_control)
    {
        return Err("Invalid device identity".into());
    }
    let _permit = activity.acquire()?;
    probe(state, &["--probe-device", &target_id]).await
}
#[tauri::command]
pub async fn inspect_lighting(state: tauri::State<'_, crate::ScanState>) -> Result<Value, String> {
    probe(state, &["--inspect-lighting"]).await
}
#[tauri::command]
pub async fn probe_audio(
    state: tauri::State<'_, crate::ScanState>,
    activity: tauri::State<'_, crate::activity::Activity>,
    target_id: String,
    kind: String,
) -> Result<Value, String> {
    if target_id.is_empty()
        || target_id.len() > 2048
        || target_id.contains('\0')
        || !["playback", "recording"].contains(&kind.as_str())
    {
        return Err("Invalid readiness target/kind".into());
    }
    let _permit = activity.acquire()?;
    probe(state, &["--probe-audio", &target_id, &kind]).await
}
