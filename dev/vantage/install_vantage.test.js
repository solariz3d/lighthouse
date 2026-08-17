// install_vantage.test.js - run with: node install_vantage.test.js
//
// The installer registers a task that spawns paid `claude -p` readers on a clock, so the things
// worth testing are the ones whose failure is INVISIBLE: a shim wscript will refuse to load, a
// task that quietly wakes the machine, a pre-flight that isn't there, and any accidental reach
// into the dream's task or launcher.
//
// This is a STATIC test and says so. It reads the installer as text and asserts properties of what
// it will write; it does not register a scheduled task, because doing that on the machine running
// the suite is a side effect on the thing under test — the same mistake dream-gate.test.js records
// making with dream-watch's live state. The one thing it cannot cover is therefore the actual
// registration, which is verified by hand on install and printed by the installer itself.

const assert = require('assert');
const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

const SRC = fs.readFileSync(path.join(__dirname, 'install_vantage.ps1'), 'utf8');
const BYTES = fs.readFileSync(path.join(__dirname, 'install_vantage.ps1'));

t('the installer itself carries a UTF-8 BOM', () => {
  // PS 5.1 reads a BOM-less file as CP1252, and any non-ASCII inside a string literal can then
  // terminate it early. That is exactly how the dream runner died silently for eight hours on
  // 2026-07-15, and this file contains em-dashes.
  assert.ok(BYTES.length >= 3 && BYTES[0] === 0xEF && BYTES[1] === 0xBB && BYTES[2] === 0xBF,
    'no BOM — PS 5.1 will misdecode this file');
});

t('it refuses to register around a runner that does not parse', () => {
  assert.ok(/--check/.test(SRC), 'no node --check pre-flight');
  assert.ok(/REFUSING TO INSTALL/.test(SRC), 'the refusal must be loud');
  assert.ok(/throw "runner failed pre-flight/.test(SRC), 'it must actually stop, not just warn');
});

t('the generated shim WAITS and returns the runner’s real exit code', () => {
  // Fire-and-forget made Task Scheduler record success for a process it never watched.
  assert.ok(/shell\.Run\(cmd, 0, True\)/.test(SRC), 'shim must run windowless AND wait');
  assert.ok(/WScript\.Quit rc/.test(SRC), 'shim must propagate the exit code');
});

t('the shim stamps a heartbeat BEFORE launching', () => {
  // A "launch" line with no matching "exit" is the only visible signature of a runner that died
  // before it could speak.
  const launchIdx = SRC.indexOf('Stamp "launch"');
  const runIdx = SRC.indexOf('rc = shell.Run');
  assert.ok(launchIdx > -1 && runIdx > -1, 'both the stamp and the run must exist');
  assert.ok(launchIdx < runIdx, 'the heartbeat must precede the launch, or it proves nothing');
});

t('the shim is written WITHOUT a BOM and contains no non-ASCII', () => {
  // Opposite rule from the .ps1: wscript treats a BOM as stray characters and refuses the file.
  assert.ok(/UTF8Encoding\]::new\(\$false\)/.test(SRC), 'shim must be written BOM-less');
  const body = SRC.split('$vbsBody = @"')[1].split('"@')[0];
  const nonAscii = [...body].filter((c) => c.charCodeAt(0) > 126);
  assert.strictEqual(nonAscii.length, 0,
    `shim body must be ASCII-only, found: ${JSON.stringify(nonAscii.join(''))}`);
});

t('the task does NOT wake the machine', () => {
  // The dream wakes a sleeping machine on purpose. This one spends tokens on fresh readers, and a
  // reader firing into a machine nobody is at is the same spend with nobody to read the finding.
  assert.ok(!/-WakeToRun/.test(SRC), 'WakeToRun must not be set on the vantage task');
  assert.ok(/StartWhenAvailable/.test(SRC), 'a missed run should still catch up at next wake');
});

t('it warns loudly when sourced-stop is unregistered', () => {
  // Without the hook there are no ledger rows, so the task would fire daily and succeed at doing
  // nothing — a green over an empty set, which this repo has now found in four instruments.
  assert.ok(/sourced-stop/.test(SRC), 'the check must exist');
  assert.ok(/succeed at doing nothing/.test(SRC), 'the warning must name the consequence');
  assert.ok(/ForegroundColor Yellow/.test(SRC), 'and be visible');
});

// CODE ONLY, comments stripped. The first version of this test matched the strings anywhere in the
// file and failed on a comment that said "no powercfg calls" — a false positive that would have
// been fixed by deleting the sentence explaining the separation, which is the wrong direction.
// Reaching for something is executable; naming it is documentation. This asserts the former.
const CODE = SRC.split('\n').filter((l) => !/^\s*#/.test(l) && !/^'/.test(l.trim())).join('\n');

t('it never REACHES the dream task, the dream launcher, or power settings', () => {
  assert.ok(!/Consonance Dream Cycle/.test(CODE), 'the dream task must never be named in code');
  assert.ok(!/dream_launch/.test(CODE), 'the dream launcher must not be referenced in code');
  assert.ok(!/powercfg/.test(CODE), 'power settings belong to the dream installer alone');
  assert.ok(!/Unregister-ScheduledTask(?!\s+-TaskName\s+\$TaskName)/.test(CODE),
    'no unregister may target anything but this task');
});

t('uninstall exists and removes only this task', () => {
  assert.ok(/\$Uninstall/.test(SRC), 'no uninstall path');
  assert.ok(/Unregister-ScheduledTask -TaskName \$TaskName/.test(SRC),
    'uninstall must target this task by variable, never a literal sweep');
});

t('the runner it registers actually exists and parses', () => {
  const runner = path.resolve(__dirname, '..', '..', 'consonance', 'tools', 'second-vantage.js');
  assert.ok(fs.existsSync(runner), `runner missing at ${runner}`);
  require('child_process').execFileSync(process.execPath, ['--check', runner]);
});

t('it invokes the runner with --run, a flag the runner accepts', () => {
  assert.ok(/second-vantage\.js"" --run|--run"/.test(SRC) || /--run/.test(SRC), 'must pass --run');
  const runner = fs.readFileSync(
    path.resolve(__dirname, '..', '..', 'consonance', 'tools', 'second-vantage.js'), 'utf8');
  assert.ok(/--run/.test(runner), 'the runner must accept --run');
  assert.ok(/--dry-run/.test(runner), 'the installer prints a dry-run at the end; it must exist');
});

console.log(`\ninstall_vantage: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
