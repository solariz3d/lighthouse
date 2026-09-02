//! Replay a pane's raw `.log` through the capture harvester's own detector and extractor.
//!
//!     cargo run --bin harvest_replay -- C:/Consonance/data/captures/<id>.log
//!     cargo run --bin harvest_replay -- C:/Consonance/data/captures            (every .log)
//!
//! WHY THIS EXISTS (L033, P-CAPTURE-HARVEST). On 2026-09-02 four committee panes' `.txt`
//! transcripts stopped advancing at 02:39 while their `.log` files grew to 20-83 MB through a
//! full night of work. `warm_resume_brief` builds a rebuilt pane's shell from the `.txt`, so every
//! pane rebuilt at 06:28 woke carrying the PREVIOUS relaunch's tail — this file was written by a
//! pane that could not remember its own night.
//!
//! THE FAULT COULD BE IN EITHER OF TWO PLACES and the `.txt` mtime alone cannot tell them apart:
//! *nothing was harvested* and *harvesting ran and produced nothing* leave the identical stamp.
//! The watcher in `main.rs:1049` gates on TWO conditions — ~500ms of quiet, and
//! `capture::screen_ready` — and only the second is a pure function of the screen. So this replays
//! the bytes the pane actually emitted through the SAME `vt100` emulator at the SAME dimensions and
//! runs the SAME detector, and reports how often the screen was ready and how many distinct turns
//! the extractor would have produced.
//!
//! IT IS DELIBERATELY MORE PERMISSIVE THAN THE LIVE WATCHER, and that asymmetry is the point:
//! the log carries no timestamps, so quiescence cannot be replayed. This evaluates the detector at
//! EVERY chunk boundary, which is a superset of the real settle points. Therefore:
//!
//!   ready == 0   is CONCLUSIVE — the detector never matched a screen this pane ever painted, at
//!                any point in the stream. The ready-screen detector is the fault.
//!   ready > 0    means the detector works on this log and the fault is UPSTREAM of it — the
//!                watcher thread never ran, or the quiescence gate never opened, or the write went
//!                somewhere else. It does NOT prove the live watcher would have fired.
//!
//! `#[path]` into the real `capture.rs` rather than a copy, the same way `capture_probe` and
//! `cochlea_replay` do it: a replay over a duplicate of the code proves the duplicate.

#[path = "../capture.rs"]
mod capture;

use std::io::Read;

// Must match main.rs:894-895. A different geometry re-wraps every line and would make the whole
// run measure a screen the pane never had.
const EMU_ROWS: u16 = 34;
const EMU_COLS: u16 = 120;

// The watcher polls every 250ms and reads the whole screen; the reader loop feeds it in 8 KB PTY
// reads. This is the feed size, not the poll — see the header on why it is evaluated more often.
const CHUNK: usize = 8192;

struct Tally {
    chunks: usize,
    ready: usize,
    working: usize,
    box_only: usize,
    empty_prompt: usize,
    empty_resp: usize,
    records: usize,
    first_ready_at: Option<usize>,
    last_ready_at: Option<usize>,
    last_prompt: Option<String>,
    first_prompt: Option<String>,
}

fn replay(path: &std::path::Path) {
    let mut f = match std::fs::File::open(path) {
        Ok(f) => f,
        Err(e) => {
            println!("{}: CANNOT OPEN — {e}", path.display());
            return;
        }
    };
    let size = f.metadata().map(|m| m.len()).unwrap_or(0);

    let mut parser = vt100::Parser::new(EMU_ROWS, EMU_COLS, 0);
    let mut t = Tally {
        chunks: 0, ready: 0, working: 0, box_only: 0, empty_prompt: 0, empty_resp: 0,
        records: 0, first_ready_at: None, last_ready_at: None,
        last_prompt: None, first_prompt: None,
    };
    // The watcher's own dedup key, so `records` counts what would have been APPENDED, not how many
    // frames looked ready. Without this the number is a frame count wearing a turn count's name.
    let mut last: Option<(String, String)> = None;

    let mut buf = vec![0u8; CHUNK];
    loop {
        let n = match f.read(&mut buf) {
            Ok(0) => break,
            Ok(n) => n,
            Err(e) => { println!("  read error after {} chunks: {e}", t.chunks); break; }
        };
        parser.process(&buf[..n]);
        t.chunks += 1;

        let screen = parser.screen();
        let lines: Vec<String> = screen.rows(0, EMU_COLS).collect();
        let wrapped: Vec<bool> = (0..lines.len() as u16).map(|i| screen.row_wrapped(i)).collect();

        // The two halves of screen_ready, counted separately — "no box at all" and "a box but a
        // turn in flight" are different diagnoses and the boolean hides which one held.
        let has_box = lines.iter().any(|l| capture::is_empty_box(l));
        let working = capture::is_working(&lines);
        if working { t.working += 1; }
        if has_box && working { t.box_only += 1; }
        if !capture::screen_ready(&lines) { continue; }

        t.ready += 1;
        if t.first_ready_at.is_none() { t.first_ready_at = Some(t.chunks); }
        t.last_ready_at = Some(t.chunks);

        let lines: Vec<String> = lines.iter().map(|l| capture::strip_overlay(l)).collect();
        let prompt = capture::latest_prompt(&lines, &wrapped);
        if prompt.is_empty() { t.empty_prompt += 1; continue; }
        let resp = capture::latest_turn(&lines, &wrapped);
        if resp.trim().is_empty() { t.empty_resp += 1; continue; }

        if let Some((lp, lr)) = last.clone() {
            if lp == prompt {
                if lr == resp { continue; }
                last = Some((prompt, capture::stitch(&lr, &resp)));
                continue;
            }
        }
        t.records += 1;
        if t.first_prompt.is_none() { t.first_prompt = Some(prompt.clone()); }
        t.last_prompt = Some(prompt.clone());
        last = Some((prompt, resp));
    }

    let name = path.file_name().unwrap_or_default().to_string_lossy();
    println!("{name}  ({size} bytes, {} chunks of {CHUNK})", t.chunks);
    println!("  screen_ready TRUE at   {} chunk boundaries", t.ready);
    println!("    of which no prompt:  {}", t.empty_prompt);
    println!("    of which no response:{}", t.empty_resp);
    println!("  is_working TRUE at     {} (turn in flight)", t.working);
    println!("    box present anyway:  {}", t.box_only);
    println!("  RECORDS the extractor would have appended: {}", t.records);
    match (t.first_ready_at, t.last_ready_at) {
        (Some(a), Some(b)) => println!("  first/last ready at chunk {a} / {b}"),
        _ => println!("  NEVER READY — the detector matched no screen in this entire log"),
    }
    if let Some(p) = &t.first_prompt {
        println!("  first record prompt: {}", &p.chars().take(90).collect::<String>());
    }
    if let Some(p) = &t.last_prompt {
        println!("  last  record prompt: {}", &p.chars().take(90).collect::<String>());
    }
    // What is on disk beside it, so the replay and the artifact it explains are read together.
    let txt = path.with_extension("txt");
    match std::fs::metadata(&txt) {
        Ok(m) => println!("  .txt on disk: {} bytes", m.len()),
        Err(_) => println!("  .txt on disk: ABSENT"),
    }
    println!();
}

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    if args.is_empty() {
        eprintln!("usage: harvest_replay <file.log | directory>");
        std::process::exit(2);
    }
    for a in &args {
        let p = std::path::PathBuf::from(a);
        if p.is_dir() {
            let mut logs: Vec<_> = std::fs::read_dir(&p)
                .expect("read dir")
                .filter_map(|e| e.ok().map(|e| e.path()))
                .filter(|p| p.extension().map(|e| e == "log").unwrap_or(false))
                .collect();
            logs.sort();
            for l in logs { replay(&l); }
        } else {
            replay(&p);
        }
    }
}
