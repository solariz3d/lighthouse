// v1rest678.js (pane B, D678 Track 2, the Even read, registration 1.3 V1): the rest rule (U4), grabs nearer the run's end, either rim held.
//   node v1rest678.js <builder tree, 437590e>
// Every case: the fixture (flat, B-), today's grabs on it through the shell (test/even_fixtures.js grab: the right rim pulled until the width there reads 16 m),
// then Even through the shell as he drags it (A's render678.js evenDrag) to 16 m, holding the left rim, then (from the same start) the right.
// Measured, by the builder's own fixture functions, never Even's code:
//   wSpread    max - min of w over the run 200..440, every 1 m
//   heldRunU   the held rim against the UNTOUCHED road (the fixture), over the run (A's F3); heldMarU over the margins 180..200 and 440..460 (at the value too)
//   heldRunS   the held rim against the START (the road Even was given), over the run
//   outside    A's F4 outsideChanges(after, start) count;  joints  A's F5 jointBreaks(after) count;  centre  A's K3 centreOff(after, start) on B-
// And which reference the held rim had, by Even's own rule read from the START (replicated from even.js moving/restOf/agree with the fixture's `at`): for w and l,
// whether each window end reads moving, the rule that gave the reference (rest at w0 / rest at w1 / eased), and whether the two ends agreed within 0.01 m.
'use strict';
const path = require('path');
const os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const F = require(path.join(T, 'test/even_fixtures.js'));
const EV = require(path.join(T, 'src/core/even.js'));
const R = (x) => (Number.isFinite(x) ? Math.round(x * 1e5) / 1e5 : x);

function evenDrag(sh, { from, to }, hold, value) {
  sh.selectPiece(from); if (to !== from) sh.selectPiece(to, { extend: true });
  sh.beginSculpt({ tool: 'even', hold });
  const b = sh.getState().brush; if (!(b && b.mode === 'even')) return { opened: false, said: sh.getState().message };
  sh.sculptTo(value - b.value0); sh.endSculpt();
  return { opened: true, said: sh.getState().message };
}
// even.js moving / restOf / agree, replicated on the fixture's reader
function ruleOf(doc, w0, w1) {
  const L = F.endOf(doc), out = {};
  const moving = (ch, x, dir) => { const y = x + dir * 10, z = y < 0 || y > L ? x - dir * 10 : y; return Math.abs(F.at(doc, ch, z) - F.at(doc, ch, x)) > 1e-3; };
  let agree = true;
  for (const ch of ['w', 'l']) {
    const ma = moving(ch, w0, -1), mb = moving(ch, w1, 1);
    const rule = ma === mb ? 'eased' : ma ? 'rest@w1' : 'rest@w0';
    const f0 = rule === 'eased' ? F.at(doc, ch, w0) : F.at(doc, ch, ma ? w1 : w0), f1 = rule === 'eased' ? F.at(doc, ch, w1) : f0;
    if (Math.abs(f0 - f1) > 0.01) agree = false;
    out[ch] = { movingW0: ma, movingW1: mb, rule, ref0: R(f0), ref1: R(f1) };
  }
  out.agree = agree;
  return out;
}
const maxOff = (a, b, side, lo, hi) => { let m = 0, at = null; for (const s of F.stations(lo, hi)) { const e = Math.abs(F.rimAcross(a, s, side) - F.rimAcross(b, s, side)); if (e > m) { m = e; at = s; } } return { m, at }; };

const CASES = [
  ['T1 320', [[320, 30]]], ['425', [[425, 30]]], ['440', [[440, 30]]], ['455', [[455, 30]]], ['470', [[470, 30]]], ['485', [[485, 30]]], ['495', [[495, 30]]], ['510', [[510, 30]]],
  ['175+465', [[175, 30], [465, 30]]], ['175+470', [[175, 30], [470, 30]]], ['145', [[145, 30]]], ['row 175..475', [175, 205, 235, 265, 295, 325, 355, 385, 415, 445, 475].map((s) => [s, 30])],
  ['450 r8', [[450, 8]]], ['190 r8', [[190, 8]]], ['475 r10', [[475, 10]]],
];

(async () => {
  for (const fx of ['flat', 'B-']) {
    const base = F.fixture(fx);
    for (const [name, grabs] of CASES) {
      // the start, once, and its grabs' reach checked
      const sh0 = await F.shellOn(base); let gErr = null;
      try { for (const [s, r] of grabs) F.grab(sh0, s, 16, r); } catch (e) { gErr = e.message; }
      const start = F.present(sh0);
      const grabW = grabs.map(([s]) => R(F.at(start, 'w', s)));
      const run = F.runPieces(start), win = EV.evenWindow(start, { from: run.from, to: run.to });
      const rule = ruleOf(start, win.win.w0, win.win.w1);
      for (const hold of ['left', 'right']) {
        const sh = await F.shellOn(start);
        const r = evenDrag(sh, run, hold, 16), after = F.present(sh);
        const row = { fx, case: name, hold, grabErr: gErr, grabW, run: [run.from, run.to], win: [win.win.w0, win.win.w1], opened: r.opened, laid: after !== start, said: (r.said || '').slice(0, 140) };
        if (after !== start) {
          const w = F.stations(200, 440).map((s) => F.at(after, 'w', s));
          const ru = maxOff(after, base, hold, 200, 440), mu1 = maxOff(after, base, hold, 180, 200), mu2 = maxOff(after, base, hold, 440, 460), rs = maxOff(after, start, hold, 200, 440);
          const mu = mu1.m >= mu2.m ? mu1 : mu2;
          Object.assign(row, { wSpread: R(F.spread(w)), heldRunU: R(ru.m), heldRunUat: ru.at, heldMarU: R(mu.m), heldMarUat: mu.at, heldRunS: R(rs.m), outside: F.outsideChanges(after, start).length, joints: F.jointBreaks(after).length });
          if (fx !== 'flat') row.centre = R(F.centreOff(after, start).off);
        }
        row.rule = rule;
        console.log(JSON.stringify(row));
      }
    }
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
