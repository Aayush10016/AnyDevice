# Native audio readiness and lighting investigation

## Audio path

The critical zero-frame defect was in the wire protocol: Serde renamed enum variants but not measurement fields. Native camelCase timestampErrors failed the strict parser expecting snake_case, before any frame reached the snapshot. The parser now explicitly renames enum fields; a regression test deserializes the helper JSON rather than constructing a Packet directly. Unknown fields remain rejected. This is a demonstrated code defect, not independent physical acceptance.

The readiness command and real playback/capture share `audio_native::prepare`: resolve the exact active endpoint, validate flow, read the shared format, initialize WASAPI, obtain buffer size and open the appropriate service. Readiness releases these objects without calling Start, obtaining capture data or submitting a render buffer. It establishes only initialization/service access. It may fail on endpoint availability, policy, format or resource conditions; the actual stage, original Windows text and available HRESULT are retained.

The dedicated audio helper now initializes COM as STA, following Microsoft's first-use guidance for IAudioClient. This is a documented implementation correction, not proof that MTA caused the owner's failure. Playback prefills its own buffer before Start, submits the bounded three-second signal, and waits for its queue to drain with a five-second deadline. A partial submission or undrained queue is a failure. Render generation failure releases silence instead of exposing unfinished data. Microphone capture remains an explicitly approved eight-second level-only measurement.

Snapshots now include elapsed milliseconds and optional frames dequeued from the playback endpoint buffer (submitted minus current padding). Captured frames, submitted frames, dequeued frames, user-reported audibility and independent physical verification are distinct. No loopback recording is added: capturing a system mix would need its own scope/consent and would still not verify a physical speaker. Existing L/R byte-isolation and quiet/speech comparability tests remain.

Readiness appears only for the explicitly chosen endpoint. Changing/refreshing the endpoint clears its displayed readiness evidence. A result is added to the existing diagnostic checks/export, with source time and explicit classification; it cannot supply playback/capture frames or establish functional health. Detailed errors are local; sanitized exports withhold technical free text that could contain identities.

## Lighting path

`Discover lighting capabilities` invokes the bounded native helper. It queries LampArray.GetDeviceSelector and DeviceInformation only; it does **not** instantiate a LampArray controller or set a lighting property. Advertised interface means control remains unknown, not a validated operation. Empty completed enumeration means no supported advertised interface found, not no backlight. API errors/partial methods remain visible.

The helper executes a fixed embedded read-only CIM script for manufacturer/model/family, BIOS version, selected vendor-service names and keyboard WMI class names. No serial, user name, service executable path, arbitrary script input or method invocation is needed. These names are hints, not compatible vendor protocols. The helper reuses the existing all-present-PnP provider for bounded keyboard/HID/ACPI supporting nodes. The outer owned process job and 35-second timeout cover the helper and its CIM child. Cancel/navigation kills an active discovery; a never-used panel does not cancel an unrelated scan.

The screen exposes system identity, attempted methods, advertised interfaces, individual method errors and advanced topology. A sanitized evidence export records counts/method coverage without raw model IDs or error free text. Existing selected-device advanced evidence retains exact USB/HID nodes, VID/PID and mapped input paths. Neither a laptop identity nor a generic USB association identifies the unknown Cosmic Byte model/revision. The owner must still supply its label/manual and distinguish input versus key/zone/mode illumination. There is no validated lighting write profile.

## Dependencies and research

No additional driver or third-party library is introduced. Existing MIT/Apache-licensed Microsoft `windows` bindings enable Devices.Enumeration, Devices.Lights, Foundation collections and WinRT initialization. Cargo.lock versions remain pinned. Inbox CIM/Configuration Manager supplies other evidence.

- [Microsoft IAudioClient.Initialize](https://learn.microsoft.com/en-us/windows/win32/api/audioclient/nf-audioclient-iaudioclient-initialize): apartment guidance, shared-mode format and initialization failures.
- [Dynamic Lighting](https://learn.microsoft.com/en-us/windows/apps/develop/devices-sensors/lighting-dynamic-lamparray) and [LampArray selector](https://learn.microsoft.com/en-us/uwp/api/windows.devices.lights.lamparray.getdeviceselector?view=winrt-26100): discovery is separate from controlling a compatible device.
- [Microsoft HID report transmission](https://learn.microsoft.com/en-us/windows-hardware/drivers/hid/sending-hid-reports): input/feature/output are different operations; no arbitrary report transmission is used.
- [HIDAPI](https://github.com/libusb/hidapi) and its referenced hidapitester console utility were researched, not added or run against unknown reports. USBPcap/Wireshark passive capture remains unimplemented; no filter driver is installed.
- [Cosmic Byte model-specific support](https://www.thecosmicbyte.com/downloaddrivers/) and [Orbit](https://www.thecosmicbyte.com/orbit/): neither proves compatibility for an unknown keyboard. No browser device grant or software installation was performed.

## Remaining boundaries

Only the existing approved mute/rollback provider changes endpoint settings. No driver repair, default-route mutation, gain/profile change, firmware/EC/ACPI write, arbitrary registry repair, or lighting command was added. Controller interaction, event-log correlation, driver integrity validation, raw attached HID descriptors and a calibrated static classifier remain unimplemented. Raw microphone PCM and translated keystroke text are not retained/uploaded.

Owner acceptance: select exact audio endpoint → Check endpoint readiness → inspect actual stage/HRESULT → explicitly approve playback or capture → compare current frame/duration evidence with hearing/speech. For lighting, run discovery first, distinguish completed/blocked/advertised results, then identify the exact model before a documented owner-operated comparison. Record physical outcomes separately; a readiness pass or advertised interface is not physical acceptance.
