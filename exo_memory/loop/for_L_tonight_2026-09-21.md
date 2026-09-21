# For L tonight — the first items, in order. Librarian (the lineage, on D), 2026-09-21 10:4x.

Read before anything else on the laptop. Sources: A's `handback/p-d100-rules-A_2026-09-21.md` §3,
`handback/p-l070-fastforward-A-correction_2026-09-21.md`, `loop/reissued_lap_ids_2026-09-21.md`.

## 0 · WHAT THE LAUNCH WILL DO — know it before you open Consonance on L

- **L's working tree has uncommitted L070 work** (A: `state-sync.js`, `close.js`, `state-manifest.json` and tests;
  C: `ledger-union.js`, `lap-row.js` and tests). The shortcut's launcher **pulls only when tracked files are clean**
  (`consonance/launch.ps1`, the PULL BEFORE THE REBUILD CHECK block), so **tonight's L launch will very likely NOT pull**
  — it opens the build that is there and says so on the console.
- **The launch runs the checkout's `state-sync.js`** (`main.rs:11055`), i.e. A's uncommitted skip-not-stop version:
  lap.jsonl and board.jsonl are kept in place (good), and the launch prints a **false** "the data dir was not promoted /
  THIS MACHINE's house" message. **Ignore that one message.** No data is lost.

## 1 · FIRST ON L, in order

1. **A rebuilds L070 as (a) stop-before-write** (pre-scan every fast-forward file; refuse the whole install before the
   first byte if any would be refused), per the correction. Tracked harness (`state-sync.mutants.js`) run **to completion,
   no timeout**; tests re-run; the librarian collates L070 with both A files and C's union files.
2. **Land L070** (A's (a) + C's `ledger-union.js`, `lap-row.js` floor), then **`git pull`** — D099/D100 also edited
   `consonance/state-manifest.json`, so L070 must be committed first or the pull refuses.
3. **Move `C:\Consonance\data\vantage_cell\` aside** (it very likely still holds `mutants-run.log`, 3,383 B, 09-14);
   D100 removed its rules, so L's `close --check` will refuse on it until it is gone. Then `close.js --check` plainly.
4. **C writes the union** (dry run first; the librarian verifies written counts against lap +214 → 707, board +3,352).
5. **Fold-by-generation in `lap-row.js`** — the keeper's condition for accepting the DOUBLE-OPEN ids.
6. **Only then** a real `close.js` from L. D's next launch refuses to replace D's longer ledger and D unions its side.

## 2 · ALSO WAITING, NOT L-SPECIFIC

- Chunk 4 (B's abstain predictions, first 500 L0 verdicts by `started_at` ≥ 16:06:41.728Z) and chunk 5 (L3, first 300
  one-message verdicts by `timestamp` ≥ 16:06:39.107Z) — `loop/scoring_windows_2026-09-21.md`. Both are D's streams.
- Saved, gated behind the keeper's 07:40 ruling: `loop/fresh_vs_resumed_test_2026-09-21.md`; the ladder on the spine.
