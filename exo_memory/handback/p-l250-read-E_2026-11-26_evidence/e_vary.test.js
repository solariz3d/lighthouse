// e_vary.test.js (pane E, L250 read; scratch, never committed): what the authors' rows fixed, varied. Run from the tree under test:
//   node --test <this file>   with T180_TREE=<worktree>
// Reuses app/test/reference-panel.test.js's own stand-ins by loading that file's helpers (its tests are not run: node:test is stubbed while it loads).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const Module = require('module');
const TREE = path.resolve(process.env.T180_TREE || '.');
const T = (p) => path.join(TREE, p);

// load the authors' test file for its helpers, with node:test stubbed so its own tests are not registered
const src = require('fs').readFileSync(T('app/test/reference-panel.test.js'), 'utf8')
  + '\nmodule.exports = { aiLine, ringRoad, TRACKS, nativeOf, fakeDoc, headless, wire, setup, memStorage, optionsOf, LAP };\n';
const m = new Module(T('app/test/reference-panel.test.js'), module);
m.filename = T('app/test/reference-panel.test.js'); m.paths = Module._nodeModulePaths(path.dirname(m.filename));
const realReq = m.require.bind(m);
m.require = (id) => (id === 'node:test' ? () => {} : realReq(id));
m._compile(src, m.filename);
const H = m.exports;
const { createReferencePanel } = require(T('app/reference/panel.js'));
const { createCoreShell } = require(T('app/core/coreshell.js'));

/** setup with a native whose road reads can be held too (the authors' gate holds only the line) */
async function setupHeld(entries = H.TRACKS) {
  const s = await createCoreShell({ brushFn: null, autosaveMs: 0 });
  const p = H.headless(s), { doc, root } = H.fakeDoc(), native = H.nativeOf(entries.map((e) => ({ ...e })));
  const roadGate = new Map(), inner = native.call;
  const call = async (cmd, args) => { if (cmd === 'read_reference_road' && roadGate.has(args.layout + '|' + args.track)) await roadGate.get(args.layout + '|' + args.track); return inner(cmd, args); };
  H.wire(doc, p);
  const panel = createReferencePanel({ doc, root, call });
  await panel.open();
  return { s, p, panel, root, native, roadGate };
}
const held = () => { let open; const pr = new Promise((r) => { open = r; }); return [pr, open]; };
const say = (label, panel, p) => { const st = panel.state(), r = p.reference(); console.log(`${label}: mode=${st.mode} kind=${st.kind} picked=${JSON.stringify(st.picked)} drawn=${r ? `yes (${Math.round(r.lengthM)} m line)` : 'no'} error=${JSON.stringify(st.error)} readout=${JSON.stringify(st.readout)}`); return st; };

// ── 3. a pick changed while another is still reading ──

test('V3a (Road): a later pick wins over an earlier one whose ROAD read is still out', async () => {
  const { p, panel, roadGate } = await setupHeld();
  await panel.setMode('road');
  const [pr, open] = held(); roadGate.set('|reference track 1', pr);
  const slow = panel.pick('reference track 1', '');
  await panel.pick('reference track 2', '');
  open(); await slow;
  const st = say('V3a', panel, p);
  assert.equal(st.picked, 'reference track 2\u0000'); assert.equal(st.kind, 'road');
  assert.ok(Math.abs(p.reference().lengthM - 300 * 2 * 150 * Math.sin(Math.PI / 300)) < 0.01, 'track 2 is the one drawn');
});

test('V3b: nothing shown; a pick still reading, then the mode changed to Road: what is drawn is in the mode the panel names', async () => {
  const { p, panel, native } = await setupHeld();
  const [pr, open] = held(); native.gate.set('', pr);   // every main layout's line read is held
  const slow = panel.pick('reference track 2', '');
  const mode = panel.setMode('road');
  open(); await slow; await mode;
  const st = say('V3b', panel, p);
  assert.equal(st.mode, 'road', 'the panel says Road');
  assert.equal(st.kind, 'road', 'and draws Road');
});

test('V3c: A shown; B picked and still reading; the mode changed to Road: B is drawn as Road (his last pick and his last mode)', async () => {
  const { p, panel, native } = await setupHeld();
  await panel.pick('reference track 2', '');
  const [pr, open] = held(); native.gate.set('two', pr);
  const slow = panel.pick('reference track 1', 'two');
  const mode = panel.setMode('road');
  open(); await slow; await mode;
  const st = say('V3c', panel, p);
  assert.equal(st.mode, 'road');
  assert.equal(st.picked, 'reference track 1\u0000two', 'his last pick');
});

test('V3d: a pick still reading, then Clear: nothing is drawn when it lands', async () => {
  const { p, panel, native } = await setupHeld();
  const [pr, open] = held(); native.gate.set('two', pr);
  const slow = panel.pick('reference track 1', 'two');
  await panel.clear();
  open(); await slow;
  const st = say('V3d', panel, p);
  assert.equal(p.reference(), null); assert.equal(st.picked, null);
});

// ── 4. the nudge at large values ──

test('V4: the nudge at large values: what the preview draws and what the panel says', async () => {
  const { s, p, panel } = await setupHeld();
  s.extend({ length: 120 }); p.step();
  await panel.pick('reference track 2', '');
  const at0 = p.reference().start;
  for (const n of [{ dx: 1e5 }, { dx: 1e7 }, { dz: -1e9 }, { yawDeg: 1e12 }, { dx: 3.5e38 }, { dx: 1e39 }]) {
    const info = await panel.setNudge({ dx: 0, dz: 0, dy: 0, yawDeg: 0, ...n });
    const r = p.reference(), M = require(T('src/reference/ribbon.js')).placeAt;
    const f32 = new Float32Array(M({ start: { pos: [0, 0, 0], T: [0, 0, 1] } }, { pos: [0, 0, 0], T: [0, 0, 1] }, { dx: 0, dz: 0, dy: 0, yawDeg: 0, ...n }));
    console.log(`V4 ${JSON.stringify(n)}: reply=${info && info.error ? `ERROR ${info.error}` : 'ok'} start=${r ? r.start.map((v) => v.toPrecision(4)).join(',') : 'none'} model-as-f32 finite=${[...f32].every(Number.isFinite)} panel.error=${JSON.stringify(panel.state().error)}`);
  }
  // a nudge the preview refuses (not a finite number): reached only through setNudge, since a number input sanitises "1e400" to empty in a browser
  const before = p.reference().start;
  const info = await panel.setNudge({ dx: Infinity });
  const st = panel.state();
  console.log(`V4 {dx: Infinity}: reply=${JSON.stringify(info)} drawn start=${p.reference() ? p.reference().start.map((v) => v.toPrecision(4)).join(',') : 'none'} panel.nudge.dx=${st.nudge.dx} panel.error=${JSON.stringify(st.error)} readout=${JSON.stringify(st.readout)}`);
  // and then a NEW pick, with the refused nudge still held by the panel
  await panel.pick('reference track 1', '');
  const after = panel.state();
  console.log(`V4 then pick track 1: picked=${JSON.stringify(after.picked)} drawn lengthM=${p.reference() ? Math.round(p.reference().lengthM) : 'none'} (track 1 is 1257, track 2 is 942) error=${JSON.stringify(after.error)} readout=${JSON.stringify(after.readout)}`);
  assert.ok(at0 && before);
  assert.ok(Math.abs(p.reference().lengthM - 1257) < 1, 'the panel names track 1: track 1 is what is drawn');
});

// ── 1. a layout with no AI line ──

test('V1: a layout with no AI line, in Road mode and through pick(): listed greyed, refused in words', async () => {
  const { p, panel, root } = await setupHeld();
  await panel.setMode('road');
  const o = H.optionsOf(panel, root).find((x) => x.text.startsWith('reference track 5'));
  console.log(`V1 option in Road: ${JSON.stringify(o)}; readout ${JSON.stringify(panel.state().readout)}`);
  await panel.pick('reference track 2', '');
  await panel.pick('reference track 5', '');
  const st = say('V1 pick() of it', panel, p);
  assert.equal(p.reference(), null, 'nothing drawn'); assert.ok(o.disabled);
});

// ── 5. a save and an export, varied: the autosave and the share code ──

test('V5: the autosave and the share code are the same with a reference shown, Line and Road', async () => {
  for (const mode of ['line', 'road']) {
    const writes = [];
    const storage = Object.assign(H.memStorage(), { saveAutosave: async (pl) => { writes.push(JSON.stringify(pl)); } });
    const s = await createCoreShell({ brushFn: null, storage, autosaveMs: 1 });
    const p = H.headless(s), { doc, root } = H.fakeDoc(), native = H.nativeOf(H.TRACKS);
    H.wire(doc, p);
    const panel = createReferencePanel({ doc, root, call: native.call }); await panel.open();
    s.extend({ length: 150 }); s.extend({ length: 80, targets: { kh: 1 / 200 } }); p.step();
    await s.flushAutosave(); const a = writes[writes.length - 1], codeA = JSON.stringify(s.exportDoc());
    await panel.setMode(mode); await panel.pick('reference track 2', ''); await panel.setNudge({ dx: 9, yawDeg: 20 }); p.step();
    const n = writes.length;
    await s.flushAutosave(); const b = writes[writes.length - 1], codeB = JSON.stringify(s.exportDoc());
    console.log(`V5 ${mode}: autosaves ${writes.length} (${writes.length - n} after the reference), same autosave=${a === b}, same share doc=${codeA === codeB}, mentions reference=${/reference/i.test(b)}`);
    assert.equal(a, b); assert.equal(codeA, codeB);
  }
});

// the same two races where a person can reach them: the slow read is the ROAD's (O measured 159 ms median, 941 ms most, warm, before any IPC)
test('V3e: A shown as Road; B picked, its road still reading; the mode changed to Line: B is drawn (his last pick), as Line', async () => {
  const { p, panel, roadGate } = await setupHeld();
  await panel.setMode('road'); await panel.pick('reference track 2', '');
  const [pr, open] = held(); roadGate.set('|reference track 1', pr);
  const slow = panel.pick('reference track 1', '');
  const mode = panel.setMode('line');
  open(); await slow; await mode;
  const st = say('V3e', panel, p);
  assert.equal(st.picked, 'reference track 1\u0000', 'his last pick'); assert.equal(st.kind, 'line');
});

test('V3f: nothing shown, Road; B picked, its road still reading; the mode changed to Line: what is drawn is in the mode the panel names', async () => {
  const { p, panel, roadGate } = await setupHeld();
  await panel.setMode('road');
  const [pr, open] = held(); roadGate.set('|reference track 2', pr);
  const slow = panel.pick('reference track 2', '');
  const mode = panel.setMode('line');
  open(); await slow; await mode;
  const st = say('V3f', panel, p);
  assert.equal(st.mode, 'line'); assert.equal(st.kind, 'line', 'drawn as the panel says');
});
