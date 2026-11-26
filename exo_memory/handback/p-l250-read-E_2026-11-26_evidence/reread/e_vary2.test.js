// e_vary2.test.js (pane E, L250 RE-READ; scratch, never committed): the repair varied by paths B's rows do not take. Run from the tree under test:
//   T180_TREE=<worktree> node --test <this file>
// Loads app/test/reference-panel.test.js's own stand-ins (its tests are not registered: node:test is stubbed while it loads).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const Module = require('module');
const TREE = path.resolve(process.env.T180_TREE || '.');
const T = (p) => path.join(TREE, p);
const src = require('fs').readFileSync(T('app/test/reference-panel.test.js'), 'utf8')
  + '\nmodule.exports = { aiLine, ringRoad, TRACKS, setup, optionsOf, held, lapM };\n';
const m = new Module(T('app/test/reference-panel.test.js'), module);
m.filename = T('app/test/reference-panel.test.js'); m.paths = Module._nodeModulePaths(path.dirname(m.filename));
const realReq = m.require.bind(m); m.require = (id) => (id === 'node:test' ? () => {} : realReq(id));
m._compile(src, m.filename);
const H = m.exports;
const say = (label, panel, p) => { const st = panel.state(), r = p.reference(); console.log(`${label}: mode=${st.mode} kind=${st.kind} picked=${JSON.stringify(st.picked)} drawn=${r ? `yes (${r.lengthM ? Math.round(r.lengthM) + ' m line' : 'road by start'})` : 'no'} error=${JSON.stringify(st.error)}`); return st; };
// a layout with no AI line whose kn5 names a start (as kn5road.rs sends it): AC_START_0 0.8 m above a ring of road
const NOAI = { track: 'reference track 7', layout: '', bytes: null, road: H.ringRoad(200, 12, 300, { start: { pos: [200, 0.8, 1], T: [0, 0, 1], from: 'AC_START_0' } }) };
const WITH7 = [...H.TRACKS, NOAI];
const K = (t, l = '') => `${t}\u0000${l}`;

// ── 1. the race, by paths B's rows do not take ──

test('V3g: three acts in a row, every read held: pick A (Line), change to Road, pick B: B is drawn, as Road', async () => {
  const { p, panel, native } = await H.setup();
  const [pr, open] = H.held(); native.gate.set('', pr);   // every main layout's line read is held
  const a = panel.pick('reference track 2', '');
  const mode = panel.setMode('road');
  const b = panel.pick('reference track 1', '');
  open(); await a; await mode; await b;
  const st = say('V3g', panel, p);
  assert.deepEqual([st.picked, st.mode, st.kind], [K('reference track 1'), 'road', 'road']);
  assert.ok(Math.abs(p.reference().lengthM - H.lapM(200, 400)) < 0.01, 'track 1 is what is drawn');
});

test('V3h: pick A (Line, held), change to Road, change back to Line: A is drawn, as Line', async () => {
  const { p, panel, native } = await H.setup();
  const [pr, open] = H.held(); native.gate.set('', pr);
  const a = panel.pick('reference track 2', '');
  const m1 = panel.setMode('road'); const m2 = panel.setMode('line');
  open(); await a; await m1; await m2;
  const st = say('V3h', panel, p);
  assert.deepEqual([st.picked, st.mode, st.kind], [K('reference track 2'), 'line', 'line']);
});

test('V3h2: A shown as Road; pick B (its road held); Line; back to Road: B is drawn, as Road', async () => {
  const { p, panel, native } = await H.setup();
  await panel.setMode('road'); await panel.pick('reference track 2', '');
  const [pr, open] = H.held(); native.roadGate.set(K('reference track 1'), pr);
  const b = panel.pick('reference track 1', '');
  const m1 = panel.setMode('line'); const m2 = panel.setMode('road');
  open(); await b; await m1; await m2;
  const st = say('V3h2', panel, p);
  assert.deepEqual([st.picked, st.mode, st.kind], [K('reference track 1'), 'road', 'road']);
});

// ── a mode change while a START-PLACED road is reading, or shown (a layout with no AI line) ──

test('V3i: Road; a layout with no AI line picked, its road still reading; changed to Line: what is drawn and said; then back to Road', async () => {
  const { p, panel, native, root } = await H.setup({ entries: WITH7 });
  await panel.setMode('road');
  const [pr, open] = H.held(); native.roadGate.set(K('reference track 7'), pr);
  const slow = panel.pick('reference track 7', '');
  const mode = panel.setMode('line');
  open(); await slow; await mode;
  const st = say('V3i in Line', panel, p);
  const o = H.optionsOf(panel, root).find((x) => x.text.startsWith('reference track 7'));
  console.log(`V3i option in Line: ${JSON.stringify(o)}; readout ${JSON.stringify(st.readout)}; line reads asked ${native.calls.filter((c) => c === 'read_reference_line').length}`);
  await panel.setMode('road');
  const back = say('V3i back in Road', panel, p);
  const o2 = H.optionsOf(panel, root).find((x) => x.text.startsWith('reference track 7'));
  console.log(`V3i option back in Road: ${JSON.stringify(o2)}`);
  assert.equal(p.reference() === null || back.kind === 'road', true);
  assert.doesNotMatch(st.readout, /never drawn in part/, 'in Line, a layout with no AI line is not called damaged');
});

test('V3j: a layout with no AI line SHOWN as Road; changed to Line, then back to Road', async () => {
  const { p, panel, native, root } = await H.setup({ entries: WITH7 });
  await panel.setMode('road'); await panel.pick('reference track 7', '');
  say('V3j shown in Road', panel, p);
  await panel.setMode('line');
  const st = say('V3j in Line', panel, p);
  await panel.setMode('road');
  const back = say('V3j back in Road', panel, p);
  console.log(`V3j: line reads asked ${native.calls.filter((c) => c === 'read_reference_line').length}; Line readout ${JSON.stringify(st.readout)}`);
  assert.doesNotMatch(st.readout, /never drawn in part/, 'in Line, a layout with no AI line is not called damaged');
  assert.equal(back.picked, K('reference track 7'), 'back in Road, his pick is drawn again, as a layout with a line is');
});

// ── 3. V1, replaced: the contract after b26db76 ──

test('V1n (replaces V1): a layout with no AI line: in Line listed greyed "(no AI line)"; in Road listed "(no AI line: placed by its start)", drawn by its start on his start, no line read', async () => {
  const { s, p, panel, native, root } = await H.setup({ entries: WITH7 });
  s.extend({ length: 120 }); p.step();
  const opt = () => H.optionsOf(panel, root).find((x) => x.text.startsWith('reference track 7'));
  assert.deepEqual([opt().text, opt().disabled], ['reference track 7 (no AI line)', true], 'Line');
  await panel.setMode('road');
  assert.deepEqual([opt().text, opt().disabled], ['reference track 7 (no AI line: placed by its start)', false], 'Road');
  const before = native.calls.length;
  await panel.pick('reference track 7', '');
  const st = say('V1n', panel, p), r = p.reference();
  assert.deepEqual([st.kind, st.picked], ['road', K('reference track 7')]);
  assert.deepEqual(r.start.map((v) => +v.toFixed(9)), r.anchor.pos.map((v) => +v.toFixed(9)), 'its start on his start');
  assert.deepEqual(native.calls.slice(before), ['read_reference_road'], 'its road only: no line read');
  assert.match(st.readout, /placed by its kn5's start \(AC_START_0\): it has no AI line/);
});
