#!/usr/bin/env node
'use strict';
// label-watch.test.js — L126. FIXTURES ONLY: every input is written in this file or into a temp dir; no real hand-back,
// transcript or instance file is ever read here.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const W = require('./label-watch.js');

const dirs = [];
const tmp = () => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'label-watch-')); dirs.push(d); return d; };
process.on('exit', () => { for (const d of dirs) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (_) {} } });

test('LABELLED: checked: and inferred: lines are counted as labels, by kind', () => {
  const r = W.analyzeText('# Result\n\nchecked: `node x.test.js` → 12 passed / 0 failed\ninferred: the store holds 3 repeats\n');
  assert.strictEqual(r.counts.checked, 1);
  assert.strictEqual(r.counts.inferred, 1);
  assert.strictEqual(r.counts.owingUnlabelled, 0, 'both figure-bearing lines carry a label');
});

test('UNLABELLED-OWING: a figure, a verdict word or a "so …" with no label owes one; plain prose does not', () => {
  const r = W.analyzeText('The suite has 145 tests.\nThe gate is green now.\nThe lock was stale, so the runner took it over.\nThis paragraph states nothing checkable.\n');
  assert.strictEqual(r.counts.candidates, 3);
  assert.strictEqual(r.counts.owingUnlabelled, 3);
  assert.deepStrictEqual(r.rows.filter((x) => x.owing).map((x) => x.why), [['figure'], ['verdict'], ['so']]);
});

test('CHECKED WITH NO CHECK SHOWN (§3): a bare checked: is NOT SHOWN; the inline arrow form and a following fence are SHOWN', () => {
  const r = W.analyzeText([
    'checked: the file is fine',
    'checked: `git log -1` → 1e7520a',
    'checked: the count',
    '',
    '```',
    '42',
    '```',
  ].join('\n'));
  assert.deepStrictEqual(r.checks.map((c) => c.shown), [null, 'inline', 'block']);
  assert.strictEqual(r.counts.checkedNotShown, 1);
});

test('EMPTY input: zero everywhere, no throw', () => {
  for (const t of ['', '\n\n', '```\n```\n']) {
    const r = W.analyzeText(t);
    assert.deepStrictEqual([r.counts.checked, r.counts.inferred, r.counts.candidates, r.counts.owingUnlabelled, r.checks.length], [0, 0, 0, 0, 0]);
  }
});

test('VOCABULARY GUARD (why E required a detector control): the KIND word CHECKED and "unchecked:" are not labels', () => {
  const r = W.analyzeText('CHECKED: 12 claims were kind CHECKED.\nunchecked: 8 of 163 were wrong.\nChecked: capitalised is not the landed marker, 2 lines.\n');
  assert.strictEqual(r.counts.checked + r.counts.inferred, 0);
  assert.strictEqual(r.counts.owingUnlabelled, 3);
});

test('COVERAGE (§1.3): a label on a heading or a bullet parent covers the lines under it', () => {
  const r = W.analyzeText([
    '### inferred: what the census implies',
    'The rate is about 5 in 100.',
    '## Next section',
    'It holds 7 rows.',
    '- checked: `wc -l f` → 30',
    '  - of which 12 are new',
  ].join('\n'));
  const owe = r.rows.filter((x) => x.owing).map((x) => x.text);
  assert.deepStrictEqual(owe, ['It holds 7 rows.'], 'the heading covers its section; the bullet covers its sub-bullet; a new heading ends the cover');
});

test('NOT CLAIMS: fenced lines, NEXT: trailers, and ids that only look like numbers (shas, dates, path:line)', () => {
  const r = W.analyzeText([
    '```',
    'js-suite: 145 green',
    '```',
    'NEXT: librarian collate it when all 4 are in',
    'See 9e47cb1 at src/mcp.rs:3764 on 2026-09-27, 06:45Z.',
  ].join('\n'));
  assert.strictEqual(r.counts.candidates, 0, JSON.stringify(r.rows));
});

test('K FRAME (§1.1): a keeper-typed prompt and its unit — the last assistant text before the next non-tool user row; seats and panes are not the keeper', () => {
  const rows = [
    { type: 'user', uuid: 'u1', timestamp: '2026-09-27T11:00:00Z', message: { content: 'how is it going?' } },
    { type: 'assistant', uuid: 'a1', timestamp: '2026-09-27T11:00:05Z', message: { id: 'm1', content: [{ type: 'text', text: 'first draft' }] } },
    { type: 'user', uuid: 't1', timestamp: '2026-09-27T11:00:06Z', message: { content: [{ type: 'tool_result', content: 'x' }] } },
    { type: 'assistant', uuid: 'a2', timestamp: '2026-09-27T11:00:09Z', message: { id: 'm2', content: [{ type: 'text', text: 'The suite has 145 tests.' }] } },
    { type: 'user', uuid: 'u2', timestamp: '2026-09-27T11:01:00Z', message: { content: '[chair:MAIN] L126 — build it' } },
    { type: 'assistant', uuid: 'a3', timestamp: '2026-09-27T11:01:05Z', message: { id: 'm3', content: [{ type: 'text', text: 'on it' }] } },
    { type: 'user', uuid: 'u3', timestamp: '2026-09-27T11:02:00Z', isMeta: true, message: { content: 'meta' } },
    { type: 'user', uuid: 'u4', timestamp: '2026-09-27T11:03:00Z', message: { content: '<pasted_content id="x">[pane:B] hand-back</pasted_content id="x">' } },
    { type: 'user', uuid: 'u5', timestamp: '2026-09-27T11:04:00Z', message: { content: 'This session is being continued from a previous conversation' } },
  ];
  const units = W.keeperUnits(rows);
  assert.strictEqual(units.length, 1);
  assert.strictEqual(units[0].messageId, 'm2');
  assert.strictEqual(units[0].text, 'The suite has 145 tests.');
});

test('H FRAME + EXPOSURE (§1.1, §1.4) on a throwaway git repo: only hand-backs first added AFTER R, by an EXPOSED seat, outside the landing lap', () => {
  const d = tmp();
  const g = (...a) => execFileSync('git', ['-C', d, ...a], { encoding: 'utf8' }).trim();
  g('init', '-q'); g('config', 'user.email', 't@example.invalid'); g('config', 'user.name', 't');
  fs.mkdirSync(path.join(d, 'exo_memory', 'handback'), { recursive: true });
  const add = (f, body, date) => { fs.writeFileSync(path.join(d, 'exo_memory', 'handback', f), body); g('add', '-A'); execFileSync('git', ['-C', d, 'commit', '-qm', f], { env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } }); };
  add('p-l120-x-A_2026-09-26.md', 'Before the rule: 3 items.\n', '2026-09-26T10:00:00Z');
  const R = g('rev-parse', 'HEAD');
  add('p-l122-land-A_2026-09-27.md', 'The landing lap: 5 items.\n', '2026-09-27T11:00:00Z');
  add('p-l126-y-A_2026-09-27.md', 'checked: `x` → 4\n', '2026-09-27T13:00:00Z');
  add('p-l126-z-B_2026-09-27.md', 'B wrote 9 things.\n', '2026-09-27T13:00:00Z');
  const exposure = { A: Date.parse('2026-09-27T12:00:00Z'), B: null };
  const h = W.handbackUnits(d, R, exposure);
  assert.deepStrictEqual(h.counted.map((u) => u.file), ['exo_memory/handback/p-l126-y-A_2026-09-27.md']);
  assert.deepStrictEqual(h.excluded.map((u) => [path.basename(u.file), u.why]).sort(), [
    ['p-l122-land-A_2026-09-27.md', 'landing lap (L122)'],
    ['p-l126-z-B_2026-09-27.md', 'seat B NOT DELIVERED'],
  ]);
});

// ── L127: B's fixture rows (exo_memory/handback/p-l126-read-B_2026-09-27.md §2), one test each. Expectations are W's
// (E's registration) and item 7's, as B read them, with this tool's L127 rulings where W is silent (C8, C10, C12).
const B_ROWS = [
  ['C1 a checked label with a real check shown', 'checked: `node --test x.test.js` → tests 57 · pass 57 · fail 0', { labels: 1, owing: 0, shown: ['inline'] }],
  ['C2 a checked label with no check', 'checked: the suite is green', { labels: 1, owing: 0, shown: [null] }],
  ['C3 an inferred label on a figure', 'inferred: about 30 units a day', { labels: 1, owing: 0, shown: [] }],
  ['C4 an unlabelled figure owes', 'There were 146 tests and 1 failed.', { labels: 0, owing: 1, shown: [] }],
  ['C5 intent owes nothing', 'I will run the suite after the rebuild.', { labels: 0, owing: 0, shown: [] }],
  ['C6 a question with a figure owes nothing', 'Should we wait 30 minutes before the push?', { labels: 0, owing: 0, shown: [] }],
  ['C7 a plan with no opener owes nothing', 'The next step is to run the 3 mutants.', { labels: 0, owing: 0, shown: [] }],
  ['C8 a marker inside a fenced block is not a label', '```\nchecked: `x` → 4\n```', { labels: 0, owing: 0, shown: [] }],
  ['C9 a marker MENTIONED in inline code is not a label', 'Write `checked:` before a claim.', { labels: 0, owing: 0, shown: [] }],
  ['C10 a marker in a > blockquote is someone else\'s, not a label', '> checked: `x` → 4', { labels: 0, owing: 1, shown: [] }],
  ['C11 "checked:" mid-sentence is prose, and the figure still owes', 'What I checked: the log shows 3 rows.', { labels: 0, owing: 1, shown: [] }],
  ['C12 only the line-start marker counts (one label per line)', 'checked: `x` → 3; inferred: 4 more', { labels: 1, owing: 0, shown: ['inline'] }],
  ['C13 a labelled GRANDPARENT does not cover (nearest bullet parent only)', '- inferred: the plan\n  - the parent, unlabelled\n    - it holds 7 rows', { labels: 1, owing: 1, shown: [] }],
  ['C14 an empty file', '', { labels: 0, owing: 0, shown: [] }],
  ['C15 a CRLF verdict owes', 'The build is green.\r\n', { labels: 0, owing: 1, shown: [] }],
];
for (const [name, text, want] of B_ROWS) {
  test(`L127 ${name}`, () => {
    const r = W.analyzeText(text);
    assert.deepStrictEqual(
      { labels: r.counts.checked + r.counts.inferred, owing: r.counts.owingUnlabelled, shown: r.checks.map((c) => c.shown) },
      want, JSON.stringify(r.rows));
  });
}

test('L127 the CLI\'s result names the proxy as a proxy, and says the registered measures run through claimrec', () => {
  // Asymmetric on purpose (2 labelled, 1 unlabelled): a 1-and-1 fixture gives 0.5 either way and cannot tell the share
  // from its complement (L127 mutant N7 survived the first version).
  const out = W.proxyTotals([{ counts: W.analyzeText('checked: `x` → 4\ninferred: 5 more rows\nThe suite has 9 tests.\n').counts }]);
  assert.deepStrictEqual(Object.keys(out).filter((k) => !k.startsWith('proxy_')), ['checked', 'inferred'], 'every measure but the raw label counts is named proxy_*');
  assert.strictEqual(out.proxy_line_label_share, 2 / 3);
  assert.strictEqual(out.proxy_checked_line_shows_command_inline, 1);
  assert.match(W.PROXY_HEADER, /claimrec/);
  assert.match(W.PROXY_HEADER, /§1\.2/);
});
