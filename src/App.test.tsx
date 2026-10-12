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
    screen.getByRole("complementary", { name: "Device inspection" }),
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
