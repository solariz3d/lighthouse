// launch.fuse.test.js — node --test consonance/launch.fuse.test.js
//
// L101: THE UPDATE FUSE. launch.ps1 cannot be run whole in a test (it takes the launcher mutex, rebuilds and starts
// the app), so — as launch.park.test.js does — this parses it with PowerShell's OWN parser and lifts ONLY the real
// fuse functions, stubs Notify (to a log) and Test-ConsonanceRunning (to a switch), and drives the real
// Invoke-ClaudeUpdateFuse against a FAKE claude.cmd. No real `claude update` ever runs.
//
// The contract under test, in the packet's words: "a seat must never fail to start because an update did." So every
// case asserts the harness prints LAUNCH-CONTINUES after the fuse returns — success, failure, timeout and skip alike.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const LAUNCH = path.join(__dirname, 'launch.ps1');

const HARNESS = `
param($launch, $claude, $timeout, $receiptDir, $notifyLog, $appRunning)
$ErrorActionPreference = 'Stop'
$ast = [System.Management.Automation.Language.Parser]::ParseFile($launch, [ref]$null, [ref]$null)
$want = @('Invoke-Bounded', 'Get-ClaudeVersion', 'Get-FuseReceiptDir', 'Invoke-ClaudeUpdateFuse')
$defs = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.FunctionDefinitionAst] -and $want -contains $n.Name }, $true)
if (@($defs).Count -ne $want.Count) { Write-Output ("LIFT-FAILED " + @($defs).Count); exit 9 }
foreach ($d in $defs) { . ([scriptblock]::Create($d.Extent.Text)) }
function Notify($message, $title, $seconds, $colour) { Add-Content -LiteralPath $notifyLog -Value ("NOTIFY [" + $title + "] " + $message) -Encoding UTF8 }
function Test-ConsonanceRunning { $appRunning -eq 'yes' }
function Get-ClaudeProcessCount { 0 }
$ErrorActionPreference = 'SilentlyContinue'
$r = Invoke-ClaudeUpdateFuse -Claude $claude -TimeoutSec ([int]$timeout) -ReceiptDir $receiptDir
Write-Output ("RESULT " + (ConvertTo-Json -InputObject $r -Compress -Depth 3))
Write-Output 'LAUNCH-CONTINUES'
`;

// A fake claude: `--version` prints 2.1.280, or 2.1.281 once a fake update has "installed"; `update` behaves per
// FAKE_MODE. Every call to `update` leaves update-called.flag, so a skip can be proved to have skipped.
const FAKE = [
  '@echo off',
  'setlocal',
  'set "S=%~dp0"',
  'if /i "%~1"=="--version" goto ver',
  'if /i "%~1"=="update" goto upd',
  'exit /b 2',
  ':ver',
  'if exist "%S%updated.flag" goto ver2',
  'echo 2.1.280 ^(Claude Code^)',
  'exit /b 0',
  ':ver2',
  'echo 2.1.281 ^(Claude Code^)',
  'exit /b 0',
  ':upd',
  'type nul > "%S%update-called.flag"',
  'if /i "%FAKE_MODE%"=="updated" goto m_updated',
  'if /i "%FAKE_MODE%"=="current" goto m_current',
  'if /i "%FAKE_MODE%"=="fail" goto m_fail',
  'if /i "%FAKE_MODE%"=="hang" goto m_hang',
  'exit /b 3',
  ':m_updated',
  'type nul > "%S%updated.flag"',
  'echo Successfully updated from 2.1.280 to version 2.1.281',
  'exit /b 0',
  ':m_current',
  'echo Claude Code is up to date ^(2.1.280^)',
  'exit /b 0',
  ':m_fail',
  'echo Error: network unreachable 1>&2',
  'exit /b 1',
  ':m_hang',
  'ping -n 6 127.0.0.1 > nul',
  'type nul > "%S%late.flag"',
  'exit /b 0',
  '',
].join('\r\n');

function world({ mode = 'current', appRunning = false, timeout = 30, noClaude = false, noReceiptDir = false, env = {} } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'launch-fuse-'));
  const bin = path.join(root, 'bin'); fs.mkdirSync(bin);
  const claude = path.join(bin, 'claude.cmd');
  if (!noClaude) fs.writeFileSync(claude, FAKE);
  const receiptDir = path.join(root, noReceiptDir ? 'does-not-exist' : 'data');
  if (!noReceiptDir) fs.mkdirSync(receiptDir);
  const harness = path.join(root, 'harness.ps1'); fs.writeFileSync(harness, HARNESS);
  const notifyLog = path.join(root, 'notify.log');
  const t0 = Date.now();
  const r = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', harness,
    LAUNCH, claude, String(timeout), receiptDir, notifyLog, appRunning ? 'yes' : 'no'],
  { encoding: 'utf8', env: { ...process.env, FAKE_MODE: mode, CONSONANCE_UPDATE_FUSE: '', ...env }, timeout: 120000 });
  const ms = Date.now() - t0;
  const out = (r.stdout || '') + (r.stderr || '');
  const line = out.split(/\r?\n/).find((l) => l.startsWith('RESULT '));
  const result = line ? JSON.parse(line.slice(7)) : null;
  const receiptPath = path.join(receiptDir, 'claude-update.json');
  const receipt = fs.existsSync(receiptPath) ? JSON.parse(fs.readFileSync(receiptPath, 'utf8')) : null;
  const notify = fs.existsSync(notifyLog) ? fs.readFileSync(notifyLog, 'utf8') : '';
  const flag = (f) => fs.existsSync(path.join(bin, f));
  return { out, result, receipt, notify, flag, ms, continued: /LAUNCH-CONTINUES/.test(out), bin };
}

test('an update is available: outcome "updated", both versions recorded, receipt written, launch continues, no dialog', () => {
  const w = world({ mode: 'updated' });
  assert.ok(w.continued, w.out);
  assert.strictEqual(w.result.outcome, 'updated', w.out);
  assert.strictEqual(w.result.version_before, '2.1.280');
  assert.strictEqual(w.result.version_after, '2.1.281');
  assert.strictEqual(w.receipt.outcome, 'updated');
  assert.strictEqual(w.receipt.version_after, '2.1.281', 'the receipt names the version every seat of this launch starts on');
  assert.strictEqual(w.notify, '');
});

test('already current: outcome "current", the version unchanged, no dialog', () => {
  const w = world({ mode: 'current' });
  assert.ok(w.continued, w.out);
  assert.strictEqual(w.result.outcome, 'current');
  assert.strictEqual(w.result.version_before, '2.1.280');
  assert.strictEqual(w.result.version_after, '2.1.280');
  assert.strictEqual(w.notify, '');
});

test('the update FAILS: outcome "failed" with its exit code, the keeper is told, and launch continues on the installed version', () => {
  const w = world({ mode: 'fail' });
  assert.ok(w.continued, 'a failed update must never stop the launch: ' + w.out);
  assert.strictEqual(w.result.outcome, 'failed');
  assert.strictEqual(w.result.exit_code, 1);
  assert.strictEqual(w.result.version_after, '2.1.280', 'the installed version is what launches');
  assert.match(w.notify, /not updated at launch \(failed\)/);
  assert.strictEqual(w.receipt.outcome, 'failed');
});

test('the update HANGS past its bound: outcome "timeout", the whole process tree is killed, launch continues', async () => {
  const w = world({ mode: 'hang', timeout: 1 });
  assert.ok(w.continued, w.out);
  assert.strictEqual(w.result.outcome, 'timeout', w.out);
  assert.ok(w.ms < 30000, `the fuse returned at its bound, not at the hang's end (${w.ms} ms)`);
  assert.match(w.notify, /not updated at launch \(timeout\)/);
  // The hang writes late.flag after ~5 s. If the tree was killed at 1 s, it never appears.
  await new Promise((res) => setTimeout(res, 8000));
  assert.strictEqual(w.flag('late.flag'), false, 'the hung update was killed, children included, not left running');
});

test('Consonance is ALREADY RUNNING: skipped, and `claude update` is never called under live seats', () => {
  const w = world({ mode: 'updated', appRunning: true });
  assert.ok(w.continued, w.out);
  assert.strictEqual(w.result.outcome, 'skipped');
  assert.match(w.result.why, /already running/);
  assert.strictEqual(w.flag('update-called.flag'), false);
});

test('CONSONANCE_UPDATE_FUSE=off: skipped, update never called', () => {
  const w = world({ mode: 'updated', env: { CONSONANCE_UPDATE_FUSE: 'off' } });
  assert.ok(w.continued, w.out);
  assert.strictEqual(w.result.outcome, 'skipped');
  assert.strictEqual(w.flag('update-called.flag'), false);
});

test('no claude.exe at the path: skipped, launch continues', () => {
  const w = world({ noClaude: true });
  assert.ok(w.continued, w.out);
  assert.strictEqual(w.result.outcome, 'skipped');
  assert.match(w.result.why, /no claude\.exe/);
});

test('the receipt directory is missing: no throw, the outcome still returned, launch continues', () => {
  const w = world({ mode: 'current', noReceiptDir: true });
  assert.ok(w.continued, w.out);
  assert.strictEqual(w.result.outcome, 'current');
  assert.strictEqual(w.receipt, null);
});

test('the receipt NEVER lands in the data dir (an unplaced data-dir file makes close.js --check refuse), even with CONSONANCE_DATA set', () => {
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'fuse-data-'));
  const local = fs.mkdtempSync(path.join(os.tmpdir(), 'fuse-local-'));
  const r = spawnSync('powershell.exe', ['-NoProfile', '-Command', `
    $ast = [System.Management.Automation.Language.Parser]::ParseFile('${LAUNCH.replace(/'/g, "''")}', [ref]$null, [ref]$null)
    $d = $ast.Find({ param($n) $n -is [System.Management.Automation.Language.FunctionDefinitionAst] -and $n.Name -eq 'Get-FuseReceiptDir' }, $true)
    . ([scriptblock]::Create($d.Extent.Text))
    Get-FuseReceiptDir`], { encoding: 'utf8', env: { ...process.env, CONSONANCE_DATA: data, LOCALAPPDATA: local } });
  const got = (r.stdout || '').trim().split(/\r?\n/).pop();
  assert.strictEqual(path.resolve(got), path.resolve(path.join(local, 'consonance')), 'the receipt dir: ' + (r.stdout || '') + (r.stderr || ''));
  assert.notStrictEqual(path.resolve(got), path.resolve(data));
});

test('WIRING: every `Start-Process $exe` in launch.ps1 is preceded by the fuse, with no other launch between them', () => {
  const r = spawnSync('powershell.exe', ['-NoProfile', '-Command', `
    $ast = [System.Management.Automation.Language.Parser]::ParseFile('${LAUNCH.replace(/'/g, "''")}', [ref]$null, [ref]$null)
    $cmds = $ast.FindAll({ param($n) $n -is [System.Management.Automation.Language.CommandAst] }, $true) | Sort-Object { $_.Extent.StartOffset }
    foreach ($c in $cmds) {
      $name = $c.GetCommandName()
      if ($name -eq 'Invoke-FuseOnce') { 'FUSE' }
      elseif ($name -eq 'Start-Process' -and $c.CommandElements.Count -ge 2 -and $c.CommandElements[1].Extent.Text -eq '$exe') { 'START' }
    }`], { encoding: 'utf8' });
  const seq = (r.stdout || '').split(/\r?\n/).filter(Boolean);
  const starts = seq.filter((s) => s === 'START').length;
  assert.ok(starts >= 2, 'expected the two app-start sites: ' + seq.join(','));
  for (let i = 0; i < seq.length; i++) if (seq[i] === 'START') assert.strictEqual(seq[i - 1], 'FUSE', 'a Start-Process $exe with no fuse right before it: ' + seq.join(','));
});
