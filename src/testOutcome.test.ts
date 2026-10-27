import { expect, it } from "vitest";
import { testOutcome } from "./testOutcome";
import type { InputSnapshot } from "./workbench";
const s: InputSnapshot = {
  sessionId: 1,
  targetId: "synthetic",
  mode: "x-key",
  status: "completed",
  reason: "synthetic",
  startedAt: "2026-10-13T00:00:00Z",
  stats: {
    events: 14,
    movements: 0,
    x: 0,
    y: 0,
    absolute: false,
    buttons: {},
    keys: { "88": { down: 7, up: 7, repeat: 0, held: false } },
    wheelUp: 0,
    wheelDown: 0,
    horizontal: 0,
  },
  cleanup: true,
  recent: [],
  historyTruncated: false,
};
it("reports a concrete observation mismatch without a switch diagnosis", () => {
  const check = testOutcome(s, 10).find(
    (c) => c.name === "Reported X attempts",
  );
  expect(check?.state).toBe("Issue detected");
  expect(check?.explanation).toContain("not a confirmed defective switch");
});
it("distinguishes successful observed transitions from untested lighting", () => {
  expect(
    testOutcome(s, 7).find((c) => c.name === "Key transitions")?.state,
  ).toBe("Passed");
  expect(testOutcome(s, 7).find((c) => c.name === "Lighting")?.state).toBe(
    "Not tested",
  );
});
it("does not pass empty, active or focus-lost sessions", () => {
  expect(testOutcome(null, null)[0].state).toBe("Not tested");
  expect(testOutcome({ ...s, cleanup: false }, 7)[0].state).toBe(
    "Inconclusive",
  );
  expect(
    testOutcome({ ...s, status: "focusLost" }, 7).filter(
      (c) => c.state === "Passed",
    ),
  ).toHaveLength(0);
  expect(
    testOutcome(
      { ...s, stats: { ...s.stats, events: 0 }, status: "noEventsObserved" },
      null,
    )[0].state,
  ).toBe("Inconclusive");
});

it("never passes mouse movement or scrolling after disconnect or cancellation", () => {
  for (const status of ["disconnected", "cancelled", "focusLost"]) {
    const checks = testOutcome(
      {
        ...s,
        mode: "mouse",
        status,
        stats: { ...s.stats, movements: 2, wheelUp: 1, horizontal: 1 },
      },
      null,
    );
    expect(checks.filter((c) => c.state === "Passed")).toHaveLength(0);
  }
});
