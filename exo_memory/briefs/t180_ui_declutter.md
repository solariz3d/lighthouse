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

## His words, 00:58 (L), after the L241 pictures

- "Since we went hard with the themes and UI design for them, we should also incorporate the themes for those windows
  for each theme u know? More work, but it is fun work imo"

## What exists (checked, builder l241-declutter 77ffe18)

- Themes: sigil (the default), aqua, skyline, skyline-night, glass, aurora (`app/themes/*.css`, picked at
  `index.html:19`).
- The label boxes are drawn on the canvas (`secondtick.js:193-201`, `handles.js:416`). They take only the theme's
  `--veil` colour; the font is system-ui, the box is square, and there is no blur, radius or glow.
- The themes' own panels have blur (`backdrop-filter`), and skyline has a `--glow`. The handle colours are fixed hex
  values in `handles.js:49-58` (width #ff5a5a, bank #4d86ff, cup #3ddc6e, turn #b968ff), the same in every theme.
- 01:0x: packet `loop/packet_t180_themed_marks_A_2026-11-26.md` (L242), to go after C's read of L241.
- 01:2x (L): L242 pictures sent (`handback/p-l242-themed-marks-A_2026-11-26_evidence/pics/`). Open with him: per-theme mark colours, and whether glass needs real blur (that would mean HTML windows).

## His words, 02:23 (L), answering the four
- "1. yes. 2. hmmm, lets see the blur in an artifact. 3. yes handle colors per theme. 4. Yes, and it can be accessed
  through the other saved tracks that already exist in the assetto track folder, it doesnt create it through our
  system, just renders the total shape of the track to see within the preview"
- So: install L241+L242 (0ab6cc8) on L (L244a, pane A, once the builder is closed); a blur mock artifact (L245, pane C);
  per-theme handle colours (L244, pane A, after the install).
- 02:3x (L): blur mock https://claude.ai/artifact/85aiPQ31PPitFfHU1Sducb (L245). Panels are 80-95% opaque, so the blur shows only as a soft smear; a thinner fill would show more road.

## His words, 02:33 (L), on the blur mock
- "i like the styling, but not the circuluar design choice for the few that have it, looks so cheap to me. I wonder, we
  have spent a lot of time trying to make things I like without it looking too much like as well what others would
  call AI slop design, this feels to me closer to agreeing with those idiots lol. I think we should look up and research
  a design doc or repo to learn more how to do clean UI design that goes with the aesthetics we want."
- The rounded ones in the mock are aqua (18 px), aurora and skyline/skyline-night (16 px). L242's canvas windows carry
  aqua 10, aurora 8 and skyline 12 px.
- Prior art, surfaced by the librarian: `research/ai_slop_ui_survey_2026-10-29.md` (section 3, "What reads as crafted";
  :57 names glass and aurora themselves as top-tier tells), `research/ui_unslop_guide_2026-10-27.md`, and C's audit of
  our screens `handback/p-d546-slop-audit-C_2026-10-29.md`. They say what slop IS. A positive design doc or repo
  to learn FROM is not on disk. That is L246.
- 02:37 (L): "if we find good research. We defintelly need to do a whole UI refactor, but keep all the plumbing."
  So L246's findings feed a UI refactor: the look and layout change, while behaviour, data, the core, export and the
  native side stay as they are. The refactor is planned only after the research lands and he has read it.

## His words, 2026-11-26 04:49 (L), on the refactor draft, the shadow tracks and the blur
- "the refactor looks good enough. 2. Yes finish the rest. 3. I like the blur i think... Also to your recommendation,
  how much are you planning on refactoring? Like the whole style and design of each themes UI? I like some of it, like
  the backdrops, but i suppose it can always be done better"
- Read as: the draft goes ahead as shown (docked, the drafted factors); the shadow tracks get both the ribbon and the
  full road; the blur on label windows is a lean yes.
- State: L249 (`loop/packet_t180_chrome_refactor_ACE_2026-11-26.md`) is the refactor: corners, pills, glows, shadows and
  focus only; backdrops, colours, fonts and layout stay. L250 (`loop/packet_t180_shadow_tracks_BO_2026-11-26.md`) is the
  shadow tracks. The blur is L251, queued behind L249 because both touch how a label window is drawn.
- 05:3x (L): L249 built and merged: builder `l249-chrome-refactor` 40e931e (pushed), `handback/p-l249-chrome-A_2026-11-26.md`
  (with C's and E's). theme + markwindow 21/21; texture-page 12/13, the red is row 7 (known, L253). The before/after
  page from the real branch is published for him: https://claude.ai/artifact/BG2GrkaJoj6dMaNWAmfRun (36 pictures; the
  librarian opened two first). Open with him, from A's "Said plainly": the left column is not flush to the window, it
  sits 12 px in (`index.html` `#left { margin: 12px 0 12px 12px }`), so it is a floating panel with square corners;
  flush, or floating with the 12 px corner, is his call. P reads next.

## His words, 2026-11-26 05:41 (L), on the left column
- "yes fix the one question. keeep it to the edge. also, when the player hovers mouse off of it, it goes fully opaque, then
  comes back when you put your mouse over it to open up more space for the preview. The left side as in where the equation
  dials sit"
- Read as: the left column flush to the window's edge; and it fades out (see-through) when the pointer leaves it and
  returns when the pointer is over it, since his purpose is more room for the preview. He wrote "opaque"; he has been
  told the reading. L254: `loop/packet_t180_left_column_A_2026-11-26.md` (A builds, C reads).
- 06:1x (L): the read of L249 by pane P is **CLEAN** (`handback/p-l249-read-P_2026-11-26.md`): 33 of 34 rows (the red is row 7,
  since fixed on `l253-row7`); the amended focus row fails on 3 of 3 planted pages; a look switched live equals a fresh
  load, 0 of 9 differ. Left for a small lap (L255, pane O): Export has no hover in aurora and the two Skylines; the menu
  titles in SIGIL have none; the File menu runs 55 px off the left edge at 900 px wide; a clicked field wears its border and
  the ring together. The blur on label windows is dispatched (L251, pane C). P reads L254, L251 and L255.
  Open with him: L249 carries the per-theme handle colours of L244, and the record has no word from him on those pictures.
- 06:13 (L), his words, on whether to keep the per-theme handle colours: "what do u think". The librarian answered keep them: the white length mark of today sits 40 RGB from the white road edges in SIGIL (`handback/p-l244-theme-colours-A_2026-11-26.md`, `palette_check.txt`), the W5 row holds every mark 60 or more off the road edges, grid, fog and sky in six looks, and P read c9fe4f1 clean. Each kind keeps its hue family across looks. Not yet his decision.
- 06:3x (L): the left column is built: builder `l254-left-column` 2d7ab5f on 40e931e (local), `handback/p-l254-left-column-A_2026-11-26.md`
  (the ledger calls this lap L251). Flush: its box is 0, 44, 248, 860 where it was 12, 56, 260, 644.5; it now runs to the
  window bottom. Clears 0.4 s after the pointer leaves, fades 0.2 s. New page rows 11 of 11 (8 of 9 red at the base); mutants
  14 of 15 caught, the 15th equivalent. Page for him: https://claude.ai/artifact/AwA81VtL7dUbWbhs26trCU (15 pictures; the librarian opened two).
  **Open with him:** it comes back only at a 24 px strip on the left edge of the window, not when the pointer is anywhere over
  where it sat. That came from the packet written by the librarian ("a narrow strip"), and departs from his "comes back when
  you put your mouse over it". P reads next.
- 06:28 (L), his words: "artifact looks good". It arrived while the left-column page was being published, so which page he meant is not certain (the refactor page BG2GrkaJoj6dMaNWAmfRun or the left-column page AwA81VtL7dUbWbhs26trCU). Read as: the look is approved; the return strip stays as built unless he says otherwise. He was told this reading.
- 06:3x (L): the follow-ups are built: builder `l255-chrome-followups` a64c625 on 40e931e (local), `handback/p-l255-followups-O_2026-11-26.md` (the ledger calls this lap L254). Export hovers in aurora and the two Skylines (row 15: 71.5%, 69.4%, 72.2% of its pixels change; 0.0% before); the menu titles in SIGIL hover; File and Edit stay inside the window under 1000 px (File was off from 900 to 950 px, Edit by 2 px at 900); a clicked field wears the ring alone; the values strip corner is r3; the CHANGELOG entries are in. Rows 13 to 18 of texture-page 6 of 6. Open with him: in the two Skylines a hovered Export goes from a gloss gradient to a flat fill. Four pictures sent to him. P reads it after the left column.
- 06:4x (L): the blur is built: builder `l251-label-blur` 6a3ea79 on 40e931e (local), `handback/p-l251-blur-C_2026-11-26.md` (the ledger calls this lap L253). The label windows are page elements now, each with the blur of its own look; they take no pointer events and no node is made or removed in a 60-step drag. 372 of 372 over the 24 touched files; the new page test 3 of 3 (0 of 3 at the base). Eight blurred windows cost about 0.4 ms a frame over none, no more than the canvas windows. **The blur is faint:** the detail inside the window drops 0.5 to 3.8% by look, because each fill is 80 to 92% opaque; the librarian opened the Glass crops and could not tell them apart by eye. A visible frost needs a thinner fill, which is his call. Two Glass crops sent to him. A reads it.
