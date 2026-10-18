import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { AudioWorkspace } from "./AudioWorkspace";
import { RepairPanel } from "./RepairPanel";
import {
  inspectAudio,
  startAudioTest,
  audioTestStatus,
  stopAudioTest,
  discardAudioTest,
  proposeUnmute,
  executeAudioRepair,
} from "./bridge";
vi.mock("./bridge", () => ({
  inspectAudio: vi.fn(),
  startAudioTest: vi.fn(),
  audioTestStatus: vi.fn(),
  stopAudioTest: vi.fn().mockResolvedValue(undefined),
  discardAudioTest: vi.fn().mockResolvedValue(undefined),
  saveReport: vi.fn(),
  proposeUnmute: vi.fn(),
  executeAudioRepair: vi.fn(),
}));
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
  id: "synthetic-playback",
  name: "Synthetic speakers",
  instanceId: null,
  containerId: null,
  kind: "playback" as const,
  state: "active" as const,
  defaultRoles: [],
  mute: false,
  volume: 0.2,
  format,
};
const callbacks = () => ({
  onBack: vi.fn(),
  onInventory: vi.fn(),
  onSession: vi.fn(),
  onRepair: vi.fn(),
});
it("records both-ear mismatch and requires a new user action for the opposite channel", async () => {
  vi.mocked(audioTestStatus).mockResolvedValue({
    sessionId: 17,
    targetId: endpoint.id,
    mode: "left",
    status: "completed",
    reason: "Synthetic submitted buffer",
    startedAt: "2026-10-18T00:00:00Z",
    format,
    frames: 480,
    aggregate: [
      {
        samples: 480,
        rms: 0.02,
        rmsDbfs: -34,
        peak: 0.03,
        zeroProportion: 0,
        clippingProportion: 0,
        invalidSamples: 0,
      },
      {
        samples: 480,
        rms: 0,
        rmsDbfs: -120,
        peak: 0,
        zeroProportion: 1,
        clippingProportion: 0,
        invalidSamples: 0,
      },
    ],
    window: [],
    discontinuities: 0,
    timestampErrors: 0,
    cleanup: true,
  });
  render(<AudioWorkspace initialEndpoint={endpoint.id} {...callbacks()} />);
  await waitFor(() =>
    expect(
      screen.getByRole("checkbox", { name: "Allow this audio test" }),
    ).toBeEnabled(),
  );
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Allow this audio test" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Test left channel" }));
  const answer = await screen.findByRole("combobox", { name: "Observed ear" });
  fireEvent.change(answer, { target: { value: "both" } });
  expect(
    screen.getByRole("heading", { name: "Issue detected" }),
  ).toBeInTheDocument();
  expect(startAudioTest).toHaveBeenCalledTimes(1);
  fireEvent.click(
    screen.getByRole("button", { name: "Continue with right channel" }),
  );
  await waitFor(() =>
    expect(startAudioTest).toHaveBeenCalledWith(endpoint.id, "right"),
  );
  expect(discardAudioTest).toHaveBeenCalledWith(17);
});
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(inspectAudio).mockResolvedValue({
    endpoints: [
      endpoint,
      {
        ...endpoint,
        id: "synthetic-mic",
        name: "Synthetic microphone",
        kind: "recording",
      },
    ],
    errors: [],
    complete: true,
    source: "synthetic",
    observedAt: "2026-10-14T00:00:00Z",
  });
  vi.mocked(startAudioTest).mockResolvedValue(17);
  vi.mocked(audioTestStatus).mockResolvedValue({
    sessionId: 17,
    targetId: "synthetic-mic",
    mode: "ambient",
    status: "running",
    reason: "Synthetic test only",
    startedAt: "2026-10-14T00:00:00Z",
    format,
    frames: 0,
    aggregate: [],
    window: [],
    discontinuities: 0,
    timestampErrors: 0,
    cleanup: false,
  });
});
it("reads metadata on entry and requires endpoint-specific consent before starting", async () => {
  const view = render(
    <AudioWorkspace initialEndpoint={endpoint.id} {...callbacks()} />,
  );
  const play = await screen.findByRole("button", { name: "Play quiet tone" });
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Refresh audio endpoints" }),
    ).toBeEnabled(),
  );
  expect(startAudioTest).not.toHaveBeenCalled();
  expect(play).toBeDisabled();
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Allow this audio test" }),
  );
  fireEvent.change(screen.getByRole("combobox", { name: "Audio endpoint" }), {
    target: { value: "synthetic-mic" },
  });
  expect(
    screen.getByRole("button", { name: "Measure speech interval" }),
  ).toBeDisabled();
  expect(startAudioTest).not.toHaveBeenCalled();
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Allow this audio test" }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Measure quiet interval" }),
  );
  await waitFor(() =>
    expect(startAudioTest).toHaveBeenCalledWith("synthetic-mic", "ambient"),
  );
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Stop audio test" }),
    ).toBeEnabled(),
  );
  fireEvent(window, new Event("blur"));
  expect(stopAudioTest).toHaveBeenCalledWith(17);
  view.unmount();
  expect(discardAudioTest).toHaveBeenCalledWith(17);
});
it("keeps inactive endpoints visible but prevents their streams even after consent", async () => {
  vi.mocked(inspectAudio).mockResolvedValue({
    endpoints: [{ ...endpoint, state: "unplugged" }],
    errors: [],
    complete: true,
    source: "synthetic",
    observedAt: "2026-10-14T00:00:00Z",
  });
  render(<AudioWorkspace initialEndpoint={endpoint.id} {...callbacks()} />);
  await screen.findByRole("button", { name: "Play quiet tone" });
  await waitFor(() =>
    expect(
      screen.getByRole("checkbox", { name: "Allow this audio test" }),
    ).toBeEnabled(),
  );
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Allow this audio test" }),
  );
  expect(
    screen.getByRole("button", { name: "Play quiet tone" }),
  ).toBeDisabled();
  expect(startAudioTest).not.toHaveBeenCalled();
});
it("requires separate approval for apply and rollback, and makes no write during proposal review", async () => {
  vi.mocked(proposeUnmute).mockResolvedValue({
    id: 4,
    targetId: endpoint.id,
    name: endpoint.name,
    beforeMute: true,
    desiredMute: false,
    exactChange: "Clear endpoint mute",
    risks: "Sound may become audible",
    reversal: "Restore mute",
    verification: "Read back mute",
  });
  vi.mocked(executeAudioRepair).mockResolvedValue({
    id: 4,
    targetId: endpoint.id,
    approved: true,
    beforeMute: true,
    desiredMute: false,
    afterMute: false,
    verified: true,
    rolledBack: false,
    status: "Configuration verified; audibility untested",
  });
  render(
    <RepairPanel
      targetId={endpoint.id}
      muted={true}
      running={false}
      onVerified={vi.fn()}
    />,
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Review unmute proposal" }),
  );
  const apply = await screen.findByRole("button", {
    name: "Apply approved unmute",
  });
  expect(apply).toBeDisabled();
  expect(executeAudioRepair).not.toHaveBeenCalled();
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Approve selected mute change" }),
  );
  fireEvent.click(apply);
  const rollback = await screen.findByRole("button", {
    name: "Restore previous mute",
  });
  expect(executeAudioRepair).toHaveBeenCalledWith(4, true, false);
  expect(rollback).toBeDisabled();
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Approve mute rollback" }),
  );
  fireEvent.click(rollback);
  await waitFor(() =>
    expect(executeAudioRepair).toHaveBeenCalledWith(4, true, true),
  );
});
