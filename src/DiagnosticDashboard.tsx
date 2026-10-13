import type { DiagnosticCheck } from "./diagnosticEngine";
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
}: {
  checks: DiagnosticCheck[];
  progress: string;
  busy: boolean;
  paused: boolean;
  onRun: () => void;
  onPause: () => void;
  onCancel: () => void;
  onAudio: () => void;
  onExport: () => void;
}) {
  const counts = Object.fromEntries(
    [
      "Passed",
      "Issue detected",
      "Inconclusive",
      "Not supported",
      "Not tested",
      "Cancelled or interrupted",
    ].map((state) => [state, checks.filter((c) => c.outcome === state).length]),
  );
  const important = checks.filter((c) =>
    ["Issue detected", "Inconclusive"].includes(c.outcome),
  );
  function view(c: DiagnosticCheck) {
    return (
      <article className="finding" key={c.id}>
        <strong>
          {c.test} — {c.outcome}
        </strong>
        <p>{c.conclusion}</p>
        <p>Next: {c.nextStep}</p>
        <details>
          <summary>Stats for nerds — evidence and hypotheses</summary>
          <p>Confidence: {c.confidence}</p>
          <pre>
            {JSON.stringify(
              {
                target: c.target,
                measurements: c.measurements,
                hypotheses: c.hypotheses,
              },
              null,
              2,
            )}
          </pre>
        </details>
      </article>
    );
  }
  return (
    <section aria-label="Unified diagnostics">
      <h2>Run diagnostics</h2>
      <p>
        Automatic checks read Windows device and audio status. They do not play
        sound, record a microphone, press keys, change settings or test LEDs.
      </p>
      <div className="row">
        <button className="primary" disabled={busy} onClick={onRun}>
          Run diagnostics
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
      {checks.length > 0 && (
        <>
          <p>
            {Object.entries(counts)
              .map(([state, count]) => `${state}: ${count}`)
              .join(" · ")}
          </p>
          <p>
            Passed applies only to the named observation, never overall hardware
            health. Physical causes are not established by Windows status.
          </p>
          {important.length ? (
            important.map(view)
          ) : (
            <p>
              No issue was established by these read-only checks. Functional
              tests remain separate.
            </p>
          )}
          <details>
            <summary>All checks, skipped tests and coverage</summary>
            {checks.map(view)}
          </details>
        </>
      )}
    </section>
  );
}
