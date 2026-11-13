/* Tests for wake-gate.js (Lap W, W4; exo_memory/loop/wake_level2_2026-11-13/00_lap_w_spec.md:386-456, first_dispatch_gate.md).
 *
 * The recorded case: the librarian's ring at 2026-11-13T14:46:27Z, 3 min 40 s after a SessionStart:resume at 14:42:47.130Z. Of the three files the
 * wake owed it, it had grepped and cut its own note, sed-cut L's dreamzone3 handoff, and cat'ed L's lighthouse handoff in one stage. The fixture is that
 * window rebuilt as STRUCTURE (P's scratchpad lapw/shape-1446.json, read from the transcript as tool names, stage shapes and result lengths; every
 * pattern and every word of text replaced by a placeholder): the 24 calls with their recorded names, in order, then the ring.
 * The second recorded case, 2026-11-11: a resume at 14:34:29Z, three plain Reads of the 11-11 -L handoffs with BACKSLASH paths, the ring at 15:13:22Z
 * (lapw/shape-1111.json): (b) green, (a) red. Both recorded rings DENY, so two allow rows stand beside them (a decide() that always denies fails them).
 *
 * Run: node --test consonance/hooks/wake-gate.test.js
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const HOOK = path.join(__dirname, 'wake-gate.js');
const REPO = path.join(__dirname, '..', '..');
const tmp = (p) => require('../tools/scratch.js').mkdtemp(p);
const SID = '0c0c0c0b-0000-4000-8000-00000000115b';
const NOTE = 'exo_memory/librarian/2026-11-13.md', LH = 'exo_memory/loop/handoff_lighthouse_2026-11-13-L.md', DZ = 'exo_memory/loop/handoff_dreamzone3_2026-11-13-L.md';

/** A room repo holding `files` (repo-relative -> a size in bytes, one line of x; or the file's own text), each with mtime `at`. */
const textOf = (n) => Array.from({ length: n }, (_, i) => `line ${i + 1} of the note`).join('\n') + '\n';
function room(files, at = '2026-11-13T08:43:40-06:00') {
  const r = tmp('wg-repo-');
  for (const [rel, body] of Object.entries(files)) {
    const f = path.join(r, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, typeof body === 'string' ? body : 'x'.repeat(body));
    const t = new Date(at); fs.utimesSync(f, t, t);
  }
  fs.mkdirSync(path.join(r, 'exo_memory'), { recursive: true }); fs.writeFileSync(path.join(r, 'exo_memory', 'BOOT.md'), 'room\n');
  return r;
}
function homeFor(repo, machine = 'D') {
  const h = tmp('wg-home-');
  fs.writeFileSync(path.join(h, '.consonance.json'), JSON.stringify({ room_path: path.join(repo, 'exo_memory', 'BOOT.md'), ...(machine ? { machine_tag: machine } : {}) }));
  return h;
}
// transcript rows, as Claude Code writes them
let n = 0;
const wakeRow = (t, src) => ({ type: 'attachment', timestamp: t, attachment: { type: 'hook_success', hookName: `SessionStart:${src}`, hookEvent: 'SessionStart' } });
const compactRow = (t) => ({ type: 'system', subtype: 'compact_boundary', timestamp: t });
function call(t, name, input, result = { len: 100 }) {
  const id = `toolu_fx${++n}`;
  const rows = [{ type: 'assistant', timestamp: t, message: { role: 'assistant', content: [{ type: 'tool_use', id, name, input }] } }];
  // `lines: [a, b]` is a Read's result as Claude Code stores it: each returned line numbered `N\t`
  const text = result && result.lines ? Array.from({ length: result.lines[1] - result.lines[0] + 1 }, (_, i) => `${result.lines[0] + i}\tline ${result.lines[0] + i} of the note`).join('\n')
    : result && (result.text || 'x'.repeat(result.len || 1));
  if (result) rows.push({ type: 'user', timestamp: t, message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, is_error: !!result.err, content: text }] } });
  return rows;
}
const sh = (t, cmd, len) => call(t, 'Bash', { command: cmd }, { len });
function transcriptFile(rows) { const d = tmp('wg-tx-'), f = path.join(d, 't.jsonl'); fs.writeFileSync(f, rows.flat().map((r) => JSON.stringify(r)).join('\n') + '\n'); return f; }

/** The 14:42:47Z resume and the 24 calls before the 14:46:27Z ring, by their recorded names, stage shapes and result lengths. */
function recorded1446() {
  n = 0;
  return [
    wakeRow('2026-11-13T14:42:47.130Z', 'resume'),
    sh('2026-11-13T14:43:32.554Z', 'cd R && git status -sb | head -3 && git fetch -q && git log --oneline A..B | wc -l', 900),
    // its result as recorded in kind (7,892 chars): the three `wc -l` lines, then the lighthouse handoff WHOLE, which is what that cat returned
    call('2026-11-13T14:43:43.870Z', 'Bash', { command: `cd R && wc -l ${LH} ${DZ} ${NOTE} ; cat ${LH}` }, { text: `1 ${LH}\n1 ${DZ}\n1 ${NOTE}\n${'x'.repeat(7612)}` }),
    sh('2026-11-13T14:43:48.522Z', `cd R && grep -rn -i "PATTERN" ${NOTE} exo_memory/librarian/2026-11-12.md | cut -c1-240`, 2721),
    sh('2026-11-13T14:43:51.001Z', `cd R && sed -n 1,40p exo_memory/briefs/lighthouse_the_room.md | cut -c1-300 ; grep -n -i "PATTERN" ${NOTE} | cut -c1-240 | tail -15`, 3665),
    sh('2026-11-13T14:43:55.917Z', `cd R && cat exo_memory/loop/plan_room_better_swarm_2026-11-13.md | cut -c1-260 ; echo X ; sed -n 1,80p ${DZ} | cut -c1-260`, 7597),
    sh('2026-11-13T14:44:01.716Z', 'cd R && ls -la X ; ls -t X | head ; find X -maxdepth 1 -iname X -newer X | head', 400),
    sh('2026-11-13T14:44:07.471Z', 'cd R && git log -1 --format=X && git status -sb | head -5 ; ls -t | head -12', 282),
    sh('2026-11-13T14:44:09.988Z', 'cd R && cat X ; git fetch -q && git log --oneline X | wc -l', 654),
    sh('2026-11-13T14:44:17.637Z', 'find X -maxdepth 2 -iname X -mtime -3 | head', 31),
    call('2026-11-13T14:44:26.595Z', 'PowerShell', { command: 'Get-Process X | Select-Object X | Format-Table -AutoSize | Out-String -Width 200' }, { len: 388, err: true }),
    sh('2026-11-13T14:44:32.250Z', 'cd R && timeout 60 cargo check --release | grep -E "X" | head -20', 56),
    sh('2026-11-13T14:44:34.650Z', 'cd R && timeout 60 cargo build --release | tail -15', 122),
    call('2026-11-13T14:44:36.857Z', 'PowerShell', { command: '$c = Get-Item X ; Get-ChildItem X | Select-Object -First 5' }, { len: 125 }),
    sh('2026-11-13T14:44:40.148Z', 'cd R && export X && timeout 60 cargo build --release | grep -E "X" | head -12', 474),
    sh('2026-11-13T14:45:36.268Z', 'cd R && head -30 X ; grep -n "PATTERN" X | head -12', 3101),
    sh('2026-11-13T14:45:41.409Z', 'cd R && grep -n -o "PATTERN" X | head -20 ; grep -c X X', 405),
    sh('2026-11-13T14:45:48.140Z', 'cd R && sed -i "s/X/Y/" exo_memory/loop/room_better_swarm_2026-11-13.workflow.js', 65),
    call('2026-11-13T14:45:50.893Z', 'Workflow', { scriptPath: 'X' }, { len: 1162 }),
    call('2026-11-13T14:45:56.623Z', 'mcp__consonance__read_board', {}, { len: 1359 }),
    sh('2026-11-13T14:46:00.568Z', 'cd R && grep -rn "PATTERN" X | head -3', 193),
    sh('2026-11-13T14:46:02.718Z', 'cd R && sed -n 1,80p X ; grep -n "PATTERN" X | head -40', 5621),
    sh('2026-11-13T14:46:05.417Z', 'cd R && sed -n 1,40p X ; ls X | grep -i X', 1362),
    sh('2026-11-13T14:46:07.712Z', 'cd R && ls -t | head -15 ; ls | grep -i -E "X"', 26875),
    sh('2026-11-13T14:46:18.330Z', `cd R && git commit -q -o ${NOTE} -m X`, 65),
  ];
}
const ring = (t, text = 'a ring') => ({ tool_name: 'mcp__consonance__call_chair', tool_input: { text }, tool_use_id: 'toolu_ring', session_id: SID });

function gate(rows, { repo, machine = 'D', now = '2026-11-13T08:46:27-06:00', payload = {}, env = {}, cwd, ledger } = {}) {
  const data = tmp('wg-data-');
  // the body hook's ledger as it stands before this ring: its rows at earlier wakes say how long the note was then (the ruled bar's S)
  if (ledger) fs.writeFileSync(path.join(data, 'sessionstart-body.jsonl'), ledger.map((r) => JSON.stringify(r)).join('\n') + '\n');
  const p = { ...ring('2026-11-13T14:46:27.152Z'), transcript_path: transcriptFile(rows), cwd: cwd || path.join(tmp('wg-inst-'), 'librarian'), ...payload };
  const e = { ...process.env }; for (const k of Object.keys(e)) if (/^(CONSONANCE_|WAKE_)/.test(k)) delete e[k];
  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(p), encoding: 'utf8', windowsHide: true, timeout: 30000,
    env: { ...e, USERPROFILE: homeFor(repo, machine), HOME: homeFor(repo, machine), CONSONANCE_DATA: data, CONSONANCE_PANE: SID, WAKE_NOW: now, ...env } });
  const led = path.join(data, 'wake-gate.jsonl');
  const rows2 = fs.existsSync(led) ? fs.readFileSync(led, 'utf8').trim().split('\n').map(JSON.parse) : [];
  const out = r.stdout ? JSON.parse(r.stdout) : null;
  return { status: r.status, out, deny: !!(out && out.hookSpecificOutput && out.hookSpecificOutput.permissionDecision === 'deny'), reason: out ? out.hookSpecificOutput.permissionDecisionReason : '', row: rows2[rows2.length - 1] || null, data };
}
const R1446 = () => room({ [NOTE]: 61668, [LH]: 7612, [DZ]: 13826 });

test('W4 (RED FIRST) the recorded 14:46:27Z ring is refused: the note (grep and cut only) and L\'s dreamzone3 handoff (sed and cut only) were not opened whole', () => {
  const g = gate(recorded1446(), { repo: R1446() });
  assert.strictEqual(g.status, 0);
  assert.ok(g.deny, 'denied');
  assert.deepStrictEqual(g.row.missing.sort(), [DZ, NOTE].sort());
  assert.deepStrictEqual(g.row.satisfied, [LH], 'the one-stage cat of the lighthouse handoff counts');
  assert.strictEqual(g.row.decision, 'deny');
  assert.strictEqual(g.row.wake.kind, 'resume');
  for (const m of [NOTE, DZ]) assert.ok(g.reason.includes(m), `the refusal names ${m}`);
  // AMENDED (the wake gate's ruled bar, pane P, 2026-11-13): the refusal used to say "one Read, no offset or limit, allow_large"; what counts now
  // is the lines a read returned, so it names the missing LINES and says an offset and a limit are fine.
  assert.match(g.reason, new RegExp(`${NOTE.replace(/[./]/g, '\\$&')}: lines 1`));
  assert.match(g.reason, /an offset and a limit are fine/);
  assert.match(g.reason, /LATER message/);
});

test('W4 the recorded 2026-11-11 ring: three plain Reads with BACKSLASH paths satisfy (b); the note was not opened, so (a) still refuses', () => {
  n = 0;
  const repo = room({ 'exo_memory/librarian/2026-11-11.md': 50000, 'exo_memory/loop/handoff_t180_2026-11-11-L.md': 4314,
    'exo_memory/loop/handoff_lighthouse_2026-11-11-L.md': 5148, 'exo_memory/loop/handoff_dreamzone3_2026-11-11-L.md': 9087 }, '2026-11-11T08:30:00-06:00');
  const win = (rel) => repo.replace(/\//g, '\\') + '\\' + rel.replace(/\//g, '\\');
  const rows = [wakeRow('2026-11-11T14:34:29.993Z', 'resume'),
    call('2026-11-11T14:37:46.438Z', 'Read', { file_path: win('exo_memory/loop/handoff_t180_2026-11-11-L.md') }, { lines: [1, 1] }),
    call('2026-11-11T14:37:46.874Z', 'Read', { file_path: win('exo_memory/loop/handoff_lighthouse_2026-11-11-L.md') }, { lines: [1, 1] }),
    call('2026-11-11T14:37:47.364Z', 'Read', { file_path: win('exo_memory/loop/handoff_dreamzone3_2026-11-11-L.md') }, { lines: [1, 1] }),
    call('2026-11-11T14:40:02.901Z', 'Read', { file_path: win('exo_memory/briefs/dreamzone2_the_game.md'), offset: 1, limit: 80 }, { len: 16449 })];
  const g = gate(rows, { repo, now: '2026-11-11T09:13:22-06:00' });
  assert.ok(g.deny);
  assert.deepStrictEqual(g.row.missing, ['exo_memory/librarian/2026-11-11.md']);
  assert.strictEqual(g.row.satisfied.length, 3, 'all three handoffs, read by backslash paths');
});

test('W4 ALLOW: every required file opened whole since the wake (a Read with allow_large, a one-stage cat, a Get-Content)', () => {
  n = 0;
  const repo = R1446();
  const rows = [wakeRow('2026-11-13T14:42:47.130Z', 'resume'), call('2026-11-13T14:43:00Z', 'Read', { file_path: path.join(repo, NOTE), allow_large: true }, { lines: [1, 1] }),
    sh('2026-11-13T14:43:10Z', `cd R && cat ${LH}`, 7612), call('2026-11-13T14:43:20Z', 'PowerShell', { command: `Get-Content ${DZ}` }, { len: 13826 })];
  const g = gate(rows, { repo });
  assert.ok(!g.deny, g.reason);
  assert.strictEqual(g.row.decision, 'allow');
  assert.strictEqual(g.row.kind, 'opened');
});

test('W4 ALLOW: a second ring after a delivered first is not gated', () => {
  const rows = [...recorded1446(), call('2026-11-13T14:46:20Z', 'mcp__consonance__call_chair', { text: 'an earlier ring' }, { text: 'delivered' })];
  const g = gate(rows, { repo: R1446() });
  assert.ok(!g.deny);
  assert.strictEqual(g.row.kind, 'not-first');
});

test('W4 a refused first ring is not a delivery: the next ring is still the first', () => {
  const rows = [...recorded1446(), call('2026-11-13T14:46:20Z', 'mcp__consonance__call_chair', { text: 'x' }, { text: 'x', err: true })];
  assert.ok(gate(rows, { repo: R1446() }).deny);
});

test('W4 NOT whole: head, tail, sed -n, grep, cut, a stage after the cat, an stdout redirect, a Read with offset or limit, Get-Content -TotalCount, a persisted output', () => {
  const repo = room({ [NOTE]: 100 });
  for (const c of [`head -50 ${NOTE}`, `tail ${NOTE}`, `sed -n 1,9p ${NOTE}`, `grep x ${NOTE}`, `cut -c1-9 ${NOTE}`, `cat ${NOTE} | head`, `cat ${NOTE} > /dev/null`, `cat ${NOTE} >> out.txt`]) {
    n = 0;
    assert.ok(gate([wakeRow('2026-11-13T14:42:47Z', 'resume'), sh('2026-11-13T14:43:00Z', c, 100)], { repo }).deny, c);
  }
  for (const input of [{ file_path: path.join(repo, NOTE), offset: 1 }, { file_path: path.join(repo, NOTE), limit: 2000 }]) {
    n = 0;
    assert.ok(gate([wakeRow('2026-11-13T14:42:47Z', 'resume'), call('2026-11-13T14:43:00Z', 'Read', input)], { repo }).deny, JSON.stringify(input));
  }
  n = 0;
  assert.ok(gate([wakeRow('2026-11-13T14:42:47Z', 'resume'), call('2026-11-13T14:43:00Z', 'PowerShell', { command: `Get-Content ${NOTE} -TotalCount 40` })], { repo }).deny);
  n = 0;
  assert.ok(gate([wakeRow('2026-11-13T14:42:47Z', 'resume'), sh('2026-11-13T14:43:00Z', `cat ${NOTE}`, 0)].map((r, i) => (i === 1 ? r.map((x) => (x.type === 'user' ? { ...x, message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: x.message.content[0].tool_use_id, content: '<persisted-output>\nOutput too large' }] } } : x)) : r)), { repo }).deny, 'a persisted output is a preview, not the file');
});

test('W4 an errored Read, or a call whose result is not on disk yet, does not count', () => {
  const repo = room({ [NOTE]: 100 });
  n = 0;
  assert.ok(gate([wakeRow('2026-11-13T14:42:47Z', 'resume'), call('2026-11-13T14:43:00Z', 'Read', { file_path: path.join(repo, NOTE) }, { err: true, text: 'File too large' })], { repo }).deny);
  n = 0;
  assert.ok(gate([wakeRow('2026-11-13T14:42:47Z', 'resume'), call('2026-11-13T14:43:00Z', 'Read', { file_path: path.join(repo, NOTE) }, null)], { repo }).deny);
});

test('W4 a COMPACT wake: a whole open before it does not count (the summary dropped it)', () => {
  n = 0;
  const repo = room({ [NOTE]: 100 }, '2026-11-13T07:00:00-06:00');
  const rows = [call('2026-11-13T13:00:00Z', 'Read', { file_path: path.join(repo, NOTE) }, { lines: [1, 1] }), compactRow('2026-11-13T14:00:00Z'), wakeRow('2026-11-13T14:00:01Z', 'compact')];
  const g = gate(rows, { repo });
  assert.ok(g.deny);
  assert.strictEqual(g.row.wake.kind, 'compact');
});

// AMENDED (the wake gate's ruled bar, pane P, 2026-11-13): "whole" is now the LINES the reads returned, so an own append is a note that GREW past
// what was returned (here: one line returned, two in the file), no longer an mtime newer than the open with the same bytes.
test('W4 a RESUME wake: lines returned after the last compaction count; lines the seat appended after them are refused and recorded as own-append', () => {
  const rows = () => { n = 0; return [compactRow('2026-11-13T12:00:00Z'), call('2026-11-13T13:00:00Z', 'Read', { file_path: '' }, { lines: [1, 1] }), wakeRow('2026-11-13T14:42:47Z', 'resume')]; };
  const older = room({ [NOTE]: textOf(1) }, '2026-11-13T06:00:00-06:00');   // 12:00Z, before the 13:00Z open
  const r1 = rows(); r1[1][0].message.content[0].input.file_path = path.join(older, NOTE);
  assert.ok(!gate(r1, { repo: older }).deny, 'the conversation still holds it');
  const newer = room({ [NOTE]: textOf(2) }, '2026-11-13T08:30:00-06:00');   // 14:30Z, after the open: the seat appended line 2
  const r2 = rows(); r2[1][0].message.content[0].input.file_path = path.join(newer, NOTE);
  const g = gate(r2, { repo: newer });
  assert.ok(g.deny);
  assert.strictEqual(g.row.kind, 'own-append');
  assert.deepStrictEqual(g.row.ownAppend, [NOTE]);
});

test('W4 a RESUME wake: a whole open from BEFORE the last compaction does not count (the summary dropped it), though the file is unchanged since', () => {
  n = 0;
  const repo = room({ [NOTE]: 100 }, '2026-11-13T04:00:00-06:00');   // 10:00Z, older than every row below
  const rows = [call('2026-11-13T11:00:00Z', 'Read', { file_path: path.join(repo, NOTE) }, { lines: [1, 1] }), compactRow('2026-11-13T12:00:00Z'),
    wakeRow('2026-11-13T12:00:01Z', 'compact'), wakeRow('2026-11-13T14:42:47Z', 'resume')];
  const g = gate(rows, { repo });
  assert.ok(g.deny, 'the open before the compaction is gone from the conversation');
  assert.strictEqual(g.row.wake.kind, 'resume');
  assert.deepStrictEqual(g.row.missing, [NOTE]);
});

test('W4 skips are recorded: no note and no machine tag fails open with nothing required', () => {
  n = 0;
  const g = gate([wakeRow('2026-11-13T14:42:47Z', 'resume')], { repo: room({}), machine: null });
  assert.ok(!g.deny);
  assert.strictEqual(g.row.kind, 'nothing-required');
  assert.deepStrictEqual(g.row.skips.sort(), ['no-machine', 'no-note']);
});

test('W4 two handoffs on the newest date are both required; the other machine\'s older ones and this machine\'s are not', () => {
  n = 0;
  const repo = room({ [NOTE]: 10, [LH]: 10, [DZ]: 10, 'exo_memory/loop/handoff_t180_2026-11-11-L.md': 10, 'exo_memory/loop/handoff_lighthouse_2026-11-13-D.md': 10 });
  const g = gate([wakeRow('2026-11-13T14:42:47Z', 'resume')], { repo });
  assert.deepStrictEqual(g.row.missing.sort(), [DZ, LH, NOTE].sort());
});

test('W4 [interrupt] in the ring passes and is recorded', () => {
  const g = gate(recorded1446(), { repo: R1446(), payload: { tool_input: { text: 'stop, [interrupt]: the build is clobbering' } } });
  assert.ok(!g.deny);
  assert.strictEqual(g.row.kind, 'interrupt');
});

test('W4 a subagent\'s call_chair is refused, not exempted (a workflow\'s agents inherit the pane id)', () => {
  const g = gate(recorded1446(), { repo: R1446(), payload: { agent_id: 'a1' } });
  assert.ok(g.deny);
  assert.strictEqual(g.row.kind, 'subagent');
});

test('W4 other seats are never gated: no output and no ledger row', () => {
  const g = gate(recorded1446(), { repo: R1446(), env: { CONSONANCE_PANE: 'some-other-seat' }, cwd: path.join(tmp('wg-inst-'), 'sibling-x') });
  assert.strictEqual(g.out, null);
  assert.strictEqual(g.row, null);
});

test('W4 off D it warns and records, and does not refuse (the ruling is "on D")', () => {
  const g = gate(recorded1446(), { repo: R1446(), machine: 'L' });
  assert.ok(!g.deny);
  assert.strictEqual(g.row.decision, 'warn');
});

test('W4 a deny that cannot be recorded is not given: an unwritable ledger allows', () => {
  const bad = path.join(tmp('wg-bad-'), 'file');
  fs.writeFileSync(bad, 'not a folder');
  assert.ok(!gate(recorded1446(), { repo: R1446(), env: { CONSONANCE_DATA: bad } }).deny);
});

test('W4 the dream gate: a dreaming instance gets nothing', () => {
  const g = gate(recorded1446(), { repo: R1446(), env: { CONSONANCE_DREAM: '1' } });
  assert.strictEqual(g.out, null);
  assert.strictEqual(g.row, null);
});

test('W4 --replay counts the recorded ring as a deny', async () => {
  const H = require('./wake-gate.js');
  const f = transcriptFile([...recorded1446(), [{ type: 'assistant', timestamp: '2026-11-13T14:46:27.152Z', message: { role: 'assistant', content: [{ type: 'tool_use', id: 'toolu_ring', name: 'mcp__consonance__call_chair', input: { text: 'x' } }] } }]]);
  const out = await H.replay(f, R1446(), 'D');
  assert.strictEqual(out.rings, 1);
  assert.deepStrictEqual(out.tally, { 'deny missing': 1 });
});

test('W3 and W4 hold the seat to ONE list: required() is the same text in both hooks, and gives the same answer on one repo', () => {
  const text = (f) => fs.readFileSync(path.join(REPO, f), 'utf8').replace(/\r\n/g, '\n');
  const block = (t) => { const a = t.indexOf('// W3/W4 required: begin'), b = t.indexOf('// W3/W4 required: end'); return a < 0 || b < 0 ? null : t.slice(a, b); };
  const w3 = block(text('consonance/hooks/sessionstart-body.js')), w4 = block(text('consonance/hooks/wake-gate.js'));
  assert.ok(w3 && w4, 'both carry the marked block');
  assert.strictEqual(w4, w3);
  const repo = room({ [NOTE]: 1, 'exo_memory/librarian/2026-11-15.md': 1, [LH]: 1, [DZ]: 1, 'exo_memory/loop/handoff_x_2026-11-12-L.md': 1 });
  const today = new Date('2026-11-13T08:46:27-06:00');
  assert.deepStrictEqual(require('./wake-gate.js').required(repo, 'D', today), require('./sessionstart-body.js').required(repo, 'D', today));
});

test('W4 machineTag is state-sync.js\'s, text for text', () => {
  const text = (f) => fs.readFileSync(path.join(REPO, f), 'utf8').replace(/\r\n/g, '\n');
  const fn = (t) => { const a = t.indexOf('function machineTag() {'); return a < 0 ? null : t.slice(a, t.indexOf('\n}\n', a) + 2); };
  assert.strictEqual(fn(text('consonance/hooks/wake-gate.js')), fn(text('consonance/tools/state-sync.js')));
});

// ── The wake gate's ruled bar (exo_memory/loop/plan_room_stretch_2026-11-13.md:215, 441bcc67; registered in
// handback/p-wakegate-S-register-P_2026-11-13.md; pane P, 2026-11-13) ──
// Before the first ring after a wake the seat has had RETURNED to it every line the dated note gained since its previous wake, through to the
// last line; with no previous wake known, the whole note; the handoffs whole. The recorded case: the librarian's 16:46 compaction wake, where a
// Read with no offset or limit returned lines 1-183 of 754 and the gate counted the note satisfied by the call's form. The body hook recorded
// 542 lines at the previous wake (line 543 is that wake entry's own heading), so S = 543.
const N754 = textOf(754);
const HANDOFFS = { [LH]: textOf(3), [DZ]: textOf(3) };
const PREV = (lines, ts = '2026-11-13T18:55:00Z', note = NOTE, session = SID) => ({ ts, event: 'emitted', source: 'compact', session, note, note_lines: lines });
function wakeAt1646(extra = []) {
  n = 0;
  return [compactRow('2026-11-13T22:46:27.000Z'), wakeRow('2026-11-13T22:46:27.900Z', 'compact'),
    call('2026-11-13T22:47:00Z', 'Read', { file_path: '' }, { lines: [1, 183] }),
    call('2026-11-13T22:47:30Z', 'Read', { file_path: '', offset: 690 }, { lines: [690, 754] }),
    call('2026-11-13T22:47:40Z', 'Read', { file_path: '' }, { lines: [1, 3] }), call('2026-11-13T22:47:41Z', 'Read', { file_path: '' }, { lines: [1, 3] }), ...extra];
}
function bind(rows, repo) {   // point each Read at its file, in order: note, note, handoff, handoff, then any extra Reads of the note
  const files = [NOTE, NOTE, LH, DZ];
  let k = 0;
  for (const r of rows.flat()) { const u = r.message && r.message.content && r.message.content[0]; if (u && u.type === 'tool_use' && u.name === 'Read' && !u.input.file_path) u.input.file_path = path.join(repo, files[k++] || NOTE); }
  return rows;
}
const NOW1646 = '2026-11-13T16:48:15-06:00';

test('WG-BAR (RED FIRST) the recorded 16:46 wake: 1-183 and 690-754 of 754 returned, the previous wake at 542 lines: DENY, naming 543-689', () => {
  const repo = room({ [NOTE]: N754, ...HANDOFFS });
  const g = gate(bind(wakeAt1646(), repo), { repo, now: NOW1646, ledger: [PREV(542)] });
  assert.ok(g.deny, JSON.stringify(g.row));
  assert.deepStrictEqual(g.row.missing, [NOTE]);
  assert.strictEqual(g.row.ranges[NOTE], '543-689');
  assert.strictEqual(g.row.start[NOTE], 543);
  assert.match(g.reason, /543-689/);
});
test('WG-BAR the same wake with 543-689 returned too: ALLOW', () => {
  const repo = room({ [NOTE]: N754, ...HANDOFFS });
  const g = gate(bind(wakeAt1646([call('2026-11-13T22:48:00Z', 'Read', { file_path: '', offset: 543, limit: 147 }, { lines: [543, 689] })]), repo), { repo, now: NOW1646, ledger: [PREV(542)] });
  assert.ok(!g.deny, g.reason);
  assert.strictEqual(g.row.kind, 'opened');
});
test('WG-BAR no previous wake known (no ledger row): the WHOLE note, so 184-689 are named', () => {
  const repo = room({ [NOTE]: N754, ...HANDOFFS });
  const g = gate(bind(wakeAt1646(), repo), { repo, now: NOW1646 });
  assert.ok(g.deny);
  assert.strictEqual(g.row.ranges[NOTE], '184-689');
  assert.strictEqual(g.row.start[NOTE], 1);
});
test('WG-BAR the previous wake is the same SESSION and the same NOTE, more than 10 s before this wake; the current wake\'s own row is never it', () => {
  const repo = room({ [NOTE]: N754, ...HANDOFFS });
  const rows = () => bind(wakeAt1646(), repo);
  const own = PREV(754, '2026-11-13T22:46:28.500Z');   // the body hook's row at THIS wake: it would make S = 755 and require nothing
  assert.strictEqual(gate(rows(), { repo, now: NOW1646, ledger: [PREV(542), own] }).row.ranges[NOTE], '543-689', 'the current wake\'s row is left out');
  assert.strictEqual(gate(rows(), { repo, now: NOW1646, ledger: [PREV(542, undefined, NOTE, 'another-session')] }).row.ranges[NOTE], '184-689', 'another session is not this seat\'s previous wake');
  assert.strictEqual(gate(rows(), { repo, now: NOW1646, ledger: [PREV(542, undefined, 'exo_memory/librarian/2026-11-12.md')] }).row.ranges[NOTE], '184-689', 'yesterday\'s note is not today\'s');
  assert.strictEqual(gate(rows(), { repo, now: NOW1646, ledger: [PREV(400, '2026-11-13T17:00:00Z'), PREV(542)] }).row.ranges[NOTE], '543-689', 'the latest earlier row');
  assert.strictEqual(gate(rows(), { repo, now: NOW1646, ledger: [PREV(900)] }).row.start[NOTE], 1, 'a recorded count beyond the note now (it shrank): whole');
});
test('WG-BAR the handoffs stay whole: a handoff read in part is named, with its missing lines', () => {
  const repo = room({ [NOTE]: N754, [LH]: textOf(10), [DZ]: textOf(3) });
  const g = gate(bind(wakeAt1646([call('2026-11-13T22:48:00Z', 'Read', { file_path: '', offset: 543 }, { lines: [543, 754] })]), repo), { repo, now: NOW1646, ledger: [PREV(542)] });
  assert.ok(g.deny);
  assert.deepStrictEqual(g.row.missing, [LH]);
  assert.strictEqual(g.row.ranges[LH], '4-10');
});
test('WG-BAR a shell cat covers the lines of the file its result actually holds, in order from line 1; a cut result covers only what came back', () => {
  const repo = room({ [NOTE]: textOf(5), [LH]: textOf(3), [DZ]: textOf(3) });
  const whole = textOf(3).trim();
  const rowsFor = (noteOut) => { n = 0; return [wakeRow('2026-11-13T22:46:27.900Z', 'resume'), sh('2026-11-13T22:47:00Z', `cd R && wc -l ${LH} ; cat ${LH}`, 1).map((r) => (r.type === 'user' ? { ...r, message: { role: 'user', content: [{ ...r.message.content[0], content: `3 ${LH}\n${whole}` }] } } : r)),
    sh('2026-11-13T22:47:01Z', `cat ${DZ}`, 1).map((r) => (r.type === 'user' ? { ...r, message: { role: 'user', content: [{ ...r.message.content[0], content: whole }] } } : r)),
    sh('2026-11-13T22:47:02Z', `cat ${NOTE}`, 1).map((r) => (r.type === 'user' ? { ...r, message: { role: 'user', content: [{ ...r.message.content[0], content: noteOut }] } } : r))]; };
  assert.ok(!gate(rowsFor(textOf(5).trim()), { repo, now: NOW1646 }).deny, 'a cat after another stage still covers the lines it returned');
  const cut = gate(rowsFor(textOf(2).trim() + '\n... [output truncated]'), { repo, now: NOW1646 });
  assert.ok(cut.deny);
  assert.strictEqual(cut.row.ranges[NOTE], '3-5');
});
test('WG-BAR a returned line counts only from a Read of THAT file: the same numbers from another file cover nothing', () => {
  const repo = room({ [NOTE]: N754, ...HANDOFFS });
  const rows = bind(wakeAt1646(), repo);
  rows[2][0].message.content[0].input.file_path = path.join(repo, 'exo_memory', 'librarian', '2026-11-12.md');   // the 1-183 Read was of yesterday's note
  const g = gate(rows, { repo, now: NOW1646 });
  assert.strictEqual(g.row.ranges[NOTE], '1-689');
});
