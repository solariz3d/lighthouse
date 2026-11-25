// L226 (pane A): lay the S (route 1c) through the panel's own calls, save it as a project and as two pieces into a STAGE folder
// (a copy of the app's layout), reopen by the app's own load path, read the built road. node stage.js <stage dir>
// Tree: ROUTE_TREE (default C:/Consonance/t180-wt-flow, p-flow-ai 27e2084). The harness is pane O's route.js, sliced, not rewritten.
'use strict';
const fs = require('fs'), path = require('path');
const T = process.env.ROUTE_TREE || 'C:/Consonance/t180-wt-flow';
const OROUTE = process.env.OROUTE || 'C:/Consonance/lighthouse/exo_memory/handback/p-d677-t180-route-O_2026-11-24_evidence/route.js';
const src = fs.readFileSync(OROUTE, 'utf8').replace("process.env.ROUTE_TREE || 'G:/consonance-scratch/o-route-t180'", JSON.stringify(T));
const tmp = path.join(process.argv[2], '_route.js'); fs.mkdirSync(process.argv[2], { recursive: true }); fs.writeFileSync(tmp, src);
const O = require(tmp), { D, RP } = O, LEAD = O.LEAD;
const PC = require(T + '/src/core/piece.js'), { createCoreShell } = require(T + '/app/core/coreshell.js');
const NAME = 'Smooth S flow L', P1 = 'Smooth S flow', P2 = 'Smooth S ease-out';
const ROUTE = [{ L: 200, turn: 176, bank: -27, flow: true, at: 55, rows: [['turn', -176, 80], ['bank', 0, 112], ['bank', 26, 157]] }, { L: 150, bank: 0, flow: true, at: 100 }];
const MARKS = [[55, -27], [112, 0], [157, 26], [200, 26], [300, 0]];
const M = [{ s: LEAD, deg: 0 }, ...MARKS.map(([at, deg]) => ({ s: LEAD + at, deg }))];
const store = (dir) => {
  const d = (sub, n, ext) => { fs.mkdirSync(path.join(dir, sub), { recursive: true }); return path.join(dir, sub, n + ext); };
  return {
    saveDoc: async (n, b) => fs.writeFileSync(d('tracks', n, '.t180track'), b), openDoc: async (n) => fs.readFileSync(d('tracks', n, '.t180track'), 'utf8'),
    saveUndo: async (n, b) => fs.writeFileSync(d('tracks', n, '.t180undo'), b), openUndo: async (n) => (fs.existsSync(d('tracks', n, '.t180undo')) ? fs.readFileSync(d('tracks', n, '.t180undo'), 'utf8') : null),
    savePiece: async (n, b) => { const f = d('pieces', n, '.t180piece'); if (fs.existsSync(f)) throw new Error(`a piece named "${n}" already exists`); fs.writeFileSync(f, b); },
    openPiece: async (n) => fs.readFileSync(d('pieces', n, '.t180piece'), 'utf8'),
    listPieces: async () => (fs.existsSync(path.join(dir, 'pieces')) ? fs.readdirSync(path.join(dir, 'pieces')).filter((x) => x.endsWith('.t180piece')).map((x) => x.slice(0, -10)) : []),
    deletePiece: async () => {}, listDocs: async () => [], saveAutosave: async () => {}, clearAutosave: async () => {}, openAutosave: async () => null, backupDoc: async () => {}, listBackups: async () => [], docSavedAt: async () => null,
  };
};
const worst = (doc, label) => {
  const r = O.read(doc), at = (s) => RP.near(r, s).b, out = [];
  const pk = r.filter((x) => x.s >= LEAD - 10), top = pk.reduce((a, x) => (Math.abs(x.h) > Math.abs(a.h) ? x : a)), end = pk[pk.length - 1];
  const want = { 55: -27, 112: 0, 157: 26 };
  for (const [at0, deg] of Object.entries(want)) out.push({ mark: `${at0} m`, want: deg, got: +at(LEAD + +at0).toFixed(2), miss: +Math.abs(at(LEAD + +at0) - deg).toFixed(2) });
  const B = RP.builtBank(doc).filter((x) => x.s >= LEAD - 20 && x.s <= M[M.length - 1].s + 50);
  const ref = (s) => { for (let k = 0; k + 1 < M.length; k++) { if (s < M[k].s || s > M[k + 1].s) continue; const tA = (j) => j > 0 && j + 1 < M.length && Math.sign(M[j].deg - M[j - 1].deg) !== Math.sign(M[j + 1].deg - M[j].deg); if ((tA(k) && s - M[k].s < 10) || (tA(k + 1) && M[k + 1].s - s < 10)) return 0; return (M[k + 1].deg - M[k].deg) / (M[k + 1].s - M[k].s); } return 0; };
  const halts = RP.stops(B, ref);
  return { label, turnA: +top.h.toFixed(2), turnB: +(end.h - top.h).toFixed(2), turnAmiss: +Math.abs(top.h - 89.8).toFixed(2), turnBmiss: +Math.abs((end.h - top.h) + 89.8).toFixed(2), marks: out, worstBankMiss: Math.max(...out.map((o) => o.miss)), halts: halts.length };
};
(async () => {
  const stage = process.argv[2], res = {};
  // 1. lay the route through the panel's own Extend (the calls O recorded), then save the project and the two pieces through the shell's own save paths
  const p = await O.mountPanel(); p.shell = p.shell;
  const laid = []; for (const s of ROUTE) laid.push(await O.piece(p, s));
  res.laid = laid.map((l) => ({ laid: l.laid, sent: JSON.stringify(l.sent), msg: l.msg }));
  const live = D.parse(p.shell.text()); res.pieces = live.pieces.length;
  res.liveRoad = worst(live, 'laid in memory');
  const sh = await createCoreShell({ brushFn: null, storage: store(stage) });
  sh.commitDoc(live);
  await sh.save(NAME);
  for (const [i, n] of [[1, P1], [2, P2]]) { sh.selectPiece(i); await sh.savePiece(n); }
  res.shellMessage = sh.get ? sh.get().message : undefined;
  console.log(JSON.stringify(res));
})().catch((e) => { console.error('FAILED', e.stack); process.exit(1); });
