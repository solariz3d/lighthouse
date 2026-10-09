// gate-mode.test.js — D277 part 2: the paperwork gates behind ONE switch, `gates_mode` in ~/.consonance.json (plan: exo_memory/loop/plan_lighten_the_load_2026-10-09.md).
// Absent, or anything but "light", is "strict": TODAY's behaviour, unchanged. "light": the SOURCES gate matches what was actually RUN or FETCHED (a command
// quoted with its `cd … &&` chain, a command described by its program and the files it touched, a WebSearch query, a fetched URL) instead of the item's exact
// wording; the reply slot WARNS instead of blocking, with the same ledger row. (The NEXT trailer's half is in the app: trailer.rs / mcp.rs rows.)
// Why: D276 (loop/loop_friction_measure_2026-10-09.md) — of 201 paperwork-gate refusals, 4.0% of re-sends fixed a claim and 10.0% blurred or removed one.
// Run: node --test consonance/hooks/gate-mode.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const G = require('./sources-gate.js');
const R = require('./reply-slot.js');

const done = (name, input, result = 'ok') => ({ name, input, done: true, isError: false, result });
const CALLS = [
  done('Bash', { command: 'cd /c/Users/x/repo && git log --oneline -1 main' }, 'abc123 msg'),
  done('Bash', { command: "node -e \"const r=require('fs').readFileSync('C:/Consonance/data/sources-gate.jsonl','utf8')\"" }, '{"deny":30}'),
  done('WebSearch', { query: 'claude code hooks systemMessage stop' }, 'results'),
  done('WebFetch', { url: 'https://code.claude.com/docs/en/hooks' }, 'page'),
  done('Read', { file_path: 'C:\\Users\\x\\repo\\exo_memory\\loop\\plan.md' }, 'text'),
];
const CHAIN = '`cd /c/Users/x/repo && git log --oneline -1 main`';             // the whole chain, quoted as it was run
// the command DESCRIBED, in backticks so it is taken whole. (Unquoted, "node -e (…)" already passes TODAY: parseSources strips a trailing "(…)" from an
// unquoted item and the bare "node -e" then matches any node -e call. That is strict behaviour, found here, and left as it is.)
const PROSE = '`node -e count the decisions per tool in sources-gate.jsonl`';
const QUERY = 'WebSearch: claude code hooks systemMessage stop';
const URL = 'https://code.claude.com/docs/en/hooks';
const NEVER = 'exo_memory/handback/never-opened.md';
const ring = (items) => 'A hand-back pointer: exo_memory/handback/p.md\nSOURCES: ' + items.join(' · ') + '\nNEXT: librarian collate it when it is in';

test('the switch: absent, "strict", garbage or a broken file is strict; only "light" (trimmed, any case) is light', () => {
  assert.strictEqual(G.gatesModeFrom(''), 'strict');
  assert.strictEqual(G.gatesModeFrom('{ not json'), 'strict');
  assert.strictEqual(G.gatesModeFrom(JSON.stringify({ data_dir: 'C:/d' })), 'strict');
  for (const v of ['strict', 'lite', 'warn', true, 1, ['light'], null]) assert.strictEqual(G.gatesModeFrom(JSON.stringify({ gates_mode: v })), 'strict', JSON.stringify(v));
  for (const v of ['light', ' Light ', 'LIGHT']) assert.strictEqual(G.gatesModeFrom('\uFEFF' + JSON.stringify({ gates_mode: v })), 'light', v);
});

test('strict mode is today\'s gate: the chain, the prose command and the search query are DENIED exactly as decide() denies them without a mode', () => {
  for (const it of [CHAIN, PROSE, QUERY]) {
    const now = G.decide(ring([it]), CALLS, '', 'L', 's', 'ring', 'G');
    const strict = G.decide(ring([it]), CALLS, '', 'L', 's', 'ring', 'G', 'strict');
    assert.strictEqual(now.decision, 'deny', it);
    assert.deepStrictEqual(strict, now, it);
  }
  assert.strictEqual(G.decide(ring([URL]), CALLS, '', 'L', 's', 'ring', 'G', 'strict').decision, 'allow', 'a fetched URL already matched');
});

test('light mode matches what ran or was fetched: the quoted cd-chain, a command described by its program and file, a search query, a URL', () => {
  for (const it of [CHAIN, PROSE, QUERY, URL]) {
    const d = G.decide(ring([it]), CALLS, '', 'L', 's', 'ring', 'G', 'light');
    assert.strictEqual(d.decision, 'allow', it + ' -> ' + d.reason);
  }
});

test('light mode still refuses what nothing in the turn touched, a missing line, and an empty one', () => {
  assert.strictEqual(G.decide(ring([NEVER]), CALLS, '', 'L', 's', 'ring', 'G', 'light').decision, 'deny');
  assert.strictEqual(G.decide(ring(['`node -e count something else entirely`']), CALLS, '', 'L', 's', 'ring', 'G', 'light').decision, 'deny', 'a program alone is not a match');
  assert.strictEqual(G.decide('no line here\nNEXT: librarian x when y', CALLS, '', 'L', 's', 'ring', 'G', 'light').kind, 'missing');
  assert.strictEqual(G.decide('SOURCES:\nNEXT: librarian x when y', CALLS, '', 'L', 's', 'ring', 'G', 'light').decision, 'deny');
  assert.strictEqual(G.decide(ring([CHAIN, NEVER]), CALLS, '', 'L', 's', 'ring', 'G', 'light').unmatched.length, 1, 'one of two still named');
});

// the reply slot: a keeper-facing reply with a figure and no Sources line, in the librarian's session
const PROMPT = { type: 'user', message: { role: 'user', content: 'how big is the ledger?' } };
const REPLY = 'Done at C:/work/zzz.md, 3 of 5.';
const v = (mode) => R.verdict({ reply: REPLY, entries: [PROMPT], stopHookActive: false, live: true, seat: 'librarian', gates: 'G', mode });

test('reply slot, strict: it BLOCKS as today, with the same verdict as no mode at all', () => {
  const now = R.verdict({ reply: REPLY, entries: [PROMPT], stopHookActive: false, live: true, seat: 'librarian', gates: 'G' });
  assert.strictEqual(now.output && now.output.decision, 'block');
  assert.deepStrictEqual(v('strict'), now);
});

test('reply slot, light: it WARNS and passes, and the verdict keeps the same fields so the ledger row is the same row', () => {
  const s = v('strict'), l = v('light');
  assert.strictEqual(l.wouldBlock, true);
  assert.strictEqual(l.kind, s.kind);
  assert.strictEqual(l.output, null, 'no block: the ledger row\'s blocked is !!output, so it reads false');
  assert.ok(l.warn && !l.warn.decision, 'a warning, with no block decision in it');
  assert.match(l.warn.systemMessage, /^REPLY SLOT \(warning only/);
  assert.strictEqual(s.warn, undefined, 'strict carries no warn field: its verdict is today\'s');
  assert.deepStrictEqual(Object.keys(l).filter((k) => k !== 'warn').sort(), Object.keys(s).sort());
});
