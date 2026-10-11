#!/usr/bin/env node
'use strict';
// janitor.mutants.js - run with: node consonance/tools/janitor.mutants.js [--only <n>]     (D287 part 2; holds the heavy-run lock itself)
//
// A WRONG KEEP-RULE DELETES EVIDENCE. janitor.js removes folders on a schedule, unattended; every line that decides to KEEP something (young,
// cited, locked, unmerged, a main checkout, a link inside, not cargo's, the act's re-check, the refusals of D:, drive roots and the keeper's
// folders) is broken here one at a time, and janitor.test.js must go RED for each. heavy-run.mutants.js is the pattern.
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
