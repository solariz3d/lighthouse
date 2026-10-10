// mutants.js — D074 P-COMPOSER-TRISTATE. Each mutant is applied to a FRESH copy of the pristine
// main.rs inside the scratch crate, and the WHOLE bin suite runs. An anchor must match exactly once
// or the mutant is NOT APPLIED; a mutant that does not compile is INVALID, never caught; the known
// red (ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect) is
// excluded from "caught" because it fails on the pristine text too.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const M = __dirname;
const PRISTINE = path.join(M, 'main.pristine.rs');
const TARGET = path.join(M, 'lh', 'consonance', 'src-tauri', 'src', 'main.rs');
// BASELINE: every test that fails on the PRISTINE text in this copy. On D that is the known red plus
// two that fail only because the copy is not a git checkout (repo_root_tests, managed_cwd_tests).
const BASELINE = new Set([
  'ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect',
  'repo_root_tests::the_checkout_resolves_wherever_this_source_actually_is',
  'managed_cwd_tests::the_map_walk_reaches_the_repo_maps_when_no_data_dir_map_exists',
]);
const only = process.argv.slice(2);

const MUTANTS = [
  ['P0', 'pristine: no change (must report SURVIVED, i.e. nothing beyond the baseline fails)', 'fn composer_state(', 'fn composer_state('],
  ['T1', 'no row reads HAS TEXT (the old collapse)', 'return Composer::Unreadable(Unreadable::NoRow);', 'return Composer::HasText;'],
  ['T2', 'grid mismatch reads NO ROW', '(Some(_), None) => Composer::Unreadable(Unreadable::GridMismatch),', '(Some(_), None) => Composer::Unreadable(Unreadable::NoRow),'],
  ['T3', 'empty and text swapped', '                Composer::Empty\n            } else {\n                Composer::HasText', '                Composer::HasText\n            } else {\n                Composer::Empty'],
  ['T4', 'BEHAVIOUR CHANGE: unreadable counts as empty', 'self == Composer::Empty', '!matches!(self, Composer::HasText)'],
  ['T5', 'a reading reaches only the head', 'for it in q.iter_mut() {', 'for it in q.iter_mut().take(1) {'],
  ['T6', 'the take forgets the readings', 'Some((it.text, it.label, why, it.reads))', 'Some((it.text, it.label, why, Reads::default()))'],
  ['T7', 'an empty tally is not filtered to the old row', 'let reads = reads.filter(|r| r.total() > 0);', 'let reads = reads;'],
  ['T8', 'an all-unreadable hold falls to the mixed wording', '} else if r.unreadable() == n {', '} else if false {'],
  ['T9', '"never read clear" whenever ANY reading saw text', '} else if r.text == n {', '} else if r.text > 0 {'],
  ['T10', 'the reading at the bound misnamed', 'Some(Composer::Unreadable(Unreadable::NoRow)) => "could not be read (no composer row)",', 'Some(Composer::Unreadable(Unreadable::NoRow)) => "text",'],
  ['T11', 'no-row readings counted as grid mismatch', 'Composer::Unreadable(Unreadable::NoRow) => &mut self.no_row,', 'Composer::Unreadable(Unreadable::NoRow) => &mut self.grid_mismatch,'],
  ['T12', 'drain_inboxes records no reading', 'app.state::<Inbox>().note_reading(&pane, composer);', ''],
  ['T13', 'drain_inboxes builds the reading-blind row', 'delivery_note_with(gate, forced, Some(&reads)),', 'delivery_note_with(gate, forced, None),'],
  ['T14', 'BEHAVIOUR CHANGE: no screen counts as an empty composer', 'None => (PaneGate::Unstamped, false, false, Composer::Unreadable(Unreadable::NoScreen)),', 'None => (PaneGate::Unstamped, true, false, Composer::Unreadable(Unreadable::NoScreen)),'],
  ['T15', 'BEHAVIOUR CHANGE: pane_state hands the gate "not empty" always', '                composer.is_empty(),', '                false,'],
  ['T16', 'the other two forced rows lose the composer clause', 'let clause = |r: Option<&Reads>| r.map(|r| format!("; composer: {}", reads_counts(r))).unwrap_or_default();', 'let clause = |_r: Option<&Reads>| String::new();'],
  ['T17', 'empty readings dropped from the counts', 'if r.empty > 0 {', 'if false {'],
  ['T18', 'the last reading is never recorded', 'self.last = Some(c);', ''],
  ['T19', 'the nineteen blanks come back', 'a live turn \\\n             stayed on screen;', 'a live turn                   stayed on screen;'],
  ['X20', 'control: an anchor that is not in the file', 'THIS TEXT IS NOT IN MAIN.RS', 'x'],
];

const pristine = fs.readFileSync(PRISTINE, 'utf8');
const results = [];
for (const [id, desc, anchor, repl] of MUTANTS) {
  if (only.length && !only.includes(id)) continue;
  const n = pristine.split(anchor).length - 1;
  if (n !== 1) { results.push(`NOT APPLIED  ${id.padEnd(4)} ${desc}   (anchor matched ${n}x)`); console.log(results.at(-1)); continue; }
  fs.writeFileSync(TARGET, pristine.replace(anchor, () => repl));
  const t = Date.now();
  const r = spawnSync('C:/Users/nname/.cargo/bin/cargo.exe', ['test', '--bin', 'consonance', '--no-fail-fast'], {
    cwd: path.dirname(path.dirname(TARGET)), env: { ...process.env, CARGO_TARGET_DIR: path.join(M, 'target') },
    encoding: 'utf8', maxBuffer: 256 * 1024 * 1024,
  });
  const out = (r.stdout || '') + (r.stderr || '');
  fs.writeFileSync(path.join(M, `out-${id}.txt`), out);
  const secs = Math.round((Date.now() - t) / 1000);
  if (!/test result:/.test(out)) { results.push(`INVALID      ${id.padEnd(4)} ${desc}   (did not compile, ${secs}s)`); console.log(results.at(-1)); continue; }
  const failed = [...out.matchAll(/^test (\S+) \.\.\. FAILED/gm)].map(m => m[1]).filter(x => !BASELINE.has(x));
  const short = failed.map(f => f.split('::').pop());
  results.push(failed.length
    ? `caught       ${id.padEnd(4)} ${desc}   by ${short.join(' ')}  (${secs}s)`
    : `SURVIVED     ${id.padEnd(4)} ${desc}   (${secs}s)`);
  console.log(results.at(-1));
}
fs.writeFileSync(TARGET, pristine);
const count = k => results.filter(x => x.startsWith(k)).length;
const applied = results.length - count('NOT APPLIED');
console.log(`\n${applied} applied: ${count('caught')} caught · ${count('SURVIVED')} SURVIVED · ${count('NOT APPLIED')} NOT APPLIED · ${count('INVALID')} INVALID`);
fs.writeFileSync(path.join(M, 'mutants-result.txt'), results.join('\n') + '\n');
