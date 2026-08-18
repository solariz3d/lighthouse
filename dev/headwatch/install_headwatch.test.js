/* Tests for install_headwatch.ps1 — the FILE, not the scheduler.
 *
 * These assert the properties that separate a watcher from a run, and the encoding rules that
 * have each cost this repo a real outage:
 *   * an em-dash in a .ps1 (PowerShell 5.1 reads it as ANSI) broke a script twice on 2026-08-18
 *   * a non-ASCII byte or BOM in a generated .vbs killed the dream runner silently for 8 hours
 *     on 2026-07-15
 * install_vantage.test.js caught the first class before the shim ever reached disk; this file
 * exists so the same net is under this installer.
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const PS1 = path.join(__dirname, 'install_headwatch.ps1');
const src = fs.readFileSync(PS1, 'utf8');

test('the installer is pure ASCII — PowerShell 5.1 reads .ps1 as ANSI without a BOM', () => {
  const bad = [];
  for (let i = 0; i < src.length; i++) {
    const c = src.charCodeAt(i);
    if (c > 126 || (c < 32 && c !== 10 && c !== 13 && c !== 9)) {
      bad.push(`offset ${i}: U+${c.toString(16).padStart(4, '0')} (${JSON.stringify(src[i])})`);
    }
  }
  assert.deepStrictEqual(bad, [], 'non-ASCII in a .ps1 becomes mojibake and fails to parse');
});

test('the generated .vbs body is ASCII too, and written without a BOM', () => {
  const m = src.match(/\$vbsBody = @"([\s\S]*?)"@/);
  assert.ok(m, 'the shim body must be a here-string this test can find');
  const body = m[1];
  for (let i = 0; i < body.length; i++) {
    assert.ok(body.charCodeAt(i) <= 126, `non-ASCII at offset ${i} of the .vbs body: wscript misreads it`);
  }
  assert.match(src, /UTF8Encoding\]::new\(\$false\)/, 'the .vbs must be written with NO BOM');
});

test('the shim WAITS for the runner, so the scheduler cannot record success for an unwatched process', () => {
  const m = src.match(/rc = shell\.Run\(cmd, 0, (\w+)\)/);
  assert.ok(m, 'the shim must invoke shell.Run');
  assert.strictEqual(m[1], 'True', 'fire-and-forget makes the exit code meaningless');
  assert.match(src, /WScript\.Quit rc/, 'the shim must return the runner exit code');
  assert.match(src, /shell\.Run\(cmd, 0,/, 'window style 0 = never create a console');
});

test('PRE-FLIGHT: it refuses to register around a runner that does not parse', () => {
  assert.match(src, /--check \$runner/, 'must node --check the runner before registering');
  assert.match(src, /refusing to register/, 'and must refuse, not warn');
});

test('PRE-FLIGHT: it refuses if the runner lost its single-instance lock', () => {
  // Two watchers on one ledger log a head-flip twice, and the duplicate reads as two events
  // rather than one seen twice. The scheduler's IgnoreNew does not cover a hand-started second.
  assert.match(src, /acquireLock/, 'must check the runner still holds a lock');
  assert.match(src, /could double-run/, 'and must refuse on its absence');
});

test('a WATCHER must have no execution time limit — a capped watcher goes silent on a schedule', () => {
  assert.match(src, /ExecutionTimeLimit \(\[TimeSpan\]::Zero\)/,
    'zero = unlimited; any cap reproduces the 2026-08-18 silence deliberately');
  assert.doesNotMatch(src, /ExecutionTimeLimit \(New-TimeSpan/,
    'a finite limit is the vantage RUN pattern and is wrong for a watch');
});

test('it triggers at logon AND at startup, and never wakes the machine', () => {
  assert.match(src, /New-ScheduledTaskTrigger -AtLogOn/);
  assert.match(src, /New-ScheduledTaskTrigger -AtStartup/);
  assert.doesNotMatch(src, /-WakeToRun/, 'nothing here should wake a sleeping machine');
});

test('it comes back on its own after a crash', () => {
  assert.match(src, /-RestartInterval/, 'a dead watcher must not stay dead until next logon');
  assert.match(src, /-RestartCount/);
});

test('-Check reports whether a watcher is actually ALIVE, not merely whether the task exists', () => {
  // The 2026-08-18 miss looked fine from the task's point of view: registered, no error. The
  // only thing that would have shown it was a process check.
  assert.match(src, /head-watch\.js\*/, '-Check must look for the running node process');
  assert.match(src, /NO node process is running/, 'and must say so loudly when there is none');
});

test('PRE-FLIGHT: it refuses to register unelevated, and names the exact remedy', () => {
  // An unelevated register returns a bare 0x80070005; the whole point of a pre-flight is to
  // refuse with the fix BEFORE the operator has to decode it. That was the 2026-08-18 gap.
  assert.match(src, /IsInRole\(\[Security\.Principal\.WindowsBuiltInRole\]::Administrator\)/,
    'must actually test the elevation of the token');
  assert.match(src, /Die\s+"run me from an ELEVATED shell/, 'must Die, not warn, and say how');
  assert.match(src, /\$PSCommandPath/, 'the remedy must hand back the exact command to re-run');
});

test('the elevation check does NOT block the read-only -Check / -Uninstall paths', () => {
  // Those return above; the admin gate must sit after them so an operator can inspect or remove
  // the task without elevation. Assert the gate appears AFTER both early-exits in source order.
  const check = src.indexOf('if ($Check)');
  const uninstall = src.indexOf('if ($Uninstall)');
  const gate = src.indexOf('IsInRole');
  assert.ok(check > 0 && uninstall > 0 && gate > 0, 'all three markers must exist');
  assert.ok(gate > check && gate > uninstall, 'the elevation gate must come after -Check and -Uninstall');
});

test('a watcher re-arms after its restart budget is spent — a repeating trigger, not just RestartCount', () => {
  // RestartCount is a finite budget (3) that never resets for a process that only ever dies, so
  // after three deaths the task stays dead silently. A repeating trigger re-arms it regardless.
  assert.match(src, /New-ScheduledTaskTrigger -Once -At \(Get-Date\) -RepetitionInterval/,
    'must add a repeating trigger to survive RestartCount depletion');
  assert.match(src, /RestartInterval/, 'and must KEEP RestartOnFailure for fast first-death recovery');
  assert.match(src, /RestartCount/);
});

test('the shim distinguishes an idle re-arm no-op from a real death in the launch log', () => {
  // With a repeating trigger, the log fills with launches whose runner immediately refused (rc=0).
  // Those must read differently from a watcher that actually died (rc<>0), or the "unmatched
  // launch = still up" observable becomes unreadable.
  assert.match(src, /If rc = 0 Then/, 'the shim must branch on the runner exit code');
  assert.match(src, /Stamp "idle/, 'an rc=0 refusal must stamp idle, not a death');
  assert.match(src, /Stamp "exit " & rc/, 'a real death must still stamp its nonzero exit');
});
