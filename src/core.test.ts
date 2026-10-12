import { describe, it, expect } from "vitest";
import { diagnose, identifiers, makeReport, normalize } from "./core";
import {
  healthyMouse,
  windowsProblem,
  incompleteMetadata,
  insufficientEvidence,
  androidIssue,
  fixtureScan,
} from "./fixtures";
describe("normalization", () => {
  it("parses valid VID/PID and preserves interface identity", () => {
    expect(identifiers(["USB\\VID_046d&PID_c077&MI_00"])).toEqual({
      vid: "046D",
      pid: "C077",
    });
    const scan = normalize(
      fixtureScan([
        healthyMouse,
        { ...healthyMouse, instanceId: healthyMouse.instanceId + "&MI_01" },
        healthyMouse,
      ]),
    );
    expect(scan.devices).toHaveLength(2);
  });
  it.each([
    "USB\\VID_ZZZZ&PID_0000",
    "USB\\VID_12345&PID_0000",
    "USB\\VID_1234&PID_00000",
    "USB\\VID_1234",
    "abcVID_1234&PID_5678",
  ])("rejects malformed identifiers %s", (id) =>
    expect(identifiers([id])).toEqual({ vid: null, pid: null }),
  );
  it("handles unknown and missing fields without guessing", () => {
    const d = normalize(fixtureScan([incompleteMetadata])).devices[0];
    expect(d.name).toBeNull();
    expect(d.problemCode).toBeNull();
    expect(d.hardwareIds).toEqual([]);
  });
  it("does not classify all HID devices as USB", () => {
    const d = normalize(
      fixtureScan([
        {
          ...healthyMouse,
          instanceId: "HID\\SYNTHETIC-BLUETOOTH",
          category: "HIDClass",
          hardwareIds: [],
        },
      ]),
    ).devices[0];
    expect(d.transport).toBe("HID (transport unknown)");
  });
  it("omits malformed and out-of-scope entries and marks the scan partial", () => {
    const scan = normalize(
      fixtureScan([
        null,
        {},
        { instanceId: "BTH\\FAKE", category: "Bluetooth" },
      ]),
    );
    expect(scan.devices).toEqual([]);
    expect(scan.complete).toBe(false);
    expect(scan.errors).toHaveLength(3);
  });
  it("rejects invalid envelopes", () => {
    expect(() => normalize(null)).toThrow();
    expect(() => normalize({ ...fixtureScan(), collectedAt: "bad" })).toThrow();
  });
  it("handles empty inventories and bad property types", () => {
    expect(normalize(fixtureScan()).devices).toEqual([]);
    const d = normalize(
      fixtureScan([
        {
          ...healthyMouse,
          name: 123,
          hardwareIds: [null, 3, "USB\\VID_0001&PID_0002"],
          problemCode: "43",
        },
      ]),
    ).devices[0];
    expect(d.name).toBeNull();
    expect(d.problemCode).toBeNull();
    expect(d.hardwareIds).toHaveLength(1);
  });
});
describe("deterministic diagnostic rules", () => {
  it("healthy fixture triggers no finding", () =>
    expect(diagnose(normalize(fixtureScan([healthyMouse])))).toEqual([]));
  it("reports Windows errors with evidence and limitations", () => {
    const f = diagnose(normalize(fixtureScan([windowsProblem])))[0];
    expect(f.classification).toBe("Windows-reported error");
    expect(f.evidence).toHaveLength(2);
    expect(f.explanation).toContain("not been established");
  });
  it("detects a disappearance only between complete scans", () => {
    const prev = normalize(fixtureScan([healthyMouse]));
    expect(diagnose(normalize(fixtureScan()), prev)[0].title).toContain(
      "no longer present",
    );
    expect(diagnose(normalize(fixtureScan([], [], false)), prev)).toEqual([]);
    expect(
      diagnose(normalize(fixtureScan()), { ...prev, complete: false }),
    ).toEqual([]);
  });
  it("handles permission denial as unavailable evidence", () => {
    const scan = normalize(
      fixtureScan(
        [],
        [{ kind: "permission", message: "Access denied" }],
        false,
      ),
    );
    expect(diagnose(scan)[0].title).toContain("denied");
    expect(scan.complete).toBe(false);
  });
  it("preserves partial property observations", () => {
    const scan = normalize(
      fixtureScan(
        [incompleteMetadata],
        [
          {
            kind: "property",
            message: "Property unavailable",
            deviceId: incompleteMetadata.instanceId,
          },
        ],
      ),
    );
    expect(scan.devices).toHaveLength(1);
    expect(diagnose(scan)).toHaveLength(2);
  });
  it("abstains from Android transfer and battery diagnoses", () => {
    const findings = diagnose(
      normalize(fixtureScan([androidIssue, insufficientEvidence])),
    );
    expect(
      findings.some(
        (f) => f.title.includes("battery") || f.title.includes("file-transfer"),
      ),
    ).toBe(false);
    expect(findings[0].title).toBe("Windows reports a device problem");
  });
  it("uses case-insensitive Windows instance identity", () => {
    const prev = normalize(fixtureScan([healthyMouse]));
    const current = normalize(
      fixtureScan([
        { ...healthyMouse, instanceId: healthyMouse.instanceId.toLowerCase() },
      ]),
    );
    expect(diagnose(current, prev)).toEqual([]);
  });
});
describe("reporting", () => {
  it("round-trips versioned JSON", () => {
    const scan = normalize(fixtureScan([windowsProblem]));
    const report = makeReport(scan, diagnose(scan), false);
    expect(JSON.parse(JSON.stringify(report))).toEqual(report);
    expect(report.schemaVersion).toBe("1.0");
  });
  it("removes identifiers from all report fields without mutating observations", () => {
    const scan = normalize(
      fixtureScan(
        [windowsProblem],
        [
          {
            kind: "property",
            message: windowsProblem.instanceId,
            deviceId: windowsProblem.instanceId,
          },
        ],
      ),
    );
    const report = makeReport(scan, diagnose(scan), true);
    const json = JSON.stringify(report);
    expect(json).not.toContain("SYNTHETIC");
    expect(json).not.toContain(windowsProblem.instanceId);
    expect(report.devices[0].vid).toBe("1234");
    expect(scan.devices[0].id).toBe(windowsProblem.instanceId);
  });
  it("scrubs malicious free-text properties including status and category", () => {
    const scan = normalize(
      fixtureScan([
        {
          ...healthyMouse,
          name: "PRIVATE-NAME",
          category: "PRIVATE-CLASS",
          status: "PRIVATE-STATUS",
          problemCode: 43,
        },
      ]),
    );
    expect(
      JSON.stringify(makeReport(scan, diagnose(scan), true)),
    ).not.toContain("PRIVATE");
  });
  it("includes prior evidence and sanitizes disappeared device references", () => {
    const previous = normalize(fixtureScan([healthyMouse]));
    const scan = normalize(fixtureScan());
    const report = makeReport(scan, diagnose(scan, previous), true, previous);
    expect(report.previous?.devices).toHaveLength(1);
    expect(report.findings[0].deviceId).toBe(report.previous?.devices[0].id);
    expect(JSON.stringify(report)).not.toContain("SYNTHETIC");
  });
});
