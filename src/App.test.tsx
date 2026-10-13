import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import App from "./App";
import { fixtureScan, healthyMouse, windowsProblem } from "./fixtures";
import { discover, cancelScan, saveReport } from "./bridge";
vi.mock("./bridge", () => ({
  discover: vi.fn(),
  cancelScan: vi.fn(),
  saveReport: vi.fn(),
  openProjectPage: vi.fn(),
  inspectInputDevices: vi.fn().mockResolvedValue([]),
  discardInputTest: vi.fn().mockResolvedValue(undefined),
}));
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  vi.mocked(discover).mockReset();
  vi.mocked(cancelScan).mockReset();
  vi.mocked(saveReport).mockReset();
});
it("starts empty without fabricated devices", () => {
  render(<App />);
  expect(
    screen.getByText("Your inventory starts with a scan"),
  ).toBeInTheDocument();
  expect(screen.queryByText(healthyMouse.name)).not.toBeInTheDocument();
});
it("opens a dedicated mouse workspace and returns to the inventory in the same window", async () => {
  vi.mocked(discover).mockResolvedValue(fixtureScan([healthyMouse]));
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Scan devices" }));
  const candidate = await screen.findByRole("button", {
    name: /USB \/ HID mouse/,
  });
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
  await screen.findByText(healthyMouse.name);
  fireEvent.click(screen.getByRole("button", { name: "Devices 2" }));
  fireEvent.change(screen.getByLabelText("Search devices"), {
    target: { value: "problem" },
  });
  expect(screen.queryByText(healthyMouse.name)).not.toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: /Synthetic problem device/ }),
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
  await screen.findByText(healthyMouse.name);
  fireEvent.click(screen.getByRole("button", { name: "Refresh scan" }));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("Scan timed out"),
  );
  expect(screen.getByText(healthyMouse.name)).toBeInTheDocument();
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
  await screen.findByText(healthyMouse.name);
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
