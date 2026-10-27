import type { Device, Scan } from "./models";
import type { DiagnosticCheck } from "./diagnosticEngine";

// Meanings are Windows-reported states, not physical root causes.
export function problemAdvice(code: number | null) {
  const known: Record<number, [string, string]> = {
    10: [
      "The device could not start",
      "Inspect the exact Device Manager entry and vendor diagnostic details. Compare a safe reconnect if appropriate; do not assume a failed component.",
    ],
    14: [
      "Windows requests a restart for this device",
      "Save your work and review Windows' restart request before restarting manually, then recheck this exact node.",
    ],
    18: [
      "Windows requests driver reinstallation",
      "Review the exact device and official manufacturer driver guidance first; AnyDevice does not reinstall drivers.",
    ],
    19: [
      "Windows reports incomplete or damaged configuration",
      "Review Device Manager details and official recovery guidance. Do not delete registry filters based on this code alone.",
    ],
    22: [
      "The device is disabled in Windows",
      "Confirm whether disabling it was intentional. If unwanted, review this exact entry in Device Manager before enabling it manually, then recheck.",
    ],
    28: [
      "Windows reports that drivers are not installed",
      "Match the exact hardware identity to Windows Update or the manufacturer's official driver. Do not install a guessed driver; recheck after a deliberate correction.",
    ],
    31: [
      "Windows cannot load the required drivers",
      "Review the exact driver/provider and Device Manager details; compare official manufacturer guidance before changing drivers.",
    ],
    43: [
      "Windows stopped the device after it reported a problem",
      "Inspect the same logical node in Device Manager. For an external device, compare one safe port/cable/reconnect change at a time, then recheck. Code 43 does not identify which component failed.",
    ],
    45: [
      "Windows reports this device disconnected",
      "Reconnect the intended device and refresh identity. An absent node is not a successful repair or proof of damage.",
    ],
    48: [
      "Windows blocked this device's software",
      "Review Windows' compatibility warning and the manufacturer's supported driver; do not bypass Windows protection.",
    ],
    52: [
      "Windows cannot verify the required driver's digital signature",
      "Review the exact driver with Windows and official manufacturer support. Do not disable signature enforcement; this code is not independent file-integrity verification.",
    ],
  };
  const [meaning, nextStep] =
    code !== null && known[code]
      ? known[code]
      : [
          "Windows reports a device-node problem; the cause is not established",
          "Inspect the numeric code and exact node in Device Manager. Recheck after one controlled, appropriate change; no automatic repair is justified.",
        ];
  return { meaning, nextStep };
}

export function pnpChecks(scan: Scan): DiagnosticCheck[] {
  // Evaluate raw nodes, including hubs/adapters hidden from the peripheral list.
  return scan.devices.map((d) => nodeCheck(d, scan));
}
function nodeCheck(d: Device, scan: Scan): DiagnosticCheck {
  const issue =
    (d.problemCode ?? 0) > 0 ||
    ["ERROR", "DEGRADED"].includes(d.status?.toUpperCase() ?? "");
  const good =
    d.present === true &&
    d.problemCode === 0 &&
    d.status?.toUpperCase() === "OK";
  const advice = problemAdvice(d.problemCode);
  return {
    id: `pnp:${d.id}`,
    target: d.id,
    test: "Windows device status",
    outcome: issue ? "Issue detected" : good ? "Passed" : "Inconclusive",
    confidence: "Windows-reported",
    measurements: {
      observedAt: d.observedAt,
      provider: scan.provider,
      scope: scan.scope,
      present: d.present,
      status: d.status,
      problemCode: d.problemCode,
      driverProvider: d.driverProvider ?? null,
      driverVersion: d.driverVersion ?? null,
      driverDate: d.driverDate ?? null,
      driverSnapshotObservedAt: d.observedAt,
    },
    conclusion: issue
      ? `Code ${d.problemCode ?? "unavailable"}: ${advice.meaning}. This is a Windows status observation; physical cause is unverified.`
      : good
        ? "Windows reports this present node OK with code 0. Physical function is not tested by this status check."
        : "Present/OK/code-zero evidence is incomplete; physical function is not tested and no healthy-device result is established.",
    nextStep: issue
      ? advice.nextStep
      : "Use a relevant explicit functional test; recheck status if the symptom persists.",
    hypotheses: issue
      ? [
          {
            cause: advice.meaning,
            confidence: "Possible",
            supportingEvidence: [
              `Windows status ${d.status ?? "unknown"}, problem code ${d.problemCode ?? "unknown"}`,
            ],
            verificationCriterion:
              "The same present node reports OK and code 0 after a deliberate correction; then separately verify the original symptom.",
            distinguishingTest: advice.nextStep,
          },
        ]
      : [],
  };
}
export interface DeviceStatus {
  operation: "device-status";
  targetId: string;
  observedAt: string;
  complete: boolean;
  present: boolean | null;
  status: "OK" | "ERROR" | null;
  problemCode: number | null;
  statusFlags: number | null;
  errors: { stage: string; configRet: number; message: string }[];
}
export function normalizeDeviceStatus(
  value: unknown,
  expected: string,
): DeviceStatus {
  const v = value as DeviceStatus;
  const uint = (x: unknown) =>
    Number.isInteger(x) && (x as number) >= 0 && (x as number) <= 0xffffffff;
  if (
    !v ||
    v.operation !== "device-status" ||
    typeof v.targetId !== "string" ||
    v.targetId.toUpperCase() !== expected.toUpperCase() ||
    typeof v.observedAt !== "string" ||
    !Number.isFinite(Date.parse(v.observedAt)) ||
    typeof v.complete !== "boolean" ||
    ![true, false, null].includes(v.present) ||
    !["OK", "ERROR", null].includes(v.status) ||
    !(v.problemCode === null || uint(v.problemCode)) ||
    !(v.statusFlags === null || uint(v.statusFlags)) ||
    !Array.isArray(v.errors) ||
    v.errors.length > 16 ||
    v.errors.some(
      (e) =>
        !e ||
        typeof e.stage !== "string" ||
        e.stage.length > 128 ||
        !uint(e.configRet) ||
        typeof e.message !== "string" ||
        e.message.length > 2048,
    ) ||
    (v.complete &&
      (v.present !== true ||
        v.status === null ||
        v.problemCode === null ||
        v.statusFlags === null ||
        v.errors.length !== 0 ||
        (v.status === "OK" &&
          (v.problemCode !== 0 || (v.statusFlags & 0x400) !== 0))))
  ) {
    throw new Error(
      "Invalid or mismatched native device status; previous evidence was not replaced.",
    );
  }
  return v;
}
export function recheckedPnp(
  before: DiagnosticCheck,
  after: DeviceStatus,
): DiagnosticCheck {
  normalizeDeviceStatus(after, before.target);
  const beforeTime = String(before.measurements.observedAt ?? "");
  if (
    !Number.isFinite(Date.parse(beforeTime)) ||
    Date.parse(after.observedAt) < Date.parse(beforeTime)
  )
    throw new Error(
      "Device recheck predates the current evidence; refresh before retrying.",
    );
  const originalCode = Object.hasOwn(before.measurements, "baselineProblemCode")
    ? before.measurements.baselineProblemCode
    : before.measurements.problemCode;
  const originalStatus = Object.hasOwn(before.measurements, "baselineStatus")
    ? before.measurements.baselineStatus
    : before.measurements.status;
  const originalTime =
    before.measurements.baselineObservedAt ?? before.measurements.observedAt;
  const known = after.complete && after.present === true;
  const good = known && after.status === "OK" && after.problemCode === 0;
  const issue = known && !good;
  const advice = problemAdvice(after.problemCode);
  return {
    ...before,
    outcome: good ? "Passed" : issue ? "Issue detected" : "Inconclusive",
    measurements: {
      ...before.measurements,
      observedAt: after.observedAt,
      provider: "windows-cfgmgr32",
      baselineProblemCode: originalCode ?? null,
      baselineStatus: originalStatus ?? null,
      baselineObservedAt: originalTime ?? null,
      present: after.present,
      status: after.status,
      problemCode: after.problemCode,
      statusFlags: after.statusFlags,
      verification: good
        ? "Windows status clear; physical symptom unverified"
        : issue
          ? "Windows problem still observed"
          : "Unable to verify current Windows status",
      originalError: after.errors
        .map((e) => e.message)
        .join("; ")
        .slice(0, 2048),
      nativeStage: after.errors[0]?.stage ?? null,
      configRet: after.errors[0]?.configRet ?? null,
    },
    conclusion: good
      ? `The same present node now reports OK and code 0 (baseline code ${originalCode ?? "unknown"}). This verifies Windows status only; it does not establish that the original symptom is fixed.`
      : issue
        ? `Current code ${after.problemCode}: ${advice.meaning}. Baseline code ${originalCode ?? "unknown"}; the Windows problem remains observed.`
        : "The exact node is absent or its status could not be read. Verification is incomplete; disappearance is not a fix. See the original native error.",
    nextStep: good
      ? "Repeat the original functional test on the same device and record the physical outcome separately."
      : issue
        ? advice.nextStep
        : "Confirm the device is connected, refresh its identity if it changed, and retry without treating missing evidence as success.",
    hypotheses: issue
      ? [
          {
            cause: advice.meaning,
            confidence: "Possible",
            distinguishingTest: advice.nextStep,
          },
        ]
      : [],
  };
}
