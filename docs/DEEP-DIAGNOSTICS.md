# Deep diagnostics milestone

## Implemented workflow

Device pages use a capability registry. Exact case-insensitive Windows node identity can expose the corresponding playback/recording endpoint. Friendly name and container equality never silently select an audio path. Unmapped audio/Bluetooth candidates offer explicit endpoint choice; inactive/unsupported paths cannot start streams. Controllers and individual lighting operations stay unsupported. Grouping/removability evidence lives in Stats for nerds rather than repeated default paragraphs. Device identity remains a Windows association, not proven enclosure/receiver identity.

Full diagnostic scan uses native all-present-PnP discovery, logical input/HID inspection and Core Audio configuration. Driver provider/version/date are optional Windows-reported metadata, shown in advanced evidence and withheld by sanitized exports. Missing properties are not faults. Cancellation marks overall enumeration coverage interrupted; retained named observations do not constitute a completed workflow. Interactive checks have Choose/run and Skip controls; skipping never passes a test. Explicit audio sessions and ear observations are retained separately in the dashboard/report.

## Audio evidence

The previous inline L/R generator already zeroed the opposite channel. The old yes/no response could not distinguish correct-ear sound from both-ear sound, and no encoded-buffer isolation regression existed. The common native generator now produces WASAPI buffers and is tested across PCM8/16/24/32 and float32. Runtime per-channel statistics summarize the generated/submitted bytes. Standard L/R requires two channels and channel mask 0 or 3. Unsupported/mono layouts abstain. Previous streams are discarded before starting another; consent and foreground/owned-process constraints remain.

Record left/right/both/neither/unsure after each completed interval. Left then Right is a guided sequence of distinct user actions. Both during an isolated test is an issue observation, not a pass or a proven defective earbud. Structured hypotheses preserve supporting and contradicting evidence, confidence, distinguishing test and verification criterion. A correctly silent opposite generated channel weighs against an application-buffer duplication hypothesis, but cannot exclude downstream Windows mono processing, a Bluetooth profile, driver/APO or device mixing. No profile/default/processing setting is automatically modified. There is no independent physical stereo measurement.

Microphone tests retain bounded quiet/speech capture, numerical levels and stream flags. The live plot is an 80-update peak envelope, **not raw/replayable speech waveform**. Quiet RMS/dBFS is an uncalibrated digital noise-floor estimate including environment, gain and processing. Windows stream flags are not physical dropout counts/durations. No FFT classifier, universal acceptable noise threshold, PCM recording export or automatic audio upload exists.

## Repair verification

Only exact endpoint unmute/restore-mute is executable. Review presents the finding, effect, side effects, normal-user permission, expected outcome, rollback and verification; Cancel clears approval. Native nonce/expiry/expected-state/readback and activity exclusivity remain unchanged. Latest audit survives Audio-workspace navigation within the app session. Expired/failed proposals clear approval and require review again.

Before/after functional verification records a pre-repair session and a distinct repeated session on the same endpoint, mode and complete format. Both must complete and clean up, with no timing/discontinuity flags; recording requires valid per-channel measurements. Digital dB changes do not imply improvement. An additional explicit user observation records improved/unchanged/worse/unsure. Setting verification, numerical comparison and symptom observation remain separate in strict exports. No automatic playback/capture follows a repair. Audit/verification is volatile and bounded; export explicitly before exit. There is no durable recovery journal or atomic mute compare-and-set against external applications.

## Protocol inspection and lighting boundary

The Raw Input preparsed-data provider now has a metadata-only HID collection fallback using zero desired access and shared read/write sharing. It calls HidD_GetPreparsedData/HidP and frees the OS allocation/handle. It never calls ReadFile, WriteFile, GetFeature or SetFeature. The known native interface path is constrained to a bounded HID path. Controls/report lengths/IDs remain bounded; unknown usages remain numerical. These are Windows-interpreted facts, not a retrieved raw descriptor or reverse-engineered vendor protocol.

Binary workspace can explicitly inspect an imported HID report descriptor of 1–4096 bytes. The offline parser bounds items, nesting, report bit counts and report IDs; validates truncated items/stack/collection balance; preserves unknown short/long items; reports declared wire and Windows-buffer lengths. Import proves neither connected-device provenance nor model identity. Versioned observation profiles have `verifiedModel=false` and no validated operations. No imported declaration authorizes hardware writes.

Standard LED-page declarations can describe lock indicators; they do not establish per-key RGB control. A single dark key requires the exact model/revision, documented lighting mechanism, reproducible comparison with working keys, and user/independent illumination observations. A working key-event test does not test its light. With no validated lighting profile or optical measurement, no LED command is sent and no LED/circuit defect is diagnosed.

## Guided comparisons and remaining coverage

Investigation explains scan → baseline → one controlled action → refresh → capture → compare. Raw node changes/timeline are advanced details. Prerequisites for disabled controls are explained. Changed Windows nodes do not establish causality. The navigation label remains Investigation for compatibility, with a plain-language purpose and steps.

Not implemented: correlated Windows event-log provider, driver signature/provenance validation, raw USB descriptor acquisition, traffic capture/driver installation, verified vendor-operation profiles, individual LED control, camera-based illumination measurement, controller input provider, automatic gain/default/profile/driver repair. No decorative executable controls are provided for these capabilities.

## Primary documentation and dependency decision

- [Microsoft opening HID collections](https://learn.microsoft.com/en-us/windows-hardware/drivers/hid/opening-hid-collections) and [HidD_GetPreparsedData lifetime](https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/hidsdi/nf-hidsdi-hidd_getpreparseddata): use existing Microsoft bindings and inbox APIs; no driver stack or payload access is needed for this metadata slice.
- [CreateFile access/sharing](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilea): metadata handles request zero desired access; sharing flags do not grant write access.
- [Windows audio stream options](https://learn.microsoft.com/en-us/windows/win32/api/audioclient/ne-audioclient-audclnt_streamoptions): even RAW streams retain some endpoint/driver/hardware processing. Current shared-mode tests cannot prove physical separation; no undocumented mono/profile setting mutation is introduced.
- [HIDAPI](https://github.com/libusb/hidapi), [Microsoft HID samples](https://github.com/microsoft/Windows-driver-samples/tree/main/hid), and [USBPcap](https://github.com/desowin/usbpcap) were examined as research references. No code/dependency from these projects was copied or added. Capture/driver work requires a separate permission/compatibility/license review; it is not needed for metadata-only inspection. Existing Microsoft binding license notices remain applicable.

See DEEP-DIAGNOSTICS-AUDIT.md for baseline classification. Automated buffer tests prove generated bytes only; real CMF/keyboard/mouse/microphone and lighting acceptance must be recorded separately in the delivery report.
