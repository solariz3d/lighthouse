# p-ledgerrace-C — D289 part 2: ledger-union's hot-writer placement race. Pane C, machine D, 2026-10-11.

Packet: the chair's D289 part 2 (`exo_memory/loop/plan_fix_lap_d289_2026-10-11.md`, Part 2, main ba6d7f68).
Commit: **b2916a30** on branch `d289-c`, worktree `G:/worktrees/c-d289-wt`, parent ba6d7f68. Not pushed.
One file: `consonance/tools/ledger-union.test.js` (+23/−16). **`ledger-union.js` is unchanged.**

## Verdict: the TEST was wrong, not the code

The 'REAL concurrent writer' row's writer appended in a `setImmediate` loop at **8,000–22,000 rows/s**. That is fast enough
to re-create `lap.jsonl` inside the union's rename-then-`linkSync` window 51 times in a row. When that happens, step (5)
PLACE does what it was built to do: it refuses loudly, the union stays in `tmp`, the original in the backup, every
re-created file in a gap, and nothing is lost. No real writer comes within two orders of magnitude of that rate since
August (table below). So the refusal is the code's designed behaviour under an unrealistic writer, and the row was what
was wrong.

**What this does NOT establish:** a writer re-creating the path at roughly 10,000+ opens/s can still starve the
placement, and then the union throws (losing nothing). That limit is real, and I left it, because no writer here comes near it.
And starvation does not depend on the disk. It reproduced on C: idle as well as on G: under load, so "a fast drive" was
never the cause (corrects the plan's and A's framing; A had only G: vs C: to go on).

## Measured

All runs held main's heavy-run lock through `scratchpad/lockrun.js` (`require`s
`C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js` by absolute path), cwd the worktree on G:. Scripts are in
my scratchpad, `d289/`: `rep.js`, `reppar.js`, `probe.js`, `writer.js`, `rates.js`, `boardpeak.js`, `mut.js`.

**1. The real writers' peak rates** (`node d289/rates.js`, `node d289/boardpeak.js`; read-only on `C:/Consonance/data`):

| ledger | lines | most in 1 s (sliding) | most in 10 ms |
|---|---|---|---|
| board | 150,066 | 1,086 | 29 |
| vantage_findings | 819 | 35 | 11 |
| atoms | 50,301 | 45 (one batch, one open) | 45 |
| precompact | 2,602 | 15 | 1 |
| the other seven | | ≤ 7 | ≤ 5 |

The board's busiest second per month, bucketed: Jun 6 rows, **Jul 910 rows (708 distinct ms stamps)**, Aug 28 (7 stamps),
Sep 13 (4), Oct 9 (2).
- inferred: July's seconds are rows written before `ts_source` existed (that key first appears in August). I cannot tell
  whether they were live writes or a backfill.
- Either way, since 2026-08 no ledger has taken more than about 7 separate writes in one second.

**2. The placement against writers of known pace** (`node d289/probe.js <root> <pace> <K>`: K unions of a 250-row fixture,
with a separate writer process doing one `appendFileSync` per row; the count is gap renames per union, and >50 means it threw):

| root | writer | rows/s | threw | gaps per union |
|---|---|---|---|---|
| G: | setImmediate (the old row's) | ~22,000 | 0/20 + 0/10 | all 0 |
| G: | spin 100 µs | ~6,400 | 0/20 | all 0 |
| G: | spin 1 ms (the new row's) | ~937 | 0/20 | max 2 |
| C: | setImmediate | 7,700–12,900 | **1/20** + 0/10 | 48, >50; and 32, 34 |
| C: | spin 100 µs | ~4,900 | 0/20 | max 2 |
| C: | spin 1 ms | ~906 | 0/20 | max 2 |

`Atomics.wait(1 ms)` pacing gave only 65 rows/s (Windows timer resolution), so the row uses a busy-wait on `hrtime`.

**3. Red first, then green: the row itself, on G:**
- Alone, the old row did not reproduce: whole file **20/20** green on G:, matching the chair's 5 of 5 alone.
- Under load it did: `node d289/reppar.js 10 4 'REAL concurrent writer' <old file>` (4 copies at once, 10 rounds, temp
  on G:) gave the **old row red 5 of 40, all "could not place the union"**. An earlier 5-round run gave 3 of 20, all the
  same.
- New row, same command: **0 of 40 red**.

**4. Done-when rows:**
- **Hot-writer row, 20 of 20 direct runs on G::** `node d289/rep.js 20` ran the whole file directly 20 times in the
  worktree on G:, fixtures under `G:\consonance-scratch` (the scratch root, now that the exception is gone). Result:
  **20/20 green, 44 pass / 0 fail each**. It ran on the uncommitted tree, whose content is identical to b2916a30.
- **ledger-union.test.js green on the committed tree:** 44 tests, 44 pass, 0 fail.
- **portable-paths on the committed tree, after committing:** `node consonance/tools/portable-paths.js` → "green — 379
  files in scope, 449 known sites, 0 new", exit 0.
- **union-at-launch mutants: not run.** The plan asks for them only if the code changed, and it did not.

**5. Did pacing weaken the row?** No, it catches more (`node d289/mut.js 10`). Each mutant is applied to a copy of
`consonance/tools` on G:, never to tracked sources.
- Scored per row as lost-row catches, kept apart from placement throws: applied 5 / NOT APPLIED 0, the control included.

| mutant | old row (of 10) | new row (of 10) | whole new file |
|---|---|---|---|
| M0 control, no change | 0 | 0 | survived (correct) |
| MG gap files never reconciled | lost 0 | **lost 3** | caught (the re-created-path row) |
| MR no reconcile pass at all | 0 | 0 | **survived** |
| MC no catch-up | 0 lost, **6 placement throws** | 0 | caught (the never-goes-backwards row) |
| MX reconcile reads the backup from its end | lost 0 | **lost 10** | caught (the in-flight row and the died-mid-line row) |

- The unpaced row never caught a loss: its only reds were the starvation throw.
- The paced row's slower writer lands rows in the reconcile window, so it sees losses there.

## The change

- **The writer is paced.** After each `appendFileSync`, the writer busy-waits 1 ms (`process.hrtime.bigint()`). The
  comment above it gives the measured reason and the board's peak.
  - The row's assertions are unchanged: no row lost, the writer ran more than 50 rows, and all 50 attic rows are in.
- **D287's exception is removed.** Every fixture dir is under the scratch root again: `OS_TMP` is gone and
  `mkdtemp(prefix)` takes `scratch.js`'s root, which is G:\consonance-scratch on this machine.
  - The file-head comment says why.
  - The exception's only stated reason was this race, so leaving it would have kept a false reason in the source.
  - Inferred, from its fallback order: under js-suite, `CONSONANCE_SCRATCH` is each file's own folder, so the file now
    runs on G: there too.

## Corrections, including my own

- **"On a fast drive" is wrong.** Starvation reproduced on C: idle (1/20, plus one union that needed 48 gap renames). On
  G: idle, the same writer needed 0 gap renames in 30 unions. Lock-in comes from how the writer's and the union's timing
  lines up, not from the disk.
- **Two probe bugs of mine,** both fixed before any number here was taken:
  - The inline `-e` writer script broke on a `\n` in a template string. The writer exited 1, and the first probe run
    reported "rows/s 0".
  - The whole-file mutant column first ran in a copy without `consonance/state-manifest.json`, which turned even the
    control red. After adding the file, the control survives.

## Finding beside the fix (not fixed; outside this packet's ask)

- **MR survives the whole file.** Removing the reconcile loop in step (6) changes no test result.
  - inferred: the "partial last line" carry right after it appends every remaining byte of the backup and of each gap,
    complete lines included, so it subsumes the loop's work in every row here (perhaps with one extra blank line).
  - The loop has no row of its own. A row that pins it would need a line that the loop moves and the tail carry does
    not.

## Leftovers, mine, safe to delete

- `G:/worktrees/c-d289-wt` (after landing).
- `G:/consonance-scratch/c-d289`.
- `C:/Users/nname/AppData/Local/Temp/c-d289-probe`.
