// r12.js <tree>: the two-pass track's through-findings in detail: each drawn face's mesh and station, and the drivable face's mesh and station
const path = require('path'), R = process.argv[2], rq = (p) => require(path.join(R, p));
const D = rq('src/core/document.js'), { extend } = rq('src/core/extend.js'), A = rq('src/core/adapter.js'), FW = rq('src/export/fromwords.js'), AR = rq('src/export/acready.js'), FS = rq('src/export/finalscene.js'), { startLayout } = rq('app/core/coreshell.js');
const gap = 3.4, R1 = 120, R2 = R1 - 21, turn = 2 * Math.PI * R1, p = Math.atan(gap / turn);
let d = D.createDoc('two passes'); d = { ...d, start: { ...d.start, pitch: p } };
d = extend(d, { length: 300, family: 'bowl', first: { w: 20, c: 15.5 } });
d = extend(d, { length: 0.75 * turn, transition: 40, targets: { kh: Math.cos(p) / R1 } });
d = extend(d, { length: 0.6 * 2 * Math.PI * R2, transition: 40, targets: { kh: Math.cos(p) / R2 } });
const segs = A.toSegments(d), lift = (q) => A.offsetPath(d, segs, q), start = { pos: d.start.pos.slice(), theta: d.start.heading, p: d.start.pitch };
const b = FW.buildFromSegments(segs, { name: d.name, via: 't', liftPath: lift, start }, { markers: startLayout(segs, lift, start, { open: true }), test: true });
const r = FS.checkFinalScene(AR.weldApronJoints(AR.weldSeams(AR.flattenForAc(b.scene))), { path: b.path, segments: b.segments, open: true, detail: true });
const by = {};
for (const t of r.detail.through) { const k = `${t.at.mesh.replace(/_\d+$/, '')} (s ${t.s.toFixed(0)}) x ${t.at.with.replace(/_\d+$/, '')} (s ${t.at.sWith.toFixed(0)}) out ${t.worst.toFixed(3)}`; by[k] = (by[k] || 0) + 1; }
console.log(JSON.stringify(by, null, 1));
console.log('pieces', [...new Set(b.segments.map((g) => g.id))].join(' '), 'length', b.path.samples[b.path.samples.length - 1].s.toFixed(0));
