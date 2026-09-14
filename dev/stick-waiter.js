#!/usr/bin/env node
'use strict';
// stick-waiter.js — Leave, as a waiter started at EVERY launch. P-STICK-BUILD (L059) §3 "WHAT THE WAITER RUNS",
// ruled at 11d9eb5 and ddf5a76, pane A, 2026-09-14. `dev/ON-EXIT.ps1`, absorbed; the stick scripts keep working.
//
//   node dev/stick-waiter.js --data <data_dir> --app-pid <pid> --app-image consonance.exe     (the app starts this)
//   node dev/stick-waiter.js --view <status file>                                            (the window it opens)
//
// **There is no --stick.** The keeper's leaving gesture is plugging the stick in at the END of a session — usually
// after launch — so the waiter finds the stick at the moment it exports, by §3's rule: the volume root and one folder
// down, either marker. A path fixed at launch would skip the export on exactly that exit. (`ON-EXIT.ps1` could use
// `$PSScriptRoot` because it lived ON the stick; an in-repo waiter cannot.)
//
// **Started when the app starts, never by a close hook**: a close hook does not run when Windows kills the app, and on
// this machine a kill from outside runs no handler at all (measured, L059 §1). A waiter already waiting notices the
// app is gone however it went.
//
// In order:
//   1  take <data_dir>/stick-waiter.lock — a LIVE holder (pid alive under image node) means exit quietly: at most one
//   2  wait while the app is alive. GONE means its pid is dead OR alive under another image — pid reuse is real (E-1)
//   3  at the app's exit:
//        stick-apply.started.json names a live applier  -> STAND DOWN: exit quietly. A hand-off is not a session end;
//                                                          the relaunched app starts its own waiter.
//        no stick found by the §3 rule                  -> NO WINDOW, no export, no row. Quietly.
//        more than one stick folder                     -> a window, NOT DONE, every folder named; nothing exported
//        one stick folder                               -> a window; tail-carry --export --json --apply (which takes
//                                                          the ledger lock and rewrites the MANIFEST); DONE / NOT DONE
//   4  before exiting, if the app is ALREADY RUNNING AGAIN under a new pid — a close and reopen inside one poll —
//      adopt that pid and keep waiting. That launch's own waiter found this one's lock live and started none; without
//      the adoption, the new session would end with nothing watching it.
//
// **THE WINDOW.** The app starts this detached, with no console of its own, and a process cannot give itself one. So
// at export time it opens a new console with `cmd /c start`, running this same file in `--view` mode on a status file,
// and writes every line there. The window follows the file, prints DONE or NOT DONE by name, and holds for Enter.
// **The export does not depend on the window:** if the window cannot be opened, the export still runs and the status
// file says the window failed — the stick is never left behind because a console did not appear.
//
// **Leave writes to the STICK and never to the state repo.** No close.js, no git, no push.

const fs = require('fs');
const path = require('path');
const { spawn, spawnSync, execFileSync } = require('child_process');

const carry = require('./tail-carry.js');
const apply = require('./stick-apply.js');

const LOCK = 'stick-waiter.lock';
const STATUS = 'stick-waiter.status.log';
const SCRIPT = 'stick-waiter.js';
const END = '@@END';
const POLL_MS = 2000;
/**
 * How often, while the app's pid answers, its IMAGE is confirmed as well. The pid check costs nothing (`kill(pid, 0)`
 * sends no signal and starts no process); the image check starts `tasklist`. The restated no-stick bar (ddf5a76) allows
 * EXACTLY ONE added process — this waiter — so a `tasklist` every poll for a whole session is the wrong shape. Pid reuse
 * needs the app to die and a new process to take its number between two polls, so the image is confirmed once a minute.
 * A pid that stops answering is gone on the kernel's word alone.
 */
const IMAGE_EVERY_POLLS = 30;

/** Does this pid exist? No process started. EPERM means it exists and belongs to someone else. */
function pidAnswers(pid) {
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
}
const LOCKED_RETRY_MS = 5000;
const LOCKED_RETRY_FOR_MS = 60 * 1000;

function sleepSync(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }
function readJson(p) { try { return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, '')); } catch (_) { return null; } }
const imageName = (s) => String(s || '').replace(/\.exe$/i, '').toLowerCase();

// ── §3 "where the stick is" — the ONE table both suites test against, pinned ─────────────────────────────────────
//
//   no marker anywhere                                                         -> NO STICK
//   <root>/consonance-transfer/MANIFEST.json                                   -> <root>
//   <root>/consonance-L-20260911/consonance-tails/ledger.json                  -> <root>/consonance-L-20260911
//   markers in two different first-level folders                               -> AMBIGUOUS, both named
//   a marker at <root> AND a marker in a first-level folder of the same volume -> AMBIGUOUS, both named
//   <root>/a/b/consonance-tails/ledger.json   (two levels down)                -> NO STICK
//
// Mirrors `sync_launch::find_stick` (E): either marker by is-a-FILE, the root and its first-level DIRECTORIES only —
// a junction or symlink is not followed (a Dirent that is a link is not a directory), an unreadable root or child is
// skipped, children in sorted order. No case exists here that the Rust suite does not have.

const MARKERS = [['consonance-transfer', 'MANIFEST.json', 'manifest'], ['consonance-tails', 'ledger.json', 'older']];

function layoutAt(dir) {
  for (const [a, b, layout] of MARKERS) {
    try { if (fs.statSync(path.join(dir, a, b)).isFile()) return layout; } catch (_) { /* absent or unreadable */ }
  }
  return null;
}

/** { kind: 'none' } | { kind: 'one', folder, layout } | { kind: 'many', folders: [{folder, layout}] } */
function findStick(roots) {
  const found = [];
  for (const root of roots) {
    const here = layoutAt(root);
    if (here) found.push({ folder: root, layout: here });
    let entries;
    try { entries = fs.readdirSync(root, { withFileTypes: true }); } catch (_) { continue; }
    const kids = entries.filter((e) => e.isDirectory()).map((e) => path.join(root, e.name)).sort();
    for (const kid of kids) { const l = layoutAt(kid); if (l) found.push({ folder: kid, layout: l }); }
  }
  if (found.length === 0) return { kind: 'none' };
  if (found.length === 1) return { kind: 'one', folder: found[0].folder, layout: found[0].layout };
  return { kind: 'many', folders: found };
}

/**
 * FIXED and REMOVABLE volumes only, never a network share — the same filter E's `volume_roots` applies. Node has no
 * volume API, so this asks WMI once, at exit time only (never at launch, so it costs the no-stick launch nothing).
 * An unanswerable question returns [], which is "no stick": the quiet path, never a guessed drive letter.
 */
function volumeRoots() {
  let out;
  try {
    out = execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
      'Get-CimInstance Win32_LogicalDisk | Where-Object { $_.DriveType -eq 2 -or $_.DriveType -eq 3 } | ForEach-Object { $_.DeviceID }'],
    { encoding: 'utf8', windowsHide: true, timeout: 30000 });
  } catch (_) { return []; }
  return parseVolumeList(out);
}
function parseVolumeList(out) {
  return String(out).split(/\r?\n/).map((s) => s.trim()).filter((s) => /^[A-Za-z]:$/.test(s)).map((s) => `${s.toUpperCase()}\\`).sort();
}

/** Every live pid running `image`, from tasklist. [] when none or when it cannot be asked. */
function pidsOf(image) {
  let out;
  try { out = execFileSync('tasklist', ['/FI', `IMAGENAME eq ${image}`, '/FO', 'CSV', '/NH'], { encoding: 'utf8', windowsHide: true }); }
  catch (_) { return []; }
  return [...out.matchAll(/^"[^"]+","(\d+)"/gm)].map((m) => Number(m[1]));
}

function defaultExport(stick, tailCarryPath) {
  const r = spawnSync(process.execPath, [tailCarryPath, '--stick', stick, '--export', '--json', '--apply'],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, windowsHide: true });
  return { status: r.status, stdout: r.stdout || '', stderr: r.stderr || '', error: r.error || null };
}

/**
 * Open a visible console following the status file. A path cmd.exe could misread is refused rather than quoted
 * around — Windows paths cannot contain `"`, and `& | < > ^ %` are the characters `start` would act on.
 */
function openWindow(statusPath) {
  const parts = [process.execPath, path.join(__dirname, SCRIPT), statusPath];
  if (parts.some((p) => /["&|<>^%]/.test(p))) throw new Error(`a path cmd.exe could misread: ${parts.find((p) => /["&|<>^%]/.test(p))}`);
  const line = `start "Consonance - the stick" "${parts[0]}" "${parts[1]}" --view "${parts[2]}"`;
  const child = spawn('cmd.exe', ['/d', '/s', '/c', line], { detached: true, stdio: 'ignore', windowsVerbatimArguments: true });
  child.on('error', () => {});
  child.unref();
}

function parseArgs(argv) {
  const o = { data: null, appPid: null, appImage: null, view: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], v = argv[i + 1];
    const need = () => { if (v === undefined || v.startsWith('--')) throw new Error(`${a} needs a value`); i++; return v; };
    try {
      if (a === '--data') o.data = need();
      else if (a === '--app-pid') { const n = Number(need()); if (!Number.isInteger(n) || n <= 0) return { error: `--app-pid must be a positive integer, got ${v}` }; o.appPid = n; }
      else if (a === '--app-image') o.appImage = need();
      else if (a === '--view') o.view = need();
      else return { error: `unknown argument: ${a}` };
    } catch (e) { return { error: e.message }; }
  }
  if (o.view) return { o };
  if (!o.data) return { error: '--data <data_dir> is required' };
  if (!o.appPid) return { error: '--app-pid <pid> is required' };
  if (!o.appImage) return { error: '--app-image <image> is required' };
  return { o };
}

/**
 * The waiter. Every side effect is injectable; the CLI passes none. Returns
 * { code, outcome, exports, windows } — `outcome` names which exit rule ran last.
 */
function runWaiter(argv, inject) {
  const k = Object.assign({
    pid: process.pid,
    imageOf: carry.pidImage,
    pidAnswers,
    pidsOf,
    volumeRoots,
    sleep: sleepSync,
    now: () => Date.now(),
    tailCarryPath: path.join(__dirname, 'tail-carry.js'),
    exportCarry: null,
    openWindow,
    log: () => {},
    pollMs: POLL_MS, lockedRetryMs: LOCKED_RETRY_MS, lockedRetryForMs: LOCKED_RETRY_FOR_MS,
    maxPolls: Infinity,
  }, inject || {});
  const runExport = k.exportCarry || ((stick) => defaultExport(stick, k.tailCarryPath));

  const parsed = parseArgs(argv);
  if (parsed.error) { k.log(`[stick-waiter] ${parsed.error}`); return { code: 2, outcome: 'BAD_ARGUMENTS', exports: 0, windows: 0 }; }
  const o = parsed.o;
  const app = { pid: o.appPid, image: imageName(o.appImage) };
  const tally = { exports: 0, windows: 0 };

  // ── 1 · one waiter per data dir ──
  const lockPath = path.join(o.data, LOCK);
  const lock = takeLock(lockPath, k);
  if (!lock.ok) return { code: 0, outcome: 'ALREADY_WAITING', ...tally };

  let last = { code: 0, outcome: 'NO_STICK' };
  try {
    let polls = 0;
    for (;;) {
      // ── 2 · wait while the app is alive — "cannot tell" counts as alive ──
      // Each poll asks only whether the pid answers (no process started). A pid that does not answer is GONE — that
      // answer is the kernel's and needs no second opinion; asking tasklist then would let a failing tasklist keep this
      // waiting for ever over a process that no longer exists. While the pid answers, its image is confirmed once a
      // minute, because a pid that answers under ANOTHER image is gone too (E-1); an image that cannot be told keeps
      // waiting, the safe direction.
      for (let n = 1; ; n++) {
        if (++polls > k.maxPolls) return { code: 2, outcome: 'GAVE_UP', ...tally };
        if (!k.pidAnswers(app.pid)) break;
        if (n % IMAGE_EVERY_POLLS === 0 && !carry.holderLive(app, k.imageOf)) break;
        k.sleep(k.pollMs);
      }

      // ── 3 · the app's exit ──
      const started = readJson(path.join(o.data, apply.STARTED));
      if (started && started.script === 'stick-apply.js' && carry.holderLive(started, k.imageOf)) {
        return { code: 0, outcome: 'STOOD_DOWN', ...tally };
      }
      const find = findStick(k.volumeRoots());
      if (find.kind === 'none') {
        last = { code: 0, outcome: 'NO_STICK' };
      } else {
        last = exportWithWindow(find, o.data, k, runExport, tally);
      }

      // ── 4 · a close and reopen inside one poll: adopt the new session ──
      const again = (k.pidsOf(o.appImage) || []).filter((p) => p !== app.pid);
      if (!again.length) return { ...last, ...tally };
      app.pid = Math.max(...again);
    }
  } finally {
    lock.release();
  }
}

function takeLock(p, k) {
  const rec = { pid: k.pid, image: 'node', script: SCRIPT, at: new Date(k.now()).toISOString() };
  try { fs.mkdirSync(path.dirname(p), { recursive: true }); } catch (_) {}
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      fs.writeFileSync(p, JSON.stringify(rec) + '\n', { flag: 'wx' });
      return { ok: true, release: () => { const cur = readJson(p); if (cur && cur.pid === k.pid) { try { fs.unlinkSync(p); } catch (_) {} } } };
    } catch (e) {
      if (e.code !== 'EEXIST') return { ok: false };
      const held = readJson(p) || { pid: null };
      if (held.pid !== k.pid && carry.holderLive(held, k.imageOf)) return { ok: false, holder: held };
      try { fs.unlinkSync(p); } catch (_) {}
    }
  }
  return { ok: false };
}

/** A stick was found: open the window, export (or refuse by name), write DONE / NOT DONE, and hand back the result. */
function exportWithWindow(find, dataDir, k, runExport, tally) {
  const statusPath = path.join(dataDir, STATUS);
  fs.writeFileSync(statusPath, '');
  const say = (s) => { try { fs.appendFileSync(statusPath, `${s}\n`); } catch (_) {} };
  const finish = (code, outcome, lines) => {
    say('');
    for (const l of lines) say(l);
    say(`${END} ${code} ${code === 0 ? 'DONE' : 'NOT DONE'} ${outcome}`);
    return { code, outcome };
  };

  say('CONSONANCE CLOSED. Copying every seat onto the stick.');
  say('Do NOT unplug the stick until this window says DONE.');
  try { k.openWindow(statusPath); tally.windows++; }
  catch (e) { say(`(the window could not be opened: ${e.message} — the export runs anyway; this file is its record)`); }

  if (find.kind === 'many') {
    return finish(2, 'AMBIGUOUS', ['NOT DONE — more than one stick folder is plugged in, and none was picked:',
      ...find.folders.map((f) => `  ${f.folder}   (${f.layout})`),
      'Nothing was exported. Unplug the one you do not mean, or run LEAVING.ps1 from the one you do.']);
  }

  say(`the stick: ${find.folder}   (${find.layout} layout)`);
  const giveUpAt = k.now() + k.lockedRetryForMs;
  for (let attempt = 1; ; attempt++) {
    const r = runExport(find.folder);
    tally.exports++;
    let obj = null;
    try { obj = JSON.parse(String(r.stdout).split('\n')[0]); } catch (_) { obj = null; }
    if (!obj || typeof obj.code !== 'number') {
      return finish(3, 'CRASHED', [`NOT DONE — the carry tool printed no result (exit ${r.status}). Seats MAY be half-written on the stick; plug it in on the other machine and open Consonance, which re-checks it.`]);
    }
    if (obj.outcome === 'LEDGER_LOCKED' && k.now() < giveUpAt) {
      say(`attempt ${attempt}: the stick's ledger is busy — ${obj.why}. Trying again in ${Math.round(k.lockedRetryMs / 1000)} s.`);
      k.sleep(k.lockedRetryMs);
      continue;
    }
    if (obj.code === 0) {
      const carried = (obj.rows || []).filter((x) => x.result && x.result.ok).length;
      return finish(0, obj.outcome, [`DONE (${obj.outcome}) — ${carried} seat(s) written to the stick. You can unplug it now.`,
        'On the other machine: plug it in and open Consonance.']);
    }
    const stopped = (obj.rows || []).filter((x) => x.stops || (x.result && !x.result.ok));
    return finish(obj.code, obj.outcome, [`NOT DONE — exit ${obj.code}, ${obj.outcome}.`, ...(obj.why ? [obj.why] : []),
      ...stopped.map((x) => `  ${x.seat} ${x.sid}: ${x.verdict}${x.reason ? ` (${x.reason})` : ''}`),
      'Read the lines above before unplugging.']);
  }
}

/**
 * --view: the window. Follows the status file, printing new lines, until the END line; then holds for Enter.
 * `waitForEnter` and `sleep` are injectable; the file is read, never written.
 */
function runView(statusPath, inject) {
  const k = Object.assign({ out: (s) => process.stdout.write(s), sleep: sleepSync, waitForEnter: null, maxPolls: 7200, pollMs: 500 }, inject || {});
  let shown = 0;
  for (let polls = 0; polls < k.maxPolls; polls++) {
    let text = '';
    try { text = fs.readFileSync(statusPath, 'utf8'); } catch (_) { text = ''; }
    const lines = text.split('\n');
    const complete = text.endsWith('\n') ? lines.slice(0, -1) : lines.slice(0, -1);
    for (; shown < complete.length; shown++) {
      const l = complete[shown];
      if (l.startsWith(END)) {
        const [, code, ...rest] = l.split(' ');
        k.out(`\n  ===========================================================\n   ${rest.join(' ')}\n  ===========================================================\n`);
        if (k.waitForEnter) k.waitForEnter();
        return Number(code);
      }
      k.out(`  ${l}\n`);
    }
    k.sleep(k.pollMs);
  }
  k.out('\n  (this window stopped following the transfer; the status file has the rest)\n');
  if (k.waitForEnter) k.waitForEnter();
  return 2;
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  const parsed = parseArgs(argv);
  if (parsed.o && parsed.o.view) {
    const waitForEnter = () => { process.stdout.write('  Press Enter to close this window.'); try { fs.readSync(0, Buffer.alloc(1), 0, 1, null); } catch (_) {} };
    process.exit(runView(parsed.o.view, { waitForEnter }));
  }
  process.exit(runWaiter(argv).code);
}

module.exports = { runWaiter, runView, findStick, layoutAt, parseVolumeList, parseArgs, pidAnswers, LOCK, STATUS, END, IMAGE_EVERY_POLLS };
