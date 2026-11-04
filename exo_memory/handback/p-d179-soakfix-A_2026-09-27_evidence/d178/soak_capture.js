// Replay one phrase-aware soak run to its failure, and capture the document text at that moment (written into
// scratchpad/d178/captured-<seed>.t180track), on a throwaway copy of the live tree. Not locked: one short run.
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = 'C:/Users/nname/Desktop/t180-track-builder', [seed, ops] = process.argv.slice(2);
const FROM = 'const w = pick(ws), info = L.handleInfo(shell.getState().history.present, w.id)';
const TO = 'const w = pick(ws.flatMap((e) => (e.phrase !== undefined ? e.words.map((x, n) => ({ ...x, id: `${e.id}/${n + 1}` })) : [e]))), info = L.handleInfo(shell.getState().history.present, w.id)';
const OUT = path.join(__dirname, `captured-${seed}.t180track`);
const copy = fs.mkdtempSync(path.join(os.tmpdir(), 't180b-soakc-'));
try {
  for (const d of ['src', 'app', 'tools', 'scripts']) fs.cpSync(path.join(ROOT, d), path.join(copy, d), { recursive: true });
  const f = path.join(copy, 'scripts/soak.js'); let s = fs.readFileSync(f, 'utf8');
  if (!s.includes(FROM)) throw new Error('the soak changed');
  s = s.replace(FROM, TO);
  // at every failure, write the document as it stands (the soak's own text())
  const fail = "fail = (msg) => { throw new SoakFailure(seed, i, op, msg); };";
  if (!s.includes(fail)) throw new Error('the soak changed: no fail()');
  s = s.replace(fail, `fail = (msg) => { require('fs').writeFileSync(${JSON.stringify(OUT)}, text()); throw new SoakFailure(seed, i, op, msg); };`);
  fs.writeFileSync(f, s);
  const r = spawnSync(process.execPath, ['scripts/soak.js', '--seed', seed, '--ops', ops, '--quiet'], { cwd: copy, encoding: 'utf8', timeout: 900000 });
  console.log(`exit ${r.status}: ${(r.stdout + r.stderr).trim().split('\n').filter((l) => !/^\s+at /.test(l)).slice(-2).join(' | ').slice(0, 400)}`);
  console.log(fs.existsSync(OUT) ? `captured ${OUT}` : 'nothing captured');
} finally { fs.rmSync(copy, { recursive: true, force: true }); }
