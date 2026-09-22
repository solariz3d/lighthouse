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
  // dailyCap follows the runner's default (L074: 2,000 with 600 reserved for the shadow). At the old 600 the reserve
  // would be the whole cap and judge mode would get nothing — A's judge-mode test went red on exactly that.
  captureMs: 30, shadowMs: 60, pidPollMs: 30, maxCalls: 25, dailyCap: 2000, ...extra,
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

// ------------------------------------------------------------------ JUDGE MODE (L071, pane A): Jev AS the judge

/** A judge-mode world beside the shadow fixture: a repo with the real hooks and a main.rs, a roster, a seat transcript. */
function judgeWorld(f) {
  const repo = path.join(f.root, 'repo'), data = path.join(f.root, 'data'), projects = path.join(f.root, 'projects');
  fs.mkdirSync(path.join(repo, 'dev', 'shell', 'hooks'), { recursive: true });
  fs.mkdirSync(path.join(repo, 'consonance', 'src-tauri', 'src'), { recursive: true });
  for (const h of ['l2-overseer.js', 'l3-overseer.js', 'l2-overseer-worker.js', 'l3-overseer-worker.js']) fs.copyFileSync(path.join(REPO_HOOKS, h), path.join(repo, 'dev', 'shell', 'hooks', h));
  fs.writeFileSync(path.join(repo, 'consonance', 'src-tauri', 'src', 'main.rs'), '');
  fs.mkdirSync(data, { recursive: true });
  fs.writeFileSync(path.join(data, 'panes.json'), JSON.stringify([{ pane: 'seat-1', cwd: 'x', label: 'A' }]));
  const turn = (n) => [
    JSON.stringify({ type: 'user', uuid: `u${n}`, timestamp: new Date().toISOString(), message: { role: 'user', content: `question ${n}` } }),
    JSON.stringify({ type: 'assistant', uuid: `a${n}`, timestamp: new Date().toISOString(), message: { role: 'assistant', stop_reason: 'end_turn', content: [{ type: 'text', text: `answer ${n}` }] } }),
  ].join('\n') + '\n';
  const file = path.join(projects, 'C--seat', 'seat-1.jsonl');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, turn(1));
  return { repo, data, projects, file, addTurn: (n) => fs.appendFileSync(file, turn(n)) };
}
const judged = (f) => { try { return fs.readFileSync(path.join(f.store, 'jev_judge.jsonl'), 'utf8').split('\n').filter(Boolean).map(JSON.parse); } catch { return []; } };
const jopts = (f, jw) => ({ repo: jw.repo, dataDir: jw.data, projectsDir: jw.projects, disciplineDir: f.disc });

test('L078: a failed judge call is LOGGED once per item (key + status), the pass goes on, and the runner keeps running', async () => {
  const f = fixture(); const app = fakeApp(); const jw = judgeWorld(f);
  const ok = gateway();
  let n = 0;
  const g = async (url, init) => (++n === 1 ? { ok: false, status: 503, text: async () => 'upstream unavailable' } : ok(url, init));
  try {
    const h = await R.run(opts(f, app, { ...jopts(f, jw), fetchImpl: g }));
    await waitFor(() => judged(f).length >= 2);                  // the failed item came back on a later cadence
    const lines = log(f).split('\n').filter((l) => /judge: item .* failed/.test(l));
    assert.ok(lines.length >= 1, log(f));
    assert.match(lines[0], /seat-1:a1:l[23] failed \(503\)/, lines[0]);
    for (const bad of ['upstream unavailable', 'answer 1', 'question 1', 'method']) assert.ok(!log(f).includes(bad), `the log carried "${bad}"`);
    assert.doesNotMatch(log(f), /stopped:/);
    h.stop('test done'); await h.done;
  } finally { app.kill(); }
});

test('JUDGE MODE runs inside the runner: a seat\'s finished turn is judged into jev_judge.jsonl, L2 and L3', async () => {
  const f = fixture(); const app = fakeApp(); const jw = judgeWorld(f);
  try {
    const h = await R.run(opts(f, app, jopts(f, jw)));
    await waitFor(() => judged(f).length >= 2);
    assert.deepStrictEqual(judged(f).map((r) => r.level).sort(), ['l2', 'l3']);
    assert.ok(judged(f).every((r) => r.judge === 'jev' && r.unverified === true));
    h.stop('test done'); await h.done;
  } finally { app.kill(); }
});

test('the DAILY cap holds across SHADOW and JUDGE together: shadow used cap-1 today → judge mode asks at most 1', async () => {
  const f = fixture(); const app = fakeApp(); const jw = judgeWorld(f);
  const today = new Date().toISOString();
  fs.mkdirSync(f.store, { recursive: true });
  fs.writeFileSync(path.join(f.store, 'shadow.jsonl'), [1, 2, 3, 4].map((i) => JSON.stringify({ ts: today, judge: 'l2', job_id: `old${i}`, status: 'ok' })).join('\n') + '\n');
  const g = gateway();
  try {
    // L074: the cap is PARTITIONED (a shadow reserve, the rest judge's); with the new default reserve of 600 a 5-call
    // day would give judge mode nothing. A small reserve keeps this test's question — total never exceeds the cap.
    const h = await R.run(opts(f, app, { ...jopts(f, jw), fetchImpl: g, dailyCap: 5, shadowReserve: 2 }));
    await waitFor(() => /daily cap/.test(log(f)));
    await new Promise((r) => setTimeout(r, 200));
    assert.strictEqual(g.calls.length, 1, 'one call left under the cap, whichever mode spends it');
    h.stop('test done'); await h.done;
  } finally { app.kill(); }
});

test('an EMPTY cadence says so: "nothing to shadow (0 captures)" — idle and broken no longer read the same', async () => {
  const f = fixture(); const app = fakeApp();
  try {
    const h = await R.run(opts(f, app));
    await waitFor(() => /nothing to shadow \(0 captures\)/.test(log(f)));
    h.stop('test done'); await h.done;
  } finally { app.kill(); }
});

test('judge mode that CANNOT run logs why once, and the SHADOW keeps running untouched', async () => {
  const f = fixture(); const app = fakeApp();
  job(f, 'j1'); verdict(f, 'j1');
  try {
    const h = await R.run(opts(f, app));                       // no dataDir / projectsDir given: judge mode is off
    await waitFor(() => ledger(f).length === 1);
    assert.match(log(f), /judge mode off/);
    assert.strictEqual((log(f).match(/judge mode off/g) || []).length, 1, 'said once, not every tick');
    h.stop('test done'); await h.done;
  } finally { app.kill(); }
});

test('a judge-mode REFUSAL mid-run (a hook function missing) turns judge mode off and NEVER stops the shadow', async () => {
  // Found as a surviving mutant. This is D's case: judge mode must not be able to take the shadow measurement down.
  const f = fixture(); const app = fakeApp(); const jw = judgeWorld(f);
  fs.writeFileSync(path.join(jw.repo, 'dev', 'shell', 'hooks', 'l3-overseer.js'), '// readTrajectoryView is gone\n');
  job(f, 'j1'); verdict(f, 'j1');
  try {
    const h = await R.run(opts(f, app, jopts(f, jw)));
    await waitFor(() => /judge mode off: cannot find/.test(log(f)));
    await waitFor(() => ledger(f).length === 1);              // the shadow still asked
    assert.doesNotMatch(log(f), /stopped:/, 'the runner must still be running');
    h.stop('test done'); await h.done;
  } finally { app.kill(); }
});

// ------------------------------------------------------------------ THE CAP, PARTITIONED (L074)
// The keeper's call via the librarian (04:0x): 2,000 calls a day in all, 600 of them RESERVED for the shadow, so judge
// mode can never starve it. Measured: ~55 judge calls/hour in an active lap, ~4,240 tokens each; the cap is a fuse.

test('CAP: the defaults are 2,000 a day with 600 reserved for the shadow', () => {
  assert.strictEqual(R.DEFAULTS.dailyCap, 2000);
  assert.strictEqual(R.DEFAULTS.shadowReserve, 600);
});

test('CAP: judge mode stops at 1,400 while the shadow still gets its 600', () => {
  const b = R.budget({ dailyCap: 2000, shadowReserve: 600, shadowToday: 0, judgeToday: 1400 });
  assert.strictEqual(b.judgeLeft, 0);
  assert.strictEqual(b.shadowLeft, 600);
});

test('CAP: the shadow alone can use its 600 without judge mode losing any of its 1,400', () => {
  const b = R.budget({ dailyCap: 2000, shadowReserve: 600, shadowToday: 600, judgeToday: 0 });
  assert.strictEqual(b.shadowLeft, 0);
  assert.strictEqual(b.judgeLeft, 1400);
});

test('CAP: the combined total never exceeds 2,000 — every interleaving of the two modes ends at exactly 600 + 1,400', () => {
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  for (let trial = 0; trial < 20; trial++) {
    let s = 0, j = 0;
    for (;;) {
      const b = R.budget({ dailyCap: 2000, shadowReserve: 600, shadowToday: s, judgeToday: j });
      assert.ok(s + j <= 2000, `total ${s + j} exceeded the cap`);
      if (!b.shadowLeft && !b.judgeLeft) break;
      const takeShadow = b.shadowLeft && (!b.judgeLeft || rnd() < 0.5);
      const n = 1 + Math.floor(rnd() * 25);                      // a run asks up to 25
      if (takeShadow) s += Math.min(n, b.shadowLeft); else j += Math.min(n, b.judgeLeft);
    }
    assert.deepStrictEqual([s, j], [600, 1400], `trial ${trial} ended at shadow ${s}, judge ${j}`);
  }
});

test('CAP: a day ALREADY over budget under the old shared cap (judge 1,700) leaves the shadow only what the total allows', () => {
  const b = R.budget({ dailyCap: 2000, shadowReserve: 600, shadowToday: 0, judgeToday: 1700 });
  assert.strictEqual(b.judgeLeft, 0);
  assert.strictEqual(b.shadowLeft, 300, 'the total is the fuse; the reserve cannot push the day past it');
});

test('CAP: a reserve larger than the cap is refused at the CLI', () => {
  // Specific wording: the first draft matched /reserve/ and PASSED before the flag existed — the "unknown argument
  // --shadow-reserve" refusal contains the word too.
  assert.throws(() => R.parseArgs(['--app-pid', '1', '--daily-cap', '100', '--shadow-reserve', '200']),
    /the shadow reserve \(200\) is larger than the daily cap \(100\)/);
});

test('CAP in the runner: judge mode AT its limit asks nothing, and the shadow still spends its reserve', async () => {
  const f = fixture(); const app = fakeApp(); const jw = judgeWorld(f);
  for (const id of ['a', 'b', 'c', 'd', 'e']) { job(f, id); verdict(f, id); }
  const today = new Date().toISOString();
  fs.mkdirSync(f.store, { recursive: true });
  // judge's limit with cap 5 / reserve 2 is 3; three judged rows today put it at that limit
  fs.writeFileSync(path.join(f.store, 'jev_judge.jsonl'), [1, 2, 3].map((i) => JSON.stringify({ ts: today, status: 'ok', level: 'l2', session_id: 's', turn_uuid: `t${i}` })).join('\n') + '\n');
  const g = gateway();
  try {
    const h = await R.run(opts(f, app, { ...jopts(f, jw), fetchImpl: g, dailyCap: 5, shadowReserve: 2 }));
    await waitFor(() => ledger(f).length >= 2);
    await new Promise((r) => setTimeout(r, 300));
    assert.strictEqual(ledger(f).length, 2, 'the shadow did not get exactly its reserve');
    assert.strictEqual(judged(f).length, 3, 'judge mode asked past its limit');
    // Which limit the log names depends on order: once the shadow has spent its 2 the day's TOTAL is also gone, and the
    // runner rightly says "daily cap". The judge-cap wording is pinned below, where it is the only limit reached.
    h.stop('test done'); await h.done;
  } finally { app.kill(); }
});

test('CAP in the runner: judge mode at its limit with the shadow idle says "judge cap … reached", not "daily cap"', async () => {
  const f = fixture(); const app = fakeApp(); const jw = judgeWorld(f);
  const today = new Date().toISOString();
  fs.mkdirSync(f.store, { recursive: true });
  fs.writeFileSync(path.join(f.store, 'jev_judge.jsonl'), [1, 2, 3].map((i) => JSON.stringify({ ts: today, status: 'ok', level: 'l2', session_id: 's', turn_uuid: `t${i}` })).join('\n') + '\n');
  const g = gateway();
  try {
    const h = await R.run(opts(f, app, { ...jopts(f, jw), fetchImpl: g, dailyCap: 5, shadowReserve: 2 }));
    await waitFor(() => /judge cap of 3 reached/.test(log(f)));
    assert.doesNotMatch(log(f), /daily cap of 5 calls reached/, 'the day still has the shadow\'s 2 — it is not the total that stopped judge mode');
    assert.strictEqual(g.calls.length, 0);
    h.stop('test done'); await h.done;
  } finally { app.kill(); }
});

test('CAP in the runner: the SHADOW stops at its reserve even when the day has room — the rest is judge mode\'s', async () => {
  // Found while planning the mutants: every other test would pass a shadow that spent the shared TOTAL instead of its
  // own limit. Judge mode is idle here (no judge world), so only the partition can stop the shadow at 2.
  const f = fixture(); const app = fakeApp();
  for (const id of ['a', 'b', 'c', 'd', 'e']) { job(f, id); verdict(f, id); }
  const g = gateway();
  try {
    const h = await R.run(opts(f, app, { fetchImpl: g, dailyCap: 5, shadowReserve: 2 }));
    await waitFor(() => /shadow reserve of 2 reached/.test(log(f)));
    await new Promise((r) => setTimeout(r, 200));
    assert.strictEqual(g.calls.length, 2, 'the shadow spent past its reserve');
    h.stop('test done'); await h.done;
  } finally { app.kill(); }
});

// ------------------------------------------------------------------ RETENTION (L074)
// Judge CAPTURES (conversation text, ~27 KB each) are kept 14 days and then deleted by the runner; the verdict ROWS
// (hashes, not text) are kept forever. The prune reads only <store>/judge-captures, and deletes only there.
const DAY = 24 * 3600 * 1000;
function retentionStore() {
  const store = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-retain-'));
  const caps = path.join(store, 'judge-captures');
  fs.mkdirSync(caps, { recursive: true });
  const now = Date.parse('2026-09-22T10:00:00.000Z');
  const put = (dir, name, ageDays, extra = {}) => {
    fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, name);
    fs.writeFileSync(p, JSON.stringify({ captured_at: new Date(now - ageDays * DAY).toISOString(), ...extra }));
    return p;
  };
  return { store, caps, now, put };
}

test('RETAIN: a capture older than 14 days is pruned; a fresh one is kept', () => {
  const w = retentionStore();
  const old = w.put(w.caps, 'old.json', 15), fresh = w.put(w.caps, 'fresh.json', 1);
  const r = R.pruneJudgeCaptures({ store: w.store, now: () => new Date(w.now) });
  assert.ok(!fs.existsSync(old), 'a 15-day-old capture survived');
  assert.ok(fs.existsSync(fresh), 'a 1-day-old capture was pruned');
  assert.strictEqual(r.pruned, 1);
});

test('RETAIN: the 14-day line — 14 days minus a minute is kept, 14 days plus a minute is pruned', () => {
  const w = retentionStore();
  const inside = w.put(w.caps, 'inside.json', 14 - 1 / 1440), outside = w.put(w.caps, 'outside.json', 14 + 1 / 1440);
  R.pruneJudgeCaptures({ store: w.store, now: () => new Date(w.now) });
  assert.ok(fs.existsSync(inside));
  assert.ok(!fs.existsSync(outside));
});

test('RETAIN: no LEDGER row is ever pruned — the verdict ledgers are byte-identical after a prune', () => {
  const w = retentionStore();
  w.put(w.caps, 'old.json', 30);
  const oldRow = JSON.stringify({ ts: new Date(w.now - 400 * DAY).toISOString(), status: 'ok', prompt_sha256: 'x' }) + '\n';
  for (const f of ['jev_judge.jsonl', 'shadow.jsonl']) fs.writeFileSync(path.join(w.store, f), oldRow);
  R.pruneJudgeCaptures({ store: w.store, now: () => new Date(w.now) });
  for (const f of ['jev_judge.jsonl', 'shadow.jsonl']) assert.strictEqual(fs.readFileSync(path.join(w.store, f), 'utf8'), oldRow, `${f} changed`);
});

test('RETAIN: the prune never touches anything OUTSIDE the capture directory — and every path it deleted is inside it', () => {
  const w = retentionStore();
  w.put(w.caps, 'old.json', 30);
  // Old files everywhere else: the store root, the SHADOW's captures, a sub-directory of judge-captures, a sibling dir.
  const outside = [
    w.put(w.store, 'runner.log.json', 30),
    w.put(path.join(w.store, 'captures', 'l2'), 'job.json', 30),
    w.put(path.join(w.caps, 'nested'), 'deep.json', 30),
    w.put(path.join(w.store, '..', path.basename(w.store) + '-sibling'), 'x.json', 30),
  ];
  const r = R.pruneJudgeCaptures({ store: w.store, now: () => new Date(w.now) });
  for (const p of outside) assert.ok(fs.existsSync(p), `the prune deleted ${p}, outside the capture directory`);
  assert.ok(r.deleted.length === 1);
  for (const p of r.deleted) assert.strictEqual(path.dirname(path.resolve(p)), path.resolve(w.caps), `deleted ${p} is not directly inside the capture dir`);
});

test('RETAIN: a capture with no readable captured_at falls back to its file time — never guessed young, never kept forever', () => {
  const w = retentionStore();
  const p = path.join(w.caps, 'undated.json');
  fs.writeFileSync(p, 'not json at all');
  const t = new Date(w.now - 20 * DAY);
  fs.utimesSync(p, t, t);
  R.pruneJudgeCaptures({ store: w.store, now: () => new Date(w.now) });
  assert.ok(!fs.existsSync(p));
});

test('RETAIN in the runner: an old capture is pruned at start, and the log says how many', async () => {
  const f = fixture(); const app = fakeApp();
  fs.mkdirSync(path.join(f.store, 'judge-captures'), { recursive: true });
  const old = path.join(f.store, 'judge-captures', 'old.json');
  fs.writeFileSync(old, JSON.stringify({ captured_at: new Date(Date.now() - 30 * DAY).toISOString() }));
  try {
    const h = await R.run(opts(f, app));
    await waitFor(() => !fs.existsSync(old));
    assert.match(log(f), /retention: pruned 1 judge capture/);
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

// HERMETIC FOR JUDGE MODE TOO (L071, pane A). With judge mode, main() reads this machine's roster and transcripts.
// This helper spread process.env, which in a seat carries CONSONANCE_DATA, so the first run of the CLI test below
// captured FOUR REAL seat turns and sent one to the real gateway under the fake key (HTTP 401, nothing billed) —
// found in the test store, jev-runner-Bp1Hs8. So the data dir and the projects dir are pinned to empty fixtures here.
const cliEnv = (f) => {
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-runner-empty-'));
  const e = { ...process.env, JEV_SHADOW_STORE: f.store, CONSONANCE_SHELL_DIR: f.shell, JEV_SHADOW_DISCIPLINE: f.disc,
    JEV_SHADOW_NO_USER_ENV: '1', CONSONANCE_DATA: empty, CLAUDE_PROJECTS_DIR: empty };
  delete e.AI_GATEWAY_API_KEY;
  return e;
};

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
  // L071: the CLI's judge mode must not have reached this machine's real seats (see cliEnv).
  assert.ok(!fs.existsSync(path.join(f.store, 'judge-captures')), 'a CLI test captured real seat turns');
});

test('the default store is %LOCALAPPDATA%\\consonance\\jev-shadow — outside the data dir', () => {
  // A drive-less root (L071): the assertion is about the JOIN under LOCALAPPDATA, and a drive letter in a fixture is a
  // machine-specific site to portable-paths (this line was its one red, from D104 on).
  const lad = path.join(path.sep, 'X', 'Local');
  assert.strictEqual(R.defaultStore({ LOCALAPPDATA: lad }), path.join(lad, 'consonance', 'jev-shadow'));
  assert.throws(() => R.defaultStore({}), (e) => e instanceof R.Refusal && /LOCALAPPDATA/.test(e.message));
});

test('the User-environment reader parses reg.exe output and returns null when the value is absent', () => {
  const out = '\r\nHKEY_CURRENT_USER\\Environment\r\n    AI_GATEWAY_API_KEY    REG_SZ    abc123-def\r\n\r\n';
  assert.strictEqual(R.parseRegQuery(out, 'AI_GATEWAY_API_KEY'), 'abc123-def');
  assert.strictEqual(R.parseRegQuery('\r\nERROR: nothing\r\n', 'AI_GATEWAY_API_KEY'), null);
});
