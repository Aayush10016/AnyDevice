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
