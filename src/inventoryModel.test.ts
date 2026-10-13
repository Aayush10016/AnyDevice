import { expect, it } from "vitest";
import { buildInventory, classify } from "./inventoryModel";
import { normalize } from "./core";
import { fixtureScan, healthyMouse } from "./fixtures";
import type { Device } from "./models";
import type { Endpoint } from "./workbench";
const base = normalize(fixtureScan([healthyMouse])).devices[0];
const node = (
  id: string,
  parent: string | null = null,
  category = "HIDClass",
): Device => ({ ...base, id, parent, category, present: true });
const ep = (
  instanceId: string,
  kind: "mouse" | "keyboard" = "mouse",
): Endpoint => ({
  instanceId,
  kind,
  path: "duplicate-friendly-path",
  ancestors: [],
  capabilities: null,
  source: "synthetic",
  observedAt: base.observedAt,
});
it("separates same VID/PID mice and multiple keyboard devices", () => {
  const a = node("USB\\VID_1234&PID_1234\\A", null, "USBDevice"),
    b = node("USB\\VID_1234&PID_1234\\B", null, "USBDevice");
  const x = node("HID\\A", a.id),
    y = node("HID\\B", b.id);
  const list = buildInventory(
    [a, b, x, y],
    [ep(x.id), ep(y.id), ep(x.id, "keyboard"), ep(y.id, "keyboard")],
  );
  expect(list).toHaveLength(4);
  expect(new Set(list.map((c) => c.id)).size).toBe(4);
});
it("groups same-kind composite descendants but never mouse with keyboard", () => {
  const root = node("USB\\VID_1234&PID_1234\\R", null, "USB");
  root.compatibleIds = ["USB\\COMPOSITE"];
  const mi = node("USB\\VID_1234&PID_1234&MI_00\\R", root.id),
    a = node("HID\\A", mi.id),
    b = node("HID\\B", root.id);
  const list = buildInventory(
    [root, mi, a, b],
    [ep(a.id), ep(b.id), ep(b.id, "keyboard")],
  );
  expect(list.filter((c) => c.kind === "mouse")[0].endpoints).toHaveLength(2);
  expect(list.filter((c) => c.kind === "keyboard")[0].endpoints).toHaveLength(
    1,
  );
  expect(list.every((c) => c.device.physicalDeviceId === null)).toBe(true);
});
it("does not cross USB hubs or associate by shared container/name", () => {
  const hub = node("USB\\ROOT_HUB30\\R", null, "USB");
  const a = node("USB\\VID_1234&PID_1234\\A", hub.id),
    b = node("USB\\VID_1234&PID_1234\\B", hub.id);
  a.containerId = b.containerId = "11111111-1111-1111-1111-111111111111";
  const list = buildInventory([hub, a, b], [ep(a.id), ep(b.id)]);
  expect(list.filter((c) => c.kind)).toHaveLength(2);
  expect(list.find((c) => c.device.id === hub.id)?.placement).toBe(
    "Supporting infrastructure",
  );
});
it("preserves ambiguity for a wireless receiver with several same-kind collections", () => {
  const r = node("USB\\VID_046D&PID_1234\\RECEIVER", null, "USB");
  const a = node("HID\\A", r.id),
    b = node("HID\\B", r.id);
  const c = buildInventory([r, a, b], [ep(a.id), ep(b.id)])[0];
  expect(c.endpoints).toHaveLength(2);
  expect(c.evidence.join(" ")).toContain(
    "physical identity remains unresolved",
  );
  expect(c.name).not.toContain("Logitech");
});
it("omits disconnected nodes and never infers an endpoint from a friendly name", () => {
  const gone = { ...base, present: false };
  expect(buildInventory([gone], [ep(gone.id)])).toEqual([]);
  expect(buildInventory([node("HID\\UNMAPPED")], [ep("HID\\OTHER")])).toEqual(
    [],
  );
});
it("does not classify USB as proven external or PCI as automatically internal", () => {
  expect(classify(base, [base]).placement).toBe("Probable external peripheral");
  expect(
    classify(node("PCI\\EXTERNAL-GPU", null, "Display"), []).placement,
  ).toBe("Unknown or ambiguous");
  expect(
    classify(node("ACPI\\PROCESSOR", null, "Processor"), []).placement,
  ).toBe("Confirmed internal device");
});
it("bounds cycles and retains non-input categories as read-only candidates", () => {
  const camera = node("USB\\VID_1234&PID_0001\\CAM", null, "Camera");
  expect(buildInventory([camera], [])[0]).toMatchObject({
    category: "Cameras",
    endpoints: [],
  });
  const cyclic = node("HID\\CYCLE", "HID\\CYCLE");
  expect(buildInventory([cyclic], [ep(cyclic.id)])[0].placement).toBe(
    "Unknown or ambiguous",
  );
});
it("normalizes bounded native capabilities without forcing fallback metadata", () => {
  const d = normalize(
    fixtureScan([
      {
        ...healthyMouse,
        deviceCapabilities: 4,
        removalPolicy: 3,
        enumeratorName: "USB",
      },
    ]),
  ).devices[0];
  expect(d).toMatchObject({
    deviceCapabilities: 4,
    removalPolicy: 3,
    enumeratorName: "USB",
  });
  expect(
    normalize(fixtureScan([healthyMouse])).devices[0].deviceCapabilities,
  ).toBeUndefined();
});
