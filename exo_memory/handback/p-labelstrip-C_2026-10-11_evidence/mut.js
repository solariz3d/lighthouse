// Mutants for D297 on a COPY tree (G:/worktrees/c-d297-base, checked out at the commit under test),
// never on the worktree being committed. Each: apply by exact anchor (must occur once), run
// index_title_tests, restore. usage: node mut.js [name prefix]
const fs = require('fs'), cp = require('child_process');
const WT = 'G:/worktrees/c-d297-base', F = WT + '/consonance/src-tauri/src/main.rs';
const orig = fs.readFileSync(F, 'utf8');
const M = [
  ['N0 control', null, null],
  ['N1 a colon ends a label with no ledger id', "if words[i - 1].ends_with(':') {\n            if !ledger {", "if words[i - 1].ends_with(':') {\n            if false {"],
  ['N2 a dash ends a label with no ledger id', 'if matches!(w, "\\u{2014}" | "\\u{2013}" | "\\u{00b7}") {\n            if !ledger {', 'if matches!(w, "\\u{2014}" | "\\u{2013}" | "\\u{00b7}") {\n            if false {'],
  ['N3 the path shows every word', '    !w.is_empty()\n        && path.to_ascii_lowercase()', '    true || path.to_ascii_lowercase()'],
  ['N4 a title within the cap is stripped too', 'fn strip_lead_label<\'a>(path: &str, head: &\'a str) -> &\'a str {\n    if head.chars().count() <= INDEX_TITLE_CHARS {', 'fn strip_lead_label<\'a>(path: &str, head: &\'a str) -> &\'a str {\n    if false {'],
  ['N5 an all-label title is emptied', 'Some(rest) if !rest.is_empty() => rest,', 'Some(rest) => rest,'],
  ['N6 no prefix-4 rule', ' || (t.len() >= 4 && w.starts_with(t))', ''],
  ['N7 no qualifier', 'matches!(core, "packet" | "part" | "item" | "step" | "pane" | "lap" | "Lap")', 'false'],
  ['N8 parentheses not trimmed', "let core = w.trim_start_matches('(').trim_end_matches", 'let core = w.trim_end_matches'],
  ['N9 a lone capital is an id', '(1..=4).contains(&digits)', '(0..=4).contains(&digits)'],
  ['N10 a lowercase P- run is an id', 'p.chars().all(|c| c.is_ascii_uppercase() || c.is_ascii_digit())', 'p.chars().all(|c| c.is_ascii_alphanumeric())'],
  ['N11 a colon does not end the label', "if words[i - 1].ends_with(':') {\n            if !ledger {\n                return head;\n            }\n            break;\n        }", "if false {\n            if !ledger {\n                return head;\n            }\n            break;\n        }"],
  ['N12 the strip is not called', 'index_title(strip_lead_label(label, head))', 'index_title(head)'],
  ['N13 (D296 M6) no title cap', 'if head.chars().count() <= INDEX_TITLE_CHARS {\n        return head.to_string();', 'if true {\n        return head.to_string();'],
  ['N14 (D296 M7) untitled prints nothing', 'return "(no title)".to_string();', 'return String::new();'],
];
const out = [];
for (const [name, from, to] of M.filter((m) => !process.argv[2] || m[0].startsWith(process.argv[2] + ' '))) {
  let src = orig;
  if (from) {
    const n = src.split(from).length - 1;
    if (n !== 1) { out.push(`${name}: NOT APPLIED (anchor found ${n} times)`); console.log(out[out.length - 1]); continue; }
    src = src.replace(from, () => to);
  }
  fs.writeFileSync(F, src);
  let log = '';
  try {
    log = cp.execSync('~/.cargo/bin/cargo.exe test --bin consonance index_title_tests 2>&1',
      { cwd: WT + '/consonance/src-tauri', shell: 'bash', env: { ...process.env, CARGO_TARGET_DIR: 'G:/ctarget/c-d296-mut' }, encoding: 'utf8', maxBuffer: 1 << 28 });
  } catch (e) { log = (e.stdout || '') + (e.stderr || ''); }
  const failed = [...log.matchAll(/^test (\S+) \.\.\. FAILED/gm)].map((m) => m[1].split('::').pop());
  const compileErr = /error(\[E\d+\])?:/.test(log) && !/test result/.test(log);
  out.push(`${name}: ${compileErr ? 'COMPILE ERROR' : failed.length ? 'caught by ' + failed.join(', ') : 'SURVIVED'}`);
  console.log(out[out.length - 1]);
}
fs.writeFileSync(F, orig);
console.log('--- tree ' + cp.execSync('git -C ' + WT + ' log -1 --format=%h', { encoding: 'utf8' }).trim() + ', restored: ' + (fs.readFileSync(F, 'utf8') === orig));
console.log(out.join('\n'));
