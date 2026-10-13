import type { Device, Scan } from "./models";
import { diagnose, makeReport } from "./core";
export interface Change {
  id: string;
  kind: "added" | "removed" | "changed";
  fields: string[];
}
export interface Capture {
  scan: Scan;
  annotation: string;
}
export interface Investigation {
  schemaVersion: "investigation-1.0";
  startedAt: string;
  captures: Capture[];
}
const fields = [
  "name",
  "category",
  "manufacturer",
  "hardwareIds",
  "parent",
  "location",
  "status",
  "problemCode",
] as const;
export function compare(
  before: Scan,
  after: Scan,
): { comparable: boolean; reason: string; changes: Change[] } {
  if (
    !before.complete ||
    !after.complete ||
    before.scope !== after.scope ||
    before.provider !== after.provider
  )
    return {
      comparable: false,
      reason:
        "Comparison requires complete snapshots from the same provider and scope.",
      changes: [],
    };
  const map = (scan: Scan) =>
    new Map(scan.devices.map((d) => [d.id.toUpperCase(), d]));
  const old = map(before),
    next = map(after),
    changes: Change[] = [];
  for (const [key, d] of next) {
    const previous = old.get(key);
    if (!previous) changes.push({ id: d.id, kind: "added", fields: [] });
    else {
      const changed = fields.filter(
        (f) => JSON.stringify(previous[f]) !== JSON.stringify(d[f]),
      );
      if (changed.length)
        changes.push({ id: d.id, kind: "changed", fields: changed });
    }
  }
  for (const [key, d] of old)
    if (!next.has(key)) changes.push({ id: d.id, kind: "removed", fields: [] });
  return {
    comparable: true,
    reason:
      "Differences in observed logical nodes; causes and physical identity remain unknown.",
    changes,
  };
}
export function capture(
  session: Investigation,
  scan: Scan,
  annotation: string,
): Investigation {
  if (session.captures.length >= 8)
    throw new Error(
      "Session limit reached (8 captures). Start a new baseline or export this session.",
    );
  if (annotation.length > 2000)
    throw new Error("Annotation exceeds 2000 characters");
  const next = {
    ...session,
    captures: [
      ...session.captures,
      { scan: structuredClone(scan), annotation },
    ],
  };
  if (JSON.stringify(next).length > 8 * 1024 * 1024)
    throw new Error("Investigation exceeds the 8 MiB memory budget");
  return next;
}
export function investigationReport(
  session: Investigation,
  sanitized: boolean,
) {
  // One session-wide alias map keeps the same node stable across all captures.
  const aliases = new Map<string, string>();
  for (const c of session.captures)
    for (const d of c.scan.devices) {
      const key = d.id.toUpperCase();
      if (!aliases.has(key)) aliases.set(key, `device-${aliases.size + 1}`);
    }
  const alias = (id: string) =>
    aliases.get(id.toUpperCase()) ?? "unresolved-device";
  return {
    schemaVersion: "investigation-1.0",
    appVersion: "0.2.0",
    startedAt: session.startedAt,
    sanitized,
    limitations: [
      "Volatile point-in-time PnP observations, not protocol traffic or physical-device identity.",
      "User annotations are unverified statements, not Windows evidence.",
      "Timestamps, classes and VID/PID remain potentially identifying.",
    ],
    captures: session.captures.map((c, i) => {
      const report = makeReport(c.scan, diagnose(c.scan), sanitized);
      if (sanitized) {
        report.devices = report.devices.map((d, j): Device => ({
          ...d,
          id: alias(c.scan.devices[j].id),
        }));
        // Findings may reference per-report aliases; rebuild references to session aliases.
        report.findings = report.findings.map((f, j) => {
          const raw = diagnose(c.scan)[j];
          return {
            ...f,
            deviceId: raw.deviceId ? alias(raw.deviceId) : undefined,
            evidence: raw.deviceId
              ? [`devices/${alias(raw.deviceId)}`]
              : ["errors"],
          };
        });
        report.errors = report.errors.map((e, j) => ({
          ...e,
          deviceId: c.scan.errors[j].deviceId
            ? alias(c.scan.errors[j].deviceId!)
            : undefined,
        }));
      }
      const comparison = i
        ? compare(session.captures[i - 1].scan, c.scan)
        : null;
      return {
        annotation: {
          source: "user",
          text: sanitized ? "Annotation withheld for sharing." : c.annotation,
        },
        report,
        comparison: comparison
          ? {
              ...comparison,
              changes: comparison.changes.map((d) => ({
                ...d,
                id: sanitized ? alias(d.id) : d.id,
              })),
            }
          : null,
      };
    }),
  };
}
