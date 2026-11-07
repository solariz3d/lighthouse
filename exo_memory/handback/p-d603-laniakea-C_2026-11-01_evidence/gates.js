// gates.js <repo> <fixtures dir>: D603. Every closed fixture's sector gates as the app lays them (spawnsLayout when the document has spawns, else
// startLayout), one line each: file, gate, anchor, s, and the gate's tilt read the search's way (surface ends) and the check's way (the placed dummies).
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const [R, FX] = process.argv.slice(2).map((p) => path.resolve(p));
const D = require(R + '/src/core/document.js'), AD = require(R + '/src/core/adapter.js'), Lay = require(R + '/src/markers/layout.js'), Pl = require(R + '/src/markers/place.js');
const { startLayout, spawnsLayout } = require(R + '/app/core/coreshell.js');
const DEG = Math.PI / 180, tilt = (a, b) => { const v = [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; return Math.asin(Math.abs(v[1]) / Math.hypot(...v)) / DEG; };
for (const f of fs.readdirSync(FX).filter((x) => /\.(core2\.json|t180track)$/.test(x)).sort()) {
  let doc; try { doc = D.parse(fs.readFileSync(path.join(FX, f), 'utf8')); } catch (e) { console.log(f, 'not a core doc'); continue; }
  if (!doc.closed) { console.log(f, 'open'); continue; }
  const segs = AD.toSegments(doc), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, lift = (q) => AD.offsetPath(doc, segs, q);
  let L, p;
  try { if (doc.spawns) { const r = spawnsLayout(doc, segs, lift, start, {}); L = r.layout; p = r.path; } else { L = startLayout(segs, lift, start); p = lift(AD.toPath(doc, { step: 2 }).path); } } catch (e) { console.log(f, 'layout throws', e.code || e.message); continue; }
  const starts = Pl.segStarts(p, segs), r = Lay.resolveLayout(L, p, segs);
  L.sectors.forEach((a, i) => {
    if (a.omitted) { console.log(f, `AC_TIME_${i + 1}`, 'omitted'); return; }
    const l = r.markers.find((m) => m.name === `AC_TIME_${i + 1}_L`), rr = r.markers.find((m) => m.name === `AC_TIME_${i + 1}_R`);
    const A = Pl.placeMarker(p, segs, l, starts), B = Pl.placeMarker(p, segs, rr, starts);
    console.log(f, `AC_TIME_${i + 1}`, `${a.word}@${a.along.toFixed(2)}`, `s ${l.s.toFixed(2)}`, `surface ${tilt(A.surface, B.surface).toFixed(3)}`, `dummy ${tilt(A.pos, B.pos).toFixed(3)}`);
  });
}
