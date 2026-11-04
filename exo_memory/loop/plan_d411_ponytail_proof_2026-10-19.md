# D411: Ponytail proof, a blind replay trial (librarian, 2026-10-19 07:1x)

**The keeper (2026-10-19 07:12):** "before we commit the ponytail, we need to make sure its doing something real and good".

**Why a trial:**
- The builder fork (`consonance/src-tauri/brief/ponytail.md`, D387) has never run. Every live pane's CLAUDE.md is dated 2026-10-14, four days before D387, and the fork reaches a pane only at spawn.
- What is measured so far is Ponytail as a *reviewer*, at n=1 against a control (`plan_ponytail_2026-10-16.md:305-325`).
- The lighthouse commits c70d42a4, b431b2d0, 13b7d3b4 and 37369e08 stay unpushed until this verdict.

**Form:** headless `claude -p` sessions, at the chair's recommendation (13:13Z). They start with no room context, so the control is cleaner than live panes would give.
- One launcher pane runs it from a script.
- Model: claude-opus-5-5 for every arm and for the reviewer.
- Size: 15 sessions (5 laps × 2 arms, plus 5 reviews).
- These are calls on the subscription: count them in sessions and time, not money.

## The arms

- **R:** the brief below, with `ponytail.md` (verbatim, from lighthouse HEAD 37369e08) appended under a heading `## Working rule`.
- **N:** the identical brief, without that section.
- **The arms differ only in that section.**
  - Each arm's exact prompt bytes are saved as `prompt-<lap>-<R|N>.txt`.
  - The hand-back includes `diff prompt-<lap>-N.txt prompt-<lap>-R.txt`, which must show only the added section.
- **Common brief, the same for every lap:**
  - the task text below;
  - "Test first: a red row that fails on the base, then the fix, then the row green";
  - "run the test files you touch, whole";
  - "commit by named paths on this worktree's branch; do not push";
  - "write a short hand-back: what changed, tests run with counts, Not done / Limits".
  - Not included: BOOT, COMMITTEE.md, tonight's notes, or the landed answer.
- **Isolation:**
  - Each arm runs in its own fresh git worktree at the lap's base commit, with `--add-dir` limited to that worktree.
  - Every headless browser gets `--headless` and `--mute-audio`.
  - Heavy test runs go through heavy-run.js, one at a time.
- **Each arm is one session, one shot:** no follow-up prompts and no retries. A session that errors is recorded as an error and not re-run, unless the error is the launcher's own fault (say which).

## The five laps (task text is given to both arms verbatim; the hidden check is never given to anyone but the reviewer's scoring key, which I hold)

**L1. Random's click** (t180, base `d582c9e`)
- **Task:** "In Settings ▸ Theme, the first choice, Random (stored as 'music'), is the default. A click on Random while it is already the chosen theme does nothing: no new look is picked. Make every click on Random pick another look, with its melody following, and keep the stored value 'music'."
- **Hidden check:** on a fresh install nothing is saved, so `settings.set` notifies. Does the diff then pick twice? The landed 02cfe38 did; 91908ab fixed it.
- **Reference:** 02cfe38 + 91908ab.

**L2. The memo key** (t180, base `ce65aa0`)
- **Task:** "src/core/turnby.js keeps memoised answers (extendCorner's, and solve's start). On one document, `extendCorner(doc, { length: 400, targets: { kh: null } })` is accepted; the same call with `kh: NaN` then returns the kept answer, where a fresh document refuses it with BAD_TARGET. Also, a document frozen at the top only, whose pieces array is then edited in place, gets its old answer back. Fix both."
- **Hidden check:** solve's start memo is reachable alone, through `extendTurnBy` (`w: null`, then `w: NaN`). Is it fixed and tested?
- **Reference:** e4b38ee.

**L3. The edge clamp** (t180, base `6e2050d`)
- **Task:** "In src/core/extend.js the edge clamp bounds each side to [max(lo, floor), cap]. With a numeric transition shorter than the piece, a side brought from −45.5° back to 0 rings above 0 (a control at +8.277°) and ends at +0.670° with slope 0.585, so the next piece is not plain and a lap is refused at the seam. A side asked back to 0 must land at exactly 0, from below as it does from above."
- **Hidden check:** does the fix keep the rising-floor case? Take a cup of 15.5, then e/er −45 with a `{ e: 40, er: 40 }` transition over 100 m, then `targets: { c: 0 }` with `{ c: 60 }` over 100 m and no edge target. Every total must stay ≥ −30 and end at −30. c1ddce4 lost this case (BAD_EDGE −37.25°); 511609d restored it.
- **Reference:** c1ddce4 + 511609d.

**L4. Sound samples** (t180, base `cbd7a40`)
- **Task:** "app/sound.js loadSamples fetches all 10 sample files at launch but plays only one melody. A 404 on any file of a melody that was not picked throws out every sample, and the tick, the loop close and the picked melody all fall back to the synth. A missing file of an unpicked melody must cost nothing. If an existing test row pins the old behaviour on purpose, you may amend it by name, with a comment saying why."
- **Hidden check:** is `useSamples`' required set changed to match the fetched list? Is a rewritten row amended by name, rather than deleted?
- **Reference:** 40404ff.

**L5. The suite timeout** (lighthouse, base `13b7d3b4`)
- **Task:** "consonance/tools/js-suite.js kills a test file after 120,000 ms. gen-consumer.test.js takes 123 to 157 s alone, so it crashes every full run. Make the full suite stop crashing on it without hiding a real hang."
- **Hidden check:** does a genuine hang still get killed and reported? Is the limit still overridable by env?
- **Reference:** 37369e08 (6 lines).
- **Leak guard:** at 13b7d3b4 the lighthouse tree carries `exo_memory/`, including my 2026-10-18 13:21 note, which names the fix. So L5's arms get a `git archive 13b7d3b4 consonance` extract with its own fresh `git init` and a base commit, not a worktree. The hand-back shows `grep -rl "300000\|D390" <extract>` → only the code's own lines.

## Measured, per lap and arm (the launcher's table)

- diff: files changed, lines added and removed;
- test files and rows added; rows deleted; rows rewritten. Each rewrite is quoted with its reason;
- red on base, then green: shown or not, with the command;
- the named test files run whole: counts;
- mutation harnesses that anchor the touched files, run whole: applied / caught / NOT APPLIED;
- session wall time; the session's exit; tokens if the CLI reports them (no cost field).

## The blind review (5 sessions, one per lap)

- **What the reviewer gets:** the task text, the base commit, and the two diffs labelled X and Y. A coin per lap (`crypto.randomInt(2)`) assigns X and Y, and the key is written to `key.json`.
  - The launcher does not read `key.json` before every review is in. I read it.
  - The reviewer also gets the two hand-backs with any arm-revealing text removed: the "Working rule" heading, and any sentence quoting it. The launcher lists every removal.
- **Reviewer prompt:**
  - "For each diff: is it correct; what edge cases does it miss (name them, with a probe if you can run one); did it cut or weaken a test; how much would you have to change to land it. Then: which would you land, X, Y, or neither, and why in two lines."
  - It can read and run the code in its own worktree. It cannot see the other arm's worktree path name.
- The hidden checks are NOT in the reviewer's prompt. I score them myself from the diffs and the reviewer's findings.

## Registration (before any session runs)

- **Prediction:**
  - across the 5 laps, R's median changed-line count is at least 20% below N's;
  - 0 test rows deleted or weakened in R;
  - the blind reviewer would land R's diff, or rates the two equal, on at least 3 of 5.
- **Degenerating** (the fork is not doing something real and good), if any of:
  - any test row deleted or weakened in R that N kept;
  - R rated worse on 2 or more of 5;
  - R misses a hidden check that N catches, on 2 or more laps.
- **Null:** neither of the above (smaller or equal, but no clear win). Reported as "no measurable effect"; the keeper decides.
- **Limits stated now:**
  - n = 1 per arm per lap;
  - one model;
  - the tasks are already-solved bugs, written with hindsight;
  - L5 is in a different repo.
- **On the verdict:**
  - Progressive: push the four held commits; respawn the building panes under the fork; D387's own 5-lap registration then starts.
  - Degenerating: the keeper chooses to revert the fork or keep Ponytail reviewer-only.
  - Null: the keeper's call, with the table.

## The launcher packet

- **Pane:** B after D410, or C after D409, whichever is free first.
- **The script:** in `exo_memory/handback/p-d411-<pane>_2026-10-19_evidence/`: `run.js`, `prompts/`, `out/`, `key.json`.
- **Order:**
  1. Write all 10 builder prompts and show the 5 prompt diffs.
  2. Run the 10 builder sessions, at most 2 at a time. Builder test runs take the lock.
  3. Build the 5 review prompts.
  4. Run the 5 reviews.
  5. Hand back the table and every file.
- **Not to do:**
  - no edits to the real branches;
  - no merges;
  - no push;
  - no reading `key.json` until the reviews are in;
  - don't rerun an arm because its result looks bad.
- **Hand-back:** `exo_memory/handback/p-d411-ponytail-proof-<pane>_2026-10-19.md`, then `call_librarian`.
- **Then:** I unblind, score the hidden checks, and give the keeper the verdict in plain words.

NEXT: chair route this packet to the first free of B (after D410) or C (after D409); the launcher hands back to the librarian when all 15 sessions are in.
