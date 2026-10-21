'use strict';
// D421c part 4 (O): does a Grab (height) or a sideways Grab (lateral) change any SEGMENT? For each step of a drag, the pieces the step changed (by object) and whether
// toSegments (no cache) gives the same text for them as it gave for the base. And which channels differ between base piece and stepped piece.   node liftonly.js <tree>
const TREE = process.argv[2];
const AD = require(`${TREE}/src/core/adapter.js`), D = require(`${TREE}/src/core/document.js`);
const { createCoreShell } = require(`${TREE}/app/core/coreshell.js`);
const { PER_PX } = require(`${TREE}/app/core/panel.js`);
const segsById = (d) => { const m = new Map(); for (const g of AD.toSegments(d)) { if (!m.has(g.id)) m.set(g.id, []); m.get(g.id).push(g); } return m; };
(async () => {
  for (const [tool, channel] of [['grab-up', 'height'], ['grab-side', 'lateral'], ['bend', 'kh'], ['twist', 'phi']]) {
    const s = await createCoreShell({ autosaveMs: 0 });
    s.extend({ length: 200, family: 'bowl' }); for (let i = 1; i < 12; i++) s.extend({ length: 200, transition: 40, targets: { kh: (Math.floor(i / 5) % 2 ? 1 : -1) / 2000 } });
    const base = s.getState().history.present, b = segsById(base);
    s.setSculpt(true); s.beginBrush({ tool, mode: tool === 'bend' ? 'rate' : tool === 'twist' ? 'rate' : 'local', channel, s0: 1100, r: 200 });
    if (!s.getState().brush) { console.log(tool, 'refused', s.getState().message); continue; }
    s.brushTo(30 * (PER_PX[channel] || PER_PX.height));
    const d = s.getState().history.present, a = segsById(d);
    const changed = d.pieces.filter((P, i) => P !== base.pieces[i]);
    const chans = new Set(); changed.forEach((P) => { const B = base.pieces.find((x) => x.id === P.id); for (const k of Object.keys(P.channels)) if (JSON.stringify(P.channels[k]) !== JSON.stringify(B.channels[k])) chans.add(k); for (const k of Object.keys(P)) if (k !== 'channels' && JSON.stringify(P[k]) !== JSON.stringify(B[k])) chans.add('field:' + k); });
    const sameSegs = changed.filter((P) => JSON.stringify(a.get(P.id)) === JSON.stringify(b.get(P.id))).length;
    console.log(JSON.stringify({ tool, channel, pieces_changed: changed.length, what_changed: [...chans], pieces_with_identical_segments: sameSegs }));
  }
})().catch((e) => { console.error(e); process.exit(1); });
