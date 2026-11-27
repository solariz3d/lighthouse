// D678 repair, item 1's gate on his largest closed lap (by road length) from the copies in DIR, on the tree TREE (the branch after the change):
//   - the release (endSculpt) through the real shell, three times (begin, one drag step, release, Undo), each timed: the gate is 1,000 ms;
//   - from the release to the sentence landing (whenEvenChecked; with no runner the job runs on the page in a timer, as in a page with no Worker);
//   - the job alone (evenwords.js evenCheck, what the worker spends), three times; and whether its words equal the whole-track check's (evenWords, no window);
//   - Even's own time (three runs) and its profile; one drag step (five) and its profile; a typed width (evenRun) three times.
// Prints milliseconds, counts and booleans only: no name, no place, no geometry, no words. Usage: node prof678g.js TREE DIR
'use strict';
const fs = require('fs'), path = require('path'), inspector = require('inspector');
const TREE = process.argv[2], DIR = process.argv[3];
const D = require(path.join(TREE, 'src/core/document.js')), SC = require(path.join(TREE, 'src/core/sculpt.js'));
const EV = require(path.join(TREE, 'src/core/even.js'));
const EW = require(path.join(TREE, 'app/core/evenwords.js'));
const { createCoreShell } = require(path.join(TREE, 'app/core/coreshell.js'));

const T = () => process.hrtime.bigint(), ms = (a, b) => +(Number(b - a) / 1e6).toFixed(1);
const docs = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^t\d+\.track$/.test(x))) {
  try { const d = D.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); const off = SC.pieceOffsets(d), n = d.pieces.length; docs.push({ f, d, L: off[n - 1] + (d.pieces[n - 1].length || 0) }); } catch (e) { /* a refused file is U5's */ }
}
docs.sort((a, b) => b.L - a.L);
const { d, L } = docs[0], n = d.pieces.length;
let pick = null;
for (let k = 0; k < n && pick === null; k++) for (const sgn of [1, -1]) { const p = Math.floor(n / 2) + sgn * k; if (p < 0 || p + 1 >= n) continue; try { EV.evenWindow(d, { from: p, to: p + 1 }); pick = p; break; } catch (e) { /* next */ } }
const w = D.channelAt(d.pieces[pick], 'w', 0).v, value = Math.round((w + 1) * 2) / 2;
const out = { roadM: Math.round(L), pieces: n, closed: !!d.closed, runPieces: 2 };

function profile(fn) {
  const s = new inspector.Session(); s.connect();
  const post = (m, p) => new Promise((ok, no) => s.post(m, p || {}, (e, r) => (e ? no(e) : ok(r))));
  return (async () => {
    await post('Profiler.enable'); await post('Profiler.setSamplingInterval', { interval: 200 }); await post('Profiler.start');
    fn();
    const { profile: P } = await post('Profiler.stop'); s.disconnect();
    const byId = new Map(P.nodes.map((x) => [x.id, x])), dt = new Map();
    for (let i = 0; i < P.samples.length; i++) dt.set(P.samples[i], (dt.get(P.samples[i]) || 0) + (P.timeDeltas[i] || 0) / 1000);
    const WANT = ['evenIn', 'passClearanceGuard', 'passClearance', 'resolvedOf', 'toSegments', 'rimReader', 'levelTo', 'fitChannel', 'solve', 'bankPlan', 'settle', 'checkDoc', 'restOf', 'routeMovedDetail', 'dragTo'];
    const parent = new Map(); for (const x of P.nodes) for (const c of x.children || []) parent.set(c, x.id);
    const incl = {};
    for (const [id, t] of dt) {
      const seen = new Set();
      for (let q = id; q !== undefined; q = parent.get(q)) { const fnn = byId.get(q).callFrame.functionName; for (const wnt of WANT) if (fnn === wnt && !seen.has(wnt)) { seen.add(wnt); incl[wnt] = (incl[wnt] || 0) + t; } }
    }
    const total = [...dt.values()].reduce((a, b) => a + b, 0);
    return { sampledMs: +total.toFixed(0), inclusiveMs: Object.fromEntries(Object.entries(incl).map(([k, v]) => [k, +v.toFixed(0)]).sort((a, b) => b[1] - a[1])) };
  })();
}

(async () => {
  // ── Even's own time ──
  const ev = () => EV.even(d, { from: pick, to: pick + 1, value, hold: 'left' });
  const evMs = []; let res = null;
  for (let k = 0; k < 3; k++) { const t0 = T(); res = ev(); evMs.push(ms(t0, T())); }
  out.evenMs = evMs; out.windowM = Math.round(res.window.w1 - res.window.w0);
  out.evenProfile = await profile(ev);

  // ── the release, three times, through the real shell ──
  const sh = await createCoreShell({}); sh.commitDoc(d); sh.setSculpt(true);
  sh.selectPiece(pick); sh.selectPiece(pick + 1, { extend: true });
  out.releaseMs = []; out.toSentenceMs = []; out.stepMs = []; out.pendingAtRelease = []; out.saidLanded = [];
  for (let k = 0; k < 3; k++) {
    sh.beginSculpt({ tool: 'even', hold: 'left' });
    const b = sh.getState().brush; if (!(b && b.mode === 'even')) { out.dragRefused = true; break; }
    let t0 = T(); sh.sculptTo(value - b.value0); out.stepMs.push(ms(t0, T()));
    t0 = T(); sh.endSculpt(); const t1 = T(); out.releaseMs.push(ms(t0, t1));
    out.pendingAtRelease.push(!!sh.getState().evenCheck);
    await sh.whenEvenChecked(); out.toSentenceMs.push(ms(t1, T()));
    out.saidLanded.push(!sh.getState().evenCheck && (sh.getState().message || '').startsWith('Even:'));
    sh.undo(); sh.selectPiece(pick); sh.selectPiece(pick + 1, { extend: true });
  }
  // the drag steps (the frame bars: 20.7 ms a core step, 6.0 ms a page work frame), five, and one step's profile
  sh.beginSculpt({ tool: 'even', hold: 'left' });
  const steps = []; for (const dv of [0.5, 1, 1.5, 2, 1]) { const t0 = T(); sh.sculptTo(dv); steps.push(ms(t0, T())); }
  out.dragStepMs = steps; out.stepProfile = await profile(() => sh.sculptTo(1.5));
  sh.endSculpt(); await sh.whenEvenChecked(); sh.undo();

  // ── the job alone, three times, and its words against the whole-track check's ──
  const req = { before: d, after: res.doc, window: res.window, value: res.value, hold: res.hold };
  out.jobMs = []; let job = null;
  for (let k = 0; k < 3; k++) { const t0 = T(); job = EW.evenCheck(req); out.jobMs.push(ms(t0, T())); }
  let t0 = T(); const whole = EW.evenWords(d, res); out.wholeCheckMs = ms(t0, T());
  out.jobWordsEqualWhole = job.message === whole.message; out.jobLeavesEqualWhole = JSON.stringify(job.leaves) === JSON.stringify(whole.leaves); out.secondSentence = !!whole.leaves;

  // ── a typed width, three times ──
  out.evenRunMs = [];
  for (let k = 0; k < 3; k++) { sh.selectPiece(pick); sh.selectPiece(pick + 1, { extend: true }); t0 = T(); sh.evenRun({ value, hold: 'left' }); out.evenRunMs.push(ms(t0, T())); await sh.whenEvenChecked(); sh.undo(); }
  console.log(JSON.stringify(out));
})().catch((e) => { console.error(e && e.stack); process.exit(1); });
