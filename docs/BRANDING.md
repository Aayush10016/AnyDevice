# Branding correction — Task 1

Official identity: **AnyDevice — Understand. Diagnose. Investigate.** USB remains a technical interface category.

Changed App.tsx (shell, tagline, general system icon), index.html (page title), tauri.conf.json (window title/tagline), Cargo.toml (description), main.rs (unsupported-platform message), README.md (vision/current capabilities/limits), report.schema.json (title), both workflows (future release text), package.json and scripts/check-branding.mjs (regression check).

Retained `io.anydevice.usbdoctor`: existing installation/local-storage identity. No identifier migration or upgrade behavior change is attempted. During Task 1, installer filename/product/version remained AnyDevice 0.1.0. Expansion separately increments to 0.2.0 for new capabilities and report schemas. No prior assets are changed. MASTER-SPEC.md is the immutable original supplied specification; docs/VALIDATION.md records the actual old window title observed. These are historical evidence, not active branding.

Baseline: 30 JavaScript tests passed, 1 opt-in hardware test skipped. Branding changes leave diagnostic rules, models, fixtures, discovery script and interface workflows unchanged. Native local tests require the previously missing MSVC linker; Windows CI remains the native validation gate. See the expansion validation record for subsequent tests.
