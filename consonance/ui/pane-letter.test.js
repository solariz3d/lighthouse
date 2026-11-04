// pane-letter.test.js — run with: node pane-letter.test.js (the js-suite finds it by name).
//
// D423 (pane C, 2026-10-20; the librarian's ruling 02:2x on O's p-d423-labels-O_2026-10-20.md). The crossed labels came from TWO
// letter allocators: the backend's pane_letter (data_dir/letters.json, which picks every mount letter) and term.js's letterFor,
// which, for a pane missing from its cached copy of the registry, invented the first letter not shown on an open pane. The UI
// named the unregistered Third Place N; the backend, which never saw that, handed N to the next sibling. This lifts the REAL
// letterFor out of term.js and drives it with a stub backend: a letter comes from the backend or not at all.
'use strict';
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const src = fs.readFileSync(path.join(__dirname, 'term.js'), 'utf8');
let pass = 0, fail = 0;
const queue = [];
const t = (name, fn) => queue.push([name, fn]);

function region(start, end) {
  const i = src.indexOf(start), j = src.indexOf(end, i);
  assert.ok(i >= 0 && j > i, `term.js: "${start}" … "${end}" not found — this test is pointed at nothing`);
  return src.slice(i, j);
}
const LETTERS = region('let paneLetters = {};', 'function makePaneEl(');

/** The letter code over a stub backend: `registry` is what pane_letters returns now; `cached` what the UI last read; `open` the panes on screen. */
function load({ registry, cached = {}, open = [] }) {
  const calls = [];
  const inv = (cmd) => { calls.push(cmd); return cmd === 'pane_letters' ? Promise.resolve({ ...registry }) : Promise.resolve(); };
  const panes = new Map(open.map(([id, name]) => [id, { name }]));
  const api = new Function('inv', 'panes', `${LETTERS}; paneLetters = ${JSON.stringify(cached)}; return { letterFor, get letters() { return paneLetters; } };`)(inv, panes);
  return { ...api, calls };
}

t('a pane the UI has not cached yet takes the BACKEND\'s letter, not one the UI works out', async () => {
  // the live shape of the bug: A..M registered, the Third Place shown as N by the UI (unregistered), and the backend has since given
  // the new sibling N, because it never saw the UI's N
  const reg = Object.fromEntries('ABCDEFGHIJKLM'.split('').map((l, i) => ['pane-' + i, l]));
  const L = load({ registry: { ...reg, 'sib-new': 'N' }, cached: reg, open: [...Object.entries(reg), ['third-place', 'N']] });
  assert.strictEqual(await L.letterFor('sib-new'), 'N');
  assert.ok(L.calls.includes('pane_letters'), 'it asked the backend');
});
t('a pane the backend has no letter for gets none: nothing is invented on this side', async () => {
  const L = load({ registry: { a: 'A' }, cached: { a: 'A' }, open: [['a', 'A']] });
  assert.strictEqual(await L.letterFor('fresh-pane'), null);
  assert.ok(!Object.values(L.letters).includes('B'), 'no letter was written into the UI\'s copy of the registry');
});
t('a cached letter is the backend\'s and is returned without asking again', async () => {
  const L = load({ registry: { a: 'A', b: 'B' }, cached: { a: 'A', b: 'B' } });
  assert.strictEqual(await L.letterFor('b'), 'B');
  assert.ok(!L.calls.includes('pane_letters'), 'no round trip for a letter already held');
});
t('the backend unreachable: no letter, and the cached copy is kept as it was', async () => {
  const inv = () => Promise.reject(new Error('backend gone'));
  const api = new Function('inv', 'panes', `${LETTERS}; paneLetters = { a: 'A' }; return { letterFor, get letters() { return paneLetters; } };`)(inv, new Map());
  assert.strictEqual(await api.letterFor('new'), null);
  assert.deepStrictEqual(api.letters, { a: 'A' });
});
t('no other letter allocator is left in term.js: nothing builds a letter from A to Z on this side', () => {
  assert.ok(!/String\.fromCharCode\(65 \+/.test(src), 'term.js still computes letters from A');
});

(async () => {
  for (const [name, fn] of queue) {
    try { await fn(); pass++; console.log('ok   ' + name); } catch (e) { fail++; console.log('FAIL ' + name + '\n     ' + String(e && e.message).split('\n').join('\n     ')); }
  }
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
