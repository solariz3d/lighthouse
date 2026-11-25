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

## Added 2026-11-18 07:4x local: his next two questions, and what was checked

His words: "i dont know if my builder is the newest version, looking at the export, the track doesnt have the distintive underside, as well, why does it run so slow frames?"

- **His builder is the newest release.** The running app is `AppData\Local\T-180 Track Builder\t180-track-builder.exe`, version 0.4.40
  (its WebView's `--webview-exe-version`), dated 2026-11-11; v0.4.40 is the latest release (2026-11-09). Source main is 4 commits past it
  (3b33b38, 2026-11-10: bank, hover-card and refusal fixes), none about the underside or the AI line.
- **The track came from the app's equation export** (`app/core/coreshell.js` exportArgs -> `src/export/fromwords.js` buildFromSegments;
  the description "Built from equations" is written there).
- **Why the AI line was written anyway (the real exporter bug):** 0.4.40 already skips the AI line on a vertical track
  (`fromwords.js:372-375`, `NO_AI_LINE`, on `ailine.js` VERTICAL_TANGENT). The check fires only when two touching points sit within
  `CLEAR_UP = 1e-4` m horizontally (`ailine.js:51`, :119). This line's most vertical steps are 0.0009 m and 0.0019 m apart horizontally
  at 89.98-89.99 deg, ten to twenty times the bound, so the check passed and AC crashed. The bound should be an angle (or a much larger
  distance), chosen against what AC's calculateNormals survives; the pane finds and registers it.
- **The underside: NOT checked.** The underside skin is in 0.4.40 (`src/export/underskin.js`). Whether it was drawn into this kn5 was
  not read (needs a kn5 mesh list). Open: whether he means the skin is missing, or that it does not look like the hull he expects.
- **The frame rate: NOT measured.** The kn5 is 17,248,684 bytes for 3,793 m. No mesh, triangle or draw-call count was taken.
  Friday: count meshes and triangles in this kn5 (and Laniakea's for contrast), and check that `mergeForAc` ran (`acready.js:13`, :267).

## Added 2026-11-18 07:35 local: his read of it

His words: "OH i think i know what it is, there has been work that wasnt pushed in the newest release, there is an internal build on my repo or desktop that isnt the release im on"

- Checked on L (git fetch --prune of the builder's remote): the newest branch is `l158-eol-lf` bd9cd25 (2026-11-11, 1 commit past main,
  line endings only); main is 3b33b38 (2026-11-10). Nothing newer is on the remote, so the internal build he means is on the DESKTOP,
  unpushed. Friday, first step on D: find it (`git log --all --since=2026-11-10` in D's builder checkout, and the installed exe's
  version there), push it, then re-export TEST TRACK 100 with it before chasing the underside or the frames. The AI-line bound above
  stands either way unless that build changed `ailine.js:51`.
- His correction, 07:36: "i mean it should be on the repo. its just not built into a public release". Checked: the builder has one live
  repo, `solariz3d/t180-track-builder`, last pushed 2026-11-11T06:23Z (`gh repo list`). Its main 3b33b38 is 4 commits past v0.4.40
  (bank, hover-card and refusal fixes); the underside skin (`underskin.js`) and the vertical-track rule are already IN v0.4.40. So the
  repo holds no unreleased underside or AI-line work. Either that work sits unpushed on D, or the underside is drawn in 0.4.40 and
  looks different from what he expects. Friday: settle which before building anything.

## Added 2026-11-21 (L, the librarian): the fix is on a branch

- Pane A, packet `loop/packet_t180_ai_line_2026-11-21.md`, hand-back `handback/p-t180-ai-line-A_2026-11-21.md`; second read by pane B, clean (`handback/p-l217-read-land-B_2026-11-21.md`). Builder branch `l217-ai-line` 102496e, pushed; not merged, no release.
- **A correction to this brief (A, confirmed by B):** `CLEAR_UP` is a ratio (the sine of a tangent angle from vertical), not metres; the crashing line least was 1.424e-4, 1.4 times the old bar, not ten to twenty times. The bar is now 1.93e-4, the least of ELYSIUM line, which AC loads; the room to spare over his crashing line is 1.36 times.
- The 4 extra bytes are the trailing `hasGrid` int32. The underside skin IS in his kn5 (10 `UNDERSKIN_` meshes). The kn5 has 35 meshes and 249,628 triangles against Laniakea 158 and 1,439,728, so the low frame rate is not from mesh count; nothing was timed.
- **Not fixed until he sees it:** he re-exports TEST TRACK 100 with a build holding the branch and opens it in AC. The desktop unpushed build, if there is one, is still to be found on D.

## Added 2026-11-24 00:4x (D, the librarian): the desktop holds no unpushed build

- **His words, 00:39:** "lets do t-180 track builder for a bit"
- **Checked on D, one run each** (`C:\Users\nname\Downloads\t180-fresh`, after `git fetch`): no commit anywhere in the checkout is newer than 2026-11-10 18:00 and absent from origin (`git log --all --not --remotes=origin --since`: empty). The five newest local-only branches (extra-change-free, extra-change-free-mirror, extra-corner-free, hovertip-ancestors, level-end) hold 0 or 1 commit not in origin/main by patch, and each of those has the same subject as a commit on origin/main (33c54aa, 313b95a, f662253): landed in another form. The installed builder on D is 0.4.40, written 2026-11-10 17:34. **So the internal build he remembered is not on D either:** what is unreleased is origin/main's 4 commits past v0.4.40 and the branch `l217-ai-line` 102496e.
- D's local `main` is 60c7688 (2026-10-30), 224 behind origin/main and 0 ahead: stale, fast-forwardable.
- **Sent:** one lap to pane P: merge `l217-ai-line` onto origin/main, full suite, an internal build (no release), his installed exe backed up first, installed only if the builder is not running.

## Added 2026-11-24 03:0x (D, the librarian): the internal build is installed on D; the track to test it with is not here

Hand-back `handback/p-d677-t180-internal-P_2026-11-24.md` (git-blob 25c8a5f7, read whole). By pane P:
- The merge was a fast-forward: the tree is `l217-ai-line` 102496e. Full suite once: 4,651 tests, 4,627 pass, **1 fail** (`app/test/drag-frame.test.js`, a timing row; a different row red on each of two re-runs alone; both rows red before this branch, by the hand-backs P cites; the drag page loads none of the changed files). P's reading, inferred: machine timing, not the merge. Not bisected.
- Installed on D, builder not running, not launched: sha256 72bc13b8…, still called 0.4.40 (the number was not bumped, so it is told from the release by its hash). Backup of the release exe beside it: `t180-track-builder.exe.before-d678-3b33b38`, sha256 98493084…. To undo: copy the backup over the exe with the builder closed.
- **TEST TRACK 100 is not on D:** not among his 45 saved tracks, not in AC's tracks folder. It was made on L. So the fix cannot be shown on D with that track until the track file comes from L or is made again here.
- P stopped its first suite try when his game started (12 s in) and waited for it; the build waited 81 minutes behind the game.
