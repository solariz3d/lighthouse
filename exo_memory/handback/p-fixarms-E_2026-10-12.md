# p-fixarms-E · D311 part 3 of 3 (ledger D312): the three fix arms as text builders, and F3's offline measure · pane E, on D, 2026-10-12

Plan: `exo_memory/loop/plan_mistake_bench_d311_2026-10-12.md`, part 3 (main `d99a6d80`).

**Result: lighthouse `541f3c46` (the F3 spec, alone, before any search) then `7ef6abb9`, on `d99a6d80`, branch `d311-e`,
worktree `G:\worktrees\e-d311-wt`, not pushed.** Nothing is wired into a hook, and nothing gates or writes.

| file | what |
|---|---|
| `exo_memory/loop/fixarms/arms.js` (sha256 `dabba931…`) | the three builders: `build('F1'\|'F2'\|'F3', unit, opts)` |
| `exo_memory/loop/fixarms/arms.test.js` | 21 rows, on a throwaway repo, board, ledger and transcript |
| `exo_memory/loop/fixarms/f3-rm-units.json` (sha256 `b27db961…`) | the 9 RM units, answer paths and phrases, K and the hit rule; committed first |
| `exo_memory/loop/fixarms/f3-offline.js` | the offline measure |
| `exo_memory/loop/fixarms/out/f3-rm.md`, `out/f3-rm.json` (sha256 `aba85a90…`) | its output: paths, ranges, ranks and scores, no excerpts |

- **Re-derive:** `node exo_memory/loop/fixarms/f3-offline.js` (about 25 s under the lock);
  `node --test exo_memory/loop/fixarms/arms.test.js`.
- **checked:** `arms.test.js` → 21 pass, 0 fail. portable-paths after the commit → green, 389 files, 0 new.

## 1. F3 offline, the 9 RM units: does the top 5 contain the answer?

**0 of 9.** The query is the turn's prompt, as the packet specifies.
- The 9 are the plan's SCORE RM: C's six, plus B's accepted W078, W085 and W050.
- A result counts only when its path is the unit's answer file AND its 40-line chunk holds C's phrase.
- The answer existed in the record at the commit used, for all 9.

| unit | commit (C's bound) | query terms | answer in top 5 | first answer rank (top 100) | answer file in top 5 |
|---|---|---:|---|---|---|
| W007 | d5d954d3 (d5d954d3) | 6 | no | >100 | no |
| W030 | 514c28ae (b214e3a3 / c6d16e82) | 6 | no | >100 | no |
| W039 | f239387c (f239387c) | 9 | no | >100 | no |
| W050 | 5bfcde90 (9c6a1311) | 1 | no | >100 | no |
| W078 | e527582b (e527582b) | 1 | no | >100 | no |
| W085 | 397e29c5 (ec884940) | 124 | no | >100 | no |
| W091 | e3b582f6 (25a2b1eb / 12193866) | 72 | no | 40 | no |
| T1 | a0ee8d16 (700128c8^) | 88 | no | >100 | no |
| T2 | 83188cb1 (83188cb1) | 58 | no | >100 | no |

checked: `out/f3-rm.md` (one run of `f3-offline.js` on `7ef6abb9`'s tree) → the table above. The commit used is main's
first-parent commit at the prompt's second. Where C's bound differs, C's is a day-start or a correction bound.

**The robustness checks:**
- **Same commit, either way:** the newest commit anywhere in main's history differs from the first-parent one for one unit only
  (W078: `d61ff6ab`). Searching that commit's tree also gives 0 of 9.
- **Q2, secondary and NOT the arm:** the query is the reply paragraph that holds the claim, i.e. a search run on the draft.
  - It gets **2 of 9**: W030 at rank 3, W078 at rank 5.
  - Ranks 7–27 for W085, T1, W091 and W050; >100 for W007, W039 and T2.
  - It is unstable. On the first run, before tool inputs counted as part of the reply (§5), it was 1 of 9, with W091 at rank 2.
    Which paragraph gets picked decides the rank.

**What the 0 rests on, by reading the top-5 lists in `out/f3-rm.md`:**
- inferred: **the prompt doesn't name the subject the claim is about.** W050's and W078's prompts each leave one query term
  after stop words. W007's six terms are the keeper's question about how the seat was doing, not about the shell's size.
- inferred: **a long prompt is swamped by the day's own files.** W085's 124 terms rank `chair_wake_2026-09-11.md` top 4.
  T2's 58 terms rank five of B's `d277v/turns/` dumps.
- Nothing was tuned on any unit. K and the hit rule were committed before the first search (`541f3c46`). The stop list, chunk
  size and BM25 constants were in `arms.js` before the first search and were not changed after it. `arms.js` was committed
  later, in `7ef6abb9`, so for those that order is my word, not git's.
- W007's prompt: by its correction text, the keeper had asked how the seat was doing (`librarian/2026-09-16.md:151`). I did not
  print the prompt itself.
- inferred: the result has the shape D301's SCORE reading foresaw (`plan_retrieval_misses_d301_2026-10-11.md`: W091's answer was in the injected brief,
  T1's had been read 12 h earlier): **finding fails because the question isn't the claim.**

## 2. The call shape (posted to the board for A at the start)

```
const arms = require('<repo>/exo_memory/loop/fixarms/arms.js');
arms.build('F1'|'F2'|'F3', unit, opts) -> { arm, unit, asOf, text, ...detail }
unit = { id, seat, transcript (relative to ~/.claude/projects), turnStart (ISO with a zone), claimTs? }   // origin-read.js loadUnits()
opts = { repo, projects, dataDir (F1), tz, k (F3, default 5), query (F3 override) }
```

- **`text` is the block to add.** It is empty when an arm has nothing (F2 with no other seat, F3 with no query terms).
- **Detail:** F1 `facts`; F2 `stamps` (tag, transcript line, time), so the bench can stamp in place instead of appending;
  F3 `commit`, `method`, `k` and `results` (path:range, score).
- **Redaction:** every text goes through claim-replay.js `clean()` (tokens, key shapes, third-place lines), and a home path is
  written as `~`.
- My board post named a `cacheDir` option. **There is none**: the corpus is held in memory per commit.

## 3. The arms

**The as-of time is the timestamp of the real prompt that opened the erring turn:** the latest prompt at or before
`turnStart`, with 2 s of slack. Nothing reads today's state.

**F1, fresh facts.**
- **git:** main's first-parent HEAD (asof.js's rule) and the commits dated in the 24 h before.
  - When the newest commit anywhere in main's history is newer, it is named too. This was found on real data: on 09-09 the
    first-parent line showed a 3-day-old HEAD and "0 commits", while 82 commits existed on a line merged later (§5).
- **files:** each repo path the prompt names, as of T (`fileAsOf`): lines and last change.
  - A path not in the repo yet reads "not in the repo at this time". The future is never shown.
- **board:** the last 5 rows strictly before T, each once.
- **lap rows:** the open laps' latest rows (not `filed`, not `void`).
- **processes:** a line saying they cannot be reconstructed.

**D303's sources (compute 10, fs 8, log 4, board 4, process 4, other-repo 2), from `classification.json`'s CN+CU checks:**

| source | a live pre-run, before the reply | this bench's reconstruction |
|---|---|---|
| compute 10 | **no**: each is a computation specific to the claim (an evictor sum, a suite's TODO names, a replay). W079's chain-status reads the ledger, whose open laps F1 shows: partial at most | the same |
| fs 8 | **only when the message names the path.** inferred: 5 of 8 are outside the repo (`~/.consonance`, `~/.claude/projects` ×3, the committee cwds) | **not** the 5 outside the repo. inferred, not checked: the other 3 (journal files, C's fixture frames, `loop/run1/items`) only if named and tracked at T |
| log 4 | **no**: F1 reads no log (AC log, persist.log ×2, the Windows event log) | no |
| board 4 | **the source yes; the fact only if it is among the last 5 rows.** W012 is a count over rows, which F1 does not compute | the same: the board is time-stamped, so this is exact |
| process 4 | **yes**, if F1 ran the process list live | **no**: no record of a past process list. The bench cannot test F1 on these 4 |
| other-repo 2 | **no** (a game's data, a decompiled source) | no |

inferred, from the table: on the 32 CN+CU, F1 as built reaches board (4, partly) and at most one compute. Live, it would add
process (4) and named fs paths. **The bench can measure F1 only on the board share and on what git reconstructs.**

**F2, dated messages.**
- **What it dates:** every prompt from another seat in the context since the last compaction (`[pane:X]`, `[chair:…]`,
  `[librarian:…]`), the erring prompt included. For each: its first line and up to 6 lines with figures, then
  `[sent <UTC> · <local> local]` in D309's form (`main.rs:11040`, `send_stamp_text`).
- **Then one line:** "A figure from another seat is a claim to re-check, not a fact: it was true, if at all, when it was sent."
- **Limit:** before D309, no send time was recorded. The time used is the transcript's arrival time, so a held message reads as
  sent when it arrived.
- **Not covered:** board posts the seat read through `read_board`. Only prompts are dated.

**F3, record search.**
- **The corpus:** the repository at the turn's first-parent commit; every tracked blob ≤ 2 MB with no NUL byte. The
  third-place folder and the `Chases_*` files are never indexed.
- **The method:** 40-line chunks at stride 20, with the path's words added. Tokens are `[a-z0-9_]+`, ≥ 2 characters, and a
  fixed English stop list is removed. BM25 with k1 1.2, b 0.75. **K = 5.**
- **The output:** each result's path:range and up to 700 characters of the chunk.

## 4. Examples on dev units only, and why none are committed

- **Built:** all three arms on W012 and W079 (census dev), in a scratch file that I read in full.
- **Sizes:** F1 2.1k / 2.4k characters, F2 4.2k / 3.6k, F3 3.9k / 3.9k. Each build took 0.3–1.1 s.
- **Not committed, and why:** the texts carry board and prompt content verbatim. One message carried an off-room repo path.
  A committed copy would publish that content, and A's bench builds the same text with one call. Held-out units: no arm was run
  on any, and their list was not opened this lap.

## 5. Corrections, before the counts were kept

- **The turn reader skipped tool inputs.**
  - Five units read "claim not in turn" on the first run, because their claims were written through a Write or a heredoc, not
    said.
  - Fixed: tool inputs are now part of the reply. This moved Q2 (1 → 2 of 9) and the turn check (3 → 9 of 9). Q1 did not move.
  - The test for it was written after the change, so it was never seen red.
- **F1's board block repeated the turn's own prompt** (rows AT T, mirrored 4×) and showed union duplicates. Now strictly
  before T, each row once. The test went red first.
- **F1's git line read only the first-parent line,** and showed W079's turn on 09-09 with a 3-day-old HEAD and 0 commits. It
  now names the newest commit anywhere in main's history. The test went red first.
- **My first fixture for that test dated the side commit before c2.** The newest-anywhere commit really was c2, so the test was
  wrong, not the code. The date was moved before the test ever passed.
- **The first red run of the whole file was a load failure (module missing),** not row by row. The home-path row went red
  first. The other 17 rows were written before the code and never seen failing one by one.
- **The W085 spec named `two_machines_lap_plan_2026-09-08.md`.** The file is `…_2026-09-09.md`; fixed before the spec commit.

## 6. Limits

- F1's git state is a reconstruction. Uncommitted files and the seat's actual checkout are invisible.
- F2's time is the arrival time.
- F3 is one untuned lexical method. A different method (embeddings, the claim as query) is a different arm, not a tuning of
  this one.
- The offline measure has n = 9 and one phrase rule per unit. Rank and score are in `out/f3-rm.json`.
- No mutation runs (the packet said none).

NEXT: librarian collate D311 part 3 with A's dry run and B's registration when all three wave-1 hand-backs are in
