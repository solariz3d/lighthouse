// e271c.js (pane E, L271 short re-read of 0c16169): my three roads and two more with an edge, typed through the shell; the road read along. node e271c.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const EV = require(path.join(T, 'src/core/even.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const R = (x) => (Number.isFinite(x) ? +x.toFixed(4) : x), out = (o) => process.stdout.write(JSON.stringify(o) + '\n');
function road(list) { let d = D.createDoc('e271'); for (const p of list) d = TB.extendCorner(d, extendOptions({ length: p.length, turn: p.turn || 0, bank: p.bank || 0, climb: 0, width: p.width === undefined ? 12 : p.width, turnAs: 'corner' })); return Object.freeze(d); }
const len = (d) => { const o = SC.pieceOffsets(d); return o[o.length - 1] + d.pieces[d.pieces.length - 1].length; };
(async () => {
  const roads = [
    ['X2b a first piece typed 31 m', road([{ length: 120, width: 31 }, { length: 100 }, { length: 300 }]), { from: 0, to: 1 }],
    ['X6 a 150 m track evened whole', road([{ length: 90 }, { length: 60 }]), { from: 0, to: 1 }],
    ['X6b a 150 m track level at 31 m', road([{ length: 90, width: 31 }, { length: 60, width: 31 }]), { from: 0, to: 1 }],
    ['E1 the run reaching the open end, the head level at 16 m', road([{ length: 300 }, { length: 150 }, { length: 100 }, { length: 100, width: 16 }, { length: 150, width: 16 }, { length: 40, width: 16 }]), { from: 3, to: 4 }],
    ['E2 the run from the start of a new track, its far end in a taper', road([{ length: 100 }, { length: 100 }, { length: 60, width: 20 }, { length: 200, width: 20 }]), { from: 0, to: 1 }],
    ['E3 the run from a start typed 12 m, level to the far end (control: a reading)', road([{ length: 100, width: 12 }, { length: 100, width: 12 }, { length: 300, width: 12 }]), { from: 0, to: 1 }],
  ];
  for (const [nm, d, run] of roads) {
    const { win } = EV.evenWindow(d, run), L = len(d), xs = [...new Set([0, 10, 20, 30, win.w0, win.w0 + 10, win.w1 - 10, win.w1, win.w1 + 10, win.w1 + 20, win.w1 + 30, L - 10, L].filter((s) => s >= 0 && s <= L).map((s) => R(s)))].sort((a, b) => a - b);
    const sh = await createCoreShell({ autosaveMs: 0 }); sh.commitDoc(d); sh.setSculpt(true);
    sh.selectPiece(run.from); if (run.to !== run.from) sh.selectPiece(run.to, { extend: true }); sh.evenRun({ value: 14, hold: 'left' });
    const after = sh.getState().history.present, msg = sh.getState().message || '', why = (/because Even could not read the road under the stretch from its ends: ([^;]*)/.exec(msg) || [])[1] || null;
    const res = EV.even(d, { ...run, value: 14, hold: 'left' }), k = res.keptMove();
    out({ road: nm, L: R(L), win: [R(win.w0), R(win.w1)], widthAlong: xs.map((s) => [s, R(F.at(d, 'w', s))]), reading: res.reading, why: res.why, saidWhy: why, saidMoved: +((/moved ([0-9.]+) m/.exec(msg) || [])[1]), keptMove: R(k.m), changed: after !== d });
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
