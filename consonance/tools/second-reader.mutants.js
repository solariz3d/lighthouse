#!/usr/bin/env node
'use strict';
// second-reader.mutants.js - run with: node consonance/tools/second-reader.mutants.js [--only <n>]     (D203; holds the heavy-run lock itself)
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. This breaks the second reader one guard at a time and requires second-reader.test.js
// to go RED for each. On a hook a surviving mutant is a ring that is blocked or delayed, a worker started twice, a model child that can start a hook or
// an MCP server, or a message or a key written to the log.
//
// (This file lives in consonance/tools, not consonance/hooks: install.ps1 audits EVERY non-test file in a directory the manifest draws from, and a mutants harness is not a hook.)
// THE TRACKED SOURCES ARE NEVER WRITTEN. A temp tree mirrors the three paths the suite reads (consonance/hooks, dev/shell/install.ps1, the plan under
// exo_memory/loop); the copy is mutated, the copy's suite runs, the tree is removed. Every anchor must occur EXACTLY ONCE or the row is NOT APPLIED
// (counted as such, never as a catch). No model is ever called (the suite mocks the spawn), and the child suite's environment has the room's own
// variables removed.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = path.join(__dirname, '..', 'hooks'), REPO = path.join(__dirname, '..', '..');   // HERE is where the sources and the suite live
const HOOK = 'second-reader.js', WORKER = 'second-reader-worker.js', SUITE = 'second-reader.test.js';
const PLAN = path.join('exo_memory', 'loop', 'plan_second_reader_d203_2026-10-01.md'), INSTALL = path.join('dev', 'shell', 'install.ps1');

const MUTANTS = [
  // ---- the hook: allow, matcher, lock, reentrancy ----
  ['hook: reentrancy guard removed', HOOK, "if (process.env[RUN_ENV] === '1') return process.exit(0);", 'if (false) return process.exit(0);'],
  ['hook: the worker is started WITHOUT the guard variable', HOOK, "env: { ...process.env, [RUN_ENV]: '1' },", 'env: { ...process.env },'],
  ['hook: the dream gate removed', HOOK, 'if (process.env.CONSONANCE_DREAM) process.exit(0);', ''],
  ['hook: a tool that is not a ring tool is acted on', HOOK, 'if (!RING_TOOLS.has(tool)) return process.exit(0);', 'if (false) return process.exit(0);'],
  ['hook: a third tool joins the ring set', HOOK, "const RING_TOOLS = new Set(['mcp__consonance__call_librarian', 'mcp__consonance__call_chair']);", "const RING_TOOLS = new Set(['mcp__consonance__call_librarian', 'mcp__consonance__call_chair', 'mcp__consonance__post_board']);"],
  ['hook: a ring with no text is read anyway', HOOK, "if (typeof text !== 'string' || !text.trim()) {", 'if (false) {'],
  ['hook: a busy lock is ignored (a second worker starts)', HOOK, 'if (!token) {', 'if (false) {'],
  ['hook: the lock is not exclusive', HOOK, "fs.openSync(lock, 'wx')", "fs.openSync(lock, 'w')"],
  ['hook: a lock held by a DEAD pid still counts as live', HOOK, '&& pidAlive(held.pid);', ';'],
  ['hook: a lock older than 180 s still counts as live', HOOK, 'Date.now() - held.ts < LOCK_STALE_MS &&', ''],
  // (no mutant on the outer catch: no input reaches it, every step inside main() handles its own errors, so exit(2) there is an equivalent mutant)
  ['hook: prints a deny decision', HOOK, 'child.stdin.end(JSON.stringify(job), () => process.exit(0));', "child.stdin.end(JSON.stringify(job), () => { process.stdout.write('{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\"}}'); process.exit(0); });"],
  ['hook: the message text is written into the busy row', HOOK, "record(dir, { seat, tool, ringSha, status: 'skipped-busy' });", "record(dir, { seat, tool, ringSha, text, status: 'skipped-busy' });"],
  ['hook: the lock is released only by the worker\'s own token', HOOK, 'if (JSON.parse(fs.readFileSync(p, \'utf8\')).token === token) fs.unlinkSync(p);', 'fs.unlinkSync(p);'],
  // ---- the worker: what the model child can do ----
  ['worker: --safe-mode dropped (the child loads every hook)', WORKER, "'--safe-mode', ", ''],
  ['worker: --strict-mcp-config dropped (the child starts MCP servers)', WORKER, "'--strict-mcp-config', ", ''],
  ['worker: --tools "" dropped (the child has tools)', WORKER, "'--tools', '', ", ''],
  ['worker: --bare added (it ignores the subscription login)', WORKER, "'--no-session-persistence', '--disable-slash-commands'];", "'--no-session-persistence', '--disable-slash-commands', '--bare'];"],
  ['worker: the guard variable is not set on the model child', WORKER, "{ ...(deps.env || process.env), CONSONANCE_SECOND_READER_RUN: '1' };", '{ ...(deps.env || process.env) };'],
  ['worker: the model is not Sonnet 5.5', WORKER, "const MODEL = 'claude-sonnet-5-5';", "const MODEL = 'claude-haiku-4-5-20251001';"],
  ['worker: the timeout is ten times too long', WORKER, 'const TIMEOUT_MS = 120000;', 'const TIMEOUT_MS = 1200000;'],
  ['worker: a timed-out child is not killed', WORKER, 'timedOut = true; kill(); finish(null);', 'timedOut = true; finish(null);'],
  ['worker: the lock is never released', WORKER, '    releaseLock(dir, job.token);\n', ''],
  ['worker: a non-zero exit is read as an answer', WORKER, 'if (r.code !== 0) {', 'if (false) {'],
  // ---- the question, the turn, the row ----
  ['worker: the question is altered', WORKER, "'does NOT, quoting each.", "'does not, quoting each."],
  ['worker: the turn includes the ring\'s own call', WORKER, 'if (self) continue;', ''],
  ['worker: the turn starts at the beginning, not after the last prompt', WORKER, '{ from = i + 1; break; }', '{ break; }'],
  ['worker: a tool-result message counts as a prompt', WORKER, '&& !hasToolResult(m)', ''],
  ['worker: a flag quote that is not in the message is stored', WORKER, 'if (!quote || !body.includes(quote)) {', 'if (!quote) {'],
  ['worker: more than 20 flags are stored', WORKER, 'ans.flags.slice(0, MAX_FLAGS)', 'ans.flags'],
  ['worker: the message text is written into the ok row', WORKER, "const row = { ...base, status: 'ok', flags: a.flags,", "const row = { ...base, text, status: 'ok', flags: a.flags,"],
  ['worker: the tokens are not recorded', WORKER, 'in: u.input_tokens == null ? null : u.input_tokens,', 'in: null,'],
  ['worker: the model is not recorded', WORKER, 'model: a.model || MODEL,', 'model: null,'],
  // ---- secrets ----
  ['secrets: scrub does nothing', WORKER, "for (const re of SECRET_SHAPES) m = m.replace(re, '<redacted>');", ''],
  ['secrets: the vck_ shape is not scrubbed', WORKER, '  /\\bvck_[A-Za-z0-9_-]{16,}/g,\n', ''],
  ['secrets: the message is sent to the model unscrubbed', WORKER, '    scrub(text),\n', '    text,\n'],
  ['secrets: the turn is sent to the model unscrubbed', WORKER, "scrub(turn) || '(no tool calls in this turn)',", "turn || '(no tool calls in this turn)',"],
  ['secrets: a stored flag quote is not scrubbed', WORKER, 'quote: clip(scrub(quote), 300)', 'quote: clip(quote, 300)'],
  ['secrets: an error row is not scrubbed', WORKER, "error: scrub('exit ' + r.code + ': ' + (r.stderr || r.stdout || '')).slice(0, 200)", "error: ('exit ' + r.code + ': ' + (r.stderr || r.stdout || '')).slice(0, 200)"],
];

function tree() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sr-mut-'));
  fs.mkdirSync(path.join(dir, 'consonance', 'hooks'), { recursive: true });
  for (const f of [HOOK, WORKER, SUITE]) fs.copyFileSync(path.join(HERE, f), path.join(dir, 'consonance', 'hooks', f));
  fs.mkdirSync(path.join(dir, 'dev', 'shell'), { recursive: true }); fs.copyFileSync(path.join(REPO, INSTALL), path.join(dir, INSTALL));
  fs.mkdirSync(path.dirname(path.join(dir, PLAN)), { recursive: true }); fs.copyFileSync(path.join(REPO, PLAN), path.join(dir, PLAN));
  return dir;
}
function run(dir) {
  const env = { ...process.env }; for (const k of Object.keys(env)) if (/^CONSONANCE_/.test(k)) delete env[k];
  const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-concurrency=1', path.join(dir, 'consonance', 'hooks', SUITE)], { encoding: 'utf8', env, timeout: 15 * 60 * 1000 });
  const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
  return { pass: n('pass'), fail: n('fail') };
}

function main() {
  require('./heavy-run.js').hold({ cmd: 'second-reader.mutants' });   // ONE HEAVY RUNNER PER TREE
  const onlyAt = process.argv.indexOf('--only'), only = onlyAt > 0 ? Number(process.argv[onlyAt + 1]) : null;
  const read = (f) => fs.readFileSync(path.join(HERE, f), 'utf8').replace(/\r\n/g, '\n');
  const control = (() => { const d = tree(); try { return run(d); } finally { fs.rmSync(d, { recursive: true, force: true }); } })();
  console.log(`control (unmutated copy)                              pass ${control.pass} fail ${control.fail}`);
  if (!(control.fail === 0 && control.pass > 0)) { console.log('CONTROL NOT GREEN - no mutant result means anything'); process.exitCode = 1; return; }
  let applied = 0, caught = 0, notApplied = 0;
  MUTANTS.forEach(([name, file, anchor, repl], i) => {
    if (only != null && only !== i + 1) return;
    const src = read(file), hits = src.split(anchor).length - 1, label = `${String(i + 1).padStart(2)} ${name}`.padEnd(70);
    if (hits !== 1) { notApplied++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
    applied++;
    const d = tree();
    try {
      fs.writeFileSync(path.join(d, 'consonance', 'hooks', file), src.replace(anchor, () => repl));
      const r = run(d), ok = r.fail > 0; if (ok) caught++;
      console.log(`${label} pass ${r.pass} fail ${r.fail}  ${ok ? 'CAUGHT' : 'SURVIVED'}`);
    } finally { fs.rmSync(d, { recursive: true, force: true }); }
  });
  console.log(`\n${applied} applied · ${caught} caught · ${applied - caught} survived · ${notApplied} NOT APPLIED`);
  if (applied - caught > 0 || notApplied > 0) process.exitCode = 1;
}

main();
