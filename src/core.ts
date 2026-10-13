import type { CollectionError, Device, Finding, Report, Scan } from "./models";
const text = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v.slice(0, 8192) : null;
const record = (v: unknown): Record<string, unknown> =>
  v !== null && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
export function identifiers(ids: string[]): {
  vid: string | null;
  pid: string | null;
} {
  for (const id of ids) {
    const match =
      /(?:^|[\\&])VID_([0-9A-F]{4})(?=&|$).*?(?:^|&)PID_([0-9A-F]{4})(?=[&\\]|$)/i.exec(
        id,
      );
    if (match)
      return { vid: match[1].toUpperCase(), pid: match[2].toUpperCase() };
  }
  return { vid: null, pid: null };
}
export function normalize(input: unknown): Scan {
  const raw = record(input);
  const timestamp = text(raw.collectedAt);
  if (
    raw.provider !== undefined &&
    !["windows-cfgmgr32", "windows-pnp-fallback"].includes(String(raw.provider))
  )
    throw new Error("Unsupported discovery provider");
  if (
    raw.provider === "windows-cfgmgr32" &&
    !["usb-hid", "all-pnp"].includes(String(raw.scope))
  )
    throw new Error("Unsupported discovery scope");
  const provider =
    raw.provider === "windows-cfgmgr32"
      ? "windows-cfgmgr32"
      : "windows-pnp-fallback";
  const scope =
    provider === "windows-cfgmgr32" && raw.scope === "all-pnp"
      ? "all-pnp"
      : "usb-hid";
  const source =
    provider === "windows-cfgmgr32"
      ? "Windows Configuration Manager (read-only)"
      : "Windows PnpDevice / Get-PnpDeviceProperty (read-only)";
  if (
    (raw.devices instanceof Array && raw.devices.length > 4096) ||
    (raw.errors instanceof Array && raw.errors.length > 32768)
  )
    throw new Error("Discovery response exceeds entry limits");
  if (
    !timestamp ||
    !Number.isFinite(Date.parse(timestamp)) ||
    !Array.isArray(raw.devices) ||
    !Array.isArray(raw.errors) ||
    typeof raw.complete !== "boolean"
  )
    throw new Error("Invalid discovery response; inventory was not replaced.");
  const errors: CollectionError[] = raw.errors.map((item) => {
    const r = record(item);
    return {
      kind: ["permission", "property", "enumeration", "malformed"].includes(
        String(r.kind),
      )
        ? (r.kind as CollectionError["kind"])
        : "enumeration",
      message: text(r.message) ?? "Collection failed",
      ...(text(r.deviceId) ? { deviceId: text(r.deviceId)! } : {}),
    };
  });
  const devices: Device[] = [];
  const seen = new Set<string>();
  for (const item of raw.devices) {
    const r = record(item),
      id = text(r.instanceId);
    if (!id) {
      errors.push({
        kind: "malformed",
        message: "An entry without an instance ID was omitted.",
      });
      continue;
    }
    if (seen.has(id.toUpperCase())) continue;
    seen.add(id.toUpperCase());
    const category = text(r.category);
    if (scope === "usb-hid" && !/^USB\\/i.test(id) && category !== "HIDClass") {
      errors.push({
        kind: "malformed",
        message: "An out-of-scope entry was omitted.",
      });
      continue;
    }
    if (provider === "windows-cfgmgr32" && r.present === false) {
      errors.push({
        kind: "enumeration",
        deviceId: id,
        message: "A node no longer present during collection was omitted.",
      });
      continue;
    }
    const hardwareIds = Array.isArray(r.hardwareIds)
      ? r.hardwareIds.map(text).filter((v): v is string => v !== null)
      : [];
    const problemCode =
      typeof r.problemCode === "number" &&
      Number.isInteger(r.problemCode) &&
      r.problemCode >= 0
        ? r.problemCode
        : null;
    const list = (v: unknown) =>
      Array.isArray(v)
        ? v
            .slice(0, 256)
            .map(text)
            .filter((x): x is string => x !== null)
        : [];
    devices.push({
      ...(Object.hasOwn(r, "deviceCapabilities")
        ? {
            deviceCapabilities:
              typeof r.deviceCapabilities === "number" &&
              Number.isInteger(r.deviceCapabilities) &&
              r.deviceCapabilities >= 0 &&
              r.deviceCapabilities <= 4294967295
                ? r.deviceCapabilities
                : null,
          }
        : {}),
      ...(Object.hasOwn(r, "removalPolicy")
        ? {
            removalPolicy:
              typeof r.removalPolicy === "number" &&
              [1, 2, 3].includes(r.removalPolicy)
                ? r.removalPolicy
                : null,
          }
        : {}),
      ...(Object.hasOwn(r, "enumeratorName")
        ? { enumeratorName: text(r.enumeratorName) }
        : {}),
      ...(Object.hasOwn(r, "containerId")
        ? {
            containerId:
              typeof r.containerId === "string" &&
              /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(r.containerId)
                ? r.containerId
                : null,
          }
        : {}),
      ...(Object.hasOwn(r, "compatibleIds")
        ? { compatibleIds: list(r.compatibleIds) }
        : {}),
      ...(Object.hasOwn(r, "locationPaths")
        ? { locationPaths: list(r.locationPaths) }
        : {}),
      present:
        provider === "windows-pnp-fallback"
          ? true
          : typeof r.present === "boolean"
            ? r.present
            : null,
      nodeKind: "logical-pnp-node",
      physicalDeviceId: null,
      interfacePaths: [],
      id,
      name: text(r.name),
      category,
      manufacturer: text(r.manufacturer),
      hardwareIds,
      parent: text(r.parent),
      location: text(r.location),
      status: text(r.status),
      problemCode,
      ...identifiers([...hardwareIds, id]),
      transport: /^USB\\/i.test(id)
        ? "USB"
        : category === "HIDClass"
          ? "HID (transport unknown)"
          : "Unknown",
      observedAt: timestamp,
      source,
    });
  }
  return {
    provider,
    providerVersion: "1.0",
    scope,
    collectedAt: timestamp,
    os: text(raw.os),
    devices,
    errors,
    complete:
      raw.complete &&
      !errors.some(
        (e) =>
          e.kind === "malformed" ||
          e.kind === "enumeration" ||
          e.kind === "permission",
      ),
  };
}
export function diagnose(scan: Scan, previous?: Scan): Finding[] {
  const findings: Finding[] = [];
  for (const d of scan.devices) {
    const evidence = [`devices/${d.id}/status`, `devices/${d.id}/problemCode`];
    if (
      (d.problemCode !== null && d.problemCode > 0) ||
      ["ERROR", "DEGRADED"].includes(d.status?.toUpperCase() ?? "")
    )
      findings.push({
        id: `problem:${d.id}`,
        deviceId: d.id,
        title: "Windows reports a device problem",
        severity: "error",
        classification: "Windows-reported error",
        confidence: "high",
        facts: [
          `Status: ${d.status ?? "unavailable"}`,
          `Problem code: ${d.problemCode ?? "unavailable"}`,
        ],
        explanation:
          d.problemCode === 22
            ? "Windows reports that this device is disabled."
            : d.problemCode === 28
              ? "Windows reports that drivers are not installed."
              : "Windows reports a problem; the root cause has not been established.",
        evidence,
        recommendation:
          "Review this entry in Device Manager. Reconnect through a known-good cable and port when safe, then scan again.",
        limitations:
          "A Windows problem code alone cannot prove a hardware fault or a cable failure.",
      });
    if (!d.name || !d.category || d.status === null || d.problemCode === null)
      findings.push({
        id: `metadata:${d.id}`,
        deviceId: d.id,
        title: "Some device properties are unavailable",
        severity: "info",
        classification: "Confirmed observation",
        confidence: "high",
        facts: [
          `Missing: ${[!d.name ? "name" : null, !d.category ? "class" : null, d.status === null ? "status" : null, d.problemCode === null ? "problem code" : null].filter(Boolean).join(", ")}`,
        ],
        explanation:
          "Windows did not expose all expected properties in this scan.",
        evidence: [`devices/${d.id}`],
        recommendation:
          "Refresh the inventory and compare with Device Manager if details are needed.",
        limitations: "Missing metadata is not evidence of defective hardware.",
      });
  }
  scan.errors.forEach((e, i) =>
    findings.push({
      id: `collection:${i}`,
      deviceId: e.deviceId,
      title:
        e.kind === "permission"
          ? "Windows denied part of the inspection"
          : "Collection could not retrieve all evidence",
      severity: "warning",
      classification: "Confirmed observation",
      confidence: "high",
      facts: [e.message],
      explanation:
        "These checks cannot reach a conclusion without the missing evidence.",
      evidence: [`errors/${i}`],
      recommendation:
        e.kind === "permission"
          ? "Check local device-management policy or consult your administrator. No elevated repair is offered."
          : "Refresh and inspect the collection error. Earlier observations remain historical.",
      limitations: "Collection failure does not establish a device failure.",
    }),
  );
  if (
    scan.complete &&
    previous?.complete &&
    scan.scope === previous.scope &&
    scan.provider === previous.provider
  )
    for (const d of previous.devices)
      if (
        !scan.devices.some(
          (current) => current.id.toUpperCase() === d.id.toUpperCase(),
        )
      )
        findings.push({
          id: `absent:${d.id}`,
          deviceId: d.id,
          title: "Previously observed entry is no longer present",
          severity: "info",
          classification: "Confirmed observation",
          confidence: "limited",
          facts: [
            `Present at ${previous.collectedAt}; absent at ${scan.collectedAt}.`,
          ],
          explanation:
            "The entry may have disconnected, changed identity, or changed mode.",
          evidence: [`previous/devices/${d.id}`, `collectedAt`],
          recommendation:
            "Reconnect if appropriate and refresh. Compare interfaces and modes before drawing conclusions.",
          limitations:
            "Absence alone cannot diagnose a defective device, battery, or cable.",
        });
  return findings.map((f) => ({
    ...f,
    facts: [
      ...f.facts,
      `Source: ${scan.provider} (${scan.scope}); observed at ${scan.collectedAt}.`,
    ],
  }));
}
export const limitations = [
  "PnP entries are logical device nodes, not enumerated interface paths or a count of physical devices.",
  "HID transport is unknown unless the entry itself is USB.",
  "No battery, charging-circuit, Bluetooth, Android MTP, protocol capture, or repair diagnosis is performed.",
  "Only complete scans with matching source/scope are compared; history is held in memory for this session.",
];
export function makeReport(
  scan: Scan,
  findings: Finding[],
  sanitize: boolean,
  previous?: Scan,
): Report {
  const report: Report = {
    schemaVersion: "2.0",
    appVersion: "0.2.0",
    provenance: {
      provider: scan.provider,
      providerVersion: scan.providerVersion,
      scope: scan.scope,
    },
    collectedAt: scan.collectedAt,
    os: scan.os,
    complete: scan.complete,
    sanitized: sanitize,
    devices: structuredClone(scan.devices),
    ...(previous
      ? {
          previous: {
            collectedAt: previous.collectedAt,
            complete: previous.complete,
            provenance: {
              provider: previous.provider,
              providerVersion: previous.providerVersion,
              scope: previous.scope,
            },
            devices: structuredClone(previous.devices),
          },
        }
      : {}),
    findings: structuredClone(findings),
    errors: structuredClone(scan.errors),
    limitations: [...limitations],
  };
  if (!sanitize) return report;
  // Strict allowlist: free-text metadata and evidence strings can contain serials or names.
  const aliases = new Map<string, string>();
  [...report.devices, ...(report.previous?.devices ?? [])].forEach((d) => {
    if (!aliases.has(d.id.toUpperCase()))
      aliases.set(d.id.toUpperCase(), `device-${aliases.size + 1}`);
  });
  const alias = (id: string) =>
    aliases.get(id.toUpperCase()) ?? "unresolved-device";
  report.os = "Windows (version withheld)";
  const scrub = (d: Device): Device => ({
    ...d,
    id: alias(d.id),
    ...(d.containerId !== undefined ? { containerId: null } : {}),
    ...(d.compatibleIds !== undefined ? { compatibleIds: [] } : {}),
    ...(d.locationPaths !== undefined ? { locationPaths: [] } : {}),
    name: null,
    manufacturer: null,
    category: [
      "HIDClass",
      "USB",
      "Mouse",
      "Keyboard",
      "WPD",
      "USBDevice",
      "Bluetooth",
      "AudioEndpoint",
      "MEDIA",
      "Camera",
      "Image",
      "Net",
      "DiskDrive",
      "Volume",
      "Printer",
      "PrintQueue",
    ].includes(d.category ?? "")
      ? d.category
      : null,
    hardwareIds: [],
    parent: null,
    location: null,
    status: ["OK", "ERROR", "DEGRADED", "UNKNOWN"].includes(
      d.status?.toUpperCase() ?? "",
    )
      ? d.status!.toUpperCase()
      : null,
  });
  report.devices = report.devices.map(scrub);
  if (report.previous)
    report.previous.devices = report.previous.devices.map(scrub);
  report.findings = report.findings.map((f, i) => ({
    ...f,
    id: `finding-${i + 1}`,
    deviceId: f.deviceId ? alias(f.deviceId) : undefined,
    facts: ["See sanitized device observations or collection errors."],
    evidence: f.deviceId
      ? [
          `${f.id.startsWith("absent:") ? "previous/" : ""}devices/${alias(f.deviceId)}`,
        ]
      : ["errors"],
  }));
  report.errors = report.errors.map((e) => ({
    kind: e.kind,
    message: "Collection error details withheld for sharing.",
    deviceId: e.deviceId ? alias(e.deviceId) : undefined,
  }));
  return report;
}
