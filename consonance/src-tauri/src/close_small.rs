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

#[cfg(test)]
mod tests {
    use super::*;

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
