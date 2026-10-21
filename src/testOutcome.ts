import type { InputSnapshot } from "./workbench";
export interface Check {
  name: string;
  state: "Passed" | "Issue detected" | "Inconclusive" | "Not tested";
  explanation: string;
}
export function testOutcome(
  s: InputSnapshot | null,
  attempts: number | null,
): Check[] {
  if (!s)
    return [
      {
        name: "Input observations",
        state: "Not tested",
        explanation: "Start a test and perform the displayed actions.",
      },
    ];
  if (!s.cleanup)
    return [
      {
        name: "Input observations",
        state: "Inconclusive",
        explanation:
          "The test is still active. Stop to review completed observations.",
      },
    ];
  const interrupted = !["completed", "noEventsObserved"].includes(s.status);
  const checks: Check[] = [
    {
      name: "Collection",
      state: interrupted || !s.stats.events ? "Inconclusive" : "Passed",
      explanation: interrupted
        ? "The session was interrupted. Repeat with AnyDevice active and check the selected input source."
        : s.stats.events
          ? `${s.stats.events} native events were observed from the selected logical source. This does not certify physical identity or hardware health.`
          : "No events reached this source. Try each associated collection separately; verify focus and connection.",
    },
  ];
  if (s.mode === "mouse") {
    checks.push({
      name: "Movement",
      state: interrupted
        ? "Inconclusive"
        : s.stats.movements
          ? "Passed"
          : "Not tested",
      explanation: `${s.stats.movements} movement reports observed; accuracy is not measured.`,
    });
    for (const [id, name] of [
      ["1", "Left button"],
      ["2", "Right button"],
      ["3", "Middle button"],
      ["4", "Extra button 1"],
      ["5", "Extra button 2"],
    ]) {
      const k = s.stats.buttons[id];
      checks.push({
        name,
        state: !k
          ? "Not tested"
          : interrupted
            ? "Inconclusive"
            : k.down > 0 && k.down === k.up
              ? "Passed"
              : "Inconclusive",
        explanation: k
          ? `${k.down} down / ${k.up} up. Unequal counts may reflect session boundaries; they do not prove a button fault.`
          : "No action observed; may be unsupported or unexercised.",
      });
    }
    checks.push({
      name: "Vertical scrolling",
      state: interrupted
        ? "Inconclusive"
        : s.stats.wheelUp + s.stats.wheelDown
          ? "Passed"
          : "Not tested",
      explanation: `${s.stats.wheelUp} upward / ${s.stats.wheelDown} downward reports observed.`,
    });
    checks.push({
      name: "Horizontal scrolling",
      state: interrupted
        ? "Inconclusive"
        : s.stats.horizontal
          ? "Passed"
          : "Not tested",
      explanation: `${s.stats.horizontal} reports observed. Physical direction is available in advanced event evidence.`,
    });
  } else {
    const keys = Object.values(s.stats.keys),
      down = keys.reduce((v, k) => v + k.down, 0),
      up = keys.reduce((v, k) => v + k.up, 0);
    checks.push({
      name: "Key transitions",
      state: !down
        ? "Not tested"
        : interrupted
          ? "Inconclusive"
          : down === up
            ? "Passed"
            : "Inconclusive",
      explanation: `${down} distinct down / ${up} up / ${keys.reduce((v, k) => v + k.repeat, 0)} repeated down messages. Counts describe observed transitions, not physical switch locations.`,
    });
    if (
      s.mode === "x-key" &&
      attempts !== null &&
      Number.isInteger(attempts) &&
      attempts >= 0 &&
      attempts <= 10000
    ) {
      const measured = s.stats.keys["88"]?.down ?? 0;
      checks.push({
        name: "Reported X attempts",
        state: interrupted
          ? "Inconclusive"
          : attempts === measured && attempts > 0
            ? "Passed"
            : attempts === measured
              ? "Not tested"
              : "Issue detected",
        explanation: `You reported ${attempts} attempts; ${measured} down transitions were measured. A mismatch is an observation discrepancy, not a confirmed defective switch. Repeat on the same source and compare a second source if available.`,
      });
    }
  }
  checks.push({
    name: "Lighting",
    state: "Not tested",
    explanation:
      "No validated model-specific lighting or physical LED feedback is available.",
  });
  return checks;
}
