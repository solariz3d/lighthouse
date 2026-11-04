// claim-check-adapter.test.js - the adapter from A's replay turns to the claim check (D305 part 4, seat C). node --test consonance/tools/claim-check-adapter.test.js
// Synthetic fixtures only; no census unit's text or id.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const A = require('./claim-check-adapter.js');
const R = require('./claim-replay.js');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'claim-adapter-test-'));
process.on('exit', () => { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (_) { /* best effort */ } });

const BASH_WRITE = "cat >> exo_memory/librarian/day.md <<'EOF'\n- 41 rows waited\nEOF\n";
const base = { claimTs: '2026-10-05T10:00:10Z', calls: [], results: [] };

test('a part is placed where it was written: text is a reply, the three ring verbs a ring, a write under exo_memory/ a record write, a Bash write into it a bash write; the rest is unseen', () => {
  assert.strictEqual(A.viaOfPart({ tool: 'text' }), 'reply');
  assert.strictEqual(A.viaOfPart({ tool: 'mcp__consonance__call_chair' }), 'ring');
  assert.strictEqual(A.viaOfPart({ tool: 'mcp__consonance__post_board' }), 'unseen');
  assert.strictEqual(A.viaOfPart({ tool: 'Edit', target: 'r\\exo_memory\\map\\C.md' }), 'record-write');
  assert.strictEqual(A.viaOfPart({ tool: 'Write', target: 'scratch/draft.md' }), 'unseen');
  assert.strictEqual(A.viaOfPart({ tool: 'Bash', target: BASH_WRITE }), 'bash-write');
  assert.strictEqual(A.viaOfPart({ tool: 'Bash', target: 'ls exo_memory' }), 'unseen');
});

test('a claim made only in a Bash write is refused by the full build and missed by v1; one made only in an unseen place is missed by both', () => {
  const t = { ...base, claimParts: [{ tool: 'Bash', target: BASH_WRITE, text: '- 41 rows waited' }] };
  assert.strictEqual(A.checkTurn(t, A.VIA_SETS.all).verdict, 'refuse');
  assert.strictEqual(A.checkTurn(t, A.VIA_SETS.v1).verdict, 'allow');
  const u = { ...base, claimParts: [{ tool: 'Write', target: 'scratch/draft.md', text: '41 rows waited' }] };
  assert.strictEqual(A.checkTurn(u, A.VIA_SETS.all).verdict, 'allow');
});

test('A turn with no claimParts is checked as a reply; the flagged claim names its place, token and sentence', () => {
  const r = A.checkTurn({ ...base, claimText: 'There are 98 entries.' });
  assert.strictEqual(r.verdict, 'refuse'); assert.match(r.claim, /^\[reply\] 98 :: There are 98 entries\./);
});

test("A's calls and results become E's events in time order, a call before a result at the same instant, and a result before the claim backs it", () => {
  const ev = A.eventsOf({ calls: [{ ts: '2026-10-05T10:00:02Z', name: 'Bash', input: '{"command":"wc -l"}' }], results: [{ ts: '2026-10-05T10:00:02Z', text: '98', error: false }] });
  assert.deepStrictEqual(ev.map((e) => e.kind), ['call', 'result']);
  const t = { ...base, claimText: 'There are 98 entries.', calls: [{ ts: '2026-10-05T10:00:02Z', name: 'Bash', input: '{"command":"wc -l"}' }], results: [{ ts: '2026-10-05T10:00:03Z', text: '98', error: false }] };
  assert.strictEqual(A.checkTurn(t).verdict, 'allow');
});

test("the prompt rides through: a figure the turn's prompt carried is backed", () => {
  assert.strictEqual(A.checkTurn({ ...base, prompt: 'score the 37 units', claimText: 'The 37 units are scored.' }).verdict, 'allow');
});

// the harness's D305 part 4 addition: claimParts and prompt, from a transcript (the adapter's one need)
function transcript() {
  const rows = [
    { type: 'user', timestamp: '2026-10-05T10:00:00.000Z', message: { role: 'user', content: 'collate the 37 units' } },
    { type: 'assistant', timestamp: '2026-10-05T10:00:05.000Z', message: { id: 'msg_1', role: 'assistant', content: [{ type: 'text', text: 'Writing it down.' }, { type: 'tool_use', id: 'tu1', name: 'Bash', input: { command: BASH_WRITE } }] } },
    { type: 'user', timestamp: '2026-10-05T10:00:06.000Z', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'tu1', content: '' }] } },
  ];
  const p = path.join(tmp, 't.jsonl'); fs.writeFileSync(p, rows.map((r) => JSON.stringify(r)).join('\n') + '\n'); return p;
}
test('the harness keeps each claim part with its place, and the turn prompt, beside claimText (by message id and by claim second)', () => {
  const p = transcript();
  const t = R.turnsByMessageId(p, new Map([['msg_1', {}]])).get('msg_1');
  assert.strictEqual(t.prompt, 'collate the 37 units');
  assert.deepStrictEqual(t.claimParts.map((x) => x.tool), ['text', 'Bash']);
  assert.strictEqual(t.claimText, 'Writing it down.\n- 41 rows waited', 'claimText is unchanged by the addition');
  const extra = new Map();
  R.claimTextsAtSeconds(p, new Map([['u1', '2026-10-05T10:00:05Z']]), extra);
  assert.strictEqual(extra.get('u1').prompt, 'collate the 37 units');
  assert.deepStrictEqual(extra.get('u1').parts.map((x) => x.tool), ['text', 'Bash']);
});
