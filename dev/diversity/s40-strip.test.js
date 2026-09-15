// s40-strip.test.js — run with: node dev/diversity/s40-strip.test.js
//
// WHAT THIS GUARDS. The strip decides what text the encoder sees, so a quiet change to it is a change to every anchor-
// similarity number. The load-bearing test is the reproduction: B's two measured pairs (p-leave-read-B and p-leave-E
// against packet_leave_window @ed73e76) must come out at B's 3.7% and 1.7%. The rest pin the definition's edges:
// the markers, the whitespace, no case folding, the 40-character boundary, and the brief side of a pair.

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const { SPAN, normalise, s40Strip } = require(path.join(__dirname, 's40-strip.js'));

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e && e.message}`); fail++; }
}

const REPO = path.resolve(__dirname, '..', '..');

// A 60-character run of distinct words, so any 40-character slice of it is unique to it.
const QUOTE = 'the seat waits until every child process has exited cleanly';

test('the markers > * ` _ # are dropped and the rest is kept as written', () => {
  assert.strictEqual(normalise('> **Bold** `code` _em_ # Head'), ' Bold code em Head');
});

test('whitespace runs collapse to one space, including across a dropped marker', () => {
  assert.strictEqual(normalise('a \t\n\n  b * \n c'), 'a b c');
});

test('case is not folded', () => {
  assert.strictEqual(normalise('WAIT Wait wait'), 'WAIT Wait wait');
});

test('a quoted run of 40+ characters is stripped from the hand-back', () => {
  const r = s40Strip(`intro words. ${QUOTE} and then my own finding.`, `brief text: ${QUOTE}.`);
  assert.ok(!r.text.includes(QUOTE.slice(0, SPAN)), r.text);
  assert.ok(r.text.includes('and then my own finding'), r.text);
});

test('a shared run of 39 characters is not stripped', () => {
  // No separators around the shared run: a space on both sides would itself extend it to 40.
  const shared = QUOTE.slice(0, SPAN - 1);
  const r = s40Strip(`XX${shared}YY`, `QQ${shared}ZZ`);
  assert.strictEqual(r.strippedChars, 0);
});

test('a shared run of exactly 40 characters strips exactly 40 characters', () => {
  const shared = QUOTE.slice(0, SPAN);
  const r = s40Strip(`XX${shared}YY`, `QQ${shared}ZZ`);
  assert.strictEqual(r.strippedChars, SPAN);
  assert.strictEqual(r.text, 'XXYY');
});

test('the match is on normalised text: markdown and re-wrapping do not hide a quote', () => {
  // Re-wrap at an existing space, so the normalised hand-back is the quote exactly.
  const at = QUOTE.indexOf(' ', 25);
  const r = s40Strip(`*${QUOTE.slice(0, at)}*\n   ${QUOTE.slice(at + 1)}`, `> ${QUOTE}`);
  assert.strictEqual(r.share, 1);
});

test('the share is over normalised characters, and the embedded text is the normalised remainder', () => {
  const r = s40Strip(`**own** ${QUOTE}`, QUOTE);
  assert.strictEqual(r.normalisedChars, normalise(`**own** ${QUOTE}`).length);
  assert.strictEqual(r.text, 'own ');
  assert.strictEqual(r.share, r.strippedChars / r.normalisedChars);
});

test('empty input strips nothing and reports a zero share', () => {
  assert.deepStrictEqual(s40Strip('', QUOTE), { text: '', normalisedChars: 0, strippedChars: 0, share: 0 });
});

test('the brief side of a pair is the same function with the arguments swapped', () => {
  const handback = `mine. ${QUOTE} mine again.`;
  const brief = `the brief says ${QUOTE} and more of the brief.`;
  const b = s40Strip(brief, handback);
  assert.ok(!b.text.includes(QUOTE.slice(0, SPAN)), b.text);
  assert.ok(b.text.includes('and more of the brief'), b.text);
});

// ── the reproduction: B's measured pairs, anchor-registration-read-B_2026-09-15.md §3 ─────────────────────────────

function atCommit(sha, rel) {
  try {
    return execFileSync('git', ['-C', REPO, 'show', `${sha}:${rel}`], { encoding: 'utf8', maxBuffer: 16 << 20 });
  } catch (e) {
    throw new Error(`cannot read ${rel} at ${sha} from git — this test needs the repo history (${e.message.split('\n')[0]})`);
  }
}
const ANCHOR = atCommit('ed73e76', 'exo_memory/loop/packet_leave_window_2026-09-14.md');
const pct = (share) => (share * 100).toFixed(1);

test('reproduction: p-leave-read-B against packet_leave_window @ed73e76 strips 3.7% (B)', () => {
  const hb = fs.readFileSync(path.join(REPO, 'exo_memory/handback/p-leave-read-B_2026-09-14.md'), 'utf8');
  assert.strictEqual(Buffer.byteLength(ANCHOR), 9910, 'the anchor is not the 9,910 B packet at ed73e76');
  assert.strictEqual(Buffer.byteLength(hb), 16050, 'p-leave-read-B is not the 16,050 B hand-back B measured');
  assert.strictEqual(pct(s40Strip(hb, ANCHOR).share), '3.7');
});

test('reproduction: p-leave-E against packet_leave_window @ed73e76 strips 1.7% (B)', () => {
  const hb = fs.readFileSync(path.join(REPO, 'exo_memory/handback/p-leave-E_2026-09-14.md'), 'utf8');
  assert.strictEqual(Buffer.byteLength(hb), 35743, 'p-leave-E is not the 35,743 B hand-back B measured');
  assert.strictEqual(pct(s40Strip(hb, ANCHOR).share), '1.7');
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
