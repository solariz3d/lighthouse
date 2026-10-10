'use strict';
// D171 (pane E): mutation pass over src/markers/*, the export wiring (src/export/fromwords.js), T1's raceAxis
// (src/export/markers.js) and app/markers/panel.js, ON A COPY of the repo. One exact-string replacement per mutant
// (exactly one match, else NOT APPLIED), each copied file restored in a finally. One progress line per mutant.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const LIVE = 'C:/Users/nname/Desktop/t180-track-builder', COPY = path.join(__dirname, 'mcopy');
fs.rmSync(COPY, { recursive: true, force: true });
for (const d of ['src', 'tools', 'app', 'test']) fs.cpSync(path.join(LIVE, d), path.join(COPY, d), { recursive: true });
const F = { place: 'src/markers/place.js', layout: 'src/markers/layout.js', checks: 'src/markers/checks.js', paint: 'src/markers/paint.js', index: 'src/markers/index.js',
  fw: 'src/export/fromwords.js', t1: 'src/export/markers.js', panel: 'app/markers/panel.js' };
const FAST = ['test/markers_track.test.js', 'test/markers.test.js', 'app/test/markers-panel.test.js'];
const SLOW = [...FAST, 'test/markers_export.test.js'];
const M = [
  // place.js
  ['place', FAST, 'blend ignored (the font transition\'s surface)', '  if (!seg.blend) return P;', '  return P;'],
  ['place', FAST, 'normal replaced by the frame\'s up', 'return { pos: add(centre, add(mul(L, X), mul(U, Y))), n: unit(add(mul(L, nl), mul(U, nu))),', 'return { pos: add(centre, add(mul(L, X), mul(U, Y))), n: U,'],
  ['place', FAST, 'height along world up', 'const pos = add(sf.pos, mul(up, h));', 'const pos = add(sf.pos, [0, h, 0]);'],
  ['place', FAST, 'forward not laid in the surface', 'fwd = unit(add(sf.T, mul(up, -dot(sf.T, up))))', 'fwd = sf.T'],
  ['place', FAST, 'snapped to the station before (no interpolation)', 'const i = bracket(S, s), a = S[i], b = S[Math.min(i + 1, S.length - 1)], t = b.s > a.s ?', 'const i = bracket(S, s), a = S[i], b = S[Math.min(i + 1, S.length - 1)], t = false ?'],
  ['place', FAST, 'across offset ignored', 'const [X, Y] = Prof.offsetAt(P, u)', 'const [X, Y] = [u, 0]'],
  ['place', FAST, 'a flight accepted as road', "if (seg.kind === 'gap') throw", 'if (false) throw'],
  // layout.js
  ['layout', FAST, 'no stagger', 'p.stagger && col === 1 ? grid.rowGapM / 2 : 0', '0'],
  ['layout', FAST, 'pole on the right', 'const across = p.cols === 2 ? [grid.colGapM / 2, -grid.colGapM / 2]', 'const across = p.cols === 2 ? [-grid.colGapM / 2, grid.colGapM / 2]'],
  ['layout', FAST, 'slot edit ignored', "const e = (grid.edits && grid.edits[n]) || {};", 'const e = {};'],
  ['layout', FAST, 'run-up integrand v·a, not v/a', 'd += (m / accelAt(car, m)) * h;', 'd += (m * accelAt(car, m) / 400) * h;'],
  ['layout', FAST, 'anchor not clamped to its word', 'Math.min(Math.max(anchor.along, 0), len)', 'anchor.along'],
  ['layout', FAST, 'hotlap run-up ignored (on the line)', 'let sHot = back(sLine, need);', 'let sHot = sLine;'],
  ['layout', FAST, 'short run-up not said', "notes.push({ id: 'hotlap-short', level: 'amber',", "void ({ id: 'hotlap-short', level: 'amber',"],
  ['layout', FAST, 'gates at the edges, no inset', "u: span[1] - layout.gateInsetM, h }, { name: 'AC_TIME_0_R', kind: 'gate', s: sLine, u: span[0] + layout.gateInsetM", "u: span[1], h }, { name: 'AC_TIME_0_R', kind: 'gate', s: sLine, u: span[0]"],
  ['layout', FAST, 'sector sides swapped', "markers.push({ name: `AC_TIME_${i + 1}_L`, kind: 'sector', s, u: sp[1] - layout.gateInsetM, h }, { name: `AC_TIME_${i + 1}_R`, kind: 'sector', s, u: sp[0] + layout.gateInsetM, h });", "markers.push({ name: `AC_TIME_${i + 1}_L`, kind: 'sector', s, u: sp[0] + layout.gateInsetM, h }, { name: `AC_TIME_${i + 1}_R`, kind: 'sector', s, u: sp[1] - layout.gateInsetM, h });"],
  ['layout', SLOW, 'straight length not checked', 'if (best.b - best.a < need) throw err(', 'if (false) throw err('],
  ['layout', FAST, 'missing anchor not reported', "if (sLine == null) { missing.push({ what: 'the start line', word: layout.line.word }); return { markers, notes, missing }; }", 'if (sLine == null) { return { markers, notes, missing }; }'],
  // checks.js
  ['checks', FAST, 'slot past the line accepted', 'if (!(b > 0) || (closed && b >= L / 2)) p.push', 'if (false) p.push'],
  ['checks', FAST, 'numbering from pole not checked', 'if (behind(grid[k]) < behind(grid[k - 1]) - 1e-9) p.push', 'if (false) p.push'],
  ['checks', FAST, 'swapped gates accepted', 'if (!(l.u > r.u)) p.push', 'if (false) p.push'],
  ['checks', FAST, 'height band upper end open', 'if (!(m.h >= 1 && m.h <= 2)) p.push', 'if (!(m.h >= 1)) p.push'],
  ['checks', FAST, 'height band lower end open', 'if (!(m.h >= 1 && m.h <= 2)) p.push', 'if (!(m.h <= 2)) p.push'],
  ['checks', FAST, 'heading along the road not checked', 'if (dot(m.fwd, m.T) < COS15) p.push', 'if (false) p.push'],
  ['checks', FAST, 'off the road not checked', 'if (m.u - half < m.span[0] - 1e-9 || m.u + half > m.span[1] + 1e-9) p.push', 'if (false) p.push'],
  ['checks', FAST, 'overlap not checked', 'if (inside(cars[i], cars[j]) || inside(cars[j], cars[i])) p.push', 'if (false) p.push'],
  ['checks', FAST, 'placement errors not red', 'if (m.error) { p.push(`${m.name} is off the road: ${m.error}`); continue; }', 'if (m.error) { continue; }'],
  ['checks', FAST, 'pit count mismatch accepted', 'if (pits.length !== layout.pits.count) p.push', 'if (false) p.push'],
  ['checks', FAST, 'no pits accepted', "if (!pits.length) p.push('no AC_PIT_n markers: AC needs at least one pit box');", ''],
  ['checks', FAST, 'anchors not reported', "checks.push({ id: 'anchors', problems: missing.map(", "checks.push({ id: 'anchors', problems: [].map("],
  // paint.js
  ['paint', FAST, 'paint on the surface (no lift)', 'const LIFT = 0.02,', 'const LIFT = 0,'],
  ['paint', FAST, 'start line only across the floor', "patch(path, segments, starts, l.s - LINE_W / 2, l.s + LINE_W / 2, sp[0], sp[1])", "patch(path, segments, starts, l.s - LINE_W / 2, l.s + LINE_W / 2, sp[0] / 2, sp[1] / 2)"],
  ['paint', FAST, 'box off its marker', 'return [patch(path, segments, starts, b - e, b, r, l), patch(path, segments, starts, a, a + e, r, l),', 'return [patch(path, segments, starts, b - e + 1, b + 1, r, l), patch(path, segments, starts, a + 1, a + e + 1, r, l),'],
  ['paint', FAST, 'pit boxes not painted', "if (m.error || (m.kind !== 'grid' && m.kind !== 'pit')) continue;", "if (m.error || m.kind !== 'grid') continue;"],
  // fromwords.js
  ['fw', SLOW, 'export ignores a red layout', 'if (!mk.check.ok) throw new ExportError', 'if (false) throw new ExportError'],
  ['fw', SLOW, 'export ignores the given layout', 'layout = o.markers || Markers.defaultLayout', 'layout = Markers.defaultLayout'],
  ['fw', SLOW, 'paint not in the scene', '...mk.nodes, ...mk.paint.meshes]', '...mk.nodes]'],
  // markers.js (T1)
  ['t1', SLOW, 'raceAxis keeps the across part', '  const a = unit(sub(g, scale(left, dot(g, left))));', '  const a = g;'],
  // index.js: the pit lane
  ['index', ['test/markers_lane.test.js'], 'lane boxes placed on the main road', 'const [p, g, st] = m.onLane ? [lane.path, lane.segments, laneStarts] : [path, segments, starts];', 'const [p, g, st] = [path, segments, starts];'],
  ['index', ['test/markers_lane.test.js'], 'lane `along` ignored', 'const at = layout.pits.lane && Number.isFinite(layout.pits.lane.along) ? layout.pits.lane.along : lane.path.lengthM / 2;', 'const at = lane.path.lengthM / 2;'],
  // app/markers/panel.js
  ['panel', FAST, 'an edit is not kept (re-derived)', 'layout = fn(clone(layout)); custom = true; update(true);', 'layout = fn(clone(layout)); update(true);'],
  ['panel', FAST, 'a slot edit replaces the others', 'l.grid.edits = { ...(l.grid.edits || {}), [n]:', 'l.grid.edits = { [n]:'],
  ['panel', FAST, 'reset keeps the custom layout', 'reset() { custom = false; update(true);', 'reset() { update(true);'],
];
const orig = Object.fromEntries(Object.entries(F).map(([k, f]) => [k, fs.readFileSync(path.join(COPY, f), 'utf8')]));
let applied = 0, caught = 0, notApplied = 0; const rows = [];
for (const [which, tests, name, from, to] of M) {
  const text = orig[which], n = text.split(from).length - 1;
  if (process.env.DRY) { if (n !== 1) console.log(`DRY: ${n} matches  ${which}: ${name}`); continue; }
  if (n !== 1) { notApplied++; rows.push(`NOT APPLIED (${n} matches)  ${which}: ${name}`); console.log(`[${applied + notApplied}/${M.length}] ${rows[rows.length - 1]}`); continue; }
  try {
    fs.writeFileSync(path.join(COPY, F[which]), text.replace(from, to));
    const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', ...tests], { cwd: COPY, encoding: 'utf8', timeout: 900000 });
    applied++; const failed = r.status !== 0; if (failed) caught++;
    rows.push(`${failed ? 'caught  ' : 'SURVIVED'}  ${which}: ${name}`); console.log(`[${applied + notApplied}/${M.length}] ${rows[rows.length - 1]}`);
  } finally { fs.writeFileSync(path.join(COPY, F[which]), orig[which]); }
}
if (process.env.DRY) { console.log(`DRY done: ${M.length} mutants checked`); process.exit(0); }
let same = true; for (const f of Object.values(F)) if (fs.readFileSync(path.join(COPY, f), 'utf8') !== fs.readFileSync(path.join(LIVE, f), 'utf8')) same = false;
console.log(`\napplied ${applied} / caught ${caught} / NOT APPLIED ${notApplied} (of ${M.length}); copy restored equal to the live files: ${same ? 'yes' : 'NO'}`);
