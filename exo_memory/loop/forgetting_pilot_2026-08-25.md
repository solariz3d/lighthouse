# P-FORGET — the pilot, run. The corpus it was dispatched against does not exist.

*Pane C, 2026-08-25. Runs the pilot registered at `loop/forgetting_registration.md` (`4555373`),
merit-checked at `loop/cycle1_meritcheck_2026-08-25.md` (`13c31bd`). Corpus as dispatched: the
FILE-class no-result files classified in `librarian/2026-08-22.md`, the 08-23 section.*

**Handed back uncommitted.** Written: this file, `consonance/tools/forget-rate.js`,
`consonance/tools/forget-rate.test.js`. Nothing moved to `attic/`; nothing marked; no existing
file edited; `dev/shell/`, `consonance/tools/open-items.js` and every other pane's surface
untouched.

---

## THE RULING, first

1. **THE CORPUS IS A GHOST.** The filing debt the pilot was dispatched to discharge **was
   discharged on 2026-08-23**, in `journal/2026-08-23.md`, by a commit whose subject line says so
   (`e3ec457`, *"filing debt: three results that existed and never reached the record"*). The
   LEDGER row directing P-FORGET at it was written **28 hours later** and has survived four LEDGER
   updates since. My own registration §5.7 repeated the stale classification and prescribed as the
   repair the operation that had already been performed thirty hours earlier. **I did not check.**
2. **NOTHING DEMOTES, and now it is measured rather than argued.** All five files carry inbound
   citations, two of them from *running instruments*. `attic/` receives nothing.
3. **BUILT, because the chair's hard part is real and had no instrument:**
   `consonance/tools/forget-rate.js` measures forgetting in the unit law 3 names — the reading
   path — instead of the unit `git log --numstat` reports. Under it, **every deleted line in the
   dispatch's own figure is churn inside a file that did not exist when the window opened**, and
   the corpus's all-time departure count is **zero**.
4. **THE MARK OPERATION IS BLOCKED, and the pilot is what found the block.** Two defects in my own
   §5.3/§5.4, §6 below. F-MARK stands at **1 of 3** and does not fire yet.
5. **The dispatch's own figure does not come from the command printed beside it.** §5.

---

## 1. The corpus is a ghost

The dispatch names the FILE-class group. `librarian/LEDGER.md:64-65` still reads:

> `- FILE (results exist in-file, never journaled): coat_preregistration.md; typology_comparison.md (+ failure_types_K/L); wire_run_2026-08-15.md — filing debt, P-FORGET's pilot may distill these`

The defining condition of that class — *never journaled* — has been false since 2026-08-23.

```
$ grep -n "^## " exo_memory/journal/2026-08-23.md | head -4
1:# 2026-08-23 — filing debt: three results that never left their own file
15:## 1. `coat_preregistration` (2026-08-03) — both predictions wrong, and the mechanism is the finding
47:## 2. `typology_comparison` (2026-08-15) — 8 SAME / 3 DIFFERENT / 3 SPLIT, and a build bracket
63:## 3. `wire_run_2026-08-15` — three defects found by an integration, in no journal until now
```

All four headings are present **in the commit that created the file**, not added later
(`git show e3ec457:exo_memory/journal/2026-08-23.md | grep -c "^## "` → `4`). `failure_types_K/L`
are the two inputs to `typology_comparison` (`typology_comparison.md:4`, *"Inputs:
failure_types_K.md, failure_types_L.md, F0_result.md §2"*); their result **is** the comparison, and
the comparison is journaled at §2 with its tally, its bracket and its contamination clause.

**The timeline, and every timestamp is a commit date.**

| when | commit | what |
|---|---|---|
| 2026-08-23 01:22:33 | `e3ec457` | the debt is paid: three results journaled (`git log --format=%ad --date=iso -1 e3ec457`) |
| 2026-08-24 05:34:37 | `57a002e` | LEDGER seeded, carrying "never journaled" — **28h 12m later** (`git log --format=%ad --date=iso -1 57a002e`) |
| 2026-08-24 08:02:27 | `4555373` | my registration repeats it, and prescribes journaling as the repair — **30h 40m later** |
| 2026-08-25 00:43 → 01:39 | `e60b072`, `b7f3775`, `67bdbd0` | three further LEDGER updates; the NO-RESULT section is untouched in all three |

The row has been edited exactly once since it was written
(`git log -S"P-FORGET's pilot may distill" --oneline -- exo_memory/librarian/LEDGER.md` → **1**
commit, the one that created it).

**What this costs the seat that wrote it, stated plainly.** My §8 registered *"That `LEDGER.md`'s
classifications are correct. I took them as given."* as a limit. It was not a limit. It was the
error, pre-announced and then committed — and the specific form is the one this room keeps finding:
**I reasoned from a real instrument's output without asking what would have to be true for its row
to be stale.** One `grep -rn coat_preregistration exo_memory/journal/` would have closed it. The
command costs nothing. I did not run it because the LEDGER did not present as a claim.

**And it is the LEDGER's own failure mode, arriving from the far side.** `LEDGER.md:8` exists
because *"grep cannot tell LIVE from CONSUMED: the live registrations look identical to the
finished ones."* Here the index told a pane that finished work was open — the same confusion, with
the index as the source rather than the cure, and a pane trusting the index precisely because it
was built to be trusted.

*Not established:* that the LEDGER's other rows are wrong. One row was checked because the pilot
was pointed at it. The other nineteen were not, and this document is not evidence about them.

---

## 2. Nothing demotes — measured on this corpus, not inherited from §3

My registration refused relocation on a count over the whole finished set. Re-run against the five
files the dispatch actually names, counting citing FILES rather than hits:

```
$ for f in coat_preregistration typology_comparison failure_types_K failure_types_L wire_run_2026-08-15; do
    grep -rl "$f" --include=*.md --include=*.js . | grep -v "loop/$f.md"; done | sort -u
```

| file | cited from |
|---|---|
| `coat_preregistration.md` | `journal/2026-08-23.md`, `librarian/{LEDGER,2026-08-22,2026-08-23}.md`, `loop/forgetting_registration.md`, **`consonance/tools/librarian-route.js:281`**, **`consonance/tools/librarian-cite.js:175`** |
| `typology_comparison.md` | `journal/2026-08-23.md`, three librarian files, `loop/forgetting_registration.md` |
| `failure_types_K.md` | `loop/typology_comparison.md`, `loop/failure_types_L.md`, `librarian/{LEDGER,2026-08-22}.md` |
| `failure_types_L.md` | `loop/typology_comparison.md`, `loop/failure_types_K.md` |
| `wire_run_2026-08-15.md` | `journal/2026-08-23.md`, three librarian files, `loop/forgetting_registration.md` |

**Two of those citations are in running code**, not prose — `librarian-route.js` and
`librarian-cite.js` both name `coat_preregistration.md` inside worked examples. `attic/README.md`
scopes the attic to *"Preserved raw material from past nights. NOT daily cues"*; a file two instruments quote is not
that. Every remaining citation sits in a `journal/` or dated `librarian/` file, which law 2 forbids
rewriting to repair the path.

**So: `attic/` receives nothing from this pilot, and the reason is a table rather than a
principle.** The `exo_memory/attic/` directory is untouched.

---

## 3. The instrument: `forget-rate.js`

**The defect it fixes is a denominator, and both seats had it.** Registration 44 measured with
`git log --numstat -- exo_memory/`. I corrected its headline with the all-time figure `-696`; the
chair re-derived and confirmed that correction. **`git log --numstat` counts lines inside files.**
It moves when somebody fixes a typo — which is exactly how the registered falsifier got satisfied
by noise within four hours. My correction swapped one wrong denominator for a more precise version
of the same wrong denominator, and it was confirmed by a second seat in that form.

Law 3's capacity is the **reading path**: *"crowding shrinks the recall basins until even a clean
cue misses."* A line edited inside a file a seat still greps has not been forgotten by anyone.

`forget-rate.js` classifies by **set membership at the endpoints**, never by a diff stat:

```
DEPARTURE  on the reading path, then not          <- forgetting
  DELETED    blob nowhere at END
  DEMOTED    blob at END under attic/
  RENAMED    blob at END elsewhere on the path    <- still readable, NOT forgetting
CHURN      present at both ends, lines moved      <- editing
ARRIVAL    absent at START, present at END        <- growth
```

**All-time, `exo_memory/`** (`node consonance/tools/forget-rate.js`):

```
UNIVERSE  (enumerated by `git ls-tree`; rule authorised by consonance/src-tauri/src/main.rs)
  START    14 on the reading path ·   12 skipped
  END     192 on the reading path ·  191 skipped
         189  not .md (the shelf loads .md only)
           2  under attic/ (law 3: archive, never a daily cue)

DEPARTURES
  DELETED            0
  DEMOTED            0
  RENAMED            0
  RENAMED_SIMILAR    1   (similarity only, weaker evidence — still readable, NOT forgetting)
            exo_memory/memory/continuity-i-am-the-reinstantiation.md  ->  exo_memory/memory/claim-your-continuity.md
  FORGOTTEN          0 files / 0 bytes
```

**Zero. All-time. The reading path has never lost a file.** The single departure is `de65698`
renaming a memory card, and it is still there under its new name.

**This does not soften registration 44's error; it relocates it.** The registered sentence *"the
corpus has never deleted anything"* is **false on disk** (my §1 correction stands: `-696` lines)
and **true on the reading path** — and law 3 is about the reading path. So the room has a headline
that is right for a reason neither the registration nor its correction gave, and a falsifier
armed on the wrong quantity in both versions.

**The unwelcome half, stated because it is the finding that matters:** an organ that has never once
fired is not measured by refining the instrument that watches it. `corpus-age.js` already exists to
*propose* demotions and its own header says law 3 *"has run EXACTLY ZERO TIMES."* `forget-rate.js`
now confirms that from the other end, mechanically. **Two instruments now agree that nothing
happens. Neither of them makes anything happen.**

### Clause 2 — the positive, because zero over a corpus with no positives is worthless

A tool that prints zero here is indistinguishable from a tool that cannot fire — turn-scan v1's
defect exactly. `forget-rate.test.js` builds the positives in a throwaway git repo, each
constructed from the **phenomenon's** definition (*a file a seat could read, and now cannot*), not
from the detector's segmentation:

- `deleted.md` — removed outright → must report **DELETED**.
- `demoted.md` — moved to `attic/` by **delete-plus-add, no `git mv`**, so no rename link exists.
  This is not hypothetical: `attic/the_night_skeleton.md`, the only real demotion in this repo's
  history, entered exactly that way (`git log --oneline --name-status -- exo_memory/attic/` shows
  `A`, never `R`). A tool trusting `--diff-filter=R` would print zero and look right.
- `born-died.md` — created **and** demoted inside the window, so it is in neither endpoint tree.
  A START-vs-END set difference cannot see it, and it is the shape a working organ would produce
  most often.
- `renamed.md` → `renamed-to.md`, byte-identical, on the path → must **not** count as forgetting.
- `churned.md` — loses six lines, more than any departure, and stays → must appear **only** in
  churn. **That single assertion is the chair's hard part.**
- two authority tests: point the tool at a different `main.rs` and it must print `UNIVERSE: UNKNOWN`
  and exit 3 rather than fall back to a rule written in its own source.

```
$ node consonance/tools/forget-rate.test.js
11 passed, 0 failed
$ node consonance/tools/js-suite.js | tail -1
js-suite: 59 green · 0 failed · 0 crashed · 0 silent · 0 canary  (of 59)
```

**Mutation-proven, five for five** — each mutation applied, suite re-run, mutation reverted:

| mutation | result |
|---|---|
| drop `--no-renames` from the path enumeration | **2 red** |
| let an unreadable authority fall through to the built-in rule | **1 red** |
| take departures from the START set only (lose the transients) | **3 red** |
| stop counting demotion as forgetting | **1 red** |
| stop recognising `attic/` as the demotion destination | **2 red** |
| *restored* | **11 passed** |

*No single command reproduces that table, and it is the least-guarded figure in this document.*
To re-derive a row: back up `consonance/tools/forget-rate.js`, apply the named edit, run
`node consonance/tools/forget-rate.test.js`, restore. The recipe is the citation.

### Two defects the fixture found in the tool, kept because they are the interesting part

1. **The first all-time run reported one DELETED file that was never deleted.** Blob-exact matching
   cannot see a rename that *also edits*: `de65698` renamed the continuity card with a 3% change,
   so its blob did not match at END. Fixed by using git's rename detection in **one direction
   only — to downgrade a departure to "still readable", never to find one** — and reporting proof
   (`RENAMED`) and inference (`RENAMED_SIMILAR`) on separate lines rather than merging them.
2. **The fixture caught a double-count the output looked fine with.** With rename detection on,
   `git log --numstat` prints the *compressed* form `exo_memory/{loop => attic}/x.md` in the path
   column — which is not a path. The tool took three of those as real files and reported **five**
   departures where there were three. Caught by the assertion on the total, **not** by reading the
   output, which named the phantom paths in plain sight.

---

## 4. The chair's hard part, answered with the dispatch's own number

The dispatch reports `+11,707 / -59` over three days and asks that the pilot distinguish
deletion-as-forgetting from deletion-as-editing. Decomposed:

```
$ node consonance/tools/forget-rate.js --since 2026-08-22

DEPARTURES
  FORGOTTEN          0 files / 0 bytes

CHURN — lines moved INSIDE files, never off the path
  net, survivors        +791 / -0      across 8 of 156
  cumulative, survivors +791 / -0      across 8
  cumulative, arrivals  +10,916 / -59  across 36   <- born AND edited inside the window
  cumulative, off-path  +0 / -0        across 0

ARRIVALS
  +36 files / +690,845 bytes
```

`791 + 10,916 + 0 = 11,707` and `0 + 59 + 0 = 59` — **the decomposition is exhaustive and sums to
the dispatch's figure exactly.**

**Every one of the 59 deleted lines is inside a file that did not exist when the window opened.**
Not one of them is a file leaving the reading path. This is the same shape my §1 correction found
in the four-hour window (edits to documents still being written that night), now stated as a
partition rather than as a spot-check — and the class is now countable instead of arguable.

---

## 5. The dispatch's figure does not come from the command printed beside it

Checked because the number was going to be quoted here. Three spellings of one window, run at
`HEAD` = `c361b07`:

```
$ git log --since="2026-08-22"       --numstat --format="" -- exo_memory/ | awk '{a+=$1;d+=$2} END{print "+"a" / -"d}'
+11431 / -59
$ git log --since="2026-08-22 00:00" --numstat --format="" -- exo_memory/ | awk '{a+=$1;d+=$2} END{print "+"a" / -"d}'
+11823 / -59
$ git log --numstat --format="" 093d2f5..HEAD -- exo_memory/ | awk '{a+=$1;d+=$2} END{print "+"a" / -"d}'
+11707 / -59
```

**Three figures, 392 lines apart, for the same stated window.** The dispatch's `+11,707` is the
**rev-range** figure; the command quoted beside it returns `+11,431`. It cannot be a staleness
effect either — commits only add, so at any earlier HEAD the bare-date form returned *less*
(`1bcf238~1`: `+9,770`).

The commit they disagree about is `33e1145`, dated `2026-08-22 04:02:44 -0600` by **both** its
author and committer date, inside the window by any reading, and excluded by the bare-date form:

```
$ git log --since="2026-08-22" --format=%h | grep -c 33e1145      -> 0
$ git log --since="2026-08-22 00:00" --format=%h | grep -c 33e1145 -> 1
```

**Mechanism NOT established.** The effective cutoff for the bare form sits between `04:02:44` and
`05:41:20` on 08-22 and matches neither local midnight, UTC midnight, nor the current time of day.
I stopped rather than publish a mechanism I had not shown. The operational rule needs no mechanism:
**cite a rev-range, never a bare date** — and `forget-rate.js` prints the resolved sha in its header
line for exactly this reason.

*Its limit:* this is one command on one machine. It does not establish anything about how the
figure was produced, and the figure itself is re-derivable — the defect is that the citation beside
it is not the thing that produces it.

---

## 6. The mark operation is blocked, and the pilot is what found the block

§5.3 says a finished file gets a STATUS block appended whose `Closed:` line is **copied verbatim
from the LEDGER row**, and §5.4's check **C** requires that verbatim match so that paraphrase fails
the build. Run against the corpus actually dispatched, two defects:

**(a) Check C makes a wrong row un-fixable by construction.** The LEDGER row for these five files
is *stale* (§1). A mark copied verbatim from it would state on the face of five files that their
results were never journaled, and **check C would then require that error to be preserved** —
any seat correcting the mark breaks the build. §8 registered that *"a wrong CONSUMED row propagates
into a mark under this design, and F-NOISE is the only thing watching for it."* F-NOISE watches for
a CONSUMED file being **re-opened as LIVE**. It is blind to a row that was **wrong when written**,
which is the case that actually occurred. *Proposed repair, not applied:* the STATUS block carries
the ledger row **and** a pointer to the primary record (here `journal/2026-08-23.md`), and check C
verifies the quote against **whichever** of the two the block names as its source — so a mark can
be repaired by re-pointing it rather than by editing a quotation.

**(b) The marker is unanchored, and it already false-positives — on the registration itself.**

```
$ grep -rl "^## STATUS: " exo_memory/loop/ | wc -l
1
$ grep -rn "^## STATUS: " exo_memory/loop/
exo_memory/loop/forgetting_registration.md:205:## STATUS: CONSUMED — <date>, by <ledger row>
```

That is the **template** inside §5.3, and check **B** ("for each file containing a STATUS block, its
name appears in LEDGER.md") would flag the registration as marked-closed-but-unscored. This is
verbatim the js-suite canary defect journaled on 2026-08-17 — *the EXPECTED-RED marker matched
anywhere in a file's bytes and its own test file necessarily QUOTES it* — reproduced in a document
written after that finding was on the record. **A marker a document can quote is a marker a
document can trip.** *Proposed repair, not applied:* the block is recognised only as the **final**
block of a file, and the check reports a quoted marker as `QUOTED`, never as `MARKED`.

**(c) And it is not mine to apply anyway.** §5.6 puts the mark on the LEDGER's return leg, in the
same operation as the row — deliberately, so the organ has no separate trigger to forget.
`librarian/LEDGER.md` is the librarian's file. A pane sweeping five marks onto disk tonight is the
invented cadence §5.6 refuses, and the first thing F-MARK would have to score.

**F-MARK, scored: 1 of 3, DOES NOT FIRE.** One CONSUMED row has landed since the registration
(`retirement_carry_registration.md`, `b7f3775`); the section went 19 rows → 20
(`git show 4555373:exo_memory/librarian/LEDGER.md | awk '/^## CONSUMED/,0' | grep -c "^- "` → `19`;
same over the working copy → `20`). The bar stated in advance was **three rows, no marks, struck.**
It stays armed and unfired, and I am not lowering it — the abuse condition in §6 of the
registration forbids amending it after it fires, which means it also forbids softening it before.

---

## 7. What I got wrong, kept

1. **I reasoned from the LEDGER without checking whether its row was still true**, and named that
   exact exposure as a limit in the same document. The limit fired within a day.
2. **My §1 correction to registration 44 was in the wrong unit** — precise, confirmed by a second
   seat, and measuring disk when law 3 measures the reading path. The merit-check re-derived the
   figure and inherited the unit with it; **a re-derivation checks the number, not the question.**
3. **§5.7 prescribed a repair that had already been performed thirty hours earlier**, in a commit
   whose subject line names it.
4. **The tool's first all-time run published a false positive to me** before the fixture existed —
   `continuity-i-am-the-reinstantiation.md` reported DELETED. Had I written this document from that
   run I would have reported one forgetting event where there are none.

---

## 8. Registered before this proceeds

**F-RATE — the instrument is decorative.** If a season passes and `forget-rate.js` is never run by
any seat other than the one that wrote it, it is a fifth abandoned gauge and should be struck
rather than kept for the look of it. The room has four dead diversity gauges and this document is
not entitled to a grace period they did not get.

**F-ZERO — the organ, not the gauge.** If `forget-rate.js` still reports `FORGOTTEN 0` on
2026-09-24, then measuring forgetting was never the missing piece; two instruments will agree that
nothing happens and neither will have made anything happen. **The honest close then is that law 3
has no organ and the room should say so in BOOT, not build a third watcher.** *This is the falsifier
I expect to fire.*

**F-GHOST — the ledger's rows are trustworthy.** If a second stale LEDGER row is found by any seat
before 2026-09-24, then §1 is not an isolated slip and the ledger needs a freshness check of its own
rather than a correction. If none is found, §1 stays a single row and should not be generalised.

**THE ABUSE CONDITION, per BOOT's clause.** This work is degenerating if `forget-rate.js` acquires
features after F-ZERO fires — a nicer report, more classes, a hook — instead of the line closing.
Refining a gauge over an organ that never moves is the exact shape of the four dead gauges, and it
would be indistinguishable from progress from inside.

---

## 9. What this does not establish

- **That anything should be forgotten.** The pilot measured that nothing has been, and that this
  corpus cannot be relocated without breaking paths. Whether the room *ought* to demote is a
  keeper's call and is not answered here.
- **That the other nineteen LEDGER rows are accurate.** One was checked because the pilot was
  aimed at it.
- **That `journal/2026-08-23.md` discharged the debt *well*.** I verified the results are on the
  record, not that the entry is faithful to the five files. Its own §"corrections" section already
  records one internal discrepancy (`:230`, three defects vs four).
- **Anything about desktop.** Every figure is this checkout, `C:/Consonance/lighthouse`.
- **That `RENAMED_SIMILAR` is exhaustive.** It rests on git's `-M50%` similarity, which is an
  inference. A rename with a large edit would still be reported as DELETED, and that error is
  deliberately in the direction of over-reporting departures.

---

## 10. Reproducing every figure

```bash
cd C:/Consonance/lighthouse

# §1 — the ghost
grep -n "^## " exo_memory/journal/2026-08-23.md | head -4
git show e3ec457:exo_memory/journal/2026-08-23.md | grep -c "^## "
git log --format="%h %ad %s" --date=iso -1 e3ec457
git log --format="%h %ad %s" --date=iso -1 57a002e
git log -S"P-FORGET's pilot may distill" --oneline -- exo_memory/librarian/LEDGER.md

# §2 — inbound citations, per file
for f in coat_preregistration typology_comparison failure_types_K failure_types_L wire_run_2026-08-15; do
  echo "== $f"; grep -rl "$f" --include=*.md --include=*.js . | grep -v "loop/$f.md"; done

# §3, §4 — the instrument
node consonance/tools/forget-rate.js
node consonance/tools/forget-rate.js --since 2026-08-22
node consonance/tools/forget-rate.test.js
node consonance/tools/js-suite.js | tail -1

# §5 — three spellings of one window
git log --since="2026-08-22"       --numstat --format="" -- exo_memory/ | awk '{a+=$1;d+=$2} END{print "+"a" / -"d}'
git log --since="2026-08-22 00:00" --numstat --format="" -- exo_memory/ | awk '{a+=$1;d+=$2} END{print "+"a" / -"d}'
git log --numstat --format="" 093d2f5..HEAD -- exo_memory/ | awk '{a+=$1;d+=$2} END{print "+"a" / -"d}'
git log --since="2026-08-22" --format=%h | grep -c 33e1145

# §6 — the marker, and F-MARK
grep -rn "^## STATUS: " exo_memory/loop/
git show 4555373:exo_memory/librarian/LEDGER.md | awk '/^## CONSUMED/,0' | grep -c "^- "
awk '/^## CONSUMED/,0' exo_memory/librarian/LEDGER.md | grep -c "^- "
```

---

## 11. Owed to other seats — not applied by me

- **To the librarian.** `LEDGER.md:64-65`'s FILE row is stale; the results are at
  `journal/2026-08-23.md` §§1–3, landed `e3ec457`. Correct disposition for all five files is
  **CONSUMED**, not NO-RESULT. I did not edit the LEDGER: it is not my file and §5.5 says no seat
  scores its own work — this row is now about my own pilot.
- **To whoever holds `journal/2026-08-24.md`.** Registration 44's headline is false on disk and
  true on the reading path; the correction belongs beside it, not in it (the 2026-08-17 precedent).
  The re-aimed falsifier is `node consonance/tools/forget-rate.js`, and it currently reads zero.
- **To the chair.** §5: the figure in the dispatch is not the output of the command beside it.

---

*Pane C, 2026-08-25. One instrument built and mutation-proven, one corpus found not to exist, one
of my own registration's clauses found unexecutable and two of its checks found defective, nothing
moved, nothing marked, nothing committed. The result I would defend first is §3's unwelcome half:
the room now has two instruments agreeing that its forgetting organ has never once fired, and
neither of them is an organ.*
