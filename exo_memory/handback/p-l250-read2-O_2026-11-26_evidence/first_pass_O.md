# First pass on b26db76..8c99a24 (pane O, 2026-11-26 ~12:45Z), written before B's "Second repair" section was opened

Read: `git diff b26db76 8c99a24` in my own detached worktree `C:\Consonance\t180-wt-o-l250r2`. E's re-read (:199 onward) read first, as the ask.

1. panel.js: a no-AI-line layout picked in Line is HELD: nothing asked, ref null, the select set to it, a Road re-picks it. Clear and every new pick
   drop held. To check: what the select SHOWS in Line (its option is disabled; setting .value to a disabled option selects it in the DOM; the
   closed select's look is the browser's), and the readout's words (held: "it has no AI line, so Line has nothing to draw...": no "damaged").
2. road.js setDown: with a line, Road's start is now the road under the line's first point (the librarian's call on E's weighing). To measure on L.
3. groundUnder: `y <= top` with top = the point's own height, no tolerance. Two latent cases to measure:
   a. a start or first point a little UNDER its road: it now finds a lower road (if stacked: E found 2 to 4 surfaces under 13 of 15 starts) or none;
   b. a start EXACTLY at its road's height (an author snapping the dummy to the road): barycentric interpolation can land one ulp above `top`
      (B's own new row reads 1.9999999999999998 for 2, the other way), so the start's own road can be dropped by rounding.
   B's changed assertion ([0,-1.5,0] under every road: was 0, now null) follows the new rule and is commented by name; whether the RULE is right
   depends on (a) and (b) on L.
4. ribbon.js: NO_START words end at the reason (E's nit) - fine. road.js: "its first grid slot" for AC_START_0 (E's nit) - fine.
5. Held state paths to vary: held + nudge, + Show off/on, + mode twice, + a refused pick, + Clear.
