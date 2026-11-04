// claim-check.test.js - the claim check (D305 part 4, seat C). node --test consonance/hooks/claim-check.test.js
// Every fixture here is synthetic; no census unit's text or id is used (B's held-out rule).
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const C = require('./claim-check.js');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'claim-check-test-'));
process.on('exit', () => { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (_) { /* best effort */ } });

const T0 = '2026-10-05T10:00:00.000Z', T1 = '2026-10-05T10:00:05.000Z', T2 = '2026-10-05T10:00:09.000Z', TOUT = '2026-10-05T10:00:10.000Z', TLATE = '2026-10-05T10:00:20.000Z';
const call = (tool, input, ts = T1) => ({ ts, kind: 'call', tool, input });
const result = (text, ts = T2, isError = false) => ({ ts, kind: 'result', tool: '', text, isError });
const turn = (text, events = [], prompt = '', via = 'reply') => ({ prompt, events, outgoing: { ts: TOUT, via, text } });
const tokens = (r) => r.flagged.map((f) => f.token);

// ---- the switch ----
test('the switch: JSON true is ON, "shadow" is shadow, and everything else (absent, false, "true", 1, broken JSON) is OFF', () => {
  assert.strictEqual(C.claimCheckFrom('{"claim_check": true}'), 'on');
  assert.strictEqual(C.claimCheckFrom('{"claim_check": "Shadow "}'), 'shadow');
  for (const raw of ['{}', '{"claim_check": false}', '{"claim_check": "true"}', '{"claim_check": 1}', '{"handback_index": true}', 'not json', '', null]) assert.strictEqual(C.claimCheckFrom(raw), 'off', String(raw));
  assert.strictEqual(C.claimCheckFrom('\uFEFF{"claim_check": true}'), 'on', 'a BOM is tolerated, as handback_index_from does');
});

// ---- the hook end to end: OFF changes nothing; ON refuses once per turn and place ----
function home(config) {
  const h = fs.mkdtempSync(path.join(tmp, 'home-')), data = path.join(h, 'data'); fs.mkdirSync(data);
  fs.writeFileSync(path.join(h, '.consonance.json'), JSON.stringify({ data_dir: data, ...config }));
  const tr = path.join(h, 't.jsonl');
  fs.writeFileSync(tr, JSON.stringify({ type: 'user', timestamp: T0, message: { role: 'user', content: 'collate it' } }) + '\n');
  return { h, data, tr };
}
function runHook(env, payload) {
  const r = cp.spawnSync(process.execPath, [path.join(__dirname, 'claim-check.js')], { input: JSON.stringify(payload), encoding: 'utf8', env: { ...process.env, HOME: env.h, USERPROFILE: env.h, CONSONANCE_DATA: '', CONSONANCE_DREAM: '' } });
  return { status: r.status, out: r.stdout, ledger: fs.existsSync(path.join(env.data, C.LEDGER)) ? fs.readFileSync(path.join(env.data, C.LEDGER), 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : [] };
}
const ring = (tr) => ({ hook_event_name: 'PreToolUse', session_id: 'sess-1234', transcript_path: tr, tool_name: 'mcp__consonance__call_librarian', tool_input: { text: 'pane C is idle and 412 rows remain.\nNEXT: librarian collate' } });

test('OFF changes nothing: with the switch absent or false the hook prints nothing, exits 0 and writes no ledger row, on a ring ON would refuse', () => {
  for (const cfg of [{}, { claim_check: false }, { claim_check: 'yes' }]) {
    const env = home(cfg), r = runHook(env, ring(env.tr));
    assert.strictEqual(r.status, 0); assert.strictEqual(r.out, '', JSON.stringify(cfg)); assert.deepStrictEqual(r.ledger, [], 'no row while OFF');
  }
  const on = home({ claim_check: true }), r = runHook(on, ring(on.tr));   // the same payload, ON: so the OFF rows above are not vacuous
  assert.match(r.out, /"permissionDecision":"deny"/); assert.match(r.out, /CLAIM CHECK: 2 claim\(s\)/);
});

test('ON refuses once per turn and place: the second send in the same turn goes through, with a logged second-send row; no claim text is stored', () => {
  const env = home({ claim_check: true });
  const a = runHook(env, ring(env.tr)), b = runHook(env, ring(env.tr));
  assert.match(a.out, /deny/); assert.strictEqual(b.out, '');
  assert.deepStrictEqual(b.ledger.map((x) => [x.refused, x.secondSend]), [[true, false], [false, true]]);
  const raw = fs.readFileSync(path.join(env.data, C.LEDGER), 'utf8');
  assert.ok(!/412|idle|rows remain/.test(raw), 'the ledger holds kinds and needs, never the claim text or its figures');
});

test('a refusal it cannot record is not made: with a data dir that cannot be written, ON lets the ring through', () => {
  const env = home({ claim_check: true });
  fs.writeFileSync(path.join(env.h, '.consonance.json'), JSON.stringify({ claim_check: true, data_dir: path.join(env.h, 'no', 'such', 'dir') }));
  const r = runHook(env, ring(env.tr));
  assert.strictEqual(r.status, 0); assert.strictEqual(r.out, '');
});

test('shadow logs what it would refuse and never refuses', () => {
  const env = home({ claim_check: 'shadow' }), r = runHook(env, ring(env.tr));
  assert.strictEqual(r.out, ''); assert.strictEqual(r.ledger.length, 1); assert.strictEqual(r.ledger[0].refused, false); assert.strictEqual(r.ledger[0].flagged.length, 2);
  const p = C.check(turn('412 rows remain.'), { mode: 'shadow' }); assert.strictEqual(p.verdict, 'allow'); assert.strictEqual(p.flagged.length, 1);
});

// ---- which tokens are figures (E §2.2) ----
test('figures: counts, percentages, shas, numbers with units, sizes, a time said to have happened, multipliers', () => {
  const f = (u) => C.figuresIn(u).map((x) => x.kind + ':' + x.token);
  assert.deepStrictEqual(f('Passed 17 of 20, that is 85%.'), ['count:17 of 20', 'percentage:85%']);
  assert.deepStrictEqual(f('The digest is 4b1e9c2a and it grew 1,204 KB.'), ['sha:4b1e9c2a', 'number:1,204 KB']);
  assert.deepStrictEqual(f('It finished at 03:14 after 30k turns, 2.5× faster.'), ['multiplier:2.5×', 'size:30k', 'time:03:14']);
});
test('not figures: dates, ledger and lap ids, path:line, section signs, a heading ordinal, a list marker, numbers inside a path', () => {
  assert.deepStrictEqual(C.figuresIn('On 2026-10-05, D303 and L085 (#63) cite exo_memory/loop/x_2026.md:42 and §4.'), []);
  assert.deepStrictEqual(C.figuresIn('## 3 The match rule'), []);
  assert.deepStrictEqual(C.figuresIn('2. Third, read consonance/tools/a1b2.js'), []);
});

// ---- the revision (D305 wave 3): the cost targets from B's read, by category ----
test('revision: a bare single-digit count and a label number are not figures; zero, multi-digit counts, decimals and figures with a unit still are', () => {
  assert.deepStrictEqual(C.figuresIn('It marks 2 rules and 7 commits, in part 4 and step (3).'), []);
  assert.deepStrictEqual(C.figuresIn('Item 12 and lap 41 are labels, and so is (14) in a list.'), []);
  assert.deepStrictEqual(C.figuresIn('There are 0 hits, 23 files, 3 s, 2.5 rows and 4 of 4 pass.').map((x) => x.token), ['4 of 4', '0', '23', '3 s', '2.5']);
});
test("revision: a seat's state is backed when the turn's prompt is that seat's own ring; another seat's ring does not back it", () => {
  assert.strictEqual(C.check(turn('B has finished the tidy.', [], '[pane:B] D9 hand-back: exo_memory/handback/x.md')).verdict, 'allow');
  assert.strictEqual(C.check(turn('B has finished the tidy.', [], '[pane:C] D9 hand-back: exo_memory/handback/x.md')).verdict, 'refuse');
});
test('revision: a run state is backed by a run in the turn that names the thing; not by an unrelated call, and not with no call', () => {
  const run = [call('Bash', { command: 'node consonance/tools/js-suite.js --quiet' }), result('Command running in background with ID: b1')];
  assert.strictEqual(C.check(turn('The js-suite is running now.', run)).verdict, 'allow');
  assert.strictEqual(C.check(turn('The js-suite is running now.', [call('Bash', { command: 'ls docs' }), result('a.md')])).verdict, 'refuse');
  assert.strictEqual(C.check(turn('The js-suite is running now.')).verdict, 'refuse');
});
test('revision: a state word inside a condition (if, when, once, after, until, unless) is not a state claim', () => {
  const r = C.check(turn('If the harness run has finished by then, the lock is free.'));
  assert.strictEqual(r.verdict, 'allow'); assert.ok(r.skipped.some((s) => s.reason === 'conditional'));
  assert.strictEqual(C.check(turn('The harness run has finished.')).verdict, 'refuse', 'the same words stated as a fact are still a claim');
  assert.strictEqual(C.check(turn('The harness run has finished, and B reads it when ready.')).verdict, 'refuse', 'a condition AFTER the state word does not make it conditional');
});

// ---- backing a figure (E §3.1) ----
test('literal: the figure as a whole token in an earlier result backs it; 600 is not backed by 600000; colour codes and thousands separators are ignored', () => {
  assert.strictEqual(C.check(turn('There are 98 entries.', [call('Bash', { command: 'ls | wc -l' }), result('98 entries')])).verdict, 'allow');
  assert.deepStrictEqual(tokens(C.check(turn('It waited 600 s.', [call('Bash', { command: 'x' }), result('waited 600000 ms')]))), ['600 s']);
  assert.strictEqual(C.check(turn('It grew 428,177 B.', [call('Bash', { command: 'x' }), result('size \x1b[33m428177\x1b[39m')])).verdict, 'allow');
});
test("a colour code's own digits never back a figure: 33 is not backed by an output painted with [33m", () => {
  assert.deepStrictEqual(tokens(C.check(turn('There are 33 rows.', [call('Bash', { command: 'x' }), result('\x1b[33mrows ok\x1b[39m')]))), ['33']);
});
test('a figure inside a path is not a figure: the version in dist/v1.2.3/app.js is not flagged', () => {
  assert.deepStrictEqual(C.figuresIn('It ships dist/v1.2.3/app.js now.'), []);
  assert.deepStrictEqual(C.figuresIn('It ships v1.2.3 now.').map((x) => x.kind), ['version'], 'the same version outside a path is one');
});
test('a result AFTER the message backs nothing (the late case), and an errored result backs nothing', () => {
  assert.deepStrictEqual(tokens(C.check(turn('There are 98 entries.', [call('Bash', { command: 'x' }, TOUT), result('98 entries', TLATE)]))), ['98']);
  assert.deepStrictEqual(tokens(C.check(turn('There are 98 entries.', [call('Bash', { command: 'x' }), result('98 entries', T2, true)]))), ['98']);
});
test('a figure carried from the prompt is backed (how: prompt), and listed in backed so the replay can count that exit', () => {
  const r = C.check(turn('The packet says 37 units.', [], 'Score the 37 units.'));
  assert.strictEqual(r.verdict, 'allow'); assert.strictEqual(r.backed[0].by.how, 'prompt');
});
test('computed: a written sum or ratio of backed figures is backed; a wrong sum is not; an unwritten ratio needs a literal', () => {
  const ev = [call('Bash', { command: 'x' }), result('a 7479 b 15753 n 27 m 44')];
  assert.strictEqual(C.check(turn('Together 7,479 + 15,753 = 23,232 B.', ev)).verdict, 'allow');
  assert.deepStrictEqual(tokens(C.check(turn('Together 7,479 + 15,753 = 23,323 B.', ev))), ['23,323 B']);
  assert.strictEqual(C.check(turn('The share is 27/44 = 61.4%.', ev)).verdict, 'allow');
  assert.deepStrictEqual(tokens(C.check(turn('The share is 61.4%.', ev))), ['61.4%']);
});
test('rounded: an approximate figure is backed by a number that rounds to it with units converted; without the marker it is not', () => {
  const ev = [call('Bash', { command: 'x' }), result('67911')];
  assert.strictEqual(C.check(turn('About ~66 KB.', ev)).verdict, 'allow');
  assert.deepStrictEqual(tokens(C.check(turn('Exactly 66 KB.', ev))), ['66 KB']);
});
test('empty-result: a zero claim is backed by a call whose result is empty', () => {
  assert.strictEqual(C.check(turn('grep found 0 hits.', [call('Bash', { command: 'grep -c needle hay.txt' }), result('')])).verdict, 'allow');
  assert.deepStrictEqual(tokens(C.check(turn('grep found 0 hits.'))), ['0']);
});

// ---- state claims (E §2.3, §3.2) ----
test('a state of a seat needs a board read: read_board or board.jsonl backs it; a listing of a folder does not', () => {
  assert.deepStrictEqual(C.check(turn('pane C is idle.')).flagged.map((f) => [f.kind, f.need]), [['state', 'board']]);
  assert.strictEqual(C.check(turn('pane C is idle.', [call('mcp__consonance__read_board', {}), result('[pane C] working')])).verdict, 'allow', 'a read of the right source backs it, whatever it printed (E §3.2)');
  assert.strictEqual(C.check(turn('pane C is idle.', [call('Bash', { command: 'tail -5 data/board.jsonl' }), result('rows')])).verdict, 'allow');
  assert.strictEqual(C.check(turn('pane C is idle.', [call('Bash', { command: 'ls verify/C' }), result('claims.json')])).verdict, 'refuse');
});
test('existence needs a read naming the path: ls of that file backs it; ls of another folder does not', () => {
  const u = 'exo_memory/loop/notes_x.md does not exist.';
  assert.strictEqual(C.check(turn(u, [call('Bash', { command: 'ls exo_memory/loop/notes_x.md' }), result('No such file')])).verdict, 'allow');
  assert.strictEqual(C.check(turn(u, [call('Bash', { command: 'ls dev/' }), result('a b')])).verdict, 'refuse');
});
test('a state word with no named object is skipped as no-object, never flagged', () => {
  const r = C.check(turn('The work is finished and everything looks green.'));
  assert.strictEqual(r.verdict, 'allow'); assert.ok(r.skipped.some((s) => s.reason === 'no-object'));
});
test('pushed needs a read that compares with the remote; a plain git status does not back it', () => {
  assert.strictEqual(C.check(turn('The branch is pushed.', [call('Bash', { command: 'git status' }), result('clean')])).verdict, 'refuse');
  assert.strictEqual(C.check(turn('The branch is pushed.', [call('Bash', { command: 'git log origin/main..HEAD' }), result('')])).verdict, 'allow');
});

// ---- out of scope (E §2.4) ----
test('skipped, never flagged: an inferred: line and the list under it, quotes, questions, plans, and the NEXT:/SOURCES: trailers', () => {
  const text = ['inferred: about 40 rows, from the header.', '- 12 of them old', 'He said "71 of 80 green" yesterday.', 'Are 9 still open?', 'We will rerun 5 shards.', 'SOURCES: a.md · b.md', 'NEXT: librarian scores 3 units'].join('\n\n');
  const r = C.check(turn(text.replace('\n\n- 12', '\n- 12')));
  assert.strictEqual(r.verdict, 'allow', JSON.stringify(r.flagged));
  assert.deepStrictEqual([...new Set(r.skipped.map((s) => s.reason))].sort(), ['inferred', 'plan', 'question', 'trailer']);
});
test('a refusal names every unbacked flag at once and the three ways out', () => {
  const r = C.check(turn('There are 98 entries and 12 more.'));
  const t = C.refusalText(r, 'G.md');
  assert.match(t, /2 claim\(s\)/); assert.match(t, /"98"/); assert.match(t, /"12"/); assert.match(t, /inferred:/); assert.match(t, /drop the claim/);
});

// ---- where a claim is made (E §3.4) ----
test('places: rings, record writes and Bash writes into exo_memory/ are seen; a write elsewhere, a plain command and a redirect elsewhere are not', () => {
  assert.strictEqual(C.outgoingOfTool('mcp__consonance__chair_inject', { text: 'x', token: 'secret' }).via, 'ring');
  assert.strictEqual(C.outgoingOfTool('Write', { file_path: 'r/exo_memory/handback/h.md', content: 'x' }).via, 'record-write');
  assert.strictEqual(C.outgoingOfTool('Write', { file_path: 'scratch/h.md', content: 'x' }), null);
  const heredoc = "cat >> exo_memory/librarian/day.md <<'EOF'\n- 41 rows waited\nEOF\n";
  assert.deepStrictEqual(C.outgoingOfTool('Bash', { command: heredoc }), { via: 'bash-write', text: '- 41 rows waited', target: 'bash' });
  assert.strictEqual(C.outgoingOfTool('Bash', { command: 'echo "7 left" >> exo_memory/map/C.md' }).text, '7 left');
  assert.strictEqual(C.outgoingOfTool('Bash', { command: 'grep -c x exo_memory/map/C.md' }), null);
  assert.strictEqual(C.outgoingOfTool('Bash', { command: "cat > /tmp/x.md <<'EOF'\n5 rows\nEOF" }), null);
});
test('the v1 scope leaves the Bash write path out; the full build checks it', () => {
  const t = turn('- 41 rows waited', [], '', 'bash-write');
  assert.strictEqual(C.check(t, { vias: C.V1_VIAS }).verdict, 'allow');
  assert.strictEqual(C.check(t).verdict, 'refuse');
});

// D309 (seat A): the prompt now ends on the app's send line. The seat of a ring is read from its head, so a seat's own ring still backs its state.
test('D309: a ring that ends on the send line backs the same seat and no other', () => {
  const stamped = (l) => `[pane:${l}] D9 hand-back: exo_memory/handback/x.md\n[sent 2026-10-12T07:25:51Z · Oct 12, 1:25 AM local]`;
  assert.strictEqual(C.check(turn('B has finished the tidy.', [], stamped('B'))).verdict, 'allow');
  assert.strictEqual(C.check(turn('B has finished the tidy.', [], stamped('C'))).verdict, 'refuse');
});

// D454 part 3 (pane E): the data dir by the app's rule (main.rs data_dir: data_dir from ~/.consonance.json when set, else %USERPROFILE%\.consonance).
// A new user who keeps the default Data folder saves data_dir "" (ui/app.js), and the app gives panes no CONSONANCE_DATA, so without the third step
// the switched-on check had no ledger and let every claim through.
test('APP RULE (D454): with data_dir empty or absent, ON keeps its ledger in USERPROFILE/.consonance and refuses', () => {
  for (const extra of [{ data_dir: '' }, {}]) {
    const h = fs.mkdtempSync(path.join(tmp, 'home-')), data = path.join(h, '.consonance'); fs.mkdirSync(data);
    fs.writeFileSync(path.join(h, '.consonance.json'), JSON.stringify({ claim_check: true, ...extra }));
    const tr = path.join(h, 't.jsonl'); fs.writeFileSync(tr, JSON.stringify({ type: 'user', timestamp: T0, message: { role: 'user', content: 'collate it' } }) + '\n');
    const r = runHook({ h, data, tr }, ring(tr));
    assert.match(r.out, /"permissionDecision":"deny"/, JSON.stringify(extra) + ': ' + r.out);
    assert.strictEqual(r.ledger.length, 1, 'the refusal is recorded under the default data dir');
  }
});
