import { useState, useEffect, useRef } from "react";
import { RepairPanel } from "./RepairPanel";
import type { RepairAudit } from "./bridge";
import {
  inspectAudio,
  startAudioTest,
  audioTestStatus,
  stopAudioTest,
  discardAudioTest,
  saveReport,
} from "./bridge";
import {
  audioConclusion,
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
}: {
  initialEndpoint?: string;
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
  const [repairs, setRepairs] = useState<RepairAudit[]>([]);
  const current = useRef<number | null>(null),
    mounted = useRef(true),
    lastArchived = useRef<number | null>(null),
    focus = useRef<HTMLDivElement>(null);
  const endpoint = inventory?.endpoints.find((e) => e.id === target);
  const running = !!session && !session.cleanup;
  function receive(v: AudioSession) {
    if (!mounted.current || v.sessionId !== current.current) return;
    setSession(v);
    if (v.cleanup && lastArchived.current !== v.sessionId) {
      lastArchived.current = v.sessionId;
      setHistory((h) => [...h, v].slice(-8));
      onSession(v);
    }
  }
  async function refresh() {
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
    if (!running) return;
    let pending = false,
      cancelled = false;
    const timer = setInterval(async () => {
      if (pending || current.current === null) return;
      pending = true;
      try {
        const v = await audioTestStatus(current.current);
        if (!cancelled) receive(v);
      } catch (e) {
        if (!cancelled) setMessage(String(e));
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
  }, [session?.sessionId, session?.cleanup]);
  async function stop(reset = false) {
    if (current.current === null) {
      if (reset) setSession(null);
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
            setHeard("unknown");
            setStaticReport(null);
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
    if (!endpoint || !consent) return;
    setBusy(true);
    setMessage("");
    setPreview("");
    setHeard("unknown");
    setStaticReport(null);
    try {
      focus.current?.focus();
      const id = await startAudioTest(endpoint.id, mode);
      if (!mounted.current) {
        await discardAudioTest(id);
        return;
      }
      current.current = id;
      receive(await audioTestStatus(id));
    } catch (e) {
      if (mounted.current) setMessage(String(e));
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  const result = audioConclusion(session, heard),
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
          disabled={running || busy}
          value={target}
          onChange={(e) => {
            if (current.current !== null)
              void discardAudioTest(current.current).catch(() => {});
            current.current = null;
            setTarget(e.target.value);
            setSession(null);
            setConsent(false);
            setHeard("unknown");
            setStaticReport(null);
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
                    running ||
                    busy ||
                    endpoint.state !== "active" ||
                    !endpoint.format?.supported ||
                    (mode !== "tone" && endpoint.format.channels !== 2)
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
        <p role="status">
          {running
            ? endpoint?.kind === "recording"
              ? "Microphone measurement active — keep AnyDevice active"
              : "Playback test active — keep AnyDevice active"
            : "No audio stream active"}
        </p>
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
      {session?.cleanup && endpoint?.kind === "playback" && (
        <label>
          Was sound audible in the expected channel?{" "}
          <select
            aria-label="Audible expected sound"
            value={heard}
            onChange={(e) => {
              setHeard(e.target.value as typeof heard);
              setPreview("");
            }}
          >
            <option value="unknown">Not checked / unsure</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
      )}
      <h3>{result.outcome}</h3>
      <p>{result.text}</p>
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
          <label>
            Was static audible in your own listening/comparison?{" "}
            <select
              aria-label="User reported static"
              value={
                staticReport === null ? "unknown" : staticReport ? "yes" : "no"
              }
              onChange={(e) =>
                setStaticReport(
                  e.target.value === "unknown"
                    ? null
                    : e.target.value === "yes",
                )
              }
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
          targetId={endpoint.id}
          muted={endpoint.mute}
          running={running || busy}
          onVerified={(a) => {
            setRepairs((v) => [...v, a].slice(-8));
            onRepair(a);
            setPreview("");
            void refresh();
          }}
        />
      )}
      <button
        disabled={running}
        onClick={() =>
          setPreview(
            JSON.stringify(
              diagnosticExport(null, [], inventory, history, true, repairs, {
                sessionId: session?.sessionId ?? null,
                heardExpected: heard,
                staticReported: staticReport,
              }),
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
