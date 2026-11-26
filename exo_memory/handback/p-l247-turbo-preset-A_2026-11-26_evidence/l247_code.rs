
// ── L247, pane A, 2026-11-26: THE RUN PRESET ────────────────────────────────────────────────────────────────────────────
// His words (2026-11-26 02:50, exo_memory/briefs/lighthouse_the_room.md): "setup a preset for how consonance can run, there is our
// setup now which is normal, then in the settings is a turbo preset, which makes all opus panes xhigh reasoning, and the orch and lib
// fable high reasoning". And: "I dont want to overtune our workflow too far" — so ONE key and ONE table, nothing per seat to tune.
//
// The key: "run_preset" in ~/.consonance.json, a Settings-tab key (SETTINGS_KEYS). Missing, empty or "normal": today's spawn exactly
// (seat_models as written, no --effort). "turbo": a seat TURBO_SEATS names takes the table's model and effort; a seat it does not name
// runs as normal. Any other value is REFUSED in plog and the seat runs as normal: never a guess at what was meant. Read at every spawn
// and resume, so a change reaches a seat when it next starts, never a running one.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum RunPreset {
    Normal,
    Turbo,
}

/// THE TURBO TABLE, the one place the preset's seats are named: (seat, model, effort). A seat is "main", "librarian", "third_place" or a
/// pane letter. A model of None keeps the seat's own seat_models entry (the Third Place: fable on his machines), or none.
const TURBO_SEATS: &[(&str, Option<&str>, &str)] = &[
    ("main", Some("fable"), "high"),
    ("librarian", Some("fable"), "high"),
    ("third_place", None, "high"),
    ("A", Some("opus"), "xhigh"),
    ("B", Some("opus"), "xhigh"),
    ("C", Some("opus"), "xhigh"),
    ("E", Some("opus"), "xhigh"),
];

/// The preset the config's text names. Ok(Normal) for no file, text that is not JSON (get_state complains about that), no key, "" or
/// "normal"; Ok(Turbo) for "turbo"; Err(what is written there, as JSON) for anything else, which the caller refuses.
fn run_preset_from(raw: Option<&str>) -> Result<RunPreset, String> {
    let Some(raw) = raw else { return Ok(RunPreset::Normal) };
    let Ok(v) = serde_json::from_str::<serde_json::Value>(raw.trim_start_matches('\u{feff}')) else { return Ok(RunPreset::Normal) };
    match v.get("run_preset") {
        None => Ok(RunPreset::Normal),
        Some(serde_json::Value::String(s)) if s.is_empty() || s == "normal" => Ok(RunPreset::Normal),
        Some(serde_json::Value::String(s)) if s == "turbo" => Ok(RunPreset::Turbo),
        Some(other) => Err(one_line(&other.to_string(), 80)),
    }
}

/// The plog line for a refused preset value.
fn run_preset_refusal(pane_id: &str, value: &str) -> String {
    format!("RUN PRESET REFUSED pane={pane_id}: run_preset is {value}, which is neither \"normal\" nor \"turbo\"; this seat runs as normal (today's spawn)")
}

/// What a spawn adds for the model and the effort.
#[derive(Debug, Clone, PartialEq, Eq)]
struct SeatLaunch {
    preset: RunPreset,
    refused: Option<String>,
    model: Option<String>,
    effort: Option<&'static str>,
    from_table: bool,
}

/// The seat's launch from the config's text, its session id and its letter. Pure. Normal is seat_model_from exactly, as before L247.
fn seat_launch_from(raw: Option<&str>, pane_id: &str, letter: Option<&str>) -> SeatLaunch {
    let (preset, refused) = match run_preset_from(raw) {
        Ok(p) => (p, None),
        Err(v) => (RunPreset::Normal, Some(v)),
    };
    let own = || raw.and_then(|r| seat_model_from(r, pane_id, letter));
    if preset == RunPreset::Turbo {
        let fixed = match pane_id {
            MAIN_SID => Some("main"),
            LIBRARIAN_SID => Some("librarian"),
            THIRD_PLACE_SID => Some("third_place"),
            _ => None,
        };
        if let Some(&(_, model, effort)) = [fixed, letter].into_iter().flatten().find_map(|k| TURBO_SEATS.iter().find(|row| row.0 == k)) {
            return SeatLaunch { preset, refused, model: model.map(str::to_string).or_else(own), effort: Some(effort), from_table: true };
        }
    }
    SeatLaunch { preset, refused, model: own(), effort: None, from_table: false }
}

/// The arguments a launch adds, in the order spawn_claude_pane adds them.
fn seat_launch_args(l: &SeatLaunch) -> Vec<String> {
    let mut a = Vec::new();
    if let Some(m) = &l.model {
        a.extend(["--model".to_string(), m.clone()]);
    }
    if let Some(e) = l.effort {
        a.extend(["--effort".to_string(), e.to_string()]);
    }
    a
}

/// The launch for this seat, read from the live config, with its plog lines: a refused preset, a refused model name (as seat_model said
/// before L247), and one RUN PRESET line per spawn naming the model and effort it starts on.
fn seat_launch(pane_id: &str) -> SeatLaunch {
    let raw = fs::read_to_string(config_path()).ok();
    // shipped empty: the letter registry is read only when the config names seat models or a preset
    let letter = match raw.as_deref() {
        Some(r) if r.contains("seat_models") || r.contains("run_preset") => read_letters().get(pane_id).cloned(),
        _ => None,
    };
    let l = seat_launch_from(raw.as_deref(), pane_id, letter.as_deref());
    if let Some(v) = &l.refused {
        plog(&run_preset_refusal(pane_id, v));
    }
    if l.model.is_none() {
        if let Some(named) = raw.as_deref().and_then(|r| seat_model_named(r, pane_id, letter.as_deref())) {
            if !plain_model_name(&named) {
                plog(&format!("SEAT MODEL REFUSED pane={pane_id}: seat_models names {:?}, which is not a plain model name; no --model", one_line(&named, 80)));
            }
        }
    }
    plog(&format!(
        "RUN PRESET pane={pane_id} {}: model {}, effort {}{}",
        if l.preset == RunPreset::Turbo { "turbo" } else { "normal" },
        l.model.as_deref().unwrap_or("(claude's own)"),
        l.effort.unwrap_or("(claude's own)"),
        if l.from_table { " (the turbo table)" } else { "" }
    ));
    l
}
