# Brief: Dreamride, the songs he marks (from 2026-11-11, L)

Dreamride's repo is public. His words stay here and never go into that repo (the Third Place's 11-10 entry records that 29 files had to be cleaned once).
The repo on L is `C:\Users\zackn\Downloads\dreamride`. Read its `HANDOFF.md` first: the 11-06 update, then the 11-05 plan.

## His words (verbatim, newest last)

- 2026-11-11 01:4x, with a picture of the saved file `stream_s971140_1-4`: "lets work on dreamride right now, i have a whole bunch of seeds saved as good and bad to look through, the last seed, there was something real and good going on there, but the melodies seemed to get too muddy overtime, as well, [picture] this seed is very good and I like the main structure of the song, but sometime during it, it pitches down a little bit and ruins the coherent feel of the pitch, if you look through that seed you will see towards the end where i rated the segment bad"

- 2026-11-11 01:4x, after L160 went out: "i like the sounds as it is, but I wonder if we could somehow use different instrumentation, say, through our omnisphere 3, since the program wont be given to others, we can use the omnisphere 3 sounds"
  - This part-answers the handoff's open "writing or sound?" question (11-05 §1): he likes the sound as it is, and wants
    other instruments as an option.
  - Checked on L: `C:\Program Files\Common Files\VST3\Omnisphere.vst3` (dated 2026-05-23), and the VST2
    `C:\Program Files\Steinberg\VSTPlugins\Omnisphere.dll`.

- 01:4x, asked whether the chosen sounds could ship without the Omnisphere install: "but do you think it would be possible to make it so once we find the right mix and amount of instrumentation, that we could package it with dreamride without needing the heavy omnisphere installation?"
- 01:52, after the librarian raised Spectrasonics' license on resampling: "but just think, what is the difference between me in a daw manually choosing and sequencing shit, and then building a system that then does it for me through procedural music? It is bullshit to be honest. I paid for it legit, an arm and a leg for a fkn VST, we are going to use it how we want, they are lucky didnt torrent that shit for free"
  - **His call, taken as the go:** host Omnisphere (VST3 SDK, MIT), and print the chosen patches into a local sample set.
  - **The one line kept:** the printed samples stay out of the public dreamride repo (gitignored, his machines only).

## Tonight's marks (01:27 to 01:40 local, from the app; checked with `ls -t`)

- Good (in `examples\`): 539681 at stages 1–3; 963135 at 4–7; 971140 at 1–2, 1–4 and 2–5; 70372 at 5–8.
- Bad (in `judged\bad\`): 177718 at 1–2; **971140 at 4–7**; 602156 at 2–5; 580630 at 1–2; 50473 at 1–3; 628810 at 1–1; 70372 at 1–4.
- These count toward hypothesis M (judgments after 2026-11-06 03:28; it needs at least 6 new good and 6 new bad songs). Seven bad songs and four good ones so far, so two more good songs are needed before it can be scored.
- "The last seed" is 70372 (lens species, saved last at 01:40). Where it turns muddy is **not yet known**: he marked stages 1–4 bad and 5–8 good.

## Seed 971140: the pitch drop, found (checked from the saved files)

- He saved 2–5 as good and marked 4–7 bad, so the change is at stage 6 or 7.
- Stage 7 is "a new progression, automaton/prog.picardy". In `src/compose/harmony.txt:59` picardy is a **minor** progression ("mood dark falling").
- Installing it changes the scale setting `c` from 5 to 2 (`judged\bad\stream_s971140_4-7.txt:87` and `:107`). The key stays at `K = -4`.
- In `h(d) = K + floor((12d + c) / 7)`:
  - c = 5 gives the scale 0 2 4 5 7 9 11, major;
  - c = 2 gives 0 2 3 5 7 8 10, natural minor.
- So **the song changes from major to its parallel minor**: the 3rd, 6th and 7th each drop a semitone.
- **Cause in code:**
  - A harmony module writes `c = mode.lens()` (`src/compose/harmony.rs:476`).
  - The stream's progression pick (`src/compose/stream.rs:1363`, `book::pick`) filters by energy, density and the avoid list, never by mode.
  - The stream also has a deliberate `Mode` move that turns the lens by two or three modes (`stream.rs:1058`; it is offered at the Strip and Turn roles, `:1482`, `:1487`).
- **Hypothesis M cannot see this:** pitch classes per stage (`stagepcs`) read 7 7 6 6 over 4–7 and 6 7 7 7 over 2–5. The count stays the same, but which pitch classes are used changes.

## State

- 2026-11-11 01:5x: found and planned (`loop/plan_l160_dreamride_keeps_its_mode_2026-11-11.md`). Nothing is built yet.
