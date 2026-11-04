// D167 mutants on the ramp handle and src/doc/connector.js, each on a COPY of src/, test/, tools/ and scripts/ in a temp
// dir. Caught = the copied test/doc-connector.test.js exits non-zero. The live repo is never written.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const LIVE = ['src/doc/connector.js', 'src/doc/vocab.js', 'src/doc/serial.js', 'src/doc/document.js'].map((f) => path.join(REPO, f));
const before = LIVE.map((f) => fs.readFileSync(f, 'utf8'));
const Cn = 'src/doc/connector.js', V = 'src/doc/vocab.js', S = 'src/doc/serial.js', Do = 'src/doc/document.js';
const M = [
  ['R1 the default transition is 10 m', V, 'const RAMP_M = 20;', 'const RAMP_M = 10;'],
  ['R2 a zero transition allowed (fonts may jump)', S, 'ramp: [1, 1000]', 'ramp: [0, 1000]'],
  ['R3 a jump carries a transition too', Do, "handles: { gap: W.gap, drop: W.drop, land: W.land } };", "handles: { gap: W.gap, drop: W.drop, land: W.land, ramp: RAMP_M } };"],
  ['C1 the last turn misses its complement by 100 quanta', Cn, 'const q3 = P.turnTotalQ - q1, c3q', 'const q3 = P.turnTotalQ - q1 + 100, c3q'],
  ['C2 the last climb misses its complement by 100 quanta', Cn, 'c3q = P.climbTotalQ - c1q, e = P.ease;', 'c3q = P.climbTotalQ - c1q + 100, e = P.ease;'],
  ['C3 ranked worst margin first', Cn, 'a.red - b.red || b.margin - a.margin', 'a.red - b.red || a.margin - b.margin'],
  ['C4 red ignored in the rank', Cn, 'a.red - b.red || b.margin - a.margin', 'b.margin - a.margin'],
  ['C5 the connector ends with its curvature still on (easeOut 0 on the last word)', Cn, "add(nameFor(P.R), q3 >= 0 ? 'L' : 'R', { length: turnLen(q3), turn: ra(q3), climb: ra(c3q), roll0: P.rollTarget, roll1: P.rollTarget });", "add(nameFor(P.R), q3 >= 0 ? 'L' : 'R', { length: turnLen(q3), turn: ra(q3), climb: ra(c3q), roll0: P.rollTarget, roll1: P.rollTarget, easeOut: 0 });"],
  ['C6 the climb limit not enforced', Cn, 'if (Math.abs(c1q) > lim || Math.abs(c3q) > lim) {', 'if (false) {'],
  ['C7 the margin taken over the whole lap, not the connector', Cn, 'if (l.s >= s0 - 1e-9 && Number.isFinite(l.f_g))', 'if (Number.isFinite(l.f_g))'],
  ['C8 a loose closure accepted (the tolerance ×1e4)', Cn, 'if (!sol || !(sol.closed <= 5 * o.tol))', 'if (!sol || !(sol.closed <= 5e4 * o.tol))'],
  ['C9 the no-connector reason drops the climb', Cn, "if (tries.climb) bits.push(", "if (false) bits.push("],
  ['C10 an already closed document re-closed', Cn, "  if (doc.closed) throw new DocError('ALREADY_CLOSED'", "  if (false) throw new DocError('ALREADY_CLOSED'"],
];
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const t = { listed: M.length, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, rel, from, to] of M.filter((m) => !process.argv[2] || m[0].startsWith(process.argv[2] + ' '))) {
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'd167m-'));
  for (const d of ['src', 'test', 'tools', 'scripts']) copyDir(path.join(REPO, d), path.join(top, d));
  const f = path.join(top, rel), src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); fs.rmSync(top, { recursive: true, force: true }); continue; }
  fs.writeFileSync(f, src.replace(from, to)); t.applied++;
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'test/doc-connector.test.js'], { cwd: top, encoding: 'utf8', timeout: 600000 });
  fs.rmSync(top, { recursive: true, force: true });
  const out = (r.stdout || '') + (r.stderr || ''), fail = /^# fail (\d+)/m.exec(out);
  if (!fail) { t.nr.push(name); console.log('NO RESULT', name, out.slice(-300)); continue; }
  if (r.status !== 0) { t.caught++; console.log('caught  ', name, `(${fail[1]} failing)`); } else { t.survived.push(name); console.log('SURVIVED', name); }
}
const same = LIVE.every((f, i) => fs.readFileSync(f, 'utf8') === before[i]);
console.log(`SUMMARY ${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live files ${same ? 'unchanged' : 'CHANGED'}`);
