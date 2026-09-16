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
    }
}

/// The refusal a seat reads. It names the rule, the file and the missing part, shows the shape, and RETURNS THE
/// MESSAGE WHOLE — so a refusal can never be the place a message is lost.
pub fn refusal_text(verb: Verb, why: Missing, message: &str) -> String {
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

    #[test]
    fn a_ring_refusal_would_name_the_hand_back_rule_not_the_dispatch_rule() {
        // The text is written for whichever verb it is on, even though the policy delivers rings today — so a later
        // decision to refuse the return leg reads the right item.
        let r = refusal_text(Verb::CallLibrarian, Missing::NoTrailer, A_RING);
        assert!(r.contains("WHAT A HAND-BACK OWES"), "{r}");
    }
}
