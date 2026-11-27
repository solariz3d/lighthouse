// heads678.js (pane B, D678): each head's end state (every channel's value and slope) against the level head's, on one tree, in steps of DEC
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const DEG = Math.PI / 180;
const plain = () => extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * DEG } });
const lap = () => { const R = 180, Q = (Math.PI * R) / 2; let d = TB.extendCorner(D.createDoc('lap'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); return TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } }); };
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const sh = async (road, sculpt) => { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(road()); if (sculpt) s.setSculpt(true); return s; };
const brush = (road, d, r, delta) => async () => { const s = await sh(road); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - d, r }); s.brushTo(delta); s.endBrush(); return s; };
const grab = (road, d, r, dw) => async () => { const s = await sh(road, true); s.beginFollow({ s0: total(doc(s)) - d, r }); s.brushTo({ w: dw }); s.endBrush(); s.setSculpt(false); return s; };
const sets = [[plain, { E1: brush(plain, 5, 20, 1.37), E4: brush(plain, 30, 40, 5), E6: grab(plain, 10, 20, 2), 'grab +4 end-3 r5': grab(plain, 3, 5, 4) }],
  [lap, { 'lap brush +1.37 end-5 r20': brush(lap, 5, 20, 1.37), 'lap brush +5 end-30 r40': brush(lap, 30, 40, 5), 'lap grab +2 end-10 r20': grab(lap, 10, 20, 2), 'lap grab +2 end-0 r10': grab(lap, 0, 10, 2), 'lap grab -2 end-2 r5': grab(lap, 2, 5, -2) }]];
(async () => {
  for (const [road, heads] of sets) {
    const L = D.endState(doc(await sh(road)));
    for (const [n, mk] of Object.entries(heads)) {
      const s = await mk(), d = doc(s), E = D.endState(d), out = {};
      for (const ch of D.CHANNELS) { if (!E[ch] || !L[ch]) continue; const st = 10 ** -D.DEC[ch], dv = Math.abs(E[ch].v - L[ch].v) / st, dm = Math.abs(E[ch].m - L[ch].m) / st; if (dv || dm) out[ch] = { v: +dv.toFixed(3), m: +dm.toFixed(3) }; }
      const base = doc(await sh(road)); let firstMoved = null; for (let i = 0; i < d.pieces.length; i++) if (JSON.stringify(d.pieces[i]) !== JSON.stringify(base.pieces[i])) { firstMoved = i; break; }
      console.log(n, '| pieces', d.pieces.length, '(level', base.pieces.length + ')', '| first piece changed', firstMoved, '| end state off the level head, in steps:', JSON.stringify(out));
    }
  }
})().catch((e) => { console.error(e); process.exit(1); });
