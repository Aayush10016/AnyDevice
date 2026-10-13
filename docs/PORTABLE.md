# AnyDevice portable Windows x64 executable

The standalone executable includes its frontend and the fixed Windows discovery adapter. It requires Windows 10/11 x64, Microsoft WebView2 Runtime already installed, and Windows PowerShell 5.1 with the built-in PnpDevice module. It needs no Node, Rust or Python installation.

If WebView2 is absent, use the NSIS installer, which includes the offline WebView2 installer. Portable operation without WebView2 is unsupported. Compare your executable's SHA-256 with SHA256SUMS.txt. Both current binaries are unsigned (`NotSigned`). The packaged standalone executable was checksum-verified and launched on the development host with development servers stopped. This launch check does not replace visual/accessibility or interactive hardware QA.

0.2.0 uses native Windows inventory by default; Windows PowerShell/PnpDevice is optional for its comparison fallback. Prior 0.1.0 downloads remain separate; filenames and checksums are version-specific.
