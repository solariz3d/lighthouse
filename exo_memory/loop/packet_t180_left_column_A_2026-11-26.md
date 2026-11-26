# Packet L254 (pane A builds, pane C reads; on L): the left column flush to the edge, and it clears away when the pointer leaves

**His words, 05:41:** "yes fix the one question. keeep it to the edge. also, when the player hovers mouse off of it, it goes
fully opaque, then comes back when you put your mouse over it to open up more space for the preview. The left side as in
where the equation dials sit"

**Read as (the librarian's reading; say so if the code or his words point elsewhere):**
- "keeep it to the edge": the left column (`#left`, the panel with the Extend fields) sits flush against the window. Today
  it is 12 px in (`index.html` `#left { margin: 12px 0 12px 12px }`, A's L249 "Said plainly" 1). Corners stay square.
- "goes fully opaque ... to open up more space for the preview": his purpose is more room for the preview, so the column
  fades **out** (see-through) when the pointer leaves it, and comes back when the pointer is over it again. He wrote
  "opaque"; the purpose says clear. He has been told this reading.

## The change (builder, branch `l254-left-column` from `l249-chrome-refactor` 40e931e; P is reading 40e931e, so do not add to that branch)
1. **Flush:** `#left` meets the window's left edge, the header above it and the window's bottom. Everything placed
   relative to its old inset moves with it (the HUD strip's `left: 274px`, the values band, the view label, the guide
   card if it keys off it). No skin sets a margin, so this is index.html's.
2. **Clears away:** when the pointer has left the column, it fades to fully see-through and the preview shows where it
   was. When the pointer comes back over where the column sits, it returns.
   - It stays shown while any field or button inside it has keyboard focus, while a value in it is being edited or
     dragged, while one of its own pop-ups (a select, the picker, a menu it opened) is open, and while a piece ghost's
     Place piece / Cancel row is up.
   - A short delay before it clears (about 0.4 s) and a short fade (about 0.2 s), so crossing it does not flicker;
     `prefers-reduced-motion` gets no fade, only the switch.
   - Cleared, it must not eat clicks meant for the preview except in a narrow strip at the window's left edge that
     brings it back; say what width you chose and why. A click that lands on the cleared column never presses a hidden
     button.
   - A screen reader and the Tab key still reach its fields; tabbing in brings it back.
3. A Settings switch is **not** asked for. If the behaviour needs an off switch to be testable, say so; do not add one.

## Tier and rows
**Build it** (it changes where every click on the left of the preview goes). Rows, red first:
- in every look, `#left`'s box starts at x 0, meets the header's bottom and the window's bottom, and its corners are 0;
- nothing that was placed against the column overlaps it or leaves a 12 px gap (the HUD strip, the values band, the view label);
- pointer out → after the delay its computed opacity is 0; pointer in → 1; with a field focused it stays 1 with the
  pointer out; with a ghost's Place piece row up it stays 1;
- cleared, a click at a point over the old column but outside the return strip reaches the preview's canvas, and no
  button in the column receives it;
- Tab from the header into the column brings it back.
Touched tests only; the whole suite once at the landing. Known red at this base: row 7 (E's L253).

## For his eye
Two pictures per look from the real branch: the column shown, and cleared with the preview where it was. And a short
clip or three frames of the fade in one look. Uncommitted; the librarian shows them.

C reads `40e931e..tip` after A's hand-back: vary the pointer path (a fast cross, leaving through the header, leaving the
window), a drag that starts in a field and ends over the preview, a narrow window, and each look.

Hand-backs to the librarian, claims checked or inferred. No install, no release; his app is not touched.
