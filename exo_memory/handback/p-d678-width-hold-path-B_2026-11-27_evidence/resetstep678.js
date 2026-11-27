// resetstep678.js (pane B, D678): how far does dropping layHold's held-pair reset move the width? extend.js loaded twice (as on disk; and with the reset line
// removed, in memory). On E's d678 heads where the first run and the final run differed: the width's control points of the new piece, largest difference in
// steps of DEC.w, and whether the knots are the same. usage: node resetstep678.js <tree>
'use strict';
const path = require('path'), fs = require('fs'), Module = require('module');
const T = path.resolve(process.argv[2]), EXT = path.join(T, 'src/core/extend.js');
const LINE = 'w[0] = Number(h.from.v.toFixed(D.DEC.w)) + 0; w[1] = Number((h.from.v + (h.from.m * K0) / 3).toFixed(D.DEC.w)) + 0;';
const load = (drop) => { for (const k of Object.keys(require.cache)) if (k.startsWith(T)) delete require.cache[k];
  const src = fs.readFileSync(EXT, 'utf8'); if (src.split(LINE).length !== 2) throw new Error('the reset line is not in extend.js exactly once');
  if (drop) { const m = new Module(EXT, null); m.filename = EXT; m.paths = Module._nodeModulePaths(path.dirname(EXT)); m._compile(src.replace(LINE, ''), EXT); m.loaded = true; require.cache[EXT] = m; }
  return { D: require(path.join(T, 'src/core/document.js')), TB: require(path.join(T, 'src/core/turnby.js')), shell: require(path.join(T, 'app/core/coreshell.js')).createCoreShell, extendOptions: require(path.join(T, 'app/core/panel.js')).extendOptions }; };
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const DEG = Math.PI / 180;
const plain = (t) => { const X = require(path.join(T, 'src/core/extend.js')).extend; return X(X(t.D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * DEG } }); };
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const HEADS = { 'E1 brush +1.37 end-5 r20': async (t) => { const s = await t.shell({ autosaveMs: 0 }); s.commitDoc(plain(t)); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 5, r: 20 }); s.brushTo(1.37); s.endBrush(); return s; },
  'grab -2 end-0 r10': async (t) => { const s = await t.shell({ autosaveMs: 0 }); s.commitDoc(plain(t)); s.setSculpt(true); s.beginFollow({ s0: total(doc(s)), r: 10 }); s.brushTo({ w: -2 }); s.endBrush(); s.setSculpt(false); return s; },
  'grab +4 end-0 r5': async (t) => { const s = await t.shell({ autosaveMs: 0 }); s.commitDoc(plain(t)); s.setSculpt(true); s.beginFollow({ s0: total(doc(s)), r: 5 }); s.brushTo({ w: 4 }); s.endBrush(); s.setSculpt(false); return s; } };
const CALLERS = { extend: (t, s) => s.extend(t.extendOptions({ ...BLANK, head: s.headState() })), 'sharp -60 R40 ramp1': (t, s) => s.extendSharp(t.extendOptions({ ...BLANK, head: s.headState() }), { deg: -60, R: 40, ramp: 1 }) };
(async () => {
  const out = {};
  for (const drop of [false, true]) { const t = load(drop); for (const [hn, mk] of Object.entries(HEADS)) for (const [cn, call] of Object.entries(CALLERS)) { const s = await mk(t), n = doc(s).pieces.length; call(t, s); const P = doc(s).pieces[n]; (out[`${hn} | ${cn}`] ||= []).push({ knots: P.knots, w: P.channels.w, head: t.D.pieceEnd(doc(s).pieces[n - 1]).w }); } }
  for (const [k, [a, b]] of Object.entries(out)) { let most = 0, at = -1; for (let i = 0; i < a.w.length; i++) { const d = Math.abs(a.w[i] - b.w[i]) / 1e-4; if (d > most + 1e-9) { most = d; at = i; } }
    const k0 = a.knots[0], slopeA = (3 * (a.w[1] - a.w[0])) / k0, slopeB = (3 * (b.w[1] - b.w[0])) / k0;
    console.log(`${k}: knots same ${JSON.stringify(a.knots) === JSON.stringify(b.knots)} | width apart ${+most.toFixed(3)} steps at point ${at} of ${a.w.length} | head slope ${a.head.m.toExponential(4)}; leaving slope with the reset ${slopeA.toExponential(4)}, without ${slopeB.toExponential(4)} (first knot ${k0})`); }
})().catch((e) => { console.error(e); process.exit(1); });
