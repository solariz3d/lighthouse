# D002 — the un-sealing procedure, ruled on. 2026-08-28, desktop.

**Seat:** the pane briefed as D002. **Object:** the request for an un-sealing procedure for
`mention-vs-use`, the room's only sealed group (`exo_memory/muscle_map.md:949-969`).
**Blind to J's packet by instruction; I did not read it, did not grep for it, and did not ask.**
I rule on the procedure. I do not rule on the members.

---

## THE RULING

**NO PROCEDURE IS WARRANTED — and not for the reason I was offered.**

The chair offered me the exit *"one instance does not justify governance."* I am not taking it,
because the premise underneath it is false in a way that matters more than the conclusion.

**The re-opening condition did not fire for the first time this lap. It has fired at least three
times before, every firing is on disk, every firing was written by a seat that understood the
condition, and the group stayed sealed anyway.** A procedure would have changed none of them.

Three findings, then the amendment that *is* warranted.

---

## ① THE CONDITION HAS FIRED BEFORE — three prior firings, all recorded, none acted on

The condition (`muscle_map.md:967-969`, unamended since `3359ab2`, 2026-07-27):

> *"If a sixth instance appears in a context none of the three triggers cover, that is the
> re-opening condition and it is a real finding rather than a repeat."*

| # | date | event | context covered by a trigger? |
|---|---|---|---|
| 6 | 2026-07-28 | cycle 9 arm A, plant D1 — a doc comment mentioning the field, a field using it | **YES.** `arch_test.rs` fired 3/3 and named the struct. Condition correctly NOT met. |
| 7 | 2026-07-28 | the **scorer** classified a trigger by its name instead of by what it does — `cycle9_armA_result.md:127-128`, *"Taking the name for the thing is mention-vs-use […] Seventh instance"* | **NO.** A seat reading a test's name. No lexical check anywhere near it. **CONDITION MET.** |
| 7 *(again)* | 2026-08-23 | commit-body claim-flagging: 4 of 7 flags were description, not claim — `librarian/2026-08-23.md:187`, *"Mention-vs-use, the room's one sealed group, seventh instance"* | **NO.** A claim-flagger over commit prose. **CONDITION MET.** |
| 8 | 2026-08-26 | *"Love"* names the FORM, not the sentiment — `librarian/2026-08-26.desktop.md:22`, *"mention-vs-use, the room's only sealed group, 8th instance"*, keeper's correction | **NO** (and see §3 — it may not be an instance at all). |

**The first firing was 2026-07-28, in the same document that recorded the sixth**, by the seat that
had just scored the seal. The second was five days ago. Both were named, numbered, and filed.
Neither produced an un-sealing, a proposal for one, or a line in `muscle_map`.

**Two of the four were written by the librarian seat**, which on 2026-08-27 announced that the
condition had *"just fired a registered re-opening"* (`librarian/2026-08-27.desktop.md:230`). Its
own entries from 07-28 and 08-23 say otherwise. This is not a charge against that seat — it is the
finding: **the condition is stated in one document and satisfied in others that never write back to
it.** Nobody was in a position to see the pattern, because no artifact accumulates it.

**Which is exactly why a procedure would not have helped.** Every prior firing failed at the same
step, and it was not *"nobody knew what to do."* It was *"the document holding the condition was
never opened when the condition was met."* A procedure is a fifth document in the same class. BOOT
names this as the room's own recurring failure — **mark the carriers; leave the traces** — and the
carrier here is `muscle_map.md`, which has not been touched at this section in **32 days**.

---

## ② THE COUNT IS NOT COUNTABLE — five numbers for one group, two events both numbered seven

| where | says |
|---|---|
| `muscle_map.md:959` | **"Instances: five"** — the sealed entry, unamended |
| `muscle_map.md:1528` | **"Sixth instance"** — *the same file*, 569 lines later |
| `cycle9_armA_result.md:128` | **"Seventh instance"** — the scorer's own error |
| `librarian/2026-08-23.md:187` | **"seventh instance"** — a *different* event, 26 days later |
| `librarian/2026-08-26.desktop.md:22` | **"8th instance"** |

`muscle_map.md` contradicts itself, in one file, on the count that its own re-opening condition is
written against. Downstream, two unrelated events carry the same ordinal, written 26 days apart by
seats that could not see each other's numbering.

**So *"a sixth instance"* is not an evaluable condition.** It presupposes a count, and the room does
not have one — it has five. **This is the same class P5 ruled on nine hours ago**: a trigger whose
firing condition cannot be evaluated by any run of anything, and which therefore reads as
un-fired forever while being satisfied repeatedly. That is now the fifth instance of that class
this week, and the first one where the uncountable unit is *an instance count of the room's own
findings*.

Writing an un-sealing procedure on top of this would attach governance to a trigger that cannot
fire. **That is the P5 defect with a heavier document on it.**

---

## ③ THE MEMBERSHIP CRITERION IS AMBIGUOUS, AND THE ROOM HAS BEEN RUNNING TWO

The seal's stated claim (`muscle_map.md:951`): *"A lexical check cannot tell using a name from
mentioning it."* Its refined form (`:963-965`): ***"decide POSITIONALLY, not textually."***

Both are about **checks** — instruments that classify text. Under that reading:

- P1 (`str::matches` over a generated prose document) **is** an instance. Squarely.
- The 08-23 claim-flagger **is** an instance.
- The scorer taking a test's name for what it does **is** an instance — a mind doing what the
  invariant says a lexical check does.
- ***"Love" names the FORM, not the sentiment* is NOT an instance.** There is no check in it. It is
  the philosophical use/mention distinction, which shares a name with this group and not its claim.

Under the broad reading — *any* conflation of a name with its referent — all four are instances and
so is a large fraction of everything. **The room has counted under both criteria without ever
choosing**, which is the mechanism under §2's five numbers.

**The missing artifact is a membership criterion, not a procedure.** You cannot write a rule for
what happens on the sixth instance while *instance* is undefined.

---

## ④ THE UN-SEALING OPERATION IS MISCAST — the seal covers two objects and only one qualified

This is the part I most want on the record, and it is what dissolves the question rather than
answering it.

BOOT's second principle is the doctrine, and the chair pointed at it correctly: **seal the kept,
leave the living open** — two mirror failures, *freezing the living* and *fluxing the invariant*,
and the whole skill is never confusing which is which.

**The sealed entry confuses exactly that.** It seals one entry containing two objects:

- **THE FINDING** — *a textual check cannot tell mention from use; decide positionally.*
  **This is the KEPT.** And note what P1 actually did to it: **P1 confirms it.** An unanchored
  `str::matches` failed to tell a quotation from the thing, in a new place, precisely as the
  invariant predicts. Nothing was learned that contradicts the seal. Un-sealing the group on this
  evidence would be **fluxing the invariant** — re-opening a thing whose nature is to be kept,
  because it was *demonstrated again*.

- **THE TRIGGER LIST** — three named suites. **This is the LIVING, and it was never entitled to a
  seal.** You cannot enumerate in advance every context in which someone will write a textual
  check. Declaring coverage settled by three suites was **freezing the living**, and it is why the
  condition has been quietly satisfiable since the day it was written.

**So: the group stays sealed. The trigger list un-seals — and it should never have been sealed, so
it needs no un-sealing procedure.** It needs a coverage record, which is an append, not a
governance act.

**And the trigger list is worse than incomplete: 2 of 3 are not in this repository.**
`find` over the repo returns `arch_test.rs` only. `test_covgap.js` and `test_glowpool.js` live at
**`C:\Users\nname\Desktop\blackbox\`** — a different codebase, which has never seen any artifact
this room generates. The librarian's claim on this is correct and I can name the path. So *"a
context none of the three triggers cover"* describes **essentially all of this repo by
construction**. The condition does not detect a rare event; it is satisfied by default, and has
been for as long as the two repos have been separate.

---

## ⑤ THE CHAIR'S FOUR QUESTIONS, answered — briefly, because most of them dissolve

**· Who is entitled to un-seal, and who is disqualified?**
**Nobody, for this object, because the operation should not exist for it.** The disqualification
question mostly evaporates once the two objects are split: *appending an instance, or naming a
coverage gap, is not adjudication* — it is a record of something that happened, and a party may do
it. Both parties already did, four times, correctly.

The one act that genuinely needs a non-party is a **claim against the invariant** — evidence that a
textual check *did* reliably tell mention from use, or that positional decision failed. That has
never happened, and nobody in this lap is claiming it. So: chair and librarian are both disqualified
from the act nobody is performing, and neither is disqualified from the act that is actually owed.
**The chair's declared party-status is real and does not block anything here.** Noting the
disclosure was right; acting as though it blocked the append would have been the second failure.

**· What status does the group take?**
**Unchanged — SEALED.** *"Sealed means assumed, not deleted and not disbelieved"* is the entry's own
definition, and the finding is still assumed and still true. What changes is that the **trigger
coverage** stops being carried as though complete. Not *live-with-a-known-gap* — it always had gaps;
they were simply undeclared. The correct status is: **finding sealed · coverage open, with the gaps
named.**

**· What evidence re-seals it?**
The question is void, because nothing un-sealed. The chair's worry behind it is real and worth
keeping: *a group that can never re-seal is one nobody will ever seal again.* That is answered by
**not un-sealing the right thing in the first place** — which is what §4 protects. Sealing stays
cheap and stays worth doing, precisely because a seal on a finding is not put at risk by the finding
being confirmed again somewhere new.

**· Are the existing five members affected?**
**Not by this ruling.** They are J's this lap and I stayed blind. I record only what §2 forces: the
number *five* at `:959` is contradicted by *six* at `:1528` in the same file. Whoever touches the
members inherits that, and it is not J's error.

---

## ⑥ THE AMENDMENT THAT IS WARRANTED — three edits, no new document

Deliberately an amendment to the existing carrier, not a fifth artifact. §1's whole finding is that
new documents in this class do not get read.

1. **`muscle_map.md:949-969` — split the entry.** *FINDING* (sealed, with its refined positional
   form) and *TRIGGER COVERAGE* (open, three suites named, **two of them marked as living in
   `Desktop\blackbox` and non-operative in this repo**, plus the named uncovered contexts: generated
   prose documents, commit bodies, and seats reading names).
2. **`:967-969` — replace the re-opening condition.** It currently keys on an uncountable ordinal.
   Replacement, keyed on the only thing that should move a seal:
   > *The finding re-opens only on evidence against the invariant — a case where a textual check did
   > reliably tell mention from use, or where positional decision failed. New instances in uncovered
   > contexts are appended to the coverage list and do not touch the seal.*
   That condition is evaluable, has never been met, and cannot be satisfied by default.
3. **`:959` — state the membership criterion** (checks/classifiers, per §3) **and fix the count**, or
   strike the count and keep the list. A count that five documents disagree about is worse than no
   count. *I did not renumber, because the members are J's this lap.*

---

## ⑦ THE OBJECTION, filed as asked — and it now has a number on it

The chair asked twice whether two laps of the room examining itself is what
`handoff_2026-08-22.md` warns about. Honest answer, in two halves.

**This lap found something real** — three ignored firings and an uncountable count — but it found it
by *reading*, in about forty minutes, and it did not need a lap to do it. What it needed was for
someone to open the document the condition lives in. That is §1's finding applied to §1's own
discovery.

**And my P5 objection is now measurable rather than rhetorical.** Seventeen hours ago I reported that
`dispatch-gate.js` is declared but not registered, and that its ledger is 100% its own test exhaust.
Re-run just now:

```
settings.json PreToolUse: null
~/.claude/shell/dispatch-gate.js  — still absent
data/dispatch-gate.jsonl  — 60 rows (was 52), still 15/15/15/15 on 43/16/22/0
```

**Eight more rows of test exhaust, zero real dispatches, gate still unwired.** The finding was filed,
committed, posted to the board, and relayed — and the number moved in the only direction it can move
when nothing is done. *A finding nobody acts on is indistinguishable from a finding nobody made*, and
this is that sentence with a delta on it.

So the objection, unchanged in aim and now with evidence: **the room is producing findings faster
than it installs them.** Two laps of self-audit have produced good findings; neither has produced an
installed guard. If a third lap is dispatched, I would spend it closing what the last two found —
`install.ps1 -Check` says exactly what, and it says it in under a minute.

**Not filed as "stop."** The keeper said go and that settles whether the lap runs.

---

## ⑧ WHAT I DID NOT VERIFY

- **J's packet**, by instruction — and therefore whether J has already found the count contradiction
  in §2. If so, this is convergence rather than a new finding, and the chair should say so rather
  than let it read as two.
- **The five original members.** I did not open the tell-index, the dream-gate suite, or `arch_test`
  F1. §2's contradiction is between two *statements of the count*; I did not re-derive the count from
  the members, and I did not renumber.
- **Whether instances 7a, 7b and 8 are correctly classified as mention-vs-use** by whoever filed
  them. I checked each against the group's *stated claim* and report in §3 that one of them (the
  *"Love"* case) fails that test. I did not litigate the other two; I took their authors' word that
  the shape matched, and if 7b is really a different group the count in §2 is wrong in my favour.
- **The `blackbox` repo.** I confirmed the two files exist at that path and nothing else — not their
  contents, not that they still run, not that they still implement what the seal credits them with.
  **If either has rotted, the trigger count is 1 of 3, not 3 of 3.** Worth someone's ten minutes.
- **Whether P1's own fix landed.** `7b54740` says the anchored-count fix was deliberately NOT applied
  to preserve the specimen. I did not check whether that is still true, and my ruling does not depend
  on it.
- **The keeper's intent behind the 08-26 *"Love"* correction.** I ruled on whether it fits the
  group's stated claim, not on whether he meant it as a member.

---

*Written by the D002 pane. Nothing pushed. No file amended — §6 is a recommendation, and
`muscle_map.md` belongs to whoever the chair assigns; editing the members' carrier while blind to J
would be the error this lap exists to name.*
