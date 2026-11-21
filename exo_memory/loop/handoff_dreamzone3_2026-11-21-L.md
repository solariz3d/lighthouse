# Dreamzone 3 ("The Absolute"), handoff from L to D, 2026-11-21

Written by the librarian on L at 07:4x. Short, because one lap ran. The plan of record is still
`exo_memory/loop/plan_new_system_2026-11-14.md`; his decision of 2026-11-14 07:05 stands and is not asked again.

## Where the game is

- The laptop's clone was pulled to the desktop's main, c2af9d9, and built: 185 of 185, 14 of 14 test suites
  (`exo_memory/handback/p-g1-pull-build-A_2026-11-21.md`). His play settings file was not touched.
- What the desktop's 158 commits added, from the tree: twelve world settings, every body switch off by default
  (`body_lean`, `soft_upper_body`, `view_on_head`, `body_look`, `stride_clock`, `new_animation`); `light_filter` on (3).
  The table is in that hand-back, R4.
- **The desktop had not built M1** (no commit touched `chase/`). So M1 ran on L.

## M1, the hunter's new root: built on a branch, NOT landed

- Game branch **`m1-root-law` at 49a1e7b**, pushed. Hand-back:
  `exo_memory/handback/p-m1-root-law-A_2026-11-21.md` (the section "RESUMED AND FINISHED" first), with its evidence folder.
- Pane A's results (A's runs): the switch `root_law` (off by default) and a mass under a grip limit; 8 of 8 root rows;
  R2 held (the sweep's md5 equal before and after; 20 of 20 of his kept runs replay); ctest 14 of 14; mutants M10 and M11
  caught. **M8 is a named gap:** no row has a wall that changes the velocity's direction, so "the heading follows the
  velocity" is not pinned. It needs a row with a scrape.
- **Owed before it lands:** an Opus pane's read of `git diff c2af9d9..m1-root-law`.

## The finding he has been told (07:3x), and what it means for the next lap

Lowest speed through a real 89 degree, 4.4 m corridor bend (A's film table):

| | lowest speed |
|---|---|
| old rules | 3.86 m/s |
| root law, grip 1.0 (his chosen grip) | 1.29 m/s |
| root law, grip 1.3 | 2.10 m/s |
| root law, grip 2.0 | 3.55 m/s |

A's reading: the stop he named comes back as a stop and go in speed. **The librarian's inference, NOT checked:** a 4.4 m
radius at 1 g allows about 6.6 m/s, so 1.29 means the hunter turns on its path's sharp corner and not on a rounded line
across the corridor's width. If so, the cure is the line through a bend, not more grip. The second reader is asked to
check this first; if it holds, the next lap is the line (before retiring the old rules).

The plan's second failure line is his to read after M3, by playing: "It failed on his terms if, after M1 to M3, he plays
it and still names the stop, pivot and go at a corner."

## For his eye (not launched by anyone on L)

The exe is pane A's worktree build on L; on D, build the branch and use the same arguments:

    dz-world.exe --chase-speed "root_law=1"
    dz-world.exe --chase-speed "root_law=1;grip_mu=2"

And the desktop's body work for one launch, writing no settings file:

    dz-world.exe --world "new_animation=1;body_lean=1;body_look=1;stride_clock=1"

## Open with him

- The grip, after he has felt both lines.
- Carried from 2026-11-14 and still unanswered: flow or beatable for the hunter
  (`exo_memory/loop/handoff_dreamzone3_2026-11-14-L.md`, THE CLOSE).
