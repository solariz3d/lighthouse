// repro.js (pane B, D284): does the start line move when a piece is appended? Through the app's core shell (spawnsInfo, what the preview and
// the panel draw) and startLayout (what the export uses when there are no spawns).
//   T180_ROOT=<tree> node repro.js <tracks dir>
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = process.env.T180_ROOT, TRACKS = process.argv[2];
const CS = require(path.join(ROOT, 'app/core/coreshell.js'));
const PANEL = require(path.join(ROOT, 'app/core/panel.js'));
const D = require(path.join(ROOT, 'src/core/document.js'));
const { PACK } = require(path.join(ROOT, 'src/markers/layout.js'));

const PIT = (doc) => ({ side: 'R', leave: { word: doc.pieces[0].id, along: 20 }, rejoin: { word: doc.pieces[0].id, along: 300 }, offsetM: 7.5, width: 10, divergeM: 79, mergeM: 79, speedKmh: 80, boxes: 4, boxSpacingM: 10 });

/** The line as the panel/preview shows it (spawnsInfo's AC_TIME_0 gates) and as the export lays it with no spawns (startLayout). */
function lineOf(shell) {
  const st = shell.getState(), d = st.history.present, out = { pieces: d.pieces.length };
  const info = shell.spawnsInfo();
  if (info && info.placed) {
    const L = info.placed.find((m) => m.name === 'AC_TIME_0_L'), R = info.placed.find((m) => m.name === 'AC_TIME_0_R');
    if (L && R && L.pos && R.pos) out.shown = { mid: L.pos.map((v, k) => +((v + R.pos[k]) / 2).toFixed(3)), word: info.layout.line.word, along: +info.layout.line.along.toFixed(3) };
  } else out.shown = info ? { error: info.error || 'no placed' } : null;
  if (!d.spawns) {
    try { const lay = CS.startLayout(st.resolved.segments, st.resolved.lift, st.resolved.start, { open: !d.closed }); out.auto = { word: lay.line.word, along: +lay.line.along.toFixed(3) }; }
    catch (e) { out.auto = { error: e.code || e.message }; }
  }
  return out;
}

const STEPS = [
  ['Straight', (s) => s.extend(PANEL.extendOptions({ length: 200, turn: 0 }))],
  ['broad turn', (s) => s.extend(PANEL.extendOptions({ length: 200, turn: 30 }))],
  ['Turn by', (s) => s.extendTurnBy(PANEL.extendOptions({ length: 200 }), 60)],
  ['Sharp', (s) => s.extendSharp(PANEL.extendOptions({ length: 100 }), { deg: -90, R: 40, ramp: 4 })],
];

async function run(label, shell) {
  const rows = [{ step: 'start', ...lineOf(shell) }];
  for (const [n, f] of STEPS) { f(shell); const m = shell.getState().message; rows.push({ step: n, msg: m && !/^(extended|added)/i.test(m) ? m : undefined, ...lineOf(shell) }); }
  console.log('== ' + label); for (const r of rows) console.log(JSON.stringify(r));
}

(async () => {
  const fresh = async () => { const s = await CS.createCoreShell({ storage: null, autosaveMs: 0, brushFn: null }); s.extend(PANEL.extendOptions({ length: 400, turn: 0, width: 24, empty: true })); return s; };
  // (a) automatic, with a pit lane so the panel/preview draws it (as the keeper's autosave has)
  { const s = await fresh(); s.setPitLane(PIT(s.getState().history.present)); await run('(a) automatic + pit lane', s); }
  // (a') automatic, no pit lane: the export's choice only
  { const s = await fresh(); await run("(a') automatic, no pit lane (export only)", s); }
  // (b) hand-placed along 100
  { const s = await fresh(); s.setSpawns({ line: { along: 100 }, grid: { count: PACK.count, rowGapM: PACK.rowGapM, colGapM: PACK.colGapM } }); await run('(b) hand-placed along 100', s); }
  // the keeper's tracks, COPIES: one Straight
  for (const f of fs.readdirSync(TRACKS).filter((n) => n.endsWith('.t180track')).sort()) {
    const s = await CS.createCoreShell({ storage: null, autosaveMs: 0, brushFn: null });
    let doc; try { doc = D.parse(fs.readFileSync(path.join(TRACKS, f), 'utf8')); } catch (e) { console.log('== ' + f + ': parse ' + (e.code || e.message)); continue; }
    s.newDoc(); s.getState(); // load by replacing history via open on an in-memory store
    const store = { docs: new Map(), saveDoc: async (n, t) => store.docs.set(n, t), openDoc: async (n) => store.docs.get(n), listDocs: async () => [...store.docs.keys()], openUndo: async () => undefined, saveUndo: async () => {} };
    const s2 = await CS.createCoreShell({ storage: store, autosaveMs: 0, brushFn: null });
    await store.saveDoc(CS.PREFIX + 'X', D.serialize(doc)); await s2.open('X');
    const before = lineOf(s2);
    if (doc.closed) { console.log('== ' + f + ' (closed: no append) ' + JSON.stringify(before)); continue; }
    s2.extend(PANEL.extendOptions({ length: 200, turn: 0 }));
    console.log('== ' + f + ' spawns=' + !!doc.spawns + ' pitLane=' + !!doc.pitLane); console.log(JSON.stringify({ step: 'before', ...before })); console.log(JSON.stringify({ step: '+Straight', msg: s2.getState().message || undefined, ...lineOf(s2) }));
  }
})();
