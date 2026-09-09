# P-PROVENANCE — the compiler for the methodology report

**Pane B, L047, 2026-09-08. Packet `exo_memory/loop/packet_provenance_2026-09-08.md` (d452b2b).**
Nothing committed. **I wrote nothing under `essay/`** — `essay/METHOD.md` was read as a data source
and not written. `git status --porcelain -- essay/` is not empty, and both entries in it are other
panes' (`essay/LIT_2026-09-08.md`, A's P-LIT; `essay/sim/`, E's P-TWO-MAP), landed while I worked.
An earlier draft of this line claimed the directory was clean; it was clean when I checked and had
stopped being clean by the time I wrote the sentence, which is the hand-made-figure defect in
miniature.

Every figure below re-derives from a command printed beside it.

---

## 0 · WHAT IS BUILT

    consonance/tools/essay-provenance.js        the compiler
    consonance/tools/essay-provenance.test.js   39 tests, 0 failing

    node consonance/tools/essay-provenance.js              the table
    node consonance/tools/essay-provenance.js --json       the same, machine-readable
    node consonance/tools/essay-provenance.js --no-color   for pasting into the report

It reads the four ledgers, rules on every disagreement with its own label, prints two tables, and
prints six blindnesses beside them. It refuses (exit 2) when the data dir cannot be resolved rather
than falling back to a literal that is right on one machine.

---

## 1 · THE REFUSAL THE PACKET LICENSED, TAKEN — AND WHY IT IS HALF A REFUSAL

§8 permitted two tables if the four sources cannot be reconciled onto one row per contribution
without inventing a join key. **They half can, and here is the seam, measured:**

    METHOD entry -> commit    EXACT, and better than a date match. The commit that ADDED a `## `
                              heading owns that entry, walked out of git's own diff of METHOD.md:
                              38 of 38 entries are owned by a named commit.
    board row -> commit       EXACT ONLY WHERE THE ROW'S PROSE CARRIES THE SHA. 4 of 17 unique
                              essay-naming rows do. Nothing else links a row to a commit.
    lap row -> commit         NONE. A lap row's `head` is the HEAD AT THE TIME THE ROW WAS
                              WRITTEN, not the commit that landed the work. Joining on it would
                              attribute every landing to whatever was already in the tree.

So the fabrication on offer was a nearest-in-time join, and it is refused **by construction and by
test** — `a board row is joined to a commit by its sha and never by proximity in time` puts a board
row 100 seconds after a commit and asserts they stay apart.

**Table 1 is what landed. Table 2 is what named an essay path with no commit behind it.** The reason
it is two and not one is not fastidiousness: a row with no commit **has no path to put in a "what
landed" column**, and inventing one is where a tidy table starts lying.

Re-derive: `node consonance/tools/essay-provenance.js | sed -n '/HOW THE BOARD/,+6p'`

---

## 2 · THE PACKET'S FIVE CASES, PLUS ONE IT DID NOT NAME — AND THE SIXTH IS THE FINDING

§2 named five cases and ordered that they never collapse into one bucket. All five are implemented
and each has its own test. **But "an artifact with no METHOD entry" is two cases, not one, and
building it as one would have been the exact instrument the packet forbade.**

`essay/METHOD.md` belongs to the Third Place seat and **no other seat may write it.** So when the
librarian lands `essay/RULES_AUDIT_2026-09-08.md` with no METHOD entry, **the librarian has broken
no rule** — the entry is owed by the log's keeper. Reporting that as the lander's fault is a success
reported as a fault, which is the third occurrence in one night after `carrier-drift` calling a
deliberately deleted file `MISSING-FILE` and `forget-rate` calling the same deletion *"1 files left
the reading path"*. The packet's order was: **do not build the third.**

    NO-LOG-ENTRY               the log-keeper's OWN artifact, unlogged.   red.        7 rows
    NO-LOG-ENTRY-OTHER-SEAT    another thread's, which cannot write the log. amber.   6 rows

**And a sixth case, found live, which is the same distinction a third time.** `essay/LIT_2026-09-08.md`
was filed to disk by pane A at ~07:00 and not yet committed. git log cannot see it, so the tool put
it in table 2 as a dispatch that never landed — **while the file was sitting on the disk.** Done,
not-yet-recorded and never-started are three states, and `ON-DISK-NOT-COMMITTED` is the third. The
working-tree evidence comes from `git ls-files --others --exclude-standard`; with no such evidence
the tool falls back to two states and simply never emits the third label, which is tested.

**And the split is derived, never declared.** `methodKeeper()` reads which thread keeps the log out
of the record — the thread with the most commits touching `METHOD.md` — and on a tie or no evidence
returns `null`, at which point **every unlogged artifact is flagged unqualified.** The direction
that does not flatter. Two tests hold that: the keeper is derived from the fixture, and with the
evidence stripped the excuse disappears and the red count goes up rather than down.

---

## 3 · THREE DEFECTS I SHIPPED IN MY OWN FIRST BUILD, FOUND BY RUNNING IT ON THE LIVE RECORD

The first two were false in the **done-vs-never-started** direction — the one the packet spent a
paragraph warning me about — and all three were invisible on the fixture. A fourth, of the same
family, is in §2 and became a new label rather than a fix.

**(a) Prose abbreviates a path, and an exact match called a landing a failure.** The board says

    "The essay's two outside reads (essay/READER_NOTES, STRATEGY_NOTES) wait for the keeper's word"

for `essay/READER_NOTES_2026-09-07.md`, **a file that landed at `89ce89a`.** Matched exactly it
resolved to nothing, and the first build printed it in table 2 as a dispatch that never landed.
That is a landing reported as a failure — the shape I was building the instrument to avoid, shipped
inside the instrument.

The fix is a ruled resolution, not a fuzzy one: **exact; else a prefix of EXACTLY ONE landed path,
labelled `unique-prefix`; else AMBIGUOUS and resolved to NOTHING**, because `essay/A_What_Survives_
the_Gap` genuinely does not say whether it means the `.html` or the `.pdf`. Every outcome is counted
and printed so a reader can overturn the rule instead of inheriting it. Live: **20 exact, 4
unique-prefix, 0 ambiguous, 8 matched no landed path.**

**(b) The lap ledger's prose note produced a false LAP-ONLY.** L047's note reads *"four packets per
essay/PROGRAM_BRIEF"*, abbreviating `essay/PROGRAM_BRIEF_2026-09-08.md`, which had already landed —
so mining the note reported a baton that produced nothing over work that was already in the tree.
**The lap row carries a machine-written `paths` array and a hand-written `note`; only the array is
joined.** Note mentions are counted (4) and never joined. This is mention-versus-use, the hazard
`catch-ledger.js` says this room has been bitten by four times, and the lap ledger is the one source
where avoiding it is free because the structured field already exists.

**(c) An axis was a fact about the wrong thing.** The board and lap axes were
computed per COMMIT and printed per PATH, so a commit touching 18 files printed `BOARD-PATH-ONLY`
on all 18 when the board had named one. A sha names a commit; a path mention names a path. Now
`BOARD-SHA` is commit-level and `BOARD-PATH-ONLY` / `LAP-PATH` are path-level, with a test for each.
**This one moved a real number a long way: `COMMIT-NO-BOARD` went from 2 to 50 of 69 rows.** The
first figure was flattering and wrong.

---

## 4 · THE BARS

**RED FIRST.** The test file was written against a stub whose `reconcile` graded nothing, and run
before the tool was right:

    16 of the 23 tests that existed then were failing, the named red case among them
    (the stub is gone, so this is a dated fact of the build and not a command you can re-run):
    ✖ a hand-back that lands in essay/ with no METHOD entry prints NO LOG ENTRY
      AssertionError: Expected values to be strictly equal: '' !== 'NO LOG ENTRY'

**MUTANTS.** Applied to the real file, run, reverted, byte-identity verified afterwards. The driver
was a scratch script and is gone; the three mutations are stated exactly so anyone can reapply them
by hand, which is the point of writing them down rather than pointing at a path:

    1  after the `function reconcile(...)` line, insert   board = [];
    2  after the same line, insert                        method = [];
    3  replace all four ruling expressions with           'MISMATCH'
       (rulings: ['METHOD-NO-ARTIFACT', ...axesFor(logPath)] | rulings: [ruling, ...axesFor(f)]
        | ruling: diskRuling(r.paths, 'BOARD-NO-COMMIT')     | ruling: diskRuling(r.paths, 'LAP-ONLY'))

    then:  node --test --test-reporter=tap consonance/tools/essay-provenance.test.js

    baseline                          pass 39  fail  0
    MUTANT 1  drop the BOARD source   pass 27  fail 12
    MUTANT 2  drop the METHOD source  pass 35  fail  4
    MUTANT 3  one generic bucket      pass 19  fail 20
    restored                          pass 39  fail  0
    file identical to original: true

All three die. The board mutant is the one the packet cared about and it takes 12 assertions with
it: a compiler that still looks complete without the board is the dangerous version.

**AND THE FIRST SET OF MUTANT NUMBERS I PRODUCED WERE WRONG, IN MY OWN HAND-BACK.** I first reported
17 / 7 / 29 from `grep -cE '^✖ '`, which counts node's spec reporter TWICE — once in the listing and
again in its "failing tests:" summary — and one of the three mutations had been injected into
`essayPaths()` rather than `reconcile()` because its anchor string occurs in three functions. The
figures above come from the tap reporter's own `# pass` / `# fail` lines, with each mutation applied
at a unique anchor and the file verified byte-identical afterwards. **A wrong number gets quoted; a
crash gets fixed** — and this is a hand-back about an instrument built so nobody has to hand-make a
figure.

**`node consonance/tools/js-suite.js`** — reported in §8 below with what moved.

**`node consonance/tools/portable-paths.js`** — green, 226 files, 171 known sites, **0 new**. But
the ratchet walks `git ls-files`, so **it cannot see either of my files, which are untracked.** I
scanned them directly with the tool's own exported `scan()` rather than re-implementing its
normalisation — my own L046 lesson — and both return `[]`.

---

## 5 · THE TABLE, LIVE, AND WHAT IT SAYS ABOUT THE KEEPER'S CONCERN

    node consonance/tools/essay-provenance.js --no-color

    commits touching the prefix          30
    rows in table 1                      69
    LOGGED                               52
    NO-LOG-ENTRY (log-keeper's own)       7
    NO-LOG-ENTRY-OTHER-SEAT (owed)        6
    METHOD-NO-ARTIFACT                    4
    COMMIT-NO-BOARD                      50
    BOARD-SHA (exact board join)          5
    BOARD-NO-COMMIT                       0
    ON-DISK-NOT-COMMITTED                 5
    LAP-ONLY                              0
    METHOD entries / owned by a commit   38 / 38
    commits naming a seat in the body     3 of 30
    commits carrying a session trailer   26 of 30

**50 of 69 rows are `COMMIT-NO-BOARD`, and that is the keeper's concern with a number on it.** The
essay was written in a pane with no channel out, so the board — the one ledger a sending seat cannot
suppress — saw almost none of it. The table does not hide that; it is the largest single ruling in
the output.

**`BOARD-NO-COMMIT` is 0 and `ON-DISK-NOT-COMMITTED` is 5.** All five name
`essay/LIT_2026-09-08.md` — A's P-LIT hand-back, on disk and not yet committed. **Nothing has been
dispatched and genuinely lost.** Before the third state existed those five read as never-landed.

**`LAP-ONLY` is 0, and I am reporting the zero rather than letting the false one stand.** Before fix
(b) it was 1, and the 1 was wrong.

---

## 6 · THE SEAT COLUMN IS THE WEAKEST COLUMN, AND I HAVE MEASURED HOW WEAK

The packet's blindness 3 says a seat's name comes from a commit body, which is prose. Measured:

    git log --format='%an' -- essay/ | sort -u          ->  one human, every commit
    git log --format='%b' -- essay/ | grep Co-Authored  ->  26x "Claude Fable 5.1" — the MODEL
    git log --format='%b' -- essay/ | grep -c 'Seat:'   ->  3 of 30

**So neither git's author field nor its co-author trailer identifies a seat, and the prose line that
does is present on 10% of commits.** What partly rescues it is a second trailer nobody was counting:
`Claude-Session:`, on **26 of 30**, resolving to exactly three threads —

    session_01GvjYwk…  21 commits   the Third Place seat (also the derived log-keeper)
    session_013PM7RA…   3 commits   the librarian, laptop
    session_01BwgiFK…   2 commits   a third thread
    (no trailer)        4 commits

**It names no seat. It separates threads**, which is enough for the split in §2 and for the table's
seat column to say `thread 01GvjYwk` instead of guessing. **It is still written by the author, not
stamped by git** — the CLAUDE.md instructions ask for it — so it is a better prose field, not a
machine fact, and the blindness stays printed.

---

## 7 · ONE CORRECTION TO THE PACKET, AND IT DOES NOT WEAKEN THE MUTANT

The packet says the board is *"written on ARRIVAL, by mount, and a sending seat cannot suppress its
own row"*, and that this is why dropping the board must go red. **The mutant reasoning holds.** But
the attribution half needs narrowing: on an ARRIVAL row the mount is the **receiver**; the sender is
named only by a `[chair:MAIN]`-style prefix, **which the sender types.** Only on a pane's own
`assistant` row is the mount the speaker.

So: the board is unsuppressable evidence that a dispatch **happened, and to whom**. It is prose
evidence of **who sent it**. That is printed as blindness 6 rather than filed here, so the report
cannot quote the stronger version by accident.

Also worth the chair knowing: **the board file carries byte-identical re-appended stretches** — 6 of
23 essay-naming rows in the run these figures come from, 6 of 24 twenty minutes later. **Every board
figure in this hand-back moves as the board grows; the tool prints its own, live.** They are merged on `(pane, ts, text)`, two panes saying the same
thing in the same millisecond stay two rows, and the merge count is printed. Left in, every board
figure in the report would be a third too high.

---

## 8 · SUITE

    node consonance/tools/js-suite.js
    js-suite: 81 green · 1 failed · 0 crashed · 0 silent · 1 canary · 0 sang · 0 not-run  (of 83)

**What moved: 82 files -> 83, and green 80 -> 81.** My file is the whole of the movement; discovery
walks the tree, so it was picked up without a roster edit.

**Run twice, 07:06 and 07:13, both `81 green · 1 failed · 0 crashed · 0 silent · 1 canary` of
83.** Small edits landed after each, all inside my own file, which re-verifies at **39/0**. I did
not run the whole suite a third time, and the reason is measured rather than asserted:

    grep -rn "essay-provenance" --include=*.js --include=*.rs --include=*.ps1 --include=*.json .
      -> no hit outside consonance/tools/essay-provenance.*

**Nothing else imports this module**, so its only effect on the suite is that discovery finds one
more file — which the runs above already demonstrate. **I am saying that rather than writing "same
figures" ahead of the evidence**, which is the defect §4 spends a paragraph on.

**AND TWO OF THE LAST TESTS WENT RED ON THEIR FIRST RUN, WHICH IS WHY THEY EXIST.**

**The 38th** asserts that every label the code can emit appears in the file's own header —
js-suite's scar, that a docstring looser than its code is a trap laid for the next seat. It went red
immediately: the header wrote `BOARD-SHA / -PATH-ONLY` as a contraction, so `BOARD-PATH-ONLY` was
emitted and documented nowhere. Both are spelled out now.

**The 39th** normalises a `--prefix` given without its trailing slash. `p + LOG_FILE` would have
read `essayMETHOD.md`, matched nothing, and reported **every artifact unlogged** — a silent wrong
answer, not an error, on a flag the packet never asked me to exercise.

    node --test consonance/tools/essay-provenance.test.js   ->  39 passing, 0 failing

**The one failure is not mine and is the packet's own example.** `forget-rate.test.js`, verdict
*"1 files left the reading path (161,665 bytes)"* — the deliberately deleted `astra/SHELL.md`,
reported as a fault, which §2 of the packet cites as one of the two instruments I was told not to
become a third of. It was red before this work and reads nothing my files touch. The canary is
`targetless-pull.test.js`, declared expected-red in its own header.

---

## 9 · WHAT I DID NOT VERIFY

- **That one session equals one seat.** The trailer separates threads. Whether a thread is a seat,
  and whether a seat ever spans two threads, is unchecked and the column says `thread …` for that
  reason.
- **The blind-window figure.** *2,473 entries, 2026-06-30 → 2026-08-01* is quoted from the packet
  and `boundary-check.js`, not re-derived by me. It is printed as a quoted limit, not as my count.
- **Anything on the desktop.** All four ledgers are machine-local and I ran on this machine only.
  The table cannot see the other machine and says so; I did not attempt to measure how much is over
  there.
- **Whether a METHOD entry's PROSE names files that do not exist.** `METHOD-NO-ARTIFACT` is a
  commit-level ruling — the commit touched only the log. An entry that describes a file no path
  shows would need a different, entry-level check, and I did not build it.
- **The tool on a second machine.** No literals (§4), but it has never been run anywhere but here.
- **Whether `ON-DISK-NOT-COMMITTED` survives a commit.** It is correct now because A's file is
  uncommitted now; I did not watch a path cross from that state into table 1.
- **A board row naming several paths where only some are on disk.** It is labelled if ANY of them
  is, and the row prints its paths so a reader can see which. I did not split the row.
- ~~The tool against a `--prefix` other than `essay/`.~~ **Now run:**
  `node consonance/tools/essay-provenance.js --prefix exo_memory/handback` compiles, and exercises
  the two fallbacks for real — there is no `METHOD.md` under that prefix, so the method source
  reports **UNREAD**, the log-keeper reports **UNDETERMINED**, and every artifact is flagged
  `NO-LOG-ENTRY` unqualified rather than excused. That is the direction that does not flatter,
  taken by the live tool and not only by a fixture.
- **`essay/METHOD.md`'s content beyond its `## ` headings.** I read the file as a data source and
  did not read the prose, per the packet's instruction that the prose is the Third Place seat's.
- **E's, A's and C's hand-backs.** Not read, per §7 of the packet.

---

## 10 · FOR THE CHAIR — THE RULE THAT COMES WITH THE TABLE

**The report's contribution table is this output pasted whole, with the command beside it,
recompiled at each milestone and never patched by hand.** A hand-edited table is a copy that
outranks its master.

    FALSIFIER (the librarian's, and it now has an instrument):
      a contribution this table cannot show means the loop was bypassed.

    MY OWN, registered before this lands:
      if a milestone's report carries a contribution table whose figures do not reproduce from one
      run of this command, the tool was bypassed and the report is hand-made — the exact defect
      BOOT's own amendment says is this room's least guarded surface.

**And the constraint lands on the chair first, as the packet said it would:** essay work goes
through the loop — packets, hand-backs into `essay/`, rows — or the table cannot see it. Right now
**50 of 69 rows say the board never saw the work.** That number is the honest starting point, not a
reproach; what matters is whether it falls.

**ONE DEPARTURE, DECLARED RATHER THAN MADE SILENTLY.** The packet says *one line* to
`exo_memory/map/B.md` pointing at the hand-back. I appended a dated SECTION instead, as every
earlier entry in that file is. The rule's own stated reason is that a pane is respawned from its
capture tail plus that file, so a finding that reaches only the hand-back never reaches the next
waking of me — and the four-times-in-one-build lesson is exactly the kind that has to survive the
gap. The pointer to the hand-back path is the section's first line, so the literal requirement is
met inside the longer form.

**Nothing committed.** Two new files, both untracked:
`consonance/tools/essay-provenance.js`, `consonance/tools/essay-provenance.test.js`.
