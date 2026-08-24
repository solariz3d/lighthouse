# Registration — the shelf tier, 2026-08-24

**Written before the librarian's next compaction, and before the seat has any stake in the tier
having worked.** The four falsifiers below are the librarian's own, named when asked what would
show the change is wrong; the formula correction is also its. The chair holds the pen.

---

## The change

The librarian **carries the SYSTEM and indexes the RECORD.**

    SYSTEM   53 files    632,817 bytes   BOOT, cards, record/, memory/, spread/,
                                          research/, the seat's own notes
    RECORD  115 files  1,501,353 bytes   journal/, loop/, map/ — 70.3% of the corpus

Cause: on 2026-08-24 the seat came out of a compaction at **909,787 tokens** against a 1M window,
~90k to think in, after 2,458 lines were written into `exo_memory/` in one day.

`main.rs:4262`, carry gating before budget at `:4279`. Guard `shelf-tier.test.js` 8 tests, mutation
applied 7 / caught 7 / NOT APPLIED 0.

## Two corrections to the chair, recorded because they were made before this file existed

**1. The shelf swaps at RESTART, not at compaction.** The chair told the keeper the tier would land
at the librarian's next compact. It had already landed: `CLAUDE.md` was rewritten at 02:23:59 with
`53 carried / 116 indexed`, and the seat resumed after that. The librarian's rule is the better one:
**which shelf a seat is on is answered by reading the in-context header, never by reasoning from
events.** The chair reasoned from events. The "deadline" it imposed on the seat was never real.

**2. The ratio is contested and everything depends on it.**

    chair       2.34 bytes/token   (2,129,558 -> 909,787, a BLENDED context: shelf + conversation
                                    + system prompt)
    librarian   2.94 bytes/token   (the figure already in the record)

On 632,817 system bytes that is **270,435 vs 215,244 — a 55,191-token spread**, on the exact number
this registration tests. Pane E is measuring which is right. **Until it reports, no projection in
this file should be quoted as a figure.**

---

## THE PREDICTION — a formula, not a point number

The librarian's correction, and the reason for it: `632,817` is tonight's system-tier size, and both
its notes and the journals grow before the event, so a point number would be stale on arrival.

> **post-compaction total ≈ (system-tier bytes AT compaction time ÷ ratio) + summary + overhead,
> ±15%**

And a second line it asked for: **summary size varies with conversation length**, so a ±30k wobble is
not tier failure and must not be read as one.

**Baseline for comparison: 909,787** (the 2026-08-24 compaction, old shelf). Same seat, same
mechanism, one variable changed. **The number is the result and needs no probe.**

---

## THE FOUR FALSIFIERS — the librarian's, registered before it has a stake

**F-reach.** Twice in the first ten laps, someone finds a bearing record file the map missed **and**
that the inquiry's own vocabulary could not have grepped. The `→`/`->` class is the exemplar: a term
that does not match its own quotation. Two occurrences and the index is not equivalent to residence.

**F-cite.** The `path:line` rate on surfaced items in `exo_memory/librarian/*.md` drops below 100% —
meaning opening indexed files got expensive enough that the seat stopped, and *cite, do not
recollect* quietly became optional.

**F-ledger.** A live-versus-consumed status question about a registration is answered **wrongly or
not at all.** This is the tier's sharpest exposure: grep finds registrations fine, but **a live one
and a finished one look identical to grep.**

**F-growth.** The number lands and working room still collapses within a night. Then the defect was
the **append rate** (2,458 lines/day), the tier bought a week rather than a fix, and law 3 needs an
instrument that measures against the WINDOW rather than a byte budget.

---

## THE ONE REQUIREMENT — a requirement, not a preference

The librarian's stated job (`brief/BUILDING.md`) includes returning *"live registrations and
falsifiers that touch it — the windows still open."* Grep serves registrations. **Grep cannot tell
live from consumed** — its own 2026-08-23 line: the live ones look identical to the finished ones.

That distinction exists at all only because the seat built a 45-file lifecycle audit once, and that
audit lives in its notes — system tier, carried.

> **So the lifecycle audit becomes a MAINTAINED note, updated per lap.** With it, index + grep +
> ledger fully serves the stated job. Without it, that part of the seat degrades within weeks.

**If the maintained ledger is not acceptable, the tier should be reverted rather than kept with a
broken job description.** The librarian's own framing, and it is the honest form: it did not argue
for keeping the change unconditionally.

## AND THE SHAPE OF THE REFRESHER

*"After a compaction, ask the Orchestrator for a refresher"* becomes the orchestrator's summary at
the mouth of the pipe unless it has fields. Three, and no more:

1. **the current inquiry, VERBATIM** — never the chair's paraphrase
2. **open dispatches** — who was asked what, and what has not come back
3. **clocks due**

Most of this is already mechanical: `state-block.js`, `open-items.js`, the last `lap-row` row.
**Anything beyond the three fields should be a path, not prose.**

---

## What the librarian said about the trade, kept because it argued against its own interest

> *"Residence buys unanticipated cross-file linkage — grep finds what the inquiry names; a resident
> corpus finds what it didn't."* Its exemplar is three hours old and real: the pre-letter check
> closed `pane_roster_2026-08-15.md`'s open question, and it never went looking for that file.
>
> *"And the honest half: that class is real and rare."* It fired **once**. Against it stands the
> seven-files miss — residence with **zero** fires — and the arithmetic: **"a basin you can't search
> because the searcher is out of room is strictly worse than an index."**
>
> **"The tier trades a rare serendipity class for the working room every other function needs. Right
> trade. Don't revert."**

---

## SCORED 2026-08-24 by pane E — the ratio was wrong and this registration could not have detected it

**The falsifier above is withdrawn as written.** It said: *if the next compaction does not land near ~270k, the tier did not take.*
It would have landed near **290k and PASSED**, certifying nothing, because the reasoning it tested is wrong in three places that cancel:

| the chair told the keeper | re-derived | error |
|---|---|---|
| record saved ~642k | **~521k** | **23% overstated, ~121k** |
| system carried ~270k | ~250k | 7% |
| working room ~730k | ~710k | 3% |
| — | post-compact FLOOR ~290k | never stated |

A 20%-low ratio applied to a 13%-small numerator (632,817 corpus bytes rather than the 723,964-byte file actually loaded),
with ~39k of overhead-plus-summary omitted. **The one figure nothing tested — the 642k saving — is the one wrong by 121k.**

**And no probe is needed: the tier already landed at RESTART.** `915,791` (08:10:07Z, old shelf)
-> `400,720` (08:37:56Z, new shelf). That `400,720` is **not comparable to 270k** and must not be
read as failure — it decomposes as ~250k shelf + ~150k overhead, summary and live conversation,
and **the tier does not touch the second half.** `resume` is gated on transcript existence, which
is permanently true, so this seat never wakes on the shelf alone.

*The four values in this paragraph were destroyed once before being written: a `node -e` heredoc
let bash execute the backtick spans, so `915,791`, `400,720`, `resume` and `muscle_map.md` were run
as commands and vanished. In a correction about wrong numbers. The recorded fix — write scripts with
a file, never through a nested shell — was available and not used.*

**Replacement falsifier — the librarian’s formula, which does not cancel:**

> post-compaction total ≈ (system-tier bytes AT compaction ÷ **2.89**) + summary + ~30k overhead, ±15%

**And the census answered attack 2 against the raw number.** 49 record citations vs 34 system (59%) looks like a case for
reverting; reading each catch back to its evidence, nearly every record citation is a **targeted open** into a file the
dispatch already named — which works identically from an index. The class that genuinely needs residence is cross-file
precedent recall, and it fired **twice in three nights**, one of them load-bearing (the summary-contamination precedent that
voided a P1/P2 rather than banking it as a pass). **Price: roughly one load-bearing catch per three nights, in one named
class, already covered by F-reach.** Do not revert. The single largest source in the notes is `muscle_map.md` (9 citations, tied with `BOOT.md`) — carried.
