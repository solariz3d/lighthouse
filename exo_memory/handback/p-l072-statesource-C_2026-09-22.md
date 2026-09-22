# P-L072-STATESOURCE — C (CHARLIE), L072 packet C, on L — ledger-union reads the state set's copy

**Packet:** add `<state_dir>/data/lap.jsonl` and `board.jsonl` as a source, resolved the way `state-sync.js` resolves
the state dir (refuse if undeclared). Test first: (1) a refused-install world, (2) the key unchanged, (3) nothing written
into the state dir, (4) the dry run names the state source and its count. Update the header. **No write against the
live files.** **Done. Uncommitted.**

## 0 · THE ANSWER

1. **The state set's copy is a source**, for both the dry run and the write. It is resolved by **`state-sync.js`'s own
   `stateDir()`, imported rather than copied** (`CONSONANCE_STATE`, then `~/.consonance.json` `state_dir`, else throw).
   One rule is added on top: **a declared state dir that does not exist also refuses** (exit 2), because silently
   reading nothing there is exactly how D would miss L's rows. A state set that holds no copy of the file is said out
   loud (`state set copy: NONE at …`), and the run goes on.
2. **All four asked tests are there and red first**, plus three more: 25 → **32 / 0**, plain ×2 and serial.
   **Mutants 14 / 14**: 6 on the state source, plus the L071 write rows re-run as a regression.
3. **It is read-only against the state repo.** Tested by hashing the whole state dir around a dry run and a write. On
   the real disk: state repo **0 uncommitted changes, lap/board sha256 identical before and after** the real dry run.
4. **Real dry run on L:** the state source is named with its counts. **Lap: 419 rows**, which is D's 09-10 publish.
   **Board: 29,903 rows**, which is the 30,160 lines the librarian counted minus the 257 fused ones. **0 not in live**
   for both, and 0 rows to add: L071's union already holds everything. The case this change exists for (**D reading L's
   rows out of the state set after L closes**) is exercised by the refused-install fixture, not by this machine.
5. **One unexplained suite red, not reproduced:** `state-sync.test` went 93/1 in **1 of 2** full-suite runs, and was
   94/0 in 8 further runs (§4). The failing test's name is not in the suite log.

## 1 · THE CHANGE (`consonance/tools/ledger-union.js`)

- **The resolver.** `resolveStateDir(explicit)` calls `state-sync.js`'s exported `stateDir()` when no dir is passed
  (`require('./state-sync.js')`; its `main()` is guarded, and requiring it takes 7 ms with no side effects). If the dir
  does not exist, it refuses with *"the declared state dir … does not exist — reading nothing there would hide every row
  only the other machine's publish holds"*. **Not copied:** two copies of one route drift (maintenance law #2), and
  `state-sync`'s own comment says a literal fallback is *"another machine's disk the moment this file leaves the box"*.
- **`sources(dataDir, name, stateDir)`**: the live file, then **`STATE` = `<state_dir>/data/<name>`** (read only), then
  every `attic/pre-sync-*` copy. The union and its whole-row key are unchanged, and the state copy is just another
  non-live source.
- **The dry run.** `resolveStateDir()` runs after argument checks and before any read; on refusal it prints
  `ledger-union: REFUSED — …` and exits 2. The report now reads `sources: 1 live + 1 state set copy + N attic copies`
  (the old line would have counted the state copy as an attic copy) and adds
  **`state set copy  <path> — <rows> rows, <n> not in live`**, or `state set copy: NONE at <path> …`.
- **The write.** `writeUnion({ …, stateDir })` resolves the state dir **before anything is touched**, so an undeclared
  state set refuses with the live file unchanged (tested), and passes it to `sources()`. Rows only the state copy holds
  are interleaved exactly like attic-only rows. **Nothing is ever written under the state dir.**
- **The header** (`:2` and a new THE SOURCES paragraph before TWO MODES) names the state set's copy, the resolution, the
  refusal, and why: the librarian's 03:1x finding, cited.

## 2 · TESTS: red before, green after

**The state pin.** This machine's config declares a real `state_dir`, so after the change **every existing test would
have read L's real state set** and counted its rows. The file now pins `process.env.CONSONANCE_STATE` to an empty temp
dir at the top (the pattern of `lap-row.test`'s `LAP_REPO` pin). Spawned CLIs inherit it. **No existing assertion
changed.**

`node --test consonance/tools/ledger-union.test.js`: **before the change 26 pass / 6 fail**, after it **32 / 0** (twice
plain, once `--test-concurrency=1`).

| # | test | before |
|---|---|---|
| 1 | **a refused-install world**: live has L's rows; D's rows exist ONLY in `<state>/data/lap.jsonl` with no attic copy; the write adds both D rows, in time order | RED |
| 2 | **the key is still the whole row**: a state row equal to a live row with its fields reordered is not added, via `union()` and via the CLI | green (a guard: unchanged by design) |
| 3 | **nothing written into the state dir**, by a real dry run with `--out` or by a real `--write`: the state tree's sha256 identical after each | RED |
| 4 | **the dry run names the state source**: its path, `3 rows`, `2 not in live` | RED |
| 5 | an **undeclared** state dir (no env, a HOME with no config) refuses with exit 2, for the dry run AND the write; the live file unchanged | RED |
| 6 | a **declared but missing** state dir refuses with exit 2 | RED |
| 7 | a state set holding **no copy of this file** is said out loud, and the run exits 0 | RED |

**Mutants** (scratch `l072-mutants.js`, temp copies of the **whole** `consonance/tools` dir plus `state-manifest.json`,
because `ledger-union` now requires `./state-sync.js`. **My L071 runner copied only `ledger-union.js`, so every mutant
would have failed at load and been counted as a catch, all falsely.** Compile-gated; timeouts counted. Control 32/0.)

| # | mutant | result |
|---|---|---|
| S1 | the state set copy is never read | CAUGHT (3 fail) |
| S2 | a declared-but-missing state dir accepted | CAUGHT |
| S3 | an undeclared state dir swallowed (reads nothing, no refusal) | CAUGHT |
| S4 | the dry run does not name the state source | CAUGHT |
| S5 | the write targets the STATE copy instead of the live file | CAUGHT (17 fail) |
| S6 | the key is no longer the canonical whole row | CAUGHT |
| W1–W8 | the L071 write guards (catch-up, link-not-rename, gaps, frozen reconcile, fused lines, backup guard, verification, rows not added) | **8 × CAUGHT** |

**14 applied · 14 caught · 0 survived · 0 no result · 0 NOT APPLIED.**

## 3 · ON THE REAL DISK: dry run only (`--out` in scratch; no write, as the packet says)

`node consonance/tools/ledger-union.js --data C:/Consonance/data --out <scratch>/union` (scratch `l072/dryrun.txt`):

| file | sources | state set copy | live distinct | union distinct | rows to add |
|---|---|---|---:|---:|---:|
| lap | 1 live + 1 state + 8 attic | `C:\Consonance\state\data\lap.jsonl`: **419 rows, 0 not in live** | 733 | 733 | **0** |
| board | 1 live + 1 state + 21 attic | `C:\Consonance\state\data\board.jsonl`: **29,903 rows, 0 not in live** | 34,959 | 34,959 | **0** |

**Untouched, measured around the run:**
- `C:\Consonance\state`: `git status --porcelain` → 0 lines before and after; `data/lap.jsonl` sha256
  `70738abaf8f9edfd` and `data/board.jsonl` `d7c777b50e18d4a8`, identical before and after.
- Live `lap.jsonl`: `68fde747177a9a3a` before and after.

**What the numbers say:** L's live ledgers hold every row the state set holds (D's 09-10 publish is a prefix of L's
union). That is the local-ahead picture the refused install recorded. **What they cannot say:** that D's union will pick
up L's rows. That happens only after L closes and publishes, and it is covered here by test 1's fixture.

## 4 · THE WHOLE SUITE, plain, and the one red I cannot explain

| run | result |
|---|---|
| `node consonance/tools/js-suite.js`, run 1 | 113 green · **4** failed (of 118): the known `carrier-drift.test`, `gen-consumer.test`, `stick-waiter`, **plus `state-sync.test` 93/1** |
| `state-sync.test.js` alone, 3 runs | **94 / 0** each |
| `state-sync.test.js` **concurrently with `ledger-union.test.js`**, 4 pairs | **94 / 0** and 32 / 0, every pair |
| `node consonance/tools/js-suite.js`, run 2 | **114 green · 3 failed** (the known three), `state-sync.test` `ok` |

**So: one `state-sync.test` test failed once, under the suite's load, and has not recurred in 8 runs.** I did not edit
`state-sync.js`. `ledger-union` only `require`s it, and my tests run beside it without interference (4 concurrent
pairs). **The failing test's name is not recoverable**: the suite prints only the tail of a failing file (its last two
`ok` lines and the count). **Not dismissed as flaky, and not explained.** If it recurs, the suite's log of that file is
the thing to keep.

`node consonance/tools/portable-paths.js` → exit 0.

## 5 · NOT VERIFIED

1. **D's side.** The purpose of this change (D's union reading L's rows from the state set after L publishes) is proven
   on a fixture only. It becomes real at L's close and D's next launch.
2. **The write against the real files.** Not run, per the packet. The real dry run adds 0 anyway.
3. **The one `state-sync.test` failure** (§4): which test, and why.
4. **`board.jsonl`'s 257 fused lines inside the state copy.** It holds the same 257 (29,903 rows = 30,160 lines − 257,
   by the librarian's line count). I did not check that they are byte-identical to live's; they are not rows, and the
   union compares invalid lines by content hash (L070).

## 6 · FILES

| file | change | lines | sha256 (first 16) |
|---|---|---:|---|
| `consonance/tools/ledger-union.js` | the state source, `resolveStateDir`, report lines, header | 376 | `e268c1e75306a372` |
| `consonance/tools/ledger-union.test.js` | the state pin + 7 tests | 349 | `3f51aa9940cd7dbb` |
