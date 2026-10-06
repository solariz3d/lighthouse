// delete-gate.test.js - node --test consonance/hooks/delete-gate.test.js   (D248, G2; under the heavy-run lock, --test-concurrency=1)
//
// Real junctions, in temp dirs only (fs.symlinkSync with type 'junction': no admin rights needed on Windows). The hook is run as it is installed. It never
// deletes anything; every test also checks the junction's TARGET is untouched.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HOOK = path.join(__dirname, 'delete-gate.js');
const G = require('./delete-gate.js');
const tmp = (p) => fs.mkdtempSync(path.join(os.tmpdir(), p));
/** A tree to delete with a junction inside it, pointing at a precious directory outside it. */
function tree({ link = true } = {}) {
  const root = tmp('dg-'), wt = path.join(root, 'worktree'), precious = path.join(root, 'precious');
  fs.mkdirSync(path.join(wt, 'src'), { recursive: true }); fs.writeFileSync(path.join(wt, 'src', 'a.js'), 'x');
  fs.mkdirSync(precious); fs.writeFileSync(path.join(precious, 'keep.txt'), 'irreplaceable');
  if (link) fs.symlinkSync(precious, path.join(wt, 'reads'), 'junction');
  return { root, wt, precious, link: path.join(wt, 'reads') };
}
function runHook(payload, dataDir) {
  const r = spawnSync(process.execPath, [HOOK], { input: typeof payload === 'string' ? payload : JSON.stringify(payload), encoding: 'utf8', env: { ...process.env, CONSONANCE_DATA: dataDir, CONSONANCE_DREAM: '' } });
  const out = r.stdout.trim(); let j = null; try { j = out ? JSON.parse(out) : null; } catch (_) { /* not JSON */ }
  return { code: r.status, out, deny: !!(j && j.hookSpecificOutput && j.hookSpecificOutput.permissionDecision === 'deny'), reason: j && j.hookSpecificOutput && j.hookSpecificOutput.permissionDecisionReason };
}
const cmd = (command, cwd, tool = 'Bash') => ({ tool_name: tool, tool_input: { command }, cwd, session_id: 'test' });

test('RED: every packet form of a recursive delete of a tree holding a junction is refused, naming the junction and where it points', () => {
  const t = tree(), data = tmp('dgd-');
  for (const [c, tool] of [[`git worktree remove --force "${t.wt}"`, 'Bash'], [`rm -rf "${t.wt}"`, 'Bash'], [`rm -r ${t.wt.replace(/\\/g, '/')}`, 'Bash'],
    [`Remove-Item -Recurse -Force "${t.wt}"`, 'PowerShell'], [`Remove-Item -LiteralPath "${t.wt}" -Recurse`, 'PowerShell'], [`rm -Recurse "${t.wt}"`, 'PowerShell'], [`ri -rec "${t.wt}"`, 'PowerShell']]) {
    const r = runHook(cmd(c, t.root, tool), data);
    assert.equal(r.deny, true, `${c}\n${r.out}`); assert.ok(r.reason.includes(t.link), `names the junction: ${r.reason}`); assert.ok(r.reason.includes('precious'), 'and where it points');
  }
  assert.equal(fs.readFileSync(path.join(t.precious, 'keep.txt'), 'utf8'), 'irreplaceable', 'the hook deletes nothing');
});
test('RED: a relative target is read from the cwd, and from `git -C <dir>`; a wildcard is checked at its parent', () => {
  const t = tree(), data = tmp('dgd-');
  assert.equal(runHook(cmd('rm -rf worktree', t.root), data).deny, true);
  assert.equal(runHook(cmd(`git -C "${t.root}" worktree remove worktree`, os.tmpdir()), data).deny, true);
  assert.equal(runHook(cmd(`rm -rf "${t.wt}"/*`, t.root), data).deny, true);
});
test('RED: the Bash tool\'s MSYS paths are read as Git Bash means them: /c/Users/... and /tmp/... (the push gate\'s live failure, 2026-10-06)', { skip: process.platform !== 'win32' && 'MSYS paths are a Windows matter' }, () => {
  const t = tree(), data = tmp('dgd-');
  const msys = t.wt.replace(/^([A-Za-z]):/, (_, d) => `/${d.toLowerCase()}`).replace(/\\/g, '/');
  assert.equal(runHook(cmd(`rm -rf ${msys}`, os.homedir()), data).deny, true, 'the /c/... form');
  const viaTmp = '/tmp/' + path.relative(fs.realpathSync(os.tmpdir()), fs.realpathSync(t.wt)).replace(/\\/g, '/');
  assert.equal(runHook(cmd(`git worktree remove ${viaTmp}`, os.homedir()), data).deny, true, 'the /tmp/... form');
});
test('RED: an environment variable in the target is expanded ($env:NAME, ${NAME}, $NAME) (found live: "$env:TEMP\\x" was read as a literal path)', () => {
  const t = tree(), data = tmp('dgd-');
  const r = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(cmd(`Remove-Item -Recurse -Force "$env:E_GATE_ROOT\\${path.basename(t.wt)}"`, os.homedir(), 'PowerShell')), encoding: 'utf8', env: { ...process.env, CONSONANCE_DATA: data, E_GATE_ROOT: t.root } });
  assert.match(r.stdout, /"permissionDecision":"deny"/, r.stdout);
  process.env.E_GATE_ROOT = t.root;
  try { for (const form of ['$env:E_GATE_ROOT', '${E_GATE_ROOT}', '$E_GATE_ROOT']) assert.equal(G.expandEnv(`${form}/worktree`), `${t.root}/worktree`, form); }
  finally { delete process.env.E_GATE_ROOT; }
  assert.equal(G.expandEnv('$NO_SUCH_VAR_E_GATE/x'), '$NO_SUCH_VAR_E_GATE/x', 'an unknown variable stays as written');
});
test('RED: the target itself being a junction is refused (a recursive delete of the link can empty what it points to)', () => {
  const t = tree(), data = tmp('dgd-');
  assert.equal(runHook(cmd(`Remove-Item -Recurse "${t.link}"`, t.root, 'PowerShell'), data).deny, true);
});
test('pass: the same deletes of a tree with no junction are allowed, silently', () => {
  const t = tree({ link: false }), data = tmp('dgd-');
  for (const c of [`rm -rf "${t.wt}"`, `git worktree remove "${t.wt}"`, `Remove-Item -Recurse -Force "${t.wt}"`]) assert.equal(runHook(cmd(c, t.root), data).out, '', c);
  assert.match(fs.readFileSync(path.join(data, G.LEDGER), 'utf8'), /"decision":"allow"/);
});
test('pass: removing the LINK itself without recursing is what the reason asks for, and is allowed', () => {
  const t = tree(), data = tmp('dgd-');
  for (const [c, tool] of [[`Remove-Item "${t.link}"`, 'PowerShell'], [`cmd /c rmdir "${t.link}"`, 'Bash'], [`rm "${t.link}"`, 'Bash']]) assert.equal(runHook(cmd(c, t.root, tool), data).out, '', c);
});
test('fails OPEN: a missing target, a malformed payload, another tool, a non-delete command: allowed with no output', () => {
  const data = tmp('dgd-');
  assert.equal(runHook(cmd('rm -rf /no/such/dir/anywhere', os.tmpdir()), data).out, '');
  assert.equal(runHook('{nope', data).out, '');
  assert.equal(runHook({ tool_name: 'Read', tool_input: { file_path: 'rm -rf x' } }, data).out, '');
  assert.equal(runHook(cmd('git status', os.tmpdir()), data).out, '');
});
test('the parser: recursive deletes are found, non-recursive ones are not', () => {
  const kinds = (c) => G.deleteTargets(c).map((x) => `${x.how}:${x.target}`);
  assert.deepEqual(kinds('rm -rf a b'), ['rm -r:a', 'rm -r:b']);
  assert.deepEqual(kinds('rm a.txt'), []);
  assert.deepEqual(kinds('Remove-Item x'), []);
  assert.deepEqual(kinds('Remove-Item -Path a,b -Recurse'), ['Remove-Item -Recurse:a', 'Remove-Item -Recurse:b']);
  assert.deepEqual(kinds('git worktree remove -f wt'), ['git worktree remove:wt']);
  assert.deepEqual(kinds('cd x && rm -fr y'), ['rm -r:y']);
  assert.deepEqual(G.words('rm -rf "C:/a b"/* \'q r\''), ['rm', '-rf', 'C:/a b/*', 'q r'], 'a quoted piece and the glob after it are ONE word');
});
