// row3_678.js (pane B, D678 Track 1): ROW 3 as registered (handback/p-d678-width-hold-path-B_2026-11-27.md §0). On tree X against tree R (c522ea6):
// (1) from a LEVEL head (ripple268's plain road, E's lap for Finish), the nine callers and Finish lay the same bytes (the whole document's serialisation);
// (2) on the copies of his saved tracks (G:\consonance-scratch\b-wr-work\tracks, taken 2026-11-27T05:07:04Z; numbered, never named): at each open head that parses
// on both trees, an Extend of 100 m (the panel's as-shown options) and a Turn by 45 over 100 m lay the same bytes; the head's width slope is printed.
// usage: node row3_678.js <tree X> <tree R> <copies dir>
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const load = (T) => { T = path.resolve(T); return { D: require(path.join(T, 'src/core/document.js')), extend: require(path.join(T, 'src/core/extend.js')).extend, TB: require(path.join(T, 'src/core/turnby.js')),
  F: require(path.join(T, 'src/core/finish.js')), shell: require(path.join(T, 'app/core/coreshell.js')).createCoreShell, extendOptions: require(path.join(T, 'app/core/panel.js')).extendOptions }; };
const X = load(process.argv[2]), R = load(process.argv[3]), COPIES = process.argv[4];
const h = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const DEG = Math.PI / 180;
const plain = (t) => t.extend(t.extend(t.D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * DEG } });
const lap = (t) => { const Rr = 180, Q = (Math.PI * Rr) / 2; let d = t.TB.extendCorner(t.D.createDoc('lap'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = t.TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / Rr } }); return t.TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } }); };
const doc = (s) => s.getState().history.present;
const opt = (t, s, length = 100) => t.extendOptions({ ...BLANK, length, head: s.headState() });
const CALLERS = { extend: (t, s) => s.extend(opt(t, s)), 'turnBy 45': (t, s) => s.extendTurnBy(opt(t, s), 45), 'turnBy -90 over 200': (t, s) => s.extendTurnBy(opt(t, s, 200), -90),
  'corner 30 + extra 20 from 50': (t, s) => s.extend({ ...opt(t, s), turnDeg: 30, changes: { turnDeg: [{ from: 50, deg: 20 }] } }),
  'sharp -60 R40 ramp8': (t, s) => s.extendSharp(opt(t, s), { deg: -60, R: 40, ramp: 8 }), 'sharp 90 R150 ramp4': (t, s) => s.extendSharp(opt(t, s), { deg: 90, R: 150, ramp: 4 }),
  'sharp -60 R40 ramp1': (t, s) => s.extendSharp(opt(t, s), { deg: -60, R: 40, ramp: 1 }), 'jump (take-off)': (t, s) => s.jump(opt(t, s)), level: (t, s) => s.extendLevel(opt(t, s)) };
async function viaShell(t, d0, call) { const s = await t.shell({ autosaveMs: 0 }); s.commitDoc(d0); const before = doc(s); try { call(t, s); } catch (e) { return `threw ${e.code || e.name}`; } const after = doc(s); return after === before ? `refused: ${String(s.getState().message).slice(0, 60)}` : h(t.D.serialize(after)); }
(async () => {
  let same = 0, n = 0;
  for (const [cn, call] of Object.entries(CALLERS)) { const a = await viaShell(X, plain(X), call), b = await viaShell(R, plain(R), call); n++; if (a === b) same++; console.log(`level head | ${cn}: ${a === b ? 'same' : 'DIFFER'} (${a} / ${b})`); }
  { let a, b; try { a = h(X.D.serialize(X.F.finishToStart(lap(X)).doc)); } catch (e) { a = `threw ${e.code}`; } try { b = h(R.D.serialize(R.F.finishToStart(lap(R)).doc)); } catch (e) { b = `threw ${e.code}`; } n++; if (a === b) same++; console.log(`level lap | finish: ${a === b ? 'same' : 'DIFFER'} (${a} / ${b})`); }
  console.log(`LEVEL HEADS: ${same} of ${n} the same bytes`);
  let open = 0, osame = 0, closed = 0, refused = 0, held = 0;
  const files = fs.readdirSync(COPIES).filter((f) => /^t\d\d\.t180track$/.test(f)).sort();
  for (const f of files) {
    const text = fs.readFileSync(path.join(COPIES, f), 'utf8'); let dx, dr;
    try { dx = X.D.parse(text); dr = R.D.parse(text); } catch (e) { refused++; console.log(`${f.slice(0, 3)}: refused on parse (${e.code || e.name})`); continue; }
    if (dx.closed) { closed++; continue; }
    if (!dx.pieces.length || dx.pieces[dx.pieces.length - 1].type !== 'road') { console.log(`${f.slice(0, 3)}: open, its head is not a road piece; skipped`); continue; }
    const slope = X.D.endState(dx).w.m; open++; if (slope !== 0) held++;
    const r = []; for (const [cn, call] of [['extend', CALLERS.extend], ['turnBy 45', CALLERS['turnBy 45']]]) { const a = await viaShell(X, dx, call), b = await viaShell(R, dr, call); r.push(`${cn} ${a === b ? 'same' : `DIFFER (${a} / ${b})`}`); if (a === b) osame++; }
    console.log(`${f.slice(0, 3)}: open, head width slope ${slope} per m: ${r.join('; ')}`);
  }
  console.log(`HIS COPIES: ${files.length} tracks, ${refused} refused on parse, ${closed} closed, ${open} open (${held} with a width still changing at the head); ${osame} of ${2 * open} lays the same bytes`);
})().catch((e) => { console.error('row3_678 failed:', e); process.exit(1); });
