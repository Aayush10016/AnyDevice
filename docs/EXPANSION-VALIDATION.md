# Expansion validation record

13 October 2026, Windows x64. Verified application source: **4051275dcf5546861153ae75992c996a99f15df0**. The final source completes the general device/system native icon and rejects inherited/non-string export schema names. Later documentation-only changes do not change packaged app source. Branding correction was committed separately as 08f16a5 before expansion. Original 0.1.0 source 28eed5435a1dca47963775caa38578f5e054f709 and all original asset hashes remain unchanged.

| Check | Actual result |
| --- | --- |
| Baseline / branding-only frontend tests | 30 passed, one opt-in hardware test skipped |
| Branding-only production build and regression | Passed; diagnostic rules/discovery unchanged in that commit |
| Hardened frontend tests without hardware input | 50 passed, one opt-in integration skipped |
| With actual native all-PnP inventory | **51 passed across five suites** |
| TypeScript / production Vite build | Passed; standalone validators generated first |
| Strict CSP regression | Passed with string/wasm code generation disabled; no runtime Ajv compiler/eval required |
| Relevant local Rust tests | Actually attempted; blocked by missing MSVC link.exe; no local native compilation claimed |
| Rust formatting | Passed |
| Final Windows CI native tests | **14 passed** |
| CI native/fallback USB/HID parity | 1 matching logical node, zero shared-property differences/errors |
| CI broad native collection | 62 nodes; zero errors; 17 named classes |
| Windows NSIS/standalone packaging | Passed |
| CI install/binary integrity/launch/uninstall | Passed; installed/release binaries matched |
| Actual host USB/HID parity | Complete pairs matched **30 and later 32 nodes**, zero semantic shared-property differences/errors |
| Actual host broad native inventory | Complete scans returned **254 and later 256 nodes**, zero collection errors, **25 named classes** |
| Actual host permissions | Non-elevated token; no administrator elevation requested |
| Real domain report validation | Raw and sanitized schema 2.0 exports both validated; 254 nodes, 13 informational missing-property findings |
| Local hardened standalone launch | Passed with development servers stopped; alive after eight seconds with a nonzero window handle and title **AnyDevice**; only the test process was closed |
| Local standalone checksum | Matched CI checksum and staged asset digest |
| Local standalone Authenticode | **NotSigned** |
| Installer checksum / local signature | Checksum verified by staging CI and matched GitHub asset digest; installer not downloaded or signature-inspected locally |
| Actual frontend inspection | Branding, empty inventory, browser scan limitation, synthetic byte import/hash/hex, Ctrl+F focusing inventory search, minimum-width overflow check |
| Packaged interactive scan/export/dialog/visual/accessibility | Not performed; native UI inspection tool could not initialize |
| Safe deliberate unplug/replug / actual faulty device / clean Windows 10/11 upgrade / signing | Pending manual release gates |

Final export validation also rejects inherited Object member names and non-string schema versions. The native taskbar/installer icon is generated from the original general system SVG, replacing the old USB symbol.

The earlier 9b7a83a candidate passed smoke CI but was superseded before uploading assets after discovering runtime schema compilation conflicts with strict Tauri CSP. Those downloads are quarantined under private work, not delivered. The replacement precompiles repository-owned schemas and includes a CSP regression. Intermediate superseded CI jobs were cancelled; final build and PR checks passed.

Initial cross-source observations differed during device changes. Individual follow-up queries exposed different presence states; native collection now records explicit Boolean presence and excludes confirmed-absent nodes. Later apparent shared-property differences were parent identifier letter casing, not different parents. Verification compares Windows identifiers without case while preserving raw spelling. Bounded retries still fail on genuine mismatches or incomplete collections; one initial broad scan was correctly marked incomplete before fresh complete scans succeeded. Counts fluctuate and never represent a physical-device count or proof of health.

The 254-node native capture contained 13 nodes without class metadata, explaining 13 informational findings; no Windows problem codes or collection errors were observed in that capture. Actual named classes included USB, HIDClass, Bluetooth, MEDIA, AudioEndpoint, Camera, Net, DiskDrive, Volume and PrintQueue. These are PnP observations, not radio/stream/storage-health/volume-content inspection. Raw identities stay only in private work and were not committed/uploaded.

## Exact build and distribution

- [Windows build](https://github.com/Aayush10016/AnyDevice/actions/runs/38384074477): success.
- [PR build](https://github.com/Aayush10016/AnyDevice/actions/runs/38384080103): success.
- [Verified draft staging](https://github.com/Aayush10016/AnyDevice/actions/runs/38385045784): success; source/draft target/checksums verified before upload, no overwrite.
- [Owner-visible candidate 3 draft](https://github.com/Aayush10016/AnyDevice/releases/tag/untagged-2bde4fe13fd5e676936a): v0.2.0-candidate.3, prerelease, source 4051275dcf5546861153ae75992c996a99f15df0. Not published stable.

| File | Bytes | SHA-256 |
| --- | --- | --- |
| AnyDevice-0.2.0-windows-x64.exe | 9,141,760 | 8b15fda434d8a61aea3d99daeac7caeaf947b2d9583dee28dfd12c07572451aa |
| AnyDevice_0.2.0_x64-setup.exe | 218,916,327 | 16a7a587d7d2a7e1cc918962f1375763e4a73f8083ed2dc1b48ecea02afdf60d |

The final candidate 3 standalone embedded icon was extracted and visually confirmed as the new general system glyph. Its local launch/hash checks passed; its native helper matched 32 USB/HID nodes and collected 256 broad nodes across 25 named classes with no errors.

The standalone is downloaded in the sibling AnyDevice-0.2.0-candidate.3-windows-x64 directory with checksums/instructions. The installer and standalone are both staged in the separate draft; the installer includes offline WebView2, standalone requires existing WebView2. No signing credentials were configured. The source preserves io.anydevice.usbdoctor installation identity; clean-machine 0.1-to-0.2 upgrade behavior remains unverified.

All committed example reports are labelled synthetic and validated against their schemas, including the legacy v1 example. A genuine browser frontend screenshot uses explicitly synthetic bytes; it is not a packaged Windows screenshot or hardware observation. Native desktop inspection failed because the inspection tool could not initialize its kernel assets; no bypass or fabricated screenshot was used. Imported byte reads/hash/hex were actually exercised, while two-sample/annotation/schema workflows have automated coverage. The actual browser import fixture hash was 9b6ea804877376af9d20ef8afbc618ac7c9039539ddebdbc88b806ebb2357f39.

The minimum-width frontend check measured document client/scroll widths both 745 at a configured 760-pixel viewport (scrollbar excluded). Ctrl+F opened Devices and focused Search devices. Full keyboard/screen-reader/resizing QA remains pending.

No traffic capture, confirmed binary format, generated parser execution, physical-fault diagnosis or recovery action is claimed. See CAPABILITIES.md, ARCHITECTURE.md, RULES.md and BUILD.md for precise limits.
