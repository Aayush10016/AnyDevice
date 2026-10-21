import { normalizeAudio } from "./audio";
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
export async function stopInputTest(
  sessionId: number,
  reason?: "focusLost" | "navigation" | "reset",
): Promise<void> {
  if (isTauri())
    await invoke("stop_input_test", { sessionId, reason: reason ?? null });
}

export async function discardInputTest(sessionId: number): Promise<void> {
  if (isTauri()) await invoke("discard_input_test", { sessionId });
}

export async function inspectAudio(): Promise<
  import("./audio").AudioInventory
> {
  if (!isTauri())
    throw new Error("Audio tests require the Windows desktop app.");

  return normalizeAudio(await invoke("inspect_audio"));
}

export async function inspectLighting(): Promise<
  import("./nativeInvestigation").LightingDiscovery
> {
  if (!isTauri())
    throw new Error("Lighting discovery requires the Windows desktop app.");
  const r =
    await invoke<import("./nativeInvestigation").LightingDiscovery>(
      "inspect_lighting",
    );
  if (
    !r ||
    r.operation !== "lighting-discovery" ||
    !Array.isArray(r.interfaces) ||
    r.interfaces.length > 64 ||
    !Array.isArray(r.nodes) ||
    r.nodes.length > 128 ||
    !Array.isArray(r.errors) ||
    !Array.isArray(r.methods) ||
    r.physicalIlluminationVerified !== false ||
    !Array.isArray(r.controlOperations) ||
    r.controlOperations.length ||
    !Number.isFinite(Date.parse(r.observedAt))
  )
    throw new Error("Invalid lighting discovery evidence");
  return r;
}
export async function probeAudio(id: string, kind: "playback" | "recording") {
  if (!isTauri())
    throw new Error("Audio readiness requires the Windows desktop app.");
  const { validateReadiness } = await import("./nativeInvestigation");
  return validateReadiness(
    await invoke("probe_audio", { targetId: id, kind }),
    id,
    kind,
  );
}
export async function startAudioTest(
  targetId: string,
  mode: import("./audio").AudioSession["mode"],
  signalLevel: "veryQuiet" | "clearer" = "clearer",
): Promise<number> {
  if (!isTauri()) throw new Error("Audio tests require Windows desktop.");
  return invoke("start_audio_test", {
    targetId,
    mode,
    signalLevel,
    approved: true,
  });
}
export async function audioTestStatus(
  sessionId: number,
): Promise<import("./audio").AudioSession> {
  return invoke("audio_test_status", { sessionId });
}
export async function stopAudioTest(sessionId: number): Promise<void> {
  if (isTauri()) await invoke("stop_audio_test", { sessionId });
}
export async function discardAudioTest(sessionId: number): Promise<void> {
  if (isTauri()) await invoke("discard_audio_test", { sessionId });
}

export interface MuteProposal {
  id: number;
  targetId: string;
  name: string;
  beforeMute: boolean;
  desiredMute: boolean;
  exactChange: string;
  risks: string;
  reversal: string;
  verification: string;
}
export interface RepairAudit {
  id: number;
  targetId: string;
  approved: boolean;
  beforeMute: boolean;
  desiredMute: boolean;
  afterMute: boolean | null;
  verified: boolean;
  rolledBack: boolean;
  status: string;
}
export async function proposeUnmute(targetId: string): Promise<MuteProposal> {
  return invoke("propose_audio_unmute", { targetId });
}
export async function executeAudioRepair(
  proposalId: number,
  approved: boolean,
  rollback = false,
): Promise<RepairAudit> {
  return invoke("execute_audio_repair", { proposalId, approved, rollback });
}
