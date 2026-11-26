# pane E, L250 read: first pass on the diff 0ab6cc8..59a54e3, written BEFORE either hand-back was opened (2026-11-26 ~05:34 local)
1. panel.js setMode during an in-flight pick: setMode re-picks shownKey (the PREVIOUS shown layout), not the one still reading, and does not bump
   seq when nothing is shown. Measured (e_vary.test.js V3b, V3c): nothing shown + pick B reading + Road -> B drawn as LINE under a panel that says
   Road; A shown + pick B reading + Road -> A drawn as Road, his pick of B dropped silently.
2. panel.js ignores the preview's { error } reply (send() resolves with it; pick/setNudge never look). Reached only through setNudge with a
   non-finite number (V4): afterwards a new pick is named in the panel while the OLD reference stays drawn. Whether a typed value can reach it
   depends on the number input's sanitising (to check in Chrome).
3. Nudge >= ~3.4e38 m: placeAt accepts (finite double), the model as f32 is Infinity: the reference vanishes, the panel still says shown. Cosmetic.
4. O's rule: nesting keys (ROAD valid + ROADSIDE invalid) keep 1ROADSIDE; a word that only begins with a key (1ROADSIGN) is kept; a layout that
   sets ROAD to 0 still keeps ROAD. Census on L (key_census.js, key_next.js): 0 layouts with a nest conflict, 0 kept triangles with a letter after
   the key, 0 surfaces.ini setting ROAD/KERB not valid. 41 layouts' road is all multi-digit names, 13 all lower-case: so "digits+" and
   case-insensitive are what the installed tracks need.
5. Road mode needs the AI line to place it; the kn5 has AC_START/AC_TIME dummies (tools/kn5.cjs already reads them) that could place it for a
   layout with none.
6. The panel's inline colours (veil, on-ink) cannot be reached by a look's rule without !important; Skyline makes every other pane over the view
   white (preview-hud, piece values, guide card, ask card, mark windows). Inline border-radius 6px is off L249's scale in every look.
7. Native: list_reference_tracks and read_reference_line are sync commands (Tauri runs them on the main thread); read_reference_road is async +
   spawn_blocking, and a superseded read is not cancelled (two big reads can overlap).
