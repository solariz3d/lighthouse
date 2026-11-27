# Why a very fast car goes through a road, and what a road alone can do about it (research note)
2026-11-27
written by researcher subagents (Fable) for the librarian (L): five readers, a modeller kept blind to the recorded cases, a scorer, this writer; a checker's section follows

Readers are cited as V1 (engine step), V2 (recorded cases), V3 (what a road can do), V4 (loops and corkscrews), V5 (online). Editor paths are at commit c522ea6. "checked" and "inferred" are the readers' own marks. Track names are left out; roads are described by shape.

## Answer first

1. The road is a sheet with no thickness, tested once per physics tick with a soft spring contact; once the car's 0.5 m floor box sinks into it fast enough, the push weakens or turns the wrong way and nothing underneath stops the car (code checked by V1 upstream, consequence inferred).
2. The modeller's rule scored 11 hits, 15 misses, 7 unscorable on the 33 recorded cases; the load-only baseline (55 g for 0.5 s) scored 7 hits, 14 misses, 12 unscorable. The rule called all 4 mid-road pass-throughs, but only because it says "through" for every soft-road pass at 50 g or more, and 11 of those 15 held. It does not separate held from broken there.
3. The rule's own stated falsifier was met: cars held with the box 11 to 28 cm under the road for 0.2 s up to seconds. The 0.11 m "point of no return" is wrong as stated.
4. The only thing in the record that separates held from broken on the soft road is how fast the box was sinking at 11 cm in: 0.63 m/s or less held (5 passes), 1.66 and 1.96 m/s broke (2 passes). Nobody has a mechanism for that number.
5. Stiffening the road contact (`SOFT_CFM` 0.0002 to 0.00005) is the one measure with a measured hold: the same cars then held 64.6 to 64.9 g with the box clear, and 71 g for 6.3 s. No mid-road pass-through is on record on the stiff setting.
6. A second kind of failure starts at an open edge (a wheel drops past the edge and comes back under the one-sided road). Neither the rule nor the baseline has a term for it.
7. The road-side settings the game's patch itself names for this failure (`MAX_DEPTH` small, `RIGID_WITH_BOXES=1`) are not used by the editor and are untested at these speeds.
8. Online: no case on disk is from a server. The patch's "stops cars falling through the ground" fixes are documented as offline only. That is the one documented difference; whether it explains the reports is inferred.
9. Every figure comes from replays at 0.015 s per frame (about 5 ticks). Nothing is resolved at the 333 Hz tick.

## The mechanism

Each step is marked known (a reader checked it at a source) or assumed (inferred, or the modeller's assumption).

1. **Known.** The game collides with ODE: `extension\config\general.ini:100` "`Raycasting engine … 0 for ODE, 2 for Intel Embree`", `:122` "`lets ODE to check for contacts`" (V1, checked). V4 did not find the engine named in the patch's pages; V1 found it in the installed config. Both are shown; V1's is the later, more specific read.
2. **Known.** Tyres are ray casts, not solid shapes (V1, `general.ini:100`). The body meets the road with a floor box, `CENTRE=0, 0.2, 0`, `SIZE=2.0, 0.5, 3.0` (`colliders.ini:7-8`), "collisions of the bottom of the car with the asphalt and kerbs" (`colliders.ini:1`), and with the collision mesh (`general.ini:108`) (V1, checked).
3. **Assumed.** Positions are tested once per tick with no sweep. V1 found no sweep in upstream ODE; the game's bundled ODE and the patch's replacements are not public. V3: no continuous-collision key exists for a track author (checked absent).
4. **Known.** Below about 40 g tyres and suspension carry the car. From about 40 g the box is at the mesh, 0.2 to 1.4 cm over it (`limits.js:10`, `chassisG: 40`; V3, V4, checked).
5. **Assumed.** The soft block makes the contact a spring. From ODE's formulas (user guide §3.8.2: "ERP = h kp / (h kp + kd)", "CFM = 1 / (h kp + kd)") at h = 1/333 and ERP 0.8: CFM 0.00005 gives kp 5.33 MN/m per contact point, CFM 0.0002 gives 1.33 MN/m (V1, arithmetic, inferred). The modeller assumed the whole load sits on 4 points with 850 kg. The score contradicts that assumption (C2, C4 to C7, C16 below).
6. **Known (code), assumed (for this game).** In upstream ODE's box-against-triangle test, only the triangle-normal axis is one-sided (`collision_trimesh_box.cpp:138-141`). Box-face axes take the shorter way out (`:213-232`, "`// flip normal direction`"). For a 0.5 m box parallel to the road: past 0.25 m the push turns through the road; past 0.5 m there is no contact (V1, inferred from checked code).
7. **Known.** The recorded mid-road breaks did not wait for 0.25 m. They ran away from 13 to 16 cm, 0.075 to 0.4 s after the load peak, all four wheels still on top, fronts first (V2, C1, C10, C11; H563:183-215, 366-375). V1: "The 0.25 m figure is an upper bound from upstream code, not a measured threshold."
8. **Known, and against steps 6 and 7 read as thresholds.** Cars held with the box 11.3 to 15.9 cm under for 0.21 to 0.6 s (C3, C8, C9), 26 to 28 cm under for 7 s on a smooth 85° helix wall (C15), and up to 20.1 cm under at 77 to 90 g (C20) (V2). Depth alone does not decide it.
9. **Known as a measurement, no mechanism.** Sink rate of the box at 11 cm in separates the seven soft-road helix passes: at most 0.63 m/s held, 1.66 and 1.96 m/s broke (H563:348, 409-423). C15's box settled at 0.04 m/s.
10. **Assumed.** `MAX_DEPTH=4` (`trackfiles.js:35`) means the contact turns hard only past depth 4, deeper than the box is thick, so it never fires (V1, V3, V4, inferred; the unit is not stated anywhere).
11. **Assumed.** Once through, the push-out target is 266 m/s per metre of depth (0.8 × 333, V1 arithmetic), which fits the recorded throw of about 125 g. The downforce ray starts 0.4 m above the car origin (`script.lua:377`, checked); if the engine culls back faces it misses once the car is that deep (ODE has the flag at `collision_trimesh_ray.cpp:53`, `:58`; the game's setting was not found).
12. **Known, outside the mechanism.** The edge class: a wheel 0.1 to 0.86 m past an open edge drops 0.2 to 0.8 m below the edge row, comes back under the one-sided road and hangs with no load; depth then does not follow load (V2, C22 to C26, H563).

## The rule, exactly as the modeller stated it

The modeller was not shown the recorded cases. Nothing was run. Verbatim:

Compute, in metres:
- **Clearance c:** c = c0·max(0, 1 − G/40). c0 is the car's clearance if known, else 0.077 (the Mach 6, from V4).
- **Load sink S:** S = 7.83·G·CFM. Use CFM 0.00005 for the current export and 0.0002 for the earlier one. If the surface is not soft-collision, or the block is not honoured (server without track physics, or a server override, from V5), the stiffness is unknown: assume 0.0002 and flag the verdict.
- **Overshoot D:** D = 2 if the load reaches its peak in under half a period (0.020 s on 0.00005, 0.040 s on 0.0002), else 1.
- **Radius C:** C = 1.125/R for a concave road, 0 for a convex one. If R is not recorded, use the bound C ≤ 11.0·G/v² (v in m/s).
- **Roll W:** W = 1.5·r, r in rad/m. A steady bank adds 0. The existing red line of 1.2144°/m gives 0.032.
- **Seam Q:** Q = max(v·θx/ω, v·θx/333), with θx = seam angle − L/R in radians (L = 2 m, inferred by V4). For a landing, θx is the landing angle, so v·θx is the normal speed.
- **Step:** add its height if it faces the car.
- **P = D·S + C + W + step + Q − c.**

Verdict (all thresholds from the readers, placement inferred):
- **P < 0 and G < 40:** HOLDS.
- **0 ≤ P < 0.11, or G ≥ 40 with P < 0.11:** BODY TOUCHES THE ROAD.
- **P ≥ 0.11:** GOES THROUGH. Between 0.11 and 0.25 this is likely; past 0.25 it is certain by V1's code reading.
- **Any single-tick normal travel over 0.25 m** (normal speed over 83 m/s, or a path 18° off the surface at 970 km/h): GOES THROUGH whatever else holds. Over 0.5 m (167 m/s, 38°) it passes with no contact (from V1).

When it goes (inferred):
- If D·S + C + W alone reaches 0.11: half a period (0.02–0.04 s) plus about 0.03 s of expulsion, so 0.05–0.10 s after the load peaks (15–35 ticks).
- If it needs Q or a step: at the first qualifying seam inside the loaded stretch, then about 0.05 s. The expected delay is the distance to that seam divided by v.

Catch surface: a soft catch at 0.3 m has 0.15 m of useful travel (from V1), and the body arrives at about 20 m/s, which needs about 0.14 m. The verdict stays GOES THROUGH, marked "catch marginal". A catch in its own rigid group at 0.5 m or more changes the verdict to "through the road, held by the catch" (inferred, untested).

Offline, the patch extends the box and switches the mesh collider on sooner (from V1, V5). The threshold is then higher by an unknown amount, so mark the verdict "online; offline is milder".

"Not recorded": use the default named above and state it in the verdict. If best and worst plausible values of the missing input give different verdicts, output the worse one as "conditional on <input>".

The modeller's supporting figures (inferred): ω = 1.12/√CFM, 158 rad/s on 0.00005 and 79 rad/s on 0.0002; period 0.040 s and 0.079 s; damping ζ ≈ 0.06.

**What the modeller said would prove it wrong** (verbatim):
- A pass-through on honoured CFM 0.00005, below 140 g, on a stretch with no excess seam over 1°, no step, no landing and roll rate under the red line.
- A hold with the box measured more than 0.11 m under the road for more than 0.1 s.
- Breaks arriving seconds into a steady load at spots with no feature, or equally often at the same P with and without seams.
- Quartering CFM not changing measured sink by about 4.
- `RIGID_WITH_BOXES=1` leaving pass-throughs at the same spots: the spring is then not the mechanism.
- Break onset depth unrelated to radius or roll rate: step 6's softening story is then wrong.

## The score

The scorer's conventions, fixed before comparing: HIT/MISS is on "through" against "not through". The banked helix where most cases sit ("Helix A": radius 71 m, bank 70°, facets 1–2°, no seam within 3.8 m, P:866-869) uses R 71, so C = 0.016 m, W = 0, excess seam 0–0.39°, Q = 0–0.019 m. Onset time is unrecorded almost everywhere, so the rule's own clause applies: the worse verdict, marked "cond". P is best case (D = 1, Q = 0) to worst case, in cm. The table is the scorer's, unedited.

| id | rule's prediction (P, cm) | recorded | rule | baseline | base |
|---|---|---|---|---|---|
| C1 | THROUGH (11.3–22.9) | through, 0.4 s after peak | HIT | time over 55 g not recorded | UNSC |
| C2 | THROUGH cond (10.4–21.0; unconditional from 60.2 g) | held ×7 | MISS | time over 55 g not recorded | UNSC |
| C3 | THROUGH (11.0–22.3) | held, box −11.3 | MISS | THROUGH (0.77 s) | MISS |
| C4 | THROUGH cond (10.7–21.6) | held, box −6.9 | MISS | time over 55 g not recorded | UNSC |
| C5 | THROUGH cond (9.8–17.9, no speed for Q) | held, box −3.0 | MISS | TOUCHES | HIT |
| C6 | THROUGH cond (10.8–21.8) | held, box −10.2 | MISS | TOUCHES (0.44 s) | HIT |
| C7 | THROUGH cond (10.3–20.7) | held, box −7.4 | MISS | TOUCHES (0.14 s) | HIT |
| C8 | THROUGH (11.4–23.2 at 62.8 g) | held, box −15.9 | MISS | time over 55 g not recorded | UNSC |
| C9 | THROUGH (11.7–23.7) | held, box −14.9 | MISS | THROUGH (1.18 s) | MISS |
| C10 | THROUGH (11.4–23.1) | through, 0.22 s after peak | HIT | TOUCHES (0.42 s) | MISS |
| C11 | THROUGH cond (10.6–21.5) | through | HIT | TOUCHES (0.17 s) | MISS |
| C12 | TOUCHES (4.1–7.6) | held, box +4.5 | HIT | THROUGH (1.54 s) | MISS |
| C13 | TOUCHES (4.1–7.6) | held, box +4.1 | HIT | THROUGH (1.35 s) | MISS |
| C14 | TOUCHES (4.1–7.6) | held ×2, box +2.1 | HIT | THROUGH (1.2–1.5 s, from the answer-first line) | MISS |
| C15 | THROUGH (11.2–11.4; D = 1 from the 2.3 s build) | held 7.1 s, box −26 to −28 | MISS | THROUGH | MISS |
| C16 | THROUGH (12.7–12.9) | held 8.5 s, box +1.0 | MISS | THROUGH | MISS |
| C17 | TOUCHES (4.1–7.1) | held, box +2.0 | HIT | THROUGH (6.34 s) | MISS |
| C18 | TOUCHES (3.4–5.8) | held, box +4.9 | HIT | TOUCHES | HIT |
| C19 | THROUGH cond on landing angle (7.8–12.7 before Q; D = 1) | through | HIT | TOUCHES (50 g) | MISS |
| C20 | THROUGH (12.1–28.1) | survived ×4, box to −20.1 | MISS | TOUCHES (0.39–0.43 s) | HIT |
| C21 | HOLDS (P < 0) | unloaded, recovered | HIT | HOLDS | HIT |
| C22 | TOUCHES at worst (−0.7 to +3.0; CFM assumed 0.0002) | wheel 0.31 m under via the edge | MISS | HOLDS | MISS |
| C23 | load and speed not recorded | wheel under 0.5 s | UNSC | load not recorded | UNSC |
| C24 | HOLDS | box −2.73 m, launched off | MISS | HOLDS | MISS |
| C25 | load and speed not recorded | wheel under ×2 | UNSC | load not recorded | UNSC |
| C26 | HOLDS | wheels through at the edge, fell | MISS | HOLDS | MISS |
| C27 | TOUCHES (−1.1 to +1.8) | hop ×2, box +3.2 | HIT | HOLDS | HIT |
| C28 | THROUGH (step 0.40–0.44 m, so P ≥ 0.33) | thrown up 3–6 m, not through | MISS | load not recorded | UNSC |
| C29 | G and speed not recorded; "cross-slope change over 2 m" may or may not be the rule's r | "clips, unstable" | UNSC | load not recorded | UNSC |
| C30 | no collision mesh, outside the rule | fell | UNSC | not a load case | UNSC |
| C31–C33 | load not recorded | held / clean / report only | UNSC | load not recorded | UNSC |

| | HIT | MISS | UNSCORABLE |
|---|---|---|---|
| Rule | 11 | 15 | 7 |
| Baseline | 7 | 14 | 12 |

As a share of scorable rows (this writer's arithmetic, inferred): rule 11/26 = 42%; baseline 7/21 = 33%. Both are under half.

The scorer's readings of the counts:
- **Without the edge class (C22, C24, C26):** the rule is 11 of 23, the baseline 7 of 18. Neither has a term for an open edge.
- **Mid-road pass-throughs:** the rule calls 4 of 4 (C1, C10, C11, C19; two conditional). The baseline calls 0 of 3 scorable.
- **Soft road at 50 g or more:** the rule says THROUGH for all 15 rows, and 11 of them held. It does not separate held from broken there; its 4 hits on that road are the 4 that broke.
- **Stiff road:** the rule is right on all 5 rows that the baseline's duration test gets wrong on 4.
- **Strict three-class:** in the rule's 6 TOUCHES hits (C12–C14, C17, C18, C27) the box was recorded 2–5 cm clear, so the rule drops to 5 hits. The baseline drops to 6 (C18).
- **Conditional verdicts:** C4–C7 would be TOUCHES, and so hits, on the best branch (D = 1, Q = 0). C11 would then become a miss.

What each miss contradicts (the scorer's, unedited in substance):
- **C3, C8, C9 (threshold):** the box sat 11.3–15.9 cm under for 0.21–0.6 s and held. That is the model's own second falsifier.
- **C2, C4–C7 (the spring and its load):** the assumption that the whole load sits on the box fails. Predicted depth is 9.8–10.8 cm against 3.0–10.2 recorded. Recorded depth rises about 0.9 cm per g between 52 and 64.6 g, against the model's 0.16.
- **C15 (spring and threshold):** the box was 26–28 cm in for seconds, not growing. That is past the 0.11 m threshold and past the 0.25 m "certain" bound; the predicted depth was 11 cm.
- **C16:** at 72.8 g the box was never under. The stiffer end stop carried the load, and the rule has no suspension term.
- **C20 (threshold):** cars survived 77–90 g on a soft road with the box 20 cm under.
- **C28 (step term):** a facing step is added as depth, but the standing sheet threw the car up.
- **C22, C24, C26:** these contradict no step; the model has no open-edge term.
- **Timing, inside the hits:** C1 broke 0.4 s and C10 0.22 s after the peak, against the predicted 0.05–0.10 s, with no seam within 3.8 m.
- **Prediction 1, soft half:** a line of "about 70 g less the radius term" (about 60 g) is contradicted by C15 and C16 holding 63–72.8 g while C11 broke at 57.7 g.
- **Quartering CFM (falsifier 4):** for the same car at about 64 g the box went from 13–16 cm under (C10) to 4.5 cm over (C12). The model predicts 11.4 cm under going to 4.1 cm under.

Not testable on the record: the stiff-road load line (140 g step, 280 g steady; highest stiff load recorded is 71 g); tight slow loop against wide fast loop; the onset factor of 2; seam against load and the safe excess seam (2.4° at 970 km/h, 3.8° at 600 km/h); breaks clustering at features after the stiffening; the landing normal-speed line (C19's angle is not recorded); the single-tick 0.25 m / 0.5 m rule; the catch; online against offline; `RIGID_WITH_BOXES` and `MAX_DEPTH`; the scaling laws; the long body.

## Loops and corkscrews

All of this section is V4's arithmetic on read figures (inferred). Nothing was run and no threshold here has been tested against a replay. The only loop case on record is a wheel hang (C22), not a pass-through, and no corkscrew or tube pass-through is on disk (V2).

Per 333 Hz tick: distance d = v/333 (0.250 m at 300 km/h, 0.501 m at 600, 0.809 m at 970). Turn = d/R. Fall-away = d²/(2R). Load = v²/(R·9.81).

| R (m) | turn °/tick 300 / 600 / 970 | fall-away mm/tick 300 / 600 / 970 | load g 300 / 600 / 970 |
|---|---|---|---|
| 30 | 0.48 / 0.96 / 1.55 | 1.04 / 4.18 / 10.9 | 23.6 / 94 / 247 |
| 71 | 0.20 / 0.40 / 0.65 | 0.44 / 1.76 / 4.61 | 10.0 / 39.9 / 104 |
| 150 | 0.10 / 0.19 / 0.31 | 0.21 / 0.84 / 2.18 | 4.7 / 18.9 / 49.3 |
| 400 | 0.04 / 0.07 / 0.12 | 0.08 / 0.31 / 0.82 | 1.8 / 7.1 / 18.5 |

- On a smooth loop the fall-away per tick is the load restated: 0.044 mm per g. Every survivable cell (90 g or less) falls away 4 mm or less per tick. Tick stride does not tunnel a car through a smooth curve. The 0.81 m stride beats the 0.5 m box only on a path more than 38° off the surface, which is a landing.
- Loops are worst because of where the load puts the car. A flat 3.0 m box on a concave road has its ends below the surface by ℓ²/(2R): 37.5 mm at R 30, 15.8 mm at R 71, 7.5 mm at R 150, 2.8 mm at R 400, against a measured box ride of 0.2 to 1.4 cm.
- Corkscrew: the normal turns r·d per tick; a point at half-width w moves w·r·d. A steady roll needs no force. It matters where roll starts or stops, or off centre.

| r (°/m) | normal °/tick 300 / 600 / 970 | w 1 m, mm/tick | w 6 m, mm/tick | roll speed °/s at 970 | extra load at 6 m off centre, 970 (v²·u·r²) |
|---|---|---|---|---|---|
| 0.5 | 0.13 / 0.25 / 0.41 | 2.2 / 4.4 / 7.1 | 13 / 26 / 42 | 135 | 3.4 g |
| 0.93 | 0.23 / 0.47 / 0.75 | 4.1 / 8.1 / 13.1 | 24 / 49 / 79 | 251 | 11.7 g |
| 1.21 | 0.30 / 0.61 / 0.98 | 5.3 / 10.6 / 17.1 | 32 / 63 / 103 | 326 | 19.8 g |
| 3 | 0.75 / 1.50 / 2.43 | 13 / 26 / 42 | 79 / 157 / 254 | 808 | 122 g |

- Twist under the box corner (1 m × 1.5 m), w·ℓ·r: 13 mm at 0.5°/m, 24 at 0.93, 32 at 1.21, 79 at 3.
- Facets: kink = L/R; one-tick depth d·L/R; closing speed v·L/R. At 970 km/h:

| R (m) | kink ° for L = 1 / 2 / 4 m | one-tick depth, mm | closing speed, m/s |
|---|---|---|---|
| 30 | 1.91 / 3.82 / 7.64 | 27 / 54 / 108 | 9.0 / 18.0 / 35.9 |
| 71 | 0.81 / 1.61 / 3.23 | 11 / 23 / 46 | 3.8 / 7.6 / 15.2 |
| 150 | 0.38 / 0.76 / 1.53 | 5.4 / 11 / 22 | 1.8 / 3.6 / 7.2 |
| 400 | 0.14 / 0.29 / 0.57 | 2.0 / 4.0 / 8.1 | 0.7 / 1.3 / 2.7 |

- A seam delivers the turn of L/d ticks at once: 2.5 to 10 times the smooth fall-away at 970. The export's row spacing was not confirmed; "every 2 m chord" (`src/geom/mesh.js:78`, checked) suggests 2 m (inferred).
- The editor's 5.9° seam line (`limits.js:53-56`, amber only) is speed-free. At 970 km/h it allows 83 mm in one tick and 27.7 m/s closing. V1 reached the same figure independently (0.81·sin 5.9° = 0.083 m), against 4–8 cm of box clearance.

What the editor's lines bound and do not (V4, checked at `src/validate/index.js:33-36`, `:357`, `:382-385`, `:394-398`, `:460`; `limits.js:13,18,29,33-34`):
- Roll rate, red 1.2144°/m, amber 0.9338°/m, over a 20 m chord, core segments only: bounds twist per metre. Not roll speed r·v, roll onset, anything shorter than 20 m (25 ticks at 970), or off-centre load.
- Seam 5.9°: bounds kink angle. Not kink × speed.
- Load 25 / 40 / 55 g for 0.5 s / 90 g, none red: bounds v²/R. Not curvature alone.
- Bounded by no line: curvature against the car's length; seam closing speed and one-tick depth; roll onset; off-centre load v²·u·r² (whether a twist term is in the load line was not verified).

**The proposed checker quantities (V4; thresholds inferred, untested):**
1. **Seam closing speed** S = v_local · θ_seam (m/s), or its one-tick depth P = S/333 (m). Amber at P > 0.05 m (bump-stop gap), red at P > 0.10 m (body clearance). In angle terms: 3.5° amber and 7.1° red at 970 km/h; 5.7° and 11.4° at 600. Stricter where the load is 40 g or more. Anchor: the measured sink speeds, 0.63 m/s held against 1.66–1.96 m/s broke (H563:348), which are box sink speeds after tyres and contact, not raw closing speeds.
2. **Concave reach under load** C = ℓ²·κn/2 (m), judged only where load ≥ 40 g. Box (ℓ = 1.5 m): C > 0.014 m, that is R < 80 m. Body (ℓ = 1.5 m + front reach): C > 0.077 m, that is R < 71 m for the Mach 6. For corkscrews add w·ℓ·r.

A caution from the record: the two soft-road breaks with measured sink rates were at a spot with facets of 1–2° and no seam within 3.8 m. So quantity 1 would not have flagged them. It bounds a term the record has not yet shown to be the cause.

## What a road can do

What the editor exports today (V3, all checked): one zero-thickness shell; the soft block `MESHES=1ROAD?`, `SOFT_ERP=0.8`, `SOFT_CFM=0.00005`, `BOUNCE=0.1`, `FRICTION=0.05`, `MAX_DEPTH=4` (`src/export/trackfiles.js:27-36`); `INTENSITY / RIGID_WITH_BODIES / RIGID_WITH_BOXES` left to the patch's undocumented defaults (`trackfiles.js:17-18`); a catch surface 0.3 m under the road (`src/export/catch.js:31`), named `1ROAD_CATCH_…` so it shares the road's soft block (`:14-15`), by default only under stretches past 55 g for 0.5 s (`:17-19`), and unproven by its own comment (`:25`: "NOT MEASURED…"). The under-skin is scenery, not physics (`catch.js:8`). V4 found nothing about soft collision in `extension\config\*.ini`; V3 found the keys documented in 15 installed tracks' `data\surfaces.ini` (lines 8-13 of one). Both are true of different files.

The measures, in V3's rank, with the modeller's and V1's differences shown:

| rank | measure | cost and risk | evidence | status |
|---|---|---|---|---|
| 1 | Lower `MAX_DEPTH` and set `RIGID_WITH_BOXES=1` on the existing block; test `MAX_DEPTH` alone first | Two lines, reversible. A hard kick at the switch (a break was followed by a throw of about 125 g). Loses the soft road for the body, which is what survived 90 g spikes. Unit of `MAX_DEPTH` not stated | Patch docs: "collision becomes hard: might help with performance and avoid objects passing through walls"; "collisions with boxes (usually used for car bottoms) would be fully rigid" (installed surfaces.ini:8-13; wiki) | settings checked; effect inferred, untested |
| 2 | The catch in its own rigid group, outside `1ROAD?` | About doubles road triangles where used; a new surface key must be valid track; a second lip at a jump or open edge | `catch.js:8-25` | inferred, unmeasured |
| 3 | Keep loaded stretches under the load lines; firmer `SOFT_CFM` | Limits what can be drawn; harsher ride | `trackfiles.js:20-24`: on 0.00005 the car that broke "held 64.88 g for 1.54 s with its body 4.5-5.4 cm above the road" | checked, one pass (V2 records 4 passes, 3 cars, plus 71 g for 6.3 s) |
| 4 | Solid primitives under the road (`[COLLIDER_BOX_...]`, `[COLLIDER_PLANE_...]` in `surfaces.ini`) | Boxes are flat; a loop needs many, with seams. A plane is infinite. Count limit undocumented | wiki, geometric colliders | setting checked; fit inferred |
| — | Finer, smoother mesh at loaded stretches | Triangle count; not shown to be the cause here | `limits.js` (`seamP90Deg: 5.9`) | inferred |
| — | Double-sided or back-facing shell | Could trap a body under the road | not found for this engine | not established; not recommended |
| — | Continuous or swept collision | — | no such key | checked absent |

Where the readers disagree:
- **`MAX_DEPTH` value.** V3: about 0.1 to 0.2 (the patch's own example is 0.2). V1: below 0.25, before the flip. The modeller: 0.1 or less, below its 0.11 threshold. The score removed the basis for 0.11. No value is tested.
- **Catch depth.** V3 keeps 0.3 m and changes only the group. V1: at 0.3 m the road is still pushing the body down, the catch only out-pushes the road past 0.4 m and itself flips at 0.55 m, so it has about 0.15 m of useful travel; at 0.5 m or more it has its full 0.25 m (inferred, untested).
- **Speed into the catch.** V3: normal speeds at the breaks were about 2 m/s (0.006 m per tick). The modeller: the body arrives at the catch at about 20 m/s. These describe different moments (sink before the break; expulsion after). Neither is a measurement of a body meeting a catch; none exists.
- **Rank.** The modeller ranks "make sure the stiff block is actually applied" first and seam bounds second. V3 ranks the two settings first. V1's order: `RIGID_WITH_BOXES`, `MAX_DEPTH`, smaller `SOFT_CFM`, catch at 0.5 m, smaller facet angles.

No source shows any of these tested at 800 to 970 km/h. Only the load lines work identically online and offline.

## Online

No case on disk is from an online server (V2). The only record is a driver's report: "it clips the worst"; "We have no data to go off of for that" (`briefs\t180_unmakeable_shapes.md:103-104`).

What could differ (V5; V1 agrees on the first):
- **Offline-only patch fixes (checked text; that it explains the reports is inferred).** `[PHYSICS_EXPERIMENTS]` holds `EXTEND_COLLIDER_BOXES=1` ("prevents cars from falling through the ground in when falling fast") and `ENABLE_MESH_COLLIDER_SOONER=1`; `general.ini:126`: "Affects offline races only, and only cars with custom physics active." A later build's changelog reportedly says finished experiments can no longer be disabled online (search result; the page gave 403; installed build is 3465, `data_manifest.ini:16`).
- **Track extended physics is switched by the server's track-path code** (B cars, C track, D both; cup.acstuff.club server-extra-options, checked). A server with car physics on and track physics off may ignore the soft block (inferred; V5's top candidate). `trackfiles.js:52-53`: "Whether the soft block NEEDS the switch is UNVERIFIED".
- **Server override.** `[CUSTOM_COLLISIONS]` can redefine collision parameters for every client, including `MAX_DEPTH` (checked; whether it overrides a track's own block is not stated).
- **The road mesh is not checksummed.** Only `data/surfaces.ini` and car data are; a driver with an older export drives a different road (checked absence of kn5 among the server's checksum strings).
- **Who simulates the car.** The driver's own machine, online as offline (inferred from the stock server's files, which hold no geometry).
- **Seen only, not physics:** remote-car smoothing, the 18 Hz send rate (`CLIENT_SEND_INTERVAL_HZ=18`, about 15 m between packets at 970 km/h), replay sampling. Another car drawn through the road is not evidence. But other cars' bodies are real colliders locally.

The experiment (V5; one person, one machine). Prediction stated before the run: with code D and no extra options, online equals offline; with car physics on and track physics off, online clips at lower load.
1. Fix the inputs and record a sha256 of each: the track's .kn5 and `data/surfaces.ini`, the car's `data.acd` and `collider.kn5`, `general.ini`, the patch build (3465). One car (the Mach 6), one setup, fixed fuel, no damage, alone on track.
2. One track with four sections far apart: a straight (control), a banked turn sized for about 45 to 55 g, a loop, a corkscrew. No catch surface, so a pass-through shows.
3. Arm A, offline practice, grip and road temperature matched to the server's. 10 laps at the same target speed per section; save the replay.
4. Arm B, local stock server, track path `csp/3465/../D/../<track>`, fixed 100% grip, damage as in A, no extra options. Join alone; 10 laps; save the replay.
5. Arm C, the same server with `csp/3465/../B/../<track>` (car physics only). 10 laps; save the replay.
6. Optional arm D: arm B plus `[CUSTOM_COLLISIONS] MAX_DEPTH=0.2`.
7. Per pass of each section record speed, load, suspension height, lowest body-to-road distance, and whether the body crossed the road.
8. First compare arms on the straight. If speed and ride height do not match within lap-to-lap spread, the arms are not comparable; fix the setup first.
9. Read: "same" if B's body-to-road distance at matched load is inside A's spread and pass-through counts match within one in 10; "differs" if B's median is outside A's spread in two or more sections, or B has two or more pass-throughs where A has none. C worse than B: track physics is the gate. B worse than A: the offline-only experiments are the cause; confirm by turning them off offline and re-running A.
10. Ten passes per section per arm can show a doubling, not a 20% change. Say so with the result.

The recording step needs a replay reader; `tools/` at c522ea6 has none (V5, V2). In light of the score, add the box sink rate at 11 cm to step 7 (this writer's addition, inferred from V2's separator).

## What it means for a car scaled down and slowed, and for a long body outside the collision mesh

All of this is the modeller's inference from a model whose load term and threshold the score contradicted. Read it as direction, not size.

Car scaled down and slowed by k, same road, same 333 Hz, mass falling as k³, against a threshold that shrinks as 1/k:
- Load sink falls as k⁴. Seam depth falls as k^1.5. Radius reach falls as k.
- One-tick travel and the 18° and 38° landing limits are unchanged.
- A fixed-size step or kerb gets worse by k.
- If the road is scaled too, the radius term is also unchanged.

Long body:
- The part outside the collision shapes is drawn only (inferred). It shows through a concave road once reach²/(2R) exceeds its clearance: 77 mm at R 71 for a 3.3 m nose, equal to the Mach 6's 0.077 m raw clearance (V4); 181 mm at R 30, 36 mm at R 150, 14 mm at R 400. That is a visual clip and does not change the physics verdict.
- The record has one such case: a lap where the collider stayed 0.059 m clear while the drawn underside was below the road in 5,552 of 10,987 frames (C31, H616:101-116).
- If the collision mesh does reach that far and is active (offline, not driving straight, V1), touches begin at much larger radii and the long arm pitches the box. Mesh-against-mesh contact was read by no reader.
- Body-corner twist (1.325 m × 3.3 m): 38 mm at 0.5°/m, 71 at 0.93, 92 at 1.21, 229 at 3. The 92 mm at the red line sits near the 0.10 m clearance; V4 calls that a coincidence noticed, not a derivation.
- On the soft road both broken helix cars had shorter wheelbases (3.09 and 2.93 m), but two other cars held (3.14 m and one shorter): 2 of 4. Nothing separates car from driver or line (V2).

## For the track editor: candidate changes, none decided

1. Export option on the road block: a small `MAX_DEPTH` (0.1 to 0.25, readers disagree) and, separately, `RIGID_WITH_BOXES=1` (mechanism step 10; V1, V3).
2. Move the catch surface into its own rigid group, and consider 0.5 m instead of 0.3 m (V1's travel arithmetic against V3's keep-the-depth).
3. Validator line for seam closing speed (v·θ, one-tick depth amber 0.05 m, red 0.10 m), replacing the speed-free 5.9° reading where load is 40 g or more (V4; note the caution that the recorded breaks had no such seam).
4. Validator line for concave reach under load (ℓ²/2R where load ≥ 40 g; box R < 80 m, body per car) (V4).
5. Validator flag for an open edge with no wall or catch near a crest or a loaded stretch (the edge class, C22 to C26; no model covers it).
6. A note or stamp shipped with the export: the server code needed for track physics, the warning about `[CUSTOM_COLLISIONS]`, and a version mark, since the road mesh is not checksummed (V5).

## Not known, not found, not read

Not known:
- Why sink rate separates held from broken, and why a box 26–28 cm in can hold for seconds. No reader has a mechanism; the modeller's softening story is contradicted.
- How the load splits between tyres, suspension end stop and box, and how many contact points carry it. The modeller's "all on four points" is contradicted by C2, C4–C7 and C16.
- Whether a catch surface holds anything. No replay on a catch or an edge apron exists.
- Whether online differs at all. No server replay; the real server's config, program and extra options are not on disk.
- Whether `MAX_DEPTH`, `RIGID_WITH_BOXES`, or the geometric colliders work at these speeds, or apply online. The unit of `MAX_DEPTH` and the defaults of `INTENSITY` and `RIGID_*` are not stated.
- Whether the track's own `extended-0` flag activates the soft block online without the server code; whether a server override beats the track's block.
- Whether the game's box-mesh test is upstream ODE's, its contact count, its correcting-velocity cap, and whether its rays cull back faces. The game's collision code is not public.
- What `EXTENDED_RAYTRACING=1` gives without the ray-count keys; stock tyre ray count; what "2" means in `VERSION=extended-2`.
- Whether C1's "4–8 cm box clearance" is the same measure as the later box figures. V2: it may be the rigid-tyre measure, which read about 13 cm higher in C15 (H515:113).

Not found:
- Any pass-through in a loop, corkscrew or tube; any replay of the car the drivers report as worst; any measured excess seam at speed; any landing with its angle recorded.
- `docs/FINDINGS.md`, `docs/ARCHITECTURE.md`, `docs/research/04_ac_physics_drivability.md` and the replay tools (`loads.cjs`, `bottoming.cjs`, `boxdepth.cjs`, `tools/jump_flight.cjs`) at c522ea6. C20's speeds and road therefore have no primary source here.
- C1's original pane hand-back (in a worktree outside the places searched).
- Any guideline for triangle size in this game's physics mesh; any documentation for vehicles near 1000 km/h in other games.
- The user-level `Documents\Assetto Corsa\cfg\extension\general.ini`; the live `[PHYSICS_EXPERIMENTS]` values are the installed defaults only.

Not read, or read at one remove:
- The patch docs were read through a summarising fetch by V1 and V5; their quotes are the summary's wording. The ODE manual wiki returned 404; the older user guide was read, first 100,000 characters only.
- The 333 Hz rate was taken from the task, not re-derived.
- `raygap.js`, `src/core/finish.js`, `validate/index.js` in full, `collision_trimesh_trimesh.cpp`, the server extra options page's key list, the `_evidence` CSVs, `p-d525-soft-O`, `p-d593`, `p-d601`, the replay hand-backs of 2026-11-13 and 11-15, the librarian's notes.
- Engine-forum threads behind the general "a mesh has no volume" advice were not opened (V3).
- The wheel readers are invalid on cup walls past about 60° (H563:714), so no wheel-under figure exists for bowls.
- The modeller and the scorer read, ran and wrote nothing; every figure of theirs is arithmetic on the readers' text. This writer opened no source either; every citation above is carried from a reader.

## Checker (a subagent that wrote none of the above)

Read only. Nothing was run from the game, the editor or the clone; editor files were read with `git show c522ea6:<path>`, the car's with `git show v0.12.0:<path>`. Every figure below is this checker's own reopening or arithmetic (node, one run).

### Counts

- **Citations reopened: 52.** 45 hold as stated. 7 hold only in part: 2 are one line off, 5 exist and say what is quoted but the note draws more from them than they say (table below). None is missing and none says the opposite of the quote.
- **All of "Answer first", "The rule" and "The score" that has a path was reopened.** What could not be reopened: the 33-case list itself. V2's list (C1 to C33, with each case's load, speed, road setting and radius) is not on disk (`grep -rl C33 exo_memory` finds only this note). C1, C3 to C5, C8 to C17 and C19 were matched to the hand-backs by their figures; C2, C6, C7, C18 and C20 to C33 rest on the scorer's row alone.
- **Web pages reopened: 4 of 4 cited** (the ODE user guide §3.8.2; the patch wiki's collision-parameters and geometric-colliders pages; the server extra options page). All four say what the note says. The changelog page the note marks as 403 was not retried.
- **Score arithmetic: holds.** Rule 11 / 15 / 7 and baseline 7 / 14 / 12 both recount to 33. 11 of 23 and 7 of 18 without the edge class, 4 of 4 and 0 of 3 mid-road, 15 soft rows with 11 held, 5 stiff rows with 4 baseline misses, the strict three-class drop to 5 and 6, 42% and 33%: all recount.
- **Rule arithmetic: holds.** 7.83 = 850 × 9.81 / (4 × 0.8 × 333) (7.825); kp 5.33 and 1.33 MN/m; ω 158 and 79 rad/s; periods 0.040 and 0.079 s; 1.125 = 1.5² / 2; 11.0 = 1.125 × 9.81; 0.032 = 1.5 × 1.2144° in radians; 83 m/s and 18°, 167 m/s and 38°. One slip: ζ ≈ 0.06 is the value on 0.00005 only; on 0.0002 the same formulas give 0.03.
- **Predictions against the rule as stated:** P was recomputed for C1, C3, C4, C5, C8, C9, C10, C11, C12 to C14, C19 and C20 from the rule and the recorded loads. Every one matches the table to 0.1 cm, and every verdict follows from the rule's own thresholds and its "worse verdict, conditional" clause. No prediction was changed to fit its outcome. Two inconsistencies that change no HIT or MISS are under "Cases" below.
- **Loops and corkscrews arithmetic: holds.** All four tables were recomputed. Two nits: 0.5°/m at 970 km/h is 0.40°/tick, not 0.41; "2.5 to 10 times" matches rows of 2 to 8 m, while the table beside it uses 1, 2 and 4 m (1.2 to 4.9 times).
- **Track names: none appear** (searched for the six names the sources use).

### Claims that do not hold, or are overstated

| the claim | what the source really says | the corrected statement |
|---|---|---|
| Answer 4: "0.63 m/s or less held (5 passes)" | `handback/p-d563-wheel-under-O_2026-10-30.md:413-419`: of the 5 held passes, 2 "never cross" 11 cm, so they have no rate there. Rates exist for 3 held (0.15, 0.28, 0.63 m/s) and 2 broken (1.66, 1.96). | The separator rests on 3 held passes against 2 broken, a gap of 2.6×. The other 2 held passes never got 11 cm in, which depth alone also explains. |
| Answer 8: the patch's "stops cars falling through the ground" fixes are documented as offline only; "that is the one documented difference" | `extension\config\general.ini:110` (`EXTEND_COLLIDER_BOXES`) is under the offline-only hint at `:126`. But `:136-152`, `[PHYSICS_EXPERIMENTS_DONE]`, "enabled everywhere now", holds `FIX_GROUND_COLLIDERS=1` ("prevents cars from falling through ground") and `ADAPTIVE_HARD_COLLISIONS=1`. The Online section itself lists three more documented differences (the track-physics code, the server override, the unchecked mesh). | One of the two fall-through fixes is offline only (the extended box, with the sooner mesh collider); the other is on everywhere. It is one of four documented differences, not the one. |
| Answer 1: "tested once per physics tick with a soft spring contact; ... the push weakens or turns the wrong way", tagged "code checked by V1 upstream, consequence inferred" | Mechanism step 3 marks the once-per-tick test Assumed (the game's ODE is not public), step 5 marks the spring Assumed, step 6 marks the turn-around "assumed (for this game)", and step 8 records a box 26 to 28 cm in, past the 0.25 m turn-around, holding for 7 s (`p-d515-crazytest-O_2026-10-28.md:114`). | All three parts of answer 1 are assumptions about this game drawn from upstream code, and the record has one case against the turn-around as a threshold. Only "a sheet with no thickness" and "nothing underneath" are known. |
| Mechanism 4: "From about 40 g the box is at the mesh, 0.2 to 1.4 cm over it (`limits.js:10`, `chassisG: 40`)" | `limits.js:10` and `p-d515…:113`: the box rode 0.2 to 1.4 cm over the mesh between 25 and 47 g measured. It reaches the mesh at about 47 g measured; 40 is that figure in line-predicted load (47 less about 7, `limits.js:14-18`). | From 25 g measured the real clearance is about 1 cm; the box meets the road at about 47 g measured, which the editor's line shows as 40 g. The rule's clearance term (0.077 m shrinking to 0 at 40 g) is therefore too generous between 25 and 40 g. |
| Answer 3 and step 8: cars held "11 to 28 cm under ... for 0.2 s" (C3 as a falsifier case) | `p-d563…:194`: C3's plateau was 10.2 to 11.3 cm for 0.21 s, so it was past 0.11 m for only part of that. C8 (14.5 to 15.9 cm, 0.24 s, `:248`), C9 (13.1 to 14.9 cm, 0.6 s, `:405`) and C15 are clean. | The falsifier is met by 3 cases (C8, C9, C15), 13 to 28 cm for 0.24 s up to seconds. C3 is marginal. The conclusion stands. |
| The score's conventions and the caution in "Loops and corkscrews": Helix A has "no seam within 3.8 m", applied to "the two soft-road breaks with measured sink rates" | `loop/plan_t180_handoff_2026-10-15.md:866-868` measured that for C1's spot (s 8,661) on 10-15: "0 non-manifold edges; the nearest edge is 3.8 m away", "coarse facets (1–2°, 2.1 m edges)". The two rate-measured breaks were at s 8,609 to 8,621, two weeks later, in the same piece. | The 3.8 m is the distance to a mesh-chunk edge at C1's spot; facet kinks of 1 to 2° come every 2.1 m everywhere on that piece. It was not re-measured at the other two breaks, 40 to 50 m away. |
| "The export's row spacing was not confirmed; ... suggests 2 m (inferred)", from `src/geom/mesh.js:78` | That line is a comment about the editor's cached profiles. The exported mesh was measured: "regular faceting, 0.42–0.46° every 2 m" (`p-d563…:597`) and "2.1 m edges" (`plan_t180_handoff_2026-10-15.md:868`). | The row spacing is measured in the record at 2 to 2.1 m. L = 2 m in the rule is checked, not inferred. |
| Answer 7: the settings "the game's patch itself names for this failure" | The wiki and the installed comment say it of `MAX_DEPTH` only, and of walls ("avoid objects passing through walls"; the wiki's example mesh is `?WALL?`, value 0.2). `RIGID_WITH_BOXES` is described as "fully rigid", with no word on passing through. | The patch names `MAX_DEPTH` for objects passing through walls; `RIGID_WITH_BOXES` for this failure is the note's inference. |
| `catch.js:31` (0.3 m) and `catch.js:25` ("NOT MEASURED") | They are at `:30` and `:26`. | One line off each; the text is as quoted. |

### Cases scored wrongly, or scored unevenly

No HIT or MISS changes. Three things a reader of the table should know:

1. **D is applied unevenly.** The rule says D = 2 only if the load reaches its peak in under half a period (0.040 s on the soft road, under 3 replay frames). C15 was given D = 1 "from the 2.3 s build"; the Helix A rows were given D = 2 as their worst case on the ground that onset is unrecorded. It is recorded: the passes are traced frame by frame and build over more than a second (`p-d563…:194-197`). With D = 1 the worst-case P of the Helix A rows is 11 to 14 cm, not 21 to 24. The conditional verdicts then hang on Q alone (0 to 1.9 cm), and C2, C4 to C7 and C11 stay conditional, so the counts stand.
2. **C3's unconditional THROUGH hangs on 0.1 mm** (best-case P 11.01 cm against 11). It should read "cond" like its neighbours. Still a MISS.
3. **Timing is reported one-sidedly.** C1 (0.4 s) and C10 (0.22 s) are given as misses of the predicted 0.05 to 0.10 s. C11 broke 0.075 s after its peak (`p-d563…:366-369`), inside the window. One of three fits.

C2 is left out of the "conditional verdicts" reading; below 60.2 g it too would be a hit on the best branch.

### What the note should have said and did not

- **The record already has a car past `MAX_DEPTH`.** The body was 3.9 m under 0.09 s after one break and 5.0 m under 0.105 s after (`p-d563…:201`), and wheels reached 3.8 m in another (`:92`), with nothing turning hard at 4. So either the unit is not metres, or the hard switch does nothing once the box no longer overlaps the sheet. This bears directly on rank 1 in "What a road can do" (inferred by this checker; untested).
- **All 15 installed tracks that carry the documented block set `RIGID_WITH_BOXES=0` and `MAX_DEPTH=4` explicitly** (counted across the installed `surfaces.ini` files). The proven roads chose soft for the box. Rank 1 is a departure from every road the load figures were measured on.
- **The wiki adds a condition:** with `MAX_DEPTH`, set at least one other parameter such as `INTENSITY = 1`. The editor's block has others, so it is met; an export option should keep it so.
- **C16 is a different car** (a variant with a stiffer end stop, `p-d563…:694-699`, `:742`), not the car of the other helix rows. The note says so only in the miss list.
- **A hidden key nobody read:** `ALT_DEPTH_FOR_CAR_BOX_VS_TRACK=0` (`general.ini:123`, hidden, in the offline-only block) is named for exactly this contact.
- **`general.ini:100` does not say tyres are ray casts.** It names the ray-casting engine. Step 2 is right in substance, but that line is not the source for it.
- **The case list is not filed.** Until V2's 33 rows are on disk with their inputs, 17 rows of the score cannot be reopened by anyone.

---
**Librarian’s check, 2026-11-27 06:16 (L):** sections read by me: Answer first, The mechanism, What a road can do, Online, the scaled car and long body, the candidates, and the checker’s result. Three sources re-read by me, 3 of 3 hold: builder c522ea6 `src/export/trackfiles.js:17-36` (the soft block as quoted, and its comment with the 1.66 and 1.96 m/s breaks and the 64.88 g hold on 0.00005); the installed `extensionconfiggeneral.ini:108`, `:110` and `:126` (`ENABLE_MESH_COLLIDER_SOONER`, `EXTEND_COLLIDER_BOXES` "prevents cars from falling through the ground in when falling fast", and "Affects offline races only, and only cars with custom physics active"), and `:136-138` ("enabled everywhere now"); `handback/p-d563-wheel-under-O_2026-10-30.md:409-423` (the sink-rate table: 3 held passes have a rate, 2 never cross, 2 broke, as the checker says). **Where the body and the checker disagree, read the checker.** The model failed its own test; what stands is the record’s sink-rate separator, the stiffer road setting, and the offline-only lines.

**A miss of the librarian’s:** the proposal that started this study named `limits.js` and `catch.js` as the prior art and not `handback/p-d563-wheel-under-O_2026-10-30.md`, which already held the separator and the stiffer setting. The cases reader found it.
