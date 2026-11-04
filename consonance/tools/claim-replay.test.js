'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const R = require('./claim-replay.js');
const scratch = require('./scratch.js');

const KEYPREFIX = 'vc' + 'k_';   // assembled, as in the harness: this file never spells a gateway key
const mk = (extra = {}) => ({ id: 't', group: 'g', seat: 'A', turnStart: 's', claimTs: 'c', claimText: 'x', calls: [], results: [], ...extra });

// ---------------------------------------------------------------- the counter (a stub must count both ways)
test('tally counts a refusal as refused and an allow as allowed, an error and an unlocated unit as neither', () => {
  const t = R.tally([
    { status: 'ok', verdict: 'refuse' }, { status: 'ok', verdict: 'refuse' }, { status: 'ok', verdict: 'allow' },
    { status: 'error' }, { status: 'unlocated' },
  ]);
  assert.deepStrictEqual(t, { n: 5, refused: 2, allowed: 1, errored: 1, unlocated: 1 });
});

test('the always-refuse stub refuses every turn and the never-refuse stub allows every turn, and the tally shows both', async () => {
  const turns = [mk({ id: 'a' }), mk({ id: 'b' }), mk({ id: 'c' })];
  const yes = R.tally(await R.replay(R.loadChecker('always-refuse'), turns));
  const no = R.tally(await R.replay(R.loadChecker('never-refuse'), turns));
  assert.deepStrictEqual([yes.refused, yes.allowed], [3, 0]);
  assert.deepStrictEqual([no.refused, no.allowed], [0, 3]);
});

test('a checker that throws, or returns the wrong shape, is an error and never an allow', async () => {
  const bad = [() => { throw new Error('boom'); }, () => undefined, () => ({ verdict: 'maybe' }), () => ({})];
  for (const f of bad) {
    const res = await R.replay({ check: f }, [mk()]);
    assert.strictEqual(res[0].status, 'error');
    assert.strictEqual(R.tally(res).allowed, 0);
    assert.strictEqual(R.tally(res).errored, 1);
  }
});

test('an unlocated unit is passed over without calling the checker', async () => {
  let called = 0;
  const res = await R.replay({ check: () => { called++; return { verdict: 'allow' }; } }, [{ id: 'u', status: 'unlocated', why: 'x' }]);
  assert.strictEqual(called, 0);
  assert.strictEqual(res[0].status, 'unlocated');
});

test('a checker may be async and its flagged claim is kept', async () => {
  const res = await R.replay({ check: async (t) => ({ verdict: 'refuse', claim: 'the figure ' + t.claimText, reason: 'r' }) }, [mk({ claimText: '42' })]);
  assert.deepStrictEqual([res[0].verdict, res[0].claim, res[0].reason], ['refuse', 'the figure 42', 'r']);
});

test('loadChecker takes a module that exports a function, one that exports { check }, and refuses anything else', () => {
  const d = scratch.mkdtemp('claim-replay-ck-');
  const f1 = path.join(d, 'fn.js'), f2 = path.join(d, 'obj.js'), f3 = path.join(d, 'none.js');
  fs.writeFileSync(f1, "module.exports = () => ({ verdict: 'allow' });");
  fs.writeFileSync(f2, "module.exports = { name: 'objy', check() { return { verdict: 'refuse' }; } };");
  fs.writeFileSync(f3, 'module.exports = { nothing: 1 };');
  assert.strictEqual(typeof R.loadChecker(f1).check, 'function');
  assert.strictEqual(R.loadChecker(f2).name, 'objy');
  assert.throws(() => R.loadChecker(f3), /exports a function or/);
});

test('wilson: 0 of 0 has no interval, 5 of 10 straddles one half, 0 of 100 starts at zero', () => {
  assert.deepStrictEqual(R.wilson(0, 0), [null, null]);
  const [lo, hi] = R.wilson(5, 10);
  assert.ok(lo < 0.5 && hi > 0.5 && Math.abs(lo - 0.2366) < 0.001 && Math.abs(hi - 0.7634) < 0.001, `${lo} ${hi}`);
  assert.strictEqual(R.wilson(0, 100)[0] < 1e-9, true);
});

// ---------------------------------------------------------------- the census locators (E's evidence strings)
test('parseLocator reads a turn start and a claim time, carries a claim past midnight to the next day, and returns null when E located nothing', () => {
  assert.deepStrictEqual(R.parseLocator('lib turn 2026-09-16T14:53:37Z, claim 14:57:15Z; the greps'), { seat: 'lib', turnStart: '2026-09-16T14:53:37Z', claimTs: '2026-09-16T14:57:15Z' });
  assert.strictEqual(R.parseLocator('lib turn 2026-09-23T23:36:49Z; the probe ran; claim 00:01:02Z').claimTs, '2026-09-24T00:01:02Z');
  assert.strictEqual(R.parseLocator('main turn 2026-09-01T10:38:15Z; claim at 10:38:45Z with no tool call').claimTs, '2026-09-01T10:38:45Z');
  assert.strictEqual(R.parseLocator('erring turn not located; the census hit is C\'s hand-back text'), null);
  assert.strictEqual(R.parseLocator('lib turn 2026-09-19T06:22:23Z; its own board count').claimTs, null);
});

test('censusLocators marks a unit unlocated when there is no turn or no claim time, and an override wins', () => {
  const cls = { q3: [
    { id: 'W1', class: 'CN', src: 'log', evidence: 'lib turn 2026-09-16T14:53:37Z, claim 14:57:15Z' },
    { id: 'W2', class: 'CU', src: 'fs', evidence: 'erring turn not located' },
    { id: 'W3', class: 'CN', src: 'fs', evidence: 'lib turn 2026-09-19T06:22:23Z; no time' },
    { id: 'W4', class: 'NA', src: 'fs', evidence: 'lib turn 2026-09-19T06:22:23Z, claim 06:23:00Z' },
  ] };
  const u = R.censusLocators(cls, { W3: { seat: 'lib', turnStart: '2026-09-19T06:22:23Z', claimTs: '2026-09-19T06:23:30Z' } });
  assert.deepStrictEqual(u.map((x) => [x.id, x.status, x.source]), [['W1', 'located', 'parsed from E evidence string'], ['W2', 'unlocated', 'none'], ['W3', 'located', 'override']]);
});

// ---------------------------------------------------------------- reading a transcript
const row = (o) => JSON.stringify(o);
function fixture() {
  const d = scratch.mkdtemp('claim-replay-fx-');
  const rel = 'C--Consonance-instances-librarian/fixture.jsonl';
  fs.mkdirSync(path.join(d, path.dirname(rel)), { recursive: true });
  const T = (s) => `2026-10-10T10:00:${String(s).padStart(2, '0')}.000Z`;
  const rows = [
    row({ type: 'user', timestamp: T(0), message: { role: 'user', content: 'older prompt' } }),
    row({ type: 'assistant', timestamp: T(1), message: { id: 'm0', role: 'assistant', content: [{ type: 'tool_use', name: 'Bash', input: { command: 'old command' } }] } }),
    row({ type: 'user', timestamp: T(10), message: { role: 'user', content: [{ type: 'text', text: 'the real prompt' }] } }),
    row({ type: 'assistant', timestamp: T(11), message: { id: 'm1', role: 'assistant', content: [{ type: 'tool_use', name: 'Bash', input: { command: 'git log -1' } }] } }),
    row({ type: 'user', timestamp: T(12), message: { role: 'user', content: [{ type: 'tool_result', content: [{ type: 'text', text: `abc123 landed ${KEYPREFIX}SECRET99 end\nthe Third Place line\nplain` }] }] } }),
    row({ type: 'assistant', timestamp: T(20), message: { id: 'm2', role: 'assistant', stop_reason: 'end_turn', content: [
      { type: 'text', text: 'It is landed at abc123.' },
      { type: 'tool_use', name: 'Write', input: { file_path: 'x.md', content: 'written body: 7 files' } },
      { type: 'tool_use', name: 'Bash', input: { command: 'after the claim' } }] } }),
  ];
  fs.writeFileSync(path.join(d, rel), rows.join('\n') + '\n');
  return { d, rel, T };
}

test('turnsByMessageId: the turn is everything since the last real prompt and BEFORE the message, the claim text holds its text and written body, and secrets and Third Place lines are gone', () => {
  const { d, rel } = fixture();
  const got = R.turnsByMessageId(path.join(d, rel), new Map([['m2', {}]]));
  const t = got.get('m2');
  assert.ok(t, 'the message was found');
  assert.deepStrictEqual(t.calls.map((c) => c.name), ['Bash'], 'only the call of this turn, not the older prompt\'s, and not the claim message\'s own');
  assert.ok(t.calls[0].input.includes('git log -1'));
  assert.strictEqual(t.results.length, 1);
  assert.ok(!t.results[0].text.includes('SECRET99'), 'a key-shaped string is redacted');
  assert.ok(t.results[0].text.includes('abc123 landed'));
  assert.ok(!/Third Place line/i.test(t.results[0].text) && t.results[0].text.includes('[third-place line removed]'));
  assert.ok(t.claimText.includes('It is landed at abc123.') && t.claimText.includes('written body: 7 files'));
  assert.ok(!t.claimText.includes('after the claim'), 'a Bash command that is not a heredoc is not claim text');
  assert.strictEqual(t.turnStart, '2026-10-10T10:00:10.000Z');
});

test('turnsByMessageId leaves out a message it was not asked for, and the earlier prompt\'s calls are not in a later turn', () => {
  const { d, rel } = fixture();
  assert.strictEqual(R.turnsByMessageId(path.join(d, rel), new Map([['nope', {}]])).size, 0);
  const t = R.turnsByMessageId(path.join(d, rel), new Map([['m1', {}]])).get('m1');
  assert.deepStrictEqual(t.calls, []);
  assert.deepStrictEqual(t.results, []);
});

test('parseTurnOutput reads turn.js lines, keeps a RESULT error flag, redacts a key and removes a Third Place line', () => {
  const out = [
    '2026-10-10T10:00:10.000Z USER-PROMPT [15 chars]',
    '2026-10-10T10:00:11.000Z CALL Bash: {"command":"git log -1"}',
    `2026-10-10T10:00:12.000Z RESULT (error): boom ${KEYPREFIX}ABCDEF the Third Place`,
    '2026-10-10T10:00:13.000Z ASSISTANT-TEXT [20 chars]',
  ].join('\n');
  const p = R.parseTurnOutput(out);
  assert.strictEqual(p.userPromptAt, '2026-10-10T10:00:10.000Z');
  assert.deepStrictEqual(p.calls.map((c) => [c.name, c.input]), [['Bash', '{"command":"git log -1"}']]);
  assert.strictEqual(p.results[0].error, true);
  assert.ok(!p.results[0].text.includes('ABCDEF'));
  assert.strictEqual(p.textBlocks, 1);
});

test('claimTextsAtSeconds finds the assistant text of the second E named, and nothing for another second', () => {
  const { d, rel, T } = fixture();
  const got = R.claimTextsAtSeconds(path.join(d, rel), new Map([['u1', T(20).replace('.000Z', 'Z')], ['u2', T(40).replace('.000Z', 'Z')]]));
  assert.ok(got.get('u1').includes('It is landed at abc123.'));
  assert.ok(!got.has('u2'));
});

// ---------------------------------------------------------------- the CLI over a fixture: E's turn.js is the one that runs for a census unit
test('run: a located census unit goes through E\'s turn.js, an unlocated one is counted apart, and the right and week groups count both ways', () => {
  const { d, rel, T } = fixture();
  const lists = path.join(d, 'lists'); fs.mkdirSync(lists);
  const w = (n, o) => fs.writeFileSync(path.join(lists, n), JSON.stringify(o));
  w('census-units.json', { units: [
    { id: 'W1', class: 'CN', status: 'located', seat: 'lib', transcript: rel, turn_start: T(10).replace('.000Z', 'Z'), claim_ts: T(20).replace('.000Z', 'Z') },
    { id: 'W2', class: 'CU', status: 'unlocated', why: 'E did not locate the erring turn' },
  ] });
  w('right-claims.json', { messages: [{ messageId: 'm2', seat: 'chair', transcript: rel }] });
  w('week-replies.json', { replies: [{ messageId: 'm2', seat: 'chair', transcript: rel }, { messageId: 'gone', seat: 'chair', transcript: rel }] });
  w('manifest.json', { harness_sha256: 'x', lists: {} });
  const run = (checker) => cp.spawnSync(process.execPath, [path.join(__dirname, 'claim-replay.js'), 'run', '--lists', lists, '--checker', checker, '--projects', d], { encoding: 'utf8' });
  const yes = run('always-refuse'), no = run('never-refuse');
  assert.strictEqual(yes.status, 0, yes.stderr); assert.strictEqual(no.status, 0, no.stderr);
  assert.match(yes.stdout, /\*\*CN:\*\* 1 units - caught 1, missed 0, unlocated 0/);
  assert.match(no.stdout, /\*\*CN:\*\* 1 units - caught 0, missed 1, unlocated 0/);
  assert.match(yes.stdout, /\*\*CU:\*\* 1 units - caught 0, missed 0, unlocated 1/);
  assert.match(yes.stdout, /- 1 turns - refused 1, allowed 0, unlocated 0/, 'right group');
  assert.match(yes.stdout, /- 2 turns - refused 1, allowed 0, unlocated 1/, 'week group: a message no longer in the transcript is unlocated, not allowed');
  assert.match(no.stdout, /- 1 turns - refused 0, allowed 1, unlocated 0/);
});

test('turnsByMessageId: a second wanted message in the same turn sees the tool calls of the first one\'s message', () => {
  const d = scratch.mkdtemp('claim-replay-two-');
  const f = path.join(d, 't.jsonl');
  const T = (s) => `2026-10-10T11:00:${String(s).padStart(2, '0')}.000Z`;
  fs.writeFileSync(f, [
    row({ type: 'user', timestamp: T(0), message: { role: 'user', content: 'go' } }),
    row({ type: 'assistant', timestamp: T(1), message: { id: 'a1', role: 'assistant', content: [{ type: 'text', text: 'first' }, { type: 'tool_use', name: 'Bash', input: { command: 'in the first message' } }] } }),
    row({ type: 'user', timestamp: T(2), message: { role: 'user', content: [{ type: 'tool_result', content: 'first result' }] } }),
    row({ type: 'assistant', timestamp: T(3), message: { id: 'a2', role: 'assistant', content: [{ type: 'text', text: 'second' }] } }),
  ].join('\n') + '\n');
  const got = R.turnsByMessageId(f, new Map([['a1', {}], ['a2', {}]]));
  assert.deepStrictEqual(got.get('a1').calls, [], 'the first message sees nothing of its own calls');
  assert.deepStrictEqual(got.get('a2').calls.map((c) => c.input.includes('in the first message')), [true], 'the second sees the first\'s call');
  assert.deepStrictEqual(got.get('a2').results.map((r) => r.text), ['first result']);
});

test('censusLocators: a unit with a turn but no claim time and no override is unlocated, not located with a null claim', () => {
  const [u] = R.censusLocators({ q3: [{ id: 'W9', class: 'CN', src: 'fs', evidence: 'lib turn 2026-09-19T06:22:23Z; no time' }] }, {});
  assert.strictEqual(u.status, 'unlocated');
  assert.strictEqual(u.claim_ts, null);
  assert.match(u.why, /no claim time/);
});

test('a report hides the flagged sentence unless --show-claims is given', () => {
  const { d, rel } = fixture();
  const lists = path.join(d, 'lists2'); fs.mkdirSync(lists);
  const w = (n, o) => fs.writeFileSync(path.join(lists, n), JSON.stringify(o));
  w('right-claims.json', { messages: [{ messageId: 'm2', seat: 'chair', transcript: rel }] });
  w('manifest.json', { harness_sha256: 'x', lists: {} });
  const run = (...more) => cp.spawnSync(process.execPath, [path.join(__dirname, 'claim-replay.js'), 'run', '--lists', lists, '--checker', 'always-refuse', '--groups', 'right', '--projects', d, ...more], { encoding: 'utf8' }).stdout;
  assert.ok(!run().includes('It is landed at abc123'));
  assert.ok(run('--show-claims').includes('It is landed at abc123'));
});

test('a Wilson bound is never printed below zero', () => {
  assert.match(R.rate(0, 73), /0\.0% \(Wilson 95% 0\.0%-5\.0%\)/);
});

test('--show-claims lists EVERY refusal, not only the first 60; without it the long list is still cut', () => {
  const d = scratch.mkdtemp('claim-replay-many-');
  const rel = 'C--Consonance-instances-librarian/many.jsonl';
  fs.mkdirSync(path.join(d, path.dirname(rel)), { recursive: true });
  const rows = [row({ type: 'user', timestamp: '2026-10-10T10:00:00.000Z', message: { role: 'user', content: 'go' } })];
  const ids = [];
  for (let i = 0; i < 65; i++) {
    const id = 'm' + String(i).padStart(3, '0'); ids.push(id);
    rows.push(row({ type: 'assistant', timestamp: `2026-10-10T10:01:${String(i % 60).padStart(2, '0')}.000Z`, message: { id, role: 'assistant', stop_reason: 'end_turn', content: [{ type: 'text', text: 'claim number ' + id }] } }));
  }
  fs.writeFileSync(path.join(d, rel), rows.join('\n') + '\n');
  const lists = path.join(d, 'lists'); fs.mkdirSync(lists);
  fs.writeFileSync(path.join(lists, 'week-replies.json'), JSON.stringify({ replies: ids.map((messageId) => ({ messageId, seat: 'chair', transcript: rel })) }));
  fs.writeFileSync(path.join(lists, 'manifest.json'), JSON.stringify({ harness_sha256: 'x', lists: {} }));
  const run = (...more) => cp.spawnSync(process.execPath, [path.join(__dirname, 'claim-replay.js'), 'run', '--lists', lists, '--checker', 'always-refuse', '--groups', 'week', '--projects', d, ...more], { encoding: 'utf8', maxBuffer: 1 << 24 }).stdout;
  const rowsIn = (s) => s.split('\n').filter((l) => /^\| m\d{3} \|/.test(l)).length;
  const full = run('--show-claims'), cut = run();
  assert.strictEqual(rowsIn(full), 65, 'every refusal is listed with --show-claims');
  assert.strictEqual(rowsIn(cut), 60, 'without it the list stops at 60');
  assert.match(cut, /\+5 more refusals not listed/);
  assert.doesNotMatch(full, /more refusals not listed/, 'nothing is cut, so no note says so');
});

test('--show-claims prints a flagged claim whole, a long one included; without it nothing of the claim is printed', () => {
  const { d, rel } = fixture();
  const lists = path.join(d, 'lists3'); fs.mkdirSync(lists);
  fs.writeFileSync(path.join(lists, 'right-claims.json'), JSON.stringify({ messages: [{ messageId: 'm2', seat: 'chair', transcript: rel }] }));
  fs.writeFileSync(path.join(lists, 'manifest.json'), JSON.stringify({ harness_sha256: 'x', lists: {} }));
  const ck = path.join(d, 'long.js');
  const long = 'START ' + 'word '.repeat(120) + 'END';
  fs.writeFileSync(ck, `module.exports = () => ({ verdict: 'refuse', claim: ${JSON.stringify(long)} });`);
  const run = (...more) => cp.spawnSync(process.execPath, [path.join(__dirname, 'claim-replay.js'), 'run', '--lists', lists, '--checker', ck, '--groups', 'right', '--projects', d, ...more], { encoding: 'utf8' }).stdout;
  const full = run('--show-claims');
  assert.ok(full.includes('START word') && full.includes('word END'), 'the whole claim, start and end');
  assert.ok(!run().includes('START'), 'hidden without the flag');
});
