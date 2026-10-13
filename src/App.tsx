import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  FileJson,
  LayoutDashboard,
  Monitor,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Usb,
  X,
  AlertTriangle,
} from "lucide-react";
import { cancelScan, discover, saveReport, openProjectPage } from "./bridge";
import { diagnose, limitations, makeReport, normalize } from "./core";
import {
  InvestigationPanel,
  BinaryPanel,
  type BinaryWorkspace,
} from "./WorkspacePanels";
import type { Investigation } from "./investigation";
import type {
  Device,
  Finding,
  Scan,
  ProviderId,
  DiscoveryScope,
} from "./models";
type Route =
  | "Overview"
  | "Devices"
  | "Diagnostics"
  | "Reports"
  | "Settings"
  | "Investigation"
  | "Binary workspace";
type Appearance = "system" | "light" | "dark";
function loadPreferences(): { appearance: Appearance; sanitize: boolean } {
  try {
    const saved = JSON.parse(
      localStorage.getItem("anydevice.preferences") ?? "{}",
    );
    return {
      appearance: ["system", "light", "dark"].includes(saved.appearance)
        ? saved.appearance
        : "system",
      sanitize: saved.sanitize !== false,
    };
  } catch {
    return { appearance: "system", sanitize: true };
  }
}
export function FindingView({ finding: f }: { finding: Finding }) {
  return (
    <article className="finding">
      <div className="finding-heading">
        <span className={`pill ${f.severity}`}>{f.severity}</span>
        <h3>{f.title}</h3>
      </div>
      <div className="eyebrow">
        {f.classification} · {f.confidence} confidence
      </div>
      <p>{f.explanation}</p>
      <ul>
        {f.facts.map((fact, i) => (
          <li key={i}>{fact}</li>
        ))}
      </ul>
      <div className="recommendation">
        <strong>Next safe test</strong>
        <p>{f.recommendation}</p>
      </div>
      <p className="muted">{f.limitations}</p>
      <details>
        <summary>Supporting evidence</summary>
        <pre>{f.evidence.join("\n")}</pre>
      </details>
    </article>
  );
}
function DeviceDetails({
  device: d,
  onClose,
}: {
  device: Device;
  onClose: () => void;
}) {
  const [copyStatus, setCopyStatus] = useState("");
  const fields = [
    ["Identity", "Logical PnP node; physical grouping unavailable"],
    ["Windows node presence", d.present === null ? null : String(d.present)],
    ["Class", d.category],
    ["Transport", d.transport],
    ["Manufacturer", d.manufacturer],
    ["Vendor / product", d.vid && d.pid ? `${d.vid} / ${d.pid}` : null],
    ["Windows status", d.status],
    ["Problem code", d.problemCode === null ? null : String(d.problemCode)],
    ["Parent", d.parent],
    ["Connection", d.location],
    ["Collected", new Date(d.observedAt).toLocaleString()],
    ["Source", d.source],
  ];
  return (
    <aside className="inspector" aria-label="Device inspection">
      <div className="row">
        <span className="eyebrow">INSPECTION</span>
        <button
          className="icon-button"
          aria-label="Close inspection"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      {d.transport === "USB" ? (
        <Usb size={28} className="accent" />
      ) : (
        <Monitor size={28} className="accent" />
      )}
      <h2>{d.name ?? "Unnamed device"}</h2>
      <p className="muted">Windows device entry</p>
      <div className="identifier">
        <code>{d.id}</code>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(d.id);
              setCopyStatus("Identifier copied");
            } catch {
              setCopyStatus(
                "Copy unavailable. Select the identifier text to copy.",
              );
            }
          }}
        >
          <Clipboard size={14} /> Copy ID
        </button>
        <small role="status">{copyStatus}</small>
      </div>
      <dl>
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value ?? "Unavailable"}</dd>
          </div>
        ))}
      </dl>
      <details>
        <summary>Hardware identifiers</summary>
        <pre>{d.hardwareIds.join("\n") || "Unavailable"}</pre>
      </details>
      <details>
        <summary>Raw normalized evidence</summary>
        <pre>{JSON.stringify(d, null, 2)}</pre>
      </details>
    </aside>
  );
}
export default function App() {
  const [provider, setProvider] = useState<ProviderId>("windows-cfgmgr32");
  const [scope, setScope] = useState<DiscoveryScope>("usb-hid");
  const [investigation, setInvestigation] = useState<Investigation>();
  const [binaryWorkspace, setBinaryWorkspace] = useState<BinaryWorkspace>({
    annotations: [],
  });
  const [route, setRoute] = useState<Route>("Overview");
  const [scan, setScan] = useState<Scan>();
  const [previous, setPrevious] = useState<Scan>();
  const [findings, setFindings] = useState<Finding[]>([]);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [message, setMessage] = useState("Ready for a read-only scan.");
  const [failure, setFailure] = useState(false);
  const [stale, setStale] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<string>();
  const [events, setEvents] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [preferences, setPreferences] = useState(loadPreferences);
  const [saving, setSaving] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () =>
      (document.documentElement.dataset.theme =
        preferences.appearance === "system"
          ? media.matches
            ? "dark"
            : "light"
          : preferences.appearance);
    apply();
    media.addEventListener("change", apply);
    try {
      localStorage.setItem(
        "anydevice.preferences",
        JSON.stringify(preferences),
      );
    } catch {
      setMessage("Preferences could not be saved locally.");
    }
    return () => media.removeEventListener("change", apply);
  }, [preferences]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setRoute("Devices");
        requestAnimationFrame(() => searchRef.current?.focus());
      }
      if (e.key === "Escape") setSelected(undefined);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    if (!scan) return;
    const timer = window.setTimeout(() => setStale(true), 60000);
    return () => clearTimeout(timer);
  }, [scan]);
  const report = useMemo(
    () =>
      scan
        ? makeReport(scan, findings, preferences.sanitize, previous)
        : undefined,
    [scan, findings, preferences.sanitize, previous],
  );
  const reportJson = report ? JSON.stringify(report, null, 2) : "";
  async function runScan() {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setFailure(false);
    setMessage("Reading present device nodes from Windows…");
    try {
      const next = normalize(await discover(provider, scope));
      const last = scan;
      setPrevious(last);
      setScan(next);
      setFindings(diagnose(next, last));
      setStale(false);
      const info = `${new Date(next.collectedAt).toLocaleTimeString()} · ${next.devices.length} entries collected${next.complete ? "" : " · partial scan"}`;
      setEvents((v) => [info, ...v].slice(0, 10));
      setMessage(
        next.complete
          ? "Scan complete. This is a point-in-time observation."
          : "Partial scan. Review collection errors before drawing conclusions.",
      );
    } catch (e) {
      setFailure(true);
      setStale(true);
      const info = e instanceof Error ? e.message : String(e);
      setMessage(info);
      setEvents((v) =>
        [`${new Date().toLocaleTimeString()} · ${info}`, ...v].slice(0, 10),
      );
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  const filtered = (scan?.devices ?? []).filter(
    (d) =>
      `${d.name ?? ""} ${d.category ?? ""} ${d.id} ${d.vid ?? ""} ${d.pid ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (category === "all" || d.category === category) &&
      (status === "all" ||
        (status === "problem"
          ? (d.problemCode ?? 0) > 0 ||
            ["ERROR", "DEGRADED"].includes(d.status?.toUpperCase() ?? "")
          : d.status?.toUpperCase() === "OK" && d.problemCode === 0)),
  );
  const problems =
    scan?.devices.filter(
      (d) =>
        (d.problemCode ?? 0) > 0 ||
        ["ERROR", "DEGRADED"].includes(d.status?.toUpperCase() ?? ""),
    ).length ?? 0;
  const device = scan?.devices.find((d) => d.id === selected);
  const navigation = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Devices", icon: Monitor },
    { name: "Diagnostics", icon: Activity },
    { name: "Investigation", icon: Activity },
    { name: "Binary workspace", icon: FileJson },
    { name: "Reports", icon: FileJson },
    { name: "Settings", icon: Settings },
  ] as const;
  const table = (
    <>
      <div className="filters">
        <div className="search">
          <Search size={16} />
          <input
            ref={searchRef}
            aria-label="Search devices"
            placeholder="Search name, class or identifier"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <kbd>Ctrl F</kbd>
        </div>
        <select
          aria-label="Filter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {[
            ...new Set(
              scan?.devices
                .map((d) => d.category)
                .filter((v): v is string => !!v),
            ),
          ]
            .sort()
            .map((c) => (
              <option key={c}>{c}</option>
            ))}
        </select>
        <select
          aria-label="Filter status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="problem">Observed problems</option>
          <option value="ok">OK, code 0</option>
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Device entry</th>
              <th>Class</th>
              <th>Windows status</th>
              <th>VID / PID</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} className={selected === d.id ? "selected" : ""}>
                <td>
                  <button
                    className="device-button"
                    onClick={() => setSelected(d.id)}
                  >
                    {d.transport === "USB" ? (
                      <Usb size={18} />
                    ) : (
                      <Monitor size={18} />
                    )}
                    <span>
                      <strong>{d.name ?? "Unnamed device"}</strong>
                      <small>{d.id}</small>
                    </span>
                    <ChevronRight size={16} />
                  </button>
                </td>
                <td>{d.category ?? "Unavailable"}</td>
                <td>
                  <span
                    className={`pill ${(d.problemCode ?? 0) > 0 || ["ERROR", "DEGRADED"].includes(d.status?.toUpperCase() ?? "") ? "error" : d.status === "OK" && d.problemCode === 0 ? "success" : "info"}`}
                  >
                    {d.status ?? "Unavailable"}
                  </span>
                  {(d.problemCode ?? 0) > 0 && (
                    <small>Code {d.problemCode}</small>
                  )}
                </td>
                <td className="mono">
                  {d.vid && d.pid ? `${d.vid} / ${d.pid}` : "Unavailable"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="empty">
            <Monitor size={32} />
            <h3>
              {scan
                ? "No matching entries"
                : "Your inventory starts with a scan"}
            </h3>
            <p>
              {scan
                ? "Adjust the filters or reconnect a device and refresh. Absence is not a diagnosis."
                : "AnyDevice reads the device information Windows exposes. No sample devices are loaded."}
            </p>
          </div>
        )}
      </div>
    </>
  );
  return (
    <div className="app-shell">
      <nav aria-label="Main navigation">
        <div className="brand">
          <span className="brand-symbol">
            <Monitor size={22} />
          </span>
          <div>
            AnyDevice<small>Understand. Diagnose. Investigate.</small>
          </div>
        </div>
        <div className="nav-items">
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              aria-current={route === name ? "page" : undefined}
              onClick={() => setRoute(name)}
            >
              <Icon size={18} />
              {name}
              {name === "Devices" && scan && <span>{scan.devices.length}</span>}
            </button>
          ))}
        </div>
        <div className="privacy">
          <ShieldCheck size={18} />
          <strong>Local by default</strong>
          <p>
            Read-only inspection.
            <br />
            Your evidence stays here.
          </p>
        </div>
      </nav>
      <div className="workspace">
        <header className="topbar">
          <span>
            AnyDevice <ChevronRight size={13} /> {route}
          </span>
          <span className="muted">
            <Monitor size={14} /> Windows · local session
          </span>
        </header>
        <div className="body-layout">
          <main>
            <div className="page-heading">
              <div>
                <div className="eyebrow">
                  UNDERSTAND. DIAGNOSE. INVESTIGATE.
                </div>
                <h1>
                  {route === "Overview"
                    ? "A clearer view of your devices"
                    : route}
                </h1>
                <p className="muted">
                  {route === "Devices"
                    ? "Inspect present device nodes reported by Windows."
                    : route === "Overview"
                      ? "Start with observations. Follow the evidence."
                      : route === "Diagnostics"
                        ? "Deterministic checks, with safe next tests and explicit limits."
                        : route === "Reports"
                          ? "Review the exact JSON before saving or sharing."
                          : route === "Investigation"
                            ? "Compare controlled observations and keep claims separate from evidence."
                            : route === "Binary workspace"
                              ? "Inspect local bytes and record reproducible hypotheses."
                              : "A small set of preferences that work."}
                </p>
              </div>
              {route !== "Settings" && route !== "Binary workspace" && (
                <button className="primary" onClick={runScan} disabled={busy}>
                  <RefreshCw size={16} className={busy ? "spin" : ""} />
                  {busy ? "Scanning…" : scan ? "Refresh scan" : "Scan devices"}
                </button>
              )}
            </div>
            <div
              className={`notice ${failure ? "error-notice" : ""}`}
              role="status"
              aria-live="polite"
            >
              {failure ? (
                <AlertTriangle size={17} />
              ) : (
                <ShieldCheck size={17} />
              )}
              <span>{message}</span>
              {busy && (
                <button
                  onClick={async () => {
                    try {
                      await cancelScan();
                      setMessage("Cancellation requested…");
                    } catch (e) {
                      setMessage(String(e));
                    }
                  }}
                >
                  Cancel scan
                </button>
              )}
            </div>
            {route === "Overview" && (
              <>
                <section className="summary">
                  <div>
                    <span className="eyebrow">LATEST OBSERVATION</span>
                    <p>
                      <strong>{scan?.devices.length ?? "—"}</strong> device
                      entries <span className="divider">/</span>{" "}
                      <strong>{scan ? problems : "—"}</strong> observed problems
                    </p>
                    <small>
                      {scan
                        ? `${new Date(scan.collectedAt).toLocaleString()} · ${scan.complete ? "Complete" : "Partial"} · ${stale ? "Stale — refresh to update" : "Recent snapshot"}`
                        : "No inventory collected yet"}
                    </small>
                  </div>
                  <button onClick={() => setRoute("Devices")}>
                    Inspect inventory <ChevronRight size={16} />
                  </button>
                </section>
                <div className="section-heading">
                  <h2>Device inventory</h2>
                  <span className="muted">Logical Windows entries</span>
                </div>
                {table}
                <section className="activity">
                  <h2>Recent activity</h2>
                  {events.length ? (
                    <ul>
                      {events.map((event, i) => (
                        <li key={i}>{event}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted">
                      Completed scans and collection errors will appear here.
                    </p>
                  )}
                </section>
                <p className="footnote">
                  AnyDevice inspects PnP status and properties. It cannot
                  determine battery health, charging circuitry or Bluetooth
                  status.
                </p>
              </>
            )}
            {route === "Devices" && (
              <>
                {scan && (
                  <p className="snapshot">
                    {scan
                      ? `${scan.provider} / ${scan.scope} / ${scan.collectedAt} - `
                      : ""}
                    Collected {new Date(scan.collectedAt).toLocaleString()} ·{" "}
                    {scan.complete ? "Complete" : "Partial"} ·{" "}
                    {stale
                      ? "Stale — refresh required"
                      : "Recent snapshot; devices may have changed since collection"}
                  </p>
                )}
                {table}
              </>
            )}
            {route === "Diagnostics" && (
              <>
                {!scan ? (
                  <div className="empty">
                    <Activity size={32} />
                    <h3>Collect evidence first</h3>
                    <p>Run a scan to evaluate supported checks.</p>
                  </div>
                ) : findings.length ? (
                  findings.map((f) => <FindingView key={f.id} finding={f} />)
                ) : (
                  <div className="empty">
                    <CheckCircle2 size={32} />
                    <h3>No supported findings triggered</h3>
                    <p>
                      This does not establish complete device health. Only
                      exposed PnP evidence was checked.
                    </p>
                  </div>
                )}
                <section className="activity">
                  <h2>Inspection limits</h2>
                  <ul>
                    {limitations.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </section>
              </>
            )}
            {route === "Reports" && (
              <>
                <section className="report-controls">
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences.sanitize}
                      onChange={(e) =>
                        setPreferences((p) => ({
                          ...p,
                          sanitize: e.target.checked,
                        }))
                      }
                    />{" "}
                    Sanitize identifiers and free-text metadata
                  </label>
                  <p className="muted">
                    Sanitized reports remove instance IDs, names, hardware IDs,
                    parents, locations and detailed error text. VID/PID and
                    timestamps remain. Review these before sharing.
                  </p>
                  <button
                    disabled={!report || saving || busy}
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const path = await saveReport(reportJson);
                        if (path) {
                          setSaved((v) => [path, ...v]);
                          setMessage("Report saved locally.");
                        } else setMessage("Save cancelled.");
                      } catch (e) {
                        setMessage(String(e));
                        setFailure(true);
                      } finally {
                        setSaving(false);
                      }
                    }}
                  >
                    <ArrowDownToLine size={16} />{" "}
                    {saving ? "Saving…" : "Save JSON report"}
                  </button>
                </section>
                {report ? (
                  <pre className="report-preview" aria-label="Report preview">
                    {reportJson}
                  </pre>
                ) : (
                  <div className="empty">
                    <FileJson size={32} />
                    <h3>No report to preview</h3>
                    <p>Scan devices to create a report.</p>
                  </div>
                )}
                {saved.length > 0 && (
                  <section className="activity">
                    <h2>Saved this session</h2>
                    <ul>
                      {saved.map((path, i) => (
                        <li className="mono" key={i}>
                          {path}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}
            {route === "Investigation" && (
              <InvestigationPanel
                scan={scan}
                sanitized={preferences.sanitize}
                session={investigation}
                onSession={setInvestigation}
              />
            )}
            {route === "Binary workspace" && (
              <BinaryPanel
                sanitized={preferences.sanitize}
                workspace={binaryWorkspace}
                onWorkspace={setBinaryWorkspace}
              />
            )}
            {route === "Settings" && (
              <>
                <section className="setting">
                  <h2>Discovery modules</h2>
                  <label className="field">
                    Discovery provider
                    <select
                      disabled={busy}
                      value={provider}
                      onChange={(e) => {
                        setProvider(e.target.value as ProviderId);
                        setScope("usb-hid");
                        setStale(true);
                      }}
                    >
                      <option value="windows-cfgmgr32">
                        Native Windows Configuration Manager
                      </option>
                      <option value="windows-pnp-fallback">
                        PowerShell PnpDevice comparison fallback
                      </option>
                    </select>
                  </label>
                  <label className="field">
                    Inventory scope
                    <select
                      disabled={busy}
                      value={scope}
                      onChange={(e) => {
                        setScope(e.target.value as DiscoveryScope);
                        setStale(true);
                      }}
                    >
                      <option value="usb-hid">Present USB and HID nodes</option>
                      {provider === "windows-cfgmgr32" && (
                        <option value="all-pnp">
                          All present Windows PnP nodes
                        </option>
                      )}
                    </select>
                  </label>
                  <p>
                    Native provider: no PowerShell dependency or administrator
                    elevation. Broader inventory exposes Windows classes such as
                    Bluetooth, audio, cameras, network and storage when present.
                    It does not inspect radio connections, audio streams,
                    storage health or volume contents. No ADB or recovery module
                    is enabled.
                  </p>
                  <p>
                    Source and scope of the displayed inventory:{" "}
                    {scan
                      ? `${scan.provider} / ${scan.scope} / ${scan.collectedAt}`
                      : "No scan yet"}
                    . Changing a setting requires a new scan.
                  </p>
                </section>
                <section className="setting">
                  <h2>Appearance</h2>
                  <p className="muted">
                    System follows your Windows light or dark preference.
                  </p>
                  <div className="segmented">
                    {(["system", "light", "dark"] as const).map((a) => (
                      <button
                        key={a}
                        aria-pressed={preferences.appearance === a}
                        onClick={() =>
                          setPreferences((p) => ({ ...p, appearance: a }))
                        }
                      >
                        {a[0].toUpperCase() + a.slice(1)}
                      </button>
                    ))}
                  </div>
                </section>
                <section className="setting">
                  <h2>Privacy & reports</h2>
                  <p>
                    Scans stay in memory. Reports are saved only when you choose
                    a location. Preferences are stored locally. No telemetry,
                    accounts, cloud processing or external AI is used.
                  </p>
                  <label>
                    <input
                      type="checkbox"
                      checked={preferences.sanitize}
                      onChange={(e) =>
                        setPreferences((p) => ({
                          ...p,
                          sanitize: e.target.checked,
                        }))
                      }
                    />{" "}
                    Sanitize reports by default
                  </label>
                </section>
                <section className="setting">
                  <h2>About AnyDevice</h2>
                  <p>Version 0.2.0 · Windows 10/11 x64</p>
                  <p>
                    MIT License · AnyDevice contributors. React (MIT), Tauri
                    (MIT/Apache-2.0), Lucide (ISC), rfd (MIT). System font:
                    Segoe UI.
                  </p>
                  <p>
                    Documentation and the master specification are included with
                    the source. Repository: Aayush10016/AnyDevice.
                  </p>
                  <div className="segmented">
                    {(["repository", "documentation", "license"] as const).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={async () => {
                            try {
                              await openProjectPage(page);
                            } catch (e) {
                              setMessage(String(e));
                              setFailure(true);
                            }
                          }}
                        >
                          {page[0].toUpperCase() + page.slice(1)}
                        </button>
                      ),
                    )}
                  </div>
                </section>
              </>
            )}
          </main>
          {device && (route === "Devices" || route === "Overview") && (
            <DeviceDetails
              key={device.id}
              device={device}
              onClose={() => setSelected(undefined)}
            />
          )}
        </div>
        <footer>
          <span>
            <span className={`dot ${busy ? "active" : ""}`} />
            {busy
              ? "Collecting evidence"
              : scan
                ? `${scan.devices.length} entries · ${stale ? "stale" : scan.complete ? "complete snapshot" : "partial snapshot"}`
                : "No scan yet"}
          </span>
          <span>Read-only · No elevated repairs</span>
        </footer>
      </div>
    </div>
  );
}
