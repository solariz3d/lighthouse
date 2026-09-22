// launch.park.test.js — node --test consonance/launch.park.test.js
//
// L073: PARK uncommitted work at launch instead of refusing the pull. launch.ps1 cannot be run whole in a test (it takes
// the launcher mutex, rebuilds and starts the app), so this parses it with PowerShell's OWN parser and lifts ONLY the
// function definitions it needs — the real Update-FromOrigin and its park helpers — then stubs Notify (to a log file)
// and Resolve-ConsonanceHolder (nothing running), and drives the real function against a scripted origin + clone.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const LAUNCH = path.join(__dirname, 'launch.ps1');
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const HARNESS = `
param($launch, $repo, $notifyLog)
$ErrorActionPreference = 'Stop'
$ast = [System.Management.Automation.Language.Parser]::ParseFile($launch, [ref]$null, [ref]$null)
$want = @('Update-FromOrigin', 'Get-ParkMachine', 'Save-ParkRecord', 'Get-GitLines')
$defs = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.FunctionDefinitionAst] -and $want -contains $n.Name }, $true)
foreach ($d in $defs) { . ([scriptblock]::Create($d.Extent.Text)) }
function Notify($message, $title, $seconds, $colour) { Add-Content -LiteralPath $notifyLog -Value ("NOTIFY [" + $title + "] " + $message) -Encoding UTF8 }
function Resolve-ConsonanceHolder { @{ State = 'none'; Pids = @() } }
Update-FromOrigin $repo
`;

function world() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'launch-park-'));
  const origin = path.join(root, 'origin.git'), l = path.join(root, 'L'), d = path.join(root, 'D');
  execFileSync('git', ['init', '--bare', '-q', '-b', 'main', origin]);
  execFileSync('git', ['-c', 'core.autocrlf=false', 'clone', '-q', origin, d], { stdio: 'ignore' });
  for (const [k, v] of [['user.email', 't@t'], ['user.name', 't'], ['core.autocrlf', 'false']]) git(d, 'config', k, v);
  fs.writeFileSync(path.join(d, 'shared.txt'), 'base\n');
  fs.writeFileSync(path.join(d, 'mine.txt'), 'base\n');
  git(d, 'add', '-A'); git(d, 'commit', '-q', '-m', 'base'); git(d, 'push', '-q', 'origin', 'main');
  execFileSync('git', ['-c', 'core.autocrlf=false', 'clone', '-q', origin, l], { stdio: 'ignore' });
  for (const [k, v] of [['user.email', 't@t'], ['user.name', 't'], ['core.autocrlf', 'false']]) git(l, 'config', k, v);
  const harness = path.join(root, 'harness.ps1');
  fs.writeFileSync(harness, HARNESS);
  const notifyLog = path.join(root, 'notify.log');
  /** D commits and pushes: origin moves ahead of L. */
  const upstream = (file, body) => { fs.writeFileSync(path.join(d, file), body); git(d, 'add', '--', file); git(d, 'commit', '-q', '-m', `upstream ${file}`); git(d, 'push', '-q', 'origin', 'main'); };
  const launch = () => {
    const r = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', harness, LAUNCH, l, notifyLog],
      { encoding: 'utf8', env: { ...process.env, CONSONANCE_MACHINE: 'TESTL' }, timeout: 120000 });
    return { code: r.status, out: (r.stdout || '') + (r.stderr || ''), notify: fs.existsSync(notifyLog) ? fs.readFileSync(notifyLog, 'utf8') : '' };
  };
  const read = (f) => fs.readFileSync(path.join(l, f), 'utf8');
  const head = () => git(l, 'rev-parse', 'HEAD');
  const originHead = () => git(l, 'rev-parse', 'origin/main');
  const stashes = () => git(l, 'stash', 'list').split('\n').filter(Boolean);
  const records = () => { const p = path.join(l, '.git', 'consonance-parked.jsonl'); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map(JSON.parse) : []; };
  return { root, l, d, upstream, launch, read, head, originHead, stashes, records };
}

test('CLEAN tree, origin ahead: fast-forwarded, nothing parked, no record (unchanged behaviour)', () => {
  const w = world();
  w.upstream('other.txt', 'new\n');
  w.launch();
  assert.strictEqual(w.head(), w.originHead());
  assert.deepStrictEqual(w.stashes(), []);
  assert.deepStrictEqual(w.records(), []);
});

test('DIRTY, no overlap: pulled AND the local change is back, the stash is gone, one record says reapplied', () => {
  const w = world();
  fs.writeFileSync(path.join(w.l, 'mine.txt'), 'my in-flight edit\n');
  w.upstream('shared.txt', 'upstream change\n');
  const r = w.launch();
  assert.strictEqual(w.head(), w.originHead(), 'pulled: ' + r.out + r.notify);
  assert.strictEqual(w.read('mine.txt'), 'my in-flight edit\n', 'the local change came back');
  assert.strictEqual(w.read('shared.txt'), 'upstream change\n');
  assert.deepStrictEqual(w.stashes(), [], 'a reapplied park leaves no stash behind');
  const rec = w.records();
  assert.strictEqual(rec.length, 1);
  assert.strictEqual(rec[0].outcome, 'reapplied');
  assert.deepStrictEqual(rec[0].paths, ['mine.txt']);
});

test('DIRTY, a STAGED change comes back STAGED (--index)', () => {
  const w = world();
  fs.writeFileSync(path.join(w.l, 'mine.txt'), 'staged edit\n');
  git(w.l, 'add', 'mine.txt');
  w.upstream('shared.txt', 'upstream change\n');
  w.launch();
  assert.strictEqual(w.head(), w.originHead());
  assert.match(git(w.l, 'status', '--porcelain'), /^M  mine\.txt/m, 'still staged');
});

test('DIRTY, OVERLAP: pulled, the stash is KEPT and named, the file is the pulled one, no conflict markers', () => {
  const w = world();
  fs.writeFileSync(path.join(w.l, 'shared.txt'), 'my edit to the shared file\n');
  w.upstream('shared.txt', 'upstream edit to the shared file\n');
  const r = w.launch();
  assert.strictEqual(w.head(), w.originHead(), 'pulled: ' + r.out + r.notify);
  assert.strictEqual(w.read('shared.txt'), 'upstream edit to the shared file\n', 'the tree is the pulled commit');
  assert.doesNotMatch(w.read('shared.txt'), /^(<<<<<<<|=======|>>>>>>>)/m);
  const st = w.stashes();
  assert.strictEqual(st.length, 1, 'the work is kept, parked');
  assert.match(st[0], /park TESTL \S+ behind=1/, st[0]);
  const rec = w.records();
  assert.strictEqual(rec[0].outcome, 'parked');
  assert.deepStrictEqual(rec[0].overlap, ['shared.txt']);
  assert.match(r.notify, new RegExp(rec[0].stash.slice(0, 12)), 'the Notify names the stash');
  assert.match(r.notify, /shared\.txt/, 'and the overlapping path');
  assert.strictEqual(git(w.l, 'show', `${rec[0].stash}:shared.txt`), 'my edit to the shared file', 'and the parked work is intact in it');
});

test('the STASH FAILS: nothing pulled, the ORIGINAL refusal text, the local change untouched', () => {
  const w = world();
  fs.writeFileSync(path.join(w.l, 'mine.txt'), 'my in-flight edit\n');
  w.upstream('shared.txt', 'upstream change\n');
  fs.writeFileSync(path.join(w.l, '.git', 'index.lock'), '');   // another git process holds the index: stash cannot write
  const before = w.head();
  const r = w.launch();
  fs.unlinkSync(path.join(w.l, '.git', 'index.lock'));
  assert.strictEqual(w.head(), before, 'nothing was pulled');
  assert.match(r.notify, /NOT pulling - local work is never merged over/, r.notify);
  assert.strictEqual(w.read('mine.txt'), 'my in-flight edit\n');
  assert.deepStrictEqual(w.stashes(), []);
});

test('an UNTRACKED file the pull would ADD at the same path: refused with the original text BEFORE anything is stashed', () => {
  const w = world();
  fs.writeFileSync(path.join(w.l, 'mine.txt'), 'my in-flight edit\n');       // dirty, so the park path is taken
  fs.writeFileSync(path.join(w.l, 'new.txt'), 'my untracked file\n');
  w.upstream('new.txt', 'upstream adds this path\n');
  const before = w.head();
  const r = w.launch();
  assert.strictEqual(w.head(), before, 'no half-pull');
  assert.match(r.notify, /NOT pulling - local work is never merged over/, r.notify);
  assert.match(r.notify, /new\.txt/, 'and it names the colliding path');
  assert.deepStrictEqual(w.stashes(), [], 'nothing was stashed');
  assert.strictEqual(w.read('mine.txt'), 'my in-flight edit\n');
  assert.strictEqual(w.read('new.txt'), 'my untracked file\n');
});

test('the fast-forward itself FAILS after parking (L has a local commit): the change is put back, nothing pulled', () => {
  const w = world();
  fs.writeFileSync(path.join(w.l, 'extra.txt'), 'local commit\n');
  git(w.l, 'add', 'extra.txt'); git(w.l, 'commit', '-q', '-m', 'local only');
  fs.writeFileSync(path.join(w.l, 'mine.txt'), 'my in-flight edit\n');
  w.upstream('shared.txt', 'upstream change\n');
  const before = w.head();
  const r = w.launch();
  assert.strictEqual(w.head(), before, 'diverged: nothing merged');
  assert.strictEqual(w.read('mine.txt'), 'my in-flight edit\n', 'the parked change was put back');
  assert.deepStrictEqual(w.stashes(), []);
  assert.match(r.notify, /refused to fast-forward/, r.notify);
});

test('the record carries what the chair and librarian need: machine, stamp, behind, stash, every parked path', () => {
  const w = world();
  fs.writeFileSync(path.join(w.l, 'shared.txt'), 'x\n');
  fs.writeFileSync(path.join(w.l, 'mine.txt'), 'y\n');
  w.upstream('shared.txt', 'z\n');
  w.launch();
  const [rec] = w.records();
  for (const k of ['at', 'machine', 'behind', 'stash', 'message', 'paths', 'overlap', 'outcome']) assert.ok(k in rec, `record lacks ${k}: ${JSON.stringify(rec)}`);
  assert.strictEqual(rec.machine, 'TESTL');
  assert.deepStrictEqual(rec.paths.sort(), ['mine.txt', 'shared.txt']);
});
