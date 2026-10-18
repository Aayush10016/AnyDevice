import type { InputSnapshot } from "./workbench";
export interface LightingRecord {
  model: string | null;
  modelEvidence: string | null;
  modelSource: "unknown" | "label" | "manual";
  conditions: string | null;
  uniformModeCompared: boolean;
  affectedLight: "not checked" | "lit" | "dark";
  otherLights: "not checked" | "lit" | "dark";
  repeated: boolean;
  source: "Owner report; no independent illumination measurement";
}
export const emptyLighting: LightingRecord = {
  model: "",
  modelEvidence: "",
  modelSource: "unknown",
  conditions: "",
  uniformModeCompared: false,
  affectedLight: "not checked",
  otherLights: "not checked",
  repeated: false,
  source: "Owner report; no independent illumination measurement",
};
export function lightingConclusion(r: LightingRecord) {
  if (
    !r.model?.trim() ||
    !r.modelEvidence?.trim() ||
    r.modelSource === "unknown"
  )
    return "Exact model/revision evidence is missing. Identify it from the keyboard label or matching official manual before choosing lighting instructions. No model-specific operation is eligible.";
  if (
    !r.uniformModeCompared ||
    !r.repeated ||
    r.affectedLight === "not checked" ||
    r.otherLights === "not checked"
  )
    return "Model evidence is owner-supplied, not protocol validation. Record a repeated comparison using a documented consistent lighting mode; no physical finding is established yet.";
  if (r.affectedLight === "dark" && r.otherLights === "lit")
    return "You report a repeatable individual-light mismatch. Configuration/control behavior and a physical lighting fault remain possible. Windows cannot distinguish the LED, driver circuit or board. No validated automated repair is available.";
  return "Your comparison does not establish an isolated failed light or a verified repair. Keep the observation separate from input events; consult the exact model's documented controls or service support.";
}
export function LightingInvestigation({
  record,
  onRecord,
  input,
  onInput,
}: {
  record: LightingRecord | null;
  onRecord: (r: LightingRecord) => void;
  input: InputSnapshot | null;
  onInput: () => void;
}) {
  const r = record ?? emptyLighting;
  const ready =
    !!r.model?.trim() &&
    !!r.modelEvidence?.trim() &&
    r.modelSource !== "unknown";
  const set = (patch: Partial<LightingRecord>) => onRecord({ ...r, ...patch });
  const right = input?.mode === "keyboard" ? input.stats.keys["39"] : undefined;
  return (
    <details>
      <summary>
        Investigate a key light — model and right-arrow comparison
      </summary>
      <p>
        Keyboard input, physical layout, lock indicators, whole-keyboard
        backlighting, per-key RGB, vendor controls and visible illumination are
        separate capabilities.
      </p>
      <p>
        Backlight control not detected by supported interfaces. This does not
        mean a built-in or external keyboard has no backlight. Generic HID
        lock-indicator usages do not establish RGB control. No ACPI/WMI/vendor
        backlight provider is implemented.
      </p>
      <label>
        Exact keyboard model and revision
        <input
          aria-label="Keyboard model and revision"
          maxLength={160}
          value={r.model ?? ""}
          onChange={(e) =>
            set({
              model: e.target.value,
              uniformModeCompared: false,
              repeated: false,
            })
          }
        />
      </label>
      <label>
        Model evidence source
        <select
          aria-label="Model evidence source"
          value={r.modelSource}
          onChange={(e) =>
            set({
              modelSource: e.target.value as LightingRecord["modelSource"],
              uniformModeCompared: false,
              repeated: false,
            })
          }
        >
          <option value="unknown">Not identified</option>
          <option value="label">Owner read the model label</option>
          <option value="manual">Matching official manual</option>
        </select>
      </label>
      <label>
        Label text or matching official manual reference
        <input
          aria-label="Keyboard model evidence"
          maxLength={512}
          value={r.modelEvidence ?? ""}
          onChange={(e) =>
            set({
              modelEvidence: e.target.value,
              uniformModeCompared: false,
              repeated: false,
            })
          }
        />
      </label>
      <p>
        Input observation:{" "}
        {right
          ? `${right.down} right-arrow down / ${right.up} up / ${right.repeat} repeats; session ${input!.status}. These measured events do not test illumination.`
          : "No right-arrow events recorded in this workspace. This does not prove an input failure."}
      </p>
      <button onClick={onInput}>Test right-arrow input separately</button>
      <p>
        After model identification, use only its documented consistent lighting
        mode yourself. Compare the right arrow with neighboring keys and repeat.
        Do not use reset, firmware or another model's commands as a speculative
        test.
      </p>
      <fieldset disabled={!ready}>
        <legend>Owner illumination comparison</legend>
        <label>
          <input
            type="checkbox"
            checked={r.uniformModeCompared}
            onChange={(e) => set({ uniformModeCompared: e.target.checked })}
          />
          I compared a documented consistent lighting mode for this exact model
        </label>
        <label>
          Right-arrow light
          <select
            aria-label="Right-arrow light"
            value={r.affectedLight}
            onChange={(e) =>
              set({
                affectedLight: e.target
                  .value as LightingRecord["affectedLight"],
              })
            }
          >
            <option>not checked</option>
            <option>lit</option>
            <option>dark</option>
          </select>
        </label>
        <label>
          Neighboring lights
          <select
            aria-label="Neighboring lights"
            value={r.otherLights}
            onChange={(e) =>
              set({
                otherLights: e.target.value as LightingRecord["otherLights"],
              })
            }
          >
            <option>not checked</option>
            <option>lit</option>
            <option>dark</option>
          </select>
        </label>
        <label>
          Mode, power and reproduction conditions
          <textarea
            aria-label="Lighting test conditions"
            maxLength={1000}
            value={r.conditions ?? ""}
            onChange={(e) => set({ conditions: e.target.value })}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={r.repeated}
            onChange={(e) => set({ repeated: e.target.checked })}
          />
          I repeated the comparison with the same result
        </label>
      </fieldset>
      <p role="status">{lightingConclusion(r)}</p>
      <p>
        These entries are your report, stored in this workspace until it closes.
        The workbench export preserves the observation; sanitized export
        withholds model evidence and free text. No lighting command or software
        installation is offered.
      </p>
    </details>
  );
}
