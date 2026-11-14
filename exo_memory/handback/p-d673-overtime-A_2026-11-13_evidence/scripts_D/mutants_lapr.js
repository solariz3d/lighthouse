// Lap R (L197) A: hand mutants of the run record's scheme, each applied to the real source, built, and run against the record rows; the file is restored after
// (in a finally, and on SIGINT/SIGTERM/exit). Reported as: applied N / caught N / NOT APPLIED N. Run only with no other job using this worktree's build.
//   node mutants_lapr.js --check        anchors only: each must appear exactly once; nothing is built or written
//   node mutants_lapr.js [id ...]       all, or the named ones
const fs = require('fs');
const cp = require('child_process');
const SP = 'C:/Users/nname/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d673b';
const WT = 'G:/consonance-scratch/a-d673b-dz3';
const WA = WT.replace(/\//g, '\\') + '\\build\\bin\\world_app_tests.exe';
const CT = WT.replace(/\//g, '\\') + '\\build\\bin\\chase_tests.exe';
const BAT = SP.replace(/\//g, '\\') + '\\cbuild_lapr.bat';
const ROWS = [
  [WA, 'an_old_text_with_no_record_format'], [WA, 'a_new_record_text_says_its_format'], [WA, 'a_newer_format_an_unknown'],
  [WA, 'a_run_played_with_another_speed_model'], [WA, 'a_new_run_begins_with_the_shipped'], [WA, 'a_saved_run_and_its_kept_points'],
  [WA, 'a_run_record_reads_back_as_it_was_written_to_the_bit'], [CT, 'what_a_new_run_starts_with'],
];
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);

const M = [
  { id: 'format-written-as-a-comment', file: 'game/world/run_record.cpp', from: 'o << "record_format = " << kRecordFormat <<', to: 'o << "# record_format = " << kRecordFormat <<' },
  { id: 'speed-section-empty', file: 'game/world/run_record.cpp', from: 'DZ_SPEED_FIELDS(DZ_RUN_SPEED)', to: '' },
  { id: 'speed-errors-swallowed', file: 'game/world/run_record.cpp', from: 'chase::set_speed(r.speed, speed_text); !err.empty()) return "[speed]: " + err;', to: 'chase::set_speed(r.speed, speed_text); !err.empty()) (void)err;' },
  { id: 'speed-section-not-read', file: 'game/world/run_record.cpp', from: 'if (std::string err = chase::set_speed(r.speed, speed_text); !err.empty())', to: 'if (std::string err = std::string(); !err.empty())' },
  { id: 'newer-format-accepted', file: 'game/world/run_record.cpp', from: 'if (u > static_cast<uint64_t>(kRecordFormat))', to: 'if (false)' },
  { id: 'format-read-and-dropped', file: 'game/world/run_record.cpp', from: 'r.format = static_cast<int>(u);', to: '' },
  { id: 'format-garbage-accepted', file: 'game/world/run_record.cpp', from: 'if (!to_u64(value, u, 10)) return fail("record_format is not a number");', to: '' },
  { id: 'saved-has-no-name', file: 'game/world/run_record.cpp', from: 'case RunEnd::Saved:  return "saved";', to: '' },
  { id: 'saved-not-read', file: 'game/world/run_record.cpp', from: 'else if (value == "saved") r.end = RunEnd::Saved;', to: '' },
  { id: 'kept-score-not-read', file: 'game/world/run_record.cpp', from: 'else if (name == "kept_score") { if (!to_float(value, r.kept_score)) return fail("not a number"); }', to: '' },
  { id: 'replay-ignores-the-recorded-model', file: 'game/world/run_record.cpp', from: 'app.apply_speed(record.speed);', to: '' },
  { id: 'run-ignores-the-app-model', file: 'game/world/world_app.cpp', from: 'cp.run.speed = speed_;', to: '' },
  { id: 'record-names-the-next-runs-model', file: 'game/world/world_app.cpp', from: 'r.speed = run_speed_;', to: 'r.speed = speed_;' },
  { id: 'run-model-not-snapshotted', file: 'game/world/world_app.cpp', from: 'run_speed_ = speed_;', to: '' },
  { id: 'streamed-harness-drops-the-model', file: 'chase/streamed.cpp', from: 'cp.run.speed = params.speed;', to: '' },
  { id: 'shipped-is-not-the-default', file: 'chase/speed.cpp', from: 'SpeedModel shipped_speed() { return SpeedModel{}; }', to: 'SpeedModel shipped_speed() { SpeedModel m; m.ref_speed += 1.0f; return m; }' },
];

function read(f) { return fs.readFileSync(WT + '/' + f, 'utf8'); }
function build() {
  const r = cp.spawnSync('node', [SP + '/lockrun.js', 'L197 A mutant build', WT, 'cmd', '/c', BAT], { encoding: 'utf8' });
  return /exit 0/.test(r.stdout || '') && !/FAILED/.test(r.stdout || '');
}
let current = null;
function restore() { if (current) { fs.writeFileSync(WT + '/' + current.file, current.orig); current = null; } }
process.on('SIGINT', () => { restore(); process.exit(130); });
process.on('SIGTERM', () => { restore(); process.exit(143); });
process.on('exit', restore);

if (process.argv.includes('--check')) {
  let bad = 0;
  for (const m of M) {
    const n = read(m.file).split(CR + LF).join(LF).split(m.from).length - 1;
    if (n !== 1) { bad++; console.log(`anchor count ${n}: ${m.id}`); }
  }
  console.log(`${M.length} mutants, ${bad} with an anchor that does not appear exactly once`);
  process.exit(bad ? 1 : 0);
}

let applied = 0, caught = 0, notApplied = 0;
const survivors = [];
const only = process.argv.slice(2).filter(a => !a.startsWith('--'));
for (const m of M) {
  if (only.length && !only.includes(m.id)) continue;
  const orig = read(m.file);
  const nl = orig.includes(CR + LF);
  const text = orig.split(CR + LF).join(LF);
  if (text.split(m.from).length !== 2) { notApplied++; console.log(`NOT APPLIED ${m.id} (anchor count ${text.split(m.from).length - 1})`); continue; }
  let mut = text.replace(m.from, () => m.to);
  if (nl) mut = mut.split(LF).join(CR + LF);
  current = { file: m.file, orig };
  fs.writeFileSync(WT + '/' + m.file, mut);
  let result = 'build failed';
  try {
    if (build()) {
      applied++;
      const failed = [];
      for (const [exe, row] of ROWS) {
        const r = cp.spawnSync('node', [SP + '/lockrun.js', 'L197 A mutant row', WT, exe, row], { encoding: 'utf8' });
        if (/FAIL /.test(r.stdout || '') || /CHECK failed/.test(r.stdout || '') || /exit [1-9]/.test(r.stdout || '')) failed.push(row);
      }
      if (failed.length) { caught++; result = 'CAUGHT by ' + failed.join(', '); }
      else { survivors.push(m.id); result = 'SURVIVED'; }
    } else { notApplied++; }
  } finally {
    restore();
  }
  console.log(`${m.id}: ${result}`);
}
build(); // leave the build matching the source
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}; survivors: ${survivors.join(', ') || 'none'}`);
