import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const historical = new Set([
  "MASTER-SPEC.md",
  "docs/VALIDATION.md",
  "docs/BRANDING.md",
]);
const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);
const failures = files.filter(
  (f) =>
    !historical.has(f) &&
    /\.(tsx?|html|json|toml|rs|md|ya?ml)$/.test(f) &&
    /usb\s+doctor/i.test(readFileSync(f, "utf8")),
);
if (failures.length) {
  console.error("Obsolete product branding:", failures.join(", "));
  process.exit(1);
}
const config = JSON.parse(readFileSync("src-tauri/tauri.conf.json", "utf8"));
if (
  config.productName !== "AnyDevice" ||
  config.app.windows[0].title !== "AnyDevice" ||
  config.identifier !== "io.anydevice.usbdoctor"
)
  throw new Error("Product or installation identity regressed");
console.log(
  "AnyDevice branding passed; historical specification/validation and installation identifier preserved.",
);
