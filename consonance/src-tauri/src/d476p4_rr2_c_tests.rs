// D476 part 4 re-read §9, pane C (sibling-0845a868), 2026-10-26. Red rows on 3b7265ee. Not part of O's branch.
use super::*;

/// MID-TURN STRING USER ROWS ARE NOT PROMPTS. Claude Code writes user rows with STRING content inside a turn: an image a tool read
/// (`isMeta: true`, "[Image: original …]") and a compaction summary (`isCompactSummary: true`). In this seat's transcript, after a tool_use
/// and without a toolUseResult: 15 compaction rows and dozens of image rows (meta.out). extract_turn_tracked resets `in_visit` on any user
/// text, so the rest of a visit's reply after one of them posts as written.
#[test]
fn a_visit_reply_after_a_mid_turn_image_or_compaction_row_still_posts_fixed() {
    let visit = serde_json::json!({"type":"user","message":{"role":"user","content":format!("{} (letter 0a1b2c3d)", visit_text(None))}});
    let reply = serde_json::json!({"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"rain on the window"}]}});
    for mid in [serde_json::json!({"type":"user","isMeta":true,"message":{"role":"user","content":"[Image: original 1920x464, displayed at 1920x464]"}}),
                serde_json::json!({"type":"user","isCompactSummary":true,"message":{"role":"user","content":"This session is being continued from a previous conversation"}})] {
        let mut st = TailVisit::default();
        let _ = extract_turn_tracked(&visit, &mut st);
        let _ = extract_turn_tracked(&mid, &mut st);
        assert_eq!(extract_turn_tracked(&reply, &mut st).map(|(_, t)| t).as_deref(), Some(VISIT_REPLY_ROW), "after {mid}");
    }
}
