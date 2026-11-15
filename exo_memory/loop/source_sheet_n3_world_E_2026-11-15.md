# Source sheet for N3: the world (stairs, doorways, walls, a fall) (pane E, D677, 2026-11-15)

**What this is for.** The new animation system's third stage (N3, `loop/plan_animation_restart_2026-11-15.md:76`), step 5:
"the room over the head and beside the body is read, so it ducks under a frame and its hands meet a wall; a drop is a fall
and a landing" (:51-52). It is written in the same form as `loop/source_sheet_n2_upper_body_E_2026-11-15.md`.

**What the sheet holds.** Research only: published work or open-source code, each line with its source and whether it was
read at source. The old build appears only under "not carried over". Tier: just do it.

**"Read at source" says who opened what:**
- **reader, whole**: the room's scout read the primary whole. Its second reader's verdict follows (DOWNGRADED, WRONG,
  UNSUPPORTED) where there is one.
- **reader, abstract**: the scout read only the abstract.
- **agent, opened / snippet**: the librarian's research agent opened the page, or saw a search result only. Its reports say
  the librarian opened none of their sources. Its code "[read]" is a summarising fetch.
- **not opened**.

I re-opened no primary myself.

**Read whole:**
- `loop/animation_system_2026-11-13/scout_traversal.md` (S-trav)
- `loop/animation_system_2026-11-13/scout_ik_and_feet.md` (S-ik)
- `loop/animation_system_2026-11-13/scout_overgrowth_method.md` (S-og)
- `research/procedural_animation_techniques_open_materials_2026-11-15.md` (R-tech)
- `research/open_locomotion_data_and_numbers_2026-11-15.md` (R-data)
- `research/open_source_procedural_animation_code_census_2026-11-15.md` (R-code)

**Read in part:**
- `research/running_foot_contact_and_foot_planting_2026-11-15.md` (R-foot): :1-60, :95-140
- `loop/animation_system_2026-11-13/00_system.md` (2b)

**His words that govern N3** (as the scouts quote them; brief = `exo_memory/briefs/dreamzone2_the_game.md`):

| item | his words | where |
|---|---|---|
| 17 | "they should traverse the world without clipping on anything" | S-trav:25 (ground_his_words.md:78-81) |
| 159 | "when the charater rubs up against a wall you see their arms and hands touch up against it as you move, the character must interact with the world dynamically too" | brief:1120 |
| `player_body-5` note | "or running up against the wall sprinting you bump into it and drag against the wall the arms should move to show it." | brief:1286 |
| 155 (the brief's record, not verbatim) | "the climb uses Overgrowth's grips (procedural; no clips)" | brief:1113 |
| `movement-2` note | "Also jumping or mantling over objects" | S-trav:34 |

---

## 1. Stairs, slopes and uneven ground

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| A ray from 0.5 m above the ankle; the ankle placed on a slope by the hit's normal; the pelvis lowered by the most any ankle must drop; two-bone IK, then the ankle aimed. Foot height 0.12 m by default. Soften defaults to 1 (off), so the mechanism has no sourced "on" value | ozz-animation `sample_foot_ik.cc`, `ik_two_bone_job.h` (MIT) | S-ik:70-73, :119-132 | the room's reader, whole (code) |
| A trace from 50 cm above to 45 cm below the foot; the foot's pitch and roll from the hit's normal; the foot eased 30/s down and 15/s up, the pelvis to the LOWEST foot's offset at 10/s up and 15/s down; reset in the air | ALS-Community `ALSCharacterAnimInstance.cpp` (MIT) | S-ik:150-170 | reader, whole (code); DOWNGRADED in part: "target = hit + normal x height" is an offset; the pelvis's air return is 10 up / 15 down; the rates are frame-rate dependent |
| Overgrowth's feet: a swept sphere from 0.2 m above to 0.6 m below; a foot with memory, its lag capped at 0.1 m and eased 0.8 a 1/120 s tick; feet tilted to the normal | Overgrowth `movementobject.cpp:2540-2686, :2627-2631` (Apache-2.0) | S-ik:63-66, :74-78 | the room's reader (code); the 1/120 s tick is inferred |
| Slope warping: floor normal, maximum step height, foot size, pull the pelvis down, keep the mesh inside the capsule, with stiffness and damping throughout | Unreal Engine, Slope Warping (marked "in development") | R-tech:35 | agent, opened |
| Foot placement: a plant releases past an unplant radius and replants below a ratio of it; pelvis MaxOffset is vertical; past MaxOffsetHorizontal the planted feet first roll, then slide; lock types: unlocked, pivot round the ball, pivot round the ankle, lock rotation | Unreal Engine, Foot Placement | R-tech:36; R-foot:78 | agent, snippet only (the pages returned 403/404) |
| Ground found with heel and toe raycasts that reject steep slopes and avoid ledges; the hips' height combined from each leg's desired and maximum reach | runevision LocomotionSystem `LegAnimator.cs` (MPL-2.0); Johansen 2009 thesis | R-code:42-45; R-foot:107 | agent, fetched (summarised) |
| A leg solver with a ground plane and recovery when the heel goes through it; a tiptoe factor that blends a flat foot toward a fully bent one | rbfx `IKLegSolver.cpp` (MIT, C++) | R-code:21-22 | agent, fetched (summarised) |
| Landing points chosen at lift-off and re-checked mid-swing; a foot refused on objects, steep slopes, or near walls | The Last Guardian, Tanaka CEDEC 2017 | R-tech:83 | agent, opened |
| The pelvis's height is solved from the stance leg, never authored; out of reach, move the root the least distance and prefer heel lift or a small leg stretch to a pelvis drop | Kovar, Schreiner & Gleicher 2002; Johansen 2009 | R-foot:100-103 | the agent's synthesis of sources it opened |
| Stairs: peak knee flexion about 90 to 92 deg | Riener 2002; Protopapadaki 2007 (via a secondary table) | R-data:94 | agent, opened a secondary table with unclear headers |
| Stair and ramp data: Camargo 2021, 22 adults, stairs and ramps up and down and the transitions, CC BY 4.0; Reznick 2021, stairs at 20, 25, 30 and 35 deg (data licence unconfirmed) | Camargo et al. 2021; Reznick et al. 2021 | R-data:18, :28-29 | agent, opened |

**Not on file:**
- **A rule for stairs that is more than ground rays.** The census found no procedural stair module, only general ground
  raycasts (R-code:98).
- **The stance share on a stair, or where on the tread the foot lands** (R-data:94).
- **Any data for uneven ground** (R-data:30).
- **A source for "stand the foot on the higher of two probes" on a stair.** That rule is ours, and so are its predictions:
  the toe kept out of a riser, the heel hanging over a nosing (S-ik:192-198, second reader).
- **How Holden's foot lock behaves on a stair.** It is evidence for the lock's edges only: its floor is the plane y = 0,
  with no ground query, slope, stair or pelvis move (S-ik:145-147).
- **Whether feet with memory and "never more than 1 cm into the floor" can both hold on a riser.** By design the memory
  leaves the foot up to 0.083 m short of a 0.18 m step (S-ik:214-217).

## 2. Doorways and the room over the head

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| Lower the head and the body when the ceiling sensors trigger; the neck's rotation axis set as far forward on the head as possible | The Last Guardian, Tanaka CEDEC 2017 | R-tech:51 | agent, opened |
| A spine bent along the path's curve, with a bend limit the path-finder respects | The Last Guardian | R-tech:83 | agent, opened |
| Keep the mesh inside the capsule | Unreal, Slope Warping | R-tech:35 | agent, opened |

**Not on file:**
- **Any measured human duck:** how far the head, trunk and knees go under a low frame, or when the duck starts.
- **A source for the parked duck** (E's head room, never built).

## 3. Walls: hands and arms against them

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| Hands constrained like feet; the root projected into the intersection of four spheres | Kovar et al. 2002, section 6 | R-tech:67 | agent, opened |
| Reach targets stored relative to the rest pose and a target: ground-relative (0 = rest height, 1 = the ground) or secondary-relative (0 = rest, 1 = the target); particle IK, 5 outer iterations, limbs compress to 10% and stretch 10-120% | Spore, Hecker et al. 2008 | R-tech:68 | agent, opened |
| Hand and foot IK targets from raycasts off the bones; the nearest handle point by ledge raycasts; braced or free hang chosen by foot raycasts against the wall | Dynamic-Parkour-System `ClimbController.cs` (MIT per its LICENSE) | R-code:69 | agent, fetched (summarised) |
| Feet and aim IK, procedural ledge climbing without annotations, vault and free hang | Traverser (MIT) | R-code:70 | README only |
| Hands meet walls by contact in a physics world that holds the level's static shapes | Jolt (MIT); see the N5 sheet | `loop/source_sheet_n5_physics_E_2026-11-15.md` | — |

**Not on file:**
- **A measured study of hands meeting a wall,** or of a body dragging along a wall at a sprint (his `player_body-5` note).
- **A source for hands on a door frame or jamb.**

## 4. A fall, a drop and a landing

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| Landing knee flexion by drop height, 20 males stepping off boxes, hands over the abdomen. 22 cm: soft 75.49, natural 51.31, stiff 45.17 deg. 44 cm: soft 87.71, natural 67.26, stiff 59.17 deg. Slope of the natural curve 72.5 deg per metre | Verniba, Vescovi, Hood & Gage 2017, Sports Med Open (CC BY 4.0), Table 2 | S-trav:182-188, :276 | reader, whole; DOWNGRADED for a cap: 87.7 is the SOFT value at 44 cm; no source lands from above 1.03 m, and a storey is 3.5 m |
| Step-offs from 0.32, 0.62 and 1.03 m: knee work 1.21 / 1.63 / 2.26 J/kg, hip 0.94 / 1.31 / 2.15; "a shift from ankle to hip strategy" as height rises | Zhang, Bates & Dufek 2000 | S-trav:189-191 | abstract; work ratios, not angle ratios |
| Parkour landings from 0.75 m: peak force precision 3.2, roll 2.9, traditional 5.2 body weights; time to peak 0.077, 0.080 and 0.044 s; the roll is used "when landing from height (especially when higher than the individual's height)" | Puddle & Maulder 2013, J Sports Sci Med (copyright, numbers only) | S-trav:192-196 | reader, whole; DOWNGRADED: time to peak force is not time to the lowest hip |
| The return to standing: a crouch weight on an underdamped spring (omega^2 120 s^-2, decay 13.98 s^-1, zeta 0.638), kicked at the landing; it settles within 2% by 0.58 s with about 7% past standing | Overgrowth `aschar.as:8429-8431, :9225-9232` (Apache-2.0) | S-og:90-92; S-trav:147-150 | reader, whole; the full crouch only when the landing's velocity into the ground passes 0.3 (:8401); the 7% rise is drawn only if closed data sets Overshoot |
| In the air, the pose follows the vertical speed, not time: an up coordinate from velocity.y over the jump's speed | Overgrowth `aircontrols.as:120-141` | S-og:79 | reader, whole (code) |
| In the air, the whole pose shifted back to the centre of mass | Overgrowth `aschar.as:14513-14523` | S-og:78 | reader, whole (code) |
| In flight the pelvis rises ballistically, about 1.0 to 1.8 cm for 92 to 122 ms of flight | from Patoz et al. 2022's flight times | R-foot:104 | inferred by the agent |
| Drop-jump data with centre-of-mass motion: AddBiomechanics 1.0, CC BY 4.0 core, 273 subjects; GroundLink, full-body mocap with forces (licence unstated) | AddBiomechanics; Han et al. 2023 | R-data:33-34 | agent, opened |

**Not on file:**
- **Landing angles from above 1.03 m,** or any running landing (S-trav:438-440).
- **When the knee is lowest after touchdown.**
- **A pose for a stagger,** which the simulation makes above 6 m (S-trav:113).
- **An open dataset of vaulting or parkour** (R-data:35).
- **Any source for bracing the arms on a chute's walls during a fall** (S-trav:430-431).

## 5. Climbing, ledges and ladders

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| One timer per body cycles 0 to 1. Left hand moves in [0, 0.4], right hand in [0.5, 0.9]; left foot in [0.1, 0.5], right foot in [0.6, 1.0]. Arcs are 0.1 x distance x sin(pi p). A held limb weighs 1 and a moving one (1 - sin(pi p))^2; the trunk sits at the weighted mean of the grips | Overgrowth `ledgegrab.as:85-95, :109-112, :139-145` (Apache-2.0) | S-trav:120-126, :248-250 | reader, whole; a sideways SHIMMY, pairing each hand with its same-side foot; :244-245 add the feet's arcs to the hands (a slip in the source: do not copy it) |
| The cycle rate is clamp(3 x horizontal speed, 1, 3) a second; a grip's target leads the body by its velocity x 0.1 s | Overgrowth `ledgegrab.as:62-67, :164-171` | S-trav:127-128 | reader, whole |
| A grab sound where a hand lands after moving more than 0.1 m; the grab's impact scaled by the speed into the ledge | Overgrowth `ledgegrab.as:73-79, :796-806` | S-trav:129-131 | reader, whole |
| The grab blends the whole body from where it was at 10 / (height + 0.05) per second | Overgrowth `ledgegrab.as:785-787, :850-853` | S-trav:132-137 | reader, whole; DOWNGRADED: a whole-body blend for a hang, not a per-hand reach |
| The grip sits 0.10 m below where a 0.05 m sphere swept down and in touches the ledge; the hands' change is low-passed 0.8 a frame | Overgrowth `ledgegrab.as:198-206, :229-235` | S-trav:142-144 | reader, whole (corrected: 0.10 m live, 0.15 m remembered) |
| Holds are typed: load-bearing (a foothold), pendent (a handhold), hybrid; a limb's motion is keyed only where its own grasp changes, which gives anticipation | Kalisiak & van de Panne 2001 (author's copy) | S-trav:159-178 | reader, whole; DOWNGRADED: it says nothing on FINDING holds |
| Warp points: landmarks marked in a clip are matched to points placed in the world, with translation, rotation and facing warped on their own timing; one clip evaluated | Bollo 2017, Gears of War 4 | R-tech:65 | agent, opened |
| Named warp targets with notify windows, skew warp and rotation types | Unreal Engine, Motion Warping | R-tech:66 | agent, opened |
| Long-standing hand and foot IK in climbing, with a procedural layer for jumps and landings | Assassin's Creed | R-tech:69 | not opened (search snippet) |

**Not on file:**
- **Any ladder-climbing gait study.** The limb windows are Overgrowth's shimmy alone. Today's ladder pairs hands
  diagonally, and the swap to same-side has no source (S-trav:244-247, :438-439).
- **Rungs.** The generator's ladder is one flat board with none, so a hand on a "rung" holds a virtual line (S-ik:241-242).
- **An open-source Godot climbing system** (R-code:99).

## 6. What the simulation gives the picture (read only; not research, not the old build)

The new system reads these and must agree with them. They are the simulation's, at dreamzone-3 main `31d1c6d` (S-trav:66-99).
- **Ledge finder:** a blade sweep, a ray down for the top (normal y >= 0.7) and a ray under it for the face; the result is
  used and dropped.
- **Moves:** mantle 0.35 s (reach 2.2 m); vault up to 1.1 m in 0.2 s; stagger above a 6 m fall, a roll if crouch is
  pressed within 0.15 s.
- **Gravity:** rise 23.4 m/s^2, fall 37.5.
- **Ladders:** 2.6 m/s up, 3.4 down; the ladder is one flat board 0.5 m wide.
- **Chaser links:** ladder 2.0 m/s after a 0.8 s mount; a drop on y = t^2 over 0.9 s whatever its height, then 0.7 s of
  recover; climb 1.4 s; every link starts at speed 0.
- **Doorways:** 0.9 x 2.05 m; no door opens.
- **Stairs:** risers 0.175 m, treads 0.28 m; spiral risers 0.219 m (S-ik:231).

## 7. Not carried over (the old build)

- The hunter's floor block (S-ik:38-40): each ankle moved by the probe's offset clamped to +-0.45 m, the hips sunk up to
  0.30 m, the legs re-reached.
- The player's climb grip guessed at the eye + 0.12 m (S-trav:37-39).
- The ladder hands that ride the neck on a phase (S-trav:79-81).
- `HandOverride`, which nothing calls (S-trav:40).
- The feet-with-memory branch (55d1451) and L205's stance plant: the ideas are Overgrowth's and are above; the branches
  are not carried.
- The parked doorway duck that bent `gait_pose` (`e5-head-room-parked-e`).
