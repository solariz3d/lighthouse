'use strict';
// D170 (pane E): mutation pass over the NEW code (the jump counter, the load graph, the head and landing reds, the lip fix,
// landingRamp) ON A COPY of the repo. One exact-string replacement per mutant (exactly one match, else NOT APPLIED), each
// copied file restored in a finally; the live checkout is only read. One progress line per mutant.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const LIVE = 'C:/Users/nname/Desktop/t180-track-builder', COPY = path.join(__dirname, 'mcopy');
fs.rmSync(COPY, { recursive: true, force: true });
for (const d of ['src', 'tools', 'app', 'test']) fs.cpSync(path.join(LIVE, d), path.join(COPY, d), { recursive: true });
const F = { index: 'src/validate/index.js', jumps: 'src/validate/jumps.js', vpanel: 'app/validate-ui/panel.js', graph: 'app/validate-ui/graph.js' };
const TESTS = ['test/validate_head.test.js', 'test/validate_jumps.test.js', 'test/validate.test.js', 'test/validate_incremental.test.js', 'test/validate_speed.test.js', 'app/test/validate-ui-jumps.test.js', 'app/test/validate-ui.test.js', 'app/test/validate-ui-panel.test.js'];
const M = [
  ['vpanel', 'counter counts drawn arcs (the bug)', 'jumps: r.jumps.length, jumpsPending', 'jumps: state.arcs.length, jumpsPending'],
  ['vpanel', 'pending count always 0', 'jumpsPending: r.jumps.filter((j) => j.pending).length', 'jumpsPending: 0'],
  ['graph', 'graph drawn with no loads', 'if (!r || !r.lines.length) return null;', 'if (!r) return null;'],
  ['graph', 'graph: first line, not the hardest', 'if (l.fN_g > fN[fN.length - 1]) fN[fN.length - 1] = l.fN_g;', ''],
  ['graph', 'graph: 90 g line off the scale', 'Math.max(fN.reduce((m, x) => Math.max(m, x), -Infinity), 1.1 * car.provenG)', 'fN.reduce((m, x) => Math.max(m, x), -Infinity)'],
  ['graph', 'graph: limits not from the car', "lines: [{ g: car.suspensionStopG,", "lines: [{ g: 25,"],
  ['graph', 'graph: amber not shaded', ', ...r.amber.map((x) => ({ s0: x.s0, s1: x.s1, level: LEVEL.AMBER }))', ''],
  ['index', 'head in the air not red', "if (!path.closed && n && segments[lastSeg].kind === 'gap') {", 'if (false) {'],
  ['index', 'head rule on closed paths too', "if (!path.closed && n && segments[lastSeg].kind === 'gap') {", "if (n && segments[lastSeg].kind === 'gap') {"],
  ['index', 'head red from the take-off road', "red.push({ s: S[first].s, s1: S[n - 1].s, u: null, reason: 'head-in-the-air' });", "red.push({ s: S[0].s, s1: S[n - 1].s, u: null, reason: 'head-in-the-air' });"],
  ['index', 'landing check removed', "if (missed.length) red.push({ s: jp.s, s1: jp.s + jp.gap, u: null, reason: 'landing-misses-zone',", "if (false) red.push({ s: jp.s, s1: jp.s + jp.gap, u: null, reason: 'landing-misses-zone',"],
  ['index', 'landing check without a speed', 'if (jp.pending || !Number.isFinite(jp.speed)) continue;', 'if (jp.pending) continue;'],
  ['index', 'landing: lightest miss named', 'worst: Math.max(...missed.map((L) => L.g))', 'worst: Math.min(...missed.map((L) => L.g))'],
  ['index', 'lip back to one station before (the bug)', '!(Math.abs(S[first].s - sGap) < Math.abs(S[first - 1].s - sGap)) ? first - 1 : first', 'first - 1'],
  ['index', 'lip always the flight\'s first station', '!(Math.abs(S[first].s - sGap) < Math.abs(S[first - 1].s - sGap)) ? first - 1 : first', 'first'],
  ['index', 'jump first word not pending', "if (first === 0 || land >= n) {", "if (land >= n) {"],
  ['jumps', 'ramp: smaller root', '(b + Math.sqrt(Math.max(0, disc))) / (2 * k)', '(b - Math.sqrt(Math.max(0, disc))) / (2 * k)'],
  ['jumps', 'ramp: nearest touchdown sets the length', "const far = touchdowns.filter((t) => t.x != null).reduce((m, t) => Math.max(m, t.x), D);", "const far = touchdowns.filter((t) => t.x != null).reduce((m, t) => Math.min(m, t.x), Infinity);"],
  ['jumps', 'ramp: land pitch ignored', 'const c = Math.cos(thetaRad), tl = Math.tan(landRad),', 'const c = Math.cos(thetaRad), tl = 0,'],
  ['jumps', 'ramp: no margin', 'return { length: far - D + marginM, touchdowns, v };', 'return { length: far - D, touchdowns, v };'],
  ['jumps', 'ramp: unclearable landing sized anyway', 'if (!clear) return { g, clear, x: null };', ''],
  ['jumps', 'ramp: no speed accepted', "if (!(v > 0)) throw new Error(`landingRamp: a take-off speed is needed", "if (false) throw new Error(`landingRamp: a take-off speed is needed"],
];
const orig = Object.fromEntries(Object.entries(F).map(([k, f]) => [k, fs.readFileSync(path.join(COPY, f), 'utf8')]));
let applied = 0, caught = 0, notApplied = 0; const rows = [];
for (const [which, name, from, to] of M) {
  const text = orig[which], n = text.split(from).length - 1;
  if (n !== 1) { notApplied++; rows.push(`NOT APPLIED (${n} matches)  ${which}: ${name}`); console.log(`[${applied + notApplied}/${M.length}] ${rows[rows.length - 1]}`); continue; }
  try {
    fs.writeFileSync(path.join(COPY, F[which]), text.replace(from, to));
    const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', ...TESTS], { cwd: COPY, encoding: 'utf8', timeout: 600000 });
    applied++; const failed = r.status !== 0; if (failed) caught++;
    rows.push(`${failed ? 'caught  ' : 'SURVIVED'}  ${which}: ${name}`); console.log(`[${applied + notApplied}/${M.length}] ${rows[rows.length - 1]}`);
  } finally { fs.writeFileSync(path.join(COPY, F[which]), orig[which]); }
}
let same = true; for (const f of Object.values(F)) if (fs.readFileSync(path.join(COPY, f), 'utf8') !== fs.readFileSync(path.join(LIVE, f), 'utf8')) same = false;
console.log(`\napplied ${applied} / caught ${caught} / NOT APPLIED ${notApplied} (of ${M.length}); copy restored equal to the live files: ${same ? 'yes' : 'NO'}`);
