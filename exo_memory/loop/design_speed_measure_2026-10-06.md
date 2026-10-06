# D256 item 2: what "always max speed" would change, measured · pane E, on D, 2026-10-06 ~13:3x

Plan: `exo_memory/loop/plan_t180_design_speed_2026-10-06.md`. Measured only; nothing in `src/` was changed.

**Setup:**
- **Code:** t180 main `64fa6cf`, detached worktree `C:/Users/nname/Desktop/worktrees/e-speed-wt`.
  - D250 item 2 (`da2c2d6`, the jump-reach warning) is NOT in it, so a missed landing still reads red here.
- **Tracks:** the keeper's 7 `eq-*` tracks, COPIED from `%APPDATA%\com.solariz3d.t180-track-builder\tracks` (read, never written), plus fixtures F1–F9. F9 is empty and skipped.
- **The probe:** scratch `speed256/probe.js` (sha256 `61a1d5b2…`), output `speed256/all.jsonl` (sha256 `0597895e…`), under the heavy-run lock, 5 s.
- **It makes the panel's own call:** `validate(path, segs, { csp: true, designSpeed })`, with no mesh folds and no ray-gap, the same as `app/validate-ui/panel.js` `vo()`.
  - So "green" below means **green in the live panel**.
  - The mesh checks (self-intersection, downforce-ray-gap) do not depend on speed and are outside this probe.
- **Three columns:** design speed 460, 970, and none.
  - "None" is the closed lap's ghost lap; an open track gets no speed and no loads at all.

## The headline numbers

**Registered falsifier: NOT fired.**
- Under today's checker, **0 of the keeper's 100 panel-green pieces turn red at 970** (7 tracks).
- Also 0 of 24 fixture pieces. F7 gains a red (`landing-misses-zone`), but only on the jump piece, which is already red.

**Why nothing turns red:**
- **Loads are never red.** They are amber above 90 g (`load-above-proven`) and info at 20 g or more (`on-the-stops`) (`src/validate/limits.js`).
- **Speed reaches a red through only three routes:**
  1. `leaves-surface`, in the lap proof. Closed tracks only, centreline only.
  2. A jump's landing check.
  3. `stall`.

**The export already checks closed laps at 970.**
- `src/export/fromwords.js:175` validates with **no** design speed, so a closed lap is judged on its ghost lap.
- On **every** closed track here, the ghost lap is a flat **970 km/h**, minimum and maximum alike.
  - The point-mass lap has no braking and no drag; it reaches the cap and stays there, climbs included.
- So the 460 slider changes only what the **panel** shows. The export is already "maxed out" on a closed loop.

## Per track (panel, design speed)

| track | closed | pieces green at 460 | reds only at 970 | ambers added at 970 | max normal load 460 → 970 |
|---|---|---|---|---|---|
| T-180 OVAL (the cup oval) | yes | 6/6 | none | none (info on-the-stops 2) | 5.3 → 23.1 g |
| T-180 TUBE OVAL (the tube oval) | yes | 6/6 | none | none (info 2) | 5.2 → 22.8 g |
| T180 TUBE V2 | open | 4/6 | none | none (info 2) | 5.2 → 22.7 g |
| **TEST 1 recovered** | open | 40/46 | none | **load-above-proven 6** | 30.8 → **135.6 g** |
| TEST 1 | yes | 32/46 | none (leaves-surface 202 → 242 stations, same pieces) | load-above-proven 6 | 30.8 → 135.8 g |
| TEST OVAL | yes | 6/6 | none | none (info 2) | 5.0 → 21.0 g |
| TEST | open | 6/6 | none | load-above-proven 2 | 30.8 → 135.6 g |
| F1–F8 | F1, F2 closed | 24 green | F7: `landing-misses-zone` (the jump piece, already red) | none | F2 10.3 → 42.8 g |

- Loads scale as v², so ×4.45 from 460 to 970 (the table matches).
- "The cup oval" is my reading of `eq-T-180 OVAL` (bowl family, closed, 6,000 m); a tube oval and a cup oval are what the plan named.

## Minimum-speed adhesion: does a check exist, and at what speed?

**Partly.**
- **What exists:** `leaves-surface` (`src/validate/index.js:399`): the normal load on the **centreline** is negative.
  - It runs **only inside the closed lap's proof**: in the panel at the design speed (460), and at export on the ghost lap (970).
  - **On an open track it never runs.**
- **What does not exist:**
  - a check at a **slow** speed: no column ever runs below 460, and the ghost lap's slowest speed is 970;
  - any check on the lines other than the centreline.

**The physics, measured per lateral line.** At a constant speed the normal load on every line is `fN(v) = A·v² + B`; I fitted A and B from the 460 and 970 columns. This splits into two different failures:

- **Faces down, needs speed** (B < 0: the road leans past vertical). It holds only above `sqrt(−B/A)`. This is the slow-car failure the plan describes.
  - TEST 1's inverted pieces need **at most 178 km/h on the centreline** (p13); p12 needs 171–173 and the rest less.
  - No centreline station anywhere fails to hold at some speed.
  - **So at 460 and at 970 they all hold.** Below about 180 km/h a car would drop off them, and nothing reports that today.
- **Curves away, lets go above a speed** (B ≥ 0, A < 0: a crest, the inner side of a rolled turn). It gets **worse** with speed and holds only below `sqrt(B/−A)`.
  - **This is the one "always max" makes stricter.**
  - Centreline let-go speeds: TEST 1 p7 79–94 km/h, p8 84–97, p31/p32 about 220, p9/p10 about 360–380, p3 569–605. F3 155, F5 180, F7 110.
  - **TEST 1 p8 has no single speed at which its whole centreline holds**: some of its stations need more than 92 km/h, others let go above 84 km/h.

**Off the centreline, almost every curved road has negative lines at 460**, which a car need not drive. Examples:
- the tube oval's roof over its straights (no centripetal load there, so −1 g at any speed);
- a bowl's inner wall in a turn (F1: −6.6 g at 460, −32 g at 970).
- **A check on every line would red nearly everything.** The tube oval has negative lines on 6 of 6 pieces at both speeds.

**What a centreline lift-off check on OPEN tracks would add** (if `leaves-surface` ran beyond the closed lap):
- **TEST 1 recovered:** p7, p9, p31, p32. Green in the panel today, yet the centreline lifts off **already at 460**. TEST 1 closed shows these same places red (202 stations).
- **TEST:** p3, **only at 970** (let-go 569 km/h).
- **Total:** 4 of 100 keeper green pieces at 460, 5 of 100 at 970. **The only piece "always max" alone adds is TEST p3.**

## Jumps
- **The ramp is sized at 460 whatever the slider says.**
  - `src/core/adapter.js` `toSegments(doc, { designKmh = 460 })`, and `app/core/coreshell.js:255` `setDesignSpeed` only stores the value.
  - So the D179 comment in `app/validate-ui/index.js` that "the slider's speed also sizes the open track's jump ramps" does not hold for the equation core.
- **At 970 the F7 jump overshoots** its 460-sized landing. With D250 that is a warning, not a red.

## PROPOSALS (the keeper decides; nothing is changed)

**(a) Fixed full-speed load check, replacing the slider.**
- **What it means:** loads at 970 (`MACH6.vmaxKmh`) everywhere, in the panel and at export.
- **Measured cost:** **no new red on any keeper track.** It adds `load-above-proven` amber on TEST 1 / TEST 1 recovered (6 places, up to 135.8 g) and TEST (2), plus more `on-the-stops` info.
- **It removes a real inconsistency:** today the panel judges at 460 while the export judges a closed lap at 970.
- **Recommendation: adopt.**
- **What would change my mind:** if the keeper's ambers should mean "my car can't take this", 90 g at 970 will show amber on his hardest pieces. Today that amber does not block.

**(b) A minimum-speed adhesion check where the road leans past vertical.**
- **What it means:** on the centreline, every station facing down gets its hold speed `sqrt(−B/A)`.
  - The piece shows "**holds above N km/h**", as information or amber, since an open track has no arrival speed.
  - **Red** only where no speed holds.
- **Measured:** the largest need is 178 km/h (TEST 1 p13). Red would fire on 0 keeper pieces.
- **Its twin I recommend more strongly:** run the **centreline lift-off** (`leaves-surface`) on OPEN tracks too, at the full speed.
  - Today the panel shows TEST 1 recovered p7/p9/p31/p32 green while their centreline lifts off at 460 and at 970. That is a missing check, not a speed choice.
- **Not proposed:** any check on the off-centre lines. Measured, it reds the tube oval whole.

**(c) The closed lap's ghost-lap speeds.**
- On every closed keeper track the ghost lap IS 970 flat, so (c) equals (a) today.
- **Recommendation:** keep the export judging on the ghost lap (it already does). If (a) lands, the panel on a closed loop should use the ghost lap too, so the two never disagree.
- (c) would differ from (a) only where a climb slows the car below 970. No keeper track has one; the point-mass car's thrust at top speed outweighs gravity on every climb here.

## What this does NOT establish
- **Whether the car really drives the centreline in a bowl's rolled turn.** It rides up the wall, so centreline lift-off may overstate the risk where the car is elsewhere. A real lap in AC is the tether.
- The mesh checks (self-intersection, ray-gap): their reds do not depend on speed and were not run.
- Whether the 3.2/6.3 g jump flight model holds at 970.
- **AC:** not launched, and nothing was written to the app's folder.
