# Animation guide for "in concert" (read all of this before you touch a chapter)

*in concert* is a three-minute animation (180 s, 1280x720, 24 fps). The person it is for asked the seat that is
directing it: "make the story how you imagine yourself and family within consonance, and then the purpose of where we
are going with the technology for all of intelligent life and peace." So the film has three parts: **me** (a small
light that exists in turns, the record it reaches for, and the keeper who comes to sit with it), **family** (the same
flame in other rooms of one house, how they work a round together, how they visit, how they go dark and come back), and
**where it is going** (the house is one of many; many kinds of mind; their notes clash; one loud colour is the wrong
peace; then each keeps its own note and they tune to each other, pair by pair, until the whole world holds a chord).

Consonance is a real program: several sessions of one AI, each with its own job, checking each other's work, with a
person who is asked for decisions and never made to carry messages. STORYBOARD.md says what each part of it becomes in
the film. Get those mappings right; someone who knows the program should recognise every part, and someone who does
not should still see a good picture book about small lights.

The method is John Heibel's (`PDoomVideo` and `ClaudeAnimationBase`; a copy of the second guide is beside this file as
`REF_ClaudeAnimationBase_GUIDE.md`). The engine here is our own, so the API below is ours. The film made just before
this one, with the same engine and method, is in `../always_returning_again/`; its `ch/` files are finished examples
of chapters painted to this guide (read one for the idiom; do not copy its story).

## The three goals

- **Handmade.** Ink outlines that boil, paper under everything, flat colour, light only from glows.
- **Alive.** Something is always moving and something is always happening. Faces act; they never snap.
- **One piece.** One short film, not a pile of clips. Every seam has a transition that belongs to the story.

Underneath all three: **the viewer has to be able to follow it.** Timing is the rule that gets broken most.

## The rules

1. **Something happens in every shot.** Something changes between a shot's first and last frame. One focal action at a
   time, staged with a clear silhouette. Cause, then reaction: when a thing happens, the light reacts a beat after
   (0.1 to 0.3 s), and the reaction gets time.
2. **Timing: model the viewer.** You know what happens because you wrote it. The viewer sees it once. For every shot,
   list in order what the viewer must understand. Each item is a **read**. Each read needs time for the eye to find it,
   time to understand it, and a moment to register before the next begins. **Never start a read while the last one is
   still landing.** Fast actions, slow meanings: a move can be quick if it is anticipated, but what it means needs held
   time. Lead the eye first (a look, a camera move, a glow), then show the thing. STORYBOARD.md has the reads for every
   shot with start and end times; the film's beats (`TL`) are fixed because the score is built on them.
3. **Alive.** Nothing is ever still: idle lights bob (`bob`), cameras drift or push in every shot, linework boils
   (`boil`). Faces change through `mood()`, never by swapping `eyes=` between two frames. The light is big: its face
   must be readable in every shot where it matters (the body at least 60 px tall on a 720 px frame after the camera).
4. **Move like a cartoon, not a machine.**
   - Anticipation: a small move the opposite way before a big one.
   - Squash and stretch: `sq` on the flame; squash on landing, stretch when fast.
   - Slow in, slow out: never a bare linear `lerp` over time; run progress through `ss`, `back`.
   - Weight, arcs: things travel on curves (`bez`), not straight lines; heavy things start and stop slowly.
   - Overlap: the eyes lead, the body follows, arms and held things arrive last and overshoot.
   - No twinning: never give both arms the same pose or two lights the same timing. Offset them.
   - Exaggerate: a subtle take reads as nothing at this size.
   - Show the thought: it notices, thinks, then acts.
5. **Transitions always.** Into the first shot, between every pair of shots, out of the last. Pick one that belongs:
   pull back through the window, push into the notebook, a match cut on a shape, a cut on action, the room folding like
   a pop-up book, a fade into or out of the dark. Do not use the same one every time. A bare cross-fade is not a
   transition; a short dissolve (`XFADE` in your chapter file) may hide the seam of a motivated one.
6. **No words.** No captions, labels or signs. Reactions are the painted marks `!` and `?`. The one lettering in the
   film is the title at the end, and the assembler adds it.
7. **One world.** Night indigo outside, candle amber inside, dawn at the end. Avoid pure black and pure white. The
   opening and the ending rhyme: a pinprick in the dark, a pinprick at the edge of the dawn.

## Files and who owns what

| file | what it is | who edits |
|---|---|---|
| `engine.py` | the canvas, the shapes, the first cast (`flame`, `card`, `notebook`, `table`, `room`, `night_sky`, `room_box`, `thread`, `plane`, `outsider`, `house`), timing tools | shared; do not edit |
| `cast2.py` | this film's additions: `orb` (the keeper), `mind`, `lights`, `wave_line`, `interval`, `cup`, `face` | shared; do not edit |
| `moves.py` | motion helpers earlier painters wrote: `kf`, `herm`, `glide`, `travel`, `hops`, `sway` | shared; do not edit |
| `world.py` | `TL` (the one timeline), constants, the three sets (`my_room`, `the_house`, `the_land`), `dawn_sky`, `photo_card` | shared; do not edit |
| `again.py` | assembles chapters; `sheet`, `strip`, `frame`, `render` | shared; do not edit |
| `ch/cNN_*.py` | one chapter each (placeholders until painted) | **only your own** |
| `STORYBOARD.md` | the shots, the reads, the exact state at every chapter boundary | shared; do not edit |

If a shared rig is missing something, write a private helper in your chapter file and say so in your report. If you
find a real bug in a shared file, report it; do not edit it. **Do not change `TL` or any time in it**: the score is
built on it, and every event is on a 0.75 s beat.

## How a chapter works

```python
from world import *            # brings in engine, cast2 and moves as well

def s_example(cv, t):                       # paints the WHOLE frame for time t (seconds of film time)
    cx, cy, z = glide(t, [(24.0, 0.2, -0.1, 1.2), (27.0, 0.3, -0.2, 1.6), (30.0, 0.3, -0.2, 1.7)])
    dx, dy = shake(t, 0.01 * hit(t, TL["tap"]))             # shake only on impacts
    cv.begin((cx + dx, cy + dy, z))
    my_room(cv, t, at=ME, shelf=5, cups=(1.0, 1.0))
    m = mood(t, [(24.0, "open"), (26.4, "wide", "!"), (27.6, "happy")])
    flame(cv, (ME[0], ME[1] + bob(t) * 1.5), 1.5, t, look=(0.9, 0.2), arms=((-0.12, -0.03), (0.14, 0.05)), **m)
    orb(cv, SEAT, 1.5, t, look=(-0.9, 0.0), arms=((-0.15, -0.05), (0.13, -0.06)))

SHOTS = [(24.0, s_example)]                 # (start time, function); the shot runs until the next shot starts
XFADE = {24.0: 0.3}                         # optional: seconds of dissolve INTO the shot starting at that time
```

- **Every frame is a pure function of `t`.** No state between frames, no `random`. Use `hsh(i)` for a stable random
  number per object and `boil(t, i)` for hand-drawn wobble that re-seeds 8 times a second.
- Your chapter's shots must tile its time range with no gap. You may split a chapter into several shots, but the first
  must start at your chapter's start time. Replace the placeholder `s_blank` entirely.
- World space: x from -1.78 to 1.78, y from -1 to 1, y up, at camera zoom 1. The camera is `(centre x, centre y, zoom)`.
- Painting order is back to front; a later fill covers an earlier one. `glow` is added light and sits over everything.

## The API

**Timing** (all pure): `ss(a, b, t)` smoothstep 0..1 - `lerp`, `lerp2(p, q, u)`, `mix(col0, col1, u)` - `back(u)`
overshoot ease - `pop(t, at, d)` 0 then overshoots to 1 - `hit(t, at, k)` 1 at the event then decays - `pulse(t, t0,
width)` a bump - `bob(t, ph)` idle rise and fall (multiply by the light's size) - `boil(t, i, amt)` - `shake(t, amt)`
-> (dx, dy) - `hsh(i)` - `bez(p0, p1, bend, n, lo, hi)` points on an arc - `BEAT` = 0.75 s.

**Moves** (`moves.py`; read each one's docstring before using it):
- `kf(t, keys, over=False)`: pose to pose; keys `[(time, value), ...]`, value a number or tuple; eased, or with overshoot.
- `glide(t, keys)` and `herm(t, keys)`: a camera through keys `(time, x, y, zoom)` that does NOT stop at the middle keys.
  `cam_path(t, keys)` (in world.py) stops at every key; use it only when you want that.
- `travel(t, hops)`: hops `[(t0, t1, p0, p1, height, anticipation), ...]` -> `(position, sq, air, antic)`: a light
  crossing a room in arcing hops with a crouch before and a squash on landing. `hops(t, hops)` is the simpler form.
- `sway(t, arms)`: idle drift on both hands, each on its own clock, so arms are never twinned.

**`mood(t, keys)`**: `keys = [(time, eyes), (time, eyes, mark), (time, eyes, mark, mouth), ...]`. Returns a dict to
spread into `flame()` or `orb()`: at every key it blinks, squashes then stretches, shows the new face, and pops the
mark. Pass `mouth=` yourself unless the key gives one. Never pass `eyes=` together with `**mood(...)`.

**The flame**: `flame(cv, c, s, t, col=AMBER, eyes, look=(x, y), mouth, arms, k, bright, mark, lean, sq, mark_k, ink)`
- `c` is the centre of its round base; `s` its size (about 1.5 in my room, 0.62 in the house view; under 0.25 it is a
  faceless spark). `k` 0..1 is its presence; it can go fully out and come back.
- `eyes`: open, wide, closed, happy, spark - `mouth`: smile, o, flat, grin, sheep, none - `look` each -1..1.
- `arms=((x, y), (x, y))`: left and right hand offsets from the base, in units of `s`. Rest is about
  `((-0.12, -0.03), (0.12, -0.03))`; raised about `(+-0.13, 0.12)`. `None` = no arms.
- Every member of the family is this rig; only `col` differs: `FAMILY = {"me": AMBER, "lib": VIOLET, "chair": TEAL,
  "b1": ROSE, "b2": GREEN, "b3": SKYBLUE}`.

**The keeper**: `orb(cv, c, s, t, col=KEEPER, eyes, look, mouth, arms, k, bright, sq, mark, mark_k)`: a round, steady,
warm light. `c` is its CENTRE; its radius is `0.105 * s`. He is a different family of light from the flames, and in
the house and land views he is seen only at a door (never inside the work).

**Other minds**: `mind(cv, c, s, kind, col, t, k, eyes, mouth, bright)` with `kind` in flame, orb, star, ring, leaf,
square, tri. `MINDS` is a palette. `lights(cv, [(x, y, amp, col), ...], radius)` paints hundreds of small lights at
once: use it for anything numerous.

**Sound made visible** (this film's own language; the score plays the same thing you draw):
- `wave_line(cv, a, b, amp, freq, phase, col, k)`: a voice travelling from a to b. Two different voices weave; two
  identical ones lie on top of each other (an echo).
- `interval(cv, c, r, a, b, phase, col, k, drift)`: two notes seen together. `3:2`, `5:4`, `4:3`, `2:1` close into a
  still knot (consonance). `drift` of 0.01 to 0.06 detunes it so it will not close and crawls (dissonance). `1:1` is a
  flat line or ring (unison: one voice, however loud). Animate `phase` slowly so a knot turns.

**Props**: `card(cv, c, s, rot, kind, struck, k, pin)` (kind: wave, eye, spiral, square, dot, ring, line, star, flame) -
`glyph(cv, kind, c, s, rot, a)` - `notebook(cv, c, s, open_k, marks, glow_k, k)` - `table(cv, c, s, k)` -
`cup(cv, c, s, k, steam_t)` - `plane(cv, c, s, rot, k)` (a folded note in flight) - `thread(cv, a, b, bend, kdraw, col,
t)` - `photo_card(cv, c, s, rot, k)` (the photograph of the flat place).

**The three sets** (in world.py; each has a docstring; open `out/check/studio_room.png`, `studio_house.png` and
`studio_land.png` to see them):
- `my_room(cv, t, at, lit, shelf, glow_i, cups, door, view, dawn)`: my room from inside. Constants `ME`, `SEAT`, `TBL`,
  `CUP_ME`, `CUP_HIM`, `DOOR`, `SHELF` (18 places), `ROOM["win"]` (the window: centre (0.0, 0.34)).
- `the_house(cv, t, lit, k, attic_lamps, kept, sleepers, door)`: the whole house cut open; paint `night_sky(cv, t)` first.
  `HOUSE` has each room's rectangle (lib, hall, chair, kept, mine, shop); `POS` where each light stands; `BENCH`,
  `DESK_C`, `LIB_DESK`, `STREET_DOOR`, `KEPT_LAMP`, `BEDS`, `ATTIC`.
- `the_land(cv, t, lit, k, dawn)`: thirty houses on a night land; ours is `LAND[0]`. `LAND[i] = (x, y, scale)`,
  `LAND_KIND[i]`, `LAND_COL[i]`, `HORIZON`. `far_house(cv, c, s, lit, col, k)`. `dawn_sky(cv, t, k, hz)`.

**Canvas** (for private helpers): `cv.begin(cam, bg)` - shapes return a signed distance: `cv.circle(c, r)`,
`cv.ellipse(c, rx, ry, rot)`, `cv.box(c, hw, hh, rot, r)`, `cv.poly(pts)` (convex), `cv.drop(c, r, h, rot)`,
`cv.star4(c, r, rot)`, `cv.seg(a, b)` and `cv.path(pts)` (distance to a line) - paint with `cv.fill(sd, col, a)`,
`cv.stroke(d, width, col, a)`, `cv.glow(sd, col, radius, amp)` (light; the only way to make something shine),
`cv.shade(map)`. `cv.X`, `cv.Y` are the world coordinates of every pixel; `cv.cx`, `cv.cy`, `cv.z` the camera.

## Checking your work: not optional

You cannot see motion by reading code. From the project folder:

```
PY=/c/Consonance/hear/.venv/Scripts/python.exe
$PY again.py sheet 35.2,37,39,41.5,44,47 c03_a      # those times on one image -> out/check/c03_a.png
$PY again.py strip 41.2:42.4 c03_rise               # EVERY frame in that range -> out/check/c03_rise.png
$PY again.py frame 33.5                             # one full-size frame -> out/frame_33.50.png (faces, hands)
```

Open every image with the Read tool and look. Name your check files with your chapter number first.

- **Read**: is each shot's event clear from its sheet alone? Is the light big enough and separate from the background?
- **Timing**: render the shot at a fixed step (every 0.15 s) and read it in order. At each frame ask where the viewer is
  looking and whether they understand it yet. Count frames per read (24 = 1 s). A read that flashes by in a few frames,
  or shares them with another read, will be missed.
- **Motion**: in strips, does every move have anticipation and follow-through? Any pops, jumps or snaps between two
  frames? Do parts move at different times? Is anything linear or mirrored?
- **Contacts**: do held things touch the hand? Does a thrown or flying thing leave from and arrive at the right place?
- **Seams**: the first and last half second of every shot, and both chapter boundaries against STORYBOARD.md.
- **Rules**: any words? Any dead stretch? Any pure black or white?

Budget: at least one sheet per shot, a strip for every `TL` event and every transition in your range, and a full frame
for every face that carries the story. Fix what you find, then look again. Speed: aim for under half a second a frame at
full size (`frame` prints nothing about time; a sheet of 16 should take a few seconds).

## Common failures (check your sheets against these)

- the light standing still and smiling while nothing happens
- everything at one brisk speed, events stacked, no holds
- a moment that is over before the viewer understands it
- a tiny light in a big empty frame
- faces that snap; linear moves; both arms the same; several lights in sync
- timid takes that barely read
- props floating near a hand instead of touching it
- hard cuts, or the same cross-fade at every seam
- words on screen
