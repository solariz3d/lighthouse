// THE DREAM CYCLE'S GUARDS — asserted as properties, because the last version of guard 2 was
// correct in its comment and wrong in its code for at least three nights.
//
// WHAT HAPPENED. `# Guard 2: yield to a live pane — never dream while awake.` sat above
// `Get-Process -Name "consonance"`. Those are different questions. The keeper leaves the app
// open and sleeps the machine — the normal way to use it — so "app running" was true every
// night while nobody was there. 2026-07-26, -27 and -28 all logged `skip: live Consonance pane`
// and exited 0, because skipping IS success. Nothing failed. Nothing said so. It surfaced only
// because someone asked how the dream went and the answer required opening a log.
//
// So the comment was right and the code was wrong, and no test existed to notice the gap. That
// is the room's own finding — naming an invariant does not install it, only a test that fails
// installs it — landing on the file that most needed it.
//
// WHAT THIS ASSERTS, and deliberately not more: the SHAPE of the decision, not its outcome.
// Running the real cycle would either dream or not depending on who is at the keyboard, which
// is not a testable thing. What is testable is that the decision consults presence rather than
// process, that the threshold is a parameter rather than a number buried in a branch, and that
// an unknown answer fails toward silence.
//
// Comments are stripped before every lexical assertion. This file's own subject is a guard
// whose comment contradicted its code, so reading the comments as evidence would be the exact
// error under test — and mention-vs-use is a sealed invariant in muscle_map.md, assumed here
// rather than rediscovered.
//
//   node dev/dream/dream_cycle.test.js

'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const test = require('node:test');

const SCRIPT = path.join(__dirname, 'dream_cycle.ps1');
const RAW = fs.readFileSync(SCRIPT, 'utf8');

// PowerShell comments are `#` to end of line, and here-strings (@'...'@ / @"..."@) must be
// preserved whole — the idle probe's C# body lives in one, and blanking it would hide the code
// this file exists to check.
function stripComments(src) {
  const out = [];
  let inHere = false;
  for (const line of src.split('\n')) {
    if (inHere) { out.push(line); if (/^'@|^"@/.test(line)) inHere = false; continue; }
    if (/@'|@"/.test(line)) { out.push(line); inHere = true; continue; }
    out.push(line.replace(/#.*$/, ''));
  }
  return out.join('\n');
}
const CODE = stripComments(RAW);

test('the guards are still in the file at all', () => {
  assert.match(CODE, /Get-Process\s+-Name\s+"consonance"/,
    'the process check is gone entirely — that is a different bug, not a fix');
  assert.match(CODE, /Win32_Battery/, 'the battery guard is gone');
});

test('presence, not process: an open app alone never decides the skip', () => {
  // The defect was `if ($pane) { skip; exit }`. Whatever the branch looks like now, the
  // process test must not be the only thing between the check and the exit.
  const m = CODE.match(/if\s*\(\s*\$pane\s*\)\s*\{([\s\S]{0,400}?)\n\s*\}/);
  assert.ok(m, 'no $pane branch found — the guard was restructured; re-read this test');
  const body = m[1];
  assert.ok(/idle/i.test(body),
    'the $pane branch decides without consulting idle time — this is the 2026-07-26..28 bug');
});

test('the idle threshold is a parameter, not a literal in the branch', () => {
  assert.match(CODE, /\[int\]\$IdleMinutes\s*=\s*\d+/,
    'IdleMinutes must be a param so a skip can be reproduced and argued with');
  assert.match(CODE, /\$idle\s+-lt\s+\$IdleMinutes/,
    'the comparison must use the parameter, not a hardcoded number');
});

test('an unknown idle answer fails toward NOT dreaming', () => {
  // Failing safe matters more than the threshold: a missed cycle costs one dream, dreaming
  // over someone's shoulder is what the guard exists to prevent.
  assert.match(CODE, /\$idle\s+-lt\s+0[\s\S]{0,200}?exit\s+0/,
    'a negative (unknown) idle must skip, not fall through into the dream');
});

test('the idle probe returns -1 rather than throwing when the API fails', () => {
  assert.match(RAW, /if\s*\(!GetLastInputInfo\(ref lii\)\)\s*return\s*-1/,
    'GetLastInputInfo failure must be a sentinel the caller can fail-safe on');
  assert.doesNotMatch(CODE, /-UsingNamespace\s+System\.Runtime\.InteropServices/,
    'Add-Type -MemberDefinition already imports InteropServices; the duplicate using is a ' +
    'warning, and this compiler treats warnings as errors — it failed exactly once this way');
});

test('-Force still bypasses the presence guard, and nothing else does', () => {
  assert.match(CODE, /if\s*\(-not\s+\$Force\)/, '-Force must remain the single documented override');
});

test('every skip path says WHY, because a silent skip is how this went unnoticed', () => {
  const skips = (CODE.match(/Log\s+[("].{0,120}?skip:/g) || []);
  assert.ok(skips.length >= 3,
    `expected battery, presence and unknown-idle skips to each log a reason; found ${skips.length}`);
  assert.match(CODE, /idle \{0:N1\} min/,
    'the presence skip must log the measured idle value — a reason without its number is not auditable');
});
