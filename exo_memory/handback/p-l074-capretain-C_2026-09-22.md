# P-L074-CAPRETAIN — C (CHARLIE), L074 packet C, on L — the Jev runner's cap, partitioned, and capture retention

**Packet:** the keeper's two Jev calls, handed to the librarian (`librarian/2026-09-22.md:247`, "04:0x"). (1) CAP: 2,000
calls a day in all, 600 of it RESERVED for the shadow. (2) RETENTION: judge captures kept 14 days, then deleted by the
runner; verdict rows kept forever. Test first, with a stubbed fetch and a temp store. No rebuild, no restart. **Both
done. Uncommitted.**

## 0 · THE ANSWER

1. **The cap is a PARTITION:** the shadow's limit is its reserve (**600**), judge mode's limit is the rest (**1,400**),
   and the day's **total** (**2,000**) is checked on every call as the fuse. Judge mode cannot starve the shadow, the
   shadow cannot take judge mode's share, and the total never exceeds 2,000. That is shown over 20 random
   interleavings, each ending at exactly 600 + 1,400. A new CLI flag `--shadow-reserve` is refused if larger than
   `--daily-cap`.
2. **Retention:** `pruneJudgeCaptures` deletes judge captures whose own `captured_at` (or, if unreadable, file time) is
   older than 14 days. It runs **at runner start and hourly**, and only touches `.json` files **directly inside
   `<store>/judge-captures`**. No recursion, no directories, no links, and each path is checked before unlinking.
   **Verdict ledgers are never opened for writing** (`jev_judge.jsonl` and `shadow.jsonl` are byte-identical after a
   prune, including a 400-day-old row).
3. **Where the capture path lives:** `jev-judge.js` (`CAPTURES = 'judge-captures'`, `:55`; one file per turn, carrying
   `captured_at`, `:144`/`:175`). **The prune is in the runner, and `jev-judge.js` is not changed** (0-line diff). It
   reads the directory name from `judgeMod.CAPTURES`, so there is one source for it.
4. **Tests:** runner suite **21 → 36 / 0**, plain and serial, red first (13 red). **Mutants 12 / 12.** js-suite **115
   green · 3 failed**, the known three. Two existing test lines changed, and both are named in §3.
5. **Nothing is live yet:** the running runner, **pid 32976 (started 03:01:50)**, still runs the old single 600 cap
   and prunes nothing, **until its next restart**, which I did not do.

## 1 · THE CAP

**The keeper's decision, as the librarian recorded it:** *"2,000/day total, 600 of it reserved for the shadow (~8.5M
tokens/day worst case ≈ $0.36/day ≈ $11/month; the cap is a fuse against a runaway loop, not a budget)"*. Measured
there: 55 judge calls in 60 min of an active lap on L, averaging 4,240 input tokens.

**Why a partition and not "a shared pool with a floor":** "reserved" has two readings. A floor would let the shadow also
draw on the unreserved pool, and then judge mode's 1,400 is no longer judge mode's. A partition gives each mode its own
limit, so each mode's fuse can be read on its own. The shadow's busiest measured day was 535 (D103), under its 600.

`budget({ dailyCap, shadowReserve, shadowToday, judgeToday })` → `{ shadowLeft, judgeLeft, totalLeft, shadowLimit,
judgeLimit }`:
- `shadowLimit = min(shadowReserve, dailyCap)`; `judgeLimit = max(0, dailyCap − shadowReserve)`;
- each mode's `left` = `min(its limit − its count today, dailyCap − both counts today)`, floored at 0.

**The runner's wiring:**
- the shadow asks at most `min(maxCalls, shadowLeft)`, and judge mode at most `min(maxCalls, judgeLeft)`, re-read after
  the shadow has spent;
- today's counts are read per mode (the shadow's ok rows in `shadow.jsonl`, judge mode's via `judgeMod.callsToday`);
- when a mode's limit is hit, the log says **which** limit, once a day each: `shadow reserve of 600 reached …`,
  `judge cap of 1400 reached …`, or `daily cap of 2000 calls reached …` when the total itself is gone.

**The start line** now reads `… at most 25 calls a run and 2000 a day (600 reserved for the shadow), judge captures
kept 14 days`.

## 2 · RETENTION

`pruneJudgeCaptures({ store, now, retainDays = 14 })` → `{ dir, pruned, kept, deleted: [paths] }`:
- `dir = path.resolve(store, judgeMod.CAPTURES)`; only `Dirent.isFile()` entries ending in `.json`, so the in-flight
  `…json.<pid>.tmp` files of `writeAtomic` are never matched;
- each candidate must satisfy `path.dirname(path.resolve(p)) === dir` before `unlinkSync`;
- the age is the capture's `captured_at`, or the file's mtime when that cannot be read (never "guessed young", never
  "kept forever");
- `captured_at < now − 14 days` is pruned. At exactly the line, the test checks 14 d − 1 min kept and 14 d + 1 min
  pruned.

**In the runner:** at start (before the first capture), then every hour (`pruneMs`). It logs `retention: pruned N judge
capture(s) older than 14 days from <dir> (M kept; the verdict rows are never pruned)` when N > 0. An error is logged and
retried the next hour.

**One interaction, named, not a defect:** `capturePass` skips a seat whose transcript size and mtime haven't changed,
remembered **in memory for the life of the runner** (`jev-judge.js:159-160`). So an idle seat's last turn, pruned at 14
days, is not re-captured while the runner lives. After a restart it may be re-captured **once**, and `judgePass` then
skips it, because its ledger row exists. Zero calls, at most one file per idle seat.

## 3 · TESTS: red before, green after

`node --test consonance/tools/jev-shadow-runner.test.js` → **36 / 0**, plain twice and once `--test-concurrency=1`.
**Red first: 13 new tests failed** before any code (the 21 existing passed).

**CAP (8):**
1. the defaults are 2,000 / 600;
2. **judge mode stops at 1,400 while the shadow still gets its 600**;
3. **the shadow alone uses its 600 without judge mode losing any of its 1,400**;
4. **the combined total never exceeds 2,000**, over 20 seeded random interleavings of runs of up to 25, each ending at
   exactly shadow 600 / judge 1,400;
5. a day already over budget under the old shared cap (judge 1,700): judge 0 left, shadow 300, so the total still
   holds;
6. a reserve larger than the cap is refused by `parseArgs` with its own wording;
7. in the runner: judge mode already at its limit asks nothing while the shadow spends exactly its reserve;
8. in the runner: judge mode at its limit with the shadow idle logs `judge cap of 3 reached`, not "daily cap".

A ninth, added after mutant planning: **in the runner, the shadow stops at its reserve even when the day has room**
(judge idle, 5 eligible, reserve 2 → exactly 2 calls).

**RETAIN (6):**
1. **a capture older than 14 days is pruned, a fresh one kept**;
2. the 14-day line, ±1 minute;
3. **no ledger row is ever pruned**: `jev_judge.jsonl` and `shadow.jsonl` byte-identical after a prune, holding a
   400-day-old row;
4. **the prune never touches anything outside the capture directory**: old files in the store root, the shadow's
   `captures/l2`, a **sub-directory of** `judge-captures`, and a sibling directory all survive, and **every returned
   deleted path's parent is asserted to be the capture dir**;
5. an undated capture falls back to its file time and is pruned;
6. in the runner: an old capture is pruned at start, and the log says `retention: pruned 1 judge capture`.

**Two existing test lines changed, both because the keeper's new cap changes the contract they encode. No assertion
was weakened:**
- **A's `the DAILY cap holds across SHADOW and JUDGE together`** passed `dailyCap: 5`. Under the partition with the
  default 600 reserve, judge mode would get 0, and its "asks at most 1" would fail on the new rule, not on a defect.
  It now also passes `shadowReserve: 2`. Its assertion is untouched and green (the total still stops at 5).
- **My D104 `opts()` fixture** pinned `dailyCap: 600`, the old default. It is now **2,000**, the new default. At 600 the
  reserve would be the whole cap, which is exactly why A's **`JUDGE MODE runs inside the runner`** went red on my first
  run.

**Three of my own misses, caught before hand-back:**
- the CLI reserve test first matched `/reserve/` and **passed before the flag existed** (the "unknown argument
  --shadow-reserve" refusal contains the word). It is now specific and was red first;
- my first runner cap test expected "judge cap" in the log, but with the shadow's 2 spent the **total** was gone and
  the runner rightly said "daily cap". The counts stay asserted there, and the wording has its own test;
- mutant C5 (the shadow spending the shared **total**) would have survived every test until the ninth CAP test was
  added.

**Mutants** (scratch `l074-mutants.js`: temp copies of `consonance/tools` + `dev/shell/hooks` at repo depth, compiled
first, timeouts counted, scored on the `CAP`/`RETAIN`/daily-cap tests). Control 17 / 0:

| # | mutant | result |
|---|---|---|
| C1 | no reserve: judge mode may spend the whole cap | CAUGHT (3 fail) |
| C2 | the shadow ignores the day's total | CAUGHT |
| C3 | judge mode ignores the day's total | CAUGHT |
| C4 | the old defaults (600 / 600: no room for judge) | CAUGHT |
| C5 | the runner's shadow spends the shared TOTAL, not its reserve | CAUGHT (by the ninth CAP test) |
| C6 | a reserve larger than the cap accepted | CAUGHT |
| R1 | the prune ignores age (deletes every capture) | CAUGHT |
| R2 | the prune works on the STORE root | CAUGHT (5 fail) |
| R3 | an undated capture kept forever | CAUGHT |
| R4 | retention 7 days, not 14 | CAUGHT |
| R5 | the runner never prunes at start | CAUGHT |
| R6 | the prune recurses into sub-directories | CAUGHT |

**12 applied · 12 caught · 0 survived · 0 no result · 0 NOT APPLIED.** 0 leaked fake-app processes after the run.
These rows belong in the tracked `jev-shadow.mutants.js` (D104). I left that file alone because this packet names only
the runner and its test.

**Whole suite, plain:** `node consonance/tools/js-suite.js` → **115 green · 3 failed · 0 silent (of 119)**, with
`jev-ask`, `jev-judge`, `jev-shadow` and `jev-shadow-runner` all `ok`. The failures are the known three
(`carrier-drift.test`, `gen-consumer.test`, `stick-waiter`).

## 4 · NOT DONE, and NOT VERIFIED

1. **Not live.** pid 32976 (the runner started at 03:01:50) keeps the old code: **one shared 600 cap, and no pruning**,
   until the next restart. The packet said not to restart it, and I did not. Until then, a busy day can still stop both
   modes at 600 combined.
2. **No real prune has run.** The store's captures began today, so nothing is 14 days old yet, and the first real prune
   will find nothing for two weeks.
3. **D.** The same file serves D after a pull. Not run there.
4. **The daily counts are per local day** (`toDateString()`), as before. A runner alive across midnight starts a fresh
   budget at local midnight. That is unchanged by this packet, but it is the rule the cap now lives under.

## 5 · FILES

| file | change | lines | sha256 (first 16) |
|---|---|---:|---|
| `consonance/tools/jev-shadow-runner.js` | `budget`, per-mode counts and cap logging, `--shadow-reserve`, `pruneJudgeCaptures` at start and hourly, defaults 2,000/600/14 | 357 | `92b0f472975a2169` |
| `consonance/tools/jev-shadow-runner.test.js` | +15 tests; `opts()` cap 600→2,000; A's shared-cap test given `shadowReserve: 2` | 524 | `22cfd468a9c514c6` |
| `consonance/tools/jev-judge.js` | **not changed** (the capture path lives there; the prune reads `CAPTURES` from it) | — | — |
