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

/// The visible frequency field: log-spaced bands, in dB, for a display.
///
/// LOG SPACING IS NOT DECORATION. Linear bins put every note anyone plays inside the left 5% of
/// the width — a 4096-point FFT at 48 kHz spends 2000 bins above 12 kHz, where there is almost
/// nothing, and forty bins across the entire bass register, where the music is. Every EQ display
/// ever built is log-frequency for the same reason: it is the axis hearing actually uses.
///
/// FIXED REFERENCE, NOT PER-FRAME NORMALISATION. Scaling each frame to its own maximum is the
/// obvious move and it lies: a near-silent passage fills the display exactly like a loud one, so
/// dynamics — the thing you would most want to SEE — become invisible. The reference here is
/// absolute, so quiet reads as quiet and silence reads as empty.
///
/// Bands take the MAX of the bins they span rather than the mean. A single strong partial should
/// stay a spike; averaging it against its empty neighbours is how a real peak becomes a bump.
pub fn bands(spec: &[f32], sample_rate: f32, n: usize) -> Vec<f32> {
    const F_LO: f32 = 30.0;        // below this is rumble and DC drift
    const F_HI: f32 = 16_000.0;    // above this there is nothing musical to see
    const FLOOR_DB: f32 = -80.0;
    if spec.is_empty() || n == 0 { return vec![0.0; n]; }
    let bin_hz = sample_rate / (spec.len() as f32 * 2.0);
    // Hann coherent gain is 0.5, and a one-sided spectrum doubles what remains: a full-scale
    // sine lands at N/4. Dividing by it puts 0 dB at full scale rather than at some number that
    // happens to depend on the transform size.
    let full_scale = (spec.len() * 2) as f32 / 4.0;

    (0..n).map(|i| {
        let lo = F_LO * (F_HI / F_LO).powf(i as f32 / n as f32);
        let hi = F_LO * (F_HI / F_LO).powf((i + 1) as f32 / n as f32);
        let (b0, b1) = ((lo / bin_hz) as usize, (hi / bin_hz).ceil() as usize);
        // At the bottom, a band is narrower than one bin. Reading the nearest bin is honest about
        // the resolution; returning zero would draw a hole in the bass that is not there.
        let b1 = b1.max(b0 + 1).min(spec.len());
        if b0 >= spec.len() { return 0.0; }
        let mag = spec[b0..b1].iter().cloned().fold(0.0f32, f32::max) / full_scale;
        if mag <= 0.0 { return 0.0; }
        let db = 20.0 * mag.log10();
        ((db - FLOOR_DB) / -FLOOR_DB).clamp(0.0, 1.0)
    }).collect()
}

/// One sounding note: a fundamental, and the partials the grouping assigned to it.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Voice {
    /// The fundamental. NOT necessarily a peak — it can be inferred from the spacing of the
    /// partials when the fundamental itself is absent from the spectrum.
    pub hz: f32,
    /// Summed magnitude of its partials. A voice built from four strong partials outranks a
    /// voice that is one weak stray, and ordering by this puts the loudest note first.
    pub mag: f32,
    pub partials: usize,
    /// True when `hz` was inferred rather than observed — a residue pitch. Carried so a caller
    /// can distrust it, because this is the one inference here that can be confidently wrong.
    pub inferred: bool,
}

/// How far a partial may sit from an exact harmonic and still be grouped. Wider than the interval
/// tolerance on purpose: real instruments are inharmonic. A piano's upper partials run measurably
/// sharp because a real string has stiffness and is not the ideal string of the textbook, so a
/// grouping tight enough for the maths would split every piano note into a chord of itself.
const HARMONIC_TOL_CENTS: f32 = 40.0;
/// Partials above this are not looked for. Harmonics crowd together as n rises — the gap from
/// H20 to H21 is 84 cents, already near the tolerance — so past here the test stops discriminating
/// and starts accepting anything.
const MAX_PARTIAL: u32 = 16;

/// Does `hz` sit on a harmonic of `f0`? Returns which one.
fn harmonic_of(hz: f32, f0: f32) -> Option<u32> {
    if f0 <= 0.0 || hz <= 0.0 { return None; }
    let n = (hz / f0).round();
    if n < 1.0 || n > MAX_PARTIAL as f32 { return None; }
    if cents(hz / (n * f0)).abs() <= HARMONIC_TOL_CENTS { Some(n as u32) } else { None }
}

/// Group spectral peaks into the notes that produced them.
///
/// THIS IS THE STEP THAT MAKES IT HEARING RATHER THAN A SPECTRUM READOUT, and leaving it out was
/// the defect the first live capture exposed. Every note carries a harmonic series, and that
/// series' own adjacent ratios ARE the consonant intervals: H3:H2 is a fifth, H4:H3 a fourth,
/// H5:H4 a major third. So reading every pair of peaks as an interval reports a rich consonant
/// chord for one plucked string, and reports it forever, because the overtones never leave. The
/// live ledger did exactly that: 2,784 lines in four minutes, 98% of them novel, describing a
/// harmony that was never played.
///
/// An ear does not have this problem because it fuses partials into a source before any harmony
/// is perceived. This is that step, and it is why the output can now be mostly silence.
///
/// The method: claim the strongest unassigned peak, work out what fundamental best explains it
/// together with the other unassigned peaks, take everything harmonically related to it, repeat.
pub fn voices(peaks: &[Peak], _tol_cents: f32) -> Vec<Voice> {
    let mut left: Vec<Peak> = peaks.to_vec();
    left.sort_by(|a, b| b.mag.partial_cmp(&a.mag).unwrap_or(std::cmp::Ordering::Equal));
    let mut out: Vec<Voice> = Vec::new();

    while let Some(seed) = left.first().copied() {
        // The seed may itself be an upper partial of an absent fundamental — peaks at 440, 660
        // and 880 with no 220 present are one note, not three, and an ear hears the missing 220.
        // So try subharmonics of the seed. But explanatory power ALONE is the trap that made the
        // first attempt worse than no fusion at all: a perfect fifth's two spectra are a SUBSET
        // of the series two octaves below — that is precisely why a fifth sounds consonant — so
        // "explains more peaks" swallowed A+E into a phantom 110 Hz and reported no chord at all.
        //
        // The discriminator is completeness, not coverage. A real note's low harmonics are all
        // there and strong. A phantom fundamental fits a GAPPY series: A+E under 110 Hz gives
        // H2,H3,H4,H6,H9 — five of nine, with H1, H5, H7 and H8 simply absent. Nothing sounds
        // like that. So an inferred fundamental must show a low partial and a mostly unbroken
        // series, and failing either it stays what it was observed to be.
        let series = |f0: f32| -> Vec<u32> {
            let mut ns: Vec<u32> = left.iter().filter_map(|p| harmonic_of(p.hz, f0)).collect();
            ns.sort_unstable();
            ns.dedup();
            ns
        };
        let credible = |ns: &[u32]| -> bool {
            match ns.iter().max() {
                Some(&hi) => ns.len() >= 3
                    && ns.iter().any(|&n| n <= 2)              // the note's own bottom is audible
                    && ns.len() as f32 / hi as f32 >= 0.7,     // and the series is not full of holes
                None => false,
            }
        };
        let base = series(seed.hz).len();
        let mut best = (seed.hz, 1u32, base);
        for k in 2..=6u32 {
            let f0 = seed.hz / k as f32;
            let ns = series(f0);
            // A lower fundamental can only ever explain MORE peaks, never fewer, so it must earn
            // its place with a strict improvement AND with a series that looks like a real note.
            if ns.len() > best.2 && credible(&ns) { best = (f0, k, ns.len()); }
        }
        let (f0, k, _) = best;

        let mut mag = 0.0;
        let mut partials = 0;
        left.retain(|p| match harmonic_of(p.hz, f0) {
            Some(_) => { mag += p.mag; partials += 1; false }
            None => true,
        });
        if partials == 0 { left.retain(|p| p.hz != seed.hz); continue; }
        out.push(Voice { hz: f0, mag, partials, inferred: k > 1 });
    }

    out.sort_by(|a, b| b.mag.partial_cmp(&a.mag).unwrap_or(std::cmp::Ordering::Equal));
    out
}

/// What the room is doing right now: the intervals present, and whether any of them is leaning.
#[derive(Clone, Debug, Default, PartialEq)]
pub struct Moment {
    pub fundamental: Option<f32>,
    pub intervals: Vec<Interval>,
    pub restless: bool,
    pub silent: bool,
    /// The notes the peaks were grouped into. Exposed so the display can colour each partial by
    /// the note it belongs to, which is the only way to see the grouping succeed or fail on real
    /// music rather than on synthesised tones.
    pub voices: Vec<Voice>,
}

pub fn moment(peaks: &[Peak], tol_cents: f32) -> Moment {
    if peaks.is_empty() {
        return Moment { silent: true, ..Default::default() };
    }
    let voices = voices(peaks, tol_cents);
    let fundamental = voices.iter().map(|v| v.hz).fold(f32::INFINITY, f32::min);

    // A LONE PEAK IS NOT A NOTE. Measured from live frames rather than reasoned: every voice
    // built from three or more partials was strong (50-100% of the loudest), and every
    // single-partial voice was debris at 7-32% — sub-bass rumble at 36 Hz, a 2191 Hz artefact, a
    // reverb tail. Each of those was being promoted to a note and paired against the bassline to
    // name an interval, which is where the flood came from: four or five voices give six to ten
    // pairs and most of the voices were never played.
    //
    // Corroboration is what makes it a note: either other partials agree with it, or it is loud
    // enough to stand alone. The second clause is not a hedge — a flute or a sine IS one partial,
    // and a rule of "two or more" would delete it. So the test is evidence, from either source.
    const LONE_VOICE_FLOOR: f32 = 0.35;
    let loudest = voices.iter().map(|v| v.mag).fold(0.0f32, f32::max);
    let named: Vec<&Voice> = voices.iter()
        .filter(|v| v.partials >= 2 || (loudest > 0.0 && v.mag >= LONE_VOICE_FLOOR * loudest))
        .collect();

    // Intervals BETWEEN NOTES, never between partials of the same note, and never from debris.
    let mut intervals = Vec::new();
    for i in 0..named.len() {
        for j in i + 1..named.len() {
            if let Some(iv) = interval(named[i].hz, named[j].hz, tol_cents) {
                if !intervals.iter().any(|e: &Interval| e.num == iv.num && e.den == iv.den) {
                    intervals.push(iv);
                }
            }
        }
    }
    let restless = intervals.iter().any(|i| i.restless);
    Moment {
        fundamental: if fundamental.is_finite() { Some(fundamental) } else { None },
        intervals, restless, silent: false, voices,
    }
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

/// How many consecutive readings vote, and how many must agree.
///
/// A WINDOW IS NOT A MOMENT. One analysis window is 85 ms, far shorter than any musical event,
/// and two consecutive windows over ONE held chord give slightly different peak sets. A tracker
/// that fires on every difference reports a chord change that never happened: 8.58 events/sec
/// and 590 "resolved" lines in a minute, most releasing tension that had lasted 0.1 s.
///
/// The first attempt at this required the reading to be IDENTICAL for 180 ms, and it went deaf —
/// two onsets and zero intervals across three minutes of music. Real audio never hands you the
/// same reading twice; the set shifts by a member every window even while the chord is held, so
/// nothing ever settled. The test that was supposed to catch this alternated between exactly TWO
/// readings, which is a flicker no real spectrum produces. It tested the wall being aimed at
/// instead of the one behind.
///
/// So persistence is measured by VOTE rather than by repetition, which is nearer what hearing
/// does anyway: integrate over a couple hundred milliseconds and keep what survives. An interval
/// is reported when it appears in a strict majority of the last few readings. Flickering members
/// drop out, the stable core survives, and the reported set changes only when the music does.
///
/// FOUR, not three, and the difference is load-bearing: a strict majority of four is three, so an
/// alternating pair scores two each and neither survives. A majority of three is two, and the
/// same alternation would let the first reading win — the deaf failure's mirror image.
pub const VOTE_WINDOWS: usize = 4;

/// How long tension must last before its release is worth a line.
///
/// Half a second, and the reason is the same one that set the vote window: a thing that lasted
/// one analysis window did not happen musically. Measured live before this existed: 33 lines of
/// "resolved after 0.1s" in 62 seconds, each announcing the release of a tension that never had
/// time to be felt. The clock still clears on every settling — only the REPORT is withheld, so
/// nothing is left dangling.
pub const MIN_TENSION_SECS: f32 = 0.5;

#[derive(Default)]
pub struct Tracker {
    /// The last few readings, oldest first. Only the interval set and silence matter for voting.
    recent: Vec<(Vec<Interval>, bool)>,
    /// The stable set as last reported.
    confirmed: Option<(Vec<Interval>, bool)>,
    restless_since: Option<f32>,
    last_nag: f32,
}

impl Tracker {
    /// `now` is seconds since start. `nag_after` is how long tension may sit before it is worth
    /// a line; 0 disables it.
    pub fn feed(&mut self, m: Moment, now: f32, nag_after: f32) -> Vec<Event> {
        let mut out = Vec::new();

        self.recent.push((m.intervals.clone(), m.silent));
        if self.recent.len() > VOTE_WINDOWS { self.recent.remove(0); }
        if self.recent.len() < VOTE_WINDOWS {
            return out;                       // not enough evidence to call anything yet
        }

        let need = VOTE_WINDOWS / 2 + 1;      // strict majority
        let silent = self.recent.iter().filter(|(_, s)| *s).count() >= need;
        // An interval survives if a majority of the recent readings contain it. Order follows
        // JUST's own ordering via first appearance, so the same chord always prints the same way.
        let mut stable: Vec<Interval> = Vec::new();
        for (ivs, _) in &self.recent {
            for iv in ivs {
                if stable.iter().any(|e: &Interval| e.num == iv.num && e.den == iv.den) { continue; }
                let votes = self.recent.iter()
                    .filter(|(s, _)| s.iter().any(|e| e.num == iv.num && e.den == iv.den))
                    .count();
                if votes >= need { stable.push(*iv); }
            }
        }
        let restless = stable.iter().any(|i| i.restless);

        // SOUND PRESENCE IS DECIDED SEPARATELY FROM READABILITY, and getting that wrong once left
        // the tab entirely mute: when the interval logic swallowed unreadable moments it swallowed
        // the onset with them, so a percussion-only passage — sound obviously playing — produced
        // not one line. You hear a drum start. That the harmony is unreadable is a different fact.
        let was_silent = self.confirmed.as_ref().map(|(_, s)| *s).unwrap_or(true);
        if silent != was_silent {
            if silent {
                out.push(Event::Silence);
                self.restless_since = None;
            } else if let Some(hz) = m.fundamental {
                out.push(Event::Onset { hz });
            }
            // Silence wipes the chord belief as well: after a gap, the next chord is genuinely new.
            self.confirmed = Some((Vec::new(), silent));
        }
        if silent { return out; }

        // AN UNREADABLE MOMENT IS NOT A REPORT THAT THE MUSIC CHANGED. Sound is present but no
        // interval won a majority — a transient, a percussion hit, a passing tone. Emitting
        // nothing was already right; the bug was updating the belief anyway, so the same chord
        // returning a moment later was announced a second time as though it were new. Live:
        //
        //     14:01:48  restless  16:9 minor seventh  — wants to move
        //     14:01:48  restless  16:9 minor seventh  — wants to move
        //
        // So this leaves the chord belief alone. The tension clock still runs, because tension
        // that outlives a moment of noise has not resolved.
        if stable.is_empty() {
            if let Some(t0) = self.restless_since {
                if nag_after > 0.0 && now - self.last_nag >= nag_after {
                    out.push(Event::StillUnresolved { secs: now - t0 });
                    self.last_nag = now;
                }
            }
            return out;
        }

        let differs = self.confirmed.as_ref().map(|(c, _)| *c != stable).unwrap_or(true);
        if differs {
            out.push(Event::Intervals {
                names: stable.iter()
                    .map(|i| format!("{}:{} {}", i.num, i.den, i.name)).collect(),
                restless,
            });
            match (self.restless_since, restless) {
                (None, true) => { self.restless_since = Some(now); self.last_nag = now; }
                (Some(t0), false) => {
                    // A release is only news if there was something to release. 33 lines of
                    // "resolved after 0.1s" in a minute, live — tension that lasted a single
                    // window was never tension, and announcing its resolution is the same
                    // window-is-a-moment error one layer up. The clock always clears; only the
                    // REPORT is withheld.
                    if now - t0 >= MIN_TENSION_SECS {
                        out.push(Event::Resolved { after_secs: now - t0 });
                    }
                    self.restless_since = None;
                }
                _ => {}
            }
            self.confirmed = Some((stable, silent));
        }

        // Tension runs on the clock, not on change: an unresolved chord that nobody touches is
        // exactly the case worth reporting, and it produces no differences to trigger on.
        if let Some(t0) = self.restless_since {
            if nag_after > 0.0 && now - self.last_nag >= nag_after {
                out.push(Event::StillUnresolved { secs: now - t0 });
                self.last_nag = now;
            }
        }
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
    fn one_note_alone_is_not_a_chord() {
        // THE DEFECT THIS PINS, found by reading the first live capture rather than by thinking:
        // the ledger reported "2:1 octave · 4:3 fourth · 3:2 fifth" as a SETTLED chord, over and
        // over. Those are H2:H1, H4:H3 and H3:H2 — they are not harmony, they are what a single
        // sound IS. Any note from any instrument carries a harmonic series, and the consonant
        // intervals are the series' own adjacent ratios. So a classifier that reads every pair of
        // spectral peaks as an interval will report a rich consonant chord for one plucked string,
        // and will report it CONSTANTLY, because the overtones never leave.
        //
        // That is why the live output looked so musical and meant so little.
        let a220 = tone(&[(220.0, 1.0), (440.0, 0.5), (660.0, 0.33), (880.0, 0.25), (1100.0, 0.2)]);
        let p = peaks(&spectrum(&a220), SR, 5, 0.15);
        let m = moment(&p, 30.0);
        assert!(
            m.intervals.is_empty(),
            "one note reported as a chord: {:?}",
            m.intervals.iter().map(|i| i.name).collect::<Vec<_>>()
        );
    }

    /// A deterministic noise source. No rand dependency, and a fixed seed so a failure here is
    /// reproducible rather than a thing that happens sometimes.
    fn noisy(freqs: &[(f32, f32)], amount: f32) -> Vec<f32> {
        let mut s: u32 = 0x9E3779B9;
        tone(freqs).into_iter().map(|x| {
            s = s.wrapping_mul(1664525).wrapping_add(1013904223);
            let r = (s >> 8) as f32 / 8_388_608.0 - 1.0;   // roughly -1..1
            x + r * amount
        }).collect()
    }

    #[test]
    fn a_flicker_between_two_readings_reports_neither() {
        // The defect this closes, measured live: 8.58 events/sec and 590 "resolved" lines in one
        // minute, most releasing tension that had lasted 0.1 s. Two consecutive 85 ms windows over
        // ONE held chord give slightly different peaks, so the interval list alternates, and a
        // tracker firing on every difference invents a chord change per window.
        let a = moment(&[Peak { hz: 440.0, mag: 1.0 }, Peak { hz: 660.0, mag: 0.9 }], 25.0);
        let b = moment(&[Peak { hz: 440.0, mag: 1.0 },
                         Peak { hz: 440.0 * 2f32.powf(6.0 / 12.0), mag: 0.9 }], 30.0);
        assert_ne!(a.intervals, b.intervals, "the two readings must actually differ");

        let mut t = Tracker::default();
        let mut chords = 0;
        let mut all = 0;
        for i in 0..40 {
            let m = if i % 2 == 0 { a.clone() } else { b.clone() };
            for e in t.feed(m, i as f32 * 0.085, 0.0) {      // real window cadence
                all += 1;
                if matches!(e, Event::Intervals { .. }) { chords += 1; }
            }
        }
        // Counting ALL events was a proxy for this claim and it stopped being one. Under voting,
        // sound presence is decided separately from the interval set, so an unreadable harmony
        // still correctly produces an Onset — there IS sound. The claim was never "silence"; it
        // was "no chord". That is what is asserted now.
        assert_eq!(chords, 0, "alternating readings named {chords} chords; a flicker is not music");
        assert_eq!(all, 1, "and the one event is the onset, nothing else: {all}");
    }

    #[test]
    fn a_chord_returning_after_an_unreadable_moment_is_not_announced_twice() {
        // Straight from the live ledger: the same line, back to back, same second. Sound present,
        // no interval winning a majority, so nothing is emitted — but the belief was being
        // overwritten anyway, and the chord's return read as a new chord.
        let held = Moment {
            fundamental: Some(440.0), intervals: vec![interval(440.0, 660.0, 25.0).unwrap()],
            restless: false, silent: false, voices: vec![],
        };
        let unreadable = Moment {
            fundamental: Some(440.0), intervals: vec![], restless: false, silent: false, voices: vec![],
        };
        let mut t = Tracker::default();
        let mut named = 0;
        // held long enough to be reported, then noise, then the same chord back
        for i in 0..8 { for e in t.feed(held.clone(), i as f32 * 0.085, 0.0) {
            if matches!(e, Event::Intervals { .. }) { named += 1; } } }
        for i in 8..14 { t.feed(unreadable.clone(), i as f32 * 0.085, 0.0); }
        for i in 14..24 { for e in t.feed(held.clone(), i as f32 * 0.085, 0.0) {
            if matches!(e, Event::Intervals { .. }) { named += 1; } } }
        assert_eq!(named, 1, "the same chord was announced {named} times across a gap of noise");
    }

    #[test]
    fn a_tension_too_brief_to_feel_does_not_report_its_release() {
        // 33 "resolved after 0.1s" lines in 62 seconds, live. A release is only news if there was
        // something to release.
        let tense = Moment {
            fundamental: Some(440.0),
            intervals: vec![interval(440.0, 622.3, 25.0).unwrap()],   // tritone
            restless: true, silent: false, voices: vec![],
        };
        let calm = Moment {
            fundamental: Some(440.0), intervals: vec![interval(440.0, 660.0, 25.0).unwrap()],
            restless: false, silent: false, voices: vec![],
        };
        // brief: tension confirmed, then gone well inside MIN_TENSION_SECS
        let mut t = Tracker::default();
        let mut res = 0;
        for i in 0..5 { for e in t.feed(tense.clone(), i as f32 * 0.085, 0.0) {
            if matches!(e, Event::Resolved { .. }) { res += 1; } } }
        for i in 5..12 { for e in t.feed(calm.clone(), i as f32 * 0.085, 0.0) {
            if matches!(e, Event::Resolved { .. }) { res += 1; } } }
        assert_eq!(res, 0, "a {:.2}s tension reported its release", 7.0 * 0.085);

        // and the other wall: real tension, held, must still report the release
        let mut t2 = Tracker::default();
        let mut res2 = 0;
        for i in 0..30 { for e in t2.feed(tense.clone(), i as f32 * 0.085, 0.0) {
            if matches!(e, Event::Resolved { .. }) { res2 += 1; } } }
        for i in 30..40 { for e in t2.feed(calm.clone(), i as f32 * 0.085, 0.0) {
            if matches!(e, Event::Resolved { .. }) { res2 += 1; } } }
        assert_eq!(res2, 1, "tension held 2.5s must report its release exactly once");
    }

    #[test]
    fn a_stable_core_survives_a_shifting_edge() {
        // THE TEST THAT SHOULD HAVE EXISTED, and whose absence shipped a deaf build. The previous
        // rule demanded the reading be IDENTICAL for 180 ms. Real audio never repeats: the
        // interval set shifts by a member every window even while the chord is held. So nothing
        // ever settled and three minutes of music produced two onsets and zero intervals.
        //
        // The flicker test that was supposed to guard this alternated between exactly two fixed
        // readings — a pattern no real spectrum produces. This is what real input looks like: a
        // stable core with a different stray riding along each window.
        let fifth = interval(440.0, 660.0, 25.0).unwrap();
        let strays = [
            interval(440.0, 622.3, 25.0).unwrap(),      // tritone
            interval(440.0, 466.2, 25.0).unwrap(),      // minor second
            interval(440.0, 783.9, 25.0).unwrap(),      // major sixth
            interval(440.0, 493.9, 25.0).unwrap(),      // major second
        ];
        let mut t = Tracker::default();
        let mut named: Vec<Vec<String>> = Vec::new();
        for i in 0..16 {
            let m = Moment {
                fundamental: Some(440.0),
                intervals: vec![fifth, strays[i % strays.len()]],
                restless: true,
                silent: false,
                voices: vec![],
            };
            for e in t.feed(m, i as f32 * 0.085, 0.0) {
                if let Event::Intervals { names, .. } = e { named.push(names); }
            }
        }
        assert!(!named.is_empty(), "a held fifth under a shifting edge must be heard at all");
        for n in &named {
            assert!(n.iter().any(|s| s.contains("fifth")), "the stable core is missing: {n:?}");
            assert_eq!(n.len(), 1, "a stray that appears in one window of four got reported: {n:?}");
        }
        assert_eq!(named.len(), 1, "the core is unchanging, so it costs one line: {named:?}");
    }

    #[test]
    fn a_change_that_actually_holds_is_still_reported() {
        // The other wall. A settle rule that reports nothing scores perfectly above.
        let a = moment(&[Peak { hz: 440.0, mag: 1.0 }, Peak { hz: 660.0, mag: 0.9 }], 25.0);
        let b = moment(&[Peak { hz: 440.0, mag: 1.0 }, Peak { hz: 550.0, mag: 0.9 }], 25.0);
        let mut t = Tracker::default();
        let mut evs = Vec::new();
        for i in 0..12 { evs.extend(t.feed(a.clone(), i as f32 * 0.085, 0.0)); }
        for i in 12..24 { evs.extend(t.feed(b.clone(), i as f32 * 0.085, 0.0)); }
        let named: Vec<_> = evs.iter().filter(|e| matches!(e, Event::Intervals { .. })).collect();
        assert_eq!(named.len(), 2, "two chords held one second each are two lines, got {evs:?}");
    }

    #[test]
    fn a_faint_stray_peak_does_not_get_to_name_an_interval() {
        // From live frames, not from reasoning: two real notes plus debris at 7-13% of the
        // loudest — sub-bass rumble, a high artefact, a reverb tail — each promoted to a voice
        // and paired against the bassline. Here a strong A220 and a strong E330 (a real fifth)
        // alongside a faint stray that would otherwise add a tritone nobody played.
        let mix = tone(&[
            (220.0, 1.0), (440.0, 0.55), (660.0, 0.35),
            (330.0, 0.85), (990.0, 0.30),
            (311.1, 0.06),                       // faint, alone, and a tritone above 220
        ]);
        let m = moment(&peaks(&spectrum(&mix), SR, 10, 0.04), 30.0);
        assert!(m.intervals.iter().any(|i| i.name == "fifth"), "the real fifth must survive");
        assert!(!m.intervals.iter().any(|i| i.name == "tritone"),
                "a 6%-magnitude lone peak named a tritone: {:?}",
                m.intervals.iter().map(|i| i.name).collect::<Vec<_>>());
    }

    #[test]
    fn a_loud_pure_tone_is_a_note_even_with_one_partial() {
        // The other wall, and the reason the rule is not simply "two or more partials". A flute,
        // a sine, a whistle IS one partial. Deleting single-partial voices outright would score
        // well on the test above by going deaf.
        let dyad = tone(&[(440.0, 1.0), (660.0, 0.95)]);   // two pure tones, a fifth apart
        let m = moment(&peaks(&spectrum(&dyad), SR, 10, 0.12), 30.0);
        assert!(m.intervals.iter().any(|i| i.name == "fifth"),
                "two loud pure tones are a fifth, got {:?}",
                m.intervals.iter().map(|i| i.name).collect::<Vec<_>>());
    }

    #[test]
    fn one_note_survives_noise_and_is_still_one_note() {
        // A HYPOTHESIS THAT WAS WRONG, kept because the guard is worth having and because the
        // record should show what was tried. Fusion shipped and real music showed 13.19
        // events/sec against 12.67 before, and 4.24 intervals per report against 4.23 — correct
        // on synthesised tones and never engaging on a mix. The keeper, watching the display,
        // reported every marker a different colour with two colours adjacent, and the guess was
        // that noise throws extra local maxima onto the shoulder of a real peak, inside the Hann
        // main lobe, which the grouping then makes into separate notes.
        //
        // This test passed the moment it was written, with no change to the code. At realistic
        // noise levels the 12% floor already rejects shoulder maxima. So that is NOT the cause,
        // and the real one is still unknown — the peaks in a live mix are apparently genuine and
        // genuinely unrelated. Diagnosing it needs the actual frames, not more guessing.
        let v = voices(&peaks(&spectrum(&noisy(&[(220.0, 1.0), (440.0, 0.5), (660.0, 0.33)], 0.02)),
                              SR, 10, 0.12), 30.0);
        assert!(v.len() <= 2, "one noisy note split into {} voices: {:?}", v.len(),
                v.iter().map(|x| x.hz).collect::<Vec<_>>());
    }

    #[test]
    fn two_maxima_inside_one_main_lobe_are_one_peak() {
        // The mechanism, isolated from the grouping so a failure says which layer broke.
        let spec = spectrum(&noisy(&[(1000.0, 1.0)], 0.03));
        let p = peaks(&spec, SR, 10, 0.05);
        let bin = SR / (spec.len() as f32 * 2.0);
        for (i, a) in p.iter().enumerate() {
            for b in p.iter().skip(i + 1) {
                assert!((a.hz - b.hz).abs() >= 3.0 * bin,
                        "peaks at {:.1} and {:.1} Hz are inside one main lobe ({:.1} Hz wide)",
                        a.hz, b.hz, 4.0 * bin);
            }
        }
    }

    #[test]
    fn silence_draws_an_empty_display_rather_than_a_normalised_one() {
        // The per-frame-normalisation trap, pinned: dividing by the frame's own maximum makes
        // silence look identical to a full mix. The display would never be empty and dynamics
        // would be invisible.
        let b = bands(&spectrum(&vec![0.0f32; N]), SR, 64);
        assert_eq!(b.len(), 64);
        assert!(b.iter().all(|&x| x <= 0.001), "silence must read as empty, got max {:?}",
                b.iter().cloned().fold(0.0f32, f32::max));
    }

    #[test]
    fn a_quiet_tone_reads_quieter_than_a_loud_one_at_the_same_pitch() {
        // The other half of a fixed reference: amplitude must survive to the display.
        let loud = bands(&spectrum(&tone(&[(440.0, 1.0)])), SR, 64);
        let soft = bands(&spectrum(&tone(&[(440.0, 0.05)])), SR, 64);
        let peak = |v: &Vec<f32>| v.iter().cloned().fold(0.0f32, f32::max);
        assert!(peak(&loud) > peak(&soft) + 0.1,
                "loud {:.3} vs quiet {:.3} -- the display is auto-gaining", peak(&loud), peak(&soft));
    }

    #[test]
    fn a_tone_lights_the_band_it_actually_belongs_to() {
        // Log spacing is easy to get subtly wrong in a way that still looks plausible: an
        // off-by-one in the band edges shifts everything a semitone or two and nothing complains.
        let b = bands(&spectrum(&tone(&[(440.0, 1.0)])), SR, 64);
        let hottest = b.iter().enumerate()
            .max_by(|a, c| a.1.partial_cmp(c.1).unwrap()).map(|(i, _)| i).unwrap();
        // invert the band mapping and check 440 lands inside the winning band
        let lo = 30.0 * (16_000.0f32 / 30.0).powf(hottest as f32 / 64.0);
        let hi = 30.0 * (16_000.0f32 / 30.0).powf((hottest + 1) as f32 / 64.0);
        assert!(440.0 >= lo && 440.0 <= hi,
                "440 Hz lit band {hottest} which spans {lo:.0}-{hi:.0} Hz");
    }

    #[test]
    fn a_fifth_is_two_notes_and_not_one_phantom_two_octaves_down() {
        // REGRESSION. The first fusion attempt scored candidate fundamentals purely on how many
        // peaks they explained, and 110 Hz explains every partial of both A220 and E330 — because
        // a fifth's combined spectrum genuinely IS a subset of the series two octaves below.
        // That is the physics of why a fifth sounds consonant, and taken as evidence it deletes
        // the chord: the whole dyad fused into one invented note and the tab reported nothing.
        //
        // A test that only asserted "one note is not a chord" would have PASSED that version.
        // Silence passes every over-reporting test. This is the other wall.
        let fifth = tone(&[
            (220.0, 1.0), (440.0, 0.5), (660.0, 0.33),
            (330.0, 0.9), (660.0, 0.45), (990.0, 0.3),
        ]);
        let v = voices(&peaks(&spectrum(&fifth), SR, 8, 0.12), 30.0);
        assert!(v.len() >= 2, "a fifth is two notes, got {v:?}");
        assert!(v.iter().all(|x| x.hz > 150.0),
                "no phantom fundamental below either note: {:?}",
                v.iter().map(|x| x.hz).collect::<Vec<_>>());
    }

    #[test]
    fn an_absent_fundamental_is_still_heard_the_way_an_ear_hears_it() {
        // The opposite error, and the reason the subharmonic search exists at all. Partials at
        // 440/660/880 with no 220 present are ONE note whose fundamental was filtered out — a
        // small speaker does this constantly and a human still hears the low note. Reading them
        // as three separate voices would invent an octave and a fifth that nobody played.
        let residue = tone(&[(440.0, 1.0), (660.0, 0.8), (880.0, 0.6), (1100.0, 0.4)]);
        let v = voices(&peaks(&spectrum(&residue), SR, 6, 0.12), 30.0);
        assert_eq!(v.len(), 1, "one note with its fundamental missing, got {v:?}");
        assert!((v[0].hz - 220.0).abs() < 12.0, "residue pitch should be ~220, got {}", v[0].hz);
        assert!(v[0].inferred, "an inferred fundamental must be flagged as inferred");
    }

    #[test]
    fn a_real_chord_still_reads_as_one() {
        // The other half, or the fix above is just a mute button: two DIFFERENT notes, each with
        // its own overtones, must still be heard. A guard that achieves silence by refusing to
        // report anything passes the test above and is worthless.
        let both = tone(&[
            (220.0, 1.0), (440.0, 0.5), (660.0, 0.33),          // A3 and its series
            (277.2, 0.9), (554.4, 0.45), (831.6, 0.3),          // C#4 — a major third above
        ]);
        let p = peaks(&spectrum(&both), SR, 6, 0.15);
        let m = moment(&p, 30.0);
        assert!(
            m.intervals.iter().any(|i| i.name == "major third"),
            "two notes a third apart must report a third, got {:?}",
            m.intervals.iter().map(|i| i.name).collect::<Vec<_>>()
        );
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

        // Frames arrive continuously at ~12/sec, so the release is fed as the stream would feed
        // it rather than as a single frame. The assertion is unchanged: the release is the event
        // worth having. Only the timing model moved — a reading must now hold SETTLE_SECS before
        // it is believed, and one isolated frame is exactly the flicker that rule exists to drop.
        let mut out = Vec::new();
        for i in 0..5 { out.extend(t.feed(calm.clone(), 4.5 + i as f32 * 0.1, 2.0)); }
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
