// cmp614.js <scene tree> <doc> <old check> <new check> [out.json]: builds the doc's welded scene with the scene tree's own modules (its own export check, if it
// has one, stubbed), then runs both check modules on that one scene with detail, and compares everything they return (refuse, warn and the detail: the
// open edges, hairlines, folds, steps, faces across, slivers, rays, depths) as JSON. Prints SAME or DIFFER with the first difference.
'use strict';
require('./winhide.js');
const fs = require('fs'), path = require('path');
const [, , TREE, DOCF, OLD, NEW, OUT] = process.argv;
const rq = (p) => require(path.join(TREE, p));
if (fs.existsSync(path.join(TREE, 'src/export/finalscene.js'))) rq('src/export/finalscene.js').checkFinalScene = () => ({ refuse: [], warn: [] });
const D = rq('src/core/document.js'), A = rq('src/core/adapter.js'), FW = rq('src/export/fromwords.js'), AR = rq('src/export/acready.js');
const { startLayout } = rq('app/core/coreshell.js');
const doc = D.parse(fs.readFileSync(DOCF, 'utf8'));
const segs = A.toSegments(doc), lift = (q) => A.offsetPath(doc, segs, q), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
const textures = rq('app/core/textures.js').createCoreTextures({ segments: () => segs, closed: () => !!doc.closed, kind: 'asphalt', edge: false }).current();
const test = !doc.closed;
const b = FW.buildFromSegments(segs, { name: doc.name, via: 'd614 cmp', liftPath: lift, start, pitLane: doc.pitLane }, { markers: startLayout(segs, lift, start, test ? { open: true } : undefined), textures, test });
const welded = (AR.weldApronJoints || ((x) => x))(AR.weldSeams(AR.flattenForAc(b.scene)));
const run = (file) => { const t0 = Date.now(), r = require(path.resolve(file)).checkFinalScene(welded, { path: b.path, segments: b.segments, lane: b.pitLane, open: test, detail: true }); return { r, ms: Date.now() - t0 }; };
const o = run(OLD), n = run(NEW), jo = JSON.stringify(o.r), jn = JSON.stringify(n.r);
const d = o.r.detail;
console.log(`${path.basename(DOCF)} on ${path.basename(TREE)}: refuse ${o.r.refuse.length} warn ${o.r.warn.length}; detail opens ${d.opens.length} hairline ${d.hairline.length} folds ${d.folds.length} steps ${d.steps.length} across ${d.across.length} thin ${d.thin.length} rays ${d.rays} read ${d.read} compared ${d.compared}; JSON ${jo.length} chars; old ${(o.ms / 1000).toFixed(1)} s, new ${(n.ms / 1000).toFixed(1)} s`);
for (const x of o.r.refuse) console.log('  REFUSE ' + x.message.slice(0, 220));
for (const x of o.r.warn) console.log('  WARN   ' + x.message.slice(0, 220));
if (jo === jn) console.log('SAME');
else { let i = 0; while (jo[i] === jn[i]) i++; console.log(`DIFFER at char ${i}: old …${jo.slice(Math.max(0, i - 120), i + 120)}… new …${jn.slice(Math.max(0, i - 120), i + 120)}…`); }
if (OUT) fs.writeFileSync(OUT, jo);
