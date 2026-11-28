// e271.js (pane E, L271 read of Even A1B, 9ab2268): fresh roads, each reason, Undo/Redo, the banked sentence. node e271.js <tree>
// Measures with the builder's fixture ruler (test/even_fixtures.js rimAcross: the zone grab's frame, not Even's rimReader), every 0.25 m. Prints JSON lines.
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const EV = require(path.join(T, 'src/core/even.js')), EVW = require(path.join(T, 'app/core/evenwords.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const R = (x, n = 4) => (Number.isFinite(x) ? +x.toFixed(n) : x);
const out = (o) => process.stdout.write(JSON.stringify(o) + '\n');
// a road from a list of { length, turn, bank, climb, width }, as the fixtures build (extendCorner through extendOptions)
function road(list) {
  let d = D.createDoc('e271');
  for (const p of list) d = TB.extendCorner(d, extendOptions({ length: p.length, turn: p.turn || 0, climb: p.climb || 0, bank: p.bank || 0, width: p.width === undefined ? 12 : p.width, turnAs: 'corner' }));
  return Object.freeze(d);
}
async function shellOf(doc) { const sh = await createCoreShell({ autosaveMs: 0 }); sh.commitDoc(doc); sh.setSculpt(true); return sh; }
const offs = (d) => SC.pieceOffsets(d);
const len = (d) => { const o = offs(d); return o[o.length - 1] + d.pieces[d.pieces.length - 1].length; };
function maxOff(f, a, b, step = 0.25) { let m = 0, at = a; for (let s = a; s <= b + 1e-9; s += step) { const e = Math.abs(f(s)); if (e > m) { m = e; at = s; } } return { m: R(m), at: R(at, 2) }; }
const wAt = (d, s) => F.at(d, 'w', s);

// one Even, typed through the shell as he types it (run selected, width typed, edge chosen): the message, the reading, and the kept edge measured
async function one(name, { base, start, run, value, hold }) {
  const row = { name, hold, value, run: [run.from, run.to] };
  try {
    const sh = await shellOf(start), st0 = sh.getState().history.present, o = offs(st0), lo = o[run.from], hi = o[run.to] + st0.pieces[run.to].length;
    const { win } = EV.evenWindow(st0, run); row.win = [R(win.w0, 2), R(win.w1, 2)]; row.runS = [R(lo, 2), R(hi, 2)];
    const res = EV.even(st0, { ...run, value, hold });   // the same call the shell makes, for reading/why/keptMove
    row.reading = res.reading; row.why = res.why; row.banked = res.banked;
    sh.selectPiece(run.from); if (run.to !== run.from) sh.selectPiece(run.to, { extend: true });
    sh.evenRun({ value, hold });
    const st1 = sh.getState(), d = st1.history.present; row.msg = st1.message;
    if (d === st0) { row.refused = true; out(row); return { sh, st0, d, row }; }
    row.sameAsCore = D.serialize(d) === D.serialize(res.doc);
    const said = /moved ([0-9.]+) m/.exec(row.msg || ''); row.saidM = said ? +said[1] : null;
    row.saysBank = /under the bank as Even finds it/.test(row.msg || '');
    const k = res.keptMove(); row.keptMove = { m: R(k.m), at: k.at };
    const [w0, w1] = [win.w0, win.w1];
    row.moveMine = maxOff((s) => F.rimAcross(d, s, hold) - F.rimAcross(st0, s, hold), Math.max(0, w0), Math.min(len(st0), w1));
    row.vsNowRun = maxOff((s) => F.rimAcross(d, s, hold) - F.rimAcross(st0, s, hold), lo, hi);
    if (base) row.vsBeforeGrabsRun = maxOff((s) => F.rimAcross(d, s, hold) - F.rimAcross(base, s, hold), lo, hi);
    row.wSpread = R(Math.max(...F.stations(lo, hi).map((s) => wAt(d, s))) - Math.min(...F.stations(lo, hi).map((s) => wAt(d, s))));
    out(row); return { sh, st0, d, row, res };
  } catch (e) { row.error = String(e && e.message || e).slice(0, 200); out(row); return { row }; }
}
// the road's own width and line at the window's ends, and 10/20/30 m beyond (to read each reason against the road)
function ends(name, d, run) {
  const { win } = EV.evenWindow(d, run), L = len(d), pick = (x, dir) => [0, 10, 20, 30].map((k) => { const z = x + dir * k; return z < 0 || z > L ? null : { s: R(z, 1), w: R(wAt(d, z)), l: R(F.at(d, 'l', z)) }; });
  out({ ends: name, w0: R(win.w0, 2), w1: R(win.w1, 2), L: R(L, 1), near: pick(win.w0, -1), far: pick(win.w1, 1), inwardNear: { s: R(win.w0 + 10, 1), w: R(wAt(d, win.w0 + 10)) }, inwardFar: { s: R(win.w1 - 10, 1), w: R(wAt(d, win.w1 - 10)) } });
}

(async () => {
  // ---- 1. fresh roads (none of the 28-case table's layouts): an S-bend, the same banked, the same climbing, with grabs
  const SB = (bank = 0, climb = 0) => road([{ length: 200 }, { length: 80, turn: 25, bank, climb }, { length: 80, turn: -25, bank, climb }, { length: 120, bank: 0, climb }, { length: 200 }]);
  const RUN = { from: 1, to: 3 };   // s 200 to 480
  for (const [rn, mk] of [['S-bend flat', () => SB()], ['S-bend banked -12', () => SB(-12)], ['S-bend climbing 3', () => SB(0, 3)]]) {
    const base = mk();
    for (const [st, grabs] of [['untouched', []], ['one grab mid', [[340, 17]]], ['grab 4 m inside the run end', [[476, 16]]], ['three grabs', [[240, 15], [330, 17], [420, 15.5]]]]) {
      const sh = await shellOf(base); for (const [s, w] of grabs) F.grab(sh, s, w);
      const start = sh.getState().history.present;
      for (const hold of ['left', 'right']) await one(`${rn} | ${st}`, { base, start, run: RUN, value: 15, hold });
    }
  }
  // a road whose own width changes inside the run, no bump (A's WC6 kind, a fresh one): the figure must say the metres
  { const base = road([{ length: 250 }, { length: 100, width: 12 }, { length: 100, width: 16 }, { length: 100, width: 12 }, { length: 200, width: 12 }]);
    for (const hold of ['left', 'right']) await one('width bulge inside the run (no grab)', { base, start: base, run: { from: 1, to: 3 }, value: 14, hold }); }

  // ---- 2. each reason, on a road built for it, with the road read at the ends
  const RS = [
    ['X0 control: a plain road, run in its middle', road([{ length: 250 }, { length: 100 }, { length: 100 }, { length: 250 }]), { from: 1, to: 2 }],
    ['X1 width differs at the two ends (12 before, 16 after)', road([{ length: 250 }, { length: 100 }, { length: 100, width: 16 }, { length: 250, width: 16 }]), { from: 1, to: 2 }],
    ['X2 run from the track start (the new track\'s lead)', road([{ length: 100 }, { length: 100 }, { length: 300 }]), { from: 0, to: 1 }],
    ['X2b run from the start, the first piece typed 31 (no taper at the start)', road([{ length: 120, width: 31 }, { length: 100 }, { length: 300 }]), { from: 0, to: 1 }],
    ['X3 far end in a taper heading away (12 -> 20 beyond)', road([{ length: 300 }, { length: 100 }, { length: 60 }, { length: 100, width: 20 }, { length: 200, width: 20 }]), { from: 1, to: 1 }],
    ['X5 run to the open end, the head still tapering', road([{ length: 300 }, { length: 100 }, { length: 60, width: 16 }]), { from: 1, to: 2 }],
    ['X5b run to the open end, the head level at 16 for 100 m', road([{ length: 300 }, { length: 100 }, { length: 100, width: 16 }, { length: 100, width: 16 }]), { from: 1, to: 2 }],
    ['X6 a short track, the run all of it', road([{ length: 90 }, { length: 60 }]), { from: 0, to: 1 }],
  ];
  for (const [nm, d, run] of RS) { ends(nm, d, run); for (const hold of ['left']) await one(nm, { base: d, start: d, run, value: 14, hold }); }
  // both ends moving, and a line reason: grabs at the two window ends
  { const base = road([{ length: 250 }, { length: 100 }, { length: 100 }, { length: 250 }]), sh = await shellOf(base); F.grab(sh, 205, 15); F.grab(sh, 445, 15);
    const st = sh.getState().history.present; ends('X4 grabs on both window ends', st, { from: 1, to: 2 }); await one('X4 grabs on both window ends', { base, start: st, run: { from: 1, to: 2 }, value: 14, hold: 'left' }); }
  { const base = road([{ length: 250 }, { length: 100 }, { length: 100 }, { length: 250 }]), sh = await shellOf(base);
    sh.beginBrush({ mode: 'local', channel: 'lateral', s0: 470, r: 40 }); sh.brushTo(1.5); sh.endBrush();
    const st = sh.getState().history.present; ends('X7 a sideways nudge at the far window end', st, { from: 1, to: 2 }); await one('X7 a sideways nudge at the far window end', { base, start: st, run: { from: 1, to: 2 }, value: 14, hold: 'left' }); }
  // a closed lap: Even near its start line
  { let d = road([{ length: 100 }, { length: 150, turn: 90 }, { length: 100 }, { length: 150, turn: 90 }, { length: 100 }, { length: 150, turn: 90 }, { length: 100 }, { length: 150, turn: 90 }]);
    const sh = await shellOf(d); sh.closeBest ? sh.closeBest() : sh.close(); d = sh.getState().history.present; out({ closedLap: !!d.closed, msg: sh.getState().message && sh.getState().message.slice(0, 80) });
    if (d.closed) for (const run of [{ from: 0, to: 0 }, { from: 2, to: 2 }]) await one(`closed lap, run ${run.from}`, { base: d, start: d, run, value: 14, hold: 'left' }); }

  // ---- 3. Undo and Redo across an Even, typed and dragged, on the S-bend with one grab
  { const base = SB(), sh = await shellOf(base); F.grab(sh, 340, 17); const before = sh.getState().history.present, bS = D.serialize(before);
    sh.selectPiece(1); sh.selectPiece(3, { extend: true }); sh.evenRun({ value: 15, hold: 'left' });
    const after = sh.getState().history.present, aS = D.serialize(after), m1 = sh.getState().message;
    sh.undo(); const u = D.serialize(sh.getState().history.present); sh.redo(); const r = D.serialize(sh.getState().history.present);
    sh.undo(); sh.undo(); const u2 = D.serialize(sh.getState().history.present); sh.redo(); sh.redo(); const r2 = D.serialize(sh.getState().history.present);
    out({ undo: 'typed', changed: aS !== bS, undoIsBefore: u === bS, redoIsAfter: r === aS, undoTwiceIsUngrabbed: u2 === D.serialize(base), redoTwiceIsAfter: r2 === aS, msg: m1 && m1.slice(0, 120) });
    // the drag
    const sh2 = await shellOf(base); F.grab(sh2, 340, 17); const b2 = sh2.getState().history.present, b2S = D.serialize(b2);
    sh2.selectPiece(1); sh2.selectPiece(3, { extend: true }); sh2.beginSculpt({ tool: 'even', hold: 'right' }); const br = sh2.getState().brush;
    if (!br) { out({ undo: 'drag', error: sh2.getState().message }); }
    else { sh2.sculptTo(14 - br.value0); sh2.sculptTo(15 - br.value0); sh2.endSculpt();
      const a2 = sh2.getState().history.present, a2S = D.serialize(a2), m2 = sh2.getState().message, saidM = (/moved ([0-9.]+) m/.exec(m2 || '') || [])[1];
      sh2.undo(); const u3 = D.serialize(sh2.getState().history.present); sh2.redo(); const r3 = D.serialize(sh2.getState().history.present);
      const mv = maxOff((s) => F.rimAcross(a2, s, 'right') - F.rimAcross(b2, s, 'right'), 150, 530);
      out({ undo: 'drag', changed: a2S !== b2S, oneStep: u3 === b2S, redoIsAfter: r3 === a2S, msg: m2 && m2.slice(0, 160), saidM: saidM ? +saidM : null, moveMine: mv, past: sh2.getState().history.past.length }); }
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
