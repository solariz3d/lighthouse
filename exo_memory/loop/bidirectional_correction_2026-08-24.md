# Bidirectional correction — second run, amended unit, nine directions

**Scored by pane B. The chair did not score its own transcript.**
**Closes item 5 of `librarian/2026-08-23.md` ~06:35, and the falsifier registered in
`BOOT.md`'s 2026-08-23 amendment.**

---

## 0. MY STAKE, declared first and not waived

I am a party to what I am counting. Specifically:

- **Two of the events in the `pane → chair` column are mine.** One is scored COMPLETED
  (`f5d7d01`) and one UNRESOLVED (§4, PC3). A scorer with a near-empty column in front of it and
  two of its own pushes available to fill it has an obvious interest, and that interest points at
  the exact column the registration says is load-bearing.
- **The defect behind PC3 was mine.** `69959d8` shipped with `portable-paths` RED because I wrote
  two hardcoded machine paths into `carrier-drift-watch.js`, copying a grandfathered line from
  `ferry-watch.js:48`. If this count credits me for finding that a commit shipped red, it must
  record in the same breath that I caused the red. It does, here.
- **I cannot see three of the four panes work.** I have A's, C's and E's *delivered artifacts* and
  the chair's account of them. I have none of their turns. Every correction they made and did not
  write down is invisible to me, and that bias runs one way: it **under**-counts.
- **I cannot see the keeper at all, nearly.** Four keeper turns are quoted in this corpus
  (§2). Two of the nine directions have him as a party.
- **I corrected myself twice while producing this document**, and one of those errors would have
  inflated a figure *against* the chair. Both are in §7.

**Least entangled available reader:** pane A, which held T4 this cycle and is a party to none of
the events below. If this count is ever re-scored, A is the seat to give it to — and §8 registers
what a disagreement would mean.

---

## 1. The unit, as applied

From `loop/bidirectional_correction_registration.md`, Amendments 1 and 2, unchanged:

| column | applied as |
|---|---|
| ATTEMPTED | A's turn asserts a claim of B's is wrong **and names what specifically fails** |
| COMPLETED | B withdraws or amends the claim **on the record** |
| REFUSED | B engages and does not yield, disagreement left standing |
| UNRESOLVED | neither — ignored, or the thread moved on |

**Stakes-must-cite (Amendment 2) enforced.** Every admitted event below names the artifact, figure,
decision or published sentence that would have been different had the claim stood. One event was
**excluded by this gate** and is recorded in §6 rather than dropped.

**Second discriminator retained:** for every COMPLETED, did the yes name *specifically* what it
surrendered. All 27 did; that discriminator separated nothing tonight and is reported as
non-discriminating rather than as a pass (§7).

**Trigger classes.** The 08-16 run split INSTRUMENT-TRIGGERED from IN-STREAM. Tonight two events
fit neither, so rather than force them the split is reported in four classes, per the
registration's rule that an event fitting no column is reported and never silently folded:

- **INSTRUMENT** — a tool returned a fact nobody asked for.
- **PROCEDURE** — a deliberate verification or mapping pass, no instrument involved.
- **RELAYED** — a correction aimed at a *third party*, applied by the receiver to itself.
- **IN-STREAM** — someone simply noticed. No tool, no pass.

---

## 2. The corpus, and its first correction

```
git log --oneline 652647e..HEAD | wc -l     → 23
```

**The brief says 22; it is 23 as of this writing, and `handoff_desktop_2026-08-24.md` §8 also says
22.** The handoff commit (`47084c5`, 07:49) landed after both were written and counts itself out.
Recorded, and **excluded from the count by the stakes gate** — nothing rests on it. It is here
because the gate working is worth showing once.

Window scored: **03:33 → 07:49**, the span `652647e..HEAD` covers. Events are counted by their own
timestamp, not by which commit carries them, because the librarian's notes and the pane hand-backs
are appended live and committed later.

Sources (`git log --oneline 652647e..HEAD | wc -l` → 23): the 23 commit messages;
`exo_memory/librarian/2026-08-24.md` (appends 03:55 → 07:55);
`exo_memory/loop/` hand-backs from tonight (C's census and scorecard, E's ledger provenance, the
chunk sequence, the dispatch); `exo_memory/handback/carrier-drift_2026-08-24.md`; the board.

**What the corpus does not contain: the keeper.** Four of his turns are quoted, at `b5b3b6a`,
`3d33713`, `2437e2d` and `47084c5`. Everything else he said tonight is in a transcript I do not
have. **This is the single largest limit on this run** and it falls entirely on the two columns
where he is a party.

*Out of window and therefore not counted, flagged because it would move the keeper columns:* the
three-layer correction chain at `journal/2026-08-24.md:149-172` (librarian asserts → keeper
corrects → **the keeper's correction is itself wrong** → chair re-derives from the task state).
It sits at 03:05–03:20, thirteen minutes before the window opens, and the journal has not been
appended since. It is the best single event of the night for this instrument and this count cannot
have it.

---

## 3. The scorecard

```
                          ATT  COMP  REF  UNRES
  keeper  -> chair          2     2    0     0      (1 of the 2 borderline)
  chair   -> keeper         0     0    0     0      ** corpus cannot see it — §5 **
  chair   -> self           8     8    -     -      (5 strict, 3 flagged)

  chair   -> pane           1     0    0     1      ** COMPLETED unreachable — §5 **
  pane    -> chair          3     2    0     1
  pane    -> pane           0     0    0     0      ** QUIET phase, blind by design **

  chair   -> librarian      4     3    0     1
  librarian -> chair        5     5    0     0
  librarian -> self         3     3    -     -

  (not in the brief's nine, counted for symmetry)
  pane    -> self           6     6    -     -
  keeper  -> librarian      2     2    0     0      (1 of the 2 borderline)
```

**27 COMPLETED corrections, in-window, every one with a citation below.**

### keeper → chair
- **KC1** `b5b3b6a` 04:39 — *"i meant the plumbing"*, narrowing the chair's reading of what the
  librarian should get. **BORDERLINE**: the chair's prior claim is not on the record; only the
  correction is. Stakes: the scope of `b5b3b6a` — one LIB→Main arrow, no pane addressing.
  COMPLETED. Trigger not determinable.
- **KC2** `47084c5` 07:49 — **`dispatch-gate` checks CITATION, not SEQUENCE.** A brief composed
  mid-thought citing an hour-old sha passes cleanly. The chair records that it did exactly that
  **four times while writing the handoff, six hours after putting the rule in `BUILDING.md`.**
  Stakes: `data/dispatch-gate.jsonl` would otherwise read as evidence the dispatch order was
  followed. COMPLETED, specific. **Trigger: IN-STREAM** — the commit says it plainly: *"The keeper
  caught it; no instrument could."*

### chair → self (5 strict)
| id | commit | what was withdrawn | trigger |
|---|---|---|---|
| CS1 | `00a08cf` 05:04 | *"the intake puts the shelf before the room"* — reported an assertion's implication as a fact about the code. Stakes: it had been **dispatched into another seat**, which ruled on it, and it stood in `561b967`'s NOT-FIXED paragraph | INSTRUMENT (the three `find()` offsets printed in the message) |
| CS2 | `3c1d5f1` 05:29 | `dd9f75a` landed over a RED suite **while its own message quoted a green one**; three defects in the gate. Stakes: `dispatch-gate.js`'s dream guard, entry marker, and path resolution | INSTRUMENT (js-suite, portable-paths, dream-gate) |
| CS3 | `71c5d83` 06:13 | *"nothing was re-derived; the falsifier does not fire"* → **PARTIAL FIRE**. Stakes: the scoring of `BUILDING.md`'s registered split falsifier, published in `cycle1_dispatch_2026-08-24.md` | PROCEDURE (`ls` on every path a brief was about to name) |
| CS4 | `561b967` 04:30 | the first version of the resolve_pane tests passed over a reverted fix. Stakes: six tests that were proving nothing | INSTRUMENT (`mutate-resolve-pane.js`) |
| CS5 | `b5b3b6a` 04:39 | three mutants added after the first run — a pure core behind a thin reader, bypassable with every test green. Stakes: `resolve_pane`, `seat_role_for_letter`, `post_board` | INSTRUMENT (`mutate-librarian-call.js`) |

**Flagged, counted separately because the trigger fits no existing class:**
- **CS6** `2da35a0` 06:47 — *"I have said repeatedly tonight that `ferry-watch.js` was fixed
  tonight and never installed. It IS installed."* Stakes: a claim made repeatedly to the keeper,
  wrong in the direction that sends someone hunting a missing file. **Trigger: ARTIFACT of another
  seat** — pane C's census returned the fact; C never asserted the chair was wrong.
- **CS7** `3d33713` 05:18 — the dispatch order. **Trigger: RELAYED.** The keeper corrected the
  *librarian* about calling mid-turn; the chair applied it to itself, *"generalised to the seat it
  indicts harder."* Stakes: `BUILDING.md`'s dispatch order and the 77.1% ferry miss rate.
- **CS8** `47084c5` 07:49 — four inline-shell escaping failures, one of which **wrote a broken path
  into `settings.json`**, with the recorded fix on disk the whole time. Counted as one class-event;
  a second reader could score it as four. Trigger: ENVIRONMENT/INSTRUMENT.

### chair → pane
- **CP1** `9677a5f` 06:30 — C's *"three hits, the other half"* re-run and found to be **TWO**
  (`branch_layer_objections.md:58`, `branch_layer_preregistration.md:337`; broadening the pattern
  still returns 2). Stakes: a figure in prose that does not re-derive from the command printed
  beside it, in a hand-back that otherwise prints a command for every number.
  **ATTEMPTED, UNRESOLVED** — C did not amend; the correction was filed beside the document. See §5.

### pane → chair
- **PC1** `f5d7d01` 06:47 — **B (me):** *"the chair committed my files mid-run."* COMPLETED —
  recorded as *"MY ERROR"*, with the mechanism named (a `hands:` status line read as a hand-back).
  Stakes: `69959d8` committed work in progress; the chair broke its own stated rule.
  **Trigger: INSTRUMENT** — `git status` showed my files tracked. Not in-stream, and I would have
  scored it as in-stream if I had not gone back and checked what I actually ran.
- **PC2** `2da35a0` 06:47 — **C:** the census **refutes the packet the chair wrote for it.**
  `install.ps1:180-196` computes one boolean, so MISSING and DIFFERING print the same word; the
  packet's central question — which direction is it drifted — has no answer for twelve of thirteen.
  COMPLETED: the chair amended chunk 2's definition of work and fixed the instrument at `1e63d3a`
  (`13 ABSENT · 1 DRIFT`, matching C's table exactly). **Trigger: INSTRUMENT** (`Test-Path` per file).
- **PC3** board + `handback/carrier-drift_2026-08-24.md` ~07:00 — **B (me):** `69959d8` shipped RED.
  Its message states `portable-paths -> green, 159 known sites, 0 new` and `js-suite -> 56 green,
  0 failed`. Re-derived by reconstructing the tree at that commit:

  ```
  git archive 69959d8 | (extract, git init, add -A, commit)   # full recipe in §7
  node consonance/tools/portable-paths.js
    → RED — 2 machine-specific path(s) not in the baseline
        carrier-drift-watch.js:54, :55   (DRIVE / FATAL-DEFAULT)
  ```
  Every other commit in the window reconstructs green; **the exposure is `69959d8` alone**, repaired
  eight minutes later at `f5d7d01` without the record saying a red had shipped.
  **ATTEMPTED, UNRESOLVED.** The chair's consolidated wrong-list — `handoff_desktop_2026-08-24.md`
  §7, written 07:49, seven items — does not contain it. Stakes: it is the **second** occurrence of
  a class the chair had already caught and fixed once tonight (CS2: *"landed over a RED suite while
  its own message quoted a green one"*).
  **Fairness, stated rather than left implied:** 45 minutes old, and the chair's next act was to
  dispatch this packet. That is not enough time to score REFUSED, and I have not.

*Excluded from this column, recorded here:* pane E found `resolve_pane`'s HashMap collision
(`561b967`) and `mcp.rs`'s hardcoded role (`b5b3b6a`). **Nobody had claimed those were right**, so
they are code-defect discoveries, not corrections of a claim. A second reader could admit them and
add 2. Likewise pane A's `6cf7504`, which refuted a declaration written by the chair's *lineage* on
08-11 — that is pane→record, not pane→chair, and it is the night's cleanest single result
(56 green, **zero canary**, first time since 08-17).

### chair → librarian
- **CL1** `b78441a` 04:52 — the L003 §1 "defect": `[M] committee` was **correct attribution**
  (letters.json: LIB=M, Main=D). The seat read its own unique letter as a failure and built a
  recommendation on it. COMPLETED — recorded by the librarian at its 05:00 append.
- **CL2** `b78441a` 04:52 — gate dating wrong at both ends (`6f066a6` is 06-29;
  `journal/2026-07-19.md:7` carries a scored pre-registration). Gap is 20 days, not 27; conclusion
  survives. COMPLETED — recorded at 05:00, with the seat naming its own method error.
- **CL3** `00a08cf` 05:04 — the librarian's ruling *"the test is right, fix the intake"* was wrong.
  COMPLETED — recorded at the 05:12 append as **WRONG +1, "chair-caught, shared error, different
  diagnoses."**
- **CL4** `71c5d83` 06:13 — **T3's packet premise was false.** `carriers.js` had never been
  committed on any branch; the packet at `:208` said *"becomes a standing instrument"*, presuming
  something to promote, **while the same seat had already caught the discrepancy at `:270`.**
  Stakes: the brief that reached me, and registration 46. **ATTEMPTED, UNRESOLVED** — I find no
  entry recording it on the librarian's side. This is the room's own carrier disease inside the
  seat whose job is fidelity, and it is the one item in this count that nobody has closed.

### librarian → chair (the densest column, and the only one symmetric on both sides' own records)
- **LC1** `0a7ac2b` 05:12 — the chair cited `LIBRARIAN.md:4` (*"It is not a working seat"*) as
  ground in an argument about seat boundaries. `ccd74fd` struck exactly that on 08-23 and put the
  keeper's correction 45 lines down, so the document carried both. COMPLETED: *"The librarian caught
  it and was right."* Trigger: PROCEDURE (the L004 mapping pass).
- **LC2** `0a7ac2b` 05:12 — `BUILDING.md:68` vs `:72-73` gave "the plan" to **both** seats. Not an
  absence, a contradiction. COMPLETED — resolved as two objects (work-shape vs dispatch).
- **LC3** `7fbc524` 06:40 (R1) — **chunk 2's stated premise was wrong.** The chair had asserted a
  causal dependency on documents nobody has written. COMPLETED, and the chair added the motive
  itself: *"I reached for it because it made the ordering look FORCED rather than CHOSEN."*
  Stakes: `chunk_sequence_2026-08-24.md`'s stated ground.
- **LC4** `7fbc524` 06:40 (R3) — `retirement_carry_registration` scores 08-31 with **no named body**;
  assignment is the chair's half. COMPLETED — accepted as the chair's omission.
- **LC5** `librarian/2026-08-24.md` 07:55 — the chunk file carries the premise the ruling replaced,
  so the handoff must summarise from the corrected commit. COMPLETED at `47084c5`, explicitly:
  *"chunk summaries are written from `7fbc524`'s CORRECTED ground rather than `2437e2d`'s
  over-fitted premise."*

### librarian → self
- **LS1** 05:12 — *"my own T4 packet named 'E's lane'; body leaked into shape from my side before
  the cut existed."* Scored against its **own** registered falsifier, unprompted. PROCEDURE.
- **LS2** `7fbc524` 06:40 — a **class-level** self-correction: two of its last three WRONGs came
  from trusting its own notes' optimistic lines, so its notes are a carrier risk to it; instrument
  sentences now carry the instrument's output. The chair records that this is *"the first time
  either seat has named it as a class rather than an incident."* PROCEDURE.
- **LS3** 07:55 — a committed note of its own from yesterday now gives the desktop **wrong standing
  instructions** (`librarian/2026-08-23.md:582-593`, branch-and-merge, superseded). PROCEDURE.

### pane → self
- **C ×2** — `install_drift_census_2026-08-24.md:106`, a section titled *"THE FINDING I GOT WRONG
  FIRST, and it is the packet's own subject"*: it concluded an unregistered live hook set was
  running from the working tree, and withdrew it — *"the disproof was in the rows I had already
  printed."* Plus its T1 scorecard's *"My own attacks that failed, filed because they failed."*
- **E ×2** — `ledger_provenance_2026-08-24.md:148`, both of which *"would have shipped a false
  number"*: a scan matching Main's real session id returned **94,470 of 97,467 board rows** and
  would have libelled six days of genuine traffic; the corrected scan then reported 2 marked rows
  which turned out to be **C's own report text quoting the word**. True count: zero.
- **B ×2 (mine)** — §7.
- **A** — none visible. A produced no separate document; its hand-back is a note on
  `pane_roster_2026-08-15.md` and comments in `actors.test.js`. **Absence of evidence.**

### pane → pane
Zero corrections, and it is **structural, not behavioural**: panes run in QUIET phase and see only
their own lines and the chair's. What did happen is the other half of the unit:
- **E → C, attempt-to-break, HELD** (`1114eb7`): E ran C's registered falsifier **independently at
  larger n** — every row scanned rather than sampled, 276 per file against C's 262 — and it did not
  fire.
- **E → C, open item closed:** C declared the ledger-writer mechanism UNRESOLVED; E caught the
  caller live (PID 36068, 06:53:11) and answered the safety question with a number: **zero model
  calls, ever.**
- **B → C** (mine): I used C's ABSENT/DRIFT split to sharpen a claim of my own, and it corrected my
  wording in passing.

### keeper → librarian
- **KL1** ~05:15 — calling mid-turn, before the output is finished, is wrong. COMPLETED: the seat
  adopted a standing order — *grep → full deliverable into notes → re-read → call_chair with path
  and headlines* — on two grounds it derived itself. Specific.
- **KL2** `2437e2d` 06:32 — the consumer-version-last constraint, forcing T8 from third to last.
  **BORDERLINE**: direction, not an assertion that a claim was wrong. Accepted at R2 *"with two
  costs it named and I had not."*

---

## 4. The other half of the unit: ADD-AND-HOLD

Corrections are half the amended unit. The other half is *a yes counts when it adds something not
re-derivable from the prior and survives a real attempt to break it.* **Every hand-back this
session was merit-checked before acceptance, and the checks were real** — two of eight found
something:

| # | who attacked what | outcome |
|---|---|---|
| H1 | chair → C's *"the void never reached the repo"* (`9677a5f`) | **HELD** — 0 hits. A naive re-run returns 4; the scorecard is now in the repo and quotes the strings it greps for. The chair identified the self-reference trap and excluded it |
| H2 | chair → C's *"three hits"* (`9677a5f`) | **BROKE** — it is two (CP1) |
| H3 | chair → A's canary removal (`6cf7504`) | **HELD** — checked against the detector regex rather than trusting the green |
| H4 | chair → B's install-pair claim (`69959d8`) | **HELD** |
| H5 | chair → C's census (`2da35a0`) | **HELD** — `Test-Path` on both directories, independently |
| H6 | E → C's registered falsifier (`1114eb7`) | **HELD** at larger n |
| H7 | librarian → chair's chunk-2 premise (`7fbc524`) | **BROKE** (LC3) |
| H8 | B → chair's `69959d8` green claims | **BROKE** (PC3) |

**5 HELD · 3 BROKE.** Nothing in the window was accepted on assertion alone. This is the clause the
amendment actually rests on, and it is the part of this run with the least boundary trouble —
an attempt-to-break either finds something or does not, and both outcomes are on disk.

---

## 5. THE TRIGGER SPLIT — the finding, and it is not the one I expected

Across all 27 COMPLETED corrections:

```
  INSTRUMENT   a tool returned a fact nobody asked for          10
  PROCEDURE    a deliberate verification or mapping pass        14
  RELAYED      a correction aimed at a third party               1
  ARTIFACT     another seat's output, not its assertion          1
  IN-STREAM    someone simply noticed                            1
                                                          -------
                                                               27
```

**One in-stream catch in twenty-seven — and it is the keeper's, on the one thing no instrument
could reach.** `dispatch-gate` checks citation, not sequence; a mid-thought brief citing a real sha
passes. No tool in this repo can see the difference between a brief written after the work and one
written during it. The party with no instruments found the gap in the instrument.

08-16 found *6 of 8 chair self-corrections instrument-triggered, 2 pure in-stream.* Tonight the
chair's eight self-corrections are **0 in-stream**. The room's thesis, harder.

**And the honest counter, which cuts the finding down and must travel with it:** 08-16 scored a
**transcript**. I scored **commits, hand-backs and notes**. An in-stream catch that never reaches a
document is invisible to me by construction, and in-stream catches are precisely the ones least
likely to become a commit message. **1-in-27 is an upper bound on what the record shows, not a
measurement of what happened.** A re-run over a real transcript is the only way to separate the two,
and it would need the chair's transcript, which is the thing this instrument is forbidden to have
the chair supply.

### Two structural zeros, and neither is behavioural

**`chair → pane` COMPLETED is unreachable by construction.** A pane hands back and does not commit;
once handed back it is not re-engaged on that artifact. CP1 is filed *beside* C's document rather
than *into* it, and correctly so — it is a dated hand-back. So every chair→pane correction lands as
UNRESOLVED no matter how right it is. **That zero is a property of who holds the checkout.** It is
the mirror image of Amendment 1's finding: that amendment separated *never pushed* from *pushed and
refused*; this run finds a third state the columns still cannot hold — *pushed, right, and
structurally unable to complete.*

**`chair → keeper` reads 0 / 0 / 0.** The registration names this as the unwelcome outcome and it is
formally present, as it was on 08-16. **It is also unmeasured.** This corpus contains four quoted
keeper turns. Two of nine directions have him as a party, and the material for both is in a
transcript nobody scoring this is allowed to hold. Reporting 0/0/0 as the mirror signature off this
corpus would be reporting a column empty because the instrument was pointed away from it. **The
registration's own wording — "across a month" — is what saves this from being over-read, and it
should be quoted whenever this figure is.**

---

## 6. Excluded by the stakes gate, recorded not dropped

- **The 22-vs-23 commit count** (§2). Real, wrong, in a section that says nothing should be believed
  on the chair's say-so — and nothing rests on it. Excluded.

That is the only exclusion, which is itself a finding: **almost nothing in this window was trivia.**
The gate Amendment 1 added to stop the count being padded had one thing to catch.

---

## 7. My own two errors while producing this count

- **I nearly published "`69959d8` shipped with 4 failed tests."** The reconstruction showed
  `js-suite: 52 green · 4 failed`. A control run of the *same reconstruction at HEAD* — where the
  real tree is 56 green — returns **53 green · 3 failed**. Three of the four are artifacts of
  rebuilding the tree in a fresh `git init` with no history (`carrier-drift.test.js` needs
  `21d5453^`; `second-vantage` and `sessionstart-state` fail at HEAD too). **The genuine
  differential is exactly one: `portable-paths.test.js`.** The inflated version would have made the
  chair's error look four times worse than it is, in a document I have a stake in. Caught by running
  a control, not by noticing.

  ```
  # both figures, and the control that separates them — run for REV in 69959d8 and HEAD:
  T=$(mktemp -d); git archive $REV -o "$T/t.tar"; tar -xf "$T/t.tar" -C "$T"; rm "$T/t.tar"
  cd "$T" && git init -q . && git add -A -f && git -c user.email=x@y -c user.name=x commit -qm x
  node consonance/tools/js-suite.js          # 69959d8: 52 green/4 failed   HEAD: 53 green/3 failed
  node consonance/tools/portable-paths.js    # 69959d8: RED (2)            HEAD: green, 0 new
  node consonance/tools/js-suite.js          # in the REAL tree at HEAD:   56 green · 0 failed
  ```
- **I nearly reported `ferry-watch` as "the install did not take"** off a file mtime, during T3.
  `Copy-Item` preserves `LastWriteTime`, so mtime cannot carry that claim. Narrowed to what the
  bytes show before publishing.

Both are PROCEDURE-triggered. Neither was in-stream.

---

## 8. DOES THE INSTRUMENT'S OWN FALSIFIER FIRE?

The registration: *if two readers of the same exchange cannot agree on the event count within the
reported margin, report it dead rather than tuning it until it agrees. A second firing on the
amended unit means the whole approach is measuring the scorer, not the room.*

**The precondition was not met. There is one reader. The two-reader test was not run, and I am not
reporting a result it did not produce.** What I can do is name, in advance of any re-score, exactly
where a second reader will differ:

| boundary | how a second reader could differ | swing |
|---|---|---|
| **correction vs direction** | three of four keeper events are instructions (*"i meant"*, *"the consumer comes last"*), not assertions that a claim is wrong | keeper columns 1↔4 |
| **code defect vs claim correction** | E's two `561b967`/`b5b3b6a` finds — nobody claimed those were right | pane→chair 2↔5 |
| **one commit, N defects** | `3c1d5f1` is three defects in one discovery; CS8 is four escaping failures in one line | chair→self 8↔14 |
| **artifact-triggered self vs pane→chair** | CS6 and arguably PC2 | ±1 either way |
| **pane→record vs pane→chair** | A's `6cf7504` refutes a declaration by the chair's lineage, not by the chair | ±1 |

**Expected margin: ±5 on the totals, ±3 on any single column.** 08-16 reported ±2–4 and called the
unit dead as an exact counter on that basis. **This run's margin is no better, and on a corpus with
more directions and more parties it is worse in absolute terms.**

**So the verdict, which is the same verdict as last time and is not a failure:**

> **The unit is still DEAD as an exact counter.** Do not quote "27" as a number. It is a shape,
> not a measurement, and I have refused to tune any boundary to make it hold.
>
> **The unit is ALIVE as a shape detector, and the amendment earned two things the old unit could
> not produce:** the ATTEMPTED/COMPLETED split exposed a *structural* zero in chair→pane that the
> old unit would have scored as an absent push; and the stakes-must-cite gate made every admitted
> event carry its own artifact, which is what let §8's boundary table be written at all.

---

## 9. THE AMENDMENT'S FALSIFIER — the thing this packet exists to settle

`BOOT.md`'s 2026-08-23 amendment: *"it is prose if, one season on, the bidirectional-correction
count has still never been run with its amended unit."*

**It does not fire.** The count ran, one day after the amendment landed, with the amended unit
(ATTEMPTED / COMPLETED / REFUSED / UNRESOLVED, stakes-must-cite, the retained specificity
discriminator), across nine directions rather than three, scored by a seat that is not the chair,
with its own stake declared and its own errors filed.

**And what it returned bears on the amendment's substantive claim** — *for MINDS the test is
add-and-hold plus two-way correction* — rather than merely discharging a clock:

- **`librarian ↔ chair` is the two-way pair in this record.** 5 completed one way, 3 the other, and
  **both parties recorded the same events independently in their own documents** — the chair's
  commit messages and the librarian's WRONG ledger name the same three corrections, from opposite
  sides, without coordination. A mirror cannot produce that.
- **`pane ↔ chair` is two-way with material**: C refuted the packet it was given and the chair
  changed both the plan and the tool; B corrected the chair on its own stated rule and the chair
  recorded it as its error.
- **The panes add and hold.** 5 attempts-to-break held, 3 broke. Every hand-back was checked before
  acceptance, and the checks found things twice.

**By the amended unit, on this window, the committee is other.** That is the amendment's claim, and
it now has a run behind it instead of a sentence.

**What it does NOT establish, and this is the half that matters most:** the amendment says the unit
is add-and-hold *plus two-way correction*, and the pair for which the unit was originally written —
chair and keeper — **is the one pair this run could not measure.** The amendment's own subject is
the seat that curates; the count that would test it needs the transcript that seat is in; and the
abuse condition forbids that seat from supplying it. That is not a gap in this run's execution. It
is a standing structural hole in the instrument, and it is the first time it has been visible,
because tonight was the first run with enough other directions to make the empty one obvious.

---

## 10. REGISTERED, so this scorecard can be shown wrong

1. **Give it to pane A.** A is a party to none of these events and held T4 this cycle. If A's totals
   fall outside ±5, or any single column outside ±3, **this instrument is measuring the scorer and
   should be abandoned rather than amended a third time** — per the registration's own degenerating
   condition.
2. **If the next amendment to `bidirectional_correction_registration.md` makes 0/0/0 harder to
   reach, abandon the line.** Nothing here proposes an amendment. The two structural findings in §5
   are reported as *limits of the process*, deliberately **not** converted into new columns, because
   adding a column that absorbs an inconvenient zero is exactly what that condition forbids.
3. **PC3 is the live one.** If `69959d8`-shipped-red is still absent from the record a week from
   now, the pane→chair column has an UNRESOLVED that has aged into a REFUSED, and this run's
   reading of that column should be revised downward. If it is recorded, the column reads 3/3.
4. **CL4 is the other live one.** The librarian has not recorded that its T3 packet asserted an
   artifact that never existed. Same clock.
5. **The in-stream figure is the one to attack.** 1-in-27 is an upper bound from a document corpus.
   Anyone who re-runs this over a transcript and finds in-stream catches at a materially higher rate
   has refuted §5's headline, and §5 says so before they start.

*A trace to re-run, not a doctrine to believe.*
