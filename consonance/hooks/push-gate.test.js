// push-gate.test.js - node --test consonance/hooks/push-gate.test.js   (D248, G1; under the heavy-run lock, --test-concurrency=1)
//
// Real git, in temp dirs only: a bare "origin", a clone, commits, a real push to the bare repo to set the upstream. The hook is run as it is installed (a child
// process reading the payload on stdin). Fake secrets are built at runtime by concatenation (this repo is public), and every test checks the secret never
// reaches the deny reason or the ledger.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HOOK = path.join(__dirname, 'push-gate.js');
const G = require('./push-gate.js');
const FAKE_VCK = ['vck', 'a1B2c3D4e5F6g7H8i9J0k1L2'].join('_');
const FAKE_SKANT = ['sk', 'ant', 'api03', 'Zx9Yw8Vu7Ts6Rq5Po4Nm3Lk2'].join('-');

const tmp = (p) => fs.mkdtempSync(path.join(os.tmpdir(), p));
const git = (cwd, ...args) => { const r = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'init.defaultBranch=main', '-c', 'core.autocrlf=false', ...args], { cwd, encoding: 'utf8' }); assert.equal(r.status, 0, `git ${args.join(' ')}: ${r.stderr}`); return r.stdout; };
/** A bare origin, a clone with one pushed commit (so @{upstream} exists and origin/HEAD is set). */
function repo() {
  const root = tmp('pg-'), origin = path.join(root, 'origin.git'), work = path.join(root, 'work');
  git(root, 'init', '--bare', '-q', origin);
  git(root, 'clone', '-q', origin, work);
  fs.writeFileSync(path.join(work, 'README.md'), 'hello\n'); git(work, 'add', 'README.md'); git(work, 'commit', '-q', '-m', 'first'); git(work, 'push', '-q', '-u', 'origin', 'HEAD:main');
  git(work, 'remote', 'set-head', 'origin', 'main');
  return { root, work };
}
function runHook(payload, dataDir) {
  const r = spawnSync(process.execPath, [HOOK], { input: typeof payload === 'string' ? payload : JSON.stringify(payload), encoding: 'utf8', env: { ...process.env, CONSONANCE_DATA: dataDir, CONSONANCE_DREAM: '' } });
  const out = r.stdout.trim(); let j = null; try { j = out ? JSON.parse(out) : null; } catch (_) { /* not JSON */ }
  const ledgerPath = path.join(dataDir, G.LEDGER), ledger = fs.existsSync(ledgerPath) ? fs.readFileSync(ledgerPath, 'utf8') : '';
  return { code: r.status, out, deny: j && j.hookSpecificOutput && j.hookSpecificOutput.permissionDecision === 'deny', reason: j && j.hookSpecificOutput && j.hookSpecificOutput.permissionDecisionReason, ledger };
}
const push = (cwd, command = 'git push') => ({ tool_name: 'Bash', tool_input: { command }, cwd, session_id: 'test' });

test('RED: a push whose diff ADDS a line with a key is refused, naming the file and line and the kind, never the secret', () => {
  const { work } = repo(), data = tmp('pgd-');
  fs.writeFileSync(path.join(work, 'config.txt'), `a = 1\nkey = ${FAKE_VCK}\n`); git(work, 'add', 'config.txt'); git(work, 'commit', '-q', '-m', 'oops');
  const r = runHook(push(work), data);
  assert.equal(r.code, 0); assert.equal(r.deny, true, r.out);
  assert.match(r.reason, /config\.txt:2/); assert.match(r.reason, /gateway key \(vck_\)/);
  assert.ok(!r.reason.includes(FAKE_VCK), 'the deny reason never carries the secret');
  assert.ok(r.ledger.includes('"decision":"deny"') && !r.ledger.includes(FAKE_VCK), 'the ledger records the deny and never the secret');
});
test('RED: every packet shape is caught (sk-ant-, ghp_, AKIA, a private-key header), each by its kind', () => {
  const { work } = repo(), data = tmp('pgd-');
  const ghp = ['ghp', 'A'.repeat(36)].join('_'), akia = ['AKIA', 'ABCDEFGHIJKLMNOP'].join(''), pk = ['-----BEGIN', 'RSA PRIVATE KEY-----'].join(' ');
  fs.writeFileSync(path.join(work, 'many.txt'), [FAKE_SKANT, ghp, akia, pk].join('\n') + '\n'); git(work, 'add', 'many.txt'); git(work, 'commit', '-q', '-m', 'many');
  const r = runHook(push(work), data);
  assert.equal(r.deny, true);
  for (const [n, kind] of [[1, 'sk-ant-'], [2, 'ghp_'], [3, 'AKIA'], [4, 'private key header']]) assert.ok(r.reason.includes(`many.txt:${n}`) && r.reason.includes(kind), `line ${n}: ${kind}\n${r.reason}`);
  for (const s of [FAKE_SKANT, ghp, akia]) assert.ok(!r.reason.includes(s) && !r.ledger.includes(s));
});
test('pass: a clean push is allowed, silently (no output), and logged as allow', () => {
  const { work } = repo(), data = tmp('pgd-');
  fs.writeFileSync(path.join(work, 'ok.txt'), 'the word vck_ in prose is not a key\n'); git(work, 'add', 'ok.txt'); git(work, 'commit', '-q', '-m', 'clean');
  const r = runHook(push(work), data);
  assert.equal(r.code, 0); assert.equal(r.out, ''); assert.match(r.ledger, /"decision":"allow"/);
});
test('pass: a key the push REMOVES is leaving, not arriving: allowed', () => {
  const { work } = repo(), data = tmp('pgd-');
  fs.writeFileSync(path.join(work, 'k.txt'), `${FAKE_VCK}\n`); git(work, 'add', 'k.txt'); git(work, 'commit', '-q', '-m', 'add'); git(work, 'push', '-q');
  fs.writeFileSync(path.join(work, 'k.txt'), 'gone\n'); git(work, 'add', 'k.txt'); git(work, 'commit', '-q', '-m', 'remove');
  assert.equal(runHook(push(work), data).out, '');
});
test('RED, no upstream: a new branch is scanned from its merge base with origin\'s default branch', () => {
  const { work } = repo(), data = tmp('pgd-');
  git(work, 'checkout', '-q', '-b', 'topic'); fs.writeFileSync(path.join(work, 't.txt'), `${FAKE_VCK}\n`); git(work, 'add', 't.txt'); git(work, 'commit', '-q', '-m', 'topic');
  const r = runHook(push(work, 'git push -u origin topic'), data);
  assert.equal(r.deny, true, r.out); assert.match(r.reason, /t\.txt:1/); assert.match(r.reason, /every commit origin does not have/);   // fix lap: scanned as every commit the remote lacks (was: the merge base)
});
test('RED: `git -C <repo> push` from another directory scans that repo; a push after && in a chain is seen', () => {
  const { root, work } = repo(), data = tmp('pgd-');
  fs.writeFileSync(path.join(work, 'c.txt'), `${FAKE_VCK}\n`); git(work, 'add', 'c.txt'); git(work, 'commit', '-q', '-m', 'c');
  assert.equal(runHook(push(root, `git -C "${work}" push`), data).deny, true);
  assert.equal(runHook(push(work, 'git status && git push origin HEAD'), data).deny, true);
});
// Found LIVE on 2026-10-06, the first push after install: `git -C /tmp/x push` from the Bash tool was read as C:\tmp\x ("not a git repo") and the gate failed
// open. A native hook must convert Git Bash's MSYS paths itself.
const msysDrive = (p) => p.replace(/^([A-Za-z]):/, (_, d) => `/${d.toLowerCase()}`).replace(/\\/g, '/');
test('RED: the Bash tool\'s MSYS paths are read as Git Bash means them: /c/Users/... and /tmp/...', { skip: process.platform !== 'win32' && 'MSYS paths are a Windows matter' }, () => {
  const { root, work } = repo(), data = tmp('pgd-');
  fs.writeFileSync(path.join(work, 'm.txt'), `${FAKE_VCK}\n`); git(work, 'add', 'm.txt'); git(work, 'commit', '-q', '-m', 'm');
  assert.equal(runHook(push(os.homedir(), `git -C ${msysDrive(work)} push`), data).deny, true, 'the /c/... form');
  const viaTmp = '/tmp/' + path.relative(fs.realpathSync(os.tmpdir()), fs.realpathSync(work)).replace(/\\/g, '/');
  assert.equal(G.nativePath(viaTmp).toLowerCase().replace(/\\/g, '/'), fs.realpathSync(work).toLowerCase().replace(/\\/g, '/'), `cygpath maps ${viaTmp}`);
  assert.equal(runHook(push(root, `git -C ${viaTmp} push`), data).deny, true, 'the /tmp/... form');
  assert.equal(G.nativePath('C:/already/native'), 'C:/already/native');
});
// ── the fix lap, from A's look (exo_memory/handback/p-gates-A_2026-10-06.md) ──
test('RED (A H3): a key ADDED in one unpushed commit and REMOVED in the next is in the pushed history: refused, naming the commit', () => {
  const { work } = repo(), data = tmp('pgd-');
  fs.writeFileSync(path.join(work, 'h.txt'), `k = ${FAKE_VCK}\n`); git(work, 'add', 'h.txt'); git(work, 'commit', '-q', '-m', 'add');
  const added = git(work, 'rev-parse', '--short', 'HEAD').trim();
  fs.writeFileSync(path.join(work, 'h.txt'), 'k = gone\n'); git(work, 'add', 'h.txt'); git(work, 'commit', '-q', '-m', 'remove');
  const r = runHook(push(work), data);
  assert.equal(r.deny, true, 'the net diff is clean but the history is not'); assert.match(r.reason, /h\.txt:1/); assert.ok(r.reason.includes(added), `names the commit ${added}`);
  assert.ok(!r.reason.includes(FAKE_VCK) && !r.ledger.includes(FAKE_VCK));
});
test('RED (A H1): the FIRST push to an EMPTY remote scans the whole history', () => {
  const root = tmp('pg1-'), work = path.join(root, 'w'), data = tmp('pgd-');
  git(root, 'init', '--bare', '-q', path.join(root, 'empty.git')); fs.mkdirSync(work); git(work, 'init', '-q'); git(work, 'remote', 'add', 'origin', path.join(root, 'empty.git'));
  fs.writeFileSync(path.join(work, '.env'), `KEY=${FAKE_VCK}\n`); git(work, 'add', '.env'); git(work, 'commit', '-q', '-m', 'first');
  const r = runHook(push(work, 'git push -u origin main'), data);
  assert.equal(r.deny, true, r.out); assert.match(r.reason, /\.env:1/);
});
test('RED (A H2): a remote NOT called origin, no upstream: what it lacks is scanned', () => {
  const { root, work } = repo(), data = tmp('pgd-');
  git(root, 'init', '--bare', '-q', path.join(root, 'other.git')); git(work, 'remote', 'add', 'backup', path.join(root, 'other.git'));
  git(work, 'checkout', '-q', '-b', 'side'); fs.writeFileSync(path.join(work, 's.txt'), `${FAKE_VCK}\n`); git(work, 'add', 's.txt'); git(work, 'commit', '-q', '-m', 's');
  git(work, 'update-ref', '-d', 'refs/remotes/origin/HEAD'); git(work, 'update-ref', '-d', 'refs/remotes/origin/main');   // nothing on origin either: the old gate found no base
  const r = runHook(push(work, 'git push backup side'), data);
  assert.equal(r.deny, true, r.out); assert.match(r.reason, /s\.txt:1/);
});
test('RED (A §4): `cd <repo> && git push` from a session in ANOTHER directory scans the cd\'s repo', () => {
  const { work } = repo(), data = tmp('pgd-'), elsewhere = tmp('pge-');
  fs.writeFileSync(path.join(work, 'cd.txt'), `${FAKE_VCK}\n`); git(work, 'add', 'cd.txt'); git(work, 'commit', '-q', '-m', 'cd');
  assert.equal(runHook(push(elsewhere, `cd "${work}" && git push`), data).deny, true, 'bash cd');
  assert.equal(runHook({ ...push(elsewhere, `Set-Location "${work}"; git push`), tool_name: 'PowerShell' }, data).deny, true, 'PowerShell Set-Location');
  assert.equal(runHook(push(path.dirname(work), `cd ${path.basename(work)} && git push`), data).deny, true, 'a relative cd');
});
test('pass: a heredoc that only MENTIONS git push is not a push', () => {
  const { work } = repo(), data = tmp('pgd-');
  fs.writeFileSync(path.join(work, 'x.txt'), `${FAKE_VCK}\n`); git(work, 'add', 'x.txt'); git(work, 'commit', '-q', '-m', 'x');
  assert.equal(runHook(push(work, "cat > notes.md <<'EOF'\nthen git push\nEOF"), data).out, '', 'the heredoc body is text, not a command');
});
test('fails OPEN: not a git repo, no base to diff, a malformed payload, another tool: allowed with no output', () => {
  const data = tmp('pgd-'), plain = tmp('pgp-');
  assert.equal(runHook(push(plain), data).out, '', 'not a repo');
  assert.equal(runHook('{not json', data).out, '');
  assert.equal(runHook({ tool_name: 'Read', tool_input: { file_path: 'git push' } }, data).out, '');
  assert.ok(!fs.readFileSync(path.join(data, G.LEDGER), 'utf8').includes(FAKE_VCK));
});
test('a command that is not a push is ignored: no scan, no row', () => {
  const { work } = repo(), data = tmp('pgd-');
  assert.equal(runHook(push(work, 'git status'), data).out, '');
  assert.ok(!fs.existsSync(path.join(data, G.LEDGER)), 'no row for a command that is not a push');
  assert.deepEqual(G.pushTargets('git -C "C:/a b" push origin main', 'C:/x'), [{ dir: path.resolve('C:/a b'), remote: 'origin', src: 'main', deleting: false }]);
  assert.deepEqual(G.pushTargets('echo done; git -c core.x=1 push', 'C:/x'), [{ dir: path.resolve('C:/x'), remote: null, src: null, deleting: false }]);
  assert.deepEqual(G.pushTargets('git push backup +topic:main', 'C:/x').map((t) => [t.remote, t.src]), [['backup', 'topic']]);
  assert.equal(G.pushTargets('git push origin :old', 'C:/x')[0].deleting, true, 'a delete of a remote ref sends nothing of ours');
});

// D273 devreds: portable-paths.js flagged the two literal `C:/Program Files...` cygpath fallbacks (REVIEW). They are now read from the variables Windows sets.
test('cygpath is looked for on PATH, then under this machine\'s own Program Files folders, never a drive letter written into the hook', () => {
  assert.deepEqual(G.cygpathCandidates({ ProgramFiles: 'D:\\Prog', 'ProgramFiles(x86)': 'D:\\Prog86' }),
    ['cygpath', 'D:\\Prog\\Git\\usr\\bin\\cygpath.exe', 'D:\\Prog86\\Git\\usr\\bin\\cygpath.exe'], 'a Program Files on another drive is found');
  assert.deepEqual(G.cygpathCandidates({ ProgramFiles: 'E:\\P', ProgramW6432: 'E:\\P' }), ['cygpath', 'E:\\P\\Git\\usr\\bin\\cygpath.exe'], 'the same folder named twice is looked in once');
  assert.deepEqual(G.cygpathCandidates({}), ['cygpath'], 'no variable set: PATH only, no invented drive');
  const here = G.cygpathCandidates();
  assert.strictEqual(here[0], 'cygpath', 'PATH first');
  if (process.platform === 'win32' && process.env.ProgramFiles) assert.ok(here.includes(path.win32.join(process.env.ProgramFiles, 'Git', 'usr', 'bin', 'cygpath.exe')), 'and this machine\'s own Program Files after it');
});
