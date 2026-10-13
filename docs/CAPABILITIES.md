# Capability matrix

Status describes this source revision, not universal device support. See EXPANSION-VALIDATION.md for actual execution results.

| Capability | Implemented source | Verification / limits |
| --- | --- | --- |
| Branding and installation identity | Complete | Branding regression test; original internal identifier retained |
| Native Windows present USB/HID nodes | Implemented | CI and real-host semantic parity passed; packaged interactive gate remains |
| All present Windows PnP classes | Implemented | CI and real host observed multiple classes; class/name/status/IDs/parent/location/presence only |
| Bluetooth, audio, cameras, network, disks, volumes, printers | PnP-node inspection | No transport connection/stream/health-specific API implemented; exposure depends on Windows/host |
| Android | Windows-exposed nodes only | No name-based Android inference, ADB or MTP diagnosis |
| Deterministic diagnostics | Implemented and domain-tested | Windows status/errors, missing metadata, provider errors and same-source complete-scan absence; no physical-health guarantee |
| Snapshot investigation | Implemented and automated-tested | Volatile bounded history, structured differences, user notes, sanitized exports; physical unplug/replug gate pending |
| Binary byte inspection/comparison | Implemented and automated-tested | Raw .bin/.dat/.raw only; 1 MiB, hypotheses unvalidated, no file-format decoder |
| Schemas/sanitization | Implemented and automated-tested | Exact previews; fingerprints/annotations removed when sanitized; some timestamps/model/offset data retained |
| Windows NSIS/standalone | CI packaging verified | Unsigned, WebView2 dependency; verified build and separate candidate 3 draft; standalone launched locally |
| Physical device grouping/interface-path enumeration | Unsupported | Node identity kept distinct; grouping unknown |
| USB/Bluetooth traffic capture | Unsupported | Enumeration is not traffic capture |
| Parser generation / capture format import | Planned | No automatically generated/executed parser |
| Verified recovery / firmware / driver or registry edits | Unsupported | No evidence-supported action justified; separate approval/rollback model required |
| macOS/Linux/ARM64/x86 | Unsupported/unverified | No provider/package/test claims |

A Bluetooth-class node proves only that Windows exposes that node. Storage nodes do not reveal file content, capacity, SMART health or filesystem reliability. Camera/audio classes do not imply access to recordings. No dedicated Bluetooth/Android/capture dependencies are downloaded or invoked.
