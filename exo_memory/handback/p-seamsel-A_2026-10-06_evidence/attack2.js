// attack2.js: the non-author look at f13cded, part 2 (merged tree a-merge-wt). Compact output.
const W = 'C:/Users/nname/Desktop/worktrees/a-merge-wt/';
const fs = require('fs'), path = require('path');
const D = require(W + 'src/core/document.js'), PC = require(W + 'src/core/piece.js'), AD = require(W + 'src/core/adapter.js'), G = require(W + 'src/geom/index.js'), { extend } = require(W + 'src/core/extend.js'), { close } = require(W + 'src/core/close.js');
const { createCoreShell } = require(W + 'app/core/coreshell.js'); const { makeExporter } = require(W + 'app/export/export.js');
const R = 180, Q = (Math.PI * R) / 2, TAU = 2 * Math.PI;
const rows = []; const check = (id, what, got, expect, note = '') => { const ok = JSON.stringify(got) === JSON.stringify(expect); rows.push({ id, what, got, expect, ok, note }); console.log(`${ok ? 'ok  ' : 'DIFF'} ${id} ${what}: ${JSON.stringify(got)}${ok ? '' : `  (expected ${JSON.stringify(expect)})`}${note ? '  | ' + note : ''}`); };
const tryit = (fn) => { try { return { ok: fn() }; } catch (e) { return { code: e.code || e.name, msg: String(e.message).slice(0, 140) }; } };
const closedOk = (r) => { if (!r.converged) throw new Error('did not close: ' + r.report); return r.doc; };
const lapLegacy = (roll = 0) => { let d = extend(D.createDoc('lap'), { length: 300, family: 'bowl' }); d = extend(d, { length: Q, transition: roll ? Q : 40, targets: { kh: 1 / R, ...(roll ? { phi: roll } : {}) } }); for (let i = 1; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); d = extend(d, { length: 60, transition: 40, targets: { kh: 0 } }); return closedOk(close(d, { edited: [0] })); };
const lapCup = () => { let d = extend(D.createDoc('cup lap'), { length: 300, family: 'bowl', first: { c: 45 } }); for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R, c: 45 } }); d = extend(d, { length: 60, transition: 40, targets: { kh: 0, c: 45 } }); return closedOk(close(d, { edited: [0] })); };
const lapTube = (roll = 0) => { let d = extend(D.createDoc('tube lap'), { length: 300, first: { w: 40, t: 360 } }); d = extend(d, { length: Q, transition: roll ? Q : 40, targets: { kh: 1 / R, ...(roll ? { phi: roll } : {}) } }); for (let i = 1; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); d = extend(d, { length: 60, transition: 40, targets: { kh: 0 } }); return closedOk(close(d, { edited: [0] })); };
const windOf = (H) => D.pieceEnd(H.pieces[H.pieces.length - 1]).phi.v - H.pieces[0].channels.phi[0];
const roundtrip = (H, f, t) => PC.parse(PC.serialize(PC.saveRun(H, f, t, { name: 'x' })));
const mod = (x) => x - TAU * Math.round(x / TAU);

console.log('── E. ROTATION: put the wrapped run and the REST back at an empty head, in lap order: the track must still CLOSE');
function closure(label, H, f, t) {
  const n = H.pieces.length, a = tryit(() => roundtrip(H, f, t)); if (!a.ok) return check(label, 'saved', a.code, 'kept');
  const parts = [a.ok]; const rest = t + 1 <= f - 1 ? tryit(() => roundtrip(H, t + 1, f - 1)) : null; if (rest) { if (!rest.ok) return check(label, 'the rest saved', rest.code, 'kept'); parts.push(rest.ok); }
  const r = tryit(() => parts.reduce((d, p) => PC.insert(d, p), D.createDoc('rot'))); if (!r.ok) return check(label, 'put back', r.code + ' ' + r.msg, 'put back');
  const doc = r.ok, segs = AD.toSegments(doc), p = G.buildPath(segs, { step: 2, closed: false, start: { pos: doc.start.pos, theta: doc.start.heading, p: doc.start.pitch } }), S = p.samples, a0 = S[0], z = S[S.length - 1];
  const gap = Math.hypot(z.pos[0] - a0.pos[0], z.pos[1] - a0.pos[1], z.pos[2] - a0.pos[2]), tang = Math.hypot(z.T[0] - a0.T[0], z.T[1] - a0.T[1], z.T[2] - a0.T[2]);
  const bank = Math.abs(mod(D.pieceEnd(doc.pieces[doc.pieces.length - 1]).phi.v - doc.pieces[0].channels.phi[0]));
  check(label, `rotated lap (${doc.pieces.length} pieces) closes: end-to-start gap ${gap.toFixed(3)} m, tangent ${tang.toExponential(1)}, bank seam ${bank.toExponential(1)} (mod 2pi)`, gap < 0.05 && tang < 1e-3 && bank < 1e-5, true);
  // the original lap's own closure, as the control (the same measure on the unrotated lap)
  return doc;
}
const laps = { legacy: lapLegacy(0), roll1: lapLegacy(-TAU), rollp: lapLegacy(TAU), cup: lapCup(), tube: lapTube(0) }; try { laps.tuberoll = lapTube(-TAU); } catch (e) { console.log('   (tube + roll not built)'); }
{ const H = laps.legacy, S = G.buildPath(AD.toSegments(H), { step: 2, closed: false, start: { pos: H.start.pos, theta: H.start.heading, p: H.start.pitch } }).samples; console.log(`   control: the ORIGINAL legacy lap, same measure: end-to-start gap ${Math.hypot(S[S.length - 1].pos[0] - S[0].pos[0], S[S.length - 1].pos[1] - S[0].pos[1], S[S.length - 1].pos[2] - S[0].pos[2]).toFixed(4)} m`); }
for (const [name, H] of Object.entries(laps)) { const n = H.pieces.length; for (const [f, t] of [[n - 1, 0], [n - 2, 1], [3, 1]]) closure(`E-${name}-${f}..${t}`, H, f, t); }

console.log('\n── F. BYTE-LEVEL: the wrapped save equals the save of the HAND-BUILT open track (the pieces in lap order, the winding added by my own arithmetic)');
for (const [name, H] of Object.entries(laps)) { const n = H.pieces.length, w = TAU * Math.round(windOf(H) / TAU);
  for (const [f, t] of [[n - 1, 0], [n - 2, 1], [2, 1]]) { const wrapped = tryit(() => PC.serialize(PC.saveRun(H, f, t, { name: 'x' })));
    const hp = [...H.pieces.slice(f), ...H.pieces.slice(0, t + 1).map((P) => (P.type === 'road' && w ? { ...P, channels: { ...P.channels, phi: P.channels.phi.map((v) => v + w) } } : P))];
    const hand = tryit(() => D.checkDoc({ ...H, closed: false, pieces: hp })); const handSave = hand.ok ? tryit(() => PC.serialize(PC.saveRun(hand.ok, 0, hp.length - 1, { name: 'x' }))) : { code: 'no hand doc ' + hand.msg };
    check(`F-${name}-${f}..${t}`, 'the hand-built open track passes checkDoc (every joint C1: an INDEPENDENT proof the winding makes the line smooth)', hand.ok ? 'ok' : hand.msg, 'ok');
    check(`F-${name}-${f}..${t}-bytes`, 'wrapped save text === hand-built save text', wrapped.ok === handSave.ok, true, wrapped.ok ? '' : wrapped.code); } }

console.log('\n── G. THE SHELL');
const store = () => { const m = new Map(); return { pieces: m, listPieces: async () => [...m.keys()].sort(), openPiece: async (n) => m.get(n), savePiece: async (n, t) => { m.set(n, t); }, deletePiece: async (n) => m.delete(n), backupDoc: async () => 'b' }; };
(async () => {
  const H = laps.roll1, n = H.pieces.length, mk = async (doc) => { const s = await createCoreShell({ brushFn: null, autosaveMs: 0, storage: store() }); s.adopt(doc); return s; };
  // delete of a wrapped run
  let s = await mk(H); s.selectPiece(n - 1); s.selectPiece(0, { extend: true }); const before = s.getState().history.present, pastN = s.getState().history.past.length;
  s.deleteSelection(); check('G-del', 'Delete selected on a wrapped run of a closed lap: refused CLOSED, nothing changed', [/^CLOSED/.test(s.getState().message || ''), s.getState().history.present === before, s.getState().history.past.length === pastN, s.getState().deleteProposal === null], [true, true, true, true], (s.getState().message || '').slice(0, 80));
  s.proposeDelete(); check('G-del2', 'proposeDelete called directly on it: also refused by name, no preview', [/CLOSED/.test(s.getState().message || ''), s.getState().deleteProposal === null], [true, true]);
  // my Sculpt on a wrapped selection
  s.setSculpt(true); s.selectPiece(n - 1); s.selectPiece(0, { extend: true }); check('G-sculpt', 'D244b: Sculpt with a WRAPPED selection offers no piece (it needs ONE)', s.sculptInfo(), null); s.beginSculpt({ channel: 'phi' }); check('G-sculpt2', 'beginSculpt on it: refused, no drag', [s.getState().brush, /select ONE piece/.test(s.getState().message || '')], [null, true]);
  // the highlight's ids and the info
  s = await mk(H); s.selectPiece(n - 2); s.selectPiece(1, { extend: true }); const info = s.selectionInfo(); check('G-info', 'a 4-piece wrapped run: ids in lap order, count 4, length the sum of those four, atEnd false', [info.ids, info.count, Math.round(info.lengthM * 100) / 100, info.atEnd, info.from > info.to], [[H.pieces[n - 2].id, H.pieces[n - 1].id, H.pieces[0].id, H.pieces[1].id], 4, Math.round([n - 2, n - 1, 0, 1].reduce((a, i) => a + H.pieces[i].length, 0) * 100) / 100, false, true]);
  // an open track never wraps
  const open = { ...H, closed: false, pieces: H.pieces.slice() }; s = await mk(open); s.selectPiece(n - 1); s.selectPiece(0, { extend: true }); check('G-open', 'an OPEN track never wraps: the run is 0..n-1', [s.selectionInfo().from, s.selectionInfo().to, s.selectionInfo().count], [0, n - 1, n]);
  // a click on the same piece twice, and the anchor staying put across several shift-clicks
  s = await mk(H); s.selectPiece(2); s.selectPiece(2, { extend: true }); check('G-same', 'shift-click on the same piece: one piece', s.selectionInfo().count, 1); s.selectPiece(1); s.selectPiece(5, { extend: true }); const w1 = s.selectionInfo().ids; s.selectPiece(3, { extend: true }); check('G-anchor', 'the first piece stays the anchor: p2 then p6 (across the line) then p4 (inside)', [w1, s.selectionInfo().ids], [[H.pieces[5].id, H.pieces[0].id, H.pieces[1].id], [H.pieces[1].id, H.pieces[2].id, H.pieces[3].id]]);
  // the tie rule through the shell on the KEEPER'S real ovals (READ ONLY): every exact tie stays inside
  const dir = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'tracks'), files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^eq-.*OVAL.*\.t180track$/.test(f)) : []; let tied = 0, wrongWay = 0;
  for (const f of files) { let d; try { d = D.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { continue; } if (!d.closed) continue; const m = d.pieces.length, T = d.pieces.map((P) => Math.round((P.type === 'road' ? P.length : 0) * 1e4)), sum = (a, b) => T.slice(a, b + 1).reduce((x, y) => x + y, 0);
    for (let from = 0; from < m; from++) for (let to = from + 1; to < m; to++) { if (sum(from, to) !== sum(0, m - 1) - sum(from + 1, to - 1)) continue; tied++; const sh = await mk(d); sh.selectPiece(from); sh.selectPiece(to, { extend: true }); const i = sh.selectionInfo(); if (i.from > i.to) wrongWay++; } }
  check('G-tie-real', `on the keeper's real ovals (${files.length} read, read only): every exact tie (${tied}) stays inside the lap`, wrongWay, 0);
  // a saved wrapped run through the shell, put back at an open head, and the whole lap exported both ways
  const ex = await makeExporter(async (p) => fs.readFileSync(path.join(W, p), 'utf8')); const st = store(); const a = await createCoreShell({ brushFn: null, storage: st, exporter: ex, autosaveMs: 0 }); a.adopt(H);
  a.selectPiece(n - 1); a.selectPiece(0, { extend: true }); await a.savePiece('across'); a.selectPiece(1); a.selectPiece(n - 2, { extend: true }); const rest = a.selectionInfo(); check('G-rest', 'the rest of the lap (4 pieces, p2..p5) selected inside', [rest.from, rest.to, rest.count], [1, n - 2, n - 2]); await a.savePiece('rest');
  const b = await createCoreShell({ brushFn: null, storage: st, exporter: ex, autosaveMs: 0 }); b.adopt(D.createDoc('fresh')); await b.insertPiece('across'); await b.insertPiece('rest'); const rot = b.getState().history.present;
  check('G-rot', 'the two saved runs put back at an EMPTY head: the rotated lap has all 6 pieces, joined (no refusal)', [rot.pieces.length, b.getState().messageKind], [n, 'ok'], (b.getState().message || '').slice(0, 80));
  const closedRot = tryit(() => D.checkDoc({ ...rot, closed: true })); check('G-rot-closed', 'marked closed it is a valid closed document', closedRot.ok ? 'ok' : closedRot.msg, 'ok');
  b.commitDoc({ ...rot, closed: true, name: 'rot' }); const ex1 = tryit(() => b.buildExport({})); check('G-export', 'the rotated lap EXPORTS (every check on) like any closed lap', ex1.ok ? ex1.ok.folders.map((f) => f.folder) : ex1.msg, ex1.ok ? ex1.ok.folders.map((f) => f.folder) : 'exports');
  console.log('\nsummary:', rows.filter((r) => !r.ok).map((r) => r.id).join(', ') || 'none differ'); fs.writeFileSync(path.join(__dirname, 'attack2_rows.json'), JSON.stringify(rows, null, 1));
})().catch((e) => { console.error('ERR', e.stack); });
