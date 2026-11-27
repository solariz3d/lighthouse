// v3probe678.js (pane B, D678 Track 2, the Even read): follow-ups to V3 (v3rest678.js), run after it, so NOT pre-registered.
//   node v3probe678.js <builder tree, 437590e>
// (a) the run from the track's start: where the held edge moves, s 0..320, untouched vs after (V3 read 9.31 m at s 0 for both holds);
// (b) the open-end runs' changes outside THEIR OWN window (V3's `outside` used the fixture's fixed window 150..490, which the open-end runs do not have);
// (c) a width stroke at 470 on the flat turn, then Even: the held edge against the start as well as the untouched road, and its profile near the run's end;
// (d) a split piece just beyond the window (cut at 500): whether the level touches it.
'use strict';
const path = require('path');
const os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const D = require(path.join(T, 'src/core/document.js'));
const TB = require(path.join(T, 'src/core/turnby.js'));
const EV = require(path.join(T, 'src/core/even.js'));
const SC = require(path.join(T, 'src/core/sculpt.js'));
const { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const R = (x) => (Number.isFinite(x) ? Math.round(x * 1e4) / 1e4 : x);
const say = (o) => console.log(JSON.stringify(o));

function evenDrag(sh, { from, to }, hold, value) {
  sh.selectPiece(from); if (to !== from) sh.selectPiece(to, { extend: true });
  sh.beginSculpt({ tool: 'even', hold });
  const b = sh.getState().brush; if (!(b && b.mode === 'even')) return { opened: false, said: sh.getState().message };
  sh.sculptTo(value - b.value0); sh.endSculpt();
  return { opened: true, said: sh.getState().message };
}
// changes outside [w0, w1], every 0.5 m, in w, l, h, phi; and pieces wholly outside it that are new objects
function outsideOwn(after, before, w0, w1) {
  const off = SC.pieceOffsets(before); let pieces = 0, n = 0, worst = 0, worstAt = null;
  before.pieces.forEach((P, p) => { const e = p + 1 < before.pieces.length ? off[p + 1] : off[p] + (P.length || 0); if ((e < w0 || off[p] > w1) && after.pieces[p] !== P) pieces++; });
  for (const s of F.stations(0, F.endOf(before))) {
    if (s >= w0 - 1e-9 && s <= w1 + 1e-9) continue;
    for (const ch of ['w', 'l', 'h', 'phi']) { const a = F.at(after, ch, s), b = F.at(before, ch, s); if (!Object.is(a, b)) { n++; const d = Math.abs(a - b); if (d > worst) { worst = d; worstAt = `${ch}@${s}`; } } }
  }
  return { newPiecesOutside: pieces, changedSamples: n, worst: R(worst), worstAt };
}
const rims = (doc, s) => ({ w: R(F.at(doc, 'w', s)), l: R(F.at(doc, 'l', s)), left: R(F.rimAcross(doc, s, 'left')), right: R(F.rimAcross(doc, s, 'right')) });
function road(list) {
  let d = D.createDoc('split');
  for (const p of list) d = TB.extendCorner(d, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: 0, width: 12, ...(p.widthR === undefined ? {} : { widthR: p.widthR }), turnAs: 'corner' }));
  return Object.freeze(d);
}

(async () => {
  const flat = F.fixture('flat');

  // (a) + (b): the open-end runs
  for (const [label, run] of [['from the start', { from: 0, to: 1 }], ['to the head', { from: 4, to: 5 }]]) {
    const win = EV.evenWindow(flat, run).win;
    for (const hold of ['left', 'right']) {
      const sh = await F.shellOn(flat); sh.evenRun({ value: '16', hold, ...run }); const after = F.present(sh);
      const row = { part: 'open end', label, hold, win, outsideOwn: outsideOwn(after, flat, win.w0, win.w1) };
      if (label === 'from the start') {
        row.profile = [0, 0.5, 1, 2, 5, 10, 20, 50, 100, 150, 200, 240, 260, 280, 300, 310].map((s) => ({ s, before: rims(flat, s), after: rims(after, s) }));
        // the held edge with rimAcross's own sign: is the miss the rim reading at s 0 or the road?
        row.heldBy = [0, 1, 5, 20, 100, 260].map((s) => ({ s, d: R(F.rimAcross(after, s, hold) - F.rimAcross(flat, s, hold)) }));
      }
      say(row);
    }
  }

  // (c) a width stroke at 470, flat, then Even
  for (const hold of ['left', 'right']) {
    const sh0 = await F.shellOn(flat); F.widthStroke(sh0, 470, 16); const st = F.present(sh0);
    const sh = await F.shellOn(st); evenDrag(sh, F.runPieces(st), hold, 16); const after = F.present(sh);
    let mS = 0, atS = null; for (const s of F.stations(200, 440)) { const e = Math.abs(F.rimAcross(after, s, hold) - F.rimAcross(st, s, hold)); if (e > mS) { mS = e; atS = s; } }
    const mov = (doc, ch, x, dir) => R(F.at(doc, ch, x + dir * 10) - F.at(doc, ch, x));
    say({ part: 'width stroke 470', hold, heldRunS: { m: R(mS), at: atS }, ruleReads: { w140to150: mov(st, 'w', 150, -1), w490to500: mov(st, 'w', 490, 1), l140to150: mov(st, 'l', 150, -1), l490to500: mov(st, 'l', 490, 1), w150: R(F.at(st, 'w', 150)), w490: R(F.at(st, 'w', 490)) },
      profile: [380, 400, 420, 430, 436, 440, 444, 450, 460, 470, 480, 490].map((s) => ({ s, untouched: R(F.rimAcross(flat, s, hold)), start: R(F.rimAcross(st, s, hold)), after: R(F.rimAcross(after, s, hold)), wStart: R(F.at(st, 'w', s)), wAfter: R(F.at(after, 'w', s)) })) });
  }

  // (d) a split piece just beyond the window
  const FL = [{ length: 200, turn: 0 }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30 })), { length: 60, turn: 0 }, { length: 90, turn: 0, widthR: 14 }];
  const d = road(FL), run = F.runPieces(d), win = EV.evenWindow(d, run).win, off = SC.pieceOffsets(d);
  const sh = await F.shellOn(d); sh.evenRun({ value: '16', hold: 'left', ...run }); const after = F.present(sh);
  say({ part: 'split beyond', run: [run.from, run.to], win, splitAt: off[6], splitPieceSameObject: after.pieces[6] === d.pieces[6], splitStillSplit: D.isWidthSplit(after.pieces[6]), outsideOwn: outsideOwn(after, d, win.w0, win.w1) });
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
