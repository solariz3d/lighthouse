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
//! - **A committee pane is reopened ONCE too (D424), the same way.** On 2026-10-20 O's claude exited by itself with code 3
//!   at about 22:24, was never reopened (this line used to say a committee pane never is), and the chair's 22:37 GO was
//!   force-delivered into the dead pane after the bounded hold, 0 of 947 composer readings usable. Nobody heard for six
//!   hours (`exo_memory/loop/plan_d424_pane_reopen_2026-10-21.md`). It resumes in the folder the kept-pane record holds;
//!   with no folder on record it is shown and left to the ↻, as a human pane always is.
//! - **A human pane is never reopened automatically.** It is shown as exited, with the ↻ as the prompt.
//! - **Nothing is delivered into an exited child (D424).** A message for a pane whose exit record holds the pid the map
//!   holds is REFUSED, at the door or in the queue, and the refusal names the exit, on the board and to the sender. While
//!   the one reopen is running the message waits; once it is done the reopened child is a new pid, and the message waits
//!   for THAT child's own ready signal: a stamp written before the reopen is the dead child's and reads as no stamp.
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
    /// A human pane, or a committee pane with no folder on record: show it, offer ↻, reopen nothing.
    Prompt,
}

/// What kind of seat exited, as far as reopening goes.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Seat {
    /// Main, the librarian, the Third Place.
    Fixed,
    /// A committee pane with a folder on record to resume it in (D424).
    Committee,
    /// A human pane, or a committee pane with no folder to resume in.
    Human,
}

/// The whole decision. `auto_reopened` is the app run's record of which seats have had their one reopen; it is
/// consumed only by a fixed or committee seat's unexpected exit, never by an intentional one or by a human pane.
pub fn decide(still_ours: bool, seat: Seat, pane: &str, auto_reopened: &mut HashSet<String>) -> ExitAction {
    if !still_ours {
        return ExitAction::Intentional;
    }
    if seat == Seat::Human {
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

/// D424: what an exit means for a message bound for this pane.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ExitGate {
    /// No exit holds the pid the map holds: the ordinary gate decides.
    Open,
    /// The child exited and its one reopen is running: hold, and do not refuse.
    AwaitReopen,
    /// The child exited and nothing is reopening it: refuse, naming this exit.
    Refuse(PaneExit),
}

/// The gate's exit half. `reopening` holds the panes whose one reopen is under way.
pub fn exit_gate(exits: &HashMap<String, PaneExit>, reopening: &HashSet<String>, pane: &str, current_pid: Option<u32>) -> ExitGate {
    match (liveness(exits, pane, current_pid), exits.get(pane)) {
        (Liveness::Exited { .. }, _) if reopening.contains(pane) => ExitGate::AwaitReopen,
        (Liveness::Exited { .. }, Some(e)) => ExitGate::Refuse(*e),
        _ => ExitGate::Open,
    }
}

/// D424: is this ready stamp the dead child's? A stamp written before the reopen (or one with no time) describes the
/// child that exited, so for the reopened child it reads as no stamp at all, and the gate falls back to the screen.
pub fn stamp_predates_reopen(stamp_at_ms: Option<u64>, reopened_at_ms: Option<u64>) -> bool {
    match reopened_at_ms {
        None => false,
        Some(r) => stamp_at_ms.map_or(true, |s| s < r),
    }
}

/// Who sent a queued message, read from the provenance label the APP writes at its head (the sender cannot choose it):
/// `[chair:MAIN]` is the chair, `[librarian:LIB]` the librarian, `[pane:X]` the pane lettered X. Anything else (a
/// keep-warm, a pull, a dyad line, this module's own notice) has no sender to tell, and only the board hears.
pub fn sender_of(text: &str) -> Option<&str> {
    if text.starts_with("[chair:MAIN] ") {
        return Some("M");
    }
    if text.starts_with("[librarian:LIB] ") {
        return Some("LIB");
    }
    let rest = text.strip_prefix("[pane:")?;
    let (letter, _) = rest.split_once("] ")?;
    (!letter.is_empty() && letter.chars().all(|c| c.is_ascii_alphanumeric())).then_some(letter)
}

/// D424 cut (P's review item 1): who a refusal is TOLD to. Only the two fixed senders: `[chair:MAIN]` and
/// `[librarian:LIB]` resolve to fixed ids and cannot cross. A `[pane:X]` letter is the MOUNT letter, fixed at launch,
/// and the only way to a pane from it is the UI names map, which D423 found crossed with it (P's rings carry O, O's
/// carry N, and N is the Third Place's letter), so a note to it could land in the wrong pane. Until the mount letter maps
/// to a pane id, a lettered sender is not told: the REFUSED board row carries it, and a NOT TOLD row names the letter.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Recipient<'a> {
    /// A fixed sender, addressed by its seat name (`M` or `LIB`).
    Tell(&'a str),
    /// A lettered sender, named on the board only.
    NotTold(&'a str),
    /// No sender to tell (a keep-warm, a pull, a dyad line, a refusal note).
    Nobody,
}

pub fn refusal_recipient(text: &str) -> Recipient<'_> {
    match sender_of(text) {
        Some(s @ ("M" | "LIB")) => Recipient::Tell(s),
        Some(letter) => Recipient::NotTold(letter),
        None => Recipient::Nobody,
    }
}

/// D424 cut (P's review items 2 and 5): a NEW session was inserted for this pane, by the automatic reopen or by the ↻.
/// Its exit entry is dropped, so a new child that drew the dead child's pid (Windows reuses a pid once the waiter has
/// let the handle go) never reads exited; and the reopen time is recorded, so the dead child's last ready stamp is not
/// read as the new child's.
pub fn on_new_session(exits: &mut HashMap<String, PaneExit>, reopened_at: &mut HashMap<String, u64>, pane: &str, now_ms: u64) {
    exits.remove(pane);
    reopened_at.insert(pane.to_string(), now_ms);
}

fn utc_clock(at_ms: u64) -> String {
    let s = at_ms / 1000;
    format!("{:02}:{:02}:{:02}Z", (s / 3600) % 24, (s / 60) % 60, s % 60)
}

fn exit_words(e: &PaneExit) -> String {
    match e.code {
        Some(c) => format!("its claude process exited by itself (exit code {c}) at {}", utc_clock(e.at_ms)),
        None => format!("its claude process exited by itself at {}", utc_clock(e.at_ms)),
    }
}

/// The board row for a refused message. `queued_s` is how long it had waited, or None when it was refused at the door.
/// It begins `REFUSED NOT DELIVERED -> <id8>` so `chain-status.js` pairs it with its QUEUED row and stops counting it as
/// waiting, and it never begins `DELIVERED`.
pub fn refused_row(short: &str, e: &PaneExit, queued_s: Option<u64>, label: &str) -> String {
    let when = match queued_s {
        Some(s) => format!("queued {s}s ago"),
        None => "at the door".to_string(),
    };
    format!(
        "REFUSED NOT DELIVERED -> {short} ({when}; {} and is not being reopened, so nothing was written into it — ↻ on its pane reopens it): {label}",
        exit_words(e)
    )
}

/// The note to the sender of a message refused in the queue. It carries the app's own provenance, so it has no sender of
/// its own (`sender_of` is None for it) and a refused note can never be refused back.
pub fn refusal_notice(to_short: &str, e: &PaneExit, label: &str) -> String {
    format!(
        "[delivery, from the app — not the keeper] REFUSED: your message to {to_short} was not delivered. {}, and it is not being reopened, so nothing was written into it. ↻ on its pane reopens it. Why: consonance/GATES.md, \"The app's delivery refusal\". The message: {label}",
        exit_words(e)
    )
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
        ExitAction::ReopenOnce => format!("pane EXITED -> {who}: {how}; the app is reopening it once, resuming the same session"),
        ExitAction::ExitedAgain => format!(
            "pane EXITED AGAIN -> {who}: {how} after its one automatic reopen; not reopened automatically a second time (a crash that recurs is not bounded by retrying) — ↻ on its pane reopens it"
        ),
        ExitAction::Prompt if role == "committee" => {
            format!("pane EXITED -> {who}: {how}; ↻ on its pane reopens it (no folder on record to resume it in, so it is not reopened automatically)")
        }
        ExitAction::Prompt => format!("pane EXITED -> {who}: {how}; ↻ on its pane reopens it (a human pane is never reopened automatically)"),
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
        assert_eq!(decide(true, Seat::Fixed, MAIN, &mut once), ExitAction::ReopenOnce);
        assert_eq!(decide(true, Seat::Fixed, MAIN, &mut once), ExitAction::ExitedAgain, "the reopened child's exit reopened it again");
        assert_eq!(decide(true, Seat::Fixed, MAIN, &mut once), ExitAction::ExitedAgain);
    }

    /// Each fixed seat has its own once: the librarian's crash does not spend Main's reopen.
    #[test]
    fn the_once_is_per_seat() {
        let mut once = HashSet::new();
        assert_eq!(decide(true, Seat::Fixed, "lib", &mut once), ExitAction::ReopenOnce);
        assert_eq!(decide(true, Seat::Fixed, MAIN, &mut once), ExitAction::ReopenOnce);
    }

    /// A close, a replacement or the Leave is not a crash: nothing is said, nothing reopened, and the once is NOT spent.
    #[test]
    fn an_intentional_end_does_nothing_and_spends_nothing() {
        let mut once = HashSet::new();
        assert_eq!(decide(false, Seat::Fixed, MAIN, &mut once), ExitAction::Intentional);
        assert_eq!(decide(false, Seat::Human, "pane", &mut once), ExitAction::Intentional);
        assert!(once.is_empty(), "an intentional end spent the seat's one reopen");
        assert_eq!(decide(true, Seat::Fixed, MAIN, &mut once), ExitAction::ReopenOnce);
    }

    /// A human pane is never reopened by the app, however often it exits. (Until D424 this row was
    /// `a_committee_pane_is_prompted_never_reopened`; the rule changed for committee panes, by the plan of 2026-10-21, and
    /// the never-reopened half now belongs to human panes alone.)
    #[test]
    fn a_human_pane_is_prompted_never_reopened() {
        let mut once = HashSet::new();
        for _ in 0..3 {
            assert_eq!(decide(true, Seat::Human, "5bf9d657", &mut once), ExitAction::Prompt);
        }
        assert!(once.is_empty());
    }

    /// D424 ITEM 1, THE 22:24 CASE. A committee pane that exits by itself is reopened once, like a fixed seat, and the
    /// reopened child's exit is shown and left to the ↻ — however many more times it exits.
    #[test]
    fn a_committee_pane_is_reopened_once_and_never_in_a_loop() {
        let mut once = HashSet::new();
        assert_eq!(decide(true, Seat::Committee, "c88002b1", &mut once), ExitAction::ReopenOnce, "O's exit was not reopened");
        assert_eq!(decide(true, Seat::Committee, "c88002b1", &mut once), ExitAction::ExitedAgain, "a second exit reopened it again");
        assert_eq!(decide(true, Seat::Committee, "c88002b1", &mut once), ExitAction::ExitedAgain);
        assert_eq!(decide(true, Seat::Committee, "0845a868", &mut once), ExitAction::ReopenOnce, "one pane's reopen spent another's");
        assert_eq!(decide(true, Seat::Fixed, MAIN, &mut once), ExitAction::ReopenOnce, "a pane's reopen spent Main's");
    }

    /// D424 ITEM 2, THE 22:37 CASE, at the gate's exit half: a pane whose exit record holds the pid the map holds, with
    /// nothing reopening it, is REFUSED and the refusal carries that exit; nothing about it reads open.
    #[test]
    fn an_exited_pid_with_nothing_reopening_it_is_refused_naming_the_exit() {
        let o = PaneExit { pid: Some(31337), code: Some(3), at_ms: 1_760_998_000_000 };
        let exits = HashMap::from([("c88002b1".to_string(), o)]);
        let none = HashSet::new();
        assert_eq!(exit_gate(&exits, &none, "c88002b1", Some(31337)), ExitGate::Refuse(o));
        assert_eq!(exit_gate(&exits, &none, "c88002b1", Some(40000)), ExitGate::Open, "the reopened child (a new pid) is refused");
        assert_eq!(exit_gate(&exits, &none, "0845a868", Some(31337)), ExitGate::Open, "one pane's exit refused another's message");
        assert_eq!(exit_gate(&HashMap::new(), &none, "c88002b1", Some(31337)), ExitGate::Open);
    }

    /// While the one reopen is running the message WAITS: it is neither refused nor let through to the dead child.
    #[test]
    fn a_running_reopen_holds_the_message_rather_than_refusing_it() {
        let o = PaneExit { pid: Some(31337), code: Some(3), at_ms: 1 };
        let exits = HashMap::from([("c88002b1".to_string(), o)]);
        let reopening = HashSet::from(["c88002b1".to_string()]);
        assert_eq!(exit_gate(&exits, &reopening, "c88002b1", Some(31337)), ExitGate::AwaitReopen);
        assert_eq!(exit_gate(&exits, &reopening, "c88002b1", Some(40000)), ExitGate::Open, "the reopen is done: the new child decides");
    }

    /// Once the reopen is done, the message waits for the NEW child's own ready signal: the stamp the dead child wrote
    /// before the reopen (or a stamp with no time) is not one, and a stamp written after it is.
    #[test]
    fn a_stamp_from_before_the_reopen_is_the_dead_childs() {
        assert!(stamp_predates_reopen(Some(1_000), Some(2_000)), "the dead child's ready stamp let a message into the new one");
        assert!(stamp_predates_reopen(None, Some(2_000)), "a stamp with no time passed for the new child's");
        assert!(!stamp_predates_reopen(Some(3_000), Some(2_000)), "the new child's own stamp was ignored");
        assert!(!stamp_predates_reopen(Some(1_000), None), "a pane never reopened lost its stamp");
        assert!(!stamp_predates_reopen(None, None));
    }

    /// The sender is read from the app's own provenance label, never from the body.
    #[test]
    fn the_sender_is_the_provenance_label_and_nothing_else() {
        assert_eq!(sender_of("[chair:MAIN] D421c GO"), Some("M"));
        assert_eq!(sender_of("[librarian:LIB] collated"), Some("LIB"));
        assert_eq!(sender_of("[pane:O] hand-back at x.md"), Some("O"));
        assert_eq!(sender_of("[keep-warm, from the chair — not the keeper] Reply with exactly: ok"), None);
        assert_eq!(sender_of("a body that quotes [chair:MAIN] in the middle"), None);
        assert_eq!(sender_of("[pane:] x"), None);
        assert_eq!(sender_of("[pane:O; rm] x"), None);
        assert_eq!(sender_of(""), None);
    }

    /// D424 CUT, P's item 1: only the chair and the librarian are told; a lettered sender is named, never routed to,
    /// because its mount letter and the UI's letters are crossed today (P's rings carry [pane:O]; O's carry [pane:N]).
    #[test]
    fn only_the_two_fixed_senders_are_told_a_lettered_one_is_named() {
        assert_eq!(refusal_recipient("[chair:MAIN] D421c GO"), Recipient::Tell("M"));
        assert_eq!(refusal_recipient("[librarian:LIB] collated"), Recipient::Tell("LIB"));
        assert_eq!(refusal_recipient("[pane:O] pane P (Fable) review"), Recipient::NotTold("O"), "a lettered sender was routed to by its letter");
        assert_eq!(refusal_recipient("[pane:N] seat O's ring"), Recipient::NotTold("N"), "the Third Place's letter was routed to");
        assert_eq!(refusal_recipient("[keep-warm, from the chair — not the keeper] Reply with exactly: ok"), Recipient::Nobody);
    }

    /// D424 CUT, P's item 2: a ↻ child that drew the dead child's pid (reuse, once the waiter let the handle go) reads
    /// open once its new session is in, not exited for the rest of the run. Item 5: the ↻ records the reopen time, so the
    /// dead child's last stamp is not the new child's.
    #[test]
    fn a_new_session_drops_the_exit_and_records_the_reopen() {
        let mut exits = HashMap::from([("c88002b1".to_string(), PaneExit { pid: Some(31337), code: Some(3), at_ms: 1_000 })]);
        exits.insert("other".to_string(), PaneExit { pid: Some(5), code: None, at_ms: 1 });
        let mut at = HashMap::new();
        let none = HashSet::new();
        assert_eq!(exit_gate(&exits, &none, "c88002b1", Some(31337)), ExitGate::Refuse(exits["c88002b1"]), "premise");
        on_new_session(&mut exits, &mut at, "c88002b1", 9_000);
        assert_eq!(exit_gate(&exits, &none, "c88002b1", Some(31337)), ExitGate::Open, "the new child with a reused pid reads exited");
        assert_eq!(at.get("c88002b1"), Some(&9_000), "the reopen time was not recorded");
        assert!(stamp_predates_reopen(Some(5_000), at.get("c88002b1").copied()), "the dead child's stamp counts for the new one");
        assert!(exits.contains_key("other"), "another pane's exit was dropped");
    }

    /// The refusal row and the sender's note: both name the exit (code and time), neither reads DELIVERED, and the note
    /// has no sender of its own, so a refused note is never refused back to anyone.
    #[test]
    fn the_refusal_names_the_exit_and_never_reads_delivered() {
        let o = PaneExit { pid: Some(31337), code: Some(3), at_ms: (22 * 3600 + 24 * 60 + 13) * 1000 };
        for row in [refused_row("c88002b1", &o, Some(14), "D421c landing GO"), refused_row("c88002b1", &o, None, "D421c landing GO")] {
            assert!(row.starts_with("REFUSED NOT DELIVERED -> c88002b1 ("), "{row}");
            assert!(row.contains("exit code 3") && row.contains("22:24:13Z") && row.ends_with(": D421c landing GO"), "{row}");
            assert!(!row.starts_with("DELIVERED"), "{row}");
        }
        let note = refusal_notice("c88002b1", &o, "D421c landing GO");
        assert!(note.contains("REFUSED") && note.contains("exit code 3") && note.contains("22:24:13Z"), "{note}");
        assert_eq!(sender_of(&note), None, "the refusal note has a sender, so it could be refused back");
        // D454 part 2: every refusal a seat meets points to the page that explains it, and the message stays last
        assert!(note.contains("Why: consonance/GATES.md, \"The app's delivery refusal\".") && note.ends_with("The message: D421c landing GO"), "{note}");
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
