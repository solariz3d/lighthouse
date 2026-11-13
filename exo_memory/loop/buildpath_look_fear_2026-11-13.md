# Build path: the look and the fear layer (key look_fear), 2026-11-13

Game repo read at commit 04f3882 (`git log -1`), main. Items: [his N] = `briefs/dreamzone2_the_game.md`. Marks: [read] [code] [inferred] [ours].

## 1. His words

| item | what he asked | note |
|---|---|---|
| 5 | "keeping the proc gen fundementals and raytraced lighting effects" | the base |
| 10, 36 | the flashlight as "a perk or mechanic you unlock"; "a little more lights on average", "darker areas" still allowed, first biome lit | 36 is built as pools (section 2) |
| 13 | sprint feels like "a real sprinter"; camera attached to the body | FOV ramp is movement's; camera/body is player_body's |
| 16, 26 | "a brutal jumpscare lmfao, but not during testing will get old"; at a catch the camera and soul "sucked into this rapturing portal" to the bed | 26 refines 16 |
| 23 | "semi high fov, dreamlike haze", PsychonautWiki distortions "subtle but powerful" | its "out of body" haze is superseded by 26 |
| 26 | "all the sound ... quiets down when a good entity is near by", "resonant golden aura"; "there shouldnt be out of body experiences in the dreamzone" | the OBE wording of 23 is out (see 4a) |
| 27 | intensity "shouldnt be a slider, it should be an algo", "always be a base dream like quality"; FOV rises as something nears and with speed, "never get too fish eyey"; look-behind back | the look-behind is built (V) |
| 43 | "real horror tropes ... truly terrifying content", "flesh calcifies into cold iridescent iron" | direction, not a spec |
| 54, 55 | safe zones "errode becoming hell red and screaming effects" over 10 s, then ordinary space | start 15 s after first entry [his 125]; zones are "the Park" [his 95] |
| 63 | raytraced light "too grainy", "shimmering after images from the player model" | half fixed (section 2) |
| 73, 74 | "pseudo" polish; liminal/creepypasta/nostalgia-bait references; per-character biome themes "comes later" | |
| 75, 76 | no camera, photo or tape look; fear from PsychonautWiki effects; "pseudo photoreal, like stylized hyperrealism through rendering tricks"; base light, surfaces, composition, sound "seem chill" | 75 supersedes D652's A and B looks |
| 78 | the reference is the racing game Night-Runners | its CRT filter is not taken |
| 82 | "do you remember the overall aesthetic"; entities as detailed as can be | with the 13:0x correction to 79: entities are not built blurry; the render decides how sharp they are seen [his 85 note, brief :712] |
| 135, 136 | physics bends stylistically; a bend's cue is "the psychedelic replication distortions ... we hvent built that yet" | makes the director a dependency of movement |


## 2. What exists today

[code] on main 04f3882 unless marked.
- Renderer: one primary ray per pixel, direct light, AO, one bounce, TAA, bloom, grade (`render/renderer.h:3-6`). Motion vectors for chasers and body are in (D651; `Settings::motionVectors`, `renderer.h:104`). The body has its own ray group so the hand light no longer shadows it.
- D656 steps are on main: lamp kelvin per place, dead lamps, lamp-coloured fog, halation, no grain or chroma (`game/world/stage.cpp:184-196`), procedural surfaces, render scale 0.75, dither (`dz.hlsl:751`), speed haze (`stage.cpp:661-667`: fog and bloom rise with speed, eased 0.3 s).
- Textures: apartment only, ambientCG CC0 maps via `ReadDds`, `AddTexture` (`stage.cpp:426-509`). The floor map does not show because floors take the storey below's kit [read] (`handback/p-d660-tex-C_2026-11-11.md:73`).
- Lamp pools: `l162-light` 25dc5e7 is an ancestor of main (checked `git merge-base --is-ancestor`); `biome.cpp:56-60,133,171` hold the field numbers. Its price is stated: pooling moves light, it does not add it [read] (`p-l162-light-E_2026-11-11.md:154`).
- FOV: 100 deg horizontal, +5 deg at `sprint_speed`, up to 1.5x beyond (`game/settings.h` `fov`, `fov_speed_add`, `fov_speed_limit`; `game/camera.cpp:146-154`), applied in `game/shell.cpp:195`. The ramp is keyed to `sprint_speed`, not the 8.75 peak.
- Hand light, flashlight (`flashlight = 0` design default), focus beam: `game/world/beam.cpp`. Look-behind: V.
- A threat signal already exists: the chase director's `intensity()` (`chase/run.h:192`, built at `chase/run.cpp:1158-1161`: +1/8 s pressed, +1/4 s close, -1/10 s otherwise), shown in `game/world/hud.cpp:234`. It is hashed into the run (`run.cpp:554`), so read it, never change it for looks.
- Caught today is "the cut to dark" (`RunPhase::Ended`, `world_app.h:52-58`).
- Reprieve tell: a pulsing light, rate (1.2 + 5 x tell) Hz, so up to 6.2 Hz, amber to red (`stage.cpp:708-710`).
- NOT in code: grep finds no seizure, photosensitivity, flash-limit, jumpscare, dream-intensity or director-for-looks text (checked over `*.cpp *.h *.md *.hlsl`, excluding third_party and build).
- Branches in flight on look: none. Tonight's lanes (A chase, B body, C hunter, E physics and sound) do not touch `render/` [read] (`loop/plan_13h_run_2026-11-13.md`, lanes). Queue step 14 is "waiting" (`loop/queue_dreamzone3_2026-11-12.md`, row 14).

## 3. What the room knows

- Effect menu with PsychonautWiki definitions and a per-effect technique: breathing, flowing, tracers, haze, colour enhancement, perspective distortion, stretching, slicing, recursion [read] (`handback/p-l161-look-E_2026-11-11.md:27-38`). All costs there are inferred, none timed (`:157`).
- With item 75 applied: grain, chroma, VHS, flash are out; noise lives on surfaces only; bands of one dial 0 to 1 [read] (`p-d653-target-E_2026-11-11.md:99-133`). The catch: a warp TAA is not told about smears (`:133`, untried).
- Costs measured: step 2 +0.05 ms, step 3 -0.75 ms (p99 2.37 to 1.49) [read] (`p-d656-look-C_2026-11-11.md:90`). Textures +0.002 ms (`p-d660-tex-C`, frame cost table). Budget 2.78 ms (`docs/ARCHITECTURE.md:57`).
- Open from item 63: shadows a mover casts on still floor still trail; world grain while sprinting is untouched (29-37 % of pixels over 8 levels from settled) [read] (`p-d651-render-C_2026-11-11.md:89-90`). The planned remedies are a reactive/disocclusion term and a depth/normal-guided spatial pass (`p-l165-render-C_2026-11-11.md:172`). The dither is interleaved gradient noise, not true blue noise (`p-d656-look-C:66`).
- Camera sickness: the repo's research lists FOV, motion blur and reticle as nausea levers [read] (`docs/research/03_movement_chase_research.md:49,100`).
- Seizure thresholds [read, outside]: WCAG 2.2 SC 2.3.1, no more than 3 general or 3 red flashes in any second, or flash area under 0.006 sr; a general flash is an opposing pair of at least 10 % of max relative luminance with the darker side below 0.80 (https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html; page shows W3C permissive license rules). Game Accessibility Guidelines: avoid; else give "adequate and obvious warning" and "an option to disable"; do not call a setting "epilepsy safe"; Harding Test does not guarantee safety (https://gameaccessibilityguidelines.com/avoid-flickering-images-and-repetitive-patterns/; no licence shown).
- Unresearched: Night-Runners seen only as text; published dynamic-FOV values (research doc `:97` says none found); jumpscare design; PsychonautWiki not re-read since L161.

## 4. Contradictions and calls that are his

a. **Out of body haze (23) against none (26).** Options: (1) keep the haze, drop the OBE "camera lifts out of the body" beat: costs nothing, loses E's lucid beat; (2) keep the OBE only in the waking room's chair; (3) delete the haze: loses item 23's core. [ours] pick 1.
b. **Who sets intensity inputs (27).** Options: chase pressure + distance only (cheap, honest to 27); add depth/tier and stress (needs stress aspect); add the timer (his run_frame call). Cost of more inputs: tuning time and coupling.
c. **FOV key.** Keep the widening on `sprint_speed` (the long 7 to 8.75 climb is unseen) or key it to the peak [read] (`p-l161-look:60`). Cost: the second changes how fast every run feels.
d. **Reprieve erosion red (54).** "Hell red and screaming" vs the red-flash limit. Options: slow red ramp, no pulsing above 3 Hz (safe, less frantic); pulsing allowed only with the setting off. Needs his word on how violent.
e. **Photosensitivity default.** Warning at first launch and an `effects_intensity` setting (proposed by the librarian in the design doc, section 9) versus nothing until later. Cost of delay: the director's flashing effects must not ship without it.
f. **Jumpscare gating (16).** Off in dev and test runs by a setting, on by default for players? His line is "not during testing". Needs confirming that "testing" means his own sessions.

## 5. The build path

### Lap 1: the director and the dynamic FOV (he can see the view open as the hunter closes)
Files: new `game/dream.h`, `game/dream.cpp` (presentation-only, in `game/` so it tests without the GPU); `game/CMakeLists.txt`; `game/world/stage.cpp` (read inputs, apply to `camera.fovYDegrees` after `app.view()`, line 678-682); `game/world/world_settings.h` (new dials `dream_base`, `fov_threat_add`, `fov_cap`); new `game/tests/dream_tests.cpp`.
Design [ours]: `DreamInputs {nearest_chaser_m, intensity, speed_frac, in_reprieve, good_near}` in, `DreamState {level, fov_add_deg}` out. Level has a floor above 0 (item 27's "base dream quality") and a slew-rate limit. It must never write to the sim or the run hash.
Red first: (1) level never below the floor; (2) closer chaser gives a larger `fov_add`, monotonic; (3) total FOV never above `fov_cap` (never fish-eyed); (4) level changes at most X per second (the limiter that later keeps flashing safe); (5) same inputs give the same output (determinism). All red because the file does not exist, green after.
Not touched: `camera.cpp` and sim, so the camera tests stay green.

### Lap 2: the seizure rule and the warning, before any flashing effect
Files: `game/dream.cpp` (a flash limiter), `game/settings.h` (`effects_intensity` 0..1), `game/world/stage.cpp:708-710` (the tell), `game/world/hud.cpp` (a first-launch warning card), `game/tests/dream_tests.cpp`, `game/tests/settings_tests.cpp`.
Tests red then green: (1) a luminance-multiplier series fed through the limiter never has more than 3 opposing changes of 10 % per second; (2) the reprieve tell's multiplier series today fails that (rate up to 6.2 Hz, `stage.cpp:708`); fix by capping the rate at 3 Hz or smoothing; (3) `effects_intensity = 0` gives level at floor and no effects. Proxy caveat: the test counts the light's multiplier, not screen luminance, so also capture the tell with `--capture-burst` and count frame-mean changes [ours].
Wording: "screen flash effects", not "epilepsy safe" (guideline above).

### Lap 3: the projection layer (breathing, stretch), then slicing
Files: `render/shaders/dz.hlsl` (`PrimaryDirAt`, :414-418, which TAA also calls at :626, so one change warps both), `render/renderer.h` (`Settings` warp fields), `render/src/renderer.cpp` (constants), `render/view/main.cpp` selftest, `game/world/stage.cpp` (director to settings).
Tests: warp 0 is byte-identical to today's frame; warp > 0 moves an edge ray and not the centre ray; a still scene under breathing settles (frame-to-frame change below a bar) so TAA does not smear. Cost: expected near zero (ray direction), timed on D only; no timing on L.
Slicing (bands yawed) follows once breathing passes.

### Lap 4: haze, tracers, colour from the level; the Park's erosion look and the golden aura
Files: `stage.cpp` (fog colour and density, `taaHistory`/`taaClip`, saturation and warmth driven by level), `render/` only if a per-pixel reactive hook is needed. The erosion look reads the Park's erosion state from the Park kit (queue step 3); the golden aura needs a good entity (queue steps 4-5). Test: level 0.0 and 1.0 captures differ in the named settings only and stay under the flash limit. Fold in the open grain work here or run it in parallel (below).

### Lap 5: the catch as a scene
`RunPhase::Ended` becomes a short sequence: camera lunges, FOV snap, portal pull to the bed. Files: `game/world/world_app.*`, `stage.cpp`, sound. Gate `jumpscare` setting; the sequence goes through the limiter. Needs `entity_bodies` and `waking_room`.

### Parallel lane (independent, render only): finish item 63
Reactive/disocclusion term in TAA and a depth/normal-guided spatial pass (`dz.hlsl`, `renderer.cpp`), red row: sprint burst pixels over 8 levels from settled falls below a registered bar (`--capture-burst`). Frame cost to D.

## 6. Connections

| key | needs from it | gives it |
|---|---|---|
| run_frame | catch event, timer, Park erosion state | level and the catch scene's look |
| chase_entities | nearest-chaser distance, `intensity()` | the visible cue for pressure |
| entity_bodies | detailed bodies; render decides sharpness | haze and light that hide or reveal them |
| player_body | head ray group, hands | calcifying hands and the body's material |
| movement | -- | the bend cue, [his 136]; FOV ramp keyed to peak |
| abilities | flashlight unlock, aura | beam and golden light |
| stress | stress level | a director input (optional) |
| meta_loop | seizure setting in settings screen | -- |
| waking_room | bed and portal | catch scene destination |
| world_gen | kit numbers, UVs-less box projection, biome light | per-biome lamp temperature and surface maps |
| sound | duck on good entity, erosion screams | the same level as a sound input |
| story_lore | tier names, designed pieces | per-tier look |
| frontdoor_onboarding | warning card slot | the warning text |
| tech_foundation | frame budget, ray groups | cost accounting |

## 7. Where it is going

Per-biome palettes and the remaining biome maps; the rare "outside" with flat overcast and a green hill [his 26]; per-character biome themes [his 74]; recursion and symmetry effects for lore moments; "calcifying iron" skin for the body on a deep tier [his 43]; real reflections only where a biome needs them (pool rooms, new rays); a tier ladder of Focus numbers driving the level.

## 8. Not verified

- No build, test or timing was run; every cost beyond section 3's measured rows is [inferred].
- I did not run the repo's tests; "red before" claims are by design, not observed.
- Whether the tell's pulse breaches the WCAG limits is unmeasured: the rate is read, the screen luminance change is not.
- Dynamic FOV values (cap, gain) are [ours]; no source supplies them.
- The handbacks' captures were not opened. Item 70 (2004-05 period) not re-read; its capture-device look is out under 75.
- Items skipped: none.

## Verification (second reader, 2026-11-13)

Repo re-read at 04f3882 (main). Brief = briefs/dreamzone2_the_game.md.

(a) Quotations
- [his 5] "keeping the proc gen fundementals and raytraced lighting effects": ok (brief :21).
- [his 10] "a perk or mechanic you unlock": ok (brief :66-68, text is "like a perk or mechanic you unlock or find").
- [his 36] "a little more lights on average", "darker areas": ok (item 36).
- [his 13] "a real sprinter": ok. [his 16] "a brutal jumpscare lmfao, but not during testing will get old": ok.
- [his 26] "sucked into this rapturing portal", "resonant golden aura", "there shouldnt be out of body experiences in the dreamzone": ok. "all the sound ... quiets down when a good entity is near by": ok as an elided quote (source has "all the sound that occurs in the game ... it all quiets down").
- [his 23] "semi high fov, dreamlike haze", "subtle but powerful": ok. [his 27] "shouldnt be a slider, it should be an algo", "always be a base dream like quality", "never get too fish eyey": ok.
- [his 43] "real horror tropes ... truly terrifying content", "flesh calcifies into cold iridescent iron": ok. [his 54] "errode becoming hell red and screaming effects": ok.
- [his 63] "too grainy", "shimmering after images from the player model": ok. [his 75] "pseudo photoreal, like stylized hyperrealism through rendering tricks": ok. [his 76] "seem chill": ok.
- [his 82] "do you remember the overall aesthetic": ok. [his 136] "the psychedelic replication distortions ... we hvent built that yet": ok. [his 74] "comes later": ok.
- Row "73, 74": WRONG in attribution. The quoted word "pseudo" is from item 75 (brief :638-ish, "pseudo photoreal"); items 73 and 74 do not contain it (73 says "refined animations and quality of style").
- [his 85 note, brief :712]: ok (the correction runs :711-715). [his 125] 15 s start: ok (brief :1006-1009). [his 95] "the Park": ok (brief :786-791).

(b) [code] citations (12 opened)
- render/renderer.h:3-6 one primary ray, direct light, AO, one bounce, TAA, bloom, grade: ok.
- renderer.h:104 `motionVectors`: WRONG line; it is at renderer.h:100.
- game/world/stage.cpp:184-196 (lamp haze, chroma 0, grain 0, surfaces, renderScale): ok.
- stage.cpp:661-667 speed haze eased 0.3 s: ok. stage.cpp:678-682 view then camera.fovYDegrees: ok.
- stage.cpp:708-710 tell rate (1.2 + 5 x tell) Hz, amber to red: ok (max 6.2 Hz follows).
- game/camera.cpp:146-154 and game/shell.cpp:195 FOV ramp keyed to sprint_speed, +5 deg, limit 1.5: ok (settings.h:29,40-42 match).
- chase/run.h:192 intensity(); run.cpp:1158-1161 rates 1/8, 1/4, -1/10; run.cpp:554 hashed: ok. game/world/hud.cpp:234 shows it: ok (text at :234-235).
- game/world/world_app.h:52-58 RunPhase::Ended "the cut to dark": ok.
- render/shaders/dz.hlsl:414-418 PrimaryDirAt, :626 called in the TAA pass, :751 dither IGN comment: ok.
- biome.cpp:56-60,133,171: ok on lines, but the file is gen/src/biome.cpp, not named with a path in the document (builder could look in game/world/).
- docs/ARCHITECTURE.md:57 (2.78 ms, 360 fps); docs/research/03_movement_chase_research.md:49,97,100: ok.
- NOT in code (no seizure/photosensitivity/jumpscare text): ok (grep of *.cpp *.h *.md *.hlsl found none).
- l162-light 25dc5e7 ancestor of main: ok (git merge-base --is-ancestor).

(c) Outside sources and room handbacks leaned on
- WCAG 2.2 SC 2.3.1 page: ok (3 flashes/second, 0.006 sr, 10 % pair, darker side below 0.80 all on the page; footer says "W3C liability, trademark and permissive license rules apply", correctly stated).
- Game Accessibility Guidelines page: ok in substance (warning, "epilepsy safe" never used, Harding does not guarantee; no licence shown). Small softening: the page says "investigate providing an option to disable them", the document drops "investigate".
- handback/p-l161-look-E:27-38, :60, :157; p-d653-target-E:99-133; p-d651-render-C:89-90; p-d656-look-C:66,90; p-d660-tex-C:73 and the frame-cost table (+0.0013 GPU avg, +0.0017 trace, about 0.002 ms): ok. loop/queue_dreamzone3 row 14 "waiting": ok.
- p-l165-render-C:172: weak. Line 172 is the heading; the reactive/disocclusion term and depth/normal spatial pass are items 3-4 at about :178-179.
- Section 3 "step 3 -0.75 ms (p99 2.37 to 1.49)": mixed units. The 0.75 ms is the trace saving (d656-look-C:90); the p99 drop in the table (:83,:86) is 2.374 to 1.492 ms, about 0.88 ms. Both numbers are real, they are not the same quantity.
- Section 3 "Textures +0.002 ms" is the doc's own wording of p-d660-tex-C, ok.

(d) Marks
- Nothing marked [read] is without a path or URL. [read] marks all resolve to opened files. The "Not read" list is absent, but the document states Night-Runners, dynamic-FOV values, jumpscare design and PsychonautWiki as unresearched (section 3): ok.

(e) Other findings
- Section 2 "Branches in flight on look: none": mostly ok, but branch l188-wip-look (a60944d, "WIP, NOT TO LAND", head-first look of the body) touches game/shell.cpp (+8 lines), the file where the FOV is applied (shell.cpp:195). Not the render look, but Lap 1's FOV work should rebase on it or avoid shell.cpp. Not mentioned in the document.
- Section 2 "tonight's lanes do not touch render/": ok per plan_13h_run lanes, but lane C works in game/world/ (queue step 2 frame, world_app) and Lap 1 and Lap 5 edit game/world/stage.cpp and world_app.*; a merge-conflict risk the document does not name.
- Lap 1 "dream.h, dream.cpp, tests/dream_tests.cpp": none exist yet (expected). Whether game/CMakeLists.txt needs the tests listed was not checked.
- The plan_13h_run "where things stand" says main = e0184ea; the repo is now at 04f3882 (two merges later). Document correctly cites 04f3882.

(f) Coverage of assigned items 5, 10, 13, 16, 23, 26, 27, 36, 43, 54, 63, 73, 74, 75, 76, 78, 82, 135, 136: all addressed in section 1 (54 with 55). Skipped: none. "Items skipped: none" is correct.

Totals: 41 checks; 36 ok; 3 WRONG (item "pseudo" attribution to 73/74; renderer.h:104 should be :100; p99/0.75 ms conflation, plus weak l165:172 anchor counted as minor); 2 notes of omitted risk (l188-wip-look, lane C overlap); 0 could not check.
