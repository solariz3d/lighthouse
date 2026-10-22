'use strict';
// D431 (O): core_close_local row 4's lap (lap / nearLap / bankedStart copied verbatim from that test) closed in its last piece on one tree, at several start
// banks: refused (and why) or closed, and the worst roll rate over the window as close.js reads it (validate's rollRates, 20 m chord) against the bar.
//   node row4-roll.js <tree>
const TREE = process.argv[2];
const D = require(`${TREE}/src/core/document.js`), { extend } = require(`${TREE}/src/core/extend.js`), C = require(`${TREE}/src/core/close.js`);
const V = require(`${TREE}/src/validate/index.js`), AD = require(`${TREE}/src/core/adapter.js`);
const R = 180, Q = (Math.PI * R) / 2;
function lap(lastLen = 200) {
  let d = extend(D.createDoc('local'), { length: 300, family: 'bowl' });
  for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } });
  return extend(d, { length: lastLen, transition: Math.min(40, lastLen), targets: { kh: 0 } });
}
const withChannel = (d, i, ch, f) => D.checkDoc({ ...d, pieces: d.pieces.map((P, k) => (k === i ? { ...P, channels: { ...P.channels, [ch]: P.channels[ch].map(f) } } : P)) });
function nearLap(lastLen = 200, eps = 1e-4) {
  const open = D.checkDoc({ ...C.close(lap(lastLen), { edited: [0] }).doc, closed: false });
  return eps ? withChannel(open, 2, 'kh', (v, i, a) => (i >= 3 && i <= a.length - 4 ? v + eps : v)) : open;
}
const bankedStart = (B) => withChannel(nearLap(200, 0), 0, 'phi', (v, i) => (i <= 2 ? B : i >= 8 ? 0 : (B * (8 - i)) / 6));
for (const b of [0.5, 1.0, 1.5, 2.0, 2.5, 3.0]) {
  const d = bankedStart(b), w = C.closeWindow(d, { last: true });
  try {
    const r = C.close(d, { window: w }), { path } = AD.toPath(r.doc);
    let mx = 0; for (const q of V._internal.rollRates(path.samples, () => true, true, path.lengthM)) if (q.s >= r.window.fromS - 1e-9) mx = Math.max(mx, q.rate);
    console.log(JSON.stringify({ bankRad: b, window: r.window.text, closed: r.converged, worstRollDegPerM: +mx.toFixed(3), bar: V.ROLL_RED_DEG_M }));
  } catch (e) { console.log(JSON.stringify({ bankRad: b, refused: `${e.code}: ${String(e.message).slice(-120)}` })); }
}
