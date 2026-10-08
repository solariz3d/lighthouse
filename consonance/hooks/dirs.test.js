// dirs.test.js — D273 lap 2: the five hooks that used to hard-code C:\Consonance resolve the data and instances folders by THE APP'S OWN RULE
// (consonance/src-tauri/src/main.rs set_dirs, default_data, default_instances): ~/.consonance.json's data_dir / instances_dir when set (trimmed), else
// %USERPROFILE%\.consonance and %USERPROFILE%\claude-instances. Rows:
//   1  one rule: the D273 block is the SAME text in all five hooks, and none of them still names C:\Consonance
//   2  a stranger with no ~/.consonance.json: the folders under their own home, as the app's defaults
//   3  a config naming its folders (a BOM and padding, as a hand-edited file may have): those folders, trimmed; a blank or non-string value, or a file that
//      is not JSON, falls back to the default, as the app's field-by-field parse does
//   4  the env overrides each hook had still win over the rule
//   5  a real hook in a stranger's home (sourced-stop, no override): its ledger lands under THAT home, where the app reads, never in C:\Consonance
// Run: node --test consonance/hooks/dirs.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const REPO = path.join(__dirname, '..', '..');
const HOOKS = ['dev/shell/hooks/session-start.js', 'consonance/hooks/sessionstart-state.js', 'consonance/hooks/findings-return.js', 'consonance/hooks/sourced-stop.js', 'consonance/hooks/precompact-preserve.js'];
const text = (h) => fs.readFileSync(path.join(REPO, h), 'utf8').replace(/\r\n/g, '\n');
const blockOf = (t) => { const a = t.indexOf('// D273 dirs: begin'), b = t.indexOf('// D273 dirs: end'); return a < 0 || b < 0 ? null : t.slice(a, b + '// D273 dirs: end'.length); };
/** consonanceDir from a hook's own block, run with this env (no hook body runs). */
const resolver = (h, env) => { const ctx = { fs, path, process: { env } }; vm.createContext(ctx); vm.runInContext(blockOf(text(h)) + '\n;globalThis.__f = consonanceDir;', ctx); return ctx.__f; };
const home = (files = {}) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'dirs-home-')); for (const [k, v] of Object.entries(files)) fs.writeFileSync(path.join(d, k), v); return d; };

test('row 1: one rule — the D273 block is the same text in all five hooks, and none still names C:\\Consonance', () => {
  const blocks = HOOKS.map((h) => blockOf(text(h)));
  for (const [i, b] of blocks.entries()) assert.ok(b, `${HOOKS[i]} has the D273 block`);
  for (const [i, b] of blocks.entries()) assert.strictEqual(b, blocks[0], `${HOOKS[i]}'s block is the same text as ${HOOKS[0]}'s`);
  for (const h of HOOKS) assert.ok(!/['"]C:(\\\\|\/)Consonance|path\.join\('C:'/.test(text(h).replace(/^\s*(\/\/|\*).*$/gm, '')), `${h} names no C:\\Consonance path in its code`);
});

test('row 2: a stranger with no ~/.consonance.json gets the folders under their own home, as the app\'s defaults', () => {
  const h = home(); const f = resolver(HOOKS[0], { USERPROFILE: h });
  assert.strictEqual(f('data_dir', '.consonance'), `${h}\\.consonance`);
  assert.strictEqual(f('instances_dir', 'claude-instances'), `${h}\\claude-instances`);
  fs.rmSync(h, { recursive: true, force: true });
});

test('row 3: a config naming its folders gives them (BOM and padding as the app reads them); blank, non-string or not-JSON falls back to the default', () => {
  const named = home({ '.consonance.json': '\uFEFF' + JSON.stringify({ data_dir: ' D:\\X\\data ', instances_dir: 'D:\\X\\inst' }) });
  for (const h of HOOKS) { const f = resolver(h, { USERPROFILE: named }); assert.strictEqual(f('data_dir', '.consonance'), 'D:\\X\\data', h); assert.strictEqual(f('instances_dir', 'claude-instances'), 'D:\\X\\inst', h); }
  const blank = home({ '.consonance.json': JSON.stringify({ data_dir: '   ', instances_dir: 7 }) }), broken = home({ '.consonance.json': '{ not json' });
  for (const d of [blank, broken]) { const f = resolver(HOOKS[1], { USERPROFILE: d }); assert.strictEqual(f('data_dir', '.consonance'), `${d}\\.consonance`); assert.strictEqual(f('instances_dir', 'claude-instances'), `${d}\\claude-instances`); }
  for (const d of [named, blank, broken]) fs.rmSync(d, { recursive: true, force: true });
});

test('row 4: the env overrides each hook had still win over the rule', () => {
  const src = (h, names) => text(h).split('\n').filter((l) => names.some((n) => l.startsWith(`const ${n} = `))).join('\n');
  const run = (h, names, env) => { const ctx = { fs, path, process: { env } }; vm.createContext(ctx); vm.runInContext(blockOf(text(h)) + '\n' + src(h, names) + `\n;globalThis.__o = JSON.stringify({ ${names.join(', ')} });`, ctx); return JSON.parse(ctx.__o); };   // through JSON: an object made in the VM has the VM's prototype
  const h = home();
  assert.strictEqual(run(HOOKS[1], ['DATA'], { USERPROFILE: h, CONSONANCE_DATA: 'E:\\ov' }).DATA, 'E:\\ov');
  assert.strictEqual(run(HOOKS[4], ['DATA'], { USERPROFILE: h, CONSONANCE_DATA: 'E:\\ov' }).DATA, 'E:\\ov');
  assert.deepStrictEqual(run(HOOKS[2], ['DATA', 'RETURNS', 'STATEDIR'], { USERPROFILE: h, VANTAGE_DATA: 'E:\\v', RETURN_LEDGER: 'E:\\r.jsonl', RETURN_STATE_DIR: 'E:\\s' }), { DATA: 'E:\\v', RETURNS: 'E:\\r.jsonl', STATEDIR: 'E:\\s' });
  assert.strictEqual(run(HOOKS[3], ['LEDGER'], { USERPROFILE: h, SOURCED_LEDGER: 'E:\\l.jsonl' }).LEDGER, 'E:\\l.jsonl');
  // and without them, RETURNS stays out from under VANTAGE_DATA, as it always was
  assert.strictEqual(run(HOOKS[2], ['DATA', 'RETURNS'], { USERPROFILE: h, VANTAGE_DATA: 'E:\\v' }).RETURNS, `${h}\\.consonance\\return_ledger.jsonl`);
  fs.rmSync(h, { recursive: true, force: true });
});

test('row 5: a real hook in a stranger\'s home (sourced-stop, no override) writes its ledger under THAT home, never C:\\Consonance', () => {
  const h = home(), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dirs-run-'));
  const t = path.join(tmp, 'transcript.jsonl');
  fs.writeFileSync(t, [{ type: 'user', message: { role: 'user', content: 'how big?' }, timestamp: '2026-10-08T11:00:00.000Z' },
    { type: 'assistant', timestamp: '2026-10-08T11:00:01.000Z', message: { role: 'assistant', content: [{ type: 'text', text: 'The file has 340 lines.' }] } }].map((r) => JSON.stringify(r)).join('\n') + '\n');
  const env = { ...process.env, USERPROFILE: h, HOME: h }; delete env.SOURCED_LEDGER; delete env.CONSONANCE_DREAM;
  const r = spawnSync(process.execPath, [path.join(REPO, 'consonance/hooks/sourced-stop.js')], { input: JSON.stringify({ session_id: 'dirs-test', transcript_path: t }), encoding: 'utf8', env, timeout: 15000 });
  assert.strictEqual(r.status, 0, r.stderr);
  const ledger = path.join(h, '.consonance', 'sourced_ledger.jsonl');
  assert.ok(fs.existsSync(ledger), `the ledger is under the stranger's home: ${ledger}`);
  assert.strictEqual(fs.readFileSync(ledger, 'utf8').split('\n').filter(Boolean).length, 1);
  for (const d of [h, tmp]) fs.rmSync(d, { recursive: true, force: true });
});
