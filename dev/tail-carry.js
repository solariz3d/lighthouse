#!/usr/bin/env node
'use strict';
// tail-carry.js — the conversations travel on the stick, by delta. P2 (D061), pane A, 2026-09-12.
//
//   node dev/tail-carry.js --stick <path> --export            # rehearse: what THIS machine would put on the stick
//   node dev/tail-carry.js --stick <path> --export --apply    # write the tails and the ledger
//   node dev/tail-carry.js --stick <path> --import            # rehearse: what the stick would do to THIS machine
//   node dev/tail-carry.js --stick <path> --import --apply    # append them
//   node dev/tail-carry.js --stick <path> --import --repair <sid> --apply     # finish an interrupted carry
//   node dev/tail-carry.js --stick <path> --import --retire-far <sid> --apply # this machine's own copy steps aside
//
// **`--apply` IS REQUIRED FOR EVERY WRITE, AND THAT IS A DEPARTURE FROM `place-conversations.js`**,
// which does the real thing by default. Named rather than drifted into: that command writes inside
// one machine, under a gate that refuses while the app is open. This one writes to a removable
// stick and, on the other side, to a machine whose state the author of the run cannot see. A
// command whose default action lands on the far end of a plane journey should not be the one you
// get by forgetting a flag.
//
// Exit codes are the `EXIT` table below, and they mean the same thing with and without `--json`.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────
// `--json` — THE CONTRACT THE APP READS (P-STICK, L058, pane A, 2026-09-14). The master copy of the
// contract is `exo_memory/loop/packet_stick_module_2026-09-14.md` §2; this is the code it describes.
//
//   node dev/tail-carry.js --stick <path> (--import|--export) [--apply] [--repair <sid>]... [--retire-far <sid>]... --json
//
//   stdout  exactly ONE JSON object, then a newline, and nothing else — built by `toJson`
//   stderr  everything a human would have seen without --json; never parse it
//   exit    equal to the object's "code"
//
// **A REFUSED ROW STOPS ONLY ITS OWN SEAT.** With `--apply`, every other seat that can carry IS
// carried in the same run, and the run still exits 1. The caller that wants "carry nothing if seat X
// refuses" must read the rehearsal's rows first and decide — this tool does not do that for it, and
// never has: `applyImport`/`applyExport` walk the rows independently. Each carried seat is verified
// whole on its own, so a partial run is a set of complete seats, never a half-written one.
// ─────────────────────────────────────────────────────────────────────────────────────────────
// WHY A TAIL AND NOT THE FILE. The keeper's decision (`loop/keeper_decisions_2026-09-11.md` §1):
// transcripts travel by USB, the repo keeps the room's files. The librarian then measured the
// three fixed seats against their 21-hour-old stick copies and found them PREFIX-IDENTICAL, 3 of
// 3 (`plan_one_consonance_2026-09-11.md` §8) — so a day's carry is ~2 MB a seat against 346 MB for
// the seven live files. The measurement came before the design, which is the only order in which
// it is evidence.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────
// THE HOLE IN THE SPEC THIS FILE DOES NOT IMPLEMENT, AND WHY.
//
// Plan §8 bar (2) says: *"If the destination's prefix hash at the ledger's offset differs, the two
// copies DIVERGED: refuse the tail."* **A content check at the offset cannot see the case it most
// needs to see.** If the far machine appended its own turns, the first `offset` bytes are still
// byte-identical — its growth is entirely AFTER the offset — so the hash matches, the tail is
// appended on top of the far machine's own continuation, and the result is a file in which two
// different futures of one conversation are concatenated. Every record still parses. Nothing
// reports an error. It is the worst class of failure this room knows: a success printed over a
// state that is wrong.
//
// So the import gate here is **`dest.size === agreed.offset` AND the hash matches** — exact
// equality, not a lower bound. The exporting side keeps the looser rule on purpose: a machine that
// has moved is precisely the one with something to carry.
//
// `tail-carry.test.js` builds that case in a fixture — the literal bar-(2) check passes on it and
// this one refuses — so the difference is demonstrated rather than argued.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────
// AND THE FACT THAT MAKES DIVERGENCE ORDINARY RATHER THAN RARE.
//
// **Opening Consonance appends to every resumed seat's transcript before anyone types anything.**
// Measured on D tonight: pane B was placed at 1,319,397 B, the 04:05 launch resumed it, and its
// file is 1,319,664 B with B having taken no turn — a `bridge-session` record and a cost record,
// +267 B. Seven seats, so ONE launch on the far machine moves all seven files.
//
// The consequence is the operating rule, and it belongs in the keeper's hands rather than in a
// comment: **between any two carries, Consonance may be open on exactly one machine, and the carry
// runs BOTH ways.** Export from the machine that ran, import on the machine that did not. Open the
// app on the far machine before its import and the next carry refuses, correctly, for all seven
// seats at once.
//
// The scheduled dream cycle does NOT break this: it runs `claude -p` under its own session id and
// skips entirely while a Consonance pane is live (`dev/dream/dream_cycle.ps1`), so it writes
// strangers into a project directory and never a seat's file.
//
// **This is why the lease (P3) matters and why it is not a blocker** — the argument is in the
// hand-back, not here. Short form: without it the carry is SAFE (every fork is refused by name)
// and LOSSY (one machine's turns must be retired). With it, the fork cannot happen.
//
// ─────────────────────────────────────────────────────────────────────────────────────────────
// WHAT THE LEDGER IS. One file on the stick, `consonance-tails/ledger.json`, and per seat it holds
// the LAST AGREED STATE: the byte length both machines had when they last matched, and the sha256
// of exactly those bytes. Everything else is derived from it:
//
//   export   my file must START WITH the agreed state (hash at offset matches) and be at least
//            that long. The bytes past it are the tail.
//   import   my file must BE the agreed state — same length, same hash. Then the tail appends.
//
// **The key is `sid` + the sha256 of the first record carrying a `"timestamp"`** — bar (1), and
// the correction in §8's addendum. Not the path: `resume_pane` used to rename a pane's file to
// `.orphaned` and open a new one at the same path, so a path-keyed carry would append one
// conversation's bytes onto another's. Not the first record either: a fresh file under the same
// sid opens with a byte-identical `{"type":"mode",…,"sessionId":…}` line, because the sessionId
// names the session and not the file. The first timestamped record is the first line that is
// about this conversation's actual history — and it is the same field the placement was scored by.
// ─────────────────────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const sync = require('../consonance/tools/state-sync.js');
// The slug rule is NOT re-implemented here. `place-conversations.js` owns one copy of `encode_cwd`
// and its test runs main.rs's own vectors against it; a second copy in this file would be a second
// thing to drift. Reading that module is reading, which is what this packet allows.
const place = require('./place-conversations.js');

const LEDGER_DIR = 'consonance-tails';
const LEDGER_NAME = 'ledger.json';
const LEDGER_VERSION = 1;

/** The --json object's own version. Bump it when a field changes meaning or disappears. */
const CONTRACT_VERSION = 1;

/**
 * THE EXIT CODES, and the `outcome` each one can carry. One table, read by both output modes.
 *
 * The code is the coarse class a shell can branch on; `outcome` is the exact state a program reads.
 * The four states the app has to tell apart are exactly the four codes.
 */
const EXIT = {
  // 0 — IT RAN, AND NO SEAT STOPPED.
  //   NOTHING_TO_DO  no seat has anything to carry (dry run or --apply alike)
  //   REHEARSED      no --apply; at least one seat WOULD carry, and none would stop
  //   CARRIED        --apply; at least one seat carried and verified whole, and none stopped
  OK: 0,
  // 1 — IT RAN, AND AT LEAST ONE SEAT DID NOT CARRY. Rows are present and say which.
  //   STOPPED        a row's `stops` is true (REFUSED, DIVERGED, INTERRUPTED, ABSENT_HERE). With
  //                  --apply, OTHER seats may still have carried — read each row's `result`.
  //   FAILED         --apply; a seat was written but did not verify whole. Wins over STOPPED.
  //   NOT_FLUSHED    --apply; a flush to the stick failed (D080), so what was written may not be on the device.
  //                  `why` names the file or directory and the error. Nothing in the run is reported as carried.
  SEAT: 1,
  // 2 — IT DID NOT RUN. Nothing was read about any seat and nothing was written. `rows` is [].
  //   CANNOT_RUN     bad arguments, no stick, an unreadable or future-version ledger, no roster,
  //                  or a HANDOFF at the generated name that a person wrote
  //   APP_RUNNING    --import --apply while Consonance is running (or when that cannot be told)
  //   LEDGER_LOCKED  --apply while another live writer holds consonance-tails/ledger.lock (L059 A-3)
  //
  //   --verify-set has its own object (§3 re-ruled) and uses 0 / 1 / 2 the same way: 0 the set verifies or
  //   is the older layout, 1 a member is missing or mismatched, 2 could not run.
  RAN_NOT: 2,
  // 3 — IT BROKE PART-WAY. An exception nobody anticipated. With --apply, some seats MAY have been
  //   written. Do not treat this as "nothing happened" and do not treat it as done.
  //   CRASHED
  CRASHED: 3,
};

/** A REFUSED row always carries one of these in `reason`; no other verdict does. */
const REASONS = [
  'UNSETTLED',            // the file was being written while we looked
  'NO_KEY',               // no record carrying a "timestamp" in the head — cannot say which conversation it is
  'UNIMPORTED_TAIL',      // export: the stick still holds the other machine's tail for this seat
  'OTHER_CONVERSATION',   // this machine's file under this sid is a DIFFERENT conversation (see `retirable`)
  'SHRANK',               // export: the file is shorter than the agreed state
  'HISTORY_REWRITTEN',    // the bytes inside the agreed prefix changed
  'TAIL_MISSING',         // import: the ledger names a tail file the stick does not hold
  'TAIL_DAMAGED',         // import: the tail does not match its own recorded sha256
  'TAIL_LENGTH',          // import: the tail's length disagrees with the span the ledger claims
  'LOCAL_GONE',           // import: this machine has no file, and the tail is a delta
  'LEDGER_INCONSISTENT',  // import: agreed state and pending tail do not meet
  'BEHIND',               // import: this machine's file is shorter than the agreed state
  'APPLIED_BUT_DIFFERENT',// import: every tail byte is present, yet the whole file's sha256 differs
];

/** Verdicts whose seat does not carry and needs a decision. `run` and `toJson` both read this. */
const STOPS = ['REFUSED', 'DIVERGED', 'INTERRUPTED', 'ABSENT_HERE'];
/** Verdicts that move bytes, per direction. */
const CARRIES = { export: ['TAIL', 'FULL'], import: ['APPEND', 'FULL', 'REPAIR', 'RETIRE_THEN_FULL', 'RETIRE_THEN_APPEND'] };

// ─────────────────────────────────────────────────────────────────────────────────────────────
// THE TRANSFER SET AND THE LEDGER LOCK — P-STICK-BUILD (L059) §3 as RE-RULED at 60e1ccf, pane A.
//
// A-2: whoever writes ledger.json — export OR import — rewrites consonance-transfer/MANIFEST.json and the
// generated HANDOFF in the same locked step, so the manifest is never stale on a success path. (Before
// the re-rule it was "written by Leave", and every successful import left it naming a ledger that no
// longer existed — measured: sha f70979ce… at export, fa920309… after the import.)
//
// A-3: one lock, consonance-tails/ledger.lock, created `wx`, held from the ledger READ that plans an
// --apply to the last write. A live holder of the named image refuses (exit 2, LEDGER_LOCKED) — never a
// silent wait. A dead holder, or a pid now running a different image, is taken over and named. Without
// it, two read-modify-write writers (the exit waiter's export and the applier's import) lost an update
// and wedged a seat for good, with every later rehearsal clean.
// ─────────────────────────────────────────────────────────────────────────────────────────────
const TRANSFER_DIR = 'consonance-transfer';
const MANIFEST_NAME = 'MANIFEST.json';
const MANIFEST_FORMAT = 1;
const LOCK_NAME = 'ledger.lock';
/** The first line of every generated HANDOFF. A file at that name WITHOUT it was written by a person. */
const GENERATED_MARK = '<!-- generated by dev/tail-carry.js from consonance-tails/ledger.json on every ledger write; do not edit -->';

/** This process's image, as tasklist names it without ".exe": "node". */
const SELF_IMAGE = path.basename(process.execPath).replace(/\.exe$/i, '').toLowerCase();

/**
 * The image a live pid is running, lower-case without ".exe" — or null when the pid is not running.
 * `undefined` when the question could not be asked (tasklist failed), which callers treat as ALIVE: an
 * unanswerable question must never let a second writer through.
 */
function pidImage(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return null;
  let out;
  // windowsHide (P-NO-CONSOLE): THIS is the tasklist the keeper saw flash once a minute — `PID eq <pid>`, called by the
  // exit waiter's image check, which runs with no console of its own. Without the flag Windows gave it a new console,
  // and Windows Terminal drew it.
  try { out = require('child_process').execFileSync('tasklist', ['/FI', `PID eq ${pid}`, '/FO', 'CSV', '/NH'], { encoding: 'utf8', windowsHide: true }); }
  catch (_) { return undefined; }
  const m = out.match(/^"([^"]+)","(\d+)"/m);
  if (!m || Number(m[2]) !== pid) return null;
  return m[1].replace(/\.exe$/i, '').toLowerCase();
}

/**
 * Is the holder named in a lock-or-handshake record a LIVE process of the image it claims?
 * `imageOf` is injectable for tests; the default asks tasklist.
 */
function holderLive(rec, imageOf) {
  imageOf = imageOf || pidImage;
  if (!rec || !Number.isInteger(rec.pid)) return false;
  if (rec.pid === process.pid) return true;
  const img = imageOf(rec.pid);
  if (img === undefined) return true;                                  // cannot tell: treat as alive
  return img !== null && img === String(rec.image || '').toLowerCase();
}

/**
 * Take the stick's ledger lock, or say who holds it.
 * Returns { ok: true, release, stale } or { ok: false, holder }.
 *
 * If consonance-tails/ does not exist yet it is created for the lock and removed again on release when it
 * is still empty — "a run that carries nothing writes nothing" survives the lock.
 */
function takeLedgerLock(stick, o) {
  o = o || {};
  const dir = path.join(stick, LEDGER_DIR);
  const madeDir = !fs.existsSync(dir);
  if (madeDir) fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, LOCK_NAME);
  const rec = { pid: process.pid, image: SELF_IMAGE, script: 'tail-carry.js', at: new Date(o.now || Date.now()).toISOString() };
  let stale = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      fs.writeFileSync(p, JSON.stringify(rec) + '\n', { flag: 'wx' });
      const release = () => {
        try { const cur = JSON.parse(fs.readFileSync(p, 'utf8')); if (cur.pid === process.pid) fs.unlinkSync(p); } catch (_) {}
        if (madeDir) { try { fs.rmdirSync(dir); } catch (_) { /* not empty: something was carried */ } }
      };
      return { ok: true, release, stale };
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      let held = null;
      try { held = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (_) { held = { pid: null, image: null, unreadable: true }; }
      if (holderLive(held, o.imageOf)) {
        if (madeDir) { try { fs.rmdirSync(dir); } catch (_) {} }
        return { ok: false, holder: held };
      }
      // Dead, pid reused by another image, or unreadable: take it over, and remember whose it was.
      stale = held;
      try { fs.unlinkSync(p); } catch (_) {}
    }
  }
  return { ok: false, holder: { pid: null, image: null, why: 'lost the takeover race twice' } };
}

/** The latest ISO `at` anywhere in the ledger, or null. The generated files take their time from here, never from the clock. */
function ledgerMaxAt(led) {
  let max = null;
  for (const e of Object.values(led.seats || {})) {
    for (const at of [e.agreed && e.agreed.at, e.pending && e.pending.at]) if (at && (!max || at > max)) max = at;
  }
  return max;
}

/** `HANDOFF-<YYYY-MM-DD>.md`, the UTC date of the ledger's latest `at`. Same ledger, same name, on either machine. */
function handoffName(led) {
  const at = ledgerMaxAt(led);
  return `HANDOFF-${at ? at.slice(0, 10) : 'undated'}.md`;
}

/**
 * The generated HANDOFF: a pure function of the ledger. Same ledger, same bytes — no clock, no machine
 * reading, no file order. Seats sorted by sid.
 */
function renderHandoff(led) {
  const L = [GENERATED_MARK, '', `# HANDOFF — what this stick carries`, ''];
  const at = ledgerMaxAt(led);
  L.push(`Ledger as of ${at || 'no carry recorded'}. This file is rewritten every time the ledger is written.`);
  L.push('');
  L.push('**Between any two carries, Consonance may be open on exactly one machine, and the carry runs BOTH ways.**');
  L.push('Opening the app writes to every seat it resumes, before anyone types, so a launch on the far machine before');
  L.push('its import makes every seat refuse, correctly, as DIVERGED.');
  L.push('');
  const sids = Object.keys(led.seats || {}).sort();
  const pending = sids.filter((s) => led.seats[s].pending);
  L.push(`## Pending — ${pending.length} seat(s) waiting to be imported on the other machine`);
  L.push('');
  if (!pending.length) L.push('Nothing. Every seat the ledger knows is at its agreed state on both machines.');
  for (const s of pending) {
    const e = led.seats[s], p = e.pending;
    // P-DIVERGED debt (c): this file is written from the ledger on the EXPORTING machine, which cannot see the far one.
    // A delta lands as APPEND only if the far copy is still exactly the agreed state; if that machine took turns of its
    // own since, the import reads DIVERGED and the keeper chooses. Say both, rather than promise the one we cannot see.
    const expect = p.offset === 0
      ? 'FULL (the whole conversation)'
      : 'APPEND if that machine has written nothing of its own to this seat since the agreed state; DIVERGED if it has — the keeper chooses there';
    L.push(`- **${e.seat || '(unnamed seat)'}** \`${s}\` — from ${p.from}, bytes ${p.offset}..${p.toOffset} (${p.bytes} B), exported ${p.at}`);
    L.push(`  - the conversation began ${e.firstTimestamp || 'unknown (this ledger never recorded it)'}; expected at the far end: ${expect}`);
    L.push(`  - tail file \`consonance-tails/${p.tailFile}\`, sha256 \`${p.tailSha}\``);
  }
  L.push('');
  L.push('## Agreed — the last state both machines matched');
  L.push('');
  const agreed = sids.filter((s) => led.seats[s].agreed);
  if (!agreed.length) L.push('None yet.');
  for (const s of agreed) {
    const e = led.seats[s];
    L.push(`- ${e.seat || '(unnamed seat)'} \`${s}\` — ${e.agreed.offset} B, agreed ${e.agreed.at}; began ${e.firstTimestamp || 'unknown'}`);
  }
  L.push('');
  return L.join('\n');
}

/** A file at `p` that exists and was not written by this tool. */
function foreignHandoff(p) {
  if (!fs.existsSync(p)) return false;
  const head = fs.readFileSync(p, 'utf8').split('\n', 1)[0];
  return head !== GENERATED_MARK;
}

/**
 * DONE IS SAID ONLY AFTER THE STICK HAS THE BYTES (P-FLUSH-BEFORE-DONE, D080).
 *
 * The case, measured on D (`handback/p-stick-fault-cause-C_2026-09-19.md` §1, §6): on 09-14 the stick's metadata
 * write was still failing 53 s after the last write call had returned, and "DONE — you can unplug it now" was
 * conditioned on those calls returning. `writeFileSync` + `renameSync` returning means the OS has the bytes, not
 * the device. So every file this tool puts on the stick is opened, written, fsynced and closed BEFORE its rename,
 * and the directories an apply wrote into are flushed at its end. A flush that fails is a FlushError, which
 * `run` turns into the named NOT DONE `NOT_FLUSHED` (exit 1) — never CARRIED, and not an anonymous CRASHED.
 *
 * THE DIRECTORY FLUSH, MEASURED rather than remembered (Node v24.14.1, Windows 10.0.26200, NTFS temp dir,
 * `scratchpad/flush/dirprobe.js`): `openSync(dir, 'r')` opens but its fsync is EPERM; `openSync(dir, 'w')` is
 * EISDIR; `openSync(dir, 'r+')` + `fsyncSync` SUCCEEDS. So directories are opened 'r+'. A filesystem that
 * refuses a directory flush with one of DIR_FLUSH_UNSUPPORTED is REPORTED (the run still carries: the files in it
 * were flushed, and refusing every carry on such a stick would be a lockout); any other error is a failed flush.
 * exFAT itself — the stick — is NOT measured: that would mean writing to it.
 *
 * THE ONE SEAM: `IO.fsync(fd, path)` — the path rides along so a failure can be named and a test can see what
 * was flushed. The CLI never replaces it; `tail-carry.test.js` does, and always puts it back.
 */
const IO = { fsync: (fd, p) => fs.fsyncSync(fd) };   // eslint-disable-line no-unused-vars
const DIR_FLUSH_UNSUPPORTED = ['EISDIR', 'EPERM', 'EACCES', 'ENOTSUP', 'EINVAL'];

class FlushError extends Error {}
function flushFailed(what, p, e) {
  const err = new FlushError(`${what} ${p} (${(e && (e.code || e.message)) || e})`);
  err.path = p;
  err.code = e && e.code;
  return err;
}

/** Open, write, fsync, close — the caller renames. The close error is dropped ONLY when an earlier one is already on its way out. */
function writeDurable(p, data) {
  const fd = fs.openSync(p, 'w');
  let flushed = false;
  try {
    fs.writeFileSync(fd, data);
    try { IO.fsync(fd, p); } catch (e) { throw flushFailed('could not flush', p, e); }
    flushed = true;
  } finally {
    try { fs.closeSync(fd); } catch (e) { if (flushed) throw flushFailed('could not close after flushing', p, e); }
  }
}

/** 'flushed', or 'unsupported (<code>…)' when the filesystem declines; throws a FlushError on anything else. */
function flushDir(dir) {
  let fd;
  try { fd = fs.openSync(dir, 'r+'); } catch (e) {
    if (DIR_FLUSH_UNSUPPORTED.includes(e.code)) return `unsupported (${e.code} opening it)`;
    throw flushFailed('could not open the directory to flush it:', dir, e);
  }
  let result;
  try {
    try { IO.fsync(fd, dir); result = 'flushed'; } catch (e) {
      if (!DIR_FLUSH_UNSUPPORTED.includes(e.code)) throw flushFailed('could not flush the directory', dir, e);
      result = `unsupported (${e.code})`;
    }
  } finally {
    try { fs.closeSync(fd); } catch (e) { if (result) throw flushFailed('could not close the directory after flushing it:', dir, e); }
  }
  return result;
}

/** Flush each directory once, in the order given; the record goes into the run's result. */
function flushDirs(dirs) {
  const seen = new Set();
  const out = [];
  for (const d of dirs) {
    const k = path.resolve(d);
    if (seen.has(k) || !fs.existsSync(d)) continue;
    seen.add(k);
    out.push({ dir: d, result: flushDir(d) });
  }
  return out;
}

function writeAtomic(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const tmp = `${p}.writing-${process.pid}`;
  writeDurable(tmp, data);
  fs.renameSync(tmp, p);
}

/**
 * THE ONE WRITER's second step (A-2): after the ledger, the HANDOFF, then the MANIFEST — last, so a
 * manifest on the stick only ever names files that already hold the bytes it records. Members: the
 * ledger, every tail the ledger names as pending, the HANDOFF.
 */
function writeTransferSet(stick, led, machine) {
  const hname = handoffName(led);
  const hpath = path.join(stick, hname);
  if (foreignHandoff(hpath)) throw new Error(`${hname} on the stick was written by hand; the tool will not overwrite it`);
  writeAtomic(hpath, renderHandoff(led));
  const rels = [`${LEDGER_DIR}/${LEDGER_NAME}`];
  for (const s of Object.keys(led.seats).sort()) { const p = led.seats[s].pending; if (p && p.tailFile) rels.push(`${LEDGER_DIR}/${p.tailFile}`); }
  rels.push(hname);
  const members = rels.map((rel) => {
    const abs = path.join(stick, ...rel.split('/'));
    return { path: rel, bytes: fs.statSync(abs).size, sha256: hashRange(abs, 0, fs.statSync(abs).size) };
  });
  const manifest = { format: MANIFEST_FORMAT, writtenBy: machine, at: ledgerMaxAt(led), members };
  writeAtomic(path.join(stick, TRANSFER_DIR, MANIFEST_NAME), JSON.stringify(manifest, null, 2) + '\n');
  return { handoff: hpath, manifest: path.join(stick, TRANSFER_DIR, MANIFEST_NAME) };
}

/**
 * --verify-set (§3, as re-ruled). Handed the stick FOLDER, never the volume. Reads; writes nothing.
 *
 *   code 0  layout "manifest" and every member is present with its bytes and sha256
 *           — OR layout "older": a ledger and no MANIFEST. That IS a stick, and it is carried.
 *   code 1  a MANIFEST names a member that is missing or mismatched, each named
 *   code 2  could not run: no such folder, an unreadable MANIFEST, or no marker at all
 *   extra   informational, never a failure: files under consonance-tails/ the manifest does not name
 */
function verifySet(stick) {
  const res = { code: 2, layout: null, missing: [], mismatched: [], extra: [], why: null };
  if (!stick || !fs.existsSync(stick)) { res.why = `no such folder: ${stick}`; return res; }
  const mpath = path.join(stick, TRANSFER_DIR, MANIFEST_NAME);
  if (!fs.existsSync(mpath)) {
    if (fs.existsSync(ledgerPath(stick))) { res.code = 0; res.layout = 'older'; return res; }
    res.why = `no stick marker in ${stick}: neither ${TRANSFER_DIR}/${MANIFEST_NAME} nor ${LEDGER_DIR}/${LEDGER_NAME}`;
    return res;
  }
  let man;
  try { man = JSON.parse(fs.readFileSync(mpath, 'utf8').replace(/^﻿/, '')); }
  catch (e) { res.why = `${TRANSFER_DIR}/${MANIFEST_NAME} is not readable JSON: ${e.message}`; return res; }
  if (!man || !Array.isArray(man.members)) { res.why = `${TRANSFER_DIR}/${MANIFEST_NAME} has no members list`; return res; }
  if (man.format !== MANIFEST_FORMAT) { res.why = `${TRANSFER_DIR}/${MANIFEST_NAME} is format ${man.format}; this tool reads ${MANIFEST_FORMAT}`; return res; }
  res.layout = 'manifest';
  const root = path.resolve(stick);
  const named = new Set();
  for (const m of man.members) {
    const rel = String(m && m.path || '');
    const abs = path.resolve(root, ...rel.split('/'));
    // A member that points outside the stick is not a member of it, whatever it says.
    if (!rel || (abs !== root && !abs.startsWith(root + path.sep))) { res.mismatched.push(rel); continue; }
    named.add(rel);
    if (!fs.existsSync(abs)) { res.missing.push(rel); continue; }
    const size = fs.statSync(abs).size;
    if (size !== m.bytes || hashRange(abs, 0, size) !== m.sha256) res.mismatched.push(rel);
  }
  const tails = path.join(stick, LEDGER_DIR);
  if (fs.existsSync(tails)) {
    for (const f of fs.readdirSync(tails).sort()) {
      const rel = `${LEDGER_DIR}/${f}`;
      if (named.has(rel) || f === LOCK_NAME || /\.writing-\d+$/.test(f)) continue;
      if (fs.statSync(path.join(tails, f)).isFile()) res.extra.push(rel);
    }
  }
  res.code = res.missing.length || res.mismatched.length ? 1 : 0;
  return res;
}

/** Bytes of head to scan for the first timestamped record before giving up. */
const KEY_SCAN_BYTES = 1024 * 1024;

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/**
 * THE SETTLE GATE, for a file too large to hold in memory.
 *
 * `state-sync.js`'s `stableRead` is the gate this reuses, and it is reused **in part, which is said
 * here rather than glossed**: that function reads the WHOLE file twice into Buffers to prove the
 * bytes did not move under it, which is right for a 40 KB capture and wrong for a 260 MB
 * transcript. What is reused is the part that is actually load-bearing for an append-only file —
 * the **quiescence rule**: a file whose mtime is `SETTLE_MS` in the past is not inside a write, it
 * is between them; a file with a FUTURE mtime cannot be reasoned about at all and is refused.
 *
 * The constants are IMPORTED from `state-sync.js`, never retyped, so a change there moves this and
 * `tail-carry.test.js` asserts that identity. Plan §8 bar (6) asked for reuse and not new work;
 * this is the honest extent of it.
 *
 * A torn last line is harmless to a byte-offset carry — bar (6) says so — so no attempt is made to
 * find a record boundary. What must not happen is reading DURING a write, and that is what this
 * refuses.
 */
function settledStat(p, opts) {
  opts = opts || {};
  const tries = opts.tries === undefined ? sync.STABLE_TRIES : opts.tries;
  const settleMs = opts.settleMs === undefined ? sync.SETTLE_MS : opts.settleMs;
  const now = opts.now || (() => Date.now());
  for (let i = 1; i <= tries; i++) {
    let st;
    try { st = fs.statSync(p); } catch (e) { return { st: null, why: `cannot stat: ${e.code || e.message}` }; }
    if (st.mtimeMs > now() + 1000) return { st: null, why: 'FUTURE_MTIME — the clock moved, or something is writing with a time we cannot reason about' };
    const age = now() - st.mtimeMs;
    if (age < settleMs) { sleepSync(Math.min(settleMs - age + 5, settleMs)); continue; }
    return { st, why: null };
  }
  return { st: null, why: `never went quiet in ${tries} attempts — something is writing it continuously` };
}

/** sha256 of a byte range, streamed. `end` is exclusive; `start === end` hashes nothing. */
function hashRange(p, start, end) {
  const h = crypto.createHash('sha256');
  if (end <= start) return h.digest('hex');
  const fd = fs.openSync(p, 'r');
  try {
    const buf = Buffer.allocUnsafe(1 << 20);
    let at = start;
    while (at < end) {
      const want = Math.min(buf.length, end - at);
      const got = fs.readSync(fd, buf, 0, want, at);
      if (got <= 0) throw new Error(`short read at ${at} of ${p}`);
      h.update(buf.subarray(0, got));
      at += got;
    }
  } finally { fs.closeSync(fd); }
  return h.digest('hex');
}

/** Read a byte range into a Buffer. Used for tails, never for whole transcripts. */
function readRange(p, start, end) {
  const out = Buffer.allocUnsafe(Math.max(0, end - start));
  if (out.length === 0) return out;
  const fd = fs.openSync(p, 'r');
  try {
    let at = 0;
    while (at < out.length) {
      const got = fs.readSync(fd, out, at, out.length - at, start + at);
      if (got <= 0) throw new Error(`short read at ${start + at} of ${p}`);
      at += got;
    }
  } finally { fs.closeSync(fd); }
  return out;
}

/**
 * The identity of a conversation: sha256 of the first record that carries a `"timestamp"`.
 *
 * Bar (1) as corrected at the disk. Returns `{ key, line }` or `{ key: null, why }` — a transcript
 * with no timestamped record in its first megabyte is a surprise and is refused rather than keyed
 * on something weaker.
 */
function conversationKey(p, scanBytes) {
  const cap = scanBytes === undefined ? KEY_SCAN_BYTES : scanBytes;
  let size;
  try { size = fs.statSync(p).size; } catch (e) { return { key: null, why: `cannot stat: ${e.code || e.message}` }; }
  const head = readRange(p, 0, Math.min(size, cap));
  const text = head.toString('utf8');
  const lines = text.split('\n');
  // The last element may be a fragment of a line we did not read; never key on it unless the whole
  // file was read.
  const usable = head.length >= size ? lines : lines.slice(0, -1);
  for (const l of usable) {
    if (!l.trim()) continue;
    let o;
    try { o = JSON.parse(l); } catch (_) { continue; }
    if (o && typeof o.timestamp === 'string') return { key: sha256(Buffer.from(l, 'utf8')), line: l, why: null };
  }
  return { key: null, why: `no record carrying a "timestamp" in the first ${Math.min(size, cap)} bytes` };
}

/**
 * THE SEATS, derived and never typed.
 *
 * The three fixed seats' ids and directory names are parsed out of `main.rs` — the app is the only
 * place they are declared, and a copy here would be a copy that can go stale without anything
 * noticing. The panes come from `panes.json`, the same roster `place-conversations.js` reads.
 * Refuses rather than returning a short list: a carry that silently omits a seat is a seat that
 * stops existing on the other machine.
 */
function seats(o) {
  o = o || {};
  const rs = o.mainRs || path.join(__dirname, '..', 'consonance', 'src-tauri', 'src', 'main.rs');
  const instances = o.instancesRoot || sync.instancesRoot();
  const panesPath = o.panesPath || path.join(o.data || sync.dataDir() || '', 'panes.json');
  const out = [];

  let src;
  try { src = fs.readFileSync(rs, 'utf8'); } catch (e) { return { seats: null, why: `cannot read ${rs}: ${e.code || e.message}` }; }
  const FIXED = [
    ['main', /const MAIN_SID: &str = "([0-9a-f-]+)"/, /fn main_cwd\(\)[\s\S]{0,200}?instances_root\(\)\.join\("([^"]+)"\)/],
    ['librarian', /const LIBRARIAN_SID: &str = "([0-9a-f-]+)"/, /fn librarian_cwd\(\)[\s\S]{0,200}?instances_root\(\)\.join\("([^"]+)"\)/],
    ['third place', /const THIRD_PLACE_SID: &str = "([0-9a-f-]+)"/, /fn third_place_cwd\(\)[\s\S]{0,200}?instances_root\(\)\.join\("([^"]+)"\)/],
  ];
  for (const [name, sidRe, dirRe] of FIXED) {
    const sid = src.match(sidRe);
    const dir = src.match(dirRe);
    if (!sid || !dir) return { seats: null, why: `${rs} no longer declares the ${name} seat where this tool reads it (sid:${!!sid} dir:${!!dir})` };
    out.push({ seat: name, sid: sid[1], cwd: path.join(instances, dir[1]), kind: 'fixed' });
  }

  let roster;
  try { roster = JSON.parse(fs.readFileSync(panesPath, 'utf8')); }
  catch (e) { return { seats: null, why: `cannot read ${panesPath}: ${e.code || e.message}` }; }
  if (!Array.isArray(roster)) return { seats: null, why: `${panesPath} is not an array of panes` };
  for (const r of roster) {
    if (!r || !r.pane || !r.cwd) continue;
    out.push({ seat: `pane ${r.label || ''}`.trim(), sid: r.pane, cwd: r.cwd, kind: 'pane' });
  }
  return { seats: out, why: null };
}

const ledgerPath = (stick) => path.join(stick, LEDGER_DIR, LEDGER_NAME);

function readLedger(stick) {
  const p = ledgerPath(stick);
  if (!fs.existsSync(p)) return { version: LEDGER_VERSION, seats: {} };
  const got = sync.stableRead(p);          // small file: the real gate, whole
  if (!got.buf) throw new Error(`the ledger would not settle: ${p}`);
  const led = JSON.parse(got.buf.toString('utf8'));
  if (led.version !== LEDGER_VERSION) throw new Error(`ledger version ${led.version}, this tool speaks ${LEDGER_VERSION}`);
  if (!led.seats || typeof led.seats !== 'object') throw new Error(`ledger has no seats map: ${p}`);
  return led;
}

function writeLedger(stick, led) {
  const dir = path.join(stick, LEDGER_DIR);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = path.join(dir, `${LEDGER_NAME}.writing-${process.pid}`);
  writeDurable(tmp, JSON.stringify(led, null, 2) + '\n');
  fs.renameSync(tmp, ledgerPath(stick));
}

const stamp = (now) => new Date(now).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');

/**
 * The attic's stamp: LOCAL time, `YYYYMMDD-HHMMSS` — byte-for-byte the format `main.rs` hands
 * `sync_launch::attic_for` (`chrono::Local::now().format("%Y%m%d-%H%M%S")`). One attic, one clock,
 * so a reader sorting the attic by name is sorting it by time whichever tool retired the seat.
 */
function atticStamp(now) {
  const d = new Date(now);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

/**
 * ONE RETIREMENT ADDRESS — `~/.claude/consonance-attic/<slug>/<sid>.<stamp>-<why>.jsonl`.
 *
 * `sync_launch::attic_for` (`sync_launch.rs:496`) is the shape: `home/.claude/consonance-attic/
 * <encoded cwd>/<sid>.<stamp>.jsonl`. The trailing `-<why>` is the tag the attic already carries
 * (`…20260914-005441-launchborn.jsonl`), and it says which tool put the file there and why:
 * `retire-far` for a conversation this machine stepped aside for the carried one, `pre-truncate` for
 * the copy a REPAIR keeps before it truncates.
 *
 * **Why the attic and not beside the live file, which is what this function used to do.** The room's
 * record says retired seats rest in the attic, and the app's own retirements are there. On
 * 2026-09-14 this tool's first real `--retire-far` put a launch-born librarian at
 * `projects/…/0c0c0c0b-…-115b.jsonl.retired-20260914T063637Z` — and the librarian's own master missed
 * it, because it looked where the record said to look. Two retirers with two conventions is one
 * convention nobody can rely on. `attic_for`'s other reason applies too: a file left in the indexed
 * `projects/` tree is somewhere the vendor looks.
 *
 * The attic hangs off the SAME `.claude` directory as `projectsRoot` (its parent), exactly as
 * `carriedPath` does, so a fixture's attic is the fixture's and never the real one.
 *
 * Counted if the name is taken — `main.rs:835-836` is the scar where a FIXED archive name let one
 * retirement overwrite another. The counter stays inside the stamp segment, so the `<sid>.<stamp>.jsonl`
 * shape survives it.
 */
function atticPath(projectsRoot, slug, sid, why, now, exists) {
  exists = exists || fs.existsSync;
  const dir = path.join(path.dirname(projectsRoot), 'consonance-attic', slug);
  const base = `${atticStamp(now)}-${why}`;
  const first = path.join(dir, `${sid}.${base}.jsonl`);
  if (!exists(first)) return first;
  for (let n = 2; n < 1000; n++) {
    const p = path.join(dir, `${sid}.${base}-${n}.jsonl`);
    if (!exists(p)) return p;
  }
  throw new Error(`cannot find an unused attic name for ${sid} in ${dir}`);
}

/**
 * THE EXPORT PLAN. Reads this machine and the ledger; decides, per seat, what would go on the
 * stick. Writes nothing.
 */
function planExport(o) {
  const stick = o.stick;
  const machine = o.machine || sync.machineTag();
  const projectsRoot = o.projectsRoot || path.join(os.homedir(), '.claude', 'projects');
  const s = seats(o);
  if (!s.seats) return { ok: false, code: 2, why: s.why, rows: [] };
  const led = readLedger(stick);
  const rows = [];

  for (const seat of s.seats) {
    const src = place.paneJsonl(projectsRoot, seat.cwd, seat.sid);
    // `size` starts null, not 0: a seat whose file was never stat'd must not report "0 bytes here".
    const row = { ...seat, src, verdict: null, why: null, offset: 0, size: null, bytes: 0, key: null };
    const entry = led.seats[seat.sid] || null;
    row.entry = entry;

    if (!fs.existsSync(src)) {
      // Not an error: a seat that has never spoken on this machine has nothing to carry, and a
      // seat this machine does not run at all is exactly the same shape.
      row.verdict = entry ? 'ABSENT_HERE' : 'NOTHING_YET';
      row.why = entry
        ? 'the ledger knows this seat but this machine has no file for it — a surprise, not a carry'
        : 'no transcript on this machine yet';
      rows.push(row);
      continue;
    }

    const gate = settledStat(src);
    if (!gate.st) { row.verdict = 'REFUSED'; row.reason = 'UNSETTLED'; row.why = `source will not settle — ${gate.why}`; rows.push(row); continue; }
    row.size = gate.st.size;

    const k = conversationKey(src);
    if (!k.key) { row.verdict = 'REFUSED'; row.reason = 'NO_KEY'; row.why = `cannot key this transcript — ${k.why}`; rows.push(row); continue; }
    row.key = k.key;
    row.keyLine = k.line;

    // A pending tail from the OTHER machine that nobody has imported yet must not be overwritten.
    if (entry && entry.pending && entry.pending.from !== machine) {
      row.verdict = 'REFUSED';
      row.reason = 'UNIMPORTED_TAIL';
      row.why = `the stick still carries an unimported tail from ${entry.pending.from} — import it on the machine it is for before exporting over it`;
      rows.push(row); continue;
    }

    // P-DIVERGED debt (b): THIS machine's own pending tail is what the stick holds. If the file is still exactly what
    // that export wrote — its length and its whole sha — the stick already has this machine's last session, and a
    // rehearsal that said TAIL/FULL here is the reopen's false "the stick does not have your last session". A file that
    // has GROWN (or changed) since falls through unchanged: the far machine has imported nothing yet, so the new tail
    // re-carries from the agreed state (or whole), replacing the pending record, and the far end still lands it whole.
    if (entry && entry.pending && entry.pending.from === machine && entry.key === k.key &&
        row.size === entry.pending.toOffset && hashRange(src, 0, row.size) === entry.pending.fullSha) {
      row.verdict = 'UP_TO_DATE';
      row.offset = entry.pending.toOffset;
      row.why = `the stick already holds this machine's last session for this seat (exported ${entry.pending.at}, ${entry.pending.offset}..${entry.pending.toOffset}), not yet imported on the other machine`;
      rows.push(row); continue;
    }

    if (!entry || !entry.agreed) {
      row.verdict = 'FULL';
      row.offset = 0;
      row.bytes = row.size;
      row.why = 'no agreed state on the stick: the whole conversation travels, and the next carry is a tail';
      rows.push(row); continue;
    }
    if (entry.key !== k.key) {
      row.verdict = 'REFUSED';
      row.reason = 'OTHER_CONVERSATION';
      row.why = `this sid holds a DIFFERENT conversation than the one the stick agreed on (key ${k.key.slice(0, 16)}… vs ${String(entry.key).slice(0, 16)}…)`;
      rows.push(row); continue;
    }
    const agreed = entry.agreed;
    if (row.size < agreed.offset) {
      row.verdict = 'REFUSED';
      row.reason = 'SHRANK';
      row.why = `the source is SHORTER than the agreed state (${row.size} < ${agreed.offset}) — a transcript that shrank is not append-only and nothing here can repair it`;
      rows.push(row); continue;
    }
    const prefix = hashRange(src, 0, agreed.offset);
    if (prefix !== agreed.prefixSha) {
      row.verdict = 'REFUSED';
      row.reason = 'HISTORY_REWRITTEN';
      row.why = `this machine's own copy DIVERGED from the agreed state at offset ${agreed.offset} — its history was rewritten, not appended to`;
      rows.push(row); continue;
    }
    if (row.size === agreed.offset) { row.verdict = 'UP_TO_DATE'; row.offset = agreed.offset; rows.push(row); continue; }

    row.verdict = 'TAIL';
    row.offset = agreed.offset;
    row.bytes = row.size - agreed.offset;
    rows.push(row);
  }
  return { ok: true, code: 0, rows, led, machine, stick };
}

/** Write the planned tails and update the ledger's pending records. */
function applyExport(plan, now) {
  const { stick, led, machine } = plan;
  const dir = path.join(stick, LEDGER_DIR);
  const done = [];
  // A RUN THAT CARRIES NOTHING WRITES NOTHING — not even the directory, not even an empty ledger.
  // An export where every seat refused is a report, and a report that leaves state behind on the
  // stick is a state change dressed as a reading.
  if (!plan.rows.some((r) => r.verdict === 'TAIL' || r.verdict === 'FULL')) return done;
  fs.mkdirSync(dir, { recursive: true });
  for (const row of plan.rows) {
    if (row.verdict !== 'TAIL' && row.verdict !== 'FULL') continue;
    const name = `${row.sid}.${row.offset}-${row.size}.tail`;
    const tmp = path.join(dir, `${name}.writing-${process.pid}`);
    const buf = readRange(row.src, row.offset, row.size);

    // The source must not have moved while we read it. Same rule as the gate, applied after the
    // read rather than before it: a stat that still says what it said is the only evidence the
    // bytes in hand are the bytes on disk.
    const after = fs.statSync(row.src);
    if (after.size !== row.size) {
      done.push({ row, ok: false, why: `the source grew while it was being read (${row.size} -> ${after.size}); nothing was written for this seat` });
      continue;
    }
    writeDurable(tmp, buf);
    fs.renameSync(tmp, path.join(dir, name));

    const tailSha = sha256(buf);
    const fullSha = hashRange(row.src, 0, row.size);
    const entry = led.seats[row.sid] || { seat: row.seat, key: row.key, agreed: null, pending: null };
    entry.seat = row.seat;
    entry.key = row.key;
    // E-3: the INCOMING conversation's first timestamp, for the window's identity bar.
    //   offset 0 — the stick now carries this WHOLE file, so its first timestamp is recorded, always.
    //   a delta  — recorded only when the entry LACKS one, and never over one that is set (L059 §9 R-4).
    // The delta case is exact, not a guess: a TAIL row exists only after this export proved the source IS the
    // agreed conversation — the same key (sha256 of this very first timestamped record) and the same prefix sha.
    // Without it, a ledger written before E-3 (tonight's real stick) would show "unknown" for every seat for
    // ever, because every later carry of those seats is a tail.
    if (row.offset === 0 || !entry.firstTimestamp) entry.firstTimestamp = lineTimestamp(row.keyLine);
    entry.pending = {
      from: machine, offset: row.offset, toOffset: row.size,
      tailFile: name, tailSha, fullSha, bytes: buf.length, at: new Date(now).toISOString(),
    };
    led.seats[row.sid] = entry;
    done.push({ row, ok: true, name, tailSha, fullSha });
  }
  writeLedger(stick, led);
  done.transfer = writeTransferSet(stick, led, machine);         // A-2: same step, after the ledger
  // D080: the renames above live in these directories' entries; DONE waits for them too.
  done.flush = flushDirs([dir, path.join(stick, TRANSFER_DIR), stick]);
  return done;
}

/**
 * THE IMPORT PLAN. Reads the stick and THIS machine; decides what would be appended. Writes
 * nothing. This is the half that must be runnable on the far machine before anything lands there.
 */
function planImport(o) {
  const stick = o.stick;
  const machine = o.machine || sync.machineTag();
  const projectsRoot = o.projectsRoot || path.join(os.homedir(), '.claude', 'projects');
  const retireFar = new Set(o.retireFar || []);
  const repair = new Set(o.repair || []);
  const takeStick = new Set(o.takeStick || []);
  const s = seats(o);
  if (!s.seats) return { ok: false, code: 2, why: s.why, rows: [] };
  const led = readLedger(stick);
  const rows = [];

  // P-DIVERGED debt (a): a row that stops before the destination is judged still says what THIS machine holds.
  // Until now NOTHING_PENDING and OURS were pushed before the file was read, so every such row carried
  // localSize: null and localFirstTimestamp: null, and the window showed "this machine's conversation began:
  // unknown" for seats whose files were right there. A read only: no settle wait, and no verdict depends on it.
  const readHere = (row) => {
    try { row.size = fs.statSync(row.dest).size; } catch (_) { return; }
    const k = conversationKey(row.dest);
    if (k.key) { row.key = k.key; row.keyLine = k.line; }
  };

  for (const seat of s.seats) {
    const entry = led.seats[seat.sid];
    const dest = place.paneJsonl(projectsRoot, seat.cwd, seat.sid);
    const row = { ...seat, dest, entry, verdict: null, why: null, tail: null };
    if (!entry || !entry.pending) { row.verdict = 'NOTHING_PENDING'; readHere(row); rows.push(row); continue; }
    const pend = entry.pending;
    row.pending = pend;
    if (pend.from === machine) {
      row.verdict = 'OURS';
      row.why = `this tail was exported BY this machine (${machine}); it is for the other one`;
      readHere(row);
      rows.push(row); continue;
    }
    const tailPath = path.join(stick, LEDGER_DIR, pend.tailFile);
    if (!fs.existsSync(tailPath)) {
      row.verdict = 'REFUSED';
      row.reason = 'TAIL_MISSING';
      row.why = `the ledger names a tail the stick does not hold: ${pend.tailFile}`;
      rows.push(row); continue;
    }
    const tail = fs.readFileSync(tailPath);
    if (sha256(tail) !== pend.tailSha) {
      row.verdict = 'REFUSED';
      row.reason = 'TAIL_DAMAGED';
      row.why = 'the tail on the stick does not match its own recorded sha256 — the carrier damaged it';
      rows.push(row); continue;
    }
    if (tail.length !== pend.toOffset - pend.offset) {
      row.verdict = 'REFUSED';
      row.reason = 'TAIL_LENGTH';
      row.why = `the tail is ${tail.length} bytes but the ledger says it spans ${pend.offset}..${pend.toOffset}`;
      rows.push(row); continue;
    }
    row.tail = tail;
    row.tailPath = tailPath;

    if (!fs.existsSync(dest)) {
      if (pend.offset === 0) { row.verdict = 'FULL'; rows.push(row); continue; }
      row.verdict = 'REFUSED';
      row.reason = 'LOCAL_GONE';
      row.why = `this machine has no file for this seat, but the tail starts at ${pend.offset} — the far end's copy is gone, and a tail cannot rebuild it. Carry it whole: clear this seat from the ledger and export again.`;
      rows.push(row); continue;
    }

    const gate = settledStat(dest);
    if (!gate.st) { row.verdict = 'REFUSED'; row.reason = 'UNSETTLED'; row.why = `destination will not settle — ${gate.why}`; rows.push(row); continue; }
    const size = gate.st.size;
    row.size = size;

    const k = conversationKey(dest);
    if (!k.key) { row.verdict = 'REFUSED'; row.reason = 'NO_KEY'; row.why = `cannot key the destination — ${k.why}`; rows.push(row); continue; }
    row.key = k.key;
    row.keyLine = k.line;

    if (k.key !== entry.key) {
      row.verdict = retireFar.has(seat.sid) ? 'RETIRE_THEN_FULL' : 'REFUSED';
      row.why = retireFar.has(seat.sid)
        ? 'this machine holds a DIFFERENT conversation under this sid; named on the command line, so it steps aside to the attic and the carried one takes its place'
        : `this machine holds a DIFFERENT conversation under this sid (key ${k.key.slice(0, 16)}… vs ${String(entry.key).slice(0, 16)}…). Nothing here can merge two conversations. To let the carried one take the seat, name it: --retire-far ${seat.sid}`;
      if (row.verdict === 'RETIRE_THEN_FULL' && pend.offset !== 0) {
        row.verdict = 'REFUSED';
        row.why = `this machine holds a different conversation AND the tail is a delta from ${pend.offset}; a delta cannot replace a conversation. Export this seat whole first.`;
      }
      if (row.verdict === 'REFUSED') {
        row.reason = 'OTHER_CONVERSATION';
        // `retirable` answers the one question the rehearsal's verdict could not: would naming this
        // seat with --retire-far actually take it? Only a WHOLE carried conversation can replace one.
        // Without this field, a caller that sees "DIFFERENT conversation" and re-runs with
        // --retire-far meets a second refusal it could not have predicted — and `ARRIVING.ps1`,
        // which reads the prose, does exactly that on a delta tail.
        row.retirable = pend.offset === 0;
      }
      rows.push(row); continue;
    }

    // THE PENDING TAIL MUST START WHERE THE AGREED STATE ENDS, and this is checked rather than
    // assumed. The export sets them equal; a ledger in which they differ has been edited, resumed
    // from a half-written state, or written by another version of this tool — and the prefix check
    // below compares a hash taken at `pend.offset` against a hash recorded at `agreed.offset`, so
    // it is only meaningful when they are the same number. Found by a test that built the
    // mismatch, not by reading.
    if (entry.agreed && entry.agreed.offset !== pend.offset) {
      row.verdict = 'REFUSED';
      row.reason = 'LEDGER_INCONSISTENT';
      row.why = `the ledger disagrees with itself: the agreed state ends at ${entry.agreed.offset} but the pending tail starts at ${pend.offset}. Nothing here can tell which is right.`;
      rows.push(row); continue;
    }
    if (size < pend.offset) {
      row.verdict = 'REFUSED';
      row.reason = 'BEHIND';
      row.why = `this machine is BEHIND the agreed state (${size} < ${pend.offset}) — its copy was truncated or replaced since the last carry`;
      rows.push(row); continue;
    }

    const prefix = hashRange(dest, 0, pend.offset);
    if (pend.offset > 0 && prefix !== entry.agreed?.prefixSha) {
      // The content check plan §8 bar (2) asks for. Kept, because a rewritten history is real and
      // this is the only thing that sees it.
      row.verdict = 'REFUSED';
      row.reason = 'HISTORY_REWRITTEN';
      row.why = `this machine's copy DIVERGED inside the agreed prefix at offset ${pend.offset} — its history was rewritten, not appended to`;
      rows.push(row); continue;
    }

    if (size > pend.offset) {
      // ── THE CASE bar (2)'s CONTENT CHECK CANNOT SEE ──
      // The prefix above matched. The file is longer anyway. Two possibilities, and they are told
      // apart by whether the extra bytes ARE the beginning of the tail we are holding:
      //   they are  → an earlier run of this carry was interrupted partway. Repairable.
      //   they are not → this machine took its own turns since the last carry. A fork.
      const extra = size - pend.offset;
      const already = readRange(dest, pend.offset, Math.min(size, pend.toOffset));
      const isPrefixOfTail = extra <= row.tail.length && already.equals(row.tail.subarray(0, already.length));
      if (isPrefixOfTail && extra === row.tail.length) {
        const full = hashRange(dest, 0, size);
        row.verdict = full === pend.fullSha ? 'ALREADY_APPLIED' : 'REFUSED';
        if (row.verdict === 'REFUSED') row.reason = 'APPLIED_BUT_DIFFERENT';
        row.why = full === pend.fullSha
          ? 'this tail is already here, whole and verified; --apply advances the ledger to agree with it (a rehearsal records nothing)'
          : 'the destination holds all of the tail\'s bytes but its full sha256 does not match; something else changed the file';
        rows.push(row); continue;
      }
      if (isPrefixOfTail) {
        row.verdict = repair.has(seat.sid) ? 'REPAIR' : 'INTERRUPTED';
        row.why = repair.has(seat.sid)
          ? `resuming an interrupted carry: ${extra} of ${row.tail.length} tail bytes are already here; the file is copied aside, truncated to ${pend.offset}, and re-appended`
          : `an earlier carry stopped after ${extra} of ${row.tail.length} tail bytes. Repair it by name: --repair ${seat.sid}`;
        rows.push(row); continue;
      }
      // P-DIVERGED D-1 (§2.8): the WHOLE carried file is already here and this machine went on from it. Not a fork:
      // the tail landed (an applier killed after its append, before its ledger write) and the seat then took later
      // turns. `isPrefixOfTail` above cannot see it — the extra is the whole tail PLUS more — so until now it fell
      // through to DIVERGED, and a take would have truncated this machine's genuinely later turns into the attic.
      // Told apart by the whole-span sha the exporter recorded, never by length alone.
      if (size > pend.toOffset && hashRange(dest, 0, pend.toOffset) === pend.fullSha) {
        row.verdict = 'APPLIED_AND_GREW';
        row.why = `the carried tail is already here, whole and verified, and this machine has written ${size - pend.toOffset} bytes after it; --apply advances the ledger to agree at ${pend.toOffset}, and those later bytes then export as an ordinary tail`;
        rows.push(row); continue;
      }
      // §2.2: the keeper's word turns a fork into a take. Only a row that WOULD be DIVERGED — nothing above it.
      if (takeStick.has(seat.sid)) {
        row.verdict = 'RETIRE_THEN_APPEND';
        row.why = `taking the stick's future for this seat, named on the command line: this machine's whole file (${size} B, ${extra} of its own past the shared prefix) is copied to the attic, the seat is truncated to the shared ${pend.offset} B, and the carried tail is appended and verified whole`;
        rows.push(row); continue;
      }
      row.verdict = 'DIVERGED';
      row.why = `this machine has written ${extra} bytes of its OWN since the last carry, on top of the same prefix. Two futures of one conversation cannot be concatenated. Nothing is lost — but which one continues is a decision, not a merge. To continue from the stick's, name it: --take-stick ${seat.sid} (this machine's file goes to the attic, whole).`;
      rows.push(row); continue;
    }

    row.verdict = 'APPEND';
    rows.push(row);
  }
  return { ok: true, code: 0, rows, led, machine, stick, projectsRoot };
}

/**
 * THE RECEIPT THE LAUNCH READS: `<projectsRoot>/../consonance-carried.json` (`~/.claude/` by default).
 *
 * Found 2026-09-14 on L: this import placed all seven seats, then the launch saw a state head
 * authored by D, took MIGRATE, and retired the three fixed seats it had just been handed. The launch
 * decides from the state repo and never saw what the stick did. This file tells it: per sid, the
 * first timestamped record of the conversation placed here (`sync_launch::read_carried` in the app).
 * Merged, never replaced — a seat carried last week stays carried. Written tmp-then-rename.
 */
function carriedPath(projectsRoot) {
  return path.join(path.dirname(projectsRoot), 'consonance-carried.json');
}

function writeCarried(projectsRoot, entries, now) {
  if (!entries.length) return null;
  const p = carriedPath(projectsRoot);
  let rec = { version: 1, seats: {} };
  if (fs.existsSync(p)) {
    rec = JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));   // a broken receipt throws, loudly
    if (!rec.seats || typeof rec.seats !== 'object') throw new Error(`receipt has no seats map: ${p}`);
  }
  for (const e of entries) rec.seats[e.sid] = { seat: e.seat, line: e.line, size: e.size, from: e.from, at: new Date(now).toISOString() };
  const tmp = `${p}.tmp-${process.pid}`;
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(tmp, JSON.stringify(rec, null, 2));
  fs.renameSync(tmp, p);
  return p;
}

/** Append the tails that planImport cleared. */
function applyImport(plan, now) {
  const { stick, led } = plan;
  const done = [];
  const DOES = ['APPEND', 'FULL', 'REPAIR', 'RETIRE_THEN_FULL', 'RETIRE_THEN_APPEND'];
  // ALREADY_APPLIED is SETTLED under --apply: the ledger is brought into agreement with a file that already
  // holds every tail byte and hashes whole to the exporter's record. Until L059 it wrote nothing, and that
  // is a permanent wedge: an import hard-killed after its append but before its ledger write leaves the
  // pending tail on the stick for good — every later rehearsal reads ALREADY_APPLIED (clean), every export
  // of that seat refuses UNIMPORTED_TAIL (so its later turns never reach the other machine), and the
  // launch's carried receipt never names it. The ledger lock closes the CONCURRENT lost update; this closes
  // the killed one. Found at the L059 §6 stop; built because Call 1's "correct by construction" needs it.
  // P-DIVERGED D-1: APPLIED_AND_GREW settles the same way, at the carried span's end rather than the file's.
  const SETTLES = ['ALREADY_APPLIED', 'APPLIED_AND_GREW'];
  if (!plan.rows.some((r) => DOES.includes(r.verdict) || SETTLES.includes(r.verdict))) return done;   // writes nothing
  for (const row of plan.rows) {
    if (SETTLES.includes(row.verdict)) {
      const pend = row.pending;
      // Re-verified now, not trusted from the plan: the file must still hold the whole carried conversation —
      // exactly it (ALREADY_APPLIED), or exactly it followed by this machine's later bytes (APPLIED_AND_GREW).
      const fileSize = fs.statSync(row.dest).size;
      const grew = row.verdict === 'APPLIED_AND_GREW';
      const size = grew ? pend.toOffset : fileSize;
      const full = fileSize >= size ? hashRange(row.dest, 0, size) : '';
      const ok = (grew ? fileSize > pend.toOffset : fileSize === pend.toOffset) && full === pend.fullSha;
      if (ok) {
        const entry = led.seats[row.sid];
        entry.agreed = { offset: size, prefixSha: full, at: new Date(now).toISOString() };
        entry.pending = null;
      }
      done.push({ row, ok, size, full, asideTo: null, settled: true,
        why: ok ? null : `the file changed between the rehearsal and the apply (${fileSize} B / ${String(full).slice(0, 16)}…); the pending tail is left in place` });
      continue;
    }
    if (!DOES.includes(row.verdict)) continue;
    const pend = row.pending;
    let asideTo = null;

    const slug = place.encodeCwd(row.cwd);
    if (row.verdict === 'RETIRE_THEN_FULL') {
      asideTo = atticPath(plan.projectsRoot, slug, row.sid, 'retire-far', now);
      fs.mkdirSync(path.dirname(asideTo), { recursive: true });
      fs.renameSync(row.dest, asideTo);
    }
    if (row.verdict === 'REPAIR') {
      // THE PRE-TRUNCATE COPY IS KEPT — plan §8 bar (5). Truncation is the one step here that can
      // destroy bytes, so the bytes are somewhere else first, in the attic, under a stamped name
      // that no second run can land on.
      asideTo = atticPath(plan.projectsRoot, slug, row.sid, 'pre-truncate', now);
      fs.mkdirSync(path.dirname(asideTo), { recursive: true });
      fs.copyFileSync(row.dest, asideTo);
      fs.truncateSync(row.dest, pend.offset);
    }
    if (row.verdict === 'RETIRE_THEN_APPEND') {
      // P-DIVERGED §2.3 — the keeper's TAKE THE STICK'S. REPAIR's mechanism, started by the keeper's word: this
      // machine's WHOLE file (shared prefix included) is copied to the one retirement address, then the seat is
      // truncated to the shared prefix and the carried tail appended. A copy, never a rename: the prefix stays in
      // place. The copy is read back before the truncate — the truncate is the one step that destroys this
      // machine's future, so it waits for proof that the future is somewhere else, whole.
      asideTo = atticPath(plan.projectsRoot, slug, row.sid, 'take-stick', now);
      fs.mkdirSync(path.dirname(asideTo), { recursive: true });
      fs.copyFileSync(row.dest, asideTo);
      const liveSize = fs.statSync(row.dest).size;
      if (fs.statSync(asideTo).size !== liveSize || hashRange(asideTo, 0, liveSize) !== hashRange(row.dest, 0, liveSize)) {
        done.push({ row, ok: false, size: liveSize, full: null, asideTo,
          why: `the attic copy did not read back equal to this machine's file; nothing was truncated and the seat is exactly as it was (${asideTo})` });
        continue;
      }
      fs.truncateSync(row.dest, pend.offset);
    }

    fs.mkdirSync(path.dirname(row.dest), { recursive: true });
    if (row.verdict === 'FULL' || row.verdict === 'RETIRE_THEN_FULL') fs.writeFileSync(row.dest, row.tail);
    else fs.appendFileSync(row.dest, row.tail);

    // Bar (3): the rejoined file is verified whole, by reading it back — never by trusting that an
    // append of the right length wrote the right bytes.
    const size = fs.statSync(row.dest).size;
    const full = hashRange(row.dest, 0, size);
    const ok = full === pend.fullSha && size === pend.toOffset;
    if (ok) {
      const entry = led.seats[row.sid];
      entry.agreed = { offset: size, prefixSha: full, at: new Date(now).toISOString() };
      entry.pending = null;
    }
    done.push({ row, ok, size, full, asideTo,
      why: ok ? null : `the rejoined file is ${size} B / ${full.slice(0, 16)}… and the ledger expects ${pend.toOffset} B / ${String(pend.fullSha).slice(0, 16)}…` });
  }
  writeLedger(stick, led);
  done.transfer = writeTransferSet(stick, led, plan.machine);    // A-2: the import rewrites the manifest too
  done.flush = flushDirs([path.join(stick, LEDGER_DIR), path.join(stick, TRANSFER_DIR), stick]);   // D080, as the export
  // Only verified-whole seats go on the receipt: a failed rejoin must not be exempt from the retire.
  const receipt = [];
  for (const d of done) {
    if (!d.ok) continue;
    const k = conversationKey(d.row.dest);
    if (k.key) receipt.push({ sid: d.row.sid, seat: d.row.seat, line: k.line, size: d.size, from: d.row.pending.from });
  }
  if (plan.projectsRoot) done.receipt = writeCarried(plan.projectsRoot, receipt, now);
  return done;
}

// ── the command ──────────────────────────────────────────────────────────────────────────────

const mb = (n) => `${(n / 1048576).toFixed(2)} MB`;

// ── D067 P-CARRY-EXCLUDE — a directory carry that leaves build output behind, BY SIGNATURE ─────────────
//
// WHY THIS EXISTS. At 2026-09-14 23:36 a pane's untracked scratch folder rode to work as
// `files/repo-carry/E-scratch-leave-2026-09-14/`, copied BY HAND (its README says so), and 311,754,634 B of
// it — 407.8 MiB allocated on the stick's exFAT, whose clusters are 256 KiB — was Cargo's `target/`. Before
// this door nothing in this repository carried a directory at all, so "exclude target/ from scratch carries"
// had no carry to live in. This is that carry, and the rule inside it.
//
// THE RULE, AND THE RISK IT WAS BUILT AROUND. A directory is left behind because it SAYS what it is, never
// because of what it is CALLED:
//   · it holds a CACHEDIR.TAG whose FIRST 43 OCTETS are the Cache Directory Tagging signature. The spec
//     (bford.info/cachedir) makes the name irrelevant and asks archivers to skip the whole tree;
//     `tar --exclude-caches` is the prior art; cargo writes one into every target/ (the carried one reads
//     "created by cargo"). A leading space, or one octet short, is not the signature.
//   · or it is named node_modules AND holds a package manager's own marker: npm v7+'s hidden lockfile
//     `.package-lock.json` (checked against npm's docs, D067); pnpm's `.modules.yaml`, yarn's
//     `.yarn-integrity` and `.yarn-state.yml` (NOT checked against their docs — added because a missing
//     marker only means junk rides, never that work is lost).
// A folder merely CALLED target or node_modules is CARRIED and listed as a SUSPECT, so a person looks.
//
// WHAT THAT COSTS, both directions, stated rather than found later:
//   · a Cargo target/ that has lost its tag is carried — junk rides, nothing is lost;
//   · real work someone put a CACHEDIR.TAG into is NOT carried. It stays on the source (an exclusion only
//     ever means "not copied"; this door deletes nothing) and its path and reason are printed.
//   · a symbolic link is carried as the link itself (fs.cpSync's default) and never followed. Untested.

const CACHEDIR_SIGNATURE = 'Signature: 8a477f597d28d172789f06886806bc55';
const INSTALL_MARKERS = ['.package-lock.json', '.modules.yaml', '.yarn-integrity', '.yarn-state.yml'];
const SUSPECT_NAMES = ['target', 'node_modules'];

/** Why a directory is generated output, or null. Reads at most 43 bytes; a missing tag is not an error. */
function generatedDirReason(abs, name) {
  let fd = null;
  try { fd = fs.openSync(path.join(abs, 'CACHEDIR.TAG'), 'r'); }
  catch (e) { if (e.code !== 'ENOENT' && e.code !== 'ENOTDIR' && e.code !== 'EISDIR') throw e; }
  if (fd !== null) {
    try {
      const b = Buffer.alloc(CACHEDIR_SIGNATURE.length);
      const n = fs.readSync(fd, b, 0, b.length, 0);
      if (n === b.length && b.toString('latin1') === CACHEDIR_SIGNATURE) {
        return 'holds a CACHEDIR.TAG with the cache-directory signature';
      }
    } finally { fs.closeSync(fd); }
  }
  if (name === 'node_modules') {
    for (const m of INSTALL_MARKERS) if (fs.existsSync(path.join(abs, m))) return `node_modules holding a package manager's marker (${m})`;
  }
  return null;
}

/** The excluded root and everything beneath it: entries (files AND directories, root counted) and apparent bytes. */
function treeSize(abs) {
  const st = fs.lstatSync(abs);
  if (!st.isDirectory()) return { entries: 1, bytes: st.isFile() ? st.size : 0 };
  let entries = 1, bytes = 0;
  for (const name of fs.readdirSync(abs)) {
    const s = treeSize(path.join(abs, name));
    entries += s.entries; bytes += s.bytes;
  }
  return { entries, bytes };
}

/**
 * What a directory carry WOULD copy. Pure over the filesystem it reads; writes nothing.
 * `rel` paths use forward slashes. `line` is the one sentence that makes the rule visible, printed even at zero.
 */
function planDirCarry(src) {
  const files = [], excluded = [], suspects = [];
  const walk = (abs, rel) => {
    for (const name of fs.readdirSync(abs).sort()) {
      const a = path.join(abs, name);
      const r = rel ? `${rel}/${name}` : name;
      const st = fs.lstatSync(a);
      if (st.isDirectory()) {
        const reason = generatedDirReason(a, name);
        if (reason) { const s = treeSize(a); excluded.push({ rel: r, reason, entries: s.entries, bytes: s.bytes }); continue; }
        if (SUSPECT_NAMES.includes(name)) suspects.push({ rel: r, name });
        walk(a, r);
      } else {
        files.push({ rel: r, bytes: st.isFile() ? st.size : 0 });
      }
    }
  };
  walk(src, '');
  const excludedEntries = excluded.reduce((n, e) => n + e.entries, 0);
  const excludedBytes = excluded.reduce((n, e) => n + e.bytes, 0);
  return {
    files, excluded, suspects, excludedEntries, excludedBytes,
    keptBytes: files.reduce((n, f) => n + f.bytes, 0),
    line: `excluded ${excludedEntries} entries, ${excludedBytes} bytes`,
  };
}

/** Copy exactly the plan, refusing to write into anything that exists, then read every carried file back. */
function applyDirCarry(src, dest, plan) {
  const skip = new Set(plan.excluded.map((e) => path.resolve(src, ...e.rel.split('/'))));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true, errorOnExist: true, force: false, preserveTimestamps: true,
    filter: (s) => !skip.has(path.resolve(s)) });
  const mismatched = [];
  for (const f of plan.files) {
    const a = path.join(src, ...f.rel.split('/'));
    const b = path.join(dest, ...f.rel.split('/'));
    let bs = null;
    try { bs = fs.lstatSync(b); } catch (e) { if (e.code !== 'ENOENT') throw e; }
    if (!bs) { mismatched.push({ rel: f.rel, why: 'not written' }); continue; }
    if (!bs.isFile()) continue;                                        // a link is carried as a link, not read through
    const size = fs.statSync(a).size;
    if (bs.size !== size || hashRange(a, 0, size) !== hashRange(b, 0, bs.size)) mismatched.push({ rel: f.rel, why: 'bytes differ' });
  }
  const present = planDirCarry(dest);
  const extra = present.files.map((f) => f.rel).filter((r) => !plan.files.some((f) => f.rel === r));
  for (const r of extra) mismatched.push({ rel: r, why: 'written but not in the plan' });
  return { ok: mismatched.length === 0, mismatched, files: plan.files.length, bytes: plan.keptBytes };
}

function runCarryDir(o, out, no) {
  if (!o.carryDir) return no('--carry-dir needs a source directory', ['--carry-dir <dir> --to <destination> [--apply]']);
  if (o.mode || o.verifySet || o.prune || typeof o.deleteListed === 'string') {
    return no('--carry-dir is its own command; it does not combine with --import, --export, --verify-set or the prune', []);
  }
  if (!o.to) return no('--carry-dir needs a destination', ['--to <destination>']);
  let st = null;
  try { st = fs.statSync(o.carryDir); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (!st || !st.isDirectory()) return no(`no such directory: ${o.carryDir}`, []);
  const src = path.resolve(o.carryDir), dest = path.resolve(o.to);
  if (dest === src || dest.startsWith(src + path.sep)) return no('the destination is inside the source', [dest]);
  if (fs.existsSync(dest)) return no(`the destination already exists: ${dest} — this door never writes into anything already there`, []);

  const plan = planDirCarry(src);
  out(`tail-carry · CARRY-DIR · ${src} -> ${dest}${o.apply ? '' : '   [rehearsal — nothing will be written]'}`);
  out(`  carries ${plan.files.length} file(s), ${plan.keptBytes} bytes`);
  out(plan.line);
  for (const e of plan.excluded) out(`  EXCLUDED  ${e.rel}/  ${e.entries} entries, ${e.bytes} bytes — ${e.reason}`);
  for (const s of plan.suspects) out(`  SUSPECT   ${s.rel}/  named ${s.name} but carries no signature — CARRIED; check it is not a build directory`);
  if (!o.apply) return { ok: true, code: EXIT.OK, outcome: 'REHEARSED', carry: plan };

  const done = applyDirCarry(src, dest, plan);
  if (!done.ok) {
    out(`FAILED — ${done.mismatched.length} file(s) did not carry whole:`);
    for (const m of done.mismatched) out(`  ${m.rel} — ${m.why}`);
    return { ok: false, code: EXIT.SEAT, outcome: 'FAILED', why: 'the carried directory did not read back equal to the plan', carry: plan, carried: done };
  }
  out(`CARRIED — ${done.files} file(s), ${done.bytes} bytes, every one read back equal`);
  return { ok: true, code: EXIT.OK, outcome: 'CARRIED', carry: plan, carried: done };
}

// ── D067 P-PRUNE — tails below the agreed offset: LISTED first, deleted only on a second, separate flag ─────
//
// WHY. A tail `<sid>.<from>-<to>.tail` whose `to` is at or below the ledger's agreed offset holds bytes both
// machines already agree on, and import reads only `pending.tailFile` — so it is never read again. On
// 2026-09-16 at 11:3x the stick held 81 of them, 559,094,957 B, every seat agreed and none pending.
//
// WHY IT IS STILL A DOOR AND NOT A HABIT. The stick's own ledger has been corrupt once
// (`ledger.json.corrupt-20260915T084005`), and a wrong agreed offset would make a tail that is the ONLY copy
// look redundant. So a candidate must pass all of:
//   · its name is exactly `<sid>.<from>-<to>.tail` — torn `.writing-*` files, the ledger, its lock and any
//     `.corrupt-*` copy are never judged by this rule, and each is LISTED with why it was left;
//   · the ledger has an agreed offset for the sid, and `to` is at or below it — straddling or above is kept;
//   · it is not the seat's pending tail, and not a member the transfer manifest names (writeTransferSet names
//     pending tails there, and verify-set counts a missing member as a failure);
//   · THIS MACHINE PROVES IT HOLDS THE AGREED BYTES: its own transcript for that sid is at least the agreed
//     length and its first `agreed.offset` bytes hash to `agreed.prefixSha`. A seat this machine cannot
//     show is never pruned from this machine, whatever the ledger says.
//
// AND IT DELETES ONLY WHAT A PERSON READ. The listing prints a digest of exactly its candidates (name and
// size). `--delete-listed <digest>` takes the ledger lock, lists again, and deletes only when the new digest
// equals the one handed back. A tail that appeared, vanished or changed size since the reading refuses the
// whole run. `--apply` is the carry's word and never deletes; `--delete-listed` alone does nothing.

const TAIL_RE = /^([0-9a-f-]{36})\.(\d+)-(\d+)\.tail$/;
const DIGEST_RE = /^[0-9a-f]{16}$/;

function planPrune(o) {
  const stick = o.stick;
  const led = readLedger(stick);                                       // throws on an unreadable ledger: refuse
  const dir = path.join(stick, LEDGER_DIR);
  const manifestNames = new Set();
  const mp = path.join(stick, TRANSFER_DIR, MANIFEST_NAME);
  if (fs.existsSync(mp)) {
    const man = JSON.parse(fs.readFileSync(mp, 'utf8'));               // throws on an unreadable manifest: refuse
    for (const m of (man.members || [])) manifestNames.add(String((m && m.path) || ''));
  }
  const s = seats(o);
  if (!s.seats) throw new Error(`cannot resolve this machine's seats, so it can prove nothing: ${s.why}`);
  const projectsRoot = o.projectsRoot || path.join(os.homedir(), '.claude', 'projects');

  const proof = new Map();
  const heldHere = (sid, agreed) => {
    if (proof.has(sid)) return proof.get(sid);
    let why = null;
    const seat = s.seats.find((x) => x.sid === sid);
    if (!seat) why = 'this machine cannot show it holds the agreed bytes: it has no seat for this conversation';
    else {
      const dest = place.paneJsonl(projectsRoot, seat.cwd, sid);
      let size = null;
      try { size = fs.statSync(dest).size; } catch (e) { if (e.code !== 'ENOENT') throw e; }
      if (size === null) why = `this machine cannot show it holds the agreed bytes: no transcript at ${dest}`;
      else if (size < agreed.offset) why = `this machine cannot show it holds the agreed bytes: its transcript is ${size} B, the agreed offset is ${agreed.offset} B`;
      else if (hashRange(dest, 0, agreed.offset) !== agreed.prefixSha) why = `this machine cannot show it holds the agreed bytes: its first ${agreed.offset} B do not match the agreed prefix`;
    }
    proof.set(sid, why);
    return why;
  };

  const candidates = [], notCandidates = [];
  const names = fs.existsSync(dir) ? fs.readdirSync(dir).sort() : [];
  for (const name of names) {
    const st = fs.lstatSync(path.join(dir, name));
    if (!st.isFile()) { notCandidates.push({ name, why: 'not a file', bytes: 0 }); continue; }
    const m = name.match(TAIL_RE);
    if (!m) {
      const why = name === LEDGER_NAME ? 'the ledger itself'
        : name === LOCK_NAME ? 'the ledger lock'
        : /\.writing-\d+$/.test(name) ? 'a torn or in-progress write — not a finished tail, so not this rule\'s to judge'
        : 'not a tail file';
      notCandidates.push({ name, why, bytes: st.size });
      continue;
    }
    const sid = m[1], from = Number(m[2]), to = Number(m[3]);
    const entry = led.seats[sid];
    let why = null;
    if (!entry || !entry.agreed || typeof entry.agreed.offset !== 'number') why = 'the ledger has no agreed offset for this conversation';
    else if (entry.pending && entry.pending.tailFile === name) why = 'the pending tail — a carry not yet taken';
    else if (to > entry.agreed.offset) {
      why = from < entry.agreed.offset ? `straddles the agreed offset ${entry.agreed.offset}` : `above the agreed offset ${entry.agreed.offset} — not yet agreed`;
    } else if (manifestNames.has(`${LEDGER_DIR}/${name}`)) why = 'named by the transfer manifest';
    else why = heldHere(sid, entry.agreed);
    if (why) notCandidates.push({ name, why, bytes: st.size });
    else candidates.push({ name, sid, from, to, bytes: st.size });
  }
  const digest = sha256(Buffer.from(candidates.map((c) => `${c.name}\t${c.bytes}`).join('\n'), 'utf8')).slice(0, 16);
  return { candidates, notCandidates, bytes: candidates.reduce((n, c) => n + c.bytes, 0), digest };
}

function printPrune(out, p) {
  out(`  ${p.candidates.length} tail(s) below the agreed offset and held here, ${p.bytes} bytes`);
  for (const c of p.candidates) out(`  DELETABLE  ${c.name}  ${c.bytes} B`);
  for (const x of p.notCandidates) out(`  KEPT       ${x.name}  — ${x.why}`);
  out(`listing digest ${p.digest}`);
}

function runPrune(o, out, no) {
  if (!o.stick) return no('no stick named', ['--stick <path>']);
  if (!fs.existsSync(o.stick)) return no(`no such stick: ${o.stick}`, []);
  if (o.mode || o.apply || o.verifySet || typeof o.carryDir === 'string') {
    return no('--prune-below-agreed is its own command; it does not combine with --import, --export, --apply, --verify-set or --carry-dir',
      ['it deletes only with --delete-listed <the digest its own listing printed>']);
  }
  const deleting = typeof o.deleteListed === 'string';
  if (deleting && !DIGEST_RE.test(o.deleteListed)) return no(`not a listing digest: ${JSON.stringify(o.deleteListed)}`, ['run the listing first; it prints the digest']);
  const machine = o.machine || sync.machineTag();
  out(`tail-carry · PRUNE BELOW AGREED · machine ${machine} · ${o.stick}${deleting ? '' : '   [listing — nothing will be deleted]'}`);

  if (!deleting) {
    let p;
    try { p = planPrune(o); } catch (e) { return no(`cannot list: ${e.message}`, []); }
    printPrune(out, p);
    out('to delete exactly this listing, after reading it:');
    out(`  node dev/tail-carry.js --stick ${o.stick} --prune-below-agreed --delete-listed ${p.digest}`);
    return { ok: true, code: EXIT.OK, outcome: 'LISTED', prune: p };
  }

  const lock = takeLedgerLock(o.stick, { now: o.now, imageOf: o.imageOf });
  if (!lock.ok) {
    const h = lock.holder || {};
    return no(`another run holds the ledger (pid ${h.pid}, ${h.image || h.why || 'unknown image'}) — nothing deleted`, []);
  }
  try {
    let p;
    try { p = planPrune(o); } catch (e) { return no(`cannot list: ${e.message} — nothing deleted`, []); }
    if (p.digest !== o.deleteListed) {
      printPrune(out, p);
      const why = `the listing changed since it was read: you handed back ${o.deleteListed}, it is now ${p.digest} — nothing deleted; read the listing again`;
      out(`REFUSED — ${why}`);
      return { ok: false, code: EXIT.RAN_NOT, outcome: 'LISTING_CHANGED', why, prune: p };
    }
    const deleted = [];
    for (const c of p.candidates) {
      try { fs.unlinkSync(path.join(o.stick, LEDGER_DIR, c.name)); deleted.push(c); }
      catch (e) {
        out(`FAILED — deleting ${c.name}: ${e.code || e.message}. ${deleted.length} of ${p.candidates.length} were deleted before it; the rest are untouched.`);
        return { ok: false, code: EXIT.SEAT, outcome: 'FAILED', why: `could not delete ${c.name}: ${e.code || e.message}`, prune: p, deleted };
      }
    }
    out(`PRUNED — ${deleted.length} tail(s), ${deleted.reduce((n, c) => n + c.bytes, 0)} bytes, exactly the listing ${p.digest}`);
    return { ok: true, code: EXIT.OK, outcome: 'PRUNED', prune: p, deleted };
  } finally {
    lock.release();
  }
}

function run(o) {
  o = o || {};
  const out = o.out || ((s) => console.log(s));
  const apply = !!o.apply;
  const now = o.now || Date.now();
  // Every way this command can decline to run at all is EXIT.RAN_NOT: nothing was read about any seat
  // and nothing was written, so `rows` is empty and the caller has no seat to reason about.
  const no = (why, detail, outcome) => {
    out('');
    out(`REFUSED — ${why}`);
    for (const d of [].concat(detail || [])) out('  ' + d);
    return { ok: false, code: EXIT.RAN_NOT, outcome: outcome || 'CANNOT_RUN', why };
  };

  // D067: the two new doors are their own commands and are decided before any carry direction is.
  if (typeof o.carryDir === 'string') return runCarryDir(o, out, no);
  if (o.prune) return runPrune(o, out, no);
  if (typeof o.deleteListed === 'string') return no('--delete-listed does nothing on its own', ['--prune-below-agreed --delete-listed <digest> — list first, read it, then hand back its digest']);
  if (o.verifySet) {
    if (o.mode) return no('--verify-set is a reading on its own; it does not combine with --import or --export', []);
    const v = verifySet(o.stick);
    out(`tail-carry · VERIFY-SET · ${o.stick}`);
    out(`  code ${v.code} · layout ${v.layout} · missing ${v.missing.length} · mismatched ${v.mismatched.length} · extra ${v.extra.length}`);
    for (const m of v.missing) out(`  MISSING     ${m}`);
    for (const m of v.mismatched) out(`  MISMATCHED  ${m}`);
    if (v.why) out(`  ${v.why}`);
    const outcome = v.code === 0 ? (v.layout === 'older' ? 'OLDER_LAYOUT' : 'VERIFIED') : v.code === 1 ? 'SET_INCOMPLETE' : 'CANNOT_RUN';
    return { ok: v.code === 0, code: v.code, outcome, why: v.why, verify: v };
  }
  if (!o.stick) return no('no stick named', ['--stick <path>']);
  if (!fs.existsSync(o.stick)) return no(`no such stick: ${o.stick}`, []);
  if (o.mode !== 'export' && o.mode !== 'import') return no('say which direction', ['--export (from this machine) or --import (onto this machine)']);

  const machine = o.machine || sync.machineTag();
  out(`tail-carry · ${o.mode.toUpperCase()} · machine ${machine} · ${o.stick}${apply ? '' : '   [rehearsal — nothing will be written]'}`);

  // ── THE APP MUST BE CLOSED TO IMPORT, AND NEED NOT BE TO EXPORT ──
  //
  // Found by running the export rehearsal for real rather than by reasoning about it: seven seats
  // came back clean while Consonance was open, which is correct for a READ and would have been a
  // disaster for a WRITE. An import appends to a file the app has open for a live seat, whose own
  // writer will then append after our bytes — and the seat itself knows nothing about the turns
  // that appeared underneath it.
  //
  // An export is only a read. Its one hazard — the file growing mid-copy — is caught by re-stating
  // the source after the read, so there is no reason to make the keeper close the app to put a
  // tail on a stick. `consonanceRunning` is `place-conversations.js`'s, not a second copy.
  if (o.mode === 'import' && apply) {
    const running = o.appRunning !== undefined ? o.appRunning : place.consonanceRunning();
    if (running === null) return no('cannot tell whether Consonance is running', ['`tasklist` could not be run, so "the app is closed" cannot be certified, and an import writes into files the app holds open.'], 'APP_RUNNING');
    if (running) {
      return no('Consonance is running', [
        'An import appends to transcripts the app has open. Its writer would then append after these',
        'bytes, and the seat would not know. Close the app and run the import again.',
        'The REHEARSAL and the EXPORT do not need it closed — they only read.',
      ], 'APP_RUNNING');
    }
  }

  // A-3: every WRITING run holds the stick's ledger lock from the read that plans it to the last write.
  // A rehearsal takes none — it writes nothing, and the ledger is only ever replaced by rename.
  const lock = apply ? takeLedgerLock(o.stick, { now, imageOf: o.imageOf }) : null;
  if (lock && !lock.ok) {
    const h = lock.holder || {};
    return no(`the stick's ledger is locked by a live ${h.image || 'process'} (pid ${h.pid}, ${h.script || 'unknown script'}, since ${h.at || 'unknown'})`, [
      'Another carry is writing this stick right now. Nothing was read and nothing was written.',
      'This refuses rather than waits, so a stuck writer is visible instead of silent.',
    ], 'LEDGER_LOCKED');
  }
  if (lock && lock.stale) out(`  took over a STALE ledger lock: pid ${lock.stale.pid} (${lock.stale.image || 'unknown image'}, ${lock.stale.script || 'unknown script'}, since ${lock.stale.at || 'unknown'}) is not running it any more`);
  try {
    const res = carryPlanned(o, { out, no, apply, now, machine });
    res.staleLock = lock && lock.stale ? lock.stale : null;
    return res;
  } finally {
    if (lock) lock.release();
  }
}

/** The name the HANDOFF will have AFTER this run's ledger write: every `at` it writes is `now`. */
function handoffAfter(led, now) {
  const nowIso = new Date(now).toISOString();
  const max = ledgerMaxAt(led);
  return `HANDOFF-${(max && max > nowIso ? max : nowIso).slice(0, 10)}.md`;
}

/** The plan, the printout, and the apply — everything `run` does once the gates and the lock are behind it. */
function carryPlanned(o, k) {
  const { out, no, apply, now, machine } = k;
  let plan;
  try { plan = o.mode === 'export' ? planExport({ ...o, machine }) : planImport({ ...o, machine }); }
  catch (e) { return no(e.message, []); }
  if (!plan.ok) return no(plan.why, plan.detail);

  let carry = 0, refused = 0;
  out('');
  for (const r of plan.rows) {
    out(`  ${r.verdict.padEnd(16)} ${r.seat.padEnd(14)} ${r.sid}`);
    if (o.mode === 'export') {
      if (r.verdict === 'TAIL') { out(`                   from offset ${r.offset} of ${r.size}  ->  ${r.bytes} B (${mb(r.bytes)})`); carry += r.bytes; }
      if (r.verdict === 'FULL') { out(`                   the whole file: ${r.bytes} B (${mb(r.bytes)}) — no agreed state yet`); carry += r.bytes; }
      if (r.verdict === 'UP_TO_DATE') out(`                   ${r.size} B, unchanged since the last carry`);
    } else {
      if (r.pending) out(`                   tail ${r.pending.offset}..${r.pending.toOffset} (${mb(r.pending.bytes)}) from ${r.pending.from}`);
      if (r.verdict === 'APPEND') { out(`                   this machine is at ${r.size} B = the agreed state; appending leaves ${r.pending.toOffset} B`); carry += r.tail.length; }
      if (r.verdict === 'FULL') { out(`                   this machine has no file; the tail IS the conversation`); carry += r.tail.length; }
      if (r.verdict === 'RETIRE_THEN_APPEND') { out(`                   this machine's ${r.size} B go to the attic whole; the seat continues from the shared ${r.pending.offset} B to ${r.pending.toOffset} B`); carry += r.tail.length; }
    }
    if (r.why) for (const line of String(r.why).match(/.{1,96}(\s|$)/g) || [r.why]) out(`                   ${line.trim()}`);
    // INTERRUPTED was missing from this list until 2026-09-14, so a rehearsal over an interrupted
    // carry exited 0 — "nothing to decide" — over a seat that had not carried and needed --repair.
    if (STOPS.includes(r.verdict)) refused++;
  }

  out('');
  out(`  ${carry} bytes (${mb(carry)}) would ${o.mode === 'export' ? 'go onto the stick' : 'be appended here'} · ${refused} seat(s) refused`);

  const wouldCarry = plan.rows.some((r) => CARRIES[o.mode].includes(r.verdict));
  if (!apply) {
    out('');
    out('  Rehearsal only. Nothing was written. Add --apply to do it.');
    const outcome = refused ? 'STOPPED' : (wouldCarry ? 'REHEARSED' : 'NOTHING_TO_DO');
    return { ok: refused === 0, code: refused ? EXIT.SEAT : EXIT.OK, outcome, why: null, plan };
  }

  // The stick's typed handoffs live beside the generated one. A carry whose HANDOFF name would land on a
  // file a person wrote refuses BEFORE any seat is written, rather than after the seats and before the
  // manifest — the real stick holds a hand-written HANDOFF-2026-09-12.md.
  if (wouldCarry) {
    const target = path.join(o.stick, handoffAfter(plan.led, now));
    if (foreignHandoff(target)) {
      return no(`${path.basename(target)} on the stick was written by a person, and this carry would regenerate it`, [
        'Rename or move that file, then run again. Nothing was written.',
      ]);
    }
  }
  let done;
  try {
    done = o.mode === 'export' ? applyExport(plan, now) : applyImport(plan, now);
  } catch (e) {
    if (!(e instanceof FlushError)) throw e;
    // D080: a named NOT DONE. What was written may not be on the device, so nothing here is reported as carried.
    out('');
    out(`  NOT DONE — ${e.message}`);
    out('  The stick may not hold what was just written. Do not unplug it as though this carried: run it again, and on');
    out('  the other machine check the set (--verify-set) before trusting it.');
    return { ok: false, code: EXIT.SEAT, outcome: 'NOT_FLUSHED', why: `a flush to the stick failed: ${e.message}`, plan };
  }
  out('');
  for (const f of done.flush || []) {
    if (f.result !== 'flushed') out(`  directory ${f.dir}: flush ${f.result} — the files in it were flushed; its entries were not confirmed`);
  }
  let bad = 0;
  for (const d of done) {
    if (!d.ok) { bad++; out(`  FAILED  ${d.row.sid}  ${d.why}`); continue; }
    if (o.mode === 'export') out(`  wrote   ${d.name}  sha256 ${d.tailSha.slice(0, 16)}…  (file now ${d.fullSha.slice(0, 16)}…)`);
    else {
      if (d.asideTo) out(`  aside   ${d.asideTo}`);
      if (d.settled) out(`  advanced ${d.row.dest}  ${d.size} B  sha256 ${d.full.slice(0, 16)}…  the tail was already here; the ledger ADVANCED to agree`);
      else out(`  landed  ${d.row.dest}  ${d.size} B  sha256 ${d.full.slice(0, 16)}…  VERIFIED WHOLE`);
    }
  }
  if (!done.length) out('  nothing to write.');
  if (done.receipt) out(`  receipt ${done.receipt}  (the launch keeps these conversations through a migrate)`);
  const outcome = bad ? 'FAILED' : refused ? 'STOPPED' : done.some((d) => d.ok) ? 'CARRIED' : 'NOTHING_TO_DO';
  return { ok: bad === 0 && refused === 0, code: (bad || refused) ? EXIT.SEAT : EXIT.OK, outcome, why: null, plan, done, flush: done.flush || null };
}

/** First timestamp of a key line, or null. */
function lineTimestamp(line) {
  if (!line) return null;
  try { const o = JSON.parse(line); return typeof o.timestamp === 'string' ? o.timestamp : null; } catch (_) { return null; }
}

/**
 * THE --json PROJECTION. Every row has EVERY field below, every time — `null` where it does not
 * apply, never absent. A field that is sometimes missing is a field a caller has to guess about,
 * and the internal rows carry things that must not cross a process boundary at all (`tail` is a
 * Buffer holding the carried bytes; `entry` is the whole ledger record).
 *
 *   seat, sid, kind            who. `kind` is "fixed" or "pane" — the app's retire rule forks on it.
 *   verdict                    one of the verdicts in the packet's §2, per direction
 *   reason                     non-null EXACTLY when verdict is REFUSED; one of REASONS
 *   why                        prose for a human; never branch on it
 *   stops                      true for REFUSED, DIVERGED, INTERRUPTED, ABSENT_HERE: this seat will
 *                              not carry and needs a decision
 *   carries                    true when this seat moves bytes (or, in a rehearsal, would)
 *   bytes                      bytes this seat carries; 0 when it does not — EXCEPT a DIVERGED import row, where it
 *                              is the stick's tail for the seat, the size of the future a take would bring (P-DIVERGED D-7)
 *   offset, toOffset           the byte span of the tail, or null when there is none to name
 *   path                       this machine's transcript for the seat: the source on export, the
 *                              destination on import
 *   localSize                  that file's size, or null when it does not exist or was not read
 *   localFirstTimestamp        that file's first record carrying a "timestamp", or null
 *   carriedFirstTimestamp      the first timestamp of the conversation THE STICK carries for this seat, as
 *                              the ledger recorded it at a full (offset 0) export; null when it never did
 *                              (L059 E-3). The window's identity bar reads this against localFirstTimestamp.
 *   exportedAt, exportedFrom   import only: when and by which machine the pending tail was exported
 *   retirable                  import OTHER_CONVERSATION only: whether --retire-far would take it.
 *                              null on every other row.
 *   takeable                   import only: true on a DIVERGED row — --take-stick would take it; null otherwise (P-DIVERGED §2.4)
 *   ownBytes                   import only: the bytes THIS machine wrote of its own — past the shared prefix on DIVERGED
 *                              and RETIRE_THEN_APPEND, past the carried span on APPLIED_AND_GREW; null otherwise
 *   result                    --apply only, and only for a seat that was written — or, since L059, an
 *                              ALREADY_APPLIED seat whose ledger was ADVANCED (its file untouched):
 *                              { ok, why, size, sha256, aside, tailFile, advanced }
 *                              advanced = the agreed state was recorded for this seat by this run (import
 *                              only; always false on export, which records a pending tail, not agreement)
 *
 * ARRIVING.ps1's retire rule needs exactly `kind`, `reason`, `retirable`, `localFirstTimestamp` and
 * `exportedAt`, and until now it had to scrape two of them out of wrapped prose and re-read the other
 * two from the disk by a recursive search that is not guaranteed to open the file this tool judged.
 */
function toJson(res, o) {
  const mode = o.mode === 'export' || o.mode === 'import' ? o.mode : null;
  const plan = res.plan;
  const done = res.done || [];
  const bySid = new Map(done.map((d) => [d.row.sid, d]));
  const rows = !plan ? [] : plan.rows.map((r) => {
    const carries = CARRIES[mode].includes(r.verdict);
    const pend = mode === 'import' ? (r.pending || null) : null;
    let bytes = 0, offset = null, toOffset = null;
    if (mode === 'export' && carries) { bytes = r.bytes; offset = r.offset; toOffset = r.size; }
    if (mode === 'import' && pend) { offset = pend.offset; toOffset = pend.toOffset; if (carries) bytes = r.tail.length; }
    // P-DIVERGED D-7: a DIVERGED row names the tail the stick would give it, so the window can show both futures'
    // sizes. It still carries nothing (`carries` false) — this is the one row where bytes is not "bytes moved".
    if (mode === 'import' && pend && r.verdict === 'DIVERGED') bytes = typeof pend.bytes === 'number' ? pend.bytes : pend.toOffset - pend.offset;
    // §2.4: ownBytes — what THIS machine wrote of its own. Past the shared prefix for a fork or a take; past the
    // carried span for a seat that already holds it and went on (D-1).
    let ownBytes = null;
    if (mode === 'import' && pend && typeof r.size === 'number') {
      if (r.verdict === 'DIVERGED' || r.verdict === 'RETIRE_THEN_APPEND') ownBytes = r.size - pend.offset;
      if (r.verdict === 'APPLIED_AND_GREW') ownBytes = r.size - pend.toOffset;
    }
    const d = bySid.get(r.sid);
    return {
      seat: r.seat,
      sid: r.sid,
      kind: r.kind,
      verdict: r.verdict,
      reason: r.verdict === 'REFUSED' ? (r.reason || null) : null,
      why: r.why || null,
      stops: STOPS.includes(r.verdict),
      carries,
      bytes,
      offset,
      toOffset,
      path: mode === 'export' ? r.src : r.dest,
      localSize: typeof r.size === 'number' ? r.size : null,
      localFirstTimestamp: lineTimestamp(r.keyLine),
      carriedFirstTimestamp: r.entry && r.entry.firstTimestamp ? r.entry.firstTimestamp : null,
      exportedAt: pend ? (pend.at || null) : null,
      exportedFrom: pend ? (pend.from || null) : null,
      retirable: mode === 'import' && r.verdict === 'REFUSED' && r.reason === 'OTHER_CONVERSATION' ? !!r.retirable : null,
      takeable: mode === 'import' && r.verdict === 'DIVERGED' ? true : null,
      ownBytes,
      result: !d ? null : mode === 'export'
        ? { ok: d.ok, why: d.why || null, size: d.ok ? d.row.size : null, sha256: d.fullSha || null, aside: null, tailFile: d.name || null, advanced: false }
        : { ok: d.ok, why: d.why || null, size: typeof d.size === 'number' ? d.size : null, sha256: d.full || null, aside: d.asideTo || null, tailFile: null,
            // b258fc2: the row SAYS the ledger advanced — true exactly when this run recorded the agreed state
            // for the seat, whether by writing bytes or by settling a tail that was already there.
            advanced: d.ok === true },
    };
  });
  return {
    tool: 'tail-carry',
    contract: CONTRACT_VERSION,
    mode,
    apply: !!o.apply,
    machine: plan ? plan.machine : null,
    stick: o.stick || null,
    code: res.code,
    outcome: res.outcome,
    why: res.why || null,
    rows,
    receipt: (done && done.receipt) || null,
    staleLock: res.staleLock || null,
    flush: res.flush || null,                                    // D080: [{ dir, result }] after an --apply, else null
  };
}

/**
 * The command line. `io` is injectable so a test can capture both streams without spawning.
 *
 * **In --json mode NOTHING reaches stdout except the one object**: every human line goes to stderr,
 * a bad argument still produces an object (code 2), and an exception nobody anticipated still
 * produces an object (code 3) instead of a stack trace and an exit 1 that reads like "a seat stopped".
 * `--json` is found by a pre-scan, so it governs the output even when the argument that fails comes
 * before it. `--help` is the one exception: it is not a run, it prints usage, and a program never asks.
 */
function main(argv, io, fixture) {
  io = io || { stdout: (s) => process.stdout.write(s), stderr: (s) => process.stderr.write(s) };
  const json = argv.includes('--json');
  const human = (s) => (json ? io.stderr : io.stdout)(`${s}\n`);
  // `fixture` is a TEST SEAM, named rather than buried — the same shape as close.js's injected
  // privacy check and place-conversations.js's injected apply. It carries the fixture machine's roots
  // and `appRunning` so the real argument parsing and the real stdout discipline can be exercised
  // against a fake machine. The CLI never passes it; there is no flag and no environment variable.
  const o = Object.assign({ mode: null, stick: null, apply: false, retireFar: [], repair: [], takeStick: [], carryDir: null, to: null, prune: false, deleteListed: null, json, out: human }, fixture || {});
  // --verify-set has its own object (§3 as re-ruled), found by a pre-scan for the same reason --json is:
  // a bad argument or a crash must still produce the shape the caller asked for.
  const verifying = argv.includes('--verify-set');
  const finish = (res) => {
    if (json && verifying) {
      const v = res.verify || { code: res.code, layout: null, missing: [], mismatched: [], extra: [], why: res.why || null };
      io.stdout(`${JSON.stringify({
        tool: 'tail-carry', contract: CONTRACT_VERSION, mode: 'verify-set', stick: o.stick || null,
        code: res.code, layout: v.layout, missing: v.missing, mismatched: v.mismatched, extra: v.extra, why: res.why || v.why || null,
      })}\n`);
    } else if (json && typeof o.carryDir === 'string') {
      const c = res.carry || null;
      io.stdout(`${JSON.stringify({
        tool: 'tail-carry', contract: CONTRACT_VERSION, mode: 'carry-dir', src: o.carryDir, to: o.to || null,
        code: res.code, outcome: res.outcome, why: res.why || null,
        files: c ? c.files.length : 0, keptBytes: c ? c.keptBytes : 0,
        excludedEntries: c ? c.excludedEntries : 0, excludedBytes: c ? c.excludedBytes : 0, line: c ? c.line : null,
        excluded: c ? c.excluded : [], suspects: c ? c.suspects : [], carried: res.carried || null,
      })}\n`);
    } else if (json && o.prune) {
      const p = res.prune || null;
      io.stdout(`${JSON.stringify({
        tool: 'tail-carry', contract: CONTRACT_VERSION, mode: 'prune-below-agreed', stick: o.stick || null,
        code: res.code, outcome: res.outcome, why: res.why || null,
        digest: p ? p.digest : null, bytes: p ? p.bytes : 0,
        candidates: p ? p.candidates : [], notCandidates: p ? p.notCandidates : [], deleted: res.deleted || [],
      })}\n`);
    } else if (json) {
      io.stdout(`${JSON.stringify(toJson(res, o))}\n`);
    }
    return res.code;
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--export') o.mode = 'export';
    else if (a === '--import') o.mode = 'import';
    else if (a === '--stick') o.stick = argv[++i];
    else if (a === '--apply') o.apply = true;
    else if (a === '--json') { /* found by the pre-scan */ }
    else if (a === '--verify-set') o.verifySet = true;
    else if (a === '--retire-far') o.retireFar.push(argv[++i]);
    else if (a === '--repair') o.repair.push(argv[++i]);
    else if (a === '--take-stick') o.takeStick.push(argv[++i]);
    else if (a === '--carry-dir') o.carryDir = argv[++i] || '';
    else if (a === '--to') o.to = argv[++i] || '';
    else if (a === '--prune-below-agreed') o.prune = true;
    else if (a === '--delete-listed') o.deleteListed = argv[++i] || '';
    else if (a === '--help' || a === '-h') {
      io.stdout('node dev/tail-carry.js --stick <path> (--export|--import) [--apply] [--repair <sid>] [--retire-far <sid>] [--take-stick <sid>] [--json]\n' +
                'node dev/tail-carry.js --stick <path> --verify-set [--json]\n' +
                'node dev/tail-carry.js --carry-dir <dir> --to <destination> [--apply] [--json]\n' +
                'node dev/tail-carry.js --stick <path> --prune-below-agreed [--delete-listed <digest>] [--json]\n');
      return 0;
    } else {
      io.stderr(`unknown argument: ${a}\n`);
      return finish({ code: EXIT.RAN_NOT, outcome: 'CANNOT_RUN', why: `unknown argument: ${a}` });
    }
  }

  let res;
  try { res = run(o); }
  catch (e) {
    io.stderr(`CRASHED — ${e && e.stack ? e.stack : e}\n`);
    res = { code: EXIT.CRASHED, outcome: 'CRASHED', why: String(e && e.message ? e.message : e) };
  }
  return finish(res);
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = {
  settledStat, hashRange, readRange, conversationKey, seats, readLedger, writeLedger, atticPath, atticStamp,
  planExport, applyExport, planImport, applyImport, run, main, toJson, sha256, stamp, carriedPath, writeCarried,
  LEDGER_DIR, LEDGER_NAME, LEDGER_VERSION, CONTRACT_VERSION, EXIT, REASONS, STOPS, CARRIES,
  TRANSFER_DIR, MANIFEST_NAME, LOCK_NAME, GENERATED_MARK, pidImage, holderLive, takeLedgerLock, ledgerMaxAt,
  handoffName, handoffAfter, renderHandoff, writeTransferSet, verifySet, foreignHandoff,
  CACHEDIR_SIGNATURE, INSTALL_MARKERS, planDirCarry, applyDirCarry, planPrune, IO,
};
