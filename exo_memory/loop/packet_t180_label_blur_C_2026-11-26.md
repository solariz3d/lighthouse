# Packet L251 (pane C builds, pane P reads; on L): real blur behind the label windows on the road

**His words.** 02:23: "lets see the blur in an artifact". 02:33, on the mock: "i like the styling, but not the circuluar
design choice for the few that have it". 04:49: "I like the blur i think..." (a lean yes). All in
`briefs/t180_ui_declutter.md`. The mock he saw: `handback/p-l245-blur-mock-C_2026-11-26.md` (yours).

**Why it is a build and not a token:** a window drawn on the canvas cannot blur what is behind it. The label windows
(`app/core/markwindow.js drawWindow`, called from the label in `drawExplained`, the readout and the brush box) become
HTML elements over the stage, styled by each look's own panel rule, so `backdrop-filter` is real. Your L245 hand-back
lists what moves: about four call sites; the placement maths stays.

## The change (builder, branch `l251-label-blur` from `l249-chrome-refactor` 40e931e; P read 40e931e CLEAN)
1. The label windows are elements, placed by the same maths and the same "never over each other" rule as today.
2. Each look's window keeps what L249 gave it: the corner is `--mark-win-radius` (r1 × the look's factor), the fill,
   sheen and glow as they are. Add only the blur, from the look's own panel blur. SIGIL has no panel blur today; say
   what you chose for it and why.
3. They take no pointer events: a camera drag that starts on a window, a mark press under one, and a handle drag
   through one all behave as at 40e931e.
4. No element is made or removed per frame of a drag: the same nodes are reused and only moved. Say how many nodes a
   busy road carries.
5. `prefers-reduced-transparency` (and a look that sets no blur) gets the solid fill with no blur.

## Tier and rows
**Build it** (it moves drawing out of the canvas for every label on the road). Rows, red first where a promise is new:
- `app/test/core-mark-labels.test.js` (18 rows read words and boxes off the recorded canvas): amend by name to read the
  elements; every promise kept (the words, the boxes, no overlap), none weakened;
- `markwindow.test.js` W1 to W7 still hold, or say which changed and why;
- per look, a shown window's computed `backdrop-filter` is the look's blur and its corner is `--mark-win-radius`;
- a pointer press at a window's centre reaches what is under it (the canvas, or the mark);
- during a 60-step drag the count of window nodes does not change.

Touched tests only; the whole suite once at the landing. Measure the frame interval with eight windows shown against
40e931e only if `node consonance/tools/heavy-run.js --status` shows both slots free; else mark it inferred from L245.

## For his eye
One picture per look of a hovered bank mark's window over the road (not over open sky, so the blur shows), from the
real branch, beside the same shot at 40e931e. Uncommitted; the librarian shows them.

Hand-back to the librarian, claims checked or inferred. No install, no release; his app is not touched.
