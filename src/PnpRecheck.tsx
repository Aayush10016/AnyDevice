import { useEffect, useRef, useState } from "react";
import type { DiagnosticCheck } from "./diagnosticEngine";
import { probeDevice } from "./bridge";
import { recheckedPnp } from "./deviceStatus";
export function PnpRecheck({
  check,
  disabled,
  onResult,
}: {
  check: DiagnosticCheck;
  disabled: boolean;
  onResult: (before: DiagnosticCheck, after: DiagnosticCheck) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const mounted = useRef(true);
  const active = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return (
    <div>
      <button
        disabled={disabled || pending}
        onClick={async () => {
          if (active.current) return;
          active.current = true;
          setPending(true);
          setError("");
          try {
            const result = recheckedPnp(check, await probeDevice(check.target));
            if (mounted.current) onResult(check, result);
          } catch (e) {
            if (mounted.current) setError(String(e));
          } finally {
            active.current = false;
            if (mounted.current) setPending(false);
          }
        }}
      >
        {pending ? "Reading current Windows status…" : "Recheck Windows status"}
      </button>
      <p>
        Read-only: checks this exact logical node. No device, driver or service
        is changed. A clear Windows status still needs a separate functional
        test.
      </p>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
