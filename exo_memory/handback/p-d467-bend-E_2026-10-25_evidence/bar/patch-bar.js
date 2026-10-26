// patch-bar.js (D467 re-ruled after C's review, pane E): the start-pieces try is taken only when its RESULT passes a three-part bar. CRLF kept; each anchor once.
//   app/core/startlayout.js (new): startLayout and its two constants, moved VERBATIM out of coreshell.js so the close job (and its worker) can run the exporter's own
//     start-straight check without loading the shell; coreshell.js requires it and still exports the same names.
//   app/core/closejob.js: runClose({ ..., bar }) checks the result against the bar and refuses it by name (CLOSE_BAR), so the release falls through to D421c's tries.
//   app/core/closerunner.js: `bar` is posted to the worker like `window`.
//   app/core/coreshell.js: the start-pieces try asks for the bar.
'use strict';
const fs = require('fs');
const W = 'C:/Users/nname/Downloads/t180-wt-e467/';
const rd = (rel) => fs.readFileSync(W + rel, 'utf8');
const crlfOf = (raw) => raw.includes('\r\n');
const lf = (raw) => raw.split('\r\n').join('\n');
const wr = (rel, s, crlf) => fs.writeFileSync(W + rel, crlf ? s.split('\n').join('\r\n') : s);
const once = (s, from, to, what) => { const n = s.split(from).length - 1; if (n !== 1) throw new Error(`${what}: anchor found ${n} times: ${from.slice(0, 90)}`); return s.replace(from, () => to); };

// 1. the move
let cs0 = rd('app/core/coreshell.js'); const csCRLF = crlfOf(cs0); let cs = lf(cs0);
const head = '/**\n * THE START STRAIGHT for the export\'s grid, on a core track.';
const i = cs.indexOf(head); if (i < 0 || cs.indexOf(head, i + 1) >= 0) throw new Error('startLayout block head not found once');
const fnHead = 'function startLayout(segments, lift, start, { open = false, base = null } = {}) {';
const j = cs.indexOf(fnHead, i); if (j < 0) throw new Error('startLayout function not found');
const k = cs.indexOf('\n}\n', j); if (k < 0) throw new Error('startLayout end not found');
const moved = cs.slice(i, k + 3);
if (!moved.includes('const STRAIGHT_K = 1 / 5000, STRAIGHT_ROLL = 0.5 * Math.PI / 180;')) throw new Error('the constants are not inside the moved block');
cs = cs.slice(0, i) + "// D467: startLayout and its constants live in app/core/startlayout.js now (moved verbatim), so the close job can run the exporter's start-straight check without the shell\nconst { STRAIGHT_K, startLayout } = require('./startlayout.js');\n" + cs.slice(k + 3);
const SL = `// startlayout.js: the start straight for the export's grid on a core track, and the two constants that say what "nearly straight" is.
// D467 (E): moved VERBATIM out of app/core/coreshell.js, which still requires and exports these names, so that app/core/closejob.js (and the close worker, which never
// loads the shell) can run the exporter's own start-straight check on a close's result.
'use strict';

${moved}
module.exports = { STRAIGHT_K, STRAIGHT_ROLL, startLayout };
`;
if (fs.existsSync(W + 'app/core/startlayout.js')) throw new Error('startlayout.js exists');
wr('app/core/startlayout.js', SL, csCRLF);

// 4. the start-pieces try asks for the bar
cs = once(cs, "    const attempt = (k, rs) => (k === tries.length ? whole(rs) : runCloseJob({ doc: open, window: tries[k] }).then(",
  "    // D467 re-ruled (C's review): the start-pieces try is taken only when its result passes the bar (closejob.js barMiss); a miss is a refusal like any other\n" +
  "    const jobFor = (w) => (w === startTry ? { doc: open, window: w, bar: { base: b.base, edited: win } } : { doc: open, window: w });\n" +
  "    const attempt = (k, rs) => (k === tries.length ? whole(rs) : runCloseJob(jobFor(tries[k])).then(", 'coreshell attempt');
wr('app/core/coreshell.js', cs, csCRLF);

// 2. the bar in the close job
let cj0 = rd('app/core/closejob.js'); const cjCRLF = crlfOf(cj0); let cj = lf(cj0);
cj = once(cj, "//   runCloseBest({ doc, edited, openReds, exhaustive })",
  "//   runClose({ ..., window, bar })   bar (D467): { base, edited } — the result of a windowed close is refused by name (CLOSE_BAR) unless it passes barMiss below:\n" +
  "//     base the lap before the drag, edited the pieces the drag changed. The release asks it of its start-pieces try only.\n" +
  "//\n" +
  "//   runCloseBest({ doc, edited, openReds, exhaustive })", 'closejob header');
cj = once(cj, "const { createCheckJob } = require('../validate-ui/checkjob.js');\n",
  "const { createCheckJob } = require('../validate-ui/checkjob.js');\nconst D = require('../../src/core/document.js');\nconst { startLayout } = require('./startlayout.js');\n", 'closejob requires');
cj = once(cj, "function runClose({ doc, fraction = 0.2, last = false, whole = false, finish = false, edited = null, best = false, openReds = null, window = null } = {}) {",
  "function runClose({ doc, fraction = 0.2, last = false, whole = false, finish = false, edited = null, best = false, openReds = null, window = null, bar = null } = {}) {", 'runClose signature');
cj = once(cj, "  if (!res.converged) return { converged: false, report: res.report, doc: null, window: null, displacement: null };\n  return { converged: true, report: res.report, doc: res.doc, window: res.window, displacement: displacementOf(doc, res.doc) };\n}\n",
  "  if (!res.converged) return { converged: false, report: res.report, doc: null, window: null, displacement: null };\n" +
  "  if (bar) { const why = barMiss(doc, res.doc, bar); if (why) throw new D.CoreError('CLOSE_BAR', `close: closing with the start of the lap would ${why}`); }   // D467: taken only within the bar\n" +
  "  return { converged: true, report: res.report, doc: res.doc, window: res.window, displacement: displacementOf(doc, res.doc) };\n}\n\n" +
  `/* D467, THE BAR on the start-pieces close (C's review of 95d23f1, exo_memory/handback/p-d467-review-C_2026-10-25.md §3 and §5; re-ruled by the librarian). Keeping the
 * user's whole bend by moving the lap's start pieces has no bound of its own: on sculpt-tools' lap a Bend the window tries closed within 0.53 m swung the lap 72.9 m and left
 * no start straight, and on a smoothed TEST 10 the road crossed itself far from the bend. So the close is taken only when its result passes all three, checked cheapest
 * first, and otherwise refused by name, so the release falls through to D421c's tries:
 *   3  no road outside the window (the pieces the drag changed) moves further from where it was before the drag than the drag itself moved the open lap (displacementOf,
 *      C's measure: each piece's largest move, sample for sample);
 *   2  the exporter's own start-straight check (startlayout.js, as the export calls it) still passes, when it passed on the lap before the drag (a lap that had no start
 *      straight cannot lose one), and only when the start is the automatic one (a start placed by hand needs no straight);
 *   1  the validator adds no red the open lap did not have (the live checker's job, as Close's one press compares them: same reason within RED_NEAR_M).
 * Returns null when it passes, or the words for what it would do. */
function barMiss(open, closed, { base, edited }) {
  const win = new Set(edited || []);
  const drag = displacementOf(base, open).reduce((m, x) => Math.max(m, x.maxM), 0);
  const outside = displacementOf(base, closed).filter((x) => !win.has(x.piece)).reduce((m, x) => Math.max(m, x.maxM), 0);
  if (outside > drag + 1e-6) return \`move road you did not touch up to \${fmtM(outside)}, further than your drag moved it (\${fmtM(drag)})\`;
  if (!closed.spawns && hasStart(base) && !hasStart(closed)) return 'leave no straight long enough for the start';
  const job = createCheckJob(), mine = redsOf(closed, job), was = redsOf({ ...open, closed: false }, job);
  const fresh = mine.reds.filter((x) => !was.reds.some((o) => o.reason === x.reason && Math.abs(o.s - x.s) <= RED_NEAR_M));
  if (fresh.length) return \`add \${fresh.length} red\${fresh.length === 1 ? '' : 's'} (\${fresh[0].reason} at \${(fresh[0].s / 1000).toFixed(2)} km)\`;
  return null;
}
/** Whether a closed lap has the export's start straight (startlayout.js, with the lift and the start the export uses). */
function hasStart(d) {
  const segs = toSegments({ ...d, closed: true }), lift = typeof AD.offsetPath === 'function' ? (p) => AD.offsetPath(d, segs, p) : undefined;
  const start = d.start ? { pos: d.start.pos.slice(), theta: d.start.heading, p: d.start.pitch } : null;
  try { startLayout(segs, lift, start, { open: false }); return true; } catch (e) { if (e && e.code === 'NO_START_STRAIGHT') return false; throw e; }
}
`, 'runClose end');
cj = once(cj, "module.exports = { runClose, runCloseBest, byOrder, displacementOf, relink };", "module.exports = { runClose, runCloseBest, byOrder, displacementOf, relink, barMiss };", 'closejob exports');
wr('app/core/closejob.js', cj, cjCRLF);

// 3. the runner posts it
let cr0 = rd('app/core/closerunner.js'); const crCRLF = crlfOf(cr0); let cr = lf(cr0);
cr = once(cr, "    start({ doc, fraction = 0.2, last = false, whole = false, finish = false, edited = null, best = false, openReds = null, window = null }) {",
  "    start({ doc, fraction = 0.2, last = false, whole = false, finish = false, edited = null, best = false, openReds = null, window = null, bar = null }) {", 'runner signature');
cr = once(cr, "...(window ? { window } : {}) });", "...(window ? { window } : {}), ...(bar ? { bar } : {}) });", 'runner post');
wr('app/core/closerunner.js', cr, crCRLF);
console.log('patched; moved', moved.split('\n').length, 'lines');
