# Codex Master Prompt — AnyDevice
## Build a Premium Windows Desktop Diagnostic & Reverse-Engineering Application

You are the lead software architect, senior Windows systems engineer, product designer, and QA engineer responsible for building **AnyDevice**, a serious open-source desktop application.

Your task is to implement a working, testable, distributable Windows application—not merely generate a design, scaffold, landing page, or prototype.

## 1. Product vision

**AnyDevice — Understand. Diagnose. Recover.**

AnyDevice is a local-first Windows desktop application designed to help users investigate connected devices, diagnose device-related problems using observable evidence, and eventually reverse-engineer supported interfaces and protocols.

The long-term vision includes:

- USB device discovery and inspection.
- Evidence-based device diagnostics.
- Bluetooth discovery and connection analysis.
- USB and supported protocol investigation.
- Undocumented file/protocol format analysis.
- Generated parsers, clients, and regression tests.
- Safe, verifiable repair workflows for supported software faults.

Do not attempt to implement every future capability in the first release. Build a strong foundation and complete the initial diagnostic workflow end to end.

The first release is **AnyDevice v0.1 — USB Doctor**.

Its purpose is to enumerate devices exposed by Windows, inspect their available properties and status, identify common connection problems where evidence permits, and provide actionable explanations without pretending to know more than the evidence establishes.

## 2. Non-negotiable product requirements

1. This must be a downloadable Windows desktop application distributed through GitHub Releases.
2. The user must be able to install and launch it without installing Python, Node.js, Rust, or development tools separately.
3. The primary deliverable must be a working Windows `.exe` installer or a clearly documented standalone executable, preferably both when feasible.
4. Do not build a website, SaaS application, hosted dashboard, or web-only substitute.
5. Device enumeration and diagnostics must actually work on supported Windows systems.
6. All device information must remain local by default. No mandatory accounts, analytics, telemetry, cloud processing, or external AI APIs.
7. No destructive device operations, firmware flashing, driver replacement, or privileged repair actions in v0.1.
8. Never fabricate device properties, diagnostic evidence, test results, or repair success.
9. Maintain a clean architecture that supports future diagnostic modules without requiring a complete rewrite.
10. Deliver source code, tests, documentation, licensing, and build instructions alongside the application.

## 3. Research the design before implementing the UI

Before writing the frontend, study high-quality desktop software interfaces and contemporary design references.

Look at relevant work from:

- Figma Community: professional desktop application and developer-tool UI kits.
- Linear: information hierarchy, typography, navigation, and restrained visual design.
- Raycast: command-oriented workflows, keyboard navigation, and compact interactions.
- GitHub Desktop: approachable technical information and clear operational states.
- Premium system utilities and professional diagnostics software: device tables, inspection panels, logs, and status indicators.

Use available online references and inspect actual screenshots or designs where accessible. If a particular reference is inaccessible, move on rather than inventing observations.

Extract design principles, not copied layouts. Do not reproduce proprietary branding or copy another application's interface pixel for pixel.

Before implementation, establish a small design system covering:

- Color tokens.
- Typography and font sizes.
- Spacing and layout.
- Surface hierarchy.
- Borders and dividers.
- Iconography.
- Status indicators.
- Interactive states.
- Keyboard accessibility.
- Empty, loading, success, warning, and error states.

The final UI must look deliberately designed for AnyDevice, rather than assembled from a generic dashboard template.

## 4. Visual direction — extremely important

The intended experience is **premium, modern, minimal, precise, and quietly technical**.

Think carefully designed desktop engineering software: excellent alignment, confident typography, restrained color, readable data, clear interaction states, and purposeful use of whitespace.

### Color direction

Use a restrained neutral palette:

- Warm or neutral off-white backgrounds for light mode.
- Deep charcoal or graphite surfaces for dark mode.
- Clear neutral text hierarchy.
- One restrained brand accent, such as muted blue or a carefully selected teal.
- Green for verified success, amber for warnings, and red for actual errors.

Use semantic colors consistently.

Avoid a strong purple tint throughout the application.

### Strictly prohibited design patterns

- Generic AI-generated dashboard aesthetics.
- Purple or violet gradients.
- Glassmorphism and translucent floating glass panels.
- Glowing borders, neon accents, and excessive shadows.
- Excessive background textures, noise, decorative grids, or abstract blobs.
- Giant headings and oversized marketing-style hero sections.
- Excessive rounded cards nested inside other rounded cards.
- Emoji used as application icons.
- Random decorative charts that do not represent real data.
- Fake AI-generated insights or fabricated device metrics.
- Generic gradient logos.
- Overused, fashionable typography chosen solely because it appears in AI-generated designs.
- A web landing page repackaged as a desktop application.

Use a mature, highly legible font. Prefer a suitable system font or a properly licensed font with excellent Windows rendering. Segoe UI or another carefully selected UI typeface is acceptable. Package any non-system fonts legally and reliably.

Use a consistent icon set such as Lucide, with restrained stroke weights and consistent sizing.

Avoid gratuitous animation. Motion should communicate state changes, transitions, progress, or selection.

Every visible element must serve a purpose.

## 5. Proposed desktop experience

Design a genuine desktop application, not a browser dashboard.

### Application shell

Create a polished application shell with:

- A custom, well-integrated title bar where supported.
- A compact left navigation rail or sidebar.
- A primary content area with sensible width constraints.
- A contextual device-details panel when appropriate.
- A small, informative status area.
- Consistent application-level spacing and alignment.

Suggested navigation:

1. **Overview** — device summary and recent diagnostic activity.
2. **Devices** — connected devices and their actual status.
3. **Diagnostics** — supported checks, findings, and recommendations.
4. **Reports** — saved diagnostic reports.
5. **Settings** — appearance, privacy, and application preferences.

Only expose routes that have implemented functionality. Future features may be displayed as clearly labelled unavailable capabilities, but do not create empty pages pretending to be finished features.

### Overview

Create a useful operational overview with:

- A clear heading and concise explanation.
- A primary action to scan for devices.
- A count of currently detected devices, calculated from actual results.
- A count of devices with observed errors, based on real status information.
- A recent activity list based on actual local events.
- A concise explanation of what AnyDevice can currently inspect.

Do not fill the overview with arbitrary KPI cards. Prefer a focused composition with a useful device list or recent scan summary.

### Device discovery screen

This is the core screen and deserves the most design attention.

Include:

- Scan and refresh controls.
- Search by device name, class, or identifier.
- Useful filters for device category and status.
- A clean device list or table.
- Device name and category.
- Actual Windows-reported status.
- Available vendor and product identifiers.
- Last observed time when supported by real collected data.
- A clear indication of whether the information is current or stale.

Selecting a device should open a detailed inspection view.

The interface must handle empty results, slow scans, unavailable permissions, unsupported devices, partial results, and enumeration errors elegantly.

### Device inspection

Display the properties that Windows actually exposes.

Where available, include:

- Friendly name.
- Device class.
- Instance ID.
- Hardware IDs.
- Manufacturer.
- Vendor and product IDs.
- Current status.
- Problem or error code.
- Relevant parent or connection information.
- Data source and time of collection.

Missing properties must be displayed as unavailable, not filled with guesses.

Include a raw-evidence view for technically advanced users. Make identifiers copyable, and provide an option to export sanitized diagnostic evidence.

### Diagnostics screen

Present diagnostic results in a clear, evidence-backed format.

Each finding must contain:

- A concise title.
- Severity.
- Observed facts.
- Possible explanation.
- Confidence level or confidence category.
- Supporting evidence.
- Recommended next test or safe action.
- Limitations and unresolved questions.

Clearly distinguish between:

- Confirmed observations.
- Windows-reported errors.
- Likely causes.
- Untested hypotheses.

Never imply that a diagnosis has been confirmed merely because it is plausible.

### Reports

Support exporting diagnostic reports as JSON in v0.1.

Reports should include:

- Report schema version.
- Application version.
- Collection timestamp.
- Operating system information when available.
- Device observations.
- Diagnostic findings.
- Evidence references.
- Limitations.
- Errors encountered during collection.

Add a clean, readable report preview. A polished HTML or text report can be added if time permits, but JSON export is mandatory.

Provide a way to review and sanitize sensitive identifiers before sharing a report.

### Settings

Implement only settings that work:

- Light, dark, and system appearance preferences.
- Privacy and data collection explanation.
- Report sanitization options.
- Application version.
- Open-source licenses and acknowledgements.
- Links to project documentation and repository.

Persist preferences locally.

## 6. Technical architecture

First inspect the existing repository, its files, Git status, installed toolchains, and existing implementation.

Preserve useful existing work. Do not overwrite an existing project or blindly regenerate its files.

If the repository is empty, choose a stable and maintainable architecture.

### Preferred stack

**Desktop shell and frontend**

- Tauri 2.
- React.
- TypeScript.
- Vite.
- A restrained, accessible component system implemented and customized for AnyDevice.
- Lucide icons.

**Native integration**

- Rust commands exposed through Tauri.
- Windows-native device enumeration and property retrieval using appropriate Windows APIs and maintained Rust bindings.
- PowerShell PnPDevice cmdlets may be used as a carefully controlled fallback if native enumeration is impractical, but must not be required to execute arbitrary shell commands.

**Testing**

- Rust unit and integration tests.
- Frontend component tests.
- TypeScript type checking.
- Automated diagnostic-rule tests.
- Windows-specific integration tests where the environment permits.

Do not introduce a Python runtime solely to enumerate Windows devices. If an existing implementation already uses Python, evaluate its packaging and maintenance cost before changing it.

Avoid a separate backend server, Docker, a cloud database, and unnecessary dependencies in v0.1.

### Layered architecture

Separate the implementation into these logical layers:

1. **Device discovery:** obtains raw observations from Windows.
2. **Normalization:** converts platform-specific properties into a stable internal schema.
3. **Diagnostic engine:** evaluates evidence using deterministic rules.
4. **Recommendation engine:** suggests safe next tests.
5. **Reporting:** exports structured evidence and findings.
6. **Desktop interface:** presents the results and collects user actions.

Keep the diagnostic engine independent of React and presentation components.

Define typed models for devices, observations, diagnostic findings, recommendations, and reports.

Make the diagnostic rules testable without connecting actual hardware.

## 7. Implement real Windows device discovery

Implement a working scan operation that retrieves currently present USB and relevant HID devices using supported Windows device-enumeration APIs.

Where feasible, collect:

- Friendly name.
- Device class.
- Device instance identifier.
- Hardware identifiers.
- Manufacturer.
- Vendor/product IDs when available.
- Current device status.
- Problem code and associated diagnostic information.
- Parent and connection details when supported.

Be explicit about the limitations of each Windows API and the difference between a physical device, a USB interface, a composite device, and a logical HID device.

Do not assume that every physical device maps to exactly one Windows device entry.

Do not classify every HID device as USB. Do not infer that a missing device is defective merely because it is absent from the current enumeration.

Implement:

- Timeouts.
- Cancellation where practical.
- Structured error handling.
- Partial-result handling.
- Duplicate handling that respects interface identity.
- Stable identifiers within the scope supported by Windows.
- Permission-aware diagnostics.
- UI feedback during scans.

Use the actual system state. Do not populate the UI with hardcoded sample devices in production mode.

If sample fixtures are needed for screenshots or tests, isolate them explicitly in demo/test mode and label them accordingly.

## 8. Implement evidence-based diagnostic rules

Start with a small, documented rule engine.

Potential initial rules:

- Device reports a Windows problem code.
- Device enumeration returns a permission or access error.
- A previously observed device is no longer present.
- A device is detected but expected properties are unavailable.
- A USB connection attempt produces an identifiable Windows error.
- An Android phone is connected but does not expose the expected file-transfer interface, where this can be observed reliably.

Each rule must define:

- Required evidence.
- Detection logic.
- Severity.
- Diagnostic wording.
- Confidence classification.
- Recommended next test.
- Conditions under which the rule must abstain.

Do not implement diagnoses for which the required evidence cannot be collected.

In particular:

- Do not claim to identify a dead battery from Windows enumeration alone.
- Do not claim to determine whether an earbud charging circuit is defective from its LED alone.
- Do not claim that a device supports USB data merely because it charges.
- Do not invent Bluetooth status when Bluetooth information is unavailable.
- Do not state that a device was repaired unless a defined post-repair verification succeeded.

Use deterministic rules for v0.1. AI is not required, and no external model should be called.

## 9. Safe operation and privacy

AnyDevice is a diagnostic application, not a device-modification utility in its first release.

- Use read-only inspection by default.
- Never automatically install or uninstall drivers.
- Never change registry settings.
- Never flash firmware.
- Never modify device configuration without an explicitly implemented, documented, and reviewed workflow.
- Never run arbitrary commands supplied by device metadata.
- Treat all device names, identifiers, and returned metadata as untrusted input.
- Do not expose arbitrary shell execution through the UI.
- Do not request administrator privileges unless a specific feature demonstrably requires them.
- Explain when a check cannot run because of missing permissions.
- Keep device inventories and reports local by default.
- Do not upload hardware identifiers or diagnostic information.
- Provide report sanitization before sharing.

If future features support repair operations, require informed user approval, preflight checks, rollback or recovery guidance, and post-operation verification.

## 10. Downloadable Windows release

A downloadable `.exe` is a core deliverable, not a future suggestion.

Configure the application for Windows packaging through Tauri.

Produce, where supported:

- A Windows installer, preferably NSIS.
- A standalone executable if the dependency and runtime model supports it reliably.
- Release build instructions.
- A GitHub Actions workflow for building and testing Windows releases.
- Versioned release artifacts.
- Checksums for release files.
- A documented signing strategy.

Do not claim that an executable has been built unless the build actually succeeds.

Do not claim that a release is signed unless valid signing credentials were used and signature verification succeeded. Document the unsigned-build warning and future signing requirements honestly.

The application must not require the user to install Node.js, Rust, or a Python runtime separately.

Test the packaged build, not only the development server.

If the current development environment cannot build Windows artifacts, implement the appropriate Windows CI workflow and clearly document that local packaging remains unverified until the Windows build completes.

## 11. Testing requirements

Create meaningful automated tests for:

- Device model normalization.
- Parsing and validating identifiers.
- Diagnostic rule behavior.
- Unknown and missing fields.
- Windows error and permission conditions.
- Empty inventories.
- Duplicate device interfaces.
- Report serialization.
- Report sanitization.
- Malformed or incomplete source data.
- Cancellation and failure handling where implemented.

Include fixtures for:

1. A healthy USB mouse.
2. A device reporting a Windows problem.
3. A device that disappears between scans.
4. A device with incomplete metadata.
5. A USB connection with insufficient evidence for a root-cause diagnosis.
6. A simulated Android USB connection issue.

These fixtures must be synthetic and clearly labelled. They must not be presented as actual observations from connected hardware.

Run all tests available in the environment. Fix failures rather than merely listing them.

## 12. GitHub repository quality

Create a professional open-source repository with:

- A clear README.
- A concise value proposition.
- Genuine screenshots of the implemented application.
- An architecture diagram.
- Installation instructions.
- A supported-platform matrix.
- Example diagnostic reports using synthetic data.
- Build and development instructions.
- Testing instructions.
- Privacy documentation.
- Security policy.
- Contribution guidelines.
- License appropriate to the dependencies and project goals.
- Issue templates and a useful pull-request template.
- A changelog and versioning strategy.

Do not claim universal device support.

The README should immediately communicate what AnyDevice can do today, what it cannot do, and what is planned.

Do not add fake badges, fake usage metrics, fake testimonials, fabricated screenshots, or unsupported performance claims.

## 13. Definition of done for v0.1

The first release is complete only when all applicable criteria below are met:

- [ ] The application launches as a real Windows desktop application.
- [ ] The UI is polished, consistent, accessible, and responsive to window resizing.
- [ ] Device scanning reads real Windows device information.
- [ ] Device details are derived from actual observations.
- [ ] The diagnostic engine evaluates real evidence and abstains when necessary.
- [ ] Findings include evidence and safe recommendations.
- [ ] Reports export valid, versioned JSON.
- [ ] Report sanitization works.
- [ ] Unit tests cover diagnostic rules and reporting.
- [ ] The application works without a network connection for its core functionality.
- [ ] No external AI service or account is required.
- [ ] No privileged repair operations are exposed in v0.1.
- [ ] Production UI contains no fabricated devices or diagnostic findings.
- [ ] A Windows installer build is verified locally or through Windows CI.
- [ ] The repository includes clear installation and development documentation.

## 14. How you should execute this task

Work as an engineer responsible for the finished product.

Follow this order:

**Stage A — Inspect and plan**

Inspect the repository and environment. Identify constraints and prepare a short implementation plan. Research accessible design references before choosing the final visual direction.

**Stage B — Establish the architecture**

Implement the typed models, Windows discovery adapter, diagnostic engine, report schema, and tests.

**Stage C — Implement the UI**

Build the full desktop application using the defined design system. Connect every interactive control to actual functionality.

**Stage D — Integrate and validate**

Connect the UI to native commands, handle failures, run tests, and verify real device discovery on Windows when possible.

**Stage E — Package and document**

Build the Windows release, verify the packaged application, and complete the README and release workflow.

Do not stop after producing mockups, a scaffold, or a partially functional screen.

Do not replace a missing feature with a fake success message.

If a capability is blocked by the environment, document the blocker, complete the remaining work, and provide the exact steps needed to validate the blocked capability.

Make reasonable technical decisions independently rather than asking me to choose every library or implementation detail.

Do not expand the scope into every reverse-engineering capability before the first release is stable.

## 15. Final report

When implementation is complete, summarize:

1. Architecture and technology decisions.
2. Implemented features.
3. UI/UX decisions and design references used.
4. Files and major modules created or modified.
5. Tests executed and their actual results.
6. Windows hardware tests performed and their actual results.
7. Build and packaging status.
8. Exact location of the generated Windows installer and standalone executable, if produced.
9. Known limitations and unsupported devices.
10. The next three engineering priorities.

**Final product principle:** AnyDevice must be an excellent desktop product first and a credible technical diagnostic tool underneath. Its interface should make complicated engineering evidence understandable without oversimplifying the truth. Build something developers will respect and users can genuinely install and use.