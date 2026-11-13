# p-l192-footsteps-E: L192, the hunter's footsteps heard coming (his items 16 and 178). Pane E, on L, 2026-11-13, written from 03:23 local (`date`)

**Packet:** the chair's 08:44:21Z order, the 13h run (`exo_memory/loop/plan_13h_run_2026-11-13.md`, 99c916b1), item 2.
**Plan:** `exo_memory/loop/plan_l192_hunter_footsteps_2026-11-13.md`.
**Branch:** `l192-footsteps` at **`5e3b36b`** in worktree `Downloads\dz3-wt-l192-steps` (made by git, links 0), off main
`04f3882`. Pushed to origin as a backup. **Not landed.** The audio side is done and green, but the game side (C's files)
is not wired, and two calls need a ruling (§5, §6).
**Touched:** `audio/audio.h`, `audio/mixer.cpp`, `audio/tests/footstep_tests.cpp` (new), `audio/CMakeLists.txt`,
`audio/README.md`, `audio/CHANGES.md`, `CHANGELOG.md`. Nothing in `game/`. There is no code map in dreamzone-3 (no
`MAP.md`); the pieces table in `audio/README.md` names `mixer.cpp` already, and no file was added.
**Tier:** check it (he judges by ear). The timing logic is invisible, so it also got hand mutants.

## For his ear

- **Listen:** `C:\Users\zackn\Downloads\dz3-l192-review\l192_hunter_footsteps_before_after.mp4`, 50 s, four parts.
  Before and after with you sprinting, then before and after with you standing still. The hunter closes from 28 m
  behind at 9.5 m/s; the game's own bed and its default levels.
- **What changed:** the hunter's footfalls now land with its drawn feet. Each is as loud as the foot's force, with a
  knock a small speaker can play.
- **What did not:** while you sprint, about two in three of its footfalls between 12 and 20 m land on your own steps
  and lose to them (§5). Your ear decides whether that is right.

## 1. What was read, and what each gave

| source | read | what it gave |
|---|---|---|
| `audio/README.md`, `audio/audio.h`, `audio/CHANGES.md` (ours) | whole | the hunter today: a clock of 0.9 + 0.16 v steps a second, a 46/43 Hz thud nearly all under 150 Hz; the distance law (2 m over d) and the straight-line occlusion |
| `audio/synth.h`, `audio/mixer.cpp` (ours) | whole where touched (`condense`, `ChaserVoice`, `adopt_scene`, `render`) | where a scene lands in time: `render` takes the news at the start of each call, while up to 31 frames of an earlier block are still unplayed (`spare_left`), so a phase must be carried on by that many |
| `game/model_rig.cpp` gait_pose, `game/world/stage.cpp:255-282`, `:669-677` (C's, read only) | the parts named | the left thigh swings as the sine of the phase, and the knee bends only while the cosine is over zero. So the left foot lands as the phase passes a quarter turn, and the right at three quarters (**that reading is ours**). The stage advances `hunter_phase_` then calls `sound->update` in the same frame |
| `handback/p-d654-audio-C_2026-11-11.md` (ours) | its summary, §4, §5 | walls and corners (rooms and portals) are its step 2, not built. So L192 uses the mixer's distance and straight-line occlusion unchanged and invents no propagation, as the plan asked |
| Keller et al. 1996, Clin Biomech 11:253-259 (PMID 11415629) | abstract, from NCBI's text (re-read 09:2xZ) | peak vertical force "increased linearly during walking and running from 1.2 BW to approximately 2.5 BW at 6.0 m s(-1), remaining constant during forward lean sprinting at higher speeds" |
| Weyand et al. 2000, J Appl Physiol 89:1991-1999 (PMID 11053354) | abstract, from NCBI's text; the full text gave 403 | across 33 runners at their own top speeds, "this force was 1.26 times greater for a runner with a top speed of 11.1 vs. 6.2 m/s". The force is averaged over the foot's contact, not its peak (§6) |
| Nilsson & Thorstensson 1989 (PMID 2782094); Munro et al. 1987 (PMID 3571295) | abstracts | the running peak rises with speed (2.0 to 2.9 BW over 1.5 to 6 m/s in N&T). It agrees in direction with Keller and differs in level; Keller's line was kept, as the registered curve |
| Moliner, Rämö & Välimäki 2020, DAFx, "Virtual bass system with fuzzy separation of tones and transients", CC BY 3.0 | in full | small speakers play little under about 100-150 Hz, and a low sound is heard through its harmonics. Their kick drum is made audible above a 120 Hz cut-off. **Which harmonics, and how loud, are ours** |
| Left 4 Dead's audio tells | press only (PC Gamer, TechRaptor) | each special infected has its own tell, so players know a threat before seeing it. Valve's own commentary was not found: **press, unverified** |

## 2. What was built (`audio/`)

- **`Source::stride_phase` and `stride_rate`:** the legs as drawn. The hunter sounds one footfall per foot down, at the
  phase's crossings of a quarter and three quarters of a turn.
  - Between scenes the mixer carries the phase on at the rate.
  - When a scene arrives, the phase is moved on by the part of a block already made.
  - A scene that sets the phase back over a footfall just sounded does not sound it again. A footfall is held
    quiet for 40% of a half-stride after it sounds.
  - **With `stride_rate` 0 the voice keeps its step clock.** That is the case for the lesser kinds and for a hunter
    whose legs the game does not send.
- **Force:** each footfall's amplitude goes as `force_bw(speed) / force_bw(8)`. This is Keller to 6 m/s and Weyand
  above, joined; the join is ours. A heavier foot rings lower, by the square root of its force (ours).
- **The knock:** the thud's own 4th, 5th and 6th harmonics, dying over 70 ms, at 0.5 of the thud (`kKnockLevel`,
  ours). It follows the thud's falling pitch, so it lands with it.
- **Each footfall's sine starts from zero.** Before, it started wherever the last one stopped, and 3 in 13 became loud
  more than a tick late (worst 227 samples).

## 3. Tests

The first three rows were registered red first, `b61ce52`, on the unchanged mixer:
- timing: 7 footfalls for 13 contacts, 7 outside a tick;
- level: 3 of 9 cells off;
- heard over the bed: −4.0 dB.

checked: `audio\build.bat` then `audio\build\bin\audio_tests.exe` at `5e3b36b` → **86 tests, 0 failed**.

| row | measured | bar |
|---|---|---|
| one footfall per drawn foot, within a tick after it lands | 13 for 13, worst 161 samples (3.4 ms) | count equal; −1 to 200 samples |
| level against distance (5/10/20 m) and force (4/8/12 m/s) | all nine within **0.15 dB** | 1.5 dB |
| 15 m behind at 9 m/s, above 150 Hz, over the game's bed at 0.5 | **6.5 dB** over | 6 dB (ours) |
| ADDED after green, registered before it ran: a phase set back 0.1 rad every other scene | largest step 0.0207 against 0.0209 straight; 13 and 13 footfalls | under 1.5 times; equal |
| ADDED, the same: the sound clock 10% fast against the game's | 24 footfalls for 24 feet down | equal |

**Hand mutants on `mixer.cpp`, one at a time.** The whole suite ran each time, and the file was restored and checked
against HEAD after each. Result: **applied 8 / caught 7 / NOT APPLIED 0**.
- Command: `bash Downloads\dz3-l192-review\tools\mut.sh` (its paths name this session's scratchpad; edit `SP`).
- Caught:
  - foot a quarter early → timing, set-back and clock rows;
  - no force → level;
  - no knock → heard over the bed;
  - no hold after a footfall → set-back;
  - phase taken only from the first scene → timing and clock;
  - step clock used even with legs → timing and clock;
  - sine not started from zero → timing.
- **Survivor, registered before the run:** not carrying the phase on by the part of a block already made leaves a
  footfall at most 31 samples (0.65 ms) late, inside the one-tick bar. Left uncovered: no row asks for less than a
  tick.
- These ran without the heavy-run lock, which A's sweep holds. Each was one small library at BelowNormal behind the
  memwatch gate, and none ran while a timing session held the lock.

**Measures that moved** (README updated):
- The hunter alone at 2 m is −21.0 dB (was −21.3).
- The 5 ms onset meter counts 2.8 starts a second for its 1.9 steps (was 1.9). This is the meter, not a new sound. It
  re-counts the thud's 48 Hz tail 90-110 ms after about half the footfalls: 22 starts for 15 footfalls over 8 s, by a
  temporary diagnostic that was removed before the commit. `tests/audio_test_util.h:129-131` already warns about this.
  The existing row (`< 3.0`) passes. A first attempt to change the knock's phases made it 3.0 and was reverted.

## 4. The clip and how it was made

An offline render through the mixer, built twice: against main `04f3882`'s audio sources (before) and against this
branch (after). It uses the game's bed (`Downloads\dreamzone-rt\ambience1.wav`) at `bed_volume` 0.5 and `sound_volume`
0.8 (`game/world/world_settings.h:51-52`).
- **The run:** you sprint at 7 m/s with your own feet heard, or stand still. The hunter closes from 28 m at 9.5 m/s.
- **Its legs:** 2.15 strides a second. inferred: about L181's 4.4 steps a second at 9.9 m/s, rounded; the game's
  `gait_phase_per_metre` was not called.
- **The picture:** a scrolling spectrogram (20 Hz to 2 kHz) so his eye can find the knock. The tall even streaks are
  your own steps.
- **Rebuild:** `Downloads\dz3-l192-review\tools\clipbuild.bat` (vcvars, cl; `old\audio\` holds 04f3882's sources),
  then `clip_old.exe <bed> before.wav` and `clip_new.exe <bed> after.wav`, with the third argument `still`, `nohunter`
  or `notone` for the other renders. The WAVs are in `wav\`.
- The title says `9c32bee`. `5e3b36b` changed only comments and docs, so the sound is the same.

## 5. Needs his ear: the player's own feet mask the hunter in the same band

The registered "heard over the bed" row put the hunter against the bed alone. The clip puts him sprinting, and his own
steps are the loud thing above 150 Hz. They are about −29 dB in 150-600 Hz, against the bed's −43 above 150 Hz, and
they sit in the band the knock uses.

checked: `cd Downloads\dz3-l192-review\wav && node ..\tools\glimpse2.js`. It measures each hunter footfall at the
instant its foot comes down: the hunter (the mix minus the bit-identical mix with no hunter, tone off) against
everything else in the same 60 ms, 150-600 Hz.

| hunter behind | footfalls | at or over everything else | median |
|---|---|---|---|
| 20-28 m | 14 | 8 | +3.0 dB |
| 12-20 m | 14 | 5 | −0.2 dB |
| 6-12 m | 10 | 7 | +7.5 dB |
| 2-6 m | 9 | 8 | +16.9 dB |

- **Against before:** checked by `node ..\tools\masking.js`, in half-second windows above 150 Hz. The new hunter is
  4-10 dB louder than the old across the whole approach (at 15 m, −40.2 against −44.8 dB).
- The footfalls that are heard land in the gaps between your steps. The rest land on them and lose.
- **Options, his call:**
  - **(a)** keep it. A footfall heard about every half second may be the right tension;
  - **(b)** make your own feet quieter while sprinting. A common game choice, but it changes your sound, which is
    not this lane's;
  - **(c)** move the knock up, out of your feet's band. It becomes more audible and less like thunder;
  - **(d)** raise the hunter, either `kKnockLevel` or the kind's level. That makes it louder up close too. The
    loudest-moment row has headroom today (peak 0.808 under 0.88).
- inferred: (b) or (c) would clear most of the masking; neither was rendered.

## 6. Needs a ruling: the force curve above 6 m/s

Keller (within its runners, peak force) says the force plateaus above 6 m/s. Weyand's 1.26 is across 33 different
runners at their own top speeds, using force averaged over contact. Reading Weyand as one hunter speeding up is a
choice, not a citation.
- It is the choice the plan pointed to, and the registered level row holds it.
- Keller's plateau would make the hunter at 12 m/s **2.33 dB quieter**. checked: `2.5·(1+0.26·5.8/4.9)/2.5` →
  1.3078 → 2.33 dB.
- **Not changed.** Changing it means amending a registered row, which needs the rule changed by name. The comments,
  README and CHANGES now say it plainly (`5e3b36b`).

## 7. The game side: C's files, asked on the board, not touched

The stage advances `hunter_phase_` in `place_figures` (`stage.cpp:269`) and then calls `sound->update` (`:675-677`).
The wiring is about ten lines:
- the stage hands the first hunter's phase and its rate (`p.speed * gait_phase_per_metre(hunter_.rest, p.speed)`) to
  `WorldSound` before `update`;
- `sound.cpp:162-171` sets `src.stride_phase` and `stride_rate` on that hunter's `Source`.

With no hunter model, or in the offscreen and selftest paths, the rate stays 0 and the clock is used. Until it lands,
the game's hunter keeps its clock, now with the knock and the force curve.

## 8. Corrections

- `e5988d1`'s message says "within 0.16 dB". The final build measures 0.15 dB at worst; corrected in `9c32bee`'s
  message and the docs.
- My first diagnosis of the 2.8 starts (the knock's phases adding into one pulse) was wrong. Spreading them made it
  3.0. The cause, measured, is the thud's tail.
- My first footfall-by-footfall table counted 65 "footfalls" in 11 s: the detector was catching the hunter's tone.
  It was redone at the known instants, with the tone off.
- An `audio_tests` log was written one level up, into `Downloads\`, by a wrong relative path. It was moved to the
  scratchpad at once.

## 9. Not done

- The game wiring (§7), his ear on the clip (§5), and the ruling (§6). Then the landing, with the replay fingerprints
  checked on base and merge. Sound is outside the simulation, so they should not move.
- **L185:** the head-row proof (`scratchpad/l185/mut5.sh`) has waited on the heavy-run lock since about 08:50Z. A's
  arms take it back to back. L185 1+2 land when the proof shows the row green on clean and red on the survivor.

## 10. After the rulings (plan tail, 5db62002), written from 03:3x local (`date`)

**§6 done: Keller's plateau.** `l192-footsteps` **`9eca8db`**: the force rises to 2.5 BW at 6 m/s and stays there.
The level row's curve is amended by name with the ruling's reason; its cells and bar are unchanged.
checked: `audio_tests.exe` at 9eca8db → **86 tests, 0 failed**; level within 0.23 dB; 6.2 dB over the bed; timing
worst 164 samples.

**Two existing rows amended by name, for the reviewer:** `the_five_kinds_can_be_told_apart_by_measure` and
`each_kind_sounds_as_it_is_described` (`audio/tests/voice_tests.cpp`).
- **What failed:** with the plateau they went red. The hunter at 6 m/s read **3.2 starts a second for its 1.9
  footfalls** on the 5 ms meter (bar: under 3).
- **What causes it, measured with each change switched off:** the knock taken out gives 2.1; the sine not started from
  zero gives 2.9. The knock's three harmonics, a fundamental apart, beat at the thud's pitch (about 46 Hz) whatever
  their phases. That beat is how a low pitch reaches a small speaker, and the ear hears it as pitch, not as steps.
- **The amendment:** both rows now read the hunter's starts over 25 ms, as `tests/audio_test_util.h:129-131` advises
  for a low thud and the step-rate row already did. Their rules and bars are unchanged, and the hunter reads 1.9.
- **Correction of §3:** the extra starts come mostly from the knock, not the thud's tail.

**§5 done: two variants, rendered offline only (never committed), beside the build, sprinting.**
- **Listen:** `C:\Users\zackn\Downloads\dz3-l192-review\l192_three_ways_sprinting.mp4`, 38 s. A is as built, B is the
  threat duck (e), C is the knock above his feet (c).
- **His steps' spectrum, measured** (`node tools\bands.js` on the no-hunter render; his steps plus the bed):
  75-150 Hz −29.4, 150-300 −30.9, 300-600 −37.0, 600-1200 −39.1, 1200-2400 −39.5 dB.
- **(c)** moves the knock to the thud's 15th to 17th harmonics, about 690 to 780 Hz at rest pitch: three harmonics a
  fundamental apart, so it still beats at the low pitch.
- **(e)** dips his steps as each hunter footfall's knock sounds. It reaches 0.8 off (about −14 dB) from 15 m in, eased
  over 4 ms. Depth, range and ease are ours. A first setting (0.7 off, full only at 5 m) moved nothing, and this one,
  the strongest tried, barely did. Overwatch's importance mix (Lawlor and Neumann, GDC 2016, "Play by Sound") is the
  source, via a PC Gamer report of the talk, which is video.

checked: `cd Downloads\dz3-l192-review\wav\var && node ..\..\tools\var\glimpse3.js`. Each hunter footfall at its
landing, against everything else sounding in the same 60 ms. Shown as footfalls at or over / footfalls, with the median
in dB:

| band | variant | 20-28 m | 12-20 m | 6-12 m | 2-6 m |
|---|---|---|---|---|---|
| 600-1200 Hz | A as built | 8/14 (+3.8) | 7/14 (+0.1) | 7/10 (+8.0) | 8/9 (+14.4) |
| 600-1200 Hz | B duck (e) | 8/14 (+3.8) | 7/14 (+0.8) | 7/10 (+8.0) | 9/9 (+14.4) |
| 600-1200 Hz | **C knock up (c)** | **9/14 (+10.9)** | **10/14 (+6.4)** | 7/10 (+15.1) | 9/9 (+20.6) |
| 150-600 Hz | A as built | 8/14 (+2.5) | 5/14 (−0.7) | 7/10 (+7.2) | 8/9 (+16.7) |
| 150-600 Hz | C knock up (c) | 4/14 (−3.5) | 3/14 (−6.6) | 6/10 (+1.6) | 7/9 (+10.8) |

- **Reading it:** a sound is heard where it clears its masker in some band. That reading is inferred, the usual
  critical-band account, and is not checked by a listening test.
  - **(c)** clears his steps in 600-1200 Hz for 10 of 14 footfalls at 12-20 m, against 7 for A.
  - **(e), as ruled,** barely moves anything. The steps that mask a footfall are his own, already sounding when the
    hunter's foot lands, and a duck that starts at the landing comes after their loud start.
- inferred: a duck that starts just *before* each footfall would do better, since the mixer knows the phase. It is not
  ruled, so it was not built.
- **(c) costs** some of the "thunder": the knock is a higher thock over the same low thud. His ear decides.

**Not changed:** the wiring still waits on C. L185's proof still waits on the lock.

## Rebased onto main c9d520e (06:5x local), still UNBUILT

- `l192-footsteps` was rebased onto c9d520e and pushed (checked: `git ls-remote origin l192-footsteps` → d8f77ba). The
  new shas:
  - 302fa4e, the red registration;
  - 1ac88d8, WIP green;
  - f898d5f, the edge rows;
  - 97d9eef, Keller and Weyand;
  - 2c96889, the Keller plateau;
  - d8f77ba, the game's wiring.
- **One conflict, in CHANGELOG.md:** main's L194 train entry and mine landed in the same place. Both were kept, main's
  first.
- **The wiring (d8f77ba) is still unbuilt.** `game/world/stage.cpp` and `sound.cpp` compile only into `dz-world`, and no
  test program includes them. Proving it compiles means a fresh full build in this worktree. I did not take a lock slot
  for that while A had three jobs queued, because the wiring is not needed until he picks the hunter's voice. It builds
  before the voice lands, and the train builds `dz-world` in its check.
