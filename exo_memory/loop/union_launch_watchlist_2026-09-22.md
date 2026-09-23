# UNION-AT-LAUNCH — the one-page watch-list for the keeper's first launch (D122, pane A · non-author of the build)

> **COMPLETE, and written on D. The first union-at-launch launch will be on L** (the chair, 23:0x: D is closed through the
> leave window, which publishes D's state, so L's next launch meets it). **On L, in this order:**
> 1. **`git pull`** in L's checkout FIRST, by hand — the instrument below lands with D122, and the launch's own pull comes too
>    late to take a BEFORE with it.
> 2. **§0:** set the switch on L (`setx CONSONANCE_UNION_AT_LAUNCH on`), then close Consonance fully.
> 3. **§1 `--before`** on L, with Consonance closed. The script reads L's own `~/.consonance.json`, so it runs unchanged.
> 4. Start from the shortcut. 5. **§3 `--after`**, then **§4**.
>
> **§2's `+0 rows` prediction is D's and does NOT carry to L.** On L the arriving copy is D's new publish, which holds rows L has
> never seen, so **L should merge with `+n > 0`.** That is the real test. For L the prediction is: `--after` shows `+n from the
> arriving copy` on the ledgers D wrote since `9486b30`, and nothing short. Every reading in §1 below is D's; L's baseline is
> whatever `--before` prints there.

*Measured on D, 2026-09-22 23:0x local, against HEAD `201dd2b` (the build is `a81d339`, C, D114). Every command below was
run as written and its reading printed beside it. The launch — an app restart — is the keeper's act; nothing here changes state.*

## 0 · FIRST: THE SWITCH IS OFF — a plain restart is NOT a union-at-launch launch

    reg query "HKCU\Environment" /v CONSONANCE_UNION_AT_LAUNCH     → "unable to find the specified registry key or value"
    grep -c UNION_AT_LAUNCH consonance/launch.ps1                   → 0

Only the exact value `on` turns it on (`state-sync.js:1173`), and it must be in the **app's** environment: the pull is spawned
without `env_clear` (`main.rs:11042-11045`). **As things stand, a restart repeats today's refusal of the same 8 files.**
Setting it is an environment change and is the keeper's: `setx CONSONANCE_UNION_AT_LAUNCH on`, then **close Consonance fully and
start it from the shortcut** (a terminal `set` never reaches a shortcut launch). *Afterwards, and only then, is this list live.*

## 1 · BEFORE — run these, in this order, with Consonance closed

| command | today's reading (the baseline) |
|---|---|
| `git -C <repo> log -1 --format="%h %ad"` · `git status --short` | `201dd2b` 23:01 · 3 lines (C's `map/C.md`, C's pilot hand-back, this file's script) |
| `git -C C:/Consonance/state log -1 --format=%h` | `9486b30` — L's publish of 2026-09-22 07:44 local. **If this changes before the launch, §2's prediction is void.** |
| `node consonance/tools/trip-check.js --report` | last install trip 23:58:32Z **NOT CLEAN** · installed false · head 9486b30 · **refused 8**: board, lap, precompact, resonance/atoms, return_ledger, sessionstart-state, sourced_ledger, vantage_findings |
| `ls <data>/union.lock <data>/union_receipts.jsonl` | neither exists. 9 `*.pre-union-*` backups exist (D106's, kept by STAYS rules) |
| **`node exo_memory/loop/union_launch_snapshot_2026-09-22.js --before`** | writes the multiset to `%TEMP%\consonance-union-watch\before-<stamp>.json` and prints, per ledger, lines · distinct · multiset sha256. Today: board **62,815 lines / 55,299 distinct** · sessionstart-state **8,471 / 8,230** · atoms 40,535 · sourced 6,330 · carrier-drift 4,117 · precompact 2,147 · lap 1,304 · vantage 609 · ferry 137 · return 62 · read 2 |

**The snapshot measures in `writeUnion`'s own unit (`ledger-union.js` step 7): complete lines, as a multiset.** Lines ≠ distinct
on two ledgers, so the difference between a count and a set is real here: 7,516 duplicate lines in board, 241 in sessionstart-state.

## 4 · WHAT MEANS STOP — don't keep using the app until a seat has looked

1. **`--after` prints `STOP` or exits 1.** A line that was here before the launch is not here now.
2. **A `started` with no `finished`** in `union_receipts.jsonl`, or the next launch prints *"a previous union did not finish"*.
3. **A ledger file is missing** from the data dir (the crash window between rename and link, D113 AMEND-4).
4. **`union.lock` is still there** after the app has fully started, with the pid not running.
5. **The refusal text says "exactly as it was" AND "merged before the stop" in the same run.** The merge happened; the first
   sentence is false (`:1402` and `:830` print it regardless). The data is fine, the record is not: read the receipts, not the prose.

**NOT a stop:** `+0 rows` merges (predicted, §2) · a refusal identical to today's with **no** receipts file (the switch was not
on, §0) · `COUNT-SHORT` or `KEYLESS-ARRIVING` (the file was correctly refused, and it needs a person, not a retry).

## 2 · WHAT THE LAUNCH SHOULD DO — the prediction, registered before it runs

**Arriving lines this machine does not already hold, by count: 0 in all eleven** (computed from today's snapshot). So **if the
state head is still `9486b30`, expect each of the 8 refused files to merge with `+0 rows`.** That is a *pass*, not a failure. It
also means this first launch exercises the machinery (rename, link, reconcile, receipts), not the merge of real rows (§5).

**Success, as printed** (`state-sync.js:852-855`):
`N ledger(s) held rows only this machine had. They were merged, not replaced:` · one line per file, `<path> +<n> rows (merged in <s>s)` ·
`The originals are kept beside them, and each merged file was checked against the original that is kept beside it.`
**Success, as recorded:** `sync-completion.json` → `union: { attempted, succeeded, failed, ms, merged:[…], failures:[…] }` (`:850`),
each merged entry `action: "INSTALLED-BY-UNION"` with `distinct_rows_added`, `backup`, `backup_lines`, `verified` (`:1379-1383`).
`union_receipts.jsonl` gains one **`started`** and one **`finished`** line per file (`ledger-union.js:377`, `:452`). A new
`<file>.pre-union-<stamp>` backup appears beside each merged ledger.

**The refusals it can print instead** (each falls back to today's behaviour; nothing of the state set is installed):
- `a previous union did not finish: <file> (backup …, started …)` (`:1340`) — a `started` receipt with no `finished`.
- `N append-only file(s) would lose rows, so NOTHING WAS WRITTEN …` (`:1401-1402`), possibly followed by
  `N ledger(s) here were merged before the stop … they GAINED rows` and `The union did not take N file(s): …`, one reason each:
  `eligibility` (not fast-forward / unknown mode / has a transform / no spec) · `time` (a row with no parseable time) ·
  `union` (it threw) · `verify` (missing lines or rows) · `phase2` **COUNT-SHORT** (`a row is held X× here and Y× in the arriving copy`) or
  **KEYLESS-ARRIVING** (`the arriving copy holds N line(s) that do not parse`) · `lock` (`union.lock` held).

## 3 · AFTER — the same commands, then the one comparison that decides it

    node exo_memory/loop/union_launch_snapshot_2026-09-22.js --after "<the file --before printed>"

**PASS rule, checkable by anyone: for every ledger and every line, the count AFTER ≥ the count BEFORE.** Growth is allowed and is
split into two kinds on the output: `+n from the arriving copy` (rows from the other machine) and `+n written here since` (this machine's own
writers). **Run today against a snapshot taken 12 s earlier: PASS, exit 0** (board +5, lap +1 written here since).
Also re-read `sync-completion.json` (`union.succeeded` should equal the number of refused files) and `union_receipts.jsonl`
(every `started` has its `finished`).

## 5 · WHAT THIS CAN'T SEE

- **`trip-check`'s "lost 0" is a SET test** (`trip-check.js:116-118`: `new Set(before)`, `afterSet.has`). With 7,516 duplicate
  board lines it would report a dropped copy as lost 0. **Use `--after` for the multiset verdict; use trip-check for the trip history only.**
  It also still prints that ledger-union "leaves no receipt", which is stale at HEAD.
- **After a fallback, `sync-completion.json` does not say which ledgers were merged.** The refusal branch writes no `union` field
  (`state-sync.js:837-842`); only the `why` prose and `union_receipts.jsonl` do.
- **Whether the switch was on, after a refusal.** Nothing records `union.on`. The only trace is whether receipts appeared.
- **§10a: the refusal's "N row(s) only this machine holds" is a lower bound** (DIVERGED filters with `has()`), and it does not say so.
- **Real merged rows.** With the predicted `+0`, this launch proves the machinery, not a merge. The first launch after L publishes
  new rows is the real test.
- **This machine only.** L is not measured. The snapshot hashes lines, so a sha256 collision would hide a loss (negligible, and named).
