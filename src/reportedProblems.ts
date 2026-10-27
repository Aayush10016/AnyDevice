import type { DiagnosticCheck } from "./diagnosticEngine";
export const symptoms = {
  "keyboard-light": "A keyboard light stays dark",
  "keyboard-input": "A key misses presses or repeats unexpectedly",
  "mouse-input": "Mouse movement, buttons or scrolling fail",
  "audio-output": "Audio is silent, too quiet or distorted",
  microphone: "Microphone input is silent or distorted",
} as const;
export type Symptom = keyof typeof symptoms;
export function symptomGuidance(symptom: Symptom) {
  switch (symptom) {
    case "keyboard-light":
      return {
        limitation:
          "AnyDevice cannot automatically see whether an individual keyboard LED emits light. No LED-failure telemetry or validated lighting-control provider is implemented for this keyboard.",
        steps: [
          "Record which light is dark and whether neighboring lights work in the current mode. Key input and key illumination are separate tests.",
          "Identify the exact keyboard model/revision. If its official instructions provide a steady lighting mode, compare the affected key with neighbors and repeat. Do not guess shortcuts or reset firmware.",
          "Inspect supported lighting interfaces. A validated model-specific protocol could test configuration; visible illumination still needs your observation unless the device exposes fault telemetry.",
        ],
        fix: "No automatic lighting fix is available. A configuration cause may be correctable through a validated control path; a failed LED/circuit requires hardware service. Neither cause is established yet.",
      };
    case "keyboard-input":
      return {
        limitation:
          "Windows events can establish delivered presses and releases, but cannot know every physical press that never reached the PC.",
        steps: [
          "Select the exact responding keyboard input source.",
          "Run the visible key test and compare intended presses with observed down/up, repeats and missing releases.",
          "Repeat under the same conditions, then compare one safe connection or another application. A shared receiver may prevent attribution to an individual radio device.",
        ],
        fix: "No automatic key/switch repair exists. Investigate delivery, repeat settings and connection evidence before naming a hardware cause.",
      };
    case "mouse-input":
      return {
        limitation:
          "Delivered mouse events can be measured; sensor surface quality and every intended physical click cannot be inferred from enumeration.",
        steps: [
          "Choose the responding mouse/receiver source.",
          "Run the visible movement, button and bidirectional scroll test.",
          "Compare repeatable failures with one safe surface/connection change; preserve interruption and disconnect evidence.",
        ],
        fix: "No automatic mouse hardware repair exists. Use a repeatable event-delivery failure to choose the next connection or vendor-supported investigation.",
      };
    default:
      return {
        limitation:
          "Endpoint presence and accepted frames alone do not establish audible output or microphone quality.",
        steps: [
          "Choose the intended active playback or recording endpoint and inspect readiness, mute, level and native errors.",
          "Explicitly allow the bounded tone or microphone test. Record what you heard or compare quiet/speech measurements.",
          "If an active endpoint is currently muted and the mute is unwanted, review the supported unmute proposal, approve it and repeat the original test.",
        ],
        fix: "A reversible endpoint-unmute fix is available only for a currently active, verified muted endpoint. It requires approval and readback; other causes do not have an automatic repair provider.",
      };
  }
}
export function reportProblem(
  target: string,
  symptom: Symptom,
  detail: string,
  at = new Date().toISOString(),
): DiagnosticCheck {
  const guide = symptomGuidance(symptom);
  return {
    id: `reported:${crypto.randomUUID()}`,
    target,
    test: symptoms[symptom],
    outcome: "Issue detected",
    confidence: "User-reported",
    measurements: {
      observedAt: at,
      reportedAt: at,
      symptomType: symptom,
      reportedDetail: detail.slice(0, 1000),
      ownerResolved: false,
      physicalFaultConfirmed: false,
    },
    conclusion:
      "You reported this symptom. An automatic Windows status scan cannot dismiss it or establish its cause.",
    nextStep: guide.steps.join(" "),
    hypotheses: [
      {
        cause:
          "Configuration, connection, control path or physical fault remain to be distinguished",
        confidence: "Insufficient evidence",
        distinguishingTest: guide.steps.join(" "),
      },
    ],
  };
}
export function setProblemResolved(
  check: DiagnosticCheck,
  resolved: boolean,
): DiagnosticCheck {
  return {
    ...check,
    outcome: resolved ? "Passed" : "Issue detected",
    measurements: {
      ...check.measurements,
      ownerResolved: resolved,
      observedAt: new Date().toISOString(),
    },
    conclusion: resolved
      ? "You report that the original symptom no longer occurs. No automatic repair or independently verified physical recovery is established."
      : "You report that the symptom still occurs. A clean Windows status scan does not resolve this report.",
  };
}
