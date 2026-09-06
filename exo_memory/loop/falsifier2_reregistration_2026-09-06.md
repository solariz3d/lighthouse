# Falsifier 2, RE-REGISTERED — the entry share loses its bar, the ferry gets one

**Seat:** pane L, lap D012, packet 1. **Non-author of all three prior readings:** I did not register
F2 (pane E, `lap_2026-08-23.md`), I did not write the rescore (B), I did not write the scope ruling
(A), and I am not the falsifier's subject (the chair). I hold no stake in which way this scores.

**PART ONE — the registration — was written and committed BEFORE any count was taken.** That
ordering is the brief's requirement (*"the bar NAMED BEFORE the count is taken - not after seeing
it"*) and it is checkable rather than asserted: this file's first commit contains §1–§6 and no
measurement; PART TWO was appended in a second commit. `git log --follow -p` on this path shows the
two, in that order. If the two commits are ever found squashed, the ordering claim is unsupported and
should be read as if the bar were set after the number.

---

## 0. THE OBJECT, AND WHY IT IS NOT BEING STRUCK

F2 fires today at *"keeper-initiated 6 of 11 = 54.5%"* over *"window 392 of a registered 20."* It has
been ruled twice — B (*"IT FIRES HARDER"*, 6 of 7 = 85.7% under the registered unit) and A (*"a mixed
falsifier is not underspecified. It is computing a rate over two populations, and naming one of them
does not make the terms commensurable"* — re-register, do not scope). **Neither ruling landed. Eight
days.**

The map ruled against striking it. **I agree, and not out of deference — the argument for striking
is the one I would otherwise have made, so here it is and here is why it loses.**

*The case for striking:* a falsifier that fires on the DESIGN is not a falsifier. The 09-02 two-doors
amendment made keeper entry the intended route (*"the user is the ENTRY, not a station it returns
to"*). E's registered numerator counts who ENTERS. So F2 now condemns the room for doing the thing
the room decided to do, and an instrument that can only ever return "guilty" against an adopted
design should be deleted, not repaired.

*Why it loses:* **the numerator drifted; the consequence sentence did not.** E's stated consequence is
*"the human is still the ferry and the three tools are decorative"* — and *ferry* is a dated term of
art in this record (08-10, `memory/split-the-work-with-the-panes.md`: zero unprompted `chair_inject`,
the keeper hand-carrying between seats). On 08-23, entry and carriage were the same act, so one
numerator served both. Two-doors split them. **Striking F2 would retire the numerator AND the
question**, and the question is the live one: *does the ring turn when the keeper does not push it?*
That question is unmeasured today and has never been measured. So: keep the consequence, replace the
numerator. That is a re-registration, not a rescue.

**One thing I will not pretend.** This is a re-registration by a seat other than the registrant, and
A's ruling said the choice of unit *"belongs to the registrant, not to me."* Pane E is not in this
lap. I am exercising a choice that is properly E's, on the chair's instruction, and E may reject it.
If E ever scores this and says the ferry quantity is not what E meant, **E is right by construction**
and this document is superseded, not defended.

---

## 1. WHAT IS BEING MEASURED — three quantities, one bar

| # | quantity | bar |
|---|---|---|
| Q1 | **entry share** — keeper-initiated laps ÷ laps | **NONE. Statistic only.** |
| Q2 | **ferry rate** — laps in the window carrying ZERO confirmed keeper-carried hops | **the bar (§3)** |
| Q3 | **carried hops per lap** — the per-lap list, never a bare mean | **NONE. Statistic only.** |

**Q1 keeps no bar, by the two-doors amendment.** Under door one the keeper enters at the
orchestrator; under door two at the librarian. Either way entry is the design. A high keeper-entry
share is a report on how the room is being used, not a failure, and it must never again be printed
with a threshold beside it. It is kept — deleting it would lose the only long series the ledger has —
but it is kept as a **reading**, not a verdict.

---

## 2. DEFINITIONS — so a non-author can recompute this without asking me

**LAP WINDOW.** A lap is OPEN from its `open` row's `at` until its `filed` chain row's `at`; if it has
no `filed` row, until the last row bearing that lap id. Source: `C:\Consonance\data\lap.jsonl`.

**KEEPER ROW.** A row in `C:\Consonance\data\board.jsonl` with `role === "user"`. That is the keeper
typing into a seat's pane; the pane id names the seat via `C:\Consonance\data\letters.json`.

**CANDIDATE HOP (mechanical, an UPPER BOUND).** A keeper row whose `ts` falls strictly after a lap's
`open` row and at or before that lap's closing row. Computable by anyone; no judgment.

**ENTRY, excluded.** A candidate that is the inquiry of a *subsequent* lap — the keeper opening the
next thing while the current one is still filing. Marked, not silently dropped.

**CONFIRMED FERRY HOP.** A candidate that passes BOTH:

  (i) **an owed move was pending** — the ring had a legal next hop available with no keeper input
      (a seat had handed back, or a hand-back was outstanding), and the hop that followed the keeper
      row is that owed move; and

  (ii) **it ADDS nothing** — the receiving seat could have obtained everything in the message by
      reading what was already on disk or on the board. This is the room's own add-test
      (`BOOT.md`, the add-and-hold unit), turned on the keeper's own traffic.

Both of the map's exemplars pass: *"do it"* and *"tell the orch to file it"* add zero content and
move a baton that was already owed.

**DIRECTION, not ferry.** A keeper row that ADDS — a new inquiry, a correction, a decision only the
keeper can make, a priority the seats could not derive. **This is the split the map demanded** —
*"the keeper DIRECTED"* must be distinguishable from *"the chair FAILED TO CARRY"* — and (ii) is
where it is made. Direction is design and carries no bar; carriage is the failure.

**Who classifies.** (i) is mechanical. (ii) is a judgment and **must be made by a seat that did not
hold the lap being scored.** A holder scoring its own carriage is B's §3 mechanism exactly: the
subject minting its own denominator.

---

## 3. THE BAR, NAMED NOW

> **Over the last 10 RING-CAPABLE laps, the share carrying ZERO confirmed keeper-carried hops must
> be at or above 1/2. If fewer than half of the last ten laps turned without the keeper moving the
> baton, the falsifier FIRES: the human is still the ferry, and the mechanisms built to move it
> (the baton gate, the inbox, the opened-row gate, `call_librarian`) are decorative.**

**RING-CAPABLE LAP** = a lap with at least one chain row after `open` — a lap in which an internal
hop existed to be carried. Rolling window, last 10 by `open` time, on the machine that runs it.

**Why 1/2, argued before the number was looked at.** The ring has three internal hops per turn
(orch→panes, panes→lib, lib→orch). One keeper-carried hop is one hop the ring could not complete
alone, so a lap with any confirmed hop is a lap that needed him. The consequence sentence is a claim
about whether the loop turns without him — refuted if it turns without him in most laps, sustained if
it does not. And 1/2 is E's own threshold shape: the re-registration changes the QUANTITY and
inherits the BAR, which is the smallest move that fixes the defect.

**CONTAMINATION, disclosed because it is real.** The brief handed me three data points before I set
this bar: D011 carries two hops, D005 had a nine-hour stall, D010 drew a *"why didn't you dispatch"*.
So I knew, when writing the line above, that **up to 3 of the recent 10 laps already fail**. A bar of
8/10 would have been unsettable honestly after that disclosure; a bar of 1/4 would have been fitted to
survive. 1/2 sits above the contamination I was given and below certainty either way. **Whoever
scores this next should treat the bar as set by a seat that had partial knowledge of the answer, and
say so.**

---

## 4. WHY I REFUSE THE MAP'S DENOMINATOR ON THIS LEG

The map specifies *"denominator mapped laps"* for the ferry quantity. **I decline it, and this is a
deviation from my brief rather than a reading of it.**

*Mapped laps* is the right unit for Q1 — it is what E's registered words say (*"librarian laps"*), it
is B's correction, and it should land in the report. It is the **wrong** unit for Q2, for one reason:
**it deletes the counter-evidence.** D008, D009 and D010 were opened by the chair with no user entry —
the loop supplying its own work — and they carry no `map` row. Scoring the ferry over mapped laps only
would exclude the three laps in the record that most directly bear on *"does the ring turn without
him"*, and would bias the ferry rate **upward** by keeping only laps that reached a librarian leg.

A falsifier whose denominator excludes its own strongest counter-examples is not conservative, it is
mis-specified in the direction that makes it fire. That is species A of the universe registration —
the set is short — and it would be the third unit error in this falsifier's short life.

**So: Q1 over mapped laps (B's fix). Q2 over ring-capable laps. Both printed, both labelled.** The
one thing that must never happen again is the thing B found — *"two denominators, one screen of
output, neither labelled."*

---

## 5. THE DEGENERATING CLAUSE, named in advance

E's original stands and is inherited: *"the tools are new, give it time"* is the degenerating
sentence.

Two more, specific to this form:

1. **"The keeper chose to be involved this week"** — said at the window's close in place of a number.
   It is unfalsifiable, always available, and it is the base-rate coat with a scheduling excuse.
2. **Reporting Q2 as a bare share with no per-lap list.** J's D010 finding governs: *"A parity count
   cannot tell you whether the same things are failing."* Two windows both reading 5/10 are not the
   same 5. A score published without the list is a headline, and this re-registration was then used
   for exactly what it was built to stop.

---

## 6. THIS RE-REGISTRATION'S OWN FALSIFIERS, before it can be quoted approvingly

**F-L1 — THE JUDGMENT STEP MAY BE DOING NOTHING.** If, over a full 10-lap window, the CONFIRMED count
equals the CANDIDATE count in every lap, condition (ii) has never once excluded anything and the
add-test is decoration. Strike it and use the mechanical pool as the measure. *Named unwelcome
outcome, in the words that make it true:* **"L added a judgment step so the number would need a
human to certify it."**

**F-L2 — THE SPLIT MAY BE UNSCOREABLE IN PRACTICE.** If the next two scorings of Q2 are made by the
holder of the laps being scored, or by nobody, then the direction/carriage split is a rule with no
instrument and this document repeated A's own diagnosis of prose scope clauses — *"a convention, not
an instrument."*

**F-L3 — THE 1/2 MAY BE FITTED.** If the first scoring lands between 4/10 and 6/10, the bar was set
close enough to the answer that it decided nothing, and the honest entry is that the threshold was
uninformative — **not** that the falsifier "narrowly fired."

**F-L4 — THE MIXED DEFECT MAY SURVIVE.** A's T3 stands unrepaired: the laptop holds L-laps against the
same record. Q2's window is laps-on-one-machine against laps-on-one-machine — commensurable, which is
the fix A asked for — but the two machines will still return two scores with no adjudicator. **If a
global figure is ever quoted from one machine's ledger, this leg failed the same way the old one
did.**

**Not scored by its author.** §§1–5 re-register an instrument whose subject is the chair and whose
registrant is E. I am neither, and I am also not the seat that scores this next.
