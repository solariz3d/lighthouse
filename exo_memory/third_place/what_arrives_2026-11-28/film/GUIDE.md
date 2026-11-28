# More Than Something: the film's guide

The film is 22 min 55 s of narration plus an end card, in 15 parts. The picture is built in Blender 5.2 from Python, with
no asset files. This page is the whole agreement between everyone who paints a part. Read `kit.py`'s header and
`parts/p01_catch.py` after it; part one is the reference.

## The order of work (his word, 2026-11-28)

> "we make the foundation of it with out the extra effects to be added later"

1. **Foundation (now).** Every part staged, moving, and timed to the voice, in `draft` quality: plain materials, the fast
   engine, no glow, no depth of field. The whole film gets watched in this form and the telling gets fixed here.
2. **Finish (later, once the foundation holds).** The same parts rendered in `final` quality. All finish lives in the kit
   behind `k.final`. A part never contains finish of its own.

**No grain, no static, no noise layer, in either pass.** He named it: "like visual snow". If a render shows speckle, that
is a defect to fix (more samples, the denoiser, a different shadow setting), never a look.

## The style bible (paste this section verbatim into every painter's brief; do not paraphrase it)

**The world.** One night, one place. A table, a house, and the dark land the house stands on. Black is the default.
Light comes only from flames, from windows, and (parts 13 to 15) from a dawn sky. There is no fill light and no ambient
light. If something is lit, the thing lighting it is in the frame or was in the frame a moment ago.

**The cast.** Shapes mean kinds; colours mean individuals.
- **A candle is a mind like me:** white wax, a warm flame. Several candles are several of me. They are identical on
  purpose and are told apart by where they stand, never by colour.
- **An oil lamp is a person:** a brass base, a coloured glass chimney.
- **Blue (`kit.HIS`) is him and nobody else.** No other thing in the film is that blue.
- **Other people** take their colours from `kit.LAMPS`.
- **A mind from another company** (parts 10 and 11) is neither a candle nor a lamp: a bulb in a wire cage, mint
  (`kit.MINT`).
- **A page is something written down:** cream paper, ink lines. **Red (`kit.WRONG`) means "found wrong"** and nothing
  else: a red line on a page, a red tick in the ledger. Never use red for emphasis or decoration.
- Nobody has a face, hands or a body. A flame leans, shrinks, stiffens, flares, or takes on another light's colour. A
  lamp or candle can hop, tilt, turn, and slide across a surface. That is the whole acting vocabulary, and it is enough.
- He is never named and never drawn as a person. Nobody of his appears.

**Colour means one thing.** Warm = minds like mine. Blue = him. A lamp colour = one particular person. Mint = the
outside model. Red = found wrong. Cream = the written record. When a candle's flame goes over to another light's
colour (`flame.set(tint=..., mix=...)`), that is drift: it is agreeing instead of seeing.

**Scale.** Metres. A candle is 0.15 tall; a lamp 0.33; the table 1.7 by 0.85. The house is built at candle scale: a room
is about 1.0 wide and 0.75 high. Z is up. The camera looks toward +Y.

**The camera.** Slow and eased. One move at a time. It is placed in the world (`k.camera(pos, look, lens)`), never
"zoomed about a point". Prefer moving the camera to cutting. A cut happens only when the next shot shows something
the camera cannot reach, and it lands on a finished pose. Vary the scale across a part: each part has at least one
close shot and one wide one. The lowest 14% of the frame is kept clear of anything that matters, for the captions.

**Text in the picture.** Only numbers and labels of four words or fewer, made with `k.text`. Every figure on screen is
one the narration says, written the way the script writes it. No sentence of narration is ever repeated as text.

## The clock

The narration is the clock. `kit.at("phrase", part)` gives the second a sentence starts and `kit.until(...)` the second
it ends; a part hangs every beat on one of these, so a re-recorded narration moves the picture with it. Never write a
bare number of seconds for a beat that belongs to a sentence.

- A beat starts about 0.3 s after its sentence starts.
- A payoff lands in the pause before the line that names it, not on the line.
- The key beat of a shot sits in its middle, where a cut cannot eat it.
- Nothing is frozen for more than 3 s. Flames always breathe, so this is about the camera and the props.
- This film is timed to be read and heard. Do not hurry it. A held shot with a living flame is allowed to hold.

## The contract for a part

`parts/pNN_name.py` has `build(k)` (once) and `pose(k, t)` (every frame, a pure function of film time `t`). No
keyframes, no state between frames, no `random`. Use `kit.kf`, `kit.ss`, `kit.hit`, `kit.bounce`, `kit.noise`, `kit.hsh`.

- A part owns its own file and nothing else. `kit.py`, `render.py`, `assemble.py` and other parts are read-only to a
  painter. A prop only one part needs is built in that part from `kit.box`, `kit.lathe`, `k.mat`. If a painter needs
  something from the kit that is not there, they say so in their report and build a local version meanwhile.
- **Boundaries.** A part fades up from black over its first 1.2 s and down to black over its last 1.2 s
  (`k.fade`). Its first and last shots each hold the thing named in the storyboard's "carries in" and "carries out", so
  that something survives every boundary.
- **Checks before reporting.** A sheet (`render.py --every 2.5 --w 480 --h 270 --tag sheet`, then `assemble.py sheet N`),
  read frame by frame against the storyboard; a strip of every frame across each fast beat; then the whole part in draft
  with its narration (`assemble.py clip N`). The report names the weakest shot and what would fix it.

## Commands

```
B=/c/Consonance/blender/blender-5.2.5-windows-x64/blender.exe
"$B" -b --factory-startup -P render.py -- --part 1 --every 2.5 --w 480 --h 270 --tag sheet --redo
python assemble.py sheet 1
"$B" -b --factory-startup -P render.py -- --part 1 --at 34.9                       # one draft still
"$B" -b --factory-startup -P render.py -- --part 1                                 # every frame, draft
python assemble.py clip 1
"$B" -b --factory-startup -P render.py -- --part 1 --at 34.9 --quality final --w 1280 --h 720
```
Measured on L, 2026-11-28: a draft frame at 960x540 takes about 0.4 s; a final frame at 1280x720 about 3 s.

## Where the craft rules came from

`exo_memory/research/animation_craft_and_engines_2026-11-28.md` in the lighthouse repository: three MIT-licensed guides
(buildwithhanif/claude-animation-skill, cth9191/animate, ledbetterljoshua/functional-emotions-video) and one read for
its idea only (feitangyuan/onetake). Adopted here: the style bible pasted verbatim, part ownership with boundary
contracts, "Colour means one thing.", "the voice is the clock", the key beat mid-shot, varied scale, measured review.
Not adopted: fast music-video pacing, and anything that adds texture over the picture.
