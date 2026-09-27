'use strict';
// node --test exo_memory/loop/claimrec/units.test.js — the §4 splitting rules, one behaviour per test.
const test = require('node:test');
const assert = require('node:assert');
const { units } = require('./units.js');

test('two sentences split after a period followed by an uppercase letter', () => {
  assert.deepStrictEqual(units('The file exists. It has 12 lines.'), ['The file exists.', 'It has 12 lines.']);
});

test('no split after e.g. or a single-capital initial', () => {
  assert.deepStrictEqual(units('Use a tool, e.g. Grep here. J. Smith wrote it.'), ['Use a tool, e.g. Grep here.', 'J. Smith wrote it.']);
});

test('no split inside a backticked span', () => {
  assert.deepStrictEqual(units('Run `a. B` now. Done.'), ['Run `a. B` now.', 'Done.']);
});

test('a fenced code block is one unit', () => {
  assert.deepStrictEqual(units('Before.\n```\nx = 1. Y = 2.\n```\nAfter.'), ['Before.', '```\nx = 1. Y = 2.\n```', 'After.']);
});

test('table rows are units and the separator row is dropped', () => {
  assert.deepStrictEqual(units('| a | b |\n|---|---|\n| 1 | 2 |'), ['| a | b |', '| 1 | 2 |']);
});

test('headings are units and list items start new units', () => {
  assert.deepStrictEqual(units('# Title\n- one. Two.\n- three'), ['# Title', '- one.', 'Two.', '- three']);
});

test('a blank line ends a unit even without punctuation', () => {
  assert.deepStrictEqual(units('first line\n\nsecond line'), ['first line', 'second line']);
});

test('units with no letter or digit are dropped', () => {
  assert.deepStrictEqual(units('---\n\n***\n\nReal text.'), ['Real text.']);
});

test('empty input gives no units', () => {
  assert.deepStrictEqual(units(''), []);
});

test('no split when the next character is lowercase', () => {
  assert.deepStrictEqual(units('Version 2.1 is out. the rest follows.'), ['Version 2.1 is out. the rest follows.']);
});

// L116 fix F1: §4 rule 4 names `-`, `*`, `+` and `n.` only, so `n)` does not start a new unit.
test('an n) line is not a list marker and joins the text before it', () => {
  assert.deepStrictEqual(units('Intro line\n1) item one'), ['Intro line 1) item one']);
});

test('an n. line is a list marker and starts a new unit', () => {
  assert.deepStrictEqual(units('Intro line\n1. item one'), ['Intro line', '1. item one']);
});
