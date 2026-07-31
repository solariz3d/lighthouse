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
/// SIXTY SECONDS, FIVE DECIBELS, A REGRESSION SLOPE — every one of these swept against a complete
/// recording of the reference piece rather than reasoned about, after three live attempts failed.
///
/// WHY NOT END-DIFFERENCING, which is what this was. Comparing the two ends of a window measures
/// phrasing and calls it form. Measured on the real recording, the scatter of an end-to-end
/// comparison was sd 10.32 dB at one-second edges and still 6.52 dB at fifteen — this music's
/// phrase-to-phrase variation is simply larger than any threshold that could still detect an arc.
/// Smoothing the ends cannot rescue it. A least-squares slope uses every sample in the window
/// instead of two, and that is a different measurement, not a tuned one.
///
/// WHY SIXTY AND NOT LONGER, which was my instinct and was backwards. Swept against the piece's own
/// 15-second dynamic arc as ground truth, counting how often the detector CONTRADICTED it:
///
///     window  thresh   fired   agrees   contradicts
///        60s     5 dB    298      226        5
///        60s     8 dB    227      184        0
///        90s     3 dB    373      216       69
///       120s     3 dB    342      131      114
///
/// A longer window lags: by the time 120 seconds of history establishes a rise, the music has
/// turned, so it confidently reports the opposite of what is happening.
///
/// WHY FIVE AND NOT EIGHT, and this is a judgement rather than an optimum. Eight decibels scores
/// perfectly — zero contradictions — and MISSES THE CLIMB TO THE CLIMAX. The arc rises 9.2 dB from
/// 5:00 to 6:15, which is 7.4 dB across sixty seconds, just under that bar. A detector that earns a
/// clean sheet by not hearing the thing the piece is famous for is the same going-deaf failure this
/// file has now recorded five times. Five decibels catches it and is wrong five times in ten
/// minutes. That trade is deliberate.
///
/// WHAT IT DOES NOT DO, stated rather than discovered later: the piece's GLOBAL average slope is
/// about 0.056 dB/sec, which is 3.4 dB per minute and below this threshold on purpose. This tracks
/// the arc's local movement — phrase swells of five to ten decibels — not the whole-piece average.
/// For the global shape the per-frame level is the honest source, and the fixture is where to read it.
const SWELL_WINDOW_SECS: f32 = 60.0;
const SWELL_DB: f32 = 5.0;
const SWELL_MIN_GAP_SECS: f32 = 15.0;

/// How much of the window's head the refit drops before fitting again.
///
/// WHAT THE REFIT IS FOR. `from` says where the window opened; it does not say whether the trend is
/// the music. Measured across the corpus, a floor-level head is NECESSARY AND NOT SUFFICIENT — the
/// Adagio's opening (an artifact) and Fratres' opening (real music that genuinely begins near the
/// noise floor) open 0.03 dB apart and reach opposite verdicts. Fitting the window again with its
/// entrance removed is the only measurement that has separated them: the two artifacts collapse to
/// −0.44 and 0.10 of the reported figure, the three real openings hold 0.79 to 1.11.
///
/// SIX SECONDS, AND THE NUMBER IS THE WEAK PART. It is the measured length of the Adagio's entrance
/// out of digital silence — i.e. it comes from one of the cases it adjudicates, which is the shape
/// of constant this file has been wrong about before. Swept rather than assumed (`conf_sweep`):
///
///     trim      3 s     6 s    10 s    15 s
///     Adagio t=116.8 (artifact)   +1.9   −4.8   −6.6   −6.6      reported +11.0
///     Adagio t=536.6 (artifact)   +0.7   +0.7   +1.9   +2.7      reported  +7.0
///     Fratres t=1349.1 (real)    +27.2  +23.9  +20.2  +14.3      reported +30.3
///
/// At 6 s the separation is clean; at 15 s it narrows to 0.39 against 0.47, and 9 of 83 corpus
/// windows change the SIGN of their refit somewhere across those four trims — including the first
/// artifact, which does not reverse at all at 3 s. So the trim ships ON THE EVENT rather than being
/// left implicit, and the refit ships as a number rather than as a verdict. n here is five.
const SWELL_REFIT_TRIM_SECS: f32 = 6.0;

/// Least-squares slope of (time, dB), in dB per second.
///
/// One copy, called twice: once for the window and once for the refit past its head. Two copies of a
/// regression differing only in their input is the mirror this repo has already paid for, and the
/// refit exists precisely to be compared against the first number — which it cannot honestly be if
/// the two are computed by different code.
fn trend(hist: &[(f32, f32)]) -> Option<f32> {
    let n = hist.len() as f32;
    if n < 2.0 { return None; }
    let mean_t = hist.iter().map(|(t, _)| *t).sum::<f32>() / n;
    let mean_db = hist.iter().map(|(_, d)| *d).sum::<f32>() / n;
    let (mut num, mut den) = (0.0, 0.0);
    for (t, d) in hist {
        num += (t - mean_t) * (d - mean_db);
        den += (t - mean_t) * (t - mean_t);
    }
    if den <= 0.0 { return None; }
    Some(num / den)
}

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
        self.forget();
    }

    /// Everything this detector remembers, dropped in one place.
    ///
    /// There are three reasons to forget — a track change, an onset, and silence — and before this
    /// existed each cleared its own subset. `last_report` was cleared by none of them, which is not
    /// cosmetic the way it looks: it is a timestamp from a DIFFERENT PIECE OF MUSIC gating the first
    /// report about the next one, so the first post-boundary report landed at 48 s sometimes and 56 s
    /// other times depending on where the previous track's last report happened to fall. Two of the
    /// three fields were being cleared and the third was not, which is the kind of asymmetry that is
    /// invisible until someone plots a histogram of the spans and finds it bimodal. One method now,
    /// so a fourth reason to forget cannot reintroduce the gap.
    fn forget(&mut self) {
        self.hist.clear();
        self.reported_dir = 0;
        self.last_report = 0.0;
    }

    /// The music just started. Nothing before this instant is the music.
    ///
    /// MEASURED, from the level trace of a real pass rather than reasoned about:
    ///
    ///     50s  mean -100.0          silence, capture running, nothing playing
    ///     60s  mean  -92.2  (-100 to -52)   the music beginning
    ///     80s  mean  -24.6          the music
    ///
    /// The silence guard clears history below -60 dB, and the fade-in passes straight through
    /// underneath it at -52. Those transitional frames became the window's early end, so the
    /// opening of every track read as a 30 dB crescendo — reported live at +29.7 and +33.3 dB,
    /// which I nearly accepted because the Adagio really does begin near-inaudible. "Plausible and
    /// large" was the shape of the last two things I got wrong, so this time the trace got read
    /// first.
    pub fn sound_began(&mut self) {
        self.forget();
    }

    pub fn feed(&mut self, db: f32, now: f32) -> Option<Event> {
        // Silence is not a diminuendo. It is handled as silence, and letting it in here would make
        // every gap between movements a dramatic fade.
        if db <= -60.0 {
            self.forget();
            return None;
        }
        self.hist.push((now, db));
        let cutoff = now - SWELL_WINDOW_SECS;
        self.hist.retain(|&(t, _)| t >= cutoff);

        let span = now - self.hist.first()?.0;
        // Needs the full window before it can claim a trend. Reporting from two samples would make
        // the first seconds of every track a swell.
        if span < SWELL_WINDOW_SECS * 0.8 { return None; }

        // A LEAST-SQUARES SLOPE OVER EVERY SAMPLE, not a difference between two ends. Averaging the
        // ends was the previous attempt and it does not work on this signal at any edge length: the
        // scatter measured sd 10.32 dB at one second and 6.52 dB at fifteen, against a threshold
        // that has to stay small enough to detect an arc. The trend is in all N points, so it is
        // read from all N points. Reported as dB ACROSS THE WINDOW, which is the quantity a listener
        // would name.
        if self.hist.len() < 8 { return None; }
        let slope = trend(&self.hist)?;
        let change = slope * span;
        // WHERE THE WINDOW STARTED, carried on the event because the number above cannot be read
        // without it. `+30.9 dB over 48s` from -57 dB and the same figure from -25 dB are different
        // claims: the first is a window whose head sits at the noise floor — a playback ramp, a
        // track's first seconds — and the second is music getting louder. B measured 10 of 16
        // eligible track starts producing a report pinned to the boundary, and could not tell the
        // artifacts from the real openings retroactively BECAUSE THE STREAM DROPS THIS FIELD; three
        // of the four it could check by refitting were real music. An independent cold read of the
        // stream reached the same gap from the other side (COLDREAD-2026-07-31.md, item 8) and asked
        // for a `clipped_by:"track_start"` flag. The head level subsumes that: truncation is the
        // symptom, and a flag would not say how far down.
        //
        // NECESSARY, NOT SUFFICIENT — said here because it is easy to oversell and B's own numbers
        // refute the stronger version. A floor head does not make a report an artifact: measured on
        // this corpus, the Adagio's opening (an artifact, its 43 seconds of named music are FALLING)
        // and Fratres' opening (real music, which genuinely begins near -59 dB and climbs) both
        // report floor heads. What separates those two is refitting the window with its leading
        // seconds removed, which needs per-frame levels the stream does not carry and probably never
        // should. So this field makes the candidates greppable; it does not adjudicate them. A gauge,
        // not a verdict.
        //
        // THE RAW FIRST SAMPLE, and I built the fitted intercept first for what looked like the
        // better reason. This signal's single-sample scatter is sd 10.32 dB — the reason the slope
        // is least-squares rather than an end difference — so the fit seemed the obviously more
        // robust estimator, and it makes `from + db` the fitted level at the window's end, which is
        // checkable arithmetic. Then I measured it against the corpus and it fails the one case the
        // field exists for: the Adagio's opening report covers a 6-second entrance out of digital
        // silence followed by 42 seconds of music, and a least-squares line through that is
        // dominated by the bulk — FITTED HEAD -35.3 dB for a window whose first sample is -59.4.
        // It reported no floor where there plainly was one. Worse, it ranked that artifact ABOVE
        // Fratres' genuine floor-level opening (fitted -48.6), which is backwards.
        //
        // So: the raw head, which answers the question actually being asked — where does this
        // window BEGIN — rather than a better estimate of a different quantity. The noise argument
        // was real and turned out not to matter here: the distinction being drawn is 25 to 40 dB,
        // an order of magnitude above the scatter.
        let from = self.hist.first()?.1;
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
        // The same window without its head, fitted again — see SWELL_REFIT_TRIM_SECS. Computed here
        // rather than left to a reader with a fixture, because the per-frame levels this needs are
        // in memory now and are not in the stream; B's whole analysis of which openings were real
        // had to reconstruct them offline, and only the three checkable ones could be settled.
        let head_cut = self.hist.first()?.0 + SWELL_REFIT_TRIM_SECS;
        let tail: Vec<(f32, f32)> = self.hist.iter().cloned().filter(|(t, _)| *t >= head_cut).collect();
        let refit_db = trend(&tail).map(|s| s * (span - SWELL_REFIT_TRIM_SECS).max(1.0)).unwrap_or(change);
        Some(Event::Swelling { rising: dir > 0, db: change, over: span, from,
                               refit_db, trim_s: SWELL_REFIT_TRIM_SECS })
    }
}

/// A pulse: how fast, how strongly, and how mechanically.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct PulseReading {
    pub bpm: f32,
    /// PHASE-LOCK, 0..1: does a grid at this period keep its phase across the recording?
    ///
    /// Redefined, and the redefinition is the whole repair. This used to be the height of an
    /// autocorrelation peak, which measures nothing about whether a pulse exists — it read 0.26–0.40
    /// on beatless orchestral music, and with a better onset function it read 0.77 there, higher than
    /// on a real beat. This is instead the concentration of the phase STEP between consecutive
    /// non-overlapping windows of two periods each. A real grid keeps a constant step; a coincidental
    /// periodicity random-walks. Chance level is 1/sqrt(n). Below `PULSE_MIN_STRENGTH` nothing is
    /// claimed.
    pub strength: f32,
    /// How mechanical it is, 0..1. A drum machine sits near 1; an orchestra with rubato sits low.
    /// This is the part no metadata carries — a BPM is published, a feel is not.
    ///
    /// Now measured over EVERY retained tempo estimate rather than the ones near the median. The old
    /// version filtered to the agreeing subset and then reported how tightly that subset clustered, so
    /// it read 0.96–0.99 on readings that jumped 237 → 55 bpm. Selecting for agreement and then
    /// reporting agreement is a number that cannot come out low.
    pub steady: f32,
    /// What `strength` would read if there were no pulse at all: 1/sqrt(n) over the n phase steps
    /// this reading was measured from.
    ///
    /// THIS IS WHY `strength` MAY BE CALLED A CONFIDENCE AND NOTHING ELSE IN THIS FILE MAY. A 0..1
    /// number is a rank dressed as a probability unless something says what it reads when the thing
    /// is absent — and 0.6 means nothing while "0.6 against a chance of 0.17" means everything. The
    /// null is not a constant: n varies with tempo and memory, so it travels per reading rather than
    /// being stated once and quietly going stale.
    pub chance: f32,
}

/// Tempo from the loudness series, by phase rather than by correlation height.
///
/// THE REDESIGN, and what forced it. The first version autocorrelated a rectified level difference and
/// reported the peak height as confidence. Against two orchestral recordings with no drum kit it
/// produced 17 and 21 confident tempos spanning 51–237 bpm. Four defects, each measured:
///
/// 1. AUTOCORRELATION HEIGHT MEASURES NOTHING about whether a pulse exists. On the fixtures it read
///    0.26–0.40, and with a better onset function it read 0.77 on the Adagio — HIGHER than on a real
///    beat. No threshold can separate what does not separate.
/// 2. THE CONFIDENCE WAS CIRCULAR. `steady` filtered the estimates to those near the median and then
///    measured how tightly that subset clustered, so it could not come out low.
/// 3. THE AGREEMENT WINDOW WAS ONE SECOND LONG. Twelve estimates at 11.7 Hz from 8-second windows span
///    1.03 s of new audio, and overlapping windows agree with themselves. This is why the 51–237
///    scatter never tripped the gate that existed to catch it.
/// 4. INTRODUCED WHILE FIXING THE OTHERS, kept here because anyone reaching for the obvious fix will
///    re-introduce it: searching FRACTIONAL lags in an autocorrelation requires interpolating the
///    series, interpolation low-passes it, and integer lags therefore win. Measured: 74% of chosen lags
///    on the Adagio landed within 0.1 of an integer where uniform would be 20%. Disjoint windows then
///    "agreed on a tempo" because they were agreeing with the SAMPLING GRID — and that fake agreement
///    looked exactly like a stable 78.6 bpm pulse in the Pärt, six times over, to one decimal place.
///
/// WHAT IT DOES INSTEAD. A Fourier tempogram evaluated at the frames' ACTUAL timestamps:
///
///     X(T) = sum_i o_i * exp(-2*pi*i*t_i/T)        R(T) = |X(T)| / sum_i o_i
///
/// R is a weighted circular resultant — 1 when the onset energy lands at one phase of T, ~0 when it is
/// spread around the cycle. Using the real timestamps means there is no lag grid to agree with; the
/// frame interval jitters, which here is the point. And unlike a correlation it keeps PHASE, which is
/// the statistic that actually separates a beat from a coincidence: a real grid holds its phase across
/// the recording, a coincidental periodicity random-walks. See `PulseReading::strength`.
///
/// WHY NOT PER-BAND SPECTRAL FLUX, which is the textbook answer and was tried: the recorded frames
/// carry the top ten spectral peaks above a RELATIVE floor, not a magnitude spectrum, and in a
/// bass-heavy mix that list collapses to one or two entries. Measured on a real beat, banded flux
/// scored 0.11 against 0.45 for plain level flux. Ten peaks are not a spectrogram.
///
/// WHAT IT CANNOT DO, stated rather than found later. It reports a PERIOD, not a downbeat. The 85 ms
/// frame is larger than the ±70 ms tolerance the field uses for beat LOCATION, so this can say how
/// fast and never exactly when — and a finer onset function cannot be validated offline at all, since
/// the fixtures record peaks rather than audio.
///
/// Measured on real material it is honest but conservative. Four recordings captured off a live
/// session: it locks onto ONE (a programmed electronic remix, at its real tempo), stays silent on two,
/// and the fourth held only 68 s of audio — too short to fill a memory that needs 45 s, so untested
/// rather than missed, which leaves hip-hop with a programmed beat a class with no coverage. Silence
/// rather than confident nonsense is the designed direction, but one confirmed positive is a claim
/// about one song.
#[derive(Default)]
pub struct Pulse {
    /// (time, onset) — the rectified log-domain flux, over `PULSE_MEMORY_SECS`.
    hist: Vec<(f32, f32)>,
    /// (time, folded bpm) — one per analysis window. EVERY one is kept and counted; the old code's
    /// fatal move was filtering these before measuring how much they agreed.
    est: Vec<(f32, f32)>,
    prev_db: Option<f32>,
    win_start: f32,
    last_report: f32,
    reported: Option<f32>,
}

/// Seconds per period estimate. Shorter and slow tempi have too few cycles to measure: the 72 bpm
/// synthetic case fails outright at 3 s.
const PULSE_WINDOW_SECS: f32 = 5.0;
/// How much history the confidence is measured over. This is the number that was effectively 1.03 s.
///
/// THE MEMORY LENGTH IS THE CONFIDENCE, which is why this is not a tuning knob. A detector that will
/// not speak until it has 40 seconds of evidence is the price of the negative control holding, and the
/// latency is therefore a property rather than a defect to be optimised away later — see
/// `a_pulse_needs_forty_seconds_of_evidence_before_it_will_speak`, which exists to make that cost
/// visible. Shortening this trades silence on beatless music for speed; the sweep in
/// `PULSE_MIN_STRENGTH` is what that trade costs.
const PULSE_MEMORY_SECS: f32 = 40.0;
const PULSE_MIN_BPM: f32 = 50.0;
const PULSE_MAX_BPM: f32 = 210.0;
/// Tempogram resolution. 0.5 bpm is finer than the 6% the tests ask for at every tempo in range.
const PULSE_BPM_STEP: f32 = 0.5;
/// Minimum phase-lock before a tempo is claimed, set from the CHANCE LEVEL rather than from the
/// fixtures — a threshold tuned until two recordings go quiet is fitted to those two recordings.
///
/// The statistic is a circular resultant over n phase steps, so under a null of no grid it sits at
/// ~1/sqrt(n). This memory yields n ≈ 24 at 75 bpm and n ≈ 42 at 128 bpm, i.e. chance 0.20 down to
/// 0.15, and 0.6 is three to four times chance across the range.
///
/// WHY THE THRESHOLD IS NOT WHERE THE WORK WENT, and the finding worth carrying out of this file:
/// A TYPICAL VALUE AND AN EXTREME ONE ARE DIFFERENT QUANTITIES. At a 25 s memory these same three
/// beatless recordings put 45 readings through this gate with locks running p50 0.299 — comfortably
/// under any threshold — and a MAXIMUM of 0.843, which is above every threshold that still detects a
/// real beat. An eleven-minute negative gets ~45 independent tries and the maximum of 45 samples is
/// not the median, so a constant calibrated against a typical value and evaluated against an extremum
/// leaks by construction. Raising the threshold cannot fix that; only reducing the number of tries, or
/// making each one stronger, can. Lengthening the memory does both. Measured
/// (negatives leaked / real beat found / synthetic four-tempo test):
///
///     memory 25 s -> 2 leaked / found / passes on a 30 s fixture
///     memory 40 s -> 0 leaked / found / passes on a 60 s fixture
///     memory 50 s -> 0 leaked / found / needs a longer fixture still
///     memory 75 s -> 0 leaked / found / needs a longer fixture still
///
/// So if this ever leaks, LENGTHEN THE MEMORY and the synthetic fixture with it. Never raise this
/// constant — that is fitting it to whichever recordings happen to be in tests/.
const PULSE_MIN_STRENGTH: f32 = 0.6;
/// How many of the retained tempo estimates must fall within `PULSE_AGREE_TOL` of a common centre.
/// Necessary and NOT sufficient: the Pärt reaches 100% here, and only phase-lock catches it.
const PULSE_MIN_AGREEMENT: f32 = 0.7;
const PULSE_AGREE_TOL: f32 = 0.06;
/// Without transients there is no rhythm, however well anything else normalises. The p90 per-frame
/// rise: a beatless 2 dB swell peaks at 0.09 dB, the Adagio at 1.6, real beat-carrying music at 3.
const PULSE_TRANSIENT_DB: f32 = 0.3;
/// Fewer phase samples than this and the lock statistic is indistinguishable from chance.
const PULSE_MIN_PHASE_SAMPLES: usize = 10;
/// Tempo octave the report is folded into: 174 bpm and 87 bpm are the same pulse counted differently.
const PULSE_FOLD_LO: f32 = 70.0;
/// A tempo must differ by more than this to be a new tempo rather than jitter on the same one.
const PULSE_CHANGE_BPM: f32 = 6.0;
const PULSE_MIN_GAP_SECS: f32 = 20.0;

/// Still OFF, and the reason has changed — which is why this is rewritten rather than deleted.
///
/// The original refusal stands as history: the autocorrelation version produced 17 and 21 confident
/// tempos on two beatless orchestral recordings, with a confidence that could not come out low.
/// `Pulse` has since been redesigned around phase rather than correlation height (see its doc
/// comment), and at a 40 s memory it clears both walls — the orchestral recordings produce nothing and
/// the five synthetic tests still pass.
///
/// It stays dark on ONE remaining ground, and it is not a threshold: THE POSITIVE SIDE RESTS ON ONE
/// RECORDING. Four real captures exist — it locks onto one at its true tempo, stays silent on two, and
/// the fourth was too short to fill the memory and so proves nothing either way. Everything about the
/// negative side is now measured across ~28 minutes of real beatless music and holds. The positive
/// side is a claim about one song, and a channel that is right when it speaks but silent on most of
/// what plays is a judgement about what to ship rather than a number to tune.
///
/// WHAT WOULD FLIP THIS TO TRUE: three or four more real positive fixtures across different material —
/// a rock kit, hip-hop, something with a human drummer rather than a sequencer — with the detector
/// finding the right tempo on most of them. Arm `data/RECORD`, play a few minutes, cut the segments by
/// the track changes in `heard.jsonl`. It costs listening time and nothing else.
///
/// AND WHAT WOULD TURN IT BACK OFF: any reading on `the_orchestral_recordings_report_no_pulse`, or a
/// live report whose tempo the keeper hears as wrong. The first is asserted on every run. The second
/// is not, and cannot be — which is the honest reason this gate exists at all.
///
/// The gate is checked BY THE CALLERS rather than inside `feed`, and that placement is deliberate: the
/// maths is exercised by its tests either way. What is withheld is the DECISION TO BELIEVE IT, which
/// belongs where the event would be emitted.
pub const PULSE_ENABLED: bool = false;

/// Weighted circular resultant of the onsets against a grid of period `period`, keeping the phase.
///
/// The magnitude is how tightly the onset energy sits at one phase of the cycle; the argument is WHERE
/// in the cycle it sits. Evaluated at the frames' real timestamps, so there is no resampling and no lag
/// grid — which is the reason this replaced the autocorrelation.
fn pulse_phasor(hist: &[(f32, f32)], period: f32) -> Option<(f32, f32)> {
    if !(period > 0.0) { return None; }
    let (mut re, mut im, mut w) = (0.0f32, 0.0f32, 0.0f32);
    for &(t, o) in hist {
        if o <= 0.0 { continue; }
        let ph = std::f32::consts::TAU * t / period;
        re += o * ph.cos();
        im += o * ph.sin();
        w += o;
    }
    if w <= 1e-12 { return None; }
    Some(((re * re + im * im).sqrt() / w, im.atan2(re)))
}

/// The tempo whose grid best explains these onsets, by a comb over the tempogram.
///
/// A periodic onset train has energy not only at its period but at every subdivision T/k, and summing
/// those is what lets the BEAT be told from the bar — a period twice the beat puts consecutive onsets
/// half a cycle apart, where they cancel.
fn pulse_period(hist: &[(f32, f32)]) -> Option<f32> {
    let mut best: Option<(f32, f32)> = None;
    let mut bpm = PULSE_MIN_BPM;
    while bpm <= PULSE_MAX_BPM {
        let period = 60.0 / bpm;
        let mut score = pulse_phasor(hist, period)?.0;
        let mut weight = 1.0;
        for k in [2.0f32, 3.0] {
            if let Some((m, _)) = pulse_phasor(hist, period / k) {
                score += m / k;
                weight += 1.0 / k;
            }
        }
        let v = score / weight;
        if best.map_or(true, |(b, _)| v > b) { best = Some((v, period)); }
        bpm += PULSE_BPM_STEP;
    }
    best.map(|(_, p)| p)
}

/// STEADINESS is the feel — how much the tempo itself wanders — over EVERY retained estimate.
/// A machine lands on one number; a drummer pushes and pulls around it.
///
/// RELATIVE, AND IT USED TO BE ABSOLUTE. The old form was `1 - sd/2.0` with `sd` in bpm, so a spread
/// of two beats per minute drove it to zero at any tempo — while its sibling statistic, the
/// concentration gate above, accepts a spread of `PULSE_AGREE_TOL` = 6% as unanimous. At 130 bpm
/// those are 2 bpm and ±7.8 bpm: a reading could pass the agreement gate at full marks and report
/// zero steadiness. The scale here is taken from `PULSE_AGREE_TOL` rather than invented — a tempo
/// scattering by the full agreement tolerance is at the edge of being one tempo at all, so that is
/// where the feel reads zero — and it moves whenever that constant does.
///
/// THIS IS NOT YET THE FIX, AND SAYING SO IS THE POINT. The field reads 0.000 on both real positives
/// and the printer renders 0.000 as `elastic`, so the reading describes two sequenced electronic
/// tracks as having a human drummer's push and pull. I diagnosed that as the absolute scale and was
/// wrong; it survives the correction. Measured (`measure_pulse_steadiness`):
///
///     nero — reaching out    memory [96.0, 125.5, 125.5, 126.5, 126.5, 128.0, 128.0, 131.5]
///                            sd 10.53 bpm (cv 0.085)   MAD 1.50 bpm (cv 0.012)
///     phyllzx — skinshine    memory [73.0, 129.0, 130.0, 130.0, 130.0, 131.0, 131.5, 133.0]
///                            sd 19.10 bpm (cv 0.155)   MAD 1.00 bpm (cv 0.008)
///
/// ONE STRAY WINDOW IN EIGHT DESTROYS THE STANDARD DEVIATION. Seven estimates sit inside three bpm
/// and the eighth is forty bpm away, which is exactly the case the concentration gate is built to
/// tolerate (7 of 8 clears its 0.7) and exactly the case `sd` is not. The gate that ADMITS the
/// reading is robust and the number that DESCRIBES it is not.
///
/// AND THE OBVIOUS ROBUST FIX IS NOT CLEAN, which is why it is not here. Median absolute deviation
/// recovers the real tracks (0.80 and 0.87) and collapses the synthetic pair to *identical* values —
/// machine and human both land on MAD 0.5 bpm, which is one `PULSE_BPM_STEP`, so the estimator hits
/// the tempogram's own quantum and goes blind exactly where `a_machine_reads_steadier_than_a_human`
/// asks it to see. Trading a falsehood about real music for a blindness on the feature's only
/// discrimination is not an improvement, it is a different wrong number.
///
/// WHAT THE REAL FIX NEEDS, filed rather than guessed: a dispersion that survives one stray estimate
/// without landing on the quantum — a trimmed sd is the obvious candidate and is measurable today —
/// AND the negative control this field has never had. Nothing anywhere asserts that a genuinely
/// wandering tempo reads LOW; the only steadiness test compares two synthetic beats that differ by
/// 0.36 bpm. Until a wandering-tempo control exists, any new constant here would be fitted to two
/// recordings and one synthetic pair, which is the error this file has now recorded four times.
fn steadiness(bpms: &[f32]) -> f32 {
    if bpms.len() < 2 { return 0.0; }
    let mean = bpms.iter().sum::<f32>() / bpms.len() as f32;
    if mean <= 0.0 { return 0.0; }
    let var = bpms.iter().map(|b| (b - mean) * (b - mean)).sum::<f32>() / bpms.len() as f32;
    (1.0 - (var.sqrt() / mean) / PULSE_AGREE_TOL).clamp(0.0, 1.0)
}

/// 174 bpm and 87 bpm are the same pulse counted differently, so estimates are compared in one octave.
fn pulse_fold(bpm: f32) -> f32 {
    let mut b = bpm;
    while b < PULSE_FOLD_LO { b *= 2.0; }
    while b >= PULSE_FOLD_LO * 2.0 { b /= 2.0; }
    b
}

impl Pulse {
    pub fn feed(&mut self, db: f32, now: f32) -> Option<Event> {
        if db <= -60.0 {
            self.hist.clear();
            self.est.clear();
            self.prev_db = None;
            self.win_start = now;
            return None;
        }
        // ONSET FUNCTION: the rectified rise in dB, so relative change counts equally in a quiet
        // passage and a loud one. Rhythm is in the CHANGES — a beat is a sudden rise, a swell is not —
        // and half-wave rectified because a note starting is an event and a note ending much less of one.
        let o = match self.prev_db { Some(p) => (db - p).max(0.0), None => 0.0 };
        self.prev_db = Some(db);
        if self.hist.is_empty() { self.win_start = now; }
        self.hist.push((now, o));
        let cutoff = now - PULSE_MEMORY_SECS;
        self.hist.retain(|&(t, _)| t >= cutoff);
        self.est.retain(|&(t, _)| t >= cutoff);

        // One period estimate per window, and the windows DO NOT OVERLAP. Agreement between
        // overlapping windows is agreement with itself: the version this replaces compared twelve
        // estimates from 8-second windows sampled 85 ms apart, spanning 1.03 s of new audio.
        if now - self.win_start < PULSE_WINDOW_SECS { return None; }
        let win: Vec<(f32, f32)> = self.hist.iter().cloned().filter(|&(t, _)| t >= self.win_start).collect();
        self.win_start = now;
        if win.len() < 32 { return None; }

        // PULSE_MEASURE prints EVERY window and the gate that stopped it, not only the ones that get
        // far enough to have a confidence. A silence has causes, and "no reading here" and "rejected
        // at the transient gate here" are different facts — the same distinction the replay summary
        // needs between looked-and-found-nothing and never-measured.
        let measure = std::env::var("PULSE_MEASURE").is_ok();

        // Without transients there is no rhythm, however well anything else normalises.
        let mut rises: Vec<f32> = win.iter().map(|&(_, v)| v).collect();
        rises.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
        let transient = rises[rises.len() * 9 / 10];
        if transient < PULSE_TRANSIENT_DB {
            if measure { eprintln!("WIN t={now:7.1} trans={transient:5.2} REJECT transient (memory cleared)"); }
            self.est.clear();
            return None;
        }

        let period = pulse_period(&win)?;
        let this_bpm = pulse_fold(60.0 / period);
        self.est.push((now, this_bpm));
        if self.est.len() < (PULSE_MEMORY_SECS / PULSE_WINDOW_SECS) as usize {
            if measure {
                eprintln!("WIN t={now:7.1} trans={transient:5.2} bpm={this_bpm:6.1} filling {}/{}",
                          self.est.len(), (PULSE_MEMORY_SECS / PULSE_WINDOW_SECS) as usize);
            }
            return None;
        }

        // CONCENTRATION of the unfiltered estimates: the largest share of them lying within
        // PULSE_AGREE_TOL of a common centre. Nothing is dropped before it is counted — that filtering
        // is what made the old confidence unable to come out low. Necessary and NOT sufficient: the
        // Pärt reaches 100% here.
        let bpms: Vec<f32> = self.est.iter().map(|&(_, b)| b).collect();
        let mut centre = bpms[0];
        let mut near = 0usize;
        for &c in &bpms {
            let n = bpms.iter().filter(|b| (*b - c).abs() / c <= PULSE_AGREE_TOL).count();
            if n > near { near = n; centre = c; }
        }
        let agreement = near as f32 / bpms.len() as f32;
        if agreement < PULSE_MIN_AGREEMENT {
            if measure {
                eprintln!("WIN t={now:7.1} trans={transient:5.2} bpm={this_bpm:6.1} conc={agreement:.2} \
                           REJECT concentration  memory={:?}",
                          bpms.iter().map(|b| b.round() as i32).collect::<Vec<_>>());
            }
            return None;
        }

        // PHASE-LOCK: the confidence, and the statistic the old design had no way to compute. Phase of
        // the onsets against a grid at `centre`, over NON-OVERLAPPING windows of two periods each, then
        // the concentration of the step between consecutive phases. A real grid holds a constant step
        // even when the tempo estimate is slightly off; a coincidental periodicity random-walks. The
        // Pärt scores 0.107 here against a chance level of 0.24 while agreeing with itself perfectly on
        // tempo, which is the whole reason this exists.
        let grid = 60.0 / centre;
        let span = 2.0 * grid;
        let (mut re, mut im, mut n) = (0.0f32, 0.0f32, 0usize);
        let mut prev: Option<f32> = None;
        let mut start = self.hist.first()?.0;
        let end = self.hist.last()?.0;
        while start + span <= end {
            let seg: Vec<(f32, f32)> = self.hist.iter().cloned()
                .filter(|&(t, _)| t >= start && t < start + span).collect();
            if seg.len() >= 5 {
                if let Some((_, arg)) = pulse_phasor(&seg, grid) {
                    if let Some(p) = prev {
                        let d = arg - p;
                        re += d.cos();
                        im += d.sin();
                        n += 1;
                    }
                    prev = Some(arg);
                }
            }
            start += span;
        }
        if n < PULSE_MIN_PHASE_SAMPLES {
            if measure { eprintln!("WIN t={now:7.1} REJECT too few phase samples ({n})"); }
            return None;
        }
        let strength = (re * re + im * im).sqrt() / n as f32;
        // How the separation gets re-measured without editing anything: every reading that reaches the
        // gate, passing or not, is the distribution the thresholds are argued from.
        if measure {
            eprintln!("CAND t={now:7.1} trans={transient:5.2} win={this_bpm:6.1} bpm={centre:6.1} \
                       agree={agreement:.2} lock={strength:.3} n={n}{}",
                      if strength < PULSE_MIN_STRENGTH { "  REJECT lock" } else { "" });
        }
        if strength < PULSE_MIN_STRENGTH { return None; }

        let steady = steadiness(&bpms);
        let bpm = centre;

        let changed = self.reported.map_or(true, |r| (r - bpm).abs() > PULSE_CHANGE_BPM);
        if !changed || now - self.last_report < PULSE_MIN_GAP_SECS { return None; }
        self.last_report = now;
        self.reported = Some(bpm);
        Some(Event::Pulse(PulseReading { bpm, strength, steady, chance: 1.0 / (n as f32).sqrt() }))
    }
}

/// Pitch of the strongest partial, sampled several times WITHIN one analysis chunk.
///
/// WHY A SECOND, FINER PASS. The main path transforms 4096 samples with no overlap, so pitch is
/// sampled at 11.7 Hz and nothing above 5.9 Hz is visible. Vibrato is 4–7 Hz, so half the range
/// would alias. Raising the main hop would fix that and invalidate every fixture's frame rate and
/// the tracker's timing along with it — so the fine track is computed separately and the main path
/// is untouched. Four overlapping 2048-point windows per chunk give pitch at ~47 Hz, which covers
/// vibrato with room to spare, and cost four small transforms per 85 ms.
///
/// WHY THE STRONGEST PARTIAL AND NOT THE FUNDAMENTAL. Frequency modulation is constant in CENTS
/// across a note's partials, but bin resolution is constant in HERTZ — so the same wobble is worth
/// four times as many bins on the fourth harmonic as on the first. Measuring high buys resolution
/// for free. A 2048-point window is 23 Hz per bin, which at a 250 Hz fundamental is 160 cents and
/// hopeless; on a partial near 1 kHz the same bin is 40 cents, and parabolic interpolation takes it
/// well under the 30-cent depth that matters.
pub fn pitch_track(samples: &[f32], sample_rate: f32) -> Vec<Option<f32>> {
    const SUB: usize = 2048;
    const HOP: usize = 1024;
    let mut out = Vec::new();
    let mut start = 0;
    while start + SUB <= samples.len() {
        let spec = spectrum(&samples[start..start + SUB]);
        // One peak only: this is a pitch tracker, not a chord reader. A high floor keeps it on the
        // loudest thing rather than wandering between partials frame to frame, which would read as
        // enormous fake vibrato.
        let p = peaks(&spec, sample_rate, 1, 0.5);
        out.push(p.first().map(|x| x.hz));
        start += HOP;
    }
    out
}

/// A note whose pitch is oscillating — the signature of a sung voice, and of little else in a mix.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct VibratoReading {
    /// Centre pitch of the oscillating partial.
    pub hz: f32,
    /// Peak deviation in cents. Singers run 30–100; a synth pad runs ~0.
    pub depth_cents: f32,
    /// Oscillations per second. Singers run 4–7.
    pub rate_hz: f32,
}

/// Detects pitch oscillation in the fine track.
///
/// WHAT THIS IS FOR. `SpeechSense` reads the loudness envelope and is therefore blind to singing in a
/// mix — drums and bass own the envelope and fill the gaps a talker would leave. But a sung note
/// WOBBLES IN PITCH at 4–7 Hz by 30 to 100 cents, and almost nothing else in a pop mix does: a synth
/// pad is dead steady, a guitar bends without oscillating, a piano cannot. Strings and some leads do,
/// which is the honest confound.
///
/// And it gets at the thing no metadata carries. Lyrics are published; how a line was SUNG is not.
#[derive(Default)]
pub struct Vibrato {
    /// (time, cents relative to the first sample) — a relative scale, so a glide does not read as
    /// depth and the measurement is of the wobble alone.
    hist: Vec<(f32, f32)>,
    ref_hz: f32,
    last_report: f32,
    reported: bool,
}

/// Vibrato is 4–7 Hz; below that is a swell in pitch and above it is a trill or a tremolo.
const VIB_LO_HZ: f32 = 4.0;
const VIB_HI_HZ: f32 = 7.5;
/// How much deviation counts. Below ~25 cents is a steady tone with noise on the estimate.
const VIB_DEPTH_CENTS: f32 = 25.0;
/// Enough cycles to be an oscillation rather than a bend: 1.5 s holds six at 4 Hz.
const VIB_WINDOW_SECS: f32 = 1.5;
const VIB_MIN_GAP_SECS: f32 = 3.0;
/// SHAPE, not size — how far the in-band peak must stand above the two things a SOURCE HOP has and a
/// vibrato does not. Measured on square alternations between two partials: both probes come out at
/// 0.13–3.24 for every hop tried, and identically for 100¢, 300¢ and 600¢ separations, because this
/// is a property of the waveform and not of its amplitude. Real vibrato with pitch noise up to ±50¢
/// stays at 3.99 and above. 3.5 splits them. See `Vibrato::feed` for the derivation of the 3.
const VIB_SHAPE_MIN: f32 = 3.5;
/// A bound on the CLAIM, not a source-hop guard — and it catches nothing the shape probes miss.
///
/// Said plainly because the motivating artifact makes it look load-bearing and it is not: removing
/// it changes no result on any hop that has been constructed, at any separation from 100 to 600
/// cents and any flip rate from 5 to 20 Hz. The shape probes already have all of them.
///
/// What it does defend is the word "voice". Strings and voice run ±20–100¢, extreme operatic
/// technique reaches ~±150; a synth LFO at ±300¢ is a genuine, smooth pitch oscillation that would
/// pass both probes honestly and still not be a singer. Keeping this means the event's own claim
/// stays inside human technique. If that reasoning does not hold, this constant is the thing to
/// delete — it is doing nothing else.
const VIB_MAX_DEPTH_CENTS: f32 = 150.0;

impl Vibrato {
    /// `pitches` is one chunk's worth of fine track; `t` is the chunk's start time, `rate` its
    /// sampling rate in Hz.
    pub fn feed(&mut self, pitches: &[Option<f32>], t: f32, rate: f32) -> Option<Event> {
        for (i, p) in pitches.iter().enumerate() {
            let at = t + i as f32 / rate;
            match p {
                Some(hz) if *hz > 60.0 => {
                    if self.ref_hz <= 0.0 { self.ref_hz = *hz; }
                    // A jump of more than a fifth is the tracker changing partials, not a voice
                    // moving. Rebase rather than record an impossible excursion.
                    let c = cents(hz / self.ref_hz);
                    if c.abs() > 700.0 {
                        self.ref_hz = *hz;
                        self.hist.clear();
                    } else {
                        self.hist.push((at, c));
                    }
                }
                // Silence or no clear peak breaks the note; a wobble measured across a gap is not one.
                _ => { self.hist.clear(); }
            }
        }
        let now = t + pitches.len() as f32 / rate;
        let cutoff = now - VIB_WINDOW_SECS;
        self.hist.retain(|&(ts, _)| ts >= cutoff);
        if self.hist.len() < 32 { return None; }
        let span = now - self.hist.first()?.0;
        if span < VIB_WINDOW_SECS * 0.8 { return None; }

        // Detrend first: a singer sliding up while wobbling should report the wobble, not the slide.
        let n = self.hist.len() as f32;
        let mt = self.hist.iter().map(|(x, _)| *x).sum::<f32>() / n;
        let mc = self.hist.iter().map(|(_, c)| *c).sum::<f32>() / n;
        let mut num = 0.0;
        let mut den = 0.0;
        for (x, c) in &self.hist { num += (x - mt) * (c - mc); den += (x - mt) * (x - mt); }
        let slope = if den > 0.0 { num / den } else { 0.0 };
        let flat: Vec<f32> = self.hist.iter().map(|(x, c)| c - (mc + slope * (x - mt))).collect();

        // Amplitude of the pitch series at one modulation frequency.
        let series_rate = n / span.max(1e-6);
        let power = |f: f32| -> f32 {
            let w = 2.0 * std::f32::consts::PI * f / series_rate;
            let (mut re, mut im) = (0.0f32, 0.0f32);
            for (i, v) in flat.iter().enumerate() {
                let ph = w * i as f32;
                re += v * ph.cos();
                im -= v * ph.sin();
            }
            (re * re + im * im).sqrt() * 2.0 / n
        };

        // Strongest frequency in the vibrato band, and the depth at it.
        let mut best = (0.0f32, 0.0f32);          // (power, freq)
        let steps = 12;
        for k in 0..steps {
            let f = VIB_LO_HZ + (VIB_HI_HZ - VIB_LO_HZ) * (k as f32 + 0.5) / steps as f32;
            let p = power(f);
            if p > best.0 { best = (p, f); }
        }
        let (depth, rate_hz) = best;

        // IS THIS A WOBBLE OR A TRACKER CHANGING ITS MIND? The 700-cent rebase above catches a jump
        // of more than a fifth. Everything smaller was recorded as real excursion, and the worst
        // reading on record — ±224¢ at 7.4 Hz on an E♭2 — is what that costs: no human technique
        // produces it, and the fine track was alternating between two sources. The pitch tracker's
        // own docstring names this failure and the magnitude floor it uses against it; the floor is
        // not sufficient.
        //
        // MEASURED FIRST, because the obvious guard is wrong. A depth cap catches only the loud half:
        // the reported depth is NOT the distance between the two sources. A hop flipping faster than
        // the band ALIASES into it — 600 cents apart flipping at 20 Hz reports 83.5¢ at 6.2 Hz, which
        // is indistinguishable from a real singer by depth and rate alone. So the guard has to read
        // the SHAPE of the oscillation rather than its size.
        //
        // A vibrato is smooth; a source hop is a square alternation, and a square is not a sinusoid
        // in two checkable ways:
        //   * its fundamental may sit ABOVE the band, leaving only an alias inside — so compare the
        //     in-band peak against the strongest thing between 9 Hz and Nyquist. Hops: 0.13–0.33.
        //   * a square carries a THIRD HARMONIC at exactly 1/3 its fundamental amplitude, so an
        //     in-band hop scores 3.0 here by construction. A sinusoid has none. Hops: 0.96–3.24.
        // Both probes are amplitude-independent — identical for 100¢, 300¢ and 600¢ separations —
        // which is the point: they read the waveform, not the excursion.
        //
        // The above-band probe deliberately takes a max over many bins, which for broadband noise
        // measures an extremum rather than a typical value. That is the error this file recorded in
        // the pulse work, tolerated here on purpose because it errs toward SILENCE: an inflated
        // out-of-band reading suppresses a report, and a suppressed voice line costs less than a
        // fabricated one. The third-harmonic probe reads a single frequency and does not have it.
        //
        // BOTH ARE LOAD-BEARING, which is not what the first measurement suggested. The above-band
        // probe alone appeared sufficient — it catches an in-band square's third harmonic for free,
        // since 3f lands inside 9–22 Hz for most of the band — so the second probe looked redundant
        // and was nearly deleted. It is not: at a flip rate of 7 Hz the third harmonic sits at 21–22
        // and slides past the ceiling, and with the square probe removed two hops leak through
        // reporting 7.4 Hz — the exact rate of the artifact that started this. Redundancy that stops
        // being redundant at one corner of the range is the corner that gets found in production.
        let mut above = 0.0f32;
        let mut f = 9.0;
        let ceiling = (series_rate / 2.0 - 1.0).min(22.0);
        while f <= ceiling { above = above.max(power(f)); f += 0.25; }
        let alias_ok = depth / above.max(1e-6) >= VIB_SHAPE_MIN;
        let square_ok = depth / power(3.0 * rate_hz).max(1e-6) >= VIB_SHAPE_MIN;

        let present = depth >= VIB_DEPTH_CENTS
            && depth <= VIB_MAX_DEPTH_CENTS
            && alias_ok
            && square_ok;
        if present == self.reported { return None; }
        if present && now - self.last_report < VIB_MIN_GAP_SECS { return None; }
        self.last_report = now;
        self.reported = present;
        if !present { return None; }         // stopping is not worth a line; starting is
        let centre = self.ref_hz * 2f32.powf(mc / 1200.0);
        Some(Event::Vibrato(VibratoReading { hz: centre, depth_cents: depth, rate_hz }))
    }
}

/// Energy in one band of the LEVEL's own modulation spectrum, ignoring DC.
///
/// Not the audio spectrum — the spectrum of how the loudness itself wobbles. A held violin note has
/// a spectrum full of partials and an almost flat envelope; a person talking has a busy envelope
/// whatever the pitch is doing. This measures the second thing.
///
/// Evaluated directly at a handful of frequencies rather than by FFT: the series is a few hundred
/// samples and only two narrow bands matter, so a transform would compute mostly what is thrown away.
fn modulation_energy(env: &[f32], rate: f32, lo_hz: f32, hi_hz: f32) -> f32 {
    if env.len() < 16 || rate <= 0.0 { return 0.0; }
    let mean = env.iter().sum::<f32>() / env.len() as f32;
    let n = env.len() as f32;
    let steps = 8;
    let mut total = 0.0;
    for k in 0..steps {
        let f = lo_hz + (hi_hz - lo_hz) * (k as f32 + 0.5) / steps as f32;
        let w = 2.0 * std::f32::consts::PI * f / rate;
        let (mut re, mut im) = (0.0f32, 0.0f32);
        for (i, v) in env.iter().enumerate() {
            let p = w * i as f32;
            re += (v - mean) * p.cos();
            im -= (v - mean) * p.sin();
        }
        total += (re * re + im * im) / (n * n);
    }
    total / steps as f32
}

/// What the loudness envelope says about whether this is speech.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct SpeechEvidence {
    /// Modulation energy in the syllable band (2.5–5.5 Hz) over the slow band (0.2–2 Hz). Speech
    /// carries a pronounced syllabic peak; sustained music puts its envelope energy lower down.
    pub syllabic: f32,
    /// How far the quiet tenth of the window sits below its mean, in dB. Speech is full of gaps
    /// between words and phrases; a bowed chord is not.
    pub gaps_db: f32,
    /// True when both point the same way. Deliberately conservative — see `SpeechSense`.
    pub talking: bool,
}

/// Speech or music, from the shape of the loudness over a few seconds.
///
/// WHY THIS EXISTS. The cochlea reads harmony from ANYTHING — a podcast, a video, a person talking
/// — because vowel formants are peaks and peaks become intervals. It has no idea speech is not music
/// and produces confident nonsense from it. Knowing the difference lets it say "someone is talking"
/// instead, which makes it more honest rather than more capable.
///
/// THE FRAME RATE IS THE LIMIT, and it is worth stating rather than discovering. One analysis window
/// is 85 ms, so the level series samples at 11.7 Hz and cannot see modulation above 5.9 Hz. Normal
/// speech peaks at 3–5 Hz, which fits — but only just, and fast speech will alias. The upside of
/// using this series rather than a finer envelope is that every recorded fixture already contains it,
/// so the detector is testable against real music the moment it is written.
///
/// TWO FEATURES, BOTH REQUIRED, and the second is there because the first has a real confound:
/// music at 180–240 bpm puts beat energy straight into the syllable band. Gappiness separates them —
/// a drummer keeps the envelope up between hits, a talker does not. Requiring both agree costs
/// sensitivity on whispered or heavily-compressed speech and buys not calling a fast song a
/// conversation, which is the error that matters here.
#[derive(Default)]
pub struct SpeechSense {
    hist: Vec<(f32, f32)>,
    /// When the current disagreeing verdict first appeared, so a change must persist in TIME rather
    /// than across frames that share their data.
    pending_since: Option<(bool, f32)>,
    reported: Option<bool>,
}

/// How long a window the verdict is drawn from. Long enough for a couple of syllables per hertz of
/// resolution; short enough to notice a podcast starting.
const SPEECH_WINDOW_SECS: f32 = 4.0;
/// Syllabic-over-slow ratio above which the envelope looks like talking.
const SPEECH_SYLLABIC: f32 = 0.45;
/// How far the quiet tenth must sit below the mean, in dB.
const SPEECH_GAPS_DB: f32 = 7.0;
/// How long a new verdict must hold, in seconds, before it is reported.
///
/// SECONDS AND NOT FRAMES, and the difference is the whole guard. The first version required three
/// agreeing windows, which at 11.7 frames a second spans 0.26 s — and consecutive windows overlap by
/// 97%, so they are the same four seconds of audio counted three times. Three frames agreeing is one
/// observation wearing three hats.
///
/// It cost a false positive on a real recording: one Fratres window read syllabic 0.46 against a 0.45
/// threshold, held for a third of a second, and was reported as speech. Requiring the verdict to
/// survive means a marginal crossing cannot promote itself, while genuine speech — which goes on for
/// many seconds — sails through.
///
/// EIGHT, RAISED FROM TWO, and the two seconds were never measured against real music. When the
/// negative control was finally written as a run rather than claimed in a summary line
/// (`no_recorded_music_is_called_speech`), two of eight recordings called music speech: a dubstep
/// breakdown at syllabic 1.23, and one more at 0.81.
///
/// THE THRESHOLDS ARE NOT WHERE THE FIX IS, and the measurement says so plainly. Across the corpus,
/// every frame (`measure_speech_features`):
///
///     fixture                            syl p50   p99   max      gap p50   p99   max
///     heldout-trxy                          0.47  3.79  5.03          2.2  12.2  12.4
///     partt-fratres                         0.10  1.69  3.90          5.9  12.0  23.5
///     beat-nero-reaching-out                0.52  2.34  3.35          4.0   7.5   7.8
///     speech_like (SYNTHETIC, the only
///       positive that exists)               1.07  2.47  2.80         21.6  22.2  22.3
///
/// Four music recordings exceed the synthetic talker's own MAXIMUM syllabic ratio. There is no
/// syllabic threshold that admits speech and excludes this corpus — the feature separates typical
/// values and this detector is evaluated at extremes, which is the finding `PULSE_MIN_STRENGTH`
/// already records: a typical value and an extreme one are different quantities.
///
/// WHAT DOES SEPARATE IS DURATION, by a factor of six with nothing in the gap. Consecutive seconds
/// the talking verdict holds:
///
///     the whole 44-minute music corpus   longest run 4.5 s   (then 2.2, 1.2, 0.3, 0.1 …)
///     speech_like(30 s)                  longest run 26.2 s
///
/// So this follows the rule `PULSE_MIN_STRENGTH` states in as many words — when a detector leaks,
/// do not raise the threshold, because that fits it to whichever recordings happen to be in tests/;
/// lengthen the evidence instead. Eight seconds is 1.8x the worst run in the corpus.
///
/// DERIVED FROM THE NEGATIVE SIDE ON PURPOSE, and not from the midpoint of the two walls, which was
/// my first instinct and leans on the wrong one. The 4.5 s wall is measured on 44 minutes of real
/// music; the 26.2 s wall is a synthetic envelope that talks without ever stopping, which real
/// speech does not — a podcast pauses, laughs, and drops under a music bed. So the constant sits as
/// low as the measured wall permits, leaving the headroom on the side that could not be measured.
///
/// THE COST, stated rather than discovered: someone talking is not reported for eight seconds, and
/// the cochlea produces confident harmonic nonsense from their voice for that whole time. That is
/// the price of the negative control holding, the same trade `PULSE_MEMORY_SECS` makes, and
/// `speech_is_not_called_until_the_verdict_has_held` exists to keep it visible.
///
/// AND WHAT WOULD MOVE IT: a longer run appearing in the corpus raises it. Real speech turning out
/// to pause more often than every eight seconds LOWERS it — and lowering it needs a real positive
/// recording, which this detector has never had. Two minutes of a podcast with `data/RECORD` armed
/// would settle in one evening what no amount of reasoning here can.
const SPEECH_HOLD_SECS: f32 = 8.0;

impl SpeechSense {
    /// The two features and the verdict they make, read off the current window.
    ///
    /// EXTRACTED SO A MEASUREMENT CAN READ WHAT `feed` READS. The verdict only reaches a caller when
    /// it CHANGES, so the evidence behind every frame that did not change anything is invisible —
    /// and that is most of them, including every near miss. Recomputing these six lines beside the
    /// detector to see them would be a mirror, which is the failure this repo has now paid for
    /// twice; so there is one copy and both the detector and the instrument call it.
    fn features(&self, now: f32) -> Option<SpeechEvidence> {
        let span = now - self.hist.first()?.0;
        if span < SPEECH_WINDOW_SECS * 0.9 || self.hist.len() < 32 { return None; }

        let rate = self.hist.len() as f32 / span;
        // Linear amplitude, not dB: modulation depth is a ratio, and dB already being logarithmic
        // compresses exactly the deep gaps that distinguish speech.
        let lin: Vec<f32> = self.hist.iter().map(|(_, d)| 10f32.powf(d / 20.0)).collect();
        let syl = modulation_energy(&lin, rate, 2.5, 5.5);
        let slow = modulation_energy(&lin, rate, 0.2, 2.0);
        let syllabic = if slow > 1e-12 { syl / slow } else { 0.0 };

        let mut dbs: Vec<f32> = self.hist.iter().map(|(_, d)| *d).collect();
        dbs.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
        let mean = dbs.iter().sum::<f32>() / dbs.len() as f32;
        // THE MEAN OF THE QUIETEST SIXTH, not a single percentile. The first version indexed one
        // order statistic and was brittle for exactly the case it exists to catch: a four-second
        // window holds only one phrase gap, the gap is a handful of frames, and `len()/10` landed one
        // index past the end of it — reporting 3.9 dB of gappiness on an envelope that drops 26.
        // Averaging the tail cannot fall off it.
        let tail = (dbs.len() / 6).max(2);
        let quietest = dbs[..tail].iter().sum::<f32>() / tail as f32;
        let gaps_db = mean - quietest;

        let talking = syllabic >= SPEECH_SYLLABIC && gaps_db >= SPEECH_GAPS_DB;
        Some(SpeechEvidence { syllabic, gaps_db, talking })
    }

    pub fn feed(&mut self, db: f32, now: f32) -> Option<Event> {
        if db <= -60.0 {
            self.hist.clear();
            self.pending_since = None;
            return None;
        }
        self.hist.push((now, db));
        let cutoff = now - SPEECH_WINDOW_SECS;
        self.hist.retain(|&(t, _)| t >= cutoff);
        let evidence = self.features(now)?;
        let talking = evidence.talking;
        // Hysteresis in TIME on the verdict. Flipping "someone is talking" on and off would be worse
        // than either answer held steadily, and a threshold crossing that lasts a third of a second
        // is not evidence of anything — see SPEECH_HOLD_SECS.
        if Some(talking) == self.reported {
            self.pending_since = None;
            return None;
        }
        match self.pending_since {
            Some((v, since)) if v == talking => {
                if now - since < SPEECH_HOLD_SECS { return None; }
            }
            _ => {
                self.pending_since = Some((talking, now));
                return None;
            }
        }
        self.pending_since = None;
        self.reported = Some(talking);
        Some(Event::Speech { talking, evidence })
    }
}

/// One interval as reported, with the evidence for it rather than only its name.
///
/// WHY BOTH NUMBERS TRAVEL, and why neither is compressed into a single confidence. `cents_off` is
/// how far the measured pair sits from the exact just ratio; `votes` is how many of the last
/// `VOTE_WINDOWS` readings contained it. They measure different things and the corpus says so
/// plainly: intervals winning 4 of 4 votes average 12.5¢ off just, those winning 3 of 4 average
/// 12.9¢. Persistence does not predict tuning. An average of the two would be a number that moves
/// like neither and that nobody can act on.
///
/// The tolerance is 30 cents, so `cents_off` is readable as a fraction of the width of the door the
/// match came through: across 6,415 readings it runs p10 2.2, p50 12.0, p90 25.1. A reader who sees
/// 27 is looking at a name the table barely earned, and the bare string `5:4 major third` hides
/// exactly that.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct IntervalReading {
    pub num: u32,
    pub den: u32,
    pub name: &'static str,
    /// Cents from the exact just ratio, signed. Equal temperament is not just intonation and the
    /// drift says which one is playing.
    pub cents_off: f32,
    /// How many of the last `VOTE_WINDOWS` readings contained this ratio. Never below the strict
    /// majority — anything less never reaches a report.
    pub votes: usize,
    /// The derived tension flag, kept per interval so a reader can see WHICH one carries it.
    pub restless: bool,
}

impl IntervalReading {
    /// The measured quantity `restless` is derived FROM, so a reader can disagree with the rule
    /// rather than reverse-engineer it. Two cold readers worked it out from the log unaided; that
    /// it was reverse-engineerable at all is the argument for simply shipping it.
    pub fn complexity(&self) -> u32 { self.num + self.den }
}

/// A chord as reported, with the evidence the name rests on.
#[derive(Clone, Debug, PartialEq)]
pub struct ChordReading {
    pub name: String,
    /// Sounding notes the template does not explain. Never more than one — above that `chord()`
    /// declines to name anything.
    ///
    /// `None` when no frame still in the vote window produced this name, so there is no frame to
    /// read the evidence off. **Measured: that never happens — 0 of 445 chord reports across the
    /// corpus.** It cannot happen while the vote is counted over the same buffer this searches: a
    /// name needs three of four frames to win, so at least three producing frames are always
    /// present. Kept as an `Option` anyway, because the day the vote counts over a longer history
    /// than the buffer holds, this field should say *unknown* rather than invent a `0`.
    ///
    /// The number that motivated this — 44 of 445 — measures something else, and I cited it here
    /// for a moment as though it measured this. It is how often the NEWEST frame disagrees with the
    /// voted name, which is the vote doing its job and is exactly why the evidence is read from a
    /// frame that produced the name rather than from whichever frame happened to arrive last.
    pub extra: Option<usize>,
    pub inversion: bool,
    pub votes: usize,
}

/// Emits on CHANGE, never on a clock. This is the whole cost model: a quiet room is free, a
/// held chord costs one line, and the stream is proportional to musical change rather than time.
#[derive(Debug, Clone, PartialEq)]
pub enum Event {
    /// `partials` and `inferred` are the corroboration behind the pitch, and they travel because a
    /// pitch claim is the weakest thing in this stream and currently the most authoritative-looking.
    /// Measured across the whole corpus: 11 of 13 onsets rest on a voice with ONE partial — no
    /// corroboration at all — and the only two with three or more are the only two that are
    /// INFERRED, i.e. residue pitches that were never observed. Richest evidence and most fragile
    /// inference are the same two events, which is why these ship as two fields and not as one score.
    Onset { hz: f32, partials: usize, inferred: bool },
    Silence,
    Intervals { intervals: Vec<IntervalReading>, restless: bool, chord: Option<ChordReading> },
    /// Sustained growth or decay in loudness, over a span long enough to mean something.
    /// `from` is the FITTED level at the window's head — see `Swell::feed`. Without it `db` cannot
    /// be read: the same +30 dB means a playback ramp from the noise floor or real music getting
    /// louder, and nothing else in the event separates them.
    /// `refit_db` is the same window fitted again with its first `trim_s` seconds dropped, and it
    /// is a SECOND MEASUREMENT rather than a verdict. What the fit statistics cannot see is whether
    /// the window is one piece of music: at n≈704 every swell is overwhelmingly significant (the
    /// corpus minimum t-statistic is 5.25) and R² does not separate — the known Adagio fade-in
    /// artifact scores 0.123 while genuine music scores 0.038. Refitting past the head does
    /// separate, on the five floor-headed windows the corpus has: the two artifacts collapse to
    /// −0.44 and 0.10 of the reported figure, the three real openings hold 0.79 to 1.11.
    ///
    /// Shipped as a number with its trim named, and NOT as a flag, because the discrimination is
    /// measured on five windows and moves with the constant — 9 of 83 corpus windows change the
    /// SIGN of their refit somewhere across trims of 3, 6, 10 and 15 seconds. A reader weighs it
    /// against the first figure; nothing here decides for them.
    Swelling { rising: bool, db: f32, over: f32, from: f32, refit_db: f32, trim_s: f32 },
    /// A pitch is oscillating — a voice, almost certainly, since little else in a mix wobbles.
    Vibrato(VibratoReading),
    /// The music has a pulse, at this rate and this mechanically.
    Pulse(PulseReading),
    /// This is speech, not music — or has stopped being. Carries its own evidence so a reader can
    /// see WHY rather than take the verdict on faith, which matters while the threshold is still
    /// calibrated on one side only.
    Speech { talking: bool, evidence: SpeechEvidence },
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
    /// The last few readings, oldest first: interval set, silence, and the chord.
    ///
    /// The chord is voted alongside the intervals rather than taken from the newest frame. A chord
    /// name is a much larger claim than an interval — one wrong pitch class turns B♭m into
    /// something else — so it should have to survive the same majority the intervals do.
    ///
    /// The whole `Chord` is kept rather than its name alone, because the name that WINS the vote may
    /// not be the name the newest frame reads — 44 of 445 chord reports across the corpus name a
    /// chord no current frame produces. Keeping the struct means the evidence shipped with a name
    /// comes from a frame that actually produced that name, instead of from whichever frame happened
    /// to be last.
    recent: Vec<(Vec<Interval>, bool, Option<Chord>)>,
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

        self.recent.push((m.intervals.clone(), m.silent, m.chord.clone()));
        if self.recent.len() > VOTE_WINDOWS { self.recent.remove(0); }
        if self.recent.len() < VOTE_WINDOWS {
            return out;                       // not enough evidence to call anything yet
        }

        let need = VOTE_WINDOWS / 2 + 1;      // strict majority
        let silent = self.recent.iter().filter(|(_, s, _)| *s).count() >= need;
        // An interval survives if a majority of the recent readings contain it. THE COUNT TRAVELS
        // rather than being thrown away once it has passed the gate: a 3-of-4 and a 4-of-4 are the
        // difference between the display's flicker and the ledger's conviction, and the reader could
        // not previously tell them apart.
        let mut stable: Vec<(Interval, usize)> = Vec::new();
        for (ivs, _, _) in &self.recent {
            for iv in ivs {
                if stable.iter().any(|(e, _)| e.num == iv.num && e.den == iv.den) { continue; }
                let votes = self.recent.iter()
                    .filter(|(s, _, _)| s.iter().any(|e| e.num == iv.num && e.den == iv.den))
                    .count();
                if votes >= need { stable.push((*iv, votes)); }
            }
        }
        // The chord faces the same majority. No agreement means no name — the interval reading is
        // still there and is the honest fallback. The winning name carries its own vote count and
        // the evidence from a frame that actually produced it.
        let voted_chord: Option<(Chord, usize)> = {
            let mut best: Option<(usize, Chord)> = None;
            for (_, _, c) in &self.recent {
                if let Some(chord) = c {
                    let votes = self.recent.iter()
                        .filter(|(_, _, x)| x.as_ref().map(|y| &y.name) == Some(&chord.name)).count();
                    if votes >= need && best.as_ref().map_or(true, |(v, _)| votes > *v) {
                        best = Some((votes, chord.clone()));
                    }
                }
            }
            best.map(|(v, c)| (c, v))
        };
        let chord_name: Option<String> = voted_chord.as_ref().map(|(c, _)| c.name.clone());
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
        stable.sort_by_key(|(i, _)| just_rank(i.num, i.den));
        let restless = stable.iter().any(|(i, _)| i.restless);

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
                // The corroboration behind the pitch, from the voice that produced it. `fundamental`
                // is the LOWEST voice, so the lookup is by frequency rather than by rank — and when
                // no voice matches, the fields say so instead of defaulting to a confident 1.
                let v = m.voices.iter().find(|v| (v.hz - hz).abs() < 0.01);
                out.push(Event::Onset {
                    hz,
                    partials: v.map(|v| v.partials).unwrap_or(0),
                    inferred: v.map(|v| v.inferred).unwrap_or(false),
                });
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

        let names: Vec<(u32, u32)> = stable.iter().map(|(i, _)| (i.num, i.den)).collect();
        // The chord name is part of the identity: B♭m becoming D♭ over the same interval set is a
        // real harmonic change and would otherwise pass silently.
        let differs = self.confirmed.as_ref()
            .map(|(c, _)| *c != names).unwrap_or(true)
            || self.confirmed_chord != chord_name;
        if differs {
            out.push(Event::Intervals {
                intervals: stable.iter().map(|(i, votes)| IntervalReading {
                    num: i.num, den: i.den, name: i.name,
                    cents_off: i.cents_off, votes: *votes, restless: i.restless,
                }).collect(),
                restless,
                chord: voted_chord.as_ref().map(|(c, votes)| ChordReading {
                    name: c.name.clone(),
                    // From the frame that produced this name, not from the newest frame — those are
                    // not always the same frame, and 44 of 445 corpus reports are the case where
                    // they differ.
                    extra: self.recent.iter().rev()
                        .find_map(|(_, _, x)| x.as_ref().filter(|y| y.name == c.name).map(|y| y.extra)),
                    inversion: c.inversion,
                    votes: *votes,
                }),
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
    let mut speech = SpeechSense::default();
    let mut pulse = Pulse::default();
    let mut out = Vec::new();
    let mut track: Option<&str> = None;
    for f in frames {
        // THE TWO GUARDS THE LIVE PATH CALLS AND THIS ONE DID NOT, found by B measuring the ledger.
        // `cochlea_service` calls `sound_began()` on every Onset and `track_changed()` when the
        // now-playing title changes; replay called neither, so every fixture exercised a DIFFERENT
        // `Swell` than production and no replay could validate the track-boundary fix — a fixture
        // spanning a title change would have replayed the pre-`f8807f1` bug and passed.
        //
        // Honest state of the repair, because half of it is not reachable from here: the onset half
        // is real and live now. The track half is wired but INERT — `Frame::track` is `None` in
        // every fixture on disk, since `record_frame` does not write it. Until the recorder emits a
        // title, this branch is exercised only by the synthetic test beside it, and no RECORDED
        // fixture validates the track-boundary fix. That is a smaller claim than "parity restored"
        // and it is the true one.
        if f.track.is_some() && f.track.as_deref() != track {
            track = f.track.as_deref();
            swell.track_changed();
        }
        for e in t.feed(moment(&f.peaks, tol_cents), f.at, nag_after) {
            if matches!(e, Event::Onset { .. }) { swell.sound_began(); }
            out.push((f.at, e));
        }
        // Only when the recording carries a level. A fixture made before loudness was recorded has
        // none, and feeding a default would produce a flat line that reads as "no crescendo here" —
        // a missing measurement wearing the shape of a real one.
        if let Some(db) = f.db {
            if let Some(e) = swell.feed(db, f.at) { out.push((f.at, e)); }
            // Fed here too so every music fixture is a negative control for it. The positive side is
            // calibrated on synthetic envelopes only; these three recordings are the evidence it does
            // not fire on real music, which is the error that would actually matter.
            if let Some(e) = speech.feed(db, f.at) { out.push((f.at, e)); }
            // Fed in replay too — this is the feature that CAN be validated offline, because beat
            // rates are inside what the level series already samples. The Adagio and Fratres are
            // negative controls that exist today, which vibrato never had.
            // Gated: see PULSE_ENABLED. The maths still runs so its tests stay honest; the CLAIM is
            // withheld, because it fails its negative control on both orchestral fixtures.
            if let Some(e) = pulse.feed(db, f.at) { if PULSE_ENABLED { out.push((f.at, e)); } }
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
    /// What was playing, when the recorder knew. `None` in every fixture on disk today — the
    /// recorder does not write it yet — and a reader must treat that as UNKNOWN, not as "one
    /// continuous track". `replay` uses a CHANGE in this value as the track boundary, so a fixture
    /// that carries it can finally exercise the guard the live path has and replay lacked.
    pub track: Option<String>,
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
                if let Event::Intervals { intervals, .. } = e {
                    got = intervals.iter().map(|i| format!("{}:{} {}", i.num, i.den, i.name)).collect();
                }
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
                if let Event::Intervals { intervals, .. } = e {
                    named.push(intervals.iter()
                        .map(|i| format!("{}:{} {}", i.num, i.den, i.name)).collect::<Vec<_>>());
                }
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
    fn the_climb_to_the_climax_is_actually_detected() {
        // MEASURED FROM THE REAL PIECE, not chosen. Its 15-second dynamic arc rises from -23.4 dB at
        // 5:00 to -14.2 dB at 6:15 — 9.2 dB over 75 seconds, about 0.12 dB/sec — and that climb is
        // what the piece is famous for. An 8 dB threshold scores zero contradictions against the arc
        // and misses this by 0.6 dB, which is a clean sheet earned by going deaf. Five catches it.
        //
        // Note what is NOT tested here, because it is deliberately out of reach: the piece's GLOBAL
        // average slope is 0.056 dB/sec, or 3.4 dB per minute, and is below the threshold on purpose.
        let mut s = Swell::default();
        let mut got = None;
        for i in 0..900 {                       // 75 seconds at 12 frames/sec
            let t = i as f32 / 12.0;
            if let Some(e) = s.feed(-23.4 + 0.12 * t, t) {
                if got.is_none() { got = Some(e); }
            }
        }
        match got {
            Some(Event::Swelling { rising, db, over, from, .. }) => {
                assert!(rising, "a rising slope reported as falling");
                // Against the CONSTANTS, not against copies of them. The first version of these
                // assertions hardcoded 4.0 dB, and when the threshold moved to 3.0 the test failed
                // on a perfectly correct 3.4 dB report — a test measuring an old decision rather
                // than the rule it is supposed to protect.
                assert!(db >= SWELL_DB, "reported {db:.1} dB, below its own threshold of {SWELL_DB}");
                assert!(over >= SWELL_WINDOW_SECS * 0.8,
                        "claimed a span of {over:.1}s, under the minimum it requires");
                // THE HEAD OF A REAL CRESCENDO IS A MUSICAL LEVEL, and this is the direction that
                // matters: an artifact reports a head near the floor, so if a legitimate swell ever
                // reported one too the field would separate nothing. Checked against the input's own
                // arithmetic rather than a copied number. This is the FIRST report, so its window
                // starts where the input does, at -23.4 dB.
                assert!((from + 23.4).abs() < 0.5,
                        "window head fitted at {from:.1} dB; the ramp starts at -23.4");
                assert!(from > -60.0, "a real crescendo reported a head of {from:.1} dB, at the floor");
                // `from + db` lands on the level at the window's end. Exact here because the input is
                // a noiseless ramp; on real audio the head is one sample of a scattered signal and
                // this is an approximation, which is why the assertion has a tolerance and why the
                // claim is not made on the event itself.
                let tail = -23.4 + 0.12 * over;
                assert!((from + db - tail).abs() < 0.5,
                        "from {from:.1} + {db:.1} = {:.1}, but the ramp reaches {tail:.1} at {over:.0}s",
                        from + db);
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

    /// A level series shaped like speech: syllables at ~4 Hz with real gaps between phrases.
    fn speech_like(secs: f32) -> Vec<(f32, f32)> {
        let fps = 11.7;
        let n = (secs * fps) as usize;
        (0..n).map(|i| {
            let t = i as f32 / fps;
            // 4 Hz syllabic modulation, and a phrase gap every ~2.2 s
            let syl = (2.0 * std::f32::consts::PI * 4.0 * t).sin();
            let in_gap = (t % 2.2) > 1.85;
            let db = if in_gap { -48.0 } else { -22.0 + 6.0 * syl };
            (t, db)
        }).collect()
    }

    /// A fine pitch track: a note at `hz` wobbling `depth` cents at `rate` Hz, sampled at 46.9 Hz
    /// exactly as `pitch_track` produces.
    fn wobbling(hz: f32, depth: f32, rate: f32, secs: f32) -> (Vec<Option<f32>>, f32) {
        let sr = 46.875;
        let n = (secs * sr) as usize;
        let v = (0..n).map(|i| {
            let t = i as f32 / sr;
            let c = depth * (2.0 * std::f32::consts::PI * rate * t).sin();
            Some(hz * 2f32.powf(c / 1200.0))
        }).collect();
        (v, sr)
    }

    /// A level series with a beat: a pulse every `bpm` with `jitter` seconds of human wander.
    fn pulsing(bpm: f32, secs: f32, jitter: f32) -> Vec<(f32, f32)> {
        let fps = 11.7;
        let period = 60.0 / bpm;
        let n = (secs * fps) as usize;
        let mut seed: u32 = 0x1234_5678;
        // Beat times first, so jitter moves the HITS rather than adding noise to the level.
        let mut beats = Vec::new();
        let mut t = 0.0;
        while t < secs {
            seed = seed.wrapping_mul(1664525).wrapping_add(1013904223);
            let r = (seed >> 8) as f32 / 8_388_608.0 - 1.0;
            beats.push(t + r * jitter);
            t += period;
        }
        (0..n).map(|i| {
            let ts = i as f32 / fps;
            // each beat is a short decaying thump
            let mut amp = 0.02f32;
            for b in &beats {
                let d = ts - b;
                if d >= 0.0 && d < 0.35 { amp += 0.9 * (-d * 9.0).exp(); }
            }
            (ts, 20.0 * amp.max(1e-4).log10())
        }).collect()
    }

    #[test]
    fn a_steady_beat_is_found_at_the_right_tempo() {
        for want in [72.0f32, 100.0, 128.0, 174.0] {
            let mut p = Pulse::default();
            let mut got = None;
            // 60 s and not 30, changed when the memory went to 40 s. Every assertion below is
            // untouched; only the input lengthens, which makes this STRICTER rather than looser —
            // more disjoint windows have to agree before anything is claimed. The 40 s floor this
            // implies is not hidden by the change: see
            // `a_pulse_needs_forty_seconds_of_evidence_before_it_will_speak`.
            for (t, db) in pulsing(want, 60.0, 0.0) {
                if let Some(Event::Pulse(r)) = p.feed(db, t) { if got.is_none() { got = Some(r); } }
            }
            match got {
                Some(r) => {
                    // Half and double time are the same pulse heard differently, and a detector
                    // that finds one is not wrong. What would be wrong is an unrelated number.
                    let ratios = [1.0, 0.5, 2.0, 1.0 / 3.0, 3.0];
                    let ok = ratios.iter().any(|k| (r.bpm - want * k).abs() < want * 0.06);
                    assert!(ok, "wanted ~{want} bpm, got {:.1}", r.bpm);
                    assert!(r.strength >= PULSE_MIN_STRENGTH);
                }
                None => panic!("a metronomic {want} bpm beat was not detected"),
            }
        }
    }

    /// Every pulse reading a recorded pass would produce, with the gate bypassed.
    ///
    /// Bypassing `PULSE_ENABLED` on purpose: the point of these tests is to measure what the maths
    /// claims, and reading them through the gate would make them pass by reporting nothing.
    fn pulse_on_fixture(path: &str) -> Vec<(f32, PulseReading)> {
        let text = std::fs::read_to_string(path).unwrap_or_else(|e| panic!("{path}: {e}"));
        let mut p = Pulse::default();
        let mut out = Vec::new();
        for line in text.lines().filter(|l| l.trim().starts_with('{')) {
            let v: serde_json::Value = match serde_json::from_str(line) { Ok(v) => v, Err(_) => continue };
            let at = v.get("t").and_then(|x| x.as_f64()).unwrap_or(0.0) as f32;
            let db = match v.get("db").and_then(|x| x.as_f64()) { Some(d) => d as f32, None => continue };
            if let Some(Event::Pulse(r)) = p.feed(db, at) { out.push((at, r)); }
        }
        out
    }

    #[test]
    fn the_orchestral_recordings_report_no_pulse() {
        // THE NEGATIVE CONTROL AS A TEST rather than as something someone remembers to run. These are
        // recordings of real music with no drum kit, and the first version of this detector produced
        // 17 and 21 confident tempos across two of them spanning the entire allowed range.
        //
        // Every fixture is measured before anything is asserted. Asserting inside the loop hides the
        // leaks in the later fixtures behind the first — which it did, and it cost a wrong number in a
        // source comment: a distribution quoted as covering three recordings had only measured one.
        let mut leaks = Vec::new();
        for f in ["tests/fixture-adagio-op11-956.jsonl", "tests/fixture-partt-fratres.jsonl",
                  "tests/fixture-heldout-pemberton.jsonl"] {
            for (at, r) in pulse_on_fixture(f) {
                leaks.push(format!("{f}: {:.1} bpm lock {:.3} at t={at:.0}", r.bpm, r.strength));
            }
        }
        assert!(leaks.is_empty(), "beatless recordings reported {} tempos:\n  {}",
                leaks.len(), leaks.join("\n  "));
    }

    #[test]
    fn a_recorded_electronic_beat_is_found_at_its_real_tempo() {
        // THE POSITIVE CONTROL, which the first version never had — and which immediately caught a
        // redesign that silenced the orchestral fixtures by detecting nothing at all. Two recordings,
        // the second captured after the design was frozen so nothing was tuned on it.
        //
        // Honest scope: two further recordings made the same evening (`fixture-heldout-sol`,
        // `fixture-heldout-trxy`) are NOT asserted here, because this detector stays silent on them.
        // They are kept so the miss stays visible and re-measurable rather than absent. Both positives
        // are electronic; a rock kit and a human drummer are still untested.
        for (f, lo, hi) in [("tests/fixture-beat-nero-reaching-out.jsonl", 120.0, 136.0),
                            ("tests/fixture-beat-phyllzx-skinshine.jsonl", 126.0, 136.0)] {
            let got = pulse_on_fixture(f);
            assert!(!got.is_empty(), "{f}: a recorded beat was not detected at all");
            // Every reading, not just one. Worth knowing what this does and does not earn: the
            // reported tempo is the MODAL centre of the memory, so a minority of stray windows cannot
            // reach a reading whatever the gates are set to — mutating both gates wide open leaves
            // this assertion still passing. It guards the pipeline around `centre`, not the gates.
            for (_, r) in &got {
                assert!((lo..=hi).contains(&r.bpm), "{f}: expected {lo}-{hi} bpm, got {:.1}", r.bpm);
                assert!(r.strength >= PULSE_MIN_STRENGTH);
            }
        }
    }

    /// WHAT A 45-SECOND SILENCE IN THE MIDDLE OF A 130 BPM TRACK TURNED OUT TO BE.
    ///
    /// `fixture-beat-phyllzx-skinshine` reports steadily, then says nothing from t=79 to t=124. Two
    /// explanations were open: the drums drop out (a sensitivity limit worth stating), or the passage
    /// is genuinely ambiguous and declining is correct (a point in the design's favour). The ear
    /// settled it as BOTH — see the note at the end, and note that the either/or was mine and was
    /// wrong. Every number below re-measures with `PULSE_MEASURE=1`, which now prints each window's
    /// p90 transient and its OWN estimate alongside the reported centre — the three quantities this
    /// paragraph turns on. It did not print the first two when this was first written, and three of
    /// the figures in that first draft were wrong; that is why it prints them now.
    ///
    ///   * THE TRANSIENT GATE NEVER FIRES, anywhere in the track. The lowest p90 rise is 1.51 dB
    ///     against a gate of 0.30 — five times the gate at the worst moment. It is not sensitivity.
    ///   * There is still a real acoustic change: p90 transients fall 5.29 → 1.52 dB between t=69 and
    ///     t=84, a factor of 3.5, with mean level down 5.3 dB (−20.5 → −25.8) over the same stretch.
    ///     Both recover by t=95. Something genuinely thins out; it just never disappears.
    ///   * Through it the per-window estimates run 85.2, 88.0, 106.0, 96.0, 78.0 (t=74…94) instead of
    ///     130, and the detector names none of them. Five bad windows, 25 s.
    ///   * THE MODAL CENTRE ABSORBS THE FIRST TWO. At t=74 and t=79 it still reports 130 and 129 while
    ///     its own windows read 85 and 88 — outvoted 7–1 and 6–2 in memory. The silence starts at
    ///     t=84, when concentration finally falls to 0.62. Degradation, not a cliff.
    ///   * THE SILENCE OUTLASTS THE AMBIGUITY: 45 s against 25 s. Correct estimates resume at t=99 but
    ///     it does not speak until t=124 — and the overhang is set by BOTH constants, not the memory
    ///     alone. Recovery needs `ceil(PULSE_MIN_AGREEMENT × 8) = 6` of the 8 remembered windows to
    ///     agree, so 6 clean windows = 30 s after the last bad estimate. NOT full eviction: when it
    ///     speaks again at t=124 the 96 and the 78 are still in memory, simply outvoted 6–2. Shorten
    ///     the memory or lower the agreement and this shortens with it — the same trade as the
    ///     negative control holding, seen from the other side.
    ///
    /// One thing this data cannot settle, left open rather than guessed: the wrong estimates are not
    /// scattered uniformly. They sit below the true tempo and near simple ratios of it — 85.2 and 88.0
    /// against 2/3 of 130 = 86.7, 96.0 against 3/4 = 97.5, 78.0 against 3/5 = 78.0 — which is what a
    /// slower grouping heard against the same grid would produce. With folding and a 6% tolerance,
    /// numbers land near SOME simple ratio easily enough that this is a suggestion and not a finding.
    /// An ear on that passage settles it in ten seconds and no amount of arithmetic here does.
    ///
    /// THE EAR, 2026-07-31. The keeper played 1:14-1:34 and listened. Verbatim: *"its like a break
    /// with humming then it comes back to the beat."* A breakdown — the drums drop to a break, the
    /// sustained material carries the section, the beat returns.
    ///
    /// That merges the two candidate readings instead of choosing between them, and the dichotomy
    /// they were posed under — "the drums drop out" OR "the passage is ambiguous" — was false. Both
    /// are true at once, and holding them together says something neither said alone: THE BEAT LEFT
    /// WHILE THE SIGNAL STAYED. The transient measurement is not contradicted — the p90 rise never
    /// approaches its gate, bottoming at five times it — because the transient gate measures whether
    /// the audio is still changing sharply, and in a break it is: the humming has onsets. What it
    /// cannot see is that those onsets stopped being a beat. So the gate is not a beat detector and
    /// was never load-bearing for this passage; the concentration of the tempo estimates is what
    /// actually caught it, and it caught it correctly. A dropout of the beat is not a dropout of the
    /// signal, and only the second one is visible to a level series.
    ///
    /// The ratio suggestion above stays a suggestion. A break's sparse remnants are consistent with
    /// sub-multiples of the true tempo, which is a point in its favour and not a confirmation — the
    /// ear reported a break, not a half-time count, and nobody has checked that part.
    ///
    /// WHAT THIS ASSERTS, and what mutation testing said about it — including the part that came out
    /// against my own prediction.
    ///
    /// The first version asserted that no reading falls outside 126–136 bpm. That sounds like the
    /// right claim and is worth nothing: the reported tempo is the MODAL centre of the memory, so a
    /// minority of stray windows can never become a reading whatever the gates say. Mutating both
    /// gates wide open (concentration 0.7 → 0.35, lock 0.6 → 0.0) left it passing.
    ///
    /// So it asserts the SILENCE instead — and I then wrote here that the same mutation would make a
    /// reading appear in the gap. It does not, and I had written that before checking. The gap is
    /// overdetermined: even with both gates open the centre is still ~130, so the change-suppression
    /// in `PULSE_CHANGE_BPM` swallows it. No setting of the constants can make this test fail. (That
    /// mutation is not harmless — it fails `the_orchestral_recordings_report_no_pulse` loudly. The
    /// gates are load-bearing somewhere; just not here.)
    ///
    /// What DOES make it fail is a design mutation — reporting the window's own estimate instead of
    /// the modal centre (`let bpm = this_bpm`), with the gates open. It then claims 78.0 bpm at t=94
    /// and 130.5 at t=114. Only two, because `PULSE_MIN_GAP_SECS` suppresses the intermediate ones —
    /// the guard is thinner than it looks and one surviving claim is what it rests on. That is the
    /// regression it catches: someone simplifying the memory away and reporting the latest estimate.
    /// It is a guard against that specific change, not a demonstration that the confidence gates earn
    /// the silence here.
    #[test]
    fn an_ambiguous_passage_is_declined_rather_than_guessed() {
        let got = pulse_on_fixture("tests/fixture-beat-phyllzx-skinshine.jsonl");
        assert!(!got.is_empty(), "the track's clear sections must still be found");
        // Measured with PULSE_MEASURE: windows are rejected from t=84.2 to t=119.5 and the next honest
        // report is t=124.5. The bound stops at 120 rather than 124 so that a small timing shift makes
        // this test miss a violation rather than fail a legitimate report — it breaks toward silence,
        // the same direction as the detector it guards. Both mutations above are still caught by it.
        let spoke: Vec<String> = got.iter()
            .filter(|(at, _)| (84.0..=120.0).contains(at))
            .map(|(at, r)| format!("{:.1} bpm at t={at:.0}", r.bpm))
            .collect();
        assert!(spoke.is_empty(),
                "claimed a tempo across a passage whose own estimates ran 78-106 bpm: {}",
                spoke.join(", "));
    }

    #[test]
    fn a_pulse_needs_forty_seconds_of_evidence_before_it_will_speak() {
        // WHAT THE CONFIDENCE COSTS, asserted so it cannot go quiet. A perfect metronome — the easiest
        // input this detector will ever see — reports NOTHING in 35 seconds, because the memory the
        // confidence is measured over has not filled.
        //
        // This test exists because the fixture in `a_steady_beat_is_found_at_the_right_tempo` was
        // lengthened from 30 s to 60 s to accommodate that memory, and that change would otherwise have
        // removed the only place this limit was visible. The latency is not a defect queued for later:
        // THE MEMORY LENGTH IS THE CONFIDENCE. At 25 s two beatless orchestral recordings get readings
        // through the gate; at 40 s neither does. Anyone shortening `PULSE_MEMORY_SECS` to make this
        // faster is buying speed with the negative control, and should fail here first and know it.
        let mut p = Pulse::default();
        let mut n = 0;
        for (t, db) in pulsing(120.0, 35.0, 0.0) {
            if let Some(Event::Pulse(r)) = p.feed(db, t) {
                n += 1;
                eprintln!("spoke too early at {t:.1}s: {:.1} bpm lock {:.2}", r.bpm, r.strength);
            }
        }
        assert_eq!(n, 0, "reported a pulse on {n} occasions inside 35 s, which is less evidence than \
                          the confidence is defined over");

        // And the other half of the claim, so this documents a THRESHOLD rather than just a silence:
        // the same beat, given enough evidence, is found.
        let mut p = Pulse::default();
        let found = pulsing(120.0, 60.0, 0.0).into_iter()
            .filter_map(|(t, db)| p.feed(db, t))
            .any(|e| matches!(e, Event::Pulse(_)));
        assert!(found, "the same metronome must be found once 60 s of it exists");
    }

    #[test]
    fn a_periodicity_with_no_consistent_phase_is_not_a_pulse() {
        // The case PHASE-LOCK exists to catch, and the one no amount of tempo agreement can: events
        // whose AVERAGE spacing is a constant 120 bpm but whose phase random-walks, because each gap is
        // drawn independently. Every window agrees on the tempo and there is still no pulse, because
        // nothing is keeping time. The Pärt does exactly this for real — 100% tempo agreement, 0.107
        // phase-lock — which is why tempo agreement alone could never have been the gate.
        //
        // The first version of this test re-offset the grid every three seconds instead, and that was a
        // BAD TEST: with phase windows of two periods, a piecewise-constant offset leaves two of every
        // three phase steps perfect, so it scored 0.63 and was right to. A drifting phase must drift.
        let fps = 11.7f32;
        let period = 0.5f32;                     // 120 bpm mean
        let mut seed: u32 = 0x9E37_79B9;
        let mut beats: Vec<f32> = Vec::new();
        let mut t = 0.0f32;
        while t < 130.0 {
            beats.push(t);
            seed = seed.wrapping_mul(1664525).wrapping_add(1013904223);
            let r = (seed >> 8) as f32 / 8_388_608.0 - 1.0;      // -1..1
            t += period * (1.0 + 0.45 * r);
        }
        let mut p = Pulse::default();
        let mut n = 0;
        for i in 0..(120.0 * fps) as usize {
            let ts = i as f32 / fps;
            let on = beats.iter().any(|b| ts - b >= 0.0 && ts - b < 0.10);
            let db = -30.0 + if on { 14.0 } else { 0.0 };
            if let Some(Event::Pulse(r)) = p.feed(db, ts) {
                n += 1;
                eprintln!("phase-drifting periodicity reported {:.1} bpm lock {:.2}", r.bpm, r.strength);
            }
        }
        assert_eq!(n, 0, "a periodicity with no consistent phase reported a pulse {n} times");
    }

    #[test]
    fn music_with_no_beat_reports_no_pulse() {
        // THE NEGATIVE CONTROL, and the reason this feature could be trusted before shipping where
        // vibrato could not. A sustained chord that swells has no pulse, and claiming one would be
        // the detector picking a lag out of noise.
        let mut p = Pulse::default();
        let mut n = 0;
        for i in 0..600 {
            let t = i as f32 / 11.7;
            let db = -24.0 + 2.0 * (2.0 * std::f32::consts::PI * 0.08 * t).sin();
            if let Some(Event::Pulse(_)) = p.feed(db, t) { n += 1; }
        }
        assert_eq!(n, 0, "a beatless swell reported a pulse {n} times");
    }

    /// What the steadiness field is actually reading, on the only real positives that exist.
    ///
    /// Reaches into `Pulse::est` — the retained tempo memory at the moment a reading is emitted —
    /// because the event carries only the finished number and the question here is what went into
    /// it. Run with `--ignored --nocapture` when the scale is under discussion.
    #[test]
    #[ignore]
    fn measure_pulse_steadiness() {
        let report = |label: &str, bpms: &[f32]| {
            let mean = bpms.iter().sum::<f32>() / bpms.len() as f32;
            let sd = (bpms.iter().map(|b| (b - mean) * (b - mean)).sum::<f32>() / bpms.len() as f32).sqrt();
            // MAD, the robust twin of sd: half the memory would have to move to shift it, so two
            // stray windows cannot destroy it — and nothing is discarded before it is computed,
            // which is what separates this from the circular version that filtered first.
            let mut s: Vec<f32> = bpms.to_vec();
            s.sort_by(|a, b| a.partial_cmp(b).unwrap());
            let med = s[s.len() / 2];
            let mut dev: Vec<f32> = s.iter().map(|b| (b - med).abs()).collect();
            dev.sort_by(|a, b| a.partial_cmp(b).unwrap());
            let mad = dev[dev.len() / 2];
            eprintln!("{label:<34} n={:<3} mean {mean:6.1}  sd {sd:5.2}  cv {:.4}  |  med {med:6.1} \
                       MAD {mad:5.2}  cv_mad {:.4}  |  old {:.3}  rel(sd) {:.3}  rel(MAD) {:.3}",
                      bpms.len(), sd / mean, mad / med,
                      (1.0 - sd / 2.0).clamp(0.0, 1.0), steadiness(bpms),
                      (1.0 - (mad / med) / PULSE_AGREE_TOL).clamp(0.0, 1.0));
            eprintln!("{:<34}   memory {:?}", "", s.iter().map(|b| (b * 10.0).round() / 10.0).collect::<Vec<_>>());
        };
        eprintln!("--- REAL POSITIVES (both sequenced; a drum machine should not read elastic) ---");
        for f in ["tests/fixture-beat-nero-reaching-out.jsonl",
                  "tests/fixture-beat-phyllzx-skinshine.jsonl"] {
            let text = std::fs::read_to_string(f).unwrap_or_else(|e| panic!("{f}: {e}"));
            let mut p = Pulse::default();
            for line in text.lines().filter(|l| l.trim().starts_with('{')) {
                let v: serde_json::Value = match serde_json::from_str(line) { Ok(v) => v, Err(_) => continue };
                let at = v.get("t").and_then(|x| x.as_f64()).unwrap_or(0.0) as f32;
                let db = match v.get("db").and_then(|x| x.as_f64()) { Some(d) => d as f32, None => continue };
                if let Some(Event::Pulse(r)) = p.feed(db, at) {
                    let bpms: Vec<f32> = p.est.iter().map(|&(_, b)| b).collect();
                    report(f.rsplit('/').next().unwrap_or(f), &bpms);
                    eprintln!("{:<34} reported bpm {:.1}  lock {:.3}  steady {:.3}", "", r.bpm, r.strength, r.steady);
                }
            }
        }
        eprintln!("--- SYNTHETIC, which is the material the old scale passed on ---");
        for (label, jitter) in [("machine (jitter 0.0)", 0.0f32), ("human (jitter 0.045)", 0.045)] {
            let mut p = Pulse::default();
            for (t, db) in pulsing(120.0, 90.0, jitter) {
                if let Some(Event::Pulse(_)) = p.feed(db, t) {
                    let bpms: Vec<f32> = p.est.iter().map(|&(_, b)| b).collect();
                    report(label, &bpms);
                }
            }
        }
        eprintln!("scale: cv is divided by PULSE_AGREE_TOL = {PULSE_AGREE_TOL}");
    }

    #[test]
    fn a_machine_reads_steadier_than_a_human() {
        // The reading that is not in any metadata: a BPM is published, a FEEL is not. A drum machine
        // gives the same answer every window; a drummer pushes and pulls.
        let measure = |jitter: f32| {
            let mut p = Pulse::default();
            let mut last = None;
            for (t, db) in pulsing(120.0, 90.0, jitter) {
                if let Some(Event::Pulse(r)) = p.feed(db, t) { last = Some(r); }
            }
            last
        };
        let machine = measure(0.0).expect("a metronomic beat must be found");
        let human = measure(0.045).expect("a human beat must still be found");
        assert!(machine.steady > human.steady,
                "machine {:.2} should read steadier than human {:.2}", machine.steady, human.steady);
    }

    #[test]
    fn silence_clears_the_pulse_rather_than_holding_it() {
        let mut p = Pulse::default();
        for (t, db) in pulsing(120.0, 30.0, 0.0) { p.feed(db, t); }
        let mut n = 0;
        for i in 0..200 {
            let t = 30.0 + i as f32 / 11.7;
            if p.feed(-100.0, t).is_some() { n += 1; }
        }
        assert_eq!(n, 0, "silence produced {n} pulse reports");
    }

    #[test]
    fn a_wobbling_pitch_is_reported_with_its_depth_and_rate() {
        // SpeechSense is blind to singing in a mix — drums own the loudness envelope and fill the
        // gaps a talker would leave. But a sung note oscillates in PITCH, and almost nothing else in
        // a mix does. This is the reading that gets at how a line was sung, which no metadata carries.
        let (track, rate) = wobbling(880.0, 55.0, 5.2, 4.0);
        let mut v = Vibrato::default();
        let mut got = None;
        for (i, chunk) in track.chunks(4).enumerate() {
            let t = i as f32 * 4.0 / rate;
            if let Some(Event::Vibrato(r)) = v.feed(chunk, t, rate) {
                if got.is_none() { got = Some(r); }
            }
        }
        match got {
            Some(r) => {
                assert!((r.depth_cents - 55.0).abs() < 20.0, "depth read {:.0}, expected ~55", r.depth_cents);
                assert!((r.rate_hz - 5.2).abs() < 0.8, "rate read {:.1} Hz, expected ~5.2", r.rate_hz);
                assert!((r.hz - 880.0).abs() < 40.0, "centre read {:.0} Hz", r.hz);
            }
            None => panic!("a 55-cent 5.2 Hz wobble went unreported"),
        }
    }

    #[test]
    #[ignore]
    fn explore_source_hop_signature() {
        let sr = 46.875;
        // A source hop: the fine track alternating between two partials `apart` cents apart at
        // `flip` Hz. Not a wobble — a square alternation, which is what a tracker changing its mind
        // between two sources actually produces.
        let hop = |apart: f32, flip: f32| -> Vec<Option<f32>> {
            let n = (6.0 * sr) as usize;
            (0..n).map(|i| {
                let t = i as f32 / sr;
                let hi = ((t * flip * 2.0) as i32) % 2 == 1;
                Some(77.78 * if hi { 2f32.powf(apart / 1200.0) } else { 1.0 })
            }).collect()
        };
        let run = |track: &[Option<f32>]| -> Option<VibratoReading> {
            let mut v = Vibrato::default();
            let mut got = None;
            for (i, chunk) in track.chunks(4).enumerate() {
                if let Some(Event::Vibrato(r)) = v.feed(chunk, i as f32 * 4.0 / sr, sr) {
                    if got.is_none() { got = Some(r); }
                }
            }
            got
        };
        eprintln!("--- SOURCE HOPS (square alternation between two partials) ---");
        for apart in [100.0, 200.0, 300.0, 450.0, 600.0] {
            for flip in [2.0, 5.0, 9.0, 14.0, 20.0] {
                match run(&hop(apart, flip)) {
                    Some(r) => eprintln!("apart={apart:5.0}¢ flip={flip:4.1}Hz -> depth {:6.1}¢  rate {:.1} Hz",
                                         r.depth_cents, r.rate_hz),
                    None => eprintln!("apart={apart:5.0}¢ flip={flip:4.1}Hz -> (nothing)"),
                }
            }
        }
        eprintln!("--- REAL VIBRATO (the negative control this must not silence) ---");
        for (d, f) in [(20.0, 4.5), (55.0, 5.2), (100.0, 6.0), (100.0, 7.0), (150.0, 5.0)] {
            let (track, rate) = wobbling(220.0, d, f, 6.0);
            assert!((rate - sr).abs() < 1.0);
            match run(&track) {
                Some(r) => eprintln!("d={d:5.0}¢ f={f:4.1}Hz -> depth {:6.1}¢  rate {:.1} Hz",
                                     r.depth_cents, r.rate_hz),
                None => eprintln!("d={d:5.0}¢ f={f:4.1}Hz -> (nothing)"),
            }
        }

        // SQUARENESS. A vibrato is a smooth oscillation; a source hop is a square alternation, and a
        // square carries energy at odd multiples of its flip rate. So the question is whether the
        // modulation energy ABOVE the vibrato band separates them — and whether it survives the
        // pitch-estimation noise a real fine track carries, which is the part that decides whether
        // this is shippable or just elegant.
        let power_at = |series: &[f32], f: f32, srate: f32| -> f32 {
            let n = series.len() as f32;
            let w = 2.0 * std::f32::consts::PI * f / srate;
            let (mut re, mut im) = (0.0f32, 0.0f32);
            for (i, v) in series.iter().enumerate() {
                re += v * (w * i as f32).cos();
                im -= v * (w * i as f32).sin();
            }
            (re * re + im * im).sqrt() * 2.0 / n
        };
        // Cents series over the last 1.5 s, detrended, exactly as the detector sees it.
        let cents_series = |track: &[Option<f32>]| -> Vec<f32> {
            let keep: Vec<f32> = track.iter().filter_map(|p| *p).collect();
            let tail = &keep[keep.len().saturating_sub((1.5 * sr) as usize)..];
            let r0 = tail[0];
            let raw: Vec<f32> = tail.iter().map(|h| cents(h / r0)).collect();
            let n = raw.len() as f32;
            let mean = raw.iter().sum::<f32>() / n;
            raw.iter().map(|c| c - mean).collect()
        };
        let ratio = |track: &[Option<f32>]| -> (f32, f32) {
            let s = cents_series(track);
            let mut inb = 0.0f32;
            let mut out = 0.0f32;
            let mut f = 4.0;
            while f <= 7.5 { inb = inb.max(power_at(&s, f, sr)); f += 0.25; }
            let mut f = 9.0;
            while f <= 22.0 { out = out.max(power_at(&s, f, sr)); f += 0.25; }
            (inb, out)
        };
        // Deterministic pitch-estimation noise, since a real fine track is not a clean sinusoid.
        let noisy = |track: &[Option<f32>], cents_rms: f32| -> Vec<Option<f32>> {
            let mut seed = 0x2545F491u32;
            track.iter().map(|p| p.map(|hz| {
                seed = seed.wrapping_mul(1664525).wrapping_add(1013904223);
                let u = (seed >> 8) as f32 / 16_777_216.0 - 0.5;
                hz * 2f32.powf(u * 2.0 * cents_rms / 1200.0)
            })).collect()
        };
        // Probing the THIRD HARMONIC of the detected rate, not the max above the band. Taking a max
        // over fifty bins measures an extremum of the noise, not its typical size — the exact error
        // the pulse redesign recorded ("a typical value and an extreme one are different
        // quantities"), and it is what made the noisy sinusoid look close to a square below.
        let third = |track: &[Option<f32>]| -> (f32, f32, f32) {
            let s = cents_series(track);
            let mut inb = (0.0f32, 0.0f32);        // (power, freq)
            let mut f = 4.0;
            while f <= 7.5 {
                let p = power_at(&s, f, sr);
                if p > inb.0 { inb = (p, f); }
                f += 0.25;
            }
            let h3 = power_at(&s, 3.0 * inb.1, sr);
            let mut out = 0.0f32;
            let mut f = 9.0;
            while f <= 22.0 { out = out.max(power_at(&s, f, sr)); f += 0.25; }
            (inb.0, h3, out)
        };
        eprintln!("--- TWO PROBES: alias (in/above) and squareness (in/3rd-harmonic) ---");
        for (d, f) in [(55.0, 5.2), (100.0, 6.0), (150.0, 5.0)] {
            let (track, _) = wobbling(220.0, d, f, 6.0);
            for nz in [0.0, 25.0, 50.0, 80.0] {
                let (i, h, o) = third(&noisy(&track, nz));
                eprintln!("vibrato d={d:5.0} f={f:3.1} noise±{nz:4.0}¢ -> alias {:6.2}   square {:6.2}",
                          i / o.max(1e-6), i / h.max(1e-6));
            }
        }
        for apart in [100.0, 300.0, 600.0] {
            for flip in [5.0, 6.5, 9.0, 14.0, 20.0] {
                let (i, h, o) = third(&hop(apart, flip));
                eprintln!("hop apart={apart:5.0} flip={flip:4.1}        -> alias {:6.2}   square {:6.2}",
                          i / o.max(1e-6), i / h.max(1e-6));
            }
        }
    }

    #[test]
    fn a_dead_steady_pitch_reports_nothing() {
        // The wall that matters: a synth pad, an organ, anything sequenced. Calling those a voice
        // would make the feature worthless.
        let (track, rate) = wobbling(880.0, 0.0, 5.0, 6.0);
        let mut v = Vibrato::default();
        let mut n = 0;
        for (i, chunk) in track.chunks(4).enumerate() {
            if let Some(Event::Vibrato(_)) = v.feed(chunk, i as f32 * 4.0 / rate, rate) { n += 1; }
        }
        assert_eq!(n, 0, "a steady tone reported vibrato {n} times");
    }

    #[test]
    fn a_slow_bend_is_not_vibrato() {
        // A guitar bend or a portamento moves a long way in pitch without oscillating. Detrending is
        // what separates them: the slide is removed and only the wobble is measured.
        let sr = 46.875;
        let n = (6.0 * sr) as usize;
        let track: Vec<Option<f32>> = (0..n).map(|i| {
            let t = i as f32 / sr;
            Some(440.0 * 2f32.powf(300.0 * t / 6.0 / 1200.0))     // three semitones over six seconds
        }).collect();
        let mut v = Vibrato::default();
        let mut reports = 0;
        for (i, chunk) in track.chunks(4).enumerate() {
            if let Some(Event::Vibrato(_)) = v.feed(chunk, i as f32 * 4.0 / sr, sr) { reports += 1; }
        }
        assert_eq!(reports, 0, "a monotonic bend was called vibrato {reports} times");
    }

    /// A source hop is a square alternation between two partials. This is the artifact class behind
    /// the worst reading on record — ±224¢ at 7.4 Hz on an E♭2 — and it comes in two shapes, one of
    /// which no depth cap can see.
    ///
    /// HONEST LIMIT, stated because it is the same gap that let this detector ship silent once
    /// already: NO FIXTURE CAN EXERCISE ANY OF THIS. Recordings store the top ten spectral peaks per
    /// 4096-sample frame, and vibrato needs the fine sub-window track, which is computed live and
    /// never written. So every case below is synthetic, and the four voice events the Adagio produced
    /// live — the real-world negative control this rule should be held against — CANNOT BE REPLAYED
    /// to check that they survive it. What that costs is stated on the board with a proposal to
    /// record the fine track, which is the only thing that would close it.
    #[test]
    fn a_tracker_hopping_between_two_sources_is_not_called_a_voice() {
        let sr = 46.875;
        let hop = |apart: f32, flip: f32| -> Vec<Option<f32>> {
            let n = (6.0 * sr) as usize;
            (0..n).map(|i| {
                let t = i as f32 / sr;
                let hi = ((t * flip * 2.0) as i32) % 2 == 1;
                // 77.78 Hz is E♭2 — the pitch the worst recorded artifact was reported on, where one
                // 2048-point bin spans 454 cents and a "wobble" is the estimate changing bins.
                Some(77.78 * if hi { 2f32.powf(apart / 1200.0) } else { 1.0 })
            }).collect()
        };
        let mut claimed = Vec::new();
        for apart in [100.0, 200.0, 300.0, 450.0, 600.0] {
            // 5 Hz sits INSIDE the vibrato band — the hop that reports an impossible depth. 9, 14 and
            // 20 Hz sit above it and ALIAS in, reporting depths a singer could plausibly produce:
            // measured at 27.8¢ to 149.6¢, every one of them inside the human range. A depth cap sees
            // the first kind and is blind to the second, which is why the guard reads shape.
            // 7.4 Hz is the rate the worst recorded artifact was reported at, and it is the awkward
            // one: three times it is 22.2 Hz, which sits just outside the above-band probe's ceiling.
            for flip in [5.0, 7.0, 7.4, 9.0, 14.0, 20.0] {
                let track = hop(apart, flip);
                let mut v = Vibrato::default();
                for (i, chunk) in track.chunks(4).enumerate() {
                    if let Some(Event::Vibrato(r)) = v.feed(chunk, i as f32 * 4.0 / sr, sr) {
                        claimed.push(format!("{apart:.0}¢ apart flipping at {flip:.0} Hz -> \
                                              a voice wobbling ±{:.0}¢ at {:.1} Hz",
                                             r.depth_cents, r.rate_hz));
                    }
                }
            }
        }
        assert!(claimed.is_empty(), "a tracker alternating between two partials was called singing:\n  {}",
                claimed.join("\n  "));
    }

    /// THE NEGATIVE CONTROL FOR THE GUARD ABOVE, and the wall that matters more than the guard does.
    ///
    /// Strings and voice run roughly ±20–100¢ at 4–8 Hz; extreme operatic technique reaches ±150.
    /// A rule that silenced those would trade one artifact for the whole feature. Run with pitch
    /// noise as well as clean, because a real fine track is not a clean sinusoid.
    ///
    /// WHAT THE GUARD COSTS, found by this test and reported rather than tuned away. At ±50¢ of pitch
    /// noise a ±30¢ wobble is DECLINED, and the guard is the cause: with `VIB_SHAPE_MIN` set to 0 the
    /// same input reports. That is the rule working as written rather than a bug — the noise is 1.7
    /// times the signal, and the shape probes cannot tell a wobble from a hop at that ratio. It errs
    /// toward silence, which is the trade this detector is supposed to make: a fabricated voice line
    /// costs more than a missed one. It is left UNASSERTED on purpose, so that a later improvement in
    /// low-SNR handling does not turn a test red for getting better.
    ///
    /// The asserted band is everything at ±25¢ noise and everything from ±55¢ up at ±50¢ noise, which
    /// covers the stated range of real technique with margin.
    #[test]
    fn real_vibrato_survives_the_source_hop_guard() {
        let sr = 46.875;
        let noisy = |track: &[Option<f32>], cents_rms: f32| -> Vec<Option<f32>> {
            let mut seed = 0x2545F491u32;
            track.iter().map(|p| p.map(|hz| {
                seed = seed.wrapping_mul(1664525).wrapping_add(1013904223);
                let u = (seed >> 8) as f32 / 16_777_216.0 - 0.5;
                hz * 2f32.powf(u * 2.0 * cents_rms / 1200.0)
            })).collect()
        };
        let reports = |d: f32, f: f32, nz: f32| -> bool {
            let (clean, rate) = wobbling(220.0, d, f, 6.0);
            let track = noisy(&clean, nz);
            let mut v = Vibrato::default();
            let mut got = false;
            for (i, chunk) in track.chunks(4).enumerate() {
                if let Some(Event::Vibrato(_)) = v.feed(chunk, i as f32 * 4.0 / rate, rate) { got = true; }
            }
            got
        };
        let mut silenced = Vec::new();
        for (d, f) in [(30.0, 4.5), (55.0, 5.2), (80.0, 6.5), (100.0, 6.0), (100.0, 7.0), (140.0, 5.0)] {
            for nz in [0.0, 25.0] {
                if !reports(d, f, nz) { silenced.push(format!("±{d:.0}¢ at {f:.1} Hz, noise ±{nz:.0}¢")); }
            }
            // The shallowest wobble is excluded at this noise level, and only there. See above.
            if d >= 55.0 && !reports(d, f, 50.0) {
                silenced.push(format!("±{d:.0}¢ at {f:.1} Hz, noise ±50¢"));
            }
        }
        assert!(silenced.is_empty(), "the guard silenced real vibrato:\n  {}", silenced.join("\n  "));
    }

    #[test]
    fn a_broken_note_does_not_wobble_across_the_gap() {
        // Two different notes with silence between them are not one note vibrating. Measuring across
        // the gap would invent an enormous excursion out of a melody.
        let sr = 46.875;
        let mut track: Vec<Option<f32>> = Vec::new();
        for _ in 0..70 { track.push(Some(440.0)); }
        for _ in 0..20 { track.push(None); }
        for _ in 0..70 { track.push(Some(587.0)); }
        let mut v = Vibrato::default();
        let mut n = 0;
        for (i, chunk) in track.chunks(4).enumerate() {
            if let Some(Event::Vibrato(_)) = v.feed(chunk, i as f32 * 4.0 / sr, sr) { n += 1; }
        }
        assert_eq!(n, 0, "a note change across silence read as vibrato {n} times");
    }

    #[test]
    fn the_fine_pitch_track_finds_a_tone_at_the_right_place_and_rate() {
        // The tracker itself, separately from the wobble logic, so a failure says which layer broke.
        let tone = tone(&[(880.0, 1.0)]);
        let t = pitch_track(&tone, SR);
        // 4096 samples, 2048-point windows, 1024 hop -> 3 full windows
        assert!(t.len() >= 3, "expected several sub-windows, got {}", t.len());
        let found: Vec<f32> = t.iter().flatten().cloned().collect();
        assert!(!found.is_empty(), "no pitch found in a pure tone");
        for f in &found {
            assert!((f - 880.0).abs() < 15.0, "sub-window found {f:.0} Hz, expected 880");
        }
    }

    #[test]
    fn a_talking_envelope_is_recognised_as_talking() {
        // The cochlea reads harmony from anything, including vowel formants, and produces confident
        // nonsense from speech. This is the feature that lets it say so instead.
        let mut s = SpeechSense::default();
        let mut got = None;
        for (t, db) in speech_like(20.0) {
            // The FIRST verdict is legitimately "not speech" — the detector starts with no opinion
            // and the earliest window may hold no phrase gap at all. What is asserted is that a
            // talking verdict is reached, not that it is reached instantly.
            if let Some(Event::Speech { talking: true, evidence }) = s.feed(db, t) {
                if got.is_none() { got = Some((true, evidence)); }
            }
        }
        match got {
            Some((true, ev)) => {
                assert!(ev.syllabic >= SPEECH_SYLLABIC, "syllabic {:.2} under threshold", ev.syllabic);
                assert!(ev.gaps_db >= SPEECH_GAPS_DB, "gaps {:.1} dB under threshold", ev.gaps_db);
            }
            other => panic!("a 4 Hz gapped envelope was not called speech: {other:?}"),
        }
    }

    /// Every fixture in the corpus, and the fine-grained evidence behind every frame of it.
    ///
    /// Returns (verdict events, per-frame features). The first is what the ledger would show; the
    /// second is what the threshold is actually sitting in, which the events cannot show because a
    /// verdict only reaches a caller when it changes.
    fn speech_on_fixture(path: &str) -> (Vec<(f32, SpeechEvidence)>, Vec<SpeechEvidence>) {
        let text = std::fs::read_to_string(path).unwrap_or_else(|e| panic!("{path}: {e}"));
        let mut s = SpeechSense::default();
        let (mut events, mut frames) = (Vec::new(), Vec::new());
        for line in text.lines().filter(|l| l.trim().starts_with('{')) {
            let v: serde_json::Value = match serde_json::from_str(line) { Ok(v) => v, Err(_) => continue };
            let at = v.get("t").and_then(|x| x.as_f64()).unwrap_or(0.0) as f32;
            let db = match v.get("db").and_then(|x| x.as_f64()) { Some(d) => d as f32, None => continue };
            if let Some(Event::Speech { evidence, .. }) = s.feed(db, at) { events.push((at, evidence)); }
            if let Some(f) = s.features(at) { frames.push(f); }
        }
        (events, frames)
    }

    /// The eight recordings the corpus is made of. Every one is music.
    const MUSIC_FIXTURES: [&str; 8] = [
        "tests/fixture-adagio-op11-956.jsonl", "tests/fixture-partt-fratres.jsonl",
        "tests/fixture-heldout-pemberton.jsonl", "tests/fixture-heldout-sol.jsonl",
        "tests/fixture-heldout-trxy.jsonl", "tests/fixture-beat-nero-reaching-out.jsonl",
        "tests/fixture-beat-phyllzx-skinshine.jsonl", "tests/fixtures-adagio-op11.jsonl",
    ];

    #[test]
    fn every_reported_reading_carries_real_evidence() {
        // THE FAILURE THIS EXISTS FOR is not a wrong number, it is a DEFAULT one. Era 4 added
        // evidence fields to three event kinds, and the way that goes wrong is silently: a field
        // wired to `0`, or to `Default::default()`, or read from the wrong frame, produces a stream
        // that looks exactly as authoritative as the real thing and is worse than the bare names it
        // replaced — because now there is a number vouching for it.
        //
        // So every reading the corpus produces is checked against the bounds the detector's own
        // rules imply. These are not tuned thresholds; they are restatements of the gates upstream,
        // and if one fails it means a field is not carrying what its name says.
        let need = VOTE_WINDOWS / 2 + 1;
        let mut checked = 0;
        let mut tuning: Vec<f32> = Vec::new();
        for f in MUSIC_FIXTURES {
            let text = std::fs::read_to_string(f).unwrap_or_else(|e| panic!("{f}: {e}"));
            let mut frames = Vec::new();
            for line in text.lines().filter(|l| l.trim().starts_with('{')) {
                let v: serde_json::Value = match serde_json::from_str(line) { Ok(v) => v, Err(_) => continue };
                let at = v.get("t").and_then(|x| x.as_f64()).unwrap_or(0.0) as f32;
                let db = v.get("db").and_then(|x| x.as_f64()).map(|d| d as f32);
                let peaks = v.get("peaks").and_then(|x| x.as_array()).map(|a| {
                    a.iter().filter_map(|p| { let q = p.as_array()?;
                        Some(Peak { hz: q.first()?.as_f64()? as f32, mag: q.get(1)?.as_f64()? as f32 }) })
                     .collect::<Vec<_>>()
                }).unwrap_or_default();
                frames.push(Frame { at, peaks, db, track: None });
            }
            for (at, e) in replay(&frames, 30.0, 4.0) {
                match e {
                    Event::Intervals { intervals, restless, chord } => {
                        assert!(!intervals.is_empty(), "{f} t={at:.1}: an interval event with no intervals");
                        for i in &intervals {
                            assert!(i.votes >= need && i.votes <= VOTE_WINDOWS,
                                    "{f} t={at:.1}: {}:{} reports {} votes, outside [{need}, {VOTE_WINDOWS}]",
                                    i.num, i.den, i.votes);
                            // The match came through a 30-cent door, so nothing beyond it can be a
                            // reported interval. A field defaulted to 0.0 would pass this; a field
                            // read from the wrong interval would not.
                            assert!(i.cents_off.abs() <= 30.0,
                                    "{f} t={at:.1}: {}:{} reports {:.1}¢ off, outside the tolerance it matched within",
                                    i.num, i.den, i.cents_off);
                            assert_eq!(i.complexity(), i.num + i.den);
                            tuning.push(i.cents_off.abs());
                        }
                        // The event-level flag must be the disjunction of the per-interval ones, or
                        // a reader colouring a row and a reader reading the ratios disagree.
                        assert_eq!(restless, intervals.iter().any(|i| i.restless),
                                   "{f} t={at:.1}: event restless={restless} contradicts its own intervals");
                        if let Some(c) = &chord {
                            assert!(c.votes >= need && c.votes <= VOTE_WINDOWS,
                                    "{f} t={at:.1}: chord {} reports {} votes", c.name, c.votes);
                            assert!(c.extra.map_or(true, |x| x <= 1),
                                    "{f} t={at:.1}: chord {} keeps {:?} unexplained notes; above one, chord() declines to name anything",
                                    c.name, c.extra);
                        }
                        checked += 1;
                    }
                    // A voice with zero partials explains no peaks and cannot have produced a pitch.
                    Event::Onset { partials, .. } =>
                        assert!(partials >= 1, "{f} t={at:.1}: an onset from a voice with no partials"),
                    // The refit is a second fit of a strict subset of the same window. It may differ
                    // freely in size — that is the whole point — but a window shorter than its own
                    // trim would make it meaningless, and `over` is always at least 48s.
                    Event::Swelling { over, trim_s, .. } =>
                        assert!(over > trim_s, "{f} t={at:.1}: a {over:.0}s window refitted past {trim_s:.0}s"),
                    _ => {}
                }
            }
        }
        assert!(checked > 1000, "only {checked} interval events across the corpus — did the corpus shrink?");

        // A BOUNDS CHECK CANNOT CATCH A ZERO, and this line exists because the bounds check above
        // did not. Mutating `cents_off` to a constant 0.0 left every assertion green: zero sits
        // comfortably inside a 30-cent tolerance, so the field could carry nothing at all and still
        // read as a measurement. The default that survives a range test is the dangerous one.
        //
        // The distribution is what gives it away. Real tuning wobbles; measured across the corpus
        // the median is 12.0 cents and the tenth percentile is 2.2. A corpus of commercial
        // recordings whose intervals all land dead on just intonation is not a plausible reading,
        // it is a field that is not connected. The bar is set an order of magnitude under the
        // measured median so ordinary drift in the analysis chain cannot redden it.
        tuning.sort_by(|a, b| a.partial_cmp(b).unwrap());
        let median = tuning[tuning.len() / 2];
        assert!(median > 2.0,
                "median |cents_off| is {median:.2}¢ across {} readings — real tuning does not land \
                 that exactly on just intonation, so this field is reporting a default, not a measurement",
                tuning.len());
    }

    #[test]
    fn no_recorded_music_is_called_speech() {
        // THE NEGATIVE CONTROL THAT WAS ONLY EVER CLAIMED. `cochlea_replay`'s summary has printed
        // "a music fixture must read 0 — this is the negative control" since the detector shipped,
        // and nothing asserted it: all three speech tests are synthetic envelopes, which agree with
        // the rule by construction. The corpus is the only thing that can disagree with it, and when
        // it was finally asked, it did — on two of eight.
        //
        // Same shape as the JS swell mirror and the vibrato gap: a control that exists as a sentence
        // rather than as a run. Measured across every fixture before anything is asserted, so a leak
        // in a later recording cannot hide behind the first.
        let mut leaks = Vec::new();
        for f in MUSIC_FIXTURES {
            for (at, e) in speech_on_fixture(f).0 {
                if e.talking {
                    leaks.push(format!("{f}: t={at:.1} syllabic {:.2} (thresh {SPEECH_SYLLABIC}) \
                                        gaps {:.1} dB (thresh {SPEECH_GAPS_DB})", e.syllabic, e.gaps_db));
                }
            }
        }
        assert!(leaks.is_empty(), "recorded music was called speech {} times:\n  {}",
                leaks.len(), leaks.join("\n  "));
    }

    /// What the two thresholds are actually sitting in, on real music and on the only positive we
    /// have. Run with `--ignored --nocapture` when either constant is under discussion.
    ///
    /// The question this exists to answer is not "how far off are the leaks" but whether ANY pair of
    /// constants separates the corpus from a talker — and it cannot be answered honestly yet, because
    /// the positive side is one synthetic envelope. Its numbers are printed beside the music so the
    /// gap between "passes the synthetic" and "beats the corpus" is a measurement rather than a
    /// worry.
    #[test]
    #[ignore]
    fn measure_speech_features() {
        let pct = |v: &mut Vec<f32>, p: f32| -> f32 {
            v.sort_by(|a, b| a.partial_cmp(b).unwrap());
            v[((v.len() - 1) as f32 * p).round() as usize]
        };
        eprintln!("--- REAL MUSIC (every frame; the whole distribution the threshold sits in) ---");
        eprintln!("{:<42} {:>7} {:>7} {:>7}   {:>7} {:>7} {:>7}",
                  "fixture", "syl p50", "p99", "max", "gap p50", "p99", "max");
        for f in MUSIC_FIXTURES {
            let (_, frames) = speech_on_fixture(f);
            if frames.is_empty() { eprintln!("{f:<42}  (no level data)"); continue; }
            let mut syl: Vec<f32> = frames.iter().map(|e| e.syllabic).collect();
            let mut gap: Vec<f32> = frames.iter().map(|e| e.gaps_db).collect();
            let name = f.rsplit('/').next().unwrap_or(f);
            eprintln!("{name:<42} {:7.2} {:7.2} {:7.2}   {:7.1} {:7.1} {:7.1}",
                      pct(&mut syl, 0.50), pct(&mut syl, 0.99), pct(&mut syl, 1.0),
                      pct(&mut gap, 0.50), pct(&mut gap, 0.99), pct(&mut gap, 1.0));
        }
        eprintln!("--- THE ONLY POSITIVE WE HAVE, and it is synthetic ---");
        let mut s = SpeechSense::default();
        let (mut syl, mut gap) = (Vec::new(), Vec::new());
        for (t, db) in speech_like(20.0) {
            s.feed(db, t);
            if let Some(e) = s.features(t) { syl.push(e.syllabic); gap.push(e.gaps_db); }
        }
        eprintln!("{:<42} {:7.2} {:7.2} {:7.2}   {:7.1} {:7.1} {:7.1}", "speech_like(20s)",
                  pct(&mut syl, 0.50), pct(&mut syl, 0.99), pct(&mut syl, 1.0),
                  pct(&mut gap, 0.50), pct(&mut gap, 0.99), pct(&mut gap, 1.0));
        eprintln!("thresholds now: syllabic {SPEECH_SYLLABIC}, gaps {SPEECH_GAPS_DB} dB, both required");

        // HOW LONG THE VERDICT SURVIVES, which is the constant this file's own doctrine says to move.
        // `PULSE_MIN_STRENGTH` records the rule in as many words: when a detector leaks, do not raise
        // the threshold — that fits it to whichever recordings happen to be in tests/ — lengthen the
        // evidence instead. `SPEECH_HOLD_SECS` is this detector's memory, so what matters is not how
        // far the leaks exceed the threshold but how LONG they manage to.
        eprintln!("--- RUN LENGTHS: consecutive seconds the talking verdict holds ---");
        let runs = |frames: &[(f32, bool)]| -> Vec<f32> {
            let (mut out, mut start): (Vec<f32>, Option<f32>) = (vec![], None);
            for (t, talking) in frames {
                match (*talking, start) {
                    (true, None) => start = Some(*t),
                    (false, Some(s)) => { out.push(t - s); start = None; }
                    _ => {}
                }
            }
            if let (Some(s), Some((last, _))) = (start, frames.last()) { out.push(last - s); }
            out
        };
        for f in MUSIC_FIXTURES {
            let text = match std::fs::read_to_string(f) { Ok(t) => t, Err(_) => continue };
            let mut s = SpeechSense::default();
            let mut frames = vec![];
            for line in text.lines().filter(|l| l.trim().starts_with('{')) {
                let v: serde_json::Value = match serde_json::from_str(line) { Ok(v) => v, Err(_) => continue };
                let at = v.get("t").and_then(|x| x.as_f64()).unwrap_or(0.0) as f32;
                let db = match v.get("db").and_then(|x| x.as_f64()) { Some(d) => d as f32, None => continue };
                s.feed(db, at);
                if let Some(e) = s.features(at) { frames.push((at, e.talking)); }
            }
            let r = runs(&frames);
            let name = f.rsplit('/').next().unwrap_or(f);
            eprintln!("{name:<42} {} run(s), longest {:.1}s   {:?}", r.len(),
                      r.iter().cloned().fold(0.0f32, f32::max),
                      r.iter().map(|x| (x * 10.0).round() / 10.0).collect::<Vec<_>>());
        }
        let mut s = SpeechSense::default();
        let mut frames = vec![];
        for (t, db) in speech_like(30.0) {
            s.feed(db, t);
            if let Some(e) = s.features(t) { frames.push((t, e.talking)); }
        }
        let r = runs(&frames);
        eprintln!("{:<42} {} run(s), longest {:.1}s   (a talker keeps talking; music does not)",
                  "speech_like(30s)", r.len(), r.iter().cloned().fold(0.0f32, f32::max));
    }

    #[test]
    fn speech_is_not_called_until_the_verdict_has_held() {
        // THE COST OF THE NEGATIVE CONTROL, as a test rather than as a sentence in a doc comment.
        // Eight seconds of held evidence is what stops a dubstep breakdown being called a
        // conversation, and it means a real talker is not reported for eight seconds either — during
        // which the cochlea reads harmony off their vowels and says so. That is a property of the
        // design, not a defect queued for later, and the assertion exists so nobody optimises the
        // latency away without also moving the wall it is buying.
        let mut s = SpeechSense::default();
        let mut first: Option<f32> = None;
        for (t, db) in speech_like(30.0) {
            if let Some(Event::Speech { talking: true, .. }) = s.feed(db, t) {
                if first.is_none() { first = Some(t); }
            }
        }
        let at = first.expect("a continuous talking envelope was never reported");
        // THE FLOOR IS 0.9 OF THE WINDOW PLUS THE HOLD, and the 0.9 is not a fudge — `features`
        // opens the gate at `SPEECH_WINDOW_SECS * 0.9`, so the first verdict exists at 3.6 s and the
        // earliest possible report is 11.6. Written as the full window first, this assertion failed
        // at 11.7 s against a floor of 12.0: it was asserting a bound the detector never claimed,
        // which is a wrong test rather than a late report.
        let floor = SPEECH_WINDOW_SECS * 0.9 + SPEECH_HOLD_SECS;
        assert!(at >= floor,
                "reported at {at:.1}s, before the window ({:.1}s) and the hold ({:.1}s) could have elapsed",
                SPEECH_WINDOW_SECS * 0.9, SPEECH_HOLD_SECS);
        // And a band, not a floor: much later than this means the detector needs more than an
        // uninterrupted talker to commit, which would be a different defect and an invisible one.
        assert!(at < floor + 4.0,
                "reported at {at:.1}s — a talker who never stops should commit promptly after the hold");
    }

    #[test]
    fn a_sustained_chord_is_never_called_speech() {
        // The error that matters: calling music a conversation. A bowed chord holds its level.
        let mut s = SpeechSense::default();
        let mut wrong = 0;
        for i in 0..400 {
            let t = i as f32 / 11.7;
            // gentle vibrato and a slow swell, as strings actually behave
            let db = -24.0 + 1.2 * (2.0 * std::f32::consts::PI * 5.5 * t).sin() + 0.05 * t;
            if let Some(Event::Speech { talking: true, .. }) = s.feed(db, t) { wrong += 1; }
        }
        assert_eq!(wrong, 0, "a sustained chord was called speech {wrong} times");
    }

    #[test]
    fn a_fast_beat_alone_is_not_enough_to_be_speech() {
        // THE CONFOUND THE SECOND FEATURE EXISTS FOR. Music at 240 bpm puts beat energy straight into
        // the syllable band. Without gappiness this would read as talking.
        let mut s = SpeechSense::default();
        let mut wrong = 0;
        for i in 0..400 {
            let t = i as f32 / 11.7;
            // 4 Hz pulse, but the level never drops away between hits
            let db = -20.0 + 3.0 * (2.0 * std::f32::consts::PI * 4.0 * t).sin();
            if let Some(Event::Speech { talking: true, .. }) = s.feed(db, t) { wrong += 1; }
        }
        assert_eq!(wrong, 0, "a 4 Hz beat with no gaps was called speech {wrong} times");
    }

    #[test]
    fn one_odd_window_does_not_flip_the_verdict() {
        // Flipping "someone is talking" on and off would be worse than either answer held steadily.
        let mut s = SpeechSense::default();
        let mut flips = 0;
        for i in 0..600 {
            let t = i as f32 / 11.7;
            let mut db = -24.0 + 1.0 * (2.0 * std::f32::consts::PI * 5.5 * t).sin();
            if (250..262).contains(&i) { db = -45.0; }      // one brief dropout
            if s.feed(db, t).is_some() { flips += 1; }
        }
        assert!(flips <= 1, "a single dropout produced {flips} verdict changes");
    }

    #[test]
    fn a_verdict_lasting_a_third_of_a_second_is_not_reported() {
        // THE REAL FALSE POSITIVE, from a real recording. One Fratres window read syllabic 0.46
        // against a 0.45 threshold, held 0.34 s, and was reported as speech — because the guard
        // counted three agreeing FRAMES, and at 11.7 fps three frames overlap by 97%. They were one
        // observation wearing three hats.
        let mut s = SpeechSense::default();
        let mut calls = 0;
        for i in 0..600 {
            let t = i as f32 / 11.7;
            // steady music, with four frames that would cross into speech-like territory
            let speechy = (300..304).contains(&i);
            let db = if speechy { -45.0 } else { -24.0 + (2.0 * std::f32::consts::PI * 5.5 * t).sin() };
            if let Some(Event::Speech { talking: true, .. }) = s.feed(db, t) { calls += 1; }
        }
        assert_eq!(calls, 0, "a sub-second crossing was reported as speech {calls} times");
    }

    #[test]
    fn a_fade_in_from_silence_is_not_a_crescendo() {
        // Straight from the level trace of a real pass: silence at -100, a transition through -52,
        // then the music at -24. The silence guard clears below -60 and the fade-in slips under it,
        // so the transitional frames became the window's early end and the opening of every track
        // read as a 30 dB swell. Reported live at +29.7 and +33.3 dB.
        let mut s = Swell::default();
        for i in 0..240 { s.feed(-100.0, i as f32 / 12.0); }                 // 20s of silence
        for i in 240..300 { s.feed(-52.0 + (i - 240) as f32 * 0.4, i as f32 / 12.0); }  // fade-in
        s.sound_began();
        let mut n = 0;
        for i in 300..1200 {                                                 // 75s of steady music
            if s.feed(-24.0, i as f32 / 12.0).is_some() { n += 1; }
        }
        assert_eq!(n, 0, "a fade-in from silence produced {n} crescendo reports");
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

    /// TWO REPORTS THE OLD LINE RENDERED IDENTICALLY, and the field that separates them.
    ///
    /// B measured 10 of 16 eligible track starts producing a `growing` report pinned to the boundary,
    /// and could not tell the artifacts from the real openings retroactively: `+35.0 dB over 60s` is
    /// what the stream said for both, and the discriminator — where the window STARTED — existed only
    /// where `data/RECORD` happened to be armed. Three of the four it could check by refitting were
    /// real music, so a rule that indicted every pinned report would have been wrong three times in
    /// four. The fix is not a rule. It is printing the number that lets a reader decide.
    #[test]
    fn two_swells_of_equal_size_are_told_apart_by_where_they_started() {
        // Same climb, same duration, same everything the old line carried. One starts at the noise
        // floor — the shape of a playback ramp — and one starts at a level music is actually played at.
        let run = |head: f32| {
            let mut s = Swell::default();
            let mut got = None;
            for i in 0..900 {
                let t = i as f32 / 12.0;
                if let Some(e) = s.feed(head + 0.5 * t, t) {
                    if got.is_none() { got = Some(e); }
                }
            }
            match got {
                Some(Event::Swelling { db, from, .. }) => (db, from),
                other => panic!("a 0.5 dB/sec climb from {head} went unreported: {other:?}"),
            }
        };
        let (floor_db, floor_from) = run(-59.0);
        let (music_db, music_from) = run(-35.0);
        assert!((floor_db - music_db).abs() < 1.0,
                "the two climbs must be indistinguishable on the OLD fields for this test to mean \
                 anything: {floor_db:.1} vs {music_db:.1} dB");
        assert!(music_from - floor_from > 20.0,
                "the head is the discriminator and it separated them by only {:.1} dB",
                music_from - floor_from);
        assert!(floor_from < -55.0, "a window starting at the floor fitted its head at {floor_from:.1}");
    }

    /// REPLAY MUST EXERCISE THE SAME `Swell` AS PRODUCTION — the onset half.
    ///
    /// Found by B, from the ledger rather than from the code: `cochlea_service` calls `sound_began()`
    /// on every Onset and `track_changed()` on a title change, and `replay()` called neither. So every
    /// fixture ran a DIFFERENT detector than the live path, and the guard that was written to fix the
    /// fade-in bug was, in replay, simply absent — validated by nothing.
    ///
    /// The level here stays ABOVE -60 dB throughout, deliberately: below it the `feed` silence guard
    /// clears the history by itself and the test would pass without the routing existing. This is the
    /// band where only the onset can save it — quiet room tone, then music.
    #[test]
    fn a_replay_clears_the_dynamics_window_at_an_onset_the_way_the_live_path_does() {
        let mut frames = Vec::new();
        for i in 0..240 {                                  // 20s of quiet room tone, no pitch
            frames.push(Frame { at: i as f32 / 12.0, peaks: vec![], db: Some(-55.0), track: None });
        }
        for i in 240..1200 {                               // 80s of steady music, 25 dB louder
            frames.push(Frame {
                at: i as f32 / 12.0,
                peaks: vec![Peak { hz: 440.0, mag: 1.0 }, Peak { hz: 880.0, mag: 0.6 }],
                db: Some(-30.0),
                track: None,
            });
        }
        let events = replay(&frames, 30.0, 4.0);
        // Not a vacuous pass: if no onset fires at all there is nothing for the routing to do, and
        // the absence of swells below would prove nothing.
        assert!(events.iter().any(|(_, e)| matches!(e, Event::Onset { .. })),
                "no onset fired, so this test cannot be measuring the guard");
        let swells: Vec<_> = events.iter()
            .filter_map(|(at, e)| match e {
                Event::Swelling { db, from, .. } => Some(format!("{db:+.1} dB from {from:.1} at t={at:.0}")),
                _ => None,
            })
            .collect();
        assert!(swells.is_empty(),
                "the window reached back across the onset into the room tone: {}", swells.join(", "));
    }

    /// REPLAY MUST EXERCISE THE SAME `Swell` AS PRODUCTION — the track half.
    ///
    /// HONEST SCOPE, and it is the reason this test is synthetic rather than a fixture: no recording
    /// on disk carries `Frame::track`, because the recorder does not write it. So this proves the
    /// replay path handles a boundary when one is present; it does NOT prove any fixture validates
    /// the track-boundary fix, and none does. Wiring the recorder is a change to `cochlea_service`
    /// and belongs to whoever owns that file. Until then this is a capability with no data, said
    /// plainly here so nobody reads the green tick as coverage it isn't.
    #[test]
    fn a_replay_clears_the_dynamics_window_when_the_track_changes() {
        let voice = || vec![Peak { hz: 440.0, mag: 1.0 }, Peak { hz: 880.0, mag: 0.6 }];
        let mut frames = Vec::new();
        for i in 0..900 {                                  // 75s of a quiet track
            frames.push(Frame { at: i as f32 / 12.0, peaks: voice(), db: Some(-45.0),
                                track: Some("quiet song".into()) });
        }
        for i in 900..1500 {                               // 50s of a loud one, no gap, no silence
            frames.push(Frame { at: i as f32 / 12.0, peaks: voice(), db: Some(-20.0),
                                track: Some("loud song".into()) });
        }
        let swells: Vec<_> = replay(&frames, 30.0, 4.0).into_iter()
            .filter_map(|(at, e)| match e {
                Event::Swelling { db, from, .. } => Some(format!("{db:+.1} dB from {from:.1} at t={at:.0}")),
                _ => None,
            })
            .collect();
        assert!(swells.is_empty(),
                "a window spanning two songs called the 25 dB between them a crescendo: {}",
                swells.join(", "));
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
            // 0.12 dB/sec — the real climb to the climax, measured off the arc. The earlier version
            // used 0.08, which is now deliberately below the threshold, so the test was asserting
            // that an undetectable slope gets detected.
            if s.feed(-50.0 + 0.12 * t, t).is_some() { n += 1; }
        }
        assert!(n >= 1, "five minutes of crescendo said nothing");
        // 300s at one report per 15s is at most 20 even if it never stops trending.
        assert!(n <= 20, "five minutes of crescendo produced {n} lines");
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


