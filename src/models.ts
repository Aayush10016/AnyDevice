export interface CollectionError {
  kind: "permission" | "property" | "enumeration" | "malformed";
  message: string;
  deviceId?: string;
}
export interface Device {
  id: string;
  name: string | null;
  category: string | null;
  manufacturer: string | null;
  hardwareIds: string[];
  parent: string | null;
  location: string | null;
  status: string | null;
  problemCode: number | null;
  vid: string | null;
  pid: string | null;
  transport: "USB" | "HID (transport unknown)";
  observedAt: string;
  source: string;
}
export interface Scan {
  collectedAt: string;
  os: string | null;
  devices: Device[];
  errors: CollectionError[];
  complete: boolean;
}
export interface Finding {
  id: string;
  deviceId?: string;
  title: string;
  severity: "info" | "warning" | "error";
  classification: "Windows-reported error" | "Confirmed observation";
  confidence: "high" | "limited";
  facts: string[];
  explanation: string;
  evidence: string[];
  recommendation: string;
  limitations: string;
}
export interface Report {
  schemaVersion: "1.0";
  appVersion: "0.1.0";
  collectedAt: string;
  os: string | null;
  complete: boolean;
  sanitized: boolean;
  devices: Device[];
  previous?: { collectedAt: string; devices: Device[] };
  findings: Finding[];
  errors: CollectionError[];
  limitations: string[];
}
