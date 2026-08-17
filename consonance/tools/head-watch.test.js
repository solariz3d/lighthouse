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
