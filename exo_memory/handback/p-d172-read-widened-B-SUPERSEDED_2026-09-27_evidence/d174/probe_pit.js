// B's independent probe of D174 (pit lane, layouts) on a loop of B's own, against the D171-D174 landing worktree.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const WT = 'C:/Users/nname/AppData/Local/Temp/b-d174land-wt/';
const D = require(WT + 'src/doc/index.js');
const Doc = require(WT + 'src/doc/document.js');
const { closeLoop } = require(WT + 'src/doc/connector.js');
const { buildPath } = require(WT + 'src/geom/index.js');
const { buildPitLane } = require(WT + 'src/geom/pitlane.js');
const { exportTrack, buildExport } = require(WT + 'src/export/fromwords.js');
const { exportProject } = require(WT + 'src/export/layouts.js');
const Pr = require(WT + 'src/doc/project.js');
const { readKn5 } = require(WT + 'tools/kn5.cjs');
const out = []; const ok = (n, c, x = '') => out.push(`${c ? 'PASS' : 'FAIL'} ${n}${x !== '' ? ' — ' + x : ''}`);
const v = 200 / 3.6, sub = (a, b) => a.map((x, i) => x - b[i]), len = (a) => Math.hypot(...a), dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const tmps = []; const tmp = () => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'b-d174-')); tmps.push(d); return d; };

function loop(name, straightM) {
  let d = D.createDoc(name);
  for (const w of ['straight', 'tight', 'straight', 'straight', 'tight']) d = D.appendWord(d, w, { speed: v });
  d = D.editWord(d, 'w3', { handles: { length: straightM } });
  const c = closeLoop(d); if (!c.candidates.length) throw new Error(c.reason);
  let doc = c.candidates.slice().sort((a, b) => a.lengthM - b.lengthM)[0].doc;
  for (const e of doc.words) if (e.phrase === undefined && e.speed === null && e.word !== 'jump') doc = D.editWord(doc, e.id, { speed: v });
  return doc;
}
const base = loop('b pit probe', 260);
const lane = { side: 'R', leave: { word: 'w3', along: 20 }, rejoin: { word: 'w3', along: 240 }, offsetM: 10, width: 6, divergeM: 60, mergeM: 60 };
const d = Doc.setPitLane(base, lane);
ok('schema 3 and the lane in the text', /"schema": 3,/.test(D.serialize(d)) && /"pitLane": \{/.test(D.serialize(d)));
ok('lane text round-trips byte-exact', D.serialize(D.parse(D.serialize(d))) === D.serialize(d));
ok('removing the lane gives the base document back byte-exact', D.serialize(Doc.setPitLane(d, null)) === D.serialize(base));
const o2 = JSON.parse(D.serialize(base)); o2.schema = 2; delete o2.pitLane;
let m2 = null; try { m2 = D.parse(JSON.stringify(o2)); } catch (e) { m2 = e; }
ok('schema 2 (no pitLane key) migrates to 3 with pitLane null', m2 && m2.schema === 3 && m2.pitLane === null, m2 && m2.message);
let c2 = null; try { D.parse(JSON.stringify({ ...o2, pitLane: JSON.parse(D.serialize(d)).pitLane })); } catch (e) { c2 = e.code; }
ok('a schema-2 file already carrying pitLane is refused', c2 !== null, String(c2));

// geometry: joins, by B's own finite differences on at(s)
const bx = buildExport(d, {}), segs = bx.segments, p = bx.path, L = buildPitLane(p, segs, d.pitLane);
const { leave, rejoin } = L.joins;
for (const [nm, s, dir] of [['leave', leave.s, 1], ['rejoin', rejoin.s, -1]]) {
  const a = L.at(s), gap = len(sub(a.inner, a.edge));
  const h = 0.05, b = L.at(s + dir * h), eB = sub(b.edge, a.edge), iB = sub(b.inner, a.inner);
  const ang = Math.acos(Math.min(1, dot(eB, iB) / (len(eB) * len(iB))));
  ok(`${nm}: inner edge on the road edge, tangent continuous`, gap < 1e-9 && ang < 1e-3, `gap ${gap.toExponential(1)} m, angle over ${h} m ${ang.toExponential(2)} rad`);
}
let minGap = Infinity, maxGap = 0;
for (let s = leave.s; s <= rejoin.s; s += 0.5) { const a = L.at(s); minGap = Math.min(minGap, a.g); maxGap = Math.max(maxGap, a.g); }
ok('the gap never goes negative and reaches the offset', minGap >= -1e-12 && Math.abs(maxGap - 10) < 1e-9, `g in [${minGap.toExponential(1)}, ${maxGap}]`);

// export: lane cells, boxes on the lane, lane only with a lane
const e1 = tmp(), r = exportTrack(d, { outDir: e1 });
const walk = (dd) => fs.readdirSync(dd, { withFileTypes: true }).flatMap((x) => (x.isDirectory() ? walk(path.join(dd, x.name)) : [path.join(dd, x.name)]));
const k = readKn5(walk(e1).find((f) => f.endsWith('.kn5')));
const pit = k.meshes.filter((m) => /^1ROAD_PIT_/.test(m.name));
ok('the kn5 carries drivable 1ROAD_PIT_* cells', pit.length > 0, `${pit.length} cells`);
const boxes = r.markers.filter((m) => /^AC_PIT_/.test(m.name));
ok('the export places the pit boxes', boxes.length === 2, JSON.stringify(boxes.map((b) => b.name)));
const pitNodes = k.dummies.filter((x) => /^AC_PIT_/.test(x.name));
const mainPos = (s) => { let best = p.samples[0]; for (const q of p.samples) if (Math.abs(q.s - s) < Math.abs(best.s - s)) best = q; return best; };
const dist = pitNodes.map((n) => { const pos = n.pos; let m = Infinity; for (const q of p.samples) m = Math.min(m, len(sub(pos, q.pos))); return m; });
ok('each pit box stands off the main road, beyond its edge (> half width + offset/2)', dist.every((x) => x > 10 + 5), dist.map((x) => x.toFixed(1)).join(', ') + ' m from the main centreline');
const e0 = tmp(), r0 = exportTrack(base, { outDir: e0 });
const k0 = readKn5(walk(e0).find((f) => f.endsWith('.kn5')));
ok('no lane, no 1ROAD_PIT cells', k0.meshes.every((m) => !/^1ROAD_PIT_/.test(m.name)));

// layouts: two layouts, one folder
const proj = Pr.addLayout(Pr.addLayout(Pr.createProject('B Two'), 'withpit', d), 'plain', loop('b plain', 200));
const e2 = tmp(), rp = exportProject(proj, { outDir: e2 });
const rel = walk(rp.dir).map((f) => path.relative(rp.dir, f).replace(/\\/g, '/')).sort();
const need = ['models_withpit.ini', 'models_plain.ini', 'withpit/data/surfaces.ini', 'plain/data/surfaces.ini', 'withpit/ai/fast_lane.ai', 'ui/withpit/ui_track.json', 'ui/plain/ui_track.json'];
ok('per-layout files present', need.every((n) => rel.includes(n)), need.filter((n) => !rel.includes(n)).join(', ') || `${rel.length} files`);
ok('no root models.ini or root ui_track.json', !rel.includes('models.ini') && !rel.includes('ui/ui_track.json'));
const kp = (n) => readKn5(path.join(rp.dir, rel.find((f) => f.endsWith(`_${n}.kn5`))));
ok('the lane is only in its own layout', kp('withpit').meshes.some((m) => /^1ROAD_PIT_/.test(m.name)) && kp('plain').meshes.every((m) => !/^1ROAD_PIT_/.test(m.name)));
const ui = (n) => JSON.parse(fs.readFileSync(path.join(rp.dir, 'ui', n, 'ui_track.json'), 'utf8'));
ok('each ui_track.json pitboxes = its own kn5 AC_PIT count', ['withpit', 'plain'].every((n) => +ui(n).pitboxes === kp(n).dummies.filter((x) => /^AC_PIT_\d+$/.test(x.name)).length), ['withpit', 'plain'].map((n) => `${n} ${ui(n).pitboxes}`).join(', '));
for (const t of tmps) fs.rmSync(t, { recursive: true, force: true });
console.log(out.join('\n')); console.log(`${out.filter((l) => l.startsWith('PASS')).length}/${out.length} PASS`);
