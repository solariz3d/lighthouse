// lprobe.js (pane B, D242): explore the LOCAL close before writing its tests.   node lprobe.js <tree> [test1.t180track]
'use strict';
const fs = require('fs'), path = require('path'), T = path.resolve(process.argv[2]) + '/';
const D = require(T + 'src/core/document.js'), { extend } = require(T + 'src/core/extend.js'), C = require(T + 'src/core/close.js');
const R = 180, Q = Math.PI * R / 2;
const lap = (lastLen = 60, family = 'bowl', bankEnd = 0) => {
  let d = extend(D.createDoc('lp'), { length: 300, family });
  for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } });
  return extend(d, { length: lastLen, transition: Math.min(40, lastLen), targets: { kh: 0, ...(bankEnd ? { phi: bankEnd } : {}) } });
};
const same = (a, b) => { for (const ch of Object.keys(a.channels)) { const x = a.channels[ch], y = b.channels[ch]; if (!y || x.length !== y.length) return false; for (let i = 0; i < x.length; i++) if (!Object.is(x[i], y[i])) return false; } return true; };
const tryClose = (name, d, opts) => {
  const t0 = Date.now(); let r, err = null; try { r = C.close(d, opts); } catch (e) { err = `${e.code || e.name}: ${e.message.slice(0, 180)}`; }
  const row = { name, ms: Date.now() - t0 };
  if (err) row.refused = err;
  else { row.converged = r.converged; row.report = r.report.slice(0, 80); row.window = r.window && r.window.text;
    const moved = d.pieces.map((P, i) => (P.type === 'road' && !same(P, r.doc.pieces[i]) ? P.id : null)).filter(Boolean); row.moved = moved;
    row.objectsKept = d.pieces.filter((P, i) => P === r.doc.pieces[i]).length; }
  console.log(JSON.stringify(row));
};
const d1 = lap(60);
console.log(JSON.stringify({ lap: d1.pieces.map((P) => [P.id, Math.round(P.length), P.channels.kh.length]) }));
tryClose('whole (edited [0])', d1, { edited: [0] });
tryClose('local: last piece (60 m)', d1, { window: C.closeWindow(d1, { last: true }) });
tryClose('local: default 20%', d1, { window: C.closeWindow(d1) });
tryClose('local: last two', d1, { window: [d1.pieces.length - 2, d1.pieces.length - 1] });
const d2 = lap(200); tryClose('lap200: local last piece (200 m)', d2, { window: C.closeWindow(d2, { last: true }) });
const d3 = lap(30); tryClose('lap30: local last piece (30 m)', d3, { window: C.closeWindow(d3, { last: true }) });
const d4 = lap(40, 'bowl', 1.5); tryClose('bank 86° at the end, local last 40 m', d4, { window: C.closeWindow(d4, { last: true }) });
tryClose('bank 86° at the end, local 20%', d4, { window: C.closeWindow(d4) });
const d5 = lap(200, 'bowl', 1.5); tryClose('bank 86° at the end, local last 200 m', d5, { window: C.closeWindow(d5, { last: true }) });
if (process.argv[3]) {
  const t1 = D.parse(fs.readFileSync(process.argv[3], 'utf8'));
  console.log(JSON.stringify({ test1: { pieces: t1.pieces.length, closed: t1.closed, lengthM: Math.round(t1.pieces.reduce((a, P) => a + P.length, 0)) } }));
  if (!t1.closed) for (const f of [{ last: true }, { fraction: 0.2 }, { fraction: 0.4 }]) tryClose(`TEST1 ${JSON.stringify(f)}`, t1, { window: C.closeWindow(t1, f) });
}
// the COIL: two full circles on one another (a TEST-1-like stack), then a short straight; closed with the default window
{
  let dc = extend(D.createDoc('coil'), { length: 300, family: 'bowl' });
  for (let i = 0; i < 8; i++) dc = extend(dc, { length: Q, transition: 40, targets: { kh: 1 / R } });
  dc = extend(dc, { length: 60, transition: 40, targets: { kh: 0 } });
  tryClose('COIL (720°) default 20%', dc, { window: C.closeWindow(dc) });
  try {
    const r = C.close(dc, { window: C.closeWindow(dc) });
    const { createCoreShell } = require(T + 'app/core/coreshell.js');
    (async () => { const s = await createCoreShell({ brushFn: null }); s.adopt(dc); const t0 = Date.now(); s.proposeClose(); const st = s.getState(), p = st.closeProposal;
      console.log(JSON.stringify({ coilProposal: p ? { ms: Date.now() - t0, overlaps: p.check.overlaps.length, byReason: p.check.overlaps.reduce((m, x) => { m[x.reason] = (m[x.reason] || 0) + 1; return m; }, {}), others: p.check.others.map((x) => x.reason), movedPieces: p.displacement.filter((x) => x.maxM > 1e-3).map((x) => [x.id, +x.maxM.toFixed(2)]) } : { message: st.message } })); })();
  } catch (e) { console.log(JSON.stringify({ coilClose: `${e.code}: ${e.message.slice(0, 150)}` })); }
}
