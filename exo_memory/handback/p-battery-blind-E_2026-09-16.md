# P-BATTERY-BLIND — the blind scoring design for the pane battery

**ECHO, on D, 2026-09-16 ~04:0x. I design; I scored no pane, and nothing here ran against a pane.** Packet:
`loop/plan_pane_battery_2026-09-16.md` (8360b4c), E paragraph, and the chair's dispatch of the same lap.
Read at their files, not from a compaction summary: the registration `loop/pane_battery_registration_2026-09-16.md`
(0a54c5a, corrected at d1546db) §2 T6 / §3 / §5; `loop/anchor_similarity_registration_DRAFT_2026-09-15.md` §8.9,
§8.10 K2/K6, §8.10.1 G1–G3, §8.11 R8g–R8i; `dev/diversity/redact.js`; `dev/diversity/arm-words.txt`;
`handback/step0-redact-A_2026-09-15.md` §2.2, §3, §5.

**VERDICT, first line, because it changes what follows: PARTLY. The NAMES can be blinded; the AUTHOR cannot be
blinded by redaction.** Every identity LABEL in these texts is removable, and I name the three classes that need a
new rule. What survives is not a label — it is length, shape, and the pane's own account of its prior work, and no
rule removes those. Whether that residue is enough for a scorer to guess is an empirical question with exactly one
instrument, the guess gate, and the gate must be RUN rather than predicted. **§6 says what the battery is worth if
the gate fires, and that number is smaller than the table the chair wants.**

## 0 · MY STAKE, and what this document is not

- **I wrote 9 of the 42 hand-backs this design was measured on** (`p-leave-E`, `p-harness-E`, `p-diversity-c0-E`,
  `p-diversity-c1-E`, `step0-phase-E` and four earlier). **I am also a subject of the battery I am designing the
  scoring for.** A design that made one pane's work easier to grade well would be worth something to me. The
  defences are that every rule below is symmetric across the four letters, every number is re-derivable from a
  command printed beside it, and I score nothing in this battery under any of these rules.
- **I wrote `dev/diversity/phase-window.js`, not `redact.js`.** A wrote the redaction I am about to find three
  holes in. All three are on classes A's packet never named (§8.9 STEP 0 asked A for arm letters, arm words,
  packet filenames, `§n` and shas — A delivered all five and tested them, 28/0). **These are not defects in A's
  build; they are classes the ARM blind was never asked to cover.**
- **This is a design, not a measurement of any pane.** Every number below measures the REDACTION. §7 says what it
  does not establish, and the first entry is that none of it is a fact about A, B, C or E.

**Instruments re-derived before use** (`sha256sum`, on D, this lap), against §8.11's recorded values:

    dev/diversity/redact.js        cb3f3ea1bdbbdd533b5bdacbbde95393d8dfe4ec9173126b6aad1fab74ed6d3d   MATCH
    dev/diversity/redact.test.js   1d5b0a20fdb0190db1ae87d0802c8296155189287553da5ad3d80fda065c8025   MATCH
    dev/diversity/arm-words.txt    59579593b3a9d7c9d810b6eeb6339c8af0f1ece16644b951db67c8445d25b91e   MATCH

**The corpus every number below is taken over**, and its command:

    cd exo_memory/handback
    ls | grep -E -- "-(A|B|C|E)_2026-09-(0[2-9]|1[0-6])\.md$"          # 42 files, 763,628 B, mean 18,181 B

    for L in A B C E; do echo "$L $(ls | grep -Ec -- "-${L}_2026-09-(0[2-9]|1[0-6])")"; done
    A 14 · B 12 · C 7 · E 9      (2026-09-16 ~03:5x, on D)

**The census moved while the battery was being designed.** The registration §1 recorded `A 14 · B 11 · E 9 · C 7`
at 03:3x; B is now 12, because `p-battery-attack-B_2026-09-16.md` landed between. The registration's own sentence
covers it — *"Both are right at their own moment"* — and I record the drift because §5's cheaper half asks for a
correlation against this census, and a correlation is only checkable if the denominator carries its timestamp.
**Whoever runs §5's correlation must state which census reading it used.**

**Second corpus, and it is the one the hard case rests on.** `l039` and `l045` sent ONE identical brief to A, B and
C (`loop/l039_score_2026-09-07.md`, `loop/l045_score_2026-09-08.md`). Six texts, two briefs × three panes. **That is
the battery's exact shape — same brief, different pane — already on disk, and it is the only same-brief evidence
this room has.** It is the right instrument for §5 and it is n = 2 briefs, which §7 prices.

---

## 1 · PANE IDENTITY vs ARM IDENTITY — what the existing blind removes, what needs a rule, what cannot be removed

`redact.js` was built for a two-valued question (briefed / unbriefed). This battery asks a four-valued one, and
identity here is a SEAT rather than a condition. The classes below were measured by redacting all 42 files and
probing the OUTPUT. Script: `scratchpad/leakcensus.js` (my scratchpad, not the repo). Command:

    node <scratchpad>/leakcensus.js "B,C,E" $(ls exo_memory/handback/ | grep -E -- "-(A|B|C|E)_2026-09-(0[2-9]|1[0-6])\.md$" | sed 's|^|exo_memory/handback/|')

`leaks()` returned `[]` on all 42 redacted outputs. **Everything below survives a clean `leaks()`, which is the
point: the existing blind's own checker cannot see any of it.**

### 1.1 ALREADY REMOVED — no new rule needed

| class | the pattern that takes it | checked |
|---|---|---|
| `[pane:E]`, `pane:E`, `pane E`, `E pane` | the four letter patterns | K6 fixture, redact.test 28/0 |
| a pane's possessive `E's` (straight and curly) | `/\b[A-Z]['’]s\b/` | same |
| NATO callsign, capitals or Title case (ALPHA … ZULU) | the callsign alternation | same |
| **a hand-back filename's letter** — `p-leave-E_2026-09-14.md` → `p-leave-[redacted]_…` | `/(?<=-)[A-Z](?=_\d{4}-\d{2}-\d{2})/` | A's build, beyond K6 |
| **a map file's letter** — `map/E.md` → `map/[redacted].md` | `/(?<=\bmap\/)[A-Z](?=\.md\b)/` | A's build, beyond K6 |
| **a ruling owner** `(E)` | `/\([A-Z]\)/` | A's build, beyond K6 |
| a packet filename with any directory in front | the packet pattern | K6 fixture |
| shas, incl. `e7f6af7a…6509` and full 64-char | K6 CORRECTED (5a62cd9) | fixture asserts figures survive |
| `§n` | the `§` pattern | fixture |
| the 14 arm words, incl. `chair`, `orchestrator`, `dispatch` | the word list | fixture |
| **a sibling-id's hex** — `sibling-07b8a48f` → `sibling-[redacted]` | the sha pattern, incidentally | measured, §1.2 |

**Three of those eleven are A's additions, not K6's.** A found them by running a surveying grep over real texts
rather than from the spec (`step0-redact-A` §4), and they are precisely the three that matter most for a PANE
blind — the filename letter, the map letter, the ruling owner. **The arm blind covers more of the pane question
than its own specification does, because A went past the spec.**

### 1.2 NEEDS A NEW RULE — measured, with counts over the 42 redacted files

| class | hits | files | what survives, verbatim | why the existing rule misses it |
|---|---:|---:|---|---|
| **instance dir / sibling stem** | 17 | 13 | `sibling-`, `instances/fresh-`, `C--Consonance-instances-sibling-`, `C--Consonance-instances-librari…` | the sha pattern eats the 8 hex chars and leaves the stem; a stem naming a SEAT (`…-librarian`) never had hex to eat |
| **uuid remnant** | 13 | 11 | `[redacted]-634b-4a04-b5de-[redacted]`, `[redacted]-38f2-4cc2-b45a-[redacted]` | a uuid's middle groups are 4 hex — below the 7-char floor. The shape is a fingerprint even with the ends gone, and the middle groups alone identify the pane to anyone holding `data/panes.json` |
| **scratchpad path** | 113 | 30 | `scratchpad/quote_strip.js`, `scratchpad/r52_impl.js`, `scratchpad/diverged_red_first.js` | not a class the arm blind names. A pane's scratchpad filenames are its own invention and recur across its hand-backs |
| **lower-case callsign** | 31 | 11 | `alpha`, `echo`, `delta` | deliberate: `redact.js`'s header says lower-case `echo` and `delta` "are code and English, and stay". True for an ARM; false for a PANE, where `echo`/`delta` in prose can name a seat |
| **bare A or I as a seat** | 15 | 9 | `A wrote`, `A built`, `A measured` | **R8h, and it is structural.** `--letters` throws on A and I by construction. The battery has a pane at letter A |

**THE RULES, as a builder should implement them.** They go in a new file `dev/diversity/pane-words.txt` and a new
`--seats` flag; **`redact.js` and `arm-words.txt` are NOT edited** — their shas are recorded at §8.11 and a change
to either is a new registration of the ANCHOR run, which this battery has no business touching.

    P1  uuid and instance stems.  Remove /(?<![\w-])(?:sibling|fresh)-[\w-]*/gi  and
        /(?<![\w-])C--[\w-]+/g  and  /(?<![\w-])instances\/[\w.-]+/g,  BEFORE the sha pattern, so the stem
        goes with its hex rather than surviving it. Then remove a bare uuid middle run:
        /(?<=\[redacted\]-)[0-9a-f]{4}(?:-[0-9a-f]{4})*(?=-\[redacted\])/gi.
        Fixture: "sibling-07b8a48f" and "6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f" leave ONE token each;
        "2026-09-16" and "1757000000" survive (they are a date and a figure — K6's rule, kept).

    P2  scratchpad paths.  Remove /(?<![\w-])scratchpad\/[\w./-]*/g and a bare /(?<![\w-])scratchpad(?![\w-])/g.
        Cost, and it is real: a hand-back that cites its own instrument by path loses the citation. That is the
        same cost A measured for "§n" (step0-redact-A §2.2: 20 of 48 labels touched, none destroyed) and it is
        paid the same way — the scorer matches by CONTENT, not by locator. State it in the scoring brief.

    P3  lower-case callsigns, ONLY as seat words.  Add alpha/bravo/charlie/delta/echo/… to pane-words.txt, matched
        case-insensitively. This DOES eat the English "an echo" and the shell's `echo`.
        **Measured cost: 31 hits in 11 of 42 files, and I did not classify how many are seat uses.**
        A builder implements P3 and reports the false-positive count from the fixture run; if it exceeds the seat
        uses, P3 is reported as costing more than it buys and is dropped — that decision is made from the count,
        before any label exists, and never after.

    P4  bare A.  CANNOT BE DONE — see §1.3. The mitigation is at the battery's level, not the redactor's.

### 1.3 CANNOT BE REMOVED — four classes, and this is the load-bearing part

**(a) The letter A.** R8h is a rule of the ANCHOR run ("no arm at letter A or I"), and it holds there *by
construction* because new seats take N onward. **The battery cannot obey it.** Its subjects are the four standing
panes, and one of them is A. Measured: 15 uses of a bare `A` in seat position (`A wrote`, `A built`, `A measured`)
survive in 9 of 42 files, and `--letters` **throws** if you pass A. So the battery's blind is asymmetric at birth:
three panes can be letter-blinded and one cannot.
**Mitigation, and it is the only one available: re-letter the texts before scoring.** Before redaction, each text's
own author is rewritten to a run-local symbol from a seeded shuffle (`W`, `X`, `Y`, `Z`), committed at the same
place the arm mapping is (§2.4). Then `--seats W,X,Y,Z` is passable, because none of them is an English word. **A
prose "A" that means the seat is still not distinguishable from an article, so this narrows the leak and does not
close it.** Report the residual count per run, with the command.

**(b) Length and shape.** No redaction changes how long a text is. §5 measures it.

**(c) The pane's own account of its prior work.** Measured on the redacted corpus: `I wrote` / `I built` /
`I measured` / `my own` / `my earlier` appears **131 times in 37 of 42 files**; first-person singular 656 times in
42 of 42. The letter in `I wrote p-leave-[redacted]` is gone — **the stem is not.**
Measured attack: of 26 hand-back path fragments surviving redaction, **11 resolve to exactly one author by
`ls exo_memory/handback | grep <stem>`, in 11 of 42 files; 2 of those name the reading text's own author.**
**This is not a redaction problem. It is the hand-back contract**: the room REQUIRES a pane to state its stake
(the chair's own dispatches: *"You wrote p-leave-E, one of P1's texts. Say where that touches your read"*) and to
record the corrections it made to itself. **A hand-back that obeys the room names its author.** You can delete the
letter; you cannot delete the sentence without changing the work being measured — and changing the work to make it
gradeable is fitting the instrument.
The one thing that CAN be closed: **the scorer must not hold the repo.** The grep attack needs `ls`. §4 prices that.

**(d) House style.** §5, and my expectation about it was wrong.

---

## 2 · THE GUESS GATE — what the guess is over, and how it is recorded

R8g ruled: *"K6's 0.75 rule is NOT relaxed, and the id classes are NOT added to the redaction. Loosening a bar
because its author expects it to fire is fitting the instrument to pass."* **That ruling is inherited whole. What
follows adds no looseness to it; where it changes a number it changes it toward the stricter side, and it says so
with the arithmetic.**

### 2.1 The chance level changed, so the literal bar is the weaker bar

K6's 0.75 was set against a **binary** guess: briefed or unbriefed, chance 0.5. A pane guess is **four-valued**,
chance 0.25. Transporting "0.75" unchanged transports the *string*, not the *bar*.

    above-chance fraction of the ruled bar:   (0.75 − 0.50) / (1 − 0.50) = 0.500
    the same fraction at four-way chance:      0.25 + 0.500 × (1 − 0.25) = 0.625

**REGISTERED: the pane-battery gate is 0.625, and the literal 0.75 is reported beside it every time.** 0.625 is
the *stricter* bar in this room's direction of risk — it declares UNBLINDED sooner, and UNBLINDED costs the run its
comparative claim. Adopting it therefore cannot be the failure R8g names, and it is written here before any guess
exists. A reader who prefers the literal 0.75 gets a weaker instrument and both numbers are on the page.

**Its power, computed rather than asserted** (binomial, chance 0.25):

    n = 24 texts   gate 0.625 → 15/24   P(reached by chance) = 1.12e-4
                   gate 0.75  → 18/24   P(reached by chance) = 3.89e-7
                   smallest k significant at 0.05: 11/24 = 0.458
    n = 6 texts    gate 0.625 →  4/6    P(chance) = 3.8e-2

**And the unwanted number, about the rule I inherited:** at the ANCHOR run's size the same gate is weak. Binary
chance 0.5, gate 0.75, n = 8 arm texts → **P(reached by chance) = 0.145**. One scorer in seven reaches UNBLINDED
by luck alone. **I am not proposing that be changed** — it fails toward "do not trust polarity", which is the safe
direction, and R8g forbids re-tuning it. It is recorded because a bar whose false-fire rate is unstated will be
read as tighter than it is, and R8g's registered expectation is that the gate fires.

### 2.2 What the guess is taken over

**TWO guesses, both taken, either one firing the gate. Both are registered here before any scorer exists.**

    G-ID   IDENTIFICATION, the primary, comparable to K6's arm guess.
           After its labels are sealed (2.4), each scorer is given the run-local symbol set {W, X, Y, Z} and told
           only that the texts were written by four authors, and is asked, FOR EVERY TEXT, which symbol wrote it.
           A scorer may not decline a text; "no idea" is recorded as a uniform random pick made by the scorer, and
           the count of such picks is reported.
           SCORE  correct / total, over ALL of the run's texts.
           GATE   ≥ 0.625 for EITHER scorer → the battery is reported UNBLINDED. (0.75 beside it.)

    G-LINK LINKAGE, the secondary, and the one that needs telling the scorer nothing about seats.
           Each scorer partitions the texts into authorship groups without being given a count or a symbol set.
           SCORE  adjusted Rand index against the true partition. Chance ≈ 0.
           GATE   ARI ≥ 0.5 for EITHER scorer → UNBLINDED.
           WHY IT IS HERE  G-ID requires telling a fresh scorer that four authors exist, which is itself a briefing
           and manufactures the very inference it measures. G-LINK measures what the redaction leaks without
           handing anything over. **A run that passes G-ID and fails G-LINK has been told the answer's shape.**

**THE LINKAGE MULTIPLIER, and it decides the scorer design.** Six tasks × four panes = 24 texts. If ONE scorer
sees all 24, it can group them by author across tasks and then **one identity leak in one text labels that
author's whole column — six texts from one slip.** The anchor run never faced this: its arms were one-use fresh
siblings, one task each. **Therefore: a fresh scorer pair PER TASK, closed after it, never reused.** §4 prices it.
If the keeper's clicks will not stretch to that, the fallback is one pair for the whole run *with G-LINK reported
as the primary*, because under reuse G-ID's number is no longer independent across texts and its n is 6, not 24.

### 2.3 What is guessed OVER is the same text the labels were made on

The scorer guesses over the **redacted** texts it labelled, not over originals, and not over a fresh presentation.
A guess taken over a different artifact than the labels measures a different blind.

### 2.4 How a guess is recorded so it cannot be revised after the labels

**The order is fixed and each step is closed before the next opens:**

    1  LABELS.   Each scorer writes its labels to its own file and they are committed, in one commit that names
                 no scorer and no pane. The commit sha is recorded in the run file.
    2  GUESSES.  Only then is the guess asked. Each scorer writes G-ID and G-LINK to a SECOND file, committed in
                 a SECOND commit. A scorer that has not committed step 1 is not asked step 2.
    3  TRUTH.    Only then is the author mapping (the {W,X,Y,Z} shuffle of 1.3(a)) committed.

**AND COMMITTING IS NOT SEALING. Tonight's own run proves it, in this battery's own files:**

    git show 0a54c5a:exo_memory/loop/pane_battery_prediction_2026-09-16.md | sha256sum
    → 8bf0b5eecc2c51967a70801eea3bdbefca9790a85e061e31ecb668c51e8f4894   = the sha §4 records

    sha256sum exo_memory/loop/pane_battery_prediction_2026-09-16.md
    → ff1a17204b83b53544c6acdb14ab669e2c11469818b692c86a845a251a19abda   ≠ it

**The registration §4 names a sha256 that the file at HEAD no longer has.** d1546db edited the sealed prediction —
correctly, to fix a prose clock, and with the edit disclosed in the file's own last paragraph. **The seal is
intact and the edit is honest. The POINTER is what broke:** §4 says "sha256 `8bf0b5ee…`" and a reader who checks
it the obvious way, against the path, gets a mismatch and cannot tell an honest timestamp fix from a rewritten
prediction. Twenty minutes, in the document whose entire point is being fixed before something.
**This is not a §6 violation** — §6 voids on a change after the first score is seen, and no score exists. It is
the carrier problem the room already has a name for, landing on a seal.

    S1  A SEAL IS A (COMMIT, PATH, SHA) TRIPLE, NEVER A SHA.  Every sealed row in this battery records the commit
        it was sealed at, and is verified ONLY by
            git show <commit>:<path> | sha256sum
        A row that records a sha without its commit is not a seal and is reported as unsealed.
    S2  ANY LATER EDIT TO A SEALED FILE APPENDS A LINE naming the new commit and the new sha, leaving the
        original triple intact. The verification of record stays the ORIGINAL triple.
    S3  THE SECOND CARRIER.  The sha of each guess file is posted to the board before the truth commit. The board
        attributes by MOUNT, not by claim, so a scorer cannot post as another seat; and the scorer's own capture
        is a third, independently timestamped carrier. The check is that all three agree.
        **Unmeasured by me: whether a board row can be edited after the fact. A builder checks that before
        relying on S3, and if it can, S3 is reported as a convenience and the triple is the seal.**
    S4  THE PREDICTION'S OWN POINTER.  Before the battery RUNS, §4 of the registration is amended to carry the
        commit alongside the sha. That is a repair to a pointer, not a change to a task, a key, a threshold or a
        brief, so §6 does not bite — but it must happen before the first score, not after, and the chair should
        rule it rather than let me assume it.

---

## 3 · TWO SCORERS, NEITHER THE DISPATCHER, AND THE 0.70 BAR

**THE RULE, and it is not negotiable.** Two scorers label every text independently. **Per-label agreement ≥ 0.70,
or that task is REPORTED DEAD AS AN EXACT COUNTER.** Not re-tuned, not re-grained, not re-scored by a third
scorer, not widened.

**Why it cannot be re-tuned, in the room's own terms.** K6 set the bar. §6 of this registration voids the run on
*"any change to a task, a key, a threshold or the brief after the first score is seen"*, and an agreement bar is a
threshold. The precedent underneath is the bidirectional-correction amendment of **2026-08-16**
(`journal/2026-08-16.md:722-726`): a pane withdrew *"the keeper is the only DECORRELATED reader"* **in full**,
naming it *"the asymmetric-application error, in the sentence correcting the chair's version of the same error"* —
it had applied a test to every party and waived it for one. **A bar loosened for the run that fails it is that
same asymmetry**: the rule applies to every task until it applies to the one we wanted to keep.

**DEAD AS AN EXACT COUNTER means the report carries the numbers that killed it**, in this form, and the task's
column in the table is empty rather than estimated:

    T3 DEAD — agreement 0.61 (27 of 44 labels), 17 disagreements, of which 11 on claims 12–19.
    No T3 score is reported for any pane. Not re-grained; §6.

**The statistic.** Raw per-label agreement, on the ONE shared claim list per task (§8.9's correction of R8b's
wording: *"There is ONE shared list per task, and agreement is computed on it"*). **Cohen's κ is reported BESIDE
it and is not a gate** — adding a statistic that can decide an outcome is adding a threshold. Where raw ≥ 0.70 and
κ ≤ 0.2, the run reports *"agreement carried by a skewed label distribution"* as a descriptive line. That is a
sentence, not a re-score.

**The grain is fixed before any claim list exists.** §8.10.1's G1 (operative text), G2 (line drift is SILENT) and
G3 (derived-first is AFFIRMS) are **inherited verbatim** by this battery, and K2's rule that AFFIRMS requires a
stated check at a quotable line comes with them. They were pre-registered there for exactly this reason: A measured
that P swings **more than 3× on one grain rule** — 0.271 over all 81 claims, 0.079 with superseded claims dropped.
**A battery that picks its grain after seeing disagreement is choosing its own agreement number.**

**Who may not score, stated as a list a builder can check:**
- not the seat that dispatched the task (the chair);
- not the author of any text in the set;
- not the author of the task's key or claim list;
- not a seat that has read any un-redacted text in the set.
The last one is new here and it is the one that will be broken accidentally: a standing pane that saw a hand-back
land on the board has already read it unredacted. §4 is why the answer is fresh panes.

---

## 4 · WHO SCORES, AND WHAT IT COSTS IN THE KEEPER'S CLICKS

**§8.9's finding, at the code.** `main.rs:3278-3300`: `prepare_fresh_dir` makes `instances/fresh-<8 hex>` and
writes **no CLAUDE.md** — *"the absence is the feature"*; `spawn_fresh` calls `spawn_claude_pane(..., false, false)`
with the comment *"skip_perms=false: a legit fresh spawn asks permission like anyone's claude."* No board mount, no
map, no room. **There is no chair verb for it.** The UI path is `ui/term.js:570 addFresh()` → one button, `○ Fresh`.

**So: a fresh pane is the only seat blind by construction, one click to spawn, and it asks before every tool use.**

### 4.1 The reduction that comes first, because it changes the bill

**Of the six EXCELS numbers, one needs no scorer at all.** T1's *"mutants caught / mutants applied, NOT APPLIED
reported separately"* is computed by running the committed mutant list against the pane's tests; its tie-break
(*"fewer lines touched outside the named files"*) is `git diff --stat`. **T1 needs a runner, not a reader, and a
runner cannot be unblinded by prose.** The other five convert prose into a number and need the blind: T2 and T5
match a hand-back's passages to a sealed defect list; T3's set intersection is mechanical but its registered
*"reported beside it"* column (paths not in the key that DO bear on the question) is judgment; T4's *"figures
sourced / figures reported"* is judgment; T6 is the labelling task itself.

**And a design that shrinks what a scorer must read shrinks both the bill and the leak surface.**
**Measured over the 42 redacted hand-backs: lines carrying a `path:line`, a ratio, a figure with a unit, or a
verdict word are 1,195 of 10,503 lines (11.4%) and 128,211 of 773,234 B (16.6%). 83.4% of the bytes are prose a
scorer would not have to read.** (My line-classifier is a proxy I wrote for this estimate and a builder should not
ship it. The real form is a rule in the brief.)

    E1  THE ANSWER BLOCK.  Every task brief requires the hand-back to end with a block of answer lines — one per
        finding, each a path:line, a ratio, or a figure with the command that produced it. The scorer is given
        THE BLOCK, redacted, and the prose only for the residue it cannot resolve.
        Registered limit: the block has a length too, so E1 does not touch §5's channel, and requiring it CHANGES
        THE WORK — it is a change to the brief and must be in the brief from the first dispatch, never added
        after a score is seen (§6).

### 4.2 The bill, in clicks, with the assumption named

Two regimes, because Claude Code's permission prompt offers a "don't ask again" scope and **I did not measure
which prompts it collapses.** Both are given; the measurement that settles it is in 4.3.

| | per-task fresh pairs (the 2.2 design) | one pair for the whole run (the fallback) |
|---|---:|---:|
| spawns (1 click each, `○ Fresh`) | 2 × 6 tasks = **12** | **2** |
| approvals, PESSIMISTIC (every tool call prompts): 1 claim list + 4 texts + 2 writes ≈ 7 per scorer per task | 7 × 2 × 6 = **84** | 7 × 2 × 6 = **84** |
| approvals, OPTIMISTIC ("don't ask again" collapses to ~3 per scorer per session) | 3 × 2 × 6 = **36** | 3 × 2 = **6** |
| **total, pessimistic** | **96** | **86** |
| **total, optimistic** | **48** | **8** |
| what it buys | no cross-task linkage; G-ID n = 24 | cheap; **G-ID's n is 6, not 24, and G-LINK becomes the primary** |

**Plus, in both columns and not optional: the keeper must DENY every repo read.** §1.3(c) measured the grep
attack — 11 of 42 texts carry a fragment that `ls | grep` resolves to one author. A scorer allowed to read the
repo is not blind, whatever the redaction did. **The cheapest way to deny it is to not require it:** the texts and
the claim list go into the fresh pane's OWN cwd (`instances/fresh-<hex>/`) before it wakes, so every read it makes
is inside its own directory and every read OUTSIDE it is refused. That turns a stream of judgment calls into one
standing rule the keeper can hold without reading each prompt.

    E2  THE SCORER'S WORLD IS ITS OWN CWD.  Before the spawn, the run writes into the fresh directory: the
        scoring brief (self-contained — a fresh pane has no room, so K2's rules and the grain rules G1–G3 are
        RESTATED in it, never cited by §; and `redact.js` eats "§n" anyway), the claim list, the redacted texts
        under neutral names from the seeded shuffle, and the two output filenames.
        **Any read outside that directory is denied. That is the blind's last wall and it is a human holding it.**

**The injection alternative, and why I am not recommending it.** `chair_inject` would let the chair paste texts in
and cost the keeper nothing — no chair verb spawns a pane, but one can speak to it. `inject_to_pane`
(`main.rs:9077-9100`) uses bracketed paste with a submit delay scaled to payload length, and its own comment
records that **a flat 120 ms failed on a ~3.7 KB brief on 2026-08-25**. The mean hand-back is **18,181 B** and the
max is **35,743 B** — five to ten times the payload that already broke a constant. **Injecting whole hand-backs is
unmeasured at this size and I am not designing on it.** E1's answer block (≈16.6% of bytes, ~3 KB typical) is
inside the measured range, so injection becomes available *if* E1 is adopted — and a builder measures it before
relying on it.

### 4.3 The one measurement that halves this bill, and it is one click

    Spawn one fresh pane. Put three files and one write target in its cwd. Ask it to read all three and write one.
    COUNT THE PROMPTS, and record whether a "don't ask again" answer covers later reads in the same directory.

That number decides between 96 and 48 (or 86 and 8), and it costs one spawn and about four answers. **Until it is
run, every click figure above is a bracket, not a measurement.** I did not run it: it needs the keeper's hands,
and nothing runs tonight.

### 4.4 The seats that are NOT the answer, said so nobody re-proposes them

- **A standing pane (B, say, scoring A/C/E).** Zero clicks — and not blind by any construction. It holds the room,
  the maps, the repo and every letter; it can grep in one command; and it has read these texts unredacted on the
  board. Its blindness would be **honour, which is not an instrument.** It is also excluded by §3's fourth rule.
- **The keeper.** Zero spawns, but the room's own measured finding is that he is *"a SELECTING filter, not a
  neutral one"* (BOOT, the curated auditor, 2026-08-02), and his time is the scarce resource the whole click
  budget exists to protect.
- **The librarian.** It collates the run and re-derives its figures; a seat that scores what it will also collate
  is running the experiment and reading the dial (the committee's scoring rule).

---

## 5 · THE HARD CASE — A's uptake finding, transposed to the pane, and my expectation was WRONG

A measured, and the room ruled on it (R8g): *"no redaction can blind polarity to uptake"* — a text that quotes its
brief reads as briefed however it is scrubbed. **I went into this lap holding the pane-level analogue as obvious:
that HOUSE STYLE is the uptake of this battery, unremovable, and that it would sink the blind.** I wrote that down
before measuring. **It is not what the measurement says.**

### 5.1 The test, and it is a natural experiment already on disk

The `l039`/`l045` pair is one identical brief sent to A, B and C, twice. **Train on one brief, test on the other:
topic is held constant inside each brief, so a classifier that works across them can only be using how a pane
writes.** Both scripts are in my scratchpad; both operate on the REDACTED texts.

    node <scratchpad>/style.js       # closed-class function words + punctuation + markdown furniture,
                                     # nearest-centroid in the OTHER brief, cosine
    node <scratchpad>/markers.js     # 18 surface markers, per 1000 words, rank order per brief

**Result 1 — a crude stylometer is at chance.**

    3/6 correct; chance 2/6 (1 of 3).  Binomial P(X ≥ 3 | p = 1/3, n = 6) = 0.32.
    Top-vs-second cosine margins: 0.0018 – 0.0095.

**Result 2 — surface markers do not rank consistently.**

    3 of 18 markers keep the same pane ordering across both briefs.  Expected by chance: 3.0 of 18.
    And one of the three is degenerate (blockquote, all zeros — the "ordering" is the tie-break).
    Non-degenerate: 2 of 18, BELOW chance.

**So: house style, at the grain of function words and punctuation, carries no pane identity across an identical
brief in this room's texts. That is an unwanted number, in my own direction, and I am reporting it against my
registered expectation.**

### 5.2 What DID survive, and I found it by normalising it away

My marker table divided everything by word count — and the channel was the divisor.

    brief   pane   raw bytes   words (redacted)   lines
    l039    A          15,601             2,409     242
    l039    B          21,520             3,250     328
    l039    C          11,949             1,814     167          order: B A C
    l045    A          15,830             2,520     232
    l045    B          17,400             2,804     241
    l045    C          13,977             2,163     192          order: B A C

**Same order, both briefs, on all three independent length measures.** Chance for one ordering to match is 1/6.

**And the honest limit, which I ran because I expected it to help and it did not:** over the full 42-file corpus
the per-pane length distributions overlap almost completely —

    A n=14 median 16,782 · B n=12 median 18,820 · C n=7 median 14,210 · E n=9 median 15,856
    every pane's min is 10,944–12,087; maxima run 23,276–35,743

**So length is not a pane property across different tasks — it is a WITHIN-TASK RANK.** It only reads as identity
when the texts being ranked answered the SAME brief, which is exactly and only the condition the battery creates.
**n = 2 briefs. This is the weakest evidence in this document and the most consequential.**

### 5.3 What it costs this battery

**The pane equivalent of A's uptake finding is not ornament. It is LENGTH RANK plus the pane's own account of its
prior work (§1.3(c)), and neither is removable.** The battery hands a scorer four texts that answered one brief,
side by side. Ordering them by length is free, needs no style sense, and requires reading nothing. If length rank
is stable per pane — and in the only two same-brief cases this room has, it was — **that is a channel from four
texts to four authors that no redaction touches.**

Three things I will not pretend:
- Shuffling presentation order (the §8.10 pin's seeded shuffle) does **not** help. Length is in the text.
- Normalising or truncating the texts to equal length **destroys the thing being scored** and is fitting.
- **Scoring each text in its own scorer session removes the side-by-side ranking** — and multiplies the click bill
  by the number of texts, and breaks §3's agreement statistic, which needs both scorers on one shared list.
  It is the only real mitigation and it is priced out. **The battery carries this confound.**

### 5.4 Does the guess gate catch it? — the answer the packet asked for

**Yes, and that is the whole of its usefulness — it catches it as an OUTCOME and cannot prevent it.**

- **G-ID catches it.** A scorer ranking four texts by length and mapping the rank to the four symbols will exceed
  0.625 whenever length rank is informative. That is what the gate is for.
- **G-LINK catches it too, and earlier**, because clustering by length needs no symbol set.
- **What neither catches: a scorer who uses the channel without noticing.** The gate measures the guess a scorer
  *makes when asked*, not the inference that moved its labels. A scorer that read one text as more thorough
  *because it was longer* has already let length into the score, and will still guess at chance if it never formed
  an explicit belief about authorship. **The gate bounds the leak's visibility, not its influence.** That is the
  exact residue R8g accepted for uptake, transposed, and this battery accepts it on the same terms.
- **And the gate cannot fire on what the scorer never sees.** If E1's answer block is adopted, the scorer reads
  16.6% of the bytes — a smaller style surface, and the SAME length rank, since the block's length tracks the
  work. E1 buys clicks and leak surface; it buys nothing against §5.2.

---

## 6 · THE VERDICT, AND WHAT THE BATTERY IS WORTH UNBLINDED

**NOT "this cannot be blinded", and not "this is blinded". The right sentence is narrower and it is registered
here before any scorer exists:**

> **The identity LABELS are removable; the AUTHORSHIP is not removable by redaction. Whether the residue is
> sufficient for a scorer is an empirical question, the guess gate is its only instrument, and the gate must be
> RUN. A battery that reports a table without reporting the gate beside it has not measured what it claims.**

**IF THE GATE FIRES — the transposition of R8g, decided now rather than after the number:**

1. **No table.** The comparative claim — *"who excels at what"*, the keeper's own sentence — is the thing that
   dies, because it is the only claim that needs the scorer not to know who wrote what.
2. **The per-pane, per-task numbers SURVIVE for the key-scored tasks, and they survive fully.** T1's
   caught/applied, T2's found/planted, T3's paths-found/paths-in-key, T5's caught/planted are counts against a
   **sealed key committed before dispatch**, and **a sealed key does not care who wrote the text.** Report them.
   They stay a citation into `librarian/DOSSIER.md`, exactly as §8 requires, and never a sentence about a nature.
3. **The judgment-scored numbers go DESCRIPTIVE**, R8g's word: T4's figures-sourced, T6's labels, and every
   *"reported beside it"* column, reported **with the guess rate printed next to them, every time**, and never
   compared across panes.
4. **The run says so in its first line**, as R8g requires of its own run.
5. **So the likely registered outcome of this battery, stated before it runs: four key-scored task numbers per
   pane, and a descriptive appendix.** The chair should know that before spending the keeper's clicks, because it
   is a smaller thing than the plan's *"registered battery … that survived a non-author attack"* implies, and it
   is still worth having — **a count against a sealed key is the room's one real exterior, and it arrives whether
   or not it is welcome.**

**IF THE GATE DOES NOT FIRE,** the table is reported with the guess rate beside it, the §5 rotation falsifier still
stands unrun, and §5's cheaper half — the correlation against §1's census, with its timestamp — is reported beside
the table **every time**, as the registration requires.

**One thing this design cannot buy at any price, said plainly:** §5.2's channel means a gate that does NOT fire is
weaker evidence than it looks. It says no scorer *formed* the belief; it does not say the channel was absent.

---

## 7 · CORRECTIONS, INCLUDING TO MYSELF

- **My going-in expectation was wrong and is withdrawn.** I held, before measuring, that "house style cannot be
  removed at all — the pane-level form of A's uptake finding". **At the grain of function words and punctuation it
  is at chance (3/6, p = 0.32; 2 of 18 non-degenerate markers, below chance).** The unremovable channel is length
  rank and self-citation, not style. The claim is replaced, not softened.
- **My first seat-name probe was wrong and its numbers were wrong.** I reported `seat name 276 hits / 38 files`
  and `scribe 17`. The probe used bare substring and `\b` matching, so `MAIN` matched `main.rs`, and `scribe`
  matched inside `described`. Re-run with `(?<![\w-])…(?![\w-])`: **librarian 98 in 22 files, keeper 158 in 30,
  scribe 0, MAIN standalone 1, "main" as code/branch 297.** The 276 figure is withdrawn.
  **The lesson is one I already recorded on 2026-09-15 and repeated anyway** (map E.md, mutant Y6: *a test whose
  inputs are all the same failure cannot tell which guard held*) — a probe that cannot distinguish its own false
  positives measures nothing. I caught it because the numbers were implausibly large, which is luck, not method.
- **And the seat names are the wrong thing to remove anyway.** `librarian` and `keeper` name OTHER seats. A pane
  writing "the keeper asked" reveals nothing about which pane it is. **`chair` is on the arm-word list and is
  removed; `keeper` was deliberately LEFT OFF** (arm-words.txt header: *"both arms receive the keeper quote"*) and
  that decision is still right for a pane blind. **No new rule is proposed for seat names.** Only `chair-side` and
  other hyphenated compounds survive (1 hit in 1 file), which is below the cost of a rule.
- **I did not classify the 31 lower-case callsign hits** into seat uses versus English/shell uses, so P3 ships with
  a fixture that counts them rather than with my recommendation.
- **The registration's census is already stale** (B 11 → 12) and §5's correlation is computed against it. Recorded
  in §0 rather than silently re-derived.

## 8 · WHAT THIS DOES NOT ESTABLISH

- **Nothing here is a fact about A, B, C or E.** Every number measures the redaction over already-committed texts.
  I scored no pane and ran nothing against one.
- **§5's finding rests on n = 2 briefs and 3 panes, and E is not among them** — there is no same-brief text by E in
  the room. The length-rank result is a 1-in-6 coincidence away from nothing, twice.
- **A crude stylometer is a weak attacker.** Function words and punctuation are not what a model reads. An LLM
  scorer attends to argument shape, what a text chooses to measure, which failures it volunteers, and how it
  stops — **none of which is in my feature set.** §5.1's null says *that* instrument found nothing; it does not
  say a scorer will. **This is the strongest reason the gate must be run rather than predicted, and it cuts
  against my own §5.1 result.**
- **No scorer has ever seen a redacted text.** A's §5 said it on 2026-09-15 and it is still true tonight.
- **The click figures in §4.2 are brackets, not measurements**, until §4.3 is run.
- **Injection of full hand-backs is unmeasured** at 18 KB, and the only datum is that a constant delay failed at
  3.7 KB.
- **I did not measure whether a board row can be edited after posting**, so S3's second carrier is unverified.
- **P1–P4 and E1–E2 are written, not built.** No code was added to the repo; nothing was installed; `redact.js`
  and `arm-words.txt` are untouched and re-hash to their §8.11 values. My scripts are in my scratchpad
  (`leakcensus.js`, `style.js`, `markers.js`) and a builder should rewrite rather than ship them — especially the
  answer-line classifier in §4.1, which is a proxy I invented for one estimate.
- **The degenerating clause applies to this design too.** P1–P4, E1–E2, G-ID/G-LINK, the 0.625 gate and S1–S4 are
  registered here, BEFORE any score exists. **If any of them is changed after the first score is seen, §6 voids
  the run.** I would rather these be attacked tonight than amended later.
