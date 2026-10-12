#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use base64::{engine::general_purpose::STANDARD, Engine};
use serde_json::Value;
use std::sync::Mutex;
use tokio_util::sync::CancellationToken;

#[derive(Default)]
struct ScanState(Mutex<Option<CancellationToken>>);

fn encoded_script() -> String {
    let bytes: Vec<u8> = include_str!("../scripts/discover.ps1")
        .encode_utf16()
        .flat_map(u16::to_le_bytes)
        .collect();
    STANDARD.encode(bytes)
}

#[tauri::command]
async fn scan_devices(state: tauri::State<'_, ScanState>) -> Result<Value, String> {
    let token = CancellationToken::new();
    {
        let mut active = state.0.lock().map_err(|_| "Scan state unavailable")?;
        if active.is_some() {
            return Err("A scan is already running".into());
        }
        *active = Some(token.clone());
    }
    let result = collect(token).await;
    if let Ok(mut active) = state.0.lock() {
        *active = None;
    }
    result
}

async fn collect(token: CancellationToken) -> Result<Value, String> {
    if !cfg!(windows) {
        return Err("USB Doctor v0.1 supports Windows only".into());
    }
    let root = std::env::var_os("SystemRoot").ok_or("Windows system directory unavailable")?;
    let executable =
        std::path::PathBuf::from(root).join("System32/WindowsPowerShell/v1.0/powershell.exe");
    let mut command = tokio::process::Command::new(executable);
    command
        .args([
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-EncodedCommand",
            &encoded_script(),
        ])
        .kill_on_drop(true)
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped());
    #[cfg(windows)]
    command.creation_flags(0x08000000); // CREATE_NO_WINDOW
    let child = command
        .spawn()
        .map_err(|e| format!("Cannot start the fixed Windows discovery adapter: {e}"))?;
    let output = tokio::select! {
        _ = token.cancelled() => return Err("Scan cancelled; previous inventory retained".into()),
        result = tokio::time::timeout(std::time::Duration::from_secs(45),child.wait_with_output()) =>
            result.map_err(|_| "Scan timed out after 45 seconds; previous inventory retained")?.map_err(|e|format!("Discovery process failed: {e}"))?
    };
    if !output.status.success() {
        return Err(
            "Windows discovery adapter failed. Check PnpDevice availability and local policy."
                .into(),
        );
    }
    if output.stdout.len() > 16 * 1024 * 1024 {
        return Err("Discovery response exceeded the safety limit".into());
    }
    let json: Value = serde_json::from_slice(&output.stdout)
        .map_err(|e| format!("Invalid Windows discovery response: {e}"))?;
    if !json["devices"].is_array() || !json["errors"].is_array() {
        return Err("Discovery response is incomplete".into());
    }
    Ok(json)
}

#[tauri::command]
fn cancel_scan(state: tauri::State<'_, ScanState>) {
    if let Ok(active) = state.0.lock() {
        if let Some(token) = active.as_ref() {
            token.cancel();
        }
    }
}

fn validate_report(content: &str) -> Result<(), String> {
    if content.len() > 20 * 1024 * 1024 {
        return Err("Report exceeds 20 MiB".into());
    }
    let value: Value = serde_json::from_str(content).map_err(|_| "Report is not valid JSON")?;
    if value["schemaVersion"] != "1.0"
        || !value["devices"].is_array()
        || !value["findings"].is_array()
    {
        return Err("Unsupported report schema".into());
    }
    Ok(())
}

#[tauri::command]
async fn save_report(content: String) -> Result<Option<String>, String> {
    validate_report(&content)?;
    tauri::async_runtime::spawn_blocking(move || {
        let path = rfd::FileDialog::new()
            .set_title("Save AnyDevice diagnostic report")
            .set_file_name("AnyDevice-report.json")
            .add_filter("JSON report", &["json"])
            .save_file();
        match path {
            None => Ok(None),
            Some(path) => {
                std::fs::write(&path, content)
                    .map_err(|e| format!("Could not save report: {e}"))?;
                Ok(Some(path.to_string_lossy().into_owned()))
            }
        }
    })
    .await
    .map_err(|e| e.to_string())?
}

fn main() {
    tauri::Builder::default()
        .manage(ScanState::default())
        .invoke_handler(tauri::generate_handler![
            scan_devices,
            cancel_scan,
            save_report
        ])
        .run(tauri::generate_context!())
        .expect("Unable to launch AnyDevice");
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn embedded_script_round_trips() {
        let bytes = STANDARD.decode(encoded_script()).unwrap();
        let units: Vec<u16> = bytes
            .chunks_exact(2)
            .map(|b| u16::from_le_bytes([b[0], b[1]]))
            .collect();
        assert_eq!(
            String::from_utf16(&units).unwrap(),
            include_str!("../scripts/discover.ps1")
        );
    }
    #[test]
    fn report_validation() {
        assert!(validate_report(r#"{"schemaVersion":"1.0","devices":[],"findings":[]}"#).is_ok());
        assert!(validate_report("garbage").is_err());
        assert!(validate_report(r#"{"schemaVersion":"2.0","devices":[],"findings":[]}"#).is_err());
    }
    #[tokio::test]
    async fn cancellation_is_observable() {
        let token = CancellationToken::new();
        token.cancel();
        token.cancelled().await;
        assert!(token.is_cancelled());
    }
}
