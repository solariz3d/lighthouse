'use strict';
// D420 part 2 step 3 (O, 2026-10-20): remove the non-KEEP worktrees of census-before.json, then their branches, then prune.
//   node remove.js <census-before.json> <archive dir> [--dry-run] [--extra-branches a,b,c]
// Safeguards, in order, per worktree:
//  - FULL-depth link scan (symlinks and junctions, .git skipped); each link is removed AS A LINK (cmd /c rmdir, or unlink for a file
//    link) before the worktree goes, so `git worktree remove` can never follow one into its target (memory worktree-remove-follows-junctions);
//  - status re-read: a worktree whose `git status --porcelain` differs from the census is SKIPPED (its new changes are not in the archive);
//  - a dirty worktree is removed with --force only if its archive folder exists (<archive>/dirty/<name>/diff.patch); a clean one never;
//  - a locked worktree is skipped and named.
// The run takes both heavy-run slots (it waits for C's runs), and refuses if any lock names a timing session.
const fs = require('fs'), path = require('path'), { execFileSync, spawnSync } = require('child_process');
const [censusFile, archive, ...rest] = process.argv.slice(2);
const DRY = rest.includes('--dry-run');
const xi = rest.indexOf('--extra-branches'), EXTRA = xi >= 0 ? rest[xi + 1].split(',').filter(Boolean) : [];
const c = JSON.parse(fs.readFileSync(censusFile, 'utf8')), repo = c.repo;
const git = (args, cwd = repo) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] });
const DATA = 'C:/Consonance/data';
const timing = () => fs.readdirSync(DATA).filter((f) => /^heavy-run(\.\d+)?\.lock$/.test(f)).map((f) => { try { return JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')); } catch (_) { return null; } }).filter((h) => h && /timing/i.test(h.cmd || ''));
if (!DRY) {
  const HR = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
  HR.hold({ cmd: 'O D420 cleanup: worktree removals (disk load)', maxWaitMs: 3 * 60 * 60 * 1000 });
  const env2 = { ...process.env }; delete env2[HR.TOKEN_ENV];
  const h2 = HR.acquire({ cmd: 'O D420 cleanup (second slot)', env: env2, tree: HR.NON_GIT_TREE, maxWaitMs: 3 * 60 * 60 * 1000 });
  process.on('exit', () => h2.release());
}
const t = timing(); if (t.length) { console.error(`refusing: a lock names a timing session: ${t.map((h) => h.cmd).join(' | ')}`); process.exit(5); }

function allLinks(root) {
  const found = [];
  const walk = (d) => {
    let ents; try { ents = fs.readdirSync(d, { withFileTypes: true }); } catch (_) { return; }
    for (const e of ents) {
      if (e.name === '.git') continue;
      const p = path.join(d, e.name);
      let st; try { st = fs.lstatSync(p); } catch (_) { continue; }
      if (st.isSymbolicLink()) { found.push(p); continue; }   // never descend into a link
      if (st.isDirectory()) walk(p);
    }
  };
  walk(root);
  return found;
}
const report = { dry: DRY, removed: [], skipped: [], linksRemoved: [], branchesDeleted: [], branchesFailed: [] };
const removedBranches = [];
for (const w of c.worktrees.filter((x) => !x.keep)) {
  const name = path.basename(w.path);
  if (!fs.existsSync(w.path)) { report.skipped.push(`${name}: directory missing (prune will drop it)`); continue; }
  if (w.locked) { report.skipped.push(`${name}: locked (${w.locked})`); continue; }
  const now = git(['status', '--porcelain'], w.path).split(/\r?\n/).filter(Boolean).length;
  if (now !== w.dirty) { report.skipped.push(`${name}: status changed since the census (${w.dirty} -> ${now} lines): not archived, left alone`); continue; }
  const head = git(['rev-parse', 'HEAD'], w.path).trim();
  if (head !== w.head) { report.skipped.push(`${name}: HEAD moved since the census: left alone`); continue; }
  const archived = fs.existsSync(path.join(archive, 'dirty', name, 'diff.patch'));
  if (w.dirty && !archived) { report.skipped.push(`${name}: dirty and not archived: left alone`); continue; }
  const links = allLinks(w.path);
  if (DRY) { report.removed.push(`${name}${w.dirty ? ' (dirty, archived, --force)' : ''}${links.length ? ` [links: ${links.join(', ')}]` : ''}`); if (w.branch) removedBranches.push(w.branch); continue; }
  for (const l of links) {
    const isDir = (() => { try { return fs.statSync(l).isDirectory(); } catch (_) { return true; } })();
    const r = isDir ? spawnSync('cmd', ['/c', 'rmdir', l], { encoding: 'utf8' }) : (fs.unlinkSync(l), { status: 0 });
    if (r.status !== 0 || fs.existsSync(l) && fs.lstatSync(l).isSymbolicLink()) throw new Error(`could not remove the link ${l}; stopping before any worktree removal of ${name}`);
    report.linksRemoved.push(l);
  }
  if (allLinks(w.path).length) throw new Error(`${name} still holds a link after removal; stopping`);
  git(['worktree', 'remove', ...(w.dirty ? ['--force'] : []), w.path]);
  if (fs.existsSync(w.path)) throw new Error(`${name}: directory still there after git worktree remove`);
  report.removed.push(`${name}${w.dirty ? ' (--force, archived)' : ''}`);
  if (w.branch) removedBranches.push(w.branch);
}
for (const b of [...removedBranches, ...EXTRA]) {
  if (c.branches.find((x) => x.name === b && x.keep)) { report.branchesFailed.push(`${b}: KEEP, not deleted`); continue; }
  if (DRY) { report.branchesDeleted.push(b); continue; }
  try { git(['branch', '-D', b]); report.branchesDeleted.push(b); } catch (e) { report.branchesFailed.push(`${b}: ${String(e.stderr || e.message).trim()}`); }
}
if (!DRY) git(['worktree', 'prune']);
console.log(JSON.stringify({ ...report, counts: { removed: report.removed.length, skipped: report.skipped.length, linksRemoved: report.linksRemoved.length, branchesDeleted: report.branchesDeleted.length, branchesFailed: report.branchesFailed.length } }, null, 1));
