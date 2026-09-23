//! THE NEXT TRAILER — the pure check behind the gate on `chair_inject`, `call_chair` and `call_librarian`.
//!
//! The rule is the keeper's (2026-09-16 05:26): *"each seat tells the next where to hand it to remind it."* Its text
//! is `consonance/src-tauri/brief/BUILDING.md`, WHAT A DISPATCH OWES item 6 and WHAT A HAND-BACK OWES item 6. Its
//! shape: the LAST non-empty line of the message is
//!
//! ```text
//! NEXT: <station> <command> when <condition>
//! ```
//!
//! STANDALONE ON PURPOSE. This file has no crate imports, so it still builds and tests alone with
//! `rustc --edition 2021 --test src/trailer.rs`. Built D068 by pane B while A owned `mcp.rs`; WIRED D069 —
//! `mod trailer;` in `main.rs`, and `mcp.rs`'s `trailer_gate` makes the per-verb decision the three verbs act on.

/// Where a refused seat reads the rule. Named in every refusal and warning, so the rule travels with the refusal.
pub const RULE_FILE: &str = "consonance/src-tauri/brief/BUILDING.md";

/// A parsed trailer. `station` is the first word after `NEXT:` — a seat, or the verb that reaches one.
#[derive(Debug, PartialEq, Eq)]
pub struct Trailer<'a> {
    pub station: &'a str,
    pub command: &'a str,
    pub condition: &'a str,
}

/// Why a message has no usable trailer.
#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum Missing {
    NoTrailer,
    NotLastLine,
    NoStation,
    NoCommand,
    NoCondition,
    /// L084 — the collation ring carries no `OUTPUT → NEXT:` line.
    NoOutputNext,
    /// L084 — an `OUTPUT → NEXT:` line is present, but not as the line immediately before the NEXT trailer.
    OutputNextNotBeforeTrailer,
    /// L084 — the `OUTPUT → NEXT:` line does not say `changed` or `unchanged`.
    OutputNextNoVerdict,
    /// L084 — the verdict is there, with no reason after it.
    OutputNextNoWhy,
}

/// The three verbs the gate sits on.
#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum Verb {
    ChairInject,
    CallChair,
    CallLibrarian,
}

/// What the gate does with a message whose trailer is missing.
#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum Action {
    Refuse,
    WarnAndDeliver,
}

/// Named seats a trailer may hand to. Case-insensitive. A single UPPERCASE letter (optionally with a generation
/// number, `A2`) is also a seat — `pane_letter` assigns those — but a lowercase one is an article, not a pane.
const STATIONS: &[&str] = &[
    "chair", "main", "librarian", "keeper", "pane", "panes",
    "alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel", "india", "juliet", "kilo", "lima", "mike",
];

/// Verbs that name their station by reaching it. MEASURED, not assumed: all five chair dispatches in D066-D067 open
/// `NEXT: call_librarian …`. A seat-first rule would have refused every compliant dispatch in the window.
const VERBS: &[&str] = &["call_librarian", "call_chair", "chair_inject"];

fn is_station(token: &str) -> bool {
    if VERBS.contains(&token) {
        return true;
    }
    if STATIONS.iter().any(|s| s.eq_ignore_ascii_case(token)) {
        return true;
    }
    let mut chars = token.chars();
    matches!(chars.next(), Some(c) if c.is_ascii_uppercase()) && chars.all(|c| c.is_ascii_digit())
}

/// The byte offset of the first whole-word `when` (ASCII case-insensitive), or None. `whenever` does not count.
fn find_when(s: &str) -> Option<usize> {
    let lower = s.to_ascii_lowercase(); // ASCII-only lowering keeps every byte offset identical to `s`
    let bytes = lower.as_bytes();
    let mut from = 0;
    while let Some(rel) = lower[from..].find("when") {
        let i = from + rel;
        let before_ok = i == 0 || bytes[i - 1].is_ascii_whitespace();
        let after_ok = i + 4 == bytes.len() || bytes[i + 4].is_ascii_whitespace();
        if before_ok && after_ok {
            return Some(i);
        }
        from = i + 4;
    }
    None
}

/// Parse the trailer: the LAST non-empty line, `NEXT: <station> <command> when <condition>`.
///
/// What it deliberately does NOT judge: whether the condition is a good one. `when done` passes. A gate that parses
/// meaning teaches seats the words that satisfy the parser; the shape is what can be enforced, and the station is
/// the part that failed in the one stall this window measured.
pub fn check(text: &str) -> Result<Trailer<'_>, Missing> {
    let last = text.lines().map(str::trim).filter(|l| !l.is_empty()).last().unwrap_or("");
    let Some(rest) = last.strip_prefix("NEXT:") else {
        let earlier = text.lines().any(|l| l.trim_start().starts_with("NEXT:"));
        return Err(if earlier { Missing::NotLastLine } else { Missing::NoTrailer });
    };
    let rest = rest.trim();
    let (token, after) = match rest.split_once(char::is_whitespace) {
        Some((t, a)) => (t, a.trim_start()),
        None => (rest, ""),
    };
    let station = token.trim_end_matches(|c: char| matches!(c, ',' | ';' | ':' | '.' | '—' | '-'));
    if station.is_empty() || !is_station(station) {
        return Err(Missing::NoStation);
    }
    let Some(w) = find_when(after) else {
        return Err(Missing::NoCondition);
    };
    let command = after[..w].trim();
    let condition = after[w + 4..].trim();
    if condition.is_empty() {
        return Err(Missing::NoCondition);
    }
    if command.is_empty() {
        return Err(Missing::NoCommand);
    }
    Ok(Trailer { station, command, condition })
}

/// L084 — THE OUTPUT → NEXT LINE. The keeper, 2026-09-23 (the librarian's transcript, 07:14:20 and 07:15:52 UTC):
/// *"how do we know the next step before we get the results from the current pane or seat that works on their chunk of
/// the loop?"* and *"we need to fix this as soon as we can, since it is crucial for the rest of the system to work."*
/// The rule's text: BUILDING.md, WHAT A HAND-BACK OWES item 6, amendment of 2026-09-23. A collation says, in the line
/// directly before its NEXT trailer, whether the OUTPUT changed the next step:
///
/// ```text
/// OUTPUT → NEXT: changed|unchanged — <why, from the output>
/// ```
///
/// THE COLLATION RING ONLY (`call_chair`). A pane reports and the collator decides, so `call_librarian` is untouched —
/// and on that verb a refusal would drop the pointer besides (see `policy`). `chair_inject` does not owe it either: a
/// dispatch carries a plan DEFAULT, and the verdict on it belongs to whoever reads the output.
///
/// WHAT THIS CAN ENFORCE, and what it cannot. It enforces that the line EXISTS, where it can be read beside the route it
/// justifies, with a verdict word and a non-empty reason. It cannot enforce that the reason is TRUE: `unchanged — ok`
/// passes. That is deliberate and the same line `check` draws: a gate that parses meaning teaches the words that satisfy
/// the parser. The line's value is that it is a claim on the board a later reader can hold against the output it names.
pub fn requires_output_next(verb: Verb) -> bool {
    matches!(verb, Verb::CallChair)
}

const OUTPUT_MARKERS: &[&str] = &["OUTPUT → NEXT:", "OUTPUT -> NEXT:"];

/// The verdict on the line after the marker: `changed` or `unchanged` as a whole word, then a separator (— – - :), then
/// a non-empty reason. A bare space is not a separator — the rule's own shape has the dash, and "unchanged because" run
/// together is where a missing reason hides.
fn output_next(line: &str) -> Result<(), Missing> {
    let rest = OUTPUT_MARKERS.iter().find_map(|m| line.strip_prefix(m)).unwrap_or("").trim_start();
    let word_end = rest.find(|c: char| !c.is_ascii_alphabetic()).unwrap_or(rest.len());
    let word = &rest[..word_end];
    if !(word.eq_ignore_ascii_case("changed") || word.eq_ignore_ascii_case("unchanged")) {
        return Err(Missing::OutputNextNoVerdict);
    }
    let after = rest[word_end..].trim_start();
    let reason = ["—", "–", "-", ":"].iter().find_map(|s| after.strip_prefix(s)).map(str::trim).unwrap_or("");
    if reason.is_empty() {
        return Err(Missing::OutputNextNoWhy);
    }
    Ok(())
}

/// L084 — the check `trailer_gate` should run: the NEXT trailer for every verb (reported first, so the older rule is
/// never shadowed), and for the collation ring also the `OUTPUT → NEXT:` line DIRECTLY before it. Directly before, not
/// anywhere: a phrase accepted anywhere is satisfied by a quote of it (L082, the test that passed on its own retraction).
pub fn check_for(verb: Verb, text: &str) -> Result<Trailer<'_>, Missing> {
    let t = check(text)?;
    if requires_output_next(verb) {
        let lines: Vec<&str> = text.lines().map(str::trim).filter(|l| !l.is_empty()).collect();
        let before = if lines.len() >= 2 { lines[lines.len() - 2] } else { "" };
        if OUTPUT_MARKERS.iter().any(|m| before.starts_with(m)) {
            output_next(before)?;
        } else if lines.iter().any(|l| OUTPUT_MARKERS.iter().any(|m| l.starts_with(m))) {
            return Err(Missing::OutputNextNotBeforeTrailer);
        } else {
            return Err(Missing::NoOutputNext);
        }
    }
    Ok(t)
}

/// Which action each verb takes on a missing trailer.
///
/// REFUSE where the sender reads the refusal in the same turn and gets its message back whole: `chair_inject` (the
/// chair) and `call_chair` (the librarian). DELIVER WITH A WARNING on `call_librarian` only: its out-of-turn refusal in
/// `mcp.rs` returns canned text and drops `text` (C's finding), so refusing a pane's hand-back for its trailer would
/// lose the POINTER — the librarian can route a pointer with no trailer, and nobody can route a trailer with no
/// pointer. Revisit only after a refusal on that edge carries its payload back.
///
/// D069: `call_chair` moved from WarnAndDeliver to Refuse at the chair's ruling. D068 grouped it with
/// `call_librarian` as "a return leg", but the payload argument was only ever true of `call_librarian`.
pub fn policy(verb: Verb) -> Action {
    match verb {
        Verb::ChairInject | Verb::CallChair => Action::Refuse,
        Verb::CallLibrarian => Action::WarnAndDeliver,
    }
}

fn section(verb: Verb) -> &'static str {
    match verb {
        Verb::ChairInject => "WHAT A DISPATCH OWES",
        Verb::CallChair | Verb::CallLibrarian => "WHAT A HAND-BACK OWES",
    }
}

fn what_is_missing(why: Missing) -> &'static str {
    match why {
        Missing::NoTrailer => "the message has no NEXT: line at its end",
        Missing::NotLastLine => "a NEXT: line is present but is not the last line, and whatever follows it hides it",
        Missing::NoStation => "the NEXT: line names no station — its first word must be a seat (chair, librarian, a pane letter) or the verb that reaches one",
        Missing::NoCommand => "the NEXT: line names a station but has no command before `when`",
        Missing::NoCondition => "the NEXT: line has no `when <condition>` clause saying when the next seat acts",
        Missing::NoOutputNext => "the collation has no `OUTPUT → NEXT:` line",
        Missing::OutputNextNotBeforeTrailer => "an `OUTPUT → NEXT:` line is present but is not the line directly before the NEXT trailer",
        Missing::OutputNextNoVerdict => "the `OUTPUT → NEXT:` line does not begin with `changed` or `unchanged`",
        Missing::OutputNextNoWhy => "the `OUTPUT → NEXT:` line gives a verdict but no reason from the output after it",
    }
}

/// The refusal a seat reads. It names the rule, the file and the missing part, shows the shape, and RETURNS THE
/// MESSAGE WHOLE — so a refusal can never be the place a message is lost.
pub fn refusal_text(verb: Verb, why: Missing, message: &str) -> String {
    if matches!(why, Missing::NoOutputNext | Missing::OutputNextNotBeforeTrailer | Missing::OutputNextNoVerdict | Missing::OutputNextNoWhy) {
        return format!(
            "refused by the NEXT-trailer gate: {missing}.\n\
             The rule: {file}, {section} item 6, amended 2026-09-23 — the next step comes from the output, not the plan. \
             The keeper: \"how do we know the next step before we get the results from the current pane or seat that works on their chunk of the loop?\"\n\
             A collation's line directly before its NEXT trailer must be:\n    OUTPUT → NEXT: changed|unchanged — <why, from the output>\n\
             e.g. OUTPUT → NEXT: unchanged — both hand-backs green and inside their packets\n\
             Nothing was delivered. Your message, returned whole — add the line and send it again:\n\
             -----\n{message}\n-----",
            missing = what_is_missing(why),
            file = RULE_FILE,
            section = section(verb),
            message = message,
        );
    }
    format!(
        "refused by the NEXT-trailer gate: {missing}.\n\
         The rule: {file}, {section} item 6. The keeper, 2026-09-16: \"each seat tells the next where to hand it to remind it.\"\n\
         The last non-empty line must be:\n    NEXT: <station> <command> when <condition>\n\
         e.g. NEXT: librarian collate the chunk when all four hand-backs are in\n\
         Nothing was delivered. Your message, returned whole — add the trailer as its last line and send it again:\n\
         -----\n{message}\n-----",
        missing = what_is_missing(why),
        file = RULE_FILE,
        section = section(verb),
        message = message,
    )
}

/// The text actually delivered on a return leg with no usable trailer: the message FIRST and unchanged, then a note
/// the receiver can act on. The note is not addressed to the sender, who has already moved on.
pub fn delivered_with_warning(message: &str, why: Missing) -> String {
    format!(
        "{message}\n\n[NEXT-trailer gate — delivered anyway: {missing}. The rule: {file}, WHAT A HAND-BACK OWES item 6. \
         The receiver decides the next station; the sender should end with `NEXT: <station> <command> when <condition>`.]",
        message = message,
        missing = what_is_missing(why),
        file = RULE_FILE,
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    // ── FIXTURES FROM THE MEASURED WINDOW (D066 open -> D068 open, board.jsonl on D), verbatim last lines ──────
    // The chair's dispatch trailer, 5 of 5 dispatches in the window used this shape. It starts with a VERB, not a
    // seat — so a check that demanded a seat name first would have refused every compliant dispatch the room has.
    const CHAIR_DISPATCH: &str = "Hand-back: exo_memory/handback/p-nul-repairs-B_2026-09-16.md.\n\nNEXT: call_librarian with the pointer when the hand-back is written — `exo_memory/handback/p-nul-repairs-B_2026-09-16.md` — and add a map line.";
    // B's ring, the one pane ring in the window that carried a trailer. Starts with a seat.
    const B_RING: &str = "D067 P-NUL-REPAIRS: exo_memory/handback/p-nul-repairs-B_2026-09-16.md\n\nNEXT: librarian re-derive text-census exit 0 and stick.test.js 19/0 when you collate chunk 2, then the chair carries §3 to E as E's call.";
    // THE CHAIR'S OWN LINE at 16:02:23Z, after which the lap stalled until the librarian rang at 17:24:30Z. It LOOKS
    // like a trailer and names no seat and no condition: "chunk" is not a station and nothing says when.
    const CHAIR_STALL: &str = "Chunk 1 filed.\n\nNEXT: chunk 2 opens — C on P-CARRY-EXCLUDE + PRUNE, B on P-NUL-REPAIRS, plus the carried ui/stick.js";
    // A's ring: a pointer and no trailer at all.
    const A_RING: &str = "[pane:A] P-STICK-APPLIER-ZOMBIE (D066, chunk 1), on D. Pointer: exo_memory/handback/p-stick-zombie-A_2026-09-16.md";

    #[test]
    fn the_chairs_dispatch_shape_passes_with_a_verb_as_the_station() {
        let t = check(CHAIR_DISPATCH).expect("the chair's measured dispatch trailer must pass");
        assert_eq!(t.station, "call_librarian");
        assert_eq!(t.command, "with the pointer");
        assert!(t.condition.starts_with("the hand-back is written"));
    }

    #[test]
    fn a_ring_that_names_a_seat_passes() {
        let t = check(B_RING).expect("a seat-first trailer must pass");
        assert_eq!(t.station, "librarian");
        assert!(t.command.starts_with("re-derive"));
        assert!(t.condition.starts_with("you collate chunk 2"));
    }

    #[test]
    fn the_chairs_stall_line_is_refused_because_it_names_no_station() {
        assert_eq!(check(CHAIR_STALL), Err(Missing::NoStation));
    }

    #[test]
    fn a_pointer_with_no_trailer_is_refused() {
        assert_eq!(check(A_RING), Err(Missing::NoTrailer));
    }

    #[test]
    fn a_trailer_that_is_not_the_last_line_is_refused_and_says_so() {
        let m = "NEXT: librarian re-derive the counts when the file lands\n\nand one more thought after it";
        assert_eq!(check(m), Err(Missing::NotLastLine));
    }

    #[test]
    fn trailing_blank_lines_and_crlf_do_not_hide_the_last_line() {
        let m = "pointer\r\nNEXT: librarian collate it when all four are in\r\n\r\n   \r\n";
        let t = check(m).expect("blank lines after the trailer are not content");
        assert_eq!(t.condition, "all four are in");
    }

    #[test]
    fn next_with_nothing_after_it_is_refused() {
        assert_eq!(check("pointer\nNEXT:"), Err(Missing::NoStation));
        assert_eq!(check("pointer\nNEXT:   "), Err(Missing::NoStation));
    }

    #[test]
    fn a_station_with_no_when_clause_is_refused() {
        assert_eq!(check("pointer\nNEXT: librarian collate the chunk"), Err(Missing::NoCondition));
    }

    #[test]
    fn an_empty_condition_is_refused() {
        assert_eq!(check("pointer\nNEXT: librarian collate the chunk when"), Err(Missing::NoCondition));
        assert_eq!(check("pointer\nNEXT: librarian collate the chunk when   "), Err(Missing::NoCondition));
    }

    #[test]
    fn a_station_followed_directly_by_when_has_no_command() {
        assert_eq!(check("pointer\nNEXT: librarian when the file lands"), Err(Missing::NoCommand));
    }

    #[test]
    fn the_marker_is_case_sensitive_so_prose_does_not_count() {
        assert_eq!(check("pointer\nnext: librarian collate it when it lands"), Err(Missing::NoTrailer));
    }

    #[test]
    fn a_single_uppercase_pane_letter_is_a_station_but_a_lowercase_article_is_not() {
        let t = check("x\nNEXT: C respells tail-carry.js:1303 when the chair rings").expect("a pane letter is a seat");
        assert_eq!(t.station, "C");
        assert_eq!(check("x\nNEXT: a note goes out when the lap closes"), Err(Missing::NoStation));
    }

    #[test]
    fn a_station_may_carry_trailing_punctuation() {
        let t = check("x\nNEXT: librarian, collate it when all are in").expect("a comma after the seat is still the seat");
        assert_eq!(t.station, "librarian");
    }

    #[test]
    fn when_inside_a_longer_word_is_not_the_clause() {
        // "whenever" must not be read as "when" + "ever"; the clause needs "when" as a whole word.
        assert_eq!(check("x\nNEXT: librarian collate whenever convenient"), Err(Missing::NoCondition));
    }

    // ── THE POLICY: refuse where a refusal is cheap, deliver-with-warning on the return leg ────────────────────────

    #[test]
    fn a_chair_dispatch_without_a_trailer_is_refused() {
        assert_eq!(policy(Verb::ChairInject), Action::Refuse);
    }

    #[test]
    fn a_pane_hand_back_is_never_refused_for_a_missing_trailer() {
        // A refused hand-back loses its POINTER, not just its trailer (C, mcp.rs call_librarian's out-of-turn arm
        // returns canned text and drops `text`). The librarian can route a pointer with no trailer; nobody can route
        // a trailer with no pointer.
        assert_eq!(policy(Verb::CallLibrarian), Action::WarnAndDeliver);
    }

    #[test]
    fn the_librarians_ring_to_the_chair_is_refused() {
        // CHANGED D069, at the chair's ruling, and the D068 version of this test was wrong for a reason on the record:
        // it grouped call_chair with call_librarian as "a return leg", but the payload argument never applied to it.
        // call_chair has no payload-dropping arm (its only other refusal is the seat check), the sender is the
        // librarian reading its own tool result in the same turn, and `refusal_text` hands the message back whole.
        // So a refusal here costs one re-send, not the message.
        assert_eq!(policy(Verb::CallChair), Action::Refuse);
    }

    #[test]
    fn a_refusal_names_the_rule_the_file_and_the_shape() {
        let r = refusal_text(Verb::ChairInject, Missing::NoStation, CHAIR_STALL);
        assert!(r.contains(RULE_FILE), "the refusal does not name the file: {r}");
        assert!(r.contains("WHAT A DISPATCH OWES") && r.contains("item 6"), "the refusal does not name the rule: {r}");
        assert!(r.contains("NEXT: <station> <command> when <condition>"), "the refusal does not show the shape: {r}");
    }

    #[test]
    fn a_refusal_hands_the_whole_message_back_so_nothing_is_lost() {
        let r = refusal_text(Verb::ChairInject, Missing::NoTrailer, A_RING);
        assert!(r.contains(A_RING), "the refused message was not returned intact: {r}");
    }

    #[test]
    fn a_refusal_names_which_part_is_missing() {
        // Each phrase is specific to ONE reason. The first version asserted "when <condition>" and "station", which
        // the shared shape line carries for every reason — so it passed whatever the refusal said.
        let reasons = [
            (Missing::NoTrailer, "has no NEXT: line"),
            (Missing::NotLastLine, "is not the last line"),
            (Missing::NoStation, "names no station"),
            (Missing::NoCommand, "no command before"),
            (Missing::NoCondition, "no `when <condition>` clause"),
        ];
        for (why, phrase) in reasons {
            let r = refusal_text(Verb::ChairInject, why, "x");
            assert!(r.contains(phrase), "{why:?} does not say `{phrase}`: {r}");
            for (other, other_phrase) in reasons {
                if other != why {
                    assert!(!r.contains(other_phrase), "{why:?} also says {other:?}'s `{other_phrase}`: {r}");
                }
            }
        }
    }

    #[test]
    fn a_warned_hand_back_is_delivered_whole_with_the_rule_named() {
        let d = delivered_with_warning(A_RING, Missing::NoTrailer);
        assert!(d.starts_with(A_RING), "the pointer must arrive first and unchanged: {d}");
        assert!(d.len() > A_RING.len(), "no warning was added");
        assert!(d.contains("WHAT A HAND-BACK OWES") && d.contains("item 6") && d.contains(RULE_FILE), "{d}");
    }

    // ── L084 · THE OUTPUT → NEXT LINE — the keeper, 2026-09-23: the next step comes from the OUTPUT, not the plan ──
    // Required on the librarian's collation ring (call_chair) ONLY. A pane reports; the collator decides.
    const COLLATION_CHANGED: &str = "L083 collated: exo_memory/librarian/2026-09-22.md 01:4x.\n\nOUTPUT → NEXT: changed — C's map found three app-side sites the packet did not name, so 2 waits on them\nNEXT: chair re-scope item 2 when the three sites are read";
    const COLLATION_UNCHANGED: &str = "L083 collated: exo_memory/librarian/2026-09-22.md 01:4x.\n\nOUTPUT → NEXT: unchanged — both hand-backs green and inside their packets, nothing asks for a new step\nNEXT: chair open items 3 + 2 when this collation is read";
    const COLLATION_NO_LINE: &str = "L083 collated: exo_memory/librarian/2026-09-22.md 01:4x.\n\nNEXT: chair open items 3 + 2 when this collation is read";

    #[test]
    fn l084_a_collation_that_says_changed_passes() {
        let t = check_for(Verb::CallChair, COLLATION_CHANGED).expect("changed, with a reason, directly before the trailer");
        assert_eq!(t.station, "chair");
    }

    #[test]
    fn l084_a_collation_that_says_unchanged_passes() {
        check_for(Verb::CallChair, COLLATION_UNCHANGED).expect("unchanged is a verdict too, when it says why");
    }

    #[test]
    fn l084_the_ascii_arrow_counts() {
        let m = COLLATION_UNCHANGED.replace("OUTPUT → NEXT:", "OUTPUT -> NEXT:");
        check_for(Verb::CallChair, &m).expect("the arrow is typography; a keyboard or a relay that mangles → must not refuse the rule");
    }

    #[test]
    fn l084_a_collation_without_the_line_is_refused() {
        assert_eq!(check_for(Verb::CallChair, COLLATION_NO_LINE), Err(Missing::NoOutputNext));
    }

    #[test]
    fn l084_the_line_anywhere_but_directly_before_the_trailer_is_refused() {
        // The L082 lesson: a phrase accepted ANYWHERE is satisfied by a quote of it. A collation that quotes the rule in
        // its body, or pastes a pane's line, must not pass for having written its own.
        let m = "OUTPUT → NEXT: unchanged — quoted from the packet\n\nL083 collated: the pointer.\n\nNEXT: chair open items 3 + 2 when this is read";
        assert_eq!(check_for(Verb::CallChair, m), Err(Missing::OutputNextNotBeforeTrailer));
    }

    #[test]
    fn l084_a_line_with_no_verdict_word_is_refused() {
        for bad in ["OUTPUT → NEXT: maybe — hard to say", "OUTPUT → NEXT: — the output was fine", "OUTPUT → NEXT: unchangedly — x", "OUTPUT → NEXT: changes — x"] {
            let m = format!("pointer\n{bad}\nNEXT: chair open 3 when this is read");
            assert_eq!(check_for(Verb::CallChair, &m), Err(Missing::OutputNextNoVerdict), "{bad}");
        }
    }

    #[test]
    fn l084_a_verdict_with_no_reason_is_refused() {
        // The last case was found as a surviving mutant: with no test of a reason run on after a bare space, a gate
        // that took the space as the separator passed everything here.
        for bad in ["OUTPUT → NEXT: unchanged", "OUTPUT → NEXT: changed —", "OUTPUT → NEXT: unchanged -   ", "OUTPUT → NEXT: changed:", "OUTPUT → NEXT: unchanged because nothing moved"] {
            let m = format!("pointer\n{bad}\nNEXT: chair open 3 when this is read");
            assert_eq!(check_for(Verb::CallChair, &m), Err(Missing::OutputNextNoWhy), "{bad}");
        }
    }

    #[test]
    fn l084_the_marker_is_case_sensitive_like_next() {
        let m = COLLATION_UNCHANGED.replace("OUTPUT → NEXT:", "output → next:");
        assert_eq!(check_for(Verb::CallChair, &m), Err(Missing::NoOutputNext));
    }

    #[test]
    fn l084_a_pane_ring_without_the_line_is_still_delivered() {
        // Panes report; the collator decides. call_librarian keeps exactly the trailer rule it had.
        assert_eq!(check_for(Verb::CallLibrarian, B_RING), check(B_RING));
        assert!(check_for(Verb::CallLibrarian, B_RING).is_ok(), "a pane ring with a trailer and no OUTPUT line must pass");
        assert_eq!(check_for(Verb::CallLibrarian, A_RING), Err(Missing::NoTrailer), "and a pane ring's only fault stays the trailer");
        assert_eq!(policy(Verb::CallLibrarian), Action::WarnAndDeliver, "and it is still delivered, never refused");
    }

    #[test]
    fn l084_a_chair_dispatch_does_not_owe_the_line() {
        assert!(check_for(Verb::ChairInject, CHAIR_DISPATCH).is_ok());
    }

    #[test]
    fn l084_only_the_collation_ring_owes_the_line() {
        assert!(requires_output_next(Verb::CallChair));
        assert!(!requires_output_next(Verb::CallLibrarian));
        assert!(!requires_output_next(Verb::ChairInject));
    }

    #[test]
    fn l084_a_missing_trailer_is_still_reported_first() {
        // The older rule is not shadowed: a collation with neither line is told about the trailer.
        assert_eq!(check_for(Verb::CallChair, A_RING), Err(Missing::NoTrailer));
    }

    #[test]
    fn l084_the_refusal_names_the_rule_the_file_and_the_keepers_words_and_returns_the_message() {
        let r = refusal_text(Verb::CallChair, Missing::NoOutputNext, COLLATION_NO_LINE);
        assert!(r.contains(RULE_FILE) && r.contains("WHAT A HAND-BACK OWES") && r.contains("item 6"), "{r}");
        assert!(r.contains("the next step comes from the output"), "the refusal does not carry the keeper's 2026-09-23 rule: {r}");
        assert!(r.contains("OUTPUT → NEXT: changed|unchanged — <why, from the output>"), "the refusal does not show the shape: {r}");
        assert!(r.contains(COLLATION_NO_LINE), "the message was not returned whole: {r}");
    }

    #[test]
    fn l084_each_new_reason_names_only_itself() {
        let reasons = [
            (Missing::NoOutputNext, "has no `OUTPUT → NEXT:` line"),
            (Missing::OutputNextNotBeforeTrailer, "not the line directly before"),
            (Missing::OutputNextNoVerdict, "does not begin with `changed` or `unchanged`"),
            (Missing::OutputNextNoWhy, "no reason from the output"),
        ];
        for (why, phrase) in reasons {
            let r = what_is_missing(why);
            assert!(r.contains(phrase), "{why:?}: {r}");
            for (other, p) in reasons {
                if other != why { assert!(!r.contains(p), "{why:?} also says {other:?}'s `{p}`"); }
            }
        }
    }

    #[test]
    fn a_ring_refusal_would_name_the_hand_back_rule_not_the_dispatch_rule() {
        // The text is written for whichever verb it is on, even though the policy delivers rings today — so a later
        // decision to refuse the return leg reads the right item.
        let r = refusal_text(Verb::CallLibrarian, Missing::NoTrailer, A_RING);
        assert!(r.contains("WHAT A HAND-BACK OWES"), "{r}");
    }
}
