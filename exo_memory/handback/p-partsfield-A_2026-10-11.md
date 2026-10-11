# p-partsfield-A — D292 part 2 (ledger row D293): a `parts` field on the dispatched row; seat A, 2026-10-11

Worktree `G:\consonance-worktrees\a-d292-wt`, branch `d292-a` from main `56badc64`. **One commit, local, named paths, not pushed: `e99ba5fa`** — `consonance/tools/lap-row.js` (+36 −5), `lap-row.test.js` (+90). No reader needed a change; no Rust touched, so no cargo run.

## Where, and how the chair supplies it
- The `dispatched` row is written by `lap-row.js` `chain()` (`--stage <lap> dispatched …`). The app does not write it; `lap_holders.rs` and `main.rs` only read rows as `serde_json::Value` (no `deny_unknown_fields`: `grep -n deny_unknown_fields *.rs` → none).
- **A flag, `--parts N`, not derived from the plan.** Why: plans are prose with no parser; the chair knows the count at the moment it writes the row; a flag is one word to re-run. Cost: it can be forgotten, so absence reads as UNKNOWN (not 1) everywhere below.
- Validation: dispatched stage only, whole number from 1. Anything else is refused and nothing is written. Nothing routes or gates on it.
- Absent writes **no key** (not `null`), so old rows and every other stage are byte-identical.

## Several dispatched rows on one lap (follow-ups)
Each row's `parts` is that dispatch's own. `laps()` now returns `dispatches: [{at, parts|null}]` and `partsTotal` = the sum, **null unless every dispatch of the lap carries a count** (one uncounted dispatch makes the total unknown, never a smaller number). A follow-up of 1 pane after a 4-part dispatch reads as 5.

## Readers traced
- `lap-row --report`: new PARTS section ("N of M dispatched lap(s) carry a part count on every dispatch" + a count per total). On a ledger of old rows it prints `0 of M`.
- `chain-status.js` (`openLaps`, `chainLaps`) and `commit-gate.js` (`lapState`): read rows by `stage`/`chain`/`lap`/`at`; a row test gives identical results with and without the field. No change.
- `lap_holders.rs`, `main.rs`: Values, unknown key ignored (read, not run).
- Not traced: `state-block.js`, `baton-wake`, `boundary-check`, `replay-check`, `ledger-union`, `state-sync`, `close` — grep matched them for `lap.jsonl`; I did not open each. `ledger-union` copies whole rows by id (inferred, not read).

## Checks
- Red first: 6 new rows failed on the unchanged writer (`node --test` on lap-row.test.js: 135 pass / 6 fail).
- After: `lap-row.test.js` + `chain-status.test.js` + `commit-gate.test.js` → pass 315 / fail 0 (run through a runner calling `heavy-run.hold()`).
- Mutants on `lap-row.js`: first batch **applied 9 / caught 8 / NOT APPLIED 0**; the survivor was a wording mutant of the report line (equivalent to the test's regex); two sharper report mutants (count every lap as counted; distribution loop emptied) **applied 2 / caught 2**. Writer mutants caught: row drops parts, null key when absent, any stage accepted, shape unchecked, 0 accepted, total ignores uncounted, total = last row only, CLI flag not passed.
- After commit: `portable-paths` green (379 files, 0 new); `carrier-drift` GREEN.

## Corrections to myself
- I killed my mutation script with a `timeout`; it had left a mutant (`XX`) in `lap-row.js`. I found it by grep before committing and restored the text; the committed file has no `XX` (`grep -c XX` → 0).

## On whether the field is useless
Mostly it is cheap and honest: it can only say "split vs single" if the chair writes it every dispatch, and B's registration already says what a count cannot settle (confounded by task size). The risk is the unfilled field; the report shows that rate (`N of M carry a count`) so a field nobody fills shows up as its own falsifier. Not run: the keeper's real chair path (`--stage … --parts`) against the live ledger.

NEXT: librarian collate; chair cherry-pick e99ba5fa onto main and tell the chair seat to add `--parts N` to its dispatch command
