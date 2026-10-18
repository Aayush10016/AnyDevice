import type { DiagnosticCheck } from "./diagnosticEngine";
import { muteEligibility } from "./repairProviders";

export function structureCheck(c: DiagnosticCheck) {
  const definitionId = c.id.split(":")[0];
  const category =
    definitionId.startsWith("audio") ||
    ["stream", "ear", "selected-audio-investigation"].includes(definitionId)
      ? "audio"
      : ["input", "hid", "protocol"].includes(definitionId)
        ? "input-and-protocol"
        : "inventory";
  const mute = c.test === "Audio endpoint state/configuration";
  const eligibility = muteEligibility({
    state: c.measurements.state,
    mute: c.measurements.mute,
  });
  return {
    ...c,
    definitionId,
    checkVersion: 1,
    classification:
      c.outcome === "Issue detected"
        ? c.confidence === "User-reported"
          ? "potential_issue"
          : "confirmed_issue"
        : c.outcome === "Warning"
          ? "potential_issue"
          : c.outcome === "Passed"
            ? "informational"
            : c.outcome === "Not tested"
              ? "not_tested"
              : c.outcome === "Not supported"
                ? "unsupported"
                : "inconclusive",
    observedAt:
      typeof c.measurements.observedAt === "string"
        ? c.measurements.observedAt
        : null,
    category,
    preconditions:
      category === "audio"
        ? [
            "Exact endpoint identity; fresh endpoint state for execution",
            "Explicit approval for playback, capture or setting changes",
          ]
        : [
            "Bounded provider observation; logical identity is not physical attribution",
          ],
    evidenceSource:
      c.confidence === "User-reported"
        ? "Explicit owner report"
        : category === "audio"
          ? "Windows Core Audio / WASAPI"
          : category === "input-and-protocol"
            ? "Raw Input / HID capabilities; see named provider coverage"
            : "Windows PnP enumeration",
    confidenceRationale:
      c.confidence === "Measured"
        ? "Bounded software measurement; downstream physical behavior is not independently measured."
        : c.confidence === "User-reported"
          ? "Explicit owner observation; not independently instrumented."
          : c.confidence === "Windows-reported"
            ? "Windows configuration/status observation; not a functional hardware verdict."
            : "Missing or unsupported evidence limits the conclusion.",
    supportingEvidence: [
      c.conclusion,
      ...c.hypotheses.flatMap((h) => h.supportingEvidence ?? []),
    ],
    contradictingEvidence: c.hypotheses.flatMap(
      (h) => h.contradictingEvidence ?? [],
    ),
    unknowns: [
      "Physical component condition and symptom causality are not established by this check alone.",
    ],
    repair: {
      providerId:
        mute && eligibility.eligible ? "audio-endpoint-mute-v1" : null,
      availability:
        mute && eligibility.eligible
          ? "Proposal available; approval required"
          : "No eligible automated repair",
      reason: mute
        ? eligibility.reason
        : "No validated automated operation is justified by this observation; use the next test.",
    },
    verificationRequirements: [
      c.nextStep,
      "Keep configuration readback, functional measurements, owner report and independent symptom resolution separate.",
    ],
  };
}

export function diagnosticView(checks: DiagnosticCheck[]) {
  const actionable = checks.filter(
    (c) => c.outcome === "Issue detected" || c.outcome === "Warning",
  );
  const passed = checks.filter((c) => c.outcome === "Passed");
  const coverage = checks.filter(
    (c) => !actionable.includes(c) && c.outcome !== "Passed",
  );
  const groups = new Map<
    string,
    { key: string; test: string; outcome: string; checks: DiagnosticCheck[] }
  >();
  for (const c of coverage) {
    const key = JSON.stringify([c.test, c.outcome, c.measurements.state ?? ""]);
    const g = groups.get(key) ?? {
      key,
      test: c.test,
      outcome: c.outcome,
      checks: [],
    };
    g.checks.push(c);
    groups.set(key, g);
  }
  return {
    actionable,
    passed,
    coverage,
    groups: [...groups.values()],
    interrupted: checks.some((c) => c.outcome === "Cancelled or interrupted"),
  };
}
