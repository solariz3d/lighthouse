# T-180: the turn handles and labels are too cluttered

## His words and pictures

- 2026-11-26 00:47 (L), on the piece-ghost build cfa7ad9: one screenshot, no text. His file name: "it is way too
  cluttered the UI representing the turns". Copy: `briefs/t180_ui_cluttered_turns_2026-11-26.png`. In it, the S (his
  Smooth S straight) seen in Free view, circled in red. It shows six label boxes ("Bank · passes −20.00° at 80.00 m drag
  to move it", "Extra turn · 80.00 m → 200.00 m · turns over 120.00 m drag to start earlier or later", and others), each
  over the road, plus a double-arrow handle pair at every mark (about 25 arrows).

## What exists (checked by the librarian)

- The labels come from `panel.js:1424-1443` (`label: ST.markText(...)`, `lit:` when hovered or dragged) and the handles
  from handles.js. There is already a "drag handles" checkbox (`panel.js:776`); with it off, the ghost shows only on
  Extend's hover.
- The mark labels were added at his ask and released in v0.4.40 (`briefs/t180_level_end.md:31`). So he wanted the
  information, and this ask is about how much is on screen at once.

## State

- 00:5x: packet `loop/packet_t180_declutter_A_2026-11-26.md`. A label shows only for the handle under the pointer or
  being dragged. Each mark is drawn as one small dot, and its arrows appear on hover. Before and after pictures of
  this same view go to him before any install.

## His words, 00:58 (L), after the L241 pictures

- "Since we went hard with the themes and UI design for them, we should also incorporate the themes for those windows
  for each theme u know? More work, but it is fun work imo"

## What exists (checked, builder l241-declutter 77ffe18)

- Themes: sigil (the default), aqua, skyline, skyline-night, glass, aurora (`app/themes/*.css`, picked at
  `index.html:19`).
- The label boxes are drawn on the canvas (`secondtick.js:193-201`, `handles.js:416`). They take only the theme's
  `--veil` colour; the font is system-ui, the box is square, and there is no blur, radius or glow.
- The themes' own panels have blur (`backdrop-filter`), and skyline has a `--glow`. The handle colours are fixed hex
  values in `handles.js:49-58` (width #ff5a5a, bank #4d86ff, cup #3ddc6e, turn #b968ff), the same in every theme.
- 01:0x: packet `loop/packet_t180_themed_marks_A_2026-11-26.md` (L242), to go after C's read of L241.
- 01:2x (L): L242 pictures sent (`handback/p-l242-themed-marks-A_2026-11-26_evidence/pics/`). Open with him: per-theme mark colours, and whether glass needs real blur (that would mean HTML windows).
