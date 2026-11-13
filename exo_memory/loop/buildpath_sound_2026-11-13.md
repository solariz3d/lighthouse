# Build path: sound and music (key: sound), 2026-11-13

Game repo read at checked-out commit 04f3882 (main, 3 ahead of origin). Marks: [read] opened and read; [code] file:line; [inferred] my reasoning; [ours] a proposal with no source. Nothing was built or run. His words are the brief `briefs/dreamzone2_the_game.md`, cited [his N].

## 1. His words

| item | what he asked | line |
|---|---|---|
| 16 | The main entity's footsteps "bassy and loud like thundering almost"; "a brutal jumpscare", "but not during testing will get old". | 84-87 |
| 26 | All sound (breathing from sprinting, entities, the field's contortion) "quiets down when a good entity is near by"; a golden aura; a "harmonious cord or tone" that brings you closer to love. A "low vol theta" binaural beat "blended in with the rest of the sounds". The catch is a brutal jumpscare and a portal home. | 161-192 |
| 54 | Safe zones erode over 10 s "becoming hell red and screaming effects". | 438-442 |
| 76 | Keeps the look page's sound: "sound seem chill" (ballast hum, HVAC, room reverb, distant muzak). | 638-642 |
| 77 | "ray traced audio or whatever"; study Bodycam's sound design. | 643-647 |
| 92 | Lesser entities "hear you, and then slowly move toward the sound until it sees you"; the hunter excepted. | 756-763 |
| 178 | "once we get better sound it will be better player experience instead of constant ganks with no footsteps u can hear barely". | 1197-1202 |
| 90 | After playing D656's sound: "the sounds themselves need work". | 744-747 |
| 11 | Likes the safe zones; amused by "the windows device sound" used as an effect. | 69-70 |

Supersession: 90 (after D656) overrides 76's "chill" for the game's own sounds; 76 was a verdict on the look page's trait list, not on the build. 178 asks for what 16 deferred ("eventually"). Item 77 says "or whatever", so C's rooms-and-portals answer is inside his word.

## 2. What exists today

- [code] `audio/` is a pure mixer, no device, 81 tests. `audio/audio.h:61-133` holds Scene, Source, Room, Floor, Ambient. All sound is synthesised; only the bed is a WAV.
- [code] The hunter voice (`audio/mixer.cpp:287`) is a 43-46 Hz sine thud plus dust, fired by its own step clock: 0.9 + 0.16 v steps a second, 0.8 to 2.6 (`mixer.cpp:59`). It does not know the drawn legs. Range 30 m; level 2 m over distance (`audio.h:21`).
- [code] The hunter's tone is a drone at 44-88 Hz, in no place (`mixer.cpp:470-486`).
- [code] The reverb (FDN, 8 lines, `mixer.cpp:1054`) takes a Room set from the layout (`game/world/acoustics.cpp:20`, one row per biome, 8 biomes). Occlusion is still one flag (800 Hz, -9 dB, `mixer.cpp:46-47`, set by one ray, `sound.cpp:168`).
- [code] Place sounds: ballast, flicker, dead tube, fridge, TV (`mixer.cpp:869`). The dead tube and its fixture are one decision (D657's hand-back).
- [code] Player feet by floor (carpet, tile, concrete, metal): `mixer.cpp:516-623`. A chaser's steps ignore the floor (`audio/README.md:241`).
- [code] Lesser-entity hearing is straight-line range, halved through geometry (`chase/run.cpp:945-972`, `archetype.h:68`). The hunter does not use it.
- [code] The drawn hunter's step phase is `hunter_phase_` in `game/world/stage.cpp:269` (render side). `ChaserPose` carries no phase (`world_app.h:79`). The stride law is `model_rig.h:271`.
- [code] Not in code: breathing, binaural beat, a chord, a calm or fear input, any jumpscare, muzak, per-biome beds, HRTF, Doppler. A grep for binaural or theta over the repo finds nothing. No system-beep call exists either (grep MessageBeep, PlaySound: none), so item 11's sound is not in this build.
- **In flight:** branch `l192-footsteps` b61ce52 (E): three rows registered red on 04f3882, plus `Source::stride_phase` and `stride_rate` in audio.h, unused (`git show`). `plan_13h_run_2026-11-13.md:84` puts L192 second in E's lane, after L185 mutants. The bed is `../dreamzone-rt/ambience1.wav` (exists; licence not checked).

## 3. What the room already knows

- C's D654 (`handback/p-d654-audio-C_2026-11-11.md`): build acoustics on the generator's grid, not a ray tracer (:7-15); the table of Steam Audio, Wwise, FMOD, Hitman, Siege (:51-58); the three-step order (:128-134); the lesser entities' hearing should use the same paths as the player's ears (:119-126). Steam Audio is Apache 2.0 with a custom scene callback, so a new dependency to ask about (:53).
- A's D656 (`p-d656-sound-A_2026-11-11.md`): reverb, floors, lamps, appliances measured (:29-127); the reverb return had to be normalised or the reprieve tell check failed (:152-177); "levels are first guesses for his ear" (:186); chaser steps on their own floor and the next room's reverb are not built (:183-186); the fear layer is not built (:185).
- P's landing (`p-d657-d656-land-P_2026-11-11.md:46-67`): dead lamps heard once each.
- E's look page (`p-d652-look-E_2026-11-11.md:41-43`): room tone, space, and absence of voices as the sound traits.
- L192 plan (`loop/plan_l192_hunter_footsteps_2026-11-13.md:8-32`): one footfall per drawn step, force curve from Keller 1996 and Weyand 2000, a 6 dB margin over the bed above 150 Hz ([ours], marked).
- **Unread or unresearched:**
  - Bodycam's method is thin (D654:137-143).
  - I did not open Keller or Weyand; the test header quotes them (`footstep_tests.cpp:7-12`).
  - Binaural-beat evidence: a search summary only, see section 8.
  - No research yet on chord or consonance synthesis, breath synthesis, jumpscare design, recorded-sample sources, HRTF, or Doppler (D654:143).

## 4. Contradictions and calls that are his

1. **Does the good entity quiet the hunter's thunder too?** Item 26 says "all" sound quiets; item 178 wants footsteps heard for fair ganks. (a) Duck everything, hunter footfalls included, as he said: strongest feeling, but the hunter is silent while the player is safest. (b) Duck everything except the hunter's footfalls, to a floor: fair, weaker. (c) Duck breathing and the field only. [inferred] Cost of (a) is a fairness bar to re-run.
2. **Synthesised or recorded?** Item 90 says the sounds need work; the room's advice was code does hums well and "anything physical or alive badly" (brief 744-747). (a) Keep synthesis, restyle. (b) Recorded clips for feet, breath, voices only, from CC0 or his own recordings; needs a licence log and a sample slot. (c) Both, A/B by ear. Which sounds fall short is unasked.
3. **The binaural beat: default and claim.** The design doc proposes headphones-only and no claimed effect (`dreamzone3_design.md:246`). (a) On at a low level with a settings toggle. (b) Off until chosen. (c) Cut. Cost: (a) invites an effect claim the evidence may not carry.
4. **"Screaming effects" in the eroding safe zone (54).** audio.h's Caught cue is "no scream" (`audio.h:76`), an old placeholder choice, not his. Screaming is his word; is it a wail made of the field's own sound or a human-like cry? Cost: a human-like cry is the hardest thing to synthesise (call 2).
5. **Jumpscare switch (16, 26).** A brutal catch scare he asked for, "not during testing". (a) A setting, off by default in dev builds. (b) On in release only. Cost: a scare he cannot test is never tuned.
6. **HRTF.** Stereo pan confuses front and back (`audio.h:18-20`). Adopting Steam Audio's HRTF is a new dependency; the rule is to ask first. Not blocking.

## 5. The build path

**Lap 1 (first playable): the hunter's footfalls, L192 as planned.** He hears each drawn foot land, thunder-weighted, loud enough over the bed.
- Files: `audio/mixer.cpp` (hunter voice from `stride_phase` and `stride_rate`, per-sample phase so a footfall lands within one tick between 60 Hz scenes; force-curve level; low-end weight plus harmonics above 150 Hz so a laptop speaker carries it); `game/world/stage.cpp` and `sound.cpp/.h` (hand the drawn phase and rate to the Scene) [inferred wiring; `WorldStage` holds a `WorldSound*`, `stage.h:45`]; `audio/README.md`, `CHANGES.md`.
- Red first, already registered at b61ce52: footfall timing (7 for 13 contacts), level against distance and speed (+0.05 dB at 4 m/s against -3.08 registered), "can he hear it" (4.0 dB under the bed). Add one wiring row in `game/tests/world_app_tests.cpp`: the scene's hunter phase equals the drawn phase [ours]. Guard, not red-first: kept runs replay with unchanged fingerprints.
- For his eye: a clip with sound, the hunter closing from behind. Take call 1's option (b) as the default until he says otherwise [ours].

**Lap 2: sound that travels like a person walks, player side only (D654 step 2).** A chaser behind a doorway is heard from that doorway, with a loss per length and per turn, and each chaser steps on its own floor.
- Files: `game/world/acoustics.*` (a bounded walk-graph search per voiced chaser), `sound.cpp`, `audio/audio.h` (Source gets a heard-from direction and a loss), `mixer.cpp`, tests. Red: a chaser one doorway away is panned toward the doorway and quieter than the straight-line law gives; a chaser on carpet differs from one on tile.
- Cost: a search per chaser per frame on the game thread (inferred small, not measured; frame cost is checked on D).

**Lap 3: the calm input and the chord.** `Scene::calm` (0 to 1) ducks breath, field and chasers per call 1, and fades in a golden chord (our own stacked-interval synth, slow beating).
- Files: `audio.h`, `mixer.cpp`, tests. Red: at calm 1 the chasers fall by a registered number of dB and the chord's partials are present; at 0 the mix is bit-identical to today (the D656 pattern, `audio.h:36-38`). No good entity exists in code, so the test drives `calm` directly.
- Gated on call 1.

**Lap 4: the player's body and the bed.** `Scene::exertion` for sprint breath (synthesised first, call 2 decides later); a theta binaural layer in `Levels`, left and right sines a few Hz apart, outside the reverb, never cross-fed.
- Red: the channel difference measures the set beat within 0.1 Hz; the layer sits under the bed by a registered margin; it is silent when off. The settings screen belongs to frontdoor_onboarding.

**Lap 5: the sounds that fall short, and the safe zone's erosion.** A listening packet (rendered WAVs per kind, as D656's renders were) gets his pick of what to redo; a sample slot reuses the bed's loader (`audio/wav.cpp`). The erosion's sound follows the creep (queue step 3): the reprieve's growing tell exists (`README.md:156-159`); the red-hell scream waits on call 4.

**Lap 6: lesser-entity hearing on the walk graph (D654 step 3).** The sim's `sense` and the player's ears share one path function, deterministic, so what a lesser chaser hears the player hears coming. This is `chase_entities`' lap 4 (`buildpath_chase_entities_2026-11-13.md:78`); sound supplies the function and the pairing test. It changes chase outcomes, so fingerprints change once, recorded.

## 6. Connections

| key | sound needs | sound gives |
|---|---|---|
| entity_bodies | the drawn step phase and rate (stage.cpp:269); contact events later (L185 skeleton) | footfalls that match the legs |
| chase_entities | the shared hearing path (lap 6); Sighted and Lost already cued | the audible tell each signature needs |
| movement | slide, landing, ladder events (cued today) | sweeps and whooshes (`buildpath_movement_2026-11-13.md:87`) |
| stress | the meter as a scalar | the fear layer's breathing and field; Resonant's chord |
| look_fear | the dream director's intensity; the golden grade | audio cue points for the golden phase |
| run_frame | timer, close and catch points | the overtime build: field falls quiet, chord, white-out (`buildpath_run_frame_2026-11-13.md:108`) |
| world_gen | per-biome numbers, the outside biome, lamp states | acoustic rows (move into `gen/` as one table) |
| waking_room | the room's scene | a bedroom bed; the portal's sound |
| story_lore | tapes as audio | tape playback needs the sample slot |
| tech_foundation | the audio-thread budget (0.158 ms per 10 ms, D656:144) | a cost bar |
| abilities, meta_loop, frontdoor_onboarding | ability cues; volume and binaural settings | cues each ability must show |

## 7. Where it is going

- Per-biome beds: facility server whine, a mall's own slowed muzak (synthesised, no licensed tracks), pool water, the rare outside's near silence (`dreamzone3_design.md:168`).
- A second reverb heard through the doorway (rooms and portals), then optional Steam Audio reflections and HRTF (asked first).
- A dream director for sound: grain, detune and dropouts keyed to intensity (his 27).
- The catch: the brutal scare, the portal's pull, the wake-up room's quiet.
- Tapes and the father's voice as recorded layers, if call 2 allows recordings. Whatever replaces the TV's wordless murmur must keep to the look page's "no voices".
- Hunter-first priority in the mix so thunder cuts through any scene.

## 8. Not verified

- Nothing was built, run or listened to. Every number above is quoted from a file, not measured.
- Item 11's sound (the "windows device sound") is not found in current code; I do not know which build had it.
- Binaural beats: a search returned a summary of Garcia-Argibay, Santed and Reales (Psychol Res 2019, doi 10.1007/s00426-018-1066-8: 22 studies, g = 0.45, timing and frequency matter, no theta-specific result seen). Its PubMed page would not load, so it is not read. Treat the physiological effect as unproven.
- Threat-sound design theory (Garner: low rumbles connote unknown threat; slowly rising unseen sound) and a Left 4 Dead composer's cue note came from search summaries of blogs, not opened. No Valve commentary was found.
- Where the stage hands the phase to sound, and whether the render frame's `last_dt_` drifts from the sim's 240 Hz tick, is inferred, not traced.
- The drawn hunter's real footfall rate at 9 m/s (the tests assume 4 contacts a second) is not computed.
- Items skipped: none. Item 54's and 26's non-sound clauses (the erosion's look, the portal, the room, tapes) belong to world_gen, look_fear, run_frame and waking_room.

## Verification (second reader, 2026-11-13)

- (a) [his N] quotations, items 11, 16, 26, 54, 76, 77, 90, 92, 178: ok. Every quoted phrase was found by grep in `briefs/dreamzone2_the_game.md` under the stated item (some wrap across a line break, e.g. "a brutal / jumpscare", "ray traced audio or / whatever"). Item 16's "but not during testing will get old" is at line 87, correct.
- (a) Brief line ranges: ok for 16 (84-87), 26 (161-192), 54 (438-442), 76 (638-642), 77 (643-647), 90 (744-747), 92 (756-763), 11 (69-70). Minor: item 178 sits on line 1197 alone; "1197-1202" is loose.
- (b) [code] `audio/mixer.cpp:46-47` as "occlusion 800 Hz, -9 dB": WRONG. Lines 46-47 are `kReprieveDuck` and `kReprieveBedDuck`. The occlusion values are `kOccludedHz = 800.0f` at `mixer.cpp:43` and `kOccludedGain = 0.355f // -9 dB` at `mixer.cpp:44`. The numbers themselves are right.
- (b) `audio/audio.h:76` "Caught cue is no scream": WRONG by one line. It is `audio.h:75` (`Caught, // the run's end: short, low, no scream`).
- (b) "stride law is `model_rig.h:271`": WRONG. The file is `game/model_rig.h` (not under `game/world/`) and `gait_phase_per_metre` is declared at line 269.
- (b) `loop/dreamzone3_design.md:168` for "the rare outside's near silence": WRONG. Line 168 of `briefs/dreamzone3_design.md` is the trinket-animation item. The outside biome is at line 232 (with 245 and 249); no line there says "near silence" of the outside. Also the design doc is `exo_memory/briefs/dreamzone3_design.md`, not in the game repo.
- (b) ok: `mixer.cpp:287` hunter voice with 43/46 Hz at :293; `mixer.cpp:59` hunter row (30 m, 0.9, 0.16, 0.8, 2.6); `mixer.cpp:470-486` tone 44/44.8/66.3/88.4 Hz; `mixer.cpp:1054` Reverb with 8 lines (kLines=8 at :1047); `mixer.cpp:869` AmbientSpec; `mixer.cpp:516` Steps; `audio.h:21`, `audio.h:18-20`, `audio.h:36-38`; `acoustics.cpp:20` kBiomes; `sound.cpp:168` one raycast sets `occluded`; `run.cpp:945-972` `Run::sense`; `archetype.h:68` hear_through 0.5; `stage.cpp:269` hunter_phase_; `world_app.h:79` ChaserPose has no phase field; `stage.h:45` `WorldSound* sound`; `audio/README.md:241` and `:156-159`; 81 tests in `audio/tests/` (counted by grep of TEST macros).
- (b) Branch l192-footsteps b61ce52: ok. Commit message states the three red rows (7 of 13, +0.05 vs -3.08 dB, 4.0 dB under the bed) and `stride_phase`/`stride_rate` at `audio.h:118-119`; Keller and Weyand are quoted in the test header. `plan_13h_run:84` is ok, but see next line.
- (b) "L192 second in E's lane, after L185 mutants" (`plan_13h_run:84`): partly ok. Line 33 of the same file says E's L193 motion yardstick comes before L192, so L192 is not simply second in E's order; the document should name that.
- (b) "A grep for binaural or theta over the repo finds nothing": ok for game code, but a repo-wide grep hits `third_party/JoltPhysics` (unrelated `theta` variable). Say "outside third_party".
- (c) Outside [read] sources: could not check. The document marks none as read; section 8 declares the Garcia-Argibay paper, Garner and the L4D note as unread search summaries. Its Steam Audio (Apache 2.0) claim is cited to D654:53 and :147 (a room file), and D654:53 does state it; I did not re-open the outside page.
- (d) Nothing marked [read] is from memory: ok. The section 3 room citations (D654 :7-15, :51-58, :119-134; D656; D657; D652:41-43) matched the files where opened (D654 :7-15 and :53; D652 :41-43; D656:144 0.158 ms).
- (e) Coverage of 11, 16, 26, 54, 76, 77, 90, 92, 178: all nine are addressed (section 1 table). None skipped. Claim that item 11's Windows sound is not in code: ok (no MessageBeep or PlaySound in game .cpp/.h).

Totals: 22 checks, 16 ok, 4 WRONG (mixer.cpp:46-47, audio.h:76, model_rig.h:271, design.md:168), 2 could not check (outside sources; no running of tests allowed so red-row numbers taken from the commit message only).
