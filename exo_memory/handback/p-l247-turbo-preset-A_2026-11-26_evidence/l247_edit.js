// L247: the run preset into consonance/src-tauri/src/main.rs. STAGE=1 writes the rows over a stub (turbo ignored, nothing refused, the key
// not owned by the tab, no backup) so they can be seen red; STAGE=2 the real thing. Run from the lighthouse worktree root.
const fs = require('fs');
const SP = 'C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/';
const STAGE = process.env.STAGE;
const p = 'consonance/src-tauri/src/main.rs';
let s = fs.readFileSync(p, 'utf8'); const crlf = s.includes('\r\n'); s = s.replace(/\r\n/g, '\n');
const once = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${n} matches for: ${a.slice(0, 80)}`); s = s.replace(a, () => b); };

if (STAGE === '1') {
  // 1. the Config field
  once(`    #[serde(default)]
    usb_mode: bool,
}
`, `    #[serde(default)]
    usb_mode: bool,
    // L247, THE RUN PRESET (his words, 2026-11-26 02:50: "there is our setup now which is normal, then in the settings is a turbo preset"):
    // "normal" (or missing, or "") is today's spawn; "turbo" is TURBO_SEATS. Kept as written: a value the tab does not know is saved back
    // unchanged, and refused at each spawn (seat_launch), never guessed at.
    #[serde(default)]
    run_preset: String,
}
`);
  // 2. parse_config
  once(`        usb_mode: matches!(v.get("usb_mode"), Some(serde_json::Value::Bool(true))),
    };`, `        usb_mode: matches!(v.get("usb_mode"), Some(serde_json::Value::Bool(true))),
        run_preset: stringish(&v, "run_preset"),
    };`);
  // 3. seat_model -> the run preset's code (seat_model's refusal line moves into seat_launch)
  const sm = s.indexOf('fn seat_model(pane_id: &str) -> Option<String> {'), sp = s.indexOf('fn spawn_claude_pane(app: AppHandle');
  if (sm < 0 || sp < sm) throw new Error('seat_model / spawn anchors');
  let code = fs.readFileSync(SP + 'l247_code.rs', 'utf8').replace(/\r\n/g, '\n');
  code = code.replace('    if preset == RunPreset::Turbo {', '    if false && preset == RunPreset::Turbo {   // L247 STAGE 1 STUB')
    .replace('        Err(v) => (RunPreset::Normal, Some(v)),', '        Err(_v) => (RunPreset::Normal, None),   // L247 STAGE 1 STUB');
  s = s.slice(0, sm) + code.replace(/^\n/, '') + '\n' + s.slice(sp);
  // 4. the spawn
  once(`    // C1 (Lap W): the model named for this seat, on a fresh start and on a resume alike. None is today's behaviour.
    if let Some(model) = seat_model(&pane_id) {
        cmd.args(["--model", &model]);
        plog(&format!("SEAT MODEL pane={pane_id} --model {model} (seat_models in {})", config_path().display()));
    }
`, `    // C1 (Lap W): the model named for this seat, on a fresh start and on a resume alike. None is today's behaviour.
    // L247: and, under the turbo preset, the model and effort its table names (seat_launch; normal is exactly the line above's rule).
    let launch = seat_launch(&pane_id);
    if let Some(model) = launch.model.clone() {
        cmd.args(["--model", &model]);
        let from = if launch.from_table { "the turbo table".to_string() } else { format!("seat_models in {}", config_path().display()) };
        plog(&format!("SEAT MODEL pane={pane_id} --model {model} ({from})"));
    }
    if let Some(effort) = launch.effort {
        cmd.args(["--effort", effort]);
    }
`);
  // 5. the rows
  const rows = fs.readFileSync(SP + 'l247_rows.rs', 'utf8').replace(/\r\n/g, '\n');
  once('\n#[cfg(test)]\nmod dirs_guard_tests {', rows + '\n#[cfg(test)]\nmod dirs_guard_tests {');
  once(`    /// Row 6: the keys the tab owns are EXACTLY Config's fields`, `    /// L247 row: saving the run preset writes that key and keeps every other key, value for value; the file is backed up first, beside it, with
    /// the old text byte for byte; a save that changes nothing writes no backup; a value the tab does not know is kept as written.
    #[test]
    fn saving_the_run_preset_keeps_every_other_key_and_backs_up_first() {
        let with = LIVE_LIKE.replacen("\\"usb_mode\\": true", "\\"usb_mode\\": true,\\n  \\"seat_models\\": {\\"third_place\\": \\"fable\\"}", 1);
        assert!(with.contains("seat_models"), "control: the fixture carries seat_models");
        let p = tmp("preset", Some(&with));
        let before = read_obj(&p);
        let mut cfg = parse_config(&with).0;
        cfg.run_preset = "turbo".into();
        save_config_at(&p, &cfg).unwrap();
        let after = read_obj(&p);
        assert_eq!(after.get("run_preset"), Some(&serde_json::json!("turbo")), "the preset is written");
        for (k, v) in &before {
            assert_eq!(after.get(k), Some(v), "{k} changed");
        }
        assert_eq!(after.len(), before.len() + 1, "one key added, none dropped");
        let dir = p.parent().unwrap().to_path_buf();
        let baks = || {
            let mut v: Vec<PathBuf> = fs::read_dir(&dir).unwrap().flatten().map(|e| e.path()).filter(|x| x.file_name().unwrap().to_string_lossy().starts_with(".consonance.json.bak-")).collect();
            v.sort();
            v
        };
        let b = baks();
        assert_eq!(b.len(), 1, "one backup, beside the file");
        assert_eq!(fs::read(&b[0]).unwrap(), with.as_bytes(), "the backup is the file as it was, byte for byte");
        save_config_at(&p, &parse_config(&fs::read_to_string(&p).unwrap()).0).unwrap();
        assert_eq!(baks().len(), 1, "a save that changes nothing writes no backup");
        let odd = tmp("preset-odd", Some(r#"{"run_preset":"warp","machine_tag":"L"}"#));
        save_config_at(&odd, &parse_config(&fs::read_to_string(&odd).unwrap()).0).unwrap();
        assert_eq!(read_obj(&odd).get("run_preset"), Some(&serde_json::json!("warp")), "a value the tab does not know is kept as written");
    }

    /// Row 6: the keys the tab owns are EXACTLY Config's fields`);
} else if (STAGE === '2') {
  once('    if false && preset == RunPreset::Turbo {   // L247 STAGE 1 STUB', '    if preset == RunPreset::Turbo {');
  once('        Err(_v) => (RunPreset::Normal, None),   // L247 STAGE 1 STUB', '        Err(v) => (RunPreset::Normal, Some(v)),');
  once(`const SETTINGS_KEYS: &[&str] = &["room_path", "instances_dir", "data_dir", "ambient_lat", "ambient_lon", "ambient_label", "ambient_tz", "usb_mode"];`,
    `const SETTINGS_KEYS: &[&str] = &["room_path", "instances_dir", "data_dir", "ambient_lat", "ambient_lon", "ambient_label", "ambient_tz", "usb_mode", "run_preset"];`);
  once(`    let text = merged_config_text(existing.as_deref(), cfg).map_err(|why| refuse_save(path, &why))?;
    fs::write(path, text).map_err(|e| refuse_save(path, &format!("it could not be written ({e})")))
}
`, `    let text = merged_config_text(existing.as_deref(), cfg).map_err(|why| refuse_save(path, &why))?;
    // L247: a save that changes the file backs it up first (the run preset's packet: "Back up the file first, the way the seat_models edit did")
    if let Some(old) = existing.as_deref().filter(|old| *old != text) {
        backup_before_save(path, old).map_err(|why| refuse_save(path, &why))?;
    }
    fs::write(path, text).map_err(|e| refuse_save(path, &format!("it could not be written ({e})")))
}

/// L247: the file as it was, beside it, as \`<name>.bak-<YYYYMMDD-HHMMSS>-settings\` (the shape of the seat_models edit's
/// \`.consonance.json.bak-20261125-before-models\`), never over an older backup: a name taken gets -2, -3 and so on. A backup that cannot be
/// written refuses the save, so no save ever goes ahead without one.
fn backup_before_save(path: &Path, old: &str) -> Result<PathBuf, String> {
    let name = path.file_name().map(|n| n.to_string_lossy().into_owned()).unwrap_or_else(|| ".consonance.json".into());
    let base = format!("{name}.bak-{}-settings", chrono::Local::now().format("%Y%m%d-%H%M%S"));
    for n in 1..1000 {
        let p = path.with_file_name(if n == 1 { base.clone() } else { format!("{base}-{n}") });
        match fs::OpenOptions::new().write(true).create_new(true).open(&p) {
            Ok(mut f) => return f.write_all(old.as_bytes()).map(|_| p.clone()).map_err(|e| format!("the backup {} could not be written ({e}), so it was NOT overwritten", p.display())),
            Err(e) if e.kind() == std::io::ErrorKind::AlreadyExists => continue,
            Err(e) => return Err(format!("the backup {} could not be made ({e}), so it was NOT overwritten", p.display())),
        }
    }
    Err("no free backup name, so it was NOT overwritten".into())
}
`);
} else throw new Error('STAGE=1 or 2');
fs.writeFileSync(p, crlf ? s.replace(/\n/g, '\r\n') : s);
console.log('stage', STAGE, 'ok', crlf);
