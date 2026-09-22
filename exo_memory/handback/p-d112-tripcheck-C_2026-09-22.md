# P-D112-TRIPCHECK — C (D112 packet C, chunk 2.3, ON D, 2026-09-22 13:0x) — UNCOMMITTED

**The tool is `consonance/tools/trip-check.js`.** With `trip-check.test.js` (17/0) and `trip-check.mutants.js`
(**11 applied · 11 caught · 0 survived**, the always-clean mutant included). Nothing live was rewritten: no close, no
union write, no settings, and the data dir was only read.

    node consonance/tools/trip-check.js            # the table, exit 0 when every trip is clean, 1 when any is not
    node consonance/tools/trip-check.js --json     # one JSON row per trip
    node consonance/tools/trip-check.js --out FILE # also append the rows there; an --out INSIDE the data dir is refused

## 1 · Where each field comes from — the tools' own outputs

| trip | source | what the row carries |
|---|---|---|
| **install** | `<data>/sync-completion.json`, state-sync's own receipt | `installed`, `installed_files`, `head`, `verified`, and the `refused` list with each path's `local_only` / `incoming_only` **as the tool wrote them** |
| **union** | `<data>/<file>.pre-union-<stamp>` beside the live file | file, rows before/after, rows lost, lines before/after, the backup path, the stamp as the trip's time |
| **close** | the state repo's own commits (`git log`, `git cat-file -e`) | head sha, machine, time, and whether the head RESOLVES |

## 2 · THE FINDING THE PACKET ASKED FOR: ledger-union leaves no receipt, and a derived count is a DIFFERENT NUMBER

`ledger-union.js --write` prints its JSON to stdout and writes nothing that survives. The only durable trace is the
backup. So a union row cannot carry the tool's own count; it can only carry what the disk still shows, and **those two
numbers are not the same.** The row is stamped `counts_from_tool: false`, and the field is named
**`rows_added_since_backup`**, not `rows_added`, because that is what it measures.

Measured on D's real trips — D106's written counts against what the checker derives today:

| file | D106's union WROTE | derived now | gap |
|---|---|---|---|
| return_ledger | 43 | 45 | +2 |
| vantage_findings | 270 | 270 | 0 |
| precompact | 532 | 572 | +40 |
| sessionstart-state | 3,306 | 3,339 | +33 |
| sourced_ledger | 2,468 | 2,522 | +54 |
| carrier-drift | 1,591 | 1,591 | 0 |
| lap | 449 | 489 | +40 |
| resonance/atoms | 18,203 | 18,434 | +231 |
| board | 17,417 | 17,757 | +340 |

The gap is every row a live writer appended after the union. It is not an error in either number — it is the distance
between a receipt and a reconstruction. **carrier-drift and vantage show 0 only because nothing has written to them
since.** The board's figure moved again, 17,757 → 17,762, between two runs of the checker minutes apart.

**So the honest reading: without a receipt, "rows added by the union" is not recoverable from disk at all, at any later
time.** The fix is one append in `ledger-union.js`'s `writeUnion` — it already builds exactly that JSON — writing a row
per write. That file was not mine this lap, so it is flagged, not done. **Until it lands, criterion 2's union counts are
reconstructions, and the trip ledger says so on every row.**

## 3 · What makes a trip NOT CLEAN, and the mutant that proves the checker can fail

1. **A file overwritten** — an install reporting files installed WHILE reporting refusals contradicts stop-before-write.
2. **A refused file never unioned** — a refusal is a deferred repair; if no union of that path happened AFTER it, the
   other machine's rows are still missing. Order matters: a union BEFORE the refusal does not resolve it, and a test pins that.
3. **A count that does not match** — any row the backup held that the live file lacks (`rows_lost`), or **lines** dropped
   while the row set is intact, which is the replaced-not-unioned case.
4. **A head that does not resolve** in the state repo.

`trip-check.mutants.js` row 1 is the packet's named mutant, an always-clean checker: **CAUGHT, 7 tests red.**
Full run: `control {"pass":17,"fail":0}` then **11 applied · 11 caught · 0 survived · 0 no result · 0 NOT APPLIED**.

**Two of my own tests were too weak, and the mutants found them** — that is why the run is worth more than the count:
- *"shrinking is tolerated"* SURVIVED, and the mutant was right: on DISTINCT rows, "fewer after than before" is
  **unreachable**, because a smaller set always means a lost row, which `rows_lost` already catches. I replaced the dead
  guard with a LINES guard, which catches the real overwrite case (the live file is carried verbatim, so a union never
  removes a line), and added a test for it.
- *"one not-clean trip no longer restarts the week"* SURVIVED because my fixture's seventh day fell OUTSIDE its own
  7-day window, so the mutant and the tool agreed by accident. Fixed, and the test now holds the clean days constant and
  varies only the bad trip.
- A third, the data-dir guard, survived because it lived inside `main()` where no test could reach it. Extracted as
  `outIsInsideData()` and pinned.

## 4 · DRY RUN over the trips already on disk — the first rows are real

`node consonance/tools/trip-check.js` on D, exit 0, **11 trips, all clean**:

    clean 2026-09-09T12:17:10.533Z  close    head faf86d4 resolves true
    clean 2026-09-09T13:54:33.666Z  close    head a4cb9fe resolves true
    clean 2026-09-10T07:39:42.374Z  close    head f70d50a resolves true
    clean 2026-09-22T13:44:45.975Z  close    head 9486b30 resolves true      ← L's 07:44 close
    clean 2026-09-22T15:11:08.900Z  install  installed false · files 0 · head 9486b30 · refused 8
    clean 2026-09-22T15:39:28.025Z  union    return_ledger.jsonl  17→62
    … the nine D106 unions …
    clean 2026-09-22T15:40:00.973Z  union    board.jsonl  36647→54409

    last 7 days: 11 trip(s) · 11 clean · 0 NOT clean · 1 clean day(s) · clean week: false

- **This morning's refused install reads CLEAN, and it had to earn it**: all 8 refused paths have a union AFTER the
  refusal. Had one been left, the row would name it and the trip would be NOT CLEAN. That check is the reason the
  install and union rows have to sit in one ledger.
- **`clean week: false` is correct, not a failure**: 11 clean trips cover 1 day, and a clean week needs 7. The criterion
  cannot be met before 7 days of trips exist, which is the honest state of criterion 2 today.
- L's 07:44 close is present because its commit is in the state repo D holds.

## 5 · What could NOT be reconstructed from what the tools left behind (each an absence, and a finding)

1. **Any union's own counts.** §2. No receipt exists.
2. **Every earlier install.** `sync-completion.json` is **overwritten by each launch**, so exactly ONE install trip is
   recoverable — this morning's. Every previous install on this machine is gone as a trip. A history dir, or an
   append-only line, would fix it; not this lap's file.
3. **Which machine did a union.** The backup name carries a stamp, not a machine. The row's `machine` is `null` for
   union trips rather than guessed.
4. **Whether a close PUSHED successfully.** `state-sync.push.json` holds only the last push, and D's says
   `outcome: DRY_RUN` from 09-21. The close rows come from the state repo's commits, which prove a publish happened and
   resolves, not that a remote accepted it.
5. **Anything before the earliest surviving backup or commit.** The ledger starts where the traces start, 2026-09-09.
6. **Whether a file was overwritten by something OTHER than an install or union.** Nothing on disk records that. The
   lines guard only sees it where a `.pre-union-*` backup exists to compare against.

## 6 · Storage — checked, and LEFT UNPLACED on purpose

`consonance/state-manifest.json` has **87 glob rules and none matches a trip ledger**; there is no catch-all. A
`<data>/trip.jsonl` written today would be UNDECLARED and would turn `state-manifest.js` red, so the tool **never writes
into the data dir** and refuses an `--out` that resolves inside it (pinned by two tests and a mutant).

**Where it should live, when someone is granted the manifest:** `<data>/trip.jsonl`, class TRAVELS,
`"install": "fast-forward"`, exactly like the other eleven append-only ledgers — plus a STAYS rule for
`trip.jsonl.pre-union-*` so a future union of it is covered. I did not add either this lap.

## 7 · Checks

| check | result |
|---|---|
| `node --test consonance/tools/trip-check.test.js` | **17 pass / 0 fail** (red first: 0/1, the module did not exist) |
| `node consonance/tools/trip-check.mutants.js` | control 17/0, then **11 applied · 11 caught · 0 survived** |
| `node consonance/tools/portable-paths.js` | exit 0 |
| `node consonance/tools/trip-check.js` on D | exit 0, 11 trips, all clean |
| `node consonance/tools/js-suite.js` **run alone** | **120 green · 0 failed · 0 crashed · 0 silent · 1 canary · 1 not-run (of 122)**, 359 s — the 122nd file is `trip-check.test.js` |

**A false red, recorded because it is the more useful half.** The first suite run reported
`119 green · 1 failed`, FAILED `ledger-union.test.js`. **It was an artifact of my own overlap**: I let that suite run in
the background while `trip-check.mutants.js` ran in the foreground, and the mutant harness spawns a node process per
row. Run alone, `ledger-union.test.js` is **42/0**, and the whole suite is 120/0. This is exactly the rule my own L079
record states — *never trust a result from concurrent runs, whatever the hardware* — and I broke it within the day. The
figure above is the one run with nothing else going.

## 8 · NOT verified

- **Machine L.** The tool has never run there; L's trips are not in this ledger except the close commits D holds.
- **A NOT CLEAN trip in the wild.** Every not-clean path is proved by fixtures and mutants, never by a real bad trip —
  there has not been one on disk to find.
- **A trip row written to a file.** `--out` was exercised only by its guard tests; no ledger file was created anywhere.
- **Whether `ledger-union.test.js` has a genuine flake of its own.** Under the overlap it failed; alone it passed twice
  (42/0, and green inside the clean suite). I did not run it repeatedly to tell a contention artifact from a real
  intermittent failure, so "artifact" is the likeliest reading, not a proven one.
- No manifest rule was added, and `ledger-union.js` was not touched.

NOT COMMITTED.

NEXT: librarian collate the trip checker when p-d112-tripcheck-C_2026-09-22.md is written and the map line is appended
