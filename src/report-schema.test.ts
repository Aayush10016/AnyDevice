import Ajv2020 from "ajv/dist/2020";
import { expect, it } from "vitest";
import schema from "../docs/report.schema.json";
import example from "../docs/examples/synthetic-sanitized-report.json";
import { diagnose, makeReport, normalize } from "./core";
import { fixtureScan, healthyMouse, windowsProblem } from "./fixtures";
const validate = new Ajv2020({ strict: true }).compile(schema);
it("validates exported raw, sanitized and historical reports against schema 1.0", () => {
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
  expect(validate(example), JSON.stringify(validate.errors)).toBe(true);
  expect(validate({ ...example, schemaVersion: "2.0" })).toBe(false);
  expect(validate({ ...example, devices: [{ id: "fake" }] })).toBe(false);
});
