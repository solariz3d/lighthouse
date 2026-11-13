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
param($launch, $repo, $notifyLog, $receiptDir)
$ErrorActionPreference = 'Stop'
$ast = [System.Management.Automation.Language.Parser]::ParseFile($launch, [ref]$null, [ref]$null)
$want = @('Update-FromOrigin', 'Get-ParkMachine', 'Save-ParkRecord', 'Get-GitLines', 'Save-PullReceipt', 'Get-NewTmpPackBytes', 'Wait-FetchChild', 'Get-FetchStderrLines')
$defs = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.FunctionDefinitionAst] -and $want -contains $n.Name }, $true)
foreach ($d in $defs) { . ([scriptblock]::Create($d.Extent.Text)) }
function Notify($message, $title, $seconds, $colour) { Add-Content -LiteralPath $notifyLog -Value ("NOTIFY [" + $title + "] " + $message) -Encoding UTF8 }
function Resolve-ConsonanceHolder { @{ State = 'none'; Pids = @() } }
# W5: the receipt goes to the test's temp dir, never %LOCALAPPDATA% (the live receipt the shelf reads). Passed only when
# the function takes it, so the tests can be run against a launch.ps1 from before W5 and go red for the cause.
$opts = @{}
if ((Get-Command Update-FromOrigin).Parameters.ContainsKey('ReceiptDir')) { $opts.ReceiptDir = $receiptDir }
Update-FromOrigin $repo @opts
`;

function world() {
  const root = require('./tools/scratch.js').mkdtemp('launch-park-');
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
  const receiptDir = path.join(root, 'receipt');
  fs.mkdirSync(receiptDir);
  /** D commits and pushes: origin moves ahead of L. */
  const upstream = (file, body) => { fs.writeFileSync(path.join(d, file), body); git(d, 'add', '--', file); git(d, 'commit', '-q', '-m', `upstream ${file}`); git(d, 'push', '-q', 'origin', 'main'); };
  const launch = (env = {}) => {
    const t0 = Date.now();
    const r = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', harness, LAUNCH, l, notifyLog, receiptDir],
      { encoding: 'utf8', env: { ...process.env, CONSONANCE_MACHINE: 'TESTL', ...env }, timeout: 180000, windowsHide: true });
    return { code: r.status, ms: Date.now() - t0, out: (r.stdout || '') + (r.stderr || ''), notify: fs.existsSync(notifyLog) ? fs.readFileSync(notifyLog, 'utf8') : '' };
  };
  /** The pull's receipt (W5 F1), or null when none was written. */
  const receipt = () => { const p = path.join(receiptDir, 'launch-pull.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null; };
  const read = (f) => fs.readFileSync(path.join(l, f), 'utf8');
  const head = () => git(l, 'rev-parse', 'HEAD');
  const originHead = () => git(l, 'rev-parse', 'origin/main');
  const stashes = () => git(l, 'stash', 'list').split('\n').filter(Boolean);
  const records = () => { const p = path.join(l, '.git', 'consonance-parked.jsonl'); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).map(JSON.parse) : []; };
  return { root, l, d, upstream, launch, read, head, originHead, stashes, records, receipt };
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

// --- W5 (Lap W, pane B, 2026-11-13): the pull leaves a receipt, and a large catch-up is waited for while it arrives ----
// The recorded case: the 08:41 launch on D was cut at the 20 s ceiling with 2,138,111 B of a 90,516,246 B catch-up
// received (tmp_pack_Hl1ze7) and left no record of why (exo_memory/loop/wake_level2_2026-11-13/00_lap_w_spec.md, W5).

const RECEIPT_FIELDS = ['at', 'machine', 'launch_id', 'outcome', 'head_before', 'head_after', 'behind', 'fetch_ms',
  'bytes_received', 'last_progress', 'why'];

test('W5 F1: a clean pull writes a receipt with every field, outcome pulled, and this launch id', () => {
  const w = world();
  const before = w.head();
  w.upstream('other.txt', 'new\n');
  w.launch({ CONSONANCE_LAUNCH_ID: 'launch-test-1' });
  const rc = w.receipt();
  assert.ok(rc, 'no launch-pull.json was written');
  for (const k of RECEIPT_FIELDS) assert.ok(k in rc, `receipt lacks ${k}: ${JSON.stringify(rc)}`);
  assert.strictEqual(rc.outcome, 'pulled');
  assert.strictEqual(rc.launch_id, 'launch-test-1');
  assert.strictEqual(rc.machine, 'TESTL');
  assert.strictEqual(rc.behind, 1);
  assert.strictEqual(rc.head_before, before);
  assert.strictEqual(rc.head_after, w.originHead());
});

test('W5 F1: nothing new on origin writes outcome current, behind 0, the head unchanged', () => {
  const w = world();
  w.launch();
  const rc = w.receipt();
  assert.ok(rc, 'no launch-pull.json was written');
  assert.strictEqual(rc.outcome, 'current');
  assert.strictEqual(rc.behind, 0);
  assert.strictEqual(rc.head_after, rc.head_before);
});

test('W5 (i): an origin that does not exist writes outcome fetch-failed with git\'s reason', () => {
  const w = world();
  git(w.l, 'remote', 'set-url', 'origin', path.join(w.root, 'no-such-origin.git'));
  w.launch();
  const rc = w.receipt();
  assert.ok(rc, 'no launch-pull.json was written');
  assert.strictEqual(rc.outcome, 'fetch-failed', JSON.stringify(rc));
  assert.ok(rc.why && rc.why.trim().length > 0, 'why is empty: ' + JSON.stringify(rc));
});

// A pack that arrives slower than the ceiling. uploadpack.packObjectsHook is honoured only from protected config (system,
// global, command line). Command-line config does NOT reach a local upload-pack: git clears GIT_CONFIG_PARAMETERS and
// GIT_CONFIG_COUNT from its environment (local_repo_env), which an earlier draft of this test found the hard way (the
// hook never ran and the fetch took 5 s). So the hook goes in a GIT_CONFIG_GLOBAL file of the test's own, which the local
// upload-pack does inherit; \" in a config value is a literal quote, kept so a node path with a space survives. The hook
// passes pack-objects' output through at THROTTLE_BPS.
const THROTTLE_BPS = 1024 * 1024;
const THROTTLE_JS = `
const { spawn } = require('child_process');
const rate = ${THROTTLE_BPS}, tickMs = 50, perTick = Math.floor(rate * tickMs / 1000);
const child = spawn(process.argv[2], process.argv.slice(3), { stdio: ['pipe', 'pipe', 'inherit'], windowsHide: true });
process.stdin.pipe(child.stdin);
const queue = []; let ended = false;
child.stdout.on('data', (b) => queue.push(b));
child.stdout.on('end', () => { ended = true; });
child.on('exit', (c) => { process.exitCode = c || 0; });
const timer = setInterval(() => {
  let left = perTick;
  while (left > 0 && queue.length) {
    const b = queue[0];
    if (b.length <= left) { process.stdout.write(b); left -= b.length; queue.shift(); }
    else { process.stdout.write(b.subarray(0, left)); queue[0] = b.subarray(left); left = 0; }
  }
  if (ended && !queue.length) { clearInterval(timer); process.stdout.end(); }   // node exits once stdout has flushed
}, tickMs);
`;

test('W5 (ii): a catch-up still arriving at the 20 s ceiling is waited for and pulled, not cut', () => {
  const w = world();
  const blob = require('crypto').randomBytes(24 * 1024 * 1024);   // random: compression cannot shrink it
  fs.writeFileSync(path.join(w.d, 'big.bin'), blob);
  git(w.d, 'add', '--', 'big.bin'); git(w.d, 'commit', '-q', '-m', 'one large file'); git(w.d, 'push', '-q', 'origin', 'main');
  const hook = path.join(w.root, 'throttle.js');
  fs.writeFileSync(hook, THROTTLE_JS);
  const q = (p) => '\\"' + p.replace(/\\/g, '/') + '\\"';
  const globalCfg = path.join(w.root, 'global.gitconfig');
  fs.writeFileSync(globalCfg, '[uploadpack]\n\tpackObjectsHook = ' + q(process.execPath) + ' ' + q(hook) + '\n');
  const r = w.launch({ GIT_CONFIG_GLOBAL: globalCfg });
  const rc = w.receipt();
  // Against D's HEAD, the real origin: L's own origin/main does not move when the fetch is cut, so it would agree with
  // L's HEAD on exactly the failure this test is for.
  assert.strictEqual(w.head(), git(w.d, 'rev-parse', 'HEAD'), 'not pulled: ' + JSON.stringify(rc) + r.notify + r.out);
  assert.ok(rc, 'no launch-pull.json was written');
  assert.strictEqual(rc.outcome, 'pulled', JSON.stringify(rc));
  // The throttle really held the fetch past the old ceiling: without this the test could pass on a fast unthrottled fetch.
  assert.ok(rc.fetch_ms > 20000, 'the fetch took ' + rc.fetch_ms + ' ms: the throttle did not apply, so this proves nothing');
  assert.ok(rc.bytes_received > 0, 'no pack bytes were seen arriving: ' + JSON.stringify(rc));
});

test('W5 (iii): a server that accepts and never answers still ends at the 20 s ceiling, outcome fetch-timeout', async () => {
  const w = world();
  // D066's worst case: TCP accepted, TLS never answered. A child process, so it answers nothing while spawnSync blocks.
  const server = require('child_process').spawn(process.execPath, ['-e',
    "const s = require('net').createServer(() => {}); s.listen(0, '127.0.0.1', () => process.stdout.write(String(s.address().port) + '\\n'));"],
    { stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true });
  try {
    const port = await new Promise((resolve) => {
      const t = setTimeout(() => resolve(''), 10000);
      server.stdout.once('data', (b) => { clearTimeout(t); resolve(b.toString().trim()); });
    });
    assert.ok(/^\d+$/.test(port), 'the silent server did not start: ' + port);
    git(w.l, 'remote', 'set-url', 'origin', `https://127.0.0.1:${port}/never.git`);
    const before = w.head();
    const r = w.launch();
    const rc = w.receipt();
    assert.ok(rc, 'no launch-pull.json was written');
    assert.strictEqual(rc.outcome, 'fetch-timeout', JSON.stringify(rc));
    assert.ok(rc.fetch_ms >= 19000 && rc.fetch_ms < 30000, 'ended at ' + rc.fetch_ms + ' ms, not about 20 s');
    assert.ok(r.ms < 45000, 'the launch was held ' + r.ms + ' ms');
    assert.strictEqual(w.head(), before);
  } finally {
    server.kill();
  }
});

// (iv) The wait helper alone, at scaled-down bounds, driven by a child that writes a growing tmp_pack_* and then stops.
const WAIT_HARNESS = `
param($launch, $dir, $node, $childJs, $ceilingMs, $silenceMs, $capMs, $before)
$ErrorActionPreference = 'Stop'
$ast = [System.Management.Automation.Language.Parser]::ParseFile($launch, [ref]$null, [ref]$null)
$want = @('Wait-FetchChild', 'Get-NewTmpPackBytes')
$defs = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.FunctionDefinitionAst] -and $want -contains $n.Name }, $true)
foreach ($d in $defs) { . ([scriptblock]::Create($d.Extent.Text)) }
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $node
$psi.Arguments = '"' + $childJs + '" "' + $dir + '"'
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true
$p = [System.Diagnostics.Process]::Start($psi)
$b = [string[]]@($before -split ',' | Where-Object { $_ })
$w = Wait-FetchChild -Process $p -PackDir $dir -Before $b -CeilingMs ([int]$ceilingMs) -SilenceMs ([int]$silenceMs) -CapMs ([int]$capMs) -PollMs 200
$alive = $false
try { $alive = -not $p.HasExited } catch { }
ConvertTo-Json -Compress -InputObject @{ killed = $w.killed; ms = $w.ms; packSeen = $w.packSeen; bytes = $w.bytes; alive = $alive }
`;
const GROW_THEN_STOP_JS = `
const fs = require('fs'), path = require('path');
// ONE HANDLE, HELD OPEN, as index-pack holds its tmp_pack_*: on Windows the listing's size lags a file open for writing,
// and a child that closed the file after each write (the first draft) let a listing-based reader pass.
const fd = fs.openSync(path.join(process.argv[2], 'tmp_pack_test'), 'w');
const t0 = Date.now();
const grow = setInterval(() => {
  fs.writeSync(fd, Buffer.alloc(4096, 1));
  if (Date.now() - t0 > 2000) { clearInterval(grow); setTimeout(() => fs.closeSync(fd), 60000); }
}, 100);
`;
const SILENT_JS = `setTimeout(() => {}, 60000);`;

function runWait(childBody, opts) {
  const root = require('./tools/scratch.js').mkdtemp('launch-wait-');
  const dir = path.join(root, 'pack');
  fs.mkdirSync(dir);
  for (const name of opts.existing || []) fs.writeFileSync(path.join(dir, name), Buffer.alloc(1000));
  const harness = path.join(root, 'wait.ps1'), child = path.join(root, 'child.js');
  fs.writeFileSync(harness, WAIT_HARNESS);
  fs.writeFileSync(child, childBody);
  const r = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', harness, LAUNCH, dir, process.execPath, child,
    String(opts.ceilingMs), String(opts.silenceMs), String(opts.capMs), (opts.existing || []).join(',')],
  { encoding: 'utf8', timeout: 90000, windowsHide: true });
  const line = (r.stdout || '').trim().split(/\r?\n/).pop() || '';
  try { return JSON.parse(line); } catch { throw new Error('the wait harness printed no result: ' + r.stdout + r.stderr); }
}

test('W5 (iv): once a pack opens, the wait ends about the silence bound after growth stops, far under the cap', () => {
  const w = runWait(GROW_THEN_STOP_JS, { ceilingMs: 20000, silenceMs: 1000, capMs: 30000 });
  assert.strictEqual(w.packSeen, true, JSON.stringify(w));
  assert.strictEqual(w.killed, 'silence', JSON.stringify(w));
  // Growth runs about 2 s, then 1 s of silence, polled each 200 ms; node's start adds under a second or two.
  assert.ok(w.ms >= 2500 && w.ms < 8000, 'ended at ' + w.ms + ' ms: ' + JSON.stringify(w));
  assert.ok(w.bytes >= 4096, JSON.stringify(w));
  assert.strictEqual(w.alive, false, 'the child was left running');
});

test('W5 (iv): a tmp_pack_* left by an earlier fetch does not extend the wait (the ceiling still ends it)', () => {
  // D's disk holds tmp_pack_Hl1ze7 from 08:41 today; it must not read as this fetch's pack.
  const w = runWait(SILENT_JS, { ceilingMs: 1500, silenceMs: 10000, capMs: 30000, existing: ['tmp_pack_Hl1ze7'] });
  assert.strictEqual(w.packSeen, false, JSON.stringify(w));
  assert.strictEqual(w.killed, 'ceiling', JSON.stringify(w));
  assert.ok(w.ms < 6000, 'ended at ' + w.ms + ' ms: ' + JSON.stringify(w));
  assert.strictEqual(w.alive, false, 'the child was left running');
});
