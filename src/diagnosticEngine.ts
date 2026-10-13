import type { Scan } from "./models";
import type { Candidate } from "./inventoryModel";
import type { AudioInventory, AudioSession } from "./audio";
export type Outcome =
  | "Passed"
  | "Issue detected"
  | "Inconclusive"
  | "Not supported"
  | "Not tested"
  | "Cancelled or interrupted";
export interface DiagnosticCheck {
  id: string;
  target: string;
  test: string;
  outcome: Outcome;
  confidence: "Windows-reported" | "Measured" | "User-reported" | "Limited";
  measurements: Record<string, string | number | boolean | null>;
  conclusion: string;
  nextStep: string;
  hypotheses: {
    cause: string;
    confidence:
      "Confirmed configuration" | "Possible" | "Insufficient evidence";
    distinguishingTest: string;
  }[];
}
export function systemChecks(
  scan: Scan,
  candidates: Candidate[],
  audio: AudioInventory | null,
): DiagnosticCheck[] {
  const checks: DiagnosticCheck[] = [
    {
      id: "enumeration",
      target: "system",
      test: "Present Windows inventory",
      outcome: scan.complete ? "Passed" : "Inconclusive",
      confidence: "Windows-reported",
      measurements: {
        nodes: scan.devices.length,
        errors: scan.errors.length,
        scope: scan.scope,
        provider: scan.provider,
      },
      conclusion: scan.complete
        ? "Windows discovery completed; node presence is not physical functionality."
        : "Partial discovery; absence/status conclusions are limited.",
      nextStep: scan.complete
        ? "Choose an attributed interactive test."
        : "Refresh and inspect collection errors.",
      hypotheses: [],
    },
  ];
  for (const c of candidates.filter(
    (c) => c.placement !== "Supporting infrastructure",
  )) {
    const problems = c.nodes.filter(
      (n) => (n.problemCode ?? 0) > 0 || n.status === "ERROR",
    );
    checks.push({
      id: `status:${c.id}`,
      target: c.id,
      test: "Windows device status",
      outcome: problems.length
        ? "Issue detected"
        : c.nodes.every((n) => n.problemCode === 0 && n.status === "OK")
          ? "Passed"
          : "Inconclusive",
      confidence: "Windows-reported",
      measurements: {
        nodes: c.nodes.length,
        problemNodes: problems.length,
        inputCollections: c.endpoints.length,
      },
      conclusion: problems.length
        ? "Windows reported a device-node problem. This does not localise a physical defect."
        : "Observed Windows status; input/audio/LED function is not tested by it.",
      nextStep: problems.length
        ? "Read the problem code and compare a controlled reconnect or vendor-supported check."
        : "Run the relevant explicit functional test.",
      hypotheses: problems.length
        ? [
            {
              cause: "Driver, connection or device path issue",
              confidence: "Possible",
              distinguishingTest:
                "Compare the same device/port in a controlled repeat; do not replace drivers automatically.",
            },
          ]
        : [],
    });
    if (c.endpoints.length)
      checks.push({
        id: `input:${c.id}`,
        target: c.id,
        test: "Physical input interaction",
        outcome: "Not tested",
        confidence: "Limited",
        measurements: { associatedCollections: c.endpoints.length },
        conclusion:
          "Automatic scanning never presses keys or moves/clicks a mouse.",
        nextStep:
          "Open the input workspace, choose the exact responding logical source and perform a controlled test.",
        hypotheses: [],
      });
    for (const [index, endpoint] of c.endpoints.entries()) {
      const hid = endpoint.hid;
      checks.push({
        id: `hid:${c.id}:${index}`,
        target: c.id,
        test: "Read-only HID collection capabilities",
        outcome: hid?.status === "observed" ? "Passed" : "Not supported",
        confidence: "Windows-reported",
        measurements: {
          collection: index + 1,
          usagePage: hid?.usagePage ?? null,
          usage: hid?.usage ?? null,
          inputMaximumBytes:
            hid?.reports?.find((r) => r.type === "input")
              ?.maximumByteLengthIncludingId ?? null,
          outputMaximumBytes:
            hid?.reports?.find((r) => r.type === "output")
              ?.maximumByteLengthIncludingId ?? null,
          featureMaximumBytes:
            hid?.reports?.find((r) => r.type === "feature")
              ?.maximumByteLengthIncludingId ?? null,
        },
        conclusion:
          hid?.status === "observed"
            ? "Windows parsed collection usages and maximum report lengths; protocol semantics and physical function remain unverified."
            : "This source does not expose supported/bounded HID preparsed capabilities.",
        nextStep:
          "Review per-report IDs and numerical controls under Stats for nerds. Do not send output or feature reports without a validated model-specific protocol.",
        hypotheses: [],
      });
    }
  }
  if (!audio)
    checks.push({
      id: "audio-unavailable",
      target: "system",
      test: "Core Audio discovery",
      outcome: "Not supported",
      confidence: "Limited",
      measurements: {},
      conclusion:
        "Core Audio inventory is unavailable; this is not a speaker/microphone fault.",
      nextStep: "Inspect Windows audio service/policy and retry.",
      hypotheses: [],
    });
  else {
    checks.push({
      id: "audio-enumeration",
      target: "system",
      test: "Core Audio discovery",
      outcome: !audio.complete
        ? "Inconclusive"
        : audio.endpoints.length
          ? "Passed"
          : "Not supported",
      confidence: "Windows-reported",
      measurements: {
        endpoints: audio.endpoints.length,
        errors: audio.errors.length,
      },
      conclusion: audio.complete
        ? "Windows audio endpoint enumeration completed; no sound/capture was tested."
        : "Audio enumeration was partial or unavailable.",
      nextStep:
        "Choose an active endpoint for an explicit test; review errors if discovery is incomplete.",
      hypotheses: [],
    });
    for (const e of audio.endpoints) {
      checks.push({
        id: `audio:${e.id}`,
        target: e.id,
        test: "Audio endpoint state/configuration",
        outcome:
          e.state !== "active"
            ? "Inconclusive"
            : e.mute === true
              ? "Issue detected"
              : "Passed",
        confidence: "Windows-reported",
        measurements: {
          state: e.state,
          mute: e.mute,
          volume: e.volume,
          channels: e.format?.channels ?? null,
          sampleRate: e.format?.sampleRate ?? null,
        },
        conclusion:
          e.mute === true
            ? "Windows reports this endpoint muted. That is a configuration observation, not a physical fault."
            : `Windows reports ${e.state}; ${e.kind} audibility/capture quality has not been tested.`,
        nextStep:
          e.state !== "active"
            ? "Connect/enable the intended endpoint manually and refresh."
            : e.mute === true
              ? "Review an unmute proposal; approve only if this is the intended endpoint."
              : "Open Audio tests and explicitly start the appropriate test.",
        hypotheses:
          e.mute === true
            ? [
                {
                  cause: "Endpoint mute may prevent expected input/output",
                  confidence: "Confirmed configuration",
                  distinguishingTest:
                    "Approve a reversible unmute only if intended, verify setting readback and repeat the functional test.",
                },
              ]
            : [],
      });
      checks.push({
        id: `audio-function:${e.id}`,
        target: e.id,
        test:
          e.kind === "recording"
            ? "Microphone quiet/speech quality"
            : "Speaker audibility/channel routing",
        outcome: "Not tested",
        confidence: "Limited",
        measurements: {},
        conclusion:
          "Automatic diagnostics did not play sound or capture a microphone.",
        nextStep: "Explicitly start the bounded selected-endpoint test.",
        hypotheses: [],
      });
    }
  }
  checks.push({
    id: "protocol",
    target: "system",
    test: "Vendor protocols / physical LED state",
    outcome: "Not supported",
    confidence: "Limited",
    measurements: {},
    conclusion:
      "No validated vendor protocol/LED state provider is available. No commands are sent.",
    nextStep:
      "Use read-only interface evidence; a documented model-specific provider and physical verification are required.",
    hypotheses: [],
  });
  return checks;
}
export function staticHypotheses(
  s: AudioSession | null,
  staticReported: boolean | null,
) {
  if (!s)
    return [
      {
        cause: "No selected-path measurement yet",
        confidence: "Insufficient evidence",
        test: "Capture a requested-quiet interval, then speech on the same endpoint.",
      },
    ];
  const clipped = s.aggregate.some((c) => c.clippingProportion > 0);
  return [
    {
      cause: clipped
        ? "High signal level/gain/processing"
        : "Environmental noise, gain or Windows processing",
      confidence: "Possible",
      test: clipped
        ? "Compare quiet/speech levels and inspect input gain manually before any approved change."
        : "Repeat quiet/speech under identical conditions; compare another supported endpoint/application separately.",
    },
    {
      cause: "Cable/receiver/analog or microphone hardware path",
      confidence:
        staticReported === true ? "Possible" : "Insufficient evidence",
      test: "Use a controlled alternate port/cable/device comparison. Levels alone cannot locate the defective component.",
    },
  ];
}
export function diagnosticExport(
  scan: Scan | null,
  checks: DiagnosticCheck[],
  audio: AudioInventory | null,
  sessions: AudioSession[],
  sanitized: boolean,
  repairs: import("./bridge").RepairAudit[] = [],
  userAudioReport: {
    sessionId: number | null;
    heardExpected: string;
    staticReported: boolean | null;
  } | null = null,
) {
  const aliases = new Map<string, string>();
  const alias = (id: string) => {
    if (!aliases.has(id)) aliases.set(id, `target-${aliases.size + 1}`);
    return aliases.get(id)!;
  };
  return {
    schemaVersion: "diagnostic-engine-1.0",
    appVersion: "0.2.0",
    createdAt: new Date().toISOString(),
    sanitized,
    coverage:
      "Read-only automatic checks; interaction/capture/playback only when explicitly started",
    scanComplete: scan?.complete ?? false,
    discoveryProvenance: scan
      ? {
          provider: scan.provider,
          scope: scan.scope,
          collectedAt: scan.collectedAt,
        }
      : null,
    userAudioReport,
    checks: checks.slice(0, 8192).map((c, i) => ({
      ...c,
      id: sanitized ? `check-${i + 1}` : c.id,
      target: sanitized ? alias(c.target) : c.target,
    })),
    audioEndpoints: (audio?.endpoints ?? []).map((e) => ({
      ...e,
      id: sanitized ? alias(e.id) : e.id,
      name: sanitized ? null : e.name,
      instanceId: sanitized ? null : e.instanceId,
      containerId: sanitized ? null : e.containerId,
    })),
    audioSessions: sessions.slice(-8).map((s) => ({
      ...s,
      targetId: sanitized ? alias(s.targetId) : s.targetId,
      reason: sanitized ? "Technical free-text withheld" : s.reason,
    })),
    repairs: repairs.slice(-8).map((a) => ({
      ...a,
      targetId: sanitized ? alias(a.targetId) : a.targetId,
      status: sanitized
        ? a.verified
          ? "Setting readback verified; physical function unverified"
          : "Setting outcome unverified"
        : a.status,
    })),
    limitations: [
      "No microphone PCM/audio samples or typed keyboard text are exported.",
      "Endpoint/USB/container associations are not confirmed physical identity.",
      "No universal static threshold or physical-fault diagnosis is inferred.",
      "Repair setting readback is distinct from physical function; no repair is performed by automatic scan.",
    ],
  };
}
