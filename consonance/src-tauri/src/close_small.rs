//! close_small.rs (B, L212, `exo_memory/loop/packet_l212_close_small_B_2026-11-21.md`): the pure half of "Compact warm seats" (named "Close for the night" until L218: his catch, it
//! closes nothing and work goes on after it).
//!
//! His words, 2026-11-21 00:23: "we could make our own wiring for auto compacts at close". At a session's end one control lists the
//! seats that are WARM and LARGE, and on his click asks each to write where it stands and then cuts it with `/compact`, so it wakes
//! next time at about 150k tokens instead of rewriting 500k to 950k cold. Which seats is decided in ONE place,
//! `consonance/tools/close-small.js` (last call under 50 minutes old AND context over 300k; a cold seat is never cut, because the
//! compaction would itself read the whole context uncached).
//!
//! THE STANDING RULE THIS SERVES: no seat's conversation is cut without his word for that seat. So the list he saw is the only list
//! that can be cut, once, while it is fresh: `confirm` takes the plan the screen showed (taken out of the app's state, so a second
//! call finds none), refuses a token that is not that plan's, refuses a plan over `PLAN_TTL` old, and cuts only the seats that were
//! on it AND are still warm and large now. A seat that went cold or small since he looked is dropped and named, never added.
//!
//! main.rs holds the impure half: `close_small_plan` (runs the tool, keeps the plan), `close_small_confirm` (the click),
//! `close_small_cut_seat` (the ask, the wait, `/compact`, the wait for the transcript's own `compact_boundary`).

use std::time::{Duration, Instant};

/// How long the list on screen stays the list a click may cut. Past it, he opens the list again.
pub const PLAN_TTL: Duration = Duration::from_secs(10 * 60);

/// The one line each seat is sent before its cut. The cut waits for the turn this starts to end.
pub const ASK: &str = "[compact warm seats] His click is cutting this seat's conversation (a /compact follows when \
this turn ends). In one short reply, write where you stand: a pane, the path of its hand-back or \"nothing in flight\"; the \
librarian, the chair or the Third Place, a state entry in its own note. Start nothing new.";

/// What the seat is sent to cut it. Confirmed only by the transcript (`compacted_since`): the composer cannot confirm a slash
/// command, which Claude Code draws in a colour `composer_state` reads as empty (main.rs,
/// `a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect`).
pub const COMPACT: &str = "/compact";

/// The list a click may cut: made by `close_small_plan`, shown on screen, kept until one click uses it.
#[derive(Clone, Debug)]
pub struct Plan {
    pub token: String,
    pub made: Instant,
    pub cut: Vec<String>,
}

/// The click's check. `stored` is the plan the screen showed, already TAKEN from the app's state (so it is used once). `fresh_cut`
/// is the tool's list read again at the click. Returns the seats to cut now, and those on the screen that no longer qualify.
pub fn confirm(stored: Option<Plan>, token: &str, now: Instant, fresh_cut: &[String]) -> Result<(Vec<String>, Vec<String>), String> {
    let p = stored.ok_or_else(|| "no list is open: press Compact warm seats to see the list first; nothing was cut".to_string())?;
    if token.is_empty() || p.token != token {
        return Err("this click is not for the list that was shown; open it again; nothing was cut".to_string());
    }
    if now.saturating_duration_since(p.made) > PLAN_TTL {
        return Err(format!("the list on screen is over {} minutes old; open it again; nothing was cut", PLAN_TTL.as_secs() / 60));
    }
    let cut = p.cut.iter().filter(|s| fresh_cut.contains(s)).cloned().collect();
    let dropped = p.cut.iter().filter(|s| !fresh_cut.contains(s)).cloned().collect();
    Ok((cut, dropped))
}

/// A's follow-up (a), ruled in (the librarian, 06:58Z): the seats are cut one after another, each wait up to 20 + 15 min, so a seat
/// warm at the click can be cold by its turn, and its ask would then rewrite its whole context uncached, the cost the close exists
/// to avoid. So the list is read again just before each seat's ask; the seat goes on only if it is still on it. A list that cannot
/// be read again stops that seat (fail closed).
pub fn recheck(pane: &str, fresh: &Result<Vec<String>, String>) -> Result<(), String> {
    match fresh {
        Err(e) => Err(format!("the list could not be read again before its ask ({e}), so it was left as it is")),
        Ok(cut) if cut.iter().any(|p| p == pane) => Ok(()),
        Ok(_) => Err("no longer warm and large when its turn came (it went cold or small while others were cut)".to_string()),
    }
}

/// A's follow-up (b), ruled in: only a MANUAL compaction after the send is the cut. An auto compaction in the wait (the harness's
/// own idle compaction) is not evidence that `/compact` ran, so it is NOT CONFIRMED, with its trigger named.
pub fn cut_outcome(found: Option<(String, Option<u64>)>, wait_min: u64) -> String {
    match found {
        Some((trigger, post)) if trigger == "manual" => {
            format!("cut: the transcript records the manual compaction{}", post.map(|n| format!(", {}k tokens left", n / 1000)).unwrap_or_default())
        }
        Some((trigger, _)) => format!(
            "NOT CONFIRMED: /compact was sent and the only compaction recorded after it was trigger \"{trigger}\", not the /compact"
        ),
        None => format!("NOT CONFIRMED: /compact was sent and no compaction was recorded within {wait_min} min"),
    }
}

/// The pane ids the tool's `--json` output marks `cut`.
pub fn cut_panes(list: &serde_json::Value) -> Vec<String> {
    list.get("seats")
        .and_then(|s| s.as_array())
        .map(|a| {
            a.iter()
                .filter(|s| s.get("action").and_then(|x| x.as_str()) == Some("cut"))
                .filter_map(|s| s.get("pane").and_then(|x| x.as_str()).map(str::to_string))
                .collect()
        })
        .unwrap_or_default()
}

/// A compaction the transcript itself records after `after_ms`: its trigger and the tokens it left (`postTokens`).
pub fn compacted_since(jsonl: &str, after_ms: u64) -> Option<(String, Option<u64>)> {
    jsonl
        .lines()
        .filter_map(|l| serde_json::from_str::<serde_json::Value>(l).ok())
        .filter(|v| v.get("subtype").and_then(|x| x.as_str()) == Some("compact_boundary"))
        .filter(|v| {
            v.get("timestamp")
                .and_then(|x| x.as_str())
                .and_then(|t| chrono::DateTime::parse_from_rfc3339(t).ok())
                .map(|t| t.timestamp_millis() as u64 >= after_ms)
                .unwrap_or(false)
        })
        .last()
        .map(|v| {
            let m = v.get("compactMetadata");
            (
                m.and_then(|m| m.get("trigger")).and_then(|x| x.as_str()).unwrap_or("?").to_string(),
                m.and_then(|m| m.get("postTokens")).and_then(|x| x.as_u64()),
            )
        })
}

/// The tokens the compaction after `after_ms` started from (`preTokens`), so a seat's line can say before and after.
pub fn compaction_pre_tokens(jsonl: &str, after_ms: u64) -> Option<u64> {
    jsonl
        .lines()
        .filter_map(|l| serde_json::from_str::<serde_json::Value>(l).ok())
        .filter(|v| v.get("subtype").and_then(|x| x.as_str()) == Some("compact_boundary"))
        .filter(|v| {
            v.get("timestamp")
                .and_then(|x| x.as_str())
                .and_then(|t| chrono::DateTime::parse_from_rfc3339(t).ok())
                .is_some_and(|t| t.timestamp_millis() as u64 >= after_ms)
        })
        .last()
        .and_then(|v| v.get("compactMetadata").and_then(|m| m.get("preTokens")).and_then(|x| x.as_u64()))
}

/// `cut_outcome`, with the tokens before the cut when the transcript gave them (L221: "done, with the tokens before and after").
pub fn cut_outcome_tokens(found: Option<(String, Option<u64>)>, pre: Option<u64>, wait_min: u64) -> String {
    match (&found, pre) {
        (Some((trigger, Some(post))), Some(pre)) if trigger == "manual" => {
            format!("cut: the transcript records the manual compaction, {}k before, {}k after", pre / 1000, post / 1000)
        }
        _ => cut_outcome(found, wait_min),
    }
}

// ---------------------------------------------------------------- L221: THE RUN'S PROGRESS, READ FROM ITS LEDGER
//
// His words, 2026-11-21 07:05: "it takes too long, and has no indication of the process or that its not done or done so it was
// confusing, maybe wire in an ability to see the progress of each pane being cut". The ledger (`close-small.jsonl`) is the one
// record: the click, each seat's stage, each seat's outcome, the run's end. The screen, the close question and the next launch all
// read the run from it here, so they cannot disagree with each other or with the record.

/// Where one seat stands in the run.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum SeatState {
    /// On the list, its ask not yet sent.
    Waiting,
    /// The ask is sent (written, or queued behind its turn or his typing).
    Asked,
    /// A turn began after the ask: it is writing where it stands; the cut waits for that turn to end.
    Answering,
    /// `/compact` is sent; the transcript's compaction is awaited.
    Compacting,
    /// The transcript records the manual compaction.
    Cut,
    /// Not cut, because it no longer qualified (cold or small).
    Skipped,
    /// Not cut for any other reason, or never reached.
    Failed,
}

impl SeatState {
    pub fn word(self) -> &'static str {
        match self {
            SeatState::Waiting => "waiting",
            SeatState::Asked => "asked",
            SeatState::Answering => "answering",
            SeatState::Compacting => "compacting",
            SeatState::Cut => "done",
            SeatState::Skipped => "skipped",
            SeatState::Failed => "failed",
        }
    }
    pub fn is_final(self) -> bool {
        matches!(self, SeatState::Cut | SeatState::Skipped | SeatState::Failed)
    }
}

/// One seat's line.
#[derive(Clone, Debug, PartialEq)]
pub struct SeatLine {
    pub pane: String,
    pub name: String,
    pub state: SeatState,
    /// The ledger time the state began (the screen counts the compaction's seconds from it).
    pub since: String,
    pub detail: String,
}

/// The run of the newest click.
#[derive(Clone, Debug, PartialEq)]
pub struct Progress {
    pub click: String,
    pub seats: Vec<SeatLine>,
    /// The run's own end row was written (`done`, `panic`), or a launch found it unfinished (`interrupted`).
    pub finished: bool,
    pub interrupted: bool,
}

/// The run of the NEWEST click in the ledger, as its rows say; None when no click was ever made.
pub fn progress(ledger: &str) -> Option<Progress> {
    let mut run: Option<Progress> = None;
    for v in ledger.lines().filter_map(|l| serde_json::from_str::<serde_json::Value>(l).ok()) {
        let t = v.get("t").and_then(|x| x.as_str()).unwrap_or("").to_string();
        let pane = v.get("pane").and_then(|x| x.as_str()).unwrap_or("");
        match v.get("event").and_then(|x| x.as_str()) {
            Some("click") => {
                let names = v.get("names");
                let line = |p: &str, state, detail: &str| SeatLine {
                    pane: p.to_string(),
                    name: names.and_then(|n| n.get(p)).and_then(|x| x.as_str()).map(str::to_string).unwrap_or_else(|| p.chars().take(8).collect()),
                    state,
                    since: t.clone(),
                    detail: detail.to_string(),
                };
                let list = |k: &str| -> Vec<String> {
                    v.get(k).and_then(|x| x.as_array()).map(|a| a.iter().filter_map(|x| x.as_str().map(str::to_string)).collect()).unwrap_or_default()
                };
                let mut seats: Vec<SeatLine> = list("cut").iter().map(|p| line(p, SeatState::Waiting, "")).collect();
                seats.extend(list("dropped").iter().map(|p| line(p, SeatState::Skipped, "no longer warm and large since the list was shown")));
                run = Some(Progress { click: t, seats, finished: false, interrupted: false });
            }
            Some("stage") => {
                let state = match v.get("stage").and_then(|x| x.as_str()) {
                    Some("asked") => SeatState::Asked,
                    Some("answering") => SeatState::Answering,
                    Some("compacting") => SeatState::Compacting,
                    _ => continue,
                };
                if let Some(s) = run.as_mut().and_then(|r| r.seats.iter_mut().find(|s| s.pane == pane && !s.state.is_final())) {
                    s.state = state;
                    s.since = t;
                    s.detail = v.get("detail").and_then(|x| x.as_str()).unwrap_or("").to_string();
                }
            }
            Some("seat") => {
                let outcome = v.get("outcome").and_then(|x| x.as_str()).unwrap_or("").to_string();
                if let Some(s) = run.as_mut().and_then(|r| r.seats.iter_mut().find(|s| s.pane == pane)) {
                    s.state = if outcome.starts_with("cut:") {
                        SeatState::Cut
                    } else if outcome.contains("no longer warm and large") {
                        SeatState::Skipped
                    } else {
                        SeatState::Failed
                    };
                    s.since = t;
                    s.detail = outcome;
                }
            }
            Some(end @ ("done" | "panic" | "interrupted")) => {
                if let Some(r) = run.as_mut() {
                    if !r.finished {
                        r.finished = true;
                        r.interrupted = end == "interrupted";
                        let why = if end == "panic" { "the run stopped on an internal error" } else { "never reached: the app closed before its cut" };
                        for s in r.seats.iter_mut().filter(|s| !s.state.is_final()) {
                            s.detail = format!("{why} (it was {})", s.state.word());
                            s.state = SeatState::Failed;
                            s.since = t.clone();
                        }
                    }
                }
            }
            _ => {}
        }
    }
    run
}

/// The seats not yet at an end; 0 for a run that ended.
pub fn to_go(p: &Progress) -> usize {
    if p.finished { 0 } else { p.seats.iter().filter(|s| !s.state.is_final()).count() }
}

/// The one line for the whole run.
pub fn summary(p: &Progress) -> String {
    let n = |st: SeatState| p.seats.iter().filter(|s| s.state == st).count();
    if p.finished {
        let never = p.seats.iter().filter(|s| s.detail.starts_with("never reached")).count();
        let mut line = format!("Done: {} cut, {} failed", n(SeatState::Cut), n(SeatState::Failed));
        if n(SeatState::Skipped) > 0 {
            line.push_str(&format!(", {} skipped", n(SeatState::Skipped)));
        }
        if never > 0 {
            line.push_str(&format!(" (the run was interrupted: {never} never reached)"));
        }
        line
    } else {
        let left = to_go(p);
        format!("{} of {} done, {} to go", p.seats.len() - left, p.seats.len(), left)
    }
}

/// At launch, a run with no end row was cut short by the app closing: the one board line that names the seats it listed and
/// never reached, with where each stood. None for a run that ended.
pub fn interrupted_line(p: &Progress) -> Option<String> {
    if p.finished {
        return None;
    }
    let never: Vec<String> = p.seats.iter().filter(|s| !s.state.is_final()).map(|s| format!("{} ({})", s.name, s.state.word())).collect();
    if never.is_empty() {
        return None;
    }
    Some(format!(
        "compact warm seats: the run of the click at {} was interrupted (the app closed before it ended); listed and never cut: {}",
        p.click,
        never.join(", ")
    ))
}

/// The window's X asks first when a seat is working (D317) OR a compaction run has seats to go (L221).
pub fn close_must_ask(any_working: bool, compacting_to_go: usize) -> bool {
    any_working || compacting_to_go > 0
}

/// What the screen is sent (the `close-small` event and `close_small_progress`).
pub fn to_json(p: &Progress) -> serde_json::Value {
    serde_json::json!({
        "click": p.click,
        "finished": p.finished,
        "interrupted": p.interrupted,
        "summary": summary(p),
        "toGo": to_go(p),
        "seats": p.seats.iter().map(|s| serde_json::json!({
            "pane": s.pane, "name": s.name, "state": s.state.word(), "since": s.since, "detail": s.detail,
        })).collect::<Vec<_>>(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    // ---- L221 rows (R1, R2): each state from its rows; an interrupted run names the seats never reached.
    fn ledger(rows: &[serde_json::Value]) -> String {
        rows.iter().map(|r| r.to_string()).collect::<Vec<_>>().join("\n")
    }
    fn click(t: &str, cut: &[&str], dropped: &[&str]) -> serde_json::Value {
        let names: serde_json::Map<String, serde_json::Value> =
            cut.iter().chain(dropped).map(|p| (p.to_string(), serde_json::Value::String(p.to_uppercase()))).collect();
        serde_json::json!({ "event": "click", "cut": cut, "dropped": dropped, "names": names, "t": t })
    }
    fn stage(t: &str, pane: &str, stage: &str) -> serde_json::Value {
        serde_json::json!({ "event": "stage", "pane": pane, "stage": stage, "t": t })
    }
    fn seat(t: &str, pane: &str, outcome: &str) -> serde_json::Value {
        serde_json::json!({ "event": "seat", "pane": pane, "outcome": outcome, "t": t })
    }
    fn state_of(p: &Progress, pane: &str) -> SeatState {
        p.seats.iter().find(|s| s.pane == pane).unwrap_or_else(|| panic!("no line for {pane}")).state
    }
    fn mid_run() -> String {
        ledger(&[
            click("2026-11-21T13:00:00.000Z", &["a", "b", "c", "d", "e"], &["f"]),
            stage("2026-11-21T13:00:01.000Z", "b", "asked"),
            stage("2026-11-21T13:00:01.000Z", "c", "asked"),
            stage("2026-11-21T13:00:20.000Z", "c", "answering"),
            stage("2026-11-21T13:00:01.000Z", "d", "asked"),
            stage("2026-11-21T13:00:30.000Z", "d", "answering"),
            stage("2026-11-21T13:00:50.000Z", "d", "compacting"),
            seat("2026-11-21T13:01:23.000Z", "e", "cut: the transcript records the manual compaction, 406k before, 18k after"),
        ])
    }

    #[test]
    fn r1_a_listed_seat_with_no_row_yet_is_waiting_its_turn() {
        assert_eq!(state_of(&progress(&mid_run()).expect("a run"), "a"), SeatState::Waiting);
    }
    #[test]
    fn r1_a_seat_whose_ask_was_sent_is_asked() {
        assert_eq!(state_of(&progress(&mid_run()).expect("a run"), "b"), SeatState::Asked);
    }
    #[test]
    fn r1_a_seat_whose_turn_began_after_the_ask_is_answering() {
        assert_eq!(state_of(&progress(&mid_run()).expect("a run"), "c"), SeatState::Answering);
    }
    #[test]
    fn r1_a_seat_sent_compact_is_compacting_since_the_send() {
        let p = progress(&mid_run()).expect("a run");
        let d = p.seats.iter().find(|s| s.pane == "d").expect("d");
        assert_eq!((d.state, d.since.as_str()), (SeatState::Compacting, "2026-11-21T13:00:50.000Z"));
    }
    #[test]
    fn r1_a_cut_seat_is_done_with_the_tokens_before_and_after() {
        let p = progress(&mid_run()).expect("a run");
        let e = p.seats.iter().find(|s| s.pane == "e").expect("e");
        assert_eq!(e.state, SeatState::Cut);
        assert!(e.detail.contains("406k") && e.detail.contains("18k"), "{}", e.detail);
    }
    #[test]
    fn r1_a_seat_dropped_at_the_click_is_skipped_with_its_reason() {
        let p = progress(&mid_run()).expect("a run");
        let f = p.seats.iter().find(|s| s.pane == "f").expect("f");
        assert_eq!(f.state, SeatState::Skipped);
        assert!(f.detail.contains("no longer warm and large"), "{}", f.detail);
    }
    #[test]
    fn r1_a_seat_not_cut_is_skipped_or_failed_by_its_reason() {
        let l = ledger(&[
            click("2026-11-21T13:00:00.000Z", &["a", "b"], &[]),
            seat("2026-11-21T13:00:02.000Z", "a", "NOT cut: no longer warm and large when its turn came (it went cold or small while others were cut)"),
            seat("2026-11-21T13:20:02.000Z", "b", "NOT cut: its turn after the ask did not end within 20 min"),
        ]);
        let p = progress(&l).expect("a run");
        assert_eq!((state_of(&p, "a"), state_of(&p, "b")), (SeatState::Skipped, SeatState::Failed));
        assert!(p.seats[1].detail.contains("did not end within 20 min"), "{}", p.seats[1].detail);
    }
    #[test]
    fn r1_the_names_the_click_recorded_label_the_lines() {
        assert_eq!(progress(&mid_run()).expect("a run").seats[0].name, "A");
    }
    #[test]
    fn r1_the_line_for_the_whole_run_counts_done_and_to_go() {
        let p = progress(&mid_run()).expect("a run");
        // e is cut and f skipped (2 at an end); a, b, c and d are still going.
        assert_eq!((summary(&p), to_go(&p)), ("2 of 6 done, 4 to go".to_string(), 4));
    }
    #[test]
    fn r1_a_run_with_its_end_row_is_done_and_says_so() {
        let l = ledger(&[
            click("2026-11-21T13:00:00.000Z", &["a", "b"], &[]),
            seat("2026-11-21T13:01:00.000Z", "a", "cut: the transcript records the manual compaction, 300k before, 20k after"),
            seat("2026-11-21T13:02:00.000Z", "b", "NOT CONFIRMED: /compact was sent and no compaction was recorded within 15 min"),
            serde_json::json!({ "event": "done", "t": "2026-11-21T13:02:00.100Z" }),
        ]);
        let p = progress(&l).expect("a run");
        assert!(p.finished && !p.interrupted && to_go(&p) == 0);
        assert_eq!(summary(&p), "Done: 1 cut, 1 failed");
    }
    #[test]
    fn r1_only_the_newest_click_is_the_run() {
        let l = ledger(&[click("2026-11-21T06:00:00.000Z", &["old"], &[]), click("2026-11-21T13:00:00.000Z", &["a"], &[])]);
        let p = progress(&l).expect("a run");
        assert_eq!(p.seats.iter().map(|s| s.pane.as_str()).collect::<Vec<_>>(), vec!["a"]);
    }
    #[test]
    fn r1_no_click_is_no_run_and_a_torn_row_is_passed_over() {
        assert_eq!(progress(""), None);
        let l = format!("{}\n{{torn\n", ledger(&[click("2026-11-21T13:00:00.000Z", &["a"], &[])]));
        assert_eq!(progress(&l).map(|p| p.seats.len()), Some(1));
    }
    // 13:00Z today, as it is in the ledger: five listed, pane A cut, then his restart. The next launch must name the four.
    #[test]
    fn r1_an_interrupted_run_names_the_seats_never_reached_once() {
        let l = ledger(&[
            click("2026-11-21T12:59:57.419Z", &["a", "b", "c", "d", "e"], &[]),
            stage("2026-11-21T12:59:58.000Z", "b", "asked"),
            seat("2026-11-21T13:01:23.503Z", "a", "cut: the transcript records the manual compaction, 18k tokens left"),
        ]);
        let p = progress(&l).expect("a run");
        assert!(!p.finished);
        let line = interrupted_line(&p).expect("an unfinished run is said");
        for n in ["B (asked", "C (waiting", "D (waiting", "E (waiting"] {
            assert!(line.contains(n), "{n} missing: {line}");
        }
        assert!(!line.contains("A ("), "A was cut: {line}");
        // the launch writes the `interrupted` row; after it the same run is not said again
        let after = format!("{l}\n{}", serde_json::json!({ "event": "interrupted", "t": "2026-11-21T13:02:11.000Z" }));
        let p2 = progress(&after).expect("a run");
        assert!(p2.finished && p2.interrupted && interrupted_line(&p2).is_none());
        assert!(summary(&p2).contains("4 never reached"), "{}", summary(&p2));
    }
    #[test]
    fn r1_a_finished_run_is_not_said_at_launch() {
        let l = ledger(&[click("2026-11-21T13:00:00.000Z", &["a"], &[]), seat("2026-11-21T13:01:00.000Z", "a", "cut: x"), serde_json::json!({ "event": "done" })]);
        assert!(interrupted_line(&progress(&l).expect("a run")).is_none());
    }
    // R2: the X asks while a run has seats to go, even with every seat ready.
    #[test]
    fn r2_the_close_asks_while_compacting_has_seats_to_go() {
        assert!(close_must_ask(false, 3), "a run with 3 to go must ask");
        assert!(!close_must_ask(false, 0), "nothing working and nothing to go closes as today");
        assert!(close_must_ask(true, 0), "D317 unchanged: a working seat asks");
    }
    #[test]
    fn r1_the_screen_is_sent_each_line_and_the_summary() {
        let j = to_json(&progress(&mid_run()).expect("a run"));
        assert_eq!(j["summary"], "2 of 6 done, 4 to go");
        assert_eq!(j["toGo"], 4);
        assert_eq!(j["seats"][3]["state"], "compacting");
        assert_eq!(j["seats"][3]["since"], "2026-11-21T13:00:50.000Z");
    }
    #[test]
    fn r1_the_cut_line_carries_the_tokens_before_and_after() {
        let o = cut_outcome_tokens(Some(("manual".to_string(), Some(18_000))), Some(406_000), 15);
        assert!(o.starts_with("cut: ") && o.contains("406k before") && o.contains("18k after"), "{o}");
        let jsonl = r#"{"type":"system","subtype":"compact_boundary","timestamp":"2026-11-21T06:12:00.000Z","compactMetadata":{"trigger":"manual","preTokens":406123,"postTokens":18000}}"#;
        assert_eq!(compaction_pre_tokens(jsonl, 0), Some(406_123));
    }
    // From the mutant pass (M14): a compaction before the send is not this cut's.
    #[test]
    fn r1_the_tokens_before_are_never_read_from_a_compaction_before_the_send() {
        let at = chrono::DateTime::parse_from_rfc3339("2026-11-21T06:13:00.000Z").unwrap().timestamp_millis() as u64;
        let jsonl = r#"{"type":"system","subtype":"compact_boundary","timestamp":"2026-11-21T06:12:00.000Z","compactMetadata":{"trigger":"manual","preTokens":406123,"postTokens":18000}}"#;
        assert_eq!(compaction_pre_tokens(jsonl, at), None);
    }
    // From the mutant pass (M1): a seat at its end stays there, whatever row comes after.
    #[test]
    fn r1_a_stage_row_after_a_seats_outcome_does_not_move_it() {
        let l = ledger(&[
            click("2026-11-21T13:00:00.000Z", &["a"], &[]),
            seat("2026-11-21T13:01:00.000Z", "a", "cut: x"),
            stage("2026-11-21T13:01:01.000Z", "a", "compacting"),
        ]);
        assert_eq!(state_of(&progress(&l).expect("a run"), "a"), SeatState::Cut);
    }

    fn plan(token: &str, made: Instant, cut: &[&str]) -> Option<Plan> {
        Some(Plan { token: token.into(), made, cut: cut.iter().map(|s| s.to_string()).collect() })
    }
    fn v(x: &[&str]) -> Vec<String> {
        x.iter().map(|s| s.to_string()).collect()
    }

    // R5 (the behaviour half): no path cuts a seat without the click on the list that was shown.
    #[test]
    fn with_no_list_shown_nothing_is_cut() {
        assert!(confirm(None, "t", Instant::now(), &v(&["a"])).is_err());
    }
    #[test]
    fn a_click_for_another_list_cuts_nothing() {
        let now = Instant::now();
        assert!(confirm(plan("t1", now, &["a"]), "t2", now, &v(&["a"])).is_err());
        assert!(confirm(plan("t1", now, &["a"]), "", now, &v(&["a"])).is_err());
    }
    #[test]
    fn a_list_older_than_ten_minutes_cuts_nothing() {
        let made = Instant::now();
        let later = made + PLAN_TTL + Duration::from_secs(1);
        assert!(confirm(plan("t", made, &["a"]), "t", later, &v(&["a"])).is_err());
        assert!(confirm(plan("t", made, &["a"]), "t", made + PLAN_TTL, &v(&["a"])).is_ok());
    }
    #[test]
    fn only_seats_on_the_shown_list_and_still_warm_and_large_are_cut() {
        let now = Instant::now();
        // shown: a, b. Now: b went cold (not in the fresh list) and c became large (in it, never shown).
        let (cut, dropped) = confirm(plan("t", now, &["a", "b"]), "t", now, &v(&["a", "c"])).unwrap();
        assert_eq!(cut, v(&["a"]));
        assert_eq!(dropped, v(&["b"]));
    }

    // (a): the list is read again before each seat's ask.
    #[test]
    fn a_seat_that_went_cold_while_others_were_cut_is_skipped_before_its_ask() {
        assert!(recheck("p-b", &Ok(v(&["p-a", "p-b"]))).is_ok(), "still warm and large: it goes on");
        let e = recheck("p-b", &Ok(v(&["p-a"]))).unwrap_err();
        assert!(e.contains("no longer warm and large"), "{e}");
    }
    #[test]
    fn a_list_that_cannot_be_read_again_stops_the_seat() {
        assert!(recheck("p-b", &Err("node could not start".to_string())).is_err());
    }

    // (b): only a manual compaction is the cut.
    #[test]
    fn only_a_manual_compaction_counts_as_the_cut() {
        assert!(cut_outcome(Some(("manual".to_string(), Some(140000))), 15).starts_with("cut: "));
        let auto = cut_outcome(Some(("auto".to_string(), Some(16000))), 15);
        assert!(auto.starts_with("NOT CONFIRMED"), "an auto compaction is not the /compact: {auto}");
        assert!(auto.contains("auto"), "the trigger is named: {auto}");
        assert!(cut_outcome(None, 15).starts_with("NOT CONFIRMED"));
    }

    #[test]
    fn the_tools_list_gives_the_seats_marked_cut() {
        let list: serde_json::Value = serde_json::json!({ "seats": [
            { "name": "B", "pane": "p-b", "action": "cut" },
            { "name": "A", "pane": "p-a", "action": "skip" },
            { "name": "main", "pane": "p-m", "action": "cut" } ] });
        assert_eq!(cut_panes(&list), v(&["p-b", "p-m"]));
        assert!(cut_panes(&serde_json::json!({})).is_empty());
    }

    #[test]
    fn a_compaction_counts_only_after_the_send_and_reports_what_it_left() {
        let at = |t: &str| chrono::DateTime::parse_from_rfc3339(t).unwrap().timestamp_millis() as u64;
        let jsonl = [
            r#"{"type":"system","subtype":"compact_boundary","timestamp":"2026-11-21T06:00:00.000Z","compactMetadata":{"trigger":"auto","postTokens":16211}}"#,
            r#"{"type":"user","timestamp":"2026-11-21T06:10:00.000Z"}"#,
            r#"{"type":"system","subtype":"compact_boundary","timestamp":"2026-11-21T06:12:00.000Z","compactMetadata":{"trigger":"manual","postTokens":140000}}"#,
        ]
        .join("\n");
        assert_eq!(compacted_since(&jsonl, at("2026-11-21T06:11:00.000Z")), Some(("manual".to_string(), Some(140000))));
        assert_eq!(compacted_since(&jsonl, at("2026-11-21T06:13:00.000Z")), None);
        assert_eq!(compacted_since("{torn", 0), None);
    }
}
