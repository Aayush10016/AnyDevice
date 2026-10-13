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
