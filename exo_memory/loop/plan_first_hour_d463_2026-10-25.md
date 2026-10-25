# D463: fixes from a stranger's first hour (librarian, 2026-10-25 16:1x)

Source: E's `exo_memory/handback/p-d461-stranger-E_2026-10-25.md` (git-blob 42e20288…, 11,852 B), §2.
The keeper asked whether the builder is good enough (15:53); this is the first answer from outside his own driving.

## Ruled into this lap, inside the line of work. He is told and can veto.

**Part 1, pane B, docs and guide. Tier: just do it.**
- §2 item 1: the README's first screen and Install section, and the first-start AC card, say "Requires Custom Shaders Patch (CSP)". The export needs it: its own surfaces.ini says plain AC can crash.
- Item 2: guide step 2 names Sculpt mode: "Press Tab (or Build ▸ Sculpt mode), pick a tool with 1–9, drag on the road." Drop "Build ▸ Brush". Step 1 shortened.
- Item 3: the README matches 0.4.19: one-press Close with no Apply, Sculpt mode and its keys (Bend, Climb and Stretch move the route), and the pit lane as it is now. Remove the "Not built: pit lane" line.
- Item 11, part: the README's installer file name matches the asset.

**Part 2, pane E, the app's own text and one bug. Tier: check it.**
- Item 5: a Bend in the re-close window snaps back silently. Either keep the bend and re-close outside the brushed range, or say it plainly: "your bend was undone to close the lap; bend further from the start, or open the lap first". Write a test first that is red on the silent snap-back, then fix.
- Item 6: the export's success and warning text are in user words. Source files, doc sections and seat letters come off the screen; "needs CSP" stays.
- Item 7: the main Export's result shows in full, not cut off at "ex…".
- Item 9: Sculpt's instruction hint uses a neutral colour, not red.

Both parts land in the next T-180 batch with D459 and D462. Neither is a release of its own.

## His calls, brought to him, not done
- Item 4: a screenshot at the top of the README, and whether the AI-process text and the essay move below Install. Taste, and how the builder presents itself publicly.
- Item 8: a speed or car choice for normal cars. This is a design direction.
- Item 11, rest: the `.claude/` folder in the public repo (removing it is a delete), and the author-name prompt.
