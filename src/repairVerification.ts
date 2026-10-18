import type { AudioSession } from "./audio";
export interface FunctionalVerification {
  repairId: number;
  beforeSessionId: number | null;
  afterSessionId: number | null;
  comparable: boolean;
  reason: string;
  changesDb: number[];
  userOutcome: "unverified" | "improved" | "unchanged" | "worse";
}
export function compareRepair(
  before: AudioSession | null,
  after: AudioSession | null,
): Pick<FunctionalVerification, "comparable" | "reason" | "changesDb"> {
  if (
    !before ||
    !after ||
    before.sessionId === after.sessionId ||
    before.targetId !== after.targetId ||
    before.mode !== after.mode ||
    !before.cleanup ||
    !after.cleanup ||
    before.status !== "completed" ||
    after.status !== "completed" ||
    before.discontinuities > 0 ||
    after.discontinuities > 0 ||
    before.timestampErrors > 0 ||
    after.timestampErrors > 0 ||
    !before.frames ||
    !after.frames ||
    !before.format ||
    !after.format ||
    [
      "sampleRate",
      "channels",
      "bits",
      "float",
      "blockAlign",
      "channelMask",
    ].some(
      (k) =>
        before.format![k as keyof typeof before.format] !==
        after.format![k as keyof typeof after.format],
    )
  )
    return {
      comparable: false,
      reason:
        "Repeat a completed test with the same endpoint, mode and format; no comparable before/after pair yet.",
      changesDb: [],
    };
  const recording = ["ambient", "speech"].includes(before.mode);
  if (
    recording &&
    (!before.aggregate.length ||
      before.aggregate.length !== after.aggregate.length ||
      before.aggregate.some(
        (l, i) =>
          !l.samples ||
          !after.aggregate[i].samples ||
          l.invalidSamples ||
          after.aggregate[i].invalidSamples,
      ))
  )
    return {
      comparable: false,
      reason: "Valid per-channel measurements are missing.",
      changesDb: [],
    };
  return {
    comparable: true,
    reason: recording
      ? "Same-path digital levels can be compared. Improvement of static/physical quality still requires controlled observations."
      : "Both same-path stream tests completed. Ask whether the original audible symptom improved; API completion is not audibility.",
    changesDb: recording
      ? before.aggregate.map((l, i) => after.aggregate[i].rmsDbfs - l.rmsDbfs)
      : [],
  };
}
