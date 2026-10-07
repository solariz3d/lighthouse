# D261 step 1: grip per piece, the research · pane E, on D, 2026-10-06 ~18:5x–20:1x · STATE: PARTIAL (stopped for the BIOS flash)

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

## (c) The sensible FRICTION range for a T-180
**NOT MEASURED YET.** The survey script is written: scratch `grip/survey.js`, read-only.
- It covers every installed track's `surfaces.ini`: 127 files under 70 track folders (counted with `find … -iname surfaces.ini`, `ls | wc -l`).
- It counts keys, FRICTION values (all, ROAD-keyed, valid-track), keys that are a prefix of another key on the same track, and every CSP `MESHES=` line.
- It never names the friend's private track.
- **It was queued behind the librarian's harness lock and never ran:** the session ended, and then the flash stop came.

## The key scheme this points to (proposal, pending (c) and the survey's prefix count)
- **The default stays AC's `ROAD`,** so a track with every piece at 100% exports byte-identically (fixtures 0 of 9 by construction).
- **A non-default grip gets a FIXED-WIDTH key**, e.g. `GRIP070`, `GRIP125` (the percentage in 3 digits).
  - Two such keys can never contain each other, and none contains `ROAD`, `KERB`, `GRASS`, `SAND` or `WALL`.
  - Its meshes are `1GRIP070_…`, with nothing after the key that spells another key.
  - Its surface is FRICTION = percentage / 100, otherwise a copy of ROAD's lines.
- **The soft-collision block lists `1ROAD?, 1GRIP?`** when any grip key is used.

## Next, when resumed
1. Run `grip/survey.js` under the lock: the counted FRICTION range, and how many real tracks have a key inside another key and still load.
2. Then write (c) with numbers, and the core (step 2).
