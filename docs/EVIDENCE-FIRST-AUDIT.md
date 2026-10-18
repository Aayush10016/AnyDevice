# Evidence-first milestone checklist

Baseline: commit 1fb381f, draft PR #5. New branch is based on that complete tree; no merges are required to build it. The new draft PR targets codex/deep-diagnostics so the existing #5 → #4 → #3 → #2 → #1 dependencies remain intact.

## Existing and reused

- Real bounded PnP, Raw Input and WASAPI providers; exact endpoint mapping and explicit selection when ambiguous.
- Generated-channel tests, explicit ear reports, quiet/speech levels, strict exports, helper ownership, foreground/cancel cleanup.
- Input counts, scan identities, event timestamps, conventional reference layout, mouse buttons and both scroll directions.
- Nonce-bound mute proposal, fresh native state validation, separate rollback approval and comparable functional verification.
- Conservative topology grouping, offline HID descriptor parser and metadata-only HID collection inspection.

## Defects and implementation checklist

- [x] Dashboard currently promotes all Inconclusive entries into main findings; group coverage, collapse passes, retain every detailed check in exports.
- [x] Muted inactive records can misleadingly describe mute instead of unavailability. Mute in an automatic scan is a configuration warning, not proof of malfunction.
- [x] Audio startup/status failures retain a generic empty/active state, and a nonzero helper exit overwrites the validated native error stage; show lifecycle, actual stage/error and cleanup uncertainty, terminate a failed observation path.
- [x] Completed stream without valid measurement data must not pass; quiet/speech comparison must reject incomplete channel arrays and stream errors.
- [x] Diagnostic checks need versioned definition, evidence rationale, counter-evidence, unknowns, repair eligibility and verification requirements.
- [x] General keyboard tester exposes obsolete X-key mode; remove it from ordinary tests and correct fixed-unit row geometry.
- [x] Add useful no-event instructions and explicit separation of input, lock LEDs, vendor backlight controls and physical illumination.
- [x] Add owner-operated model/evidence-gated single-key lighting investigation, with no guessed commands.
- [x] Introduce an explicit narrow repair-provider registry without duplicating native authorization or claiming unavailable providers.
- [x] Add failure-oriented tests, final Windows CI/package verification and a delivery report.

## Explicitly outside this coherent subset

New controller provider, event-log correlation, ACPI/WMI/vendor lighting access, driver installation, gain/default/profile repair, FFT/static classifier, traffic capture and durable repair journal. Unsupported capability remains visible; no fake provider or decorative Fix button. No attached descriptor acquisition or physical circuit diagnosis is claimed.

## Requires owner participation

Actual mouse/key events, per-ear listening, quiet/speech/static reproduction, permission/indicator cleanup, an intentional mute/rollback exercise and illumination comparison under the exact model's documented mode. Laptop/Cosmic Byte model identity remains unknown until reliable evidence is supplied; lack of generic HID LED metadata never proves lack of backlighting.


CI found a focus-guard startup race: the listener previously waited for the first snapshot effect. Lifetime guards now cover pending start/first status too, with a regression test. Native OS foreground checks remain in place.
