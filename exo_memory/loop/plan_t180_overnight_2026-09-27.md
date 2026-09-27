# T-180 Track Builder: the overnight run, from milestone 1 onward. Librarian, on D, 2026-09-27 11:5x.

> **CORRECTED 12:1x by the keeper. This replaces the sequence below; the rest is kept as trace.**
> *"its not going to work because you have to open the program and click play. You need to just do the plan, not open
> assetto. Make the program that makes the tracks from the data we gathered. No in game testing needed."*
> Then: *"like what i dont think you understand."*
>
> **What I had wrong:** I read "milestone 1" as "prove things in AC first", and sent the loop to launch the game.
> **The job is THE PROGRAM:** the standalone track builder in ARCHITECTURE §1–§6, §5b and §5c. You write a track in
> words, fonts and tempo; it builds the geometry; it colours red and amber from the FINDINGS data; it previews; it
> exports a working AC track. **No AC launches at all, and no in-game testing.** T1's kn5 writer and export set stay:
> they are the export half of the program. T2's in-game half and all of T4 are dropped. The AI line FILE generation
> stays, as part of export.
>
> **The new order (each lap split across all four panes):**
> 1. **The document model** (§2): words, phrases, fonts, tempo, handles, a canonical serialisation, undo.
> 2. **The geometry core** (§3): clothoid words, frames, profiles past vertical, the fold check, adaptive meshing,
>    cells.
> 3. **Validation from the data** (§4): loads along the path, the jump check with two landings, the red list, the lap
>    proof. The limits come from FINDINGS.
> 4. **Export** (§6, §5c): the words become a track folder through T1's writer. Markers, pits, timing and the AI line
>    are generated.
> 5. **The app** (§9): a Tauri v2 program like blackbox, with the WebGL preview, a word palette, live colour, sculpt
>    handles, close-the-loop, and export from a button.
> **ADDED 12:2x by the keeper: what v1 is.** *"the first thing I want it to be is simply the track, no environmental
> elements. You remember the idea of like thrilleville or roller coaster builder type games where the perspective can
> be like looking forward where you are placing the track as it grows, maybe even different camera angles too or free
> came mode with the mode that looks in the direction the track is being built."* And, 12:18: *"youre not the one who
> builds the track, the user does."*
> - **v1 is the track only.** There is no environment: no scenery, no ground dressing, no props beyond the road itself.
>   ARCHITECTURE §8 waits.
> - **The build head is the heart of the app.** It works like a coaster builder (Thrillville, RollerCoaster Tycoon,
>   Planet Coaster). The track grows from its open end, and the user picks the next word, font and tempo there and
>   sees it placed.
> - **Camera modes:**
>   1. **Build view** (the default): behind and above the build head, looking forward along the direction the track is
>      growing, and following it as pieces are placed.
>   2. **Other fixed angles:** overhead/plan, side, and chase along the finished road.
>   3. **Free camera:** fly anywhere.
>
>   Switching between them is one key, and the build view is always one key away.
> - The Third Place planning conversation (pointer at the end) may hold more on this. Read it for intent.
>
> 6. **Textures** (§5b), and then hardening. The README status table, judged item by item against ARCHITECTURE.

**The keeper, 11:36:** *"Start at github.com/solariz3d/t180-track-builder, docs/ARCHITECTURE.md §10 milestone 1. The
research behind it is in docs/FINDINGS.md and the tools in tools/. Make sure to run the work chain loop until the
program is solid and fully functional from the plan."* He called it very important and close to his heart.

**His three answers, 11:4x:**
1. **Keep building:** go on into the editor (milestone 5) without waiting for his drive.
2. **Install and launch AI only:** the test track goes into AC under its own new folder, and AC+CSP may be launched for
   AI laps and screenshots. No driving, and no existing file touched.
3. **Push to main:** commit and push straight to `main` after each verified lap.

**The master is the repo's own `docs/ARCHITECTURE.md`** (at `8ec30f4`). This file only sequences it. Where they
disagree, ARCHITECTURE wins, and the disagreement goes into the lap's hand-back.

## Where things are, on D (checked 11:4x)

| thing | path |
|---|---|
| the repo (clone of `main` @ `8ec30f4`) | `C:\Users\nname\Desktop\t180-track-builder` |
| Assetto Corsa + CSP | `G:\SteamLibrary\steamapps\common\assettocorsa` (`extension/` present) |
| T-180 cars | `content\cars\ma_t180_*` (augury, gigerbon, grx, hangul, each with an `_active` twin), `hys_mach5_*` |
| reference tracks | `content\tracks\` `sakura_speedway`, `centrifuge`, `rainbow_rd`, `ohyeah2389_t180testtrack`, `t180_bowltrack` |
| blackbox (renderer, kn5.js, acreplay.js) | `C:\Users\nname\Desktop\blackbox`; the tools expect `%USERPROFILE%\blackbox` or `BLACKBOX=`, so set `BLACKBOX` |

## Rules for the whole night (every packet carries them)

1. **Never overwrite or delete anything in the AC install.** New tracks go only under `content\tracks\t180b_*`. Before
   writing any AC config the loop uses to launch (`Documents\Assetto Corsa\cfg\race.ini` and the like), copy it to
   `<file>.bak-t180b-<time>` and restore it after the run.
2. **AC launches take the heavy-run lock** (`C:\Consonance\data\heavy-run.lock`, `consonance/tools/heavy-run.js`). Each
   has a hard timeout (10 min) and is killed at it. AI only; no seat drives.
3. **Public repo, so the privacy gate runs before every push:**
   - no keys or tokens;
   - no personal paths beyond the ones the repo already uses;
   - **no other authors' track content** (meshes, textures, kn5 bytes): the README promises none is included. Reading
     their tracks locally for measurement is fine; committing any part of them is not.
4. **Every lap adds tests** (`node --test`, dependency-free like `tools/`) and runs the whole suite before its push.
   **Fix the implementation, never the test** (the keeper's global rule). Keep a `CHANGELOG.md` in Keep a Changelog form.
5. **Commit by named paths, push `main`** after the librarian's score and the privacy gate. Never force-push.
6. **Label rule** (lighthouse BUILDING.md hand-back item 7): every number carries its command, or is marked inferred.
7. **Stuck rule:** a packet that fails the same check twice is parked with its reason in the hand-back, and the run
   moves to the next unblocked lap. Nothing waits on the keeper while there is unblocked work.
8. **Watchers need an end condition.** Strict wait-for-all within a lap.
9. The lighthouse repo is not pushed tonight (standing rule). Lap plans and scores are committed here as usual.

## The sequence (each lap split across A, B, C and E along the grain; the chair assigns within it)

**T1: milestone 1, the platform test track, written directly as kn5.**
- A **kn5 v5 writer** in `src/export/kn5write.js`, from AcTools' `Kn5Writer.cs` (Ms-PL) as the byte reference, plus
  blackbox's reader. It must read back byte-exact through the repo's own `tools/kn5.cjs`.
- A **tiny script** `scripts/platform_test.js` that builds the 500 m loop the milestone names, with:
  - a half-pipe section;
  - a wall-ride above 90°;
  - one small jump sized by FINDINGS §8 / §7d-e (it must hold at both the 3.2 g and the 6.3 g landing);
  - markers (`AC_START_0..n`, `AC_PIT_0`, `AC_HOTLAP_START_0`, `AC_TIME_0_L/R`);
  - `1ROAD` physics naming.
- **Two variants** for the registered soft-road prediction (FINDINGS §4c, verbatim in ARCHITECTURE §10.1): identical
  geometry, with and without the soft-collision block in `data/surfaces.ini`. They can be two layouts or two folders;
  the builder decides and says why.
- **The rest of the export set:** `models.ini`, `ui/ui_track.json`, `preview.png`, `outline.png`, `map.png` +
  `data/map.ini`.
- **Tests:** writer round-trip, marker checks (the ARCHITECTURE §5c list), and the fold check on the generated mesh.
- **Install** under `content\tracks\t180b_platform_test`.

**T2: milestone 2, a generated AI line** (`ai/fast_lane.ai` v7, `hasGrid=0`) for that track. Launch AC with AI on it
(Rule 2) and record whether AC accepts the line and whether AI laps run. If it rejects the line, find out why from the
log. This settles ARCHITECTURE's "(unverified)" either way.

**T3: milestone 3, the round-trip.** `tools/read_track.cjs` reads the exported track back. Compare the words it
returns with the words it was written from; state the tolerance before running. The replay-loads half waits for the
keeper's drive, and is prepared, not faked.

**T4: milestone 4, the look-match baseline.** Try reference shots of Sakura in AC+CSP from fixed cameras (AI or replay
camera, Rule 2) against blackbox's render of the same views, and get the first difference number. If automated capture
proves impossible without a person, park it with the exact reason.

**T5 onward: milestone 5, the editor,** in ARCHITECTURE's own order. It is a Tauri v2 app the way blackbox is built
(§9): the geometry core in JS in the UI process, and no mesh data over IPC during a drag.
- **T5, the document model** (§2): words, fonts, tempo, handles, stable ids, canonical quantised serialisation, schema
  and generator versions, and undo as history.
- **T6, geometry** (§3): clothoid words, rotation-minimising frames (double reflection), the profile with its turning
  angle ψ(u), the fold check, adaptive meshing by chord error and seam angle, and cells under 65,536 vertices.
- **T7, validation** (§4): the load f = v²κN − g per lateral line, the jump check with two landings, the red list, and
  the full-lap point-mass proof.
- **T8, the app shell and renderer:** a Tauri app from blackbox's pattern, a WebGL preview, and words placed from a
  palette.
- **T9, live colour along the track, undo, close-the-loop** (G1/G2 connector ranked by worst physics margin), and
  export from the editor through T1's writer.
- **T10 onward, hardening:** a crash-free soak, export reliability, `CHANGELOG`, and a README status update. Then the
  §5b / §5c items in the order ARCHITECTURE lists them.

**For the keeper's morning (queued, never faked):** drive `t180b_platform_test` twice, without the block and with it,
recording with blackbox's telemetry logger. Then `tools/boxdepth.cjs` on both replays scores the registered
prediction, and the round-trip loads half of T3 runs on the same replays.

## Scoring

The librarian scores each lap against its hand-backs and this plan before the chair lands and pushes. A lap is done
when:
- its tests pass in the full suite;
- a non-author seat has read the diff;
- the privacy gate is clean.

"Solid and fully functional" is judged against ARCHITECTURE §10 and §2–§6, item by item, in a closing status table in
the repo's README. That table lists what is built, what is tested, and what waits on a drive.

## Extra help, at the keeper's word (11:43): the Third Place planning conversation

*"if you need extra help, refer to the third place transcript where them and I first pondered the plan for the
program."*
- It is `C:\Users\nname\.claude\projects\C--Consonance-instances-third-place\3d000000-0000-4000-8000-000000003d00.jsonl`,
  lines ~32,560–34,905: 2026-09-27 09:0x–16:54 UTC, 150 rows naming the builder with T-180, Assetto or Blender.
  - Two earlier mentions are at ~17,496 and ~19,976 (09-23).
- **Use it for intent** (what the keeper meant where ARCHITECTURE is terse). Read by grep and line range, never the
  whole 298 MB file.
- **Third Place material stays private.** Never quote it into the public t180 repo or into the lighthouse repo. Cite
  it by line number in a hand-back at most.
- ARCHITECTURE stays the master. Where the conversation and ARCHITECTURE disagree, say so in the hand-back and follow
  ARCHITECTURE, unless the conversation is the keeper's later word.
