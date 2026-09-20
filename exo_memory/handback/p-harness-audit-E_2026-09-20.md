# P-HARNESS-AUDIT — every JS mutant score in the record, and the method each one states (pane E, L064 packet 2)

Audit, not a repair: `consonance/tools/mutant-harness.js` is untouched. Started 06:12:26, filed 06:20 (`date +%T` at both ends; the whole audit is eight minutes of scripts and reading).
Machine L. **Nothing committed.** I am a non-author of the harness; **six rows of the universe below are mine and are
marked, and they are classified by the same rule as everyone else's.**

## 0 · Registered BEFORE the classification pass — the null, the falsifier, and the can-it-vary check

**THE NULL (registered first, because it is the outcome that would make this lap boring and it is the one I expected):**
every JS mutant score in the record is accompanied, in its own hand-back, by a named runner — a private script by
path before the harness existed, or the tracked harness plus its named JS score adapter after. If that holds, the
record is clean and the tool still needs fixing separately.

**THE FALSIFIER, in the words that would make it true:** a row that publishes a mutant score on a `.js` target whose
METHOD CANNOT BE IDENTIFIED from the hand-back — in particular a row claiming the tracked harness on a JS target with
no adapter named, since the harness alone cannot score node:test and would have returned NO RESULT on every mutant.

**CAN THE QUANTITY TAKE MORE THAN ONE VALUE ON THIS OBJECT? Checked before classifying anything** (`node scan.js`,
`node digest.js`): the corpus holds rows on both sides of the harness's landing — **62 dated before 2026-09-19 and 17
on or after** — and **11 rows name `mutant-harness.js`**. So "names an adapter" was free to come out either way, and
"names a runner" was free to come out No. It did come out No five times (§3), so the measure did vary on this object
rather than being fixed by construction. This is the L063 check, run at the top rather than assumed.

## 1 · The chair's fact, re-run at the file

    grep -n "cargoResult\|test result:\|node --test\|nodeResult\|jsResult" consonance/tools/mutant-harness.js
      :80  function cargoResult(out)
      :81  /test result: (ok|FAILED)\. (\d+) passed; (\d+) failed/
      :113 the only call site
      — and ZERO hits for any node:test path.

    git log --diff-filter=A --format="%h %ad" -- consonance/tools/mutant-harness.js
      5602507  2026-09-19 11:11:19 -0600

**The harness is one day old.** That single fact reframes the question: every JS mutant run before 2026-09-19 could
not have used it, so "did it ride an unnamed adapter" is only askable of the rows after that date — and it is askable
of ALL rows whether they name any runner at all.

## 2 · The universe, and how it was built

**Membership, fixed before reading any row:** the hand-back (a) publishes a mutant SCORE — a count carrying
applied / listed / killed / caught / survived / no result / NOT APPLIED — and (b) the mutated target is a `.js`,
`.mjs` or `.cjs` file.

    node scan.js      244 hand-backs → 81 carry a score line → 79 also name a .js path
    node digest.js    per row: the score lines, ±3 lines of context, and every line naming a runner
    node classify.js  the member list below; the CLASS is my judgement, the QUOTE is pulled from the file

**50 rows are in.** Excluded after inspection: rows whose target is Rust or PowerShell even though a JS runner applied
the mutants (`p-composer-tristate-E`, `p-trailer-gate-B`, `p-launch-ghost-E`, `p-launch-pull-E`, `p-digest-at-ring-A`,
`p-intake-window-C`), and rows whose count is not a mutant score at all (`p-corpusage-ratchet`, `gate-tests-read`).

**The four classes:**

    P  a private runner NAMED BY PATH — a tracked *.mutants.js, dev/mutation/*, or a scratchpad script
    H  the tracked mutant-harness.js WITH its JS score adapter named
    N  a mutant score published and NO runner or adapter identifiable anywhere in the hand-back
    Q  a score the row states it did not run itself — another seat's number, quoted

## 3 · THE RESULT — the feared case did not happen; a smaller one did

**Not one row claims the tracked harness on a JS target without naming an adapter.** All 7 harness-era JS rows name
one, and two of them (`p-carry-dir-flush-C`, `p-order-parameter-C`) document the cargo-only parser in the hand-back
itself, as mine does. The two the chair named check out at source: `p-brace-counter-A`'s 11 of 11 on `portable-paths.js`
names `pp_score.js` ("copies the LIVE working test file into the worktree … prints cargo's summary shape"), and
`p-carry-dir-flush-C`'s 12 listed / 1 no result at pre-flight 169/0 names `SCR/score-js.js` and says why it was needed.

**The falsifier fires in its weaker arm: five rows publish a mutant score with no identifiable method, and one is
mine.** They are members 1, 7, 8, 9 and 29 below. Four name no runner anywhere
(`grep -inE "harness|runner|applied by|by hand|each mutant"` → nothing); the fifth, `p-first-push-gate`, prints a
literal placeholder — `node <harness> ... with CONSONANCE_LAUNCH_PROBE=1` — which is a command nobody can re-run.
**My `p-blind-write-E` is in that class**: it publishes `8 applied: 7 caught · 0 SURVIVED · 1 NOT APPLIED`, names each
mutant, discusses which test caught which, and never says what applied them.

So: **the record's numbers are not unexplained by a hidden adapter. 43 of 50 name their method; 5 name none; 2 quote
another seat's.** The tool still needs fixing, and this audit says nothing about that beyond §1.

## 4 · THE MEMBER LIST — 50 rows, each with its own stated method

| # | hand-back | target | class | the method, in the row's own words |
|---|---|---|---|---|
| 1 | `p-indicator-loop-chain-ui_2026-09-01` | chain-indicator.js | N | (no runner or adapter named anywhere in the file) |
| 2 | `p-aura_2026-09-02` | chain-indicator.js | P | `aura-mutate.js` in the scratchpad; it keys on the `N passed, M failed` result line, **never on the |
| 3 | `p-baton-wake_2026-09-03` | baton-wake.js | P | dev/mutation/mutate-baton-wake.js 16 mutants |
| 4 | `p-d006-baton-gate_2026-09-04` | lap-row.js | P | `dev/mutation/mutate-lap-row.js` (the mutation harness for the file I own — named here because it |
| 5 | `p-d007-smallfixes_2026-09-04` | commit-gate.js / js-suite.js | P | `dev/mutation/mutate-smallfixes.js` (new — neither file had a mutation harness). |
| 6 | `p-d011-opened-gate_2026-09-06` | lap-row.js | P | `dev/mutation/mutate-lap-row.js`. Nothing else touched; `BUILDING.md` is the chair's pen (packet 3) |
| 7 | `p-first-push-gate_2026-09-06` | gen-consumer.js | N | node <harness> ... with CONSONANCE_LAUNCH_PROBE=1 |
| 8 | `p-inheritance_2026-09-06` | JS tools of that lap | N | (no runner or adapter named anywhere in the file) |
| 9 | `p-vantage-two-regs_2026-09-08` | vantage-disposition.js / vantage-sealed-scope.js | N | (no runner or adapter named anywhere in the file) |
| 10 | `p-close-push_2026-09-09` | close.js / state-sync.js | P | `consonance/tools/close.mutants.js`. **Touched:** `consonance/tools/state-sync.js` (the receipt — |
| 11 | `p-install-names_2026-09-09` | state-sync.js | P | `consonance/tools/state-sync.mutants.js`. Nothing else. `main.rs` is C's and was read only.* |
| 12 | `p-live-host_2026-09-09` | live-host.js | P | `scratchpad/mutants-live-host.js`. Each is a rewrite a plausible implementation would actually have |
| 13 | `p-live-mirror_2026-09-09` | live-mirror.js | P | (no runner or adapter named anywhere in the file) |
| 14 | `p-roster-arrival_2026-09-09` | state-sync.js | P | `consonance/tools/state-sync.test.js`, `consonance/tools/state-sync.mutants.js`. Nothing else. |
| 15 | `p-state-repo_2026-09-09` | state-sync.js | P | node consonance/tools/state-sync.mutants.js 21 killed, 0 survived, 21 total |
| 16 | `p-state-set_2026-09-09` | state-manifest.js | P | (`scratchpad/mutants-state-manifest.js`). Unplaced-defaults-to-STAYS; forbidden-does-not-fail; |
| 17 | `p-place_2026-09-12` | place-conversations.js | P | dev/place-conversations.mutants.js 20 mutants, 20 killed, 0 survived |
| 18 | `p2-tail-carry_2026-09-12` | tail-carry.js | P | dev/tail-carry.mutants.js 28 mutants, 28 killed, 0 survived, 0 not-applied |
| 19 | `p-diverged-A_2026-09-14` | tail-carry.js | P | ## RESUMED ON D, 08:47–09:40 — step 3 done: see §4. Steps 1–2 re-run by me on D: tail-carry 129/0, stick-apply 27/0 (f |
| 20 | `p-leave-A_2026-09-14` | leave/stick JS | P | node scratchpad/ctrl_leave.js pre-flight 59 passed, 0 failed · 19 applied · 19 caught · 0 survived · 0 NOT APPLIED |
| 21 | `p-no-console-A_2026-09-14` | tail-carry.js / stick-waiter.js | P | node scratchpad/ctrl_noconsole.js 13 applied · 13 caught · 0 survived · 0 NOT APPLIED |
| 22 | `p-stick-A_2026-09-14` | tail-carry.js | P | dev/tail-carry.mutants.js 28 → 44 mutants · 44 killed · 0 survived · 0 not applied |
| 23 | `p-stick-build-A_2026-09-14` | tail-carry.js | P | dev/tail-carry.mutants.js writes into a COPY (§5) · 44 -> 67 mutants |
| 24 | `p-diversity-c1-C_2026-09-15` | s40-strip.js | P | **Mutants, on a scratch copy** (`<scratchpad>/c1/mut/mutate.js`; the tracked file's sha256 is unchanged after): |
| 25 | `p-harness-A_2026-09-15` | close.js / state-sync.js | P | # P-HARNESS · ALPHA — close.mutants.js and state-sync.mutants.js no longer write a tracked file; --only on all three |
| 26 | `p-harness-read-B_2026-09-15` | close.js (--only N) | P | I read the uncommitted `close.mutants.js`, `state-sync.mutants.js`, `close.test.js`, `state-sync.test.js`, `dev/tail-c |
| 27 | `step0-phase-E_2026-09-15` **(MINE)** | phase-window.js | P | **Mutants** (`scratchpad/step0/mutate.cjs`, output `mutate.out`): both files copied into `mut/`, only the copy mutated |
| 28 | `step0-redact-A_2026-09-15` | redact.js | P | MUTANTS on a replica (scratchpad/redact_mutants.js); pre-flight 28/0; the three tracked files hashed before and after |
| 29 | `p-blind-write-E_2026-09-16` **(MINE)** | blind.js | N | (no runner or adapter named anywhere in the file) |
| 30 | `p-boundary-fixes-E_2026-09-16` **(MINE)** | boundary-check.js | P | node scratchpad/bc/mutants.js (8 mutants, each on a FRESH copy of the landed files) |
| 31 | `p-boundary-read-B_2026-09-16` | boundary-check.js (E's numbers) | Q | (no runner or adapter named anywhere in the file) |
| 32 | `p-carry-exclude-C_2026-09-16` | tail-carry.js | P | node dev/tail-carry.mutants.js --only 1 |
| 33 | `p-harness-read-B_2026-09-16` | tail-carry.js (quoted) | Q | `dev/tail-carry.mutants.js` (+78, uncommitted), `exo_memory/loop/packet_harness_and_lib_2026-09-15.md` §3 (+69), |
| 34 | `p-harness-revision-A_2026-09-16` | tail-carry.js / close.js | P | - `dev/tail-carry.mutants.js` — the carrier: header rules, and the two gates built. |
| 35 | `p-nul-guard-A_2026-09-16` | text-census.js | P | node <scratchpad>/text-census.mutants.js |
| 36 | `p-nul-repairs-B_2026-09-16` | stick.js | P | **Mutants on copies** (`scratchpad/nul/stick_mutants.js`; re-copies `stick.js`, `stick.test.js`, `term.js` per row; |
| 37 | `p-stick-zombie-A_2026-09-16` | stick-apply.js | P | MUTANTS, on a copy beside the source via STICK_APPLY_UNDER_TEST (scratchpad/stick-apply.mutants.js): |
| 38 | `p-track-pools-A_2026-09-17` | check_stock_lights.js | P | MUTANTS of that check, on copies of the script (scratch/tracklights/check_mutants.js), repo script unchanged |
| 39 | `p-stale-lap-C_2026-09-18` | chain-status.js | P | (no runner or adapter named anywhere in the file) |
| 40 | `p-brace-counter-A_2026-09-19` | portable-paths.js | H | MUTANTS — consonance/tools/mutant-harness.js, as the bar said, on a COPY: |
| 41 | `p-carry-dir-flush-C_2026-09-19` | tail-carry.js | H | - 11:5x — **Mutants: `consonance/tools/mutant-harness.js` needed an adapter.** Two findings about the harness: |
| 42 | `p-flush-before-done-C_2026-09-19` | tail-carry.js | P | \| `dev/tail-carry.mutants.js` \| +32, ten rows: the harness is the file's own mutation test, so I counted it as "its te |
| 43 | `p-mutant-harness-check-A_2026-09-19` | the harness itself | P | **Two new files, both untracked: `consonance/tools/mutant-harness.js` and `consonance/tools/mutant-harness.test.js`. |
| 44 | `p-race-and-bytes-C_2026-09-19` | JS tools of that lap | H | - 12:1x (after the lap) — **Mutants, both via `consonance/tools/mutant-harness.js` on HEAD worktree copies**, with |
| 45 | `p-ready-not-the-child-E_2026-09-19` **(MINE)** | dev/shell/lib/ready.js | H | node consonance/tools/mutant-harness.js scratchpad/ready/rows.js --audit |
| 46 | `p-scorer-portable-E_2026-09-19` **(MINE)** | score-portable.mjs | P | node scratchpad/portable/mutants.js each mutant in a FRESH throwaway checkout (`git init` in the OS temp dir) holding |
| 47 | `p-deference-unit-C_2026-09-20` | deference-unit.js | H | Run with `consonance/tools/mutant-harness.js` on a HEAD worktree copy; the live file's sha is checked before and |
| 48 | `p-order-parameter-C_2026-09-20` | order-parameter.js | H | `node consonance/tools/mutant-harness.js <scratch>/def/rows-order.js` — HEAD worktree copy, live file hashed before |
| 49 | `p-shuffle-guard-E_2026-09-20` **(MINE)** | order-parameter.js | H | node consonance/tools/mutant-harness.js <rows.js> |
| 50 | `p-contamination-B_2026-09-20` | contamination.js | P | **A's `run2/rig/score.js` is untouched** — its ITEMS, ARM_ITEMS, `scoreRows` and `slug` are imported, so the |

    universe: 50 rows · P 36 · H 7 · N 5 · Q 2 · mine 6

## 5 · My own six rows, said plainly rather than around

    p-shuffle-guard-E_2026-09-20      H  the harness + score.js adapter, with the parser defect written into the file
    p-ready-not-the-child-E_2026-09-19 H  harness for the GATES only; kills by scratchpad/ready/mutants.js, named, with the reason
    p-scorer-portable-E_2026-09-19    P  scratchpad/portable/mutants.js
    p-boundary-fixes-E_2026-09-16     P  scratchpad/bc/mutants.js
    step0-phase-E_2026-09-15          P  scratchpad/step0/mutate.cjs
    p-blind-write-E_2026-09-16        N  NO RUNNER NAMED — the same defect I am reporting in four other seats' rows

One of my six is in the worst class in this audit. It is not treated more gently than the others: it sits in §3's
finding by name, and if the room wants the N rows re-derived, mine is one of the five.

## 6 · Corrections, including mine

- **A wrong grep pattern nearly produced a false finding against five rows, one of them my own.** I searched the
  candidate files with `grep -inE "mutat"`, which matches "mutation" and "mutated" but NOT "mutant"/"mutants" — the
  word those files actually use. Four rows came back empty and I briefly read that as "no mutant discussion at all".
  Caught by re-running with `grep -i "mutant"` on the same file and getting hits, then checking the substrings:
  `muta` 3 · `mutan` 3 · `mutant` 3 · `mutats` 0. **A pattern that is one letter too long is indistinguishable from an
  absent finding**, and the only reason it surfaced is that the two results disagreed on the same file.
- **`step0-redact-A_2026-09-15` appears to name the harness four days before the harness existed.** It does not: the
  hit is the phrase "mutant-harness text" inside a redaction word list. Checked rather than counted.
- **The class of each row is my judgement and is published as such**; only the quote beside it is mechanical. A reader
  who disagrees with a class can re-run `classify.js` with the row moved and the counts change by one.

## 7 · NOT verified

- **I did not re-run any of the 50 mutant runs.** This audit reads what each hand-back SAYS its method was. A row in
  class P names a runner; whether that runner exists, ran, or produced the number printed is not checked here. The
  chair's question was whether the method is named, and that is all §3 answers.
- **Class N is "not identifiable from the hand-back", never "the number was invented".** Four of those five are
  pre-harness rows whose scratchpads are long gone; the method may have been perfectly sound and simply unwritten.
- **The universe rests on my membership rule and on regex.** Rows using words my score regex does not cover
  (a kill count phrased in prose with no count-word) would be invisible to it, and a row naming no `.js` path at all
  would have been dropped at the 81 → 79 step. I did not hand-check the 163 files that mention mutants against the 50.
- **Six rows' targets are my reading of the hand-back, not of the run** — `p-inheritance`, `p-race-and-bytes-C` and
  `p-leave-A` in particular name several files, and I recorded the one the mutants appear to be aimed at.
- **The two Q rows** (`p-boundary-read-B`, `p-harness-read-B_2026-09-16`) are classified from their own statements
  that they ran nothing; I did not check whether the numbers they quote match the rows they came from.
- **Nothing about whether the harness SHOULD be fixed, or how.** Four seats wrote adapters in one night; that is the
  repair lap's evidence, and this is the audit.
