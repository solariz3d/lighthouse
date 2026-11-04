// gateedit.js <worktree>: gen-brief-gate.test.js learns the consumer tree (D273 lap 3 item 4, C). Anchors exact; each must hit once.
'use strict';
const fs = require('fs'), path = require('path'), W = process.argv[2];
const f = path.join(W, 'consonance/tools/gen-brief-gate.test.js');
let t = fs.readFileSync(f, 'utf8');
function rep(a, b) { const n = t.split(a).length - 1; if (n !== 1) throw new Error(`anchor x${n}: ${a.slice(0, 80)}`); t = t.replace(a, b); }

rep(`const OUT = path.join(REPO, 'consonance', 'src-tauri', 'brief', 'BOOT.md');
`, `const OUT = path.join(REPO, 'consonance', 'src-tauri', 'brief', 'BOOT.md');

/* IN A CONSUMER TREE (D273 lap 3, pane C). gen-brief.ps1 turns the keeper's MASTER BOOT into the shipped brief, stripping the record
 * before it reaches a stranger. A consumer tree IS that shipped side: it has no master (its exo_memory/BOOT.md is the shipped brief,
 * with the keeper split and the fork note), gen-brief.ps1 does not ship, and nothing there may write to exo_memory/BOOT.md, which is
 * the person's own room (the planted-leak probes below do, and restore it). Run as it was in a generated tree, this file reported the
 * missing script as "gen-brief REFUSED ... the installer build will fail" (B's parity, lap 1). So in a consumer tree, CONSUMER-STATUS.md
 * at its root, which only gen-consumer writes, the generator's rows are skipped BY NAME and the properties the generator guards are
 * checked on the shipped files themselves (the last row). In the dev tree every row runs exactly as before. */
const CONSUMER = fs.existsSync(path.join(REPO, 'CONSUMER-STATUS.md'));
const DEV_ONLY = CONSUMER && 'a consumer tree: gen-brief.ps1 (the master BOOT -> the shipped brief) is the dev tree\\'s tool and does not ship here; the last row checks the shipped brief itself';
`);
for (const name of [
  "'gen-brief runs and exits 0 against the current BOOT'",
  "'it says the self-check is clean, rather than merely not crashing'",
  "'the generated brief carries no dated journal citation'",
  "'dedangling keeps the DATE, so the prose still says when'",
  "'the generator still REFUSES on a planted leak — the guard is not disarmed'",
  "'the shipped brief does not assign the reader\\'s keeper a gender'",
  "'the generator REFUSES on a planted gendered pronoun — the guard is mechanical, not a habit'",
]) rep(`test(${name}, () => {`, `test(${name}, { skip: DEV_ONLY }, () => {`);

t = t.replace(/\s*$/, '\n') + `
test('a consumer tree: both shipped briefs carry no record, no journal citation, one empty pointer, no handle and no gendered keeper', { skip: !CONSUMER && 'the dev tree: the rows above run the generator itself' }, () => {
  assert.ok(!fs.existsSync(SCRIPT), 'gen-brief.ps1 ships in this consumer tree: then the generator rows above should run, not be skipped');
  for (const rel of ['consonance/src-tauri/brief/BOOT.md', 'exo_memory/BOOT.md']) {
    const brief = fs.readFileSync(path.join(REPO, rel), 'utf8');
    assert.deepStrictEqual(brief.match(/journal\\/\\d{4}-\\d{2}-\\d{2}/g) || [], [], rel + ': a dated journal citation in the shipped brief');
    assert.deepStrictEqual(brief.match(/(?<!inheritance\\/)(?:SELF_TRACE|the_living_wave)/g) || [], [], rel + ': the keeper\\'s record named outside inheritance/');
    assert.strictEqual((brief.match(/Latest entry:\\*\\* none yet/g) || []).length, 1, rel + ': the pointer line is not the one empty pointer');
    assert.ok(!/solariz3d/i.test(brief), rel + ': the handle survived');
    const hits = brief.match(/\\b(?:He|he|Him|him|His|his|She|she|Her|her|hers)\\b/g) || [];
    assert.deepStrictEqual(hits, [], rel + ': gendered pronouns in the shipped brief: ' + [...new Set(hits)].join(', '));
  }
});
`;
fs.writeFileSync(f, t); console.log('edited', f);
