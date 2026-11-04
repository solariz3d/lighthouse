// measure.js (C, D467 review): what a closed-lap Bend release does to the start pieces, by tree T (E's 95d23f1 worktree, or the base f965864 extracted).
// Reads only; writes nothing in t180 or his folders. Turn rate = kh in 1/m, shown in °/m. Lateral offset by small-angle integration of Δkh along the piece.
//   node measure.js <tree> lap <s0> <r> <delta>            the sculpt-tools lap (row 21's)
//   node measure.js <tree> file <save> <s0> <r> <delta>    a saved track (a copy)
'use strict';
const fs = require('fs'), path = require('path');
const [T, kind, ...a] = process.argv.slice(2), r = (f) => require(path.join(T, f));
const D = r('src/core/document.js');
const { createCoreShell } = r('app/core/coreshell.js');
const DEG = 180 / Math.PI, STEP = 0.5;
const kAt = (P, s) => D.channelAt(P, 'kh', Math.min(P.length, Math.max(0, s))).v;
/** max |Δkh| over the piece (°/m), where, and the lateral offset the change makes from the piece's start (forward) or end (backward) */
function delta(Pb, Pc, fromEnd) {
  let mx = 0, at = 0, th = 0, y = 0, ymax = 0;
  const n = Math.ceil(Pb.length / STEP);
  for (let k = 0; k <= n; k++) {
    const s = fromEnd ? Pb.length - k * (Pb.length / n) : k * (Pb.length / n), d = kAt(Pc, s) - kAt(Pb, s);
    if (Math.abs(d) > Math.abs(mx)) { mx = d; at = s; }
    th += d * (Pb.length / n); y += Math.sin(th) * (Pb.length / n); if (Math.abs(y) > Math.abs(ymax)) ymax = y;
  }
  return { maxDegPerM: mx * DEG, at, lateralM: ymax, ownDegPerM: Math.max(...Array.from({ length: n + 1 }, (_, k) => Math.abs(kAt(Pb, k * Pb.length / n)))) * DEG };
}
(async () => {
  const s = await createCoreShell({ autosaveMs: 0 });
  let s0, rr, dl;
  if (kind === 'lap') {
    [s0, rr, dl] = a.map(Number);
    const R = 180, Q = (Math.PI * R) / 2;
    s.extend({ length: 300, family: 'bowl' });
    for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } });
    s.extend({ length: 60, transition: 40, targets: { kh: 0 } });
    s.close();
  } else {
    s.adopt(D.parse(fs.readFileSync(a[0], 'utf8'))); [s0, rr, dl] = a.slice(1).map(Number);
  }
  const base = s.getState().history.present;
  if (!base.closed) throw new Error('not a closed lap: ' + s.getState().message);
  s.beginBrush({ tool: 'bend', s0, r: rr }); s.brushTo(dl);
  const openRes = s.getState().resolved, open = s.getState().history.present, win = s.getState().brush.changedPieces; s.endBrush();
  const st = await s.brushRelease(), closed = st.history.present;
  const road = base.pieces.map((P, i) => (P.type === 'road' ? i : -1)).filter((i) => i >= 0), first = road[0], last = road[road.length - 1];
  console.log(`tree ${path.basename(T)} | ${kind} bend s0 ${s0} r ${rr} delta ${dl} (${(dl * DEG).toFixed(4)} °/m) | window ${JSON.stringify(win)} ids ${win.map((i) => base.pieces[i].id)} | first ${first} (${base.pieces[first].id}, ${base.pieces[first].length.toFixed(1)} m) last ${last} (${base.pieces[last].id}, ${base.pieces[last].length.toFixed(1)} m)`);
  console.log('message:', st.message);
  if (!closed.closed || closed === base) { console.log('not re-closed'); return; }
  // the bend's own added rate, on the open lap (what the user dragged), and what is left of it after the close
  for (const i of win) { const o = delta(base.pieces[i], open.pieces[i]), c = delta(base.pieces[i], closed.pieces[i]); console.log(`  window piece ${i} (${base.pieces[i].id}): the drag added max ${o.maxDegPerM.toFixed(5)} °/m at ${o.at.toFixed(1)} m; after the close max ${c.maxDegPerM.toFixed(5)} °/m at ${c.at.toFixed(1)} m; own max rate ${o.ownDegPerM.toFixed(4)} °/m`); }
  const touched = closed.pieces.map((P, i) => (P !== open.pieces[i] ? i : -1)).filter((i) => i >= 0);
  console.log('  pieces the close changed:', JSON.stringify(touched), touched.map((i) => base.pieces[i].id).join(','));
  for (const i of new Set([first, last, ...touched])) {
    if (base.pieces[i].type !== 'road') continue;
    const d = delta(open.pieces[i], closed.pieces[i], i === last);
    console.log(`  close vs drag, piece ${i} (${base.pieces[i].id}): max added ${d.maxDegPerM.toFixed(5)} °/m at ${d.at.toFixed(1)} m; lateral ${d.lateralM.toFixed(3)} m (from its ${i === last ? 'end' : 'start'}); piece's own max ${d.ownDegPerM.toFixed(4)} °/m`);
  }
  // the real centreline (G.buildPath, as centreline.js snapshot): each piece's max distance from where it was before the drag, sample for sample
  const G = r('src/geom/index.js'), pathOf = (res) => G.buildPath(res.segments, { step: 2, closed: !!res.closed, start: res.start });
  const s1 = await createCoreShell({ autosaveMs: 0 }); s1.adopt(base); const pb = pathOf(s1.getState().resolved), pc = pathOf(st.resolved);
  const segIds = (res) => res.segments.map((x) => x.id), ib = segIds(s1.getState().resolved);
  const far = {}; const nb = Math.min(pb.samples.length, pc.samples.length);
  for (let k = 0; k < nb; k++) { const m = pb.samples[k], c = pc.samples[k], id = ib[m.seg]; const d = Math.hypot(...[0, 1, 2].map((j) => m.pos[j] - c.pos[j])); if (!far[id] || d > far[id].d) far[id] = { d, s: m.s }; }
  { const po = pathOf(openRes), fo = {}; for (let k = 0; k < Math.min(pb.samples.length, po.samples.length); k++) { const m = pb.samples[k], id = ib[m.seg], d = Math.hypot(...[0, 1, 2].map((j) => m.pos[j] - po.samples[k].pos[j])); fo[id] = Math.max(fo[id] || 0, d); } console.log('  during the drag (open) moved:', Object.entries(fo).map(([id, v]) => `${id} ${v.toFixed(2)} m`).join(' | ')); }
  console.log(`  centreline moved (samples ${pb.samples.length} → ${pc.samples.length}):`, Object.entries(far).map(([id, v]) => `${id} ${v.d.toFixed(2)} m`).join(' | '));
  if (a.includes('--save')) fs.writeFileSync(path.join(__dirname, `base-${kind}.t180track`), D.serialize(base));
  if (a.includes('--save')) fs.writeFileSync(path.join(__dirname, `bent-${path.basename(T)}.t180track`), D.serialize(closed));
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });
