import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import { expect, it, vi } from "vitest";
import {
  reportProblem,
  setProblemResolved,
  symptomGuidance,
} from "./reportedProblems";
import { lightingConclusion, emptyLighting } from "./LightingInvestigation";
import { diagnosticExport } from "./diagnosticEngine";
import { structureCheck } from "./evidence";
import { validateExport } from "./reporting";
import { DiagnosticDashboard } from "./DiagnosticDashboard";
import { ProblemIntake } from "./ProblemIntake";
it("a dark light with unknown model is recorded as an owner symptom, not discarded or diagnosed as a failed circuit", () => {
  const c = reportProblem(
    "USB\\KEYBOARD",
    "keyboard-light",
    "Right arrow dark; neighbors lit",
  );
  expect(structureCheck(c).classification).toBe("potential_issue");
  expect(structureCheck(c).evidenceSource).toBe("Explicit owner report");
  expect(structureCheck(c).repair.providerId).toBeNull();
  expect(
    lightingConclusion({
      ...emptyLighting,
      affectedLight: "dark",
      otherLights: "lit",
    }),
  ).toContain("You report an individual-light mismatch");
  expect(
    lightingConclusion({ ...emptyLighting, affectedLight: "dark" }),
  ).toContain("not recording your symptom");
  expect(symptomGuidance("keyboard-light").limitation).toContain(
    "cannot automatically see",
  );
});
it("resolution is an explicit owner observation and can be reopened without becoming an automated repair", () => {
  const c = reportProblem("system", "keyboard-light", "dark");
  const resolved = setProblemResolved(c, true);
  expect(resolved.measurements.reportedAt).toBe(c.measurements.reportedAt);
  expect(resolved.confidence).toBe("User-reported");
  expect(resolved.conclusion).toContain("No automatic repair");
  expect(resolved.measurements.physicalFaultConfirmed).toBe(false);
  expect(setProblemResolved(resolved, false).outcome).toBe("Issue detected");
});
it("sanitized exports retain reported symptom and lifecycle while withholding personal observations and target IDs", () => {
  const c = reportProblem(
    "USB\\PRIVATE-ID",
    "keyboard-light",
    "My personal note here",
  );
  const safe = diagnosticExport(null, [c], null, [], true);
  expect(() => validateExport(JSON.stringify(safe))).not.toThrow();
  expect(JSON.stringify(safe)).not.toContain("My personal note");
  expect(JSON.stringify(safe)).not.toContain("PRIVATE-ID");
  expect(safe.checks[0].measurements.symptomType).toBe("keyboard-light");
  expect(
    diagnosticExport(null, [c], null, [], false).checks[0].measurements
      .reportedDetail,
  ).toBe("My personal note here");
});
it("a report is prominent even with no Windows fault and its repair limit is explicit", () => {
  const c = reportProblem(
    "USB\\KEYBOARD",
    "keyboard-light",
    "right arrow dark",
  );
  const onReportedChange = vi.fn();
  render(
    <DiagnosticDashboard
      checks={[c]}
      progress="Windows checks complete"
      busy={false}
      paused={false}
      onRun={vi.fn()}
      onPause={vi.fn()}
      onCancel={vi.fn()}
      onAudio={vi.fn()}
      onExport={vi.fn()}
      onReportedChange={onReportedChange}
    />,
  );
  expect(
    screen.getByText(/0 detected findings · 1 unresolved reported problems/),
  ).toBeInTheDocument();
  const panel = within(screen.getByLabelText("Your reported problems"));
  expect(panel.getByText(/Your observation: right arrow dark/)).toBeVisible();
  expect(
    panel.getByText(/No automatic lighting fix is available/),
  ).toBeVisible();
  expect(screen.queryByText(/^These automatic checks found no/)).toBeNull();
  fireEvent.click(
    panel.getByRole("button", {
      name: "Record that my original symptom no longer occurs",
    }),
  );
  expect(onReportedChange.mock.calls[0][1].measurements.ownerResolved).toBe(
    true,
  );
});
it("recording a symptom does not start any native test and does not require a model", () => {
  const onReport = vi.fn();
  render(<ProblemIntake targets={[]} onReport={onReport} disabled={false} />);
  expect(
    screen.getByRole("button", { name: "Start investigating this problem" }),
  ).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Problem observation"), {
    target: { value: "Right-arrow light is dark" },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Start investigating this problem" }),
  );
  expect(onReport.mock.calls[0][0].target).toBe("system");
  expect(onReport.mock.calls[0][0].measurements.symptomType).toBe(
    "keyboard-light",
  );
});
it("a supported current audio mute exposes a real fix-review route, while other findings do not", () => {
  const onTest = vi.fn();
  const c = {
    ...reportProblem("exact-muted-endpoint", "audio-output", "silent"),
    id: "audio:exact-muted-endpoint",
    test: "Audio endpoint state/configuration",
    confidence: "Windows-reported" as const,
    measurements: { state: "active", mute: true },
  };
  render(
    <DiagnosticDashboard
      checks={[c]}
      progress="Ready"
      busy={false}
      paused={false}
      onRun={vi.fn()}
      onPause={vi.fn()}
      onCancel={vi.fn()}
      onAudio={vi.fn()}
      onExport={vi.fn()}
      onTest={onTest}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Review unmute fix" }));
  expect(onTest).toHaveBeenCalledWith("exact-muted-endpoint");
});
