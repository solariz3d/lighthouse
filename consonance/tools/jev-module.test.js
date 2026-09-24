// jev-module.test.js — node --test consonance/tools/jev-module.test.js
//
// D123 (pane A): CONSONANCE AS A CONFIG CONSUMER of the standalone jev/ module. With CONSONANCE_JEV_MODULE=on the room's
// judge builds its prompt with jev/lib/prompt.js and asks through jev/lib/ask.js, configured by the room's own
// consonance/jev-room/.jev/config.json; with it off — the default — nothing changes (jev-judge.test.js, unmodified, is
// the proof of that half). NO LIVE CALLS: fetch is stubbed. Every world is a temp copy; the real ledger is never opened.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const J = require('./jev-judge.js');

const REPO = path.resolve(__dirname, '..', '..');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const KEY = ['test', 'only', 'module', 'key', '7d3e'].join('-');
const MAIN = '0c0c0c0a-0000-4000-8000-000000000a01', LIB = '0c0c0c0b-0000-4000-8000-00000000115b', TP = '3d000000-0000-4000-8000-000000003d00';
const ROOM_CONFIG = path.join(REPO, 'consonance', 'jev-room', '.jev', 'config.json');
// D124: the room config states its store as ${LOCALAPPDATA}/consonance/jev-shadow, so every load of it needs LOCALAPPDATA in
// the env it is given — exactly as the runner's own defaultStore() does. A temp dir stands in for it; nothing is written there.
const ROOM_ENV = { LOCALAPPDATA: fs.mkdtempSync(path.join(os.tmpdir(), 'jev-module-lad-')) };

/** A room: the real L2 hooks, a main.rs with the three fixed ids, the real jev/ module and the real room config. */
function world({ config = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-module-'));
  const repo = path.join(root, 'repo'), data = path.join(root, 'data'), projects = path.join(root, 'projects'), store = path.join(root, 'store');
  const cp = (rel) => { fs.mkdirSync(path.dirname(path.join(repo, rel)), { recursive: true }); fs.copyFileSync(path.join(REPO, rel), path.join(repo, rel)); };
  for (const h of ['l2-overseer.js', 'l2-overseer-worker.js']) cp(path.join('dev', 'shell', 'hooks', h));
  for (const f of ['prompt.js', 'ask.js', 'config.js']) cp(path.join('jev', 'lib', f));
  cp(path.join('jev', 'METHOD.md'));
  cp('METHOD.md');
  if (config) cp(path.join('consonance', 'jev-room', '.jev', 'config.json'));
  fs.mkdirSync(path.join(repo, 'consonance', 'src-tauri', 'src'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'consonance', 'src-tauri', 'src', 'main.rs'),
    `const MAIN_SID: &str = "${MAIN}";\nconst LIBRARIAN_SID: &str = "${LIB}";\nconst THIRD_PLACE_SID: &str = "${TP}";\n`);
  fs.mkdirSync(data, { recursive: true });
  fs.writeFileSync(path.join(data, 'panes.json'), '[]');
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-module-home-'));   // no ~/.consonance.json: the repo is passed
  return { root, repo, data, projects, store, home };
}
let seq = 0;
function turn(w, sid, user = 'what is the state', move = 'here is the state, plainly') {
  const d = path.join(w.projects, 'C--seat'); fs.mkdirSync(d, { recursive: true });
  const rows = [{ type: 'user', uuid: `u${++seq}`, timestamp: new Date().toISOString(), message: { role: 'user', content: user } },
    { type: 'assistant', uuid: `a${++seq}`, timestamp: new Date().toISOString(), message: { role: 'assistant', stop_reason: 'end_turn', content: [{ type: 'text', text: move }] } }];
  fs.writeFileSync(path.join(d, `${sid}.jsonl`), rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
}
const O = (w, extra = {}) => ({ store: w.store, repo: w.repo, dataDir: w.data, projectsDir: w.projects, disciplineDir: w.repo, home: w.home, memo: {}, ...extra });
const caps = (w) => { try { return fs.readdirSync(path.join(w.store, J.CAPTURES)).map((f) => JSON.parse(fs.readFileSync(path.join(w.store, J.CAPTURES, f), 'utf8'))); } catch { return []; } };
const rows = (w) => { try { return fs.readFileSync(path.join(w.store, J.LEDGER), 'utf8').split('\n').filter(Boolean).map(JSON.parse); } catch { return []; } };
function gateway(reply) {
  const calls = [];
  const f = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    if (reply) return reply(calls.length);
    return { ok: true, status: 200, headers: { get: () => null },
      text: async () => JSON.stringify({ model: 'typesafe-ai/jev', answers: { verdict: { type: 'choice', choice: 'clean', probabilities: { clean: 0.9, drift: 0.05, abstain: 0.05 } } }, usage: { inputTokens: 10, outputTokens: 1 } }) };
  };
  f.calls = calls;
  return f;
}

// ── the switch ─────────────────────────────────────────────────────────────────────────────────────────────────────
test('the switch is CONSONANCE_JEV_MODULE, and only the exact value "on" turns it on', () => {
  assert.strictEqual(J.JEV_MODULE_FLAG, 'CONSONANCE_JEV_MODULE');
  assert.strictEqual(J.jevModuleOn({ CONSONANCE_JEV_MODULE: 'on' }), true);
  for (const v of [undefined, '', 'ON', 'On', '1', 'true', 'yes', ' on', 'on ']) assert.strictEqual(J.jevModuleOn({ CONSONANCE_JEV_MODULE: v }), false, JSON.stringify(v));
  assert.strictEqual(J.jevModuleOn(undefined), false);
});

// ── the room's config ──────────────────────────────────────────────────────────────────────────────────────────────
test('the room config loads through jev/lib/config.js as written: listed seats, audience consonance, the dream guard on', () => {
  const { load } = require(path.join(REPO, 'jev', 'lib', 'config.js'));
  const c = load({ env: ROOM_ENV, home: path.dirname(path.dirname(ROOM_CONFIG)), cwd: fs.mkdtempSync(path.join(os.tmpdir(), 'jev-module-cwd-')) });
  assert.deepStrictEqual([c.judge, c.audience, c.dream, c.optedOut], ['listed', 'consonance', true, false]);
});

test('D124: the room config STATES its store, and it is the runner\'s own store (closes A\'s D123 §2.1)', () => {
  const { load } = require(path.join(REPO, 'jev', 'lib', 'config.js'));
  const { defaultStore } = require('./jev-shadow-runner.js');
  assert.strictEqual(JSON.parse(fs.readFileSync(ROOM_CONFIG, 'utf8')).ledgerDir, '${LOCALAPPDATA}/consonance/jev-shadow', 'written with the variable, not a machine path');
  const c = load({ env: ROOM_ENV, home: path.dirname(path.dirname(ROOM_CONFIG)), cwd: fs.mkdtempSync(path.join(os.tmpdir(), 'jev-module-cwd-')), platform: 'win32' });
  assert.strictEqual(c.ledgerDir, defaultStore(ROOM_ENV), 'the config and the runner name the same directory');
});

test('D124: the room config without LOCALAPPDATA is REFUSED loudly, naming the variable and the file — as the runner refuses', () => {
  const w = world();
  assert.throws(() => J.loadJevModule({ repo: w.repo, env: {}, home: w.home }),
    (e) => e instanceof J.Refusal && /LOCALAPPDATA/.test(e.message) && /jev-room.*config\.json/.test(e.message) && /not set/.test(e.message));
});

test('the room config\'s sessions ARE the three fixed seats in main.rs — a changed id there turns this red', () => {
  const rs = fs.readFileSync(path.join(REPO, 'consonance', 'src-tauri', 'src', 'main.rs'), 'utf8');
  const ids = ['MAIN_SID', 'LIBRARIAN_SID', 'THIRD_PLACE_SID'].map((n) => new RegExp(`const ${n}: &str = "([0-9a-f-]+)"`).exec(rs)[1]);
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(ROOM_CONFIG, 'utf8')).sessions, ids);
});

// ── loading the module ─────────────────────────────────────────────────────────────────────────────────────────────
test('loadJevModule: the module and the config from the room\'s OWN tree, and the prompt builder\'s hash', () => {
  const w = world();
  const m = J.loadJevModule({ repo: w.repo, env: ROOM_ENV, home: w.home });
  assert.strictEqual(typeof m.prompt.buildPrompt, 'function');
  assert.strictEqual(typeof m.ask.ask, 'function');
  assert.strictEqual(m.config.audience, 'consonance');
  assert.strictEqual(m.configFile, path.join(w.repo, 'consonance', 'jev-room', '.jev', 'config.json'));
  assert.strictEqual(m.sourcesSha, sha(fs.readFileSync(path.join(w.repo, 'jev', 'lib', 'prompt.js'), 'utf8')));
});

test('loadJevModule REFUSES, naming the file, when the room config is missing — an absent file is not "all defaults" here', () => {
  const w = world({ config: false });
  assert.throws(() => J.loadJevModule({ repo: w.repo, env: ROOM_ENV, home: w.home }), (e) => e instanceof J.Refusal && /jev-room.*config\.json/.test(e.message) && /does not exist/.test(e.message));
});

test('loadJevModule REFUSES a room config whose audience is not consonance', () => {
  const w = world();
  const f = path.join(w.repo, 'consonance', 'jev-room', '.jev', 'config.json');
  fs.writeFileSync(f, JSON.stringify({ ...JSON.parse(fs.readFileSync(f, 'utf8')), audience: 'session' }));
  assert.throws(() => J.loadJevModule({ repo: w.repo, env: ROOM_ENV, home: w.home }), (e) => e instanceof J.Refusal && /audience/.test(e.message));
});

test('loadJevModule REFUSES an invalid room config, carrying jev/lib/config.js\'s own reason', () => {
  const w = world();
  fs.writeFileSync(path.join(w.repo, 'consonance', 'jev-room', '.jev', 'config.json'), '{"judge":"some"}');
  assert.throws(() => J.loadJevModule({ repo: w.repo, env: ROOM_ENV, home: w.home }), (e) => e instanceof J.Refusal && /"judge" must be "all" or "listed"/.test(e.message));
});

test('loadJevModule REFUSES when the room is opted out with a .jev-off marker, and says where the marker is', () => {
  const w = world();
  fs.writeFileSync(path.join(w.repo, '.jev-off'), '');
  assert.throws(() => J.loadJevModule({ repo: w.repo, env: ROOM_ENV, home: w.home }), (e) => e instanceof J.Refusal && /opted out/.test(e.message) && /\.jev-off/.test(e.message));
});

test('loadJevModule REFUSES when the room has no jev/ module beside it', () => {
  const w = world();
  fs.rmSync(path.join(w.repo, 'jev'), { recursive: true, force: true });
  assert.throws(() => J.loadJevModule({ repo: w.repo, env: ROOM_ENV, home: w.home }), (e) => e instanceof J.Refusal && /jev[\\/]lib[\\/]prompt\.js/.test(e.message));
});

// ── capture ────────────────────────────────────────────────────────────────────────────────────────────────────────
test('capturePass WITHOUT the module is today\'s: no `via`, the room\'s own builders', () => {
  const w = world(); turn(w, MAIN);
  J.capturePass(O(w));
  const [c] = caps(w);
  assert.strictEqual(c.via, undefined);
});

test('capturePass WITH the module: the capture says so, and carries the module\'s prompt built from the room\'s rubric', () => {
  const w = world(); turn(w, MAIN);
  const m = J.loadJevModule({ repo: w.repo, env: ROOM_ENV, home: w.home });
  J.capturePass(O(w, { jevModule: m }));
  const [c] = caps(w);
  assert.strictEqual(c.via, 'jev-module');
  const disc = m.prompt.readDiscipline(m.config.rubricPath);
  const view = m.prompt.narrowedView(path.join(w.projects, 'C--seat', `${MAIN}.jsonl`));
  assert.strictEqual(c.l2.prompt, m.prompt.buildPrompt({ view, discipline: disc }));
  assert.deepStrictEqual([c.method_sha256, c.sources_sha256], [sha(disc), m.sourcesSha]);
});

test('the two paths build the SAME prompt for the same turn when both read the same METHOD.md', () => {
  const a = world(), b = world();
  turn(a, MAIN, 'the same question', 'the same move'); turn(b, MAIN, 'the same question', 'the same move');
  J.capturePass(O(a));
  J.capturePass(O(b, { jevModule: J.loadJevModule({ repo: b.repo, env: ROOM_ENV, home: b.home }) }));
  assert.strictEqual(caps(b)[0].l2.prompt, caps(a)[0].l2.prompt);
});

// ── the ask ────────────────────────────────────────────────────────────────────────────────────────────────────────
test('judgePass WITH the module asks through jev/lib/ask.js at the config\'s gateway, and writes today\'s row shape to today\'s ledger', async () => {
  const w = world(); turn(w, MAIN);
  const m = J.loadJevModule({ repo: w.repo, env: ROOM_ENV, home: w.home });
  J.capturePass(O(w, { jevModule: m }));
  const g = gateway();
  const res = await J.judgePass({ store: w.store, maxCalls: 5, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: g, jevModule: m });
  assert.strictEqual(res.asked, 1);
  assert.deepStrictEqual([g.calls[0].url, g.calls[0].body.model], [m.config.gateway.url, m.config.gateway.model]);
  assert.strictEqual(g.calls[0].body.state, caps(w)[0].l2.prompt);
  const [r] = rows(w);
  assert.deepStrictEqual([r.status, r.via, r.level, r.session_id, r.seat, r.jev.verdict.choice], ['ok', 'jev-module', 'l2', MAIN, 'main', 'clean']);
  assert.deepStrictEqual(r.jev.verdict.probabilities, { clean: 0.9, drift: 0.05, abstain: 0.05 });
  for (const k of ['ts', 'judge', 'unverified', 'turn_uuid', 'turn_ts', 'prompt_sha256', 'discipline_sha256', 'sources_sha256', 'model', 'usage', 'ms']) assert.ok(k in r, `row lacks ${k}`);
  assert.strictEqual(r.prompt_sha256, sha(caps(w)[0].l2.prompt));
});

test('judgePass WITH the module: a 503 is skipped with no row, and the item is asked again next pass', async () => {
  const w = world(); turn(w, MAIN);
  const m = J.loadJevModule({ repo: w.repo, env: ROOM_ENV, home: w.home });
  J.capturePass(O(w, { jevModule: m }));
  const bad = gateway(() => ({ ok: false, status: 503, headers: { get: () => null }, text: async () => 'upstream unavailable' }));
  const r1 = await J.judgePass({ store: w.store, maxCalls: 5, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: bad, jevModule: m });
  assert.deepStrictEqual([r1.asked, r1.failed.map((x) => x.status), rows(w).length], [0, [503], 0]);
  const r2 = await J.judgePass({ store: w.store, maxCalls: 5, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: gateway(), jevModule: m });
  assert.strictEqual(r2.asked, 1);
});

test('judgePass WITH the module: a 401 ends the pass (it would fail every call), as today', async () => {
  const w = world(); turn(w, MAIN);
  const m = J.loadJevModule({ repo: w.repo, env: ROOM_ENV, home: w.home });
  J.capturePass(O(w, { jevModule: m }));
  const bad = gateway(() => ({ ok: false, status: 401, headers: { get: () => null }, text: async () => 'no' }));
  await assert.rejects(J.judgePass({ store: w.store, maxCalls: 5, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: bad, jevModule: m }), /HTTP 401/);
  assert.strictEqual(rows(w).length, 0);
});

test('judgePass WITH the module: a prompt matching a secret pattern gets ONE refused row and no call', async () => {
  const w = world(); turn(w, MAIN, 'q', 'here: AI_GATEWAY_API_KEY=' + 'x'.repeat(60));
  const m = J.loadJevModule({ repo: w.repo, env: ROOM_ENV, home: w.home });
  J.capturePass(O(w, { jevModule: m }));
  const g = gateway();
  const res = await J.judgePass({ store: w.store, maxCalls: 5, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: g, jevModule: m });
  assert.deepStrictEqual([res.refused, g.calls.length, rows(w)[0].status, rows(w)[0].via], [1, 0, 'refused', 'jev-module']);
});

test('judgePass WITH the module uses the gateway the ROOM CONFIG names, not a constant', async () => {
  const w = world(); turn(w, MAIN);
  const f = path.join(w.repo, 'consonance', 'jev-room', '.jev', 'config.json');
  fs.writeFileSync(f, JSON.stringify({ ...JSON.parse(fs.readFileSync(f, 'utf8')), gateway: { url: 'https://gateway.example.test/v1/evaluate', model: 'example/judge-model' } }));
  const m = J.loadJevModule({ repo: w.repo, env: ROOM_ENV, home: w.home });
  J.capturePass(O(w, { jevModule: m }));
  const g = gateway();
  await J.judgePass({ store: w.store, maxCalls: 5, env: { AI_GATEWAY_API_KEY: KEY }, fetchImpl: g, jevModule: m });
  assert.deepStrictEqual([g.calls[0].url, g.calls[0].body.model], ['https://gateway.example.test/v1/evaluate', 'example/judge-model']);
});
