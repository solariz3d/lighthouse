// attack5.js: a lap WITH A JUMP (the flight inside a wrapped run, and the flight next to the line), and the selection highlight across the line
const W = 'C:/Users/nname/Desktop/worktrees/a-merge-wt/'; const fs = require('fs');
const D = require(W + 'src/core/document.js'), PC = require(W + 'src/core/piece.js'), AD = require(W + 'src/core/adapter.js'), G = require(W + 'src/geom/index.js'), { extend } = require(W + 'src/core/extend.js'), { close } = require(W + 'src/core/close.js'), { jump } = require(W + 'src/core/jump.js');
const SL = require(W + 'app/core/selectionlayer.js'); const { createCoreShell } = require(W + 'app/core/coreshell.js');
const R = 180, Q = (Math.PI * R) / 2, TAU = 2 * Math.PI; const rows = [];
const check = (id, what, got, expect, note = '') => { const ok = JSON.stringify(got) === JSON.stringify(expect); rows.push({ id, what, got, expect, ok, note }); console.log(`${ok ? 'ok  ' : 'DIFF'} ${id} ${what}: ${JSON.stringify(got)}${ok ? '' : `  (expected ${JSON.stringify(expect)})`}${note ? '  | ' + note : ''}`); };
const tryit = (fn) => { try { return { ok: fn() }; } catch (e) { return { code: e.code || e.name, msg: String(e.message).slice(0, 150) }; } };
// the jump lap: a straight, a jump, road, four quarter turns, a straight; closed
let d = extend(D.createDoc('jump lap'), { length: 300, family: 'bowl' }); d = jump(d, { gap: 15, drop: 1, land: -0.02 }); d = extend(d, { length: 300 }); for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); d = extend(d, { length: 60, transition: 40, targets: { kh: 0 } });
const r = close(d, { edited: [0] }); console.log('jump lap closes:', r.converged, r.report && r.report.slice(0, 60)); const H = r.doc, n = H.pieces.length; console.log('   pieces:', H.pieces.map((P) => P.type[0] + (P.length || P.gap)).join(' '));
const kinds = (run) => run.pieces.map((P) => P.type).join(',');
for (const [f, t] of [[n - 1, 0], [n - 1, 1], [n - 1, 2], [n - 2, 2], [2, 1]]) { const a = tryit(() => PC.saveRun(H, f, t, { name: 'x' })); check(`J-${f}..${t}`, `run across the line (${H.pieces.slice(f).concat(H.pieces.slice(0, t + 1)).map((P) => P.type[0]).join('')})`, a.ok ? 'KEPT' : a.code + ' ' + a.msg.slice(0, 80), 'KEPT'); if (a.ok) { const back = tryit(() => PC.insert(D.createDoc('o'), PC.parse(PC.serialize(a.ok)))); check(`J-${f}..${t}-insert`, 'put at an empty head', back.ok ? 'ok' : back.code + ' ' + back.msg.slice(0, 80), 'ok'); } }
// the selection through the shell: a shift-click from the last piece to the piece AFTER the flight
const s = await_(createCoreShell({ brushFn: null, autosaveMs: 0 }));
function await_(p) { return p; }
(async () => {
  const sh = await s; sh.adopt(H); sh.selectPiece(n - 1); sh.selectPiece(2, { extend: true }); const info = sh.selectionInfo(); check('J-sel', 'the short way across the line, the flight included', [info.ids, info.count, info.saveProblem], [H.pieces.slice(n - 1).concat(H.pieces.slice(0, 3)).map((P) => P.id), 4, null]);
  // the highlight: selectionLines for ids in lap order across the line, on the real closed path
  const segs = AD.toSegments(H), path = G.buildPath(segs, { step: 2, closed: true, start: { pos: H.start.pos, theta: H.start.heading, p: H.start.pitch } }), track = { path, segments: segs };
  const pose = { eye: [0, 600, 0], target: [0, 0, 0.001], up: [0, 0, 1], fov: 1.0 }; const lines = SL.selectionLines(track, info.ids, pose, 900, 600);
  const idsDrawn = [...new Set(lines.map((l) => l.id))]; check('J-highlight', 'the highlight draws every selected piece that has road (the flight has none), in lap order', idsDrawn, info.ids.filter((id) => H.pieces.find((P) => P.id === id).type === 'road'));
  check('J-highlight-first', 'the first line is the last piece of the lap (the run starts before the line)', lines[0].id, H.pieces[n - 1].id);
  console.log('summary:', rows.filter((r) => !r.ok).map((r) => r.id).join(', ') || 'none differ'); fs.writeFileSync(require('path').join(__dirname, 'attack5_rows.json'), JSON.stringify(rows, null, 1));
})();
