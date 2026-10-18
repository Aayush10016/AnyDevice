export interface AudioFormat {
  sampleRate: number;
  channels: number;
  bits: number;
  float: boolean;
  blockAlign: number;
  channelMask: number;
  supported: boolean;
}
export interface AudioEndpoint {
  id: string;
  name: string;
  instanceId: string | null;
  containerId: string | null;
  kind: "playback" | "recording";
  state: "active" | "disabled" | "unplugged" | "notPresent";
  defaultRoles: string[];
  mute: boolean | null;
  volume: number | null;
  format: AudioFormat | null;
}
export interface AudioInventory {
  endpoints: AudioEndpoint[];
  errors: string[];
  complete: boolean;
  source: string;
  observedAt: string;
}
export interface Levels {
  samples: number;
  rms: number;
  rmsDbfs: number;
  peak: number;
  clippingProportion: number;
  zeroProportion: number;
  invalidSamples: number;
}
export interface AudioSession {
  sessionId: number;
  targetId: string;
  mode: "left" | "right" | "tone" | "ambient" | "speech";
  status: string;
  reason: string;
  startedAt: string;
  format: AudioFormat | null;
  frames: number;
  aggregate: Levels[];
  window: Levels[];
  discontinuities: number;
  timestampErrors: number;
  cleanup: boolean;
}
export function normalizeAudio(value: unknown): AudioInventory {
  const r = value as AudioInventory;
  if (
    !r ||
    !Array.isArray(r.endpoints) ||
    r.endpoints.length > 256 ||
    !Array.isArray(r.errors) ||
    typeof r.complete !== "boolean" ||
    !Number.isFinite(Date.parse(r.observedAt)) ||
    r.endpoints.some(
      (e) =>
        !e ||
        typeof e.id !== "string" ||
        e.id.length > 2048 ||
        typeof e.name !== "string" ||
        !["playback", "recording"].includes(e.kind) ||
        !["active", "disabled", "unplugged", "notPresent"].includes(e.state) ||
        !Array.isArray(e.defaultRoles),
    )
  )
    throw new Error("Invalid Core Audio inventory");
  return r;
}
export type EarObservation = "left" | "right" | "both" | "neither" | "unsure";
export interface RoutingReport {
  sessionId: number;
  targetId: string;
  mode: string;
  observation: EarObservation;
}
export function routingAssessment(
  s: AudioSession,
  observation: EarObservation,
) {
  if (
    observation === "unsure" ||
    !s.cleanup ||
    s.status !== "completed" ||
    !s.frames ||
    !s.format?.supported
  )
    return {
      outcome: "Inconclusive",
      text: "Complete the interval and report which ear produced sound. Physical separation is not independently measured.",
    };
  const match =
    s.mode === "tone" ? observation !== "neither" : observation === s.mode;
  return {
    outcome: match ? "Passed" : "Issue detected",
    text: match
      ? "You reported the expected physical channel. This is user-observed, not independent verification."
      : "Your observation differs from the intended routing. Verify the endpoint and channel layout, compare another supported playback path, and inspect Windows mono audio/device processing manually. No physical headphone defect is established.",
  };
}
export function audioConclusion(
  s: AudioSession | null,
  heard: "yes" | "no" | "unknown" = "unknown",
) {
  if (!s)
    return {
      outcome: "Not tested",
      text: "Start an explicitly selected endpoint test.",
    };
  if (!s.cleanup)
    return {
      outcome: "Inconclusive",
      text: "The test is active; stop or wait for the bounded test to finish.",
    };
  if (s.status === "unsupported")
    return {
      outcome: "Not supported",
      text: "This endpoint/format cannot run the selected test. See the configuration under Stats for nerds.",
    };
  if (s.status === "interrupted")
    return {
      outcome: "Cancelled or interrupted",
      text: "Focus, navigation or Stop interrupted this interval. Repeat under the same conditions.",
    };
  if (s.status !== "completed" || !s.frames)
    return {
      outcome: "Inconclusive",
      text: "The audio stream did not complete with frames. Check endpoint availability, Windows permissions and the advanced error.",
    };
  if (["left", "right", "tone"].includes(s.mode))
    return {
      outcome:
        heard === "yes"
          ? "Passed"
          : heard === "no"
            ? "Issue detected"
            : "Inconclusive",
      text: `Windows accepted ${s.frames} frames for the selected endpoint. ${heard === "yes" ? "You reported audible sound in the expected channel." : heard === "no" ? "You reported no expected sound: this is an observation mismatch, not proof of a damaged speaker. Check routing, mute, volume and cabling." : "Audibility/channel correctness has not been confirmed by you."}`,
    };
  if (
    s.aggregate.some((c) => c.invalidSamples > 0) ||
    s.discontinuities ||
    s.timestampErrors
  )
    return {
      outcome: "Inconclusive",
      text: "Windows reported stream discontinuities/timing or invalid sample data. Investigate the measurement path before blaming the microphone.",
    };
  if (
    s.mode === "speech" &&
    s.aggregate.length &&
    s.aggregate.every((c) => c.samples > 0 && c.zeroProportion === 1)
  )
    return {
      outcome: "Issue detected",
      text: "Only digital zeros were observed during your requested speech interval. Check endpoint, mute, permissions and distance; a faulty microphone is not established.",
    };
  if (s.aggregate.some((c) => c.clippingProportion > 0))
    return {
      outcome: "Issue detected",
      text: "Near-full-scale samples were observed. Signal level, gain, processing or hardware may be responsible; a defective microphone is not established.",
    };
  return {
    outcome: "Passed",
    text: "A bounded level measurement completed. This passes stream/measurement coverage, not microphone quality, absence of static or physical health.",
  };
}
export function compareQuietSpeech(
  quiet: AudioSession | undefined,
  speech: AudioSession | undefined,
) {
  if (!quiet || !speech)
    return "Not tested: complete separate quiet and speech intervals.";
  if (
    quiet.targetId !== speech.targetId ||
    quiet.mode !== "ambient" ||
    speech.mode !== "speech" ||
    !quiet.cleanup ||
    !speech.cleanup ||
    quiet.status !== "completed" ||
    speech.status !== "completed" ||
    !quiet.format ||
    !speech.format ||
    quiet.format.sampleRate !== speech.format.sampleRate ||
    quiet.format.channels !== speech.format.channels ||
    quiet.format.bits !== speech.format.bits ||
    quiet.format.float !== speech.format.float ||
    quiet.format.blockAlign !== speech.format.blockAlign ||
    quiet.format.channelMask !== speech.format.channelMask ||
    !quiet.aggregate[0]?.samples ||
    !speech.aggregate[0]?.samples
  )
    return "Inconclusive: intervals must use the same endpoint/format and complete with samples.";
  const changes = quiet.aggregate.map(
    (q, i) =>
      `${i + 1}: ${(speech.aggregate[i].rmsDbfs - q.rmsDbfs).toFixed(1)} dB`,
  );
  return `Speech minus requested-quiet RMS by channel (${changes.join("; ")}). Quiet is your requested condition, not proof of environmental silence. Windows gain/processing can affect both; no universal noise threshold or faulty component is inferred.`;
}
