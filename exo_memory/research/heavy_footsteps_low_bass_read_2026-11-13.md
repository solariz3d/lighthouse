# How heavy footsteps are built, and how low bass is heard and located: the read for L199's heavy stomp

**What this is:** the source read the chair's 11:04:41Z packet asked for ("SOURCES FIRST, fanned out to a subagent, read
and marked"). A subagent of pane E wrote it on L on 2026-11-13, finishing 05:1x local, and it is copied here VERBATIM
from its final report. Only the `&amp;` entities were changed back to `&`, and this header was added. Where it is used, and
what the renders measured against it, is in `exo_memory/handback/p-l199-voices-E_2026-11-13.md` §8.
**Marks:** [read] = opened and read; [read, abstract] = only the abstract; [secondary] = someone reporting another
person's words; [inferred] = the reader's own conclusion. PDFs were read with `pdftotext`. Web pages and abstract records
came through a fetch tool's extraction step, so treat those quotes as verbatim with a small risk of error. The extracts
are in pane E's scratchpad (`scratchpad/pdf/`), outside any repository.

---

I answered all five questions. The research sources mostly back the request, but they do not support relying on the bass boom alone. On laptops and small headphones the 35–50 Hz boom is mostly not reproduced. Even where it is heard, it gives little sense of direction, and none for "is it behind me". The sources put the weight in the low end, but they put hearing it coming and finding it in the mid and high layers and in the onset.

## 1. How heavy or giant footsteps are built

- **[read] Randy Thom, Sound Ideas blog, 2025-04-03.** https://sound-ideas.com/blogs/sound-ideas/the-sound-design-power-of-single-events-composed-of-multiple-closely
  - One heavy step should be several closely spaced hits: "may be three to eight impacts over a period of one second or less".
  - Heavy things "don't land with a simple, single transient," except in cartoons.
  - He also writes: "the least interesting sound in most cases is a single syllable sound, a transient or a held note."
- **[read] Erik Aadahl, Designing Sound interview, 2009.** https://designingsound.org/2009/04/06/monsters-vs-aliens-exclusive-interview-with-sound-supervisor-erik-aadahl/
  - Slowed, overloaded recordings: "When slowed, they sounded huge and explosive, like somebody dropping a giant boulder".
  - A robot's feet were "washer/dryer door slams, slowed down and bass enhanced".
  - The giant's footsteps were heard "reverberating around the city streets", so the reverb tail helps carry size.
- **[read] Mike Levine, Mix, 2011.** https://www.mixonline.com/?p=56421 (interviews with film sound editors)
  - Harry Cohen: "making the large part of the sound last longer instead of a single transient at maximum volume".
  - Chris Assells: "put a gap before the impact sound, an actual gap of silence, because it makes the sound hit bigger".
  - Jon Title layers a "very tight, high-frequency, snappy" element in the centre with "a boomier stereo pair" and "a sweetener with a subwoofer element".
- **[secondary] Gary Rydstrom on the T. rex footsteps**, quoted by Far Out Magazine, 2023 (https://faroutmagazine.co.uk/iconic-sound-behind-jurassic-parks-t-rex/):
  - "mostly sonic booms"
  - "We wanted to get that just low frequency and nothing else"
  - "sections of a redwood tree falling".

  I could not find the original interview, and that design was for cinemas with subwoofers.
- **[read, vendor tutorial with no named author] Krotos, 2022.** https://krotos.studio/blog/dinosaur-footsteps-sound-effects-made-easy
  - "Sub-bass impacts make for a great first layer", "particularly around 60-100Hz".
  - Low-mid body from car door slams, "between 100 & 200Hz".
  - Rock and debris "add to the seismic power".
  - "Some subtle distortion will provide better results than boosting the high frequencies too high."
- **[read, practitioner blog] Oliver Smith, freelance game sound designer, 2021.** https://oliver-smith-zef4.squarespace.com/blog/how-to-make-your-mobile-game-sound-better
  - "try subtle Distortion or Saturation to add upper harmonics to your bass and low end elements".
  - He also states "Mobile speakers tend to drop off at around 800Hz", with no source given.
- **Games.**
  - [secondary] Game Developer's write-up of the Overwatch GDC 2016 talk says the game was designed by "making the footsteps of an enemy sound louder than those of an ally." https://gamedeveloper.com/audio/video-how-i-overwatch-i-was-designed-so-people-could-play-by-sound-
  - [secondary] VGR reports that the Resident Evil 2 director said Mr. X's steps were a mix of effects suggesting a very large man. VGR has no direct quote on this. https://vgr.com/?p=41067
- **[inferred] The layers these sources name:**
  - sub (weight)
  - low-mid body (thump)
  - crunch or debris (texture, "seismic")
  - tail or reverb (space and size)
  - several closely spaced micro-impacts
  - a gap before the hit

  The only explicit small-speaker advice in these sources is "add harmonics or saturation", at practitioner level, which section 2 supports.

## 2. Hearing bass on small speakers

- **[read] Oxenham, "Pitch perception", J Neurosci, 2012.** https://pmc.ncbi.nlm.nih.gov/articles/PMC3481156
  - The missing fundamental: "a tone retains the same pitch, even if all the energy at the F0 is removed or masked by noise".
  - "low-numbered resolved harmonics elicit a much more salient, robust, and accurate pitch."
  - Only "repetition rates between ∼30 and 4000 Hz" give a pitch strong enough to carry a melody.
- **[read, abstract] Krumbholz, Patterson & Pressnitzer, JASA, 2000** (Europe PMC record, doi 10.1121/1.1287843).
  - Between 16 and 64 Hz, "the perceptual quality of the stimuli changes from flutter to pitch".
  - The authors estimate "a pitch limit of about 30 Hz".
  - When the harmonics are all above 1 kHz, the change from flutter to pitch "occurs at progressively higher rates".
- **[read] Moliner, Rämö & Välimäki, "Virtual bass system with fuzzy separation of tones and transients", DAFx, 2020, CC BY.** https://acris.aalto.fi/ws/portalfiles/portal/51973173/Eloi2020_Virtual_bass_DAFx2020.pdf
  - The speaker's low cutoff "may vary between about 100 Hz and 200 Hz in small loudspeakers".
  - Boosting bass with EQ "usually leads to distortion and might cause unrecoverable damage to the loudspeaker".
  - A virtual bass system works by "tricking the human auditory system to perceive low tones from higher harmonics".
  - A half-wave rectifier makes only even harmonics, so the pitch is heard "one octave higher than desired".
  - The phase-vocoder method "performs poorly in transient-like sounds".
  - They target "small loudspeakers, such as those used in laptop computers and mobile devices."
- **[read] Aarts, overview of his group's loudspeaker papers, 2024.** https://www.sps.tue.nl/rmaarts/RMA_papers/aar24mi1.pdf
  - "Small loudspeakers are in general not capable of reproducing low-frequency notes".
  - The virtual-pitch method shifts bass "to a higher frequency band where the loudspeakers are capable".
- **[read] Notebookcheck, laptop audio article.** https://www.notebookcheck.net/Laptops-101-Designing-a-capable-laptop-audio-subsystem.430253.0.html
  - Their reference micro-speaker "can output a very low frequency of 100 Hz".
  - Laptop speakers "struggle with low frequencies".
- **[read] ISO 226:2003, Table 1, hearing threshold Tf** (free iTeh preview: https://cdn.standards.iteh.ai/samples/34222/d93363dbdafa470aab734f04d091065b/ISO-226-2003.pdf):

  | Frequency | Threshold |
  |---|---|
  | 31.5 Hz | 59.5 dB |
  | 40 Hz | 51.1 dB |
  | 50 Hz | 44.0 dB |
  | 80 Hz | 31.5 dB |
  | 200 Hz | 14.4 dB |
  | 315 Hz | 8.6 dB |
  | 800 Hz | 2.2 dB |
  | 1 kHz | 2.4 dB |

  checked: `pdftotext` on that file, Table 1 → values above.
- **[inferred] What this means for a 35–50 Hz boom.**
  - The boom sits right at the flutter/pitch edge. A pitch drop into 35 Hz moves it toward flutter.
  - On a speaker that cuts off at 100–200 Hz, the "bass" you actually hear is harmonics 3 to 5: 105–250 Hz for a 35–50 Hz fundamental. That band lies inside the player's 75–300 Hz footstep band.
  - Harmonics up at 600–1200 Hz are numbers 12 to 34 of 35–50 Hz, so they are unresolved. They will carry rhythm and roughness, not a 40 Hz pitch.

## 3. Locating low frequencies

- **[read] Middlebrooks, "Sound localization", Handbook of Clinical Neurology, 2015.** https://escholarship.org/content/qt01k9w5zq/qt01k9w5zq.pdf
  - Duplex theory: at low frequency the wave "bends" around the head, and "the difference in sound level at the two ears is negligible", so direction comes from timing differences (ITD).
  - ITD sensitivity is "minimal (i.e., sensitivity is greatest) for frequencies from 0.7 to 1.0 kHz". It gets slowly worse below 0.7 kHz, and listeners are "essentially insensitive" at 1.4 kHz and above.
  - Timing cues carried only in the envelope are "rather ineffective".
  - Telling front from back needs "a relatively broad, flat spectrum… the important spectral range is ~4 kHz and higher". Narrowband sounds produce front/back errors that depend on their centre frequency.
  - Distance is judged from level and the direct-to-reverberant ratio.
- **[read, abstract] Hartmann, Rakerd & Crawford, JASA, 2025** (doi 10.1121/10.0039111): timing and level cues get "equal ITD and ILD weights … at a crossover frequency between 400 and 600 Hz".
- **[read, abstract] Năstasă, Pulkki & Mäkivirta, AES, 2023.** https://research.aalto.fi/en/publications/auditory-localisation-of-low-frequency-sound-sources/
  - Under anechoic conditions: "Changes in direction as small as 10 degrees can be reliably detected for pink noise bursts from 31.5 Hz and for pure tones from 63.5 Hz."
  - But "minor room resonances … caused a significant change in the directional judgement".
- **[read, abstracts, Europe PMC] Hartmann and Rakerd's room studies:**
  - Rakerd & Hartmann 1986: "The steady-state sound field of a sine tone does not provide useful localization information in a room."
  - Same paper: "Localization in rooms is facilitated by onsets even if the onsets are as long as 100 ms."
  - Rakerd & Hartmann 1985: "A sound must include transients if the precedence effect is to operate".
  - Hartmann 1983: sounds "with strong attack transients" localise independently of room reverberation time.
- **[not opened; abstract text seen only through a search summary] Laine et al., AES 2007, paper 7113.** In noise, a 62.5 Hz tone had to be 18 dB above its detection level before listeners could lateralise it correctly.
- **[inferred]** Very low frequencies can be localised in principle. In practice that ability is fragile in noise and in rooms, and on the target hardware the boom mostly isn't reproduced. Direction would come from the onset, from content around 0.4–1.2 kHz (where timing cues work best), and from broadband content above 4 kHz for front/back. A layer limited to 600–1200 Hz alone risks front/back confusion, and front/back is exactly the case for a chaser behind the player.

## 4. Masking

- **[read] Bernstein & Trahiotis, JASA, 2008** (PMC2647747): "masking is highly asymmetric in that a given masker produces a greater amount of masking for targets above" its own frequency region.
- **[read, abstract] Yasin & Plack, JARO, 2005.** https://eprints.lancs.ac.uk/id/eprint/18746 The upward spread of masking "seems to be mainly determined by the compressive basilar-membrane response."
- **[inferred] What it implies for the hunter.**
  - The player's steps (75–300 Hz) are above the boom, so they mask it in the weak (downward) direction.
  - The measured masking at 12–20 m is better explained by four things:
    - the boom's roughly 40 dB higher hearing threshold (ISO 226, 40 Hz against about 300 Hz);
    - small speakers not reproducing 35–50 Hz;
    - same-band masking of the boom's own audible harmonics (105–250 Hz);
    - a far source competing with the player's own, near footsteps.
  - A 600–1200 Hz layer sits above the masker, where upward spread from 75–300 Hz reaches only when the masker is loud. That fits your measurement.
  - In the other direction, a loud nearby stomp will mask the player's own steps upward.
  - Keeping the hunter's audible layer out of 75–300 Hz, or ducking the player's steps when the hunter steps, follows the same logic as the Overwatch practice.

## 5. Fear and low frequencies

- **Solid evidence: roughness and nonlinear sound.**
  - [read, abstract] Arnal et al., Current Biology, 2015 (https://archive-ouverte.unige.ch/unige:75898): screams cluster "between ∼30 and 150 Hz modulation rates" (roughness); roughness "boosts their detection" and "engages subcortical structures critical to rapidly appraise danger".
  - [read, abstract] Anikin et al., Proc R Soc B, 2021 (CC BY, https://comm.ucla.edu/wp-content/uploads/2026/01/Anikin-et-al.-2021-Harsh-is-large-nonlinear-vocal-phenomena-lower-vo.pdf): nonlinear sound "lowered perceived voice pitch… and caused vocalizers to sound larger, more formidable and more aggressive"; nonlinear sounds "prevent habituation". This was for voices, not footsteps.
- **Solid evidence: rising level.** [read, abstract] Bach et al., Cerebral Cortex, 2008: "rising sound intensity is an elementary warning cue". It activates the amygdala, and listeners overestimate how much rising sounds change.
- **Solid evidence: sudden onsets.** [read, abstract] Putnam & Roth, Psychophysiology, 1990: "Intense auditory stimuli of sudden onset evoke … startle blinks". Blink size is sensitive to how fast the sound rises (3–45 ms tested) and it habituates with repetition.
- **Correlational and context-dependent.**
  - [read, abstract] Blumstein et al. 2010: horror soundtracks had "more non-musical sidebands, and noisy screams than expected" (correlational).
  - [read, abstract] Blumstein et al. 2012: added nonlinearities changed arousal in music alone, but with video "valence (but not arousal) decreased".
  - [read, abstract] Korcsok et al., Sci Rep, 2024: "Low-pitched sounds in complex sound categories prompted avoidance, while in other categories they elicited approach"; loud sounds led to avoidance.
- **Weight cue.** [read] Tajadura-Jiménez et al., CHI 2015 (https://discovery.ucl.ac.uk/id/eprint/1464800/2/Tajadura-Jimenez_As%20Light%20as%20your%20Footsteps_CHI-2015.pdf):
  - "walking sounds produced by heavier bodies contain more energy in the low frequency components".
  - Experimentally, only the brightened ("light") condition changed perceived weight. The low-frequency boost was "far from significance" compared with control.
- **Infrasound.**
  - [read] Scatterty et al., Frontiers in Behavioral Neuroscience, 2026 (https://www.frontiersin.org/journals/behavioral-neuroscience/articles/10.3389/fnbeh.2026.1729876/full): about 18 Hz at 75–78 dB for 4 min 40 s, 36 participants. Irritability rose (p = 0.049), cortisol rose (p = 0.022), "Participants did not detect infrasound above chance", and the authors list small-sample limits.
  - [read] Angliss's own account of the 2003 "Soundless Music" concerts (https://www.sarahangliss.com/?p=27293): "Our results were tentative"; "a tantalising but inconclusive result".
  - The often-quoted 22% figure comes from press reports only.
  - [inferred] Infrasound is irrelevant here: target hardware cannot play 18 Hz at 75 dB.
- **Popular claim not supported by anything I read:** that bass by itself causes fear. What is supported is loudness and rising level, abrupt onset, roughness or nonlinearity, and "low is large".

## Where the sources agree with "heavy scary bassy stomps", and where they pull against it

**Agree:**
- Low-frequency energy reads as weight and size (Tajadura-Jiménez, Anikin, Rydstrom, Krotos).
- Abrupt, loud onsets startle (Putnam & Roth).
- A level that rises as the hunter approaches is a built-in warning cue (Bach).
- Harshness makes a sound both larger and scarier (Anikin, Arnal).

**Pull against:**
- **Being heard coming.**
  - At 35–50 Hz the boom needs 44–51 dB SPL just to reach threshold (ISO 226).
  - Small speakers cut off at 100–200 Hz (Moliner).
  - Its virtual-bass harmonics would land in the player's own footstep band.
  - So a warning at 12–20 m has to be carried by a layer above about 300 Hz.
- **Locating it.**
  - A steady low tone gives no useful direction in a room (Rakerd & Hartmann).
  - In noise, about 60 Hz needs roughly 18 dB of extra level before it can be lateralised (Laine, abstract only).
  - Front/back needs broadband content above about 4 kHz (Middlebrooks). A pure bass stomp says "it's near", not "it's behind-left".
  - The onset helps localisation in any band (Hartmann and Rakerd).
- **The 35–50 Hz range itself** sits at the pitch floor (about 30 Hz, Krumbholz), so a pitch drop there turns into flutter rather than a deeper note.
- **Repetition:** startle habituates when the same sound repeats. Nonlinear, rough sound resists habituation, which argues for variation or roughness across steps.
- **[inferred] Brightness:** a bright crunch layer on its own may read as "lighter" (Tajadura-Jiménez). It needs the low body and the closely spaced micro-impacts (Thom) to stay heavy.

**[inferred] A combination these sources support:** a sub boom for weight, a body below the player's band or with the player's steps ducked, a rough 0.6–1.2 kHz layer (roughness modulation at 30–150 Hz overlaps the 35–50 Hz stomp rate), a broadband crunch above 4 kHz with distance and reverb, a sharp onset, and a level that rises as the hunter closes in.

## Sources I could not open (not cited as read)

- **Video-game pages:** PC Gamer's Resident Evil 2 director interview, its Alien: Isolation audio article, and its Overwatch article (only the headlines came through). GDC Vault Overwatch talk (paywalled). Bloody Disgusting Resident Evil 2 piece (403). Alien: Isolation footstep claims seen only in search summaries.
- **Localisation papers:**
  - Laine et al. 2007, AES (403, and 522 on the mirror).
  - Kugler & Theile 1992, AES preprint 3335 (scanned, no text layer).
  - Năstasă et al. 2024, Journal of the AES (members only), and the 2023 conference paper's Aalto PDF (403).
  - Hartmann's `vrlf.pdf` and `rooms2.pdf` at web.pa.msu.edu (blocked by bot protection; I used the Europe PMC abstracts instead).
- **Masking papers:** PMC2821167 (captcha). Yasin & Plack full text (login). Wegel & Lane 1924 and Egan & Hake 1950 (not found open). The "2–2.5 dB/dB" growth-of-masking figure appeared only in a search summary, so it is not used.
- **Small speakers:** Larsen & Aarts 2002, Journal of the AES (cited only through Aarts and Moliner). MDPI micro-speaker paper (403).
- **Fear and pitch:** Neuhoff 1998, Nature (no abstract available). Blumenthal & Berg 1986 (no abstract in the record). Arnal 2015 full text (restricted; abstract read). Huron et al. 2006 (403 twice). Tandy & Lawrence 1998. The "Soundless Music" press release and the 22% figure.
- **Rydstrom:** the original Vulture interview was not found.
- **Textbooks:** Viers, Sonnenschein, Holman, Blauert, Moore, Zwicker & Fastl were not opened. Glasberg & Moore's auditory-filter widths, behind my "unresolved harmonics" inference, were not opened either.
