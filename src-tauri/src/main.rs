#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod activity;
mod audio_metrics;
#[cfg(windows)]
mod audio_native;
mod audio_service;
mod audio_signal;
#[cfg(windows)]
mod hid_inspection;
mod input_service;
mod investigation_service;
#[cfg(windows)]
mod lighting_native;
#[cfg(windows)]
mod native;
#[cfg(windows)]
mod process_job;
#[cfg(windows)]
mod raw_input;
mod repair_service;
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
async fn scan_devices(
    state: tauri::State<'_, ScanState>,
    provider: Option<String>,
    scope: Option<String>,
) -> Result<Value, String> {
    if !cfg!(windows) {
        return Err("AnyDevice currently supports Windows only".into());
    }
    let provider = provider.as_deref().unwrap_or("windows-cfgmgr32");
    let scope = scope.as_deref().unwrap_or("usb-hid");
    if !["windows-cfgmgr32", "windows-pnp-fallback"].contains(&provider)
        || !["usb-hid", "all-pnp"].contains(&scope)
    {
        return Err("Unsupported discovery provider or scope".into());
    }
    if provider == "windows-pnp-fallback" && scope != "usb-hid" {
        return Err("The comparison fallback supports USB/HID only".into());
    }
    let token = CancellationToken::new();
    {
        let mut active = state.0.lock().map_err(|_| "Scan state unavailable")?;
        if active.is_some() {
            return Err("A scan is already running".into());
        }
        *active = Some(token.clone());
    }
    let result = if provider == "windows-cfgmgr32" {
        let executable = std::env::current_exe().map_err(|e| e.to_string());
        match executable {
            Ok(exe) => {
                let mut command = tokio::process::Command::new(exe);
                command.args(["--collect-native", scope]);
                run_adapter(command, token, std::time::Duration::from_secs(45)).await
            }
            Err(e) => Err(e),
        }
    } else {
        collect(token).await
    };
    if let Ok(mut active) = state.0.lock() {
        *active = None;
    }
    result
}

async fn collect(token: CancellationToken) -> Result<Value, String> {
    if !cfg!(windows) {
        return Err("AnyDevice currently supports Windows only".into());
    }
    let root = std::env::var_os("SystemRoot").ok_or("Windows system directory unavailable")?;
    let executable =
        std::path::PathBuf::from(root).join("System32/WindowsPowerShell/v1.0/powershell.exe");
    let mut command = tokio::process::Command::new(executable);
    command.args([
        "-NoLogo",
        "-NoProfile",
        "-NonInteractive",
        "-EncodedCommand",
        &encoded_script(),
    ]);
    run_adapter(command, token, std::time::Duration::from_secs(45)).await
}

async fn run_adapter(
    mut command: tokio::process::Command,
    token: CancellationToken,
    timeout: std::time::Duration,
) -> Result<Value, String> {
    command
        .kill_on_drop(true)
        .stdin(std::process::Stdio::null())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped());
    #[cfg(windows)]
    command.creation_flags(0x08000000); // CREATE_NO_WINDOW
    use tokio::io::AsyncReadExt;
    command.stderr(std::process::Stdio::null());
    let mut child = command
        .spawn()
        .map_err(|e| format!("Cannot start the fixed Windows discovery adapter: {e}"))?;
    #[cfg(windows)]
    let _job = match process_job::attach(child.id().ok_or("Collector PID unavailable")?) {
        Ok(job) => Some(job),
        Err(e) => {
            if child
                .try_wait()
                .map_err(|_| "Collector state unavailable")?
                .is_none()
            {
                let _ = child.kill().await;
                let _ = child.wait().await;
                return Err(e);
            } else {
                None
            }
        }
    };
    let stdout = child.stdout.take().ok_or("Collector output unavailable")?;
    let operation = async {
        let read = async {
            let mut bytes = Vec::new();
            stdout
                .take(16 * 1024 * 1024 + 1)
                .read_to_end(&mut bytes)
                .await
                .map_err(|e| e.to_string())?;
            if bytes.len() > 16 * 1024 * 1024 {
                return Err("Discovery response exceeded the safety limit".to_string());
            }
            Ok(bytes)
        };
        let wait = async { child.wait().await.map_err(|e| e.to_string()) };
        tokio::try_join!(read, wait)
    };
    let (bytes, status) = tokio::select! {
        _ = token.cancelled() => return Err("Scan cancelled; previous inventory retained".into()),
        result = tokio::time::timeout(timeout,operation) => result.map_err(|_|"Scan timed out; previous inventory retained")??
    };
    if !status.success() {
        return Err(
            "Windows discovery adapter failed. Check provider availability and local policy."
                .into(),
        );
    }
    let json: Value = serde_json::from_slice(&bytes)
        .map_err(|e| format!("Invalid Windows discovery response: {e}"))?;
    if (!json["devices"].is_array()
        && !json["endpoints"].is_array()
        && !(json["operation"] == "audio-mute" && json["afterMute"].is_boolean())
        && !["audio-readiness", "lighting-discovery"]
            .contains(&json["operation"].as_str().unwrap_or("")))
        || !json["errors"].is_array()
    {
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
    let valid = match value["schemaVersion"].as_str() {
        Some("diagnostic-engine-1.0") => {
            value["checks"].is_array()
                && value["audioEndpoints"].is_array()
                && value["audioSessions"].is_array()
                && value["repairs"].is_array()
        }
        Some("1.0") => value["devices"].is_array() && value["findings"].is_array(),
        Some("2.0") => {
            value["devices"].is_array()
                && value["findings"].is_array()
                && value["provenance"].is_object()
        }
        Some("investigation-1.0") => value["captures"].as_array().is_some_and(|captures| {
            !captures.is_empty()
                && captures.len() <= 8
                && captures.iter().all(|c| {
                    c["report"]["schemaVersion"] == "2.0" && c["annotation"]["source"] == "user"
                })
        }),
        Some("device-workbench-1.0") => {
            value["target"].is_object()
                && value["userReport"]["source"] == "user"
                && value["tests"].as_array().is_some_and(|t| {
                    t.len() <= 8
                        && t.iter()
                            .all(|s| s["stats"].is_object() && s.get("recent").is_none())
                })
        }
        Some("binary-analysis-1.0") => {
            value["source"]["length"]
                .as_u64()
                .is_some_and(|n| n > 0 && n <= 1024 * 1024)
                && value["annotations"]
                    .as_array()
                    .is_some_and(|a| a.len() <= 256)
        }
        _ => false,
    };
    if !valid {
        return Err("Unsupported or malformed evidence schema".into());
    }
    Ok(())
}

fn project_url(page: &str) -> Result<&'static str, String> {
    match page {
        "repository" => Ok("https://github.com/Aayush10016/AnyDevice"),
        "documentation" => Ok("https://github.com/Aayush10016/AnyDevice#documentation"),
        "license" => Ok("https://github.com/Aayush10016/AnyDevice/blob/main/LICENSE"),
        _ => Err("Unsupported project link".into()),
    }
}

#[tauri::command]
fn open_project_page(page: String) -> Result<(), String> {
    let url = project_url(&page)?;
    #[cfg(windows)]
    {
        #[link(name = "shell32")]
        extern "system" {
            fn ShellExecuteW(
                window: *mut std::ffi::c_void,
                operation: *const u16,
                file: *const u16,
                parameters: *const u16,
                directory: *const u16,
                show: i32,
            ) -> *mut std::ffi::c_void;
        }
        let file: Vec<u16> = url.encode_utf16().chain(Some(0)).collect();
        // The URL comes only from the fixed allowlist above; no metadata or user URL is accepted.
        let result = unsafe {
            ShellExecuteW(
                std::ptr::null_mut(),
                std::ptr::null(),
                file.as_ptr(),
                std::ptr::null(),
                std::ptr::null(),
                1,
            )
        };
        if result as isize <= 32 {
            return Err("Could not open the project link in your browser".into());
        }
        Ok(())
    }
    #[cfg(not(windows))]
    {
        let _ = url;
        Err("Project links require Windows".into())
    }
}

#[tauri::command]
async fn save_report(content: String) -> Result<Option<String>, String> {
    validate_report(&content)?;
    tauri::async_runtime::spawn_blocking(move || {
        let path = rfd::FileDialog::new()
            .set_title("Save AnyDevice evidence")
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
    #[cfg(windows)]
    {
        let args: Vec<String> = std::env::args().collect();
        if args.get(1).map(String::as_str) == Some("--verify-input-owner") {
            if args.len() != 3 {
                std::process::exit(2);
            }
            let verified = raw_input::verify_parent(args[2].parse().unwrap_or(0)).is_ok();
            println!("{}", serde_json::json!({"ownerVerified":verified}));
            std::process::exit(if verified { 0 } else { 3 });
        }
        if args.get(1).map(String::as_str) == Some("--input-owner-smoke") {
            if args.len() != 2 {
                std::process::exit(2);
            }
            use std::os::windows::process::CommandExt;
            let result = std::process::Command::new(std::env::current_exe().unwrap())
                .args(["--verify-input-owner", &std::process::id().to_string()])
                .creation_flags(0x08000000)
                .output();
            match result {
                Ok(output) => {
                    let valid = output.status.success()
                        && serde_json::from_slice::<Value>(&output.stdout)
                            .is_ok_and(|v| v["ownerVerified"] == true);
                    println!(
                        "{}",
                        serde_json::json!({"ownerVerified":valid,"inputCollected":false})
                    );
                    std::process::exit(if valid { 0 } else { 3 });
                }
                Err(_) => std::process::exit(3),
            }
        }
        if args.get(1).map(String::as_str) == Some("--approved-audio-mute") {
            if args.len() != 6
                || !["true", "false"].contains(&args[3].as_str())
                || !["true", "false"].contains(&args[4].as_str())
            {
                std::process::exit(2);
            }
            let owner = raw_input::verify_parent(args[5].parse().unwrap_or(0));
            let result = owner.and_then(|owner| {
                if !owner.alive() {
                    return Err("Approving app exited".into());
                }
                audio_native::change_mute(&args[2], args[3] == "true", args[4] == "true", &owner)
            });
            match result {
                Ok(after) => println!(
                    "{}",
                    serde_json::json!({"operation":"audio-mute","afterMute":after,"errors":[]})
                ),
                Err(_) => std::process::exit(3),
            }
            return;
        }
        if args.get(1).map(String::as_str) == Some("--inspect-audio") {
            if args.len() != 2 {
                std::process::exit(2);
            }
            match audio_native::inventory() {
                Ok(value) => println!("{value}"),
                Err(e) => println!(
                    "{}",
                    serde_json::json!({"endpoints":[],"errors":[e],"complete":false,"source":"Windows Core Audio","observedAt":chrono::Utc::now().to_rfc3339()})
                ),
            }
            return;
        }
        if args.get(1).map(String::as_str) == Some("--inspect-lamparray") {
            println!("{}", lighting_native::lamps());
            return;
        }
        if args.get(1).map(String::as_str) == Some("--inspect-lighting") {
            println!("{}", lighting_native::collect());
            return;
        }
        if args.get(1).map(String::as_str) == Some("--probe-audio") {
            if args.len() != 4 {
                std::process::exit(2);
            }
            println!("{}", audio_native::readiness(&args[2], &args[3]));
            return;
        }
        if args.get(1).map(String::as_str) == Some("--audio-test") {
            if args.len() != 5 {
                std::process::exit(2);
            }
            if let Err(reason) = audio_native::run(&args[2], &args[3], args[4].parse().unwrap_or(0))
            {
                use std::io::Write;
                // Broken consumer pipes must not turn a denied collector into a panic exit.
                let _ = writeln!(
                    std::io::stdout(),
                    "{}",
                    serde_json::json!({"type":"status","status":"failed","reason":reason})
                );
                std::process::exit(3);
            }
            return;
        }
        if args.get(1).map(String::as_str) == Some("--inspect-input") {
            match raw_input::inventory() {
                Ok(value) => println!("{value}"),
                Err(_) => std::process::exit(3),
            }
            return;
        }
        if args.get(1).map(String::as_str) == Some("--input-test") {
            if args.len() != 5 {
                std::process::exit(2);
            }
            let parent = args[4].parse::<u32>().unwrap_or(0);
            if let Err(reason) = raw_input::run(&args[2], &args[3], parent) {
                println!(
                    "{}",
                    serde_json::json!({"type":"status","status":"failed","reason":reason})
                );
                std::process::exit(3);
            }
            return;
        }
        if args.get(1).map(String::as_str) == Some("--collect-native") {
            let scope = args.get(2).map(String::as_str).unwrap_or("usb-hid");
            if args.len() != 3 || !["usb-hid", "all-pnp"].contains(&scope) {
                std::process::exit(2);
            }
            println!("{}", native::collect(scope));
            return;
        }
    }

    #[cfg(not(debug_assertions))]
    assert!(
        !tauri::is_dev(),
        "Production builds must embed their frontend and cannot use a development server"
    );
    tauri::Builder::default()
        .manage(ScanState::default())
        .manage(input_service::InputState::default())
        .manage(audio_service::AudioState::default())
        .manage(activity::Activity::default())
        .manage(repair_service::RepairState::default())
        .invoke_handler(tauri::generate_handler![
            repair_service::propose_audio_unmute,
            repair_service::execute_audio_repair,
            investigation_service::inspect_lighting,
            investigation_service::probe_audio,
            audio_service::inspect_audio,
            audio_service::start_audio_test,
            audio_service::audio_test_status,
            audio_service::stop_audio_test,
            audio_service::discard_audio_test,
            scan_devices,
            cancel_scan,
            save_report,
            open_project_page,
            input_service::inspect_input_devices,
            input_service::start_input_test,
            input_service::input_test_status,
            input_service::stop_input_test,
            input_service::discard_input_test
        ])
        .run(tauri::generate_context!())
        .expect("Unable to launch AnyDevice");
}

#[cfg(test)]
mod tests {
    use super::*;
    #[cfg(feature = "custom-protocol")]
    #[test]
    fn production_mode_uses_embedded_assets() {
        assert!(!tauri::is_dev());
    }
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
        assert!(validate_report(r#"{"schemaVersion":"99.0"}"#).is_err());
    }
    #[test]
    fn project_links_are_allowlisted() {
        assert_eq!(
            project_url("repository").unwrap(),
            "https://github.com/Aayush10016/AnyDevice"
        );
        assert!(project_url("https://untrusted.invalid").is_err());
    }
    #[cfg(windows)]
    fn test_command(script: &str) -> tokio::process::Command {
        let mut command = tokio::process::Command::new(
            std::path::PathBuf::from(std::env::var_os("SystemRoot").unwrap())
                .join("System32/WindowsPowerShell/v1.0/powershell.exe"),
        );
        command.args(["-NoProfile", "-NonInteractive", "-Command", script]);
        command
    }
    #[cfg(windows)]
    #[tokio::test]
    async fn cancelled_child_returns_no_inventory() {
        let token = CancellationToken::new();
        token.cancel();
        let result = run_adapter(
            test_command("Start-Sleep -Seconds 5"),
            token,
            std::time::Duration::from_secs(10),
        )
        .await;
        assert!(result.unwrap_err().contains("cancelled"));
    }
    #[cfg(windows)]
    #[tokio::test]
    async fn timed_out_child_returns_no_inventory() {
        let result = run_adapter(
            test_command("Start-Sleep -Seconds 5"),
            CancellationToken::new(),
            std::time::Duration::from_millis(20),
        )
        .await;
        assert!(result.unwrap_err().contains("timed out"));
    }
    #[cfg(windows)]
    #[tokio::test]
    async fn malformed_child_response_is_rejected() {
        let result = run_adapter(
            test_command("Write-Output '{invalid}'"),
            CancellationToken::new(),
            std::time::Duration::from_secs(45),
        )
        .await;
        assert!(result
            .unwrap_err()
            .contains("Invalid Windows discovery response"));
    }
    #[cfg(windows)]
    #[tokio::test]
    async fn failed_child_returns_no_inventory() {
        let result = run_adapter(
            test_command("exit 3"),
            CancellationToken::new(),
            std::time::Duration::from_secs(45),
        )
        .await;
        assert!(result.unwrap_err().contains("adapter failed"));
    }
    #[cfg(windows)]
    #[tokio::test]
    async fn service_unavailability_and_permission_denial_are_distinct() {
        for (failure, expected) in [
            (
                "throw 'Device serial AccessDenied is no longer available.'",
                "enumeration",
            ),
            (
                "throw 'Access to a CIM resource was not available to the client.'",
                "enumeration",
            ),
            (
                "throw [System.UnauthorizedAccessException]::new('Access denied.')",
                "permission",
            ),
        ] {
            // A synthetic provider failure inside a temporary child process; no real device changes.
            let script = format!(
                "function global:Import-Module {{ [CmdletBinding()] param([string]$Name) }}\nfunction global:Get-PnpDevice {{ {failure} }}\n{}",
                include_str!("../scripts/discover.ps1")
            );
            let result = run_adapter(
                test_command(&script),
                CancellationToken::new(),
                std::time::Duration::from_secs(45),
            )
            .await
            .unwrap();
            assert_eq!(result["complete"], false);
            assert_eq!(result["errors"][0]["kind"], expected);
        }
    }
}
