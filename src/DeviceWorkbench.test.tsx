import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { DeviceWorkbench } from "./DeviceWorkbench";
import { normalize } from "./core";
import { fixtureScan, healthyMouse } from "./fixtures";
import * as bridge from "./bridge";
import type { InputSnapshot } from "./workbench";
vi.mock("./bridge", () => ({
  inspectInputDevices: vi.fn(),
  startInputTest: vi.fn(),
  inputTestStatus: vi.fn(),
  stopInputTest: vi.fn(),
  discardInputTest: vi.fn(),
  saveReport: vi.fn(),
}));
const device = normalize(fixtureScan([healthyMouse])).devices[0];
let current: InputSnapshot;
beforeEach(() => {
  vi.clearAllMocks();
  current = {
    sessionId: 7,
    targetId: device.id,
    mode: "x-key",
    status: "testing",
    reason: "Synthetic native bridge",
    startedAt: "2026-10-13T00:00:00Z",
    stats: {
      events: 0,
      movements: 0,
      x: 0,
      y: 0,
      absolute: false,
      buttons: {},
      keys: {},
      wheelUp: 0,
      wheelDown: 0,
      horizontal: 0,
    },
    recent: [],
    historyTruncated: false,
    cleanup: false,
  };
  vi.mocked(bridge.inspectInputDevices).mockResolvedValue([
    {
      instanceId: device.id,
      path: "synthetic",
      kind: "keyboard",
      ancestors: [],
      capabilities: { reportedKeys: 104 },
      source: "synthetic",
      observedAt: device.observedAt,
    },
  ]);
  vi.mocked(bridge.startInputTest).mockResolvedValue(7);
  vi.mocked(bridge.inputTestStatus).mockImplementation(async () =>
    structuredClone(current),
  );
  vi.mocked(bridge.stopInputTest).mockImplementation(async () => {
    current.cleanup = true;
    current.status = current.stats.events ? "completed" : "noEventsObserved";
  });
  vi.mocked(bridge.saveReport).mockResolvedValue(null);
  vi.mocked(bridge.discardInputTest).mockResolvedValue(undefined);
});
function mount() {
  return render(
    <DeviceWorkbench
      device={device}
      devices={[device]}
      findings={[]}
      sanitized={true}
      onClose={vi.fn()}
    />,
  );
}
async function live() {
  fireEvent.click(screen.getByRole("tab", { name: "Live Tests" }));
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Start Test" })).toBeEnabled(),
  );
}
it("opens a selected-node workbench with explicit topology and physical identity limits", async () => {
  mount();
  expect(
    screen.getByRole("region", { name: "Device workbench" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      /Physical identity and external\/internal placement remain unresolved/,
    ),
  ).toBeInTheDocument();
  await waitFor(() =>
    expect(bridge.inspectInputDevices).toHaveBeenCalledOnce(),
  );
  expect(bridge.startInputTest).not.toHaveBeenCalled();
});
it("starts the exact mapped X endpoint, observes counts and confirms stop/reset cleanup", async () => {
  mount();
  await live();
  fireEvent.click(screen.getByLabelText(/Dedicated X-key/));
  fireEvent.change(screen.getByLabelText("Physical attempts"), {
    target: { value: "5" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Start Test" }));
  await waitFor(() =>
    expect(bridge.startInputTest).toHaveBeenCalledWith(device.id, "x-key"),
  );
  current.stats = {
    ...current.stats,
    events: 2,
    keys: { "88": { down: 1, up: 1, repeat: 0, held: false } },
  };
  current.status = "eventsObserved";
  await screen.findByText(/Native event count: 2/);
  fireEvent.click(screen.getByRole("button", { name: "Stop Test" }));
  await screen.findByText(/defective switch is not established/);
  fireEvent.click(screen.getByRole("button", { name: "Reset Test" }));
  await screen.findByText(/Reset\. Prior completed tests remain/);
});
it("stops explicit input collection on workbench unmount", async () => {
  const view = mount();
  await live();
  fireEvent.click(screen.getByRole("button", { name: "Start Test" }));
  await waitFor(() => expect(bridge.inputTestStatus).toHaveBeenCalledWith(7));
  view.unmount();
  expect(bridge.discardInputTest).toHaveBeenCalledWith(7);
});
it("preserves exact user symptom separately and sanitizes the reviewable export", async () => {
  mount();
  fireEvent.click(screen.getByRole("tab", { name: "Report a Problem" }));
  fireEvent.change(screen.getByLabelText("Device symptom"), {
    target: { value: "My X key backlight fails" },
  });
  expect(
    screen.getByText("My X key backlight fails", { selector: "p" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "History & export" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Prepare workbench export" }),
  );
  const report = JSON.parse(
    screen.getByLabelText("Workbench report preview").textContent!,
  );
  expect(report.userReport.symptom).toBeNull();
  expect(report.target.id).toBe("selected-device");
});

it("stops the session when focus moves to an editable field", async () => {
  mount();
  await live();
  fireEvent.click(screen.getByRole("button", { name: "Start Test" }));
  await waitFor(() => expect(bridge.inputTestStatus).toHaveBeenCalledWith(7));
  const input = document.createElement("input");
  document.body.appendChild(input);
  fireEvent.focusIn(input);
  await waitFor(() => expect(bridge.stopInputTest).toHaveBeenCalledWith(7));
  input.remove();
});

it("clears previous measurements when the input endpoint changes", async () => {
  vi.mocked(bridge.inspectInputDevices).mockResolvedValue(
    ["HID\\A", "HID\\B"].map((id) => ({
      instanceId: id,
      path: "synthetic",
      kind: "keyboard" as const,
      ancestors: [device.id],
      capabilities: null,
      source: "synthetic",
      observedAt: device.observedAt,
    })),
  );
  mount();
  await live();
  current.targetId = "HID\\A";
  current.stats.events = 3;
  current.cleanup = true;
  current.status = "completed";
  fireEvent.click(screen.getByRole("button", { name: "Start Test" }));
  await screen.findByText(/Native event count: 3/);
  fireEvent.change(screen.getByLabelText("Selected input collection"), {
    target: { value: "1" },
  });
  expect(screen.queryByText(/Native event count: 3/)).not.toBeInTheDocument();
  expect(screen.getByText("Not tested")).toBeInTheDocument();
  expect(bridge.discardInputTest).toHaveBeenCalledWith(7);
});
