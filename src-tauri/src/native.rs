//! Read-only Configuration Manager provider. All unsafe calls use owned, bounded buffers.
use serde_json::{json, Value};
use std::time::{Duration, Instant};
use windows_sys::Win32::{
    Devices::{DeviceAndDriverInstallation::*, Properties::*},
    Foundation::DEVPROPKEY,
};

const LIMIT: usize = 4096;
const BYTE_LIMIT: usize = 16 * 1024 * 1024;
const PROPERTY_LIMIT: usize = 64 * 1024;

fn strings(bytes: &[u8]) -> Result<Vec<String>, String> {
    if !bytes.len().is_multiple_of(2) {
        return Err("Odd UTF-16 property length".into());
    }
    let units: Vec<u16> = bytes
        .chunks_exact(2)
        .map(|b| u16::from_le_bytes([b[0], b[1]]))
        .collect();
    let mut result = Vec::new();
    for part in units.split(|c| *c == 0).filter(|s| !s.is_empty()) {
        result.push(String::from_utf16(part).map_err(|_| "Invalid UTF-16 property")?);
    }
    Ok(result)
}

fn error(code: u32, operation: &str, id: Option<&str>, kind: &str) -> Value {
    let mut value = json!({"kind": if code == CR_ACCESS_DENIED {"permission"} else {kind},
        "message": format!("{operation}: Configuration Manager error {code}")});
    if let Some(id) = id {
        value["deviceId"] = json!(id);
    }
    value
}

fn property(node: u32, key: &DEVPROPKEY, id: &str, errors: &mut Vec<Value>) -> Vec<String> {
    let mut size = 0;
    let mut ty = 0;
    // CM reports the required byte count without writing when the buffer is null.
    let code =
        unsafe { CM_Get_DevNode_PropertyW(node, key, &mut ty, std::ptr::null_mut(), &mut size, 0) };
    if code == CR_NO_SUCH_VALUE {
        return Vec::new();
    }
    if code != CR_BUFFER_SMALL && code != CR_SUCCESS {
        errors.push(error(code, "Read property size", Some(id), "property"));
        return Vec::new();
    }
    if size == 0 {
        return Vec::new();
    }
    if size as usize > PROPERTY_LIMIT {
        errors.push(json!({"kind":"property","deviceId":id,"message":"Property exceeded 64 KiB"}));
        return Vec::new();
    }
    let mut buffer = vec![0u8; size as usize];
    let code =
        unsafe { CM_Get_DevNode_PropertyW(node, key, &mut ty, buffer.as_mut_ptr(), &mut size, 0) };
    if code != CR_SUCCESS {
        errors.push(error(code, "Read property", Some(id), "property"));
        return Vec::new();
    }
    if size as usize > buffer.len()
        || ![DEVPROP_TYPE_STRING, DEVPROP_TYPE_STRING_LIST].contains(&ty)
    {
        errors.push(
            json!({"kind":"property","deviceId":id,"message":"Unexpected property type or length"}),
        );
        return Vec::new();
    }
    match strings(&buffer[..size as usize]) {
        Ok(s) => s,
        Err(message) => {
            errors.push(json!({"kind":"property","deviceId":id,"message":message}));
            Vec::new()
        }
    }
}

fn device_id(node: u32) -> Result<String, u32> {
    let mut len = 0;
    let code = unsafe { CM_Get_Device_ID_Size(&mut len, node, 0) };
    if code != CR_SUCCESS {
        return Err(code);
    }
    if len > 8192 {
        return Err(CR_BUFFER_SMALL);
    }
    let mut buffer = vec![0u16; len as usize + 1];
    let code = unsafe { CM_Get_Device_IDW(node, buffer.as_mut_ptr(), buffer.len() as u32, 0) };
    if code != CR_SUCCESS {
        return Err(code);
    }
    String::from_utf16(&buffer[..len as usize]).map_err(|_| CR_INVALID_DATA)
}

fn decode_boolean(ty: u32, bytes: &[u8]) -> Option<bool> {
    if ty != DEVPROP_TYPE_BOOLEAN {
        return None;
    }
    match bytes {
        [0] => Some(false),
        [255] => Some(true),
        _ => None,
    }
}

fn presence(node: u32, id: &str, errors: &mut Vec<Value>) -> Option<bool> {
    let mut ty = 0;
    let mut size = 1;
    let mut buffer = [0u8; 1];
    // Unified device properties use DEVPROP_BOOLEAN (0 or 0xff), not Win32 BOOL.
    let code = unsafe {
        CM_Get_DevNode_PropertyW(
            node,
            &DEVPKEY_Device_IsPresent,
            &mut ty,
            buffer.as_mut_ptr(),
            &mut size,
            0,
        )
    };
    if code == CR_NO_SUCH_VALUE {
        return None;
    }
    if code != CR_SUCCESS {
        errors.push(error(code, "Node presence", Some(id), "property"));
        return None;
    }
    let result = if size == 1 {
        decode_boolean(ty, &buffer)
    } else {
        None
    };
    if result.is_none() {
        errors.push(json!({"kind":"property","deviceId":id,"message":"Unexpected presence property type or length"}));
    }
    result
}

fn uint_property(node: u32, key: &DEVPROPKEY) -> Option<u32> {
    let mut ty = 0;
    let mut size = 4;
    let mut bytes = [0u8; 4];
    let code =
        unsafe { CM_Get_DevNode_PropertyW(node, key, &mut ty, bytes.as_mut_ptr(), &mut size, 0) };
    if code == CR_SUCCESS && ty == DEVPROP_TYPE_UINT32 && size == 4 {
        Some(u32::from_le_bytes(bytes))
    } else {
        None
    }
}

fn container(node: u32) -> Option<String> {
    let mut ty = 0;
    let mut size = 16;
    let mut bytes = [0u8; 16];
    if unsafe {
        CM_Get_DevNode_PropertyW(
            node,
            &DEVPKEY_Device_ContainerId,
            &mut ty,
            bytes.as_mut_ptr(),
            &mut size,
            0,
        )
    } != CR_SUCCESS
        || ty != DEVPROP_TYPE_GUID
        || size != 16
        || bytes.iter().all(|b| *b == 0)
    {
        return None;
    }
    Some(format!(
        "{:08x}-{:04x}-{:04x}-{:02x}{:02x}-{:02x}{:02x}{:02x}{:02x}{:02x}{:02x}",
        u32::from_le_bytes(bytes[0..4].try_into().unwrap()),
        u16::from_le_bytes(bytes[4..6].try_into().unwrap()),
        u16::from_le_bytes(bytes[6..8].try_into().unwrap()),
        bytes[8],
        bytes[9],
        bytes[10],
        bytes[11],
        bytes[12],
        bytes[13],
        bytes[14],
        bytes[15]
    ))
}

fn selected(scope: &str, id: &str, category: Option<&str>) -> bool {
    scope == "all-pnp"
        || id.to_ascii_uppercase().starts_with("USB\\")
        || category == Some("HIDClass")
}

pub fn collect(scope: &str) -> Value {
    let started = Instant::now();
    let collected_at = chrono::Utc::now().to_rfc3339();
    let mut errors = Vec::new();
    let mut devices = Vec::new();
    let mut complete = true;
    let mut ids = None;
    // Size may change during hot-plug. Retry the complete list a bounded number of times.
    for _ in 0..3 {
        let mut len = 0;
        let code = unsafe {
            CM_Get_Device_ID_List_SizeW(&mut len, std::ptr::null(), CM_GETIDLIST_FILTER_PRESENT)
        };
        if code != CR_SUCCESS {
            errors.push(error(code, "Inventory size", None, "enumeration"));
            break;
        }
        if len as usize > BYTE_LIMIT / 2 {
            errors.push(json!({"kind":"enumeration","message":"Inventory list exceeded 16 MiB"}));
            break;
        }
        let mut buffer = vec![0u16; len as usize];
        let code = unsafe {
            CM_Get_Device_ID_ListW(
                std::ptr::null(),
                buffer.as_mut_ptr(),
                len,
                CM_GETIDLIST_FILTER_PRESENT,
            )
        };
        if code == CR_BUFFER_SMALL {
            continue;
        }
        if code != CR_SUCCESS {
            errors.push(error(code, "Inventory list", None, "enumeration"));
            break;
        }
        let bytes: Vec<u8> = buffer.iter().flat_map(|u| u.to_le_bytes()).collect();
        match strings(&bytes) {
            Ok(v) => ids = Some(v),
            Err(message) => errors.push(json!({"kind":"malformed","message":message})),
        }
        break;
    }
    if ids.is_none() && errors.is_empty() {
        errors.push(json!({"kind":"enumeration","message":"Inventory changed repeatedly during enumeration"}));
    }
    let mut serialized_bytes = 0usize;
    for (inspected, id) in ids.unwrap_or_default().into_iter().enumerate() {
        if inspected >= 16384 || errors.len() >= 32760 {
            complete = false;
            errors.push(
                json!({"kind":"enumeration","message":"Inspection reached its node/error budget"}),
            );
            break;
        }
        if started.elapsed() > Duration::from_secs(40) {
            complete = false;
            errors
                .push(json!({"kind":"enumeration","message":"Collection reached its time limit"}));
            break;
        }
        let encoded: Vec<u16> = id.encode_utf16().chain(Some(0)).collect();
        let mut node = 0;
        let code =
            unsafe { CM_Locate_DevNodeW(&mut node, encoded.as_ptr(), CM_LOCATE_DEVNODE_NORMAL) };
        if code != CR_SUCCESS {
            complete = false;
            errors.push(error(code, "Locate present node", Some(&id), "enumeration"));
            continue;
        }
        let category = property(node, &DEVPKEY_Device_Class, &id, &mut errors)
            .into_iter()
            .next();
        if !selected(scope, &id, category.as_deref()) {
            continue;
        }
        let present = presence(node, &id, &mut errors);
        if present == Some(false) {
            // An explicitly absent node is excluded, not diagnosed as a fault. The list and
            // properties are non-atomic OS observations; a failed locate still marks a scan partial.
            continue;
        }
        if devices.len() >= LIMIT {
            complete = false;
            errors.push(json!({"kind":"enumeration","message":"Inventory exceeded 4096 entries"}));
            break;
        }
        let name = property(node, &DEVPKEY_Device_FriendlyName, &id, &mut errors)
            .into_iter()
            .next()
            .or_else(|| {
                property(node, &DEVPKEY_Device_DeviceDesc, &id, &mut errors)
                    .into_iter()
                    .next()
            });
        let hardware = property(node, &DEVPKEY_Device_HardwareIds, &id, &mut errors);
        let manufacturer = property(node, &DEVPKEY_Device_Manufacturer, &id, &mut errors)
            .into_iter()
            .next();
        let location = property(node, &DEVPKEY_Device_LocationInfo, &id, &mut errors)
            .into_iter()
            .next();
        let mut parent_node = 0;
        let code = unsafe { CM_Get_Parent(&mut parent_node, node, 0) };
        let parent = if code == CR_SUCCESS {
            match device_id(parent_node) {
                Ok(v) => Some(v),
                Err(c) => {
                    errors.push(error(c, "Parent ID", Some(&id), "property"));
                    None
                }
            }
        } else {
            if code != CR_NO_SUCH_DEVNODE {
                errors.push(error(code, "Parent", Some(&id), "property"));
            }
            None
        };
        let mut flags = 0;
        let mut problem = 0;
        let code = unsafe { CM_Get_DevNode_Status(&mut flags, &mut problem, node, 0) };
        let (status, problem_code) = if code == CR_SUCCESS {
            (
                Some(if flags & DN_HAS_PROBLEM != 0 || problem > 0 {
                    "ERROR"
                } else {
                    "OK"
                }),
                Some(problem),
            )
        } else {
            errors.push(error(code, "Node status", Some(&id), "property"));
            (None, None)
        };
        let container_id = container(node);
        let compatible = property(node, &DEVPKEY_Device_CompatibleIds, &id, &mut errors);
        let paths = property(node, &DEVPKEY_Device_LocationPaths, &id, &mut errors);
        let entry = json!({"deviceCapabilities":uint_property(node, &DEVPKEY_Device_Capabilities),"removalPolicy":uint_property(node, &DEVPKEY_Device_RemovalPolicy),"enumeratorName":property(node, &DEVPKEY_Device_EnumeratorName, &id, &mut errors).first().cloned(),"containerId":container_id,"compatibleIds":compatible,"locationPaths":paths,"instanceId":id,"name":name,"category":category,"hardwareIds":hardware,"present":present,
            "manufacturer":manufacturer,"location":location,"parent":parent,"status":status,"problemCode":problem_code});
        serialized_bytes += entry.to_string().len();
        if serialized_bytes > 12 * 1024 * 1024 {
            complete = false;
            errors.push(json!({"kind":"enumeration","message":"Inventory reached its 12 MiB evidence budget"}));
            break;
        }
        devices.push(entry);
    }
    complete &= !errors.iter().any(|e| {
        ["enumeration", "permission", "malformed"].contains(&e["kind"].as_str().unwrap_or(""))
    });
    json!({"collectedAt":collected_at,"os":"Windows","devices":devices,"errors":errors,"complete":complete,
        "provider":"windows-cfgmgr32","providerVersion":"1.0","scope":scope})
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn validates_unicode_and_multi_strings() {
        let bytes: Vec<u8> = "first\0second\0\0"
            .encode_utf16()
            .flat_map(u16::to_le_bytes)
            .collect();
        assert_eq!(strings(&bytes).unwrap(), vec!["first", "second"]);
        assert!(strings(&[0]).is_err());
        assert!(strings(&[0, 0xd8]).is_err());
    }
    #[test]
    fn scopes_do_not_guess_from_names() {
        assert!(selected("usb-hid", "usb\\vid_1234", None));
        assert!(selected("usb-hid", "HID\\x", Some("HIDClass")));
        assert!(!selected("usb-hid", "BTH\\x", Some("Bluetooth")));
        assert!(selected("all-pnp", "BTH\\x", Some("Bluetooth")));
    }
    #[test]
    fn errors_use_configret_not_message_keywords() {
        assert_eq!(
            error(CR_ACCESS_DENIED, "Read", None, "enumeration")["kind"],
            "permission"
        );
        assert_eq!(
            error(CR_FAILURE, "AccessDenied name", None, "enumeration")["kind"],
            "enumeration"
        );
    }
    #[test]
    fn presence_decoding_keeps_unknowns_distinct_from_absence() {
        assert_eq!(decode_boolean(DEVPROP_TYPE_BOOLEAN, &[255]), Some(true));
        assert_eq!(decode_boolean(DEVPROP_TYPE_BOOLEAN, &[0]), Some(false));
        assert_eq!(decode_boolean(DEVPROP_TYPE_BOOLEAN, &[1]), None);
        assert_eq!(decode_boolean(DEVPROP_TYPE_STRING, &[255]), None);
        assert_eq!(decode_boolean(DEVPROP_TYPE_BOOLEAN, &[]), None);
    }
    #[test]
    fn real_native_inventory_has_a_valid_envelope() {
        let value = collect("usb-hid");
        assert!(value["devices"].is_array());
        assert!(value["errors"].is_array());
        assert!(value["complete"].is_boolean());
        assert_eq!(value["provider"], "windows-cfgmgr32");
    }
}
