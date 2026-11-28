// lrun.js <tree> <label>: noprev.js's case; the new piece's l (the road's middle, m sideways), h, and w at 0/25/50/75/100 m, and the head's l rate.
'use strict';
const path = require('path'); const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const G = require(path.join(T, 'src/geom/index.js')), ZG = require(path.join(T, 'app/core/zonegrab.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const R = (x) => Math.round(x * 1e4) / 1e4;
const at = (doc, ch, s) => { const off = SC.pieceOffsets(doc); for (let i = 0; i < doc.pieces.length; i++) { const P = doc.pieces[i]; if (P.type === 'road' && s >= off[i] - 1e-9 && s <= off[i] + P.length + 1e-9) return D.channelAt(P, ch, Math.min(P.length, Math.max(0, s - off[i]))).v; } return NaN; };
(async () => {
  const FLAT = [{ length: 200, turn: 0 }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30 })), { length: 150, turn: 0 }];
  let d = D.createDoc('even'); for (const p of FLAT) d = TB.extendCorner(d, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: 0, width: 12, turnAs: 'corner' }));
  const sh = await createCoreShell({}); sh.commitDoc(d); sh.setSculpt(true);
  const pr = sh.getState().history.present, rs = sh.getState().resolved, pathB = G.buildPath(rs.segments, { step: 1, closed: false, ...(rs.start ? { start: rs.start } : {}) });
  const fr = ZG.frameAt(pathB, rs.segments, 575, -1), e = 16 - at(pr, 'w', 575), delta = ZG.follow(fr.R.map((k) => -k * e), fr, {});
  sh.beginFollow({ s0: fr.s, r: 30 }); sh.brushTo(delta); sh.endBrush(); sh.setSculpt(false);
  const doc = sh.getState().history.present, last = doc.pieces[doc.pieces.length - 1], E = D.pieceEnd(last);
  const o = { tree: process.argv[3], headRates: Object.fromEntries(['w', 'l', 'h'].map((c) => [c, E[c] ? { v: R(E[c].v), m: R(E[c].m) } : null])) };
  sh.extend(extendOptions({ length: 100 })); const P = sh.getState().history.present.pieces.at(-1);
  if (sh.getState().history.present.pieces.length === doc.pieces.length) o.extend = 'refused: ' + sh.getState().message;
  else for (const c of ['w', 'l', 'h']) o[c] = [0, 25, 50, 75, 100].map((s) => R(D.channelAt(P, c, s).v));
  console.log(JSON.stringify(o));
})();
