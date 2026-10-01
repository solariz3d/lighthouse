// second-reader.test.js - node --test consonance/hooks/second-reader.test.js   (D203; under the heavy-run lock, --test-concurrency=1)
//
// NO REAL MODEL CALL IN THIS FILE. The hook's worker is replaced by a stub through CONSONANCE_SECOND_READER_WORKER; the real worker is driven
// in-process with a mock `spawn` standing in for `claude -p`. The data dir is a temp dir every time. The fake secrets are built at runtime by
// concatenation (this repo is public; a literal key shape trips push protection).
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { EventEmitter } = require('events');
const { spawn, spawnSync } = require('child_process');

const HOOK = path.join(__dirname, 'second-reader.js');
const WORKER = path.join(__dirname, 'second-reader-worker.js');
const INSTALL = path.join(__dirname, '..', '..', 'dev', 'shell', 'install.ps1');
const PLAN = path.join(__dirname, '..', '..', 'exo_memory', 'loop', 'plan_second_reader_d203_2026-10-01.md');
const W = require('./second-reader-worker.js');
const H = require('./second-reader.js');
const LIB = 'mcp__consonance__call_librarian', CHAIR = 'mcp__consonance__call_chair';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const R = (n) => 'x'.repeat(n);
const OR_TOKEN = ['sk', 'or', 'v1', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4'].join('-');
const ANT_TOKEN = ['sk', 'ant', 'api03', 'Zq8rT1uV2wX3yA4bC5dE6fG7hJ8k'].join('-');
const VCK_TOKEN = ['vc', 'k_', 'A1b2C3d4E5f6G7h8I9j0K1l2'].join('');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

function tmpDir() { return fs.mkdtempSync(path.join(os.tmpdir(), 'sr-test-')); }
function rows(dir) { try { return fs.readFileSync(path.join(dir, 'second-reader.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)); } catch (_) { return []; } }

/** A stub worker: records that it ran (and what it saw), optionally sleeps, releases the lock like the real one, then exits. */
function writeStub(dir, { sleepMs = 0 } = {}) {
  const f = path.join(dir, 'stub-worker.js');
  fs.writeFileSync(f, `const fs=require('fs'),path=require('path');let b='';process.stdin.on('data',c=>b+=c).on('end',async()=>{const j=JSON.parse(b);
fs.writeFileSync(path.join(j.dir,'stub-ran-'+j.ringSha.slice(0,8)+'-'+process.pid+'.json'),JSON.stringify({run:process.env.CONSONANCE_SECOND_READER_RUN,tool:j.tool,seat:j.seat,textLen:j.text.length,token:j.token,ringSha:j.ringSha}));
await new Promise(r=>setTimeout(r,${sleepMs}));try{const p=path.join(j.dir,'second-reader.lock');if(JSON.parse(fs.readFileSync(p,'utf8')).token===j.token)fs.unlinkSync(p);}catch(_){}
fs.writeFileSync(path.join(j.dir,'stub-done-'+process.pid),'1');process.exit(0);});`);
  return f;
}
const stubRuns = (dir) => fs.readdirSync(dir).filter((f) => f.startsWith('stub-ran-')).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
const stubDone = (dir) => fs.readdirSync(dir).filter((f) => f.startsWith('stub-done-')).length;
async function waitFor(fn, ms = 6000) { const end = Date.now() + ms; while (Date.now() < end) { if (fn()) return true; await sleep(50); } return false; }

function envFor(dir, extra = {}) {
  const base = { ...process.env }; delete base.CONSONANCE_DREAM; delete base.CONSONANCE_SECOND_READER_RUN;   // the host's own variables must not leak into a test; `extra` may set them on purpose
  return { ...base, CONSONANCE_DATA: dir, CONSONANCE_PANE: 'A', CONSONANCE_SECOND_READER_WORKER: path.join(dir, 'stub-worker.js'), ...extra };
}
const payload = (tool, text, extra = {}) => JSON.stringify({ session_id: 's1', transcript_path: null, cwd: '.', hook_event_name: 'PreToolUse', tool_name: tool, tool_input: { text }, tool_use_id: 'toolu_x', ...extra });
function runHook(dir, input, extra = {}) {
  const t0 = Date.now(), r = spawnSync(process.execPath, [HOOK], { input, env: envFor(dir, extra), encoding: 'utf8', timeout: 15000 });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr, ms: Date.now() - t0 };
}

// ------------------------------------------------------------------ the matcher and the allow

test('MATCHER: the registered matcher (install.ps1) is exactly the two hand-back tools, in the docs\' exact-name syntax', () => {
  const src = fs.readFileSync(INSTALL, 'utf8'), line = src.split('\n').find((l) => /Rel\s*=\s*'hooks\\second-reader\.js'/.test(l) && /Event\s*=\s*'PreToolUse'/.test(l));
  assert.ok(line, 'no PreToolUse registration for hooks\\second-reader.js in install.ps1');
  const m = (src.split('\n').slice(src.split('\n').indexOf(line), src.split('\n').indexOf(line) + 3).join(' ').match(/Matcher\s*=\s*'([^']+)'/) || [])[1];
  assert.ok(m, 'no Matcher on the registration (an unmatched PreToolUse hook fires on every tool call)');
  assert.ok(/^[A-Za-z0-9_\- ,|]+$/.test(m), 'the matcher is not in the docs\' exact-name syntax (letters, digits, _, -, space, comma, pipe): ' + m);
  assert.deepStrictEqual(m.split(/[|,]/).map((s) => s.trim()).sort(), [CHAIR, LIB].sort());
  assert.deepStrictEqual([...H.RING_TOOLS].sort(), [CHAIR, LIB].sort());
});
test('MATCHER: the hook acts only on the two tools: every other tool name is a silent no-op (no worker, no row, no output)', async () => {
  const dir = tmpDir(); writeStub(dir);
  for (const tool of ['Bash', 'Read', 'mcp__consonance__post_board', 'mcp__consonance__chair_inject', 'mcp__consonance__raise_pull', 'mcp__consonance__read_board', 'mcp__other__call_librarian', '', undefined]) {
    const r = runHook(dir, JSON.stringify({ tool_name: tool, tool_input: { text: 'a message' } }));
    assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, '', `${tool} printed something`);
  }
  await sleep(300); assert.strictEqual(stubRuns(dir).length, 0, 'a worker ran for a non-ring tool'); assert.strictEqual(rows(dir).length, 0);
});
test('ALLOW IS IMMEDIATE: a ring on either tool returns in well under 1.5 s with exit 0 and NO output (no deny, no ask) while a slow worker is still running; the worker still runs, once', async () => {
  for (const tool of [LIB, CHAIR]) {
    const dir = tmpDir(); writeStub(dir, { sleepMs: 3500 });
    const r = runHook(dir, payload(tool, 'hand-back: see exo_memory/handback/x.md'));
    assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, ''); assert.ok(r.ms < 1500, `the hook took ${r.ms} ms`);
    assert.ok(await waitFor(() => stubRuns(dir).length === 1), 'the worker did not run'); assert.strictEqual(stubRuns(dir)[0].tool, tool);
    assert.ok(await waitFor(() => stubDone(dir) === 1, 8000), 'the stub worker did not finish: a process was left running');
    assert.ok(!fs.existsSync(path.join(dir, 'second-reader.lock')), 'the lock was not released');
  }
});
test('NEVER BLOCKS: no input the hook is given makes it print a decision or exit non-zero', () => {
  const dir = tmpDir(); writeStub(dir);
  for (const input of ['', 'not json', '{', '[]', 'null', '{"tool_name":"' + LIB + '"}', '{"tool_name":"' + LIB + '","tool_input":null}', payload(LIB, ''), payload(LIB, '   '), payload(LIB, 42)]) {
    const r = runHook(dir, input);
    assert.strictEqual(r.status, 0, `status ${r.status} for ${JSON.stringify(input).slice(0, 60)}`); assert.ok(!/permissionDecision|"deny"|"ask"/.test(r.stdout), r.stdout);
  }
});

// ------------------------------------------------------------------ fail open

test('FAIL OPEN: an unwritable data dir, an unresolvable one, and a missing worker all still allow, with no output', async () => {
  const dir = tmpDir(), file = path.join(dir, 'a-file'); fs.writeFileSync(file, 'x');
  let r = runHook(dir, payload(LIB, 'a message'), { CONSONANCE_DATA: file }); assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, '');
  r = runHook(dir, payload(LIB, 'a message'), { CONSONANCE_DATA: path.join(dir, 'does', 'not', 'exist') }); assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, '');
  r = runHook(dir, payload(LIB, 'a message'), { CONSONANCE_SECOND_READER_WORKER: path.join(dir, 'no-such-worker.js') }); assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, '');
});
test('FAIL OPEN: a worker that dies at once leaves a lock that the NEXT ring finds dead (pid gone) and replaces: a ring is not skipped forever', async () => {
  const dir = tmpDir(); writeStub(dir);
  const r1 = runHook(dir, payload(LIB, 'first'), { CONSONANCE_SECOND_READER_WORKER: path.join(dir, 'no-such-worker.js') }); assert.strictEqual(r1.status, 0);
  const lock = path.join(dir, 'second-reader.lock'); await waitFor(() => { try { return !H.pidAlive(JSON.parse(fs.readFileSync(lock, 'utf8')).pid); } catch (_) { return true; } }, 8000);
  const r2 = runHook(dir, payload(LIB, 'second')); assert.strictEqual(r2.status, 0);
  assert.ok(await waitFor(() => stubRuns(dir).length === 1), 'the second ring was not read'); assert.ok(!rows(dir).some((x) => x.status === 'skipped-busy'));
});
test('FAIL OPEN: a message with no text writes a skipped-no-text row and nothing else', () => {
  const dir = tmpDir(); writeStub(dir); const r = runHook(dir, payload(LIB, ''));
  assert.strictEqual(r.status, 0); assert.deepStrictEqual(rows(dir).map((x) => x.status), ['skipped-no-text']); assert.strictEqual(stubRuns(dir).length, 0);
});

// ------------------------------------------------------------------ the lock: one worker at a time

test('LOCK: a live lock gives skipped-busy (a row, no worker, no queue)', async () => {
  const dir = tmpDir(); writeStub(dir); fs.writeFileSync(path.join(dir, 'second-reader.lock'), JSON.stringify({ pid: process.pid, ts: Date.now(), token: 'held' }));
  const r = runHook(dir, payload(LIB, 'a ring while busy'));
  assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, '');
  const x = rows(dir); assert.strictEqual(x.length, 1); assert.strictEqual(x[0].status, 'skipped-busy'); assert.strictEqual(x[0].ringSha, sha('a ring while busy')); assert.strictEqual(x[0].tool, LIB); assert.strictEqual(x[0].seat, 'A');
  await sleep(300); assert.strictEqual(stubRuns(dir).length, 0); assert.ok(fs.existsSync(path.join(dir, 'second-reader.lock')), 'the live lock was taken');
});
test('LOCK: a lock whose pid is dead, or older than 180 s, is stale and is replaced', async () => {
  for (const held of [{ pid: 2147483000, ts: Date.now(), token: 'dead' }, { pid: process.pid, ts: Date.now() - 200000, token: 'old' }]) {
    const dir = tmpDir(); writeStub(dir); fs.writeFileSync(path.join(dir, 'second-reader.lock'), JSON.stringify(held));
    const r = runHook(dir, payload(LIB, 'after a stale lock')); assert.strictEqual(r.status, 0);
    assert.ok(await waitFor(() => stubRuns(dir).length === 1), `the stale lock ${held.token} blocked the ring`); assert.ok(!rows(dir).some((x) => x.status === 'skipped-busy'));
  }
});
test('LOCK: an unreadable lock file is stale', async () => {
  const dir = tmpDir(); writeStub(dir); fs.writeFileSync(path.join(dir, 'second-reader.lock'), '{ not json');
  runHook(dir, payload(LIB, 'x')); assert.ok(await waitFor(() => stubRuns(dir).length === 1));
});
test('LOCK: two rings at the same instant start exactly ONE worker; the other is skipped-busy', async () => {
  const dir = tmpDir(); writeStub(dir, { sleepMs: 1500 });
  const go = (text) => new Promise((resolve) => { const c = spawn(process.execPath, [HOOK], { env: envFor(dir), stdio: ['pipe', 'ignore', 'ignore'] }); c.on('close', resolve); c.stdin.end(payload(LIB, text)); });
  await Promise.all([go('ring one'), go('ring two')]);
  assert.ok(await waitFor(() => stubRuns(dir).length >= 1)); await sleep(400);
  assert.strictEqual(stubRuns(dir).length, 1, 'more than one worker ran'); assert.strictEqual(rows(dir).filter((x) => x.status === 'skipped-busy').length, 1);
  assert.ok(await waitFor(() => stubDone(dir) === 1, 8000));
});
test('LOCK: acquire is exclusive, release removes only the holder\'s own lock', () => {
  const dir = tmpDir(), a = H.acquireLock(dir); assert.ok(a); assert.strictEqual(H.acquireLock(dir), null);
  H.releaseLock(dir, 'someone-else'); assert.ok(fs.existsSync(path.join(dir, 'second-reader.lock'))); H.releaseLock(dir, a); assert.ok(!fs.existsSync(path.join(dir, 'second-reader.lock')));
});

// ------------------------------------------------------------------ reentrancy and the dream gate

test('REENTRANCY: the hook exits at once, silently, with no worker and no row, when CONSONANCE_SECOND_READER_RUN=1 (the worker\'s own environment)', async () => {
  const dir = tmpDir(); writeStub(dir); const r = runHook(dir, payload(LIB, 'a ring from inside the second reader'), { CONSONANCE_SECOND_READER_RUN: '1' });
  assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, ''); await sleep(300); assert.strictEqual(stubRuns(dir).length, 0); assert.strictEqual(rows(dir).length, 0); assert.ok(!fs.existsSync(path.join(dir, 'second-reader.lock')));
});
test('REENTRANCY: the worker the hook starts carries CONSONANCE_SECOND_READER_RUN=1', async () => {
  const dir = tmpDir(); writeStub(dir); runHook(dir, payload(CHAIR, 'x'));
  assert.ok(await waitFor(() => stubRuns(dir).length === 1)); assert.strictEqual(stubRuns(dir)[0].run, '1');
});
test('REENTRANCY: the model child is started with --safe-mode (no hooks), --strict-mcp-config and no --mcp-config (no MCP servers), --tools "" and the guard variable; never --bare (it ignores the subscription login)', async () => {
  const calls = [], spawnFn = (bin, args, opts) => { calls.push({ bin, args, opts }); return mockChild({ stdout: okJson({ flags: [] }) }); };
  const dir = tmpDir(); await W.processJob({ dir, tool: LIB, seat: 'A', text: 'm', ringSha: sha('m'), token: 't', transcriptPath: writeTranscript(dir, []) }, { spawnFn });
  assert.strictEqual(calls.length, 1); const { args, opts } = calls[0];
  for (const f of ['-p', '--safe-mode', '--strict-mcp-config', '--no-session-persistence', '--disable-slash-commands']) assert.ok(args.includes(f), `${f} missing: ${args.join(' ')}`);
  assert.strictEqual(args[args.indexOf('--model') + 1], 'claude-sonnet-5-5'); assert.strictEqual(args[args.indexOf('--tools') + 1], ''); assert.strictEqual(args[args.indexOf('--output-format') + 1], 'json');
  assert.ok(!args.includes('--bare') && !args.includes('--mcp-config') && !args.includes('--dangerously-skip-permissions'), args.join(' '));
  assert.strictEqual(opts.env.CONSONANCE_SECOND_READER_RUN, '1'); assert.notStrictEqual(opts.cwd, process.cwd(), 'the model child must not run in the repo');
});
test('DREAM GATE: with CONSONANCE_DREAM set the hook does nothing at all', async () => {
  const dir = tmpDir(); writeStub(dir); const r = runHook(dir, payload(LIB, 'x'), { CONSONANCE_DREAM: '1' });
  assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, ''); await sleep(300); assert.strictEqual(stubRuns(dir).length, 0); assert.strictEqual(rows(dir).length, 0);
});

// ------------------------------------------------------------------ the question, the turn, the row (the worker, in-process, spawn mocked)

function mockChild({ stdout = '', stderr = '', code = 0, hang = false } = {}) {
  const c = new EventEmitter(); c.stdout = new EventEmitter(); c.stderr = new EventEmitter(); c.pid = 4242; c.killed = false;
  c.stdin = { chunks: [], on() {}, end(d) { this.chunks.push(d); } }; c.kill = () => { c.killed = true; };
  if (!hang) setImmediate(() => { if (stdout) c.stdout.emit('data', Buffer.from(stdout)); if (stderr) c.stderr.emit('data', Buffer.from(stderr)); c.emit('close', code); });
  return c;
}
const okJson = (answer, extra = {}) => JSON.stringify({ type: 'result', is_error: false, result: JSON.stringify(answer), usage: { input_tokens: 1234, output_tokens: 56, cache_read_input_tokens: 7, cache_creation_input_tokens: 8 }, total_cost_usd: 0.0123, modelUsage: { 'claude-sonnet-5-5': {} }, ...extra });
function writeTranscript(dir, entries) { const f = path.join(dir, 'transcript.jsonl'); fs.writeFileSync(f, entries.map((e) => JSON.stringify(e)).join('\n') + '\n'); return f; }
const U = (text) => ({ message: { role: 'user', content: text } });
const A = (...blocks) => ({ message: { role: 'assistant', content: blocks } });
const call = (id, name, input) => ({ type: 'tool_use', id, name, input });
const res = (id, content) => ({ message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: id, content }] } });

test('QS: the question sent is the plan\'s registered text, VERBATIM (compared with the plan file)', () => {
  const plan = fs.readFileSync(PLAN, 'utf8').replace(/\r\n/g, '\n'), at = plan.indexOf('## The question (QS)'); assert.ok(at >= 0, 'the plan has no QS section');
  const block = plan.slice(at).split('\n').filter((l) => l.startsWith('> ')).map((l) => l.slice(2)).join('\n');
  assert.strictEqual(W.QS, block); const out = plan.slice(at).split('\n').find((l) => l.startsWith('Output: JSON')); assert.strictEqual(W.QS_OUTPUT, out);
  assert.ok(W.buildPrompt('m', 't').includes(W.QS)); assert.ok(W.buildPrompt('m', 't').includes(W.QS_OUTPUT));
});
test('TURN: only the tool calls and results after the seat\'s LAST prompt, in order; the ring\'s own call and earlier turns are left out; a tool-result user message is not a prompt', () => {
  const entries = [U('old prompt'), A(call('c0', 'Bash', { command: 'OLD COMMAND' })), res('c0', 'OLD RESULT'), U('the last prompt'),
    A(call('c1', 'Read', { file_path: 'a.txt' })), res('c1', 'CONTENT OF A'), A(call('c2', 'Bash', { command: 'node test' })), res('c2', [{ type: 'text', text: '12 pass' }]), A(call('toolu_x', LIB, { text: 'THE RING TEXT' }))];
  const t = W.buildTurn(entries, { toolUseId: 'toolu_x' });
  assert.ok(t.turn.includes('CALL Read') && t.turn.includes('CONTENT OF A') && t.turn.includes('12 pass')); assert.ok(!/OLD COMMAND|OLD RESULT|THE RING TEXT/.test(t.turn)); assert.strictEqual(t.calls, 2);
  assert.ok(t.turn.indexOf('a.txt') < t.turn.indexOf('node test'));
  assert.strictEqual(W.buildTurn(entries.slice(0, -1), { text: 'THE RING TEXT' }).calls, 2);   // no tool_use_id: the ring is matched by its text
});
test('TURN: a user message that carries a tool result AND a text block (a reminder riding with it) is still the harness answering a call, not the seat prompt', () => {
  const entries = [U('the real prompt'), A(call('c1', 'Read', { file_path: 'a.txt' })), { message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'c1', content: 'FILE BODY' }, { type: 'text', text: '<system-reminder>something</system-reminder>' }] } }, A(call('c2', 'Bash', { command: 'ls' })), res('c2', 'x')];
  const t = W.buildTurn(entries, {}); assert.strictEqual(t.calls, 2); assert.ok(t.turn.includes('FILE BODY') && t.turn.includes('CALL Read'));
});
test('TURN: results are clipped and the whole is bounded (calls are always kept, the oldest results are reduced first)', () => {
  const entries = [U('go')]; for (let i = 0; i < 80; i++) entries.push(A(call('c' + i, 'Bash', { command: 'run ' + i })), res('c' + i, R(5000)));
  const t = W.buildTurn(entries, {}); assert.ok(t.turn.length <= 60000, String(t.turn.length)); assert.strictEqual(t.calls, 80); assert.ok(t.turn.includes('run 79') && t.turn.includes('run 0'));
});
test('ROW: a good answer writes ONE ok row with the plan\'s fields, the tokens, the model, and the ring\'s sha; the message text is NOT in the log', async () => {
  const dir = tmpDir(), text = 'ZEBRA-UNIQUE The suite passed 12 tests. Also inferred: 3 files. See exo_memory/x.md:4.', tr = writeTranscript(dir, [U('go'), A(call('c1', 'Bash', { command: 'ls' })), res('c1', 'ok')]);
  const answer = { flags: [{ quote: 'The suite passed 12 tests.', names: 'the test run' }] };
  await W.processJob({ dir, tool: LIB, seat: 'B', text, ringSha: sha(text), token: 'tok', transcriptPath: tr }, { spawnFn: () => mockChild({ stdout: okJson(answer) }) });
  const x = rows(dir); assert.strictEqual(x.length, 1); const r = x[0];
  assert.strictEqual(r.status, 'ok'); assert.strictEqual(r.seat, 'B'); assert.strictEqual(r.tool, LIB); assert.strictEqual(r.ringSha, sha(text)); assert.deepStrictEqual(r.flags, [{ quote: 'The suite passed 12 tests.', names: 'the test run' }]);
  assert.strictEqual(r.model, 'claude-sonnet-5-5'); assert.strictEqual(typeof r.ms, 'number'); assert.deepStrictEqual(r.tokens, { in: 1234, out: 56, cacheRead: 7, cacheCreate: 8 }); assert.strictEqual(r.costUsd, 0.0123); assert.ok(typeof r.ts === 'string');
  const log = fs.readFileSync(path.join(dir, 'second-reader.jsonl'), 'utf8'); assert.ok(!log.includes('ZEBRA-UNIQUE') && !log.includes('Also inferred') && !log.includes('exo_memory/x.md'), 'message text reached the log');
});
test('ROW: a flag quote that is not in the message is dropped (counted, not stored), an empty list is a normal answer, and at most 20 flags are kept', async () => {
  const dir = tmpDir(), text = 'alpha beta. gamma delta.', tr = writeTranscript(dir, [U('go')]);
  await W.processJob({ dir, tool: LIB, seat: 'A', text, ringSha: sha(text), token: 't', transcriptPath: tr }, { spawnFn: () => mockChild({ stdout: okJson({ flags: [{ quote: 'alpha beta.', names: 'n' }, { quote: 'a sentence that was never sent', names: 'n' }] }) }) });
  let r = rows(dir)[0]; assert.strictEqual(r.flags.length, 1); assert.strictEqual(r.droppedFlags, 1);
  await W.processJob({ dir, tool: LIB, seat: 'A', text, ringSha: sha(text), token: 't', transcriptPath: tr }, { spawnFn: () => mockChild({ stdout: okJson({ flags: [] }) }) });
  r = rows(dir)[1]; assert.strictEqual(r.status, 'ok'); assert.deepStrictEqual(r.flags, []);
  const many = Array.from({ length: 30 }, (_, i) => ({ quote: 'alpha beta.', names: 'n' + i })); await W.processJob({ dir, tool: LIB, seat: 'A', text, ringSha: sha(text), token: 't', transcriptPath: tr }, { spawnFn: () => mockChild({ stdout: okJson({ flags: many }) }) });
  assert.strictEqual(rows(dir)[2].flags.length, 20);
});
test('ROW: a code-fenced answer and one with prose around the JSON are read; a CLI reply with is_error is an error row', async () => {
  const dir = tmpDir(), text = 'one two', tr = writeTranscript(dir, [U('go')]), run = (stdout) => W.processJob({ dir, tool: LIB, seat: 'A', text, ringSha: sha(text), token: 't', transcriptPath: tr }, { spawnFn: () => mockChild({ stdout }) });
  await run(JSON.stringify({ is_error: false, result: '```json\n{"flags":[{"quote":"one two","names":"n"}]}\n```', usage: {} })); assert.strictEqual(rows(dir)[0].status, 'ok');
  await run(JSON.stringify({ is_error: false, result: 'Here you go: {"flags":[]} done', usage: {} })); assert.strictEqual(rows(dir)[1].status, 'ok');
  await run(JSON.stringify({ is_error: true, result: 'Credit balance too low', usage: {} })); assert.strictEqual(rows(dir)[2].status, 'error'); assert.match(rows(dir)[2].error, /model-error/);
});

// ------------------------------------------------------------------ errors fail open: an error row and nothing else, and the lock is always released

test('ERRORS: no transcript, a non-zero exit, bad JSON, no flags array, a spawn that throws, and a spawn error each give ONE error row (status error) and release the lock', async () => {
  const text = 'a message'; const cases = [
    ['no transcript', { transcriptPath: '/no/such/transcript.jsonl' }, { spawnFn: () => { throw new Error('should not be called'); } }, /no-transcript/],
    ['non-zero exit', {}, { spawnFn: () => mockChild({ stdout: '', stderr: 'boom', code: 1 }) }, /exit 1/],
    ['not JSON', {}, { spawnFn: () => mockChild({ stdout: 'not json at all' }) }, /bad-json/],
    ['no flags', {}, { spawnFn: () => mockChild({ stdout: JSON.stringify({ result: '{"other":1}' }) }) }, /bad-json/],
    ['spawn throws', {}, { spawnFn: () => { throw Object.assign(new Error('x'), { code: 'ENOENT' }); } }, /ENOENT|spawn/],
    ['spawn error event', {}, { spawnFn: () => { const c = mockChild({ hang: true }); setImmediate(() => c.emit('error', Object.assign(new Error('x'), { code: 'EACCES' }))); return c; } }, /EACCES|spawn/],
  ];
  for (const [name, jobx, deps, re] of cases) {
    const dir = tmpDir(), tr = writeTranscript(dir, [U('go')]); fs.writeFileSync(path.join(dir, 'second-reader.lock'), JSON.stringify({ pid: process.pid, ts: Date.now(), token: 'tok' }));
    await W.processJob({ dir, tool: CHAIR, seat: 'C', text, ringSha: sha(text), token: 'tok', transcriptPath: tr, ...jobx }, deps);
    const x = rows(dir); assert.strictEqual(x.length, 1, name); assert.strictEqual(x[0].status, 'error', name); assert.match(x[0].error, re, name); assert.ok(!('flags' in x[0]), name + ': an error row carries no flags');
    assert.ok(!fs.existsSync(path.join(dir, 'second-reader.lock')), name + ': the lock was not released');
  }
});
test('ERRORS: a model that never answers is killed at the timeout, gives an error row "timeout", and the lock is released', async () => {
  const dir = tmpDir(), tr = writeTranscript(dir, [U('go')]), child = mockChild({ hang: true }); fs.writeFileSync(path.join(dir, 'second-reader.lock'), JSON.stringify({ pid: process.pid, ts: Date.now(), token: 'tok' }));
  const t0 = Date.now(); await W.processJob({ dir, tool: LIB, seat: 'A', text: 'm', ringSha: sha('m'), token: 'tok', transcriptPath: tr }, { spawnFn: () => child, timeoutMs: 60, noTaskkill: true });
  assert.ok(Date.now() - t0 < 2000); assert.ok(child.killed, 'the model child was not killed'); const x = rows(dir); assert.strictEqual(x.length, 1); assert.strictEqual(x[0].status, 'error'); assert.strictEqual(x[0].error, 'timeout'); assert.ok(!fs.existsSync(path.join(dir, 'second-reader.lock')));
  assert.strictEqual(W.TIMEOUT_MS, 120000, 'the registered timeout is 120 s');
});
test('ERRORS: the REAL worker process, started the way the hook starts it with a job whose transcript is missing, writes the error row, releases the lock and exits 0 (no model call is reached)', async () => {
  const dir = tmpDir(); fs.writeFileSync(path.join(dir, 'second-reader.lock'), JSON.stringify({ pid: process.pid, ts: Date.now(), token: 'tok' }));
  const job = { dir, tool: LIB, seat: 'A', text: 'm', ringSha: sha('m'), token: 'tok', transcriptPath: path.join(dir, 'nope.jsonl') };
  const r = spawnSync(process.execPath, [WORKER], { input: JSON.stringify(job), env: { ...process.env, CONSONANCE_SECOND_READER_RUN: '1' }, encoding: 'utf8', timeout: 15000 });
  assert.strictEqual(r.status, 0); const x = rows(dir); assert.strictEqual(x.length, 1); assert.strictEqual(x[0].error, 'no-transcript'); assert.ok(!fs.existsSync(path.join(dir, 'second-reader.lock')));
  assert.strictEqual(spawnSync(process.execPath, [WORKER], { input: 'garbage', encoding: 'utf8', timeout: 15000 }).status, 0, 'a garbage job must still exit 0');
});

// ------------------------------------------------------------------ secrets

test('SECRET SCAN: scrub removes sk-or-, sk-ant-, vck_ (and the other named shapes) from anything it is given', () => {
  for (const tok of [OR_TOKEN, ANT_TOKEN, VCK_TOKEN, 'sk-' + 'proj-' + R(24), 'gh' + 'p_' + 'A'.repeat(36), 'AK' + 'IA' + 'ABCDEFGHIJKLMNOP', 'Bearer ' + 'abcDEF123'.repeat(3), 'AI_GATEWAY_' + 'API_KEY=' + 'q'.repeat(40)]) {
    const out = W.scrub(`before ${tok} after`); assert.ok(!out.includes(tok), `${tok.slice(0, 8)}… survived`); assert.match(out, /before <redacted> after|before <redacted>/);
  }
  assert.strictEqual(W.scrub('plain prose with no secret'), 'plain prose with no secret'); assert.strictEqual(W.scrub(null), '');
});
test('SECRET SCAN: a key in the message never reaches the model, the stored flags, or an error row', async () => {
  const dir = tmpDir(), tr = writeTranscript(dir, [U('go'), A(call('c1', 'Bash', { command: 'echo ' + ANT_TOKEN })), res('c1', 'out ' + VCK_TOKEN)]);
  const text = `The key ${OR_TOKEN} was used and the count is 7 files.`, sent = []; const spawnFn = () => { const c = mockChild({ stdout: okJson({ flags: [{ quote: `The key ${OR_TOKEN} was used`, names: 'ANT ' + ANT_TOKEN }] }) }); const end = c.stdin.end; c.stdin.end = (d) => { sent.push(d); end.call(c.stdin, d); }; return c; };
  await W.processJob({ dir, tool: LIB, seat: 'A', text, ringSha: sha(text), token: 't', transcriptPath: tr }, { spawnFn });
  const prompt = sent.join(''); for (const tok of [OR_TOKEN, ANT_TOKEN, VCK_TOKEN]) assert.ok(!prompt.includes(tok), 'a secret was sent to the model');
  const log = fs.readFileSync(path.join(dir, 'second-reader.jsonl'), 'utf8'); for (const tok of [OR_TOKEN, ANT_TOKEN, VCK_TOKEN]) assert.ok(!log.includes(tok), 'a secret was stored');
  await W.processJob({ dir, tool: LIB, seat: 'A', text, ringSha: sha(text), token: 't', transcriptPath: tr }, { spawnFn: () => mockChild({ stdout: '', stderr: `auth failed for ${OR_TOKEN}`, code: 1 }) });
  const log2 = fs.readFileSync(path.join(dir, 'second-reader.jsonl'), 'utf8'); assert.ok(!log2.includes(OR_TOKEN), 'an error row stored a secret'); assert.strictEqual(rows(dir)[1].status, 'error');
});
test('SECRET SCAN: the hook\'s own rows (skipped-busy) carry the ring\'s sha and length class only: no text, no key', async () => {
  const dir = tmpDir(); writeStub(dir); fs.writeFileSync(path.join(dir, 'second-reader.lock'), JSON.stringify({ pid: process.pid, ts: Date.now(), token: 'held' }));
  runHook(dir, payload(LIB, `ZEBRA-UNIQUE ${OR_TOKEN}`)); const log = fs.readFileSync(path.join(dir, 'second-reader.jsonl'), 'utf8'); assert.ok(!/ZEBRA-UNIQUE|sk-or-/.test(log), log);
});
