# Actual validation results

Validation on 12–13 October 2026 (Asia/Kolkata), Windows x64, Node 24.18.0. This is an unsigned draft Windows candidate; release gates are explicit.

| Check | Actual result |
| --- | --- |
| Frontend/domain/report-schema tests plus opt-in real collection integration | **31 passed across 4 suites** with Vitest 5.0.4 |
| Production TypeScript checking and Vite build | **Passed**, generated `dist/` |
| npm dependency audit after test-runner update | **0 vulnerabilities reported**; no comprehensive security assurance implied |
| Rust formatter | Task-local Rust 1.99 / rustfmt installed; `cargo fmt` succeeded |
| Native dependency resolution | Cargo.lock generated, 476 packages locked |
| Fixed PnpDevice adapter against actual Windows hardware | **Complete scan: 30 entries, 0 collection errors** |
| Real scan through normalization/diagnostics/report serialization | **Passed**; 30 OK statuses, 30 problem-code values all zero, 18 VID/PID pairs, 0 supported findings |
| GitHub repository creation | **Succeeded**, owner verified as Aayush10016, name AnyDevice |
| Rust unit tests / native local packaging | **Blocked locally**: `link.exe` not found; Visual C++ Build Tools/Windows SDK required. Native tests are delegated to the Windows CI runner, not claimed as passed locally. |
| Final Windows CI tests | **30 JavaScript tests passed, 1 opt-in physical-inventory test skipped; 9 Rust tests passed** |
| Windows installer and standalone packaging | **Passed** for source `28eed5435a1dca47963775caa38578f5e054f709` |
| Silent installation, installed binary integrity, launch and uninstall | **Passed** in Windows CI; installed and standalone SHA-256 were identical |
| Final local standalone launch | **Passed** with development servers stopped; remained alive after 8 seconds and created the `AnyDevice · USB Doctor` window. The test process was closed. |
| Local downloads and SHA-256 | **Both complete and verified** against the CI-generated checksum file |
| Authenticode signature checks | **Both NotSigned**; no signing is claimed |
| Synthetic Windows provider failures | **Passed** for service unavailability, typed access denial and misleading `AccessDenied` text in metadata; only structured errors establish permission denial |
| Browser preview visual capture | Available in-app browser could not reach localhost; no screenshot claimed |
| Installed desktop visual/accessibility QA | Not yet performed |
| Disconnect/reconnect, actual error device, cancellation/timeout on physical hardware | Not yet performed; synthetic domain/UI cases tested |

The raw collection timestamp was `2026-10-12T17:17:11.5148676+00:00` (22:47:11 IST). An earlier quick PnpDevice check returned 31 entries; inventory can change between point-in-time scans. Counts refer to logical Windows entries, not physical devices. Real device identifiers/names were retained only in the task's `work/` folder and never added to Git.

The 31 passing local tests include 23 normalization/diagnostic/report tests, 5 component workflow tests, 2 JSON Schema tests and 1 opt-in integration test over actual adapter output. CI without `ANYDEVICE_HARDWARE_JSON` skips that last test rather than inventing hardware. Its separate real discovery smoke test collected 1 hosted-runner entry with 0 errors. The 9 native tests cover encoding, report rejection, fixed project-link allowlisting, production mode, cancellation, timeout, malformed/failed child output and authoritative permission classification.

The [final Windows build](https://github.com/Aayush10016/AnyDevice/actions/runs/38290626085) and [artifact staging](https://github.com/Aayush10016/AnyDevice/actions/runs/38291765118) both succeeded. A stronger check caught Tauri's per-bundle marker patching during an earlier run; packaging disables that unused updater marker feature and keeps the strict binary equality check. Production assets are explicitly enabled and release startup rejects development mode.

## Actual deliverables

The [draft prerelease](https://github.com/Aayush10016/AnyDevice/releases/tag/untagged-8a756fcda793eee58e44) is owner-visible and contains both executables, SHA256SUMS.txt and portable instructions. It is not a published stable release. Local downloads are in the sibling `../AnyDevice-0.1.0-windows-x64/` directory, separate from this Git repository.

| File | Size | SHA-256 |
| --- | --- | --- |
| `AnyDevice_0.1.0_x64-setup.exe` | 218,886,427 bytes | `6de6fb14d8cf21ebedc41d1ea363724e1da48fc0277e0be5762364dc39b48cdd` |
| `AnyDevice-0.1.0-windows-x64.exe` | 9,059,840 bytes | `259f066c9bff74aa9d829ad116e32051ea82c4a8811c42d1787391ee3e6df4a2` |

The installer includes the offline WebView2 installer; the standalone requires an installed WebView2 runtime. Neither requires Node, Rust or Python for normal use. PE import inspection found only Windows system/API-set DLLs; no developer runtime was imported.

The local master specification copy was SHA-256 verified against the attached file: `c3f8c56ab8679efcd4b0f7ba9673aa64ffde8f2e25c5280997322e66295a819b`. Git performs ordinary text line-ending normalization.

## Remaining release gates

No genuine application screenshots, manual visual/accessibility/resizing review, packaged report-dialog exercise, deliberate physical disconnect/reconnect, actual failed-device test, or clean-machine Windows 10/11 installation test was performed. The available browser could not reach the local frontend preview. Local packaged launch and CI install/launch checks do not replace those exercises. Signing remains unconfigured. These limits prevent claiming a finished stable v0.1 release.

Architecture/modules: [ARCHITECTURE.md](ARCHITECTURE.md). UI tokens/references: [DESIGN.md](DESIGN.md). Diagnostic scope: [RULES.md](RULES.md). Build/signing/manual steps: [BUILD.md](BUILD.md). The next three priorities are listed in the README.
