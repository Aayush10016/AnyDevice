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
  onTest,
  onSkip,
}: {
  checks: DiagnosticCheck[];
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
      <h2>Full diagnostic scan</h2>
      <p>
        Automatic checks read Windows device and audio status. They do not play
        sound, record a microphone, press keys, change settings or test LEDs.
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
          <h3>Tests needing your participation</h3>
          <p>
            Listening, speaking, key presses and mouse actions require you.
            Skipping preserves Not tested; it never creates a passing result.
          </p>
          {checks
            .filter((c) => c.outcome === "Not tested")
            .map((c, i) => (
              <div key={c.id}>
                <strong>
                  {c.test} — target {i + 1}: Not tested
                </strong>
                <button
                  disabled={busy || !onTest}
                  onClick={() => onTest?.(c.target)}
                >
                  Choose and run this test
                </button>
                <button
                  disabled={busy || !onSkip}
                  onClick={() => onSkip?.(c.id)}
                >
                  Skip for now
                </button>
              </div>
            ))}
          <details>
            <summary>All checks, skipped tests and coverage</summary>
            {checks.map(view)}
          </details>
        </>
      )}
    </section>
  );
}
