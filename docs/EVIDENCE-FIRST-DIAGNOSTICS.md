# Evidence-first diagnostic results

This milestone builds on the full codex/deep-diagnostics tree. It preserves the existing providers, topology rules, native authorization, bounded input/audio sessions, binary workspace and exports.

## Working changes

The ordinary diagnostic view shows only Issue detected and Warning records. A currently muted active endpoint is a configuration warning, not proof of malfunction. Inactive remembered endpoints remain inconclusive coverage even if their historical mute flag is true. Equivalent coverage is grouped by test, outcome and endpoint state. Passing observations and coverage are collapsed separately. Interrupted coverage suppresses completed-scan reassurance. Every underlying record remains in the strict export.

Findings include affected friendly target, observation, relevance, source and confidence rationale, unknowns, next test and current repair eligibility. Navigation uses the exact existing target ID; it never chooses an endpoint by name. Export adds stable definition ID/check version, category, preconditions, supporting/counter-evidence, unknowns, repair description and verification requirements. These are additive bounded fields in the development 1.0 schema; earlier records without them remain accepted. Confidence is qualitative; no percentages or automatic physical-fault inference are introduced.

Audio distinguishes no request, request pending, native starting/running, observed frames, terminal status and confirmed cleanup. Native API failures carry stage names and the Windows error text into advanced evidence. Start-request and status-observation failures have visible explanations. Failed observation stops the native session and disables starting another until Stop/Reset can establish cleanup. Previous test results cannot turn a failed request into success. Ear observations require a completed, supported stream with frames; root diagnostic evidence also checks the exact session/target/mode. Capture conclusions reject missing/malformed channel summaries. Quiet/speech comparison rejects channel mismatch, interrupted/timing/error data and unequal formats instead of crashing or implying quality.

The general keyboard tester no longer exposes X-only mode. Existing native X-only support is retained for backwards compatibility, with no ordinary UI entry point. The ANSI body uses a fixed quarter-unit grid, so unequal row key counts cannot change key pitch. The reference layout is not a detected hardware layout. Counts/held state and numerical scan/timestamp evidence remain native observations; visual keys do not inject events. No-event guidance covers source, focus, mapping, refresh and policy. Interrupted mouse movement and scrolling never pass merely because earlier events exist.

The key-light investigation records owner-supplied model/revision and label/manual evidence before enabling a documented-mode illumination comparison. Right-arrow input evidence remains separate. A repeated reported mismatch can justify further investigation, never a proven LED/circuit/board diagnosis. Sanitized workbench reports withhold model evidence and free text. No generic LED absence claim, vendor profile, illumination sensor or lighting write was added.

The repair registry describes the existing endpoint mute provider and eligibility. It grants no authority: native nonce/target/initial-state validation remains the execution boundary. Inactive or unobserved mute states cannot get a proposal in the UI. Target/state changes clear UI approval, and stale asynchronous proposals cannot populate another target. Configuration readback, comparable measurements, owner improvement and independent resolution remain separate. No additional write provider is claimed.

## What remains unsupported

Controller interaction, event-log correlation, ACPI/WMI/vendor lighting access, LampArray enumeration/control, automatic laptop model discovery within the app, driver installation/rollback, gain/default/profile repair, raw attached HID descriptor acquisition, arbitrary feature/output reports, USB traffic capture and durable repair recovery. The connected HID metadata provider may still report unavailable. No new dependency or driver was added.

Microphone measurements distinguish digital zeros, near-full-scale fractions and API discontinuity/timing observations. RMS/peak/envelope summaries cannot reliably distinguish steady acoustic noise, electrical static, speech, processing or a defective component. No FFT/static classifier or dropout-duration measurement is claimed. Physical audio/input/lighting acceptance and actual approved repair/rollback require owner participation; no raw PCM or translated keyboard text is retained.

## Keyboard lighting research and boundary

- [Microsoft Dynamic Lighting](https://learn.microsoft.com/en-us/windows/apps/develop/devices-sensors/lighting-dynamic-lamparray) describes compatible HID LampArray devices and policy/ownership. Generic keyboard input and lock LED usages do not establish LampArray or vendor RGB support. A separate read-only selector/provider would need compatibility validation before adding controls.
- [LampArray.GetDeviceSelector](https://learn.microsoft.com/en-us/uwp/api/windows.devices.lights.lamparray.getdeviceselector?view=winrt-28000) is a documented discovery route, not universal laptop backlight support. It is researched, not implemented here.
- [Win32_ComputerSystem](https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-computersystem) exposes manufacturer/model for a read-only support lookup. A one-time development-host query is separate from an app provider. No serial/user/computer name is needed.
- [WmiMonitorBrightnessMethods](https://learn.microsoft.com/en-us/windows/win32/wmicoreprov/wmimonitorbrightnessmethods) concerns monitor brightness; treating it as a keyboard backlight API would be incorrect. No undocumented ACPI method is invoked.
- [Lenovo model-specific specifications](https://psref.lenovo.com/Product/IdeaPad/IdeaPad_Gaming_3_15IHU6?MT=82K1) show why a machine family alone is insufficient to choose a keyboard variant. Use the exact model/manual. These references do not identify the user's separate Cosmic Byte keyboard.

## Build and acceptance

Frontend: `npm ci`, `npm test`, `npm run build`, `npm run check:branding`.
Windows native tests: `cargo fmt --manifest-path src-tauri/Cargo.toml --check` and `cargo test --manifest-path src-tauri/Cargo.toml --locked --features custom-protocol -- --nocapture --test-threads=1`.
Installer: `npm run package` (NSIS, custom-protocol embedded frontend). See the Windows workflow for owner-isolation, discovery parity, install/launch/uninstall and checksums.

Owner: scan and inspect grouped coverage; select the exact audio path; approve a test and observe each ear separately; run quiet/speech intervals without changing conditions; stop/blur/close and verify cleanup; test real input counts in focus; identify the keyboard model before a documented lighting comparison; exercise only an intentional approved mute/rollback; verify sanitized exports. Automated fixtures and process launch do not replace these physical checks.
