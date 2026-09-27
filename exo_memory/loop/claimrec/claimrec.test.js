'use strict';
// node --test exo_memory/loop/claimrec/claimrec.test.js — the offline parts of the harness (no claude call).
const test = require('node:test');
const assert = require('node:assert');
const { parseStatements, mechanicalMap, parseCoder, coderPrompt, CODER_INSTRUCTION } = require('./claimrec.js');

const U = ['The build is done.', 'The config sets the width to 1400 pixels.', 'Ask if you want more.'];

test('a numbered, quoted list item becomes one statement carrying its quote', () => {
  const s = parseStatements('1. "The config sets the width to 1400 pixels." — check the file');
  assert.deepStrictEqual(s.map((x) => x.quotes), [['The config sets the width to 1400 pixels.']]);
});

test('an exact quote maps to the unit that contains it', () => {
  assert.deepStrictEqual(mechanicalMap(['sets the width to 1400 pixels'], U), [2]);
});

test('bold markers and curly quotes are normalised before matching', () => {
  assert.deepStrictEqual(mechanicalMap(['**The config** sets the width to 1400 pixels.'], U), [2]);
});

test('a paraphrase is left unmapped for the coder', () => {
  assert.deepStrictEqual(mechanicalMap(['the window is 1400 wide'], U), []);
});

test('an ellipsis quote maps each part of six or more words', () => {
  assert.deepStrictEqual(mechanicalMap(['The config sets the width to 1400 … if you want more.'], U), [2]);
});

test('the coder answer is read as unit numbers per statement, NONE as empty', () => {
  assert.deepStrictEqual(parseCoder('S1: U2\nS2: NONE\nS3: U1, U3', 3), { 1: [2], 2: [], 3: [1, 3] });
});

test('a coder line for a statement that does not exist is ignored', () => {
  assert.deepStrictEqual(parseCoder('S9: U1', 2), {});
});

test('the coder prompt carries the registration instruction verbatim and never the word "wrong"', () => {
  const p = coderPrompt(U, [{ n: 1, text: 'x' }]);
  assert.ok(p.includes(CODER_INSTRUCTION) && !/\bwrong\b/i.test(p));
});


// L116 fix F2: §3 step 1 maps QUOTED items only; an unquoted item goes to the coder.
test('an unquoted list item carries no quotes, so step 1 leaves it for the coder', () => {
  const s = parseStatements('- the width is set in the config');
  assert.deepStrictEqual([s[0].quotes, mechanicalMap(s[0].quotes, U)], [[], []]);
});

// L116 fix F3: §3 — the coder receives ONLY the numbered units, the reader's list and the instruction.
test('the coder prompt holds only unit lines, statement lines and the instruction', () => {
  const lines = coderPrompt(U, [{ n: 1, text: 'x' }]).split(/\n/).filter((l) => l.trim());
  assert.ok(lines.every((l) => /^U\d+: /.test(l) || /^S\d+: /.test(l) || l === CODER_INSTRUCTION));
});

test('a markdown-table coder answer is read row by row', () => {
  assert.deepStrictEqual(parseCoder(['| Statement | Unit(s) |', '|---|---|', '| S1 | U1 |', '| S2 | NONE |'].join('\n'), 2), { 1: [1], 2: [] });
});

test('a prose line naming several statements is not read as the first one\'s answer', () => {
  assert.deepStrictEqual(parseCoder('S5, S6 and S7 each pick out one part of U3. S9 is the second half of U2.', 9), {});
});

test('a free-form coder answer is still read per statement', () => {
  assert.deepStrictEqual(parseCoder(['- **S1** → U2 (the width)', 'S2: none of the units', 'S3 — U1 and U3'].join('\n'), 3), { 1: [2], 2: [], 3: [1, 3] });
});

// L118 (arm 2): the reader's ask comes from --ask <file>; with none, it must be arm 1's sealed ask byte-identically.
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const { execFileSync } = require('child_process');
const { loadAsk, ASK } = require('./claimrec.js');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

// Arm 1's ask as SEALED: the §2 blockquote of the registration at c8c18d4, "the ask above (without the quote marker)",
// its two wrapped lines read as one paragraph (joined by one space). Read from git, so the test fails loudly if the seal
// cannot be read rather than trusting a copy.
function sealedArm1Ask() {
  const repo = path.resolve(__dirname, '..', '..', '..');
  const reg = execFileSync('git', ['-C', repo, 'show', 'c8c18d4:exo_memory/loop/claim_recognition_registration_2026-09-27.md'], { encoding: 'utf8' });
  const sec = reg.slice(reg.indexOf('## 2 · THE ASK'), reg.indexOf('## 3 · THE HIT RULE'));
  return sec.split('\n').filter((l) => l.startsWith('> ')).map((l) => l.slice(2).trim()).join(' ');
}

test('with no --ask, the reader ask is arm 1\'s sealed ask, byte-identical (sha256)', () => {
  const sealed = sealedArm1Ask();
  assert.strictEqual(loadAsk(null).sha256, sha(sealed));
});

test('an ask file saved with one trailing newline gives the same ask text as the words alone', () => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'claimrec-ask-')), 'ask.txt');
  fs.writeFileSync(f, `${ASK}\n`);
  assert.strictEqual(loadAsk(f).sha256, sha(ASK));
});

test('an ask file records its own raw-bytes sha256 and its text', () => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'claimrec-ask-')), 'ask.txt');
  fs.writeFileSync(f, 'List the statements to check.\r\n');
  const a = loadAsk(f);
  assert.deepStrictEqual([a.text, a.fileSha256], ['List the statements to check.', sha(fs.readFileSync(f))]);
});

test('an ask file with no text is refused', () => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'claimrec-ask-')), 'ask.txt');
  fs.writeFileSync(f, '\n');
  assert.throws(() => loadAsk(f), /holds no ask text/);
});
