// ask-ending.test.js - node --test consonance/hooks/ask-ending.test.js   (D248, G3 in SHADOW; under the heavy-run lock, --test-concurrency=1)
//
// Every transcript is a mock JSONL built here; the data dir is a temp dir. The hook is run as it is installed. It must NEVER print and NEVER block: every test
// checks the exit code is 0 and stdout is empty, on top of what it logs. Fake secrets are built at runtime (this repo is public).
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HOOK = path.join(__dirname, 'ask-ending.js');
const G = require('./ask-ending.js');
const FAKE = ['sk', 'or', 'v1', 'a1b2c3d4e5f6a7b8c9d0e1f2'].join('-');
const tmp = (p) => fs.mkdtempSync(path.join(os.tmpdir(), p));
const user = (text) => ({ type: 'user', message: { role: 'user', content: text } });
const assistant = (...blocks) => ({ type: 'assistant', message: { role: 'assistant', content: blocks } });
const T = (text) => ({ type: 'text', text });
function run(entries, { dataDir = tmp('ae-'), raw = null } = {}) {
  const tr = path.join(tmp('aet-'), 't.jsonl'); fs.writeFileSync(tr, entries.map((e) => JSON.stringify(e)).join('\n') + '\n');
  const payload = raw !== null ? raw : JSON.stringify({ session_id: 's', transcript_path: tr, cwd: 'C:/x/myproject', hook_event_name: 'Stop', stop_hook_active: false });
  const r = spawnSync(process.execPath, [HOOK], { input: payload, encoding: 'utf8', env: { ...process.env, CONSONANCE_DATA: dataDir, CONSONANCE_DREAM: '' } });
  const lp = path.join(dataDir, G.LEDGER), rows = fs.existsSync(lp) ? fs.readFileSync(lp, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) : [];
  return { code: r.status, out: r.stdout, rows };
}

test('a "want me to…?" ending is LOGGED as matched, with its line; it never blocks and never prints (shadow)', () => {
  const r = run([user('fix the bug'), assistant(T('Done. The tests pass.\n\nWant me to also update the README?'))]);
  assert.equal(r.code, 0); assert.equal(r.out, '', 'shadow: no output, so nothing is blocked');
  assert.equal(r.rows.length, 1); assert.equal(r.rows[0].matched, true); assert.match(r.rows[0].line, /Want me to also update the README\?/);
  assert.deepEqual([r.rows[0].mode, r.rows[0].promptKind, r.rows[0].project], ['shadow', 'user', 'myproject']);
});
test('every M1 phrase matches on the last non-empty line, and only there', () => {
  for (const l of ['Should I push it?', 'Shall I run the full suite?', 'Would you like me to open it?', 'Do you want me to retry?', 'Ready for me to land it? **', 'want to try it now?']) assert.equal(G.ASK.test(l), true, l);
  assert.equal(G.tailLine('Want me to do X?\n\nI did Y instead.\n'), 'I did Y instead.');
  assert.equal(run([user('go'), assistant(T('Want me to do X?\n\nNo: I did Y, and it is done.'))]).rows[0].matched, false, 'an ask in the middle is not an ending');
});
test('pass: an ending that states the judgment is logged as not matched, without its text', () => {
  const r = run([user('go'), assistant(T('Landed as abc123; the suite is green.'))]);
  assert.equal(r.out, ''); assert.equal(r.rows[0].matched, false); assert.equal(r.rows[0].line, undefined, 'an unmatched line is never kept');
});
test('the row says whether the turn was the user\'s (M1 counts only those) and whether it asked with AskUserQuestion', () => {
  assert.equal(run([user('[keep-warm, from the chair] Reply with exactly: ok'), assistant(T('ok'))]).rows[0].promptKind, 'relay');
  const q = run([user('which db?'), assistant({ type: 'tool_use', id: 'u1', name: 'AskUserQuestion', input: {} }, T('Should I use Postgres?'))]);
  assert.equal(q.rows[0].auq, true); assert.equal(q.rows[0].matched, true);
});
test('a secret in a matched line is redacted before it is logged', () => {
  const r = run([user('go'), assistant(T(`Want me to use the key ${FAKE} for this?`))]);
  assert.equal(r.rows[0].matched, true); assert.ok(!JSON.stringify(r.rows).includes(FAKE)); assert.match(r.rows[0].line, /<redacted>/);
});
test('fails silent: a malformed payload, a missing transcript, no data dir: exit 0, no output', () => {
  assert.deepEqual([run([], { raw: '{nope' }).code, run([], { raw: '{nope' }).out], [0, '']);
  const missing = run([], { raw: JSON.stringify({ transcript_path: 'C:/no/such/file.jsonl' }) }); assert.equal(missing.code, 0); assert.equal(missing.out, '');
  const r = spawnSync(process.execPath, [HOOK], { input: '{}', encoding: 'utf8', env: { ...process.env, CONSONANCE_DATA: '', USERPROFILE: tmp('aeh-'), HOME: tmp('aeh-') } });
  assert.equal(r.status, 0); assert.equal(r.stdout, '');
});
