// flush_probe: which "exit sequence" makes an INTERACTIVE claude flush its session transcript?
//
// The bug: Consonance hard-kills panes on close, so claude 2.1.207 never flushes their jsonl and
// --resume comes back blank. A clean `claude -p` exit DOES flush (proven). This probe finds the
// keystroke sequence that triggers the same clean shutdown for an interactive pane, so the app can
// send it on close and WAIT for the flush — restoring the old on-disk behavior on every claude.
//
// Run:  cargo run --bin flush_probe -- <exit_kind>
//   exit_kind ∈ { exit | ctrlc2 | ctrld | esc-exit }   (default: exit)
// Costs a few tokens (one tiny real turn, so there is something to flush).
use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use std::io::{Read, Write};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

fn encode_cwd(cwd: &str) -> String {
    cwd.chars().map(|c| if c.is_ascii_alphanumeric() { c } else { '-' }).collect()
}

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

fn main() {
    let kind = std::env::args().nth(1).unwrap_or_else(|| "exit".into());
    let exit_seq: &[u8] = match kind.as_str() {
        "exit" => b"/exit\r",
        "ctrlc2" => b"\x03\x03",
        "ctrld" => b"\x04",
        "esc-exit" => b"\x1b/exit\r",
        other => {
            println!("unknown exit_kind '{other}' — use exit|ctrlc2|ctrld|esc-exit");
            std::process::exit(2);
        }
    };

    let claude = r"C:\Users\zackn\.local\bin\claude.exe";
    let home = std::env::var("USERPROFILE").unwrap();
    // a fresh cwd + session id per kind so runs don't collide
    let cwd = format!(r"{home}\AppData\Local\Temp\claude-flushprobe\{kind}");
    std::fs::create_dir_all(&cwd).unwrap();
    let sid = format!("0c0c0c0a-0000-4000-8000-00000000fe0{}", match kind.as_str() {
        "exit" => 1, "ctrlc2" => 2, "ctrld" => 3, _ => 4,
    });

    let jsonl: PathBuf = PathBuf::from(&home)
        .join(".claude").join("projects").join(encode_cwd(&cwd)).join(format!("{sid}.jsonl"));
    let _ = std::fs::remove_file(&jsonl); // clean slate

    let pair = native_pty_system()
        .openpty(PtySize { rows: 34, cols: 120, pixel_width: 0, pixel_height: 0 })
        .expect("openpty");
    let mut cmd = CommandBuilder::new(claude);
    cmd.cwd(&cwd);
    cmd.args(["--session-id", &sid, "--dangerously-skip-permissions"]);
    cmd.env("TERM", "xterm-256color");
    cmd.env("FORCE_COLOR", "1");
    let mut child = pair.slave.spawn_command(cmd).expect("spawn claude");
    drop(pair.slave);

    let mut reader = pair.master.try_clone_reader().expect("reader");
    let mut writer = pair.master.take_writer().expect("writer");
    let buf = Arc::new(Mutex::new(Vec::<u8>::new()));
    let buf2 = buf.clone();
    std::thread::spawn(move || {
        let mut tmp = [0u8; 8192];
        while let Ok(n) = reader.read(&mut tmp) {
            if n == 0 { break; }
            buf2.lock().unwrap().extend_from_slice(&tmp[..n]);
        }
    });

    std::thread::sleep(Duration::from_millis(4000)); // startup render
    let _ = writer.write_all(b"reply with only: ok\r");
    let _ = writer.flush();
    std::thread::sleep(Duration::from_millis(18000)); // let the turn complete

    println!("probe[{kind}]: sending exit sequence {exit_seq:?}");
    let _ = writer.write_all(exit_seq);
    let _ = writer.flush();

    // wait for the child to actually exit (that is when the flush happens), bounded
    let deadline = Instant::now() + Duration::from_secs(12);
    let mut exited = false;
    while Instant::now() < deadline {
        match child.try_wait() {
            Ok(Some(_)) => { exited = true; break; }
            _ => std::thread::sleep(Duration::from_millis(200)),
        }
    }
    if !exited {
        println!("probe[{kind}]: child did NOT exit on the sequence — killing");
        let _ = child.kill();
        std::thread::sleep(Duration::from_millis(1500));
    }

    let out = buf.lock().unwrap().clone();
    let stripped = strip_ansi(&String::from_utf8_lossy(&out));
    let tail: String = stripped.chars().rev().take(700).collect::<String>().chars().rev().collect();
    println!("--- session output tail (did the turn complete?) ---\n{}\n---", tail.trim());

    let wrote = jsonl.exists();
    let size = std::fs::metadata(&jsonl).map(|m| m.len()).unwrap_or(0);
    println!("=== flush_probe RESULT ===");
    println!("exit_kind:     {kind}");
    println!("clean_exit:    {exited}");
    println!("jsonl_written: {wrote}  ({size} bytes)");
    println!("jsonl_path:    {}", jsonl.display());
    println!("VERDICT: {}", if wrote && size > 0 { "FLUSHED ✓" } else { "no flush ✗" });
    std::process::exit(0);
}
