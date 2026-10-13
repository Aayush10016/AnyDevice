import { expect, it } from "vitest";
import { normalize, diagnose, makeReport } from "./core";
import { fixtureScan, healthyMouse } from "./fixtures";
import { capture, compare, investigationReport } from "./investigation";
import {
  annotate,
  binaryDiff,
  hexRows,
  readSample,
  analysisReport,
} from "./binary";
const native = (devices: unknown[] = []) =>
  normalize({
    ...fixtureScan(devices),
    provider: "windows-cfgmgr32",
    scope: "all-pnp",
  });
it("collects broader classes only under explicit native all-PnP provenance", () => {
  const scan = native([
    {
      ...healthyMouse,
      instanceId: "BTH\\SYNTHETIC",
      category: "Bluetooth",
      hardwareIds: [],
    },
  ]);
  expect(scan.devices).toHaveLength(1);
  expect(scan.devices[0].transport).toBe("Unknown");
  expect(scan.devices[0].source).toContain("Configuration Manager");
  expect(makeReport(scan, [], true).provenance.scope).toBe("all-pnp");
});
it("abstains from absence findings across provider or scope changes", () => {
  const before = normalize(fixtureScan([healthyMouse]));
  const after = native();
  expect(diagnose(after, before)).toEqual([]);
  expect(compare(before, after).comparable).toBe(false);
});
it("detects additions removals and supported property changes with stable node identity", () => {
  const before = native([
    healthyMouse,
    { ...healthyMouse, instanceId: "USB\\REMOVED" },
  ]);
  const after = native([
    {
      ...healthyMouse,
      parent: "USB\\NEW-PARENT",
      problemCode: 22,
      status: "ERROR",
    },
    { ...healthyMouse, instanceId: "USB\\ADDED" },
  ]);
  expect(compare(before, after).changes.map((d) => d.kind)).toEqual([
    "changed",
    "added",
    "removed",
  ]);
  expect(compare(before, after).changes[0].fields).toEqual([
    "parent",
    "status",
    "problemCode",
  ]);
});
it("abstains from partial comparisons and ignores timestamps and case-only identity changes", () => {
  const before = native([healthyMouse]);
  const after = {
    ...before,
    collectedAt: "2026-01-02T00:00:00Z",
    devices: before.devices.map((d) => ({ ...d, id: d.id.toLowerCase() })),
  };
  expect(compare(before, after).changes).toEqual([]);
  expect(compare(before, { ...after, complete: false }).comparable).toBe(false);
});
it("bounds investigation captures and keeps user claims distinct", () => {
  const scan = native([healthyMouse]);
  let session = capture(
    {
      schemaVersion: "investigation-1.0",
      startedAt: scan.collectedAt,
      captures: [],
    },
    scan,
    "My secret serial",
  );
  expect(
    investigationReport(session, false).captures[0].annotation.source,
  ).toBe("user");
  for (let i = 1; i < 8; i++) session = capture(session, scan, "");
  expect(() => capture(session, scan, "")).toThrow(/limit/);
  expect(() =>
    capture({ ...session, captures: [] }, scan, "x".repeat(2001)),
  ).toThrow(/2000/);
});
it("sanitizes all investigation captures, annotations and comparison references", () => {
  const a = native([healthyMouse]);
  const b = native([{ ...healthyMouse, instanceId: "USB\\NEW-SECRET" }]);
  let session = capture(
    {
      schemaVersion: "investigation-1.0",
      startedAt: a.collectedAt,
      captures: [],
    },
    a,
    "SECRET ACTION",
  );
  session = capture(session, b, "SECRET ACTION");
  const report = investigationReport(session, true),
    json = JSON.stringify(report);
  expect(json).not.toContain("SECRET");
  expect(json).not.toContain("SYNTHETIC-SERIAL");
  expect(report.captures[1].comparison?.changes.map((c) => c.id)).toEqual([
    "device-2",
    "device-1",
  ]);
  expect(report.captures[0].report.devices[0].id).toBe("device-1");
});
it("rejects excessive discovery inventory before normalization", () => {
  expect(() => native(Array(4097).fill(healthyMouse))).toThrow(/limits/);
});
it("renders bytes as offsets and printable text without interpreting a format", () => {
  expect(hexRows(new Uint8Array([0x41, 0, 0xff]), 0)).toBe(
    "00000000  41 00 ff                                         A..",
  );
  expect(() => hexRows(new Uint8Array([1]), 1)).toThrow(/Offset/);
});
it("validates field ranges and labels", () => {
  const bytes = new Uint8Array(4);
  expect(annotate(bytes, 1, 2, "length candidate")).toEqual({
    offset: 1,
    length: 2,
    label: "length candidate",
  });
  for (const [offset, length] of [
    [-1, 1],
    [0, 0],
    [3, 2],
    [0.5, 1],
  ])
    expect(() => annotate(bytes, offset, length, "field")).toThrow(/range/);
  expect(() => annotate(bytes, 0, 1, "")).toThrow(/label/);
});
it("compares unequal samples and bounds differing offset output", () => {
  expect(
    binaryDiff(new Uint8Array([1, 2]), new Uint8Array([1, 3, 4])).differences,
  ).toBe(2);
  const diff = binaryDiff(new Uint8Array(1000), new Uint8Array(1000).fill(1));
  expect(diff.firstOffsets).toHaveLength(256);
  expect(diff.offsetsTruncated).toBe(true);
});
it("rejects unsupported, empty and oversized imports before reading", async () => {
  for (const file of [
    new File(["x"], "capture.pcap"),
    new File([], "empty.bin"),
    new File([new Uint8Array(1024 * 1024 + 1)], "large.bin"),
  ])
    await expect(readSample(file)).rejects.toThrow();
});
it("sanitized analysis excludes raw bytes, filenames, fingerprints and hypothesis text", () => {
  const sample = {
    name: "private.bin",
    bytes: new Uint8Array([1, 2]),
    sha256: "private-hash",
  };
  const json = JSON.stringify(
    analysisReport(
      sample,
      [{ offset: 0, length: 1, label: "SECRET" }],
      sample,
      true,
    ),
  );
  expect(json).not.toContain("SECRET");
  expect(json).not.toContain("private");
  expect(json).not.toContain('"bytes"');
});

import { webcrypto } from "node:crypto";
import { vi } from "vitest";
it("imports bounded raw bytes with a reproducible SHA-256 fingerprint", async () => {
  vi.stubGlobal("crypto", webcrypto);
  try {
    const file = {
      name: "synthetic.bin",
      size: 3,
      arrayBuffer: async () => new Uint8Array([97, 98, 99]).buffer,
    } as File;
    const sample = await readSample(file);
    expect(sample.sha256).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
    expect(Array.from(sample.bytes)).toEqual([97, 98, 99]);
    await expect(readSample({ ...file, size: 2 } as File)).rejects.toThrow(
      /changed/,
    );
  } finally {
    vi.unstubAllGlobals();
  }
});
it("rejects unknown providers and native scopes instead of broadening silently", () => {
  expect(() =>
    normalize({ ...fixtureScan(), provider: "third-party" }),
  ).toThrow(/provider/);
  expect(() =>
    normalize({
      ...fixtureScan(),
      provider: "windows-cfgmgr32",
      scope: "everything",
    }),
  ).toThrow(/scope/);
});

it("preserves native unknown presence and marks disappearing nodes incomplete", () => {
  const scan = native([{ ...healthyMouse, present: null }]);
  expect(scan.devices[0].present).toBeNull();
  const disappeared = native([{ ...healthyMouse, present: false }]);
  expect(disappeared.devices).toHaveLength(0);
  expect(disappeared.complete).toBe(false);
});
