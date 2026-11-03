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
/// of the three gated stations are open at once instead of one.
///
/// ~~On the ledger at the time of writing — 3 open laps, holders `{panes: 2, chair: 1}` — it
/// permits `chair_inject` AND `call_librarian` simultaneously, and refuses `call_chair` because no
/// open lap is held by the librarian. **Two of three stations open where one was.**~~
///
/// **DATED IN PLACE 2026-09-08 (L044, pane A — the seat that wrote it). The wording is kept; the
/// PRESENT TENSE is withdrawn.** That paragraph read as a live property of the system and was a
/// reading of one ledger at one moment (2026-09-06, when this module landed in `70d5993`). It is
/// the 2026-08-17 carrier law's own case — *mark the carriers, leave the traces* — and the
/// paragraph immediately below already says why it could not stay true: the strength of this guard
/// is inversely proportional to how many laps are left open, so its every number moves with the
/// filing discipline. A measurement written in the present tense inside a doc comment has no way to
/// go stale loudly.
///
/// **Re-derive rather than trust it.** The ledger is machine-local, so there is no correct number
/// to hardcode here — only a command:
///
/// ```text
/// node -e "const fs=require('fs');const rows=fs.readFileSync('C:/Consonance/data/lap.jsonl','utf8')
///   .split('\n').filter(Boolean).map(l=>{try{return JSON.parse(l)}catch{return null}}).filter(Boolean);
///   const n=new Map();for(const r of rows){if(r.stage!=='chain'||!r.lap)continue;const p=n.get(r.lap);
///   if(!p||(r.at||0)>=(p.at||0))n.set(r.lap,r);}const o=[...n.values()].filter(r=>r.chain!=='filed');
///   const h={};for(const r of o)h[r.holder||'(none)']=(h[r.holder||'(none)']||0)+1;
///   console.log(o.length,JSON.stringify(h));"
/// ```
///
/// **Run on this laptop 2026-09-08 01:5x it returned `1 {"panes":1}`** — one open lap, so the
/// struck sentence's headline is FALSE today: with K = 1 this guard is *identical* to the one it
/// replaced, which is the degenerate case the sentence above it already names. Both readings are
/// correct about their own day and neither is a property of the code. The tests below are the
/// part that does not move: every number in them comes from a fixture in this file.
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

// ── D621: A DISPATCH IS CHECKED AGAINST THE LAP IT SERVES ────────────────────────────────────────
//
// THE CASE (p-d620-stale-laps-O_2026-11-02.md, "Why so many laps stayed open"). The rule above lets
// `chair_inject` through only while SOME open lap is held by the chair. With every open lap in
// `working` (holder `panes`), the chair could dispatch nothing, so before each dispatch it re-took
// EVERY working lap and handed them all back: 41 laps carried the same "retake to …" rows, and a lap
// re-stamped every few hours never reads as stale. The guard was not wrong about whose turn it was;
// it could not tell which lap a dispatch was for, because no gated verb carried one (the module's
// own note above). `chair_inject` now does: an optional `lap` argument, else the packet's own
// "Ledger Dnnn" line, else the first lap id in it (`lap_of_text`).
//
// THE PROTECTION KEPT: a dispatch that names a lap another station holds is refused. That is the
// out-of-turn ring the rule exists for, a ring into the pane working that lap. A dispatch that names
// NO lap keeps the old rule above, unchanged.

/// Where a lap stands on the ledger: never seen, filed, or open with its newest holder (None when that
/// row carries none). Newest chain row per lap, as `open_holders` reads it.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum LapState {
    Unknown,
    Filed,
    Open(Option<String>),
}

pub fn lap_state(rows: &[serde_json::Value], lap: &str) -> LapState {
    let mut newest: Option<&serde_json::Value> = None;
    for r in rows {
        if r.get("stage").and_then(|v| v.as_str()) != Some("chain") || r.get("lap").and_then(|v| v.as_str()) != Some(lap) {
            continue;
        }
        let at = r.get("at").and_then(|v| v.as_u64()).unwrap_or(0);
        if newest.map_or(true, |n| at >= n.get("at").and_then(|v| v.as_u64()).unwrap_or(0)) {
            newest = Some(r);
        }
    }
    match newest {
        None => LapState::Unknown,
        Some(r) if r.get("chain").and_then(|v| v.as_str()) == Some("filed") => LapState::Filed,
        Some(r) => LapState::Open(r.get("holder").and_then(|v| v.as_str()).map(|s| s.to_string())),
    }
}

/// A lap id: `D` or `L` and three to five digits, the ledger's own shape (L001, D620).
fn is_lap_id(w: &str) -> bool {
    let mut c = w.chars();
    matches!(c.next(), Some('D') | Some('L')) && { let d: Vec<char> = c.collect(); (3..=5).contains(&d.len()) && d.iter().all(|x| x.is_ascii_digit()) }
}

/// How a call came to name its lap. NAMED: the explicit `lap` argument or the packet's "Ledger Dnnn"
/// line, a statement of which lap the call serves. INFERRED: the first lap id anywhere in the text, which
/// may be a lap the packet only mentions ("D615 is done; also …") or a typo, so it is trusted only for
/// what the ledger shows OPEN (D621 bounce, the librarian 2026-11-02 18:19).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum LapSource {
    Named,
    Inferred,
}

/// The lap a dispatch's text serves: the id after "Ledger " when the packet has that line (a packet
/// often names the lap it closes before the one it opens: "D620 collated … Ledger D621: …"), NAMED;
/// else the first lap id in the text, INFERRED. None when it names none.
pub fn lap_of_text(text: &str) -> Option<(String, LapSource)> {
    let words: Vec<&str> = text.split(|c: char| !(c.is_ascii_alphanumeric())).filter(|w| !w.is_empty()).collect();
    for (i, w) in words.iter().enumerate() {
        if w.eq_ignore_ascii_case("ledger") {
            if let Some(n) = words.get(i + 1) {
                if is_lap_id(n) {
                    return Some((n.to_string(), LapSource::Named));
                }
            }
        }
    }
    words.iter().find(|w| is_lap_id(w)).map(|w| (w.to_string(), LapSource::Inferred))
}

/// The gate for a verb whose call names the lap it serves. `lap` None: the old rule (`station_allows`).
/// A lap that is open is the caller's only if its holder IS the required station; a lap never seen
/// (a new lap whose rows the chair has not written yet) or filed (a word after the lap closed) is no
/// one's mid-lap, so it does not refuse, but only when the call NAMED it; an INFERRED lap that is not
/// open says nothing about where the call lands, so the old rule decides.
pub fn station_allows_for_lap(required: Option<&str>, open: bool, holders: &[String], lap: Option<(&LapState, LapSource)>) -> bool {
    let Some(req) = required else { return true };
    match lap {
        None => station_allows(Some(req), open, holders),
        Some((LapState::Open(h), _)) => h.as_deref() == Some(req),
        Some((LapState::Unknown | LapState::Filed, LapSource::Named)) => true,
        Some((LapState::Unknown | LapState::Filed, LapSource::Inferred)) => station_allows(Some(req), open, holders),
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

    // ── D621: the lap a dispatch serves ──────────────────────────────────────────────────────

    const Y_PANES: &str = r#"{"lap":"D617","stage":"chain","chain":"working","holder":"panes","at":20}"#;
    const X_CHAIR: &str = r#"{"lap":"D621","stage":"chain","chain":"dispatched","holder":"chair","at":30}"#;
    const W_FILED: &str = r#"{"lap":"D613","stage":"chain","chain":"filed","holder":"chair","at":10}"#;

    #[test]
    fn a_dispatch_names_its_lap_by_its_ledger_line_first() {
        // amended (D621 bounce): the lap now carries how it was found, Named by the Ledger line, Inferred otherwise
        assert_eq!(lap_of_text("D620 collated (librarian 17:57). Ledger D621: the TWO BOOKKEEPING BUGS"), Some(("D621".into(), LapSource::Named)));
        assert_eq!(lap_of_text("D606 GO: LAND AND RELEASE 0.4.37"), Some(("D606".into(), LapSource::Inferred)));
        assert_eq!(lap_of_text("Ledger L042, the loop"), Some(("L042".into(), LapSource::Named)));
        assert_eq!(lap_of_text("no lap here, 0.4.38 and D61 and DX621"), None, "too short or not a lap id");
        assert_eq!(lap_of_text(""), None);
    }

    #[test]
    fn lap_state_reads_the_newest_chain_row_of_that_lap() {
        let r = rows(&[Y_PANES, X_CHAIR, W_FILED]);
        assert_eq!(lap_state(&r, "D617"), LapState::Open(Some("panes".into())));
        assert_eq!(lap_state(&r, "D621"), LapState::Open(Some("chair".into())));
        assert_eq!(lap_state(&r, "D613"), LapState::Filed);
        assert_eq!(lap_state(&r, "D999"), LapState::Unknown);
    }

    /// RED on the old rule, the D620 case: lap Y is held by the panes and the chair dispatches lap X.
    #[test]
    fn a_dispatch_for_lap_x_is_allowed_while_the_panes_hold_lap_y() {
        let r = rows(&[Y_PANES]);
        let hs = open_holders(&r);
        assert!(!station_allows(Some("chair"), true, &hs), "control: the old rule refuses, so the chair re-took every working lap");
        // amended (D621 bounce): new and filed laps pass when NAMED; the inferred cases are the rows at the end
        // a new lap the chair is about to write rows for
        assert!(station_allows_for_lap(Some("chair"), true, &hs, Some((&lap_state(&r, "D621"), LapSource::Named))));
        // a lap the chair holds, beside the panes' lap
        let r2 = rows(&[Y_PANES, X_CHAIR]);
        assert!(station_allows_for_lap(Some("chair"), true, &open_holders(&r2), Some((&lap_state(&r2, "D621"), LapSource::Inferred))));
        // a word on a filed lap
        let r3 = rows(&[Y_PANES, W_FILED]);
        assert!(station_allows_for_lap(Some("chair"), true, &open_holders(&r3), Some((&lap_state(&r3, "D613"), LapSource::Named))));
    }

    /// The protection kept: a ring into the lap another station holds is refused, whatever else is open.
    #[test]
    fn a_ring_into_a_lap_another_station_holds_is_still_refused() {
        let r = rows(&[Y_PANES, X_CHAIR]);
        assert!(!station_allows_for_lap(Some("chair"), true, &open_holders(&r), Some((&lap_state(&r, "D617"), LapSource::Named))),
            "the panes hold D617: a ring into it mid-lap is out of turn even while the chair holds D621");
        let held = rows(&[r#"{"lap":"D617","stage":"chain","chain":"handbacks-in","holder":"librarian","at":40}"#]);
        assert!(!station_allows_for_lap(Some("chair"), true, &open_holders(&held), Some((&lap_state(&held, "D617"), LapSource::Named))));
        let holderless = rows(&[r#"{"lap":"D617","stage":"chain","chain":"working","at":40}"#]);
        assert!(!station_allows_for_lap(Some("chair"), true, &open_holders(&holderless), Some((&lap_state(&holderless, "D617"), LapSource::Named))),
            "a lap that cannot say whose turn it is does not vote yes");
    }

    /// A dispatch that names no lap keeps the old rule exactly.
    #[test]
    fn a_dispatch_naming_no_lap_keeps_the_old_rule() {
        let hs = open_holders(&rows(&[Y_PANES]));
        assert_eq!(station_allows_for_lap(Some("chair"), true, &hs, None), station_allows(Some("chair"), true, &hs));
        assert!(station_allows_for_lap(Some("chair"), false, &[], None), "no open lap: everything is allowed");
        assert!(station_allows_for_lap(None, true, &hs, Some((&LapState::Open(Some("panes".into())), LapSource::Named))), "an ungated verb");
    }

    // ── D621 bounce: a lap read from free text must not open the gate ───────────────────────
    // The gate as `mcp.rs` `chair_inject` composes it: the explicit `lap` argument, else the packet's lap.
    const D614_CHAIR: &str = r#"{"lap":"D614","stage":"chain","chain":"dispatched","holder":"chair","at":50}"#;
    const D614_PANES: &str = r#"{"lap":"D614","stage":"chain","chain":"working","holder":"panes","at":50}"#;

    fn gate(lines: &[&str], text: &str, explicit: Option<&str>) -> bool {
        let r = rows(lines);
        let lap = explicit.map(|l| (l.to_string(), LapSource::Named)).or_else(|| lap_of_text(text));
        let st = lap.map(|(l, s)| (lap_state(&r, &l), s));
        station_allows_for_lap(Some("chair"), true, &open_holders(&r), st.as_ref().map(|(st, s)| (st, *s)))
    }

    #[test]
    fn an_explicit_lap_argument_naming_a_filed_or_new_lap_is_allowed() {
        assert!(gate(&[Y_PANES, W_FILED], "D617 note", Some("D613")), "filed, named by the argument");
        assert!(gate(&[Y_PANES], "D617 note", Some("D999")), "not on the ledger yet, named by the argument");
    }

    #[test]
    fn a_ledger_line_naming_a_filed_or_new_lap_is_allowed() {
        assert!(gate(&[Y_PANES, W_FILED], "D617 checked; Ledger D613: a word after it closed", None));
        assert!(gate(&[Y_PANES], "D617 checked; Ledger D999: a new lap", None));
    }

    /// RED at 5c1aa36e: "D613 is done; also …" passed into the panes' lap because D613 is filed.
    #[test]
    fn free_text_naming_a_filed_lap_falls_back_to_the_old_rule() {
        assert!(!gate(&[Y_PANES, W_FILED], "D613 is done; also, one more thing for the pane", None),
            "the chair holds nothing and the panes hold D617: the old rule refuses");
        assert!(gate(&[Y_PANES, W_FILED, X_CHAIR], "D613 is done; also, one more thing", None),
            "the old rule allows while the chair holds some lap");
    }

    /// RED at 5c1aa36e: a mistyped id is Unknown, and Unknown passed.
    #[test]
    fn free_text_naming_a_lap_not_on_the_ledger_falls_back_to_the_old_rule() {
        assert!(!gate(&[Y_PANES], "D6177 GO: the typo of D617", None));
        assert!(!gate(&[Y_PANES], "D916 is the next one", None));
    }

    #[test]
    fn free_text_naming_an_open_lap_counts() {
        assert!(gate(&[Y_PANES, X_CHAIR], "D621 GO: the fix", None), "open and held by the chair");
        assert!(!gate(&[Y_PANES, X_CHAIR], "D617 one more thing", None), "open and held by the panes");
    }

    /// The librarian's own packet shape: a filed lap first, then "Ledger" an open one. The Ledger lap decides.
    #[test]
    fn a_packet_naming_a_filed_lap_then_ledger_an_open_one_is_decided_by_the_ledger_lap() {
        assert!(gate(&[W_FILED, Y_PANES, D614_CHAIR], "D613 checked, all clean; Ledger D614: the next build", None));
        assert!(!gate(&[W_FILED, D614_PANES], "D613 checked, all clean; Ledger D614: the next build", None),
            "D614 is the panes': refused, though D613 named first is filed");
    }
}
