// JS-SUITE: MACHINE-BOUND home=L root=CONSONANCE_DATA
//
// These assertions are ABOUT one corpus, and are meaningless over another.
//
// `home=L` is the machine_tag of the box that owns this corpus, and it is the thing that makes this
// file's own decline falsifiable: on THAT machine js-suite treats a NOT-RUN as a class error, so
// "the corpus is not here" stops being an answer the gate can always give. `root=CONSONANCE_DATA`
// is the variable the runner redirects at an empty directory to check the gate is load-bearing.
// Both are pane E's, added the same day, after E built a fifteen-line file with no corpus question
// in it that passed v1's gate probe perfectly.
//
// THE SPLIT, and why it is a defect repair rather than tidying. Until 2026-08-25 every assertion
// below lived in actors.test.js, guarded by `fs.existsSync(board)`. On 2026-08-25 the desktop
// pulled 683d468, ran the suite, and reported actors.test.js as a HARD RED. Nothing was broken.
// The desktop has C:\Consonance\data — so existsSync said yes — and the board in it is the
// DESKTOP'S board, which has never carried a row from any of the seven panes cited here. Every
// evidence quote failed to grep back, and a true check over the wrong universe reported red.
//
// An existence guard cannot catch that, because the corpus WAS present. It was the wrong corpus.
// So the gate here is a CONTENT question — does this board carry the ids the PRE_LETTER table is
// about — and the file reports NOT-RUN, with its reason, wherever the answer is no.
//
// WHAT STAYED BEHIND: actors.test.js keeps every portable assertion — the fixture map, the alias
// logic, the pre-letter class semantics. Those are about the MODULE and run anywhere. What moved
// here is only what is about the RECORD: does this specific claim about this specific board still
// grep back. That division is the whole point; the module's tests should not go dark on a second
// machine because the corpus tests cannot run there.
//
// AND THE CLASS BUYS A NOT-RUN, NEVER A GREEN AND NEVER A PASS FOR A RED. js-suite re-runs this
// file with JS_SUITE_UNIVERSE=force whenever it reports NOT-RUN; if the assertions pass under force
// then the universe was present and this gate was wrong, which fails the suite. It re-runs it with
// JS_SUITE_UNIVERSE=deny whenever it reports a run; if the gate does not flip, the gate is
// decorative, which also fails the suite. Both probes are the runner's, not this file's.
//
//   node consonance/tools/actors.evidence.test.js
//   CONSONANCE_DATA=/some/other/dir node consonance/tools/actors.evidence.test.js   # the desktop
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { census, PRE_LETTER, LETTER_BIRTH } = require('./actors.js');

// The corpus location, resolved the way the peer hooks already do (transcript-watch.js dataDir):
// env override, then ~/.consonance.json data_dir — and then, unlike them, NO LITERAL FALLBACK.
// A hardcoded `C:/Consonance/data` here would be exactly the defect this file was split out of:
// a machine's path baked into a test, correct on one box and quietly wrong on the next. A machine
// that declares no data_dir has no corpus for this file to be about, and the honest report is
// NOT-RUN — which is the "degrade LOUDLY" that portable-paths.js's own remediation text asks for.
// It also means this file adds no new site to the portable-paths baseline.
function dataDir() {
  const env = process.env.CONSONANCE_DATA;
  if (env && String(env).trim()) return String(env).trim();
  try {
    const v = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, ''));
    const d = v && v.data_dir != null ? String(v.data_dir).trim() : '';
    if (d) return d;
  } catch (_) { /* unreadable config is not a corpus */ }
  return null;
}

const DATA = dataDir();
const board = DATA && path.join(DATA, 'board.jsonl');
const persist = DATA && path.join(DATA, 'persist.log');
const realLetters = DATA && path.join(DATA, 'letters.json');

const MODE = String(process.env.JS_SUITE_UNIVERSE || '').toLowerCase();

let boardRowsCache = null;
const boardRows = () => {
  if (boardRowsCache) return boardRowsCache;
  const out = [];
  for (const line of fs.readFileSync(board, 'utf8').split(/\r?\n/)) {
    if (!line.trim()) continue;
    try { out.push(JSON.parse(line)); } catch { /* not a record */ }
  }
  return (boardRowsCache = out);
};

// ── THE UNIVERSE GATE ────────────────────────────────────────────────────────────────────────
// Enumerated from an authority OUTSIDE this file: the ids come from actors.js's PRE_LETTER table,
// so adding a pane to that table widens this gate automatically and a hand-kept list here cannot
// drift from the thing it is supposed to be gating. (universe-print.test.js, clause 1: a skip
// counter that ranges over the instrument's own list cannot count what is absent from the list.)
function survey() {
  if (!DATA) {
    return { ok: false, why: 'no corpus declared on this machine — CONSONANCE_DATA is unset and ' +
             '~/.consonance.json carries no data_dir, so there is no board for these ids to be about',
             seen: 0, total: Object.keys(PRE_LETTER).length, letters: 0 };
  }
  const missingFiles = [board, persist, realLetters].filter((p) => !fs.existsSync(p));
  if (missingFiles.length) {
    return { ok: false, why: `${missingFiles.map((p) => path.basename(p)).join(', ')} absent under ${DATA}`,
             seen: 0, total: Object.keys(PRE_LETTER).length, letters: 0 };
  }
  const assignments = fs.readFileSync(persist, 'utf8').split(/\r?\n/)
    .filter((l) => /^\d{9,12} letter [A-Z] -> pane=\S+/.test(l)).length;
  const ids = Object.keys(PRE_LETTER);
  const present = new Set(boardRows().map((r) => String(r.pane)));
  const found = ids.filter((id) => present.has(id));
  const missing = ids.filter((id) => !present.has(id));
  if (!assignments) {
    return { ok: false, why: `persist.log under ${DATA} records no letter assignments at all, so ` +
             'LETTER_BIRTH cannot be re-derived here', seen: found.length, total: ids.length, letters: 0 };
  }
  if (missing.length) {
    // STATE THE OBSERVATION, NOT THE INTERPRETATION (pane E). This used to end "— this is a
    // different board, not a broken record", which is a conclusion the gate has no evidence for:
    // E deleted twelve rows from this laptop's own board and got that sentence back, word for word,
    // about the right board. The gate can see that ids are absent. It cannot see why.
    return { ok: false, why: `${missing.length} of ${ids.length} pre-letter ids have no row on ` +
             `${board} (${missing.join(', ')}). Absent ids can mean a foreign board OR a damaged ` +
             'one; this gate cannot tell those apart, which is what home= is for',
             seen: found.length, total: ids.length, letters: assignments };
  }
  return { ok: true, why: '', seen: found.length, total: ids.length, letters: assignments };
}

const u = survey();
const RULE = 'a board carrying every id in actors.js\'s PRE_LETTER table, plus a persist.log with ' +
             'at least one letter assignment';
console.log(`JS-SUITE: UNIVERSE ${DATA || '(no data_dir declared)'} — ${u.seen}/${u.total} pre-letter ids on the board · ` +
            `${u.letters} letter assignments in persist.log · rule: ${RULE}` +
            (MODE ? ` · JS_SUITE_UNIVERSE=${MODE}` : ''));

// `force` is the runner's one knob here: it must run the assertions regardless of the gate, so that
// a NOT-RUN can be checked for hiding a green. There is deliberately NO `deny` branch — the runner
// denies by pointing CONSONANCE_DATA at an empty directory, and this file declines for the real
// reason, through the same code path every other machine uses. A file that answered a deny FLAG
// would be proving it can read the runner's variable, not that it can read a corpus.
const forced = MODE === 'force';
if (!u.ok && !forced) {
  console.log('JS-SUITE: NOT-RUN — ' + u.why);
  process.exit(0);
}

const test = require('node:test');

// ── THE CORPUS TESTS ─────────────────────────────────────────────────────────────────────────
// No t.skip below, and that is deliberate. A per-test skip inside a file that ran is exactly the
// half-run the runner now refuses: the gate above is the single place this file declines, so a red
// down here is a red about the record and nothing else.

// Run in a child process so it sees the REAL letters map: actors.js caches its map on first read,
// and the unit file installs a three-pane fixture, so the only way to ask about the real map is a
// fresh process. (That was itself the repair that made the old canary reachable — the assertion
// used to read the live board THROUGH the fixture map and reported nine live panes as unresolved.)
const SNIPPET = `
  const fs = require('fs');
  const { census } = require(${JSON.stringify(path.join(__dirname, 'actors.js'))});
  const ids = [];
  for (const line of fs.readFileSync(process.env.CONSONANCE_DATA + '/board.jsonl', 'utf8').split(/\\r?\\n/)) {
    if (!line.trim()) continue;
    try { ids.push(JSON.parse(line).pane); } catch {}
  }
  const c = census(ids);
  console.log(JSON.stringify({
    actors: c.actors.length,
    rawIds: new Set(ids.map(String)).size,
    unresolved: c.unresolved,
  }));
`;
test('the real board resolves with nothing left over — under the REAL letters map', () => {
  // Not a fixture: the actual corpus, because a synthetic map agrees with the rule by
  // construction and only the corpus can disagree with it.
  const out = require('child_process').execFileSync(process.execPath, ['-e', SNIPPET],
    { encoding: 'utf8', env: { ...process.env, CONSONANCE_DATA: DATA } });
  const c = JSON.parse(out);
  assert.ok(c.actors < c.rawIds, 'the resolver must actually collapse something on the real board');
  assert.deepStrictEqual(c.unresolved, [],
    'unresolved ids on the live board. If one is a pane that predates the letter system, it ' +
    'belongs in PRE_LETTER with its evidence; if it is a live pane, letters.json is the fix and ' +
    'NOT a hand-copied alias. Either way this assertion is how you find out it appeared');
});

test('LETTER_BIRTH re-derives from persist.log, rather than being trusted', () => {
  const stamps = fs.readFileSync(persist, 'utf8').split(/\r?\n/)
    .map((l) => /^(\d{9,12}) letter [A-Z] -> pane=\S+/.exec(l))
    .filter(Boolean).map((m) => Number(m[1]));
  assert.ok(stamps.length > 0, 'no letter assignments in persist.log at all — read it before editing this');
  assert.strictEqual(Math.min(...stamps), LETTER_BIRTH,
    'the first letter ever assigned is not the constant in actors.js; one of them is wrong');
});

test('every pre-letter id posted its LAST row before the first letter existed', () => {
  const rows = boardRows();
  for (const [id, ev] of Object.entries(PRE_LETTER)) {
    const ts = rows.filter((r) => String(r.pane) === id).map((r) => r.ts).filter((n) => typeof n === 'number');
    assert.ok(ts.length > 0, `${id} has no timestamped board rows — the class claims it posted`);
    assert.strictEqual(Math.min(...ts), ev.first, `${id}: recorded first row does not match the board`);
    assert.strictEqual(Math.max(...ts), ev.last, `${id}: recorded last row does not match the board`);
    assert.ok(ev.last < LETTER_BIRTH * 1000,
      `${id} was still posting after the letter system existed — it is NOT pre-letter, and the ` +
      'reason it has no letter is something else that nobody has established');
  }
});

test('each evidence line greps back, and to exactly ONE pane', () => {
  const rows = boardRows();
  for (const [id, ev] of Object.entries(PRE_LETTER)) {
    const hits = ev.quote
      ? rows.filter((r) => String(r.text || '').includes(ev.quote))
      : rows.filter((r) => r.ts === ev.ts);
    const panes = [...new Set(hits.map((h) => String(h.pane)))];
    assert.ok(hits.length > 0,
      `${id}: its evidence matches NOTHING on the board. A citation that does not grep back is a ` +
      'pacifier citation — check for a tidied em-dash or apostrophe before assuming the row is gone');
    assert.deepStrictEqual(panes, [id],
      `${id}: its evidence also matches ${panes.length - 1} other pane(s), so it identifies nobody`);
  }
});

test('no pre-letter id has been given a letter since', () => {
  const map = JSON.parse(fs.readFileSync(realLetters, 'utf8'));
  for (const id of Object.keys(PRE_LETTER)) {
    assert.ok(!(id in map),
      `${id} now HAS a letter (${map[id]}). The pre-letter class is stale for it: either the ` +
      'backfill is right and the entry goes, or the backfill is wrong. Somebody has to say which');
  }
});

// census is imported so this file fails loudly if actors.js ever stops exporting it — the corpus
// assertions above reach it only through the child process, which would swallow the absence.
assert.strictEqual(typeof census, 'function');
