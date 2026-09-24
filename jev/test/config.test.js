'use strict';
// jev/test/config.test.js — L114 (pane C): config.load is PURE over its arguments. Every test builds its own home and cwd
// under the OS temp dir; nothing reads the real home, the real environment or a real ~/.jev.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const C = require('../lib/config.js');

const dirs = [];
function tmp() { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-config-')); dirs.push(d); return d; }
process.on('exit', () => { for (const d of dirs) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (_) {} } });
function world(config, { platform = process.platform, env = {} } = {}) {   // the REAL platform wherever the real fs is touched
  const home = tmp();
  const cwd = path.join(tmp(), 'proj', 'sub', 'deep');
  fs.mkdirSync(cwd, { recursive: true });
  if (config !== undefined) {
    fs.mkdirSync(path.join(home, '.jev'), { recursive: true });
    fs.writeFileSync(path.join(home, '.jev', 'config.json'), typeof config === 'string' ? config : JSON.stringify(config));
  }
  return { home, cwd, platform, env };
}

// ── defaults ───────────────────────────────────────────────────────────────────────────────────────────────────────
test('with no config file every default holds: judge all, not opted out, audience session, dream off, no sessions', () => {
  const r = C.load(world());
  assert.strictEqual(r.judge, 'all');
  assert.strictEqual(r.optedOut, false);
  assert.strictEqual(r.audience, 'session');
  assert.strictEqual(r.dream, false);
  assert.deepStrictEqual(r.sessions, []);
  assert.deepStrictEqual(r.gateway, { url: 'https://ai-gateway.vercel.sh/v1/evaluate', model: 'typesafe-ai/jev' });
  assert.strictEqual(r.rubricPath, C.DEFAULT_RUBRIC);
});

test('the default rubric is the METHOD.md the module actually ships (jev/METHOD.md), not a path to nothing', () => {
  assert.strictEqual(C.DEFAULT_RUBRIC, path.join(__dirname, '..', 'METHOD.md'));
  assert.ok(fs.existsSync(C.DEFAULT_RUBRIC), `no shipped rubric at ${C.DEFAULT_RUBRIC}`);
});

test('ledgerDir default, Windows: %LOCALAPPDATA%\\jev, from the env the caller passes', () => {
  const w = world(undefined, { platform: 'win32', env: { LOCALAPPDATA: 'C:\\Users\\x\\AppData\\Local' } });
  assert.strictEqual(C.load(w).ledgerDir, path.win32.join('C:\\Users\\x\\AppData\\Local', 'jev'));
});

test('ledgerDir default, Windows without LOCALAPPDATA: <home>\\AppData\\Local\\jev', () => {
  const w = world(undefined, { platform: 'win32', env: {} });
  assert.strictEqual(C.load(w).ledgerDir, path.win32.join(w.home, 'AppData', 'Local', 'jev'));
});

test('ledgerDir default, macOS: ~/Library/Application Support/jev', () => {
  const w = world(undefined, { platform: 'darwin' });
  assert.strictEqual(C.load(w).ledgerDir, path.posix.join(w.home, 'Library', 'Application Support', 'jev'));
});

test('ledgerDir default, Linux: $XDG_STATE_HOME/jev when it is absolute, else ~/.local/state/jev', () => {
  assert.strictEqual(C.load(world(undefined, { platform: 'linux', env: { XDG_STATE_HOME: '/var/xdg' } })).ledgerDir, path.posix.join('/var/xdg', 'jev'));
  const w = world(undefined, { platform: 'linux', env: { XDG_STATE_HOME: 'relative/not/allowed' } });
  assert.strictEqual(C.load(w).ledgerDir, path.posix.join(w.home, '.local', 'state', 'jev'), 'the XDG spec ignores a relative value');
  const w2 = world(undefined, { platform: 'linux', env: {} });
  assert.strictEqual(C.load(w2).ledgerDir, path.posix.join(w2.home, '.local', 'state', 'jev'));
});

// ── overrides ──────────────────────────────────────────────────────────────────────────────────────────────────────
test('every field can be overridden from ~/.jev/config.json, and ~ expands against the home PASSED in', () => {
  const w = world({ judge: 'listed', sessions: ['s1', 's2'], ledgerDir: '~/my-ledgers', gateway: { url: 'https://example.test/v1/evaluate', model: 'm/x' },
    rubric: '~/rubrics/mine.md', audience: 'consonance', dream: true });
  const r = C.load(w);
  assert.strictEqual(r.judge, 'listed');
  assert.deepStrictEqual(r.sessions, ['s1', 's2']);
  assert.strictEqual(r.ledgerDir, path.join(w.home, 'my-ledgers'));
  assert.deepStrictEqual(r.gateway, { url: 'https://example.test/v1/evaluate', model: 'm/x' });
  assert.strictEqual(r.rubricPath, path.join(w.home, 'rubrics', 'mine.md'));
  assert.strictEqual(r.audience, 'consonance');
  assert.strictEqual(r.dream, true);
});

test('a partial gateway override keeps the other default', () => {
  assert.deepStrictEqual(C.load(world({ gateway: { model: 'm/y' } })).gateway, { url: C.DEFAULT_GATEWAY.url, model: 'm/y' });
});

// ── opt-out ────────────────────────────────────────────────────────────────────────────────────────────────────────
test('a .jev-off file in cwd opts the project out, and says which file', () => {
  const w = world();
  fs.writeFileSync(path.join(w.cwd, '.jev-off'), '');
  const r = C.load(w);
  assert.strictEqual(r.optedOut, true);
  assert.strictEqual(r.optedOutBy, `.jev-off at ${path.join(w.cwd, '.jev-off')}`);
});

test('a .jev-off file in an ANCESTOR of cwd opts it out too', () => {
  const w = world();
  const proj = path.dirname(path.dirname(w.cwd));
  fs.writeFileSync(path.join(proj, '.jev-off'), '');
  const r = C.load(w);
  assert.strictEqual(r.optedOut, true);
  assert.match(r.optedOutBy, /\.jev-off at /);
});

test('the ancestor walk visits cwd and every ancestor, INCLUDING the filesystem root, and then stops', () => {
  const seen = [];
  const cwd = path.join(path.parse(os.tmpdir()).root, 'a', 'b', 'c');
  assert.strictEqual(C.findOptOutFile(cwd, (p) => { seen.push(p); return false; }), null);
  const dirsSeen = seen.map((p) => path.dirname(p));
  assert.deepStrictEqual(dirsSeen, [cwd, path.dirname(cwd), path.dirname(path.dirname(cwd)), path.parse(cwd).root]);
  const atRoot = path.join(path.parse(cwd).root, '.jev-off');
  assert.strictEqual(C.findOptOutFile(cwd, (p) => p === atRoot), atRoot, 'a .jev-off at the root counts');
});

test('a real cwd AT the filesystem root returns rather than walking forever', () => {
  const w = world();
  const r = C.load({ ...w, cwd: path.parse(w.cwd).root });
  assert.strictEqual(typeof r.optedOut, 'boolean');
});

test('the config list opts out a listed directory and everything under it, and nothing else', () => {
  const w = world();
  const proj = path.dirname(path.dirname(w.cwd));
  fs.mkdirSync(path.join(w.home, '.jev'), { recursive: true });
  fs.writeFileSync(path.join(w.home, '.jev', 'config.json'), JSON.stringify({ optOut: [proj] }));
  const r = C.load(w);
  assert.strictEqual(r.optedOut, true);
  assert.strictEqual(r.optedOutBy, `config optOut ${proj}`);
  assert.strictEqual(C.load({ ...w, cwd: w.home }).optedOut, false, 'a directory outside the list is judged');
  const sibling = proj + '-other';
  fs.mkdirSync(sibling);
  assert.strictEqual(C.load({ ...w, cwd: sibling }).optedOut, false, 'a name PREFIX is not containment');
});

test('on Windows the opt-out list matches case-insensitively, as the filesystem does', () => {
  const w = world(undefined, { platform: 'win32', env: { LOCALAPPDATA: 'C:\\L' } });
  const proj = path.dirname(path.dirname(w.cwd));
  fs.mkdirSync(path.join(w.home, '.jev'), { recursive: true });
  fs.writeFileSync(path.join(w.home, '.jev', 'config.json'), JSON.stringify({ optOut: [proj.toUpperCase()] }));
  assert.strictEqual(C.load(w).optedOut, true, 'an upper-cased listed path still opts out under win32 rules');
  assert.strictEqual(C.within('C:\\Proj', 'c:\\proj\\sub', 'win32'), true);
  assert.strictEqual(C.within('/Proj', '/proj/sub', 'linux'), false);
});

// ── loud failure ───────────────────────────────────────────────────────────────────────────────────────────────────
test('a malformed config fails LOUDLY with the file path, never a silent fallback to defaults', () => {
  const w = world('{ "judge": "all", ');
  const file = path.join(w.home, '.jev', 'config.json');
  assert.throws(() => C.load(w), (e) => e.message.includes(file) && /not valid JSON/.test(e.message));
});

test('a wrong value, a wrong type and an unknown key each fail loudly, naming the file and the key', () => {
  for (const [cfg, key] of [[{ judge: 'some' }, 'judge'], [{ dream: 'yes' }, 'dream'], [{ sessions: 'abc' }, 'sessions'],
    [{ audience: 'everyone' }, 'audience'], [{ ledgerDir: 'relative/dir' }, 'ledgerDir'], [{ gateway: { url: 'http://insecure' } }, 'gateway.url'],
    [{ judgee: 'all' }, 'judgee'], [[], 'config']]) {
    const w = world(cfg);
    const file = path.join(w.home, '.jev', 'config.json');
    assert.throws(() => C.load(w), (e) => e.message.includes(file) && e.message.includes(key), JSON.stringify(cfg));
  }
});

// ── the key is not config ──────────────────────────────────────────────────────────────────────────────────────────
test('a key in the config file is REFUSED, loudly, without echoing it', () => {
  for (const k of ['key', 'apiKey', 'AI_GATEWAY_API_KEY', 'token']) {
    const w = world({ [k]: 'sk-secret-value-123' });
    assert.throws(() => C.load(w), (e) => /environment/i.test(e.message) && !e.message.includes('sk-secret-value-123'), k);
  }
});

test('load never returns a key, even with one in the env it is given', () => {
  const r = C.load(world(undefined, { env: { AI_GATEWAY_API_KEY: 'sk-live-should-not-appear' } }));
  assert.ok(!JSON.stringify(r).includes('sk-live-should-not-appear'));
  assert.ok(!Object.keys(r).some((k) => /key|token/i.test(k)));
});

// ── purity ─────────────────────────────────────────────────────────────────────────────────────────────────────────
test('load is pure over its arguments: it uses the env and home it is GIVEN, never process.env or the real home', () => {
  const saved = process.env.XDG_STATE_HOME;
  process.env.XDG_STATE_HOME = '/should/not/be/used';
  try {
    const w = world(undefined, { platform: 'linux', env: {} });
    assert.strictEqual(C.load(w).ledgerDir, path.posix.join(w.home, '.local', 'state', 'jev'));
  } finally { if (saved === undefined) delete process.env.XDG_STATE_HOME; else process.env.XDG_STATE_HOME = saved; }
  const src = fs.readFileSync(path.join(__dirname, '..', 'lib', 'config.js'), 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.ok(!/process\.env/.test(src), 'config.js code must not read process.env');
  assert.ok(!/homedir\s*\(/.test(src), 'config.js code must not call os.homedir()');
});

test('a missing home or cwd is refused rather than guessed', () => {
  assert.throws(() => C.load({ env: {}, cwd: tmp(), platform: 'linux' }), /home/);
  assert.throws(() => C.load({ env: {}, home: tmp(), platform: 'linux' }), /cwd/);
});

// ── D124: ${NAME} in path values, from the env PASSED IN ───────────────────────────────────────────────────────────
// Rules (config.js header): ${NAME} expands; $$ is a literal $; any other $ is refused; an undefined OR empty variable is
// refused naming the variable and the file, never its value; only path values (ledgerDir, rubric, optOut) expand.
const cfgFile = (w) => path.join(w.home, '.jev', 'config.json');

test('D124 ${NAME} in ledgerDir expands from the env PASSED IN', () => {
  const base = tmp();
  const w = world({ ledgerDir: '${STORE_BASE}/consonance/jev-shadow' }, { env: { STORE_BASE: base } });
  assert.strictEqual(C.load(w).ledgerDir, path.join(base, 'consonance', 'jev-shadow'));
});

test('D124 an UNDEFINED variable is a loud refusal naming the variable and the config file', () => {
  const w = world({ ledgerDir: '${NOPE_NOT_SET}/x' }, { env: {} });
  assert.throws(() => C.load(w), (e) => e.message.includes('NOPE_NOT_SET') && e.message.includes(cfgFile(w)) && /not set/.test(e.message));
});

test('D124 a variable set to the EMPTY string is refused too — "${X}/jev" must not become "/jev"', () => {
  const w = world({ ledgerDir: '${EMPTY_ONE}/jev' }, { env: { EMPTY_ONE: '' } });
  assert.throws(() => C.load(w), (e) => e.message.includes('EMPTY_ONE') && /empty/.test(e.message) && e.message.includes(cfgFile(w)));
});

test('D124 a refusal never echoes a variable\'s VALUE', () => {
  const w = world({ ledgerDir: '${REL}/jev' }, { env: { REL: 'relative-secret-value' } });
  assert.throws(() => C.load(w), (e) => !e.message.includes('relative-secret-value') && /absolute/.test(e.message));
});

test('D124 bare $NAME (no braces) is REFUSED, with the fix named: ${NAME}, or $$ for a literal $', () => {
  const w = world({ ledgerDir: '$HOME/jev' }, { env: { HOME: tmp() } });
  assert.throws(() => C.load(w), (e) => /\$\{NAME\}/.test(e.message) && /\$\$/.test(e.message) && e.message.includes(cfgFile(w)));
});

test('D124 $$ is a literal $, so $${NAME} is the literal text ${NAME}, never expanded', () => {
  const base = tmp();
  const w = world({ ledgerDir: path.join(base, 'a$$b', '$${NOT_EXPANDED}') }, { env: { NOT_EXPANDED: 'SHOULD-NOT-APPEAR' } });
  assert.strictEqual(C.load(w).ledgerDir, path.join(base, 'a$b', '${NOT_EXPANDED}'));
});

test('D124 a malformed reference is refused FOR ITS OWN REASON: unclosed, empty, or not a name', () => {
  // The env DEFINES every odd name, so a malformed reference cannot fall through to a "not set" refusal and pass anyway
  // (mutants X9 and X10 survived the first version of this test, which checked only that the file was named).
  const base = tmp();
  const env = { UNCLOSED: base, '': base, '1BAD': base, 'A-B': base, A: base };
  for (const [bad, reason] of [['${UNCLOSED/jev', /unclosed/], ['${}/jev', /not a variable name/], ['${1BAD}/jev', /not a variable name/], ['${A-B}/jev', /not a variable name/]]) {
    const w = world({ ledgerDir: bad }, { env });
    assert.throws(() => C.load(w), (e) => e.message.includes(cfgFile(w)) && reason.test(e.message), bad);
  }
});

test('D124 rubric and optOut expand the same way; a ~ path still expands against home', () => {
  const base = tmp();
  const w = world({ rubric: '${RB}/METHOD.md', optOut: ['${OO}'], ledgerDir: '~/${SUB}' }, { env: { RB: base, OO: base, SUB: 'ledgers' } });
  const r = C.load(w);
  assert.strictEqual(r.rubricPath, path.join(base, 'METHOD.md'));
  assert.strictEqual(r.ledgerDir, path.join(w.home, 'ledgers'));
  assert.strictEqual(C.load({ ...w, cwd: path.join(base) }).optedOut, true);
});

test('D124 only PATH values expand: a ${...} in gateway.model or sessions is taken as written', () => {
  const w = world({ gateway: { model: 'm/${X}' }, sessions: ['${X}'] }, { env: { X: 'expanded' } });
  const r = C.load(w);
  assert.strictEqual(r.gateway.model, 'm/${X}');
  assert.deepStrictEqual(r.sessions, ['${X}']);
});

test('D124 on win32 a variable name matches case-insensitively, as Windows env names do', () => {
  const base = tmp();
  const w = world({ ledgerDir: '${LocalAppData}/jev' }, { platform: 'win32', env: { LOCALAPPDATA: base } });
  assert.strictEqual(C.load(w).ledgerDir, path.win32.join(base, 'jev'));
  assert.strictEqual(C.expandVars('${Home}', { HOME: '/h' }, { file: 'f', key: 'k', platform: 'linux' }).ok, false, 'posix names are case-sensitive');
});

test('D124 load stays pure: expansion reads the env passed in, never process.env', () => {
  const saved = process.env.D124_ONLY_IN_PROCESS;
  process.env.D124_ONLY_IN_PROCESS = tmp();
  try {
    const w = world({ ledgerDir: '${D124_ONLY_IN_PROCESS}/jev' }, { env: {} });
    assert.throws(() => C.load(w), /D124_ONLY_IN_PROCESS/);
  } finally { if (saved === undefined) delete process.env.D124_ONLY_IN_PROCESS; else process.env.D124_ONLY_IN_PROCESS = saved; }
});

test('D124 a stranger\'s defaults are unchanged: no config file, no expansion, the same per-OS ledgerDir', () => {
  // A temp dir, not a drive literal. The first version said 'C:\L', which the heredoc had stripped to one backslash, so it
  // was the string "C:L", and portable-paths flagged it (D124).
  const lad = tmp();
  const w = world(undefined, { platform: 'win32', env: { LOCALAPPDATA: lad } });
  assert.strictEqual(C.load(w).ledgerDir, path.win32.join(lad, 'jev'));
});
