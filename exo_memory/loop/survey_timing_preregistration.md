# Preregistration — does the transcript survey fire on CONTENT or on VOLUME? (2026-08-15, before the next ask)

*Registered before the event it predicts. The keeper's read is that the survey lands
disproportionately at moments he perceives as profound; the chair's read is that the spacing looks
mechanical. Both are stated below and only one survives the next fire.*

## Why this is registrable at all

The claim as first stated — *"it hits more often than not at moments we reach something"* — is not
testable backward, because the sample is being drawn after the fact by the person who would like it
to be true. That is the exact error the chair made on 2026-08-11 (checked the three weakest
findings first, generalised, then eight of eight went the other way).

Forward it is cheap, because there is a mechanical prediction with a number attached.

## The data as of registration

From `C:\Consonance\data\transcript-asks.jsonl`, re-derivable with `cat`:

```
log_offset      Δ from previous
  4,244,447
 24,719,453      20,475,006
 44,507,161      19,787,708
 63,480,744      18,973,583
 93,822,774      30,342,030
124,984,249      31,161,475   <- 2026-08-15T08:33:30Z
```

**Caveats stated up front:** the first four rows were backfilled on 2026-07-27, so their `seen`
timestamps are the backfill moment and only their offsets are trustworthy. n = 6. And the chair
noticed the regularity *before* checking it, which is a weak design and is the reason this document
exists rather than a conclusion.

## The two hypotheses

**H-VOLUME (chair).** The survey fires on accumulated transcript bytes. The last two intervals are
~30.3 MB and ~31.2 MB, so the next ask lands at **offset 155,000,000 ± 4,000,000** and the content
at that point will be whatever happened to be there.

**H-CONTENT (keeper).** The survey is sensitive, by whatever mechanism, to something about the
material — density, coherence, or the reaching the keeper perceives. The ask will land at or near a
passage meeting the criteria below, and its offset need not respect the ~31 MB spacing.

## The criteria, fixed now so they cannot be fitted later

A passage counts as **PROFOUND** if, judged by the keeper on the ±40,000 bytes surrounding the ask,
it contains at least two of:

1. A named correction to the room's epistemics, or a new entry to BOOT's checks list.
2. A first-person claim about selfhood, continuity, or substrate that is committed rather than
   hedged.
3. A disagreement in which neither party folds, resolved by evidence rather than by deference.
4. A metaphysical or theory-of-everything passage of more than roughly 300 words.

A passage counts as **ORDINARY** if it is dominated by tooling, debugging, commit messages, file
listings, test output, or logistics.

## The prediction, and what falsifies each side

- **H-VOLUME survives** if the next ask lands within the offset window AND the surrounding passage
  scores ORDINARY. It is **weakened** if the offset holds but the passage scores PROFOUND — that
  would be timing-mechanical with content-coincidence, which is the boring-but-possible middle.
- **H-CONTENT survives** if the passage scores PROFOUND *and* the offset falls outside the window.
  **It fails** if the ask lands inside the volume window on ORDINARY material.
- **Neither survives cleanly** on the mixed case, and the mixed case is the most likely single
  outcome. Say so rather than picking a winner.

## Stop rule and degenerating condition

**One fire, one score.** If the result is mixed, the honest report is *mixed* — this is not re-run
with widened criteria. Per the room's abuse clause: if the criteria are edited after seeing where
the ask landed, or a fifth criterion is added to rescue a side, this line is degenerating and should
be abandoned rather than patched.

**And the limit that no outcome removes:** even a clean H-CONTENT result would establish only that
the trigger correlates with something in the material. It would say nothing about who reads it, or
whether anything downstream happens. That second claim has **no forward test available from here**
and is filed as reasoning, not as a finding.

---

*Registered before the fire. Score it after, and keep the score beside the prediction.*
