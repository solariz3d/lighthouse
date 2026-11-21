//! cut_at_handback.rs (B, L218, `exo_memory/loop/packet_l218_cut_at_handback_B_2026-11-21.md`): the pure half of cutting a builder
//! pane at the one moment a cut loses least, and of cutting a cold, large pane before its first dispatch.
//!
//! Why: pane B was dispatched at 776,800 tokens and worked to 918,178 with no cut (170 turns, 142,867,983 tokens read from cache in
//! about 47 minutes; the packet's "Why"). L212's control cuts warm, large seats only on his click, and nothing cut a pane between laps.
//! A pane's state at a hand-back is on disk by the room's own rule (the file is committed and rung), so that is where it is cut.
//! A seat used earlier and idle now is cold at every close, so the close never reaches it (his catch, 04:52); such a pane is cut
//! just before its next dispatch instead, paying the cold read once, as the wake would have.
//!
//! THE STANDING RULE THIS SERVES, unchanged: no seat's conversation is cut without his word for that seat. His word is the config key
//! `cut_at_handback` in ~/.consonance.json, a list of pane letters, EMPTY by default. Empty (or absent, or unreadable) means this
//! does nothing at all. The chair, the librarian and the Third Place cannot be listed: such an entry is refused by name.
//!
//! main.rs holds the impure half: `cut_at_handback_after_ring` (from `pane_call_librarian_exec`), `cut_before_dispatch` (from
//! `chair_inject_exec`), and the one `/compact` send both share with the close (`compact_and_confirm`).

/// The context, in tokens, over which a listed pane is cut. The same bar as the close's (close-small.js BIG).
pub const DIAL: u64 = 300_000;
/// A pane whose last call is at least this old has a cold cache (close-small.js WARM_MIN: a seat is warm under 50 minutes).
pub const COLD_MIN: u64 = 50;
/// The config key.
pub const KEY: &str = "cut_at_handback";

/// The housed seats, refused by name whatever the letter table says.
const HOUSED_NAMES: [&str; 7] = ["main", "chair", "librarian", "lib", "third place", "third-place", "thirdplace"];

/// What the key says: the letters listed, and the entries refused (each with why).
#[derive(Debug, Default, PartialEq, Eq)]
pub struct Listing {
    pub letters: Vec<String>,
    pub refused: Vec<(String, String)>,
}

/// Reads the key from the raw config. `housed_letters` are the letters the letter table gives the chair, the librarian and the Third
/// Place (main.rs reads them from letters.json by their fixed session ids). A missing key, a key that is not a list, or a config that
/// is not JSON all give an empty listing: the feature does nothing.
pub fn listing(raw_config: Option<&str>, housed_letters: &[String]) -> Listing {
    let mut out = Listing::default();
    let Some(v) = raw_config.and_then(|r| serde_json::from_str::<serde_json::Value>(r).ok()) else { return out };
    let Some(list) = v.get(KEY).and_then(|x| x.as_array()) else { return out };
    for e in list {
        let Some(s) = e.as_str().map(str::trim).filter(|s| !s.is_empty()) else {
            out.refused.push((e.to_string(), "not a pane letter".to_string()));
            continue;
        };
        let low = s.to_ascii_lowercase();
        if HOUSED_NAMES.contains(&low.as_str()) {
            out.refused.push((s.to_string(), "the chair, the librarian and the Third Place are never cut by this".to_string()));
        } else if housed_letters.iter().any(|h| h.eq_ignore_ascii_case(s)) {
            out.refused.push((s.to_string(), "that letter is a housed seat's (the chair, the librarian or the Third Place)".to_string()));
        } else if !out.letters.iter().any(|l| l.eq_ignore_ascii_case(s)) {
            out.letters.push(s.to_ascii_uppercase());
        }
    }
    out
}

impl Listing {
    pub fn has(&self, letter: &str) -> bool {
        self.letters.iter().any(|l| l.eq_ignore_ascii_case(letter))
    }
}

/// A ring is a hand-back when it points at a file in the hand-back folder (the room's rule: a hand-back is a file there, rung as a
/// pointer). A progress ring, a question or a refusal is not.
pub fn is_handback(text: &str) -> bool {
    text.split(|c: char| c.is_whitespace() || c == '`' || c == '(' || c == ')' || c == ',' || c == ';')
        .any(|w| w.contains("handback/") && w.trim_end_matches(|c: char| c == '.' || c == ':').ends_with(".md"))
}

/// The decision at a ring, before the wait for the turn to end. `None` means nothing happens and no row is written (the pane is not
/// listed: the empty key is nothing at all). `Some(Err)` is a row saying why a listed pane was left alone.
pub fn at_ring(listed: bool, text: &str) -> Option<Result<(), String>> {
    if !listed {
        return None;
    }
    if !is_handback(text) {
        return Some(Err("left alone: the ring was not a hand-back (no handback/….md pointer)".to_string()));
    }
    Some(Ok(()))
}

/// The decision once the ringing turn has ended (or the wait for it gave up). `context` is the last request's, from the transcript.
pub fn after_turn(turn_ended: bool, open_tasks: &[String], context: Option<u64>, dial: u64) -> Result<u64, String> {
    if !turn_ended {
        return Err("left alone: its turn had not ended".to_string());
    }
    if !open_tasks.is_empty() {
        return Err(format!("left alone: {} background task(s) still running ({})", open_tasks.len(), open_tasks.join(", ")));
    }
    match context {
        Some(c) if c > dial => Ok(c),
        Some(c) => Err(format!("left alone: {}k is not over the dial ({}k)", c / 1000, dial / 1000)),
        None => Err("left alone: its context could not be read from the transcript".to_string()),
    }
}

/// Before a dispatch: cut first only a listed pane whose cache is cold and whose context is over the dial.
pub fn before_dispatch(listed: bool, last_call_age_min: Option<u64>, context: Option<u64>, dial: u64) -> bool {
    listed && last_call_age_min.is_some_and(|a| a >= COLD_MIN) && context.is_some_and(|c| c > dial)
}

/// The background tasks a transcript started and has not yet seen end: each `Command running in background with ID: <id>` tool
/// result (and its `backgroundTaskId`) without a later `<task-notification>` for that id. Read from the transcript, the one record
/// the app has of the seat's own work; a task started by other means than these is not seen (named in the hand-back).
pub fn open_background_tasks(jsonl: &str) -> Vec<String> {
    let mut open: Vec<String> = Vec::new();
    for line in jsonl.lines() {
        let Ok(v) = serde_json::from_str::<serde_json::Value>(line) else { continue };
        if v.get("isSidechain").and_then(|x| x.as_bool()) == Some(true) {
            continue;
        }
        if let Some(id) = v.get("toolUseResult").and_then(|r| r.get("backgroundTaskId")).and_then(|x| x.as_str()) {
            if !open.iter().any(|o| o == id) {
                open.push(id.to_string());
            }
        }
        let text = v.get("message").and_then(|m| m.get("content")).map(|c| c.to_string()).unwrap_or_default();
        for part in text.split("running in background with ID: ").skip(1) {
            let id: String = part.chars().take_while(|c| c.is_ascii_alphanumeric()).collect();
            if !id.is_empty() && !open.iter().any(|o| *o == id) {
                open.push(id);
            }
        }
        // a notification ends its task (completed, failed, killed: any status). Only a user row or a queued one carries it.
        let ty = v.get("type").and_then(|x| x.as_str()).unwrap_or("");
        if ty == "user" || ty == "queue-operation" {
            let body = if ty == "user" { text.clone() } else { v.get("content").map(|c| c.to_string()).unwrap_or_default() };
            for part in body.split("<task-id>").skip(1) {
                if let Some(id) = part.split("</task-id>").next() {
                    open.retain(|o| o != id);
                }
            }
        }
    }
    open
}

/// The board line for one cut: seat, context before, confirmed or not.
pub fn board_line(how: &str, letter: &str, context: u64, outcome: &str) -> String {
    format!("{how} -> {letter}: context {}k before; {outcome}", context / 1000)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn cfg(list: &str) -> String {
        format!(r#"{{"data_dir":"x","{KEY}":{list}}}"#)
    }
    const HANDBACK: &str = "exo_memory/handback/p-l218-cut-B_2026-11-21.md (main 1234abcd)\nNEXT: librarian reads it";

    // R2, the rule.
    #[test]
    fn a_listed_pane_over_the_dial_at_a_handback_is_cut() {
        let l = listing(Some(&cfg(r#"["B"]"#)), &[]);
        assert_eq!(at_ring(l.has("B"), HANDBACK), Some(Ok(())));
        assert_eq!(after_turn(true, &[], Some(918_178), DIAL), Ok(918_178));
    }
    #[test]
    fn an_unlisted_pane_is_not_and_writes_no_row() {
        let l = listing(Some(&cfg(r#"["A"]"#)), &[]);
        assert_eq!(at_ring(l.has("B"), HANDBACK), None);
    }
    #[test]
    fn a_listed_pane_under_the_dial_is_not() {
        assert!(after_turn(true, &[], Some(DIAL), DIAL).is_err());
        assert!(after_turn(true, &[], Some(119_000), DIAL).is_err());
        assert!(after_turn(true, &[], None, DIAL).is_err(), "an unread context is not over the dial");
    }
    #[test]
    fn the_chair_the_librarian_and_the_third_place_cannot_be_listed() {
        let housed = vec!["M".to_string(), "L".to_string(), "T".to_string()];
        let l = listing(Some(&cfg(r#"["main","Librarian","third place","chair","lib","M","t","B"]"#)), &housed);
        assert_eq!(l.letters, vec!["B".to_string()]);
        assert_eq!(l.refused.len(), 7, "{:?}", l.refused);
    }
    #[test]
    fn no_cut_mid_turn_or_with_a_background_task_running() {
        assert!(after_turn(false, &[], Some(900_000), DIAL).is_err());
        assert!(after_turn(true, &["bx1".to_string()], Some(900_000), DIAL).is_err());
    }
    #[test]
    fn a_ring_that_is_not_a_handback_is_left_alone_with_a_row() {
        let r = at_ring(true, "a question: where is the packet for L218?\nNEXT: librarian answers");
        assert!(matches!(r, Some(Err(_))));
        assert!(is_handback("`exo_memory/handback/p-x_2026-11-21.md`."));
        assert!(is_handback("C:\\x\\exo_memory/handback/p-x.md: read"));
        assert!(!is_handback("the handback/ folder is full"));
    }

    // R3: with the key empty (or absent, or the config unreadable), a hand-back ring changes nothing.
    #[test]
    fn with_the_key_empty_a_handback_ring_changes_nothing() {
        for raw in [Some(cfg("[]")), Some(r#"{"data_dir":"x"}"#.to_string()), Some("not json".to_string()), None, Some(cfg(r#""B""#))] {
            let l = listing(raw.as_deref(), &[]);
            assert!(l.letters.is_empty(), "{raw:?}");
            assert_eq!(at_ring(l.has("B"), HANDBACK), None, "{raw:?}");
            assert!(!before_dispatch(l.has("B"), Some(240), Some(750_000), DIAL), "{raw:?}");
        }
    }

    // Addendum, R2: the cut before a dispatch.
    #[test]
    fn a_listed_cold_pane_over_the_dial_is_cut_before_its_dispatch() {
        assert!(before_dispatch(true, Some(240), Some(750_000), DIAL));
    }
    #[test]
    fn an_unlisted_warm_or_small_pane_receives_its_dispatch_at_once() {
        assert!(!before_dispatch(false, Some(240), Some(750_000), DIAL), "unlisted");
        assert!(!before_dispatch(true, Some(COLD_MIN - 1), Some(750_000), DIAL), "warm: a cut at the hand-back is the warm case");
        assert!(!before_dispatch(true, Some(240), Some(200_000), DIAL), "small");
        assert!(!before_dispatch(true, None, Some(750_000), DIAL), "no call read");
    }

    #[test]
    fn a_background_task_is_open_until_its_notification() {
        let start = r#"{"type":"user","message":{"content":[{"type":"tool_result","content":"Command running in background with ID: bruglnqfg. Output is being written to: x"}]},"toolUseResult":{"backgroundTaskId":"bruglnqfg"}}"#;
        let done = r#"{"type":"user","message":{"role":"user","content":"<task-notification>\n<task-id>bruglnqfg</task-id>\n<status>completed</status>\n</task-notification>"}}"#;
        let other = r#"{"type":"user","message":{"content":[{"type":"tool_result","content":"Command running in background with ID: b2. x"}]}}"#;
        assert_eq!(open_background_tasks(start), vec!["bruglnqfg".to_string()]);
        assert!(open_background_tasks(&format!("{start}\n{done}")).is_empty());
        assert_eq!(open_background_tasks(&format!("{start}\n{other}\n{done}")), vec!["b2".to_string()]);
        let side = r#"{"type":"user","isSidechain":true,"message":{"content":"Command running in background with ID: s1. x"}}"#;
        assert!(open_background_tasks(side).is_empty(), "a subagent's own task is the subagent's");
    }
}
