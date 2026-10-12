# AnyDevice portable Windows x64 executable

The standalone executable includes its frontend and the fixed Windows discovery adapter. It requires Windows 10/11 x64, Microsoft WebView2 Runtime already installed, and Windows PowerShell 5.1 with the built-in PnpDevice module. It needs no Node, Rust or Python installation.

If WebView2 is absent, use the NSIS installer, which is configured to include the offline WebView2 installer. Portable operation without WebView2 is unsupported. Compare your executable's SHA-256 with SHA256SUMS.txt. Builds are unsigned until signing is configured and verified. No packaged executable is currently locally verified.
