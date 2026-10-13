# Discovery/workspace audit — before implementation

Baseline: clean d4ca366 / packaged 92f1a4a, branch codex/device-workbench. PR2 is open against PR1's codex/investigation-platform; PR1 is open against main. Neither is merged. New work uses codex/discovery-workspaces.

Verified code causes:

- `workbench.ts` considers ancestors and shared containers when matching endpoints. An endpoint mapped to an ancestor/sibling can become selectable through the relationship list; selecting a broad USB node can legitimately expose both keyboard and mouse collections. The default is the first collection, irrespective of the user's intended category. This is logical topology, not evidence that a Logitech mouse is a keyboard.
- The default discovery scope excludes non-HID Mouse/Keyboard classes and Bluetooth/audio/camera nodes. The ordinary table exposes raw instance IDs, hubs and composite nodes as equally prominent entries.
- `App.tsx` renders the workbench above the inventory and simultaneously renders an inspector. It does not provide a dedicated workspace route.
- `DeviceWorkbench.tsx` omits punctuation/navigation/numpad keys; flex wrapping changes row placement. Technical lifecycle and endpoint identifiers dominate the normal test view.
- `raw_input.rs::mouse_events` drops absolute (0,0) reports because it checks only nonzero movement.
- `input_service.rs` determines repeat/held state by virtual key alone; two scan identities with the same VK can overwrite held state (notably Enter/numpad Enter). This can suppress a distinct down transition as repeat. Repeated down messages themselves cannot prove an operating-system repeat rather than a device duplicate.

- Frontend focus-loss/editable-field cancellation uses the same stop command as manual Stop. Parent finalization can turn that cancellation into `completed`, losing the interruption reason. This can produce misleading summaries; explicit cancellation reasons must survive queued packets and process cleanup.

Verified protections to preserve: native hDevice/type filtering, rejection of duplicate matching instance/kind endpoints, actual creator/executable ownership, foreground gating, cancellation/cleanup, 120s/10k packet limits, bounded histories, aggregate-only sanitized exports. Frontend polls the authoritative snapshot; history truncation does not truncate counters.

Unverified hypotheses for the user's X/mouse mismatch: wrong selected collection, several keyboard collections behind a receiver, focus/stop boundaries, device/firmware behavior, or attempt-count accuracy. No physical X presses or mouse actions were performed by the agent. Absolute-zero and shared-VK defects are regression-reproducible but do not establish the cause of those user reports. A controlled endpoint-by-endpoint procedure remains necessary; never infer a defective switch from missing measurements.

Horizontal page drift: wide keyboard rows, identifiers and tables can overflow. CSS containment is testable; actual WebView trackpad gesture behavior requires a user-operated desktop check. No global gesture interception is proposed.

Follow-up real-host model verification: the first 258-node packaged response exposed 35 Bluetooth-class candidates, including 29 radio/service nodes. Treating their host USB ancestry as peripheral placement was overbroad. Those radio/service nodes now classify as infrastructure, while six remote Bluetooth entries retain unknown live connection/placement. This is verified against native metadata and new fixtures, not a physical connection test. The response also reported one CM locate error 13 and complete=false; its missing-node/race cause is not established, and it is retained as partial evidence rather than suppressed.
