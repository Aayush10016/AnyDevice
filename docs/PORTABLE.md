# AnyDevice standalone Windows x64 executable

The standalone includes the embedded frontend and native Windows Configuration Manager provider. It requires Windows 10/11 x64 and Microsoft WebView2 Runtime already installed. Windows PowerShell 5.1/PnpDevice is optional, used only for the comparison fallback. End users need no Node, Rust, Python or developer tools.

If WebView2 is absent, use the NSIS installer, which includes its offline installer. Compare the version-specific SHA-256 with SHA256SUMS.txt. Current candidates are unsigned and may trigger SmartScreen; no trusted publisher identity is claimed. See EXPANSION-VALIDATION.md for exact source/build/launch results and remaining release gates.

A launch smoke check does not replace interactive scan/export, visual/accessibility, safe hardware reconnect or clean-machine upgrade testing. The original 0.1.0 candidate is preserved separately; do not mix versioned checksums or filenames.
