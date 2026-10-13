import { useState } from "react";
import type { Candidate } from "./inventoryModel";
export function DeviceInventory({
  candidates,
  onSelect,
  stale,
}: {
  candidates: Candidate[];
  onSelect: (candidate: Candidate) => void;
  stale: boolean;
}) {
  const [view, setView] = useState("peripherals");
  const [search, setSearch] = useState("");
  const filtered = candidates
    .filter((c) =>
      view === "internal"
        ? c.placement === "Confirmed internal device"
        : view === "uncertain"
          ? c.placement === "Unknown or ambiguous"
          : view === "infrastructure"
            ? c.placement === "Supporting infrastructure"
            : c.placement.includes("external"),
    )
    .filter((c) =>
      `${c.name} ${c.category} ${c.device.manufacturer ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  const categories = [...new Set(filtered.map((c) => c.category))];
  return (
    <section aria-label="Recognisable devices">
      <h2 id="device-inventory-title" tabIndex={-1}>
        Your devices
      </h2>
      <p>
        Device candidates from Windows evidence. Receiver associations can
        contain several physical peripherals.
      </p>
      <label>
        Find a device{" "}
        <input
          aria-label="Find a device"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <div className="workbench-tabs" aria-label="Inventory views">
        {[
          ["peripherals", "External candidates"],
          ["internal", "Internal hardware"],
          ["uncertain", "Uncertain placement"],
          ["infrastructure", "Supporting infrastructure"],
        ].map(([id, label]) => (
          <button
            key={id}
            aria-pressed={view === id}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {stale && (
        <p>
          Refresh to check availability. This inventory may be incomplete or out
          of date.
        </p>
      )}
      {categories.map((category) => (
        <section key={category}>
          <h3>{category}</h3>
          <div className="device-candidates">
            {filtered
              .filter((c) => c.category === category)
              .map((c) => (
                <button
                  className="candidate-button"
                  key={c.id}
                  onClick={() => onSelect(c)}
                >
                  <strong>{c.name}</strong>
                  <span>
                    {c.device.manufacturer ?? "Manufacturer unavailable"}
                  </span>
                  <span>{c.placement}</span>
                  <small>
                    {stale
                      ? "Availability needs refresh"
                      : c.device.present === true
                        ? "Windows entry present; connection unverified"
                        : "Presence not confirmed"}{" "}
                    · {c.kind ? "Open input tests" : "Open diagnostics"}
                  </small>
                </button>
              ))}
          </div>
        </section>
      ))}
      {!filtered.length && (
        <p>
          No device candidates in this view. Check uncertain placement, run a
          full scan, or inspect the advanced Windows inventory.
        </p>
      )}
    </section>
  );
}
