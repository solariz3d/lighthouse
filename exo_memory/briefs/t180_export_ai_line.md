# t180 track builder: the exported AI line crashes AC on near-vertical track (opened 2026-11-18, L, by the chair)

## His words (verbatim)

- 2026-11-18 07:29 local: "can you read the recent crash for TEST TRACK 100, its track builder track and doesnt open in content manager"
- 2026-11-18 07:31 local: "fix it quick, just the track, then make a note of the export being broke for friday when we get our usage back"

## What was found (checked on L, 2026-11-18 ~13:30Z)

- Content Manager starts AC normally; `acs.exe` exits about 7 s later (`%LOCALAPPDATA%\AcTools Content Manager\Logs\Main Log_261118_072822.log`, 07:28:29 to 07:28:36).
- AC's own log (`OneDrive\Documents\Assetto Corsa\logs\log.txt`, with `crash_20261118_132832.report` beside it) ends:
  `Loading AI Spline: content/tracks/t180b_test_track_100/ai/fast_lane.ai`, then
  `CRASH in: ... aispline.cpp (701): AISpline::calculateNormals` <- `AISplineRecorder::load` <- `Track::initAISpline` <- `Sim::loadTrack`.
- The file (written by `src/export/fromwords.js`, per the track's `.t180b-builder.json`, 2026-11-18T13:23:09Z): version 7, 633 points at 6 m, 3,790 m.
  It climbs to y = 588.6 m. Pitch per step reaches 89.98 deg (points 256-263, up) and -89.99 deg (431-432, down);
  168 steps are steeper than 45 deg and 88 steeper than 80 deg (a node pass over the points; the script is in the chair's transcript of this date).
- Inferred, not read from AC's source: calculateNormals builds the side vector from the line direction and world up, so a vertical step gives a
  zero-length side vector and the crash.
- Not the cause, not explained: the file is 4 bytes longer than its own counts account for (16-byte header + 633 x 20 point bytes +
  4-byte count + 633 x 72 detail bytes = 58,256; the file is 58,260).
- `t180b_laniakea` (same builder, 2026-11-01) loads, and its `ai\` folder is empty: that export wrote no AI line.

## What was done (the quick fix, his track only)

- `ai\fast_lane.ai` was copied to `C:\Users\zackn\Documents\t180b-backups\t180b_test_track_100_ai_2026-11-18\fast_lane.ai`
  (sha256 982499a8... equal on both copies) and then removed from the track's `ai\` folder. The track now matches Laniakea: no AI line,
  so practice and hotlap with no AI cars. Not yet confirmed by a launch.
- To undo: copy the backup back into `content\tracks\t180b_test_track_100\ai\`.

## Owed (Friday, when usage is back): a pane in the t180 repo

1. Reproduce: export TEST TRACK 100 (geometry sha256 a2a92a31...) and confirm the near-vertical steps in the written `fast_lane.ai`.
2. Fix the exporter in `src/export/fromwords.js`: never write an AI line AC cannot load. Either skip the file when any step is near
   vertical (the Laniakea behaviour), or write one AC accepts. A red-first row: a vertical-wall track must not produce a file with a step
   over the bound; the bound is the pane's to find and state, not ours.
3. Account for the 4 extra bytes against the format the exporter writes.
4. Show him the result in AC before it is called fixed (show artifacts before and after).
