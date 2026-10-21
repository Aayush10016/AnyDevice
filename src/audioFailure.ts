// Match documented Windows HRESULTs; never infer a hardware defect from them.
export function audioFailureDiagnosis(reason: string) {
  const code = reason.match(/\b0x[0-9a-f]{8}\b/i)?.[0].toUpperCase() ?? null;
  const details: Record<string, [string, string]> = {
    "0X88890004": [
      "Windows invalidated the selected audio endpoint after removal or reconfiguration.",
      "Refresh endpoints, select the same device only if active, and start a new explicitly approved test.",
    ],
    "0X8889000A": [
      "Windows reports the audio endpoint is in use under an incompatible access mode.",
      "Close the application using exclusive audio, then retry this exact endpoint. AnyDevice has not closed another application.",
    ],
    "0X88890008": [
      "Windows rejected the requested audio format.",
      "Inspect the reported shared format and refresh the endpoint; do not replace drivers or claim device damage from this error.",
    ],
    "0X88890010": [
      "Windows reports that its audio service is not running.",
      "Review the required audio-service status and exit codes. No service restart has been performed.",
    ],
    "0X80070005": [
      "Windows denied access to this audio operation.",
      "For recording, review Windows microphone privacy access for desktop apps; also review the exact endpoint and original failure stage. No permission setting was changed.",
    ],
    "0X80070490": [
      "The requested Windows audio target could not be found.",
      "Refresh endpoints and reselect an active target before explicitly retrying.",
    ],
  };
  if (code && details[code])
    return { code, explanation: details[code][0], nextStep: details[code][1] };
  if (reason.startsWith("Decode audio measurement/status packet:"))
    return {
      code,
      explanation:
        "The application could not decode the native audio evidence packet.",
      nextStep:
        "Keep the original decoder error for investigation; this failure does not diagnose the speaker or microphone.",
    };
  return {
    code,
    explanation:
      "The native request or stream did not complete; the exact stage and original error remain in advanced evidence.",
    nextStep:
      "Use that original error to investigate the failed stage; an unknown error does not justify changing drivers or settings.",
  };
}
