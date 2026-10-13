import Ajv2020 from "ajv/dist/2020";
import { expect, it } from "vitest";
import schema from "../docs/report.schema.json";
import legacySchema from "../docs/report-v1.schema.json";
import example from "../docs/examples/synthetic-sanitized-report.json";
import { diagnose, makeReport, normalize } from "./core";
import { fixtureScan, healthyMouse, windowsProblem } from "./fixtures";
const validate = new Ajv2020({ strict: true }).compile(schema);
it("validates exported raw, sanitized and historical reports against schema 2.0", () => {
  const previous = normalize(fixtureScan([healthyMouse]));
  const scan = normalize(fixtureScan([windowsProblem]));
  for (const sanitize of [false, true])
    expect(
      validate(
        JSON.parse(
          JSON.stringify(
            makeReport(scan, diagnose(scan, previous), sanitize, previous),
          ),
        ),
      ),
      JSON.stringify(validate.errors),
    ).toBe(true);
});
it("validates the labelled synthetic example and rejects incompatible reports", () => {
  expect(new Ajv2020({ strict: true }).compile(legacySchema)(example)).toBe(
    true,
  );
  expect(validate({ ...example, schemaVersion: "99.0" })).toBe(false);
  expect(validate({ ...example, devices: [{ id: "fake" }] })).toBe(false);
});

import { validateExport } from "./reporting";
import { capture, investigationReport } from "./investigation";
import { analysisReport } from "./binary";
it("validates all new evidence exports and rejects incomplete or excessive structures", () => {
  const scan = normalize(fixtureScan([healthyMouse]));
  const session = capture(
    {
      schemaVersion: "investigation-1.0",
      startedAt: scan.collectedAt,
      captures: [],
    },
    scan,
    "Synthetic action",
  );
  const sample = {
    name: "synthetic.bin",
    bytes: new Uint8Array([1, 2]),
    sha256: "a".repeat(64),
  };
  for (const sanitize of [true, false]) {
    expect(() =>
      validateExport(JSON.stringify(investigationReport(session, sanitize))),
    ).not.toThrow();
    expect(() =>
      validateExport(
        JSON.stringify(
          analysisReport(
            sample,
            [{ offset: 0, length: 1, label: "Synthetic hypothesis" }],
            sample,
            sanitize,
          ),
        ),
      ),
    ).not.toThrow();
  }
  for (const malformed of [
    { schemaVersion: "2.0", devices: [], findings: [] },
    { schemaVersion: "investigation-1.0", captures: [] },
    { schemaVersion: "binary-analysis-1.0", source: { length: 2000000 } },
  ])
    expect(() => validateExport(JSON.stringify(malformed))).toThrow();
});

import { execFileSync } from "node:child_process";
it("loads and validates exports with runtime code generation forbidden by the desktop CSP", () => {
  expect(
    execFileSync(process.execPath, ["scripts/check-csp.mjs"], {
      encoding: "utf8",
    }),
  ).toContain("CSP validators passed");
});
