#!/usr/bin/env node
'use strict';
// landing-train.js (B, L194, exo_memory/loop/plan_l194_landing_train_2026-11-13.md): landings stop being serial, by hand, and blocked by his play.
//
// Panes mark a branch READY; the train merges every READY branch onto main in ITS OWN worktree, builds and checks the batch there, and when it is
// green it fast-forwards main, scans what the push would publish, pushes, and promotes the build to the main checkout when no game is running.
//
//   node landing-train.js ready  --config FILE <branch> --pane P --lap L    mark a branch READY (its sha is the branch tip now)
//   node landing-train.js list   --config FILE                              the READY list
//   node landing-train.js run    --config FILE                              one train: as many passes as it takes to empty the READY list
//   node landing-train.js promote --config FILE [--wait]                    promote the last landed build (with --wait, until no game runs)
//
// The config is JSON (a machine's paths, so it lives in the data dir, never in this public repo):
//   repo       the main checkout (its branch `base` is what lands; its working tree is what his shortcut builds from)
//   worktree   the train's own worktree of that repo (`git worktree add <dir> --detach`); the train builds only here
//   base       'main'; remote 'origin'
//   check      [program, ...args]: run in the worktree, exit 0 = green (dreamzone-3: build.bat test, then both self-tests)
//   gate       [program, ...args] or null: the memory gate, exit 0 = enough memory (memwatch --gate); retried for gate_wait_s
//   guard      [program, ...args] or null: exit 0 = a GAME IS RUNNING (dzrunning.cmd's sense); promotion waits while it does
//   promote    null, or { files: [rel, ...] or dirs, stamp: rel, stamp_text, launch_check: [program, ...args] or null,
//              staging: dir (default <worktree>.promote) }
//
// `run` and `promote` lower themselves to BelowNormal (children inherit it), so his game keeps the machine. `run` prints, last, one line
// beginning `BOARD:` that names what landed and what went back; the train has no path to the board (board_push is the app's funnel and the
// MCP speaks only for a seat), so the seat that ran the train posts that line.
//
// WHAT CAN GO WRONG, and what the train does:
//   - a merge conflict: that branch is dropped, its conflicting files named, the merge aborted (nothing half-merged stays);
//   - a red batch: the newest branch is set aside and the rest tried again, down to one; the largest green batch lands; the branches set aside
//     stay READY for the next pass, and a branch is named red (and leaves the list) only when it is red ALONE on main. Each pass lands at least
//     one branch or names one, so the train ends;
//   - the scan finds a credential shape, or cannot run: NOTHING is pushed and main is not moved (fail CLOSED: the push-gate hook fails open so a
//     hook bug never traps a seat, but a push from a script is not seen by the hook at all, so here the scan is the only gate). The decision is
//     written to <data>/push-gate.jsonl in the hook's own shape;
//   - main moved under the train, or the main checkout has local changes: nothing lands; the next run starts from the new main;
//   - a game is running at promotion: the build waits, and `promote --wait` copies it when the guard clears. What is copied is the build the
//     landing CHECKED, staged at the landing (the worktree is then free for the next batch, and a later red pass never reaches his checkout);
//     and only while main is still the commit it was built at (a stale exe under a fresh stamp would make the launcher read "up to date");
//   - the train is killed (the low-memory reaper, a TaskStop): a hard kill on Windows runs no exit handler, so safety is by construction. main and
//     the READY list are written only in the landing step, after everything else has passed; every run starts by cleaning its own worktree (an
//     aborted merge, a reset to main); and a marker written just before the fast-forward lets the next run finish or report a landing cut in two.
//
// Each attempt takes the exclusive heavy-run hold for its own build and check and releases it after (a hold over 90 minutes is ignored by the
// lock, and a train of several passes could outlive one).
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const READY_NAME = 'landing-ready.jsonl';
const LOG_NAME = 'landing-train.jsonl';
const MARK_NAME = 'landing-train.marker.json';
const GATE_LEDGER = 'push-gate.jsonl';

function dataDir(env = process.env) {
  const e = String(env.CONSONANCE_DATA || '').trim();
  if (e) return e;
  try {
    const cfg = env.CONSONANCE_CONFIG || path.join(os.homedir(), '.consonance.json');
    const d = String((JSON.parse(fs.readFileSync(cfg, 'utf8').replace(/^﻿/, '')) || {}).data_dir || '').trim();
    if (d) return d;
  } catch (_) { /* no config */ }
  return path.join(os.homedir(), '.consonance');
}

function git(dir, args, opts = {}) {
  const r = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8', maxBuffer: 1 << 28, windowsHide: true, ...opts });
  return { code: r.status === null ? 1 : r.status, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}
const sha = (dir, ref) => { const r = git(dir, ['rev-parse', '--verify', '-q', `${ref}^{commit}`]); return r.code === 0 ? r.out : null; };
const isAncestor = (dir, a, b) => git(dir, ['merge-base', '--is-ancestor', a, b]).code === 0;

// ── the READY list: one JSON row a branch, in the order they became ready; rewritten whole, through a temporary file, only when it changes ──
function readReady(data) {
  let text = '';
  try { text = fs.readFileSync(path.join(data, READY_NAME), 'utf8'); } catch (_) { return []; }
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try { const r = JSON.parse(line); if (r && r.branch && r.sha) rows.push(r); } catch (_) { /* a torn line is skipped, never a crash */ }
  }
  return rows;
}
function writeReady(data, rows) {
  fs.mkdirSync(data, { recursive: true });
  const file = path.join(data, READY_NAME), tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, rows.map((r) => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : ''));
  fs.renameSync(tmp, file);
}
/** A branch marked again replaces its old row and goes to the back: it became ready again now. */
function addReady(rows, row) { return [...rows.filter((r) => r.branch !== row.branch), row]; }
const without = (rows, gone) => rows.filter((r) => !gone.some((g) => g.branch === r.branch && g.sha === r.sha));

function appendLog(data, row) {
  fs.mkdirSync(data, { recursive: true });
  fs.appendFileSync(path.join(data, LOG_NAME), JSON.stringify({ t: new Date().toISOString(), ...row }) + '\n');
}

// ── what a red check said: the lines that name a failing row, a failing suite or a compile error (at most 20) ──
function failingRows(text) {
  const out = [];
  for (const line of String(text || '').split(/\r?\n/)) {
    const l = line.trim();
    if (/^FAIL\b|\*\*\*Failed|CHECK(_[A-Z]+)? failed|tests failed|selftest: FAILED|SELFTEST RED|SUITES RED|BUILD FAILED|error C\d+|: error\b|is not recognized as an internal or external command/.test(l)) out.push(l.slice(0, 240));
    if (out.length >= 20) break;
  }
  return out;
}

// ── the push gate, called from here because the hook does not see a script's push (push-gate.js: "NOT CAUGHT ... a push run inside a script") ──
function scanForPush(repo, remote, pushSha, { gate = require('../hooks/push-gate.js') } = {}) {
  let d;
  try { d = gate.decide(`git push ${remote} ${pushSha}:refs/heads/main`, repo); } catch (e) { return { ok: false, decision: 'error', error: String(e && e.message || e).slice(0, 160) }; }
  // Fail CLOSED: only a clean 'allow' pushes. 'allow-error' (the hook's fail-open) and 'not-a-push' (a command the gate did not read) do not.
  return { ok: d.decision === 'allow', ...d };
}
function recordGate(data, row) {
  try { fs.mkdirSync(data, { recursive: true }); fs.appendFileSync(path.join(data, GATE_LEDGER), JSON.stringify({ t: new Date().toISOString(), seat: 'landing-train', ...row }) + '\n'); return true; } catch (_) { return false; }
}

// ── running a configured command ──
function run(cmd, cwd, { env = process.env, logFile } = {}) {
  if (!cmd || !cmd.length) return { code: 0, text: '' };
  const r = spawnSync(cmd[0], cmd.slice(1), { cwd, env, encoding: 'utf8', maxBuffer: 1 << 28, windowsHide: true });
  const text = `${r.stdout || ''}${r.stderr || ''}${r.error ? `\n(could not start ${cmd[0]}: ${r.error.message})` : ''}`;
  if (logFile) { try { fs.appendFileSync(logFile, text); } catch (_) { /* the log is a convenience */ } }
  return { code: r.error ? 1 : (r.status === null ? 1 : r.status), text };
}
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

// ── the train's own worktree: cleaned at the start of every attempt, so a killed train leaves nothing the next one inherits ──
function cleanWorktree(cfg, baseSha) {
  git(cfg.worktree, ['merge', '--abort']);
  const steps = [['reset', '--hard', '-q'], ['clean', '-fdq'], ['checkout', '-q', '--detach', baseSha], ['reset', '--hard', '-q', baseSha]];
  for (const s of steps) { const r = git(cfg.worktree, s); if (r.code !== 0) throw new Error(`the train's worktree could not be cleaned (git ${s.join(' ')}): ${r.err.slice(0, 200)}`); }
}

/** Merge rows onto the base in the worktree, in order. Returns { merged, conflicts: [{ row, files }] }. A conflict is aborted at once. */
function mergeBatch(cfg, baseSha, rows) {
  cleanWorktree(cfg, baseSha);
  const merged = [], conflicts = [];
  for (const row of rows) {
    const m = git(cfg.worktree, ['merge', '--no-ff', '--no-edit', '-m', `Merge ${row.branch} (${row.pane || '?'}, ${row.lap || '?'}) by the landing train`, row.sha]);
    if (m.code === 0) { merged.push(row); continue; }
    const files = git(cfg.worktree, ['diff', '--name-only', '--diff-filter=U']).out.split(/\r?\n/).filter(Boolean);
    git(cfg.worktree, ['merge', '--abort']);
    conflicts.push({ row, files: files.length ? files : ['(no conflicting file named; git said: ' + (m.err || m.out).slice(0, 160) + ')'] });
  }
  return { merged, conflicts };
}

/** One build-and-check of what the worktree holds, under the exclusive hold and the memory gate. */
function check(cfg, { hold, logFile, say }) {
  if (cfg.gate && cfg.gate.length) {
    const until = Date.now() + 1000 * (cfg.gate_wait_s || 1800);
    for (;;) {
      const g = run(cfg.gate, cfg.worktree);
      if (g.code === 0) break;
      if (Date.now() > until) return { green: false, gated: true, failing: ['MEMORY: the gate stayed short for ' + (cfg.gate_wait_s || 1800) + ' s: ' + g.text.trim().slice(-200)] };
      say(`memory gate short; waiting: ${g.text.trim().slice(-120)}`);
      sleep(30000);
    }
  }
  const h = hold ? hold() : null;
  try {
    const r = run(cfg.check, cfg.worktree, { logFile, env: h && h.env ? h.env : process.env });
    return { green: r.code === 0, failing: r.code === 0 ? [] : failingRows(r.text).concat(failingRows(r.text).length ? [] : [`(exit ${r.code}; no failing row named in the output)`]) };
  } finally { if (h && h.release) h.release(); }
}

/** One train. Returns { landed: [rows], named: [{ row, reason, failing|files }], pushed, promoted, stopped } */
function runTrain(cfg, opts = {}) {
  const data = opts.data || dataDir();
  const say = opts.say || ((s) => process.stderr.write(`landing-train: ${s}\n`));
  const hold = opts.hold === undefined ? defaultHold : opts.hold;
  const result = { landed: [], named: [], pushed: null, promoted: null, stopped: null, attempts: 0 };
  const base = cfg.base || 'main', remote = cfg.remote || 'origin';

  const marker = readMarker(data);
  if (marker) { result.stopped = `a landing was cut in two (marker for ${marker.sha.slice(0, 7)}, ${marker.t}); run 'reconcile' first`; return result; }

  let ready = readReady(data);
  // Rows already on main (a pane landed by hand) leave the list at once.
  const baseSha0 = sha(cfg.repo, base);
  const already = ready.filter((r) => isAncestor(cfg.repo, r.sha, baseSha0));
  if (already.length) { ready = without(ready, already); writeReady(data, ready); appendLog(data, { event: 'already-on-main', rows: already }); }

  let passes = 0;
  while (ready.length && passes < (cfg.max_passes || 8)) {
    passes++;
    const baseSha = sha(cfg.repo, base);
    let batch = ready.slice();
    let landedThisPass = false;
    for (;;) {
      const { merged, conflicts } = mergeBatch(cfg, baseSha, batch);
      for (const c of conflicts) { result.named.push({ row: c.row, reason: 'conflict', files: c.files }); say(`conflict: ${c.row.branch} (${c.files.join(', ')})`); }
      if (conflicts.length) { ready = without(ready, conflicts.map((c) => c.row)); writeReady(data, ready); appendLog(data, { event: 'conflict', rows: conflicts }); }
      if (!merged.length) break;
      result.attempts++;
      const logFile = opts.logDir ? path.join(opts.logDir, `attempt-${result.attempts}.log`) : null;
      say(`attempt ${result.attempts}: ${merged.map((r) => r.branch).join(', ')} on ${baseSha.slice(0, 7)}`);
      const c = check(cfg, { hold, logFile, say });
      if (c.gated) { result.stopped = c.failing[0]; return result; }
      if (c.green) {
        const landed = land(cfg, data, { baseSha, rows: merged, say, result });
        if (!landed) return result;
        ready = without(readReady(data), merged);   // the landing step already wrote it
        landedThisPass = true;
        break;
      }
      if (merged.length === 1) {
        result.named.push({ row: merged[0], reason: 'red alone on main', failing: c.failing });
        ready = without(ready, merged); writeReady(data, ready);
        appendLog(data, { event: 'red', row: merged[0], failing: c.failing });
        say(`red alone: ${merged[0].branch}`);
        break;
      }
      const newest = merged[merged.length - 1];
      say(`red with ${merged.length}; setting ${newest.branch} aside and trying the rest`);
      appendLog(data, { event: 'red-batch', rows: merged, set_aside: newest, failing: c.failing });
      batch = merged.slice(0, -1);
    }
    if (!landedThisPass && !ready.length) break;
  }
  try { cleanWorktree(cfg, sha(cfg.repo, base)); } catch (_) { /* reported by the next run */ }
  if (result.landed.length && cfg.promote) result.promoted = promote(cfg, data, { wait: !!opts.waitPromote, say });
  return result;
}

function readMarker(data) { try { return JSON.parse(fs.readFileSync(path.join(data, MARK_NAME), 'utf8')); } catch (_) { return null; } }

/** The landing: scan, fast-forward main, push, verify, then the READY list and the log. Nothing before this step changes main or the list. */
function land(cfg, data, { baseSha, rows, say, result }) {
  const base = cfg.base || 'main', remote = cfg.remote || 'origin';
  const trainSha = sha(cfg.worktree, 'HEAD');
  if (sha(cfg.repo, base) !== baseSha) { result.stopped = `main moved under the train (was ${baseSha.slice(0, 7)}); nothing landed`; return false; }
  const dirty = git(cfg.repo, ['status', '--porcelain', '--untracked-files=no']).out;
  if (dirty) { result.stopped = `the main checkout has local changes; nothing landed:\n${dirty.slice(0, 400)}`; return false; }
  const scan = scanForPush(cfg.repo, remote, trainSha, opts_gate(cfg));
  recordGate(data, { cwd: cfg.repo, decision: scan.decision, by: 'landing-train', sha: trainSha, ...(scan.error ? { error: scan.error } : {}), ...(scan.scanned ? { scanned: scan.scanned } : {}), ...(scan.found ? { found: scan.found.slice(0, 50).map((h) => ({ file: h.file, line: h.line, commit: h.commit, kind: h.kind })) } : {}) });
  if (!scan.ok) { result.stopped = `the scan refused the push (${scan.decision}${scan.found ? `: ${scan.found.length} credential-shaped line(s), e.g. ${scan.found[0].file}:${scan.found[0].line} in ${scan.found[0].commit}` : ''}${scan.error ? `: ${scan.error}` : ''}); nothing landed`; result.pushed = false; return false; }
  fs.writeFileSync(path.join(data, MARK_NAME), JSON.stringify({ t: new Date().toISOString(), sha: trainSha, base: baseSha, rows }));
  const ff = git(cfg.repo, ['merge', '--ff-only', '-q', trainSha]);
  if (ff.code !== 0) { fs.rmSync(path.join(data, MARK_NAME), { force: true }); result.stopped = `main would not fast-forward: ${ff.err.slice(0, 200)}`; return false; }
  const push = git(cfg.repo, ['push', '-q', remote, `${trainSha}:refs/heads/${base}`]);
  const remoteSha = (git(cfg.repo, ['ls-remote', remote, `refs/heads/${base}`]).out.split(/\s+/)[0] || '');
  result.pushed = push.code === 0 && remoteSha === trainSha;
  if (!result.pushed) { result.stopped = `pushed? no: git said ${(push.err || push.out).slice(0, 200)}; the remote reads ${remoteSha.slice(0, 7)}. main is at ${trainSha.slice(0, 7)} locally; the marker stays for 'reconcile'`; return false; }
  writeReady(data, without(readReady(data), rows));
  appendLog(data, { event: 'landed', sha: trainSha, base: baseSha, rows });
  fs.rmSync(path.join(data, MARK_NAME), { force: true });
  result.landed.push(...rows);
  result.sha = trainSha;
  if (cfg.promote) { try { result.staged = stage(cfg, trainSha); } catch (e) { result.staged = null; say(`NOT staged for promotion: ${e.message}`); appendLog(data, { event: 'not-staged', sha: trainSha, error: e.message }); } }
  say(`landed ${rows.map((r) => r.branch).join(', ')} as ${trainSha.slice(0, 7)}; ${remote}/${base} reads ${remoteSha.slice(0, 7)}`);
  return true;
}
const opts_gate = (cfg) => (cfg.push_gate ? { gate: require(cfg.push_gate) } : {});

// ── promotion's own copy of the CHECKED build, taken at the landing: the worktree is then free for the next batch (the plan: "the next batch can
//    already be building"), and a later red pass of the same train never reaches his checkout. Staged beside the worktree, never in it. ──
const stagingDir = (cfg) => (cfg.promote && cfg.promote.staging) || `${cfg.worktree}.promote`;
const STAGED = 'staged.json';
const digest = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
function promotable(cfg, root) {
  const out = [];
  for (const rel of cfg.promote.files || []) {
    const from = path.join(root, rel);
    if (!fs.existsSync(from)) continue;
    if (!fs.statSync(from).isDirectory()) { out.push(rel); continue; }
    for (const f of fs.readdirSync(from)) if (fs.statSync(path.join(from, f)).isFile()) out.push(path.join(rel, f));
  }
  return out;
}
/** Copy the promotable files of the build just checked and landed as `trainSha` into the staging dir, each with its sha256. */
function stage(cfg, trainSha) {
  const dir = stagingDir(cfg);
  fs.rmSync(dir, { recursive: true, force: true });
  const files = promotable(cfg, cfg.worktree).map((rel) => {
    const to = path.join(dir, rel);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(cfg.worktree, rel), to);
    const d = digest(to);
    if (d !== digest(path.join(cfg.worktree, rel))) throw new Error(`landing-train: the staged copy of ${rel} is not the built one`);
    return { rel, sha256: d };
  });
  fs.writeFileSync(path.join(dir, STAGED), JSON.stringify({ sha: trainSha, t: new Date().toISOString(), files }));
  return files.length;
}

/** Copy the staged build to the main checkout, then the stamp; only when the guard says no game is running, and only while main is still
 *  the commit that build was checked at (a stale exe under a fresh stamp would make the launcher read "up to date" over older code). */
function promote(cfg, data, { wait = false, say = () => {} } = {}) {
  const p = cfg.promote;
  if (!p) return null;
  const dir = stagingDir(cfg);
  let staged;
  try { staged = JSON.parse(fs.readFileSync(path.join(dir, STAGED), 'utf8')); } catch (_) { return { done: false, error: 'nothing staged: no landed build to promote' }; }
  for (;;) {
    const g = cfg.guard ? run(cfg.guard, cfg.repo) : { code: 1 };
    if (g.code !== 0) break;
    if (!wait) { say('a game is running: promotion waits (promote --wait)'); return { done: false, waiting: true }; }
    sleep(cfg.guard_poll_ms || 30000);
  }
  const head = sha(cfg.repo, cfg.base || 'main');
  if (head !== staged.sha) {
    const out = { done: false, error: `main has moved to ${String(head).slice(0, 7)} past the staged build of ${staged.sha.slice(0, 7)}; nothing promoted (the next landing stages its own)` };
    appendLog(data, { event: 'not-promoted', ...out });
    say(out.error);
    return out;
  }
  for (const f of staged.files) {
    fs.mkdirSync(path.dirname(path.join(cfg.repo, f.rel)), { recursive: true });
    fs.copyFileSync(path.join(dir, f.rel), path.join(cfg.repo, f.rel));
  }
  const mismatched = staged.files.filter((f) => digest(path.join(cfg.repo, f.rel)) !== f.sha256).map((f) => f.rel);
  if (p.stamp && !mismatched.length) fs.writeFileSync(path.join(cfg.repo, p.stamp), `${p.stamp_text || 'built by the landing train'} (${staged.sha.slice(0, 7)}, ${new Date().toISOString()})\n`);
  const lc = p.launch_check && !mismatched.length ? run(p.launch_check, cfg.repo) : null;
  const out = { done: mismatched.length === 0, files: staged.files.length, mismatched, built: staged.sha, head, launch_check: lc ? lc.text.trim().split(/\r?\n/).slice(-1)[0] : null };
  appendLog(data, { event: 'promoted', ...out });
  say(`promoted ${staged.files.length} file(s)${mismatched.length ? `, ${mismatched.length} NOT byte-identical (no stamp written)` : ', byte-identical'}${out.launch_check ? `; launch check: ${out.launch_check}` : ''}`);
  return out;
}

/** After a kill between the fast-forward and the push: push what main already holds (after the scan), or clear a marker that is already true. */
function reconcile(cfg, data, { say = () => {} } = {}) {
  const m = readMarker(data);
  if (!m) return { marker: false };
  const base = cfg.base || 'main', remote = cfg.remote || 'origin';
  const local = sha(cfg.repo, base), remoteSha = (git(cfg.repo, ['ls-remote', remote, `refs/heads/${base}`]).out.split(/\s+/)[0] || '');
  if (remoteSha === m.sha) { writeReady(data, without(readReady(data), m.rows)); appendLog(data, { event: 'reconciled', sha: m.sha, how: 'already pushed' }); fs.rmSync(path.join(data, MARK_NAME), { force: true }); return { marker: true, done: 'already pushed' }; }
  if (local !== m.sha) { fs.rmSync(path.join(data, MARK_NAME), { force: true }); appendLog(data, { event: 'reconciled', sha: m.sha, how: 'main never moved; nothing landed' }); return { marker: true, done: 'nothing landed' }; }
  const scan = scanForPush(cfg.repo, remote, m.sha, opts_gate(cfg));
  recordGate(data, { cwd: cfg.repo, decision: scan.decision, by: 'landing-train reconcile', sha: m.sha });
  if (!scan.ok) return { marker: true, done: null, stopped: `the scan refused (${scan.decision})` };
  const push = git(cfg.repo, ['push', '-q', remote, `${m.sha}:refs/heads/${base}`]);
  if (push.code !== 0) return { marker: true, done: null, stopped: push.err.slice(0, 200) };
  writeReady(data, without(readReady(data), m.rows));
  appendLog(data, { event: 'reconciled', sha: m.sha, how: 'pushed' });
  fs.rmSync(path.join(data, MARK_NAME), { force: true });
  say(`reconciled: pushed ${m.sha.slice(0, 7)}`);
  return { marker: true, done: 'pushed' };
}

function defaultHold() { return require('./heavy-run.js').acquire({ cmd: 'landing-train: build and check a batch', exclusive: true }); }

function loadConfig(file) {
  const cfg = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
  for (const k of ['repo', 'worktree', 'check']) if (!cfg[k]) throw new Error(`landing-train: the config has no '${k}'`);
  return cfg;
}

/** The one board line a train owes (the plan: "one board line names what landed"). The train has no path to the board: board_push is the app's
 *  funnel and the MCP speaks only for a seat. So it prints this line last and the seat that ran it posts it. null when there is nothing to say. */
function boardLine(r, base = 'main') {
  if (!r.landed.length && !r.named.length) return null;
  const who = (x) => `${x.branch} ${String(x.sha).slice(0, 7)} (${[x.pane, x.lap].filter(Boolean).join(' ')})`;
  const parts = [r.landed.length
    ? `landing train: landed ${r.landed.map(who).join(', ')} as ${base} ${String(r.sha || '?').slice(0, 7)}, ${r.pushed ? 'pushed and read back' : 'NOT pushed'}`
    : 'landing train: nothing landed'];
  for (const n of r.named) parts.push(`sent back ${who(n.row)}: ${n.reason}: ${(n.files || n.failing || []).slice(0, 3).join('; ')}`);
  return parts.join('. ');
}

function main(argv) {
  const cmd = argv[0];
  // Kept from the hand landings: the build and suites run at BelowNormal so his game keeps the machine. A child inherits a BelowNormal class.
  if (cmd === 'run' || cmd === 'promote') { try { os.setPriority(process.pid, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { process.stderr.write(`landing-train: priority not lowered: ${e.message}\n`); } }
  const ci = argv.indexOf('--config');
  if (ci < 0) { process.stderr.write('landing-train: --config FILE is required\n'); return 2; }
  const cfg = loadConfig(argv[ci + 1]);
  const data = dataDir();
  const flag = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
  if (cmd === 'ready') {
    // The branch is the one word that is neither a flag nor a flag's value (`ready --config FILE <branch> --pane P --lap L`).
    const valued = new Set(['--config', '--pane', '--lap', '--log-dir']);
    const words = [];
    for (let i = 1; i < argv.length; i++) { if (valued.has(argv[i])) { i++; continue; } if (!argv[i].startsWith('--')) words.push(argv[i]); }
    const branch = words[0];
    const s = branch && sha(cfg.repo, branch);
    if (!s) { process.stderr.write(`landing-train: no branch '${branch}' in ${cfg.repo}\n`); return 2; }
    writeReady(data, addReady(readReady(data), { branch, sha: s, pane: flag('--pane'), lap: flag('--lap'), t: new Date().toISOString() }));
    console.log(`READY ${branch} ${s.slice(0, 7)}`);
    return 0;
  }
  if (cmd === 'list') { for (const r of readReady(data)) console.log(`${r.branch} ${r.sha.slice(0, 7)} ${r.pane || ''} ${r.lap || ''} ${r.t || ''}`); return 0; }
  if (cmd === 'run') {
    const logDir = flag('--log-dir');
    if (logDir) fs.mkdirSync(logDir, { recursive: true });
    const r = runTrain(cfg, { data, logDir, waitPromote: argv.includes('--wait-promote') });
    console.log(JSON.stringify({ landed: r.landed.map((x) => x.branch), sha: r.sha || null, named: r.named.map((n) => ({ branch: n.row.branch, reason: n.reason, files: n.files, failing: n.failing })), pushed: r.pushed, promoted: r.promoted, stopped: r.stopped, attempts: r.attempts }));
    const line = boardLine(r, cfg.base || 'main');
    if (line) console.log(`BOARD: ${line}`);
    return r.stopped ? 1 : 0;
  }
  if (cmd === 'promote') { const r = promote(cfg, data, { wait: argv.includes('--wait'), say: (s) => process.stderr.write(`landing-train: ${s}\n`) }); console.log(JSON.stringify(r)); return r && r.done ? 0 : 1; }
  if (cmd === 'reconcile') { console.log(JSON.stringify(reconcile(cfg, data))); return 0; }
  process.stderr.write('landing-train: ready | list | run | promote | reconcile\n');
  return 2;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { stage, stagingDir, READY_NAME, LOG_NAME, MARK_NAME, dataDir, readReady, writeReady, addReady, without, failingRows, boardLine, scanForPush, recordGate, runTrain, promote, reconcile, cleanWorktree, mergeBatch, loadConfig, main };
