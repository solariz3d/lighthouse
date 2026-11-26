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
