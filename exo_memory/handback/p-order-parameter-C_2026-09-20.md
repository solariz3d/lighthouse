# P-ORDER-PARAMETER — C (CHARLIE), L060 R2, on L — DRAFT, appended as the lap runs

**Packet:** `exo_memory/loop/plan_retrieval_instruments_2026-09-20.md` §2, row R2. **Design:** the Third Place's
`DIVERSITY_COLLAPSE_INSIGHTS_2026-09-14.md` §C item 3, read at source with §D–§E. R1 landed at `6ca5749`.

## 1 · THE PREDICTION AND THE FALSIFIER, REGISTERED BEFORE THE INSTRUMENT RUNS

Written into this file before any curve exists; nothing has been embedded at the time of writing.

**The prediction** (the row's, verbatim): *"it climbs toward 1 within a session."*

**The falsifier** (the row's, verbatim): *"if it is flat within sessions but differs between them, it is measuring
the topic and not the lock."*

**How each will be scored, fixed here so it cannot be chosen after seeing the curve:**

- **CLIMBS** — per session, the order parameter `r_k` = cosine of contribution *k* to the centroid of contributions
  `1..k-1`. "Climbs" = the slope of `r_k` on `k` is positive in a majority of sessions with at least 20
  contributions, AND the last quintile's mean exceeds the first quintile's by more than the between-session spread
  (the IQR of session means), which is the same shape of bar R1 used and is computed BEFORE the within-session
  numbers.
- **FLAT WITHIN, DIFFERENT BETWEEN** — the falsifier fires if the majority of sessions have a slope not
  distinguishable from zero while the session means differ by more than that same IQR.
- **Neither** is a real outcome and will be reported as neither, not rounded to one of the two.

## 2 · The universe binds here too (carried from R1)

Any figure is quoted with the board's row count and its gaps: one machine's board, **no rows 2026-09-10 → 2026-09-20**,
257 unparseable rows dropped, and the board moves while the tool runs.

## Log

- 01:3x — prediction registered above, before touching an encoder. Next: whether T1's committed encoder is reusable
  here as-is. If it is not, the packet's instruction is to say so rather than substitute one.

## 1b · THE METHOD, registered before the instrument runs (nothing embedded at the time of writing)

- **Contribution** = an `assistant` row. The keeper's and the chair's inject rows are the field, not the
  contributions; the order parameter asks how aligned the system's own turns are with what it has already said.
- **Session** = a maximal run of one pane's rows with at most **60 minutes** between consecutive rows.
- **Rows are deduplicated first**, with R1's `dedupeRows` (the board records one turn up to three times: 3,975 rows,
  13.3%). Undeduped, a repeated turn would align perfectly with itself and manufacture order.
- **r_k**, for k ≥ 2 = cosine of contribution k to the centroid of contributions 1..k-1, where the centroid is the
  mean of unit vectors, renormalised.
- **Sessions with fewer than 20 contributions** are counted and reported but excluded from the slope test.
- **Embedding** is T1's exactly: `Alibaba-NLP/gte-base-en-v1.5` q8, ONNX hash-checked before load, CLS pooling, L2
  normalise, 1,800-id windows, token-weighted mean across windows.
- **If the whole board cannot be embedded inside this lap**, sessions are taken in REVERSE CHRONOLOGICAL order until
  the budget is spent, and the hand-back says how many of how many were embedded. No other selection is permitted.

## 3 · The encoder is T1's, reused AS-IS — checked, not assumed

The packet: *"the committed one that T1 used, not a new one. If it cannot be reused as-is, say so."* It can.

| what | value | command |
|---|---|---|
| model file | `models/Alibaba-NLP/gte-base-en-v1.5/onnx/model_quantized.onnx` | — |
| its sha256 | `e7f6af7a9457d4fdd3af220c68e9a37325aad7c2d306bbc855fe0d019c326509` | `sha256sum <deps>/models/.../model_quantized.onnx` |
| T1's committed sha | the same string, `dev/diversity/score-portable.mjs:51` | `sed -n '51p' dev/diversity/score-portable.mjs` |
| library | `@huggingface/transformers` **4.2.0** | `node -e "console.log(require('<deps>/node_modules/@huggingface/transformers/package.json').version)"` |
| pooling | CLS, L2-normalised, 1,800-id windows, token-weighted across windows | `dev/diversity/score-portable.mjs` |
| remote fetching | `env.allowRemoteModels = false` | `order-parameter.js` |

**One thing the room should know, and it is not a defect of this lap:** `dev/diversity/score-deps/node_modules` is
**absent from this checkout** and `dev/diversity/models` does not exist in the repo — the weights and the library are
deliberately untracked. The copy used here is my **L059 trial scratch**, and it is the same file *by hash*, which is
the only claim that matters. `--deps <dir>` exists so the path is an argument and never a hardcoded machine path;
T1's own `score.mjs` hardcodes the desktop repo root, which is why it could not simply be called.

## 4 · Mutants on the instrument — 12 listed · 11 killed · 1 SURVIVED (equivalent, shown below) · 0 no result · 0 not applied

`node consonance/tools/mutant-harness.js <scratch>/def/rows-order.js` — HEAD worktree copy, live file hashed before
and after: `live consonance/tools/order-parameter.js unchanged: true`. Pre-flight on the unmutated copy green 15/0.
The harness scores cargo output only, so a JS score adapter (`score-order.js`) copies the **live, uncommitted** test
file into the worktree and prints a cargo-shaped line; without that, this lap's tests would not be the ones scoring.

Killed: #1 the centroid stops running (measured against the whole session) · #2 the gap widens to a day · #3 the
boundary flips to exclusive · #4 user rows become contributions · #5 the slope sign inverts · #7 the quintile gap
reverses · #8 CLIMBS stops having to clear the between-session spread · #9 the falsifier is made unreachable ·
#10 NEITHER is rounded into CLIMBS · #11 three sessions stop being the floor · #12 the encoder hash check is removed.

**Run 1 was 9/12.** #2 and #12 were real holes and are now closed by two tests: the session-gap test always passed
the gap explicitly, so the 60-minute **default** was unpinned; and nothing exercised the encoder gate at all. The
fix for #12 is more than a test — the hash check now runs **before** the library is imported (`checkEncoderFile`),
so a wrong model fails as a wrong model and the gate is testable without the weights present.

**#6 is EQUIVALENT, and that is demonstrated rather than claimed.** Removing the `ys.length < 2` guard changes no
output, because `den === 0` already returns null for every input under two points:

| input | original | mutant |
|---|---|---|
| `[]` · `[0.5]` · `[0]` · `[1e9]` | `null` | `null` |
| `[0.1,0.2]` | `0.1` | `0.1` |
| `[3,1,2]` | `-0.5` | `-0.5` |

A test written to kill it would have to assert an internal branch rather than a behaviour, which is the vacuous-test
trap I paid for at D067 and again in R1. It is left alive and named.

## 5 · The universe, printed before any result — and it is lopsided in a way that binds the answer

`node consonance/tools/order-parameter.js --deps <dir>` prints this first and refuses to be quoted without it.

```
C:/Consonance/data/board.jsonl
30333 rows, 257 unparseable/unstamped, 30076 usable, 3975 duplicate rows dropped
2026-06-30T08:05:32.435Z -> 2026-09-20T07:41:22.269Z · 40 days with rows
GAP 2026-06-30 -> 2026-07-04 (4d)   GAP 2026-07-08 -> 2026-07-11 (3d)   GAP 2026-07-14 -> 2026-07-18 (4d)
GAP 2026-07-21 -> 2026-07-25 (4d)   GAP 2026-07-28 -> 2026-08-09 (12d)  GAP 2026-08-11 -> 2026-08-15 (4d)
GAP 2026-08-18 -> 2026-08-22 (4d)   GAP 2026-08-25 -> 2026-08-29 (4d)   GAP 2026-09-02 -> 2026-09-06 (4d)
GAP 2026-09-10 -> 2026-09-20 (10d)
sessions 286 · with >= 20 contributions 117 · embedding 117
```

**One machine's board.** The other machine's rows are on the other machine's disk. The board also MOVED while the
tool ran: 30,333 rows at the run's read, **30,355** by `wc -l` twenty minutes later. Every figure below is quoted
against 30,333.

**The lopsidedness is the part that binds the reading, and it was not in the packet or in my registration:**

| mount | eligible sessions | contributions | share |
|---|---:|---:|---:|
| `0c0c0c0a-…0a01` (the fixed orchestrator seat) | 49 | 12,026 | **80.5%** |
| `0c0c0c0b-…` | 17 | 947 | 6.3% |
| `6fe15f0a-…` | 19 | 848 | 5.7% |
| `0845a868-…` (this seat) | 13 | 442 | 3.0% |
| `a2122153-…` | 11 | 400 | 2.7% |
| `12fb81f6-…` | 8 | 270 | 1.8% |

Four sessions hold **42.3%** of all 14,931 contributions; the largest is **2,987** contributions and the median
session is **46**. So a board-wide order parameter is, to four fifths, a measurement of **one seat's own turns**.
The registered bars weight sessions equally, which limits but does not remove it — 49 of the 117 sessions are that
one mount's. The per-mount verdicts are reported below and should be read before the board-wide one.

**And a plain consequence of the 60-minute rule, worth saying rather than burying:** for a continuously-worked
mount, a "session" is most of a working day, not a sitting. That is what the registered rule produces on this
board; it is not a defect discovered after the fact, but it is what the word means here.

## 6 · THE CONFOUND THE REGISTERED BARS CANNOT SEE — found after run 1, measured, and controlled for

This is the part of the lap I would lead with if only one thing were read.

**A running centroid is a mean ESTIMATE, and an estimate gets less noisy as k grows.** So `r_k` rises with k even
when the contributions carry no temporal structure whatsoever: early on, the centroid of two or three vectors is
mostly noise and any new vector scores low against it; later it has settled onto the session's own mean direction
and every typical vector scores near the session's coherence. **The climb the row predicts is what a pile of
unordered turns produces on its own.**

Measured, not argued — i.i.d. vectors, no order at all, 200 replicates of 60 contributions each, quintile gap of
the resulting curve:

| dimension | mean r | quintile gap of an UNORDERED session | slope |
|---:|---:|---:|---:|
| 3 | 0.9785 | +0.0044 | 8.6e-5 |
| 3 | 0.3990 | +0.0781 | 1.6e-3 |
| 64 | 0.6312 | +0.0750 | 1.4e-3 |
| 64 | 0.1526 | +0.0861 | 1.7e-3 |
| **768** | **0.1828** | **+0.0929** | 1.8e-3 |
| 768 | 0.0023 | +0.0011 | 1.6e-5 |

Command: the `iid` helper in `consonance/tools/order-parameter.test.js`, four tests pinning the effect and its
regime-dependence. The artifact is largest exactly where a sentence-embedding board sits — high dimension, moderate
coherence — and vanishes when the centroid is stable from the start. **For scale: the smoke run's real median
quintile gap was 0.0140, against an i.i.d. artifact of ~0.09 in the same regime.** A bare CLIMBS verdict is
therefore unreadable, and a bare NEITHER may be a real climb hidden under the artifact's own noise.

**My first attempt at this test asserted the artifact and did not find it** (gap −0.0027), because my fixture was
over-concentrated. The table above was measured before anything was asserted, which is the only reason the
regime-dependence is in it.

**The control, added post-hoc and labelled as such:** recompute each session's curve over the SAME vectors in a
shuffled order (`--shuffles N`, seeded, Fisher–Yates over a copy). Under the artifact alone, order carries nothing
and the shuffled climb equals the real one. A genuine within-session lock must **beat its own shuffle**. This
changes none of the registered bars; it says what a verdict from them is worth.

## 7 · THE RESULT — the registered bars say CLIMBS, and the climb does not survive the size check

**The registered run, verbatim from the tool:**

```
VERDICT (registered bars): CLIMBS
  a majority of sessions have a positive slope and the median quintile gap exceeds the between-session IQR
  sessions 117 · positive slopes 97 · median quintile gap 0.0507 · IQR of session means 0.0485 · mean r 0.6196
```

`node consonance/tools/order-parameter.js --deps <dir> --out exo_memory/loop/order_parameter_L060.json`, 820 s,
117 of 117 eligible sessions embedded (no budget truncation, so the reverse-chronological clause never fired).
**It clears its own bar by 0.0022.** Per-session quintile gap: min −0.0950 · Q1 0.0052 · median 0.0507 · Q3 0.1024
· max 0.2858.

**Per mount, the same bars applied unchanged** (`<scratch>/def/per-pane.js exo_memory/loop/order_parameter_L060.json`):

| mount | sessions | verdict | positive slopes | median gap | IQR | mean r |
|---|---:|---|---:|---:|---:|---:|
| board-wide | 117 | **CLIMBS** | 97/117 | 0.0507 | 0.0485 | 0.6196 |
| `0c0c0c0a-…` (80.5% of contributions) | 49 | **NEITHER** | 40/49 | 0.0195 | 0.0211 | 0.6327 |
| `6fe15f0a-…` | 19 | CLIMBS | 16/19 | 0.0759 | 0.0410 | 0.5948 |
| `0c0c0c0b-…` | 17 | CLIMBS | 14/17 | 0.0651 | 0.0232 | 0.6563 |
| `0845a868-…` (this seat) | 13 | CLIMBS | 8/13 | 0.0519 | 0.0378 | 0.5909 |
| `a2122153-…` | 11 | CLIMBS | 11/11 | 0.0762 | 0.0311 | 0.5881 |
| `12fb81f6-…` | 8 | CLIMBS | 8/8 | 0.0967 | 0.0288 | 0.6101 |

**The mount with four fifths of the data is the one that does NOT climb.** That is not a quirk of that seat; it is
a size effect, and the size effect is the confound of §6 with its fingerprints on it:

| session size | sessions | median quintile gap | positive slopes |
|---|---:|---:|---:|
| 20–30 contributions | 41 | **+0.1024** | 35/41 |
| 30–50 | 23 | +0.0640 | 21/23 |
| 50–100 | 24 | +0.0172 | 19/24 |
| 100–300 | 24 | +0.0146 | 20/24 |
| 300–2,987 | 5 | **−0.0253** | 2/5 |

**Spearman ρ(session size, quintile gap) = −0.577** over 117 sessions. The climb is largest in the shortest
sessions and reverses in the longest — which is the estimator artifact's own signature, since the centroid's noise
is spent within the first handful of contributions and a short session is mostly first-handful. A real
within-session lock has no reason to weaken with length; a mean estimate settling down has every reason to.

**A second thing the curve's left end is made of:** 19 of the orchestrator mount's 49 sessions begin with the
**identical two rows** — a fixed 552-character greeting and a 22-character "no response requested" — so `r_2` is
the constant 0.3294 in all 19. Those rows are boot, not contribution. **Not every `assistant` row is a
contribution**, and my registered unit said it was. That is a defect in my own method, found by the instrument.
