import { audioFailureDiagnosis } from "./audioFailure";
import type { DiagnosticCheck } from "./diagnosticEngine";
export interface Readiness {
  operation: "audio-readiness";
  targetId: string;
  kind: "playback" | "recording";
  observedAt: string;
  complete: boolean;
  started: false;
  frames: 0;
  facts: {
    initialized: true;
    serviceReady: true;
    bufferFrames: number;
    sessionVolume?: { mute: boolean; level: number } | null;
    sessionVolumeError?: { stage: string; message: string } | null;
  } | null;
  errors: { stage: string; message: string }[];
}
export interface LightingDiscovery {
  operation: "lighting-discovery";
  observedAt: string;
  complete: boolean;
  lampEnumerationComplete: boolean;
  interfaces: {
    id: string;
    name: string;
    enabled: boolean;
    controlValidated: false;
  }[];
  systemEvidence: {
    system?: { Manufacturer?: string; Model?: string; SystemFamily?: string };
    bios?: { SMBIOSBIOSVersion?: string };
    services?: unknown[];
    wmiClasses?: string[];
  } | null;
  nodes: unknown[];
  errors: string[];
  methods: string[];
  physicalIlluminationVerified: false;
  controlOperations: never[];
}
export function validateReadiness(
  r: Readiness,
  id: string,
  kind: string,
): Readiness {
  if (
    !r ||
    r.operation !== "audio-readiness" ||
    r.targetId !== id ||
    r.kind !== kind ||
    r.started !== false ||
    r.frames !== 0 ||
    typeof r.complete !== "boolean" ||
    !Number.isFinite(Date.parse(r.observedAt)) ||
    !Array.isArray(r.errors) ||
    r.errors.length > 32 ||
    r.errors.some(
      (e) =>
        typeof e.message !== "string" ||
        e.message.length > 2048 ||
        typeof e.stage !== "string",
    ) ||
    (r.facts?.sessionVolume != null &&
      (typeof r.facts.sessionVolume.mute !== "boolean" ||
        !Number.isFinite(r.facts.sessionVolume.level) ||
        r.facts.sessionVolume.level < 0 ||
        r.facts.sessionVolume.level > 1)) ||
    (r.complete &&
      (!r.facts?.initialized || !r.facts.serviceReady || r.errors.length))
  )
    throw new Error("Invalid or mismatched audio readiness evidence");
  return r;
}
export function lightingSummary(r: LightingDiscovery) {
  if (r.interfaces.length)
    return "LampArray interface detected; control capability and physical illumination remain unvalidated. No controller was opened or changed.";
  if (!r.lampEnumerationComplete)
    return "Lighting discovery blocked or unavailable. Review the actual method error; absence of a result does not establish absence of backlighting.";
  return "No supported LampArray interface found by completed enumeration. Firmware hotkeys or vendor-specific controls may still provide backlighting; their control path is unvalidated.";
}
export function readinessCheck(r: Readiness): DiagnosticCheck {
  return {
    id: `audio-readiness:${r.targetId}`,
    target: r.targetId,
    test: "Selected endpoint initialization readiness",
    outcome: r.complete
      ? "Passed"
      : r.errors.length
        ? "Issue detected"
        : "Inconclusive",
    confidence: "Windows-reported",
    measurements: {
      initialized: r.complete,
      started: false,
      frames: 0,
      observedAt: r.observedAt,
      stage: r.complete
        ? "Initialized and service opened"
        : (r.errors[0]?.stage ?? "Unknown native stage"),
      hresult: audioFailureDiagnosis(r.errors[0]?.message ?? "").code,
      originalError: r.errors[0]?.message ?? "",
      bufferFrames: r.facts?.bufferFrames ?? null,
      sessionMuted: r.facts?.sessionVolume?.mute ?? null,
      sessionLevel: r.facts?.sessionVolume?.level ?? null,
    },
    conclusion: r.complete
      ? "Windows initialized the exact endpoint and opened its stream service. No stream was started, no sound/capture was performed, and physical function is not verified."
      : `The selected-path check failed. ${audioFailureDiagnosis(r.errors[0]?.message ?? "").explanation} No physical defect is established; see the original stage in advanced evidence.`,
    nextStep: r.complete
      ? "Explicitly approve a bounded playback/capture interval; compare actual frame progress with your observation."
      : audioFailureDiagnosis(r.errors[0]?.message ?? "").nextStep,
    hypotheses: [],
  };
}

export function sessionVolumeSummary(r: Readiness) {
  const volume = r.facts?.sessionVolume;
  if (!volume)
    return "Audio-session mute/volume unavailable; initialization alone cannot rule out application-level silence.";
  if (volume.mute || volume.level === 0)
    return "Windows reports this readiness session muted or at zero volume. Review AnyDevice in Windows Volume mixer before a controlled retest; no setting was changed.";
  return `Readiness session: not muted, ${Math.round(volume.level * 100)}% volume. This is a separate observation from endpoint volume and does not verify a later test session or audible sound.`;
}
