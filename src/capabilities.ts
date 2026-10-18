import type { Candidate } from "./inventoryModel";
import type { AudioEndpoint, AudioInventory } from "./audio";
export type CapabilityState =
  "available" | "unavailable" | "unsupported" | "not validated";
export interface Capability {
  id: string;
  label: string;
  state: CapabilityState;
  reason: string;
  endpointId?: string;
}
const same = (a: string | null | undefined, b: string | null | undefined) =>
  !!a && !!b && a.toUpperCase() === b.toUpperCase();
export function associatedAudio(
  candidate: Candidate,
  audio: AudioInventory | null,
): AudioEndpoint[] {
  // Exact logical node identity only. Container/name matches never authorize selection.
  return (audio?.endpoints ?? []).filter((e) =>
    candidate.nodes.some(
      (n) =>
        same(n.id, e.instanceId) ||
        (n.category?.toLowerCase() === "audioendpoint" && same(n.id, e.id)),
    ),
  );
}
export function deviceCapabilities(
  c: Candidate,
  audio: AudioInventory | null,
): Capability[] {
  const result: Capability[] = [];
  for (const kind of ["mouse", "keyboard"] as const)
    if (c.endpoints.some((e) => e.kind === kind && e.instanceId))
      result.push({
        id: kind,
        label: `Test ${kind}`,
        state: "available",
        reason:
          "Select an exact native logical source; physical attribution still requires your interaction.",
      });
  const endpoints = associatedAudio(c, audio);
  for (const e of endpoints)
    result.push({
      id: `audio:${e.id}`,
      label:
        e.kind === "playback" ? "Test speakers/headphones" : "Test microphone",
      state:
        e.state === "active" && e.format?.supported
          ? "available"
          : "unavailable",
      reason: `Windows ${e.state}; ${e.format?.supported ? "supported shared format" : "supported format unavailable"}.`,
      endpointId: e.id,
    });
  if (
    !endpoints.length &&
    (c.category === "Audio devices and headsets" ||
      c.category === "Bluetooth peripherals" ||
      c.nodes.some((n) => /^(MEDIA|AudioEndpoint)$/i.test(n.category ?? "")))
  )
    result.push({
      id: "audio-choice",
      label: "Choose audio endpoint",
      state: "not validated",
      reason:
        "No exact node-to-endpoint mapping. Choose the intended Windows playback or recording path; names do not prove identity.",
    });
  if (c.endpoints.length)
    result.push({
      id: "hid",
      label: "Inspect HID capabilities",
      state: c.endpoints.some((e) => e.hid?.status === "observed")
        ? "available"
        : "unavailable",
      reason:
        "Read-only Windows collection facts are shown under Stats for nerds when exposed.",
    });
  if (c.category === "Game controllers")
    result.push({
      id: "controller",
      label: "Controller interaction",
      state: "unsupported",
      reason: "No controller input provider is implemented.",
    });
  result.push({
    id: "led",
    label: "Individual LED test",
    state: "unsupported",
    reason:
      "No verified model-specific lighting profile or independent illumination sensor. No reports are sent.",
  });
  return result;
}
