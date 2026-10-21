//! Discovery only. No LampArray object is opened and no control property is set.
use base64::{engine::general_purpose::STANDARD, Engine};
use serde_json::{json, Value};
use windows::{
    Devices::{Enumeration::DeviceInformation, Lights::LampArray},
    Win32::System::WinRT::{RoInitialize, RoUninitialize, RO_INIT_MULTITHREADED},
};
struct Runtime;
impl Drop for Runtime {
    fn drop(&mut self) {
        unsafe { RoUninitialize() }
    }
}
pub fn lamps() -> Value {
    let mut errors = Vec::<String>::new();
    let mut interfaces = Vec::<Value>::new();
    let lamps = (|| -> windows::core::Result<()> {
        unsafe { RoInitialize(RO_INIT_MULTITHREADED) }?;
        let _runtime = Runtime;
        let selector = LampArray::GetDeviceSelector()?;
        let rows = DeviceInformation::FindAllAsyncAqsFilter(&selector)?.join()?;
        let count = rows.Size()?;
        if count > 64 {
            errors.push("LampArray enumeration truncated to 64 interfaces".into());
        }
        for i in 0..count.min(64) {
            let row = rows.GetAt(i)?;
            interfaces.push(json!({"id":row.Id()?.to_string(),"name":row.Name()?.to_string(),"enabled":row.IsEnabled()?,"controlValidated":false}));
        }
        Ok(())
    })();
    let lamp_complete = lamps.is_ok();
    if let Err(e) = lamps {
        errors.push(format!("LampArray selector enumeration: {e}"));
    }
    json!({"interfaces":interfaces,"complete":lamp_complete && errors.is_empty(),"errors":errors})
}

// Keep WinRT discovery failures from discarding unrelated CIM/PnP evidence.
fn lamp_result(code: Option<i32>, bytes: &[u8]) -> Result<Value, String> {
    if code != Some(0) {
        return Err(format!("LampArray helper failed with Windows exit code {}; interface absence cannot be concluded", code.map(|v| format!("0x{:08X}", v as u32)).unwrap_or_else(|| "unavailable".into())));
    }
    if bytes.len() > 256 * 1024 {
        return Err("LampArray helper exceeded output bound".into());
    }
    let result: Value =
        serde_json::from_slice(bytes).map_err(|e| format!("LampArray helper data: {e}"))?;
    if !result["complete"].is_boolean()
        || !result["interfaces"].is_array()
        || result["interfaces"].as_array().unwrap().len() > 64
        || !result["errors"].is_array()
    {
        return Err("LampArray helper returned an invalid envelope".into());
    }
    Ok(result)
}
fn isolated_lamps() -> Result<Value, String> {
    use std::{
        io::Read,
        os::windows::process::CommandExt,
        process::{Command, Stdio},
        time::{Duration, Instant},
    };
    let exe = std::env::current_exe().map_err(|e| format!("LampArray executable: {e}"))?;
    let mut child = Command::new(exe)
        .arg("--inspect-lamparray")
        .creation_flags(0x08000000)
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|e| format!("LampArray helper start: {e}"))?;
    let pipe = child
        .stdout
        .take()
        .ok_or("LampArray helper stdout unavailable")?;
    let reader = std::thread::spawn(move || {
        let mut bytes = Vec::new();
        pipe.take(256 * 1024 + 1)
            .read_to_end(&mut bytes)
            .map(|_| bytes)
    });
    let started = Instant::now();
    let status = loop {
        match child.try_wait() {
            Ok(Some(status)) => break Ok(status),
            Ok(None) if started.elapsed() < Duration::from_secs(8) => {
                std::thread::sleep(Duration::from_millis(20))
            }
            result => {
                let _ = child.kill();
                let _ = child.wait();
                break Err(match result { Err(e) => format!("LampArray helper wait: {e}"), _ => "LampArray helper timed out after 8 seconds; interface absence cannot be concluded".into() });
            }
        }
    };
    let bytes = reader
        .join()
        .map_err(|_| "LampArray pipe reader failed")?
        .map_err(|e| format!("LampArray helper output: {e}"))?;
    lamp_result(status?.code(), &bytes)
}
pub fn collect() -> Value {
    let mut errors = Vec::<String>::new();
    let (interfaces, lamp_complete) = match isolated_lamps() {
        Ok(result) => {
            errors.extend(
                result["errors"]
                    .as_array()
                    .unwrap()
                    .iter()
                    .filter_map(Value::as_str)
                    .map(str::to_owned),
            );
            (
                result["interfaces"].as_array().unwrap().clone(),
                result["complete"] == true,
            )
        }
        Err(error) => {
            errors.push(error);
            (Vec::new(), false)
        }
    };
    let script = include_str!("../scripts/lighting-system.ps1");
    let encoded = STANDARD.encode(
        script
            .encode_utf16()
            .flat_map(u16::to_le_bytes)
            .collect::<Vec<_>>(),
    );
    let system = std::env::var_os("SystemRoot")
        .ok_or("Windows system directory unavailable")
        .and_then(|root| {
            use std::os::windows::process::CommandExt;
            let path = std::path::PathBuf::from(root)
                .join("System32/WindowsPowerShell/v1.0/powershell.exe");
            std::process::Command::new(path)
                .args([
                    "-NoLogo",
                    "-NoProfile",
                    "-NonInteractive",
                    "-EncodedCommand",
                    &encoded,
                ])
                .creation_flags(0x08000000)
                .output()
                .map_err(|_| "Fixed CIM helper could not start")
        });
    let system: Value = match system {
        Ok(out) if out.status.success() && out.stdout.len() <= 256 * 1024 => {
            match serde_json::from_slice(&out.stdout) {
                Ok(v) => v,
                Err(_) => {
                    errors.push("CIM helper returned malformed data".into());
                    Value::Null
                }
            }
        }
        _ => {
            errors.push("CIM discovery unavailable or exceeded output bound".into());
            Value::Null
        }
    };
    if let Some(list) = system["errors"].as_array() {
        errors.extend(
            list.iter()
                .filter_map(Value::as_str)
                .map(|s| s.chars().take(2048).collect()),
        );
    }
    let inventory = crate::native::collect("all-pnp");
    let nodes: Vec<_> = inventory["devices"]
        .as_array()
        .into_iter()
        .flatten()
        .filter(|d| {
            let category = d["category"].as_str().unwrap_or("");
            let id = d["instanceId"].as_str().unwrap_or("");
            matches!(category, "Keyboard" | "HIDClass") || id.starts_with("ACPI\\")
        })
        .take(128)
        .cloned()
        .collect();
    if inventory["complete"] != true {
        errors.push("Supporting PnP discovery was incomplete".into());
    }
    json!({"operation":"lighting-discovery","observedAt":chrono::Utc::now().to_rfc3339(),"lampEnumerationComplete":lamp_complete,"interfaces":interfaces,"systemEvidence":system,"nodes":nodes,"errors":errors,"complete":errors.is_empty(),"physicalIlluminationVerified":false,"controlOperations":[],"methods":["Windows LampArray selector / DeviceInformation (no controller opened)","Win32_ComputerSystem / Win32_BIOS", "Vendor service and keyboard WMI class names (hints only)","Existing Configuration Manager all-present-PnP topology"]})
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn child_crash_is_a_method_failure_not_absence_of_backlight() {
        let err = lamp_result(Some(0xC0000005u32 as i32), b"").unwrap_err();
        assert!(err.contains("0xC0000005"));
        assert!(err.contains("absence cannot be concluded"));
        assert!(lamp_result(Some(0), b"{}").is_err());
        assert!(
            lamp_result(Some(0), br#"{"interfaces":[],"complete":true,"errors":[]}"#).unwrap()
                ["complete"]
                == true
        );
    }
}
