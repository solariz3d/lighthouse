// text-census.test.js — the fixtures for the NUL guard. Every case runs on files this test
// writes into a temp dir; nothing reads or writes the live checkout.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');

const T = process.env.TEXT_CENSUS_UNDER_TEST || path.join(__dirname, 'text-census.js');
const { firstNul, atOffset, parseAllow, census, report } = require(T);

let pass = 0;
let fail = 0;
function it(name, fn) {
  try {
    fn();
    pass++;
    console.log('  ok   ' + name);
  } catch (e) {
    fail++;
    console.log('  FAIL ' + name + '\n         ' + (e && e.message));
  }
}

// A fresh temp dir per run; the test writes only here.
const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'text-census-'));
const write = (rel, buf) => {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, buf);
  return rel.split(path.sep).join('/');
};

const CLEAN = write('docs/clean.md', 'one\ntwo\nthree\n');
const NULLED = write('docs/nulled.md', Buffer.from('one\ntwo\nth' + '\0' + 'ree\n', 'utf8'));
const BINARY = write('assets/icon.png', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x1a]));
const EMPTY = write('docs/empty.md', '');
const TWO_NULS = write('docs/two.md', Buffer.from('a\0b\0c', 'utf8'));

// ── the primitives ────────────────────────────────────────────────────────────────────────────

it('firstNul returns -1 on a clean buffer', () => {
  assert.strictEqual(firstNul(Buffer.from('no nul here\n')), -1);
});

it('firstNul returns the byte offset of the FIRST NUL, not the count', () => {
  assert.strictEqual(firstNul(Buffer.from('ab\0cd\0')), 2);
});

it('atOffset gives 1-based line and column', () => {
  // "one\ntwo\nth\0ree\n" -> the NUL is the 3rd char of line 3
  const r = atOffset(Buffer.from('one\ntwo\nth\0ree\n'), 10);
  assert.deepStrictEqual(r, { line: 3, col: 3 });
});

it('atOffset handles a NUL on the first line', () => {
  assert.deepStrictEqual(atOffset(Buffer.from('\0abc'), 0), { line: 1, col: 1 });
});

// ── the allow-list is DATA, and the data is validated before use (L061 R3) ────────────────────

it('parseAllow ignores blank lines and comments', () => {
  const rows = parseAllow('# a comment\n\nassets/icon.png  a real PNG\n');
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0].path, 'assets/icon.png');
  assert.strictEqual(rows[0].reason, 'a real PNG');
});

it('parseAllow REFUSES a row with no reason — an unexplained exemption is how these rot', () => {
  assert.throws(() => parseAllow('assets/icon.png\n'), /reason/i);
});

it('parseAllow names the LINE NUMBER of a bad row', () => {
  assert.throws(() => parseAllow('# c\nassets/ok.png  fine\nassets/bad.png\n'), /line 3/);
});

// ── the census ────────────────────────────────────────────────────────────────────────────────

const run = (files, allowText) =>
  census({ root: ROOT, files, allow: parseAllow(allowText || '') });

it('a clean tracked file passes', () => {
  const r = run([CLEAN, EMPTY]);
  assert.deepStrictEqual(r.findings, []);
  assert.strictEqual(r.ok, true);
});

it('a NUL-bearing TEXT file fails', () => {
  const r = run([CLEAN, NULLED]);
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.findings.length, 1);
  assert.strictEqual(r.findings[0].path, NULLED);
});

it('the failure names the file AND the byte offset — not just "something is binary"', () => {
  const r = run([NULLED]);
  const text = report(r);
  assert.ok(text.includes(NULLED), 'the path must be in the message');
  assert.ok(/byte 10\b/.test(text), 'the byte offset must be in the message: ' + text);
  assert.ok(/line 3/.test(text), 'the line must be in the message: ' + text);
});

it('an ALLOW-LISTED binary passes', () => {
  const r = run([CLEAN, BINARY], 'assets/icon.png  a real PNG, binary by nature\n');
  assert.deepStrictEqual(r.findings, []);
  assert.strictEqual(r.ok, true);
});

it('an UNLISTED binary FAILS rather than silently passing', () => {
  const r = run([CLEAN, BINARY]);
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.findings[0].path, BINARY);
});

it('a STALE allow-list entry — a path that is no longer tracked — FAILS', () => {
  const r = run([CLEAN], 'assets/gone.png  was binary once\n');
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.stale.length, 1);
  assert.strictEqual(r.stale[0].path, 'assets/gone.png');
  assert.ok(/no longer tracked/i.test(report(r)), report(r));
});

it('a stale entry fails EVEN WHEN every scanned file is clean — it is its own failure', () => {
  const r = run([CLEAN, EMPTY], 'assets/gone.png  stale\n');
  assert.deepStrictEqual(r.findings, []);
  assert.strictEqual(r.ok, false);
});

it('an allow-listed file that is CLEAN is reported, and does not fail the run', () => {
  const r = run([CLEAN], 'docs/clean.md  listed but has no NUL\n');
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.allowedClean.length, 1);
  assert.ok(/no NUL|clean/i.test(report(r)), report(r));
});

it('the green line always states how many files are ALLOWED — exempted must not read as fixed', () => {
  const r = run([CLEAN, BINARY], 'assets/icon.png  a real PNG\n');
  assert.ok(/1 allowed/.test(report(r)), report(r));
});

it('a file with two NULs reports the FIRST offset, deterministically', () => {
  const r = run([TWO_NULS]);
  assert.strictEqual(r.findings[0].offset, 1);
});

it('the report prints the LIST, not only a count (J\'s D010 rule)', () => {
  const r = run([NULLED, BINARY]);
  const text = report(r);
  assert.ok(text.includes(NULLED) && text.includes(BINARY), text);
});

it('a missing allow file is an EMPTY list, not a crash', () => {
  const r = census({ root: ROOT, files: [CLEAN], allow: parseAllow(null) });
  assert.strictEqual(r.ok, true);
});

it('an unreadable file is a FINDING, not a silent skip', () => {
  const r = census({ root: ROOT, files: ['docs/does-not-exist.md'], allow: [] });
  assert.strictEqual(r.ok, false);
  // R1: pin the SHAPE, not the token — the report must NAME the path, whatever word it uses for why.
  assert.ok(report(r).includes('docs/does-not-exist.md'), report(r));
});

console.log('\n  ' + pass + ' passed, ' + fail + ' failed');
try {
  fs.rmSync(ROOT, { recursive: true, force: true });
} catch (_) {}
process.exit(fail ? 1 : 0);
