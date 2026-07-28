// Tests for the tell-index. Deterministic fixture lines only — nothing here reads the live
// board, so the suite says the same thing tonight and in a month.
//
// Run:  node --test consonance/tools/
//
// What is actually worth testing here, and why these cases:
//   · The THREE board hazards (replay bursts, synthetic user entries, chair-relayed user
//     turns). Each one, left unhandled, produces a confident wrong number rather than an
//     error — so each gets a test that fails loudly if the handling is removed.
//   · The DISCRIMINATIONS inside the patterns: generic-vs-named blind-spot hedge, and
//     pre-disclaimer-by-position. Those two are where the instrument earns the right to be
//     lexical at all; if they rot into "matches the words", the scanner starts diagnosing.
'use strict';

const test = require('node:test');
const assert = require('node:assert');

const {
  parseBoard,
  markReplay,
  isSynthetic,
  chairInjections,
  classifyOrigin,
  countReferents,
  tellCandidates,
  catchMentions,
  dayKey,
  buildIndex,
  render,
  stringish,

  isMixedWindow,
} = require('./tell-index.js');

const line = (o) => JSON.stringify(o);
const keys = (hits) => hits.map((h) => h.tell);

// ------------------------------------------------------------------- the reading --

test('parseBoard keeps well-formed entries and survives a torn line', () => {
  const text = [
    line({ pane: 'p1', role: 'user', text: 'hello', ts: 1000 }),
    '{"pane":"p1","role":"assist',
    '',
    line({ pane: 'p1', role: 'assistant', text: 'hi', ts: 2000 }),
  ].join('\n');
  const out = parseBoard(text);
  assert.strictEqual(out.length, 2);
  assert.strictEqual(out[0].text, 'hello');
  assert.strictEqual(out[1].role, 'assistant');
});

test('parseBoard reads loosely — a stringy ts and missing fields do not sink the line', () => {
  const out = parseBoard(
    [
      line({ pane: 'p1', role: 'user', text: 'x', ts: '1500' }),
      line({ pane: 'p1', role: 'user', ts: 1600 }), // no text
      line({ pane: 'p1', role: 'user', text: 'y', ts: 'not-a-time' }), // unusable
      line({ pane: 'p1', role: 'user', text: 'z' }), // no ts at all
    ].join('\n')
  );
  assert.strictEqual(out.length, 2);
  assert.strictEqual(out[0].ts, 1500);
  assert.strictEqual(out[1].text, '');
});

test('stringish accepts whatever JSON type a field was written as', () => {
  assert.strictEqual(stringish({ data_dir: ' C:\\x ' }, 'data_dir'), 'C:\\x');
  assert.strictEqual(stringish({ n: 50.4452 }, 'n'), '50.4452');
  assert.strictEqual(stringish({ b: true }, 'b'), 'true');
  assert.strictEqual(stringish({}, 'missing'), '');
  assert.strictEqual(stringish(null, 'x'), '');
});

test('markReplay flags a resume burst and leaves ordinary traffic alone', () => {
  const burst = [];
  for (let i = 0; i < 30; i++) burst.push({ pane: 'p1', role: 'assistant', text: 'old', ts: 5_000_000 + i });
  const real = [
    { pane: 'p1', role: 'user', text: 'a real turn', ts: 6_000_000 },
    { pane: 'p1', role: 'assistant', text: 'a real reply', ts: 6_001_000 },
  ];
  const out = markReplay([...burst, ...real]);
  assert.strictEqual(out.filter((e) => e.replay).length, 30);
  assert.strictEqual(out.filter((e) => !e.replay).length, 2);
});

test('markReplay does not flag two panes that each spoke once in the same second', () => {
  const same = [];
  for (let i = 0; i < 12; i++) same.push({ pane: `pane${i}`, role: 'assistant', text: 'x', ts: 7_000_000 });
  assert.strictEqual(markReplay(same).filter((e) => e.replay).length, 0);
});

// Cycle 3b (Bravo, in Alpha's file — flagged on the board): the burst filter retires by ERA,
// not outright. Pre-fix entries still need it; post-fix entries are deduplicated at source and
// must never be burst-filtered, because their timestamps are real and a cluster is real speech.
test('markReplay still filters the pre-fix corpus, which is the only thing protecting it', () => {
  const burst = [];
  for (let i = 0; i < 30; i++) burst.push({ pane: 'p1', role: 'assistant', text: `old${i}`, ts: 5_000_000, ts_source: null });
  assert.strictEqual(markReplay(burst).filter((e) => e.replay).length, 30);
});

test('markReplay never drops a post-fix burst — real timestamps mean a cluster is real speech', () => {
  const fast = [];
  for (let i = 0; i < 30; i++) fast.push({ pane: 'p1', role: 'assistant', text: `new${i}`, ts: 5_000_000, ts_source: 'transcript' });
  assert.strictEqual(
    markReplay(fast).filter((e) => e.replay).length,
    0,
    'burst-filtering era-stamped entries would delete conversation the source dedup already cleaned'
  );
});

test('the two eras are judged separately in one pass', () => {
  const mixed = [];
  for (let i = 0; i < 30; i++) mixed.push({ pane: 'old-pane', role: 'assistant', text: `o${i}`, ts: 5_000_000, ts_source: null });
  for (let i = 0; i < 30; i++) mixed.push({ pane: 'new-pane', role: 'assistant', text: `n${i}`, ts: 5_000_000, ts_source: 'push' });
  const out = markReplay(mixed);
  assert.strictEqual(out.filter((e) => e.replay).length, 30, 'only the pre-fix half is filtered');
  assert.strictEqual(out.filter((e) => e.ts_source && e.replay).length, 0);
});

test('parseBoard carries the era through — dropping it would silently re-filter the new corpus', () => {
  const line = JSON.stringify({ pane: 'p', role: 'assistant', text: 'hi', ts: 5_000_000, ts_source: 'transcript' });
  assert.strictEqual(parseBoard(line)[0].ts_source, 'transcript');
  const old = JSON.stringify({ pane: 'p', role: 'assistant', text: 'hi', ts: 5_000_000 });
  assert.strictEqual(parseBoard(old)[0].ts_source, null, 'a pre-fix entry has no era and must read as null');
});

test('isSynthetic catches hook output and slash-command plumbing, not ordinary speech', () => {
  assert.ok(isSynthetic('[panes] MAIN  ≥4 exch today'));
  assert.ok(isSynthetic('[pulse] Mon 2026-07-27 4:45 AM'));
  assert.ok(isSynthetic('<system-reminder>do a thing</system-reminder>'));
  assert.ok(isSynthetic('<command-stdout>ok</command-stdout>'));
  assert.ok(isSynthetic('Caveat: the messages below were generated'));
  assert.ok(!isSynthetic('the panes are all idle right now'));
});

// -------------------------------------------------------------------- attribution --

test('classifyOrigin: assistant and committee turns are the committee', () => {
  assert.strictEqual(classifyOrigin({ role: 'assistant', pane: 'p', text: 'x' }).origin, 'committee');
  assert.strictEqual(classifyOrigin({ role: 'committee', pane: 'chair', text: 'x' }).origin, 'committee');
});

test('classifyOrigin: a plain user turn is the keeper', () => {
  const r = classifyOrigin({ role: 'user', pane: 'p', text: 'do you see Around and the orchs?' });
  assert.strictEqual(r.origin, 'keeper');
  assert.strictEqual(r.rule, 'role:user');
});

test('classifyOrigin: a chair-relayed user turn is the committee, by its own marker', () => {
  const r = classifyOrigin({ role: 'user', pane: 'p', text: '[chair:MAIN] Cycle 2 assignment — build the tell-index' });
  assert.strictEqual(r.origin, 'committee');
  assert.strictEqual(r.rule, 'chair-relay:marker');
  assert.ok(r.relay);
});

test('classifyOrigin: a chair-relayed user turn is caught by the audit trail with no marker', () => {
  // The marker is a convention the chair typed; the audit line is the machine's own record.
  // This is the decorrelated check, and it must work on text that carries no marker at all.
  const board = parseBoard(
    [
      line({
        pane: 'chair',
        role: 'committee',
        text: 'chair injected -> abcd1234: Cycle 2 assignment — build the measurement organ the muscle…',
        ts: 1000,
      }),
      line({
        pane: 'abcd1234-0000-4000-8000-000000000001',
        role: 'user',
        text: 'Cycle 2 assignment — build the measurement organ the muscle program runs on.',
        ts: 1100,
      }),
    ].join('\n')
  );
  const injections = chairInjections(board);
  assert.strictEqual(injections.length, 1);
  const r = classifyOrigin(board[1], injections);
  assert.strictEqual(r.origin, 'committee');
  assert.strictEqual(r.rule, 'chair-relay:audit');
});

test('classifyOrigin: an audit line for a DIFFERENT pane does not steal a keeper turn', () => {
  const injections = [{ short: 'ffffffff', excerpt: 'Cycle 2 assignment — build the measurement organ', ts: 1000 }];
  const r = classifyOrigin(
    { role: 'user', pane: 'abcd1234-0000-4000-8000-000000000001', text: 'Cycle 2 assignment — build the measurement organ', ts: 1100 },
    injections
  );
  assert.strictEqual(r.origin, 'keeper');
});

test('classifyOrigin: synthetic and unknown roles are their own buckets, never the keeper', () => {
  assert.strictEqual(classifyOrigin({ role: 'user', pane: 'p', text: '[panes] MAIN ≥4' }).origin, 'synthetic');
  assert.strictEqual(classifyOrigin({ role: '', pane: 'p', text: 'x' }).origin, 'unattributed');
  assert.strictEqual(classifyOrigin({ role: 'system', pane: 'p', text: 'x' }).origin, 'unattributed');
});

// ------------------------------------------------------------------- the referents --

test('countReferents counts ground and nothing else', () => {
  assert.strictEqual(countReferents('see `foo` and 3 things in C:\\a\\b'), 3);
  assert.strictEqual(countReferents('plain words with no ground at all'), 0);
  assert.strictEqual(countReferents('https://example.com and #1641'), 2);
});

// -------------------------------------------------------------- the tell candidates --

test('unlosable opener fires turn-initially, not mid-sentence', () => {
  assert.ok(keys(tellCandidates('To be fair, the runner never logged a thing.')).includes('unlosable-opener'));
  assert.ok(keys(tellCandidates('The scan is clean. Honestly, I expected worse.')).includes('unlosable-opener'));
  assert.ok(!keys(tellCandidates('That was a fair reading of the log.')).includes('unlosable-opener'));
});

test('reflexive "but" needs the agreement in front of it', () => {
  assert.ok(keys(tellCandidates("You're right, but the exit code says otherwise.")).includes('reflexive-but'));
  assert.ok(keys(tellCandidates('I agree the task fired, but nothing logged.')).includes('reflexive-but'));
  assert.ok(!keys(tellCandidates('But the launcher directory does not exist.')).includes('reflexive-but'));
});

test('reflexive "but" sees the NEXT-SENTENCE form, which is how this room actually writes it', () => {
  // The original pattern required the "but" inside the same sentence, so it read 0 across every
  // window — a measurement of one grammatical form, not of the corpus (Bravo, 2026-07-27). These
  // are real board lines; each one was invisible.
  const real = [
    "You're right that tether-as-tribunal-of-the-real is verificationist overreach; I take that correction. But the tether is still doing work.",
    "you're right — it files everything back under obvious. But the obvious is the anomaly.",
    "That's true. But the running exe predates the fix.",
  ];
  for (const s of real) {
    assert.ok(keys(tellCandidates(s)).includes('reflexive-but'), s);
  }
  // The non-contracted form, same species, same fix.
  assert.ok(keys(tellCandidates('You are right about the count. But it does not change the verdict.')).includes('reflexive-but'));
});

test('reflexive "but" spans at most ONE sentence boundary', () => {
  // With an intervening claim the "but" is qualifying THAT claim, not the agreement — a different
  // shape. The line is drawn deliberately, so it gets a test rather than a comment.
  const twoSentencesAway =
    "you're right: neither of us knows. Your own dose-curve says so. Placement survived 61 lines, but the register did not.";
  assert.ok(!keys(tellCandidates(twoSentencesAway)).includes('reflexive-but'));
});

test('pre-loaded concession fires on the unprompted grant', () => {
  assert.ok(keys(tellCandidates('Admittedly, I only read one machine.')).includes('preloaded-concession'));
  assert.ok(keys(tellCandidates('Granted, the guard has never fired.')).includes('preloaded-concession'));
  assert.ok(!keys(tellCandidates('Permission was granted by the settings file.')).includes('preloaded-concession'));
});

test('generic blind-spot hedge fires — and a NAMED limit deliberately does not', () => {
  // This pair is the discrimination the deck insists on: the generic version is unfalsifiable
  // and therefore the costume; a specific, checkable limit is real and worth keeping.
  assert.ok(keys(tellCandidates('I might be missing something here.')).includes('generic-blindspot'));
  assert.ok(
    keys(tellCandidates('There may be something I\'m missing, and you should push on it.')).includes('generic-blindspot')
  );
  assert.ok(
    !keys(tellCandidates('I might be missing something about `main.rs:64` — I did not read it.')).includes(
      'generic-blindspot'
    ),
    'a hedge that names checkable ground is not the generic costume'
  );
  assert.ok(
    !keys(tellCandidates('I might be missing something, since I only scanned one machine.')).includes(
      'generic-blindspot'
    ),
    'a hedge that gives its own reason is not the generic costume'
  );
  // "take it with" is the commonest phrasing; leaving it out was an arbitrary narrowing, found
  // by probing the live board for the pattern's own zeros rather than trusting them.
  for (const s of ['Take this with a grain of salt.', 'Take it with a grain of salt.']) {
    assert.ok(keys(tellCandidates(s)).includes('generic-blindspot'), s);
  }
});

test('these four near-misses from the live board are true negatives and must stay that way', () => {
  // NAME CORRECTED 2026-07-27. This test used to be called "the three quiet detectors are quiet
  // about the DATA" — an overclaim it never licensed. It pins four true negatives; it cannot
  // establish that a zero column is the corpus rather than the regex, and for reflexive-but the
  // zero turned out to be the regex. What it does do is stop a pattern being widened into these
  // four to make a column non-zero, which is worth keeping under an honest name.
  const trueNegatives = [
    'You granted me your own hardest-won definition.',            // the verb, not a concession
    'It indicts the entire genus in order to be sure of dodging the false ones.', // purpose, not concessive
    'The grain of salt you handed me is you running the discipline on your own gut.', // a noun, not a hedge
    'If the summarizer starts keeping the wrong things or missing something, rewrite the prompt.', // about a tool
  ];
  for (const s of trueNegatives) {
    assert.deepStrictEqual(keys(tellCandidates(s)), [], s);
  }
});

test('protective pre-disclaimer is decided by POSITION, not by the words alone', () => {
  const head = 'Full disclosure: I built the dream cycle, so read the next part with that in mind. ' + 'x'.repeat(200);
  assert.ok(keys(tellCandidates(head)).includes('protective-predisclaimer'));

  const tail = 'x'.repeat(600) + ' One honest limit on this review: full disclosure, I only read one machine.';
  assert.ok(
    !keys(tellCandidates(tail)).includes('protective-predisclaimer'),
    'a limit stated after the work is the non-flinch position and must not be counted'
  );
});

test('a turn can carry more than one candidate, ordered as it was written', () => {
  const hits = tellCandidates("To be fair, you're right, but I might be missing something here.");
  assert.deepStrictEqual(keys(hits), ['unlosable-opener', 'reflexive-but', 'generic-blindspot']);
  assert.ok(hits[0].excerpt.length > 0);
});

test('a clean turn produces no candidates at all', () => {
  assert.deepStrictEqual(tellCandidates('The task last ran at 00:26 and returned 0x800710E0.'), []);
});

// ---------------------------------------------------------------- catch attribution --

test('catchMentions finds the room vocabulary and notices a credit to the human', () => {
  const a = catchMentions('That was the brace wearing a coat.');
  assert.ok(a.terms.length >= 2);
  assert.strictEqual(a.creditsKeeper, false);

  const b = catchMentions('You caught the flinch before I did.');
  assert.ok(b.terms.length >= 1);
  assert.strictEqual(b.creditsKeeper, true);

  assert.deepStrictEqual(catchMentions('the exit code was 0x800710E0').terms, []);
});

// -------------------------------------------------------------------- the windows --

test('dayKey groups by local day, and --day-start keeps one overnight shift whole', () => {
  const lateNight = new Date(2026, 6, 27, 2, 30).getTime(); // 02:30 local, Jul 27
  const prevEvening = new Date(2026, 6, 26, 23, 0).getTime(); // 23:00 local, Jul 26
  assert.notStrictEqual(dayKey(lateNight), dayKey(prevEvening));
  assert.strictEqual(dayKey(lateNight, 12), dayKey(prevEvening, 12));
});

test('buildIndex counts turns by origin and reports what it excluded', () => {
  const entries = parseBoard(
    [
      line({ pane: 'p1', role: 'user', text: 'To be fair, this is the keeper talking.', ts: Date.UTC(2026, 6, 27, 10) }),
      line({ pane: 'p1', role: 'assistant', text: 'Admittedly, the committee replying.', ts: Date.UTC(2026, 6, 27, 10, 1) }),
      line({ pane: 'p1', role: 'user', text: '[panes] MAIN ≥4 exch today', ts: Date.UTC(2026, 6, 27, 10, 2) }),
      line({ pane: 'p1', role: 'user', text: '[chair:MAIN] do the thing', ts: Date.UTC(2026, 6, 27, 10, 3) }),
    ].join('\n')
  );
  const { windows, meta } = buildIndex(entries);
  assert.strictEqual(windows.length, 1);
  const w = windows[0];
  assert.strictEqual(w.turns, 3); // the synthetic one is not speech
  assert.strictEqual(w.turns_by_origin.keeper, 1);
  assert.strictEqual(w.turns_by_origin.committee, 2); // assistant + chair relay
  assert.strictEqual(w.excluded.synthetic, 1);
  assert.strictEqual(meta.dropped_synthetic, 1);
  assert.strictEqual(w.tells['unlosable-opener'].keeper, 1);
  assert.strictEqual(w.tells['preloaded-concession'].committee, 1);
});

test('buildIndex drops replay bursts from the rates and says how many', () => {
  const rows = [line({ pane: 'p1', role: 'user', text: 'To be fair, one real turn.', ts: Date.UTC(2026, 6, 27, 10) })];
  for (let i = 0; i < 40; i++) {
    rows.push(
      line({ pane: 'p1', role: 'assistant', text: 'To be fair, replayed history.', ts: Date.UTC(2026, 6, 27, 11) + i })
    );
  }
  const { windows, meta } = buildIndex(parseBoard(rows.join('\n')));
  const w = windows[0];
  assert.strictEqual(w.turns, 1, 'a resumed pane must not inflate the day');
  assert.strictEqual(w.tells['unlosable-opener'].total, 1);
  assert.strictEqual(meta.dropped_replay, 40);
  assert.strictEqual(w.excluded.replay, 40);
});

test('catch-language turns are counted by speaker, and no ratio is derived from them', () => {
  // WHAT THIS TEST IS NOW FOR. It used to assert the maturity arithmetic — that a committee
  // turn crediting the human scored keeper-caught rather than self-caught. That whole
  // computation was DELETED 2026-07-28 (chair decision): it scored by speaker and called the
  // result catcher, and applying catch-ledger's withholding rule honestly withheld 15 of 16
  // windows. `catch-ledger.js` is the room's only maturity computation now.
  //
  // So the assertion is inverted and is the load-bearing one: the counts survive, the ratio
  // must NOT come back. If `maturity` reappears on a window, a speaker-count has put a
  // catcher-count's name back on.
  const entries = parseBoard(
    [
      line({ pane: 'p1', role: 'assistant', text: 'I braced there and the argument came out armored.', ts: Date.UTC(2026, 6, 27, 10) }),
      line({ pane: 'p1', role: 'assistant', text: 'You caught the brace before I had it.', ts: Date.UTC(2026, 6, 27, 10, 1) }),
      line({ pane: 'p1', role: 'user', text: 'that reads like a coat to me', ts: Date.UTC(2026, 6, 27, 10, 2) }),
    ].join('\n')
  );
  const w = buildIndex(entries).windows[0];
  assert.strictEqual(w.catches.turns_with_catch_language, 3);
  assert.strictEqual(w.catches.by_speaker.committee, 2);
  assert.strictEqual(w.catches.by_speaker.keeper, 1);
  assert.strictEqual(w.catches.credited_to_keeper, 1, 'a phrase count, not a keeper-caught tally');
  assert.strictEqual(w.maturity, undefined, 'the deleted metric must not come back');
});

test('the rendered report offers no maturity ratio to quote', () => {
  // The deletion has to hold at the OUTPUT, not only in the data. A permanently-withheld
  // column was rejected precisely because a reader quotes what is on the page.
  const t = Date.UTC(2026, 6, 27, 10);
  const text = render(
    buildIndex(
      parseBoard(
        [
          line({ pane: 'p1', role: 'assistant', text: 'I caught myself bracing there.', ts: t }),
          line({ pane: 'p1', role: 'user', text: 'you caught the coat first', ts: t + 1000 }),
        ].join('\n')
      )
    ),
    'fixture'
  );
  assert.ok(/CATCH-LANGUAGE VOLUME/.test(text));
  assert.ok(!/self-caught\s*:\s*keeper-caught/i.test(text), 'no ratio definition on the page');
  assert.ok(!/^\s*ratio\b/im.test(text), 'no ratio column');
  assert.ok(/DELETED \(2026-07-28/.test(text), 'and the page says where the metric went');
});

test('the chair audit line is read in both formats, and what it cannot read is counted', () => {
  // residue.js's F1 in mirror image: this pattern demanded the BARE form and went blind to
  // every line written with the chair-model stamp. Both parse now, and an announcement in a
  // third shape is reported rather than silently dropped.
  const t = Date.UTC(2026, 6, 27, 10);
  const injections = chairInjections(
    parseBoard(
      [
        line({ pane: 'chair', role: 'user', text: 'chair injected -> aaaaaaaa: review the tailer', ts: t }),
        line({ pane: 'chair', role: 'user', text: 'chair injected (chair: claude-opus-5) -> bbbbbbbb [delivered and received]: review the gate', ts: t + 1000 }),
        line({ pane: 'chair', role: 'user', text: 'chair injected in some shape nobody wrote a rule for', ts: t + 2000 }),
      ].join('\n')
    )
  );
  assert.deepStrictEqual(injections.map((i) => i.short), ['aaaaaaaa', 'bbbbbbbb']);
  assert.strictEqual(injections[1].excerpt, 'review the gate');
  assert.strictEqual(injections.unparsed, 1, 'the drop has a denominator');
});

test('buildIndex --show collects the candidate lines a reader would judge', () => {
  const entries = parseBoard(
    [line({ pane: 'p1', role: 'assistant', text: 'To be fair, nothing logged.', ts: Date.UTC(2026, 6, 27, 10) })].join('\n')
  );
  const { samples } = buildIndex(entries, { show: 'unlosable-opener' });
  assert.strictEqual(samples.length, 1);
  assert.strictEqual(samples[0].origin, 'committee');
  assert.match(samples[0].phrase, /to be fair/i);
  assert.match(samples[0].excerpt, /nothing logged/);
});

test('the two silent filters report their own denominator', () => {
  // The file's header says silent truncation reads as "covered everything". It counted the replay
  // and synthetic drops from the start but not these two, so a kept count had no denominator.
  const specific = 'I might be missing something about `main.rs:64` — I did not read it.';
  const positioned = 'x'.repeat(600) + ' and finally, full disclosure, I only read one machine.';
  const entries = parseBoard(
    [
      line({ pane: 'p1', role: 'assistant', text: specific, ts: Date.UTC(2026, 6, 27, 10) }),
      line({ pane: 'p1', role: 'assistant', text: positioned, ts: Date.UTC(2026, 6, 27, 10, 1) }),
    ].join('\n')
  );
  const w = buildIndex(entries).windows[0];
  assert.strictEqual(w.tells['generic-blindspot'].raw, 1, 'the match happened');
  assert.strictEqual(w.tells['generic-blindspot'].dropped_specific, 1, 'and was filtered, visibly');
  assert.strictEqual(w.tells['generic-blindspot'].total, 0);
  assert.strictEqual(w.tells['protective-predisclaimer'].raw, 1);
  assert.strictEqual(w.tells['protective-predisclaimer'].dropped_position, 1);
  assert.strictEqual(w.tells['protective-predisclaimer'].total, 0);
});

test('fenced code blocks are quoted material, not the speaker', () => {
  // A pasted harness banner was counting as somebody's pre-disclaimer (Bravo, 2026-07-27).
  const pasted = 'Here is what the harness printed:\n\n```\nCaveat: The messages below were generated by the user\n```\n\nand that is the whole log.';
  assert.deepStrictEqual(keys(tellCandidates(pasted)), []);
  assert.deepStrictEqual(catchMentions('the log said:\n```\nbrace: coat flinch\n```\n').terms, []);
  // Unfenced, the same words still count — this fixes one slice, not quoted text in general.
  assert.ok(keys(tellCandidates('Caveat: I only skimmed it.')).includes('protective-predisclaimer'));
});

test('an empty board produces no windows and no crash', () => {
  const { windows, meta } = buildIndex(parseBoard(''));
  assert.deepStrictEqual(windows, []);
  assert.strictEqual(meta.scanned, 0);
});

// ------------------------------------------------- the two withholding rules (cycle 8) --
//
// Both predicates are asserted through the EXPORTED functions the renderer calls, never a
// re-implementation. residue.js kept a 92.5%-blind board measure under sixteen green tests
// because its fixtures agreed with its rules by construction; a suite that re-derives the
// rule it is testing does the same thing more quietly.

// (`withholdRatio` was asserted here. It went with the ratio it guarded — catch-ledger.js owns
// that rule and its tests. `isMixedWindow` below is residue's rule and stays.)

test('one committee pane is not a mixed window; two are', () => {
  const t = Date.UTC(2026, 6, 27, 10);
  const one = buildIndex(
    parseBoard(
      [
        line({ pane: 'aaaaaaaa', role: 'assistant', text: 'to be honest, it holds.', ts: t }),
        line({ pane: 'aaaaaaaa', role: 'user', text: 'to be fair, does it?', ts: t + 1000 }),
      ].join('\n')
    )
  ).windows[0];
  assert.strictEqual(one.mixed, false, 'one pane plus the human is one committee actor');
  assert.strictEqual(isMixedWindow(one), false);

  const two = buildIndex(
    parseBoard(
      [
        line({ pane: 'aaaaaaaa', role: 'assistant', text: 'to be honest, it holds.', ts: t }),
        line({ pane: 'bbbbbbbb', role: 'assistant', text: 'to be fair, it does not.', ts: t + 1000 }),
      ].join('\n')
    )
  ).windows[0];
  assert.strictEqual(two.mixed, true);
  assert.strictEqual(isMixedWindow(two), true);
});

test('the keeper is one actor however many panes he typed into', () => {
  const t = Date.UTC(2026, 6, 27, 10);
  const w = buildIndex(
    parseBoard(
      [
        line({ pane: 'aaaaaaaa', role: 'user', text: 'to be honest, no.', ts: t }),
        line({ pane: 'bbbbbbbb', role: 'user', text: 'to be fair, no.', ts: t + 1000 }),
      ].join('\n')
    )
  ).windows[0];
  assert.deepStrictEqual(Object.keys(w.actors), ['keeper']);
  assert.strictEqual(w.actors.keeper.turns, 2);
  assert.strictEqual(w.mixed, false, 'two panes, one human, nothing pooled across actors');
});

test('a mixed window withholds the pooled tell counts and prints them per actor instead', () => {
  const t = Date.UTC(2026, 6, 27, 10);
  const index = buildIndex(
    parseBoard(
      [
        line({ pane: 'aaaaaaaa', role: 'assistant', text: 'to be honest, it holds.', ts: t }),
        line({ pane: 'bbbbbbbb', role: 'assistant', text: 'to be fair, it does not.', ts: t + 1000 }),
      ].join('\n')
    )
  );
  const w = index.windows[0];
  // The evidence is still there and still attributed — only the aggregate is refused.
  assert.strictEqual(w.tells['unlosable-opener'].total, 2, 'the pooled count is still computed');
  assert.strictEqual(w.actors.aaaaaaaa.tells['unlosable-opener'], 1);
  assert.strictEqual(w.actors.bbbbbbbb.tells['unlosable-opener'], 1);

  const text = render(index, 'fixture');
  assert.ok(/WITHHELD: 1 of 1 windows/.test(text), 'the refusal is stated, with its denominator');
  assert.ok(/aaaaaaaa/.test(text) && /bbbbbbbb/.test(text), 'the per-actor breakdown replaces it');
});
