//! What could each detector honestly put in a `conf` field? Measured, not reasoned.
//!
//!     cargo run --bin conf_sweep -- src-tauri/tests/*.jsonl
//!
//! WHY THIS EXISTS. Era 4 wants a confidence on every detector event, and the standing rule in this
//! repo is that a number nothing measures is worse than no number. So before any field is named,
//! every candidate quantity gets swept across the whole fixture corpus and its real range printed.
//! This is an INSTRUMENT, not a test: nothing here asserts, and its output is meant to be pasted
//! into a design note and re-derived by anyone who doubts it.
//!
//! HOW IT AVOIDS BEING A MIRROR, which is the failure this repo has already paid for twice (the JS
//! swell mirror, the covgap fixtures agreeing with their own rule):
//!   * it drives the REAL `Tracker`, `Swell`, `SpeechSense` and `Pulse`, in the same order `replay`
//!     drives them — it does not reimplement any detector;
//!   * the swell window is rebuilt from the event's own `over`/`from` fields and the rebuild is
//!     CHECKED against them, so a divergent reconstruction announces itself instead of being
//!     believed (the same self-check `tools/swell-head.js` uses);
//!   * the two places it does re-derive a rule — the vote count and the corroborated-voice filter —
//!     are marked MIRROR: below, and their numbers are reported as approximations of the shipped
//!     rule rather than as the rule.
//!
//! WHAT IT CANNOT REACH, said here rather than discovered from a silent zero: `Vibrato` never runs.
//! Fixtures carry ten spectral peaks per frame and no fine pitch track, so every vibrato number in
//! this sweep would be a number about nothing. The recorder writes `fine` since 5911e9d; no fixture
//! on disk predates that.

#[path = "../cochlea.rs"]
mod cochlea;

use cochlea::*;

/// Cents from JUST to the EQUAL-TEMPERED version of the same interval. The corpus is recorded
/// commercial music, i.e. almost entirely 12-TET, so a match against a just table is expected to sit
/// near this offset rather than near zero. Without it, "|cents_off| is spread across the tolerance"
/// cannot be told from "the music is tempered and the table is just" — two very different readings
/// of the same number.
fn et_offset(num: u32, den: u32) -> Option<f32> {
    let semis: f32 = match (num, den) {
        (2, 1) => 12.0, (3, 2) => 7.0, (4, 3) => 5.0, (5, 4) => 4.0, (6, 5) => 3.0,
        (5, 3) => 9.0, (8, 5) => 8.0, (9, 8) => 2.0, (16, 9) => 10.0, (15, 8) => 11.0,
        (16, 15) => 1.0, (45, 32) => 6.0, (7, 4) => 10.0, (1, 1) => 0.0,
        _ => return None,
    };
    Some(semis * 100.0 - 1200.0 * (num as f32 / den as f32).log2())
}

fn pct(v: &mut Vec<f32>, p: f32) -> f32 {
    if v.is_empty() { return f32::NAN; }
    v.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    let i = ((v.len() - 1) as f32 * p).round() as usize;
    v[i]
}
fn spread(label: &str, v: &[f32]) {
    let mut s = v.to_vec();
    if s.is_empty() { println!("    {label:<26} —  (no samples)"); return; }
    println!("    {label:<26} n={:<5} min {:>7.2}  p10 {:>7.2}  p50 {:>7.2}  p90 {:>7.2}  max {:>7.2}",
             s.len(), pct(&mut s, 0.0), pct(&mut s, 0.10), pct(&mut s, 0.50), pct(&mut s, 0.90), pct(&mut s, 1.0));
}

/// One reconstructed swell window, with the fit statistics the event does not carry.
struct SwellFit {
    at: f32, rising: bool, db: f32, over: f32, from: f32,
    r2: f32, t: f32, resid_sd: f32, n: usize,
    refit_db: f32, refit_sweep: [f32; 4], head_ok: bool, db_ok: bool,
}
/// Trims the refit is evaluated at, in seconds. Six is the constant B's analysis used; the others
/// are there so the note can say whether the answer depends on it.
const TRIMS: [f32; 4] = [3.0, 6.0, 10.0, 15.0];

/// Least squares over (t, db). Returns (slope, intercept, r2, resid_sd, t_stat).
fn fit(w: &[(f32, f32)]) -> (f32, f32, f32, f32, f32) {
    let n = w.len() as f32;
    if n < 3.0 { return (0.0, 0.0, 0.0, 0.0, 0.0); }
    let mt = w.iter().map(|(t, _)| *t).sum::<f32>() / n;
    let md = w.iter().map(|(_, d)| *d).sum::<f32>() / n;
    let mut sxy = 0.0; let mut sxx = 0.0; let mut syy = 0.0;
    for (t, d) in w { sxy += (t - mt) * (d - md); sxx += (t - mt) * (t - mt); syy += (d - md) * (d - md); }
    if sxx <= 0.0 { return (0.0, md, 0.0, 0.0, 0.0); }
    let slope = sxy / sxx;
    let icept = md - slope * mt;
    let ss_res: f32 = w.iter().map(|(t, d)| { let e = d - (icept + slope * t); e * e }).sum();
    let r2 = if syy > 0.0 { 1.0 - ss_res / syy } else { 0.0 };
    // Residual sd and the slope's own standard error — the textbook statistic for "is this line
    // real", and the only quantity here with a null distribution behind it.
    let resid_sd = (ss_res / (n - 2.0).max(1.0)).sqrt();
    let se = resid_sd / sxx.sqrt();
    let t_stat = if se > 0.0 { slope.abs() / se } else { 0.0 };
    (slope, icept, r2, resid_sd, t_stat)
}

/// THE OCTAVE IS THE ONE INTERVAL WHOSE TRUE VALUE IS KNOWN. Everything else the interval channel
/// reports is measured against a table nobody can check against the audio; a 2:1 is 2:1 in every
/// tuning system ever used. So a systematic error on octaves is a direct read of the chain's own
/// bias — which is the number that says whether a 30-cent tolerance is generous or merely inside
/// the instrument's noise. The corpus reports octaves 13.3 cents WIDE on average across 103
/// readings, and this asks whether the chain does that to a synthetic octave that is exact.
fn octave_probe() {
    const SR: f32 = 48_000.0;
    const N: usize = 4096;
    println!("exact synthetic octaves through peaks() -> voices() -> interval():");
    println!("   f0 Hz    reported lo      reported hi     cents_off   n_voices");
    for f0 in [55.0f32, 110.0, 220.0, 440.0, 880.0] {
        // Two notes an EXACT octave apart, each with a few harmonics, as a real instrument would be.
        let samples: Vec<f32> = (0..N).map(|i| {
            let t = i as f32 / SR;
            let voice = |f: f32| (1..=4).map(|h| {
                (1.0 / h as f32) * (std::f32::consts::TAU * f * h as f32 * t).sin()
            }).sum::<f32>();
            0.3 * voice(f0) + 0.3 * voice(f0 * 2.0)
        }).collect();
        let spec = spectrum(&samples);
        let pk = peaks(&spec, SR, 10, 0.12);
        let vs = voices(&pk, 30.0);
        let m = moment(&pk, 30.0);
        let oct = m.intervals.iter().find(|i| i.num == 2 && i.den == 1);
        match (vs.first(), oct) {
            (Some(_), Some(iv)) => {
                let mut hz: Vec<f32> = vs.iter().map(|v| v.hz).collect();
                hz.sort_by(|a, b| a.partial_cmp(b).unwrap());
                println!("  {f0:7.1}  {:12.2}  {:14.2}  {:+9.2}¢  {}",
                         hz.first().copied().unwrap_or(0.0), hz.last().copied().unwrap_or(0.0),
                         iv.cents_off, vs.len());
            }
            _ => println!("  {f0:7.1}  no octave reported ({} voices: {:?})", vs.len(),
                          vs.iter().map(|v| v.hz.round()).collect::<Vec<_>>()),
        }
    }
    // The same probe with ONE note only: two octave-spaced partials of a single voice must be fused,
    // not reported as an octave. If this prints an interval the fusion is leaking, and every octave
    // in the corpus is suspect for a different reason than tuning.
    let samples: Vec<f32> = (0..N).map(|i| {
        let t = i as f32 / SR;
        0.3 * (std::f32::consts::TAU * 220.0 * t).sin() + 0.15 * (std::f32::consts::TAU * 440.0 * t).sin()
    }).collect();
    let m = moment(&peaks(&spectrum(&samples), SR, 10, 0.12), 30.0);
    println!("  one note with a strong 2nd harmonic -> intervals {:?}  voices {}",
             m.intervals.iter().map(|i| format!("{}:{}", i.num, i.den)).collect::<Vec<_>>(), m.voices.len());
}

fn main() {
    if std::env::args().any(|a| a == "--octave-probe") { octave_probe(); return; }
    let paths: Vec<String> = std::env::args().skip(1).filter(|a| !a.starts_with("--")).collect();
    if paths.is_empty() { eprintln!("usage: conf_sweep <fixture.jsonl>..."); std::process::exit(2); }

    // corpus-wide pools
    let (mut c_onset_part, mut c_onset_share, mut c_onset_db, mut c_onset_resid) =
        (vec![], vec![], vec![], vec![]);
    let mut c_onset_inferred = (0usize, 0usize);
    let (mut c_iv_cents, mut c_iv_minpart, mut c_iv_minshare, mut c_iv_db) = (vec![], vec![], vec![], vec![]);
    let mut c_iv_votes = (0usize, 0usize);          // (3 of 4, 4 of 4)
    let mut c_ch_votes = (0usize, 0usize);
    let mut c_ch_extra = (0usize, 0usize);
    let (mut c_iv_et, mut c_iv_cents_unan, mut c_iv_cents_split) = (vec![], vec![], vec![]);
    let mut c_iv_by_ratio: Vec<(u32, u32, f32)> = vec![];
    let mut c_onsets: Vec<(String, f32, f32, f32, usize, bool)> = vec![];
    let mut c_oct_pairs: Vec<(f32, usize, bool, f32, usize, bool)> = vec![];
    let mut c_ch_unknown = 0usize;
    let mut refit_mismatches: Vec<String> = vec![];
    let mut c_swells: Vec<(String, SwellFit)> = vec![];
    let mut c_pulse: Vec<(String, f32, f32, f32)> = vec![];
    let mut c_speech: Vec<(String, f32, bool, f32, f32)> = vec![];

    for path in &paths {
        let name = path.rsplit(['/', '\\']).next().unwrap_or(path).to_string();
        let text = match std::fs::read_to_string(path) {
            Ok(t) => t, Err(e) => { eprintln!("cannot read {path}: {e}"); continue; }
        };
        let mut frames: Vec<Frame> = vec![];
        let mut fine_seen = 0usize;
        for line in text.lines().filter(|l| !l.trim().is_empty()) {
            let v: serde_json::Value = match serde_json::from_str(line) { Ok(v) => v, Err(_) => continue };
            if v.get("fine").is_some() { fine_seen += 1; }
            let at = v.get("t").and_then(|x| x.as_f64()).unwrap_or(0.0) as f32;
            let db = v.get("db").and_then(|x| x.as_f64()).map(|d| d as f32);
            let peaks = v.get("peaks").and_then(|x| x.as_array()).map(|a| {
                a.iter().filter_map(|p| { let q = p.as_array()?;
                    Some(Peak { hz: q.first()?.as_f64()? as f32, mag: q.get(1)?.as_f64()? as f32 }) })
                 .collect::<Vec<_>>()
            }).unwrap_or_default();
            let track = v.get("track").and_then(|x| x.as_str()).map(|s| s.to_string());
            frames.push(Frame { at, peaks, db, track });
        }
        if frames.is_empty() { continue; }
        let span = frames.last().unwrap().at - frames.first().unwrap().at;
        println!("\n═══ {name}   frames {}  span {:.0}s  fine-track frames {fine_seen}", frames.len(), span);

        // The level series, kept whole so a swell window can be rebuilt from its own bounds.
        let levels: Vec<(f32, f32)> = frames.iter().filter_map(|f| f.db.map(|d| (f.at, d))).collect();

        // ---- the same drive order as `replay`, with the real detectors ----
        let mut tracker = Tracker::default();
        let mut swell = Swell::default();
        let mut speech = SpeechSense::default();
        let mut pulse = Pulse::default();
        let mut track: Option<String> = None;
        let mut ring: Vec<Moment> = vec![];             // MIRROR: the vote window, for counting only

        let (mut f_onset_part, mut f_onset_share, mut f_onset_db, mut f_onset_resid) = (vec![], vec![], vec![], vec![]);
        let mut f_onset_inferred = (0usize, 0usize);
        let (mut f_iv_cents, mut f_iv_minpart, mut f_iv_minshare) = (vec![], vec![], vec![]);
        let mut f_iv_votes = (0usize, 0usize);
        let mut f_ch_votes = (0usize, 0usize);
        let mut f_ch_extra = (0usize, 0usize);
        let mut f_ch_unknown = 0usize;
        let mut f_swells: Vec<SwellFit> = vec![];

        for f in &frames {
            if f.track.is_some() && f.track != track { track = f.track.clone(); swell.track_changed(); }
            let m = moment(&f.peaks, 30.0);
            ring.push(m.clone());
            if ring.len() > VOTE_WINDOWS { ring.remove(0); }
            let db_here = f.db.unwrap_or(f32::NAN);

            for e in tracker.feed(m.clone(), f.at, 4.0) {
                match &e {
                    Event::Onset { hz, .. } => {
                        swell.sound_began();
                        // The voice that produced the reported fundamental.
                        if let Some(v) = m.voices.iter().find(|v| (v.hz - hz).abs() < 0.01) {
                            let total: f32 = m.voices.iter().map(|v| v.mag).sum();
                            f_onset_part.push(v.partials as f32);
                            f_onset_share.push(if total > 0.0 { v.mag / total } else { 0.0 });
                            // A fixture recorded before dynamics existed has no level. Pushing NaN
                            // would poison every percentile drawn from this pool with a missing
                            // measurement — the same shape as the "swells 0" line this repo already
                            // fixed once.
                            if db_here.is_finite() { f_onset_db.push(db_here); }
                            c_onsets.push((name.clone(), f.at, *hz, db_here,
                                           v.partials, v.inferred));
                            // How well the note's own series explains the peaks assigned to it:
                            // mean |cents| from an exact harmonic. This is the pitch claim's only
                            // internal evidence.
                            let mut errs = vec![];
                            for p in &f.peaks {
                                let n = (p.hz / v.hz).round();
                                if n >= 1.0 && n <= 16.0 {
                                    let c = cents(p.hz / (n * v.hz));
                                    if c.abs() <= 40.0 { errs.push(c.abs()); }
                                }
                            }
                            if !errs.is_empty() {
                                f_onset_resid.push(errs.iter().sum::<f32>() / errs.len() as f32);
                            }
                            if v.inferred { f_onset_inferred.0 += 1; } else { f_onset_inferred.1 += 1; }
                        }
                    }
                    Event::Intervals { intervals, chord, .. } => {
                        // THE TWO MIRRORS ARE GONE. This block used to re-derive the vote count and
                        // parse ratios back out of the rendered strings, because the event carried
                        // names and nothing else; both are now fields on the reading itself, so the
                        // sweep reads what shipped instead of an approximation of it. What remains
                        // marked MIRROR below is the corroborated-voice filter, which the event still
                        // does not carry.
                        let loudest = m.voices.iter().map(|v| v.mag).fold(0.0f32, f32::max);
                        let total: f32 = m.voices.iter().map(|v| v.mag).sum();
                        // MIRROR: copied from `moment` (partials >= 2 OR mag >= 0.35 * loudest).
                        // Reported as an approximation of the shipped rule; if the rule moves, this
                        // number is stale and says nothing.
                        let named: Vec<&Voice> = m.voices.iter()
                            .filter(|v| v.partials >= 2 || (loudest > 0.0 && v.mag >= 0.35 * loudest)).collect();
                        for iv in intervals {
                            let (num, den, votes) = (iv.num, iv.den, iv.votes);
                            if votes >= VOTE_WINDOWS { f_iv_votes.1 += 1; } else { f_iv_votes.0 += 1; }
                            f_iv_cents.push(iv.cents_off.abs());
                            if let Some(e) = et_offset(num, den) {
                                c_iv_et.push((iv.cents_off - e).abs());
                            }
                            // Does the vote agree with the tuning? Two candidate confidences
                            // measuring the same claim from different sides either converge or
                            // one of them is measuring nothing.
                            if votes >= VOTE_WINDOWS { c_iv_cents_unan.push(iv.cents_off.abs()); }
                            else { c_iv_cents_split.push(iv.cents_off.abs()); }
                            c_iv_by_ratio.push((num, den, iv.cents_off));
                            // The weaker of the two voices making this interval.
                            let mut best: Option<(f32, f32)> = None;
                            for i in 0..named.len() {
                                for j in i + 1..named.len() {
                                    if let Some(x) = interval(named[i].hz, named[j].hz, 30.0) {
                                        if x.num == num && x.den == den {
                                            let mp = named[i].partials.min(named[j].partials) as f32;
                                            let ms = if total > 0.0 { named[i].mag.min(named[j].mag) / total } else { 0.0 };
                                            if best.map_or(true, |(b, _)| mp < b) { best = Some((mp, ms)); }
                                        }
                                    }
                                }
                            }
                            if let Some((mp, ms)) = best { f_iv_minpart.push(mp); f_iv_minshare.push(ms); }
                            // What an octave reading is actually made of. The synthetic probe shows
                            // fusion absorbs a true octave pair, so these pairs are something else.
                            if num == 2 && den == 1 && c_oct_pairs.len() < 12 {
                                for i in 0..named.len() {
                                    for j in i + 1..named.len() {
                                        if interval(named[i].hz, named[j].hz, 30.0)
                                            .map_or(false, |x| x.num == 2 && x.den == 1) {
                                            c_oct_pairs.push((named[i].hz, named[i].partials, named[i].inferred,
                                                              named[j].hz, named[j].partials, named[j].inferred));
                                        }
                                    }
                                }
                            }
                            if db_here.is_finite() { c_iv_db.push(db_here); }
                        }
                        if let Some(c) = chord {
                            if c.votes >= VOTE_WINDOWS { f_ch_votes.1 += 1; } else { f_ch_votes.0 += 1; }
                            // `extra` is now None when the voted name outlived every frame that
                            // produced it — counted separately rather than folded into "0 strangers",
                            // which is the distinction the old code could not make.
                            match c.extra {
                                Some(0) => f_ch_extra.1 += 1,
                                Some(_) => f_ch_extra.0 += 1,
                                None => f_ch_unknown += 1,
                            }
                        }
                    }
                    _ => {}
                }
            }

            if let Some(db) = f.db {
                if let Some(Event::Swelling { rising, db: change, over, from,
                                             refit_db: shipped_refit, trim_s }) = swell.feed(db, f.at) {
                    // Rebuild the window from the event's OWN bounds and check the rebuild against
                    // the event before believing any statistic drawn from it.
                    let lo = f.at - over;
                    let w: Vec<(f32, f32)> = levels.iter().cloned()
                        .filter(|(t, _)| *t >= lo - 1e-3 && *t <= f.at + 1e-3).collect();
                    let (slope, _, r2, sd, t) = fit(&w);
                    let head_ok = w.first().map_or(false, |(_, d)| (d - from).abs() < 0.05);
                    let db_ok = (slope * over - change).abs() < 0.5;
                    // B's refit: drop the leading six seconds and fit again. A window whose trend is
                    // an entrance out of silence collapses; real music keeps its slope.
                    let refit_at = |trim: f32| -> f32 {
                        let tr: Vec<(f32, f32)> = w.iter().cloned().filter(|(t, _)| *t >= lo + trim).collect();
                        fit(&tr).0 * (over - trim).max(1.0)
                    };
                    let refit_db = refit_at(6.0);
                    // THE IN-DETECTOR REFIT AGAINST THE OFFLINE ONE. Era 4 moved this computation
                    // inside `Swell`, where it can use the per-frame levels the stream does not
                    // carry; this reconstruction is the one that was validated against 83 of 83
                    // window heads. Two independent computations of the same quantity, so a
                    // disagreement means one of them is wrong and neither should be believed until
                    // it is found. Compared at the trim the event itself names, not at a guess.
                    let mine = refit_at(trim_s);
                    if (mine - shipped_refit).abs() > 0.15 {
                        refit_mismatches.push(format!(
                            "{name} t={:.1}: event says {shipped_refit:+.2}, rebuild says {mine:+.2} (trim {trim_s:.0}s)",
                            f.at));
                    }
                    // THE TRIM IS A CONSTANT FROM ONE CASE — six seconds is the measured length of
                    // the Adagio's entrance out of digital silence. A discriminator that only works
                    // at the length of the case that motivated it is fitted to that case, so every
                    // window carries its refit at four trims and the note quotes the spread.
                    let refit_sweep = [refit_at(3.0), refit_at(6.0), refit_at(10.0), refit_at(15.0)];
                    f_swells.push(SwellFit { at: f.at, rising, db: change, over, from,
                                             r2, t, resid_sd: sd, n: w.len(), refit_db, refit_sweep,
                                             head_ok, db_ok });
                }
                if let Some(Event::Speech { talking, evidence }) = speech.feed(db, f.at) {
                    c_speech.push((name.clone(), f.at, talking, evidence.syllabic, evidence.gaps_db));
                }
                // Read WITHOUT the PULSE_ENABLED gate: the maths runs either way, and what this
                // sweep needs is the confidence the reading WOULD carry, on music known to have no
                // beat. Suppressing it here would hide the only negative calibration there is.
                if let Some(Event::Pulse(p)) = pulse.feed(db, f.at) {
                    c_pulse.push((name.clone(), p.bpm, p.strength, p.steady));
                }
            }
        }

        println!("  ONSET — the pitch claim");
        println!("    inferred (residue) fundamental: {} of {}", f_onset_inferred.0, f_onset_inferred.0 + f_onset_inferred.1);
        spread("partials in the voice", &f_onset_part);
        spread("magnitude share", &f_onset_share);
        spread("level dBFS at onset", &f_onset_db);
        spread("harmonic resid |cents|", &f_onset_resid);
        println!("  INTERVALS — the ratio claim");
        println!("    votes: {} at 3/4, {} at 4/4", f_iv_votes.0, f_iv_votes.1);
        spread("|cents_off| from just", &f_iv_cents);
        spread("weaker voice partials", &f_iv_minpart);
        spread("weaker voice mag share", &f_iv_minshare);
        println!("  CHORD — the name claim");
        println!("    votes: {} at 3/4, {} at 4/4     extra notes: {} with 1, {} with 0",
                 f_ch_votes.0, f_ch_votes.1, f_ch_extra.0, f_ch_extra.1);
        println!("  SWELLS — {} reports", f_swells.len());
        for s in &f_swells {
            println!("    t={:7.1} {:7} {:+6.1} dB /{:4.0}s  from {:6.1}  | R² {:.3}  t {:6.1}  resid_sd {:4.1}  n {:3}  refit {:+6.1}{}{}",
                     s.at, if s.rising { "growing" } else { "fading" }, s.db, s.over, s.from,
                     s.r2, s.t, s.resid_sd, s.n, s.refit_db,
                     if s.head_ok { "" } else { "  HEAD-MISMATCH" },
                     if s.db_ok { "" } else { "  SLOPE-MISMATCH" });
        }

        c_onset_part.extend(f_onset_part); c_onset_share.extend(f_onset_share);
        c_onset_db.extend(f_onset_db); c_onset_resid.extend(f_onset_resid);
        c_onset_inferred.0 += f_onset_inferred.0; c_onset_inferred.1 += f_onset_inferred.1;
        c_iv_cents.extend(f_iv_cents); c_iv_minpart.extend(f_iv_minpart); c_iv_minshare.extend(f_iv_minshare);
        c_iv_votes.0 += f_iv_votes.0; c_iv_votes.1 += f_iv_votes.1;
        c_ch_votes.0 += f_ch_votes.0; c_ch_votes.1 += f_ch_votes.1;
        c_ch_extra.0 += f_ch_extra.0; c_ch_extra.1 += f_ch_extra.1; c_ch_unknown += f_ch_unknown;
        for s in f_swells { c_swells.push((name.clone(), s)); }
    }

    println!("\n\n═══════════ CORPUS ═══════════");
    println!("  ONSET   inferred fundamental in {} of {} onsets", c_onset_inferred.0, c_onset_inferred.0 + c_onset_inferred.1);
    spread("partials", &c_onset_part);
    spread("mag share", &c_onset_share);
    spread("level dBFS", &c_onset_db);
    spread("harmonic resid |cents|", &c_onset_resid);
    println!("  INTERVAL  votes {} at 3/4 · {} at 4/4  ({:.0}% unanimous)",
             c_iv_votes.0, c_iv_votes.1,
             100.0 * c_iv_votes.1 as f32 / (c_iv_votes.0 + c_iv_votes.1).max(1) as f32);
    spread("|cents_off|", &c_iv_cents);
    spread("weaker voice partials", &c_iv_minpart);
    spread("weaker voice mag share", &c_iv_minshare);
    spread("level dBFS at event", &c_iv_db);
    spread("|cents from EQUAL TEMP|", &c_iv_et);
    println!("    tuning by vote:   3/4 windows mean {:.1}¢   4/4 windows mean {:.1}¢   (do the two candidate confidences agree?)",
             c_iv_cents_split.iter().sum::<f32>() / c_iv_cents_split.len().max(1) as f32,
             c_iv_cents_unan.iter().sum::<f32>() / c_iv_cents_unan.len().max(1) as f32);
    println!("    per ratio — count, mean signed cents_off, mean |cents_off|, and what EQUAL TEMP predicts:");
    let mut ratios: Vec<(u32, u32)> = c_iv_by_ratio.iter().map(|(n, d, _)| (*n, *d)).collect();
    ratios.sort(); ratios.dedup();
    for (n, d) in ratios {
        let s: Vec<f32> = c_iv_by_ratio.iter().filter(|(a, b, _)| *a == n && *b == d).map(|(_, _, c)| *c).collect();
        let mean = s.iter().sum::<f32>() / s.len() as f32;
        let amean = s.iter().map(|x| x.abs()).sum::<f32>() / s.len() as f32;
        println!("      {n:>2}:{d:<2}  n={:<6} mean {:+6.1}¢  |mean| {:5.1}¢   ET predicts {:+6.1}¢",
                 s.len(), mean, amean, et_offset(n, d).unwrap_or(f32::NAN));
    }
    println!("    what a 2:1 reading is actually made of (first {} pairs):", c_oct_pairs.len());
    for (a, ap, ai, b, bp, bi) in &c_oct_pairs {
        println!("      {a:8.1} Hz (p{ap}{}) x {b:8.1} Hz (p{bp}{})   ratio {:.4}",
                 if *ai { ",inferred" } else { "" }, if *bi { ",inferred" } else { "" }, b / a);
    }
    println!("  CHORD   votes {} at 3/4 · {} at 4/4    extra 1: {}  extra 0: {}  extra unknown: {} \
              (the voted name outlived every frame that produced it)",
             c_ch_votes.0, c_ch_votes.1, c_ch_extra.0, c_ch_extra.1, c_ch_unknown);
    println!("  ONSET events, every one in the corpus:");
    for (n, at, hz, db, part, inf) in &c_onsets {
        let (nm, ct) = note_name(*hz);
        println!("    {n:<38} t={at:7.1}  {nm:<5}({ct:+4.0}¢, {hz:7.1} Hz)  level {db:7.1} dBFS  partials {part}{}",
                 if *inf { "  INFERRED (residue pitch)" } else { "" });
    }

    println!("  SWELL   {} reports across the corpus", c_swells.len());
    let mut r2s: Vec<f32> = c_swells.iter().map(|(_, s)| s.r2).collect();
    let mut ts: Vec<f32> = c_swells.iter().map(|(_, s)| s.t).collect();
    let mut sds: Vec<f32> = c_swells.iter().map(|(_, s)| s.resid_sd).collect();
    spread("R²", &r2s.clone());
    spread("slope t-statistic", &ts.clone());
    spread("residual sd (dB)", &sds.clone());
    // THE CANDIDATE THAT MATTERS FOR SWELL. Fit quality answers "is this line straight"; the thing
    // actually in doubt is "is this window one piece of music". The head-trimmed refit is the only
    // measurement that has ever separated those, so its AGREEMENT with the reported figure —
    // refit/db, 1.0 when trimming changes nothing — is the candidate. Printed for the whole corpus
    // and split by head level, because a rule that only holds on floor-headed windows is a rule
    // about five windows.
    let agree: Vec<f32> = c_swells.iter().map(|(_, s)| s.refit_db / s.db).collect();
    let agree_floor: Vec<f32> = c_swells.iter().filter(|(_, s)| s.from < -50.0).map(|(_, s)| s.refit_db / s.db).collect();
    let agree_rest: Vec<f32> = c_swells.iter().filter(|(_, s)| s.from >= -50.0).map(|(_, s)| s.refit_db / s.db).collect();
    spread("refit agreement (all)", &agree);
    spread("  ... floor-headed", &agree_floor);
    spread("  ... everything else", &agree_rest);
    println!("    windows where the refit REVERSES the reported direction: {} of {}",
             c_swells.iter().filter(|(_, s)| s.refit_db * s.db < 0.0).count(), c_swells.len());
    let bad = c_swells.iter().filter(|(_, s)| !s.head_ok || !s.db_ok).count();
    println!("    rebuild check: {} of {} windows disagree with the event they came from", bad, c_swells.len());
    println!("    in-detector refit vs offline rebuild: {} disagreement(s){}", refit_mismatches.len(),
             if refit_mismatches.is_empty() { "  — two independent computations agree".to_string() }
             else { format!("\n      {}", refit_mismatches.join("\n      ")) });
    // The question the R² number exists to answer: does a good fit separate a real crescendo from
    // a fade-in? Print the floor-headed windows against the rest.
    let floor: Vec<&(String, SwellFit)> = c_swells.iter().filter(|(_, s)| s.from < -50.0).collect();
    println!("    floor-headed windows (from < -50 dB): {}", floor.len());
    println!("      (refit shown at trims {:?} s — does the adjudication depend on the constant?)", TRIMS);
    for (n, s) in &floor {
        println!("      {n:<38} t={:6.1} {:+6.1} dB  R² {:.3}  refit {:+6.1} {:+6.1} {:+6.1} {:+6.1}",
                 s.at, s.db, s.r2, s.refit_sweep[0], s.refit_sweep[1], s.refit_sweep[2], s.refit_sweep[3]);
    }
    // Does the trim change the VERDICT anywhere in the corpus, or only the number?
    let flips = c_swells.iter().filter(|(_, s)| {
        let signs: Vec<bool> = s.refit_sweep.iter().map(|r| *r * s.db > 0.0).collect();
        signs.iter().any(|x| *x) && signs.iter().any(|x| !*x)
    }).count();
    println!("    windows whose refit AGREES at one trim and reverses at another: {} of {}", flips, c_swells.len());
    let _ = (pct(&mut r2s, 0.5), pct(&mut ts, 0.5), pct(&mut sds, 0.5));

    println!("  SPEECH  {} verdict events (every fixture is a NEGATIVE — no positive material exists)", c_speech.len());
    for (n, at, talking, syl, gaps) in &c_speech {
        println!("    {n:<38} t={at:7.1}  {}  syllabic {syl:.2} (thresh 0.45)  gaps {gaps:.1} dB (thresh 7.0)",
                 if *talking { "SPEECH" } else { "music " });
    }
    println!("  PULSE   {} readings that WOULD have been emitted with the gate open", c_pulse.len());
    for (n, bpm, strength, steady) in &c_pulse {
        println!("    {n:<38} {bpm:6.1} bpm  lock {strength:.3}  steady {steady:.3}");
    }
    println!("  VIBRATO 0 readings possible — no fixture carries the fine pitch track.");
}
