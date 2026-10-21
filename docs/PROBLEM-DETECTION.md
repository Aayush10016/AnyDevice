# Audio problem detection — 21 October 2026

This follow-up continues draft PR #6 on codex/evidence-first-diagnostics, based on codex/deep-diagnostics. It improves real diagnostics; it does not establish an audible playback or physical repair pass.

## Native evidence

`--inspect-audio` now reads the two required Windows audio services, Audiosrv and AudioEndpointBuilder, through Service Control Manager. Only SC_MANAGER_CONNECT and SERVICE_QUERY_STATUS rights are requested. Handles are closed through RAII. Native numeric service state, Windows/service-specific exit codes and original query errors are retained. A query error means unknown, not a stopped service. No start, stop or service configuration API is used. Bluetooth support is not a universally required service and is not flagged as a failure for USB/built-in audio.

The actual explicit test stream now reads ISimpleAudioVolume immediately before rendering/capture and at its final observation. A bounded `sessionVolume` packet carries mute, level or the original query error. Snapshot handling replaces old values with null on a failed query; each receipt records its time. This is different from the separate readiness client's state and endpoint master volume. It is a snapshot, not continuous mute history or proof that volume caused a symptom. Unknown future packet fields remain rejected. No setter is added. Samples and typed text are not collected by these new checks.

## Detection and interpretation

- Required audio service not running: a confirmed Windows service-path observation; physical device damage is not inferred. Service-query denial remains inconclusive.
- Muted or zero-volume endpoint: configuration warning with a targeted manual/approved next step; no automatic level increase.
- Muted/zero-volume actual test session: explicit configuration finding; an earlier readiness success cannot hide it.
- Failed native stream or readiness: a visible software/Windows-path failure, with original errors in advanced evidence. Known HRESULTs distinguish device invalidation (0x88890004), incompatible exclusive use (0x8889000A), rejected format (0x88890008), stopped audio service (0x88890010), access denial (0x80070005), and target not found (0x80070490). Unknown codes retain uncertainty; no guessed repair.
- Completed frames: engine-buffer evidence only. Missing sound remains an audible failure. The owner can record ordinary playback as working, silent or unknown through that same endpoint. Both paths silent supports a shared-path investigation; ordinary playback working narrows toward app/session/routing. Neither identifies a physical root cause.
- Refresh clears the current interval and comparison; historical snapshots remain labeled by their original session/time. Another endpoint or an incomplete interval cannot reuse a completed comparison. Audio checks retain their audio collection timestamp rather than borrowing the PnP scan time.

The workspace shows actionable findings and forwards completed investigation evidence to the existing dashboard and sanitized export. Original errors are redacted in sanitized check/session exports. The strict schema bounds volumes, optional timestamp and error length while accepting older reports without the new fields. No repair provider was invented for unknown causes.

## Verification boundaries

Automated tests cover wire decoding, bounds, replacement of stale session values, service failures/denial, zero-level/unsupported endpoints, HRESULT routing, comparison scope, refresh, original-error sanitization and report compatibility. Windows CI also exercises actual read-only service queries and existing native/installer smokes. Owner-PC checks and exact build/hash results are recorded separately in the dated delivery report after packaging.

The fresh baseline on 21 October still reports both CMF Buds 2 endpoints notPresent. Built-in playback/microphone readiness succeeds and the required audio services are running. No agent playback, capture, physical key/mouse/LED test, driver change or repair mutation is established. Live CMF testing remains blocked until reconnect. The exact Cosmic Byte model and a validated lighting control protocol remain unavailable.

## Primary references

- https://learn.microsoft.com/en-us/windows/win32/api/winsvc/nf-winsvc-queryservicestatus
- https://learn.microsoft.com/en-us/windows/win32/services/service-security-and-access-rights
- https://learn.microsoft.com/en-us/windows/win32/api/audioclient/nf-audioclient-isimpleaudiovolume-getmute
- https://learn.microsoft.com/en-us/windows/win32/api/audioclient/nf-audioclient-isimpleaudiovolume-getmastervolume
- https://learn.microsoft.com/en-us/windows/win32/coreaudio/recovering-from-an-invalid-device-error
- https://learn.microsoft.com/en-us/windows/win32/api/audioclient/nf-audioclient-iaudioclient-initialize

Service state is not audio function; session volume is not an acoustic measurement. No other application's sessions, process names or audio were enumerated/captured.
