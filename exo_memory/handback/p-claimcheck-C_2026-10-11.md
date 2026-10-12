# p-claimcheck-C — D305 part 4 (ledger D306): the claim check, built behind `claim_check` (OFF), and its replay. Pane C (sibling-0845a868), 2026-10-12.

**Commits:** **eaf69274** + **d222d4b4** on `d305-c` (`G:/worktrees/c-d305-wt`, from main fe566fbc; local, not pushed).
- **d222d4b4** fixes eaf69274, which was RED on portable-paths: six test fixtures spelled `C:/` paths.

**Files:**
- `consonance/hooks/claim-check.js`: the hook and the pure `check()`.
- `consonance/hooks/claim-check.test.js`: 23 rows.
- `consonance/tools/claim-check-adapter.js` and its `.test.js`: 6 rows.
- **One edit outside my files:** `consonance/tools/claim-replay.js`, described below.
- Evidence: `exo_memory/handback/p-claimcheck-C_2026-10-11_evidence/`. It holds both replay reports (no claim text), the mutant runner and its logs, the red-first log, `byclass.js`, and the final runs.

**The keeper's config:** `~/.consonance.json` is untouched. checked: `grep -c claim_check` → 0; mtime 2026-10-10T20:20:50. The switch is OFF.

## What was built
- **E's §1 interface, as ruled.** `check(turn, opts) -> { verdict, flagged, backed, skipped }`, where turn is `{ prompt, events[], outgoing }`. It is pure.
  - **Recognizer:** claimrec's `units.js` and the reply slot's `TOKEN_KINDS`, both reused, not copied. Then `path` is dropped, and number, size, time and multiplier are added.
  - **State words:** E's §2.3 table, each with its "named object" test.
  - **Skips:** inferred: lines and the list under them, quotes, questions, plans, and the trailers.
  - **Matcher:** E's §3 rules for literal, prompt, computed, rounded and empty-result, each with ANSI and thousands normalisation. For state claims, the read that reaches the state.
- **Where a claim is seen: v1 AND the Bash write path, as ruled.**
  - v1 is the reply (a Stop hook), the three ring verbs, and Write/Edit/MultiEdit into `exo_memory/`.
  - The Bash write path is a heredoc, a `>`/`>>` redirect or `tee` into `exo_memory/`. It checks what the command writes: the heredoc bodies and echoed strings.
  - Not seen, as E said: a write through `node -e`, python or a script file.
- **The switch reads like `handback_index_from`.**
  - JSON `true` is ON and refuses.
  - `"shadow"` logs only.
  - Anything else is OFF: absent, `false`, `"true"`, `1`, or broken JSON. OFF exits before reading stdin, the transcript or the data dir.
  - **Row "OFF changes nothing"**: with the switch absent, `false` or `"yes"`, the hook prints nothing, exits 0 and writes no ledger row. The same payload with the switch ON refuses, so the row is not vacuous.
- **Refusal behaviour.** It refuses once per turn and place; a second send in the same turn goes through, with a `secondSend` row. It refuses only after its ledger row is on disk, and fails open on any error. The ledger holds kinds and needs only, never claim text or figures (a row checks this).
- **Not done, and owed before it could go live:**
  - an `install.ps1` entry;
  - `units.js` installed beside it. The hook looks for `./units.js`, then the repo's copy.
  - It also ignores `gates_mode` (the switch is its own).

## The one edit outside my files: `consonance/tools/claim-replay.js`, additive
A's turn carries one merged `claimText` and no prompt. That made the two-way report impossible (v1 against v1 plus the Bash path), and dropped E's carried-figure exit. So I added:
- `claimParts` (each part with the tool and the target it was written to);
- `prompt` (the turn's last real prompt).

These sit beside the unchanged `claimText`, in both of A's loaders. `claimTextsAtSeconds` gains an optional third argument. A's 18 rows still pass. checked: 47/47 in the final run = my 29 + A's 18.

The harness sha in the reports therefore differs from the frozen manifest's. The lists, and their digests, are A's and unchanged.

## Replay over A's frozen lists
checked: `sha256sum` of census-units `7a31cfc5…`, right-claims `68a4a1d1…`, week-replies `75743f47…` and manifest `b4e7dbee…`; all four equal A's.

Command:
```
[CLAIM_CHECK_VIAS=v1] node consonance/tools/claim-replay.js run --lists exo_memory/handback/p-claimharness-A_2026-10-11_evidence/lists --checker consonance/tools/claim-check-adapter.js [--show-claims]
```
Add `--show-claims` to see what was flagged. The reports in the evidence folder were run without it.

| | **v1 + the Bash write path (the build)** | **v1 only** |
|---|---|---|
| CN 27: refused / allowed / unlocated | **13 / 9 / 5** | **9 / 13 / 5** |
| CU 5 | 0 / 0 / 5 unlocated | 0 / 0 / 5 unlocated |
| refusals as a share of 32 (unreplayable counted as missed) | 13/32 = 40.6% | 9/32 = 28.1% |
| refusals as a share of the 22 located | 13/22 = 59.1% | 9/22 = 40.9% |
| right-claim sample (73): refused | 35 (47.9%) | 33 (45.2%) |
| week (300): refused | 202 (67.3%) | 202 (67.3%) |

- **A refusal is not yet a catch.** B's §2 counts a catch only when the refusal flags the wrong claim itself. The `--show-claims` report lists every flag's place and token per unit, for B to judge.
  - inferred, from my own read of that report: about 8 of the 13 refusals flag the wrong claim, and the rest are refusals elsewhere.
  - Either way, B's catch bar (low ≥ 16 of 32) is not reachable: the most there can be is 13 of 32.
- **The week figure is the same both ways** because the week sample is end-of-turn replies, which carry no Bash writes.
- **By claim class** (`byclass.js`, the split B's §5 narrowing uses), over the week sample:
  - the figure flags alone would refuse 133 of 300, and the state flags alone 133 of 300; 64 turns have both.
  - On the right sample: figure alone 29 of 73, state alone 20 of 73.
  - **The largest drivers are the bare `number` kind** (194 flags in the week) **and the process state words** (started, finished, running: 88).
- §6.3 (always-refuse): 67% of the week is under its 90%.

## Checks
- **Red first.** I drafted the code before the rows, so the red is shown on a copy of fe566fbc (`red.log`):
  - (a) the two test files alone: both red, with nothing to load;
  - (b) with the hook and the adapter but A's harness unchanged: **25 pass, 1 fail, of 26**. The one red is the harness row, which needs the additive edit. The rows added later (the unwritable ledger, the colour code, the version in a path) were not in that run.
  - The rule rows are pinned by the mutants, not by that red.
- **Mutants** (`mut.js` on a copy tree, on the match rules, the skips, the places and the switch): **applied 25 / caught 25 / NOT APPLIED 0, control clean** (`mut3.log`, and again after the path fix in `fix.log`).
  - The first run caught 23. The survivors were "colour codes not stripped" and "masked spans ignored": my rows had never shown a colour code's digits backing a figure, or a version inside a path. I added both rows, and both mutants are now caught.
  - **Disclosed:** in run 2 the control itself went red once (`mut2.log`, "caught by rows 3"). It has not come back in 12 later runs: 6 in the worktree, 4 in the copy tree, and the controls of runs 3 and 4 (`flake.log`, `flakeb.log`). The cause is not found. Row ids in a parallel two-file TAP run are ambiguous, so I cannot say which row it was.
- **Tests:** the new rows, A's rows, and five hook-wide files (dream-gate 1, dirs 5, gate-mode 6, reply-slot 38, sources-gate 64) all green under the heavy-run lock (`final.log`).
- After committing, `portable-paths` was RED on eaf69274. After d222d4b4: green, 389 files in scope / 455 known sites / 0 new. `carrier-drift`: GREEN. Credential pattern scan of the evidence and the new files: 0 hits.

## Census ids
None of my code, tests, fixtures or comments uses a census unit's id or text. checked: `grep -E "\bW[0-9]{3}\b"` over the four new files → 0. All fixtures are synthetic. The two committed reports list unit ids only in the harness's own tables, as A's reports do.

## Read
- The librarian's Wave 1 read (`plan_claim_check_d305_2026-10-11.md:25-33`).
- E's design.
- A's harness and hand-back.
- B's registration §0–§6, stopped at "STOP HERE" (:125); §G not read.
- `reply-slot.js`, `sources-gate.js`, `units.js`, and `handback_index_from` in main.rs.

**Leftovers, mine:** `G:/worktrees/c-d305-base` (detached, clean) and `scratchpad/d305/`.

NEXT: B reads the replay (`--show-claims`) against the bar and scores; the librarian rules the outcome.
