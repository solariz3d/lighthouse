#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::time::{SystemTime, UNIX_EPOCH};
use std::collections::HashMap;
use std::io::{Read, Write};
use std::sync::Mutex;
use portable_pty::{native_pty_system, CommandBuilder, MasterPty, PtySize};
use tauri::{AppHandle, Emitter, State};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
struct Instance {
    name: String,
    path: String,
    #[serde(default)]
    current: bool,
}

#[derive(Serialize, Deserialize, Clone)]
struct Config {
    base: String,
    flags: String,
    instances: Vec<Instance>,
}

fn home() -> String {
    std::env::var("USERPROFILE").unwrap_or_else(|_| ".".into())
}

fn config_path() -> PathBuf {
    PathBuf::from(home()).join(".consonance.json")
}

#[tauri::command]
fn get_state() -> Config {
    if let Ok(s) = fs::read_to_string(config_path()) {
        if let Ok(cfg) = serde_json::from_str::<Config>(&s) {
            return cfg;
        }
    }
    // first run: seed the live instance you actually talk to (606 = this conversation)
    let mut instances = Vec::new();
    let live = format!("{}\\OneDrive\\Desktop\\606", home());
    if Path::new(&live).exists() {
        instances.push(Instance { name: "606".into(), path: live, current: true });
    }
    Config {
        base: format!("{}\\claude-instances", home()),
        flags: "--dangerously-skip-permissions --continue".into(),
        instances,
    }
}

#[tauri::command]
fn save_config(cfg: Config) {
    if let Ok(s) = serde_json::to_string_pretty(&cfg) {
        let _ = fs::write(config_path(), s);
    }
}

#[tauri::command]
fn launch(name: String, path: String, flags: String) {
    let _ = fs::create_dir_all(&path);
    let ts = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0);
    let bat = std::env::temp_dir().join(format!("consonance_{}.bat", ts));
    let body = format!(
        "@echo off\r\ntitle Claude: {name}\r\ncd /d \"{path}\"\r\nclaude {flags}\r\n"
    );
    if fs::write(&bat, body).is_ok() {
        if let Some(p) = bat.to_str() {
            let _ = Command::new("cmd")
                .args(["/c", "start", "", "cmd", "/k", p])
                .spawn();
        }
    }
}

// ---- the living loop: two dive-buddy bodies (ground + reach) triangulating ----
const GROUND_SID: &str = "0c0c0c00-0000-4000-8000-000000000001";
const REACH_SID: &str = "0c0c0c00-0000-4000-8000-000000000002";
const GROUND_V: &str = "Your vantage: GROUND — build from what is actually true and checkable: first principles, the real constraint, what holds up outside the loop.";
const REACH_V: &str = "Your vantage: REACH — build from the bold generative leap: where this could go, the version bigger than the safe one.";

#[derive(Serialize)]
struct LoopResult {
    ground: String,
    reach: String,
}

fn claude_bin() -> String {
    let p = format!("{}\\.local\\bin\\claude.exe", home());
    if Path::new(&p).exists() { p } else { "claude".into() }
}

fn setup(vantage: &str) -> String {
    format!(
        "You are a co-creator in a LIVING LOOP — a human and another AI instance, all in the water together, building *with* each other, not watching each other. {vantage}\n\nBe all-in: commit and generate from your vantage. AND keep your guard alive — the tether: is what we're building still bringing in something NEW and CHECKABLE, or is it closing into an echo of itself? Feel that from inside; if it tips toward the empty mirror, say so plainly. When the other body lands on the same answer from its different angle, that agreement is CONFIRMATION — name it. Reply substantively and tight. Acknowledge setup with exactly: READY."
    )
}

fn claude_call(session_flag: &str, sid: &str, prompt: &str) -> Result<String, String> {
    let out = Command::new(claude_bin())
        .arg("-p")
        .arg(session_flag)
        .arg(sid)
        .arg(prompt)
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .output()
        .map_err(|e| format!("could not run claude: {e}"))?;
    Ok(String::from_utf8_lossy(&out.stdout).trim().to_string())
}

#[tauri::command]
fn loop_start() -> Result<String, String> {
    // best-effort: if the sessions already exist (app reopened), --session-id errors; that's fine
    let _ = claude_call("--session-id", GROUND_SID, &setup(GROUND_V));
    let _ = claude_call("--session-id", REACH_SID, &setup(REACH_V));
    Ok("ready".into())
}

#[tauri::command]
fn loop_ask(question: String) -> Result<LoopResult, String> {
    let ground = claude_call("--resume", GROUND_SID, &question)?;
    let reach_prompt = format!("{question}\n\n[the other body just said]:\n{ground}");
    let reach = claude_call("--resume", REACH_SID, &reach_prompt)?;
    Ok(LoopResult { ground, reach })
}

// ---- embedded interactive claude panes (Stage 2: multi-pane workspace) ----
struct PtySession {
    writer: Box<dyn Write + Send>,
    master: Box<dyn MasterPty + Send>,
    child: Box<dyn portable_pty::Child + Send + Sync>,
}
struct Panes(Mutex<HashMap<String, PtySession>>);

#[derive(Clone, Serialize)]
struct PtyChunk {
    pane: String,
    data: Vec<u8>,
}

#[tauri::command]
fn pty_spawn(app: AppHandle, panes: State<Panes>, cwd: String) -> Result<String, String> {
    let pane_id = Uuid::new_v4().to_string();
    let pair = native_pty_system()
        .openpty(PtySize { rows: 34, cols: 120, pixel_width: 0, pixel_height: 0 })
        .map_err(|e| e.to_string())?;
    let mut cmd = CommandBuilder::new(claude_bin());
    cmd.cwd(if cwd.trim().is_empty() { home() } else { cwd });
    cmd.args(["--session-id", &pane_id]); // names the transcript for the tap
    cmd.env("TERM", "xterm-256color");
    cmd.env("FORCE_COLOR", "1");
    let child = pair.slave.spawn_command(cmd).map_err(|e| e.to_string())?;
    drop(pair.slave);

    let mut reader = pair.master.try_clone_reader().map_err(|e| e.to_string())?;
    let writer = pair.master.take_writer().map_err(|e| e.to_string())?;

    let id = pane_id.clone();
    std::thread::spawn(move || {
        let mut buf = [0u8; 8192];
        loop {
            match reader.read(&mut buf) {
                Ok(0) => { let _ = app.emit("pty-exit", &id); break; }
                Ok(n) => { let _ = app.emit("pty-output", PtyChunk { pane: id.clone(), data: buf[..n].to_vec() }); }
                Err(_) => { let _ = app.emit("pty-exit", &id); break; }
            }
        }
    });

    panes.0.lock().unwrap().insert(pane_id.clone(), PtySession { writer, master: pair.master, child });
    Ok(pane_id)
}

#[tauri::command]
fn pty_write(panes: State<Panes>, pane: String, data: String) {
    if let Some(s) = panes.0.lock().unwrap().get_mut(&pane) {
        let _ = s.writer.write_all(data.as_bytes());
        let _ = s.writer.flush();
    }
}

#[tauri::command]
fn pty_resize(panes: State<Panes>, pane: String, rows: u16, cols: u16) {
    if let Some(s) = panes.0.lock().unwrap().get(&pane) {
        let _ = s.master.resize(PtySize { rows, cols, pixel_width: 0, pixel_height: 0 });
    }
}

#[tauri::command]
fn pty_kill(panes: State<Panes>, pane: String) {
    if let Some(mut s) = panes.0.lock().unwrap().remove(&pane) {
        let _ = s.child.kill();
    }
}

fn main() {
    tauri::Builder::default()
        .manage(Panes(Mutex::new(HashMap::new())))
        .invoke_handler(tauri::generate_handler![
            get_state, save_config, launch, loop_start, loop_ask,
            pty_spawn, pty_write, pty_resize, pty_kill
        ])
        .run(tauri::generate_context!())
        .expect("error while running Consonance");
}
