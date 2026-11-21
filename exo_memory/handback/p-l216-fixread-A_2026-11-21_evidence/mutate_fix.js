// L220, A's read of B's fix alone (fc8a971b..a77e2d8c): my OWN mutants (A's 19 from the first read, plus 11 of the pending-cut registry that are not B's P1-P8),
// one at a time on a copy of the fixed cut_at_handback.rs (git show 3829e1c3), each run against the file's own rows in a scratch crate.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const HERE = __dirname, SRC = path.join(HERE, 'mini2', 'src', 'cut_at_handback.rs'), ORIG = fs.readFileSync('C:/Users/zackn/AppData/Local/Temp/cut_fix_orig.rs', 'utf8');
const first = fs.readFileSync(path.join(HERE, 'mutate.js'), 'utf8');
// the first read's list, read back from its own file (every [id, from, to] row of M)
const M = eval(first.slice(first.indexOf('const M = [') + 10, first.indexOf('];\nfunction run') + 1));
const Q = String.fromCharCode(39);
M.push(
  ['R1 the registry holds nothing', 'self.cuts.contains_key(pane)', 'false'],
  ['R2 a cut already sending is replaced by a newer hand-back', 'if self.cuts.get(pane).is_some_and(|c| c.sent) {\n            return None;\n        }\n', ''],
  ['R3 resolve ignores whose cut it is', 'if self.is_current(pane, gen) {\n            self.cuts.remove(pane);', 'if true {\n            self.cuts.remove(pane);'],
  ['R4 mark_sent ignores whose cut it is', 'Some(c) if c.gen == gen => {', 'Some(c) => {'],
  ['R5 a later turn does not win once the ringing turn has ended', 'if later_turn {', 'if later_turn && !turn_ended {'],
  ['R6 the 30-minute abandon is > not >=', 'if waited >= limit {', 'if waited > limit {'],
  ['R7 any user row after the ring is a later turn (tool results count)', 'Some(serde_json::Value::Array(a)) => a.iter().any(|b| b.get("type").and_then(|x| x.as_str()) == Some("text")),', 'Some(serde_json::Value::Array(_)) => true,'],
  ['R8 the ring time is ignored (any prompt row counts)', '.is_some_and(|t| t.timestamp_millis() as u64 > ring_ms);', '.is_some();'],
  ['R9 a subagent' + Q + 's prompt row counts as a later turn', ' || v.get("isSidechain").and_then(|x| x.as_bool()) == Some(true) {', ' {'],
  ['R10 is_current is always true', '.is_some_and(|c| c.gen == gen)', '.is_some()'],
  ['R11 begin does not bump the generation', 'self.next_gen += 1;', ''],
);
function run() { const r = spawnSync('cargo', ['test', '--lib'], { cwd: path.join(HERE, 'mini2'), env: { ...process.env, CARGO_TARGET_DIR: 'C:/build/a-mini2-target' }, encoding: 'utf8' }); const out = r.stdout + r.stderr; const m = out.match(/test result: \w+\. (\d+) passed; (\d+) failed/); return { pass: m ? +m[1] : -1, fail: m ? +m[2] : -1, out }; }
fs.writeFileSync(SRC, ORIG); const c = run(); console.log('CONTROL (the fixed file, unmutated): ' + c.pass + ' passed, ' + c.fail + ' failed');
let applied = 0, caught = 0, na = 0; const surv = [];
for (const [id, from, to] of M) {
  const n = ORIG.split(from).length - 1;
  if (n !== 1) { na++; console.log('NOT APPLIED (' + n + ' occurrences): ' + id); continue; }
  fs.writeFileSync(SRC, ORIG.replace(from, () => to));
  const r = run();
  if (r.pass === -1) { na++; console.log('BUILD FAILED (not counted): ' + id + '\n' + r.out.slice(-300)); continue; }
  applied++;
  if (r.fail > 0) { caught++; console.log('caught (' + r.fail + ' failed): ' + id); } else { surv.push(id); console.log('NOT CAUGHT: ' + id); }
}
fs.writeFileSync(SRC, ORIG);
console.log('applied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + na + (surv.length ? ' / SURVIVORS: ' + surv.join(' | ') : ''));
