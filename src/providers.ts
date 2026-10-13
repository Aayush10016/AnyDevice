import type { DiscoveryScope, ProviderId } from "./models";
export interface DiscoveryProvider {
  id: ProviderId;
  version: "1.0";
  operatingSystems: readonly ["Windows"];
  scopes: readonly DiscoveryScope[];
  permissions: string;
  dependencies: string;
  observations: readonly string[];
  limitations: readonly string[];
  timeoutSeconds: 45;
  cancellation: "terminate collector process";
}
const observations = [
  "present logical node IDs",
  "hardware IDs",
  "name or description",
  "class",
  "manufacturer",
  "parent",
  "location",
  "OS status",
  "problem code",
];
export const providers: readonly DiscoveryProvider[] = [
  {
    id: "windows-cfgmgr32",
    version: "1.0",
    operatingSystems: ["Windows"],
    scopes: ["usb-hid", "all-pnp"],
    permissions: "Normal user; individual properties can be denied by policy",
    dependencies: "Built-in Configuration Manager APIs",
    observations,
    limitations: [
      "Physical grouping and device-interface paths are not collected",
      "No radio discovery, stream inspection, SMART health, volume contents, protocol traffic or device writes",
    ],
    timeoutSeconds: 45,
    cancellation: "terminate collector process",
  },
  {
    id: "windows-pnp-fallback",
    version: "1.0",
    operatingSystems: ["Windows"],
    scopes: ["usb-hid"],
    permissions: "Normal user; local CIM/PnP policy can deny collection",
    dependencies: "System Windows PowerShell 5.1 and PnpDevice module",
    observations,
    limitations: [
      "USB/HID selection only",
      "Comparison fallback; not a second physical inventory",
    ],
    timeoutSeconds: 45,
    cancellation: "terminate collector process",
  },
];
