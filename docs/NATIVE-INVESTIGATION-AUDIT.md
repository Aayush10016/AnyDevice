# Native investigation audit

Baseline 876e165, clean codex/evidence-first-diagnostics, verified Aayush10016/AnyDevice and draft #6 → #5 → #4 → #3 → #2 → #1. Continue this existing branch/PR; no dependency merge or parallel framework.

P0 trace: AudioWorkspace → start_audio_test → owned helper → audio_native::run → Core Audio/WASAPI → bounded measurement/status packets → snapshot → UI/export. Existing error preservation works but no non-playing initialization probe establishes which stage the owner's endpoint supports. Playback starts without prefill and exits on elapsed time without draining the final queued frames. Submitted frames are not independently audible frames. Capture has real counts/levels, but error evidence and repeated calibration still require the actual chosen endpoint and comparable conditions. Windows documentation also recommends STA for first IAudioClient use; helpers currently initialize MTA.

P1 trace: lighting screen currently records owner statements only. It has no native system identity or LampArray enumeration and cannot truthfully say those discovery methods were attempted. Add bounded actual system/BIOS and interface discovery, retain method errors/absence/partial results, and distinguish an advertised interface from verified control. Never instantiate a lighting controller or write lighting values merely to discover it.

Implement: shared initialization/readiness path with structured stage/HRESULT; buffered playback drain/accounting; system/lighting discovery using fixed queries and inbox APIs; frontend exact-target results and provenance; tests and CI/package/native-host evidence. Existing mute authorization remains the only write provider. No arbitrary shell repair, vendor byte probing, driver installation, or fabricated physical finding.

Owner playback/capture/illumination acceptance remains separate. A readiness probe initializes/releases the client but never calls Start, reads samples or submits audio. Physical routing/static/LED causes remain unknown without owner measurements. Missing Cosmic Byte model remains a protocol gate.
