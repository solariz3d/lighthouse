// D188 (pane E, non-author): key combos A did not script, on A's per-axis movement, run against env TREE (my copy e-d188-wt, or
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
console.log('the free view inherits pitch ' + (live().p.rig.free.state().pitch * 180 / Math.PI).toFixed(2) + '° from the build view');   // one frame of W alone (m)

// ── the combos ──
test('W+D: diagonal, EXACTLY (W + D)/√2 in direction, and 1.0× a straight line in speed (measured)', () => {
  const w = moveOf(['w']), d = moveOf(['d']), wd = moveOf(['w', 'd']);
  assert.ok(close(unit(wd), unit([w[0] + d[0], w[1] + d[1], w[2] + d[2]])), 'direction');
  assert.ok(Math.abs(len(wd) / STRAIGHT - 1) < 1e-12, `speed ${len(wd) / STRAIGHT}× straight`);
});
test('W+D on a view pitched down 40°: still 1.0× (forward follows the pitch, right stays horizontal, so they are perpendicular)', () => {
  const p = -40 * Math.PI / 180, wd = moveOf(['w', 'd'], p), w = moveOf(['w'], p);
  assert.ok(Math.abs(len(wd) / len(w) - 1) < 1e-12, `${len(wd) / len(w)}×`);
});
test('A+W, S+D, S+A (each diagonal): 1.0× straight', () => {
  for (const ks of [['a', 'w'], ['s', 'd'], ['s', 'a']]) { const m = moveOf(ks); assert.ok(Math.abs(len(m) / STRAIGHT - 1) < 1e-12, `${ks}: ${len(m) / STRAIGHT}×`); }
});
test('W+S: the newer (S) wins, no stand-still; S+W: W wins', () => {
  assert.ok(close(moveOf(['w', 's']), moveOf(['s'])), 'W then S → S');
  assert.ok(close(moveOf(['s', 'w']), moveOf(['w'])), 'S then W → W');
});
test('A+D and Q+E (the other two axes, both keys): the newer wins, no stand-still', () => {
  assert.ok(close(moveOf(['a', 'd']), moveOf(['d']))); assert.ok(close(moveOf(['d', 'a']), moveOf(['a'])));
  assert.ok(close(moveOf(['q', 'e']), moveOf(['e']))); assert.ok(close(moveOf(['e', 'q']), moveOf(['q'])));
});
test('W+D+S: S (newer on forward/back) with D, diagonal at 1.0×; release S → W+D; release D → W', () => {
  const x = live(); for (const k of ['w', 'd', 's']) x.key('keydown', K(k)); x.win.step();
  assert.ok(close(step(x), moveOf(['s', 'd'])), 'S+D');
  x.key('keyup', K('s')); assert.ok(close(step(x), moveOf(['w', 'd'])), 'released S → W+D');
  x.key('keyup', K('d')); assert.ok(close(step(x), moveOf(['w'])), 'released D → W');
  x.key('keyup', K('w')); assert.equal(len(step(x)), 0, 'all released → still');
});
test('press/release orders: D, W, release D → W straight; W, D, release W → D straight; W, S, D, release S → W+D', () => {
  let x = live(); x.key('keydown', K('d')); x.key('keydown', K('w')); x.win.step(); x.key('keyup', K('d')); assert.ok(close(step(x), moveOf(['w'])));
  x = live(); x.key('keydown', K('w')); x.key('keydown', K('d')); x.win.step(); x.key('keyup', K('w')); assert.ok(close(step(x), moveOf(['d'])));
  x = live(); for (const k of ['w', 's', 'd']) x.key('keydown', K(k)); x.win.step(); x.key('keyup', K('s')); assert.ok(close(step(x), moveOf(['w', 'd'])));
});
test('the handover on release: W held, S pressed (S wins), S released → W resumes (the older key comes back)', () => {
  const x = live(); x.key('keydown', K('w')); x.key('keydown', K('s')); x.win.step(); assert.ok(close(step(x), moveOf(['s'])));
  x.key('keyup', K('s')); assert.ok(close(step(x), moveOf(['w'])));
});

// ── auto-repeat mid-combo ──
test('auto-repeat mid-combo: W, S held (S wins); W auto-repeats ×5: S still wins (a repeat keeps its place)', () => {
  const x = live(); x.key('keydown', K('w')); x.key('keydown', K('s')); x.win.step();
  for (let i = 0; i < 5; i++) x.key('keydown', K('w', { repeat: true }));
  assert.ok(close(step(x), moveOf(['s'])));
});
test('auto-repeat mid-combo: W+D held, both auto-repeating, interleaved: still the same diagonal at 1.0×', () => {
  const x = live(); x.key('keydown', K('w')); x.key('keydown', K('d')); x.win.step();
  for (let i = 0; i < 4; i++) { x.key('keydown', K('d', { repeat: true })); x.key('keydown', K('w', { repeat: true })); }
  const m = step(x); assert.ok(close(m, moveOf(['w', 'd'])), 'same diagonal'); assert.ok(Math.abs(len(m) / STRAIGHT - 1) < 1e-12);
});

// ── blur, and Enter / Esc in a field ──
test('blur with W+D+S held: everything stops, and after focus returns only NEW presses move', () => {
  const x = live(); for (const k of ['w', 'd', 's']) x.key('keydown', K(k)); x.win.step(); x.blur();
  assert.equal(len(step(x)), 0, 'stopped'); assert.equal(len(step(x)), 0, 'still stopped');
  x.key('keydown', K('d')); assert.ok(close(step(x), moveOf(['d'])), 'only D, freshly pressed');
});
test('Esc in a text field while W is held (pressed in the view): the field lets go of focus, W keeps flying; W released in the field stops it', () => {
  const x = live(); x.key('keydown', K('w')); x.win.step();
  const field = Object.create(FIELD); x.key('keydown', { key: 'Escape', code: 'Escape', target: field });
  assert.ok(field.blurred, 'the field was blurred'); assert.ok(close(step(x), moveOf(['w'])), 'W still flies');
  x.key('keyup', { key: 'w', code: 'KeyW', target: field }); assert.equal(len(step(x)), 0, 'released in the field → stopped');
});
test('Enter in a text field while W+D are held: W+D keep flying at 1.0×; D typed INTO the field is not a move key', () => {
  const x = live(); x.key('keydown', K('w')); x.win.step();
  const field = Object.create(FIELD); x.key('keydown', { key: 'd', code: 'KeyD', target: field });
  assert.ok(close(step(x), moveOf(['w'])), 'D typed in a field is typing, not flying');
  x.key('keydown', { key: 'Enter', code: 'Enter', target: field }); assert.ok(field.blurred);
  assert.ok(close(step(x), moveOf(['w'])), 'W still flies after Enter');
});

// ── two keys in the same frame ──
test('two keys pressed in the SAME frame (W and D between frames): the first frame after is already the diagonal', () => {
  const x = live(); x.key('keydown', K('w')); x.key('keydown', K('d'));
  const e0 = x.p.rig.free.state().eye; x.win.step(); const first = sub(x.p.rig.free.state().eye, e0);
  assert.ok(close(first, moveOf(['w', 'd'])), 'diagonal on the first frame');
});
test('W and S in the SAME frame: event order decides (the later wins), both orders', () => {
  let x = live(); x.key('keydown', K('w')); x.key('keydown', K('s')); let e0 = x.p.rig.free.state().eye; x.win.step(); assert.ok(close(sub(x.p.rig.free.state().eye, e0), moveOf(['s'])));
  x = live(); x.key('keydown', K('s')); x.key('keydown', K('w')); e0 = x.p.rig.free.state().eye; x.win.step(); assert.ok(close(sub(x.p.rig.free.state().eye, e0), moveOf(['w'])));
});

// ── Shift's ramp on a diagonal ──
test('Shift ramp on a diagonal: every frame of W+D+Shift moves exactly as far as W+Shift (8 frames, through the ×4→×20 ramp)', () => {
  const a = live(), b = live(), S = { key: 'Shift', code: 'ShiftLeft', shiftKey: true, ...VIEW };
  a.key('keydown', S); a.key('keydown', K('w', { shiftKey: true }));
  b.key('keydown', S); b.key('keydown', K('w', { shiftKey: true })); b.key('keydown', K('d', { shiftKey: true }));
  const rows = [];
  for (let i = 0; i < 8; i++) { const ma = len(step(a)), mb = len(step(b)); rows.push(mb / ma); assert.ok(Math.abs(mb / ma - 1) < 1e-12, `frame ${i}: ${mb / ma}`); }
  assert.ok(len(step(a)) > 4 * STRAIGHT, 'the ramp is running');
});

// ── the ruled case: W or S with Q or E on a pitched view ──
test('RULED: W+E on a view pitched p, measured, equals √(2 + 2·sin p)/√2 of a straight line (≈0.54× at −45°), at 0°, −22°, −45°, −60°, −89°', () => {
  const rows = [];
  for (const deg of [0, -22, -45, -60, -89]) {
    const p = deg * Math.PI / 180, w = len(moveOf(['w'], p)), we = len(moveOf(['w', 'e'], p)), want = Math.sqrt(2 + 2 * Math.sin(p)) / Math.SQRT2;
    const x = live(); pitchTo(x, p); assert.ok(Math.abs(x.p.rig.free.state().pitch - p) < 1e-12, `pitch reached ${x.p.rig.free.state().pitch} for ${p}`);
    rows.push(`${deg}°: ${(we / w).toFixed(4)}× (formula ${want.toFixed(4)})`);
    assert.ok(Math.abs(we / w - want) < 1e-9, rows.at(-1));
  }
  console.log('W+E on a pitched view: ' + rows.join(' · '));
});
