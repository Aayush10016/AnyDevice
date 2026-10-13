import { expect, it } from "vitest";
import {
  audioConclusion,
  compareQuietSpeech,
  normalizeAudio,
  type AudioSession,
} from "./audio";
import { diagnosticExport, systemChecks } from "./diagnosticEngine";
import { normalize } from "./core";
import { fixtureScan, healthyMouse } from "./fixtures";
import { buildInventory } from "./inventoryModel";
import { validateExport } from "./reporting";
const level = {
  samples: 48000,
  rms: 0.1,
  rmsDbfs: -20,
  peak: 0.2,
  clippingProportion: 0,
  zeroProportion: 0,
  invalidSamples: 0,
};
const format = {
  sampleRate: 48000,
  channels: 1,
  bits: 32,
  float: true,
  blockAlign: 4,
  channelMask: 0,
  supported: true,
};
export const session: AudioSession = {
  sessionId: 1,
  targetId: "PRIVATE-ENDPOINT",
  mode: "ambient",
  status: "completed",
  reason: "synthetic",
  startedAt: "2026-10-13T00:00:00Z",
  format,
  frames: 48000,
  aggregate: [level],
  window: [level],
  discontinuities: 0,
  timestampErrors: 0,
  cleanup: true,
};
it("does not confuse successful API playback with audibility", () => {
  const playback = { ...session, mode: "left" as const };
  expect(audioConclusion(playback).outcome).toBe("Inconclusive");
  expect(audioConclusion(playback, "yes").outcome).toBe("Passed");
  expect(audioConclusion(playback, "no").outcome).toBe("Issue detected");
});
it("keeps clipping and silent speech as observations rather than physical defects", () => {
  expect(
    audioConclusion({
      ...session,
      aggregate: [{ ...level, clippingProportion: 0.1 }],
    }).text,
  ).toContain("defective microphone is not established");
  expect(
    audioConclusion({
      ...session,
      mode: "speech",
      aggregate: [{ ...level, rms: 0, rmsDbfs: -120, zeroProportion: 1 }],
    }).outcome,
  ).toBe("Issue detected");
  expect(audioConclusion({ ...session, status: "interrupted" }).outcome).toBe(
    "Cancelled or interrupted",
  );
  expect(audioConclusion({ ...session, frames: 0 }).outcome).toBe(
    "Inconclusive",
  );
});
it("compares only completed equal-endpoint and equal-format quiet/speech intervals", () => {
  expect(
    compareQuietSpeech(session, {
      ...session,
      mode: "speech",
      aggregate: [{ ...level, rmsDbfs: -10 }],
    }),
  ).toContain("10.0 dB");
  expect(
    compareQuietSpeech(session, {
      ...session,
      mode: "speech",
      targetId: "OTHER",
    }),
  ).toContain("Inconclusive");
  expect(
    compareQuietSpeech(session, { ...session, mode: "speech", cleanup: false }),
  ).toContain("Inconclusive");
});
it("retains inactive endpoints without claiming a connected headphone", () => {
  const inv = normalizeAudio({
    endpoints: [
      {
        id: "synthetic",
        name: "Remembered headphone",
        instanceId: null,
        containerId: null,
        kind: "playback",
        state: "unplugged",
        defaultRoles: [],
        mute: null,
        volume: null,
        format: null,
      },
    ],
    errors: [],
    complete: true,
    source: "synthetic",
    observedAt: session.startedAt,
  });
  expect(inv.endpoints[0].state).toBe("unplugged");
  expect(() =>
    normalizeAudio({
      ...inv,
      endpoints: [{ ...inv.endpoints[0], state: "healthy" }],
    }),
  ).toThrow();
});
it("automatic read-only checks explicitly leave physical input and audio tests untested", () => {
  const scan = normalize(fixtureScan([healthyMouse]));
  const checks = systemChecks(scan, buildInventory(scan.devices, []), {
    endpoints: [
      {
        id: "synthetic",
        name: "Synthetic mic",
        instanceId: null,
        containerId: null,
        kind: "recording",
        state: "active",
        defaultRoles: [],
        mute: true,
        volume: 0.5,
        format,
      },
    ],
    errors: [],
    complete: true,
    source: "synthetic",
    observedAt: session.startedAt,
  });
  expect(
    checks.find((c) => c.test === "Microphone quiet/speech quality")?.outcome,
  ).toBe("Not tested");
  expect(
    checks.find((c) => c.test === "Vendor protocols / physical LED state")
      ?.outcome,
  ).toBe("Not supported");
  expect(
    checks.find((c) => c.test === "Audio endpoint state/configuration")
      ?.hypotheses[0].confidence,
  ).toBe("Confirmed configuration");
});
it("sanitized engine export excludes identities, PCM/text and technical free text while preserving measurements", () => {
  const report = diagnosticExport(
    null,
    [],
    {
      endpoints: [
        {
          id: session.targetId,
          name: "PRIVATE MODEL",
          instanceId: "PRIVATE-NODE",
          containerId: "PRIVATE-CONTAINER",
          kind: "recording",
          state: "active",
          defaultRoles: [],
          mute: false,
          volume: 0.5,
          format,
        },
      ],
      errors: [],
      complete: true,
      source: "synthetic",
      observedAt: session.startedAt,
    },
    [session],
    true,
    [],
  );
  const json = JSON.stringify(report);
  expect(json).not.toContain("PRIVATE");
  expect(json).not.toContain("pcm");
  validateExport(json);
  const malicious = { ...report, audioSamples: [1, 2] };
  expect(() => validateExport(JSON.stringify(malicious))).toThrow();
});
