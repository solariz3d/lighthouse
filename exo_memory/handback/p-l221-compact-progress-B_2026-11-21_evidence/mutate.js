// B, L221: mutants of the progress reader in close_small.rs, one at a time on a copy in the scratch crate, against the file's rows.
// applied = the replaced text occurs exactly once; caught = at least one row fails.   node mutate.js <close_small.rs>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const SRC = path.join(__dirname, 'mini', 'src', 'close_small.rs');
const ORIG = fs.readFileSync(process.argv[2], 'utf8');
const M = [
  ['M1 a stage row moves a seat already at its end', 'find(|s| s.pane == pane && !s.state.is_final())', 'find(|s| s.pane == pane)'],
  ['M2 "answering" read as "asked"', 'Some("answering") => SeatState::Answering,', 'Some("answering") => SeatState::Asked,'],
  ['M3 a stage row keeps the click time (no compaction seconds)', '                    s.state = state;\n                    s.since = t;\n', '                    s.state = state;\n'],
  ['M4 a not-warm-and-large outcome counts as failed', '} else if outcome.contains("no longer warm and large") {', '} else if false {'],
  ['M5 dropped seats are left off the run', '                seats.extend(list("dropped")', '                let _ = (list("dropped")'],
  ['M6 an older click is the run (the first, not the newest)', '                run = Some(Progress { click: t, seats, finished: false, interrupted: false });', '                if run.is_none() { run = Some(Progress { click: t, seats, finished: false, interrupted: false }); }'],
  ['M7 the interrupted row does not end the run (said at every launch)', 'Some(end @ ("done" | "panic" | "interrupted"))', 'Some(end @ ("done" | "panic"))'],
  ['M8 to_go counts a finished run', '    if p.finished { 0 } else {', '    if false { 0 } else {'],
  ['M9 (A line a) the running line counts a failed seat as done', 'format!("{} done, {} failed", n(SeatState::Cut), n(SeatState::Failed))', 'format!("{} done, {} failed", n(SeatState::Cut) + n(SeatState::Failed), 0)'],
  ['M9b (A line a) the running line drops the skipped', 'line.push_str(&format!(", {} skipped", n(SeatState::Skipped)));\n        }\n        line.push_str(&format!(", {} to go"', 'let _ = 0;\n        }\n        line.push_str(&format!(", {} to go"'],
  ['M10 the launch line is said for a finished run', '    if p.finished {\n        return None;\n    }\n    let never', '    let never'],
  ['M11 the launch line names every seat, cut ones too', '.filter(|s| !s.state.is_final()).map(|s| format!("{} ({})"', '.map(|s| format!("{} ({})"'],
  ['M12 the X ignores a run with seats to go', '    any_working || compacting != Some(0)', '    any_working'],
  ['M16 (A line b) an unreadable count reads as none to go', '    any_working || compacting != Some(0)', '    any_working || compacting.unwrap_or(0) > 0'],
  ['M17 (A line b) a run in flight the ledger does not show reads as none', '        (_, true) => None,', '        (_, true) => Some(0),'],
  ['M18 (A line b) the ledger count is dropped when a run is in flight', '        (Some(n), _) if n > 0 => Some(n),', '        (Some(n), false) if n > 0 => Some(n),'],
  ['M13 the tokens before are dropped from the cut line', '        (Some((trigger, Some(post))), Some(pre)) if trigger == "manual" => {', '        (Some((trigger, Some(post))), Some(pre)) if false && trigger == "manual" => {'],
  ['M14 the tokens before are read from a compaction before the send', '                .is_some_and(|t| t.timestamp_millis() as u64 >= after_ms)\n        })\n        .last()\n        .and_then(', '                .is_some()\n        })\n        .last()\n        .and_then('],
  ['M15 the done summary omits the failed', 'format!("Done: {} cut, {} failed", n(SeatState::Cut), n(SeatState::Failed))', 'format!("Done: {} cut", n(SeatState::Cut))'],
];
function run() {
  const r = spawnSync('cargo', ['test', '--lib', '--offline', 'close_small::tests'], { cwd: path.join(__dirname, 'mini'), env: { ...process.env, CARGO_TARGET_DIR: 'C:/build/b-mini-target', CARGO_BUILD_JOBS: '4' }, encoding: 'utf8' });
  const out = r.stdout + r.stderr; const m = out.match(/test result: \w+\. (\d+) passed; (\d+) failed/);
  return { pass: m ? +m[1] : -1, fail: m ? +m[2] : -1, out };
}
fs.writeFileSync(SRC, ORIG); const c = run(); console.log('CONTROL (unmutated): ' + c.pass + ' passed, ' + c.fail + ' failed');
let applied = 0, caught = 0, na = 0; const surv = [];
for (const [id, from, to] of M) {
  const n = ORIG.split(from).length - 1;
  if (n !== 1) { na++; console.log('NOT APPLIED (' + n + ' occurrences): ' + id); continue; }
  fs.writeFileSync(SRC, ORIG.replace(from, () => to));
  const r = run();
  if (r.pass === -1) { na++; console.log('BUILD FAILED (not counted): ' + id + '\n' + r.out.slice(-400)); continue; }
  applied++;
  if (r.fail > 0) { caught++; console.log('caught (' + r.fail + ' failed): ' + id); } else { surv.push(id); console.log('NOT CAUGHT: ' + id); }
}
fs.writeFileSync(SRC, ORIG);
console.log('applied ' + applied + ' / caught ' + caught + ' / NOT APPLIED ' + na + (surv.length ? ' / SURVIVORS: ' + surv.join(' | ') : ''));
