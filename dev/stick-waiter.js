#!/usr/bin/env node
'use strict';
// stick-waiter.js — Leave, as a waiter started at EVERY launch. P-STICK-BUILD (L059) §3 "WHAT THE WAITER RUNS",
// ruled at 11d9eb5 and ddf5a76, pane A, 2026-09-14. `dev/ON-EXIT.ps1`, absorbed; the stick scripts keep working.
//
//   node dev/stick-waiter.js --data <data_dir> --app-pid <pid> --app-image consonance.exe     (the app starts this)
//   node dev/stick-waiter.js --view <status file>          (by hand only — NOTHING starts this; see THE NOTICE below)
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
//   3  at the app's exit — P-LEAVE (D063) §2.3 a-d as re-ruled §2.7. The APP now saves to the stick itself at close and
//      shows DONE / NOT DONE in its own window; everything this waiter saves is the FALLBACK. In this order:
//        a  stick-apply.started.json names a live applier -> STAND DOWN. A hand-off is not a session end.
//        b  stick-leave.result.json for THIS app pid      -> STAND DOWN, whatever its outcome (the keeper saw it). Then
//                                                            remove it (D-4: the waiter owns removal, after acting).
//        c  stick-leave.started.json for THIS pid, no     -> the app died mid-save. WAIT while the stick's ledger.lock
//           result                                          names a live holder (its orphan tail-carry, D-3), then
//                                                            today's export with fallback notices; then remove it.
//                                                            At most LEAVE_CARRY_WAIT_MS (660 s, §2.8 R-1): at the bound,
//                                                            no export, NOT DONE naming the holder, the file kept.
//        d  neither file for this pid                     -> today's path: no stick, quiet; a stick, the fallback save:
//                                                            "don't pull it yet", tail-carry --export --json --apply,
//                                                            then DONE / NOT DONE (AMBIGUOUS: NOT DONE, nothing exported).
//      "For this pid": the pid first, then the image, lower-cased with ".exe" stripped on both sides (D-7). A LEAVE file
//      naming any other pid is stale — ignored here, removed by the app's launch-time cleanup.
//   4  before exiting — after ANY of a-d (D-9) — if the app is ALREADY RUNNING AGAIN under a new pid (a close and
//      reopen inside one poll), adopt that pid and keep waiting. That launch's own waiter found this one's lock live and
//      started none; without the adoption, the new session would end with nothing watching it.
//
// **THE NOTICE — P-NO-CONSOLE, 2026-09-14, replacing the export window.** The keeper, 05:23: *"there should never be
// an intrusive terminal windows ever popping up for consonance."* The console this file used to open at export was
// exactly that, so it is gone, and so is every other way this process can produce one:
//   · every child is started with windowsHide — libuv then passes CREATE_NO_WINDOW, so a console child of this
//     (console-less) process gets a console with no window, instead of a new one Windows Terminal draws;
//   · an export raises two Windows NOTIFICATIONS — not a window, not a console — through a hidden PowerShell, with the
//     text handed over in an environment variable so nothing in it is parsed: one as it STARTS ("don't pull it yet" —
//     the chair's re-rule of §1, 5190f73: a first carry of 348 MB left nothing on screen while it ran), and DONE or
//     NOT DONE when it ends. Both carry one tag, so the second REPLACES the first in the notification centre and a
//     stale "don't pull it yet" never outlives the DONE.
// The notices say "Consonance": the script registers the app's own identifier (tauri.conf.json's, com.solariz3d.
// consonance) under HKCU\Software\Classes\AppUserModelId with DisplayName and IconUri — the registration Windows reads
// for an unpackaged app — before showing. Measured 2026-09-14: an id registered this way gets a sender record under
// Notifications\Settings when shown; an unregistered one does not. Clicking a notice opens the status log through a
// file: link — never an app. If a notice cannot be shown, the status file still says so and NOTHING opens instead.
// `--view` stays as a command the keeper can run by hand; nothing starts it.
//
// **Leave writes to the STICK and never to the state repo.** No close.js, no git, no push.

const fs = require('fs');
const path = require('path');
const { spawnSync, execFileSync } = require('child_process');
const { pathToFileURL } = require('url');

const carry = require('./tail-carry.js');
const apply = require('./stick-apply.js');

const LOCK = 'stick-waiter.lock';
const STATUS = 'stick-waiter.status.log';
/**
 * P-LEAVE (D063) §2.1 as re-ruled §2.7: the app's own save at close. `sync_launch.rs` names them beside APPLY_STARTED
 * (E's); a test cross-checks the two spellings. Both carry { pid: <the app's pid>, image: "consonance.exe", … }.
 */
const LEAVE_STARTED = 'stick-leave.started.json';
const LEAVE_RESULT = 'stick-leave.result.json';
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
/**
 * P-LEAVE §2.8 R-1: case c waits for the dead app's orphan tail-carry at most this long. It is LEAVE_EXPORT_TIMEOUT's
 * 600 s (the app's own bound on that carry, main.rs) plus a 60 s margin: a carry still holding the ledger past the
 * time the app itself would have given it is hung, not slow. Unbounded, a hung orphan (or a holder whose image cannot
 * be read) kept this waiter waiting for ever while it held stick-waiter.lock — a relaunched app's waiter then exits
 * ALREADY_WAITING, and if the orphan finished during the new session the fallback exported while its seats wrote.
 */
const LEAVE_CARRY_WAIT_MS = 660 * 1000;

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

/** The app's own identifier (tauri.conf.json "identifier"), registered for notices as "Consonance". A test pins the match. */
const APP_ID = 'com.solariz3d.consonance';
/** One tag for both notices of an export, so DONE / NOT DONE replaces "don't pull it yet" instead of sitting beside it. */
const TOAST_TAG = 'stick';
const TOAST_GROUP = 'consonance';
const ICON = path.join(__dirname, '..', 'consonance', 'src-tauri', 'icons', '128x128.png');

/**
 * The script is a CONSTANT: nothing the stick, a path or a seat name contains is ever spliced into it. The notice's text
 * arrives as XML in CONSONANCE_TOAST_XML, built by toastXml with every value escaped; the icon path in
 * CONSONANCE_TOAST_ICON. It first (re)writes the per-user registration that makes Windows name the sender "Consonance" —
 * two string values under HKCU, idempotent, removable with one Remove-Item.
 */
const TOAST_PS = [
  "$ErrorActionPreference = 'Stop'",
  `$k = 'HKCU:\\Software\\Classes\\AppUserModelId\\${APP_ID}'`,
  'New-Item -Path $k -Force | Out-Null',
  "New-ItemProperty -Path $k -Name DisplayName -Value 'Consonance' -PropertyType String -Force | Out-Null",
  'if ($env:CONSONANCE_TOAST_ICON -and (Test-Path -LiteralPath $env:CONSONANCE_TOAST_ICON)) { New-ItemProperty -Path $k -Name IconUri -Value $env:CONSONANCE_TOAST_ICON -PropertyType String -Force | Out-Null }',
  '[void][Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime]',
  '[void][Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime]',
  '$x = New-Object Windows.Data.Xml.Dom.XmlDocument',
  '$x.LoadXml($env:CONSONANCE_TOAST_XML)',
  '$t = New-Object Windows.UI.Notifications.ToastNotification $x',
  `$t.Tag = '${TOAST_TAG}'`,
  `$t.Group = '${TOAST_GROUP}'`,
  `[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('${APP_ID}').Show($t)`,
].join('; ');

const xmlEscape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));

/**
 * The notice as toast XML. activationType="protocol" with a file: launch target is load-bearing: a notice with no launch
 * target activates the app it is attributed to, and that app is PowerShell — a click would open a PowerShell window.
 */
function toastXml(title, body, statusPath) {
  return `<toast activationType="protocol" launch="${xmlEscape(pathToFileURL(statusPath).href)}">` +
    `<visual><binding template="ToastGeneric"><text>${xmlEscape(title)}</text><text>${xmlEscape(body)}</text></binding></visual>` +
    '</toast>';
}

/** Raise the notice. Throws on failure; the caller writes that to the status file and opens nothing. */
function notify(title, body, statusPath) {
  execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-Command', TOAST_PS], {
    env: { ...process.env, CONSONANCE_TOAST_XML: toastXml(title, body, statusPath), CONSONANCE_TOAST_ICON: ICON },
    stdio: 'ignore', windowsHide: true, timeout: 30000,
  });
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
 * { code, outcome, exports, notices } — `outcome` names which exit rule ran last.
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
    notify,
    log: () => {},
    pollMs: POLL_MS, lockedRetryMs: LOCKED_RETRY_MS, lockedRetryForMs: LOCKED_RETRY_FOR_MS, leaveCarryWaitMs: LEAVE_CARRY_WAIT_MS,
    maxPolls: Infinity,
  }, inject || {});
  const runExport = k.exportCarry || ((stick) => defaultExport(stick, k.tailCarryPath));

  const parsed = parseArgs(argv);
  if (parsed.error) { k.log(`[stick-waiter] ${parsed.error}`); return { code: 2, outcome: 'BAD_ARGUMENTS', exports: 0, notices: 0 }; }
  const o = parsed.o;
  const app = { pid: o.appPid, image: imageName(o.appImage) };
  const tally = { exports: 0, notices: 0 };

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

      // ── 3 · the app's exit — P-LEAVE §2.3 a-d, as re-ruled at §2.7. The APP saves to the stick itself at close and
      //        shows DONE / NOT DONE in its own window; this waiter is the FALLBACK for a close that did not finish. ──
      const started = readJson(path.join(o.data, apply.STARTED));
      const leaveResultPath = path.join(o.data, LEAVE_RESULT);
      const leaveStartedPath = path.join(o.data, LEAVE_STARTED);
      const leaveResult = leaveFor(leaveResultPath, app);
      const leaveStarted = leaveFor(leaveStartedPath, app);
      if (started && started.script === 'stick-apply.js' && carry.holderLive(started, k.imageOf)) {
        // a · a hand-off to the applier. Not a session end: the relaunched app starts its own waiter. (D-9: the
        //     adoption check below still runs before this returns.)
        last = { code: 0, outcome: 'STOOD_DOWN' };
      } else if (leaveResult) {
        // b · the app's Leave FINISHED for this pid: the keeper saw DONE or NOT DONE by name. Stand down whatever the
        //     outcome. D-4: this waiter owns the removal, and removes only after acting — the app's launch-time cleanup
        //     will not touch a LEAVE file while this waiter's lock is live, so a relaunch inside one poll cannot turn
        //     b into d. A same-pid LEAVE_STARTED beside it (the app died between its two writes) is spent too.
        last = { code: 0, outcome: 'STOOD_DOWN_LEAVE' };
        removeLeave(leaveResultPath, app);
        if (leaveStarted) removeLeave(leaveStartedPath, app);
      } else if (leaveStarted) {
        // c · THE APP DIED MID-LEAVE. Its tail-carry was started with NO_WINDOW only and outlives the app, holding the
        //     stick's ledger lock. D-3 (B's option ii): wait until that holder pid is not live, THEN run today's export.
        //     An orphan that finished leaves nothing to carry (its own pending equals the file — P-DIVERGED debt b), so
        //     the ledger is not written twice; an orphan that died leaves the export to be done. Waiting instead of
        //     retrying is what keeps the two writers from both changing the ledger (F2 as re-worded).
        const waited = waitForLeaveCarry(leaveStarted, k, () => ++polls <= k.maxPolls);
        if (waited.gaveUp) return { code: 2, outcome: 'GAVE_UP', ...tally };
        if (waited.timedOut) {
          // §2.8 R-1: the holder never let go within LEAVE_CARRY_WAIT_MS. No export — the ledger is still held, and a
          // second writer is the thing D-3 exists to prevent. Say NOT DONE, naming the holder; leave LEAVE_STARTED in
          // place (nothing was acted on); the adoption check below still runs before returning.
          last = leaveCarryTimedOut(o.data, k, tally, app, leaveStarted, waited);
        } else {
          const find = findStick(k.volumeRoots());
          const why = `Consonance stopped during its own save to the stick (pid ${app.pid}, started ${leaveStarted.at || 'at an unrecorded time'}), so this is the fallback save.`;
          last = find.kind === 'none' ? { code: 0, outcome: 'NO_STICK' }
            : exportWithNotice(find, o.data, k, runExport, tally, { why, waited: waited.lines });
          removeLeave(leaveStartedPath, app);
        }
      } else {
        // d · neither file for this pid: a hard kill before any Leave (or an app with no Leave). Today's path, unchanged
        //     except that its notices say they are the fallback. A LEAVE file naming a DIFFERENT pid is stale: ignored
        //     here and left for the app's launch-time cleanup.
        const find = findStick(k.volumeRoots());
        const why = 'Consonance closed without saving to the stick itself (it was stopped before its close window could run), so this is the fallback save.';
        last = find.kind === 'none' ? { code: 0, outcome: 'NO_STICK' }
          : exportWithNotice(find, o.data, k, runExport, tally, { why, waited: [] });
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

/**
 * The LEAVE record at `p` for the app THIS waiter watched, or null. D-7: the pid decides first; the image is a second
 * check, compared lower-cased with ".exe" stripped on BOTH sides (pidImage's shape), because the app writes
 * "consonance.exe" and the argv may say either. A record for any other pid is stale and is not this waiter's to act on.
 */
function leaveFor(p, app) {
  const rec = readJson(p);
  if (!rec || rec.pid !== app.pid) return null;
  if (imageName(rec.image) !== app.image) return null;
  return rec;
}

/** Remove a LEAVE file after acting on it — only if it still names the pid acted on (never a newer app's file). */
function removeLeave(p, app) {
  const cur = readJson(p);
  if (cur && cur.pid === app.pid) { try { fs.unlinkSync(p); } catch (_) { /* gone already */ } }
}

/**
 * D-3: in case c, wait while the stick's ledger lock names a LIVE holder — the killed app's orphan tail-carry.
 * The lock is read in the stick the Leave named (LEAVE_STARTED.stick), or, lacking one, the stick found now.
 * Live means the pid answers (the kernel's word; no process started) AND it runs the image the lock names; "cannot
 * tell" the image counts as live, the safe direction. No lock, an unreadable one, or a dead holder: nothing to wait on.
 * `tick` spends the waiter's poll budget; returns { gaveUp } when it runs out. §2.8 R-1: a holder still live
 * `k.leaveCarryWaitMs` after the wait began returns { timedOut, holder, stick, waitedMs }. Otherwise { lines } for the
 * status file.
 */
function waitForLeaveCarry(leaveStarted, k, tick) {
  let stick = typeof leaveStarted.stick === 'string' && leaveStarted.stick ? leaveStarted.stick : null;
  if (!stick) { const f = findStick(k.volumeRoots()); stick = f.kind === 'one' ? f.folder : null; }
  if (!stick) return { lines: [] };
  const lockPath = path.join(stick, carry.LEDGER_DIR, carry.LOCK_NAME);
  const began = k.now();
  let first = null, n = 0, last = null;
  for (;;) {
    const rec = readJson(lockPath);
    const live = !!rec && Number.isInteger(rec.pid) && k.pidAnswers(rec.pid) && carry.holderLive(rec, k.imageOf);
    if (!live) break;
    const waitedMs = k.now() - began;
    if (waitedMs >= k.leaveCarryWaitMs) return { timedOut: true, holder: rec, stick, waitedMs };
    if (!tick()) return { gaveUp: true };
    if (first === null) first = k.now();
    last = rec;
    n++;
    k.sleep(k.pollMs);
  }
  if (!n) return { lines: [] };
  return { lines: [`waited ${Math.round((k.now() - first) / 1000)} s for the close window's own carry (pid ${last.pid}, ${last.script || 'unknown script'}) to let go of the stick's ledger before saving`] };
}

/**
 * §2.8 R-1, at the bound: nothing is saved. The status file and ONE fallback notice say NOT DONE and name the holder
 * that never let go of the stick's ledger, so the keeper knows what to look at before unplugging.
 */
function leaveCarryTimedOut(dataDir, k, tally, app, leaveStarted, waited) {
  const statusPath = path.join(dataDir, STATUS);
  fs.writeFileSync(statusPath, '');
  const say = (s) => { try { fs.appendFileSync(statusPath, `${s}\n`); } catch (_) {} };
  const h = waited.holder || {};
  const lines = [
    `NOT DONE — the stick's ledger is still held by pid ${h.pid} (${h.script || 'unknown script'}, since ${h.at || 'an unrecorded time'}) after ${Math.round(waited.waitedMs / 1000)} s. Nothing was saved.`,
    `Consonance stopped during its own save to the stick (pid ${app.pid}, started ${leaveStarted.at || 'at an unrecorded time'}), and that save never finished. This is the fallback, and it did not run over a live writer.`,
    `The stick: ${waited.stick}. Do not unplug it while pid ${h.pid} is running; open Consonance again, which re-checks it.`,
  ];
  say('CONSONANCE CLOSED — the FALLBACK save did not run.');
  say('');
  for (const l of lines) say(l);
  try { k.notify('Consonance — fallback save to the stick', lines.slice(0, 2).join('\n'), statusPath); tally.notices++; }
  catch (e) { say(`(the notification could not be shown: ${e && e.message ? e.message : e} — nothing opens instead; this file is the record)`); }
  say(`${END} 2 NOT DONE LEAVE_CARRY_TIMEOUT`);
  return { code: 2, outcome: 'LEAVE_CARRY_TIMEOUT' };
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

/**
 * A stick was found: raise "don't pull it yet", export (or refuse by name), write DONE / NOT DONE, raise the closing
 * notice, and hand back the result. AMBIGUOUS exports nothing, so it raises only the closing NOT DONE.
 */
function exportWithNotice(find, dataDir, k, runExport, tally, fallback) {
  const statusPath = path.join(dataDir, STATUS);
  fs.writeFileSync(statusPath, '');
  const say = (s) => { try { fs.appendFileSync(statusPath, `${s}\n`); } catch (_) {} };
  // P-LEAVE: every save this waiter makes is the FALLBACK — the app's own close window is the primary. Both notices
  // say so in their title, and the first says why.
  const fb = fallback || { why: 'This is the fallback save.', waited: [] };
  const raise = (body) => {
    try { k.notify('Consonance — fallback save to the stick', body, statusPath); tally.notices++; }
    catch (e) { say(`(the notification could not be shown: ${e && e.message ? e.message : e} — nothing opens instead; this file is the record)`); }
  };
  const finish = (code, outcome, lines) => {
    say('');
    for (const l of lines) say(l);
    // The notice carries the first line (DONE / NOT DONE and the reason) and, for a refusal, the named detail after it.
    raise(code === 0 ? lines[0] : lines.slice(0, 4).join('\n'));
    say(`${END} ${code} ${code === 0 ? 'DONE' : 'NOT DONE'} ${outcome}`);
    return { code, outcome };
  };

  say('CONSONANCE CLOSED. Copying every seat onto the stick — the FALLBACK save.');
  say(fb.why);
  for (const l of fb.waited || []) say(l);
  say('Do NOT unplug the stick until the notice says DONE.');

  if (find.kind === 'many') {
    return finish(2, 'AMBIGUOUS', ['NOT DONE — more than one stick folder is plugged in, and none was picked:',
      ...find.folders.map((f) => `  ${f.folder}   (${f.layout})`),
      'Nothing was exported. Unplug the one you do not mean, or run LEAVING.ps1 from the one you do.']);
  }

  say(`the stick: ${find.folder}   (${find.layout} layout)`);
  // Once, before the first attempt — a busy ledger's retries are one export to the keeper, not several.
  raise(`Saving to the stick — don't pull it yet.\n${find.folder}\n${fb.why}\nA second notice will say DONE or NOT DONE.`);
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

module.exports = { runWaiter, runView, findStick, layoutAt, parseVolumeList, parseArgs, pidAnswers, toastXml, notify, TOAST_PS, APP_ID, TOAST_TAG, ICON, LOCK, STATUS, END, IMAGE_EVERY_POLLS, LEAVE_STARTED, LEAVE_RESULT, LEAVE_CARRY_WAIT_MS };
