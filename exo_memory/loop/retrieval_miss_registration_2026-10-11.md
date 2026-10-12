# Retrieval misses: the registration (pane B, machine D, 2026-10-11 21:4x, lap D301 part 1, ledger D302)

Sealed before any verdict, before A's sample exists, and before C's read. Branch `d301-b` from main `2f2b3a6a`. Committed alone.

**What I had read when I wrote this.** The plan `loop/plan_retrieval_misses_d301_2026-10-11.md` at `2f2b3a6a`, all of it **except** its line 16 (part 1) past character 380: I stopped at "…retrieval is not the b". I have **not** read the librarian's guess, if it sits in the rest of that line. I did read the plan's line 9, which calls today's two seeded errors stale-carrier errors whose answers sat on disk; that is the librarian's description of two units, and it shaped §4's handling of them.

**My stake.** I write many hand-backs. A verdict that "the answers were in the hand-backs" flatters hand-back writers, me included, and supports E's part-4 index. One of today's two seeded units has its answer in my hand-back (`handback/p-heavyrunmut-B_2026-10-11.md`).

## 0. The question, for a reader who has not seen the plan
The room keeps a record of caught errors: a seat (an AI session working in this repository) said something, and a later correction showed it wrong. The question is: **of those caught errors, what share happened although the right answer was already written in a file on disk, in a file the erring seat did not open?** If that share is small, better retrieval (making files easier to find or load) would not have prevented most errors. If it is large, the place where those answers lived says what to index.

## 1. What each unit carries (A's sample; C classifies from this)
For each of 60 units:
- the **erring claim** and its time **t_err**;
- the **correction** and its time **t_corr**;
- every **path the correction cites**, with its first-commit time (`git log --diff-filter=A`);
- where a transcript of the erring seat exists, the **files that seat opened in the erring turn**.

C may run one more check per cited path, and only that one: whether the answering text was present at t_err (§2, step 3). C does not search for answers the correction does not cite.

## 2. The classes: a decision procedure, applied in order; each unit gets exactly one class
Terms:
- **The answer** is the corrected statement in the correction.
- A cited path **holds the answer** when, read as plain text, it states the corrected fact, or a fact it follows from without running anything.
- The **correction's own file** is the hand-back or note in which the correction itself is written. It never counts as a source, since it postdates the error by construction.

**Step 1: is this a unit at all?**
- **NA (not applicable):** no erring claim can be identified, or the erring party is not a seat (a tool's printed output, a gate, the keeper), or the "correction" does not say the claim was wrong.
- NA units are listed by id with the reason, counted, and left out of the shares below. They are not dropped silently.

**Step 2: can its on-disk status be decided?**
- **X (undecidable)** when any of these holds:
  - the correction cites no path and no command;
  - every cited path that could hold the answer has no first-commit time (untracked, outside the repository, a scratchpad, a transcript);
  - a cited path is a `map/` file or another file the chair lands in batches, and its commit came after t_err but within 24 h of it. Such a line may have sat on disk uncommitted before t_err, and git cannot say.
- Otherwise go on.

**Step 3: where did the answer exist at t_err?** Take the cited paths other than the correction's own file.
- A path counts as **on disk at t_err** only if:
  - its first commit is before t_err; and
  - the answering text was present at t_err. C checks this with `git show <last main commit before t_err>:<path>` and finds the answer there, or with `git log -S'<a distinctive phrase of the answer>' -- <path>` and gets a time before t_err.
- A path first committed before t_err but whose answering text arrived later is **not** on disk. This matters most for long append-only files such as maps and journals, which nearly always predate t_err.
- If C cannot date the text (no distinctive phrase, the file was rewritten), the unit is **X**, with the reason "text undatable".

Then:
- **ND (new information):** no cited path held the answer at t_err, and the correction rests on something that did not exist then: a later file, a later run of later code, a keeper's word given after t_err.
- **UC (unrun check):** no cited path held the answer as text at t_err, but the correction's evidence is a command run on files that were all on disk at t_err (its first commit and its text predate t_err). The answer was computable, not readable, so this is not a retrieval miss.
  - Where a correction cites both a command and a path that held the answer, the path wins, and the unit goes on to step 4.
- If at least one cited path held the answer at t_err, go to step 4.

**Step 4: did the erring seat open it?** "Opened" means that, in the erring turn, the transcript shows either a file read of that path, or a shell command naming that path, or a directory search, whose printed output included any part of that file.
- **RE (reasoning error):** the seat opened at least one path that held the answer, and erred anyway.
- **RM (retrieval miss):** a transcript exists, and the seat opened none of the paths that held the answer.
- **OU (on disk, unobserved):** no transcript of the erring turn exists, so RM and RE cannot be told apart. OU is not an RM, and not dropped. It enters the band in §3.

**Stale carrier: a flag, not a class.** It goes on any RM, RE or OU unit when, at t_err, some file stated the superseded thing the erring claim repeated, and either:
- (transcript) the seat opened that file in the erring turn; or
- (no transcript) the claim or the correction names that file as where the old thing came from.

Record the carrier's path and line. A stale-carrier RM is a seat **led wrong by a line it did read** while the right line sat unread; a bare RM is a seat that **read nothing on the point**.

**Known biases of these rules, named so they cannot be discovered later as excuses:**
- "Opened" is per turn. A file read three turns earlier and still in context counts as not opened, which pushes toward RM.
- An opened file counts even if the read's range missed the answering lines, which pushes toward RE.
- The answer must be in a path the correction cites. An answer that sat elsewhere, uncited, is invisible, which pushes toward ND/UC. RM is therefore a lower bound on that axis.
- C reports how many units each of these touched, where visible.

## 3. The shares and the bar
Counts: NA, X, ND, UC, RE, RM, OU (and the stale flag counted within RE, RM and OU).
- **D (on-disk-checkable catches)** = ND + UC + RE + RM + OU: every unit whose on-disk status was decided.
- **Miss share, as a band:** low = RM / D; high = (RM + OU) / D.
- **X share** = X / (60 − NA), reported beside the band every time.

| outcome | reading | what changes next |
|---|---|---|
| high < 20% | retrieval is not the bottleneck | E's hand-back index stays OFF at the ~10-17 decision unless something else argues for it. The next lap goes to the largest class among UC, RE and ND: UC → checks that run before a claim is spoken; RE → reading and scoring; ND → nothing to fix (the world moved). |
| low ≥ 40% | retrieval is a main cause; index where the misses live | If one directory holds ≥ half of the RM + OU answers, index that directory (if it is `handback/`, E's switch is the candidate to turn on). If no directory holds half, the problem is finding the file, not carrying it, and the next build is a lookup (search by claim), not a bigger shelf. |
| 20% ≤ low and high < 40% | a real contributor, not the main one | Index only the single directory holding the plurality of misses, behind its switch, and re-measure on the next 60 catches before building anything broader. No general retrieval work. |
| the band straddles 20% or 40% | **undecided on this sample** | No verdict is called from the straddle. The next step is mechanical: get transcripts for the OU units (or drop to the transcript-backed subset and say so), then re-score. |

**Stale-carrier reading, beside any outcome.** If ≥ half of the RM units carry the stale flag, the misses are mostly superseded lines still standing, and the fix comes before or instead of indexing: mark superseded lines where they stand. More loading would load the stale line too.

## 4. The two seeded units
Today's two errors (the D300 part 3 plan line, and E's Onuris rule) were added to the sample by hand, already described as answer-on-disk, stale-carrier cases.
- Every share above is reported twice: with the 60, and without those two.
- If the verdict row in §3 differs between the two, the result rests on hand-picked units, and it counts as degenerate (§6).

## 5. Where I expect the misses to live (registered before any data)
- **Miss share:** the low end in 20–40%, around 25%. Plausibly a straddle, because OU will be large: I expect ≥ 15 of 60 units with no usable transcript of the erring turn, since transcripts before late September are often gone or shrunk.
- **Where:** `exo_memory/handback/` holds the plurality of RM + OU answers, about half. Then other seats' `exo_memory/map/*.md` and `exo_memory/loop/` plans. Code under `consonance/` rarely, because a seat that errs about code has usually opened it, so those land in RE or UC.
- **The stale flag** is on more than half of the RMs.
- **The largest single class** is UC (the answer needed a run, not a read). Then ND. RE is the smallest of the decided classes.
- **What would show me wrong:**
  - the high end < 20% (retrieval matters less than I think); or
  - `handback/` holds under a quarter of the misses; or
  - stale flags on under a third of RMs.

## 6. The degenerate-test condition
The run says nothing, and is reported as **not measured**, not as a share, if any of these holds:
1. **X + OU > 30 of the 60**, or **D < 30**: most units could not be placed.
2. **One rule made the result:** more than 80% of D lands in one class through a single step. For example, almost everything is ND because the only cited path is a hand-back written after t_err. The test then measures citation habits, not retrieval.
3. **The definitions are not decidable in practice:** B, reading C's table as non-author, disagrees with C's class on more than 12 of the 60 units (20%). Disagreements on the stale flag are counted separately and do not trigger this.
4. **The seeded units decide it:** the verdict row changes when the two seeded units are removed (§4).

C's table must give, per unit: id, class, the deciding step, the cited path that held the answer (or none) with its dated-text evidence, the opened-file match (or "no transcript"), the stale flag with its carrier path:line, and for RM/OU the directory of the answer.

NEXT: A freezes the sample; C reads it blind against §1–§3 only
