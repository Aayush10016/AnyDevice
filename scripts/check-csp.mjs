import { buildSync } from "esbuild";
import { runInNewContext } from "node:vm";
import { TextEncoder } from "node:util";
import assert from "node:assert/strict";
const bundle = buildSync({
  entryPoints: ["src/reporting.ts"],
  bundle: true,
  platform: "browser",
  format: "iife",
  globalName: "AnyDeviceValidation",
  write: false,
}).outputFiles[0].text;
const context = { TextEncoder };
runInNewContext(bundle, context, {
  contextCodeGeneration: { strings: false, wasm: false },
  timeout: 2000,
});
const report = {
  schemaVersion: "2.0",
  appVersion: "0.2.0",
  provenance: {
    provider: "windows-cfgmgr32",
    providerVersion: "1.0",
    scope: "usb-hid",
  },
  collectedAt: "2026-01-01T00:00:00Z",
  os: "Synthetic Windows fixture",
  complete: true,
  sanitized: true,
  devices: [],
  findings: [],
  errors: [],
  limitations: [],
};
assert.doesNotThrow(() =>
  context.AnyDeviceValidation.validateExport(JSON.stringify(report)),
);
assert.throws(() =>
  context.AnyDeviceValidation.validateExport('{"schemaVersion":"2.0"}'),
);
console.log("CSP validators passed with runtime code generation disabled.");
