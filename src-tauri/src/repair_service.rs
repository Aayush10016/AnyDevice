//! The only write provider is endpoint mute; approved nonce, re-read, readback, reversible.
use serde::Serialize;
use std::{
    sync::{
        atomic::{AtomicU64, Ordering},
        Mutex,
    },
    time::{Duration, Instant},
};
use tokio_util::sync::CancellationToken;
#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Proposal {
    pub id: u64,
    pub target_id: String,
    pub name: String,
    pub before_mute: bool,
    pub desired_mute: bool,
    pub exact_change: String,
    pub risks: String,
    pub reversal: String,
    pub verification: String,
}
struct Pending {
    proposal: Proposal,
    at: Instant,
}
#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Audit {
    pub id: u64,
    pub target_id: String,
    pub approved: bool,
    pub before_mute: bool,
    pub desired_mute: bool,
    pub after_mute: Option<bool>,
    pub verified: bool,
    pub rolled_back: bool,
    pub status: String,
}
#[derive(Default)]
pub struct RepairState(Mutex<Inner>);
#[derive(Default)]
struct Inner {
    pending: Option<Pending>,
    last: Option<Audit>,
    busy: bool,
}
static NEXT: AtomicU64 = AtomicU64::new(1);
fn approval(approved: bool, id: u64, expected: u64, expired: bool) -> Result<(), String> {
    if !approved {
        return Err("Explicit approval required for this setting change".into());
    }
    if id != expected || expired {
        return Err("Proposal obsolete or expired; prepare a fresh proposal".into());
    }
    Ok(())
}
#[tauri::command]
pub async fn propose_audio_unmute(
    state: tauri::State<'_, RepairState>,
    target_id: String,
) -> Result<Proposal, String> {
    let value = crate::audio_service::read_inventory().await?;
    let endpoint = value["endpoints"]
        .as_array()
        .and_then(|list| list.iter().find(|e| e["id"] == target_id))
        .ok_or("Endpoint not found")?;
    if endpoint["state"] != "active" || endpoint["mute"] != true {
        return Err("A currently active, Windows-reported muted endpoint is required".into());
    }
    let proposal=Proposal{id:NEXT.fetch_add(1,Ordering::Relaxed),target_id,name:endpoint["name"].as_str().unwrap_or("Selected endpoint").chars().take(2048).collect(),before_mute:true,desired_mute:false,exact_change:"Set only the selected endpoint mute flag from true to false; volume, defaults, drivers and processing remain unchanged.".into(),risks:"Other applications using this endpoint may receive/play sound. Muting may have been intentional. No audio test starts automatically. Normally no administrator privileges; Windows policy may reject the change.".into(),reversal:"Approve rollback to the original mute flag, only while the setting still matches our verified change.".into(),verification:"Re-read the same endpoint mute flag, then explicitly repeat a functional test. Setting readback does not prove audible sound or repair static.".into()};
    let mut inner = state.0.lock().map_err(|_| "Repair state unavailable")?;
    if inner.busy {
        return Err("A repair is active".into());
    }
    inner.pending = Some(Pending {
        proposal: proposal.clone(),
        at: Instant::now(),
    });
    Ok(proposal)
}
async fn change(id: &str, before: bool, after: bool) -> Result<serde_json::Value, String> {
    let mut command =
        tokio::process::Command::new(std::env::current_exe().map_err(|e| e.to_string())?);
    command.args([
        "--approved-audio-mute",
        id,
        if before { "true" } else { "false" },
        if after { "true" } else { "false" },
        &std::process::id().to_string(),
    ]);
    crate::run_adapter(command, CancellationToken::new(), Duration::from_secs(10)).await
}
#[tauri::command]
pub async fn execute_audio_repair(
    state: tauri::State<'_, RepairState>,
    activity: tauri::State<'_, crate::activity::Activity>,
    proposal_id: u64,
    approved: bool,
    rollback: bool,
) -> Result<Audit, String> {
    let _permit = activity.acquire()?;
    let (target, before, desired) = {
        let mut inner = state.0.lock().map_err(|_| "Repair state unavailable")?;
        if inner.busy {
            return Err("A repair is active".into());
        }
        let args = if rollback {
            let last = inner
                .last
                .as_ref()
                .ok_or("No verified repair to roll back")?;
            approval(approved, proposal_id, last.id, false)?;
            if !last.verified || last.rolled_back {
                return Err("Rollback requires a verified, unchanged previous operation".into());
            }
            (last.target_id.clone(), last.desired_mute, last.before_mute)
        } else {
            let p = inner
                .pending
                .as_ref()
                .ok_or("Prepare a repair proposal first")?;
            approval(
                approved,
                proposal_id,
                p.proposal.id,
                p.at.elapsed() > Duration::from_secs(120),
            )?;
            (
                p.proposal.target_id.clone(),
                p.proposal.before_mute,
                p.proposal.desired_mute,
            )
        };
        inner.busy = true;
        inner.pending = None;
        args
    };
    let result = change(&target, before, desired).await;
    let after = result.as_ref().ok().and_then(|v| v["afterMute"].as_bool());
    let verified = after == Some(desired);
    let audit = Audit {
        id: proposal_id,
        target_id: target,
        approved: true,
        before_mute: before,
        desired_mute: desired,
        after_mute: after,
        verified,
        rolled_back: rollback && verified,
        status: if verified {
            "Setting readback verified; physical function not verified".into()
        } else {
            format!(
                "Setting outcome unverified; inspect Windows settings before proceeding: {}",
                result.err().unwrap_or_else(|| "readback differed".into())
            )
        },
    };
    let mut inner = state.0.lock().map_err(|_| "Repair state unavailable")?;
    inner.busy = false;
    inner.last = Some(audit.clone());
    Ok(audit)
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn consent_stale_nonce_and_expired_proposals_fail_closed() {
        assert!(approval(false, 4, 4, false).is_err());
        assert!(approval(true, 5, 4, false).is_err());
        assert!(approval(true, 4, 4, true).is_err());
        assert!(approval(true, 4, 4, false).is_ok());
    }
}
