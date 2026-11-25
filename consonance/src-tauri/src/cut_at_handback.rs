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

// ---- THE PENDING CUT (pane A's second read, item 1, 2026-11-21: `handback/p-l216-read-A_2026-11-21.md`).
//
// A hand-back cut belongs to the turn that rang. Without a record that a cut is pending, the drain wrote the chair's next dispatch
// within 250 ms of the pane's Stop while the cut thread polled every 5 s, so the cut either fired at the end of the NEXT lap's turn
// or wrote /compact beside the dispatch. The rule now:
//   - from the ring until the cut is confirmed or dropped, the pane is PENDING: nothing is taken from its inbox, and a dispatch to it
//     is put there (held), then delivered when the cut resolves, whatever its outcome;
//   - a cut that has not sent its /compact when a later turn begins is DROPPED, with a row (and what it held goes on);
//   - a cut whose ringing turn has not ended within the wait is dropped too (the 30-minute abandon), releasing what it held.

/// One pane's pending cut. `gen` tells a newer hand-back's cut from an older one's thread.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Cut {
    pub gen: u64,
    pub ring_ms: u64,
    pub sent: bool,
}

/// Every pending cut, by pane id. main.rs keeps one behind a mutex.
#[derive(Debug, Default)]
pub struct Pending {
    cuts: std::collections::HashMap<String, Cut>,
    next_gen: u64,
}

impl Pending {
    /// A hand-back ring: the pane is pending from now. A cut not yet sent is replaced (the newer hand-back's turn owns the pane, and
    /// the older thread sees its `gen` is gone and stops without a word). None if a cut for the pane is already sending.
    pub fn begin(&mut self, pane: &str, ring_ms: u64) -> Option<u64> {
        if self.cuts.get(pane).is_some_and(|c| c.sent) {
            return None;
        }
        self.next_gen += 1;
        self.cuts.insert(pane.to_string(), Cut { gen: self.next_gen, ring_ms, sent: false });
        Some(self.next_gen)
    }
    /// Is a delivery to this pane held?
    pub fn holds(&self, pane: &str) -> bool {
        self.cuts.contains_key(pane)
    }
    pub fn is_current(&self, pane: &str, gen: u64) -> bool {
        self.cuts.get(pane).is_some_and(|c| c.gen == gen)
    }
    /// The /compact is about to be written: from here a later turn no longer drops the cut.
    pub fn mark_sent(&mut self, pane: &str, gen: u64) -> bool {
        match self.cuts.get_mut(pane) {
            Some(c) if c.gen == gen => {
                c.sent = true;
                true
            }
            _ => false,
        }
    }
    /// Confirmed or dropped: the pane is released, and what was held for it is delivered. Only the current cut's thread can release.
    pub fn resolve(&mut self, pane: &str, gen: u64) -> bool {
        if self.is_current(pane, gen) {
            self.cuts.remove(pane);
            true
        } else {
            false
        }
    }
}

/// One look at a pending cut that has not sent its /compact yet.
#[derive(Debug, PartialEq, Eq)]
pub enum Poll {
    Wait,
    Go,
    Drop(String),
}

pub fn poll(turn_ended: bool, later_turn: bool, waited: std::time::Duration, limit: std::time::Duration) -> Poll {
    if later_turn {
        return Poll::Drop("dropped: a later turn began before its /compact was sent".to_string());
    }
    if turn_ended {
        return Poll::Go;
    }
    if waited >= limit {
        return Poll::Drop(format!("dropped: the turn that rang had not ended within {} min", limit.as_secs() / 60));
    }
    Poll::Wait
}

/// Has a turn begun after the ring? A prompt row (a user row whose content is text, not a tool result) stamped after `ring_ms`. The
/// ringing turn's own rows after the ring are tool results and the model's replies, so they never count.
pub fn later_turn_began(jsonl: &str, ring_ms: u64) -> bool {
    jsonl.lines().filter_map(|l| serde_json::from_str::<serde_json::Value>(l).ok()).any(|v| {
        if v.get("type").and_then(|x| x.as_str()) != Some("user") || v.get("isSidechain").and_then(|x| x.as_bool()) == Some(true) {
            return false;
        }
        let after = v
            .get("timestamp")
            .and_then(|x| x.as_str())
            .and_then(|t| chrono::DateTime::parse_from_rfc3339(t).ok())
            .is_some_and(|t| t.timestamp_millis() as u64 > ring_ms);
        let prompt = match v.get("message").and_then(|m| m.get("content")) {
            Some(serde_json::Value::String(_)) => true,
            Some(serde_json::Value::Array(a)) => a.iter().any(|b| b.get("type").and_then(|x| x.as_str()) == Some("text")),
            _ => false,
        };
        after && prompt
    })
}

/// The window Claude Code itself cuts at (`autoCompactWindow` in each builder's settings.local.json, 600,000 since L235's note). A pane
/// over it is never helped by the same-lap exception: past the hard window the pane is cut whatever the lap.
pub const HARD_WINDOW: u64 = 600_000;

/// The lap id a dispatch or ring names: the first token `L` followed by 3 or 4 digits, among the first 160 characters (the chair writes
/// it first: "L229 addendum 3", "L232 amendment"). Letters or digits glued on either side are not a lap id ("ML229", "L2290x").
pub fn lap_id(text: &str) -> Option<String> {
    let head: Vec<char> = text.chars().take(160).collect();
    let mut i = 0;
    while i < head.len() {
        let boundary = i == 0 || !head[i - 1].is_alphanumeric();
        if head[i] == 'L' && boundary {
            let n = head[i + 1..].iter().take_while(|c| c.is_ascii_digit()).count();
            let after = head.get(i + 1 + n).copied();
            if (3..=4).contains(&n) && !after.is_some_and(|c| c.is_alphanumeric()) {
                return Some(head[i..i + 1 + n].iter().collect());
            }
        }
        i += 1;
    }
    None
}

/// The lap id of the last chair dispatch in a transcript (a prompt row whose text carries `[chair:MAIN]`), None when there is none.
pub fn last_dispatch_lap(jsonl: &str) -> Option<String> {
    jsonl
        .lines()
        .filter_map(|l| serde_json::from_str::<serde_json::Value>(l).ok())
        .filter(|v| v.get("type").and_then(|x| x.as_str()) == Some("user") && v.get("isSidechain").and_then(|x| x.as_bool()) != Some(true))
        .filter_map(|v| match v.get("message").and_then(|m| m.get("content"))? {
            serde_json::Value::String(t) => Some(t.clone()),
            serde_json::Value::Array(a) => a
                .iter()
                .filter(|b| b.get("type").and_then(|x| x.as_str()) == Some("text"))
                .filter_map(|b| b.get("text").and_then(|x| x.as_str()))
                .find(|t| t.contains("[chair:MAIN]"))
                .map(|t| t.to_string()),
            _ => None,
        })
        .filter(|t| t.contains("[chair:MAIN]"))
        .filter_map(|t| lap_id(t.split("[chair:MAIN]").nth(1).unwrap_or("")))
        .last()
}

/// Is the next job the same lap as the pane's last one? Both ids must be there and equal; an id missing on either side is NOT the same
/// lap (the pane is cut as today).
pub fn same_lap(last: Option<&str>, next: Option<&str>) -> bool {
    matches!((last, next), (Some(a), Some(b)) if a == b)
}

/// `before_dispatch` with the exception: a cold, large pane is NOT cut when the dispatch continues its own lap, unless its context is
/// over the hard window (the exception never helps a pane there).
pub fn before_dispatch_in_lap(listed: bool, last_call_age_min: Option<u64>, context: Option<u64>, dial: u64, same_lap: bool) -> bool {
    before_dispatch(listed, last_call_age_min, context, dial) && !(same_lap && context.is_some_and(|c| c <= HARD_WINDOW))
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
        // An absolute prefix before the repo-relative part, derived (not one machine's drive): the temp folder stands in for any checkout.
        assert!(is_handback(&format!("{}\\exo_memory/handback/p-x.md: read", std::env::temp_dir().display())));
        assert!(!is_handback("the handback/ folder is full"));
    }

    // L235: the same-lap exception (red first: these named functions that did not exist).
    #[test]
    fn the_same_lap_id_skips_the_cut_before_a_dispatch() {
        let (last, next) = (Some("L229"), lap_id("L229 addendum 3, yours"));
        assert!(same_lap(last, next.as_deref()));
        assert!(!before_dispatch_in_lap(true, Some(90), Some(450_000), DIAL, true));
    }
    #[test]
    fn a_new_lap_id_is_cut_as_today() {
        assert!(!same_lap(Some("L229"), lap_id("L232, yours, after his restart").as_deref()));
        assert!(before_dispatch_in_lap(true, Some(90), Some(450_000), DIAL, false));
        assert!(!same_lap(Some("L229"), None), "no id is not the same lap");
    }
    #[test]
    fn a_pane_over_the_hard_window_is_never_helped_by_the_exception() {
        assert!(before_dispatch_in_lap(true, Some(90), Some(HARD_WINDOW + 1), DIAL, true));
        assert!(!before_dispatch_in_lap(true, Some(90), Some(HARD_WINDOW), DIAL, true));
    }
    #[test]
    fn the_lap_id_is_read_from_the_head_of_the_text_and_only_as_a_whole_token() {
        assert_eq!(lap_id(" L235, yours: skip the cut").as_deref(), Some("L235"));
        assert_eq!(lap_id("ML229 x"), None);
        assert_eq!(lap_id("L22 x L2290x"), None);
        assert_eq!(lap_id(""), None);
    }
    #[test]
    fn the_last_chair_dispatch_names_the_pane_s_last_lap() {
        let j = concat!(
            r#"{"type":"user","message":{"content":"[chair:MAIN] L229, Addendum 2 (stamp)"}}"#, "\n",
            r#"{"type":"user","message":{"content":[{"type":"tool_result","content":"L999 noise"}]}}"#, "\n",
            r#"{"type":"user","message":{"content":[{"type":"text","text":"<pasted_content>[chair:MAIN] L232, yours</pasted_content>"}]}}"#, "\n",
            r#"{"type":"user","message":{"content":"[librarian:LIB] L240 not a chair dispatch"}}"#, "\n",
        );
        assert_eq!(last_dispatch_lap(j).as_deref(), Some("L232"));
        assert_eq!(last_dispatch_lap(""), None);
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

    // ---- A's read, item 1 (the race), registered red first: the three cases the chair named, then the drop rule.
    const P: &str = "pane-b";
    const MIN: std::time::Duration = std::time::Duration::from_secs(60);
    #[test]
    fn race_a_dispatch_that_arrives_before_the_cuts_send_is_held_until_the_cut_resolves() {
        let mut p = Pending::default();
        let g = p.begin(P, 1_000).expect("a hand-back ring begins a pending cut");
        assert!(p.holds(P), "the dispatch arriving now is held, not written");
        assert_eq!(poll(true, false, MIN, 30 * MIN), Poll::Go, "the ringing turn ended and nothing began after it: the cut goes");
        assert!(p.mark_sent(P, g));
        assert!(p.resolve(P, g));
        assert!(!p.holds(P), "confirmed: the held dispatch is delivered");
    }
    #[test]
    fn race_a_dispatch_that_arrives_during_the_compaction_is_held_too() {
        let mut p = Pending::default();
        let g = p.begin(P, 1_000).unwrap();
        assert!(p.mark_sent(P, g));
        assert!(p.holds(P), "sent and not yet confirmed: still held");
        assert_eq!(p.begin(P, 2_000), None, "a cut that is sending is not replaced");
        assert!(p.resolve(P, g) && !p.holds(P));
    }
    #[test]
    fn race_the_30_minute_abandon_releases_the_held_dispatch() {
        let mut p = Pending::default();
        let g = p.begin(P, 1_000).unwrap();
        assert!(p.holds(P), "held while the ringing turn runs");
        assert_eq!(poll(false, false, 29 * MIN, 30 * MIN), Poll::Wait);
        assert!(matches!(poll(false, false, 30 * MIN, 30 * MIN), Poll::Drop(_)));
        assert!(p.resolve(P, g) && !p.holds(P), "dropped: what it held goes on");
    }
    #[test]
    fn a_cut_not_yet_sent_when_a_later_turn_begins_is_dropped() {
        assert!(matches!(poll(true, true, MIN, 30 * MIN), Poll::Drop(_)), "the later turn wins even if it has ended");
        assert!(matches!(poll(false, true, MIN, 30 * MIN), Poll::Drop(_)));
    }
    #[test]
    fn a_newer_handback_takes_the_pane_over_and_the_older_thread_cannot_release_it() {
        let mut p = Pending::default();
        let old = p.begin(P, 1_000).unwrap();
        let new = p.begin(P, 5_000).unwrap();
        assert!(!p.is_current(P, old) && p.is_current(P, new));
        assert!(!p.mark_sent(P, old) && !p.resolve(P, old), "the old thread can neither send nor release");
        assert!(p.holds(P));
        assert!(p.resolve(P, new) && !p.holds(P));
    }
    #[test]
    fn a_later_turn_is_a_prompt_after_the_ring_not_the_ringing_turns_own_rows() {
        let ring = chrono::DateTime::parse_from_rfc3339("2026-11-21T11:00:00Z").unwrap().timestamp_millis() as u64;
        let before = r#"{"type":"user","timestamp":"2026-11-21T10:59:00Z","message":{"content":"[chair:MAIN] the lap"}}"#;
        let result = r#"{"type":"user","timestamp":"2026-11-21T11:00:01Z","message":{"content":[{"type":"tool_result","content":"delivered"}]}}"#;
        let reply = r#"{"type":"assistant","timestamp":"2026-11-21T11:00:05Z","message":{"content":[{"type":"text","text":"done"}]}}"#;
        let side = r#"{"type":"user","isSidechain":true,"timestamp":"2026-11-21T11:00:06Z","message":{"content":"a subagent's prompt"}}"#;
        assert!(!later_turn_began(&[before, result, reply, side].join("\n"), ring));
        let next = r#"{"type":"user","timestamp":"2026-11-21T11:00:09Z","message":{"content":"[chair:MAIN] the next lap"}}"#;
        assert!(later_turn_began(&[before, result, reply, next].join("\n"), ring));
        let blocks = r#"{"type":"user","timestamp":"2026-11-21T11:00:09Z","message":{"content":[{"type":"text","text":"typed"}]}}"#;
        assert!(later_turn_began(blocks, ring));
    }

    // ---- A's read, item 2: the three survivors, each now a row.
    #[test]
    fn e3_a_pane_exactly_50_minutes_cold_is_cold() {
        assert!(before_dispatch(true, Some(COLD_MIN), Some(750_000), DIAL));
    }
    #[test]
    fn e6_a_context_that_could_not_be_read_is_not_counted_large() {
        assert!(!before_dispatch(true, Some(240), None, DIAL));
    }
    #[test]
    fn g1_a_ring_is_a_handback_only_when_it_points_into_the_handback_folder() {
        assert!(!is_handback("exo_memory/loop/packet_l218_cut_at_handback_B_2026-11-21.md"));
        assert!(!is_handback("p-l218-B_2026-11-21.md"));
    }
}
