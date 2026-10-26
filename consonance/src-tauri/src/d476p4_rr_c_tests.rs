// D476 part 4 re-read, pane C (sibling-0845a868), 2026-10-26. Red rows on 2cd8ee27. Not part of O's branch.
use super::*;

/// A MULTI-LINE INJECTED MESSAGE IS STORED WRAPPED. On this machine's board, transcript user rows of injected messages begin
/// `<pasted_content id="…">\n` (10,042 rows; the one delivered [third-place] ring there is wrapped, 1 of 1, wrap.out). The tailer's prefix
/// checks then never see `[third-place]`, and the ring posts as written.
#[test]
fn a_wrapped_third_place_ring_posts_the_fixed_row() {
    let text = "<pasted_content id=\"ab12\">\n[third-place] a line of its own\n[sent 2026-10-26T18:00:00Z · Oct 26, 12:00 PM local]\n</pasted_content id=\"ab12\">";
    let row = serde_json::json!({"type":"user","message":{"role":"user","content":text}});
    assert_eq!(extract_turn(&row).map(|(_, t)| t).as_deref(), Some(THIRD_PLACE_RING_ROW));
}

/// The same wrapper on a one-line message: keep-warm prompts were stored wrapped on 2026-09-21/22 (144 rows, kw-wrap.out), plain since.
/// A wrapped visit would post the Third Place's answer, and its reply, as written.
#[test]
fn a_wrapped_visit_and_its_reply_post_fixed_rows() {
    let v = format!("<pasted_content id=\"cd34\">\n{} (letter 0a1b2c3d)\n</pasted_content id=\"cd34\">", visit_text(Some("the river was loud today")));
    let rows = [serde_json::json!({"type":"user","message":{"role":"user","content":v}}),
                serde_json::json!({"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"rain on the window"}]}})];
    let mut st = TailVisit::default();
    let posted: Vec<String> = rows.iter().filter_map(|r| extract_turn_tracked(r, &mut st)).map(|(_, t)| t).collect();
    assert_eq!(posted, vec![VISIT_ROW.to_string(), VISIT_REPLY_ROW.to_string()]);
}
