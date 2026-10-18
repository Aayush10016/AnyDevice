//! Exact interleaved render-buffer generation, shared by WASAPI and synthetic tests.
use crate::audio_metrics::{decode, encode, Accumulator};
pub fn consumed_frames(submitted: u64, padding: u32) -> Result<u64, String> {
    submitted
        .checked_sub(padding as u64)
        .ok_or_else(|| "Playback progress: padding exceeds submitted frames".into())
}
pub fn failure_record(reason: &str) -> serde_json::Value {
    let code = reason
        .find("0x")
        .and_then(|i| reason.get(i..i + 10))
        .filter(|s| s[2..].chars().all(|c| c.is_ascii_hexdigit()));
    serde_json::json!({"stage":reason.split(':').next().unwrap_or("Unknown"),"message":reason,"hresult":code})
}
pub fn stereo(channels: u16, mask: u32) -> bool {
    channels == 2 && (mask == 0 || mask == 3)
}
pub fn fill(
    bytes: &mut [u8],
    channels: u16,
    bits: u16,
    float: bool,
    rate: u32,
    first: u64,
    mode: &str,
    levels: &mut [Accumulator],
) -> Result<(), String> {
    if !(1..=8).contains(&channels)
        || !(8000..=384000).contains(&rate)
        || ![8, 16, 24, 32].contains(&bits)
        || float && bits != 32
        || !["left", "right", "tone"].contains(&mode)
        || mode != "tone" && channels != 2
        || levels.len() != channels as usize
    {
        return Err("Unsupported render layout".into());
    }
    let step = bits as usize / 8;
    let align = step * channels as usize;
    if !bytes.len().is_multiple_of(align) || bytes.len() > 8 * 1024 * 1024 {
        return Err("Unaligned or excessive render buffer".into());
    }
    for (frame, samples) in bytes.chunks_exact_mut(align).enumerate() {
        let phase = (first + frame as u64) as f64 / rate as f64;
        let envelope = (phase / 0.05).min(1.0) * ((3.0 - phase) / 0.05).clamp(0.0, 1.0);
        let value = 0.03 * envelope * (std::f64::consts::TAU * 440.0 * phase).sin();
        for (channel, sample) in samples.chunks_exact_mut(step).enumerate() {
            let value = if mode == "left" && channel != 0 || mode == "right" && channel != 1 {
                0.0
            } else {
                value
            };
            encode(value, sample, float)?;
            levels[channel].add(decode(sample, float)?);
        }
    }
    Ok(())
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn actual_render_buffers_isolate_channels_for_all_supported_encodings() {
        for (bits, float) in [
            (8, false),
            (16, false),
            (24, false),
            (32, false),
            (32, true),
        ] {
            for (mode, active) in [("left", 0), ("right", 1)] {
                let mut bytes = vec![0x55; 480 * 2 * bits as usize / 8];
                let mut levels = vec![Accumulator::default(); 2];
                fill(&mut bytes, 2, bits, float, 48000, 4800, mode, &mut levels).unwrap();
                assert!(levels[active].levels().peak > 0.02);
                assert_eq!(levels[1 - active].levels().peak, 0.0);
                assert_eq!(levels[1 - active].levels().zero_proportion, 1.0);
                assert_eq!(levels[active].levels().samples, 480);
            }
        }
    }
    #[test]
    fn masks_mono_malformed_and_unbounded_buffers_abstain() {
        assert!(stereo(2, 3));
        assert!(stereo(2, 0));
        assert!(!stereo(1, 0));
        assert!(!stereo(2, 12));
        assert!(fill(
            &mut [0; 4],
            1,
            32,
            true,
            48000,
            0,
            "left",
            &mut [Accumulator::default()]
        )
        .is_err());
        assert!(fill(
            &mut [0; 7],
            2,
            32,
            true,
            48000,
            0,
            "right",
            &mut vec![Accumulator::default(); 2]
        )
        .is_err());
    }
}

#[cfg(test)]
mod investigation_tests {
    use super::*;
    #[test]
    fn distinguishes_queued_frames_from_consumed_frames() {
        assert_eq!(consumed_frames(4800, 4800).unwrap(), 0);
        assert_eq!(consumed_frames(4800, 2400).unwrap(), 2400);
        assert_eq!(consumed_frames(4800, 0).unwrap(), 4800);
        assert!(consumed_frames(1, 2).is_err());
    }
    #[test]
    fn preserves_original_stage_and_hresult_without_inventing_codes() {
        let error = failure_record("Initialize shared stream: synthetic error (0x88890004)");
        assert_eq!(error["stage"], "Initialize shared stream");
        assert_eq!(error["hresult"], "0x88890004");
        assert!(failure_record("Endpoint state: unavailable")["hresult"].is_null());
    }
}
