import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi, beforeEach } from "vitest";
import {
  lightingSummary,
  sessionVolumeSummary,
  readinessCheck,
  validateReadiness,
  type LightingDiscovery,
  type Readiness,
} from "./nativeInvestigation";
import { LightingDiscoveryPanel } from "./LightingDiscoveryPanel";
import { inspectLighting, cancelScan } from "./bridge";
import { diagnosticExport } from "./diagnosticEngine";
import { validateExport } from "./reporting";
vi.mock("./bridge", () => ({
  inspectLighting: vi.fn(),
  cancelScan: vi.fn().mockResolvedValue(undefined),
  saveReport: vi.fn(),
}));
const readiness: Readiness = {
  operation: "audio-readiness",
  targetId: "synthetic-exact",
  kind: "recording",
  observedAt: "2026-10-18T00:00:00Z",
  complete: false,
  started: false,
  frames: 0,
  facts: null,
  errors: [
    {
      stage: "Initialize shared stream",
      message: "Original synthetic HRESULT 0x88890004",
    },
  ],
};
const lighting: LightingDiscovery = {
  operation: "lighting-discovery",
  observedAt: "2026-10-18T00:00:00Z",
  complete: true,
  lampEnumerationComplete: true,
  interfaces: [],
  systemEvidence: {
    system: { Manufacturer: "Synthetic vendor", Model: "Synthetic model" },
    bios: { SMBIOSBIOSVersion: "Synthetic BIOS" },
  },
  nodes: [],
  errors: [],
  methods: ["Synthetic selector result"],
  physicalIlluminationVerified: false,
  controlOperations: [],
};
beforeEach(() => vi.clearAllMocks());
it("keeps actual initialization failure stages and distinguishes readiness from frames or hardware health", () => {
  const check = readinessCheck(
    validateReadiness(readiness, "synthetic-exact", "recording"),
  );
  expect(check.outcome).toBe("Inconclusive");
  expect(check.measurements.originalError).toContain("0x88890004");
  const ready = readinessCheck({
    ...readiness,
    complete: true,
    errors: [],
    facts: { initialized: true, serviceReady: true, bufferFrames: 480 },
  });
  expect(ready.conclusion).toContain("No stream was started");
  expect(ready.measurements.frames).toBe(0);
});
it("rejects mismatched targets and pretend started/captured readiness responses", () => {
  expect(() => validateReadiness(readiness, "another", "recording")).toThrow();
  expect(() =>
    validateReadiness(
      { ...readiness, started: true } as unknown as Readiness,
      readiness.targetId,
      "recording",
    ),
  ).toThrow();
  expect(() =>
    validateReadiness(
      { ...readiness, complete: true },
      readiness.targetId,
      "recording",
    ),
  ).toThrow();
});
it("separates absent, blocked and advertised lighting interfaces without claiming backlight absence", () => {
  expect(lightingSummary(lighting)).toContain(
    "Firmware hotkeys or vendor-specific controls may still provide backlighting",
  );
  expect(
    lightingSummary({
      ...lighting,
      lampEnumerationComplete: false,
      complete: false,
    }),
  ).toContain("blocked or unavailable");
  expect(
    lightingSummary({
      ...lighting,
      interfaces: [
        {
          id: "synthetic",
          name: "Synthetic",
          enabled: true,
          controlValidated: false,
        },
      ],
    }),
  ).toContain(
    "control capability and physical illumination remain unvalidated",
  );
});
it("performs real-boundary discovery only after the owner action and shows method/source results", async () => {
  vi.mocked(inspectLighting).mockResolvedValue(lighting);
  render(<LightingDiscoveryPanel />);
  expect(inspectLighting).not.toHaveBeenCalled();
  fireEvent.click(
    screen.getByRole("button", { name: "Discover lighting capabilities" }),
  );
  await screen.findByText(/Windows system: Synthetic vendor/);
  expect(
    screen.getByText(/No supported LampArray interface found/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Physical illumination not verified/),
  ).toBeInTheDocument();
});
it("does not cancel an unrelated scan when a never-used lighting panel unmounts", () => {
  const view = render(<LightingDiscoveryPanel />);
  view.unmount();
  expect(cancelScan).not.toHaveBeenCalled();
});
it("exports classification/time and withholds identifying original free-text in sanitized evidence", () => {
  const report = diagnosticExport(
    null,
    [readinessCheck(readiness)],
    null,
    [],
    true,
  );
  expect(report.checks[0].classification).toBe("inconclusive");
  expect(report.checks[0].observedAt).toBe(readiness.observedAt);
  expect(report.checks[0].measurements.originalError).toBe(
    "Technical free-text withheld",
  );
  expect(() => validateExport(JSON.stringify(report))).not.toThrow();
});

it("separates session mute from endpoint readiness and rejects invalid volume evidence", () => {
  const result: Readiness = {
    ...readiness,
    complete: true,
    errors: [],
    facts: {
      initialized: true,
      serviceReady: true,
      bufferFrames: 480,
      sessionVolume: { mute: true, level: 0.4 },
    },
  };
  expect(
    sessionVolumeSummary(
      validateReadiness(result, result.targetId, result.kind),
    ),
  ).toContain("muted or at zero volume");
  expect(readinessCheck(result).measurements.sessionMuted).toBe(true);
  expect(() =>
    validateReadiness(
      {
        ...result,
        facts: { ...result.facts!, sessionVolume: { mute: false, level: 2 } },
      },
      result.targetId,
      result.kind,
    ),
  ).toThrow();
  expect(sessionVolumeSummary(readiness)).toContain("unavailable");
});
