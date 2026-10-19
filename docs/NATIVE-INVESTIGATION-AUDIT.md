# Native investigation audit

Baseline 876e165, clean codex/evidence-first-diagnostics, verified Aayush10016/AnyDevice and draft #6 → #5 → #4 → #3 → #2 → #1. Continue this existing branch/PR; no dependency merge or parallel framework.

P0 trace: AudioWorkspace → start_audio_test → owned helper → audio_native::run → Core Audio/WASAPI → bounded measurement/status packets → snapshot → UI/export. Existing error preservation works but no non-playing initialization probe establishes which stage the owner's endpoint supports. Playback starts without prefill and exits on elapsed time without draining the final queued frames. Submitted frames are not independently audible frames. Capture has real counts/levels, but error evidence and repeated calibration still require the actual chosen endpoint and comparable conditions. Windows documentation also recommends STA for first IAudioClient use; helpers currently initialize MTA.

P1 trace: lighting screen currently records owner statements only. It has no native system identity or LampArray enumeration and cannot truthfully say those discovery methods were attempted. Add bounded actual system/BIOS and interface discovery, retain method errors/absence/partial results, and distinguish an advertised interface from verified control. Never instantiate a lighting controller or write lighting values merely to discover it.

Implement: shared initialization/readiness path with structured stage/HRESULT; buffered playback drain/accounting; system/lighting discovery using fixed queries and inbox APIs; frontend exact-target results and provenance; tests and CI/package/native-host evidence. Existing mute authorization remains the only write provider. No arbitrary shell repair, vendor byte probing, driver installation, or fabricated physical finding.

Owner playback/capture/illumination acceptance remains separate. A readiness probe initializes/releases the client but never calls Start, reads samples or submits audio. Physical routing/static/LED causes remain unknown without owner measurements. Missing Cosmic Byte model remains a protocol gate.

Critical P0 root cause: Packet is an internally tagged enum. Serde rename_all changed variant names but not their struct fields; native timestampErrors was rejected where timestamp_errors was expected. Every first measurement could fail deserialization before snapshot frame accounting. Added rename_all_fields and an actual wire-JSON regression test; direct apply() fixtures did not exercise deserialization. This explains a code-level zero-frame failure path; physical acceptance still requires owner observation.


## Owner evidence and follow-up � 19 October 2026

The owner screenshot shows CMF Buds 2 playback active, endpoint mute false, endpoint volume 44%, 144000 submitted/dequeued frames over 3006 ms, left-channel peak 0.0300, opposite-channel peak zero, and cleanup confirmed. The owner reports hearing no sound and confirms ordinary playback is also silent. This substantiates an unresolved audible failure in the shared playback path; it does not identify Windows, Bluetooth, earbud hardware or an app-specific issue as the root cause. Engine consumption is not loopback or acoustic observation. No agent listened, captured microphone samples, changed audio settings or performed a physical acceptance test.

The original combined lighting helper crashed on the owner PC with Windows exception 0xC0000005 and no envelope, despite hosted CI passing. The failed substage was not established. Move only the WinRT LampArray query into a bounded child process: capture original exit status, impose an eight-second deadline and 256 KiB output bound, then continue fixed CIM/PnP discovery. This preserves partial evidence without converting a crash to "no backlight". Keep raw host evidence local. The exact Lenovo keyboard variant and Cosmic Byte model/revision remain unknown; no controller write is authorized by these observations.

The read-only readiness probe now obtains ISimpleAudioVolume mute/level for the initialized readiness session. This is distinct from endpoint volume and is a snapshot of that session, not proof of a later playback session or audible sound. Unsupported/error results remain visible in advanced evidence. No volume or mute setter was added.

Playback UI now labels stream submission separately from audible acceptance, promotes owner-reported silence, and offers an ordinary-playback comparison to narrow shared-path versus application-specific failure. Tone-mode silence is included in investigation findings; another endpoint's old session cannot establish a current mismatch.

References: Microsoft ISimpleAudioVolume GetMute and GetMasterVolume API documentation:
https://learn.microsoft.com/en-us/windows/win32/api/audioclient/nf-audioclient-isimpleaudiovolume-getmute
https://learn.microsoft.com/en-us/windows/win32/api/audioclient/nf-audioclient-isimpleaudiovolume-getmastervolume
