import type { DiagnosticCheck } from "./diagnosticEngine";
import { diagnosticView, structureCheck } from "./evidence";
import { PnpRecheck } from "./PnpRecheck";
export function DiagnosticDashboard({
  checks,
  progress,
  busy,
  paused,
  onRun,
  onPause,
  onCancel,
  onAudio,
  onExport,
  onTest,
  onSkip,
  targetName = () => "Selected test target",
  onRechecked,
}: {
  checks: DiagnosticCheck[];
  onRechecked?: (before: DiagnosticCheck, after: DiagnosticCheck) => void;
  targetName?: (id: string) => string;
  onTest?: (target: string) => void;
  onSkip?: (id: string) => void;
  progress: string;
  busy: boolean;
  paused: boolean;
  onRun: () => void;
  onPause: () => void;
  onCancel: () => void;
  onAudio: () => void;
  onExport: () => void;
}) {
  const view = diagnosticView(checks);
  function details(c: DiagnosticCheck) {
    const e = structureCheck(c);
    return (
      <article className="finding" key={c.id}>
        <h3>
          {c.test} — {c.outcome}
        </h3>
        <p>Affected: {targetName(c.target)}</p>
        <p>{c.conclusion}</p>
        <p>
          Why it matters:{" "}
          {c.outcome === "Warning"
            ? "This configuration may be intentional. Confirm whether it matches your symptom before changing it."
            : "This named observation warrants investigation; it does not identify a defective component."}
        </p>
        <p>
          Evidence: {e.evidenceSource}. {e.confidenceRationale}
        </p>
        <p>Unknown: {e.unknowns.join(" ")}</p>
        <p>Next test: {c.nextStep}</p>
        {c.id.startsWith("pnp:") && onRechecked && (
          <PnpRecheck check={c} disabled={busy} onResult={onRechecked} />
        )}
        <p>
          Repair: {e.repair.availability}. {e.repair.reason}
        </p>
        {c.target !== "system" && onTest && (
          <button disabled={busy} onClick={() => onTest(c.target)}>
            Investigate this finding
          </button>
        )}
        <details>
          <summary>
            Advanced evidence — measurements and competing explanations
          </summary>
          <pre>{JSON.stringify(e, null, 2)}</pre>
        </details>
      </article>
    );
  }
  return (
    <section aria-label="Unified diagnostics">
      <h2>Full diagnostic scan</h2>
      <p>
        Discover → read-only checks → findings → your functional test → relevant
        repair proposal → approval → verification.
      </p>
      <p>
        Automatic checks do not play sound, capture a microphone, collect input,
        change settings or test illumination.
      </p>
      <div className="row">
        <button
          aria-label="Run diagnostics"
          className="primary"
          disabled={busy}
          onClick={onRun}
        >
          Run full diagnostic scan
        </button>
        <button disabled={!busy} onClick={onPause}>
          {paused ? "Resume diagnostics" : "Pause after current check"}
        </button>
        <button disabled={!busy} onClick={onCancel}>
          Cancel diagnostics
        </button>
        <button onClick={onAudio}>Open audio tests</button>
        <button disabled={!checks.length || busy} onClick={onExport}>
          Export diagnostic report
        </button>
      </div>
      <p role="status">{progress}</p>
      {!!checks.length && (
        <>
          <p>
            {view.actionable.length} findings · {view.passed.length} passed
            observations · {view.coverage.length} checks needing evidence or
            unavailable
          </p>
          {busy ? (
            <p>Scan in progress. Results are partial.</p>
          ) : view.interrupted ? (
            <p role="alert">
              This scan was interrupted. Completed evidence is retained;
              coverage is incomplete.
            </p>
          ) : !view.actionable.length ? (
            <p>
              No confirmed problems were detected by the checks that completed.
              Some functions still need testing.
            </p>
          ) : null}
          <div aria-label="Actionable findings">
            {view.actionable.map(details)}
          </div>
          <details>
            <summary>Passed checks ({view.passed.length})</summary>
            <p>
              Passed applies only to each named observation. Windows OK does not
              establish functional health.
            </p>
            <ul>
              {view.passed.map((c) => (
                <li key={c.id}>
                  <strong>{c.test}</strong> · {targetName(c.target)} —{" "}
                  {c.conclusion}
                  {c.id.startsWith("pnp:") && onRechecked && (
                    <PnpRecheck
                      check={c}
                      disabled={busy}
                      onResult={onRechecked}
                    />
                  )}
                </li>
              ))}
            </ul>
          </details>
          <details>
            <summary>Coverage and limitations ({view.coverage.length})</summary>
            <p>
              Equivalent checks are grouped. Missing measurements, remembered
              inactive endpoints and unsupported capabilities are not failures.
              Skipped tests have no functional result.
            </p>
            {view.groups.map((g) => (
              <details key={g.key}>
                <summary>
                  {g.test} — {g.outcome} ({g.checks.length})
                  {g.checks[0].measurements.state
                    ? ` · ${g.checks[0].measurements.state}`
                    : ""}
                </summary>
                <p>{g.checks[0].conclusion}</p>
                <p>Next: {g.checks[0].nextStep}</p>
                {g.checks.map((c) => (
                  <div key={c.id}>
                    <strong>{targetName(c.target)}</strong>
                    {c.id.startsWith("pnp:") && onRechecked && (
                      <PnpRecheck
                        check={c}
                        disabled={busy}
                        onResult={onRechecked}
                      />
                    )}
                    {c.target !== "system" && onTest && (
                      <button disabled={busy} onClick={() => onTest(c.target)}>
                        Choose and run this test
                      </button>
                    )}
                    {c.outcome === "Not tested" && onSkip && (
                      <button disabled={busy} onClick={() => onSkip(c.id)}>
                        Skip for now
                      </button>
                    )}
                    <details>
                      <summary>Advanced evidence for this check</summary>
                      <pre>{JSON.stringify(structureCheck(c), null, 2)}</pre>
                    </details>
                  </div>
                ))}
              </details>
            ))}
          </details>
        </>
      )}
    </section>
  );
}
