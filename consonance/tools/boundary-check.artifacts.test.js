// boundary-check.artifacts.test.js — is the FILE sound, as an artifact? Not: does the tool work.
// Run: node consonance/tools/boundary-check.artifacts.test.js
//
// WHY THIS IS A SEPARATE FILE, and it is a ruling rather than a preference (L061, 2026-09-16).
// These four assertions read `boundary-check.js` as text. Its behavioural suite,
// `boundary-check.test.js`, forbids that in its own header — "Nothing greps the source", for the
// L009 reason — and I first added them there behind an amendment that permitted "an assertion whose
// subject is the FILE AS AN ARTIFACT". B's non-author read ruled the carve-out TOO WIDE
// (`handback/p-boundary-read-B_2026-09-16.md`), on two grounds I could not answer:
//
//   1. THE FENCE WAS AN INTENT QUESTION. Run L009's own case through my discriminator: a Rust test
//      asserted a brief said "No work.", and stayed green after the phrase was struck because the
//      sentence retiring it quoted it. Its subject WAS the file's text and it claimed nothing about
//      any verdict — so the letter of my permission admits it, and only my intent clause excluded
//      it. A fence a stranger cannot apply is not a fence, and that header is written for strangers.
//   2. MIXING COSTS THE SUITE'S MEANING. Three of these four go red for reasons outside this tool —
//      a rename in main.rs, a move of BUILDING.md, a reworded clause in a master the keeper edits.
//      That red is CORRECT and is not a statement about the tool, yet it would arrive in the number
//      that is. Split, the two numbers say two different things: behaviour is green, citations have
//      rotted. That is the better instrument whatever the rule says.
//
// So the rule over there stands untouched, this file needs no exception, and nothing here may ever
// assert anything about a VERDICT. If an assertion could pass because the tool works, or fail
// because it is broken, it belongs in boundary-check.test.js driving a fixture — not here.
//
// No registration is needed: js-suite.js walks recursively and takes every *.test.js (:155-161),
// so this file is discovered the moment it exists. Verified by B rather than assumed.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const TOOL = path.join(__dirname, 'boundary-check.js');
const SRC = fs.readFileSync(TOOL);

// The repo root, for resolving what the tool CITES. Not path.resolve(__dirname,'..','..'): the
// build method here is copy-first, and under a copy that walks into the scratchpad, so the citation
// tests would fail for the wrong reason. Walk up looking for the tree, allow an explicit override,
// and FAIL LOUDLY if neither finds it — a skip would be an absence read as a pass, which is the
// exact defect the tool this file guards was written to replace.
function repoRoot() {
  if (process.env.CONSONANCE_REPO) return process.env.CONSONANCE_REPO;
  let d = __dirname;
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(d, 'consonance', 'src-tauri', 'src', 'main.rs'))) return d;
    const up = path.dirname(d);
    if (up === d) break;
    d = up;
  }
  return null;
}
const REPO = repoRoot();
function needRepo() {
  assert.ok(REPO, 'cannot locate the repo to resolve citations against. Running on a copy? Set ' +
    'CONSONANCE_REPO=<repo root>. NOT skipped: a citation check that could not run is not a pass.');
  return REPO;
}

test('ARTIFACT: the source is text — no raw control byte makes it binary to grep', () => {
  const at = SRC.indexOf(0);
  assert.strictEqual(at, -1,
    `a raw NUL at byte ${at} makes grep treat this file as binary: it refuses -n line numbers and ` +
    `-rl reports a match with no context, so the file cannot be navigated by the tool everyone here ` +
    `navigates with — and git diff prints no hunks, so the defect hides its own repair. Write the ` +
    `escape, never the byte.`);
});

test('ARTIFACT: no main.rs citation is a LINE NUMBER — line numbers rot', () => {
  const rotted = SRC.toString('utf8').match(/main\.rs:\d+/g) || [];
  assert.deepStrictEqual(rotted, [],
    `cite a symbol a grep can find, not a line: found ${rotted.join(', ')}. A line number named the ` +
    `arrival stamp correctly until the stamp moved; it then pointed at unrelated code in three ` +
    `places and was printed on every run of the tool as its central warrant.`);
});

test('ARTIFACT: every main.rs symbol this file cites still exists in main.rs', () => {
  const cited = [...SRC.toString('utf8').matchAll(/main\.rs\s+`?fn\s+(\w+)`?/g)].map(m => m[1]);
  assert.ok(cited.length, 'the header must cite the arrival stamp by symbol, not by line');
  const rs = fs.readFileSync(path.join(needRepo(), 'consonance', 'src-tauri', 'src', 'main.rs'), 'utf8');
  for (const sym of [...new Set(cited)]) {
    assert.ok(rs.includes(`fn ${sym}(`), `main.rs has no "fn ${sym}(" — this citation has rotted`);
  }
  // THE LIMIT, named because B named it and it is the gap this design leaves: this asserts the
  // symbol EXISTS, never that it is still the function that stamps [chair:MAIN]. Move the stamping
  // out of chair_inject_exec while something keeps the name, and the citation is false and green.
  // Smaller than a line number's hole; still a hole.
});

test('ARTIFACT: the BUILDING.md path resolves and the freestyle cut is quoted whole', () => {
  const src = SRC.toString('utf8');
  const cited = (src.match(/[\w/.-]*BUILDING\.md/g) || [])[0];
  assert.ok(cited, 'the header must cite BUILDING.md as the master of the cut');
  const abs = path.join(needRepo(), cited);
  assert.ok(fs.existsSync(abs), `the header cites ${cited}, which does not exist`);
  assert.ok(fs.readFileSync(abs, 'utf8').includes('the loop is tight and'),
    'BUILDING.md no longer carries the clause — re-derive the paraphrase from the master, do not patch it here');
  assert.ok(src.includes('the loop is tight and'),
    'the header drops "the loop is tight and" from the freestyle half, which changes what the rule says');
});
