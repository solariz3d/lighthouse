// D184 RE-RUN (the chair's packet B), ALL IN ONE hold of the heavy-run lock, every node process at 4096 MB:
//  1. a NEW worktree b-d184r-wt on 8868531; the D184 files COPIED file by file by named path (never a link); sha256 at copy time;
//  2. the fresh-session test, once (reads/ asserted ABSENT at the start: G1's proof);
//  3. the evals once more (reads for the regressions are plain COPIES made after the session);
//  4. E's reads/ restore in the shared checkout: every file ignored, nothing trackable;
//  5. no reparse points in the worktree (find -type l and dir /AL /S).
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { spawnSync, execFileSync } = require('child_process');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane B: D184 RE-RUN (new worktree, fresh session, evals, reads + reparse checks)' });
const HERE = path.join(__dirname, 'rerun'), SH = 'C:/Users/nname/Desktop/t180-track-builder', WT = 'C:/Users/nname/AppData/Local/Temp/b-d184r-wt';
fs.mkdirSync(HERE, { recursive: true });
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', maxBuffer: 1 << 26 });
const rep = { t0: new Date().toISOString() };
// 1 · the worktree and the copy
if (fs.existsSync(WT)) throw new Error(`${WT} exists — not overwriting`);
git(SH, 'worktree', 'add', '--detach', WT, '8868531');
const skill = git(SH, 'status', '--porcelain', '--untracked-files=all', '--', '.claude/skills/track-equations').split('\n').filter(Boolean).map((l) => l.slice(3));
const named = ['tools/piecewise.cjs', 'test/piecewise.test.js', 'tools/meshcurv.cjs', 'tools/geodesic.cjs', 'test/m2m3_tools.test.js', 'tools/fourier.cjs', 'test/fourier.test.js'];
const paths = [...skill, ...named];
const rows = [];
for (const p of paths) { const s = path.join(SH, p), d = path.join(WT, p); fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(s, d); rows.push(`${sha(s)}  ${p}`); }
fs.writeFileSync(path.join(HERE, 'copied.sha256'), rows.join('\n') + '\n');
rep.copied = rows.length; rep.copiedAt = new Date().toISOString();
rep.readsAbsentAtStart = !fs.existsSync(path.join(WT, 'reads'));
if (!rep.readsAbsentAtStart) throw new Error('reads/ exists at the start: G1 cannot be shown');
// 2 · the fresh session
const prompt = fs.readFileSync(path.join(__dirname, 'fresh_prompt.txt'), 'utf8');
const args = ['-p', prompt, '--setting-sources', 'project,local', '--strict-mcp-config', '--no-session-persistence',
  '--permission-mode', 'bypassPermissions', '--disallowedTools', 'Bash(git commit*)', 'Bash(git push*)', 'WebFetch', 'WebSearch',
  '--output-format', 'stream-json', '--verbose'];
let t = Date.now();
const r = spawnSync('C:/Users/nname/.local/bin/claude.exe', args, { cwd: WT, env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' }, encoding: 'utf8', maxBuffer: 1 << 29, timeout: 45 * 60 * 1000 });
fs.writeFileSync(path.join(HERE, 'fresh_transcript.jsonl'), r.stdout || '');
rep.fresh = { exit: r.status, minutes: +((Date.now() - t) / 60000).toFixed(1), stderr: (r.stderr || '').slice(0, 500) };
// 3 · the evals (regression reads: plain copies of the 7 besides Serpents, after the session made its own)
for (const n of ['bowltrack_2', 'centrifuge', 'eagleton__eagleton', 'ohyeah2389_t180testtrack', 'rainbow_rd', 'sakura_speedway', 'thunderhead_raceway__normal']) {
  const d = path.join(WT, 'reads', `${n}.read.json`); if (!fs.existsSync(d)) { fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(path.join(SH, 'reads', `${n}.read.json`), d); }
}
const E = '.claude/skills/track-equations/evals/';
rep.evals = {};
for (const [label, files] of [['known+mutation', [E + 'known_answers.test.js', E + 'mutation.test.js']], ['regressions', [E + 'regressions.test.js']], ['piecewise', ['test/piecewise.test.js']], ['m2m3', ['test/m2m3_tools.test.js']], ['fourier', ['test/fourier.test.js']]]) {
  t = Date.now();
  const x = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-reporter=spec', '--test-concurrency=4', ...files], { cwd: WT, env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', NODE_OPTIONS: '--max-old-space-size=4096' }, encoding: 'utf8', maxBuffer: 1 << 28, timeout: 40 * 60 * 1000 });
  const out = ((x.stdout || '') + (x.stderr || '')).replace(/\x1b\[[0-9;]*m/g, '');
  fs.writeFileSync(path.join(HERE, `eval_${label}.txt`), out);
  const g = (k) => { const m = out.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')); return m ? +m[1] : null; };
  rep.evals[label] = { exit: x.status, tests: g('tests'), pass: g('pass'), fail: g('fail'), skipped: g('skipped'), todo: g('todo'), s: Math.round((Date.now() - t) / 1000) };
}
// 4 · the shared checkout's reads/: ignored, and nothing trackable
const rf = fs.readdirSync(path.join(SH, 'reads'));
const notIgnored = rf.filter((f) => spawnSync('git', ['-C', SH, 'check-ignore', '-q', `reads/${f}`]).status !== 0);
rep.sharedReads = { files: rf.length, reads: rf.filter((f) => f.endsWith('.read.json')).length, equations: rf.filter((f) => f.endsWith('.equation.json')).length,
  corpusAndM1: rf.filter((f) => /^(corpus\.(draft|next|runs)|m1)\.json$/.test(f)), notIgnored,
  statusUnderReads: git(SH, 'status', '--porcelain', '--untracked-files=all', '--', 'reads').trim() || '(nothing)', trackedEver: git(SH, 'log', '--all', '--oneline', '--', 'reads').trim() || '(never)' };
// 5 · reparse points
rep.findTypeL = spawnSync('C:/Program Files/Git/usr/bin/find.exe', [WT, '-type', 'l'], { encoding: 'utf8' }).stdout.trim() || '(none)';
const dl = spawnSync('cmd.exe', ['/c', 'dir', '/AL', '/S', '/B', WT.replace(/\//g, '\\')], { encoding: 'utf8' });
rep.dirAL = { exit: dl.status, out: (dl.stdout || '').trim() || '(none)', err: (dl.stderr || '').trim() };
rep.wtStatus = git(WT, 'status', '--porcelain', '--untracked-files=all').trim().split('\n').length;
rep.t1 = new Date().toISOString();
fs.writeFileSync(path.join(HERE, 'rerun.json'), JSON.stringify(rep, null, 1));
