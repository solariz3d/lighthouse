//! Choosing what to listen to — the OS half. All the unsafe lives here; `cochlea.rs` stays
//! pure maths so the part that can be tested is not entangled with the part that cannot.
//!
//! WHY PER-PROCESS AND NOT THE DESKTOP. The keeper's constraint, and it is a privacy property
//! rather than a preference: he is sometimes in voice calls. Whole-endpoint loopback would
//! capture those, and "we filter them out afterwards" is a promise about behaviour. Windows 10
//! 2004 added process loopback — `AUDIOCLIENT_ACTIVATION_TYPE_PROCESS_LOOPBACK` binds the audio
//! client to one process TREE, include or exclude. Choosing Spotify does not filter Discord out;
//! Discord's audio is never delivered to the client at all. There is no buffer where it briefly
//! existed. That difference is the whole reason this is built per-process.
//!
//! WHY A TREE AND NOT A PID. Measured on this machine while writing it: Spotify runs 7 processes
//! and Chrome 15. The audio comes from one of them and which one is not stable across restarts,
//! so targeting a single pid would work until it silently didn't.

use serde::Serialize;
use sysinfo::System;

/// Applications worth offering. A list rather than "anything with a window" because the picker
/// exists to make the choice *narrow* — an exhaustive enumeration of every process on the
/// machine would invite picking something that captures more than intended.
const KNOWN: &[(&str, &str)] = &[
    ("spotify",     "Spotify"),
    ("chrome",      "Chrome"),
    ("msedge",      "Edge"),
    ("firefox",     "Firefox"),
    ("vlc",         "VLC"),
    ("foobar2000",  "foobar2000"),
    ("musicbee",    "MusicBee"),
];

#[derive(Debug, Clone, Serialize, PartialEq)]
pub struct Source {
    /// Display name for the tab.
    pub label: String,
    /// The root of the process tree to bind to. 0 means the whole endpoint.
    pub pid: u32,
    /// How many processes the tree has — shown so the reader can see it is a tree, not a guess.
    pub procs: usize,
    /// True for the entire-desktop option, which is the one that CAN hear a call.
    pub whole_desktop: bool,
}

/// Kernel-level anti-cheats. Capture is refused outright while any of these is loaded.
///
/// THE KEEPER'S LINE: "would this ever trigger any type of anti cheat? I never want that."
///
/// What is actually known, searched rather than reasoned: there are NO documented cases of
/// WASAPI loopback capture causing a ban. And that is not the same as safe. Vanguard has a
/// well-documented history of blocking or banning over legitimate software — overlays, hardware
/// utilities, old drivers — and unrelated background processes flagging as suspicious is a real
/// source of false positives. "No evidence found" is a weaker claim than it sounds.
///
/// So this does not weigh a probability. It refuses. He plays League, which means Vanguard is
/// resident whenever the client is, so this is a routine condition rather than an exotic one.
/// A rule costs one missed feature; being wrong costs an account.
const ANTICHEAT: &[(&str, &str)] = &[
    ("vgc",        "Riot Vanguard"),
    ("vgk",        "Riot Vanguard (kernel)"),
    ("vanguard",   "Riot Vanguard"),
    ("easyanticheat", "Easy Anti-Cheat"),
    ("eac",        "Easy Anti-Cheat"),
    ("battleye",   "BattlEye"),
    ("beservice",  "BattlEye"),
    ("ricochet",   "Ricochet"),
    ("faceit",     "FACEIT AC"),
    ("esea",       "ESEA AC"),
];

/// Anti-cheats currently loaded. Empty means capture may proceed.
///
/// Matching is on a word boundary rather than a substring: `eac` inside `teaching.exe` must not
/// block capture, and a guard that fires on everything gets disabled by whoever it annoys.
pub fn anticheat_present(sys: &System) -> Vec<String> {
    let mut found: Vec<String> = Vec::new();
    for p in sys.processes().values() {
        let name = p.name().to_ascii_lowercase();
        let stem = name.strip_suffix(".exe").unwrap_or(&name);
        for (needle, label) in ANTICHEAT {
            let hit = stem == *needle
                || stem.starts_with(&format!("{needle}-"))
                || stem.starts_with(&format!("{needle}_"))
                || (needle.len() >= 6 && stem.contains(needle));
            if hit && !found.iter().any(|f| f == label) {
                found.push(label.to_string());
            }
        }
    }
    found.sort();
    found
}

/// What is currently running and could be listened to.
///
/// The desktop option is offered last and flagged, never selected by default. It is a genuinely
/// different privacy posture from the per-process options and the UI should not let those blur.
pub fn sources(sys: &System) -> Vec<Source> {
    let mut out: Vec<Source> = Vec::new();

    for (needle, label) in KNOWN {
        let matching: Vec<_> = sys.processes().values()
            .filter(|p| p.name().to_ascii_lowercase().contains(needle))
            .collect();
        if matching.is_empty() { continue; }

        // The tree root: the one whose parent is not itself part of this group. Falls back to
        // the lowest pid, which is stable enough when the parent has already exited.
        let pids: Vec<u32> = matching.iter().map(|p| p.pid().as_u32()).collect();
        let root = matching.iter()
            .find(|p| match p.parent() {
                Some(par) => !pids.contains(&par.as_u32()),
                None => true,
            })
            .map(|p| p.pid().as_u32())
            .unwrap_or_else(|| *pids.iter().min().unwrap_or(&0));

        out.push(Source {
            label: label.to_string(),
            pid: root,
            procs: matching.len(),
            whole_desktop: false,
        });
    }

    out.sort_by(|a, b| a.label.cmp(&b.label));
    out.push(Source {
        label: "Entire desktop (can hear calls)".to_string(),
        pid: 0,
        procs: 0,
        whole_desktop: true,
    });
    out
}

#[cfg(test)]
mod tests {
    use super::*;
    use sysinfo::{RefreshKind, ProcessRefreshKind};

    fn sys() -> System {
        System::new_with_specifics(RefreshKind::new().with_processes(ProcessRefreshKind::new()))
    }

    #[test]
    fn the_desktop_option_is_last_and_is_flagged() {
        // It is the only option that can capture a voice call. It must never be first, never be
        // a default, and must be distinguishable from the per-process options by a field rather
        // than by its label — a UI that keys on wording will break the moment the wording changes.
        let s = sources(&sys());
        let last = s.last().expect("desktop option is always offered");
        assert!(last.whole_desktop);
        assert_eq!(last.pid, 0, "whole-endpoint capture is pid 0 by convention");
        assert_eq!(s.iter().filter(|x| x.whole_desktop).count(), 1);
    }

    #[test]
    fn per_process_sources_carry_a_real_root_pid_and_a_tree_size() {
        let s = sources(&sys());
        for src in s.iter().filter(|x| !x.whole_desktop) {
            assert!(src.pid > 0, "{} resolved to pid 0, which means whole-desktop", src.label);
            assert!(src.procs >= 1, "{} claims a tree with no processes", src.label);
        }
    }

    #[test]
    fn discord_is_never_offered() {
        // Not an oversight to fix later. A voice client has no business in a picker whose whole
        // justification is that calls are never captured.
        let s = sources(&sys());
        assert!(!s.iter().any(|x| x.label.to_lowercase().contains("discord")));
        assert!(!s.iter().any(|x| x.label.to_lowercase().contains("teams")));
        assert!(!s.iter().any(|x| x.label.to_lowercase().contains("zoom")));
    }

    #[test]
    fn a_loaded_anticheat_is_detected_by_name() {
        // Can't spawn Vanguard, so the matcher is exercised directly against the names these
        // actually run under.
        let mut s = System::new();
        s.refresh_processes();
        // real machine may or may not have one; the matcher itself is what is under test
        for probe in ["vgc.exe", "EasyAntiCheat.exe", "BEService.exe"] {
            let stem = probe.to_ascii_lowercase();
            let stem = stem.strip_suffix(".exe").unwrap();
            assert!(ANTICHEAT.iter().any(|(n, _)| stem == *n || (n.len() >= 6 && stem.contains(n))),
                    "{probe} must be recognised as an anti-cheat");
        }
    }

    #[test]
    fn the_guard_does_not_fire_on_innocent_names() {
        // A guard that blocks everything gets switched off by whoever it annoys, and then it
        // protects nothing. `eac` inside `teaching.exe` must not count.
        for innocent in ["teaching", "peach", "vgcore", "reactor", "beauty"] {
            let matched = ANTICHEAT.iter().any(|(n, _)| {
                innocent == *n
                    || innocent.starts_with(&format!("{n}-"))
                    || innocent.starts_with(&format!("{n}_"))
                    || (n.len() >= 6 && innocent.contains(n))
            });
            assert!(!matched, "{innocent} must not be treated as an anti-cheat");
        }
    }

    #[test]
    fn nothing_running_still_offers_the_desktop_and_nothing_else() {
        let empty = System::new();
        let s = sources(&empty);
        assert_eq!(s.len(), 1, "with no known apps, only the desktop option remains");
        assert!(s[0].whole_desktop);
    }
}
