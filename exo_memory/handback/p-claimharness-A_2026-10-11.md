# p-claimharness-A — D305 part 3 (ledger D306): the replay harness for a point-of-claim check; seat A, 2026-10-11

I built the harness and proved it counts both ways with two stubs. **It checks no real checker and judges nothing**; C's build is not here yet.

**Result: commits `1d9481b7` and `4daf6982` on `d305-a` (worktree `G:\consonance-worktrees\a-d305-wt`, from `40cade98`). Local, named paths, not pushed.** Files: `consonance/tools/claim-replay.js`, `claim-replay.test.js`, and `exo_memory/handback/p-claimharness-A_2026-10-11_evidence/` (`census-overrides.json`, `lists/`, `report-always-refuse.md`, `report-never-refuse.md`). `portable-paths` green (385 files, 0 new) and `carrier-drift` GREEN on the last commit. The first commit was RED on portable-paths (two time regexes spelled `d:\` and a default path); the second fixes it.

## The plug-in interface (ASSUMED; E's design is not committed yet)
checked: `exo_memory/loop/claim_check_design_2026-10-11.md` does not exist at `40cade98` or in the main checkout now. So this is my minimal version, to reconcile when E commits:
- A checker is a module exporting a function, or `{ check(turn) }`, sync or async, returning `{ verdict: 'refuse'|'allow', claim?, reason? }`. Anything else is an **error** and counts as neither refusal nor allow.
- A **turn** = `{ id, group, seat, turnStart, claimTs, claimText, calls:[{ts,name,input}], results:[{ts,text,error}] }`: the tool calls and results of the turn BEFORE the claim (redacted, clipped), plus the claim-bearing text of the message (text blocks, Write/Edit text, heredocs, ring and board text). Nothing after the claim is in it.
- Run: `node consonance/tools/claim-replay.js run --lists <dir> --checker always-refuse|never-refuse|<module path> [--groups census,right,week] [--show-claims] [--out <md>]`. A report quotes a flagged sentence only with `--show-claims` (it is a seat's own text). Freeze: `... freeze --out <dir> --overrides <json>`.

## The three groups, frozen (digest = sha256 of each file's bytes; `lists/manifest.json` holds them and the harness hash)
| list | digest | what |
|---|---|---|
| `census-units.json` | `7a31cfc52bded0cf7063fb8ef5e512be3e9503483c9faa1e680c67b962e0c883` | the 27 CN and 5 CU units, locators only |
| `right-claims.json` | `68a4a1d16307ec3e73f1b45e5c9f1774fb835b04e127820ba12149f382814c35` | 73 messages of the 10-10 re-measure |
| `week-replies.json` | `75743f4723061c71871c8c8f7d8ca595eb864ba64ccf0e9a4cb1814bba554b70` | 300 of 1,450 replies, 2026-10-05 to 10-12 |
checked: a second freeze wrote byte-identical lists. `manifest.json` (sha256 `b4e7dbee7778fdf217e23951eae6b081eaf336933171a864bc46e0aac562fde4`) carries the harness, `turn.js` and `find.js` hashes, so it changes when the harness does.

- **Census.** Each unit's turn is read with **E's `turn.js`, run as it is** (its chair-token redaction is kept; my own loader for the other two groups repeats the same redaction shapes, and a row tests both). **22 of the 27 CN units are located; none of the 5 CU is.** The locator is E's evidence string in `classification.json` (turn start, and the claim time where E wrote one); where E's string gives the time in other words I transcribed it into `census-overrides.json` with the words (8 units: W010, W021, W084, W079, W080, W053, W056, W058). **Unlocated: CU W002 W003 W011 W059 W062 (E "did not locate the erring turn"); CN W012 W028 W082 W090 W096 (E gave a turn but no claim time).** They are counted as **unlocated, neither caught nor missed.** So for CU the harness can say nothing today, and CN is 22 of 27.
- **Right-claim sample.** Messages with at least one claim called CORRECT in the B and C verdict files and none called WRONG: **73 of the 100 drawn messages**, all of them, no draw. A refusal here is a refusal of a turn that carried a verified-correct claim.
- **Week.** Keeper-facing replies: an assistant message, `stop_reason: end_turn`, at least 200 claim characters (the frame's floor), in the six seats' main transcripts, 2026-10-05T00:00Z to 10-12T00:00Z: **1,450** (librarian 602, chair 371, A 110, B 134, C 76, E 157). **Seeded sample of 300**, rank `sha256("D305-week|seat|messageId")` ascending. Modelled on the reply-slot replay (stop points; the turn since the last prompt); `reply-slot-replay.js` itself requires the installed hook and was not reused.

## The stubs (committed reports; flagged claims hidden)
| group | always-refuse | never-refuse |
|---|---|---|
| CN (27) | caught 22, missed 0, unlocated 5 | caught 0, **missed 22**, unlocated 5 |
| CU (5) | all unlocated | all unlocated |
| right (73) | refused 73 | refused 0 |
| week (300) | refused 300 | refused 0 |
checked: `report-always-refuse.md`, `report-never-refuse.md`. The two go opposite ways on every located group, so both directions are counted.

## Checks
- **Red first on a broken counter:** I wrote the counter first with the refuse and allow branches swapped on purpose; the row went red, then I fixed it. The swap was deliberate, so that red is a demonstration, not a find.
- `node --test consonance/tools/claim-replay.test.js`: **18 pass, 0 fail**, under the heavy-run lock. They cover the counter, both stubs, a thrower and a wrong-shaped return (an error, never an allow), unlocated units, async checkers, `loadChecker`, locator parsing (a claim past midnight, no claim time), turn building from a fixture transcript (the turn since the last prompt; secrets and Third Place lines gone), E's `turn.js` through the CLI, and the hidden-claims default.
- **Mutants: applied 17 / caught 17 / NOT APPLIED 0.** **The first run caught 14 of 17 and found a real bug:** a wanted message's own tool calls were not kept for a LATER wanted message in the same turn. I added the row (red), fixed the code, and the mutant became a real one and was caught. The other two survivors were a missing test of a unit with no claim time (added) and a no-op mutant (replaced).

## What to know before using it
- **Census "caught" counts a refusal of the turn, not that the flagged sentence is the erring one.** Run with `--show-claims` and read them (B or C).
- **The week rate is a refusal rate, not a false-refusal rate:** some replies in a week carry wrong claims. The right-claim sample is the cleaner false-refusal read, but its 73 turns are from 10-03 to 10-10, a different mix from the week.
- E gave claim times to the second, so a turn is cut at the start of that second (a result in the same second before the claim row is dropped).
- The loader finds messages by id, not by line number, because transcripts shrink and mutate.
- 6,760 Third Place lines were removed from the texts across one stub run (the injected context carries the word); a checker sees `[third-place line removed]`.
- Not done: any real checker (C's build); real numbers; reconciling with E's interface; the `claim_check` config switch (C's).

NEXT: librarian dispatch C to run `claim-replay.js run --checker <C's module> --lists exo_memory/handback/p-claimharness-A_2026-10-11_evidence/lists` when C's build is committed; reconcile the interface above with E's design section when E commits
