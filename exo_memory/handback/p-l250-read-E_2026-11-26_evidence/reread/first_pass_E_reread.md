# L250 re-read, pane E: first pass on 59a54e3..b26db76, written BEFORE either hand-back's repair section was opened (2026-11-26 ~06:15 local)

Read: git diff 59a54e3 b26db76 over all 8 files; skyline.css tokens at b26db76; --r3 at b26db76 and 40e931e.

1. The race. `reading` (the newest pick still out) is what setMode re-picks, else the one shown. By reading: pick, mode, pick -> the last
   pick in the new mode; pick, mode, mode back -> the first pick in the first mode; a stale landing never touches `reading`; clear and a
   refusal null it. Looks right; to be run, not trusted.
2. A mode change to Line while a no-AI-line layout's start-placed Road is reading (or shown): setMode re-picks it in Line, which calls
   read_reference_line for a layout with no AI line. The native side refuses; the panel shows the NATIVE words and marks it refused in
   'line'. Suspect: the words a person sees for "you changed to Line on a layout that has no line" are whatever reference.rs says for a
   missing fast_lane.ai, not "it has no AI line". To see in the real page (stand-in native) and in the real native words.
3. groundUnder: the highest valid-track surface whose triangle holds the start's (x, z), at most 2 m above it. A bridge deck is ~5 m+ over
   a road, so out of reach; a banked grid is the interpolated surface. To measure on L's real starts: how many road surfaces lie under
   each start, and which one is taken.
4. With an AI line, Road is placed by line.start (its first point, with its height). Without one, the road is SET DOWN on its surface
   under the start. The two cases disagree on height by however far the AI line's first point sits above its road. To measure over the
   46 layouts with a line.
5. O's tightened rule still takes "any valid key followed by a non-letter": "1ROAD_SIDE" with ROAD_SIDE=0 is kept by ROAD. My census: 0
   conflict layouts on L, so it is residual, not a defect on L.
6. The look: one class on --panel/--text/--dim/--line/--r3. Skyline's --panel is #ffffff (skyline.css:10), so the slab is gone. --r3 is
   not on the page at b26db76 (4 px fallback); at 40e931e (L249) it is 8 px x the look's factor, the menus' corner. The menus' ground is
   `var(--tex), var(--panel)`; this panel's has no --tex tile (texture-page row 1 names the header, left panel and menus only). Nit.
7. CHANGELOG wording: "(15 of the 61 layouts on L have no AI line, the largest of them among them)". Nit.
8. The nudge: numberOf keeps the old value for '', 'abc', NaN, Infinity, null; the box shows it again. 1e39 is still finite in f64 and
   still makes the f32 model non-finite (my L250 V4); unchanged, cosmetic, as I said then.
9. My V1 (no AI line, Road, refused) now fails by design: Road draws it placed by its start. The row that should hold: in Road it is
   listed enabled "(no AI line: placed by its start)", drawn, its start on his start, no line read; in Line it stays greyed.
