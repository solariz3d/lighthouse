// attack3.js: the corrected rotation + export through the shell (the rest of the lap saved as the two INSIDE runs C's own row uses)
const W = 'C:/Users/nname/Desktop/worktrees/a-merge-wt/'; const fs = require('fs');
const D = require(W + 'src/core/document.js'), PC = require(W + 'src/core/piece.js'), { extend } = require(W + 'src/core/extend.js'), { close } = require(W + 'src/core/close.js');
const { createCoreShell } = require(W + 'app/core/coreshell.js'); const { makeExporter } = require(W + 'app/export/export.js');
const R = 180, Q = (Math.PI * R) / 2, TAU = 2 * Math.PI; const rows = [];
const check = (id, what, got, expect, note = '') => { const ok = JSON.stringify(got) === JSON.stringify(expect); rows.push({ id, what, got, expect, ok, note }); console.log(`${ok ? 'ok  ' : 'DIFF'} ${id} ${what}: ${JSON.stringify(got)}${ok ? '' : `  (expected ${JSON.stringify(expect)})`}${note ? '  | ' + note : ''}`); };
const tryit = (fn) => { try { return { ok: fn() }; } catch (e) { return { code: e.code || e.name, msg: String(e.message).slice(0, 140) }; } };
const lap = (roll) => { let d = extend(D.createDoc('lap'), { length: 300, family: 'bowl' }); d = extend(d, { length: Q, transition: roll ? Q : 40, targets: { kh: 1 / R, ...(roll ? { phi: roll } : {}) } }); for (let i = 1; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); d = extend(d, { length: 60, transition: 40, targets: { kh: 0 } }); const r = close(d, { edited: [0] }); if (!r.converged) throw new Error('no close'); return r.doc; };
const store = () => { const m = new Map(); return { pieces: m, listPieces: async () => [...m.keys()].sort(), openPiece: async (n) => m.get(n), savePiece: async (n, t) => { m.set(n, t); }, deletePiece: async (n) => m.delete(n), backupDoc: async () => 'b' }; };
(async () => {
  const ex = await makeExporter(async (p) => fs.readFileSync(W + p, 'utf8'));
  for (const [label, roll] of [['no roll', 0], ['one whole roll', -TAU]]) {
    const H = lap(roll), n = H.pieces.length, st = store(), a = await createCoreShell({ brushFn: null, storage: st, exporter: ex, autosaveMs: 0 }); a.adopt(H);
    a.selectPiece(n - 1); a.selectPiece(0, { extend: true }); await a.savePiece('across'); a.selectPiece(1); a.selectPiece(3, { extend: true }); const r1 = a.selectionInfo(); check(label + ' rest1', 'p2..p4 is selected inside (the short way)', [r1.from, r1.to, r1.count], [1, 3, 3]); await a.savePiece('rest1'); a.selectPiece(4); await a.savePiece('rest2');
    a.selectPiece(1); a.selectPiece(n - 2, { extend: true }); const longer = a.selectionInfo(); check(label + ' longrun', 'the rest of the lap as ONE run (p2..p5) is not selectable inside: the short way across the line wins (C documents this cost)', longer.from > longer.to, true);
    const b = await createCoreShell({ brushFn: null, storage: st, exporter: ex, autosaveMs: 0 }); b.adopt(D.createDoc('fresh')); for (const nm of ['across', 'rest1', 'rest2']) await b.insertPiece(nm); const rot = b.getState().history.present;
    check(label + ' rot', 'the three runs put back at an EMPTY head: the rotated lap has all 6 pieces, no refusal', [rot.pieces.length, b.getState().messageKind], [n, 'ok'], (b.getState().message || '').slice(0, 70));
    b.commitDoc({ ...rot, closed: true, name: 'rot' }); const e1 = tryit(() => b.buildExport({})); check(label + ' export', 'the rotated lap (marked closed) EXPORTS with every check on', e1.ok ? 'exports ' + e1.ok.folders.length + ' folder(s)' : e1.msg, 'exports 1 folder(s)');
    const ctl = tryit(() => a.buildExport({})); check(label + ' ctl', 'the original lap exports (control)', ctl.ok ? 'exports ' + ctl.ok.folders.length + ' folder(s)' : ctl.msg, 'exports 1 folder(s)');
    if (e1.ok && ctl.ok) { const strip = (fl) => fl.flatMap((f) => f.files).filter((f) => f.path !== '.t180b-builder.json'); const A = strip(ctl.ok.folders), B = strip(e1.ok.folders); check(label + ' files', 'the same set of files in both', [A.length, B.length, A.map((f) => f.path.split('/').pop()).sort().join() === B.map((f) => f.path.split('/').pop()).sort().join()], [A.length, A.length, true]);
      // the geometry files (the kn5 and the ai line) differ because the start line moved; the lap LENGTH must be the same
      const lenOf = (fl) => { const f = fl.find((x) => /fast_lane\.ai$|\.ai$/.test(x.path)); return f ? f.bytes.length : null; }; check(label + ' ai-size', 'the AI line file has the same size (the same lap, a different start)', lenOf(B) === lenOf(A), true, `ai bytes ${lenOf(A)} vs ${lenOf(B)}`); } }
  console.log('summary:', rows.filter((r) => !r.ok).map((r) => r.id).join(', ') || 'none differ'); fs.writeFileSync(require('path').join(__dirname, 'attack3_rows.json'), JSON.stringify(rows, null, 1));
})().catch((e) => console.error('ERR', e.stack));
