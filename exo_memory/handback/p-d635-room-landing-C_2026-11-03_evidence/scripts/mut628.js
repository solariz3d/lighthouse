// mut628.js (D628, O): mutants on the owed-visit decision. Each: the anchor must occur EXACTLY ONCE (else NOT APPLIED), the file is patched,
// the covering tests run, the file is restored byte for byte (checked). Caught = the tests exit non-zero. node mut628.js <out.json>
'use strict';
require('C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d635/winhide.js');
const fs = require('fs'), os = require('os'), { spawnSync } = require('child_process');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'C D635 landing: O D628 mutants (cargo + node, BelowNormal)' });
const W = 'C:/Users/nname/Desktop/worktrees/lh-d635-c/';
const RS = W + 'consonance/src-tauri/src/main.rs', JS = W + 'consonance/tools/chain-status.js';
const rust = () => spawnSync('C:/Users/nname/.cargo/bin/cargo.exe', ['test', '--bin', 'consonance', 'owed_visit_tests'],
  { cwd: W + 'consonance/src-tauri', encoding: 'utf8', maxBuffer: 1 << 28, env: { ...process.env, CARGO_TARGET_DIR: 'G:/Consonance-tools/cargo-c635', CARGO_TERM_COLOR: 'never' } });
const node = () => spawnSync(process.execPath, ['--test', '--test-name-pattern=D628', 'chain-status.test.js'], { cwd: W + 'consonance/tools', encoding: 'utf8', maxBuffer: 1 << 26 });
const M = [
  ['R1 owed pane: any letter but its own', RS, '.any(|l| l == letter)', '.any(|l| l != letter)', rust],
  ['R2 owing applies to every role', RS, '("committee", "owing") if', '(_, "owing") if', rust],
  ['R3 all-in applies to every role', RS, '("librarian", "all-in") if', '(_, "all-in") if', rust],
  ['R4 a work turn is harvested as a letter', RS, 'Some(w) => (w, false),', 'Some(w) => (w, true),', rust],
  ['R5 no lap is not refused', RS, 'if s.lap.is_empty() {', 'if false && s.lap.is_empty() {', rust],
  ['R6 the send ignores the owed state', RS, 'let (text, visiting) = owed_visit_choice(text, work);\n    let text = if visiting', 'let (text, visiting) = owed_visit_choice(text, None);\n    let text = if visiting', rust],
  ['R7 every unowed text counts as a letter', RS, 'let visiting = normal != KEEP_WARM_TEXT;', 'let visiting = true;', rust],
  ['R8 a state-less object reads as a state', RS, 'state: s("state")?,', 'state: s("state").unwrap_or_default(),', rust],
  ['J1 owed while the panes are not the holder', JS, "if (head.holder !== 'panes') return { state: 'n/a', lap: head.lap", "if (false) return { state: 'n/a', lap: head.lap", node],
  ['J2 no pointers asked for', JS, 'withPointers: true, blindState', 'withPointers: false, blindState', node],
  ['J3 the OLDEST pointer kept', JS, 'e.ts >= ((pointers.get(L) || {}).at || 0)', 'e.ts <= ((pointers.get(L) || {}).at || 0)', node],
  ['J4 pointers from before the anchor', JS, 'if (opts.withPointers && L && e.ts > anchor) {', 'if (opts.withPointers && L) {', node],
  ['J5 --owed-json not answered', JS, "if (argv.includes('--owed-json'))", 'if (false)', node],
];
const out = [];
for (const [name, file, from, to, run] of M) {
  const orig = fs.readFileSync(file);
  const s = orig.toString('utf8'), n = s.split(from).length - 1;
  if (n !== 1) { out.push({ name, verdict: 'NOT APPLIED', matches: n }); console.log(name, 'NOT APPLIED', n); continue; }
  fs.writeFileSync(file, s.replace(from, () => to));
  const t0 = Date.now(); const r = run();
  fs.writeFileSync(file, orig);
  if (!fs.readFileSync(file).equals(orig)) throw new Error('restore failed for ' + name);
  const caught = r.status !== 0, compileErr = /error(\[E\d+\])?:/.test(r.stderr || '') && /could not compile/.test(r.stderr || '');
  const all = (r.stdout || '') + (r.stderr || '');
  const result = (all.match(/test result: [^\n]*/) || all.replace(/\x1b\[[0-9;]*m/g, '').match(/ℹ fail \d+/) || ['(no result line)'])[0];
  const failed = (all.match(/^test \S+ \.\.\. FAILED$/gm) || []).map((x) => x.split(' ')[1]);
  out.push({ name, verdict: caught ? 'caught' : 'SURVIVED', exit: r.status, compileError: compileErr, result, failed, s: Math.round((Date.now() - t0) / 1000) });
  console.log(name, caught ? 'caught' : 'SURVIVED', 'exit', r.status, compileErr ? '(compile error)' : '', '|', result, failed.join(','), Math.round((Date.now() - t0) / 1000) + ' s');
}
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
const a = out.filter((x) => x.verdict !== 'NOT APPLIED');
console.log(`applied ${a.length} / caught ${a.filter((x) => x.verdict === 'caught').length} / NOT APPLIED ${out.length - a.length}`);
