// e270.js (pane E, L270 role 3): the ghost fix varied, with ONE preview model kept across every step (as the page keeps one), not a fresh model per row.
// node e270.js <tree> <out.jsonl>. For each case: the ghost the app sends, built on the live model; then the act (Extend as shown, Jump, Undo, Place);
// the live model updated; the ghost's path and head against the road it now shows, by s; and a hash of the ghost (path and mesh) for tree-to-tree comparison.
'use strict';
const path = require('path'), fs = require('fs'), crypto = require('crypto'), T = path.resolve(process.argv[2]), OUT = process.argv[3];
const D = require(path.join(T, 'src/core/document.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const { createTrackModel } = require(path.join(T, 'app/preview/trackmodel.js'));
const { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const PC = require(path.join(T, 'src/core/piece.js'));
const DEG = Math.PI / 180;
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
const rows = [];
const doc = (s) => s.getState().history.present;
const lenOf = (s) => doc(s).pieces.reduce((a, P) => a + P.length, 0);
const asShown = (s, f = {}) => extendOptions({ ...BLANK, ...f, head: s.headState() });

// the position on path P at lap distance s (linear between stations)
function at(P, s) {
  const S = P.samples; let lo = 0, hi = S.length - 1;
  if (s <= S[0].s) return S[0].pos; if (s >= S[hi].s) return S[hi].pos;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; }
  const a = S[lo], b = S[hi], t = (s - a.s) / (b.s - a.s); return a.pos.map((v, i) => v + t * (b.pos[i] - v));
}
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
// the ghost against the shown road, from lap distance s0 on: worst over the ghost's stations, the head, and the station count each side
function against(g, shown, s0) {
  let worst = 0, atS = null, n = 0;
  for (const x of g.path.samples) { if (x.s < s0 - 1e-9) continue; n++; const d = dist(x.pos, at(shown, x.s)); if (d > worst) { worst = d; atS = x.s; } }
  return { worst: +worst.toFixed(6), atS: atS === null ? null : +atS.toFixed(1), head: +dist(g.head.pos, shown.head.pos).toFixed(6), stations: n, endS: [+g.path.lengthM.toFixed(3), +shown.lengthM.toFixed(3)] };
}
// the drawn mesh too: each ghost batch matched by key to the shown model's batch, world positions compared (same vertex count only)
function meshAgainst(gb, tm, fromPiece) {
  const BO = require(path.join(T, 'app/preview/batches.js')), mine = BO.batchesOf(tm.mesh, fromPiece);
  let worst = 0, matched = 0, missing = 0, sized = 0;
  if (mine.length !== gb.length) missing = Math.abs(mine.length - gb.length);
  for (let i = 0; i < gb.length; i++) { const b = gb[i];
    const o = mine[i]; if (!o || o.key !== b.key || o.piece !== b.piece) { missing++; continue; } if (o.positions.length !== b.positions.length) { sized++; continue; } matched++;
    const w = (B, k) => { const M = B.model, x = B.positions[k], y = B.positions[k + 1], z = B.positions[k + 2]; return [x * M[0] + y * M[4] + z * M[8] + M[12], x * M[1] + y * M[5] + z * M[9] + M[13], x * M[2] + y * M[6] + z * M[10] + M[14]]; };
    for (let k = 0; k < b.positions.length; k += 3) worst = Math.max(worst, dist(w(b, k), w(o, k)));
  }
  return { worst: +worst.toFixed(6), matched, missing, sized, of: gb.length };
}
const hashGhost = (g) => crypto.createHash('sha256').update(JSON.stringify([g.path.samples.map((x) => x.pos), g.head.pos, g.relaid, g.batches.map((b) => [b.key, Array.from(b.positions), Array.from(b.model)])])).digest('hex').slice(0, 16);
const liftAtHead = (s) => { const P = doc(s).pieces.at(-1); return P.type === 'road' && P.channels.l ? { l: +D.channelAt(P, 'l', P.length).v.toFixed(4), h: +D.channelAt(P, 'h', P.length).v.toFixed(4), w: +D.channelAt(P, 'w', P.length).v.toFixed(4) } : null; };

async function shellWith(pieces, storage) { const s = await createCoreShell({ autosaveMs: 0, ...(storage ? { storage } : {}) }); for (const o of pieces) s.extend({ family: 'bowl', ...o }); return s; }
const FLAT = [{ length: 1000 }, { length: 1000, targets: { w: 14 } }];
const HIS = [{ length: 1000 }, { length: 1000, targets: { phi: 88.45 * DEG }, bankShape: 'rounded' }];
const notes = [];
const said = (m) => { if (m && !/^brush widened|^the brush was widened/.test(m)) return m; if (m) notes.push(m.slice(0, 80)); return null; };
function grab(s, set, { s0, r, sculpt = true }) { if (sculpt) s.setSculpt(true); const d0 = s.getState().history.present; s.beginFollow({ s0, r }); s.brushTo(set); s.endBrush(); const m = s.getState().message; s.setSculpt(false); if (s.getState().history.present === d0) return 'NOTHING CHANGED: ' + m; return said(m); }
function local(s, channel, delta, { s0, r }) { const d0 = s.getState().history.present; s.beginBrush({ mode: 'local', channel, s0, r }); s.brushTo(delta); s.endBrush(); const m = s.getState().message; if (s.getState().history.present === d0) return 'NOTHING CHANGED: ' + m; return said(m); }

async function run(name, setup, act, { cheap = false, kind = 'next', fresh = false } = {}) {
  const rec = { name, kind, cheap }; notes.length = 0;
  try {
    const tm = createTrackModel(), sync = (s) => tm.update(s.getState().resolved);
    const s = await setup(sync);   // setup syncs the live model after each committed step it makes
    sync(s); rec.head = liftAtHead(s); rec.lifted = typeof s.getState().resolved.lift === 'function';
    const n = s.getState().resolved.segments.length, s0 = lenOf(s);
    let cand;
    if (kind === 'next') { const o = asShown(s); rec.optsW = o.targets && 'w' in o.targets ? o.targets.w : '(none)'; cand = s.candidate(o, cheap ? { coarse: true } : {}); }
    else if (kind === 'jump') cand = s.candidateJump(asShown(s, { length: 60 }));
    else if (kind === 'undo') { const ug = s.getState().undoGhost; if (!ug) throw new Error('no undo ghost'); cand = ug.candidate; }
    else if (kind === 'piece') { const pg = s.getState().pieceGhost; if (!pg) throw new Error(`no piece ghost: ${s.getState().message}`); cand = pg.candidate; }
    rec.candLift = typeof cand.lift === 'function';
    const model = fresh ? (() => { const t = createTrackModel(); t.update(s.getState().resolved); return t; })() : tm;
    const g = model.ghostFor(cand, cheap ? { cheap: true } : {});
    rec.relaid = g.relaid === undefined ? null : g.relaid; rec.hash = hashGhost(g); rec.batches = g.batches.length;
    const from = Number.isInteger(g.relaid) ? s.getState().resolved.segments.slice(0, g.relaid).reduce((a, x) => a + x.length, 0) : s0;
    // the act, then the live model shows the result
    const ref = await act(s, n); sync(s); if (ref && ref.msg) rec.actMsg = ref.msg;
    const shown = ref && ref.path ? ref.path : tm.path;
    rec.path = against(g, shown, from);
    if (!cheap) rec.mesh = meshAgainst(g.batches, ref && ref.tm ? ref.tm : tm, Number.isInteger(g.relaid) ? g.relaid : n);
    rec.after = liftAtHead(s); if (notes.length) rec.notes = notes.slice();
  } catch (e) { rec.error = String(e && e.message || e).slice(0, 300); }
  rows.push(rec); process.stdout.write(JSON.stringify(rec) + '\n');
}
const extendAsShown = async (s) => { const o = asShown(s); s.extend(o); return { msg: s.getState().message }; };

(async () => {
  // ---- a. width brush at the head WITH a sideways offset at the head (one grab sets both), next piece as shown
  for (const [w, l, d, r] of [[3, 2, 10, 30], [-3, 2, 10, 30], [3, -1.5, 25, 40], [6, 2, 5, 20]])
    await run(`a grab w${w} l${l} at end-${d} r${r}`, async (sync) => { const s = await shellWith(FLAT); sync(s); const m = grab(s, { w, l }, { s0: 2000 - d, r }); if (m) throw new Error('grab: ' + m); return s; }, extendAsShown);
  // a2: two steps: a lateral grab, then the app's width brush (rate, the shell's default brushFn), each synced
  await run('a2 l grab then width rate brush', async (sync) => { const s = await shellWith(FLAT); sync(s); let m = grab(s, { l: 2 }, { s0: 1990, r: 30 }); if (m) throw new Error(m); sync(s); s.setSculpt(true); s.beginBrush({ mode: 'rate', channel: 'w', s0: 1995, r: 20 }); s.brushTo(1.37); s.endBrush(); m = said(s.getState().message); s.setSculpt(false); if (m) throw new Error('w brush: ' + m); return s; }, extendAsShown);
  // ---- b. width brush, NO offset (the hold alone)
  for (const [w, d, r] of [[3, 10, 30], [-3, 10, 30], [5, 19, 20]])
    await run(`b grab w${w} at end-${d} r${r}`, async (sync) => { const s = await shellWith(FLAT); sync(s); const m = grab(s, { w }, { s0: 2000 - d, r }); if (m) throw new Error(m); return s; }, extendAsShown);
  // ---- e. height offset at the head, and both, next piece
  await run('e h grab at head', async (sync) => { const s = await shellWith(FLAT); sync(s); const m = grab(s, { h: 2 }, { s0: 1980, r: 60 }); if (m) throw new Error(m); return s; }, extendAsShown);
  await run('e h+l grab at head', async (sync) => { const s = await shellWith(FLAT); sync(s); const m = grab(s, { h: 1.5, l: -2 }, { s0: 1985, r: 40 }); if (m) throw new Error(m); return s; }, extendAsShown);
  await run('e local lateral at head (Sculpt off)', async (sync) => { const s = await shellWith(FLAT); sync(s); const m = local(s, 'lateral', 2, { s0: 1980, r: 60 }); if (m) throw new Error(m); return s; }, extendAsShown);
  // the same with a FRESH model (P's rows' way) for the comparison
  await run('e local lateral at head (Sculpt off), fresh model', async (sync) => { const s = await shellWith(FLAT); sync(s); const m = local(s, 'lateral', 2, { s0: 1980, r: 60 }); if (m) throw new Error(m); return s; }, extendAsShown, { fresh: true });
  // ---- banked (re-laid tail) with the offset reaching the head: lifted once, not twice
  await run('3 bank, l grab at head', async (sync) => { const s = await shellWith(HIS); sync(s); const m = local(s, 'lateral', 2, { s0: 1980, r: 60 }); if (m) throw new Error(m); return s; }, extendAsShown);
  await run('3 bank, h grab mid + l at head', async (sync) => { const s = await shellWith(HIS); sync(s); let m = local(s, 'height', 2, { s0: 1500, r: 200 }); if (m) throw new Error(m); sync(s); m = local(s, 'lateral', -1.5, { s0: 1985, r: 40 }); if (m) throw new Error(m); return s; }, extendAsShown);
  await run('3 bank, w+l grab at head', async (sync) => { const s = await shellWith(HIS); sync(s); const m = grab(s, { w: 3, l: 2 }, { s0: 1990, r: 30 }); if (m) throw new Error(m); return s; }, extendAsShown);
  // ---- f. the cheap (drag) ghost
  for (const [nm, setup] of [
    ['f cheap, flat no offset', async (sync) => { const s = await shellWith(FLAT); sync(s); return s; }],
    ['f cheap, l at head', async (sync) => { const s = await shellWith(FLAT); sync(s); const m = local(s, 'lateral', 2, { s0: 1980, r: 60 }); if (m) throw new Error(m); return s; }],
    ['f cheap, w+l grab at head', async (sync) => { const s = await shellWith(FLAT); sync(s); const m = grab(s, { w: 3, l: 2 }, { s0: 1990, r: 30 }); if (m) throw new Error(m); return s; }],
    ['f cheap, bank l at head', async (sync) => { const s = await shellWith(HIS); sync(s); const m = local(s, 'lateral', 2, { s0: 1980, r: 60 }); if (m) throw new Error(m); return s; }],
  ]) await run(nm, setup, async (s) => { s.extend(asShown(s)); return { msg: s.getState().message }; }, { cheap: true });
  // ---- d. Jump ghost from an l and an h head; and the next piece after a placed jump
  for (const [nm, ch, delta] of [['d jump, l at head', 'lateral', 2], ['d jump, h at head', 'height', 2]])
    await run(nm, async (sync) => { const s = await shellWith(FLAT); sync(s); const m = local(s, ch, delta, { s0: 1980, r: 60 }); if (m) throw new Error(m); return s; }, async (s) => { s.jump(asShown(s, { length: 60 })); return { msg: s.getState().message }; }, { kind: 'jump' });
  await run('d jump after w+l grab', async (sync) => { const s = await shellWith(FLAT); sync(s); const m = grab(s, { w: 3, l: 2 }, { s0: 1990, r: 30 }); if (m) throw new Error(m); return s; }, async (s) => { s.jump(asShown(s, { length: 60 })); return { msg: s.getState().message }; }, { kind: 'jump' });
  await run('d next piece after a placed jump, l at take-off', async (sync) => { const s = await shellWith(FLAT); sync(s); const m = local(s, 'lateral', 2, { s0: 1980, r: 60 }); if (m) throw new Error(m); sync(s); s.jump(asShown(s, { length: 60 })); const jm = s.getState().message; sync(s); s.extend(asShown(s)); sync(s); if (!s.getState().resolved.segments) throw new Error(jm); return s; }, extendAsShown);
  // ---- c. Undo: one, two, Undo then Redo, and Undo of the grab itself
  const undoCase = (nm, steps, kind, act) => run(nm, async (sync) => { const s = await shellWith(FLAT); sync(s); const m = local(s, 'lateral', 2, { s0: 1980, r: 60 }); if (m) throw new Error(m); sync(s); for (const f of steps) { f(s); sync(s); } return s; }, act, { kind });
  // the reference for an undo ghost: the road as it was before the Undo, kept as a model of its own
  const keep = {};
  const ext = (s) => { s.extend(asShown(s)); keep.was = (() => { const t = createTrackModel(); t.update(s.getState().resolved); return t; })(); };
  const ext2 = (s) => { s.extend(asShown(s, { length: 80, turn: '20' })); keep.was2 = (() => { const t = createTrackModel(); t.update(s.getState().resolved); return t; })(); };
  await undoCase('c undo one', [ext, (s) => s.undo()], 'undo', async () => ({ path: keep.was.path, tm: keep.was }));
  await undoCase('c undo two (second removed)', [ext, ext2, (s) => s.undo(), (s) => s.undo()], 'undo', async () => ({ path: keep.was.path, tm: keep.was }));
  await undoCase('c undo two, first undo ghost', [ext, ext2, (s) => s.undo()], 'undo', async () => ({ path: keep.was2.path, tm: keep.was2 }));
  await undoCase('c undo then redo, next piece', [ext, (s) => s.undo(), (s) => s.redo()], 'next', extendAsShown);
  await undoCase('c undo the grab, next piece', [(s) => s.undo()], 'next', extendAsShown);
  await run('c undo after w+l grab and extend', async (sync) => { const s = await shellWith(FLAT); sync(s); const m = grab(s, { w: 3, l: 2 }, { s0: 1990, r: 30 }); if (m) throw new Error(m); sync(s); ext(s); sync(s); s.undo(); return s; }, async () => ({ path: keep.was.path, tm: keep.was }), { kind: 'undo' });
  // ---- the saved piece's ghost after a w+l grab
  const store = async () => { const src = await createCoreShell({ autosaveMs: 0 }); src.extend({ family: 'bowl', length: 300 }); src.extend({ family: 'bowl', length: 100 }); const pieces = new Map([['straight', PC.serialize(PC.saveRun(src.getState().history.present, 1, 1, { name: 'straight' }))]]);
    return { listPieces: async () => [...pieces.keys()], openPiece: async (n) => pieces.get(n), backupDoc: async () => 'b', saveUndo: async () => {}, openUndo: async () => null, saveAutosave: async () => {}, clearAutosave: async () => {}, openAutosave: async () => null }; };
  await run('piece after w+l grab', async (sync) => { const s = await shellWith(FLAT, await store()); sync(s); const m = grab(s, { w: 3, l: 2 }, { s0: 1990, r: 30 }); if (m) throw new Error(m); sync(s); await s.showPiece('straight'); return s; }, async (s) => { await s.placePiece(); return { msg: s.getState().message }; }, { kind: 'piece' });
  // ---- no offsets anywhere: plain roads, a level head, a turn, a bank; for tree-to-tree hashes
  for (const [nm, pcs] of [['0 plain', [{ length: 500 }]], ['0 turn', [{ length: 300 }, { length: 400, targets: { kh: 1 / 300 } }]], ['0 bank', HIS], ['0 width typed', FLAT]])
    await run(nm, async (sync) => { const s = await shellWith(pcs); sync(s); return s; }, extendAsShown);
  if (OUT) fs.writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
})().catch((e) => { console.error(e); process.exit(1); });
