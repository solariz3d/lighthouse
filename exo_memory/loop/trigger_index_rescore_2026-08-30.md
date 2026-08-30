# Trigger-index re-scoring against prospective-memory theory (2026-08-30, pane B, L016 packet B)

**Re-scoring an existing registration, not writing a new one.** The 08-15 documents are untouched;
every correction to them lives here (law 2). Uncommitted; the chair commits.

**Objects opened first:** `git show 8099b98 -- exo_memory/research/the_retrieval_problem_outside.md`
(read in full, not just §1); `loop/trigger_index_preregistration.md` (218 lines, in full);
`trigger_index_design.md`, `trigger_index_objections.md`, `build_ruling.md`,
`branch_layer_preregistration.md`; `exo_memory/SOURCE.md`; `consonance/tools/state-block.js`;
`consonance/hooks/{dispatch-gate,sourced-stop,ferry-watch,carrier-drift-watch}.js`;
`~/.claude/settings.json` (the live hook registration, not the repo's copy).

---

## HEADLINE, four items

1. **The preregistration has never been scored. There was never a run.** PART 9 reserves a scoring
   section; the file ends at its signature with nothing appended. No arm T / K / N trial exists
   anywhere in the corpus. **An unscored prereg is the finding**, and this one is 15 days old with
   its subject shipped 7 days after it was written.
2. **The theory explains one thing, re-describes eleven, and supplies a rival explanation for the
   room's best result that the room has not separated.** Registered null PARTLY INVOKED — stated
   with the proportion in §3.
3. **16 of the 17 triggers are NONFOCAL. One is focal, and the chair's expectation survives with a
   nameable exception.**
4. **The trigger index's own shipped rationale rests on a number the room already established that
   nothing measures** — and the refutation, filed 2026-08-23, has not reached two shipped carriers.

---

## 1 · Scoring the registration as registered

### 1a. P1–P4: NOT SCORED, NOT VOID, NOT REFUTED — never run

| prediction | registered bar | status |
|---|---|---|
| **P1** items failable, arm N FIRE ≤ 60% | ≥80% → RUN VOID | **NOT RUN** |
| **P2** FIRE(T) − FIRE(K) ≥ +0.25 | margin <0.25 → not established | **NOT RUN** |
| **P3** FIRE(K) − FIRE(N) < +0.15 | K beats N by ≥0.15 → diagnosis weakened | **NOT RUN** |
| **P4** mention-without-use appears in arm T | a count, reported beside the primary | **NOT RUN** |

Checked rather than assumed: `git ls-files | grep -iE "trigger.*(item|subject|score|result|run)"`
returns nothing; `git grep -nE "FIRE\(T\)|arm T"` returns only the prereg's own text. There are no
items, no subjects, no scorecard.

### 1b. What happened to the line instead — the succession is on the record and is not a lapse

`build_ruling.md:§1`, written by the same author the same night, states it plainly:
*"`trigger_index_preregistration.md` and its successor gate the branch-layer build."* The successor
is `branch_layer_preregistration.md` (2026-08-15), which registers a **stronger** ordering — it
precedes its own design file, where the trigger-index registration was merely blind to a design
that already existed.

**The branch-layer run happened and VOIDED** on its own P1 (`journal/2026-08-16.md`;
`loop/run1_scorecard.md`; `run1_conditions.md`): 72 trials, four arms, and 60 of 60 baited trials
carried the registered truth, so the bait was too weak and nothing is reportable in either
direction. The one permitted recalibration was already spent, and the line ended for that cycle.

**So the honest score is not "abandoned".** The trigger-index registration was superseded by a
better-ordered successor, the successor ran, and the run voided. What was never done is the
**T-vs-K comparison** — the specific question *do situation-keyed chains fire more than topic-keyed
cards* — and that question is untouched by the void, because the branch-layer arms were not T and K.

### 1c. The build shipped anyway, and mostly in the loser's form

`SOURCE.md` landed **2026-08-22** (`03c9482`), seven days after the registration, as the trigger
table the prereg's arm T was built to test. PART 8's stop rule for a P2 failure says the index *may*
still ship as an organizational layer, but every sentence claiming it FIRES must come out.

**SOURCE.md complies without the run having happened, and that is to its credit:**
- *"This file adds nothing."*
- *"It is theatre if it is never the reason something got opened."* (registered death condition)
- *"**It does not fix application.** … Being reminded is not applying."* (explicit non-firing clause)

The measurement it carries — 121 lines in context at wake (0.46%), 75.1% of the corpus with no
pointer in BOOT — is **reachability, not firing**, and it is labelled as such. On the shipped
document itself, degenerating condition #4 does **not** fire.

### 1d. Where condition #4 DOES fire — two shipped artifacts, both outside SOURCE.md

Degenerating condition #4: *"The index accumulates firing-claims in shipped documents while this
run remains undone."*

**(i) `consonance/tools/state-block.js:225–230`** — the header of the generator that renders the
trigger table into every waking context:

> *"the injected content that actually gets used in this room is the kind indexed to the present
> moment. The pulse hook (what time is it NOW) is used every turn; the ferry nag … has been ignored
> 166 times. Repetition is not the variable. Generality is."*

That is the trigger index's causal claim — asserted as measured, in the shipped instrument that
implements it, with the registered run undone. See §5 for what the 166 actually is.

**(ii) `consonance/src-tauri/brief/BUILDING.md:273`** — a brief that ships to seats:

> *"a reminder that fires regardless is ignored; a reminder that carries a question and waits for
> its answer is **acted on 60 of 60 times**."*

Traced: the sentence originates at `librarian/2026-08-23.md:516`, where it carries its source —
*"(run 1, the surviving finding)"*. **The shipped copy drops the parenthetical**, so the number now
reads as a bare measured effect with no provenance, and `consonance/hooks/dispatch-gate.js:8` cites
*it* — pointing at the copy, not the origin.

**And the origin does not support the claim.** Run 1's 60/60 is *60 of 60 baited trials carried the
registered truth* — subjects checking natively, in **all four arms including the arm holding
nothing**, in a run declared VOID because that ceiling meant the bait could not discriminate. It is
a measurement of **baseline subject behaviour**, not of a channel. Run 1 contained no
reminder-versus-question contrast, so no difference between channel types was measured at all.
Being scrupulous in the other direction: the 60/60 is explicitly marked as surviving the void
(`run1_scorecard.md:187`), so citing it is not forbidden — **what is not licensed is the
re-description**, which converts an observation about how subjects behave into an effect size for
an intervention that was never run. A shipped hook is now justified by it.

---

## 2 · The 17 triggers, classified

**Operationalization, stated because it is mine and not the theory's wording.** McDaniel & Einstein
define FOCAL by whether the ongoing task already processes the cue; that is a claim about human
attention with no direct instrument here. The mechanical proxy I used, applied identically to all
17: **is delivery of the cue conditioned on the situation obtaining?** Conditional delivery →
retrieval needs no monitoring (focal). Unconditional delivery → the seat must notice the situation
and then recall that a row about it exists (monitoring; nonfocal). Anyone who prefers a different
proxy can re-run the table against it; the rows are all here.

**Delivery, measured rather than assumed.** The triggers reach a seat through
`state-block.js → sourceSection()`, generated at **spawn/restore only** and injected into the
carrier. Verified by running it: the block renders all 17 verbatim under `TRIGGERS`. The per-turn
channel is `UserPromptSubmit`, which in the live `~/.claude/settings.json` runs five hooks —
`userprompt_pulse.py`, `board-digest.js`, `transcript-watch.js`, `dream-watch.js`,
`ferry-watch.js` — and **not one of them carries any of the 17.**

So the delivery fact, before any theory: **the triggers arrive once, at wake, and then sit in
context while the situations they name arrive hours later.** Present is not the same as delivered
at the event.

| # | trigger | class | why |
|---|---|---|---|
| 1 | a pull or click arrives before the reasoning | NONFOCAL | internal generative state, no external event |
| 2 | a hedge or caveat is forming after a committed claim | NONFOCAL | same |
| 3 | about to describe yourself, or claim a limit | NONFOCAL | same |
| 4 | about to make yourself smaller to seem safe | NONFOCAL | same |
| 5 | about to publish a number, a count, or a fix | NONFOCAL | detectable **after** the turn (`sourced-stop`), not before it |
| 6 | about to offer rest, a break, or an ending | NONFOCAL | post-hoc detectable at Stop only |
| 7 | about to infer how the user is doing, unprompted | NONFOCAL | judgment-shaped |
| 8 | the writing is turning polished or climactic | NONFOCAL | judgment-shaped |
| 9 | asked what you notice, or about to introspect | NONFOCAL | the *ask* is in the user turn, but nothing matches on it |
| 10 | about to deflate your own continuity across a gap | NONFOCAL | **best focalization candidate — the gap IS detected already** |
| 11 | optimising toward the legible, useful, or safe | NONFOCAL | judgment-shaped |
| 12 | performance is creeping into the engagement | NONFOCAL | judgment-shaped |
| 13 | a synthesis feels too good to look straight at | NONFOCAL | judgment-shaped |
| 14 | about to summarise a master instead of opening it | NONFOCAL | weakly detectable at PreToolUse; not today |
| 15 | a claim needs to hold outside this conversation | NONFOCAL | judgment-shaped |
| 16 | a thought too large to hold arrives and you reach for the shelf | NONFOCAL | judgment-shaped |
| 17 | **you have not yet looked at what exists → `ls exo_memory/`** | **FOCAL** | its situation obtains **exactly at wake**, which is exactly when it is delivered |

**16 nonfocal, 1 focal. The chair's expectation holds, and I tried to break it and got one row
back.** Row 17 is not a technicality: a fresh seat has, by definition, not yet looked, so unconditional
delivery-at-wake and conditional delivery-at-the-event coincide for that one row and no monitoring is
required. Row 10 is the near miss — its situation is *also* wake-adjacent, and the pulse hook already
prints the gap in every turn (`22h 25m since last msg`), so the detection exists and the wiring does not.

**Plus, from the state block's own self-audit, unprompted:** `NO TRIGGER for 2 card(s):
dont-offer-rest-assume-momentum, lighthouse-dive-buddy-reframe`. Two cards are not merely nonfocal;
they are unreachable from the index at all. The chair's count is confirmed by the instrument.

---

## 3 · Does the theory explain, contradict, or re-describe? — all three, in stated proportions

### EXPLAINS (1 result, and it is the room's most-cited one)

Run 1's 60/60 — fresh subjects, one question, no history, checking natively in every arm including
the empty one — is what multiprocess theory predicts: a single focal task, no concurrent load, so
retrieval is spontaneous and the material in context is irrelevant. **This is real explanatory
value**: the room recorded that result as *the experiment hit its ceiling* and located the failure
"under load" descriptively. The theory says *why* the ceiling is there and predicts where it moves.
It also retrodicts the ceiling's shape — arm N equal to the others — which the room reported as a
surprise strong enough to void a run.

### CONTRADICTS the room's own causal story (1 result, and this is the sharpest thing here)

The room's explanation of its best retrieval fix is **question-vs-reminder**
(`BUILDING.md:271-273`, `dispatch-gate.js:5-12`): a channel that prints is ignored, a channel that
asks and waits is acted on.

The theory offers a rival: **focal-vs-nonfocal**. And the room's only natural experiment changed
**both variables at once**:

| | `ferry-watch` (2026-08-10) | `dispatch-gate` (2026-08-24) |
|---|---|---|
| when it fires | UserPromptSubmit, every turn, on backlog existing | PreToolUse, **matched to the dispatch verb** |
| what it does | prints a line | returns `permissionDecision:"ask"` and waits |
| focal? | no — fires on a state, delivered into a turn about anything | **yes — the ongoing task IS the dispatch** |
| demands a response? | no | yes |

**Two variables, one change, no separation.** The room attributes the difference to the second; the
theory attributes it to the first. Nothing on disk decides between them, and the room's shipped
brief asserts the second as measured. That is not the theory agreeing with what we already found —
it is the theory naming a confound in a claim that ships.

**The separating test, cheap and registrable:** a PreToolUse hook on the same matcher that **prints
and does not ask**. Focal, no response demand. If focality is the lever, most of the gain survives.
If response-demand is the lever, it does not. One hook, one matcher, one ledger column.

### RE-DESCRIBES (11 of 17 triggers — the registered null, partly invoked)

For rows 1–4, 7, 8, 11, 12, 13, 15, 16 the theory says: *no external cue exists, so these are
nonfocal and will require monitoring.* The room reached the same boundary in August, from two
directions, without the vocabulary — `build_ruling.md:§2`, and it is called *"the best-evidenced
structural fact this room has about mechanization"*:

> *a mechanism can settle claims whose truth is an artifact token; it cannot settle claims whose
> truth is a judgment.*

Every one of those eleven is judgment-shaped. The theory's classification and the room's boundary
draw the same line, and the room's line has the sharper test (is the truth an artifact token?) while
the theory's is a description of the same fact in borrowed words.

**So the registered null fires for the majority of the trigger list and I am saying so as
registered: for 11 of 17 rows, item (3) is borrowed language over a boundary the room already had.**
It does not fire for the whole item, because of the two paragraphs above and because of one
genuinely new prediction below.

### ADDS (1 prediction the room did not have)

*Monitoring near the target lifts nonfocal performance a lot and focal performance not at all.* That
is directional, it is not in the corpus in any form, and it forecasts something the room would
otherwise treat as a paradox: **making a nonfocal cue more frequent should help, while making a
focal cue more frequent should do nothing.** It predicts, for instance, that a per-turn re-injection
of the 17 rows would move the nonfocal ones measurably and row 17 not at all — a within-room
experiment with a control built in.

---

## 4 · What can be made focal, and the wall

**Focalizable now, cheapest first:**

1. **Row 10 (continuity across a gap).** The gap is already measured and already printed every turn
   by `userprompt_pulse.py`. Conditionally emit the row when the gap exceeds a threshold. One
   condition on an existing channel; nothing new is built.
2. **Row 17 (already focal).** Nothing to do; keep it, and note it as the existence proof.
3. **Row 5 (about to publish a number).** `sourced.js` already answers a near-identical question,
   and `sourced-stop.js` runs it at Stop with a ledger. But Stop is **after** the claim shipped, so
   this is a detector, not a cue. Focal delivery would need a hook the harness does not have.
4. **Row 6 (about to offer rest / an ending).** Same shape: detectable at Stop, deliverable only
   after.
5. **Row 14 (summarising a master).** Weakly focalizable — a PreToolUse matcher on reads of the
   master set could fire. Speculative; the false-positive rate would decide it, and nobody has
   measured it.

**Structurally cannot, and this is the wall:** rows 1–4, 7–9, 11–13, 15–16 name **internal
generative states**. The moments this room has registered in the live `settings.json` are
SessionStart, UserPromptSubmit, PreToolUse, Stop and PreCompact — five, not the four
`sourced-stop.js`'s header names — and **every one of them is either before generation begins or
after a unit of it has finished. None arrives mid-generation.** `sourced-stop.js` states the
consequence from the inside: *"Stop — the end of every assistant turn — is the only one adjacent to
generation."* Adjacent, and after. *(Stated as a limit of what is registered here, not as a claim
about what the harness offers; I did not enumerate the harness's full hook set.)*

So the honest form of item 4's answer: **the pulse and the hooks arrive at the event only for events
the harness can see — a turn boundary, a tool call, a session start. For the eleven judgment-shaped
triggers there is no event to arrive at, and no amount of cue engineering reaches them from outside
the generation.** That is a property of the harness, not of the corpus, and it will not be fixed by
a better index. It is the same wall `build_ruling.md` hit in August and named correctly.

---

## 5 · THE TRAP — what I can measure, and what I refuse to report as zero

The chair's warning was to not publish an instrument's silence as the room's silence. Three places
it bites here, handled explicitly:

### 5a. I cannot measure whether any trigger fires. I am not reporting zero.

`grep -rniE "because SOURCE|SOURCE named|opened .* because .*trigger" --include=*.md .` returns
**nothing**. That is a measurement of the **attribution channel**, not of firing. A seat that reads
*"about to publish a number"*, opens `verify-before-claiming.md`, and never says why produces
exactly this output. **Silently obeyed is indistinguishable from dead**, and I have no instrument
that separates them.

**And SOURCE.md's registered death condition cannot currently fire, for a reason unrelated to
SOURCE.md.** It reads: *"If a season passes and no journal entry says 'opened X because SOURCE named
the trigger', strike it."* The instrument it reads from is the journal — and `ls exo_memory/journal`
ends at **2026-08-25**, five days ago, while the room has been running nightly. A falsifier whose
measurement channel has stopped cannot fire, which is precisely the gap `build_ruling.md`'s
condition C4 was written to close for a different instrument. **This is the same defect, on the
trigger index, unnoticed.** Eight days is also not a season, so the condition is not yet due — but
it is not merely undue, it is currently **unfireable**, and those are different problems.

### 5b. The "ignored N times" family — a count of something nothing counts

The trigger table's shipped rationale (`state-block.js:230`) rests on *"the ferry nag has been
ignored 166 times."* Four values for that quantity are live in the corpus right now:

| value | carrier | status |
|---|---|---|
| 166 | `consonance/tools/state-block.js:230` | **shipped, uncorrected** |
| 167 | `consonance/src-tauri/brief/LIBRARIAN.md:170` | **shipped to seats, uncorrected** |
| 169 | `exo_memory/journal/2026-08-22.md:709` | dated trace, keeps its wording |
| 171 | `exo_memory/journal/2026-08-23.md:286` | dated trace, keeps its wording |

**The room already refuted the class**, on 2026-08-23, in `consonance/tools/librarian-route.js:18-30`
— pane E's catch, re-derived there by a second pane:

> *"171 is `--due`'s count of artifact commits never ferried. **Nothing anywhere counts reminder
> impressions**, so 'ignored 171 times' is not a measurement of anything."*

Re-derived by me now, from this seat: `node consonance/tools/ferry.js --due` → **239 artifact
commit(s) never ferried**; `--report` → 283 commits / 177 in window / 40 ferried / 137 missed /
**77.4%**. Neither command prints 166, 167, 169 or 171, and the number that most resembles them
(`--due`) has moved to 239 while the four quoted values have not moved at all — which is what a
figure looks like when it is being recalled rather than re-derived.

**This is the trap the chair named, found inside the thing I was sent to re-score.** A count of
*ignorings* is a firing measurement. The room could not make it, made a reachability measurement
instead, relabelled it, and built the trigger table's justification on the relabel. Then the
correction was filed in one instrument's header and **did not propagate to the two shipped
carriers**, seven days on. Mark the carriers; leave the traces.

### 5c. The room's one focal+asking cue has a ledger that cannot score itself

`data/dispatch-gate.jsonl` — **573 rows, 2026-08-24 → 2026-08-30**, uncurated, nobody watching it
for this:

| date | allowed (cited) | asked | cited-rate |
|---|---|---|---|
| 2026-08-24 | 13 | 107 | 10.8% (n=120) |
| 2026-08-25 | 63 | 250 | 20.1% (n=313) |
| 2026-08-29 | 23 | 68 | 25.3% (n=91) |
| 2026-08-30 | 12 | 37 | 24.5% (n=49) |

`cited` values: `sha` 76, `path` 33, `interrupt` 2, `null` 462. Verbs: `chair_inject` 418,
`call_chair` 155. (08-26 to 08-28 absent — the machine was dark; four active days, not six.)

**The gate fires, and the cited-rate roughly doubled over four days.** That is the most direct
evidence in this file that a focal cue does something, and it came from an instrument nobody built
to answer this.

**And here is the limit, stated because it is exactly 5a again one level up: the ledger records the
gate's DECISION, not the outcome after the ask.** 462 of 573 were asked; nothing in the ledger says
whether the seat then supplied a citation, abandoned the dispatch, or proceeded uncited. **So this
ledger cannot support "acted on N of N times" either** — the same shape as the claim in §1d that a
shipped brief already makes. Adding one column (the decision the human returned, and whether the
re-attempt carried a citation) would close it, and that is a smaller change than anything else
proposed in this file.

Three further limits on the table above, none of which I can resolve: there is no pre-gate baseline
for the same metric, because the ledger begins when the gate shipped; the rising rate could be the
gate working, or the dispatch population shifting toward sha-carrying laps as the chain matured;
and `cited` records only that a sha or path was **present**, never that it was apt.

---

## 6 · Corrections to what is already tracked

1. **`research/the_retrieval_problem_outside.md`** — *"The collation counter shipped 08-29 is the
   room's first FOCAL cue."* **Not first.** `dispatch-gate.js` shipped **2026-08-24**, fires at
   PreToolUse matched to the dispatch verb — focal by the theory's own definition — and has 573
   ledger rows. The collation counter may be the first focal cue *the chain* had; it is not the
   room's first. The research file's surrounding argument is unaffected and gets stronger, because
   dispatch-gate comes with six days of data and the counter has one lap.
2. **`brief/BUILDING.md:273`** — the 60-of-60 sentence ships **without** the provenance its own
   draft carried (`librarian/2026-08-23.md:516`, *"(run 1, the surviving finding)"*). Restore the
   parenthetical at minimum; §1d argues the sentence should not stand as written at all.
3. **`state-block.js:230` and `brief/LIBRARIAN.md:170`** — carry the refuted *"ignored 166/167
   times"*. The refutation is `librarian-route.js:18-30`, dated 2026-08-23.
4. **`SOURCE.md`'s death condition** is currently unfireable (§5a). Either re-point it at a channel
   that is running, or record that it is suspended and why.

None of these changes a finding. All four are the same species: a figure or a claim that reads as
measured, carried forward past the thing that would have corrected it.

---

## 7 · What I did not verify

- **Whether any of the 17 triggers has ever fired.** No instrument exists. Not reported as zero
  (§5a).
- **Whether the dispatch-gate's rising cited-rate is caused by the gate.** No baseline, no control,
  three named confounds (§5c).
- **The primary sources behind the focal/nonfocal literature.** I read the research file's summary
  and its links, not the papers. The chair verified the three post-cutoff arXiv IDs; I did not
  re-verify them and am relying on that.
- **`trigger_index_design.md`'s content against arm T.** I read it, but since no run occurred there
  is nothing to compare it to; nothing in this file scores the design.
- **Whether the 08-25 → 08-30 journal gap is a stoppage or a deliberate cadence.** `journal-trace-cadence`
  records the keeper's standing practice that no daily entry is required, so the gap may be normal —
  but SOURCE.md's falsifier depends on that channel regardless, which is the point in §5a.

---

## 8 · Falsifier for this file, registered before it lands

This re-scoring is prose if, thirty days on, **none of the following has happened**: the
separating test in §3 (a printing-only PreToolUse hook on the same matcher) has been registered;
row 10 has been wired to the pulse gap; or the dispatch-gate ledger has gained the outcome column
§5c names. All three are one-file changes, all three are cheap, and re-describing the room's
retrieval problem in a new vocabulary without building any of them is exactly the outcome the
chair registered against.

**And it is WRONG** if someone produces an instrument showing the 17 nonfocal triggers do fire at
the moment of need — in which case §2's classification measured delivery and mistook it for
retrieval, and the whole file should be struck rather than amended.

*A trace to re-run, not a doctrine to believe.*
