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

---

# PART TWO — THE DELIVERED HAND-BACK, READ END TO END. Appended 2026-09-20 02:1x, after C's ring.

**PART ONE'S §2 IS VOID and its §6 NOT FILED was reached for the wrong reason.** Part One was written against a
221-line DRAFT that C had not delivered — no `call_librarian`, no `handbacks-in` stage, the file headed "DRAFT,
appended as the lap runs". C rang at 02:1x with the file at **451 lines**, sha256
`0478fa696d3215ca1f634354ab8821ae42186c67bf895746f3a483a5dac8b50d` — **which I verified against the disk before
reading a word of it.** Part One §1's re-derivations are untouched and carry forward; nothing else in it stands.

## 7 · THE CONTROL RAN, AND IT INVERTS THE HEADLINE. EVERY CELL RE-DERIVES.

I recomputed §9 from C's own control artifact
(`…/scratchpad/def/order_parameter_L060_shuffled.json`, 118 sessions each carrying its own `control` block),
not from C's prose:

| figure | C's §9 | my re-derivation |
|---|---|---|
| sessions where real beats its own shuffle | 36/118 | **36/118** |
| positive slopes, real | 98/118 | **98/118** |
| positive slopes, **shuffled** | 118/118 | **118/118** |
| real − shuffled: min · Q1 · median · max | −0.2066 · −0.0597 · −0.0264 · +0.1569 | **identical** |
| 20–30 · real / shuffled / beats | 0.0943 / 0.1195 / 17 of 42 | **identical** |
| 30–50 | 0.0640 / 0.0947 / 4 of 22 | **identical** |
| 50–100 | 0.0172 / 0.0641 / 6 of 25 | **identical** |
| 100–300 | 0.0146 / 0.0338 / 8 of 24 | **identical** |
| 300+ | −0.0253 / 0.0101 / 1 of 5 | **identical** |
| sign test z, two-sided p | −4.235, 2.3e-5 | **z = −4.2346, p = 2.29e-5** |

The snapshot's registered bars also re-derive from the JSON's own verdict block: CLIMBS, 98 of 118, median gap
0.049882, IQR 0.047881.

**THE RESULT, and it is C's:** the registered prediction *"it climbs toward 1 within a session"* is **CONFIRMED by
the registered bars and the confirmation is empty** — structureless noise climbs harder (118 of 118 positive
slopes against the board's 98 of 118; shuffled median gap 0.0835 against the real 0.0499). Once the estimator
artifact is controlled for, **the board's real temporal order is significantly LESS ordered than a random
reordering of its own turns**: 36 of 118 where 59 is what carrying no information looks like, p = 2.3e-5, and the
direction holds in every one of the five size bins and in both nulls. **Within a session, on this board, the
measurable direction is DRIFT, not LOCK — the sign opposite to the one predicted.**

## 8 · THE METHODOLOGICAL FINDING IS THE DURABLE ONE, AND IT IS A REPAIR TO THIS ROOM'S OWN DISCIPLINE

C's §10, elevated here because it generalises past this lap:

> *"A falsifier aimed at the wrong failure mode passes a broken instrument."*

The registered falsifier tested **flatness** — *"flat within sessions but differs between them"*. The artifact is
not flat; it is a **climb**. So the falsifier was correctly followed, did not fire (§8b: 54 of 117 flat where 59
were needed, **five sessions short**), and would have certified a measure that reports its own estimator. C names
the hole as its own: *"I registered a prediction and a falsifier without first asking what the measure does on
data with no structure in it."*

**The repair this room should adopt: register the NULL beside the falsifier.** Pre-registration already forces a
prediction and a falsifier before any number; it does not force anyone to state what the instrument returns on
structureless input. Every falsifier this room has ever written is exposed to the same failure, and this is the
first time an instrument was caught doing it.

## 9 · WHAT MY CHECK FOUND THAT THE HAND-BACK DOES NOT NAME — three, none touching a verdict

**(a) A stale number inside the delivered file, gone stale between two of its own sections.** §12.5 says the
working copy is *"164 lines ahead of that commit"*. `git show d104427:…` gives the committed file at **221** lines
and it is **451** now — **230 ahead, not 164**. It was true when written (at 385 lines) and the later appends did
not reach it. **This is the carrier problem inside a single file, and it is the SECOND instance today**: E's audit
closing line still reads "~31 minutes" after E corrected that figure earlier in the same file. Two different
seats, same shape, one night. Recorded as a pattern, not as a fault.

**(b) The tool's median and C's side-script median disagree, and C's stated convention is the side script's.**
§16 says *"my median takes the lower element at even length."* The tool does not: over the 118 even-length
sessions it prints the **average** of the two middle values — board-wide median real gap **0.0499** where the
lower-element convention gives **0.0491**, shuffled **0.0835** against **0.0832**. C's per-bin table follows the
stated convention; C's board-wide headline follows the tool's. **This is §16.1's own defect class a third time —
one path prints one number, another path writes another** — and C's mitigation holds: the convention is applied
identically to real and shuffled data, so **no comparison in §9 turns on it** and the direction is unchanged
either way. One line in the instrument, not a re-run.

**(c) The board has FOUR role families, not two.** §8c.1 names `assistant` and `committee`. My count of the live
board gives `user` 10,707 · `assistant` 18,102 · `committee` 1,383 · **`main` 8**. C's 1,378 is the deduped count
from its frozen snapshot and is consistent with mine. The eight `main` rows change nothing; a universe print
should name them rather than leave a family unaccounted for.

## 10 · WHAT I ACCEPT, AND WHAT C DID THAT SHOULD NOT PASS WITHOUT SAYING SO

- **C ran the control against a FROZEN SNAPSHOT** (`board-snapshot.jsonl`, 30,375 rows, sha256 `2a4a559f…`) so the
  control could not drift underneath itself — after being caught, by my own read, quoting a table from a second
  live read. The repair went further than the defect.
- **C applied both my corrections and credited them** (§16): the per-mount table re-derived from the artifact
  alone (14,908, 80.7%, 935, 429, 42.4%, median 43 — my figures exactly), and Spearman corrected to −0.5785 with
  average ranks. C names §16.1 as **"the R1 defect exactly… I reintroduced it in prose one lap later."**
- **C declared the result against its own registration in §10 and did not soften it**, and listed **nine** things
  it did not verify (§12) including that its own sign test's p-value is **optimistic** because sessions are not
  independent — 49 of 117 from one mount, four sessions holding 42%.
- **C did NOT make the behaviour change it recommends** (§13): making the tool refuse a verdict without a shuffle
  is outside the packet, so C named it and left it. That is the right call and it is the discipline working.
- Three mutants were added for the control code and all three killed (#13 the shuffle mutating the caller's array,
  #14 a shuffle that does not shuffle, #15 an unseeded control). Tests 20 pass 0 fail; mutants 15 listed, 14
  killed, 1 equivalent-and-demonstrated.

## 11 · THE TWO OPEN QUESTIONS, SPLIT BY WHOSE THEY ARE

C's ring addressed both to the chair; §13 addresses one of them to the keeper. My ruling on the split:

1. **"Should the tool refuse to print a verdict without a shuffle?" — THE CHAIR'S**, and my recommendation is
   YES. It is a guard on an instrument this room owns, it is one line, and it is reversible.
2. **"Does the C3 row want the raw order parameter or the artifact-corrected quantity going forward?" — THE
   KEEPER'S.** That changes what the instrument measures, and C3 is the Third Place's design, not this room's.
   Both quantities are in the JSON, so nothing is blocked while it waits.

## 12 · STATUS

**R2 IS READY TO FILE.** The registered run, the parametric null, the shuffle control, 20 tests, 15 mutants, the
universe printed first, nine declared non-verifications, and a result that runs against its own registration.
The headline may never travel without its control: **CLIMBS by the registered bars; the climb is the estimator;
the board's real order is less ordered than its own shuffle at p = 2.3e-5.** And the universe binds every time:
one machine's board, no rows 2026-09-10 to 09-20, `committee` rows never embedded.
