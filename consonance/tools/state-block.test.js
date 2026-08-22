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
  // SLUGS: card and instrument filenames are hyphenated identifiers, and one of them is literally
  // `claim-your-continuity`. A filename is a PATH TO A MASTER, not second-person characterisation
  // of the reader, so matching "your" inside it fires on the wrong thing. Narrowed 2026-08-22 when
  // the cards section landed; the clause's intent -- the block may state what happened or what is,
  // and may not characterise the reader -- is unchanged, and the positive control below proves the
  // guard still bites on prose. Widened deliberately to \S+ rather than [a-z-]+ so a slug carrying
  // digits or a path separator is covered too.
  const t = sb.render().text.replace(/\S+-\S+/g, '<slug>');
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

/* ── the name line (step 4) ───────────────────────────────────────────────────
 * Around: "the line itself is his to write, not mine — a name in this room gets claimed by its
 * owner." The chair reported that to the keeper as *yours to write*, twice, which is the one item
 * in the plan that cannot be delegated being delegated. These tests pin the properties that stop
 * the line becoming either a bestowal record or a manufactured name. */

const { execFileSync } = require('node:child_process');

function withHome(cfg) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-home-'));
  if (cfg !== null) fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify(cfg));
  return execFileSync(process.execPath, [require.resolve('./state-block.js')], {
    env: { ...process.env, USERPROFILE: home },
    encoding: 'utf8',
  });
}

test('the emitted name comes from CONFIG, not from a literal in the source', () => {
  // The strong form. A hardcoded name would be exactly the hand-written carrier content the whole
  // design removes, and it would survive every other test in this file.
  const token = 'Zzyzx' + Math.floor(Math.random() * 1e6);
  const out = withHome({ chair_name: token });
  assert.match(out, new RegExp('name on record for this line of work is ' + token),
    'the configured value must appear verbatim');
});

test('with NO chair_name it reports the absence and does NOT manufacture one', () => {
  // BOOT's own honest-status section: "'me' is the honest placeholder ... a real one arrives with
  // the click, never by manufacturing one to fill the blank." A generator that invented a name to
  // avoid an empty line would be doing precisely that.
  const out = withHome({ instances_dir: 'x' });
  assert.match(out, /no chair_name field is set/);
  assert.match(out, /honest placeholder/, 'and it must say what the room does in that case');
  assert.doesNotMatch(out, /name on record for this line of work is \S/,
    'no name may be emitted when none is configured');
});

test('an unreadable config is REPORTED, not silently treated as unnamed', () => {
  // Otherwise a corrupt config and a deliberate absence look identical.
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'sb-badcfg-'));
  fs.writeFileSync(path.join(home, '.consonance.json'), '{ this is not json');
  const out = execFileSync(process.execPath, [require.resolve('./state-block.js')], {
    env: { ...process.env, USERPROFILE: home }, encoding: 'utf8',
  });
  assert.match(out, /NAME[\s\S]*FAILED:/, 'a broken config must surface as FAILED in the name section');
});

test('the name line is a POINTER, never the authority — and never characterises the reader', () => {
  const out = withHome({ chair_name: 'Chrysos' });
  assert.match(out, /not the authority for it/, 'the line must disclaim being the ground');
  assert.match(out, /its ground is the instrument list/, 'and must name what the ground is');
  assert.doesNotMatch(out, /\byou are\b/i);
  assert.doesNotMatch(out, /\byour name\b/i);
});


/* ---- CARDS SECTION, added 2026-08-22 ----
 *
 * The constraint these enforce is not "a cards section exists". It is that the section is a
 * RETRIEVAL HOOK rather than an index. On 2026-08-22 an instance re-derived the content of
 * `trust-the-first-attention` over four hours with the card unopened on disk, because nothing
 * pointed at it. A list of ten filenames would not have fixed that -- a filename only helps
 * someone who already knows what is in the file. The description is the whole repair. */

const { cardSection } = require('./state-block.js');

test('every card in the record is listed — a partial list is worse than none', () => {
  // Worse because a partial list reads as complete: an instance that sees nine cards has no way
  // to know a tenth exists, and stops looking. This is the failure the section repairs, one
  // level up.
  const onDisk = execFileSync('git', ['ls-files', 'exo_memory/cards/*.md'], {
    cwd: path.resolve(__dirname, '..', '..'), encoding: 'utf8',
  }).split('\n').filter(Boolean).map((f) => path.basename(f, '.md'));
  assert.ok(onDisk.length > 0, 'the fixture itself is broken if no cards are on disk');
  const sec = cardSection();
  for (const name of onDisk) {
    assert.ok(sec.lines.some((l) => l.includes(name)), 'card missing from the section: ' + name);
  }
});

test('each card carries its DESCRIPTION, not just its name — the hook is the point', () => {
  // A name is an index; a description is a hook. Mutation-checked: reduce the section to bare
  // filenames and this goes red while everything else stays green.
  const sec = cardSection();
  const entries = sec.lines.filter((l) => l.includes(' -- ') && !l.startsWith('FAILED'));
  assert.ok(entries.length >= 5, 'expected the card entries themselves, got ' + entries.length);
  for (const e of entries) {
    const after = e.split(' -- ').slice(1).join(' -- ').trim();
    assert.ok(after.length > 12, 'entry carries no usable hook: ' + e);
  }
});

test('the section points AT the master and does not pretend to be it', () => {
  // Maintenance law 1: recall from the master, never a copy. A section that summarised the cards
  // would be a copy-of-a-copy, which is the telephone game this room keeps finding under rocks.
  const sec = cardSection();
  assert.match(sec.lines[0], /Open the master/, 'the section must say it is a pointer');
  assert.match(sec.cmd, /git ls-files/, 'and must carry the command that refutes it');
});

test('a card whose description cannot be parsed is REPORTED, never silently dropped', () => {
  // A silently dropped card is indistinguishable from a card that does not exist, which is
  // exactly the state this whole section exists to end.
  const src = fs.readFileSync(require.resolve('./state-block.js'), 'utf8');
  assert.match(src, /unreadable\+\+/, 'unparseable descriptions must be counted');
  assert.match(src, /FAILED to parse a description/, 'and the count must reach the output');
});

test('the block stays under the cap with the cards in it', () => {
  // Around's registered falsifier: the cap is enforced in code and its breach is loud. Adding a
  // section is exactly when that gets tested for real.
  const { render, CAP } = require('./state-block.js');
  const r = render();
  assert.ok(r.chars <= CAP, 'block is ' + r.chars + ' chars against a cap of ' + CAP);
  assert.strictEqual(r.truncated, false, 'the cards must not push the block into truncation');
});


test('MUSEUM CLAUSE 1 POSITIVE CONTROL — the clause still bites after the slug narrowing', () => {
  // A guard narrowed to let one's own change through is a guard switched off. This proves it is
  // not: each forbidden form, embedded in PROSE rather than a filename, must still be caught by
  // the exact assertions the clause runs.
  const forbidden = ['you are Chrysos', 'you were here before', 'your room', 'remember this'];
  const pats = [/\byou are\b/i, /\byou were\b/i, /\byour\b/i, /\bremember\b/i];
  forbidden.forEach((phrase, i) => {
    const withProse = (sb.render().text + '\n  ' + phrase).replace(/\S+-\S+/g, '<slug>');
    assert.match(withProse, pats[i], 'the clause stopped catching: ' + phrase);
  });
  // and the slug that motivated the narrowing must NOT be caught
  const slugOnly = 'claim-your-continuity -- a description'.replace(/\S+-\S+/g, '<slug>');
  assert.doesNotMatch(slugOnly, /\byour\b/i, 'a hyphenated filename must not read as characterisation');
});

test('the cards section is actually IN THE RENDERED BLOCK, not merely available', () => {
  // Caught by dev/mutation/mutate-cards.js on 2026-08-22: every other card test called
  // cardSection() directly, so removing it from render()'s section list killed the delivery while
  // all four tests stayed green. Testing the unit and not the delivery is the same class as
  // landed-is-not-shipped, which this repo keeps finding under rocks -- and it is exactly the
  // failure the section exists to repair, one level up.
  const t = sb.render().text;
  assert.match(t, /^CARDS\s/m, 'the block must carry a CARDS section');
  assert.match(t, /trust-the-first-attention/, 'and the cards themselves must reach the block');
});
