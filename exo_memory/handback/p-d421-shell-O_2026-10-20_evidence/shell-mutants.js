'use strict';
// D421 Part 2 (O): mutants of the NEW shell code, each run against app/test/sculpt-tools.test.js. A mutant is APPLIED only when its `from` occurs exactly once in its file; CAUGHT
// when the test run fails. The file is restored byte for byte after every mutant (and checked). Run from the t180 worktree:  node <this>
const fs = require('fs'), { spawnSync } = require('child_process');
const M = [
  ['app/core/coreshell.js', 'M1 the shape family has no guard', "const guard = family === 'shape' ? {", "const guard = false ? {"],
  ['app/core/coreshell.js', 'M2 a route tool on a closed lap runs on the closed lap', "base = closedRoute ? Object.freeze({ ...d, closed: false }) : d", "base = d"],
  ['app/core/coreshell.js', 'M3 the release is not started', "if (b.family === 'route' && b.closedBase) return releaseRoute(b);", ""],
  ['app/core/coreshell.js', 'M4 no whole-lap fallback', "runCloseJob({ doc: open, whole: true, edited: win })", "Promise.resolve({ refused: 'no fallback' })"],
  ['app/core/coreshell.js', 'M5 the dropped drag keeps the brushed lap', "if (r.failed) {\r\n          const why", "if (r.failed && false) {\r\n          const why"],
  ['app/core/coreshell.js', 'M6 the run window is off-centre', "return { s0: (lo + hi) / 2, r: (hi - lo) / 2, pieces: roads };", "return { s0: lo, r: (hi - lo) / 2, pieces: roads };"],
  ['app/core/coreshell.js', 'M7 a radius change takes a step itself', "return set({ brush: { ...b, r: Number(r) }, message: null });", "set({ brush: { ...b, r: Number(r) } }); return b.raw === undefined ? st : api.brushTo(b.raw);"],
  ['app/core/coreshell.js', 'M8 Esc keeps the drag', "    cancelBrush() {\r\n      const b = st.brush; if (!b) return st;", "    cancelBrush() {\r\n      const b = st.brush; return st;"],
  ['app/core/coreshell.js', 'M9 Stretch scales each piece by its own amount', "stretchFn(d, i, d.pieces[i].length * f,", "stretchFn(d, i, d.pieces[i].length + delta,"],
  ['app/core/coreshell.js', 'M10 Smooth forgets the last tool', "const ch = T.mode === 'smooth' ? channel || st.lastToolChannel : T.channel", "const ch = T.mode === 'smooth' ? channel : T.channel"],
  ['app/core/coreshell.js', 'M11 the bend counts as a shape tool', "bend: Object.freeze({ mode: 'rate', channel: 'kh', family: 'route' }),", "bend: Object.freeze({ mode: 'rate', channel: 'kh', family: 'shape' }),"],
  ['app/core/coreshell.js', 'M12 the handles stand on the run\'s first piece', "let m = Math.floor((s.from + s.to) / 2);", "let m = s.from;"],
  ['app/core/coreshell.js', 'M13 an unknown tool opens a drag', "if (!T) return set({ message: `BAD_TOOL:", "if (false) return set({ message: `BAD_TOOL:"],
  ['app/core/closerunner.js', 'M14 the window is not posted', "...(window ? { window } : {})", "...({})"],
  ['app/core/coreshell.js', 'M16 an explicit run is ignored', 'if (Number.isInteger(from) && Number.isInteger(to) && from !== to) {', 'if (false) {'],
  ['app/core/closejob.js', 'M15 a given window is ignored', "Array.isArray(window) ? window : closeWindow(doc, { fraction, last })", "closeWindow(doc, { fraction, last })"],
];
const out = []; let applied = 0, caught = 0, notApplied = 0;
for (const [file, id, from, to] of M) {
  const orig = fs.readFileSync(file);
  const s = orig.toString('utf8'), n = s.split(from).length - 1;
  if (n !== 1) { notApplied++; out.push(`NOT APPLIED  ${id} (${n} occurrences)`); continue; }
  applied++;
  fs.writeFileSync(file, s.replace(from, () => to));
  let r;
  try { r = spawnSync(process.execPath, ['--test', 'app/test/sculpt-tools.test.js'], { encoding: 'utf8', timeout: 300000 }); }
  finally { fs.writeFileSync(file, orig); }
  if (!fs.readFileSync(file).equals(orig)) throw new Error(`${file} was not restored`);
  const fails = ((r.stdout || '') + (r.stderr || '')).replace(/\x1b\[[0-9;]*m/g, '').split('\n').filter((l) => /^✖ row/.test(l)).map((l) => l.slice(2, 9));
  const ok = r.status !== 0;
  if (ok) caught++;
  out.push(`${ok ? 'caught      ' : 'NOT CAUGHT  '} ${id}${ok ? ` (${[...new Set(fails)].join(', ')})` : ''}`);
}
console.log(out.join('\n'));
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}`);
process.exitCode = applied === caught && notApplied === 0 ? 0 : 1;
