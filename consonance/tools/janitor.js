#!/usr/bin/env node
'use strict';
// janitor.js — what the room leaves on disk, removed on a schedule (D287 part 2). DRY-RUN BY DEFAULT: it prints what it WOULD free per class
// and in total and changes nothing. `--apply` acts, and appends one line per run to <data>/janitor.jsonl, and one per worktree it removes (e).
//
// WHY. On 2026-10-10 12:13 C: hit 0 bytes (exo_memory/loop/plan_clean_up_after_ourselves_2026-10-10.md): ~3,800 gen-consumer staging trees
// (~21 GB), cargo targets left in worktrees (24 GB), pane scratchpads (~60 GB) and ~260,000 small test folders in %TEMP%. Part 1 (pane A,
// scratch.js) stops new leaks; a run that is killed still leaves its folder, and what is already there stays. This catches both.
//
//   node consonance/tools/janitor.js            dry run: what each class would free, what it keeps and why
//   node consonance/tools/janitor.js --apply    act: delete (a)(c)(d), MOVE (b) to the archive, `git worktree remove` (e); ledger lines
//   node consonance/tools/janitor.js --json     the plan as JSON (dry run unless --apply)
//
// THE FOUR CLASSES, and nothing else (the plan's Part 2 and its amendments):
//   (a) TEMP     top-level folders of %TEMP% and of the scratch root (G:\consonance-scratch) whose name is one of the room's OWN test prefixes,
//                older than 2 days. The prefixes are read from this repository's source, never hand-kept: every string literal passed to
//                mkdtemp() in consonance/, dev/ and tools/ (matched with Node's exact 6-character suffix), and the literal head of every
//                temp_dir().join(format!("head{…")) in the Rust (matched at its - or _ boundary). A folder that merely starts the same way but is
//                not shaped like the room's is not matched.
//   (b) LOGS     Claude task-output logs (<%TEMP%>\claude\<project>\<session>\tasks\*) older than 7 days, EXCEPT any whose task id appears
//                anywhere in exo_memory/ (it is cited as evidence). MOVED to <archive>\<date>\<project>\<session>\tasks\, never deleted, where
//                <archive> is archive_dir in ~/.consonance.json (or CONSONANCE_ARCHIVE). No archive configured, or its drive absent: no move, kept.
//   (c) SCRATCH  cargo `target*` folders inside Claude scratchpads, idle more than 2 days. A folder is a cargo target only if it carries cargo's
//                CACHEDIR.TAG; nothing else in a scratchpad is touched (scratchpads themselves are NOT a class this lap: the ruling on C's 75
//                cited directories archives them later, after C's copy is checked).
//   (d) WORKTREE the cargo `target*` of a worktree under the worktrees folder (worktrees_dir in ~/.consonance.json, or CONSONANCE_WORKTREES; none
//                configured: not run, said) whose HEAD is already in its repository's main and which has been idle
//                more than 24 h. Never a main checkout; never a worktree a heavy-run lock is held in (or any, while a lock records no tree).
//   (e) WORKTREE the worktree ITSELF, under the same worktrees folder (D319, exo_memory/loop/plan_worktree_cleanup_2026-10-13.md:33-38), when it is
//       REMOVED  clean (no change, no untracked file), every patch of its HEAD is in main (`git cherry`: landed by cherry-pick under a new id
//                counts), idle more than 24 h, holds no heavy-run lock, holds no link, and no live pane works in it (a pane's own folder under
//                instances_dir, or a path a room transcript written in the last 24 h names). Plain `git worktree remove`, NEVER --force; the
//                branch is kept, and each removal is logged to <data>/janitor.jsonl with its HEAD, so `git worktree add` undoes it. A worktree of
//                the room's repository OUTSIDE the worktrees folder is never removed: the report lists it as a stray.
//
// SAFETY, in order of what would hurt most. Never on D: (the USB stick). Never Downloads, Documents, app data, or a main checkout. Never a
// drive root. Never through a link: a candidate with a symlink or junction anywhere inside is KEPT and named, because removing a junction can
// remove its target (t180's reads/, 2026-09-28). Every deletion is re-checked against its class root and its age at the moment of the act.
//
// The keep-rules carry mutants (janitor.mutants.js): a wrong keep-rule deletes evidence.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const DAY = 24 * 60 * 60 * 1000;
const TEMP_MIN_AGE = 2 * DAY, LOG_MIN_AGE = 7 * DAY, SCRATCH_MIN_IDLE = 2 * DAY, WORKTREE_MIN_IDLE = 1 * DAY;
const REMOVE_MIN_IDLE = 1 * DAY;   // (e): a worktree is removed only when nothing in it, and nothing git wrote for it, is younger than this
const PANE_TAIL = 4 * 1024 * 1024;   // (e): how much of each room transcript written in the last 24 h is read for a worktree's path
const MKDTEMP_SUFFIX = /^[A-Za-z0-9]{6}$/;   // Node's mkdtemp appends exactly six of these
const CARGO_TAG = 'Signature: 8a477f597d28d172789f06886806bc55';   // the first line of the CACHEDIR.TAG cargo writes in every target dir
const SKIP_DIRS = new Set(['node_modules', '.git', 'target', 'exo_memory']);
// (b) and (c) are the ROOM's Claude projects only: the first dry run would have moved two logs of another project of the keeper's (brain-rot)
const ROOM_PROJECT = /consonance|claude-instances/i;
const TEXT_EXT = new Set(['.md', '.txt', '.json', '.jsonl', '.js', '.csv', '.log', '.tap', '.out']);
const FORBIDDEN = [/[\\/]downloads([\\/]|$)/i, /[\\/]documents([\\/]|$)/i, /[\\/]appdata[\\/]roaming([\\/]|$)/i];
const REPO = path.resolve(__dirname, '..', '..');

const norm = (p) => path.resolve(p).replace(/[\\/]+$/, '').toLowerCase();
const within = (p, root) => { const a = norm(p), r = norm(root); return a.startsWith(r + path.sep.toLowerCase()) || a.startsWith(r + '/'); };
const driveOf = (p) => (path.parse(path.resolve(p)).root || '').toUpperCase();
const gb = (b) => (b / 1e9).toFixed(2);

/** The room's test prefixes, read from source: { js: [...mkdtemp literals], rust: [...format! heads] }. */
function sourcePrefixes(repo = REPO) {
  const js = new Set(), rust = new Set();
  // mkdtemp('p'), mkdtemp(path.join(os.tmpdir(), 'p')), and a literal handed to the room's own temp helpers (tmp('dg-'), mkTmp('pg-') …), which
  // count only when the literal ends at a - or _ (a helper named like "attempt" must not turn its arguments into prefixes)
  const JS = /\b(mkdtemp(?:Sync)?|\w*(?:tmp|Tmp|temp|Temp)\w*)\(\s*(?:path\.join\(\s*[^,]*?,\s*)?(['"`])([A-Za-z0-9_.-]{2,40})\2/g;
  const RS = /temp_dir\(\)\s*\.join\(\s*format!\(\s*"([A-Za-z0-9_.-]+?)\{/g;
  const walk = (dir) => {
    let es; try { es = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
    for (const e of es) {
      if (e.isSymbolicLink()) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(p); continue; }
      if (!/\.(js|cjs|mjs|rs)$/.test(e.name)) continue;
      let t; try { t = fs.readFileSync(p, 'utf8'); } catch (_) { continue; }
      if (e.name.endsWith('.rs')) { for (const m of t.matchAll(RS)) if (m[1].length >= 4 && /[-_]$/.test(m[1])) rust.add(m[1]); }
      else for (const m of t.matchAll(JS)) if (/^mkdtemp/.test(m[1]) || /[-_]$/.test(m[3])) js.add(m[3]);
    }
  };
  walk(repo);   // the whole repository but SKIP_DIRS (jev/ makes jev-parity-, dev/ the dream and stick folders, consonance/ the rest)
  return { js: [...js].sort(), rust: [...rust].sort() };
}
/** Is this top-level %TEMP% name one of the room's? */
function roomTempName(name, prefixes) {
  if (name === 'claude') return false;   // the Claude Code temp root: never a class (a) folder
  for (const p of prefixes.js) if (name.startsWith(p) && MKDTEMP_SUFFIX.test(name.slice(p.length))) return true;
  for (const h of prefixes.rust) if (name.startsWith(h) && name.length > h.length) return true;
  return false;
}

/** One walk of a folder, never through a link: { bytes, newest (mtime ms), links, files }. */
function survey(dir) {
  let bytes = 0, newest = 0, links = 0, files = 0;
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    let st; try { st = fs.lstatSync(d); } catch (_) { continue; }
    if (st.isSymbolicLink()) { links++; continue; }
    newest = Math.max(newest, st.mtimeMs);
    if (!st.isDirectory()) { bytes += st.size; files++; continue; }
    let es; try { es = fs.readdirSync(d, { withFileTypes: true }); } catch (_) { continue; }
    for (const e of es) {
      const p = path.join(d, e.name);
      if (e.isSymbolicLink()) { links++; continue; }
      if (e.isDirectory()) { stack.push(p); continue; }
      try { const s = fs.lstatSync(p); bytes += s.size; files++; newest = Math.max(newest, s.mtimeMs); } catch (_) {}
    }
  }
  return { bytes, newest, links, files };
}
const isCargoTarget = (dir) => { try { return fs.readFileSync(path.join(dir, 'CACHEDIR.TAG'), 'utf8').startsWith(CARGO_TAG); } catch (_) { return false; } };
/** cargo target* folders under `root`, to `depth`, not descending into a found target, node_modules, .git or a link. */
function findTargets(root, depth = 6) {
  const out = [];
  const go = (dir, d) => {
    let es; try { es = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
    for (const e of es) {
      if (!e.isDirectory() || e.isSymbolicLink()) continue;
      const p = path.join(dir, e.name);
      if (/^target/.test(e.name) && isCargoTarget(p)) { out.push(p); continue; }
      if (d > 0 && e.name !== 'node_modules' && e.name !== '.git') go(p, d - 1);
    }
  };
  go(root, depth);
  return out;
}

/** The task ids exo_memory cites: every alphanumeric token of 6..40 characters in its text files (one folder, or several: their union). */
function citedTokens(exo) {
  const set = new Set();
  if (Array.isArray(exo)) { for (const d of exo) for (const t of citedTokens(d)) set.add(t); return set; }
  const walk = (dir) => {
    let es; try { es = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
    for (const e of es) {
      if (e.isSymbolicLink()) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!TEXT_EXT.has(path.extname(e.name).toLowerCase())) continue;
      let t; try { t = fs.readFileSync(p, 'utf8'); } catch (_) { continue; }
      for (const tok of t.split(/[^A-Za-z0-9]+/)) if (tok.length >= 6 && tok.length <= 40) set.add(tok);
    }
  };
  walk(exo);
  return set;
}

/** The heavy-run locks held now: { trees: [lower-cased], untreed: bool } (a lock written before D286 records no tree). */
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

const git = (cwd, args) => { const r = spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8', timeout: 20000, windowsHide: true }); return { ok: r.status === 0, out: String(r.stdout || '').trim() }; };
/** What a worktree is: its repo's main checkout, whether HEAD is in main, and when git last touched it. */
function worktreeFacts(wt) {
  const top = git(wt, ['rev-parse', '--show-toplevel']);
  if (!top.ok || norm(top.out) !== norm(wt)) return { git: false };
  const list = git(wt, ['worktree', 'list', '--porcelain']);
  const mainCheckout = (list.out.match(/^worktree (.+)$/m) || [])[1] || null;
  const branch = git(wt, ['rev-parse', '--verify', '--quiet', 'refs/heads/main']).ok ? 'main' : (git(wt, ['rev-parse', '--verify', '--quiet', 'refs/heads/master']).ok ? 'master' : null);
  const merged = branch ? spawnSync('git', ['-C', wt, 'merge-base', '--is-ancestor', 'HEAD', branch], { timeout: 20000, windowsHide: true }).status === 0 : false;
  const gd = git(wt, ['rev-parse', '--absolute-git-dir']);
  let touched = 0;
  for (const f of ['HEAD', 'index', path.join('logs', 'HEAD')]) { try { touched = Math.max(touched, fs.statSync(path.join(gd.out, f)).mtimeMs); } catch (_) {} }
  return { git: true, mainCheckout, branch, merged, touched };
}

/** (e) What a worktree's removal needs: worktreeFacts, plus HEAD, whether it is clean (untracked files count) and how many of its patches are
 *  NOT in main (`git cherry main HEAD`: a '+' line; null when git cannot say, which keeps it). Unreadable to git: { git: false }. */
function removalFacts(wt) {
  const f = worktreeFacts(wt);
  if (!f.git) return f;
  const head = git(wt, ['rev-parse', 'HEAD']).out;
  const st = git(wt, ['--no-optional-locks', 'status', '--porcelain', '--untracked-files=all']);   // --no-optional-locks: a plain status REWRITES the index, which made every worktree young to the next run
  const ch = f.branch ? git(wt, ['cherry', f.branch, 'HEAD']) : { ok: false, out: '' };
  const unlanded = ch.ok ? ch.out.split('\n').filter((l) => l.startsWith('+')).length : null;
  return { ...f, head, clean: st.ok && st.out === '', unlanded };
}
/** (e) The worktrees git knows of in a repository: [{ path, head, branch }], the main checkout first, as git lists it. */
function listWorktrees(repo) {
  const r = git(repo, ['worktree', 'list', '--porcelain']);
  if (!r.ok) return [];
  return r.out.split(/\n\s*\n/).map((b) => {
    const w = ((b.match(/^worktree (.+)$/m) || [])[1] || '').trim();   // git prints C:/…; resolved to the native form the rest of the janitor compares
    return { path: w ? path.resolve(w) : '', head: (b.match(/^HEAD (\w+)$/m) || [])[1] || null, branch: (b.match(/^branch refs\/heads\/(.+)$/m) || [])[1] || null };
  }).filter((x) => x.path);
}
const slashes = (t) => String(t).toLowerCase().replace(/\\+/g, '/');
/** (e) The tails of the room's Claude transcripts written in the last 24 h, as one lower-cased text with every backslash run as '/'. */
function recentPaneText(projectsDir, now) {
  let text = '';
  for (const proj of safeDirs(projectsDir).filter((d) => ROOM_PROJECT.test(path.basename(d)))) {
    let es; try { es = fs.readdirSync(proj, { withFileTypes: true }); } catch (_) { continue; }
    for (const e of es) {
      if (!e.isFile() || !e.name.endsWith('.jsonl')) continue;
      const f = path.join(proj, e.name);
      try {
        const st = fs.statSync(f); if (now - st.mtimeMs > REMOVE_MIN_IDLE) continue;
        const n = Math.min(st.size, PANE_TAIL), buf = Buffer.alloc(n), fd = fs.openSync(f, 'r');
        try { fs.readSync(fd, buf, 0, n, st.size - n); } finally { fs.closeSync(fd); }
        text += buf.toString('utf8') + '\n';
      } catch (_) { /* a transcript mid-rotation: the idle rule still guards */ }
    }
  }
  return slashes(text);
}
/** (e) Does a pane work in `wt`: its own folder is wt or inside it, or the recent transcript text names wt (as c:/…, or Git Bash's /c/…). */
function paneIn(wt, paneDirs, text) {
  if ((paneDirs || []).some((d) => norm(d) === norm(wt) || within(d, wt))) return true;
  if (!text) return false;
  const w = slashes(path.resolve(wt)), bash = w.replace(/^([a-z]):/, '/$1');
  return text.includes(w) || text.includes(bash);
}

/** The real roots. Every one can be replaced (the tests run on fake trees, never the real disk). */
function defaults() {
  let scratch = null; try { scratch = require('./scratch.js').scratchRoot(); } catch (_) {}
  let dataDir = null; try { dataDir = require('./state-manifest.js').dataDir(); } catch (_) {}
  const tmp = os.tmpdir();
  // the LIVE room's exo_memory (room_path names its BOOT.md) as well as this checkout's: run from a worktree, this checkout's is an older
  // snapshot, and a citation added since would be missed (and the cited log moved)
  const exo = [path.join(REPO, 'exo_memory')];
  const cfg = config();
  if (cfg.room_path) exo.push(path.dirname(String(cfg.room_path)));
  return {
    tempDirs: [tmp, scratch].filter((d, i, a) => d && a.findIndex((x) => x && norm(x) === norm(d)) === i),
    claudeTemp: path.join(tmp, 'claude'),
    // D287-e2: the two roots that are THIS machine's, read from its config, never written into the code (portable-paths): an env override, then
    // ~/.consonance.json. Neither set: that class is not run, and the report says so and names the key (it degrades loudly, never to a guess).
    worktreesDir: setting('CONSONANCE_WORKTREES', 'worktrees_dir', cfg),
    repo: REPO, exo: exo.filter((d, i, a) => a.findIndex((x) => norm(x) === norm(d)) === i), dataDir,
    archiveRoot: setting('CONSONANCE_ARCHIVE', 'archive_dir', cfg),
    mainCheckouts: [REPO],
    // (e): the repositories whose worktrees are listed for strays; the panes' own folders (instances_dir); the room transcripts read for a path
    worktreeRepos: [REPO],
    paneDirs: safeDirs(setting('CONSONANCE_INSTANCES', 'instances_dir', cfg)),
    claudeProjects: path.join(os.homedir(), '.claude', 'projects'),
  };
}
/** ~/.consonance.json, parsed loosely (a BOM is tolerated); {} when absent or unreadable. */
function config() {
  try { return JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '')) || {}; } catch (_) { return {}; }
}
/** An env override, else a ~/.consonance.json key, else null (the transcript-watch.js dataDir() shape). */
function setting(env, key, cfg = config()) {
  const e = process.env[env] && String(process.env[env]).trim();
  if (e) return e;
  const v = cfg && cfg[key] != null ? String(cfg[key]).trim() : '';
  return v || null;
}

/** Throws unless `p` may be acted on by class `cls` under `root`. The last line of defence: every act calls it again. */
function assertSafe(p, root) {
  const a = path.resolve(p);
  if (!path.isAbsolute(a) || norm(a) === norm(path.parse(a).root)) throw new Error(`janitor: refusing ${a}: a drive root`);
  if (driveOf(a) === 'D:\\') throw new Error(`janitor: refusing ${a}: D: is the USB stick`);
  if (FORBIDDEN.some((re) => re.test(a))) throw new Error(`janitor: refusing ${a}: the keeper's own folders are never a class`);
  if (!within(a, root)) throw new Error(`janitor: refusing ${a}: not under its class root ${root}`);
}

/** The plan: every candidate of every class, what would happen to it, and what is kept and why. Changes nothing. */
function plan(opts = {}) {
  const o = { ...defaults(), ...opts }, now = o.now !== undefined ? o.now : Date.now();
  const out = { at: new Date(now).toISOString(), classes: { a: [], b: [], c: [], d: [], e: [] }, kept: { a: {}, b: {}, c: {}, d: {}, e: {} }, strays: [], unmatched: {}, notes: [] };
  const keep = (cls, why, p) => { (out.kept[cls][why] = out.kept[cls][why] || []).push(p); };

  if (!o.archiveRoot) out.notes.push('(b) moves nothing: no archive is configured. Set archive_dir in ~/.consonance.json (or CONSONANCE_ARCHIVE) to the folder logs are moved to.');
  if (!o.worktreesDir) out.notes.push('(d) is not run, nor (e): no worktrees folder is configured. Set worktrees_dir in ~/.consonance.json (or CONSONANCE_WORKTREES).');

  // (a) TEMP
  const prefixes = o.prefixes || sourcePrefixes(o.repo);
  for (const root of o.tempDirs) {
    let es; try { es = fs.readdirSync(root, { withFileTypes: true }); } catch (_) { continue; }
    for (const e of es) {
      const p = path.join(root, e.name);
      if (e.isSymbolicLink()) { if (roomTempName(e.name, prefixes)) keep('a', 'a link', p); continue; }
      if (!e.isDirectory()) continue;
      if (!roomTempName(e.name, prefixes)) { const k = (e.name.match(/^(.*?[-_])[A-Za-z0-9]{6,}$/) || [, e.name])[1]; out.unmatched[k] = (out.unmatched[k] || 0) + 1; continue; }
      let top; try { top = fs.statSync(p).mtimeMs; } catch (_) { continue; }
      if (now - top < TEMP_MIN_AGE) { keep('a', 'young', p); continue; }
      const s = survey(p);
      if (s.links) { keep('a', 'a link inside', p); continue; }
      if (now - s.newest < TEMP_MIN_AGE) { keep('a', 'young', p); continue; }
      out.classes.a.push({ path: p, root, bytes: s.bytes, newest: s.newest, act: 'delete' });
    }
  }

  // (b) LOGS
  const day = out.at.slice(0, 10);
  let cited = null;
  for (const proj of safeDirs(o.claudeTemp).filter((d) => ROOM_PROJECT.test(path.basename(d)))) for (const sess of safeDirs(proj)) {
    const tasks = path.join(sess, 'tasks');
    let es; try { es = fs.readdirSync(tasks, { withFileTypes: true }); } catch (_) { continue; }
    for (const e of es) {
      if (!e.isFile()) continue;
      const p = path.join(tasks, e.name);
      let st; try { st = fs.statSync(p); } catch (_) { continue; }
      if (now - st.mtimeMs < LOG_MIN_AGE) { keep('b', 'young', p); continue; }
      if (cited === null) cited = citedTokens(o.exo);
      const id = e.name.replace(/\.[^.]*$/, '');
      if (cited.has(id)) { keep('b', 'cited in exo_memory', p); continue; }
      if (!o.archiveRoot) { keep('b', 'no archive configured', p); continue; }
      if (!archiveReady(o.archiveRoot)) { keep('b', 'no archive drive', p); continue; }
      out.classes.b.push({ path: p, root: o.claudeTemp, bytes: st.size, newest: st.mtimeMs, act: 'move', to: path.join(o.archiveRoot, day, path.relative(o.claudeTemp, p)) });
    }
  }

  // (c) SCRATCH
  for (const proj of safeDirs(o.claudeTemp).filter((d) => ROOM_PROJECT.test(path.basename(d)))) for (const sess of safeDirs(proj)) {
    const pad = path.join(sess, 'scratchpad');
    for (const t of findTargets(pad)) {
      const s = survey(t);
      if (s.links) { keep('c', 'a link inside', t); continue; }
      if (now - s.newest < SCRATCH_MIN_IDLE) { keep('c', 'young', t); continue; }
      out.classes.c.push({ path: t, root: pad, bytes: s.bytes, newest: s.newest, act: 'delete' });
    }
  }

  // (d) WORKTREE
  const locks = heldLocks(o.dataDir);
  for (const wt of safeDirs(o.worktreesDir)) {
    const targets = findTargets(wt, 4);
    if (!targets.length) continue;
    const f = (o.worktreeFacts || worktreeFacts)(wt);
    const why = !f.git ? 'not a git worktree'
      : (o.mainCheckouts.concat(f.mainCheckout ? [f.mainCheckout] : []).some((m) => norm(m) === norm(wt))) ? 'a main checkout'
      : locks.untreed ? 'a heavy-run lock records no tree'
      : locks.trees.some((t) => t === norm(wt) || t.startsWith(norm(wt) + path.sep.toLowerCase())) ? 'a heavy-run lock is held in it'
      : !f.merged ? 'HEAD is not in main'
      : null;
    if (why) { for (const t of targets) keep('d', why, t); continue; }
    for (const t of targets) {
      const s = survey(t);
      if (s.links) { keep('d', 'a link inside', t); continue; }
      const idle = now - Math.max(s.newest, f.touched || 0);
      if (idle < WORKTREE_MIN_IDLE) { keep('d', 'young', t); continue; }
      out.classes.d.push({ path: t, root: wt, bytes: s.bytes, newest: Math.max(s.newest, f.touched || 0), act: 'delete' });
    }
  }

  // (e) WORKTREE REMOVED: the worktree itself; then every worktree of the room's repositories outside the folder, listed as a stray
  let paneText = null;
  const panes = () => { if (paneText === null) paneText = o.paneText ? slashes(o.paneText()) : (o.claudeProjects ? recentPaneText(o.claudeProjects, now) : ''); return paneText; };
  for (const wt of safeDirs(o.worktreesDir)) {
    const f = (o.removalFacts || removalFacts)(wt);
    const s = f.git ? survey(wt) : null;
    const isMain = f.git && o.mainCheckouts.concat(f.mainCheckout ? [f.mainCheckout] : []).some((m) => norm(m) === norm(wt));
    const held = locks.untreed ? 'a heavy-run lock records no tree' : locks.trees.some((t) => t === norm(wt) || t.startsWith(norm(wt) + path.sep.toLowerCase())) ? 'a heavy-run lock is held in it' : null;
    const why = !f.git ? 'not a git worktree'
      : isMain ? 'a main checkout'
      : held ? held
      : s.links ? 'a link inside'
      : !f.clean ? 'not clean'
      : f.unlanded !== 0 ? 'patches not in main'
      : now - Math.max(s.newest, f.touched || 0) < REMOVE_MIN_IDLE ? 'young'
      : paneIn(wt, o.paneDirs, panes()) ? 'a live pane is working in it'
      : null;
    if (why) { keep('e', why, wt); continue; }
    out.classes.e.push({ path: wt, root: o.worktreesDir, bytes: s.bytes, newest: Math.max(s.newest, f.touched || 0), act: 'remove', main: f.mainCheckout, head: f.head });
  }
  for (const repo of o.worktreeRepos || []) for (const w of listWorktrees(repo).slice(1)) {
    if (o.worktreesDir && within(w.path, o.worktreesDir)) continue;
    out.strays.push(w);
  }

  out.total = Object.values(out.classes).flat().reduce((a, x) => a + x.bytes, 0);
  return out;
}
function safeDirs(dir) {
  let es; try { es = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return []; }
  return es.filter((e) => e.isDirectory() && !e.isSymbolicLink()).map((e) => path.join(dir, e.name));
}
function archiveReady(root) { try { return fs.existsSync(path.parse(path.resolve(root)).root) && driveOf(root) !== 'D:\\'; } catch (_) { return false; } }

/** Do what the plan says. Each act re-checks its target first (still under its root, still old, still no link); a failure is recorded, never fatal. */
function apply(p, opts = {}) {
  const o = { ...defaults(), ...opts }, now = o.now !== undefined ? o.now : Date.now();
  const res = { done: { a: { n: 0, bytes: 0 }, b: { n: 0, bytes: 0 }, c: { n: 0, bytes: 0 }, d: { n: 0, bytes: 0 }, e: { n: 0, bytes: 0 } }, skipped: [], errors: [] };
  const minAge = { a: TEMP_MIN_AGE, b: LOG_MIN_AGE, c: SCRATCH_MIN_IDLE, d: WORKTREE_MIN_IDLE, e: REMOVE_MIN_IDLE };
  for (const cls of ['a', 'b', 'c', 'd', 'e']) for (const x of p.classes[cls] || []) {
    try {
      assertSafe(x.path, x.root);
      if (cls === 'b') {
        const st = fs.statSync(x.path);
        if (now - st.mtimeMs < minAge.b) { res.skipped.push({ path: x.path, why: 'changed since the plan' }); continue; }
        assertSafe(x.to, o.archiveRoot);
        fs.mkdirSync(path.dirname(x.to), { recursive: true });
        fs.copyFileSync(x.path, x.to, fs.constants.COPYFILE_EXCL);
        if (fs.statSync(x.to).size !== st.size) throw new Error('the archived copy is not the same size; the original is kept');
        fs.unlinkSync(x.path);
      } else if (cls === 'e') {
        // the act re-reads what the plan decided on; git itself refuses a worktree that is not clean, and nothing here can force it
        const f = (o.removalFacts || removalFacts)(x.path), s = survey(x.path), locks = heldLocks(o.dataDir);
        const changed = !f.git || !f.clean || f.unlanded !== 0 || s.links || now - Math.max(s.newest, f.touched || 0) < minAge.e
          || locks.untreed || locks.trees.some((t) => t === norm(x.path) || t.startsWith(norm(x.path) + path.sep.toLowerCase()));
        if (changed) { res.skipped.push({ path: x.path, why: 'changed since the plan' }); continue; }
        const main = f.mainCheckout || x.main;
        const branch = git(main, ['for-each-ref', '--points-at', f.head, '--format=%(refname:short)', 'refs/heads']).out.split('\n')[0] || null;
        const r = spawnSync('git', ['-C', main, 'worktree', 'remove', x.path], { encoding: 'utf8', timeout: 60000, windowsHide: true });
        if (r.status !== 0) throw new Error('git worktree remove refused: ' + String(r.stderr || '').trim());
        if (o.dataDir) fs.appendFileSync(path.join(o.dataDir, 'janitor.jsonl'), JSON.stringify({ at: new Date(now).toISOString(), removed_worktree: x.path, head: f.head, branch, repo: main }) + '\n');
      } else {
        const s = survey(x.path);
        if (s.links || now - s.newest < minAge[cls]) { res.skipped.push({ path: x.path, why: s.links ? 'a link inside' : 'changed since the plan' }); continue; }
        fs.rmSync(x.path, { recursive: true, force: true });
      }
      res.done[cls].n++; res.done[cls].bytes += x.bytes;
    } catch (e) { res.errors.push({ path: x.path, error: e.message }); }
  }
  return res;
}

function report(p, log = console.log) {
  const name = { a: '(a) temp test folders (%TEMP%, scratch root), older than 2 days', b: '(b) task-output logs older than 7 days, MOVED to the archive', c: '(c) cargo targets in Claude scratchpads, idle over 2 days', d: '(d) cargo targets of merged worktrees idle over 24 h', e: '(e) worktrees REMOVED: clean, every patch in main, idle over 24 h' };
  log(`janitor ${p.at}`);
  for (const cls of ['a', 'b', 'c', 'd', 'e']) {
    const xs = p.classes[cls] || [], bytes = xs.reduce((a, x) => a + x.bytes, 0);
    log(`  ${name[cls]}: ${xs.length} → ${gb(bytes)} GB`);
    const kept = Object.entries(p.kept[cls]).map(([why, v]) => `${why} ${v.length}`).join(', ');
    if (kept) log(`      kept: ${kept}`);
    for (const x of cls === 'a' ? [] : xs) log(`      ${x.act === 'move' ? 'move' : x.act === 'remove' ? 'git worktree remove' : 'delete'} ${x.path}  (${gb(x.bytes)} GB)${x.to ? ' → ' + x.to : ''}`);
  }
  const strays = p.strays || [];
  log(`  worktrees OUTSIDE the worktrees folder (never removed; move or land them): ${strays.length}`);
  for (const w of strays) log(`      stray ${w.path}  ${w.branch ? '[' + w.branch + ']' : '(detached ' + String(w.head || '').slice(0, 8) + ')'}`);
  log(`  TOTAL: ${gb(p.total)} GB`);
  for (const n of p.notes || []) log(`  NOTE: ${n}`);
  const top = Object.entries(p.unmatched).sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (top.length) log(`  not the room's (left alone; the most common names): ${top.map(([k, v]) => `${k} ${v}`).join(', ')}`);
}

function main(argv = process.argv.slice(2)) {
  const doApply = argv.includes('--apply'), json = argv.includes('--json');
  const p = plan();
  if (!doApply) { if (json) console.log(JSON.stringify(p, null, 1)); else { report(p); console.log('  DRY RUN — nothing changed. --apply to act.'); } return; }
  const r = apply(p);
  const line = { at: p.at, apply: true, freed_gb: +gb(Object.values(r.done).reduce((a, x) => a + x.bytes, 0)), strays: (p.strays || []).length, classes: Object.fromEntries(Object.entries(r.done).map(([k, v]) => [k, { n: v.n, gb: +gb(v.bytes) }])), skipped: r.skipped.length, errors: r.errors.length };
  const dir = defaults().dataDir;
  if (dir) fs.appendFileSync(path.join(dir, 'janitor.jsonl'), JSON.stringify(line) + '\n');
  if (json) console.log(JSON.stringify({ plan: p, result: r }, null, 1)); else { report(p); console.log(`  APPLIED: freed ${line.freed_gb} GB · skipped ${r.skipped.length} · errors ${r.errors.length}`); for (const e of r.errors.slice(0, 20)) console.log(`    error ${e.path}: ${e.error}`); }
  if (r.errors.length) process.exitCode = 1;
}

if (require.main === module) main();
module.exports = { plan, apply, report, setting, removalFacts, listWorktrees, recentPaneText, paneIn, sourcePrefixes, roomTempName, survey, findTargets, citedTokens, heldLocks, worktreeFacts, assertSafe, isCargoTarget, TEMP_MIN_AGE, LOG_MIN_AGE, SCRATCH_MIN_IDLE, WORKTREE_MIN_IDLE, CARGO_TAG };
