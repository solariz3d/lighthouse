
// L247 (his words, 2026-11-26 02:50: "there is our setup now which is normal, then in the settings is a turbo preset"): the run preset's rows.
// Pure on the config's text; the wiring into spawn_claude_pane is pinned by source shape, as the seat model's is.
#[cfg(test)]
mod run_preset_tests {
    use super::*;

    /// Today's (pre-L247) model arguments for a seat: seat_models, nothing else.
    fn todays_args(raw: Option<&str>, pane_id: &str, letter: Option<&str>) -> Vec<String> {
        raw.and_then(|r| seat_model_from(r, pane_id, letter)).map(|m| vec!["--model".to_string(), m]).unwrap_or_default()
    }
    const SEATS: [(&str, Option<&str>); 8] =
        [(MAIN_SID, None), (LIBRARIAN_SID, Some("M")), (THIRD_PLACE_SID, None), ("pane-a", Some("A")), ("pane-b", Some("B")), ("pane-c", Some("C")), ("pane-d", Some("D")), ("pane-e", Some("E"))];

    /// Row 1: normal gives back today's argv exactly: a missing key, "", "normal", and every config shape seat_models' own rows use.
    #[test]
    fn normal_gives_back_todays_argv() {
        let models = r#""seat_models":{"main":"opus","librarian":"fable","third_place":"fable","B":"sonnet","pane-c":"haiku","E":"opus --bad"}"#;
        let mut configs: Vec<Option<String>> = vec![None, Some(String::new()), Some("{ not json".into()), Some("{}".into()), Some(format!("{{{models}}}"))];
        for p in [r#""run_preset":"normal""#, r#""run_preset":"""#] {
            configs.push(Some(format!("{{{p}}}")));
            configs.push(Some(format!("{{{p},{models}}}")));
            configs.push(Some(format!("\u{feff}{{{models},{p}}}")));
        }
        for raw in &configs {
            for (id, letter) in SEATS {
                let l = seat_launch_from(raw.as_deref(), id, letter);
                assert_eq!(l.preset, RunPreset::Normal, "{raw:?}");
                assert_eq!(l.refused, None, "{raw:?} is not a refusal");
                assert_eq!(l.effort, None, "{raw:?} {id}: normal adds no --effort");
                assert_eq!(seat_launch_args(&l), todays_args(raw.as_deref(), id, letter), "{raw:?} {id}: not today's argv");
            }
        }
    }

    /// Row 2: turbo gives each seat the table's model and effort; the Third Place keeps its seat_models entry; a seat the table does not name runs as normal.
    #[test]
    fn turbo_gives_each_seat_its_model_and_effort() {
        let raw = r#"{"run_preset":"turbo","seat_models":{"main":"opus","third_place":"fable","A":"sonnet","D":"haiku"}}"#;
        let args = |id: &str, letter: Option<&str>| seat_launch_args(&seat_launch_from(Some(raw), id, letter));
        let v = |a: &[&str]| a.iter().map(|s| s.to_string()).collect::<Vec<_>>();
        assert_eq!(args(MAIN_SID, None), v(&["--model", "fable", "--effort", "high"]), "the orchestrator: fable at high, over its seat_models entry");
        assert_eq!(args(LIBRARIAN_SID, Some("M")), v(&["--model", "fable", "--effort", "high"]));
        assert_eq!(args(THIRD_PLACE_SID, None), v(&["--model", "fable", "--effort", "high"]), "the Third Place: its own seat_models model, at high");
        for (id, l) in [("pane-a", "A"), ("pane-b", "B"), ("pane-c", "C"), ("pane-e", "E")] {
            assert_eq!(args(id, Some(l)), v(&["--model", "opus", "--effort", "xhigh"]), "pane {l}");
        }
        assert_eq!(args("pane-d", Some("D")), v(&["--model", "haiku"]), "a seat the table does not name: today's (its seat_models, no effort)");
        assert_eq!(args("fresh", None), Vec::<String>::new(), "a seat with no name at all: today's");
        let bare = r#"{"run_preset":"turbo"}"#;
        assert_eq!(seat_launch_args(&seat_launch_from(Some(bare), THIRD_PLACE_SID, None)), v(&["--effort", "high"]), "no seat_models entry: no --model, the effort still");
        assert!(seat_launch_from(Some(raw), "pane-a", Some("A")).from_table);
        // the table is the one place, and every effort in it is one claude takes
        for (seat, model, effort) in TURBO_SEATS {
            assert!(["low", "medium", "high", "xhigh", "max"].contains(effort), "{seat}: {effort}");
            assert!(model.map_or(true, plain_model_name), "{seat}: {model:?}");
        }
    }

    /// Row 3: an unknown value runs as normal and is refused, loudly, never guessed at ("Turbo" is not "turbo").
    #[test]
    fn an_unknown_value_runs_as_normal_and_is_refused() {
        for p in [r#""Turbo""#, r#""TURBO""#, r#"" turbo""#, r#""fast""#, "1", "true", "null", r#"{"turbo":true}"#, r#"["turbo"]"#] {
            let raw = format!(r#"{{"run_preset":{p},"seat_models":{{"A":"sonnet"}}}}"#);
            for (id, letter) in SEATS {
                let l = seat_launch_from(Some(&raw), id, letter);
                assert_eq!(l.preset, RunPreset::Normal, "{p}");
                assert!(l.refused.is_some(), "{p} was not refused");
                assert_eq!(seat_launch_args(&l), todays_args(Some(&raw), id, letter), "{p} {id}: not today's argv");
            }
            let line = run_preset_refusal("pane-a", &seat_launch_from(Some(&raw), "pane-a", Some("A")).refused.unwrap());
            assert!(line.starts_with("RUN PRESET REFUSED pane=pane-a") && line.contains(&one_line(&serde_json::from_str::<serde_json::Value>(p).unwrap().to_string(), 80)), "{line}");
        }
        // and the refusal reaches plog, once per spawn
        let src = fs::read_to_string("src/main.rs").expect("read own source").replace("\r\n", "\n");
        let f = src.split("fn seat_launch(pane_id: &str)").nth(1).expect("seat_launch moved");
        let body = f.split("\n}\n").next().unwrap_or(f);
        assert!(body.contains("plog(&run_preset_refusal(pane_id, v));"), "the refusal is not logged");
    }

    /// Row 4 (wiring): spawn_claude_pane takes its model and effort from seat_launch, once each, after the resume / session-id arguments.
    #[test]
    fn the_spawn_takes_the_launch_once() {
        let src = fs::read_to_string("src/main.rs").expect("read own source").replace("\r\n", "\n");
        let f = src.split("fn spawn_claude_pane(").nth(1).expect("spawn_claude_pane moved");
        let body = f.split("\n}\n").next().unwrap_or(f);
        let resume = body.find("cmd.args([\"--resume\", &pane_id]);").expect("the resume argument moved");
        let launch = body.find("let launch = seat_launch(&pane_id);").expect("spawn does not read seat_launch");
        let effort = body.find("cmd.args([\"--effort\", effort]);").expect("no --effort call");
        assert!(resume < launch && launch < effort);
        assert_eq!(body.matches("\"--effort\"").count(), 1, "one --effort call");
        assert_eq!(body.matches("seat_launch(").count(), 1, "the config is read once per spawn");
    }
}
