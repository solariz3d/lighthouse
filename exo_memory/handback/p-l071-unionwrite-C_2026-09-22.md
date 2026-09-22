# P-L071-UNIONWRITE — C (CHARLIE), L071 packet C (step 5), on L — the union WRITE

**Packet:** (1) dry run against the live files; (2) only then write, by the board-compact swap, with no row appended
between read and swap lost; whole-row key, no renaming, attic untouched, a backup of each live file beside it; report the
written counts against the dry run; the eight double-open ids stay. **Both done and verified. Code uncommitted.**

## 0 · THE ANSWER

1. **Written, both files, verified by the tool AND by an independent check that shares none of its code** (§3):
   - `lap.jsonl`: **506 → 720 lines. +214, exactly the dry run's 214.**
   - `board.jsonl`: **31,749 → 35,101 lines. +3,352, exactly the dry run's 3,352.**
   - Every original line is in the new file **in its original order**, both backups are **byte-identical** to the
     pre-write snapshots, **all 29 attic copies are byte-identical**, and the **257 fused board lines survived**.
2. **The live file is kept verbatim, NOT re-sorted.** This corrects my own L070 §3 design, which proposed writing the
   sorted union. **That would have dropped the 257 fused board lines** (a union of parsed rows has no place for them)
   **and reordered every live row** that `lap-row`'s position-based readers depend on. Only the attic-only rows are
   interleaved, each before the first live line with a later time.
3. **No row appended during the swap can be lost** (§2). This uses `board-compact`'s protocol with its one residual
   window **closed**: the new file is placed with `fs.linkSync`, which **fails rather than overwrite** a path a writer
   re-created. Each of the four ways a row can arrive has its own test, **including a real concurrent writer process**.
4. **In the real run no writer appended during either swap** (caught up 0, reconciled 0, gaps 0; each took about 13 s
   at 02:47 local). So the real run did **not** exercise the concurrency protocol; the tests do. **The writers resumed
   normally:** a new row from A's pane landed in the new board at 08:47:38.117Z, a second after the write ended.
5. **The keeper's condition holds:** exactly **8** ids with more than one open row, **L058×8, L059×5, L060–L065×3**,
   the counts L070 §3.4 predicted. Nothing renamed, nothing deleted.
6. **Found, not mine to edit now:** `portable-paths` is RED on `jev-shadow-runner.test.js:311`, **a literal I wrote in
   D104** (§5).

## 1 · (1) THE DRY RUN, against the live files at 02:4x

`node consonance/tools/ledger-union.js --data C:/Consonance/data --out <scratch>/union` (scratch `l071/dryrun.txt`)

| | sources | live distinct | union distinct | **rows to add** | invalid lines | invalid lines held only by an attic copy |
|---|---|---:|---:|---:|---:|---:|
| `lap.jsonl` | 1 live + 8 attic | 504 | 718 | **214** (73,130 B) | 0 | 0 |
| `board.jsonl` | 1 live + 21 attic | 31,476 | 34,828 | **3,352** (3,067,014 B) | 257 in live (5,397 across all copies) | 0 |

- **Lap to add, by id:** L058 60 · L059 47 · L060 23 · L061 27 · L062 17 · L063 14 · L064 13 · L065 13, the same as L070's.
  The live files grew since L070 only by new rows (lap 493 → 504, board 30,871 → 31,476 distinct), and the rows to add
  are unchanged.
- **Duplicates:** lap 419 rows held by 2+ sources; board 29,916 held by 2+ sources and 833 repeated within one source
  (all in `pre-sync-2026-09-14T11-14`). Each is kept once. The narrow key (lap, stage|chain, at) keeps nothing apart that
  the whole-row key merges (lap: 718 = 718).
- **22** `pre-sync-*` dirs exist (one more than L070's 21), but **the board has 21 attic copies and the lap 8**. The new
  dir holds neither file; I did not check what it holds.

## 2 · (2) THE WRITE: how no concurrent row can be lost, and how that is shown

**How the writers write, read first:** the app opens `board.jsonl` **per write** (`OpenOptions::new().create(true).append(true)`,
`main.rs:2127/2141/2159`) and closes it at scope end. `lap-row.js` and the JS writers use `appendFileSync`. That gives
**four arrival cases**, and `writeUnion` in `ledger-union.js` has one step for each:

| step | what it does | the arrival case it covers | test |
|---|---|---|---|
| (1) read | complete lines only; a partial last line waits | a writer mid-line at read time | *"a PARTIAL last line … comes through once, intact"* |
| (2) build | the live lines **verbatim, in order** (fused ones included), with attic-only rows' **raw bytes** interleaved by time into a temp file | — | verbatim/order, fused-in-place, no-renaming, interleave tests |
| (3) catch up | re-reads the live tail and appends it to the temp file until a pass finds nothing | rows appended after the read or after the build | *"after the live file was read"*, *"after the union was written"*, and **"the new file never goes BACKWARDS"** |
| (4) freeze | `rename(live → <file>.pre-union-<stamp>)`: **the backup beside it**, and from here only read | — | *"the original is kept byte-for-byte BESIDE the live file"* |
| (5) place | **`fs.linkSync(temp → live)`**, which fails with EEXIST if a writer re-created the path. That file is renamed to `<file>.gap-N-<stamp>` and the link is retried | a write after the freeze **re-creates** the live path | *"a writer that RE-CREATES the live path … loses nothing (the gap)"* |
| (6) reconcile | after a settle (1.5 s), appends whatever reached the frozen original past the read offset, plus every gap file's lines; repeated until a pass moves nothing. A partial line left then is carried as a line | a write **in flight into the renamed original** (delete-sharing on Windows) | *"a write still in flight into the FROZEN original …"*, *"a writer that DIED mid-line …"* |
| (7) verify | every line of the backup and of every gap file must be in the result (as a multiset), and every union row | — | *"the verification can FAIL"* |

**The real-process test:** a separate node process appends rows in a tight loop for 1.5 s while `writeUnion` runs.
Every row it wrote is in the result, along with all 50 attic rows. The test asserts the writer actually wrote more than
50 rows, so it cannot pass vacuously.

**Why `linkSync` and not `board-compact`'s rename:** `board-compact.js:346-351` checks for a re-created board and then
`renameSync(tmp, board)`, which on Windows **replaces** an existing file. A writer landing between the check and the
rename would be overwritten. A hard link never replaces anything, so that window does not exist here. **Mutant 2 swaps
the link back for a rename and is caught** (§4).

**Refusals:** an existing backup or temp name is never overwritten (it throws before anything is touched). If the link
cannot be placed, it throws **naming where everything is** (original, union, gaps) and deletes nothing.

## 3 · THE WRITTEN COUNTS against the dry run, and the independent check

`node consonance/tools/ledger-union.js --data C:/Consonance/data --write --file lap`, then `--file board`
(outputs in scratch `l071/write-{lap,board}.json`):

| | lines read | **added** | dry run said | caught up | reconciled | gaps | final lines | union distinct | missing lines / rows | verified |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| lap (08:47:16Z) | 506 | **214** | 214 | 0 | 0 | 0 | 720 | 720 | 0 / 0 | **true** |
| board (08:47:24–37Z) | 31,749 | **3,352** | 3,352 | 0 | 0 | 0 | 35,101 | 34,844 | 0 / 0 | **true** |

Lines read exceed the dry run's counts only by rows written since: lap 504 → 506 from the chair's `lap-row`, and the
board grew by 16 lines. The board's union-distinct 34,844 = 31,749 lines − 257 fused + 3,352.

**The independent check** (scratch `l071/verify.js`, which **shares no code with `ledger-union.js`**):

| check | lap | board |
|---|---|---|
| backup sha256 = the pre-write snapshot | `764fdaccdb894406` ✓ | `2ecf9ef185687cf9` ✓ |
| original lines found **in order** inside the new file | 506 of 506 | 31,749 of 31,749 |
| lines beyond the original | 214 | 3,353 |
| … valid JSON / already in the original / repeated | 214 / 0 / 0 | 3,353 / 0 / 0 |
| … found in an attic copy | 214 | **3,352** |
| unparseable lines before / after | 0 / 0 | **257 / 257** |

**The one board line not from an attic copy** is the new file's last line: pane `6fe15f0a` (A), ts **08:47:38.117Z**,
after the write ended at 08:47:37Z. That's a live append into the new file, which shows the writers carried on normally.
(The script's own "appended since" figure printed 0; its formula counts every non-original line as "beyond". The line was
identified by hand, above.)

**Attic untouched:** the sha256 list of all 29 attic `lap.jsonl`/`board.jsonl` copies was taken before the write and
after, and `cmp` says they are identical. No `.gap-*` or `.union-*.tmp` file was left.

**The files now beside the live ones:** `C:\Consonance\data\lap.jsonl.pre-union-2026-09-22T08-47-16-301Z` and
`…\board.jsonl.pre-union-2026-09-22T08-47-24-570Z`. **Neither has a manifest rule**, so `close.js --check` may call them
UNPLACED. They are A's to classify (STAYS, I'd suggest: a local backup). I did not run `close --check`.

## 4 · TESTS AND MUTANTS

`node --test consonance/tools/ledger-union.test.js` → **25 / 0**, stable across 3 plain runs and 1 `--test-concurrency=1`
(before the last test was added, 22/0 × 4). **Red first:** 9 pass / 13 fail with `writeUnion` absent.

**One existing test was changed, and this is it:** my own L070 test `the CLI has no --write` asserted exactly what this
packet authorises changing. It is replaced by *"--write refuses without an explicit single --file"* (`lap` or `board`,
never `both`: both live files are never rewritten by accident). Every other L070 test is untouched and green.

**Mutants** (scratch `l071/mutants.js`, temp copies, compile-gated, a timed-out test counted as not passing):

| # | mutant | result |
|---|---|---|
| 1 | the catch-up reads nothing | CAUGHT, **only after a new test** (below) |
| 2 | the union placed by **rename over** the live path (`board-compact`'s window) | CAUGHT (14 fail) |
| 3 | gap files not carried in | CAUGHT |
| 4 | the frozen original not reconciled | CAUGHT |
| 5 | a dead writer's partial line dropped | CAUGHT |
| 6 | fused lines dropped | CAUGHT |
| 7 | the existing-backup guard removed | CAUGHT |
| 8 | the verification always passes | CAUGHT |
| 9 | attic-only rows not added | CAUGHT |
| 10 | attic rows appended at the end, not interleaved | CAUGHT |
| 11 | the live file reordered | CAUGHT |
| 12 | `--write` accepts both files | CAUGHT |

**12 applied · 12 caught · 0 survived · 0 no result · 0 NOT APPLIED.**

**Mutant 1 survived the first run, and was right to.** With the catch-up disabled, no row is lost, because the reconcile
recovers pre-freeze rows from the frozen original. What the catch-up buys is that **the new file never appears with
fewer rows than the old one**. Without it, for the whole settle window, a reader such as `board-digest` would see a
board missing its newest rows. That property is now a test (*"the new file never goes BACKWARDS"*), and the mutant is
caught.

**Two paths were untested until mutant planning found them:** the dead-writer partial line, and verification failing.
Both got a test before the mutants ran.

**Whole suite, plain:** `node consonance/tools/js-suite.js` → **112 green · 4 failed · 0 silent (of 117)**, with
`ledger-union.test.js` `ok`. The failures: `carrier-drift.test`, `gen-consumer.test`, `stick-waiter` (A's `3d89dfb`,
unowned per the librarian), and **`portable-paths.test` (§5, mine from D104)**.

## 5 · FOUND: my D104 literal is RED in portable-paths, and why I have not fixed it here

`node consonance/tools/portable-paths.js` → RED, one site: **`consonance/tools/jev-shadow-runner.test.js:311`**,
`R.defaultStore({ LOCALAPPDATA: 'C:\\X\\Local' })`, classed **DRIVE / BENIGN-TEST**. **I wrote it in D104.** It went red
when the file was landed and tracked: **the same untracked-file trap I wrote up in D104 §5.3**. I fixed the one file
that had tripped it and did not sweep my other new files for the same pattern.

**Not edited here:** A has uncommitted changes in that very file right now (`git diff --stat`: +67/−3), and this packet
puts A on the Jev files. **The fix, for A or a later packet:** use a non-drive fake (`LOCALAPPDATA: '/fake/Local'`), which
keeps the test's meaning, or add a BENIGN-TEST baseline row.

## 6 · NOT VERIFIED

1. **The concurrency protocol under real load on the real files.** No writer appended during either real swap. It is
   exercised by the tests, including a real concurrent process, not by this run.
2. **`close.js --check` after the write.** The two `.pre-union-*` backups have no manifest rule (§3).
3. **What the 22nd `pre-sync-*` dir holds.** It has neither ledger.
4. **The next install's view of the new files.** The refused install recorded 80 lap and 1,5xx board rows as
   local-ahead. After the union, the local files are still supersets of the state set's, so the next launch should refuse
   again rather than overwrite. That is inferred from A's fast-forward rule, not run.
5. **`lap-row.js report`'s own DOUBLE-OPEN labels.** I counted open rows per id from the ledger directly and did not
   confirm which `lap-row` subcommand prints the integrity column.

## 7 · FILES

| file | change | lines | sha256 (first 16) |
|---|---|---:|---|
| `consonance/tools/ledger-union.js` | `writeUnion`, `completeLines`, `--write --file`; rows carry their raw line; header updated | 340 | `02007f8ad625131b` |
| `consonance/tools/ledger-union.test.js` | 15 write tests, 1 CLI test replaced (§4), the `spawn` import | 248 | `a8c9acccc2f75440` |
| `C:\Consonance\data\lap.jsonl`, `board.jsonl` | **the write** | 720 / 35,101 (+live appends) | — |
| `…\lap.jsonl.pre-union-2026-09-22T08-47-16-301Z` | backup = the original | 506 | `764fdaccdb894406` |
| `…\board.jsonl.pre-union-2026-09-22T08-47-24-570Z` | backup = the original | 31,749 | `2ecf9ef185687cf9` |
