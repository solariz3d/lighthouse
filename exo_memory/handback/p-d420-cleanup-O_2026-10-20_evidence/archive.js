'use strict';
// D420 part 2 step 2 (O, 2026-10-20): archive before any removal. Reads census-before.json.
//  - every dirty worktree that will be removed: `git diff HEAD` (staged and unstaged), `git status --porcelain`, and a COPY of each
//    untracked file (not only its name), into <archive>/dirty/<worktree name>/;
//  - one self-contained bundle of every local branch, plus every detached HEAD not reachable from the bases (carried by temporary refs
//    refs/d420-archive/<worktree name>, deleted again once the bundle verifies);
//  - git bundle verify, and the bundle's sha256.
//   node archive.js <census-before.json> <archive dir> <bundle name>
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { execFileSync } = require('child_process');
const [censusFile, archive, bundleName] = process.argv.slice(2);
const c = JSON.parse(fs.readFileSync(censusFile, 'utf8')), repo = c.repo;
const git = (args, cwd = repo) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 30, stdio: ['ignore', 'pipe', 'pipe'] });
fs.mkdirSync(path.join(archive, 'dirty'), { recursive: true });
const log = [];
for (const w of c.worktrees.filter((x) => !x.keep && x.dirty)) {
  const name = path.basename(w.path), d = path.join(archive, 'dirty', name);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'diff.patch'), git(['diff', 'HEAD', '--binary'], w.path));
  const st = git(['status', '--porcelain', '-uall'], w.path);
  fs.writeFileSync(path.join(d, 'status.txt'), `worktree ${w.path}\nHEAD ${w.head}\nbranch ${w.branch || '(detached)'}\n\n${st}`);
  const untracked = st.split(/\r?\n/).filter((l) => l.startsWith('?? ')).map((l) => l.slice(3).replace(/^"(.*)"$/, '$1'));
  for (const u of untracked) { const dst = path.join(d, 'untracked', u); fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(path.join(w.path, u), dst); }
  log.push(`${name}: diff ${fs.statSync(path.join(d, 'diff.patch')).size} bytes, ${untracked.length} untracked file(s) copied`);
}
const temp = c.worktrees.filter((w) => w.detached && !w.reach.length).map((w) => ({ ref: `refs/d420-archive/${path.basename(w.path)}`, sha: w.head }));
for (const t of temp) git(['update-ref', t.ref, t.sha]);
const bundle = path.join(archive, bundleName);
try {
  git(['bundle', 'create', bundle, '--branches', ...temp.map((t) => t.ref)]);
  const verify = execFileSync('git', ['bundle', 'verify', bundle], { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  const heads = git(['bundle', 'list-heads', bundle]).trim().split(/\r?\n/);
  const sha256 = crypto.createHash('sha256').update(fs.readFileSync(bundle)).digest('hex');
  log.push(`bundle ${bundle}: ${fs.statSync(bundle).size} bytes, ${heads.length} heads, sha256 ${sha256}`, `verify: ${verify.trim().split(/\r?\n/).pop()}`);
  fs.writeFileSync(path.join(archive, bundleName + '.heads.txt'), heads.join('\n') + '\n');
  fs.writeFileSync(path.join(archive, bundleName + '.sha256'), `${sha256}  ${bundleName}\n`);
} finally {
  for (const t of temp) git(['update-ref', '-d', t.ref, t.sha]);
}
console.log(log.join('\n'));
