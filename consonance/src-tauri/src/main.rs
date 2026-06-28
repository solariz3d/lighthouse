#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use std::collections::{HashMap, VecDeque};
use std::io::{Read, Seek, SeekFrom, Write};
use std::sync::{Arc, Mutex};
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
    killer: Box<dyn portable_pty::ChildKiller + Send + Sync>,
}
struct Panes(Mutex<HashMap<String, PtySession>>);

// spawn claude in a fresh ConPTY: stream output, and detect exit by WAITING on the child
// process (the PTY master often doesn't EOF on conhost). resume=true reattaches a session.
fn spawn_claude_pane(app: AppHandle, pane_id: String, cwd: String, resume: bool) -> Result<PtySession, String> {
    let pair = native_pty_system()
        .openpty(PtySize { rows: 34, cols: 120, pixel_width: 0, pixel_height: 0 })
        .map_err(|e| e.to_string())?;
    let mut cmd = CommandBuilder::new(claude_bin());
    cmd.cwd(&cwd);
    if resume {
        cmd.args(["--resume", &pane_id]);
    } else {
        cmd.args(["--session-id", &pane_id]); // names the transcript for the tap
    }
    cmd.env("TERM", "xterm-256color");
    cmd.env("FORCE_COLOR", "1");
    let mut child = pair.slave.spawn_command(cmd).map_err(|e| e.to_string())?;
    drop(pair.slave);

    let killer = child.clone_killer();
    let mut reader = pair.master.try_clone_reader().map_err(|e| e.to_string())?;
    let writer = pair.master.take_writer().map_err(|e| e.to_string())?;

    let app_r = app.clone();
    let id_r = pane_id.clone();
    std::thread::spawn(move || {
        let mut buf = [0u8; 8192];
        loop {
            match reader.read(&mut buf) {
                Ok(0) | Err(_) => break,
                Ok(n) => { let _ = app_r.emit("pty-output", PtyChunk { pane: id_r.clone(), data: buf[..n].to_vec() }); }
            }
        }
    });

    std::thread::spawn(move || {
        let _ = child.wait();
        let _ = app.emit("pty-exit", &pane_id);
    });

    Ok(PtySession { writer, master: pair.master, killer })
}

#[derive(Clone, Serialize)]
struct PtyChunk {
    pane: String,
    data: Vec<u8>,
}

// ---- the Tap: tail each pane's JSONL transcript into clean role-tagged TurnRecords ----
#[derive(Clone, Serialize)]
struct TurnRecord {
    pane: String,
    role: String,
    text: String,
}

// ---- cost: aggregate real per-turn `usage` from the transcripts, priced per model ----
#[derive(Default, Clone, Serialize)]
struct CostTotals {
    input: u64,
    output: u64,
    cache_read: u64,
    cache_write: u64,
    usd: f64,
}
struct Cost(Arc<Mutex<CostTotals>>);

// per-instance live context-window fill (input + cache + output of the latest turn vs model window)
#[derive(Clone, Serialize)]
struct ContextInfo {
    pane: String,
    ctx: u64,
    limit: u64,
}

// ---- the Live Board: the canonical, bounded, persisted cross-pane shared log ----
#[derive(Clone, Serialize)]
struct BoardEntry {
    pane: String,
    role: String,
    text: String,
    ts: u64,
}
struct Board(Arc<Mutex<VecDeque<BoardEntry>>>);

const BOARD_MAX: usize = 300; // hard count cap
const BOARD_TOKEN_BUDGET: usize = 12000; // approx tokens (chars/4) kept in the live ring

fn board_path() -> PathBuf {
    let dir = PathBuf::from(home()).join(".consonance");
    let _ = fs::create_dir_all(&dir);
    dir.join("board.jsonl")
}

fn board_push(ring: &Arc<Mutex<VecDeque<BoardEntry>>>, entry: BoardEntry) {
    if let Ok(line) = serde_json::to_string(&entry) {
        if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(board_path()) {
            let _ = writeln!(f, "{}", line);
        }
    }
    let mut q = ring.lock().unwrap();
    q.push_back(entry);
    while q.len() > BOARD_MAX {
        q.pop_front();
    }
    let mut approx: usize = q.iter().map(|e| e.text.len() / 4 + 8).sum();
    while approx > BOARD_TOKEN_BUDGET && q.len() > 1 {
        if let Some(e) = q.pop_front() {
            approx -= e.text.len() / 4 + 8;
        }
    }
}

// $/1M tokens (date-stamped table from PLAN.md §9, cached 2026-06): (input, output, cache_read, cache_write)
fn turn_cost_usd(model: &str, inp: u64, out: u64, cr: u64, cw: u64) -> f64 {
    let (pin, pout, pcr, pcw) = if model.contains("haiku") {
        (1.0, 5.0, 0.1, 1.25)
    } else if model.contains("sonnet") {
        (3.0, 15.0, 0.3, 3.75)
    } else {
        (5.0, 25.0, 0.5, 6.25) // opus 4.8 default
    };
    (inp as f64 * pin + out as f64 * pout + cr as f64 * pcr + cw as f64 * pcw) / 1_000_000.0
}

fn extract_usage(v: &serde_json::Value) -> Option<(u64, u64, u64, u64, String)> {
    let msg = v.get("message")?;
    let u = msg.get("usage")?;
    let model = msg.get("model").and_then(|x| x.as_str()).unwrap_or("").to_string();
    let g = |k: &str| u.get(k).and_then(|x| x.as_u64()).unwrap_or(0);
    Some((
        g("input_tokens"),
        g("output_tokens"),
        g("cache_read_input_tokens"),
        g("cache_creation_input_tokens"),
        model,
    ))
}

// claude's project-dir scheme: drive-colon and every path separator become '-'
fn encode_cwd(cwd: &str) -> String {
    cwd.chars()
        .map(|c| if c == ':' || c == '\\' || c == '/' { '-' } else { c })
        .collect()
}

// pull the publishable text out of a transcript line; thinking/tool_use noise excluded
fn extract_turn(v: &serde_json::Value) -> Option<(String, String)> {
    let t = v.get("type")?.as_str()?;
    if t != "user" && t != "assistant" {
        return None;
    }
    let content = v.get("message")?.get("content")?;
    let text = match content {
        serde_json::Value::String(s) => s.clone(),
        serde_json::Value::Array(arr) => arr
            .iter()
            .filter(|b| b.get("type").and_then(|x| x.as_str()) == Some("text"))
            .filter_map(|b| b.get("text").and_then(|x| x.as_str()))
            .collect::<Vec<_>>()
            .join(" "),
        _ => return None,
    };
    let text = text.trim().to_string();
    if text.is_empty() {
        return None;
    }
    Some((t.to_string(), text.chars().take(600).collect()))
}

// poll the transcript (250ms + a size watermark) and emit each new complete turn.
// v1 simplification: the tailer thread runs until the file is gone for ~3 min; it does
// not yet stop on pane close (a sleeping loop, negligible for a handful of panes).
fn start_tailer(
    app: AppHandle,
    pane_id: String,
    cwd: String,
    cost: Arc<Mutex<CostTotals>>,
    board: Arc<Mutex<VecDeque<BoardEntry>>>,
) {
    let path = PathBuf::from(home())
        .join(".claude")
        .join("projects")
        .join(encode_cwd(&cwd))
        .join(format!("{pane_id}.jsonl"));
    std::thread::spawn(move || {
        let mut offset: u64 = 0;
        let mut misses = 0u32;
        loop {
            std::thread::sleep(Duration::from_millis(250));
            let len = match fs::metadata(&path) {
                Ok(m) => m.len(),
                Err(_) => {
                    misses += 1;
                    if misses > 720 { break; }
                    continue;
                }
            };
            misses = 0;
            if len < offset {
                offset = 0; // file rotated/truncated
            }
            if len <= offset {
                continue;
            }
            let mut f = match fs::File::open(&path) {
                Ok(f) => f,
                Err(_) => continue,
            };
            if f.seek(SeekFrom::Start(offset)).is_err() {
                continue;
            }
            let mut data = Vec::new();
            if f.read_to_end(&mut data).is_err() {
                continue;
            }
            if let Some(pos) = data.iter().rposition(|&b| b == b'\n') {
                offset += (pos + 1) as u64;
                for line in data[..=pos].split(|&b| b == b'\n') {
                    if line.is_empty() {
                        continue;
                    }
                    if let Ok(v) = serde_json::from_slice::<serde_json::Value>(line) {
                        if let Some((role, text)) = extract_turn(&v) {
                            let ts = SystemTime::now()
                                .duration_since(UNIX_EPOCH)
                                .map(|d| d.as_millis() as u64)
                                .unwrap_or(0);
                            board_push(&board, BoardEntry { pane: pane_id.clone(), role: role.clone(), text: text.clone(), ts });
                            let _ = app.emit("turn", TurnRecord { pane: pane_id.clone(), role, text });
                        }
                        if let Some((inp, out, cr, cw, model)) = extract_usage(&v) {
                            let snapshot = {
                                let mut c = cost.lock().unwrap();
                                c.input += inp;
                                c.output += out;
                                c.cache_read += cr;
                                c.cache_write += cw;
                                c.usd += turn_cost_usd(&model, inp, out, cr, cw);
                                c.clone()
                            };
                            let _ = app.emit("cost", snapshot);
                            let ctx = inp + cr + cw + out;
                            let limit = if model.contains("haiku") { 200_000 } else { 1_000_000 };
                            let _ = app.emit("context", ContextInfo { pane: pane_id.clone(), ctx, limit });
                        }
                    }
                }
            }
        }
    });
}

#[tauri::command]
fn pty_spawn(
    app: AppHandle,
    panes: State<Panes>,
    cost: State<Cost>,
    board: State<Board>,
    cwd: String,
) -> Result<String, String> {
    let pane_id = Uuid::new_v4().to_string();
    let resolved_cwd = if cwd.trim().is_empty() { home() } else { cwd };
    let session = spawn_claude_pane(app.clone(), pane_id.clone(), resolved_cwd.clone(), false)?;
    start_tailer(app, pane_id.clone(), resolved_cwd, cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(pane_id.clone(), session);
    Ok(pane_id)
}

#[tauri::command]
fn get_board(board: State<Board>) -> Vec<BoardEntry> {
    board.0.lock().unwrap().iter().cloned().collect()
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
        let _ = s.killer.kill();
    }
}

// crash-recovery: relaunch a dead pane against the SAME session via --resume (same
// transcript continues, so the still-running tailer keeps catching turns).
#[tauri::command]
fn pty_reopen(app: AppHandle, panes: State<Panes>, pane: String, cwd: String) -> Result<(), String> {
    let resolved_cwd = if cwd.trim().is_empty() { home() } else { cwd };
    let session = spawn_claude_pane(app, pane.clone(), resolved_cwd, true)?;
    panes.0.lock().unwrap().insert(pane, session);
    Ok(())
}

#[derive(Clone, Serialize)]
struct SysMeter {
    claude_procs: u32,
    claude_mb: u64,
    ram_used_mb: u64,
    ram_total_mb: u64,
}

fn main() {
    tauri::Builder::default()
        .manage(Panes(Mutex::new(HashMap::new())))
        .manage(Cost(Arc::new(Mutex::new(CostTotals::default()))))
        .manage(Board(Arc::new(Mutex::new(VecDeque::new()))))
        .setup(|app| {
            let handle = app.handle().clone();
            std::thread::spawn(move || {
                let mut sys = sysinfo::System::new();
                loop {
                    sys.refresh_memory();
                    sys.refresh_processes();
                    let mut claude_procs = 0u32;
                    let mut claude_mb = 0u64;
                    for proc in sys.processes().values() {
                        if proc.name().to_lowercase().contains("claude") {
                            claude_procs += 1;
                            claude_mb += proc.memory() / 1_048_576;
                        }
                    }
                    let _ = handle.emit("sysmeter", SysMeter {
                        claude_procs,
                        claude_mb,
                        ram_used_mb: sys.used_memory() / 1_048_576,
                        ram_total_mb: sys.total_memory() / 1_048_576,
                    });
                    std::thread::sleep(Duration::from_millis(2000));
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_state, save_config, launch, loop_start, loop_ask,
            pty_spawn, pty_write, pty_resize, pty_kill, pty_reopen, get_board
        ])
        .run(tauri::generate_context!())
        .expect("error while running Consonance");
}
