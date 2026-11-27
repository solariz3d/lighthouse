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

---

## F1: a saved piece added at a split head, in his words (2026-11-27, 09:4xZ)

**Order:** the chair's 09:16:26Z order. The object is O's read, `handback/p-l258-read-right-width-O_2026-11-27.md` (room ed2ef01e), section "F1" (line 102), read whole. The librarian's leg is note 711dbdb4: "O's first option only … a row for it, red first, and the limit named in the CHANGELOG beside SPLIT_RUN." Not the second option.

**New tip: `d677-right-width-b` 8b7cafc** (8b7cafc8ba524a118c2e1459e3d5c883ee128075), one commit on e4e7ecc. Checked: `git log -2`, `f1-commit-stat.txt`.
- **Not pushed.** `git ls-remote origin refs/heads/d677-right-width-b` still reads e4e7ecc (checked). The local branch is "ahead 1".
- **Not in tonight's test build.** P merged e4e7ecc; 8b7cafc is on no other branch.
- **Worktree:** `<Downloads>\t180-b-l258-f1`, clean at the end (`git status --short` empty) and **removed** (checked: `git worktree remove`, then `ls`).
- P's worktree and the landing branch were not opened.
- No landing, build, install, merge, push or release.

**First line:** the refusal now names the right width and the width, says what lets the piece in, and fires only when the right width is the joint's one fault.
- The row was red at e4e7ecc with O's exact text, and is green on 8b7cafc.
- The touched rows pass 141 of 141.
- The right-width harness: 31 of 31 applied and caught, control ok.
- Nothing laid changed.

### What changed (checked: `git show --stat 8b7cafc`, 7 files, +48/−5)

- **`src/core/piece.js` `insert`:** when Add's own joint is refused (JOINT) and `onlyRightWidth` holds, it throws `SPLIT_HEAD` instead. He reads (checked, through the shell, `f1shell-fix.txt`):
  > SPLIT_HEAD: the road's right side has its own width at the head (right width 22.6 m, width 19.1 m), which a saved piece cannot carry on yet; Extend with right width m set to the width (19.1), then add the piece
- **`onlyRightWidth`:** the document's own `jointProblem` fails at the head, and passes when the head's wd is the run's 0. So the words are said only when wd is the joint's one fault.
  - There is no second tolerance and no reading of message text.
  - An edgeless piece at an edged split head is still refused on its edge (`JOINT … e starts at 0`). The right width does not cure that, so it is not named (checked: the row's last two asserts, `f1probe-fix.txt`).
- **`src/core/document.js`:** exports `jointProblem`, one name added to `module.exports`.
- **Not changed:**
  - The piece is still refused, and nothing is carried. O's second option, carrying wd through the inserted piece, is not done.
  - A saved piece that starts with a jump is laid at a split head, before and after (checked: `f1probe-e4e7ecc.txt`, `f1probe-fix.txt`: "laid: 5 pieces, head wd {v:0, m:0}").
  - `keepStart` is unchanged. The shell never passes it (checked: `app/core/coreshell.js` `insertPiece` and `showPiece` call `PC.insert(…, { mirror })`). At a split head it still says PIECE_START, on kh in my probe.
- **CHANGELOG:** in the right-width entry, beside `SPLIT_RUN`: "For the same reason a saved piece is not added where the road's right side has its own width (`SPLIT_HEAD`, which names the right width and the width there): Extend with right width m set to the width first, then add the piece. A saved piece that starts with a jump is still added there, its landing one width, as the landing after a Jump is."
  - `src/core/README.md` and `MAP.md`: their `SPLIT_RUN` lines name `SPLIT_HEAD` too.

### The row, red first (checked)

- The row is `test/core_right_width.test.js`, "a saved piece added at a head whose right side has its own width is refused in his words (SPLIT_HEAD), and is laid once the right width is back at the width". It asserts five things:
  1. the code, for the piece and its mirror;
  2. the two widths in his field's name;
  3. the way in;
  4. no `wd` in the words;
  5. laid after `extend(… targets: { wd: 0 })`, and the edged head still JOINT on `e`.
- **Red at e4e7ecc plus the row:** 21 tests, 20 pass, 1 fail. The fail is the new row: "JOINT: piece 3 (p4): wd starts at 0, the previous piece ends at 3.5 …", O's text (`f1-red.tap`, `f1-red-fails.txt`).
- **Green on the fix:** 21 of 21 (`f1-green.tap`).
- **Through the shell** (`f1shell.js` on the fix, `f1shell-fix.txt`):
  - the click (`showPiece`) shows no ghost and the words;
  - Add (`insertPiece`) leaves the pieces 3 → 3 with the words;
  - after an Extend with `targets: { wd: 0 }`, the click shows the ghost and Add lays it (4 → 5, "added the piece …").
- **Inferred, not driven:** that typing the width into "right width m" sends that same wd 0. `app/core/panel.js:227` sends `targets.wd = wR - ref`, so yes by the code. The panel itself was not clicked.

### The tier (checked)

- **Touched rows**, at BelowNormal, no slot (light): **141 of 141 pass**, 0 fail, 0 skipped (`rows-touched.cmd`, `f1-touched.tap`, 09:26:14Z–09:27:35Z). The five files:
  - `core_right_width`;
  - `core-right-width-panel`;
  - `core_piece`;
  - `core-pieces-ui` (its "headless" preview is a fake, no browser);
  - `piece-ghost`.
- **The right-width harness**, under heavy-run at BelowNormal (`harness-f1.cmd`, `f1-harness.tap`, `f1-harness-heavyrun.txt`):
  - It asked at 09:27:54Z and waited behind P (L262's whole suite) and A (L261). It ran 182 s and ended at 09:41:05Z.
  - **33 of 33 pass:** the CONTROL, the crash stand-in and 31 mutants.
  - `harnesscount.js`: **applied 31 / caught 31 / NOT APPLIED 0**, control ok (`f1-harness-count.txt`).
  - New: **R26** (the words never said: `if (false)`) and **R27** (any JOINT at a split head said as SPLIT_HEAD, without the wd-only test).
  - Inferred, not read per row: R27 is caught by the edged-head assert, the only one that tells the two apart.
- **The piece harness is not run** (not in the tier). Its 64 mutant strings still occur exactly once each in 8b7cafc's `piece.js`. That is static only, `applied.js` → `applied-f1.txt` (it reads the harness as text). The same check gives 31 of 31 for the right-width harness.
- **Not run:** the whole suite and every other harness.

### A limit, named (inferred from the code, not seen)

- The words print the head's two widths. A head whose right width equals the width but whose wd is still changing (a slope, no step) is refused too, and would read "right width 19.1 m, width 19.1 m".
- Extend's pieces end their ramps level, so I have not made one.

### Correction, mine

- **I ran the right-width harness by accident, outside heavy-run and at normal priority.** To check each mutant still applies, I `require`d `test/core_right_width_mutation.test.js` from `node -e` to read its `MUTANTS`. Requiring it registered its 31 mutant tests, and node ran them.
- It began about 09:23Z, beside P's and A's runs, and took no slot. The call's 120 s timeout moved it to the background, and I stopped it then (TaskStop), about 2 minutes in.
- **Left:** no node process (checked: `Win32_Process` by command line). One temp copy, `t180-wd-mut-yekr0w`, was mine by content (its copy holds `SPLIT_HEAD`, which no other tree has) and is removed.
- The check was redone reading the harness as text (`applied.js`), and the harness's count above is the heavy-run one.

### Names and the machine

- **Privacy grep** over the builder diff's added lines: 0 (checked).
- **Names:** `node namecheck258.js <scratch>/l243/survey.json f1-added.txt` → 65 terms, 1 hit, on #31, the common word "road". The rows use synthetic roads only; no save of his was opened in this section.
- **`<temp>\t180-wd-mut-*`** after the harness: 0 (checked).
- **The sculpt-frame timing:** still owed, not started, by the order.

**Evidence:** 18 files added to `p-l258-right-width-B_2026-11-27_evidence/`, 56 → 74, none overwritten: `f1probe.js`, `f1probe-e4e7ecc.txt`, `f1probe-fix.txt`, `f1shell.js`, `f1shell-fix.txt`, `applied.js`, `applied-f1.txt`, `rowsf1.cmd`, `rows-touched.cmd`, `harness-f1.cmd`, `f1-red.tap`, `f1-red-fails.txt`, `f1-green.tap`, `f1-touched.tap`, `f1-harness.tap`, `f1-harness-heavyrun.txt`, `f1-harness-count.txt`, `f1-commit-stat.txt`.

**Who acts next:** O reads the delta e4e7ecc..8b7cafc. Landing 8b7cafc is a named landing pane's, after that read, and not tonight's test build.

SOURCES: handback/p-l258-read-right-width-O_2026-11-27.md:102 (ed2ef01e); librarian note 711dbdb4; git log/show --stat/rev-parse/ls-remote for d677-right-width-b; f1-red.tap, f1-green.tap, f1-touched.tap, f1-harness.tap through tapfails.js and harnesscount.js; f1probe.js and f1shell.js runs; applied.js; namecheck258.js; heavy-run.js --status
NEXT: librarian call_chair with this hand-back's path when it has read the F1 section, for O's read of d677-right-width-b e4e7ecc..8b7cafc

---

## F2: a right width typed as the width is shown is back to the width (2026-11-27, 10:0xZ)

**Order:** the chair's 09:48:06Z order. The object is O's "Delta read, 2026-11-27 09:5xZ" and its "F2" (`handback/p-l258-read-right-width-O_2026-11-27.md:154`, `:182`, room 1680c3fe), read whole. The librarian's leg is note f46ba2bd: "ONE rule … choose one and say why, and say what each does to a right width he really wants 3 mm off"; rows red first on a head of width 19.1346 and on one left by the width brush; "The CHANGELOG's way back must hold as written."

**New tip: `d677-right-width-b` de6c069** (de6c06923302e251f60b60db1bf7e34d7a83b836), one commit on 8b7cafc. Checked: `git log -2`, `f2-commit-stat.txt`.
- **Not pushed:** `git ls-remote` still reads e4e7ecc (checked). The local branch is "ahead 2".
- **Not in tonight's build.**
- **Worktree:** `<Downloads>\t180-b-l258-f2`, clean at the end and **removed** (checked).
- No push, landing or build.

**First line:** one rule, in the panel. With the width left as shown, a right width typed equal to the width as its field shows it is sent as wd 0. Extend ends that at exactly 0.
- Followed as typed, SPLIT_HEAD's advice lays the piece on both of O's heads, and the CHANGELOG's way back keeps core/4. Both were red at 8b7cafc and are green on de6c069.
- Touched rows: 144 of 144.
- Harness: 35 of 35 applied and caught, control ok.

### The rule, and why this one (the code checked; the alternative inferred, not built)

- **Built, `app/core/panel.js` `extendOptions`:** `backToWidth(typed, ref) = targets.w === undefined && typed === near2(ref)`.
  - `near2` is the module's own two-decimal rounding, the same arithmetic as the fields' `show`.
  - When it holds, wd is 0, both for the head's target and for each right width change (`wdAt`). Otherwise wd is `typed − width in force`, as before.
  - The line `targets.wd = wR - ref;` is kept as it was (mutant P1 still edits it) and is followed by `if (backToWidth(wR, ref)) targets.wd = 0;`.
- **SPLIT_HEAD's numbers** now use that same arithmetic (`piece.js` `shown2`, which was `toFixed(2)`). So the number the words give is the one his field shows (asserted on both heads, below).
- **Why the panel and not Extend:** the error is the display's rounding, and the display is the panel's. Taking any wd target within 0.005 m as 0 in Extend would make every right width within 5 mm of the width unlayable from every caller. The core stays exact this way.
- **What each does to a right width he really wants 3 mm off:**
  - **Built (checked, `f2mm.js` → `f2mm-fix.txt`, through `extendOptions` and Extend):**
    - On a width that shows all its decimals (19.1), typing 19.103 lays exactly 3 mm off.
    - On 19.1346 (shown 19.13), typing 19.1376 lays exactly 3 mm off.
    - Typing width 19.13 and right width 19.133 lays 3 mm off the typed width, which then becomes the width.
    - Only the one number, the width as shown (19.13), now means "back to the width".
    - Unchanged from before: on 19.1346, typing 19.133 (3 mm over what he sees) lays −1.6 mm off the real width.
  - **Not built (inferred):** with Extend taking a wd within 0.005 m as 0, none of those 3 mm right widths could be laid, by any number, from any caller.

### The rows, red first (checked)

The rows are three, in `app/test/core-right-width-panel.test.js`, one of the harness's two files.

**Red at 8b7cafc plus the rows:** 8 tests, 5 pass, 3 fail. The 3 fails are the new rows (`f2-red.tap`, `f2-red-fails.txt`):
- **The rule on `extendOptions`:** typing '19.13' beside a head of 19.1346 sends −0.0046, against the asserted 0.
- **SPLIT_HEAD's advice typed as written:** "typed: the right width ends back at the width" fails. It got past "refused by name first", so the first add was refused at 8b7cafc.
- **The CHANGELOG's way back:** "typed: the new piece writes no wd" fails.

The SPLIT_HEAD row stops at its first head. So both heads were read one by one at 8b7cafc (`f2probe.js` → `f2probe-8b7cafc.txt`). O's numbers again:

| head | words give | wd sent | ends wd | second add | way back |
|---|---|---|---|---|---|
| typed 19.1346 | 19.13 | −0.0046 | −0.0046 | refused | core/4 → core/7 |
| brushed 20.463 | 20.46 | −0.003 | −0.003 | refused | core/4 → core/7 |

**Green on the fix:** 8 of 8 (`f2-green.tap`). Each head again (`f2probe-fix.txt`):
- the words give 19.13 and 20.46;
- wd sent 0, ends at 0 with slope 0;
- the second add is laid: "added the piece …";
- the way back writes no wd, and core/4 stays core/4.

**The rows assert:**
1. **The rule:** '19.13' → 0; '19.133' → −0.0016; width '19.1346' with '19.13' → −0.0046; a later change typed '19.13' → 0; and on a width of 19.1, '19.1' → 0.
2. **SPLIT_HEAD's advice,** on both heads, through the shell with memory storage:
   - the head's width really has more than two decimals;
   - refused by name first;
   - the words' number equals his field's;
   - the right width ends at {v 0, m 0};
   - the piece is then laid.
3. **The CHANGELOG's way back,** on both heads, unsplit: the new piece writes no `wd`, and the schema is the one it had, not core/7.

**On "the track goes back to today's schema"** (checked, `f2probe-fix.txt`): after the advice on a split head, the file stays core/7. The 3.5 m step and the piece that brings it back keep a real right width, which is right.
- Today's schema holds where no piece keeps one: the CHANGELOG's way back on an unsplit head, row 3 (core/4 → core/4).
- So the CHANGELOG sentence holds as written: "set the right width back to the width (the piece then writes no `wd`, and the file is core/4, /5 or /6 again)".
- Added beside it: "Typed as the width is shown (two decimals), the right width is the width exactly, also where the width carries more decimals than it shows (typed so, or left by the width brush); any other number is measured from the width in force, to the millimetre."
- `MAP.md`'s panel line names `backToWidth`.

### The tier (checked)

- **Touched rows**, at BelowNormal, no slot (light): **144 of 144**, 0 fail, 0 skipped (`rows-touched.cmd`, `f2-touched.tap`, 09:54:27Z–09:56:00Z). These are the same five files as for F1, plus the 3 new rows.
  - Every other row that calls `extendOptions` is outside the tier. The new code runs only with a right width typed (`if (wR !== null)`, `f === 'widthR'`).
- **The right-width harness**, under heavy-run at BelowNormal (`harness-f2.cmd`, `f2-harness.tap`, `f2-harness-heavyrun.txt`). It asked at 09:56:14Z, got slot 2 at once (P held slot 1), ran 186 s and ended at 09:59:21Z.
  - **37 of 37:** the CONTROL, the crash stand-in and 35 mutants.
  - `harnesscount.js`: **applied 35 / caught 35 / NOT APPLIED 0**, control ok (`f2-harness-count.txt`).
  - New:
    - **R28:** the words give the width with all its decimals.
    - **P6:** the head's rule removed.
    - **P7:** the changes' rule removed.
    - **P8:** the rule also beside a typed width.
- **The piece harness is not run.** Its 64 strings still occur once each (static, `applied.js` → `applied-f2.txt`).
- **No test edits the text I changed.** Checked: `git grep -lF` over `test` and `app/test` for each removed fragment: none.
- **Not run:** the whole suite and every other harness.

### Corrections, mine

- **`f2probe.js` misprinted one field.** Its "first add laid" was first printed from an expression read after the second add. It printed "?" on the fix, and on 8b7cafc a 0 that was right by coincidence (the Extend added one piece and the second add was refused). Corrected in the script, a comment says so, and it was run again on the fix (`f2probe-fix.txt`). The 8b7cafc file keeps the old print.
  - The first refusal at 8b7cafc is shown by the words being given, and by the red row passing its "refused by name first" assert.
- **The F1 section's limit** ("a head at the width but with wd still changing would read equal widths") is not touched here. The "equal widths" O saw are the F2 trap, now closed.

### Names and the machine

- **Privacy grep** over the builder diff's added lines: 0 (checked).
- **Names:** `namecheck258.js` → 65 terms, 1 hit, #31, "road". The roads are synthetic; no save of his was opened.
- **`<temp>\t180-wd-mut-*`** after the harness: 0 (checked).
- **The sculpt-frame timing:** still owed, not started.

**Evidence:** 15 files added (74 → 89, none overwritten): `f2probe.js`, `f2probe-8b7cafc.txt`, `f2probe-fix.txt`, `f2mm.js`, `f2mm-fix.txt`, `applied-f2.txt`, `harness-f2.cmd`, `f2-red.tap`, `f2-red-fails.txt`, `f2-green.tap`, `f2-touched.tap`, `f2-harness.tap`, `f2-harness-heavyrun.txt`, `f2-harness-count.txt`, `f2-commit-stat.txt`.

**Who acts next:** O reads the delta 8b7cafc..de6c069. Landing it is a named landing pane's, after that read.

SOURCES: handback/p-l258-read-right-width-O_2026-11-27.md:154,:182 (1680c3fe); librarian note f46ba2bd; git log/show --stat/rev-parse/ls-remote for d677-right-width-b; f2-red.tap, f2-green.tap, f2-touched.tap, f2-harness.tap through tapfails.js and harnesscount.js; f2probe.js and f2mm.js runs; applied.js; namecheck258.js; heavy-run.js --status
NEXT: librarian call_chair with this hand-back's path when it has read the F2 section, for O's read of d677-right-width-b 8b7cafc..de6c069
