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
// Exit 0 = nothing refused. Exit 1 = at least one seat refused, or a verification failed.
// Exit 2 = nothing to carry against (no stick, no roster, no seats).
//
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
  fs.writeFileSync(tmp, JSON.stringify(led, null, 2) + '\n');
  fs.renameSync(tmp, ledgerPath(stick));
}

const stamp = (now) => new Date(now).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');

/**
 * A stamped path beside a file that nothing can land on twice.
 *
 * Stamped, then counted if the stamped name is taken. Same shape and same reason as
 * `place-conversations.js`'s `retiredPath`: `main.rs:835-836` is the scar where a FIXED archive
 * name let one retirement overwrite another. Here it guards the ONE step in this file that can
 * destroy bytes — the truncate in a repair — so the counter is not decoration.
 */
function asidePath(dest, suffix, now, exists) {
  exists = exists || fs.existsSync;
  const base = `${dest}.${suffix}-${stamp(now)}`;
  if (!exists(base)) return base;
  for (let n = 2; n < 1000; n++) {
    const p = `${base}-${n}`;
    if (!exists(p)) return p;
  }
  throw new Error(`cannot find an unused name beside ${dest}`);
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
    const row = { ...seat, src, verdict: null, why: null, offset: 0, size: 0, bytes: 0, key: null };
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
    if (!gate.st) { row.verdict = 'REFUSED'; row.why = `source will not settle — ${gate.why}`; rows.push(row); continue; }
    row.size = gate.st.size;

    const k = conversationKey(src);
    if (!k.key) { row.verdict = 'REFUSED'; row.why = `cannot key this transcript — ${k.why}`; rows.push(row); continue; }
    row.key = k.key;

    // A pending tail from the OTHER machine that nobody has imported yet must not be overwritten.
    if (entry && entry.pending && entry.pending.from !== machine) {
      row.verdict = 'REFUSED';
      row.why = `the stick still carries an unimported tail from ${entry.pending.from} — import it on the machine it is for before exporting over it`;
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
      row.why = `this sid holds a DIFFERENT conversation than the one the stick agreed on (key ${k.key.slice(0, 16)}… vs ${String(entry.key).slice(0, 16)}…)`;
      rows.push(row); continue;
    }
    const agreed = entry.agreed;
    if (row.size < agreed.offset) {
      row.verdict = 'REFUSED';
      row.why = `the source is SHORTER than the agreed state (${row.size} < ${agreed.offset}) — a transcript that shrank is not append-only and nothing here can repair it`;
      rows.push(row); continue;
    }
    const prefix = hashRange(src, 0, agreed.offset);
    if (prefix !== agreed.prefixSha) {
      row.verdict = 'REFUSED';
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
    fs.writeFileSync(tmp, buf);
    fs.renameSync(tmp, path.join(dir, name));

    const tailSha = sha256(buf);
    const fullSha = hashRange(row.src, 0, row.size);
    const entry = led.seats[row.sid] || { seat: row.seat, key: row.key, agreed: null, pending: null };
    entry.seat = row.seat;
    entry.key = row.key;
    entry.pending = {
      from: machine, offset: row.offset, toOffset: row.size,
      tailFile: name, tailSha, fullSha, bytes: buf.length, at: new Date(now).toISOString(),
    };
    led.seats[row.sid] = entry;
    done.push({ row, ok: true, name, tailSha, fullSha });
  }
  writeLedger(stick, led);
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
  const s = seats(o);
  if (!s.seats) return { ok: false, code: 2, why: s.why, rows: [] };
  const led = readLedger(stick);
  const rows = [];

  for (const seat of s.seats) {
    const entry = led.seats[seat.sid];
    const dest = place.paneJsonl(projectsRoot, seat.cwd, seat.sid);
    const row = { ...seat, dest, entry, verdict: null, why: null, tail: null };
    if (!entry || !entry.pending) { row.verdict = 'NOTHING_PENDING'; rows.push(row); continue; }
    const pend = entry.pending;
    row.pending = pend;
    if (pend.from === machine) {
      row.verdict = 'OURS';
      row.why = `this tail was exported BY this machine (${machine}); it is for the other one`;
      rows.push(row); continue;
    }
    const tailPath = path.join(stick, LEDGER_DIR, pend.tailFile);
    if (!fs.existsSync(tailPath)) {
      row.verdict = 'REFUSED';
      row.why = `the ledger names a tail the stick does not hold: ${pend.tailFile}`;
      rows.push(row); continue;
    }
    const tail = fs.readFileSync(tailPath);
    if (sha256(tail) !== pend.tailSha) {
      row.verdict = 'REFUSED';
      row.why = 'the tail on the stick does not match its own recorded sha256 — the carrier damaged it';
      rows.push(row); continue;
    }
    if (tail.length !== pend.toOffset - pend.offset) {
      row.verdict = 'REFUSED';
      row.why = `the tail is ${tail.length} bytes but the ledger says it spans ${pend.offset}..${pend.toOffset}`;
      rows.push(row); continue;
    }
    row.tail = tail;
    row.tailPath = tailPath;

    if (!fs.existsSync(dest)) {
      if (pend.offset === 0) { row.verdict = 'FULL'; rows.push(row); continue; }
      row.verdict = 'REFUSED';
      row.why = `this machine has no file for this seat, but the tail starts at ${pend.offset} — the far end's copy is gone, and a tail cannot rebuild it. Carry it whole: clear this seat from the ledger and export again.`;
      rows.push(row); continue;
    }

    const gate = settledStat(dest);
    if (!gate.st) { row.verdict = 'REFUSED'; row.why = `destination will not settle — ${gate.why}`; rows.push(row); continue; }
    const size = gate.st.size;
    row.size = size;

    const k = conversationKey(dest);
    if (!k.key) { row.verdict = 'REFUSED'; row.why = `cannot key the destination — ${k.why}`; rows.push(row); continue; }
    row.key = k.key;

    if (k.key !== entry.key) {
      row.verdict = retireFar.has(seat.sid) ? 'RETIRE_THEN_FULL' : 'REFUSED';
      row.why = retireFar.has(seat.sid)
        ? 'this machine holds a DIFFERENT conversation under this sid; named on the command line, so it steps aside to a stamped path and the carried one takes its place'
        : `this machine holds a DIFFERENT conversation under this sid (key ${k.key.slice(0, 16)}… vs ${String(entry.key).slice(0, 16)}…). Nothing here can merge two conversations. To let the carried one take the seat, name it: --retire-far ${seat.sid}`;
      if (row.verdict === 'RETIRE_THEN_FULL' && pend.offset !== 0) {
        row.verdict = 'REFUSED';
        row.why = `this machine holds a different conversation AND the tail is a delta from ${pend.offset}; a delta cannot replace a conversation. Export this seat whole first.`;
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
      row.why = `the ledger disagrees with itself: the agreed state ends at ${entry.agreed.offset} but the pending tail starts at ${pend.offset}. Nothing here can tell which is right.`;
      rows.push(row); continue;
    }
    if (size < pend.offset) {
      row.verdict = 'REFUSED';
      row.why = `this machine is BEHIND the agreed state (${size} < ${pend.offset}) — its copy was truncated or replaced since the last carry`;
      rows.push(row); continue;
    }

    const prefix = hashRange(dest, 0, pend.offset);
    if (pend.offset > 0 && prefix !== entry.agreed?.prefixSha) {
      // The content check plan §8 bar (2) asks for. Kept, because a rewritten history is real and
      // this is the only thing that sees it.
      row.verdict = 'REFUSED';
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
        row.why = full === pend.fullSha
          ? 'this tail is already here, whole and verified — nothing to do'
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
      row.verdict = 'DIVERGED';
      row.why = `this machine has written ${extra} bytes of its OWN since the last carry, on top of the same prefix. Two futures of one conversation cannot be concatenated. Nothing is lost — but which one continues is a decision, not a merge.`;
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
  const DOES = ['APPEND', 'FULL', 'REPAIR', 'RETIRE_THEN_FULL'];
  if (!plan.rows.some((r) => DOES.includes(r.verdict))) return done;   // carries nothing, writes nothing
  for (const row of plan.rows) {
    if (!DOES.includes(row.verdict)) continue;
    const pend = row.pending;
    let asideTo = null;

    if (row.verdict === 'RETIRE_THEN_FULL') {
      asideTo = asidePath(row.dest, 'retired', now);
      fs.renameSync(row.dest, asideTo);
    }
    if (row.verdict === 'REPAIR') {
      // THE PRE-TRUNCATE COPY IS KEPT — plan §8 bar (5). Truncation is the one step here that can
      // destroy bytes, so the bytes are somewhere else first, under a stamped name that no second
      // run can land on.
      asideTo = asidePath(row.dest, 'pre-truncate', now);
      fs.copyFileSync(row.dest, asideTo);
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

function run(o) {
  o = o || {};
  const out = o.out || ((s) => console.log(s));
  const apply = !!o.apply;
  const now = o.now || Date.now();
  const no = (why, detail, code) => {
    out('');
    out(`REFUSED — ${why}`);
    for (const d of [].concat(detail || [])) out('  ' + d);
    return { ok: false, code: code === undefined ? 1 : code, why };
  };

  if (!o.stick) return no('no stick named', ['--stick <path>'], 2);
  if (!fs.existsSync(o.stick)) return no(`no such stick: ${o.stick}`, [], 2);
  if (o.mode !== 'export' && o.mode !== 'import') return no('say which direction', ['--export (from this machine) or --import (onto this machine)'], 2);

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
    if (running === null) return no('cannot tell whether Consonance is running', ['`tasklist` could not be run, so "the app is closed" cannot be certified, and an import writes into files the app holds open.']);
    if (running) {
      return no('Consonance is running', [
        'An import appends to transcripts the app has open. Its writer would then append after these',
        'bytes, and the seat would not know. Close the app and run the import again.',
        'The REHEARSAL and the EXPORT do not need it closed — they only read.',
      ]);
    }
  }

  let plan;
  try { plan = o.mode === 'export' ? planExport({ ...o, machine }) : planImport({ ...o, machine }); }
  catch (e) { return no(e.message, [], 2); }
  if (!plan.ok) return no(plan.why, plan.detail, plan.code);

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
    }
    if (r.why) for (const line of String(r.why).match(/.{1,96}(\s|$)/g) || [r.why]) out(`                   ${line.trim()}`);
    if (['REFUSED', 'DIVERGED', 'ABSENT_HERE'].includes(r.verdict)) refused++;
  }

  out('');
  out(`  ${carry} bytes (${mb(carry)}) would ${o.mode === 'export' ? 'go onto the stick' : 'be appended here'} · ${refused} seat(s) refused`);

  if (!apply) {
    out('');
    out('  Rehearsal only. Nothing was written. Add --apply to do it.');
    return { ok: refused === 0, code: refused ? 1 : 0, plan };
  }

  const done = o.mode === 'export' ? applyExport(plan, now) : applyImport(plan, now);
  out('');
  let bad = 0;
  for (const d of done) {
    if (!d.ok) { bad++; out(`  FAILED  ${d.row.sid}  ${d.why}`); continue; }
    if (o.mode === 'export') out(`  wrote   ${d.name}  sha256 ${d.tailSha.slice(0, 16)}…  (file now ${d.fullSha.slice(0, 16)}…)`);
    else {
      if (d.asideTo) out(`  aside   ${d.asideTo}`);
      out(`  landed  ${d.row.dest}  ${d.size} B  sha256 ${d.full.slice(0, 16)}…  VERIFIED WHOLE`);
    }
  }
  if (!done.length) out('  nothing to write.');
  if (done.receipt) out(`  receipt ${done.receipt}  (the launch keeps these conversations through a migrate)`);
  return { ok: bad === 0 && refused === 0, code: (bad || refused) ? 1 : 0, plan, done };
}

function main(argv) {
  const o = { mode: null, stick: null, apply: false, retireFar: [], repair: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--export') o.mode = 'export';
    else if (a === '--import') o.mode = 'import';
    else if (a === '--stick') o.stick = argv[++i];
    else if (a === '--apply') o.apply = true;
    else if (a === '--retire-far') o.retireFar.push(argv[++i]);
    else if (a === '--repair') o.repair.push(argv[++i]);
    else if (a === '--help' || a === '-h') {
      console.log('node dev/tail-carry.js --stick <path> (--export|--import) [--apply] [--repair <sid>] [--retire-far <sid>]');
      return 0;
    } else { console.error(`unknown argument: ${a}`); return 2; }
  }
  return run(o).code;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = {
  settledStat, hashRange, readRange, conversationKey, seats, readLedger, writeLedger, asidePath,
  planExport, applyExport, planImport, applyImport, run, main, sha256, stamp, carriedPath, writeCarried,
  LEDGER_DIR, LEDGER_NAME, LEDGER_VERSION,
};
