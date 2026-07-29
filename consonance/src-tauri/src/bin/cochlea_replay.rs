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

use cochlea::{replay, Event, Peak};

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

    let mut frames: Vec<(f32, Vec<Peak>)> = Vec::new();
    for line in text.lines().filter(|l| !l.trim().is_empty()) {
        let v: serde_json::Value = match serde_json::from_str(line) {
            Ok(v) => v,
            Err(_) => continue,          // a partial last line is normal while recording
        };
        let t = v.get("t").and_then(|x| x.as_f64()).unwrap_or(0.0) as f32;
        let peaks = v.get("peaks").and_then(|x| x.as_array()).map(|a| {
            a.iter().filter_map(|p| {
                let pair = p.as_array()?;
                Some(Peak {
                    hz: pair.first()?.as_f64()? as f32,
                    mag: pair.get(1)?.as_f64()? as f32,
                })
            }).collect::<Vec<_>>()
        }).unwrap_or_default();
        frames.push((t, peaks));
    }

    if frames.is_empty() {
        eprintln!("no frames in {path} — is data/RECORD present and something playing?");
        std::process::exit(1);
    }

    let span = frames.last().unwrap().0 - frames.first().unwrap().0;
    let events = replay(&frames, 30.0, 4.0);

    if !summary {
        for (at, e) in &events {
            match e {
                Event::Onset { hz } => println!("{at:7.2}  onset      ~{hz:.0} Hz"),
                Event::Silence => println!("{at:7.2}  silence"),
                Event::Intervals { names, restless } =>
                    println!("{at:7.2}  {:9}{}", if *restless { "restless" } else { "settled" },
                             names.join(" · ")),
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
    for (_, e) in &events {
        match e {
            Event::Onset { .. } => onsets += 1,
            Event::Intervals { names, .. } => { chords += 1; widths.push(names.len()); }
            Event::StillUnresolved { .. } => holds += 1,
            Event::Resolved { after_secs } => res.push(*after_secs),
            Event::Silence => {}
        }
    }
    let mean = |v: &[f32]| if v.is_empty() { 0.0 } else { v.iter().sum::<f32>() / v.len() as f32 };
    println!("frames {}  span {:.1}s  events {}", frames.len(), span, events.len());
    println!("  {:.2} events/sec of audio", events.len() as f32 / span.max(0.001));
    println!("  chords {chords}  onsets {onsets}  holds {holds}  resolutions {}", res.len());
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
