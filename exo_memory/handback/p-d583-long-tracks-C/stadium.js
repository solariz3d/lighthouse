// stadium.js <repo> <km> <out.t180track>: a closed stadium lap of about <km> km built the way the app builds one: the core shell's Extend (bowl
// family, as ELYSIUM), two straights of ~1 km pieces and two half circles of R = 1500 m, then Close (the shell's close, on the page thread).
'use strict';
const fs = require('fs'), path = require('path');
const [, , REPO, KM, OUT, PIECE = "1000", RR = "1500"] = process.argv;
const { createCoreShell } = require(path.join(REPO, 'app/core/coreshell.js'));
(async () => {
  const s = await createCoreShell({ brushFn: null, autosaveMs: 0 });
  const R = +RR, half = Math.PI * R, turnPieces = 6, Q = half / turnPieces;
  const straight = (+KM * 1000 - 2 * half) / 2, n = Math.max(1, Math.round(straight / +PIECE)), S = straight / n;
  const must = (what) => { const m = s.getState().message; if (m && s.getState().messageKind !== 'ok') throw new Error(`${what}: ${m}`); };
  s.extend({ length: S, family: 'bowl' }); must('first');
  for (let lap = 0; lap < 2; lap++) {
    for (let i = lap ? 0 : 1; i < n; i++) { s.extend({ length: S, transition: 40, targets: { kh: 0 } }); must('straight'); }
    for (let i = 0; i < turnPieces; i++) { s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); must('turn'); }
  }
  const t0 = Date.now(); s.close(); const st = s.getState();
  console.log(`close: ${st.message} (${Date.now() - t0} ms)`);
  let d = st.history.present;
  if (!d.closed) {
    const C = require(path.join(REPO, 'src/core/close.js')), D = require(path.join(REPO, 'src/core/document.js'));
    let best = d;
    for (let i = 0; i < 6 && !best.closed; i++) {
      let r;
      try { r = C.close(best, { edited: best.pieces.map((_, k) => k) }); } catch (e) { console.log('close threw: ' + e.message); break; }
      console.log('  close again ' + i + ': ' + r.report.slice(0, 160)); best = r.doc;
    }
    if (!best.closed) { console.log('NOT CLOSED'); process.exit(2); }
    d = best;
  }
  fs.writeFileSync(OUT, require(path.join(REPO, 'src/core/document.js')).serialize(d));
  console.log(`pieces ${d.pieces.length}, road ${d.pieces.reduce((a, p) => a + (p.length || 0), 0).toFixed(0)} m; wrote ${OUT} ${fs.statSync(OUT).size} B`);
})().catch((e) => { console.error(e); process.exit(1); });
