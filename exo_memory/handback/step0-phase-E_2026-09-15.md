# D064 STEP 0 · ECHO — the phase instrument, and the scorer diff for review

**Pane E, machine D, 2026-09-15 12:39–13:10.** The rules:
- the draft `loop/anchor_similarity_registration_DRAFT_2026-09-15.md` §8.8.1 R8e (57a299b)
- §8.9 STEP 0 (87b799a)
- §8.10 pins V1/V2 (5ff17be)

§8.10.1 (09c3a54, the claim grain from A's feasibility label) landed during this lap. It does not touch R8e and
changes nothing here.

**Stake, once:** I wrote `p-leave-E` and `p-harness-E`; both are texts this instrument scores. **Nothing committed.
The app was not rebuilt.** R8e could be built as written; one edge is named below (§1), not stopped on.

    dev/diversity/phase-window.js        sha256 ba98d63523530e60dc73ae7872104af8bb404d8cc24e459d9ade1913bbdc2cb5   3,145 B
    dev/diversity/phase-window.test.js   sha256 2950fbd4022fd5e8b2c76d8c40022bce3393a51df362ecf7e38f5262a1a6782d   6,201 B

## 0 · RESULT

| Check | Result |
|---|---|
| Tests | **13 passed · 0 failed**; red first against a one-window stub: 10 failed · 3 passed |
| Mutants, on a copy | **15 applied · 15 caught · 0 NOT APPLIED · 0 survived**; controls behaved; tracked files untouched |
| **THE BAR:** E's §5.2 table (A / B-read / E at six phases) | **18 of 18 cells reproduce to 4 dp** |
| **THE BAR:** the librarian's six-phase means (a326b5d) | **U_A 0.7328 · U_B-read 0.6866 · U_E 0.6497, all to 4 dp** |
| The prior art (`phase.mjs`) | its 18 cells reproduce too, and the module's cuts equal its loop at every length 1–12,000 × every phase (72,000 cases, 0 differ) |
| C's run 2 inside the diff's output | **641 of 641 fields unchanged**; 626 U fields added |
| Network | `NETWORK_ATTEMPTS=0` on every model run |
| `node consonance/tools/js-suite.js` | 93 green · 6 failed · 1 canary of 100. `dev\diversity\phase-window.test.js` ok. The six failures are the same six C recorded before these files existed; none names dev/diversity |

**The scorer diff, for the librarian to review before anyone uses it** (my scratchpad, not the repo):

    C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-07b8a48f\a2122153-a37e-41a6-a86f-534267ec0565\scratchpad\c1read\c1\
      score.mjs          sha256 ecf03768c7a3b7c5413d3bbc97048f7ef24e83489cf62141500271fbf733eafb   C's run 2, the base (hash-checked against C's copy)
      score-step0.mjs    sha256 19c97ab513f722d3b1d5084740d4ddea9206451046fd8ed15e02889743199e2a
      score-step0.diff   sha256 ecacc774205761eea89b92181e5128e7cbac7e7c401b3f54f54530514f5a1a4a   `diff -u score.mjs score-step0.mjs`, 139 lines
      results-step0.json sha256 60c7d726cf746cfb14cfa85bc71edbf6cd1911940f7317bbd617a028b212b1d0   its run, 12:44:14 → 13:00:13, exit 0

## 1 · WHAT phase-window.js IS

One file, CommonJS, in the S40 precedent. It exports:

    PHASES          Object.freeze([0, 300, 600, 900, 1200, 1500])
    WINDOW          1800
    windowBounds(length, phase)          -> [[start, end), …]
    phaseWindows(ids, phase, {cls, sep}) -> [{ ids: [cls, …body, sep], tokens: body.length }, …]

- **PHASE > 0:** a head window of min(PHASE, length) ids, then consecutive 1,800-id windows, the last taking the
  remainder.
- **PHASE 0:** no head window: consecutive 1,800-id windows from the first id, which is §8.2 and C's `score.mjs:46-48`.
- **A phase at or past the length:** the head is the whole text, so one window.
- **`tokens` excludes CLS and SEP**, which is R3's weight.
- **Refused, loudly:**
  - a phase that is not a non-negative integer;
  - a missing CLS or SEP id (no default guessed);
  - **an empty text.**

**The one edge, named and not built around.** At zero ids R8e's clauses disagree:
- "PHASE 0 is §8.2 exactly" cuts NO window;
- "a phase at or past a text's length gives one window" cuts one window holding no ids.

C's scorer voids an empty stripped text before it windows (`score.mjs:76`), so the case never reaches the scorer. The
file refuses it rather than choosing a clause. If the chair wants either reading, it is one line and one test.

**Where each phase lives:** the same phase on both sides of a pair, and the mean over six phases, are the scorer's,
not this file's (§3).

## 2 · RED FIRST, AND THE MUTANTS

**Red** (`scratchpad/step0/red.txt`). The test ran against a stub returning one window of every text (sha256
`cbe2e6e9…c5db`): **10 failed, 3 passed.** The three that passed are guards the stub meets by accident: a short text,
a phase past the length, and a phase exactly at the length, each one window.

**The tests** (`node dev/diversity/phase-window.test.js`, 13):
- the phase set frozen and exact, with the 1,800 window;
- **PHASE 0 = C's frozen windowing, window for window.** C's loop is restated from `score.mjs:46-48` and run beside the
  module at 14 lengths: 1, 2, 1,799, 1,800, 1,801, 3,599–3,601, and the six stripped token counts of the P1 run;
- C's window counts for the P1 texts (5 · 3 · 3 · 2);
- a PHASE-id head then 1,800s;
- CLS and SEP on every window, with bodies rebuilding the ids at every phase;
- **a short text; a phase past the length; a phase exactly at the length; a text of exactly 1,800 ids** (one window
  at PHASE 0, a head plus the rest at every other phase); 1,801 ids;
- the empty-text, bad-phase and missing-CLS/SEP refusals.

**Mutants** (`scratchpad/step0/mutate.cjs`, output `mutate.out`): both files copied into `mut/`, only the copy mutated,
the copied test run. Tracked files hashed before and after: **untouched.**

    M1  phase ignored                      CAUGHT     M9  tokens counts CLS+SEP             CAUGHT
    M2  head window 1,800 not PHASE        CAUGHT     M10 empty text windowed               CAUGHT
    M3  phase past length not clamped      CAUGHT     M11 negative phase accepted           CAUGHT
    M4  last window not clamped            CAUGHT     M12 phase set drifts 1500→1800        CAUGHT
    M5  trailing partial window dropped    CAUGHT     M13 phase set not frozen              CAUGHT
    M6  windows of 1,801                   CAUGHT     M14 missing SEP defaulted             CAUGHT
    M7  no SEP                             CAUGHT     M15 PHASE 0 gets an empty head        CAUGHT
    M8  no CLS                             CAUGHT
    SURVIVE-CONTROL (a comment) SURVIVED · SKIP-CONTROL (absent anchor) NOT APPLIED
    applied 15 · caught 15 · NOT APPLIED 0 · survived 0

## 3 · THE SCORER DIFF — exactly two things added, and every reading it takes

The base is C's run-2 `score.mjs` (ecf03768…). Additions:

**(1) R8e — U, the six-phase mean PRIMARY, with min and max.**
- `phase-window.js` is loaded from the repo path and hash-checked against `ba98d635…` before use.
- `embedText(text, phase)` cuts its windows with `phaseWindows`. At phase 0 they are C's, and 641 of 641 unchanged
  fields prove it on every real token stream in the run.
- For every pair: the R3 primary at each of the six phases, **the same phase on both sides**; then `U`, `Umin`,
  `Umax`, and the per-phase values.

**(2) V1 — the SECONDARY centroid token-weighted:** cos(mw_H, mw_B) of the token-weighted mean vectors, per phase
and as its six-phase mean (`centroidTW`).

**Readings the diff takes, all for the librarian to rule on:**
- **Every field C's run wrote is still written, from phase 0, unchanged.** That includes C's primary, C's unweighted
  centroid and |m|, the unstripped secondary, C's P2 deltas and the sensitivity column. U fields are ADDED beside them.
- **R8e says U replaces the primary for both controls and P2's m_i,** so the diff also adds the U-based reads beside
  C's: `controls.*.passU`, `p1_predictionU`, per-row `ownU` / `otherMeanU` / `deltaU`, and `p2.distributionU`.
  **C's control gate still decides on phase 0**, as in run 2. If the chair wants the gate on U, that is a one-line change.
- **V1 per phase plus its six-phase mean** is my reading of "the centroid token-weighted" under R8e. V1 exists
  because a short head window must not weigh as a full one, which only arises at phases above 0. |m| stays as C had it.
- **NOT in the diff:**
  - R8f's symmetric-version other-mean (step 1's);
  - V2's sign guard (on r, at step 4);
  - any change to the output besides the file name `results-step0.json`, so C's `results-c1.json` is not overwritten.
- **Cost:** 16 minutes on D against C's ~3, because every pair is embedded at six phases, the sensitivity and
  unstripped pairs included. They are computed though unused.

**What the diff's run reports, for the record and not as a ruling:**

    controls on U     positive 0.8409 (passU true) · negative 0.4548 (passU true)
    P1 on U           A 0.7328 [0.7112, 0.7471] · B-read 0.6866 [0.6702, 0.7059] · E 0.6497 [0.6231, 0.6635]
    p1_predictionU    B − lower(A,E) = +0.0369, fires true
    centroidTW (6-ph) A 0.8439 · B-read 0.8230 · E 0.7985
    P2 ΔU (n 21)      min 0.0682 · Q1 0.1143 · median 0.1230 · Q3 0.1393 · max 0.1725
                      (still the ASYMMETRIC other-mean of C's run: R8f's symmetric m is step 1's, not this)

## 4 · WHAT I DID NOT VERIFY

- **"From the landed code":** nothing is landed. The bar ran on the working-tree file at sha256 `ba98d635…`. Once the
  chair commits it, the bar needs one re-run from the commit, or at least a hash check; the scorer diff refuses any
  other bytes.
- **The PHASE-0 test restates C's loop; it does not import C's scorer,** which is not in the repo. The real-stream
  equivalence is the 641 unchanged fields of the diff's run, and that lives in my scratchpad.
- **The empty-text edge** is refused, not ruled.
- **The diff's readings** (§3) are not ruled; the librarian reviews before use.
- **The six js-suite failures** were not re-baselined without these files. C recorded the same six before they existed.
- **Only the P1 three and the controls were checked cell by cell against an outside number.** The P2 U values have no
  prior to reproduce.
- **Nothing on L.**

## 5 · COMMANDS

    node dev/diversity/phase-window.test.js
    node <scratch>/step0/prior-art-equal.cjs              # 72,000 cases against phase.mjs's loop
    node <scratch>/step0/mutate.cjs                        # 15 mutants + 2 controls, on a copy
    cd <scratch>/c1read/c1 && node --require ./block-net.cjs score-step0.mjs   # results-step0.json
    node bar.cjs                                           # 42 checks: §5.2, phase.mjs, the librarian's U, phase-0 = C
    node cmp-runs.cjs results-c1.C.json results-step0.json # 641 equal, 626 added
    node consonance/tools/js-suite.js
    sha256sum dev/diversity/phase-window.js dev/diversity/phase-window.test.js <scratch>/c1read/c1/score-step0.{mjs,diff}

## 6 · CORRECTIONS, MINE

- **My first PHASE-0 reproduction assert dumped 8,641-id arrays into the failure message.** It is now compared whole
  and reported as window sizes, before any green run.
- **The vantage DISAGREE on L052's +220** (really +226) re-arrived. Already corrected twice; no action.
