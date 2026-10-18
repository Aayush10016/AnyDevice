# Code audit before implementation — 18 October 2026

Baseline 2014974, clean `codex/audio-diagnostics`; new work on `codex/deep-diagnostics`. Existing pipeline previously passed 95 frontend / 37 Rust tests and packaged installation/launch checks. These are historical results, not new physical acceptance.

| Capability | Classification at baseline | Code path / reason |
| --- | --- | --- |
| Candidate/logical input grouping | Implemented, insufficient physical validation | inventoryModel uses concrete USB boundaries; Raw Input preserves collection identity. Receiver/physical-object ambiguity remains |
| Device-to-audio navigation | Not implemented | App passes audio selection only from endpoint cards; DeviceWorkbench has no audio callback. Generic unsupported sentence therefore misleads audio users |
| Normal metadata presentation | Partially implemented | DeviceWorkbench Overview maps every candidate.evidence string into paragraphs; inventoryModel appends per-node removability facts. Repetition is presentation, not new findings |
| Audio enumeration / capture / output | Implemented, insufficient physical validation | audio_native uses Core Audio/WASAPI; foreground-owned bounded helpers and no PCM retention. Last host had CMF entries notPresent |
| L/R sample generation | Implemented, insufficient validation | Inline loop explicitly zeros opposite channel, but no buffer-isolation unit tests. Shared-mode/device processing can alter downstream sound. No physical cause for both-ear observation established |
| Physical channel observations | Partially implemented | AudioWorkspace yes/no question cannot distinguish left, right, both, neither, unsure. One mutable response replaces previous test's response |
| Whole-device diagnostics | Partially implemented | App orchestrates bounded read-only metadata but uses current limited scope; cancellation can leave an old Passed enumeration visible. No integrated user-test coverage workflow |
| Root-cause layer | Partially implemented | Typed checks and possible hypotheses exist; no structured supporting/contradictory evidence or channel mismatch investigation |
| Investigation comparisons | Implemented, insufficient UX | WorkspacePanels shows raw IDs, timeline and counts by default, lacks prerequisite explanations; compare/capture enforces complete same-scope snapshots |
| Repair | Implemented, insufficient hardware validation | Exact unmute nonce/expiry, native Activity gate, expected-state/readback and latest rollback. UI loses context on navigation and lacks Cancel/retry/functional retest outcome |
| Protocol inspection | Partially implemented | hid_inspection uses Raw Input preparsed data only; all six prior host queries unavailable. No collection-handle fallback or raw descriptor parser/import |
| Individual keyboard LEDs / controllers | Not implemented | No verified model/profile or physical optical observation; no output/feature writes. Correctly unsupported, not a failed-LED diagnosis |
| Privacy / consent / cleanup | Implemented, partially validated | Approval, actual parent/image, foreground, job close, byte/time limits, strict frontend export schemas. PCM/text excluded. Physical capture-indicator behavior remains untested |

Reuse collectors and comparison/consent logic. Implement evidence-backed navigation, explicit channel observations, test the actual rendering helper, metadata-only HID fallback, guided comparisons and functional recheck reporting. Keep profile/LED operations unavailable without verified identity and semantics. No driver stack or guessed lighting bytes will be introduced.
