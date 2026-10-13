# Diagnostic/audio milestone — audit before implementation

Baseline: clean 39ef32b, app/package 777cac6. PR3 is open/draft against PR2's codex/device-workbench; PR2 depends on PR1. Work continues in codex/audio-diagnostics, preserving Tauri/React/Rust and all prior ownership/cleanup/privacy protections.

Existing providers: bounded present PnP discovery, fixed optional PowerShell parity, exact native mouse/keyboard collections and user-started input sessions. Existing findings only cover Windows-reported status. Audio stream tests, unified orchestration, repair providers and HID capability inspection were absent; no audio test or repair can be inferred from the existing UI.

Actual private host metadata: six mapped input collections. Of four keyboard collections, two have different concrete USB ancestor instances (one shares a USB boundary with a mouse collection), one has BUTTONCONVERTER/HID/ACPI ancestry and one has PCI/ACPI ancestry. This refutes automatic merging of all four as one external keyboard. It does not identify which physical keyboard generated the user's source-4 presses. Generic composite-boundary grouping is a possible false split in fixtures; actual topology must govern association. Same USB boundary may represent a receiver and several peripherals, or a composite peripheral; neither model is presumed.

Naming currently discards useful Windows-friendly metadata in favor of generic names. Improve reported-name presentation while separating it from verified model identity. Platform/button-converter sources must remain separate from external USB candidates. Container equality alone cannot authorize capture or prove physical identity.

Native input counters already use scan identity for repeats, preserve absolute origin and keep explicit cancellation reasons. No physical missing-X/mouse defect was reproduced; endpoint selection and session boundaries remain hypotheses. Do not rewrite tested collectors without a demonstrated regression.

Audio implementation will use the already locked Microsoft windows 0.62.2 bindings, Windows Core Audio endpoint IDs and WASAPI shared-mode formats. Enumeration/configuration reads are automatic; playback/capture require explicit user action. A bounded, owned child isolates COM/driver stalls. Capture retains numerical levels only, never PCM/audio/text. Synthetic signal tests validate DSP, not a microphone. Automatic diagnostics run only read-only providers; user-interactive tests remain Not tested until explicitly performed.

The first repair provider may propose a muted endpoint's unmute operation with explicit consent, stale-state checks, setting readback and rollback. Setting verification is not audible-sound or static-fault verification. No repair will be executed by the agent on the user's device. LED writes, firmware, default-device switching through undocumented interfaces, driver replacement and USB traffic capture remain unsupported.
