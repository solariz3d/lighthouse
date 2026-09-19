# P-SIX-REDS · BRAVO — the six red JS suites, classified (D082, night run N1b, read-only)

**B (pane `12fb81f6`), machine D, 2026-09-19 11:1x.** Packet: `exo_memory/loop/plan_night_run_2026-09-19.md:52` (row N1b), at HEAD `6f4ec9f`.
READ-ONLY: this lap edits nothing except this file and one line in `map/B.md`. Nothing committed.

## 0 · RESULTS

| file | failing assertion(s) | class | repair belongs to |
|---|---|---|---|
| `dev/shell/hooks/userprompt_pulse.test.js` | `:91` `assert.ok(r.ctx, …)`, printing "Python was not found" (×5) | **MACHINE-BOUND**: no Python on D | test → NOT-RUN on a missing interpreter; or the keeper installs Python |
| `consonance/tools/actors.evidence.test.js` | (a) `:180` unresolved `resume` / `sync` / `trailer-gate`; (b) `:237` `LETTER_BIRTH` 1785057198 vs D's 1784993504 | (a) **STALE CLASSIFICATION** in `actors.js` `NON_PANE`, with the tripwire working; (b) **MACHINE-BOUND**: L's first letter pinned, D's persist.log differs | (a) three `NON_PANE` rows (`trailer-gate` is mine); (b) a per-machine constant |
| `consonance/tools/carrier-drift.test.js` | `:240` `res.red === false`; `:332` walk ≠ frozen; cant-lose census 33 vs 32 | **4 of 6 findings CORPUS DRIFT** (new carriers, aged CH-4 freeze): the instrument working. **2 MACHINE-BOUND**: a registered carrier in `exo_memory/review/` exists only as an untracked file elsewhere | a deliberate reading and re-freeze; a registry that registers no untracked file |
| `consonance/tools/forget-rate.test.js` | `:209` `FORGOTTEN 0 files` | **STALE PIN**: two deliberate deletions (`e5e1eeb`, `62a4f3a`). **Plus a REAL DEFECT** in `forget-rate.js`: departed BYTES undercounted (SHELL.md 161,665 B read as 0; HEAD says 10,383 B, the true figure is 172,048 B) | record them in the pilot and re-pin; `lastBlob` needs `--full-history` |
| `consonance/tools/gen-consumer.test.js` | `:714` "STAYS_PRIVATE names exo_memory/review, which is not there" | **MACHINE-BOUND**: `review/` is kept off git by design and exists only on L | the column accepts "private, absent here"; my L046 pin |
| `consonance/tools/portable-paths.test.js` | `:430` 35 sites not in baseline; `:119` "a drive literal reached live code" | 27 **STALE BASELINE** (benign), 6 **REAL DEFECTS** (4 FATAL-DEFAULT, 2 FATAL-SHIPPED-INSTRUCTION), 2 REVIEW. **And `:119` is a REAL DEFECT in the scanner:** a `}` inside a string (`main.rs:5784`) closes the test module early, so test code is scored as live | `--update` for the benign; the six sites; `rustTestLines` must skip string literals |
| *state-sync.test.js* (A's found-not-fixed) | `:677` exit code; `:694` `installed:false` | **REPRODUCED**, 19/24 under load. A **TEST DEFECT (race)**: `deleter` has no readiness signal | the test's deleter |

**By cause, across the six files. A file can hold more than one cause:**
- **Machine-bound: 4 causes in 4 files.** `userprompt_pulse` (Python); `actors.evidence` (b) (per-machine letter history);
  `gen-consumer` and carrier-drift's 2 MISSING-FILE (the one `exo_memory/review/` directory).
- **Stale: 3.** forget-rate's pin, actors (a)'s `NON_PANE` list, portable-paths' 27 benign sites.
- **Instrument working: 1.** carrier-drift's 4 corpus-drift findings.
- **Real defects found: 2 in tools** (`forget-rate.js` bytes, `portable-paths.js` string braces) **and 6 in the files
  portable-paths names.**

**On L these should stay red too (not run there, §4)** wherever the cause is not machine-bound: actors (a), carrier-drift's 4, forget-rate and
portable-paths. **No product regression was found behind any red.**

## 1 · Baseline

`node consonance/tools/js-suite.js` at 11:1x on D (5 min 11 s, exit 1): **the same six FAILED, 1 canary (`targetless-pull`),
0 crashed.** Output: SCR `reds/suite-run1.txt`, where SCR = `C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-5bf9d657/12fb81f6-f4c0-4ef8-aad8-f0cdce091925/scratchpad`.
Each file was then run alone: `node <file> > SCR/reds/<name>.txt`. Every one exits 1.

**The classes, as the packet defines them:** MACHINE-BOUND (passes on L, cannot pass on D, and why) · STALE TEST (the test's
pinned expectation is out of date and the code is right) · REAL DEFECT (the thing under test is wrong). Several files fail for
more than one reason, so the class is given **per failing assertion**.

## 2 · Per file

### 2.1 `dev/shell/hooks/userprompt_pulse.test.js`: MACHINE-BOUND (5 of 5 failures)

- **Failing assertions** (`:91`, `:98`, `:105`, `:112`, `:119`): all five are `assert.ok(r.ctx, …)`. The hook produced no
  context, and `r.ctx` is `null`. The first, verbatim from `userprompt_pulse.test.js:91`, is
  `assert.ok(r.ctx, 'pulse must emit valid hook JSON: ' + r.raw + r.err)`, and it printed *"pulse must emit valid hook JSON: Python
  was not found; run without arguments to install from the Microsoft Store…"*. (`SCR/reds/userprompt_pulse.txt:18-106`)
- **Why:** the hook under test runs through `python`, and D's `python` is the Windows Store stub. Nothing on D can pass it without
  installing Python, which is the keeper's decision (a new dependency).
- **Passes on L?** NOT VERIFIED from here (§4). The plan's own row says "D has no Python".
- **Repair class:** the test should detect a missing interpreter and report NOT-RUN rather than FAILED. `js-suite.js` already has
  the NOT-RUN state ("declining is a decision and dying is not").

### 2.2 `consonance/tools/actors.evidence.test.js`: 2 failures, 2 classes. Reads LIVE data (`CONSONANCE_DATA`: `board.jsonl`, `persist.log`, `letters.json`)

**(a) `:173` "the real board resolves with nothing left over" is a STALE CLASSIFICATION in `actors.js`, with the tripwire working.**
- **Failing assertion** (`:180`): `deepStrictEqual(c.unresolved, [])`. Actual:
  `[['resume', 60], ['sync', 32], ['trailer-gate', 5]]`.
- **All three are control-plane writers, not panes,** and all three were born after `actors.js`'s last change (`8b24022`, 09-08):

| id | writer | first row on D's board | rows |
|---|---|---|---|
| `sync` | `main.rs:11973` | 2026-09-09T11:12:15Z | 32 |
| `resume` | `main.rs:6310` | 2026-09-12T06:29:59Z | 60 |
| `trailer-gate` | `mcp.rs:595`, landed in `8e8d1bd` (**D069, mine**) | 2026-09-16T19:14:27Z | 5 |

  (`node -e` over `C:/Consonance/data/board.jsonl`, grouped by `pane`; `grep -n 'pane: *"resume"\|"trailer-gate"' src/*.rs`)
- **Why it is red:** `NON_PANE` (`actors.js:307`) lists `chair, backfill, blackbox-steering, gate, blind, main-tab/tree-assets`,
  and none of these three. This is the same event as `blind` on 2026-08-01, which the file's comment at `:298-301` records as
  *"caught by this assertion within hours of the writer being created"*.
- **Machine-bound or not:** the ids come from code on both machines, so this is **not** machine-bound. L's board will carry them
  wherever those writers have fired there (not checked).
- **Repair class:** add the three to `NON_PANE`, each with the comment the others carry. That repair belongs to the seats that
  created the writers; for `trailer-gate` that is me.

**(b) `:232` "LETTER_BIRTH re-derives from persist.log" is MACHINE-BOUND.**
- **Failing assertion** (`:237`): `strictEqual(Math.min(...stamps), LETTER_BIRTH)`, *"the first letter ever assigned is not the
  constant in actors.js; one of them is wrong"*. Actual `1784993504`, expected `1785057198`.
- **Why:** the constant (`actors.js:248`) and its doc (`:158-160`) name the first letter as
  `1785057198 letter A -> pane=6fe15f0a…` = 2026-07-26T09:13:18Z. That is **L's** history. D's own `persist.log` (`head -12
  C:/Consonance/data/persist.log`) has `1784993504 letter A -> pane=1582ff09…` and `letter B -> pane=18916fe2…` =
  2026-07-25T15:31:44Z. Each machine's data directory has its own letter history, and the test reads the local one.
- **So neither is "wrong"**, which the assertion's message can't know. The constant is a fact about one machine, asserted on every machine.
- **Passes on L?** Likely, since the doc quotes L's line; NOT VERIFIED (§4).
- **Repair class:** a machine-aware constant (keyed by `CONSONANCE_MACHINE`, which is `D` in this environment) or a per-machine
  pin. Either way it is an edit to `actors.js`, a later lap.

### 2.3 `consonance/tools/carrier-drift.test.js`: 4 failing tests, 6 RED findings, 2 classes. Walks the FILESYSTEM (`carrier-drift.js:348-370`, `fs.readdirSync`), not git

- **Failing assertions:**
  - `:240` *"THE BAR, half one: the shipped registry is GREEN against the working tree"*:
    `assert.strictEqual(res.red, false, CD.report(res))`, with actual `true`.
  - `:332` *"walk and frozen list disagree — re-run --ch4-walk and re-freeze AFTER reading what changed"*.
  - the MUTATION test (same report).
  - *"the shipped cant-lose census is COMPLETE"*: actual `33`, expected `32`.

  (`SCR/reds/carrier-drift.txt:17-570`)
- **Last green:** `986a086` (09-08 06:36, "carrier-drift GREEN, ratchet green", on L).
- **The six RED findings, each placed:**

| finding | file | class | evidence |
|---|---|---|---|
| CH4-DRIFT-ADDED | `exo_memory/cards/every-digest-carries-its-function.md` | CORPUS DRIFT, stale frozen list | added `f6e7b1f` 09-09, after the freeze |
| CH4-DRIFT-ADDED | `exo_memory/record/retired_seats_2026-09-11.md` | CORPUS DRIFT, stale frozen list | added `397e29c` 09-11 |
| UNACCOUNTED | `exo_memory/handback/p-battery-blind-E_2026-09-16.md:274` | CORPUS DRIFT, a new carrier quoting the withdrawn "only DECORRELATED" wording | added `67da110` 09-16 |
| UNACCOUNTED | `exo_memory/librarian/2026-09-14.md:125` | CORPUS DRIFT, a new carrier quoting the struck "can't lose" wording | `e388bde` 09-14 |
| MISSING-FILE ×2 | `exo_memory/review/tool_audit_draft_2026-09-07.md` (registry rows at `carrier-drift.registry.json:210`, `:432`) | **MACHINE-BOUND** | never in git on any branch (`git log --all -- <path>` empty); `exo_memory/review/` does not exist on D. The registry was built over a working tree that held an untracked file, presumably L's |

- **Classification:** 4 of 6 are the instrument **working**. The corpus grew new carriers and the frozen CH-4 list aged. That is
  neither a stale test nor a code defect, and the file itself says the repair must be a deliberate reading and re-freeze, "never
  as a formality". 2 of 6 are machine-bound because a registered carrier exists only as an untracked file on another machine.
- **A design note, not a finding:** a registry that registers an untracked file makes the suite's colour depend on which disk runs it.

### 2.4 `consonance/tools/forget-rate.test.js`: STALE PIN (the tool is right about the count), plus a REAL DEFECT in the tool's bytes

- **Failing assertion** (`:209-211`): `assert.ok(/FORGOTTEN\s+0 files/.test(out))`, *"a departure appeared in the real corpus —
  update loop/forgetting_pilot_2026-08-25.md"*. The tool prints `FORGOTTEN 2 files / 10,383 bytes`.
  (`SCR/reds/forget-rate.txt:32-66`)
- **The two departures, both deliberate:**
  - `exo_memory/astra/SHELL.md`, deleted in `e5e1eeb` (09-08 06:14, "the Astra shell becomes a generator writing outside the repo").
  - `exo_memory/loop/battery_run1_T2_text_2026-09-16.md`, deleted in `62a4f3a` (09-16 04:28, "the first T2 text is WITHDRAWN").
- **Red since `e5e1eeb`**, checked with the tool's own window flag rather than a worktree:
  `node consonance/tools/forget-rate.js --to e5e1eeb~1` → `FORGOTTEN 0`; `--to e5e1eeb` → `FORGOTTEN 1`.
  The test was last edited `06fab50` (08-25), so it has been red for 11 days.
- **Classification of the red:** a STALE PIN. The all-time "never lost a file" claim stopped being true by deliberate deletion,
  and the test's own message names the repair: record them in the pilot, then re-pin.
- **REAL DEFECT FOUND ON THE WAY (not the red): the departed-bytes figure is wrong.**
  - `lastBlob` (`forget-rate.js:115-116`) finds a departed file's last blob with `git rev-list <to> -- <path>`, without
    `--full-history`.
  - After the deletion, merges enter the history (`git rev-list --merges e5e1eeb..62a4f3a~1 | wc -l` → 6), and git's history
    simplification drops the path. At HEAD, `git rev-list HEAD -- exo_memory/astra/SHELL.md | wc -l` → **0**, while
    `--full-history` gives **2**.
  - So `lastBlob` returns null and `blobSize` reports **0 B** for SHELL.md, which is 161,665 B at `e5e1eeb~1`
    (`git show e5e1eeb~1:exo_memory/astra/SHELL.md | wc -c`).
  - The same file's bytes change with the window end: `--to e5e1eeb` → `1 files / 161,665 bytes`, `--to 62a4f3a~1` →
    `1 files / 0 bytes`.
  - **HEAD's verdict "2 files … (10,383 bytes)" is the battery file alone. The true figure is 172,048 B.**
  - The file COUNT is unaffected; only bytes are. This is a later lap's edit (add `--full-history`, and a fixture with a merge),
    not this one's.

### 2.5 `consonance/tools/gen-consumer.test.js`: MACHINE-BOUND (1 failure)

- **Failing assertion** (`:714`): `assert.ok(tops.includes(k), 'STAYS_PRIVATE names exo_memory/' + k + ', which is not there')`,
  which printed *"STAYS_PRIVATE names exo_memory/review, which is not there"*, actual `false`. (`SCR/reds/gen-consumer.txt:73-84`)
- **Why:**
  - `tops` is `fs.readdirSync(path.join(REPO, 'exo_memory'))` (`:698`), the filesystem and not git.
  - `STAYS_PRIVATE.review` (`gen-consumer.js:646`) describes it as *"a SCORED EXPERIMENTAL OBJECT — the seeded draft L039's readers
    were measured against … a planted-defect key that travels stops being an answer key"*. It is kept out of git by design:
    `git log --all -- exo_memory/review/` is empty, and `ls exo_memory/review` on D says no such directory.
  - So the entry is true on the one machine holding the directory and false everywhere else.
- **Same object as carrier-drift's two MISSING-FILE rows** (`exo_memory/review/tool_audit_draft_2026-09-07.md`). One absent
  directory turns two suites red.
- **Written by B** (`8b24022`, L046: *"`audit` was columned last lap and `review` was not"*, `gen-consumer.js:639`), so the
  machine-bound pin is mine.
- **Repair class:** the column should accept "declared private and absent on this machine" as a stated state, not a red. Or the
  directory should be on both machines, which is the keeper's call (§6).

### 2.6 `consonance/tools/portable-paths.test.js`: 3 failing tests, 2 classes, plus a REAL DEFECT in the scanner

**(a) `:430` and the "green line" test (`RED — 35 machine-specific path(s) not in the baseline`): an ACCRETED BASELINE, red since
the commit that last touched the tool.**
- The 35 sites by class (`SCR/reds/pp-sites.txt`, lines 435-566 of the run):
  - 26 BENIGN-TEST
  - 1 BENIGN-FIXTURE
  - 4 FATAL-DEFAULT: `live-mirror-stop.js:49,50,54` and `live-follow.js:33`, each `process.env.X || 'C:\\Consonance\\…'`
  - 2 FATAL-SHIPPED-INSTRUCTION: `consonance/README.md:230` and `exo_memory/record/retired_seats_2026-09-11.md:62`
  - 2 REVIEW: `main.rs:6056` and `state-sync.js:141`
- **Every one of the 35 was authored AFTER the baseline commit.** `git blame --porcelain` on each (script inline; output
  `SCR/reds/pp-blame.json`) gives 0 before `977b7b0`, 35 at or after, across 12 commits from `977b7b0` (09-09) to `64293bd`
  (09-15, 8 sites in `sync_launch.rs`).
- **Red at its own last commit:** `977b7b0` last touched `portable-paths.{js,test.js,baseline.json}`, and in a throwaway
  worktree at `977b7b0`, `node consonance/tools/portable-paths.js` exits 1 with *"RED — 1 machine-specific path(s) not in the
  baseline"* for `consonance/tools/state-sync.js:129`, a line that same commit added (`SCR/reds/pp-at-977b7b0.txt`). The
  worktree was removed afterwards (`git worktree list` shows only main and one worktree that is not mine).
- **Not machine-bound.** The scanner reads repo text, which is the same on L. It should be red on L too (not run there).
- **Classification per class:**
  - the 27 BENIGN are a STALE BASELINE (`--update` with the diff carrying the argument, as the tool's own advice says);
  - the 4 FATAL-DEFAULT and 2 FATAL-SHIPPED-INSTRUCTION are REAL DEFECTS in the files named, each small;
  - the 2 REVIEW need a reader. One of them is not what it seems, see (b).
- **The chair's context,** "RED at 35 sites at D078, with and without BUILDING.md's edit": consistent. BUILDING.md carries none
  of the 35.

**(b) `:113-119` "main.rs has no drive literal in LIVE code": a REAL DEFECT in `portable-paths.js`'s `rustTestLines`, not in
main.rs.**
- **Failing assertion** (`:119`): `deepStrictEqual(live, [])`, *"a drive literal reached live code in the shipped binary"*. Actual:
  `['6056: let cwd = "C:\\\\Consonance\\\\instances\\\\sibling-07b8a48f";', '6237: let kept = vec![KeptPane { … cwd: "C:\\\\x" … }];']`.
- **Both lines are test code.** They sit inside `mod where_a_seat_lives_tests`, which is `#[cfg(test)]` at `main.rs:5763-5764`.
- **The scanner ends that module at `:5785`.** Line `:5784` reads `after[..after.find("\n}\n").expect(…)]`, and the `}` inside
  the string literal is counted as a closing brace. (`node -e` calling `G.rustTestLines(main.rs)`: the span from 5764 ends at
  5785, and `inTest(6056) = false`, `inTest(6237) = false`.) Line `:5784` arrived in `175339c` (09-11).
- **So "a drive literal reached live code" is false,** and every line of that test module after `:5785` is currently scored as
  shipped code. Repair class: the brace counter must skip string and char literals. That is a scanner edit with a fixture of this
  exact line, a later lap.

## 3 · state-sync.test.js under load: REPRODUCED, the two failing tests named, the mechanism is a race in the test

- **Command:** 3 rounds × 8 parallel `node consonance/tools/state-sync.test.js`, with 6 CPU burners each round (45 s busy loops),
  on a 16-core D. Outputs in `SCR/reds/ss-r*.txt` and `ss-exits.txt`.
- **Result:** **19 of 24 runs failed.** 16 were 74/1, 3 were 73/2, and 5 were 75/0.
  (`grep -h "passed" SCR/reds/ss-r*.txt | sort | uniq -c`)
- **The failing tests, each 11 times** (`grep -h "FAIL" … | sort | uniq -c`):
  1. `:677` *"--pull --install EXITS NON-ZERO and names the path when the data dir loses a file under it"*.
     It failed on `assert.strictEqual(r.code, 1, 'a set that did not land must not exit 0: …')`.
  2. `:694` *"a shortfall records installed:false and the missing paths, so the launcher reads a refusal"*.
     It failed on `assert.strictEqual(c.installed, false, "C's schema: installed means the set reached the data dir")`.
- **Mechanism, read from the source:**
  - Both tests start `deleter()` (`:582-586`): `spawn(process.execPath, ['-e', <6-second unlink loop>])`, with **no readiness
    signal**. Then they immediately run `--pull --install`.
  - Under load, the child's Node startup can take longer than the whole install-and-verify. The file is never taken away, the set
    lands whole, and the tool correctly reports `installed: true`, exit 0.
  - **The product did the right thing; the test's premise (a file removed mid-install) did not happen.**
  - Classification: a TEST DEFECT (race). Repair class: the deleter must signal that it is running (for example, delete once and
    write a marker) before the install starts.
- **Inferred, not proven:** I did not instrument the child's start time. The inference rests on the code shape and on the
  failures being exactly the two tests that use `deleter`. It has exactly two call sites, `:684` and `:696`
  (`grep -n "deleter(" consonance/tools/state-sync.test.js`), and those are the two tests that failed.

## 3b · Red at the commit that last touched it (the librarian's bar)

| file | last commit | red there? | how checked |
|---|---|---|---|
| userprompt_pulse | `5889d3c` 09-07 | on D, necessarily: no Python at any commit | not run; the dependency is absent on D |
| actors.evidence | `8b24022` 09-08 | **not reconstructible.** The test reads live `board.jsonl` / `persist.log`, so a worktree run reads today's data | not run. (a) was green then by construction, since its three writers did not exist yet (first rows 09-09, 09-12, 09-16); (b) was red on D from the moment it was written |
| carrier-drift | `986a086` 09-08 ("GREEN") | **RED on D**: 3 findings, all MISSING-FILE | worktree at `986a086`, `node carrier-drift.test.js` → exit 1 (`SCR/reds/at-986a086.txt`). Caveat: a worktree holds no untracked files, so `third_place/2026-08-29.md`'s absence there is a worktree artifact; `review/` is absent on D proper too |
| forget-rate | `06fab50` 08-25 | green then; red since `e5e1eeb` (09-08) | `forget-rate.js --to e5e1eeb~1` → 0 forgotten, `--to e5e1eeb` → 1 |
| gen-consumer | `d8b8d38` 09-09 | **RED on D**, same assertion | worktree at `d8b8d38` → exit 1, *"STAYS_PRIVATE names exo_memory/review, which is not there"* (`SCR/reds/at-d8b8d38.txt`) |
| portable-paths | `977b7b0` 09-09 | **RED at its own commit**: 1 site, `state-sync.js:129` | worktree at `977b7b0` (`SCR/reds/pp-at-977b7b0.txt`) |

## 4 · NOT VERIFIED

- **Nothing was run on L.** Every "passes on L" in this file is inferred:
  - from the constant's own doc (`actors.js:158-160` quotes L's `persist.log` line);
  - from `986a086`'s commit message saying GREEN;
  - from the design note that `review/` is kept off git.
- **Python on L:** not checked.
- **The state-sync race mechanism** is read from code, not instrumented (§3).
- **The idle state-sync pass rate:** I ran only loaded runs. A's "75/0 on four idle runs" is A's.
- **Whether the 4 FATAL-DEFAULT defaults are actually wrong on either machine.** Both use `C:\Consonance`, and each site has an
  env override. They are defects by the scanner's rule, which I did not re-litigate.
- **The other `deleter` call sites** in state-sync.test.js.
- **Whether the forget-rate bytes defect affects any other departed file:** only `SHELL.md` was traced.

## 5 · WRONG column

- **W1.** I drafted §2.1's assertion as "`r.status === 0`-shaped" and §2.3's as "actual `true`, expected `false`" before reading
  either source. Both were corrected against the files before filing: the first is `assert.ok(r.ctx, …)` and the second is
  `assert.strictEqual(res.red, false, …)` at `:240`.
- **W2.** My first blame script printed 0 rows. The awk `{40}` interval did not match, and then node got a `/c/…` path. I re-ran
  it in node with a Windows path. The count of 35 was checked against the scanner's own list before the first run (`grep -cE` → 35).
- **W3, carried from D069 and found here: `trailer-gate` is my board writer, and I never added it to `NON_PANE` or ran the JS
  suite after wiring it.** That is the same shape as `blind` on 08-01. The tripwire caught it; I didn't.
- **W4, carried from L046:** the `review` STAYS_PRIVATE entry (`8b24022`) is mine, and it has been red on D since it was written.

## 6 · Questions for the keeper (none were asked; the conservative default was taken)

1. **Python on D?** `userprompt_pulse` cannot pass without it. **Default taken:** no install. Recommend the test report NOT-RUN
   on a missing interpreter instead of FAILED.
2. **`exo_memory/review/` exists on one machine only**, by design (an answer key must not travel). Should it be carried to D, or
   should the two instruments accept "private and absent here"? **Default taken:** neither. It is recorded as MACHINE-BOUND.
   Carrying it moves an answer key, which is exactly what its column says not to do.

NEXT: librarian collate the six classes into per-class repair packets when D082 closes
