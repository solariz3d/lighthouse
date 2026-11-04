# T-180: drag handles on the ghost piece, a second way to set Extend's values. Librarian, on D, 2026-10-05 09:1x. Lap D244.

The keeper, 09:13, with a marked-up screenshot (`C:\Users\nname\Pictures\Screenshots\track drag control to change values second option for tweak .png`):
"alternative controls, every one shows the arrow where you drag and where you should click, should be on both sides like width or turn,
only marked on one side each but should be on both sides … you click and drag like the part that is highlighted and it changes the value up
or down".

## What the picture shows (the keeper's marks on the ghost of a 160 m piece)
- **Length** (white): a handle on the centreline at the piece's NEAR/far end; drag along the road.
- **Width** (red): a handle at the road EDGE at the end; drag sideways. The keeper wants it on BOTH edges.
- **Bank** (blue): handles at both edges, mid-piece; drag sideways (left edge up / right edge down).
- **Cup** (green): handles just inside the centre on both sides; drag sideways to deepen or flatten.
- **Turn** (purple): a handle at the far end's edge; drag sideways to swing the end left or right. Both sides.
- **Climb** (yellow): a handle on the centreline at the far end; drag up/down.

## The lap (A or C, after the current queue; FEEL tier: targeted tests + a real-window check + the keeper's hands)
1. **Handles on the GHOST piece (the Extend candidate)**, drawn as small marks with a double arrow showing the drag direction. They're
   shown only while the Extend fields are in use (no ghost, no handles). Every handle that has a side appears on BOTH sides (width, bank,
   cup, turn), mirrored, and dragging either one changes the same value.
2. **Dragging changes the field's value live:** the field updates, the ghost and the readout follow exactly as if typed (the D232 width
   pick path: `width.value = …; width.oninput()`). A drag sets the TARGET at the end of the piece. Shift for fine steps, Ctrl to snap to
   round numbers (5° / 10 m). Releasing leaves the value in the field; Extend commits, as now. One drag is no document edit, so nothing
   lands in Undo until Extend.
3. **Hover highlights the handle and shows its name and value** ("bank 12.0°"); the cursor shows the drag direction.
4. **No clash with the other mouse uses:** left-drag on a handle edits; left-drag elsewhere is the brush (if on); right-drag stays the camera.
   If the brush is on, handles win only when the pointer is on a handle.
5. **Tests:** a drag of each handle changes exactly its field and the ghost; the two mirrored handles change the same value; Shift/Ctrl
   steps; no handle without a ghost; the export is unchanged (fixtures 0 of 9, since nothing reaches it).
- **Later, not now:** the same handles on an EXISTING piece (select it, then drag): that edits the document, so it waits for the D240
  selection work.

NEXT: chair queue D244 after the current queue (D239, D242, D243a, D240) when this plan is read

## D244b (the keeper, 09:17): a SCULPT mode for pieces already placed, that never moves the rest of the track
"a seperate mode to sculpt pieces once they are already put down, so they dont change the structure of the rest of the track, its mostly
just banking and cupping tweaks".
- **Checked (librarian, `lib-mirror-build`, the keeper's T-180 OVAL, one rate-brush stroke at s 1,500 m, r 60 m, then undone):** the
  centreline moved by **0.0000 m** for bank (phi), cup (c) and width (w), and by **1,175.6 m** for turn (kh). **The shape channels are
  already safe; the route channels (turn, climb) move everything after them.**
- **The mode:** a "Sculpt" switch beside Extend/Brush. In it:
  - only the SHAPE channels are offered: bank, cup, width, edge angle, edge start, wall rise and tube sweep. Turn and climb aren't there.
  - Click a piece (D240's selection) to show D244's handles ON THAT PIECE (bank and cup at both edges, width at both edges); dragging
    reshapes it in place. A one-channel rate brush stroke along the road also works, limited to the shape channels.
  - Every sculpt edit asserts the centreline is unchanged (a test, and a runtime guard that refuses by name if a future channel ever
    moves it).
  - Each drag is ONE undo step (and one History entry, D242 item 8).
- **Tests:** a sculpt of each shape channel leaves every centreline sample bit-identical; the joints stay C1 (D190's rule); turn and climb
  can't be chosen in Sculpt; fixtures 0 of 9.

NEXT: chair queue D244b with D244, after D240 (it needs the selection), when this is read
