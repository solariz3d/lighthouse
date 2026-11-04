#!/usr/bin/env node
'use strict';
// janitor.mutants.js - run with: node consonance/tools/janitor.mutants.js [--only <n>]     (D287 part 2; holds the heavy-run lock itself)
//
// A WRONG KEEP-RULE DELETES EVIDENCE. janitor.js removes folders on a schedule, unattended; every line that decides to KEEP something (young,
// cited, locked, unmerged, a main checkout, a link inside, not cargo's, the act's re-check, the refusals of D:, drive roots and the keeper's
// folders, and since D319 every rule that keeps a WORKTREE from removal: unclean, unlanded, locked, linked, young, a live pane's, never --force) is broken here one at a time, and janitor.test.js must go RED for each. heavy-run.mutants.js is the pattern.
//
// THE TRACKED SOURCES ARE NEVER WRITTEN. A temp tree mirrors what the suite reads (janitor.js, its test, scratch.js, state-manifest.js, and the
// sources its prefix row reads: gen-consumer.js, main.rs and mcp.rs); the copy is mutated, the copy's suite runs, the tree is removed. Every anchor
// must occur EXACTLY ONCE or the row is NOT APPLIED (counted as such, never as a catch).
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = __dirname, REPO = path.resolve(HERE, '..', '..');
const SRC = 'janitor.js', SUITE = 'janitor.test.js';
const COPY = [['consonance/tools', [SRC, SUITE, 'scratch.js', 'state-manifest.js', 'gen-consumer.js']], ['consonance/src-tauri/src', ['main.rs', 'mcp.rs']]];

const MUTANTS = [
  // ---- (a) temp ----
  ['(a) TEMP_MIN_AGE is zero: a young folder is deleted', SRC, 'const TEMP_MIN_AGE = 2 * DAY,', 'const TEMP_MIN_AGE = 0,'],
  ['(a) only the folder\'s own mtime counts, not the newest thing inside', SRC, "      if (now - s.newest < TEMP_MIN_AGE) { keep('a', 'young', p); continue; }\n", ''],
  ['(a) a link inside does not keep the folder', SRC, "      if (s.links) { keep('a', 'a link inside', p); continue; }\n      if (now - s.newest < TEMP_MIN_AGE)", '      if (now - s.newest < TEMP_MIN_AGE)'],
  ['(a) any name with a room prefix matches (no mkdtemp suffix shape)', SRC, ' && MKDTEMP_SUFFIX.test(name.slice(p.length))', ''],
  ['(a) the Claude Code temp root is not excluded', SRC, "  if (name === 'claude') return false;", ''],
  // ---- (b) logs ----
  ['(b) LOG_MIN_AGE is zero: a young log is moved', SRC, 'LOG_MIN_AGE = 7 * DAY,', 'LOG_MIN_AGE = 0,'],
  ['(b) a cited log is not kept', SRC, "      if (cited.has(id)) { keep('b', 'cited in exo_memory', p); continue; }\n", ''],
  ['(b) the archive is not written: a log is DELETED, not moved', SRC, '        fs.copyFileSync(x.path, x.to, fs.constants.COPYFILE_EXCL);\n', ''],
  // ---- (c) scratchpad targets ----
  ['(c) SCRATCH_MIN_IDLE is zero: a target in use is deleted', SRC, 'SCRATCH_MIN_IDLE = 2 * DAY,', 'SCRATCH_MIN_IDLE = 0,'],
  ['(c) any target-named folder is a cargo target (cargo\'s tag not read)', SRC, "return fs.readFileSync(path.join(dir, 'CACHEDIR.TAG'), 'utf8').startsWith(CARGO_TAG);", 'return true;'],
  ['(b)(c) every Claude project, not only the room\'s', SRC, "const ROOM_PROJECT = /consonance|claude-instances/i;", 'const ROOM_PROJECT = /./;'],
  // ---- (d) worktree targets ----
  ['(d) WORKTREE_MIN_IDLE is zero', SRC, 'WORKTREE_MIN_IDLE = 1 * DAY;', 'WORKTREE_MIN_IDLE = 0;'],
  ['(d) an unmerged worktree is not kept', SRC, "      : !f.merged ? 'HEAD is not in main'\n", ''],
  ['(d) a held lock does not keep its worktree', SRC, "      : locks.trees.some((t) => t === norm(wt) || t.startsWith(norm(wt) + path.sep.toLowerCase())) ? 'a heavy-run lock is held in it'\n", ''],
  ['(d) a lock with no tree does not keep anything', SRC, "      : locks.untreed ? 'a heavy-run lock records no tree'\n", ''],
  ['(d) a main checkout is not kept', SRC, "      : (o.mainCheckouts.concat(f.mainCheckout ? [f.mainCheckout] : []).some((m) => norm(m) === norm(wt))) ? 'a main checkout'\n", ''],
  ['(d) idle ignores git: only the target\'s own age counts', SRC, 'const idle = now - Math.max(s.newest, f.touched || 0);', 'const idle = now - s.newest;'],
  ['(d) an unreadable lock is not counted as untreed', SRC, "catch (_) { untreed = true; continue; }", 'catch (_) { continue; }'],
  // ---- (e) worktrees removed (D319) ----
  ['(e) REMOVE_MIN_IDLE is zero: a worktree worked in an hour ago is removed', SRC, 'REMOVE_MIN_IDLE = 1 * DAY;', 'REMOVE_MIN_IDLE = 0;'],
  ['(e) a worktree that is not clean is not kept', SRC, "      : !f.clean ? 'not clean'\n", ''],
  ['(e) untracked files do not count as unclean', SRC, "'--untracked-files=all'", "'--untracked-files=no'"],
  ['(e) a worktree with patches not in main is not kept', SRC, "      : f.unlanded !== 0 ? 'patches not in main'\n", ''],
  ['(e) landed means an ancestor of main only (git cherry not read)', SRC, "      : f.unlanded !== 0 ? 'patches not in main'", "      : !f.merged ? 'patches not in main'"],
  ['(e) a link inside does not keep the worktree', SRC, "      : s.links ? 'a link inside'\n", ''],
  ['(e) a held or untreed heavy-run lock does not keep it', SRC, "      : held ? held\n", ''],
  ['(e) a main checkout is not kept', SRC, "      : isMain ? 'a main checkout'\n", ''],
  ['(e) a live pane does not keep it', SRC, "      : paneIn(wt, o.paneDirs, panes()) ? 'a live pane is working in it'\n", ''],
  ['(e) the transcripts are not read for the worktree\'s path', SRC, "  if (!text) return false;\n  const w", "  return false;\n  const w"],
  ['(e) status rewrites the index (no --no-optional-locks): the plan makes every worktree young', SRC, "['--no-optional-locks', 'status',", "['status',"],
  ['(e) act: no re-check before the removal', SRC, "        if (changed) { res.skipped.push({ path: x.path, why: 'changed since the plan' }); continue; }", ''],
  ['(e) act: the removal is FORCED', SRC, "'worktree', 'remove', x.path]", "'worktree', 'remove', '--force', x.path]"],
  ['(e) act: a removal is not logged', SRC, "        if (o.dataDir) fs.appendFileSync(path.join(o.dataDir, 'janitor.jsonl'), JSON.stringify({ at: new Date(now).toISOString(), removed_worktree:", "        if (false) fs.appendFileSync(path.join(o.dataDir, 'janitor.jsonl'), JSON.stringify({ at: new Date(now).toISOString(), removed_worktree:"],
  ['(e) strays are not listed', SRC, '    out.strays.push(w);', ''],
  ['(e) a worktree inside an owned folder is listed as a stray too', SRC, '    if (owned.some((d) => within(w.path, d))) continue;\n', ''],
  ['(e) a drive root in the list is owned (not refused)', SRC, '    if (norm(r) === norm(path.parse(r).root)) { notes.push(', '    if (false) { notes.push('],
  ['(e) only the first listed folder is walked', SRC, '  for (const folder of owned) for', '  for (const folder of owned.slice(0, 1)) for'],
  ['(e) strays are judged against the first folder only', SRC, '    if (owned.some((d) => within(w.path, d))) continue;', "    if (within(w.path, owned[0] || '')) continue;"],
  ['(e) a malformed worktrees_dirs is guessed at, not refused', SRC, ' ? cfg[key].map((x) => String(x).trim()).filter(Boolean) : [];', ' ? cfg[key].map((x) => String(x).trim()).filter(Boolean) : [String(cfg[key])];'],
  // ---- the act ----
  ['act: no re-check (a folder that turned young is deleted)', SRC, "if (s.links || now - s.newest < minAge[cls]) { res.skipped.push", "if (false) { res.skipped.push"],
  ['act: assertSafe is not called', SRC, '      assertSafe(x.path, x.root);\n      if (cls === \'b\') {', "      if (cls === 'b') {"],
  // ---- the refusals ----
  ['refusal: D: is allowed', SRC, "if (driveOf(a) === 'D:\\\\') throw new Error(`janitor: refusing ${a}: D: is the USB stick`);", ''],
  ['refusal: a drive root is allowed', SRC, "if (!path.isAbsolute(a) || norm(a) === norm(path.parse(a).root)) throw", 'if (!path.isAbsolute(a)) throw'],
  ['refusal: the keeper\'s folders are allowed', SRC, "if (FORBIDDEN.some((re) => re.test(a))) throw new Error(`janitor: refusing ${a}: the keeper's own folders are never a class`);", ''],
  ['refusal: outside the class root is allowed', SRC, "if (!within(a, root)) throw new Error(`janitor: refusing ${a}: not under its class root ${root}`);", ''],
  // ---- the dry run ----
  ['dry run: plan() deletes what it finds', SRC, "      out.classes.a.push({ path: p, root, bytes: s.bytes, newest: s.newest, act: 'delete' });", "      out.classes.a.push({ path: p, root, bytes: s.bytes, newest: s.newest, act: 'delete' }); fs.rmSync(p, { recursive: true, force: true });"],
];

function tree() {
  const dir = require('./scratch.js').mkdtemp('jan-mut-');
  for (const [rel, files] of COPY) { fs.mkdirSync(path.join(dir, rel), { recursive: true }); for (const f of files) fs.copyFileSync(path.join(REPO, rel, f), path.join(dir, rel, f)); }
  return dir;
}
function run(dir) {
  const env = { ...process.env }; for (const k of Object.keys(env)) if (/^CONSONANCE_/.test(k) && k !== 'CONSONANCE_HEAVY_RUN_TOKEN') delete env[k];
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', path.join(dir, 'consonance', 'tools', SUITE)], { encoding: 'utf8', env, timeout: 180 * 1000 });
  const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
  return { pass: n('pass'), fail: n('fail'), hung: r.status === null || !Number.isFinite(n('pass')) };
}

function main() {
  require('./heavy-run.js').hold({ cmd: 'janitor.mutants' });   // ONE HEAVY RUNNER PER TREE
  const onlyAt = process.argv.indexOf('--only'), only = onlyAt > 0 ? Number(process.argv[onlyAt + 1]) : null;
  const read = (f) => fs.readFileSync(path.join(HERE, f), 'utf8').replace(/\r\n/g, '\n');
  const control = (() => { const d = tree(); try { return run(d); } finally { fs.rmSync(d, { recursive: true, force: true }); } })();
  console.log(`control (unmutated copy)                                        pass ${control.pass} fail ${control.fail}`);
  if (!(control.fail === 0 && control.pass > 0)) { console.log('CONTROL NOT GREEN - no mutant result means anything'); process.exitCode = 1; return; }
  let applied = 0, caught = 0, notApplied = 0;
  MUTANTS.forEach(([name, file, anchor, repl], i) => {
    if (only != null && only !== i + 1) return;
    const src = read(file), hits = src.split(anchor).length - 1, label = `${String(i + 1).padStart(2)} ${name}`.padEnd(100);
    if (hits !== 1) { notApplied++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
    applied++;
    const d = tree();
    try {
      fs.writeFileSync(path.join(d, 'consonance', 'tools', file), src.replace(anchor, () => repl));
      const r = run(d), ok = r.fail > 0 || r.hung; if (ok) caught++;
      console.log(`${label} pass ${r.pass} fail ${r.fail}  ${ok ? (r.hung ? 'CAUGHT (the suite hung or crashed)' : 'CAUGHT') : 'SURVIVED'}`);
    } finally { fs.rmSync(d, { recursive: true, force: true }); }
  });
  console.log(`\n${applied} applied · ${caught} caught · ${applied - caught} survived · ${notApplied} NOT APPLIED`);
  if (applied - caught > 0 || notApplied > 0) process.exitCode = 1;
}

main();
