// readme.test.js — the README is what a stranger reads first (D125, after A's clean-machine run found it could not be
// followed: loop/jev_clean_machine_2026-09-23.md R1–R10). These pin the parts that must not drift.
//
// "FIRST SCREEN" is defined here as everything before the README's first `## ` heading.
//
//   node jev/test/readme.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const path = require('path');

const README = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8').replace(/\r\n/g, '\n');
const flat = (s) => s.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
const FIRST_SCREEN = README.split(/\n## /)[0];

// The design's precision sentence, VERBATIM (exo_memory/loop/jev_standalone_design_2026-09-23.md :14–15). Copied here
// rather than read from there, so this module's tests need nothing outside jev/.
const PRECISION = 'Jev marks turns worth a second look. Measured on its first 56 units, about 1 in 4 marked turns was '
  + 'confirmed by a blind reader; the readers were AI assistants from this project and lean lenient.';

test('FIRST SCREEN carries the gateway disclosure: judged turns are sent to the Vercel AI Gateway', () => {
  assert.match(flat(FIRST_SCREEN), /judged turns are sent to the Vercel AI Gateway/i);
});

test('FIRST SCREEN carries the design\'s precision sentence, verbatim', () => {
  assert.ok(flat(FIRST_SCREEN).includes(PRECISION), 'the precision sentence is missing or reworded in the first screen');
});

test('FIRST SCREEN says the key is env-only, by its name', () => {
  assert.match(FIRST_SCREEN, /AI_GATEWAY_API_KEY/);
});

test('NOWHERE: the two forbidden phrases', () => {
  for (const re of [/drift detected/i, /caught drift/i]) assert.doesNotMatch(flat(README), re);   // flattened: a phrase wrapped across two lines is still the phrase
});

test('ONE WORKING DIRECTORY: every `node` command runs jev from the folder that contains it (R8)', () => {
  const cmds = README.split('\n').map((l) => l.trim()).filter((l) => /^node\s/.test(l));
  assert.ok(cmds.length >= 3, `expected the install, report and uninstall commands, found ${cmds.length}`);
  for (const c of cmds) assert.match(c, /^node jev\//, c);
});

test('the install command itself is written, not left to inference (R2)', () => {
  assert.ok(README.split('\n').some((l) => l.trim() === 'node jev/install.js'));
});

test('no line says there is no supported install (R1)', () => {
  assert.doesNotMatch(flat(README), /no supported install/i);   // flattened: the old README wrapped this phrase across lines, and a raw search missed it
});

test('no private path a stranger cannot open (R10)', () => {
  assert.doesNotMatch(README, /exo_memory|lighthouse repository|jev_r2r3_score/i);
});
