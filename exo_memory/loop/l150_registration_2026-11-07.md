# L150 registration: "the banking can't catch up" as a number. Pane E, on L, 2026-11-07 ~02:3x local, before B's numbers

**His words** (`briefs/t180_second_bank.md`, 08:17Z): "when you add both an extra turn with the extra banking, for the extra turn the banking
cant catch up in time, as if it needs to start eating into the original banking to smoothen the transition".
- **His picture**, opened (`briefs/t180_extra_turn_bank_catchup_2026-11-07.png`):
  - an unplaced 1,000 m ghost, turn +90 as a corner (ends straight), bank −34.78°, cup 15.5;
  - an S whose second bend is the long one;
  - extra turn and extra bank handles both on the piece.
- **The plan (master):** `loop/plan_l150_extra_bank_catches_up_2026-11-07.md` (379e0b43).
- **Tree:** t180 main `fc3cc63`. **Nothing was run for this registration.** It was read against the code:
  - `src/validate/index.js:8-16`, the load model;
  - `:370`, the per-line `fN_g`, `fLat_g`;
  - `:170-183`, `opts.designSpeed`;
  - `src/validate/limits.js:78`, `designSpeedKmh` 460;
  - `src/geom/path.js:129`, `bankG`.

## The checker's own "bank asked"

- **The checker has no field called "bank asked".** What it computes is the specific force a car feels on each lateral line:
  `f = v²κ⃗/(1 − κ⃗·o) + a_T·T + g·ŷ` (`validate/index.js:11`).
  - It projects that force into the surface normal (`fN_g`) and across the surface (`fLat_g`) (`:370`).
  - A bank is right for the curve when the car feels no force across the surface.
- **So "bank asked" here is the bank at which the centreline's `fLat_g` is 0.**
  - At a station: **φ_asked(s) = φ_built(s) + atan2(fLat_g, fN_g)** on the centreline line (u = 0), with the sign taken so that
    φ_asked = φ_built where `fLat_g` = 0.
  - On a level road this is the familiar tan φ = v²κ/g.
- **The speed** is the checker's own design speed: `validate(path, segments, { designSpeed: 460 km/h = 127.78 m/s })`, which is the
  app's default (`limits.js:78`).
  - At that speed his corner asks far more than 34.78°: about atan(v²κ/g) ≈ 75–80° for κ ≈ 3e-3 /m. inferred: not computed.
  - So the size of the gap is his choice of bank, not a lag.
  - **"Can't catch up" is therefore a TIMING claim.** Each measure below is taken on normalised shapes, so it does not depend on the
    speed. `fLat_g` is kept only for the felt size.

## What "can't catch up" means, as numbers (B reports each, every 10 m and at the points named)

All are on his piece as B rebuilds it (B states which inputs were read off the picture), on the extra turn's span [F_turn, L].
- **κ_x(s):** the extra turn's own curvature, the piece's curvature less the same piece's with no extra turn (the additive split, as
  C's L142 item 2).
- **φ_doc(s), φ_built(s):** the document's bank (`channelAt phi`) and the built road's roll (the adapter's path).

| number | definition | what it isolates |
|---|---|---|
| **λ_doc** | s where φ_doc has made 50% of the extra bank's own change, minus s where κ_x first reaches 50% of its peak (its rising side) | the lag DESIGNED into the document (marks and ramp shapes) |
| **λ_built** | s where φ_built has made 50% of that change, minus s where φ_doc has | the lag the builder's bank re-rounding adds (`bankPlan`, L136's mechanism) |
| **λ_onset** | s where φ_built leaves the first bank by 5% of the extra change, minus s where κ_x reaches 5% of its peak | his "eating into the original banking": a negative λ_onset means the bank already leads |
| **ΔfLat** | the peak \|`fLat_g`\| on the centreline over the second bend's rising curvature, minus the same over the first bend's | the felt size of the mismatch, against his own first bend |

**My prediction, from the design alone** (inferred; registered so that it can fail):
- if both marks sit at 500 m (`EXTRA_FROM_SHARE` 0.5) and the extra bank eases to the piece end, then **λ_doc ≈ 125 m (100–150)**;
- reason: C's L142 item 2 measured the extra turn's curvature at 50% of its peak by 625 m. A quintic bank ramp over [500, 1000]
  reaches 50% of its change at 750 m.
- I also predict the asked bank comes back toward 0 by the piece end (the turn ends straight), while the built bank ends at the extra
  bank's target. inferred.

## The thresholds, and the three outcomes (decided before the numbers)

Total lag Λ = λ_doc + λ_built. The control is the same four numbers on his GOOD save's p2 (`eq-banking turn into unbanki`, a −90 corner
banking in and out).

| outcome | when | what it means |
|---|---|---|
| **O1 · THE BANK LAGS BY DESIGN** | Λ ≥ 75 m, Λ ≥ the control's Λ + 50 m, λ_doc ≥ λ_built, and ΔfLat ≥ +0.5 g | the extra bank's start or ramp shape (a monotone ramp to its target against a turn whose curvature rises and falls) puts the bank behind the turn. C's ways to "eat into the original banking" are the fixes to weigh. |
| **O2 · THE BANK LAGS BY THE BUILDER** | λ_built ≥ 50 m and λ_built > λ_doc (with Λ and ΔfLat as in O1) | the document is on time and the built road is late. That is L136's parked late bank, now on an extra. |
| **O3 · NOT THE BANK LAGGING** | Λ < 75 m (or within 50 m of the control's), or ΔfLat < +0.5 g | the bank follows the turn about as well as in his good piece. What he sees is the turn's own shape: its curvature starts late in its span (L142 item 2: 10% at 629 m, 50% at 751 m from a 500 m mark), and the bend reads as late, not the bank. |

**Why these figures:**
- **75 m** is about 0.6 s at 460 km/h, and about half the predicted design lag. inferred: a lag he could see in a still picture is
  well over the facet scale.
- **50 m over the control:** his good piece is the reference for what he accepts.
- **0.5 g** is half the checker's `holdG` (1 g, `limits.js:25`), a sideways load he would feel and not mistake for the turn itself.
  These are judgement, stated in advance.

## The falsifiers

- **O1 is false** if the document's 50% bank point is within 75 m of the curvature's (λ_doc < 75 m), or if his good save shows the
  same Λ within 50 m.
- **O2 is false** if the built and document 50% points are within 50 m (λ_built < 50 m).
- **O3 is false** if Λ ≥ 75 m beyond the control AND ΔfLat ≥ 0.5 g. In that case the bank does trail by more than his own good piece
  does, and it is felt.
- **My prediction is false** if, with both marks at 500 m and the extra bank easing to the end, λ_doc falls outside 100–150 m. Then my
  reading of the shapes is wrong, and any ruling built on it must be redone from B's rows alone.
- **This registration is void** if B cannot recover or state the ghost's inputs (the extra turn's angle, the extra bank's target, both
  marks). Then the rows measure a piece he did not draw.

## For B (what the rows must carry)

- Every 10 m over the piece:
  - κ, κ_x;
  - φ_doc, φ_built;
  - φ_asked (the checker's `fLat_g`/`fN_g` at the centreline, design speed 460 km/h);
  - `fLat_g`.
- The six points: the 5% and 50% points of κ_x, φ_doc and φ_built.
- The same for the good save's p2.
- The inputs used, marked "read off the picture" or "from the draft".
