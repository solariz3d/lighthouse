# p-mutantscopy-A — D288 F2: mutants harnesses lost scratch.js; seat A, 2026-10-10/11

Worktree `G:\consonance-worktrees\a-d288-wt`, branch `d288-a` from main `57ef433d`. **One commit, local, named paths, not pushed: `1fde903b`** — five files, +13 −1: `consonance/tools/{sources-gate,reply-slot,second-reader,jev-ask,jev-shadow}.mutants.js`. No hook, no test file touched.

## What was wrong, and the fix
Since D287 part 1 the suites `require('./scratch.js')` / `('../tools/scratch.js')`. A harness that copies only some files into its mutant tree then fails at load, so its control is red and no mutant result means anything.
- **sources-gate, reply-slot** (the two named in F2): copy `consonance/tools/scratch.js` into `<tree>/consonance/tools/`.
- **second-reader.mutants.js** (not named; same defect, found by reading its copy list): same line.
- **jev-ask.mutants.js** (found by running): its mutant dir held only `jev-ask.js` and the suite; `scratch.js` copied beside them. Control was 102 pass / 2 fail.
- **jev-shadow.mutants.js** (found by running): `scratch.js` added to `COPIED`. Then its *runner* target was still red (43/2) for an **older** cause, not part 1's: the runner suite's `withJev()` (D123) copies `jev/lib/prompt.js`, `ask.js`, `config.js`, `jev/METHOD.md` and `consonance/jev-room/.jev/config.json` from the repo it sits in, and the mutant tree lacked them (`ENOENT … jev\lib\prompt.js`). `layout()` now copies those five too. Inferred: that control was red since D123; I did not check an older commit.

## Every harness run to a control (command: `node <harness>`; 16 live harnesses, each run once in this tree)
| harness | control | result |
|---|---|---|
| sources-gate.mutants.js | 59 / 0 | exit 0 (all rows CAUGHT in the first lines I read; no survivor line) |
| reply-slot.mutants.js | 37 / 0 | 58 applied · 58 caught · 0 survived · **1 NOT APPLIED** (#43 "pane ring: main does not pass the seat to the verdict" — anchor found 0 times; source moved, E is editing sources-gate.js) |
| second-reader.mutants.js | 29 / 0 | 38 applied · 38 caught · 0 survived |
| jev-ask.mutants.js | 104 / 0 (after fix) | 50 applied · 50 caught · 0 survived |
| jev-shadow.mutants.js | shadow 33 / 0, runner 45 / 0 (after fix) | 26 applied · 26 caught (2 by hanging) · 0 survived · 3 NOT APPLIED (each with its printed reason, by design) |
| close.mutants.js | (in place) | 10 killed · 0 survived |
| state-sync.mutants.js | (in place) | 66 killed · 0 survived · 0 not applied; 5313 s |
| trip-check.mutants.js | — | 16 applied · 16 caught · 0 survived |
| union-at-launch.mutants.js | — | 13 applied · 13 caught · 0 survived; 1129 s |
| janitor.mutants.js | — | 25 applied · 25 caught · 0 survived |
| heavy-run.mutants.js | 45 / 0 | 70 applied · 68 caught · **2 SURVIVED**: #16 "race: the put-back does not check that the moved lock is alive", #30 "tasklist: a spawn error is read as an answer" (exit 1). Reported, not chased. |
| dev/place-conversations.mutants.js | (in place) | 20 killed · 0 survived |
| dev/tail-carry.mutants.js | (in place) | 112 killed · 0 survived · 0 not applied; 5173 s |
| jev/test/ask-judge.mutants.js | — | 42 applied · 42 caught · 0 survived |
| jev/test/install-judge.mutants.js | — | 39 applied · 39 caught · 0 survived |
| exo_memory/loop/d121_relay/harness.mutants.js | — | 18 applied · 18 caught · 0 survived |

The harnesses that copy everything (`trip-check`, `union-at-launch`) or mutate in place (`close`, `state-sync`, `place-conversations`, `tail-carry`), the ones that already had `scratch.js` (`heavy-run`, `janitor`) and the jev/relay ones (`ask-judge`, `install-judge`, `harness`) needed nothing. Evidence outputs are in my scratchpad (`d288/*.out`, `r2_*`, `r4_jev-shadow.out`).

## Corrections to myself
- The first batch ran with my 2400 s `timeout` and cut `state-sync` and `tail-carry` short (exit 124); I re-ran both alone with 6000 s and they are green above.
- My first `jev-shadow` re-run gave up after 30 min waiting for the tree's heavy-run slot (exit 3, nothing ran), and a second used a bad relative output path; the table is from the third, clean run.

## Not checked
- The 54 harnesses copied into `exo_memory/handback/*_evidence/` (records of old runs; the evidence skip keeps them out of the suite).
- sources-gate.mutants: I read the first rows and the exit code, not every row, and did not record an "N applied" summary line for it.
- Whether E's sources-gate.js matcher change (in parallel) moves any anchor in sources-gate.mutants.js or reply-slot.mutants.js: run on `57ef433d`'s sources.
- Rust mutants (`mutant-harness.js` rows files), not part of this list.

NEXT: chair cherry-pick 1fde903b onto main; librarian routes the two heavy-run survivors (#16, #30) and reply-slot's NOT APPLIED #43 to whoever owns them
