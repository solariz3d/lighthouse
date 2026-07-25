// capture_probe: does the layer-2 extractor work against REAL claude 2.1.207 output?
//
// The unit tests use hand-written screen fixtures. This proves the same code (via #[path] into the
// actual capture.rs — no duplication) turns a live claude session's raw PTY bytes, rendered through
// the same vt100 emulator the app uses, into the right clean turn. If this extracts the sentinel
// response and the prompt, the whole capture→band→warm-resume pipeline rests on solid ground.
//
// Run:  cargo run --bin capture_probe    (costs a couple tokens: one tiny real turn)
#[path = "../capture.rs"]
mod capture;

use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use std::io::{Read, Write};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

const ROWS: u16 = 34;
const COLS: u16 = 120;

fn main() {
    let claude = r"C:\Users\zackn\.local\bin\claude.exe";
    let home = std::env::var("USERPROFILE").unwrap();
    let cwd = format!(r"{home}\AppData\Local\Temp\claude-captureprobe");
    std::fs::create_dir_all(&cwd).unwrap();

    let pair = native_pty_system()
        .openpty(PtySize { rows: ROWS, cols: COLS, pixel_width: 0, pixel_height: 0 })
        .expect("openpty");
    let mut cmd = CommandBuilder::new(claude);
    cmd.cwd(&cwd);
    cmd.args(["--session-id", "0c0c0c0a-0000-4000-8000-0000cab70be1", "--dangerously-skip-permissions"]);
    cmd.env("TERM", "xterm-256color");
    cmd.env("FORCE_COLOR", "1");
    let mut child = pair.slave.spawn_command(cmd).expect("spawn claude");
    drop(pair.slave);

    let mut reader = pair.master.try_clone_reader().expect("reader");
    let mut writer = pair.master.take_writer().expect("writer");

    // feed the same bytes into the same emulator the app uses; track quiescence
    let emu = Arc::new(Mutex::new((vt100::Parser::new(ROWS, COLS, 0), Instant::now())));
    let emu2 = emu.clone();
    std::thread::spawn(move || {
        let mut tmp = [0u8; 8192];
        while let Ok(n) = reader.read(&mut tmp) {
            if n == 0 { break; }
            let mut g = emu2.lock().unwrap();
            g.0.process(&tmp[..n]);
            g.1 = Instant::now();
        }
    });

    std::thread::sleep(Duration::from_millis(6500)); // let the welcome panel settle + input go live
    let _ = writer.write_all(b"reply with only the single word: PONGCHECK");
    let _ = writer.flush();
    std::thread::sleep(Duration::from_millis(1200)); // let the text land in the box before submitting
    let _ = writer.write_all(b"\r");
    let _ = writer.flush();

    // poll for quiescence + a ready screen, exactly like the app's watcher
    let deadline = Instant::now() + Duration::from_secs(30);
    let mut lines: Vec<String> = Vec::new();
    let mut ready = false;
    while Instant::now() < deadline {
        std::thread::sleep(Duration::from_millis(250));
        let g = emu.lock().unwrap();
        if g.1.elapsed() < Duration::from_millis(500) { continue; }
        let snap: Vec<String> = g.0.screen().rows(0, COLS).collect();
        drop(g);
        if capture::screen_ready(&snap) {
            lines = snap;
            ready = true;
            break;
        }
        lines = snap; // keep the latest even if not "ready", for diagnostics
    }

    let prompt = capture::latest_prompt(&lines);
    let resp = capture::latest_turn(&lines);
    let _ = child.kill();

    println!("=== capture_probe RESULT ===");
    println!("screen_ready:   {ready}");
    println!("latest_prompt:  {prompt:?}");
    println!("latest_turn:    {resp:?}");
    let prompt_ok = prompt.contains("PONGCHECK") || prompt.contains("single word");
    let resp_ok = resp.contains("PONGCHECK");
    println!("prompt_extracted: {prompt_ok}");
    println!("response_extracted: {resp_ok}");
    println!("VERDICT: {}", if ready && resp_ok { "EXTRACTOR WORKS ✓" } else { "needs a look ✗" });
    if !(ready && resp_ok) {
        println!("--- rendered screen (for diagnosis) ---");
        for (i, l) in lines.iter().enumerate() {
            let t = l.trim_end();
            if !t.is_empty() { println!("{i:>2}| {t}"); }
        }
    }
    std::process::exit(0);
}
