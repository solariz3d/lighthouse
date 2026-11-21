// mutate_fix.js (B, L218 fix, after pane A's read): A's 19 mutants of cut_at_handback.rs (A's mutate.js, its list unchanged) and 8 of
// the pending-cut rule, one at a time on a COPY of the fixed file in a scratch crate, against the file's own rows.
// applied = the replaced text occurs exactly once; caught = at least one row fails.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const HERE = __dirname, SRC = path.join(HERE, 'mini', 'src', 'cut_at_handback.rs');
const ORIG = fs.readFileSync(process.argv[2], 'utf8');
const M = [
  // A's list, verbatim
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
  // the pending-cut rule (A's item 1)
  ['P1 begin records nothing (no dispatch is ever held)', '        self.cuts.insert(pane.to_string(), Cut { gen: self.next_gen, ring_ms, sent: false });\n', ''],
  ['P2 a sending cut is replaced by a new ring', '        if self.cuts.get(pane).is_some_and(|c| c.sent) {\n            return None;\n        }\n', ''],
  ['P3 an older thread can release a newer cut', '        if self.is_current(pane, gen) {\n            self.cuts.remove(pane);', '        if true {\n            self.cuts.remove(pane);'],
  ['P4 an older thread can mark a newer cut sent', '            Some(c) if c.gen == gen => {', '            Some(c) => {'],
  ['P5 a later turn does not drop the cut', '    if later_turn {\n        return Poll::Drop', '    if false {\n        return Poll::Drop'],
  ['P6 the 30-minute abandon never fires', '    if waited >= limit {\n        return Poll::Drop', '    if false {\n        return Poll::Drop'],
  ['P7 a tool result counts as a later turn', '            Some(serde_json::Value::Array(a)) => a.iter().any(|b| b.get("type").and_then(|x| x.as_str()) == Some("text")),', '            Some(serde_json::Value::Array(_)) => true,'],
  ['P8 a prompt before the ring counts as a later turn', '.is_some_and(|t| t.timestamp_millis() as u64 > ring_ms);', '.is_some();'],
];
function run() {
  const r = spawnSync('cargo', ['test', '--lib', '--offline'], { cwd: path.join(HERE, 'mini'), env: { ...process.env, CARGO_TARGET_DIR: 'C:/build/b-mini-target', CARGO_BUILD_JOBS: '4' }, encoding: 'utf8' });
  const out = r.stdout + r.stderr; const m = out.match(/test result: \w+\. (\d+) passed; (\d+) failed/);
  return { pass: m ? +m[1] : -1, fail: m ? +m[2] : -1, out };
}
fs.writeFileSync(SRC, ORIG); const c = run(); console.log('CONTROL (the fixed file, unmutated): ' + c.pass + ' passed, ' + c.fail + ' failed' + (c.pass < 0 ? '\n' + c.out.slice(-1500) : ''));
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
