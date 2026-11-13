// film.js: the L185 re-film (pane E, 2026-11-13). Films one side with dz-world --capture-lean --lean-film under heavy-run.
// node film.js <side-name> <worktree> <outdir>
// Refuses while the heavy-run hold file exists or a lock names a timing session; refuses an exe older than HEAD's commit.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const [side, wt, out] = process.argv.slice(2);
if (!side || !wt || !out) { console.error('usage: node film.js <side> <worktree> <outdir>'); process.exit(2); }
const data = 'C:/Consonance/data';
if (fs.existsSync(path.join(data, 'heavy-run.hold'))) { console.error('REFUSED: heavy-run.hold exists'); process.exit(5); }
for (const f of fs.readdirSync(data).filter(n => /^heavy-run.*\.lock$/.test(n))) {
  const c = fs.readFileSync(path.join(data, f), 'utf8');
  if (/timing/.test(c) && !/not a timing session/.test(c)) { console.error('REFUSED: a timing session holds ' + f); process.exit(5); }
}
const exe = path.join(wt, 'build/bin/dz-world.exe');
if (!fs.existsSync(exe)) { console.error('REFUSED: no exe at ' + exe); process.exit(5); }
// The side's commit: HEAD, or a named one (argv[5]) when every change from it to HEAD is under game/tests/ (no change to
// the program filmed).
const named = process.argv[5] || 'HEAD';
const head = spawnSync('git', ['-C', wt, 'log', '-1', '--format=%H %ct', named], { encoding: 'utf8' });
if (head.status !== 0) { console.error('git failed: ' + head.stderr); process.exit(5); }
const [sha, ct] = head.stdout.trim().split(' ');
const since = spawnSync('git', ['-C', wt, 'diff', '--name-only', sha, 'HEAD'], { encoding: 'utf8' });
if (since.status !== 0) { console.error('git diff failed: ' + since.stderr); process.exit(5); }
const dirty = spawnSync('git', ['-C', wt, 'status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' }).stdout.trim();
const outside = since.stdout.split(/\r?\n/).filter(n => n && !n.startsWith('game/tests/'));
if (outside.length || dirty) { console.error('REFUSED: changes since ' + sha + ' outside game/tests/, or a dirty tree: ' + outside.concat(dirty ? [dirty] : []).join(', ')); process.exit(5); }
// The exe is that commit's: the game stamps the commit it was built from (game/world/build_commit.cmake, "+changes" for
// a checkout with uncommitted edits), and the stamp must be exactly this side's commit.
const stamp = (fs.readFileSync(path.join(wt, 'build/game/generated/build_commit.h'), 'utf8').match(/DZ_BUILD_COMMIT "([^"]*)"/) || [])[1];
if (stamp !== sha) { console.error(`REFUSED: the exe was built from ${stamp}, not ${sha}`); process.exit(5); }
void ct;
fs.mkdirSync(out, { recursive: true });
if (fs.readdirSync(out).length) { console.error('REFUSED: ' + out + ' is not empty'); process.exit(5); }
const run = 'C:/Users/nname/AppData/Local/Temp/claude/8e9709f509cfea85/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/filmrun/run-20261112-204506.txt';
console.log(`film ${side}: ${sha} in ${wt}`);
const r = spawnSync('node', ['C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js', '--run', '--cmd', `dreamzone-3 E L185 re-film capture (${side}, not a timing session)`, '--',
  exe, '--config', 'game/config', '--capture-lean', out, '--lean-run', run, '--lean-film'], { cwd: wt, encoding: 'utf8', maxBuffer: 1 << 26 });
process.stdout.write(r.stdout || ''); process.stderr.write(r.stderr || '');
const pngs = fs.readdirSync(out).filter(n => n.endsWith('.png'));
// Every frame, none missing: film_<stretch>_000 .. _287 for each stretch (2 s at 144 a second).
let missing = [];
for (const st of ['straight', 'corner'])
  for (let k = 0; k < 288; ++k) { const n = `film_${st}_${String(k).padStart(3, '0')}.png`; if (!pngs.includes(n)) missing.push(n); }
const crypto = require('crypto');
const sha256 = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const txt = fs.readFileSync(run, 'utf8');
const field = (k) => ((txt.match(new RegExp('^' + k + '\\s*=\\s*(.*)$', 'm')) || [])[1] || '?').trim();
const said = (r.stdout || '').split(/\r?\n/).filter(l => l.startsWith('capture-lean:'));
const side_txt = [
  `side          = ${side}`,
  `commit        = ${sha}`,
  `frames        = ${pngs.length} (288 per stretch expected; missing ${missing.length})`,
  `frame rate    = 144 a second (one game step of 1/144 s per frame, every step written: --lean-film)`,
  `run           = ${path.basename(run)} sha256 ${sha256(run)}`,
  `run dzr       = ${path.basename(run).replace(/\.txt$/, '.dzr')} sha256 ${sha256(run.replace(/\.txt$/, '.dzr'))}`,
  `run seed      = ${field('seed')}`,
  `run level     = ${field('level')} (${field('level_name')})`,
  `run recorded  = on build ${field('build')}, ${field('began')}, ${field('ticks')} ticks`,
  ...said.map(l => `said          = ${l}`),
].join('\n') + '\n';
fs.writeFileSync(path.join(out, 'SIDE.txt'), side_txt);
console.log(side_txt);
console.log(`film ${side}: exit ${r.status}, ${pngs.length} frames, missing ${missing.length}`);
process.exit(r.status === 0 && pngs.length === 576 && missing.length === 0 ? 0 : 1);
