import type { Device } from "./models";
import type { Endpoint } from "./workbench";
export type Placement =
  | "Confirmed external peripheral"
  | "Probable external peripheral"
  | "Confirmed internal device"
  | "Supporting infrastructure"
  | "Unknown or ambiguous";
export type DeviceCategory =
  | "Mice and pointing devices"
  | "Keyboards"
  | "Audio devices and headsets"
  | "Cameras"
  | "Game controllers"
  | "Bluetooth peripherals"
  | "Other external devices"
  | "Internal hardware"
  | "Supporting infrastructure"
  | "Unknown devices";
export interface Candidate {
  id: string;
  device: Device;
  nodes: Device[];
  category: DeviceCategory;
  kind?: "mouse" | "keyboard";
  name: string;
  placement: Placement;
  evidence: string[];
  endpoints: Endpoint[];
}
const upper = (s: string) => s.toUpperCase();
export function infrastructure(d: Device): boolean {
  return (
    (d.category === "Bluetooth" && !/^BTHENUM\\DEV_/i.test(d.id)) ||
    (d.category === "USBDevice" && /&MI_[0-9A-F]{2}/i.test(d.id)) ||
    /^(ROOT|SWD|HTREE|SW)\\/i.test(d.id) ||
    /^(USB|USBHub|System|SoftwareComponent|SoftwareDevice)$/i.test(
      d.category ?? "",
    ) ||
    d.compatibleIds?.some((id) => /USB\\(Class_09|COMPOSITE)/i.test(id)) ===
      true
  );
}
export function topology(d: Device, devices: Device[]): Device[] {
  const map = new Map(devices.map((n) => [upper(n.id), n]));
  const result: Device[] = [],
    seen = new Set<string>();
  let current: Device | undefined = d;
  while (current && result.length < 16 && !seen.has(upper(current.id))) {
    result.push(current);
    seen.add(upper(current.id));
    current = current.parent ? map.get(upper(current.parent)) : undefined;
  }
  return result;
}
// Group only descendants of the nearest concrete USB instance. Never cross a hub,
// merge by container alone, or call the receiver association a physical identity.
function boundary(d: Device, devices: Device[]): Device {
  let result = d;
  for (const n of topology(d, devices)) {
    if (
      /^USBHub$/i.test(n.category ?? "") ||
      n.compatibleIds?.some((id) => /USB\\Class_09/i.test(id))
    )
      break;
    if (/^USB\\VID_[0-9A-F]{4}&PID_[0-9A-F]{4}/i.test(n.id)) {
      if (n.compatibleIds?.some((id) => /USB\\Class_09/i.test(id))) break;
      result = n;
      if (!/&MI_[0-9A-F]{2}/i.test(n.id)) break;
    } else if (n !== d && infrastructure(n)) break;
  }
  return result;
}
export function classify(
  d: Device,
  devices: Device[],
): { placement: Placement; evidence: string[] } {
  if (infrastructure(d))
    return {
      placement: "Supporting infrastructure",
      evidence: [
        "Windows class/enumerator or compatible ID identifies infrastructure; retained in advanced inventory.",
      ],
    };
  const chain = topology(d, devices);
  if (/^BTHENUM\\DEV_/i.test(d.id))
    return {
      placement: "Unknown or ambiguous",
      evidence: [
        "Windows remote Bluetooth entry. Pairing/node presence does not establish a current radio connection; USB ancestry belongs to the host adapter.",
      ],
    };
  if (chain.some((n) => /^USB\\VID_/i.test(n.id)))
    return {
      placement: "Probable external peripheral",
      evidence: [
        "Concrete USB device in the observed parent chain. USB can also be built into a laptop; external placement is not proven.",
        ...chain
          .filter(
            (n) =>
              n.deviceCapabilities !== undefined ||
              n.removalPolicy !== undefined,
          )
          .map(
            (n) =>
              `Windows removability metadata: capabilities ${n.deviceCapabilities ?? "unavailable"}, removal policy ${n.removalPolicy ?? "unavailable"}. Removability does not prove enclosure placement.`,
          ),
      ],
    };
  if (
    /^(PCI|ACPI)\\/i.test(d.id) &&
    /^(Processor|Firmware|Computer)$/i.test(d.category ?? "")
  )
    return {
      placement: "Confirmed internal device",
      evidence: [
        "PCI/ACPI processor/firmware/computer class identifies system hardware; model identity is not inferred.",
      ],
    };
  return {
    placement: "Unknown or ambiguous",
    evidence: [
      "Available topology does not establish external placement. Bluetooth enumeration and names alone are insufficient.",
    ],
  };
}
export function buildInventory(
  devices: Device[],
  endpoints: Endpoint[],
): Candidate[] {
  const active = devices.filter((d) => d.present !== false);
  const groups = new Map<string, Candidate>();
  const attached = new Set<string>();
  for (const d of active) {
    const own = endpoints.filter(
      (e) => e.instanceId && upper(e.instanceId) === upper(d.id),
    );
    const kinds: ("mouse" | "keyboard")[] = [
      ...new Set(own.map((e) => e.kind)),
    ];
    if (!kinds.length && /^(Mouse|Keyboard)$/i.test(d.category ?? ""))
      kinds.push(d.category?.toLowerCase() === "mouse" ? "mouse" : "keyboard");
    for (const kind of kinds) {
      const root = boundary(d, active),
        id = `${upper(root.id)}:${kind}`;
      const category =
        kind === "mouse" ? "Mice and pointing devices" : "Keyboards";
      let candidate = groups.get(id);
      if (!candidate) {
        const info = classify(d, active);
        candidate = {
          id,
          device: root,
          nodes: [],
          category,
          kind,
          name: kind === "mouse" ? "USB / HID mouse" : "USB / HID keyboard",
          ...info,
          endpoints: [],
        };
        candidate.evidence.push(
          "Candidate groups same-kind logical collections under one concrete USB instance. A receiver may represent several peripherals; physical identity remains unresolved.",
        );
        groups.set(id, candidate);
      }
      candidate.nodes.push(d);
      candidate.endpoints.push(...own.filter((e) => e.kind === kind));
      attached.add(upper(d.id));
      attached.add(upper(root.id));
    }
  }
  for (const d of active) {
    if (attached.has(upper(d.id)) || d.category === "HIDClass") continue;
    const info = classify(d, active);
    const cls = d.category ?? "";
    const category: DeviceCategory =
      info.placement === "Supporting infrastructure"
        ? "Supporting infrastructure"
        : info.placement === "Confirmed internal device"
          ? "Internal hardware"
          : /^(MEDIA|AudioEndpoint)$/i.test(cls)
            ? "Audio devices and headsets"
            : /^(Camera|Image)$/i.test(cls)
              ? "Cameras"
              : /^Bluetooth$/i.test(cls)
                ? "Bluetooth peripherals"
                : /^(XboxComposite|XnaComposite|GameController)$/i.test(cls)
                  ? "Game controllers"
                  : info.placement === "Probable external peripheral"
                    ? "Other external devices"
                    : "Unknown devices";
    const root =
      info.placement === "Supporting infrastructure" ? d : boundary(d, active);
    const groupId = `${upper(root.id)}:${category}`;
    const existing = groups.get(groupId);
    if (existing) {
      existing.nodes.push(d);
      continue;
    }
    groups.set(groupId, {
      id: groupId,
      device: root,
      nodes: [d],
      category,
      name: d.name ?? category,
      ...info,
      endpoints: [],
    });
  }
  return [...groups.values()];
}
