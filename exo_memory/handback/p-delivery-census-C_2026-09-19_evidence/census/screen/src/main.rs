// Read-only replay: feed a pane's raw PTY capture through vt100 0.15.2 (the app's own emulator crate)
// from `tail` bytes before `end` up to `end`, then classify the composer row.
//
// vt100 0.15.2 has NO arm for SGR 2 (screen.rs:1400-1408), so dim text lands as Default fg, identical to
// typed text. To SEE it, this tool rewrites SGR 2 -> a marker truecolour Rgb(1,2,3) and SGR 22 -> 22 + 39
// before parsing. That rewrite is this instrument's, NOT the app's: the app sees the dim cells as Default.
// usage: screen <log> <end> <tail> <rows> <cols>
use std::io::Read;

fn replace_all(hay: &[u8], from: &[u8], to: &[u8]) -> Vec<u8> {
    let mut out = Vec::with_capacity(hay.len());
    let mut i = 0;
    while i < hay.len() {
        if hay[i..].starts_with(from) { out.extend_from_slice(to); i += from.len(); } else { out.push(hay[i]); i += 1; }
    }
    out
}

fn main() {
    let a: Vec<String> = std::env::args().collect();
    let (log, end, tail, rows, cols) = (&a[1], a[2].parse::<usize>().unwrap(), a[3].parse::<usize>().unwrap(),
        a[4].parse::<u16>().unwrap(), a[5].parse::<u16>().unwrap());
    let mut f = std::fs::File::open(log).expect("open log");
    let mut buf = Vec::new();
    f.read_to_end(&mut buf).expect("read log");
    let start = end.saturating_sub(tail);
    // NO_REMAP=1 feeds the bytes exactly as the app does: the control that the dim cells land as Default.
    let raw = std::env::var("NO_REMAP").is_ok();
    let seg = if raw { buf[start..end].to_vec() } else {
        let s1 = replace_all(&buf[start..end], b"\x1b[2m", b"\x1b[38;2;1;2;3m");
        replace_all(&s1, b"\x1b[22m", b"\x1b[22m\x1b[39m")
    };
    let mut p = vt100::Parser::new(rows, cols, 0);
    p.process(&seg);
    let s = p.screen();
    let lines: Vec<String> = s.rows(0, cols).collect();
    // the composer: the LOWEST row that starts with the prompt glyph
    let comp = lines.iter().enumerate().rev().find(|(_, l)| l.trim_start().starts_with('\u{276f}')).map(|(i, _)| i);
    let Some(r) = comp else { println!("NO-COMPOSER-ROW"); return; };
    let (mut ghost, mut typed) = (String::new(), String::new());
    for c in 0..cols {
        let Some(cell) = s.cell(r as u16, c) else { continue };
        let ch = cell.contents();
        if ch.is_empty() || ch == "\u{276f}" || ch.trim().is_empty() { continue; }
        match cell.fgcolor() {
            vt100::Color::Rgb(1, 2, 3) => ghost.push_str(&ch),
            vt100::Color::Default => typed.push_str(&ch),
            _ => {}
        }
    }
    let class = if !typed.is_empty() { "TYPED" } else if !ghost.is_empty() { "GHOST" } else { "EMPTY" };
    println!("{}\trow {}\tghost {:?}\ttyped {:?}\tline {:?}", class, r, ghost.chars().take(60).collect::<String>(),
        typed.chars().take(60).collect::<String>(), lines[r].trim_end().chars().take(90).collect::<String>());
}
