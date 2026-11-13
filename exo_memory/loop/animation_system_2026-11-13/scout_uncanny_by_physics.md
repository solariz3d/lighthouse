# Scout: the uncanny, by physics (2026-11-13)

1. The studies say: ~~a lawful body that does MORE than a human is read as real (+108% throws accepted)~~ [2nd reader: WRONG as framed. Vicovaro 2014 raised only the BALL's release speed (+48%, distance +108%) and left the thrower's own motion unchanged, so it is the ball outrunning the body that was tolerated, i.e. a body-to-object mismatch went unnoticed half the time; no body was made stronger. Primary: vicovaro2014.pdf, pdftotext lines 364-367 and 722-723 (my own conversion). Not locomotion, not eeriness; a rating of "correct" throws]; a body that breaks
   physics is read as an error, and more so on a human figure; eeriness rises for features past the familiar range. [2nd reader: DOWNGRADED. "More so on a human figure" is Reitsma 2008's abstract, "higher sensitivity to SOME types of errors" in a detection task, with "no evidence" that a prep-to-ballistic mismatch caused it; the third clause is Burleigh 2015: static morphs of made-up creatures, not humans, not motion. None of the three measures eeriness of moving superhuman bodies. Primaries: eg_reitsma.html description meta; PMC4300869 Discussion]
2. Derived: raise one capability (grip, force, stiffness, limb length) and Newton fixes what changes. Grip is the one
   that shows on the whole body where the player looks: lean = atan(a/g), past 45 degrees once grip passes 1.
3. Found in the code: the hunter on main is drawn at 1 degree of lean per m/s^2 (Overgrowth), physics asks 5.8; its
   feet stay under it. [2nd reader: RE-DERIVED, the code facts are in G-code:24-25 and G-sources:36; only the 5.84 comparison is new]
   At ~~his picked cue (grip 1.33, R 6 m)~~ [2nd reader: DOWNGRADED. He picked H2 and "I like 1" (brief:1150), not 1.33; 1.33 is a press figure for a cheetah that E offered (G-loco:125-126, H187:224)] physics says 53 degrees; the trunk shows about 4.6.
4. Design: the capability lives in the simulation (grip, per kind); the picture only obeys physics of the path; every
   kind passes the same physics rows, and exactly one "cue channel" per kind may leave the human band.
5. First lap: one row, ~~red today on the flee bot's seed-1 run (whole-body lean about a fifth of physics)~~ [2nd reader: UNSUPPORTED. Body text s4 says "inferred, not run"; the fifth is the PELVIS tilt at an assumed V 9, R 6, not the row's foot-to-pelvis line and not the bot's corners], plus a roll
   of the body about its feet, off by default, shown to him on one corner before anything lands.

Marks: [read] opened and seen (path:line); [summary] secondary account or another swarm file; [inferred] mine;
[ours] a proposal; [derived] my own working from the laws of motion (a kind of [inferred], kept apart so a reader can
check the arithmetic). Short names:
- G-words, G-sources, G-physics, G-loco, G-code, G-roster = the six `ground_*.md` files in this folder.
- H187 = `C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-l187-animal-locomotion-E_2026-11-12.md`.
- TP = `C:/Users/nname/Desktop/lighthouse/exo_memory/third_place/2026-11-13.md`.
- brief = `C:/Users/nname/Desktop/lighthouse/exo_memory/briefs/dreamzone2_the_game.md`.
- S = `C:/Users/nname/AppData/Local/Temp/claude/0d67fc0e125090b2/0c0c0c0b-0000-4000-8000-00000000115b/scratchpad/unc_dl/`.
  My downloads and text conversions. Line numbers in S are of MY conversions (PMC XML stripped of tags and wrapped on
  word boundaries at about 110 characters; PDFs through pdftotext). The sources are public; a reader can re-fetch them.
- dz3 = `C:/Users/nname/Desktop/dreamzone-3` at main 31d1c6d [read: `git log -1 main`]. Nothing was built or run.

## (1) What the room already has for this aspect

His words (verbatim, as the brief holds them):
- 167: "the hunter, and other entities, can take things from different animals, while being humanlike at the same
  time, to create that uncanny valley effect" [read: brief:1143].
- 168: "all entities must be humanoid in nature with their own unique uncanniness" [read: brief:1150].
- 214: "on the corners, the torso doesnt orient itseld into the banking of a turn, it looks very good, but is starting
  to become too human looking, we need to almost start to tweak it to be creepy some how" [read: brief:1589].
- 215: "we did do tons of research, remember" [read: brief:1599].
- 217: "i think from the idea i had in my head, we get the a good metric for a really human looking sprint which we
  had, and then we tweak it from there to look uncanny in a realistic way that obeys physics" [read: brief:1607].

What stands, by ground file:
- His picks: hunter T1 only (greyhound cornering), sprinter T3, pack T4, interceptor T2, climber/crawler T4, stalker
  T2, charger T3 [summary: G-words:413-419; G-loco:164-169]. Hunter corners by H2 with "Grip above human"
  [summary: G-words:406-411, :555-556].
- The trait catalogue T1-T5 and costs [summary: G-loco:151-162]. No trait other than T1 is coded; T1 exists only as
  `turn_law`, off, on the l182 branches [summary: G-loco:127-130, :170-171].
- The H2 law `min(V_o, sqrt(mu g R))`, mu 1.0 (inferred) or 1.33 (cheetah, press) [summary: G-loco:118-126]; E's
  reading "mu is where 'how monstrous' lives" [read: H187:225].
- The yardstick: legs vs Fukuchi at 2.5-4.5 m/s, arms vs 25 CMU clips at 2.67-4.15 m/s; it cannot score a bend, a
  speed above 4.5, or a non-human trait: "There is no instrument for eeriness" [summary: G-loco:188-221].
- The lean as built: Overgrowth's tilt (velocity/2 + low-passed acceleration, in degrees), Valve's yaw and look, the
  first game's bank shares 1.0 / 0.35 / -0.30 [summary: G-code:99-124; G-sources:34-38, :216-221].
- Picture only is enforced by tests (self-test part 7; his 16 kept runs byte-identical) [summary: G-roster:33-54].
- No per-character frame cost has been measured anywhere [summary: G-physics:257-270; G-code:228-252].

What the room read of the uncanny literature, and one correction to my own task text:
- My task says the room read only the three studies' abstracts. The record says E read Kätsyri 2015 and Saygin 2012
  IN FULL on 2026-11-12 ("[read full]") and Thompson 2011 as an abstract [read: H187:122-123, :133]. The brief's own
  note at item 167 was written before that, from abstracts [read: brief:1144]. I re-read all three at source anyway.
- E's conclusions: mismatch is the best-supported road, but its evidence is mostly static; movement alone makes no
  valley; "No source I read tests ANIMAL motion on a human body"; one strong cue beats many weak [read:
  H187:146-147]. "A horror figure is an outlier character" [read: H187:135].
- The Third Place's two readings, marked by that seat as its own and unsourced: his 14:21 notes may be one (the cue
  needs a lean the picture hides) [read: TP:936]; a tweak should change what the body is capable of and let the laws
  produce the motion, with the yardstick as a ruler both ways [read: TP:992-999]. This file is the derivation and the
  check those two readings ask for; they are the Third Place's, not mine.

Where the ground files were thin, and what I read myself: the ground files say nothing on how people judge
superhuman-but-lawful motion against physics-breaking motion. I read that at source (section 2). I read
`game/model_rig.cpp:415-476` (apply_motion) and `:498-532` (DrawnChaser::step) in dz3 to check the lean (section 3).

## (2) What I read at source that is NEW

Rule 5: nothing below is proposed for USE as code, data or art. Every item is "use the idea". Licences are given where
I read them; none needs clearing for an idea.

### 2.1 The three studies under item 167, re-read whole

**Kätsyri, Förger, Mäkäräinen & Takala 2015, Front Psychol 6:390, PMC4392592.** Full text, read whole (S katsyri.txt,
1383 lines). Licence CC BY 4.0 [read: S katsyri.txt:16-17].
- ~~New to the room's reading: there are TWO mismatch hypotheses~~ [2nd reader: RE-DERIVED. H187:128 quotes both H4a and H4b with "3 out of 4 studies", and H187:130 notes the clearest cases are face cues. What is new is only the reading that H4b "fits beyond human"] and the second is the one that fits "beyond human".
  H4b, atypicality: "Humanlike characters with atypical features will elicit more negative affinity" [read:
  katsyri.txt:511-512]; "it makes a unilateral prediction related to only humanlike characters" [read: :506-507].
- [2nd reader: DOWNGRADED. The sentence is the authors' extrapolation ("would suggest") from face studies: 3 of 4 H4b studies, one contrary (Burleigh 2013, rolled-back eye); evidence is eyes and expressions, not body motion. PMC4392592 Table 5 text, "Consistently with H4b..." paragraph.] Sensitivity grows with realism: "avoiding the uncanny valley will become exponentially more difficult as the
  characters' overall appearance approaches the level of full human-likeness" [read: katsyri.txt:1349-1351].
- ~~A DYNAMIC atypical feature counted~~ [2nd reader: UNSUPPORTED, and against the review itself: the same review says the refined hypotheses "have up to date been studied using only static stimuli" (Discussion, my PMC4392592.txt line 315), and it never says Mäkäräinen's stimuli moved. Treat as a facial-expression rating of unstated motion]: Mäkäräinen 2014, "unnaturally exaggerated facial expressions were rated as more
  strange on increasingly humanlike faces" [read: katsyri.txt:1115-1116]. Exaggeration past the human range on a
  human figure is the closest case in the review to a capability raised past a human's. [inferred]
- The review cites a study where extrapolated stimuli "were categorized easily but were nevertheless considered more
  eerie" (Burleigh & Schoenherr 2015) [read: katsyri.txt:1314-1317]. I read that study too (2.2).
- [2nd reader: RE-DERIVED for the static-only half, H187:127 quotes the same sentence (Kätsyri l.366).] Still open in 2015: "inconsistent static and dynamic information ... remains unexplored" [read: :1231-1233]; the
  refined hypotheses were tested "using only static stimuli" [read: :1177-1179].

**Saygin, Chaminade, Ishiguro, Driver & Frith 2012, SCAN 7:413-422, PMC3324571.** Full text, read whole (S
saygin.txt, 950 lines). Licence CC BY-NC 3.0 [read: S saygin.txt:14-16].
- [2nd reader: RE-DERIVED, H187:137-139 has 20 adults, the identical kinematics and "not eeriness ratings". OK against my own PMC3324571.txt lines 23, 27.] The android and the robot made "the very same, programmed movements" [read: saygin.txt:211-212]; 20 adults, one
  excluded [read: :191-192]; the measure is fMRI repetition suppression, not a rating [read: :167-185].
- The model: "When an agent looks like a human ... the brain generates a prediction that this appearance will be
  associated with a particular kind of behavior (e.g. movement kinematics)" [read: :128-131].
- [2nd reader: DOWNGRADED. The text says "We speculate ... may be dependent on how narrowly tuned" and "Future work should explore whether" conspecifics are narrowly tuned (my PMC3324571.txt line 291); a speculation and an open question, not an expectation.] New to the room's reading: the authors expect the error to be larger the more narrowly the observer is tuned, and
  name conspecifics as the candidate for the narrowest tuning [read: :873-877]; they leave open whether "humans moving
  like robots" or "other kinds of expectation violations between appearance and motion" do the same [read: :906-911].
  [inferred] So a human body moving like an animal is untested here too, as E said.

**Thompson, Trafton & McKnight 2011, Perception 40:695-704, doi 10.1068/p6900.** Paywalled at SAGE; no open copy
found (two searches; CORE links returned a bot check). PubMed abstract read whole [read: S thompson_abs.txt:12-24].
- "we parametrically manipulated three different kinematic features of two walking avatars and found that ... ratings
  of the humanness, familiarity, and eeriness of these avatars changed monotonically" [read: thompson_abs.txt:18-21].
- The abstract does not say in which direction eeriness moved, nor which features were varied [read: same lines].
  A citing paper, through a search summary only, names them "joint disarticulation, jerk, and phase" [summary].
- [2nd reader: PARTLY RE-DERIVED. H187:132 already holds the Kätsyri l.303 line that less humanlike movement gives lower affinity with no valley; H187:168 says "weak ... no valley" as a CUE, not "no effect", so the "correction" is aimed at a reading E did not quite make.] Correction to a reading in the room [inferred]: "monotonic" is not "no effect". If eeriness rose steadily as
  humanness fell, a uniformly degraded gait is MORE eerie, just with no dip. The room read it as "weak" (H187:168,
  the asymmetric-phase verdict). Kätsyri's table scores Thompson as against H2a and for H2b ("more humanlike movement
  ... higher affinity") [read: katsyri.txt:916-920], so lower affinity for less human motion is the likely direction.
  That does not change the design: he rejected degraded motion on his own grounds (163, 195).

### 2.2 Judging lawful-but-beyond-human motion against motion that breaks physics

**Vicovaro, Hoyet, Burigana & O'Sullivan 2014, ACM TAP (throwing animations).** Full PDF from Disney Research's
site (S vicovaro2014.pdf, 17 pages); I read the abstract, introduction, Experiment 4 and the discussion, in whole lines
(S vicovaro2014.txt:4, :11-14, :243-282); not the methods or results tables of Experiments 1-3. Licence of the copy:
not stated in what I read.
- On a human thrower, observers "tolerate large increases in the release velocity of the ball" and are "less tolerant
  to decreases" [read: vicovaro2014.txt:14]; "a 108% increase in the throwing distance for the underarm throw was
  considered to be correct 50% of the time", against -24% for a shortening [read: :261].
- On a mechanical ramp the pattern reverses: more sensitive to increases [read: :14, :244-246].
- The authors' reading: judgments of human throws rest on heuristics from one's own throwing, which may "overshadow"
  a gravity bias [read: :266-267, :273].
- They restate Reitsma et al. 2008: observers "are more sensitive to manipulations of the coefficient of gravity when
  presented with human ballistic motion than when presented with simple physical ballistic motion" [read: :274].
- ~~[inferred] A human body achieving MORE than its preparation implies is read as real. That is the sense in which a
  raised capability is lawful-looking.~~ [2nd reader: WRONG as stated. In Experiment 1 the body did not achieve more; the ball was given more speed than the body's motion implies. That is a body-to-ball inconsistency that was tolerated, and Experiment 2 (preparatory motion edited to match) did not improve acceptance (vic.txt 70-72). Nothing was tested on a stronger body.]
  It is also a warning: a lawful superhuman output may simply not be noticed. [2nd reader: the same line the scout cites for Reitsma (:274) goes on to say Vicovaro's own human-vs-ramp sensitivities were SIMILAR in size and that this was "somewhat unexpected in light of" Reitsma (my vic.txt 833-839). The scout's (6) leans on the half of that line that agrees.]

**Reitsma, Andrews & Pollard 2008, Computer Graphics Forum 27(2):201-210.** Abstract only, read whole from the
Eurographics library page (S eg_reitsma.html, the `description` meta tag); full text not found open.
- "users display a higher sensitivity to some types of errors when these errors are displayed on more human-like
  characters" [read: abstract]. [inferred] Physics-breaking motion on a human figure is seen, and seen as an error.
- Reitsma & Pollard 2003 (TOG 22(3):537-542), the first study: not read; a search summary says horizontal-velocity
  errors and added accelerations were easier to detect [summary].

**Burleigh & Schoenherr 2015, Front Psychol, PMC4300869.** Read: abstract, Experiment 1 stimuli, both discussions
and the concluding remarks (S burleigh2015.txt:16-30, :510-520, :1097-1168, :1366-1460). Licence CC BY 4.0 [read:
:16-17].
- Stimuli were static morphs of three made-up creatures, not humans and not motion [read: :510-514].
- "extrapolation items outside the initial training range were associated with greater negative affect relative to
  items within the training range" [read: :1440-1442], while categorisation was easy at the extremes [read:
  :1443-1444].
- [inferred] The closest measured case to "a human body moving past the human range": familiar category, unfamiliar
  extent, more eerie. It is static and non-human, so it is a direction, not a figure.

**Harrison, Rensink & van de Panne 2004, ACM TOG 23(3):569-573, "Obscuring length changes during animated motion".**
Full PDF from UBC, read whole (S harrison2004.txt, 180 lines). Licence of the copy: not stated.
- Length changes of 3% are seen with full attention; "changes of over 20% can go unnoticed when attention is not
  focused" [read: harrison2004.txt:17]. Growth is seen sooner than shrinkage (6.9% vs 19.7%) [read: :54].
- Attention goes first to objects that are "interesting in its own right (e.g., is a human)" [read: :138]. [2nd reader: DOWNGRADED. That is the paper's background citing Rensink 2002, not a result of its five experiments (my har.txt line 219); the 3%/20% bounds are one arm link of an animated stick figure, one distractor task, 80% PEST thresholds.]
- [inferred] A cue only works on what the player attends to. A limb that grows during a stride is a weak cue; the
  whole body's path and lean, which the look-behind shows, is a strong place for one.

**Feet and size carry gravity: Troje & Westhoff 2006; Chang & Troje 2009; Jokisch & Troje 2003.** PubMed abstracts,
each read whole (S pubmed_abs1.txt:16-30, :44-60, :74-89).
- Direction and the inversion effect are "entirely carried by the local motion of the feet" [read: :25-26]; the
  local inversion effect "is carried by accelerations contained in the foot motions" [read: :59-60].
- Stride frequency is read as size: "displays with high stride frequencies are perceived to be smaller", following
  "the predicted inverse quadratic relation between stride frequency and size" [read: :85-88].
- [inferred] Two places where a broken law shows first: feet that do not fall at g, and a cadence that does not match
  the body's size. Both are physics rows below, never cues.

**Steering order in humans: Vallis, Patla & Adkin 2001; Hicheur, Vieilledent & Berthoz 2005; Hollands, Patla &
Vickers 2002.** PubMed abstracts, each read whole (S pubmed_abs2.txt:13-37, :53-82, :100-134).
- "the order of control over the body segments was head and trunk reorientation in the direction of travel and
  finally movement of the COM" [read: :30-32]; the head leads the walking direction by ~~about 30 degrees at most~~ [2nd reader: WRONG. 29.75 +/- 7.41 and 30.86 +/- 9.92 degrees are MEANS of the maximum deviation, walking a figure of eight, so many subjects exceed 30; PMID 15936517 abstract, my pm.txt 175-178]
  [read: :77-80]; gaze and head realign to the new path before the turn [read: :121-124].

**Sprint mechanics: Haugen et al. 2019, Sports Med Open, PMC6872694; Morin et al. 2006, Int J Sports Med.**
Haugen: CC BY 4.0 [read: S haugen2019.txt:18-19]; I read the performance-determinants section and the stiffness
paragraph (:86-110, :343-375, :1452-1466). Morin: PubMed abstract, read whole (S pubmed_abs2.txt:149-167).
- Sprinters' reaction time 0.17-0.18 s [read: haugen2019.txt:90]; peak horizontal power up to 36.1 W/kg, "current
  upper limits in humans" [read: :348-349]; the deceleration phase comes with "a reduction in step rate" [read:
  :369-370]; elite contact about 100 ms at top speed [read: :1463-1464]; world-class sprinters run with "considerably
  higher leg stiffness" [read: :1458].
- Repeated 100 m sprints: vertical stiffness -20.6%, step frequency -8.0%, top speed -10.9%, leg stiffness unchanged
  [read: pubmed_abs2.txt:159-163]. Leg stiffness 19.5 kN/m, vertical 93.9 kN/m at 8.1 m/s [read: :155-157].

## (3) The design

### 3.1 The derivation his method asks for

Each item: a capability raised past a human's, and what the laws of motion then change. g = 9.81 m/s^2. The numbers
came from one `node -e` run of the formulas written here (not saved; each is one line of arithmetic to re-run).

- **Grip, mu** (the ground friction it can use). [derived] Max lateral acceleration is mu*g. On a bend, a = v^2/R,
  and the line from stance foot to centre of mass leans atan(a/g): the mean ground force must point through the mass,
  or the body spins. Past mu 1 the lean passes 45 degrees; mu 1.33 allows 53. Speed is held on wide bends (H2,
  [summary: G-loco:122]). The foot lands inside the mass's path by L*sin(lean): 0.78 m for a 0.98 m leg at 53 deg.
- **Grip, the timing.** Greyhounds keep contact timing on a bend; humans lengthen contact and slow [read: H187:67,
  E's reading of the abstract].
- **Peak leg force.** [derived] Over one step, mean vertical force in contact x contact time = m*g x step time. More
  force at the same speed means shorter contact (a lower duty factor) or longer flight (more bounce). Forward, a = F/m
  and the body pitches by atan(a/g) while it accelerates; a stronger body holds that pitch to speeds where a
  power-limited human (36.1 W/kg at most [read: haugen2019.txt:348-349], so a = P/v) is already upright.
- **Leg stiffness, k.** [derived, spring-mass] Contact lasts about pi*sqrt(m/k_vert); the mass drops F_max/k_vert.
  Stiffer: shorter contact, less knee yield in stance, a flatter path. Humans: [2nd reader: DOWNGRADED, these are eight NON-specialised male runners, 8.10 m/s the mean over the whole 100 m, not a top speed; PMID 16475063 abstract] 93.9 kN/m vertical at 8.1 m/s [read:
  pubmed_abs2.txt:155-157]; elite contact about 100 ms at top speed [read: haugen2019.txt:1463-1464].
- **Limb length, L.** A pendulum's swing time grows as sqrt(L/g) [derived]; Alexander's stride law already scales the
  step with hip height (built, [summary: G-loco:67-80]). Cadence is read as size [read: pubmed_abs1.txt:85-88], so a
  long-legged body stepping at a short human's rate reads small or sped up [inferred].
- **Tirelessness.** Humans fade: the deceleration phase comes with a lower step rate [read: haugen2019.txt:369-370];
  repeats cost 8% step rate, 21% vertical stiffness, 11% top speed [read: pubmed_abs2.txt:159-163]. Tireless means
  none of that, ever. No single frame shows it; it is seen only as a rhythm held for minutes [inferred].
- **Reaction time.** [2nd reader: DOWNGRADED. 0.17-0.18 s is world-class sprinters' START-BLOCK reaction time to the gun (Haugen, "start block and reaction"), not a steering latency; the 0.23 s step and the 3.6 m below are unsourced, arithmetic only (9 x 0.405 = 3.65 OK).] Humans: 0.17-0.18 s [read: haugen2019.txt:90], then head, trunk, and the mass last [read:
  pubmed_abs2.txt:30-32], redirected through the next foot placement. At 9 m/s that is about 3.6 m of straight path
  (0.175 s + one 0.23 s step) before the path bends [derived]. A shorter latency shrinks the head's lead and turns the
  body at once [inferred].

What the derivation says about his picks (his picks stand; this is what each needs to obey physics):
- **T1, hunter, grip.** [derived] The cue is speed held round a bend; physics then REQUIRES a lean of atan(a/g). At
  V_o 9, R 6 m: human (H1) 5.98 m/s, lean 31 deg; H2 mu 1.0, 7.67 m/s, 45 deg; mu 1.33, 8.85 m/s, 53 deg (speeds from
  H187's table, [read: H187:235-237]). The lean is not a second cue: it is the cue made visible.
- **T2, interceptor (fast) and stalker (slow), bird head hold.** [derived] A head held still in space while the body
  moves needs neck travel. With 0.15 m of neck travel [inferred, not measured], a hold lasts 150 ms at 1 m/s but 17 ms
  at 9 m/s: at a run, a translational hold-and-thrust becomes ~~a 50 Hz shudder~~ [2nd reader: WRONG inference. 17 ms is how long a 0.15 m hold lasts (arithmetic OK), not an oscillation rate; the hold would recur once a stride (about 4 a second) and be nearly all thrust. The conclusion (no visible hold at speed) stands; the "50 Hz" does not. Also: sibling file scout_upper_body_and_gaze.md:11 already says a pigeon holds head ROTATION, not translation]. So at speed only the ROTATIONAL part is
  lawful (head yaw and pitch locked on the target through the trunk's bank, twist and bounce); the full hold-and-thrust
  belongs to the stalker's slow gait.
- **T4, pack, fixed rhythm.** [derived] If the step rate stays at a jog's 2.8/s while running 7.4 m/s (pack row 0.92 x
  ref 8, G-loco:178), the step is 2.64 m; with 0.9 m of contact (inferred), flight is 0.24 s and the body rises
  6.8 cm each step, three times a human's 2.2 cm at 3.9 steps/s [2nd reader: UNSUPPORTED, no source and no mark for the human's 3.9 steps/s at 7.4 m/s or the 2.2 cm; the 2.64 m, 0.24 s, 6.8 cm and 2.9 weights re-derive correctly from the stated inputs]; mean vertical force in contact rises from 2.1 to 2.9
  body weights. Obeying physics, a fixed rhythm is a BOUND. He rejected the bob for the hunter (195), not for the pack;
  that is his eye's call.
- **T3, sprinter and charger, back flex.** Needs the spine joint (G-loco:157). Not derived further here.
- **Reaction time is ruled out by his own words.** [inferred] A body that turns at once is the "turn on a dime" of 18
  and the lock-on of 88; and he asked for the lean to lead the turn (151) and the look to start at the head (163).
- **Tirelessness has no picture of its own** [inferred]. It is already in the simulation (speed rising with time,
  G-loco:178-179). Do not draw it.

### 3.2 What the code does today at a corner (checked)

- [2nd reader: bullets 1-3 are RE-DERIVED: ChaserPose lean = atan(...) then overwritten by the drawn tilt, G-code:24-25; 1 degree per m/s^2, G-sources:36; outside foot 0.10 m wider, G-code:151 and :30. I opened the code at 31d1c6d: model_rig.cpp:510, world_app.cpp:534 and :582 are exact. OK.] The simulation's own physical lean is computed for every chaser: `atan(a.body.speed * a.body.turn / 9.81f)`
  [read: dz3 game/world/world_app.cpp:534]; `ease_poses` then overwrites it with the drawn tilt:
  `p.lean = e.drawn.lean();` [read: world_app.cpp:582].
- The drawn tilt targets `vel * 0.5f + accel_tilt` in DEGREES, scale 1 [read: dz3 game/model_rig.cpp:510]; so the
  sideways lean is 1 degree per m/s^2 of turning acceleration. Physics at small angles is 57.3/9.81 = 5.84 degrees
  per m/s^2, rising as atan [derived].
- The feet stay where the gait put them, the outside foot 10 cm wider ("ours, no source") [read: model_rig.cpp:430-436],
  and the legs re-reach to those feet [read: :468-475]. So the line from stance foot to pelvis stays near upright
  [inferred].
- At V_o 9, R 6 m [derived]: physics 31 deg (human) to 53 deg (mu 1.33); drawn pelvis 6 to 13 deg; trunk at 0.35, 2 to
  4.6 deg. The drawn lean is about a fifth to a quarter of what the turn requires.
- [inferred] This is the Third Place's reading (TP:936), now checked against code: the body corners at accelerations
  that need a 30-50 degree lean while standing almost upright. By Reitsma 2008 that is the kind of error people see on
  a human figure. His 214 ("the torso doesnt orient itseld into the banking") is consistent with it.
- **A conflict to show, not resolve:** 157 "Keep source, fix sway" kept Overgrowth's tilt; 217 asks that tweaks
  "obeys physics". Overgrowth's 1 degree per m/s^2 is the source's stylised number (its frame divides by the
  character's scale [read: model_rig.cpp:510 comment]); physics asks 5.84. The design below keeps the sourced tilt as
  the upper body's motion relative to the legs and adds only what physics forces at the feet.

### 3.3 The layer

**Inputs.** The chaser's drawn path (DrawnChaser already low-passes its acceleration, `accel_tilt`, half-life 0.1126 s,
Overgrowth's [read: model_rig.cpp:509; G-code:103]). For the player, the PlayerState velocity Body already reads.

**Outputs.** One angle per body per tick, `support_roll` = atan(|a_lateral| / g), signed to the turn [ours: name;
law derived]. `apply_motion` rolls the pelvis and everything above it about the stance-feet midpoint by
(support_roll - the drawn lean) and lets the legs re-reach the feet it already places (the existing `reach_leg`
path). The 10 cm "ours" outside-foot offset is replaced by the roll's own foot-to-pelvis offset [ours]. The upper
body keeps Overgrowth's tilt and the chain shares on top, unchanged.

**Where it sits** (G-code:20-33): computed in `DrawnChaser::step` (game/model_rig.cpp:498), carried through
`WorldApp::ease_poses` and `chaser_poses` (world_app.cpp:567-588, :539-560) as one more ChaserPose field, put into
`GaitMotion` in `WorldStage::place_figures` (stage.cpp:271-278), applied in `apply_motion` (model_rig.cpp:415).
Picture only: it reads the chase and writes nothing back, like everything else in DrawnChaser.

**Where the capability lives.** In the simulation, per kind: mu in the turn law (l182's `turn_law`, G-loco:127-130).
The picture has NO per-kind uncanny parameter for T1: it draws what the path demands. [inferred] That is the
cleanest reading of 217: the strangeness is never drawn in by hand; the law draws it.

**Parameters, few.**
| parameter | default | source |
|---|---|---|
| g | 9.81 m/s^2 | law |
| acceleration low-pass half-life | 0.1126 s | Overgrowth, already in code (kTiltAccelHalflife) |
| roll switch | off until his eye | [ours] |
| per-kind mu (simulation, not this layer) | 1.0 human / 1.33 hunter | H187 §9: 1.0 inferred, 1.33 press [summary] |

**Cost** [inferred, not measured]. Per chaser per sim tick: one `atan2` and a vector length on a value already
computed, under 0.1 microsecond. Per drawn figure per frame: about 15 joint translations before the existing
`reach_leg` calls, under 0.2 microsecond. Against a 3.33 ms frame, unmeasurable; the R4.7-style timing row that
exists nowhere yet (G-physics:259) should include it when one is built.

**Hunter, lesser chaser, player.**
- Hunter: as above, on main's path today; with l182's H2 at mu 1.33 when that lands.
- Lesser chasers (boxes today, G-roster:107-117): the same angle can roll each box about its feet in
  `figure_transform` (stage.cpp:284), one rotation, so the law shows before they have bodies [ours]. [2nd reader: UNSUPPORTED as "one rotation": stage.cpp is under "did not open"; I read it: `figure_transform(Vec3 feet, float heading, float out[12])` (figures.h:44; call stage.cpp:284) takes no lean, so its signature and callers change.] When they get
  models, they run the same `gait_pose` path (G-code:212-226) and inherit it. Their own cues are their picks (T2, T3,
  T4), each a separate channel, never this one.
- Player: the same law in `Body` would replace the unsourced run lean (3 + 9 x pace degrees, G-code:175) with a derived
  one, and put the feet inside the turn under the eye; the camera stays as it is (162: [2nd reader: WRONG attribution, rule 7. brief:1127 is the brief's own unquoted description of his pick "(a) plus the inertia dial", not his words] ~~"The aim and the root stay as
  they are" [read: brief:1127]~~). That serves his 159 ("they should move how a real person would", brief:1120). Not in
  the first lap.

### 3.4 Keeping "one clear cue" honest: the cue ledger

A table per kind, run by the tests, before any clip goes to his eye [ours]. Two kinds of row:
- **Law rows, every kind, always green** (a law is never a cue):
  - L1 support lean: the drawn foot-to-pelvis line within a band of atan(a/g) on bends above 3 m/s^2 (band ours).
  - L2 ~~feet fall at g: a foot's vertical acceleration in flight is g within 5% (ours); the existing "flight rise
    g t^2/8" makes this true for the hunter (G-code:150).~~ [2nd reader: WRONG physics. In the flight phase only the centre of mass (the pelvis) is ballistic; a swing foot is driven by the leg and need not accelerate at g. G-code:150 is the PELVIS rise, and the feet come from Fukuchi curves by FK, so nothing makes the feet true to g. Chang & Troje's "accelerations contained in the foot motions" says feet carry the cue, not that they fall at g. The row should read pelvis vertical acceleration = -g in flight within 5% (sibling scout_evaluation.md P4 has that form).] Why a row: the feet carry the life detector [read:
    pubmed_abs1.txt:25-26, :59-60].
  - L3 cadence fits size: steps per second within 15% of Alexander's law for the body's own hip height (the 15% is the
    header's existing check, G-loco:75). Why: stride frequency is read as size [read: pubmed_abs1.txt:85-88].
- **Human rows, every kind, green except on its one channel:**
  - H-legs and H-arms: the yardstick's existing bars on the kind's own `gait_pose` at 2.5 / 3.5 / 4.5 m/s
    (rms/sd <= 1; elbow and shoulder bars) (G-loco:203-204). The yardstick already calls `gait_pose` directly
    (G-code:338).
  - The cue channels, one per trait: C1 speed held on a bend vs H1 at the same radius (T1); C2 head angular velocity in
    the world vs the trunk's (T2); C3 trunk sagittal flex per stride (T3); C4 slope of cadence against speed (T4).
- [2nd reader: the gate passes a kind whose gait is wild at its real speed. The human rows run at 2.5-4.5 m/s while the hunter runs 9-13, so green says nothing about the speeds that matter; C2 and C4 have no sourced human band, C3 none at all (as the scout admits). So "everything else still scores as human" is unchecked above 4.5 m/s until the stomp branch's Dorn rows exist on main. Add: run every human row on the hunter at the speeds it actually runs, or mark the gate PARTIAL.]
- **The gate:** a kind passes when every law row is green, every human row is green, and EXACTLY ONE cue channel is out
  of the human band, by its stated amount. Zero out = it reads human (214's complaint). Two out = two cues, against
  169's "one clear cue" and E's reading that one strong cue beats many weak (H187:147).
- **What it cannot do, said plainly:** the yardstick stops at 4.5 m/s and cannot score bends (G-loco:208-221). At the
  hunter's 9-13 m/s the human rows rest on Dorn's runner rows on the stomp branch (G-loco:205-206) and the law rows.
  C3 has no human band from a source I read: Ford and Perpiñá give twist, not flex (G-sources:208-209). No row says
  "creepy"; the ledger only proves he is looking at one cue on an otherwise lawful human.

## (4) The first lap

**Smallest piece:** the law row L1 for the hunter, and the roll behind a switch, off by default.

**Files** (dz3, after l205-stomp-c lands, since both touch apply_motion; G-physics:231-232):
- `game/tests/world_app_tests.cpp`: a new row beside `the_hunters_lean_peaks_at_or_before_its_turn_does` (:1160).
  It uses `hunter_lean_trace` (:919), the flee bot's 60 s on seed 1 at the hardest level by default, or his kept run
  by `DZ_LEAN_RUN`. Per frame it takes `pos` and `speed` (LeanFrame, :908-914), low-passes the acceleration with
  the same half-life, and needs one more field: the angle of the drawn stance-foot-to-pelvis line (added to LeanFrame
  from the posed figure). Name [ours]:
  `on_a_bend_the_hunters_body_leans_as_far_as_its_turn_needs_from_the_feet_up`.
- `game/model_rig.h`, `game/model_rig.cpp`: `DrawnChaser` gains the support angle; `GaitMotion` gains `support_roll`;
  `apply_motion` rolls about the feet when it is set.
- `game/world/world_app.{h,cpp}`, `game/world/stage.cpp`: carry the field; the switch, like `ease_on_`.

**The row, red today, green after** [ours: the bars]: over every corner with a peak lateral acceleration of 3 m/s^2
or more, the median of (drawn foot-to-pelvis lean / atan(a/g)) is between 0.8 and 1.2.
- [2nd reader: the row can be passed without doing its job. (a) It measures a foot-to-pelvis LINE, so splaying the stance foot outward by L sin(atan(a/g)) (0.78 m at 53 degrees) turns it green with the body upright and the feet skating wide. (b) The roll is set from the same low-passed acceleration the row divides by, so green is by construction, and the 0.8-1.2 band tests the code against itself, not against what a viewer sees. (c) "Stance foot" is undefined in flight frames and the figure is only posed in WorldStage, so the test must call gait_pose itself. (d) The 0.2 below is the pelvis's own tilt (6/31), a different quantity from this line, which is near 0 plus the 10 cm offset today; the red value is unknown. Fix: also require trunk lean and foot placement both within band, and score the hunter's own corners, not V 9, R 6.] Red on main [inferred, from 3.2's arithmetic; not run]: about 0.2 (the drawn pelvis takes 1 degree per m/s^2, and
  the feet stay under it).
- Green with the switch on: the roll supplies the difference by construction; the row guards the sign, the timing
  (the existing lead row must stay green: the angle comes from the same low-passed acceleration, so it cannot lag the
  tilt), and that no corner overshoots.
- With the switch off the row REPORTS and does not gate, as `the_hunters_drawn_lean_on_a_straight_pending_L182` does
  (G-code:318-319).
- Also: his 16 kept runs byte-identical (picture only, G-roster:51); existing model_rig and world_app rows green.

**Tier:** "check it" by the CLAUDE.md rule (behaviour a person sees); the row is new because the lean against physics
cannot be seen by looking at a number-free clip [inferred]. The lap's naming of its tier is the dispatcher's.

## (5) What only his eye decides, and the fewest clips

His eye decides (G-words:5, "his eye decides the look"):
1. Whether the hunter leaning as far as its turn needs reads creepy or only athletic.
2. The amount: mu 1.0 (45 degrees at the limit) or 1.33 (53 degrees); "how monstrous" (H187:225).
3. Whether a body that leans 50 degrees through a doorway, its head swept inside the frame, is wanted. [inferred: at
   H2 the tight turns are grip-bound, so they lean as far as the wide ones.]
4. Later, for the pack: whether the bound that a fixed rhythm implies (3.1) is wanted.

**The fewest clips: one page, one corner, three columns, two views** [ours]:
- the same corner of one kept run, look-behind (V) and outside, at full frame rate and lit (the ruling at brief:1606);
- column 1 as built on main (with the stomp fix, so the "before" is not older than a fix he has seen, item 216);
- column 2 the roll on, the path as main's simulation runs it;
- column 3 the roll on, with l182's H2 at mu 1.33 (only once that branch is ready; until then two columns);
- each column labelled with its peak lateral acceleration, required lean and drawn lean.
- This joins the trunk-share clip already ruled for pane C (0.35 / 0.7 / 1.0, brief:1598): the same corner, so he
  sees one page, not two.

## (6) What I would NOT build, and why

- **Physics-breaking motion as a cue** (floating, feet that do not fall at g, sliding feet). On a human figure it is
  seen and read as an error (Reitsma 2008 abstract; Vicovaro :274), and the feet carry the life detector (Chang &
  Troje). It would read as a bug, not a creature [inferred]. [2nd reader: DOWNGRADED. Both sources measure detection of edits, not eeriness or "bug versus creature", and Vicovaro's own line :274 reports similar human and ramp sensitivity. The conclusion may be right; no read source tests it.]
- **Uniform "slightly off" motion** (detuning, asymmetric phase, noise on every joint). Movement gradients make no
  valley (Thompson; Kätsyri :916-920), and he rejected its forms (163, 195).
- **A reaction-time cue** (instant turns, no head lead): against his 18, 88, 151 and 163.
- **A tirelessness picture** (breathing, posture): it has no frame of its own; it is in the simulation already.
- **Limbs that change length during motion:** up to 20% goes unseen when the eye is elsewhere (Harrison :17), and
  growth that is seen reads as an error. Static proportion is the model's job (the hunter is already 2.15 m, arms to
  the knee, G-roster:111-112).
- **A per-kind "uncanny" dial in the picture.** The capability lives in the simulation; the picture obeys the law.
  One dial per kind in the picture would be the home-made lean of 153 again.
- **A table or score for "creepy".** His eye decides it (G-words:5); the ledger only proves one cue.
- **Translational bird-head hold at running speed:** at 9 m/s it is a 17 ms hold, a shudder (3.1). Rotational only.
- **Replacing Overgrowth's tilt with physics in the upper body:** that is against 157 unless he picks it on the clip;
  the roll at the feet is the smallest change that obeys 217 and keeps 157.

## What I did not open

- Thompson 2011's full text (paywalled; no open copy found). Reitsma & Pollard 2003 and Reitsma et al. 2008 full
  texts (not found open). Jokisch & Troje 2003, Troje & Westhoff 2006, Chang & Troje 2009, Vallis 2001, Hicheur
  2005, Hollands 2002, Morin 2006 beyond their abstracts. Usherwood & Wilson 2005 and Wilson 2013 (the room's
  abstracts only). Weyand 2000 (403 for the room; I did not retry). Farley & González 1996 (my search found nothing).
- Vicovaro 2014's Experiments 1-3 methods and results tables; Burleigh & Schoenherr 2015's results sections and
  Experiment 2 methods; Haugen 2019 beyond the sections cited; Veto et al. 2017 beyond lines 55-90 (cited nowhere
  above for that reason).
- In dz3: `game/world/stage.cpp`, `body.cpp`, `camera.cpp`, any branch (l182, l205, l185), any test body other than
  world_app_tests.cpp:908-919 and :1160-1180. Whether the drawn pelvis's own bank shows on the mesh (C's note,
  brief:1596) was not checked.
- The hand-backs other than H187 (lines 1-269 seen in part: 6-67, 100-269); the plans for L181, L182, L193; the
  brief beyond items 166-169 and 214-217 and the lines the ground files cite.
- No clip, page or capture; nothing was built, run or timed. Every figure for the code is read or derived, not
  measured.

## Second reader

Method: I re-fetched the four PMC papers (Europe PMC XML, my own conversion, no width cuts) and the eight PubMed abstracts
(efetch), converted the scout's Vicovaro and Harrison PDFs myself with pdftotext, read the Reitsma abstract from the saved
publisher page, and opened the code at dz3 main 31d1c6d and the brief, H187, TP and ground files at the cited lines. My
conversions are in the session scratchpad `sr_unc/`. Line numbers below are the scout's lines in this file or its S files
where I checked them; the evidence column gives my own line where it differs.

| line | claim (under 15 words) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 3 | Lawful body doing more is read as real, +108% | Vicovaro PDF | WRONG | ball speed raised, body unchanged; distance, not body |
| 4 | Physics-breaking read as error, more on humans | Reitsma abstract | DOWNGRADED | "some types of errors"; prep mismatch not the cause |
| 4 | Eeriness rises past familiar range | Burleigh XML | DOWNGRADED | static morphs of made-up creatures |
| 8 | Hunter drawn at 1 degree per m/s^2 | model_rig.cpp:510 | OK, RE-DERIVED | G-sources:36 already holds it |
| 9 | At his picked cue grip 1.33 | brief:1150, G-loco:125 | DOWNGRADED | he picked H2; 1.33 is E's press figure |
| 12 | Row red today on flee bot seed 1 | scout s4 itself | UNSUPPORTED | "not run"; V 9, R 6 assumed |
| 29-35 | His items 167, 168, 214, 215, 217 verbatim | brief:1143-1607 | OK | all match; 167 starts after "well see," |
| 54-57 | E read Katsyri, Saygin full, Thompson abstract | H187:122-133 | OK | exact |
| 78-80 | TWO mismatch hypotheses new to the room | Katsyri XML; H187:128 | RE-DERIVED | H187:128 quotes H4a and H4b |
| 79 | Katsyri licence CC BY 4.0 | PMC page text | OK | by/4.0 link in the copy; Europe PMC XML says "CC BY" |
| 81-82 | Sensitivity grows with realism, "exponentially" | Katsyri Discussion | DOWNGRADED | authors' "would suggest"; faces; 1 of 4 contrary |
| 83-85 | A dynamic atypical feature counted | Katsyri Discussion | UNSUPPORTED | review says only static stimuli |
| 86-87 | Burleigh: extrapolated, easy yet more eerie | Katsyri; Burleigh | OK | both quotes match |
| 88-89 | Refined hypotheses static only | Katsyri Discussion | OK, RE-DERIVED | H187:127 |
| 93-94 | Saygin 20 adults, one out, same moves | Saygin XML | OK, RE-DERIVED | H187:137-139 |
| 96-99 | Authors expect narrow tuning, name conspecifics | Saygin Discussion | DOWNGRADED | "We speculate"; "should explore whether" |
| 92 | Saygin licence CC BY-NC 3.0 | Saygin XML | OK | by-nc/3.0; non-commercial, fine for ideas only |
| 102-107 | Thompson abstract: monotonic, three features | PubMed 21936298 | OK | text matches |
| 108-111 | Monotonic is not no-effect; room read weak | H187:132, :168 | DOWNGRADED | E held lower affinity; "weak" meant no valley |
| 121-123 | +108% correct half the time; -24% | Vicovaro PDF 722-723 | OK | numbers match |
| 124-125 | Heuristics may overshadow gravity bias | Vicovaro PDF 829 | OK | matches |
| 126-127 | Reitsma restated, humans more sensitive | Vicovaro PDF 833-839 | DOWNGRADED | same line: own data similar, "unexpected" |
| 133-134 | Higher sensitivity to some errors on humans | Reitsma abstract | OK | "no evidence" for prep mismatch is omitted |
| 140-146 | Burleigh quote, stimuli, categorisation | PMC4300869 | OK | quote exact; CC BY 4.0 |
| 150-151 | 3% attended, over 20% unnoticed | Harrison PDF 24-25 | OK | abstract; one stick arm, distractors |
| 150 | Growth seen sooner, 6.9 vs 19.7% | Harrison PDF 125 | OK | one condition |
| 152 | Attention goes first to humans | Harrison PDF 219 | DOWNGRADED | citation of Rensink 2002, not a result |
| 158-160 | Feet carry direction and inversion effect | PMID 16631591, 19271889 | OK | quotes exact |
| 160-161 | High stride frequency read as smaller | PMID 12803534 | OK | dogs, point-light displays |
| 167-169 | Steering order head, trunk, mass | PMID 11374079 | OK | walking, head perturbed |
| 168 | Head leads by about 30 degrees at most | PMID 15936517 | WRONG | means of maxima 29.75 +/- 7.41; walking |
| 174-176 | Haugen: 0.17-0.18 s, 36.1 W/kg, step rate | PMC6872694 | OK | exact; 36.1 is one highest value |
| 176 | Contact about 100 ms at top speed | PMC6872694 | DOWNGRADED | via Mennea drills "very similar" to elites, cited [24] |
| 178-179 | Morin: -20.6, -8.0, -10.9 %; 19.5, 93.9 kN/m | PMID 16475063 | OK | non-specialised runners, 8.1 m/s mean |
| 188-191 | mu 1.33 gives 53 degrees; 0.78 m; speeds | arithmetic; H187:235 | OK | atan(1.33)=53.1; 5.98, 7.67, 8.85 |
| 207-210 | Reaction time 0.175 + 0.23 s = 3.6 m | Haugen; arithmetic | DOWNGRADED | start reaction; step time unsourced |
| 216-220 | Bird head hold 150 ms vs 17 ms, 50 Hz | arithmetic | WRONG | the 50 Hz: a hold time is not a frequency |
| 221-225 | Pack bound 6.8 cm, 2.9 weights | arithmetic | DOWNGRADED | inputs re-derive; human 3.9/s and 2.2 cm unsourced |
| 234-237 | Code lines 534, 582, 510, 509 | dz3 main 31d1c6d | OK, RE-DERIVED | all exact; G-code:24-25 |
| 243-244 | Drawn 6-13, trunk 2-4.6 degrees | arithmetic, kBank shares | OK | 1.0 and 0.35 of 6 and 13 |
| 258 | Support angle = atan(a/g) | derivation | OK | the standard mean-force result; no source given |
| 290-291 | Boxes roll in figure_transform, one rotation | figures.h:44 | UNSUPPORTED | signature has no lean |
| 295 | 162 quote "aim and root stay" | brief:1127 | WRONG | brief's words, not his |
| 303-305 | L2 feet fall at g | model_rig; G-code:150 | WRONG | only the centre of mass is ballistic |
| 338-340 | Row red 0.2 today | model_rig.cpp:546-565 | UNSUPPORTED | measures a different quantity |
| 313-319 | Gate: one cue out, rest human | yardstick ground files | DOWNGRADED | human rows stop at 4.5 m/s |

Tally of 46 rows: OK 24, DOWNGRADED 12, WRONG 5, UNSUPPORTED 4, RE-DERIVED 1 (a row that is only that; 4 more OK rows are also RE-DERIVED).
RE-DERIVED items in all: 7 (two hypotheses H187:128; static-only H187:127; Saygin facts H187:137-139; Thompson direction
H187:132, partly; the lean overwrite G-code:24-25; 1 degree per m/s^2 G-sources:36; outside foot 10 cm G-code:151).
Sibling overlap, not counted: rotational-only head hold, scout_upper_body_and_gaze.md:11; the flight row, scout_evaluation.md P4.

The design, built to pass without doing what it is for: the first row goes green by splaying the stance foot (body
upright), and again by construction because the roll and the row share one acceleration. Mechanisms with no source: the
roll about the "stance-feet midpoint" is marked [ours] but is ill-defined in running (one foot carries the load); the
0.8-1.2 band is marked [ours]; the neck travel 0.15 m and contact length 0.9 m are marked inferred. Unmarked and
unsourced: the human's 3.9 steps/s and 2.2 cm; the 0.23 s step; the claim that L2 holds "for the hunter".

What the scout missed that bears on its aim: neither of us read any study of a lawful-but-beyond-human body, so "superhuman
reads as real" has no support. Kätsyri's H4b (atypical features on human figures read worse) points the other way for a
body that is exactly human except one feature, which is the owner's plan. Also: T1's sourced cue (Usherwood & Wilson,
contact timing kept on a bend, H187:67) is not a lean at all, so the first lap supplies a missing law for every body and may
make the hunter read more human, not less (the scout lists this as his eye's call, item 1).

What I could not check: Thompson 2011 full text (paywalled); the feature names "disarticulation, jerk, phase" (scout marks
[summary]); Vicovaro Experiments 1-3 tables; Reitsma 2008 and Reitsma & Pollard 2003 full texts; Mäkäräinen 2014 (my search
returned nothing, so whether its stimuli moved is open); Burleigh Experiment 2; the Usherwood & Wilson, Weyand and Wilson
abstracts; whether the stance foot lies under the drawn pelvis in a posed figure (needs a run, which rule 1 forbids); the
cost figures (nobody measured); the scout's S-file line numbers (I checked content against my own conversions; some of its
line numbers sit a line or two off in wrapped text); Chang & Kram 2007's actual human lean angle on a bend, which would
test row L1's band against a real runner.
