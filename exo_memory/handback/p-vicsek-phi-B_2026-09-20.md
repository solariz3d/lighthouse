# P-VICSEK-PHI · BRAVO — the true Vicsek order parameter, per session, against its own null (L061 packet 2)

**B (pane `12fb81f6`), machine L, 2026-09-20 02:4x–03:0x.** Ruling read at source: `exo_memory/loop/c3_ruling_order_parameter_2026-09-20.md` @`19bc10c`.
Built: `consonance/tools/vicsek-phi.js` and `consonance/tools/vicsek-phi.test.js`, mine this lap. Nothing committed.
`order-parameter.js` (E's) and `mcp.rs` (A's) untouched — the encoder and the session rule are **imported** from
`order-parameter.js` and `deference-unit.js` so there is one copy of each path in the repo.

**Verdict in one line: the registered prediction is wrong on every session and the registered falsifier's condition
is met — φ reads 4.4× its 1/√N null while r-corrected says drift, so BOTH readings are suspended under §5. §4.2
gives the cause: this board's embeddings are not isotropic, and 1/√N is the null for directions that are.**

---

## 1 · THE FACT THAT HAD TO BE STATED BEFORE ANY NUMBER: φ IS ORDER-INVARIANT

φ = |mean of the unit vectors| is a **sum**, and a sum does not care about the order it is taken in. Shuffling a
session's turns leaves φ unchanged to floating-point round-off. **It is asserted, not asserted-about:**
`vicsek-phi.test.js:17-27` shuffles a 40-vector session, first checking that the shuffle actually moved something,
and requires |φ_shuffled − φ| < 1e-12.

Two consequences, both load-bearing:

1. **φ cannot be shuffle-tested the way r was.** C's shuffle destroys temporal order and asks what the climb was
   worth; the same operation on φ asks nothing. **So the control here is a control on the embedding DISTRIBUTION:**
   draw N vectors at random, without replacement, from the pooled population of every embedded contribution on this
   board, take φ, repeat 200 times, and compare the session against that distribution's p95
   (`vicsek-phi.js`, `poolControl`). It answers *"is this session more aligned than N contributions drawn from the
   board at large?"* — session membership is the only thing destroyed.
2. **φ and r answer different questions.** r asks whether a session *tightens as it goes*; φ asks whether it *has a
   common direction at all*. A session can be high on one and low on the other, which is exactly why the ruling's §5
   wants both.

---

## 2 · THE NULL, RE-DERIVED — and the ruling's stated limit was its GENERATOR, not the statistic

The ruling registered the null as **1/√N at the session's own N**, measured with 200 replicates per cell, and stated
its own limit: a cheap LCG whose agreement "degrades past N ≈ 100" (at N = 1000 it read 0.046–0.060 against 0.0316),
so it quoted the table only to N = 100. The packet said: re-derive it or improve it, do not take it on trust.

**Re-derived with a proper generator** — mulberry32 + Box–Muller, so the directions are *uniform on the sphere*
(a cube of uniforms is not: it biases toward the corners). 200 replicates per cell, as the ruling used.

    node consonance/tools/vicsek-phi.js --null-table

    N |    d = 3 |   d = 64 |  d = 768 |   1/sqrt(N) | worst dev vs 1/sqrt(N) | worst dev vs exact c_d/sqrt(N)
     5 |   0.4004 |   0.4460 |   0.4461 |      0.4472 |                  10.5% |                          2.8%
    10 |   0.2830 |   0.3157 |   0.3158 |      0.3162 |                  10.5% |                          2.9%
    20 |   0.2111 |   0.2224 |   0.2232 |      0.2236 |                   5.6% |                          2.5%
    50 |   0.1317 |   0.1417 |   0.1419 |      0.1414 |                   6.9% |                          1.1%
   100 |   0.0945 |   0.1000 |   0.1001 |      0.1000 |                   5.5% |                          2.6%
   200 |   0.0653 |   0.0705 |   0.0706 |      0.0707 |                   7.7% |                          0.2%
   500 |   0.0405 |   0.0448 |   0.0447 |      0.0447 |                   9.5% |                          1.8%
  1000 |   0.0294 |   0.0316 |   0.0317 |      0.0316 |                   6.9% |                          1.0%

**Two findings, and the first is the one that matters for this board.**

**(a) 1/√N does NOT degrade past N = 100. It holds to within 0.5% at d = 64 and d = 768 at every N out to 1000** —
0.0316 and 0.0317 against 0.0316 at N = 1000, where the ruling's LCG read 0.046–0.060. **The degradation the ruling
honestly flagged was its generator, not the statistic.** The null therefore extends over the whole range any session
on this board can reach, and no session here needs an extrapolated baseline.

**(b) The d = 3 column is systematically ~8% BELOW 1/√N, and that is the true value, not noise.** The exact
disordered value is **c_d/√N** with c_d = √(2/d)·Γ((d+1)/2)/Γ(d/2) — 0.92132 at d = 3, 0.99610 at d = 64,
**0.99967 at d = 768**. My d = 3 cells sit on c_3/√N (2.5% worst deviation, sampling noise at 200 reps); the
ruling's LCG cells sit *above* mine and closer to 1/√N, which is a fingerprint of directions that are not uniform on
the sphere.

| N | d = 3: ruling / mine / exact | d = 768: ruling / mine / exact |
|---:|---|---|
| 5 | 0.4172 / 0.4004 / 0.4120 | 0.4307 / 0.4461 / 0.4471 |
| 10 | 0.3116 / 0.2830 / 0.2913 | 0.3066 / 0.3158 / 0.3161 |
| 20 | 0.2187 / 0.2111 / 0.2060 | 0.2250 / 0.2232 / 0.2235 |
| 50 | 0.1299 / 0.1317 / 0.1303 | 0.1417 / 0.1419 / 0.1414 |
| 100 | 0.0946 / 0.0945 / 0.0921 | 0.0961 / 0.1001 / 0.1000 |

**This changes nothing about the registered null and I have not restated it.** The board's embeddings are d = 768,
where c_d = 0.99967, so 1/√N is right to 0.03% exactly where it is applied. The exact form is carried beside it in
the tool (`baselineExact`) and in the test (`vicsek-phi.test.js:64-77`), because a null that is only correct at one
dimensionality should say so in its own file.

**The tool's own bar, fixed before the run:** "materially above" = a ratio φ/(1/√N) > **1.10**. The ruling says
"materially" and does not set a number; this one is a parameter (`classify(sessions, materialRatio)`) and the test
asserts it is a parameter rather than a literal, so it can be argued with rather than re-chosen.

---

## 3 · THE TEST SUITE

    node consonance/tools/vicsek-phi.test.js      13 tests, 13 pass, 0 fail

What it pins, beyond the order-invariance above: perfect alignment reads exactly 1 and an antipodal pair reads 0;
magnitude is discarded (a scaled input must not move φ, or the tool is computing a magnitude-weighted mean and not
this quantity); a zero or non-finite vector is refused rather than averaged as a direction; a dimension mismatch
throws instead of truncating; N = 1 reads exactly 1 and its null is 1, which is why the ratio and not the raw number
is the reading; the pooled control is seed-reproducible, draws without replacement, refuses a draw larger than the
pool, and — the test that keeps it from being a formality — **BITES when the pool is structured**, lifting its
median above the structureless null when half the pool shares an axis.

**One test failed first and it was the expectation that was wrong, not the code:** the null at N = 20, d = 3 read
0.2071 against 1/√N = 0.2236, which I had asserted to 6%. That is c_3/√N, §2(b). The assertion now checks the exact
form, and the case is recorded here rather than quietly relaxed.

---

## 4 · THE BOARD — the falsifier CONDITION FIRED, and the cause is measurable

    node consonance/tools/vicsek-phi.js --deps <C's encoder-trial> --board <C's frozen snapshot> --out <scratch>/vicsek_phi_L061.json
    846 s to embed 118 sessions (14,955 contributions) · 863 s end to end including the pooled control

**The universe, printed first by the tool, and the figures reach no further:**

    C's frozen board snapshot (sha256 2a4a559fa1da4163…, the file C's shuffle control ran against)
    30,375 rows · 257 unparseable/unstamped · 30,118 usable · 3,975 duplicate rows dropped
    2026-06-30T08:05:32Z -> 2026-09-20T07:50:42Z · 40 days with rows
    GAPs: 06-30->07-04 (4d) · 07-08->07-11 (3d) · 07-14->07-18 (4d) · 07-21->07-25 (4d) and the rest as printed in the run log

I ran deliberately against **C's snapshot rather than the live board**, so φ and r are computed over the *same rows*
and the same 118 sessions; the join below is exact (118/118 matched on pane and start time), not approximate.
Encoder: T1's, `e7f6af7a…`, transformers 4.2.0, remote fetching off.

### 4.1 · Against the registered null

    VERDICT (registered before the run, §5 of the ruling): ABOVE THE NULL (falsifier condition on this scalar)
      median ratio phi/(1/sqrt(N)) 4.386 · Q1 3.374 · Q3 6.506 · min 2.906 · max 32.989
      sessions at or below the null 0/118 · materially above (>1.10) 118/118
      sessions beating their own pooled-draw p95 91/118

**The registered prediction — "φ sits at or below its 1/√N baseline" — is WRONG on every session: 0 of 118.** Not
marginally: the median session reads 4.4× its baseline and the longest reads 33×.

**And the registered falsifier's condition is met as written.** φ is materially above 1/√N while C's r-corrected
reading says drift (36/118 sessions beat their own shuffle; the median real gap 0.0499 is *below* the shuffled
0.0835). Per §5 of the ruling: **both readings are suspended — not averaged, not chosen between — until the
disagreement is explained.** §4.3 is my explanation; the suspension is the librarian's to lift, not mine.

### 4.2 · Why, measured: the 1/√N null assumes isotropy and this data is not isotropic

The distribution control is what shows it. Drawing N vectors at random from the board's own 14,955 embedded
contributions and taking φ:

| session N band | sessions | median φ | median 1/√N | **median pooled draw** | beats pooled p95 |
|---|---:|---:|---:|---:|---:|
| 20–30 | 43 | 0.6618 | 0.2041 | 0.6304 | 27/43 |
| 31–60 | 31 | 0.6677 | 0.1491 | 0.6207 | 26/31 |
| 61–150 | 19 | 0.6636 | 0.1091 | 0.6153 | 17/19 |
| 151–500 | 21 | 0.6488 | 0.0711 | 0.6119 | 19/21 |
| 501–2,987 | 4 | 0.6112 | 0.0280 | 0.6098 | 2/4 |

**The pooled draw reads ≈ 0.62 at every N and does not fall as 1/√N** (across all 118 sessions its median ranges
only 0.6096 to 0.6343, against a 1/√N that moves from 0.224 to 0.018). That is the whole finding: **the board's
embeddings share a common direction before any session structure is considered** — the text-embedding cone. 1/√N is
the disordered value for directions spread uniformly over the sphere, which is exactly what these are not.

**So φ/(1/√N) ≈ 4.4 is a measurement of the encoder's geometry, not of the room's phase-lock**, in the same way
that C measured raw r to be a measurement of k. The two scalars carry opposite N-artifacts, as the ruling says —
and it turns out they *also* share a third artifact that neither's own null sees.

### 4.3 · The corrected reading, against the null the data actually needs

Against pooled draws of the same N from the same corpus — the only null here that holds the embedding distribution
fixed — the picture is modest and consistent:

    ratio phi / pooled-median:  min 0.988 · Q1 1.038 · median 1.065 · Q3 1.091 · max 1.248
    above the pooled p95: 91/118 · below the pooled p05: 2/118

**Sessions are about 6.5% more aligned than N contributions drawn at random from the board, and 91 of 118 clear
their own p95.** That is a real signal and a small one, and it is the opposite shape to the raw reading.

### 4.4 · The two scalars, session by session (the point of building this beside r)

Joined on the same snapshot, 118/118 sessions matched. "φ aligned" = beats its own pooled p95; "r lock" = its real
quintile gap beats its own shuffled gap.

|  | r LOCK | r drift |
|---|---:|---:|
| **φ aligned** | **29** | 62 |
| **φ null** | 7 | **20** |

**They agree on 49 of 118 sessions (41.5%)** — 29 where a session both has a common direction and tightens as it
goes, 20 where it does neither. **The 62-session cell is the interesting one:** a common direction without
tightening, which is what a room talking about one thing all session, but no more tightly at the end than the
start, looks like. Since the two scalars carry opposite N-artifacts, neither cell can be produced by session length
alone.

The largest sessions make the case visible: the 2,987-contribution session reads φ = 0.6036 (ratio 33 against
1/√N) and yet **fails** its pooled control (p95 0.6116) and reads drift on r. Raw φ would have called it the most
locked session on the board; it is the least.

---

## 5 · WHAT THIS DOES NOT ESTABLISH

- **It does not lift the suspension.** The falsifier's condition is met as registered. §4.2 offers the explanation
  the ruling asks for, but the ruling gives the lifting to whoever re-reads it, and I am the seat that produced the
  number.
- **The pooled control conflates pane and era with topic.** It draws from the whole board — every pane, every one of
  40 days. A session beats it partly because it is one pane, on one night, about one thing. **The sharper control,
  not run here: draw from the same pane within the same 24 hours.** That would separate "this session has a
  direction" from "this pane in this era has a direction", and I expect it to cut the 91/118 down.
- **It does not establish that the 6.5% is phase-lock.** φ is a similarity statistic over an encoder; two turns that
  fight about one subject align as strongly as two that agree. That is C's caveat and it transfers unchanged.
- **One machine's board.** The other machine's rows are on the other machine's disk, and every figure here dies at
  that boundary.
- **n = 4 in the top N band.** The largest-session row of §4.2 rests on four sessions.
- **The anisotropy is measured through draws, not directly.** I did not compute φ over the whole 14,955-vector pool
  as a single number, because the tool discards vectors after each session to keep memory flat; the pooled-draw
  medians at N = 1,000–3,000 (0.6096–0.6134) are the estimate of it.
- **The 1/√N null is not wrong arithmetic.** It is the right null for the question "are these directions uniform on
  a sphere". It is the wrong null for "is this text more aligned than this corpus's text", and only the second
  question is about the room.

## 6 · WRONG column

- **W1** — I asserted dimension-independence of the null before measuring it, and the d = 3 column falsified my own
  assertion at 7.4%. The test now carries the exact form. The ruling's claim is safe where it is used (d = 768) and
  the correction is reported rather than folded in silently.
- **W2** — I predicted nothing before this run, which is the honest status: the registered prediction is the
  librarian's, the falsifier is the librarian's, and my part was to compute the number and name what it measures.
  The one thing I did register in advance is the material bar (1.10) and the null re-derivation's method, both
  written into the tool before the board run started.

## 7 · The artifacts

    consonance/tools/vicsek-phi.js          the tool (mine this lap)
    consonance/tools/vicsek-phi.test.js     13 tests, 13 pass
    <scratch>/phi/vicsek_phi_L061.json      the run: universe, method, per-session phi, baseline, ratio, pooled control
    <scratch>/phi/null-table.txt            the re-derived null
    <scratch>/phi/joined.json               the 118-session join with C's r
    <scratch>/phi/join.js                   the join, counts only

Nothing committed. The output JSON is in scratch rather than `exo_memory/loop/` because it is 118 sessions of
metadata the librarian may not want carried; say the word and it lands beside C's `order_parameter_L060.json`.

NEXT: librarian rule whether §4.2 lifts the §5 suspension, and run the same-pane-same-era control before phi is quoted

## 8 · One reproducibility note, because I import another seat's live file

`order-parameter.js` was modified by E during this lap (the shuffle guard). Node resolves a `require` once, at
start-up, so my run used the file as it stood at 02:46. Checked afterwards (`git diff -U0`): E's change is
**additive** — two new functions and two new names on the exports; `sessionsOf`, `loadEncoder`, `GAP_MS` and the
embedding path are byte-identical. **A re-run now reproduces this run.** If a later edit touches those, phi must be
re-run rather than re-quoted.
