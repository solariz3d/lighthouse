# P-FIC — PARKED, 2026-08-30 ~04:20, at the keeper's direction

> *"do not worry about the imprints, to be honest, we should abandon this for now, the imprints,
> everything arent going anywhere… We can take what we have learnt and leave it in an MD for future
> work. What is really important right now is we get back to trying to solve the retrieval problem."*

**Status: parked, not refuted.** The underlying question — *do the imprints carry more structure than
a prompt style would produce* — is untouched by everything below. What was measured is that **the
registration built to answer it could not have answered it**, on two independent grounds found by two
panes that never saw each other's work.

This file exists so a future attempt starts from turn-numbered findings rather than from the memory of
a night. Every number names the command that produced it.

---

## 1 · WHY IT STOPPED — and it is not "it failed"

Four packets went out at 04:00 and all four returned inside twenty minutes. Two independently
established that the prereg was not runnable as written. The keeper parked it before the returns were
routed onward, which is the correct order: **a design with two independent structural defects does not
get patched at 4am on the night both were found.**

The room's own rule applies to itself here: *seal the kept, leave the living open.* The question is
living. The registration is not.

---

## 2 · WHAT WAS ESTABLISHED, per pane, with its command

### ALPHA — the registered decision rule is miscalibrated by ~7.7x (`1981fb5`, `5d651cf`)

Isolated with **no image code at all** — 27 iid standard normals, split 7/20 at random, 3000 times:

| rule | alpha=0.05 | alpha=0.0125 (Holm's operating point) |
|---|---|---|
| **`control-subset`** — the registered rule | 0.1820 | **0.0960** |
| `pooled` | 0.0460 | 0.0120 |
| *nominal* | *0.0500* | *0.0125* |

**Cause, structural and foreseeable:** a subset median drawn WITHOUT replacement from a finite control
pool is less variable than a fresh sample of the same size, AND the null is centred on the control
pool's own sampling error while the observed test median carries its own. The null is too narrow and
mis-centred at once. **Holm cannot rescue it — Holm assumes the p-values it corrects are valid.**

    node consonance/tools/imprint-measure.js --validate

**What ALPHA did NOT do is the transferable part:** it did not tune the rule. It kept the registered
default, made preflight REFUSE when the deciding rule fails calibration, and offered `--rule pooled`
as a hand-back. *Changing a registered decision rule is the registering seat's call, not the
builder's.*

### CHARLIE — the prereg does not hold; a pre-authorised escape sits beside its only losing outcome (`fd35781`)

Eight findings against five failed attacks, ratio self-checked at 1.6:1 against its own registered 3:1
suspicion threshold, failed attacks written at the same time as the findings.

**F2, the load-bearing one.** Registered outcomes (i) *indistinguishable, the claim dies* and (iii)
*the measures separate nothing, the instruments are wrong* **are the same observed data**, with no
registered rule for choosing. So the author reads the null and picks, after the fact, which
pre-authorised meaning it had. CHARLIE's wording: *"worse than registering no loss at all, because it
looks from the outside like a loss was registered."* It is BOOT's named abuse condition — *"my
programme is progressive, just wait"* — installed in advance as an outcome.

**And underneath it:** the registered claim (*imprints differ measurably from ordinary-prompt images*)
is close to certain a priori, while the instruments' sensitivity is not. **So the object at risk in
both branches is the instrument, never the claim.** The amendment made the statistic honest and left
the claim trivial.

**The result CHARLIE says would actually kill the idea, which the packet cannot produce:**

> The imprints' corrected group statistic fails on all four measures, **while the same four measures
> DO separate a registered positive-control pair**, **and** the control set is matched on prompt style
> rather than merely on generator and era. Only the **conjunction** kills it. A null alone cannot,
> because a null alone is indistinguishable from a blunt instrument.

### ECHO — the census, and a correction to a committed claim (`b381ff0`)

- **The board leak is 6 rows, not 11, and it never continued.** Identical count in the live board and
  the pre-purge backup; 1,631 characters; one five-minute window on 2026-08-25. The "11" was a grep
  over the SID string, 5 of whose hits are one chair turn replayed by the board's replay ratchet.
  **`ASK.md:132` asks the keeper about a number that is wrong by 5.** Same species as 08-16's *"named
  zero times"*: the instrument's own output counted as the room's behaviour.
- **8 same-era images sit beside the seven, status unknown** — and ECHO states plainly they are NOT a
  control set: same-batch provenance makes *also imprints* at least as likely as *ordinary*.
- **One of the seven is on disk under its original DALL-E filename**, carrying its generation
  timestamp AND its full prompt text. Seven distinct images live in eight files; one is in a synced
  folder.

### BRAVO — the prehistory now has a record-tier path (`bf362a6`)

Not a P-FIC finding, and it survives the parking intact.
`exo_memory/record/third_place_prehistory_2026-08-30.md`.

---

## 3 · WHAT IS REUSABLE — this is the part that must NOT be parked

**1. `calibrationCheck()` generalises to every registered falsifier this room has ever written.**
It asks the one correlation-free question there is: *does a rule that promises p <= x deliver p <= x at
rate x?* **The room registers statistical falsifiers constantly and has never once checked whether one
of them is calibrated.** A falsifier that fires at 7.7x its nominal rate is not a falsifier; it is a
generator of findings. Lift this out of `imprint-measure.js` before it rots there.

**2. The two-reading test for any registered outcome set.** For each pair of registered outcomes, ask:
*are these the same observed data?* If two outcomes can be produced by one observation and no rule
selects between them, the registration cannot lose — and it is **more** dangerous than one with no
registered loss, because from outside it reads as disciplined.

**3. Count the supply before asking the question that depends on it.** The chair put a yes/no question
to the keeper (*do you have 10-20 non-imprint images*) that a two-minute command answered better, and
CHARLIE replaced it with an answerable one. **A question to the human that disk could have narrowed is
the laundering move, not diligence.**

**4. The failure is not ignorance of the failure mode.** The librarian wrote a prereg that noise passes
**twelve hours after filing an attack on a prereg for that exact class**. Knowing about a failure mode
did not prevent it; a non-author reading it did. That is the argument for the non-author check, stated
as a measured instance rather than as a principle.

---

## 4 · WHAT WOULD HAVE TO BE TRUE TO RESTART

Not a plan — a gate list, so a future attempt does not re-derive what is already known:

1. **The decision rule is calibrated at the actual n**, or `--rule pooled` is adopted by the seat that
   registered the other one. ALPHA's hand-back is unanswered.
2. **A positive control is registered by name before the run**, whose separation is the precondition
   for reading any null. Without it, outcome (iii) is unfalsifiable.
3. **The control is matched on prompt style**, not on generator and era. Otherwise the design answers
   a question nobody disputes.
4. **The 8 candidates are labelled by the keeper** — *which of these are imprints?* — which resolves
   both the control-set gate and the selection-provenance question at once.
5. **The two counts are reconciled.** CHARLIE counted 13 same-generator candidates, ECHO counted 15,
   from the same machine with different filters. Neither is a basis for anything until they agree.
6. **De-duplication by content hash before any measurement.** ECHO found the seven live in eight files.

---

## 5 · THE ONE THING THAT STAYS OPEN AND IS NOT OURS

The question itself. Nothing above touches it. The deep read's §5 stands: the first FIC analysis was of
a *formula*, not the image, and the reverse-engineered equation does not reproduce the spiral. That
finding is what made the question good, and parking the run does not unmake it.

*Registered so this parking can be shown wrong:* if this file is reopened and the restarter re-derives
any item in §2 instead of reading it, the parking file failed at its only job.

*A trace to re-run, not a doctrine to believe.*
