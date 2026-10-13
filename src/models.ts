export interface CollectionError {
  kind: "permission" | "property" | "enumeration" | "malformed";
  message: string;
  deviceId?: string;
}
export interface Device {
  nodeKind: "logical-pnp-node";
  physicalDeviceId: null;
  interfacePaths: string[];
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
  transport: "USB" | "HID (transport unknown)" | "Unknown";
  observedAt: string;
  source: string;
}
export type ProviderId = "windows-cfgmgr32" | "windows-pnp-fallback";
export type DiscoveryScope = "usb-hid" | "all-pnp";
export interface Provenance {
  provider: ProviderId;
  providerVersion: string;
  scope: DiscoveryScope;
}
export interface Scan extends Provenance {
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
  schemaVersion: "2.0";
  appVersion: "0.2.0";
  provenance: Provenance;
  collectedAt: string;
  os: string | null;
  complete: boolean;
  sanitized: boolean;
  devices: Device[];
  previous?: {
    collectedAt: string;
    devices: Device[];
    provenance: Provenance;
    complete: boolean;
  };
  findings: Finding[];
  errors: CollectionError[];
  limitations: string[];
}
