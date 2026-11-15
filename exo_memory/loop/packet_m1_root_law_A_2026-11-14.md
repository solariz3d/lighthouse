# Packet M1 (pane A, on the desktop): the hunter's new root, a mass under a grip limit, red first

Written by the librarian on L, 2026-11-14 07:3x, for the desktop's chair to dispatch. First lap of
`loop/plan_new_system_2026-11-14.md`. Pane A on D does not carry what pane A on L did tonight; everything it needs is named here.

## His words (verbatim; game brief items 220, 221 and the lines under 221)

- "the body should orient itself where it is trying go, like a bird or a space ship banking into a turn ... it like loses all
  speed, repoints itself then goes, instead of like flowing through it still"
- "i want a procedural animation system, that interacts with the environment in a realistc way like rockstars rage engine"
- "i said plan and build the new system"

## What to build

A new way for the hunter to move, beside the old one, chosen by one switch that is **off until he says so**:

- The hunter carries a velocity, not only a heading and a speed. Each tick it is pushed toward its path by an acceleration
  whose sideways part can never exceed `grip_mu` times g, and whose forward part stays within its acceleration and braking.
- Its heading follows where it is travelling, so it turns continuously and never re-points on the spot.
- Plain float arithmetic with the chase's own deterministic sine and cosine. No physics library inside the tick in this lap.
- The other chasers do not change.

**Register the law before code:** one page in your hand-back's folder stating the law from path to acceleration, its sources,
and which of the old rules it stops using for the hunter (`chase/chaser.cpp:331-343` the cap while facing away, `:351-358` the
rate-limited heading, `:369-372` the turn drag, `corner_speed` and `speed_for_radius` at `:47-58`, `:174-180`; line numbers
as read at 99b6045).

## Registered before code (red first where marked; print each number)

- **R1, red first, the corner:** a scripted 90 degree corner of 3 m radius entered at 9 m/s. On every tick the sideways
  acceleration is at most `grip_mu` times g, and the heading's rate is continuous (no step). Red today: the chaser holds no
  acceleration and turns by a rate limit (`loop/physics_first_body_read_2026-11-14.md:212-215`).
- **R2, off means off:** with the switch off, the 12-seed md5 is main's own and his 20 kept runs replay 20 of 20. On L tonight
  main's value was `fa938de45995bd2d13b98ba28fae0c34` at 145b698 (`handback/p-l210-grip-A_2026-11-14.md:14-15`); re-measure
  it on today's main first, since the L182 value went stale the same way.
- **R3, red first, it stays on the floor:** the route where sideways carry stalled 30.1 m short at a gap in L170
  (`handback/p-l170-chase-A_2026-11-12.md:11-15`, `:74`) is run with the new root; it arrives.
- **R4, the same run twice gives the same fingerprints.**
- **R5, reported, not a bar:** never-caught and the Line median at NORMAL and at brutal, with the switch off and on, beside his
  52 and 62.

## What the room holds (open before you write a line)

- The option this lap builds, with what is kept and thrown: `loop/physics_first_body_read_2026-11-14.md:199-222`. Its
  envelope of what the dials ask and the grip radius at 9.2 m/s (8.6 m at 1.0, 6.6 at 1.3, 4.3 at 2.0): `:98-102`.
- The grip law already on main behind dials, and the cheetah paper read in full: `handback/p-l210-grip-A_2026-11-14.md:38-43`;
  `handback/p-l182-lines-A_2026-11-12.md`. `line_clearance` with `look_ahead` livelocks at corners; leave both at 0.
- Tonight's seven traces of the old hunter under the switches, one seed each: `librarian/2026-11-14.laptop.md`, "07:0x: A's
  seven traces"; the page is https://claude.ai/artifact/BZJaMUpvNDx9kUAhg8sdgX. With the grip law on, the bot lasted about
  59 s against 23.6 s.
- A launch argument for a live play exists since L211 (`--chase-speed`; `handback/p-l211-live-play-A_2026-11-14.md`).

## For his eye, in the hand-back

- The same seed-1 trace as tonight's seven (`dz-chase run --policy line --level 3 --seed 1 --max 60 --image`), with the new
  root on, so it sits beside them on his page.
- One corner filmed from outside and from the look-behind, old root and new, same route.
- The exact line that starts a live play with the new root on.

## Not in this lap

Retiring the old rules or re-registering their rows (M2). The world pushing back (M3). Arrival (M4). Flipping the default (M5).
The corner-room lap: stopped by the plan. `game/config/world.local.txt`: his, not edited.

## Standing rules

`heavy-run.js --status` before any heavy run. No build while the game runs. Commit by named paths. His words stay out of the
game's repository. Hand-back as a file, rung to the librarian as a pointer, each state claim marked checked or inferred.
