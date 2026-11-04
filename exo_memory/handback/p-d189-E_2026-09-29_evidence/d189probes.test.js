// D189 (pane E, non-author): A's world-normalised free.move, measured through the keys, run against env TREE (my copy e-d188-wt, or
// a pristine 7b52f2f copy for red-before). The harness is copied from app/test/preview.test.js (liveFake / livePreview), so these
// drive the real createPreview. Every speed is MEASURED from the eye's movement over one frame, never read from the code.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const TREE = process.env.TREE;
const P = require(path.join(TREE, 'app/preview/preview.js'));
const F = require(path.join(TREE, 'test/geom_fixtures.js'));

function liveFake() {
  const on = (t) => (k, f) => { (t[k] = t[k] || []).push(f); }, off = () => {};
  const winL = {}, canL = {}, docL = {};
  const gl = new Proxy({ getShaderParameter: () => true, getProgramParameter: () => true, createShader: () => ({}), createProgram: () => ({}), createBuffer: () => ({}), getUniformLocation: (p, n) => n, getAttribLocation: () => 0 }, { get: (o, k) => (k in o ? o[k] : () => {}) });
  let q = [], t = 0;
  const win = { devicePixelRatio: 1, document: { hidden: false, activeElement: null, body: {}, addEventListener: on(docL), removeEventListener: off }, addEventListener: on(winL), removeEventListener: off, requestAnimationFrame: (f) => q.push(f), cancelAnimationFrame: () => {},
    step(ms = 100) { t += ms; const f = q; q = []; for (const g of f) g(t); } };
  const canvas = { clientWidth: 800, clientHeight: 500, width: 0, height: 0, getContext: () => gl, addEventListener: on(canL), removeEventListener: off };
  const fire = (tbl, k, e) => (tbl[k] || []).forEach((f) => f({ preventDefault() {}, ...e }));
  return { win, canvas, key: (type, e) => fire(winL, type, e), blur: () => fire(winL, 'blur', {}) };
}
function live() {
  const segs = [{ id: 'a', kind: 'road', length: 60, profile: F.FLAT }];
  const shell = { getState: () => ({ resolved: { segments: segs, closed: false } }), subscribe: () => () => {} };
  const f = liveFake(), p = P.createPreview({ canvas: f.canvas, shell, win: f.win });
  f.win.step(16); f.win.step(16); p.setMode('free');
  return { ...f, p };
}
const VIEW = { target: {} };
const K = (k, extra = {}) => ({ key: k, code: 'Key' + k.toUpperCase(), ...VIEW, ...extra });
const FIELD = { matches: (sel) => sel !== 'input[type="number"]', blur() { this.blurred = true; } };   // a text input
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], len = (a) => Math.hypot(...a), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
/** The eye's movement over the next 100 ms frame. */
function step(x) { const e0 = x.p.rig.free.state().eye; x.win.step(); return sub(x.p.rig.free.state().eye, e0); }
/** A fresh preview in free, pitched by `pitch` rad, with `keys` pressed in order, one frame to settle; returns its next frame's move. */
// the view's pitch is set ABSOLUTELY (setMode('free') inherits the build view's downward pitch, and look() adds to it)
function pitchTo(x, pitch) { x.p.rig.free.look(0, pitch - x.p.rig.free.state().pitch); }
function moveOf(keys, pitch = null) { const x = live(); if (pitch !== null) pitchTo(x, pitch); for (const k of keys) x.key('keydown', K(k)); x.win.step(); return step(x); }
const unit = (v) => { const l = len(v); return l ? v.map((c) => c / l) : v; };
const close = (a, b, e = 1e-9) => len(sub(a, b)) < e;
const STRAIGHT = len(moveOf(['w']));
const AX = [['w', 's'], ['d', 'a'], ['e', 'q']];
/** The 26 combinations: each axis off, its first key, or its second key; not all three off. */
const COMBOS = []; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (let c = 0; c < 3; c++) { if (!a && !b && !c) continue; COMBOS.push([a, b, c].flatMap((v, i) => (v ? [AX[i][v - 1]] : []))); }

test('every one of the 26 key combinations moves 1.0× a straight line, in METRES, at pitches −89° … +89° (through the keys)', () => {
  assert.equal(COMBOS.length, 26);
  const bad = [];
  for (const deg of [-89, -75, -60, -45, -22, -11.31, 0, 22, 45, 60, 89]) for (const ks of COMBOS) {
    const p = deg * Math.PI / 180, m = len(moveOf(ks, p)), w = len(moveOf(['w'], p));
    if (Math.abs(m / w - 1) > 1e-9 || Math.abs(w / STRAIGHT - 1) > 1e-9) bad.push(`${deg}° ${ks.join('+')}: ${(m / w).toFixed(6)}×`);
  }
  assert.deepEqual(bad, []);
});
test('W+E at −89°: 3.0 m a frame (was 0.037 m), sliding along the view HEADING, level', () => {
  const x = live(); pitchTo(x, -89 * Math.PI / 180); for (const k of ['w', 'e']) x.key('keydown', K(k)); x.win.step();
  const m = step(x), s = x.p.rig.free.state(), heading = [Math.sin(s.yaw), 0, Math.cos(s.yaw)];
  console.log(`W+E at −89°: ${len(m).toFixed(6)} m; dot with the heading ${(dot(m, heading) / len(m)).toFixed(6)}; vertical ${m[1].toExponential(2)} m`);
  assert.ok(Math.abs(len(m) - STRAIGHT) < 1e-9, `${len(m)} m`); assert.ok(dot(m, heading) / len(m) > 0.999);
});
test('Shift ramp still applies: at −60°, W+E+Shift moves exactly as far as W+Shift every frame for 8 frames (×4 → ×20)', () => {
  const a = live(), b = live(), S = { key: 'Shift', code: 'ShiftLeft', shiftKey: true, ...VIEW }, p = -60 * Math.PI / 180;
  pitchTo(a, p); pitchTo(b, p);
  a.key('keydown', S); a.key('keydown', K('w', { shiftKey: true }));
  b.key('keydown', S); b.key('keydown', K('w', { shiftKey: true })); b.key('keydown', K('e', { shiftKey: true }));
  for (let i = 0; i < 8; i++) { const ma = len(step(a)), mb = len(step(b)); assert.ok(Math.abs(mb / ma - 1) < 1e-12, `frame ${i}: ${mb / ma}`); }
  assert.ok(len(step(a)) > 4 * STRAIGHT, 'the ramp is running');
});
test('zero input is zero: no key held → no move; move(0,0,0) is a no-op; W+S released → still', () => {
  const x = live(); pitchTo(x, -89 * Math.PI / 180); assert.equal(len(step(x)), 0);
  const e0 = x.p.rig.free.state().eye; x.p.rig.free.move(0, 0, 0); assert.deepEqual(x.p.rig.free.state().eye, e0);
  x.key('keydown', K('w')); x.key('keydown', K('s')); x.win.step(); x.key('keyup', K('w')); x.key('keyup', K('s')); assert.equal(len(step(x)), 0);
});
test('the direction near the cancel is CONTINUOUS: W+E from −80° to −89° in 1° steps turns by less than 20° per degree of pitch', () => {
  let prev = null, worst = 0;
  for (let deg = -80; deg >= -89; deg--) { const m = moveOf(['w', 'e'], deg * Math.PI / 180), u = m.map((c) => c / len(m)); if (prev) worst = Math.max(worst, Math.acos(Math.min(1, dot(u, prev))) * 180 / Math.PI); prev = u; }
  console.log(`W+E direction swing per 1° of pitch, −80…−89°: at most ${worst.toFixed(2)}°`);
  assert.ok(worst < 20, `${worst}°`);
});
