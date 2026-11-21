# Packet G1 (pane A, on L, Sonnet 5.5): bring the laptop's game clone up to the desktop's main, build it, and say what is in it

Written by the librarian on L, 2026-11-21 05:1x, at his word of 03:46 ("do it all, why didnt you start"). The game is the
last item of tonight's queue. For the chair to dispatch to pane A, which is idle and small (cut at 10:58Z).

## What is known (checked by the librarian, 05:1x)

- The laptop's clone is `C:\Users\zackn\Downloads\dreamzone-3`, on `main` at e091beb, working tree clean.
- Its remote main is c2af9d9 (2026-11-16 11:57), 158 commits ahead (`git rev-list --count HEAD..origin/main` after a fetch).
- By their subjects, those commits are the desktop's work of 11-14 evening to 11-16 (D676, D677): the lean, the stride
  clock, the body following the look, and a new animation system, each behind a switch that is off by default. No subject
  names the hunter's root movement law (M1 of `loop/plan_new_system_2026-11-14.md`). Inferred from subjects only.
- `game/config/world.local.txt` is his play settings. Its sha256 begins e065fdad. It is never opened for writing.

## What to do, in this order

1. **Pull, fast-forward only.** If main cannot fast-forward, stop and say so; do not merge or rebase.
2. **Build**, as the repo's own instructions say, with the heavy-run check in the SAME call:
   `node C:\Consonance\lighthouse\consonance\tools\heavy-run.js --status && <the build>`. Exit 1 means run nothing and wait:
   pane B is building the app's Rust tonight. No build while `dz-world.exe` runs.
3. **The self-tests** the repo's instructions name for a fresh build. Print each suite's count. A row tagged machine-bound
   that fails here is named, not fixed. **No timing runs on L.**
4. **Say what is in it, from the tree and not from the subjects:**
   - every world setting the 158 commits added, with its default, in a table (the lean, the clock, the look, the soft
     upper body, the new animation system, and any other);
   - the ONE launch line that plays with the new animation system on, using the launch option that sets a world setting
     for one launch without writing his file (the commit subjects name it as `--world`; confirm it in the tree);
   - whether any commit builds the hunter's root movement law, M1 (`loop/packet_m1_root_law_A_2026-11-14.md` says what
     it is). Yes with the commit, or no.

## Registered before the run (print each in the hand-back)

- **R1:** main fast-forwarded to c2af9d9, or the reason it could not be.
- **R2:** the build's result, and the heavy-run line that preceded it.
- **R3:** the self-tests' counts, each failure named with its tag.
- **R4:** the settings table and the launch line.
- **R5:** `sha256sum game/config/world.local.txt` before and after; both begin e065fdad.
- **R6:** M1 built on the desktop, yes or no, with the evidence.

## Registered failure line

Failed if his play settings file changes, or a build or test is started without the heavy-run check in the same call.

## Not in this lap

Any change to the game's code. Any timing or benchmark run. Starting M1 (the librarian decides the next lap from R6).
A release.

## Standing rules

His words never go into the game's repo. Commit nothing in the game's repo in this lap. No credentials or account details
in any file or command. Hand-back as a file in `exo_memory/handback/` of the ROOM repo, rung to the librarian as a pointer,
each state claim marked checked or inferred, ending with who acts next.
