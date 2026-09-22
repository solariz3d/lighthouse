// jev-shadow-runner.test.js — node --test consonance/tools/jev-shadow-runner.test.js
//
// NO LIVE CALLS: `fetch` is stubbed, the shell dir is a fixture (copies of the repo's real workers), and the User
// environment lookup is a stub — the real registry on this machine HOLDS the key, so no test may reach it (the CLI
// tests set JEV_SHADOW_NO_USER_ENV=1). The "app" is a throwaway node process the tests start and kill.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const R = require('./jev-shadow-runner.js');

const REPO_HOOKS = path.resolve(__dirname, '..', '..', 'dev', 'shell', 'hooks');
const TOOL = path.join(__dirname, 'jev-shadow-runner.js');
const KEY = ['test', 'only', 'runner', 'key', '9b2d'].join('-');

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-runner-'));
  const shell = path.join(root, 'shell'), disc = path.join(root, 'lighthouse'), store = path.join(root, 'store');
  for (const d of ['hooks', 'l2-jobs', 'l3-jobs']) fs.mkdirSync(path.join(shell, d), { recursive: true });
  fs.mkdirSync(disc);
  for (const w of ['l2-overseer-worker.js', 'l3-overseer-worker.js']) fs.copyFileSync(path.join(REPO_HOOKS, w), path.join(shell, 'hooks', w));
  fs.writeFileSync(path.join(disc, 'METHOD.md'), 'method');
  fs.writeFileSync(path.join(disc, 'WELFARE.md'), 'welfare');
  fs.writeFileSync(path.join(shell, 'l2_overseer.jsonl'), '');
  fs.writeFileSync(path.join(shell, 'l3_overseer.jsonl'), '');
  return { root, shell, disc, store };
}
const job = (f, id) => fs.writeFileSync(path.join(f.shell, 'l2-jobs', id + '.json'),
  JSON.stringify({ job_id: id, created_at: '2026-09-21T18:00:00.000Z', session_id: 's', view: { assistant_move: 'a move', user_context: 'a question' } }));
const verdict = (f, id) => fs.appendFileSync(path.join(f.shell, 'l2_overseer.jsonl'),
  JSON.stringify({ type: 'l2_overseer_verdict', timestamp: new Date().toISOString(), job_id: id, verdict: 'clean' }) + '\n');
function gateway() {
  const calls = [];
  const f = async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push(body);
    const answers = Object.fromEntries(Object.keys(body.questions).map((k) => [k, { type: 'choice', choice: Object.keys(body.questions[k].criteria)[0], probabilities: {} }]));
    return { ok: true, status: 200, text: async () => JSON.stringify({ model: 'typesafe-ai/jev', answers, usage: { inputTokens: 10, outputTokens: 0 }, providerMetadata: { gateway: { cost: '0' } } }) };
  };
  f.calls = calls;
  return f;
}
/** A stand-in for the app: a node process that lives until killed — and at most 90 s, so a suite killed mid-run (a
 *  hung mutant, D104: two orphans found) can never strand one. */
function fakeApp() { return spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000); setTimeout(() => process.exit(0), 90000)'], { stdio: 'ignore' }); }
const opts = (f, app, extra = {}) => ({
  appPid: app.pid, store: f.store, shellDir: f.shell, disciplineDir: f.disc,
  env: { AI_GATEWAY_API_KEY: KEY }, readUserEnv: () => null, fetchImpl: gateway(),
  captureMs: 30, shadowMs: 60, pidPollMs: 30, maxCalls: 25, dailyCap: 600, ...extra,
});
const waitFor = async (pred, ms = 5000) => { const t = Date.now(); while (!pred()) { if (Date.now() - t > ms) throw new Error('timed out'); await new Promise((r) => setTimeout(r, 20)); } };
const log = (f) => { try { return fs.readFileSync(path.join(f.store, 'runner.log'), 'utf8'); } catch { return ''; } };
const ledger = (f) => { try { return fs.readFileSync(path.join(f.store, 'shadow.jsonl'), 'utf8').split('\n').filter(Boolean).map(JSON.parse); } catch { return []; } };

// ------------------------------------------------------------------ the key

test('no key in the environment AND none in the User environment: REFUSES loudly, logs it, holds no lock', async () => {
  const f = fixture(); const app = fakeApp();
  try {
    await assert.rejects(R.run(opts(f, app, { env: {}, readUserEnv: () => null })), (e) => e instanceof R.Refusal && /AI_GATEWAY_API_KEY/.test(e.message));
    assert.match(log(f), /REFUSED .*AI_GATEWAY_API_KEY/);
    assert.ok(!fs.existsSync(path.join(f.store, 'runner.lock')), 'a refused runner left a lock');
  } finally { app.kill(); }
});

test('the key is read from the User environment IN-PROCESS when the process env lacks it', async () => {
  const f = fixture(); const app = fakeApp();
  job(f, 'j1'); verdict(f, 'j1');
  const g = gateway();
  const asked = [];
  try {
    const h = await R.run(opts(f, app, { env: {}, readUserEnv: (n) => { asked.push(n); return KEY; }, fetchImpl: g }));
    await waitFor(() => ledger(f).length === 1);
    h.stop('test done'); await h.done;
    assert.deepStrictEqual(asked, ['AI_GATEWAY_API_KEY']);
  } finally { app.kill(); }
});

test('the key never appears in the log, the lock, or the ledger', async () => {
  const f = fixture(); const app = fakeApp();
  job(f, 'j1'); verdict(f, 'j1');
  try {
    const h = await R.run(opts(f, app));
    await waitFor(() => ledger(f).length === 1);
    const lockText = fs.readFileSync(path.join(f.store, 'runner.lock'), 'utf8');
    h.stop('test done'); await h.done;
    for (const [name, text] of [['log', log(f)], ['lock', lockText], ['ledger', JSON.stringify(ledger(f))]]) {
      assert.ok(!text.includes(KEY), `the key reached the ${name}`);
    }
  } finally { app.kill(); }
});

// ------------------------------------------------------------------ start, stop, one runner

test('it captures and shadows on its cadence, and STOPS cleanly when the app exits: lock released, logged', { timeout: 20000 }, async () => {
  const f = fixture(); const app = fakeApp();
  job(f, 'j1'); verdict(f, 'j1');
  const h = await R.run(opts(f, app));
  await waitFor(() => ledger(f).length === 1);
  assert.ok(fs.existsSync(path.join(f.store, 'runner.lock')));
  app.kill();
  const reason = await h.done;
  assert.match(reason, /app closed/);
  assert.ok(!fs.existsSync(path.join(f.store, 'runner.lock')), 'the lock outlived the runner');
  assert.match(log(f), /stopped: app closed/);
});

test('NO DOUBLE RUNNER: a second runner on the same store refuses while the first lives, and the first is unaffected', async () => {
  const f = fixture(); const app = fakeApp();
  try {
    const h1 = await R.run(opts(f, app));
    await assert.rejects(R.run(opts(f, app)), (e) => e instanceof R.AlreadyRunning);
    assert.match(log(f), /another runner .*is running/);
    assert.strictEqual(JSON.parse(fs.readFileSync(path.join(f.store, 'runner.lock'), 'utf8')).pid, process.pid);
    h1.stop('test done'); await h1.done;
  } finally { app.kill(); }
});

test('a STALE lock (its pid is dead) is taken over, and the takeover is logged', async () => {
  const f = fixture(); const app = fakeApp();
  const dead = spawnSync(process.execPath, ['-e', 'process.stdout.write(String(process.pid))'], { encoding: 'utf8' }).stdout;
  fs.mkdirSync(f.store, { recursive: true });
  fs.writeFileSync(path.join(f.store, 'runner.lock'), JSON.stringify({ pid: Number(dead), started_at: 'earlier' }));
  try {
    const h = await R.run(opts(f, app));
    assert.match(log(f), /stale lock .* taken over/);
    h.stop('test done'); await h.done;
  } finally { app.kill(); }
});

test('an app pid that is not running: REFUSES to start (nothing to shadow for)', async () => {
  const f = fixture();
  const gone = spawnSync(process.execPath, ['-e', 'process.stdout.write(String(process.pid))'], { encoding: 'utf8' }).stdout;
  await assert.rejects(R.run({ ...opts(f, { pid: Number(gone) }) }), (e) => e instanceof R.Refusal && /not running/.test(e.message));
});

test('a capture that cannot build the judged prompt STOPS the runner — it never feeds Jev a prompt the judge did not see', { timeout: 20000 }, async () => {
  const f = fixture(); const app = fakeApp();
  fs.writeFileSync(path.join(f.shell, 'hooks', 'l3-overseer-worker.js'), '// the installed builder changed shape\n');
  fs.writeFileSync(path.join(f.shell, 'l3-jobs', 'k1.json'), JSON.stringify({ job_id: 'k1', created_at: 'x', session_id: 's', user_turns: [{ timestamp: null, text: 't' }] }));
  try {
    const h = await R.run(opts(f, app));
    assert.strictEqual(await h.done, 'capture refused');
    assert.match(log(f), /REFUSED capture/);
    assert.ok(!fs.existsSync(path.join(f.store, 'runner.lock')));
  } finally { app.kill(); }
});

// ------------------------------------------------------------------ the caps

test('the per-run cap holds: 5 eligible, maxCalls 2 → one cadence asks exactly 2', async () => {
  const f = fixture(); const app = fakeApp();
  for (const id of ['a', 'b', 'c', 'd', 'e']) { job(f, id); verdict(f, id); }
  const g = gateway();
  try {
    const h = await R.run(opts(f, app, { fetchImpl: g, maxCalls: 2, shadowMs: 60000 }));   // one shadow pass only: the first
    await waitFor(() => ledger(f).length >= 2);
    await new Promise((r) => setTimeout(r, 200));
    assert.strictEqual(g.calls.length, 2);
    h.stop('test done'); await h.done;
  } finally { app.kill(); }
});

test('the DAILY cap holds across cadences and is logged when reached', async () => {
  const f = fixture(); const app = fakeApp();
  for (const id of ['a', 'b', 'c', 'd', 'e']) { job(f, id); verdict(f, id); }
  const g = gateway();
  try {
    const h = await R.run(opts(f, app, { fetchImpl: g, maxCalls: 2, dailyCap: 3 }));
    await waitFor(() => /daily cap/.test(log(f)));
    await new Promise((r) => setTimeout(r, 200));
    assert.strictEqual(g.calls.length, 3);
    h.stop('test done'); await h.done;
  } finally { app.kill(); }
});

// ------------------------------------------------------------------ the installed judges are never touched

test('the shell dir is byte-identical after a run: the runner reads the judges, never writes them', async () => {
  const f = fixture(); const app = fakeApp();
  job(f, 'j1'); verdict(f, 'j1');
  const snap = () => fs.readdirSync(f.shell, { recursive: true }).sort().map((p) => {
    const full = path.join(f.shell, p); return fs.statSync(full).isFile() ? `${p}:${fs.readFileSync(full, 'utf8').length}` : p;
  }).join('|');
  const before = snap();
  try {
    const h = await R.run(opts(f, app));
    await waitFor(() => ledger(f).length === 1);
    h.stop('test done'); await h.done;
    assert.strictEqual(snap(), before);
  } finally { app.kill(); }
});

// ------------------------------------------------------------------ the CLI (the process the app spawns)

const cliEnv = (f) => { const e = { ...process.env, JEV_SHADOW_STORE: f.store, CONSONANCE_SHELL_DIR: f.shell, JEV_SHADOW_DISCIPLINE: f.disc, JEV_SHADOW_NO_USER_ENV: '1' }; delete e.AI_GATEWAY_API_KEY; return e; };

test('CLI: no key exits 2 and says REFUSED in the log (the app spawns it windowless: the log is where loud goes)', () => {
  const f = fixture(); const app = fakeApp();
  try {
    const r = spawnSync(process.execPath, [TOOL, '--app-pid', String(app.pid)], { encoding: 'utf8', env: cliEnv(f), timeout: 20000 });
    assert.strictEqual(r.status, 2);
    assert.match(log(f), /REFUSED/);
  } finally { app.kill(); }
});

test('CLI: --app-pid is required', () => {
  const f = fixture();
  const r = spawnSync(process.execPath, [TOOL], { encoding: 'utf8', env: cliEnv(f), timeout: 20000 });
  assert.strictEqual(r.status, 2);
  assert.match(r.stderr, /--app-pid/);
});

test('CLI: the process exits 0 by itself when the app it watches exits', { timeout: 30000 }, async () => {
  const f = fixture(); const app = fakeApp();
  const env = { ...cliEnv(f), AI_GATEWAY_API_KEY: KEY };
  const child = spawn(process.execPath, [TOOL, '--app-pid', String(app.pid), '--pid-poll-ms', '50'], { env, stdio: 'ignore' });
  await waitFor(() => fs.existsSync(path.join(f.store, 'runner.lock')));
  app.kill();
  const code = await new Promise((r) => child.on('exit', r));
  assert.strictEqual(code, 0);
  assert.ok(!fs.existsSync(path.join(f.store, 'runner.lock')));
});

test('the default store is %LOCALAPPDATA%\\consonance\\jev-shadow — outside the data dir', () => {
  assert.strictEqual(R.defaultStore({ LOCALAPPDATA: 'C:\\X\\Local' }), path.join('C:\\X\\Local', 'consonance', 'jev-shadow'));
  assert.throws(() => R.defaultStore({}), (e) => e instanceof R.Refusal && /LOCALAPPDATA/.test(e.message));
});

test('the User-environment reader parses reg.exe output and returns null when the value is absent', () => {
  const out = '\r\nHKEY_CURRENT_USER\\Environment\r\n    AI_GATEWAY_API_KEY    REG_SZ    abc123-def\r\n\r\n';
  assert.strictEqual(R.parseRegQuery(out, 'AI_GATEWAY_API_KEY'), 'abc123-def');
  assert.strictEqual(R.parseRegQuery('\r\nERROR: nothing\r\n', 'AI_GATEWAY_API_KEY'), null);
});
