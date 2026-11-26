
// ── pane C, L247 read (2026-11-26): rows that vary what pane A ran. Appended to main.rs in pane C's own detached worktree at
// 72d88e09 for the run only; never committed to the builder. Every row is pure on text handed in: no row reads or writes his
// ~/.consonance.json, letters.json or panes.json (no pane_letter, no data_dir, no seat_launch).
#[cfg(test)]
mod c_l247_read_tests {
    use super::*;

    fn v(a: &[&str]) -> Vec<String> {
        a.iter().map(|s| s.to_string()).collect()
    }

    /// 1f00fe9a's `seat_model`, verbatim but for its two reads (the config text and the letter are handed in) and its plog line.
    /// seat_model_named and plain_model_name are unchanged between 1f00fe9a and 72d88e09 (git diff: only seat_model_from's comment moved).
    fn old_seat_model(raw: Option<&str>, pane_id: &str, letter: Option<&str>) -> Option<String> {
        let raw = raw?;
        if !raw.contains("seat_models") {
            return None;
        }
        let named = seat_model_named(raw, pane_id, letter)?;
        if plain_model_name(&named) {
            Some(named)
        } else {
            None
        }
    }
    /// 1f00fe9a's model arguments: spawn_claude_pane added `--model <m>` and nothing else.
    fn old_args(raw: Option<&str>, pane_id: &str, letter: Option<&str>) -> Vec<String> {
        old_seat_model(raw, pane_id, letter).map(|m| vec!["--model".to_string(), m]).unwrap_or_default()
    }
    /// 72d88e09's model and effort arguments, with seat_launch's own gate on reading the letter (the config names seat_models or run_preset).
    fn new_args(raw: Option<&str>, pane_id: &str, letter: Option<&str>, builder: bool) -> Vec<String> {
        let letter = match raw {
            Some(r) if r.contains("seat_models") || r.contains("run_preset") => letter,
            _ => None,
        };
        seat_launch_args(&seat_launch_from(raw, pane_id, letter, builder))
    }

    const C_UUID: &str = "0845a868-38f2-4cc2-b45a-431e0c088fb1";
    /// (name, session id, letter, builder by the spawn's own rule, the folder its path births it in)
    fn seats() -> Vec<(&'static str, &'static str, Option<&'static str>, bool)> {
        vec![
            ("main", MAIN_SID, None, false),
            ("librarian", LIBRARIAN_SID, Some("M"), false),
            ("third_place", THIRD_PLACE_SID, Some("N"), false),
            ("builder A", "6fe15f0a-0000-4000-8000-000000000001", Some("A"), true),
            ("builder C", C_UUID, Some("C"), true),
            ("builder O", "8bcb0f46-0000-4000-8000-000000000002", Some("O"), true),
            ("builder P", "6e6e002c-0000-4000-8000-000000000003", Some("P"), true),
            ("builder Q (never named)", "aaaaaaaa-0000-4000-8000-000000000004", Some("Q"), true),
            ("builder newborn, no letter", "bbbbbbbb-0000-4000-8000-000000000005", None, true),
            ("fresh", "cccccccc-0000-4000-8000-000000000006", Some("F"), false),
            ("room", "dddddddd-0000-4000-8000-000000000007", Some("R"), false),
            ("body", "eeeeeeee-0000-4000-8000-000000000008", None, false),
            ("pty", "ffffffff-0000-4000-8000-000000000009", None, false),
        ]
    }

    /// An object with its keys in exactly this order (serde_json's Map here sorts, so the text is built by hand).
    fn obj(pairs: &[(String, String)], pretty: bool) -> String {
        let sep = if pretty { ",\r\n  " } else { "," };
        let body = pairs.iter().map(|(k, val)| format!("\"{k}\":{}{val}", if pretty { " " } else { "" })).collect::<Vec<_>>().join(sep);
        if pretty { format!("{{\r\n  {body}\r\n}}") } else { format!("{{{body}}}") }
    }

    /// His file's top-level key names in his file's order (read at 09:1xZ, values not copied), with placeholder values, and his
    /// seat_models entries in his order: main, third_place, librarian, A, B, C, E, O, P.
    fn his_keys(preset: Option<&str>) -> Vec<(String, String)> {
        let mut k: Vec<(String, String)> = vec![
            ("seat_models".into(), String::new()),
            ("base".into(), "\"x\"".into()),
            ("flags".into(), "\"\"".into()),
            ("instances".into(), "[]".into()),
            ("room_path".into(), "\"R\"".into()),
            ("instances_dir".into(), "\"I\"".into()),
            ("data_dir".into(), "\"D\"".into()),
            ("ambient_lat".into(), "\"0\"".into()),
            ("ambient_lon".into(), "\"0\"".into()),
            ("ambient_label".into(), "\"run_preset seat_models\"".into()),
            ("ambient_tz".into(), "\"UTC\"".into()),
            ("machine_tag".into(), "\"L\"".into()),
            ("state_dir".into(), "\"S\"".into()),
            ("cut_at_handback".into(), "[\"A\",\"B\",\"C\",\"E\"]".into()),
        ];
        if let Some(p) = preset {
            k.push(("run_preset".into(), p.to_string()));
        }
        k
    }
    fn his_models() -> Vec<(String, String)> {
        ["main:opus", "third_place:fable", "librarian:opus", "A:opus", "B:opus", "C:opus", "E:opus", "O:opus", "P:opus"]
            .iter()
            .map(|s| {
                let (a, b) = s.split_once(':').unwrap();
                (a.to_string(), format!("\"{b}\""))
            })
            .collect()
    }

    /// Every ordering this row tries: his order, reversed, the preset first, seat_models last, and four rotations; each with the
    /// seat_models entries in his order, reversed, and sorted; each compact, pretty with CRLF, and pretty behind a BOM.
    fn orderings(preset: Option<&str>) -> Vec<String> {
        let mut out = Vec::new();
        let models = his_models();
        let mut model_orders = vec![models.clone(), models.iter().rev().cloned().collect::<Vec<_>>()];
        let mut sorted = models.clone();
        sorted.sort();
        model_orders.push(sorted);
        for mo in &model_orders {
            let base = his_keys(preset);
            let mut tops: Vec<Vec<(String, String)>> = vec![base.clone(), base.iter().rev().cloned().collect()];
            let mut pf = base.clone();
            if let Some(i) = pf.iter().position(|(k, _)| k == "run_preset") {
                let x = pf.remove(i);
                pf.insert(0, x);
            }
            tops.push(pf);
            let mut sl = base.clone();
            let x = sl.remove(0);
            sl.push(x);
            tops.push(sl);
            for r in [3usize, 5, 7, 11] {
                let mut t = base.clone();
                let len = t.len();
                t.rotate_left(r % len);
                tops.push(t);
            }
            for t in tops {
                let filled: Vec<(String, String)> =
                    t.into_iter().map(|(k, val)| if k == "seat_models" { (k, obj(mo, false)) } else { (k, val) }).collect();
                out.push(obj(&filled, false));
                out.push(obj(&filled, true));
                out.push(format!("\u{feff}{}", obj(&filled, true)));
            }
        }
        out
    }

    /// K1 (the chair's item 1): each seat role's argv under Normal and Turbo is the same whatever order the config's keys are in, and
    /// is what the table names.
    #[test]
    fn k1_key_order_does_not_move_any_seats_argv() {
        let mut count = 0usize;
        for (label, preset) in [("missing", None), ("normal", Some("\"normal\"")), ("empty", Some("\"\"")), ("turbo", Some("\"turbo\""))] {
            let configs = orderings(preset);
            for (name, id, letter, builder) in seats() {
                let first = new_args(Some(&configs[0]), id, letter, builder);
                for c in &configs {
                    assert_eq!(new_args(Some(c), id, letter, builder), first, "{label} {name}: argv moved with the key order\n{c}");
                    count += 1;
                }
                let want: Vec<String> = match (label, name) {
                    ("turbo", "main") => v(&["--model", "opus", "--effort", "xhigh"]),
                    ("turbo", "librarian") => v(&["--model", "fable", "--effort", "high"]),
                    ("turbo", "third_place") => v(&["--model", "fable", "--effort", "high"]),
                    ("turbo", n) if n.starts_with("builder") => v(&["--model", "opus", "--effort", "xhigh"]),
                    _ => old_args(Some(&configs[0]), id, letter),
                };
                assert_eq!(first, want, "{label} {name}");
                eprintln!("K1 {label:8} {name:28} {}", first.join(" "));
            }
        }
        eprintln!("K1 cases: {count}");
    }

    /// K2 (item 2): the Third Place under Turbo with a seat_models entry, named every way seat_models can name it.
    #[test]
    fn k2_the_third_place_under_turbo_stays_on_its_entry_at_high() {
        let tp = |models: &str| {
            let raw = format!(r#"{{"run_preset":"turbo","seat_models":{models}}}"#);
            (new_args(Some(&raw), THIRD_PLACE_SID, Some("N"), false), new_args(Some(&raw), THIRD_PLACE_SID, Some("N"), true))
        };
        let fable_high = v(&["--model", "fable", "--effort", "high"]);
        for m in [
            r#"{"third_place":"fable"}"#.to_string(),
            format!(r#"{{"{THIRD_PLACE_SID}":"fable"}}"#),
            r#"{"N":"fable"}"#.to_string(),
            r#"{"main":"opus","librarian":"opus","third_place":" fable ","A":"opus"}"#.to_string(),
            r#"{"A":"opus","third_place":"fable","main":"opus"}"#.to_string(),
        ] {
            let (a, b) = tp(&m);
            assert_eq!(a, fable_high, "{m}");
            assert_eq!(b, fable_high, "{m}: a Third Place in a builder-named folder is still the Third Place");
        }
        // the records: what the table does when the entry is not fable, or absent, or not a plain name
        let (opus, _) = tp(r#"{"third_place":"opus"}"#);
        let (none, _) = tp(r#"{"main":"opus"}"#);
        let (bad, _) = tp(r#"{"third_place":"fable --x"}"#);
        eprintln!("K2 record: entry opus -> {}", opus.join(" "));
        eprintln!("K2 record: no entry -> {}", none.join(" "));
        eprintln!("K2 record: entry \"fable --x\" -> {}", bad.join(" "));
        assert_eq!(opus, v(&["--model", "opus", "--effort", "high"]));
        assert_eq!(none, v(&["--effort", "high"]));
        assert_eq!(bad, v(&["--effort", "high"]));
        // and an entry for the Third Place never leaks to the librarian or main under turbo
        let raw = r#"{"run_preset":"turbo","seat_models":{"third_place":"haiku"}}"#;
        assert_eq!(new_args(Some(raw), LIBRARIAN_SID, Some("M"), false), fable_high);
        assert_eq!(new_args(Some(raw), MAIN_SID, None, false), v(&["--model", "opus", "--effort", "xhigh"]));
    }

    fn src() -> String {
        fs::read_to_string("src/main.rs").expect("read own source").replace("\r\n", "\n")
    }
    fn body_of(src: &str, sig: &str) -> String {
        let f = src.split(sig).nth(1).unwrap_or_else(|| panic!("{sig} moved"));
        f.split("\n}\n").next().unwrap_or(f).to_string()
    }

    /// K3 (item 3): each birth that mints a new session id, by its own text. The three paths the chair named (+ Pane, Room, fresh)
    /// claim the letter before their first spawn and hand the letter they claimed to their born line; inside the spawn, the model is
    /// decided before the spawn's own letter claim (the cause of O and P), so a path without a claim of its own still misses it.
    #[test]
    fn k3_every_birth_by_its_own_text() {
        let s = src();
        let spawn = body_of(&s, "fn spawn_claude_pane(");
        let decided = spawn.find("let launch = seat_launch(").expect("seat_launch call");
        let own_claim = spawn.find("let letter = pane_letter(&pane_id);").expect("the spawn's own letter claim (MCP mount)");
        assert!(decided < own_claim, "control: inside the spawn the model is decided before the spawn's own letter claim");
        for (sig, born) in [("fn spawn_sibling(", "born-kept sibling pane={pane_id} letter={letter}"), ("fn spawn_fresh(", "born-kept fresh pane={pane_id} letter={letter}"), ("fn new_room(", "room opened pane={pane_id} letter={letter}")] {
            let b = body_of(&s, sig);
            let mint = b.find("let pane_id = Uuid::new_v4().to_string();").unwrap_or_else(|| panic!("{sig}: no mint"));
            let claim = b.find("let letter = pane_letter(&pane_id);").unwrap_or_else(|| panic!("{sig}: no claim"));
            let first = b.find("spawn_claude_pane(").unwrap_or_else(|| panic!("{sig}: no spawn"));
            assert!(mint < claim && claim < first, "{sig}: mint {mint} claim {claim} spawn {first}");
            assert_eq!(b.matches("spawn_claude_pane(").count(), 1, "{sig}: one spawn");
            // nothing between the claim and the spawn can return early (a refused birth after the claim spends the letter: A's point 2)
            let between = &b[claim..first];
            eprintln!("K3 {sig:20} claim before spawn; between them: {:?}", between.lines().filter(|l| !l.trim().starts_with("//") && !l.trim().is_empty()).map(str::trim).collect::<Vec<_>>());
            assert!(b.contains(born), "{sig}: the born line no longer names the letter it claimed");
        }
        // the two other births that mint an id (not in the chair's three): record where their letter comes from
        for sig in ["fn pty_spawn(", "fn spawn_body("] {
            let b = body_of(&s, sig);
            eprintln!("K3 record {sig:14} pane_letter before its spawn: {}", b.find("pane_letter(").map_or(false, |c| c < b.find("spawn_claude_pane(").unwrap()));
        }
        // the Third Place, the librarian and Main: keyed by fixed name, so a letter is not needed for their model
        let b = body_of(&s, "fn spawn_third_place(");
        eprintln!("K3 record spawn_third_place: letter at open after the spawn: {}", b.find("third_place_letter_at_open()").unwrap() > b.find("spawn_claude_pane(").unwrap());
    }

    /// K3b: what the order buys, by the pure core: a newborn builder with his seat_models, with the letter (72d88e09's order) and
    /// without it (1f00fe9a's order), under Normal and Turbo.
    #[test]
    fn k3b_what_the_letter_first_order_changes() {
        let models = obj(&his_models(), false);
        let normal = format!(r#"{{"seat_models":{models}}}"#);
        let turbo = format!(r#"{{"seat_models":{models},"run_preset":"turbo"}}"#);
        let id = "8bcb0f46-0000-4000-8000-000000000002";
        assert_eq!(new_args(Some(&normal), id, None, true), Vec::<String>::new(), "old order, normal: the model is missed (O and P's plog)");
        assert_eq!(new_args(Some(&normal), id, Some("O"), true), v(&["--model", "opus"]), "new order, normal");
        assert_eq!(new_args(Some(&turbo), id, None, true), v(&["--model", "opus", "--effort", "xhigh"]), "old order, turbo: the role comes from the folder, so it is not missed");
        assert_eq!(new_args(Some(&turbo), id, Some("O"), true), v(&["--model", "opus", "--effort", "xhigh"]));
    }

    /// K3c: the folder each birth makes, through the spawn's own role rule (is_builder_dir_name on the name prepare_*_dir writes).
    #[test]
    fn k3c_the_folder_each_birth_makes_is_or_is_not_a_builder() {
        let s = src();
        assert!(body_of(&s, "fn prepare_sibling_dir(").contains("format!(\"sibling-{}\", &id[..8])"));
        assert!(body_of(&s, "fn prepare_fresh_dir(").contains("format!(\"fresh-{}\", &id[..8])"));
        assert!(body_of(&s, "fn rooms_root(").contains(".map(|p| p.join(\"rooms\"))"), "rooms sit beside the instances root, not in it");
        assert!(is_builder_dir_name(r"C:\Consonance\instances\sibling-46981c3e"));
        assert!(!is_builder_dir_name(r"C:\Consonance\instances\fresh-1234abcd"));
        assert!(!is_builder_dir_name(r"C:\Consonance\rooms\room-1234abcd"));
        // a room the person names "sibling-x" has a builder NAME, but is outside the instances root, so is_managed_cwd is false for it
        assert!(is_builder_dir_name(r"C:\Consonance\rooms\sibling-x"));
        assert!(!PathBuf::from(r"C:\Consonance\rooms\sibling-x").starts_with(r"C:\Consonance\instances"));
    }

    /// K4 (item 4): values A did not try. Each runs as normal (today's argv for every seat) and is refused.
    #[test]
    fn k4_more_unknown_values_are_refused_and_run_as_normal() {
        let models = r#""seat_models":{"main":"opus","librarian":"opus","third_place":"fable","A":"opus","O":"opus"}"#;
        for p in [r#""turbo ""#, r#""\tturbo""#, r#""turbo\n""#, r#""normal ""#, r#""Normal""#, r#""turb\u043e""#, r#""turbo\u0000""#, r#""xhigh""#, "0", "-1", "1.5", "false", "{}", "[]"] {
            for order in [format!(r#"{{"run_preset":{p},{models}}}"#), format!(r#"{{{models},"run_preset":{p}}}"#)] {
                for (name, id, letter, builder) in seats() {
                    let l = seat_launch_from(Some(&order), id, letter, builder);
                    assert_eq!(l.preset, RunPreset::Normal, "{p} {name}");
                    assert!(l.refused.is_some(), "{p} {name}: not refused");
                    assert_eq!(new_args(Some(&order), id, letter, builder), old_args(Some(&order), id, letter), "{p} {name}: not today's argv");
                }
            }
            eprintln!("K4 {p:14} refused: {}", run_preset_refusal("pane-x", &seat_launch_from(Some(&format!(r#"{{"run_preset":{p}}}"#)), "pane-x", None, true).refused.unwrap()));
        }
        // a key written twice: serde_json keeps the last one
        let dup = |a: &str, b: &str| seat_launch_from(Some(&format!(r#"{{"run_preset":{a},"run_preset":{b}}}"#)), "x", None, true);
        let tw = dup(r#""turbo""#, r#""warp""#);
        let wt = dup(r#""warp""#, r#""turbo""#);
        eprintln!("K4 record: turbo then warp -> {:?} refused {:?}; warp then turbo -> {:?} refused {:?}", tw.preset, tw.refused, wt.preset, wt.refused);
        // the key escaped in the file is the same key
        let esc = seat_launch_from(Some(r#"{"run\u005fpreset":"turbo"}"#), "x", None, true);
        eprintln!("K4 record: \"run\\u005fpreset\":\"turbo\" -> {:?}", esc.preset);
    }

    /// K4b: the same values through the Settings tab: what get_state hands the select (parse_config) and what a save writes back.
    #[test]
    fn k4b_an_unknown_value_through_a_settings_save() {
        for p in [r#""turbo ""#, r#""\tturbo""#, r#"" turbo""#, r#""TURBO""#, r#""warp""#, "1", "true", "{}"] {
            let raw = format!(r#"{{"run_preset":{p},"machine_tag":"L"}}"#);
            let shown = parse_config(&raw).0.run_preset;
            let written = merged_config_text(Some(&raw), &parse_config(&raw).0).unwrap();
            let after = serde_json::from_str::<serde_json::Value>(&written).unwrap()["run_preset"].clone();
            let spawn_before = seat_launch_from(Some(&raw), "x", None, true).preset;
            let spawn_after = seat_launch_from(Some(&written), "x", None, true).preset;
            eprintln!("K4b {p:10} the tab is handed {shown:?}; a save writes {after}; spawn before {spawn_before:?}, after {spawn_after:?}");
        }
    }

    /// K5 (item 5): Normal gives back 1f00fe9a's model argv for every seat, every letter state and both folder kinds, over a grid of
    /// config shapes (seat_models by id, by fixed name, by letter; bad names; non-strings; nested; empty; BOM; not JSON; no file).
    #[test]
    fn k5_normal_is_1f00fe9a_argv_byte_for_byte() {
        let model_sets = [
            None,
            Some(r#"{}"#.to_string()),
            Some(r#"{"main":"opus","third_place":"fable","librarian":"opus","A":"opus","B":"opus","C":"opus","E":"opus","O":"opus","P":"opus"}"#.to_string()),
            Some(format!(r#"{{"{C_UUID}":"sonnet","C":"opus","main":"fable"}}"#)),
            Some(r#"{"A":"opus --bad","C":"","O":" ","P":7,"main":null,"librarian":["fable"],"third_place":{"m":"x"}}"#.to_string()),
            Some(r#"{"M":"haiku","N":"sonnet","F":"opus","R":"opus"}"#.to_string()),
            Some(r#""opus""#.to_string()),
            Some(r#"[["A","opus"]]"#.to_string()),
        ];
        let presets = [None, Some(r#""normal""#), Some(r#""""#)];
        let mut configs: Vec<Option<String>> = vec![None, Some(String::new()), Some("{ not json".into()), Some("[]".into()), Some("null".into())];
        for m in &model_sets {
            for p in &presets {
                let mut parts = Vec::new();
                if let Some(p) = p {
                    parts.push(format!(r#""run_preset":{p}"#));
                }
                if let Some(m) = m {
                    parts.push(format!(r#""seat_models":{m}"#));
                }
                parts.push(r#""machine_tag":"L""#.to_string());
                configs.push(Some(format!("{{{}}}", parts.join(","))));
                parts.reverse();
                configs.push(Some(format!("\u{feff}{{\r\n  {}\r\n}}", parts.join(",\r\n  "))));
            }
        }
        let mut n = 0usize;
        let mut with_model = 0usize;
        for raw in &configs {
            for (name, id, letter, _) in seats() {
                for l in [None, letter, Some("C"), Some("O")] {
                    for builder in [false, true] {
                        let old = old_args(raw.as_deref(), id, l);
                        assert_eq!(new_args(raw.as_deref(), id, l, builder), old, "{raw:?} {name} {l:?} builder={builder}");
                        n += 1;
                        if !old.is_empty() {
                            with_model += 1;
                        }
                    }
                }
            }
        }
        eprintln!("K5 cases: {n}, of which {with_model} carry a --model; configs {}", configs.len());
        assert!(with_model > 0, "control: the grid exercises seats that do get a --model");
    }

    /// K5 control: the comparator sees a difference: under Turbo the two disagree for a builder.
    #[test]
    fn k5_control_the_comparator_can_go_red() {
        let raw = r#"{"run_preset":"turbo","seat_models":{"A":"opus"}}"#;
        assert_ne!(new_args(Some(raw), "pane-a", Some("A"), true), old_args(Some(raw), "pane-a", Some("A")));
    }
}
