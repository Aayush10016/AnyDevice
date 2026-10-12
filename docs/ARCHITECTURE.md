# Architecture

Tauri 2 supplies a real Windows shell with native title bar, React/TypeScript/Vite supplies the embedded UI, and Rust exposes four purpose-specific commands: scan, cancel, save report, and open an allowlisted project/documentation/license link in the system browser. Lucide SVG icons and Segoe UI avoid downloaded fonts or decorative network assets. System title bar is deliberately retained for native resize, keyboard and accessibility behavior.

## Layers and files

| Layer | Module | Responsibility |
| --- | --- | --- |
| Discovery | `src-tauri/scripts/discover.ps1` | Read present USB/HID PnP entries and available properties; emit structured JSON/errors |
| Native boundary | `src-tauri/src/main.rs` | Fixed encoded script, hidden child, one scan at a time, timeout/cancellation, native report save |
| Normalization | `src/core.ts`, `src/models.ts` | Validate envelope, deduplicate instance IDs case-insensitively, parse exact VID/PID, retain unknowns |
| Diagnosis/recommendation | `src/core.ts` | Pure deterministic evidence rules and safe next tests |
| Reporting | `src/core.ts` | Versioned report, prior evidence and allowlist sanitization |
| UI | `src/App.tsx`, `src/styles.css`, `src/bridge.ts` | Real scan state, inspection, search, findings, preview, settings |

PowerShell is an explicitly permitted fallback in the specification. Native SetupAPI integration is deferred. Windows PowerShell 5.1 and the system PnpDevice module are required, not PowerShell 7 or Python. The adapter is compile-time embedded; production does not read an editable script from disk. No UI input or device name is interpolated into command text. `Get-PnpDeviceProperty` receives the instance ID as a typed parameter.

Enumeration selects `USB\*` or `HIDClass`, not every present PnP entry. Some HID devices can use Bluetooth or other buses; their transport remains unknown. One physical composite device may produce multiple entries. VID/PID are extracted only from exact identifier patterns. Parent and location are opaque Windows-reported properties; no topology inference is made.

The scan is a point-in-time observation, not a USB traffic capture. Some hot-plug changes during property collection can generate partial results. A scan older than 60 seconds or retained after failure is marked stale. Scan history is volatile and comparison requires complete inventories; no persistent hardware tracking occurs.

Cancellation aborts the Rust future; the child has `kill_on_drop` enabled. Only one scan may run. The native timeout is 45 seconds. PnP enumeration is limited to 4096 entries and the final response to 16 MiB. Report saves are limited to 20 MiB. Output is buffered while the fixed discovery adapter runs; a future native adapter should enforce streaming bounds too.

The Rust boundary checks JSON shape; TypeScript validates the discovery envelope and property types. Diagnostic evidence strings reference device instance IDs in device arrays (`devices/<id>/...`), not RFC 6901 JSON pointers. Historical findings reference `previous/devices/<id>`. Sanitized reports retain report-local aliases in current and prior arrays. `complete` describes inventory enumeration; missing optional properties and property errors are separately recorded and do not establish hardware faults.

No shell/network/filesystem plugins are exposed. Custom commands operate only on fixed discovery or JSON chosen in a native save dialog. CSP restricts runtime content to local resources. React renders device metadata as text; no HTML injection or evaluated metadata. Frontend fixtures are never imported by production.
