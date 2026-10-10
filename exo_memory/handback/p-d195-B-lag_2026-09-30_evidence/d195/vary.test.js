// vary.test.js (pane B, D195): E's empty-track fallback with cases E did not script. WT = the tree. A fake window keeping every listener.
'use strict';
const test = require('node:test'), assert = require('node:assert'), path = require('path'), WT = process.env.WT;
const P = require(path.join(WT, 'app/preview/preview.js')), F = require(path.join(WT, 'test/geom_fixtures.js'));
function fake() {
  const winL = {}, canL = {}, docL = {}, on = (t) => (k, f) => { (t[k] = t[k] || []).push(f); }, off = (t) => (k, f) => { t[k] = (t[k] || []).filter((g) => g !== f); };
  const gl = new Proxy({ getShaderParameter: () => true, getProgramParameter: () => true, createShader: () => ({}), createProgram: () => ({}), createBuffer: () => ({}), getUniformLocation: (p, n) => n, getAttribLocation: () => 0 }, { get: (t, k) => (k in t ? t[k] : () => {}) });
  let q = [], t = 0;
  const win = { devicePixelRatio: 1, document: { hidden: false, addEventListener: on(docL), removeEventListener: off(docL) }, addEventListener: on(winL), removeEventListener: off(winL), requestAnimationFrame: (f) => q.push(f), cancelAnimationFrame() {}, step(ms = 50) { t += ms; const f = q; q = []; for (const g of f) g(t); } };
  const canvas = { clientWidth: 800, clientHeight: 500, width: 0, height: 0, getContext: () => gl, addEventListener: on(canL), removeEventListener: off(canL) };
  const fire = (tbl, k, e) => (tbl[k] || []).slice().forEach((f) => f({ preventDefault() {}, target: {}, ...e }));
  return { win, canvas, key: (type, e) => fire(winL, type, e), wheel: (e) => fire(canL, 'wheel', e) };
}
/** A shell whose state the test changes: set(resolved) notifies the preview like the real shell. */
function shellOf(resolved) { let st = { resolved }, subs = []; return { getState: () => st, subscribe: (f) => { subs.push(f); return () => {}; }, set(r) { st = { resolved: r }; subs.forEach((f) => f(st)); } }; }
function live(resolved) { const f = fake(), sh = shellOf(resolved), p = P.createPreview({ canvas: f.canvas, shell: sh, win: f.win }); for (let i = 0; i < 30; i++) f.win.step(); return { ...f, sh, p }; }
const near = (a, b, e = 1e-6) => a.every((x, i) => Math.abs(x - b[i]) < e);
const aim = (p) => { const v = p.view().pose; const d = v.target.map((x, i) => x - v.eye[i]); return { eye: v.eye, target: v.target, dir: d }; };

test('V1 a non-origin, turned, pitched document start: the empty view looks at THAT start, along its heading', () => {
  const start = { pos: [120, 7, -40], theta: 1.1, p: 0.05 };
  const x = live({ segments: [], closed: false, start });
  const a = aim(x.p), h = P.startHead(start);
  console.log('V1', JSON.stringify({ target: a.target.map((v) => +v.toFixed(3)), head: h.pos, T: h.T.map((v) => +v.toFixed(4)) }));
  assert.ok(Math.hypot(...a.target.map((v, i) => v - start.pos[i])) < 40, 'the camera looks near the start');
  const flat = [a.dir[0], a.dir[2]], hf = [h.T[0], h.T[2]], cos = (flat[0] * hf[0] + flat[1] * hf[1]) / (Math.hypot(...flat) * Math.hypot(...hf));
  assert.ok(cos > 0.99, `looks along the start heading (cos ${cos})`);
});
test('V2 the start CHANGES while the track is empty (a New / an opened doc): the view follows the new start', () => {
  const x = live({ segments: [], closed: false, start: { pos: [0, 0, 0], theta: 0, p: 0 } });
  const t0 = aim(x.p).target; x.sh.set({ segments: [], closed: false, start: { pos: [500, 0, 500], theta: Math.PI, p: 0 } }); for (let i = 0; i < 60; i++) x.win.step();
  const t1 = aim(x.p).target; console.log('V2', JSON.stringify({ t0, t1: t1.map((v) => +v.toFixed(2)) }));
  assert.ok(Math.hypot(t1[0] - 500, t1[2] - 500) < 40, 'the view moved to the new start');
});
test('V3 a resolve error (resolved: null, the piece builder): nothing throws, the view draws at the origin', () => {
  const x = live(null); const a = aim(x.p);
  console.log('V3', JSON.stringify({ target: a.target, eye: a.eye }));
  assert.ok(a.eye.every(Number.isFinite) && Math.hypot(...a.target) < 40);
});
test('V4 the piece builder\'s shape (resolved without a start): the origin, heading 0', () => {
  const x = live({ segments: [], closed: false }); const a = aim(x.p);
  assert.ok(a.dir[2] > 0 && Math.abs(a.dir[0]) < 1e-9, 'looking along +z from the origin');
});
test('V5 rapid ghost show/hide x20 then a placed piece then clear: no leak of the start once a piece exists', () => {
  const start = { pos: [0, 0, 0], theta: 0, p: 0 }, segs = [{ id: 'a', kind: 'road', length: 80, profile: F.FLAT }];
  const x = live({ segments: [], closed: false, start });
  for (let i = 0; i < 20; i++) { try { x.p.showGhost({ segments: segs, closed: false, start }); } catch (e) { /* the ghost API may reject a stub: measured below */ } x.win.step(); x.p.clearGhost(); x.win.step(); }
  for (let i = 0; i < 30; i++) x.win.step(); const empty = aim(x.p).target;
  x.sh.set({ segments: segs, closed: false, start }); for (let i = 0; i < 80; i++) x.win.step(); const placed = aim(x.p).target, head = x.p.view().track.path.head.pos;
  x.p.clearGhost(); for (let i = 0; i < 30; i++) x.win.step(); const still = aim(x.p).target;
  console.log('V5', JSON.stringify({ empty: empty.map((v) => +v.toFixed(2)), placed: placed.map((v) => +v.toFixed(2)), head, still: still.map((v) => +v.toFixed(2)) }));
  assert.ok(placed[2] > 40, 'with a piece placed the camera looks past the piece head (+z), not at the start');
  assert.ok(near(placed, still, 1e-6), 'clearing a ghost with a piece placed does not fall back to the start');
});
test('V6 Shift-sprint and the lens (Ctrl+wheel) on the empty track: both act on the next frame', () => {
  const x = live({ segments: [], closed: false, start: { pos: [0, 0, 0], theta: 0, p: 0 } });
  const fov0 = x.p.rig.fov; x.wheel({ deltaY: -100, ctrlKey: true }); x.win.step();
  x.key('keydown', { key: 'w', code: 'KeyW', shiftKey: true }); x.win.step(); const e0 = x.p.rig.free.state().eye.slice(); x.win.step(); x.win.step(); const e1 = x.p.rig.free.state().eye;
  console.log('V6', JSON.stringify({ fov0, fov1: x.p.rig.fov, mode: x.p.rig.mode, moved: +Math.hypot(...e1.map((v, i) => v - e0[i])).toFixed(3) }));
  assert.ok(x.p.rig.fov < fov0, 'the lens moved'); assert.equal(x.p.rig.mode, 'free'); assert.ok(Math.hypot(...e1.map((v, i) => v - e0[i])) > 0);
});
