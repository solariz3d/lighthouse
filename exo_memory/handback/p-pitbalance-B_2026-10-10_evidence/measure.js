// measure.js (pane B, D285 part 2): where the pit boxes sit in the pit lane, through the app's core shell (spawnsInfo = what the panel, the preview and the
// export place). For each case: the lane's parts (entry taper, usable straight, exit taper) in lane s, every box's lane s, the gap before the first box
// (entry end -> nearest box edge) and after the last (farthest box edge -> exit start), and any box on a taper.
//   T180_ROOT=<tree> node measure.js <keeper autosave doc copy>
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = process.env.T180_ROOT;
const CS = require(path.join(ROOT, 'app/core/coreshell.js'));
const PANEL = require(path.join(ROOT, 'app/core/panel.js'));
const D = require(path.join(ROOT, 'src/core/document.js'));
const { buildPitLane } = require(path.join(ROOT, 'src/geom/pitlane.js'));
const { buildPath } = require(path.join(ROOT, 'src/geom/index.js'));
const { SLOT_HALF_LENGTH } = require(path.join(ROOT, 'src/markers/layout.js'));

function measure(label, shell) {
  const st = shell.getState(), d = st.history.present, sr = st.resolved;
  const info = shell.spawnsInfo();
  const p0 = buildPath(sr.segments, { step: 2, closed: !!d.closed, ...(sr.start ? { start: sr.start } : {}) }), p = sr.lift ? sr.lift(p0) : p0;
  const { boxes, boxSpacingM, ...road } = d.pitLane, lane = buildPitLane(p, sr.segments, road);
  const len = (part) => lane.segments.find((g) => g.part === part).length;
  const b0 = len('in'), b1 = b0 + len('body'), L = lane.path.lengthM;
  const pits = info.placed.filter((m) => /^AC_PIT_/.test(m.name)).map((m) => ({ n: m.n, s: +m.s.toFixed(2), err: m.error || undefined }));
  const ss = pits.map((x) => x.s), lo = Math.min(...ss) - SLOT_HALF_LENGTH, hi = Math.max(...ss) + SLOT_HALF_LENGTH;
  const onTaper = pits.filter((x) => x.s - SLOT_HALF_LENGTH < b0 - 1e-6 || x.s + SLOT_HALF_LENGTH > b1 + 1e-6).map((x) => x.n);
  const first = pits.reduce((a, x) => (x.s < a.s ? x : a)), mid = L / 2;
  const red = (info.check && info.check.checks || []).filter((c) => !c.ok).map((c) => c.id + ': ' + c.problems.join('; '));
  console.log(JSON.stringify({ label, boxes, spacing: boxSpacingM, lane: { length: +L.toFixed(2), mid: +mid.toFixed(2), usable: [+b0.toFixed(2), +b1.toFixed(2)] },
    box0_s: pits.find((x) => x.n === 0).s, first_reached: first.n, s_range: [Math.min(...ss), Math.max(...ss)],
    gap_before_first: +(lo - b0).toFixed(2), gap_after_last: +(b1 - hi).toFixed(2), on_taper: onTaper, red }));
  return { pits, b0, b1, mid };
}

(async () => {
  for (const n of [2, 6, 12]) {
    const s = await CS.createCoreShell({ storage: null, autosaveMs: 0, brushFn: null });
    s.extend(PANEL.extendOptions({ length: 1200, turn: 0, width: 24, empty: true }));
    s.setPitLane({ side: 'R', leave: { word: 'p1', along: 100 }, rejoin: { word: 'p1', along: 900 }, offsetM: 7.5, width: 10, divergeM: 79, mergeM: 79, speedKmh: 80, boxes: n, boxSpacingM: 24 });
    measure(`fresh 1200 m, lane 100..900, ${n} boxes`, s);
  }
  if (process.argv[2]) {
    const store = { docs: new Map(), saveDoc: async (k, t) => store.docs.set(k, t), openDoc: async (k) => store.docs.get(k), listDocs: async () => [...store.docs.keys()], openUndo: async () => undefined, saveUndo: async () => {} };
    await store.saveDoc(CS.PREFIX + 'K', D.serialize(D.parse(fs.readFileSync(process.argv[2], 'utf8'))));
    const s = await CS.createCoreShell({ storage: store, autosaveMs: 0, brushFn: null }); await s.open('K');
    measure("keeper's autosave (COPY, 05:45)", s);
  }
})();
