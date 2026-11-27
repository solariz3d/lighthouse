// finflat678.js (pane B, D678 ruling 1, a diagnostic of the one attempt, not a change to it): on E's five brushed lap heads, (1) the head document against the
// level lap, every channel but w and wd, per piece, in steps (does a grab move anything but the width?); (2) Finish from the head against Finish from the SAME head
// with only its width made level (its last piece's last two w control points set to the last one's value: the head's slope 0; row 1's vsFlat), every channel but
// w and wd of the new pieces, in steps, with the knot counts. usage: node finflat678.js <tree>
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), TB = require(path.join(T, 'src/core/turnby.js')), F = require(path.join(T, 'src/core/finish.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const lap = () => { const Rr = 180, Q = (Math.PI * Rr) / 2; let d = TB.extendCorner(D.createDoc('lap'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / Rr } }); return TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } }); };
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const sh = async (sculpt) => { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(lap()); if (sculpt) s.setSculpt(true); return s; };
const brush = (d, r, delta) => async () => { const s = await sh(false); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - d, r }); s.brushTo(delta); s.endBrush(); return s; };
const grab = (d, r, dw) => async () => { const s = await sh(true); s.beginFollow({ s0: total(doc(s)) - d, r }); s.brushTo({ w: dw }); s.endBrush(); s.setSculpt(false); return s; };
const HEADS = { 'brush +1.37 end-5 r20': brush(5, 20, 1.37), 'brush +5 end-30 r40': brush(30, 40, 5), 'grab +2 end-10 r20': grab(10, 20, 2), 'grab +2 end-0 r10': grab(0, 10, 2), 'grab -2 end-2 r5': grab(2, 5, -2) };
function apart(ps, qs) {   // the largest difference of each channel but w and wd, in steps, over two lists of road pieces of equal lengths (sampled every 0.01 m)
  if (ps.length !== qs.length) return `counts ${ps.length}/${qs.length}`;
  const out = [];
  ps.forEach((P, i) => {
    const Q = qs[i]; if (P.length !== Q.length) { out.push(`p${i} lengths ${P.length}/${Q.length}`); return; }
    const w = {}; for (const ch of D.CHANNELS) { if (ch === 'w' || ch === 'wd' || !P.channels[ch] || !Q.channels[ch]) continue; const st = 10 ** -D.DEC[ch]; let m = 0, at = 0;
      const n = Math.ceil(P.length / 0.01); for (let k = 0; k <= n; k++) { const x = Math.min(P.length, k * 0.01), d = Math.abs(D.channelValue(P, ch, x) - D.channelValue(Q, ch, x)) / st; if (d > m) { m = d; at = x; } }
      if (m > 0) w[ch] = `${+m.toFixed(3)} at ${at.toFixed(2)}`; }
    out.push(`p${i} knots ${P.knots.length}/${Q.knots.length}${Object.keys(w).length ? ' ' + Object.entries(w).map(([c, v]) => `${c} ${v}`).join(', ') : ' same'}`);
  });
  return out.join(' | ');
}
(async () => {
  const level = doc(await sh(false)), levelSculpt = doc(await sh(true));
  console.log(`the level lap with sculpt on is the level lap: ${D.serialize(level) === D.serialize(levelSculpt)}`);
  const fl = F.finishToStart(level), n = level.pieces.length;
  for (const [name, mk] of Object.entries(HEADS)) {
    const d0 = doc(await mk());
    const last = d0.pieces[d0.pieces.length - 1], w = last.channels.w.slice(); w[w.length - 2] = w[w.length - 1];
    const flat = D.checkDoc({ ...d0, pieces: [...d0.pieces.slice(0, -1), { ...last, channels: { ...last.channels, w } }] });
    console.log(`\n${name}: head width ${JSON.stringify(D.endState(d0).w)}; flat head ${JSON.stringify(D.endState(flat).w)}`);
    console.log(`  (1) the head document against the level lap, all but w and wd: ${apart(d0.pieces, level.pieces)}`);
    const f0 = F.finishToStart(d0), ff = F.finishToStart(flat);
    console.log(`  (2) Finish from the head against Finish from the same head, width level: ${apart(f0.doc.pieces.slice(n), ff.doc.pieces.slice(n))}`);
    console.log(`  (3) Finish from the head against Finish from the level lap: ${apart(f0.doc.pieces.slice(n), fl.doc.pieces.slice(n))}`);
    console.log(`  (4) Finish from the width-level head against Finish from the level lap: ${apart(ff.doc.pieces.slice(n), fl.doc.pieces.slice(n))}`);
  }
})().catch((e) => { console.error('finflat678 failed:', e); process.exit(1); });
