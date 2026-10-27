import { useState } from "react";
import { reportProblem, symptoms, type Symptom } from "./reportedProblems";
import type { DiagnosticCheck } from "./diagnosticEngine";
export function ProblemIntake({
  targets,
  onReport,
  disabled,
}: {
  targets: { id: string; name: string }[];
  onReport: (check: DiagnosticCheck) => void;
  disabled: boolean;
}) {
  const [target, setTarget] = useState("system"),
    [symptom, setSymptom] = useState<Symptom>("keyboard-light"),
    [detail, setDetail] = useState("");
  const [saved, setSaved] = useState("");
  return (
    <section aria-label="Report a device symptom">
      <h2>What is not working?</h2>
      <p>
        Start with the problem you notice. A normal Windows status does not rule
        out a dark light, missed press or other physical symptom.
      </p>
      <label>
        Affected device
        <select
          aria-label="Problem device"
          value={targets.some((t) => t.id === target) ? target : "system"}
          disabled={disabled}
          onChange={(e) => setTarget(e.target.value)}
        >
          <option value="system">Not identified yet</option>
          {targets.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Problem
        <select
          aria-label="Problem symptom"
          value={symptom}
          disabled={disabled}
          onChange={(e) => setSymptom(e.target.value as Symptom)}
        >
          {Object.entries(symptoms).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        What you observed
        <textarea
          aria-label="Problem observation"
          placeholder="For example: the right-arrow light stays dark while neighboring lights work."
          maxLength={1000}
          value={detail}
          disabled={disabled}
          onChange={(e) => setDetail(e.target.value)}
        />
      </label>
      <button
        disabled={disabled || !detail.trim()}
        onClick={() => {
          onReport(
            reportProblem(
              targets.some((t) => t.id === target) ? target : "system",
              symptom,
              detail.trim(),
            ),
          );
          setDetail("");
          setSaved(
            "Symptom recorded. Review its investigation plan below; a rescan will not erase it.",
          );
        }}
      >
        Start investigating this problem
      </button>
      <p role="status">{saved}</p>
      <p>
        Reports stay in this app session until you close it. Export them to keep
        a record; sanitized export withholds your free text.
      </p>
    </section>
  );
}
