// mutate2.js (pane O, L250, the start and tighter-match part): hand mutants of src-tauri/src/kn5road.rs against its own (non-ignored) cargo rows.
// Each mutant must match exactly once; one that does not apply is NOT APPLIED and not counted; one that does not compile is not counted.
// The file is restored byte for byte after each, and checked at the end. usage: node mutate2.js <tree>   (CARGO_TARGET_DIR set by the caller)
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process'), crypto = require('crypto');
const tree = process.argv[2], file = path.join(tree, 'src-tauri', 'src', 'kn5road.rs');
const orig = fs.readFileSync(file), sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const RULE = "rest.starts_with(k.as_str()) && !rest[k.len()..].chars().next().map_or(false, char::is_alphabetic)";
const M = [
  // the rule
  ["cac348e's rule: a bare starts-with, no end after the key", RULE, 'rest.starts_with(k.as_str())'],
  ['the letter-run key rule (pane B L243)', RULE, "rest.split(|c: char| !c.is_ascii_alphabetic()).next() == Some(k.as_str())"],
  ['a digit after the key not taken as an end', 'map_or(false, char::is_alphabetic))', 'map_or(false, |c| c.is_alphanumeric()))'],
  // the start
  ["the start dummy's forward reversed", 't: [f[0] / l, f[1] / l, f[2] / l], from: "AC_START_0"', 't: [-f[0] / l, -f[1] / l, -f[2] / l], from: "AC_START_0"'],
  ['the time line facing R - L (along the gate) instead of across it', 't: [dz / len, 0.0, -dx / len], from: "AC_TIME_0"', 't: [dx / len, 0.0, dz / len], from: "AC_TIME_0"'],
  ['the time line facing down the other way', 't: [dz / len, 0.0, -dx / len], from: "AC_TIME_0"', 't: [-dz / len, 0.0, dx / len], from: "AC_TIME_0"'],
  ["the time line's middle taken at L", '(l.pos[1] + r.pos[1]) / 2.0', 'l.pos[1]'],
  ['the time line before the start dummy', 'if let Some(s) = find("AC_START_0") {', 'if let Some(s) = find("AC_START_0").filter(|_| find("AC_TIME_0_L").is_none()) {'],
  ["a placed model's dummy used for the start", '!placed).map(|(d, _)| d).collect::<Vec<_>>());\n    Road {', 'true).map(|(d, _)| d).collect::<Vec<_>>());\n    Road {'],
  ['an AC_ dummy kept by the parent matrix, not its own', 'pos: [w[12], w[13], w[14]], fwd: [w[8], w[9], w[10]]', 'pos: [parent[12], parent[13], parent[14]], fwd: [parent[8], parent[9], parent[10]]'],
  ['the header without the start', 'Ok(s) => head["start"] = serde_json::json!({ "pos": s.pos, "T": s.t, "from": s.from }),', 'Ok(_) => head["start"] = serde_json::Value::Null,'],
  ['the header without the reason', 'head["noStart"] = serde_json::json!(why);', 'let _ = why;'],
];
let applied = 0, caught = 0, notApplied = 0, noCompile = 0; const rows = [];
for (const [name, from, to] of M) {
  const text = orig.toString('utf8').replace(/\r\n/g, '\n'), n = text.split(from).length - 1;
  if (n !== 1) { notApplied++; rows.push(`NOT APPLIED (${n} matches): ${name}`); continue; }
  fs.writeFileSync(file, text.replace(from, to)); applied++;
  const r = spawnSync('cargo test --lib kn5road', { cwd: path.join(tree, 'src-tauri'), encoding: 'utf8', shell: true });
  fs.writeFileSync(file, orig);
  const out = r.stdout + r.stderr, res = (out.match(/test result: (\w+)\. (\d+) passed; (\d+) failed/) || []);
  const failedRows = [...out.matchAll(/^test (kn5road::tests::\S+) \.\.\. FAILED/gm)].map((m) => m[1].replace('kn5road::tests::', ''));
  if (!res[0]) { noCompile++; rows.push(`DID NOT COMPILE (not counted): ${name}`); continue; }
  const isCaught = res[1] === 'FAILED';
  if (isCaught) caught++;
  rows.push(`${isCaught ? 'caught' : 'SURVIVED'}: ${name} (${res[2]} passed, ${res[3]} failed: ${failedRows.join(', ')})`);
}
const restored = sha(fs.readFileSync(file)) === sha(orig);
console.log(rows.join('\n'));
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied} / did not compile ${noCompile}; restored byte for byte: ${restored}`);
