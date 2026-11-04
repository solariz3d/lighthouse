'use strict';
// D168 (pane E): mutation pass over app/validate-ui/* and app/handles/* ON A COPY of the repo (never the shared tree:
// D167's in-place runs turned another seat's suite red). One exact-string replacement per mutant (exactly one match,
// else NOT APPLIED), each copied file restored in a finally; the live checkout is only read.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const LIVE = 'C:/Users/nname/Desktop/t180-track-builder', COPY = path.join(__dirname, 'copy');
fs.rmSync(COPY, { recursive: true, force: true });
for (const d of ['src', 'tools', 'app']) fs.cpSync(path.join(LIVE, d), path.join(COPY, d), { recursive: true });
const F = { colour: 'app/validate-ui/colour.js', live: 'app/validate-ui/live.js', arcs: 'app/validate-ui/jumparcs.js', handles: 'app/handles/handles.js', vpanel: 'app/validate-ui/panel.js', hpanel: 'app/handles/panel.js' };
const M = [
  ['colour', 'amber at >= proven', 'if (fN_g > car.provenG) return LEVEL.AMBER;', 'if (fN_g >= car.provenG) return LEVEL.AMBER;'],
  ['colour', 'info at > stop', 'if (fN_g >= car.suspensionStopG) return LEVEL.INFO;', 'if (fN_g > car.suspensionStopG) return LEVEL.INFO;'],
  ['colour', 'thresholds from constants, not the car', 'function loadLevel(fN_g, car = MACH6) {', 'function loadLevel(fN_g, car = MACH6) { car = MACH6;'],
  ['colour', 'red ranges ignored', 'for (const r of result.red) if (s >= r.s0 - 1e-9 && s <= r.s1 + 1e-9) return LEVEL.RED;', ''],
  ['colour', 'amber ranges ignored', 'for (const r of result.amber) if (s >= r.s0 - 1e-9 && s <= r.s1 + 1e-9) return LEVEL.AMBER;', ''],
  ['colour', 'range end excluded', 'if (s >= r.s0 - 1e-9 && s <= r.s1 + 1e-9) return LEVEL.RED;', 'if (s >= r.s0 - 1e-9 && s < r.s1 - 1e-9) return LEVEL.RED;'],
  ['colour', 'range start excluded', 'if (s >= r.s0 - 1e-9 && s <= r.s1 + 1e-9) return LEVEL.RED;', 'if (s > r.s0 + 1e-9 && s <= r.s1 + 1e-9) return LEVEL.RED;'],
  ['colour', 'range level does not override load', 'levels[k] = Math.max(loadLevel(l.fN_g, car), rl);', 'levels[k] = loadLevel(l.fN_g, car);'],
  ['colour', 'path stations dropped (no-speed reds invisible)', '  if (!path) return out;', '  return out;'],
  ['colour', 'recolour: reuses on s alone', 'if (old && old.s === st.s && old.rangeLevel === rl && old.lines.length === st.lines.length && old.lines.every((l, j) => l === st.lines[j])) return old;', 'if (old && old.s === st.s) return old;'],
  ['colour', 'recolour: range change not seen', 'old.rangeLevel === rl && old.lines.length', 'old.lines.length'],
  ['colour', 'recolour: rebuilds everything', 'if (old && old.s === st.s && old.rangeLevel', 'if (false && old && old.s === st.s && old.rangeLevel'],
  ['colour', 'levelAt: next station, not last', 'if (st[m].s <= s) lo = m; else hi = m - 1;', 'if (st[m].s < s) lo = m; else hi = m - 1;'],
  ['colour', 'levelAt: first line, not nearest u', 'if (Math.abs(e.u[k] - u) < Math.abs(e.u[best] - u)) best = k;', ''],
  ['live', 'append validates in full', 'const full = !result || fromS === undefined;', 'const full = true;'],
  ['live', 'append ignores fromS', 'revalidate(result, path, segments, fromS, vopts)', 'revalidate(result, path, segments, 0, vopts)'],
  ['live', 'live colour without the path', 'recolour(map, next, { car: vopts.car, path })', 'recolour(map, next, { car: vopts.car })'],
  ['arcs', 'arc at 1 g, not the landing g', 'at(xEnd * k / points, v, L.g)', 'at(xEnd * k / points, v, 1)'],
  ['arcs', 'lip theta ignored', 'theta: Math.asin(Math.max(-1, Math.min(1, A.T[1]))) };', 'theta: 0 };'],
  ['arcs', 'caught arc runs past the touchdown', 'const xEnd = L.caught ? L.x : 1.5 * jp.gap;', 'const xEnd = 1.5 * jp.gap;'],
  ['arcs', 'no-speed arcs at a fixed speed', 'const v = known ? jp.speed : L.minSpeed;', 'const v = known ? jp.speed : 80;'],
  ['arcs', 'zone from one touchdown', 'td.length === arcs.length && td.length ?', 'td.length ?'],
  ['arcs', 'pending jumps drawn', 'if (jp.pending) continue;', 'if (false) continue;'],
  ['handles', 'no clamp at max', 'if (v > b.max || v < b.min) {', 'if (v < b.min) {'],
  ['handles', 'no clamp at min', 'if (v > b.max || v < b.min) {', 'if (v > b.max) {'],
  ['handles', 'pastRed ignored', "if (pastRed && stop.kind === 'red') return", 'if (false) return'],
  ['handles', 'amber never shown', "const amberLevel = (b, v) => (b.amberMin == null || b.amberMax == null || v > b.amberMax || v < b.amberMin ? 'amber' : 'clean');", "const amberLevel = (b, v) => 'clean';"],
  ['handles', 'drag is many entries', 'to(id, patch) { h = dragTo(h, D.editWord(base, id, patch)); return h; },', 'to(id, patch) { h = beginDrag(endDrag(dragTo(h, D.editWord(base, id, patch)))); return h; },'],
  ['handles', 'shell drag: refusal not raised', "if (!st) throw new D.DocError('REFUSED', shell.getState().message);", ''],
  ['handles', 'shell cancel: value not restored', "shell.dragTo(this.id, { handles: { [this.handle]: w.handles[this.handle] } }); shell.endDrag();", 'shell.endDrag();'],
  ['handles', 'cancel keeps the dragged state', 'cancel() { const out = endDrag(dragTo(h, base));', 'cancel() { const out = endDrag(h);'],
  ['handles', 'refusal swallowed as clean', "clamped: true, level: 'refused', why: e.message };", "clamped: false, level: 'clean', why: null };"],
  ['vpanel', 'append not detected', "if (g === segs.length && next.length > segs.length) return { how: 'append', g };", ''],
  ['vpanel', 'sculpt not detected', "if (g < segs.length && g < next.length) return { how: 'sculpt', g };", ''],
  ['vpanel', 'fromS read after the in-place extend', 'fromS = path.lengthM; np = extendPath(path, r.segments);', 'np = extendPath(path, r.segments); fromS = path.lengthM;'],
  ['vpanel', 'prefix identity not checked', 'while (g < n && segs[g] === next[g]) g++;', 'g = n;'],
  ['vpanel', 'no coalescing', 'if (queued) return; queued = true;', 'queued = true;'],
  ['vpanel', 'csp switch does not re-validate', 'setCsp(v) { csp = !!v; live = createLive({ validate: vo() }); update(shell.getState(), true); },', 'setCsp(v) { csp = !!v; },'],
  ['vpanel', 'arcs not drawn', 'arcs: jumpArcs(u.result, path),', 'arcs: [],'],
  ['hpanel', 'several words selected show handles', 'if (!sel || sel.length !== 1) return null;', 'if (!sel || sel.length < 1) return null;'],
  ['hpanel', 'two drags at once', "if (drag) throw new Error('handles: a drag is already open');", ''],
  ['hpanel', 'pastRed not passed on', 'startDrag(shell, t.id, handle, { pastRed, validate', 'startDrag(shell, t.id, handle, { validate'],
  ['hpanel', 'csp not passed on', 'const vopts = () => ({ csp });', 'const vopts = () => ({});'],
  ['handles', 'red-now clamps anyway', "if (b.min == null || b.max == null) return { value: v, clamped: false, level: 'red',", "if (false) return { value: v, clamped: false, level: 'red',"],
  ['handles', 'why without the limit', "`red past ${v > b.max ? b.max : b.min}: ${stop.reasons.join(', ')} (${stop.sources.join(', ')})`", "'red'"],
];
const orig = Object.fromEntries(Object.entries(F).map(([k, f]) => [k, fs.readFileSync(path.join(COPY, f), 'utf8')]));
let applied = 0, caught = 0, notApplied = 0; const rows = [];
for (const [which, name, from, to] of M) {
  const text = orig[which], n = text.split(from).length - 1;
  if (n !== 1) { notApplied++; rows.push(`NOT APPLIED (${n} matches)  ${which}: ${name}`); continue; }
  try {
    fs.writeFileSync(path.join(COPY, F[which]), text.replace(from, to));
    const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', 'app/test/validate-ui.test.js', 'app/test/handles.test.js', 'app/test/validate-ui-panel.test.js', 'app/test/handles-panel.test.js', 'app/test/validate-ui-speed.test.js'], { cwd: COPY, encoding: 'utf8', timeout: 600000 });
    applied++; const failed = r.status !== 0; if (failed) caught++;
    rows.push(`${failed ? 'caught  ' : 'SURVIVED'}  ${which}: ${name}`); console.log(`[${applied + notApplied}/${M.length}] ${rows[rows.length - 1]}`);
  } finally { fs.writeFileSync(path.join(COPY, F[which]), orig[which]); }
}
let same = true; for (const f of Object.values(F)) if (fs.readFileSync(path.join(COPY, f), 'utf8') !== fs.readFileSync(path.join(LIVE, f), 'utf8')) same = false;
console.log(rows.join('\n'));
console.log(`\napplied ${applied} / caught ${caught} / NOT APPLIED ${notApplied} (of ${M.length}); copy restored equal to the live files: ${same ? 'yes' : 'NO'}`);
