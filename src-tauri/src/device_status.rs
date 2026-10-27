//! One exact, present devnode; read-only status, never enable/restart.
use serde_json::{json, Value};
use windows_sys::Win32::Devices::DeviceAndDriverInstallation::*;

pub fn valid_target(id: &str) -> bool {
    !id.is_empty() && id.encode_utf16().count() <= 2048 && !id.chars().any(char::is_control)
}
fn failure(id: &str, stage: &str, code: u32, present: Option<bool>) -> Value {
    json!({"operation":"device-status","targetId":id,"observedAt":chrono::Utc::now().to_rfc3339(),
        "complete":false,"present":present,"status":null,"problemCode":null,"statusFlags":null,
        "errors":[{"stage":stage,"configRet":code,"message":format!("{stage}: Configuration Manager error {code}")}]})
}
pub fn collect(id: &str) -> Value {
    if !valid_target(id) {
        return failure(id, "Validate device identity", CR_INVALID_DEVICE_ID, None);
    }
    let mut wide: Vec<u16> = id.encode_utf16().chain(Some(0)).collect();
    let mut node = 0;
    // NORMAL resolves only a currently present node. No phantom lookup or reenumeration.
    let code =
        unsafe { CM_Locate_DevNodeW(&mut node, wide.as_mut_ptr(), CM_LOCATE_DEVNODE_NORMAL) };
    if code != CR_SUCCESS {
        return failure(
            id,
            "Locate present device",
            code,
            if code == CR_NO_SUCH_DEVNODE {
                Some(false)
            } else {
                None
            },
        );
    }
    let (mut flags, mut problem) = (0, 0);
    let code = unsafe { CM_Get_DevNode_Status(&mut flags, &mut problem, node, 0) };
    if code != CR_SUCCESS {
        return failure(id, "Read device status", code, Some(true));
    }
    json!({"operation":"device-status","targetId":id,"observedAt":chrono::Utc::now().to_rfc3339(),
        "complete":true,"present":true,"status":if flags & DN_HAS_PROBLEM != 0 || problem > 0 {"ERROR"} else {"OK"},
        "problemCode":problem,"statusFlags":flags,"errors":[]})
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn target_validation_never_allows_implicit_root_or_controls() {
        for id in ["", "USB\\X\0Y", "USB\\X\nY", &"x".repeat(2049)] {
            assert!(!valid_target(id));
        }
        assert!(valid_target("USB\\VID_1234&PID_5678\\EXACT"));
    }
    #[test]
    fn query_failure_has_no_success_values_and_keeps_original_code() {
        let v = failure(
            "USB\\EXACT",
            "Locate present device",
            CR_NO_SUCH_DEVNODE,
            Some(false),
        );
        assert_eq!(v["complete"], false);
        assert_eq!(v["present"], false);
        assert!(v["problemCode"].is_null());
        assert!(v["status"].is_null());
        assert_eq!(v["errors"][0]["configRet"], CR_NO_SUCH_DEVNODE);
    }
}
