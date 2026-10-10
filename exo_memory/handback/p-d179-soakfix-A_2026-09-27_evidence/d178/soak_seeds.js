// The soak at 10,000 ops for seeds 1, 7 and 17, under the heavy-run lock:
//   LIVE   the repository's scripts/soak.js as it is
//   PATCHED a temp copy whose soak.js sculpts the words INSIDE a phrase by their `id/n` (the one-line fix routed to its
//           owner in the D178 hand-back), so the soak can get past the starter phrases and reach the rest of its ops.
// Each run prints the soak's own summary line or its failure (seed, op index, op, replay command).
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 't180 D179 A soak 10k × seeds 1,7,17 (live + phrase-aware copy)' });
const ROOT = 'C:/Users/nname/Desktop/t180-track-builder', OPS = process.argv[2] || '10000';
const FROM = 'const w = pick(ws), info = L.handleInfo(shell.getState().history.present, w.id)';
const TO = 'const w = pick(ws.flatMap((e) => (e.phrase !== undefined ? e.words.map((x, n) => ({ ...x, id: `${e.id}/${n + 1}` })) : [e]))), info = L.handleInfo(shell.getState().history.present, w.id)';
function run(dir, seed) {
  const r = spawnSync(process.execPath, ['scripts/soak.js', '--seed', String(seed), '--ops', OPS, '--quiet'], { cwd: dir, encoding: 'utf8', timeout: 1800000 });
  return `exit ${r.status}: ${(r.stdout + r.stderr).trim().split('\n').filter((l) => !/^\s+at /.test(l)).slice(-3).join(' | ').slice(0, 900)}`;
}
const copy = fs.mkdtempSync(path.join(os.tmpdir(), 't180b-soakp-'));
try {
  for (const d of ['src', 'app', 'tools', 'scripts']) fs.cpSync(path.join(ROOT, d), path.join(copy, d), { recursive: true });
  const f = path.join(copy, 'scripts/soak.js'), s = fs.readFileSync(f, 'utf8');
  if (!s.includes(FROM)) throw new Error('the soak changed: the phrase patch no longer applies');
  fs.writeFileSync(f, s.replace(FROM, TO));
  for (const seed of [1, 7, 17]) {
    console.log(`seed ${seed} LIVE    ${run(ROOT, seed)}`);
    console.log(`seed ${seed} PATCHED ${run(copy, seed)}`);
  }
} finally { fs.rmSync(copy, { recursive: true, force: true }); }
