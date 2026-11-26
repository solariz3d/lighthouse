// mutate.js (pane O, L250): hand mutants of src-tauri/src/kn5road.rs against its own (non-ignored) cargo rows. Each mutant must match exactly once;
// a mutant that does not apply is reported NOT APPLIED, never counted. The file is restored byte for byte after each, and checked at the end.
// usage: node mutate.js <tree>   (CARGO_TARGET_DIR set by the caller)
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process'), crypto = require('crypto');
const tree = process.argv[2], file = path.join(tree, 'src-tauri', 'src', 'kn5road.rs');
const orig = fs.readFileSync(file), sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const M = [
  ['the letter-run key rule (pane B L243) instead of starts-with', 'keys.iter().any(|k| !k.is_empty() && rest.starts_with(k.as_str()))', 'keys.iter().any(|k| !k.is_empty() && rest.split(|c: char| !c.is_ascii_alphabetic()).next() == Some(k.as_str()))'],
  ["AC's defaults ROAD and KERB dropped", 'let mut keys: Vec<String> = AC_DEFAULT_KEYS.iter().map(|k| k.to_string()).collect();', 'let mut keys: Vec<String> = Vec::new();'],
  ['parent before child in the matrix product', 'mul(&l, &parent) }', 'mul(&parent, &l) }'],
  ['an index equal to the vertex count let through', 'idx.iter().find(|&&i| i as u64 >= nv)', 'idx.iter().find(|&&i| i as u64 > nv)'],
  ['indices not moved by the batch offset', 'b.idx.extend(m.idx.iter().map(|&i| (base + i as usize) as u16));', 'b.idx.extend(m.idx.iter().map(|&i| i));'],
  ['a placed model never seen as placed', 'fn moves(v: Option<&str>) -> bool { v.map_or(false,', 'fn moves(v: Option<&str>) -> bool { false && v.map_or(false,'],
  ["a models ini file outside the track's folder let through", 'if !real.starts_with(&td) { return Err(', 'if false && !real.starts_with(&td) { return Err('],
  ['no padding after an odd index count', 'if b.idx.len() % 2 == 1 { out.extend_from_slice(&[0, 0]); }', ''],
  ["the track's surfaces.ini before the layout's", '[(!layout.is_empty()).then(|| (td.join(layout).join("data").join("surfaces.ini"), "layout")), Some((td.join("data").join("surfaces.ini"), "track"))]', '[Some((td.join("data").join("surfaces.ini"), "track")), (!layout.is_empty()).then(|| (td.join(layout).join("data").join("surfaces.ini"), "layout"))]'],
  ['models.ini before models_<layout>.ini', '[(!layout.is_empty()).then(|| format!("models_{layout}.ini")), Some("models.ini".to_string())]', '[Some("models.ini".to_string()), (!layout.is_empty()).then(|| format!("models_{layout}.ini"))]'],
  ["the length check one byte loose", 'map_or(true, |end| end > self.len)', 'map_or(true, |end| end > self.len + 1)'],
  ["version 5 read as if it had the extra int", 'if s.u32("the version")? > 5 {', 'if s.u32("the version")? >= 5 {'],
];
let applied = 0, caught = 0, notApplied = 0, noCompile = 0; const rows = [];
for (const [name, from, to] of M) {
  const text = orig.toString('utf8'), n = text.split(from).length - 1;
  if (n !== 1) { notApplied++; rows.push(`NOT APPLIED (${n} matches): ${name}`); continue; }
  fs.writeFileSync(file, text.replace(from, to)); applied++;
  const r = spawnSync('cargo', ['test', '--lib', 'kn5road'], { cwd: path.join(tree, 'src-tauri'), encoding: 'utf8', shell: true });
  fs.writeFileSync(file, orig);
  const out = r.stdout + r.stderr, res = (out.match(/test result: (\w+)\. (\d+) passed; (\d+) failed/) || []);
  const compiled = !/error(\[E\d+\])?:/.test(out) || !!res[0];
  const failedRows = [...out.matchAll(/^test (kn5road::tests::\S+) \.\.\. FAILED/gm)].map((m) => m[1].replace('kn5road::tests::', ''));
  if (!res[0]) { noCompile++; rows.push(`DID NOT COMPILE (not counted): ${name}`); continue; }
  const isCaught = res[1] === 'FAILED';
  if (isCaught) caught++;
  rows.push(`${isCaught ? 'caught' : 'SURVIVED'}: ${name}(${res[2]} passed, ${res[3]} failed: ${failedRows.join(', ')})`);
}
const restored = sha(fs.readFileSync(file)) === sha(orig);
console.log(rows.join('\n'));
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied} / did not compile ${noCompile}; restored byte for byte: ${restored}`);
