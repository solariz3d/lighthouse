//! Replay a recorded pass of real music through the current analysis chain.
//!
//!     cargo run --bin cochlea_replay -- C:/Consonance/data/frames.jsonl
//!     cargo run --bin cochlea_replay -- frames.jsonl --summary
//!
//! WHY. Every tracker change today was checked by asking the keeper to close the app, wait ninety
//! seconds, reopen it, play something and describe what he saw. Six times. And each comparison was
//! against DIFFERENT music, which is exactly what left one measurement permanently uninterpretable:
//! restless share moved 28.4% → 45.3% between builds, and the song changed too, so nothing
//! separates the two causes.
//!
//! The analysis is deterministic — same peaks in, same events out. So a recorded pass is a fixed
//! reference, and any change becomes a real A/B with nobody pressing play. Arm a recording by
//! creating `data/RECORD`; remove it to stop.
//!
//! `--summary` prints the distribution rather than the stream, which is what actually answers
//! questions like "are these 0.6s resolutions real or is the tension floor still leaking".

#[path = "../cochlea.rs"]
mod cochlea;

use cochlea::{replay, Event, Frame, Peak};

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let path = match args.first() {
        Some(p) => p.clone(),
        None => {
            eprintln!("usage: cochlea_replay <frames.jsonl> [--summary]");
            std::process::exit(2);
        }
    };
    let summary = args.iter().any(|a| a == "--summary");

    let text = match std::fs::read_to_string(&path) {
        Ok(t) => t,
        Err(e) => {
            eprintln!("cannot read {path}: {e}");
            std::process::exit(1);
        }
    };

    let mut frames: Vec<Frame> = Vec::new();
    for line in text.lines().filter(|l| !l.trim().is_empty()) {
        let v: serde_json::Value = match serde_json::from_str(line) {
            Ok(v) => v,
            Err(_) => continue,          // a partial last line is normal while recording
        };
        let at = v.get("t").and_then(|x| x.as_f64()).unwrap_or(0.0) as f32;
        // Absent in fixtures recorded before dynamics existed. Left as None rather than defaulted,
        // so a missing measurement cannot pass itself off as a flat one.
        let db = v.get("db").and_then(|x| x.as_f64()).map(|d| d as f32);
        let peaks = v.get("peaks").and_then(|x| x.as_array()).map(|a| {
            a.iter().filter_map(|p| {
                let pair = p.as_array()?;
                Some(Peak {
                    hz: pair.first()?.as_f64()? as f32,
                    mag: pair.get(1)?.as_f64()? as f32,
                })
            }).collect::<Vec<_>>()
        }).unwrap_or_default();
        frames.push(Frame { at, peaks, db });
    }

    if frames.is_empty() {
        eprintln!("no frames in {path} — is data/RECORD present and something playing?");
        std::process::exit(1);
    }

    let span = frames.last().unwrap().at - frames.first().unwrap().at;
    let has_level = frames.iter().any(|f| f.db.is_some());
    let events = replay(&frames, 30.0, 4.0);

    if !summary {
        for (at, e) in &events {
            match e {
                Event::Onset { hz } => println!("{at:7.2}  onset      ~{hz:.0} Hz"),
                Event::Silence => println!("{at:7.2}  silence"),
                Event::Intervals { names, restless, chord } =>
                    println!("{at:7.2}  {:9}{}{}", if *restless { "restless" } else { "settled" },
                             chord.as_ref().map(|c| format!("{c:10}")).unwrap_or_default(),
                             names.join(" · ")),
                Event::Swelling { rising, db, over } =>
                    println!("{at:7.2}  {:9}{:+.1} dB over {:.0}s",
                             if *rising { "growing" } else { "fading" }, db, over),
                Event::StillUnresolved { secs } => println!("{at:7.2}  HOLDING    {secs:.1}s"),
                Event::Resolved { after_secs } => println!("{at:7.2}  resolved   after {after_secs:.1}s"),
            }
        }
        println!();
    }

    // The numbers worth comparing between builds. Rates are per second of RECORDED AUDIO, not per
    // wall-clock second of the replay, so they are comparable to what the live ledger reports.
    let mut onsets = 0;
    let mut chords = 0;
    let mut holds = 0;
    let mut res: Vec<f32> = Vec::new();
    let mut widths: Vec<usize> = Vec::new();
    let mut named_chords = 0;
    let mut swells = 0;
    for (_, e) in &events {
        match e {
            Event::Onset { .. } => onsets += 1,
            Event::Intervals { names, chord, .. } => {
                chords += 1;
                widths.push(names.len());
                if chord.is_some() { named_chords += 1; }
            }
            Event::StillUnresolved { .. } => holds += 1,
            Event::Resolved { after_secs } => res.push(*after_secs),
            Event::Swelling { .. } => swells += 1,
            Event::Silence => {}
        }
    }
    let mean = |v: &[f32]| if v.is_empty() { 0.0 } else { v.iter().sum::<f32>() / v.len() as f32 };
    println!("frames {}  span {:.1}s  events {}", frames.len(), span, events.len());
    println!("  {:.2} events/sec of audio", events.len() as f32 / span.max(0.001));
    // "swells 0" against a fixture with no level data would read as "no crescendo in this music",
    // which is a missing measurement wearing the shape of a real one. Say which it is.
    let swell_col = if has_level { format!("swells {swells}") } else { "swells —(no level data in this fixture; re-record to measure dynamics)".to_string() };
    println!("  chords {chords}  onsets {onsets}  holds {holds}  resolutions {}  {swell_col}", res.len());
    if has_level {
        let dbs: Vec<f32> = frames.iter().filter_map(|f| f.db).filter(|d| *d > -60.0).collect();
        if !dbs.is_empty() {
            let lo = dbs.iter().cloned().fold(f32::INFINITY, f32::min);
            let hi = dbs.iter().cloned().fold(f32::NEG_INFINITY, f32::max);
            // The dynamic RANGE is the number a swell detector can only ever approximate, and it is
            // free to compute from the recording. For the reference piece this is the whole form.
            println!("  level  {lo:.1} to {hi:.1} dBFS  (range {:.1} dB)", hi - lo);
        }
    }
    // What fraction of readings could be named as a chord rather than left as bare intervals. This
    // is the number chord-naming exists to move, and a replay is the only place to see it move
    // without re-listening to the same piece by hand.
    println!("  named as a chord: {named_chords} of {chords} ({:.0}%)",
             if chords > 0 { 100.0 * named_chords as f32 / chords as f32 } else { 0.0 });
    println!("  intervals per chord  mean {:.2}  max {}",
             mean(&widths.iter().map(|&w| w as f32).collect::<Vec<_>>()),
             widths.iter().max().copied().unwrap_or(0));
    if !res.is_empty() {
        let mut s = res.clone();
        s.sort_by(|a, b| a.partial_cmp(b).unwrap());
        // The question this exists to answer: are the short resolutions a real musical event or the
        // tension floor leaking? A pile-up just above MIN_TENSION_SECS is the leak's signature.
        let near_floor = res.iter().filter(|&&x| x < 1.0).count();
        println!("  resolutions  median {:.1}s  min {:.1}s  max {:.1}s",
                 s[s.len() / 2], s[0], s[s.len() - 1]);
        println!("  under 1.0s: {near_floor} of {} ({:.0}%) — a pile-up here is the tension floor leaking",
                 res.len(), 100.0 * near_floor as f32 / res.len() as f32);
    }
}
