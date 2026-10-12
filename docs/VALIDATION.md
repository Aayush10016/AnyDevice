# Actual validation results

Validation on 12 October 2026 (Asia/Kolkata), Windows x64, Node 24.18.0. This is an unreleased source candidate; release gates are explicit.

| Check | Actual result |
| --- | --- |
| Frontend/domain/report-schema tests plus opt-in real collection integration | **30 passed across 4 suites** with Vitest 5.0.4 |
| Production TypeScript checking and Vite build | **Passed**, generated `dist/` |
| npm dependency audit after test-runner update | **0 vulnerabilities reported**; no comprehensive security assurance implied |
| Rust formatter | Task-local Rust 1.99 / rustfmt installed; `cargo fmt` succeeded |
| Native dependency resolution | Cargo.lock generated, 476 packages locked |
| Fixed PnpDevice adapter against actual Windows hardware | **Complete scan: 30 entries, 0 collection errors** |
| Real scan through normalization/diagnostics/report serialization | **Passed**; 30 OK statuses, 30 problem-code values all zero, 18 VID/PID pairs, 0 supported findings |
| GitHub repository creation | **Succeeded**, owner verified as Aayush10016, name AnyDevice |
| Rust unit tests / native local packaging | **Blocked locally**: `link.exe` not found; Visual C++ Build Tools/Windows SDK required. Native tests are delegated to the Windows CI runner, not claimed as passed locally. |
| Browser preview visual capture | Available in-app browser could not reach localhost; no screenshot claimed |
| Installed desktop visual/accessibility QA | Not yet performed |
| Disconnect/reconnect, actual error device, cancellation/timeout on physical hardware | Not yet performed; synthetic domain/UI cases tested |

The raw collection timestamp was `2026-10-12T17:17:11.5148676+00:00` (22:47:11 IST). An earlier quick PnpDevice check returned 31 entries; inventory can change between point-in-time scans. Counts refer to logical Windows entries, not physical devices. Real device identifiers/names were retained only in the task's `work/` folder and never added to Git.

The 30 passing tests include 22 normalization/diagnostic/report tests, 5 component workflow tests, 2 JSON Schema tests and 1 opt-in integration test over actual adapter output. CI without `ANYDEVICE_HARDWARE_JSON` skips that last test rather than inventing hardware.

Initial Windows CI built an installer and standalone executable successfully. A second run passed 7 Rust tests and built both files, then the stronger installed-binary checksum comparison detected Tauri's per-bundle marker patching. Packaging now disables that unused updater marker feature and explicitly enables embedded production assets, with a release startup assertion. The final installer run is pending. Source implementation alone does not satisfy the master spec's definition of a finished desktop release.
