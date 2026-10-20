'use strict';
// D420 part 2 (O, 2026-10-20): census of a t180 repo's worktrees and branches. Read-only.
//   node census.js <repo dir> <out file> [--keep-branches a,b,c] [--keep-paths p1,p2]
// Per worktree: path, HEAD, branch (or detached), dirty line count, reachable from v0.4.9 / origin/main / main, every link (symlink or
// junction; node's lstat reports a Windows junction as a symbolic link) at depth 1 and 2, and KEEP with its reason. Then every branch, with
// its worktree if any, and reachability. A JSON copy is written beside the text for the removal step.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const [repo, out, ...rest] = process.argv.slice(2);
const opt = (k) => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1].split(',').filter(Boolean) : []; };
const KEEP_BRANCHES = new Set(opt('--keep-branches')), KEEP_PATHS = new Set(opt('--keep-paths').map((p) => path.resolve(p).toLowerCase()));
const git = (args, cwd = repo) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] });
const tryGit = (args, cwd) => { try { return git(args, cwd); } catch (e) { return null; } };
const BASES = ['v0.4.9', 'origin/main', 'main'].filter((b) => tryGit(['rev-parse', '--verify', '--quiet', `${b}^{commit}`]) !== null);
const reach = (sha) => BASES.filter((b) => tryGit(['merge-base', '--is-ancestor', sha, b]) !== null);
function links(root) {
  const found = [];
  const walk = (d, depth) => {
    let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch (_) { return; }
    for (const e of ents) {
      if (e.name === '.git') continue;
      const p = path.join(d, e.name);
      let st; try { st = fs.lstatSync(p); } catch (_) { continue; }
      if (st.isSymbolicLink()) { let t = '?'; try { t = fs.readlinkSync(p); } catch (_) {} found.push(`${path.relative(root, p)} -> ${t}`); continue; }
      if (st.isDirectory() && depth < 2) walk(p, depth + 1);
    }
  };
  walk(root, 1);
  return found;
}
const wts = [];
let cur = null;
for (const line of git(['worktree', 'list', '--porcelain']).split(/\r?\n/)) {
  if (line.startsWith('worktree ')) { cur = { path: line.slice(9) }; wts.push(cur); }
  else if (cur && line.startsWith('HEAD ')) cur.head = line.slice(5);
  else if (cur && line.startsWith('branch ')) cur.branch = line.slice(7).replace('refs/heads/', '');
  else if (cur && line === 'detached') cur.detached = true;
  else if (cur && line.startsWith('prunable')) cur.prunable = line;
  else if (cur && line.startsWith('locked')) cur.locked = line;
}
const mainPath = path.resolve(wts[0].path).toLowerCase();
for (const w of wts) {
  const exists = fs.existsSync(w.path);
  w.exists = exists;
  const st = exists ? tryGit(['status', '--porcelain'], w.path) : null;
  w.dirty = st === null ? null : st.split(/\r?\n/).filter(Boolean).length;
  w.reach = w.head ? reach(w.head) : [];
  w.links = exists ? links(w.path) : [];
  const p = path.resolve(w.path).toLowerCase();
  w.keep = p === mainPath ? 'the repo main checkout' : KEEP_PATHS.has(p) ? 'kept by path' : (w.branch && KEEP_BRANCHES.has(w.branch)) ? `open lap branch ${w.branch}` : null;
}
const wtByBranch = new Map(wts.filter((w) => w.branch).map((w) => [w.branch, w.path]));
const branches = git(['for-each-ref', '--format=%(refname:short) %(objectname)', 'refs/heads']).trim().split(/\r?\n/).map((l) => {
  const [name, sha] = l.split(' ');
  return { name, sha, worktree: wtByBranch.get(name) || null, reach: reach(sha), keep: KEEP_BRANCHES.has(name) ? 'open lap' : null };
});
const lines = [];
lines.push(`census of ${repo} at ${new Date().toISOString()} · bases: ${BASES.join(', ')} (${BASES.map((b) => b + '=' + git(['rev-parse', '--short=8', b]).trim()).join(' ')})`);
lines.push(`worktrees: ${wts.length} · branches: ${branches.length} · dirty worktrees: ${wts.filter((w) => w.dirty).length} · worktrees holding links: ${wts.filter((w) => w.links.length).length} · missing dirs: ${wts.filter((w) => !w.exists).length}`);
lines.push('', '## worktrees', 'path\tHEAD\tbranch\tdirty\treachable-from\tlinks\tkeep');
for (const w of wts) lines.push([w.path, (w.head || '').slice(0, 8), w.branch || (w.detached ? '(detached)' : '?'), w.dirty === null ? 'n/a' : w.dirty, w.reach.join('+') || 'UNREACHABLE', w.links.length ? w.links.join(' ; ') : '-', w.keep || '-'].join('\t') + (w.prunable ? `\t${w.prunable}` : ''));
lines.push('', '## branches', 'branch\tsha\tworktree\treachable-from\tkeep');
for (const b of branches) lines.push([b.name, b.sha.slice(0, 8), b.worktree || '-', b.reach.join('+') || 'UNREACHABLE', b.keep || '-'].join('\t'));
fs.writeFileSync(out, lines.join('\n') + '\n');
fs.writeFileSync(out.replace(/\.txt$/, '') + '.json', JSON.stringify({ repo, bases: BASES, worktrees: wts, branches }, null, 1));
console.log(lines.slice(0, 2).join('\n'));
