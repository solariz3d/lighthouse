// typed678.js (pane E, D678): C5, "a typed width still goes where it is typed": from the E4 and E6 heads (still changing) and the level head, the panel's Extend
// with the width typed (22, and 20.46), on both trees: the new piece's bytes the same? usage: node typed678.js <beforeTree> <afterTree>
'use strict';
const path = require('path'), crypto = require('crypto');
const load = (T) => { T = path.resolve(T); return { D: require(path.join(T, 'src/core/document.js')), extend: require(path.join(T, 'src/core/extend.js')).extend,
  shell: require(path.join(T, 'app/core/coreshell.js')).createCoreShell, extendOptions: require(path.join(T, 'app/core/panel.js')).extendOptions }; };
const [Bt, At] = process.argv.slice(2).map(load);
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const plain = (t) => t.extend(t.extend(t.D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: (8 * Math.PI) / 180 } });
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0), h = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 12);
const sh = async (t, sculpt) => { const s = await t.shell({ autosaveMs: 0 }); s.commitDoc(plain(t)); if (sculpt) s.setSculpt(true); return s; };
const heads = { 'level head': (t) => sh(t),
  E4: async (t) => { const s = await sh(t); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 30, r: 40 }); s.brushTo(5); s.endBrush(); return s; },
  E6: async (t) => { const s = await sh(t, true); s.beginFollow({ s0: total(doc(s)) - 10, r: 20 }); s.brushTo({ w: 2 }); s.endBrush(); s.setSculpt(false); return s; } };
(async () => {
  for (const [hn, mk] of Object.entries(heads)) for (const width of ['22', '20.46']) for (const length of [100, 30]) {
    const sb = await mk(Bt), sa = await mk(At), n = doc(sb).pieces.length;
    sb.extend(Bt.extendOptions({ ...BLANK, length, width, head: sb.headState() })); sa.extend(At.extendOptions({ ...BLANK, length, width, head: sa.headState() }));
    const Pb = doc(sb).pieces[n], Pa = doc(sa).pieces[n];
    console.log(JSON.stringify({ head: hn, slope: +Bt.D.endState(doc(sb)).w.m.toFixed(5), width, length, laid: [!!Pb, !!Pa], sameBytes: !!Pb && !!Pa && h(Pb) === h(Pa), endW: Pa ? At.D.pieceEnd(Pa).w : null }));
  }
})().catch((e) => { console.error('typed678 failed:', e); process.exit(1); });
