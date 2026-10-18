import { expect, it } from "vitest";
import { deviceCapabilities, associatedAudio } from "./capabilities";
import {
  routingAssessment,
  type AudioSession,
  type AudioEndpoint,
} from "./audio";
import { inspectDescriptor } from "./hidDescriptor";
import { investigateAudio } from "./audioInvestigation";
import { diagnosticExport } from "./diagnosticEngine";
import { validateExport } from "./reporting";
import { compareRepair } from "./repairVerification";
import { buildInventory } from "./inventoryModel";
import { normalize } from "./core";
import { fixtureScan, healthyMouse } from "./fixtures";
const c = buildInventory(normalize(fixtureScan([healthyMouse])).devices, [])[0];
const e: AudioEndpoint = {
  id: "ep",
  instanceId: c.device.id,
  containerId: null,
  name: "Synthetic",
  kind: "playback",
  state: "active",
  defaultRoles: [],
  mute: false,
  volume: 0.4,
  format: {
    channels: 2,
    sampleRate: 48000,
    bits: 32,
    float: true,
    blockAlign: 8,
    channelMask: 3,
    supported: true,
  },
};
const audio = {
  endpoints: [e],
  errors: [],
  complete: true,
  source: "synthetic",
  observedAt: "2026-10-18T00:00:00Z",
};
it("requires a real matching before/after pair and does not convert level change to repair success", () => {
  const before = {
    sessionId: 1,
    targetId: e.id,
    mode: "ambient",
    cleanup: true,
    status: "completed",
    format: e.format,
    frames: 20,
    discontinuities: 0,
    timestampErrors: 0,
    aggregate: [{ samples: 20, rmsDbfs: -40, invalidSamples: 0 }],
  } as AudioSession;
  const after = {
    ...before,
    sessionId: 2,
    aggregate: [{ ...before.aggregate[0], rmsDbfs: -35 }],
  };
  expect(compareRepair(before, after)).toMatchObject({
    comparable: true,
    changesDb: [5],
  });
  expect(compareRepair(before, before).comparable).toBe(false);
  expect(compareRepair(null, after).comparable).toBe(false);
  expect(
    compareRepair(before, { ...after, targetId: "unrelated" }).comparable,
  ).toBe(false);
  expect(
    compareRepair(before, { ...after, discontinuities: 1 }).comparable,
  ).toBe(false);
  expect(compareRepair(before, { ...after, mode: "speech" }).comparable).toBe(
    false,
  );
  expect(
    compareRepair(before, {
      ...after,
      format: { ...e.format!, bits: 16, float: false },
    }).comparable,
  ).toBe(false);
});
it("exports structured counter-evidence without identities or PCM, and never proves physical separation", () => {
  const s = {
    sessionId: 2,
    targetId: e.id,
    mode: "left",
    cleanup: true,
    status: "completed",
    format: e.format,
    frames: 20,
    aggregate: [
      {
        samples: 20,
        rms: 0.02,
        rmsDbfs: -34,
        peak: 0.03,
        zeroProportion: 0,
        clippingProportion: 0,
        invalidSamples: 0,
      },
      {
        samples: 20,
        rms: 0,
        rmsDbfs: -120,
        peak: 0,
        zeroProportion: 1,
        clippingProportion: 0,
        invalidSamples: 0,
      },
    ],
    window: [],
    discontinuities: 0,
    timestampErrors: 0,
    reason: "synthetic",
    startedAt: "2026-10-18T00:00:00Z",
  } as AudioSession;
  const check = investigateAudio(e, s, "both");
  expect(check.outcome).toBe("Issue detected");
  expect(check.measurements.independentPhysicalVerification).toBe(false);
  expect(check.hypotheses[0].contradictingEvidence).toHaveLength(1);
  const report = diagnosticExport(null, [check], audio, [s], true, [], null, [
    { sessionId: 2, targetId: e.id, mode: "left", observation: "both" },
  ]);
  validateExport(JSON.stringify(report));
  expect(report.routingReports[0].targetId).not.toBe(e.id);
  expect(() =>
    validateExport(JSON.stringify({ ...report, audioSamples: [1] })),
  ).toThrow();
});
it("maps audio by exact logical identity, never friendly name or container alone", () => {
  expect(associatedAudio(c, audio)).toHaveLength(1);
  expect(
    associatedAudio(c, {
      ...audio,
      endpoints: [{ ...e, instanceId: "unrelated", name: c.name }],
    }),
  ).toHaveLength(0);
  expect(
    deviceCapabilities(c, {
      ...audio,
      endpoints: [{ ...e, state: "notPresent" }],
    }).find((c) => c.endpointId)?.state,
  ).toBe("unavailable");
});
it("a both-ear observation cannot pass either isolated channel, and interrupted observations abstain", () => {
  const s = {
    mode: "left",
    cleanup: true,
    status: "completed",
    frames: 480,
    format: e.format,
  } as AudioSession;
  expect(routingAssessment(s, "both").outcome).toBe("Issue detected");
  expect(routingAssessment(s, "right").outcome).toBe("Issue detected");
  expect(routingAssessment(s, "left").outcome).toBe("Passed");
  expect(routingAssessment({ ...s, frames: 0 }, "left").outcome).toBe(
    "Inconclusive",
  );
  expect(routingAssessment({ ...s, cleanup: false }, "left").outcome).toBe(
    "Inconclusive",
  );
  expect(routingAssessment(s, "unsure").outcome).toBe("Inconclusive");
});
// Synthetic declaration: Generic Desktop Mouse, 3-byte input. Not a real device profile.
const descriptor = new Uint8Array([
  0x05, 1, 0x09, 2, 0xa1, 1, 0x75, 8, 0x95, 3, 0x81, 2, 0xc0,
]);
it("parses bounded declared report structure without permitting operations", () => {
  const p = inspectDescriptor(descriptor);
  expect(p.reports[0].wireBytes).toBe(3);
  expect(p.reports[0].windowsBufferBytes).toBe(4);
  expect(p.verifiedModel).toBe(false);
  expect(p.operations).toEqual([]);
});
it("preserves unknown long items and rejects malformed, oversized or unsafe report declarations", () => {
  expect(
    inspectDescriptor(
      new Uint8Array([...descriptor, 0xfe, 1, 0x77, 0xaa]),
    ).items.at(-1)?.data,
  ).toEqual([0xaa]);
  for (const d of [
    new Uint8Array(4097),
    new Uint8Array([0x76, 1]),
    new Uint8Array([0xfe, 4, 1, 0]),
    new Uint8Array([0xb4]),
    new Uint8Array([0x85, 0]),
    new Uint8Array([...descriptor.slice(0, -1)]),
  ])
    expect(() => inspectDescriptor(d)).toThrow();
});
