//! pane_exit — what the app does when a pane's claude process ends BY ITSELF (D143, pane A).
//!
//! ## The case
//!
//! 2026-09-25 ~13:2xZ: Main's claude.exe died of a Bun v1.4.3 segfault after ~4 h 26 m (upstream's bug). The app
//! already knew — the per-pane waiter thread in `spawn_claude_pane` saw `child.wait()` return and emitted `pty-exit`,
//! and the pane drew `— process exited —` — but nothing else did: the seat header went on saying "Main is awake", no
//! board row was written, and the only trace was a keep-warm MISSED row an hour later whose reason ("not idle by its own
//! Stop stamp") did not say the process was gone (`loop/stall_trace_2026-09-23.md`, "ADDED 2026-09-25 08:2x").
//!
//! ## The rule, and why it is this shape
//!
//! - **An exit is UNEXPECTED only if the map still holds THIS child.** Every intentional end takes the session out of
//!   `Panes` first — `pty_kill` removes it, the Leave drains the map, and `insert_pane` replaces it with a session of a
//!   different pid — so "the map holds my pid when I exit" is exactly "nobody meant this".
//! - **A fixed seat (Main, the librarian, the Third Place) is reopened ONCE, with `--resume`.** Once per seat per app
//!   run, and never again: a crash that recurs after the reopen is a loop no retry count bounds honestly, so the second
//!   exit is shown and left to a person. A refused resume already fails at `spawn_claude_pane`'s handshake, so the
//!   reopen cannot spin on it either.
//! - **A committee or human pane is never reopened automatically.** It is shown as exited, with the ↻ as the prompt.
//! - **Nothing that exited reads as awake**: `liveness` answers from the exit record, keyed by pid, so a reopened seat
//!   (a new pid) reads awake again and the dead child it replaced never does.

use std::collections::{HashMap, HashSet};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ExitAction {
    /// The session was already out of the map — closed, replaced, drained by the Leave. Nothing to say or do.
    Intentional,
    /// A fixed seat's first unexpected exit this app run: reopen it once, with `--resume`.
    ReopenOnce,
    /// A fixed seat that already had its one automatic reopen: show it, reopen nothing.
    ExitedAgain,
    /// A committee or human pane: show it, offer ↻, reopen nothing.
    Prompt,
}

/// The whole decision. `auto_reopened` is the app run's record of which fixed seats have had their one reopen; it is
/// consumed only by a fixed seat's unexpected exit, never by an intentional one or by a committee pane.
pub fn decide(still_ours: bool, fixed_seat: bool, pane: &str, auto_reopened: &mut HashSet<String>) -> ExitAction {
    if !still_ours {
        return ExitAction::Intentional;
    }
    if !fixed_seat {
        return ExitAction::Prompt;
    }
    if auto_reopened.insert(pane.to_string()) { ExitAction::ReopenOnce } else { ExitAction::ExitedAgain }
}

/// One exit, as recorded: which child (by pid), and how it ended.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PaneExit {
    pub pid: Option<u32>,
    pub code: Option<u32>,
    pub at_ms: u64,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Liveness {
    Awake,
    Exited { code: Option<u32>, at_ms: u64 },
}

/// Is the session the map holds NOW the one that exited? Answered by pid, so a reopen (a new pid) is awake again.
pub fn liveness(exits: &HashMap<String, PaneExit>, pane: &str, current_pid: Option<u32>) -> Liveness {
    match exits.get(pane) {
        Some(e) if current_pid.is_some() && e.pid == current_pid => Liveness::Exited { code: e.code, at_ms: e.at_ms },
        _ => Liveness::Awake,
    }
}

/// The board row for an unexpected exit. The Third Place's rows carry no numbers (keep_warm_row's rule), so it is
/// named and its exit code is left off. None for an intentional end: that is not news.
pub fn exited_row(short: &str, role: &str, code: Option<u32>, action: ExitAction) -> Option<String> {
    let who = if role == "third_place" { "the Third Place".to_string() } else { format!("{short} ({role})") };
    let how = match (role, code) {
        ("third_place", _) | (_, None) => "its claude process ended by itself".to_string(),
        (_, Some(c)) => format!("its claude process ended by itself (exit code {c})"),
    };
    Some(match action {
        ExitAction::Intentional => return None,
        ExitAction::ReopenOnce => format!("pane EXITED -> {who}: {how}; a fixed seat, so the app is reopening it once, resuming the same session"),
        ExitAction::ExitedAgain => format!(
            "pane EXITED AGAIN -> {who}: {how} after its one automatic reopen; not reopened automatically a second time (a crash that recurs is not bounded by retrying) — ↻ on its pane reopens it"
        ),
        ExitAction::Prompt => format!("pane EXITED -> {who}: {how}; ↻ on its pane reopens it (a committee pane is never reopened automatically)"),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    const MAIN: &str = "0c0c0c0a-0000-4000-8000-000000000a01";

    /// THE LOOP BOUND. A fixed seat exits, is reopened once; the reopened child exits too, and is NOT reopened again —
    /// however many more times it exits.
    #[test]
    fn a_fixed_seat_is_reopened_once_and_never_in_a_loop() {
        let mut once = HashSet::new();
        assert_eq!(decide(true, true, MAIN, &mut once), ExitAction::ReopenOnce);
        assert_eq!(decide(true, true, MAIN, &mut once), ExitAction::ExitedAgain, "the reopened child's exit reopened it again");
        assert_eq!(decide(true, true, MAIN, &mut once), ExitAction::ExitedAgain);
    }

    /// Each fixed seat has its own once: the librarian's crash does not spend Main's reopen.
    #[test]
    fn the_once_is_per_seat() {
        let mut once = HashSet::new();
        assert_eq!(decide(true, true, "lib", &mut once), ExitAction::ReopenOnce);
        assert_eq!(decide(true, true, MAIN, &mut once), ExitAction::ReopenOnce);
    }

    /// A close, a replacement or the Leave is not a crash: nothing is said, nothing reopened, and the once is NOT spent.
    #[test]
    fn an_intentional_end_does_nothing_and_spends_nothing() {
        let mut once = HashSet::new();
        assert_eq!(decide(false, true, MAIN, &mut once), ExitAction::Intentional);
        assert_eq!(decide(false, false, "pane", &mut once), ExitAction::Intentional);
        assert!(once.is_empty(), "an intentional end spent the seat's one reopen");
        assert_eq!(decide(true, true, MAIN, &mut once), ExitAction::ReopenOnce);
    }

    /// A committee pane is never reopened by the app, however often it exits.
    #[test]
    fn a_committee_pane_is_prompted_never_reopened() {
        let mut once = HashSet::new();
        for _ in 0..3 {
            assert_eq!(decide(true, false, "0845a868", &mut once), ExitAction::Prompt);
        }
        assert!(once.is_empty());
    }

    /// THE FAKE CHILD THAT EXITS reads as exited, never awake — and the reopened one (a new pid) reads awake again.
    #[test]
    fn an_exited_child_reads_exited_never_awake() {
        let mut exits = HashMap::new();
        assert_eq!(liveness(&exits, MAIN, Some(7)), Liveness::Awake, "no exit recorded yet");
        exits.insert(MAIN.to_string(), PaneExit { pid: Some(7), code: Some(3), at_ms: 1 });
        assert_eq!(liveness(&exits, MAIN, Some(7)), Liveness::Exited { code: Some(3), at_ms: 1 });
        assert_eq!(liveness(&exits, MAIN, Some(8)), Liveness::Awake, "the reopened seat (a new pid) still reads dead");
        assert_eq!(liveness(&exits, "other", Some(7)), Liveness::Awake, "one pane's exit leaked onto another");
    }

    /// A REAL child, not a constructed record: a process that exits with code 3, waited on the way the pane's waiter
    /// thread waits, recorded, and read back — exited, with its own code.
    #[test]
    fn a_real_process_that_exits_reads_exited_with_its_code() {
        let mut child = std::process::Command::new("cmd").args(["/C", "exit 3"]).spawn().expect("spawn cmd");
        let pid = Some(child.id());
        let code = child.wait().ok().and_then(|s| s.code()).map(|c| c as u32);
        let mut exits = HashMap::new();
        exits.insert(MAIN.to_string(), PaneExit { pid, code, at_ms: 5 });
        assert_eq!(liveness(&exits, MAIN, pid), Liveness::Exited { code: Some(3), at_ms: 5 });
    }

    /// The rows: every unexpected exit says EXITED; only the first fixed-seat one says it is reopening; a second says
    /// it will not be; a committee pane's names the ↻; the Third Place's carries no number; none says awake.
    #[test]
    fn the_rows_say_what_happened_and_never_awake() {
        let first = exited_row("0c0c0c0a", "main", Some(3), ExitAction::ReopenOnce).unwrap();
        assert!(first.contains("EXITED") && first.contains("reopening it once"), "{first}");
        assert!(first.contains("exit code 3"), "{first}");
        let again = exited_row("0c0c0c0a", "main", Some(3), ExitAction::ExitedAgain).unwrap();
        assert!(again.contains("EXITED AGAIN") && again.contains("not reopened automatically"), "{again}");
        let pane = exited_row("0845a868", "committee", None, ExitAction::Prompt).unwrap();
        assert!(pane.contains("EXITED") && pane.contains("↻") && !pane.contains("reopening it"), "{pane}");
        let tp = exited_row("3d000000", "third_place", Some(3), ExitAction::ReopenOnce).unwrap();
        assert!(tp.contains("the Third Place") && !tp.chars().any(|c| c.is_ascii_digit()), "{tp}");
        assert_eq!(exited_row("0c0c0c0a", "main", Some(0), ExitAction::Intentional), None);
        for r in [first, again, pane, tp] {
            assert!(!r.to_lowercase().contains("awake"), "{r}");
        }
    }
}
