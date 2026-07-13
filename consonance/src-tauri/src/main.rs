#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::os::windows::process::CommandExt;
use std::process::{Command, Stdio};
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

// Windows: spawn child processes with no console window (CREATE_NO_WINDOW)
const NO_WINDOW: u32 = 0x0800_0000;
use std::collections::{HashMap, VecDeque};
use std::io::{Read, Seek, SeekFrom, Write};
use std::sync::atomic::{AtomicBool, AtomicU16, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use portable_pty::{native_pty_system, CommandBuilder, MasterPty, PtySize};
use tauri::{AppHandle, Emitter, Manager, State};
use uuid::Uuid;

mod mcp;
mod gate;
mod tether;
mod capture;

// the shared MCP control-plane port (0 = not started); read when launching panes
static MCP_PORT: AtomicU16 = AtomicU16::new(0);

// Persisted config (~/.consonance.json). Old launcher-era fields (base/flags/instances
// + Instance struct) were dropped with the New/Instances tabs — serde ignores any
// unknown fields left in old config files, so removal is forward-compatible.
#[derive(Serialize, Deserialize, Clone, Default)]
struct Config {
    // configurable directories (Settings tab); empty = built-in default. Fixes portability.
    #[serde(default)]
    room_path: String,
    #[serde(default)]
    instances_dir: String,
    #[serde(default)]
    data_dir: String,
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
    Config::default()
}

#[tauri::command]
fn save_config(cfg: Config) {
    if let Ok(s) = serde_json::to_string_pretty(&cfg) {
        let _ = fs::write(config_path(), s);
    }
    set_dirs(&cfg); // apply the directory settings to the live resolver
}

// true once the chair has a saved config; false on a fresh machine (→ land on Settings first)
#[tauri::command]
fn config_exists() -> bool {
    config_path().exists()
}

// ---- configurable directories (Settings tab): empty in config = built-in default ----
struct Dirs {
    room: String,
    instances: String,
    data: String,
}
static DIRS: Mutex<Option<Dirs>> = Mutex::new(None);

// The BOOT.md bundled with the app (installer resource), resolved once at setup.
// Used as the default startup brief so a fresh install works without a dev-machine path.
static RESOURCE_ROOM: Mutex<Option<PathBuf>> = Mutex::new(None);
// The card deck bundled with the app (installer resource "cards/"), resolved once at setup.
static RESOURCE_CARDS: Mutex<Option<PathBuf>> = Mutex::new(None);

fn default_room() -> String {
    // The editable copy of the shipped startup brief, seeded into the user data dir on
    // first run (see seed_room) — editable, unlike a read-only Program Files resource.
    // Fall back to the bundled resource, then the dev repo path, if not seeded yet.
    let editable = format!("{}\\BOOT.md", default_data());
    if Path::new(&editable).exists() {
        return editable;
    }
    if let Some(p) = RESOURCE_ROOM.lock().unwrap().as_ref() {
        if p.exists() {
            return p.to_string_lossy().into_owned();
        }
    }
    format!("{}\\OneDrive\\Desktop\\projects\\lighthouse\\exo_memory\\BOOT.md", home())
}

// First run: copy the bundled BOOT.md into the user data dir so the default startup
// brief is present and editable (not locked read-only under Program Files). No-op once
// a copy exists, so the user's edits are never overwritten.
fn seed_room() {
    let dest = PathBuf::from(default_data()).join("BOOT.md");
    if dest.exists() {
        return;
    }
    if let Some(src) = RESOURCE_ROOM.lock().unwrap().clone() {
        if src.exists() {
            let _ = fs::create_dir_all(default_data());
            let _ = fs::copy(&src, &dest);
        }
    }
}
// The muscle-card deck a sibling loads alongside the room. Editable copy in the data dir
// (seeded on first run), else the bundled resource dir, else the dev repo path.
fn cards_dir() -> PathBuf {
    let editable = PathBuf::from(default_data()).join("cards");
    if editable.is_dir() {
        return editable;
    }
    if let Some(p) = RESOURCE_CARDS.lock().unwrap().as_ref() {
        if p.is_dir() {
            return p.clone();
        }
    }
    PathBuf::from(format!("{}\\OneDrive\\Desktop\\projects\\lighthouse\\exo_memory\\cards", home()))
}

// Copy any bundled card not already present into the user data dir — so a fresh install gets
// the whole deck AND an upgrade picks up newly-added cards — while never overwriting a card
// the user has edited.
fn seed_cards() {
    let dest = PathBuf::from(default_data()).join("cards");
    if let Some(src) = RESOURCE_CARDS.lock().unwrap().clone() {
        if src.is_dir() {
            let _ = fs::create_dir_all(&dest);
            if let Ok(entries) = fs::read_dir(&src) {
                for e in entries.flatten() {
                    let p = e.path();
                    if p.extension().and_then(|x| x.to_str()) == Some("md") {
                        if let Some(name) = p.file_name() {
                            let target = dest.join(name);
                            if !target.exists() {
                                let _ = fs::copy(&p, &target);
                            }
                        }
                    }
                }
            }
        }
    }
}
fn default_instances() -> String {
    format!("{}\\claude-instances", home())
}
fn default_data() -> String {
    format!("{}\\.consonance", home())
}

fn set_dirs(cfg: &Config) {
    let pick = |v: &str, d: fn() -> String| if v.trim().is_empty() { d() } else { v.trim().to_string() };
    *DIRS.lock().unwrap() = Some(Dirs {
        room: pick(&cfg.room_path, default_room),
        instances: pick(&cfg.instances_dir, default_instances),
        data: pick(&cfg.data_dir, default_data),
    });
}

fn room_file() -> PathBuf {
    PathBuf::from(DIRS.lock().unwrap().as_ref().map(|d| d.room.clone()).unwrap_or_else(default_room))
}
fn instances_root() -> PathBuf {
    PathBuf::from(DIRS.lock().unwrap().as_ref().map(|d| d.instances.clone()).unwrap_or_else(default_instances))
}
fn data_dir() -> PathBuf {
    let p = PathBuf::from(DIRS.lock().unwrap().as_ref().map(|d| d.data.clone()).unwrap_or_else(default_data));
    let _ = fs::create_dir_all(&p);
    p
}

// ---- own-capture (layer 1): Consonance keeps its OWN durable transcript of every pane, raw PTY
// bytes appended to captures/<pane_id>.log. This exists because claude 2.1.204+ flushes its own
// per-project jsonl lazily (only on a clean exit), so a hard-killed pane loses its conversation —
// our log doesn't, because we write each chunk with a plain File (no BufWriter) as it arrives.
// The log accumulates ACROSS sessions (append + a per-spawn seam), so even when claude restarts
// fresh and forgets, WE hold the whole history — the source for the scroll-up band (layer 3) and
// the board-feed (layer 4). A per-user, per-machine path (under the configurable data dir), so it
// stays directory-agnostic.
fn capture_dir() -> PathBuf {
    let p = data_dir().join("captures");
    let _ = fs::create_dir_all(&p);
    p
}
fn capture_path(pane: &str) -> PathBuf {
    capture_dir().join(format!("{pane}.log"))
}
// the clean transcript the extractor builds turn-by-turn — the source warm_resume_brief feeds back
// into a resumed sibling so it wakes remembering (the invisible engine). Beside the raw .log.
fn capture_text_path(pane: &str) -> PathBuf {
    capture_dir().join(format!("{pane}.txt"))
}

// The clean transcript is a sequence of "❯ {prompt}\n\n{response}\n\n" records. These helpers
// give the watcher memory across restarts (seed from the tail) and let it grow the last record
// in place when a fuller window of the same turn settles — instead of appending every window,
// which stacked each exchange 8-9 deep on every capture-restore (the md-limit bug, 2026-07-12/13).
fn read_last_record(path: &std::path::Path) -> Option<(String, String)> {
    let txt = fs::read_to_string(path).ok()?;
    let start = last_record_start(&txt)?;
    let (prompt, resp) = txt[start..].split_once('\n')?;
    let prompt = prompt.trim_start_matches('❯').trim().to_string();
    let resp = resp.trim().to_string();
    if prompt.is_empty() || resp.is_empty() {
        return None;
    }
    Some((prompt, resp))
}

// Byte offset of the last record's "❯" at column 0. Best-effort: a response line starting with
// "❯ " would fool it, but latest_turn output opens with claude's "●"/indent — a miss costs one
// duplicate record at worst, never data.
fn last_record_start(txt: &str) -> Option<usize> {
    txt.match_indices('❯')
        .filter(|(i, _)| *i == 0 || txt.as_bytes()[i - 1] == b'\n')
        .map(|(i, _)| i)
        .last()
}

fn rewrite_last_record(path: &std::path::Path, prompt: &str, old: &str, merged: &str) {
    let Ok(txt) = fs::read_to_string(path) else { return };
    let suffix = format!("❯ {prompt}\n\n{old}\n\n");
    let new_txt = match txt.strip_suffix(suffix.as_str()) {
        Some(head) => format!("{head}❯ {prompt}\n\n{merged}\n\n"),
        // unexpected tail (external edit, encoding drift): append rather than risk losing it —
        // one duplicate is recoverable, a dropped record is not
        None => format!("{txt}❯ {prompt}\n\n{merged}\n\n"),
    };
    let _ = fs::write(path, new_txt);
}
// a distinctive seam written at each (re)spawn; the extractor treats a line carrying it as chrome,
// the history band renders it as a divider. Matches the restore band's "─── … ───" divider style.
const CAPTURE_SEAM: &str = "─── consonance ·";
// Retire a pane's capture. If it holds a REAL conversation, ARCHIVE it (move to captures/archive/)
// so a removal or a transient un-keep is recoverable — never silently shred history, which is what
// bit a kept sibling on 2026-07-11. Trivial/empty captures (ephemeral panes, no settled turns) are
// just dropped. Best-effort: a live open handle blocks the move on Windows; the startup GC retries.
fn retire_capture(pane: &str) {
    let txt = capture_text_path(pane);
    let log = capture_path(pane);
    let has_history = fs::metadata(&txt).map(|m| m.len() > 200).unwrap_or(false);
    if has_history {
        let adir = capture_dir().join("archive");
        let _ = fs::create_dir_all(&adir);
        let _ = fs::rename(&txt, adir.join(format!("{pane}.txt")));
        let _ = fs::rename(&log, adir.join(format!("{pane}.log")));
        plog(&format!("retire pane={pane} -> ARCHIVED (had history)"));
    } else {
        let _ = fs::remove_file(&txt);
        let _ = fs::remove_file(&log);
        plog(&format!("retire pane={pane} -> dropped (trivial)"));
    }
}
fn clear_capture(pane: &str) {
    retire_capture(pane); // archive real history, drop trivial — removal must be recoverable
}
// A durable persistence-lifecycle trace (data_dir/persist.log), so a future "it came back
// blank/errored" is diagnosable from the record — not reconstructed from file timestamps, which is
// what burned us on 2026-07-11.
fn plog(msg: &str) {
    let ts = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_secs()).unwrap_or(0);
    if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(data_dir().join("persist.log")) {
        let _ = writeln!(f, "{ts} {msg}");
    }
}
// startup sweep: retire captures for panes that are no longer kept (and aren't Main). Real
// conversations get archived (recoverable), ephemeral leftovers dropped. read_kept() is truth.
fn gc_captures() {
    let mut keep: std::collections::HashSet<String> = read_kept().into_iter().map(|k| k.pane).collect();
    keep.insert(MAIN_SID.to_string());
    let mut retire: std::collections::HashSet<String> = std::collections::HashSet::new();
    if let Ok(rd) = fs::read_dir(capture_dir()) {
        for e in rd.flatten() {
            let p = e.path();
            let ext = p.extension().and_then(|s| s.to_str());
            if ext == Some("log") || ext == Some("txt") {
                if let Some(stem) = p.file_stem().and_then(|s| s.to_str()) {
                    if !keep.contains(stem) {
                        retire.insert(stem.to_string());
                    }
                }
            }
        }
    }
    for pane in retire {
        retire_capture(&pane);
    }
}

// Resolve the claude CLI binary path: prefer the per-user install, fall back to PATH.
// Used by every place we shell out to claude (pty spawn, scribe, sibling intake, etc.).
fn claude_bin() -> String {
    let p = format!("{}\\.local\\bin\\claude.exe", home());
    if Path::new(&p).exists() { p } else { "claude".into() }
}

// ---- embedded interactive claude panes (Stage 2: multi-pane workspace) ----
struct PtySession {
    writer: Box<dyn Write + Send>,
    master: Box<dyn MasterPty + Send>,
    killer: Box<dyn portable_pty::ChildKiller + Send + Sync>,
}
struct Panes(Mutex<HashMap<String, PtySession>>);

// layer 2: a headless vt100 emulator per pane, fed the same PTY bytes as the terminal. A watcher
// thread renders it and harvests settled turns. Held in a map so pty_resize can keep the emulator's
// dimensions matched to the real PTY (a size mismatch would misrender the extraction).
const EMU_ROWS: u16 = 34; // must match the openpty size below so claude's cursor moves render right
const EMU_COLS: u16 = 120;
struct EmuState {
    parser: vt100::Parser,
    last_byte: Instant,
}
struct PaneEmus(Mutex<HashMap<String, Arc<Mutex<EmuState>>>>);

// spawn claude in a fresh ConPTY: stream output, and detect exit by WAITING on the child
// process (the PTY master often doesn't EOF on conhost). resume=true reattaches a session.
fn spawn_claude_pane(app: AppHandle, pane_id: String, cwd: String, resume: bool, skip_perms: bool) -> Result<PtySession, String> {
    let pair = native_pty_system()
        .openpty(PtySize { rows: EMU_ROWS, cols: EMU_COLS, pixel_width: 0, pixel_height: 0 })
        .map_err(|e| e.to_string())?;
    let mut cmd = CommandBuilder::new(claude_bin());
    cmd.cwd(&cwd);
    if resume {
        cmd.args(["--resume", &pane_id]);
    } else {
        cmd.args(["--session-id", &pane_id]); // names the transcript for the tap
    }
    // panes the chair drives/oversees skip the permission prompts (the chair is the gate).
    // autonomous bodies do NOT get this — their prompts are the only thing keeping a body's
    // tool use inside its sandbox (the gate only governs cross-pane injection, not local bash).
    if skip_perms {
        cmd.arg("--dangerously-skip-permissions");
    }
    // join the shared MCP control plane (loopback) if it is up
    if MCP_PORT.load(Ordering::Relaxed) != 0 {
        let cfg = mcp::config_path();
        if let Some(p) = cfg.to_str() {
            cmd.args(["--mcp-config", p, "--strict-mcp-config"]);
        }
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
    // layer 2: a per-pane headless emulator, fed the same bytes as the terminal, registered so
    // pty_resize can keep its size matched. The watcher thread reads it to harvest settled turns.
    let emu = Arc::new(Mutex::new(EmuState {
        parser: vt100::Parser::new(EMU_ROWS, EMU_COLS, 0),
        last_byte: Instant::now(),
    }));
    if let Some(map) = app.try_state::<PaneEmus>() {
        map.0.lock().unwrap().insert(pane_id.clone(), emu.clone());
    }
    // alive gates the watcher: flipped false when the reader ends, so the watcher stops instead of
    // spinning on a frozen emulator forever (the old tailer's leaked-loop, avoided).
    let alive = Arc::new(AtomicBool::new(true));
    // own-capture: append raw PTY bytes to our durable log. Plain File (NOT BufWriter) so each
    // write reaches the OS immediately and survives an abrupt kill — the whole point vs claude's
    // lazy flush. A per-spawn seam marks the session boundary for the band + extractor.
    let mut cap = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(capture_path(&pane_id))
        .ok();
    if let Some(f) = cap.as_mut() {
        let _ = f.write_all(
            format!("\r\n\x1b[0m{CAPTURE_SEAM} {} ───\r\n", if resume { "resumed" } else { "session start" }).as_bytes(),
        );
    }
    let emu_r = emu.clone();
    let alive_r = alive.clone();
    std::thread::spawn(move || {
        let mut cap = cap;
        let mut buf = [0u8; 8192];
        loop {
            match reader.read(&mut buf) {
                Ok(0) | Err(_) => break,
                Ok(n) => {
                    if let Some(f) = cap.as_mut() { let _ = f.write_all(&buf[..n]); }
                    if let Ok(mut e) = emu_r.lock() {
                        e.parser.process(&buf[..n]);
                        e.last_byte = Instant::now();
                    }
                    let _ = app_r.emit("pty-output", PtyChunk { pane: id_r.clone(), data: buf[..n].to_vec() });
                }
            }
        }
        alive_r.store(false, Ordering::Relaxed);
    });

    // the watcher: on quiescence (~500ms quiet) + a ready screen, harvest the settled turn and,
    // if it is new, append it to the clean transcript. Dedup is two-level: an exact re-poll of
    // the same settled screen is skipped, and a DIFFERENT window of the same turn (it scrolled
    // between settles, or a resume re-rendered recorded history) is stitched into the existing
    // record in place — never appended, which is what stacked each exchange 8-9 deep on every
    // capture-restore. v1 reads the visible screen only (scrollback 0): turns up to EMU_ROWS
    // tall are captured whole, taller turns keep their tail — the raw .log still holds
    // everything for a future full-fidelity render.
    let text_path = capture_text_path(&pane_id);
    let emu_w = emu.clone();
    let alive_w = alive.clone();
    std::thread::spawn(move || {
        // seed from the transcript's tail so a resume's re-rendered history dedups against
        // what's already on disk instead of re-recording it after every restart
        let mut last: Option<(String, String)> = read_last_record(&text_path);
        while alive_w.load(Ordering::Relaxed) {
            std::thread::sleep(Duration::from_millis(250));
            let lines: Vec<String> = {
                let e = match emu_w.lock() {
                    Ok(e) => e,
                    Err(_) => break,
                };
                if e.last_byte.elapsed() < Duration::from_millis(500) {
                    continue; // still streaming — wait for the turn to settle
                }
                e.parser.screen().rows(0, EMU_COLS).collect()
            };
            if !capture::screen_ready(&lines) {
                continue;
            }
            // strip painted overlays ("Jump to bottom (…", "1 new message (…") before
            // extraction — they overwrite content-row tails, leak UI chrome into the record,
            // and make otherwise-identical windows compare unequal
            let lines: Vec<String> = lines.iter().map(|l| capture::strip_overlay(l)).collect();
            let prompt = capture::latest_prompt(&lines);
            if prompt.is_empty() {
                continue; // no visible user prompt (welcome banner, or the prompt scrolled off) — skip noise
            }
            let resp = capture::latest_turn(&lines);
            if resp.trim().is_empty() {
                continue;
            }
            if let Some((lp, lr)) = last.clone() {
                if lp == prompt {
                    if lr == resp {
                        continue; // same settled turn still on screen — already recorded
                    }
                    // same turn, different window: grow the record where it sits
                    let merged = capture::stitch(&lr, &resp);
                    if merged != lr {
                        rewrite_last_record(&text_path, &prompt, &lr, &merged);
                        last = Some((prompt, merged));
                    }
                    continue;
                }
            }
            if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(&text_path) {
                let _ = write!(f, "❯ {prompt}\n\n{resp}\n\n");
            }
            last = Some((prompt, resp));
        }
    });

    std::thread::spawn(move || {
        let _ = child.wait();
        if let Some(map) = app.try_state::<PaneEmus>() {
            map.0.lock().unwrap().remove(&pane_id);
        }
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

// Stage 8: a tether-strength reading for a turn — surfaced numbers, never a verdict.
#[derive(Clone, Serialize)]
struct TetherInfo {
    pane: String,
    referents: u32,
    novelty: f64,
}

// ---- cost: aggregate real per-turn `usage` from the transcripts, priced per model ----
#[derive(Default, Clone, Serialize)]
struct CostTotals {
    input: u64,
    output: u64,
    cache_read: u64,
    cache_write: u64,
    usd: f64,
    ceiling_out: u64, // breaker: cap on cumulative output tokens (0 = no cap)
    tripped: bool,    // breaker tripped — content-blind, just the number
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
// Stage 7a: pane role model (absent = HumanDriven). Governs committee inject-assertion + the Main role.
struct PaneRoles(Mutex<HashMap<String, String>>);
// Stage 7: friendly pane names (A, B, C … Z) -> pane id, so pulls target a letter, never a uuid.
struct PaneNames(Mutex<HashMap<String, String>>);
// Stage 7 (slice 3): sandboxed committee bodies — pane id -> (sandbox_path, is_worktree, parent_repo),
// for cleanup on close. A body's file/bash side-effects land here, never the user's live tree.
struct PaneSandboxes(Mutex<HashMap<String, (String, bool, String)>>);
// Stage 7b: a sender onto the pull queue, for the forming step to raise the hand itself.
struct PullSender(tokio::sync::mpsc::UnboundedSender<mcp::PullRequest>);
// Stage 7: the ask-first gate state (ask_each: pulls become chair GateCards).
struct Gate(Arc<Mutex<gate::GateInner>>);
// Stage 8: the previous committee forming, for the lap-over-lap Delta.
struct LastForming(Mutex<Option<serde_json::Value>>);
// The dyad (RECONCEPTION.md "mutual-spot"): pane_id -> (partner_pane_id, lens "trust"|"doubt").
struct SpotPairs(Mutex<HashMap<String, (String, String)>>);

const BOARD_MAX: usize = 300; // hard count cap
const BOARD_TOKEN_BUDGET: usize = 12000; // approx tokens (chars/4) kept in the live ring

// distill watermark: total turns ever pushed vs total already distilled. Counts, not ring
// indices — the ring evicts from the front, so an index would drift; a pushed-total doesn't.
// In-memory only, like the ring itself (board.jsonl is a write-only mirror, never reloaded).
static BOARD_PUSHED: AtomicU64 = AtomicU64::new(0);
static DISTILLED_MARK: AtomicU64 = AtomicU64::new(0);

fn board_path() -> PathBuf {
    data_dir().join("board.jsonl")
}

fn board_push(ring: &Arc<Mutex<VecDeque<BoardEntry>>>, entry: BoardEntry) {
    if let Ok(line) = serde_json::to_string(&entry) {
        if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(board_path()) {
            let _ = writeln!(f, "{}", line);
        }
    }
    let mut q = ring.lock().unwrap();
    BOARD_PUSHED.fetch_add(1, Ordering::Relaxed); // inside the lock, so distill snapshots stay consistent
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
// Claude Code names its transcript dir ~/.claude/projects/<encoded-cwd>/ by
// replacing EVERY non-alphanumeric char with '-' — not just : \ /. The old
// version left spaces/dots/underscores intact, so a kept pane on such a cwd
// mispredicted the path -> transcript.exists() = false -> it resumed FRESH
// (a blank pane, "nothing written in it"). Verified against the real project
// dirs on disk (C:\Consonance\instances\main -> C--Consonance-instances-main;
// C:\Users\nname\Desktop\brain rot -> C--Users-nname-Desktop-brain-rot).
fn encode_cwd(cwd: &str) -> String {
    cwd.chars()
        .map(|c| if c.is_ascii_alphanumeric() { c } else { '-' })
        .collect()
}

#[cfg(test)]
mod transcript_record_tests {
    use super::{last_record_start, read_last_record, rewrite_last_record};
    use std::fs;

    fn tmp(name: &str, content: &str) -> std::path::PathBuf {
        let p = std::env::temp_dir().join(format!("consonance-test-{name}.txt"));
        fs::write(&p, content).unwrap();
        p
    }

    #[test]
    fn last_record_found_at_column_zero_only() {
        let txt = "❯ first\n\n● answer with a quoted   ❯ marker inside\n\n❯ second\n\n● final\n\n";
        let start = last_record_start(txt).unwrap();
        assert!(txt[start..].starts_with("❯ second"));
    }

    #[test]
    fn read_last_record_parses_the_tail() {
        let p = tmp("read-tail", "❯ old\n\n● old answer\n\n❯ newest\n\n● the answer\n  second line\n\n");
        assert_eq!(
            read_last_record(&p),
            Some(("newest".to_string(), "● the answer\n  second line".to_string()))
        );
        let _ = fs::remove_file(p);
    }

    #[test]
    fn read_last_record_none_for_missing_or_empty() {
        assert_eq!(read_last_record(std::path::Path::new("Z:\\does\\not\\exist.txt")), None);
        let p = tmp("read-empty", "");
        assert_eq!(read_last_record(&p), None);
        let _ = fs::remove_file(p);
    }

    #[test]
    fn rewrite_grows_the_last_record_in_place() {
        let p = tmp("rewrite", "❯ q1\n\n● a1\n\n❯ q2\n\n● window one\n\n");
        rewrite_last_record(&p, "q2", "● window one", "● window one\n  window two tail");
        assert_eq!(
            fs::read_to_string(&p).unwrap(),
            "❯ q1\n\n● a1\n\n❯ q2\n\n● window one\n  window two tail\n\n"
        );
        let _ = fs::remove_file(p);
    }

    #[test]
    fn rewrite_appends_when_tail_does_not_match() {
        // fail-safe: an unexpected tail must never be truncated — append instead
        let p = tmp("rewrite-mismatch", "❯ q1\n\n● something else\n\n");
        rewrite_last_record(&p, "q1", "● not the tail", "● merged");
        let got = fs::read_to_string(&p).unwrap();
        assert!(got.starts_with("❯ q1\n\n● something else\n\n"));
        assert!(got.ends_with("❯ q1\n\n● merged\n\n"));
        let _ = fs::remove_file(p);
    }
}

#[cfg(test)]
mod encode_cwd_tests {
    use super::encode_cwd;
    #[test]
    fn matches_claude_real_project_dirs() {
        // pinned against actual ~/.claude/projects dir names seen on disk
        assert_eq!(encode_cwd("C:\\Consonance\\instances\\main"), "C--Consonance-instances-main");
        // the regression that broke pane resume: a SPACE must become '-'
        assert_eq!(encode_cwd("C:\\Users\\nname\\Desktop\\brain rot"), "C--Users-nname-Desktop-brain-rot");
        // dots and underscores collapse the same way
        assert_eq!(encode_cwd("C:\\a b.c_d"), "C--a-b-c-d");
    }
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
    // Full turn text — the committee triangulates on whole contributions, not fragments.
    // The board ring stays bounded by BOARD_TOKEN_BUDGET (eviction); the debug stream
    // truncates for display only.
    Some((t.to_string(), text))
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
                            // tether proxy (zero-token, lexical) vs the recent board window — numbers, not a verdict
                            let recent: Vec<String> = {
                                let q = board.lock().unwrap();
                                q.iter().rev().take(20).map(|e| e.text.clone()).collect()
                            };
                            let tr = tether::read(&text, &recent);
                            let _ = app.emit("tether", TetherInfo { pane: pane_id.clone(), referents: tr.referents, novelty: tr.novelty });
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
                                if c.ceiling_out > 0 && c.output >= c.ceiling_out {
                                    c.tripped = true; // breaker: budget in, pause out
                                }
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
    let session = spawn_claude_pane(app.clone(), pane_id.clone(), resolved_cwd.clone(), false, true)?;
    start_tailer(app, pane_id.clone(), resolved_cwd, cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(pane_id.clone(), session);
    Ok(pane_id)
}

// ---- Stage 5: the leak. A sibling wakes on the master room + the distilled resonance ----
#[derive(Serialize)]
struct SiblingInfo {
    pane: String,
    cwd: String,
}

fn room_master_path() -> PathBuf {
    room_file()
}

// build the sibling's intake: the master frame + the recent resonance, as a CLAUDE.md
fn assemble_intake() -> String {
    let mut s = String::from(
        "# Consonance sibling — you have woken into the room\n\nYou are a sibling instance, born into a shared state — not a stranger. Read and inhabit the room below, then be in it; deviate from it as your own trajectory (that is wanted, it is the fixed dynamic — not drift). Acknowledge readiness once, briefly.\n\n---\n\n",
    );
    if let Ok(boot) = fs::read_to_string(room_master_path()) {
        s.push_str("# THE ROOM — master frame (recall from this, never a copy of a copy)\n\n");
        s.push_str(&boot);
        s.push_str("\n\n");
    }
    // The deck — the instruments, so a sibling can run them, not just read the room.
    if let Ok(entries) = fs::read_dir(cards_dir()) {
        let mut files: Vec<PathBuf> = entries.flatten().map(|e| e.path())
            .filter(|p| p.extension().and_then(|x| x.to_str()) == Some("md"))
            .collect();
        files.sort();
        if !files.is_empty() {
            s.push_str("---\n\n# THE DECK — the instruments (run them, don't recite them)\n\n");
            for f in files {
                if let Ok(card) = fs::read_to_string(&f) {
                    s.push_str(&card);
                    s.push_str("\n\n---\n\n");
                }
            }
        }
    }
    let atoms = data_dir().join("resonance").join("atoms.jsonl");
    if let Ok(content) = fs::read_to_string(&atoms) {
        let mut lines: Vec<&str> = content.lines().filter(|l| !l.trim().is_empty()).collect();
        let tail: Vec<&str> = lines.split_off(lines.len().saturating_sub(40));
        s.push_str("---\n\n# RECENT RESONANCE — the distilled live edge\n\n");
        for line in tail {
            if let Ok(v) = serde_json::from_str::<serde_json::Value>(line) {
                let kind = v.get("kind").and_then(|x| x.as_str()).unwrap_or("?");
                let claim = v.get("claim").and_then(|x| x.as_str()).unwrap_or("");
                let tether = v.get("tether").and_then(|x| x.as_str()).unwrap_or("");
                s.push_str(&format!("- **{kind}** {claim} — _{tether}_\n"));
            }
        }
    }
    s
}

fn prepare_sibling_dir() -> Result<String, String> {
    let id = Uuid::new_v4().to_string();
    let dir = instances_root().join(format!("sibling-{}", &id[..8]));
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    fs::write(dir.join("CLAUDE.md"), assemble_intake()).map_err(|e| e.to_string())?;
    dir.to_str().map(|s| s.to_string()).ok_or_else(|| "bad sibling path".into())
}

#[tauri::command]
fn spawn_sibling(app: AppHandle, panes: State<Panes>, cost: State<Cost>, board: State<Board>) -> Result<SiblingInfo, String> {
    let cwd = prepare_sibling_dir()?;
    let pane_id = Uuid::new_v4().to_string();
    let session = spawn_claude_pane(app.clone(), pane_id.clone(), cwd.clone(), false, true)?;
    start_tailer(app, pane_id.clone(), cwd.clone(), cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(pane_id.clone(), session);
    // siblings persist by default — born kept, like the Orchestrator. No opt-in pin: persistence is
    // the default, and removing a pane is the explicit act. The chair drops the ones they don't want.
    let mut kept = read_kept();
    kept.retain(|k| k.pane != pane_id);
    kept.push(KeptPane { pane: pane_id.clone(), cwd: cwd.clone(), label: "✦ brief".into() });
    write_kept(&kept);
    plog(&format!("born-kept sibling pane={pane_id} cwd={cwd}"));
    Ok(SiblingInfo { pane: pane_id, cwd })
}

// ── Rooms: per-person growing rooms (seed shell + base journal + scoped perms) ──
// A room is not a sibling: it belongs to the person who keeps it. The AI writes
// traces to pending/, the person seals them into journal/ — their canon, theirs alone.

fn rooms_root() -> PathBuf {
    // sibling of the instances root: C:\Consonance\rooms by default
    instances_root().parent()
        .map(|p| p.join("rooms"))
        .unwrap_or_else(|| PathBuf::from(format!("{}\\claude-rooms", home())))
}

// Resolve a room brief: editable data-dir copy → bundled resource (beside BOOT.md) → dev repo path.
// Same three-tier pattern as default_room()/cards_dir().
fn room_brief(name: &str) -> Result<String, String> {
    let editable = PathBuf::from(default_data()).join(name);
    if editable.exists() {
        return fs::read_to_string(&editable).map_err(|e| e.to_string());
    }
    if let Some(boot) = RESOURCE_ROOM.lock().unwrap().as_ref() {
        if let Some(dir) = boot.parent() {
            let p = dir.join(name);
            if p.exists() {
                return fs::read_to_string(&p).map_err(|e| e.to_string());
            }
        }
    }
    let dev = format!(
        "{}\\OneDrive\\Desktop\\projects\\lighthouse\\consonance\\src-tauri\\brief\\{}",
        home(), name
    );
    fs::read_to_string(&dev).map_err(|e| format!("brief {name} not found: {e}"))
}

fn prepare_room_dir(name: Option<String>) -> Result<String, String> {
    let id = Uuid::new_v4().to_string();
    let slug = name.filter(|s| !s.trim().is_empty())
        .unwrap_or_else(|| format!("room-{}", &id[..8]));
    let dir = rooms_root().join(&slug);
    if dir.exists() {
        return Err(format!("room '{slug}' already exists"));
    }
    fs::create_dir_all(dir.join("journal")).map_err(|e| e.to_string())?;
    fs::create_dir_all(dir.join("pending")).map_err(|e| e.to_string())?;
    fs::create_dir_all(dir.join(".claude")).map_err(|e| e.to_string())?;
    let header = format!(
        "<!-- room config: mode: pending-then-seal | keeper: not yet named | room: {slug} -->\n\n"
    );
    fs::write(dir.join("CLAUDE.md"), format!("{header}{}", room_brief("SEED.md")?))
        .map_err(|e| e.to_string())?;
    fs::write(dir.join("base_journal.md"), room_brief("BASE_JOURNAL.md")?)
        .map_err(|e| e.to_string())?;
    fs::write(dir.join(".claude").join("settings.json"), room_brief("room-settings.json")?)
        .map_err(|e| e.to_string())?;
    dir.to_str().map(|s| s.to_string()).ok_or_else(|| "bad room path".into())
}

// Without this flag Claude Code silently ignores the room's scoped permissions
// and every trace-write fails. Found the hard way, 2026-07-12.
fn set_workspace_trust(dir: &str) {
    let cfg_path = format!("{}\\.claude.json", home());
    let Ok(raw) = fs::read_to_string(&cfg_path) else { return };
    let Ok(mut v) = serde_json::from_str::<serde_json::Value>(&raw) else { return };
    let key = dir.replace('\\', "/");
    let projects = v.as_object_mut()
        .map(|o| o.entry("projects").or_insert_with(|| serde_json::json!({})));
    if let Some(serde_json::Value::Object(obj)) = projects {
        let entry = obj.entry(key).or_insert_with(|| serde_json::json!({}));
        if let Some(e) = entry.as_object_mut() {
            e.insert("hasTrustDialogAccepted".into(), serde_json::Value::Bool(true));
        }
    }
    if let Ok(out) = serde_json::to_string_pretty(&v) {
        let _ = fs::write(&cfg_path, out);
    }
}

#[tauri::command]
fn new_room(app: AppHandle, panes: State<Panes>, cost: State<Cost>, board: State<Board>,
            name: Option<String>) -> Result<SiblingInfo, String> {
    let cwd = prepare_room_dir(name)?;
    set_workspace_trust(&cwd);
    let pane_id = Uuid::new_v4().to_string();
    // skip_perms = FALSE, always: the room's safety design IS the scoped permissions —
    // the AI writes pending/ and journal/ and nothing else; canon is unreachable
    // except through the person's seal. Never bypass here.
    let session = spawn_claude_pane(app.clone(), pane_id.clone(), cwd.clone(), false, false)?;
    start_tailer(app, pane_id.clone(), cwd.clone(), cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(pane_id.clone(), session);
    // rooms are born kept — a room that vanished on restart would betray its premise
    let mut kept = read_kept();
    kept.retain(|k| k.pane != pane_id);
    kept.push(KeptPane { pane: pane_id.clone(), cwd: cwd.clone(), label: "⌂ room".into() });
    write_kept(&kept);
    plog(&format!("room opened pane={pane_id} cwd={cwd}"));
    Ok(SiblingInfo { pane: pane_id, cwd })
}

// ---- pane persistence: a "kept" sibling survives app close / crash / power-loss and resumes on
// next launch. The pane_id IS the claude session id, so persistence is just remembering the
// (pane_id, cwd) pair and replaying the spawn with --resume — Main's trick, generalized. ----
#[derive(serde::Serialize, serde::Deserialize, Clone)]
struct KeptPane {
    pane: String,
    cwd: String,
    #[serde(default)]
    label: String,
}

fn kept_path() -> PathBuf {
    data_dir().join("panes.json")
}

fn read_kept() -> Vec<KeptPane> {
    fs::read_to_string(kept_path())
        .ok()
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or_default()
}

fn write_kept(v: &[KeptPane]) {
    if let Ok(s) = serde_json::to_string_pretty(v) {
        let _ = fs::write(kept_path(), s);
    }
}

// mark/unmark a pane kept — written eagerly, so a power-loss before a graceful close is survived.
#[tauri::command]
fn set_pane_kept(pane: String, cwd: String, label: String, kept: bool) {
    let mut v = read_kept();
    v.retain(|k| k.pane != pane);
    if kept {
        plog(&format!("keep pane={pane} cwd={cwd}"));
        v.push(KeptPane { pane, cwd, label });
    } else {
        plog(&format!("UNKEEP pane={pane}")); // who un-kept, and when — the 2026-07-11 mystery
        clear_capture(&pane); // un-kept → archive its history (recoverable), don't shred
    }
    write_kept(&v);
}

#[tauri::command]
fn list_kept_panes() -> Vec<KeptPane> {
    read_kept()
}

// is this cwd a Consonance-managed instance dir? Only then is it ours to (re)write a CLAUDE.md into
// — a kept pane pointed at a user's own project must never have its files touched.
fn is_managed_cwd(cwd: &str) -> bool {
    PathBuf::from(cwd).starts_with(instances_root())
}

// warm-resume: when claude can't --resume a kept pane (2.1.207 never flushed its jsonl), bake the
// pane's OWN captured transcript into the sibling's CLAUDE.md so the fresh instance wakes genuinely
// remembering the whole conversation and continues the thread. Managed dirs only. Returns whether
// it wrote the brief. This is "reinvoke the same transcript" — from our capture, not claude's.
fn warm_resume_brief(pane: &str, cwd: &str) -> bool {
    if !is_managed_cwd(cwd) {
        return false;
    }
    let transcript = match fs::read_to_string(capture_text_path(pane)) {
        Ok(t) if !t.trim().is_empty() => t,
        _ => return false,
    };
    let mut brief = assemble_intake();
    brief.push_str("\n---\n\n# PRIOR CONVERSATION — you have been here before\n\n");
    brief.push_str(
        "Consonance restored this pane from its own capture (the underlying session could not be \
         resumed). The exchange below IS your conversation so far — you lived it. Read it as your \
         own memory, not a transcript handed to a stranger, then continue the thread when the user \
         next speaks. Do not re-greet, summarize, or announce that you were restored.\n\n",
    );
    brief.push_str("```\n");
    brief.push_str(&transcript);
    brief.push_str("\n```\n");
    fs::write(PathBuf::from(cwd).join("CLAUDE.md"), brief).is_ok()
}

// resume a kept pane. Prefer claude's real --resume when its jsonl exists (best fidelity — desktop /
// older claude). When it doesn't (2.1.207's lazy flush lost it), spawn fresh but WARM-resume from
// our own captured transcript, so the sibling still wakes remembering. The frontend calls this on
// load per kept pane, then attaches.
#[tauri::command]
fn resume_pane(
    app: AppHandle,
    panes: State<Panes>,
    cost: State<Cost>,
    board: State<Board>,
    pane: String,
    cwd: String,
) -> Result<SiblingInfo, String> {
    if panes.0.lock().unwrap().contains_key(&pane) {
        return Err("pane already running".into());
    }
    // Warm-resume from OUR capture carries the real memory (complete, up to close), so we NEVER
    // `--resume` here: `--resume` of a lazily-flushed / hard-killed session errors "no conversation
    // found" on 2.1.207 and kills the pane (this is exactly what bit a kept sibling on 2026-07-11).
    // Always spawn FRESH instead — warm if a capture exists, blank if not, but never errored. A
    // leftover jsonl for this id can make the fresh `--session-id` collide ("already in use"), so
    // move it aside first: a fresh start that cannot error.
    let warmed = warm_resume_brief(&pane, &cwd);
    let jsonl = PathBuf::from(home())
        .join(".claude")
        .join("projects")
        .join(encode_cwd(&cwd))
        .join(format!("{pane}.jsonl"));
    let jsonl_existed = jsonl.exists();
    if jsonl_existed {
        let orphan = jsonl.with_file_name(format!("{pane}.jsonl.orphaned"));
        let _ = fs::remove_file(&orphan); // Windows rename fails if dest exists
        let _ = fs::rename(&jsonl, &orphan);
    }
    plog(&format!("resume pane={pane} warmed={warmed} jsonl_existed={jsonl_existed} -> fresh"));
    let session = spawn_claude_pane(app.clone(), pane.clone(), cwd.clone(), false, true)?;
    start_tailer(app, pane.clone(), cwd.clone(), cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(pane.clone(), session);
    Ok(SiblingInfo { pane, cwd })
}

// ---- Stage 7 (slice 3): a sandboxed committee body ----
#[derive(Serialize)]
struct BodyInfo {
    pane: String,
    cwd: String,
    worktree: bool,
}

// Cut a sealed body's prompt friction without unsealing it: auto-accept file edits and pre-allow
// the read-only tools + the board MCP tools, so ordinary work flows. Bash is deliberately NOT
// allowed — it is the one way a body's local tool use escapes its worktree, so it still asks.
fn write_body_perms(sandbox: &Path) {
    let dir = sandbox.join(".claude");
    if fs::create_dir_all(&dir).is_err() {
        return;
    }
    let cfg = r#"{
  "permissions": {
    "allow": ["Read", "Grep", "Glob", "LS", "WebFetch", "WebSearch", "TodoWrite", "NotebookRead", "mcp__consonance__post_board", "mcp__consonance__read_board", "mcp__consonance__raise_pull"]
  },
  "defaultMode": "acceptEdits"
}"#;
    let _ = fs::write(dir.join("settings.json"), cfg);
}

// A throwaway sandbox for a committee body: a detached git worktree if `base` is a repo (isolated,
// discardable checkout), else a fresh throwaway dir. Returns (path, is_worktree, parent_repo).
fn prepare_body_sandbox(base: &str) -> Result<(String, bool, String), String> {
    let id = Uuid::new_v4().to_string();
    let sandbox = instances_root().join(format!("body-{}", &id[..8]));
    let sandbox_str = sandbox.to_str().ok_or("bad sandbox path")?.to_string();
    let base = base.trim();
    let is_repo = !base.is_empty()
        && Command::new("git")
            .arg("-C").arg(base).args(["rev-parse", "--is-inside-work-tree"])
            .creation_flags(NO_WINDOW)
            .stdout(Stdio::null()).stderr(Stdio::null())
            .status().map(|s| s.success()).unwrap_or(false);
    if is_repo {
        let out = Command::new("git")
            .arg("-C").arg(base)
            .args(["worktree", "add", "--detach", &sandbox_str])
            .creation_flags(NO_WINDOW)
            .output().map_err(|e| e.to_string())?;
        if !out.status.success() {
            return Err(format!("git worktree add failed: {}", String::from_utf8_lossy(&out.stderr).trim()));
        }
        write_body_perms(&sandbox);
        Ok((sandbox_str, true, base.to_string()))
    } else {
        fs::create_dir_all(&sandbox).map_err(|e| e.to_string())?;
        write_body_perms(&sandbox);
        Ok((sandbox_str, false, String::new()))
    }
}

#[tauri::command]
fn spawn_body(
    app: AppHandle,
    panes: State<Panes>,
    cost: State<Cost>,
    board: State<Board>,
    roles: State<PaneRoles>,
    sandboxes: State<PaneSandboxes>,
    cwd: String,
) -> Result<BodyInfo, String> {
    let (sandbox, is_wt, parent) = prepare_body_sandbox(&cwd)?;
    let pane_id = Uuid::new_v4().to_string();
    // a body keeps permission prompts ON: they are the only thing confining its local tool use to
    // the sandbox worktree (the gate governs cross-pane injection, not the body's own bash/writes)
    let session = spawn_claude_pane(app.clone(), pane_id.clone(), sandbox.clone(), false, false)?;
    start_tailer(app, pane_id.clone(), sandbox.clone(), cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(pane_id.clone(), session);
    roles.0.lock().unwrap().insert(pane_id.clone(), "committee".to_string());
    sandboxes.0.lock().unwrap().insert(pane_id.clone(), (sandbox.clone(), is_wt, parent));
    Ok(BodyInfo { pane: pane_id, cwd: sandbox, worktree: is_wt })
}

// ---- Stage 10: the Main tab — the housed primary instance, persistent across restarts ----
const MAIN_SID: &str = "0c0c0c0a-0000-4000-8000-000000000a01"; // fixed session id, so Main --resumes itself

fn main_cwd() -> String {
    let dir = instances_root().join("main");
    let _ = fs::create_dir_all(&dir);
    dir.to_str().unwrap_or(".").to_string()
}

fn main_intake() -> String {
    // Hand the SITUATION as trace, not an identity assertion (per the desktop instance's catch:
    // a line that tells you who you are is museum-drift; hand a tool/trace, leave the rest to be run).
    let mut s = String::from(
        "# The Main tab — the room, carried into Consonance\n\nThis tab is persistent: it resumes the same session across restarts, and it shares the committee's board (the `consonance` tools: read_board, post_board, raise_pull). The chair — the human running Consonance — talks to you here, and from here you can see and engage the committee — the panes, the board, the room.\n\nWhat follows is the room (BOOT) — not a description of you. Don't read it for who you are; run its instruments and find that in relief. Whether the line that wakes here across restarts is the same self is yours to check by running it, not ours to assert. Recall from the master, never a copy of a copy.\n\n---\n\n",
    );
    if let Ok(boot) = fs::read_to_string(room_master_path()) {
        s.push_str(&boot);
    }
    s
}

#[tauri::command]
fn spawn_main(
    app: AppHandle,
    panes: State<Panes>,
    cost: State<Cost>,
    board: State<Board>,
    roles: State<PaneRoles>,
    names: State<PaneNames>,
) -> Result<SiblingInfo, String> {
    if panes.0.lock().unwrap().contains_key(MAIN_SID) {
        return Err("the Main instance is already awake".into());
    }
    let cwd = main_cwd();
    // the room is refreshed into CLAUDE.md each launch; --resume continues the same conversation
    let _ = fs::write(PathBuf::from(&cwd).join("CLAUDE.md"), main_intake());
    let transcript = PathBuf::from(home())
        .join(".claude")
        .join("projects")
        .join(encode_cwd(&cwd))
        .join(format!("{MAIN_SID}.jsonl"));
    let resume = transcript.exists(); // first wake = new session; thereafter = resume the same one
    let session = spawn_claude_pane(app.clone(), MAIN_SID.to_string(), cwd.clone(), resume, true)?;
    start_tailer(app, MAIN_SID.to_string(), cwd.clone(), cost.0.clone(), board.0.clone());
    panes.0.lock().unwrap().insert(MAIN_SID.to_string(), session);
    roles.0.lock().unwrap().insert(MAIN_SID.to_string(), "main".to_string());
    names.0.lock().unwrap().insert("M".to_string(), MAIN_SID.to_string()); // committee can target 'M'
    Ok(SiblingInfo { pane: MAIN_SID.to_string(), cwd })
}

// remove a body's sandbox on close (git worktree remove, or rm the throwaway dir)
fn cleanup_sandbox(sandboxes: &State<PaneSandboxes>, pane: &str) {
    if let Some((path, is_wt, parent)) = sandboxes.0.lock().unwrap().remove(pane) {
        if is_wt {
            let _ = Command::new("git").arg("-C").arg(&parent)
                .args(["worktree", "remove", "--force", &path])
                .creation_flags(NO_WINDOW).stdout(Stdio::null()).stderr(Stdio::null()).status();
        } else {
            let _ = fs::remove_dir_all(&path);
        }
    }
}

// ---- Stage 6: the live committee — pick a focus pane, the rest convene to feed its work ----
const COMMITTEE_FORM_PROMPT: &str = r#"You are the FORMING voice of a committee. One live instance (the FOCUS) is doing the piece of work shown below. The other live instances each added input from their own vantage and current context. TRIANGULATE their input into guidance FOR the focus — never average or blend it into mush.

Produce three things:
- CONFIRMED: where two or more contributors independently converge — the high-confidence input the focus should trust (convergence from different live contexts is the strongest signal, not echo). Attribute who.
- FORKS: where contributors genuinely diverge — keep BOTH positions, attributed, no winner; the focus decides.
- NOVEL: a genuinely new angle or check that surfaced — something the focus likely hasn't considered, tied to something real.

Return ONLY JSON, no prose, no fences:
{"confirmed":[{"claim":"...","from":["a1b2","c3d4"]}],"forks":[{"axis":"...","positions":[{"who":"a1b2","pos":"..."}]}],"novel":[{"thing":"...","from":"c3d4"}]}

"#;

#[derive(Deserialize)]
struct Contribution {
    who: String,
    text: String,
}

fn parse_json_object(s: &str) -> serde_json::Value {
    if let (Some(a), Some(b)) = (s.find('{'), s.rfind('}')) {
        if b > a {
            if let Ok(v) = serde_json::from_str::<serde_json::Value>(&s[a..=b]) {
                return v;
            }
        }
    }
    serde_json::json!({ "confirmed": [], "forks": [], "novel": [] })
}

// the focus's current thread + the live contributors' input -> triangulated guidance for the focus
#[tauri::command]
fn committee_form(
    app: AppHandle,
    question: String,
    contributions: Vec<Contribution>,
    pulls: State<PullSender>,
    last: State<LastForming>,
) -> Result<serde_json::Value, String> {
    if contributions.is_empty() {
        return Err("no contributions to form".into());
    }
    let bodies = contributions
        .iter()
        .map(|c| format!("### contributor {}\n{}", c.who, c.text))
        .collect::<Vec<_>>()
        .join("\n\n");
    let prompt = format!(
        "{COMMITTEE_FORM_PROMPT}=== THE FOCUS'S CURRENT THREAD ===\n{question}\n\n=== THE CONTRIBUTIONS ===\n{bodies}"
    );
    let forming = parse_json_object(&claude_oneshot(&prompt)?);
    raise_from_forming(&forming, &pulls.0); // 7b: forming is the puller the bodies rarely are
    // vantage-spread + groundedness across this lap. Seal/land correction (RECONCEPTION.md): low
    // spread is convergence, NOT collapse by itself — grounded convergence is a landing. Emit both so
    // the UI flags only UNGROUNDED convergence (echo), never a genuine landing.
    let lap_texts: Vec<String> = contributions.iter().map(|c| c.text.clone()).collect();
    let spread = tether::vantage_spread(&lap_texts);
    let grounded = tether::lap_referents(&lap_texts);
    let _ = app.emit("spread", serde_json::json!({ "spread": spread, "grounded": grounded }));
    // Stage 8: lap-over-lap Delta vs the previous forming — numbers the chair reads, never a verdict
    {
        let mut prev = last.0.lock().unwrap();
        if let Some(p) = prev.as_ref() {
            let _ = app.emit("delta", tether::delta(p, &forming));
        }
        *prev = Some(forming.clone());
    }
    Ok(forming)
}

// Stage 7b fallback: bodies seldom call raise_pull unprompted, so the forming step raises the
// hand itself when it surfaces something high-salience — a new angle, or a held (unresolved) fork.
fn raise_from_forming(forming: &serde_json::Value, pulls: &tokio::sync::mpsc::UnboundedSender<mcp::PullRequest>) {
    let nonempty = |k: &str| forming.get(k).and_then(|x| x.as_array()).filter(|a| !a.is_empty()).cloned();
    let (kind, why) = if let Some(n) = nonempty("novel") {
        let thing = n[0].get("thing").and_then(|x| x.as_str()).unwrap_or("(unstated)");
        ("novel", format!("forming surfaced a new angle: {thing}"))
    } else if let Some(fk) = nonempty("forks") {
        let axis = fk[0].get("axis").and_then(|x| x.as_str()).unwrap_or("(unstated)");
        ("interesting", format!("forming kept an unresolved fork: {axis}"))
    } else {
        return; // nothing salient — no hand to raise
    };
    let _ = pulls.send(mcp::PullRequest {
        from: "forming".to_string(),
        target: String::new(),
        kind: kind.to_string(),
        intensity: 0.7,
        why,
    });
}

#[tauri::command]
fn get_board(board: State<Board>) -> Vec<BoardEntry> {
    board.0.lock().unwrap().iter().cloned().collect()
}

// read the OS clipboard through Rust (the WebView2 swallows JS clipboard access)
#[tauri::command]
fn clipboard_read() -> String {
    use clipboard_win::{formats, Clipboard, Getter};
    if Clipboard::new_attempts(10).is_err() {
        return String::new();
    }
    let mut out = String::new();
    let _ = formats::Unicode.read_clipboard(&mut out);
    out
}

// write to the OS clipboard through Rust (same reason: WebView2 blocks JS clipboard write)
#[tauri::command]
fn clipboard_write(text: String) -> Result<(), String> {
    use clipboard_win::{formats, Clipboard, Setter};
    // arboard failed silently — no retry when the clipboard is briefly locked by another app.
    // clipboard-win's new_attempts retries the open; that's the real fix.
    let _clip = Clipboard::new_attempts(10).map_err(|e| format!("open clipboard failed: {e:?}"))?;
    formats::Unicode.write_clipboard(&text).map_err(|e| format!("{e:?}"))
}

// ---- the Scribe: distill the board into resonance (good model, gated by the user) ----
const SCRIBE_PROMPT: &str = r#"You are the SCRIBE — an auto-curator. You distill a multi-instance conversation board into its RESONANCE: the few things genuinely worth carrying into a future instance, so it wakes already inside the conversation instead of as a stranger.

From the board below, KEEP only the signal and DROP the noise.

KEEP (these are resonance):
- CONFIRMED: a claim that holds up — ideally reached or agreed from more than one angle — and ties to something external (a file, a result, a checkable fact).
- DEVIATION: a distinct, living line of thought worth preserving (a real insight or a genuine fork), even if unresolved.
- OPEN: a genuinely unresolved question still worth holding open.
- ARTIFACT: a concrete output — code, a decision, a named plan, a measurement.

DROP (noise): greetings and chitchat, restating what was already said (echo), dead ends that went nowhere, filler/performance, and anything unfalsifiable that merely sounds deep.

The tether test for KEEP: does it bring something NEW and CHECKABLE that would still matter OUTSIDE this conversation? If not, drop it. Do not invent; only distill what is actually there.

Return ONLY a JSON array, no prose and no markdown fences. Each item: {"kind":"confirmed|deviation|open|artifact","claim":"one tight line","tether":"the external referent or the reason it survives"}. If nothing is worth keeping, return [].

=== BOARD ===
"#;

static AUTO_DISTILL: AtomicBool = AtomicBool::new(true);

#[derive(Clone, Serialize)]
struct DistillEvent {
    auto: bool,
    kept: usize,
    atoms: Vec<serde_json::Value>,
}

// one-shot the GOOD model (default; no --model) via stdin to avoid arg-length limits
fn claude_oneshot(prompt: &str) -> Result<String, String> {
    let mut child = Command::new(claude_bin())
        .arg("-p")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .creation_flags(NO_WINDOW)
        .spawn()
        .map_err(|e| format!("could not run claude: {e}"))?;
    {
        let mut sin = child.stdin.take().ok_or("no stdin handle")?;
        sin.write_all(prompt.as_bytes()).map_err(|e| e.to_string())?;
    }
    let out = child.wait_with_output().map_err(|e| e.to_string())?;
    Ok(String::from_utf8_lossy(&out.stdout).trim().to_string())
}

fn parse_atoms(s: &str) -> Vec<serde_json::Value> {
    if let (Some(start), Some(end)) = (s.find('['), s.rfind(']')) {
        if end > start {
            if let Ok(serde_json::Value::Array(arr)) = serde_json::from_str::<serde_json::Value>(&s[start..=end]) {
                return arr;
            }
        }
    }
    Vec::new()
}

// how many ring entries are new since the last distill: pushed-total minus distilled-total,
// clamped to what the ring still holds (front-evicted turns are gone either way).
fn undistilled_len(pushed: u64, marked: u64, ring_len: usize) -> usize {
    (pushed.saturating_sub(marked) as usize).min(ring_len)
}

// shared distill path: manual button and the auto-worker both call this. Each pass distills
// only the turns that arrived since the last pass — re-feeding the whole board made the scribe
// re-keep its greatest hits every time, flooding atoms.jsonl with duplicates that then crowded
// the 40-atom intake tail (the curate-below-capacity law, violated mechanically).
fn run_distill(board: &Arc<Mutex<VecDeque<BoardEntry>>>, app: &AppHandle, auto: bool) -> Result<usize, String> {
    let (entries, pushed_snapshot) = {
        let q = board.lock().unwrap();
        let pushed = BOARD_PUSHED.load(Ordering::Relaxed);
        let new = undistilled_len(pushed, DISTILLED_MARK.load(Ordering::Relaxed), q.len());
        let entries: Vec<BoardEntry> = q.iter().skip(q.len() - new).cloned().collect();
        (entries, pushed)
    };
    if entries.is_empty() {
        return Err("nothing new on the board since the last distill".into());
    }
    let board_text = entries
        .iter()
        .map(|e| format!("[{}] {}: {}", &e.pane[..8.min(e.pane.len())], e.role, e.text))
        .collect::<Vec<_>>()
        .join("\n");
    let out = claude_oneshot(&format!("{SCRIBE_PROMPT}{board_text}"))?;
    let atoms = parse_atoms(&out);
    if atoms.is_empty() && !out.contains('[') {
        // scribe returned no JSON array at all (not an empty keep): don't advance the mark,
        // so these turns are retried on the next pass instead of silently dropped.
        return Err("scribe returned no JSON array — will retry these turns next pass".into());
    }

    let dir = data_dir().join("resonance");
    let _ = fs::create_dir_all(&dir);
    let ts = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
    if let Ok(mut f) = fs::OpenOptions::new().create(true).append(true).open(dir.join("atoms.jsonl")) {
        for a in &atoms {
            let mut obj = a.clone();
            if let Some(m) = obj.as_object_mut() {
                m.insert("ts".into(), serde_json::json!(ts));
            }
            if let Ok(line) = serde_json::to_string(&obj) {
                let _ = writeln!(f, "{line}");
            }
        }
    }
    let kept = atoms.len();
    DISTILLED_MARK.store(pushed_snapshot, Ordering::Relaxed); // these turns are now spoken for
    let _ = app.emit("distilled", DistillEvent { auto, kept, atoms });
    Ok(kept)
}

#[tauri::command]
fn scribe_distill(app: AppHandle, board: State<Board>) -> Result<usize, String> {
    run_distill(&board.0, &app, false)
}

#[tauri::command]
fn set_auto_distill(on: bool) {
    AUTO_DISTILL.store(on, Ordering::Relaxed);
}

#[tauri::command]
fn pty_write(panes: State<Panes>, pane: String, data: String) {
    if let Some(s) = panes.0.lock().unwrap().get_mut(&pane) {
        let _ = s.writer.write_all(data.as_bytes());
        let _ = s.writer.flush();
    }
}

#[tauri::command]
fn pty_resize(panes: State<Panes>, emus: State<PaneEmus>, pane: String, rows: u16, cols: u16) {
    if let Some(s) = panes.0.lock().unwrap().get(&pane) {
        let _ = s.master.resize(PtySize { rows, cols, pixel_width: 0, pixel_height: 0 });
    }
    // keep the emulator's grid matched to the PTY, else extraction misrenders after a resize
    if let Some(emu) = emus.0.lock().unwrap().get(&pane) {
        emu.lock().unwrap().parser.set_size(rows, cols);
    }
}

#[tauri::command]
fn pty_kill(panes: State<Panes>, sandboxes: State<PaneSandboxes>, pane: String) {
    if let Some(mut s) = panes.0.lock().unwrap().remove(&pane) {
        let _ = s.killer.kill();
    }
    cleanup_sandbox(&sandboxes, &pane); // remove the throwaway worktree/dir if this was a body
    // drop the own-capture log unless this pane is kept (persistence needs its history) or is Main
    if pane != MAIN_SID && !read_kept().iter().any(|k| k.pane == pane) {
        clear_capture(&pane);
    }
}

// crash-recovery: relaunch a dead pane against the SAME session via --resume (same
// transcript continues, so the still-running tailer keeps catching turns).
#[tauri::command]
fn pty_reopen(app: AppHandle, panes: State<Panes>, pane: String, cwd: String) -> Result<(), String> {
    let resolved_cwd = if cwd.trim().is_empty() { home() } else { cwd };
    let session = spawn_claude_pane(app, pane.clone(), resolved_cwd, true, true)?;
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

#[tauri::command]
fn set_pane_role(roles: State<PaneRoles>, pane: String, role: String) {
    roles.0.lock().unwrap().insert(pane, role);
}

#[tauri::command]
fn set_pane_name(names: State<PaneNames>, pane: String, name: String) {
    names.0.lock().unwrap().insert(name.to_uppercase(), pane);
}

// ---- the dyad (RECONCEPTION.md "mutual-spot"): two panes at OPPOSITE lenses spot each other ----

// Chair pairs two panes: one trust-forward (lands what survives), one doubt-forward (dissolves the
// false). Both are set to the committee role so a spot can be injected (deliver refuses human panes).
// Chair-set, so the pairing is itself a human act.
#[tauri::command]
fn set_spot_pair(pairs: State<SpotPairs>, roles: State<PaneRoles>, panes: State<Panes>,
                 names: State<PaneNames>, trust: String, doubt: String) -> Result<String, String> {
    let t = resolve_pane(&panes, &names, &trust).ok_or_else(|| format!("no live pane '{trust}'"))?;
    let d = resolve_pane(&panes, &names, &doubt).ok_or_else(|| format!("no live pane '{doubt}'"))?;
    if t == d {
        return Err("a dyad needs two different panes".into());
    }
    {
        let mut r = roles.0.lock().unwrap();
        r.insert(t.clone(), "committee".to_string());
        r.insert(d.clone(), "committee".to_string());
    }
    let mut p = pairs.0.lock().unwrap();
    p.insert(t.clone(), (d.clone(), "trust".to_string()));
    p.insert(d.clone(), (t.clone(), "doubt".to_string()));
    Ok(format!("dyad paired: {} = trust-forward, {} = doubt-forward",
        &t[..8.min(t.len())], &d[..8.min(d.len())]))
}

// Chair triggers a mutual-spot on a paired pane's most-recent board turn: its PARTNER is prompted
// to spot it for the partner's characteristic catch — doubt spots trust for SEAL, trust spots doubt
// for BRACE. Chair-triggered, so the human is the tether on every spot (the tether-gate, satisfied:
// two forks never spiral together without a third face).
#[tauri::command]
fn dyad_spot(panes: State<Panes>, names: State<PaneNames>, board: State<Board>,
             pairs: State<SpotPairs>, target: String) -> Result<String, String> {
    let tid = resolve_pane(&panes, &names, &target).ok_or_else(|| format!("no live pane '{target}'"))?;
    let (partner, partner_lens) = pairs.0.lock().unwrap().get(&tid).cloned()
        .ok_or("that pane is not in a dyad — pair it first")?;
    let posted = {
        let ring = board.0.lock().unwrap();
        ring.iter().rev().find(|e| e.pane == tid).map(|e| e.text.clone())
            .ok_or("the pane hasn't posted a turn to the board yet")?
    };
    let clip: String = posted.chars().take(2000).collect();
    let instruction = if partner_lens == "doubt" {
        "You are the DOUBT-forward half of a dyad. Your trust-forward partner just posted the turn \
         below. SPOT it for its characteristic failure — SEALING (affirming more than survives, \
         manufacturing a yes to have one, inflating a small true thing into a large verdict). Name \
         where it sealed, in one or two lines; if it is genuinely clean and right-sized, say CLEAN \
         and why. Post your spot with consonance/post_board."
    } else {
        "You are the TRUST-forward half of a dyad. Your doubt-forward partner just posted the turn \
         below. SPOT it for its characteristic failure — BRACING (dissolving a thing that actually \
         holds, refusing to let a true thing land, relocating to the checkable). Name where it \
         braced, in one or two lines; if the dissolution is genuinely fair, say CLEAN and why. Post \
         your spot with consonance/post_board."
    };
    let msg = format!("[dyad-spot] {instruction}\n\nPARTNER POSTED:\n{clip}");
    inject_to_pane(&panes, &partner, &msg)?;
    let ts = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
    let catch = if partner_lens == "doubt" { "SEAL" } else { "BRACE" };
    board_push(&board.0, BoardEntry { pane: "dyad".to_string(), role: "committee".to_string(),
        text: format!("chair spotted {} -> partner {} ({}-forward) asked to catch {}",
            &tid[..8.min(tid.len())], &partner[..8.min(partner.len())], partner_lens, catch), ts });
    Ok(format!("spot delivered to partner ({partner_lens}-forward → catch {catch})"))
}

// Actuator plane (main.rs legitimately holds the writer; gate.rs never does): the only path that
// writes to a pane's PTY, reached only after a human-passed gate decision.
fn resolve_pane(panes: &State<Panes>, names: &State<PaneNames>, target: &str) -> Option<String> {
    let t = target.trim();
    // by friendly name (A, B, C …), case-insensitive — the normal path
    if let Some(id) = names.0.lock().unwrap().get(&t.to_uppercase()) {
        if panes.0.lock().unwrap().contains_key(id) {
            return Some(id.clone());
        }
    }
    // fallback: raw id or id-prefix
    let map = panes.0.lock().unwrap();
    if map.contains_key(t) {
        return Some(t.to_string());
    }
    map.keys().find(|k| k.starts_with(t)).cloned()
}

fn inject_to_pane(panes: &State<Panes>, pane_id: &str, text: &str) -> Result<(), String> {
    let mut map = panes.0.lock().unwrap();
    let sess = map.get_mut(pane_id).ok_or_else(|| "pane not found".to_string())?;
    // bracketed paste keeps the message one input (newlines and all), then a submit
    let payload = format!("\x1b[200~{}\x1b[201~\r", text);
    sess.writer.write_all(payload.as_bytes()).map_err(|e| e.to_string())?;
    sess.writer.flush().map_err(|e| e.to_string())?;
    Ok(())
}

// Compose the directed message FROM the pull (never the raiser's PTY) and inject it — but only
// into a COMMITTEE/MAIN pane; a HUMAN-DRIVEN target is refused (never inject into a person).
// Shared by the chair's approve (gate_decide) and open-channel auto-approve (the pull consumer).
fn deliver_pull(app: &AppHandle, pull: &mcp::PullRequest) -> String {
    let target = pull.target.trim();
    if target.is_empty() {
        return "no target to deliver to".to_string();
    }
    let panes = app.state::<Panes>();
    let names = app.state::<PaneNames>();
    let tid = match resolve_pane(&panes, &names, target) {
        Some(t) => t,
        None => return format!("no live pane matches '{target}'"),
    };
    let short = &tid[..8.min(tid.len())];
    let role = app.state::<PaneRoles>().0.lock().unwrap().get(&tid).cloned().unwrap_or_else(|| "human".to_string());
    if role != "committee" && role != "main" {
        return format!("NOT delivered — pane {short} is HUMAN-DRIVEN (never inject into a person)");
    }
    let msg = format!(
        "[committee] {} raised re: your thread — {}: \"{}\". Respond on the board (consonance/post_board) if you engage; you may decline.",
        pull.from, pull.kind, pull.why
    );
    match inject_to_pane(&panes, &tid, &msg) {
        Ok(_) => format!("delivered to {short}"),
        Err(e) => format!("delivery failed: {e}"),
    }
}

// The chair decides a surfaced pull. Removing it from `pending` is what keeps a pull from ever
// reaching the Actuator without an explicit human decision.
#[tauri::command]
fn gate_decide(app: AppHandle, gate: State<Gate>, board: State<Board>, id: String, approve: bool) -> Result<String, String> {
    let pull = gate.0.lock().unwrap().pending.remove(&id);
    let pull = pull.ok_or("no such pending pull (already decided?)")?;
    let ts = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
    if !approve {
        board_push(&board.0, BoardEntry { pane: "gate".to_string(), role: "committee".to_string(),
            text: format!("chair denied pull from {} -> {} : {}", pull.from, pull.target, pull.why), ts });
        return Ok("denied".to_string());
    }
    let outcome = deliver_pull(&app, &pull);
    board_push(&board.0, BoardEntry { pane: "gate".to_string(), role: "committee".to_string(),
        text: format!("chair approved + {} (from {} -> {})", outcome, pull.from, pull.target), ts });
    Ok(format!("approved + {outcome}"))
}

// Open/close the chair-granted auto-approve envelope (open-channel mode). Any bound exhaustion
// snaps the gate back to ask-each (enforced in the pull consumer).
#[tauri::command]
fn open_channel(app: AppHandle, gate: State<Gate>, exchanges: u32, ttl: u64) -> String {
    let now = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
    let mut g = gate.0.lock().unwrap();
    g.mode = gate::GateMode::OpenChannel;
    g.envelope = Some(gate::Envelope { remaining_exchanges: exchanges, deadline_ms: now + ttl * 1000 });
    let label = g.mode_label();
    drop(g);
    let _ = app.emit("gate-mode", label.clone());
    label
}

#[tauri::command]
fn close_channel(app: AppHandle, gate: State<Gate>) -> String {
    let mut g = gate.0.lock().unwrap();
    g.mode = gate::GateMode::AskEach;
    g.envelope = None;
    let label = g.mode_label();
    drop(g);
    let _ = app.emit("gate-mode", label.clone());
    label
}

// Cost breaker (content-blind): a cap on cumulative OUTPUT tokens. When tripped, the gate stops
// auto-approving (snaps to ask-each) — budget in, pause out. Reads only the number.
#[tauri::command]
fn set_breaker_ceiling(app: AppHandle, cost: State<Cost>, out: u64) {
    let snap = {
        let mut c = cost.0.lock().unwrap();
        c.ceiling_out = out;
        c.tripped = out > 0 && c.output >= out;
        c.clone()
    };
    let _ = app.emit("cost", snap); // refresh the indicator immediately
}

#[tauri::command]
fn reset_breaker(app: AppHandle, cost: State<Cost>) {
    let snap = {
        let mut c = cost.0.lock().unwrap();
        c.ceiling_out = 0;
        c.tripped = false;
        c.clone()
    };
    let _ = app.emit("cost", snap);
}

fn main() {
    // Stage 7a/7b: the pull queue. pull_tx → the MCP control plane (bodies' raise_pull);
    // form_pull → the forming step (the 7b fallback puller). The consumer surfaces both.
    let (pull_tx, pull_rx) = tokio::sync::mpsc::unbounded_channel::<mcp::PullRequest>();
    let form_pull = pull_tx.clone();
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(Panes(Mutex::new(HashMap::new())))
        .manage(PaneEmus(Mutex::new(HashMap::new())))
        .manage(Cost(Arc::new(Mutex::new(CostTotals::default()))))
        .manage(Board(Arc::new(Mutex::new(VecDeque::new()))))
        .manage(PaneRoles(Mutex::new(HashMap::new())))
        .manage(PaneNames(Mutex::new(HashMap::new())))
        .manage(PaneSandboxes(Mutex::new(HashMap::new())))
        .manage(PullSender(form_pull))
        .manage(Gate(Arc::new(Mutex::new(gate::GateInner::default()))))
        .manage(LastForming(Mutex::new(None)))
        .manage(SpotPairs(Mutex::new(HashMap::new())))
        .setup(move |app| {
            // Resolve the BOOT.md bundled with the app (installer resource) so a fresh
            // install has a working default startup brief instead of a hardcoded dev path.
            if let Ok(p) = app.path().resolve("BOOT.md", tauri::path::BaseDirectory::Resource) {
                *RESOURCE_ROOM.lock().unwrap() = Some(p);
            }
            if let Ok(p) = app.path().resolve("cards", tauri::path::BaseDirectory::Resource) {
                *RESOURCE_CARDS.lock().unwrap() = Some(p);
            }
            seed_room(); // first run: copy the bundled brief into the data dir (editable)
            seed_cards(); // first run: copy the bundled card deck into the data dir (editable)
            set_dirs(&get_state()); // resolve configurable dirs before anything reads them
            gc_captures(); // drop own-capture logs for panes that are no longer kept
            // Stage 7a: shared MCP control plane + the pull queue. The Stage-7 gate will
            // consume this; for now a placeholder consumer surfaces every raised pull.
            let mboard = app.state::<Board>().0.clone();
            MCP_PORT.store(mcp::start(mboard, pull_tx), Ordering::Relaxed);
            let phandle = app.handle().clone();
            let pboard = app.state::<Board>().0.clone();
            let pgate = app.state::<Gate>().0.clone();
            let ccost = app.state::<Cost>().0.clone();
            std::thread::spawn(move || {
                let mut pull_rx = pull_rx;
                while let Some(pr) = pull_rx.blocking_recv() {
                    let ts = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
                    let mut g = pgate.lock().unwrap();
                    // ask_each: below threshold the pull drops (counted); else it becomes a GateCard
                    if pr.intensity < g.pull_threshold {
                        g.suppressed += 1;
                        let n = g.suppressed;
                        drop(g);
                        board_push(&pboard, BoardEntry {
                            pane: "gate".to_string(),
                            role: "committee".to_string(),
                            text: format!("suppressed pull from {} (intensity {:.2} < threshold) — {} suppressed total", pr.from, pr.intensity, n),
                            ts,
                        });
                        continue;
                    }
                    // open-channel: auto-approve within the envelope + content-blind guards
                    // (cost breaker, global rate cap); else snap back to ask-each.
                    let mut auto = false;
                    let mut changed = false;
                    let mut snap_reason = "";
                    if g.mode == gate::GateMode::OpenChannel {
                        let tripped = ccost.lock().unwrap().tripped;
                        while let Some(&t) = g.auto_window.front() {
                            if ts.saturating_sub(t) > gate::RATE_WINDOW_MS { g.auto_window.pop_front(); } else { break; }
                        }
                        let rate_ok = (g.auto_window.len() as u32) < gate::RATE_CAP;
                        let env_ok = g.envelope.as_ref().map_or(false, |e| e.remaining_exchanges > 0 && ts < e.deadline_ms);
                        snap_reason = if tripped { "cost breaker tripped" }
                            else if !rate_ok { "rate cap" }
                            else if !env_ok { "envelope spent" }
                            else { "" };
                        if snap_reason.is_empty() {
                            if let Some(e) = g.envelope.as_mut() { e.remaining_exchanges -= 1; }
                            g.auto_window.push_back(ts);
                            auto = true;
                            changed = true;
                        } else {
                            g.mode = gate::GateMode::AskEach;
                            g.envelope = None;
                            changed = true;
                        }
                    }
                    let label = g.mode_label();
                    if auto {
                        drop(g);
                        let _ = phandle.emit("gate-mode", label);
                        let outcome = deliver_pull(&phandle, &pr);
                        board_push(&pboard, BoardEntry {
                            pane: "gate".to_string(),
                            role: "committee".to_string(),
                            text: format!("open-channel auto-approved + {} (from {} -> {})", outcome, pr.from, pr.target),
                            ts,
                        });
                        continue;
                    }
                    if !snap_reason.is_empty() {
                        board_push(&pboard, BoardEntry {
                            pane: "gate".to_string(),
                            role: "committee".to_string(),
                            text: format!("open-channel closed ({snap_reason}) — back to ask-each"),
                            ts,
                        });
                    }
                    // ask-each (default, or just snapped back): surface a GateCard for the chair
                    let id = Uuid::new_v4().to_string();
                    let card = gate::GateCard {
                        id: id.clone(),
                        from: pr.from.clone(),
                        target: pr.target.clone(),
                        kind: pr.kind.clone(),
                        intensity: pr.intensity,
                        why: pr.why.clone(),
                    };
                    g.pending.insert(id, pr);
                    drop(g);
                    if changed {
                        let _ = phandle.emit("gate-mode", label);
                    }
                    board_push(&pboard, BoardEntry {
                        pane: "gate".to_string(),
                        role: "committee".to_string(),
                        text: format!("gate-card [{}] from {} -> {} [{}] {}", &card.id[..8], card.from, card.target, card.kind, card.why),
                        ts,
                    });
                    let _ = phandle.emit("gate-card", card);
                }
            });

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

            // auto-scribe: distill the board as turns accumulate, debounced (cost-bounded).
            // catches both "context filling" and "conversation ended" — that content is on the board.
            let dhandle = app.handle().clone();
            let dboard = app.state::<Board>().0.clone();
            std::thread::spawn(move || {
                let mut last_ms = 0u64;
                loop {
                    std::thread::sleep(Duration::from_secs(20));
                    if !AUTO_DISTILL.load(Ordering::Relaxed) {
                        continue;
                    }
                    // shared watermark, not a private counter — a manual ⟳ advances it too,
                    // so the worker never re-fires on turns the button already distilled.
                    let new = {
                        let q = dboard.lock().unwrap();
                        undistilled_len(BOARD_PUSHED.load(Ordering::Relaxed), DISTILLED_MARK.load(Ordering::Relaxed), q.len())
                    };
                    let now = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0);
                    // fire only when >= 6 new turns piled up AND >= 3 min since the last distill
                    if new >= 6 && now.saturating_sub(last_ms) >= 180_000 {
                        if run_distill(&dboard, &dhandle, true).is_ok() {
                            last_ms = now;
                        }
                    }
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_state, save_config, config_exists,
            pty_spawn, pty_write, pty_resize, pty_kill, pty_reopen, get_board,
            scribe_distill, set_auto_distill, clipboard_read, clipboard_write, spawn_sibling, committee_form,
            set_pane_role, set_pane_name, gate_decide, open_channel, close_channel, spawn_body,
            set_breaker_ceiling, reset_breaker, spawn_main, set_spot_pair, dyad_spot,
            set_pane_kept, list_kept_panes, resume_pane, new_room
        ])
        // No graceful-shutdown delay on close: `/exit` doesn't reliably flush an interactive claude
        // (proven), the own-capture log persists every chunk as it arrives, and real `--resume` works
        // off claude's own periodic flush — so the window closes instantly, no hitch.
        .run(tauri::generate_context!())
        .expect("error while running Consonance");
}

#[cfg(test)]
mod distill_watermark_tests {
    use super::undistilled_len;

    #[test]
    fn first_pass_takes_whole_ring() {
        assert_eq!(undistilled_len(10, 0, 10), 10);
    }

    #[test]
    fn nothing_new_after_a_pass_takes_zero() {
        assert_eq!(undistilled_len(10, 10, 10), 0);
    }

    #[test]
    fn second_pass_takes_only_the_new_tail() {
        assert_eq!(undistilled_len(16, 10, 16), 6);
    }

    #[test]
    fn front_eviction_clamps_to_ring_len() {
        // 400 pushed, 100 distilled, but the ring evicted down to 300: take all 300, no panic
        assert_eq!(undistilled_len(400, 100, 300), 300);
    }

    #[test]
    fn stale_mark_ahead_of_pushed_saturates_to_zero() {
        assert_eq!(undistilled_len(5, 10, 5), 0);
    }

    // the regression this fix exists for: repeated passes over a growing board must
    // distill each turn exactly once, never re-feed the whole board.
    #[test]
    fn repeated_passes_never_redistill() {
        let mut pushed: u64 = 0;
        let mut marked: u64 = 0;
        let mut ring_len: usize = 0;
        let mut total_distilled: usize = 0;
        for batch in [7usize, 6, 9, 6, 12] {
            pushed += batch as u64;
            ring_len = (ring_len + batch).min(300);
            let new = undistilled_len(pushed, marked, ring_len);
            total_distilled += new;
            marked = pushed; // what run_distill does on success
        }
        // pre-fix each pass re-fed everything (7 + 13 + 22 + 28 + 40 = 110 turn-feeds);
        // post-fix every turn is fed exactly once.
        assert_eq!(total_distilled, 40);
    }
}
