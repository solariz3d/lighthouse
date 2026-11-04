'use strict';
// D165 (pane E): mutation pass over src/export/markers.js and src/export/trackfiles.js. Each mutant replaces ONE exact
// string (it must occur exactly once, else NOT APPLIED), runs the two test files, and restores the original in a
// finally, with a byte check afterwards. Prints applied / caught / NOT APPLIED.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process'), crypto = require('crypto');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const M = [
  // check 1: start line ahead of the grid
  ['markers', 'start-ahead: sign flipped', 'if (!(ahead > 0)) problems.push', 'if (!(ahead < 0)) problems.push'],
  ['markers', 'start-ahead: check removed', 'if (!(ahead > 0)) problems.push', 'if (false) problems.push'],
  ['markers', 'grid-order: check removed', "if (dot(sub(m.grid[i - 1].pos, m.grid[i].pos), g) < -0.01) problems", "if (false) problems"],
  ['markers', 'race direction: pole→back instead of back→pole', 'const g = back === pole ? pole.fwd : sub(pole.pos, back.pos);', 'const g = back === pole ? pole.fwd : sub(back.pos, pole.pos);'],
  // check 2: L/R
  ['markers', 'gate: left axis reversed', 'const left = cross(UP, g), side', 'const left = cross(g, UP), side'],
  ['markers', 'gate: check removed', 'if (!(side > 0)) problems.push', 'if (false) problems.push'],
  // check 3: height and heading
  ['markers', 'height: floor dropped', 'if (s.d < o.minHeight || s.d > o.maxHeight)', 'if (s.d > o.maxHeight)'],
  ['markers', 'height: ceiling dropped', 'if (s.d < o.minHeight || s.d > o.maxHeight)', 'if (s.d < o.minHeight)'],
  ['markers', 'heading: surface tilt check removed', 'if (Math.abs(dot(f, s.n)) > o.surfaceTiltSin) problems.push', 'if (false) problems.push'],
  ['markers', 'heading: race-direction check removed', 'if (racing && g && dot(unit([f[0], 0, f[2]]), g) < o.raceCos)', 'if (false)'],
  ['markers', 'off-road: interior test ignored', "if (!s.interior) { problems.push(`${d.name} is off the road", "if (false) { problems.push(`${d.name} is off the road"],
  ['markers', 'on-road: edge hits not accepted', 'interior: r.interior || lateral < 1e-3 * Math.max(1, d)', 'interior: r.interior'],
  ['markers', 'road: WALL counted as drivable', "return !!m && !/^WALL/i.test(m[1]);", 'return !!m;'],
  // check 4: slots
  ['markers', 'slots: overlap check removed', 'if (inside(a, b) || inside(b, a)) problems.push', 'if (false) problems.push'],
  ['markers', 'slots: off-road check removed', "if (!u || !u.interior) problems.push(`${s.name} is off the road`);", ''],
  // check 5: pit count
  ['markers', 'pits: expected-count check removed', 'if (expected != null && +expected !== m.pits.length) problems.push', 'if (false) problems.push'],
  ['markers', 'pits: numbering check removed', 'idx.forEach((v, k) => { if (v !== k) problems.push', 'idx.forEach((v, k) => { if (false) problems.push'],
  ['markers', 'pits: empty check removed', "if (!m.pits.length) problems.push('no AC_PIT_n markers", "if (false) problems.push('no AC_PIT_n markers"],
  ['markers', 'transform: parent ignored', 'const M = mul(node.matrix, parent);', 'const M = node.matrix;'],
  // trackfiles
  ['trackfiles', 'block: FRICTION 0.05 → 0.5', "'FRICTION=0.05',", "'FRICTION=0.5',"],
  ['trackfiles', 'block: MAX_DEPTH dropped', "'MAX_DEPTH=4',\n", ''],
  ['trackfiles', 'surfaces: hard variant carries the block', "(softCollision ? '\\n' + SOFT_COLLISION_BLOCK : '')", "('\\n' + SOFT_COLLISION_BLOCK)"],
  ['trackfiles', 'surfaces: default is the no-block variant', 'function surfacesIni({ softCollision = true } = {})', 'function surfacesIni({ softCollision = false } = {})'],
  ['trackfiles', 'ui: pitboxes from desc', 'pitboxes: String(pits),', 'pitboxes: String(desc.pitboxes ?? pits),'],
  ['trackfiles', 'map: margin not added to width', 'const width = Math.trunc((maxX - minX) * scale + margin * 2)', 'const width = Math.trunc((maxX - minX) * scale)'],
  ['trackfiles', 'map: X_OFFSET margin term dropped', 'X_OFFSET: -minX + margin / scale', 'X_OFFSET: -minX'],
  ['trackfiles', 'map: walls counted', "const road = walkScene(scene).meshes.filter((m) => isDrivable(m.name));", 'const road = walkScene(scene).meshes;'],
  ['trackfiles', 'png: CRC polynomial wrong', 'c & 1 ? 0xedb88320 ^ (c >>> 1)', 'c & 1 ? 0xedb88321 ^ (c >>> 1)'],
  ['trackfiles', 'png: filter byte 1 instead of 0', 'raw[y * (width * 4 + 1)] = 0;', 'raw[y * (width * 4 + 1)] = 1;'],
  ['trackfiles', 'png: colour type 2 instead of 6', 'ihdr[8] = 8; ihdr[9] = 6;', 'ihdr[8] = 8; ihdr[9] = 2;'],
  ['trackfiles', 'png: preview backdrop not applied', 'if (background) for', 'if (false) for'],
];
const files = { markers: path.join(REPO, 'src/export/markers.js'), trackfiles: path.join(REPO, 'src/export/trackfiles.js') };
const orig = Object.fromEntries(Object.entries(files).map(([k, f]) => [k, fs.readFileSync(f)]));
const origSha = Object.fromEntries(Object.entries(orig).map(([k, b]) => [k, sha(b)]));
let applied = 0, caught = 0, notApplied = 0; const rows = [];
for (const [which, name, from, to] of M) {
  const text = orig[which].toString('utf8');
  const n = text.split(from).length - 1;
  if (n !== 1) { notApplied++; rows.push(`NOT APPLIED (${n} matches)  ${which}: ${name}`); continue; }
  try {
    fs.writeFileSync(files[which], text.replace(from, to));
    const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', 'test/markers.test.js', 'test/trackfiles.test.js'], { cwd: REPO, encoding: 'utf8', timeout: 120000 });
    applied++;
    const failed = r.status !== 0;
    if (failed) caught++;
    const fails = (r.stdout.match(/^ℹ fail (\d+)/m) || [])[1];
    rows.push(`${failed ? 'caught  ' : 'SURVIVED'} (fail ${fails})  ${which}: ${name}`);
  } finally { fs.writeFileSync(files[which], orig[which]); }
}
for (const [k, f] of Object.entries(files)) if (sha(fs.readFileSync(f)) !== origSha[k]) { console.log('RESTORE FAILED for', f); process.exitCode = 2; }
console.log(rows.join('\n'));
console.log(`\napplied ${applied} / caught ${caught} / NOT APPLIED ${notApplied} (of ${M.length}); files restored byte-exact: ${process.exitCode ? 'NO' : 'yes'}`);
