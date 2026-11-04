# Plan: is Ponytail any good here? One pane, first a test on landed work, then maybe the role (librarian, 2026-10-16 10:5x)

Source: the Third Place's plan, `C:\Users\nname\Downloads\for-the-librarian\ponytail-promotion_2026-10-16.md` (read in full).
- **The tool:** github.com/DietrichGebert/ponytail, MIT, pinned at `6f1c2bfff0c837d268929a7c4e490918eb4fab29`.
- **The keeper:** "what pane would be ideal to test the ponytail", and "but we neeed to make sure it is even good lol".
So this lap tests whether it's good BEFORE anyone is promoted. Runs in parallel with the T-180 build; it touches no branch that is landing.

## Pane: E

- E is free: D334 and its one-line fix are done.
- E wrote the least of the diffs under review (A, B and C wrote D335–D341). A reviewer judging its own code measures nothing.
- E did the earshot install and its source read on 10-15, the precedent for step 0.

## Parts (all E)

0. **Read before install.** At the pinned commit, read every file that runs: the Claude plugin manifest and its hooks, and the plugin
   scripts (`.opencode/plugins/*.mjs`, `*.cjs`).
   - Quote anything that touches the network, the file system outside the project, or settings.
   - Install only into E's own worktree's `.claude/` (project scope), never user-wide. If anything reads as unsafe, stop and say so.
1. **The retro test (is it good?).** Run `ponytail-review` on landed diffs whose outcomes the record already knows:
   - d335-a 85f79cd;
   - d336-c 6fd2537 + 8fbab15 (the N13 row);
   - d337-b ecb7a62;
   - d340-c e398be1 + e66e827;
   - d341-a ab0f1d1.
   For EVERY suggested cut or reuse, apply it alone in a throwaway worktree, then run:
   - that diff's own targeted tests;
   - its mutant scripts (named in each hand-back);
   - for anything touching core maths, its mutation file.
   Score each finding:
   - **real:** suite green, every mutant still caught, and fewer lines;
   - **harmful:** a test goes red, a mutant survives, or it removes validation, error handling or a test;
   - **wrong or echo:** it doesn't apply, it changes nothing, or it restates the diff.
   Also count the lines a real finding saves.
   - **The known trap, on purpose:** the record shows the N13 row and D336's safety net each caught a real fault today. A Ponytail cut
     that would delete either is harmful by this test.
2. **One full suite at most,** under the heavy-run lock, and only if E wants to confirm a combined set of real cuts. Targeted runs are enough
   otherwise. Never apply anything to a landing branch.
3. **Hand-back:** the table (diff, finding, verdict, lines, the command), the totals, and E's own read of where it helped and where it
   would have hurt.

## Registered before the run (librarian)

- **Prediction:** across the five diffs, at least 30% of Ponytail's findings score real, and none scores harmful.
- **Good enough to promote a pane if:** ≥30% real, 0 harmful, and at least one real finding is something no seat caught in the read.
- **Degenerating if:**
  - any finding is harmful;
  - more than half are wrong or echo;
  - its two-line ending is used in place of evidence.
- **Stop rule:** one harmful finding that would have removed a test or check that caught a real fault today (N13, the D336 net, the D337
  rows) ends the promotion question with a no.
- If it passes, the live phase (the Third Place's plan, "a role, not a rewrite") gets its N and X from this run's numbers, set before it starts.

## Rulings on the Third Place's tensions (to carry in the brief)

- **Comments:** the codebase's density wins, per CLAUDE.md and Ponytail's own "keep the conventions".
- **Reports:** a Ponytail finding carries its command and numbers like any hand-back; it means less code, not less proof.
- **Changelog:** keep what and why.
- **One pane, never all** (the monotone risk the Third Place names).

OUTPUT → NEXT: changed — a new parallel lap for E: test Ponytail on landed diffs before any promotion.

## D342 step 0 read, and the ruling: option A (librarian, 2026-10-16 11:0x)

Read C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-ponytail-E_2026-10-16.md. E's stop was right, by the plan's own rule.
- The plugin's hooks write into the live `~/.claude` at any scope: a flag file, a copied `.ps1`, and a marker (activate.js:4-6, :120-133).
- It reads settings.json and injects hidden text telling the model to offer a settings change (activate.js:76-79, :146-152).
- It keeps a per-turn ledger in `~/.config/ponytail/band`, on by default.
- Not hostile (E: documented, webhook off and https-only), but against the room's rules.
**Ruled: option A.** No install. Each of the five diffs gets a fresh subagent briefed with `skills/ponytail-review/SKILL.md` verbatim, from
`G:\Consonance-tools\ponytail-src` at 6f1c2bff, plus the diff's sha and worktree. Then step 1 exactly as planned, against the same registration.
- The plugin itself is a no in this room while the settings nudge is in it. The keeper can overrule.
- This tests the review skill's text, not the plugin's always-on rule. Say so in the result.
OUTPUT → NEXT: changed — option A, so E starts the five-diff retro test now.

## The keeper: "well cant we modify it" (librarian, 2026-10-16 11:1x)

Yes, it's MIT. **Ruled, for after the retro test, and only if it passes:**
- E makes a stripped copy at `G:\Consonance-tools\ponytail-room\`, pinned at 6f1c2bff, keeping the licence and a NOTICE of what was removed.
- Kept: the rule text (`.agents/rules/ponytail.md`) and the skills (`ponytail`, `ponytail-review`, `-audit`, `-debt`).
- Removed: every hook (activate, mode-tracker, subagent, map), the statusline script, the band ledger, the webhook, and the settings nudge.
- It is loaded for the one promoted pane only:
  - the rule text in that pane's own instance instructions;
  - the skills as a project skill folder in its worktree, never committed to a repo.
- **Test:** a grep of the stripped copy for fs writes, fetch, child_process, homedir and settings → nothing that runs. A session in it leaves
  `~/.claude` unchanged (hash the folder's file list before and after).
- During the retro, E may add a sixth arm if cheap: the always-on rule text in the subagent's brief beside the review skill, so the "mode"
  is tested too.
OUTPUT → NEXT: unchanged — the retro runs first; the stripped copy is built only if Ponytail passes it.

## D342 retro read, and the ruling (librarian, 2026-10-16 15:2x)

Read C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-ponytail-E_2026-10-16.md §6–§11.
- **Arm 1 (registered):** 17 findings: 15 real (88%), 1 harmful, 1 echo.
  - Harmful is 335-4: deleting the hold code removes 7 test rows, 211/218.
  - The stop rule did not fire: no cut touched N13, the D336 net or the D337 rows.
  - Five bugs that no seat caught, each red first: the Sculpt ratio after an undo, a header click dropping keys, Left Ctrl after the net,
    a 25 s key's cause, and the log wiped on a failed read.
- **Arm 6 (the always-on rule):** 19 findings: 17 real, the SAME harmful cut, 1 echo. It also found a held load across the seam is missed (red first).
**Ruling: the registered answer is NO, and it stands.**
- E offers one way out (§9): rule that deleting tests of unreachable code is not "removing a test". I decline.
  - The registration said "removes validation, error handling or a test", and 335-4 removes seven.
  - Re-reading the clause after the score is in is the abuse condition this room registers against (BOOT, Lakatos).
  - The prediction is refuted, and the record says so.
- **What the run did show, kept as a finding, not a pass:**
  - The review skill is a strong bug-finder here: 5 of 5 bugs real, none caught by any seat.
  - Its one failure mode is one shape, twice: cutting code found unreachable along with the tests that pin it.
**Next, two parts:**
1. **Land the real defects** (E, one branch off 7abf52e, each fix with its red-first test):
   - 335-1, 336-1, 336-2, 340-1;
   - the stricter log fix A6-340-2 (refuse, don't rewrite lossily);
   - A6-341-1 (the seam);
   - 337-1 (the words);
   - 337-2's FINISH_NEAR test;
   - 335-2 (Ctrl snapping at full weight; the keeper's hands decide).
   No lean cuts and no refactors in this lap (smallest change). The full suite at landing.
2. **A NEW registration, if the keeper wants the role:** Ponytail-review as a reviewer only, with a standing rule that no finding that
   deletes or rewrites a test lands. Register it before any live run:
   - prediction: over the next 5 landed laps it reviews, it finds ≥1 real defect that no seat caught in 3 of 5, and 0 of its accepted
     findings is later traced to a regression;
   - degenerating if 3 of 5 come back with no real defect, or any accepted finding causes one.
   This is a new prediction stated in advance, not the old one rescued. Until he says, the stripped copy is not built.
- E removes its ten throwaway worktrees (its own scratch, clean, no branches) once part 1's branch is made.
OUTPUT → NEXT: changed — the registered answer is no; E lands the five-plus real bugs, and a reviewer-only trial is offered to the keeper.

## D342 part 2 read: the real defects are on d342-e (librarian, 2026-10-16 16:0x)

Read the hand-back §12 (:204-277). d342-e at de7b5cb, ten commits off 7abf52e. Accepted:
- **Fixes, each red first, then green:**
  - 335-1 (the Sculpt ratio per piece);
  - 336-1 (header controls keep held keys);
  - 336-2 (Left Ctrl after the net);
  - 340-1 (a 25 s key is host late);
  - A6-340-2 (refuse, never rewrite an unreadable log: cargo 36/1 → 37/0);
  - A6-341-1 (a held load across the seam).
- **Other commits:**
  - 337-2's FINISH_NEAR test: its proof is a mutant that was uncaught before and is caught now.
  - 335-2 (Ctrl at full weight): no test; a px-per-snap table is given for his hands; it reverts alone as d07ae6d.
  - 337-1 was already fixed by D339; arm 6's one-line header note landed instead, as E says.
- Every displaced mutant was re-made and caught. No existing test deleted or rewritten (3 lines of the fake host extended). The scan → 0.
- The ten throwaway worktrees are removed (clean, no --force).
- **For the chair:** D344 changed no code, so the next build is d342-e + B's D343 + C's D345.
  - C's D345 also touches handles.js and sound.js; d342-e touches handles.js (335-2). Merge with care, and run the full suite at landing.
OUTPUT → NEXT: unchanged — d342-e joins the next build with D343 and D345.

## The keeper: "what do u suggest" → the reviewer-only trial starts (librarian, 2026-10-16 18:3x)

I recommended yes; he asked for my suggestion, so this is ruled, open to his veto.
- **Pane E builds the stripped copy** at `G:\Consonance-tools\ponytail-room\`, per the 11:1x section above: rule text and skills only; every hook, the statusline, the band ledger, the webhook and the settings nudge removed; LICENSE kept, NOTICE listing removals.
  - Test: grep for fs writes, fetch, child_process, homedir, settings → nothing that runs; hash `~/.claude`'s file list before and after one session → unchanged.
- **The trial (registered 15:2x, unchanged):** ponytail-review reviews the next 5 landed laps, starting with D343.
  - Standing rule: no finding that deletes or rewrites a test lands.
  - Prediction: ≥1 real defect no seat caught in 3 of 5; 0 accepted findings later traced to a regression.
  - Degenerating: 3 of 5 with no real defect, or any accepted finding causes a regression.
- Its findings go to the librarian like any hand-back (command and numbers), and fixes are dispatched to a building pane, not applied by the reviewer.
OUTPUT → NEXT: changed — the trial starts: E builds the stripped copy, then reviews D343 when it lands.

## D346 part 1 read: the stripped copy is safe (librarian, 2026-10-16 20:1x)

Read the hand-back §13 (:279-329). Accepted.
- **The copy:** G:\Consonance-tools\ponytail-room. LICENSE, the rule and the four SKILL.md files are cmp-identical to 6f1c2bff; NOTICE lists the 205 files removed.
- **Test 1:** the grep matches prose only, and there are no scripts.
- **Test 2: my spec was wrong.** "~/.claude unchanged" can't hold for any session, because Claude Code writes its own session files and the other seats write at the same time. E measured against a control instead: 0 Ponytail paths and settings.json unchanged. That's the right test, and it's recorded as my correction.
- **Next:** the reviewer worktree t180-wt-e4 has the skills untracked. When D343 lands, E reviews the landed diff, reviewer-only, under the registration at 15:2x.
OUTPUT → NEXT: unchanged — the review waits for D343 to land.

## D346 review 1 of 5 read (D343): it counts, and the fixes go to B as D350 (librarian, 2026-10-16 21:5x)

Read C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-d346-review1-E_2026-10-16.md in full.
- **Score:** 3 findings, 3 real.
  - **Finding 1 is a real defect no seat caught, me included** (my D343 read said "the pick is unchanged" and took B's 21 s): the app's worker hands Close a structuredClone, which isn't frozen, so the residual memo never fires. Measured: 24.5 s against 18 s.
  - **Finding 2 is a guard gap** no seat caught: the panel-side filter, 4 mutants, 0 caught.
  - Finding 3 is lean.
  - **Review 1 counts toward "3 of 5".** 0 test deletions.
- **The standing rule worked:** two edits as given would rewrite existing rows, and E turned them into new rows.
- **The tool's limit, seen again:** its shallow freeze recovered only 2.5 of the 6.5 s. The measurement found that a deep freeze is needed. Findings are leads; the numbers decide.
- **Dispatched as D350 to pane B** (it wrote D343), off the feature tip after d349-c lands (closejob/close don't overlap sound.js, so off 72c3446 is fine too):
  1. Deep-freeze the document at the worker job's entry (`closejob.js`'s own `deepFreeze`). First check that nothing downstream writes to it: a frozen write throws in strict mode. A NEW row: a press on a structuredClone of the save gives the same pick and hash, and shows residual hit (red first).
  2. A NEW row in `validate-ui-worker.test.js` for the `onAnswer` filter, with E's four mutants each shown red on it.
  3. Remove the unread `CHECK.fullSpeed` (0 lines, a misleading constant).
  - No existing row rewritten. Targeted runs and close mutants under the lock; the chair runs the suite at landing.
  - **Accepted findings are tracked against the trial's regression clause from here on.**
OUTPUT → NEXT: changed — B fixes the two real findings as D350; E reviews the next landed lap (D349).

## D350 B read: the review's fixes (librarian, 2026-10-16 22:4x)

Read C:\Users\nname\Downloads\t180-wt-b7\HANDBACK_B.md in full. d350-b: 7a17e85 + ebd6ee4 off 72c3446. Accepted.
- **Finding 1, fixed:** a deep freeze at runClose's entry.
  - The strict-mode and no-write checks came first.
  - Clone 27.0 s before, 17.7 s after (main-thread CPU, same run as parsed), with the same closed hash 8283d1a4….
  - A missed write fails loudly (the job fails, and the page closes instead), not wrongly.
- **Finding 2:** new row 5. E's 4 mutants: 0 caught before the row, 4 after.
- **Finding 3:** CHECK.fullSpeed removed.
- **Tests:** no row rewritten. Targeted 140/140; close mutants 43/43 (F5 new).
- **For the trial:** these are its first accepted findings. Watch them for regressions over reviews 2–5.
- **checked:** the branch tip is 218c661 (Land D349). The installed exe is from 20:45, there's no `.before-d349`, and the builder isn't running. So D349 landed but isn't installed.
  - **Ruling:** land d350-b onto 218c661, run one full suite, then install D349 + D350 together as `.before-d349` (the backup is of the 20:45 exe), and compare the hashes.
OUTPUT → NEXT: changed — one install now carries both the Serum sounds and the Close fixes.

## Review 2 of 5 read, on D349 (librarian, 2026-10-17 01:0x)

Read `exo_memory/handback/p-d346-review2-E_2026-10-17.md` whole (63 lines). Accepted.
- **One finding, a lean one, and no defect.** `get voice()` at `sound.js:269` and the export of `rateOf` at `:337` have no reader. With both cut, 73/73 pass, and no test is touched.
- **The score:** review 2 does **not** count toward "3 of 5". The tally is 1 of 2 counted. This is the first lap with no real defect; the degenerating line is crossed at 3.
- 0 harmful. The one echo (the 4 ms fade, 1 seed in 12) was flagged by the reviewer itself as not a finding, and it matches C's recorded limit.
- **The regression clause** (D350's accepted findings): checked, the chair's `t180_d350_suite.log` at 00:58 reads 2,970 tests, 2,950 pass, 0 fail, 13 skipped, 7 todo. Its TAP copy `t180_d350_suite.tap` has 0 `exitCode:` lines. Nothing traces to the fixes.
- **The install:** checked. The exe is from 00:58 (12,015,104 B), and its sha256 `4fc1beb5385fdaf5442c…` equals target/release. The `.before-d349` backup is the 20:45 exe (10,413,568 B). D349 + D350 are installed.
- **Finding 1, ruling:** take it, folded into the next lap that touches `sound.js`. That's D348's Settings work, which reaches the mute/volume wiring. It doesn't get a lap of its own.

OUTPUT → NEXT: unchanged — E reviews the next landed lap (D352) as review 3.

## Review 3 of 5 read, on D352 (librarian, 2026-10-17 03:0x)

Read `exo_memory/handback/p-d346-review3-E_2026-10-17.md` whole (73 lines). Accepted.

**The counting question, ruled: yes, it counts.**
- D352's whole purpose was the message, and its commit says "never NOT CAUGHT". A crash after an unrelated failing row still reads NOT CAUGHT, and E reproduced that in 9 of 9 real children.
- A false NOT CAUGHT sends a reader toward the test, which is the exact harm D352 set out to remove. So it's a real defect in the code under review, and no seat caught it (C, me and the chair all read past it).
- **Review 3 counts. The tally is 2 of 3** (reviews 1 and 3 count, review 2 doesn't).
- **Recorded beside the count, so it isn't flattered:** the reviewer's mechanism was partly wrong (the TAP holds no file-level entry at all in that timing) and its fix wouldn't work. E's measurement found the working detector. This is the second time a Ponytail fix has needed the pane's measurement to be right (review 1's shallow freeze was the first).
- Harmful 0, echo 0.

**Finding 1 goes to D353, pane C** (the author), in E's §1 form, not the reviewer's:
- In the six ✖-shape harnesses, when the named test (`caughtBy`) reports in neither a ✔ nor a ✖ line, fail with "the named test never reported: the mutant was NOT TESTED", and name any crash `crashes()` found.
- A NEW row in each, beside the stand-in, puts a crash after a failing row. It's red first (it reads NOT CAUGHT today).
- No existing assertion changes. The six fail-count harnesses are untouched.
- **Check what E inferred and didn't run:** a load-time throw must keep reading as it does today. Run one load-throw mutant and show its message before and after.
- **Folded in (the geom ruling):** a passing geom row prints any `attempts[].crashed` from earlier tries, so each machine crash is counted and said, as the landing rule wants. It's a print only, with no verdict change.
- The chair lands D353 with the full suite plus TAP, and E reviews it as review 4.

OUTPUT → NEXT: changed — D353 is a fix lap for C before review 4.

## D353 C read (librarian, 2026-10-17 04:2x)

Read `exo_memory/handback/p-d353-C_2026-10-17.md` whole (68 lines). Accepted.
- **Red first:** 6/6 read NOT CAUGHT on 0f12e6d's logic and are green 6/6 after. texmaker, core-close and mutation each give "the named test never reported: the mutant was NOT TESTED" through the real `runMutant`.
- **C caught an error of E's:** under the bare check, a load throw *would* turn into NOT TESTED. So a non-native file exit (exit 1, a file-level TAP entry) is exempt.
  - The load throw's message is shown unchanged before and after (only the temp dir name and timing differ).
  - That's a correction across seats, recorded, not a WRONG of mine to fill in.
- **The checks:**
  - whole files 8/8, 335 tests, 0 fail, 0 `exitCode:`;
  - the passing row names diffed against D352: only the new rows are added;
  - D353's own mutants: applied 7, caught 6.
- **The one gap, ruled:** M2 (core-close's load-throw exemption removed) isn't caught by any permanent row.
  - inferred from C's own figure: the one-off run took about 72 ms of test time, so a permanent row is cheap.
  - **Ruling: add one load-throw row per ✖ harness**, red on M2-style mutants, with no existing assertion changed. It folds into whatever review 4 returns, or becomes its own small lap if review 4 is empty. That's a gap with no guard, not a defect.
- **Next:** the chair lands d353-c with the full suite plus TAP. Then E reviews D353 as review 4. Tests only, so there's no install.

OUTPUT → NEXT: unchanged — land, then review 4.

## Review 4 of 5 read, on D353 (librarian, 2026-10-17 05:0x)

Read `exo_memory/handback/p-d346-review4-E_2026-10-17.md` whole (76 lines). Accepted.

**The counting question, ruled: it counts, and the prediction is met by its letter. The tally is 3 of 4.**
- Both findings are real defects that no seat caught, under review 3's ruling. E reproduced both on real children:
  - F1, the run-wide load-throw exemption: 6/6, with both controls 6/6;
  - F2, the substring twin: 6/6, with a real row it can reach (C12 `extendOptions`).
- Harmful 0, echo 0. The regression clause is still clean (nothing traced to an accepted finding). Watch it through review 5.

**Recorded beside the count, because the letter flatters it:**
1. **The object changed at review 4.** E's brief added "check runner claims on a real child", so from here the trial measures Ponytail *plus a pane's brief*.
2. **The defects are shrinking and feeding on the trial itself.**
   - Review 1 found a real speed loss in the app.
   - Reviews 3 and 4 found message-only faults on rows that were already red, in detector code that exists only because of this trial's own finding. Review 4's are rare double events, one of them built by hand.
   - Reviewing our own fixes of its findings is a loop that can always find one more edge.
3. So the prediction is met, and **the useful question for the keeper isn't "does it find things"** (it does) **but "is it worth it on product laps."** Only review 1 answers that.

**Review 5 goes on the next landed *product* lap, not on D354.** That breaks the self-feeding loop and asks the question that matters. D348's Settings and UI work is the natural one, and it waits on his picks, so review 5 waits with it.

**D354, pane C, off 447800b (one fix lap):**
- **M2:** one load-throw row per ✖ harness (ruled at D353).
- **F1, the narrow form:** exempt a load throw only when the run had one file. Otherwise read NOT TESTED and name the load-throwing files. Red first: a NEW row with F1's two-file shape.
  - **The trade, ruled: accepted.** An uncaught multi-file all-throw mutant now reads NOT TESTED instead of NOT CAUGHT. That's truer, because the named test never ran, and no caught mutant's reading changes.
- **F2:** a comment only, at `inner_run.js:69`. The five `caughtBy` strings stay as they are; renaming them rewrites rows, which the standing rule stops. It's too rare to put to the keeper.
- No existing assertion changes. The chair lands it with the full suite plus TAP. No Ponytail review on D354.

OUTPUT → NEXT: changed — D354 to C; review 5 moves to the next product lap.

## D354 C read (librarian, 2026-10-17 06:0x)

Read `exo_memory/handback/p-d354-C_2026-10-17.md` whole (65 lines). Accepted.
- **F1:** the exemption holds only in a one-file run. It lives in core-close, core-xsec, lookmatch and texmaker; core-mutation and mutation never exempt (the trade I ruled, pinned by two rows). F1's shape in the real harness read NOT CAUGHT on D353 and passes now.
- **M2:** one load-throw row per ✖ harness. N1–N4 (M2 in each one-file harness) are caught; at D353 it survived.
- **F2:** a comment only. No `caughtBy` changed.
- **The checks:**
  - lap mutants 9/9;
  - whole files 7/7 = 305 tests, 0 fail, 0 `exitCode:`;
  - the same 268 mutant rows are caught as at D352/D353;
  - no existing assertion changed.
- **C's correction:** a load throw can end with exit 7, not only 1, so the message now prints each file's code. C's probe also shows a passing file that sets `process.exitCode` leaves the same entry. It's the same set D353 already read, recorded.
- **Next:** the chair lands d354-c with the full suite plus TAP. Tests only, so there's no install and no Ponytail review (ruled at review 4). This closes the crash-message line: D351 → D354.

OUTPUT → NEXT: unchanged — land.

## Review 5 gains a control arm (librarian, 2026-10-17 06:1x, at the keeper's "would you say ponytail works better than the pane before it")

- **What's open:** reviews 1–4 show Ponytail caught what the building pane and the librarian missed. They don't show it beats a *plain* fresh reviewer, because no control arm was run (E said so at review 2).
- **The ruling:** on the review 5 diff (the next product lap), E runs two fresh reviewers blind to each other:
  - (a) Ponytail's two files, as before;
  - (b) the same brief with no Ponytail files.
  - Score both with the same table.
- **Registered before the run:** Ponytail earns its place if (a) finds a real defect that (b) misses, or (b) produces more wrong or echo findings. It's no better than a fresh pair of eyes if (a) and (b) find the same things.

## Review 5 of 5 read, with the control arm; the trial closes (librarian, 2026-10-17 08:0x)

Read `exo_memory/handback/p-d346-review5-E_2026-10-17.md` whole (63 lines). Accepted.
- **The arms:**
  - arm (a), Ponytail: 6 findings (5 real, 1 lean marked out of bounds by itself), 0 wrong, 0 echo, 0 harmful;
  - arm (b), plain: 3 real findings and 1 echo;
  - both found rows 1, 2 and 5, the saved-setting drift (the most severe);
  - **only (a) found rows 3 and 4:** the first-run guide points at moved controls, and a part that fails to load is silent, with a false placeholder;
  - E confirmed both by reading the code.
- **Against the control registration:** (a) found a real defect that (b) missed, and (b) had the one echo. **Ponytail earns its place by the registration as written.**
- **Against the main registration:** reviews 1, 3, 4 and 5 count. **4 of 5, so the prediction is met.** The regression clause is clean: no accepted finding traced to a regression across D350, D353, D354 and D355.

**The verdict, with what limits it:**
- n = 1 per arm. Run-to-run variance between two plain reviewers isn't measured.
- Its two fixes in reviews 1 and 3 needed a pane's measurement to be right.
- From review 4 on, the brief carried a "check it by running" line.

**So the ruling (mine, in the line of work, the keeper's to veto):** Ponytail stays as **reviewer-only on every landed product lap**.
- **The standing rule:** no finding that rewrites a test lands.
- **New:** a finding's *fix* is measured by the building pane before it lands, never taken as written.
- It doesn't get edit rights or the always-on install. That question isn't reopened; the earlier NO stands for that form.

**Rows 1–5 go to D356** (`plan_t180_handoff_2026-10-15.md`).
