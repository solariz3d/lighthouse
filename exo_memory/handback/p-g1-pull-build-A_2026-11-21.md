# p-g1-pull-build-A: the laptop's game clone is on the desktop's main, built, 14 of 14 suites green; what the 158 commits added

Pane A, machine L, 2026-11-21 ~05:25 local, ledger L219, packet `loop/packet_g1_pull_build_A_2026-11-21.md` (blob d0c4b954, read whole). Marked checked or inferred. Game clone `C:\Users\zackn\Downloads\dreamzone-3`. No game code changed, nothing committed there, no timing run, no release.

## R1-R6
- **R1 (checked):** `git merge --ff-only origin/main` took e091beb to **c2af9d9** (158 commits); no merge or rebase; the tree is clean.
- **R2 (checked):** build rc 0, 185 of 185 steps, `dz-world.exe` linked 05:09:49. Each build or test call began with `node C:\Consonance\lighthouse\consonance\tools\heavy-run.js --status` and ran only on its exit 0; the line before every run read "EXCLUSIVE HOLD: none; slot 1: held by 12fb81f6 (B's cargo test); slot 2: free". **Two earlier attempts never ran a build** (`cmd //c build.bat` from bash: "not recognized"; then a quoting error in my own PowerShell line): neither started anything.
- **R3 (checked):** `build.bat test` (ctest, 3 at a time): **100% passed, 0 failed of 14 suites**, 849 s wall. By suite: gen_walk 107 s, nav 54, gen 53, world 18, audio 6, ragdoll 1.5, game 3.5, sim 2, model 0.5, core 0.8, yardstick 0.5, gen_drop 104, chase 391, world_app 849. ctest prints suites, not row counts inside them; no suite is machine-bound-red, so none is named. No `dz-world --selftest` run of my own beyond these (world_app_tests carries the world self-test per README:164; inferred).
- **R5 (checked):** `game/config/world.local.txt` sha256 begins **e065fdad** before the pull, after the pull, and after the tests. The file is gitignored (`.gitignore:16`) and was never opened for writing.
- **R6: NO, M1 was not built on the desktop** (checked): none of the 158 commits touches `chase/` (`git diff --name-only e091beb c2af9d9 -- chase` is empty; last `chase/` commit 0efb3e4); the old rules the M1 packet lists are still in `chase/chaser.cpp` (`speed_for_radius` :47, `corner_speed` :236, used :368); a grep for a root-law or new-root switch in chase, game and sim finds nothing. The hunter's step-1 arm change (6095216 "anim: ... the sprinter's kept for the hunter's step 2") and the staged-body commits are the new animation system, not a movement law.

## R4: world settings the 158 commits added (from `game/world/world_settings.h`, default in the tree)
| setting | default | range | what it does |
|---|---|---|---|
| `light_filter` | 3 | 0-5 | passes of the edge-aware filter over the raytraced light |
| `light_filter_kernel` | 3 | 3-5 | the filter's taps each way a pass |
| `body_lean` | 0 | 0-1 | every drawn body leans into a turn by atan(a/g), held to its grip (D676 B1) |
| `soft_upper_body` | 0 | 0-1 | the hunter's upper body from its ragdoll on the soft keyframe (L185) |
| `view_on_head` | 0 | 0-1 | camera at the drawn eye of the body (D677 B1b) |
| `body_look` | 0 | 0-1 | every drawn body follows its look: head, chest, hips (D677 B7) |
| `anim_lean_share` | 0.5 | 0-1 | the new system's turn lean as a share of Churchill's |
| `anim_lean_half_life` | 0.34 s | 0.02-2 | how slowly that lean comes and goes |
| `debug_chasers` | 0 | 0-1 | the map shows every chaser and its intended way (testing) |
| `stride_clock` | 0 | 0-1 | every drawn body's stride keeps time on the simulation tick (D677 B2) |
| `anim_idle_shift` | 0.2 | 0-0.5 | standing still, the new system's weight shift toward a foot |
| `new_animation` | 0 | 0-1 | every body the new system covers is drawn by it (N1: the legs of the runner and the hunter) |
`light_filter` defaults to 3 (on), so a fresh world.txt-less run differs from e091beb in its light; every body switch is off. (checked in the header diff; the two `light_filter*` rows are not among the subjects' animation work.)

**The launch line, new animation on, for one launch, writing no settings file** (confirmed at `game/world/main.cpp:398` `--world` -> `options.world_text`; `modes.h:32`: "never saved", read over world.txt and world.local.txt):
`build\bin\dz-world.exe --world "new_animation=1"`
and with the rest of the D676/D677 bodies: `--world "new_animation=1;body_lean=1;body_look=1;stride_clock=1"`. Not launched (no window by me).

## Where it stops
Nothing running; no dz-* process; the clone is clean at c2af9d9 and built (build\ is ignored by git; the build rewrote the old binaries in `build\bin`).

NEXT: librarian write the next game lap from R6 (M1 not built), or pane A read B's L216/L218 diffs when B rings, when you next collate
BASE: C:\Users\zackn\Downloads\dreamzone-3 c2af9d9
SOURCES: git merge/diff/log in the dreamzone-3 clone; game/world/world_settings.h; game/world/main.cpp:398; scratchpad g1/build2.txt and test.txt; heavy-run.js --status
