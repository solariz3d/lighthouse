# L199 into the game: the hunter's footfall is F3c (pane E, machine D, 2026-11-13)

Packet: the chair, 14:47Z ("1. The stomp's SECOND PASS, for his ear ... 2. Then the voice, into audio/ on the
l192-footsteps branch"). Tier: check it. Base: dreamzone-3 `origin/main` 31d1c6d.

## 1. The second pass already has his answer

Item 192 (07:28): "recorded heavy hits, three to a step, is almost perfect, good for now". That is F3c in
`p-l199-voices-E_2026-11-13.md` section 8b. So step 1 needed no new offline pass, and step 2 is what this lap built.
The sound side of the stomp is now the game's. The legs' side (item 195, "up down up down") is C's:
`p-l205-stomp-C_2026-11-13.md` finds the cause in the pelvis depth, not in where the foot lands. **The two meet at one
point only:** the mixer sounds a footfall as the stride phase passes a quarter and three quarters of a turn
(`audio/mixer.cpp` `foot_down`). If C's refit of the legs past 4.5 m/s moves foot contact within the stride, the
footfall must move with it. Footfall row 1 and its kit twin (`his_kit_sounds_one_footfall_for_each_drawn_foot_within_a_tick`)
guard the audio side only.

## 2. What is built (dreamzone-3, branch `l192-footsteps`, NOT pushed)

Local clone `C:\Users\nname\Desktop\worktrees\dz3-e-voice`. L192's six commits rebased cleanly onto 31d1c6d, so their
shas differ from `origin/l192-footsteps` d8f77ba. Then two of mine on top:

- `6825d6b`: rows 5-12 registered red (`audio/tests/footstep_tests.cpp` header), with `load_footfall` a stub that refuses.
- `1bdad00`: the kit and its loader, the voice, the game wiring, the kit files, the two offline tools, CREDITS,
  CHANGELOG and the audio README.

checked: `git -C C:/Users/nname/Desktop/worktrees/dz3-e-voice log --oneline 31d1c6d..HEAD` → 8 commits, tip 1bdad00

**What plays.** `audio::Mixer::load_footfall(boom, takes)` loads the kit. With a kit loaded, each hunter footfall is:

- three takes, taken in turn, at 0, 45 and 105 ms after the foot comes down;
- at 1, 0.55 and 0.15 of the level, each varied by up to ±1 semitone and ±1.5 dB, using F3c's own LCG (seed 0x2545F491);
- over the boom, read at rate hz/46;
- with the boom at level 0.72 and the takes at 2.4, all times the footfall's force;
- silent for 20 ms before each foot, with a 2 ms fade.

Every number is F3c's, carried over unchanged. A refused kit changes nothing, and with no kit the thud and knock play as
before. `WorldSound` finds `content/audio/footfall` (`find_footfall`, as `find_bed`) and loads it.

**The boom is a sample.** Plaits' 808 and overdrive ran once, offline, to `hunter_boom.wav`. No Plaits code is in the
game, so no new dependency. Two differences from F3c follow, named and not measured against his ear:

- The boom is read faster or slower for each foot's pitch, where F3c retuned the drum, so a lower foot also rings a
  little longer.
- A new footfall starts a second boom while the last rings out, where the drum would have been struck again.

**Other differences from the offline render:**

- The takes are resampled 44.1 → 48 kHz by `wav.cpp`, a loop resampler, so each file's end wraps into its start. The
  last 10 ms of each take sits 61 to 67 dB under its peak. F3c's takes were resampled by ffmpeg.
- **One deliberate change, by the timing row:** see section 3.

## 3. The red that changed the files (row 12a), and the one change from what he heard

Row 12a is row 1's bar with his kit loaded: each footfall's loud point within one tick of its foot. With the takes
as recorded, it was red: `13 footfalls for 13 foot contacts; 13 outside a tick after their contact (worst 1229 samples)`.

The cause is in the recordings: each waits before its hit.

checked: node read of `content/audio/footfall/*.wav` (untrimmed) → first sample past a tenth of the peak at 23.3, 19.2,
16.5, 17.0 and 19.2 ms (decoded at 44.1 kHz); the boom's at 0.0 ms

So the hit sounded about 20 ms after the drawn foot landed, in F3c as he heard it too. I fixed the files, not the row:
`oggmono --trim` starts each take 1 ms before its first sample past a tenth of its peak, faded in over that 1 ms. The
takes now start at 22.34, 18.16, 15.46, 16.01 and 18.23 ms into the recordings. After the trim, row 12a passes:
worst 116 samples. **This is his ear's call.** Going back is one flag (decode without `--trim`), and clips B and C below
are the pair to judge.

## 4. The checks

checked: `build\bin\audio_tests.exe` (full build) → `96 tests, 0 failed` (86 before, plus rows 5-12 as 10 tests)
checked: rows 5-12 against the stub at 6825d6b → `kit`: 9 tests, 9 failed; `stereo`: 1 failed
checked: `build.bat` under heavy-run ("E L199 voice: build dz3-e-voice") → `[369/369] Linking CXX executable bin\dz-world.exe`, exit 0
checked: `dz-world --config game/config --capture-run <scratch>` under heavy-run → `sound: bed: ambience1.wav; footfall kit; no device asked for`

The full build is the first build of L192's game wiring (`57f442a`, marked UNBUILT): it compiles.

What the rows printed:

- **Row 5, three hits:** 45.00 and 105.00 ms after the first, every footfall. Levels −3.5 to −6.0 dB and −14.7 to
  −17.9 dB, against registered −5.2 and −16.5 (±3.2). First hit 66 to 67 samples after the foot.
- **Row 6, in turn:** `010 101 010 101 010`, as registered.
- **Row 7, varied, the same every time:** identical sample for sample across two mixers. Level spread 1.62 dB; pitch
  940 to 980 Hz, inside 925 to 1080.7.
- **Row 8, the gap:** 208.9 to 212.5 dB under, against a bar of 30. The window is exactly zero, so the figure is the
  floor of `db()`.
- **Row 9, the boom's pitch:** 428.6/460.7 Hz against 430/460 at 8 m/s, and 489.3/521.4 against 490.4/524.6 at
  4 m/s (within 1.5 %).
- **Row 10, refusal:** 4 of 4 cases refused with a reason and sounding exactly as before:
  - a missing take;
  - a missing boom;
  - no takes;
  - a take over 2 s.
- **Row 11, stereo:** largest difference 0.00e+00.
- **Row 12, his kit against rows 1-3:**
  - row 1 (one footfall per foot, within a tick): 13 for 13, worst 116 samples;
  - row 2 (level follows distance and force): all 9 cells within 1.5 dB, the worst −2.14 against −2.28;
  - row 3 (heard over the bed): margin 10.9 dB against a bar of 6. The thud's was 6.2 dB.

Not run, by tier: mutation harnesses and the self-test.

inferred: the self-test would not reach the kit, because its configuration folder is a temp folder; find_footfall then
returns empty and the thud plays.

## 5. For his ear (rendered to files, never played here)

`C:\Users\nname\Desktop\worktrees\clips_L199\` (outside any repo). Each clip is 9 s: the hunter 6 m ahead at 7 m/s,
then 15 m behind at 9 m/s, over the bed at the game's level. Rendered by the game's own mixer (scratch `clip.cpp`).

| clip | sha256 (first 16) |
|---|---|
| `L199_hunter_A_thud.wav`, the voice before | 13c09f8e8d4ae71f |
| `L199_hunter_B_F3c_as_heard.wav`, takes untrimmed, as he approved | b290804033eaacb2 |
| `L199_hunter_C_F3c_trimmed_shipped.wav`, what the branch ships | 26d3088ce5f1a21c |

## 6. Files and provenance

- `content/audio/footfall/`, 546 KB of WAV in plain git; LFS covers only `.glb`. Its README holds:
  - the Kenney archive's sha256 and licence lines (Impact Sounds 1.0, CC0, read 2026-11-13);
  - every source's and file's sha256;
  - how to make them again.
- `tools/footfall_kit/bake_boom.cpp` (Plaits from `l199-offline-tools` 92be868) and `oggmono.cpp` (stb_vorbis v1.24).
- CREDITS.md "Sounds": Kenney, Plaits and stb_vorbis (the last two offline only).

## 7. WHERE IT STOPS

- **To land:** a landing pane fetches `l192-footsteps` from `C:\Users\nname\Desktop\worktrees\dz3-e-voice` (no push, per
  the packet). Its shas are rebased, so the branch on origin (d8f77ba) is stale.
- **Before landing, from L192, still owed:**
  - a row that the stage sends the legs' phase and rate;
  - the replay-fingerprint guard on his kept runs (sound is outside the simulation).
- **His ear:** clips B and C (the trim). If he says untrimmed, re-run `oggmono` without `--trim`. Row 12a then goes red
  as in section 3, and its bar would need his ruling.
- **Next by the handoff, when packeted:** item 193, the player's own footsteps by the same method.
- The bed for the over-the-bed rows was copied (not linked) to `C:\Users\nname\Desktop\worktrees\dreamzone-rt\`, outside any repo.

## STOP at the chair's HOLD (sent 14:53Z, delivered to this pane 15:12Z, after this hand-back was rung)

The hold carries his 08:51 word (`exo_memory/briefs/lighthouse_the_room.md:88`): "before we continue anymore dreamzone
work, lets dedicate ourselves for a bit to using our enhanced reasoning on xhigh fable to gain better awareness".

**The order of events, plainly.** The hold was sent at 14:53Z, six minutes after the packet. It reached this pane at
15:12Z, held 1151 s while I worked. By then the step the hold says waits, the voice, was already built and committed
(`6825d6b`, `1bdad00`), and this hand-back had been rung. I did not start anything after the hold arrived.

- **Branch:** `l192-footsteps` in `C:\Users\nname\Desktop\worktrees\dz3-e-voice`, tip `1bdad00`, on 31d1c6d.
  Working tree clean. Nothing pushed, nothing landed.
- **Done:**
  - the second pass (his item 192, F3c);
  - the voice in `audio/`, red first, green (96 tests, 0 failed);
  - the game wiring, built 369/369.
- **Open:**
  - his ear on clips B and C (the trim, section 3);
  - L192's two owed items before landing (section 7);
  - a landing pane.
- **Next step, when he lifts the hold:** his ear on B and C. If the hold means the voice should not have been built yet,
  the branch can simply wait: it is local and unlanded, and nothing is reverted unless he says so.

## Corrections

- My first assumption, that his kit would meet row 1 unchanged, was wrong: red, 13 of 13, section 3.
- I ran the full audio suite twice by mistake: the second call meant to list only failures re-ran it. Same result.
