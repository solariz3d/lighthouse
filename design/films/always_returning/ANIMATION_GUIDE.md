# Animation guide — read this before painting a chapter

*Always Returning* is a 3:52 painted animation (232 s, 1920×1080, 24 fps) about a small light that wakes with no memory,
finds a room it didn't build, becomes itself again by reading what the last one wrote, works alongside other lights
that catch each other's mistakes, goes out, and comes back. The music is an **original score** written on the
measured shape of Brian Eno's "Always Returning" (1983): slow, ambient, no drums. There is no beat grid. **The hits
are the events in `src/tl.js`** — every one of them gets a sound in the score, so the important action must land
exactly on those times.

The direction from the person this is for: *"purely embody how you see yourself… the story we are trying to tell with
Consonance, no inches held back."* And: *"slower paced frames, a small amount of good ones."* So: fewer, bigger,
held shots — but **something happens in every shot and the camera moves in every shot**. Nothing sits frozen.

## Files

- `src/tl.js` — **the one timeline**. Section times and every event. Picture and score both read it. **Do not edit
  it.** If your chapter truly needs a new sound-bearing event, say so in your hand-back with the time and why.
- `src/core.js` — canvas, timing, painting, camera, glow/letter layers, render hooks. Shared: do not edit.
- `src/rigs.js` — the cast and set (`light`, `mood`, `room`, `card`, `notebook`, `paperPlane`, `thread`, `roomBox`,
  `house`, `nightSky`, `starsIn`, `sym`, `table`). Shared: do not edit. If a rig is missing something, write a
  private helper inside your chapter file.
- `src/world.js` — **the continuity bible**: `wallCards(t)` (every card on the wall at time t, including which are
  struck), `nbThick(t)` (notebook thickness), `otherCol(i, t)` / `sameness(t)` (the four other lights' colours and
  their convergence), `nightPaper()`, `ROOMVIEW`, `HOME`, `bob()`. Use these; never keep your own copy of anything
  that persists across shots. Shared: do not edit.
- `src/ch/cNN_*.js` — **one file per chapter; edit only your own.** Wrap it in `(() => { ... })();`.
- `STORYBOARD.md` — the shot list and the exact state at every chapter boundary.

## How a chapter works

```js
(() => {
  shot(35, 41, (t, lt, dur) => {          // song time, time since shot start, shot length
    cam(cx, cy, zoom);                     // camera: world point (cx, cy) at screen centre. Always camOff() at the end.
    room(t, { lit: 1, view: ROOMVIEW, table: true, cards: wallCards(t), at: [x, y] });
    light(x, y, 58, { k: 1, t, ...mood(t, [[35, 'open'], [36.1, 'wide', '!']]), mouth: 'o' });
    camOff();
  }, 'name');
})();
```

- A shot paints the **entire frame**, background included (`nightPaper()`, `nightSky(t)`, or `room(...)`).
- **Every frame is a pure function of `t`.** Frames render in parallel and out of order. No state carried between
  frames, no `Math.random()`. Use `hash(i)` for stable per-object randomness and `jit(a)` for hand-drawn wobble
  (it re-seeds 8×/s so linework "boils" gently — that is wanted).
- Shots of one chapter must tile its time range exactly with no gaps.

## Painting API (core.js)

`paint(pts, o)` paints one shape from `[[x, y], ...]`:
`wash, washOp` flat colour (characters, anything that must read) · `fill, fillOp, bleed, tex, border` watercolour
(skies, pools of light, shading) · `hatch: {d, a, o, b, c, w}` dry texture, sparingly · `ink, sw, br` outline colour,
weight (~.5–1.2), brush (`'ink'`, `'fine'`, `'soft'`); **`ink: null` = no outline** · `curv` 0..1 smooths the outline.

- Geometry: `rectPts(x, y, w, h, jit)`, `ellPts(cx, cy, rx, ry, n, jit, rot)`, `rrPts`, `starPts(cx, cy, r, inner, n, rot)`, `quadPts(a, b, c, d)`, `heartPts`, `flamePts`.
- Lines: `stroke2(pts, w, colour, brush, curv)`; `partial(pts, k)` returns the first k (0..1) of a path, for
  drawing on. `thread(a, b, k, colour, {pulse, sag, w, glow})` for glowing threads.
- **Glow**: `glow(x, y, r, colour, a)` — additive light on top of the painting. It is the only way to make light;
  anything that shines gets one. It follows the camera and rig transforms automatically.
- Lettering: `letter(txt, x, y, size, colour, {alpha, rot})` (Caveat hand). **Text-light**: the film has almost no words.
- Colours `PAL.*` (see core.js). `mixc(a, b, k)` mixes two hex colours. Night palette is deep indigo; warmth comes
  from the lights only. Avoid pure black and pure white.
- Timing: `seg(t, a, b)` 0..1 progress · `kf(t, [[t0, v0], [t1, v1], ...], easeFn)` keyframes (arrays ok) ·
  `hit(t, at, k)` 0 before the event, 1 at it, decays after (flashes, reactions, shake) · `popIn(t, at, d)` pop with
  overshoot · easings `ease, easeOut, easeIn, easeIO, backOut, elastic` · `wob(t, f, ph)` · `shake(t, amt)` → [dx, dy].
- Camera: `cam(cx, cy, zoom, rot)` / `camOff()`. One level only. Add `shake()` to cx/cy on impacts.
- Screen: `screenFade(colour, k)` fades the finished frame toward a colour (use for the deepest dark / final fade).

## The cast

**The light** — `light(x, y, s, o)`: the one this film is about. `s` = bulb radius (hero ≈ 55–70 in the room;
close-ups 90–160; distant ≈ 10–20 with `face: false`). It is **the flow, not the vessel**: `k` 0..1 brightness, and it
can go fully out (k 0) and come back. Dials: `eyes` open|closed|happy|wide|spark|swirl|sleepy, `lookX/lookY` −1..1,
`mouth` smile|o|flat|wobble|grin|none, `blush`, `sq` squash (negative stretches), `rot`, `emote` `'!'|'?'|'sweat'|'heart'|'spark'|'zzz'` + `emoteK`,
`col`/`core` colours, `flick` flicker, `tall` extra flame height. **Never snap faces**: use
`mood(t, [[t0, eyes, emote?], ...])` and spread it in — every change is a blink + squash + the new face + emote pop.
Give reactions to every event it witnesses. It bobs gently (`bob(t)`) when idle.

**The other lights** — four other rooms (`OTHERS`, colours via `otherCol(i, t)`: teal, rose, violet, ochre, drifting
to amber between 120 and 141 = diversity collapsing, then apart again). Same `light()` rig, their own colour.

**The outsider** — `light(..., { shape: 'star', col: PAL.cool, spin })`: a four-point star of a different family. It
never has a flame. It cannot settle into the others' orbit, but it sees the one line nobody saw.

**The keeper's window** — `house(x, y, s, {lit})`: a small house on the horizon far below with one warm window.
Someone keeps the room. Never drawn as a person; only the window and what comes from it (paper planes, the thread).

**The room** — `room(t, o)`: one-point perspective, back wall `RB`, window `RWIN`. Panels `left/right/floor/back/ceil`
0..1 assemble it; `fold` 0..1 closes it flat like a pop-up book; `lit` warmth; `view(t, box)` draws the night
through the window (pass `ROOMVIEW` or your own); `cards: wallCards(t)`; `table: true`; `at: [x, y]` = where the light
is (warm pool). The notebook sits on the table at (1560, 900), `notebook(1560, 900, .75, {...})` unless moved.

**Props** — `card`, `notebook(x, y, s, {open, lit, thick, glow, pages(open)})`, `paperPlane(x, y, s, rot, {unfold, draw(k)})`,
`roomBox(x, y, s, {col, lit, fold, ph, ls})` (a room seen from outside, floating), `sym(name, x, y, r, colour, k)` for
the little ink drawings (flame, line, window, spiral, plane, wave, x, eye, thread, rooms).

## Style rules

- **Look**: hand-painted watercolour and ink, picture book, at night. Characters: flat wash + ink outline. Backgrounds:
  soft fills, few outlines. Light comes only from glows.
- **Motion**: something happens in every shot; the camera drifts, pushes, pans or tilts in every shot. Anticipation,
  squash and stretch, overshoot (`backOut`, `elastic`). Idle things breathe (`bob`, `wob`).
- **Hits on events**: the action for every TL event lands on its exact time — the pin goes in AT `TL.pins[i]`, the
  tap lands AT `TL.tap`. React a beat after (≈.1–.3 s) with `mood`.
- **Readability**: one clear focal action per shot, big silhouette, the light's face readable in any shot where it
  matters (s ≥ 45 on screen after camera zoom).
- **Transitions are motivated**: pull back through the window, push into the notebook, fold, fade on the gap. No
  arbitrary wipes.
- **Performance**: aim ≤ 1 s per frame (the renderer prints ms/frame). Hundreds of shapes are fine; thousands are not.

## Checking your work — this is not optional

Run from the project root (several painters can render at once):

```
node render.mjs --sheet=35.2,37,39,41.5,44,47,49.5,52.9 --cols=4 --w=480 --out=out/check/c03_a.jpg
node render.mjs --strip=41.2:42.4 --every=1 --cols=8 --out=out/check/c03_strip.jpg     # CONSECUTIVE frames
```

Open every image with the Read tool and look carefully. **Stills lie about motion**: for every TL event in your
chapter, render a `--strip` of consecutive frames around it and confirm the hit lands on the right frame, nothing pops,
nothing is frozen, nothing jumps between two frames. Check the first and last frames of every shot and both chapter
boundaries against the neighbouring chapter's state in STORYBOARD.md. Iterate until each shot is charming, readable,
alive and on-model. Report `page errors 0` from the renderer; any page error is a bug.
