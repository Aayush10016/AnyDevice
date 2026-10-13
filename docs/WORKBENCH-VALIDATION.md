# AnyDevice Device Workbench milestone — implementation and acceptance report

13 October 2026. Packaged source: **92f1a4a8b24d40746e180e34f7d01e4518dab2cf**. Branch: `codex/device-workbench`. Version: **0.2.0 candidate 5**, Windows x64. [Draft PR 2](https://github.com/Aayush10016/AnyDevice/pull/2) targets the existing expansion branch and depends on PR 1. Existing main and all prior release assets are preserved.

**No physical mouse/keyboard functional test was performed by me. The user's USB-dongle mouse was not moved/clicked/scrolled as an acceptance procedure; physical key presses, the intermittent X fault and the LED fault were not reproduced or repaired.** Windows inventory/interface mapping and native registration probes are different tests. The first functional milestone remains provisional until user-operated packaged acceptance is performed.

## Audit and baseline

The actual project was clean at `0c68104` on `codex/investigation-platform`, with candidate 3 packaged from `4051275`. React 19/TypeScript/Vite, Tauri 2/Rust, the native Configuration Manager collector, fixed PowerShell fallback, deterministic diagnostics, volatile investigations, binary workspace, privacy controls, schemas and Windows workflows were inspected. Baseline: 50 frontend cases passed and the optional real-input case was skipped. Native local compilation remains unavailable because the development host lacks the MSVC linker; Windows CI supplies compiled/tested native binaries. Existing identifier `io.anydevice.usbdoctor`, preferences, report versions and technical inventory access remain.

The short phased plan is in WORKBENCH-PLAN.md. This run implements priorities 1–4 as a bounded input-workbench foundation and only read-only interface/capability metadata from priority 5. It does not complete the long-term repair/reverse-engineering platform.

## Implemented vertical slice

- Selecting an inventory node opens its Device Workbench above the existing inventory. All technical rows and the existing inspector remain accessible. If the inventory is scrolled, locate the workbench above it.
- Overview shows actual selected-node evidence, manufacturer/VID/PID/status/time/source, container hints, parent-chain relationships, matched native input endpoints, reported capabilities and existing findings. Model/physical identity and external/internal/virtual placement remain unknown where unsupported.
- Parent relationships are confirmed **logical topology**, not confirmed physical grouping. Shared non-system Windows containers are probable associations. Matching VID/PID or names never group nodes. A receiver and its radio peripheral are not treated as one proven physical object.
- Native input inspection reads Raw Input collection paths/capabilities and maps them to instance IDs and bounded native ancestry. Mapped mouse/keyboard collections associated with the selected node are offered; unmapped/ambiguous targets cannot start a falsely attributed test.
- Mouse test implementation reads native relative/absolute motion reports, five standard button transitions, signed vertical/horizontal wheel fields, counts, timestamps and visual states. No browser mouse event is used as device evidence. Physical function and sensor accuracy are unverified.
- Keyboard implementation observes selected native virtual-key/scancode/down/up flags, non-repeat downs, repeats, held state and timestamps. The layout is generic/common-key visualization, not a verified Cosmic Byte physical layout; detailed counts cover observed virtual codes. Left/right modifiers are normalized. Full physical-key matrix/scancode and absolute-pointer edge coverage remain follow-up work.
- X-only mode discards other key events. Reported physical attempts remain separate from measured non-repeat X transitions. A mismatch does not establish lost physical presses or a defective switch; agreeing counts do not rule out an intermittent fault.
- Report a Problem preserves exact symptom/conditions as user statements, uses deterministic local routing for supported X/wheel/LED follow-up, displays native observations separately and explains unknowns. It is not an external-AI diagnosis or an empirically validated cause-ranking engine.
- Four useful sections: Overview, Live Tests, Report a Problem, History & export. Component/protocol/repair limitations are explained in context instead of empty functional-looking pages.
- Start/Stop/Reset, cancellation/focus/editable-field/view cleanup, removal handling, bounded recent history and completed summaries are implemented. Changing test targets clears previous measurements; stale replies cannot replace the current session. Sanitized histories use consistent distinct endpoint aliases.
- Up to eight completed sessions remain while the workbench is open. Explicit aggregate-only JSON preview/save uses schema `device-workbench-1.0`; ordered key history/typed text are never exported. Exact per-session user conditions and durable projects are not yet a persistent investigation model.

The newly staged candidate 4 was superseded before delivery after a helper CLI ownership gap was found. Final helper activation now requires its actual creator PID and the matching executable path, with a held owner handle. CLI scope cannot be redirected to an unrelated foreground application by supplying its PID. Release CI checks positive same-executable ownership and rejected shell ownership without collecting input. Candidate 4 is marked do not use; the ownership-hardened final delivery is candidate 5. This is targeted hardening, not a comprehensive security audit.

## Native design and privacy

Original user-mode Windows implementation: GetRawInputDeviceList/GetRawInputDeviceInfoW; CM_Get_Device_Interface_PropertyW with DEVPKEY_Device_InstanceId; native parent traversal; RegisterRawInputDevices; message-only HWND/WM_INPUT/GetRawInputData; DEVNOTIFY removal; foreground process checks; unregister/destroy on normal exit.

A separate same-executable process prevents process-scoped Raw Input registration from replacing Tauri's registrations. Only selected handles are decoded. Input begins only after explicit Start; the collector stops when AnyDevice loses foreground focus. Editable fields and leaving the test view also request stop. Actual creator/image ownership is verified before registration and owner exit stops collection. No hooks, kernel driver, character translation, background permanent monitor, arbitrary shell execution, hardware writes or repair operations were added.

Bounds: input inspection 256 entries/2 MiB/20 seconds; test 120 seconds/10,000 selected raw packets; parent watchdog 125 seconds; input frame 8 KiB/stream 8 MiB; 128 recent events; eight frontend summaries. Stop kills and waits before cleanup is confirmed; discard cancels and clears native session memory on close. Collection timestamps are software observation times, not calibrated hardware latency measurements. A session being Completed does not mean every physical component passed.

Sanitized diagnostic reports clear new container/location/compatible-ID metadata while retaining schema-2 compatibility. Workbench exports remove identity/free text/reported attempts when sanitized, preserve distinct logical aliases, and omit ordered key sequences even in raw mode. Aggregate virtual-key counts/times can remain sensitive. No automatic persistence, telemetry or upload. References and licensing details are in WORKBENCH-ARCHITECTURE.md; Serde 1.0.229 was already transitively locked and is now explicit, with MIT/Apache notices preserved.

## Executed tests and builds

| Check | Actual result |
| --- | --- |
| Baseline | 50 passed; 1 optional real-input case skipped |
| Final local frontend/domain/component/schema/CSP suite | **67 passed across seven suites**, with private saved real inventory supplied |
| Normal CI frontend suite | 66 runnable cases plus optional real-input case; 66 passed, 1 opt-in real-inventory case skipped on CI |
| TypeScript/Vite production build, branding, Rust formatting | Passed |
| Windows native compilation/unit suite | **25 passed** for final source |
| Native registration/focus/unregister probe | Exercised on the Windows runner: registration then focusLost; registration count restored; no physical event reading claimed |
| Hosted native/fallback parity | 1 matching USB/HID logical node, 0 shared-property differences/errors |
| Hosted broad inventory | 67 nodes, 17 named classes, 0 collection errors |
| Hosted Raw Input metadata | 2 mouse/keyboard collections, 2 mapped instance IDs; **not physical event tests** |
| Packaging/install/integrity/launch/uninstall | Passed on Windows CI; installed/release binaries matched |
| Local final candidate metadata, launch and ownership probes | Passed: checksum/title/8-second launch, 6 mapped collections, trusted owner accepted and foreign/direct collector rejected; no physical input tested |
| Real mouse movement/click/scroll or real keyboard input | **Not tested** |
| X-switch or LED fault reproduction/fix | **Not tested; no repair applied** |
| Packaged click-through/export dialogs/accessibility/clean install/upgrades/signing | **Not tested / remaining release gates** |

The initial 86195fd CI runs compiled native code and passed the new native tests, but three old PowerShell fixture tests timed out under their shorter 10/15-second startup budgets. Process tests now run serially with the production 45-second startup budget; the deliberate 20-ms timeout and cancellation assertions remain. Corrected intermediate bf30d6b and final b1ed85a Windows runs passed. No failed-build assets were delivered. Subsequent attribution review fixes have dedicated regression coverage. Compilation and fixture passes are not physical acceptance.

[Final push build 38410536509](https://github.com/Aayush10016/AnyDevice/actions/runs/38410536509) and [final PR build 38410577664](https://github.com/Aayush10016/AnyDevice/actions/runs/38410577664) passed. Candidate 5 is a separate owner-visible [draft prerelease](https://github.com/Aayush10016/AnyDevice/releases/tag/untagged-1d0bf49e349a831c4f8b), not stable publication. [Staging 38412633607](https://github.com/Aayush10016/AnyDevice/actions/runs/38412633607) verifies exact source and checksums; exact asset hashes are recorded below. Old candidate 3 and the original 0.1.0 assets remain unchanged.

## Acceptance ledger

Status scopes are explicit: an automated Passed result does not mean real user hardware passed.

| Criterion | Status | Evidence / scope |
| --- | --- | --- |
| Selected-node dedicated workspace | Passed | Component tests/rendered selected data; actual Logitech/Cosmic selection unverified |
| Logical entries accessible | Passed | Existing inventory tests retained; workbench topology/IDs available |
| Relationship evidence/confidence | Passed | Parent/container/cycle/VID/PID separation tests; physical grouping unresolved |
| Unknown relationships remain unresolved | Passed | No physical/name/VID-only identity claims |
| Existing inventory functionality | Passed | Existing tests preserved |
| Real mouse movement observed | Not tested | User must perform movement in packaged app |
| Real button distinction | Not tested | Decoder fixtures passed; physical left/right/middle/extra actions pending |
| Real wheel direction | Not tested | Signed decoder fixtures passed; physical vertical/horizontal actions pending |
| Live count/recent-event updates | Passed | Mocked UI/native reducer tests; real-event update acceptance pending |
| Real Start/Stop/Reset workflow | Not tested | Mocked lifecycle tests passed; packaged click-through pending |
| Native registration cleanup | Passed | Actual Windows registration/focus gate/unregister probe; full user Stop/removal still pending |
| Attribution limitations displayed | Passed | Exact logical-ID/ancestry tests and UI explanation; physical origin not established |
| Real keyboard events visible | Not tested | Native code/decoder and UI fixtures only |
| Per-key count/time mechanics | Passed | Reducer/UI fixtures; per-physical-key accuracy not accepted |
| Repeat handling | Passed | Non-repeat down vs repeat fixture tests |
| X scenario recording/comparison | Passed | User/measured separation and no-defect-claim tests; physical X fault not reproduced |
| Session-scoped keyboard observation | Passed | Native foreground probe, unmount/editable-focus fixtures and code audit; physical sessions pending |
| Hidden keyboard monitoring absent | Passed | No startup registration, foreground/session bounds, no text translation/persistent key sequences |
| User symptoms distinct from measurements | Passed | Exact user-report/export tests |
| Automatic findings explain evidence | Passed | Existing deterministic diagnostics preserved; new unconfirmed symptom rationale |
| Potential concerns not called failures | Passed | No-events/count-mismatch/LED limitations and tests |
| Justified remediation offered | Blocked | No validated repair provider/action yet; no speculative operation |
| Specific approval before state-changing repair | Blocked | No repair API exists to exercise |
| Before/after repair comparison | Blocked | No applied repair; test histories/global snapshots available as foundation |
| Inconclusive repair outcome | Blocked | Repair workflow not implemented; no repair-success claim |
| Read-only interface/capability discovery | Passed | Native Raw Input/CM mapping smoke; full HID descriptor inspection not implemented |
| Raw protocol/report bytes preserved and parsed | Blocked | Raw binary workspace retained, but no HID report-descriptor/capture parser |
| Parser validation / unknown fields | Blocked | Protocol parser not implemented; no guessed fields |
| Arbitrary device writes absent | Passed | Code/API audit: no HID output/control transfers or driver/firmware/registry repair |
| Research sources/licenses | Passed | Primary API research documented; original code; pinned explicit Serde notices |
| Existing/new tests and production build | Passed | Local 67 cases and final Windows 25 native cases/build |
| Packaged physical interaction | Not tested | Physical user actions and native desktop UI inspection not completed |
| Browser/fixture validation labelled honestly | Passed | No fixture/CI metadata described as physical testing |
| Documentation/remaining limitations | Passed | Plan, architecture, procedures and this record |

## Exact next milestone

**User-operated packaged input acceptance and reproducible device identity comes first.** Use native all-present-PnP inventory, confirm the actual mouse/receiver and keyboard collection through controlled observations, then execute WORKBENCH-MANUAL-TESTS.md: movement/buttons/wheels; keyboard down/up/repeat/held/simultaneous input; X-only reported vs measured attempts; stop/reset/focus/view/disconnection cleanup; export/save/cancel. Record actual results before any claim about the X/LED fault.

Then add durable per-test conditions/annotations and a versioned device-profile/scancode model; improve complete keyboard/absolute-pointer coverage and read-only HID descriptors. Lighting requires a validated exact-model protocol and truthful user/physical-state feedback. Repair-provider abstraction, approval/rollback/verification, dedicated other-category providers, capture decoders, clean Windows installs/upgrades, accessibility and signing remain future work. No universal support, physical fix or stable readiness is claimed.

## Changed files

Relative names below refer to the existing AnyDevice project, not new/unrelated projects.

| File | Purpose |
| --- | --- |
| `.github/workflows/promote-candidate.yml` | Stage only separate candidate 5 after exact source/checksum validation. |
| `.github/workflows/windows.yml` | Native mapping smoke, serial Windows process tests and existing package gates. |
| `PRIVACY.md` | Document scope, architecture, acceptance, privacy/security or dependency license notices. |
| `README.md` | Document scope, architecture, acceptance, privacy/security or dependency license notices. |
| `SECURITY.md` | Document scope, architecture, acceptance, privacy/security or dependency license notices. |
| `THIRD_PARTY.md` | Document scope, architecture, acceptance, privacy/security or dependency license notices. |
| `docs/WORKBENCH-ARCHITECTURE.md` | Document scope, architecture, acceptance, privacy/security or dependency license notices. |
| `docs/WORKBENCH-MANUAL-TESTS.md` | Document scope, architecture, acceptance, privacy/security or dependency license notices. |
| `docs/WORKBENCH-PLAN.md` | Document scope, architecture, acceptance, privacy/security or dependency license notices. |
| `docs/device-workbench.schema.json` | Strict aggregate-only export bounds; reject ordered key-history injection. |
| `docs/licenses/serde-APACHE.txt` | Document scope, architecture, acceptance, privacy/security or dependency license notices. |
| `docs/licenses/serde-MIT.txt` | Document scope, architecture, acceptance, privacy/security or dependency license notices. |
| `docs/report.schema.json` | Backward-compatible optional identity fields. |
| `scripts/compile-schemas.mjs` | Build workbench schema and typed static validators without runtime eval. |
| `src-tauri/Cargo.lock` | Only add explicit Serde dependency to app; dependency versions unchanged. |
| `src-tauri/Cargo.toml` | Explicit already-locked Serde and Windows API feature flags. |
| `src-tauri/src/input_service.rs` | Typed bounded child stream, counters/history, cancellation/kill/wait/discard and narrow commands. |
| `src-tauri/src/main.rs` | Fixed helper modes, command registration, new report envelope and isolated fixture startup budgets. |
| `src-tauri/src/native.rs` | Optional typed container GUID, compatible IDs and location path evidence. |
| `src-tauri/src/raw_input.rs` | Original documented Raw Input metadata, packet decoder, focus/session/removal and registration cleanup. |
| `src/App.tsx` | Open workbench for selected node while preserving technical inventory/inspector. |
| `src/DeviceWorkbench.test.tsx` | Fixture UI lifecycle, X/report, editable-focus/unmount and target-switch regressions. |
| `src/DeviceWorkbench.tsx` | Selected-device views, native test controls, scoped cleanup and reviewable exports. |
| `src/bridge.ts` | Narrow native inspection/test/status/stop/discard bindings. |
| `src/core.ts` | Normalize/sanitize optional identity metadata without breaking old reports. |
| `src/generated/validators.ts` | Generated trusted static schemas; explicit Boolean signatures prevent compiler inference overflow. |
| `src/models.ts` | Optional evidence metadata; physical identity remains unknown. |
| `src/reporting.ts` | Register workbench export validator. |
| `src/styles.css` | Workbench/test-area/layout styles using existing design tokens. |
| `src/workbench.test.ts` | Grouping/source/privacy/schema/count-comparison regression tests. |
| `src/workbench.ts` | Logical relationships, endpoint attribution, symptom/X rationale and privacy-preserving aggregates. |

## Final distribution checksums

- AnyDevice-0.2.0-windows-x64.exe: 9,543,168 bytes; SHA-256 `d4a1470d7ded79b085874452c48e569ab5bd75ff978e40eb7120bfa63d925c1c`.
- AnyDevice_0.2.0_x64-setup.exe: 219,015,584 bytes; SHA-256 `b5b0cd043e911894cc7cfde889873359b1e099c4b31bdf3c6dd44887440d640c`.

The final standalone is downloaded with checksums/instructions in the sibling AnyDevice-0.2.0-candidate.5-windows-x64 folder. Installer is in the owner-visible draft and was validated on CI; it was not downloaded/installed locally. Packages are unsigned.

Run the standalone by double-clicking AnyDevice-0.2.0-windows-x64.exe in that final folder. Scan with native all-present-PnP scope, select the observed mouse/receiver or keyboard node, locate the Device Workbench above the inventory, select Live Tests and choose the mapped collection. Start explicitly and keep AnyDevice focused. These user-operated tests have not yet been performed by me.

## Final actual-host checks

The final standalone checksum matched the manifest and GitHub asset digest: `d4a1470d7ded79b085874452c48e569ab5bd75ff978e40eb7120bfa63d925c1c`, 9,543,168 bytes. Authenticode: **NotSigned**. It stayed alive after eight seconds with a nonzero window handle and title **AnyDevice**, with no developer server needed; only this test process was closed.

Read-only discovery returned **257 logical nodes / 25 named classes / zero collection errors**. All 257 had container GUID metadata; this is not 257 physical devices or unique physical containers. Raw Input metadata exposed **6 mapped logical collections: 2 mouse and 4 keyboard**. No particular collection was confirmed as the user's Logitech dongle mouse or Cosmic Byte keyboard. The trusted same-executable/actual-parent probe passed. A shell-parent verification and direct collector invocation with a forged parent were rejected before registration/collection. The probes do not collect key or mouse event payloads. Actual movement/click/scroll/keypress tests were **not performed**. Raw metadata stays private under work, not Git/release assets.

This follow-up record does not mark the first physical acceptance milestone complete. The packaged UI click-through, physical attribution, X/LED reproduction, complete keyboard/absolute-pointer validation, save/cancel/export accessibility and clean-machine upgrade/signing gates remain open.

## Run the final candidate

[Open executable location](<C:/Users/Aayush Tiwari/Documents/Codex/2026-10-12/referenced-chatgpt-conversation-this-is-an-2/outputs/AnyDevice-0.2.0-candidate.5-windows-x64/AnyDevice-0.2.0-windows-x64.exe>). Double-click this executable in File Explorer. Use native all-present-PnP scan, select the observed device node, find Device Workbench above the inventory, then choose Live Tests and the mapped input collection. The standalone needs existing WebView2; the draft installer includes the offline runtime.
