# Dreamzone 3, handoff 2026-11-11 (D, ~23:3x local), for the laptop. Librarian, at the keeper's word

His word, 23:20: "get ready to stop and write the handoffs for dreamzone3 and lighthouse, i dont think we did trackbuilder".

**Read first:** `librarian/2026-11-11.md` from "## 08:38" on (the day on D, entry by entry);
`briefs/dreamzone2_the_game.md` items 64-126 (his words verbatim, all of today); E's sweep, which ranks every gap:
`handback/p-d669-sweep-E_2026-11-11.md`, section "FINAL" (:238).

## Where the code is
- **dreamzone-3 main `cab3530` = origin** (pushed 04:54Z by P; ctest 11/11, gym 26/26, world 52/52, under the exclusive hold).
- **On L, before building:** `git pull`, then `git submodule update --init --recursive` (cgltf v1.15 was added), and **Git LFS must
  be installed** (`git lfs install`, then `git lfs pull`): the kid's and the hunter's models are LFS files in `content/models/*.glb`.
  Without LFS the loader reads pointer files.
- Unlanded branches (pushed for L only if the stop notes below say so):
  - `d665-variety-b` (B): the Park kit, steps 2+3 at `151aead`, plus step 4 if started. STOP NOTE: _to fill when B rings_.
  - `d673-chase` (A): **the interface is committed, `db8e557`** on cab3530 (`run_length_s` with 0 = no timer, `overtime()`,
    `overtime_seconds()`, `saved()`, `kept_score()`, `Kind::Dark`, `Phase::Overtime`). Behaviour unchanged: chase 54/54, world_app
    40/40, world selftest 52/52, fingerprints = main. A's hand-back §1: `p-d673-chase-A_2026-11-11.md` (lighthouse branch d664-a,
    3d059897). **Not in it yet (checked, `git grep` on db8e557): `PlayParams::run_length_s`** in `chase/play.h`, which the plan's
    amendment asks for (C's save rows and A's F1-F3 go through `play_streamed`). The overtime chase itself is not built.
  - `d673-frame` (C, `7f6385f` at 23:12): the half that needs nothing from the chase. Rebases onto `db8e557`. **Stopped clean at `7f6385f`**,
    world_app_tests 43/43, not rebased yet. The A-dependent half (the endings, kept points, the timer notice, `won`, three rows) is
    written and kept in the evidence folder of C's stop note, `handback/p-d673-frame-C_2026-11-12.md` (lighthouse b5ae1003).

## Landed on D today (each with its hand-back in `exo_memory/handback/`)
- **D651:** render noise (the hand light no longer lights the body), the stair fix, the map removed (his "remove map").
- **D657:** the sprint peaks at 10 m/s after holding it (his item 81); chasers' reference speed 7 → 8.
- **D656:** the look (three steps, worst frame under 2 ms of 2.78) and the sound (a reverb by room size).
- **D658:** the biomes. The school and the hospital are built; the floor bug is fixed; doors 0.30 → 0.25; `start_biome` in
  `world.local.txt` (1 apartment, 2 hotel, 6 school, 8 hospital) lets him start in one.
- **D660:** surfaces and textures at 256.
- **D663:** the model loader (the kid and the hunter in game); the heavy-run **exclusive hold** for timing sessions (lighthouse tool).
- **D664:** organic pursuit (his item 88: chasers no longer snap to a straight line after a corner; dead stops 47-51 → 0).
- **D671:** the void bug from his run (floor inside a void's kill box: 34 of 58 → 0).
- **D672:** first-person fixes (head tilt, neckline).
- **D665 step 1:** shorter, jogging straights in the hotel, school and hospital (his item 91, "too repetitive").

## In motion when we stopped
- **D673, the run's frame** (`loop/plan_d673_run_frame_2026-11-11.md`, with its amendment at the end): a timer (600 s), overtime
  where the dark one comes and always catches you, the Absolute's save (points kept, overtime bonus ×5), a catch before the timer loses
  everything. Falsifiers F1-F5 and C1-C3 registered. The librarian's rulings his to veto: a void in overtime is a save; a Park does not
  hold the dark one; no countdown on screen.
- **D665 steps 2+3, the Park kit (chutes):** built, NOT landed. Four checks first (`librarian/2026-11-11.md`, 23:1x): (1) BLOCKER, the
  hunter loses the player after falls of 3+ storeys; (2) the 22.9% nav pair against chutes being one-way; (3) widen falsifier (b) past
  n = 3; (4) rebase onto cab3530.
- **D665 step 4, the erosion creep** (item 125, 15 s): registered (B's §9). Ruled: eroded Park space is ordinary space for every
  chaser (item 55).

## From the last handoff (`loop/handoff_dreamzone3_2026-11-11-L.md`, PICK UP HERE)
1. Clone on D, build, shortcuts: **done** (D651 part 0; D's shortcuts open dreamzone-3).
2. Read the design map and fold in items 54-63: **read; the fold-in into `briefs/dreamzone3_design.md` is carried** (the brief itself
   holds 54-126 verbatim).
3. His open calls: **contradictions done** (28 vs 30: item 66; currency: item 67). Pool rooms and chaos as biomes: **carried**. E's six
   movement questions and the six abilities (gap 2): **carried**, not put to him today (the day went to feel, then fundamentals).
4. A's stair fix against the levers: **done** (D651 part 2).
5. C's render part 2: **done in part** (D651 part 1: the hand light; motion vectors and the TAA term **carried**).
6. Next builds (containers, XP, stress): **carried**, behind the run's frame by his item 122 ("back to fundamentals").

## His open calls (put to him; not answered)
- **The softer chase** (since D664: flee never caught 52 → 62 of 96). The librarian recommends restoring catch power with a dial,
  measured. With it, **the cutback question** (a cutback runner is caught sooner, 41.0 → 34.6 s).
- The guitar pick: (a) double the inner Recognition chance (librarian's lean) or (b) golden phase +60 s (item 121).
- The kid's default outfit (redesign 2: 1 low and wide, 2 zipped up, 3 open flannel), and E's three wardrobe calls.
- **The dark one's name** (Echo, Hollow, Remainder, Undertow, or his own). Player-facing text waits on it.
- Which sounds to replace first ("the sounds themselves need work").
- Doors: the guaranteed two per room are most of them (`gen` layout.cpp:483-486) if 0.25 still feels like too many.

## PICK UP HERE (L)
1. **Update L's clone** (pull, submodules, Git LFS; above), `build.bat`, `build.bat test`, both self-tests.
2. **Fill in or read the three stop notes** (B, A, C) in this file, then finish B's four checks and land steps 2+3 (P, full suite
   under the exclusive hold).
3. **D673:** A's interface commit first (with `PlayParams::run_length_s`, the amendment), C rebases, both finish, then land.
4. **Put his open calls above to him**, the softer chase first.
5. **D665 step 4** (the erosion creep) on its own commit after 2+3 land.
6. **Then the sweep's rank 2 onward** (E's FINAL, :238): the chase pressure, then the meta loop.

NEXT: L's librarian opens this file's "From the last handoff" and its PICK UP HERE first when Consonance next wakes on L
