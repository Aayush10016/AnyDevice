# Privacy

No telemetry, analytics, external AI, uploads or accounts. Core scans run offline using Windows. Current/prior inventories and recent activity stay in application memory and disappear when closed. Appearance and sanitization preferences are stored in local WebView storage. Save paths are displayed only in the current session. No background scans or automatic hardware-report persistence.

Report export opens a native file dialog and writes only the report the user reviewed. Raw reports can contain hardware/instance IDs, serial-like values, device names, manufacturers, parents, locations and error details. Default sanitized export removes free-text metadata, identifiers, hardware IDs and detailed error messages everywhere, including prior scans and findings; replaces references with report-local aliases; retains exact VID/PID, collection times and normalized status/problem codes. These remaining values may still identify device models or timing. Sanitization is a sharing aid, not a guarantee of anonymity. Review the preview before sharing.

No report is automatically uploaded to GitHub. Test fixtures and example reports are synthetic. Do not attach raw production reports to public issues. Windows, WebView2 or operating-system components may have their own policies independent of AnyDevice.
