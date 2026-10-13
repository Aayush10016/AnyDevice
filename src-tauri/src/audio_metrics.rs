//! Numerical summaries only: no recorded samples leave the WASAPI buffer.
use serde::{Deserialize, Serialize};
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Levels {
    pub samples: u64,
    pub rms: f64,
    pub rms_dbfs: f64,
    pub peak: f64,
    pub clipping_proportion: f64,
    pub zero_proportion: f64,
    pub invalid_samples: u64,
}
#[derive(Clone, Default)]
pub struct Accumulator {
    n: u64,
    energy: f64,
    peak: f64,
    clipped: u64,
    zeros: u64,
    invalid: u64,
}
pub fn dbfs(value: f64) -> f64 {
    if value > 0.0 {
        (20.0 * value.log10()).max(-120.0)
    } else {
        -120.0
    }
}
impl Accumulator {
    pub fn add(&mut self, value: f64) {
        if !value.is_finite() {
            self.invalid += 1;
            return;
        }
        self.n += 1;
        self.energy += value * value;
        self.peak = self.peak.max(value.abs());
        self.clipped += u64::from(value.abs() >= 0.999);
        self.zeros += u64::from(value == 0.0);
    }
    pub fn levels(&self) -> Levels {
        let rms = if self.n > 0 {
            (self.energy / self.n as f64).sqrt()
        } else {
            0.0
        };
        Levels {
            samples: self.n,
            rms,
            rms_dbfs: dbfs(rms),
            peak: self.peak,
            clipping_proportion: if self.n > 0 {
                self.clipped as f64 / self.n as f64
            } else {
                0.0
            },
            zero_proportion: if self.n > 0 {
                self.zeros as f64 / self.n as f64
            } else {
                0.0
            },
            invalid_samples: self.invalid,
        }
    }
}
pub fn decode(bytes: &[u8], float: bool) -> Result<f64, String> {
    Ok(match (float, bytes.len()) {
        (true, 4) => {
            f32::from_le_bytes(bytes.try_into().map_err(|_| "Invalid float sample")?) as f64
        }
        (false, 1) => (bytes[0] as f64 - 128.0) / 128.0,
        (false, 2) => {
            i16::from_le_bytes(bytes.try_into().map_err(|_| "Invalid PCM sample")?) as f64 / 32768.0
        }
        (false, 3) => {
            let v = i32::from_le_bytes([
                bytes[0],
                bytes[1],
                bytes[2],
                if bytes[2] & 128 != 0 { 255 } else { 0 },
            ]);
            v as f64 / 8388608.0
        }
        (false, 4) => {
            i32::from_le_bytes(bytes.try_into().map_err(|_| "Invalid PCM sample")?) as f64
                / 2147483648.0
        }
        _ => return Err("Unsupported sample representation".into()),
    })
}
pub fn encode(value: f64, bytes: &mut [u8], float: bool) -> Result<(), String> {
    let v = value.clamp(-1.0, 1.0);
    match (float, bytes.len()) {
        (true, 4) => bytes.copy_from_slice(&(v as f32).to_le_bytes()),
        (false, 1) => bytes[0] = (v * 127.0 + 128.0).round() as u8,
        (false, 2) => bytes.copy_from_slice(&((v * 32767.0).round() as i16).to_le_bytes()),
        (false, 3) => bytes.copy_from_slice(&((v * 8388607.0).round() as i32).to_le_bytes()[..3]),
        (false, 4) => bytes.copy_from_slice(&((v * 2147483647.0).round() as i32).to_le_bytes()),
        _ => return Err("Unsupported sample representation".into()),
    };
    Ok(())
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn synthetic_silence_sine_clipping_and_invalid_samples() {
        let mut s = Accumulator::default();
        for _ in 0..4800 {
            s.add(0.0)
        }
        assert_eq!(s.levels().zero_proportion, 1.0);
        assert_eq!(s.levels().rms_dbfs, -120.0);
        let mut sine = Accumulator::default();
        for i in 0..48000 {
            sine.add(0.5 * (std::f64::consts::TAU * i as f64 * 1000.0 / 48000.0).sin())
        }
        assert!((sine.levels().rms - 0.5 / 2.0f64.sqrt()).abs() < 0.00001);
        let mut clipped = Accumulator::default();
        clipped.add(1.0);
        clipped.add(-1.0);
        clipped.add(0.0);
        clipped.add(f64::NAN);
        assert_eq!(clipped.levels().invalid_samples, 1);
        assert!((clipped.levels().clipping_proportion - 2.0 / 3.0).abs() < 0.00001);
    }
    #[test]
    fn pcm_bounds_roundtrip_and_unsupported_formats() {
        for bits in [1, 2, 3, 4] {
            for x in [-0.5, 0.0, 0.5] {
                let mut bytes = vec![0; bits];
                encode(x, &mut bytes, false).unwrap();
                assert!((decode(&bytes, false).unwrap() - x).abs() < 0.01);
            }
        }
        assert!(decode(&[0; 8], true).is_err());
        let mut f = [0; 4];
        encode(0.25, &mut f, true).unwrap();
        assert_eq!(decode(&f, true).unwrap(), 0.25);
    }
    #[test]
    fn labelled_uniform_digital_noise_has_expected_energy_without_quality_verdict() {
        let mut noise = Accumulator::default();
        // Synthetic uniform distribution, not recorded ambient audio.
        for i in 0..10001 {
            noise.add((i as f64 / 10000.0 * 2.0 - 1.0) * 0.05);
        }
        let level = noise.levels();
        assert!((level.rms - 0.05 / 3.0f64.sqrt()).abs() < 0.00001);
        assert_eq!(level.clipping_proportion, 0.0);
        assert_eq!(level.peak, 0.05);
    }
}
