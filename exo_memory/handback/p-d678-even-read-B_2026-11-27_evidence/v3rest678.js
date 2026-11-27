// v3rest678.js (pane B, D678 Track 2, the Even read, registration 1.3 V3): the open end, a split piece, typed values, Undo and Redo, one piece, a width stroke,
// a hill and a swerve on the run.   node v3rest678.js <builder tree, 437590e>
// Everything through the shell (evenRun: the Even button; the drag: A's evenDrag), measured by the builder's fixture functions. One JSON line per row.
'use strict';
const path = require('path');
const os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const D = require(path.join(T, 'src/core/document.js'));
const TB = require(path.join(T, 'src/core/turnby.js'));
const EV = require(path.join(T, 'src/core/even.js'));
const { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const { createTrackModel } = require(path.join(T, 'app/preview/trackmodel.js'));
const R = (x) => (Number.isFinite(x) ? Math.round(x * 1e5) / 1e5 : x);
const say = (o) => console.log(JSON.stringify(o));

function evenDrag(sh, { from, to }, hold, value) {
  sh.selectPiece(from); if (to !== from) sh.selectPiece(to, { extend: true });
  sh.beginSculpt({ tool: 'even', hold });
  const b = sh.getState().brush; if (!(b && b.mode === 'even')) return { opened: false, said: sh.getState().message };
  sh.sculptTo(value - b.value0); sh.endSculpt();
  return { opened: true, said: sh.getState().message };
}
const maxOff = (a, b, side, lo, hi) => { let m = 0, at = null; for (const s of F.stations(lo, hi)) { const e = Math.abs(F.rimAcross(a, s, side) - F.rimAcross(b, s, side)); if (e > m) { m = e; at = s; } } return { m: R(m), at }; };
function road(name, list) {
  let d = D.createDoc(name);
  for (const p of list) d = TB.extendCorner(d, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: 0, width: 12, ...(p.widthR === undefined ? {} : { widthR: p.widthR }), turnAs: 'corner' }));
  return Object.freeze(d);
}
const FLATL = [{ length: 200, turn: 0 }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30 })), { length: 150, turn: 0 }];

(async () => {
  const flat = F.fixture('flat');

  // ── 1. the open end: run 4..5 (the head is piece 5's end, 590), and run 0..1 (the track's start) ──
  for (const [label, run, lo, hi] of [['to the head', { from: 4, to: 5 }, 380, 590], ['from the start', { from: 0, to: 1 }, 0, 260]]) {
    for (const start of ['U', 'grab 560', 'grab 30']) {
      if (label === 'to the head' && start === 'grab 30') continue; if (label === 'from the start' && start === 'grab 560') continue;
      const sh0 = await F.shellOn(flat); if (start === 'grab 560') F.grab(sh0, 560, 16); if (start === 'grab 30') F.grab(sh0, 30, 16);
      const st = F.present(sh0);
      for (const hold of ['left', 'right']) {
        const sh = await F.shellOn(st); sh.evenRun({ value: '16', hold, ...run }); const after = F.present(sh), msg = sh.getState().message;
        const row = { part: 'open end', label, start, hold, laid: after !== st, said: msg };
        if (after !== st) {
          const w = F.stations(lo, hi).map((s) => F.at(after, 'w', s));
          Object.assign(row, { wSpread: R(F.spread(w)), wEnd: R(F.at(after, 'w', label === 'to the head' ? 590 : 0)), heldU: maxOff(after, flat, hold, lo, hi), heldS: maxOff(after, st, hold, lo, hi), outside: F.outsideChanges(after, st).length });
          // where the next piece's ghost lands, against where Extend then places it (the preview's own model; the panel's candidate, which carries no lift)
          if (label === 'to the head') {
            const o = extendOptions({ length: 100 }), tm = createTrackModel(); tm.update(sh.getState().resolved);
            const g = tm.ghostFor(sh.candidate(o)); sh.extend(o); const tp = createTrackModel(); const placed = tp.update(sh.getState().resolved).path;
            const byS = new Map(); for (const x of placed.samples) byS.set(Math.round(x.s * 1000), x);
            let m = 0, mAt = null, v = 0; for (const x of g.path.samples) { if (x.s < 590) continue; const y = byS.get(Math.round(x.s * 1000)); if (!y) continue; const dh = Math.hypot(x.pos[0] - y.pos[0], x.pos[2] - y.pos[2]); if (dh > m) { m = dh; mAt = x.s; } v = Math.max(v, Math.abs(x.pos[1] - y.pos[1])); }
            row.ghostNewPieceVsPlaced = { horizM: R(m), at: mAt, vertM: R(v), headL: R(F.at(after, 'l', 590)) };
          }
        }
        say(row);
      }
    }
  }

  // ── 2. a split piece (its right side with its own width, wd) in the run, in the ramp, beyond the window, as the run's neighbour ──
  const SPLITS = { 'in the run (piece 2)': 2, 'the run\'s neighbour before (piece 0, 0..200)': 0, 'in the ramp after (piece 5 cut at 470)': 'r', 'beyond the window (piece cut at 500)': 'b' };
  for (const [label, where] of Object.entries(SPLITS)) {
    let list = FLATL.map((p) => ({ ...p }));
    if (where === 'r') list = [...list.slice(0, 5), { length: 30, turn: 0 }, { length: 120, turn: 0, widthR: 14 }];
    else if (where === 'b') list = [...list.slice(0, 5), { length: 60, turn: 0 }, { length: 90, turn: 0, widthR: 14 }];
    else list[where].widthR = 14;
    const d = road('split', list), run = F.runPieces(d), win = EV.evenWindow.length ? (() => { try { return EV.evenWindow(d, run).win; } catch (e) { return { refused: e.code || e.message }; } })() : null;
    const wd = d.pieces.map((P) => (D.isWidthSplit(P) ? 1 : 0));
    const sh = await F.shellOn(d); sh.evenRun({ value: '16', hold: 'left', ...run }); const typed = { same: F.present(sh) === d, said: sh.getState().message };
    const sh2 = await F.shellOn(d); const dr = evenDrag(sh2, run, 'left', 16); const drag = { opened: dr.opened, same: F.present(sh2) === d, said: dr.said };
    say({ part: 'split', label, splitPieces: wd, run: [run.from, run.to], win, typed, drag });
  }

  // ── 3. typed values, as the field hands them on (and as a program might) ──
  for (const v of ['16', ' 16 ', '16.25', '16.3', '16,5', '1e1', '0x10', '-16', '0', '0.49', '0.5', '400', '400.01', 'abc', '', undefined, 16, NaN, Infinity]) {
    const sh = await F.shellOn(flat); sh.evenRun({ value: v, hold: 'left', from: 1, to: 4 }); const after = F.present(sh);
    say({ part: 'typed', value: v === undefined ? 'undefined' : typeof v === 'number' ? `number ${v}` : JSON.stringify(v), laid: after !== flat, w320: after !== flat ? R(F.at(after, 'w', 320)) : null, said: sh.getState().message });
  }

  // ── 4. Undo and Redo, after the drag and after the typed level, from T2b ──
  for (const how of ['drag', 'typed']) {
    const sh = await F.shellOn(flat); let beforeLast = null;
    for (const s of F.EIGHT) { beforeLast = F.present(sh); F.grab(sh, s, 16); }
    const start = F.present(sh);
    if (how === 'drag') evenDrag(sh, F.runPieces(start), 'left', 16); else sh.evenRun({ value: '16', hold: 'left', ...F.runPieces(start) });
    const level = F.present(sh), levelBytes = JSON.stringify(D.serialize(level));
    sh.undo(); const u1 = F.present(sh), u1msg = sh.getState().message;
    sh.redo(); const r1 = F.present(sh), r1msg = sh.getState().message;
    sh.undo(); sh.undo(); const u2 = F.present(sh);
    say({ part: 'undo', how, laid: level !== start, undoIsStart: u1 === start, undoMsg: u1msg, redoSameBytes: JSON.stringify(D.serialize(r1)) === levelBytes, redoMsg: r1msg, secondUndoIsBeforeLastGrab: u2 === beforeLast });
  }

  // ── 5. one piece: piece 2 (260..320) after a grab at 320, its far end ──
  for (const hold of ['left', 'right']) {
    const sh0 = await F.shellOn(flat); F.grab(sh0, 320, 16); const st = F.present(sh0);
    const sh = await F.shellOn(st); const r = evenDrag(sh, { from: 2, to: 2 }, hold, 16), after = F.present(sh);
    const row = { part: 'one piece', hold, laid: after !== st, said: r.said };
    if (after !== st) Object.assign(row, { wSpread: R(F.spread(F.stations(260, 320).map((s) => F.at(after, 'w', s)))), heldU: maxOff(after, flat, hold, 260, 320), heldS: maxOff(after, st, hold, 260, 320), w320: R(F.at(after, 'w', 320)) });
    say(row);
  }

  // ── 6. a width stroke at 470 (the Width tool), then Even ──
  for (const fx of ['flat', 'B-']) for (const hold of ['left', 'right']) {
    const base = F.fixture(fx), sh0 = await F.shellOn(base); F.widthStroke(sh0, 470, 16); const st = F.present(sh0);
    const sh = await F.shellOn(st); const r = evenDrag(sh, F.runPieces(st), hold, 16), after = F.present(sh);
    const row = { part: 'width stroke 470', fx, hold, w470: R(F.at(st, 'w', 470)), laid: after !== st, said: (r.said || '').slice(0, 100) };
    if (after !== st) Object.assign(row, { wSpread: R(F.spread(F.stations(200, 440).map((s) => F.at(after, 'w', s)))), heldRunU: maxOff(after, base, hold, 200, 440), heldMarU: [maxOff(after, base, hold, 180, 200), maxOff(after, base, hold, 440, 460)], outside: F.outsideChanges(after, st).length, joints: F.jointBreaks(after).length });
    say(row);
  }

  // ── 7. a hill and a swerve on the run (the height and sideways brushes, outside Sculpt, as they must be), then Even holding the middle ──
  for (const fx of ['flat', 'B-']) for (const [ch, amt] of [['height', 2], ['lateral', 2]]) {
    const base = F.fixture(fx), sh0 = await F.shellOn(base); sh0.setSculpt(false);
    sh0.beginBrush({ mode: 'local', channel: ch, s0: 320, r: 30 }); const opened = !!sh0.getState().brush; if (opened) { sh0.brushTo(amt); sh0.endBrush(); }
    sh0.setSculpt(true); const st = F.present(sh0);
    const sh = await F.shellOn(st); sh.evenRun({ value: '16', hold: 'centre', ...F.runPieces(st) }); const after = F.present(sh);
    say({ part: 'hill', fx, brush: ch, opened, brushMsg: opened ? null : sh0.getState().message, before320: { h: R(F.at(st, 'h', 320)), l: R(F.at(st, 'l', 320)) }, untouched320: { h: R(F.at(base, 'h', 320)), l: R(F.at(base, 'l', 320)) }, after320: after !== st ? { h: R(F.at(after, 'h', 320)), l: R(F.at(after, 'l', 320)) } : null, said: sh.getState().message });
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
