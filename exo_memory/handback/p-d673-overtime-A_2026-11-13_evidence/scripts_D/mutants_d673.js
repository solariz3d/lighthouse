// D673 A: hand mutants of the overtime rules, each applied to the real source, built, and run against the overtime rows; the file is restored after
// (in a finally, and again if the process is stopped: SIGINT/SIGTERM restore too). Reported as: applied N / caught N / NOT APPLIED N.
// Run only when no sweep is using the d673 build (the build replaces chase\build\bin).
const fs = require('fs');
const cp = require('child_process');
const SP = 'C:/Users/nname/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d673b';
const WT = 'G:/consonance-scratch/a-d673b-dz3';
const EXE = WT.replace(/\//g, '\\') + '\\build\\bin\\chase_tests.exe';
const BAT = SP.replace(/\//g, '\\') + '\\cbuild_d673.bat';
const ROWS = ['with_the_timer_unreached', 'at_the_timer_the_run_goes', 'in_overtime_the_others_walk_off', 'the_dark_one_comes_from', 'a_catch_before_the_timer', 'in_overtime_every_park_stops', 'a_fall_into_a_void', 'overtime_pays_its_multiple'];
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);

const M = [
  { id: 'park-keeps-protecting-in-overtime', file: 'chase/run.cpp', from: 'if (overtime()) hold_left_ = 0;', to: '' },
  { id: 'catch-ignores-an-open-park', file: 'chase/run.cpp', from: 'if (in_reprieve_ && !open_) continue;', to: 'if (in_reprieve_) continue;' },
  { id: 'dark-stands-at-the-mouth-of-an-open-park', file: 'chase/run.cpp', from: 'const bool    open = open_;  // (D673', to: 'const bool    open = false;  // (D673' },
  { id: 'others-catch-in-overtime', file: 'chase/run.cpp', from: 'if (overtime_begun_ && !dark) continue;', to: '' },
  { id: 'fall-save-removed', file: 'chase/run.cpp', from: 'saved_ = overtime();', to: '' },
  { id: 'dark-catch-not-the-save', file: 'chase/run.cpp', from: 'if (dark) saved_ = true;', to: '' },
  { id: 'overtime-multiple-ignored', file: 'chase/run.cpp', from: 'static_cast<double>(dials_.overtime_score_multiple) * score_rate_at', to: '1.0 * score_rate_at' },
  { id: 'score-ignores-overtime', file: 'chase/run.cpp', from: 'if (!overtime()) return score_at(tick_);', to: 'if (true) return score_at(tick_);' },
  { id: 'leaver-taken-in-view', file: 'chase/run.cpp', from: '&& (d > 45.0f || !see(player_eye(player), a.body.pos + Vec3{0, kChaserChest, 0}));', to: '&& true;' },
  { id: 'dark-site-seen-allowed', file: 'chase/run.cpp', from: 'see(eye, at.pos + Vec3{0, kEye, 0}) || see(eye, at.pos + Vec3{0, 0.8f, 0}) || see(eye, at.pos + Vec3{0, kChaserChest, 0})) continue;', to: 'false) continue;' },
  { id: 'dark-site-too-near', file: 'chase/run.cpp', from: 'if (length(flat(at.pos - player.position)) < 20.0f) continue;', to: '' },
  { id: 'dark-sent-every-sense-tick', file: 'chase/run.cpp', from: 'if (!dark_sent_ && (began || tick_ % kSenseTicks == 0)) dark_sent_ = send_dark(player);', to: 'if (began || tick_ % kSenseTicks == 0) dark_sent_ = send_dark(player);' },
  { id: 'director-keeps-sending', file: 'chase/run.cpp', from: 'if (overtime_begun_) return;  // D673: in overtime nothing is sent and nothing is called off: overtime_step has it', to: '' },
  { id: 'climber-sent-in-overtime', file: 'chase/run.cpp', from: 'if (!params_.director || overtime_begun_ || stall_ticks_ == 0', to: 'if (!params_.director || stall_ticks_ == 0' },
  { id: 'leaver-turns-to-pursue', file: 'chase/run.cpp', from: 'if (a.contact && fresh && !overtime_begun_) a.mode = Mode::Pursue', to: 'if (a.contact && fresh) a.mode = Mode::Pursue' },
  { id: 'dark-told-roughly', file: 'chase/run.cpp', from: 'const float  rad = dark ? 0.0f : std::sqrt(', to: 'const float  rad = std::sqrt(' },
  { id: 'dark-speed-no-rise', file: 'chase/run.cpp', from: 'l.speed = dials_.dark_speed_start + dials_.dark_speed_rise * overtime_seconds();', to: 'l.speed = dials_.dark_speed_start;' },
  { id: 'timer-one-second-early', file: 'chase/run.h', from: 'seconds() >= params_.run_length_s; }', to: 'seconds() >= params_.run_length_s - 1.0f; }' },
  { id: 'waiting-hunter-kept', file: 'chase/run.cpp', from: 'if (a.mode == Mode::Waiting) {  // a hunter not yet released', to: 'if (false) {  // a hunter not yet released' },
];

function read(f) { return fs.readFileSync(WT + '/' + f, 'utf8'); }
function build() {
  const r = cp.spawnSync('node', [SP + '/lockrun.js', 'D673 A mutant build', WT, 'cmd', '/c', BAT], { encoding: 'utf8' });
  return /exit 0/.test(r.stdout || '') && !/FAILED/.test(r.stdout || '');
}
let current = null; // { file, orig } being mutated: restored on any exit
function restore() { if (current) { fs.writeFileSync(WT + '/' + current.file, current.orig); current = null; } }
process.on('SIGINT', () => { restore(); process.exit(130); });
process.on('SIGTERM', () => { restore(); process.exit(143); });
process.on('exit', restore);

if (process.argv.includes('--check')) { // anchors only: no build, no write
  let bad = 0;
  for (const m of M) {
    const n = read(m.file).split(CR + LF).join(LF).split(m.from).length - 1;
    if (n !== 1) { bad++; console.log(`anchor count ${n}: ${m.id}`); }
  }
  console.log(`${M.length} mutants, ${bad} with an anchor that does not appear exactly once`);
  process.exit(bad ? 1 : 0);
}
let applied = 0, caught = 0, notApplied = 0, uncaught = [];
const only = process.argv.slice(2);
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
      const failedRows = [];
      for (const row of ROWS) {
        const r = cp.spawnSync('node', [SP + '/lockrun.js', 'D673 A mutant row', WT, EXE, row], { encoding: 'utf8' });
        if (/FAIL /.test(r.stdout || '') || /CHECK failed/.test(r.stdout || '')) failedRows.push(row);
      }
      if (failedRows.length) { caught++; result = 'CAUGHT by ' + failedRows.join(', '); }
      else { uncaught.push(m.id); result = 'SURVIVED'; }
    } else { notApplied++; }
  } finally {
    restore();
  }
  console.log(`${m.id}: ${result}`);
}
build(); // leave the build matching the source
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}; survivors: ${uncaught.join(', ') || 'none'}`);
