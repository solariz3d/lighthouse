# Packet L211 (pane A, on L): top-down traces of the six settings, then one launch argument so he can play them live

Written by the librarian on L, 2026-11-14 06:5x. For the chair to dispatch to pane A. One pane, one lap. **The laptop is closed
at 08:00 local. Everything is pushed by 07:45; see "The clock".**

## Why (his words; the full entries are game brief items 220 and 221)

- 04:45: "the body should orient itself where it is trying go, like a bird or a space ship banking into a turn ... it like
  loses all speed, repoints itself then goes, instead of like flowing through it still"
- 05:48, to the plan whose first step was a play with these settings: "go"

Your L210 hand-back found the game cannot set a chase dial at launch and named the smallest way
(`handback/p-l210-grip-A_2026-11-14.md:46-50`). This lap builds that, after first making the pictures that need no code.

## What to do, in this order

1. **Seven top-down traces, no code** (`dz-chase run ... --image`, your own line at `p-l210-grip-A_2026-11-14.md:48`): the
   control and the six texts of your table (`:54-61`), the same seed, the same policy and level for all seven, long enough to
   hold at least three corners. One PNG each, named by its setting, under 1 MB each, in your hand-back's evidence folder.
   **Ring the librarian with a pointer when they are written, then go on to step 2 without waiting.** They are for a page he
   looks at before he plays.
2. **`--chase-speed "<text>"` on `dz-world`**, parsed by `chase::set_speed` and applied through `WorldApp::apply_speed` before
   the first run, as you named it. With no argument, nothing changes. A text the parser refuses stops the launch with the
   parser's own message; it never falls back to the default in silence.
3. **Say what a second run in the same launch does** (keeps the model or returns to the shipped one), and make it keep it.
4. **The way he starts each play**, in the hand-back: the exact line for each of the six through `launch.ps1 world`
   (`launch.ps1:94-95` passes arguments through, your read). If the way he usually starts the game cannot carry an argument,
   add the smallest thing that can and say where it is. **Do not edit `game/config/world.local.txt`.**
5. Land step 2 by the train with `--log-dir` set.

## Registered before code (print each number in the hand-back)

- **R1, red first:** a row that starts the app with `turn_law=3;grip_mu=1.3`, runs, saves the record, and checks three things:
  the app's model holds both values; the record's `[speed]` section holds them; the replay reproduces both fingerprints. Red
  today because the argument does not exist. Show it red, then green.
- **R2, a bad text is refused:** an unknown field and a value that is not a number each give a non-zero exit and the parser's
  message. One row or two.
- **R3, off means off:** with no argument, the 12-seed md5 is `fa938de45995bd2d13b98ba28fae0c34` and his 20 kept runs replay
  20 of 20, as in L210.
- **R4:** the train's per-suite counts and times.

## Your question about the two rows: both were ruled on the desktop on 11-13. Nothing is ruled tonight

- **The nav row** (`the_way_there_is_about_as_quick_as_the_way_back`): re-registered by name on B's `gen-lap2-kit` at 28c6879
  (worst under 0.30, mean under 1.5 %, fewer than one pair in twenty over 5 %, more than 2,000 pairs, 16 draws), green on all
  16, each check first seen to fire (`handback/p-gen-lap2-kit-B_2026-11-13.md:364-380`; `librarian/2026-11-13.md:475`, `:489`).
  `a-l210-merge` does not carry that commit.
- **The sprinter row:** not re-registered. Its fix is **your own corner-room lap, registered on the desktop**
  (`handback/p-corner-room-A_2026-11-13.md`; `librarian/2026-11-13.md:696`): the corner rule's fixed 0.9 m of room becomes the
  free distance read off the mesh along the outer bisector, floored at 0.9 m, capped at 6 m; the row is amended by name to run
  both worlds at the same bar. Your trace of the row is at `librarian/2026-11-13.md:505`. It resumes "with the nav open_along
  commit red first" (`:706`). Your order on waking, as ruled there (`:907`): L182 onto main (done tonight), then the corner
  room.
- So `a-l210-merge` waits for the corner room and for B's 28c6879. **The corner room is not in this lap**: it goes in the
  handoff for the desktop.

## Not in this lap

The corner room. The kit. The lean (pane C's, on the desktop). The brutal arms. Any change to default behaviour.

## The clock

- By **07:40** local the branch is pushed, whatever state it is in.
- If the train cannot finish by **07:45**, do not start it: push the branch with R1 to R3 printed and write where it stops. The
  desktop lands it.
- Hand-back pushed and rung by **07:50**.

## Standing rules that bite here

`node consonance/tools/heavy-run.js --status && <run>` in one call before any heavy run. No build while `dz-world.exe` runs: he
may be playing; check and wait. No timing runs on L. No release. Commit by named paths. His words stay out of the game's
repository.

## Hand-back

A file in `exo_memory/handback/`, rung to the librarian with `call_librarian` as a pointer. Each state claim marked checked or
inferred. End with who acts next.
