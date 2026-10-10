// D174 mutants: the pit lane and layouts, on copies of app/, src/, test/, tools/, one mutant at a time, --test-concurrency=4.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const DOC = ['test/doc-pitlane.test.js', 'test/doc.test.js'], GEO = ['test/geom-pitlane.test.js'], EXP = ['test/export-layouts.test.js'];
const M = [
  ['D1 the text drops the lane', 'src/doc/pitlane.js', "if (lane === null) return 'null';", "return 'null';", DOC],
  ['D2 migration 2->3 missing', 'src/doc/serial.js', 'return { ...o, schema: 3, pitLane: null };', 'return { ...o, schema: 3 };', DOC],
  ['D3 migration overwrites a carried lane', 'src/doc/serial.js', "if (o.pitLane !== undefined) throw new DocError('UNKNOWN_KEY'", "if (false) throw new DocError('UNKNOWN_KEY'", DOC],
  ['D4 lane not checked in checkDoc', 'src/doc/serial.js', 'const lp = PL.problem(d.pitLane);', 'const lp = null;', DOC],
  ['D5 lane lengths not quantised on load', 'src/doc/serial.js', 'return PL.quantised(l, (v) => fromQ.m(toQ.m(v) || 0), (v) => (Math.round(v * 100) || 0) / 100);', 'return l;', DOC],
  ['D6 bad side accepted', 'src/doc/pitlane.js', "if (lane.side !== 'L' && lane.side !== 'R')", 'if (false)', DOC],
  ['D7 ranges unchecked', 'src/doc/pitlane.js', 'for (const k of LENGTHS) if (!inRange(lane[k], RANGE[k]))', 'for (const k of LENGTHS) if (false)', DOC],
  ['D8 editPitLane ignores the patch', 'src/doc/document.js', 'return setPitLane(doc, { ...doc.pitLane, ...patch });', 'return setPitLane(doc, { ...doc.pitLane });', DOC],
  ['D9 project text not canonical order', 'src/doc/project.js', "Object.keys(l).sort().join() !== 'doc,layout'", 'false', DOC],
  ['D10 duplicate layouts allowed', 'src/doc/project.js', "if (seen.has(l.layout)) throw", 'if (false) throw', DOC],
  ['G1 the lane on the wrong side', 'src/geom/pitlane.js', "const S = mainPath.samples, st = starts(mainPath, segments), sg = lane.side === 'L' ? 1 : -1", "const S = mainPath.samples, st = starts(mainPath, segments), sg = lane.side === 'L' ? -1 : 1", GEO],
  ['G2 linear ease (no zero slope)', 'src/geom/pitlane.js', 's < sa ? lane.offsetM * Prof.smoothstep((s - s0) / lane.divergeM)', 's < sa ? lane.offsetM * ((s - s0) / lane.divergeM)', GEO],
  ['G3 the lane starts offset (a step)', 'src/geom/pitlane.js', 'const gapAt = (s) => (s <= s0 ? 0 :', 'const gapAt = (s) => (s <= s0 ? 0.05 :', GEO],
  ['G4 the lane at the centreline, not the edge', 'src/geom/pitlane.js', 'const [X, Y] = Prof.offsetAt(P, uE), edge', 'const [X, Y] = [0, 0], edge', GEO],
  ['G5 walled joins accepted', 'src/geom/pitlane.js', 'if (Math.abs(x.psiEdge) > JOIN_FLAT) throw', 'if (false) throw', GEO],
  ['G6 lane s is main-road s', 'src/geom/pitlane.js', 'if (j) arc += len(sub(x.centre, pts[j - 1].centre));', 'if (j) arc += x.s - pts[j - 1].s;', GEO],
  ['G7 exemption covers the whole lane', 'src/geom/pitlane.js', 'const z = zone(sLaneMin) || zone(sLaneMax); if (!z) return false;', 'const z = [-1e9, 1e9];', GEO],
  ['G8 no stacked test', 'src/geom/pitlane.js', 'if (t !== null) stacked.push(', 'if (false) stacked.push(', GEO],
  ['G9 lane lifted 3 cm', 'src/geom/pitlane.js', "inner: add(edge, mul(L, sg * g)), centre: add(edge, mul(L, sg * (g + w / 2)))", "inner: add(edge, mul(L, sg * g)), centre: add(add(edge, mul(U, 0.03)), mul(L, sg * (g + w / 2)))", GEO],
  ['E1 export ignores the lane', 'src/export/fromwords.js', '  if (doc.pitLane) {\n    try { pit =', '  if (false) {\n    try { pit =', EXP],
  ['E2 lane not added to the scene', 'src/export/fromwords.js', 'const scene = pit ? PitLane.withLane(scene0, pit.mesh) : scene0;', 'const scene = scene0;', EXP],
  ['E3 pits not moved to the lane', 'src/export/fromwords.js', 'lane: pit ? { path: pit.lane.path, segments: pit.lane.segments } : null });', 'lane: null });', EXP],
  ['E4 lane findings not red', 'src/export/fromwords.js', '    red.push(...pit.red);', '', EXP],
  ['L1 one models.ini for all', 'src/export/layouts.js', '[tf.modelsIniName(L)]: tf.modelsIni([kn5]),', "['models.ini']: tf.modelsIni([kn5]),", EXP],
  ['L2 layout data at the root', 'src/export/layouts.js', '[`${L}/data/surfaces.ini`]: tf.surfacesIni({ softCollision }),', "['data/surfaces.ini']: tf.surfacesIni({ softCollision }),", EXP],
  ['L3 one kn5 shared', 'src/export/layouts.js', 'const kn5 = `${folder}_${L}.kn5`', 'const kn5 = `${folder}.kn5`', EXP],
  ['L4 writes before all layouts built', 'src/export/layouts.js', "try { return { layout: l.layout, b: buildExport(l.doc, opts) }; } catch (e) { if (e instanceof ExportError) e.message = `layout ${l.layout}: ${e.message}`; throw e; }",
    "try { return { layout: l.layout, b: buildExport(l.doc, opts) }; } catch (e) { fs.mkdirSync(path.join(outDir, 'partial'), { recursive: true }); if (e instanceof ExportError) e.message = `layout ${l.layout}: ${e.message}`; throw e; }", EXP],
];
const LIVE = [...new Set(M.map((m) => m[1]))].map((f) => path.join(REPO, f)), before = LIVE.map((f) => fs.readFileSync(f, 'utf8'));
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const only = process.argv[2] ? new RegExp(process.argv[2]) : null;
const t = { listed: 0, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, rel, from, to, tests] of M) {
  if (only && !only.test(name)) continue; t.listed++;
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'd174-'));
  for (const d of ['app', 'src', 'tools', 'test']) copyDir(path.join(REPO, d), path.join(top, d));
  const f = path.join(top, rel); const src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); fs.rmSync(top, { recursive: true, force: true }); continue; }
  fs.writeFileSync(f, src.replace(from, () => to)); t.applied++;
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', '--test-reporter=tap', ...tests], { cwd: top, encoding: 'utf8', timeout: 300000 });
  fs.rmSync(top, { recursive: true, force: true });
  const out = (r.stdout || '') + (r.stderr || ''), fail = /^# fail (\d+)/m.exec(out);
  if (!fail) { t.nr.push(name); console.log('NO RESULT', name, out.slice(-300)); continue; }
  if (r.status !== 0) { t.caught++; console.log('caught  ', name, `(${fail[1]} failing)`); } else { t.survived.push(name); console.log('SURVIVED', name); }
}
console.log(`SUMMARY ${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live files ${LIVE.every((f, i) => fs.readFileSync(f, 'utf8') === before[i]) ? 'unchanged' : 'CHANGED'}`);
