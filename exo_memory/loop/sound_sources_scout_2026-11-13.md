# Sound sources scout: what could stand behind the mixer instead of hand-written synthesis (2026-11-13)

Worker for the librarian seat. Read-only research. Game repo read at main `04f3882` (git log -1). Marks: [read] opened and read; [code] file:line in the game repo; [inferred] reasoning; [ours] proposal. Licence lines are as the project's own file or page states them, fetched 2026-11-13. Not legal advice.

His words: item 16 "bassy and loud like thundering almost"; item 181 "we shouldnt implement our own sounds from scratch, we could use an open source, high quality synth or something beyond your native sound capabilities".

## 1. What our audio module does today

- Everything is made in code; only the bed is a file. [code] audio/audio.h:11-12 and audio/README.md ("The repository holds no sound files").
- The mixer renders 32-frame blocks, 48 kHz stereo float, no allocation or file access inside `render`. [code] audio/audio.h:143-162, audio/synth.h (`kBlock = 32`).
- Output is XAudio2: a thread renders 480 frames (10 ms) at a time, four buffers queued. [code] audio/device.cpp:31.
- Chasers: five voice kinds (`Hunter, Sprinter, Interceptor, Pack, Crawler`), up to 16 voiced, 24 slots. [code] audio/audio.h Voice enum, audio/mixer.cpp:46-47. Per-kind range, level and step rate sit in `kKindSpecs`. [code] audio/mixer.cpp:58-64.
- Each kind is a step clock plus a small instrument: `ChaserVoice::hunter` (mixer.cpp:287) is a 43/46 Hz sine thud with a falling pitch and low-passed noise; `sprinter`:316, `interceptor`:344, `pack`:375, `crawler`:405 are other hand-built instruments. Then each voice gets pan, distance gain and low-passes. [code] mixer.cpp:253-283, audio.h:19-27.
- Also in the mixer: the player's `Steps` (516), an eight-line `Reverb` (1054), the hunter `Tone` (486), cues, ambients, the bed, limiter. The game only sends `Scene` and `Source` (audio.h:109). [code]
- The bed reader (`wav.cpp`) reads PCM or float WAV and resamples it as a loop. There is no one-shot sample voice today. [code] audio.h:152-157; audio/README.md.
- The hunter's footstep timing and force layer is NOT on main. It is branch `l192-footsteps` at `5e3b36b` (`Source::stride_phase`, `stride_rate`, force curve, knock; 86 tests green; not landed). [read] handback/p-l192-footsteps-E_2026-11-13.md header and section 2. Any swap must go on top of it.
- Known limit there: the player's own steps mask the hunter's footfalls in 150-600 Hz. [read] same file, section 5.

Prior room research: D654 concluded to build acoustics on the generator's grid, not a ray tracer, and named Steam Audio (Apache 2.0) as the fallback if real early reflections are wanted. [read] handback/p-d654-audio-C_2026-11-11.md, "The answer in short". D656 then built the room reverb, floors and lamp hums. [read] handback/p-d656-sound-A_2026-11-11.md. Their types are in main's audio.h:85-107. [code]

## 2. Synthesis engines and DSP libraries

| name | what it is | licence as read | linkable into a sold game | quality and fit | integration cost |
|---|---|---|---|---|---|
| Mutable Instruments Plaits, Rings, Elements (github.com/pichenettes/eurorack) | Eurorack module DSP in C++. Plaits engines include modal, noise, particle, bass drum, snare, string, speech, grain. | Source headers: MIT, "Copyright 2016 Emilie Gillet" (plaits/dsp/voice.h, engine/modal_engine.h), 2015 (rings/dsp/part.h), 2014 (elements/dsp/voice.h). README: "STM32F projects: MIT"; the name "Mutable Instruments" must not be used on derivatives. stmlib repo LICENSE: MIT default, GPL-3+ only for programming/serial, an ST notice for third_party/STM. [read] | Yes, MIT with notice kept. [read] | Good for distinct, characterful machine and creature voices (noise, particle, modal). A bass drum engine can make a heavy thump. Still synthesis, not Foley. [inferred] | Vendor a source subset plus stmlib. No OS dependency seen. Block size and rate not read. |
| DaisySP (electro-smith) | Embedded DSP: noise generators (dust, particle, fractal), filters, drum models, Karplus-Strong, modal synthesis. | README: "DaisySP uses the MIT license", "can be used in both closed source and commercial projects". LICENSE file MIT. [read] Sibling repo DaisySP-LGPL: "uses the LGPL-2.1 license"; distributors "must give end users the option to recompile with the LGPL components replaced". [read] | MIT part yes. The LGPL part: avoid, or accept the relink duty. | Clean small building blocks, drum models for thumps. Less character than Plaits. [inferred] | Small C++ source. Easy to wrap in our blocks. |
| Synthesis ToolKit (STK) | Classic C++ instruments and filters. | LICENSE: MIT-style, "Permission is hereby granted, free of charge..." [read] | Yes, with notice. | Repo contents not read. | Not scoped. |
| Faust | DSP language; compiler emits C++ classes. | Compiler: LGPL-2.1 (COPYING.txt). FAQ: "The LGPL license of the compiler doesn't apply to the code generated"; generated code's licence "depends only on the licenses of the input files"; libraries "when used unmodified... are compatible with proprietary, non-open source use". [read] Per-function library licences: search summary only. | Yes in principle, after checking each library function used. | Patches generate plain C++. [inferred] | Offline tool; vendor generated code. |
| libpd | Pure Data as a C library, for patches in the manner of Farnell. | LICENSE.txt: "Standard Improved BSD License" (Miller Puckette and others). [read] | Yes with notice. | Procedural audio from patches; the patches' own licence is separate and not read. | Makefile or CMake build. [read] Real-time safety and device-free processing not read. |
| SoLoud | Whole audio engine. | zlib/libpng; third-party parts "extremely liberal". [read] | Yes. | Would replace our mixer, not sit behind it. [inferred] | High. |
| TinySoundFont | Single-file SoundFont synth. | MIT, Bernhard Schelling 2017-2023. [read] | Yes. | Only as good as the .sf2 chosen; the soundfont's licence is not read. | Very small. |
| sfizz | SFZ sampler library. | "BSD-2-Clause license"; uses Abseil (Apache 2.0) and atomic_queue (MIT); repo archived since May 2023. [read] | Yes. | A real sampler with round-robin and velocity layers; heavier than we need. [inferred] | Larger dependency tree. |
| FluidSynth, Csound | SoundFont synth; sound language. | Both LGPL-2.1 (LICENSE, COPYING). [read] | Only with the LGPL relink duty. | Not a fit. | Not recommended. |

GPL synths [read, each LICENSE or COPYING first lines]: Surge XT (GPL-3), Vital (GPL-3), ZynAddSubFX (GPL-2), Dexed (GPL-3). The GPL FAQ says linking "statically or dynamically" makes a combined work covered by the GPL, so a game linking one would have to be released under GPL terms with its source. The same FAQ says "the GPL allows everyone" to sell, but with source and GPL terms. [read gnu.org/licenses/gpl-faq] LGPL-2.1 allows distributing a combined work on your own terms if users can replace the library (section 6, as the COPYING text read states it). On rendering offline: the FAQ says "The output of a program is not, in general, covered by the copyright on the code of the program", with an exception where a program displays a full screen of text or art that comes from the program. [read] So shipping audio rendered from a GPL synth is treated differently from linking it. Not read: each synth's preset and sample licences, which can differ from the code.

## 3. Recorded material

| source | licence as read | attribution | fit |
|---|---|---|---|
| Sonniss GDC bundles | Licence page: commercial and modified use in games allowed, "without attribution to the original creator"; may not "supply the sound effects as sound effects"; finished projects "may be shared, published and sold"; no AI training. [read sonniss.com/gdc-bundle-license/] | None required | Large professional game libraries; the contents of a given bundle were not read. Footsteps, impacts, creatures likely. [inferred] |
| Kenney audio packs | "all game assets... CC0"; "Attribution is not required". Impact Sounds: 130 files, CC0, tagged impact and foley; footsteps not mentioned. [read kenney.nl] | None | Good for impacts; small. |
| Freesound, CC0 items | "you could even sell the sound... but you can't claim you are the author". [read FAQ] | None | Each sound's own page must be checked. |
| Freesound, Attribution items | "always mention the original creators". [read] | A credit line per sound | Usable in a sold game with credits. |
| Freesound, Attribution NonCommercial | "you can't earn any money" with the work. [read] | n/a | Not usable in a game that may be sold. |

Not read: how the Sonniss "supply as sound effects" clause treats loose WAV files in an installer. [inferred] Packing them in the game's own archive is the usual shape, but the keeper should have it confirmed.

## 4. Spatial audio, briefly

Steam Audio: Apache License 2.0 (LICENSE.md first lines, read). Its own site says it uses scene geometry to occlude and reflect sounds, gives reverb, HRTF binaural rendering, and baking for static scenes. [read valvesoftware.github.io/steam-audio] D654 concluded the generator's own rooms and doorways answer most of that more cheaply, with Steam Audio kept as the fallback. What changed since: the FDN reverb, per-biome rooms and floors were built (D656), so its "rooms you can hear" step is in main. [code audio.h:85-107] Nothing here argues for taking Steam Audio now.

## 5. Recommendation

**First swap: a recorded-footfall layer behind the L192 footsteps layer, with the existing synth thud kept underneath as the sub.** [ours]
- Why: the keeper wants thunder and "so much better" sound, and a recorded heavy impact carries a transient and body that hand synthesis does not. The licences are clean (CC0 or Sonniss, no attribution, no link-time duty) and it adds no DSP dependency. [inferred]
- Keep: the hunter's timing, force and mix layer (`stride_phase`, force curve, knock). Swap only the voice: in `ChaserVoice::hunter` (mixer.cpp:287) a foot-down triggers a preloaded one-shot, scaled by the same force value, on top of the 43/46 Hz thud. [ours]
- Files: audio/audio.h (a call to load per-kind footfall banks, like `load_bed` at :152), audio/wav.h and wav.cpp (a one-shot loader; today they resample only as a loop), audio/mixer.cpp (a small one-shot player in `ChaserVoice`, round-robin takes so no two feet repeat), a new audio/tests row, CREDITS.md, the sound files under content/. All on top of `5e3b36b`, not main. [ours]
- Real-time: files are read and resampled at load, as the bed is; `render` stays free of allocation and file access, as audio.h:41-43 requires. [code] [ours]
- Distinct chasers: a separate bank and pitch per kind (sprinter light and quick, pack scrabbling, crawler dragging), keeping the `kKindSpecs` rates. [ours]
- Test red first: with a short known click WAV loaded as the hunter bank, render one foot-down and require its energy at the click's frequency within one tick (200 samples) of the drawn foot. Today it fails because the voice only makes the thud. The L192 rows (13 for 13 footfalls, level within 0.15 dB of the curve, 6.5 dB over the bed) must stay green untouched. [ours; rows from the L192 hand-back]
- Risks: repetition, and masking by the player's own steps, which the swap does not fix.

**Runner-up: Plaits engines (MIT) as the voices for the non-hunter kinds and, if wanted, a bass drum engine for the hunter's sub.** [ours] Each kind gets its own engine (noise or particle for the pack, modal for the interceptor's rattle). Cost: vendor plaits/dsp and the stmlib parts it includes, and write one adapter in mixer.cpp that fills our 32-frame blocks from its `Render`. Quality: stronger than our current voices, below recorded Foley for realism, with the parameter control recorded sound lacks. [inferred]

DaisySP's MIT part is a third option; Faust a fourth. Avoid LGPL parts unless the keeper accepts the relink duty, and every GPL synth as linked code.

## 6. The keeper's choices

1. Is recorded Foley acceptable as the hunter's main sound, with the synth thud only as sub? Options: (a) Foley plus synth sub; (b) synth only (Plaits or similar), even if less realistic; (c) build both and compare by ear.
2. Where may sounds come from? Options: (a) CC0 only (Kenney, CC0 Freesound), no credits; (b) add Sonniss bundles, no credits, with the loose-file clause confirmed first; (c) also allow Freesound Attribution items with a credits screen.
3. May a GPL synth be used offline as a sound-design tool, with only rendered audio shipped? Options: (a) yes, per the GPL FAQ's output statement; (b) no, keep tools permissive too; (c) ask a lawyer first.
4. The masking by his own steps (L192 section 5, options a to d): decide before any new sound is judged.

## 7. Not read

- STK repository contents (only its LICENSE read). Plaits, Rings, Elements README and block-size details; whether Plaits' speech data carries other terms.
- faustlibraries licence files and the faustdoc licence page (404). Only the FAQ and a search summary were seen.
- libpd's README on real-time use (404 on one URL; the other page did not say). Farnell's patches' licence.
- sfizz's LICENSE file (only the page's label and dependencies), SoLoud's legal page (connection refused), its backends and filters.
- The LGPL-2.1 and GPL-3 texts beyond their first lines and the FAQ excerpts; the GPL FAQ past character 100,000.
- Contents of any Sonniss bundle; Kenney footstep packs; creature libraries on Freesound.

## 8. Not verified

- No sample was auditioned and nothing was built; every quality claim is [inferred].
- The real-time cost of Plaits or DaisySP in our block loop is unmeasured.
- Licence facts were fetched through a summarising reader, not read as full raw texts; the project's own licence file should be opened before anything is vendored.
