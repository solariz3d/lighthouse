// Mutants for D296 on a COPY tree (G:/worktrees/c-d296-base checked out at the commit under test),
// never on the worktree being committed. Each: apply by exact anchor, run the rows, restore.
const fs = require('fs'), cp = require('child_process');
const WT = 'G:/worktrees/c-d296-base', F = WT + '/consonance/src-tauri/src/main.rs';
const orig = fs.readFileSync(F, 'utf8');
const M = [
  ['M0 control', null, null],
  ['M1 mapped check removed', 'if map_text.contains(name) || map_text.contains(stem) { continue; }', 'if false { continue; }'],
  ['M2 hand-backs bypass the budget', 'if !index_full && index_spent + cost <= index_budget {', 'if e.group == 1 || (!index_full && index_spent + cost <= index_budget) {'],
  ['M3 recurse into evidence folders', 'let Ok(rd) = fs::read_dir(root.join("handback")) else { return out };\n    for e in rd.flatten() {\n        let p = e.path();', 'let mut fl = Vec::new(); collect_md(&root.join("handback"), true, &mut fl);\n    for p in fl {'],
  ['M4 missing map/ means nothing unmapped', 'let mut map_text = String::new();', 'if !root.join("map").is_dir() { return Vec::new(); }\n    let mut map_text = String::new();'],
  ['M5 zero hand-backs not reported', '    let handbacks_listed = indexed.iter().filter(|l| l.starts_with("- handback/")).count();\n    s.push_str(', '    let handbacks_listed = indexed.iter().filter(|l| l.starts_with("- handback/")).count();\n    if handbacks_unmapped > 0 { s.push_str('],
  ['M6 no title cap', 'if head.chars().count() <= INDEX_TITLE_CHARS {', 'if true {'],
  ['M7 untitled prints nothing', 'return "(no title)".to_string();', 'return String::new();'],
  ['M8 hand-backs not newest first', '1 | 2 => b.date.cmp(&a.date)', '2 => b.date.cmp(&a.date)'],
];
// M5 needs its closing brace after the push_str(...); statement
const BS = String.fromCharCode(92);
const fixM5 = (s) => s.replace('listed).' + BS + 'n"\n    ));', 'listed).' + BS + 'n"\n    )); }');
const out = [];
for (const [name, from, to] of M.filter((m) => !process.argv[2] || m[0].startsWith(process.argv[2]))) {
  let src = orig;
  if (from) {
    const n = src.split(from).length - 1;
    if (n !== 1) { out.push(`${name}: NOT APPLIED (anchor found ${n} times)`); continue; }
    src = src.replace(from, to);
    if (name.startsWith('M5')) { const s2 = fixM5(src); if (s2 === src) { out.push(`${name}: NOT APPLIED (brace anchor)`); continue; } src = s2; }
  }
  fs.writeFileSync(F, src);
  let log = '';
  try {
    log = cp.execSync('~/.cargo/bin/cargo.exe test --bin consonance shelf_handback_tests 2>&1; ~/.cargo/bin/cargo.exe test --bin consonance index_title 2>&1',
      { cwd: WT + '/consonance/src-tauri', shell: 'bash', env: { ...process.env, CARGO_TARGET_DIR: 'G:/ctarget/c-d296-mut' }, encoding: 'utf8', maxBuffer: 1 << 28 });
  } catch (e) { log = (e.stdout || '') + (e.stderr || ''); }
  const failed = [...log.matchAll(/^test (\S+) \.\.\. FAILED/gm)].map((m) => m[1].split('::').pop());
  const compileErr = /error(\[E\d+\])?:/.test(log) && !/test result/.test(log);
  out.push(`${name}: ${compileErr ? 'COMPILE ERROR' : failed.length ? 'caught by ' + failed.join(', ') : 'SURVIVED'}`);
  console.log(out[out.length - 1]);
}
fs.writeFileSync(F, orig);
console.log('---'); console.log(out.join('\n'));
