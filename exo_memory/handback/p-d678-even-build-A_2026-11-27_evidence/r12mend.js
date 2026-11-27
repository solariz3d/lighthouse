// r12mend.js (pane A, D678 item 4): a PROTOTYPE of the one mend for R1 and R2 the project already has the means for, measured, not built. Even skips every control
// point whose support reaches past its window (even.js levelTo, evenIn: `off[p] + t[i] < w0 || off[p] + t[i + 4] > w1`), so where a piece's knots are coarse
// near a window end the margin is left to control points Even may not move. The prototype first cuts the knots over the window's two reaches ([w0, lo] and
// [hi, w1]) to spans of at most ramp / 4 (by default; document.js refineKnots: Boehm insertion, the curve unchanged but for the three new control points of each knot,
// quantised to the channel's stored step), then takes the window again and levels as built. Measured against the build on the same starts:
//   R1  flat and B- untouched, Even 200..440 to 16 m, either edge kept: the kept edge over the margins (180..200, 440..460) against the start, and the width there
//       against 16 (both registered at 0.01 m);
//   R2  B- with a grab at 470, at 485, and at 175 and 465, the left edge kept: K3 (even_fixtures centreOff, the centre's in-plane target) over the window;
//   and the price: outside the window's own reach, samples (w, l, h, phi every 1 m) whose bits changed and the largest change; joints that step; reds new.
// Usage: node r12mend.js <builder tree> [divisor: spans of at most ramp / divisor, 4 when not given]
'use strict';
const path = require('path'), Module = require('module'), fs = require('fs');
const T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js')), D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js'));
const { jointSteps } = require(path.join(T, 'src/core/continuity.js'));
const EVF = path.join(T, 'src/core/even.js'), SRC = fs.readFileSync(EVF, 'utf8');
const R = (x) => Math.round(x * 1e4) / 1e4;
function patched(edits) {
  let s = SRC;
  for (const [a, b] of edits) { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`anchor found ${n} times: ${a.slice(0, 80)}`); s = s.replace(a, () => b); }
  const m = new Module(EVF, module); m.filename = EVF; m.paths = Module._nodeModulePaths(path.dirname(EVF)); m._compile(s, EVF); return m.exports;
}
const BUILT = require(EVF); globalThis.__div = Number(process.argv[3] || 4);
const MENDED = patched([[
  '  return evenIn(doc, { off, L, lo, hi, win, w0, w1, value, hold });',
  `  let rd = doc;
  doc.pieces.forEach((P, p) => {
    if (P.type !== 'road') return;
    for (const [a, b] of [[w0, lo], [hi, w1]]) { const x = Math.max(0, a - off[p]), y = Math.min(P.length, b - off[p]); if (y > x + 1e-6) rd = D.refineKnots(rd, P.id, x, y, ramp / globalThis.__div).doc; }
  });
  if (rd === doc) return evenIn(doc, { off, L, lo, hi, win, w0, w1, value, hold });
  const W = evenWindow(rd, { from, to, ramp, margin }); globalThis.__win = W.win;
  return evenIn(rd, { off: W.off, L: W.L, lo: W.lo, hi: W.hi, win: W.win, w0: W.win.w0, w1: W.win.w1, value, hold });`]]);
function outsidePrice(after, before, w0, w1) {
  let n = 0, worst = 0;
  for (const s of F.stations(0, F.endOf(before))) { if (s >= w0 && s <= w1) continue; for (const ch of ['w', 'l', 'h', 'phi']) { const a = F.at(after, ch, s), b = F.at(before, ch, s); if (!Object.is(a, b)) { n++; worst = Math.max(worst, Math.abs(a - b)); } } }
  return { samples: n, worst };
}
const jointsIn = (doc, w0, w1) => jointSteps(doc, { channels: ['w', 'l', 'h'] }).filter((j) => j.s >= w0 - 1e-9 && j.s <= w1 + 1e-9 && (Math.abs(j.dv) > 1e-4 || Math.abs(j.dm) > 1e-3)).length;
const margins = (s) => (s >= 180 && s <= 200) || (s >= 440 && s <= 460);
(async () => {
  for (const fx of ['flat', 'B-']) for (const hold of ['left', 'right']) {
    const base = F.fixture(fx), run = F.runPieces(base), { win } = BUILT.evenWindow(base, run);
    const row = { row: 'R1', fx, hold };
    for (const [k, EV] of [['built', BUILT], ['mended', MENDED]]) {
      const r = EV.even(base, { ...run, value: 16, hold }), a = r.doc; let kept = 0, wid = 0, keptAt = null, widAt = null;
      for (let s = 180; s <= 460; s += 1) { if (!margins(s)) continue; const e = Math.abs(F.rimAcross(a, s, hold) - F.rimAcross(base, s, hold)), w = Math.abs(F.at(a, 'w', s) - 16); if (e > kept) { kept = e; keptAt = s; } if (w > wid) { wid = w; widAt = s; } }
      let runSpread = 0; { const ws = F.stations(200, 440).map((s) => F.at(a, 'w', s)); runSpread = F.spread(ws); }
      row[k] = { win: k === 'mended' ? globalThis.__win : win, keptMargin: R(kept), keptAt, widthMargin: R(wid), widthAt: widAt, runSpread: R(runSpread), knots: a.pieces.reduce((n, P) => n + (P.knots ? P.knots.length : 0), 0) - base.pieces.reduce((n, P) => n + (P.knots ? P.knots.length : 0), 0), outside: outsidePrice(a, base, win.w0, win.w1), joints: jointsIn(a, win.w0, win.w1), redsNew: F.redsLacked(a, base, win.w0, win.w1).length };
    }
    console.log(JSON.stringify(row));
  }
  for (const grabs of [[470], [485], [175, 465]]) {
    const sh = await F.shellOn(F.fixture('B-')); for (const s of grabs) F.grab(sh, s, 16); const st = F.present(sh);
    const run = F.runPieces(st), { win } = BUILT.evenWindow(st, run), row = { row: 'R2', fx: 'B-', grabs };
    for (const [k, EV] of [['built', BUILT], ['mended', MENDED]]) {
      const a = EV.even(st, { ...run, value: 16, hold: 'left' }).doc, c = F.centreOff(a, st);
      row[k] = { k3: R(c.off), at: c.at, outside: outsidePrice(a, st, win.w0, win.w1), joints: jointsIn(a, win.w0, win.w1), redsNew: F.redsLacked(a, st, win.w0, win.w1).length };
    }
    console.log(JSON.stringify(row));
  }
})().catch((e) => { console.error(e && e.stack); process.exitCode = 1; });
