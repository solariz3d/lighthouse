// d9check678.js (pane B, D678): is mutant D9 (the corner list lays the hold before its corners' knots go in) equivalent, or only unseen by an extra corner
// at 50 m? turnby.js patched IN MEMORY (no file written). For extra corners of 20 from F m after a corner of 30 over 100 m: the path from E4's head against the
// level head's (kh every 0.05 m in steps of 1e-9; the end), and the width's control points against the real code's. usage: node d9check678.js <tree>
'use strict';
const path = require('path'), fs = require('fs'), Module = require('module');
const T = path.resolve(process.argv[2]), TBF = path.join(T, 'src/core/turnby.js');
const FROM = 'extendBy(doc, opts, aims, true), P0', TO = '({ doc: extendBy(doc, opts, aims), hold: null }), P0';
const load = (mut) => { for (const k of Object.keys(require.cache)) if (k.startsWith(T)) delete require.cache[k];
  if (mut) { const src = fs.readFileSync(TBF, 'utf8'); if (src.split(FROM).length !== 2) throw new Error('D9 string not once'); const m = new Module(TBF, null); m.filename = TBF; m.paths = Module._nodeModulePaths(path.dirname(TBF)); m._compile(src.replace(FROM, TO), TBF); m.loaded = true; require.cache[TBF] = m; }
  return { D: require(path.join(T, 'src/core/document.js')), X: require(path.join(T, 'src/core/extend.js')).extend, A: require(path.join(T, 'src/core/adapter.js')), shell: require(path.join(T, 'app/core/coreshell.js')).createCoreShell, eo: require(path.join(T, 'app/core/panel.js')).extendOptions }; };
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
(async () => {
  const res = {};
  for (const mut of [false, true]) { const t = load(mut);
    const plain = () => t.X(t.X(t.D.createDoc('d9'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
    for (const from of [2, 5, 8, 10, 12, 15, 18, 20, 30, 50]) for (const brushed of [false, true]) {
      const s = await t.shell({ autosaveMs: 0 }); s.commitDoc(plain()); if (brushed) { s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 30, r: 40 }); s.brushTo(5); s.endBrush(); }
      const n = doc(s).pieces.length; try { s.extend({ ...t.eo({ ...BLANK, head: s.headState() }), turnDeg: 30, changes: { turnDeg: [{ from, deg: 20 }] } }); } catch (e) { res[`${mut}|${from}|${brushed}`] = { threw: e.code }; continue; }
      const d = doc(s); if (d.pieces.length === n) { res[`${mut}|${from}|${brushed}`] = { refused: String(s.getState().message).slice(0, 70) }; continue; }
      res[`${mut}|${from}|${brushed}`] = { P: d.pieces[n], end: t.A.toPath(d, { step: 0.25 }).path.samples.at(-1).pos, D: t.D };
    } }
  for (const from of [2, 5, 8, 10, 12, 15, 18, 20, 30, 50]) {
    const line = [`extra from ${String(from).padStart(2)} m:`];
    for (const mut of [false, true]) { const L = res[`${mut}|${from}|false`], H = res[`${mut}|${from}|true`];
      if (!L.P || !H.P) { line.push(`${mut ? 'D9' : 'real'} ${JSON.stringify(L.refused || L.threw || H.refused || H.threw)}`); continue; }
      let worst = 0; for (let x = 0; x <= H.P.length; x += 0.05) worst = Math.max(worst, Math.abs(H.D.channelValue(H.P, 'kh', x) - L.D.channelValue(L.P, 'kh', x)));
      const end = Math.hypot(...H.end.map((v, i) => v - L.end[i]));
      line.push(`${mut ? 'D9' : 'real'}: kh ${(worst / 1e-9).toFixed(3)} steps from the level head's, end ${end.toExponential(2)} m, knots ${H.P.knots.length}`); }
    const a = res[`false|${from}|true`], b = res[`true|${from}|true`];
    if (a.P && b.P) { let most = 0; const same = JSON.stringify(a.P.knots) === JSON.stringify(b.P.knots); if (same) a.P.channels.w.forEach((v, i) => { most = Math.max(most, Math.abs(v - b.P.channels.w[i]) / 1e-4); }); line.push(`| width real vs D9: knots ${same ? 'same' : 'DIFFER'}, ${same ? most.toFixed(2) + ' steps' : ''}`); }
    console.log(line.join(' | '));
  }
})().catch((e) => { console.error(e); process.exit(1); });
