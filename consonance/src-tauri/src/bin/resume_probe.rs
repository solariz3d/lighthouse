// resume_probe: on THIS laptop's claude 2.1.207, can `--resume` recover a HARD-KILLED interactive
// session (app-close style, no clean exit, no project jsonl)? If yes, sibling persistence needs no
// capture workaround at all — just --resume like Main. If no, --resume genuinely can't work here.
//
// Phase A: start a session, teach it a codeword, HARD-KILL it (drop, no /exit).
// Phase B: `--resume` the same session id, ask for the codeword, see if it remembers.
//
// Run:  cargo run --bin resume_probe    (a couple tokens)
use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use std::io::{Read, Write};
use std::sync::{Arc, Mutex};
use std::time::Duration;

const CLAUDE: &str = r"C:\Users\zackn\.local\bin\claude.exe";
const SID: &str = "0c0c0c0a-0000-4000-8000-0000re5000e1";

fn strip_ansi(s: &str) -> String {
    let mut out = String::new();
    let mut it = s.chars().peekable();
    while let Some(c) = it.next() {
        if c == '\x1b' {
            while let Some(&n) = it.peek() { it.next(); if n.is_ascii_alphabetic() || n == '\u{7}' { break; } }
        } else if c != '\r' { out.push(c); }
    }
    out
}

// spawn claude, return (child, writer, shared-output-buffer)
fn spawn(args: &[&str], cwd: &str) -> (Box<dyn portable_pty::Child + Send + Sync>, Box<dyn Write + Send>, Arc<Mutex<Vec<u8>>>) {
    let pair = native_pty_system()
        .openpty(PtySize { rows: 34, cols: 120, pixel_width: 0, pixel_height: 0 }).expect("openpty");
    let mut cmd = CommandBuilder::new(CLAUDE);
    cmd.cwd(cwd);
    for a in args { cmd.arg(a); }
    cmd.env("TERM", "xterm-256color");
    cmd.env("FORCE_COLOR", "1");
    let child = pair.slave.spawn_command(cmd).expect("spawn");
    drop(pair.slave);
    let mut reader = pair.master.try_clone_reader().expect("reader");
    let writer = pair.master.take_writer().expect("writer");
    let buf = Arc::new(Mutex::new(Vec::<u8>::new()));
    let b2 = buf.clone();
    std::thread::spawn(move || {
        let mut tmp = [0u8; 8192];
        while let Ok(n) = reader.read(&mut tmp) { if n == 0 { break; } b2.lock().unwrap().extend_from_slice(&tmp[..n]); }
    });
    (child, writer, buf)
}

fn send(w: &mut Box<dyn Write + Send>, text: &str) {
    let _ = w.write_all(text.as_bytes());
    let _ = w.flush();
    std::thread::sleep(Duration::from_millis(1000));
    let _ = w.write_all(b"\r");
    let _ = w.flush();
}

fn main() {
    let home = std::env::var("USERPROFILE").unwrap();
    let cwd = format!(r"{home}\AppData\Local\Temp\claude-resumeprobe");
    std::fs::create_dir_all(&cwd).unwrap();

    // ---- Phase A: establish a session, teach a codeword, then HARD-KILL ----
    println!("phase A: starting fresh session {SID} …");
    let (mut child_a, mut w_a, _buf_a) = spawn(&["--session-id", SID, "--dangerously-skip-permissions"], &cwd);
    std::thread::sleep(Duration::from_millis(6500));
    send(&mut w_a, "Please remember this codeword for later: ZEBRA42. Just acknowledge.");
    std::thread::sleep(Duration::from_millis(14000));
    println!("phase A: HARD-KILLING (no /exit, like an app close)…");
    let _ = child_a.kill(); // abrupt — mimics Consonance dropping the PTY on close
    std::thread::sleep(Duration::from_millis(2000));

    // ---- Phase B: resume the same session id, ask for the codeword ----
    println!("phase B: `--resume {SID}` …");
    let (mut child_b, mut w_b, buf_b) = spawn(&["--resume", SID, "--dangerously-skip-permissions"], &cwd);
    std::thread::sleep(Duration::from_millis(7000));
    send(&mut w_b, "What was the codeword I asked you to remember?");
    std::thread::sleep(Duration::from_millis(16000));
    let out = strip_ansi(&String::from_utf8_lossy(&buf_b.lock().unwrap()));
    let _ = child_b.kill();

    let no_conv = out.contains("No conversation found") || out.contains("no conversation");
    let remembered = out.contains("ZEBRA42");
    let tail: String = out.chars().rev().take(1200).collect::<String>().chars().rev().collect();
    println!("--- phase B output tail ---\n{}\n---", tail.trim());
    println!("=== resume_probe RESULT ===");
    println!("resume errored 'no conversation': {no_conv}");
    println!("remembered the codeword (ZEBRA42): {remembered}");
    println!("VERDICT: {}", if remembered { "--resume RECOVERS a hard-killed session ✓ (no workaround needed)" }
                            else if no_conv { "--resume CANNOT find it ✗ (jsonl genuinely required)" }
                            else { "resumed but did NOT remember ✗ (session shell only, no history)" });
    std::process::exit(0);
}
