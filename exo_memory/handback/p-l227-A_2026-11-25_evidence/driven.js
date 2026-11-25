// L227 (pane A): the S he DROVE (pane O's S_OPTS + EASE_OUT on the 300 m lead), saved; and the kink measured for it and for route 1c.
//   node driven.js stage <stage dir>        lay the driven S, print its sha256 beside pane O's, save project + two pieces into <stage dir>
//   node driven.js read  <app data dir>     reopen BOTH projects from there (shell.open) and the driven pieces (insertPiece), print the road figures
// Nothing is written into <app data dir>; helper files go to the OS temp folder. Tree: ROUTE_TREE (default C:/Consonance/t180-wt-flow, 27e2084).
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const T = process.env.ROUTE_TREE || 'C:/Consonance/t180-wt-flow';
const OROUTE = 'C:/Consonance/lighthouse/exo_memory/handback/p-d677-t180-route-O_2026-11-24_evidence/route.js';
const tmp = path.join(os.tmpdir(), '_l227_route.js');
fs.writeFileSync(tmp, fs.readFileSync(OROUTE, 'utf8').replace("process.env.ROUTE_TREE || 'G:/consonance-scratch/o-route-t180'", JSON.stringify(T)));
const O = require(tmp), { D, TB, extend, RP, LEAD, DEG } = O;
const { createCoreShell } = require(T + '/app/core/coreshell.js');
const NAME = 'Smooth S as driven L', P1 = 'Smooth S as driven', P2 = 'Smooth S as driven ease-out', C1C = 'Smooth S flow L';
const MARKS = [{ at: 145, deg: -27 }, { at: 200, deg: 0 }, { at: 255, deg: 25 }, { at: 300, deg: 26 }];
const SMARKS = [{ at: 80, deg: -20 }, ...MARKS];   // pane O's M for the S: the bank's start at 80 m too
const MARKS_1C = [{ at: 55, deg: -27 }, { at: 112, deg: 0 }, { at: 157, deg: 26 }, { at: 200, deg: 26 }, { at: 300, deg: 0 }];
const S_OPTS = { length: 300, turnDeg: 0, changes: { turnDeg: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }] }, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: MARKS.map((m) => ({ at: m.at, target: m.deg * DEG })) } };
const lead = () => extend(D.createDoc('flow'), { length: LEAD, family: 'bowl', first: { w: 33 } });
const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
const store = (dir) => {
  const f = (sub, n, ext) => { fs.mkdirSync(path.join(dir, sub), { recursive: true }); return path.join(dir, sub, n + ext); };
  return {
    saveDoc: async (n, b) => fs.writeFileSync(f('tracks', n, '.t180track'), b), openDoc: async (n) => fs.readFileSync(f('tracks', n, '.t180track'), 'utf8'),
    saveUndo: async (n, b) => fs.writeFileSync(f('tracks', n, '.t180undo'), b), openUndo: async (n) => { const p = f('tracks', n, '.t180undo'); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; },
    savePiece: async (n, b) => { const p = f('pieces', n, '.t180piece'); if (fs.existsSync(p)) throw new Error('a piece named "' + n + '" already exists'); fs.writeFileSync(p, b); },
    openPiece: async (n) => fs.readFileSync(f('pieces', n, '.t180piece'), 'utf8'), listPieces: async () => [], deletePiece: async () => {}, listDocs: async () => [],
    saveAutosave: async () => {}, clearAutosave: async () => {}, openAutosave: async () => null, backupDoc: async () => {}, listBackups: async () => [], docSavedAt: async () => null,
  };
};
const f2 = (x) => (x === undefined || x === null ? '-' : x.toFixed(2));
function figures(doc, marks) {   // marks: [{at, deg}] from the S piece's start (LEAD)
  const r = O.read(doc), inS = r.filter((x) => x.s >= LEAD - 10), pk = inS.reduce((a, x) => (Math.abs(x.h) > Math.abs(a.h) ? x : a)), end = inS[inS.length - 1];
  const bank = (s) => RP.near(r, s).b;
  const BB = RP.builtBank(doc).filter((x) => x.s >= LEAD - 20);
  let steep = 0; for (let i = 8; i < BB.length; i++) steep = Math.max(steep, Math.abs(BB[i].v - BB[i - 8].v) / (BB[i].s - BB[i - 8].s));   // 4 m chord at 0.5 m steps
  const M = [{ s: LEAD, deg: 0 }, ...marks.map((m) => ({ s: LEAD + m.at, deg: m.deg }))];
  const ref = (s) => {
    for (let k = 0; k + 1 < M.length; k++) {
      if (s < M[k].s || s > M[k + 1].s) continue;
      const tA = (j) => j > 0 && j + 1 < M.length && Math.sign(M[j].deg - M[j - 1].deg) !== Math.sign(M[j + 1].deg - M[j].deg);
      if ((tA(k) && s - M[k].s < 10) || (tA(k + 1) && M[k + 1].s - s < 10)) return 0;
      return (M[k + 1].deg - M[k].deg) / (M[k + 1].s - M[k].s);
    }
    return 0;
  };
  const halts = RP.stops(RP.builtBank(doc).filter((x) => x.s >= LEAD - 20 && x.s <= M[M.length - 1].s + 50), ref);
  return { turnA: pk.h, peakAt: pk.s - LEAD, turnB: end.h - pk.h, bank: marks.map((m) => ({ at: m.at, want: m.deg, got: bank(LEAD + m.at) })), halts: halts.length, steep, r, pk };
}
// the kink: every 2 m from 20 m before the heading's peak to 20 m after: the centre line's turn rate (8 m chord, deg/m), the inside edge's
// (k / (1 - |k| hw), hw = 16.5 m, half the 33 m width: ASSUMED from first:{w:33}), the bank, the roll rate (4 m chord)
function kink(fig) {
  const rows = [], hw = 16.5;
  for (let d = -20; d <= 20; d += 2) {
    const s = fig.pk.s + d, h = (x) => RP.near(fig.r, x).h, b = (x) => RP.near(fig.r, x).b;
    const kap = ((h(s + 4) - h(s - 4)) / 8) * DEG;
    const edge = (Math.sign(kap) * Math.abs(kap)) / Math.max(1e-9, 1 - Math.abs(kap) * hw) / DEG;
    rows.push({ d, centre: kap / DEG, edge, bank: b(s), roll: (b(s + 2) - b(s - 2)) / 4 });
  }
  return rows;
}
(async () => {
  const [mode, dir] = process.argv.slice(2);
  if (mode === 'stage') {
    const S = extend(TB.extendCorner(lead(), S_OPTS), { length: 150, targets: { phi: 0 }, transition: { phi: 100 }, bankShape: 'flow' });
    const text = D.serialize(S);
    console.log('sha256 of the laid S + ease-out:', sha(text), '| pane O recorded (12 hex): 459105d483b9 | prefix match:', sha(text).startsWith('459105d483b9'));
    const sh = await createCoreShell({ brushFn: null, storage: store(dir) }); sh.commitDoc(S); await sh.save(NAME);
    console.log('pieces in the doc:', D.parse(sh.text()).pieces.length);
    for (const [i, n] of [[1, P1], [2, P2]]) { sh.selectPiece(i); await sh.savePiece(n); }
    return;
  }
  const out = {};
  for (const [label, name, marks] of [['driven S (reopened project)', NAME, SMARKS], ['route 1c (reopened project, L226)', C1C, MARKS_1C]]) {
    const a = await createCoreShell({ brushFn: null, storage: store(dir) }); await a.open(name);
    const doc = D.parse(a.text()), fig = figures(doc, marks);
    out[label] = { sha256: sha(a.text()), pieces: doc.pieces.length, turnA: +f2(fig.turnA), peakAt: +f2(fig.peakAt), turnB: +f2(fig.turnB), bank: fig.bank.map((b) => b.at + ' m: ' + f2(b.got) + ' (mark ' + b.want + ')'), halts: fig.halts, steepestRoll4m: +f2(fig.steep),
      kink: kink(fig).map((k) => (k.d >= 0 ? '+' : '') + k.d + ': centre ' + f2(k.centre) + ' edge ' + f2(k.edge) + ' bank ' + f2(k.bank) + ' roll ' + f2(k.roll)) };
  }
  const b = await createCoreShell({ brushFn: null, storage: store(dir) }); b.commitDoc(lead());
  await b.insertPiece(P1); await b.insertPiece(P2);
  const d2 = D.parse(b.text()), fg = figures(d2, SMARKS);
  out['driven pieces added at the head (S then ease-out)'] = { sha256: sha(b.text()), sameBytesAsProject: sha(b.text()) === out['driven S (reopened project)'].sha256, pieces: d2.pieces.length, turnA: +f2(fg.turnA), peakAt: +f2(fg.peakAt), turnB: +f2(fg.turnB), bank: fg.bank.map((x) => x.at + ' m: ' + f2(x.got) + ' (mark ' + x.want + ')'), halts: fg.halts };
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error('FAILED', e.stack); process.exit(1); });
