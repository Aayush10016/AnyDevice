import type { DiagnosticCheck } from "./diagnosticEngine";
export interface Readiness {
  operation: "audio-readiness";
  targetId: string;
  kind: "playback" | "recording";
  observedAt: string;
  complete: boolean;
  started: false;
  frames: 0;
  facts: { initialized: true; serviceReady: true; bufferFrames: number } | null;
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
    outcome: r.complete ? "Passed" : "Inconclusive",
    confidence: "Windows-reported",
    measurements: {
      initialized: r.complete,
      started: false,
      frames: 0,
      observedAt: r.observedAt,
      stage: r.errors[0]?.stage ?? "Initialized and service opened",
      originalError: r.errors[0]?.message ?? "",
      bufferFrames: r.facts?.bufferFrames ?? null,
    },
    conclusion: r.complete
      ? "Windows initialized the exact endpoint and opened its stream service. No stream was started, no sound/capture was performed, and physical function is not verified."
      : `The selected-path check stopped at ${r.errors[0]?.stage ?? "an unknown stage"}; see the original error in advanced evidence`,
    nextStep: r.complete
      ? "Explicitly approve a bounded playback/capture interval; compare actual frame progress with your observation."
      : "Resolve the reported API stage before testing physical output; refresh the exact endpoint, review Windows permissions or exclusive-use applications as applicable.",
    hypotheses: [],
  };
}
