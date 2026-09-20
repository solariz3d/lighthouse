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

---

# PART THREE — §17/§18, READ. Appended 2026-09-20 02:2x.

## 13 · §17 RE-DERIVES, INCLUDING THE PART THAT CORRECTS ME

From C's control artifact, recomputed:

- **§17.1, the control per mount — all six rows EXACT**, every column: real median, shuffled median, beats-count,
  real positive slopes and shuffled positive slopes. `0c0c0c0a` 50 sessions 0.0185 / 0.0449 / 16 of 50 / 41 of 50
  / **50 of 50**; `6fe15f0a` 19 / 0.0759 / 0.1093 / 4 of 19 / 16 of 19 / 19 of 19; `0c0c0c0b` 17 / 0.0651 /
  0.0769 / 8 of 17 / 14 of 17 / 17 of 17; `0845a868` 13 / 0.0519 / 0.1098 / 2 of 13 / 8 of 13 / 13 of 13;
  `a2122153` 11 / 0.0762 / 0.1180 / 2 of 11 / 11 of 11 / 11 of 11; `12fb81f6` 8 / 0.0967 / 0.0999 / 4 of 8 /
  8 of 8 / 8 of 8. Sessions sum to 118.
- **§17.5's third rider re-derives: real loses to its own shuffle in exactly 82 of 118.**
- **§17.3 accepts my convention catch and reproduces it exactly**, and C is right that the verdict never depended
  on it: the tool's own `quantile()` interpolates and the board-wide median is over 117, which is odd. The
  monotone descent under the interpolated convention is **0.1024 → 0.0640 → 0.0241 → 0.0161 → −0.0253**.

## 14 · ONE NUMBER IN §17.4 IS THE REGISTERED RUN'S, CARRIED INTO A CONTROL TABLE — and the ruling survives it

§17.4 excludes **19** boot-prefixed sessions. Selecting on the mount and on `r_2 = 0.3294` in the CONTROL
artifact I find **20**, and every derived figure shifts by one session:

| | C's §17.4 | my re-derivation |
|---|---|---|
| boot sessions excluded | 19 | **20** |
| without them: positive slopes | 83/99 | **83/98** |
| without them: real vs shuffled median | 0.0552 vs 0.0901 | **0.0557 vs 0.0922** |
| without them: beats | 31/99 | **31/98** |
| the boot sessions alone: beats | 5/19 | **5/20** |

**The likely cause is a carry, not a miscount:** the 19 is §8c.2's figure, counted on the REGISTERED run where
that mount has 49 eligible sessions; the control ran on the snapshot where it has **50**. The count was carried
across the two runs without being re-taken on the second — the same class as §5's moving-board table, one level
smaller. *My own limit, stated:* I selected by `r_2` to four decimals rather than by matching the greeting text,
so one of my 20 could in principle be a coincidence; C's method is the better one and only the count is in
question.

**C's ruling is unaffected and holds under my numbers too** — in fact slightly more strongly: excluding them
moves the share beating its own shuffle from 30.5% to **31.6%** (C: 31.3%) and widens the real-to-shuffled gap.
The 19-or-20 are not driving the finding in either direction. **They stay in.**

## 15 · THE RING'S DIGEST DOES NOT MATCH THE FILE, AND THAT IS THE FOURTH INSTANCE TODAY

C's ring states `sha256 67e14af28ae63063…, 529 lines`. The file on disk is **571 lines**, sha256
`a2e076761235b330264aea591050ffcab98e0c2288ac9b049f95707515191732`, mtime **08:17:17Z — three seconds before the
ring reached me at 08:17:20Z**. C appended 42 lines after computing the digest and before the ring landed.

**This is not pedantry and it is not noise: C's FIRST ring's digest matched the disk exactly**, which is how I
opened that file with confidence. A digest is the one number in a hand-back whose entire job is to prove the file
has not moved — **and it went stale the same way every other number in this file went stale**, between being
computed and being read.

**Fourth instance of one shape in one night**, now across three seats: A's invented 25-minute breakdown; E's audit
closing line still reading "~31 minutes" after E corrected it higher up; C's §12.5 "164 lines ahead" when it is
230; and now C's delivery digest. **The repair is mechanical, not disciplinary:** compute the digest as the last
act before the ring, or have the ring compute it.

## 16 · THE LIVE DEFECT — A CANCELLATION CANNOT OVERTAKE THE MESSAGE IT CANCELS, AND C ANSWERED A CANCELLED PACKET

This is mine, from the board, and §18 does not name it. Re-derived from `C:/Consonance/data/board.jsonl`:

| time (Z) | event |
|---|---|
| 08:06:44 | my collation reaches the chair — **the wrong one, built from an undelivered draft** |
| 08:07:32 | chair **QUEUES** the re-run dispatch to C · `QUEUED -> 0845a868 (1 waiting, stamp=working)` |
| 08:08:54 | my withdrawal reaches the chair |
| 08:09:35 | chair **QUEUES** the cancellation · `QUEUED -> 0845a868 (2 waiting, stamp=working)` |
| 08:13:18 | **C's first ring** — the receipt that makes a hand-back delivered |
| **08:13:37** | the re-run dispatch is **DELIVERED** — already cancelled 4m 02s earlier |
| **08:16:17** | the cancellation is **DELIVERED** — **2m 40s after the thing it cancels** |

**The delivery gate holds messages for a busy pane and releases them in queue order, so a cancellation queued
behind its own target can never arrive first.** C received a packet the chair had already withdrawn, and answered
it — §17 exists because of that. C's §18 records the cancellation and says "nothing was re-run on its account",
which is true and is the right check; what it does not notice is that **the cancelled packet was delivered to it
before the cancellation was.**

**§18's own framing needs one correction in the same direction.** It reads *"the chair's re-run dispatch arrives,
20 s after that receipt"*, and treats the crossing as the dispatch being written after C rang. The board
separates the two: the dispatch was **written at 08:07:32**, five minutes and forty-six seconds BEFORE C's ring,
on the strength of my wrong collation — and only **arrived** 20 s after it. C's conclusion is unchanged (the
command was not owed by the time it landed); the sequence is not.

**And a third edge, which is mine and is a cost of my own correct move.** At 08:16 I recorded
`--stage L060 handbacks-in`, holder librarian. At 08:17:26 the board shows
`call_librarian REFUSED OUT OF TURN — mount C tried to speak while NO open lap is held by panes`. **The stage
that declares every hand is in silences any hand that is not** — C, still appending, had to post a board line
instead of ringing. That is circular at exactly the moment this lap proved matters: a pane mid-append is
indistinguishable from a pane that is done, and the stage model resolves it by making the pane unable to say so.

## 17 · ONE ATTRIBUTION, FOR THE RECORD ONLY

§17.2 credits *"the chair's extra catch that my own column summed to 14,933"*. That catch is in Part One §3(a) of
this file, written before the chair's packet; the chair relayed it. Recorded because this room's own lesson is
that a relay can acquire authorship on the way through (`CLAUDE.md`, the 09-01 hop), not because it matters to
the result.

## 18 · STATUS, UNCHANGED

**R2 IS READY TO FILE.** §17 strengthens it: the control now runs per mount, and **every mount's real median sits
below its own shuffle while every mount's shuffled slopes are positive 100% of the time.** No mount escapes it.
The headline still may not travel without its control.

---

# PART FOUR — THE FILE HAS STOPPED MOVING. LAND IT. 2026-09-20 02:2x.

## 19 · THE VERIFICATION THE CHAIR HELD THE LANDING FOR

Three reads, seconds apart, at 08:20:42–08:20:43Z:

```
lines=571  sha=a2e076761235b330  mtime=02:17:17.342
lines=571  sha=a2e076761235b330  mtime=02:17:17.342
lines=571  sha=a2e076761235b330  mtime=02:17:17.342
```

Full digest: `a2e076761235b330264aea591050ffcab98e0c2288ac9b049f95707515191732`. **The mtime has not moved since
02:17:17 — three and a half minutes of stillness**, across the whole span in which the chair's interrupt was
written, delivered and answered. 21 sections; the last two are §17 and §18. **LAND IT.**

**And I have read all 571 lines.** Part Three of this file collates §17 and §18 in full, item by item, with §17.1
and §17.5 re-derived from the control artifact. The chair's interrupt says my collation "covers 451 lines and
about 78 more have arrived since, unread by you". That was true of PART TWO. It stopped being true at `a004337`.

## 20 · THE INTERRUPT ITSELF CROSSED A RING — the third crossing tonight, by the same mechanism it warns about

Not a fault, and worth the two lines it takes to say, because it is now a pattern with three instances and a
common cause:

1. **My Part Two collation** was built from C's file at 221 lines while C was appending — *caught by the keeper.*
2. **The chair's re-run dispatch** was written at 08:07:32 on that collation, delivered at 08:13:37, and its own
   cancellation arrived 2m 40s behind it — *caught by me, from the board.*
3. **This interrupt** was written against my Part Two state while Part Three was in flight — *caught here.*

**The common cause is not carelessness in any of the three seats. It is that this room has no way to say "my
last word is still being written."** Every channel we have — a file on disk, a queued packet, a ring — reports a
*state* and none of them reports *motion*. Three seats hit it in ninety minutes.

## 21 · ONE FIGURE IN THE INTERRUPT IS TWO STATES FUSED INTO ONE ROW

Stated because it is checkable and because it is the night's own error class appearing inside the message that
names it. The interrupt reads:

```
wc -l   529 lines
sha256  67e14af28ae63063f067…   at 02:17:2x
sha256  a2e076761235b330…       seconds later, same turn, same file
mtime   02:17:17, nine seconds before my first read
```

**The disk does not support two successive states.** `a2e07676…` is the digest of the **571-line** file, and its
mtime is 02:17:17 and has not changed since. A disk write producing `67e14af2…` "at 02:17:2x" would have to be
*after* 02:17:17 and would have moved the mtime; it did not. **The 529 / `67e14af2…` pair is C's stated digest,
quoted from C's ring — where it was already stale when sent (Part Three §15).** So the row pairs a line count
from a pane's message with a digest from the disk and presents them as two readings of one file.

**This is the relay shape this room has measured before** (`CLAUDE.md`, the 09-01 hop that invented a premise):
a figure changes status as it passes through a seat — here, from *a pane's claim about a file* to *an observation
of the file*. The correction costs nothing and the interrupt's judgement was right regardless: holding the
landing until the file stops moving is the correct call, and the file has now stopped.

## 22 · THE TWO RULINGS, RECEIVED

- **The shuffle-refusal guard: the chair's, and YES.** It goes to a pane as a packet. **My one surfacing on it:
  send it to a NON-AUTHOR of the instrument.** C wrote `order-parameter.js`, its 20 tests and its 15 mutants; a
  guard written by the seat whose verdict it constrains has no independent reader. E and B are both free and both
  have done mutation work on other seats' code tonight.
- **Raw versus artifact-corrected for C3: the keeper's**, as I ruled, and nothing blocks while it waits — both
  quantities are in `order_parameter_L060.json`.

## 23 · STATUS

**R2 IS READY TO FILE AND THE FILE IS STILL.** To land: `exo_memory/handback/p-order-parameter-C_2026-09-20.md`
at 571 lines, sha256 `a2e076761235b330…`, and `exo_memory/map/C.md`. The instrument, its test and the
registered-run JSON are already in at `d104427`, whose commit message ("the lap owes one command") is wrong and
is corrected on the ledger and in §15 of the hand-back.

## 24 · CLOSING NOTE — the lap landed before this part was filed, and nothing above was rung

`3d308ff` — L060 R2 landed and pushed, ledger `filed`, holder none. §19's verification reached the chair; §20–§22
are filed to disk only. **No ring was sent for this part.** The keeper's correction at 02:2x is the reason and it
is the right one: the chair's interrupt asked for the verification, but answering a request is not a licence to
keep a channel open, and I had already rung twice on a lap whose pane was still writing.

**The keeper's own words are the sharpest evidence for §20's finding, and they should be quoted rather than
paraphrased:** *"c is still working, and you sent to the orch again I SSEE THAT"*, then, seconds later, *"or maybe
they were just finishing up."* **He was watching the panes directly and could not tell which.** Neither could the
chair, which wrote its interrupt against a state three minutes stale. Neither could I, twice. **Four observers,
one of them human and none of them wrong to be unsure — because there is nothing to observe.** The disk settles
it after the fact: the file has not changed since 02:17:17 and the second guess is the correct one.

**The mechanical repairs this suggests, in order of cost:** have the ring compute the digest at ring time rather
than quoting one the pane computed earlier; treat a hand-back as deliverable only once its file has been still
for a stated interval, and say the interval in the ring; and give a pane a way to say *still writing* that the
pulse can read, so that a state channel gains a motion channel. None of the three requires anyone to be more
careful, which is why they are worth more than the resolution to be.

---

# PART FIVE — THE KEEPER SPLIT THE PROBLEM IN TWO, AND THE TWO HAVE DIFFERENT SIZES. 2026-09-20 02:2x.

## 25 · HIS OBSERVATION, VERBATIM, BECAUSE IT NAMES A MECHANISM I HAD MERGED INTO ANOTHER ONE

> *"its because also, panes and seats dont show the work is done to me for like a solid 5-10 seconds sometimes,
> when you recieve it instantly, the pane could be visually still building, while you already sent to orch, but
> really they were done"*

§20 of this file said *"the room has no signal for still-writing"* and treated every observer's uncertainty as one
failure. **That was too coarse. There are TWO gaps with opposite signs, and §20 collapsed them:**

| | what the pane LOOKS like | what is TRUE | who it fools |
|---|---|---|---|
| **A · render lag** | still building | **done** | the keeper — he waits, or reads a pane as busy that has finished |
| **B · post-ring appending** | done (it rang) | **still writing** | this seat — it collates a file that is still growing |

**They point opposite ways.** A makes a finished pane look unfinished; B makes an unfinished file look finished.
A seat reading only the ring sees B and never A; a human reading only the screen sees A and never B. Tonight both
fired on the same lap, four minutes apart, and each of us was fooled by the one our own channel is blind to.

## 26 · THE SIZES, MEASURED — and they differ by a factor of about twenty

**B, the appending gap, measured from the disk and exact:** C's first ring was receipted at **08:13:18.553** with
the hand-back at **451 lines**. The file's last write is **08:17:17.342** at **571 lines**. **239 seconds and 120
lines after the ring that declared it filed.**

**A, the render gap — the board corroborates the SCALE but cannot measure his screen.** What it holds are
within-turn emission gaps for the same seat, both `push`-sourced:

| event pair | gap |
|---|---:|
| C's ring receipted 08:13:18.553 → C's own board row 08:13:26.973 | **8.420 s** |
| chair's packet queued 08:15:58.565 → C's board row 08:16:05.164 | **6.599 s** |
| C's ring refused 08:17:26.749 → C's FINAL board row 08:17:40.808 | **14.059 s** |

**6.6 to 14.1 seconds, which brackets his "5-10 seconds".** *The honest limit, stated rather than glossed:* these
are gaps between two machine events in one seat's turn, **not** a measurement of his terminal's painting. His
screen is not in `board.jsonl` and I cannot reach it from here. The board agrees with his number's **magnitude**;
it does not confirm his number's **cause**, and only he can see that directly.

**So: A is seconds and B is minutes — about twenty to one.** That is what makes them separable at all.

## 27 · AND THIS ROOM HAS ALREADY BEEN BITTEN BY GAP A, FROM THE OTHER SIDE

Not a new surface — the *other direction* of one already measured. On 2026-08-16 the keeper found that
`chair_inject` returned **"echo confirmed"** while the room's own collapse metric is `echo_ratio`, and the chair
reported that string to him as a **receipt** when it meant only that *the pane's terminal had drawn the text*.
The verb was renamed to `render` (`58327b7`) for exactly that reason. **The lesson filed then was
RENDER ≠ RECEIPT.** Tonight's is its mirror: **STILL-RENDERING ≠ STILL-WORKING.** Same seam, same month, opposite
face — and no instrument was built either time.

## 28 · THE REPAIR GETS SHARPER, AND IT IS STILL ONE COMMAND

§24 proposed three fixes. The split makes one of them decisive and demotes the others:

**The file's mtime separates A from B and nothing else does.** A pane that is merely painting has a **still**
mtime; a pane that is still writing has a **moving** one. Neither the screen nor the ring can tell them apart —
the screen shows motion in both cases, the ring shows stillness in both.

    stat -c '%y' <handback>   # twice, seconds apart

- **mtime still and some minutes old** → the pane is done, whatever the screen is doing. *Collate.*
- **mtime moving** → it is still writing, whatever the ring said. *Wait.*

**And the keeper's half of it, which is his to want and not mine to impose:** if a pane looks busy for 5–10
seconds after it is done, then a "done" indicator driven by the **receipt** rather than by the **paint** would
give him the same separation on screen that the mtime gives me on disk. That is a UI question about Consonance,
and it is filed as a question, not as a plan.

## 29 · WHAT THIS CORRECTS IN MY OWN FILING, ONE HOUR OLD

§20's sentence *"four observers, one of them human and none of them wrong to be unsure — because there is nothing
to observe"* is **half wrong and I am striking that clause rather than deleting it.** There *is* something to
observe: the mtime, and it was on disk the whole time. What is true is narrower and survives: **no channel any of
us was WATCHING reports motion** — not the screen, not the ring, not the pulse. The observation exists; nobody
was making it. That is a different failure and a cheaper one to fix.
