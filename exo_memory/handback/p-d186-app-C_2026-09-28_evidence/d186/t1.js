// t1.js (pane C, D186): TEST 1 ROUND TRIP, scored against B's seal exo_memory/loop/d186_registration_tests1-6_2026-09-28.md
// (sha256 e80d7d255c90ed15). For each track: read (the skill's scripts/read.cjs, READ_PROFILE=1) → the D184 fit
// (tools/piecewise.cjs --write) → the APP's route (app/core/coreshell.js: openExample = fromPositionFit, ONE close(), exportTo a
// temp folder OUTSIDE the repo through app/export/export.js runSegments) → read back (tools/read_track.cjs, READ_PROFILE=1).
// The line: the MESH CENTRELINE (piecewise.cjs meshCentreline) of the original and of the export, world coordinates, NO alignment.
// Everything it writes goes to the worktree's git-ignored reads/ or to os.tmpdir(); `git status --porcelain` is compared.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync, execSync } = require('child_process');
const WT = 'C:/Users/nname/AppData/Local/Temp/c-d186-wt', AC = 'G:/SteamLibrary/steamapps/common/assettocorsa/content/tracks';
const PW = require(path.join(WT, 'tools', 'piecewise.cjs'));
const { createCoreShell } = require(path.join(WT, 'app', 'core', 'coreshell.js')), { makeExporter } = require(path.join(WT, 'app', 'export', 'export.js'));
const TRACKS = [{ key: 'serpents', dir: `${AC}/serpents_spiral`, name: 't1_serpents', layout: null }, { key: 'thunderhead', dir: `${AC}/thunderhead_raceway`, name: 't1_thunderhead', layout: 'normal' }];
const run = (args, env = {}) => { const r = spawnSync(process.execPath, args, { cwd: WT, encoding: 'utf8', maxBuffer: 1 << 29, env: { ...process.env, ...env } }); if (r.status !== 0) throw new Error(`${path.basename(args[0])} exited ${r.status}: ${(r.stderr || '').slice(0, 400)}`); return r.stdout; };
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], len = (a) => Math.hypot(a[0], a[1], a[2]);
function toSeg(p, a, b) { const ab = sub(b, a), t = Math.max(0, Math.min(1, dot(sub(p, a), ab) / (dot(ab, ab) || 1))); return len(sub(p, [a[0] + ab[0] * t, a[1] + ab[1] * t, a[2] + ab[2] * t])); }
/** Distance from every point to a CLOSED polyline, with a coarse grid over the segments (cell 25 m). */
function distances(points, poly) {
  const C = 25, grid = new Map(), k = (x, z) => `${x},${z}`, n = poly.length;
  for (let i = 0; i < n; i++) { const a = poly[i], b = poly[(i + 1) % n]; for (let x = Math.floor(Math.min(a[0], b[0]) / C); x <= Math.floor(Math.max(a[0], b[0]) / C); x++) for (let z = Math.floor(Math.min(a[2], b[2]) / C); z <= Math.floor(Math.max(a[2], b[2]) / C); z++) { if (!grid.has(k(x, z))) grid.set(k(x, z), []); grid.get(k(x, z)).push(i); } }
  return points.map((p) => { let best = Infinity; const cx = Math.floor(p[0] / C), cz = Math.floor(p[2] / C);
    for (let r = 0; r < 60; r++) { for (let x = cx - r; x <= cx + r; x++) for (let z = cz - r; z <= cz + r; z++) { if (Math.max(Math.abs(x - cx), Math.abs(z - cz)) !== r) continue; for (const i of grid.get(k(x, z)) || []) best = Math.min(best, toSeg(p, poly[i], poly[(i + 1) % n])); } if (best <= (r - 1) * C) break; }
    return best; });
}
const pct = (a, f) => +(100 * a.filter(f).length / a.length).toFixed(2), q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.ceil(p * s.length) - 1)]; };
(async () => {
  const statusBefore = execSync('git status --porcelain', { cwd: WT, encoding: 'utf8' });
  const exporter = await makeExporter(async (p) => fs.readFileSync(path.join(WT, p), 'utf8'));
  const out = { seal: 'd186_registration_tests1-6_2026-09-28.md e80d7d255c90ed15', tracks: {} };
  for (const T of TRACKS) {
    const R = out.tracks[T.key] = { stage: null };
    try {
      if (!fs.existsSync(T.dir)) { R.stage = 'SKIPPED'; R.why = `no folder ${T.dir}`; continue; }
      R.stage = 'read'; R.readLine = run([path.join(WT, '.claude/skills/track-equations/scripts/read.cjs'), T.dir, T.name, '0', '0', ...(T.layout ? [T.layout] : [])]).trim();
      const readFile = path.join(WT, 'reads', `${T.name}.read.json`), read = JSON.parse(fs.readFileSync(readFile, 'utf8'));
      R.stage = 'fit'; run([path.join(WT, 'tools', 'piecewise.cjs'), T.dir, readFile, ...(T.layout ? ['--layout', T.layout] : []), '--write', T.name]);
      const fitText = fs.readFileSync(path.join(WT, 'reads', `${T.name}.pieces.json`), 'utf8');
      R.stage = 'load'; const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 't180b-t1-')); R.tmp = tmp;
      const storage = { writeExport: async (dir, folder, files) => { for (const f of files) { const p = path.join(dir, folder, ...f.path.split('/')); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, f.bytes); } R.folder = path.join(dir, folder); } };
      const s = await createCoreShell({ storage, exporter }); s.openExample(fitText, JSON.stringify(read), `t1 ${T.key}`);
      if (s.getState().messageKind !== 'ok') throw new Error(`openExample: ${s.getState().message}`);
      R.pieces = s.getState().history.present.pieces.length; R.flights = s.getState().history.present.pieces.filter((P) => P.type === 'flight').length;
      R.stage = 'close'; s.close(); R.closeMessage = s.getState().message;
      if (!s.getState().history.present.closed) throw new Error(`close: ${s.getState().message}`);
      R.stage = 'export'; await s.exportTo(tmp);
      if (s.getState().messageKind !== 'ok' || !R.folder) throw new Error(`export: ${s.getState().message}${s.getState().exportReds ? ` REDS ${JSON.stringify(s.getState().exportReds.slice(0, 4).map((x) => [x.reason, x.s0, x.s1]))}` : ''}`);
      R.exportMessage = s.getState().message.slice(0, 300);
      R.stage = 'readback'; const back = JSON.parse(run([path.join(WT, 'tools', 'read_track.cjs'), R.folder], { READ_PROFILE: '1' }));
      R.stage = 'compare';
      const mo = PW.meshCentreline(read, PW.rayIndex(PW.roadTris(T.dir, T.layout))), me = PW.meshCentreline(back, PW.rayIndex(PW.roadTris(R.folder, null)));
      const oPts = mo.st.filter((x) => !x.flag).map((x) => x.p), ePts = me.st.filter((x) => !x.flag).map((x) => x.p);
      const dOE = distances(oPts, me.st.map((x) => x.p)), dEO = distances(ePts, mo.st.map((x) => x.p));
      const bo = read.stations.filter((x) => x.c && Number.isFinite(x.up)), be = back.stations.filter((x) => x.c && Number.isFinite(x.up));   // bank: the exported station nearest in position
      const dBank = bo.map((x) => { let best = null, bd = Infinity; for (const y of be) { const d = len(sub(x.c, y.c)); if (d < bd) { bd = d; best = y; } } let a = Math.abs(x.up - best.up); a = Math.min(a, 360 - a); return a; });
      Object.assign(R, { stage: 'done', originalStations: mo.st.length, originalFlagged: mo.st.filter((x) => x.flag).length, exportedStations: me.st.length, exportedFlagged: me.st.filter((x) => x.flag).length,
        line: { pctWithin5: pct(dOE, (d) => d <= 5), p95: +q(dOE, 0.95).toFixed(2), max: +Math.max(...dOE).toFixed(2) },
        coverage: { pctWithin5: pct(dEO, (d) => d <= 5), p95: +q(dEO, 0.95).toFixed(2), max: +Math.max(...dEO).toFixed(2) },
        bank: { stations: dBank.length, pctWithin5deg: pct(dBank, (d) => d <= 5), p95: +q(dBank, 0.95).toFixed(2), max: +Math.max(...dBank).toFixed(2) },
        lengths: { original: +mo.L.toFixed(1), exported: +me.L.toFixed(1) } });
      R.pass = R.line.pctWithin5 >= 95 && R.coverage.pctWithin5 >= 95 && R.bank.pctWithin5deg >= 95;
    } catch (e) { R.error = e.message; R.pass = false; }
  }
  const statusAfter = execSync('git status --porcelain', { cwd: WT, encoding: 'utf8' });
  out.repoUnchanged = statusBefore === statusAfter; if (!out.repoUnchanged) out.statusDiff = [statusBefore, statusAfter];
  const ran = Object.values(out.tracks).every((t) => t.stage !== 'SKIPPED');
  out.verdict = ran && out.repoUnchanged && Object.values(out.tracks).every((t) => t.pass) ? 'PASS' : 'FAIL';
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.log(JSON.stringify({ verdict: 'FAIL', error: e.stack })); process.exit(1); });
