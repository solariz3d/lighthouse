# Hand-back, pane E (machine D): D402 part 1, the SIGIL audition (a fifth melody)

Packet: the chair's D402 part 1 (sent 2026-10-19T03:33:27Z). The brief is at `exo_memory/loop/plan_t180_handoff_2026-10-15.md:2723-2738`.
- No repo change: nothing in the builder, and nothing committed or pushed.
- Work folder `G:\Consonance-tools\b9\`.

## 0. The three, one line each

The clips are in **`G:\Consonance-tools\b9\sigil13\`**: `sigil-1.wav`/`.mp3`, `sigil-2.wav`/`.mp3` and `sigil-3.wav`/`.mp3`. Each is 18.8 s: 16 places 0.7 s apart, then 4 undos 0.55 s apart, then the tail.

- **sigil-1, Obsidian:** D minor with the dark Phrygian Eb. One four-note figure (A A D C) repeats while the chords move under it, climbs in phrases 6–7 and comes home. On **PL Phantoms [SD]**.
- **sigil-2, Vigil:** C minor. Long tones held four places each, a slow line falling by step with one leap a phrase, and the Phrygian Db at the peak; the sparsest of the three. On **SY Augustines Bell Chapel [JL]**.
- **sigil-3, Lattice:** A minor with the Phrygian Bb. A three-note cell (E A C) cycles over two-step chords, three against two, so it lands on each chord differently. It lifts in phrases 5–7 and comes home on A. On **LD Noor Santoor [BR]**.

checked: `sha256sum` in `sigil13\`:
- sigil-1.wav `3f75f27a…`, sigil-2.wav `f1a1e838…`, sigil-3.wav `2390b338…`;
- MP3s 301,869 B each (128 kb/s): `bad0ecf1…`, `c833a5ae…`, `bb3d4e61…`.

## 1. The melodies (`mel13.js`, sha256 `5ddb9ac16a7fd2aa…`)

- **The format:** 64 steps each, in the builder's shape `[bass, chord of four, melody note]`, two steps a chord. The voicing is mel12.js's (with its rub fix), at a lower register.
- **Sparse, honestly:** the step format has no rest. Every place strikes a chord and a note, so "sparse" here means few pitches, held notes and a narrow range. checked: `node mel13.js`:
  - Obsidian: 8 distinct melody pitches, MIDI 69–81, 18 of 63 steps repeat the last note;
  - Vigil: 10 pitches, 67–82, 40 of 63 repeat;
  - Lattice: 7 pitches, 69–81, 0 repeat (it cycles).
  - For comparison, the four that ship run up to 88.
- **The checks,** all three: every melody note in its chord's scale, 0 rubs, 0 voices at or over the melody, and each ends on its tonic. A chord-by-chord map is in `arcmaps13.txt`.
- **My first pass failed two checks, fixed before any render:**
  - 4 melody notes (D over Bb sus7) were outside their chord's scale. Those chords are now Bb add9.
  - There were 27 rubs, because I had left out mel12.js's rub fix. It's restored.

## 2. The origin check (`node origin_check13.js`)

- **What it checks:** each cell (the figure it's built on), and each whole 64-step melody round the loop, as intervals, against:
  - the four that ship (app/sound.js at v0.4.6);
  - batches 7, 4, 9, 11 and 12, the tick walk, and the other two candidates;
  - one known dark theme, the Dies irae's opening, written from memory (not checked against a score).
- **The cells:** none occurs whole anywhere. The nearest share 2 of 3 intervals (Obsidian), 2 of 7 (Vigil) and 1 of 2 (Lattice).
- **The whole melodies:** the longest shared run that moves (runs made only of repeated notes don't count) is 4 intervals for Obsidian (with Aqua as shipped), 3 for Vigil (Skyline) and 3 for Lattice (batch 12's Meadow). Against the Dies irae it's 1 of 7 for each.
- **What it doesn't show:** no outside melody database was searched. "Not a copy of any known piece" rests on construction and this check.

## 3. The instruments (Serum factory presets; the licence is settled, plan :1588)

- **Rendered offline:** 16 dark candidates (`cands13.json`) through `render_inst.py`, batch 10's route: the preset's chunk into the VST3 state, place at velocity 100 and undo at 58 on MIDI 60.
  - checked: `run13a.out` ends "OK no visible window".
- **The screen** (`inst13_screen/bands.json`, each on Obsidian, through the engine): on peak against loudness, Mallety (21.1 dB over four places) can't reach the bands.
  - By character I set aside the ones the listener read as horns or buzzes (Monolith, Metachord, Downed, Sickly keys, Techarm, Pluto).
  - Two were kept per melody: Phantoms and gamelan tweak; Bell Chapel and Totem; Santoor and Moriccone.
- **Levelled twice through the engine** (`run13b.sh` → `b13_final/`), as batch 12 was: place to −28.3 LUFS, undo to −30.4.
- **The picks, and the trim:** one per melody by fit. Two needed a trim:
  - Bell Chapel's loudest single places sat 0.1–0.3 dB over the one-place band's −26, so its place file is −0.6 dB;
  - Santoor's step 35 sat at −25.9, so −0.5 dB.
  - `trim13.js` → `b13_pick/`.
- **The three set aside also passed every check** (`b13_final/bands.json`), if he wants another voice for one: gamelan tweak for Obsidian, Totem for Vigil, Moriccone for Lattice.

## 4. Inside the bands (`b13_pick/bands.json`)

- **The engine:** the one that ships, `sound_63515d0.js` (`git show 63515d0:app/sound.js`, equal to v0.4.7's: `git diff --stat 63515d0 v0.4.7` lists no app/sound.js).
  - Each candidate is swapped in as the fourth melody by swap12.js's `swapSource`, the data only. checked: the swapped engine loads; the kept three are equal to the shipped steps and the candidate to `mel13.js`.
  - Rendered through t180-wt-e21's soundrender with `createEngine(ctx, { melody })`.
    - e21 moved to v0.4.7 at the D399 rebase (~03:44Z), between stage 1 (from 03:43Z) and stage 2 (03:46Z). So the levelled and final renders ran on v0.4.7's soundrender, and the screen ran on 0.4.6's or 0.4.7's.
    - checked: `git diff --stat 63515d0 v0.4.7` changes `app/test/soundrender.js` (D400, +50 −10), not `app/sound.js` or `sound-bands.test.js`.
    - inferred: D400 changed only how the Chrome is started and attached to, not the audio, so the figures don't depend on which.
- **The checks are sound-bands.test.js's, rebuilt in `render13.js`:**

| | one place (−30.5…−26, pk ≤ −6) | four (−27…−22.5, ≤ −5) | four undos (−33…−28, ≤ −12) | swell: phrases 6–7 over 1 and 8 (≥ 0.7 LU) | each of the 64 places alone |
|---|---|---|---|---|---|
| sigil-1 Phantoms | −28.3 / −8.9 | −24.8 / −7.8 | −30.4 / −13.2 | 1.2 | all inside (−28.5…−26.1, pk −7.4) |
| sigil-2 Bell Chapel | −28.9 / −10.8 | −25.6 / −9.6 | −30.4 / −14.2 | 1.4 | all inside (−28.9…−26.3, pk −6.6) |
| sigil-3 Santoor | −28.8 / −10.8 | −24.9 / −10.5 | −30.4 / −16.1 | 1.2 | all inside (−28.8…−26.4, pk −8.9) |

- **The tightest margin:** Phantoms' loudest single place, at −26.1 against −26. At the build its two files go in as levelled here. If sound-bands reads it 0.1 dB louder, a 0.3 dB trim of its place file has room (its first place would be −28.6).
- **The files for part 3:** `sigil13\samples\place_sigilN.wav` and `undo_sigilN.wav` (16-bit stereo 48 kHz, MIDI 60, 3.2 s each). The engine's place and undo gains (0.645, 0.596) apply unchanged.
  - Their sha256: place_sigil1 `35fe0fe5…`, undo_sigil1 `8070c7e6…`, place_sigil2 `267e2f71…`, undo_sigil2 `dac91549…`, place_sigil3 `2487de95…`, undo_sigil3 `4de6df3b…`.

## 5. Not measured

- Whether any of them is "hypnotic" or reads as SIGIL. The listener's labels for single notes are unreliable (it called Monolith a car horn), and it wasn't run on the clips. That's for his ear.

## 6. Corrections, mine

- §1's two failed checks (4 notes out of scale, 27 rubs), fixed before any render.
- My first draft of §4 said the soundrender I used was equal to 0.4.6's. It changed in 0.4.7 (D400); §4 now says which ran where.
- I told the chair stage 1 was queued behind C's run. The lock has two slots, one per tree, and it ran at once.

## 7. The lock

- Three holds for D402, none during B's suite:
  - stage 1 (`run13a.sh`, from 03:43:15Z);
  - stage 2 (`run13b.sh`, from 03:46:49Z);
  - the picks' final (`render13.js b13_pick … --final`).
- checked, at the times: slot 1 held "t180 B D396 full suite" at ~03:35Z; by 03:43Z it held C's D401 run (started 03:43:07Z). So B's suite had released the lock before stage 1 took slot 2.
- The D399 holds are in that hand-back.
- Chrome and Serum were headless throughout.

## Left on disk (`G:\Consonance-tools\b9\`)

- **The source:** `mel13.js`, `origin_check13.js`, `render13.js`, `trim13.js`, `cands13.json`, `run13a.sh`, `run13b.sh`, `spec13_*.json`, `sound_63515d0.js`.
- **The renders:** `inst13_raw/`, `inst13_screen/`, `inst13_eng1-2/`, `inst13_lvl1-2/`, `inst13_pick/`, `b13_final/`, `b13_pick/` and `arcmaps13.txt`.
- **The deliverables:** `sigil13/`.

NEXT: librarian, send the keeper `sigil13\sigil-1.mp3`, `sigil-2.mp3` and `sigil-3.mp3` for his pick, when this pointer arrives. After his pick, part 3 takes that melody's STEPS from `mel13.js` and its two files from `sigil13\samples\`.
