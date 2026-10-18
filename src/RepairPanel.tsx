import { useState, useRef, useEffect } from "react";
import {
  proposeUnmute,
  executeAudioRepair,
  type MuteProposal,
  type RepairAudit,
} from "./bridge";
export function RepairPanel({
  targetId,
  muted,
  running,
  onVerified,
  previousAudit,
}: {
  targetId: string;
  previousAudit?: RepairAudit;
  muted: boolean | null;
  running: boolean;
  onVerified: (audit: RepairAudit) => void;
}) {
  const [proposal, setProposal] = useState<MuteProposal | null>(null),
    [audit, setAudit] = useState<RepairAudit | null>(
      previousAudit?.targetId === targetId ? previousAudit : null,
    ),
    [approved, setApproved] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  async function review() {
    setBusy(true);
    setApproved(false);
    try {
      const p = await proposeUnmute(targetId);
      if (alive.current) setProposal(p);
    } catch (e) {
      if (alive.current) setMessage(String(e));
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  async function execute(rollback = false) {
    if (!approved) return;
    setBusy(true);
    try {
      const result = await executeAudioRepair(
        rollback ? audit!.id : proposal!.id,
        approved,
        rollback,
      );
      if (alive.current) {
        setAudit(result);
        setApproved(false);
        setProposal(null);
        onVerified(result);
        setMessage(result.status);
      }
    } catch (e) {
      if (alive.current) {
        setMessage(String(e));
        setApproved(false);
        setProposal(null);
      }
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  return (
    <section aria-label="Safe audio setting repair">
      <h3>Reversible audio setting</h3>
      <p>
        Mute may be intentional. No setting changes until you review and
        explicitly approve this exact endpoint operation. Changing a setting is
        not a physical repair.
      </p>
      {muted === true && !proposal && (
        <button disabled={running || busy} onClick={() => void review()}>
          Review unmute proposal
        </button>
      )}
      {proposal && (
        <article className="finding">
          <strong>
            {proposal.name}: mute {String(proposal.beforeMute)} →{" "}
            {String(proposal.desiredMute)}
          </strong>
          <p>
            Finding: Windows currently reports this named endpoint muted. Unmute
            may restore signal only if mute is the relevant cause; other causes
            remain untested.
          </p>
          <p>{proposal.exactChange}</p>
          <p>
            Normal user permissions; no restart expected. Other applications can
            immediately receive or play sound after unmute.
          </p>
          <p>{proposal.risks}</p>
          <p>Rollback: {proposal.reversal}</p>
          <p>Verification: {proposal.verification}</p>
          <label>
            <input
              aria-label="Approve selected mute change"
              type="checkbox"
              checked={approved}
              disabled={running || busy}
              onChange={(e) => setApproved(e.target.checked)}
            />
            I approve this exact mute change for the named endpoint.
          </label>
          <button
            disabled={!approved || running || busy}
            onClick={() => void execute()}
          >
            Apply approved unmute
          </button>
          <button
            disabled={busy}
            onClick={() => {
              setProposal(null);
              setApproved(false);
              setMessage("Proposal cancelled; no setting changed.");
            }}
          >
            Cancel repair proposal
          </button>
        </article>
      )}
      {audit?.verified && !audit.rolledBack && !proposal && (
        <>
          <p>
            Setting verification completed; the original symptom is still
            unverified. Repeat the same endpoint test using the controls above.
            No playback or capture is started by this repair.
          </p>
          <p>
            The mute flag was read back as {String(audit.afterMute)}. Repeat the
            explicit functional test to check audible/input behavior.
          </p>
          <label>
            <input
              aria-label="Approve mute rollback"
              type="checkbox"
              checked={approved}
              disabled={running || busy}
              onChange={(e) => setApproved(e.target.checked)}
            />
            I approve restoring the previous mute flag.
          </label>
          <button
            disabled={!approved || running || busy}
            onClick={() => void execute(true)}
          >
            Restore previous mute
          </button>
        </>
      )}
      {message && <p>{message}</p>}
      <details>
        <summary>Stats for nerds — setting verification</summary>
        {audit ? (
          <pre>{JSON.stringify(audit, null, 2)}</pre>
        ) : (
          <p>No repair has been executed.</p>
        )}
      </details>
    </section>
  );
}
