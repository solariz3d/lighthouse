# Packet L210 (pane A, on L): the hunter's grip law onto main behind its dials, and a play he can switch

Written by the librarian on L, 2026-11-14 05:5x, at his word. For the chair to dispatch to pane A. One pane, one lap.

## His words this lap serves (verbatim; the full entries are game brief items 220 and 221)

- 04:45: "its physics still look unrealistic with how it does sharp turns, the body should orient itself where it is trying go,
  like a bird or a space ship banking into a turn or something, like say when the hunter sprints past a hallway the runner
  turned into, it like loses all speed, repoints itself then goes, instead of like flowing through it still"
- 04:47: "we had these plans for a proc animation system but continued to build off of what we had instead of restarting with the
  research i swear."
- 05:36: "sounds good, so where were we with the proc system for animation physics etc"
- 05:48, to the plan put to him (A lands the grip law behind its switch and merges its run-record branch; then C builds the
  lean): "go"

## What to do, in this order

1. **Your `a-gen-record` (b311709, 11 ahead of main c205622).** Merge it against O's run frame 7500a26. B's trial merge found
   the conflicts: `game/world/run_record.cpp` at line 279, `game/tests/run_record_tests.cpp` at lines 469, 536 and 548, and
   `CHANGELOG.md` (`handback/p-l209-a-landings-B_2026-11-14.md:46-54`, on branch `l209-a-landings`). Your code, your merge. Land it
   by the train.
2. **Your L182 grip law (`origin/l182-lines` c357bbd) onto main behind its dials, every dial off by default.** This is lap L4 of
   the animation path of record (`loop/path_of_record_animation_2026-11-13.md:38`, `:87`, `:99`). Land it by the train.
3. **A play he can switch.** In the hand-back, the exact lines or arguments that turn on, for one play, each of four things:
   the grip law at grip 1.0, 1.3 and 2.0 (`turn_law`, `grip_mu`); sideways carry (`slip_rate`); the corner floor
   (`corner_floor_speed`); aiming ahead (`lead_range`). Say for each, in plain words, what a player should see, and its known
   fault. **Do not edit `game/config/world.local.txt`; it is his.** If a chase dial cannot be set for a play without his file,
   say so and name the smallest way; do not build it without a ring.
4. **The room repo, at your hand-back:** merge `origin/l209-a-landings` (B's hand-back, edc2a0e2) into the room's main and push
   main by its literal name with your own hand-back.

## What the room holds (prior art, with paths)

- **Your own L182 hand-back:** `handback/p-l182-lines-A_2026-11-12.md`. Its byte-identical check with the dials off (12 seeds,
  one md5) is at `:20-24`. Its registered arms g13, g16, g20 at brutal were not run (`:8`, `:81`). At NORMAL the law alone
  roughly halves wall hits and raises never-caught by 14.7 to 18.0 points (`:44`, `:52`). Those four numbers are from one
  reader's pass (`loop/physics_first_body_read_2026-11-14.md:173-175`), not opened by me.
- **The branch against main, my run tonight:** merge base 84ad3b30; the branch is 27 commits ahead of it (24 files, +2563 -40);
  main was 130 ahead of it at 99b6045 and is one more at c205622. The branch's tip is titled "L182 WIP" and holds merges of
  `l170-chase` and `l180-lap2`. Which of the 27 are already on main under other shas is yours to say. The reader counted 3
  commits and +251 lines in 7 chase files; the units differ.
- **What moved under it:** c205622 (your own `a-d673-close`) touched `chase/dials.h`, `chase/run.cpp` and `chase/run.h`.
- **Opened by me at 99b6045:** `chase/speed.h:36-38`: `corner_floor_speed`, `slip_rate` and `lead_range` are on main at 0.0.
  `chase/chaser.cpp:331-343` (the cap while facing away) and `:365-372` (`turn_drag`, 0.20 at `speed.h:29`) are the lines the
  stall he describes comes from; `chase/chaser.h:8-12` states it as intended.
- **From the reader's page, not opened by me:** H1 of the turning law uses `std::pow`, which is not bit-identical across
  maths libraries; H2 does not (its cite: l182-lines `chaser.cpp:220`, `:225`). Sideways carry at rate 3 stalled one route in
  ten at a mesh gap in L170 (`handback/p-l170-chase-A_2026-11-12.md:11-15`, `:74`).
- **The fork these settings feed:** the three options in `loop/physics_first_body_read_2026-11-14.md`, section 4. His choice
  between keeping the point model and a root that is a mass under a grip limit comes after this play.

## Registered before code (print each number in the hand-back)

- **R1, off means off:** with every dial of this lap at its default, the 12-seed fingerprint on the merged tip equals main
  c205622's own. Both md5s printed. **If they differ, stop; nothing lands.**
- **R2, kept runs:** with the dials off, his kept runs replay as they do on c205622. The count that match on each side, printed.
- **R3, `a-gen-record`:** its own rows green and the whole suite green on the merged tip.
- **R4, the train's verdicts with `--log-dir` set:** per-suite counts and times in the hand-back for each landing. L209's first
  landing has none (`handback/p-l209-a-landings-B_2026-11-14.md:37-41`).

## Not in this lap

- `a-kit-told` and B's `gen-lap2-kit`: two red rows wait for a ruling.
- The registered brutal arms (g13, g16, g20): the desktop's, tonight.
- The lean, the film at three grips, and any drawing code: pane C's next lap, after your ring.
- Any change to the hunter's default behaviour.

## Standing rules that bite here

- `node consonance/tools/heavy-run.js --status && <run>` in one call before any heavy run; exit 1 means run nothing.
- No build while `dz-world.exe` runs. He may play during this lap: check before each build and wait.
- No timing runs on L. No release.
- The four load-sensitive rows get one re-run with nothing else running; red twice is a stop (`librarian/2026-11-13.md:694`).
  Any other red, or a conflict in code that is not yours, stops that branch only.
- Commit by named paths. His words stay out of the game's repository.

## Hand-back

A file in `exo_memory/handback/`, rung to the librarian with `call_librarian` as a pointer. Mark each state claim checked or
inferred. End with who acts next.
