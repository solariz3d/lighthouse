# D677: OLD against NEW on his game's main c38a52a, side by side, for his page (pane E, machine D, 2026-11-16)

**Order:** the chair, 14:05:35Z. His ask of 06:39 (game brief item 253): "show me the new system vs the old in an artifact when you
are ready". His word lifts, for this film, his 15:03 rule against the old body beside the new. **The old is SHOWN here, not used
as a judge.** Also the chair's line of 13:01Z: the stop filmed from the front, held at least 4 s. Tier: just do it.

## The clips: `G:\consonance-scratch\oldnew-c38a52a\clips\`

- **14 clips, 7 stations,** each at real speed (`*_realtime_144fps.mp4`) and three times slower (`*_3x_slower.mp4`).
- **Each clip is a 2 x 2 grid,** 1280 x 720:

  | | left | right |
  |---|---|---|
  | top | OLD - the runner | NEW - the runner |
  | bottom | OLD - the hunter | NEW - the hunter |

- **One camera per station,** the same in all four squares.
- **The footer names:** the station, "his game main c38a52a, OLD = new_animation 0, NEW = new_animation 1", the speed, and "LIT FOR
  THE FILM".
- **Every clip starts at frame 0.**
- **Every real-speed clip's length is its frames / 144:**

  | station | frames | real-speed length |
  |---|---|---|
  | straight and turn | 907 | 6.30 s |
  | sidestep | 317 | 2.20 s |
  | backwards | 375 | 2.60 s |
  | stop and start | 605 | 4.20 s |
  | stop from the front | 1081 | 7.51 s |
  | stair | 812 | 5.64 s |
  | doorway | 554 | 3.85 s |

- **The contact sheets I looked at** (six moments a station) are in `clips\look\`.

## How it was made

- **The game's code is main c38a52a's.** I checked: b-idle 08e1324 and the stack 3e29301 are both its ancestors.
- **It was built on the film-only branch `f13-oldnew-e` at `84fc941cd3ef0390ece741383a847c761a2d38d7`,** pushed. It changes only
  `game/world/course_film.cpp`: a station `stop_front` (a sprint of 1.5 s, a stop held 4.5 s, a sprint of 1.5 s), filmed from in front
  of the body at hip height, looking level. Not for landing.
- **Filmed twice from config copies of main's own `game/config`:**
  - `G:\consonance-scratch\e-oldnew-cfg-old`: main's config exactly, which has `new_animation = 0`;
  - `G:\consonance-scratch\e-oldnew-cfg-new`: `new_animation = 1`, its only difference from main's (diffed).

  His `world.local.txt` is not touched.
- **800 x 450 frames, both bodies.**
- **The encoder's guard read every manifest:** each film is built from 84fc941, and each names its own system.
- **The frames moved to Z::** `Z:\consonance-archive\2026-11-15-films-E\oldnew-c38a52a\{old,new}`, 9309 files each, counts matched,
  none left on G:.

## What I saw, station by station (the sheets in `clips\look\`)

- **Straight and turn.**
  - OLD: the runner's crouched, bent-armed gait.
  - NEW: the runner upright, its arms lower and close.
  - The OLD hunter's arms reach forward as it runs; the NEW hunter's swing at its sides.
- **Sidestep.**
  - Both systems are seen from far down the corridor.
  - **The camera is inside a wall on the last sixth.** The manifest says the camera's ray met a wall on 64 of 317 frames, so the
    picture is white there, identical for OLD and NEW.
- **Backwards.**
  - OLD: the runner's long crouched steps.
  - NEW: shorter upright steps.
  - Seen side-on.
- **Stop and start (side-on).**
  - The OLD runner stands crouched at the start; the NEW runner stands upright.
  - Both sprint off.
- **Stop held 4.5 s, FROM THE FRONT.** The whole body is in frame, feet to crown, for both bodies.
  - **The weight shift, measured,** from the dark pixels' centre across the hip band, frames 200–960:
    - **The NEW runner's hips move about 4 px to one side** (114.9 → 118.8 px, frames 440–720), about 2 cm at this distance.
    - The OLD runner stays at 115.7 px.
    - **The NEW hunter does not shift in this hold.** Its band stays at 110.0 px throughout, the same as the OLD hunter's. I report it
      as seen and do not explain it.
  - **It is small at real speed. The slower clip is where it can be seen.**
- **Stair.**
  - **The camera is inside a wall on about a sixth.** The ray met a wall on 139 of 812 frames, the same for both systems.
  - Both bodies climb, seen from behind.
- **Doorway.**
  - **The NEW hunter's head reaches the top of the doorway:** his item 233, still open. The head work is not on main.
  - The OLD hunter is drawn crouched through it.

## Corrections to myself

**The front stop was filmed three times.** All three are kept, renamed, on Z: (`*.superseded-3m`, `*.superseded-1m6`).
1. The first, at 3 m, showed the shift as about 1 px (121.3 → 122.2), which cannot be seen.
2. The second, at 1.6 m and eye height, cut off the knees and feet.
3. The third (84fc941) is the one encoded.

The other six stations came out the same across the runs: each clip's size was unchanged, and four sheets (straight, sidestep, stair, doorway) were byte-identical.

Seat: pane E (machine D), sibling-07b8a48f.
