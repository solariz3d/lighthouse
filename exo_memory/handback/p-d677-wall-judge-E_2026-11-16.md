# Hand-back: the judge of the drawn body meeting the world, RED on main (pane E, machine D, D677)

His catch, 02:30 (game brief item 249): "sidestep, the arm clips into the wall and chaacters mesh doesnt get affected by wall or prop
geometry. Like are you even looking at the examples u make lmfao".
- **True, and mine to own.** Before ringing the film of main I looked at one station's frame (backwards), not at the sidestep.
- **From here every station is looked at before I ring.**

The chair's order of 08:30Z. Tier: prove it (it is a judge).

## The branch

dreamzone-3 **`e9-clearance-e`** at `0fcadf1a35e4c95ae013907fd7141ef462fcd1fa`, pushed (scan 0, gate allow), on main `c38d90a`:
- `614198e` RED FIRST: the probe's rows against a stub returning 0 (4 tests, 2 failed).
- `0fcadf1` the probe, the judge, the flag, the CHANGELOG entry.

## The probe: `sim::World::body_part_depth(a, b, radius, &point, &normal)`

- **A const query:** it moves nothing and is not part of the fingerprint, like `raycast`.
- **What it returns:** the deepest of two things:
  - a capsule (the bone with its radius) collided against every surface, back faces too;
  - each point of the bone every 2 cm that lies inside a solid (four or more of six axis rays meet a back face first), by its
    distance to the nearest face plus the radius.
- **Why both:** a part wholly inside a thick wall touches no face.
- **Rows** (`sim/tests/collision_tests.cpp`), 6 of 6 green:
  - a part in the open reaches into nothing;
  - resting on the floor, under 1 mm;
  - through a wall's face, by its tip and radius (0.10);
  - wholly inside a 2 m block (1.03);
  - centre short of the face, by its radius past it (0.02);
  - behind a one-sided sheet (> 0.01).
- **Whole sim_tests:** 159 tests, 0 failed (before the last two rows were added; those rows pass).
- **A correction:** the thick-wall row was written expecting 0.93 and amended by name to 1.03. Its deepest point is its middle,
  1.0 m from both faces; I had taken its ends. The probe read 1.030.
- **Mutants of `part_depth`:** applied 5 / caught 4 / NOT APPLIED 0.
  - **Survived:** the capsule ignoring back faces. No case I could build shows a difference: closed boxes are covered by the
    inside test, and a part crossing an open sheet is met on the sheet's front side.

## The judge: `dz-world --course-clearance`

- **What it runs:** the set course with no picture, the new system on (exit 2 if `world.txt` has it off). Both bodies, as the
  stage poses them: the runner by `drawn_player_pose()`; the hunter staged by `anim_stage` and read back by `anim_chaser_pose`.
- **The bones:** 19, each with a radius that is ours (a slim limb, so the judge errs toward passing). Listed in `course_film.cpp`
  `kBones`.
- **The bar:** IN = 5 mm or more past a wall's, a prop's or a ceiling's face (PhysDiff's penetrate bar, as
  `loop/animation_system_2026-11-13/scout_evaluation.md:143` proposed it). A floor (face normal pointing up) is counted and
  printed, not failed; it is the planted-foot row's.
- **What it prints:** per station and body, each bone that went in: frames, first and last frame, deepest depth, place and face.
  It exits 1 when any part is in.
- **The course:** the stations are now built once (`course_stations`), so the judge reads the film's own course.

## RED on today's main (c38d90a; a copy of its config with new_animation = 1)

`course-clearance: RED: 8 of 12 station-bodies have a part in a wall, a prop or a ceiling`. The whole print is
`p-d677-wall-judge-E_2026-11-16_red-on-main.txt`, beside this file.

| station | the runner | the hunter |
|---|---|---|
| straight and turn | clear (near a wall on 676 of 907 frames) | clear |
| sidestep | **IN on 154 of 317 frames:** right hand and forearm on 95-99 frames (71-176), 0.130 / 0.134 m; left forearm and hand on 50 (267-316), 0.111 / 0.130 m | **IN on 243 of 317:** right hand on 163 frames (0-180), 0.130 m; right upper arm 0.196 m; left upper arm 0.162 m |
| backwards | clear | IN on 66: right hand on 66 frames (0-65), 0.056 m |
| stop and start | IN on 63: right arm on 48-57 frames (522-604), hand 0.111 m | IN on 198: right arm on 143-175 frames, upper arm 0.199 m |
| stair | IN on 49: feet into the risers on 17-22 frames, 0.168 / 0.114 m | IN on 79: head into a ceiling on 16 frames (222-237), 0.070 m; left arm 0.062 m; feet into risers |
| doorway | clear | IN on 40: **head into the wall over the doorway on 35 frames (198-360), 0.177 m**; right arm 0.083 m |

- **Checked against the picture:** main's film, `sidestep\runner_0154.png` (Z:): the runner's right arm goes into the left wall,
  where the judge puts the right hand 0.130 m in.
- **Not looked at for every row:** the stair's risers and the backwards hand. They are judged by the probe; the risers and the
  head in the doorway's wall are for the body-meets-world work to read first.

## Next

The order of 08:40Z moves the fix to me: an arm near a wall bends away or a hand rests on it, sourced from my N3 sheet's walls
section, the lessons sheet and Kovar's hand constraints. This judge is its bar: red today, green after.
