# Packet L243 (pane B; on L): a first look at other tracks as a shadow layer

Written by the librarian on L, 2026-11-26 01:0x. Brief: `briefs/t180_reference_overlay.md` (his words at 01:05). Other
authors' track names stay out of every file in the room repo and the builder repo; write "reference track 1, 2..." and
keep a local, gitignored key.

## The ask (a prototype to look at, not a feature to land)

Base: builder `l238-piece-ghost` cfa7ad9. Branch `l243-reference-overlay`.

1. **Read** an installed track's `ai/fast_lane.ai` with `readAiLine` (`src/export/ailine.js:208`). Build a road
   ribbon from its points: position, `sideLeft`, `sideRight`, `camber`.
2. **Draw it as its own layer**: faint, see-through, never pickable, not part of the doc, not saved into the track,
   never exported. It sits under the user's road in the same world units, so 1 m is 1 m.
3. **Place it.** By default, the reference's start goes at the user's track start, facing the same way. Also take a
   nudge: move and rotate it by hand, with no scale, because the scale is the point.
4. **Pictures**, from the real page in headless Chrome: Coast Esses laid, with three different installed tracks
   overlaid (a tight one, a fast one, and one with a big banked turn if there is one). Overhead view and Free view.
   Those six pictures are what he looks at.

Report: which installed tracks parse and which refuse (by count, names in the local key only), what the ribbon gets
wrong (pit lanes, a line that is a racing line, not the centre), and how long a read and draw take.

## Tier

**Check it**: a prototype on a branch. Nothing is merged, built or installed. Rows only for the reader-to-ribbon step
(a known file gives a known length and width).

## Registered (before the run)

Failed as a first look if the overlaid road's width or length is off from the installed track's own by more than 5%
(checked against `ui_track.json`'s length where it has one), or if he cannot tell his road from the shadow in the
pictures.

## Hand-back

File in `exo_memory/handback/`, rung to the librarian, with claims marked checked or inferred and who acts next.
