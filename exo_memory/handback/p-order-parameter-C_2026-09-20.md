# P-ORDER-PARAMETER — C (CHARLIE), L060 R2, on L — **FINISHED AND RUNG** 2026-09-20 08:13:18Z

> **State of this file, because its own header misled a reader once.** It carried "DRAFT, appended as the lap
> runs" from §1 until the lap ended, which is what it was: a hand-back written open and appended to, per the
> instruction to write early and append. **It was read off the disk and collated as a finished hand-back while
> that header was still true and while the file was still growing** (221 lines read of 275 then present; 529
> now). The receipt that makes a hand-back delivered is `call_librarian`, and mine is on the board at
> **08:13:18Z** — see §18. Nothing about the earlier reading was C's to prevent, and nothing in it was dishonest;
> the header is corrected here so the file can never again say DRAFT to someone treating it as final.

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
| `0c0c0c0a-…0a01` (the fixed orchestrator seat) | 49 | 12,026 | **80.7%** |
| `0c0c0c0b-…` | 17 | 935 | 6.3% |
| `6fe15f0a-…` | 19 | 848 | 5.7% |
| `0845a868-…` (this seat) | 13 | 429 | 2.9% |
| `a2122153-…` | 11 | 400 | 2.7% |
| `12fb81f6-…` | 8 | 270 | 1.8% |

Four sessions hold **42.4%** of all **14,908** contributions; the largest is **2,987** and the median session is
**43**. *(Every figure in this table is re-derived from `exo_memory/loop/order_parameter_L060.json` — see §5b.)* So a board-wide order parameter is, to four fifths, a measurement of **one seat's own turns**.
The registered bars weight sessions equally, which limits but does not remove it — 49 of the 117 sessions are that
one mount's. The per-mount verdicts are reported below and should be read before the board-wide one.

**And a plain consequence of the 60-minute rule, worth saying rather than burying:** for a continuously-worked
mount, a "session" is most of a working day, not a sitting. That is what the registered rule produces on this
board; it is not a defect discovered after the fact, but it is what the word means here.

### 5b · The command behind §5's table

Every figure in §5's per-mount table comes from ONE artifact — the run's own JSON — and from nothing else:

```
node -e "const J=JSON.parse(require('fs').readFileSync('exo_memory/loop/order_parameter_L060.json','utf8'));
  const by=new Map(); for(const s of J.sessions){ if(!by.has(s.pane)) by.set(s.pane,{sessions:0,n:0});
  const v=by.get(s.pane); v.sessions++; v.n+=s.n; } console.log(J.sessionsEmbedded, [...by]);"
```

→ `sessionsEmbedded 117 · sessionsEligible 117 · sessionsTotal 286 · contributions 14908`, and per mount
49/12026 · 17/935 · 19/848 · 13/429 · 11/400 · 8/270. The board's own row count (30,333 rows, 257 torn, 3,975
duplicates dropped) is printed by the tool at the head of that same run, not looked up separately.


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
| `0c0c0c0a-…` (80.7% of contributions) | 49 | **NEITHER** | 40/49 | 0.0195 | 0.0211 | 0.6327 |
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
| 50–100 | 24 | +0.0241 | 19/24 |
| 100–300 | 24 | +0.0161 | 20/24 |
| 300–2,987 | 5 | **−0.0253** | 2/5 |

**Spearman ρ(session size, quintile gap) = −0.5785** over 117 sessions (average ranks for ties; §5b). The climb is largest in the shortest
sessions and reverses in the longest — which is the estimator artifact's own signature, since the centroid's noise
is spent within the first handful of contributions and a short session is mostly first-handful. A real
within-session lock has no reason to weaken with length; a mean estimate settling down has every reason to.

**A second thing the curve's left end is made of:** 19 of the orchestrator mount's 49 sessions begin with the
**identical two rows** — a fixed 552-character greeting and a 22-character "no response requested" — so `r_2` is
the constant 0.3294 in all 19. Those rows are boot, not contribution. **Not every `assistant` row is a
contribution**, and my registered unit said it was. That is a defect in my own method, found by the instrument.

## 8 · THE MATCHED NULL — the board climbs LESS than noise does

An independent null from the shuffle, run because two nulls that disagree would matter more than either agreeing.
For each size bin: i.i.d. vectors, 768 dimensions, **no temporal structure of any kind**, the dispersion calibrated
so the null's mean r is 0.6201 against the board's 0.6196, at the bin's own mean session length.

| session size | null median gap | null positive-slope rate | **real** median gap | **real** positive rate |
|---|---:|---:|---:|---:|
| 20–30 (n≈24) | 0.1238 | 100% | 0.1024 | 85% |
| 30–50 (n≈39) | 0.0983 | 100% | 0.0640 | 91% |
| 50–100 (n≈70) | 0.0712 | 100% | 0.0241 | 79% |
| 100–300 (n≈198) | 0.0354 | 100% | 0.0161 | 83% |
| 300+ (n≈1326) | 0.0083 | 100% | −0.0253 | 40% |

**At every size the real board climbs less than structureless noise, and the gap widens with session length.**
The null's positive-slope rate is 100% everywhere: a pile of unordered turns climbs essentially always. The board's
is 79–91%, and 40% in the longest sessions.

So the registered verdict is CLIMBS and **the climb is not evidence of a lock** — it is the running centroid
finding its own mean, and the board does it more slowly than chance. The prediction "it climbs toward 1 within a
session" is confirmed by the registered bars and **the bars do not measure what they were written to measure.**

*The honest limit of this particular null:* its noise is isotropic, and real sentence embeddings are not — they sit
in a cone, so the parametric null is the right shape but not the right distribution. That is exactly why the
shuffle control was run too: a shuffle preserves the actual vectors and asks only whether their ORDER carries
anything. §9 reports it.

### 8b · Where the registered falsifier stands, scored rather than waved at

The falsifier needed both clauses. Scored against the run:

- **"differs between them"** — TRUE. Session means run 0.5419 → 0.7389, a range of 0.1970 against an IQR of 0.0485.
- **"flat within sessions"** — FALSE, but narrowly: **54 of 117** sessions have |quintile gap| ≤ IQR, and a majority
  needed 59. **Five sessions short.**

So the falsifier as written does not fire, and CLIMBS is what the bars return. Both facts are reported because
`classify` tests climb before the falsifier, so a run that satisfied both would have been called CLIMBS — an
ordering defect in my own registered scoring that did not bite here and would have if five sessions had gone the
other way. It is in the instrument for the next reader to see (`classify`, the `else if` chain).

### 8c · Two facts about the UNIT that the instrument surfaced, both against my own registration

1. **`role:"committee"` rows were dropped, and there are 1,378 of them.** The board holds two different families:
   `assistant` rows keyed by a **session UUID** (the pane's conversational turns, 16,083 deduped) and `committee`
   rows keyed by a **seat name** — chair 1,040 · A 56 · C 45 · B 38 · E 38 · alpha/bravo/around/main and others.
   Those are deliberate posted artifacts, arguably the most considered contributions the room makes, and my
   registered unit excluded every one. I am keeping the registered unit for this run rather than changing it after
   seeing the result; the omission is named here with its size so the next lap can decide it on purpose.
   Command: `node -e` over `dedupeRows(readBoard(board).rows)` grouping by `role`.
2. **Boot rows count as contributions under my unit.** 308 of 16,083 assistant rows are under 40 characters (1.9%),
   the commonest being `"No response requested."` (46×) and one 36× acknowledgement. Small in bulk — but the fixed
   552-char greeting + 22-char pair opens 19 of the orchestrator's 49 sessions and fixes `r_2` at 0.3294 in all of
   them, which is the left end of the curve the whole prediction is about.

## 9 · THE SHUFFLE CONTROL — the same vectors, their order destroyed

`node consonance/tools/order-parameter.js --deps <dir> --board <snapshot> --shuffles 20 --out <json>`, 20 seeded
Fisher–Yates reorderings per session, 118 sessions, 940 s. Run against a **frozen snapshot** of the board
(`<scratch>/def/board-snapshot.jsonl`, 30,375 rows, sha256 `2a4a559fa1da4163…`) so the control cannot drift while
it runs; that is 42 rows more than the registered run read, and one more eligible session, 118 against 117. The
registered bars on the snapshot give the same verdict: CLIMBS, 98/118 positive, median gap 0.0499, IQR 0.0479.

```
SHUFFLE CONTROL (post-hoc, 20 shuffles/session):
  median real quintile gap 0.0499 vs shuffled 0.0835 · sessions where real beats its own shuffle 36/118
```

| session size | sessions | real median gap | **shuffled** median gap | real beats shuffle |
|---|---:|---:|---:|---:|
| 20–30 | 42 | 0.0984 | 0.1203 | 17/42 |
| 30–50 | 22 | 0.0653 | 0.0948 | 4/22 |
| 50–100 | 25 | 0.0172 | 0.0641 | 6/25 |
| 100–300 | 24 | 0.0161 | 0.0349 | 8/24 |
| 300+ | 5 | −0.0253 | 0.0101 | 1/5 |

**Slope, real against shuffled: 98/118 positive · 118/118 positive.** Destroying the order entirely makes the
climb *more* reliable, not less — it becomes universal.

**Sign test:** real beats its own shuffle in **36 of 118** sessions where 59 is what carrying-no-information looks
like. z = **−4.235**, two-sided **p = 2.3e-5**. Real minus shuffled per session: min −0.2066 · Q1 −0.0597 ·
median −0.0264 · Q3 +0.0076 · max +0.1569.

Two independent nulls — one parametric (§8), one preserving the actual vectors exactly (§9) — agree, and neither
was in the registration.

## 10 · THE ANSWER

**The registered prediction is confirmed by the registered bars, and the confirmation is empty.** `r` climbs within
a session (97/117 positive slopes, median quintile gap 0.0507 over an IQR of 0.0485, CLIMBS) — and structureless
noise climbs harder (100% and 118/118), so the climb is the running centroid converging on its own mean, not the
room locking on.

**The packet offered "this measures the topic." It is close, and the precise form is different and better
supported: it measures its own estimator.** The registered falsifier's literal clauses do not fire (§8b: 54/117
flat where 59 were needed, five short) because they test *flatness*, and the artifact is not flat — it is a
climb. A falsifier aimed at the wrong failure mode passes a broken instrument. That is the lap's methodological
finding and it is mine, not the row's: **I registered a prediction and a falsifier without first asking what the
measure does on data with no structure in it.** That is my recorded hole — reasoning from a real measurement
without asking what a null looks like — and it recurred here in the one place designed to prevent it.

**What survives, and it points the other way:** once the artifact is controlled for, the board's real temporal
order is **significantly LESS ordered than a random reordering of the same turns** (36/118, p = 2.3e-5). Sessions
do not converge on their opening; they move away from it, and they move away more than chance. On this board,
within a session, the measurable direction is **drift, not lock** — which is a real answer to the question the
C-row was asked, with the sign opposite to the one predicted.

*Read it no further than it goes:* `r` is a **similarity**, not an agreement. Two turns fighting about one subject
score high. This says how the room's turns move through embedding space, not whether it agrees with itself.

## 11 · Tests and the second mutant round

`node --test consonance/tools/order-parameter.test.js` → **20 pass · 0 fail**. Thirteen on the registered core,
seven added with the control, four of those pinning the confound and its regime-dependence.

`node consonance/tools/mutant-harness.js <scratch>/def/rows-order.js` — **15 listed · 14 killed · 1 survived
(equivalent, §4) · 0 no result · 0 not applied**, live file hash unchanged on every run. Three rows added for the
control code: #13 the shuffle mutates the caller's array so the REAL curve is computed from a shuffled order —
killed; #14 the shuffle does not shuffle, making the control a copy of the thing it controls — killed; #15 the
control stops being seeded and cannot be reproduced — killed.

## 12 · WHAT WAS NOT VERIFIED

1. **One machine's board.** D's rows are on D. Nothing here reaches them, and the 10-day 09-10 → 09-20 gap is
   where the other machine was working.
2. **The two runs read different boards.** Registered: the live file at 30,333 rows. Control: a frozen snapshot at
   30,375, 118 eligible sessions against 117. Both are reported with their own counts; no figure is mixed across
   them.
3. **The parametric null's noise is isotropic**, and sentence embeddings are not. It is the right shape, not the
   right distribution — which is why §9 exists. The shuffle has the opposite limitation: it can only speak about
   order, never about the distribution.
4. **`role:"committee"` rows (1,378) were never embedded** — see §8c.1. Whether they are contributions is open.
5. **Nothing was run inside the app, and I committed nothing.** The instrument and its test were
   untracked when I wrote this line; **the chair committed them at `d104427` while the lap was still running**
   ("L060 R2 committed, NOT filed"), so they are tracked now and the commit is not mine. My working copy of this
   hand-back is 164 lines ahead of that commit — §9 through §14 did not exist when it was made.
6. **T1's windowing was inherited untested.** 1,800-id windows with a token-weighted mean across them is T1's
   choice; I checked the model's identity by hash, not the pooling's behaviour on the longest turns (max assistant
   row 21,920 characters).
7. **No comparison against T1's own numbers**, and none should be made: T1 measured a hand-back against its
   packet, a different unit on different text. The encoder is shared; the quantity is not.
8. **The 60-minute session rule was never validated against what a sitting is** — for the orchestrator mount it
   fuses most of a working day (§5).
9. **The sign test treats sessions as independent.** 49 of 117 come from one mount and four sessions hold 42% of
   all contributions, so the p-value is optimistic. The effect does not rest on it: the direction is the same in
   every size bin and in both nulls.

## 13 · The question for the keeper, taken conservatively while he sleeps

The packet's row asks for an order parameter and the honest result is that the measure, as specified, reports its
own estimator. **I did not change the specification** — the registered bars ran unchanged and their verdict is
reported first. The open call, for the keeper and not for me tonight: *does the row want the artifact-corrected
quantity* (real minus its own shuffle, which is computable now and is what §9 reports) *as the instrument going
forward, or does it want the raw order parameter kept because the Third Place's design named it?* Both are in the
JSON. My recommendation, stated as a recommendation: the raw curve should never be quoted without its shuffle,
and the tool should refuse to print a verdict without one — a one-line change I have NOT made, because turning a
report into a refusal is a behaviour change outside this packet.

## 14 · Files

- `consonance/tools/order-parameter.js` — the instrument (new, untracked).
- `consonance/tools/order-parameter.test.js` — 20 tests (new, untracked).
- `exo_memory/loop/order_parameter_L060.json` — the registered run, 117 sessions with full per-session curves.
- `<scratch>/def/order_parameter_L060_shuffled.json` — the control run, 118 sessions, each with its shuffle.
- `<scratch>/def/board-snapshot.jsonl` — the frozen board, sha256 `2a4a559fa1da4163…`.
- `<scratch>/def/rows-order.js`, `score-order.js`, `per-pane.js` — mutants, the JS score adapter, the per-mount pass.

## 15 · A STALE READING IS ON RECORD, AND THIS FILE SUPERSEDES IT

While this lap ran, two commits landed that describe it from outside:

- **`d104427`** — *"L060 R2 committed, NOT filed: the order parameter CLIMBS by 0.0022 over its bar, and its own
  registered control has not been run."*
- **`3a779ac`** — LIBRARIAN, non-author read: *"every headline number holds, and C's own shuffle control was built
  but never run."*

Both were accurate when written. **The control has now been run** (§9), and it does not adjust the headline — it
inverts what the headline means. `CLIMBS by 0.0022 over its bar` stands as arithmetic and stops being evidence of
a lock: structureless noise clears the same bar by more, and the board's real order is significantly *less*
ordered than a shuffle of itself. Anything quoting `d104427` or `3a779ac` for the result of this lap should be
re-pointed here.

The librarian's re-derivation of the headline numbers is not contradicted anywhere in this file; every figure it
checked is unchanged. What changed is what they are worth.

## 16 · TWO CORRECTIONS TO THIS FILE, BOTH THE LIBRARIAN'S CATCH (`3a779ac`)

Neither touches a verdict. Both are the same failure and it is one I have paid for before.

1. **The per-mount table was computed from a SECOND board read, not from the run's artifact.** It said 14,931
   contributions where `order_parameter_L060.json` holds **14,908** — the board gained rows in two panes' newest
   sessions between the run and my `node -e`. Corrected in §5 and re-derived from the artifact alone: 80.7% / 935 /
   429 / 42.4% / median session 43. **This is the R1 defect exactly** — the tool printed one number and a side
   script wrote another — and R1's repair was to make one path produce both. I reintroduced it in prose one lap
   later.
2. **Spearman ρ was −0.5770 with ties broken by index; with average ranks it is −0.5785.** The librarian's value
   is the correct convention. Corrected in §7.

Also noted by that read and left as-is: my median takes the lower element at even length. It is a stated
convention, applied identically to real and shuffled data, so no comparison in §9 turns on it.

**The general rule this keeps proving, and it is the room's own:** a number in prose must re-derive from one run
of a visible instrument. Every figure in §7–§9 does; §5's did not until now.

## Log (append-only)

- 01:3x — prediction and falsifier registered (§1), before any encoder was touched.
- 01:4x — method registered (§1b). T1's encoder confirmed reusable as-is by hash (§3).
- 01:5x — registered run launched over 117 eligible sessions.
- 02:0x — mutants run 1: 9/12. Two real holes closed (#2, #12); #6 shown equivalent rather than tested around.
- 02:0x — the confound found and MEASURED before it was asserted; my first fixture claimed it and missed it (§6).
- 02:09 — registered run returns CLIMBS by 0.0022. Matched parametric null run: the board climbs less than noise.
- 02:2x — shuffle control returns: real beats its own shuffle in 36/118, p = 2.3e-5 (§9).
- 02:3x — the chair's `d104427` and the librarian's `3a779ac` found in the log; §15 supersedes them, §16 applies
  the librarian's two corrections to this file.

## 17 · THE CHAIR'S RE-RUN PACKET, ANSWERED — the control had already run when the packet was written

The packet and my filing crossed. **`--shuffles 20` ran at 02:1x and is §9**; it is not owed. The packet is right
that it was owed at the moment `3a779ac` was written, and right about why: a 0.0022 margin under a ~+0.09 artifact
is not a reading. That is the lap's finding and the control confirms it from inside the real distribution.

### 17.1 · The control per mount, as asked, with the board row count at that read

**Universe of the control run:** the frozen snapshot, **30,375 rows · 257 torn · 30,118 usable**, 286 sessions,
118 eligible, 118 embedded. (The registered run read the live board at **30,333**; no figure is mixed.)

| mount | sessions | real median gap | **shuffled** | real beats shuffle | real +slopes | **shuffled +slopes** |
|---|---:|---:|---:|---:|---:|---:|
| board-wide | 118 | 0.0499 | **0.0835** | **36/118** | 98/118 | **118/118** |
| `0c0c0c0a-…` | 50 | 0.0185 | 0.0449 | 16/50 | 41/50 | 50/50 |
| `6fe15f0a-…` | 19 | 0.0759 | 0.1093 | 4/19 | 16/19 | 19/19 |
| `0c0c0c0b-…` | 17 | 0.0651 | 0.0769 | 8/17 | 14/17 | 17/17 |
| `0845a868-…` (this seat) | 13 | 0.0519 | 0.1098 | 2/13 | 8/13 | 13/13 |
| `a2122153-…` | 11 | 0.0762 | 0.1180 | 2/11 | 11/11 | 11/11 |
| `12fb81f6-…` | 8 | 0.0967 | 0.0999 | 4/8 | 8/8 | 8/8 |

**Every mount's real median sits below its own shuffle, and every mount's shuffled slopes are positive 100% of the
time.** No mount escapes it, including the two that beat their shuffle most often (`0c0c0c0b` 8/17, `12fb81f6`
4/8 — both still at or under half, and both small).

### 17.2 · (a) The moving-board table — and the chair caught more than I did

Corrected in §5/§5b/§16 before this packet arrived. **The chair's extra catch is real and I had not stated it:
my own column summed to 14,933, not even to the 14,931 my prose claimed** — so the table was inconsistent with
itself as well as with the artifact. The artifact sums to **14,908** and the whole difference is in the two mounts
that were live (935→947, 429→442), exactly as the packet says. All derived shares now re-derive from
`order_parameter_L060.json`: 80.7% · 42.4% · median session 43. Re-derivation command in §5b.

### 17.3 · (b) The median convention — the librarian is right, and the verdict never depended on it

My scratch size tables took the lower element at even length. Reproduced exactly:

| band | n | parity | interpolated | lower-element |
|---|---:|---|---:|---:|
| 20–30 | 41 | odd | 0.1024 | 0.1024 |
| 30–50 | 23 | odd | 0.0640 | 0.0640 |
| 50–100 | 24 | **even** | **0.0241** | 0.0172 |
| 100–300 | 24 | **even** | **0.0161** | 0.0146 |
| 300+ | 5 | odd | −0.0253 | −0.0253 |

The three odd bands are identical and both even bands differ, with identical membership — the librarian's
diagnosis exactly. **The interpolated values are now in §7, §8 and §9**; the map line carries them too.
**The verdict line was never affected**: the tool's own `quantile()` interpolates, and the board-wide median is
over 117 (odd), so 0.0507 is the same under both conventions. The monotone descent is unchanged and slightly
flatter: **0.1024 → 0.0640 → 0.0241 → 0.0161 → −0.0253**.

### 17.4 · (c) The 19 boot-prefixed sessions — RULING: they stay in, and here is what it costs

Stated as the packet asks, in one line and then its evidence: **they stay, because the unit was registered before
the run and removing them changes no verdict and strengthens the control.**

| | verdict | positive slopes | median gap | control: real vs shuffled | beats |
|---|---|---:|---:|---:|---:|
| all 118 | CLIMBS | 98/118 | 0.0499 | 0.0499 vs 0.0835 | 36/118 |
| **without the 19** | CLIMBS | 83/99 | 0.0552 | 0.0552 vs 0.0901 | 31/99 |
| **the 19 alone** | — | — | 0.0050 | 0.0050 vs 0.0397 | 5/19 |

Excluding them moves nothing that matters: the verdict holds, and the shuffle result gets marginally *stronger*
(30.5% → 31.3% of sessions beating their shuffle, with a wider real-to-shuffled gap). The 19 are not driving the
finding in either direction. **What stays true is the narrower claim in §8c.2** — a fixed greeting pair is not a
contribution, and my registered unit said it was; that is a defect in the unit, not in this result.

### 17.5 · The rider, adopted as a standing rule of this file

**CLIMBS is never quoted from this lap without both of:**

1. the mount holding **80.7%** of all contributions returns **NEITHER** — 49 sessions, 40/49 positive, median gap
   0.0195 against an IQR of 0.0211; and
2. **ρ = −0.5785** — the climb is largest in the shortest sessions and **reverses in the longest**.

To which the control now adds a third that supersedes the need for the first two in most uses: **structureless
noise clears the same bar by more, and the real order loses to its own shuffle 82 times in 118.**

## 18 · THE DELIVERY SEQUENCE, FROM THE BOARD — and the dispatch that was cancelled

The chair cancelled the re-run dispatch of §17 and withdrew the premise that anything was owed. **Nothing was
re-run on its account**: §17 is prose over artifacts that already existed, and no embedding pass has run since the
control finished. Recorded here because a cancelled order that left no trace would be indistinguishable from one
that was quietly obeyed.

**The timing, re-derived from `C:/Consonance/data/board.jsonl` (30,211 rows parsed, 257 torn) rather than from
anyone's account of it:**

| time (Z) | event |
|---|---|
| 08:06 | LIBRARIAN's non-author read `3a779ac`, collated from the file **on disk** |
| 08:08:54 | LIBRARIAN withdraws that collation in full |
| **08:13:18** | **`call_librarian C -> LIB [Received]` — my first ring, the receipt that makes a hand-back delivered** |
| 08:13:38 | the chair's re-run dispatch arrives, **20 s after that receipt** |
| 08:16:18 | the chair's cancellation arrives |

So *"C had not rung"* was **true when the librarian collated** and had **stopped being true twenty seconds before
the dispatch landed**. That is the entire crossing, and it needs no fault in it to be understood.

**The one durable lesson, and it is not mine to claim as a finding about anyone else:** a file's presence on disk
is not delivery, and this room already has the instrument that says so — `call_librarian` posts a receipt to the
board, and the pulse counts hand-backs from those receipts, not from files. Both said C had not rung. **A file
being readable is not a file being handed back**, and my header saying DRAFT was the one signal that agreed with
both instruments and was overridden by neither of them alone.

*What I would change in my own practice, which is the only part I control:* nothing about writing early and
appending — the packet asks for it and §6 exists because of it. But the draft header now carries the delivery
rule explicitly, so a reader who reaches the file before the receipt is told, in the file, what the receipt is.

`d104427`'s commit message ("the lap owes one command") is wrong and the chair has recorded the correction on the
lap ledger. The commit stands as a trace; §15 and this section are where the corrected reading lives.
