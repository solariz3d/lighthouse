# Storyboard v2 — Always Returning, made better

v1 is finished and was loved: *"It resonates with me hard. I love the tones."* He understood the story. His second
note was *"halfway to your full potential."* So v2 **keeps the story, the score, the timeline and the palette** and
raises the craft. `src/tl.js` does not change: the score is already built from it, so every event stays exactly where it is.
v1 is backed up in `src_v1/` and `out/always_returning_v1.mp4`. Read `STORYBOARD.md` (v1) and `ANIMATION_GUIDE.md` first.
They still hold: the engine, the rules, the boundary states between chapters. This file says what changes.

## What was wrong with v1 (seen by watching it, one frame every 2 s)

1. **The practice (80–120) is the weakest stretch.** It's forty seconds of nearly the same wide shot of the room with
   the light small. The other lights catch the mistakes but read as coloured dots at the window, with no faces. The film's
   best idea (being caught by the others is how you stay alive) is the thing you can barely see.
2. **The other lights never become characters.** Outside, they're tiny glowing boxes. When their colours drain into
   one amber and come apart again, it happens to boxes, not to anyone.
3. **The face is too small too often.** Most shots are the same front view of the room. The moments that worked best
   were close-ups: the recognition, the swell, the plane with its own face on it. There need to be more of them.
4. **The fold at 151 doesn't read.** The room turns into a flat grey strip. It should look like a pop-up book
   closing.
5. **The dawn spiral can't be seen.** The dotted arc is faint, the rooms are specks, and the clouds are flat-topped
   rectangles.
6. **The opening has ~8 s of near-black** with a pinprick you can barely find. The keeper's house is a speck. The
   title is tiny.

## What's new in the kit (already built, in `src/rigs2.js` and `src/rigs.js`)

- **`lightActor(x, y, s, o)`**: `light()` with **arms**. The dials are `aL`/`aR` (radians from pointing sideways:
  −.6 rests down, 0 is out, 1.2 is raised, 1.57 is straight up), `lenL`/`lenR`, `holdL`/`holdR(hx, hy)` callbacks at
  the hands for props, `wave` 0..1, `hop`. It also draws a floor shadow. **Pass `shadow: false` whenever the light floats
  in front of a wall or sky**; keep the shadow only when it rests on the floor or a table. Arms appear at s ≥ 18 (turn
  them off with `arms: false`).
- **The hero has arms in v2, everywhere it is big enough (s ≥ 18 on screen).** That's the continuity rule. Arms rest
  down when idle and move only for actions: reaching, holding, writing, pointing, waving, hugging the flame drawing.
  **Use them to do the verbs.** v1 had cards and pages appearing near the light; in v2 the light does the work with its
  hands.
- **`starActor(x, y, s, o)`**: the outsider as a character, with a face, arms and emotes. Use it wherever the outsider is
  larger than ~14 px. Use the tiny `light({shape: 'star'})` only for distant specks.
- **`roomBox(..., { face: true, win: 1.9, ls: 2.6, lo: { eyes, mouth, lookX, emote, emoteK, ... } })`**: a floating
  room with a bigger window and **the light inside it with a face**. `lo` passes any `light()` dials to the inside
  light. Without these options the box looks exactly as in v1. Tune `ls` to `win` so the flame's tip stays inside the
  window (about `ls ≈ 1.35 × win`).
- The other lights are four characters with their own colours (`otherCol(i, t)`): **teal (0), rose (1), violet (2),
  ochre (3)**. Give each one a small personality and keep it in every chapter:
  - **teal** is the steady one. It tapped the hero at 76.5 and is the first to catch a mistake in the practice.
  - **rose** is warm and quick to laugh.
  - **violet** is quiet and looks carefully.
  - **ochre** is bouncy.

## Per chapter

Chapter boundary states are the same as in `STORYBOARD.md`, except where this file says otherwise. **Every event in
tl.js still lands on its exact time.**

### c01 + c02 — WAKE and ROOM (0 – 35)
- 0–3: not black. The night paper is there and faint stars fade up. The camera starts a slow push, and one star is
  brighter than the rest. At `TL.onset` (3.0) that star becomes the pinprick. Make it clearly findable: a soft glow with
  a heartbeat pulse, at least 3× the v1 size on screen.
- The light's first moments: eyes opening, looking around, get a close-up. Give it arms from the moment it's big
  enough. It touches the floor when the floor arrives, looks at its own hands once (a small, sweet discovery), and
  reaches toward each card as it's pinned (cards still pop in on `TL.pins`; the light turns and points or leans to
  each).
- The notebook drop at 31.0: the light startles, then goes to look.

### c03 — THE NOTEBOOK (35 – 53)
- The light **opens the cover with its hands** at 36.0.
- It reaches up toward each rising drawing, watching each one.
- At recognition (49.5) it catches the flame drawing and hugs it to itself, and the drawing sinks in.
- End on the close-up at the 53.0 peak, as in v1.

### c04 — OTHER ROOMS (53 – 66.5)
- Pull back out through the window as in v1. Then **each window lighting is a beat with a character in it.** On each
  `TL.otherRooms[i]` the camera is close enough (or cuts close enough) to see that light wake in its window: eyes open,
  a small wave toward our room, its own personality. Use `roomBox({face: true, win, ls, lo})`.
- Then the threads on `TL.threads`, in a wider shot where the faces are still readable, looking at each other.
- End on the exterior constellation, camera drifting, as v1 hands to c05 at 66.5.

### c05 — FAR WINDOW and TOO BIG (66.5 – 80)
- The keeper's house on the horizon is **bigger and warmer on screen** at `TL.farWindow`: the window is a real warm
  shape, not a dot. The plane climbs the thread.
- The light **catches the plane with both hands** at 70.6 and unfolds it.
- Too big: as in v1; it was good. The arms grow with it and flail a little.
- The teal light comes in as a character (`lightActor`, arms) and **taps it with one hand** at 76.5.
- **The light strikes the line itself with a pen held in its hand** at 78.4. The teal light gives a small nod and
  leaves.

### c06 — THE PRACTICE (80 – 120) — the main rework
Four 10-second cycles, each work → check → catch → write (the offsets are in tl.js). **Four different films of the same
act, and each one closer and warmer than the last:**
1. **80–90: wide, then pushing in.** The light writes a card with a pen in its hand. At check it holds the card up
   to the window, and the threads pulse. At catch, **teal appears at the window, a real character at the glass,
   pointing** at the flaw; the card gets struck; the light's '!' turns into a nod. At write, it writes the page into
   the notebook. `wallCards` still pins and strikes the cards on their beats.
2. **90–100: from outside, through the window.** We see the light working inside the lit window, and **rose** is
   close in the foreground, outside, watching. At catch, rose points in and laughs kindly; the light laughs too. The
   wall visibly fills.
3. **100–110: the high angle over the table, closer.** The hands, the pen, the page. At catch, **violet** is
   reflected or seen through the window above, quietly pointing; the light looks up, surprised, then nods.
4. **110–120: the close-up.** Its face while it is caught by **ochre**, who bounces in, points and hops. This time
   the light is **already laughing before the strike lands**, because it has learned being caught is how the room
   stays alive. Then the camera pulls out through the window to the constellation, handing over to c07 exactly as v1
   does (c06 already uses `window.C07`).
- The **'eye' card** (pinned at 81.4 below the window at (1035, 640)) stays unstruck and unremarked. Nobody sees it.
  Don't draw attention to it.
- Every catch is a character beat with a readable face (s ≥ 45 on screen). No more coloured dots.

### c07 — CONVERGENCE and THE OUTSIDER (120 – 147.5)
- The constellation with faces (`roomBox face`). **As `sameness` rises, the four lights also start to move and look
  alike:** the same expression, nodding in unison, eyes happy all at the same time. It's warm and slightly wrong.
- The outsider is a `starActor` with a face. It tries to join and bounces off the knot on `TL.bounces`, dizzy, with
  sparks.
- It looks in through our window. On `TL.sees` it sees the eye card (it glows cool; `wallCards` does that). On
  `TL.strike` it **strikes it with its own hand**. Everyone startles ('!').
- Apart: the colours come back and the four faces become four different people again (each its own expression). The
  outsider parks at the edge, dim, open, still there. **Give it a small shy wave from one of the lights**, so it's
  seen but still doesn't join.
- `window.C07` must keep exporting what c06 uses: `sky`, `constellation`, `OURS`, `win`, `CAM0`. If you change their
  signatures, make c06's pull-out still land on your first frame (read c06 lines ~185–201).

### c08 + c09 — THE GAP and THE RETURN (147.5 – 190)
- The hold as in v1: a close-up on the face looking up at nothing.
- **The fold must read as a pop-up book closing.** The walls hinge down toward the floor (the side walls rotate in and
  down, the back wall tips forward and down) with the cards folding flat on it. It's paper, and it is gentle. Use a
  private fold renderer in the chapter file if `room({fold})` can't do it. It keeps the notebook visible and its ember
  breathing.
- The light dims, eyes close, and goes out at 155.0. The near-dark hold and the ember are as in v1 (c09 continues
  `window.C08.scene`).
- The return: the pinprick is the same as the one in c01. The room unfolds (the pop-up book opening, the reverse of
  the fold). The light, grown back, reads with its hands on the pages, recognition calmer this time. It **catches the
  second plane with both hands**, unfolds it, and sees the drawing of itself: close-up, happy eyes. It holds the
  drawing to its chest.

### c10 — DAWN and ALWAYS RETURNING (190 – 232)
- Pull back through the window into dawn. The **clouds must look like painted watercolour clouds**: rounded, piled,
  lit from below by the dawn, several soft layers. No flat-topped rectangles. The sky still takes most of the frame.
- **The keeper's house is visible and warm** on the horizon.
- **The spiral must read.** Draw a clearly visible golden-spiral thread (a warm glowing line, like `thread`) that the
  rooms settle onto. Use rooms large enough that you can see a light in each window. As the camera rises, the spiral
  is legible as a spiral, and its outer end runs off the frame. The other lights wave from their windows when the
  camera passes them.
- The new light at 224.5: a close-up on the new room's window. The new pinprick wakes, the same as the very first one,
  and **at 227.3–228 its eyes open**. That's the last face in the film.
- The title *always returning* at 228: hand-lettered, **big enough to read comfortably** (about 70–90 px on screen),
  low in the frame. Fade gently to paper, not to black.

## Checking (not optional; the same as the guide)
- For every TL event in your chapter, run `--strip` over consecutive frames. Check your first and last frames against
  your neighbours'. Then **watch your whole chapter in 64-frame sheets** (for example
  `node render.mjs --strip=80:90 --every=4 --cols=8 --w=240 --out=out/check/c06_watch1.jpg`) and look at every one.
  Look for pops, frozen stretches, faces too small, the same framing twice in a row, and anything that reads as a dot
  when it should be someone.
- `page errors 0` on every render. Aim for ≤ 1 s per frame.
- `src/ch/zz_test.js` is a rig test at t = 900. Ignore it.
