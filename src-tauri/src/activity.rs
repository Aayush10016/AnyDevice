use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
#[derive(Default, Clone)]
pub struct Activity(Arc<AtomicBool>);
pub struct Permit(Arc<AtomicBool>);
impl Activity {
    pub fn acquire(&self) -> Result<Permit, String> {
        self.0
            .compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
            .map_err(|_| {
                "Stop the active audio test or wait for the setting operation to finish"
            })?;
        Ok(Permit(self.0.clone()))
    }
}
impl Drop for Permit {
    fn drop(&mut self) {
        self.0.store(false, Ordering::Release);
    }
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn one_operation_and_release_on_failure() {
        let state = Activity::default();
        let guard = state.acquire().unwrap();
        assert!(state.acquire().is_err());
        drop(guard);
        assert!(state.acquire().is_ok());
    }
}
