// capture.rs — layer 2: the shared clean-turn extractor.
//
// Raw PTY bytes are rendered by a headless vt100 emulator into a grid of screen lines; these
// pure functions turn that grid into clean, role-tagged turns. This is a faithful Rust port of
// ui/term.js `latestTurn`/`isChrome` (already proven behind the ⧉ copy button), so the backend
// and the frontend extract the same thing. Kept pure (no I/O, no emulator) so it is unit-testable
// against fixed claude-TUI screen fixtures; the emulator wiring lives in main.rs.

// A real user prompt: after optional leading space, a "❯", then whitespace, then content.
// (The empty input box "❯ " is NOT a prompt — it has no content after the marker.
// The agents-manager's selected row "❯ ◯ agent … 2m 3s · ↓ 74.3k tokens" is NOT a prompt
// either — its ticking timer made every settle look like a brand-new prompt, appending a
// whole-screen record each second: the 2026-07-14 md-limit recurrence, 43 copies deep.)
pub fn is_prompt(s: &str) -> bool {
    if is_agent_row(s) {
        return false;
    }
    let t = s.trim_start();
    let mut c = t.chars();
    if c.next() != Some('❯') {
        return false;
    }
    let rest = c.as_str();
    let trimmed = rest.trim_start();
    rest.len() != trimmed.len() && !trimmed.is_empty()
}

// A row of the agents manager (↓ to manage) painted below the input box: "● main",
// "◯ <agent>  <label>  2m 3s · ↓ 74.3k tokens", or the selected variant prefixed "❯ ".
// Keyed on the status glyph PLUS the "· … tokens" suffix (or the bare "● main" header) —
// never on "●"/"❯" alone, which open real response and prompt lines. The agent-finished
// notice ("● Agent \"…\" finished · 2m 3s") stays content: no "tokens" suffix.
pub fn is_agent_row(s: &str) -> bool {
    let t = s.trim();
    let t = t.strip_prefix('❯').map(str::trim_start).unwrap_or(t);
    if t == "● main" {
        return true;
    }
    (t.starts_with('◯') || t.starts_with('●')) && t.contains(" · ") && t.ends_with("tokens")
}

// The empty input box: a "❯" with only whitespace after it.
pub fn is_empty_box(s: &str) -> bool {
    let t = s.trim_start();
    let mut c = t.chars();
    if c.next() != Some('❯') {
        return false;
    }
    c.as_str().trim().is_empty()
}

// Is claude actively generating? The reliable marker is the "esc to interrupt" hint, shown only
// while a turn is in flight. (The ✻ glyph is NOT reliable: claude reuses it for the *completed*
// summary line too — "✻ Cogitated for 5s" — so keying off ✻ mistakes a finished turn for a live one.)
pub fn is_working(lines: &[String]) -> bool {
    lines.iter().any(|l| l.contains("esc to interrupt"))
}

// Bottom input-box chrome to strip: blank lines, the ⏵⏵ bypass footer, separator rules, the empty
// input box, the spinner/status line (any of claude's cycling star glyphs), and agents-manager
// rows. Mirrors term.js `isChrome`.
pub fn is_chrome(s: &str) -> bool {
    let t = s.trim();
    if t.is_empty() {
        return true;
    }
    let ts = s.trim_start();
    if ts.starts_with('⏵') || matches!(ts.chars().next(), Some('✻' | '✶' | '✽' | '✢' | '✳' | '✵' | '✴')) {
        return true;
    }
    if is_empty_box(s) || is_agent_row(s) {
        return true;
    }
    // a separator rule: only whitespace and dash-like glyphs
    t.chars().all(|c| c.is_whitespace() || matches!(c, '─' | '–' | '—' | '-'))
}

// The screen is "ready" (the latest turn is complete and claude awaits input) when a bare empty
// input box is present and claude is not actively generating. Used to gate extraction so we only
// harvest settled turns — not mid-stream frames, and not the fresh welcome screen (whose input box
// carries a "Try …" placeholder, so is_empty_box is false there).
pub fn screen_ready(lines: &[String]) -> bool {
    let has_box = lines.iter().any(|l| is_empty_box(l));
    has_box && !is_working(lines)
}

// The instance's LATEST response: everything after the last real prompt, minus the bottom chrome.
// Degrades to the whole screen if the prompt markers aren't present. Port of term.js `latestTurn`.
pub fn latest_turn(lines: &[String]) -> String {
    let mut prompt_idx: Option<usize> = None;
    for i in (0..lines.len()).rev() {
        if is_prompt(&lines[i]) {
            prompt_idx = Some(i);
            break;
        }
    }
    let start = prompt_idx.map(|i| i + 1).unwrap_or(0);
    let slice = &lines[start..];
    let mut end = slice.len();
    while end > 0 && is_chrome(&slice[end - 1]) {
        end -= 1;
    }
    let mut begin = 0;
    while begin < end && slice[begin].trim().is_empty() {
        begin += 1;
    }
    let joined = slice[begin..end].join("\n");
    let out = collapse_blanks(&joined);
    let out = out.trim();
    if out.is_empty() {
        lines.join("\n").trim().to_string()
    } else {
        out.to_string()
    }
}

// The text of the latest user prompt (the "❯ …" that produced the on-screen response), sans marker.
pub fn latest_prompt(lines: &[String]) -> String {
    for i in (0..lines.len()).rev() {
        if is_prompt(&lines[i]) {
            let t = lines[i].trim_start();
            let after = t.strip_prefix('❯').unwrap_or(t);
            return after.trim().to_string();
        }
    }
    String::new()
}

// Overlay chrome claude paints over the bottom-right of a content row while scrolled up
// ("Jump to bottom (ctrl-…)") or when a background result lands ("1 new message (ctrl-…)").
// It overwrites the tail of a real line, so the honest capture is the line truncated at the
// overlay — the glyphs underneath are unrecoverable from this frame (a fuller window of the
// same turn restores them via stitch()).
pub fn strip_overlay(s: &str) -> String {
    let mut out = s;
    for marker in ["Jump to bottom (", "1 new message ("] {
        if let Some(i) = out.find(marker) {
            out = &out[..i];
        }
    }
    out.trim_end().to_string()
}

// Merge two visible-screen windows of the SAME turn into one. Windows arrive as the terminal
// scrolls, so `new` usually contains or extends `old`: containment first, then the widest
// line-overlap (a suffix of `old` equal to a prefix of `new`), else keep the fuller window —
// never concatenate blind, which is exactly the 8–9× stacking this replaces. The raw .log
// keeps full fidelity for anything a window pair genuinely can't cover.
pub fn stitch(old: &str, new: &str) -> String {
    if new.contains(old) {
        return new.to_string();
    }
    if old.contains(new) {
        return old.to_string();
    }
    let a: Vec<&str> = old.lines().collect();
    let b: Vec<&str> = new.lines().collect();
    let max = a.len().min(b.len());
    for k in (1..=max).rev() {
        if a[a.len() - k..] == b[..k] {
            let mut out = old.to_string();
            for line in &b[k..] {
                out.push('\n');
                out.push_str(line);
            }
            return out;
        }
    }
    if new.len() > old.len() { new.to_string() } else { old.to_string() }
}

// Collapse runs of 3+ newlines into exactly 2 (term.js `/\n{3,}/g → '\n\n'`), no regex dep.
fn collapse_blanks(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    let mut run = 0usize;
    for ch in s.chars() {
        if ch == '\n' {
            run += 1;
            if run <= 2 {
                out.push('\n');
            }
        } else {
            run = 0;
            out.push(ch);
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    fn v(lines: &[&str]) -> Vec<String> {
        lines.iter().map(|s| s.to_string()).collect()
    }

    // a representative settled claude screen: a prior turn, the current prompt + response, chrome.
    fn settled_screen() -> Vec<String> {
        v(&[
            "❯ what is a monad",
            "",
            "● A monad is a structure that wraps a value and",
            "  defines how to chain operations over it.",
            "",
            "❯ ",
            "  ⏵⏵ bypass permissions on",
        ])
    }

    #[test]
    fn is_prompt_matches_real_prompt_only() {
        assert!(is_prompt("❯ hello"));
        assert!(is_prompt("  ❯   spaced"));
        assert!(!is_prompt("❯ "), "empty box is not a prompt");
        assert!(!is_prompt("❯"), "bare marker is not a prompt");
        assert!(!is_prompt("● a response line"));
    }

    #[test]
    fn empty_box_detected() {
        assert!(is_empty_box("❯ "));
        assert!(is_empty_box("  ❯   "));
        assert!(!is_empty_box("❯ typed"));
    }

    #[test]
    fn chrome_covers_footer_rules_box_and_spinner() {
        assert!(is_chrome(""));
        assert!(is_chrome("   "));
        assert!(is_chrome("  ⏵⏵ bypass permissions on"));
        assert!(is_chrome("────────────────"));
        assert!(is_chrome("❯ "));
        assert!(is_chrome("✻ Cooked for 3s"));
        assert!(!is_chrome("● a real response line"));
    }

    #[test]
    fn latest_turn_extracts_response_after_last_prompt() {
        let got = latest_turn(&settled_screen());
        assert_eq!(
            got,
            "● A monad is a structure that wraps a value and\n  defines how to chain operations over it."
        );
    }

    #[test]
    fn latest_prompt_is_the_producing_prompt_not_the_empty_box() {
        assert_eq!(latest_prompt(&settled_screen()), "what is a monad");
    }

    #[test]
    fn screen_ready_true_when_box_present_and_idle() {
        assert!(screen_ready(&settled_screen()));
    }

    #[test]
    fn screen_not_ready_while_generating() {
        // mid-stream: the input box carries the interrupt hint, not a bare "❯"
        let s = v(&[
            "❯ what is a monad",
            "● A monad is a structure that…",
            "❯ · esc to interrupt",
            "  ⏵⏵ bypass permissions on",
        ]);
        assert!(!screen_ready(&s), "the interrupt hint means a turn is in flight");
    }

    #[test]
    fn screen_ready_despite_completed_summary_line() {
        // regression (found against live claude 2.1.207): a finished turn leaves "✻ Cogitated for
        // Ns" on screen with a bare box. That is DONE, not spinning — must read as ready.
        let s = v(&[
            "❯ reply with only the single word: PONGCHECK",
            "● PONGCHECK",
            "✻ Cogitated for 5s",
            "❯",
            "  ⏵⏵ bypass permissions on (shift+tab to cycle)",
        ]);
        assert!(screen_ready(&s), "a completed ✻ summary is not an active spinner");
        assert_eq!(latest_turn(&s), "● PONGCHECK");
        assert_eq!(latest_prompt(&s), "reply with only the single word: PONGCHECK");
    }

    #[test]
    fn latest_turn_ignores_earlier_turns_on_screen() {
        // two turns visible; extraction takes only the latest response
        let screen = v(&[
            "❯ first question",
            "● first answer",
            "❯ second question",
            "● second answer line one",
            "  second answer line two",
            "❯ ",
        ]);
        assert_eq!(
            latest_turn(&screen),
            "● second answer line one\n  second answer line two"
        );
        assert_eq!(latest_prompt(&screen), "second question");
    }

    #[test]
    fn collapse_blanks_caps_at_two_newlines() {
        assert_eq!(collapse_blanks("a\n\n\n\nb"), "a\n\nb");
        assert_eq!(collapse_blanks("a\nb"), "a\nb");
    }

    #[test]
    fn strip_overlay_truncates_at_the_painted_hint() {
        // real capture artifact from 2026-07-12: the hint overwrites the tail of a content row
        assert_eq!(
            strip_overlay("  written by an instance that re Jump to bottom (ctrl+b)"),
            "  written by an instance that re"
        );
        assert_eq!(
            strip_overlay("  fire live. That 1 new message (ctrl-o to expand)"),
            "  fire live. That"
        );
    }

    #[test]
    fn strip_overlay_leaves_clean_lines_alone() {
        assert_eq!(strip_overlay("● a normal response line"), "● a normal response line");
    }

    #[test]
    fn stitch_keeps_the_containing_window() {
        assert_eq!(stitch("b\nc", "a\nb\nc\nd"), "a\nb\nc\nd");
        assert_eq!(stitch("a\nb\nc\nd", "b\nc"), "a\nb\nc\nd");
    }

    #[test]
    fn stitch_merges_overlapping_scroll_windows() {
        // window 1 shows lines 1-3, window 2 shows lines 2-4 → one stitched copy, no repeats
        assert_eq!(stitch("one\ntwo\nthree", "two\nthree\nfour"), "one\ntwo\nthree\nfour");
    }

    #[test]
    fn agent_manager_rows_are_chrome_never_prompts() {
        // the 2026-07-14 md-limit recurrence: the agents manager renders its selected row
        // with a "❯", and its timer ticks — every settle looked like a fresh prompt
        let selected = "❯ ◯ general-purpose  Streamline UI, readability audit    2m 25s · ↓ 100.5k tokens";
        let unselected = "  ◯ general-purpose  Audit vertical space, propose layout    2m 3s · ↓ 110.8k tokens";
        assert!(!is_prompt(selected), "selected agent row is not a prompt");
        assert!(is_agent_row(selected));
        assert!(is_chrome(selected));
        assert!(is_agent_row(unselected));
        assert!(is_chrome(unselected));
        assert!(is_agent_row("  ● main"));
        assert!(is_chrome("  ● main"));
        // real content stays content
        assert!(!is_agent_row("● The space auditor is back with the hard numbers"));
        assert!(!is_chrome("● The space auditor is back with the hard numbers"));
        assert!(!is_agent_row("● Agent \"Audit vertical space\" finished · 2m 3s"));
        assert!(is_prompt("❯ a real question"));
    }

    #[test]
    fn agents_screen_extracts_a_stable_turn_across_timer_ticks() {
        // two settles of the same screen, one second apart: only the manager timers differ.
        // extraction must yield the identical (prompt, turn) both times so dedupe holds.
        let screen = |t1: &str, t2: &str| {
            v(&[
                "❯ streamline the ui",
                "",
                "● Three agents are auditing the layout now.",
                "✻ Waiting for 2 background agents to finish",
                "───────────────",
                "❯ ",
                "───────────────",
                "  ⏵⏵ bypass permissions on (shift+tab to cycle) · ↓ to manage",
                "",
                "  ● main",
                &format!("  ◯ general-purpose  Audit vertical space    {t1} · ↓ 110.8k tokens"),
                &format!("❯ ◯ general-purpose  Streamline UI    {t2} · ↓ 100.5k tokens"),
            ])
        };
        let a = screen("2m 3s", "1m 53s");
        let b = screen("2m 4s", "1m 54s");
        assert!(screen_ready(&a));
        assert_eq!(latest_prompt(&a), "streamline the ui");
        assert_eq!(latest_turn(&a), "● Three agents are auditing the layout now.");
        assert_eq!(latest_prompt(&a), latest_prompt(&b));
        assert_eq!(latest_turn(&a), latest_turn(&b));
    }

    #[test]
    fn stitch_never_stacks_disjoint_windows() {
        // no containment, no overlap → keep the fuller window; never concatenate (the 8-9× bug)
        assert_eq!(stitch("aa\nbb", "xx\nyy\nzz"), "xx\nyy\nzz");
        assert_eq!(stitch("aa\nbb\ncc", "xx"), "aa\nbb\ncc");
    }
}
