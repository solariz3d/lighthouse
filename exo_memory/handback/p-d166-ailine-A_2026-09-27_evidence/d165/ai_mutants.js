// D166 mutants on src/export/ailine.js and scripts/build_platform_test.js, each on a COPY of src/, scripts/, test/ and
// tools/ in a temp dir. Caught = the copied test/ailine.test.js exits non-zero. The live repo is never written.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const LIVE = ['src/export/ailine.js', 'scripts/build_platform_test.js'].map((f) => path.join(REPO, f));
const before = LIVE.map((f) => fs.readFileSync(f, 'utf8'));
const A = 'src/export/ailine.js', B = 'scripts/build_platform_test.js';
const M = [
  ['M1 version 6 in the header', A, 'i32(7); i32(n);', 'i32(6); i32(n);'],
  ['M2 hasGrid 1', A, "  i32(0);   // hasGrid", "  i32(1);   // hasGrid"],
  ['M3 speed in km/h, not m/s', A, 'extra.push({ speed: v,', 'extra.push({ speed: kmh,'],
  ['M4 sides swapped', A, 'sideLeft: p.sideLeft, sideRight: p.sideRight', 'sideLeft: p.sideRight, sideRight: p.sideLeft'],
  ['M5 point length not cumulative (segment only)', A, 'if (k > 0) len += dist(p.pos, pts[k - 1].pos);', 'if (k > 0) len = dist(p.pos, pts[k - 1].pos);'],
  ['M6 the first point repeated at the end (closed by duplication)', A, 'const pts = keep.map((i) => onSection(secs[i], tt[i]));', 'const pts = keep.map((i) => onSection(secs[i], tt[i])); pts.push(pts[0]);'],
  ['M7 the extra count missing', A, '  i32(n);\n  for (const e of E)', '  for (const e of E)'],
  ['M8 no cap on the half-pipe (balance angle unclamped)', A, 'const next = Math.min(cap, Math.atan(', 'const next = Math.min(Math.PI / 2 - 1e-3, Math.atan('],
  ['M9 the wall target on the inside (left) wall', A, '  return -(WF + phi / k);', '  return +(WF + phi / k);'],
  ['M10 grade from the normal, not forward', A, 'tag: 0, grade: fwd[1] });', 'tag: 0, grade: p.nrm[1] });'],
  ['M11 the gap stations not forced in', A, "if (i % every === 0 || st[i].gapNext || (i > 0 && st[i - 1].gapNext)) keep.push(i);", 'if (i % every === 0) keep.push(i);'],
  ['M12 build: the validator\'s absence swallowed again', B, 'function build({ aiMode = \'wall\' } = {}) {\n  const pt = require(\'./platform_test.js\');\n  const { scene, dsn, secs } = pt.buildTrack();\n  loadValidator()(scene);', 'function build({ aiMode = \'wall\' } = {}) {\n  const pt = require(\'./platform_test.js\');\n  const { scene, dsn, secs } = pt.buildTrack();\n  try { require(\'../src/export/scene.js\').validateScene(scene); } catch (e) { if (e.name === \'SceneError\') throw e; if (e.code !== \'MODULE_NOT_FOUND\') throw e; }'],
  ['M13 build: the AI line not written into the variants', B, "    fs.writeFileSync(path.join(dir, 'ai', 'fast_lane.ai'), ai);\n    files.push('ai/fast_lane.ai');\n", ''],
  ['M14 build: the AI line not in the install list', B, "    files.push('ai/fast_lane.ai');\n", ''],
];
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const t = { listed: M.length, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, rel, from, to] of M) {
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'd166m-'));
  for (const d of ['src', 'scripts', 'test', 'tools']) copyDir(path.join(REPO, d), path.join(top, d));
  const f = path.join(top, rel), src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); fs.rmSync(top, { recursive: true, force: true }); continue; }
  fs.writeFileSync(f, src.replace(from, to)); t.applied++;
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'test/ailine.test.js'], { cwd: top, encoding: 'utf8', timeout: 300000 });
  fs.rmSync(top, { recursive: true, force: true });
  const out = (r.stdout || '') + (r.stderr || ''), fail = /^# fail (\d+)/m.exec(out);
  if (!fail) { t.nr.push(name); console.log('NO RESULT', name, out.slice(-300)); continue; }
  if (r.status !== 0) { t.caught++; console.log('caught  ', name, `(${fail[1]} failing)`); } else { t.survived.push(name); console.log('SURVIVED', name); }
}
const same = LIVE.every((f, i) => fs.readFileSync(f, 'utf8') === before[i]);
console.log(`${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live files ${same ? 'unchanged' : 'CHANGED'}`);
