// a small hand mutation run over the NEW code of D244 / D244b (not the official harnesses): each mutant is applied in place, the new tests run, the file is restored
const fs = require('fs'), { spawnSync } = require('child_process');
const W = process.env.MUTCOPY + '/';
const TESTS = [['app/test/handles.test.js'], ['app/test/core-sculpt.test.js'], ['app/test/core-pieces-ui.test.js', '--test-name-pattern=row 1[123]']];
const M = [
  ['M1 route: heartline not compared', 'app/core/centreline.js', "const ROUTE = Object.freeze(['length', 'k0', 'k1', 'kp0', 'kp1', 'heartline', 'heartline1']);", "const ROUTE = Object.freeze(['length', 'k0', 'k1', 'kp0', 'kp1']);"],
  ['M2 route: roll never compared', 'app/core/centreline.js', "const fields = a.heartline || a.heartline1 || b.heartline || b.heartline1 ? [...ROUTE, ...ROLL] : ROUTE;", "const fields = ROUTE;"],
  ['M3 route: offsets ignored', 'app/core/centreline.js', "if (offsets(baseDoc) !== offsets(newDoc)) return 'a height or sideways offset changed';", ""],
  ['M4 path: a 1 mm tolerance', 'app/core/centreline.js', "if (!Object.is(a[i], b[i])) return", "if (!(Math.abs(a[i] - b[i]) < 1e-3)) return"],
  ['M5 route: the start pose ignored', 'app/core/centreline.js', "if (baseStart && newStart) for (const k of ['theta', 'p']) if (!same(baseStart[k], newStart[k])) return `the start ${k} moved`;", ""],
  ['M6 shell: the per-step guard removed', 'app/core/coreshell.js', "if (b.sculpt) { const moved = CL.routeMoved(", "if (false) { const moved = CL.routeMoved("],
  ['M7 shell: turn is offered', 'app/core/coreshell.js', "const SCULPT_CHANNELS = Object.freeze(['phi', 'c', 'w', 'e', 's', 'r', 't']);", "const SCULPT_CHANNELS = Object.freeze(['phi', 'c', 'w', 'e', 's', 'r', 't', 'kh']);"],
  ['M8 shell: the end-of-drag path check removed', 'app/core/coreshell.js', "if (b.sculpt) { const moved = CL.pathMoved(", "if (false) { const moved = CL.pathMoved("],
  ['M9 shell: the selection is not kept through a sculpt step', 'app/core/coreshell.js', "const keep = b.sculpt && st.selection ?", "const keep = false && st.selection ?"],
  ['M10 shell: the sculpt window is the whole piece twice over', 'app/core/coreshell.js', "s0: pieceOffsets(d)[i] + P.length / 2, r: P.length / 2, sharp", "s0: pieceOffsets(d)[i] + P.length / 2, r: P.length, sharp"],
  ['M11 handles: no floor on the bank lever', 'app/core/handles.js', "Math.max(0.5, Number.isFinite(ctx.half) ? ctx.half : 1)", "Math.max(0, Number.isFinite(ctx.half) ? ctx.half : 1)"],
  ['M12 handles: bank ignores the side', 'app/core/handles.js', "const dir = K.axis === 'T' ? m.T : K.axis === 'L' ? m.L : m.U, sgn = K.sign === 'out' || K.sign === 'up' ? side : 1;", "const dir = K.axis === 'T' ? m.T : K.axis === 'L' ? m.L : m.U, sgn = K.sign === 'out' ? side : 1;"],
  ['M13 handles: a tie goes to the later handle', 'app/core/handles.js', "d <= r * r && d < bd", "d <= r * r && d <= bd"],
  ['M14 handles: Shift is not fine', 'app/core/handles.js', "const f = mods.shift ? FINE : 1;", "const f = 1;"],
  ['M15 handles: the press is not stopped', 'app/core/handles.js', "e.preventDefault(); e.stopImmediatePropagation();", "e.preventDefault();"],
  ['M16 panel: the handles host applies to the field without the handler', 'app/core/panel.js', "f.value = String(value); if (f.oninput) f.oninput();", "f.value = String(value);"],
  ['M17 panel: a sculpt drag never ends', 'app/core/panel.js', "end: () => { if (sculptDrag) { sculptDrag = null; shell.endSculpt(); } },", "end: () => { if (sculptDrag) { sculptDrag = null; } },"],
  ['M18 preview: a delete preview ghost gets handles', 'app/preview/preview.js', "if (!ghost || ghost.proposal || !ghost.path) return null;", "if (!ghost || !ghost.path) return null;"],
];
const run = () => { for (const [f, ...extra] of TESTS) { const r = spawnSync(process.execPath, ['--test', ...extra, f], { cwd: W, encoding: 'utf8', maxBuffer: 1 << 26 }); if (r.status !== 0) return f; } return null; };
const ctl = run(); console.log('control (no mutant):', ctl === null ? 'green' : 'RED in ' + ctl); if (ctl) process.exit(1);
let caught = 0, survived = [], notApplied = [];
for (const [name, file, from, to] of M) {
  const p = W + file; let s = fs.readFileSync(p, 'utf8'); const crlf = s.includes('\r\n'); const n = s.replace(/\r\n/g, '\n');
  const cnt = n.split(from).length - 1; if (cnt !== 1) { notApplied.push(`${name} (anchor found ${cnt}x)`); console.log('NOT APPLIED', name, cnt); continue; }
  fs.writeFileSync(p, (crlf ? n.replace(from, () => to).replace(/\n/g, '\r\n') : n.replace(from, () => to)));
  let by; try { by = run(); } finally { fs.writeFileSync(p, s); }
  if (by) { caught++; console.log('caught  ', name, '<-', by); } else { survived.push(name); console.log('SURVIVED', name); }
}
console.log(`mutants ${M.length}: caught ${caught}, survived ${survived.length}, not applied ${notApplied.length}`); if (survived.length) console.log('survivors:', survived.join(' | ')); if (notApplied.length) console.log('not applied:', notApplied.join(' | '));
