// e271b.js (pane E, L271): the second probe. The figure against my own ruler at WHOLE metres (as registered) and at 0.25 m; the two suspect reasons read
// along the road; a 'differs at both ends' road; a sideways nudge with Sculpt off; a closed lap; a banked stretch that falls back. node e271b.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const EV = require(path.join(T, 'src/core/even.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const R = (x, n = 4) => (Number.isFinite(x) ? +x.toFixed(n) : x);
const out = (o) => process.stdout.write(JSON.stringify(o) + '\n');
function road(list) { let d = D.createDoc('e271'); for (const p of list) d = TB.extendCorner(d, extendOptions({ length: p.length, turn: p.turn || 0, climb: p.climb || 0, bank: p.bank || 0, width: p.width === undefined ? 12 : p.width, turnAs: 'corner' })); return Object.freeze(d); }
async function shellOf(doc, sculpt = true) { const sh = await createCoreShell({ autosaveMs: 0 }); sh.commitDoc(doc); sh.setSculpt(sculpt); return sh; }
const len = (d) => { const o = SC.pieceOffsets(d); return o[o.length - 1] + d.pieces[d.pieces.length - 1].length; };
function maxOff(f, a, b, step) { let m = 0, at = a; for (let s = a; s <= b + 1e-9; s += step) { const e = Math.abs(f(s)); if (e > m) { m = e; at = s; } } return { m: R(m), at: R(at, 2) }; }
const along = (d, ch, xs) => xs.map((s) => [s, R(F.at(d, ch, s))]);
async function one(name, { start, run, value, hold }) {
  const row = { name, hold };
  try {
    const sh = await shellOf(start), st0 = sh.getState().history.present, o = SC.pieceOffsets(st0), lo = o[run.from], hi = o[run.to] + st0.pieces[run.to].length;
    const { win } = EV.evenWindow(st0, run), a = Math.max(0, Math.ceil(win.w0)), b = Math.min(len(st0), Math.floor(win.w1));
    const res = EV.even(st0, { ...run, value, hold }); row.reading = res.reading; row.why = res.why; row.banked = res.banked;
    sh.selectPiece(run.from); if (run.to !== run.from) sh.selectPiece(run.to, { extend: true }); sh.evenRun({ value, hold });
    const d = sh.getState().history.present; row.msg = (sh.getState().message || '').slice(0, 400);
    if (d === st0) { row.refused = true; out(row); return; }
    const said = /moved ([0-9.]+) m/.exec(row.msg); row.saidM = said ? +said[1] : null; row.saysBank = /under the bank/.test(row.msg);
    const k = res.keptMove(); row.keptMove = { m: R(k.m), at: k.at };
    const f = (s) => F.rimAcross(d, s, hold) - F.rimAcross(st0, s, hold);
    row.mine1m = maxOff(f, a, b, 1); row.mineQuarter = maxOff(f, a, b, 0.25); row.mineRun1m = maxOff(f, lo, hi, 1);
    out(row);
  } catch (e) { row.error = String(e && e.message || e).slice(0, 200); out(row); }
}
(async () => {
  // the figure at whole metres, on the first probe's roads
  const SB = (bank = 0) => road([{ length: 200 }, { length: 80, turn: 25, bank }, { length: 80, turn: -25, bank }, { length: 120, bank }, { length: 200 }]);
  for (const [nm, mk, grabs] of [['S-bend flat | untouched', () => SB(), []], ['S-bend flat | one grab mid', () => SB(), [[340, 17]]], ['S-bend banked -12 | one grab mid', () => SB(-12), [[340, 17]]]]) {
    const sh = await shellOf(mk()); for (const [s, w] of grabs) F.grab(sh, s, w); const st = sh.getState().history.present;
    for (const hold of ['left', 'right']) await one(nm, { start: st, run: { from: 1, to: 3 }, value: 15, hold });
  }
  // X2b along the road: the first piece typed 31
  { const d = road([{ length: 120, width: 31 }, { length: 100 }, { length: 300 }]); out({ along: 'X2b width', w: along(d, 'w', [0, 5, 10, 20, 30, 60, 90, 110, 120, 130, 150, 200, 220, 250, 270, 300]) }); await one('X2b', { start: d, run: { from: 0, to: 1 }, value: 14, hold: 'left' }); }
  // X6 along the road
  { const d = road([{ length: 90 }, { length: 60 }]); out({ along: 'X6 width', w: along(d, 'w', [0, 10, 30, 60, 90, 110, 120, 130, 140, 145, 150]) }); await one('X6', { start: d, run: { from: 0, to: 1 }, value: 14, hold: 'left' }); }
  // X6b: a short track whose width is level everywhere (every piece typed 31)
  { const d = road([{ length: 90, width: 31 }, { length: 60, width: 31 }]); out({ along: 'X6b width', w: along(d, 'w', [0, 10, 30, 60, 90, 120, 140, 150]) }); await one('X6b level short track', { start: d, run: { from: 0, to: 1 }, value: 14, hold: 'left' }); }
  // X1' both ends at rest and different (the lead's taper done before the window)
  { const d = road([{ length: 300 }, { length: 150 }, { length: 100 }, { length: 100, width: 16 }, { length: 300, width: 16 }]); const { win } = EV.evenWindow(d, { from: 2, to: 3 });
    out({ along: "X1' width", w0: win.w0, w1: win.w1, w: along(d, 'w', [win.w0 - 30, win.w0 - 10, win.w0, win.w1, win.w1 + 10, win.w1 + 30]) }); await one("X1' ends at rest, 12 and 16", { start: d, run: { from: 2, to: 3 }, value: 14, hold: 'left' }); }
  // X4 again, with the line read at the ends and inward
  { const base = road([{ length: 250 }, { length: 100 }, { length: 100 }, { length: 250 }]), sh = await shellOf(base); F.grab(sh, 205, 15); F.grab(sh, 445, 15); const st = sh.getState().history.present, { win } = EV.evenWindow(st, { from: 1, to: 2 });
    out({ along: 'X4 line', w0: win.w0, w1: win.w1, l: along(st, 'l', [win.w0 - 30, win.w0 - 20, win.w0 - 10, win.w0, win.w0 + 10, win.w1 - 10, win.w1, win.w1 + 10, win.w1 + 20, win.w1 + 30]), w: along(st, 'w', [win.w0 - 10, win.w0, win.w0 + 10, win.w1 - 10, win.w1, win.w1 + 10]) }); }
  // X7: a sideways nudge at the far window end, made with Sculpt OFF (the local brush is refused under Sculpt)
  { const base = road([{ length: 300 }, { length: 150 }, { length: 100 }, { length: 300 }]), sh = await shellOf(base, false);
    sh.beginBrush({ mode: 'local', channel: 'lateral', s0: 620, r: 40 }); sh.brushTo(1.5); sh.endBrush(); const m = sh.getState().message, st = sh.getState().history.present, { win } = EV.evenWindow(st, { from: 2, to: 2 });
    out({ along: 'X7 line', brushMsg: m && m.slice(0, 80), changed: st !== base, w0: win.w0, w1: win.w1, l: along(st, 'l', [win.w0, win.w1 - 10, win.w1, win.w1 + 10, win.w1 + 20, win.w1 + 30]) });
    await one('X7 nudge at the far end (Sculpt off)', { start: st, run: { from: 2, to: 2 }, value: 14, hold: 'left' }); }
  // a banked stretch that falls back: the run from the track's start, banked; and the 12/16 road banked
  { const d = road([{ length: 100, bank: -10 }, { length: 100, bank: -10 }, { length: 300 }]); await one('banked, run from the start', { start: d, run: { from: 0, to: 1 }, value: 14, hold: 'left' }); await one('banked, run from the start', { start: d, run: { from: 0, to: 1 }, value: 14, hold: 'right' }); }
  { const d = road([{ length: 300 }, { length: 150 }, { length: 100, bank: -10, turn: 30 }, { length: 100, width: 16, bank: -10, turn: 30 }, { length: 300, width: 16 }]); await one('banked, ends at rest 12 and 16', { start: d, run: { from: 2, to: 3 }, value: 14, hold: 'right' }); }
  // a closed lap (close()), Even near its start line and away from it
  { const base = road([{ length: 200 }, { length: 157.08, turn: 90 }, { length: 200 }, { length: 157.08, turn: 90 }, { length: 200 }, { length: 157.08, turn: 90 }, { length: 200 }, { length: 157.08, turn: 90 }]);
    const sh = await shellOf(base, false); sh.close(); let d = sh.getState().history.present; out({ closed: !!d.closed, msg: (sh.getState().message || '').slice(0, 100) });
    if (!d.closed && sh.closeBest) { sh.closeBest(); d = sh.getState().history.present; out({ closedBest: !!d.closed, msg: (sh.getState().message || '').slice(0, 100) }); }
    if (d.closed) for (const run of [{ from: 0, to: 0 }, { from: 2, to: 3 }, { from: d.pieces.length - 1, to: d.pieces.length - 1 }]) await one(`closed lap run ${run.from}..${run.to}`, { start: d, run, value: 14, hold: 'left' }); }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
