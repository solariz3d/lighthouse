// cost617.js <t180 tree> <base finalscene copy> <doc>...: per document, the export's own time, then on its welded scene the final-scene check as on d617-a (with
// `through`) and as on 0.4.38 (the base copy), each twice, and passClearance alone, twice; plus each run's process memory (rss, heap used) after. Read-only.
'use strict';
const fs = require('fs'), path = require('path');
const [R, BASE, ...DOCS] = process.argv.slice(2), rq = (p) => require(path.join(R, p));
const D = rq('src/core/document.js'), A = rq('src/core/adapter.js'), FW = rq('src/export/fromwords.js'), AR = rq('src/export/acready.js'), FS = rq('src/export/finalscene.js'), FS0 = require(BASE);
const { passClearance } = rq('src/validate/passclear.js'), { startLayout } = rq('app/core/coreshell.js');
const mb = (x) => (x / 1048576).toFixed(0);
for (const f of DOCS) {
  const doc = D.parse(fs.readFileSync(f, 'utf8')), segs = A.toSegments(doc), lift = (q) => A.offsetPath(doc, segs, q), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, test = !doc.closed;
  let t = Date.now();
  const b = FW.buildFromSegments(segs, { name: doc.name, via: 'cost617', liftPath: lift, start, pitLane: doc.pitLane }, { markers: startLayout(segs, lift, start, test ? { open: true } : undefined), test });
  const tExport = (Date.now() - t) / 1000, scene = AR.weldApronJoints(AR.weldSeams(AR.flattenForAc(b.scene))), opt = { path: b.path, segments: b.segments, lane: b.pitLane, open: !b.path.closed };
  const time = (fn) => { const t0 = process.hrtime.bigint(); const r = fn(); return { s: Number(process.hrtime.bigint() - t0) / 1e9, r }; };
  const now = [time(() => FS.checkFinalScene(scene, opt)), time(() => FS.checkFinalScene(scene, opt))], was = [time(() => FS0.checkFinalScene(scene, opt)), time(() => FS0.checkFinalScene(scene, opt))];
  const pc = [time(() => passClearance(b.path, b.segments, { apronM: 2 })), time(() => passClearance(b.path, b.segments, { apronM: 2 }))];
  const m = process.memoryUsage();
  console.log(`${path.basename(f)}: export ${tExport.toFixed(1)} s (refuse ${b.sceneCheck.refuse.length}, warnings: scene ${b.sceneCheck.warn.length}, through ${b.sceneCheck.warn.filter((w) => w.kind === 'through').length}, clearance ${b.clearance.length}); check now ${now.map((x) => x.s.toFixed(2)).join(' / ')} s, at 0.4.38 ${was.map((x) => x.s.toFixed(2)).join(' / ')} s; passClearance ${pc.map((x) => x.s.toFixed(2)).join(' / ')} s (${pc[0].r.length} stations); rss ${mb(m.rss)} MB, heap used ${mb(m.heapUsed)} MB`);
  for (const w of b.warnings.filter((x) => x.startsWith('clearance: ') || x.includes('pass through'))) console.log('   ', w.slice(0, 260));
}
