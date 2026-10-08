// sources-gate.test.js - node --test consonance/hooks/sources-gate.test.js   (D212; under the heavy-run lock, --test-concurrency=1)
//
// NO MODEL CALL AND NO REAL TRANSCRIPT IN THIS FILE. Every transcript is a mock JSONL built here (the shapes are the ones the second reader's worker already
// reads: assistant tool_use blocks, user tool_result blocks, a user message with text for a prompt). The data dir is a temp dir every time. Fake secrets are
// built at runtime by concatenation (this repo is public).
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');

const HOOK = path.join(__dirname, 'sources-gate.js');
const SR_HOOK = path.join(__dirname, 'second-reader.js');
const INSTALL = path.join(__dirname, '..', '..', 'dev', 'shell', 'install.ps1');
const PLAN = path.join(__dirname, '..', '..', 'exo_memory', 'loop', 'plan_sources_gate_d212_2026-10-02.md');
const G = require('./sources-gate.js');
const W = require('./second-reader-worker.js');
const LIB = 'mcp__consonance__call_librarian', CHAIR = 'mcp__consonance__call_chair';
const OR_TOKEN = ['sk', 'or', 'v1', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4'].join('-');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

function tmpDir() { return fs.mkdtempSync(path.join(os.tmpdir(), 'sg-test-')); }
const rows = (dir) => { try { return fs.readFileSync(path.join(dir, 'sources-gate.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)); } catch (_) { return []; } };

// mock transcript entries
const USER = (text) => ({ type: 'user', message: { role: 'user', content: text } });
const ASSIST = (...blocks) => ({ type: 'assistant', message: { role: 'assistant', content: blocks } });
const USE = (id, name, input) => ({ type: 'tool_use', id, name, input });
const RESULT = (id, text = 'ok', err = false) => ({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content: text, ...(err ? { is_error: true } : {}) }] } });
// D214: the shapes Claude Code really writes (checked against this session's transcript): a background-task notification is a user entry with
// origin.kind "task-notification" and a content STRING that starts <task-notification>; a ring, a keep-warm and a typed keeper message carry origin.kind "human".
const NOTE_BODY = '<task-notification>\n<task-id>b1</task-id>\n<status>completed</status>\n<summary>Background command completed</summary>\n</task-notification>';
const NOTIF = (extra = {}) => ({ ...USER(NOTE_BODY), origin: { kind: 'task-notification', producer: 'session-task' }, ...extra });
const HUMAN = (text) => ({ ...USER(text), origin: { kind: 'human' }, promptSource: 'typed' });
const readCall = (id, p) => [ASSIST(USE(id, 'Read', { file_path: p })), RESULT(id, 'file text')];
const bashCall = (id, cmd, out = 'out', err = false) => [ASSIST(USE(id, 'Bash', { command: cmd })), RESULT(id, out, err)];
const writeTranscript = (dir, entries) => { const f = path.join(dir, 'transcript.jsonl'); fs.writeFileSync(f, entries.map((e) => JSON.stringify(e)).join('\n') + '\n'); return f; };

const RING_ID = 'toolu_ring';
const ring = (text, tool = LIB) => ({ tool, text });
const withSources = (line) => 'Pointer: exo_memory/handback/p-x_2026-10-02.md\n\n' + line + '\n\nNEXT: librarian collate when all are in';

function payloadOf(dir, entries, { tool = LIB, text, cwd = 'C:/work', extra = {} } = {}) {
  const tp = entries ? writeTranscript(dir, entries) : null;
  return JSON.stringify({ session_id: 's1', transcript_path: tp, cwd, hook_event_name: 'PreToolUse', tool_name: tool, tool_input: { text }, tool_use_id: RING_ID, ...extra });
}
function envFor(dir, extra = {}) {
  const base = { ...process.env }; delete base.CONSONANCE_DREAM; delete base.CONSONANCE_SECOND_READER_RUN;
  return { ...base, CONSONANCE_DATA: dir, CONSONANCE_PANE: 'A', ...extra };
}
function runGate(dir, input, extra = {}) {
  const t0 = Date.now(), r = spawnSync(process.execPath, [HOOK], { input, env: envFor(dir, extra), encoding: 'utf8', timeout: 20000 });
  let out = null; try { out = r.stdout.trim() ? JSON.parse(r.stdout) : null; } catch (_) { out = 'UNPARSEABLE:' + r.stdout; }
  return { status: r.status, out, stderr: r.stderr, ms: Date.now() - t0 };
}
const isDeny = (r) => r.out && r.out.hookSpecificOutput && r.out.hookSpecificOutput.permissionDecision === 'deny';
const reasonOf = (r) => (r.out && r.out.hookSpecificOutput && r.out.hookSpecificOutput.permissionDecisionReason) || '';

// ------------------------------------------------------------------ the deny contract and the slot

test('DENY CONTRACT: a ring with no SOURCES line is denied with exit 0 and the documented JSON, naming the fix and the format', () => {
  const dir = tmpDir(), r = runGate(dir, payloadOf(dir, [USER('go'), ...readCall('t1', 'C:/work/a.md')], { text: 'Pointer: exo_memory/handback/p-x_2026-10-02.md\n\nNEXT: librarian collate' }));
  assert.strictEqual(r.status, 0);
  assert.ok(isDeny(r), JSON.stringify(r.out));
  assert.strictEqual(r.out.hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.deepStrictEqual(Object.keys(r.out), ['hookSpecificOutput']);
  const why = reasonOf(r);
  assert.ok(/no SOURCES: line/.test(why) && /NOT delivered/.test(why) && /SOURCES: none \(no state claims\)/.test(why) && /re-send/.test(why), why);
});

test('MISSING: a ring with an empty SOURCES line is denied', () => {
  const dir = tmpDir(), r = runGate(dir, payloadOf(dir, [USER('go')], { text: withSources('SOURCES:') }));
  assert.ok(isDeny(r)); assert.ok(/empty/.test(reasonOf(r)), reasonOf(r));
});

test('UNMATCHED: an item that matches no call of the turn is denied, and the reason names exactly that item and no matched one', () => {
  const dir = tmpDir();
  const r = runGate(dir, payloadOf(dir, [USER('go'), ...readCall('t1', 'C:/work/a.md')], { text: withSources('SOURCES: C:/work/a.md · C:/work/never-opened.md') }));
  assert.ok(isDeny(r), JSON.stringify(r.out));
  const why = reasonOf(r);
  assert.ok(why.includes('never-opened.md'), why); assert.ok(!why.includes('"C:/work/a.md"'), 'a matched item was named as unmatched: ' + why);
  assert.ok(/1 of 2/.test(why), why);
});

test('ALLOW: a Read path of this turn matches; the hook prints nothing and exits 0', () => {
  const dir = tmpDir(), r = runGate(dir, payloadOf(dir, [USER('go'), ...readCall('t1', 'C:\\work\\a.md')], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.strictEqual(r.status, 0); assert.strictEqual(r.out, null);
  const row = rows(dir).pop(); assert.strictEqual(row.decision, 'allow'); assert.strictEqual(row.kind, 'matched');
});

test('ALLOW: a relative item matches an absolute Read path by its tail, and the same item matches a Bash command that names it', () => {
  const dir = tmpDir();
  let r = runGate(dir, payloadOf(dir, [USER('go'), ...readCall('t1', 'C:/Users/n/lighthouse/exo_memory/loop/plan.md')], { text: withSources('SOURCES: exo_memory/loop/plan.md') }));
  assert.strictEqual(r.out, null, JSON.stringify(r.out));
  r = runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', 'cd /c/Users/n/lighthouse && sha256sum exo_memory/loop/plan.md')], { text: withSources('SOURCES: exo_memory/loop/plan.md · `sha256sum exo_memory/loop/plan.md`') }));
  assert.strictEqual(r.out, null, JSON.stringify(r.out));
});

test('ALLOW: an absolute item matches a Bash command that opened it by a shorter tail (after a cd), and a relative Read path resolves against the call\'s cwd', () => {
  const dir = tmpDir();
  let r = runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', 'cd /c/Users/n/lighthouse/exo_memory && cat loop/plan.md')], { text: withSources('SOURCES: C:/Users/n/lighthouse/exo_memory/loop/plan.md') }));
  assert.strictEqual(r.out, null, JSON.stringify(r.out));
  r = runGate(dir, payloadOf(dir, [USER('go'), ...readCall('t1', 'a.md')], { cwd: 'C:/work', text: withSources('SOURCES: C:/work/a.md') }));
  assert.strictEqual(r.out, null, JSON.stringify(r.out));
});

test('ALLOW: a WebFetch of the item URL counts; a different URL does not', () => {
  const dir = tmpDir(), t = [USER('go'), ASSIST(USE('t1', 'WebFetch', { url: 'https://code.claude.com/docs/en/hooks' })), RESULT('t1', 'page')];
  assert.strictEqual(runGate(dir, payloadOf(dir, t, { text: withSources('SOURCES: https://code.claude.com/docs/en/hooks') })).out, null);
  assert.ok(isDeny(runGate(dir, payloadOf(dir, t, { text: withSources('SOURCES: https://code.claude.com/docs/en/other') }))));
});

test('ALLOW: the allow row carries the items, redacted', () => {
  const dir = tmpDir(), cmd = 'cat C:/work/k.md ' + OR_TOKEN;
  const r = runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', cmd)], { text: withSources('SOURCES: `' + cmd + '`') }));
  assert.strictEqual(r.out, null, JSON.stringify(r.out));
  const raw = fs.readFileSync(path.join(dir, 'sources-gate.jsonl'), 'utf8'); assert.ok(!raw.includes(OR_TOKEN)); assert.ok(raw.includes('<redacted>'));
});

test('SCOPE: a tool that is not a hand-back verb or the dispatch verb is never gated, even with a text argument and no SOURCES line', () => {
  const dir = tmpDir();
  for (const tool of ['mcp__consonance__post_board', 'Bash', 'mcp__consonance__chair_phase']) {
    const r = runGate(dir, payloadOf(dir, [USER('go')], { tool, text: 'no sources here' }));
    assert.strictEqual(r.status, 0, tool); assert.strictEqual(r.out, null, tool + ' was gated');
  }
  assert.deepStrictEqual(rows(dir), [], 'a non-ring tool left a ledger row');
});

test('TURN: a tool-result message that carries a reminder text block is still a tool result, not a prompt', () => {
  const dir = tmpDir(), rem = { type: 'user', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: 't2', content: 'ok' }, { type: 'text', text: '<system-reminder>carried with a result</system-reminder>' }] } };
  const t = [USER('go'), ...readCall('t1', 'C:/work/a.md'), ASSIST(USE('t2', 'Bash', { command: 'ls' })), rem, ...readCall('t3', 'C:/work/b.md')];
  assert.strictEqual(runGate(dir, payloadOf(dir, t, { text: withSources('SOURCES: C:/work/a.md · C:/work/b.md') })).out, null, 'a result carrying a reminder cut the turn');
});

const SRC_A = withSources('SOURCES: C:/work/a.md');
test('D214 NOTIFICATION: a task notification between the Read and the ring is NOT a boundary: the read still counts (the live false deny)', () => {
  const dir = tmpDir(), t = [USER('go'), ...readCall('t1', 'C:/work/a.md'), NOTIF(), NOTIF()];
  const r = runGate(dir, payloadOf(dir, t, { text: SRC_A }));
  assert.strictEqual(r.out, null, 'a notification cut the turn: ' + JSON.stringify(r.out));
  assert.strictEqual(rows(dir).pop().decision, 'allow');
});

test('D214 NOTIFICATION: a KEEPER message between the Read and the ring IS a boundary: the read is stale and the ring is denied', () => {
  const dir = tmpDir();
  for (const mk of [() => HUMAN('actually do the other thing'), () => USER('a keeper message with no origin recorded')]) {
    const r = runGate(dir, payloadOf(dir, [USER('go'), ...readCall('t1', 'C:/work/a.md'), NOTIF(), mk()], { text: SRC_A }));
    assert.ok(isDeny(r), 'a keeper message did not cut the turn'); assert.ok(reasonOf(r).includes('a.md'));
  }
});

test('D214 NOTIFICATION: a PANE or CHAIR ring between the Read and the ring IS a boundary, and so is a keep-warm', () => {
  const dir = tmpDir();
  for (const text of ['[pane:B] D210 hand-back is at exo_memory/handback/p-x.md', '\n\n<pasted_content id="e589">\n[chair:MAIN] D214 a 4th commit\n</pasted_content id="e589">', '[keep-warm, from the chair — not the keeper] Reply with exactly: ok']) {
    const r = runGate(dir, payloadOf(dir, [USER('go'), ...readCall('t1', 'C:/work/a.md'), NOTIF(), HUMAN(text)], { text: SRC_A }));
    assert.ok(isDeny(r), 'a ring or keep-warm did not cut the turn: ' + text.slice(0, 30));
  }
});

test('D214 NOTIFICATION: a message that MIXES a notification with keeper text is the keeper\'s, a boundary; an unterminated notification is too', () => {
  const dir = tmpDir();
  for (const text of [NOTE_BODY + '\nplease stop what you are doing', 'one word first ' + NOTE_BODY, '<task-notification>\n<task-id>b1</task-id>\n(never closed)']) {
    for (const origin of [{ kind: 'task-notification' }, undefined]) {
      const mixed = { ...USER(text), ...(origin ? { origin } : {}) };
      const r = runGate(dir, payloadOf(dir, [USER('go'), ...readCall('t1', 'C:/work/a.md'), mixed], { text: SRC_A }));
      assert.ok(isDeny(r), 'a mixed or unterminated message was read as machine-only: ' + JSON.stringify(text.slice(0, 40)) + ' origin ' + JSON.stringify(origin));
    }
  }
});

test('D214 NOTIFICATION: a message Claude Code records as typed by a human is a boundary even if it contains only a notification-shaped paste', () => {
  const dir = tmpDir(), pasted = { ...USER(NOTE_BODY), origin: { kind: 'human' } };
  assert.ok(isDeny(runGate(dir, payloadOf(dir, [USER('go'), ...readCall('t1', 'C:/work/a.md'), pasted], { text: SRC_A }))));
});

test('D214 NOTIFICATION: the recognised machine-only forms are not boundaries: a bare text notification, the reminder-wrapped system form, hook output beside one, and a banner line', () => {
  const dir = tmpDir();
  const forms = [
    USER(NOTE_BODY),                                                                                                   // text only, no origin recorded
    USER('<system-reminder>\n[SYSTEM NOTIFICATION - NOT USER INPUT]\nThis is an automated background-task event.\n<task-notification>\n<task-id>b1</task-id>\n</task-notification>\n</system-reminder>'),
    USER(NOTE_BODY + '\n<user-prompt-submit-hook>\n[pulse] Fri 2:19 PM\n</user-prompt-submit-hook>'),                  // hook output beside it
    USER('[SYSTEM NOTIFICATION - NOT USER INPUT]\n<system-reminder>queued</system-reminder>'),                          // the banner outside a reminder
    { ...USER([{ type: 'text', text: NOTE_BODY }]), origin: { kind: 'task-notification' } },                           // content as a block array
  ];
  for (const f of forms) {
    const r = runGate(dir, payloadOf(dir, [USER('go'), ...readCall('t1', 'C:/work/a.md'), f], { text: SRC_A }));
    assert.strictEqual(r.out, null, 'a machine-only notification cut the turn: ' + JSON.stringify(f.message.content).slice(0, 90));
  }
});

test('D214 NOTIFICATION: narrow on purpose: a message with no notification marker (a bare reminder) is still a boundary, while one the harness marks as a task notification and that holds only wrappers is not', () => {
  const dir = tmpDir();
  const bare = USER('<system-reminder>some reminder</system-reminder>');
  assert.ok(isDeny(runGate(dir, payloadOf(dir, [USER('go'), ...readCall('t1', 'C:/work/a.md'), bare], { text: SRC_A }))), 'a bare reminder was read as a notification');
  const marked = { ...USER('<system-reminder>queued</system-reminder>'), origin: { kind: 'task-notification' } };
  assert.strictEqual(runGate(dir, payloadOf(dir, [USER('go'), ...readCall('t1', 'C:/work/a.md'), marked], { text: SRC_A })).out, null);
});

test('D214 NOTIFICATION: a notification does not hide a stale source: read, then a keeper prompt, then a notification, then the ring is denied; read after the prompt and before the notification is allowed', () => {
  const dir = tmpDir(), t = [USER('first'), ...readCall('t1', 'C:/work/a.md'), HUMAN('second'), NOTIF()];
  assert.ok(isDeny(runGate(dir, payloadOf(dir, t, { text: SRC_A }))));
  assert.strictEqual(runGate(dir, payloadOf(dir, [USER('first'), HUMAN('second'), ...readCall('t1', 'C:/work/a.md'), NOTIF()], { text: SRC_A })).out, null);
});

test('D214 NOTIFICATION: a long notification-only tail does not stop the backward read early (the real prompt is further back than the first window)', () => {
  const dir = tmpDir(), big = 'x'.repeat(5 * 1024 * 1024);
  const t = [USER('go'), ...readCall('t1', 'C:/work/a.md'), ASSIST(USE('t2', 'Bash', { command: 'cat huge' })), RESULT('t2', big), NOTIF(), NOTIF()];
  assert.strictEqual(runGate(dir, payloadOf(dir, t, { text: SRC_A })).out, null, 'the read stopped at a notification');
});

test('TURN: a subagent (sidechain) read does not count, and a sidechain or meta user message does not start a new turn', () => {
  const dir = tmpDir(), side = (e) => ({ ...e, isSidechain: true });
  const sc = [USER('go'), ...readCall('t1', 'C:/work/a.md').map(side)];
  assert.ok(isDeny(runGate(dir, payloadOf(dir, sc, { text: withSources('SOURCES: C:/work/a.md') }))), 'a sidechain read counted');
  const t1 = [USER('go'), ...readCall('t1', 'C:/work/a.md'), side(USER('subagent prompt')), ...readCall('t2', 'C:/work/b.md')];
  assert.strictEqual(runGate(dir, payloadOf(dir, t1, { text: withSources('SOURCES: C:/work/a.md · C:/work/b.md') })).out, null, 'a sidechain prompt cut the turn');
  const t2 = [USER('go'), ...readCall('t1', 'C:/work/a.md'), { ...USER('caveat text'), isMeta: true }, ...readCall('t2', 'C:/work/b.md')];
  assert.strictEqual(runGate(dir, payloadOf(dir, t2, { text: withSources('SOURCES: C:/work/a.md · C:/work/b.md') })).out, null, 'a meta message cut the turn');
});

test('ALLOW: a quoted command item matches the Bash and the PowerShell call that ran it (case and spacing normalised)', () => {
  const dir = tmpDir();
  let r = runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', 'git   log -1 --format=%h')], { text: withSources('SOURCES: `git log -1 --format=%h`') }));
  assert.strictEqual(r.out, null, JSON.stringify(r.out));
  const ps = [USER('go'), ASSIST(USE('t2', 'PowerShell', { command: 'Get-Content C:\\work\\a.md | Select -First 3' })), RESULT('t2')];
  r = runGate(dir, payloadOf(dir, ps, { text: withSources('SOURCES: C:/work/a.md') }));
  assert.strictEqual(r.out, null, JSON.stringify(r.out));
});

test('ALLOW: "SOURCES: none (no state claims)" is allowed and logged as none', () => {
  const dir = tmpDir(), r = runGate(dir, payloadOf(dir, [USER('go')], { text: withSources('SOURCES: none (no state claims)') }));
  assert.strictEqual(r.out, null);
  const row = rows(dir).pop(); assert.strictEqual(row.decision, 'allow'); assert.strictEqual(row.kind, 'none'); assert.strictEqual(row.nItems, 0);
});

test('ALLOW: the same ring through call_chair is gated the same way', () => {
  const dir = tmpDir();
  assert.ok(isDeny(runGate(dir, payloadOf(dir, [USER('go')], { tool: CHAIR, text: 'no sources here' }))));
  assert.strictEqual(runGate(dir, payloadOf(dir, [USER('go')], { tool: CHAIR, text: withSources('SOURCES: none (no state claims)') })).out, null);
});

// ------------------------------------------------------------------ this turn only, and what counts as opened

test('TURN BOUNDARY: an item read in a PREVIOUS turn is denied; read again in this turn it is allowed', () => {
  const dir = tmpDir(), t = [USER('first prompt'), ...readCall('t1', 'C:/work/a.md'), ASSIST({ type: 'text', text: 'done' }), USER('second prompt')];
  const r = runGate(dir, payloadOf(dir, t, { text: withSources('SOURCES: C:/work/a.md') }));
  assert.ok(isDeny(r), JSON.stringify(r.out)); assert.ok(reasonOf(r).includes('a.md'));
  const again = runGate(dir, payloadOf(dir, [...t, ...readCall('t2', 'C:/work/a.md')], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.strictEqual(again.out, null, JSON.stringify(again.out));
});

test('TURN BOUNDARY: a tool result is not a prompt, so a long turn keeps its early reads', () => {
  const dir = tmpDir(), t = [USER('go'), ...readCall('t1', 'C:/work/a.md'), ...bashCall('t2', 'ls'), ...bashCall('t3', 'pwd'), ...readCall('t4', 'C:/work/b.md')];
  assert.strictEqual(runGate(dir, payloadOf(dir, t, { text: withSources('SOURCES: C:/work/a.md · C:/work/b.md') })).out, null);
});

test('TURN BOUNDARY: a boundary further back than the first read window is still found (the tail doubles)', () => {
  const dir = tmpDir(), big = 'x'.repeat(5 * 1024 * 1024);
  const t = [USER('go'), ...readCall('t1', 'C:/work/a.md'), ASSIST(USE('t2', 'Bash', { command: 'cat huge' })), RESULT('t2', big), ...readCall('t3', 'C:/work/b.md')];
  const r = runGate(dir, payloadOf(dir, t, { text: withSources('SOURCES: C:/work/a.md · C:/work/b.md') }));
  assert.strictEqual(r.out, null, JSON.stringify(r.out).slice(0, 300));
});

test('GAMING: a path merely mentioned in a Bash echo does not count as opened; an echo of it before a real read in another segment does not hide the read', () => {
  const dir = tmpDir();
  let r = runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', 'echo C:/work/a.md')], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.ok(isDeny(r), 'an echo counted as opened');
  r = runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', 'printf "%s" C:/work/a.md; Write-Host C:/work/a.md')], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.ok(isDeny(r), 'printf/Write-Host counted as opened');
  r = runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', 'echo start && cat C:/work/a.md')], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.strictEqual(r.out, null, 'a real cat after an echo was refused: ' + JSON.stringify(r.out));
});

test('D214 METADATA: every metadata-only leader (ls, stat, test, [, file, dir, Get-Item, Test-Path ...) is refused as having opened a path, leader by leader', () => {
  const dir = tmpDir();
  for (const lead of G.METADATA) {
    const cmd = lead === '[' ? '[ -f C:/work/a.md ]' : lead === '[[' ? '[[ -f C:/work/a.md ]]' : lead + ' C:/work/a.md';
    const r = runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', cmd)], { text: withSources('SOURCES: C:/work/a.md') }));
    assert.ok(isDeny(r), 'a metadata leader counted as opened: ' + cmd);
  }
  assert.deepStrictEqual([...G.METADATA].sort(), ['[', '[[', 'dir', 'du', 'file', 'get-childitem', 'get-item', 'gci', 'll', 'la', 'ls', 'resolve-path', 'stat', 'test', 'test-path', 'tree'].sort(), 'the explicit list changed');
});

test('D214 METADATA: an ls does not hide a real read in another segment, and wc (which reads the bytes) and a plain cat DO open', () => {
  const dir = tmpDir();
  let r = runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', 'ls -la C:/work/a.md && cat C:/work/a.md')], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.strictEqual(r.out, null, 'a real cat after an ls was refused: ' + JSON.stringify(r.out));
  r = runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', 'wc -l C:/work/a.md')], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.strictEqual(r.out, null, 'wc is listed as opening, deliberately');
  r = runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', 'ls -la C:/work/a.md | head -3')], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.ok(isDeny(r), 'ls piped to head counted');
  r = runGate(dir, payloadOf(dir, [USER('go'), ASSIST(USE('t1', 'PowerShell', { command: 'Get-Item C:\\work\\a.md; Test-Path C:\\work\\a.md' })), RESULT('t1')], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.ok(isDeny(r), 'PowerShell Get-Item / Test-Path counted');
});

test('D214 REASON: an unmatched deny names the same-message race, the later-message fix and the read-back after a write', () => {
  const dir = tmpDir(), r = runGate(dir, payloadOf(dir, [USER('go'), ASSIST(USE('t1', 'Read', { file_path: 'C:/work/a.md' }), USE(RING_ID, LIB, { text: 'x' }))], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.ok(isDeny(r)); const why = reasonOf(r);
  assert.ok(/SAME message as this ring/.test(why), why); assert.ok(/LATER message, after its sources have returned/.test(why), why);
  assert.ok(/WROTE this turn needs a read-back/.test(why), why); assert.ok(/metadata-only command such as ls or stat/.test(why), why);
});

test('D214 SPELLING: the guidance says ONE thing (repo-relative or C:\\ for items, a repo-relative pointer), and a /c/ item still matches a call spelled either way', () => {
  const dir = tmpDir(), r = runGate(dir, payloadOf(dir, [USER('go')], { text: withSources('SOURCES: exo_memory/x.md') }));
  const why = reasonOf(r);
  assert.ok(/repo-relative or as a C:\\.* path, not \/c\//.test(why), why); assert.ok(/POINTER in the ring's prose is repo-relative/.test(why), why);
  assert.ok(/a \/c\/ spelling still matches here, but the running digest gate has refused it/.test(why), why);
  assert.strictEqual(runGate(dir, payloadOf(dir, [USER('go'), ...readCall('t1', 'C:\\Users\\n\\x.md')], { text: withSources('SOURCES: /c/Users/n/x.md') })).out, null, 'a /c/ item no longer matches a C:\\ Read');
  assert.strictEqual(runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', 'cat /c/Users/n/x.md')], { text: withSources('SOURCES: C:\\Users\\n\\x.md') })).out, null, 'a C:\\ item no longer matches a /c/ command');
});

test('GAMING: a comment line in a script does not count as opened', () => {
  const dir = tmpDir(), r = runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', '# C:/work/a.md\nls')], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.ok(isDeny(r));
});

test('OPENED MEANS COMPLETED: an errored call, and a call with no recorded result, do not count', () => {
  const dir = tmpDir();
  let r = runGate(dir, payloadOf(dir, [USER('go'), ASSIST(USE('t1', 'Read', { file_path: 'C:/work/a.md' })), RESULT('t1', 'File does not exist', true)], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.ok(isDeny(r), 'an errored Read counted');
  r = runGate(dir, payloadOf(dir, [USER('go'), ASSIST(USE('t1', 'Read', { file_path: 'C:/work/a.md' }), USE(RING_ID, LIB, { text: 'x' }))], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.ok(isDeny(r), 'a Read issued in the SAME message as the ring (no result yet) counted');
  r = runGate(dir, payloadOf(dir, [USER('go'), ...bashCall('t1', 'cat C:/work/a.md', 'cat: no such file', true)], { text: withSources('SOURCES: C:/work/a.md') }));
  assert.ok(isDeny(r), 'a failed Bash counted');
});

test('GREP / GLOB: a Grep on the file counts; a Grep over a directory counts only when its result names the item; a Glob counts when its result names it', () => {
  const dir = tmpDir();
  const grepFile = [USER('go'), ASSIST(USE('t1', 'Grep', { pattern: 'x', path: 'C:/work/a.md' })), RESULT('t1', 'match')];
  assert.strictEqual(runGate(dir, payloadOf(dir, grepFile, { text: withSources('SOURCES: C:/work/a.md') })).out, null);
  const grepDirHit = [USER('go'), ASSIST(USE('t1', 'Grep', { pattern: 'x', path: 'C:/work' })), RESULT('t1', 'C:/work/a.md\nC:/work/z.md')];
  assert.strictEqual(runGate(dir, payloadOf(dir, grepDirHit, { text: withSources('SOURCES: C:/work/a.md') })).out, null);
  const grepDirMiss = [USER('go'), ASSIST(USE('t1', 'Grep', { pattern: 'x', path: 'C:/work' })), RESULT('t1', 'C:/work/z.md')];
  assert.ok(isDeny(runGate(dir, payloadOf(dir, grepDirMiss, { text: withSources('SOURCES: C:/work/a.md') }))));
  const glob = [USER('go'), ASSIST(USE('t1', 'Glob', { pattern: '**/*.md', path: 'C:/work' })), RESULT('t1', 'C:/work/a.md')];
  assert.strictEqual(runGate(dir, payloadOf(dir, glob, { text: withSources('SOURCES: C:/work/a.md') })).out, null);
});

test('ITEM FORMS: path:line, a trailing (annotation), markdown emphasis and a backticked path all parse to the path', () => {
  const dir = tmpDir(), t = [USER('go'), ...readCall('t1', 'C:/work/a.md'), ...readCall('t2', 'C:/work/b.md'), ...readCall('t3', 'C:/work/c.md'), ...readCall('t4', 'C:/work/d.md')];
  const r = runGate(dir, payloadOf(dir, t, { text: withSources('**SOURCES:** C:/work/a.md:12-40 · C:/work/b.md (the plan) · `C:/work/c.md` · C:/work/d.md#L10') }));
  assert.strictEqual(r.out, null, JSON.stringify(r.out));
});

test('PARSE: continuation lines belong to the slot until a blank line or NEXT:, and a `·` inside backticks does not split', () => {
  const s = G.parseSources('SOURCES: a.md · `echo a · b`\n- b.md\n- c.md\n\nNEXT: x');
  assert.deepStrictEqual(s.items, ['a.md', 'echo a · b', 'b.md', 'c.md']);
  assert.deepStrictEqual(G.parseSources('SOURCES: a.md\nNEXT: x').items, ['a.md']);
  assert.deepStrictEqual(G.parseSources('SOURCES: none').none, true);
  assert.deepStrictEqual(G.parseSources('SOURCES:\n\nNEXT: x').items, []);
  assert.strictEqual(G.parseSources('nothing here').present, false);
});

// ------------------------------------------------------------------ never loses a hand-back; fails open

test('LEDGER: a deny writes the seat, the pointer line and the pointer paths BEFORE it denies, and never the message', () => {
  const dir = tmpDir(), text = 'D212 hand-back is at exo_memory/handback/p-d212-A_2026-10-02.md\nsecret-ish body line that must not be logged\n\nNEXT: librarian x';
  const r = runGate(dir, payloadOf(dir, [USER('go')], { text }));
  assert.ok(isDeny(r));
  const row = rows(dir).pop();
  assert.strictEqual(row.decision, 'deny'); assert.strictEqual(row.seat, 'A'); assert.strictEqual(row.tool, LIB); assert.strictEqual(row.ringSha, sha(text)); assert.strictEqual(row.kind, 'missing');
  assert.strictEqual(row.pointer, 'D212 hand-back is at exo_memory/handback/p-d212-A_2026-10-02.md');
  assert.deepStrictEqual(row.pointerPaths, ['exo_memory/handback/p-d212-A_2026-10-02.md']);
  assert.ok(!JSON.stringify(row).includes('secret-ish body'), 'the message body was logged');
  assert.ok(reasonOf(r).includes(sha(text).slice(0, 12)), 'the reason does not name the ring it logged');
});

test('LEDGER: a key shape in the pointer line or an item is redacted in the row', () => {
  const dir = tmpDir(), text = 'pointer with ' + OR_TOKEN + ' in it\nSOURCES: `echo ' + OR_TOKEN + '`';
  runGate(dir, payloadOf(dir, [USER('go')], { text }));
  const raw = fs.readFileSync(path.join(dir, 'sources-gate.jsonl'), 'utf8');
  assert.ok(!raw.includes(OR_TOKEN), 'a key reached the ledger'); assert.ok(raw.includes('<redacted>'));
});

test('LEDGER: the secret shapes are the second reader worker\'s, byte for byte (drift guard)', () => {
  assert.deepStrictEqual(G.SECRET_SHAPES.map(String), W.SECRET_SHAPES.map(String));
});

test('NEVER LOSE A HAND-BACK: with no data dir, or a ledger that cannot be written, a ring that would be denied is ALLOWED', () => {
  const dir = tmpDir(), input = payloadOf(dir, [USER('go')], { text: 'no sources' });
  const home = tmpDir(), r1 = spawnSync(process.execPath, [HOOK], { input, env: { ...envFor(dir), CONSONANCE_DATA: '', USERPROFILE: home, HOME: home }, encoding: 'utf8' });
  assert.strictEqual(r1.status, 0); assert.strictEqual(r1.stdout.trim(), '', 'denied with nowhere to record the pointer');
  const blocked = path.join(dir, 'blocked'); fs.mkdirSync(path.join(blocked, 'sources-gate.jsonl'), { recursive: true });   // a directory where the ledger file should be
  const r2 = runGate(blocked, input);
  assert.strictEqual(r2.status, 0); assert.strictEqual(r2.out, null, 'denied although the pointer could not be recorded');
});

test('FAIL OPEN: a malformed transcript, a missing transcript path and a missing file allow, each with an error row', () => {
  const dir = tmpDir(), text = withSources('SOURCES: C:/work/a.md');
  const bad = path.join(dir, 'bad.jsonl'); fs.writeFileSync(bad, '{not json\n\u0000\u0001 garbage\n');
  let r = runGate(dir, JSON.stringify({ tool_name: LIB, tool_input: { text }, transcript_path: bad, tool_use_id: RING_ID, cwd: '.' }));
  assert.strictEqual(r.status, 0); assert.strictEqual(r.out, null, 'a transcript that could not be parsed denied a ring');
  assert.strictEqual(rows(dir).pop().decision, 'error'); assert.ok(/unparseable/.test(rows(dir).pop().error));
  r = runGate(dir, JSON.stringify({ tool_name: LIB, tool_input: { text }, transcript_path: path.join(dir, 'absent.jsonl'), tool_use_id: RING_ID, cwd: '.' }));
  assert.strictEqual(r.status, 0); assert.strictEqual(r.out, null);
  assert.strictEqual(rows(dir).pop().decision, 'error'); assert.ok(/transcript/.test(rows(dir).pop().error));
  r = runGate(dir, JSON.stringify({ tool_name: LIB, tool_input: { text }, tool_use_id: RING_ID, cwd: '.' }));
  assert.strictEqual(r.out, null); assert.strictEqual(rows(dir).pop().decision, 'error');
});

test('FAIL OPEN: unparseable stdin, a non-ring tool, a ring with no text, and the reentrancy and dream guards all exit 0 with no decision', () => {
  const dir = tmpDir();
  for (const input of ['not json', JSON.stringify({ tool_name: 'Bash', tool_input: { command: 'x' } }), JSON.stringify({ tool_name: LIB, tool_input: {} }), '']) {
    const r = runGate(dir, input); assert.strictEqual(r.status, 0, input); assert.strictEqual(r.out, null, input);
  }
  const would = payloadOf(dir, [USER('go')], { text: 'no sources' });
  assert.strictEqual(runGate(dir, would, { CONSONANCE_SECOND_READER_RUN: '1' }).out, null);
  assert.strictEqual(runGate(dir, would, { CONSONANCE_DREAM: '1' }).out, null);
  assert.ok(isDeny(runGate(dir, would)), 'control: the same input without a guard is denied');
});

// ------------------------------------------------------------------ the loop: deny, fix, re-send; and the second reader

test('IN-TURN: a denied ring, then the read, then the re-send in the SAME turn is allowed (the deny came back as an errored tool result)', () => {
  const dir = tmpDir(), text = withSources('SOURCES: C:/work/a.md');
  const first = [USER('go'), ASSIST(USE('r1', LIB, { text }))];
  assert.ok(isDeny(runGate(dir, payloadOf(dir, first, { text, extra: { tool_use_id: 'r1' } }))));
  const second = [...first, RESULT('r1', 'SOURCES gate: ...', true), ...readCall('t2', 'C:/work/a.md'), ASSIST(USE('r2', LIB, { text }))];
  const r = runGate(dir, payloadOf(dir, second, { text, extra: { tool_use_id: 'r2' } }));
  assert.strictEqual(r.out, null, JSON.stringify(r.out));
  assert.deepStrictEqual(rows(dir).map((x) => x.decision), ['deny', 'allow']);
  assert.strictEqual(rows(dir)[0].ringSha, rows(dir)[1].ringSha);
});

test('THE SECOND READER STILL FIRES: both hooks run on the same denied ring in parallel; the gate denies and the second reader still starts its worker and prints nothing', async () => {
  const dir = tmpDir(), text = 'ring with no sources line';
  const stub = path.join(dir, 'stub-worker.js');
  fs.writeFileSync(stub, "const fs=require('fs'),path=require('path');let b='';process.stdin.on('data',c=>b+=c).on('end',()=>{const j=JSON.parse(b);fs.writeFileSync(path.join(j.dir,'stub-ran-'+j.ringSha.slice(0,8)),'1');try{fs.unlinkSync(path.join(j.dir,'second-reader.lock'));}catch(_){}process.exit(0);});");
  const input = payloadOf(dir, [USER('go')], { text });
  const env = envFor(dir, { CONSONANCE_SECOND_READER_WORKER: stub });
  const run1 = (file) => new Promise((resolve) => { const c = spawn(process.execPath, [file], { env, stdio: ['pipe', 'pipe', 'pipe'] }); let out = ''; c.stdout.on('data', (d) => { out += d; }); c.on('close', (code) => resolve({ code, out })); c.stdin.end(input); });
  const [gate, sr] = await Promise.all([run1(HOOK), run1(SR_HOOK)]);
  assert.strictEqual(gate.code, 0); assert.ok(/"permissionDecision":"deny"/.test(gate.out), gate.out);
  assert.strictEqual(sr.code, 0); assert.strictEqual(sr.out.trim(), '', 'the second reader printed a decision');
  const end = Date.now() + 6000; while (Date.now() < end && !fs.existsSync(path.join(dir, 'stub-ran-' + sha(text).slice(0, 8)))) await new Promise((r) => setTimeout(r, 50));
  assert.ok(fs.existsSync(path.join(dir, 'stub-ran-' + sha(text).slice(0, 8))), 'the second reader did not start its worker on the denied ring');
});

// ------------------------------------------------------------------ registration

test('REGISTERED: install.ps1 registers the gate on the two hand-back verbs PLUS chair_inject (D215), the second reader\'s matcher is UNCHANGED, and the gate registers after it', () => {
  const src = fs.readFileSync(INSTALL, 'utf8').replace(/\r\n/g, '\n');
  const reg = (rel) => { const m = src.match(new RegExp("@\\{ Event = 'PreToolUse';\\s+Rel = '" + rel.replace(/[\\.]/g, '\\$&') + "';\\s+Runner = 'node';\\s*\\n\\s*Matcher = '([^']+)' \\}")); return m && { matcher: m[1], at: m.index }; };
  const sr = reg('hooks\\second-reader.js'), sg = reg('hooks\\sources-gate.js');
  assert.ok(sr && sg, 'a registration is missing');
  assert.strictEqual(sr.matcher, 'mcp__consonance__call_librarian|mcp__consonance__call_chair', 'the second reader\'s matcher changed');
  assert.strictEqual(sg.matcher, 'mcp__consonance__call_librarian|mcp__consonance__call_chair|mcp__consonance__chair_inject');
  assert.deepStrictEqual(sg.matcher.split('|').sort(), [...sr.matcher.split('|'), 'mcp__consonance__chair_inject'].sort());
  assert.ok(sg.at > sr.at, 'the gate must register after the second reader');
  assert.ok(/From = 'consonance\\hooks\\sources-gate\.js';\s+To = 'hooks\\sources-gate\.js'/.test(src), 'the file entry is missing');
});

// ------------------------------------------------------------------ D215: the chair's DISPATCHES (chair_inject: { target, text, token })
// The TOKEN is a secret. The tests carry a per-run value built at runtime and require that it never reaches the ledger, the reason, stdout or stderr.
const INJECT = 'mcp__consonance__chair_inject';
const TOKEN = ['tok', crypto.randomBytes(6).toString('hex'), crypto.randomBytes(6).toString('hex')].join('-');
function dispatchPayload(dir, entries, { text, token = TOKEN, target = 'A', cwd = 'C:/work' } = {}) {
  const tp = entries ? writeTranscript(dir, entries) : null;
  return JSON.stringify({ session_id: 's1', transcript_path: tp, cwd, hook_event_name: 'PreToolUse', tool_name: INJECT, tool_input: { target, text, token }, tool_use_id: RING_ID });
}
const ledgerRaw = (dir) => { try { return fs.readFileSync(path.join(dir, 'sources-gate.jsonl'), 'utf8'); } catch (_) { return ''; } };
const DISPATCH_OK = (line) => 'D215 packet for A: build the thing. Plan: exo_memory/loop/plan_x.md\n\n' + line + '\n\nNEXT: A reports when done';

test('D215 DISPATCH: chair_inject with no SOURCES line is denied, in-turn, and the reason says it is a DISPATCH that was not delivered', () => {
  const dir = tmpDir(), r = runGate(dir, dispatchPayload(dir, [USER('go'), ...readCall('t1', 'C:/work/a.md')], { text: 'Do the thing. NEXT: A reports' }));
  assert.strictEqual(r.status, 0); assert.ok(isDeny(r), JSON.stringify(r.out));
  const why = reasonOf(r); assert.ok(/the dispatch has no SOURCES: line/.test(why), why); assert.ok(/This dispatch was NOT delivered/.test(why) && /re-send the same dispatch/.test(why), why);
  const row = rows(dir).pop(); assert.strictEqual(row.tool, INJECT); assert.strictEqual(row.decision, 'deny'); assert.strictEqual(row.kind, 'missing'); assert.strictEqual(row.target, 'A');
});

test('D215 DISPATCH: chair_inject with matched items is allowed (a command and a path), and the ring-shaped form to a pane works the same', () => {
  const dir = tmpDir(), t = [USER('go'), ...readCall('t1', 'C:/work/plan_x.md'), ...bashCall('t2', 'git log -1 --format=%h')];
  const r = runGate(dir, dispatchPayload(dir, t, { text: DISPATCH_OK('SOURCES: C:/work/plan_x.md · `git log -1 --format=%h`') }));
  assert.strictEqual(r.status, 0); assert.strictEqual(r.out, null, JSON.stringify(r.out));
  const row = rows(dir).pop(); assert.strictEqual(row.decision, 'allow'); assert.strictEqual(row.kind, 'matched'); assert.strictEqual(row.tool, INJECT); assert.strictEqual(row.nItems, 2);
});

test('D215 DISPATCH: a pane\'s hand-back read in the same turn, then a dispatch citing it, is allowed; an unmatched item is denied naming exactly it', () => {
  const dir = tmpDir(), hb = 'C:/Users/n/lighthouse/exo_memory/handback/p-d210-B_2026-10-02.md';
  const t = [USER('go'), ...readCall('t1', hb)];
  assert.strictEqual(runGate(dir, dispatchPayload(dir, t, { text: DISPATCH_OK('SOURCES: exo_memory/handback/p-d210-B_2026-10-02.md') })).out, null);
  const r = runGate(dir, dispatchPayload(dir, t, { text: DISPATCH_OK('SOURCES: exo_memory/handback/p-d210-B_2026-10-02.md · exo_memory/handback/p-d210-C_2026-10-02.md') }));
  assert.ok(isDeny(r)); assert.ok(reasonOf(r).includes('p-d210-C_2026-10-02.md') && !reasonOf(r).includes('"exo_memory/handback/p-d210-B_2026-10-02.md"'), reasonOf(r));
});

test('D215 DISPATCH: "SOURCES: none (no state claims)" stays valid for a dispatch that only routes work, and is logged as none', () => {
  const dir = tmpDir(), r = runGate(dir, dispatchPayload(dir, [USER('go')], { text: DISPATCH_OK('SOURCES: none (no state claims)') }));
  assert.strictEqual(r.out, null); const row = rows(dir).pop(); assert.strictEqual(row.kind, 'none'); assert.strictEqual(row.tool, INJECT);
});

test('D215 DISPATCH: the dispatch obeys the turn rules: a source read before a KEEPER message is stale, and a notification between is not a boundary', () => {
  const dir = tmpDir(), text = DISPATCH_OK('SOURCES: C:/work/a.md');
  assert.ok(isDeny(runGate(dir, dispatchPayload(dir, [USER('go'), ...readCall('t1', 'C:/work/a.md'), HUMAN('a keeper message')], { text }))));
  assert.strictEqual(runGate(dir, dispatchPayload(dir, [USER('go'), ...readCall('t1', 'C:/work/a.md'), NOTIF()], { text })).out, null);
});

test('D215 SECOND READER: chair_inject does NOT trigger the second reader (its tool set and its registered matcher are unchanged); a hand-back ring still does', async () => {
  const dir = tmpDir(), stub = path.join(dir, 'stub-worker.js');
  fs.writeFileSync(stub, "const fs=require('fs'),path=require('path');let b='';process.stdin.on('data',c=>b+=c).on('end',()=>{const j=JSON.parse(b);fs.writeFileSync(path.join(j.dir,'stub-ran-'+j.tool),'1');try{fs.unlinkSync(path.join(j.dir,'second-reader.lock'));}catch(_){}process.exit(0);});");
  const SRH = require('./second-reader.js');
  assert.ok(!SRH.RING_TOOLS.has(INJECT), 'the second reader\'s tool set gained chair_inject'); assert.deepStrictEqual([...SRH.RING_TOOLS].sort(), [CHAIR, LIB].sort());
  const env = envFor(dir, { CONSONANCE_SECOND_READER_WORKER: stub });
  const r1 = spawnSync(process.execPath, [SR_HOOK], { input: dispatchPayload(dir, [USER('go')], { text: 'a dispatch' }), env, encoding: 'utf8', timeout: 15000 });
  assert.strictEqual(r1.status, 0); assert.strictEqual(r1.stdout.trim(), '');
  await new Promise((r) => setTimeout(r, 800));
  assert.ok(!fs.existsSync(path.join(dir, 'stub-ran-' + INJECT)), 'the second reader started a worker on a dispatch'); assert.ok(!fs.existsSync(path.join(dir, 'second-reader.jsonl')), 'the second reader logged a dispatch');
  spawnSync(process.execPath, [SR_HOOK], { input: payloadOf(dir, [USER('go')], { text: 'a hand-back ring' }), env, encoding: 'utf8', timeout: 15000 });
  const end = Date.now() + 6000; while (Date.now() < end && !fs.existsSync(path.join(dir, 'stub-ran-' + LIB))) await new Promise((r) => setTimeout(r, 50));
  assert.ok(fs.existsSync(path.join(dir, 'stub-ran-' + LIB)), 'control: the second reader no longer fires on a hand-back ring');
});

test('D215 TOKEN: the chair_inject token never appears in sources-gate.jsonl, in the deny reason, on stdout or on stderr: not on a deny, an allow, a none, an empty text or an error, nor when the token is pasted into the text or an item', () => {
  const dir = tmpDir(), seen = [];
  const cases = [
    { text: 'Do the thing, no sources line' },                                                        // deny: missing
    { text: DISPATCH_OK('SOURCES: C:/work/never-opened.md') },                                           // deny: unmatched
    { text: 'first line carries the token ' + TOKEN + ' by mistake\n\nSOURCES: `echo ' + TOKEN + '`\n\nNEXT: A x' },   // the token inside the pointer line AND an item
    { text: DISPATCH_OK('SOURCES: none (no state claims)') },                                            // allow: none
    { text: DISPATCH_OK('SOURCES: C:/work/a.md') },                                                      // allow: matched
    { text: DISPATCH_OK('SOURCES: `cat C:/work/k.md ' + TOKEN + '`') },                                  // allow: an item that carries the token (the call really ran with it)
    { text: DISPATCH_OK('SOURCES: none (no state claims)'), target: TOKEN },                              // the target field itself is the token
    { text: '   ' },                                                                                     // skipped: no text
  ];
  for (const c of cases) {
    const r = spawnSync(process.execPath, [HOOK], { input: dispatchPayload(dir, [USER('go'), ...readCall('t1', 'C:/work/a.md'), ...bashCall('t2', 'cat C:/work/k.md ' + TOKEN)], c), env: envFor(dir), encoding: 'utf8', timeout: 20000 });
    seen.push(r.stdout, r.stderr);
  }
  const bad = spawnSync(process.execPath, [HOOK], { input: dispatchPayload(dir, null, { text: DISPATCH_OK('SOURCES: C:/work/a.md') }), env: envFor(dir), encoding: 'utf8', timeout: 20000 });   // no transcript: an error row
  seen.push(bad.stdout, bad.stderr);
  assert.ok(rows(dir).some((x) => x.decision === 'error'), 'the error case did not run');
  assert.ok(!ledgerRaw(dir).includes(TOKEN), 'the token reached the ledger'); assert.ok(!seen.join('\n').includes(TOKEN), 'the token reached stdout or stderr');
  assert.ok(ledgerRaw(dir).includes('<redacted-token>'), 'control: the token pasted into the text was not even redacted');
  for (const row of rows(dir)) assert.ok(!('token' in row) && !JSON.stringify(row).includes('tok-'), 'a row carries a token-shaped field: ' + JSON.stringify(row));
});

test('D215 TOKEN: the ring sha is of the TEXT alone (the token is not in what is hashed), and the hook source never reads tool_input.token into a row', () => {
  const dir = tmpDir(), text = DISPATCH_OK('SOURCES: none (no state claims)');
  runGate(dir, dispatchPayload(dir, [USER('go')], { text, token: 'one-token-aaaa' })); runGate(dir, dispatchPayload(dir, [USER('go')], { text, token: 'another-token-bbbb' }));
  const rs = rows(dir); assert.strictEqual(rs[0].ringSha, sha(text)); assert.strictEqual(rs[1].ringSha, sha(text));
  const src = fs.readFileSync(HOOK, 'utf8').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
  assert.strictEqual(src.split('\n').filter((l) => /tool_input\.token/.test(l)).length, 1, 'tool_input.token is read on exactly one line (the redaction setup)');
});

test('D215 TOKEN: redactToken takes every occurrence out, leaves short or absent tokens alone, and a missing token is a no-op', () => {
  assert.strictEqual(G.redactToken('a ' + TOKEN + ' b ' + TOKEN, TOKEN), 'a <redacted-token> b <redacted-token>');
  assert.strictEqual(G.redactToken('abc', 'abc'), 'abc', 'a token under 4 characters would redact ordinary text'); assert.strictEqual(G.redactToken('x', ''), 'x'); assert.strictEqual(G.redactToken('x', undefined), 'x');
});

test('PLAN: the plan the hook cites exists', () => { assert.ok(fs.existsSync(PLAN)); });

test('HOOK SOURCE: it never writes the message text anywhere, never spawns a process, and never calls the network', () => {
  const src = fs.readFileSync(HOOK, 'utf8').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
  assert.ok(!/child_process|spawn\(|exec\(|https?\.request|fetch\(/.test(src), 'the gate must be inert beyond reading the transcript and writing its ledger');
});

// D273 (the consumer): every SOURCES refusal names GATES.md, at the path it has on this machine.
test('D273: each deny names GATES.md section 1, at the path it is given; an allow carries no pointer', () => {
  const p = 'C:/repo/consonance/GATES.md';
  for (const text of ['no sources line here', 'x\nSOURCES:\nNEXT: librarian x when y', 'x\nSOURCES: C:/never/opened.md\nNEXT: librarian x when y']) {
    const d = G.decide(text, [], 'C:/work', 'L.jsonl', 'abc', 'ring', p);
    assert.strictEqual(d.decision, 'deny', text);
    assert.ok(d.reason.includes('How this gate works and why: ' + p + ', section 1 (SOURCES).'), d.reason);
  }
  assert.ok(G.decide('no sources line here', [], 'C:/work').reason.includes(G.GATES_REL), 'the default names the repo-relative file');
  assert.strictEqual(G.decide('x\nSOURCES: none (no state claims)', [], 'C:/work', 'L', 'a', 'ring', p).reason, '');
});
test('D273: gatesDocFrom resolves <repo>/consonance/GATES.md from room_path when the file is there, and names it relative otherwise', () => {
  const room = path.join('C:', 'r', 'exo_memory', 'BOOT.md'), want = path.join('C:', 'r', 'consonance', 'GATES.md');
  assert.strictEqual(G.gatesDocFrom(room, (p) => p === want), want);
  assert.strictEqual(G.gatesDocFrom(room, () => false), G.GATES_REL + ' (in the Consonance repository)', 'a missing file is not named as if it were there');
  assert.strictEqual(G.gatesDocFrom(path.join('C:', 'rooms', 'mine', 'CLAUDE.md'), () => true), G.GATES_REL + ' (in the Consonance repository)', 'a room outside a repo');
  assert.strictEqual(G.gatesDocFrom('', () => true), G.GATES_REL + ' (in the Consonance repository)');
  assert.strictEqual(G.gatesDocFrom(room, () => { throw new Error('EACCES'); }), G.GATES_REL + ' (in the Consonance repository)', 'an error checking the file falls back, never throws');
});
