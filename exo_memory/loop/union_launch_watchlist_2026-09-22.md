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


---

## D ADDENDUM — 2026-09-24 (D132, pane B · non-author of the union build). APPENDED; everything above, the L box included, is unchanged.

> **VERDICT FOR D: THE UNION IS CLEAN, THE SWITCH IS NOT SAFE TO SET YET.** The dry run merges all 8 refused ledgers
> with **+0 rows and 0 lines lost**. But on D, a union that *succeeds* is what lets the launch **install L's 09-22 state
> set over D's newer files and MIGRATE D's fixed seats onto L's 09-22 tails**. Today the 8 ledger refusals are the only
> thing stopping that. **Precondition for setting `CONSONANCE_UNION_AT_LAUNCH` on D: the state head is D-authored**
> (`state-set.json` `machine: "D"`, which is A's publish fix landing and pushing), **or** the keeper *intends* D to become
> L's 09-22 house. Until one of those is true, leave the switch OFF on D.

### D-1 · BEFORE, on D — taken with the app OPEN and writing (so each reading has its time)

| time (UTC) | command | reading |
|---|---|---|
| 23:08:18 | `git log -1 --format="%h %ad"` · `git status --short \| wc -l` | `cd02abb` 17:05 local · 0 |
| 23:08:18 | `git -C C:/Consonance/state log -1 --format=%h` | **`9486b30`** — L's publish of 09-22 07:44 local (`state-set.json` `machine: "L"`) |
| 23:08:18 | `reg query "HKCU\Environment" /v CONSONANCE_UNION_AT_LAUNCH` · `grep -c UNION_AT_LAUNCH consonance/launch.ps1` | not found · 0 — **the switch is OFF** |
| 23:08:18 | `ls <data>/union.lock <data>/union_receipts.jsonl` · `ls <data> \| grep -c pre-union-` | neither exists · 8 `*.pre-union-*` backups (D106's) |
| 23:08:18 | `node consonance/tools/trip-check.js --report` | newest trips: **NOT CLEAN** 2026-09-23 21:01:50Z and 21:02:40Z — `installed false · head 9486b30 · refused 8` (board, lap, precompact, atoms, return_ledger, sessionstart-state, sourced_ledger, vantage_findings) |
| 23:08:25 | **`node exo_memory/loop/union_launch_snapshot_2026-09-22.js --before`** | `%TEMP%\consonance-union-watch\before-2026-09-24T23-08-25-582Z.json`. board **57,298 / 57,298 distinct** (C's `5a5dd98` compaction: no repeated lines left) · atoms 40,982 · sessionstart-state **8,512 / 8,269** · sourced 6,546 · carrier-drift 4,117 · precompact 2,203 · lap 1,366 · vantage 628 · ferry 137 · return 65 · read 2 |

`sync-completion.json` (22:54:26Z): `verified true · installed false · stage install · head 9486b30`, 8 refused. The app
started as **LOCAL HOUSE** because of that refusal.

### D-2 · THE DRY RUN — the launch's own path, per file, on a TEMP COPY (`exo_memory/loop/union_dryrun_D_2026-09-24.js`)

It copies each fast-forward ledger (and its `attic/pre-sync-2026-09-09T14-59-05-515Z` copy, which `writeUnion` also reads)
to a temp dir, and reads the state dir in place, read only. Then, with the launch's own functions in the launch's order:
`appendOnlyCompare` → `timeParseRefusal` → `LU.writeUnion` (`lock: null`, `settleMs: 0`, receipts in temp) → `phase2` →
`unionVerdict`. It adds its own multiset check in step 7's unit. **Run at 23:10:17Z. The live data dir held no `union.lock`
and no `union_receipts.jsonl` before or after.**

| file | pre-scan | lines before→after | + rows (from arriving / attic-only) | lines lost (multiset) | phase2 | verdict |
|---|---|---|---|---|---|---|
| board | DIVERGED | 57,310 → 57,310 | +0 (0/0) | **0** | ok | MERGED |
| lap | DIVERGED | 1,366 → 1,366 | +0 | **0** | ok | MERGED |
| precompact | DIVERGED | 2,207 → 2,207 | +0 | **0** | ok | MERGED |
| sessionstart-state | DIVERGED | 8,512 → 8,512 | +0 | **0** | ok | MERGED |
| sourced_ledger | DIVERGED | 6,548 → 6,548 | +0 | **0** | ok | MERGED |
| return_ledger | DIVERGED | 65 → 65 | +0 | **0** | ok | MERGED |
| vantage_findings | DIVERGED | 628 → 628 | +0 | **0** | ok | MERGED |
| resonance/atoms | DIVERGED | 40,990 → 40,990 | +0 | **0** | ok | MERGED |
| carrier-drift · ferry · read_ledger | IDENTICAL | — | — | — | — | not refused |

**+0 everywhere** because every row of L's `9486b30` copy is already on D (D106's union of 09-22 15:40 brought them in).
So, as §2 said of D, this launch would exercise the machinery, not a merge of real rows.

**THE BOARD AND C's COMPACTION, the case the packet asked about: a row D folded and L still holds twice.**
- **By the code:** `union()` adds one row per canonical key the live file LACKS, so a key D already holds adds nothing, and D keeps its one copy.
- `phase2(a)` then requires **local count ≥ arriving count per key**, so that row is **COUNT-SHORT**. The board is refused, and by stop-before-write **the whole install is refused**. Nothing is lost; the code's own words are "this file needs a person, not another union".
- **Measured today, it does not arise:** L's arriving board holds **35,427 rows / 35,427 distinct keys, 0 keys held twice**, and **0 keys the arriving copy holds more times than D** (the same is true of all 8 files; sessionstart-state's repeats run the safe way, D 236 keys held 2+ against L's 23). C's 7,514 folded repeats were D-only.
- **When it WOULD bite:** a future L publish whose board carries repeats that D has folded, for example if L's own board has repeated rows since 09-22. That's not measurable from D; the next L publish is the place to look.

### D-3 · WHY THE SWITCH IS NOT SAFE ON D TODAY — the launch sequence, not the union

`sync_at_launch` (`main.rs` ~11859-11895) runs `--pull` (verify only), reads `sync-completion.json`'s `pushed_by`
(`v.index.machine` = **L**), and, because that is not this machine, runs **`--install`**. Its own comment says: "a
WHOLE-FILE OVERWRITE of the data dir from the state tree, with no recency test anywhere in it". Its protection covers only
"the machine that authored the state". **D authored nothing since 09-10.**

**Today:** the install refuses the 8 ledgers, exits 1, `Pull::Failed`, and the verdict is **LOCAL HOUSE** (`sync_launch.rs:258-265`). D keeps its own house.

**With the switch on:** the 8 merge (D-2), nothing is refused, and the install **succeeds**. `sync-completion.json` then says
`installed: true, pushed_by: "L"`, so `decide()` returns **MIGRATE** (`sync_launch.rs:350-359`): it retires D's transcripts
for the fixed-id seats and wakes them from the synced tails, **which are L's of 09-22**. The same install writes L's copy over
**17 other files that differ** (measured, `<B scratch>/d132/install_diff.js`; D's copies go to `attic/pre-sync-<stamp>/`, so
they are recoverable):

| file | D now | L's `9486b30` copy |
|---|---|---|
| `captures/0c0c0c0b-…115b.txt` (librarian) | 4,222,393 B · 23:10Z today | 966,228 B |
| `captures/0c0c0c0a-…0a01.txt` (chair) | 6,669,389 B · 23:07Z today | 5,012,612 B |
| `captures/` a2122153, 0845a868, 12fb81f6, 6fe15f0a (panes) | 28–45 KB · today | 9–16 KB |
| `vantage_runs.log`, `vantage_watermark.json`, 7 × `return_state/*.json` | newer on D | older |
| `panes.json`, `dispatch-gate.jsonl` | D's are 09-09 | L's 09-22 |

That is not a union defect; `writeUnion` did exactly its job. **It is the union removing the one refusal that was keeping
an older foreign publish off a machine with newer unpublished work.**

### D-4 · WHAT D's LAUNCH SHOULD PRINT, ONCE THE PRECONDITION HOLDS

- **When the head is D-authored** (A's publish fix has landed and pushed): phase one finds `pushed_by: "D"`, the record is **ours**, `--install` never runs, and the verdict is **`RESUME`** — "the record's head was authored by this machine (D)". **The union does not run at all**, because it lives inside the install. On D the switch is then inert until a foreign head arrives. That is correct, and it's the right state to set it in.
- **When a NEWER L head arrives** (the keeper worked on L, published, and came back to D — the intended move):
  - the success lines of §2: `N ledger(s) held rows only this machine had. They were merged, not replaced:`, each `<path> +<n> rows`, where +n is the rows L wrote;
  - then the install of L's other files;
  - then **`MIGRATE`** — "the record's head was authored by L". That is the move, and it is intended.

### D-5 · PASS RULE ON D

1. `--after` against the D-1 snapshot prints **PASS, exit 0**: every line held before is still held, at least as many times.
2. `union.succeeded` in `sync-completion.json` equals the number of refused files; every `started` in `union_receipts.jsonl` has its `finished`; each merged entry `verified: true`.
3. **The verdict row matches the intent:** `RESUME` when D authored the head; `MIGRATE` **only** when the arriving head is newer work from L that the keeper meant to carry over.

### D-6 · WHAT MEANS STOP ON D — in addition to §4 above

1. **A `MIGRATE` row on D when D was the last machine worked on** (the arriving head is older than D's own last work). Today's `9486b30` is exactly that. Stop and restore D's displaced files from `attic/pre-sync-<stamp>/`.
2. **The switch set on D while `state-set.json` still says `machine: "L"` at `9486b30`.** Do not launch; unset it, or land D's publish first.
3. **`--after` shows any board key short** (COUNT-SHORT printed, or `STOP` from the snapshot), including after a future L publish carrying repeats D has folded (D-2).

### D-7 · WHAT THIS DOES NOT SEE

- L's live board and ledgers after 09-22: only L's published copy is on D.
- Whether A's publish fix will write `machine: "D"` into `state-set.json`. D-4 assumes it does, as `--push` has before (the index at `f70d50a` was D's).
- A real launch. Nothing was installed, restarted or set. The dry run used the launch's functions, not the launch.
