import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { AudioWorkspace } from "./AudioWorkspace";
import { RepairPanel } from "./RepairPanel";
import {
  inspectAudio,
  probeAudio,
  startAudioTest,
  audioTestStatus,
  stopAudioTest,
  discardAudioTest,
  proposeUnmute,
  executeAudioRepair,
} from "./bridge";
vi.mock("./bridge", () => ({
  inspectAudio: vi.fn(),
  probeAudio: vi.fn(),
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
  fireEvent.change(answer, { target: { value: "neither" } });
  expect(
    screen.getByRole("heading", { name: "No sound reported" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(
    "audible test did not pass",
  );
  expect(startAudioTest).toHaveBeenCalledTimes(1);
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

it("shows a rejected start request instead of an empty successful-looking state", async () => {
  vi.mocked(startAudioTest).mockRejectedValueOnce(
    new Error("Synthetic permission rejection"),
  );
  render(<AudioWorkspace initialEndpoint={endpoint.id} {...callbacks()} />);
  await waitFor(() =>
    expect(
      screen.getByRole("checkbox", { name: "Allow this audio test" }),
    ).toBeEnabled(),
  );
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Allow this audio test" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Play quiet tone" }));
  await screen.findByRole("heading", { name: "Start request failed" });
  expect(
    screen.getByText("Synthetic permission rejection", {
      exact: false,
      selector: "pre",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Inconclusive" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("No audio stream active")).toBeNull();
});
it("stops on failed status observation and requires confirmed cleanup before retry", async () => {
  vi.mocked(audioTestStatus).mockRejectedValueOnce(
    new Error("Synthetic observation failure"),
  );
  render(<AudioWorkspace initialEndpoint={endpoint.id} {...callbacks()} />);
  await waitFor(() =>
    expect(
      screen.getByRole("checkbox", { name: "Allow this audio test" }),
    ).toBeEnabled(),
  );
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Allow this audio test" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Play quiet tone" }));
  await screen.findByRole("heading", { name: "Session observation failed" });
  expect(stopAudioTest).toHaveBeenCalledWith(17);
  expect(
    screen.getByRole("heading", { name: "Inconclusive" }),
  ).toBeInTheDocument();
  vi.mocked(audioTestStatus).mockResolvedValue({
    sessionId: 17,
    targetId: endpoint.id,
    mode: "tone",
    status: "interrupted",
    reason: "Stopped",
    startedAt: "2026-10-18T00:00:00Z",
    format,
    frames: 0,
    aggregate: [],
    window: [],
    discontinuities: 0,
    timestampErrors: 0,
    cleanup: true,
  });
  fireEvent.click(screen.getByRole("button", { name: "Reset audio test" }));
  await waitFor(() => expect(discardAudioTest).toHaveBeenCalledWith(17));
  expect(
    screen.queryByRole("heading", { name: "Session observation failed" }),
  ).toBeNull();
});
it("disables playback on an explicitly selected inactive endpoint", async () => {
  vi.mocked(inspectAudio).mockResolvedValue({
    endpoints: [{ ...endpoint, state: "unplugged" }],
    errors: [],
    complete: true,
    source: "synthetic",
    observedAt: "2026-10-18T00:00:00Z",
  });
  render(<AudioWorkspace initialEndpoint={endpoint.id} {...callbacks()} />);
  await screen.findByRole("button", { name: "Play quiet tone" });
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Allow this audio test" }),
  );
  expect(
    screen.getByRole("button", { name: "Play quiet tone" }),
  ).toBeDisabled();
  expect(startAudioTest).not.toHaveBeenCalled();
});

it("discards a delayed mute proposal after target or initial state changes", async () => {
  let resolve!: (p: import("./bridge").MuteProposal) => void;
  vi.mocked(proposeUnmute).mockImplementationOnce(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  const props = {
    targetId: endpoint.id,
    muted: true,
    running: false,
    onVerified: vi.fn(),
  };
  const view = render(<RepairPanel {...props} />);
  fireEvent.click(
    screen.getByRole("button", { name: "Review unmute proposal" }),
  );
  view.rerender(<RepairPanel {...props} muted={false} />);
  resolve({
    id: 19,
    targetId: endpoint.id,
    name: endpoint.name,
    beforeMute: true,
    desiredMute: false,
    exactChange: "Unmute",
    risks: "Audio may play",
    reversal: "Restore",
    verification: "Readback",
  });
  await waitFor(() =>
    expect(
      screen.queryByRole("button", { name: "Apply approved unmute" }),
    ).toBeNull(),
  );
  expect(executeAudioRepair).not.toHaveBeenCalled();
});

it("checks only the exact chosen endpoint readiness without starting playback or capture", async () => {
  vi.mocked(probeAudio).mockResolvedValue({
    operation: "audio-readiness",
    targetId: endpoint.id,
    kind: "playback",
    observedAt: "2026-10-18T00:00:00Z",
    complete: false,
    started: false,
    frames: 0,
    facts: null,
    errors: [
      {
        stage: "Initialize shared stream",
        message: "Original synthetic error 0x88890004",
      },
    ],
  });
  const onReadiness = vi.fn();
  render(
    <AudioWorkspace
      initialEndpoint={endpoint.id}
      {...callbacks()}
      onReadiness={onReadiness}
    />,
  );
  const probe = await screen.findByRole("button", {
    name: "Check endpoint readiness (no sound or capture)",
  });
  await waitFor(() => expect(probe).toBeEnabled());
  fireEvent.click(probe);
  await screen.findByRole("heading", {
    name: "Readiness check could not complete",
  });
  expect(probeAudio).toHaveBeenCalledWith(endpoint.id, "playback");
  expect(startAudioTest).not.toHaveBeenCalled();
  expect(onReadiness).toHaveBeenCalled();
  expect(
    screen.getByText(/Original synthetic error 0x88890004/, {
      selector: "pre",
    }),
  ).toBeInTheDocument();
});
