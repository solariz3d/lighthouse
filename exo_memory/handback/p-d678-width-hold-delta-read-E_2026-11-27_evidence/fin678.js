// fin678.js (pane E, D678 Track 2, R4): Finish (finish.js finishToStart, what the shell's close job runs) on d678.js's lap, from its six heads, on one tree,
// against (a) the level lap's Finish on the same tree and (b) the same head with its width made level (the last piece's last two w control points set equal):
// every new piece's channels but w and wd every 0.01 m in steps of D.DEC (and phi in degrees), the lengths, and each new piece's end point (the adapter's path at
// step 0.25, the station at that piece's end) against the comparator's. Also closed, plan, window, the first piece's knots, and the placed pieces the same.
// usage: node fin678.js <tree> <out.json>
'use strict';
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const T = path.resolve(process.argv[2]), OUT = process.argv[3];
const D = require(path.join(T, 'src/core/document.js')), TB = require(path.join(T, 'src/core/turnby.js')), F = require(path.join(T, 'src/core/finish.js')), A = require(path.join(T, 'src/core/adapter.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const h = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 12);
const lap = () => { const R = 180, Q = (Math.PI * R) / 2; let d = TB.extendCorner(D.createDoc('lap'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); return TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } }); };
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
async function shell(d, sculpt = false) { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(d); if (sculpt) s.setSculpt(true); return s; }
const brushed = (d, r, delta) => async () => { const s = await shell(lap()); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - d, r }); s.brushTo(delta); s.endBrush(); return doc(s); };
const grabbed = (d, r, dw) => async () => { const s = await shell(lap(), true); s.beginFollow({ s0: total(doc(s)) - d, r }); s.brushTo({ w: dw }); s.endBrush(); s.setSculpt(false); return doc(s); };
const flat = (d) => { const P = d.pieces.at(-1), w = P.channels.w.slice(); w[w.length - 2] = w[w.length - 1]; return D.checkDoc({ ...d, pieces: [...d.pieces.slice(0, -1), { ...P, channels: { ...P.channels, w } }] }); };
const HEADS = [['lap level', async () => lap()], ['lap brush +1.37 end-5 r20', brushed(5, 20, 1.37)], ['lap brush +5 end-30 r40', brushed(30, 40, 5)], ['lap grab +2 end-10 r20', grabbed(10, 20, 2)],
  ['lap grab +2 end-0 r10', grabbed(0, 10, 2)], ['lap grab -2 end-2 r5', grabbed(2, 5, -2)]];
const finish = (d0) => { try { const r = F.finishToStart(d0), n0 = d0.pieces.length, samples = A.toPath(r.doc, { step: 0.25 }).path.samples;
  let s = total(d0); const ends = r.doc.pieces.slice(n0).map((P) => { s += P.length; let best = samples[0]; for (const q of samples) if (Math.abs(q.s - s) < Math.abs(best.s - s)) best = q; return best.pos; });
  return { d0, r, n0, added: r.doc.pieces.slice(n0), ends }; } catch (e) { return { refused: `${e.code || e.name}: ${String(e.message).slice(0, 160)}` }; } };
function apart(a, b) {
  if (a.refused || b.refused) return { refused: [a.refused || null, b.refused || null] };
  const o = { count: [a.added.length, b.added.length], lengths: a.added.map((P, i) => (b.added[i] ? +(P.length - b.added[i].length).toFixed(4) : null)), perPiece: [], endsApartM: [] };
  a.added.forEach((P, i) => { const Q = b.added[i]; if (!Q) return; const L = Math.min(P.length, Q.length), pc = {};
    for (const ch of Object.keys(P.channels)) { if (ch === 'w' || ch === 'wd') continue; const step = 10 ** -D.DEC[ch];
      let m = 0, at = 0; for (let k = 0, n = Math.round(L / 0.01); k <= n; k++) { const x = (k * L) / n, d = Math.abs(D.channelValue(P, ch, x) - D.channelValue(Q, ch, x)); if (d > m) { m = d; at = x; } }
      if (m > 0) pc[ch] = { steps: +(m / step).toFixed(3), at: +at.toFixed(2), ...(ch === 'phi' ? { deg: +((m * 180) / Math.PI).toFixed(4) } : {}) }; }
    o.perPiece.push({ piece: i, knots: [P.knots.length, Q.knots.length], ...pc }); o.endsApartM.push(+Math.hypot(...a.ends[i].map((v, k) => v - b.ends[i][k])).toExponential(3)); });
  return o;
}
(async () => {
  const rows = [], L = finish(lap());
  for (const [name, mk] of HEADS) {
    const d0 = await mk(), slope = D.endState(d0).w.m, R = finish(d0), Fl = slope !== 0 ? finish(flat(d0)) : null;
    const row = { head: name, slope, refused: R.refused || null };
    if (!R.refused) Object.assign(row, { closed: !!R.r.doc.closed, plan: R.r.plan.word, window: R.r.window, placedSame: h(R.r.doc.pieces.slice(0, R.n0)) === h(d0.pieces), lengths: R.added.map((P) => P.length), firstKnots: R.added[0].knots.length, firstEndW: D.pieceEnd(R.added[0]).w, headW: D.endState(d0).w });
    row.vsLevelLap = apart(R, L); row.vsFlatHead = Fl ? apart(R, Fl) : null; rows.push(row);
    console.log(JSON.stringify(row));
  }
  fs.writeFileSync(OUT, JSON.stringify({ tree: T, rows }, null, 1));
})().catch((e) => { console.error('fin678 failed:', e); process.exit(1); });
