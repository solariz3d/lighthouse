// noprev.js <tree> [label]: pane C, L270 role 2, REWRITTEN on L (P's own noprev.js is on D only). The case of handback/p-d678-ghost-offset-P_2026-11-27.md
// section 9 and 13.2: A's flat turn (200 m, four 60 m x 30 deg corners, 150 m; 12 m wide, flat; head at 590), one Sculpt width grab with one rim held
// (the zone grab's follow on the outer rim, B's even_fixtures.js grab at 6aaec86, copied here) at s 575 over r 30 to 16 m; Sculpt then off, as the page opens;
// then the next 100 m piece with every field left as shown: extendOptions({ length: 100 }). Reads: the head's width and its rate; the ghost (built or refused);
// Extend (placed or refused); the new piece's width at 0, 50, 100 m; and the ghost against the road placing builds (the most over the new piece, and at the head).
'use strict';
const path = require('path');
const T = path.resolve(process.argv[2]), LABEL = process.argv[3] || T;
const D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const G = require(path.join(T, 'src/geom/index.js')), ZG = require(path.join(T, 'app/core/zonegrab.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const { createTrackModel } = require(path.join(T, 'app/preview/trackmodel.js'));
const R = (x) => (Number.isFinite(x) ? Math.round(x * 1e4) / 1e4 : x);
const FLAT = [{ length: 200, turn: 0, bank: 0 }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30, bank: 0 })), { length: 150, turn: 0, bank: 0 }];
const at = (doc, ch, s) => { const off = SC.pieceOffsets(doc); for (let i = 0; i < doc.pieces.length; i++) { const P = doc.pieces[i]; if (P.type === 'road' && s >= off[i] - 1e-9 && s <= off[i] + P.length + 1e-9) return D.channelAt(P, ch, Math.min(P.length, Math.max(0, s - off[i]))).v; } return NaN; };
const present = (sh) => sh.getState().history.present;
function grab(sh, s, want, r = 30) {   // B's even_fixtures.js grab (6aaec86:test/even_fixtures.js:130), unchanged but for the requires
  const d = present(sh), rs = sh.getState().resolved, pathB = G.buildPath(rs.segments, { step: 1, closed: false, ...(rs.start ? { start: rs.start } : {}) });
  const fr = ZG.frameAt(pathB, rs.segments, s, -1); if (!fr) throw new Error(`no frame at ${s}`);
  const e = want - at(d, 'w', s), delta = ZG.follow(fr.R.map((k) => -k * e), fr, {}); if (!delta) throw new Error(`no follow at ${s}`);
  sh.beginFollow({ s0: fr.s, r }); if (!sh.getState().brush) throw new Error(`beginFollow at ${s}: ${sh.getState().message}`);
  sh.brushTo(delta); sh.endBrush();
}
(async () => {
  let d = D.createDoc('even');
  for (const p of FLAT) d = TB.extendCorner(d, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: p.bank, width: 12, turnAs: 'corner' }));
  const sh = await createCoreShell({}); sh.commitDoc(d); sh.setSculpt(true);
  grab(sh, 575, 16, 30);
  const gm = sh.getState().message; sh.setSculpt(false);
  const doc = present(sh), last = doc.pieces[doc.pieces.length - 1], end = D.pieceEnd ? D.pieceEnd(last) : null;
  const headS = SC.pieceOffsets(doc)[doc.pieces.length - 1] + last.length;
  const out = { tree: LABEL, grabMessage: gm || null, headS: R(headS), width575: R(at(doc, 'w', 575)), head: end ? { w: R(end.w.v), wRate: R(end.w.m), l: R(end.l && end.l.v) } : null };
  const opts = extendOptions({ length: 100 }); out.opts = opts;
  const st = sh.getState(), tm = createTrackModel(); tm.update(st.resolved);
  let ghost = null;
  try { const c = sh.candidate(opts); if (!c) throw new Error(`no candidate: ${sh.getState().message}`); ghost = tm.ghostFor(c); out.ghost = ghost ? 'built' : 'none'; }
  catch (e) { out.ghost = `refused: ${e.code || ''} ${String(e.message).slice(0, 120)}`; }
  if (ghost) {   // the page's measure (washpage678.js READ): the ghost's stations against the placed track at the same s, before Extend; 'atHead' is the shared station with the largest s
    const P0 = tm.path.samples, byS0 = new Map(P0.map((x) => [Math.round(x.s * 1000), x])); let n = 0, h = 0, hAt = null, v = 0, head = null;
    for (const x of ghost.path.samples) { const y = byS0.get(Math.round(x.s * 1000)); if (!y) continue; n++; const dh = Math.hypot(x.pos[0] - y.pos[0], x.pos[2] - y.pos[2]), dv = Math.abs(x.pos[1] - y.pos[1]);
      if (dh > h) { h = dh; hAt = x.s; } if (dv > v) v = dv; if (!head || x.s > head.s) head = { s: x.s, horizM: dh, vertM: dv }; }
    out.pageMeasure = { shared: n, s0: R(ghost.path.samples[0].s), offPlacedHorizM: R(h), at: R(hAt), offPlacedVertM: R(v), atHead: head && { s: R(head.s), horizM: R(head.horizM), vertM: R(head.vertM) } };
  }
  const n0 = doc.pieces.length; sh.extend(opts);
  const after = present(sh);
  if (after.pieces.length === n0) out.extend = `refused: ${sh.getState().message}`;
  else {
    out.extend = 'placed'; const P = after.pieces[after.pieces.length - 1];
    out.newWidth = [0, 50, 100].map((s) => R(D.channelAt(P, 'w', Math.min(P.length, s)).v));
    if (ghost) {
      const tm2 = createTrackModel(); tm2.update(sh.getState().resolved); const pp = tm2.path, g = ghost.path, k0 = pp.segFirst[n0];
      let worst = 0, wAt = null, n = 0; const byS = new Map(g.samples.map((x) => [Math.round(x.s * 1000), x]));
      let headOff = null;
      for (let k = k0; k < pp.samples.length; k++) { const y = pp.samples[k], x = byS.get(Math.round(y.s * 1000)); if (!x) continue; n++;
        const dd = Math.hypot(x.pos[0] - y.pos[0], x.pos[1] - y.pos[1], x.pos[2] - y.pos[2]); if (headOff === null) headOff = dd; if (dd > worst) { worst = dd; wAt = y.s; } }
      out.ghostVsPlaced = { shared: n, atHeadM: R(headOff), mostM: R(worst), at: R(wAt), ghostStations: g.samples.length, placedStations: pp.samples.length };
    }
  }
  console.log(JSON.stringify(out));
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
