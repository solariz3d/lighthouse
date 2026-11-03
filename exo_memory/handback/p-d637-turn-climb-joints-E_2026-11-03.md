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

Of the 23 joints over 2×:
- **14 peak exactly 5 m past the joint**;
- 6 peak 11–16 m before it;
- 2 peak 13–14 m after it;
- 1 at the joint.

Two shapes of piece make them:
- **From p19 to p40 (s 9.1–23.6 km): every change at the ends.** The piece after the joint changes its turn or climb only in its first 15 m (16 of the 23), and on 13 of them the piece before changes only in its last 14 m (e.g. p22: turn and climb at 236–250 of 250 m; p23: at 1–15 m; the same for p23 to p31 and p33 to p40). Through the middle they are (nearly) constant. Here **all of a piece's change in curvature is squeezed into the 30 m around a joint**, so its jerk is concentrated there: hundreds of g/s, where mid-piece reads single figures.
- **s 5.7–6.6 km (p8 to p15): short pieces of 100–150 m** whose turn changes along most of their length (p10 and p12 over 1–100 m) and eases to a zero rate at the joint. The jerk peaks 11–16 m before the joint, where that ease is sharpest. These are the three the librarian named.
  checked: `ramps.js` → "p22|p23 … 236-250 / 1-15 … 236-250 / 1-15"; the peak column → 14 rows at 5.0

So the turn and the climb do not merely come to rest at the joint (§5 of D626, a pause in jerk): the ends of each piece are where its curvature changes, quickly. That is the same shape the bank had before D626 (its whole change in a 10–20 m rounding), now in turn and climb.

inferred: these are the knot spans at the ends of a fitted piece (knots every 20 m; a piece whose curvature eases to a zero rate at both ends puts its whole change in the first and last span). The fix belongs where the bank's went: rounding the corner over the length the change needs.

## 4. What comes next, and what it will cost (steps 2 and 3, not started)

- **Step 2:** the same rounding for turn and climb, with the bank's guarantees: every piece ends at its typed value, no overshoot, turning points kept, never across a joint.
- **Step 3, the trade, reported before anything lands:**
  - Spreading a curvature change moves the road downstream unless the rounding keeps what the curvature integrates to.
  - The plan: a rounding window that keeps **the integral of the turn over the window** (so each piece's end heading is exactly as laid) **and its first moment** (so the lateral offset at the window's end is kept to second order). That is two more conditions on the quintic, so degree 7.
  - The climb is the same, with pitch and height.
  - I will measure the position, heading and lap-closure change it leaves on ELYSIUM NEW and the fixtures before proposing it, and CAR_MARGIN and the joint-feel tests stay green.

## 4b. Steps 2 and 3, PROTOTYPED AND MEASURED: the route trade (nothing has landed; his look decides)

I built the rounding as a scratch prototype first (`evidence/turnplan.js`): the bank's corner rounding, generalised to a curvature channel. Its bar: the load changes by at most 3 g over 10 m at 170 m/s, κ′ ≤ 1.02e-4 /m², about 51 g/s. It never crosses a joint or a turning point of the curvature, and the curvature's rate of change is 0 at those kept points.

`evidence/trade.js` re-lays the real segments' turn and climb from it and rebuilds with the real `buildPath`, OPEN, because **a closed lap that misses its start by more than 1 mm does not build at all** (path.js throws: closing is the document's job). Three variants, on his ELYSIUM NEW (`evidence/trade-output.txt`):

| variant | joints over mid-piece, U (over 2×) | L (over 2×) | worst joint jerk U / L (g/s) | largest centre-line move | lap closure gap | overshoot |
|---|---|---|---|---|---|---|
| as built (0692d11) | 25 (21) | 21 (19) | 533 / 660 | 0 | 0 | — |
| plain (no overshoot), windows to 500 m | 11 (9) | 9 (6) | 603 / 753 | **1,625 m** | **840 m** | 0% |
| keeps heading, windows to 500 m | 12 (7) | 7 (4) | 552 / 675 | **98 m** | **72 m** | 98% |
| plain, windows ≤ 60 m | 11 (9) | 8 (6) | 603 / 753 | 748 m | 381 m | 0% |
| **keeps heading, windows ≤ 60 m** | 22 (**8**) | 17 (**4**) | 552 / 675 | **0.46 m** | **0.14 m** | **56%** |
| keeps heading, windows ≤ 30 m | 23 (20) | 19 (18) | 552 / 675 | 0.04 m | 0.006 m | 21% |

What that says:
1. **No variant meets all of the order's guarantees at once** (every piece ends at its typed value, no overshoot, the route kept). The bank could have all three because rolling the road does not move it. A curvature change does:
   - spreading it without overshoot moves the lap by hundreds of metres to kilometres;
   - keeping each piece's end heading needs the spread curvature to overshoot (up to 98% of the change), and still moves the position at second order.
2. **The one variant worth his look: heading-keeping windows of ≤ 60 m around each joint.**
   - Joints over 2× mid-piece: vertical 21 → 8, side 19 → 4.
   - The centre line moves at most 0.46 m.
   - **The lap then misses its start by 0.14 m and needs re-closing** (Close's last-piece fix, or the build refuses the lap).
   - Its curvature overshoots the change by up to 56%: for a moment it turns tighter than either piece asked.
3. **The worst joints are not reached by any variant.**
   - p10–p14 (the three the librarian named, up to 533 g/s) are 100–150 m pieces whose turn changes along their whole length (§3). There is no room to spread a change within them.
   - The plain variants make them WORSE (603 g/s): forcing the rate of change to 0 at the joint steepens the middle.
   - That is the document's shape: a piece too short for its turn.

**My read, for his call:** I would not land a turn/climb rounding in the generator. Each version changes his route or overshoots his curvature, and the joints that bump most are left as they are. The remedy that fits is in the DOCUMENT, where he can see it:
- longer pieces at s 5.7–6.6 km, or one piece where three are;
- or a builder command that re-lays a joint's transition over a length he picks, and then re-closes the lap as Close does, so the route change is shown and undoable.

If he wants the ≤ 60 m heading-keeping rounding anyway, it needs his yes on the 56% overshoot and the re-close.

**Not done, because nothing landed:** the full shell-making run, CAR_MARGIN and joint-feel. t180 d637-e is unchanged at 0692d11.

## 4c. HIS JOINT, named: p32|p33 (s 18,353 m), and the acceptance view (the chair's 13:56 order)

His screenshot (13:55): `Pictures\Screenshots\downward on the mega drop lets you see what I mean about the bump with the climb that is where the new piece then starts climbing back up with banking.png`. It looks down a steep drop to where the road creases and climbs back up into ring loops overhead. The crease is circled on the right edge.

**The joint is p32|p33, at s 18,353 m. It is NOT one of the five candidates.**
- **The mega drop** is p30–p32: 768 m down to 185 m, then on to −231 m by p33's end. p31 and p32 fall at −86° to −87°, banked −154° (`acceptance/name.js`; the per-piece listing).
- **"The new piece then starts climbing back up with banking"** is p33. It pulls out of that dive, its pitch going from −90° to +14° over its 750 m, banked −154° to −158°.
- **Checked by the picture, not by the name:**
  - A driver's view on p32 (s 18,250, 1.2 m above the road, the camera standing on the road's own up as a car does: `render637.js` adds `up` to O's renderer) shows his composition: the road falling away, the ring loops overhead, the road necking and turning up into them (`acceptance/p32-none-drive-18250.png`).
  - Projected into that camera with the renderer's own maths, **s 18,353 lands at (800, 457), the neck, and the road beyond (s 18,600) rises to y 327.** The other candidates sit elsewhere (p33|p34 at (1233, 452), 528 m ahead).
  - The same view from p22's drop (the first candidate) has no rings at all (`look-p22-drive-10480.png`).
- **Why my §2 table did not list it:** within 8° of vertical my turn/climb split has no direction, so feel.js left those 1,131 samples out. p31|p32 and p32|p33 are there.
- **Measured directly** (`acceptance/vert.js`, the load and jerk from the built path's own kvec, no split):
  - **p32|p33: vertical jerk 134 g/s 5 m into p33, against 3 g/s mid-piece (47×); side jerk 81 against 5 (17×).**
  - Its neighbour at the top of the pull-up, p33|p34 (s 19,103), is worse: 290 g/s (103×) and 233 (49×).
  - The document's turn and climb rates are 0 at both joints.

**The acceptance view** (`evidence/acceptance/`):
- **base** = 0692d11 as built;
- **fix** = the ≤ 60 m heading-keeping prototype of §4b, built open;
- the same cameras for both, taken from the as-built path. The files are `acceptance-base-*` and `acceptance-fix60-*`: `drive-18250` (his view), `look-18250` (toward the joint) and `side-18353` (the joint from the side).

Its rows (`acceptance/acceptance-rows.txt`):

| joint | build | vertical jerk at the joint (g/s) | its middles (g/s) | side jerk (g/s) |
|---|---|---|---|---|
| **p32\|p33** | base | **134** (at +5 m) | 3 | 81 |
| p32\|p33 | fix (≤ 60 m, keeps heading) | **121** (at +13 m) | **71** | 69 |
| p33\|p34 | base | 290 | 3 | 233 |
| p33\|p34 | fix | 257 | 152 | 207 |

**What it says:**
- **The prototype does not remove his crease.** It lowers the joint's peak by about 10% and moves it 8 m in. It reads "1.7× mid-piece" only because it RAISES the jerk inside the pieces (3 → 71 g/s), by putting the curvature change there.
- In the side views, base and fix are near enough the same edge, and the fix shows a slight new angle further up (around x 1000, y 320).
- That is §4b's finding again, on the joint he chose: within the pieces as laid, there is no rounding that takes this crease out and keeps his route.
- What p33 asks for is the remedy: the pull-out from a −87° dive starts at full rate at the joint, over its first ~15 m. A pull-out laid over a longer ease-in, in the document, takes it out. That is his edit, or the joint-transition command offered in §4b.

## 4d. THE WRITER FOUND, and VARIANT 4 measured (the chair's 14:03 and 14:11 re-briefs; his 14:02: "I like the idea of 2, but almost wish we could just make the generation system one shot this problem on its own")

### The writer, and why the ramp is two spans

- **The panel:** `app/core/panel.js:49-59` `AT_START_M = 20`. A turn or climb ticked "early" (read as a rate) is reached within 20 m, "or the whole piece if shorter", then held.
  - The cross-section channels were sized to their change in October: bank, cup and edge by F and `crossStartM` (`:84-90`), the width by F.
  - The comment at `:59` says it plainly: **"Turn, climb and width keep AT_START_M"**. The words the user sees on the tick say the same (`:96-97`, `EARLY_SHORT`).
- **The core:** `src/core/extend.js` lays a ramp shorter than the piece without a fit, by `rampControl` (`:146-154`).
  - The ideal Bloss ramp is read at the knot averages, over `rampKnots`' 4 subdivisions (`:131`, `:135-140`).
  - It is compressed to R − 2R/4 (`:148`), so the CURVE reaches the target by R and holds after.
  - A 20 m ramp is therefore laid in about 10–15 m: two knot spans.
  - checked: p33's saved climb (the librarian's read, 14:11): kv 0 → −2.513e-3 over s 0–15 m, then flat for 735 m; `ramps.js` → p33 "1-15".
- **So:** the change is squeezed into a fixed 20 m whatever its size, and the size of p33's change (Δκ 2.51e-3, a pull-out of a −87° dive) needs about three times that at the §4b bar.

### Variant 4, measured (`evidence/variant4/`)

**(a) A NEW build, through the real writer.** `newbuild.js` lays p32 → p33 → p34's shape fresh with `extend`, using his saved targets: the climb and turn "early", today's 20 m against a transition sized to the change, R* = max(20 m, 2.35 · |Δκ| / bar), at most half the piece.

| new build | the curvature's largest rate | vertical / side jerk at the 2\|3 joint (p32\|p33's shape) | at the 3\|4 joint |
|---|---|---|---|
| today's writer (20 m) | **6.84× the bar** | 156 / 263 g/s | 179 / 165 g/s |
| sized | **1.25×** | **61 / 60** | **61 / 32** |

- Nothing overshoots: a ramp from one held value to the next, in the convex hull of its control points (`extend.js:124`).
- The end of the sized route lands 24 m from today's. **In a new build that is not a move:** the route he sees while placing each piece is the sized one.
- The writer lays a ramp in about half its length, so 2.35 peaks at 1.25× the bar. A spread of about 3 holds it at the bar (inferred from that ratio; to measure when built).

**(b) His saved ELYSIUM NEW, REGENERATED** (`regen.js`: the 29 short start ramps re-laid sized, or turnplan's carried rate through the joints, or both, on the real segments, built open):

| variant | joints over mid-piece, U (over 2×) | L (over 2×) | worst joint jerk U / L | **p32\|p33** U / L | **p33\|p34** U / L | **p10–p14** worst U / L | largest centre-line move | lap closure gap | overshoot |
|---|---|---|---|---|---|---|---|---|---|
| as built (0692d11) | 25 (21) | 21 (19) | 533 / 660 | **134 / 81** | **290 / 233** | 533 / 660 | 0 | 0 | — |
| **sized (the writer)** | 15 (10) | 13 (9) | 533 / 660 | **19 / 12** | **19 / 1** | 533 / 660 (untouched) | **1,687 m** | **767 m** | 0% |
| carry (the build) | 2 (0) | 1 (0) | 278 / 347 | 0 / 0 | 3 / 4 | 278 / 347 | 7,436 m | 1,697 m | 1,160% |
| sized + carry | 7 (3) | 6 (3) | 278 / 347 | 20 / 9 | 20 / 1 | 278 / 347 | 2,166 m | 785 m | 1,160% |

(Re-laid on his track: p33's climb 14 m as saved → 58.1 m, its turn → 100.4 m; p34's climb → 66.9 m, its turn → 125.4 m; p32's climb → 20 m.)

### What it says

1. **The writer is the one-shot fix for his crease, and for every turn or climb laid "early".**
   - At p32|p33 the vertical jerk falls from 134 to 19 g/s, below the pieces' own middles; p33|p34 from 290 to 19. No overshoot, no layer.
   - **Because the fix is at the writer, his saved tracks stay exactly as they are by themselves:** the build reads the saved knots, and only a piece laid (or re-laid) after the change gets the sized ramp.
2. **Existing saves, if he opts in, MOVE A LOT.** Re-laying ELYSIUM NEW's 29 early ramps sized moves its centre line by up to 1.7 km and leaves the lap 767 m from closing. A longer ramp turns or climbs less early, and on a 25 km lap that adds up. So a re-lay of an existing track is a re-closed, different track: an opt-in per track (a command), never automatic.
3. **The carried rate (the build-time half of variant 4) should NOT land.**
   - It reaches p10–p14 (533 → 278 g/s), but it rewrites each half-piece from its middle to the joint, so on his saved lap the route moves 7.4 km and a curve can overshoot its own change many times over (1,160% of a small one).
   - In the builder it would also move a placed piece's last half when the next piece is placed: the one thing the order says must not happen.
   - **p10–p14 are short pieces turning along their whole length** (their middles already read 168–252 g/s). What reaches them is longer pieces there, his edit, not the generator.

**My recommendation, for his call:**
- Land the writer fix: a turn or climb ticked "early" is reached over a length sized to its change, like the bank, cup, edge and width already are. Spread about 3, at least 20 m, at most half the piece. PROVE IT tier: tests first, a red row on today's 6.84×, and the fixtures and his saves byte-equal (they do not re-lay).
- Re-laying an EXISTING track's early ramps is a separate opt-in command, with the route move shown and the lap re-closed.
- No build-time carry for turn and climb.

Nothing has landed; t180 d637-e is still 0692d11.

## 5. Corrections

- My first run of the lock check read P's landing lock ("…not a timing session…") as a timing session, because I matched the bare word "timing". Re-checked by the room's rule (a lock that says "not a timing session" is not one), then run. Nothing was spoiled; I only waited.

NEXT: librarian puts §4d to the keeper when this lands; E builds the writer fix (sized early turn and climb ramps, PROVE IT) on d637-e once he says yes, and the opt-in re-lay only if he asks for it.
