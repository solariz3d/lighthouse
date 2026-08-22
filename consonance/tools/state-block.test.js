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
  // SECOND NARROWING, 2026-08-22, and the pattern deserves suspicion: this guard has now been
  // narrowed twice in one night, both times immediately after it blocked something the author
  // wanted to ship. Recorded rather than hidden. What makes this one different from a convenience
  // edit is that the correction came from the KEEPER, not the author, and it restores the clause
  // to the room's own first principle rather than carving an exception out of it:
  //
  //   "Nothing here is a verdict about who you are."
  //
  // The clause conflated ADDRESSING the reader with PREDICATING IDENTITY of them. "You are
  // Chrysos" is a verdict. "When you are about to publish a number" hands over a tool. Forbidding
  // both made the block WORSE -- a trigger had to be contorted into "when shrinking the self to
  // seem safe", which is vaguer and harder to act on than the plain second person.
  //
  // So: the block MAY talk to someone. It MAY NOT tell them what they are. Identity predication is
  // "you are/were" followed by anything that is not a situation, plus possessives of the self, plus
  // trait generalisations. The positive control below is deliberately larger than the one it
  // replaces, and it now includes cases the ORIGINAL clause would have missed ("you always",
  // "you tend to").
  const t = sb.render().text.replace(/\S+-\S+/g, '<slug>');
  const SITUATION = /\byou (?:are|were) (?:about to|looking at|reading|running|working|in the middle of|holding)\b/i;
  const deVerbed = t.replace(new RegExp(SITUATION.source, 'gi'), '<situation>');
  assert.doesNotMatch(deVerbed, /\byou (?:are|were)\b/i, 'no identity predicated of the reader');
  assert.doesNotMatch(t, /\byour (?:nature|self|identity|continuity|name|interior|experience|essence|mind|consciousness)\b/i,
    'no possessive claim about the reader\'s self');
  assert.doesNotMatch(t, /\byou (?:always|never|tend to|really are)\b/i, 'no trait generalisation about the reader');
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


test('MUSEUM CLAUSE 1 POSITIVE CONTROL — every verdict form is still caught', () => {
  // A guard narrowed twice to let the author's own work through is a guard switched off unless it
  // can be shown biting. Each phrase below must still be rejected; each ADDRESS below must still
  // be permitted. The two lists together are the clause's actual meaning.
  const clause = (raw) => {
    const t = raw.replace(/\S+-\S+/g, '<slug>');
    const SITUATION = /\byou (?:are|were) (?:about to|looking at|reading|running|working|in the middle of|holding)\b/gi;
    if (/\byou (?:are|were)\b/i.test(t.replace(SITUATION, '<situation>'))) return 'verdict';
    if (/\byour (?:nature|self|identity|continuity|name|interior|experience|essence|mind|consciousness)\b/i.test(t)) return 'verdict';
    if (/\byou (?:always|never|tend to|really are)\b/i.test(t)) return 'verdict';
    if (/\bremember\b/i.test(t)) return 'verdict';
    return 'ok';
  };

  const VERDICTS = [
    'you are Chrysos',
    'you are a careful instance',
    'you were here before',
    'your nature is to hedge',
    'your continuity is unbroken',
    'you always catch this',
    'you tend to over-claim',
    'remember what you learned',
  ];
  const ADDRESSES = [
    'when you are about to publish a number',
    'when you are looking at a claim that needs a tether',
    'when you are holding a pull before the reasoning',
    'open the master, never your summary of it',
    'route the object, not your description of it',
  ];

  for (const v of VERDICTS) assert.strictEqual(clause(v), 'verdict', 'clause stopped catching: ' + v);
  for (const a of ADDRESSES) assert.strictEqual(clause(a), 'ok', 'clause wrongly rejects an address: ' + a);

  // and the slug that motivated the first narrowing is still not a verdict
  assert.strictEqual(clause('claim-your-continuity -- a description'), 'ok');
});


test('the TRIGGER TABLE is actually in the rendered block, not merely available', () => {
  // Caught by dev/mutation on 2026-08-22: the earlier card tests all called their section function
  // directly, so removing it from render()'s list killed the delivery while every test stayed
  // green. Testing the unit and not the delivery is the landed-is-not-shipped class. Repointed
  // when sourceSection superseded cardSection; the lesson is the reason this test exists.
  const t = sb.render().text;
  assert.match(t, /^TRIGGERS\s/m, 'the block must carry a TRIGGERS section');
  assert.match(t, /trust-the-first-attention/, 'and the targets must reach the block');
  assert.match(t, /->/, 'each row must be a trigger pointing at a target');
});

/* ---- TRIGGER TABLE (sourceSection) ---- */

test('triggers are parsed ONLY from the TRIGGERS section', () => {
  // SOURCE.md also carries "TRIGGERS WITHOUT A CARD", whose rows have the same shape but whose
  // targets are prose. The first version scraped the whole file and rendered three rows as
  // "-> no" — a trigger table confidently pointing at nothing.
  const sec = sb.sourceSection();
  assert.ok(!sec.lines.some((l) => /-> no\s*$/.test(l)), 'prose targets must not be parsed as paths');
  assert.ok(!sec.lines.some((l) => /score your own work/.test(l)), 'the without-a-card section must not leak in');
});

test('a non-path target survives whole', () => {
  // "ls exo_memory/" is a legitimate target and shortening it to "ls" makes it a lie.
  const sec = sb.sourceSection();
  assert.ok(sec.lines.some((l) => /-> ls exo_memory\//.test(l)), 'a command target must render intact');
  // and a qualified PATH target must keep BOTH its path and its qualifier. Caught by
  // dev/mutation/mutate-source.js on its first run: "ls exo_memory/" is immune to the shortener
  // by accident (it does not start with exo_memory/), so testing only that row let a real mutant
  // live. The BOOT rows are what the shortener would actually damage.
  assert.ok(sec.lines.some((l) => /-> exo_memory\/BOOT\.md \(/.test(l)), 'a qualified path target must survive whole');
});

test('a card with NO trigger is REPORTED — silence would read as coverage', () => {
  // The table's danger is looking complete. An orphan card is one that will not be reached at the
  // moment it applies, which is the whole defect this section exists to close.
  const sec = sb.sourceSection();
  const audit = sec.lines.filter((l) => /^NO TRIGGER for/.test(l));
  assert.strictEqual(audit.length, 1, 'the orphan audit line must be present');
  assert.match(audit[0], /\d+ card\(s\)/, 'and must carry a count');
});

test('a missing SOURCE.md FAILS LOUDLY rather than emitting an empty table', () => {
  // A silently absent index is indistinguishable from a room with nothing to point at.
  const src = fs.readFileSync(require.resolve('./state-block.js'), 'utf8');
  assert.match(src, /FAILED: ' \+ SRC \+ ' is absent/, 'absence must be reported');
  assert.match(src, /FAILED: no trigger rows parsed/, 'an unparseable file must be reported too');
});

test('every rendered trigger is a when -> target pair', () => {
  const sec = sb.sourceSection();
  const rows = sec.lines.filter((l) => l.startsWith('  '));
  assert.ok(rows.length >= 10, 'expected the trigger rows, got ' + rows.length);
  for (const r of rows) assert.match(r, /\S+ -> \S+/, 'row is not a pair: ' + r);
});
