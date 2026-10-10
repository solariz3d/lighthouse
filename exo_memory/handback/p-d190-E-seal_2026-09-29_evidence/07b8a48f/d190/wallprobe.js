// D190 row 4 probe (pane E, docs-only seal): do the EXISTING mesh / validate / export paths at c964c2d accept a cup
// profile at c = 90 and at the candidate MAX? The cup profile is built by the plan's shape rule by hand and put on every
// road segment of a closed lap; nothing in the repo is changed. Usage: node wallprobe.js
'use strict';
const T = __dirname + '/t/';
const D = require(T + 'src/core/document.js'), { extend } = require(T + 'src/core/extend.js'), { close } = require(T + 'src/core/close.js');
const AD = require(T + 'src/core/adapter.js'), { FLOORS, AT } = require(T + 'src/geom/fonts.js');
const FW = require(T + 'src/export/fromwords.js'), { startLayout } = require(T + 'app/core/coreshell.js');
const DEG = Math.PI / 180;
const cup = (fam, w, c) => { const F = FLOORS[fam], E = F[3], side = AT.map((f, i) => [f * w / 2, c * F[i] / E * DEG]);
  return { font: fam, material: 'ROAD', u: [...side.slice().reverse().map(([x]) => -x), 0, ...side.map(([x]) => x)], psi: [...side.slice().reverse().map(([, p]) => p), 0, ...side.map(([, p]) => p)] }; };

const R = 180, Q = Math.PI * R / 2;
let doc = D.createDoc('cupprobe');
doc = extend(doc, { length: 300, family: 'bowl' });
for (let i = 0; i < 4; i++) doc = extend(doc, { length: Q, transition: 40, targets: { kh: 1 / R } });
doc = extend(doc, { length: 60, transition: 40, targets: { kh: 0 } });
{ const r = close(doc, { edited: [0] }); doc = r.doc || r; }
if (!doc.closed) throw new Error('lap did not close');
const base = AD.toSegments(doc), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
const lift = (p) => AD.offsetPath(doc, base, p);
const cases = [['baseline (c964c2d profiles)', null]];
for (const fam of Object.keys(FLOORS)) for (const c of [90, 150]) cases.push([`${fam} c=${c}`, [fam, c]]);
cases.push(['bowl c=159 (0.7 under the touch)', ['bowl', 159]]); cases.push(['bowl c=165 (past the touch)', ['bowl', 165]]); cases.push(['half-pipe c=180', ['half-pipe', 180]]);
const rows = [];
for (const [name, k] of cases) {
  const segs = k ? base.map((g) => (g.kind === 'road' && g.id !== doc.pieces[0].id && g.id !== doc.pieces[doc.pieces.length - 1].id ? { ...g, profile: cup(k[0], 31, k[1]) } : g)) : base;
  for (const csp of [true, false]) {
    const t0 = Date.now(); let r;
    try {
      const markers = startLayout(base, lift, start);   // the grid chosen on the uncupped lap (the grid-floor rule is reported separately)
      const out = FW.buildFromSegments(segs, { name: 'cupprobe', via: 'probe', liftPath: lift, start }, { csp, markers });
      r = { ok: true, keys: Object.keys(out).join(','), amber: JSON.stringify((out.amber || []).map((x) => x.reason)).slice(0, 200), warnings: (out.warnings || []).length };
    } catch (e) {
      const red = e.red || []; const by = {}; for (const x of red) by[x.reason] = (by[x.reason] || 0) + 1;
      r = { ok: false, code: e.code, reds: by, msg: red.length ? undefined : String(e.message).slice(0, 200) };
    }
    rows.push({ name, csp, ms: Date.now() - t0, ...r });
    console.log(JSON.stringify(rows[rows.length - 1]));
  }
}
