// sharphold678.js (pane B, D678 Track 1, the read's F1): what would a LONGER hold on Sharp cost? On the repair, in memory only (no file is written): extend.js is
// loaded with its one `holdR = … startRampM(length, knotM)` line replaced, so the hold's ramp is F times Sharp's own (F = 1 is the repair itself, the control), or
// Extend's (startRampM(length), no knotM: about 20 m). Heads: E1, E4, E6 and the steep grab (+4 at end-3, r 5). Callers: the three Sharps of E's table. For each:
// refused or laid; the swing past the head's width and where; the last station over 1 mm off; the largest |w''| (bend268's step: e 0.05, every 0.1 m); the joint;
// whether it ends at the head's width, level; and the end point against F = 1 (the path, which the hold must not move).
// usage: node sharphold678.js <tree>
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), fs = require('fs'), Module = require('module');
const T = path.resolve(process.argv[2]), EXT = path.join(T, 'src/core/extend.js');
const LINE = 'holdR = holdW === undefined ? undefined : startRampM(length, knotM);';
const VARIANTS = { 'F 1 (the repair)': LINE, 'F 2': 'holdR = holdW === undefined ? undefined : Math.min(length, 2 * startRampM(length, knotM));',
  'F 4': 'holdR = holdW === undefined ? undefined : Math.min(length, 4 * startRampM(length, knotM));', "Extend's ramp": 'holdR = holdW === undefined ? undefined : startRampM(length);' };
const fresh = (variant) => {   // a clean module cache under T, then extend.js compiled from its source with the one line swapped
  for (const k of Object.keys(require.cache)) if (k.startsWith(T)) delete require.cache[k];
  const src = fs.readFileSync(EXT, 'utf8'); if (src.split(LINE).length !== 2) throw new Error('the hold line is not in extend.js exactly once');
  const m = new Module(EXT, null); m.filename = EXT; m.paths = Module._nodeModulePaths(path.dirname(EXT)); m._compile(src.replace(LINE, variant), EXT); m.loaded = true; require.cache[EXT] = m;
  return { D: require(path.join(T, 'src/core/document.js')), extend: m.exports.extend, A: require(path.join(T, 'src/core/adapter.js')),
    shell: require(path.join(T, 'app/core/coreshell.js')).createCoreShell, extendOptions: require(path.join(T, 'app/core/panel.js')).extendOptions };
};
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const DEG = Math.PI / 180;
const plain = (t) => t.extend(t.extend(t.D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * DEG } });
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const sh = async (t, sculpt) => { const s = await t.shell({ autosaveMs: 0 }); s.commitDoc(plain(t)); if (sculpt) s.setSculpt(true); return s; };
const HEADS = { E1: async (t) => { const s = await sh(t); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 5, r: 20 }); s.brushTo(1.37); s.endBrush(); return s; },
  E4: async (t) => { const s = await sh(t); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 30, r: 40 }); s.brushTo(5); s.endBrush(); return s; },
  E6: async (t) => { const s = await sh(t, true); s.beginFollow({ s0: total(doc(s)) - 10, r: 20 }); s.brushTo({ w: 2 }); s.endBrush(); s.setSculpt(false); return s; },
  'grab +4 end-3 r5': async (t) => { const s = await sh(t, true); s.beginFollow({ s0: total(doc(s)) - 3, r: 5 }); s.brushTo({ w: 4 }); s.endBrush(); s.setSculpt(false); return s; } };
const opt = (t, s) => t.extendOptions({ ...BLANK, length: 100, head: s.headState() });
const CALLERS = { 'sharp -60 R40 ramp8': { deg: -60, R: 40, ramp: 8 }, 'sharp 90 R150 ramp4': { deg: 90, R: 150, ramp: 4 }, 'sharp -60 R40 ramp1': { deg: -60, R: 40, ramp: 1 } };
const wpp = (t, P, x) => { const e = 0.05; return (t.D.channelValue(P, 'w', x + e) - 2 * t.D.channelValue(P, 'w', x) + t.D.channelValue(P, 'w', x - e)) / (e * e); };
(async () => {
  const ends = {};
  for (const [vn, line] of Object.entries(VARIANTS)) {
    const t = fresh(line);
    for (const [hn, mk] of Object.entries(HEADS)) for (const [cn, sp] of Object.entries(CALLERS)) {
      const s = await mk(t), d0 = doc(s), n = d0.pieces.length, head = t.D.pieceEnd(d0.pieces[n - 1]).w;
      try { s.extendSharp(opt(t, s), sp); } catch (e) { console.log(JSON.stringify({ variant: vn, head: hn, caller: cn, threw: e.code || e.name })); continue; }
      const d = doc(s); if (d.pieces.length === n) { console.log(JSON.stringify({ variant: vn, head: hn, caller: cn, refused: String(s.getState().message).slice(0, 90) })); continue; }
      const P = d.pieces[n]; let swing = 0, at = 0, last1 = 0, w2 = 0;
      for (let k = 0; k <= 4000; k++) { const x = (P.length * k) / 4000, dv = t.D.channelValue(P, 'w', x) - head.v; if (Math.abs(dv) > Math.abs(swing)) { swing = dv; at = x; } if (Math.abs(dv) > 1e-3) last1 = x; }
      for (let x = 0.1; x < P.length - 0.1; x += 0.1) w2 = Math.max(w2, Math.abs(wpp(t, P, x)));
      const end = t.A.toPath(d, { step: 0.25 }).path.samples.at(-1).pos, key = `${hn}|${cn}`; if (!ends[key]) ends[key] = end;
      const moved = Math.hypot(...end.map((v, i) => v - ends[key][i]));
      console.log(JSON.stringify({ variant: vn, head: hn, caller: cn, slope: +head.m.toExponential(3), pieceM: P.length, rampM: +(P.knots.length ? P.knots : [P.length]).find((k) => k > 0) .toFixed(4),
        swingMm: +(1000 * swing).toFixed(2), at: +at.toFixed(2), over1mmUntil: +last1.toFixed(2), w2: +w2.toFixed(4), joint: t.D.jointProblem(t.D.pieceEnd(d0.pieces[n - 1]), P, t.D.kindOf(d0.pieces[n - 1])),
        endsAtHead: t.D.pieceEnd(P).w.v === head.v && t.D.pieceEnd(P).w.m === 0, endMovedFromF1M: +moved.toFixed(7) }));
    }
  }
})().catch((e) => { console.error('sharphold678 failed:', e); process.exit(1); });
