# Device Workbench milestone plan

Baseline: clean codex/investigation-platform at 0c68104; packaged source 4051275; 50 frontend tests passed and one opt-in integration skipped. Tauri 2/React 19/TypeScript/Vite/Rust; original fixed fallback, native collector, report schemas/preferences and installation ID preserved. New branch: codex/device-workbench.

1. Add optional native container/location/compatible-ID evidence without breaking schema 2.0. Explain parent/container relationships independently of physical identity.
2. Add a selected-node workbench and native input endpoint inspection. Map Raw Input interface paths through Configuration Manager to instance IDs, without VID/PID or friendly-name guesses.
3. Add an explicit bounded foreground-only test process: movement/buttons/wheels and keyboard down/up/repeat/held counts; stop/reset/disconnect/focus/cancellation. X-only mode separates reported attempts from measured presses.
4. Add selected-device symptoms, evidence-linked investigation rationale and local reviewable aggregate export. No text/key-sequence persistence or hardware writes.
5. Test domains/components/native boundary, Windows CI and packages; publish only a separate unsigned draft candidate. Real movement/click/key/X-fault/LED acceptance remains Not tested until performed by the user.

Native design uses a separate same-executable process so Raw Input registration cannot replace Tauri's registration. Only an explicitly started session registers input, only the mapped selected handle is decoded, collection stops on application focus loss and is bounded to 120 seconds / 10,000 packets. No kernel driver or speculative report writes. Protocol decoding, lighting/recovery and persistent projects are later milestones.
