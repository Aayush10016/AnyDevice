import { useEffect, useMemo, useRef, useState } from "react";
import type { Device, Finding } from "./models";
import {
  inspectInputDevices,
  startInputTest,
  inputTestStatus,
  stopInputTest,
  discardInputTest,
  saveReport,
} from "./bridge";
import {
  relationships,
  endpointRelationship,
  keyName,
  xAssessment,
  symptomPlan,
  workbenchExport,
  type Endpoint,
  type InputSnapshot,
} from "./workbench";
const statuses: Record<string, string> = {
  testing: "Testing",
  eventsObserved: "Events observed",
  noEventsObserved: "No events observed",
  completed: "Completed",
  focusLost: "Inconclusive — focus lost",
  disconnected: "Inconclusive — disconnected",
  failed: "Failed",
  unsupported: "Unsupported",
};
export function DeviceWorkbench({
  device,
  devices,
  findings,
  sanitized,
  onClose,
}: {
  device: Device;
  devices: Device[];
  findings: Finding[];
  sanitized: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState("Overview");
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [index, setIndex] = useState(0);
  const [inspection, setInspection] = useState(
    "Inspecting available input interfaces…",
  );
  const [snapshot, setSnapshot] = useState<InputSnapshot | null>(null);
  const [history, setHistory] = useState<InputSnapshot[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [xOnly, setXOnly] = useState(false);
  const [attemptText, setAttemptText] = useState("");
  const [symptom, setSymptom] = useState("");
  const [conditions, setConditions] = useState("");
  const [preview, setPreview] = useState("");
  const session = useRef<number | null>(null);
  const mounted = useRef(true);
  const archived = useRef<number | null>(null);
  const surface = useRef<HTMLDivElement>(null);
  const related = useMemo(
    () => relationships(device, devices),
    [device, devices],
  );
  const available = endpoints.filter((e) =>
    endpointRelationship(e, device, related),
  );
  const endpoint = available[index];
  const mode =
    endpoint?.kind === "mouse" ? "mouse" : xOnly ? "x-key" : "keyboard";
  const attempts = attemptText === "" ? null : Number(attemptText);
  const running = !!snapshot && !snapshot.cleanup;
  function receive(value: InputSnapshot) {
    if (!mounted.current || value.sessionId !== session.current) return;
    setSnapshot(value);
    if (value.cleanup && archived.current !== value.sessionId) {
      archived.current = value.sessionId;
      setHistory((v) => [...v, value].slice(-8));
    }
  }
  function clearCurrentTarget() {
    const id = session.current;
    session.current = null;
    setSnapshot(null);
    if (id !== null)
      void discardInputTest(id).catch((e) => {
        if (mounted.current) setMessage(String(e));
      });
  }
  async function inspect() {
    clearCurrentTarget();
    try {
      const rows = await inspectInputDevices();
      if (mounted.current) {
        setEndpoints(rows);
        setInspection(
          `${rows.length} native input collections inspected. Mapping identifies logical Windows collections, not physical wireless peripherals.`,
        );
        setIndex(0);
      }
    } catch (e) {
      if (mounted.current) setInspection(String(e));
    }
  }
  useEffect(() => {
    mounted.current = true;
    void inspect();
    return () => {
      mounted.current = false;
      const id = session.current;
      if (id !== null) void discardInputTest(id).catch(() => {});
    };
  }, [device.id]);
  useEffect(() => {
    if (!snapshot || session.current === null || snapshot.cleanup) return;
    let cancelled = false;
    let polling = false;
    const timer = window.setInterval(async () => {
      if (polling || session.current === null) return;
      polling = true;
      try {
        const value = await inputTestStatus(session.current);
        if (!cancelled) receive(value);
      } catch (e) {
        if (!cancelled) setMessage(String(e));
      } finally {
        polling = false;
      }
    }, 250);
    const blur = () => {
      if (session.current !== null)
        void stopInputTest(session.current).catch(() => {});
    };
    window.addEventListener("blur", blur);
    const hidden = () => {
      if (document.hidden) blur();
    };
    document.addEventListener("visibilitychange", hidden);
    const editing = (event: FocusEvent) => {
      const element = event.target as HTMLElement | null;
      if (
        element &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName) ||
          element.isContentEditable)
      )
        blur();
    };
    document.addEventListener("focusin", editing);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", hidden);
      document.removeEventListener("focusin", editing);
    };
  }, [snapshot?.sessionId, snapshot?.cleanup]);
  async function stop() {
    const id = session.current;
    if (id === null) return;
    await stopInputTest(id);
    for (let n = 0; n < 20; n++) {
      const value = await inputTestStatus(id);
      receive(value);
      if (value.cleanup) return;
      await new Promise((resolve) => window.setTimeout(resolve, 100));
    }
    throw new Error(
      "Collector cleanup is not confirmed; do not start another test yet.",
    );
  }
  async function start() {
    if (!endpoint?.instanceId) return;
    setBusy(true);
    setMessage("");
    try {
      if (session.current !== null && !snapshot?.cleanup) await stop();
      surface.current?.focus();
      const id = await startInputTest(endpoint.instanceId, mode);
      session.current = id;
      if (!mounted.current) {
        await discardInputTest(id);
        return;
      }
      receive(await inputTestStatus(id));
    } catch (e) {
      if (mounted.current) setMessage(String(e));
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  async function finish(reset = false) {
    setBusy(true);
    try {
      await stop();
      if (reset) {
        session.current = null;
        setSnapshot(null);
        setMessage(
          "Reset. Prior completed tests remain in bounded history; no collector is active.",
        );
      }
    } catch (e) {
      setMessage(String(e));
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  async function changeTab(next: string) {
    if (running) {
      try {
        await stop();
      } catch (e) {
        setMessage(String(e));
        return;
      }
    }
    setTab(next);
  }
  const keyboardRows = [
    [27, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123],
    [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 8],
    [9, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80],
    [65, 83, 68, 70, 71, 72, 74, 75, 76, 13],
    [160, 90, 88, 67, 86, 66, 78, 77, 161],
    [162, 164, 32, 165, 163, 37, 38, 40, 39],
  ];
  const relevantFindings = findings.filter(
    (f) => f.deviceId?.toUpperCase() === device.id.toUpperCase(),
  );
  return (
    <section className="workbench" aria-label="Device workbench">
      <div className="row">
        <div>
          <div className="eyebrow">DEVICE WORKBENCH</div>
          <h2>{device.name ?? "Unnamed Windows device"}</h2>
        </div>
        <button onClick={onClose}>Close workbench</button>
      </div>
      <p className="muted">
        Selected Windows node • {device.category ?? "Class unknown"} • Windows{" "}
        {device.status ?? "status unavailable"}. Physical identity and
        external/internal placement remain unresolved.
      </p>
      <div
        className="workbench-tabs"
        role="tablist"
        aria-label="Workbench sections"
      >
        {["Overview", "Live Tests", "Report a Problem", "History & export"].map(
          (t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => void changeTab(t)}
            >
              {t}
            </button>
          ),
        )}
      </div>
      {tab === "Overview" && (
        <>
          <dl>
            <dt>Manufacturer / model evidence</dt>
            <dd>
              {device.manufacturer ?? "Unavailable"}; no model inferred from
              friendly name
            </dd>
            <dt>Connection / vendor / product</dt>
            <dd>
              {device.transport} / {device.vid ?? "unknown"} /{" "}
              {device.pid ?? "unknown"}
            </dd>
            <dt>Last observed</dt>
            <dd>
              {device.observedAt} — {device.source}
            </dd>
            <dt>Windows container</dt>
            <dd>
              <code>{device.containerId ?? "Unavailable"}</code> — an OS
              grouping hint, not physical-object proof
            </dd>
            <dt>Problem code</dt>
            <dd>
              {device.problemCode ?? "Unavailable"}; OK does not prove
              functional health
            </dd>
          </dl>
          <h3>Related Windows entries</h3>
          <p>
            Parent chains describe topology. Container matches are probable
            associations. Neither merges a receiver and its wireless peripheral
            into one physical object. Matching VID/PID alone is never used.
          </p>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Entry</th>
                  <th>Relationship</th>
                  <th>Evidence</th>
                </tr>
              </thead>
              <tbody>
                {related.map((r) => (
                  <tr key={r.device.id}>
                    <td>
                      {r.device.name ?? r.device.id}
                      <details>
                        <summary>Instance ID</summary>
                        <code>{r.device.id}</code>
                      </details>
                    </td>
                    <td>{r.confidence}</td>
                    <td>{r.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3>Capabilities and components</h3>
          <p>{inspection}</p>
          <p>
            {available.length} associated mouse/keyboard collections have mapped
            native capabilities. Test movement, buttons, wheels or key
            transitions in Live Tests; each component remains Not tested until
            events are observed during your procedure.
          </p>
          <details>
            <summary>Read-only interface and capability evidence</summary>
            <pre>{JSON.stringify(available, null, 2)}</pre>
          </details>
          <p>
            Protocol Lab: native input paths, usage-derived mouse/keyboard
            classes and reported capabilities are inspectable. Raw HID report
            descriptors, vendor protocol decoding, lighting control and hardware
            repairs are unsupported in this milestone; no guessed commands are
            sent.
          </p>
          {relevantFindings.map((f) => (
            <article className="finding" key={f.id}>
              <h3>{f.title}</h3>
              <p>{f.explanation}</p>
              <p>{f.facts.join("; ")}</p>
              <p>{f.limitations}</p>
            </article>
          ))}
        </>
      )}
      {tab === "Live Tests" && (
        <>
          <p>{inspection}</p>
          <label>
            Selected input collection{" "}
            <select
              aria-label="Selected input collection"
              disabled={running || busy}
              value={index}
              onChange={(e) => {
                clearCurrentTarget();
                setIndex(Number(e.target.value));
                setXOnly(false);
              }}
            >
              {available.map((e, i) => (
                <option key={`${e.instanceId}-${i}`} value={i}>
                  {e.kind} — {e.instanceId ?? "Unresolved"}
                </option>
              ))}
            </select>
          </label>
          {endpoint && (
            <p>
              <strong>
                {endpointRelationship(endpoint, device, related)?.confidence}{" "}
                logical attribution:
              </strong>{" "}
              {endpointRelationship(endpoint, device, related)?.evidence}.
              Physical origin behind a wireless receiver remains unverified.
            </p>
          )}
          {!available.length && (
            <p>
              No safely mapped input collection associated with this node. Use
              all-present-PnP inventory or select the observed
              receiver/interface parent. Unmapped input is not treated as a
              broken device.
            </p>
          )}
          {endpoint?.kind === "keyboard" && (
            <>
              <label>
                <input
                  type="checkbox"
                  checked={xOnly}
                  disabled={running || busy}
                  onChange={(e) => {
                    clearCurrentTarget();
                    setXOnly(e.target.checked);
                  }}
                />{" "}
                Dedicated X-key test (other key data discarded)
              </label>
              <label>
                User-reported physical attempts{" "}
                <input
                  aria-label="Physical attempts"
                  type="number"
                  min="0"
                  max="10000"
                  step="1"
                  value={attemptText}
                  disabled={running}
                  onChange={(e) => setAttemptText(e.target.value)}
                />
              </label>
            </>
          )}
          <p>
            Explicit foreground-only collection, at most 120 seconds / 10,000
            raw packets. Stops on Stop, leaving this workbench/test section,
            focus loss or disconnection. Only selected-device raw codes are
            observed; no characters are translated, no text is stored, and
            exports omit ordered key history. Do not type passwords or personal
            text during a keyboard test.
          </p>
          <div className="row">
            <button
              className="primary"
              disabled={!endpoint?.instanceId || running || busy}
              onClick={() => void start()}
            >
              Start Test
            </button>
            <button disabled={!running || busy} onClick={() => void finish()}>
              Stop Test
            </button>
            <button disabled={busy} onClick={() => void finish(true)}>
              Reset Test
            </button>
            <button disabled={running || busy} onClick={() => void inspect()}>
              Refresh input interfaces
            </button>
          </div>
          <div role="status">
            <strong>
              {snapshot
                ? (statuses[snapshot.status] ?? "Unknown")
                : "Not tested"}
            </strong>{" "}
            {snapshot?.reason}{" "}
            {snapshot &&
              ` • Cleanup ${snapshot.cleanup ? "confirmed: collector exited" : "pending / session active"}`}
          </div>
          <div
            ref={surface}
            tabIndex={0}
            className="input-test-surface"
            aria-label="Native input test surface"
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (
                [
                  " ",
                  "Backspace",
                  "ArrowUp",
                  "ArrowDown",
                  "ArrowLeft",
                  "ArrowRight",
                ].includes(e.key)
              )
                e.preventDefault();
            }}
          >
            <p>
              Keep this test area and AnyDevice focused. All counters below come
              from native attributed input; clicking this visual keyboard does
              not simulate a key.
            </p>
            {endpoint?.kind === "mouse" ? (
              <>
                <div className="movement-indicator">
                  <span
                    style={{
                      transform: `translate(${Math.max(-80, Math.min(80, (snapshot?.stats.x ?? 0) / 10))}px,${Math.max(-35, Math.min(35, (snapshot?.stats.y ?? 0) / 10))}px)`,
                    }}
                  />
                </div>
                <p>
                  Movement events: {snapshot?.stats.movements ?? 0} • X/Y:{" "}
                  {snapshot?.stats.x ?? 0}/{snapshot?.stats.y ?? 0} (
                  {snapshot?.stats.absolute
                    ? "absolute coordinates"
                    : "relative accumulation"}
                  ; indicator is bounded). Sensor accuracy is unverified.
                </p>
                <div className="keyboard-row">
                  {["Left", "Right", "Middle", "Extra 1", "Extra 2"].map(
                    (name, i) => {
                      const count = snapshot?.stats.buttons[String(i + 1)];
                      return (
                        <span
                          key={name}
                          className={`test-key ${count?.held ? "held" : ""}`}
                        >
                          {name}: {count?.down ?? 0} down / {count?.up ?? 0} up
                        </span>
                      );
                    },
                  )}
                </div>
                <p>
                  Vertical up: {snapshot?.stats.wheelUp ?? 0}; down:{" "}
                  {snapshot?.stats.wheelDown ?? 0}; horizontal events:{" "}
                  {snapshot?.stats.horizontal ?? 0}. Signed deltas appear in
                  recent evidence.
                </p>
              </>
            ) : endpoint?.kind === "keyboard" ? (
              <>
                {keyboardRows.map((row, i) => (
                  <div className="keyboard-row" key={i}>
                    {row.map((vk) => {
                      const k = snapshot?.stats.keys[String(vk)];
                      return (
                        <span
                          key={vk}
                          className={`test-key ${k?.held ? "held" : ""} ${vk === 88 && xOnly ? "target-key" : ""}`}
                          aria-label={`${keyName(vk)} observed ${k?.down ?? 0} presses${k?.held ? ", held" : ""}`}
                        >
                          {keyName(vk)}
                          <small>{k?.down ?? 0}</small>
                        </span>
                      );
                    })}
                  </div>
                ))}
                <p>
                  Generic virtual-key layout, not a verified model-specific
                  physical layout. Held states clear on stop;
                  modifiers/scancodes depend on the endpoint.
                </p>
              </>
            ) : null}
          </div>
          {snapshot && (
            <>
              <p>
                Native event count: {snapshot.stats.events}. Measured target:{" "}
                {snapshot.targetId}. Latest 128 retained;{" "}
                {snapshot.historyTruncated
                  ? "recent history truncated; aggregate counts retained"
                  : "history within limit"}
                .
              </p>
              <details>
                <summary>Per-key down/up/repeat counts</summary>
                <pre>{JSON.stringify(snapshot.stats.keys, null, 2)}</pre>
              </details>
              <details>
                <summary>
                  Recent measured events and timestamps (volatile)
                </summary>
                <pre>{JSON.stringify(snapshot.recent, null, 2)}</pre>
              </details>
            </>
          )}
          {xOnly && (
            <p className="recommendation">{xAssessment(attempts, snapshot)}</p>
          )}
        </>
      )}
      {tab === "Report a Problem" && (
        <>
          <label>
            Describe the problem{" "}
            <textarea
              aria-label="Device symptom"
              maxLength={2000}
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              placeholder="For example: My X key sometimes needs five attempts"
            />
          </label>
          <label>
            Test conditions / visible observations{" "}
            <textarea
              aria-label="Test conditions"
              maxLength={2000}
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
            />
          </label>
          <p>
            The exact text is a user report, not machine-confirmed evidence. It
            stays local in this workbench until exported or closed.
          </p>
          {symptomPlan(symptom, endpoint?.kind, snapshot).map((item, i) => (
            <article className="finding" key={i}>
              <strong>{item.classification}</strong>
              <p>{item.text}</p>
              <small>Source: {item.source}</small>
            </article>
          ))}
          <p>
            Repair & Recovery: no compatible, validated state-changing repair
            provider is installed. No switch/LED fault is declared and no
            driver, firmware, registry or lighting change has been made. Repeat
            the same test and compare results after any separately approved
            remediation.
          </p>
        </>
      )}
      {tab === "History & export" && (
        <>
          <p>
            Up to eight completed sessions retained while this workbench is
            open. Export before closing. Ordered key events are never exported;
            aggregate key codes/counts and timing may still be sensitive.
          </p>
          {history.map((s) => (
            <article key={s.sessionId}>
              <strong>
                {s.mode} — {statuses[s.status] ?? s.status}
              </strong>
              <p>
                {s.startedAt}: {s.stats.events} events. Cleanup{" "}
                {s.cleanup ? "confirmed" : "unconfirmed"}.
              </p>
            </article>
          ))}
          <div className="row">
            <button
              disabled={running}
              onClick={() =>
                setPreview(
                  JSON.stringify(
                    workbenchExport(
                      device,
                      symptom,
                      conditions,
                      attempts,
                      history,
                      sanitized,
                    ),
                    null,
                    2,
                  ),
                )
              }
            >
              Prepare workbench export
            </button>
            <button
              disabled={!preview || running}
              onClick={async () => {
                try {
                  const path = await saveReport(preview);
                  setMessage(path ? `Saved ${path}` : "Save cancelled");
                } catch (e) {
                  setMessage(String(e));
                }
              }}
            >
              Save workbench report
            </button>
          </div>
          <p>
            Current export preference:{" "}
            {sanitized
              ? "sanitized (identities, symptom and conditions withheld)"
              : "raw (review identities and user reports before sharing)"}
            .
          </p>
          {preview && (
            <pre aria-label="Workbench report preview">{preview}</pre>
          )}
        </>
      )}
      {message && <p role="alert">{message}</p>}
    </section>
  );
}
