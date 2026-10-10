// plants.js (pane B, D190): the seal's PLANTED controls, each in its own COPY of the combined tree, each run against the row's test
// (my probe, bprobe.js, and/or A's test file or the fixture check). A plant whose edit string is missing THROWS (never silently unplanted;
// the seal's own §6 records a plant that silently did nothing).
//   node plants.js <combined tree> <work dir>
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const [, , SRC, WORK] = process.argv, HERE = __dirname;
const A = 'src/core/adapter.js', DOC = 'src/core/document.js', EXT = 'src/core/extend.js', VAL = 'src/validate/index.js';
const LEG = 'const profile = cup ? cup[j].profile : profileAt(P.family, mid.w, mid.r);';
const PLANTS = [
  { id: 'K1a-1 the r cap applied to a cup piece (legacy render)', edits: [[A, LEG, 'const profile = profileAt(P.family, mid.w, mid.r);']], probe: '1a', tests: ['test/core_cup.test.js'] },
  { id: 'K1a-2 only the left edge cupped', edits: [[A, LEG, 'const profile = cup ? ((p) => ({ ...p, psi: p.psi.map((x, k) => (k < (p.psi.length - 1) / 2 ? 0 : x)) }))(cup[j].profile) : profileAt(P.family, mid.w, mid.r);']], probe: '1a', tests: ['test/core_cup.test.js'] },
  { id: 'K1a-3 c taken as radians', edits: [[A, '((c * F[i]) / F[F.length - 1]) * DEG]', '((c * F[i]) / F[F.length - 1])]']], probe: '1a' },
  { id: 'K1b-1 the stair (one profile per segment, no blend)', edits: [[A, 'blend: cup ? cup[j].blend : null', 'blend: null']], probe: '1b', tests: ['test/core_cup.test.js'] },
  { id: 'K1b-2 c evaluated at the segment START', edits: [[A, 'else { anchor = null; const B = cupProfile(P.family, b.w, b.c); out[j] = { profile: B, blend: { from: cupProfile(P.family, a.w, a.c), s0: 0, length: s(j + 1) - s(j) }, end: B }; }', 'else { anchor = null; const B = cupProfile(P.family, a.w, a.c); out[j] = { profile: B, blend: null, end: B }; }']], probe: '1b', tests: ['test/core_cup.test.js'] },
  { id: 'K2-1 MAX raised to 165', edits: [[DOC, 'const CUP_MAX = 150,', 'const CUP_MAX = 165,']], probe: '2', tests: ['test/core_cup.test.js'] },
  { id: 'K2-2 no document guard (checkDoc and the Extend clamp), typed-value checks kept', edits: [[DOC, 'if (P.cup && P.channels.c.some((v) => v < -CUP_EPS || v > CUP_MAX + CUP_EPS))', 'if (false)'], [EXT, 'piece.channels.c.map((x) => Math.min(D.CUP_MAX, Math.max(0, x)))', 'piece.channels.c.map((x) => x)']], probe: '2', tests: ['test/core_cup.test.js'] },
  { id: 'K2-3 a non-cumulative shape', edits: [[A, '((c * F[i]) / F[F.length - 1]) * DEG]', '((c * (F[i] - (i ? F[i - 1] : 0))) / F[F.length - 1]) * DEG]']], probe: '2', tests: ['test/core_cup.test.js'] },
  { id: 'K4-1 the csp === false steep check dropped', edits: [[VAL, 'if (opts.csp === false) {', 'if (false) {']], tests: ['test/core_cup_export.test.js'] },
  { id: 'K4-2 every cup guard removed, a bowl at 165 exported', edits: [[DOC, 'if (P.cup && P.channels.c.some((v) => v < -CUP_EPS || v > CUP_MAX + CUP_EPS))', 'if (false)'], [EXT, 'piece.channels.c.map((x) => Math.min(D.CUP_MAX, Math.max(0, x)))', 'piece.channels.c.map((x) => x)'],
    [EXT, 'targets.c >= 0 && targets.c <= D.CUP_MAX)) throw', 'targets.c >= 0 && true)) throw'], [EXT, 'first.c >= 0 && first.c <= D.CUP_MAX)) throw', 'first.c >= 0 && true)) throw']], tests: ['test/core_cup_export.test.js'] },
  { id: 'K5-1 the plan\'s migration (legacy rendered as a cup at its capped edge)', edits: [[A, LEG, 'const profile = cup ? cup[j].profile : cupProfile(P.family, mid.w, D.legacyEdgeDeg(P.family, mid.w, mid.r));']], fixtures: true },
  { id: 'K5-3 legacy rendered from c at the family\'s NOMINAL edge', edits: [[A, LEG, 'const profile = cup ? cup[j].profile : cupProfile(P.family, mid.w, FLOORS[P.family][FLOORS[P.family].length - 1]);']], fixtures: true },
  { id: 'K6-2 the roll not applied to a cup piece', edits: [[A, 'roll0: a.phi, roll1: b.phi, heartline: 0, profile, blend: cup', 'roll0: cup ? 0 : a.phi, roll1: cup ? 0 : b.phi, heartline: 0, profile, blend: cup']], probe: '6', tests: ['test/core_cup.test.js'] },
  { id: 'K6-1 cup in the world frame (roll then cup: psiL = c - phi, psiR = c + phi, no roll)', edits: [[A, 'roll0: a.phi, roll1: b.phi, heartline: 0, profile, blend: cup ? cup[j].blend : null',
    'roll0: cup ? 0 : a.phi, roll1: cup ? 0 : b.phi, heartline: 0, profile: cup ? (() => { const f = mid.phi / DEG, Lp = cupProfile(P.family, mid.w, Math.max(0, mid.c - f)), Rp = cupProfile(P.family, mid.w, Math.max(0, mid.c + f)), h = (Lp.psi.length - 1) / 2; return { ...Lp, psi: [...Rp.psi.slice(0, h), 0, ...Lp.psi.slice(h + 1)] }; })() : profile, blend: null']], probe: '6', tests: ['test/core_cup.test.js'] },
];
function copyTree(from, to) { fs.cpSync(from, to, { recursive: true, filter: (p) => !/[\\/](\.git|reads|src-tauri|node_modules)([\\/]|$)/.test(p.slice(from.length)) }); }
const results = [];
for (const P of PLANTS) {
  const dir = path.join(WORK, P.id.split(' ')[0]); fs.rmSync(dir, { recursive: true, force: true }); copyTree(SRC, dir);
  for (const [f, a, b] of P.edits) { const file = path.join(dir, f), s = fs.readFileSync(file, 'utf8'), n = s.split(a).length - 1; if (n !== 1) throw new Error(`${P.id}: "${a.slice(0, 60)}" found ${n} times in ${f}`); fs.writeFileSync(file, s.replace(a, b)); }
  const r = { id: P.id, applied: true };
  if (P.probe) { const o = spawnSync(process.execPath, ['--max-old-space-size=4096', path.join(HERE, 'bprobe.js'), dir, P.probe], { encoding: 'utf8' }); const m = /SUMMARY (.*)/.exec(o.stdout || ''); const sum = m ? JSON.parse(m[1]) : null; r.probe = sum ? (sum[P.probe] ? 'NOT CAUGHT' : 'caught') : `caught (probe threw: ${(o.stderr || '').split('\n').find((l) => /Error/.test(l)) || 'no summary'})`; }
  if (P.tests) { const o = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', ...P.tests], { cwd: dir, encoding: 'utf8' }); const f = /ℹ fail (\d+)/.exec(o.stdout || ''), p = /ℹ pass (\d+)/.exec(o.stdout || ''); r.tests = `${f && +f[1] > 0 ? 'caught' : 'NOT CAUGHT'} (pass ${p && p[1]}, fail ${f && f[1]})`; }
  if (P.fixtures) { const o = spawnSync(process.execPath, ['--max-old-space-size=4096', path.join(dir, 'test/fixtures/fixtures.js'), dir, path.join(dir, 'test/fixtures'), '--check'], { encoding: 'utf8' }); const last = (o.stdout || '').trim().split('\n'); r.fixtures = `${/^0 of/.test(last.at(-1)) ? 'NOT CAUGHT' : 'caught'}: ${last.at(-1)} [${last.filter((l) => /DIFFERS/.test(l)).map((l) => l.split(':')[0].split('-')[0]).join(' ')}]`; }
  results.push(r); console.log(JSON.stringify(r));
}
fs.writeFileSync(path.join(WORK, 'plants.json'), JSON.stringify(results, null, 1));
