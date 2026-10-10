// weldgap.js (pane B, D222): does the weld leave a crack? For F1/F2 (closed), take the builder's scene from buildFromSegments, flatten it,
// and for every seam strip: split its rows A/B as weldSeams does, and check whether each B point within SNAP of row A has a coincident
// vertex (same 10 µm key) in some NON-seam mesh — i.e. whether moving the strip's B points also moves the next piece's matching vertex.
// Then, after weldSeams, measure the largest distance from any next-piece first-row vertex (the matched ones) to row A: that is the crack.
'use strict';
const fs = require('fs'), path = require('path');
const T = path.resolve(process.argv[2]) + '/';
const D = require(T + 'src/core/document.js'), AD = require(T + 'src/core/adapter.js'), FW = require(T + 'src/export/fromwords.js');
const { startLayout } = require(T + 'app/core/coreshell.js'), { flattenForAc, weldSeams } = require(T + 'src/export/acready.js');
const key = (x, y, z) => `${Math.round(x * 1e5)},${Math.round(y * 1e5)},${Math.round(z * 1e5)}`;
const segDist = (p, a, b) => { const ab = b.map((v, i) => v - a[i]), ap = p.map((v, i) => v - a[i]); const L = ab.reduce((s, v) => s + v * v, 0); const t = L ? Math.max(0, Math.min(1, ap.reduce((s, v, i) => s + v * ab[i], 0) / L)) : 0; return Math.hypot(...p.map((v, i) => v - (a[i] + t * ab[i]))); };
const res = {};
for (const f of process.argv.slice(3)) {
  const doc = D.parse(fs.readFileSync(f, 'utf8'));
  const segs = AD.toSegments(doc), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, lift = (q) => AD.offsetPath(doc, segs, q);
  const ex = FW.buildFromSegments(segs, { name: 'fixture', via: 'fixture', liftPath: lift, start }, { markers: startLayout(segs, lift, start) });
  const flat = flattenForAc(ex.scene), welded = weldSeams(flat);
  const nonSeamKeys = new Map();
  for (const n of flat.root.children) if (n.type === 'mesh' && !/seam/i.test(n.name)) for (let v = 0; v < n.positions.length; v += 3) { const k = key(n.positions[v], n.positions[v + 1], n.positions[v + 2]); nonSeamKeys.set(k, (nonSeamKeys.get(k) || 0) + 1); }
  let seamsN = 0, bPts = 0, bWithin = 0, bUnmatched = 0, crackMax = 0;
  const weldedByName = new Map(welded.root.children.filter((n) => n.type === 'mesh').map((n) => [n.name, n]));
  for (const n of flat.root.children) {
    if (n.type !== 'mesh' || !/seam/i.test(n.name)) continue; seamsN++;
    const P = n.positions, nv = P.length / 3; let split = -1, big = -1;
    for (let i = 1; i < nv; i++) { const d = Math.hypot(P[3 * i] - P[3 * i - 3], P[3 * i + 1] - P[3 * i - 2], P[3 * i + 2] - P[3 * i - 1]); if (d > big) { big = d; split = i; } }
    if (split < 2 || nv - split < 2) continue;
    const A = [], B = []; for (let i = 0; i < nv; i++) (i < split ? A : B).push([P[3 * i], P[3 * i + 1], P[3 * i + 2]]);
    const dA = (p) => { let m = Infinity; for (let i = 1; i < A.length; i++) m = Math.min(m, segDist(p, A[i - 1], A[i])); return m; };
    for (const p of B) { bPts++; if (dA(p) <= 2e-3) { bWithin++; if (!nonSeamKeys.has(key(...p))) bUnmatched++; } }
  }
  // the crack after the weld: for each non-seam vertex that WAS a B point (key match), its distance to the nearest row A, post-weld
  for (const n of flat.root.children) {
    if (n.type !== 'mesh' || !/seam/i.test(n.name)) continue;
    const P = n.positions, nv = P.length / 3; let split = -1, big = -1;
    for (let i = 1; i < nv; i++) { const d = Math.hypot(P[3 * i] - P[3 * i - 3], P[3 * i + 1] - P[3 * i - 2], P[3 * i + 2] - P[3 * i - 1]); if (d > big) { big = d; split = i; } }
    if (split < 2 || nv - split < 2) continue;
    const A = [], Bk = new Set(); for (let i = 0; i < nv; i++) { const p = [P[3 * i], P[3 * i + 1], P[3 * i + 2]]; if (i < split) A.push(p); else Bk.add(key(...p)); }
    for (const w of welded.root.children) {
      if (w.type !== 'mesh' || /seam/i.test(w.name)) continue;
      const orig = flat.root.children.find((x) => x.name === w.name);
      for (let v = 0; v < w.positions.length; v += 3) {
        if (!Bk.has(key(orig.positions[v], orig.positions[v + 1], orig.positions[v + 2]))) continue;
        const p = [w.positions[v], w.positions[v + 1], w.positions[v + 2]]; let m = Infinity;
        for (let i = 1; i < A.length; i++) m = Math.min(m, segDist(p, A[i - 1], A[i]));
        if (m <= 2e-3 + 1e-9) crackMax = Math.max(crackMax, m);
      }
    }
  }
  res[path.basename(f)] = { seamStrips: seamsN, rowBPoints: bPts, rowBWithin2mm: bWithin, rowBWithin2mmWithNoMatchingNextPieceVertex: bUnmatched, crackAfterWeldMm: +(crackMax * 1000).toFixed(4) };
}
console.log(JSON.stringify(res, null, 1));
