// L220 second read of l216-no-prompt: one mutant at a time on a COPY of cut_at_handback.rs (the branch's file, byte for byte, from git show),
// each run against the file's own 10 rows in a scratch crate. applied = the replaced text occurs exactly once; caught = at least one row fails.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const HERE = __dirname, SRC = path.join(HERE, 'mini', 'src', 'cut_at_handback.rs'), ORIG = fs.readFileSync('C:/Users/zackn/AppData/Local/Temp/cut_orig.rs', 'utf8');
const M = [
  ['A1 unlisted pane: at_ring ignores the key (writes a row for everyone)', '    if !listed {\n        return None;\n    }\n    if !is_handback', '    if !is_handback'],
  ['B1 under the dial: >= instead of >', 'Some(c) if c > dial => Ok(c),', 'Some(c) if c >= dial => Ok(c),'],
  ['B2 under the dial: any context cuts', 'Some(c) if c > dial => Ok(c),', 'Some(c) if c > 0 => Ok(c),'],
  ['B3 context unread: cut anyway', 'None => Err("left alone: its context could not be read from the transcript".to_string()),', 'None => Ok(0),'],
  ['C1 mid-turn: cut while the turn runs', 'if !turn_ended {', 'if false {'],
  ['C2 a background task running: cut anyway', 'if !open_tasks.is_empty() {', 'if false {'],
  ['D1 THE EMPTY KEY: an absent key lists B', 'let Some(list) = v.get(KEY).and_then(|x| x.as_array()) else { return out };', 'let Some(list) = v.get(KEY).and_then(|x| x.as_array()) else { out.letters.push("B".to_string()); return out };'],
  ['D2 THE EMPTY KEY: a config that is not JSON lists B', 'let Some(v) = raw_config.and_then(|r| serde_json::from_str::<serde_json::Value>(r).ok()) else { return out };', 'let Some(v) = raw_config.and_then(|r| serde_json::from_str::<serde_json::Value>(r).ok()) else { out.letters.push("B".to_string()); return out };'],
  ['D3 THE EMPTY KEY: an empty list means every pane', 'self.letters.iter().any(|l| l.eq_ignore_ascii_case(letter))', 'self.letters.is_empty() || self.letters.iter().any(|l| l.eq_ignore_ascii_case(letter))'],
  ['D4 THE EMPTY KEY: a key that is a string is read as a one-letter list', 'let Some(list) = v.get(KEY).and_then(|x| x.as_array()) else', 'let Some(list) = v.get(KEY).and_then(|x| x.as_array().cloned().or_else(|| x.as_str().map(|s| vec![serde_json::Value::String(s.to_string())]))) else'],
  ['E1 dispatch: an unlisted pane is held', 'listed && last_call_age_min', 'last_call_age_min'],
  ['E2 dispatch: a warm pane is held', 'is_some_and(|a| a >= COLD_MIN)', 'is_some_and(|a| a >= 0)'],
  ['E3 dispatch: the cold bound is > not >= (a pane exactly COLD_MIN old)', 'is_some_and(|a| a >= COLD_MIN)', 'is_some_and(|a| a > COLD_MIN)'],
  ['E4 dispatch: a small pane is held', 'context.is_some_and(|c| c > dial)', 'context.is_some_and(|c| c > 0)'],
  ['E5 dispatch: no call read counts as cold', 'last_call_age_min.is_some_and(|a| a >= COLD_MIN)', 'last_call_age_min.map_or(true, |a| a >= COLD_MIN)'],
  ['E6 dispatch: no context read counts as large', 'context.is_some_and(|c| c > dial)', 'context.map_or(true, |c| c > dial)'],
  ['F1 housed names: "lib" is allowed', '"librarian", "lib", ', '"librarian", "libx", '],
  ['F2 housed letters from the table are allowed', 'housed_letters.iter().any(|h| h.eq_ignore_ascii_case(s))', 'false'],
  ['G1 is_handback: any text with .md', 'w.contains("handback/") && ', ''],
];
function run() { const r = spawnSync('cargo', ['test', '--lib'], { cwd: path.join(HERE, 'mini'), env: { ...process.env, CARGO_TARGET_DIR: 'C:/build/a-mini-target' }, encoding: 'utf8' }); const out = r.stdout + r.stderr; const m = out.match(/test result: \w+\. (\d+) passed; (\d+) failed/); return { pass: m ? +m[1] : -1, fail: m ? +m[2] : -1, out }; }
fs.writeFileSync(SRC, ORIG); const c = run(); console.log('CONTROL (unmutated copy): ' + c.pass + ' passed, ' + c.fail + ' failed');
let applied = 0, caught = 0, notApplied = 0; const survivors = [];
for (const [id, from, to] of M) {
  const n = ORIG.split(from).length - 1;
  if (n !== 1) { notApplied++; console.log('NOT APPLIED (' + n + ' occurrences): ' + id); continue; }
  applied++; fs.writeFileSync(SRC, ORIG.replace(from, () => to));
  const r = run();
  if (r.pass === -1) { console.log('BUILD FAILED (not counted as caught): ' + id + '\n' + r.out.slice(-400)); applied--; notApplied++; continue; }
  if (r.fail > 0) { caught++; console.log('caught (' + r.fail + ' failed): ' + id); } else { survivors.push(id); console.log('NOT CAUGHT: ' + id); }
}
fs.writeFileSync(SRC, ORIG);
console.log('applied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + notApplied + (survivors.length ? ' / SURVIVORS: ' + survivors.join(' | ') : ''));
