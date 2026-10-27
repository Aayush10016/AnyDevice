// This registry describes supported operations. Native authorization/readback
// remains the execution boundary; a UI eligibility result grants no approval.
export const repairProviders = [
  {
    id: "audio-endpoint-mute-v1",
    setting: "Selected Windows endpoint mute flag",
    permission: "Normal user; endpoint policy may deny access",
    sideEffects: "Other applications may immediately play or receive sound",
    rollback:
      "Restore the recorded mute flag after separate approval and state recheck",
    verification:
      "Read back mute, repeat the same functional test, record user outcome separately",
  },
] as const;
export function muteEligibility(e: { state: unknown; mute: unknown }) {
  if (e.state !== "active")
    return {
      eligible: false,
      reason:
        "Endpoint is unavailable; reconnect or enable it manually and refresh.",
    };
  if (e.mute !== true)
    return {
      eligible: false,
      reason: "A current muted state has not been established.",
    };
  return {
    eligible: true,
    reason:
      "A reversible unmute proposal can be reviewed if this mute is unwanted. Native execution must recheck the exact target and initial state.",
  };
}
