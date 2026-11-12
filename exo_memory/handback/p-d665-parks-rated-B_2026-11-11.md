# D665 step 2, the Parks rated by the hunter's real travel (E's §3e, V5): B's hand-back, INTERIM (2026-11-12)

Packet: `[chair:MAIN] D665 step 1 is collated ... Start STEP 2 now` (02:24Z). Tier PROVE IT. Branch `d665-variety-b`, on step 1 `2d72bd2`, worktree
`C:\Users\nname\Desktop\worktrees\dz3-d658-b`; **uncommitted** (two files below). Scratch: `C:\Users\nname\AppData\Local\Temp\claude\fdb7d12f3434a8ed\12fb81f6-f4c0-4ef8-aad8-f0cdce091925\scratchpad\d665b\`.

## Status: half done; TWO DESIGN CALLS need a ruling before it can be green (§3)

## 1. The generator's hunter model is now the chase's hunter (red first, then green)

- **Red row** (`chase/tests/speed_tests.cpp`, new): `the_generators_hunter_model_is_the_chases_hunter_at_the_start_of_a_run`. It builds the hunter as a fresh run on
  the normal level does (`make_body` with `ref_speed`, the dial at 0 and the start bonus) and takes `profile_of(...).speeds`, the speeds the mesh prices
  its way with. Each `gen::HunterModel` field must be within 2%.
  - Red (`s2_red.txt`): **the chase's hunter: walk 8.960, stairs 6.272, ladder 1.500 (the time to get onto it folded in), drop 1.600 s**; the
    generator's: 7.0, 4.9, 2.0, 0.9 (the nav defaults, from before D657).
- **The change** (`gen/src/gen.h` `HunterModel`): those four numbers, with the reason in a comment. Green (`s2_green.txt`).

## 2. V5, measured on bots (the ordinary measure, before and after)

`bots_ev.sh`: `dz-chase run --world --events`, seeds 1 to 20 × flee, line, juke, normal, 300 s at most. Every "enters a reprieve" event gives the
generator's way round (its record's detour) and the mesh's way round (`find_path` from the entered mouth to the far one, with the hunter's own profile at that
moment, `run.cpp`). Before is 2d72bd2, after is 2d72bd2 plus §1:

| | before | after |
|---|---|---|
| Parks the bots entered | 17 | 11 |
| generator ÷ mesh: median, p75, max | 1.79, 1.87, 2.00 | **1.34**, 1.44, 1.57 |
| Parks over 1.3x | 17 of 17 | 8 of 11 |
| mean way round: generator / mesh | 11.4 / 6.6 s | 8.7 / 6.5 s |
| time a Park bought (the hunter's lead out − in), median | +1.6 s | **+3.3 s** |
| the bots' median survival (V8) | 38.1 s | 38.5 s |

- **V5 (registered: wrong if the generator's detour is more than 1.3x the mesh's): not yet met**, 1.34. The speeds closed most of the gap; the rest is
  the path. The generator walks its cell graph (cell centres, diagonals only across four open cells); the mesh cuts corners. The hunter's speed drifts
  only a little during these runs (inferred: 1-2% by the dials' slopes and the distance gain at about 40 s), so it isn't the drift.
- **Fewer, better Parks:** a faster true hunter means fewer Park sites clear the 5 s minimum way round, and the ones kept buy twice as much.

## 3. The two calls (B's view first; the room decides)

**(a) Closing V5's last 4%: a path factor, or not.** The generator can't search the mesh (it is the layer under it). It can scale its graph path by a
measured factor: the median of mesh way round ÷ graph way round over **every** Park in many worlds (a chase test, which sees both), not over the bots' 11,
so V5 stays an independent check. A test holds the factor to that measure, like §1's hunter model. **My view:** do it, stated as a calibration, with its
own test. **What would change my mind:** if the factor spreads widely (some Parks at 1.0, others at 1.6), then one factor is a fudge, and the honest move
is to accept 1.34 and leave the rest to the kit (§3b-d), whose pieces are laid on the grid where graph and mesh agree.

**(b) What a Park must buy.** `gen_tests` `no_reprieve_has_a_quick_way_round_on_the_assembled_graph` (dial_tests.cpp:245, :255) is now red, two ways:
- Its "a Park is a shortcut" check: a Park's own crossing, at the hunter's ladder speed (or walking speed for a passage), must take less than its way
  round. With the true ladder speed, a 9.1 m duct takes **6.1 s** (was 4.6), more than the way round of some kept ducts (from **5.02 s**). **Those
  Parks are not shortcuts at all,** which is his "doesnt save as much time as u think".
- Its "both kinds occur" check: of 253 Parks judged, **6 are passages** (needs over 20). Passages have short ways round, and a faster true hunter puts
  them under the 5 s minimum.
- Today a Park is kept if its way round is 5 s or more. E's §3e: "keeps a passage only if it **buys** at least `reprieve_min_detour_s`". Read as "way
  round minus its own crossing", that drops most ducts now (way round about 8.7 s, crossing 6.1 s), and **Parks would nearly vanish until step 3's kit**.
- **My view:** make "buys" true (way round minus crossing ≥ the minimum) **together with step 3**, so better shapes arrive as the ducts go. Until
  then, step 2 keeps the 5 s rule. The red row's shortcut check is then amended by name to the true rule, and its passage count is lowered by name or
  held for step 3. **What would change my mind:** if he would rather have fewer Parks now than any Park that doesn't pay.

NEXT: librarian, rule on (a) and (b) when this is read; B then finishes step 2 and runs its proof. Nothing heavy of mine runs during P's loader landing.

## 4. The rulings (the librarian's "D665 STEP 2 RULINGS", 20:38), and the band REGISTERED before the measure

- **(b) taken:** the true buy rule (the way round minus the Park's own crossing, at the hunter's real speed) goes in. **Steps 2 and 3 land together, with
  the Park kit.** The red row (`no_reprieve_has_a_quick_way_round_on_the_assembled_graph`) stays red on the branch until the kit greens it. Nothing is
  amended to pass in between, and step 2 never lands alone.
- **(a), the path factor, its band stated now, before any measuring:**
  - **The measure:** a chase test over **6 worlds** (the arenas of seeds 3 and 7, and four more seeds). For every Park the generator recorded there,
    with its detour not capped: the mesh's way round between its two mouths (`find_path` with the hunter's starting profile, §1), divided by the
    generator's detour. One ratio a Park.
  - **NARROW, and a factor is used, only if:** at least **100** Parks, and the middle half of the ratios lies within **±10% of their median**
    (25th percentile ≥ 0.90 × median and 75th percentile ≤ 1.10 × median). The factor is then that median, held by a test.
  - **Otherwise:** no factor, and **V5 is reported as failing at 1.34**.

## 5. The path factor, measured against the registered band: NARROW, so it is used

`factor_row.js` (a scratch chase test, not committed) run at 02:46:47Z under the ordinary lock (`factor.txt`), 8 minutes after the band was committed
(acd2059b). Six worlds: seed 3 (the plain arena) and seeds 7, 11, 13, 17, 19 with the rich arena's Park rate (0.5), as seed 7's arena has. The registration
said "four more seeds" and didn't name their dials; the higher rate gives more Parks, not a different ratio (inferred).

| | |
|---|---|
| Parks measured (uncapped, matched, with a mesh path) | **475** (14, 88, 93, 90, 95, 95); capped 0, unmatched 0, no path 0 |
| mesh ÷ generator: median | **0.835** |
| 25th / 75th percentile | 0.808 (0.97 × median) / 0.890 (1.07 × median): **inside ±10%** |
| min / max | 0.705 / 1.820 |
| by kind | ladder ducts 468, mean 0.880; passages 7, mean 0.842 |

**Narrow: yes.** The factor is **0.835**: the generator's graph way round is scaled by it, so its rating is the mesh's at the median. A test will hold it.
Applied to the bots' 1.34, V5 would read about 1.12 (inferred; it is measured again after the change).

## 6. The factor in the generator, and step 2 committed on the branch (NOT landed; with the kit, per ruling (b))

dreamzone-3 **`1eea919`** on `d665-variety-b` (after step 1 `2d72bd2`), worktree `C:\Users\nname\Desktop\worktrees\dz3-d658-b`, NOT pushed. Run under
the ordinary lock after P's landing window (`f2_*.txt`, `f3_*.txt` in my scratch `d665b\`).
- `gen/src/gen.h` `HunterModel::path_factor = 0.835`; `gen/src/graph.cpp` `detour_seconds` returns the graph's way round times it (and the capped
  lower bound too).
- **The holding test, its bar fixed before it ran:** `chase_tests` `the_generators_way_round_is_the_meshs_at_the_median`: the same six worlds, every
  uncapped Park, mesh ÷ generator; at least 100 Parks, the middle half within ±10% of the median (the registered band), and the median within **5% of
  1**. **Green:** 380 Parks (fewer: the factor keeps fewer), median **1.000**, p25 0.967, p75 1.073, min 0.845, max 2.180; unmatched 0, no mesh path 0.
- The hunter-model row: green (walk 8.960, stairs 6.272, ladder 1.500, drop 1.600 s, both sides).
- **Amended by name:** `nav` `reprieve_detours_on_the_mesh_agree_with_the_generator`, line 173: "the joined graph is no slower than the generator's
  figure" now takes the factor back out (`on_graph * path_factor <= detour_s`; it was `on_graph <= detour_s`). Its rule changed with ruling (a): the
  generator's figure is no longer a graph time. Green after (`f3_nav.txt`); its mesh-to-graph tolerance (0.70 to 1.05) is untouched (least 0.770).
- **Red on the branch, as ruled, and not amended:**
  - `gen` `no_reprieve_has_a_quick_way_round_on_the_assembled_graph` (:245 the shortcut check; :255 0 passages of 213 judged).
  - **New:** `gen` `the_default_dials_land_in_their_ranges_over_200_seeds_in_each_biome` (:104): the hotel's Parks per chunk **0.119**, its band
    0.12 to 0.32 (the apartment's 0.116 is inside 0.10 to 0.30). It was 0.150 before the factor (`s2_gen.txt`). This is ruling (b)'s "Parks must not
    vanish", measured: the kit has to green it.
- Not run: the whole suite, the bots' V5 again (that waits for the kit, since steps 2 and 3 land together).

## 7. Step 3, measured before building: in this grid only VERTICAL Parks can buy time, and ruling (b)'s price of the crossing leaves almost none

A scratch gen row (`scratch_d665_kit_shapes`, never committed; `f4_shapes.txt`, run 03:26:38Z under the ordinary lock, the code at `1eea919` plus the
row). Seeds 1 to 8, default dials, the block 60 cells square × 6 storeys, sites with their lane ends inside x and z −12 to 23. For every place a
shape fits through solid mass between two lane cells: the hunter's way round on the assembled graph × 0.835, and what the shape buys = way round − its
own crossing, the crossing priced two ways:
- **the hunter's speeds** (ruling (b)): walk 8.96 m/s, ladder 1.5 m/s per 4.8 m, a drop 1.6 s a storey;
- **the player's speeds** (`sim/params.h`): sprint 7 m/s, ladder up 2.6 m/s + 0.3 s to step off, a fall under fall gravity 37.5 m/s² (from
  jump_apex 1.2 m in 0.32 s, × 1.6), + the 0.4 s stagger past 6 m.

| shape | sites | way round, median | buys, hunter's crossing: median / 5 s+ | buys, player's crossing: median / 5 s+ / 3 s+ |
|---|---|---|---|---|
| row run (today's passage) | 99 | 2.8 s | 1.2 / 0 | 0.6 / 0 / 0 |
| column run | 131 | 2.8 s | 1.2 / 0 | 0.6 / 0 / 0 |
| turn (an L through a corner) | 661 | 1.7 s | −0.3 / 0 | −0.7 / 0 / 0 |
| duct, one storey up (today's) | 62 | 4.8 s | 1.0 / 2 | 2.3 / 6 (10%) / 26 (42%) |
| two storeys up | 28 | 8.0 s | 0.9 / 0 | 3.9 / 4 (14%) / 14 (50%) |
| duct and a run on the storey above | 65 | 6.6 s | 1.9 / 4 | 3.1 / 9 (14%) / 35 (54%) |
| **chute, one storey down** | 43 | 4.3 s | 2.0 / 6 | **3.0 / 16 (37%) / 27 (63%)** |
| **chute, two storeys down** | 12 | 5.8 s | 2.0 / 0 | **4.0 / 5 (42%) / 7 (58%)** |

What it says:
1. **A Park on one storey never pays in this grid**: 0 of 891 sites buy even 3 s, at either price. Lanes cross every band (18 m), so the way round any
   gap in the mass is under 3 s. Runs and turns can be the middle of a Park, never a Park.
2. **The vertical shapes pay, and the chute best**: a fall is nearly free for the player (0.43 s a storey), the hunter's way down by the stairs is not.
3. **Priced at the hunter's speeds, almost nothing pays** (12 of 1,101 sites, 1%), whatever the kit. Ruling (b) took the crossing at the hunter's
   speed because I proposed it so (§3b: "the way round minus its own crossing, at the hunter's real speed"). **That was my framing, and I now think it
   is wrong:** what a Park buys is the lead the PLAYER gains: the hunter's way round minus the player's own time through. The hunter never crosses it.
   Priced so, the ladder (2.6 m/s against 1.5) and the fall (0.43 s against 1.6) change everything.

**B's view (the room decides; what would change my mind follows each):**
- **(i) The crossing at the player's speeds** (above). Changes my mind: if the room wants the margin for a slow or unskilled player; then the player's
  walk speed (3 m/s) on the flat instead of the sprint, which costs the shapes with runs most.
- **(ii) The kit is vertical, with the chute first:** chute (one or two storeys down, one way), ladder up (today's duct), two storeys, a ladder and a
  run; runs and turns only as middle pieces, which add shape (V6) but not time. The length chance (0.7 to 3 pieces, then 0.35) then counts middle
  pieces of a vertical Park. Changes my mind: a measure of the room piece (a block of mass made into the lit room) that shows a horizontal Park with a
  long way round after all.
- **(iii) The row that cannot green as written:** `no_reprieve_has_a_quick_way_round_on_the_assembled_graph` asks for over 20 Parks on one storey
  (:255). By (1), a true buy rule keeps none, at any price. Its shortcut check (:245) becomes the true buy rule itself. Both would be amended by name
  WITH the kit, not before (ruling (b)).

**Registered before any kit is built (if (i) and (ii) are taken):** the kit is wrong if, built, (a) the hotel's or the apartment's Parks per chunk
stay under their dial bands at the default rate, or (b) on the bots (20 seeds × three policies) the Parks of 3 or more pieces buy a median under 4 s
(E's V4), or (c) over 50% of the Parks met are one shape (E's V6).

NEXT: librarian, rule on (i) to (iii) when this is read; B meanwhile builds the chute piece, which pays best at either price, and nothing that
depends on (i).

## 8. Step 3, the Park kit, BUILT on the rulings (i) to (iii): committed `151aead`, steps 2+3 together, NOT landed

dreamzone-3 `d665-variety-b`: `2d72bd2` (step 1) → `1eea919` (step 2) → **`151aead`** (step 3), worktree `C:\Users\nname\Desktop\worktrees\dz3-d658-b`,
NOT pushed. Every run under the ORDINARY lock, hidden, BelowNormal; outputs in my scratch `d665b\` (named below).

**What was built** (the CHANGELOG says it in words for him):
- **(i) The true buy rule at the player's fixed base movement.** `graph.cpp` `crossing_seconds` / `judge`: a Park is kept when the hunter's way
  round (graph × 0.835) less the player's way through ≥ `reprieve_min_detour_s`. The crossing reads `kBaseMove` only (base sprint 7, ladder 2.6 m/s
  + 0.3 s off, a fall under fall gravity + the 0.4 s stagger past 6 m): new `MoveReach` fields, filled in `reach_from`, **held** by `walk_tests`
  `the_base_movement_prices_a_park_as_the_controller_moves` (green, `g6_walk.txt`). Records carry `crossing_s`.
- **(ii) The vertical kit, the chute first.** A chute is a one-way fall down a junction column (new salts after every old one): mouths at its top
  and foot only, walled between, no node in its air; the top lane's mouth edge goes straight to the foot (`kEdgeChute`), a drop traversal, proved
  as a drop by the controller. **Its depth is the seed's chance curve** (0.7 while under three pieces, then 0.35, seven at most; groups of eight
  storeys with a phase per column; as deep as the column allows). A chute may go on at its foot as a **run** along the row's cut line to one mouth
  on the lane (the next piece on the same curve). **No sealed pieces**: luck and upgrades touch nothing.
  - **Red first, both:** the chute row red before its code (`c_red.txt`: 0 chutes), green after; the run row red with the run turned off
    (`c5_red.txt`: 0 runs), green after. My first attempt at the run's red did not compile (`c4_red_build.txt`) and is not counted.
  - **Turns: NOT built.** Runs are straight; a turn at the corner of the cut lines is the next middle piece.
- **(iii) With the kit, by name:** the dial row's one-storey count removed and its shortcut check made the buy rule (also: seeds 24 → 32, and a
  chute's first mouth is its top); the way-back row and the traversal count take a chute as a drop; the nav reprieve row takes seeds 33 and 34; the
  factor row counts mouths beyond the arena apart. **The seven chase rows that test a one-storey Park's hold, tell and mouth** now stand in
  `passage_arena()` (the rich arena with the minimum buy at 0), each line marked; the mechanics they test are unchanged.
- **The bot (A's `chase/bots.cpp`, a few lines):** it took every Park edge that changes height as a ladder, so it could not use a chute (the first
  bot arm entered 10 Parks, all ladders, `v_kit_measure.txt`). Now a chute is fallen as a drop. `dz-chase --parks` names each Park entered.

**Proof at `151aead`'s content** (`c5_suite.txt`, `g6_*.txt`, `v2_chase.txt`): `build.bat test` **8 of 10 suites**. `gen_tests` 37/37: Parks per chunk
apartment 0.159 (band 0.10-0.30), hotel 0.188 (0.12-0.32); 175 judged; 86 chutes, falls 47/23/13/2/1, 18 with a run. `gen_walk_tests` green; the
rare-pieces row walked 52 ramps against its bar of 50 (**64 at step 2**): thin, and every edge completed.
**Red, NOT amended, for their owners:**
- `chase` `a_sprinter_that_does_not_brake_for_corners...`: the margin row, red since step 1 (the straights hand-back, §5; the whole suite decides).
- `nav` `the_way_there_is_about_as_quick_as_the_way_back`: the worst pair **22.9%** against its 20% bound; **14.3% at step 2** (`n0_nav.txt`, the
  throwaway worktree at `1eea919`). Its mean (0.96%) and its count over 5% (101 of 2,943; 90 before) barely moved. The walker only walks, and both
  ways found complete paths. inferred: the search's inexactness on new geometry (Park cells cut out of the mesh), not a gap. The bound is the owner's.

**The kit's registered falsifier (§7), measured** (bots, 20 seeds × flee/line/juke, the streamed world, `--parks`; `v_kit2_measure.txt`):

| | registered: wrong if | measured |
|---|---|---|
| (a) Parks per chunk | under the dial bands at the default rate | apartment 0.159, hotel 0.188: **held** |
| (b) Parks of 3+ pieces, bought on bots | median under 4 s | **+5.7 s: held, but only 3 measured** |
| (c) the commonest shape met | over 50% | **43%** (ladder 1: 9; chutes of 1 to 4 storeys: 11, one with a run): **held** |

E's V-table: **V5** generator ÷ mesh median 1.18, p75 1.28 (held; the worst 1.42); **V8** survival median 39.1 s against 41.8 before D665 (held);
21 Parks entered (11 at step 2). **V4's second clause FIRES as written:** the one-piece ladder bought 3.6 s against E's 1.3 s (registered: "the
1-piece ladder buys more than before (it should not change)"). inferred cause: step 2's true rating keeps only the ducts that pay; the ladder piece
itself did not change.

**Found, not mine to fix:**
- **After a fall of three storeys or more, the run sometimes cannot place the player on the chasers' navigation:** the hunter's time reads −1 at
  entry or exit for 3 of the 21 Parks (a chute 4, a chute 3, a chute 3 with a run). inferred: the landing spot is where the player's nav location
  fails for a moment, and the hunter may lose him too. A's area; in HANDOFF's known issues.
- **The generator's base movement still has `sprint_peak_speed = 8.75`** (`gen/src/gen.h:108`); D657 (mine) raised the controller's peak to 10.
  Voids are sized so a jump at the base peak does not clear them. inferred: a 10 m/s jump may now clear one without the wall-run. Not measured;
  my own miss from D657, not touched here (outside this packet).

## Corrections, mine (step 3)

- Twice a `node -e "…"` with backticks in it ran the backticked names as shell commands: bash executed `gen/src/gen.h`, `graph.cpp` and
  `layout.cpp` as scripts, which stopped at a syntax error with no effect, and the changelog entry lost its file names (fixed by hand). Once a
  `printf` turned `\n0_nav` into a newline, and that run ran nothing.
- My first V-measure read the run's −1 ("no answer") as a lead, and its pattern missed two entry lines with a negative figure, so its pairs
  slipped: it said Parks of 3+ pieces bought −3.70 s. Re-read line by line and both fixed: +5.7 s, n 3.
- The first red for the run piece did not compile (an early return made unreachable code, a warning treated as an error); redone with the chance
  set out of reach.

NEXT: librarian, collate steps 2+3 for landing when this is read (the two red margin rows above are for their owners); B goes on to step 4, the
erosion creep, now.

## 9. Step 4, the erosion creep (item 125, "lets do 15 seconds"): what B builds, REGISTERED before any code (2026-11-12 ~05:3xZ)

**Today** (`chase/run.cpp`): a Park holds chasers out for `reprieve_hold_s` (20 s) after the player goes in, gives a tell over the last
`reprieve_tell_s` (6 s), then "opens": the hunter, guarding the far mouth, walks in along the way. Stepping out and in buys nothing.

**The creep, as B builds it** (E's section 3g and item 125; the room may correct either choice):
- **The front.** From the Park's FIRST entry, it holds whole for `reprieve_hold_s` (default 20 → **15**), then a front leaves the mouth the
  player first went in by and moves along the Park's way at **`reprieve_erode_speed`** (new dial, **3 m/s**), whether he stays or not.
- **For the player:** the Park gives out where he stands when the front reaches him. The tell (`reprieve_tell_s`, 6 s) runs over the last 6 s
  before that, and `reprieve_left_s()` is the time until then. So going deeper buys time, standing at the mouth buys the least, and stepping out
  and in buys nothing, since the front keeps its own clock.
- **For the hunter: it may enter eroded space only.** It guards the far mouth as now and walks in when the front reaches that mouth: "the
  exit erodes last". These Parks are 6 to 20 m along their way, so that is 2 to 7 s after the front leaves the entry.
- **Unchanged:** the world (the creep is the run's, never the generator's: no fingerprint moves), lesser chasers lost at the mouth, the hunter's
  speed inside.
- **The game's tell** (the red, the scream) reads the same `reprieve_tell()` / `reprieve_open()` as today, so it follows the front at his spot.
  A visible red line along the Park is NOT in this step.

**Registered before building, the creep is wrong if:**
1. on bots (20 seeds × three policies, the streamed world), any Park run straight through ends with the player caught inside it;
2. a player standing still inside a Park is not caught within `hold + (way length ÷ speed) + the hunter's walk to him` (+1 s);
3. any world fingerprint changes; or
4. the chase rows that test a Park's hold, tell and mouth cannot be stated in the creep's terms without weakening a check (their timings
   move, by name, to first entry + hold + metres along ÷ speed).

NEXT: librarian, read this when it arrives; B is building it now.

## 10. STOP NOTE at the wind-down (2026-11-12 ~05:3xZ): where D665 stands, nothing pushed, nothing landed

**Branches (dreamzone-3, worktree `C:\Users\nname\Desktop\worktrees\dz3-d658-b`, NOT pushed):**
- **`d665-variety-b` at `151aead`**: step 1 `2d72bd2`, step 2 `1eea919`, step 3 `151aead`. This is the steps 2+3 head. It is NOT yet rebased onto
  main `cab3530`.
- **`d665-creep-b` at `868c6e1`** (off `151aead`): step 4, PARTIAL. Parked on its own branch, not on `d665-variety-b`, so that steps 2+3 stay one
  head and step 4 is its own commit, as ordered. A small departure from "commit on d665-variety-b", made for that reason.

**The 23:17 checks (1)-(4) on steps 2+3: NONE done.**
- **(1) the −1 after deep falls:** investigated, NOT confirmed. Hypothesis, inferred from the code: the chase side. The streamed chase holds
  navigation for three chunk layers (six storeys) round the loaded block (`chase/streamed.h`, `nav_radius_v = 1`). A chute of 3-4 storeys reaches
  past it: its foot is off the hunter's mesh at entry, and after the fall the hunter left above is off the new window, so the path is partial
  (`Run::eta` and the entry's way round return −1). The test that would decide it is set up but NOT run: the throwaway worktree
  `C:\Users\nname\Desktop\worktrees\dz3-d665-b` sits at `151aead` with two SCRATCH edits (`chase/streamed.h` `nav_radius_v = 2`, and a worst-pair print
  in `nav/tests/path_tests.cpp`, for (2)); my scratch `d665b\w1.cmd` builds it and reruns seeds 15, 18 and 7. If the −1s go, the cause is the
  window, and per the ruling the chute is capped at 2 storeys by one dial (gen `kChuteMost` made a dial), for A after D673. The throwaway's edits are
  scratch; never commit them.
- **(2) the nav worst pair:** set up (above), not run. What is known: the row's walker profile walks only (`nav/nav.h` `kWalker`), and navigation
  drops every link with an end in a Park, so inferred: a walker's path cannot cross a chute; the print will say whether either way passes beside one.
- **(3) n ≥ 15 Parks of 3+ pieces:** not started. Note for whoever picks it up: if (1) caps chutes at 2 storeys, a 3-piece Park is only a 2-storey
  chute with a run (about 1 in 11 chutes). The bots meet about 11 chutes in 60 runs, so the measure will need `--gen-dial reprieve_rate=...` raised
  (stated as such) or several hundred runs.
- **(4) rebase onto `cab3530` + the whole suite + both selftests:** not started.

**Green / red as last measured** (§8): at `151aead`'s content `build.bat test` 8 of 10; `gen_tests` 37/37; red: `chase` sprinter-margin (A's fix
on `cab3530` turns it green, per the chair: not yet seen on this branch) and `nav` `the_way_there_is_about_as_quick_as_the_way_back` (worst pair
22.9% against 20%; 14.3% at step 2). Both selftests NOT run on steps 2+3.

**Step 4: PARTIAL, not started on the rulings of 23:18.** `868c6e1` has the hold at 15 s, the 3 m/s front from the first-entered mouth, the Park
giving out where he stands (choice 1, ruled YES), and the creep's row, seen RED against the old run (`c6_red.txt`: gave out at 20.00 s where 17.00
s was due). Its green was NOT run: the suite was stopped at the wind-down (my process tree ended whole, pid 31552, and my own stale lock removed
after checking the pid was gone). It still has the CORRECTED choice 2 (the hunter waits for the far mouth), which must go: eroded space is
ordinary for every chaser by either mouth, falsifier 2 restated, row 5 added, and the hold/tell rows and the world selftest restated by name.

**On the record from the chair, accepted:** V4's second clause fired and stands as fired. The 8.75 sprint peak is not a miss: voids are sized
from the fixed base movement by ruling, and the 10 m/s crossing is kept as a reward for speed (item 86). My §8 line calling it a miss is withdrawn.

NEXT: librarian, read this stop note when it arrives; whoever takes D665 next starts with check (1), running `d665b\w1.cmd`.
