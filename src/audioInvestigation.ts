import type { AudioEndpoint, AudioSession, EarObservation } from "./audio";
import type { DiagnosticCheck } from "./diagnosticEngine";
import { audioFailureDiagnosis } from "./audioFailure";
export type OrdinaryPlayback = "unknown" | "works" | "silent";
export function investigateAudio(
  e: AudioEndpoint,
  s: AudioSession | null,
  ear: EarObservation,
  ordinary: OrdinaryPlayback = "unknown",
): DiagnosticCheck {
  const current = s?.targetId === e.id ? s : null;
  const completed =
    !!current &&
    current.cleanup &&
    current.status === "completed" &&
    current.frames > 0 &&
    !!current.format?.supported;
  const playback =
    completed && ["left", "right", "tone"].includes(current!.mode);
  const mismatch =
    playback &&
    ear !== "unsure" &&
    (current!.mode === "tone" ? ear === "neither" : ear !== current!.mode);
  const failed = !!current?.cleanup && current.status === "failed";
  const blocked =
    !!current?.cleanup &&
    (current.sessionMute === true || current.sessionLevel === 0);
  const zero = e.volume === 0;
  const isolated = playback && ["left", "right"].includes(current!.mode);
  const opposite =
    isolated && current?.format?.channels === 2
      ? current.aggregate[current.mode === "left" ? 1 : 0]
      : undefined;
  const generatedSilent = !!opposite?.samples && opposite.peak === 0;
  const compared = playback && ear === "neither" ? ordinary : "unknown";
  const failure = audioFailureDiagnosis(current?.reason ?? "");
  const nextStep = failed
    ? failure.nextStep
    : blocked
      ? "Review AnyDevice's session in Windows Volume mixer and repeat explicitly. AnyDevice has not changed mute or volume."
      : e.state !== "active"
        ? "Reconnect or select the intended active endpoint, refresh, then explicitly retry."
        : e.mute === true
          ? "Review an endpoint-unmute proposal only if this is the intended device; verify readback and then the physical result."
          : zero
            ? "Review this exact endpoint's zero volume in Windows Sound settings; choose a comfortable level manually, then repeat."
            : compared === "silent"
              ? "Compare the built-in speakers and the same headphones on another known-good device. Inspect the shared output route/connection before changing one setting at a time."
              : compared === "works"
                ? "Compare AnyDevice's actual-session mute/level evidence with Windows Volume mixer; ordinary playback working narrows investigation toward this app's stream or routing."
                : "Compare ordinary playback through this exact endpoint and record its result; engine-buffer consumption alone cannot establish sound.";
  return {
    id: `selected-audio-investigation:${e.id}`,
    target: e.id,
    test: "Selected audio path investigation",
    outcome:
      failed || blocked || e.mute === true || zero || mismatch
        ? "Issue detected"
        : "Inconclusive",
    confidence:
      failed || blocked || e.mute === true || zero
        ? "Windows-reported"
        : "User-reported",
    measurements: {
      observedAt:
        current?.sessionVolumeObservedAt ?? current?.startedAt ?? null,
      state: e.state,
      muted: e.mute,
      windowsLevel: e.volume,
      sessionMuted: current?.sessionMute ?? null,
      sessionLevel: current?.sessionLevel ?? null,
      channels: e.format?.channels ?? null,
      channelMask: e.format?.channelMask ?? null,
      mode: current?.mode ?? null,
      streamStatus: current?.status ?? null,
      frames: current?.frames ?? 0,
      observedEar: playback ? ear : "unsure",
      ordinaryPlayback: compared,
      oppositeSubmittedChannelSilent: generatedSilent,
      hresult: failed ? failure.code : null,
      originalError: failed ? current!.reason : "",
      independentPhysicalVerification: false,
    },
    conclusion: failed
      ? `The native audio test failed. ${failure.explanation} No physical defect is established.`
      : blocked
        ? "Windows reports this actual test session muted or at zero volume. This can suppress expected signal; symptom causality still requires a controlled retest."
        : e.mute === true
          ? "Windows reports the selected endpoint muted; this is a configuration issue, not proof of a damaged device."
          : zero
            ? "Windows reports zero endpoint volume, which may suppress expected audio. No setting has been changed."
            : e.state !== "active"
              ? `The selected endpoint is ${e.state}; a remembered endpoint is not current connectivity evidence.`
              : mismatch
                ? compared === "silent"
                  ? "You report no sound from this test or ordinary playback through the same endpoint. The shared Windows/connection/device path requires investigation; its root cause is unresolved."
                  : compared === "works"
                    ? "Ordinary playback works through this endpoint, but this test was silent. Investigate application-specific session volume, routing and stream behavior; no physical fault is established."
                    : ear === "neither"
                      ? "No sound was reported despite completed stream submission. The audible test did not pass; its cause remains unresolved."
                      : "The reported ear differs from the isolated-channel test. The cause is unresolved."
                : "Available observations do not establish a physical fault or symptom resolution.",
    nextStep,
    hypotheses: [
      {
        cause: "Application session, routing or generated signal",
        confidence:
          compared === "works" || blocked
            ? "Possible"
            : "Insufficient evidence",
        distinguishingTest:
          "Inspect this test's actual session mute/level and generated per-channel peaks; compare ordinary playback through the same endpoint.",
        supportingEvidence: blocked
          ? ["Windows reports this test session muted or at zero volume."]
          : compared === "works"
            ? [
                "Owner reports ordinary playback works while this test is silent.",
              ]
            : [],
        contradictingEvidence:
          compared === "silent"
            ? [
                "Owner reports ordinary playback is also silent; that does not isolate an app-specific failure.",
              ]
            : generatedSilent
              ? [
                  "The opposite submitted channel contained only digital zeros; this does not prove audible routing.",
                ]
              : [],
        verificationCriterion:
          "A new explicitly approved test produces the intended sound and records current session evidence.",
      },
      {
        cause: "Shared Windows, connection or device playback path",
        confidence:
          compared === "silent" ? "Possible" : "Insufficient evidence",
        distinguishingTest:
          "Compare the built-in speakers, the same headphones on another device, and one externally controlled condition at a time.",
        supportingEvidence:
          compared === "silent"
            ? [
                "Owner reports both this test and ordinary playback silent on this endpoint.",
              ]
            : [],
        contradictingEvidence:
          compared === "works"
            ? ["Owner reports ordinary playback works on the same endpoint."]
            : [],
        verificationCriterion:
          "A controlled comparison separates the affected path, followed by an audible retest; no driver or hardware cause is inferred automatically.",
      },
    ],
  };
}
