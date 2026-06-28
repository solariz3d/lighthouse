// Stage-1 spike: can portable-pty spawn the real interactive claude.exe in a ConPTY
// and stream its output back? Run: cargo run --bin pty_spike
// Drives a free local command (/help) so it costs no tokens.
// Collects output into a shared buffer and process::exit()s — never joins the reader,
// so a blocking read can't hang the program (the bug in v1).
use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use std::io::{Read, Write};
use std::sync::{Arc, Mutex};
use std::time::Duration;

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
    let claude = r"C:\Users\zackn\.local\bin\claude.exe";
    let cwd = r"C:\Users\zackn\OneDrive\Desktop\606";

    let pty = native_pty_system();
    let pair = pty
        .openpty(PtySize { rows: 34, cols: 110, pixel_width: 0, pixel_height: 0 })
        .expect("openpty");

    let mut cmd = CommandBuilder::new(claude);
    cmd.cwd(cwd);
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
        loop {
            match reader.read(&mut tmp) {
                Ok(0) => break,
                Ok(n) => buf2.lock().unwrap().extend_from_slice(&tmp[..n]),
                Err(_) => break,
            }
        }
    });

    std::thread::sleep(Duration::from_millis(3000)); // startup render
    let _ = writer.write_all(b"/help\r"); // free local command
    let _ = writer.flush();
    std::thread::sleep(Duration::from_millis(2000));

    let _ = child.kill();

    let out = buf.lock().unwrap().clone();
    println!("\n=== SPIKE RESULT ===");
    println!("captured {} bytes of output from claude.exe via ConPTY", out.len());
    let preview = strip_ansi(&String::from_utf8_lossy(&out));
    let preview: String = preview.chars().filter(|c| *c == '\n' || !c.is_control()).take(1800).collect();
    println!("--- ANSI-stripped preview ---\n{}", preview.trim());
    println!("=== END ===");
    let _ = std::io::stdout().flush();
    std::process::exit(0); // force-terminate; do not join the (possibly blocked) reader
}
