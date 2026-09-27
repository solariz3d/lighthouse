# Merge notes — carrying the laptop version back to the desktop

The keeper, 2026-09-27, on this version: *"the overall polish is beautiful, but the structure has changed a lot from
what I want, that is okay though, we can take this version and at some point incorporate it back with the others on
desktop."*

**The rule for the merge: the structure comes from the desktop, and the acting and polish come from here.** The desktop
V5 (`Downloads\always_returning`, `src_v4/` + env) keeps V1's layout, the distances between the rooms, the shot order,
the cameras and the timing. The keeper has asked for that three times. This folder supplies what the characters DO
inside those shots.

## What to take from here (per chapter, into the desktop's matching shot)
- **c02:** the light pins each card with its own hand, alternating left and right. It lands on the floor with a squash
  and discovers its hands. The notebook drop is startled into ('!', a hop).
- **c03:** it grips the cover's corner and yanks the notebook open. The drawings peel off as paper cut-outs and its eyes
  and hands follow each one. It catches and hugs the flame drawing at recognition, and the others circle it as a halo.
  This file has its own hinged-cover notebook painter, because the shared `notebook()` pops the second page into view.
- **c04:** each other light has its own wake: rose laughs with a heart, violet is careful, green jolts and hops. The hero
  gives a hand push as each thread leaves.
- **c05:** it catches the plane with both hands overhead. The swell is escalated: it turns hotter orange, flails, and
  the room's corners darken. Teal comes in to tap it. It holds the pencil to strike the line, then presses the pin in.
- **c06:** each lap's catcher is a character at readable size (teal at the glass, rose in the foreground, violet quiet,
  green leaping in). The card is carried by hand until wallCards takes it. Do not bring over the staging of lap 3,
  which is a high angle over the table: V1's lap cameras win.
- **c07:** the faces lock into one nod during the convergence. The starActor outsider bounces with dizzy eyes, sees the
  card, and strikes it with a cool beam from its hand. After the strike it and violet wave to each other.
- **c08:** everything slows on its own clock. It half-lifts a hand and lets it fall. The ember leaks from between the
  pages.
- **c09:** the new light grabs the cover's corner and flies across as the book opens. It reacts to each panel as it
  lands. It catches the plane overhead and unfolds a self-portrait with arms.
- **c10:** it lifts the drawing to the glass and sets it on the sill. The lights wave from outside. The pinprick is
  drawn in screen space so its size matches c01's exactly. The fade to paper keeps the title in ink.

## Differences between the engines
- Here `core.js` and `rigs.js` came back as early drafts. `mix` was renamed `mixc` and `plane` was renamed
  `paperPlane`, because the current p5 claims both names. The desktop engine already uses the later names, so no action
  is needed there.
- The desktop's `render.mjs` has `--encode`. The one here doesn't; ffmpeg was run by hand (see CHANGELOG).
- Chapter files here are self-contained, with no `window.*` globals between chapters. The desktop chapters do share
  some (`RETURN_SET`, `C07`, `C08`). Keep the desktop's.

Carry this whole folder (minus `node_modules` and `out/frames`) on the stick when it's time.
