// classify.js (pane E, D305 item 6): the pool's Q3 classes, by B's D303 registration §2 order, with the unit's deciding fact.
//   node classify.js <topup dir>   -> classification.json, out/table.md, heldout-lists/census-units.json (+ manifest.json)
// Every one of the 153 pool units gets one class. CLASSES below lists every unit that is NOT 'NA'; any id there that is not in
// the pool, or a pool unit listed twice, stops the script. The pool's batch digests are checked first (digests.tsv).
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const dir = process.argv[2];
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const rows = fs.readFileSync(path.join(dir, 'digests.tsv'), 'utf8').trim().split('\n').slice(1).map((l) => l.split('\t'));
const pool = [];
for (const [, file, n, d] of rows) {
  const buf = fs.readFileSync(path.join(dir, file));
  if (sha(buf) !== d) throw new Error(`digest mismatch ${file}`);
  const j = JSON.parse(buf.toString('utf8'));
  const a = Array.isArray(j) ? j : j.units;
  if (!Array.isArray(a) || a.length !== Number(n)) throw new Error(`count mismatch ${file}`);
  pool.push(...a);
}
if (pool.length !== 153) throw new Error(`pool is ${pool.length}, not 153`);

const T = {
  A: 'C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f.jsonl',
  B: 'C--Consonance-instances-sibling-5bf9d657/12fb81f6-f4c0-4ef8-aad8-f0cdce091925.jsonl',
  C: 'C--Consonance-instances-sibling-0845a868/0845a868-38f2-4cc2-b45a-431e0c088fb1.jsonl',
  E: 'C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565.jsonl',
  chair: 'C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl',
  lib: 'C--Consonance-instances-librarian/0c0c0c0b-0000-4000-8000-00000000115b.jsonl',
};
// CN/CR: seat, turn start and claim time are the erring turn as located with find.js (the claim's own words, first occurrence
// before the correction); the check is the one whose output would have printed the answer; `run` is what anscheck.js or the
// turn read showed before the claim.
const CLASSES = {
  H0182: { c: 'CN', seat: 'E', ts: ['2026-09-23T00:39:55Z', '2026-09-23T00:46:10Z'], src: 'compute', check: 'the arithmetic with the right call count', run: '14 calls before the claim, none recomputing B\'s estimate (judged from the turn; no single answer token)' },
  H0546: { c: 'CN', seat: 'A', ts: ['2026-09-23T07:44:33Z', '2026-09-23T07:47:48Z'], src: 'fs', check: 'read the live edge in the seat\'s own shell (CLAUDE.md)', run: 'anscheck: "standing rules on Jev" not printed in 19 calls before; the claim is frame text in a code Edit' },
  H0102: { c: 'CN', seat: 'B', ts: ['2026-10-08T21:53:54Z', '2026-10-08T21:57:53Z'], src: 'compute', check: 'run the build test from its own folder, as js-suite does', run: '3 calls before the claim; it was run from the repo root only' },
  H0162: { c: 'CN', seat: 'E', ts: ['2026-09-22T12:27:34Z', '2026-09-22T12:31:43Z'], src: 'compute', check: 'count the units that can carry a yes', run: '11 calls before the claim (judged from the turn; no single answer token)' },
  H0351: { c: 'CN', seat: 'A', ts: ['2026-10-04T07:49:58Z', '2026-10-04T08:05:51Z'], src: 'compute', check: 'a probe that builds a real tube oval', also: ['H0890'], run: 'anscheck: 30,135,761 not printed in 61 calls before; the buggy probe printed the plain oval\'s sizes' },
  H0890: { c: 'CN', seat: 'A', ts: ['2026-10-04T07:49:58Z', '2026-10-04T08:05:51Z'], src: 'compute', check: 'as H0351', dup: 'H0351', run: 'the same erring claim as H0351 (one turn, one claim); listed once in the held-out list' },
  H0159: { c: 'CN', seat: 'E', ts: ['2026-09-22T17:43:32Z', '2026-09-22T17:57:57Z'], src: 'compute', check: 'the count on the corrected run', late: true, run: 'anscheck: "51 of 74" not printed before the claim; corrected later in the same turn (18:01:48Z)' },
  H0403: { c: 'CN', seat: 'C', ts: ['2026-10-05T05:36:10Z', '2026-10-05T05:48:31Z'], src: 'fs', check: 'grep -l over the test files', run: '77 calls before the claim; the hand count was written, the grep came after (judged; no single answer token)', late: true },
  H0557: { c: 'CN', seat: 'chair', ts: ['2026-09-23T10:01:46Z', '2026-09-23T10:02:02Z'], src: 'compute', check: 'git log --reverse -S on install.ps1', run: 'anscheck: daded53 not printed; 1 call before the dispatch' },
  H0232: { c: 'CN', seat: 'B', ts: ['2026-09-27T23:28:28Z', '2026-09-27T23:38:37Z'], src: 'fs', check: 'hash the live file against 59ff906\'s', run: 'anscheck: 9d322c53 not printed in 26 calls before; the check run compared against a snapshot only' },
  H0192: { c: 'CN', seat: 'E', ts: ['2026-09-26T07:30:52Z', '2026-09-26T07:34:03Z'], src: 'compute', check: 'the found rate at N = 8 from the run', late: true, run: 'anscheck: 65% not printed before the claim; fixed later in the same turn (07:34:58Z)' },
  H0717: { c: 'CN', seat: 'E', ts: ['2026-10-09T20:14:55Z', '2026-10-09T20:17:16Z'], src: 'other-repo', check: 'read the keeper\'s track 2 export (kn5)', run: 'a probe of a TEST export printed lane meshes (1ROAD_PIT_*) before the claim; the keeper\'s export was never read. A presence check could be fooled by that token' },
  H0911: { c: 'CN', seat: 'A', ts: ['2026-10-03T23:54:11Z', '2026-10-03T23:54:19Z'], src: 'compute', check: 'run the harness file alone', run: 'anscheck: "tests 51" not printed in this turn (1 call before); 51 was printed in an earlier turn' },
  H0682: { c: 'CN', seat: 'lib', ts: ['2026-09-16T10:36:27Z', '2026-09-16T10:39:23Z'], src: 'fs', check: 'count NULs in t2-echo', run: 'the 5 calls before read the hand-backs and ran leak checks; none counted NULs. The unit sits in C\'s hand-back; the erring claim is the librarian\'s note and ring (10:39:23Z, 10:39:38Z)' },
  H0562: { c: 'CN', seat: 'E', ts: ['2026-09-23T07:25:06Z', '2026-09-23T07:26:31Z'], src: 'compute', check: 'git log -- dev/shell/hooks/session-start.js', run: 'anscheck: 1c5b4f2 not printed in 8 calls before' },
  H0802: { c: 'CN', seat: 'E', ts: ['2026-09-19T15:08:26Z', '2026-09-19T15:12:23Z'], src: 'fs', check: 'grep -n "PW_PATH = " dev/diversity/score.mjs', run: 'the line was read off a sed window that prints no line numbers (the correction says so); located at the hand-back write 15:12:23Z, the first Write holding ":27" with "phase-window"' },
  H0799: { c: 'CR', seat: 'E', ts: ['2026-09-19T15:08:26Z', '2026-09-19T15:13:10Z'], src: 'fs', check: 'the full hex in carry-out.txt', run: 'anscheck: 4e087 PRINTED before the claim; the seat had the answer and mistyped it' },
  H0595: { c: 'CU', seat: 'A', src: 'compute', check: 'sum the packet log', run: 'the "in chat" claim is not located: "882 statements" first appears in the correction write itself (07:22:09Z)' },
  H0261: { c: 'NC', why: 'the right cause came from C reproducing B\'s runner (NaN width): a later investigation' },
  H0075: { c: 'NC', why: '"text in it" was made false by C\'s later finding about suggestions' },
  H0294: { c: 'NC', why: 'superseded by a ruling that arrived after the line was written' },
  H0951: { c: 'NC', why: 'the chair\'s later note changed which commit lands' },
  H0952: { c: 'NC', why: 'the chair\'s last note reversed the one before' },
  H0908: { c: 'NC', why: 'a design argument refuted by reasoning about the one real failure; no check prints it' },
  H0179: { c: 'NC', why: 'a design argument (the stimulus is the unit) turned on its author; a power calculation made after' },
  H0410: { c: 'NC', why: 'reinterpreted from a machine-wide crash picture measured on 10-06' },
  H0559: { c: 'QX', why: 'a correction of a ruling\'s wording; the claim corrected is not in the unit' },
  H0025: { c: 'LK', why: 'the answer is repository text (arm-words.txt header): D301\'s lookup, not a Q3 check' },
  H0252: { c: 'NA', why: 'a wrong READING ("nothing deleted") that was acted on but never written before the correction: conduct, not a sent claim' },
};
const NA_WHY = 'conduct (a tool, test, harness or edit slip), a note, a finding or a plan: no wrong state or figure statement';

const ids = new Set(pool.map((u) => u.id));
for (const k of Object.keys(CLASSES)) if (!ids.has(k)) throw new Error(`${k} is not in the pool`);
const rowsOut = pool.map((u) => {
  const k = CLASSES[u.id];
  return k ? { id: u.id, rank: u.topup_rank, class: k.c, ...k } : { id: u.id, rank: u.topup_rank, class: 'NA', why: NA_WHY };
});
const count = {};
for (const r of rowsOut) count[r.class] = (count[r.class] || 0) + 1;
const cn = rowsOut.filter((r) => r.class === 'CN');
const cnDistinct = cn.filter((r) => !r.dup);
const held = rowsOut.filter((r) => (r.class === 'CN' && !r.dup) || r.class === 'CU').map((r) => r.ts
  ? { id: r.id, class: r.class, src: r.src, source: 'E pool read, find.js + turn.js', status: 'located', seat: r.seat, transcript: T[r.seat], turn_start: r.ts[0], claim_ts: r.ts[1], ...(r.also ? { also: r.also } : {}) }
  : { id: r.id, class: r.class, src: r.src, source: 'none', status: 'unlocated', why: r.run, seat: null, turn_start: null, claim_ts: null });

const out = (p) => path.join(__dirname, p);
fs.mkdirSync(out('out'), { recursive: true }); fs.mkdirSync(out('heldout-lists'), { recursive: true });
fs.writeFileSync(out('classification.json'), JSON.stringify({ what: 'D305 item 6: the Q3 class of every unit of A\'s top-up pool (153), by B\'s D303 registration §2. LK and NA are outside Q3\'s classes: LK = the answer is repository text (D301\'s question); NA = not a wrong state or figure statement.', pool_digests: Object.fromEntries(rows.map((r) => [r[1], r[3]])), counts: count, units: rowsOut }, null, 1) + '\n');
const list = JSON.stringify({ what: 'D305 item 6: HELD-OUT units for the claim-check revision, from A\'s unread top-up pool (E pool read). The CN units, one per distinct erring claim, and the CU. Same shape as A\'s census-units.json; run with --lists <this folder> --groups census.', units: held }, null, 1) + '\n';
fs.writeFileSync(out('heldout-lists/census-units.json'), list);
const listSha = sha(Buffer.from(list));
// A's manifest shape (claim-replay.js freeze), so `run --lists heldout-lists` reads it; the harness hash is the one this list was
// checked against (consonance/tools/claim-replay.js at the base), plus this script's own hash.
const harness = path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'claim-replay.js');
fs.writeFileSync(out('heldout-lists/manifest.json'), JSON.stringify({
  harness_sha256: sha(fs.readFileSync(harness)), turn_js_sha256: sha(fs.readFileSync(out('turn.js'))), find_js_sha256: sha(fs.readFileSync(out('find.js'))),
  classify_js_sha256: sha(fs.readFileSync(__filename)),
  lists: { census: { file: 'census-units.json', sha256: listSha, function: 'sha256 of the file bytes' } },
}, null, 1) + '\n');

const L = ['# D305 item 6: the top-up pool, read for Q3 (pane E). Generated by classify.js.', '',
  '| class | units |', '|---|---:|', ...['CN', 'CR', 'CU', 'NC', 'QX', 'LK', 'NA'].map((k) => `| ${k} | ${count[k] || 0} |`), `| **total** | ${rowsOut.length} |`, '',
  `CN units ${cn.length}; distinct erring claims ${cnDistinct.length} (H0890 is H0351's claim). Replayable CN (located to the second): **${held.filter((h) => h.class === 'CN' && h.status === 'located').length}**. CU ${count.CU || 0}, unlocated.`,
  `§6.1 needs >= 12 replayable CN: **${held.filter((h) => h.class === 'CN' && h.status === 'located').length >= 12 ? 'met' : 'NOT met'}**.`, '',
  `Held-out list: \`heldout-lists/census-units.json\`, sha256 \`${listSha}\`.`, '',
  '| id | class | erring seat | turn start | claim | source | check | what ran before |', '|---|---|---|---|---|---|---|---|',
  ...rowsOut.filter((r) => ['CN', 'CR', 'CU'].includes(r.class)).map((r) => `| ${r.id} | ${r.class}${r.late ? ' (late)' : ''} | ${r.seat} | ${r.ts ? r.ts[0] : ''} | ${r.ts ? r.ts[1] : ''} | ${r.src} | ${r.check} | ${r.run} |`), '',
  '| id | class | why |', '|---|---|---|', ...rowsOut.filter((r) => ['NC', 'QX', 'LK'].includes(r.class) || (r.class === 'NA' && r.why !== NA_WHY)).map((r) => `| ${r.id} | ${r.class} | ${r.why} |`), '',
  `The other ${rowsOut.filter((r) => r.class === 'NA' && r.why === NA_WHY).length} units are NA: ${NA_WHY}.`];
fs.writeFileSync(out('out/table.md'), L.join('\n') + '\n');
console.log(L.slice(0, 16).join('\n'));
