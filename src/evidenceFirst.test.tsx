import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { diagnosticView, structureCheck } from "./evidence";
import {
  diagnosticExport,
  systemChecks,
  type DiagnosticCheck,
} from "./diagnosticEngine";
import { DiagnosticDashboard } from "./DiagnosticDashboard";
import { normalize } from "./core";
import { fixtureScan, healthyMouse } from "./fixtures";
import { buildInventory } from "./inventoryModel";
import { validateExport } from "./reporting";
import { streamProgress } from "./audioLifecycle";
import {
  audioConclusion,
  compareQuietSpeech,
  type AudioSession,
} from "./audio";
import {
  emptyLighting,
  lightingConclusion,
  LightingInvestigation,
} from "./LightingInvestigation";
import { workbenchExport } from "./workbench";
import { muteEligibility } from "./repairProviders";
const scan = normalize(fixtureScan([healthyMouse]));
const candidates = buildInventory(scan.devices, []);
const format = {
  channels: 1,
  sampleRate: 48000,
  bits: 32,
  float: true,
  blockAlign: 4,
  channelMask: 0,
  supported: true,
};
const level = {
  samples: 480,
  rms: 0.1,
  rmsDbfs: -20,
  peak: 0.2,
  zeroProportion: 0,
  clippingProportion: 0,
  invalidSamples: 0,
};
const session: AudioSession = {
  sessionId: 1,
  targetId: "private",
  mode: "ambient",
  status: "completed",
  reason: "Synthetic",
  startedAt: "2026-10-18T00:00:00Z",
  format,
  frames: 480,
  aggregate: [level],
  window: [level],
  discontinuities: 0,
  timestampErrors: 0,
  cleanup: true,
};
const inventory = {
  endpoints: ["one", "two"].map((id) => ({
    id,
    name: id,
    instanceId: null,
    containerId: null,
    kind: "playback" as const,
    state: "unplugged" as const,
    mute: true,
    volume: null,
    format: null,
    defaultRoles: [],
  })),
  errors: [],
  complete: true,
  source: "synthetic",
  observedAt: "2026-10-18T00:00:00Z",
};
it("groups inactive coverage and never promotes unavailable endpoints or Windows OK to functional health", () => {
  const checks = systemChecks(scan, candidates, inventory);
  expect(diagnosticView(checks).actionable).toHaveLength(0);
  const group = diagnosticView(checks).groups.find(
    (g) => g.test === "Audio endpoint state/configuration",
  );
  expect(group?.checks).toHaveLength(2);
  expect(group?.checks[0].conclusion).toContain("unavailable for testing");
  expect(
    checks.find((c) => c.test === "Windows device status")?.conclusion,
  ).toContain("not tested");
  expect(structureCheck(group!.checks[0]).repair.providerId).toBeNull();
});
it("offers a proposal only for observed active mute; mute is a configuration warning", () => {
  const audio = {
    ...inventory,
    endpoints: [{ ...inventory.endpoints[0], state: "active" as const }],
  };
  const check = systemChecks(scan, candidates, audio).find(
    (c) => c.test === "Audio endpoint state/configuration",
  )!;
  expect(check.outcome).toBe("Warning");
  expect(structureCheck(check).repair.providerId).toBe(
    "audio-endpoint-mute-v1",
  );
  expect(muteEligibility({ state: "disabled", mute: true }).eligible).toBe(
    false,
  );
  expect(muteEligibility({ state: "active", mute: null }).eligible).toBe(false);
});
const callbacks = () => ({
  onRun: vi.fn(),
  onPause: vi.fn(),
  onCancel: vi.fn(),
  onAudio: vi.fn(),
  onExport: vi.fn(),
  onTest: vi.fn(),
  onSkip: vi.fn(),
});
it("keeps ordinary results concise and preserves grouped advanced coverage", () => {
  render(
    <DiagnosticDashboard
      checks={systemChecks(scan, candidates, inventory)}
      progress="Complete"
      busy={false}
      paused={false}
      {...callbacks()}
    />,
  );
  expect(
    within(screen.getByLabelText("Actionable findings")).queryByRole("article"),
  ).toBeNull();
  expect(
    screen.getByText(
      "No confirmed problems were detected by the checks that completed. Some functions still need testing.",
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Coverage and limitations/).closest("details"),
  ).not.toHaveAttribute("open");
  expect(
    screen.getByText(
      /Audio endpoint state\/configuration — Inconclusive \(2\)/,
    ),
  ).toBeInTheDocument();
});
it("links actionable evidence to the exact target and exposes unknowns and repair eligibility", () => {
  const c: DiagnosticCheck = {
    id: "ear:1",
    target: "exact",
    test: "Channel mismatch",
    outcome: "Issue detected",
    confidence: "User-reported",
    measurements: {},
    conclusion: "Both ears heard",
    nextStep: "Repeat isolated channels",
    hypotheses: [],
  };
  const props = callbacks();
  render(
    <DiagnosticDashboard
      checks={[c]}
      progress="Complete"
      busy={false}
      paused={false}
      targetName={() => "Owner selected output"}
      {...props}
    />,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Investigate this finding" }),
  );
  expect(props.onTest).toHaveBeenCalledWith("exact");
  expect(
    screen.getByText(/No eligible automated repair/, { selector: "p" }),
  ).toBeInTheDocument();
});
it("interrupted scan does not display the completed-scan reassurance", () => {
  const c = {
    ...systemChecks(scan, candidates, null)[0],
    outcome: "Cancelled or interrupted" as const,
  };
  render(
    <DiagnosticDashboard
      checks={[c]}
      progress="Stopped"
      busy={false}
      paused={false}
      {...callbacks()}
    />,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("coverage is incomplete");
  expect(screen.queryByText(/^No confirmed problems/)).toBeNull();
});
it("exports structured versioned evidence and rejects malformed eligibility fields", () => {
  const checks = systemChecks(scan, candidates, inventory);
  const report = diagnosticExport(scan, checks, inventory, [], true);
  expect(() => validateExport(JSON.stringify(report))).not.toThrow();
  expect(report.checks[0]).toMatchObject({
    definitionId: "enumeration",
    checkVersion: 1,
    category: "inventory",
  });
  expect(JSON.stringify(report)).not.toContain(healthyMouse.instanceId);
  const broken = structuredClone(report);
  broken.checks[0].checkVersion = 2 as 1;
  expect(() => validateExport(JSON.stringify(broken))).toThrow();
});
it("distinguishes ready, startup, completed frames, native failure and failed observation", () => {
  expect(streamProgress(null, null, false)).toContain(
    "no test has been started",
  );
  expect(streamProgress(null, null, true)).toContain("Requesting");
  expect(streamProgress(session, null, false)).toContain("480 frames");
  expect(
    streamProgress({ ...session, status: "failed", frames: 0 }, null, false),
  ).toContain("Test failed");
  expect(
    streamProgress(
      session,
      { stage: "Session observation", detail: "denied" },
      false,
    ),
  ).toContain("No successful test");
});
it("missing or mismatched capture channels and discontinuities cannot pass or crash comparisons", () => {
  expect(audioConclusion({ ...session, aggregate: [] }).outcome).toBe(
    "Inconclusive",
  );
  expect(
    compareQuietSpeech(
      {
        ...session,
        format: { ...format, channels: 2 },
        aggregate: [level, level],
      },
      { ...session, mode: "speech", format: { ...format, channels: 2 } },
    ),
  ).toContain("Inconclusive");
  expect(
    compareQuietSpeech(session, {
      ...session,
      mode: "speech",
      discontinuities: 1,
    }),
  ).toContain("Inconclusive");
});
it("requires exact model evidence before owner lighting comparison and never infers LED circuit failure", () => {
  const onRecord = vi.fn();
  render(
    <LightingInvestigation
      record={null}
      onRecord={onRecord}
      input={null}
      onInput={vi.fn()}
    />,
  );
  expect(screen.getByLabelText("Right-arrow light")).toBeDisabled();
  expect(
    screen.getByText(/No validated backlight control is currently available/),
  ).toBeInTheDocument();
  expect(
    lightingConclusion({ ...emptyLighting, model: "Cosmic Byte" }),
  ).toContain("evidence is missing");
  const r = {
    ...emptyLighting,
    model: "Owner supplied model",
    modelEvidence: "Label",
    modelSource: "label" as const,
    uniformModeCompared: true,
    repeated: true,
    affectedLight: "dark" as const,
    otherLights: "lit" as const,
  };
  expect(lightingConclusion(r)).toContain(
    "cannot distinguish the LED, driver circuit or board",
  );
  const report = workbenchExport(scan.devices[0], "", "", null, [], true, r);
  expect(report.lightingInvestigation?.modelEvidence).toBeNull();
  expect(() => validateExport(JSON.stringify(report))).not.toThrow();
});
