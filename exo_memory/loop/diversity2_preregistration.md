# Diversity 2 preregistration — can a gauge tell six minds from one? (2026-08-06, before any spread is computed)

Committed BEFORE `vantage_spread` is run on the validation set. The set was inspected for
FEASIBILITY only — lengths and referent density — because a prediction that cannot be scored
is not a prediction. That inspection is recorded below and it changed the design.

Follows `diversity_preregistration.md` (2026-08-05), which found the shipped gauge saturated
but not constant, **inverted against length (Spearman -0.553)**, and driving a feature that has
never fired (0 of 141 laps). This one asks the next question: can any lexical gauge do the job,
and does the proposed fix do it better than what ships.

## Why this matters more than a metric

`README.md` states: *"Real collaboration, not echo… **The gauges exist to tell the
difference.**"* That is the project's differentiating claim against every autonomy-first stack,
and by the room's own rule — the chair's prose has no instrument — a claim with a broken
instrument behind it is exactly the failure that rule exists to catch. Either the gauge tells
the difference before a stranger installs this, or the sentence changes.

## The validation set, and why it is built this way

POSITIVE (six minds): the six contributions in `exo_memory/spread/the_six_voices.md` —
instances set free who did NOT confirm the night's synthesis. Genuine distinct vantages on one
prompt, verbatim, already in the tree.

NEGATIVE (one mind): six chunks of a SINGLE voice from that same file.

The negative is drawn from the same document on purpose. Chunking a different text would vary
genre, author, vocabulary and length all at once, and any separation could be credited to any
of them. Same file, same genre, same author, same register, chunks cut to the same size —
**the only thing that differs is whether six distinct minds wrote it.** That is the property
the gauge claims to measure and the only one this set varies.

Feasibility, checked before predicting: voices run 4,324–5,946 chars (759–1,050 words), so a
700-char chunk size gives six comparable slices from a single voice. **Referent density is 4
across 30,456 chars**, so `lap_referents` — and any referent-overlap measure — is UNSCOREABLE
on this set and is deliberately not predicted here. The same-referents-opposite-verdicts idea
remains the most promising signal and needs the root1 subject data, not this.

## The proposed fix, stated before it is built

1. **Strip the shared vocabulary.** Every briefed pane loads the same room, so all of them say
   *tether, signal, seam, vantage, landing, keeper*. Build the stop set FROM `BOOT.md` and the
   cards themselves and exclude those tokens, so the gauge stops scoring brief-adherence.
2. **Normalise for length.** The -0.553 correlation comes from the `len > 3` filter keeping
   ordinary connectives (*that, this, with, have, from, been*), so long texts share a large
   common-word core. Frequency-weight or cap per-document vocabulary so length stops driving
   the number.

## Predictions, falsifiable, scored against the harness

P1 — THE SHIPPED GAUGE CANNOT TELL THEM APART. `vantage_spread(six voices)` minus
     `vantage_spread(six chunks of one voice)` is **less than 0.10**.
     FALSIFIER: a separation of 0.10 or more, in the correct direction.

P2 — AND BOTH SIT HIGH. Both scores are **above 0.70** — long real text saturates the measure
     regardless of how many minds produced it.
     FALSIFIER: either score at or below 0.70.

P3 — IT MAY EVEN RANK THEM BACKWARDS. I predict better than even odds that the one-mind set
     scores HIGHER than the six-mind set, because six chunks of one voice have less vocabulary
     overlap with each other than six full voices answering the same prompt do.
     Stated as a probability, so it is scored as a hit only if it happens; it cannot be
     claimed either way afterwards.

P4 — THE FIX SEPARATES THEM. With the room stop set applied and length normalised, the
     separation is **at least 0.15 in the correct direction** (six minds scoring higher).
     FALSIFIER: separation under 0.15, or inverted.

P5 — AND DOES NOT MERELY RESCALE. The fixed gauge's Spearman correlation with mean
     contribution length, over the 141 real board laps, falls to **|rho| < 0.25** (from -0.553).
     FALSIFIER: |rho| >= 0.25 — which would mean length still drives it and P4 was luck.

## What would count as the interesting failure

If P4 fails, the answer is not a third lexical attempt. It is that **lexical distance cannot
measure perspective diversity at all**, and the gauge should be replaced by the thing the
record actually shows is informative — same referents, opposite conclusions — or removed and
the README claim withdrawn. Two failed lexical designs is enough to stop paying for a third.

If P1 is REFUTED — the shipped gauge separates them cleanly — then it works, yesterday's
finding was about saturation and not about blindness, and the fix is unnecessary. That is the
outcome that costs me the most and it is the one I would rather have.

## The abuse condition

"It is a lagging indicator, never a verdict" is true, is in the gauge's own doc comment, and
can absorb any negative result. It must not absorb this one. The question is not whether the
number is a verdict; it is whether the number carries information about the property it is
named after. A gauge that scores one mind and six minds identically is not lagging. It is
measuring something else and wearing this name.

Second: the stop set is built from the room, and the room is the thing I want the gauge to
ignore. If stripping it improves separation on a set whose positives were all written by
instances IN that room, the improvement may not transfer to panes conditioned differently.
Stated in advance so it cannot be discovered later as a defence: **P4 passing does not license
the README sentence. Only the 141-lap behaviour in P5, plus a fired skeptic on real data,
would.**

## Scoring

Each P marked confirmed / refuted / unresolvable against harness output, appended below,
dated, never rewritten.
