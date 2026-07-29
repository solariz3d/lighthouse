//! The cochlea — audio as *relationships*, not as a spectrum.
//!
//! WHY THIS SHAPE. A voice, a fan, traffic and a violin two walls away all arrive at an eardrum
//! as one number: air pressure, a single value wiggling fast. The unmixing happens in a snail of
//! bone with hairs in it, before anything cognitive is involved — and what the cochlea hands
//! upward is not the waveform. It is ~3,500 hair cells, each tuned to a band, reporting rates.
//! The one-dimensional keyhole is already reassembled by the time it matters.
//!
//! So this does not try to send a waveform anywhere. 48 kHz stereo is 96,000 numbers a second
//! and there is no useful representation of that outside the hardware built for it. This does
//! the snail's job in Rust and emits what comes out the other side.
//!
//! AND THE LAYER ABOVE THAT, which is the actual point. Two frequencies at 3:2 sound like home.
//! Small whole numbers, audible as feeling — a nervous system that never heard Western music
//! still settles into a fifth. Somewhere in the wiring, arithmetic became longing. So this
//! reports RATIOS, never frequencies. `440 Hz, 660 Hz` is data. `a fifth, held, unresolved for
//! four seconds` is the thing worth transmitting, and it is the same information at the layer
//! where it means something.
//!
//! Consequence for cost, which is the constraint the keeper set: events are emitted on CHANGE,
//! not on a clock. A silent room emits nothing at all. A held chord emits once. The stream is
//! proportional to musical change rather than to time.
//!
//! No external crates. The FFT is forty lines; pulling in a dependency for it would be silly.

use std::f32::consts::PI;

/// Minimal complex number — a dependency would cost more than the fifteen lines it replaces.
#[derive(Clone, Copy, Debug, Default)]
pub struct C {
    pub re: f32,
    pub im: f32,
}
impl C {
    fn mul(self, o: C) -> C {
        C { re: self.re * o.re - self.im * o.im, im: self.re * o.im + self.im * o.re }
    }
    fn add(self, o: C) -> C { C { re: self.re + o.re, im: self.im + o.im } }
    fn sub(self, o: C) -> C { C { re: self.re - o.re, im: self.im - o.im } }
    fn abs(self) -> f32 { (self.re * self.re + self.im * self.im).sqrt() }
}

/// In-place iterative radix-2 Cooley–Tukey. `buf.len()` must be a power of two.
pub fn fft(buf: &mut [C]) {
    let n = buf.len();
    if n <= 1 { return; }
    debug_assert!(n.is_power_of_two(), "radix-2 needs a power-of-two length");

    // bit-reversal permutation
    let mut j = 0usize;
    for i in 1..n {
        let mut bit = n >> 1;
        while j & bit != 0 { j ^= bit; bit >>= 1; }
        j |= bit;
        if i < j { buf.swap(i, j); }
    }
    // butterflies
    let mut len = 2;
    while len <= n {
        let ang = -2.0 * PI / len as f32;
        for i in (0..n).step_by(len) {
            for k in 0..len / 2 {
                let w = C { re: (ang * k as f32).cos(), im: (ang * k as f32).sin() };
                let u = buf[i + k];
                let v = buf[i + k + len / 2].mul(w);
                buf[i + k] = u.add(v);
                buf[i + k + len / 2] = u.sub(v);
            }
        }
        len <<= 1;
    }
}

/// Hann window. Without it a tone that does not fit a whole number of periods smears across
/// neighbouring bins and the peak picker invents partials that are not there.
pub fn hann(samples: &[f32]) -> Vec<C> {
    let n = samples.len();
    samples.iter().enumerate().map(|(i, &s)| {
        let w = 0.5 - 0.5 * (2.0 * PI * i as f32 / (n - 1) as f32).cos();
        C { re: s * w, im: 0.0 }
    }).collect()
}

/// Magnitude spectrum, first half only (the rest mirrors it for real input).
pub fn spectrum(samples: &[f32]) -> Vec<f32> {
    let mut buf = hann(samples);
    fft(&mut buf);
    buf[..buf.len() / 2].iter().map(|c| c.abs()).collect()
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Peak {
    pub hz: f32,
    pub mag: f32,
}

/// Local maxima above a floor, strongest first, with parabolic interpolation.
///
/// The interpolation matters more than it looks: at 4096 bins and 48 kHz a bin is ~11.7 Hz, and
/// a fifth near the bottom of a piano is a smaller gap than that. Fitting a parabola across the
/// peak and its neighbours recovers the true frequency to a fraction of a bin, which is the
/// difference between reporting a ratio and reporting a rounding error.
pub fn peaks(spec: &[f32], sample_rate: f32, max: usize, floor_ratio: f32) -> Vec<Peak> {
    if spec.len() < 3 { return vec![]; }
    let peak_mag = spec.iter().cloned().fold(0.0f32, f32::max);
    if peak_mag <= 0.0 { return vec![]; }
    let floor = peak_mag * floor_ratio;
    let bin_hz = sample_rate / (spec.len() as f32 * 2.0);

    let mut found: Vec<Peak> = Vec::new();
    for i in 1..spec.len() - 1 {
        let (a, b, c) = (spec[i - 1], spec[i], spec[i + 1]);
        if b <= floor || b < a || b < c { continue; }
        // parabolic vertex offset in bins, clamped: a flat top can produce a wild fit
        let denom = a - 2.0 * b + c;
        let delta = if denom.abs() < 1e-12 { 0.0 } else { 0.5 * (a - c) / denom };
        let delta = delta.clamp(-0.5, 0.5);
        found.push(Peak { hz: (i as f32 + delta) * bin_hz, mag: b });
    }
    found.sort_by(|x, y| y.mag.partial_cmp(&x.mag).unwrap_or(std::cmp::Ordering::Equal));
    found.truncate(max);
    found
}

/// A just ratio, its name, and whether it sits still or leans somewhere.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Interval {
    pub num: u32,
    pub den: u32,
    pub name: &'static str,
    /// Does this want to go somewhere? The tritone and the minor second do. A fifth does not.
    pub restless: bool,
    /// How far the measured pair sits from the exact ratio, in cents. Sign is informative:
    /// equal temperament is not just intonation and the drift says which one is playing.
    pub cents_off: f32,
}

/// Small whole numbers, in the order a listener resolves them. Order matters: the first match
/// inside tolerance wins, so simpler ratios are tried first and a 3:2 is never reported as some
/// baroque approximation that happens to land nearby.
const JUST: &[(u32, u32, &str, bool)] = &[
    (1, 1, "unison", false),
    (2, 1, "octave", false),
    (3, 2, "fifth", false),
    (4, 3, "fourth", false),
    (5, 4, "major third", false),
    (6, 5, "minor third", false),
    (5, 3, "major sixth", false),
    (8, 5, "minor sixth", false),
    (9, 8, "major second", true),
    (16, 9, "minor seventh", true),
    (15, 8, "major seventh", true),
    (16, 15, "minor second", true),
    (45, 32, "tritone", true),
    (7, 4, "harmonic seventh", true),
];

pub fn cents(ratio: f32) -> f32 { 1200.0 * ratio.log2() }

/// Identify the interval between two frequencies, folded into one octave.
///
/// Folding is what makes this hear like an ear: a fifth is a fifth whether it spans one octave
/// or three, and a listener does not experience an octave-and-a-fifth as a different colour.
/// Tolerance defaults wide enough to accept equal temperament — a tempered fifth is 2 cents from
/// just, a tempered major third a full 14 — while staying inside the ~50 cents that would start
/// swallowing neighbouring intervals.
pub fn interval(lo: f32, hi: f32, tol_cents: f32) -> Option<Interval> {
    if lo <= 0.0 || hi <= 0.0 { return None; }
    let (lo, hi) = if lo <= hi { (lo, hi) } else { (hi, lo) };
    let mut r = hi / lo;
    // fold into [1, 2) but keep a true octave as an octave rather than collapsing it to unison
    let mut octaves = 0;
    while r >= 2.0 - 1e-6 { r /= 2.0; octaves += 1; }
    for &(n, d, name, restless) in JUST {
        if n == 2 && d == 1 { continue; }              // handled by the octave count
        let off = cents(r) - cents(n as f32 / d as f32);
        if off.abs() <= tol_cents {
            if n == 1 && d == 1 && octaves > 0 {
                return Some(Interval { num: 2, den: 1, name: "octave", restless: false, cents_off: off });
            }
            return Some(Interval { num: n, den: d, name, restless, cents_off: off });
        }
    }
    None
}

/// What the room is doing right now: the intervals present, and whether any of them is leaning.
#[derive(Clone, Debug, Default, PartialEq)]
pub struct Moment {
    pub fundamental: Option<f32>,
    pub intervals: Vec<Interval>,
    pub restless: bool,
    pub silent: bool,
}

pub fn moment(peaks: &[Peak], tol_cents: f32) -> Moment {
    if peaks.is_empty() {
        return Moment { silent: true, ..Default::default() };
    }
    let fundamental = peaks.iter().map(|p| p.hz).fold(f32::INFINITY, f32::min);
    let mut intervals = Vec::new();
    for i in 0..peaks.len() {
        for j in i + 1..peaks.len() {
            if let Some(iv) = interval(peaks[i].hz, peaks[j].hz, tol_cents) {
                if !intervals.iter().any(|e: &Interval| e.num == iv.num && e.den == iv.den) {
                    intervals.push(iv);
                }
            }
        }
    }
    let restless = intervals.iter().any(|i| i.restless);
    Moment { fundamental: Some(fundamental), intervals, restless, silent: false }
}

/// Emits on CHANGE, never on a clock. This is the whole cost model: a quiet room is free, a
/// held chord costs one line, and the stream is proportional to musical change rather than time.
#[derive(Debug, Clone, PartialEq)]
pub enum Event {
    Onset { hz: f32 },
    Silence,
    Intervals { names: Vec<String>, restless: bool },
    /// Tension that has not gone anywhere yet. Reported once per threshold crossing, not
    /// repeatedly — an unresolved chord should not turn into a stream of complaints.
    StillUnresolved { secs: f32 },
    Resolved { after_secs: f32 },
}

#[derive(Default)]
pub struct Tracker {
    last: Option<Moment>,
    restless_since: Option<f32>,
    last_nag: f32,
}

impl Tracker {
    /// `now` is seconds since start. `nag_after` is how long tension may sit before it is worth
    /// a line; 0 disables it.
    pub fn feed(&mut self, m: Moment, now: f32, nag_after: f32) -> Vec<Event> {
        let mut out = Vec::new();
        let was_silent = self.last.as_ref().map(|l| l.silent).unwrap_or(true);

        if m.silent {
            if !was_silent { out.push(Event::Silence); }
            self.restless_since = None;
            self.last = Some(m);
            return out;
        }
        if was_silent {
            if let Some(hz) = m.fundamental { out.push(Event::Onset { hz }); }
        }

        let changed = self.last.as_ref().map(|l| l.intervals != m.intervals).unwrap_or(true);
        if changed && !m.intervals.is_empty() {
            out.push(Event::Intervals {
                names: m.intervals.iter().map(|i| format!("{}:{} {}", i.num, i.den, i.name)).collect(),
                restless: m.restless,
            });
        }

        match (self.restless_since, m.restless) {
            (None, true) => { self.restless_since = Some(now); self.last_nag = now; }
            (Some(t0), false) => { out.push(Event::Resolved { after_secs: now - t0 }); self.restless_since = None; }
            (Some(t0), true) if nag_after > 0.0 && now - self.last_nag >= nag_after => {
                out.push(Event::StillUnresolved { secs: now - t0 });
                self.last_nag = now;
            }
            _ => {}
        }
        self.last = Some(m);
        out
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    const SR: f32 = 48_000.0;
    const N: usize = 4096;

    /// A sum of sine partials at a given sample rate, the input the capture path will produce.
    fn tone(freqs: &[(f32, f32)]) -> Vec<f32> {
        (0..N).map(|i| {
            let t = i as f32 / SR;
            freqs.iter().map(|&(f, a)| a * (2.0 * std::f32::consts::PI * f * t).sin()).sum()
        }).collect()
    }

    #[test]
    fn fft_finds_a_single_tone_where_it_actually_is() {
        let spec = spectrum(&tone(&[(440.0, 1.0)]));
        let p = peaks(&spec, SR, 4, 0.2);
        assert!(!p.is_empty(), "a pure tone must produce a peak");
        // parabolic interpolation should land well inside one bin (~11.7 Hz)
        assert!((p[0].hz - 440.0).abs() < 3.0, "found {} Hz, expected 440", p[0].hz);
    }

    #[test]
    fn a_fifth_is_recognised_as_a_fifth() {
        let iv = interval(440.0, 660.0, 25.0).expect("3:2 must classify");
        assert_eq!((iv.num, iv.den), (3, 2));
        assert_eq!(iv.name, "fifth");
        assert!(!iv.restless, "a fifth sits still");
    }

    #[test]
    fn equal_temperament_is_accepted_though_it_is_not_just() {
        // The trap: a tempered major third is 14 cents sharp of 5:4. A classifier tight enough to
        // demand just intonation would reject nearly all recorded music and report silence.
        let tempered_third = 440.0 * 2f32.powf(4.0 / 12.0);
        let iv = interval(440.0, tempered_third, 25.0).expect("a tempered third must still classify");
        assert_eq!(iv.name, "major third");
        assert!(iv.cents_off > 10.0, "and the drift from just is reported, not hidden: {}", iv.cents_off);

        let tempered_fifth = 440.0 * 2f32.powf(7.0 / 12.0);
        assert_eq!(interval(440.0, tempered_fifth, 25.0).unwrap().name, "fifth");
    }

    #[test]
    fn intervals_fold_across_octaves_the_way_an_ear_does() {
        // An octave and a fifth is still a fifth. A listener does not hear it as a new colour.
        let iv = interval(220.0, 660.0, 25.0).expect("3:1 folds to 3:2");
        assert_eq!(iv.name, "fifth");
    }

    #[test]
    fn a_true_octave_stays_an_octave_and_does_not_collapse_to_unison() {
        // The folding bug this guards: dividing by two until the ratio is under two turns 2:1 into
        // 1:1, and every octave would be reported as a unison.
        let iv = interval(220.0, 440.0, 25.0).expect("2:1 must classify");
        assert_eq!(iv.name, "octave");
        assert_eq!((iv.num, iv.den), (2, 1));
    }

    #[test]
    fn the_tritone_is_marked_restless_and_the_fifth_is_not() {
        // This is the distinction the whole feature exists to transmit: which sounds want to move.
        let tritone = 440.0 * 2f32.powf(6.0 / 12.0);
        assert!(interval(440.0, tritone, 30.0).expect("tritone").restless);
        assert!(!interval(440.0, 660.0, 25.0).unwrap().restless);
    }

    #[test]
    fn a_real_chord_through_the_real_transform_yields_its_intervals() {
        // Not a hand-made peak list: synthesise A major (A-C#-E), run the FFT, pick peaks, classify.
        let a = 440.0;
        let cs = a * 2f32.powf(4.0 / 12.0);
        let e = a * 2f32.powf(7.0 / 12.0);
        let spec = spectrum(&tone(&[(a, 1.0), (cs, 0.9), (e, 0.95)]));
        let m = moment(&peaks(&spec, SR, 5, 0.15), 30.0);
        assert!(!m.silent);
        let names: Vec<&str> = m.intervals.iter().map(|i| i.name).collect();
        assert!(names.contains(&"fifth"), "A–E is a fifth; got {:?}", names);
        assert!(names.contains(&"major third"), "A–C# is a major third; got {:?}", names);
        assert!(!m.restless, "a major triad is at rest; got {:?}", names);
    }

    #[test]
    fn silence_produces_no_peaks_and_no_events() {
        // The cost model depends on this. If a quiet room emits anything, the feature cannot be
        // left running and the whole design premise is gone.
        let spec = spectrum(&vec![0.0; N]);
        let p = peaks(&spec, SR, 5, 0.15);
        let m = moment(&p, 25.0);
        assert!(m.silent, "silence must read as silence");

        let mut t = Tracker::default();
        let events = t.feed(m.clone(), 0.0, 4.0);
        assert!(events.is_empty(), "first silence emits nothing: {:?}", events);
        assert!(t.feed(m, 1.0, 4.0).is_empty(), "and continued silence stays free");
    }

    #[test]
    fn a_held_chord_costs_exactly_one_line() {
        // Emit on change, not on a clock. Ten identical frames must not be ten events.
        let spec = spectrum(&tone(&[(440.0, 1.0), (660.0, 0.9)]));
        let m = moment(&peaks(&spec, SR, 4, 0.15), 25.0);
        let mut t = Tracker::default();
        let mut total = 0;
        for i in 0..10 { total += t.feed(m.clone(), i as f32 * 0.1, 0.0).len(); }
        assert_eq!(total, 2, "expected onset + intervals once, then silence-free repetition");
    }

    #[test]
    fn tension_reports_once_per_threshold_then_reports_its_release() {
        let restless = moment(&[Peak { hz: 440.0, mag: 1.0 },
                                Peak { hz: 440.0 * 2f32.powf(6.0 / 12.0), mag: 0.9 }], 30.0);
        let calm = moment(&[Peak { hz: 440.0, mag: 1.0 }, Peak { hz: 660.0, mag: 0.9 }], 25.0);
        assert!(restless.restless);
        assert!(!calm.restless);

        let mut t = Tracker::default();
        t.feed(restless.clone(), 0.0, 2.0);
        // held: one nag at the threshold, and not a stream of them
        let mut nags = 0;
        for i in 1..40 {
            for e in t.feed(restless.clone(), i as f32 * 0.1, 2.0) {
                if matches!(e, Event::StillUnresolved { .. }) { nags += 1; }
            }
        }
        assert!(nags >= 1, "held tension should say so at least once");
        assert!(nags <= 2, "but must not turn into a stream of complaints: {} nags", nags);

        let out = t.feed(calm, 4.5, 2.0);
        assert!(out.iter().any(|e| matches!(e, Event::Resolved { .. })),
                "the release is the event worth having: {:?}", out);
    }

    #[test]
    fn nonsense_input_is_refused_rather_than_guessed_at() {
        assert!(interval(0.0, 440.0, 25.0).is_none());
        assert!(interval(440.0, -1.0, 25.0).is_none());
        // an interval nothing simple explains must return None, not the nearest small ratio
        assert!(interval(440.0, 440.0 * 1.117, 5.0).is_none(), "a tight tolerance must be able to fail");
    }
}
