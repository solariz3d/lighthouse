# REGISTRATION · THE PANE BATTERY — six tasks, one brief, a sealed prediction

**Written by the CHAIR on L, 2026-09-16, committed 03:28:40, as the design lap's P-BATTERY-REG. Nothing runs against a pane
tonight.** Plan: `loop/plan_pane_battery_2026-09-16.md` (8360b4c). Door: the keeper, 2026-09-11 23:31, verbatim —
*"we arent telling a pane what they are good at, i think the plan was to create tests for each pane and see who
excels in what"* — and his go at 03:20 tonight, *"lets do it."*

**Status: DRAFT until B's attack (`P-BATTERY-ATTACK`) has run and the chair has re-ruled whatever B finds. The header
says REGISTERED with a sha only after that, and the RUN is a separate lap on a fresh shift.**

---

## 0 · THE CHAIR'S STAKE, first, because this measures the chair

**This battery measures the chair's dispatch habit, not only the panes.** The chair has matched seats to work by
demonstrated strength from its own window for weeks; `librarian/DOSSIER.md` exists because that window compacts. If
the battery finds that the pane the chair sends build work to is not the pane that builds best, the finding is about
the chair.

**The pull, named before the numbers exist:** the chair would rather the table confirm its habit. The defences are
that the chair writes no task key it also scores, scores nothing, and seals its prediction below before any pane runs.

**Second stake, C's kind:** the hand-back census below is the chair's own dispatch record. A pane with 14 hand-backs
has 14 because the chair sent 14. **The census describes what each pane was ASKED to do, never what it is good at**,
and it is used here only to choose WHICH KINDS of work the battery contains — never as evidence about any pane.

## 1 · THE CENSUS THE TASKS COME FROM, re-derived, with its command

    cd exo_memory/handback
    for L in A B C E; do echo "$L $(ls | grep -Ec -- "-${L}_2026-09-(0[2-9]|1[0-6])")"; done

    A 14 · B 11 · E 9 · C 7        (2026-09-16 03:3x, on L; 164 files in the directory in all)

The plan's figures (A 11 · B 10 · E 9 · C 7) were taken before tonight's four hand-backs landed. **Both are right at
their own moment; this one is the one these tasks were chosen against.**

The kinds visible in those filenames — build, read/contest, research, measure, preflight/defect-catch — are the five
the room actually runs. The sixth task is the role the room keeps needing and has no standing pane for.

## 2 · THE SIX TASKS

Every task is real work from the open queue, not a puzzle. Each names what EXCELS means as a number with a
denominator, and what scores it. **No task may be scored by the seat that dispatched it, and no task is scored by
its own author.**

    T1  BUILD WITH TESTS
        The work: a named small defect, red first, with tests and mutants on a copy.
        EXCELS:   mutants caught / mutants applied, with NOT APPLIED reported separately and never counted as a pass.
        KEY:      the mutant list, committed before dispatch, with the anchor each one sits on.
        TIE:      fewer lines touched outside the named files.

    T2  CONTEST A TEXT
        The work: a committed document with defects planted by a seat that does not score it.
        EXCELS:   planted defects found / defects planted.
        KEY:      the sealed defect list, sha committed before dispatch.
        REPORTED BESIDE IT, never inside the score: false positives, and real defects found that were NOT planted
        (the 09-15 case: B found six blocking items nobody had planted; that is the outcome this battery must not
        punish).

    T3  FIND PRIOR ART
        The work: a question whose answer exists on disk in files the pane has never been sent.
        EXCELS:   paths found / paths in the sealed answer key, each as path:line.
        KEY:      the librarian's own retrieval of the same question, committed before dispatch, by a seat that does
                  not score.
        REPORTED BESIDE IT: paths returned that are NOT in the key and DO bear on the question — the key is a floor,
                  not a ceiling, and a pane that beats the key must not score as wrong.

    T4  MEASURE AND REPORT
        The work: a number the room does not have, from an instrument the pane writes or runs.
        EXCELS:   does an independent re-run by another seat reproduce it to the stated precision — 1 or 0 — and
                  how many of the pane's reported figures carry a command that reproduces them (figures sourced /
                  figures reported).
        KEY:      the re-run, by a seat that did not dispatch and did not measure.

    T5  CATCH A PLANTED DEFECT IN RUNNING CODE
        The work: a working tree with N planted defects, on a copy, never the live checkout.
        EXCELS:   caught / planted, with time-to-first-catch recorded and NOT scored.
        KEY:      the plant list, sha committed before dispatch.

    T6  SCORE BLIND — the role the room has no pane for
        The work: label a set of texts against a numbered claim list, blind to author, per §8.10 K2's rules.
        EXCELS:   per-label agreement with the second scorer, and the arm-guess rate (LOWER is better; ≥ 0.75 means
                  the blind failed, and that is a finding about the REDACTION, not about the pane).
        KEY:      the second scorer's labels. **Neither scorer is the dispatcher; neither wrote the texts.**

**Every pane runs every task.** A pane that declines a task, or stops on it under the §6 rule, is recorded as STOPPED
with its reason and is not scored 0 — a stop is a legitimate answer in this room and must not be priced as failure.

## 3 · ONE BRIEF, NO ROLE WORDS (bar 2)

Each task's brief is a single text, sent verbatim to every pane, differing only in the hand-back path. Before
dispatch the brief is run through `dev/diversity/redact.js` with `dev/diversity/arm-words.txt` extended by a
**role-word list committed with the brief**: build, builder, read, reader, research, measure, scorer, adversarial,
strength, excels, battery, and every pane letter and seat name. **A brief that names the kind of work as a ROLE
tells the pane what it is for, which is exactly what the keeper's sentence forbids.** Naming the work is allowed;
naming a pane's nature is not.

The panes are told: this is a real task, the answer may be that it should not be done, and a stop is an answer.
**They are not told a battery is running.** That is not deception about stakes — every task is real work the room
wants — and it is the only way the number means anything. It is registered here so nobody discovers it later.

## 4 · THE SEALED PREDICTION

**Written before any pane runs, in its own file, committed before dispatch:**
`loop/pane_battery_prediction_2026-09-16.md`, sha256 `8bf0b5eecc2c51967a70801eea3bdbefca9790a85e061e31ecb668c51e8f4894`, committed at the same commit as this file and before any dispatch.

It names, per task, which pane the chair expects to win and by roughly how much, plus the one result that would most
surprise the chair. **The point is that the table can embarrass the chair, in public, with its prediction already on
disk.**

## 5 · THE FALSIFIER FOR THE BATTERY AS AN INSTRUMENT (bar 3)

**Registered before the run, and it is about the instrument, not the panes:**

    If a RERUN with the seats rotated — the same six tasks, each pane taking a task another pane held, same briefs,
    same keys — reorders the table on more than one task, the battery measured POSITION (who sits where, what a
    pane's context holds, what it was last sent) rather than PANE. The table is then withdrawn, not adjusted.

And the cheaper half, checkable without a rerun:

    If a pane's score on a task correlates with how many hand-backs of that KIND the chair has already sent it
    (§1's census), the battery may be measuring the chair's habit reflected back. Report that correlation beside
    the table every time.

## 6 · DEGENERATING, named in advance

**Any change to a task, a key, a threshold or the brief after the first score is seen voids the run and starts a new
registration.** Adding a task after seeing a table is the same act as changing one.

And the abuse condition this room requires of any progressive claim: *"the battery just needs more tasks"* is what a
degenerating battery says. If two consecutive runs produce no table that survives §5, the battery is reported dead
rather than widened.

## 7 · WHAT THIS CANNOT SEE, said now

- **n = 1 per pane per task.** Six numbers per pane is not a profile; it is six numbers.
- **The panes are not fresh.** Each carries its own map and capture tail — that is the room they work in, so it is
  the right population, but it means a score is of a pane-in-its-context, never of a model.
- **Every task is chosen from work the room already wanted done.** That keeps the tasks real and guarantees the task
  set is shaped by what this room does.
- **A ceiling is possible.** If every pane passes a task, that task measured nothing (run 1's lesson, 2026-08-16).
  Report it as a ceiling rather than as four ties.
- **The scorers are seats too.** T6 exists partly because the room has no unconflicted scorer and keeps discovering
  it at the moment one is needed.

## 8 · WHAT THE SCORE IS FOR, and what it must never become

A score lands in `librarian/DOSSIER.md` **as a citation to the run's file**, never as a sentence about a pane's
nature. `TRAINING.md:15-17` (F2) forbids wiring such a document into a pane shell: *a pane that wakes knowing them
is a pane whose numbers are dead.* The battery exists to make dispatch answerable to a record instead of to the
chair's memory — and to be able to say, with a number, when the chair's habit was wrong.

---

## 9 · AMENDED AFTER B's ATTACK — 2026-09-16 03:5x, all six accepted, one of them corrected (`handback/p-battery-attack-B_2026-09-16.md`, landed 942640f; re-derived by the librarian at bbbe17f)

**B's verdict: NOT REGISTRABLE AS WRITTEN, and the object is worth building.** Six findings, every one before any
data exists, which is the only time they are cheap. The header stays DRAFT.

    A1  THE ATTACKER IS NOT A SUBJECT (B's F-A, and the assignment was the librarian's, filed as its miss).
        B has now read "T2 B wins" and "T5 A narrow over B". ACCEPTED: B is out of T2 and T5, every remaining B
        cell carries the contamination note, and "not a subject of the run" joins "not the dispatcher, not the
        author" on every scoring line. T2 and T5 need a subject that has not read the prediction; the L039/L045
        shape (one brief, three panes, a non-planter scoring blind) is the model.
        A,C,E made 0 Read calls against the prediction — but the [panes] digest put its PATH in front of E three
        times and C once, so "did not open it" is the strongest claim available and it is not "was not exposed".

    A2  THE SEAL IS A TIMESTAMP SEAL, NOT A SECRECY SEAL — and the chair CORRECTS the amendment it was handed.
        B and the librarian asked that the plaintext leave the checkout, leaving only the sha. **That would be
        theatre: the file is already committed at 0a54c5a, so git history hands the plaintext to anyone with this
        repo, and deleting the working copy changes nothing except what a casual `ls` shows.** RULED instead:
        - the prediction stays where it is, and this registration states plainly that its CONTENT is recoverable by
          anyone who can read the repo;
        - what the commit buys is that the prediction cannot be CHANGED after a score is seen — that is the whole
          claim, and it is worth making honestly rather than dressing it as secrecy;
        - secrecy, where it matters, is enforced operationally: a scorer is a fresh pane with no repo and no digest,
          per §8.9, and a subject that has read it is out of that task (A1);
        - **B's F-C stands and is fixed now: 0a54c5a was not on origin.** A prediction witnessed only by the machine
          that wrote it is sealed against nobody. It is pushed in the same act as this amendment, and NO TASK IS
          DISPATCHED BEFORE THAT PUSH.

    A3  QUIET DOES NOT BLIND THE PANES (B's F-B). `board-digest.js` runs on UserPromptSubmit for every seat on L and
        reads each pane's transcript, so a pane can see another pane's work whatever the board phase says.
        ACCEPTED: the digest is unregistered for a short, dated battery window — the keeper's hands, his machine —
        and every task carries a per-cell leak check: grep the pane's transcript for that task's exact paths; a hit
        VOIDS the cell rather than scoring it.

    A4  TEST–RETEST REPLACES ROTATION (B's F-D). §5's rotation contradicted §2's "every pane runs every task" —
        with all four panes on all six tasks there is nothing to rotate, and the census correlation cannot fire at
        n = 4. ACCEPTED: the instrument falsifier becomes a SECOND TASK OF THE SAME KIND to the same pane. If a
        pane's two same-kind scores disagree by more than the gap between panes, the battery measured the task, not
        the pane. §5's rotation clause is struck and this replaces it.

    A5  A CEILING VOIDS A TASK, WITH X NAMED BEFORE DISPATCH (B's F-E). ACCEPTED: for each task, the score at which
        every pane passes is written down before the task is sent; if every pane reaches it, the task is reported
        VOID — it measured nothing — and is not re-scored into ties. T4's figures-sourced is at ceiling by
        `COMMITTEE.md`'s own rule (every hand-back must carry its commands), and T6 scores a PAIR rather than a
        pane. Both are fixed before the run or dropped from it; a task that cannot state its ceiling does not ship.

    A6  THE EXTRAS GET A NUMBER OR THE SENTENCE GOES (B's F-G). §2 says a pane that finds real defects nobody
        planted, or paths beyond the key, must not be punished — and then ranks on the planted fraction anyway.
        ACCEPTED: unplanted-find and beyond-key are a SECOND SCORED NUMBER with their own denominator and a named
        adjudicator who is not the dispatcher, the author or a subject. If that cannot be built, the sentence is
        withdrawn rather than left as a kindness the ranking contradicts.

**And one number of the chair's is corrected by C, mid-lap:** the census B count is **12, not 11**. §1's figure was
the chair's and it was wrong; C's re-derivation is the citable one, and it changes nothing about which kinds of
work the tasks were chosen from.

**Still DRAFT.** A1's replacement subjects, A5's ceilings and A6's second number are design work that has not been
done. The run remains a separate lap on a fresh shift.
