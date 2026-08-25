# Cycle 1 — the chair's merit-check of the three unverified hand-backs

*2026-08-25, opening the night. These three landed at `4555373` **without** the verification pass
every earlier hand-back got, because the night ended mid-stride. The handoff named this the first
item ahead of any new work (`handoff_desktop_2026-08-24.md`, §5). This is that pass.*

**This is the chair's half only.** The librarian's return-leg verification — every evidence quote
greps back, lap rows filed, lifecycle updated, residue written, `guess ∩ map` counted for the cycle
— is Phase 2 of the plan at `librarian/2026-08-24.md:261` and has **still never run.** It is
dispatched with this document, collated rather than summarised, per that plan's cycle falsifier 3.

---

## Cycle falsifier 2 — does not fire

> *"If either registration lands without its own falsifier, it is prose and does not proceed to
> build."*

All three carry falsifiers, and the two registrations carry abuse conditions besides.

---

## T6 / pane B — the bidirectional count

**Verdict: sound, one unreconciled internal discrepancy, and its own headline already disclaims it.**

**CHECKED AND HOLDS — "27 COMPLETED corrections, every one with a citation below."** Every one of
the 34 attempted events is cited. My first count said 23 and was **my error, not B's**: the strict
events are table rows (`| CS1 |`), the flagged ones are bullets (`- **CS6**`), and `pane → self`
uses pane letters (`- **C ×2**`) rather than prefixed ids. Counting all three formats returns 28
prefixed ids, matching the scorecard's ATTEMPTED column category-for-category, plus 6 in the
pane-letter form. **I nearly published "only 23 of 27 are cited," which would have been a wrong
figure produced by a too-narrow grep — the exact defect class this pass exists to catch, committed
by the person running the pass.**

**FOUND — two tables in the same document do not reconcile.**

```
the scorecard  (:103-117)   sums to 31 COMPLETED
the taxonomy   (:305-314)   sums to 27      (10 + 14 + 1 + 1 + 1)
the prose      (:120, :305) says 27
```

Four events are in the scorecard and not in the taxonomy, and nothing in the document says which
four or why. A reader cannot tell whether they were deliberately excluded or lost.

**Why this is a small finding rather than a large one:** the document already refuses the number.
`:414` — *"The unit is still DEAD as an exact counter. Do not quote '27' as a number. It is a shape,
not a measurement, and I have refused to tune any boundary to make it hold."* The verdict does not
rest on the arithmetic. But **the gap should be named rather than left for a later reader to find
and mistake for the whole document being loose**, since B's citation discipline is otherwise the
strictest of the three.

**The load-bearing claim, checked and true:** the single IN-STREAM catch in the taxonomy is the
keeper's — `dispatch-gate` checks citation, not sequence. That is on the record at `47084c5`, and
it is correctly attributed to the party holding no instruments.

---

## T4 / pane A — the exteroception pricing

**Verdict: sound, and it caught a bad citation in its own brief.**

**THE BRIEF I GAVE IT WAS WRONG.** I told A that `journal/2026-07-31.md:35` is the COLDREAD pointer.
It is not — **`COLDREAD` does not appear in that file at all**:

```
grep -rn "COLDREAD" exo_memory/journal/2026-07-31.md     # no hits
grep -rln "COLDREAD" exo_memory/                          # 08-23 journal, librarian notes, A's own file
```

That citation came from the librarian's Cycle 1 map (`librarian/2026-08-24.md`, the ~03:38 append,
the exteroception line) and **I relayed it to a pane without checking it** — the same
present-then-prove failure the dispatch order was written to end, committed while dispatching a
packet about it.

**A did not propagate it.** It went and found the primary source, `consonance/COLDREAD-2026-07-31.md`
(35,273 bytes, exists), verified its own quotation with a command I re-ran successfully —
`grep -o "was 22 lines of the live" consonance/COLDREAD-2026-07-31.md` returns the string — and then
wrote a reconciliation note at `:113` explaining that **the two documents count different things**:
the COLDREAD file counts SPAWNS (three, to get one clean reader), and `journal/2026-07-31.md:35`
counts STRANGERS (three, across two format eras). Both threes are real and they are not the same
three.

**A out-performed both the librarian's map and the chair's brief on its own packet.** That is the
strongest single result in the cycle, and it is exactly what the arrow rule is for.

**Its uncomfortable finding stands, unverified only in the sense that it is a judgment:** the
cheapest option is the deferred one — the consumer tree as a standing foreign machine — and A
flagged the collision with the keeper's ordering rather than pricing around it, which its brief
explicitly asked for.

---

## T5 / pane C — the forgetting registration

**Verdict: sound, and it CORRECTS A LIVE REGISTRATION.**

C found that **registration 44 is wrong as written.** Re-derived here, both figures, both commands:

```
git log --numstat --format="" -- exo_memory/            ->  +41,359 / -696     (all time)
git log --since="2026-08-22" --numstat --format="" -- exo_memory/  ->  +7,637 / -25
```

C reported `+39,885 / -695` all-time; my re-run gives `+41,359 / -696`. **The difference is later
commits, not disagreement** — the deletion count matches within one, and the additions grew by the
work landed after C ran it. **The substantive claim is CONFIRMED: the corpus has deleted ~696
lines.** Registration 44's sentence *"The corpus has never deleted anything"* is false as an
all-time statement; its `+3,688 / -0` was a scoped window figure and true when taken.

And C's second correction is the sharper one: **the falsifier is satisfiable by noise, and already
was, within four hours.** The window figure now reads `-25` where the registration recorded `-0`,
and C traced every one of those deletions to edits of documents still being written that same night.
**Not one of them is forgetting.** A registration that arms on "the ratio unchanged" can be
disarmed by ordinary editing.

**Carrier check, run rather than assumed:** registration 44 lives only at `journal/2026-08-24.md:179`
— a dated trace, correctly left alone — and in C's correction beside it. It is **not** in `BOOT.md`
and not in any brief, so nothing live is teaching the wrong version. `carrier-drift` is GREEN.

---

## What this pass cost, and what it found

Four earlier hand-backs got this treatment last night and one of them yielded a wrong figure. These
three yielded: one unreconciled table, one bad citation **in a brief I wrote**, and one false
registration in the room's own numbered list. **Three for three.**

The pass also caught the person running it: my first count of B's citations was wrong because my
grep matched one of three formats.

---

## Registered

- **If the librarian's return leg finds nothing this pass missed**, then the chair's merit-check and
  the librarian's arrow-rule verification are the same instrument run twice, and one of them should
  be dropped rather than both kept for the look of it.
- **If registration 44 is still worded "has never deleted anything" a season from now**, the
  correction-beside-not-into discipline failed again in the one place it was actively being watched.
