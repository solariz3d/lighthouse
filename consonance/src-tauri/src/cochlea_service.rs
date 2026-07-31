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
use crate::cochlea::{
    bands, moment, peaks, pitch_track, rms_db, spectrum, Event, Pulse, SpeechSense, Swell, Tracker, Vibrato,
};
use crate::listen::anticheat_present;

/// One line of what the room is doing. Shaped for reading, not for parsing — the whole point is
/// that a person or an instance can look at it and hear something.
#[derive(Clone, Debug, Serialize)]
pub struct Heard {
    pub at: String,
    pub kind: String,
    /// Which subsystem spoke. A context-free reader of the ledger correctly inferred four
    /// detectors from 22 lines and then could not tell the player's metadata from the audio
    /// analysis — the split exists and the stream hid it. Additive: old consumers ignore it.
    pub det: &'static str,
    pub text: String,
}

/// Millisecond wall-clock stamp. Whole-second stamps put two contradictory-looking events in the
/// same second (a restless full sonority and its settled subset at "00:52:12") and made
/// "resolved after 0.7s" unverifiable against the ledger's own timeline.
fn stamp() -> String {
    chrono::Local::now().format("%H:%M:%S%.3f").to_string()
}

/// kind → detector, one source of truth. Kinds are already disjoint across subsystems; this makes
/// the mapping a field instead of tribal knowledge.
fn det_for(kind: &str) -> &'static str {
    match kind {
        "onset" | "silence" | "restless" | "settled" | "held" | "resolved" => "tracker",
        "growing" | "fading" => "swell",
        "speech" | "music" => "speech",
        "pulse" => "pulse",
        "voice" => "vibrato",
        "track" => "player",
        "stopped" => "capture",
        _ => "unknown",
    }
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
    /// What is playing and where we are in it. In the SNAPSHOT rather than the ledger because a
    /// position changes every second: it is live state, not a record. This is also what lets a
    /// reader know it is four minutes into a seven-minute piece instead of guessing — which is
    /// exactly what "should be close to the end" was, twice.
    pub now: Option<crate::nowplaying::NowPlaying>,
    /// The chord, unvoted — this is the raw per-frame reading for the display. The ledger gets the
    /// voted one; the tab can afford to flicker and the reader cannot.
    pub chord: Option<String>,
    /// Loudness of this window in dBFS, so the tab can show a meter and a sampling reader can see
    /// the dynamic arc without waiting for a swell event to fire.
    pub level_db: f32,
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
    let now = stamp();
    let (kind, text) = match e {
        Event::Onset { hz, .. } => {
            // The name first, the frequency second. An afternoon was spent reading "~467 Hz" and
            // converting it by hand every time, which is the instrument leaving its work undone.
            // `partials` and `inferred` ride the event for the structured fields; the rendered line
            // stays the sentence a human reads.
            let (name, cents) = crate::cochlea::note_name(*hz);
            ("onset", format!("sound begins · {name} ({:+.0}¢, {:.0} Hz)", cents, hz))
        }
        Event::Silence => ("silence", "silence".to_string()),
        // "WANTS TO MOVE" IS GONE FROM THE TEXT, and its removal is the whole of era 4's item 13.
        // It asserted functional harmony — a leading tone, a seventh under a dominant — which needs a
        // key, a chord function and voice leading, none of which exist here. What is actually
        // measured is ratio complexity in a fixed table, and on crossfading ambient the claim is
        // simply false: a 9:8 appears because a voice is mid-transit and vanishes when the crossfade
        // completes. Two cold readers repeated the phrase back as a fact about the music.
        //
        // `restless` survives as the KIND, where it is a label rather than a claim, with its rule on
        // the header line so a reader can disagree with the threshold instead of reverse-engineering
        // it — which both readers did unaided, which is the argument for shipping the rule.
        Event::Intervals { intervals, restless, chord } => (
            if *restless { "restless" } else { "settled" },
            format!(
                "{}{}",
                // The chord first when there is one: it is the thing a reader wants, and the
                // intervals behind it are the evidence for it.
                chord.as_ref().map(|c| format!("{}   ", c.name)).unwrap_or_default(),
                intervals.iter()
                    .map(|i| format!("{}:{} {}", i.num, i.den, i.name))
                    .collect::<Vec<_>>().join(" · "),
            ),
        ),
        Event::Pulse(p) => {
            // Steadiness in words rather than a number: a reader wants to know whether it is a
            // machine or a person, and 0.31 does not say that.
            let feel = if p.steady > 0.8 { "machine-steady" }
                       else if p.steady > 0.5 { "steady" }
                       else if p.steady > 0.25 { "breathing" }
                       else { "elastic" };
            ("pulse", format!("pulse · {:.0} bpm · {feel}", p.bpm))
        }
        Event::Vibrato(v) => {
            // The note name, because "880 Hz wobbling" is the same unread number the onsets used to
            // be. A singer thinks in notes.
            let (name, _) = crate::cochlea::note_name(v.hz);
            ("voice", format!("a voice · {name} wobbling ±{:.0}¢ at {:.1} Hz", v.depth_cents, v.rate_hz))
        }
        Event::Speech { talking, evidence } => (
            if *talking { "speech" } else { "music" },
            if *talking {
                // The evidence travels with the verdict. The positive side of this threshold is
                // still calibrated on synthetic envelopes only, so a reader should be able to see
                // WHY rather than take "speech" on faith.
                format!("someone is talking — not reading this as music  (syllabic {:.2}, gaps {:.0} dB)",
                        evidence.syllabic, evidence.gaps_db)
            } else {
                "back to music".to_string()
            },
        ),
        // `from` is on the line because without it the dB figure is unreadable: the same +30 dB is a
        // playback ramp off the noise floor or real music getting louder, and 10 of 16 eligible track
        // starts in the ledger produced a report pinned to the boundary with no way to tell which.
        // The refit rides beside the figure it qualifies rather than only in the structured fields:
        // a window measured from a track's first samples can report a large rise that is entirely
        // the fade-in, and the refit past the head is the only measurement that separates those from
        // real openings. Rendered as a number, never as a verdict — see SWELL_REFIT_TRIM_SECS.
        Event::Swelling { rising, db, over, from, refit_db, trim_s } => (
            if *rising { "growing" } else { "fading" },
            format!("{} · {:+.1} dB over {:.0}s (from {:.1} dB, {:+.1} past the first {:.0}s)",
                    if *rising { "growing" } else { "fading" }, db, over, from, refit_db, trim_s),
        ),
        Event::StillUnresolved { secs } => ("held", format!("still unresolved · {:.1}s", secs)),
        Event::Resolved { after_secs } => ("resolved", format!("resolved after {:.1}s", after_secs)),
    };
    Some(Heard { at: now, kind: kind.into(), det: det_for(kind), text })
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
            let mut swell = Swell::default();
            let mut speech = SpeechSense::default();
            let mut vibrato = Vibrato::default();
            let mut pulse = Pulse::default();
            let mut sys = System::new();
            let mut last_ac_check = Instant::now();
            // Re-checked once a second rather than per frame, and rather than once at start: arming
            // a recording should not require restarting the capture.
            let mut recording = false;
            let mut last_rec_check = Instant::now() - std::time::Duration::from_secs(9);
            // Back-dated so the first frame reports the track rather than waiting two seconds.
            let mut last_np_check = Instant::now() - std::time::Duration::from_secs(9);
            let mut last_np = String::new();
            let mut now_playing: Option<crate::nowplaying::NowPlaying> = None;

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
                                on_event(Heard { at: stamp(),
                                                 kind: "stopped".into(), det: det_for("stopped"),
                                                 text: "anti-cheat detected — capture stopped".into() });
                                stop_a.store(true, Ordering::Relaxed);
                            }
                        }
                        continue;
                    }
                    Err(_) => break,
                };
                debug_assert_eq!(chunk.len(), WINDOW);

                // Loudness from the raw window, before any transform: RMS is energy, which is what
                // a crescendo actually is. Its own tracker with its own clock — a swell that changes
                // no harmony must still be reported, and that is most of this piece.
                let level_db = rms_db(&chunk);
                let spec = spectrum(&chunk);
                // Ten, not five. Before fusion, five peaks meant five things to pair up and that
                // was already too many. Now peaks are raw material for grouping and a single note
                // consumes three or four of them, so five could not represent two notes at once —
                // a dyad would arrive with one voice's partials truncated and read as silence.
                let pk = peaks(&spec, SAMPLE_RATE as f32, 10, 0.12);
                let m = moment(&pk, 30.0);
                let t = started.elapsed().as_secs_f32();

                // Computed HERE, before recording, so a fixture can carry it. Vibrato reads the
                // fine sub-window track and nothing else; while recordings stored only peaks,
                // every vibrato case was synthetic and A's guard (829ad53) could not be checked
                // against a single real voice event. ~4 values per frame against 10 peak pairs.
                let fine = pitch_track(&chunk, SAMPLE_RATE as f32);

                if last_rec_check.elapsed().as_secs() >= 1 {
                    last_rec_check = Instant::now();
                    recording = data_dir.join("RECORD").exists();
                }
                if recording {
                    record_frame(&data_dir, t, &pk, level_db,
                                 if last_np.is_empty() { None } else { Some(&last_np) },
                                 &fine);
                }

                // What is playing, polled rather than pushed, and emitted only when it CHANGES.
                // Every two seconds is far more often than tracks change and far cheaper than the
                // FFT already running beside it. Emitting on change rather than on a clock is the
                // same rule as everything else here: a held thing costs one line.
                // Once a second, not per frame: a WinRT round trip twelve times a second to move a
                // clock that ticks once is waste, and the position is extrapolated between polls
                // anyway. The TITLE is still emitted only on change — a held thing costs one line.
                if last_np_check.elapsed().as_millis() >= 1000 {
                    last_np_check = Instant::now();
                    now_playing = crate::nowplaying::read(&source_label);
                    if let Some(np) = &now_playing {
                        let line = np.line();
                        if !line.is_empty() && line != last_np {
                            last_np = line.clone();
                            // Everything before this instant is a different piece of music. Without
                            // this the dynamics window compares one recording's loudness to
                            // another's and calls the difference a crescendo — measured at +41 dB
                            // while the keeper skipped tracks.
                            swell.track_changed();
                            on_event(Heard {
                                at: stamp(),
                                kind: "track".into(),
                                det: det_for("track"),
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
                    at: stamp(),
                    now: now_playing.clone(),
                    chord: m.chord.as_ref().map(|c| c.name.clone()),
                    level_db,
                });
                for ev in tracker.feed(m, t, 4.0) {
                    // An onset means the music just started, so the dynamics window must not reach
                    // back across it into the fade-in or the silence before it.
                    if matches!(ev, Event::Onset { .. }) { swell.sound_began(); }
                    if let Some(h) = describe(&ev) { on_event(h); }
                }
                if let Some(ev) = swell.feed(level_db, t) {
                    if let Some(h) = describe(&ev) { on_event(h); }
                }
                if let Some(ev) = speech.feed(level_db, t) {
                    if let Some(h) = describe(&ev) { on_event(h); }
                }
                // Gated: see cochlea::PULSE_ENABLED. Fails its negative control on real orchestral
                // recordings, inventing confident tempos for music with no beat.
                if let Some(ev) = pulse.feed(level_db, t) {
                    if crate::cochlea::PULSE_ENABLED {
                        if let Some(h) = describe(&ev) { on_event(h); }
                    }
                }
                // The fine pitch track: four overlapping sub-windows per chunk, ~47 Hz, which is
                // the only rate at which vibrato is visible at all. Computed above so the recorder
                // sees it too; consumed here at the rate vibrato needs.
                let fine_rate = SAMPLE_RATE as f32 / 1024.0;
                if let Some(ev) = vibrato.feed(&fine, t, fine_rate) {
                    if let Some(h) = describe(&ev) { on_event(h); }
                }

                if last_ac_check.elapsed().as_secs() >= 5 {
                    last_ac_check = Instant::now();
                    sys.refresh_processes();
                    if !anticheat_present(&sys).is_empty() {
                        on_event(Heard { at: stamp(),
                                         kind: "stopped".into(), det: det_for("stopped"),
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
pub fn record_frame(data_dir: &PathBuf, at: f32, peaks: &[crate::cochlea::Peak], db: f32, track: Option<&str>,
                    fine: &[Option<f32>]) {
    // The track title, on EVERY frame while known. Replay treats a change in this field as the
    // track boundary (Frame::track), and until the recorder wrote it no fixture could validate the
    // boundary fix at all — a fixture spanning a title change would replay the pre-f8807f1 bug and
    // pass. Written per-frame rather than on change so a fixture truncated at any line still knows
    // what was playing; ~40 bytes/frame is nothing against the peaks.
    let track_json = track
        .filter(|s| !s.is_empty())
        .map(|s| format!(",\"track\":\"{}\"", s.replace('\\', "\\\\").replace('"', "\\\"")))
        .unwrap_or_default();
    // The fine pitch track, A's proposal from 829ad53: without it no fixture can exercise the
    // vibrato path and every guard on it stays synthetic-only. null = sub-window unvoiced —
    // absence of pitch is a measurement here, not a hole.
    let fine_json = if fine.is_empty() { String::new() } else {
        format!(",\"fine\":[{}]",
            fine.iter().map(|v| v.map(|h| format!("{h:.1}")).unwrap_or_else(|| "null".into()))
                .collect::<Vec<_>>().join(","))
    };
    let line = format!(
        "{{\"t\":{:.3},\"db\":{:.2}{}{}{}",
        at,
        db,
        track_json,
        fine_json,
        format!(",\"peaks\":[{}]}}",
            peaks.iter().map(|p| format!("[{:.2},{:.6}]", p.hz, p.mag)).collect::<Vec<_>>().join(",")),
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

    /// One reported interval, for the shapes below. The evidence fields are era 4's; a test that
    /// built them by hand in three places would drift from the detector the first time one moved.
    fn reading(num: u32, den: u32, name: &'static str, restless: bool) -> crate::cochlea::IntervalReading {
        crate::cochlea::IntervalReading { num, den, name, cents_off: 0.0, votes: 4, restless }
    }

    #[test]
    fn every_event_kind_produces_a_line() {
        // A silent event kind would be a hole in the ledger that looks like quiet.
        let evs = vec![
            Event::Onset { hz: 110.0, partials: 3, inferred: false },
            Event::Silence,
            Event::Intervals { intervals: vec![reading(3, 2, "fifth", false)], restless: false, chord: None },
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
        //
        // AND THIS TEST GOT LOAD-BEARING IN ERA 4. "— wants to move" left the rendered text, because
        // it asserted functional harmony the analyser cannot see, so the kind is now the ONLY place
        // the distinction lives. What was belt-and-braces is the belt.
        let calm = describe(&Event::Intervals {
            intervals: vec![reading(3, 2, "fifth", false)], restless: false, chord: None }).unwrap();
        let tense = describe(&Event::Intervals {
            intervals: vec![reading(45, 32, "tritone", true)], restless: true, chord: None }).unwrap();
        assert_eq!(calm.kind, "settled");
        assert_eq!(tense.kind, "restless");
        assert!(!tense.text.contains("wants to move"),
                "the text must not make a claim about where the music is going: {:?}", tense.text);
    }

    #[test]
    fn the_ledger_writes_and_survives_a_missing_directory() {
        let dir = std::env::temp_dir().join(format!("cochlea-test-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        append(&dir, &Heard { at: "00:00:00".into(), kind: "onset".into(), det: "tracker", text: "x".into() });
        assert!(ledger_path(&dir).exists(), "append must create the directory it needs");
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn stamps_carry_milliseconds() {
        // Whole-second stamps made two same-second events read as a contradiction and left
        // "resolved after 0.7s" unverifiable against the ledger's own timeline.
        let s = stamp();
        assert!(s.len() == 12 && s.as_bytes()[8] == b'.',
                "expected HH:MM:SS.mmm, got {s:?}");
    }

    #[test]
    fn every_kind_names_its_detector() {
        // The mapping is a negative control too: an unknown kind must say so loudly rather than
        // inherit a plausible detector.
        for (k, d) in [("restless", "tracker"), ("growing", "swell"), ("voice", "vibrato"),
                       ("track", "player"), ("stopped", "capture"), ("speech", "speech")] {
            assert_eq!(det_for(k), d);
        }
        assert_eq!(det_for("some-future-kind"), "unknown");
    }

    #[test]
    fn recorded_frames_carry_the_track_and_escape_its_quotes() {
        // Until the recorder wrote the title, no fixture could validate the track-boundary fix:
        // replay's Frame::track had nothing to read. The title is hostile input — real tags
        // carry quotes — so the escaping is the part that needs a test.
        let dir = std::env::temp_dir().join(format!("cochlea-frames-test-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).unwrap();
        record_frame(&dir, 1.0, &[], -30.0, Some(r#"Prince — "1999""#), &[]);
        record_frame(&dir, 2.0, &[], -30.0, None, &[]);
        let text = std::fs::read_to_string(dir.join("frames.jsonl")).unwrap();
        let mut lines = text.lines();
        let first: serde_json::Value = serde_json::from_str(lines.next().unwrap())
            .expect("a recorded frame with a quoted title must still be valid JSON");
        assert_eq!(first.get("track").and_then(|v| v.as_str()), Some(r#"Prince — "1999""#));
        let second: serde_json::Value = serde_json::from_str(lines.next().unwrap()).unwrap();
        assert!(second.get("track").is_none(), "no title known → no field, not an empty string");
        let _ = std::fs::remove_dir_all(&dir);
    }

    #[test]
    fn recorded_frames_carry_the_fine_track_and_unvoiced_stays_null() {
        // A's proposal from 829ad53: vibrato reads the fine track and nothing else, so until the
        // recorder writes it, every vibrato guard is checkable only against synthetic cases. The
        // null matters as much as the numbers — an unvoiced sub-window is a measurement, and
        // collapsing it to 0.0 or dropping it would shift every later reading's timeline.
        let dir = std::env::temp_dir().join(format!("cochlea-fine-test-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
        std::fs::create_dir_all(&dir).unwrap();
        record_frame(&dir, 1.0, &[], -30.0, None, &[Some(77.9), None, Some(78.1), Some(78.0)]);
        let text = std::fs::read_to_string(dir.join("frames.jsonl")).unwrap();
        let v: serde_json::Value = serde_json::from_str(text.lines().next().unwrap()).unwrap();
        let fine = v.get("fine").and_then(|f| f.as_array()).expect("fine field present");
        assert_eq!(fine.len(), 4);
        assert!((fine[0].as_f64().unwrap() - 77.9).abs() < 0.01);
        assert!(fine[1].is_null(), "unvoiced must stay null, not 0.0 and not dropped");
        let _ = std::fs::remove_dir_all(&dir);
    }
}
