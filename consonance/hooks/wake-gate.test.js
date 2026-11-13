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

/** A room repo holding `files` (repo-relative -> size in bytes), each with mtime `at`. */
function room(files, at = '2026-11-13T08:43:40-06:00') {
  const r = tmp('wg-repo-');
  for (const [rel, size] of Object.entries(files)) {
    const f = path.join(r, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, 'x'.repeat(size));
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
  if (result) rows.push({ type: 'user', timestamp: t, message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, is_error: !!result.err, content: result.text || 'x'.repeat(result.len || 1) }] } });
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
    sh('2026-11-13T14:43:43.870Z', `cd R && wc -l ${LH} ${DZ} ${NOTE} ; cat ${LH}`, 7892),
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

function gate(rows, { repo, machine = 'D', now = '2026-11-13T08:46:27-06:00', payload = {}, env = {}, cwd } = {}) {
  const data = tmp('wg-data-');
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
  assert.match(g.reason, /allow_large/);
  assert.match(g.reason, /LATER message/);
});

test('W4 the recorded 2026-11-11 ring: three plain Reads with BACKSLASH paths satisfy (b); the note was not opened, so (a) still refuses', () => {
  n = 0;
  const repo = room({ 'exo_memory/librarian/2026-11-11.md': 50000, 'exo_memory/loop/handoff_t180_2026-11-11-L.md': 4314,
    'exo_memory/loop/handoff_lighthouse_2026-11-11-L.md': 5148, 'exo_memory/loop/handoff_dreamzone3_2026-11-11-L.md': 9087 }, '2026-11-11T08:30:00-06:00');
  const win = (rel) => repo.replace(/\//g, '\\') + '\\' + rel.replace(/\//g, '\\');
  const rows = [wakeRow('2026-11-11T14:34:29.993Z', 'resume'),
    call('2026-11-11T14:37:46.438Z', 'Read', { file_path: win('exo_memory/loop/handoff_t180_2026-11-11-L.md') }, { len: 4314 }),
    call('2026-11-11T14:37:46.874Z', 'Read', { file_path: win('exo_memory/loop/handoff_lighthouse_2026-11-11-L.md') }, { len: 5148 }),
    call('2026-11-11T14:37:47.364Z', 'Read', { file_path: win('exo_memory/loop/handoff_dreamzone3_2026-11-11-L.md') }, { len: 9087 }),
    call('2026-11-11T14:40:02.901Z', 'Read', { file_path: win('exo_memory/briefs/dreamzone2_the_game.md'), offset: 1, limit: 80 }, { len: 16449 })];
  const g = gate(rows, { repo, now: '2026-11-11T09:13:22-06:00' });
  assert.ok(g.deny);
  assert.deepStrictEqual(g.row.missing, ['exo_memory/librarian/2026-11-11.md']);
  assert.strictEqual(g.row.satisfied.length, 3, 'all three handoffs, read by backslash paths');
});

test('W4 ALLOW: every required file opened whole since the wake (a Read with allow_large, a one-stage cat, a Get-Content)', () => {
  n = 0;
  const repo = R1446();
  const rows = [wakeRow('2026-11-13T14:42:47.130Z', 'resume'), call('2026-11-13T14:43:00Z', 'Read', { file_path: path.join(repo, NOTE), allow_large: true }, { len: 61668 }),
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
  const rows = [call('2026-11-13T13:00:00Z', 'Read', { file_path: path.join(repo, NOTE) }), compactRow('2026-11-13T14:00:00Z'), wakeRow('2026-11-13T14:00:01Z', 'compact')];
  const g = gate(rows, { repo });
  assert.ok(g.deny);
  assert.strictEqual(g.row.wake.kind, 'compact');
});

test('W4 a RESUME wake: a whole open after the last compaction counts while the file is older than the open; an own append after it is refused and recorded as own-append', () => {
  const rows = () => { n = 0; return [compactRow('2026-11-13T12:00:00Z'), call('2026-11-13T13:00:00Z', 'Read', { file_path: '' }), wakeRow('2026-11-13T14:42:47Z', 'resume')]; };
  const older = room({ [NOTE]: 100 }, '2026-11-13T06:00:00-06:00');   // 12:00Z, before the 13:00Z open
  const r1 = rows(); r1[1][0].message.content[0].input.file_path = path.join(older, NOTE);
  assert.ok(!gate(r1, { repo: older }).deny, 'the conversation still holds it');
  const newer = room({ [NOTE]: 100 }, '2026-11-13T08:30:00-06:00');   // 14:30Z, after the open: the seat appended
  const r2 = rows(); r2[1][0].message.content[0].input.file_path = path.join(newer, NOTE);
  const g = gate(r2, { repo: newer });
  assert.ok(g.deny);
  assert.strictEqual(g.row.kind, 'own-append');
  assert.deepStrictEqual(g.row.ownAppend, [NOTE]);
});

test('W4 a RESUME wake: a whole open from BEFORE the last compaction does not count (the summary dropped it), though the file is unchanged since', () => {
  n = 0;
  const repo = room({ [NOTE]: 100 }, '2026-11-13T04:00:00-06:00');   // 10:00Z, older than every row below
  const rows = [call('2026-11-13T11:00:00Z', 'Read', { file_path: path.join(repo, NOTE) }), compactRow('2026-11-13T12:00:00Z'),
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
