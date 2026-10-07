# D261 step 1: grip per piece, the research · pane E, on D, 2026-10-06 ~18:5x–21:2x · STATE: DONE (a, b, c answered; the scheme confirmed)

Plan: `exo_memory/loop/plan_t180_piece_grip_2026-10-06.md`. Read only; nothing was written to the AC folder.

## (a) How AC reads the surface KEY from a physics mesh name
- **Sourced:** a physics mesh is named `<number><KEY>…`, and the number must be above 0: `1ROAD08`, `2ROAD08`, `1GRASS_2`.
  - Source: assettocorsamods.net, "Proper Key for Surface.ini", https://assettocorsamods.net/threads/proper-key-for-surface-ini.3757/
  - Same rule: the community "surfaces ini" page, https://www.sites.google.com/site/hagn99/assettocorsa/modding/tracks/data/surfaces-ini ("KEY: name of the surface. Objects use surfaces by this name").
- **What follows the key is free text** (underscores, digits, letters: `1TRANS_L_HWY_(GREY_LIGHT)`, `1MAIN_ROAD_BRIDGE_SUB0`). Same thread.
- **WARNING, the decisive one** (same thread, quoting AC's own complaint): *"surface 1MAIN_ROAD_BRIDGE_SUB0 CAN BE : MAIN or ROAD … AC might be treating those the same as ROAD, its first found surface"*.
  - **inferred:** AC tests every key against the name, not only the text straight after the digits, and an ambiguous name takes the first key found. So:
    - a grip key must not occur inside any other key;
    - a grip key must not occur inside any mesh name that is meant to be another surface;
    - and vice versa: no `ROAD` inside a grip mesh's name.
  - **NOT YET CHECKED against the installed tracks** (the survey below did not run).
- **AC's own defaults** (`<AC>/system/data/surfaces.ini`, read in full): ROAD `FRICTION=1` `IS_VALID_TRACK=1`; GRASS 0.6 (invalid); KERB 0.92 (valid); SAND 0.8 (invalid).
  - **So "100% grip" = AC's ROAD = FRICTION 1.0.**

## (b) CSP's soft collision: does `MESHES=1ROAD?` need the new keys, and what does `?` match
- **Sourced:** CSP's `[COLLISION_PARAMS_…]` takes `MESHES = …`, "Names of meshes to get new parameters"; the example is `MESHES = ?WALL?`. `FRICTION` there is "contact friction" (collision with walls and objects, NOT tyre grip).
  - Source: https://cup.acstuff.club/docs/csp/tracks/collision-parameters
- **Sourced:** in CSP's filters, `?` matches "any symbols in any quantity" (Windows' `*`, kept as `?` for compatibility). `mesh?` also takes `mesh_99` (every name STARTING with `mesh`); `?keyword?` matches a substring; a list is comma-separated (`mesh0, mesh1, mesh2`).
  - Source: https://cup.acstuff.club/docs/csp/general/filtering
- **So:** `MESHES=1ROAD?` covers only names starting with `1ROAD`. A grip mesh named `1GRIP070_…` is NOT covered.
  - The block must list each key, or one prefix for all of them: e.g. `MESHES=1ROAD?, 1GRIP?` (inferred from the two pages; not yet tried in AC).

## (c) The sensible FRICTION range for a T-180 — MEASURED (after the flash, 2026-10-06 ~21:1x)
**The run:** scratch `grip/survey.js` (read-only) over every installed `surfaces.ini`, under the heavy-run lock. Output: `grip/survey.json`.
- 127 files, 70 track folders, **753 surfaces**.
- The friend's private track is counted but never named.
- The run took over a stale lock left by the librarian's harness, whose process was no longer running.

**Every surface:** FRICTION min 0.6, p10 0.72, **p50 0.96**, p90 1.0, max 1.1 (n 753).

**Valid-track surfaces** (`IS_VALID_TRACK=1`, what a car is meant to drive): min 0.6, p10 0.82, p50 0.96, p90 1.0, max 1.1 (n 512).

**Surfaces keyed exactly `ROAD`:** n 54, from **0.75 to 1.01**; values 0.75, 0.82, 0.9, 0.96, 0.97, 0.975, 0.98, 0.99, 1, 1.01.
- **47 of the 54 are NOT AC's default 1.0:** track makers tune the road below it.

**Above 1.0, 12 surfaces:**
- 1.01: Fujioka, Kunos's `ks_drag` START ×5, lilski Watkins Glen;
- **1.1: `ohyeah2389_nordic` SLOW**, a T-180 track.

**The 29 track folders with a CSP collision block** (the T-180 and soft-collision tracks: centrifuge, sakura_speedway, serpents_spiral, rainbow_rd, hazenloop, the keeper's t180b_* exports, …):
- road-ish keys use **0.75, 0.82, 0.9, 0.99 and 1** (26 surfaces).
- **So a T-180 range seen in the wild: 0.75 to 1.1.**

**Proposal (the keeper decides):**
- grip as a percentage of AC's road, **default 100% = 1.0**;
- the field allows **50% to 150%**;
- the words say plainly that **outside 60–110%** nothing installed has been measured, so it is "untested: drive it".
- The checker's limits do not change (the plan): the Mach 6's measured grip is what the checker assumes.

## The survey's checks on (a) and (b)
- **(b) is confirmed in the wild:** the 43 CSP `MESHES=` lines are `1ROAD?`, `1ROAD?, 1FLOOR?`, `1ROAD?, 1SLOW?`, and one long list.
  - T-180 tracks that add a surface **list it beside `1ROAD?`, comma-separated**: the nordic track's 1.1 SLOW surface is covered as `1SLOW?`.
- **(a), one correction to my inference:** keys INSIDE other keys exist on real tracks, and they load:
  - `PIT` / `PITLANE` (battenbergring, a prefix);
  - Kunos's own `ks_silverstone/international`: `OUT` inside `CONCOUT`.
  - So AC does not refuse a key contained in another. The forum's complaint ("CAN BE : MAIN or ROAD") is about a mesh NAME that holds a second key AFTER its own (`1MAIN_ROAD_…`).
  - **inferred:** AC reads the key just after the digits and complains when the rest of the name spells another key. Not tested in AC.
  - **Either way the scheme below is safe:** a fixed-width key is never inside another, and the mesh names after it carry no key word.

## The key scheme: CONFIRMED by the survey (2026-10-06 ~21:1x), unchanged
- **The default stays AC's `ROAD`,** so a track with every piece at 100% exports byte-identically (fixtures 0 of 9 by construction).
- **A non-default grip gets a FIXED-WIDTH key**, e.g. `GRIP070`, `GRIP125` (the percentage in 3 digits).
  - Two such keys can never contain each other, and none contains `ROAD`, `KERB`, `GRASS`, `SAND` or `WALL`.
  - Its meshes are `1GRIP070_…`, with nothing after the key that spells another key.
  - Its surface is FRICTION = percentage / 100, otherwise a copy of ROAD's lines.
- **The soft-collision block lists `1ROAD?, 1GRIP?`** when any grip key is used.

- **One more rule from the survey:** 100% writes no grip key at all; only a piece whose grip is not 100 gets `GRIPnnn`, with nnn from 050 to 150. So `GRIP100` never exists, and a default track carries no new surface.

## Next
- **Step 2, the core:** a per-piece grip, stored on the piece; default 100.
- **The export part waits for C's D260**, as the plan says.
- **The keeper decides the field's range.** Proposed: 50–150%, with "untested" words outside 60–110%.
