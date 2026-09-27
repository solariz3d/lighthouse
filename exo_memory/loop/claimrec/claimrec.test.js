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
