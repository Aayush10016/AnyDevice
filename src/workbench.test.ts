import { expect, it } from "vitest";
import { normalize, makeReport, diagnose } from "./core";
import { fixtureScan, healthyMouse } from "./fixtures";
import {
  relationships,
  endpointRelationship,
  xAssessment,
  symptomPlan,
  workbenchExport,
  type InputSnapshot,
  type Endpoint,
} from "./workbench";
import { validateExport } from "./reporting";
const d = normalize(fixtureScan([healthyMouse])).devices[0];
const stats = {
  events: 3,
  movements: 0,
  x: 0,
  y: 0,
  absolute: false,
  buttons: {},
  keys: { "88": { down: 1, up: 1, repeat: 1, held: false } },
  wheelUp: 0,
  wheelDown: 0,
  horizontal: 0,
};
const session: InputSnapshot = {
  sessionId: 1,
  targetId: d.id,
  mode: "x-key",
  status: "completed",
  reason: "synthetic fixture",
  startedAt: "2026-10-13T00:00:00Z",
  stats,
  recent: [{ kind: "key", at: "2026-10-13T00:00:00Z", vk: 88, down: true }],
  historyTruncated: false,
  cleanup: true,
};
it("keeps identical VID/PID devices separate and confirms only observed logical topology", () => {
  const other = { ...d, id: "USB\\different", parent: null };
  const child = { ...d, id: "HID\\child", parent: d.id };
  const rows = relationships(d, [d, other, child]);
  expect(rows.map((r) => r.device.id)).toEqual([d.id, child.id]);
  expect(rows[1].confidence).toBe("Confirmed");
  expect(rows[1].evidence).toContain("does not prove");
});
it("uses container evidence as probable and excludes system containers", () => {
  const a = { ...d, containerId: "11111111-1111-1111-1111-111111111111" };
  const b = { ...a, id: "HID\\other", parent: null };
  expect(relationships(a, [a, b])[1].confidence).toBe("Probable");
  expect(
    relationships(
      { ...a, containerId: "00000000-0000-0000-ffff-ffffffffffff" },
      [{ ...b, containerId: "00000000-0000-0000-ffff-ffffffffffff" }],
    ),
  ).toEqual([]);
});
it("bounds cyclic topology traversal and uses case-insensitive IDs", () => {
  const child = { ...d, id: "HID\\child", parent: d.id.toLowerCase() };
  const cycle = { ...d, id: "ROOT\\cycle", parent: "ROOT\\cycle" };
  expect(relationships(d, [child, cycle])).toHaveLength(1);
});
it("attributes input endpoints by native instance/ancestry rather than friendly names", () => {
  const endpoint: Endpoint = {
    instanceId: "HID\\collection",
    path: "synthetic-path",
    kind: "keyboard",
    ancestors: [d.id.toLowerCase()],
    capabilities: null,
    source: "synthetic",
    observedAt: d.observedAt,
  };
  expect(endpointRelationship(endpoint, d, [])).toMatchObject({
    confidence: "Confirmed",
  });
  expect(
    endpointRelationship({ ...endpoint, instanceId: null }, d, []),
  ).toBeNull();
  expect(
    endpointRelationship({ ...endpoint, ancestors: [] }, d, []),
  ).toBeNull();
});
it("does not diagnose an X switch fault from reported-versus-measured counts", () => {
  expect(xAssessment(5, session)).toContain(
    "defective switch is not established",
  );
  expect(xAssessment(1, session)).toContain(
    "intermittent fault is not ruled out",
  );
  expect(xAssessment(1, { ...session, cleanup: false })).toContain("Testing");
  expect(xAssessment(-1, session)).toContain("must be an integer");
});
it("keeps LED/user symptoms separate from measured input and never offers guessed writes", () => {
  const findings = symptomPlan(
    "My X key's backlight fails",
    "keyboard",
    session,
  );
  expect(findings[0]).toMatchObject({
    source: "user",
    text: "My X key's backlight fails",
  });
  expect(findings.some((f) => f.text.includes("No lighting command"))).toBe(
    true,
  );
});
it("sanitizes new container/location metadata and remains schema-2-compatible", () => {
  const raw = fixtureScan([
    {
      ...healthyMouse,
      containerId: "11111111-1111-1111-1111-111111111111",
      compatibleIds: ["SYNTHETIC-PRIVATE"],
      locationPaths: ["SYNTHETIC-PRIVATE"],
    },
  ]);
  const scan = normalize(raw);
  const report = makeReport(scan, diagnose(scan), true);
  const json = JSON.stringify(report);
  expect(json).not.toContain("SYNTHETIC-PRIVATE");
  expect(report.devices[0].containerId).toBeNull();
  expect(() => validateExport(json)).not.toThrow();
});
it("exports bounded aggregates but never ordered key events or typed text", () => {
  for (const sanitized of [false, true]) {
    const report = workbenchExport(
      d,
      "Private symptom",
      "Private conditions",
      5,
      [session],
      sanitized,
    );
    const json = JSON.stringify(report);
    expect(json).not.toContain('"recent"');
    expect(() => validateExport(json)).not.toThrow();
    if (sanitized) {
      expect(json).not.toContain(d.id);
      expect(json).not.toContain("Private symptom");
      expect(report.userReport.physicalAttempts).toBeNull();
    }
  }
});
it("rejects event-sequence injection and excessive workbench exports", () => {
  const report = workbenchExport(d, "", "", null, [session], false);
  expect(() =>
    validateExport(
      JSON.stringify({
        ...report,
        tests: [{ ...report.tests[0], recent: session.recent }],
      }),
    ),
  ).toThrow();
  expect(() =>
    validateExport(
      JSON.stringify({
        ...report,
        userReport: { ...report.userReport, symptom: "x".repeat(2001) },
      }),
    ),
  ).toThrow();
});
