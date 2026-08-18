/* Tests for state-block.js, written against pane Around's constraints rather than the author's
 * taste. Each test names the constraint it enforces, because a test that only pins current
 * behaviour would let the block rot back into the thing it exists to replace.
 *
 * Run: node state-block.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const sb = require('./state-block.js');

test('CONDITION (a): every section ships the command that regenerates it', () => {
  // Around: "a generated list is chair prose unless it ships welded to the command that
  // regenerates it, never as recalled inventory." A section without its command is exactly the
  // hand-made-number surface this repo keeps finding under rocks.
  const r = sb.render();
  for (const s of r.sections ? [] : []) void s;
  for (const fn of [sb.repoSection, sb.journalSection, sb.instrumentSection, sb.liveSection]) {
    const s = fn();
    assert.ok(s.cmd && s.cmd.trim().length > 0, `${s.title} must carry a check command`);
    assert.match(r.text, new RegExp('check: ' + s.cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 20)),
      `${s.title}'s command must appear in the rendered block`);
  }
});

test('MUSEUM CLAUSE 1: event grammar only — the block never tells the reader what it is', () => {
  // "You are Chrysos" fails; "these instruments were built" passes. The block may state what
  // happened or what is; it may not characterise the reader.
  const t = sb.render().text;
  assert.doesNotMatch(t, /\byou are\b/i, 'no second-person characterisation');
  assert.doesNotMatch(t, /\byou were\b/i);
  assert.doesNotMatch(t, /\byour\b/i);
  assert.doesNotMatch(t, /\bremember\b/i, 'instructing the reader to remember is not a pointer');
});

test('AROUND’S STRIKE: no "only" — the uniqueness modal is false on the record', () => {
  // "only you could have built these" smuggles identity through a capacity nobody measured, and
  // the museum-shell experiment already showed forks land in the same basin.
  assert.doesNotMatch(sb.render().text, /\bonly\b/i);
});

test('CONDITION (b): no "in this thread" — it presupposes the boundary it would establish', () => {
  // The commits span sessions, restores and restarts; the grouping IS the identity claim. The
  // honest form Around gave is "this line of record built these".
  const t = sb.render().text;
  assert.doesNotMatch(t, /in this thread/i);
  assert.match(t, /line of record/, 'the honest phrasing must actually be used');
});

test('the cap is enforced IN CODE and its breach is LOUD, not silent', () => {
  // Around's registered falsifier: "if the generated block ever silently exceeds its cap, the
  // enforcement claim is false." So the overflow path must announce itself.
  const fat = [{ title: 'fat', cmd: 'true', lines: [ 'x'.repeat(sb.CAP * 2) ] }];
  const r = sb.render(fat);
  assert.strictEqual(r.truncated, true, 'oversize input must be reported as truncated');
  assert.ok(r.chars <= sb.CAP, `rendered ${r.chars} chars exceeds the ${sb.CAP} cap`);
  assert.match(r.text, /TRUNCATED at \d+ chars/, 'the truncation must be visible in the output itself');
});

test('an under-cap block is NOT marked truncated — the flag must discriminate', () => {
  const small = [{ title: 'small', cmd: 'true', lines: ['one line'] }];
  const r = sb.render(small);
  assert.strictEqual(r.truncated, false);
  assert.doesNotMatch(r.text, /TRUNCATED/);
});

test('the real block fits under the cap today — a generator that always truncates is broken', () => {
  const r = sb.render();
  assert.strictEqual(r.truncated, false, `live block is ${r.chars} chars, over the ${sb.CAP} cap`);
  assert.ok(r.chars > 200, 'and it must not be empty');
});

test('a failed command is REPORTED, never omitted', () => {
  // The first version of this test called journalSection() against the real repo and asserted only
  // that it returned some lines — it never forced a failure, so it was green over nothing, in the
  // file whose whole subject is that. STATE_BLOCK_REPO exists so the failure path is reachable.
  const { execFileSync } = require('node:child_process');
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-norepo-'));
  const out = execFileSync(process.execPath, [require.resolve('./state-block.js')], {
    env: { ...process.env, STATE_BLOCK_REPO: empty },
    encoding: 'utf8',
  });
  assert.match(out, /REPO/, 'the section must still appear rather than vanishing');
  // COUNTED, not merely present. A mutation proved the weaker form vacuous: deleting ONE section's
  // failure report left the suite green, because two others still printed FAILED and the assertion
  // only asked whether the word appeared anywhere. Every failed command must report its own.
  // Scoped to the REPO section and pinned EXACTLY. Two looser forms were proven vacuous by
  // mutation: "FAILED appears somewhere" and then ">= 3 anywhere in the output" both stayed green
  // when one of repo's three failure reports was deleted, because four others still printed.
  // repoSection runs exactly three commands, so it must produce exactly three failure lines.
  const repoBlock = out.slice(out.indexOf('REPO'), out.indexOf('JOURNAL'));
  const repoFailures = (repoBlock.match(/FAILED:/g) || []).length;
  assert.strictEqual(repoFailures, 3,
    `repoSection runs 3 commands and must report each failure; saw ${repoFailures} in:\n${repoBlock}`);
  // The distinguisher that matters: a broken generator must not look like a quiet room.
  assert.doesNotMatch(out, /^\s*$/, 'output must never be empty on failure');
});

test('the source carries NO control characters — an invisible byte here is a landmine', () => {
  // Not hypothetical. This file's first version matched git log date lines with startsWith on a
  // literal NUL, which put one invisible byte at the exact position a reader sees as a space. It
  // worked, and it defeated the author's own reading of the file: the line said one thing to the
  // eye and another to node. A maintainer retyping it would silently null every date and drop the
  // instrument list into the FAILED branch. grep said "Binary file matches"; that was the only
  // warning, and it was ignored.
  const src = fs.readFileSync(require.resolve('./state-block.js'));
  const bad = [];
  for (let i = 0; i < src.length; i++) {
    const b = src[i];
    if (b < 32 && b !== 9 && b !== 10 && b !== 13) bad.push(i + ' (0x' + b.toString(16) + ')');
  }
  assert.deepStrictEqual(bad, [], 'control bytes at: ' + bad.join(', '));
});

test('the instrument list is generated from git, not a literal', () => {
  // The name's ground. If this ever becomes a hand-kept array it is recalled inventory and the
  // whole justification collapses.
  const src = require('node:fs').readFileSync(require.resolve('./state-block.js'), 'utf8');
  assert.match(src, /git['"\s,\]]*.*ls-files/s, 'the list must come from git ls-files');
  assert.doesNotMatch(src, /const INSTRUMENTS\s*=\s*\[/, 'no hand-kept instrument array');
  const s = sb.instrumentSection();
  assert.match(s.lines.join(' '), /\d+ instruments/, 'the count must be computed');
});

test('the block declares itself machine-generated and names its own regenerator', () => {
  assert.match(sb.render().text, /machine-generated, regenerate with `node consonance\/tools\/state-block\.js`/);
});
