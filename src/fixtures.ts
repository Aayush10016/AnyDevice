// SYNTHETIC TEST FIXTURES ONLY. Never imported by the production UI.
export const healthyMouse = {
  instanceId: "USB\\VID_046D&PID_C077\\SYNTHETIC-SERIAL",
  name: "Synthetic USB mouse",
  category: "Mouse",
  manufacturer: "Synthetic vendor",
  hardwareIds: ["USB\\VID_046D&PID_C077"],
  status: "OK",
  problemCode: 0,
  parent: "USB\\SYNTHETIC-HUB",
  location: "Synthetic Port 1",
};
export const windowsProblem = {
  ...healthyMouse,
  instanceId: "USB\\VID_1234&PID_5678\\SYNTHETIC-PROBLEM",
  name: "Synthetic problem device",
  status: "ERROR",
  problemCode: 43,
};
export const incompleteMetadata = {
  instanceId: "USB\\VID_ABCD&PID_0001\\SYNTHETIC-INCOMPLETE",
};
export const insufficientEvidence = {
  ...healthyMouse,
  instanceId: "USB\\VID_1111&PID_2222\\SYNTHETIC-UNKNOWN",
  status: "UNKNOWN",
  problemCode: null,
};
export const androidIssue = {
  ...healthyMouse,
  instanceId: "USB\\VID_18D1&PID_4EE1\\SYNTHETIC-ANDROID",
  name: "Synthetic Android connection",
  category: "USBDevice",
  hardwareIds: ["USB\\VID_18D1&PID_4EE1"],
  status: "ERROR",
  problemCode: 10,
};
export const fixtureScan = (
  devices: unknown[] = [],
  errors: unknown[] = [],
  complete = true,
) => ({
  collectedAt: "2026-01-01T12:00:00.000Z",
  os: "Synthetic Windows fixture",
  devices,
  errors,
  complete,
});
