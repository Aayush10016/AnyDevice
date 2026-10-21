import { expect, it } from "vitest";
import { audioFailureDiagnosis } from "./audioFailure";
import {
  audioConclusion,
  routingAssessment,
  normalizeAudio,
  type AudioInventory,
  type AudioSession,
} from "./audio";
import { investigateAudio } from "./audioInvestigation";
import { systemChecks, diagnosticExport } from "./diagnosticEngine";
import { validateExport } from "./reporting";
import { normalize } from "./core";
import { fixtureScan } from "./fixtures";
const format = {
  sampleRate: 48000,
  channels: 2,
  bits: 32,
  float: true,
  blockAlign: 8,
  channelMask: 3,
  supported: true,
};
const endpoint = {
  id: "synthetic",
  name: "Synthetic speakers",
  kind: "playback" as const,
  state: "active" as const,
  mute: false,
  volume: 0.4,
  format,
  defaultRoles: [],
  instanceId: null,
  containerId: null,
};
const session: AudioSession = {
  sessionId: 1,
  targetId: endpoint.id,
  mode: "tone",
  status: "completed",
  reason: "Synthetic",
  startedAt: "2026-10-21T10:00:00Z",
  format,
  frames: 144000,
  engineConsumedFrames: 144000,
  elapsedMs: 3006,
  aggregate: [],
  window: [],
  discontinuities: 0,
  timestampErrors: 0,
  cleanup: true,
};
const audio: AudioInventory = {
  endpoints: [endpoint],
  errors: [],
  complete: true,
  source: "Synthetic",
  observedAt: "2026-10-21T10:01:00Z",
  services: [
    {
      name: "Audiosrv",
      state: 1,
      win32ExitCode: 1068,
      serviceSpecificExitCode: 0,
      error: null,
    },
    {
      name: "AudioEndpointBuilder",
      state: 4,
      win32ExitCode: 0,
      serviceSpecificExitCode: 0,
      error: null,
    },
  ],
};
const scan = normalize(fixtureScan([]));
it("detects required audio services not running and retains audio evidence time and exit code", () => {
  const checks = systemChecks(scan, [], normalizeAudio(audio));
  const stopped = checks.find((c) => c.id === "audio-service:Audiosrv")!;
  expect(stopped.outcome).toBe("Issue detected");
  expect(stopped.measurements.win32ExitCode).toBe(1068);
  expect(stopped.measurements.observedAt).toBe(audio.observedAt);
  expect(
    checks.find((c) => c.id === "audio-service:AudioEndpointBuilder")!.outcome,
  ).toBe("Passed");
  const denied = systemChecks(scan, [], {
    ...audio,
    services: [
      { ...audio.services![0], state: null, error: "Original query error" },
    ],
  }).find((c) => c.id === "audio-service:Audiosrv")!;
  expect(denied.outcome).toBe("Inconclusive");
  expect(denied.measurements.originalError).toBe("Original query error");
});
it("never passes a zero-level or unsupported-format endpoint configuration", () => {
  const check = (change: object) =>
    systemChecks(scan, [], {
      ...audio,
      endpoints: [{ ...endpoint, ...change }],
    }).find((c) => c.id === `audio:${endpoint.id}`)!;
  expect(check({ volume: 0 }).outcome).toBe("Warning");
  expect(check({ format: { ...format, supported: false } }).outcome).toBe(
    "Inconclusive",
  );
  expect(check({ state: "notPresent" }).conclusion).toContain(
    "not established as faulty",
  );
});
it("explains documented HRESULTs without inventing a physical defect or an automatic repair", () => {
  expect(
    audioFailureDiagnosis("Start WASAPI stream: original 0x88890004").nextStep,
  ).toContain("Refresh endpoints");
  expect(
    audioFailureDiagnosis("Initialize shared stream: 0x8889000A").explanation,
  ).toContain("in use");
  expect(
    audioFailureDiagnosis("Initialize shared stream: 0x88890008").explanation,
  ).toContain("format");
  expect(
    audioFailureDiagnosis("Start WASAPI stream: 0x88890010").explanation,
  ).toContain("service");
  expect(
    audioFailureDiagnosis("Open capture service: 0x80070005").nextStep,
  ).toContain("privacy");
  expect(
    audioFailureDiagnosis("Unknown original 0xDEADBEEF").explanation,
  ).toContain("exact stage");
  expect(audioFailureDiagnosis("0x888900040").code).toBeNull();
  expect(
    audioConclusion({
      ...session,
      status: "failed",
      reason: "Start WASAPI stream: 0x88890004",
      frames: 0,
    }).outcome,
  ).toBe("Issue detected");
});
it("actual session mute/zero volume cannot be hidden by channel or capture completion", () => {
  expect(
    routingAssessment({ ...session, sessionMute: true }, "unsure").outcome,
  ).toBe("Issue detected");
  expect(audioConclusion({ ...session, sessionLevel: 0 }).text).toContain(
    "actual test session",
  );
  expect(
    audioConclusion({ ...session, cleanup: false, sessionMute: true }).outcome,
  ).toBe("Inconclusive");
});
it("uses the owner's same-endpoint comparison and discards it for another or incomplete session", () => {
  expect(
    investigateAudio(endpoint, session, "neither", "silent").conclusion,
  ).toContain("shared Windows/connection/device path");
  expect(
    investigateAudio(endpoint, session, "neither", "works").conclusion,
  ).toContain("application-specific");
  const other = investigateAudio(
    { ...endpoint, id: "different" },
    session,
    "neither",
    "silent",
  );
  expect(other.outcome).toBe("Inconclusive");
  expect(other.measurements.ordinaryPlayback).toBe("unknown");
  expect(
    investigateAudio(
      endpoint,
      { ...session, status: "interrupted" },
      "neither",
      "silent",
    ).measurements.ordinaryPlayback,
  ).toBe("unknown");
});
it("keeps new volume evidence bounded and sanitizes original native free text", () => {
  const result = diagnosticExport(
    null,
    [
      investigateAudio(
        endpoint,
        { ...session, status: "failed", reason: "PRIVATE failure" },
        "unsure",
      ),
    ],
    audio,
    [
      {
        ...session,
        sessionMute: false,
        sessionLevel: 0.5,
        sessionVolumeObservedAt: session.startedAt,
        sessionVolumeError: "PRIVATE volume failure",
      },
    ],
    true,
  );
  validateExport(JSON.stringify(result));
  expect(JSON.stringify(result)).not.toContain("PRIVATE");
  const validReport = JSON.stringify(result);
  const invalidTime = JSON.parse(validReport);
  invalidTime.audioSessions[0].sessionVolumeObservedAt = "not-a-time";
  expect(() => validateExport(JSON.stringify(invalidTime))).toThrow();
  result.audioSessions[0].sessionLevel = 1.5;
  expect(() => validateExport(JSON.stringify(result))).toThrow();
  expect(() =>
    normalizeAudio({ ...audio, endpoints: [{ ...endpoint, volume: 1.5 }] }),
  ).toThrow();
  expect(() =>
    normalizeAudio({
      ...audio,
      services: [{ ...audio.services![0], state: 9 }],
    }),
  ).toThrow();
});
