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

/// FLATS, NOT SHARPS, and it is a real choice rather than a coin toss. The same black key is A♯ or
/// B♭ depending on where the music is going, and nothing here knows the key — there is no harmonic
/// context to infer it from, only pitches. So one spelling has to be picked and stated. Flats,
/// because minor keys and most orchestral writing live on the flat side, and the reference piece
/// this was built against is in B♭ minor: `A#4` would have been technically defensible and would
/// have read as wrong to anyone who knows the piece.
const NOTES: [&str; 12] = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

/// A frequency as a note name plus how far it sits from that note, in cents.
///
/// The cents matter as much as the name. 467 Hz is B♭4 — but so is 462 Hz, and so is 471, and one
/// of those is an orchestra tuning sharp while another is a cheap sample. Reporting the name alone
/// would quietly discard the only evidence about which.
pub fn note_name(hz: f32) -> (String, f32) {
    if hz <= 0.0 { return ("—".into(), 0.0); }
    let midi = 69.0 + 12.0 * (hz / 440.0).log2();
    let nearest = midi.round();
    let cents_off = (midi - nearest) * 100.0;
    // MIDI 0 is C-1, so the octave is floor(n/12) - 1. Guard the negative case rather than let a
    // subsonic reading produce a nonsense index.
    let n = nearest.max(0.0) as i32;
    let name = format!("{}{}", NOTES[(n % 12) as usize], n / 12 - 1);
    (name, cents_off)
}

/// Chord templates, as semitones above the root. Ordered so that when two fit equally the earlier
/// wins, which puts the plainer reading first — a listener hears a triad as a triad, not as some
/// larger chord with notes politely missing.
///
/// Four-note qualities are listed after the triads but win anyway when they fit exactly, because
/// scoring prefers the template with nothing missing and nothing left over. A full dominant seventh
/// matches `major` with one note spare and `7` with none, so it reads as `7`.
const CHORDS: &[(&[u8], &str)] = &[
    (&[0, 4, 7], ""),            // major, written as the bare root: B♭
    (&[0, 3, 7], "m"),
    (&[0, 3, 6], "dim"),
    (&[0, 4, 8], "aug"),
    (&[0, 5, 7], "sus4"),
    (&[0, 2, 7], "sus2"),
    (&[0, 4, 7, 10], "7"),
    (&[0, 3, 7, 10], "m7"),
    (&[0, 4, 7, 11], "maj7"),
    (&[0, 3, 6, 10], "m7♭5"),
    (&[0, 3, 6, 9], "dim7"),
    (&[0, 3, 7, 11], "m(maj7)"),
    (&[0, 4, 7, 9], "6"),
    (&[0, 3, 7, 9], "m6"),
];

/// A named chord, with the bass note when it is not the root.
#[derive(Clone, Debug, PartialEq)]
pub struct Chord {
    /// `B♭m7`, `F7`, `D♭` — root and quality, no octave.
    pub name: String,
    /// Notes present that the template does not explain. Kept rather than hidden: a reading with
    /// two strangers in it is a weaker claim than a clean one, and the caller should be able to see
    /// that rather than take the name on faith.
    pub extra: usize,
    /// The lowest sounding note, when it is not the root — `B♭m/D♭`.
    pub inversion: bool,
}

fn pitch_class(hz: f32) -> Option<u8> {
    if hz <= 0.0 { return None; }
    let midi = (69.0 + 12.0 * (hz / 440.0).log2()).round();
    if !(0.0..=127.0).contains(&midi) { return None; }
    Some((midi as i32).rem_euclid(12) as u8)
}

/// Name the chord a set of sounding notes makes, if they make one.
///
/// WHY THIS EXISTS. All afternoon a B♭ minor triad reached the reader as `3:2 fifth · 6:5 minor
/// third` and the assembling was done by hand, every single time. The instrument knew the notes and
/// declined to say what they were.
///
/// THREE NOTES MINIMUM, and that is a real limit rather than a conservative default. Two notes are
/// an interval, not a chord: C and E♭ are equally the bottom of Cm, the top of A♭6, and the middle
/// of a diminished seventh. Naming one would be inventing the context. Below three, the interval
/// reading is the honest answer and is already there.
pub fn chord(voices_hz: &[f32]) -> Option<Chord> {
    let mut pcs: Vec<u8> = voices_hz.iter().filter_map(|&h| pitch_class(h)).collect();
    pcs.sort_unstable();
    pcs.dedup();
    if pcs.len() < 3 { return None; }

    let bass_pc = voices_hz.iter().cloned().filter(|&h| h > 0.0)
        .fold(f32::INFINITY, f32::min);
    let bass_pc = if bass_pc.is_finite() { pitch_class(bass_pc) } else { None };

    // best = (extra, -template_len, template_index, root)
    let mut best: Option<(usize, usize, usize, u8)> = None;
    for root in 0u8..12 {
        for (ti, (tpl, _)) in CHORDS.iter().enumerate() {
            let want: Vec<u8> = tpl.iter().map(|&s| (root + s) % 12).collect();
            // Every note the template requires must be sounding. A triad missing its third is not
            // that triad — it is a bare fifth, and calling it major would be a guess dressed as a
            // reading.
            if !want.iter().all(|w| pcs.contains(w)) { continue; }
            let extra = pcs.iter().filter(|p| !want.contains(p)).count();
            let cand = (extra, usize::MAX - tpl.len(), ti, root);
            if best.as_ref().map_or(true, |b| cand < *b) { best = Some(cand); }
        }
    }

    let (extra, _, ti, root) = best?;
    // More than one unexplained note means the set is not really this chord. Two strangers in a
    // three-note template is a coincidence, not a harmony.
    if extra > 1 { return None; }
    let quality = CHORDS[ti].1;
    let inversion = bass_pc.map_or(false, |b| b != root);
    let mut name = format!("{}{}", NOTES[root as usize], quality);
    if let (true, Some(b)) = (inversion, bass_pc) {
        name.push('/');
        name.push_str(NOTES[b as usize]);
    }
    Some(Chord { name, extra, inversion })
}

/// Position of a ratio in JUST, for canonical ordering. Unknown ratios sort last rather than
/// panicking — an ordering helper is not the place to take the process down.
fn just_rank(num: u32, den: u32) -> usize {
    JUST.iter().position(|&(n, d, _, _)| n == num && d == den).unwrap_or(usize::MAX)
}

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
    /// The chord these notes make, when three or more distinct pitches make one.
    pub chord: Option<Chord>,
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
    // Named from the CORROBORATED voices only, the same set the intervals come from. Feeding debris
    // into a chord namer would be worse than feeding it into interval naming: a stray peak adds one
    // spurious interval, but one wrong pitch class turns B♭m into something else entirely.
    let chord = chord(&named.iter().map(|v| v.hz).collect::<Vec<_>>());
    Moment {
        fundamental: if fundamental.is_finite() { Some(fundamental) } else { None },
        intervals, restless, silent: false, voices, chord,
    }
}

/// Loudness of one window, in dBFS. Full scale is 0; silence floors at -100 rather than -infinity,
/// because -inf propagates into every average that touches it.
///
/// RMS AND NOT PEAK. Peak amplitude tracks transients — one cymbal in an otherwise quiet bar reads
/// as loud — while RMS tracks energy, which is what "getting louder" means to a listener and what a
/// crescendo actually does.
pub fn rms_db(samples: &[f32]) -> f32 {
    if samples.is_empty() { return -100.0; }
    let sum: f32 = samples.iter().map(|s| s * s).sum();
    let rms = (sum / samples.len() as f32).sqrt();
    if rms <= 1e-9 { return -100.0; }
    (20.0 * rms.log10()).max(-100.0)
}

/// How far back to compare, and how much change is worth a line.
///
/// SIXTY SECONDS AND THREE DECIBELS, and the numbers are arithmetic rather than taste.
///
/// The reference piece rises roughly 25 dB across six minutes — about **0.07 dB per second**. Over
/// the four-second window that felt natural, that is 0.3 dB: indistinguishable from noise. A
/// detector tuned that way reports nothing at all through the most famous crescendo in the
/// repertoire.
///
/// The first attempt at fixing that used thirty seconds and four decibels, and the test written
/// alongside it FAILED: 0.07 × 30 is 2.1 dB, which never reaches a 4 dB threshold either. The
/// detector could not see the one thing it was built to see, and the comment above it confidently
/// explained why the window was long enough. Sixty seconds gives 4.2 dB at that slope, and a 3 dB
/// threshold leaves margin — so the arithmetic now closes, and it closes in a test rather than in
/// prose.
///
/// Two costs, stated rather than discovered: nothing is reported for the first ~48 seconds, and a
/// sudden hit is not what this detects. It reports ARCS. Faster phrase-level swells trip it too,
/// and it cannot tell those from the global shape — for that, the per-frame level in the snapshot
/// is the honest source.
const SWELL_WINDOW_SECS: f32 = 60.0;
const SWELL_DB: f32 = 3.0;
const SWELL_MIN_GAP_SECS: f32 = 8.0;

/// Tracks loudness over time and reports sustained growth or decay.
///
/// Its own clock and its own state, deliberately separate from the harmonic tracker: a crescendo is
/// not a chord change and voting on chord identity has nothing to say about it. Mixing them would
/// mean a piece that swells without changing harmony — the whole middle of the Adagio — produces no
/// dynamics report at all.
#[derive(Default)]
pub struct Swell {
    hist: Vec<(f32, f32)>,     // (time, dB), oldest first
    last_report: f32,
    reported_dir: i8,
}

impl Swell {
    /// The track changed, so everything before this instant is a different piece of music.
    ///
    /// THE BUG THIS EXISTS FOR, and it was invisible while the wrong assumption held. A sixty-second
    /// window with a different song at each end compares one recording's loudness to another's and
    /// calls the difference a crescendo. Measured live while the keeper skipped tracks: reports of
    /// +41 dB, and reversals of 8 dB inside one second, which is physically impossible for a
    /// sixty-second trend.
    ///
    /// Worth recording how it was found. Two causes were diagnosed from the numbers — threshold
    /// dithering and single-sample noise — and the second was measured and came back nearly
    /// irrelevant (sd 7.97 → 7.55 dB when averaged). The dominant term was this one, and it was
    /// unreachable because the monitor had been LABELLED "Adagio" by me and I reasoned from the
    /// label instead of reading the track events the feature was built to provide. The keeper asked
    /// whether I had read the title. I had not.
    pub fn track_changed(&mut self) {
        self.hist.clear();
        self.reported_dir = 0;
    }

    pub fn feed(&mut self, db: f32, now: f32) -> Option<Event> {
        // Silence is not a diminuendo. It is handled as silence, and letting it in here would make
        // every gap between movements a dramatic fade.
        if db <= -60.0 {
            self.hist.clear();
            self.reported_dir = 0;
            return None;
        }
        self.hist.push((now, db));
        let cutoff = now - SWELL_WINDOW_SECS;
        self.hist.retain(|&(t, _)| t >= cutoff);

        let span = now - self.hist.first()?.0;
        // Needs the full window before it can claim a trend. Reporting from two samples would make
        // the first seconds of every track a swell.
        if span < SWELL_WINDOW_SECS * 0.8 { return None; }

        // AVERAGED ENDS, NOT SINGLE SAMPLES. One 85 ms RMS reading is noisy — 1.42 dB of
        // frame-to-frame movement, measured — and differencing two of them adds both errors. A
        // second at each end is twelve readings, and the trend is what survives. Worth stating
        // honestly: measured against real audio this was a SMALL improvement (sd 7.97 → 7.55 dB),
        // because the variance was dominated by track boundaries rather than by sample noise. It is
        // kept because it is correct and cheap, not because it was the fix.
        let edge = 1.0f32;
        let mean_between = |lo: f32, hi: f32| -> Option<f32> {
            let v: Vec<f32> = self.hist.iter().filter(|(t, _)| *t >= lo && *t <= hi).map(|(_, d)| *d).collect();
            if v.is_empty() { None } else { Some(v.iter().sum::<f32>() / v.len() as f32) }
        };
        let t0 = self.hist.first()?.0;
        let db0 = mean_between(t0, t0 + edge)?;
        let db1 = mean_between(now - edge, now)?;

        let change = db1 - db0;
        let dir: i8 = if change >= SWELL_DB { 1 } else if change <= -SWELL_DB { -1 } else { 0 };
        if dir == 0 { return None; }
        // NOTE what this deliberately does NOT do: reset `reported_dir`. The first version cleared
        // it on every sub-threshold reading, so a level dithering across the threshold produced a
        // report every single frame — the gap only applied when the direction was unchanged, and a
        // reset made every crossing look like a new direction. Live, that was nine reports in five
        // seconds.
        if now - self.last_report < SWELL_MIN_GAP_SECS { return None; }
        self.last_report = now;
        self.reported_dir = dir;
        Some(Event::Swelling { rising: dir > 0, db: change, over: span })
    }
}

/// Emits on CHANGE, never on a clock. This is the whole cost model: a quiet room is free, a
/// held chord costs one line, and the stream is proportional to musical change rather than time.
#[derive(Debug, Clone, PartialEq)]
pub enum Event {
    Onset { hz: f32 },
    Silence,
    Intervals { names: Vec<String>, restless: bool, chord: Option<String> },
    /// Sustained growth or decay in loudness, over a span long enough to mean something.
    Swelling { rising: bool, db: f32, over: f32 },
    /// Tension that has not gone anywhere yet, on a BACKOFF: the wait doubles after each report, so
    /// a chord that hangs for a minute costs four lines rather than fifteen.
    ///
    /// The previous version of this comment claimed it was "reported once per threshold crossing,
    /// not repeatedly — an unresolved chord should not turn into a stream of complaints", and the
    /// code fired every four seconds forever. Live: eleven identical complaints counting 4.0, 8.0,
    /// 12.0 ... 44.1s. A comment describing the behaviour it wished for is the third instance of
    /// that groove today, and the most embarrassing, because it named the exact failure it allowed.
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

/// How long the harmony may be unreadable before held tension is abandoned rather than held.
///
/// Sound present, nothing winning a majority: a percussion passage, a sparse electronic track, a
/// transient. Three seconds is well past any single reading and well short of a musical phrase.
pub const UNREADABLE_ABANDON_SECS: f32 = 3.0;

#[derive(Default)]
pub struct Tracker {
    /// The last few readings, oldest first: interval set, silence, and the chord name.
    ///
    /// The chord is voted alongside the intervals rather than taken from the newest frame. A chord
    /// name is a much larger claim than an interval — one wrong pitch class turns B♭m into
    /// something else — so it should have to survive the same majority the intervals do.
    recent: Vec<(Vec<Interval>, bool, Option<String>)>,
    /// The stable set as last reported, held as NAMES rather than measurements.
    ///
    /// `Interval` carries `cents_off` — how far the measured pair sits from exact just intonation —
    /// and that number moves every window, because real tuning wobbles. Comparing whole structs
    /// therefore called the same chord a new chord and printed it again, byte-identical, live:
    ///
    ///     14:10:02  9:8 major second · 5:4 major third  — wants to move
    ///     14:10:02  9:8 major second · 5:4 major third  — wants to move
    ///
    /// The question being asked is "is this the same chord", not "is it tuned identically". So the
    /// belief keeps ratios only.
    confirmed: Option<(Vec<(u32, u32)>, bool)>,
    /// The chord name as last reported, kept beside the interval belief rather than inside it so a
    /// chord change over an unchanged interval set is still a change.
    confirmed_chord: Option<String>,
    restless_since: Option<f32>,
    last_nag: f32,
    /// How many times the current tension has been reported. The wait doubles each time.
    nags: u32,
    /// When the reading first became unreadable — sound present, nothing winning a majority.
    unreadable_since: Option<f32>,
}

impl Tracker {
    /// `now` is seconds since start. `nag_after` is how long tension may sit before it is worth
    /// a line; 0 disables it.
    pub fn feed(&mut self, m: Moment, now: f32, nag_after: f32) -> Vec<Event> {
        let mut out = Vec::new();

        self.recent.push((m.intervals.clone(), m.silent, m.chord.as_ref().map(|c| c.name.clone())));
        if self.recent.len() > VOTE_WINDOWS { self.recent.remove(0); }
        if self.recent.len() < VOTE_WINDOWS {
            return out;                       // not enough evidence to call anything yet
        }

        let need = VOTE_WINDOWS / 2 + 1;      // strict majority
        let silent = self.recent.iter().filter(|(_, s, _)| *s).count() >= need;
        // An interval survives if a majority of the recent readings contain it.
        let mut stable: Vec<Interval> = Vec::new();
        for (ivs, _, _) in &self.recent {
            for iv in ivs {
                if stable.iter().any(|e: &Interval| e.num == iv.num && e.den == iv.den) { continue; }
                let votes = self.recent.iter()
                    .filter(|(s, _, _)| s.iter().any(|e| e.num == iv.num && e.den == iv.den))
                    .count();
                if votes >= need { stable.push(*iv); }
            }
        }
        // The chord faces the same majority. No agreement means no name — the interval reading is
        // still there and is the honest fallback.
        let chord_name: Option<String> = {
            let mut best: Option<(usize, String)> = None;
            for (_, _, c) in &self.recent {
                if let Some(name) = c {
                    let votes = self.recent.iter().filter(|(_, _, x)| x.as_deref() == Some(name.as_str())).count();
                    if votes >= need && best.as_ref().map_or(true, |(v, _)| votes > *v) {
                        best = Some((votes, name.clone()));
                    }
                }
            }
            best.map(|(_, n)| n)
        };
        // CANONICAL ORDER, because first-appearance order is not stable. The vote walks a SLIDING
        // window, so which reading is seen first changes every frame and the same chord comes out
        // permuted — then a vector comparison calls it a new chord. Live, from one second:
        //
        //     2:1 octave · 4:3 fourth
        //     4:3 fourth · 2:1 octave
        //     2:1 octave · 4:3 fourth
        //
        // A previous comment here asserted the order was stable via first appearance. It was not,
        // and asserting it is what stopped it being checked. Sorting by JUST's own order also
        // means a chord always reads the same way to a human, simplest ratio first.
        stable.sort_by_key(|i| just_rank(i.num, i.den));
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
            let since = *self.unreadable_since.get_or_insert(now);
            // TENSION IS ABANDONED, NOT HELD, once the harmony stops being legible. The fix that
            // made an unreadable moment leave the chord belief untouched — correct, and mine — also
            // left the tension clock with no way to clear: the only path that clears it needs a
            // READABLE non-restless moment. So a sparse, bass-heavy track that produces no
            // corroborated voices left a major seventh "still unresolved" for forty-four seconds,
            // complaining about a chord that had stopped existing.
            //
            // Nothing resolved, so nothing is reported. Saying "resolved" would be a lie and saying
            // nothing further is what actually happened: the same shape as the end of the Adagio,
            // where the tension was left standing and the sound simply stopped.
            if now - since >= UNREADABLE_ABANDON_SECS {
                self.restless_since = None;
                self.nags = 0;
                return out;
            }
            if let Some(t0) = self.restless_since {
                if let Some(e) = self.nag(t0, now, nag_after) { out.push(e); }
            }
            return out;
        }
        self.unreadable_since = None;

        let names: Vec<(u32, u32)> = stable.iter().map(|i| (i.num, i.den)).collect();
        // The chord name is part of the identity: B♭m becoming D♭ over the same interval set is a
        // real harmonic change and would otherwise pass silently.
        let differs = self.confirmed.as_ref()
            .map(|(c, _)| *c != names).unwrap_or(true)
            || self.confirmed_chord != chord_name;
        if differs {
            out.push(Event::Intervals {
                names: stable.iter()
                    .map(|i| format!("{}:{} {}", i.num, i.den, i.name)).collect(),
                restless,
                chord: chord_name.clone(),
            });
            self.confirmed_chord = chord_name;
            match (self.restless_since, restless) {
                (None, true) => { self.restless_since = Some(now); self.last_nag = now; self.nags = 0; }
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
                    self.nags = 0;
                }
                _ => {}
            }
            self.confirmed = Some((names, silent));
        }

        // Tension runs on the clock, not on change: an unresolved chord that nobody touches is
        // exactly the case worth reporting, and it produces no differences to trigger on.
        if let Some(t0) = self.restless_since {
            if let Some(e) = self.nag(t0, now, nag_after) { out.push(e); }
        }
        out
    }

    /// Report held tension on a doubling backoff, or not at all.
    ///
    /// A flat interval fired every `nag_after` seconds forever: eleven lines counting 4.0, 8.0,
    /// 12.0 … 44.1s, live. Doubling gives 4s, 12s, 28s, 60s — the first report arrives just as
    /// promptly, and a chord that hangs for a minute costs four lines instead of fifteen. The
    /// interest in "it is STILL unresolved" genuinely decays; the reporting should too.
    fn nag(&mut self, t0: f32, now: f32, nag_after: f32) -> Option<Event> {
        if nag_after <= 0.0 { return None; }
        let wait = nag_after * (1u32 << self.nags.min(6)) as f32;
        if now - self.last_nag < wait { return None; }
        self.last_nag = now;
        self.nags += 1;
        Some(Event::StillUnresolved { secs: now - t0 })
    }
}

/// Run recorded frames through the whole analysis chain and return what the tracker said.
///
/// WHY THIS EXISTS. Every tracker change today was validated by asking the keeper to close the app,
/// wait ninety seconds, reopen it, play something, and describe what he saw. Six times. And each
/// comparison was against DIFFERENT music, which is what made one measurement — restless share
/// moving 28.4% → 45.3% — permanently uninterpretable: the build changed and the song changed and
/// nothing separates them.
///
/// The analysis is deterministic. Same peaks in, same events out. So one recorded pass becomes a
/// fixed reference, and any future change is a real A/B against real music with nobody pressing
/// play. Recording peaks rather than audio is the right granularity: it exercises fusion,
/// corroboration, naming, voting and the tracker — every layer that has broken — while staying
/// small enough to keep.
pub fn replay(frames: &[Frame], tol_cents: f32, nag_after: f32) -> Vec<(f32, Event)> {
    let mut t = Tracker::default();
    let mut swell = Swell::default();
    let mut out = Vec::new();
    for f in frames {
        for e in t.feed(moment(&f.peaks, tol_cents), f.at, nag_after) {
            out.push((f.at, e));
        }
        // Only when the recording carries a level. A fixture made before loudness was recorded has
        // none, and feeding a default would produce a flat line that reads as "no crescendo here" —
        // a missing measurement wearing the shape of a real one.
        if let Some(db) = f.db {
            if let Some(e) = swell.feed(db, f.at) { out.push((f.at, e)); }
        }
    }
    out
}

/// One recorded analysis frame.
#[derive(Clone, Debug, Default)]
pub struct Frame {
    pub at: f32,
    pub peaks: Vec<Peak>,
    /// Loudness in dBFS. `None` in fixtures recorded before dynamics existed, and a reader must
    /// treat that as UNKNOWN rather than silent.
    pub db: Option<f32>,
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
    fn the_same_chord_is_the_same_chord_however_it_is_tuned_or_ordered() {
        // Two live defects in one test, both of which printed the same chord again as though it
        // were new. Ordering: the vote walks a sliding window, so first-appearance order permutes
        // every frame. Tuning: Interval carries cents_off, which moves every window because real
        // tuning wobbles, and comparing whole structs made a hair of drift into a chord change.
        let a = Moment {
            fundamental: Some(220.0),
            intervals: vec![interval(220.0, 293.3, 30.0).unwrap(),      // fourth
                            interval(220.0, 440.0, 30.0).unwrap()],     // octave
            restless: false, silent: false, voices: vec![], chord: None,
        };
        // same two intervals, reversed, and each a few cents off — a different Vec<Interval>
        // entirely, and the same chord to any listener
        let b = Moment {
            fundamental: Some(220.0),
            intervals: vec![interval(220.0, 440.6, 30.0).unwrap(),
                            interval(220.0, 293.0, 30.0).unwrap()],
            restless: false, silent: false, voices: vec![], chord: None,
        };
        assert_ne!(a.intervals, b.intervals, "the inputs must genuinely differ as structs");

        let mut t = Tracker::default();
        let mut named = 0;
        for i in 0..24 {
            let m = if i % 2 == 0 { a.clone() } else { b.clone() };
            for e in t.feed(m, i as f32 * 0.085, 0.0) {
                if matches!(e, Event::Intervals { .. }) { named += 1; }
            }
        }
        assert_eq!(named, 1, "one chord, reordered and re-tuned, was announced {named} times");
    }

    #[test]
    fn a_chord_prints_simplest_ratio_first() {
        // Canonical order is also readable order: a human should not have to re-parse a chord
        // because the octave moved to the end.
        let m = Moment {
            fundamental: Some(220.0),
            intervals: vec![interval(220.0, 293.3, 30.0).unwrap(),      // fourth
                            interval(220.0, 440.0, 30.0).unwrap(),      // octave
                            interval(220.0, 330.0, 30.0).unwrap()],     // fifth
            restless: false, silent: false, voices: vec![], chord: None,
        };
        let mut t = Tracker::default();
        let mut got: Vec<String> = vec![];
        for i in 0..8 {
            for e in t.feed(m.clone(), i as f32 * 0.085, 0.0) {
                if let Event::Intervals { names, .. } = e { got = names; }
            }
        }
        assert_eq!(got, vec!["2:1 octave", "3:2 fifth", "4:3 fourth"],
                   "JUST's own order, simplest first: {got:?}");
    }

    #[test]
    fn a_chord_returning_after_an_unreadable_moment_is_not_announced_twice() {
        // Straight from the live ledger: the same line, back to back, same second. Sound present,
        // no interval winning a majority, so nothing is emitted — but the belief was being
        // overwritten anyway, and the chord's return read as a new chord.
        let held = Moment {
            fundamental: Some(440.0), intervals: vec![interval(440.0, 660.0, 25.0).unwrap()],
            restless: false, silent: false, voices: vec![], chord: None,
        };
        let unreadable = Moment {
            fundamental: Some(440.0), intervals: vec![], restless: false, silent: false, voices: vec![], chord: None,
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
            restless: true, silent: false, voices: vec![], chord: None,
        };
        let calm = Moment {
            fundamental: Some(440.0), intervals: vec![interval(440.0, 660.0, 25.0).unwrap()],
            restless: false, silent: false, voices: vec![], chord: None,
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
                chord: None,
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

    /// Equal-tempered frequency for a note name like "Bb3", "F4" — test scaffolding, so chord tests
    /// read as music rather than as a list of decimals.
    fn f(note: &str) -> f32 {
        let b = note.as_bytes();
        let (letter, rest) = (b[0] as char, &note[1..]);
        let (acc, oct) = if rest.starts_with('b') { (-1i32, &rest[1..]) }
                         else if rest.starts_with('#') { (1, &rest[1..]) }
                         else { (0, rest) };
        let base = match letter { 'C'=>0,'D'=>2,'E'=>4,'F'=>5,'G'=>7,'A'=>9,'B'=>11,_=>0 };
        let octave: i32 = oct.parse().unwrap();
        let midi = (octave + 1) * 12 + base + acc;
        440.0 * 2f32.powf((midi - 69) as f32 / 12.0)
    }

    #[test]
    fn loudness_tracks_energy_and_silence_floors_rather_than_diverging() {
        let loud = rms_db(&tone(&[(440.0, 0.9)]));
        let soft = rms_db(&tone(&[(440.0, 0.09)]));
        assert!(loud > soft + 15.0, "10x amplitude is ~20 dB: {loud:.1} vs {soft:.1}");
        assert_eq!(rms_db(&vec![0.0; 512]), -100.0, "silence must floor, not go to -inf");
        assert_eq!(rms_db(&[]), -100.0);
        assert!(rms_db(&vec![0.0; 512]).is_finite(), "-inf poisons every average downstream");
    }

    #[test]
    fn a_crescendo_as_slow_as_the_adagios_is_actually_detected() {
        // THE CONSTRAINT THAT SET THE WINDOW. The reference piece rises ~25 dB over six minutes,
        // about 0.07 dB/sec. A four-second comparison window sees 0.3 dB of that — noise — and a
        // detector tuned that way reports nothing through the most famous crescendo in the
        // repertoire. This feeds that exact slope and demands a report.
        let mut s = Swell::default();
        let mut got = None;
        for i in 0..900 {                       // 75 seconds at 12 frames/sec
            let t = i as f32 / 12.0;
            if let Some(e) = s.feed(-40.0 + 0.07 * t, t) {
                if got.is_none() { got = Some(e); }
            }
        }
        match got {
            Some(Event::Swelling { rising, db, over }) => {
                assert!(rising, "a rising slope reported as falling");
                // Against the CONSTANTS, not against copies of them. The first version of these
                // assertions hardcoded 4.0 dB, and when the threshold moved to 3.0 the test failed
                // on a perfectly correct 3.4 dB report — a test measuring an old decision rather
                // than the rule it is supposed to protect.
                assert!(db >= SWELL_DB, "reported {db:.1} dB, below its own threshold of {SWELL_DB}");
                assert!(over >= SWELL_WINDOW_SECS * 0.8,
                        "claimed a span of {over:.1}s, under the minimum it requires");
            }
            other => panic!("the Adagio's own crescendo went unreported: {other:?}"),
        }
    }

    #[test]
    fn held_tension_backs_off_instead_of_complaining_forever() {
        // Eleven identical lines, live, counting 4.0 8.0 12.0 … 44.1s — while the doc comment on the
        // event claimed it reported "once per threshold crossing, not repeatedly".
        let tense = moment(&[Peak { hz: 440.0, mag: 1.0 },
                             Peak { hz: 440.0 * 2f32.powf(6.0 / 12.0), mag: 0.9 }], 30.0);
        let mut t = Tracker::default();
        let mut nags = 0;
        for i in 0..1200 {                                   // 100 seconds of unbroken tension
            for e in t.feed(tense.clone(), i as f32 / 12.0, 4.0) {
                if matches!(e, Event::StillUnresolved { .. }) { nags += 1; }
            }
        }
        assert!(nags >= 1, "a minute of held tension said nothing");
        // Flat 4s would give ~25. Doubling gives 4, 12, 28, 60 — four inside 100 seconds.
        assert!(nags <= 6, "100s of held tension produced {nags} complaints");
    }

    #[test]
    fn tension_is_abandoned_when_the_harmony_stops_being_readable() {
        // Self-inflicted, and found live on a sparse bass-heavy track. Making an unreadable moment
        // leave the chord belief untouched — correct — also left the tension clock unclearable,
        // because the only path that clears it needs a READABLE non-restless moment. Result: a major
        // seventh "still unresolved · 44.1s", complaining about a chord that had stopped existing.
        let tense = moment(&[Peak { hz: 440.0, mag: 1.0 },
                             Peak { hz: 440.0 * 2f32.powf(6.0 / 12.0), mag: 0.9 }], 30.0);
        let unreadable = Moment {
            fundamental: Some(440.0), intervals: vec![], restless: false,
            silent: false, voices: vec![], chord: None,
        };
        let mut t = Tracker::default();
        for i in 0..12 { t.feed(tense.clone(), i as f32 / 12.0, 4.0); }
        let mut nags = 0;
        for i in 12..600 {                                   // 49 seconds of unreadable audio
            for e in t.feed(unreadable.clone(), i as f32 / 12.0, 4.0) {
                if matches!(e, Event::StillUnresolved { .. }) { nags += 1; }
            }
        }
        assert!(nags <= 1, "unreadable audio produced {nags} tension complaints");
        // And nothing is claimed to have resolved, because nothing did.
        let after: Vec<_> = (600..660).flat_map(|i| t.feed(unreadable.clone(), i as f32 / 12.0, 4.0)).collect();
        assert!(!after.iter().any(|e| matches!(e, Event::Resolved { .. })),
                "abandoned tension must not be reported as resolved: {after:?}");
    }

    #[test]
    fn a_track_change_does_not_read_as_a_crescendo() {
        // Live, while the keeper skipped through three songs in six seconds: reports of +41 dB and
        // reversals of 8 dB inside one second. A sixty-second window with a different song at each
        // end compares one recording's loudness to another's. Here: a quiet track, then a loud one.
        let mut s = Swell::default();
        for i in 0..900 { s.feed(-40.0, i as f32 / 12.0); }        // 75s of quiet
        s.track_changed();
        let mut n = 0;
        for i in 900..1500 {                                       // 50s of loud, same level
            if s.feed(-15.0, i as f32 / 12.0).is_some() { n += 1; }
        }
        assert_eq!(n, 0, "a track change produced {n} swell reports; 25 dB of it is the SONG changing");
    }

    #[test]
    fn a_level_dithering_across_the_threshold_does_not_report_every_frame() {
        // Nine reports in five seconds, live. The gap only applied when the direction was unchanged,
        // and a sub-threshold reading RESET the remembered direction — so every crossing looked like
        // a new direction and bypassed the debounce entirely.
        let mut s = Swell::default();
        let mut n = 0;
        for i in 0..1800 {                                         // 150 seconds
            let t = i as f32 / 12.0;
            // A slope that sits right on the threshold and wobbles across it, which is what real
            // audio does and what no noiseless test slope can produce.
            let jitter = if i % 2 == 0 { 0.9 } else { -0.9 };
            if s.feed(-30.0 + 0.05 * t + jitter, t).is_some() { n += 1; }
        }
        // 150s at one report per 8s is at most ~19 even if it never stops trending.
        assert!(n <= 19, "dithering across the threshold produced {n} reports in 150s");
    }

    #[test]
    fn a_steady_level_reports_nothing_at_all() {
        // The other wall. A detector that fires on a flat line is a clock, not a dynamics reading.
        let mut s = Swell::default();
        let mut n = 0;
        for i in 0..1200 {
            let t = i as f32 / 12.0;
            // steady with a little jitter, as real audio is
            let db = -30.0 + if i % 3 == 0 { 0.4 } else { -0.3 };
            if s.feed(db, t).is_some() { n += 1; }
        }
        assert_eq!(n, 0, "a steady level produced {n} swell reports");
    }

    #[test]
    fn a_long_crescendo_does_not_become_a_stream_of_identical_lines() {
        let mut s = Swell::default();
        let mut n = 0;
        for i in 0..3600 {                      // five minutes
            let t = i as f32 / 12.0;
            if s.feed(-50.0 + 0.08 * t, t).is_some() { n += 1; }
        }
        assert!(n >= 1, "five minutes of crescendo said nothing");
        assert!(n <= 40, "five minutes of crescendo produced {n} lines");
    }

    #[test]
    fn silence_is_not_a_diminuendo() {
        // Otherwise every gap between movements becomes a dramatic fade.
        let mut s = Swell::default();
        for i in 0..600 { let t = i as f32 / 12.0; s.feed(-25.0, t); }
        for i in 600..900 {
            let t = i as f32 / 12.0;
            assert!(s.feed(-100.0, t).is_none(), "silence reported as a fade at t={t:.1}");
        }
    }

    #[test]
    fn a_fade_is_reported_as_falling() {
        let mut s = Swell::default();
        let mut got = None;
        for i in 0..900 {
            let t = i as f32 / 12.0;
            if let Some(e) = s.feed(-20.0 - 0.2 * t, t) { if got.is_none() { got = Some(e); } }
        }
        match got {
            Some(Event::Swelling { rising, db, .. }) => {
                assert!(!rising);
                assert!(db < 0.0, "a fade reported a positive change of {db:.1}");
            }
            other => panic!("a clear fade went unreported: {other:?}"),
        }
    }

    #[test]
    fn three_notes_get_named_as_the_chord_they_are() {
        // All afternoon a B♭ minor triad reached the reader as "3:2 fifth · 6:5 minor third" and the
        // assembling was done by hand every time.
        assert_eq!(chord(&[f("Bb3"), f("Db4"), f("F4")]).unwrap().name, "B♭m");
        assert_eq!(chord(&[f("C4"), f("E4"), f("G4")]).unwrap().name, "C");
        assert_eq!(chord(&[f("F3"), f("A3"), f("C4"), f("Eb4")]).unwrap().name, "F7");
        assert_eq!(chord(&[f("Bb3"), f("Db4"), f("F4"), f("Ab4")]).unwrap().name, "B♭m7");
        assert_eq!(chord(&[f("B3"), f("D4"), f("F4")]).unwrap().name, "Bdim");
        assert_eq!(chord(&[f("C4"), f("F4"), f("G4")]).unwrap().name, "Csus4");
    }

    #[test]
    fn a_seventh_chord_is_not_reported_as_a_triad_with_a_stranger() {
        // The scoring rule that matters: a full dominant seventh fits `major` with one note spare
        // and `7` with none, so the specific reading must win.
        let c = chord(&[f("F3"), f("A3"), f("C4"), f("Eb4")]).unwrap();
        assert_eq!(c.name, "F7");
        assert_eq!(c.extra, 0, "nothing should be left unexplained");
    }

    #[test]
    fn two_notes_are_an_interval_and_are_not_given_a_chord_name() {
        // A real limit, not a conservative default. C and E♭ are equally the bottom of Cm, the top
        // of A♭6, and the middle of a diminished seventh — naming one invents the context.
        assert!(chord(&[f("C4"), f("Eb4")]).is_none());
        assert!(chord(&[f("A3"), f("E4")]).is_none());
        assert!(chord(&[f("A3")]).is_none());
        assert!(chord(&[]).is_none());
    }

    #[test]
    fn a_triad_missing_its_third_is_not_named_a_triad() {
        // Root, fifth, octave — the commonest thing in the ledger, and it has no quality at all.
        // Calling it major would be a guess dressed as a reading.
        let c = chord(&[f("Bb2"), f("F3"), f("Bb3")]);
        assert!(c.is_none(), "root-fifth-octave was named {:?}", c.map(|x| x.name));
    }

    #[test]
    fn an_inversion_names_its_bass() {
        // The lowest note changes what a chord DOES even when it does not change what it is.
        let c = chord(&[f("Db3"), f("F3"), f("Bb3")]).unwrap();
        assert_eq!(c.name, "B♭m/D♭");
        assert!(c.inversion);
        let root_pos = chord(&[f("Bb2"), f("Db3"), f("F3")]).unwrap();
        assert_eq!(root_pos.name, "B♭m");
        assert!(!root_pos.inversion);
    }

    #[test]
    fn two_unexplained_notes_mean_it_is_not_that_chord() {
        // One stranger is a passing tone. Two is a coincidence, and a name would be false
        // confidence — the interval reading is the honest fallback and is already there.
        let c = chord(&[f("C4"), f("E4"), f("G4"), f("C#4"), f("F#4")]);
        assert!(c.is_none(), "named {:?} despite two foreign notes", c.map(|x| x.name));
    }

    #[test]
    fn octave_doubling_does_not_change_the_chord() {
        // Voices land in whatever register the music put them; a doubled root is one pitch class.
        let a = chord(&[f("Bb2"), f("Db4"), f("F4")]).unwrap().name;
        let b = chord(&[f("Bb2"), f("Bb3"), f("Db4"), f("F4"), f("F5")]).unwrap().name;
        assert_eq!(a, b);
    }

    #[test]
    fn a_frequency_names_the_note_it_actually_is() {
        // 467 Hz was reported as "~467 Hz" all afternoon while the piece was in B♭ minor, and the
        // keeper and I both had to convert it in our heads every time.
        assert_eq!(note_name(440.0).0, "A4");
        assert_eq!(note_name(466.16).0, "B♭4");     // the Adagio's tonic
        assert_eq!(note_name(261.63).0, "C4");
        assert_eq!(note_name(27.5).0, "A0");        // bottom of a piano
        assert_eq!(note_name(4186.0).0, "C8");      // top of one
        assert!(note_name(440.0).1.abs() < 1.0, "A4 is exactly A4");
    }

    #[test]
    fn tuning_drift_is_reported_rather_than_rounded_away() {
        // A name alone discards the only evidence about WHICH B♭ this is: an orchestra tuning sharp
        // and a flat sample both land on the same letter.
        let (name, cents) = note_name(466.16 * 2f32.powf(30.0 / 1200.0));   // 30 cents sharp
        assert_eq!(name, "B♭4");
        assert!((cents - 30.0).abs() < 2.0, "expected ~+30 cents, got {cents:.1}");
        let (_, flat) = note_name(466.16 * 2f32.powf(-25.0 / 1200.0));
        assert!(flat < -20.0, "a flat reading must report a negative drift, got {flat:.1}");
    }

    #[test]
    fn a_subsonic_reading_does_not_panic_or_index_out_of_bounds() {
        // The capture reports peaks below hearing routinely — 10 Hz and 22 Hz both appeared live.
        for hz in [0.0, -1.0, 1.0, 8.0, 22.0] {
            let (n, _) = note_name(hz);
            assert!(!n.is_empty(), "{hz} Hz produced no name");
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
