# L258 track 2, the right side's own width, continued on L: pane B, 2026-11-27

**Order:** the chair's 06:26:51Z order. Packet `exo_memory/loop/packet_t180_resume_on_L_2026-11-27.md` (befda277), "Track 2", read whole, after `loop/handoff_t180_2026-11-26-D.md` and `handback/p-d677-right-width-B_2026-11-27.md` ("Where I stopped").
**Branch:** `d677-right-width-b`, **e41acb1 → e4e7ecc** (one commit of mine on D's tip, tests only), base `landing-1126-batch` f3cd425. Pushed (checked): a fast-forward, not forced, `git push origin refs/heads/d677-right-width-b`; `git ls-remote` → e4e7ecc at 09:03:29Z.
**Worktrees:** `<Downloads>\t180-b-l258-wr` (the branch) and `<Downloads>\t180-b-l258-base` (detached at f3cd425), from the builder checkout; both clean (`git status --short` empty) and **removed** at hand-back; the branch stays in the builder repo and on origin.
No landing, build, install, merge or release.

**First line:** steps 1 to 4 are done with counts.
- **The whole suite on D's tip e41acb1 was not green:** 20 reds. 18 were this branch's own: the tests and harnesses had not yet been moved to it. One commit of test changes (e4e7ecc) answers them.
- **On e4e7ecc, the whole suite again:** 5,050 tests, **0 functional reds**, and 10 frame-timing reds taken beside another seat's heavy run.
  - Read apart under the exclusive hold, at base and on the branch, drag-frame, release-frame and the bank-drag cost fail as often at f3cd425 as on the branch.
  - **sculpt-frame's five rows are not measured base against branch** (below, owed).
- **The 30-mutant harness ran for the first time:** 23 of 30 caught. Six of the seven survivors now have a row each and are caught; the seventh is equivalent and left out by name.
- **Old tracks' exports:** 14 of 14 the same, 151 of 151 files.
- **Step 5** is owed to D.

## Step 1: the rows (checked)

- `node --test test/core_right_width.test.js app/test/core-right-width-panel.test.js` at e41acb1, under heavy-run, BelowNormal → **20 of 20** (15 and 5) (`rows-tip.txt`). The panel file's 5/0, inferred on D, is now **checked**.
- The same two files copied onto f3cd425 → **1 pass, 19 fail**; the pass is row 2, the no-split guard, as D found (`rows-base.txt`). The base tree was clean again after (`git status --short` empty).

## Step 2: the whole suite (checked)

**On D's tip e41acb1** (`npm test`'s command: `node --test --test-concurrency=4 "test/*.test.js" "app/test/*.test.js"`, TAP, under heavy-run at BelowNormal, 06:28:55Z to 07:14:37Z; `suite-tip.txt`, `suite-totals.txt`):
**tests 5,046 · pass 4,995 · fail 20 · cancelled 0 · skipped 28 · todo 3 · 2,742 s.** P's run of the base f3cd425 had 4,994 tests and 0 fail.

The 20 (`suite-fails.txt`, by `tapfails.js`), in four kinds:

| kind | rows | cause | answered |
|---|---|---|---|
| older harnesses' mutants NOT APPLIED | 7: core-xsec X11, core_cup M23, core_ramp A5 A7 EX3 EX4, core_xsec KE3-4 | the branch changed the very strings they mutate (`wd` or `widthR` added beside the old ones) | each mutant moved to the branch's string with the **same meaning**: it breaks what it broke, the new part as the branch has it (`fixmutants.js`, exact replacements, each found once) |
| "the next schema" rows | 2: core_edgeneg row 4, core_xsec SCHEMA; and the xsec harness's CONTROL, red because of the second | both named `core/7` as the unknown newer file this builder refuses; the branch makes core/7 the right width | **amended by name** to `core/8` (the property kept: the next schema is refused by name) |
| a pinned hash of documents as objects | 1: core_extend L135 7 | every road piece now carries a `wd` of 0s in memory, as it carries c, e, s, t and er | checked first (`golden135.js`, `golden135.txt`): with `wd` taken out, **all eight are d10eacf's goldens to the byte**, and no `wd` is non-zero. **Amended by name**, as D amended drag-ghost row 5: the row asserts both |
| the right-width harness's survivors | 7: R6, R7, R18 to R22 | no row saw them | below, step 3 |
| timing | 2: drag-frame row 8 (p95 9.8 / 10.3 ms over 6.9), release-frame row 1 (worst frame 14.3 ms over 6) | the machine, beside A's run and the suite's own concurrency | below, "The two timing rows" |

The 28 skips: 5 are sculpt-frame's rows, which run only when `CONSONANCE_DATA` names the lock folder (it was not set); the rest are private fixtures, his saves and Blender, none on L.

**On my tip e4e7ecc** (the same command, with `CONSONANCE_DATA` set, so sculpt-frame's rows run; 07:51:47Z to 08:41:01Z; `suite2-totals.txt`, `suite2-fails.txt`):
**tests 5,050 · pass 5,014 · fail 10 · cancelled 0 · skipped 23 · todo 3 · 2,953 s.** (+4 tests: the five new rows, less R7's mutant.)
- Every red of the first four kinds is green.
- **The 10 fails are all frame-timing rows** (`suite2-fails.txt`):
  - sculpt-frame rows 1, 2, 3, 4a and 4b: the five that now ran, p95 8.1 to 35.9 ms against a 6 ms bar;
  - drag-frame rows 3, 7 and 8;
  - release-frame row 1;
  - core-extra-bank-drag-cost D642 (2.40×, bar 2×).
- **The run began 43 s after A's 55-file Sculpt run took the other slot** (A L260, since 07:51:04Z, `heavy-run.js --status`), and ran beside it.
  - sculpt-frame times only when both slots are held by live processes, one of them its own run. That check passed because the other slot was A's live run.
  - So its five figures measure A's run as well: its own comment says "A timing taken beside another heavy run measures that run".
  - Read apart under "The timing rows".

## Step 3: the mutation harnesses (checked)

**As they stood in the suite at e41acb1** (`harnesscount.js`: each harness's own `id:` strings found as row names, since node's TAP gives a passing row no file; `harness-suite-e41acb1.txt`). Its counts agree with the 14 failing mutant rows `tapfails.js` found on its own.

| harness | mutants | applied | caught | NOT APPLIED | not caught |
|---|---|---|---|---|---|
| core_right_width_mutation (D's, first run) | 30 | 30 | **23** | 0 | 7 (R6 R7 R18 R19 R20 R21 R22) |
| core_cup_mutation (document, extend) | 48 | 47 | 47 | 1 (M23) | 0 |
| core_jump_mutation (document) | 27 | 27 | 27 | 0 | 0 |
| core_piece_mutation (document) | 64 | 64 | 64 | 0 | 0 |
| core_xsec_mutation (document, extend) | 67 | 66 | 66 | 1 (KE3-4) | 0; its CONTROL red |
| core_bank_flow_mutation (extend) | 45 | 45 | 45 | 0 | 0 |
| core_landing_xsec_mutation (extend) | 18 | 18 | 18 | 0 | 0 |
| core_ramp_mutation (extend) | 106 | 102 | 102 | 4 (A5 A7 EX3 EX4) | 0 |
| core_smooth_ramps_mutation (extend) | 18 | 18 | 18 | 0 | 0 |
| app/test/core-xsec-mutation (panel; not on the packet's list, red in the suite) | 31 | 30 | 30 | 1 (X11) | 0 |
| **all** | **454** | **447** | **440** | **7** | **7** |

**The seven survivors, each read against the unmutated code** (`survivors.js`, each mutant applied to a temporary copy of src/ and tools/, never the tree; `survivors.txt`):
- **R6** (a split piece's `wd` left out does not carry on): original carries 3.5 on (start 3.5, end 3.5); mutant refuses NO_CHANNEL. → row: *a split piece made with its wd left out carries the right width on from the end before it, value and slope, as an offset does.*
- **R18** (the change floor 40 → 1 m): `secondMinM('wd', 0, 3.5)` 40 against 1; a change asked over 10 m is refused BAD_SECOND ("needs at least 40.0 m") against laid. → row: *its shortest is the width's for the same change, and one asked shorter is refused by name.*
- **R19** (no start shape of its own does not follow the width's) and **R20** (the two-share ramp not taken for wd): at 5, 10, 15 m the original's wd ramp equals the width's (0.4587, 0.9064, 0.9993 of the change); R19's 0.2685, 0.7315, 0.9877, R20's 0.2604, 0.7396, 0.9930. → one row: *a right width with no start shape follows the width's two-share ramp, and one given the same shares lays the same ramp.*
- **R21** (Extend does not refuse a split tube itself): both refuse BAD_TUBE, the mutant in the document's words after the piece. → row: *Extend refuses a right width on a tube in its own words.* This guards the message the panel shows, not a different outcome; it is the weakest of the six.
- **R22** (close does not join wd at the seam): a lap whose first and last pieces both have a right width closes on both; the original's end meets the start (0, 0), the mutant's end stays 2.0421. → row: *closes with the right width joined at the seam.*
- **R7** (pieceEnd without `if (!P.split) out.wd = { v: 0, m: 0 };`): **equivalent, left out of the harness by name** (its comment, in the Sharp harness's LEFT OUT form). Every road piece the core makes carries a `wd` of 0s when it has no split: `roadPiece` (the optional channel's default), `parse` (`parseChannel`: an optional channel the text lacks takes its default), a placed saved piece (`piece.js`, the defaults filled). From those, pieceEnd reads `{ v: 0, m: 0 }` itself. The probe shows a difference only on a road object made by hand with no `wd` array (`{"v":0,"m":0}` against `undefined`), which none of pieceEnd's ten call sites outside document.js is given (`grep -rn "pieceEnd(" src app`, tests left out). inferred, from reading those constructors; a hand-made object could reach it.

**After the commit** (checked; `fix1.tap` → `fix1-fails.txt`, `harness-fix1.txt`; then `fix2.tap` → `harness-fix2.txt`):
- right width: **29 mutants, applied 29 / caught 29 / NOT APPLIED 0**, control ok. Each former survivor: **0 of 20 rows failed** in the suite, **1 of 25** now (`survivors-before-after.txt`).
- core_cup **48 / 48 / 0**; core_xsec **67 / 67 / 0**, its CONTROL ok; core_ramp **106 / 106 / 0**; core-xsec (app) **31 / 31 / 0**.
- The others (jump, piece, bank_flow, landing_xsec, smooth_ramps) were not touched and stand as in the table above.
- The rows: right width **20 of 20** (D's 15 and my 5), panel 5 of 5 (`fix2.tap`: 56 tests, 56 pass: the 25 rows, the 29 mutants, the CONTROL and the harness's crash stand-in row); core_edgeneg, core_xsec and core_extend green (`fix1.tap`: 372 tests, 370 pass; the 2 fails were my R21 row, below).

## Step 4: old tracks' exports, f3cd425 against the branch (checked)

- **His saves on L:** 16 files in the builder's tracks folder: 14 core tracks (`eq-`) and 2 of the old piece builder's word tracks (unlisted by the core shell, skipped). D had 27. Copied read only to my scratch folder at 06:29Z; the copies' hashes match his folder's. His folder was never written to. No track name is in any output: a track is its index and a hash of its text.
- **Written again on L** (D's `mnm.js` did not travel): `expcmp.js` opens each copy through the core shell (`open`, the app's route) and runs the shell's own `buildExport` with the app's exporter (`makeExporter`): Export for a closed track (2), the Test export for an open one (12), as the two buttons do. A sha256 for every written file. `cmpexp.js` compares two runs.
- **Result: 14 of 14 tracks the same, 151 of 151 files**, on base and branch (`exp-base.json`, `exp-tip.json`, `cmp-base-vs-branch.txt`). None refused, none failed to open. Three of the 14 saves have the same text (`f84e4d73…`).
- **Its control:** the first track exported twice in one process: the same on both trees.
- **The oracle can fail** (checked): (a) a copy of the branch with every right side widened 1 cm (`rightWidened(b, x.w, x.wd + 0.01)` in the adapter) → **2 of 14 differ**, the two whose roads take the cross-section path (an edge or a tube), the only path that function is on (`cmp-oracle-wider.txt`); (b) every copy's start turned 0.0001 rad → **14 of 14 differ, the kn5 in all 14** (`cmp-oracle-turned.txt`).
- **Correction, mine, in the instrument:** its first run read **0 of 14 the same**: every track differed in `.t180b-builder.json` only, and the control differed from itself. The export's ownership marker records `written: new Date().toISOString()` (`src/export/fromwords.js:444`). That first reading was the clock, not the branch. The marker is now hashed with that one field taken out, and only that field.

## Step 5: falsifier (b) on [T5] (not run)

**Owed to D.** It needs E's [T5] read and its tooling, which are local to D by rule (the packet's "What did not travel"). Its words, from D's hand-back: "E's 2964–3172 and 3172–3239, laid with a right-width step and nothing else changed, still miss pitch by more than 1.5×".

## The timing rows (checked, except sculpt-frame)

**First pass, the first suite's two timing reds** (`timing.cmd`, `timing-*.txt`):
- Run under heavy-run's **exclusive** hold, which waited for A's run to end, at base and on the branch, alternately, twice each.
- **drag-frame row 8:** passed 4 of 4.
  - p95: base 6.2 and 6.7 ms; branch 7.3, then 6.5 on the row's own retry, and 6.4 ms. Median 4.2 / 4.3. The bar is 6.9.
  - Both sit near the bar. On two runs each, the branch is **not separable** from base.
- **release-frame row 1:** **base f3cd425 failed 2 of 2** (worst frames 8.8 and 9.6 ms, bar 6.0). The branch passed 1 and failed 1 (13.0 / 9.4 ms).
  - So on L this row is red without the branch.

**Second pass, the four files of the re-run's reds, whole** (`timing2.cmd`, `timing2-*.txt`; exclusive hold, 08:41:47Z to 09:01:41Z, `CONSONANCE_DATA` set, base and branch alternately, twice each):

| row | base, 1 | branch, 1 | base, 2 | branch, 2 |
|---|---|---|---|---|
| core-extra-bank-drag-cost D642 (bar 2×) | fail, 2.15× | pass | pass | fail, 2.06× |
| release-frame row 1 (bar 6.0 ms) | fail, 10.8 | pass | pass | fail, 9.7 / 10.9 |
| drag-frame row 8 (bar 6.9 ms p95) | pass | pass | fail, 8.6 / 7.8 | fail, 8.3 / 7.5 |
| drag-frame row 9, "after 21 km whose last piece still rolls" (bar 2×) | pass | fail, 2.03× | pass | pass |
| drag-frame rows 3 and 7 (red in the re-run) | pass | pass | pass | pass |

- inferred: these rows are at their bars on L, at base as on the branch. On two runs a tree, a small cost of the branch cannot be told from that noise.
- Row 9 failed once, on the branch only, at 2.03× against 2×. Named, not explained.
- **sculpt-frame's five rows: NOT measured base against branch.**
  - Under the exclusive hold they do not time ("not timed: both heavy-run slots must be held by a live process"). Their rule wants both slots held, one by the timing run and the other idle.
  - At 09:0xZ both slots were taken: P's (L262: the merge, the tier and the build for his install) and A's (L261). Holding one would have held up P's install, so I did not.
  - **Owed:** sculpt-frame at f3cd425 and at e4e7ecc, alternately, with the other slot held idle by the same seat. Until then, whether the branch slows Sculpt is **not known**.

## Corrections, mine

- `survivors.js`'s first R6 scenario gave a 60 m piece a 100 m piece's control points; both trees refused it BAD_CHANNEL and it showed nothing. Rebuilt with the piece's own length and knots (its comment says so).
- My R21 row first anchored its pattern at the message's start, which begins with the code ("BAD_TUBE: …"): it failed on the unmutated copy, so that run's CONTROL failed and its "caught" for R21 meant nothing. Fixed, and the harness run again: control ok, R21 caught by that row alone.
- The export comparison's first reading (above).

## What did not travel, and L's facts

- D's scratch (`suite.sh`, `mnm.js`, `bytes.cjs`, `lapexport.cjs`, the copies of 27 tracks and 16 undo sidecars): not on L. **D's byte-for-byte reading of saves and undo (27/27, 406/406) was not re-run here**; the export comparison above covers L's 14 core tracks' exports, not their saved text or undo.
- [T5] and its tooling: on D only.
- His T-180 app was running when the suite re-run began (pid 17564, `tasklist`, 07:5xZ). The run went on beside it at BelowNormal (a test run, not a build). It was closed by 08:4xZ (`tasklist`, before the second timing pass). No build.
- My own failure lister (`tapfails.js`) first wrote `app/test/` files as `test/`. The TAP doubles a location's backslashes, and a greedy match caught the inner `test`. It was fixed, and every `*-fails.txt` here was made again with it.

## The machine

- leftovers.js: before, tab proxies **UNCALIBRATED (read 0, the control made none)**, orphan browsers 0, 35 linked worktrees and the main; after the first timing pass, the same (`leftovers-before.txt`, `leftovers-after-timing.txt`). **At the end**, after my two worktrees were removed: tab proxies UNCALIBRATED (read 0, the control made none), orphan browsers **0**, **33** linked worktrees and the main (`leftovers-end.txt`). No `t180-l258-surv-` or `t180-wd-mut-` folder is left in Temp, and the oracle's tree copy is removed.
- Every mutant and probe ran on temporary copies; `<temp>\t180-l258-surv-*` removed.

**Evidence:** `p-l258-right-width-B_2026-11-27_evidence/` (paths written `<scratch>`, `<Downloads>`, `<temp>`, `<home>`).

**Who acts next:**
- The librarian, then the chair: a reader of `d677-right-width-b` e4e7ecc who wrote none of it, as the packet says.
- A seat with both heavy-run slots to itself: the sculpt-frame timing, base against branch.
- D: falsifier (b) on [T5].

SOURCES: git rev-parse/ls-remote for d677-right-width-b and landing-1126-batch; suite.tap and suite2.tap through tapfails.js and harnesscount.js; fix1.tap, fix2.tap; expcmp.js and cmpexp.js runs; timing.cmd and timing2.cmd outputs; survivors.js and golden135.js; leftovers.js; heavy-run.js --status; tasklist
NEXT: librarian call_chair with this hand-back's path when it has read it, for a reader of d677-right-width-b e4e7ecc
