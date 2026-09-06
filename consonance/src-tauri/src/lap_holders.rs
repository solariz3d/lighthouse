//! WHOSE TURN IT IS, WHEN MORE THAN ONE LAP IS OPEN — the pure half of the baton guard.
//!
//! `chain_state_from` (main.rs) computes newest-per-lap, drops filed, sorts by time and returns
//! **the first row**. That is right for a one-line SENSOR — a UI shows one position — and it is
//! wrong for a GUARD, because the holder of one lap then silences a seat that is legitimately the
//! holder of another. The guard was never wrong about the holder. It was wrong about the lap.
//!
//! FOUR RECEIPTS, all the chair's, 2026-09-06 02:57–03:02, none of them with anyone out of turn:
//!   1. `chair_inject` to E refused — the librarian's legitimate L038 collation row (holder
//!      `librarian`) shadowed L040, where the chair WAS the holder.
//!   2. the L038 hand-off row refused.
//!   3. `chair_inject` to the librarian refused — L040's own row read `holder panes` after the
//!      chair had dispatched onto it.
//!   4. the dispatch of the packet that fixes this, refused by the thing it fixes.
//!
//! (3) IS A DEADLOCK AND NOT AN INCONVENIENCE, which is why this is a module and not a tweak: to
//! reach the librarian the chair must be the newest holder; becoming the newest holder shadows the
//! lap the panes are working and blocks their return path. **No ordering makes the correct
//! behaviour reachable.** The chair reached the board instead, which is not baton-gated.
//!
//! THE RULE IMPLEMENTED HERE IS THE WEAKER OF THE TWO THE PACKET NAMED, AND THE DIFFERENCE IS THE
//! FINDING — see `station_allows`. Not *"read the holder of the lap the verb is for"*: **no gated
//! verb carries a lap** (`ChairInjectArgs` = token/target/text; `CallLibrarianArgs` = text;
//! `CallChairArgs` = text). What is computable is *"refuse only when NO open lap has the caller as
//! holder"*, and that is strictly more permissive than the sentence it implements.
//!
//! Pure on purpose, like `seat_alias.rs` beside it: no control plane, no board, no disk. The
//! rows arrive already parsed so the whole matrix is testable, and so the ledger read stays in the
//! one place that already does it.

/// The holders of every OPEN lap — newest row per lap, `filed` laps dropped.
///
/// CARRIED FROM `chain_state_from`'s ORDER, NOT RE-DERIVED, and the order is the correctness:
/// newest-per-lap FIRST, then drop filed. Filtering `filed` out of the stream and then taking the
/// newest of what is left resurrects a finished lap from its own second-to-last row, and does it
/// silently — that row can never stop being the newest non-filed one, so the lap reads as open
/// forever. The comment is in main.rs; the bug it describes is one this function could reintroduce
/// by looking tidier.
///
/// Duplicates are kept out, but the ORDER of first appearance is preserved so a caller that wants
/// to name the lap it was allowed by can still find it. A row with no `holder` contributes
/// nothing: a lap that cannot say whose turn it is does not get to vote yes.
pub fn open_holders(rows: &[serde_json::Value]) -> Vec<String> {
    let mut newest: Vec<(String, &serde_json::Value)> = Vec::new();
    for r in rows {
        let (Some("chain"), Some(lap)) = (
            r.get("stage").and_then(|v| v.as_str()),
            r.get("lap").and_then(|v| v.as_str()),
        ) else {
            continue;
        };
        let at = r.get("at").and_then(|v| v.as_u64()).unwrap_or(0);
        match newest.iter_mut().find(|(l, _)| l == lap) {
            Some(slot) => {
                if at >= slot.1.get("at").and_then(|v| v.as_u64()).unwrap_or(0) {
                    slot.1 = r;
                }
            }
            None => newest.push((lap.to_string(), r)),
        }
    }
    let mut out: Vec<String> = Vec::new();
    for (_, r) in newest {
        if r.get("chain").and_then(|v| v.as_str()) == Some("filed") {
            continue;
        }
        if let Some(h) = r.get("holder").and_then(|v| v.as_str()) {
            if !out.iter().any(|k| k == h) {
                out.push(h.to_string());
            }
        }
    }
    out
}

/// Which holder a verb needs. Unchanged from `mcp.rs`; duplicated nowhere — the caller passes the
/// answer in, so this module never has to know the verb table and the table never has to move.
///
/// ALLOW WHEN *ANY* OPEN LAP HAS THE REQUIRED HOLDER.
///
/// **This is more permissive than the guard it replaces, and the amount is measurable rather than
/// arguable.** With one open lap it is identical. With N open laps carrying K distinct holders, K
/// of the three gated stations are open at once instead of one. On the ledger at the time of
/// writing — 3 open laps, holders `{panes: 2, chair: 1}` — it permits `chair_inject` AND
/// `call_librarian` simultaneously, and refuses `call_chair` because no open lap is held by the
/// librarian. **Two of three stations open where one was.**
///
/// That is the price of removing a deadlock, and it is paid knowingly. The strength of this guard
/// is now inversely proportional to how many laps are left open — so the guard's real enforcement
/// moved from this function to the discipline of FILING LAPS. Say that wherever it is cited; a
/// reader who assumes otherwise will trust a permit this cannot justify.
///
/// NO OPEN LAP MEANS EVERYTHING IS ALLOWED, unchanged: freestyle is not gated (`BUILDING.md`'s
/// cut), and that is the case that decides whether the first night after this ships looks like the
/// room is broken.
pub fn station_allows(required: Option<&str>, open: bool, holders: &[String]) -> bool {
    if !open {
        return true;
    }
    match required {
        None => true,
        Some(req) => holders.iter().any(|h| h == req),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn rows(lines: &[&str]) -> Vec<serde_json::Value> {
        lines.iter().map(|l| serde_json::from_str(l).unwrap()).collect()
    }
    fn h(v: &[&str]) -> Vec<String> {
        v.iter().map(|s| s.to_string()).collect()
    }

    // The four receipts, as ledger rows. L038 held by the panes, L040 held by the chair — the
    // shape of 2026-09-06 02:58 exactly.
    const L038_PANES: &str = r#"{"lap":"L038","stage":"chain","chain":"dispatched","holder":"panes","at":300}"#;
    const L040_CHAIR: &str = r#"{"lap":"L040","stage":"chain","chain":"dispatched","holder":"chair","at":200}"#;
    const L038_FILED: &str = r#"{"lap":"L038","stage":"chain","chain":"filed","holder":"chair","at":400}"#;
    const NOT_A_CHAIN_ROW: &str = r#"{"lap":"L038","stage":"open","at":100,"initiator":"chair"}"#;

    /// RED FIRST — receipt (3), and the only test that matters. One open lap held by the panes,
    /// another held by the chair, the chair calls a chair verb. The shipped guard refuses this:
    /// it reads the NEWEST row across all laps, which is `panes`, and `panes != chair`.
    #[test]
    fn the_chair_may_act_while_another_lap_is_held_by_the_panes() {
        let hs = open_holders(&rows(&[L040_CHAIR, L038_PANES]));
        assert!(
            station_allows(Some("chair"), true, &hs),
            "the chair holds L040 and was refused because the panes hold L038: {hs:?}"
        );
        // and the mirror, in the same breath: the panes' return path must stay open
        assert!(
            station_allows(Some("panes"), true, &hs),
            "the panes hold L038 and must not be shadowed by the chair's lap: {hs:?}"
        );
    }

    /// MUTANT 2 — revert to the newest-row-across-all-laps read. Modelled by handing the guard
    /// only the newest holder, which is what `chain_state()` returns today.
    #[test]
    fn newest_row_across_all_laps_is_the_defect() {
        let newest_only = h(&["panes"]); // L038 at 300 is newer than L040 at 200
        assert!(
            !station_allows(Some("chair"), true, &newest_only),
            "MUTANT 2 must be RED: reading one holder across all laps is the bug being fixed"
        );
    }

    /// MUTANT 3 — refuse nothing. The guard exists because seven out-of-turn refusals on
    /// 2026-09-03/04 were CORRECT; a false permit is not an improvement on a false refusal.
    #[test]
    fn a_station_no_open_lap_holds_is_still_refused() {
        let hs = open_holders(&rows(&[L040_CHAIR, L038_PANES]));
        assert!(
            !station_allows(Some("librarian"), true, &hs),
            "MUTANT 3 must be RED: no open lap is held by the librarian, so call_chair is refused"
        );
    }

    /// The order that is the whole correctness of `open_holders`: filed-last must win per lap,
    /// and a lap must not be resurrected from its second-to-last row.
    #[test]
    fn a_filed_lap_is_not_resurrected_by_an_earlier_row() {
        let hs = open_holders(&rows(&[L038_PANES, L038_FILED, L040_CHAIR]));
        assert_eq!(hs, h(&["chair"]), "L038 is filed; only L040 is open");
        assert!(!station_allows(Some("panes"), true, &hs));
    }

    /// A row that is not a chain row contributes no holder, and a lap with no holder does not
    /// vote yes — unknown never means allowed.
    #[test]
    fn unknown_is_not_yes() {
        assert!(open_holders(&rows(&[NOT_A_CHAIN_ROW])).is_empty());
        let no_holder: &str = r#"{"lap":"L041","stage":"chain","chain":"dispatched","at":500}"#;
        assert!(open_holders(&rows(&[no_holder])).is_empty());
        assert!(!station_allows(Some("chair"), true, &[]));
    }

    /// Freestyle is not gated, and a verb with no required station is never gated.
    #[test]
    fn no_open_lap_allows_everything() {
        assert!(station_allows(Some("chair"), false, &[]));
        assert!(station_allows(None, true, &h(&["panes"])));
    }

    /// The permissiveness this fix buys, pinned as a NUMBER so it cannot be forgotten: with the
    /// two distinct holders of 2026-09-06, two of the three gated stations are open at once.
    #[test]
    fn the_price_of_the_fix_is_two_stations_of_three() {
        let hs = open_holders(&rows(&[L040_CHAIR, L038_PANES]));
        let open_stations = ["chair", "panes", "librarian"]
            .iter()
            .filter(|s| station_allows(Some(s), true, &hs))
            .count();
        assert_eq!(open_stations, 2, "if this becomes 3 the guard is permitting everything");
    }
}
