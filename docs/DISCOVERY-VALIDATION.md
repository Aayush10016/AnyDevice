# AnyDevice — discovery and dedicated workspaces report

Implementation source: `777cac6d95d75ea3250cc49cbdacf5339fedcffe`, branch `codex/discovery-workspaces`. Draft [PR3](https://github.com/Aayush10016/AnyDevice/pull/3) targets `codex/device-workbench` (PR2), which targets PR1's `codex/investigation-platform`. None of these changes were merged into main. GitHub access was verified as Aayush10016. Existing projects were not overwritten.

**Milestone status: implemented incrementally; physical/manual acceptance is not complete.** No mouse movement, clicks, scrolling, keyboard presses, held/repeated physical keys, X-key fault reproduction, LED observation or individual wireless peripheral identity was physically tested by the agent.

## What changed

- Default full native PnP discovery, with read-only capabilities/removal policy/enumerator metadata in addition to existing names, container IDs, parents and locations.
- Normal inventory has external candidates, internal hardware, uncertain placement and supporting infrastructure views. Raw Windows nodes remain available under Stats for nerds.
- Mouse/keyboard candidates associate same-kind logical collections under a bounded concrete USB ancestor. Hubs stop traversal. Shared names, containers and VID/PID do not merge different instances or authorize collection. Physical identities remain unresolved behind receivers.
- Selecting a candidate replaces the main inventory with a device-specific workspace in the same window. Back returns to devices. Advanced raw nodes and non-input categories receive read-only diagnostics.
- Input selection is by exact candidate member instance IDs and kind; several candidate sources require explicit selection. The native collector still requires exactly one instance/kind match and filters hDevice/type. Duplicate or unmapped native associations cannot collect global input.
- Keyboard uses a fixed US ANSI reference, including punctuation, function/navigation/modifier groups and numpad. This is not a detected model/national layout; virtual-key presentation can combine physical positions.
- Mouse shows movement, five button down/up counters and vertical/horizontal wheel reports. Absolute origin reports are retained. Physical sensor accuracy is not measured.
- Named results separate Passed observation checks, Issue detected discrepancies, Inconclusive sessions and Not tested capabilities. X-only collection is optional under Targeted test. Reported attempts stay separate from measured transitions; discrepancies do not diagnose defective switches.
- IDs, lifecycle details, mapping evidence, key/repeat counters, recent timestamps and export previews live under Stats for nerds. Empty event data is explained. Back to top collapses diagnostics without resetting a test.
- Horizontal page overflow is contained in CSS while keyboard/table/technical scrollers remain deliberate. No global gesture interception was introduced.
- Ownership, foreground gating, bounded collection, cleanup, volatile histories and aggregate-only exports remain. No repairs, hardware writes, typed-text translation or automatic uploads were added.

## Verified causes versus hypotheses

1. Broad ancestor/container relationships and first-endpoint default selection could offer the wrong input category for a selected raw node. Selection now uses category-specific candidate member IDs, without container/ancestor-sibling permission.
2. The original keyboard omitted keys and allowed wrapped rows to change placement. New fixed rows and numpad geometry address that presentation defect.
3. Native absolute mouse reports at (0,0) were dropped. A decoder regression now covers the origin and all button pairs.
4. Repeat/held tracking by virtual key alone could merge two scan identities (Enter variants). Native tracking now separates VK/scan/E0-E1 identity before aggregating presentation counts; simultaneous/rapid-pair regressions cover it.
5. Frontend focus-loss cancellation could finalize as completed. Cancellation reasons now survive queued input and cleanup; focus/navigation/reset regressions cover it.

6. Real-host data exposed Bluetooth radio/service nodes as external candidates through their host USB adapter ancestry. Those infrastructure nodes are now separated, and remote paired entries retain unknown live connection. Repeated non-input USB interfaces group by root and category. The normal badge/summary counts external candidates; full Windows-node counts and source provenance are advanced evidence.

**These causes do not establish why the user's X presses were missed.** Wrong collection, receiver ambiguity, focus boundaries, firmware/device behavior and attempt-count accuracy remain hypotheses. No physical X fault was reproduced or repaired. UI polling reads the authoritative native snapshot, and history truncation retains aggregate counts.

## Tests and evidence

- Final local frontend: **86 passed, 0 skipped**, 10 suites, with two workers and the private freshly captured c6ab1e1 native inventory supplied to the optional integration test. Native code is unchanged between c6ab1e1 and final source 777cac6 (verified with Git). The captured response has 258 nodes and one locate error; tests do not pretend it is complete or physically validated.
- Normal c6ab1e1 suite: 82 passed / one integration skipped. An optional full run on that source hit one CSP subprocess's 5-second deadline under local worker load (82 other passes); the bounded-worker retry passed all 83 then-existing tests without assertion or timeout changes. The final Bluetooth/presentation regressions raise the current local total to 86.
- Local production frontend build: passed.
- Rust formatting, branding and strict CSP validator checks: passed.
- Local native compilation: **blocked by missing MSVC link.exe**. Windows CI is the native build/test/installer authority.
- Initial Windows CI at 117292a and c6ab1e1 passed, including **29 native Rust tests**, installer packaging, native/fallback parity, owner rejection, silent install/launch/uninstall and checksum equality. The d594154 runs were intentionally cancelled after being superseded by the final presentation change. Final-source [push run 38431361188](https://github.com/Aayush10016/AnyDevice/actions/runs/38431361188) and [PR run 38431367501](https://github.com/Aayush10016/AnyDevice/actions/runs/38431367501) are the delivery authority; **both final-source runs passed**; results are recorded below.
- Packaged desktop click-through, physical input correctness, trackpad/WebView gestures, screen reader/high-DPI workflows, clean Windows 10/11 upgrade and LED behavior: **not tested**.

## Changed modules

`src/inventoryModel.ts`, `src/DeviceInventory.tsx`: candidate classification/grouping, bounded topology and normal inventory.

`src/App.tsx`: full-scope scan/input metadata integration, dedicated in-window navigation and advanced-node diagnostics.

`src/DeviceWorkbench.tsx`, `src/keyboardLayout.ts`, `src/testOutcome.ts`, `src/styles.css`: native source selection, workspace layout, named results, targeted X flow, advanced details and overflow containment.

`src-tauri/src/native.rs`, `src/core.ts`, `src/models.ts`, `docs/report.schema.json`, `src/generated/validators.ts`: read-only metadata and validated backward-compatible optional report fields.

`src-tauri/src/raw_input.rs`, `src-tauri/src/input_service.rs`, `src/bridge.ts`: absolute-origin decoder, scan-aware repeat/held tracking, explicit interruption reasons and regression coverage. Native ownership/filtering protections remain.

`src/inventoryModel.test.ts`, `src/keyboardLayout.test.ts`, `src/testOutcome.test.ts`, `src/App.test.tsx`, `src/DeviceWorkbench.test.tsx`, `src/workbench.test.ts`: discovery/navigation/attribution/results/privacy regressions. Native regression tests are in their Rust modules.

`.github/workflows/windows.yml`: retains native/parity/owner/installer smoke checks and adds a separately downloadable unsigned portable artifact.

`README.md`, `PRIVACY.md`, `SECURITY.md`, `docs/DISCOVERY-ROOT-CAUSES.md`, `docs/DISCOVERY-WORKSPACES.md`: pre-implementation audit, final rules, limitations and exact manual acceptance procedure.

## Remaining limitations and manual acceptance

There is no universal physical enclosure detector, automatic live PnP monitoring, verified model/physical key layout, individual wireless radio attribution, safe LED control or repair provider. USB placement is probable, not confirmed external. Generic names can still require manual source identification. Duplicate instance/kind interfaces are rejected rather than collected ambiguously. Refresh detects inventory removal; a snapshot cannot guarantee current presence. Repeated down messages cannot distinguish operating-system repeats from device/firmware duplicates.

Manual acceptance:

1. Scan and identify candidates against physically known devices. Check internal, uncertain and infrastructure views.
2. Open mouse/keyboard workspaces; confirm one-window navigation and Back. With several sources, test each independently while using only the intended peripheral. An unrelated device must not increment the selected source.
3. Perform a paper-counted set of 10 button/key down/up pairs; check mouse movement, wheel directions, held X/repeats, simultaneous keys, modifiers/functions/arrows and Enter variants. Compare full mode and optional X-only mode.
4. Stop, reset, switch apps, focus an editable field, navigate away and disconnect. Confirm counting stops and new sessions show no stale data.
5. Review result criteria, empty sessions, Stats for nerds, Back to top, report save/cancel, sanitization, keyboard focus and horizontal trackpad gestures at normal laptop widths/DPI settings.
6. Use the detailed checklist in `outputs/AnyDevice/docs/DISCOVERY-WORKSPACES.md` before calling this milestone complete. LEDs and repairs remain Not tested/unsupported.

## Real-host discovery model review

On the reviewed 258-node response: 231 total logical/category candidates, comprising 30 probable external, 36 unknown/ambiguous, 157 infrastructure and 8 known internal system candidates. Six mapped input collections produce two mouse-category and four keyboard-category candidates. **These numbers are not counts of physical mice/keyboards/peripherals. No physical identity was established.** Thirty generic probable external candidates still require metadata/model/connection refinement and user identification; this is an incremental inventory model rather than a universal physical-device resolver.

One enumeration error was `Locate present node: Configuration Manager error 13`; the response remained partial. Its missing-node/race cause is not established, no physical disconnection was inferred and no error was suppressed. A new final-package read-only check is recorded below.

## Final build and delivery evidence

Final source **777cac6d95d75ea3250cc49cbdacf5339fedcffe**. Both final push and PR Windows CI runs passed. Final CI: **85 frontend passed / 1 optional hardware integration skipped; 29 Rust passed / 0 failed**. Formatting, branding, production build, native/fallback parity, trusted-owner/foreign-owner rejection, NSIS packaging, silent installation, installed/release SHA256 equality, desktop process launch and silent uninstall passed.

Hosted runner: 67 present PnP nodes / 17 named classes / 0 collection errors; two mapped logical input collections. Native/fallback parity: one matching USB/HID node, no shared-property differences or collection errors. These are runner observations, not tests of the user's physical peripherals.

Local portable artifact: `AnyDevice-discovery-workspaces-windows-x64/AnyDevice-0.2.0-windows-x64.exe`, **9,556,480 bytes**, signature **NotSigned**. SHA256:

`f845deaa19e215d92e909408c7ef88876e1a32e45fb72cddd2f2c0f15d0886da`

The local executable matched its manifest and the final CI installed/release digest. It stayed running with title AnyDevice and a nonzero window handle; the probe stopped only its own process. This verifies launch, not clicking through the UI.

Fresh final-package read-only discovery: **257 Windows nodes, 25 named classes, 0 errors, complete=true**, with capabilities/removal policy metadata on 257 nodes. **6 logical input collections, all mapped**. Trusted same-executable actual-parent ownership was accepted; a foreign PowerShell parent was rejected. No physical input was collected. The prior partial snapshot's locate error did not recur; its precise transient cause remains unproven.

Final model on that fresh response: 231 logical/category candidates across all views: 30 probable external, 36 uncertain, 157 infrastructure and 8 known internal. Six mapped collections correspond to two mouse-category and four keyboard-category candidates; **none was physically identified as the user's specific peripheral**. Candidate counts and Windows nodes are not physical-device counts.

The installer was packaged and tested in CI, not installed on the user's computer. The local delivery contains the portable executable, manifest and readme; installer checksum entries in that manifest were not locally verified against an installer download. No stable release is published. PR3 remains draft and unmerged; PR1/PR2 remain dependencies. The milestone remains **unaccepted** until physical and manual UI checks are performed.
