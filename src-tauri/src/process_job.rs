//! Fail-closed ownership of a recording/playback child, including parent process exit.
use windows_sys::Win32::{
    Foundation::{CloseHandle, HANDLE},
    System::{JobObjects::*, Threading::*},
};
pub struct ChildJob(HANDLE);
// Owned kernel job handles are not COM/thread-affine; Drop closes the unique handle.
unsafe impl Send for ChildJob {}
impl Drop for ChildJob {
    fn drop(&mut self) {
        unsafe {
            CloseHandle(self.0);
        }
    }
}
pub fn attach(pid: u32) -> Result<ChildJob, String> {
    let job = unsafe { CreateJobObjectW(std::ptr::null(), std::ptr::null()) };
    if job.is_null() {
        return Err("Cannot create bounded audio job".into());
    }
    let job = ChildJob(job);
    let mut limits: JOBOBJECT_EXTENDED_LIMIT_INFORMATION = unsafe { std::mem::zeroed() };
    limits.BasicLimitInformation.LimitFlags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;
    if unsafe {
        SetInformationJobObject(
            job.0,
            JobObjectExtendedLimitInformation,
            (&limits as *const JOBOBJECT_EXTENDED_LIMIT_INFORMATION).cast(),
            std::mem::size_of_val(&limits) as u32,
        )
    } == 0
    {
        return Err("Cannot configure audio process-exit cleanup".into());
    }
    let process = unsafe { OpenProcess(PROCESS_SET_QUOTA | PROCESS_TERMINATE, 0, pid) };
    if process.is_null() {
        return Err("Cannot own audio child".into());
    }
    let assigned = unsafe { AssignProcessToJobObject(job.0, process) };
    unsafe { CloseHandle(process) };
    if assigned == 0 {
        return Err("Cannot attach audio process-exit cleanup".into());
    }
    Ok(job)
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn closing_job_terminates_owned_idle_child_without_hardware_access() {
        use std::os::windows::process::CommandExt;
        let mut child = std::process::Command::new("powershell.exe")
            .args([
                "-NoProfile",
                "-NonInteractive",
                "-Command",
                "Start-Sleep -Seconds 30",
            ])
            .creation_flags(0x08000000)
            .stdin(std::process::Stdio::null())
            .stdout(std::process::Stdio::null())
            .stderr(std::process::Stdio::null())
            .spawn()
            .unwrap();
        let job = match attach(child.id()) {
            Ok(job) => job,
            Err(error) => {
                let _ = child.kill();
                let _ = child.wait();
                panic!("{error}");
            }
        };
        drop(job);
        for _ in 0..100 {
            if child.try_wait().unwrap().is_some() {
                return;
            }
            std::thread::sleep(std::time::Duration::from_millis(20));
        }
        let _ = child.kill();
        let _ = child.wait();
        panic!("Job close did not terminate its owned child within two seconds");
    }
}
