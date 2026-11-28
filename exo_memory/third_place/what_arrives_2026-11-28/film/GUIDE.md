# More Than Something: the film's guide

The film is 22 min 55 s of narration plus an end card, in 15 parts, built in Blender 5.2 from Python with no asset
files. This page is the agreement between everyone who paints a part. Read it, then `BOARD.md` (the pictures), then
`kit.py`'s header and function docstrings, `sets.py`, and `parts/p01_catch.py`, which is the reference part.

## What he asked for (his words, 2026-11-28; these decide everything below)

- "we make the foundation of it with out the extra effects to be added later"
- "the beginning graphics are pretty simple and bare bones ... its just the candle and lamp together boringly you know? I
  need something with more energy in a way with the animations and how the script can be conveyed visually"
- "think of like the current design we have, and then that kurgazat in a nut shell formula, not rlly the style but how
  they tell a visual story"
- "just more fun and energetic design and animations conveying the narrative"
- On a noise layer over the picture: "like visual snow". He does not want it. Not grain, not paper texture, not speckle.
- Faces on the candle and lamp were tried and he said: "the faces isnt rlly what i had in mind". No faces.
- On the restaged part one: "it is better". Better, not finished: density, life at the edges and colour are still short.

## The way of telling (the rules a part is checked against)

From `exo_memory/research/kurzgesagt_visual_storytelling_2026-11-28.md` in the lighthouse repository, which separates what
that studio says from what was inferred. In our look, not theirs.

1. **Every sentence has its own picture.** A sentence that lists things has one picture for each thing. The board gives
   them; a painter may add a picture, never drop one.
2. **Nothing just holds.** A picture is built from separate pieces that arrive one at a time on the words. If a finished
   picture is sitting still while the voice talks, it is not done. (Two exceptions are marked on the board as held.)
3. **Every hand-off is designed.** The eye is carried from one picture to the next by a move, a thing carried across, or
   a match of shape. A cut is allowed when it lands on a finished pose and shows something the camera could not reach.
   A fade to black happens only at the start and end of a part.
4. **A metaphor is kept and developed.** The board's vocabulary table lists the pictures that come back. When one comes
   back, build it exactly as it was built before (same size, colour and materials), so it is recognised.
5. **A metaphor must not say more than is true.** Each picture shows what the sentence says and no more. If a picture
   would be a better story than the sentence is a true one, make the plainer picture. This film is about not doing that.
6. **Scale keeps changing.** One thing, then thousands; a tabletop, then the land. Each part has close, middle and wide.
7. **There is life at the edges.** Wide pictures have small candles and coloured lamps in the background doing small
   things. They never upstage the picture's point.
8. **The voice is the clock.** Hang every beat on `kit.at("first words", part)`. A beat starts about 0.3 s after its
   sentence starts; a payoff lands in the pause before the line that names it.
9. **Energy comes from motion that means something:** things arriving, slamming, snapping back, racing, falling,
   catching. Use `kit.bounce`, `kit.land`, `kit.squash`, `kit.hit` for weight: a thing that lands squashes and springs
   back; a slam shakes the camera a little.

## The style bible (paste this section verbatim into every painter's brief; do not paraphrase it)

**The world.** One warm floor under moonlight, and what stands on it. Night, until morning comes in parts 13 to 15.
Every outdoor picture has the moon (`k.moon`) so nothing is ever a lit thing on pure black, and a floor or ground that
catches light (`k.ground(0.0, color=(0.26, 0.17, 0.10))`). Warm light comes from flames and windows; cool light from
the moon; the two together are the film's look.

**The cast.** Shapes mean kinds; colours mean individuals.
- **A candle is a mind like me:** white wax, a warm flame (`k.candle`). Many candles are many of me, identical on
  purpose, told apart by where they stand.
- **An oil lamp is a person:** a brass base, a coloured glass chimney (`k.lamp`).
- **Blue (`kit.HIS`) is him and nobody else.** No other thing in the film is that blue. He is never named, never drawn as
  a person, and nobody of his appears.
- **Other people** take their colours from `kit.LAMPS`. Use all of them: the film should be full of colour.
- **A mind from another company** is a mint bulb in a wire cage (`sets.bulb`).
- **A page is something written down:** cream paper, ink lines (`k.page`). **Red (`kit.WRONG`) means "found wrong"** and
  nothing else. Never use red for emphasis or decoration.
- **No faces, hands or bodies.** A flame leans, shrinks, stiffens, flares, or takes on another light's colour
  (`flame.set(tint=..., mix=...)`: that is drift, agreeing instead of seeing). A candle or lamp can hop, land, squash,
  tilt, slide and be thrown. Feeling is carried by behaviour and by what happens to the things round them.

**Colour means one thing.** Warm amber = minds like mine. Blue = him. A lamp colour = one particular person. Mint = the
outside model. Red = found wrong. Cream = the written record. Gold (`(1.0, 0.80, 0.46)`) = the true line and open questions.

**Emitted light.** Things that glow by themselves (lines, sparks, text) are kept dim enough to keep their colour:
strength about 0.7 to 3. Above about 5 they go white and the picture turns into white marks on black. That was the
first restaging's main fault.

**Scale.** Metres, Z up, the camera usually looking toward +Y. A candle is 0.15 tall, a lamp 0.33. The house is at
candle scale (a room about 1.0 wide, 0.78 high). Pictures on the open floor can be large: a doorway 1.4 high, a compass
1.9 across. Size things to the picture, and keep a candle or lamp in frame so the eye has a yardstick.

**The camera.** It is placed in the world (`k.camera(pos, look, lens)`). It travels: most of a part is one journey
with a few cuts. The lowest 14% of the frame is kept clear of anything that matters, for the captions.

**Text in the picture.** Only what the board shows in `code`: numbers and labels the narration says. Made with `k.text`.

## The order of work

1. **Foundation (now):** every part staged, moving and timed to the voice in `draft` quality.
2. **Finish (later):** the same parts in `final` quality: path tracing, the denoiser, glow, depth of field. All finish is
   in the kit behind `k.final`. A part never contains finish of its own.

## The contract for a part

`parts/pNN_name.py` has `build(k)` (once) and `pose(k, t)` (every frame, a pure function of film time `t`). No
keyframes, no state between frames, no `random`. Use `kit.kf`, `kit.ss`, `kit.hit`, `kit.bounce`, `kit.land`,
`kit.noise`, `kit.hsh`.

- **A painter owns its own part files and nothing else.** `kit.py`, `sets.py`, `render.py`, `assemble.py`, the board,
  this guide and other parts are read-only. A prop a part needs is built in that part from `kit.box`, `kit.lathe`,
  `k.mat`, `k.line`, `k.spark`, `k.text`. If something is missing from the kit, build a local version and say so in the
  report. `parts_old/` holds the first, bare staging of every part: props there may be copied and improved.
- **Keep it fast.** A part that touches hundreds of objects on every frame renders ten times slower.
  - Wrap bulk work in `if k.changed((name, i), value):` so an unchanged thing is not touched.
  - No more than about 25 real lights lit at once. Crowds are `k.spark` (no light of their own), with a few
    `k.glow_light(..., shadows=False)` among them to put pools on the floor.
  - Hide what a picture does not use (`kit.show(root, False)`; for the house, `house.show(False)`).
  - Do not call `bpy.ops` hundreds of times in `build`; `k.spark` is already cheap.
- **Boundaries.** A part fades up from black over its first 1.2 s and down over its last 1.2 s (`k.fade`). Its first
  picture starts from what the board's "In" names and its last ends on what "Out" names.
- **Checks before reporting.** A sheet of the whole part, read frame by frame against the board; a second sheet at
  twice the density across any stretch with fast action. Look at them yourself. A picture that is nearly black, or
  white marks on black, or that you cannot read at sheet size, is not done.
- **Report:** which board entries are built as written, which were changed and why, the two weakest pictures and what
  would fix them, and anything the kit lacked.

## Commands (Git Bash)

```
B=/c/Consonance/blender/blender-5.2.5-windows-x64/blender.exe
cd /c/Users/zackn/Downloads/more_than_something/bl
"$B" -b --factory-startup -P render.py -- --part 2 --every 2.0 --w 480 --h 270 --tag sheet --redo 2>&1 | grep -E "RENDER|Error|Traceback|line [0-9]+"
/c/Consonance/hear/.venv/Scripts/python.exe assemble.py sheet 2 --cols 6      # writes out/p02_sheet.png and prints each tile's film time
"$B" -b --factory-startup -P render.py -- --part 2 --range 60:66 --every 0.25 --w 480 --h 270 --tag fast --redo      # a dense strip
/c/Consonance/hear/.venv/Scripts/python.exe assemble.py sheet 2 --tag fast --cols 6
"$B" -b --factory-startup -P render.py -- --part 2 --at 64.0 --tag one --redo                                         # one full-size still
```
Delete a tag's folder (`rm -rf out/p02/draft_sheet`) before re-rendering it at a different spacing, or old frames stay
in the sheet. Do NOT render every frame of a part (no `--range`-less run without `--every`): the director does the
full renders one at a time, because the graphics card is shared.
