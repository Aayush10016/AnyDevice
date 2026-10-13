// Compile only repository-owned schemas at build time. No imported sample/parser is executed.
import Ajv from "ajv/dist/2020.js";
import standalone from "ajv/dist/standalone/index.js";
import { buildSync } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const read = (name) =>
  JSON.parse(readFileSync(`docs/${name}.schema.json`, "utf8"));
const report = read("report");
const ajv = new Ajv({ strict: true, code: { source: true, esm: true } });
ajv.addSchema(report);
ajv.addSchema(read("investigation"), "investigation");
ajv.addSchema(read("binary-analysis"), "analysis");
ajv.addSchema(read("device-workbench"), "workbench");
ajv.addSchema(read("diagnostic-engine"), "engine");
const source = standalone(ajv, {
  diagnostic: report.$id,
  investigation: "investigation",
  analysis: "analysis",
  workbench: "workbench",
  engine:"engine",
});
// Bundle fixed validator runtime helpers so the app needs neither require() nor eval().
const code = buildSync({
  stdin: { contents: source, resolveDir: process.cwd() },
  bundle: true,
  platform: "browser",
  format: "esm",
  write: false,
}).outputFiles[0].text;
mkdirSync("src/generated", { recursive: true });
const output =
  "// @ts-nocheck\n// Generated from repository-owned JSON schemas; regenerate with npm run schemas.\n" +
  code
    .replace(/^(function validate\d+\()data,/gm, "$1data: any,")
    .replace(/^(function validate\d+\(.*\)) \{$/gm, "$1: boolean {");
if (process.argv.includes("--check")) {
  if (readFileSync("src/generated/validators.ts", "utf8") !== output)
    throw new Error("Generated validators are stale");
} else writeFileSync("src/generated/validators.ts", output);
console.log(
  "Standalone export validators ready; no runtime schema compilation.",
);
