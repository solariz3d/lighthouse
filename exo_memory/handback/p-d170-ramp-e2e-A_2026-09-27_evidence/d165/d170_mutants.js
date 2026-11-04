// D170 mutants on the landing ramp (src/doc/resolve.js, vocab.js) and the ghost wiring (app/shell.js,
// app/palette/palette.js), each on a COPY of src/, app/, tools/ and test/ in a temp dir. Caught = the covering copied
// tests exit non-zero. The live repo is never written. Usage: node d170_mutants.js [prefix]
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const R = 'src/doc/resolve.js', V = 'src/doc/vocab.js', Sh = 'app/shell.js', P = 'app/palette/palette.js';
const LIVE = [R, V, Sh, P].map((f) => path.join(REPO, f)), before = LIVE.map((f) => fs.readFileSync(f, 'utf8'));
const DOC = ['test/doc-jump.test.js', 'test/doc.test.js', 'test/doc-geom.test.js'], APP = ['app/test/shell-ghost.test.js', 'app/test/palette-dom.test.js', 'app/test/shell.test.js'];
const M = [
  ['R1 no landing ramp: the jump is its gap alone', R, "    segments.push({ id: w.id, word: 'jump', part: 'land', kind: 'road',", "    if (false) segments.push({ id: w.id, word: 'jump', part: 'land', kind: 'road',", DOC],
  ['R2 the ramp on a flat font, not the take-off road\'s', R, "const rampProfile = prof || flatProfile(), R = landingRamp(pitch, h, w.speed);", "const rampProfile = flatProfile(), R = landingRamp(pitch, h, w.speed);", DOC],
  ['R3 a jump with no speed claims its own speed', R, "speedFrom = speed > 0 ? 'word' : 'default';", "speedFrom = 'word';", DOC],
  ['R4 the ramp ignores the jump\'s speed', R, "const v = Number.isFinite(speed) && speed > 0 ? speed : LANDING.DEFAULT_KMH / 3.6,", "const v = LANDING.DEFAULT_KMH / 3.6,", DOC],
  ['R5 the ramp curves in pitch', R, "length: R.length, k0: 0, k1: 0, kp0: 0, kp1: 0,", "length: R.length, k0: 0, k1: 0, kp0: 0.001, kp1: 0.001,", DOC],
  ['R6 after the ramp nothing to blend from (fonts may step)', R, "first: false, prevId: w.id, prof: rampProfile };", "first: false, prevId: w.id, prof: null };", DOC],
  ['R7 the ramp\'s horizontal length used along the slope', R, "return { length: r.length / cosL,", "return { length: r.length,", DOC],
  ['R8 the take-off pitch taken as level', R, "const rampProfile = prof || flatProfile(), R = landingRamp(pitch, h, w.speed);", "const rampProfile = prof || flatProfile(), R = landingRamp(0, h, w.speed);", DOC],
  ['R9 the default speed 250 km/h, not 300', V, "const LANDING = Object.freeze({ DEFAULT_KMH: 300 });", "const LANDING = Object.freeze({ DEFAULT_KMH: 250 });", DOC],
  ['G1 asking for a ghost commits it', Sh, "    candidate(name) { const next = placed(name); return resolved(next).resolved || D.resolve({ ...next, closed: false }); },", "    candidate(name) { const next = placed(name); commit(next); return resolved(next).resolved; },", APP],
  ['G2 the ghost ignores the pickers', Sh, "    const word = p.words[0].word, { font, tempo, dir } = st.pickers;\n    return D.appendWord(doc(), word, { tempo, dir, font: font === 'auto' || word === 'jump' ? undefined : font });", "    const word = p.words[0].word, { font, tempo, dir } = st.pickers;\n    return D.appendWord(doc(), word);", APP],
  ['G3 leaving a piece does not clear its ghost', P, "mouseleave: () => on.ghost && on.ghost(null),", "mouseleave: () => on.ghost && on.ghost(p.name),", APP],
  ['G4 keyboard focus shows no ghost', P, "          focus: () => on.ghost && on.ghost(p.name), blur: () => on.ghost && on.ghost(null) }, text: p.name,", "          }, text: p.name,", APP],
];
function copyDir(src, dst) { fs.mkdirSync(dst, { recursive: true }); for (const e of fs.readdirSync(src, { withFileTypes: true })) { const a = path.join(src, e.name), b = path.join(dst, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } }
const only = process.argv[2], t = { listed: 0, applied: 0, caught: 0, survived: [], na: [], nr: [] };
for (const [name, rel, from, to, tests] of M) {
  if (only && !name.startsWith(only + ' ')) continue;
  t.listed++;
  const top = fs.mkdtempSync(path.join(os.tmpdir(), 'd170m-'));
  for (const d of ['src', 'app', 'tools', 'test']) copyDir(path.join(REPO, d), path.join(top, d));
  const f = path.join(top, rel), src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { t.na.push(name); console.log('NOT APPLIED', name); fs.rmSync(top, { recursive: true, force: true }); continue; }
  fs.writeFileSync(f, src.replace(from, to)); t.applied++;
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...tests], { cwd: top, encoding: 'utf8', timeout: 600000 });
  fs.rmSync(top, { recursive: true, force: true });
  const out = (r.stdout || '') + (r.stderr || ''), fail = /^# fail (\d+)/m.exec(out);
  if (!fail) { t.nr.push(name); console.log('NO RESULT', name, out.slice(-300)); continue; }
  if (r.status !== 0) { t.caught++; console.log('caught  ', name, `(${fail[1]} failing)`); } else { t.survived.push(name); console.log('SURVIVED', name); }
}
const same = LIVE.every((f, i) => fs.readFileSync(f, 'utf8') === before[i]);
console.log(`SUMMARY ${t.listed} listed · ${t.applied} applied · ${t.caught} caught · ${t.survived.length} survived · ${t.na.length} NOT APPLIED · ${t.nr.length} NO RESULT · live files ${same ? 'unchanged' : 'CHANGED'}`);
