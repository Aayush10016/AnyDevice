import { useState, useEffect, useRef } from "react";
import { inspectLighting, cancelScan, saveReport } from "./bridge";
import { lightingSummary, type LightingDiscovery } from "./nativeInvestigation";
import { diagnosticExport, type DiagnosticCheck } from "./diagnosticEngine";
export function LightingDiscoveryPanel() {
  const [result, setResult] = useState<LightingDiscovery | null>(null),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const mounted = useRef(true);
  const active = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (active.current) void cancelScan().catch(() => {});
    };
  }, []);
  async function run() {
    active.current = true;
    setBusy(true);
    setResult(null);
    setMessage(
      "Querying Windows system identity and supported lighting interfaces…",
    );
    try {
      const r = await inspectLighting();
      if (mounted.current) {
        setResult(r);
        setMessage(lightingSummary(r));
      }
    } catch (e) {
      if (mounted.current) setMessage(String(e));
    } finally {
      active.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  function check(): DiagnosticCheck {
    return {
      id: "lighting-discovery",
      target: "system",
      test: "Keyboard lighting capability discovery",
      outcome:
        result?.interfaces.length || !result?.lampEnumerationComplete
          ? "Inconclusive"
          : "Not supported",
      confidence: "Windows-reported",
      measurements: {
        observedAt: result!.observedAt,
        interfaces: result!.interfaces.length,
        lampEnumerationComplete: result!.lampEnumerationComplete,
        methods: result!.methods.join("; "),
        errors: `${result!.errors.length} method errors; detailed free text withheld from sanitized export`,
        controlValidated: false,
        physicalIlluminationVerified: false,
      },
      conclusion: lightingSummary(result!),
      nextStep:
        "Verify the exact keyboard variant and its official manual. An advertised interface or vendor service is not validated control; no automatic lighting repair is available.",
      hypotheses: [],
    };
  }
  return (
    <section aria-label="Windows lighting discovery">
      <h3>Discover system and lighting interfaces</h3>
      <p>
        This reads Windows system/BIOS identity, LampArray interface
        advertisements and supporting keyboard/HID/ACPI nodes. No lighting
        controller is opened and no lighting values are changed.
      </p>
      <button disabled={busy} onClick={() => void run()}>
        Discover lighting capabilities
      </button>
      <button disabled={!busy} onClick={() => void cancelScan()}>
        Cancel lighting discovery
      </button>
      <p role="status">{message}</p>
      {result && (
        <>
          <p>
            Windows system:{" "}
            {result.systemEvidence?.system?.Manufacturer ??
              "unknown manufacturer"}{" "}
            · {result.systemEvidence?.system?.Model ?? "unknown model"} · BIOS{" "}
            {result.systemEvidence?.bios?.SMBIOSBIOSVersion ?? "unavailable"}.
          </p>
          <p>
            Enumeration:{" "}
            {result.lampEnumerationComplete
              ? "completed"
              : "blocked or unavailable"}
            ; whole discovery {result.complete ? "complete" : "partial"}.
            Physical illumination not verified.
          </p>
          <p>
            Attempted methods: {result.methods.join("; ")}. Vendor service/WMI
            names are hints only. The laptop model does not identify an external
            Cosmic Byte keyboard.
          </p>
          {result.errors.map((e, i) => (
            <p key={i}>Discovery error: {e}</p>
          ))}
          <button
            onClick={async () => {
              try {
                setMessage(
                  (await saveReport(
                    JSON.stringify(
                      diagnosticExport(null, [check()], null, [], true),
                    ),
                  ))
                    ? "Sanitized lighting evidence saved"
                    : "Save cancelled",
                );
              } catch (e) {
                setMessage(String(e));
              }
            }}
          >
            Export sanitized lighting evidence
          </button>
          <details>
            <summary>
              Advanced evidence — interfaces, topology and method results
            </summary>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </details>
        </>
      )}
    </section>
  );
}
