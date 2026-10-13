import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import App from "./App";
import { fixtureScan, healthyMouse, windowsProblem } from "./fixtures";
import {
  discover,
  cancelScan,
  saveReport,
  inspectInputDevices,
  inspectAudio,
  startAudioTest,
  executeAudioRepair,
} from "./bridge";
vi.mock("./bridge", () => ({
  discover: vi.fn(),
  cancelScan: vi.fn(),
  saveReport: vi.fn(),
  openProjectPage: vi.fn(),
  inspectInputDevices: vi.fn().mockResolvedValue([]),
  inspectAudio: vi
    .fn()
    .mockResolvedValue({
      endpoints: [],
      errors: [],
      complete: true,
      source: "synthetic",
      observedAt: "2026-10-14T00:00:00Z",
    }),
  discardInputTest: vi.fn().mockResolvedValue(undefined),
  startAudioTest: vi.fn(),
  executeAudioRepair: vi.fn(),
}));
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  vi.mocked(discover).mockReset();
  vi.mocked(cancelScan).mockReset();
  vi.mocked(saveReport).mockReset();
});
it("pauses diagnostics between read-only steps and cancels without starting streams or repairs", async () => {
  let resolveScan!: (value: ReturnType<typeof fixtureScan>) => void;
  vi.mocked(discover).mockImplementation(
    () =>
      new Promise((resolve) => {
        resolveScan = resolve;
      }),
  );
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /^Diagnostics/ }));
  fireEvent.click(screen.getByRole("button", { name: "Run diagnostics" }));
  await waitFor(() => expect(discover).toHaveBeenCalledOnce());
  fireEvent.click(
    screen.getByRole("button", { name: "Pause after current check" }),
  );
  resolveScan(fixtureScan([healthyMouse]));
  await screen.findByText("2 / 4 — Reconciling native input sources");
  expect(inspectInputDevices).not.toHaveBeenCalled();
  expect(inspectAudio).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Cancel diagnostics" }));
  await screen.findByText(/Diagnostics cancelled; completed evidence retained/);
  expect(cancelScan).toHaveBeenCalledOnce();
  expect(inspectInputDevices).not.toHaveBeenCalled();
  expect(startAudioTest).not.toHaveBeenCalled();
  expect(executeAudioRepair).not.toHaveBeenCalled();
});
it("starts empty without fabricated devices", () => {
  render(<App />);
  expect(
    screen.getByText("Your inventory starts with a scan"),
  ).toBeInTheDocument();
  expect(
    within(
      screen.getByRole("region", { name: "Recognisable devices" }),
    ).queryByRole("button", { name: /Synthetic USB mouse/ }),
  ).not.toBeInTheDocument();
});
it("does not use infrastructure node counts as the ordinary device badge", async () => {
  vi.mocked(discover).mockResolvedValue(
    fixtureScan([
      healthyMouse,
      {
        ...healthyMouse,
        instanceId: "USB\\ROOT_HUB30\\SYNTHETIC",
        category: "USB",
        name: "Synthetic root hub",
      },
    ]),
  );
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Scan devices" }));
  await screen.findByRole("button", { name: "Devices 1" });
  expect(
    screen.queryByRole("button", { name: "Devices 2" }),
  ).not.toBeInTheDocument();
});
it("opens a dedicated mouse workspace and returns to the inventory in the same window", async () => {
  vi.mocked(discover).mockResolvedValue(fixtureScan([healthyMouse]));
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Scan devices" }));
  const candidate = await within(
    screen.getByRole("region", { name: "Recognisable devices" }),
  ).findByRole("button", { name: /Synthetic USB mouse/ });
  fireEvent.click(candidate);
  expect(
    screen.getByRole("region", { name: "Device workbench" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("region", { name: "Recognisable devices" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("complementary", { name: "Device inspection" }),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Back to devices" }));
  expect(
    screen.getByRole("region", { name: "Recognisable devices" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("region", { name: "Device workbench" }),
  ).not.toBeInTheDocument();
});
it("scans, searches, inspects and exports the sanitized preview", async () => {
  vi.mocked(discover).mockResolvedValue(
    fixtureScan([healthyMouse, windowsProblem]),
  );
  vi.mocked(saveReport).mockResolvedValue("C:/reports/test.json");
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Scan devices" }));
  await within(
    screen.getByRole("region", { name: "Recognisable devices" }),
  ).findByRole("button", { name: /Synthetic USB mouse/ });
  fireEvent.click(screen.getByRole("button", { name: "Devices 2" }));
  fireEvent.change(screen.getByLabelText("Find a device"), {
    target: { value: "problem" },
  });
  expect(
    within(
      screen.getByRole("region", { name: "Recognisable devices" }),
    ).queryByRole("button", { name: /Synthetic USB mouse/ }),
  ).not.toBeInTheDocument();
  fireEvent.click(
    within(
      screen.getByRole("region", { name: "Recognisable devices" }),
    ).getByRole("button", { name: /Synthetic problem device/ }),
  );
  expect(
    screen.getByRole("region", { name: "Device workbench" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Reports" }));
  expect(screen.getByLabelText("Report preview").textContent).not.toContain(
    "SYNTHETIC-SERIAL",
  );
  fireEvent.click(screen.getByRole("button", { name: "Save JSON report" }));
  await waitFor(() => expect(saveReport).toHaveBeenCalledOnce());
  expect(JSON.parse(vi.mocked(saveReport).mock.calls[0][0]).sanitized).toBe(
    true,
  );
});
it("retains prior inventory after scan failure and marks it stale", async () => {
  vi.mocked(discover)
    .mockResolvedValueOnce(fixtureScan([healthyMouse]))
    .mockRejectedValueOnce(new Error("Scan timed out"));
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Scan devices" }));
  await within(
    screen.getByRole("region", { name: "Recognisable devices" }),
  ).findByRole("button", { name: /Synthetic USB mouse/ });
  fireEvent.click(screen.getByRole("button", { name: "Refresh scan" }));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("Scan timed out"),
  );
  expect(
    within(
      screen.getByRole("region", { name: "Recognisable devices" }),
    ).getByRole("button", { name: /Synthetic USB mouse/ }),
  ).toBeInTheDocument();
  expect(screen.getByText(/Stale — refresh to update/)).toBeInTheDocument();
});
it("offers cancellation while scanning", async () => {
  let rejectScan!: (error: Error) => void;
  vi.mocked(discover).mockImplementation(
    () =>
      new Promise((_, reject) => {
        rejectScan = reject;
      }),
  );
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Scan devices" }));
  fireEvent.click(screen.getByRole("button", { name: "Cancel scan" }));
  await waitFor(() => expect(cancelScan).toHaveBeenCalledOnce());
  rejectScan(new Error("Scan cancelled"));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("Scan cancelled"),
  );
});
it("persists working appearance and sanitization settings", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Settings" }));
  fireEvent.click(screen.getByRole("button", { name: "Dark" }));
  expect(document.documentElement.dataset.theme).toBe("dark");
  fireEvent.click(screen.getByLabelText("Sanitize reports by default"));
  expect(
    JSON.parse(localStorage.getItem("anydevice.preferences")!).sanitize,
  ).toBe(false);
});

it("records a baseline, refreshes, captures user action and exports an investigation", async () => {
  vi.mocked(discover)
    .mockResolvedValueOnce(fixtureScan([healthyMouse]))
    .mockResolvedValueOnce({
      ...fixtureScan([]),
      collectedAt: "2026-01-01T12:01:00.000Z",
    });
  vi.mocked(saveReport).mockResolvedValue("C:/reports/investigation.json");
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Scan devices" }));
  await within(
    screen.getByRole("region", { name: "Recognisable devices" }),
  ).findByRole("button", { name: /Synthetic USB mouse/ });
  fireEvent.click(screen.getByRole("button", { name: "Investigation" }));
  fireEvent.click(screen.getByRole("button", { name: "Record baseline" }));
  fireEvent.change(
    screen.getByLabelText("Your action or hypothesis (unverified)"),
    { target: { value: "PRIVATE cable action" } },
  );
  fireEvent.click(screen.getByRole("button", { name: "Refresh scan" }));
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Capture current snapshot" }),
    ).toBeEnabled(),
  );
  expect(screen.getByText("removed")).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Capture current snapshot" }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Save investigation JSON" }),
  );
  await waitFor(() => expect(saveReport).toHaveBeenCalledOnce());
  const report = JSON.parse(vi.mocked(saveReport).mock.calls[0][0]);
  expect(report.captures).toHaveLength(2);
  expect(JSON.stringify(report)).not.toContain("PRIVATE");
});
it("changes discovery source and scope explicitly without inventing inventory", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Settings" }));
  fireEvent.change(screen.getByLabelText("Inventory scope"), {
    target: { value: "all-pnp" },
  });
  expect(screen.getByLabelText("Inventory scope")).toHaveValue("all-pnp");
  fireEvent.change(screen.getByLabelText("Discovery provider"), {
    target: { value: "windows-pnp-fallback" },
  });
  expect(screen.getByLabelText("Inventory scope")).toHaveValue("usb-hid");
  expect(
    screen.queryByRole("option", { name: "All present Windows PnP nodes" }),
  ).not.toBeInTheDocument();
});
