// compact_probe (B, L212): CAN A SEAT BE MADE TO RUN /compact BY WRITING TO ITS TERMINAL, with the bytes main.rs `deliver` writes
// (a bracketed paste, a pause, then a lone "\r")? The packet's R1 asks it be tried once, on the pane itself or a scratch instance,
// never on another working seat; this is the scratch instance.
//
// Run: cargo run --bin compact_probe -- <scratch folder> [model]      (model default: haiku)
//
// It starts a throwaway claude in <scratch folder> with a fixed --session-id, asks two one-word turns so there is something to
// compact, then writes /compact the way `deliver` does and reads THAT SESSION'S OWN TRANSCRIPT for a compact_boundary written after
// the write (the composer cannot confirm a slash command: main.rs, a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect).
// Prints what it found and the ANSI-stripped screen on any failure. Costs two tiny turns and one compaction on the model given.
//
// STATUS, 2026-11-21 (four runs on L, Claude Code 2.1.330): IT HAS NOT YET SHOWN THE ANSWER. Runs 1-2 stopped at first-run dialogs
// (a bypass-permissions warning, then a new folder's trust question) answered "no" by a blind Enter; runs 3-4, in a trusted empty
// folder, the TUI drew its composer and took NO input from this bare PTY (no transcript was written at all). inferred, not checked:
// the TUI waits on terminal queries (cursor position, device attributes) that the app's terminal answers and a bare PTY does not.
// The next step is to answer those queries here, or to run the question through the app itself.
use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use std::io::{Read, Write};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

fn strip_ansi(s: &str) -> String {
    let mut out = String::new();
    let mut chars = s.chars().peekable();
    while let Some(c) = chars.next() {
        if c == '\x1b' {
            while let Some(&n) = chars.peek() {
                chars.next();
                if n.is_ascii_alphabetic() || n == '\u{7}' { break; }
            }
        } else if c != '\r' {
            out.push(c);
        }
    }
    out
}

fn now_ms() -> u64 { SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0) }

fn rows_after(transcript: &PathBuf, after_ms: u64) -> Vec<serde_json::Value> {
    std::fs::read_to_string(transcript)
        .unwrap_or_default()
        .lines()
        .filter_map(|l| serde_json::from_str::<serde_json::Value>(l).ok())
        .filter(|v| {
            v.get("timestamp").and_then(|t| t.as_str()).and_then(|t| chrono::DateTime::parse_from_rfc3339(t).ok())
                .map(|t| t.timestamp_millis() as u64 >= after_ms).unwrap_or(false)
        })
        .collect()
}

fn wait_for(limit: Duration, mut f: impl FnMut() -> bool) -> bool {
    let t = Instant::now();
    while t.elapsed() < limit { if f() { return true; } std::thread::sleep(Duration::from_millis(1000)); }
    f()
}

/// main.rs `deliver`'s shape: a bracketed paste, then the Enter as a SEPARATE write after a pause.
fn deliver_like(w: &mut dyn Write, text: &str) {
    let _ = w.write_all(format!("\x1b[200~{text}\x1b[201~").as_bytes());
    let _ = w.flush();
    std::thread::sleep(Duration::from_millis(150));
    let _ = w.write_all(b"\r");
    let _ = w.flush();
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let Some(dir) = args.get(1).map(PathBuf::from) else {
        eprintln!("usage: compact_probe <scratch folder> [model]");
        std::process::exit(2);
    };
    let model = args.get(2).cloned().unwrap_or_else(|| "haiku".to_string());
    let home = PathBuf::from(std::env::var("USERPROFILE").expect("USERPROFILE"));
    let claude = home.join(".local").join("bin").join("claude.exe");
    std::fs::create_dir_all(&dir).expect("scratch folder");
    let dir = std::fs::canonicalize(&dir).expect("canonical scratch folder");
    let dir_s = dir.to_string_lossy().trim_start_matches(r"\\?\").to_string();
    let sid = format!("c0c0c0c0-0000-4000-8000-{:012x}", now_ms() & 0xffff_ffff_ffff);
    let encoded: String = dir_s.chars().map(|c| if c.is_ascii_alphanumeric() { c } else { '-' }).collect();
    let transcript = home.join(".claude").join("projects").join(encoded).join(format!("{sid}.jsonl"));
    println!("compact_probe: claude {} in {dir_s}, model {model}, session {sid}", claude.display());

    let pair = native_pty_system().openpty(PtySize { rows: 34, cols: 110, pixel_width: 0, pixel_height: 0 }).expect("openpty");
    let mut cmd = CommandBuilder::new(&claude);
    cmd.cwd(&dir_s);
    // No --dangerously-skip-permissions: its one-time warning defaults to "No, exit" and the first write answered it (the probe's
    // first run, 2026-11-21). A new folder asks instead whether it is trusted, defaulting to "Yes, proceed"; that is accepted below,
    // only when the screen shows it. The two turns use no tool, so no permission is asked.
    cmd.args(["--model", model.as_str(), "--session-id", sid.as_str()]);
    cmd.env("TERM", "xterm-256color");
    cmd.env("FORCE_COLOR", "1");
    let mut child = pair.slave.spawn_command(cmd).expect("spawn claude.exe");
    drop(pair.slave);
    let mut reader = pair.master.try_clone_reader().expect("reader");
    let mut writer = pair.master.take_writer().expect("writer");
    let buf = Arc::new(Mutex::new(Vec::<u8>::new()));
    let buf2 = buf.clone();
    std::thread::spawn(move || {
        let mut tmp = [0u8; 8192];
        while let Ok(n) = reader.read(&mut tmp) { if n == 0 { break; } buf2.lock().unwrap().extend_from_slice(&tmp[..n]); }
    });
    let screen = |b: &Arc<Mutex<Vec<u8>>>| {
        let s = strip_ansi(&String::from_utf8_lossy(&b.lock().unwrap()));
        let s: String = s.chars().filter(|c| *c == '\n' || !c.is_control()).collect();
        s.chars().rev().take(1500).collect::<Vec<_>>().into_iter().rev().collect::<String>()
    };
    let end = |child: &mut Box<dyn portable_pty::Child + Send + Sync>, code: i32| -> ! {
        let _ = child.kill();
        let _ = std::io::stdout().flush();
        std::process::exit(code)
    };

    // Startup: wait for the composer's mark, not a fixed time. 2.1.330 draws an "Updated: N features" notice first, and a write
    // sent at a fixed 8 s landed before the composer existed (the probe's third run: no transcript at all).
    let ready = wait_for(Duration::from_secs(45), || screen(&buf).contains('❯'));
    println!("composer {}", if ready { "drawn" } else { "NOT drawn within 45 s" });
    std::thread::sleep(Duration::from_millis(1500));
    if screen(&buf).to_lowercase().contains("trust") {
        println!("the folder-trust question is on screen: accepting its default (Yes, proceed)");
        let _ = writer.write_all(b"\r");
        let _ = writer.flush();
        std::thread::sleep(Duration::from_millis(6000));
    }
    for (i, ask) in ["Reply with the one word: one", "Reply with the one word: two"].iter().enumerate() {
        let sent = now_ms();
        deliver_like(&mut writer, ask);
        let answered = wait_for(Duration::from_secs(90), || {
            rows_after(&transcript, sent).iter().any(|v| v.get("type").and_then(|t| t.as_str()) == Some("assistant"))
        });
        println!("turn {}: {}", i + 1, if answered { "answered" } else { "NO ANSWER within 90 s" });
        if !answered {
            println!("--- screen ---\n{}\n--- transcript {} exists: {} ---", screen(&buf), transcript.display(), transcript.exists());
            end(&mut child, 1);
        }
        std::thread::sleep(Duration::from_millis(3000)); // let the turn's Stop land
    }

    let sent = now_ms();
    deliver_like(&mut writer, "/compact");
    let mut found = None;
    let done = wait_for(Duration::from_secs(240), || {
        found = rows_after(&transcript, sent).into_iter().find(|v| v.get("subtype").and_then(|s| s.as_str()) == Some("compact_boundary"));
        found.is_some()
    });
    match (done, found) {
        (true, Some(v)) => {
            let m = v.get("compactMetadata");
            println!(
                "RESULT: /compact written to the terminal ran: the transcript records a compact_boundary {} ms after the write, trigger {}, preTokens {}, postTokens {}",
                chrono::DateTime::parse_from_rfc3339(v.get("timestamp").and_then(|t| t.as_str()).unwrap_or("")).map(|t| t.timestamp_millis() as u64 - sent).unwrap_or(0),
                m.and_then(|m| m.get("trigger")).map(|x| x.to_string()).unwrap_or_default(),
                m.and_then(|m| m.get("preTokens")).map(|x| x.to_string()).unwrap_or_default(),
                m.and_then(|m| m.get("postTokens")).map(|x| x.to_string()).unwrap_or_default()
            );
            end(&mut child, 0);
        }
        _ => {
            println!("RESULT: NO compact_boundary within 240 s of writing /compact\n--- screen ---\n{}", screen(&buf));
            end(&mut child, 1);
        }
    }
}
