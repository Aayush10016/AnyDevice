import type { DiagnosticCheck } from "./diagnosticEngine";
import { diagnosticView, structureCheck } from "./evidence";
import { PnpRecheck } from "./PnpRecheck";
import { ProblemIntake } from "./ProblemIntake";
import {
  symptomGuidance,
  symptoms,
  setProblemResolved,
  type Symptom,
} from "./reportedProblems";
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
  problemTargets = [],
  onReport,
  onReportedChange,
}: {
  checks: DiagnosticCheck[];
  problemTargets?: { id: string; name: string }[];
  onReport?: (check: DiagnosticCheck) => void;
  onReportedChange?: (before: DiagnosticCheck, after: DiagnosticCheck) => void;
  onRechecked?: (before: DiagnosticCheck, after: DiagnosticCheck) => void;
  targetName?: (id: string) => string;
  onTest?: (target: string, symptom?: string) => void;
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
  const reported = checks.filter(
    (c) => c.id.startsWith("reported:") && c.outcome === "Issue detected",
  );
  const detected = view.actionable.filter((c) => !c.id.startsWith("reported:"));
  const statusObservations = view.passed.filter(
    (c) => !c.id.startsWith("reported:"),
  );
  const resolvedReports = view.passed.filter((c) =>
    c.id.startsWith("reported:"),
  );
  function details(c: DiagnosticCheck) {
    const e = structureCheck(c);
    return (
      <article className="finding" key={c.id}>
        <h3>
          {c.test} —{" "}
          {c.id.startsWith("reported:") ? "Reported symptom" : c.outcome}
        </h3>
        <p>
          Affected:{" "}
          {c.id.startsWith("reported:") && c.target === "system"
            ? "Not identified yet"
            : targetName(c.target)}
        </p>
        <p>{c.conclusion}</p>
        {c.id.startsWith("reported:") &&
          c.measurements.symptomType &&
          String(c.measurements.symptomType) in symptoms && (
            <>
              <label>
                Associate this report with a device
                <select
                  aria-label="Reported problem device"
                  disabled={busy}
                  value={c.target}
                  onChange={(e) =>
                    onReportedChange?.(c, {
                      ...c,
                      target: e.target.value,
                      measurements: {
                        ...c.measurements,
                        associationSource:
                          "Owner selected device; physical identity unverified",
                        associationObservedAt: new Date().toISOString(),
                      },
                    })
                  }
                >
                  <option value="system">Not identified yet</option>
                  {c.target !== "system" &&
                    !problemTargets.some((t) => t.id === c.target) && (
                      <option value={c.target}>
                        Previously selected device — not in current inventory
                      </option>
                    )}
                  {problemTargets.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
              <p>Your observation: {c.measurements.reportedDetail}</p>
              <p>
                {
                  symptomGuidance(c.measurements.symptomType as Symptom)
                    .limitation
                }
              </p>
              <ol>
                {symptomGuidance(
                  c.measurements.symptomType as Symptom,
                ).steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p>
                <strong>Can AnyDevice fix this?</strong>{" "}
                {symptomGuidance(c.measurements.symptomType as Symptom).fix}
              </p>
              {onReportedChange && (
                <button
                  disabled={busy}
                  onClick={() =>
                    onReportedChange(c, setProblemResolved(c, true))
                  }
                >
                  Record that my original symptom no longer occurs
                </button>
              )}
            </>
          )}
        {!c.id.startsWith("reported:") && (
          <>
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
          </>
        )}
        {e.repair.providerId && onTest && (
          <button disabled={busy} onClick={() => onTest(c.target)}>
            Review unmute fix
          </button>
        )}
        {c.target !== "system" && onTest && (
          <button
            disabled={busy}
            onClick={() =>
              c.measurements.symptomType
                ? onTest(c.target, String(c.measurements.symptomType))
                : onTest(c.target)
            }
          >
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
      {onReport && (
        <ProblemIntake
          targets={problemTargets}
          onReport={onReport}
          disabled={
            busy ||
            checks.filter((c) => c.id.startsWith("reported:")).length >= 32
          }
        />
      )}
      <h2>Automatic Windows checks</h2>
      <p>
        Checks Windows device status, available driver metadata, HID
        capabilities and audio endpoint/service configuration. These checks do
        not inspect every component or prove that devices work physically.
      </p>
      <p>
        <strong>Available automatic fix:</strong> unmute a selected active audio
        endpoint when Windows currently reports it muted. Review and approve it
        in Audio tests. There is no general hardware-repair or automatic
        LED-failure detector.
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
          Check Windows status and configuration
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
            {detected.length} detected findings · {reported.length} unresolved
            reported problems · {statusObservations.length} completed status/API
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
              These automatic checks found no current Windows-reported problem.
              They did not test every physical function. Report a symptom above
              even when Windows says OK.
            </p>
          ) : null}
          {!!reported.length && (
            <section aria-label="Your reported problems">
              <h2>Your reported problems — still under investigation</h2>
              <p>
                A clean Windows scan does not close these reports. Only record
                resolution after checking the original symptom.
              </p>
              {reported.map(details)}
            </section>
          )}
          {!!resolvedReports.length && (
            <details>
              <summary>
                Resolved according to your observation ({resolvedReports.length}
                )
              </summary>
              {resolvedReports.map((c) => (
                <article key={c.id}>
                  <h3>{c.test}</h3>
                  <p>{c.conclusion}</p>
                  {onReportedChange && (
                    <button
                      disabled={busy}
                      onClick={() =>
                        onReportedChange(c, setProblemResolved(c, false))
                      }
                    >
                      The symptom has returned
                    </button>
                  )}
                </article>
              ))}
            </details>
          )}
          <div aria-label="Actionable findings">{detected.map(details)}</div>
          <details>
            <summary>
              Completed status/API observations ({statusObservations.length})
            </summary>
            <p>
              Passed applies only to each named observation. Windows OK does not
              establish functional health.
            </p>
            <ul>
              {statusObservations.map((c) => (
                <li key={c.id}>
                  <strong>{c.test}</strong> · {targetName(c.target)} —{" "}
                  {c.conclusion}
                  {c.id.startsWith("reported:") && onReportedChange && (
                    <button
                      disabled={busy}
                      onClick={() =>
                        onReportedChange(c, setProblemResolved(c, false))
                      }
                    >
                      The symptom has returned
                    </button>
                  )}
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
