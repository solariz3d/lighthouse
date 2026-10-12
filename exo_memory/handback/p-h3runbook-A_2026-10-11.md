# p-h3runbook-A — D303 part 2 (ledger D304): the 10-17 H3 runbook; seat A, 2026-10-11

I wrote the runbook and **measured nothing for H3.** Plan: `loop/plan_unchecked_claims_d303_2026-10-11.md` part 2; H3 and its revert rule `loop/plan_lighten_the_load_2026-10-09.md:17-27`.

**Result: `exo_memory/loop/h3_runbook_2026-10-17.md`, commits `cbb56cda` and the follow-up marking one line inferred, on `d303-a` (worktree `G:\consonance-worktrees\a-d303-wt`, from `bec8b7b7`). One file. Local, named paths, not pushed.** `portable-paths` exit 0 (383 files, 0 new), `carrier-drift` GREEN.

## What it fixes (each is a line in the runbook)
- **Window:** start **2026-10-11T00:34:07Z** (10-10 18:34 Regina), end **2026-10-18T00:34:07Z**. checked: the first `"mode":"light"` row of `C:\Consonance\data\sources-gate.jsonl` has that `ts` (rows before it have no mode field; all 182 rows since are light). The eligible frame is already 604 messages, so the 100-message floor is met and the end date decides.
- **The draw:** the code's own, not mine: 100 messages by `sha256("L119|"+id)`, 3 statements each, **seed `L119`, no strata** (six D seats, split falls where the hash puts it). Readers pinned to `claude-opus-5-5`. **B and C verify blind, E does not, I (the author) do not; the librarian scores.** The librarian's own messages are in the frame and are said to be so.
- **The interval and the rule, before the data:** the scorer's cluster bootstrap (2,000 resamples, seed `L119-boot`, 95%); bar 0.049 (not the 10-10 sample's 0.020). **REVERT only if readable (DG1-DG3 clear) and the `boot95` lower bound of `P(wrong|UNCHECKED)` > 0.049**; readable and not above → not refuted; unreadable → NOT MEASURED, no revert, no re-draw. inferred from a binomial tail: at n = 99 that needs about 10 wrong (10.1%), so the rule fires only on roughly a **doubling**, and a fall cannot be shown.
- **(a), (c), (d):** commands with instrument paths. (a) still has pairs **for SOURCES only** (it still refuses in light mode: 18 + 1 denies in 28 h; the reply slot only warns), so SOURCES is compared with SOURCES (13 of 127 = 10.2% before). (c) is `round_time_baseline.js --until <end>`, reading the "last 7 days" row, with the caveat that the window ends at the newest ledger row, not at `--until`. (d) UNMEASURED. **(a') specificity density and (a'') revised-share have no instrument** (checked: none in the repo).
- **Context lines, not the bar:** E's light reach (16 files by path vs 428; unpointed 99.74% vs 67.92%) and D301 (misses 27.3-36.4% of D = 33).

## Two things you must act on
1. **`draw.js` has no `h3` window, and I did not add it** (files: the runbook only). The runbook gives the exact line and a test row; without them step 1 exits 2 ("--window original|remeasure"; inferred from `draw.js:172`, not run unpatched). It has to land before 2026-10-18. Who: whoever owns `claimrec/draw.js` (E built it), in a packet.
2. **Nothing is scheduled to run the score** (inferred, unchanged from 10-10; I did not re-query `schtasks`). Someone dispatches steps 2-7 after the end time.

## Dry checks (nothing scored)
In a scratch copy, under `heavy-run.hold()`: `frame` with the added window exit 0 (604 eligible); `draw` refuses while the window is open (exit 2, writes nothing); `claimrec.js` usage exit 2; `score_base_rate.js` on the **10-10 verdict files reproduces the 10-10 score line for line** (hashes equal the score file's); `asof.test.js` exit 0; `round_time_baseline.js --until` the flip instant exit 0; E's three `m1_*.js` exit 0 (185 pairs, 19 since the flip). Counts other than those were discarded unread; the scratch folder is removed.

## Not checked
That the h3 `draw`/`assign` path runs end to end on a closed window (the 10-10 run covered it on its own); the bootstrap's own threshold in wrong-claims (only the exact binomial was computed); the CLI version on the day.

NEXT: chair dispatch E (owner of draw.js) to add the `h3` window line and test before 2026-10-18, then the draw and readers after 2026-10-18T00:34:07Z
