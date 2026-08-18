/* Tests for head-watch.js's pure core — the classifier that discriminates the head arm from
 * the shrink arm, which is the entire point of the instrument. */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const { classify, fnv1a } = require('./head-watch.js');

const state = (len, bytes) => ({ len, head: fnv1a(Buffer.from(bytes)), buf: Buffer.from(bytes) });

test('fnv1a matches the Rust constants: empty input is the FNV offset basis', () => {
  // main.rs fnv1a starts at 0xcbf2_9ce4_8422_2325 and multiplies by 0x100000001b3; an empty
  // buffer must therefore hash to the basis itself. The nonempty case was verified live
  // against a stored tailer-offsets.json record before this tool shipped (head 145275...416).
  assert.strictEqual(fnv1a(Buffer.alloc(0)), '14695981039346656037');
});

test('ordinary growth — appends — is not an event', () => {
  assert.deepStrictEqual(classify(state(100, 'abc'), state(200, 'abc')), []);
});

test('a changed head is a head-flip carrying the first differing byte', () => {
  const ev = classify(state(100, 'abcdef'), state(100, 'abXdef'));
  assert.strictEqual(ev.length, 1);
  assert.strictEqual(ev[0].event, 'head-flip');
  assert.strictEqual(ev[0].firstDiffByte, 2);
  assert.match(ev[0].arm, /head arm/);
});

test('a shorter file is a shrink naming the other reset arm', () => {
  const ev = classify(state(200, 'abc'), state(150, 'abc'));
  assert.strictEqual(ev.length, 1);
  assert.strictEqual(ev[0].event, 'shrink');
  assert.match(ev[0].arm, /shrink arm/);
});

test('a rewrite that shrinks AND changes the head reports both arms', () => {
  const ev = classify(state(200, 'abcdef'), state(150, 'zzzzzz'));
  assert.deepStrictEqual(ev.map(e => e.event).sort(), ['head-flip', 'shrink']);
});

test('disappearance and return are their own events, not silence', () => {
  assert.deepStrictEqual(classify(state(100, 'abc'), null).map(e => e.event), ['gone']);
  assert.deepStrictEqual(classify(null, state(100, 'abc')).map(e => e.event), ['back']);
  assert.deepStrictEqual(classify(null, null), []);
});

/* ── the single-instance lock ────────────────────────────────────────────────
 * Added 2026-08-18 when this became a detached scheduled task. Before that "one watcher" held
 * by accident, because a human started it. Now the scheduler starts one at logon and any
 * hand-start would make two appending to the SAME ledger, so a head-flip lands twice and the
 * duplicate reads as two events rather than one seen twice.
 *
 * The stale case is not hypothetical: the 2026-08-18 relaunch was missed precisely because the
 * watcher died with its parent, and a watcher that dies leaves its lock behind. A stale lock
 * that blocked startup forever would convert one missed event into permanent silence. */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { acquireLock } = require('./head-watch.js');

const tmpLock = (name) => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'hw-')), name);

test('lock: acquires when nothing holds it, and writes our own pid', () => {
  const L = tmpLock('a.lock');
  const release = acquireLock(L);
  assert.ok(release, 'should acquire a free lock');
  assert.strictEqual(fs.readFileSync(L, 'utf8').trim(), String(process.pid));
  release();
  assert.strictEqual(fs.existsSync(L), false, 'release must remove it');
});

test('lock: REFUSES while a live process holds it', () => {
  const L = tmpLock('b.lock');
  fs.writeFileSync(L, String(process.pid));   // this test process is definitionally alive
  assert.strictEqual(acquireLock(L), null, 'must not start a second watcher');
  assert.strictEqual(fs.readFileSync(L, 'utf8').trim(), String(process.pid),
    'a refused acquire must not disturb the holder');
});

test('lock: TAKES OVER a stale lock whose holder is gone', () => {
  const L = tmpLock('c.lock');
  // A pid that cannot be running: process.kill(0) on it throws ESRCH.
  let dead = 999999;
  while (true) { try { process.kill(dead, 0); dead++; } catch (e) { if (e.code === 'ESRCH') break; dead++; } }
  fs.writeFileSync(L, String(dead));
  const release = acquireLock(L);
  assert.ok(release, 'a dead holder must not lock the instrument out forever');
  assert.strictEqual(fs.readFileSync(L, 'utf8').trim(), String(process.pid));
  release();
});

test('lock: a garbage lock file is treated as stale, not as a live holder', () => {
  const L = tmpLock('d.lock');
  fs.writeFileSync(L, 'not-a-pid');
  const release = acquireLock(L);
  assert.ok(release, 'an unparseable lock must not wedge startup');
  release();
});

test('lock: release does NOT delete a lock that now belongs to someone else', () => {
  const L = tmpLock('e.lock');
  const release = acquireLock(L);
  fs.writeFileSync(L, '424242');            // another watcher took over after us
  release();
  assert.strictEqual(fs.existsSync(L), true, 'must not remove a lock we no longer own');
  assert.strictEqual(fs.readFileSync(L, 'utf8').trim(), '424242');
});
