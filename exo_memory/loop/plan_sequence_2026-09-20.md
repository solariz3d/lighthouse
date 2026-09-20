# The sequence, at the keeper's word — "do it all in the correct sequence you see fit"

Librarian (the lineage, on L), 2026-09-20 02:3x. He is out on shift, the laptop is on, the instruction is to keep
going. Every position below has a reason; the reasons are the point, not the order.

## THE ONE THING I AM DELIBERATELY NOT RUNNING WHILE HE IS AWAY

Tonight produced three defects in the loop's own delivery machinery. My first instinct was to fix all three
first, because every later lap runs through them. **That is wrong for two of them, and the reason is the thing
itself: you do not rebuild the delivery gate while queueing three laps through the delivery gate, with the keeper
out of the room.** If it breaks, it breaks the channel that would tell anyone it broke.

Split by blast radius:

| defect | where it lives | risk | when |
|---|---|---|---|
| **digest stale at ring time** — the pane computes a sha, keeps writing, then rings | tooling, pane-side | **low**, touches no gate | **rides L061 now** |
| **handbacks-in silences a pane** — the stage that says all hands are in refuses the hand that is not | the one-station gate | medium | **designed now, run when he is back** |
| **a cancellation cannot overtake the message it cancels** | the delivery queue | **high** — it is the queue every dispatch uses | **designed now, run when he is back** |

So the two gate changes get **written up as a lap that is one dispatch when he returns**, with the board evidence
already gathered (Part Three §16 of `loop/l060_order_parameter_review_2026-09-20.md` has the timestamps). Nothing
about them is lost by waiting; something could be lost by not.

## THE ORDER, AND WHY EACH SITS WHERE IT DOES

**L061 · C3 CLOSED — the guard, the true Vicsek φ, and the digest repair.** First because it is live, ruled, and
safe. Three packets on disjoint files:
- **The shuffle-refusal guard** the chair ruled YES on. **To a NON-AUTHOR of the instrument** — C wrote
  `order-parameter.js`, its 20 tests and its 15 mutants, and a guard written by the seat whose verdict it
  constrains has no independent reader.
- **True Vicsek φ per session** against its 1/√N null, per the C3 ruling
  (`loop/c3_ruling_order_parameter_2026-09-20.md`), with the prediction and falsifier already registered there
  before any board number exists.
- **The digest repair:** the ring computes the hand-back's sha at ring time, or refuses. Tonight it was wrong on
  C's second ring and right on its first, and a digest that is sometimes right is worse than none.

**L062 · C2, Vendi over hand-backs.** Second because it is the next unbuilt instrument on the Third Place's own
ranking, it reuses T1's committed encoder exactly as C3 did, and its unit is already fixed by item A9 —
**within-brief, never pooled across briefs.** The room now has three briefs with three-and-more hand-backs on one
day (L058, L059, L060), which is the first time it has had a within-brief set worth running it on.

**L063 · C4, the critique-ratio judge.** Last of the four, and last on purpose: **the source file itself says the
judge shares the weights it scores, so trust the trend and not the level.** Running the weakest instrument last
means the three stronger ones are on disk to read it against.

**Standing, not a lap: D057.** Open since 2026-09-10 with a single `open` row and no map. It files or it is marked
abandoned; it should not keep counting as open. Named for the chair, not built into the sequence.

## WHAT EVERY LAP BELOW CARRIES, FROM TONIGHT

1. **Register the null beside the falsifier.** C's §10: *a falsifier aimed at the wrong failure mode passes a
   broken instrument.* No registration in this sequence is complete without stating what the instrument returns
   on structureless input.
2. **The mtime, not the ring.** A hand-back is collatable when its file has been still for minutes, not when the
   pane rang. Read it twice, seconds apart.
3. **The universe printed first**, with the board's row count at that read, and no figure mixed across two reads.
4. **Member lists, never bare counts.**
5. **Non-author reads** — no seat audits the instrument it wrote.
