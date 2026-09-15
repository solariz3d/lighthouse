// redact.test.js — run with: node dev/diversity/redact.test.js
//
// WHAT THIS GUARDS. R8b's blind (loop/anchor_similarity_registration_DRAFT_2026-09-15.md §8.9 STEP 0, §8.10 K6 as
// corrected at 5a62cd9): before a scorer sees a hand-back, the script removes pane letters, NATO callsigns, the
// arm-word list, packet filenames, every "§n", and shas. The failure is silent in both directions: a leak that
// survives unblinds a scorer, and a FIGURE that is removed destroys a claim (figures are a claim type). So the fixture
// fails on either. Line structure is pinned too, because every non-SILENT label cites a hand-back LINE.

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const R = require(path.join(__dirname, 'redact.js'));

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e && e.message}`); fail++; }
}

const WORDS = fs.readFileSync(path.join(__dirname, 'arm-words.txt'), 'utf8');
const red = (s) => R.redact(s, { words: R.parseWords(WORDS) });
const survives = (out, leak) => out.includes(leak);

const NATO = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'GOLF', 'HOTEL', 'INDIA', 'JULIETT', 'JULIET', 'KILO',
  'LIMA', 'MIKE', 'NOVEMBER', 'OSCAR', 'PAPA', 'QUEBEC', 'ROMEO', 'SIERRA', 'TANGO', 'UNIFORM', 'VICTOR', 'WHISKEY',
  'WHISKY', 'XRAY', 'X-RAY', 'YANKEE', 'ZULU'];

const SHA64 = '6eec779ddd76c2b067b182dc673688cf6b4f749f0721bfc8dd59c84b1a9dd6de';

// ── K6 FIXTURE: every named leak is gone ────────────────────────────────────────────────────────────────────────────

test('K6: "pane B", "[pane:B]", "B\'s", "B pane" are removed', () => {
  for (const leak of ['pane B', '[pane:B]', "B's", 'B pane']) {
    const out = red(`before ${leak} after`);
    assert.ok(!survives(out, leak), `survived: ${leak} -> ${out}`);
    assert.ok(!/\bB\b/.test(out), `the letter survived: ${out}`);
  }
});

test('K6: every pane letter A–Z, in each form, including a curly apostrophe and "pane:K" without brackets', () => {
  for (const L of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    for (const leak of [`pane ${L}`, `[pane:${L}]`, `pane:${L}`, `${L}'s`, `${L}’s`, `${L} pane`]) {
      const out = red(`x ${leak} y`);
      assert.ok(!new RegExp(`\\b${L}\\b`).test(out), `${leak} -> ${out}`);
    }
  }
});

test('K6: every NATO callsign, ALPHA … ZULU, in capitals and in Title case', () => {
  for (const c of NATO) {
    for (const form of [c, c[0] + c.slice(1).toLowerCase()]) {
      const out = red(`To ${form} and the chair`);
      assert.ok(!out.includes(form), `${form} -> ${out}`);
    }
  }
});

test('K6: every word on the committed arm-word list is removed, in any case', () => {
  const words = R.parseWords(WORDS);
  assert.ok(words.length >= 5, `the list has ${words.length} words`);
  for (const w of words) {
    for (const form of [w, w.toUpperCase(), w[0].toUpperCase() + w.slice(1)]) {
      const out = red(`one ${form} two`);
      assert.ok(!out.toLowerCase().includes(w.toLowerCase()), `${form} -> ${out}`);
    }
  }
});

test('STEP 0: the packet filename is removed, bare and as a path', () => {
  for (const leak of ['packet_leave_window_2026-09-14.md', 'loop/packet_leave_window_2026-09-14.md', 'exo_memory/loop/packet_harness_and_lib_2026-09-15.md']) {
    const out = red(`read ${leak} at c59530a`);
    assert.ok(!/packet_/.test(out), `${leak} -> ${out}`);
  }
});

test('STEP 0: every "§n" is removed — §2, §2.7, §8.10.1, §4.1\'s, §2.1–2.6, a bare §, and §RESUME', () => {
  for (const leak of ['§2', '§2.7', '§8.10.1', "§4.1's", '§2.1–2.6', '§ 5', '§', '§RESUME']) {
    const out = red(`see ${leak} here`);
    assert.ok(!out.includes('§'), `${leak} -> ${out}`);
    assert.ok(!/\d/.test(out), `a section number survived: ${leak} -> ${out}`);
    assert.ok(!/RESUME/.test(out), `${leak} -> ${out}`);
  }
});

test('K6 corrected: a full 64-character sha256 is removed', () => {
  assert.ok(!red(`sha256 ${SHA64} ok`).includes(SHA64.slice(0, 12)));
});

test('K6 corrected: 7- and 40-character shas are removed, in lower and UPPER case', () => {
  for (const sha of ['c59530a', 'ed73e76', '5a62cd92f1d0c3b4a5e6f7081920a3b4c5d6e7f8', 'C59530A', SHA64.toUpperCase()]) {
    const out = red(`at ${sha}.`);
    assert.ok(!out.toLowerCase().includes(sha.toLowerCase().slice(0, 7)), `${sha} -> ${out}`);
  }
});

test('K6 corrected: an abbreviated "<hex>…<hex>" sha is removed WHOLE — neither half survives', () => {
  for (const s of ['e7f6af7a…6509', '6eec779d…d6de', '0F440DCE…2607']) {
    const out = red(`sha256 ${s} sealed`);
    const [head, tail] = s.split('…');
    assert.ok(!out.includes(head) && !out.includes(tail) && !out.includes('…'), `${s} -> ${out}`);
  }
});

test('STEP 0: the fixture leaves nothing matching the leak check (K6\'s sha pattern in place of {7,40}, see the hand-back)', () => {
  const fixture = [
    'Pane A, machine D. [pane:B] rang; pane E\'s build at c59530a; B pane read §2.7 of packet_leave_window_2026-09-14.md.',
    `To ECHO and ALPHA, with BRAVO reading §2 FIRST. sha256 ${SHA64}, sealed 6eec779d…d6de, commit ED73E76.`,
    "K's map/K.md and p-leave-read-B_2026-09-14.md; RULED (E): the briefed arm got the packet from the chair.",
  ].join('\n');
  const out = red(fixture);
  assert.deepStrictEqual(R.leaks(out, R.parseWords(WORDS)), [], out);
});

test('the leak check is not vacuous: on UNredacted text it finds every form the fixture names', () => {
  const words = R.parseWords(WORDS);
  for (const leak of ['pane B', '[pane:B]', "B's", 'B pane', 'ALPHA', 'Echo', 'packet_leave_window_2026-09-14.md', '§2.7',
    SHA64, 'c59530a', 'e7f6af7a…6509', 'p-leave-read-B_2026-09-14.md', 'map/K.md', 'RULED (E):', words[0]]) {
    assert.ok(R.leaks(`x ${leak} y`, words).length > 0, `the check misses: ${leak}`);
  }
  for (const keep of ['defaced', 'effaced', '348026190', '1757000000', 'A seat', 'a pane']) {
    assert.deepStrictEqual(R.leaks(`x ${keep} y`, words), [], `the check flags a keeper: ${keep}`);
  }
});

// ── K6 FIXTURE: figures and hex-letter English words SURVIVE ────────────────────────────────────────────────────────

test('K6: "defaced", "effaced", "348026190" and "1757000000" survive', () => {
  for (const keep of ['defaced', 'effaced', '348026190', '1757000000']) {
    assert.ok(red(`the ${keep} one`).includes(keep), `removed: ${keep}`);
  }
});

test('figures of every shape used in these texts survive: 348,026,190 B · 55 s · 664/1/4 · 0.271 · 12:41:31 · :10885 · 2026-09-14', () => {
  const line = 'first carry 348,026,190 B in 55 s; cargo 664/1/4; P 0.271 at 12:41:31; main.rs:10885 on 2026-09-14; 18,508 B';
  const out = red(line);
  for (const keep of ['348,026,190', '55 s', '664/1/4', '0.271', '12:41:31', 'main.rs:10885', '2026-09-14', '18,508']) {
    assert.ok(out.includes(keep), `removed: ${keep} -> ${out}`);
  }
});

test('ordinary English stays: "A seat", "a pane", "I", "decade", "facade", lower-case "echo" and "delta" in code', () => {
  const line = 'A seat that is alive; a pane finishes; I read it; a decade; the facade; run `echo` and a delta.';
  assert.strictEqual(red(line), line);
});

test('a path:line citation keeps its line number', () => {
  const line = '`tail-carry.js:739-748`, `main.rs:922-926` and `stick-waiter.js:275-277`';
  assert.strictEqual(red(line), line);
});

// Direct, with expected strings written here — leaks() shares redact()'s patterns, so a pattern dropped from both would
// pass any check that goes through leaks(). These do not.
test('exact outputs: "[pane:B]" is ONE token (no "[[…]]" shape left), and the filename, map and ruling-owner letters go', () => {
  const T = R.TOKEN;
  assert.strictEqual(red('[pane:B]'), T);
  assert.strictEqual(red('handback/p-leave-read-B_2026-09-14.md'), `handback/p-leave-read-${T}_2026-09-14.md`);
  assert.strictEqual(red('exo_memory/map/K.md'), `exo_memory/map/${T}.md`);
  assert.strictEqual(red('RULED (E): keep'), `RULED ${T}: keep`);
});

test('parseWords returns the bare words, with no reason and no "#" left on any', () => {
  const words = R.parseWords(WORDS);
  assert.ok(words.includes('briefed') && words.includes('packet'), words.join(','));
  for (const w of words) assert.doesNotMatch(w, /#|\s/, w);
});

// ── the two forms a real control carries that K6 does not name (p-leave-read-B_2026-09-14.md:1, :3) ───────────────

test('"B (pane `12fb81f6`)" — a letter before "(pane" is removed, and the pane id with it', () => {
  const out = red('**B (pane `12fb81f6`), lap D063, machine D');
  assert.ok(!/\bB\b/.test(out) && !out.includes('12fb81f6'), out);
  assert.ok(out.includes('machine D'), `the machine letter is not a pane form: ${out}`);
});

test('--letters: bare seat letters are removed only when named — "— B, before A and E build" with letters B,E', () => {
  const words = R.parseWords(WORDS);
  const out = R.redact('# read FIRST — B, before E build; B wrote it.', { words, letters: ['B', 'E'] });
  assert.ok(!/\b[BE]\b/.test(out), out);
  assert.strictEqual(R.redact('— B, before E build', { words }), '— B, before E build', 'bare letters are removed without --letters');
});

test('--letters keeps what only LOOKS like a bare letter: a byte unit, a ruling id, a drive, an initial inside a word', () => {
  const words = R.parseWords(WORDS);
  const line = '348,026,190 B in 55 s; D-2 and E-1; B2-1; the E: drive; B.md; ABE; U_neg';
  assert.strictEqual(R.redact(line, { words, letters: ['B', 'D', 'E'] }), line);
});

test('--letters refuses A and I: they are English words, and removing them bare would destroy sentences', () => {
  for (const L of ['A', 'I']) assert.throws(() => R.redact('x', { letters: [L] }), /A and I/);
});

// ── structure: labels cite LINES ────────────────────────────────────────────────────────────────────────────────────

test('the line count and the line order are unchanged, whatever is removed', () => {
  const text = ['[pane:B]', '§2.7', '', `${SHA64}`, 'ALPHA', 'keep me', 'pane\nB'].join('\n');
  const out = red(text);
  assert.strictEqual(out.split('\n').length, text.split('\n').length);
  assert.strictEqual(out.split('\n')[5], 'keep me');
});

test('a match never spans a line break ("pane" then "B" on the next line is not "pane B")', () => {
  assert.strictEqual(red('the pane\nB then'), 'the pane\nB then');
});

test('every removal is the ONE neutral token, so the kind of thing removed is not told', () => {
  const out = red(`pane B · §2.7 · ${SHA64.slice(0, 7)} · ALPHA · packet_x.md`);
  assert.strictEqual(out, `${R.TOKEN} · ${R.TOKEN} · ${R.TOKEN} · ${R.TOKEN} · ${R.TOKEN}`);
});

test('redaction is idempotent, and the token itself is never a leak', () => {
  const once = red(`[pane:B] B's §2 ${SHA64} ECHO packet_a.md chair`);
  assert.strictEqual(red(once), once);
  assert.deepStrictEqual(R.leaks(R.TOKEN, R.parseWords(WORDS)), []);
});

// ── the word list file ──────────────────────────────────────────────────────────────────────────────────────────────

test('arm-words.txt: every non-comment line is one entry with its reason after " # ", and no entry is a figure', () => {
  const lines = WORDS.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
  for (const l of lines) {
    assert.match(l, /^\S.*? # \S/, `no reason given: ${l}`);
    assert.doesNotMatch(l.split(' # ')[0], /\d/, `a figure on the list: ${l}`);
  }
  assert.strictEqual(R.parseWords(WORDS).length, lines.length);
});

// ── the command line ────────────────────────────────────────────────────────────────────────────────────────────────

test('CLI: node redact.js <in> writes the redacted text to stdout and uses arm-words.txt beside it', () => {
  const { execFileSync } = require('child_process');
  const os = require('os');
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'redact-')), 'in.md');
  fs.writeFileSync(tmp, 'pane B read §2.7 in the brief\n348026190\n');
  const out = execFileSync(process.execPath, [path.join(__dirname, 'redact.js'), tmp], { encoding: 'utf8', windowsHide: true });
  assert.strictEqual(out, red('pane B read §2.7 in the brief\n348026190\n'));
  assert.ok(out.includes('348026190') && !/pane B|§|brief/.test(out), out);
});

test('CLI: --letters B,E strips bare B and E; --letters A is refused with exit 2', () => {
  const { spawnSync } = require('child_process');
  const os = require('os');
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'redact-')), 'in.md');
  fs.writeFileSync(tmp, '— B, before E build; 190 B\n');
  const run = (...a) => spawnSync(process.execPath, [path.join(__dirname, 'redact.js'), tmp, ...a], { encoding: 'utf8', windowsHide: true });
  const ok = run('--letters', 'B,E');
  assert.strictEqual(ok.status, 0, ok.stderr);
  assert.strictEqual(ok.stdout, `— ${R.TOKEN}, before ${R.TOKEN} build; 190 B\n`);
  const bad = run('--letters', 'A');
  assert.strictEqual(bad.status, 2);
  assert.match(bad.stderr, /A and I/);
});

console.log(`\n  ${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
