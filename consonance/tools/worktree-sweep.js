#!/usr/bin/env node
'use strict';
// worktree-sweep.js — the one-time removal of worktrees whose work is already in main (D319 part 1, pane E). DRY RUN BY DEFAULT.
// Plan: exo_memory/loop/plan_worktree_cleanup_2026-10-13.md:20-32. The keeper, 14:35: "yes" to removing worktrees whose work is already in
// main, with the unlanded ones listed for him first.
//
//   node consonance/tools/worktree-sweep.js                 dry run: every worktree with its class; nothing changes
//   node consonance/tools/worktree-sweep.js --apply         remove the REMOVE class with plain `git worktree remove`, then `git worktree prune`
//   node consonance/tools/worktree-sweep.js --json          the same, as JSON
//   --repo <dir>   the repository (default: the one this file is in)    --data <dir>   where the heavy-run locks are (default: state-manifest's dataDir)
//
// Everything is classified from git AT RUN TIME, and each REMOVE is classified again just before it is removed. The classes, in order (the first
// that applies is the class; dirty files and unlanded commits are listed whenever they exist, so the keeper's lists are whole):
//   MAIN       the main checkout. Never touched.
//   MISSING    git lists it but its folder is gone: `git worktree prune` clears it.
//   GIT-LOCKED `git worktree lock` was put on it. Kept.
//   LOCK       a heavy-run lock names it (any lock file present counts, alive or not: the safe side). While any lock records no tree, --apply
//              refuses to remove anything.
//   DIRTY      `git status --porcelain` is not empty (untracked files included). Kept; its files are listed.
//   UNLANDED   HEAD is not in main and `git cherry main HEAD` has a patch not in main. Kept; each commit is listed with its subject.
//   LINK       a junction or symlink (a reparse point) anywhere inside it. Kept; each link is named. On 2026-09-28 a --force removal of a worktree
//              holding a junction emptied the junction's TARGET, the shared t180 reads/ (exo_memory/handback/p-d184-read-B_2026-09-28.md §7).
//              A clean worktree can still hold one, under an ignored path, and `git worktree remove` deletes ignored files.
//   PROCESS    a running process names the worktree in its command line or executable path (a live seat, a server, a build). Kept.
//              A process whose working directory is inside it without naming it cannot be seen here; Windows then refuses the removal, and the
//              refusal is listed (REFUSED), never forced.
//   REMOVE     clean, and HEAD in main or every patch in main by `git cherry`. Removed with `git worktree remove` (never --force, never rm -rf).
// Branches are kept, so any removal is undone by `git worktree add <path> <branch or sha>`.
//
// --only <file> (D319 part 1b, the keeper's go on named worktrees, 2026-10-13 15:31; plan_worktree_cleanup_2026-10-13.md:42-50): only the
// worktrees listed in <file> (one path a line) are classified and acted on; every other worktree is left alone and not listed. For a listed
// worktree an unlanded HEAD is no bar IF A BRANCH HOLDS IT (`git for-each-ref --contains`), since the branch keeps every commit after the
// removal; a HEAD no branch holds stays UNLANDED and kept. Every other guard is unchanged. A listed path git does not know is reported.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const norm = (p) => path.resolve(p).replace(/[\\/]+$/, '').toLowerCase();
const inside = (p, dir) => norm(p) === norm(dir) || norm(p).startsWith(norm(dir) + path.sep.toLowerCase());

function git(cwd, args) {
  const r = spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8', timeout: 120000, windowsHide: true, maxBuffer: 1 << 26 });
  return { ok: r.status === 0, out: String(r.stdout || '').replace(/\s+$/, ''), err: String(r.stderr || '').trim() || (r.error ? String(r.error.message) : '') };
}

/** `git worktree list --porcelain` → [{ path, head, branch, locked, prunable }], the main checkout first. */
function listWorktrees(repo) {
  const r = git(repo, ['worktree', 'list', '--porcelain']);
  if (!r.ok) throw new Error(`git worktree list failed in ${repo}: ${r.err}`);
  const out = [];
  let cur = null;
  for (const line of r.out.split(/\r?\n/)) {
    if (line.startsWith('worktree ')) { cur = { path: path.resolve(line.slice(9)), head: null, branch: null, locked: false, prunable: false }; out.push(cur); }
    else if (!cur) continue;
    else if (line.startsWith('HEAD ')) cur.head = line.slice(5);
    else if (line.startsWith('branch ')) cur.branch = line.slice(7).replace(/^refs\/heads\//, '');
    else if (line === 'locked' || line.startsWith('locked ')) cur.locked = true;
    else if (line === 'prunable' || line.startsWith('prunable ')) cur.prunable = true;
  }
  return out;
}

/** The heavy-run lock files: { trees: [normalised], untreed: bool }. Present counts as held (the janitor's rule, janitor.js heldLocks). */
function heldLocks(dataDir) {
  const trees = []; let untreed = false;
  if (!dataDir) return { trees, untreed };
  let es; try { es = fs.readdirSync(dataDir); } catch (_) { return { trees, untreed }; }
  for (const n of es) {
    if (!/^heavy-run(\.\d+)?\.lock$/.test(n)) continue;
    let h; try { h = JSON.parse(fs.readFileSync(path.join(dataDir, n), 'utf8')); } catch (_) { untreed = true; continue; }
    if (h && typeof h.tree === 'string' && h.tree && !h.tree.startsWith('(')) trees.push(norm(h.tree)); else untreed = true;
  }
  return { trees, untreed };
}

/** Running processes as [{ pid, text }], text = command line + executable path, lower-cased. Windows: CIM; elsewhere: ps. */
function listProcesses() {
  if (process.platform === 'win32') {
    const ps = 'Get-CimInstance Win32_Process | ForEach-Object { "$($_.ProcessId)`t$($_.ExecutablePath) $($_.CommandLine)" }';
    const r = spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps], { encoding: 'utf8', timeout: 120000, windowsHide: true, maxBuffer: 1 << 26 });
    if (r.status !== 0) throw new Error(`could not list processes: ${String(r.stderr || r.error || '').slice(0, 300)}`);
    return String(r.stdout).split(/\r?\n/).filter(Boolean).map((l) => { const i = l.indexOf('\t'); return { pid: +l.slice(0, i), text: l.slice(i + 1).toLowerCase().replace(/\//g, '\\') }; });
  }
  const r = spawnSync('ps', ['-eo', 'pid=,args='], { encoding: 'utf8' });
  return String(r.stdout || '').split('\n').filter(Boolean).map((l) => { const m = l.trim().match(/^(\d+)\s+(.*)$/); return m ? { pid: +m[1], text: m[2].toLowerCase() } : null; }).filter(Boolean);
}

/** One walk of a worktree, never through a link: { bytes, links: [paths] }. */
function survey(dir) {
  let bytes = 0; const links = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    let es; try { es = fs.readdirSync(d, { withFileTypes: true }); } catch (_) { continue; }
    for (const e of es) {
      const p = path.join(d, e.name);
      if (e.isSymbolicLink()) { links.push(p); continue; }
      if (e.isDirectory()) { stack.push(p); continue; }
      try { bytes += fs.lstatSync(p).size; } catch (_) {}
    }
  }
  return { bytes, links };
}

/** Classify one worktree. ctx = { repo, mainRef, mainPath, locks, procs }. */
function classify(wt, ctx) {
  const r = { path: wt.path, branch: wt.branch, head: wt.head, class: null, reasons: [], dirty: [], unlanded: [], links: [], pids: [], bytes: 0 };
  const set = (c, why) => { if (!r.class) r.class = c; r.reasons.push(why); };
  if (norm(wt.path) === norm(ctx.mainPath)) { r.class = 'MAIN'; r.reasons.push('the main checkout'); return r; }
  if (wt.prunable || !fs.existsSync(wt.path)) { r.class = 'MISSING'; r.reasons.push('its folder is gone; git worktree prune clears it'); return r; }
  if (wt.locked) set('GIT-LOCKED', 'git worktree lock is on it');
  if (ctx.locks.trees.some((t) => inside(t, wt.path))) set('LOCK', 'a heavy-run lock names it');
  const st = git(wt.path, ['status', '--porcelain']);
  if (!st.ok) set('DIRTY', `git status failed: ${st.err}`);
  else if (st.out) { r.dirty = st.out.split(/\r?\n/); set('DIRTY', `${r.dirty.length} changed or untracked path(s)`); }
  const inMain = wt.head && git(ctx.repo, ['merge-base', '--is-ancestor', wt.head, ctx.mainRef]).ok;
  if (!inMain) {
    const ch = git(ctx.repo, ['cherry', ctx.mainRef, wt.head]);
    if (!ch.ok) set('UNLANDED', `git cherry failed: ${ch.err}`);
    else {
      for (const l of ch.out.split(/\r?\n/)) {
        const m = l.match(/^\+ ([0-9a-f]+)/); if (!m) continue;
        r.unlanded.push({ sha: m[1].slice(0, 10), subject: git(ctx.repo, ['log', '-1', '--format=%s', m[1]]).out });
      }
      if (r.unlanded.length) {
        const held = ctx.branchesHold ? git(ctx.repo, ['for-each-ref', '--contains', wt.head, '--format=%(refname:short)', 'refs/heads']).out.split(/\r?\n/).filter(Boolean) : [];
        if (held.length) { r.heldBy = held; r.reasons.push(`${r.unlanded.length} unlanded commit(s), all kept by branch ${held.join(', ')}`); }
        else set('UNLANDED', `${r.unlanded.length} commit(s) whose patch is not in ${ctx.mainRef}${ctx.branchesHold ? ', and no branch holds HEAD' : ''}`);
      }
    }
  }
  const sv = ctx.survey(wt.path);
  r.bytes = sv.bytes;
  if (sv.links.length) { r.links = sv.links; set('LINK', `${sv.links.length} junction(s) or symlink(s) inside`); }
  const lp = norm(wt.path);
  r.pids = ctx.procs.filter((p) => p.text.includes(lp)).map((p) => p.pid).filter((pid) => pid !== process.pid);
  if (r.pids.length) set('PROCESS', `a running process names it (pid ${r.pids.join(', ')})`);
  if (!r.class) { r.class = 'REMOVE'; r.reasons.push(inMain ? `clean; HEAD is in ${ctx.mainRef}` : `clean; every patch is in ${ctx.mainRef} (git cherry)`); }
  return r;
}

/** The act itself: plain `git worktree remove`, never --force, so git keeps its own refusals (a dirty or locked worktree). */
function removeOne(mainPath, wtPath) {
  const rm = git(mainPath, ['worktree', 'remove', wtPath]);
  return { ok: rm.ok && !fs.existsSync(wtPath), err: rm.err || (rm.ok ? 'the folder is still there' : '') };
}

function sweep(opts) {
  const repo = path.resolve(opts.repo);
  const top = git(repo, ['rev-parse', '--path-format=absolute', '--git-common-dir']);
  if (!top.ok) throw new Error(`not a git repository: ${repo}`);
  const all = listWorktrees(repo);
  const mainPath = all[0].path;
  const locks = heldLocks(opts.data);
  const only = opts.only ? opts.only.map(norm) : null;
  const ctx = { repo: mainPath, mainRef: opts.mainRef || 'main', mainPath, locks, procs: (opts.listProcesses || listProcesses)(), survey: opts.survey || survey, branchesHold: !!only };
  const chosen = only ? all.filter((wt) => only.includes(norm(wt.path))) : all;
  const rows = chosen.map((wt) => classify(wt, ctx));
  const out = { apply: !!opts.apply, repo: mainPath, only: !!only, notFound: only ? opts.only.filter((p) => !all.some((wt) => norm(wt.path) === norm(p))) : [], untreedLock: locks.untreed, rows, removed: [], refused: [], prune: null, freedBytes: 0 };
  if (!opts.apply) return out;
  if (locks.untreed) { out.refusedAll = 'a heavy-run lock records no tree, so any worktree may hold it: nothing removed'; return out; }
  for (const r of rows.filter((x) => x.class === 'REMOVE')) {
    // classified again just before the removal: nothing from the first pass is trusted for the act
    const wt = listWorktrees(mainPath).find((w) => norm(w.path) === norm(r.path));
    const again = wt ? classify(wt, { ...ctx, locks: heldLocks(opts.data), procs: (opts.listProcesses || listProcesses)() }) : null;
    if (!again || again.class !== 'REMOVE') { out.refused.push({ path: r.path, why: again ? `now ${again.class}: ${again.reasons.join('; ')}` : 'no longer listed by git' }); continue; }
    const rm = removeOne(mainPath, r.path);
    if (rm.ok) { out.removed.push({ path: r.path, branch: r.branch, head: r.head, bytes: again.bytes }); out.freedBytes += again.bytes; }
    else out.refused.push({ path: r.path, why: `git refused: ${rm.err}` });
  }
  const pr = git(mainPath, ['worktree', 'prune', '-v']);
  out.prune = { ok: pr.ok, out: [pr.out, pr.err].filter(Boolean).join('\n') };
  return out;
}

const gb = (b) => `${(b / 1e9).toFixed(2)} GB`;
function report(o) {
  const L = [];
  const by = {};
  for (const r of o.rows) (by[r.class] = by[r.class] || []).push(r);
  L.push(`worktree-sweep ${o.apply ? '--apply' : '(dry run: nothing changes)'}${o.only ? ' --only' : ''} · ${o.repo} · ${o.rows.length} worktrees`);
  for (const p of o.notFound || []) L.push(`NOT A WORKTREE (listed, not known to git): ${p}`);
  L.push('classes: ' + Object.keys(by).sort().map((c) => `${c} ${by[c].length}`).join(' · '));
  if (o.untreedLock) L.push('NOTE: a heavy-run lock records no tree; --apply removes nothing while it is there');
  for (const r of o.rows) {
    L.push(`${r.class.padEnd(10)} ${r.path}${r.branch ? `  [${r.branch}]` : ''}  ${gb(r.bytes)}  — ${r.reasons.join('; ')}`);
    for (const f of r.dirty) L.push(`             dirty: ${f}`);
    for (const c of r.unlanded) L.push(`             unlanded: ${c.sha} ${c.subject}`);
    for (const l of r.links) L.push(`             link: ${l}`);
  }
  if (o.apply) {
    if (o.refusedAll) L.push(`REFUSED ALL: ${o.refusedAll}`);
    L.push(`removed ${o.removed.length}, ${gb(o.freedBytes)} freed (bytes of the removed worktrees, measured before removal)`);
    for (const x of o.refused) L.push(`REFUSED ${x.path} — ${x.why}`);
    if (o.prune) L.push(`git worktree prune: ${o.prune.ok ? 'ok' : 'FAILED'}${o.prune.out ? `\n${o.prune.out}` : ''}`);
  } else {
    const rm = by.REMOVE || [];
    L.push(`would remove ${rm.length}, ${gb(rm.reduce((a, r) => a + r.bytes, 0))}`);
  }
  return L.join('\n');
}

module.exports = { sweep, classify, removeOne, listWorktrees, heldLocks, survey, listProcesses, report };

if (require.main === module) {
  const a = process.argv.slice(2);
  const val = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
  let data = val('--data');
  if (!data) { try { data = require('./state-manifest.js').dataDir(); } catch (_) { data = null; } }
  const onlyFile = val('--only');
  const only = onlyFile ? fs.readFileSync(onlyFile, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#')) : null;
  const opts = { apply: a.includes('--apply'), repo: val('--repo') || path.join(__dirname, '..', '..'), data, only };
  try {
    const o = sweep(opts);
    console.log(a.includes('--json') ? JSON.stringify(o, null, 1) : report(o));
    process.exit(o.refused && o.refused.length ? 2 : 0);
  } catch (e) {
    console.error(`worktree-sweep: ${e.message}`);
    process.exit(1);
  }
}
