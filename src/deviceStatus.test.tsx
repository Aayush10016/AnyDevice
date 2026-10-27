import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { normalize, diagnose } from "./core";
import { fixtureScan, healthyMouse } from "./fixtures";
import { systemChecks, diagnosticExport } from "./diagnosticEngine";
import {
  normalizeDeviceStatus,
  recheckedPnp,
  problemAdvice,
  type DeviceStatus,
} from "./deviceStatus";
import { validateExport } from "./reporting";
import { PnpRecheck } from "./PnpRecheck";
import { probeDevice } from "./bridge";
vi.mock("./bridge", () => ({ probeDevice: vi.fn() }));
const scan = () =>
  normalize({
    ...fixtureScan([
      {
        ...healthyMouse,
        present: true,
        category: "System",
        status: "ERROR",
        problemCode: 43,
      },
    ]),
    provider: "windows-cfgmgr32",
    scope: "all-pnp",
  });
const before = () =>
  systemChecks(scan(), [], null).find((c) => c.id.startsWith("pnp:"))!;
const result = (overrides: Partial<DeviceStatus> = {}): DeviceStatus => ({
  operation: "device-status",
  targetId: healthyMouse.instanceId,
  observedAt: "2026-01-01T12:00:01.000Z",
  complete: true,
  present: true,
  status: "OK",
  problemCode: 0,
  statusFlags: 0,
  errors: [],
  ...overrides,
});

it("finds real node problems even when no peripheral candidate exists and preserves exact evidence", () => {
  const check = before();
  expect(check.outcome).toBe("Issue detected");
  expect(check.target).toBe(healthyMouse.instanceId);
  expect(check.measurements.problemCode).toBe(43);
  expect(check.conclusion).toContain("Windows stopped");
  expect(check.measurements.observedAt).toBe(scan().devices[0].observedAt);
  const finding = diagnose(scan()).find((f) => f.id.startsWith("problem:"))!;
  expect(finding.explanation).toContain(problemAdvice(43).meaning);
  expect(finding.explanation).toContain(
    "physical root cause has not been established",
  );
});
it.each([10, 14, 18, 19, 22, 28, 31, 43, 45, 48, 52])(
  "provides a specific meaning for Windows code %s with a bounded next step",
  (code) => {
    expect(problemAdvice(code).meaning).not.toContain(
      "cause is not established",
    );
    expect(problemAdvice(code).nextStep.length).toBeGreaterThan(30);
  },
);
it("unknown code stays unknown and DEGRADED is never passed", () => {
  expect(problemAdvice(999).meaning).toContain("cause is not established");
  const s = scan();
  s.devices[0].status = "degraded";
  s.devices[0].problemCode = 0;
  expect(
    systemChecks(s, [], null).find((c) => c.id.startsWith("pnp:"))?.outcome,
  ).toBe("Issue detected");
});
it("a clear recheck verifies Windows status without claiming a physical fix; repeated checks retain original baseline", () => {
  const clear = recheckedPnp(before(), result());
  expect(clear.outcome).toBe("Passed");
  expect(clear.conclusion).toContain("does not establish");
  expect(clear.measurements.baselineProblemCode).toBe(43);
  const failedAgain = recheckedPnp(
    clear,
    result({
      status: "ERROR",
      problemCode: 22,
      observedAt: "2026-01-01T12:00:02.000Z",
    }),
  );
  expect(failedAgain.measurements.baselineProblemCode).toBe(43);
  expect(failedAgain.measurements.problemCode).toBe(22);
  expect(failedAgain.nextStep).toContain("intentional");
});
it.each([false, null])(
  "missing or denied node (%s) cannot become a successful correction",
  (present) => {
    const check = recheckedPnp(
      before(),
      result({
        complete: false,
        present,
        status: null,
        problemCode: null,
        statusFlags: null,
        errors: [
          {
            stage: "Locate present device",
            configRet: 13,
            message: "Locate present device: Configuration Manager error 13",
          },
        ],
      }),
    );
    expect(check.outcome).toBe("Inconclusive");
    expect(check.measurements.problemCode).toBeNull();
    expect(check.measurements.originalError).toContain("error 13");
    expect(check.conclusion).toContain("disappearance is not a fix");
  },
);
it("rejects mismatched, malformed, contradictory and older results rather than replacing current evidence", () => {
  for (const bad of [
    result({ targetId: "OTHER" }),
    result({ problemCode: -1 }),
    result({ observedAt: "not-time" }),
    result({ problemCode: 43 }),
    result({ statusFlags: 0x400 }),
    result({ present: false }),
    result({ errors: [{ stage: "Read", configRet: 5, message: "denied" }] }),
  ]) {
    expect(() => normalizeDeviceStatus(bad, healthyMouse.instanceId)).toThrow();
  }
  expect(() =>
    recheckedPnp(before(), result({ observedAt: "2025-01-01T00:00:00Z" })),
  ).toThrow("predates");
});
it("sanitized diagnostic exports keep code and before/after times without exposing the target instance or native free text", () => {
  const check = recheckedPnp(
    before(),
    result({
      complete: false,
      present: null,
      status: null,
      problemCode: null,
      statusFlags: null,
      errors: [
        { stage: "Read", configRet: 51, message: healthyMouse.instanceId },
      ],
    }),
  );
  const report = diagnosticExport(scan(), [check], null, [], true);
  expect(() => validateExport(JSON.stringify(report))).not.toThrow();
  expect(JSON.stringify(report)).not.toContain("SYNTHETIC-SERIAL");
  expect(report.checks[0].measurements.baselineProblemCode).toBe(43);
  expect(report.checks[0].measurements.configRet).toBe(51);
});
it("does not query automatically; a deliberate recheck sends the exact node and delivers a separate result", async () => {
  vi.mocked(probeDevice).mockResolvedValue(result());
  const onResult = vi.fn();
  const check = before();
  render(<PnpRecheck check={check} disabled={false} onResult={onResult} />);
  expect(probeDevice).not.toHaveBeenCalled();
  fireEvent.click(
    screen.getByRole("button", { name: "Recheck Windows status" }),
  );
  await waitFor(() => expect(onResult).toHaveBeenCalled());
  expect(probeDevice).toHaveBeenCalledWith(check.target);
  expect(onResult.mock.calls[0][0]).toBe(check);
  expect(onResult.mock.calls[0][1].measurements.baselineProblemCode).toBe(43);
});
it("query errors are visible and cannot overwrite the original finding", async () => {
  vi.mocked(probeDevice).mockRejectedValue(new Error("Native helper denied"));
  const onResult = vi.fn();
  render(<PnpRecheck check={before()} disabled={false} onResult={onResult} />);
  fireEvent.click(
    screen.getByRole("button", { name: "Recheck Windows status" }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Native helper denied",
  );
  expect(onResult).not.toHaveBeenCalled();
});
it("an original unknown code stays unknown through repeated checks", () => {
  const initial = before();
  initial.measurements.problemCode = null;
  const first = recheckedPnp(initial, result());
  const second = recheckedPnp(
    first,
    result({ observedAt: "2026-01-01T12:00:02.000Z" }),
  );
  expect(second.measurements.baselineProblemCode).toBeNull();
  expect(second.measurements.driverSnapshotObservedAt).toBe(
    initial.measurements.observedAt,
  );
});
it("an unmounted old view cannot publish a late native result", async () => {
  let finish!: (value: DeviceStatus) => void;
  vi.mocked(probeDevice).mockReturnValue(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  const onResult = vi.fn();
  const view = render(
    <PnpRecheck check={before()} disabled={false} onResult={onResult} />,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Recheck Windows status" }),
  );
  view.unmount();
  finish(result());
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(onResult).not.toHaveBeenCalled();
});
