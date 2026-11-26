// L247 same lap (chair 08:58Z): the turbo table by role, not letter. STAGE=A: the builder flag threaded through (still the letter table) and the
// new row, to be seen red; STAGE=B: the table by role, row 2 restated by role. Run from the lighthouse worktree root.
const fs = require('fs');
const p = 'consonance/src-tauri/src/main.rs';
let s = fs.readFileSync(p, 'utf8'); const crlf = s.includes('\r\n'); s = s.replace(/\r\n/g, '\n');
const once = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${n} matches for: ${a.slice(0, 90)}`); s = s.replace(a, () => b); };
const all = (a, b) => { const n = s.split(a).length - 1; if (n < 1) throw new Error(`no match for: ${a.slice(0, 90)}`); s = s.split(a).join(b); return n; };
if (process.env.STAGE === 'A') {
  once('fn seat_launch_from(raw: Option<&str>, pane_id: &str, letter: Option<&str>) -> SeatLaunch {', 'fn seat_launch_from(raw: Option<&str>, pane_id: &str, letter: Option<&str>, builder: bool) -> SeatLaunch {\n    let _ = builder;   // L247 STAGE A STUB');
  once('fn seat_launch(pane_id: &str) -> SeatLaunch {', 'fn seat_launch(pane_id: &str, builder: bool) -> SeatLaunch {');
  once('    let l = seat_launch_from(raw.as_deref(), pane_id, letter.as_deref());', '    let l = seat_launch_from(raw.as_deref(), pane_id, letter.as_deref(), builder);');
  once('    let launch = seat_launch(&pane_id);', '    let launch = seat_launch(&pane_id, is_managed_cwd(&cwd) && is_builder_dir_name(&cwd));');
  // the rows' calls: today's seats are not builders unless they are the lettered panes
  const n = all('seat_launch_from(raw.as_deref(), id, letter)', 'seat_launch_from(raw.as_deref(), id, letter, id.starts_with("pane-"))');
  all('seat_launch_from(Some(&raw), id, letter)', 'seat_launch_from(Some(&raw), id, letter, id.starts_with("pane-"))');
  once('let args = |id: &str, letter: Option<&str>| seat_launch_args(&seat_launch_from(Some(raw), id, letter));', 'let args = |id: &str, letter: Option<&str>| seat_launch_args(&seat_launch_from(Some(raw), id, letter, id.starts_with("pane-")));');
  once('seat_launch_args(&seat_launch_from(Some(bare), THIRD_PLACE_SID, None))', 'seat_launch_args(&seat_launch_from(Some(bare), THIRD_PLACE_SID, None, false))');
  once('assert!(seat_launch_from(Some(raw), "pane-a", Some("A")).from_table);', 'assert!(seat_launch_from(Some(raw), "pane-a", Some("A"), true).from_table);');
  once('let line = run_preset_refusal("pane-a", &seat_launch_from(Some(&raw), "pane-a", Some("A")).refused.unwrap());', 'let line = run_preset_refusal("pane-a", &seat_launch_from(Some(&raw), "pane-a", Some("A"), true).refused.unwrap());');
  once('let launch = body.find("let launch = seat_launch(&pane_id);").expect("spawn does not read seat_launch");', 'let launch = body.find("let launch = seat_launch(&pane_id, is_managed_cwd(&cwd) && is_builder_dir_name(&cwd));").expect("spawn does not read seat_launch by the pane\'s role");');
  // the new row
  once(`    /// Row 3: an unknown value runs as normal and is refused`, `    /// Row 2b (the chair, 08:58Z: "the turbo table goes by role, not by letter"): a committee pane the table names nowhere (O, P, any later
    /// letter) is a builder by its role and gets opus at xhigh under turbo; under normal it gets exactly today's argv. A seat that is not a builder
    /// (a fresh pane, a room) is not, whatever its letter.
    #[test]
    fn a_committee_pane_the_table_never_named_gets_turbo_by_its_role() {
        let models = r#""seat_models":{"O":"opus","P":"opus","Q":"sonnet"}"#;
        let v = |a: &[&str]| a.iter().map(|s| s.to_string()).collect::<Vec<_>>();
        let turbo = format!(r#"{{"run_preset":"turbo",{models}}}"#);
        for (id, letter) in [("pane-o", "O"), ("pane-p", "P"), ("pane-q", "Q"), ("pane-z9", "Z9")] {
            assert_eq!(seat_launch_args(&seat_launch_from(Some(&turbo), id, Some(letter), true)), v(&["--model", "opus", "--effort", "xhigh"]), "builder {letter} under turbo");
            for normal in [format!("{{{models}}}"), format!(r#"{{"run_preset":"normal",{models}}}"#)] {
                assert_eq!(seat_launch_args(&seat_launch_from(Some(&normal), id, Some(letter), true)), todays_args(Some(&normal), id, Some(letter)), "builder {letter} under normal");
            }
        }
        assert_eq!(seat_launch_args(&seat_launch_from(Some(&turbo), "fresh-1", Some("Q"), false)), v(&["--model", "sonnet"]), "not a builder: today's, whatever its letter");
    }

    /// Row 3: an unknown value runs as normal and is refused`);
  console.log('A: rows re-pointed', n);
} else if (process.env.STAGE === 'B') {
  once(`/// THE TURBO TABLE, the one place the preset's seats are named: (seat, model, effort). A seat is "main", "librarian", "third_place" or a
/// pane letter. A model of None keeps the seat's own seat_models entry (the Third Place: fable on his machines), or none.
const TURBO_SEATS: &[(&str, Option<&str>, &str)] = &[
    ("main", Some("fable"), "high"),
    ("librarian", Some("fable"), "high"),
    ("third_place", None, "high"),
    ("A", Some("opus"), "xhigh"),
    ("B", Some("opus"), "xhigh"),
    ("C", Some("opus"), "xhigh"),
    ("E", Some("opus"), "xhigh"),
];`, `/// THE TURBO TABLE, the one place the preset's seats are named: (role, model, effort). BY ROLE, NEVER BY LETTER (the chair, 2026-11-26 08:58Z:
/// he adds panes, O and P on L, and letters are assigned at spawn): "main", "librarian" and "third_place" are the fixed seats, known by their
/// session ids; "builder" is every committee pane, a managed seat in a \`sibling-\` folder (is_managed_cwd && is_builder_dir_name, the rule the
/// builder's no-prompt and floor settings use). A model of None keeps the seat's own seat_models entry (the Third Place: fable on his machines).
const TURBO_SEATS: &[(&str, Option<&str>, &str)] = &[
    ("main", Some("fable"), "high"),
    ("librarian", Some("fable"), "high"),
    ("third_place", None, "high"),
    ("builder", Some("opus"), "xhigh"),
];`);
  once('fn seat_launch_from(raw: Option<&str>, pane_id: &str, letter: Option<&str>, builder: bool) -> SeatLaunch {\n    let _ = builder;   // L247 STAGE A STUB', 'fn seat_launch_from(raw: Option<&str>, pane_id: &str, letter: Option<&str>, builder: bool) -> SeatLaunch {');
  once(`        let fixed = match pane_id {
            MAIN_SID => Some("main"),
            LIBRARIAN_SID => Some("librarian"),
            THIRD_PLACE_SID => Some("third_place"),
            _ => None,
        };
        if let Some(&(_, model, effort)) = [fixed, letter].into_iter().flatten().find_map(|k| TURBO_SEATS.iter().find(|row| row.0 == k)) {`, `        let role = match pane_id {
            MAIN_SID => Some("main"),
            LIBRARIAN_SID => Some("librarian"),
            THIRD_PLACE_SID => Some("third_place"),
            _ if builder => Some("builder"),
            _ => None,
        };
        if let Some(&(_, model, effort)) = role.and_then(|r| TURBO_SEATS.iter().find(|row| row.0 == r)) {`);
  // row 2, restated by role: the seat that is not a builder now (pane-d was a lettered pane the table did not name)
  once(`        assert_eq!(args("pane-d", Some("D")), v(&["--model", "haiku"]), "a seat the table does not name: today's (its seat_models, no effort)");`,
    `        assert_eq!(seat_launch_args(&seat_launch_from(Some(raw), "fresh-d", Some("D"), false)), v(&["--model", "haiku"]), "a seat with no turbo role (not a builder): today's (its seat_models, no effort)");`);
  once(`        // the table is the one place, and every effort in it is one claude takes`, `        assert_eq!(TURBO_SEATS.iter().filter(|r| r.0.len() == 1).count(), 0, "no letter in the table (the chair, 08:58Z: by role)");
        // the table is the one place, and every effort in it is one claude takes`);
  console.log('B ok');
} else throw new Error('STAGE=A or B');
fs.writeFileSync(p, crlf ? s.replace(/\n/g, '\r\n') : s);
