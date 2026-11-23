// model-switch-note.js (L214, pane A). R3: the hook prints its warning on a warm session and nothing on a cold one.
//   node consonance/hooks/model-switch-note.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const hook = require('./model-switch-note.js');
const HOOK = path.join(__dirname, 'model-switch-note.js');

// As probed on 2.1.330 (the keys are the harness's).
const sw = (over = {}) => ({ hook_event_name: 'PreModelSwitch', session_id: 'aaaaaaaa-1', from_model: 'claude-opus-5-5', to_model: 'claude-sonnet-5-5', requested_model: 'sonnet', source: 'cli',
  context_tokens: 300000, prompt_cache_warm: true, cache_ttl: '1h', estimated_cache_write_usd: 1.8, pricing: 'list', ...over });
const run = (payload, env = {}) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'msn-'));
  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(payload), encoding: 'utf8', env: { ...process.env, CONSONANCE_DREAM: '', CONSONANCE_DATA: dir, ...env } });
  const ledger = fs.existsSync(path.join(dir, 'model-switch.jsonl')) ? fs.readFileSync(path.join(dir, 'model-switch.jsonl'), 'utf8') : '';
  fs.rmSync(dir, { recursive: true, force: true });
  return { r, ledger };
};

test('R3 a warm, large seat gets the warning with the token count, as a systemMessage', () => {
  const { r } = run(sw());
  assert.strictEqual(r.status, 0, r.stderr);
  const out = JSON.parse(r.stdout);
  assert.match(out.systemMessage, /300k tokens/);
  assert.match(out.systemMessage, /claude-opus-5-5 -> claude-sonnet-5-5/);
  assert.ok(!('decision' in out) && !('permissionDecision' in out), 'it warns, it never blocks');
});

test('R3 a cold seat gets nothing on stdout', () => {
  const { r } = run(sw({ prompt_cache_warm: false }));
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout, '');
});

test('a warm seat under the floor, or a switch to the same model, gets nothing; the floor is a dial', () => {
  assert.strictEqual(run(sw({ context_tokens: 20000 })).r.stdout, '');
  assert.strictEqual(run(sw({ to_model: 'claude-opus-5-5' })).r.stdout, '');
  assert.match(run(sw({ context_tokens: 20000 }), { CONSONANCE_MODELSWITCH_MIN: '10000' }).r.stdout, /20k tokens/);
});

test('every switch writes one numbers-only row, warm or cold, and the row has no free text', () => {
  const { ledger } = run(sw({ prompt_cache_warm: false }));
  const row = JSON.parse(ledger.trim());
  assert.deepStrictEqual([row.kind, row.warm, row.context_tokens, row.from, row.to], ['model-switch', false, 300000, 'claude-opus-5-5', 'claude-sonnet-5-5']);
  for (const [k, v] of Object.entries(row)) if (typeof v === 'string' && k !== 't') assert.ok(v.length <= 40 && !/[\\/]/.test(v), k);
});

test('a dream session gets no output and no row; garbage and other events get nothing', () => {
  const d = run(sw(), { CONSONANCE_DREAM: '1' });
  assert.strictEqual(d.r.stdout, '');
  assert.strictEqual(d.ledger, '');
  assert.strictEqual(hook.handle(null, {}).text, null);
  assert.strictEqual(hook.handle({ hook_event_name: 'Stop' }, {}).text, null);
});

test('a stdin that never ends does not hold the hook', async () => {
  const { spawn } = require('child_process');
  const child = spawn(process.execPath, [HOOK], { stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, CONSONANCE_DREAM: '', CONSONANCE_DATA: os.tmpdir() } });
  const code = await new Promise((res) => { const k = setTimeout(() => { child.kill(); res('hung'); }, 8000); child.on('exit', (c) => { clearTimeout(k); res(c); }); });
  assert.strictEqual(code, 0);
});
