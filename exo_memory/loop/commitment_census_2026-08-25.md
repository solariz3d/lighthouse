# THE COMMITMENT CENSUS — what the room has promised, and what can check it

**Registered:** 2026-08-25, ~03:00–04:30 local. **Seat:** pane B. **Dispatch:** the chair, after
`open-items.js` printed its own universe line and told on itself: *"an item exists here only because
someone wrote a check() for it. THIS DENOMINATOR IS HAND-MAINTAINED AND CANNOT BE WALKED — a
commitment with no check is not CLOSED, it is ABSENT, and absent reads exactly like done."*

**The job:** find the commitments that have no check. Produce the list.

**Not the job, and not done here:** no checks were written; `consonance/tools/open-items.js` and
`dev/shell/install.ps1` were read and never edited (pane A holds both this cycle). One scratch
traversal script was used and lives in the scratchpad, outside the repo, named in §3.

**My stake, declared before the rule.** The chair expects refusal — *"the set is unbounded and here
is the stopping rule"* — and said so in the brief. That is a stake in both directions: returning
"unbounded" flatters his prediction, and returning a tidy total flatters the instrument. What is
below is a rule fixed before the count, a count run against it, and one place where the rule cost me
a commitment I could see and could not catch, reported as a failure rather than smoothed over.

---

## 1. THE RULE — what counts as a commitment

Fixed before counting, per the room's own degenerating mark for exactly this (*adjusting the line
after seeing data*). Three clauses, all required:

> **C1 — FORWARD-POINTED.** It refers to a state of the world *after* the sentence was written. A
> sentence describing what already happened is a RESULT, not a commitment, however unwelcome.
>
> **C2 — DETERMINABLE.** Some observation would settle it, at least in principle. *"Be careful about
> X"* fails. *"If a season passes and X"* passes.
>
> **C3 — BINDING.** Something the room owes: a claim that gets withdrawn, a document that gets
> struck, a thing that gets built or run. An aspiration with no consequence attached is not a
> commitment, it is a hope.

**What this excludes, deliberately, and each exclusion costs something:**

- **Descriptions of other people's commitments.** `chunk_sequence_2026-08-24.md` *discusses* the fact
  that registrations carry falsifiers; it does not thereby carry one. Grep cannot tell these apart
  and this is the largest source of false positives in the corpus.
- **Consumed commitments.** A falsifier that has been scored is a result. Cost: this makes me
  dependent on the LEDGER's LIVE/CONSUMED call, which is itself hand-maintained — the recursion is
  named in §6 and it fires.
- **Advice and procedure.** *"Route the OBJECT, not a description of it"* (COMMITTEE.md) is a rule
  with no future observation attached. Real, binding, not a commitment by C1.

## 2. THE RULE — what counts as a CHECK

The chair's question is not *does a falsifier exist* — the falsifier IS the commitment. It is *can
anything determine its status without a person remembering*. Three tiers:

| tier | definition | test |
|---|---|---|
| **M — MECHANIZED** | a runnable instrument recomputes the status and reports it | I can name the command and run it, and its output states the commitment's status |
| **I — INSTRUMENTABLE, UNFIRED** | the data exists and a command is named or trivially writable, but nothing runs it and nobody is scheduled to | I can name what would settle it; nothing does |
| **P — PROSE** | the check is a human reading a future document and judging | *"does the next entry cite this"* — no data source, no procedure, only attention |

**The distinction that matters:** M is the only tier that survives a compaction. I and P both depend
on someone remembering, and the room has 3.5% survival on that (`compact_prereg_2026-08-19.md:16`).

---

## 3. THE TRAVERSAL RULE — and it is grep-anchored, which is its defect

**Roots walked (declared before the walk, not after):**

| root | why | .md files |
|---|---|---|
| `exo_memory/loop/` | where registrations live | 93 |
| `exo_memory/journal/` | numbered registrations + "Registered, so it can fire" blocks | 29 |
| `exo_memory/librarian/` | the LEDGER, the closest thing to a maintained index | 6 |
| `consonance/src-tauri/brief/` | the documents a fresh room reads — they carry their own falsifiers | 8 |

Total walked: **136 .md files**, excluding this one. Re-derive:

    ls exo_memory/loop/*.md exo_memory/journal/*.md exo_memory/librarian/*.md \
       consonance/src-tauri/brief/*.md | wc -l        # 137 including this file

**The corpus moved under the walk, and the first version of this table was wrong because of it.**
I published 92 / 20 / 20 / 8 from a hand-read of an `ls` tail; re-derived it is 93 / 29 / 6 / 8.
`gemini_channel_attack_2026-08-25.md` (pane E) landed at 03:57 mid-census and **is** inside the 136.
A census of a corpus that is being appended to while it runs is accurate to a timestamp and nothing
longer — this one is accurate to **2026-08-25 04:03 local**.

**Roots NOT walked, each with its cost:**

- `exo_memory/cards/`, `exo_memory/record/`, `memory/` — 0 marker hits on a probe grep; the muscle
  cards are stance documents, not registrations. **Cost:** a commitment phrased as a card's "how to
  apply" is invisible here.
- Code comments and test files. **Cost:** real. `carrier-drift.js` prints *"a withdrawal nobody
  registers is a withdrawal this reports green on, forever"* — a commitment, in a tool's own output,
  outside my corpus. I found it by running the tool, not by walking.
- `board.jsonl` (112,262 rows), PTY dispatches, and anything said and not written. **Cost:** stated
  by registration #33 — *what a seat SAYS is not checkable; only what it writes down is.*
- The desktop machine and any other clone. **Cost:** unbounded and unmeasurable from here.
- `attic/`, `dreams/`. Traces, by the room's own rule.

**The marker set**, fixed before the count:

    falsifier | degenerating | is prose if | is theatre | season passes | abuse condition
    registered so | registered, so | stop rule | stopping rule | scoring date
    \bF-[A-Z] | \bF[0-9]\b | OVERDUE | must be re-run | it is struck | owed in writing

**MY UNIVERSE, per clause 1 of P-UNIVERSE** (`universe_print_registration_2026-08-25.md`), applied to
this document because a census that does not print its own universe is the thing it is measuring:

    136 .md files seen · 0 skipped (all readable) · 90 carry >= 1 marker · 46 carry none
    authority for the file list: the four directories themselves, not a list kept in this document

**And the rule that decided is LEXICAL, which is the defect.** A commitment phrased without any
marker word is not skipped by this census — it is **absent**, and absence has no counter. That is
species A, in this document, and §4 is the measurement of it rather than a disclaimer about it.

---

## 4. CLAUSE 2 — the positive, drawn from the definition, and MY INSTRUMENT FAILED IT

P-UNIVERSE's clause 2 requires demonstrating a positive, and F-U4's abuse condition forbids drawing
that positive from the instrument's own unit — *"the positive must be constructed from the
phenomenon's definition, never the detector's segmentation."* So the positive below is picked by
C1/C2/C3 and not by the marker list.

**The positive:** `exo_memory/librarian/LEDGER.md:14-15`, the LIVE row for my own CH-4 work —

> *"carrier_surface_2026-08-25.md (B) — FIVE CHANNELS enumerated … carrier-drift's corpus must grow
> to CH-4/CH-5 or reports green on them forever"*

Forward-pointed (C1: the corpus must grow), determinable (C2: run the tool and read its corpus
line), binding (C3: or the instrument is reporting green on channels it cannot see). A commitment by
every clause of §1.

**Result: my marker set does not catch it.** `carrier_surface_2026-08-25.md` is one of the 46 files
with **zero** marker hits — verified by reading its §7 tail, which carries no falsifier at all. The
commitment is not in the document. It exists **only in the index**, authored by the librarian
summarising the packet.

**Two things follow, and the second is worse than the first.**

1. **The census's lexical rule has a measured miss**, on a file the census's own author wrote. Not
   estimated — demonstrated on one named case.
2. **The LEDGER is authoring commitments that the master document never registered.** That is the
   copy-of-a-copy hazard at the index level: the summary carries an obligation the source does not,
   so the obligation has no home in the master and dies whenever the index is next rewritten.

*Scored anyway, because it was cheap:* `node consonance/tools/carrier-drift.js` now prints
`CH-4: 31 instruction-reachable … re-walked this run`. **CH-4 landed; CH-5 did not** — the tool's own
limits block says it reads `.md` under the repo corpus rule, and CH-5 is `~/.claude/projects/*/memory/`,
outside it. The commitment is **half discharged**, and nothing anywhere recorded either half.

---

## 5. THE COUNT

### 5a. The numbered journal registrations — 46, complete, and 0 of them are checked

Re-derivable:

    grep -rn "Registered, so it can fire" exo_memory/journal/*.md

The sequence runs **1 through 46 with no gaps**, across four journal entries under two different
headings (`## 5. REGISTERED` in 08-22, `**Registered, so it can fire:**` elsewhere). I expected a gap
at 5–18 and there is none; #5–#9 are in `2026-08-18.md`, #10–#18 in `2026-08-22.md`.

**Of the 46:**

| | count | which |
|---|---|---|
| **M — mechanized** | **1** | #30 |
| M — partial | 2 | #22, #25 (`cite-check.js` covers the figure-carries-a-command shape, not the entry-level question as worded) |
| **I — instrumentable, unfired** | **19** | #1 #3 #5 #6 #8 #9 #10 #11 #13 #14 #17 #23 #24 #29 #31 #37 #43 #44 #45 |
| **P — prose only** | **23** | #2 #4 #7 #12 #15 #18 #19 #20 #21 #26 #27 #28 #32 #33 #34 #35 #36 #38 #39 #40 #41 #42 #46 |
| dead / discharged | 1 | #16 (`lap_2026-08-23.md:99-109` — satisfied on day two; *"the falsifier cannot fire, it is already dead"*) |

**And the headline: 0 of the 46 appear in `open-items.js`.** Its five ids are `seed-carrier`,
`hold-userprompt-submit`, `f1-vantage-clock`, `vantage-reach`, `actors-canary`
(`grep -n "id: " consonance/tools/open-items.js`). None is a numbered registration. **The five items
are not a sample of the commitment set. They are the five someone happened to code.**

**1 of 46 appears in the LEDGER** — #44, the corrected one. The other 45 have no row in the room's
only maintained lifecycle index.

*The tier column is a judgment per item and is offered to be disagreed with item by item; the item
text is in the journals at the cited lines, and a scorer who moves an item should say which clause of
§2 moved it.*

### 5b. The named falsifiers in live registrations — 34 enumerated

Every one carries at least one marker, so unlike §5a this group is what the census is good at.

| file | falsifiers | tier |
|---|---|---|
| `shelf_tier_2026-08-24.md:59-77` | F-reach, F-cite, F-ledger, F-growth | I ×4 (F-reach's clock is `lap.jsonl`, now 7 laps of 10) |
| `forgetting_registration.md:279-300` | F-MARK, F-NOISE, F-POINTLESS, F-PARAPHRASE | I ×4 (all read the LEDGER, which is hand-maintained) |
| `universe_print_registration_2026-08-25.md:250-275` | F-U1, F-U2, F-U3, F-U4 | I ×4, scoring date **2026-09-24**; F-U2 names its own command |
| `turn_boundary_detection_2026-08-25.md:332-343` | F1, F2, F3, F4 | I ×4; F2 names `node p1sha.js MAIN` |
| `exteroception_registration.md:68,132,176,215` | three option falsifiers + the registration's own | **blocked** — nothing builds until the keeper picks an option |
| `boot_refactor_registration.md:87,92,129` | primary, secondary, amendment-1's added | I ×3; **OVERDUE** per `LEDGER.md:34` — though the source it cites, `handoff_2026-08-17.md:117`, says *"one dated sitting **this week**, or it goes to the attic"*, not a date. The 08-24 deadline is the LEDGER's own reading, and I am repeating it as the LEDGER's, not as the handoff's |
| `lap_2026-08-23.md:145-149` | the 20-commit window, the 7-day tool-retirement condition, the abuse condition | **M** — see §6 |
| `forward_pointed_prereg_2026-08-22.md:28,35` | two | UNVERIFIED per the LEDGER |
| `librarian_compact_2026-08-24.md:70,77` | two + the tier-experiment formula for the next compaction | I |
| `absent_hooks_ruling_2026-08-25.md:457` · `ch5_memory_sweep_2026-08-25.md:401` · `install_drift_census_2026-08-24.md:305` | one degenerating mark each | P ×3 |

### 5c. The carriers — commitments in the documents a fresh room reads

| file | commitment | status |
|---|---|---|
| `exo_memory/BOOT.md:66` | *this room is degenerating if a season passes in which its documents grow and no instrument returns an unwanted number* | **I** — no instrument counts unwanted numbers |
| `exo_memory/BOOT.md:117` | *if a season passes in which the chair's reported figures are re-derived by anyone and none is found wrong, this entry is over-fitted* | **I** — `cite-check.js` is adjacent but does not score this |
| `exo_memory/BOOT.md:99` | the 2026-08-23 amendment's own falsifier | **DISCHARGED** (LEDGER: bidirectional count re-run with the amended unit) |
| `brief/BUILDING.md:229-235` | three, one of which restates BOOT:66 | **partly M** — two are scored by `lap-row.js --report` |
| `brief/LIBRARIAN.md:191` | the season falsifier | **DEAD** — same commitment as #16, already satisfied |

**Note the duplication:** registration #16, `LIBRARIAN.md:191` and `BUILDING.md:235` are three
carriers of two commitments. One of them (#16 / LIBRARIAN) was settled on day two and both carriers
still teach it as open. This is the 2026-08-17 lesson — *mark the carriers, leave the traces* — with
a fresh instance.

---

## 6. TWO THINGS FIRED DURING THE WALK

### A fired falsifier, sitting unread in an instrument's own output

    node consonance/tools/lap-row.js --report

> `FALSIFIER 2 (pane E) - over 20 chair commits, the keeper-initiated share of librarian laps must`
> `fall below 1/2.`
> `  chair commits since the first row (6905d74): 53 of 20`
> `  keeper-initiated 7 of 7 laps = 100.0%  -> window closed, FALSIFIER FIRES`

Registered verbatim at `lap_2026-08-23.md:145`: *"Over the next 20 chair commits, the keeper-initiated
share of librarian laps must fall below 1/2. If it does not, the human is still the ferry and the
three tools are decorative."*

**The window is closed on either anchor.** The instrument counts from the first lap row (`6905d74`,
53 commits); the registration says "after `b2f1634`", which gives `git rev-list --count b2f1634..HEAD`
= **64**. Both exceed 20, so the reading does not depend on which anchor is used.

**Nobody has read it.** `grep -rn "FALSIFIER FIRES\|keeper-initiated" exo_memory/ --include=*.md`
returns the registration and its restatements, and no scoring.

**Registration #30 is simultaneously satisfied.** It asked: *"by the 20th chair commit after b2f1634,
does an instrument report the keeper-initiated share?"* It does — this one. The instrument was built
and it works. What was never built is anything that makes someone look at it.

### F-ledger fires, by both of its clauses

`shelf_tier_2026-08-24.md:69`: *"A live-versus-consumed status question about a registration is
answered **wrongly or not at all**."*

- **Wrongly:** `LEDGER.md:73` records `lap_2026-08-23.md` as *"its falsifier (E's 20-commit window) is
  LIVE and counting."* The instrument says the window is closed and the falsifier fired.
- **Not at all:** the LEDGER has a row for 1 of the 46 numbered registrations.

**The honest half of that second clause:** the LEDGER's declared universe is *files* — it was seeded
from a 45-file lifecycle audit (`LEDGER.md:3-4`). A journal registration is not a file, so this is not
carelessness; it is a **unit mismatch**. The room's only maintained index of open windows is indexed
by document, and its commitments live at a finer grain, in two other places, and sometimes only in the
index itself (§4). That is the structural answer to *why the denominator cannot be walked*, and it is
more useful than the count.

*Also measured, cheaply, and offered to whoever holds it:* **50 of 94 .md files in `exo_memory/loop/`
are not named in the LEDGER** (at 04:03; it was 48 of 92 forty minutes earlier — the two files that
landed in between, `gemini_channel_attack` and this census, are both unindexed, which is the point)
— though many are satellites the LEDGER names as a group
(`regime_preregistration.md / primes / item_rule / …`), so that figure is an upper bound on the gap
and not the gap. The ones that carry their own live commitments and appear nowhere in it include
`universe_print_registration_2026-08-25.md` (four dated falsifiers, scoring date 2026-09-24),
`turn_boundary_detection_2026-08-25.md`, `ch5_memory_sweep_2026-08-25.md` and
`corpus_rules_adversarial_2026-08-25.md` — all landed tonight, all invisible to the index until the
next lap's return leg.

---

## 7. THE ANSWER, AND IT IS PART REFUSAL

**Counted, with citations, and the arithmetic is shown because a total that cannot be re-added is a
hand-made figure:**

    45   numbered registrations, live          (46 in §5a minus #16, dead)
    34   named falsifiers in live registrations (§5b: 4+4+4+4+4+3+3+2+3+3)
     4   carriers, live                        (§5c: BOOT:66, BOOT:117, and BUILDING's two
                                                non-duplicate rows; LIBRARIAN:191 and BOOT:99 excluded)
    ---
    83   live commitments, as a FLOOR

**Of those, 3 are mechanized** — E's 20-commit window and BUILDING.md's two lap falsifiers, all three
by `lap-row.js --report` — plus 2 partials via `cite-check.js`, plus the 5 items in `open-items.js`,
**none of which is any of the 83.**

**So the ratio the chair asked for: 5 items have checks. At least 83 commitments exist. The five
intersect the eighty-three at zero.**

*Corrected before hand-back: the first draft of this paragraph published "30" and "8" for the second
and third lines, which do not sum to 83 and did not match §5b and §5c. The total was right by
accident of two offsetting errors. Caught by re-adding the column, not by reading it.*

**And the refusal, because it is the true part.** The set is **not** unbounded — that answer would be
too easy and it is wrong; the numbered sequence is complete, the loop directory is finite, the
carriers are five files. What is unbounded is the **phrasing**. §4 is the proof: a commitment written
without a marker word is invisible to this census, and the demonstration case was found not by
grepping but by reading an index — which does not scale, and which I did for four directories and not
for the code, the board, or the other machine.

**So the honest shape: the corpus is bounded and the vocabulary is not.** Any census built on words
returns a lower bound, and the number above is a floor with one measured leak in it. The fix is not a
better marker list — that is the patch-not-replace move F-U1 forbids. The fix is that a commitment
should not be findable by grep at all: it should be **registered somewhere an instrument reads**, the
way `lap.jsonl` holds three of them and is the only reason those three could be scored tonight.

---

## 8. WHAT THIS DOES NOT ESTABLISH

- **It does not establish that 83 is the number.** It is what one lexical walk over four directories
  found, with one demonstrated miss inside its own declared universe. Treat it as a floor.
- **It does not establish that the P-tier commitments are worthless.** *"Does the next entry cite this
  by path"* is a real test that a human can run in ten seconds. It establishes only that nothing will
  run it unprompted, which is a different and smaller claim.
- **It does not score any commitment except the three named in §6.** The tier column says what could
  check a thing, never whether the thing is true.
- **It did not walk the code, the board, the PTY, or the desktop.** Costs stated in §3, and the
  `carrier-drift.js` case shows the code root is not empty.
- **The M/I/P assignment for the 46 is mine and was made by reading each item once.** A second seat
  disagreeing on five or ten of them would not surprise me and would not move the headline, because
  the headline is the intersection with `open-items.js`, which is zero on any assignment.

---

## 9. REGISTERED, so this census can fail

**F-CENSUS-1 — THE FLOOR IS A CEILING IN DISGUISE.** If, by 2026-09-25, any seat produces a live
commitment from within my four declared roots that carries **none** of the §3 marker words and is
**not** the CH-4 case in §4, then one demonstrated miss was not one miss, the lexical rule is
unsalvageable, and this census must be **replaced by a registry** rather than re-run with more words.
*Adding markers in response is the degenerating move and is forbidden here by name.*

**F-CENSUS-2 — THE COUNT IS DECORATION.** If, by 2026-09-25, no commit message, hand-back, board row
or journal entry cites this file as the reason a specific commitment was scored, retired or
mechanized, then the census is a document about documents and should be attic'd, not extended.
Measure, excluding this file:

    grep -ril "commitment_census" exo_memory/ consonance/ --exclude=commitment_census_2026-08-25.md

**F-CENSUS-3 — THE FIRING WAS ALREADY KNOWN.** If a record predating 2026-08-25 03:00 is produced
showing E's falsifier was scored as fired, §6's headline is withdrawn and what survives is only the
LEDGER's stale row.

**ABUSE CONDITION, named in advance, per BOOT's rule.** The degenerating sentence for this line of
work is ***"the census found the gaps, so the gaps are being handled."*** An enumeration is not a
treatment. If a future entry cites this file as evidence that commitment tracking improved, without a
count of commitments that moved from I or P to M, that citation is the observation that marks this
degenerating.

**Who scores it:** not me — I authored it, and I authored `carrier_surface`, which is one of the
cases in §4. Pane C or E, whichever did not touch the P-UNIVERSE registration.

---

## 10. THIS DOCUMENT, RUN THROUGH THE ROOM'S OWN CITATION INSTRUMENT

    node consonance/tools/cite-check.js --run exo_memory/loop/commitment_census_2026-08-25.md

> `10 figure-bearing lines · 3 in a paragraph with a command · 7 not`

**Reported rather than fixed, with the reading for each of the seven:**

- **L229, L230, L237** are *quotations of an instrument's own output*, and the command that produced
  them is named three lines above the block. cite-check's paragraph rule does not reach across a
  blockquote. A real limit of the checker, not of the figure.
- **L133 (46 files), L180 (1 of 46), L292 (83)** are re-derivable from commands given elsewhere in
  this file, and are **not** re-derivable from a command on their own line. By the room's rule as
  written — every number in prose must re-derive from one run of a visible instrument beside it —
  these three are **hand-made where they stand**, and I am leaving them flagged rather than moving
  commands next to them, because the flag is the honest state and the move would only satisfy the
  checker.
- **L335 ("CH-4 case")** is a false positive: CH-4 is a channel label, not a count.

Two `NOT-RUN` lines are the checker trying to execute a `path:line` citation as a shell command.
Also a checker limit, and one worth someone's time: this file produced two of them in ten lines.

**Which makes §7 sharper, not softer.** A census of unchecked commitments, run through the one
instrument that checks citations, comes back with seven of its own figures uncited. **The tooling
does not reach the prose.** That is BOOT:117's standing entry, and this document is a fresh instance
of it rather than an exception to it.

---

*Nothing committed. Hand-back only; the chair commits with attribution.*
