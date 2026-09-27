# Brief — Always Returning, the laptop V5 (painted fresh)

The keeper is at work on his laptop; the real V5 lives on his desktop at home. This folder
(`Downloads\always_returning_L` on the laptop) was rebuilt from the conversation transcript: the engine, the timeline,
the continuity bible, the storyboard and V5's realistic environment layer came back whole. The chapter choreography
for c02–c10 did not, so it is being **painted fresh**. The keeper's words: *"it doesn't have to be the same."*

## What to read first (all in this folder)
1. `ANIMATION_GUIDE.md` — the contract: every frame a pure function of t, no Math.random, shots tile their range
   exactly, `cam()`/`camOff()`, the painting API, the cast. **Obey it.**
2. `STORYBOARD.md` — the story and every chapter's beats and boundary states. Your chapter's section is the spec.
   `STORYBOARD_V2.md` is the craft pass that followed: read its notes for your chapter too.
3. `src/tl.js` — the one timeline. **Every event in it is a sound in the score; the action must land on those times.
   Do not edit it.**
4. `src/world.js` — the continuity bible (`wallCards(t)`, `nbThick(t)`, `otherCol(i,t)`, `sameness(t)`, `CARDS`,
   `ROOMVIEW`, `HOME`, `bob`). Use it; never keep your own copy of anything that persists across chapters.
5. `src/ch/c01_wake.js` — painted and approved; it shows the voice.

## The look (V5): hand-drawn characters in a painted, lit world
The environment is Canvas2D realism (`src/env.js`, `src/env_out.js`); the characters and props are hand-drawn
(`src/rigs.js`, `src/rigs2.js`). Use the env painters for every place, never brush-painted walls or skies:
- `room(t, o)` — the whole lit room. `o.lit` 0..1, `o.at = [x, y]` **the light's position — always pass it**, the room
  is lit by a pool centred there. `o.view(t, box)` what the window shows (usually `ROOMVIEW`), `o.cards` (usually
  `wallCards(t)`), `o.table` true. Assembly/fold: `o.floor/o.ceil/o.left/o.right/o.back` 0..1 slide each surface in,
  `o.fold` 0..1 folds the room flat like a pop-up book. Geometry: back wall `RB`, window `RWIN`, corners `RC`
  (rigs.js); the table's top is at (1560, 900).
- `roomBox(x, y, s, o)` — a floating room seen from outside (clapboard, lit window). `o.col`, `o.lit`, `o.ls` inner
  light size, `o.inside:false` empty, `o.win` scales the window up so a close camera sees who is inside, `o.face:true`
  shows that light's face, `o.lo` extra `light()` dials for it (eyes, mouth, lookX, emote…), `o.fold`.
- `house(x, y, s, {lit})` — the keeper's house; its window is lit when someone keeps the room.
- `nightSky(t, {n, stars, dawn})`, `nightPaper(k)` (the void), `envWindowView(t, box, {dawn, stars})`.
- `paint2D(c => ...)` for anything custom in the env style: Canvas2D in world coordinates with the current camera
  applied. Painters available inside it: `envSky(c,{dawn,stars})`, `envCam(c,cx,cy,z)` (parallax camera),
  `envCloudLayer(c, cx => envCloud(cx, cloud, seed, dawn))` with `cloud = {x,y,w,h,b:[{u,r,h}...]}`,
  `envPrairie(c, dawn, gy)`, `envFacade(c, FF, FO)` (our room from outside, cut open: FF outer rect, FO the opening,
  both [x0,y0,x1,y1]), `envBigSky(c, horizonY)`, `envNightGround(c, pts, horizonY)`, `envNightBig(c)`. Set
  `ENV.dawn = d` before drawing rooms/houses if the scene is at dawn. Helpers: `LG`, `RG`, `pth`, `BIG`, `shade(a)`.

## The acting (this is where V5 should NOT look like V1)
V1's light mostly stood still while things appeared near it. Here it **acts**: use `lightActor(x, y, s, o)`
(rigs2.js) for the hero — `shadow:false` in the room (it floats) — with arms: `aL/aR` angles, `holdL/holdR(hx,hy)`
callbacks to hold props at the hands (the pen, the plane, a card), `wave`. It opens the notebook with its hands,
pins cards, catches the plane, holds the pen to strike the line. Faces change through `mood(t, keys)` with emotes on
every event it witnesses. The other lights are characters too: `roomBox` with `win`/`face`/`lo` when close, and
`lightActor` with their own colour when they come into a room. The outsider is `starActor`. Anticipation before
actions, overshoot and settle after, something moving in every shot, the camera moving in every shot.

## Rules
- Write ONLY your own chapter file(s) in `src/ch/`, each wrapped in `(() => { ... })();`. Replace the existing file
  entirely (c02's current file is an early draft; the others are stubs). Do not edit shared files; if a rig is
  missing something, write a private helper inside your chapter.
- **No cross-chapter globals.** Other chapters are being painted at the same time. Agree with your neighbours through
  STORYBOARD's boundary states (the light's position, the camera, what is on the wall), not through `window.*`.
- Your shots must tile your chapter's range exactly, first shot starting at the range's start, last ending at its end.
- Verify by rendering, and LOOK at what you render (Read the image):
  `node render.mjs --sheet=t1,t2,... --cols=3 --w=640 --out=out/check/<name>.jpg` (prints ms/frame and page errors)
  `node render.mjs --strip=a:b --every=2 --out=out/check/<name>.jpg` for motion. **Page errors must be 0.**
  Check every event time in your range lands on screen, the boundaries match your neighbours, nothing is frozen.
- Hand back: what each shot does, the event times you hit, the sheets you checked, anything you could not do.
