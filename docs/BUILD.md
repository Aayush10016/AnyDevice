# Build and release

Supported build host: Windows x64 with Node 22+, Rust stable `x86_64-pc-windows-msvc`, Visual Studio C++ Build Tools and Windows SDK, WebView2, Windows PowerShell 5.1 and PnpDevice.

```powershell
npm ci
npm test
npm run build
cargo fmt --manifest-path src-tauri/Cargo.toml
cargo test --manifest-path src-tauri/Cargo.toml
npm run package
```

NSIS output is normally `src-tauri/target/release/bundle/nsis/AnyDevice_0.1.0_x64-setup.exe`; standalone binary is `src-tauri/target/release/anydevice.exe`. These are expected paths, **not a claim that files currently exist**. `offlineInstaller` bundles the Microsoft WebView2 installer so end-user installation does not require Node/Rust/Python. Build-time network access is needed to obtain dependencies and bundler resources.

The packaging command explicitly enables `custom-protocol` to embed the frontend. A release startup assertion rejects development mode. `--no-binary-patching` keeps the installed and standalone executable byte-identical: Tauri's per-bundle updater marker patching is unnecessary because AnyDevice has no updater plugin. CI keeps a strict SHA-256 equality check between installed and release binaries.

Workflow `.github/workflows/windows.yml` runs frontend tests/type checking, Rust tests, the fixed discovery adapter, NSIS packaging, silent installation into the runner's temporary folder, installed-binary checksum comparison, process-launch smoke test and silent uninstallation. It uploads unsigned versioned installer/portable artifacts and SHA-256 checksums. A `v0.1.0` tag creates a **draft** GitHub release after success. Draft publication requires manually passing the gates below. Hosted CI may have no physical USB devices; empty results are valid. Process survival does not verify visual UI or physical hardware behavior.

## Signing strategy

Current builds are unsigned. Before signed distribution, obtain a trusted code-signing certificate or supported cloud signing service, store credentials only in repository/environment secrets, configure Tauri `signCommand` or certificate/thumbprint signing, timestamp signatures, and verify every executable using `Get-AuthenticodeSignature` plus `signtool verify /pa`. Release only when a valid trusted signature is observed. Never commit certificates, private keys or tokens. No signing credentials were available in this task.

## Manual release gates

1. Install the NSIS build as a normal user on clean Windows 10 and Windows 11 x64, including a machine with no WebView2; confirm bundled installation behavior, launch and uninstall.
2. With networking disconnected, enumerate real mouse, keyboard, composite device and a phone. Compare each instance ID/status/problem code with Device Manager.
3. Unplug/replug a safe peripheral, scan twice, verify disappearance wording; validate cancellation, 45-second timeout and retained stale inventory. Never intentionally damage or modify devices to produce errors.
4. Export raw and sanitized JSON to a user-chosen directory; inspect identifiers removed from all arrays, findings and error messages, confirm save cancellation and invalid/unwritable path feedback.
5. Test keyboard navigation, screen reader, scaling, dark/light/system and resizing with the inspector open. Capture genuine packaged screenshots with safe data.
6. Verify checksums, version consistency and signing status. Only then publish the draft release.

Changes to the app version must update package.json, Cargo.toml, tauri.conf.json, models/report version and workflow artifact names together. Cargo.lock and package-lock.json are tracked; CI uses locked native dependencies and `npm ci` for repeatable resolution.
