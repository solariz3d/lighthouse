# Packet T180-AI (the first builder pane free, on L; pane A on Sonnet 5.5 by default): the exporter never writes an AI line AC cannot load

Written by the librarian on L, 2026-11-21 04:0x, at his word of 03:46 ("do it all, why didnt you start"). The brief is
`exo_memory/briefs/t180_export_ai_line.md` (71 lines; read it whole first, it holds his words and every checked figure).
This lap was owed "for friday when we get our usage back" (his words of 2026-11-18 07:31, in the brief). It is dispatched
when a pane has handed back its usage lap; no cold pane is woken for it.

**Repo:** `C:\Users\zackn\Downloads\t180-track-builder` (main 3b33b38, clean on 2026-11-21 04:0x, checked). Work in a
worktree on your own branch. No release without his word.

## What is known (from the brief; each line there is marked checked or inferred)

- AC crashed in `AISpline::calculateNormals` loading the exported `fast_lane.ai` of TEST TRACK 100. The line has steps
  at 89.98 and -89.99 degrees; 88 steps are steeper than 80 degrees.
- 0.4.40 already skips the AI line on a vertical track (`src/export/fromwords.js:372-375`, `NO_AI_LINE`). The check that
  decides it is `CLEAR_UP = 1e-4` (`src/export/ailine.js:51`, used at `:110` and `:119`, read there as |tangent x up|).
  This track's worst steps cleared that bound by ten to twenty times and still crashed AC.
- His track was fixed by hand on 11-18 (the file moved to a backup; the brief says where). Do not touch his track folder.

## What to do, in this order

1. **Reproduce, red first:** a row that builds a track with a near-vertical wall (as steep as his: a step within 0.001 m
   of vertical over 6 m) and shows today's exporter WRITES an AI line for it. Use the export path the app used
   (`app/core/coreshell.js` exportArgs into `src/export/fromwords.js` buildFromSegments).
2. **The bound.** State what `CLEAR_UP` measures in its own units, then choose a bound that refuses his track's line with
   room to spare, and say what it costs: which of the tracks in the repo's own tests or samples would lose their AI line
   under it. Register the bound and that list BEFORE changing the constant. AC's source is not ours to read; the bound is
   justified by the crash and by geometry, and you say so.
3. **Fix:** the exporter skips the AI line (the existing `NO_AI_LINE` path) for any line past the bound. No new behaviour.
4. **The 4 extra bytes** (brief `:19-20`): account for them against the format `encodeAiLine` writes, or say they are not
   explained.
5. **Count, do not fix:** meshes and triangles in TEST TRACK 100's kn5 and Laniakea's, and whether `mergeForAc` ran
   (`acready.js:13`, `:267`). His question was why it runs at low frames. Also list the kn5's mesh names that belong to
   the underside skin (`src/export/underskin.js`), so "is the underside there" has an answer. Numbers and names only.

## Registered before code (print each in the hand-back)

- **R1, red first:** the row of step 1, red on main, green after.
- **R2:** the bound, its units, and the list of sample tracks that lose their AI line under it.
- **R3:** the repo's own suite green (name the command you ran and its count).
- **R4:** the counts of step 5 as a table.

## Registered failure line

Failed if, after this lands, an export of TEST TRACK 100's geometry writes an AI line, or AC crashes loading any track
this exporter wrote. The second half is his to see: he opens the re-exported track in AC before it is called fixed.

## Not in this lap

A release. Any change to the underside or to the meshes. The desktop's unpushed build, if there is one (the brief,
`:58-71`): that is found on D.

## Standing rules

Commit by named paths. His words never go into the builder's repo. No credentials or account details in any file or
command. Hand-back as a file in `exo_memory/handback/` of the ROOM repo, rung to the librarian as a pointer, each state
claim marked checked or inferred, ending with who acts next.

## Addendum, 04:1x: one chore in the ROOM repo first (pane A)

`portable-paths.js` reads red on the room's main for three paths in your `consonance/tools/usage-ledger.test.js`
(`:19`, `:21`, `:117`; found by pane B, `handback/p-l214-land-B_2026-11-21.md`, R1). Fix those three on a branch, show the
check green for that file, and name the branch in your T-180 hand-back; pane B lands it. The fourth red path
(`research/claude_code_features_for_consonance_2026-11-21.md:73`) is the Third Place's file and not yours.
