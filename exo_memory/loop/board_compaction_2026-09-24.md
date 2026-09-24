# Board compaction, D131 (2026-09-24, on D, pane C): APPLIED, and it passed a multiset check

Authorized by the keeper by name ("Board compaction (item 1)", `loop/plan_after_upgrade_2026-09-22.md:69`, `d5bd9b1`).
Run against HEAD `1c0acf7`. The only thing that wrote to the board was `consonance/tools/board-compact.js`. Nobody
edited the board by hand, restarted the app, ran close.js, called the gateway, edited settings or published.

**Result: PASS.** Every row in the backup, plus every row appended after the backup, is in the new board, except
the 7,514 byte-identical repeats that the rule folds. No restore was needed.

## 1. The backup, taken first

| | |
|---|---|
| path | `C:/Consonance/data/attic/board.jsonl.pre-d131-20260924T065039Z` |
| `wc -lc` | 64,447 newlines · **78,454,980 bytes** (64,444 rows; the other 3 newlines are blank lines, see §4) |
| `sha256sum` | `7d8f15ed1d1b6a68783879b8689747cefb4d92f0e32125d5cb020e80b6293e98` |

This is a separate copy, not the tool's own attic file. The manifest keeps it: `attic/board.jsonl.*` STAYS
(`state-manifest.json:101`).

## 2. The dry run, then the apply

Command: `node consonance/tools/board-compact.js --board C:/Consonance/data/board.jsonl`, run first without and then
with `--apply`.

| run | before | after | removed | caught from the live writer |
|---|---|---|---|---|
| dry, 06:50:3xZ | 64,445 rows / 74.8 MB | 56,931 / 66.9 MB | 7,514 rows / 7.9 MB (11.7%) | 1 |
| **apply, 06:50:48 to 06:50:49Z, exit 0** | **64,446** | **56,932** | **7,514 (11.7%)** | **1** · gap 0 · late 0 |

- The tool's attic file is `C:\Consonance\data\attic\board.jsonl.2026-09-24`: 78,455,537 bytes. **It STAYS.**
- The tool printed its own check: `VERIFIED — the compacted file is the original's distinct lines in first-occurrence
  order`.
- The dry run left no tmp file behind.

## 3. The multiset check, written before the run and independent of the tool

`<scratchpad>/d131/verify.js`, run as `node verify.js <backup> <attic> <board>`. It only reads. It counts rows by
their exact line bytes, and it requires all four of these:

- **P1.** The backup is a byte prefix of the attic, so nothing was rewritten and the app only appended.
- **P2.** Every distinct attic row is in the board.
- **P3.** The board's first D rows are exactly the attic's D distinct rows, in first-occurrence order.
- **P4.** Every board row after those D rows is new, meaning it is not in the attic.

**Together these give the multiset equation.** Backup rows + rows appended afterwards = attic rows + post-swap rows.
By P3 and P4 that equals board rows + the folded repeats. The folded repeats are exactly the attic rows whose earlier
copy the attic already holds.

| run of the verifier | backup | attic | board | appended backup→swap | repeats folded | appended after swap | P1 | P2 | P3 | P4 | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| right after the apply | 64,444 rows | 64,446 rows, 56,932 distinct | 56,932 rows · 70,173,562 B · sha256 `6749e8a9…6839` | 2 | 7,514 | 0 | true | 0 | exact | 0 | **PASS** |
| again, 06:52:31Z | same | same, sha256 `553d0ea7f505bb201bb0fcaddb530ce188096d0dcf5984a5ccc9e3c48f1fbfd1` | 56,933 rows · 70,187,390 B · sha256 `a4120715…e984` | 2 | 7,514 | **1** | true | 0 | exact | 0 | **PASS** |

The arithmetic: 64,444 + 2 = 64,446 = 56,932 + 7,514. The second run shows the live writer landing one row on the new
board after the swap, as expected.

The two "appended backup→swap" rows break down like this. One was written between my backup and the tool's first
read: the backup has 64,444 rows and the tool read 64,445. The tool caught the other one live, with `catchUp`.

## 4. Blank lines

The attic has 64,449 newlines, and 3 of them are blank lines. The new board has 56,932 newlines and no blank lines.
The rule drops a blank line because it is not a row.

That is why `wc -l` on the backup (64,447) is three more than its row count (64,444). No row was lost.

## 5. What guarantees a row written during the swap is not lost

The app opens the board fresh for every write, with `OpenOptions::new().create(true).append(true)` and then
`writeln!`, at the three `board_push` sites in `main.rs`. It holds no handle open between writes. The tool uses three
layers (`consonance/tools/board-compact.js`):

1. **Catch-up before the swap** (`catchUp`, `:130-138`). This re-reads from the last byte consumed up to the current
   end and carries the surviving rows. **This run: 1 row.**
2. **Gap rows** (`:341-351`). The tool renames board → attic and then tmp → board. If the app re-creates `board.jsonl`
   between those two renames, the tool carries those rows into tmp before the second rename. **This run: 0.**
3. **Late rows** (`:353-362`). Anything appended to the original after the tool's last read is now frozen in the
   attic, so the tool reads it from there and appends it. **This run: 0.**

**What is left: windows of microseconds, not guaranteed closed by the tool alone.**

- A `writeln!` could run through a handle that was opened just before the first rename and finish after the tool's
  attic-size read. That row would sit in the attic but not in the board.
- A row could be written into a re-created board between the gap read and the `unlinkSync`.

**The backstop for both cases is §3.** Either case shows up as P2 > 0: a distinct attic row missing from the board.
The run found P2 = 0.

**A caveat in the tool.** If `verifyPair` refuses, its message tells you to restore by moving the attic back over the
board (`:371`). That would drop any row appended to the new board after the swap. Restore by the multiset check
instead: put the backup or the attic back, then append the new board's post-swap tail.

## 6. The readers

| reader | command | result |
|---|---|---|
| trip-check | `CONSONANCE_DATA=C:/Consonance/data node consonance/tools/trip-check.js --report` | runs: "last 7 days: 15 trip(s) · 12 clean · 3 NOT clean … clean week: false". The 3 not-clean trips are older than this run: `install … refused 8` rows at 2026-09-22T23:58Z and 2026-09-23T21:01Z/21:02Z (the union switch was off). |
| chain-status | `node consonance/tools/chain-status.js` | prints its chain line normally (D131 DISPATCHED …) |
| board-digest hook | stdin `{"session_id":"fx-sess","cwd":"<fixture>/inst/fx-pane","prompt":"hello"}` with `CONSONANCE_DATA` and `CONSONANCE_INSTANCES` set to temp fixtures | exit 0, empty stderr, 1,693 B `UserPromptSubmit` digest, on **(a)** a 300-row tail of the new board, run twice, and **(b)** a full copy of the compacted board (56,933 rows). The fixtures stayed in scratch; the real `digest_state.json` was not touched. |

**Nothing holds a byte offset into the board.**

- `board-digest.js` reads the tail from the file's current size on every run. `grep -c offset` finds 0 matches.
  `digest_state.json` stores per-session **timestamps** (`seen`), not offsets. Its fixture copy holds epoch-ms values.
- `C:/Consonance/data/tailer-offsets.json` holds offsets into the seats' **transcripts**, not the board. Compaction
  cannot move them.
- trip-check, chain-status and the other tools read the whole board.

So no offset needed recovering. The digest was run on a fixture of the compacted board to show that anyway.

## NOT verified

- **The app's own reader after the rebuild.** The Rust side reads the board when the app runs. The app was not
  restarted (FORBIDDEN), so the app reading the compacted file is untested until the keeper's rebuild.
- **The residual swap windows in §5.** They are closed by the check after the fact, not by construction.
- **The other machine.** Compacting D's board changes D's copy only. How the union with L treats a compacted board
  (a set of rows, now without repeats) was not tested here.
