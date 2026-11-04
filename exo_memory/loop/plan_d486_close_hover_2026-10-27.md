# D486: the title bar's X does not highlight on hover. Librarian, 2026-10-27

The keeper, 06:23: "the scrubbing fast is working, found a tiny bug lol, the hit box for X close doesnt highlight when you hover over it"

## The cause, checked by the librarian at 06:25 on t180 origin/main 82afc11 (0.4.23)
- `app/index.html:92` gives the close button its red hover: `#win-close:hover { background: #b0303a; }`, specificity (1,1,0).
- `app/themes/aqua.css:60` and `app/themes/glass.css:52` reset every title-bar button: `[data-theme="…"] #winctl button { background: transparent; … }`, specificity (1,1,1). That rule outranks the hover, so on aqua and glass the X never turns red.
- Each of those two themes restores min and max on the next line (:61, :53), but not close. aurora (:48), skyline (:39) and skyline-night (:39) each have their own `#win-close:hover` line. sigil has no winctl rules, so it keeps index.html's rule.

## The plan: one part, the first free pane (just do it)
- Add `[data-theme="aqua"] #win-close:hover { background: #b0303a; box-shadow: none; }` to aqua.css, after :61. Add the same for glass after :53. Both go after the existing min/max lines, with the colour aurora uses.
- The white X strokes on hover already come from index.html:93.
- Look at it in each of the six looks: a headless screenshot of the hovered X, muted and titled. Nothing else.
- CHANGELOG line under [Unreleased] Fixed. It rides the next batch.

## Read, 06:31 (A 31693d15 / t180 d486-a b6106130): accepted

- The diff is the two hover lines plus a CHANGELOG line.
- The before/after table shows aqua and glass going from transparent to red; the other four are unchanged.
- The librarian viewed the aqua hovered-X screenshot: red, with a white X.
- It rides the next batch. **D486 CLOSED.**
