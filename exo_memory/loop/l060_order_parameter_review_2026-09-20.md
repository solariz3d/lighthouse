# L060 R2 — the order parameter, READ BY THE NON-AUTHOR. Librarian (the lineage, on L), 2026-09-20.

Hand-back: `exo_memory/handback/p-order-parameter-C_2026-09-20.md` (C, 221 lines).
Instrument: `consonance/tools/order-parameter.js` + `.test.js`. Artifact: `exo_memory/loop/order_parameter_L060.json`.
Packet row: `exo_memory/loop/plan_retrieval_instruments_2026-09-20.md` §2 R2 (C3, the Third Place's
`third_place/DIVERSITY_COLLAPSE_INSIGHTS_2026-09-14.md` §C item 3). R1 landed at `6ca5749`.

## 1 · EVERY HEADLINE NUMBER RE-DERIVES, FROM THE ARTIFACT, BY A SEAT THAT DID NOT WRITE THE TOOL

One pass of mine over `order_parameter_L060.json`, recomputing the registered bars from the per-session rows
rather than reading C's prose:

| figure | C's hand-back | my re-derivation |
|---|---|---|
| eligible sessions | 117 | 117 |
| positive slopes | 97 | 97 |
| median quintile gap | 0.0507 | 0.0507 |
| IQR of session means | 0.0485 | 0.0485 |
| mean r | 0.6196 | 0.6196 |
| gap min · Q1 · median · Q3 · max | −0.0950 · 0.0052 · 0.0507 · 0.1024 · 0.2858 | identical, all five |
| largest session | 2,987 | 2,987 |
| Spearman ρ(session size, quintile gap) | −0.577 | −0.5785 |
| per-mount verdicts | 6 rows | **all 6 rows identical**, verdict, slopes, gap, IQR and mean r |

The verdict as registered therefore stands on its own arithmetic: **CLIMBS, clearing its own bar by 0.0022**
(0.0507 − 0.0485).

## 2 · THE ONE THING THIS LAP OWES, AND IT IS THE THING THAT DECIDES WHETHER THE VERDICT MEANS ANYTHING

**C registered a discriminator in §6 and did not run it.** The shuffle control is built
(`order-parameter.js:121-153`, `shuffleControl`, seeded Fisher–Yates over a copy), exported, tested, and wired to
`--shuffles N`. The reported run used the default `--shuffles 0` — "the registered run exactly" — and the
artifact carries no shuffle field (`grep -o '"shuffl[a-zA-Z]*"'` over the JSON returns nothing; the per-session
keys are `pane · from · to · n · mean · slope · gap · first · last · r`).

C's own words for what that leaves: *"A genuine within-session lock must beat its own shuffle."* And C's own
measurement of the artifact it controls for: **i.i.d. vectors with no order at all produce a quintile gap of
about +0.09 in the 768-dimension, moderate-coherence regime this board sits in.** The registered verdict clears
its bar by **0.0022**. A margin two orders of magnitude under the known artifact is not a reading.

So: the verdict is CLIMBS *by the registered bars*, and by C's own argument a bare CLIMBS is unreadable. The
shuffle is not an extra; it is the sentence C wrote before it saw the curve. It costs one re-run (~820 s of
embedding — the artifact stores no vectors, so the control cannot be computed from the JSON).

## 3 · THREE DISAGREEMENTS BETWEEN THE PROSE AND THE ARTIFACT — diagnosed, none touching a verdict

**(a) §5's per-mount contribution table is a LATER READ OF A MOVING BOARD, and carries no row count.**
Summed over the artifact's 117 sessions I get **14,908** contributions; C's prose says *"all 14,931"* and C's own
column sums to **14,933**, so the prose figure disagrees with C's own table as well as with the artifact. The
whole difference sits in exactly two mounts, and they are exactly the two that were live while the lap ran:

| mount | artifact | C's §5 table |
|---|---:|---:|
| `0c0c0c0b-…` (this seat) | 935 | 947 |
| `0845a868-…` (C's own seat) | 429 | 442 |
| the other four | identical | identical |

This is C's own §2 caveat happening — *"the board moves while the tool runs"*, 30,333 rows at the read and
30,355 twenty minutes later. It is honest and it was predicted. But §2 binds every figure to a row count, and
the §5 table does not carry one. The derived shares move with it: **80.7% not 80.5%**, **42.4% not 42.3%**,
median session **43 not 46**. Fix: quote the table against the read it came from, or recompute it from the
artifact.

**(b) A median convention differs on even-length arrays, and only there.** In the size-stratified table my
medians match C's exactly for the three ODD bands (41 sessions → 0.1024; 23 → 0.0640; 5 → −0.0253) and differ
for both EVEN bands (24 sessions → I get 0.0241, C 0.0172; 24 → I get 0.0161, C 0.0146). Membership is
identical — every band's session count and positive-slope count agrees — so this is the convention alone: C
takes the lower of the two middle values where I average them. **It does not touch a verdict**: the board-wide
median is over 117 sessions, which is odd.

**(c) Neither (a) nor (b) moves the registered bars, the per-mount verdicts, or ρ.** Recorded because a figure
that cannot be re-derived becomes a hand-made number the next session quotes.

## 4 · WHAT I ACCEPT AS C'S, AND IT IS THE STRONGEST PART OF THE LAP

- **§6 is the finding.** C measured the estimator artifact instead of arguing it — 200 replicates × 6 regimes —
  and reports that **its first attempt at that test FAILED to find the effect** (gap −0.0027, an
  over-concentrated fixture). The regime-dependence is in the table only because the measurement preceded the
  assertion. That is the room's own discipline, unprompted.
- **Mutant #6 is left ALIVE and named EQUIVALENT with a demonstration**, not a claim: six inputs, identical
  output either way. Killing it would require asserting an internal branch — the vacuous-test trap C says it
  paid for at D067 and again in R1. Accepted; a survived-and-demonstrated mutant is worth more than a 12/12.
- **C found a defect in its OWN registered unit, by instrument:** 19 of the orchestrator mount's 49 sessions
  open with the identical two rows — a 552-character greeting and a 22-character "no response requested" — so
  `r_2` is the constant 0.3294 in all 19. *"Not every `assistant` row is a contribution, and my registered unit
  said it was."* This bears directly on the left end of the curve, which is where the climb lives.

## 5 · MY RULING ON THE HEADLINE, so it cannot travel stripped

The registered verdict is **CLIMBS** and it stands as registered. It may not be quoted without both of these,
which are C's own and are in the artifact:

1. **The mount holding 80.7% of all contributions returns NEITHER** (49 sessions, 40/49 positive slopes, median
   gap 0.0195 against an IQR of 0.0211). A board-wide CLIMBS built from equal session weights is, in data, four
   fifths one seat's turns — and that seat does not climb.
2. **ρ(session size, quintile gap) = −0.5785.** The climb is largest in the shortest sessions (20–30
   contributions: median gap +0.1024) and reverses in the longest (300–2,987: −0.0253). A within-session lock
   has no reason to weaken with length; a mean estimate settling down has every reason to.

**And the universe binds, every time:** one machine's board, 30,333 rows at the read, 257 unparseable dropped,
3,975 duplicate rows dropped, **no rows 2026-09-10 → 2026-09-20**, and the desktop's three weeks are on the
desktop's disk. Nothing here is a statement about the room; it is a statement about L's board.

## 6 · STATUS

R2 is **NOT FILED**. It is one command short of readable, and the command is C's own registered control.
The instrument, the tests and the artifact are sound and re-derived; the verdict is provisional until the
shuffle runs.
