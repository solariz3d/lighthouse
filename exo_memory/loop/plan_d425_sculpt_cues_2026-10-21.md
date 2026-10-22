# D425: each Sculpt tool shows how it works, on the road, the way Build does when placing a piece (librarian, 2026-10-21)

## The ask

The keeper tried 0.4.12, on 2026-10-21 at 06:55. His words: "it works, but each tool needs UI much like the original builder placing pieces to indicate to the user how it works".

## What exists now

These are the files at local-0.4.12, a795359, in `t180-wt-land412`:

- **Build** shows a ghost of the piece before it is placed, on hover and as the fields change (`app/core/panel.js:293-296`, `t180-ghost`). It also has handles on the road (D-front handles, the turn handle).
- **Sculpt** has nothing on the road before the press. The only explanation is each tool's text hint, in the tool list (`app/core/panel.js:385-394`) and the select's title. A first-time user has to drag to find out what a tool does.
- The design that set Sculpt's shape is `exo_memory/handback/p-d421-sculpt-design-P_2026-10-20.md`.

## The parts

**Part 1, P: the design.** Tier: check it. This is design only, with no code.

For each of the 9 tools, plus Wall rise, design what the road shows. Cover at least these:

- **(a) Before the press, on hover:** the brush's reach on the road. Show where it starts and ends, sized by the radius ([ ]).
- **(b) The drag direction:** an on-road arrow or glyph for the drag's direction and what it does. For example, Grab ↕ lifts, Bend ↔ turns, Stretch ↕ along the road. Show Alt's other axis where a tool has one.
- **(c) What moves:**
  - The road after the brush, for Stretch, Bend and Climb. On a closed lap this includes the seam piece the release re-closes with.
  - Only the brush's stretch, for Grab, Twist, Width, Cup, Edge and Wall.
- **(d) During the drag:** the value as it changes, and where it shows. B's value line already exists; say what it adds.
- **(e) How it matches Build's look:** colours, the ghost, and how handles read.

Also name, for each item, the file and seat it falls to: the preview overlay (E), or the page and strip (B). Give the frame cost each adds at row 3 and row 4a. P may take screenshots from the installed build only headless, with `--mute-audio`.

**Part 2, the librarian: the ruling.** The keeper may veto.

**Part 3, E: the on-road overlays.** Tier: check it. The overlays must not push the sculpt-frame bars over (row 2 at 6.0, row 4a at 6.0). Row 3's p95 is already red at 6.9 to 7.3 and must not get worse.

**Part 4, B: the strip and the page side,** as the design assigns.

**Part 5:** P reviews; a landing pane lands it; E installs it.

## Not in this lap

- The row 3 drag p95 follow-up. It stays a separate lap.
