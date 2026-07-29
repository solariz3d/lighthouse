//! The listening service — capture thread, analysis thread, and the ledger.
//!
//! Three pieces that must not be one: `capture_audio` opens the tap, `cochlea` turns windows
//! into intervals, and this owns the threads and decides what is worth saying. Keeping them
//! apart is what let the maths be proven on synthesised tones before any audio existed.
//!
//! WHAT GOES ON DISK, and why that is a deliberate decision rather than a default. The event
//! ledger is a record of what the keeper was listening to, with timestamps. That is his life,
//! at the same grain as `dreams/`, so it lands in `data/` and is gitignored by the same rule:
//! the framework ships, the contents do not. No unattended process of ours publishes.
//!
//! AND WHAT NEVER STARTS. Capture refuses while a kernel anti-cheat is loaded. He asked whether
//! this could ever trigger one — "I never want that" — and the honest search found no documented
//! cases, which is weaker than safe. So it is a rule, checked at start AND re-checked while
//! running: launching League mid-session must stop the capture, not merely fail to have started it.

use std::fs::OpenOptions;
use std::io::Write;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{mpsc, Arc, Mutex};
use std::time::Instant;

use serde::Serialize;
use sysinfo::System;

use crate::capture_audio::{self, SAMPLE_RATE, WINDOW};
use crate::cochlea::{bands, moment, peaks, spectrum, Event, Tracker};
use crate::listen::anticheat_present;

/// One line of what the room is doing. Shaped for reading, not for parsing — the whole point is
/// that a person or an instance can look at it and hear something.
#[derive(Clone, Debug, Serialize)]
pub struct Heard {
    pub at: String,
    pub kind: String,
    pub text: String,
}

/// The frequency field as it stands right now, plus what the grouping made of it.
///
/// TWO READERS, TWO RATES, and that asymmetry is the design rather than a shortcut. The tab can
/// take a stream — a canvas redraws for free. The orchestrator cannot: at ~12 frames a second,
/// pushing bands into a conversation would spend a context window in minutes, which is exactly
/// how the first ledger drowned. So this is a LATCH, not a queue. The UI is pushed to; anything
/// else pulls, gets whatever is current, and never accumulates a backlog it has to drain.
#[derive(Clone, Debug, Default, Serialize)]
pub struct Snapshot {
    pub bands: Vec<f32>,
    /// Fundamental / magnitude / partial-count / was-it-inferred, per grouped note. This is what
    /// lets the display colour each partial by the note it was assigned to — the only way to see
    /// the fusion succeed or fail on real music instead of on synthesised tones.
    pub voices: Vec<(f32, f32, usize, bool)>,
    pub peaks: Vec<f32>,
    pub intervals: Vec<String>,
    pub restless: bool,
    pub at: String,
}

#[derive(Default)]
pub struct Listening {
    pub stop: Option<Arc<AtomicBool>>,
    pub source: Option<String>,
}

#[derive(Default)]
pub struct Service(pub Mutex<Listening>, pub Mutex<Snapshot>);

fn ledger_path(data_dir: &PathBuf) -> PathBuf { data_dir.join("heard.jsonl") }

fn describe(e: &Event) -> Option<Heard> {
    let now = chrono::Local::now().format("%H:%M:%S").to_string();
    let (kind, text) = match e {
        Event::Onset { hz } => {
            // The name first, the frequency second. An afternoon was spent reading "~467 Hz" and
            // converting it by hand every time, which is the instrument leaving its work undone.
            let (name, cents) = crate::cochlea::note_name(*hz);
            ("onset", format!("sound begins · {name} ({:+.0}¢, {:.0} Hz)", cents, hz))
        }
        Event::Silence => ("silence", "silence".to_string()),
        Event::Intervals { names, restless } => (
            if *restless { "restless" } else { "settled" },
            format!("{}{}", names.join(" · "), if *restless { "  — wants to move" } else { "" }),
        ),
        Event::StillUnresolved { secs } => ("held", format!("still unresolved · {:.1}s", secs)),
        Event::Resolved { after_secs } => ("resolved", format!("resolved after {:.1}s", after_secs)),
    };
    Some(Heard { at: now, kind: kind.into(), text })
}

/// Start listening to one process tree. `on_event` receives every line; the caller decides
/// whether that means the UI, the ledger, or both.
pub fn start<F, S>(
    pid: u32,
    data_dir: PathBuf,
    source_label: String,
    on_event: F,
    on_frame: S,
) -> Result<Arc<AtomicBool>, String>
where
    F: Fn(Heard) + Send + 'static,
    S: Fn(Snapshot) + Send + 'static,
{
    // Checked here rather than only in the UI: a command can be invoked without the tab, and a
    // guard that lives in the view is not a guard.
    let mut sys = System::new();
    sys.refresh_processes();
    let ac = anticheat_present(&sys);
    if !ac.is_empty() {
        return Err(format!(
            "refusing to capture while {} is running. No documented case links audio loopback to a ban, \
             and that is weaker than safe — so this does not start rather than weighing the odds.",
            ac.join(", ")
        ));
    }

    let stop = Arc::new(AtomicBool::new(false));
    let (tx, rx) = mpsc::channel::<Vec<f32>>();

    // capture thread — its own COM apartment, must never block on anything the UI holds
    {
        let stop_c = stop.clone();
        std::thread::spawn(move || {
            if let Err(e) = capture_audio::run(pid, tx, stop_c.clone()) {
                eprintln!("[cochlea] capture ended: {e}");
                stop_c.store(true, Ordering::Relaxed);
            }
        });
    }

    // analysis thread — FFT, intervals, and the anti-cheat re-check
    {
        let stop_a = stop.clone();
        std::thread::spawn(move || {
            let started = Instant::now();
            let mut tracker = Tracker::default();
            let mut sys = System::new();
            let mut last_ac_check = Instant::now();
            // Re-checked once a second rather than per frame, and rather than once at start: arming
            // a recording should not require restarting the capture.
            let mut recording = false;
            let mut last_rec_check = Instant::now() - std::time::Duration::from_secs(9);
            // Back-dated so the first frame reports the track rather than waiting two seconds.
            let mut last_np_check = Instant::now() - std::time::Duration::from_secs(9);
            let mut last_np = String::new();

            while !stop_a.load(Ordering::Relaxed) {
                let chunk = match rx.recv_timeout(std::time::Duration::from_millis(500)) {
                    Ok(c) => c,
                    Err(mpsc::RecvTimeoutError::Timeout) => {
                        // Silence still has to be re-checked for anti-cheat: a game launched
                        // while nothing is playing must still stop this.
                        if last_ac_check.elapsed().as_secs() >= 5 {
                            last_ac_check = Instant::now();
                            sys.refresh_processes();
                            if !anticheat_present(&sys).is_empty() {
                                on_event(Heard { at: chrono::Local::now().format("%H:%M:%S").to_string(),
                                                 kind: "stopped".into(),
                                                 text: "anti-cheat detected — capture stopped".into() });
                                stop_a.store(true, Ordering::Relaxed);
                            }
                        }
                        continue;
                    }
                    Err(_) => break,
                };
                debug_assert_eq!(chunk.len(), WINDOW);

                let spec = spectrum(&chunk);
                // Ten, not five. Before fusion, five peaks meant five things to pair up and that
                // was already too many. Now peaks are raw material for grouping and a single note
                // consumes three or four of them, so five could not represent two notes at once —
                // a dyad would arrive with one voice's partials truncated and read as silence.
                let pk = peaks(&spec, SAMPLE_RATE as f32, 10, 0.12);
                let m = moment(&pk, 30.0);
                let t = started.elapsed().as_secs_f32();

                if last_rec_check.elapsed().as_secs() >= 1 {
                    last_rec_check = Instant::now();
                    recording = data_dir.join("RECORD").exists();
                }
                if recording { record_frame(&data_dir, t, &pk); }

                // What is playing, polled rather than pushed, and emitted only when it CHANGES.
                // Every two seconds is far more often than tracks change and far cheaper than the
                // FFT already running beside it. Emitting on change rather than on a clock is the
                // same rule as everything else here: a held thing costs one line.
                if last_np_check.elapsed().as_secs() >= 2 {
                    last_np_check = Instant::now();
                    if let Some(np) = crate::nowplaying::read(&source_label) {
                        let line = np.line();
                        if !line.is_empty() && line != last_np {
                            last_np = line.clone();
                            on_event(Heard {
                                at: chrono::Local::now().format("%H:%M:%S").to_string(),
                                kind: "track".into(),
                                text: format!("♪ {line}"),
                            });
                        }
                    }
                }

                on_frame(Snapshot {
                    bands: bands(&spec, SAMPLE_RATE as f32, 64),
                    voices: m.voices.iter().map(|v| (v.hz, v.mag, v.partials, v.inferred)).collect(),
                    peaks: pk.iter().map(|p| p.hz).collect(),
                    intervals: m.intervals.iter().map(|i| format!("{}:{} {}", i.num, i.den, i.name)).collect(),
                    restless: m.restless,
                    at: chrono::Local::now().format("%H:%M:%S").to_string(),
                });
                for ev in tracker.feed(m, t, 4.0) {
                    if let Some(h) = describe(&ev) { on_event(h); }
                }

                if last_ac_check.elapsed().as_secs() >= 5 {
                    last_ac_check = Instant::now();
                    sys.refresh_processes();
                    if !anticheat_present(&sys).is_empty() {
                        on_event(Heard { at: chrono::Local::now().format("%H:%M:%S").to_string(),
                                         kind: "stopped".into(),
                                         text: "anti-cheat detected — capture stopped".into() });
                        stop_a.store(true, Ordering::Relaxed);
                    }
                }
            }
        });
    }
    Ok(stop)
}

/// Append one frame of peaks to the fixture recording, if recording is armed.
///
/// ARMED BY A FILE, `data/RECORD`, deliberately. An env var cannot be set on an app the keeper
/// launches from a desktop shortcut, and a UI toggle is a feature nobody asked for. A file can be
/// created from a shell in one line and its absence costs a `try_exists` per second.
///
/// PEAKS, NOT AUDIO. 4096 floats per frame at twelve frames a second is 196 KB/s and unkeepable.
/// Peaks are ~10 pairs, and they are what `moment()` consumes — so a recording exercises fusion,
/// corroboration, naming, voting and the tracker, which is every layer that has broken today.
pub fn record_frame(data_dir: &PathBuf, at: f32, peaks: &[crate::cochlea::Peak]) {
    let line = format!(
        "{{\"t\":{:.3},\"peaks\":[{}]}}",
        at,
        peaks.iter().map(|p| format!("[{:.2},{:.6}]", p.hz, p.mag)).collect::<Vec<_>>().join(","),
    );
    if let Ok(mut f) = OpenOptions::new().create(true).append(true).open(data_dir.join("frames.jsonl")) {
        let _ = writeln!(f, "{line}");
    }
}

/// Write the current frame to a single file, overwritten every time.
///
/// WHY THIS EXISTS, and it is a correction. `audio_snapshot` was built as the orchestrator's pull
/// channel and the orchestrator cannot call it — it is a Tauri command, reachable from the tab
/// and from nothing else. So a pull channel was designed with no way to pull, and the immediate
/// consequence was an hour of hypothesising about live behaviour from a ledger that does not
/// carry it, then testing a guess that turned out to be wrong.
///
/// A file is the one interface every reader here already has. It is a LATCH, not a log: the same
/// path, truncated and rewritten, so it can never grow and there is never a backlog to drain.
/// Whoever reads it gets the present moment and nothing else — which is the same contract
/// `audio_snapshot` has, finally reachable.
///
/// Throttled well below frame rate. The display needs every frame; a reader who samples does not,
/// and rewriting a file twelve times a second to be read once a minute is churn for nobody.
pub fn write_field(data_dir: &PathBuf, s: &Snapshot) {
    let _ = std::fs::create_dir_all(data_dir);
    if let Ok(line) = serde_json::to_string(s) {
        let _ = std::fs::write(data_dir.join("field.json"), line);
    }
}

/// Append one line to the ledger. Best-effort: a listening feature must never take the app down
/// because a disk was busy.
pub fn append(data_dir: &PathBuf, h: &Heard) {
    let _ = std::fs::create_dir_all(data_dir);
    if let Ok(mut f) = OpenOptions::new().create(true).append(true).open(ledger_path(data_dir)) {
        if let Ok(line) = serde_json::to_string(h) {
            let _ = writeln!(f, "{line}");
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_event_kind_produces_a_line() {
        // A silent event kind would be a hole in the ledger that looks like quiet.
        let evs = vec![
            Event::Onset { hz: 110.0 },
            Event::Silence,
            Event::Intervals { names: vec!["3:2 fifth".into()], restless: false },
            Event::StillUnresolved { secs: 4.1 },
            Event::Resolved { after_secs: 5.2 },
        ];
        for e in evs {
            let h = describe(&e).expect("every event must describe itself");
            assert!(!h.kind.is_empty() && !h.text.is_empty(), "{e:?} produced an empty line");
        }
    }

    #[test]
    fn restlessness_is_visible_in_the_kind_not_only_the_text() {
        // A UI that has to grep prose to colour a row will break the first time the wording
        // changes. The distinction that matters is a field.
        let calm = describe(&Event::Intervals { names: vec!["3:2 fifth".into()], restless: false }).unwrap();
        let tense = describe(&Event::Intervals { names: vec!["45:32 tritone".into()], restless: true }).unwrap();
        assert_eq!(calm.kind, "settled");
        assert_eq!(tense.kind, "restless");
    }

    #[test]
    fn the_ledger_writes_and_survives_a_missing_directory() {
        let dir = std::env::temp_dir().join(format!("cochlea-test-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        append(&dir, &Heard { at: "00:00:00".into(), kind: "onset".into(), text: "x".into() });
        assert!(ledger_path(&dir).exists(), "append must create the directory it needs");
        let _ = std::fs::remove_dir_all(&dir);
    }
}
