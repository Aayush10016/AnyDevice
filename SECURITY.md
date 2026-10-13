# Security policy

v0.1 is read-only: no driver/registry/firmware/device modifications, arbitrary shell execution, privileged repairs or auto-elevation. Treat all Windows device metadata as untrusted. React renders it as text; the fixed adapter passes instance IDs as parameters and never evaluates them as code. Native commands provide only fixed discovery, cancellation and report saving through a native dialog.

Please report vulnerabilities privately through GitHub's private vulnerability reporting on Aayush10016/AnyDevice once enabled. Until the repository exists or that feature is configured, do not disclose secrets or hardware identifiers in public issues. No dedicated security email address is configured.

Only the latest validated release will receive fixes; no release is yet validated. Dependencies should be reviewed before release. Unsigned builds do not have trusted publisher verification. Do not mistake a process-launch smoke test for comprehensive security or hardware validation.

0.2.0 native collection uses documented read-only Configuration Manager APIs in a child of the same executable with two fixed allowed scopes. The child is hidden, has no stdin, and is terminated on cancellation, timeout or stdout overflow. Optional fallback remains fixed and metadata is never executed. Raw sample imports allow only three byte-sample extensions and 1 MiB; no imported binary or generated code is executed. Exports validate JSON schemas in the frontend and envelopes/size in Rust, then use a native save dialog. Paths are not constructed from metadata. Native properties and entire inventories are bounded. Real inventories/identifiers must never enter public workflow logs or artifacts.
