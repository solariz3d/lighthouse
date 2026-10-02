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

test('SCOPE: a tool that is not one of the two hand-back verbs is never gated, even with a text argument and no SOURCES line', () => {
  const dir = tmpDir();
  for (const tool of ['mcp__consonance__post_board', 'Bash', 'mcp__consonance__chair_inject']) {
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

test('REGISTERED: install.ps1 registers the gate on the SAME matcher as the second reader, after it, and no other hook shares an event with a matcher it does not own', () => {
  const src = fs.readFileSync(INSTALL, 'utf8').replace(/\r\n/g, '\n');
  const reg = (rel) => { const m = src.match(new RegExp("@\\{ Event = 'PreToolUse';\\s+Rel = '" + rel.replace(/[\\.]/g, '\\$&') + "';\\s+Runner = 'node';\\s*\\n\\s*Matcher = '([^']+)' \\}")); return m && { matcher: m[1], at: m.index }; };
  const sr = reg('hooks\\second-reader.js'), sg = reg('hooks\\sources-gate.js');
  assert.ok(sr && sg, 'a registration is missing');
  assert.strictEqual(sg.matcher, 'mcp__consonance__call_librarian|mcp__consonance__call_chair'); assert.strictEqual(sg.matcher, sr.matcher);
  assert.ok(sg.at > sr.at, 'the gate must register after the second reader');
  assert.ok(/From = 'consonance\\hooks\\sources-gate\.js';\s+To = 'hooks\\sources-gate\.js'/.test(src), 'the file entry is missing');
});

test('PLAN: the plan the hook cites exists', () => { assert.ok(fs.existsSync(PLAN)); });

test('HOOK SOURCE: it never writes the message text anywhere, never spawns a process, and never calls the network', () => {
  const src = fs.readFileSync(HOOK, 'utf8').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
  assert.ok(!/child_process|spawn\(|exec\(|https?\.request|fetch\(/.test(src), 'the gate must be inert beyond reading the transcript and writing its ledger');
});
