import type { Device } from "./models";
export type Confidence = "Confirmed" | "Probable" | "Possible" | "Unresolved";
export interface Relationship {
  device: Device;
  confidence: Confidence;
  evidence: string;
}
const same = (a: string | null | undefined, b: string | null | undefined) =>
  !!a && !!b && a.toUpperCase() === b.toUpperCase();
export function relationships(
  selected: Device,
  devices: Device[],
): Relationship[] {
  const map = new Map(devices.map((d) => [d.id.toUpperCase(), d]));
  function ancestor(child: Device, parent: Device) {
    const visited = new Set<string>();
    let current = child.parent;
    for (let depth = 0; current && depth < 16; depth++) {
      if (same(current, parent.id)) return true;
      if (visited.has(current.toUpperCase())) break;
      visited.add(current.toUpperCase());
      current = map.get(current.toUpperCase())?.parent ?? null;
    }
    return false;
  }
  return devices.flatMap<Relationship>((d) => {
    if (same(d.id, selected.id))
      return [
        {
          device: d,
          confidence: "Confirmed" as const,
          evidence: "Exact selected Windows instance ID; logical identity only",
        },
      ];
    if (ancestor(d, selected) || ancestor(selected, d))
      return [
        {
          device: d,
          confidence: "Confirmed" as const,
          evidence:
            "Observed Windows parent chain; this does not prove one physical object",
        },
      ];
    if (
      selected.containerId &&
      ![
        "00000000-0000-0000-ffff-ffffffffffff",
        "00000000-0000-0000-0000-000000000000",
      ].includes(selected.containerId.toLowerCase()) &&
      same(d.containerId, selected.containerId)
    )
      return [
        {
          device: d,
          confidence: "Probable" as const,
          evidence:
            "Same Windows container ID; OS grouping may include a receiver and several peripherals",
        },
      ];
    return [];
  });
}
export interface Endpoint {
  instanceId: string | null;
  path: string | null;
  kind: "mouse" | "keyboard";
  ancestors: string[];
  capabilities: Record<string, number | boolean> | null;
  hid?: {
    profileVersion: string;
    status: "observed" | "unavailable";
    usagePage?: number;
    usage?: number;
    reports?: {
      type: string;
      maximumByteLengthIncludingId: number;
      controls: Record<string, number | string>[];
      errors: string[];
    }[];
    reason?: string;
  };
  source: string;
  observedAt: string;
}
export interface InputEvent {
  kind: "mouseMove" | "mouseButton" | "mouseWheel" | "key";
  at: string;
  x?: number;
  y?: number;
  absolute?: boolean;
  button?: number;
  down?: boolean;
  axis?: string;
  delta?: number;
  vk?: number;
  scan?: number;
  flags?: number;
}
export interface KeyCount {
  down: number;
  up: number;
  repeat: number;
  held: boolean;
}
export interface InputSnapshot {
  sessionId: number;
  targetId: string;
  mode: "mouse" | "keyboard" | "x-key";
  status: string;
  reason: string;
  startedAt: string;
  stats: {
    events: number;
    movements: number;
    x: number;
    y: number;
    absolute: boolean;
    buttons: Record<string, KeyCount>;
    keys: Record<string, KeyCount>;
    wheelUp: number;
    wheelDown: number;
    horizontal: number;
  };
  recent: InputEvent[];
  historyTruncated: boolean;
  cleanup: boolean;
}
export function endpointRelationship(
  endpoint: Endpoint,
  selected: Device,
  related: Relationship[],
): { confidence: Confidence; evidence: string } | null {
  if (!endpoint.instanceId) return null;
  if (same(endpoint.instanceId, selected.id))
    return {
      confidence: "Confirmed",
      evidence: "Raw Input interface mapped to the exact selected instance ID",
    };
  if (endpoint.ancestors.some((id) => same(id, selected.id)))
    return {
      confidence: "Confirmed",
      evidence:
        "Raw Input collection's native Windows parent chain contains this node; not physical-radio attribution",
    };
  // Related ancestors/container siblings remain evidence, never permission to collect.
  void related;
  return null;
}
export function xAssessment(
  attempts: number | null,
  snapshot: InputSnapshot | null,
): string {
  if (!snapshot || snapshot.mode !== "x-key")
    return "Not tested: start an X-key session on an attributed keyboard endpoint.";
  const observed = snapshot.stats.keys["88"]?.down ?? 0;
  if (!snapshot.cleanup)
    return "Testing: wait for session cleanup before comparing reported attempts.";
  if (attempts === null)
    return `Measured ${observed} non-repeat X key-down transitions. Physical attempts have not been reported.`;
  if (!Number.isInteger(attempts) || attempts < 0 || attempts > 10000)
    return "Physical attempts must be an integer between 0 and 10000.";
  return `User-reported attempts: ${attempts}. Measured non-repeat X key-down transitions: ${observed}. ${attempts === observed ? "Counts agree in this session; the intermittent fault is not ruled out." : "Counts differ; a missed physical press or defective switch is not established."} Consider endpoint attribution, focus/session boundaries, repeat handling, and user-count accuracy. Retest under the same conditions; no repair has been applied.`;
}
export function symptomPlan(
  symptom: string,
  kind: "mouse" | "keyboard" | undefined,
  snapshot: InputSnapshot | null,
) {
  const items = [
    {
      classification: "User report",
      text: symptom || "No symptom recorded",
      source: "user",
    },
  ];
  if (!snapshot)
    items.push({
      classification: "Unknown",
      text: "No live test evidence yet. Start the available selected-endpoint test; a Windows OK status does not establish functional health.",
      source: "rule",
    });
  else
    items.push({
      classification: "Informational",
      text: `Observed ${snapshot.stats.events} events from selected logical endpoint; status ${snapshot.status}. This does not establish physical component accuracy.`,
      source: "Windows Raw Input",
    });
  if (kind === "keyboard" && /\bx\b|attempt|repeat/i.test(symptom))
    items.push({
      classification: "Potential explanation (unconfirmed)",
      text: "Possible input registration/focus or attribution differences, user counting, contact/switch behavior or firmware processing. Use X-only down/up/repeat counts and repeat the procedure; evidence does not rank a physical defect as confirmed.",
      source: "rule",
    });
  if (/light|led|backlight/i.test(symptom))
    items.push({
      classification: "Unknown",
      text: "No validated lighting control or physical-state feedback provider is available. Record the exact keyboard model from its label/manual before choosing model-specific software. For a dark arrow key, test that named key's input separately, then compare its visible light with neighboring keys in a documented uniform-light setting you choose manually. Input events do not test LEDs. Standard lock-light usages do not establish per-key RGB control. No lighting command will be sent; Windows cannot distinguish LED, circuit or board faults without further evidence.",
      source: "capability registry",
    });
  if (/scroll|wheel/i.test(symptom) && kind === "mouse")
    items.push({
      classification: "Next test",
      text: "Observe signed vertical/horizontal wheel events while performing separately labelled up/down actions. Directional events do not prove mechanical wheel health.",
      source: "rule",
    });
  return items;
}
export function keyName(vk: number): string {
  return (
    (
      {
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        27: "Esc",
        32: "Space",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        160: "L Shift",
        161: "R Shift",
        162: "L Ctrl",
        163: "R Ctrl",
        164: "L Alt",
        165: "R Alt",
      } as Record<number, string>
    )[vk] ??
    (vk >= 48 && vk <= 90
      ? String.fromCharCode(vk)
      : vk >= 112 && vk <= 123
        ? `F${vk - 111}`
        : `VK ${vk}`)
  );
}
export function workbenchExport(
  selected: Device,
  symptom: string,
  conditions: string,
  attempts: number | null,
  history: InputSnapshot[],
  sanitized: boolean,
) {
  const aliases = new Map<string, string>();
  for (const test of history.slice(-8)) {
    const key = test.targetId.toUpperCase();
    if (!aliases.has(key))
      aliases.set(
        key,
        key === selected.id.toUpperCase()
          ? "selected-device"
          : `input-endpoint-${aliases.size + 1}`,
      );
  }
  return {
    schemaVersion: "device-workbench-1.0",
    createdAt: new Date().toISOString(),
    sanitized,
    target: sanitized
      ? { id: "selected-device", name: null }
      : { id: selected.id, name: selected.name },
    userReport: {
      source: "user",
      symptom: sanitized ? null : symptom,
      conditions: sanitized ? null : conditions,
      physicalAttempts: sanitized ? null : attempts,
    },
    tests: history.slice(-8).map((s) => ({
      targetId: sanitized ? aliases.get(s.targetId.toUpperCase())! : s.targetId,
      mode: s.mode,
      startedAt: s.startedAt,
      status: s.status,
      cleanup: s.cleanup,
      stats: s.stats,
      historyTruncated: s.historyTruncated,
    })),
    limitations: [
      "Aggregate key codes/counts are exported; no ordered key-event history or typed text is persisted.",
      "Input attribution confirms a logical Raw Input collection, not the separate physical peripheral behind a wireless receiver.",
      "No repair or lighting command was applied.",
    ],
  };
}
