// D476 part 4 review, pane C (sibling-0845a868), 2026-10-26. Red rows on 13c69597. Not part of O's branch.
use super::*;

/// THE TAILER IS A PATH TO THE BOARD. A working seat's visit arrives as a prompt in its own transcript, and the tailer posts every
/// non-Third-Place transcript turn to the board verbatim (`if pane_id != THIRD_PLACE_SID { board_push(...) }`). So the Third Place's
/// answer, quoted inside the visit, would be a board row from that seat, readable by every pane in OPEN phase.
#[test]
fn a_seats_visit_prompt_does_not_carry_the_third_places_words_onto_the_board() {
    let visit = visit_text(Some("the river was loud today"));
    let row = serde_json::json!({"type":"user","timestamp":"2026-10-26T11:00:00.000Z","message":{"role":"user","content":visit}});
    let posted = extract_turn(&row).map(|(_, t)| t).unwrap_or_default();
    assert!(!posted.contains("the river was loud today"),
        "the tailer would post the Third Place's answer to the board as this seat's user row: {posted}");
}

/// THE REPLY WINDOW'S ANCHOR. keep_warm_send takes `sent_ms` AFTER inject_to_pane returns, and inject_to_pane returns only after its
/// submit check (>= 200 ms after the Enter). Claude Code stamps the prompt row when it takes the prompt, so the row can be older than
/// `sent_ms`: measured on this machine's board, 818 of 3,096 keep-warm prompt rows are stamped before the send row that follows inject
/// (margin.out). turn_reply_after then skips the visit and reads the NEXT prompt's turn: a work turn.
#[test]
fn the_visit_reply_is_read_even_when_the_prompt_row_is_stamped_during_the_submit_check() {
    let row = |t: &str, ts: &str, text: &str| if t == "user" {
        serde_json::json!({"type":"user","timestamp":ts,"message":{"role":"user","content":text}}).to_string()
    } else {
        serde_json::json!({"type":"assistant","timestamp":ts,"message":{"role":"assistant","content":[{"type":"text","text":text}]}}).to_string()
    };
    let j = [row("user", "2026-10-26T11:00:00.000Z", "[keep-warm visit — from the room, not the keeper, and not work] …"),
             row("assistant", "2026-10-26T11:00:04.000Z", "ok"),
             row("user", "2026-10-26T11:20:00.000Z", "[chair:MAIN] a work packet"),
             row("assistant", "2026-10-26T11:40:00.000Z", "done, the review is filed and the swap can wait")].join("\n");
    // the send's clock read after the submit check: 187 ms after the row's stamp (the measured 5th percentile is -187 ms)
    let sent_ms = iso_utc_ms("2026-10-26T11:00:00.187Z").unwrap();
    assert_eq!(turn_reply_after(&j, sent_ms).as_deref(), Some("ok"),
        "the harvest read the work turn's ending as the seat's visit line");
}

/// The guard's own "lap or decision id" rule, in the forms this room writes ids: a possessive, lower case, and a staging label.
/// (Not one of the packet's four claims as such; the guard names the rule, and these are the room's ordinary spellings.)
#[test]
fn a_lap_id_in_the_rooms_own_spellings_is_refused() {
    for line in ["D476's visit is staged", "the d476 visit is staged", "staged as d476p4-13c69597"] {
        assert!(visit_line_refusal(line).is_some(), "passed the guard: {line}");
    }
}

/// Not red: the work turn's ending the anchor row above reads passes every rule, so it would be HELD for the Third Place.
#[test]
fn the_work_line_the_misanchored_harvest_reads_passes_the_guard() {
    assert_eq!(visit_line_refusal("done, the review is filed and the swap can wait"), None);
}
