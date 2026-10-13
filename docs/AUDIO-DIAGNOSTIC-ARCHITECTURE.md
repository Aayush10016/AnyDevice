# Diagnostic engine and audio milestone

This development candidate extends discovery/workspaces on `codex/audio-diagnostics`. Automatic diagnostics inspect Windows metadata. Sound, microphone capture and setting changes require distinct user actions. An operating-system result is never a universal physical-health verdict.

## Identity and grouping

Keep every Raw Input collection, including duplicate/ambiguous sources. A concrete USB ancestor instance may associate mouse and keyboard collections into one USB candidate; it does not prove one physical peripheral or identify a wireless receiver's paired objects. Different USB instances, platform/ACPI paths and button-converter infrastructure remain separate. Do not merge using VID/PID, friendly name or container equality alone. Prefer useful Windows-reported friendly names, labelled as reported identity rather than verified model identity. See the [baseline audit](AUDIO-DIAGNOSTIC-AUDIT.md).

## Implemented providers

| Provider | Evidence | Limits |
| --- | --- | --- |
| Configuration Manager / optional fixed PowerShell | Present PnP nodes, status/problem codes and bounded parent chains | OS nodes, not counts of physical objects or hardware health |
| Raw Input / Configuration Manager | Exact logical input collections and ancestry; explicit foreground input event sessions | Existing source-specific counters; no calibrated mouse latency/rate claim or physical-key attribution without user testing |
| Core Audio | All-state playback/recording endpoints, default console/multimedia/communications roles, mute, scalar level and shared mix format | Endpoint identity does not prove USB/Bluetooth transport, model or audibility; unavailable properties stay unknown |
| WASAPI playback | Selected endpoint, bounded quiet 440 Hz tone, left/right on standard stereo layouts | API submission is separate from user's audible confirmation; app does not change listening volume |
| WASAPI capture | Explicit selected recording endpoint, bounded eight-second quiet/speech measurements | Numerical samples only; no PCM retained, monitoring, calibrated SPL, enhancement/AGC inspection or universal noise threshold |
| Endpoint mute repair | Fresh proposal, explicit approval, expected-state check, mutation, readback, separate rollback approval | Configuration readback is not a verified physical repair; only latest operation can be rolled back during this app session |
| HID capability inspection | Windows preparsed collection data via HidP: usage/page, maximum report lengths, numerical button/value controls and report IDs | Read-only mouse/keyboard collections only. No raw descriptor download, custom bytecode parser, packet capture, reverse-engineered vendor semantics or hardware writes |

Core Audio uses documented [device properties](https://learn.microsoft.com/en-us/windows/win32/coreaudio/device-properties) and [stream management](https://learn.microsoft.com/en-us/windows/win32/coreaudio/stream-management). Capture buffers follow [IAudioCaptureClient::GetBuffer](https://learn.microsoft.com/en-us/windows/win32/api/audioclient/nf-audioclient-iaudiocaptureclient-getbuffer), with a release guard on every acquired packet. A silent buffer is measured as zeros without dereferencing its data pointer.

HID inspection uses [GetRawInputDeviceInfoW](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getrawinputdeviceinfow) and [HidP_GetCaps](https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/hidpi/nf-hidpi-hidp_getcaps). [Preparsed data](https://learn.microsoft.com/en-us/windows-hardware/drivers/hid/preparsed-data) is Windows-interpreted descriptor information, not a copy of raw report-descriptor bytes. The versioned `windows-hid-capabilities-1.0` record preserves unknown usages numerically and has no validated hardware operations. It is an observation profile, not a verified product protocol. Collection maximum lengths include the report-ID byte under [HIDP_CAPS](https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/hidpi/ns-hidpi-_hidp_caps).

## Orchestration and outcomes

Run diagnostics refreshes present PnP data, input/HID metadata and audio metadata, then produces checks. Pause applies after the current bounded read finishes; resume continues. Cancel interrupts registered PnP/audio scans and prevents subsequent steps. The existing input metadata read can take its bounded helper timeout before cancellation completes. Completed evidence remains visible. No orchestration step starts input registration, tones, capture or repairs.

Checks carry outcome, source/confidence, measurements, conclusion, next step and hypotheses. Outcomes are Passed, Issue detected, Inconclusive, Not supported, Not tested, and Cancelled or interrupted. Passed describes only the named check. Windows mute is a confirmed configuration observation; its role in a reported symptom is still a hypothesis. Static hypotheses distinguish environmental/gain/path possibilities and require controlled follow-up rather than declaring a defective microphone.

## Measurements and cleanup

RMS is square-root mean sample energy; dBFS is relative to digital full scale, with a -120 dBFS display floor for zero. Peak, exact-zero fraction, invalid sample count and near-full-scale fraction (absolute sample >= 0.999) are observations. This threshold does not define universal microphone quality. Live windows cover received packets since the preceding approximately 100 ms update; final aggregates cover all received samples. Quiet/speech comparison requires completed tests on the same endpoint and format. User-declared quiet conditions are not proof of environmental silence. Stream discontinuity/timestamp flags are API observations, not proof of physical dropouts. No FFT/static-frequency identification is implemented.

Formats are bounded to 1–8 channels, 8–384 kHz, PCM 8/16/24/32 or float32, with validated block alignment. L/R additionally requires standard stereo mapping. Other formats/layouts abstain. Capture packets are limited to 8 MiB; metadata/evidence envelopes and per-line packets are bounded. Owned hidden child processes isolate COM/driver stalls. Actual-parent/matching-image checks, a held parent handle and foreground checks gate capture/playback. Stop, navigation, loss of focus, timeout and parent exit terminate the stream. A Windows kill-on-job-close job handles parent exit; the parent also kills and awaits children before confirming cleanup. An exclusive native activity permit serializes audio tests with setting writes.

## Repairs, privacy and unsupported work

Only endpoint unmute/restoration is implemented. Proposals expire after 120 seconds. Approval is specific to the proposal nonce and named endpoint. The helper rechecks active state and expected mute immediately before writing, then reads the flag back. If state differs, the operation fails closed. If outcome is unverified, users must inspect Windows settings; no success claim or automatic inverse write is made. There is no atomic compare-and-set for external Windows mute changes: another application can race the check. Repeat the explicit functional test after any verified setting change. Closing/switching workspaces can remove the visible rollback control; use Windows mute controls manually if needed. No durable repair audit/recovery journal is implemented.

Diagnostics and audio reports use strict `diagnostic-engine-1.0` validation. Sanitized exports alias endpoint/target IDs, withhold names, instance/container IDs and technical free text, retain numerical measurements and bind current audibility/static feedback to its session ID. No audio sample buffer or typed keyboard text is exported. Preview before sharing; timestamps and capability numbers remain evidence. Session history is bounded to eight and volatile.

Unsupported: default-device changes, gain/enhancement changes, device restart, driver install/removal, firmware, USBPcap/libusb capture, raw HID report-descriptor import/parsing, verified vendor profiles, LED commands and physical LED verification. No arbitrary output/feature reports are sent. These are future engineering work, not placeholder repair controls.
