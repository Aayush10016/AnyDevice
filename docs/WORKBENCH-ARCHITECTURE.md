# Device Workbench architecture

Original implementation using documented user-mode APIs. No upstream implementation was copied or new driver installed.

- Optional native container GUID, compatible IDs and location paths augment schema 2.0; old reports remain valid. Sanitization clears all three. The physicalDeviceId remains unknown: OS topology/container grouping is not confirmed physical identity.
- Parent chains are confirmed logical relationships; shared non-system containers are probable associations. VID/PID and names never group devices. Placement remains unknown without stronger evidence.
- Raw Input device list/name/capability inspection maps interface paths through CM_Get_Device_Interface_PropertyW(DEVPKEY_Device_InstanceId); bounded parent traversal identifies logical ancestry. A user explicitly chooses a mapped collection. Matching a receiver's collection does not identify the radio peripheral behind it.
- Native registration lives in a separate same-executable child process. RegisterRawInputDevices is process-scoped and may interfere with other users of Raw Input in that process; isolation preserves Tauri's handlers. A message-only window reads selected WM_INPUT headers, then only the selected handle's mouse/keyboard payload. Native foreground PID checks precede payload decoding. Focus loss stops collection.
- RIDEV_INPUTSINK is needed by the isolated message window; this is not permission for background data collection. The child stops when the AnyDevice parent ceases to be foreground. DEVNOTIFY handles selected removal. No NOLEGACY flag, hooks, privileged helper or driver is used.
- Endpoints: at most 256 / 2 MiB, inspected in a killable 20-second child. Sessions: 120 seconds / 10,000 selected packets; parent timeout 125 seconds, frame limit 8 KiB, stream limit 8 MiB. UI polls typed snapshots every 250 ms; native aggregates include all accepted events, while only 128 recent events are retained. No-events is inconclusive, not a device fault.
- Stop kills and waits for the child before cleanup is confirmed. Normal exit unregisters and destroys its window. Process exit provides OS cleanup even after forced cancellation. Discard additionally removes the native snapshot on workbench close; no stale session may clear/stop a newer session.
- Keyboard events are virtual-key/scancode/flags transitions, never translated to characters. X-only mode discards all other key payloads. Left/right modifiers are normalized; the visual layout is generic, not a confirmed Cosmic Byte layout. Input is explicitly visible and only collected on the Live Tests section; tab/view/selection/focus changes stop it.
- Down counts exclude repeated downs while held. Up/repeat/held data remain observations, not a count of physical attempts. X attempts and exact symptoms/conditions are user reports. Differences do not establish switch faults or lost events.
- Eight completed workbench sessions remain in frontend memory until that workbench closes. Exports contain aggregate codes/counts, not ordered key-event sequences or typed content. Sanitized exports remove identities and user free text, but aggregate codes/counts/times remain sensitive. No automatic persistence/upload.
- Problem investigation rules use supported test evidence, explain unknowns and route X/wheel symptoms toward available tests. Lighting feedback/control and repairs are explicitly unavailable; no guessed HID output/report transfers or system changes exist.
- Four useful sections are implemented: Overview, Live Tests, Report a Problem, History & export. Protocol/component/repair limitations are explained in context; empty fake pages were not created.

## References and licensing

Read on 13 October 2026; APIs reviewed against current windows-sys 0.61.2 local bindings. Microsoft documentation is the API authority:

- [GetRawInputDeviceInfoW](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getrawinputdeviceinfow): device interface names and reported metadata.
- [RegisterRawInputDevices](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-registerrawinputdevices): registration/removal, notification, process scope.
- [Using Raw Input](https://learn.microsoft.com/en-us/windows/win32/inputdev/using-raw-input): WM_INPUT delivery/read/cleanup.
- [RAWMOUSE](https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-rawmouse) and [RAWKEYBOARD](https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-rawkeyboard): field interpretations.
- [CM_Get_Device_Interface_PropertyW](https://learn.microsoft.com/en-us/windows/win32/api/cfgmgr32/nf-cfgmgr32-cm_get_device_interface_propertyw): typed instance mapping.
- [HIDAPI Windows upstream source](https://github.com/libusb/hidapi/blob/master/windows/hid.c) was inspected as a concrete example of interface-to-instance property mapping. It is a research reference only; no code or HIDAPI dependency was incorporated.

Serde is now an explicit dependency for typed IPC/stream packets; it was already locked transitively. No other dependency versions changed. Existing direct-dependency acknowledgements and MIT project license remain.
