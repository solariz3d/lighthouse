// vary-e.test.js (pane B, D187): E's W1/W2 fix driven with events E did not script. WT = the tree under test.
// A fake window that keeps EVERY listener (not one per type); frames stepped by hand.
'use strict';
const test = require('node:test'), assert = require('node:assert'), path = require('path'), WT = process.env.WT;
const P = require(path.join(WT, 'app/preview/preview.js')), F = require(path.join(WT, 'test/geom_fixtures.js'));
function fake() {
  const winL = {}, canL = {}, docL = {}, on = (t) => (k, f) => { (t[k] = t[k] || []).push(f); }, off = (t) => (k, f) => { t[k] = (t[k] || []).filter((g) => g !== f); };
  const gl = new Proxy({ getShaderParameter: () => true, getProgramParameter: () => true, createShader: () => ({}), createProgram: () => ({}), createBuffer: () => ({}), getUniformLocation: (p, n) => n, getAttribLocation: () => 0 }, { get: (t, k) => (k in t ? t[k] : () => {}) });
  let q = [], t = 0;
  const doc = { hidden: false, addEventListener: on(docL), removeEventListener: off(docL) };
  const win = { devicePixelRatio: 1, document: doc, addEventListener: on(winL), removeEventListener: off(winL), requestAnimationFrame: (f) => q.push(f), cancelAnimationFrame() {}, step(ms = 50) { t += ms; const f = q; q = []; for (const g of f) g(t); } };
  const canvas = { clientWidth: 800, clientHeight: 500, width: 0, height: 0, getContext: () => gl, addEventListener: on(canL), removeEventListener: off(canL) };
  const fire = (tbl, k, e) => (tbl[k] || []).slice().forEach((f) => f({ preventDefault() {}, target: {}, ...e }));
  return { win, canvas, key: (type, e) => fire(winL, type, e), wheel: (e) => fire(canL, 'wheel', e), blur: () => fire(winL, 'blur', {}) };
}
function live() {
  const segs = [{ id: 'a', kind: 'road', length: 60, profile: F.FLAT }];
  const shell = { getState: () => ({ resolved: { segments: segs, closed: false } }), subscribe: () => () => {} };
  const f = fake(), p = P.createPreview({ canvas: f.canvas, shell, win: f.win });
  f.win.step(16); f.win.step(16);
  return { ...f, p };
}
const W = (x = {}) => ({ key: 'w', code: 'KeyW', ...x }), Dk = (x = {}) => ({ key: 'd', code: 'KeyD', ...x }), Ck = { key: 'c', code: 'KeyC' }, Bk = { key: 'b', code: 'KeyB' };
const eye = (x) => x.p.rig.free.state().eye.slice();
const moved = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

// ── W1: repeats and non-repeats interleaved ──
test('V1 W fresh → free; B → build; W repeats ×5 interleaved with frames → stays build; W up, W fresh → free again', () => {
  const x = live();
  x.key('keydown', W()); x.win.step(); assert.equal(x.p.rig.mode, 'free');
  x.key('keydown', Bk); x.win.step(); assert.equal(x.p.rig.mode, 'build');
  for (let i = 0; i < 5; i++) { x.key('keydown', W({ repeat: true })); x.win.step(); }
  assert.equal(x.p.rig.mode, 'build', 'a repeat does not take the view back');
  x.key('keyup', W()); x.key('keydown', W()); x.win.step();
  assert.equal(x.p.rig.mode, 'free', 'a fresh press does');
});
test('V2 W held repeating; C; then D pressed FRESH while W still repeats → free (a new move is a new move)', () => {
  const x = live();
  x.key('keydown', W()); x.win.step(); x.key('keydown', W({ repeat: true })); x.win.step();
  x.key('keydown', Ck); x.win.step(); const afterC = x.p.rig.mode;
  x.key('keydown', W({ repeat: true })); x.win.step(); const afterRepeat = x.p.rig.mode;
  x.key('keydown', Dk()); x.win.step();
  console.log('V2', JSON.stringify({ afterC, afterRepeat, afterFreshD: x.p.rig.mode }));
  assert.notEqual(afterC, 'free'); assert.equal(afterRepeat, afterC); assert.equal(x.p.rig.mode, 'free');
});
test('V3 C pressed between two repeats of the SAME frame (repeat, C, repeat, then one frame) → stays out of free', () => {
  const x = live();
  x.key('keydown', W()); x.win.step();
  x.key('keydown', W({ repeat: true })); x.key('keydown', Ck); x.key('keydown', W({ repeat: true })); x.win.step(); x.win.step();
  assert.notEqual(x.p.rig.mode, 'free');
});
test('V4 a fresh W then C in the SAME frame (no frame between) → C wins, stays out of free', () => {
  const x = live();
  x.key('keydown', W()); x.key('keydown', Ck); x.win.step(); x.win.step();
  console.log('V4', JSON.stringify({ mode: x.p.rig.mode }));
  assert.notEqual(x.p.rig.mode, 'free');
});
test('V5 (probe) W held across a blur: focus returns with the OS still repeating (repeat: true, never a fresh down) in the build view', () => {
  const x = live();
  x.key('keydown', W()); x.win.step(); x.key('keydown', Bk); x.win.step();
  x.blur(); for (let i = 0; i < 4; i++) { x.key('keydown', W({ repeat: true })); x.win.step(); }
  console.log('V5', JSON.stringify({ mode: x.p.rig.mode, note: 'build = the repeat is ignored until W is re-pressed' }));
});
test('V6 (probe) in FREE, W released during a blur: repeats after focus fly again (held re-added by a repeat)', () => {
  const x = live();
  x.key('keydown', W()); x.win.step(); x.blur(); const e0 = eye(x);
  x.key('keydown', W({ repeat: true })); x.win.step(); x.win.step();
  console.log('V6', JSON.stringify({ mode: x.p.rig.mode, flew: +moved(eye(x), e0).toFixed(3) }));
});
test('V7 an arrow (look) pressed fresh from build takes over; its repeats after B do not', () => {
  const x = live(), A = (r) => ({ key: 'ArrowLeft', code: 'ArrowLeft', repeat: r });
  x.key('keydown', A(false)); x.win.step(); const first = x.p.rig.mode;
  x.key('keydown', Bk); x.win.step(); for (let i = 0; i < 3; i++) { x.key('keydown', A(true)); x.win.step(); }
  console.log('V7', JSON.stringify({ first, afterRepeats: x.p.rig.mode }));
  assert.equal(x.p.rig.mode, 'build');
});

// ── W2: the wheel ──
const zoomAfter = (events) => { const x = live(); for (const e of events) x.wheel(e); return { zoom: x.p.rig.zoomOf('build'), fov: x.p.rig.fov }; };
test('V8 wheel matrix: deltaX alone, with Shift, with Ctrl, with Ctrl+Shift; deltaY with Ctrl; a diagonal swipe', () => {
  const base = zoomAfter([]), N = 10;
  const rows = {
    deltaX_only: zoomAfter(Array(N).fill({ deltaY: 0, deltaX: 3 })),
    deltaX_shift: zoomAfter(Array(N).fill({ deltaY: 0, deltaX: -100, shiftKey: true })),
    deltaX_ctrl: zoomAfter(Array(N).fill({ deltaY: 0, deltaX: 3, ctrlKey: true })),
    deltaX_ctrl_shift: zoomAfter(Array(N).fill({ deltaY: 0, deltaX: -100, ctrlKey: true, shiftKey: true })),
    deltaY_ctrl: zoomAfter(Array(N).fill({ deltaY: -100, ctrlKey: true })),
    diagonal: zoomAfter(Array(N).fill({ deltaY: -2, deltaX: 40 })),
    tiny_deltaY: zoomAfter(Array(N).fill({ deltaY: -0.5 })),
  };
  console.log('V8', JSON.stringify({ base, ...rows }));
  assert.equal(rows.deltaX_only.zoom, base.zoom); assert.equal(rows.deltaX_only.fov, base.fov);
  assert.equal(rows.deltaX_ctrl.zoom, base.zoom); assert.equal(rows.deltaX_ctrl.fov, base.fov);
  assert.ok(rows.deltaX_shift.zoom < base.zoom, 'Shift+sideways still zooms in (×4 a notch)');
  assert.ok(rows.deltaX_ctrl_shift.fov !== base.fov && rows.deltaX_ctrl_shift.zoom === base.zoom, 'Ctrl+Shift sideways is the lens, 4 a notch');
  assert.ok(rows.deltaY_ctrl.fov < base.fov && rows.deltaY_ctrl.zoom === base.zoom, 'Ctrl+wheel is the lens');
  assert.ok(rows.diagonal.zoom < base.zoom, 'a diagonal swipe follows its deltaY');
});
