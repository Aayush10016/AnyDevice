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
pub fn collect() -> Value {
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
