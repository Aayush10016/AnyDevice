import type { ProviderId, DiscoveryScope } from "./models";
import { providers } from "./providers";
import { validateExport } from "./reporting";
import { invoke, isTauri } from "@tauri-apps/api/core";
export async function openProjectPage(
  page: "repository" | "documentation" | "license",
): Promise<void> {
  if (!isTauri())
    throw new Error(
      "Open https://github.com/Aayush10016/AnyDevice in your browser.",
    );
  await invoke("open_project_page", { page });
}
export async function discover(
  provider: ProviderId = "windows-cfgmgr32",
  scope: DiscoveryScope = "usb-hid",
): Promise<unknown> {
  if (!isTauri())
    throw new Error(
      "Device discovery requires the AnyDevice Windows desktop app. This browser preview contains no hardware inventory.",
    );
  if (!providers.find((p) => p.id === provider)?.scopes.includes(scope))
    throw new Error("Unsupported provider scope");
  return invoke("scan_devices", { provider, scope });
}
export async function cancelScan(): Promise<void> {
  if (isTauri()) await invoke("cancel_scan");
}
export async function saveReport(content: string): Promise<string | null> {
  if (!isTauri()) throw new Error("Saving reports requires the desktop app.");
  validateExport(content);
  return invoke("save_report", { content });
}

export async function inspectInputDevices(): Promise<
  import("./workbench").Endpoint[]
> {
  if (!isTauri())
    throw new Error("Input inspection requires the Windows desktop app.");
  const value = await invoke<{ endpoints: import("./workbench").Endpoint[] }>(
    "inspect_input_devices",
  );
  if (
    !value ||
    !Array.isArray(value.endpoints) ||
    value.endpoints.length > 4096 ||
    value.endpoints.some(
      (e) =>
        !e ||
        !["mouse", "keyboard"].includes(e.kind) ||
        !Array.isArray(e.ancestors) ||
        e.ancestors.length > 16 ||
        (e.instanceId !== null && typeof e.instanceId !== "string"),
    )
  )
    throw new Error("Invalid native input inventory");
  return value.endpoints;
}
export async function startInputTest(
  targetId: string,
  mode: "mouse" | "keyboard" | "x-key",
): Promise<number> {
  if (!isTauri())
    throw new Error("Real input tests require the Windows desktop app.");
  return invoke("start_input_test", { targetId, mode });
}
export async function inputTestStatus(
  sessionId: number,
): Promise<import("./workbench").InputSnapshot> {
  return invoke("input_test_status", { sessionId });
}
export async function stopInputTest(sessionId: number): Promise<void> {
  if (isTauri()) await invoke("stop_input_test", { sessionId });
}

export async function discardInputTest(sessionId: number): Promise<void> {
  if (isTauri()) await invoke("discard_input_test", { sessionId });
}
