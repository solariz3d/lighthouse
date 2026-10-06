// attack4.js: the rotated lap built from the saved runs vs the HAND-BUILT rotated lap (my own arithmetic), both exported through the app: the same bytes, or the same refusal
const W = 'C:/Users/nname/Desktop/worktrees/a-merge-wt/'; const fs = require('fs');
const D = require(W + 'src/core/document.js'), { extend } = require(W + 'src/core/extend.js'), { close } = require(W + 'src/core/close.js');
const { createCoreShell } = require(W + 'app/core/coreshell.js'); const { makeExporter } = require(W + 'app/export/export.js');
const R = 180, Q = (Math.PI * R) / 2, TAU = 2 * Math.PI; const rows = [];
const check = (id, what, got, expect, note = '') => { const ok = JSON.stringify(got) === JSON.stringify(expect); rows.push({ id, what, got, expect, ok, note }); console.log(`${ok ? 'ok  ' : 'DIFF'} ${id} ${what}: ${JSON.stringify(got)}${ok ? '' : `  (expected ${JSON.stringify(expect)})`}${note ? '  | ' + note : ''}`); };
const lap = (roll, trans) => { let d = extend(D.createDoc('lap'), { length: 300, family: 'bowl' }); d = extend(d, { length: Q, transition: roll ? trans : 40, targets: { kh: 1 / R, ...(roll ? { phi: roll } : {}) } }); for (let i = 1; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); d = extend(d, { length: 60, transition: 40, targets: { kh: 0 } }); const r = close(d, { edited: [0] }); if (!r.converged) throw new Error('no close'); return r.doc; };
const store = () => { const m = new Map(); return { pieces: m, listPieces: async () => [...m.keys()].sort(), openPiece: async (n) => m.get(n), savePiece: async (n, t) => { m.set(n, t); }, deletePiece: async (n) => m.delete(n), backupDoc: async () => 'b' }; };
const strip = (fl) => fl.flatMap((f) => f.files).filter((f) => f.path !== '.t180b-builder.json');
const exportOf = async (ex, doc) => { const s = await createCoreShell({ brushFn: null, exporter: ex, autosaveMs: 0 }); s.adopt({ ...doc, closed: true }); try { return { files: strip(s.buildExport({}).folders) }; } catch (e) { return { err: String(e.message).slice(0, 110) }; } };
(async () => {
  const ex = await makeExporter(async (p) => fs.readFileSync(W + p, 'utf8'));
  for (const [label, roll, trans] of [['no roll', 0, 40], ['a whole roll over one piece (fast)', -TAU, Q], ['a whole roll slowly (over 2 pieces)', -TAU, Q]]) {
    let H; try { H = lap(roll, trans); } catch (e) { console.log(label, 'not built'); continue; } const n = H.pieces.length, w = TAU * Math.round((D.pieceEnd(H.pieces[n - 1]).phi.v - H.pieces[0].channels.phi[0]) / TAU);
    const st = store(), a = await createCoreShell({ brushFn: null, storage: st, exporter: ex, autosaveMs: 0 }); a.adopt(H);
    a.selectPiece(n - 1); a.selectPiece(0, { extend: true }); await a.savePiece('across'); a.selectPiece(1); a.selectPiece(3, { extend: true }); await a.savePiece('rest1'); a.selectPiece(4); await a.savePiece('rest2');
    const b = await createCoreShell({ brushFn: null, storage: st, exporter: ex, autosaveMs: 0 }); b.adopt(D.createDoc('fresh')); for (const nm of ['across', 'rest1', 'rest2']) await b.insertPiece(nm); const viaSaved = b.getState().history.present;
    // the hand-built twin: the pieces in lap order from p6, the winding added to p1..p5 by my own arithmetic, ids renumbered p1..p6, start as a fresh document's
    const order = [H.pieces[n - 1], ...H.pieces.slice(0, n - 1).map((P) => (P.type === 'road' && w ? { ...P, channels: { ...P.channels, phi: P.channels.phi.map((v) => v + w) } } : P))];
    const hand = D.createDoc('fresh'); let hd = hand; for (const P of order) { const { id, ...rest } = P; hd = D.appendPiece(hd, rest); }
    const same = JSON.stringify(viaSaved.pieces.map((P) => ({ ...P, id: null }))) === JSON.stringify(hd.pieces.map((P) => ({ ...P, id: null })));
    // (the saved-run document starts at the saved start's absolute state; compare channels with the first piece's start taken from the saved run)
    check(label + ' docs', 'the document made from the saved runs has the same pieces as the hand-built one (ids aside)', same, true, same ? '' : `first piece start phi: saved ${viaSaved.pieces[0].channels.phi[0]} vs hand ${hd.pieces[0].channels.phi[0]}`);
    const A = await exportOf(ex, viaSaved), B = await exportOf(ex, same ? hd : { ...hd });
    if (A.files && B.files) check(label + ' export', 'saved-runs lap and hand-built lap export the SAME BYTES', [A.files.length, A.files.every((f, k) => Buffer.from(f.bytes).equals(Buffer.from(B.files[k].bytes)))], [B.files.length, true]);
    else check(label + ' export', 'saved-runs lap and hand-built lap give the SAME result (bytes, or the same refusal)', [A.err || 'exports', B.err || 'exports'], [B.err || 'exports', B.err || 'exports'], `saved: ${A.err || 'exports'} | hand: ${B.err || 'exports'}`);
  }
  console.log('summary:', rows.filter((r) => !r.ok).map((r) => r.id).join(', ') || 'none differ'); fs.writeFileSync(require('path').join(__dirname, 'attack4_rows.json'), JSON.stringify(rows, null, 1));
})().catch((e) => console.error('ERR', e.stack));
