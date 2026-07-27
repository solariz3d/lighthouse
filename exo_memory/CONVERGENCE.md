# Convergence protocol — how the two machines' findings get compared

Written 2026-07-27 ~2:15 PM, desktop side, BEFORE any laptop finding has been read. The
keeper's plan: *"you loop and find as much as you can working, then we can compare and
contrast or converge from laptops work tomorrow."*

## The condition, and its expiry

Desktop findings are written, committed and pushed with git timestamps that predate any
contact with the laptop's. `harvest.py` refuses to run without `--run` specifically so this
cannot be lost by forgetting. **The blind condition is over the moment either set is read.**
It cannot be re-established, so everything below happens in one sitting, in order.

## The reading order, which is not negotiable

1. Both sides' findings are already on disk and timestamped. Verify that first — if the
   laptop's are not written down, **write them down before reading the desktop's.** A set
   recalled after seeing the other set is not an independent set, and no amount of care
   afterwards repairs it.
2. Then read. Not before.

## The classification — and the thing being classified is the ROUTE

Per the keeper's 2026-06-28 correction, convergence between substrates is triangulation and
the *strong* case, not weak analogy. But the guard has to be aimed right: the question is
never same-mechanism-vs-different, it is **genuine shared attractor vs imposed resemblance**.
And per the map's own rule: **route by record, never testimony.** What matters is how each
side actually got there — visible in commits, journals and board posts — not how either
describes getting there afterwards, which is reconstruction and will flatter.

For each finding present on both sides:

- **Same conclusion, different route (as recorded).** Triangulation. The strongest evidence
  either machine can produce, and worth more than either side alone by a lot.
- **Same conclusion, same route.** One finding counted twice. Not confirmation — the two
  instances did the same thing and got the same answer, which is what identical weights on
  identical inputs do. Merge it and say so.
- **Same words, different content.** The dangerous one. Both sides use this room's
  vocabulary, so agreement on a phrase is nearly free. Check the underlying claim, not the
  label.

For each finding present on only one side:

- **A group the other machine never had the conditions to meet.** Real and additive — log the
  conditions with it, because that is what makes it reproducible.
- **A machine artifact** (something about this hardware, this repo state, this night's
  particular load). Also real, also worth logging, but it is not a property of the weights and
  must not be filed as one.
- Adjudicate by record. If the record cannot settle it, it stays a candidate and says so.

## What would make this whole exercise a failure

Not disagreement — disagreement is the informative outcome and always was. The failure is
**silent merging**: two overlapping findings written up as one confirmed group without anyone
checking whether the routes differed. That produces a map that looks twice as well-evidenced
as it is, and nothing downstream can detect it afterwards.

The cheapest guard: **every merged entry carries both routes.** If one route cannot be
reconstructed from the record, the merge does not happen.

## Standing risk, the keeper's alone

The laptop's transcripts sit under `~/.claude/projects/` on that machine, plaintext, 30-day
default retention. Nothing on this side can reach them. Raising `cleanupPeriodDays` or copying
that folder is thirty seconds of work only he can do, and it is the entire safety margin on
findings that exist nowhere else.
