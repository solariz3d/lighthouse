#[path = "C:/Consonance/lh-wt-c-l235/consonance/src-tauri/src/cut_at_handback.rs"]
#[allow(dead_code)]
mod cut_at_handback;

// ---- pane C, L235 read: VARIED rows (not committed to the branch). Real dispatch heads, from the panes' transcripts, through the branch's functions.
#[cfg(test)]
mod c_l235 {
    use super::cut_at_handback::*;
    const DIAL: u64 = 300_000;
    // A new lap opened by a dispatch that names the lap it closes first: the rule must NOT call it the same lap (the packet's "a new lap id cuts as today").
    #[test]
    fn c1_a_new_lap_opened_after_the_closed_one_is_cut_as_today() {
        let cases = [
            ("L215", "A: L215 IS COLLATED; B reads and lands it. YOUR NEXT LAP IS L217, AND ITS PACKET IS A FILE; READ IT WHOLE BEFORE YOU ACT."),
            ("L215", "A: YOUR L215 FIX IS COLLATED (B reads and lands l215-gatesopen-only at its next dispatch). YOUR NEXT LAP IS L219, THE GAME"),
            ("L214", "B: L214 IS FILED (landed and installed). FOUR STEPS NOW, IN ORDER; THE LAST IS A NEW LAP, L216. 1. L215, SECOND READ"),
            ("L175", "E: L175 is collated and filed (d0c1aba, pushed; lighthouse 07a154d3). Thank you. Now L185 step 2 (the ledger calls this lap L189)"),
        ];
        let mut wrong = vec![];
        for (last, text) in cases {
            let next = marked_lap(text);
            let skipped = !before_dispatch_in_lap(true, Some(90), Some(450_000), DIAL, same_lap(Some(last), next.as_deref()));
            println!("C1 last {last} | read {:?} | cut skipped: {skipped} | {}", next, &text[..60]);
            if skipped { wrong.push(format!("{last} -> {:?}", next)); }
        }
        assert!(wrong.is_empty(), "new laps whose cut is skipped: {wrong:?}");
    }
    // The control: real continuations of the same lap skip the cut (green expected).
    #[test]
    fn c2_real_continuations_skip_the_cut() {
        for (last, text) in [("L229", "L229 same lap: Addendum 4 step 4, install 4e19e33 now."), ("L232", "L232, same lap, one amendment before it lands."), ("L235", "L235 same lap: the last read before the landing.")] {
            assert!(!before_dispatch_in_lap(true, Some(90), Some(450_000), DIAL, same_lap(Some(last), marked_lap(text).as_deref())), "{text}");
        }
    }
    // A compact summary is not a chair dispatch, but it quotes the tag: B's 06:35:39Z summary names L221 from its prose while B's last real dispatch had no lap id.
    #[test]
    fn c3_a_compact_summary_is_not_read_as_the_last_dispatch() {
        let j = concat!(
            r#"{"type":"user","message":{"content":"[chair:MAIN] A question from him, not a lap. Passed on word for word"}}"#, "\n",
            r#"{"type":"user","isCompactSummary":true,"message":{"content":"Summary: messages tagged [chair:MAIN]; hand-backs go to the librarian. This cycle's requests: - **L221**: the Compact warm seats"}}"#, "\n",
        );
        println!("C3 last_dispatch_lap = {:?}", last_dispatch_lap(j));
        assert_eq!(last_dispatch_lap(j), None, "the summary's prose is not a dispatch");
    }
}

// ---- pane C, L235 re-read of 3ac00138: varied rows for the marker
#[cfg(test)]
mod c_l235_marker {
    use super::cut_at_handback::*;
    const DIAL: u64 = 300_000;
    fn skipped(last: &str, text: &str, ctx: u64) -> bool { !before_dispatch_in_lap(true, Some(90), Some(ctx), DIAL, same_lap(Some(last), marked_lap(text).as_deref())) }
    #[test] fn m1_same_lap_naming_a_different_id_is_cut() { assert!(!skipped("L229", "L232 same lap: addendum", 450_000)); }
    #[test] fn m2_the_marker_on_the_second_id_of_a_closing_head_is_cut() { assert!(!skipped("L215", "L215 IS COLLATED; YOUR NEXT LAP IS L217 same lap", 450_000)); assert!(!skipped("L217", "L215 IS COLLATED; YOUR NEXT LAP IS L217 same lap", 450_000)); }
    #[test] fn m3_the_marker_with_a_pane_letter_first_skips() { assert!(skipped("L229", "A: L229 same lap: addendum 5", 450_000)); }
    #[test] fn m4_marked_but_over_the_hard_window_is_cut() { assert!(!skipped("L229", "L229 same lap: x", 600_001)); }
    #[test] fn m5_an_id_glued_earlier_does_not_steal_the_marker() { println!("M5 {:?} {:?}", marked_lap("see ML229 first; L229 same lap: x"), marked_lap("ML229 same lap; then L229 new")); assert_eq!(marked_lap("ML229 same lap; then L229 new"), None, "the marker sits after ML229, not after the lap id"); }
    #[test] fn m6_the_real_dispatch_without_the_marker_is_cut() { assert!(!skipped("L235", "L235 second read, yours, now.", 450_000)); }
}
