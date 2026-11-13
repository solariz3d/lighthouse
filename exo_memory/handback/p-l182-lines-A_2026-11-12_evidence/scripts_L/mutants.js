// L170 A: mutants of the lever code and the scorer, each applied to the real source, built, and run against the feel rows; the file is restored after.
// Reported as: applied N / caught N / NOT APPLIED N. Run only when no sweep is using chase\build\bin (the build replaces dz-chase.exe).
const fs = require('fs');
const cp = require('child_process');
const SP = 'C:/Users/zackn/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/l170';
const WT = 'C:/Users/zackn/Downloads/dreamzone-3-a-l170';
const EXE = WT.replace(/\//g, '\\') + '\\chase\\build\\bin\\chase_tests.exe';
const BAT = SP.replace(/\//g, '\\') + '\\cbuild.bat';
const ROWS = ['the_centred_slip_reads_a_turning', 'the_levers_are_off', 'with_slip_off', 'the_hunter_leads', 'the_slosh_scorer', 'the_centred', 'slip_carries', 'corner_floor'];
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);

const M = [
  { id: 'slip-blend-removed', file: 'chase/chaser.cpp', from: 'carried = c.vel + (carried - c.vel) * k;', to: 'carried = dir * c.speed;' },
  { id: 'slip-never-stored', file: 'chase/chaser.cpp', from: 'if (c.vel_set && length(flat(c.pos - c.vel_at)) < 1e-4f) {', to: 'if (false) {' },
  { id: 'slip-rate-ignored', file: 'chase/chaser.cpp', from: 'const bool         slip = c.body.slip_rate > 0;', to: 'const bool         slip = c.body.slip_rate > 1e9f;' },
  { id: 'slip-rate-x10', file: 'chase/chaser.cpp', from: 'const float k = std::min(1.0f, c.body.slip_rate * kDt);', to: 'const float k = std::min(1.0f, 10.0f * c.body.slip_rate * kDt);' },
  { id: 'floor-corner-removed', file: 'chase/chaser.cpp', from: 'if (c.body.corner_floor_speed > 0) through = std::max(through, c.body.corner_floor_speed * cap);  // L170 P3', to: '' },
  { id: 'floor-uses-min', file: 'chase/chaser.cpp', from: 'through = std::max(through, c.body.corner_floor_speed * cap);', to: 'through = std::min(through, c.body.corner_floor_speed * cap);' },
  { id: 'lead-always-none', file: 'chase/run.cpp', from: 'if (m.lead_range <= 0) return none;', to: 'return none;' },
  { id: 'lead-through-the-runner', file: 'chase/run.cpp', from: 'if (c > 0) {  // running at the hunter: keep the sideways part only', to: 'if (false) {  // running at the hunter: keep the sideways part only' },
  { id: 'lead-distance-uncapped', file: 'chase/run.cpp', from: 'std::min(d, m.lead_range)', to: 'd' },
  { id: 'scorer-outside-sign', file: 'chase/slosh.cpp', from: 'const float off = dot(flat(q - r), c.inside * -1.0f);', to: 'const float off = dot(flat(q - r), c.inside);' },
  { id: 'scorer-slip-forward', file: 'chase/slosh.cpp', from: 'pts[static_cast<size_t>(k - 1)]);', to: 'pts[static_cast<size_t>(k)]);' },
  { id: 'scorer-seen-near', file: 'chase/slosh.cpp', from: 'pr.peak_dist >= kSeenNear &&', to: '' },
];

function read(f) { return fs.readFileSync(WT + '/' + f, 'utf8'); }
function build() {
  const r = cp.spawnSync('node', [SP + '/lockrun.js', 'L170 A mutant build', WT, 'cmd', '/c', BAT], { encoding: 'utf8' });
  return /exit 0/.test(r.stdout || '') && !/FAILED/.test(r.stdout || '');
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
  fs.writeFileSync(WT + '/' + m.file, mut);
  let result = 'build failed';
  try {
    if (build()) {
      applied++;
      let failedRows = [];
      for (const row of ROWS) {
        const r = cp.spawnSync('node', [SP + '/lockrun.js', 'L170 A mutant row', WT, EXE, row], { encoding: 'utf8' });
        if (/FAIL /.test(r.stdout || '') || /CHECK failed/.test(r.stdout || '')) failedRows.push(row);
      }
      if (failedRows.length) { caught++; result = 'CAUGHT by ' + failedRows.join(', '); }
      else { uncaught.push(m.id); result = 'SURVIVED'; }
    } else { notApplied++; }
  } finally {
    fs.writeFileSync(WT + '/' + m.file, orig);
  }
  console.log(`${m.id}: ${result}`);
}
build(); // leave the build matching the source
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}; survivors: ${uncaught.join(', ') || 'none'}`);
