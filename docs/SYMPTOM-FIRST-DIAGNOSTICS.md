# Start with the problem, not a clean inventory

27 October 2026. The owner confirmed that the test tone is now audible; exact preset, routing and quality were not specified. The external Cosmic Byte right-arrow light remains owner-reported dark, with exact model unknown.

## What changed

“Full diagnostic scan” overstated the automatic coverage. It is now **Automatic Windows checks**, with a plain explanation of device status, available driver metadata, HID capability and audio configuration checks. Counts describe status/API observations rather than passed physical devices. The advanced before/after Investigation page is explicitly described as an advanced tool; device problems start in Diagnostics.

Diagnostics starts with **What is not working?** Reports can describe lighting, keyboard input, mouse input, playback or microphone symptoms and can begin before exact device/model identification. They use the existing DiagnosticCheck schema, user-reported confidence and potential_issue classification. They remain open across clean scans, inventory refresh and route changes; only automatic findings are invalidated by a refresh. Owners can associate an initially unidentified report with a device later. Resolution is an explicit owner observation, can be reopened, and never counts as an automatic repair or a successful status/API check.

Each report gives the measurement limit, distinguishing tests and actual repair availability. A lighting report is prominent even with zero Windows faults. Its plan separates key input from emitted light, current-mode observation from a documented controlled mode, and controller/software causes from a physical fault. The exact model gates model-specific controls, not the ability to record a dark light. The existing right-arrow comparison accepts observations without a model; its documented-mode checkbox remains unavailable until model evidence exists. Lighting records survive workbench remounts within the app session and a dark-light observation is forwarded to the shared report list.

The only implemented automatic repair remains the existing approved endpoint-unmute provider. A current active/muted endpoint finding now exposes **Review unmute fix**, routed to that exact endpoint's existing proposal/approval/readback workflow. Other problems do not get a pretend Fix button. No new device, driver, service, firmware, HID or lighting write is implemented or executed.

## Can a laptop detect an individual dark keyboard LED?

Not from ordinary keyboard input or a normal PnP status. A host can observe emitted light only if the device supplies suitable fault telemetry or an independent observation is supplied. Lighting commands and logical state do not prove physical emission. AnyDevice has no validated individual-LED fault telemetry or model-specific lighting-control provider for the owner's Cosmic Byte keyboard. The owner's visual report is useful evidence; it does not establish whether the cause is a mode/configuration, controller, LED, circuit or board.

Reverse engineering can establish what an exact device's control/status protocol means. It cannot manufacture fault telemetry that the device does not expose. Investigate identifiers, descriptors, official controls and authorized passive traffic first; do not transmit guessed reports. Standard LampArray defines lamp attributes and updates, not an independent optical health test. A camera/electrical measurement could add evidence in a suitable future workflow, but no such measurement is implemented here.

The same limit applies to hidden hardware problems generally: a particular fault must produce observable telemetry, an error or a discriminating functional measurement. A clean status scan cannot rule out every intermittent, electrical or physical defect. No universal hardware-health or reverse-engineering repair engine is implemented.

## Privacy and lifetime

Up to 32 reports are retained in the current app session. They are not uploaded or silently persisted to disk. Export before closing to retain evidence. Sanitized diagnostic export withholds owner free text and raw target identifiers while preserving symptom type, dates and owner-resolution state. Full exports retain the observation only when chosen by the owner. No microphone PCM or typed background content is collected by reporting a symptom.

## Verification

Tests exercise unknown-model lighting reports, honest classification, resolution/reopening, privacy/schema compatibility, prominent symptoms with zero Windows faults, explicit report entry, the real unmute-review route, and reported symptoms surviving an end-to-end mocked clean scan, refresh and export. Existing physical-circuit and stale-state limits remain asserted. Native controls are unchanged. Exact automated/CI/package and physical verification results are in the dated delivery report.

## Sources

- [USB-IF lighting and illumination usage specification](https://www.usb.org/sites/default/files/hutrr84_-_lighting_and_illumination_page.pdf): lamp attributes and host updates; not an optical emission measurement.
- [Microsoft LampArray](https://learn.microsoft.com/en-us/uwp/api/windows.devices.lights.lamparray): advertised lamp information and color-control methods.

## Remaining work

Validated device-specific telemetry/control profiles, passive protocol capture/import, event-log correlation, independent driver integrity and additional justified repair providers remain unimplemented. Reporting a symptom is not a substitute for implementing those capabilities, and the app does not present it as automatic fault detection.
