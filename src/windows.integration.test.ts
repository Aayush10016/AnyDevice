import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { diagnose, makeReport, normalize } from "./core";
// Opt-in real collection verification. No hardware data is bundled or committed.
const path = process.env.ANYDEVICE_HARDWARE_JSON;
it.skipIf(!path)(
  "normalizes a real Windows adapter response and exports valid sanitized JSON",
  () => {
    const raw = JSON.parse(readFileSync(path!, "utf8").replace(/^\uFEFF/, ""));
    const scan = normalize(raw);
    expect(scan.collectedAt).toBeTruthy();
    expect(scan.devices.length).toBe(raw.devices.length);
    expect(scan.errors.length).toBe(raw.errors.length);
    const report = makeReport(scan, diagnose(scan), true);
    const json = JSON.stringify(report);
    expect(JSON.parse(json).schemaVersion).toBe("1.0");
    for (const device of scan.devices) {
      expect(device.source).toContain("Windows");
      expect(json).not.toContain(JSON.stringify(device.id).slice(1, -1));
    }
  },
);
