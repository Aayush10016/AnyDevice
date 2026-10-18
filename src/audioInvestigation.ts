import type { AudioEndpoint, AudioSession, EarObservation } from "./audio";
import type { DiagnosticCheck } from "./diagnosticEngine";
export function investigateAudio(
  e: AudioEndpoint,
  s: AudioSession | null,
  ear: EarObservation,
): DiagnosticCheck {
  const mismatch =
    !!s &&
    s.cleanup &&
    s.status === "completed" &&
    s.frames > 0 &&
    !!s.format?.supported &&
    ["left", "right"].includes(s.mode) &&
    ear !== "unsure" &&
    ear !== s.mode;
  const opposite =
    s && s.format?.channels === 2
      ? s.aggregate[s.mode === "left" ? 1 : 0]
      : undefined;
  const generatedSilent = !!opposite?.samples && opposite.peak === 0;
  return {
    id: "selected-audio-investigation",
    target: e.id,
    test: "Selected audio path investigation",
    outcome: e.mute === true || mismatch ? "Issue detected" : "Inconclusive",
    confidence: mismatch ? "User-reported" : "Windows-reported",
    measurements: {
      state: e.state,
      muted: e.mute,
      windowsLevel: e.volume,
      channels: e.format?.channels ?? null,
      channelMask: e.format?.channelMask ?? null,
      mode: s?.mode ?? null,
      streamStatus: s?.status ?? null,
      frames: s?.frames ?? 0,
      observedEar: ear,
      oppositeSubmittedChannelSilent: generatedSilent,
      independentPhysicalVerification: false,
    },
    conclusion: mismatch
      ? "The reported ear differs from the selected isolated-channel test. The cause is unresolved."
      : e.mute === true
        ? "Windows reports the selected endpoint muted; its contribution to the symptom needs a controlled retest."
        : "Available observations do not establish a physical fault or symptom resolution.",
    nextStep:
      e.mute === true
        ? "Review the exact unmute proposal below only if this is the intended endpoint, then repeat the same test."
        : "Confirm endpoint identity, compare left/right observations, and change one external condition at a time.",
    hypotheses: [
      {
        cause: "Application-generated channel duplication",
        confidence:
          mismatch && !generatedSilent ? "Possible" : "Insufficient evidence",
        distinguishingTest:
          "Inspect submitted per-channel peaks and repeat the isolated-channel test.",
        supportingEvidence: generatedSilent
          ? []
          : ["Runtime opposite-channel silence has not been established."],
        contradictingEvidence: generatedSilent
          ? ["The submitted opposite channel contained only digital zeros."]
          : [],
        verificationCriterion:
          "Opposite-channel samples are zero and the user reports the intended ear only.",
      },
      {
        cause: "Windows mono audio, endpoint/profile or device processing",
        confidence: mismatch ? "Possible" : "Insufficient evidence",
        distinguishingTest:
          "Inspect Windows mono audio manually and compare another already-available stereo playback endpoint. Do not switch a system profile automatically.",
        supportingEvidence: mismatch
          ? ["User reported a channel mismatch."]
          : [],
        contradictingEvidence:
          e.format?.channels === 2
            ? [
                "Windows reports two channels; this does not prove downstream stereo separation.",
              ]
            : [],
        verificationCriterion:
          "Repeat the same channel test after one approved/manual change and compare the observations.",
      },
      {
        cause: "Physical audio component or connection fault",
        confidence: "Insufficient evidence",
        distinguishingTest:
          "Compare a known-good device/application/connection under controlled conditions.",
        supportingEvidence: [],
        contradictingEvidence: [
          "No independent physical output measurement or isolated component test exists.",
        ],
        verificationCriterion:
          "Repeatable independent evidence must separate software routing from the physical path.",
      },
    ],
  };
}
