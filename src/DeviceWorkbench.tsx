import {
  LightingInvestigation,
  type LightingRecord,
} from "./LightingInvestigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { deviceCapabilities } from "./capabilities";
import type { AudioInventory } from "./audio";
import type { Candidate } from "./inventoryModel";
import {
  keyboardLayout,
  navigationLayout,
  type LayoutKey,
} from "./keyboardLayout";
import { testOutcome } from "./testOutcome";
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
  cancelled: "Stopped early",
};
export function DeviceWorkbench({
  device,
  devices,
  findings,
  sanitized,
  onClose,
  candidate,
  audio = null,
  onAudio,
  onDiagnostics,
}: {
  device: Device;
  candidate?: Candidate;
  audio?: AudioInventory | null;
  onAudio?: (id?: string) => void;
  onDiagnostics?: () => void;
  devices: Device[];
  findings: Finding[];
  sanitized: boolean;
  onClose: () => void;
}) {
  const capabilities = candidate ? deviceCapabilities(candidate, audio) : [];
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
  const [lighting, setLighting] = useState<LightingRecord | null>(null);
  const [attemptText, setAttemptText] = useState("");
  const [symptom, setSymptom] = useState("");
  const [conditions, setConditions] = useState("");
  const [preview, setPreview] = useState("");
  useEffect(() => {
    setPreview("");
  }, [sanitized]);
  const session = useRef<number | null>(null);
  const mounted = useRef(true);
  const archived = useRef<number | null>(null);
  const surface = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLHeadingElement>(null);
  const inspectionNonce = useRef(0);
  const related = useMemo(
    () => relationships(device, devices),
    [device, devices],
  );
  const available = endpoints.filter((e) =>
    candidate
      ? (
          candidate.inputKinds ?? (candidate.kind ? [candidate.kind] : [])
        ).includes(e.kind) &&
        candidate.nodes.some(
          (n) => e.instanceId?.toUpperCase() === n.id.toUpperCase(),
        )
      : endpointRelationship(e, device, related),
  );
  const endpoint = available[index];
  const mode = endpoint?.kind === "mouse" ? "mouse" : "keyboard";
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
    const nonce = ++inspectionNonce.current;
    try {
      const rows = await inspectInputDevices();
      if (mounted.current && nonce === inspectionNonce.current) {
        setEndpoints(rows);
        setInspection(
          `${rows.length} native input collections inspected. Mapping identifies logical Windows collections, not physical wireless peripherals.`,
        );
        const matches = rows.filter((e) =>
          candidate
            ? (
                candidate.inputKinds ?? (candidate.kind ? [candidate.kind] : [])
              ).includes(e.kind) &&
              candidate.nodes.some(
                (n) => e.instanceId?.toUpperCase() === n.id.toUpperCase(),
              )
            : endpointRelationship(e, device, related),
        );
        setIndex(matches.length === 1 ? 0 : -1);
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
      ++inspectionNonce.current;
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
        void stopInputTest(session.current, "focusLost").catch(() => {});
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
  async function stop(reason?: "navigation" | "reset") {
    const id = session.current;
    if (id === null) return;
    await stopInputTest(id, reason);
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
      setSnapshot(null);
      setPreview("");
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
      await stop(reset ? "reset" : undefined);
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
        await stop("navigation");
      } catch (e) {
        setMessage(String(e));
        return;
      }
    }
    setTab(next);
  }
  const relevantFindings = findings.filter(
    (f) => f.deviceId?.toUpperCase() === device.id.toUpperCase(),
  );
  function renderKeys(rows: LayoutKey[][], label: string) {
    return (
      <div className="keyboard-block" aria-label={label}>
        {rows.map((row, i) => (
          <div className={`keyboard-row keyboard-row-${i}`} key={i}>
            {row.map((key) => {
              const count = snapshot?.stats.keys[String(key.vk)];
              return (
                <span
                  key={key.vk}
                  style={{
                    gridColumn: `span ${Math.round((key.width ?? 1) * 4)}`,
                  }}
                  className={`test-key ${count?.held ? "held" : ""}`}
                  aria-label={`${key.label}: ${count?.down ?? 0} down, ${count?.up ?? 0} up, ${count?.repeat ?? 0} repeats${count?.held ? ", held" : ""}`}
                >
                  <span>{key.label}</span>
                  <small>
                    {count?.down ?? 0}↓ {count?.up ?? 0}↑
                  </small>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
  return (
    <section className="workbench" aria-label="Device workbench">
      <button onClick={onClose}>Back to devices</button>
      <h2 ref={top} tabIndex={-1}>
        {candidate?.name ?? device.name ?? "Device diagnostics"}
      </h2>
      <p>
        {candidate?.category ?? device.category ?? "Unknown device"} ·{" "}
        {device.manufacturer ?? "Manufacturer unavailable"}
      </p>
      <p>
        Physical identity and external/internal placement remain unresolved
        where Windows evidence is insufficient. {candidate?.placement}
      </p>
      <div
        className="workbench-tabs"
        role="tablist"
        aria-label="Workbench sections"
      >
        {[
          "Overview",
          ...(candidate && !candidate.kind && !candidate.inputKinds?.length
            ? []
            : ["Live Tests"]),
          "Report a Problem",
          "History & export",
        ].map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => void changeTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Overview" && (
        <>
          <p>
            Windows reports {device.status ?? "no status"}. This is a connection
            observation, not a functional health verdict.
          </p>
          <h3>Available tests</h3>
          {capabilities
            .filter((c) => c.id !== "led")
            .map((c) => (
              <div key={c.id}>
                {c.state === "available" &&
                ["mouse", "keyboard"].includes(c.id) ? (
                  <button onClick={() => setTab("Live Tests")}>
                    {c.label}
                  </button>
                ) : c.endpointId || c.id === "audio-choice" ? (
                  <button
                    disabled={!onAudio || c.state === "unavailable"}
                    onClick={() => onAudio?.(c.endpointId)}
                  >
                    {c.label}
                  </button>
                ) : (
                  <strong>
                    {c.label} — {c.state}
                  </strong>
                )}
                <p>{c.reason}</p>
              </div>
            ))}
          {!capabilities.some((c) => c.state === "available") && (
            <p>
              Choose an available endpoint or review the supported read-only
              checks. No functional result has been recorded for this device.
            </p>
          )}
          <button onClick={onDiagnostics} disabled={!onDiagnostics}>
            Run device diagnostics
          </button>
          <p>
            Individual LED testing requires a verified model-specific protocol
            and your observation of actual illumination. Windows cannot identify
            a failed LED circuit.
          </p>
          {(candidate?.inputKinds?.includes("keyboard") ||
            candidate?.kind === "keyboard" ||
            device.category === "Keyboard") && (
            <LightingInvestigation
              record={lighting}
              onRecord={(r) => {
                setLighting(r);
                setPreview("");
              }}
              input={snapshot}
              onInput={() => setTab("Live Tests")}
            />
          )}
          {relevantFindings.map((f) => (
            <article className="finding" key={f.id}>
              <h3>{f.title}</h3>
              <p>{f.explanation}</p>
            </article>
          ))}
        </>
      )}
      {tab === "Live Tests" && (
        <>
          <label>
            Selected input source{" "}
            <select
              aria-label="Selected input collection"
              disabled={running || busy}
              value={index}
              onChange={(e) => {
                clearCurrentTarget();
                setIndex(Number(e.target.value));
                setAttemptText("");
                setPreview("");
              }}
            >
              <option value={-1}>Choose a source</option>
              {available.map((e, i) => (
                <option key={`${e.instanceId}-${i}`} value={i}>
                  {e.kind === "mouse" ? "Mouse" : "Keyboard"} source {i + 1}
                </option>
              ))}
            </select>
          </label>
          {available.length > 1 && (
            <p>
              Several logical sources are associated with this device candidate.
              Test each separately and perform the same actions to find the
              responding source. Input behind a wireless receiver cannot
              identify an individual radio peripheral.
            </p>
          )}
          {!available.length && (
            <p>
              No safely mapped input source is available. Refresh devices; an
              unmapped source does not mean the hardware is broken.
            </p>
          )}
          {endpoint?.kind === "keyboard" && (
            <details>
              <summary>Owner test conditions</summary>
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
                  onChange={(e) => {
                    setAttemptText(e.target.value);
                    setPreview("");
                  }}
                />
              </label>
            </details>
          )}
          <p>
            Keep AnyDevice active while testing. Stop before entering passwords
            or personal text. No typed text is translated or saved.
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
          <p role="status">
            {snapshot ? (statuses[snapshot.status] ?? "Unknown") : "Not tested"}
          </p>
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
                ].includes(e.key) &&
                running
              )
                e.preventDefault();
            }}
          >
            <p>
              {endpoint?.kind === "mouse"
                ? "Move, click and scroll in this area."
                : "Press keys on your keyboard. The display shows observed down/up transitions."}
            </p>
            {endpoint?.kind === "mouse" && (
              <>
                <div className="movement-indicator">
                  <span
                    style={{
                      transform: `translate(${Math.max(-80, Math.min(80, (snapshot?.stats.x ?? 0) / 10))}px,${Math.max(-35, Math.min(35, (snapshot?.stats.y ?? 0) / 10))}px)`,
                    }}
                  />
                </div>
                <p>Movement reports: {snapshot?.stats.movements ?? 0}</p>
                <div className="mouse-buttons">
                  {["Left", "Right", "Middle", "Extra 1", "Extra 2"].map(
                    (name, i) => {
                      const k = snapshot?.stats.buttons[String(i + 1)];
                      return (
                        <span
                          key={name}
                          className={`test-key ${k?.held ? "held" : ""}`}
                        >
                          {name}
                          <small>
                            {k?.down ?? 0} down / {k?.up ?? 0} up
                          </small>
                        </span>
                      );
                    },
                  )}
                </div>
                <p>
                  Scroll up: {snapshot?.stats.wheelUp ?? 0} · down:{" "}
                  {snapshot?.stats.wheelDown ?? 0} · horizontal:{" "}
                  {snapshot?.stats.horizontal ?? 0}
                </p>
              </>
            )}
            {endpoint?.kind === "keyboard" && (
              <>
                <div className="keyboard-scroll">
                  <div className="keyboard-layout">
                    {renderKeys(keyboardLayout, "US ANSI reference keyboard")}
                    {renderKeys(navigationLayout, "Navigation keys")}
                    <div className="number-pad" aria-label="Number pad">
                      {[
                        144, 111, 106, 109, 103, 104, 105, 107, 100, 101, 102,
                        97, 98, 99, 13, 96, 110,
                      ].map((vk) => {
                        const count = snapshot?.stats.keys[String(vk)];
                        const label =
                          vk === 13
                            ? "Enter"
                            : vk === 144
                              ? "Num"
                              : vk === 111
                                ? "/"
                                : vk === 106
                                  ? "*"
                                  : vk === 109
                                    ? "−"
                                    : vk === 107
                                      ? "+"
                                      : vk === 110
                                        ? "."
                                        : String(vk - 96);
                        return (
                          <span
                            key={vk}
                            className={`test-key pad-${vk} ${count?.held ? "held" : ""}`}
                          >
                            <span>{label}</span>
                            <small>
                              {count?.down ?? 0}↓ {count?.up ?? 0}↑
                            </small>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <p>
                  US ANSI reference layout; your physical layout may differ.
                  Virtual key codes can combine positions (including Enter and
                  keypad Enter), and Num Lock can change keypad codes. Scan-code
                  identities are tracked separately for repeats, but physical
                  switch mapping is not verified.
                </p>
              </>
            )}
          </div>
          <h3>Results and next steps</h3>
          <p>
            Native events received: {snapshot?.stats.events ?? 0}.
            Down/up/repeat counts describe the selected logical source only.
          </p>
          {snapshot && !snapshot.stats.events && (
            <p>
              No native events reached this session. Confirm the selected
              source, click the test surface to keep focus, check whether
              mapping is available, refresh input interfaces and retry each
              associated source separately. Windows policy or endpoint routing
              may prevent monitoring; no received events does not prove a broken
              switch.
            </p>
          )}
          {testOutcome(snapshot, attempts).map((c) => (
            <article className="test-result" key={c.name}>
              <strong>
                {c.name} — {c.state}
              </strong>
              <p>{c.explanation}</p>
            </article>
          ))}
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
              onChange={(e) => {
                setSymptom(e.target.value);
                setPreview("");
              }}
            />
          </label>
          <label>
            Test conditions / visible observations{" "}
            <textarea
              aria-label="Test conditions"
              maxLength={2000}
              value={conditions}
              onChange={(e) => {
                setConditions(e.target.value);
                setPreview("");
              }}
            />
          </label>
          <p>
            Your report is kept separately from measured events and stays local
            until you export it.
          </p>
          {symptomPlan(symptom, endpoint?.kind, snapshot).map((item, i) => (
            <article key={i}>
              <strong>{item.classification}</strong>
              <p>{item.text}</p>
            </article>
          ))}
          <p>
            No repair or lighting command is available. Input tests cannot
            verify an LED’s physical state.
          </p>
        </>
      )}
      {tab === "History & export" && (
        <>
          <p>
            Up to eight completed tests stay here until you leave this
            workspace. Export before leaving. Ordered key events are excluded;
            aggregate key codes and counts can still be sensitive.
          </p>
          {!history.length && <p>No completed tests yet.</p>}
          {history.map((s) => (
            <article key={s.sessionId}>
              <strong>
                {s.mode} — {statuses[s.status] ?? s.status}
              </strong>
              <p>
                {s.stats.events} observed events at {s.startedAt}
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
                      lighting,
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
            {sanitized
              ? "Identities and your written report are withheld."
              : "Raw export includes identities and your written report. Review before sharing."}
          </p>
        </>
      )}
      <details className="advanced-stats">
        <summary>Stats for nerds</summary>
        <p>{inspection}</p>
        <p>{snapshot?.reason}</p>
        <p>
          {snapshot
            ? `Native event count: ${snapshot.stats.events}. Target: ${snapshot.targetId}. Cleanup: ${snapshot.cleanup ? "confirmed" : "pending"}.`
            : "No input session exists."}
        </p>
        <details>
          <summary>Identifiers, topology and mapping evidence</summary>
          <pre>
            {JSON.stringify(
              {
                selected: device,
                classification: candidate?.evidence,
                related,
                available,
              },
              null,
              2,
            )}
          </pre>
        </details>
        {snapshot && (
          <>
            <h3>Per-key down/up/repeat counts</h3>
            {Object.keys(snapshot.stats.keys).length ? (
              <pre>{JSON.stringify(snapshot.stats.keys, null, 2)}</pre>
            ) : (
              <p>
                No per-key events were recorded in this session.{" "}
                {snapshot.mode === "mouse"
                  ? "This is a mouse test."
                  : "Check the source, focus and session result above."}
              </p>
            )}
            <details>
              <summary>
                Recent measured events and timestamps (volatile)
              </summary>
              {snapshot.recent.length ? (
                <pre>{JSON.stringify(snapshot.recent, null, 2)}</pre>
              ) : (
                <p>No measured events recorded.</p>
              )}
            </details>
          </>
        )}
        {preview && <pre aria-label="Workbench report preview">{preview}</pre>}
      </details>
      <button
        onClick={() => {
          document
            .querySelectorAll<HTMLDetailsElement>(".workbench details")
            .forEach((d) => (d.open = false));
          top.current?.scrollIntoView?.({ block: "start" });
          top.current?.focus();
        }}
      >
        Back to top
      </button>
      {message && <p role="alert">{message}</p>}
    </section>
  );
}
