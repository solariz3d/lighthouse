// composer_probe: is the separator rule above the composer RELIABLY there, and is the keeper's
// own typed text ever drawn non-Default?
//
// P-COMPOSER-ANCHOR (L053) gives permission to refuse if the separator anchor is not reliable.
// This is the instrument that answers that, on real captured PTY bytes rather than on a model of
// them. Two questions, both measured, neither assumed:
//
//   1. RULE PRESENCE. Over sampled frames of real capture logs replayed at the size the docked
//      panes run, how often is there a full-width `─` row, and how often is the row directly
//      below it a `❯` row? Every frame where those disagree is a frame the anchor cannot read.
//   2. THE COLOUR OF TYPING. The reduction (`typed_only`) keeps Default-foreground cells only.
//      If the keeper's own words are ever drawn non-Default on the composer row, asking the
//      REDUCED grid for emptiness would report EMPTY over his sentence — the splice this packet
//      is forbidden to trade for. This counts composer rows with content and reports the colours
//      that content is drawn in.
//
// Run:  cargo run --bin composer_probe -- <fixture-or-log> [more logs...]
//       cargo run --bin composer_probe            (fixture only)

#[path = "../capture.rs"]
mod capture;

use std::collections::BTreeMap;
use std::env;
use std::fs;

const ROWS: u16 = 43;
const COLS: u16 = 201;
const CHUNK: usize = 256;

fn row_text(s: &vt100::Screen, r: u16, cols: u16) -> String {
    (0..cols)
        .map(|c| match s.cell(r, c) {
            Some(cell) => {
                let t = cell.contents();
                if t.is_empty() { " ".to_string() } else { t }
            }
            None => " ".to_string(),
        })
        .collect()
}

/// A row drawn entirely of `─`, and how wide the run is. Returns (run_len, screen_cols).
fn rule_run(s: &vt100::Screen, r: u16, cols: u16) -> Option<(u16, u16)> {
    let mut n = 0u16;
    for c in 0..cols {
        let t = s.cell(r, c).map(|x| x.contents()).unwrap_or_default();
        if t == "\u{2500}" {
            n += 1;
        } else if t.trim().is_empty() && n > 0 {
            // trailing blanks after a rule are still a rule row; a gap inside is not
            for c2 in c..cols {
                let t2 = s.cell(r, c2).map(|x| x.contents()).unwrap_or_default();
                if !t2.trim().is_empty() {
                    return None;
                }
            }
            break;
        } else if !t.trim().is_empty() {
            return None;
        }
    }
    if n == 0 { None } else { Some((n, cols)) }
}

/// The same predicate the gate uses, so the probe measures the shipping definition of "a `❯` row"
/// and not a second one of its own — agents-manager rows excluded exactly as there.
fn is_marker_row(line: &str) -> bool {
    capture::is_empty_box(line) || capture::is_prompt(line)
}

/// `typed_only` from main.rs, byte for byte. Duplicated rather than imported because main.rs is a
/// binary crate root and cannot be a module of another bin.
fn typed_only(screen: &vt100::Screen) -> Vec<String> {
    let (rows, cols) = screen.size();
    (0..rows)
        .map(|r| {
            (0..cols)
                .map(|c| match screen.cell(r, c) {
                    Some(cell) if cell.fgcolor() == vt100::Color::Default => {
                        let s = cell.contents();
                        if s.is_empty() { " ".to_string() } else { s }
                    }
                    _ => " ".to_string(),
                })
                .collect::<String>()
        })
        .collect()
}

/// The predicate SHIPPED BEFORE L053: last `❯` row of the REDUCED grid; unknown holds.
fn old_verdict(typed: &[String]) -> bool {
    match typed.iter().rposition(|l| is_marker_row(l)) {
        Some(i) => capture::is_empty_box(&typed[i]),
        None => false,
    }
}

/// `composer_row` + `input_box_empty` from main.rs, byte for byte — the ANCHOR as shipped, so the
/// numbers this prints are about the code and not about a second sketch of it.
fn is_separator_rule(s: &str) -> bool {
    let t = s.trim_end();
    !t.is_empty() && t.chars().all(|c| c == '\u{2500}')
}

fn composer_row(rendered: &[String]) -> Option<usize> {
    let i = rendered.iter().rposition(|l| is_marker_row(l))?;
    (i > 0 && is_separator_rule(&rendered[i - 1])).then_some(i)
}

fn new_verdict(rendered: &[String], typed: &[String]) -> bool {
    let Some(i) = composer_row(rendered) else {
        return false;
    };
    match (rendered[i].chars().position(|c| c == '\u{276f}'), typed.get(i)) {
        (Some(m), Some(row)) => row.chars().skip(m + 1).collect::<String>().trim().is_empty(),
        _ => false,
    }
}

fn colour_name(c: vt100::Color) -> String {
    match c {
        vt100::Color::Default => "Default".to_string(),
        vt100::Color::Idx(i) => format!("Idx({i})"),
        vt100::Color::Rgb(r, g, b) => format!("Rgb({r},{g},{b})"),
    }
}

#[derive(Default)]
struct Tally {
    frames: usize,
    with_rule: usize,
    rule_then_marker: usize,
    rule_then_other: usize,
    no_rule: usize,
    /// last-`❯`-row index vs anchor-derived index: how often the old heuristic and the anchor
    /// disagree (i.e. how much scrollback the anchor actually excludes)
    disagree: usize,
    rule_widths: BTreeMap<u16, usize>,
    /// colour of the `❯` marker cell itself
    marker_colours: BTreeMap<String, usize>,
    /// colours of CONTENT after the marker, on composer rows that have content
    content_colours: BTreeMap<String, usize>,
    composer_with_content: usize,
    /// content present but ZERO default-fg cells in it — the splice case
    content_all_nondefault: usize,
    sample_all_nondefault: Vec<String>,
    sample_rule_then_other: Vec<String>,
    /// anchored frames only: truth (rendered composer empty) vs the two predicates
    anchored: usize,
    truth_empty: usize,
    old_right: usize,
    new_right: usize,
    old_false_busy: usize,
    new_false_busy: usize,
    old_false_empty: usize,
    new_false_empty: usize,
    byte_offset: usize,
    first_all_nondefault_at: Option<usize>,
}

fn measure(p: &vt100::Parser, t: &mut Tally) {
    let s = p.screen();
    let (rows, cols) = s.size();
    t.frames += 1;

    let lines: Vec<String> = (0..rows).map(|r| row_text(s, r, cols)).collect();

    // the anchor: the LAST full-width rule that has a `❯` row directly below it
    let mut anchor: Option<u16> = None;
    let mut any_rule = false;
    let mut last_rule_below: Option<(u16, String)> = None;
    for r in (0..rows).rev() {
        if let Some((n, c)) = rule_run(s, r, cols) {
            any_rule = true;
            *t.rule_widths.entry(n).or_default() += 1;
            let _ = c;
            if r + 1 < rows {
                if is_marker_row(&lines[(r + 1) as usize]) {
                    if anchor.is_none() {
                        anchor = Some(r + 1);
                    }
                } else if last_rule_below.is_none() {
                    last_rule_below = Some((r + 1, lines[(r + 1) as usize].trim_end().to_string()));
                }
            }
            if anchor.is_some() {
                break;
            }
        }
    }

    if any_rule {
        t.with_rule += 1;
    } else {
        t.no_rule += 1;
    }

    match anchor {
        None => {
            if any_rule {
                t.rule_then_other += 1;
                if let Some((_, txt)) = last_rule_below {
                    if t.sample_rule_then_other.len() < 6 {
                        t.sample_rule_then_other.push(txt.chars().take(90).collect());
                    }
                }
            }
        }
        Some(i) => {
            t.rule_then_marker += 1;

            let old = lines.iter().rposition(|l| is_marker_row(l));
            if old != Some(i as usize) {
                t.disagree += 1;
            }

            // truth / shipped / anchor, on this frame — ALL THREE READ AT THE ROW THE SHIPPING
            // `composer_row` PICKS, never at the probe's own scan. Reading truth at one row and the
            // verdict at another is how the first run of this probe manufactured 1,763 splices that
            // were not there.
            let Some(i) = composer_row(&lines).map(|x| x as u16) else {
                return;
            };
            let typed = typed_only(s);
            let truth = capture::is_empty_box(&lines[i as usize]);
            let newv = new_verdict(&lines, &typed);
            let oldv = old_verdict(&typed);
            t.anchored += 1;
            if truth {
                t.truth_empty += 1;
            }
            if oldv == truth {
                t.old_right += 1;
            } else if truth {
                t.old_false_busy += 1;
            } else {
                t.old_false_empty += 1;
            }
            if newv == truth {
                t.new_right += 1;
            } else if truth {
                t.new_false_busy += 1;
            } else {
                t.new_false_empty += 1;
            }

            // marker colour
            let line = &lines[i as usize];
            let lead = line.len() - line.trim_start().len();
            let mut col0 = 0u16;
            let mut seen = 0usize;
            for c in 0..cols {
                let cell = s.cell(i, c);
                let txt = cell.map(|x| x.contents()).unwrap_or_default();
                seen += txt.len().max(1);
                if txt == "\u{276f}" {
                    col0 = c;
                    break;
                }
            }
            let _ = (lead, seen);
            if let Some(cell) = s.cell(i, col0) {
                *t.marker_colours.entry(colour_name(cell.fgcolor())).or_default() += 1;
            }

            // content after the marker
            let mut has_content = false;
            let mut any_default = false;
            let mut cols_seen: BTreeMap<String, usize> = BTreeMap::new();
            for c in (col0 + 1)..cols {
                if let Some(cell) = s.cell(i, c) {
                    let txt = cell.contents();
                    if !txt.trim().is_empty() {
                        has_content = true;
                        let n = colour_name(cell.fgcolor());
                        if n == "Default" {
                            any_default = true;
                        }
                        *cols_seen.entry(n).or_default() += 1;
                    }
                }
            }
            if has_content {
                t.composer_with_content += 1;
                for (k, v) in cols_seen {
                    *t.content_colours.entry(k).or_default() += v;
                }
                if !any_default {
                    t.content_all_nondefault += 1;
                    if t.first_all_nondefault_at.is_none() {
                        t.first_all_nondefault_at = Some(t.byte_offset);
                    }
                    if t.sample_all_nondefault.len() < 8 {
                        t.sample_all_nondefault
                            .push(line.trim_end().chars().take(110).collect());
                    }
                }
            }
        }
    }
}

fn main() {
    let mut args: Vec<String> = env::args().skip(1).collect();
    let mut tail: usize = usize::MAX;
    if let Some(p) = args.iter().position(|a| a == "--tail") {
        tail = args[p + 1].parse().expect("--tail <bytes>");
        args.drain(p..=p + 1);
    }
    let targets = if args.is_empty() {
        vec!["fixtures/screens/composer_empty_reads_busy_2026-09-09.bin".to_string()]
    } else {
        args
    };

    for path in targets {
        let data = match fs::read(&path) {
            Ok(d) => d,
            Err(e) => {
                println!("== {path}: UNREADABLE ({e})");
                continue;
            }
        };
        let data = if data.len() > tail { data[data.len() - tail..].to_vec() } else { data };
        let cols: u16 = env::var("PROBE_COLS").ok().and_then(|v| v.parse().ok()).unwrap_or(COLS);
        let rows: u16 = env::var("PROBE_ROWS").ok().and_then(|v| v.parse().ok()).unwrap_or(ROWS);
        let mut p = vt100::Parser::new(rows, cols, 0);
        let mut t = Tally::default();

        if data.len() <= CHUNK * 4 {
            // a single-frame fixture: replay whole, measure once
            p.process(&data);
            measure(&p, &mut t);
            dump_frame(&p);
        } else {
            let mut i = 0usize;
            while i < data.len() {
                let end = (i + CHUNK).min(data.len());
                p.process(&data[i..end]);
                t.byte_offset = end;
                measure(&p, &mut t);
                i = end;
            }
            // and the final frame, dumped
            dump_frame(&p);
        }

        println!("\n== {path}  ({} bytes)", data.len());
        println!("   frames sampled          {}", t.frames);
        println!("   with a `─` rule anywhere {}", t.with_rule);
        println!("   NO rule at all           {}", t.no_rule);
        println!("   rule -> `❯` (ANCHOR OK)  {}", t.rule_then_marker);
        println!("   rule -> something else   {}", t.rule_then_other);
        println!("   anchor != last-`❯` row   {}", t.disagree);
        println!("   rule widths (cols={COLS}) {:?}", t.rule_widths);
        println!("   marker colours           {:?}", t.marker_colours);
        println!("   composer rows w/ content {}", t.composer_with_content);
        println!("   ...content colours       {:?}", t.content_colours);
        println!("   ...ALL-non-Default rows  {}  <-- the splice case", t.content_all_nondefault);
        println!("   ...first one ends at byte {:?} of the replayed slice", t.first_all_nondefault_at);
        println!(
            "   -- anchored frames {} (truth: empty {} / occupied {})",
            t.anchored,
            t.truth_empty,
            t.anchored - t.truth_empty
        );
        println!(
            "      SHIPPED right {}  false-BUSY {}  false-EMPTY {}",
            t.old_right, t.old_false_busy, t.old_false_empty
        );
        println!(
            "      ANCHOR  right {}  false-BUSY {}  false-EMPTY {}",
            t.new_right, t.new_false_busy, t.new_false_empty
        );
        for s in &t.sample_all_nondefault {
            println!("        {s:?}");
        }
        for s in &t.sample_rule_then_other {
            println!("      rule->other: {s:?}");
        }
    }
}

fn dump_frame(p: &vt100::Parser) {
    let s = p.screen();
    let (rows, cols) = s.size();
    let n = if env::var("PROBE_FULL").is_ok() { rows } else { 12 };
    println!("--- final frame, bottom {n} rows of {rows}x{cols} ---");
    for r in rows.saturating_sub(n)..rows {
        let line = row_text(s, r, cols);
        let rule = rule_run(s, r, cols);
        let mut cols_seen: BTreeMap<String, usize> = BTreeMap::new();
        for c in 0..cols {
            if let Some(cell) = s.cell(r, c) {
                if !cell.contents().trim().is_empty() {
                    *cols_seen.entry(colour_name(cell.fgcolor())).or_default() += 1;
                }
            }
        }
        println!(
            "r{r:>3} rule={:?} {:?} :: {}",
            rule,
            cols_seen,
            line.trim_end().chars().take(80).collect::<String>()
        );
    }
}
