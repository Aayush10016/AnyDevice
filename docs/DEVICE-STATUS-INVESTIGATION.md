# Exact-node problem detection and verification — 27 October 2026

The unified diagnostic scan previously evaluated Windows status only for peripheral candidates and reduced any problem to a count. It could omit a failing supporting hub/adapter or lose which child node reported the problem. It also disagreed with the older inventory rule about DEGRADED status.

The scan now evaluates every collected PnP node once, including infrastructure. Each finding retains its exact logical target, original numeric problem code, status, collection time, provider/scope and available driver metadata. Driver fields remain a dated inventory snapshot; a status-only recheck does not pretend to refresh them. Device names and candidate navigation resolve the underlying node rather than silently losing the target. This is Windows status, not a test of physical function.

Specific Windows meanings and next investigations cover codes 10, 14, 18, 19, 22, 28, 31, 43, 45, 48 and 52. Other codes retain their number and an unknown-cause explanation. A blocked or unverifiable driver is Windows-reported evidence, not independent file-signature/integrity analysis. No driver download, registry modification, signature bypass or device enable/restart is performed.

## Recheck after an appropriate correction

In Diagnostics, a PnP finding exposes **Recheck Windows status**. It calls a bounded Tauri command and an isolated native helper with the exact device instance ID. `CM_Locate_DevNodeW` uses `CM_LOCATE_DEVNODE_NORMAL`, then `CM_Get_DevNode_Status` reads flags and problem code. Empty/control-containing/oversized IDs are rejected rather than accidentally selecting the root. The child has the existing 35-second timeout and process cleanup; the activity gate prevents overlap with an interactive device test. No phantom lookup, cancel-remove flag, reenumeration or write API is used.

The returned target, primitive bounds, status consistency and timestamp are validated. Native failures retain the stage and CONFIGRET value; CONFIGRET is distinct from a device problem code. A missing node, query failure, malformed reply, identity mismatch or older observation cannot become a pass. A late result cannot overwrite a replacement scan or publish through an unmounted view.

The first baseline code/status/time survives repeated rechecks, including an originally unknown code. The current check records the later result separately. OK/code-zero on the same present node means **Windows status clear; physical symptom unverified**. It never means “repair succeeded.” A supported functional test or explicit physical observation must verify the original symptom. Disappearance is inconclusive, not recovery. The existing sanitized diagnostic export retains this comparison while withholding instance IDs and native free text.

A regular inventory refresh clears the previous diagnostic check set and prompts a new diagnostic run. This prevents old findings from remaining beside a new scan or accepting a late old recheck. Rechecking status does not update the original inventory or its driver snapshot; use a full refresh for those fields.

## Repair boundary

Only the existing approved endpoint-mute provider is an implemented automatic repair. PnP problem codes often require context before selecting a correction. Their guidance is manual and code-specific, followed by the new read-only verification. No new automatic repair is offered without validated preconditions, approval, outcome verification and recovery behavior.

## Verification

Regression coverage includes infrastructure failures without candidates, DEGRADED and unknown codes, code-specific guidance, same-node recovery versus physical uncertainty, persistent faults, missing/denied targets, old/contradictory/mismatched packets, original unknown baselines, driver timestamp retention, export privacy/schema compatibility, explicit invocation and late-result suppression. Native tests cover identity validation and non-success failure envelopes. Windows CI exercises a real present-node query and an invented missing target, plus the existing full suite, native discovery and installer checks. Exact pass counts/build hashes and owner-PC observations belong in the dated delivery report.

No physical device fault is deliberately induced. No hardware repair, key/mouse/illumination acceptance or moderate-tone acceptance is claimed by these tests. Event-log correlation, independent driver integrity, validated vendor lighting profiles and additional repair providers remain work to do.

## Primary references

- [Microsoft Device Manager error messages](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/device-manager-error-messages)
- [Microsoft CM_Locate_DevNodeW: exact identity and NORMAL/PHANTOM/CANCELREMOVE distinctions](https://learn.microsoft.com/en-us/windows/win32/api/cfgmgr32/nf-cfgmgr32-cm_locate_devnodew)
- [Microsoft status and problem-code retrieval](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/retrieving-the-status-and-problem-code-for-a-device-instance)
