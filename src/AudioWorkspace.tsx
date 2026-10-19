import {
  readinessCheck,
  sessionVolumeSummary,
  type Readiness,
} from "./nativeInvestigation";
import type { DiagnosticCheck } from "./diagnosticEngine";
import { streamProgress, type AudioFailure } from "./audioLifecycle";
import { useState, useEffect, useRef } from "react";
import {
  compareRepair,
  type FunctionalVerification,
} from "./repairVerification";
import { investigateAudio } from "./audioInvestigation";
import { RepairPanel } from "./RepairPanel";
import type { RepairAudit } from "./bridge";
import {
  inspectAudio,
  probeAudio,
  startAudioTest,
  audioTestStatus,
  stopAudioTest,
  discardAudioTest,
  saveReport,
} from "./bridge";
import {
  audioConclusion,
  routingAssessment,
  type EarObservation,
  type RoutingReport,
  compareQuietSpeech,
  type AudioInventory,
  type AudioSession,
} from "./audio";
import { diagnosticExport, staticHypotheses } from "./diagnosticEngine";
export function AudioWorkspace({
  initialEndpoint,
  onBack,
  onInventory,
  onSession,
  onRepair,
  repairHistory = [],
  routingHistory = [],
  onRouting,
  onReadiness,
}: {
  initialEndpoint?: string;
  onReadiness?: (c: DiagnosticCheck) => void;
  repairHistory?: RepairAudit[];
  routingHistory?: RoutingReport[];
  onRouting?: (r: RoutingReport) => void;
  onBack: () => void;
  onInventory: (v: AudioInventory) => void;
  onSession: (s: AudioSession) => void;
  onRepair: (a: RepairAudit) => void;
}) {
  const [inventory, setInventory] = useState<AudioInventory | null>(null),
    [target, setTarget] = useState(initialEndpoint ?? ""),
    [session, setSession] = useState<AudioSession | null>(null),
    [history, setHistory] = useState<AudioSession[]>([]),
    [message, setMessage] = useState("Reading Windows audio endpoints…"),
    [busy, setBusy] = useState(false),
    [consent, setConsent] = useState(false),
    [heard, setHeard] = useState<"yes" | "no" | "unknown">("unknown"),
    [staticReport, setStaticReport] = useState<boolean | null>(null),
    [preview, setPreview] = useState("");
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [failure, setFailure] = useState<AudioFailure | null>(null);
  const [starting, setStarting] = useState(false);
  const [observationFailed, setObservationFailed] = useState(false);
  const [routing, setRouting] = useState<RoutingReport[]>(routingHistory);
  const [ear, setEar] = useState<EarObservation>("unsure");
  const [trace, setTrace] = useState<number[]>([]);
  const [repairs, setRepairs] = useState<RepairAudit[]>(repairHistory);
  const [verification, setVerification] =
    useState<FunctionalVerification | null>(null);
  const beforeRepair = useRef<AudioSession | null>(null);
  const current = useRef<number | null>(null),
    mounted = useRef(true),
    lastArchived = useRef<number | null>(null),
    focus = useRef<HTMLDivElement>(null);
  const endpoint = inventory?.endpoints.find((e) => e.id === target);
  const running = !!session && !session.cleanup;
  function receive(v: AudioSession) {
    if (!mounted.current || v.sessionId !== current.current) return;
    setSession(v);
    if (v.mode === "ambient" || v.mode === "speech")
      setTrace((t) =>
        [...t, Math.max(0, ...v.window.map((l) => l.peak))].slice(-80),
      );
    if (v.cleanup && lastArchived.current !== v.sessionId) {
      lastArchived.current = v.sessionId;
      setHistory((h) => [...h, v].slice(-8));
      onSession(v);
      setVerification((old) =>
        old && old.beforeSessionId !== v.sessionId
          ? {
              ...old,
              afterSessionId: v.sessionId,
              ...compareRepair(beforeRepair.current, v),
              userOutcome: "unverified",
            }
          : old,
      );
    }
  }
  async function refresh() {
    setReadiness(null);
    setPreview("");
    setBusy(true);
    try {
      const v = await inspectAudio();
      if (mounted.current) {
        setInventory(v);
        onInventory(v);
        setMessage(
          v.errors.length
            ? "Some audio metadata is unavailable; review advanced evidence."
            : "Choose the exact playback or recording endpoint.",
        );
        if (!v.endpoints.some((e) => e.id === target)) setTarget("");
      }
    } catch (e) {
      if (mounted.current) setMessage(String(e));
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  useEffect(() => {
    mounted.current = true;
    void refresh();
    return () => {
      mounted.current = false;
      if (current.current !== null)
        void discardAudioTest(current.current).catch(() => {});
    };
  }, []);
  useEffect(() => {
    if (!running || observationFailed) return;
    let pending = false,
      cancelled = false;
    const timer = setInterval(async () => {
      if (pending || current.current === null) return;
      pending = true;
      try {
        const v = await audioTestStatus(current.current);
        if (!cancelled) receive(v);
      } catch (e) {
        if (!cancelled) {
          setFailure({
            stage: "Session observation",
            detail: String(e).slice(0, 2048),
          });
          setObservationFailed(true);
          if (current.current !== null)
            void stopAudioTest(current.current).catch(() => {});
        }
      } finally {
        pending = false;
      }
    }, 150);
    const stop = () => {
      if (current.current !== null)
        void stopAudioTest(current.current).catch(() => {});
    };
    const hidden = () => {
      if (document.hidden) stop();
    };
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      cancelled = true;
      clearInterval(timer);
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [session?.sessionId, session?.cleanup, observationFailed]);
  async function stop(reset = false) {
    if (current.current === null) {
      if (reset) {
        setSession(null);
        setFailure(null);
        setObservationFailed(false);
      }
      return;
    }
    setBusy(true);
    try {
      const id = current.current;
      await stopAudioTest(id);
      for (let n = 0; n < 40; n++) {
        const v = await audioTestStatus(id);
        receive(v);
        if (v.cleanup) {
          if (reset) {
            await discardAudioTest(id);
            current.current = null;
            setSession(null);
            setFailure(null);
            setObservationFailed(false);
            setHeard("unknown");
            setStaticReport(null);
            setEar("unsure");
            setTrace([]);
            setPreview("");
          }
          return;
        }
        await new Promise((r) => setTimeout(r, 100));
      }
      throw new Error(
        "Audio cleanup is not yet confirmed; wait before starting another test.",
      );
    } catch (e) {
      if (mounted.current) setMessage(String(e));
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  async function start(mode: AudioSession["mode"]) {
    if (
      !endpoint ||
      !consent ||
      endpoint.state !== "active" ||
      !endpoint.format?.supported ||
      running ||
      observationFailed
    )
      return;
    setBusy(true);
    setStarting(true);
    setFailure(null);
    setMessage("");
    setPreview("");
    setHeard("unknown");
    setEar("unsure");
    setTrace([]);
    setStaticReport(null);
    try {
      focus.current?.focus();
      if (current.current !== null) {
        await discardAudioTest(current.current);
        current.current = null;
        setSession(null);
      }
      const id = await startAudioTest(endpoint.id, mode);
      if (!mounted.current) {
        await discardAudioTest(id);
        return;
      }
      current.current = id;
      receive(await audioTestStatus(id));
    } catch (e) {
      if (mounted.current) {
        setFailure({
          stage:
            current.current === null ? "Start request" : "Session observation",
          detail: String(e).slice(0, 2048),
        });
        if (current.current !== null) {
          setObservationFailed(true);
          void stopAudioTest(current.current).catch(() => {});
        }
      }
    } finally {
      if (mounted.current) {
        setBusy(false);
        setStarting(false);
      }
    }
  }
  const result =
      session && ["left", "right", "tone"].includes(session.mode)
        ? routingAssessment(session, ear)
        : audioConclusion(session, heard),
    quiet = [...history]
      .reverse()
      .find((s) => s.mode === "ambient" && s.targetId === target),
    speech = [...history]
      .reverse()
      .find((s) => s.mode === "speech" && s.targetId === target);
  return (
    <section className="workbench" aria-label="Audio workspace">
      <button onClick={onBack}>Back to devices</button>
      <h2>Audio tests</h2>
      <p>
        Windows endpoint identity is known; physical sound and microphone
        quality still require controlled observations.
      </p>
      <label>
        Audio endpoint{" "}
        <select
          aria-label="Audio endpoint"
          disabled={running || busy || observationFailed}
          value={target}
          onChange={(e) => {
            if (current.current !== null)
              void discardAudioTest(current.current).catch(() => {});
            current.current = null;
            setTarget(e.target.value);
            setReadiness(null);
            setFailure(null);
            setObservationFailed(false);
            setSession(null);
            setConsent(false);
            setHeard("unknown");
            setStaticReport(null);
            setEar("unsure");
            setTrace([]);
            setPreview("");
          }}
        >
          <option value="">Choose an endpoint</option>
          {inventory?.endpoints.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} — {e.kind} — {e.state}
              {e.defaultRoles.includes("multimedia")
                ? " — default multimedia"
                : ""}
            </option>
          ))}
        </select>
      </label>
      <button disabled={running || busy} onClick={() => void refresh()}>
        Refresh audio endpoints
      </button>
      {endpoint && (
        <>
          <button
            disabled={running || busy || endpoint.state !== "active"}
            onClick={async () => {
              setBusy(true);
              setReadiness(null);
              setMessage(
                "Checking initialization without starting sound or recording…",
              );
              try {
                const r = await probeAudio(endpoint.id, endpoint.kind);
                if (mounted.current) {
                  setReadiness(r);
                  onReadiness?.(readinessCheck(r));
                  setMessage(readinessCheck(r).conclusion);
                }
              } catch (e) {
                if (mounted.current)
                  setMessage(`Readiness request failed: ${String(e)}`);
              } finally {
                if (mounted.current) setBusy(false);
              }
            }}
          >
            Check endpoint readiness (no sound or capture)
          </button>
          {readiness && (
            <article className="finding">
              <h3>
                {readiness.complete
                  ? "Initialization and service access confirmed"
                  : "Readiness check could not complete"}
              </h3>
              <p>{readinessCheck(readiness).conclusion}</p>
              <p>{readinessCheck(readiness).nextStep}</p>
              <p>{sessionVolumeSummary(readiness)}</p>
              <details>
                <summary>
                  Advanced evidence — initialization stage and original error
                </summary>
                <pre>{JSON.stringify(readiness, null, 2)}</pre>
              </details>
            </article>
          )}
        </>
      )}
      {endpoint && (
        <>
          <p>
            {endpoint.kind === "recording"
              ? "Microphone input"
              : "Playback output"}{" "}
            · Windows {endpoint.state} ·{" "}
            {endpoint.mute === null
              ? "Mute unknown"
              : endpoint.mute
                ? "Muted"
                : "Not muted"}{" "}
            ·{" "}
            {endpoint.volume === null
              ? "Level unavailable"
              : `Windows level ${Math.round(endpoint.volume * 100)}%`}
          </p>
          <label>
            <input
              type="checkbox"
              aria-label="Allow this audio test"
              disabled={running || busy}
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            {endpoint.kind === "recording"
              ? "I agree to an 8-second local microphone level measurement. No recorded audio is saved or uploaded."
              : "I agree to a quiet, bounded 3-second test tone on this endpoint. Lower normal listening volume first; the app does not change it."}
          </label>
          <div className="row">
            {endpoint.kind === "playback" ? (
              (["left", "right", "tone"] as const).map((mode) => (
                <button
                  key={mode}
                  disabled={
                    !consent ||
                    observationFailed ||
                    running ||
                    busy ||
                    endpoint.state !== "active" ||
                    !endpoint.format?.supported ||
                    (mode !== "tone" &&
                      (endpoint.format.channels !== 2 ||
                        ![0, 3].includes(endpoint.format.channelMask)))
                  }
                  onClick={() => void start(mode)}
                >
                  {mode === "tone" ? "Play quiet tone" : `Test ${mode} channel`}
                </button>
              ))
            ) : (
              <>
                <button
                  disabled={
                    !consent ||
                    observationFailed ||
                    running ||
                    busy ||
                    endpoint.state !== "active" ||
                    !endpoint.format?.supported
                  }
                  onClick={() => void start("ambient")}
                >
                  Measure quiet interval
                </button>
                <button
                  disabled={
                    !consent ||
                    observationFailed ||
                    running ||
                    busy ||
                    endpoint.state !== "active" ||
                    !endpoint.format?.supported
                  }
                  onClick={() => void start("speech")}
                >
                  Measure speech interval
                </button>
              </>
            )}
            <button disabled={!running || busy} onClick={() => void stop()}>
              Stop audio test
            </button>
            <button disabled={busy} onClick={() => void stop(true)}>
              Reset audio test
            </button>
          </div>
          {endpoint.state !== "active" && (
            <p>
              This Windows endpoint is {endpoint.state}. Reconnect/select an
              active endpoint; a remembered entry is not a connected headphone.
            </p>
          )}
          {!endpoint.format?.supported && (
            <p>
              A supported shared-mode format is unavailable. No test will be
              started on this endpoint.
            </p>
          )}
        </>
      )}
      <div
        ref={focus}
        tabIndex={0}
        className="input-test-surface"
        aria-label="Audio test focus"
      >
        <p role="status">{streamProgress(session, failure, starting, heard)}</p>
        {endpoint?.kind === "recording" &&
          session?.window.map((level, i) => (
            <div key={i}>
              <label>
                Channel {i + 1} RMS: {level.rmsDbfs.toFixed(1)} dBFS{" "}
                <meter
                  min={0}
                  max={1}
                  value={Math.min(1, level.rms)}
                  aria-label={`Channel ${i + 1} live RMS`}
                />
              </label>
              <p>
                Peak: {level.peak.toFixed(3)} of full scale · near-full-scale
                samples: {(level.clippingProportion * 100).toFixed(2)}%
              </p>
            </div>
          ))}
      </div>
      {failure && (
        <article className="finding" role="alert">
          <h3>{failure.stage} failed</h3>
          <p>
            Confirm the exact active endpoint, keep AnyDevice focused, refresh
            endpoint state and check Windows microphone privacy permission for
            capture. Stop or Reset must confirm cleanup before another test.
          </p>
          <details>
            <summary>Advanced evidence — audio error</summary>
            <pre>{failure.detail}</pre>
          </details>
        </article>
      )}
      {session &&
        ["failed", "unsupported", "interrupted"].includes(session.status) && (
          <article className="finding">
            <h3>Audio test {session.status}</h3>
            <p>
              No successful physical test is established. Refresh the selected
              endpoint; check supported format, focus and Windows permission
              before retrying.
            </p>
            <details>
              <summary>Advanced evidence — native failure stage</summary>
              <p>{session.reason}</p>
              <p>
                Frames: {session.frames}; cleanup: {String(session.cleanup)}
              </p>
            </details>
          </article>
        )}
      {session?.cleanup &&
        session.status === "completed" &&
        session.frames > 0 &&
        session.format?.supported &&
        endpoint?.kind === "playback" && (
          <>
            <label>
              Which ear produced sound during the {session.mode} test?{" "}
              <select
                aria-label="Observed ear"
                value={ear}
                onChange={(e) => {
                  const observation = e.target.value as EarObservation;
                  setEar(observation);
                  setPreview("");
                  setHeard(
                    observation === "unsure"
                      ? "unknown"
                      : observation === session.mode ||
                          (session.mode === "tone" && observation !== "neither")
                        ? "yes"
                        : "no",
                  );
                  onRouting?.({
                    sessionId: session.sessionId,
                    targetId: session.targetId,
                    mode: session.mode,
                    observation,
                  });
                  setRouting((v) =>
                    [
                      ...v.filter((r) => r.sessionId !== session.sessionId),
                      {
                        sessionId: session.sessionId,
                        targetId: session.targetId,
                        mode: session.mode,
                        observation,
                      },
                    ].slice(-8),
                  );
                }}
              >
                <option value="unsure">Not checked / unsure</option>
                <option value="left">Left only</option>
                <option value="right">Right only</option>
                <option value="both">Both earbuds</option>
                <option value="neither">Neither earbud</option>
              </select>
            </label>
            {ear === "neither" && (
              <article className="finding" role="alert">
                <h3>No sound reported</h3>
                <p>
                  The stream finished, but the audible test did not pass.
                  Compare ordinary audio through this same endpoint. If that is
                  also silent, investigate the shared Windows/Bluetooth/device
                  path. If ordinary audio works, inspect AnyDevice in Windows
                  Volume mixer and compare its readiness evidence.
                </p>
                <p>
                  Record one change at a time and retry explicitly. No driver,
                  connection, mute or volume setting has been changed by this
                  test.
                </p>
              </article>
            )}
            <p>
              First test left, record what you heard, then test right and record
              again. Each stream is stopped before the next is created.
            </p>
            <p>
              Generated/submitted channel evidence:{" "}
              {session.aggregate
                .map((l, i) => `channel ${i + 1} peak ${l.peak.toFixed(4)}`)
                .join("; ")}
              . Windows accepted frames does not prove downstream physical
              routing. Bluetooth profile, system mono audio and device
              processing remain unverified.
            </p>
            {session.mode === "left" && ear !== "unsure" && (
              <button
                disabled={busy || !consent || endpoint.state !== "active"}
                onClick={() => void start("right")}
              >
                Continue with right channel
              </button>
            )}
          </>
        )}
      {!!trace.length && endpoint?.kind === "recording" && (
        <figure aria-label="Live microphone level history">
          <svg
            role="img"
            aria-label="Peak level envelope"
            viewBox="0 0 400 100"
            style={{ width: "100%", height: 100 }}
          >
            <polyline
              fill="none"
              stroke="currentColor"
              points={trace
                .map((p, i) => `${i * 5},${50 - Math.min(1, p) * 48}`)
                .join(" ")}
            />
            <polyline
              fill="none"
              stroke="currentColor"
              points={trace
                .map((p, i) => `${i * 5},${50 + Math.min(1, p) * 48}`)
                .join(" ")}
            />
          </svg>
          <figcaption>
            Live peak envelope, at most 80 updates. This is a downsampled level
            history, not a stored or replayable speech waveform.
          </figcaption>
        </figure>
      )}
      {endpoint && (
        <details>
          <summary>
            Investigate this audio path — evidence for and against
          </summary>
          <p>{investigateAudio(endpoint, session, ear).conclusion}</p>
          {investigateAudio(endpoint, session, ear).hypotheses.map((h) => (
            <article key={h.cause}>
              <strong>
                {h.cause} — {h.confidence}
              </strong>
              <p>Next test: {h.distinguishingTest}</p>
              <p>
                Supports:{" "}
                {h.supportingEvidence?.join(" ") ||
                  "No supporting evidence yet."}
              </p>
              <p>
                Against / limits:{" "}
                {h.contradictingEvidence?.join(" ") ||
                  "No contradicting evidence recorded."}
              </p>
              <p>Verify: {h.verificationCriterion}</p>
            </article>
          ))}
        </details>
      )}
      {session && (
        <p>
          Current interval: {session.elapsedMs ?? "unknown"} ms ·{" "}
          {session.frames}{" "}
          {endpoint?.kind === "recording" ? "captured" : "submitted"} frames ·{" "}
          {session.engineConsumedFrames ?? "not measured"} frames dequeued from
          playback buffer. Dequeued frames are engine-buffer evidence, not
          loopback or proof of audible sound.
        </p>
      )}
      <h3>{failure ? "Inconclusive" : result.outcome}</h3>
      <p>
        {failure
          ? "The request or observation path failed; an older result does not establish this test succeeded."
          : result.text}
      </p>
      {endpoint?.kind === "recording" && (
        <>
          <h3>Investigate microphone static</h3>
          <ol>
            <li>Remain quiet and measure an ambient interval.</li>
            <li>
              Speak at a normal distance in a separate speech interval on the
              same endpoint.
            </li>
            <li>
              Compare the levels and repeat the same procedure. Windows
              processing/gain can affect measurements.
            </li>
          </ol>
          <p>{compareQuietSpeech(quiet, speech)}</p>
          {quiet?.status === "completed" && !!quiet.aggregate[0]?.samples && (
            <p>
              Requested-quiet digital noise-floor estimate by channel:{" "}
              {quiet.aggregate
                .map((l, i) => `${i + 1}: ${l.rmsDbfs.toFixed(1)} dBFS`)
                .join("; ")}
              . This includes environment, gain and processing and is not a
              calibrated acoustic noise floor.
            </p>
          )}
          {!!session?.discontinuities && (
            <p>
              Windows signalled {session.discontinuities} stream
              discontinuities. This does not measure the number or duration of
              physical audio dropouts.
            </p>
          )}
          <label>
            Was static audible in your own listening/comparison?{" "}
            <select
              aria-label="User reported static"
              value={
                staticReport === null ? "unknown" : staticReport ? "yes" : "no"
              }
              onChange={(e) => {
                setPreview("");
                setStaticReport(
                  e.target.value === "unknown"
                    ? null
                    : e.target.value === "yes",
                );
              }}
            >
              <option value="unknown">Not checked / unsure</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          <p>
            This is your report, separate from numerical readings. This app does
            not monitor captured speech through the speakers or retain a
            recording.
          </p>
          {staticHypotheses(session, staticReport).map((h) => (
            <article className="finding" key={h.cause}>
              <strong>
                {h.confidence}: {h.cause}
              </strong>
              <p>{h.test}</p>
            </article>
          ))}
        </>
      )}
      <details>
        <summary>Stats for nerds</summary>
        <p>
          dBFS is digital level relative to full scale, not sound pressure or
          calibrated acoustic loudness. Zero is shown at the −120 dBFS display
          floor. Live levels summarize received packets since the previous
          approximately 100 ms update; final levels cover all received samples.
          Near-full-scale means |sample| ≥ 0.999; that threshold is a numerical
          observation, not a universal microphone quality threshold.
        </p>
        <p>
          Discontinuity/timestamp flags describe Windows stream observations,
          not proven physical dropouts. Enhancements/AGC are not inspected or
          changed. No vendor protocol/LED capability is inferred.
        </p>
        <pre>
          {JSON.stringify(
            {
              endpoint,
              session,
              quiet: quiet?.aggregate,
              speech: speech?.aggregate,
            },
            null,
            2,
          )}
        </pre>
      </details>
      {endpoint && (
        <RepairPanel
          key={endpoint.id}
          previousAudit={repairs.at(-1)}
          targetId={endpoint.id}
          muted={endpoint.mute}
          endpointState={endpoint.state}
          running={running || busy}
          onVerified={(a) => {
            beforeRepair.current = session;
            setVerification(
              a.verified && !a.rolledBack
                ? {
                    repairId: a.id,
                    beforeSessionId: session?.sessionId ?? null,
                    afterSessionId: null,
                    ...compareRepair(session, null),
                    userOutcome: "unverified",
                  }
                : null,
            );
            setRepairs((v) => [...v, a].slice(-8));
            onRepair(a);
            setPreview("");
            void refresh();
          }}
        />
      )}
      {verification && (
        <section aria-label="Functional repair verification">
          <h3>Verify the original symptom</h3>
          <p>{verification.reason}</p>
          {beforeRepair.current && (
            <button
              disabled={
                running ||
                busy ||
                !consent ||
                beforeRepair.current.targetId !== target ||
                endpoint?.state !== "active"
              }
              onClick={() => void start(beforeRepair.current!.mode)}
            >
              Repeat the same test after repair
            </button>
          )}
          <p>
            Before test: {verification.beforeSessionId ?? "not recorded"}; after
            test: {verification.afterSessionId ?? "not recorded"}.{" "}
            {verification.changesDb.length
              ? `Digital RMS changes: ${verification.changesDb.map((v) => v.toFixed(1)).join(", ")} dB.`
              : "No microphone level comparison recorded."}
          </p>
          <label>
            Did the original symptom improve after that repeat?{" "}
            <select
              aria-label="Repair symptom outcome"
              disabled={!verification.comparable}
              value={verification.userOutcome}
              onChange={(e) => {
                setVerification((v) =>
                  v
                    ? {
                        ...v,
                        userOutcome: e.target
                          .value as FunctionalVerification["userOutcome"],
                      }
                    : v,
                );
                setPreview("");
              }}
            >
              <option value="unverified">Not verified / unsure</option>
              <option value="improved">I observed improvement</option>
              <option value="unchanged">I observed no improvement</option>
              <option value="worse">I observed worse behavior</option>
            </select>
          </label>
          <p>
            This is your report, separate from mute readback and numerical
            measurements. No independent physical verification is claimed.
          </p>
        </section>
      )}
      <button
        disabled={running}
        onClick={() =>
          setPreview(
            JSON.stringify(
              diagnosticExport(
                null,
                endpoint ? [investigateAudio(endpoint, session, ear)] : [],
                inventory,
                history,
                true,
                repairs,
                {
                  sessionId: session?.sessionId ?? null,
                  heardExpected: heard,
                  staticReported: staticReport,
                },
                routing,
                verification,
              ),
              null,
              2,
            ),
          )
        }
      >
        Prepare sanitized audio report
      </button>
      <button
        disabled={!preview || running}
        onClick={async () => {
          try {
            setMessage(
              (await saveReport(preview)) ? "Report saved" : "Save cancelled",
            );
          } catch (e) {
            setMessage(String(e));
          }
        }}
      >
        Save audio report
      </button>
      {preview && (
        <details>
          <summary>Stats for nerds — report preview</summary>
          <pre>{preview}</pre>
        </details>
      )}
      {message && <p>{message}</p>}
    </section>
  );
}
