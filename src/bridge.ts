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
  provider = "windows-cfgmgr32",
  scope = "usb-hid",
): Promise<unknown> {
  if (!isTauri())
    throw new Error(
      "Device discovery requires the AnyDevice Windows desktop app. This browser preview contains no hardware inventory.",
    );
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
