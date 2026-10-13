import { useState } from "react";
import type { Scan } from "./models";
import {
  capture,
  compare,
  investigationReport,
  type Investigation,
} from "./investigation";
import {
  analysisReport,
  annotate,
  binaryDiff,
  hexRows,
  readSample,
  type BinarySample,
  type ByteAnnotation,
} from "./binary";
import { saveReport } from "./bridge";

export function InvestigationPanel({
  scan,
  sanitized,
  session,
  onSession,
}: {
  scan?: Scan;
  sanitized: boolean;
  session?: Investigation;
  onSession: (session: Investigation | undefined) => void;
}) {
  const [annotation, setAnnotation] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const latest = session?.captures.at(-1);
  const diff = latest && scan ? compare(latest.scan, scan) : undefined;
  const preview = session
    ? JSON.stringify(investigationReport(session, sanitized), null, 2)
    : "";
  return (
    <section>
      <p>
        Record a complete baseline, perform your own controlled action, refresh
        the inventory, then capture the observation. History stays in memory
        until exported.
      </p>
      <div className="segmented">
        <button
          disabled={!scan?.complete || !!session}
          onClick={() => {
            if (scan)
              onSession(
                capture(
                  {
                    schemaVersion: "investigation-1.0",
                    startedAt: scan.collectedAt,
                    captures: [],
                  },
                  scan,
                  "Baseline",
                ),
              );
          }}
        >
          Record baseline
        </button>
        <button
          disabled={!session}
          onClick={() => {
            onSession(undefined);
            setMessage("Session cleared from memory.");
          }}
        >
          Clear session
        </button>
      </div>
      {session && (
        <>
          <label className="field">
            Your action or hypothesis (unverified)
            <textarea
              maxLength={2000}
              value={annotation}
              onChange={(e) => setAnnotation(e.target.value)}
              placeholder="Describe what you changed before refreshing"
            />
          </label>
          <button
            disabled={
              !scan ||
              scan.collectedAt === latest?.scan.collectedAt ||
              session.captures.length >= 8
            }
            onClick={() => {
              try {
                if (scan) onSession(capture(session, scan, annotation));
                setAnnotation("");
              } catch (e) {
                setMessage(String(e));
              }
            }}
          >
            Capture current snapshot
          </button>
          <p>
            {session.captures.length}/8 captures ·{" "}
            {sanitized
              ? "Export annotations withheld"
              : "Export includes your annotations"}
          </p>
          {diff && (
            <>
              <h2>Changes since last capture</h2>
              <p>{diff.reason}</p>
              <ul>
                {diff.changes.map((d) => (
                  <li key={d.id}>
                    <strong>{d.kind}</strong> · <code>{d.id}</code>
                    {d.fields.length ? ` · ${d.fields.join(", ")}` : ""}
                  </li>
                ))}
              </ul>
              {diff.comparable && !diff.changes.length && (
                <p>No supported property changes observed.</p>
              )}
            </>
          )}
          <h2>Collection timeline</h2>
          <ol>
            {session.captures.map((c, i) => (
              <li key={i}>
                {c.scan.collectedAt} · {c.scan.devices.length} nodes ·{" "}
                {c.scan.complete ? "complete" : "partial"}
                <p>User annotation: {c.annotation || "None"}</p>
              </li>
            ))}
          </ol>
          <details>
            <summary>Exact investigation export preview</summary>
            <pre className="report-preview">{preview}</pre>
          </details>
          <button
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              try {
                const path = await saveReport(preview);
                setMessage(
                  path ? "Investigation saved locally." : "Save cancelled.",
                );
              } catch (e) {
                setMessage(String(e));
              } finally {
                setSaving(false);
              }
            }}
          >
            Save investigation JSON
          </button>
        </>
      )}
      <p aria-live="polite">{message}</p>
    </section>
  );
}

export interface BinaryWorkspace {
  sample?: BinarySample;
  second?: BinarySample;
  annotations: ByteAnnotation[];
}
export function BinaryPanel({
  sanitized,
  workspace,
  onWorkspace,
}: {
  sanitized: boolean;
  workspace: BinaryWorkspace;
  onWorkspace: (v: BinaryWorkspace) => void;
}) {
  const { sample, second, annotations } = workspace;
  const [offset, setOffset] = useState(0),
    [length, setLength] = useState(1),
    [label, setLabel] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function load(file: File | undefined, comparison: boolean) {
    if (!file) return;
    setBusy(true);
    try {
      const next = await readSample(file);
      onWorkspace(
        comparison
          ? { ...workspace, second: next }
          : { sample: next, annotations: [] },
      );
      setOffset(0);
      setMessage(
        "Raw bytes imported locally; no format interpretation performed.",
      );
    } catch (e) {
      setMessage(String(e));
    } finally {
      setBusy(false);
    }
  }
  const diff =
    sample && second ? binaryDiff(sample.bytes, second.bytes) : undefined;
  const preview = sample
    ? JSON.stringify(
        analysisReport(sample, annotations, second, sanitized),
        null,
        2,
      )
    : "";
  return (
    <section>
      <p>
        Inspect authorized raw byte samples (.bin, .dat, .raw; 1 byte–1 MiB).
        Files remain in memory. Imported bytes are never executed or sent to a
        device.
      </p>
      <div className="segmented">
        <label className="field">
          Primary sample
          <input
            disabled={busy}
            type="file"
            accept=".bin,.dat,.raw"
            onChange={(e) => {
              void load(e.target.files?.[0], false);
              e.target.value = "";
            }}
          />
        </label>
        <label className="field">
          Comparison sample
          <input
            disabled={busy || !sample}
            type="file"
            accept=".bin,.dat,.raw"
            onChange={(e) => {
              void load(e.target.files?.[0], true);
              e.target.value = "";
            }}
          />
        </label>
        <button
          disabled={!sample || busy}
          onClick={() => {
            onWorkspace({ annotations: [] });
            setMessage("Samples cleared from memory.");
          }}
        >
          Clear samples
        </button>
      </div>
      {sample && (
        <>
          <h2>{sample.name}</h2>
          <p>
            {sample.bytes.length} bytes · SHA-256 <code>{sample.sha256}</code>
          </p>
          <label className="field">
            Byte offset (decimal)
            <input
              type="number"
              min={0}
              max={sample.bytes.length - 1}
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
            />
          </label>
          <pre className="report-preview" aria-label="Hex view">
            {Number.isInteger(offset) &&
            offset >= 0 &&
            offset < sample.bytes.length
              ? hexRows(sample.bytes, offset)
              : "Offset outside sample."}
          </pre>
          <div className="segmented">
            <button
              disabled={offset < 256}
              onClick={() => setOffset(offset - 256)}
            >
              Previous 256 bytes
            </button>
            <button
              disabled={offset + 256 >= sample.bytes.length}
              onClick={() => setOffset(offset + 256)}
            >
              Next 256 bytes
            </button>
          </div>
          <label className="field">
            Field length (bytes)
            <input
              type="number"
              value={length}
              min={1}
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </label>
          <label className="field">
            Hypothesis label
            <input
              maxLength={2000}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </label>
          <button
            disabled={annotations.length >= 256}
            onClick={() => {
              try {
                onWorkspace({
                  ...workspace,
                  annotations: [
                    ...annotations,
                    annotate(sample.bytes, offset, length, label),
                  ],
                });
                setLabel("");
                setMessage("Unvalidated hypothesis recorded.");
              } catch (e) {
                setMessage(String(e));
              }
            }}
          >
            Annotate byte range
          </button>
          <ul>
            {annotations.map((a, i) => (
              <li key={i}>
                Offset {a.offset}, length {a.length}: {a.label} · unvalidated
                hypothesis{" "}
                <button
                  aria-label={`Remove annotation ${i + 1}`}
                  onClick={() =>
                    onWorkspace({
                      ...workspace,
                      annotations: annotations.filter((_, j) => j !== i),
                    })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {diff && (
            <>
              <h2>Offset-aligned comparison</h2>
              <p>
                {diff.differences} differing offsets · common prefix{" "}
                {diff.commonPrefixLength} bytes
              </p>
              <pre>
                {diff.firstOffsets.join(", ") || "No differing bytes"}
                {diff.offsetsTruncated ? " (first 256 offsets only)" : ""}
              </pre>
              <p>{diff.limitations}</p>
            </>
          )}
          <details>
            <summary>Exact analysis export preview</summary>
            <pre className="report-preview">{preview}</pre>
          </details>
          <button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                const path = await saveReport(preview);
                setMessage(
                  path
                    ? "Analysis metadata saved locally; raw bytes excluded."
                    : "Save cancelled.",
                );
              } catch (e) {
                setMessage(String(e));
              } finally {
                setBusy(false);
              }
            }}
          >
            Save analysis JSON
          </button>
        </>
      )}
      <p aria-live="polite">{message}</p>
    </section>
  );
}
