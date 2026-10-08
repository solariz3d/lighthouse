// identity-diff.test.js — the instrument for the keeper's stop bar can come back RED (D273, pane C).
//
//   node --test consonance/tools/identity-diff.test.js
//
// A stop bar that cannot fail is decoration. So: a planted UNREGISTERED edit fails it and is named path:line; a REGISTERED generator
// rewrite (a dangling pointer, the keeper relabel, the fork note) passes it and is attributed to its step by name; and on a real
// generation, planting one edit adds exactly one unregistered entry, whatever the baseline's colour.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const G = require('./gen-consumer.js');
const D = require('./identity-diff.js');

const REPO = path.resolve(__dirname, '..', '..');
const ctx = { G, shippedMemory: new Set(), shippedCards: new Set() };
const final = (rel, kind, src) => { const s = D.replay(rel, kind, src, ctx); return s[s.length - 1].text; };

test('lineDiff: kept lines are not reported; an added and a removed line are, with their line numbers', () => {
  const ops = D.lineDiff('a\nb\nc\nd\n', 'a\nB\nc\nd\nE\n');
  assert.deepEqual(ops.map((o) => [o.op, o.op === '+' ? o.bLine : o.aLine, o.text]), [['+', 2, 'B'], ['-', 2, 'b'], ['+', 5, 'E']]);
  assert.deepEqual(D.lineDiff('same\r\ntext\n', 'same\ntext\n'), [], 'line endings alone are not a difference');
});

test('a REGISTERED generator rewrite passes, attributed to its named step', () => {
  const rel = 'exo_memory/cards/a-card.md';
  const src = '# a card\n\nThe case is at journal/2026-08-16.md:722, as dated.\nUntouched line.\n';
  const actual = final(rel, 'prose', src);
  assert.notEqual(actual, src, 'control: the generator does rewrite this source');
  const d = D.diffFile({ rel, from: rel, kind: 'prose', source: src, actual, ctx });
  assert.deepEqual(d.unregistered, []);
  assert.ok(d.registered.length > 0 && d.registered.every((r) => r.step === 'dedangle'), JSON.stringify(d.registered));
});

test('a PLANTED UNREGISTERED edit fails, named by its line, even inside a file the generator also rewrote', () => {
  const rel = 'exo_memory/cards/a-card.md';
  const src = '# a card\n\nThe case is at journal/2026-08-16.md:722, as dated.\nUntouched line.\n';
  const planted = final(rel, 'prose', src).replace('Untouched line.', 'Untouched line, quietly changed.');
  const d = D.diffFile({ rel, from: rel, kind: 'prose', source: src, actual: planted, ctx });
  assert.deepEqual(d.unregistered.map((u) => [u.op, u.line, u.text]), [['+', 4, 'Untouched line, quietly changed.'], ['-', 4, 'Untouched line.']]);
});

test('the keeper relabel and the fork note are registered under the fork step, line by line', () => {
  const rel = 'consonance/src-tauri/brief/BUILDING.md', src = fs.readFileSync(path.join(REPO, rel), 'utf8');
  const d = D.diffFile({ rel, from: rel, kind: 'prose', source: src, actual: final(rel, 'prose', src), ctx });
  assert.deepEqual(d.unregistered, []);
  const fork = d.registered.filter((r) => r.step === 'fork (consumer-relabel.js)');
  assert.ok(fork.some((r) => r.op === '+' && r.text.includes("THE PUSH IS THE WORD OF THE PERSON YOU'RE WITH")), 'the relabel is not attributed to the fork step');
  const boot = 'consonance/src-tauri/brief/BOOT.md', bsrc = fs.readFileSync(path.join(REPO, boot), 'utf8');
  const b = D.diffFile({ rel: boot, from: boot, kind: 'prose', source: bsrc, actual: final(boot, 'prose', bsrc), ctx });
  assert.ok(b.registered.some((r) => r.step === 'fork (consumer-relabel.js)' && r.text.startsWith('**Where this line forks.**')), 'the fork note is not attributed');
});

test('the wake set: briefs, cards, record/, GATES.md and hook files are in; tests and mutant harnesses are out', () => {
  for (const rel of ['exo_memory/BOOT.md', 'consonance/src-tauri/brief/BUILDING.md', 'exo_memory/cards/no-floor-no-ceiling.md', 'exo_memory/record/x.md',
    'consonance/GATES.md', 'consonance/hooks/sources-gate.js', 'dev/shell/hooks/session-start.js']) assert.ok(D.isWake(rel), rel);
  for (const rel of ['consonance/hooks/sources-gate.test.js', 'consonance/tools/sources-gate.mutants.js', 'consonance/tools/gen-consumer.js', 'exo_memory/journal/2026-08-16.md']) assert.ok(!D.isWake(rel), rel);
});

test('on a REAL generation: one planted edit in a shipped card adds exactly one unregistered line, named path:line, and the CLI exits 1', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'identity-diff-real-'));
  try {
    const b = G.build(out, { allowDirty: true });
    assert.ok(!b.refused, 'refused: ' + b.refused);
    const r0 = D.run({ gen: out });
    assert.ok(r0.files > 50, `only ${r0.files} wake files compared`);
    assert.ok((r0.registered['fork (consumer-relabel.js)'] || []).length > 0, 'the fork step registered nothing on a real generation');
    const card = 'exo_memory/cards/no-floor-no-ceiling.md', p = path.join(out, card);
    const lines = fs.readFileSync(p, 'utf8').split('\n'); lines.splice(3, 0, 'A line no generator step writes.'); fs.writeFileSync(p, lines.join('\n'));
    const r1 = D.run({ gen: out });
    assert.equal(r1.ok, false);
    const added = r1.unregistered.filter((u) => !r0.unregistered.some((v) => v.rel === u.rel && v.line === u.line && v.text === u.text));
    assert.deepEqual(added.map((u) => `${u.rel}:${u.line} ${u.op} ${u.text}`), [`${card}:4 + A line no generator step writes.`]);
    const cli = spawnSync(process.execPath, [path.join(__dirname, 'identity-diff.js'), '--gen', out], { encoding: 'utf8' });
    assert.equal(cli.status, 1, cli.stderr); assert.match(cli.stdout, /no-floor-no-ceiling\.md:4 \+ A line no generator step writes\./);
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});
