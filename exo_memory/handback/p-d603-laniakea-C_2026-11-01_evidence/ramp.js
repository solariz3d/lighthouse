// ramp.js <repo> <phiDeg> [piece index]: F1's bowl lap with one piece's bank easing from phiDeg to 0 along it; gate 1 and 2 as the app lays them, read the
// search's way (surface ends) and the check's way (the dummies, 1.5 m up each end's normal); then the export's own verdict
const os = require('os'), fs = require('fs'), path = require('path'); os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const R = path.resolve(process.argv[2]), PHI = Number(process.argv[3]), K = Number(process.argv[4] || 1);
const D = require(R + '/src/core/document.js'), AD = require(R + '/src/core/adapter.js'), Lay = require(R + '/src/markers/layout.js'), Pl = require(R + '/src/markers/place.js'), FW = require(R + '/src/export/fromwords.js');
const { startLayout } = require(R + '/app/core/coreshell.js');
const F1 = JSON.parse(fs.readFileSync(R + '/test/fixtures/F1-bowl-default-lap-closed.core2.json', 'utf8')), DEG = Math.PI / 180;
const P = F1.pieces[K], n = P.channels.phi.length;
P.channels.phi = P.channels.phi.map((_, i) => (i < 2 ? PHI * DEG : i >= n - 2 ? 0 : PHI * DEG * (1 - (i - 1) / (n - 3))));
// the joint before must meet: the previous piece ends at PHI
const Q = F1.pieces[K - 1]; Q.channels.phi = Q.channels.phi.map((_, i) => (i >= Q.channels.phi.length - 2 ? PHI * DEG : 0));
const doc = D.parse(JSON.stringify(F1)), segs = AD.toSegments(doc), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, lift = (q) => AD.offsetPath(doc, segs, q);
const L = startLayout(segs, lift, start), p = lift(AD.toPath(doc, { step: 2 }).path), starts = Pl.segStarts(p, segs), r = Lay.resolveLayout(L, p, segs);
const tilt = (a, b) => { const v = [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; return Math.asin(Math.abs(v[1]) / Math.hypot(...v)) / DEG; };
for (const i of [1, 2]) { const l = r.markers.find((m) => m.name === `AC_TIME_${i}_L`), rr = r.markers.find((m) => m.name === `AC_TIME_${i}_R`); if (!l) { console.log(i, 'omitted'); continue; } const A = Pl.placeMarker(p, segs, l, starts), B = Pl.placeMarker(p, segs, rr, starts); console.log(`gate ${i} s ${l.s.toFixed(1)} surface ${tilt(A.surface, B.surface).toFixed(3)} dummy ${tilt(A.pos, B.pos).toFixed(3)}`); }
try { FW.buildFromSegments(segs, { name: 'x', liftPath: lift, start }, { markers: L }); console.log('EXPORT OK'); } catch (e) { console.log('EXPORT', e.code, String(e.message).slice(0, 200)); }
if (process.env.SAVE) fs.writeFileSync(process.env.SAVE, JSON.stringify(F1, null, 1));
