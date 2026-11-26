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
