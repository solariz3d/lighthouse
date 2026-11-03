# D637: turn and climb at the joints (pane E). Step 1, THE MEASURE

Seat: pane E (machine D), sibling-07b8a48f. Order: the chair, 13:49 (the librarian's 13:49 ring). Tier: PROVE IT. Branch t180 `d637-e` off `d624-e` 0692d11 (worktree `Desktop\worktrees\t180-e637`); nothing changed on it yet.

The track: his `eq-ELYSIUM NEW.t180track` (saved 11-02 16:32), which `t180b_elysium_new_scifi_0439` was exported from.
  checked: `sha256sum` of his save and my scratch copy → both `2ab08386d2afb287…`

## 1. What was measured, and how

`evidence/feel.js`, on the build at 0692d11 (adapter.js toPath, a sample every 0.5 m), at 170 m/s.

- **What a car on the centre line feels:**
  - the load along the road's up (U) and side (L), in g, gravity included;
  - its jerk in g/s (v · d/ds, over ±1 m);
  - at each of the 45 joints between road pieces, the largest jerk within 15 m of the joint, against the largest in either piece's middle (all but 30 m at each end).
- **The split, exact, not modelled:**
  - the path's curvature vector is split on a level frame built from the road's own direction (L0 = up × T, U0 = T × L0) into a TURN part (c_h) and a CLIMB part (c_v);
  - the bank angle φ is read off the road's own U, so kvec·U = c_v cosφ + c_h sinφ and kvec·L = c_h cosφ − c_v sinφ;
  - the jerk is then four terms: the turn's (c_h′), the climb's (c_v′), the BANK's (φ′, swinging the same curvature between U and L) and gravity's.
  - checked: the reconstruction's residual → **1.0e-17 1/m**. 1,131 samples within 8° of vertical (the loop's top) are left out and counted.

## 2. The result (`evidence/feel-0692d11.txt`, the full 45-row table)

- **The vertical (U) jerk is over mid-piece at 25 of 45 joints, and over 2× at 21. The side (L) jerk is over mid-piece at 21, and over 2× at 19.**
- **What carries it: the TURN and the CLIMB, not the bank.** At the 25 joints, the largest term of the U jerk is the climb at 13 and the turn at 12, **the bank at 0** and gravity at 0. The librarian's candidate (the bank swinging kvec between U and L) is measured and **refuted** as the cause: its term is under 15 g/s at every joint, against turn and climb terms up to 533.
- **The worst, joint against mid-piece, U jerk in g/s:**

| joint (m) | pieces | bank | U load (g) | U jerk joint / mid | the U jerk's terms: turn / climb / bank / gravity |
|---|---|---|---|---|---|
| 6103 | p10\|p11 | 39° | 24.7 | 504 / 234 (2.2×) | −519 / 0 / 14 / −0.3 |
| 6303 | p12\|p13 | 40° | 28.2 | 533 / 168 (3.2×) | −533 / 0 / 0 / 0 |
| 6603 | p14\|p15 | −40° | 15.9 | 363 / 95 (3.8×) | −367 / 0 / 4 / −0.1 |
| 9353 | p20\|p21 | 0° | 7.3 | 292 / 7 (40×) | 0 / 292 / 0 / 0 |
| 10603 | p22\|p23 | 0° | 10.1 | 311 / 9 (35×) | 0.4 / −311 / 0.2 / 0.1 |
| 10853 | p23\|p24 | 57° | 17.3 | 338 / 9 (38×) | 274 / 64 / 0 / 0 |
| 17603 | p29\|p30 | 65° | 8.7 | 392 / 30 (13×) | −202 / −190 / 1 / 0 |
| 17853 | p30\|p31 | 154° | 11.4 | 377 / 30 (13×) | −20 / −357 / 0 / 0.6 |
| 19103 | p33\|p34 | −22° | 6.2 | 290 / 3 (104×) | −124 / −166 / 0 / 0 |
| 23603 | p39\|p40 | 54° | 8.5 | 301 / 1 (272×) | −309 / 8 / 0 / 0 |

  The three the librarian named (p10–p15, s 6.1–6.6 km) are turn jerk on 39–40° banks: sin 40° = 0.64 of a turn's change lands in the vertical. His "the climb making bump" is the climb rows: p20\|p21, p22\|p23, p29–p31, p33\|p34. (Where a mid-piece reads small, the ratio is large; the absolute g/s is the column to read.)

## 3. Why: where each piece changes its turn and climb (`evidence/ramps-0692d11.txt`)

At every one of the 23 joints over 2×, **the peak sits 5 m past the joint, or 11–16 m before it.** On this track each piece holds its turn and climb (nearly) constant through its middle and **does ALL its changing in its last ~14 m and its first ~15 m**:
- p22: turn and climb change at 236–250 of 250 m;
- p23: turn and climb change at 1–15 m.
- The same shape for p23 to p31, p33 to p40, p27 to p29.
  checked: `ramps.js` → "turn changes in p22 (before its end) 236-250, in p23 (from its start) 1-15; climb 236-250 / 1-15"

So the turn and the climb do not merely come to rest at the joint (§5 of D626, a pause in jerk). **Every change in curvature on this track is squeezed into the 30 m around a joint**, and the jerk of each change is concentrated there: hundreds of g/s, where mid-piece reads single figures. That is the same shape the bank had before D626 (its whole change in a 10–20 m rounding), now in turn and climb.

inferred: these are the knot spans at the ends of a fitted piece (knots every 20 m; a piece whose curvature eases to a zero rate at both ends puts its whole change in the first and last span). The fix belongs where the bank's went: rounding the corner over the length the change needs.

## 4. What comes next, and what it will cost (steps 2 and 3, not started)

- **Step 2:** the same rounding for turn and climb, with the bank's guarantees: every piece ends at its typed value, no overshoot, turning points kept, never across a joint.
- **Step 3, the trade, reported before anything lands:**
  - Spreading a curvature change moves the road downstream unless the rounding keeps what the curvature integrates to.
  - The plan: a rounding window that keeps **the integral of the turn over the window** (so each piece's end heading is exactly as laid) **and its first moment** (so the lateral offset at the window's end is kept to second order). That is two more conditions on the quintic, so degree 7.
  - The climb is the same, with pitch and height.
  - I will measure the position, heading and lap-closure change it leaves on ELYSIUM NEW and the fixtures before proposing it, and CAR_MARGIN and the joint-feel tests stay green.

## 5. Corrections

- My first run of the lock check read P's landing lock ("…not a timing session…") as a timing session, because I matched the bare word "timing". Re-checked by the room's rule (a lock that says "not a timing session" is not one), then run. Nothing was spoiled; I only waited.

NEXT: librarian files step 1 when this lands; E starts step 2 (turn and climb rounding that keeps each piece's end heading) at once, and rings again with the route trade measured before anything lands.
