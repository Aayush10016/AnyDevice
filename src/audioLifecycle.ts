import type { AudioSession } from "./audio";
export interface AudioFailure {
  stage: "Start request" | "Session observation";
  detail: string;
}
export function streamProgress(
  s: AudioSession | null,
  failure: AudioFailure | null,
  starting: boolean,
) {
  if (failure)
    return `${failure.stage} failed. No successful test is established. ${failure.stage === "Session observation" ? "Cleanup must be confirmed before retrying." : "No stream session was acknowledged; review the error and retry explicitly."}`;
  if (starting) return "Requesting the selected endpoint test…";
  if (!s)
    return "Ready — no test has been started. Select an active endpoint, allow the test, then choose a test button.";
  if (!s.cleanup)
    return s.status === "starting"
      ? "Starting the selected stream — no submitted frames confirmed yet."
      : `Stream ${s.status}; ${s.frames} frames observed. Keep AnyDevice active; Stop ends the interval.`;
  if (s.status === "completed" && s.frames > 0)
    return `Test completed; ${s.frames} frames observed and cleanup confirmed. Review measurements and your physical observation below.`;
  return `Test ${s.status}; ${s.frames} frames observed; cleanup confirmed. Review the failure or interruption below before retrying.`;
}
