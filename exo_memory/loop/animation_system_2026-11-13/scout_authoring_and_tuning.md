# Scout: how animation gets made and tuned here (authoring and tuning loop), 2026-11-13

1. The game already holds most of an authoring loop: an X-macro parameter table read from plain text with F5 reload,
   an ImGui overlay that edits such tables live, offscreen captures from kept runs, an image probe, a build stamp.
2. What it lacks is honesty in the clip: 12 fps sampling, no record of what each column is built from, no check that
   the subject is in view and lit, and ~~a hunter phase that depends on the capture's frame step~~ [2nd reader: DOWNGRADED, see 1a: a running sum
   (`stage.cpp:269`), so the step matters only to a small sampling error; the first drawn frame matters more].
3. Sources read at source give the loop's shape: ozz (freeze, fixed rate, time factor; skin and joints toggles), Holden
   (live sliders, sim root drawn beside the body), Overgrowth (reload on file time, ~~keep the old on error~~ [2nd reader:
   WRONG on this half. On a compile error Overgrowth shows an ok/cancel/retry dialog and the new module is already built
   over the old: `asmodule.cpp:208-215`, `:1672-1680` (245fe48). It says so; it does not keep the old. Only the F5
   reader's "(nothing was changed)" does that, `world_app.cpp:247-249`]), Unreal's
   Rewind Debugger (follow camera that does not turn; pose watch per layer), Jolt's viewer (step back and forth).
4. First lap: make `--capture-lean` unable to mislead: every frame, a manifest naming build and run, a pose trace,
   and a refusal to write a pass in which the hunter is hidden. Its visibility row runs with no GPU.
5. Do not build a pose or curve editor, a clip pipeline, code hot reload, or a second renderer for clips.

Scout for one aspect, read-only. Marks: [read] opened and seen; [summary] from a ground file or another account;
[inferred] mine; [ours] a proposal. Game code is dreamzone-3 `main` at 31d1c6d unless named. "Ground X:N" is
`exo_memory/loop/animation_system_2026-11-13/ground_X.md` line N. Outside files were downloaded with curl into my
scratchpad and read as text; their commit or page is named beside each.

## 1. What the room already has for this aspect

### 1a. From the ground files

- [summary] Capture flags on main: `--capture-walk/-run/-burst/-look/-models/-corner/-lean/-fpbody/-fpburst` and `--bench`
  (ground constraints_and_roster:140-141). `--capture-lean` films a kept run from 4 m behind and from the look-behind at
  12 frames a second (:142-143).
- [summary] The three clip failures: lamps dark on a re-capture, cause inferred as another GPU job (:154-155); C's own
  gamma 1.9 lift washing the corner out (:156-157); look-behind passes showing walls (:158); a "before" older than a fix
  he had seen, filmed at 12 fps with a dark start (:159-161). No frame cost reported with clips (:162-163).
- [summary] His ruling on that: re-film "at full frame rate and lit", and no before-and-after whose "before" is older
  than a fix he was shown (ground constraints_and_roster:160-161; his_words:541-542).
- [summary] The method rulings this loop serves: his eye is the bar, research is how it is built, the baseline beside it
  (his_words:460-461); "Keep and tune by eye" for the sideways turn (his_words:579); score against recorded motion first
  (his_words:580-581); show the current base, never an older one (his_words:738).
- [summary] The yardstick: hip/knee/ankle against Fukuchi at 2.5-4.5 m/s, arms against 25 CMU clips, an SVG contact
  sheet of one stride in eighths beside `gait_pose` (ground locomotion_and_yardstick:188-201; code:327-338). It cannot
  score a bend, a stop, stairs, anything above 4.5 m/s, or a non-human cue (locomotion:208-221).
- [summary] The two clip formats in use: C's ffmpeg three-column mp4 from `ffmpeg-static` (constraints:148-150) and E's
  HTML flipbook, 8 passes x 24 frames, base beside branch (constraints:151-152). [inferred] Two patterns coexist; neither
  is a tool in the repo.
- [summary] The hunter's stride phase is advanced by the frame's delta in the stage, not the sim tick (code:34-36).
  ~~[inferred] So the same run drawn at a different frame step shows different leg phases: a before/after pair captured at
  different steps differs by more than the change.~~ [2nd reader: DOWNGRADED. Read at `stage.cpp:269-270`: the phase is a
  running sum of speed x dt, so a different step gives the same phase up to quadrature error (a few hundredths of a
  radian by my arithmetic [inferred]), not "more than the change". The real hazard is a different FIRST drawn frame
  (the phase starts at 0 when the stage is made and only advances on drawn frames) or a hitching live frame. Keep the
  same-step gate; it is cheap; do not cite this as its reason. Note `DrawnChaser::step` uses `kTickDt`
  (`world_app.cpp:578`), not the frame dt, so the easing is step-independent.]
- [summary] Rosen's talk, known only through techarthub's list: "13 keyed poses", layers each toggleable
  (ground sources_read:142-143). Not read at source by anyone.
- [summary] Blender 5.2.3 headless, MPFB, Python allowed for Blender only (constraints:191-198). The rig and model
  scripts were "in the scratchpad" at landing; on main `art/tools/` holds only `textures.py` (constraints:92-93, :205).

### 1b. In the game's code, not in the ground files (read for this scout)

- [read] A parameter table as the single source: `sim/params.h:24` `#define DZ_MOVE_PARAMS(X)`; the file is plain text
  "so feel can be tuned without a rebuild" (`:6`); an unknown name or bad value is an error and "the error names the
  line" (`:14`).
- [read] The shared reader: `game/textfile.h:16-38` `for_each_pair` returns "line N: what is wrong"; `write_text_file`
  keeps a `.bak` (`:48-50`).
- [read] Live reload: F5 is `Action::ReloadParams` (`game/world/world_app.cpp:301`); `reload_params` keeps the old
  values on an error and says "(nothing was changed)" (`world_app.cpp:247-249`). The gym's saved file says "F5 in the
  gym reads this file again while it runs" (`game/params_table.cpp:34`).
- [read] Only the changed values are written back, each with its description and default (`game/params_table.cpp:30-43`).
- [read] A live editor built from such a table: the world overlay draws one `DragFloat` per field with its range and a
  tooltip of description and default (`game/world/hud.cpp:525-541`), and saves it (`:544`). The table form is
  `X(name, def, lo, hi, desc)` (`game/world/world_settings.h:17-22`).
- [read] Dear ImGui 1.92.9 WIP is vendored (`render/third_party/imgui/imgui.h:32`; `render/CMakeLists.txt:48-56`), with
  `PlotLines` (`imgui.h:796`). The overlay already draws lines into a draw list (`game/world/hud.cpp:213`).
- [read] An image probe for captures: `dzgym::measure` gives mean, lit share (>8/255) and white share
  (`game/gym/image.h:13-18`, `:27-47`); `--capture-models` prints it per still (`offscreen_models.cpp:70-71`).
- [read] A build stamp: `DZ_BUILD_COMMIT`, with "+changes" for a dirty tree (`game/world/build_commit.cmake:1-4`,
  `:16`); a kept run's record names "the build it was played on" (`game/world/run_record.h:6-9`).
- [read] Staging: `WorldStage::stage_figures` replaces the chase's poses (`game/world/stage.cpp:244-247`, `:258`);
  `staged_camera`/`staged_view` (`stage.h:55-56`). [inferred] Staged poses skip `DrawnChaser::step`, so a staged case does
  not show the game's easing unless it is fed through it.
- [read] The view without drawing: `app.view()` (`game/shell.h:77`) gives the eye the stage draws from
  (`stage.cpp:676-683`). The hand lights are placed from that view, not from a staged camera (`stage.cpp:690`).
- [read] `--capture-lean`: steps of 1/144 s (`offscreen_models.cpp:29-30`); the first pass "draws nothing" (`:351`);
  saves every 12th frame (`:466`); the follow camera stands on the hunter's trail when a wall is in the way, by a
  two-way sim raycast (`:401-421`); the look-behind passes have no such check (`:433`, `:459-460`).
- [read] Scripted motion for the player: `app.carry(route, speed)` (`offscreen_models.cpp:146`); outside views of the kid
  from a staged camera (`:121-136`).
- [read] The gym course is hand-built and lit "for reading the course at speed" (`game/course.h:4-7`) and has stairs
  (`game/course.cpp:92`); the gym's stage draws no models (no hit for hunter/model in `game/gym/stage.cpp`).
- [read] Generated buildings have stairs: `CellKind::Landing`, `Stair` (`gen/src/gen.h:279-280`).
- [read] His kept runs are on disk: 20 `.txt` records in `game/runs`, including `run-20261112-204506` (E's case) and
  `run-20261112-202912` (not committed, by `run_record.h:3-4`).

### 1c. The Blender pipeline scripts survive (contradicts "whether they still exist" at constraints:205)

- [read] In pane A's scratchpad `C:/Users/nname/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d659/`:
  85 files, among them `bl.js`, `rig.py`, `bake.py`, `hunter.py`, `kidlib.py`, `preview.py`, `views.py`,
  `chaser_views.py`, `glbcheck.py` (`ls`, 2026-11-11 dates).
- [read] `bl.js` is a headless Blender runner at below-normal priority that refuses while `acs.exe` runs or a heavy-run
  lock names a timing session (`bl.js:2`, `:6-10`), with `--background --factory-startup --python-exit-code 1`
  (`:15`).
- [read] `preview.py`: "neutral grey body, the game's joints as red beads, front / side / three-quarter" (`preview.py:1`).
  `rig.py` writes the joint map that tells the game how its 21 joints drive the 53+1 bones (`rig.py:1-3`).
- [read] The record meant them for `art/tools/` at landing (`handback/p-d659-blender-A_2026-11-11.md:552-555`).
  [inferred] A scratchpad is not kept; they are one cleanup away from gone.

## 2. What I read at source that is new

Rule 5 is applied only where I propose to USE something. Everything else is "the idea" only.

| source | what it shows for this aspect | use |
|---|---|---|
| ozz-animation, master 744eb9d, `samples/framework/application.cc` | `freeze_`, a fixed update rate or a time factor from -5 to 5 (`:420-430`, `:588-606`); screenshot or video capture keys (`:294-296`) | idea |
| ozz, `samples/look_at/sample_look_at.cc` | "Show skin" and "Show joints" checkboxes beside each parameter's slider (`:401-402`, `:345-352`) | idea |
| ozz, `samples/framework/renderer.h` | `DrawPosture` draws a skeleton over the posture's matrices (`:91-94`) | idea |
| Holden, Motion-Matching, main 57b7250, `controller.cpp` | ~~every tunable~~ [2nd reader: DOWNGRADED to "most tunables": 21 `GuiSliderBar` calls in 9 group boxes (`:2199`-`:2404`); `ik_foot_height`, `ik_toe_length`, `ik_max_length_buffer` (`:1415-1417`) have none; `:2199-2210` is only the "simulation object" box] is a slider in a group box, live; the simulation root drawn in orange apart from the body (`:2118`); locked foot contacts drawn as spheres (`:2144-2152`); IK defaults such as `ik_unlock_radius = 0.2f` (`:1418`) | idea |
| Overgrowth, main 245fe48, `Source/Scripting/angelscript/ascontext.cpp` | `Reload()` under a profiler zone "Live update check": if the source changed, recompile; if expected functions are missing, show an error and return false (`:332-351`) | idea |
| Overgrowth, `asmodule.cpp` | `SourceChanged()` compares the file's latest modification time with the loaded one (`:433-438`) | idea |
| Unreal Engine docs, "Rewind Debugger" (dev.epicgames.com, page text, sections Camera Modes, Timeline, Pose Watch) [2nd reader: UNSUPPORTED. The page is script-rendered: curl returns 31 KB with only "Table of Contents", a summarising fetch the same; I could not open the quoted sentences, so the quotes here are not [read]] | record a segment, scrub it; "Follow Target Actor" moves the camera "along the same track as the selected object" and "does not track the selected object"; "Replay Recorded Camera"; Pose Watch shows "each node's effect on the Output Animation Pose" | idea |
| Jolt (local submodule, e77f1755), `JoltViewer/JoltViewer.cpp` | a recording opens paused; keys step forward, step back, play reverse (`:59-60`, `:68-74`) | idea |
| Jolt, `Jolt/Renderer/DebugRendererRecorder.h` | "records the API invocations to be played back later" (`:18-19`) | idea |
| Jolt, `Jolt/Skeleton/SkeletonPose.h` | `DrawSettings`: joints, orientations, names (`:63-72`) | idea |
| Blender 5.3 manual, "Command Line Arguments" (page text) | `-b, --background`; `-P, --python <filepath>`; `--python-exit-code`; `-X, --factory-startup` | tool use, see below |
| Blender 5.3 manual, "About Free Software and the GPL" (page text) | "The GPL only applies to the Blender application and not the artwork you create with it" | licence read |
| ffmpeg-filters.html (page text, ffmpeg.org) | §11.128 hstack: same pixel format and height; §11.259 tile: frames into a grid; §11.76 drawtext needs libfreetype at build; §11.223 scale: `in_range`/`out_range`, full 0-255 against limited 16-235; §11.206 psnr between two inputs | tool use, see below |
| ffmpeg.org/legal.html (page text) | LGPL 2.1 or later; GPL parts make all of FFmpeg GPL | licence read |

[read] The manual read is 5.3 ("latest"); his Blender is 5.2.3 (ground constraints:191). [inferred] The four flags are old
and stable; a builder checks them against 5.2.3's `--help` before relying on them.

Licences, for what I propose to USE:
- [read] Dear ImGui (already vendored): MIT, `render/third_party/imgui/LICENSE.txt:1-3`. Commercial use yes; keep the
  notice; no share-alike; redistribution allowed.
- [read] Blender, as an offline tool (his yes, item 83, ground constraints:172): the manual page above says the GPL does
  not reach what you create with it. Nothing of Blender ships. [inferred] The joint maps and stills it writes are ours.
- [read] ffmpeg, as an offline tool only: LGPL 2.1+, GPL when built with GPL parts (legal.html). [inferred] Using the
  binary on this machine and never shipping it triggers no obligation on the game. I did NOT read `ffmpeg-static`'s own
  licence or its build flags, so whether its `drawtext` exists is unknown; the design below needs neither.
  [2nd reader: the npm registry metadata for `ffmpeg-static` 5.3.0 (registry.npmjs.org/ffmpeg-static/latest) says
  `GPL-3.0-or-later`, so the binary the room has is a GPL build, not LGPL; fine for offline use, never to ship. Licence
  text not read, [summary] from metadata.]
- Idea only, licence noted from what I opened: ozz MIT (`LICENSE.md:1-2`); Holden MIT (`LICENSE:1-3`); Overgrowth
  Apache-2.0 (`README.md:22-23`; LICENSE file itself not read); Jolt MIT (local `LICENSE`, read whole); Epic's docs,
  no licence read, idea only. No code from any of them is proposed for copying.

## 3. The design

### 3a. The loop, one picture

    body file (per kind, picture-only, sourced deltas)  --F5 / file time-->  the game's pose functions
          |                                                                        |
    case (kept-run stretch | treadmill | bend | stairs | stop)  --> viewer (live)  or  capture (offline, every frame)
                                                                                   |
                       manifest + pose trace + frames  -->  seat checks (numbers, tiled stills, yardstick SVG)
                                                    \-->  clip sheet for his eye (labels only from manifests)

### 3b. The body file, one per kind [ours, on the game's own pattern]

- [ours] `content/bodies/<kind>.txt` for hunter, sprinter, interceptor, pack, crawler, charger, stalker, dark, kid. Same
  text as `params.txt` (`textfile.h:16-38`). Only the lines that differ from the human base are written
  (`params_table.cpp:30-43` pattern, [2nd reader: but that writer ends each line with `# desc (default x)`, a comment
  the reader throws away, see the next bullet]), so the hunter's file starts empty and lists his tweaks: item 217's "good metric
  for a really human looking sprint ... and then we tweak it from there" (brief:1607, via ground his_words:545-546).
- [ours] The table: `DZ_BODY_STYLE(X)` with `X(name, def, lo, hi, source, desc)` in a new `game/body_style.h`; the
  defaults are the sourced constants now in `game/model_rig.h` (chain shares :134-144, arms :188-282, legs :350-393;
  ground code:99-160). `source` is a required text; ~~the reader REFUSES a line that sets a value without a `# source:` or
  `# ours` comment, naming the line~~ [2nd reader: WRONG as built on the shared reader. `for_each_pair` cuts everything
  after `#` before it calls the callback (`textfile.h:24-25`), so a comment can never be checked. Either a new reader that
  keeps comments, or a `name.source = text` pair, is needed: more than "same text as params.txt"; mark it [ours] and
  count it in the lap]. [inferred] That makes item 153's rule ("build what the sources found") a parse
  error instead of a review comment.
- [ours] Picture only. The sim's numbers (speeds, the turn law and grip, dials) stay in `params.txt` and the dials, which
  run records keep (`run_record.h:6-9`). The body reader refuses any name that `sim/params.h` or the dials define.
  [inferred] So reloading a body file mid-replay cannot change a fingerprint; reloading `params.txt` can.
- [ours] Reload: F5 re-reads body files with `params.txt` (`world_app.cpp:243`); in the viewer, also when the file's
  time changes (Overgrowth's `SourceChanged`, `asmodule.cpp:433-438`). A bad file keeps the old values and says so
  (`world_app.cpp:247-249`; ~~Overgrowth `ascontext.cpp:336-345`~~ [2nd reader: that Overgrowth span shows an error
  dialog and `return false` only; it does not keep old values, see the correction at the top]).
- [ours] Live editing: the overlay's table editor (`hud.cpp:525-544`) over `DZ_BODY_STYLE`, writing back only changed
  lines. A value saved from a slider is written with `# ours (by eye, <date>)` unless typed with a source.

### 3c. Cases: the same four motions for every kind [ours, defaults sourced where a source exists]

| case | what | defaults | source of the default |
|---|---|---|---|
| kept run | a stretch of one of his runs (straight, corner) | his newest kept run, as `--capture-lean` picks | [read] `offscreen_models.cpp:372-391` |
| treadmill | straight at a set speed | 2.5 / 3.5 / 4.5 m/s; 5.20 / 7.00 / 9.49; 9.0 and 13.4 | [summary] Fukuchi (locomotion:193), Dorn (:302), the hunter's speeds (:178-179) |
| bend | a constant radius at the kind's law | R = 4 m; human H1 5.16 m/s, hunter H2 7.22 m/s from V_o 9.0 | [summary] H1 fitted R 1-6 m, H2 = min(V_o, sqrt(mu g R)), mu 1.33 (locomotion:120-126); the numbers are my arithmetic [inferred] |
| stop | 9 -> 0 m/s | R4.4's stop | [summary] ground physics:192 |
| stairs | the first `Stair` cell on a route from the spawn | 4.5 m/s | [read] `gen/src/gen.h:280`; the speed is [ours] |

- [inferred] The bend case is his chosen cue shown on its own: at R = 4 m a person takes it at about 5.2 m/s leaning
  about 34 degrees, the hunter at about 7.2 m/s leaning atan(1.33), about 53 degrees. Lean = atan(v^2/(gR)) is the
  game's own `atan(speed*turn/9.81)` (~~`offscreen_models.cpp:164`~~ [2nd reader: `:164` is a comment; the code is
  `world_app.cpp:534` and `offscreen_models.cpp:295`, main 31d1c6d]). [2nd reader: arithmetic checked: V_o 9 gives
  5.16, sqrt(1.33 x 9.81 x 4) = 7.22, atan 0.678 = 34.1 deg, atan 1.33 = 53.1 deg. But the human's V_o = 9 is not stated
  here and is the hunter's, not a person's; with a person's own V_o the H1 speed differs. UNSUPPORTED as "a person".]
- [ours] Scripted cases feed their ChaserPose stream through `DrawnChaser::step` at 240 Hz before drawing, so the
  easing he sees in a run is in the case too (staging skips it today, 1b).

### 3d. Cameras and light [ours, after Unreal's camera modes]

- [ours] Four standard cameras, every clip from the same ones: SIDE (4 m off, hip height, square to travel: the
  yardstick sheet's side view, `tools/yardstick/sheet.h:1-4`); BEHIND (4 m back along travel, 1.9 m up, FOV 55: the
  numbers `--capture-lean` uses, `offscreen_models.cpp:411`, `:424`); FRONT; and LOOK-BEHIND (the player's own view).
  SIDE, BEHIND and FRONT move with the subject's travel and do not turn to track it ("Follow Target Actor", Rewind
  Debugger page), so the camera's own sway never reads as the body's.
- [ours] A camera that the sim's ray says is inside a wall moves back along the subject's trail, as the follow camera
  already does (`offscreen_models.cpp:404-421`); LOOK-BEHIND cannot move, so it is gated (3f).
- [ours] Light: the game's own lighting, no grading after capture. Optional `camera_light = 1` places the hand light at
  the staged camera (`stage.cpp:690` takes the view today), labelled on the clip. Whether he wants it is his call (5).

### 3e. The live viewer [ours]

- [ours] `dz-world --anim-view <case> [--subject <kind>]`, windowed, from the case list above, at the display's rate.
- [ours] Time control after ozz (`application.cc:420-430`): freeze, single step, 1/4 speed. Step back and forth through
  the last seconds after Jolt's viewer (`JoltViewer.cpp:68-74`), by re-running the case to the frame (the sim replays
  bit for bit, ground constraints:33-53), so nothing is recorded. [2nd reader: DOWNGRADED. Run against run holds on one
  build; but 14 of his 16 kept runs miss their stored fingerprints (E hand-back :108), so "bit for bit" is not against
  the file. Fine for stepping back; say that the run's own re-run is the reference.]
- [ours] Overlays, each a toggle (Rosen's toggleable layers, sources_read:142; ozz's "Show skin"/"Show joints",
  `sample_look_at.cc:401-402`): skin; the 21 joints as lines (ImGui draw list, as `hud.cpp:213`); the sim root and
  heading drawn apart from the body (Holden `controller.cpp:2118`); planted feet marked (Holden `:2144-2152`); the
  physics lean atan(v^2/(gR)) as a line beside the drawn hips and trunk (item 217's reading, brief:1607 note).
- [ours] Layer ghosts after Pose Watch: the pose drawn before the chain, before the floor, before the ragdoll, as faint
  skeletons beside the final one. [inferred] This is how a seat or he sees which layer made a fault.
- [ours] Setting `debug_skeleton` next to `debug_chasers` (`world_settings.h:56`), so the joints can be overlaid in a
  real run too.

### 3f. The clip sheet: names what each side is built from [ours]

- [ours] Every capture writes, per column: `manifest.txt` (the build's `DZ_BUILD_COMMIT`, the branch if given, the body
  file's sha256 and its changed lines, the run file and the build the run was played on, the case and its numbers, the
  camera, the frame step, each saved frame's sim tick, and `measure` per frame); `pose.csv` (per frame: tick, speed,
  heading, lean, pitch, phase, the 21 joints in metres); the frames.
- [ours] The engine burns the column's label into each frame through the overlay (offscreen ImGui exists,
  `renderer.h:151`): commit, body file, case, speed, camera, frame and tick. No `drawtext` needed.
- [ours] Gates before a sheet is made, each printed as a number: every column the same run or case, the same camera and
  the same frame step (the phase depends on the step, 1a); the subject's chest seen in at least 90% of frames (in the
  frustum, and the two-way sim ray clear, `offscreen_models.cpp:409`); no saved frame whose mean is under 0.8 of the
  column median (a dark start); the base column's commit equal to main's tip, else the label reads OLDER BASE in red.
  [ours] Thresholds 90% and 0.8 have no source.
- [ours] Encoding, when a video is wanted: real time at 120 frames a second from the 240 Hz frames, and the same frames
  at 60 for a quarter speed; no gamma or lift; full range stated (ffmpeg `scale` `out_range`, §11.223); one `psnr` run
  of the video against its PNGs (§11.206) printed in the manifest. [ours] 120 has no source; it is half the sim rate and
  inside his 144-240 Hz "most users" band (item 211, ground constraints:14-15).

### 3g. How a seat checks a clip it cannot watch [ours, from existing instruments]

- [ours] Numbers from `pose.csv`, per column, printed by the capture: pelvis rise and fall per stride in mm (his 195);
  drawn hip, trunk and head bank against atan(v^2/(gR)) (his 214, 217); worst joint move in one frame against the body
  rows' 15 cm (ground physics:207-208); a planted foot's slide in mm during stance; steps a second against Alexander's
  law (ground code:144); the max joint distance between the base and branch columns (if near 0, the change did not reach
  the picture; E's "183 of 192 frames differ" check, `handback/p-l185-steps4-5-E_2026-11-13.md:23`).
- [ours] A tiled still sheet: 8 frames at the eighths of one stride per column (the yardstick's eighths,
  ground locomotion:200), one PNG the seat opens; the engine tiles its own frames, so no ffmpeg `tile` is needed.
- [ours] The yardstick reads `pose.csv` with a new `--trace FILE`, so the drawn frames, not a fresh `gait_pose` call, are
  scored, and its SVG sheet comes from what the game drew.
- [inferred] A seat can then say "pelvis 47 mm, lean 53 against 53, chest seen 100%" before he sees anything; what it
  cannot say is whether it is elegant or creepy (5).

### 3h. Cost per character per frame

- [inferred] Body file: about 20 floats read from a struct instead of compile-time constants, well under 0.1 us; nothing
  else in the shipped frame changes.
- [inferred] Skeleton overlay, only with `debug_skeleton = 1`: 22 projections and 21 lines, a few microseconds of CPU
  and a few hundred overlay vertices. Not in a normal frame.
- [inferred] Viewer, capture, manifests, traces, gates: outside the game's frame. When off, the cost against the
  3.33 ms frame is 0. Not measured; nothing here was run.

### 3i. One layer for the hunter, a lesser chaser and the player

- [ours] Hunter: everything above, now; `gait_pose` and the Rig are humanoid-generic (ground code:189-195).
- [ours] Lesser chaser before its model: the viewer poses `gait_pose` on the hunter's rest joints scaled to the kind's
  outline height (pack 1.15 m, figures.h via ground constraints:111-113) and shows the skeleton only, so a T2/T3/T4 cue
  can be judged as motion before a mesh exists. [summary] T3 needs a spine joint the body lacks (constraints:82). The
  crawler on all fours cannot use the 21-joint humanoid pose at all (ground code:207-208); this layer does not serve it.
- [ours] Player: subject `kid`; cases drive it by `app.carry` (`offscreen_models.cpp:146`) and kept runs; cameras add
  the eye looking down (as `--capture-fpbody`) and the outside views `kid_front`/`kid_three` (`:121-136`). The kid's body
  file holds the `game/body.cpp` constants, most marked "none" for source (ground code:162-183), so their lack of a
  source becomes visible line by line.

## 4. The first lap

**Lap: `--capture-lean` that cannot mislead.** Tier: check it (a tool's output he judges by; no sim change).

Files: `game/world/offscreen_models.cpp` (`run_capture_lean`, :325-485); `game/world/main.cpp` (usage text, flag
`--clip-step`); new `game/pose_trace.h`/`.cpp` (pure: write and read the per-frame CSV); its test file in `game/tests/`;
`game/CMakeLists.txt`.

What changes [ours]:
1. Save every drawn frame of each stretch at `--clip-step` (default 1/240 s, the sim tick) instead of every 12th
   (`:466`); the 0.5 s settling run before each stretch stays (`:457`).
2. In the first pass, which draws nothing (`:351`), compute for each frame of each stretch, for each pass's camera
   (the follow camera at `:404-426`; the look-behind from `app.view()` with the glance held), whether the hunter's chest
   joint is in the frustum and the two-way sim ray to it is clear (`:409`). Choose the corner among stretches the camera
   sees; a pass seen in under 90% of its frames is not written, and stdout gives its share.
3. Write `manifest.txt` and `pose.csv` per pass (3f), and `measure` per saved frame; flag a frame under 0.8 of the
   pass median.

Rows, on his kept run `game/runs/run-20261112-204506.txt` (E's case: fastest straight 13.1 m/s, sharpest corner 177
degrees in 1 s, `handback/p-l185-steps4-5-E_2026-11-13.md:22`):
- R1 `the_capture_writes_no_pass_that_hides_the_hunter`: every written pass sees the chest in at least 90% of its
  frames. RED today: the four look-behind passes "show walls, not the hunter" and were written (brief:1601-1602, ground
  constraints:158). The builder runs the share count on main first and registers it before changing code. It needs no
  GPU (first pass only), so it can run while he plays.
- R2 `consecutive_saved_frames_are_one_clip_step_apart`: from the manifest's ticks. RED today: 12 frames of 1/144 s apart
  (`offscreen_models.cpp:29`, `:466`).
- R3 `every_pass_names_its_build_its_run_and_its_camera`: the manifest carries `DZ_BUILD_COMMIT`, the run's own recorded
  build, the camera and the step. RED today: no manifest is written.
- `pose_trace` unit rows: a trace written and read back gives the same 21 joints to the float; an empty or truncated
  file is refused with the line.
- [inferred] R2 and R3 need a draw pass, so they wait for the heavy-run lock like any capture; R1 does not.

Not in this lap: the body file, the viewer, the overlay, encoding, the page. Next laps in order [ours]: body file
(changes `gait_pose`'s inputs, so every call site, ground code:338 and stage.cpp:279, gets a default); yardstick
`--trace`; scripted cases with `DrawnChaser` easing; the viewer with overlays; the clip sheet. Separately and small:
copy `bl.js`, `rig.py`, `kidlib.py`, `preview.py`, `glbcheck.py` from A's scratchpad into `art/tools/`, as A's hand-back
intended (1c).

## 5. What only his eye can decide, and the fewest clips

- Whether a motion is elegant, and whether a cue is creepy enough: no instrument exists (ground locomotion:218).
- Which four cameras are standard, and whether a camera light is allowed on review clips: taste.
- Three clips, every frame, his newest kept run where a run is used, the same cameras in every column, labels from
  manifests only:
  1. BEND, R = 4 m: a person at the H1 speed; the hunter at the H2 speed with the trunk's share of the bank 0.35 (as
     built), 0.7 and 1.0, each beside the physics lean (the librarian's ruling, brief:1598,
     "Ruled again, 14:4x", plus the H1 column). This shows his chosen cue and his torso note together.
  2. STOP, 9 -> 0 m/s: the upper body's soft key as built against a looser one ("His eye may want more swing than 13
     cm", ground physics:201), on C's fixed legs only (item 216's ruling).
  3. TREADMILL at 9.47 m/s, SIDE: the take-off knee 15 against 25 (ground locomotion:111-112).
- For the kid later, one clip: the eye looking down while strafing at a jog (item 159's crossing feet).

## 6. What I would not build, and why

- A pose or curve editor (keys, tangents): clips are out by his pick (ground sources_read:187), and an editor invites
  home-made numbers, which item 153 removed. Tuning is sourced values plus marked "ours" deltas in a text file.
- A blend tree or node graph editor (Godot's blend space, Unreal's Animation Blueprint): it fits only once clips exist
  (sources_read:84-87).
- Code hot reload (a DLL swap): the tunables are data; F5 already reloads data; a rebuild is cheap next to his review.
- A recorder of every frame's state, as Jolt's `DebugRendererRecorder` or Unreal's trace files: the run replays bit for
  bit, so re-running to a frame is the recorder.
- Blender or another renderer for review clips: his eye judges the game's picture; Blender stays for rigs, joint maps
  and reference stills.
- A tone lift, a re-grade or `drawtext` in the encoder: the lift caused the washed-out clip; labels are drawn by the
  engine.
- A perceptual or learned "creepiness" score: there is no instrument for eeriness (ground locomotion:218).
- A profiler dependency for this loop: `--bench`, the renderer's `DrawTimes` (`renderer.h:283-293`) and E's R4.7 row
  exist; cost is a landing pane's measurement, not the viewer's.
- Sliders in a shipped build: the overlay is a development surface; a value moved by eye is saved to the body file with
  its mark, never left live.

## What I did not open

- `game/model_rig.cpp`, `game/body.cpp`, `game/camera.cpp`, `game/world/world_app.cpp` beyond the lines cited;
  `offscreen.cpp`, `offscreen_fpbody.cpp`, `offscreen_burst.cpp`; any test body; `tools/yardstick/sheet.cpp`.
- Any branch (`l205-stomp-c`, `origin/l185-skeleton`, E's local clone); the worktrees; any clip or artifact page.
- A's scripts beyond their first lines and `bl.js` lines 1-25; whether they still run on Blender 5.2.3.
- Unreal's Animation Insights page; Godot's editor; O3DE; any talk (Rosen, Bollo) or paper.
- `ffmpeg-static`'s licence and build flags; Overgrowth's LICENSE file; who calls Overgrowth's `Reload()` and how often.
- ozz's `shooter` (the URL I tried returned nothing), so its video format is unknown.
- The brief beyond lines 1585-1611; the hand-backs beyond the lines cited; `third_place/`.
- Nothing was built or run beyond `git`, `ls`, `grep`, `sed` and `curl`.

## Second reader

Adversarial read, 2026-11-13. Game code opened with `git show main:<path>` (31d1c6d); outside files fetched with curl
into my scratchpad (ozz 744eb9d, Holden 57b7250, Overgrowth 245fe48 by raw commit URL; ffmpeg.org filters and legal pages;
Blender 5.3 manual CLI and licence pages; npm registry metadata) and read as text. Local Jolt is the vendored v5.6.0.

| line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|
| 50 | params.h table, plain text, error names line | `sim/params.h:6,14,24` | OK | text matches |
| 54-56 | `for_each_pair` "line N:"; `.bak` | `game/textfile.h:16-38,48-50` | OK | as quoted |
| 55-57 | F5 = ReloadParams; keeps old, "(nothing was changed)" | `world_app.cpp:247-249,301`; `params_table.cpp:34` | OK | all three there |
| 58 | only changed values written with desc and default | `params_table.cpp:30-43` | OK | `if (... == f.def) continue;` |
| 59-61 | DragFloat per field with range, tooltip; save | `hud.cpp:525-544`; `world_settings.h:17-22` | OK | it edits the world table, not params |
| 62-63 | ImGui 1.92.9 WIP, PlotLines, MIT | `imgui.h:32,796`; `CMakeLists.txt:48-56`; `LICENSE.txt:1-3` | OK | MIT, Omar Cornut |
| 64-65 | `measure` mean/lit/white; printed per still | `gym/image.h:13-47`; `offscreen_models.cpp:70-71` | OK | 8/255 threshold |
| 66-67 | build stamp "+changes"; run record names build | `build_commit.cmake:1-16`; `run_record.h:6-9` | OK | as quoted |
| 68-72 | staging, staged camera, view, light from view | `stage.cpp:244-258,676-690`; `stage.h:55-56`; `shell.h:77` | OK | `:690` hand_lights(view) |
| 69-70 | staged poses skip DrawnChaser (inferred) | `stage.cpp:257-258`; `world_app.cpp:562-584` | OK | easing is in `ease_poses`, before staging |
| 73-75 | capture-lean 1/144, draws nothing, every 12th, rays | `offscreen_models.cpp:29-30,351,404-426,433,459-466` | OK | as cited |
| 76-77 | `app.carry`; kid views | `offscreen_models.cpp:121-146` | OK | |
| 78-80 | gym course lit, stairs; no gym models; gen Stair | `course.h:4-7`; `course.cpp:92`; grep gym/stage.cpp; `gen.h:279-280` | OK | grep empty |
| 81-82 | 20 `.txt` kept runs, two named, uncommitted | `ls game/runs`; `check-ignore` | OK | 20 txt, 40 files |
| 86-96 | A's scratchpad: 85 files, bl.js, preview.py, rig.py | `ls`; `bl.js:2,6-10,15`; `preview.py:1`; `rig.py:1-3`; A hand-back `:552-555` | OK | joint map is the kid's rig |
| 84 | contradicts "whether they still exist" | ground constraints:205 | OK | new; in no ground file |
| 103-105 | ozz freeze, rate, factor -5..5, capture keys, skin/joints, DrawPosture | `application.cc:294-296,420-430,588-606`; `sample_look_at.cc:345-352,401-402`; `renderer.h:91-94` | OK | fixed-rate slider is 1-200 |
| 106 | Holden: every tunable a slider | `controller.cpp:1415-1419,2199-2460` | DOWNGRADED | 21 sliders; 3 ik constants have none |
| 107-108 | Overgrowth `Reload`, `SourceChanged` | `ascontext.cpp:332-351`; `asmodule.cpp:433-438` | OK | |
| 9, 160 | Overgrowth keeps the old on error | `asmodule.cpp:208-215,1672-1680` | WRONG | dialog; module already rebuilt |
| 109 | Unreal Rewind Debugger quotes | dev.epicgames.com page | UNSUPPORTED | script-rendered; text unobtainable |
| 110-112 | Jolt viewer keys; recorder; DrawSettings | local `JoltViewer.cpp:66-73`, `DebugRendererRecorder.h:18`, `SkeletonPose.h:63-72` | OK | step back is over a recorded draw stream |
| 113-114 | Blender CLI flags; GPL does not reach artwork | manual 5.3 CLI and licence pages | OK | quote at the licence page |
| 115-116 | ffmpeg 11.76/.128/.206/.223/.259; LGPL 2.1+ | filters page; `legal.html` | OK | section numbers match the page today |
| 126-128 | ffmpeg binary: LGPL, no obligation | `legal.html`; npm metadata | DOWNGRADED | ffmpeg-static is GPL-3.0-or-later by its metadata |
| 129-131 | ozz MIT, Holden MIT, Overgrowth Apache-2.0, Jolt MIT | `LICENSE.md:1-2`; `LICENSE:1-3`; `README.md:23`; Jolt `LICENSE` | OK | Overgrowth LICENSE not found at the URL I tried |
| 23-46 | ground-file line cites (about 25 checked) | ground files by `grep -n` | OK | all matched |
| 278-279 | E's case: 13.1 m/s, 177 degrees, 183 of 192 | E hand-back `:20-23` | OK | |
| 176 | game's lean is `atan(speed*turn/9.81)` at `:164` | `offscreen_models.cpp:164,295`; `world_app.cpp:534` | DOWNGRADED | `:164` is a comment |
| 170, 174 | bend numbers, "a person" 5.16 m/s | arithmetic; ground locomotion:120-126 | UNSUPPORTED | maths right; human V_o 9 not given |
| 6, 40-42 | phase depends on frame step | `stage.cpp:269-270`; `world_app.cpp:578` | DOWNGRADED | running sum, tiny step error |
| 151-153 | reader refuses a line with no `# source:` | `textfile.h:24-25` | WRONG | comments cut before the callback |
| 196-197 | sim replays bit for bit | E hand-back `:108` | DOWNGRADED | 14 of 16 miss stored fingerprints |
| 281-283 | R1 is RED today | brief:1601; first pass `:351` | UNSUPPORTED | nobody counted the share; a look at frames |
| 169 | 9.47 m/s treadmill | ground code:158, locomotion:107-108 | OK | Dorn runner row |

Tally (34 rows): OK 24, WRONG 2, UNSUPPORTED 3, DOWNGRADED 5. RE-DERIVED: 0. Section 1b (code) is in no ground file
(grep of 18 terms: all empty); 1c is new and contradicts ground constraints:205.

**Simplest way to pass the first lap's rows without doing what they are for**
- R1 passes by writing nothing: a pass under 90% is not written, so "no written pass hides the hunter" is true of zero
  passes. Needs a companion row: on `run-20261112-204506` at least the two follow passes and one look-behind stretch ARE
  written. Also "chest in frustum and sim ray clear" passes a hunter 30 m off at 3 pixels, or behind a door or prop the
  sim ray does not see: add the chest's screen height as a share of the frame, and a lit check on the same frames
  (`measure` lit share). The first pass has no `staged_look_back`, so its view is not the look-behind's: set it there.
- R2 reads ticks from a manifest the same code writes: it can pass by computing the ticks from the step. Read them from
  the saved PNG names and the app's own tick count at each save.
- R3 passes with constants or empty fields. Compare the manifest's commit with `DZ_BUILD_COMMIT`, the run hash with the
  file on disk, the camera numbers with the ones the code drew from.
- The body-file row "refuses a line with no source" cannot pass on the shared reader at all (see the WRONG above).

**Mechanisms with no source that are not marked [ours]**
- 3c: "the first `Stair` cell on a route from the spawn" as a stairs case: marked [ours] for the speed only; the route
  choice is unmarked and unsourced.
- 3d: the FRONT camera has no distance; SIDE "hip height" is partly marked.
- 3i: scaling `gait_pose` to a lesser chaser's outline height is marked [ours]; the claim it "can be judged as motion" is
  unmarked. `gait_pose` scales by Froude from rest joints (ground code:189-195), so a scaled hunter reads as a small
  hunter, which does not test another kind's cue.
- 3b: the claim that the `# ours (by eye, <date>)` mark satisfies item 153 is [inferred] only.

**What I could not check**
- Unreal's Rewind Debugger text (script-rendered; neither curl nor a summarising fetch got it).
- `ffmpeg-static`'s licence text and build flags (metadata only); Overgrowth's LICENSE file (the URL I tried 404s).
- Whether A's scripts run on Blender 5.2.3; the manual I read is 5.3. `bl.js` reads a lock folder under the room's data
  root (`bl.js:7-10`), so copying it into the game's repo carries a room path with it; not opened beyond line 16.
- The design text in sections 3 to 6: read, not run; nothing was built or timed.
- Rosen's talk and any paper; the yardstick source beyond ground cites.
