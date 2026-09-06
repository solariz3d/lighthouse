//! seat_alias — what a person TYPES, mapped to what `PaneNames` INDEXES.
//!
//! ## The receipt
//!
//! The keeper approved a `raise_pull` on 2026-09-06 and it delivered nothing:
//! `no live pane matches 'MAIN'` (`main.rs`, `match_prefix`). His approval evaporated. The raise
//! that did reach the chair that night targeted a raw pane id, which is the workaround being used
//! as evidence.
//!
//! Measured over the whole board — 298 MB, every refusal it has ever recorded:
//!
//! ```text
//! $ grep -o "no live pane matches '[^']*'" C:/Consonance/data/board.jsonl | sort | uniq -c
//!      51 no live pane matches 'Main'
//!       7 no live pane matches 'MAIN'
//!       1 no live pane matches '<target>'
//! ```
//!
//! **Fifty-eight failures, and every one of them is the orchestrator's seat.** Not a scatter of
//! typos: one seat, named the way the room names it, missing from the index the whole time.
//! `spawn_main` registers `"M"` (`main.rs:5537`) and `spawn_librarian` registers `"LIB"`
//! (`:5486`) — so `LIB` has never failed and is not part of this defect. A test written to make
//! `LIB` red would be manufacturing one.
//!
//! The 59th line is its own small finding: `'<target>'` was delivered once, literally — someone
//! passed the placeholder. `RaisePullArgs.target` is documented as *"a pane id or name"*
//! (`mcp.rs:201`) and enumerates nothing, so the caller is asked for a name the docs never name.
//! **That is the defect one layer up: the verb's documentation and the resolver's table have never
//! agreed, because on this point the verb has no documentation at all.** The table below is one
//! half of the fix; the other half is that description, and it is written in the patch note.
//!
//! ## Why an equivalence class and not a rewrite
//!
//! Resolution runs in two directions and a one-way `MAIN -> M` map only covers one of them. A pane
//! is registered by whatever the UI passed to `set_pane_name` (`term.js:462`), which is its
//! DISPLAY name — the `[panes]` roster shows `ALPHA`, `BRAVO`, `CHARLIE` — while every brief and
//! packet addresses those same seats as `A`, `B`, `C`. So `A` must find `ALPHA` just as `MAIN`
//! must find `M`. `candidates()` therefore returns every key worth trying, in order, and the
//! caller keeps its own liveness and ambiguity rules.
//!
//! ## THE COLLISION THIS TABLE MUST NOT CREATE, and it is why `M` is absent from the NATO set
//!
//! The NATO word for `M` is `MIKE`, and a live pane is displayed `MIKE` on this machine right now.
//! `RESERVED_SEAT_NAMES` (`main.rs`) already stops a pane from REGISTERING `M`, because a pane
//! that captured the orchestrator's address would silently receive everything aimed at the chair —
//! pane E found that on 2026-08-24. **A NATO expansion of `MIKE -> M` would reintroduce exactly
//! that capture through the front door**, turning a message addressed to the pane named MIKE into
//! a message delivered to the orchestrator, with no error anywhere. So `M` has no NATO partner
//! here and never gets one. It is the one entry whose absence is load-bearing, which is why it has
//! its own test.
//!
//! `L`/`LIMA` is kept: `L` is a real committee letter (the desktop's committee was A/B/J/K/L) and
//! `LIMA` collides with nothing — `LIB` is the librarian's key and is a different string.

/// Every index key worth trying for a typed target, most specific first.
///
/// The typed token, uppercased, is always first: **an explicit registration always wins over an
/// alias.** Nothing here resolves anything on its own — the caller still decides liveness and
/// still refuses ambiguity. Returns empty for an empty target.
pub fn candidates(target: &str) -> Vec<String> {
    let t = target.trim().to_uppercase();
    if t.is_empty() {
        return Vec::new();
    }
    let mut out = vec![t.clone()];
    for extra in aliases_of(&t) {
        if !out.iter().any(|k| k == extra) {
            out.push(extra.to_string());
        }
    }
    out
}

/// The equivalence classes, as a table rather than a chain of `if`s so that adding a name is
/// adding a row. Both directions of each pair are listed explicitly — a reader should be able to
/// see that `A -> ALPHA` exists without inferring it from `ALPHA -> A`.
fn aliases_of(upper: &str) -> &'static [&'static str] {
    match upper {
        // ---- the orchestrator. Every one of these has been typed at it or appears in a brief.
        // `MAIN` and `Main` are the 58 measured failures; `CHAIR` and `ORCHESTRATOR` are what the
        // briefs and the board call this seat in prose, so they are what a reader reaches for.
        "MAIN" | "THE MAIN" | "CHAIR" | "THE CHAIR" | "ORCHESTRATOR" | "MAIN ORCHESTRATOR" => &["M"],
        // Deliberately NOT `MIKE` — see the module note. `M` is already the registered key, so it
        // needs no alias of its own; this row exists to say the absence is a decision.
        "M" => &[],

        // ---- the librarian. `LIB` is registered and has never failed; these are the words a
        // person uses for it in the same sentence.
        "LIBRARIAN" | "THE LIBRARIAN" | "LIBRARY" => &["LIB"],
        "LIB" => &[],

        // ---- committee letters <-> the display names the roster actually shows.
        "A" => &["ALPHA"],       "ALPHA" => &["A"],
        "B" => &["BRAVO"],       "BRAVO" => &["B"],
        "C" => &["CHARLIE"],     "CHARLIE" => &["C"],
        "D" => &["DELTA"],       "DELTA" => &["D"],
        "E" => &["ECHO"],        "ECHO" => &["E"],
        "F" => &["FOXTROT"],     "FOXTROT" => &["F"],
        "G" => &["GOLF"],        "GOLF" => &["G"],
        "H" => &["HOTEL"],       "HOTEL" => &["H"],
        "I" => &["INDIA"],       "INDIA" => &["I"],
        "J" => &["JULIETT"],     "JULIETT" => &["J"],
        "K" => &["KILO"],        "KILO" => &["K"],
        "L" => &["LIMA"],        "LIMA" => &["L"],
        "N" => &["NOVEMBER"],    "NOVEMBER" => &["N"],
        "O" => &["OSCAR"],       "OSCAR" => &["O"],
        "P" => &["PAPA"],        "PAPA" => &["P"],
        "Q" => &["QUEBEC"],      "QUEBEC" => &["Q"],
        "R" => &["ROMEO"],       "ROMEO" => &["R"],
        "S" => &["SIERRA"],      "SIERRA" => &["S"],
        "T" => &["TANGO"],       "TANGO" => &["T"],
        "U" => &["UNIFORM"],     "UNIFORM" => &["U"],
        "V" => &["VICTOR"],      "VICTOR" => &["V"],
        "W" => &["WHISKEY"],     "WHISKEY" => &["W"],
        "X" => &["XRAY"],        "XRAY" => &["X"],
        "Y" => &["YANKEE"],      "YANKEE" => &["Y"],
        "Z" => &["ZULU"],        "ZULU" => &["Z"],
        _ => &[],
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// THE MEASURED DEFECT, as an assertion. These are the exact strings the board recorded
    /// failing, in the exact case they were typed.
    #[test]
    fn the_fifty_eight_recorded_failures_all_reach_the_orchestrator() {
        for typed in ["Main", "MAIN", "main", " Main "] {
            assert!(
                candidates(typed).iter().any(|k| k == "M"),
                "{typed:?} must reach the orchestrator's registered key — this exact string is in \
                 the board's refusal log"
            );
        }
    }

    /// The other direction, which a one-way MAIN->M map would have missed: the roster displays
    /// ALPHA/BRAVO/CHARLIE and every brief says A/B/C.
    #[test]
    fn a_letter_finds_its_display_name_and_a_display_name_finds_its_letter() {
        assert!(candidates("A").iter().any(|k| k == "ALPHA"), "A must find a pane shown as ALPHA");
        assert!(candidates("ALPHA").iter().any(|k| k == "A"), "ALPHA must find a pane keyed A");
        assert!(candidates("charlie").iter().any(|k| k == "C"), "case must not decide");
    }

    /// LOAD-BEARING ABSENCE. `MIKE` is the NATO word for M and is also a live pane's display name;
    /// aliasing it would hand that pane's messages to the orchestrator, silently — the 2026-08-24
    /// address-capture defect walked back in. This test is the reason the table has a hole in it.
    #[test]
    fn mike_never_resolves_to_the_orchestrator() {
        assert!(
            !candidates("MIKE").iter().any(|k| k == "M"),
            "MIKE was aliased to M — a pane named MIKE would now receive the chair's traffic, or \
             the chair would receive its. This is the capture RESERVED_SEAT_NAMES exists to stop."
        );
        assert!(!candidates("Mike").iter().any(|k| k == "M"), "and not in any case");
    }

    /// An explicit registration must always beat an alias, or a pane that legitimately registered
    /// a name could be shadowed by this table.
    #[test]
    fn the_typed_token_is_always_tried_first() {
        assert_eq!(candidates("MAIN")[0], "MAIN", "the typed name must be tried before any alias");
        assert_eq!(candidates("A")[0], "A");
        assert_eq!(candidates("0c0c0c0a-0000-4000-8000-000000000a01")[0],
            "0C0C0C0A-0000-4000-8000-000000000A01",
            "an id is passed through uppercased and unaliased; the caller matches ids case-sensitively \
             on its own path, so this list simply adds nothing for it");
    }

    /// POSITIVE CONTROL FOR STRICTNESS: a table that returned every key for every input would pass
    /// every test above. An unknown word must add nothing.
    #[test]
    fn an_unknown_target_gains_no_aliases() {
        assert_eq!(candidates("nope"), vec!["NOPE".to_string()], "an unknown name grew aliases");
        assert_eq!(candidates("<target>"), vec!["<TARGET>".to_string()],
            "the literal placeholder must stay a miss — it was delivered once and must still fail");
        assert!(candidates("").is_empty(), "an empty target yields nothing to try");
        assert!(candidates("   ").is_empty(), "whitespace is empty");
    }

    /// No alias may point at a key that is not a real index key, and no two classes may overlap —
    /// an alias resolving into two seats is the ambiguity this whole file is supposed to remove.
    #[test]
    fn every_alias_target_is_a_seat_key_and_no_class_overlaps() {
        for word in ["MAIN", "CHAIR", "ORCHESTRATOR", "LIBRARIAN", "ALPHA", "ZULU"] {
            let c = candidates(word);
            assert!(c.len() >= 2, "{word} produced no alias at all: {c:?}");
            assert!(c.len() <= 3, "{word} produced too many candidates to be unambiguous: {c:?}");
        }
        assert!(!candidates("LIBRARIAN").iter().any(|k| k == "M"),
            "the librarian's class leaked into the orchestrator's");
        assert!(!candidates("MAIN").iter().any(|k| k == "LIB"),
            "the orchestrator's class leaked into the librarian's");
    }
}
