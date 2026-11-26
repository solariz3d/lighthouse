// L247 same lap (chair 09:00Z): Main on opus at xhigh, and the birth-order row. STAGE=C: the table and the row (the row red: the order is not
// fixed yet); STAGE=D: the letter claimed before the first spawn in spawn_sibling, spawn_fresh and new_room. Run from the lighthouse worktree root.
const fs = require('fs');
const p = 'consonance/src-tauri/src/main.rs';
let s = fs.readFileSync(p, 'utf8'); const crlf = s.includes('\r\n'); s = s.replace(/\r\n/g, '\n');
const once = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${n} matches for: ${a.slice(0, 90)}`); s = s.replace(a, () => b); };
if (process.env.STAGE === 'C') {
  once(`    ("main", Some("fable"), "high"),\n    ("librarian", Some("fable"), "high"),`,
    `    ("main", Some("opus"), "xhigh"),   // his words, 2026-11-26 03:00: Fable for the orchestrator was too expensive\n    ("librarian", Some("fable"), "high"),`);
  once(`        assert_eq!(args(MAIN_SID, None), v(&["--model", "fable", "--effort", "high"]), "the orchestrator: fable at high, over its seat_models entry");`,
    `        assert_eq!(args(MAIN_SID, None), v(&["--model", "opus", "--effort", "xhigh"]), "the orchestrator: opus at xhigh (his 03:00 words), over its seat_models entry");`);
  once(`    /// Row 3: an unknown value runs as normal and is refused`, `    /// Row 5 (the chair, 09:00Z: O and P were born on L with no SEAT MODEL line): a pane is born with its letter ALREADY claimed, so its very
    /// first spawn finds its seat_models entry and, under turbo, its role's effort. pane_letter comes before spawn_claude_pane in every birth.
    #[test]
    fn a_newborn_pane_has_its_letter_before_its_first_spawn() {
        let models = r#"{"seat_models":{"O":"opus"}}"#;
        assert_eq!(seat_launch_args(&seat_launch_from(Some(models), "pane-o", None, true)), Vec::<String>::new(), "control: with no letter yet the seat's model is missed (what O and P got)");
        assert_eq!(seat_launch_args(&seat_launch_from(Some(models), "pane-o", Some("O"), true)), vec!["--model".to_string(), "opus".to_string()]);
        let src = fs::read_to_string("src/main.rs").expect("read own source").replace("\\r\\n", "\\n");
        let body_of = |sig: &str| {
            let f = src.split(sig).nth(1).unwrap_or_else(|| panic!("{sig} moved"));
            f.split("\\n}\\n").next().unwrap_or(f).to_string()
        };
        for sig in ["fn spawn_sibling(", "fn spawn_fresh(", "fn new_room("] {
            let b = body_of(sig);
            let letter = b.find("let letter = pane_letter(&pane_id);").unwrap_or_else(|| panic!("{sig}: no letter claim"));
            let spawn = b.find("spawn_claude_pane(").unwrap_or_else(|| panic!("{sig}: no spawn"));
            assert!(letter < spawn, "{sig}: the letter is claimed after the first spawn, so that spawn reads no letter");
            assert_eq!(b.matches("pane_letter(").count(), 1, "{sig}: one claim");
        }
        // the spawn reads the registry pane_letter writes
        assert!(body_of("fn seat_launch(pane_id: &str").contains("read_letters().get(pane_id)"));
        assert!(body_of("fn pane_letter(pane: &str)").contains("fs::write(letters_path(), s)"));
    }

    /// Row 3: an unknown value runs as normal and is refused`);
  // the Settings text, by role
  const h = 'consonance/ui/index.html'; let t = fs.readFileSync(h, 'utf8');
  const a = 'Turbo: panes A, B, C and E on Opus at xhigh effort; the orchestrator and the librarian on Fable at high; the Third Place at high';
  if (t.split(a).length !== 2) throw new Error('ui text');
  fs.writeFileSync(h, t.replace(a, () => 'Turbo: every builder pane and the orchestrator on Opus at xhigh effort; the librarian and the Third Place on Fable at high'));
  console.log('C ok');
} else if (process.env.STAGE === 'D') {
  // spawn_sibling
  once(`    let cwd = prepare_sibling_dir()?;
    let pane_id = Uuid::new_v4().to_string();
    let session = spawn_claude_pane(`, `    let cwd = prepare_sibling_dir()?;
    let pane_id = Uuid::new_v4().to_string();
    // claim the letter at birth, not at first render: it is the pane's identity on every
    // surface (pulls, dyad inputs, the digest), so it must exist before anything can ask.
    // L247 (the chair, 09:00Z): and BEFORE the first spawn, which reads it for the seat's model and the run preset's role.
    // O and P were born on L with no SEAT MODEL line, because the letter came 13 lines after the spawn.
    let letter = pane_letter(&pane_id);
    let session = spawn_claude_pane(`);
  once(`    write_kept(&kept);
    // claim the letter at birth, not at first render: it is the pane's identity on every
    // surface (pulls, dyad inputs, the digest), so it must exist before anything can ask.
    let letter = pane_letter(&pane_id);
    plog(&format!("born-kept sibling`, `    write_kept(&kept);
    plog(&format!("born-kept sibling`);
  // spawn_fresh
  once(`    let cwd = prepare_fresh_dir()?;
    let pane_id = Uuid::new_v4().to_string();`, `    let cwd = prepare_fresh_dir()?;
    let pane_id = Uuid::new_v4().to_string();
    let letter = pane_letter(&pane_id);   // L247: before the first spawn, which reads it for the seat's model (spawn_sibling says why)`);
  once(`    write_kept(&kept);
    let letter = pane_letter(&pane_id);
    plog(&format!("born-kept fresh`, `    write_kept(&kept);
    plog(&format!("born-kept fresh`);
  // new_room
  once(`    set_workspace_trust(&cwd);
    let pane_id = Uuid::new_v4().to_string();`, `    set_workspace_trust(&cwd);
    let pane_id = Uuid::new_v4().to_string();
    let letter = pane_letter(&pane_id);   // L247: before the first spawn, which reads it for the seat's model (spawn_sibling says why)`);
  once(`    write_kept(&kept);
    let letter = pane_letter(&pane_id);
    plog(&format!("room opened`, `    write_kept(&kept);
    plog(&format!("room opened`);
  console.log('D ok');
} else throw new Error('STAGE=C or D');
fs.writeFileSync(p, crlf ? s.replace(/\n/g, '\r\n') : s);
