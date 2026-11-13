# Scout: gaits for any body (the footfall generator), 2026-11-13

1. The room already has the stride law (Alexander, from each body's own hip height), the gait-change Froude numbers, a
   human running leg fitted to recorded runners, and a trait catalogue; it has NO footfall clock and no four-limb gait.
2. New at source: a hyena gait study (lateral sequence, lateral couplets, long-forelimb duty factors, transverse gallop,
   straight back), human hands-and-feet gaits, a stalking cat's crouch, the human walk-run Froude 0.5, Spore's gait system.
3. Design [ours]: one pure `gait_plan` turns (limb lengths, speed, acceleration, gait name) into per-limb stance windows,
   footholds and the body's height and pitch; the upright run and the hyena stalk are two rows of one table.
4. First lap: a per-chaser gait clock at the 240 Hz tick plus `gait_plan` with footholds held from touchdown; its red row is
   the hunter's planted foot sliding on a recorded run (to be measured on main before code; it overlaps C's L205).
5. His eye decides the stalk's posture, its footfall rhythm and the rise; three clips are enough. Not built: optimised or
   learned gaits, motion matching, spine flex for the hunter, more than four limbs.

Marks: [read] I opened it; [summary] a ground file or other secondary account; [inferred] mine; [ours] a proposal;
[computed] a law evaluated by me (`scratchpad/gaits/tools/calc.js`, node, under a second). Record paths are relative to
`C:/Users/nname/Desktop/lighthouse/exo_memory`. Game code is dreamzone-3 `main` at 31d1c6d [read: `git log -1 main`]
unless a branch is named. "G-x" = the ground file `loop/animation_system_2026-11-13/ground_x.md`. Brief = `briefs/
dreamzone2_the_game.md`. Nothing was built, run or committed; the only file written is this one.

## 1. What the room already has for this aspect

His words that set it (verbatim, from the brief):
- 207: "there should be a stealth mode of animation, moving like an alien hyena or some shit" [read] brief:1554.
- 208: "and then in that split second you see it, it turns up right and starts running like a human" [read] brief:1558.
- 206: "i just dont want an OP undetectable hunter abusing the runner, they should know where it is most of the time or that
  is the goal" [read] brief:1550.
- 153: "well why the fk did we do all the research just to ignore it and do our own thing????????????????" [read]
  brief:1109. 217: "we get the a good metric for a really human looking sprint which we had, and then we tweak it from
  there to look uncanny in a realistic way that obeys physics" [summary] G-his_words:544-546.
- The brief's own note under 207: "No source on a hyena's or any stalking animal's gait has been read." [read]
  ~~brief:1554~~ [2nd reader: brief:1556; line 1554 is the item's quote, 1556 its "What the room holds" line; sed -n 1554,1556p] (the item's "What the room holds" line). That gap is what section 2 fills.

Laws and code already in place:
- Stride law: step = 1.15 h (v^2/gh)^0.3, h = hip height, via Mazzetta & Blanco quoting Alexander 1976 [summary]
  G-locomotion:69-81. On main as `stride_step` [read] game/model_rig.cpp:695-698; hip height from the rest joints
  [read] model_rig.cpp:725-730; phase per metre "two steps a turn" [read] model_rig.cpp:734-735.
- Gait-change points: mammal walk to trot at s/h 2.0 (Fr about 0.63), trot to run at 2.9 (Fr about 2.2); human walk-run
  Fr 0.5 was a search summary only [summary] G-locomotion:84-88. No gait switch exists in code [summary] G-locomotion:88.
- ~~Duty factor matched at equal Froude~~ [2nd reader: DOWNGRADED. p-l187:35 says humans walking in SIMULATED REDUCED GRAVITY, Fr 0.1-0.4: duty factor matched within 2%, but relative stride length "differed by as much as 67 %" and they "reject" the law for stride. The scout kept the half that favours the design and dropped the half that bears on the stride law it uses for every row.] in Donelan & Kram 1997 (read in full by E) [summary] handback/p-l187-animal-
  locomotion-E_2026-11-12.md:35 (I opened that hand-back whole; its own sources are its marks).
- Running legs fitted to Fukuchi 2.5-4.5 m/s, stance share `kStanceShare` 0.36 - 0.03 per m/s [read]
  game/model_rig.h:384-389; the pelvis rides the deeper leg, flight rise g t^2/8 [read] model_rig.cpp:764-781.
  Two-law pelvis and Dorn's sprint legs only on `l205-stomp-c` 900e3c4, unpushed [summary] G-locomotion:99-116.
- Traits: T1 greyhound cornering, T2 bird head, T3 galloping back flex (needs a spine joint), T4 insect fixed rhythm,
  T5 big-cat stalk "no source found" [summary] G-locomotion:151-162. His picks per kind [summary] G-locomotion:164-169.
- Heglund & Taylor 1988 (abstract): equivalent speeds scale as about M^0.2, frequencies as M^-0.15; Full & Tu 1991
  (abstract): insects speed up by stride length, frequency nearly fixed [read] p-l187:36, :156.
- The player's body has its own unsourced clock: `stride_rate x sqrt(speed)` and a duty factor "0.62 - 0.37" with no
  citation [read] game/body.cpp:126-131, game/camera.cpp:177. G-code calls the player's run "almost wholly unsourced"
  [summary] G-code:184-185.
- The hunter's stride phase is one float in the stage, advanced by the FRAME's delta [read] game/world/stage.cpp:269;
  only the first Hunter gets a model, every other chaser is a box [read] stage.cpp:267, :283-287. The crawler box is
  "on all fours, under a metre" [read] game/world/figures.h:11. A per-id table already exists for `DrawnChaser`
  (`WorldApp::ease_poses`) [read] game/world/world_app.cpp:567-572; G-code:225-226 names it as the pattern to copy.
- The chase's own gaits are Mesh, Ladder, Drop, Recover, Climb, Off [read] chase/chaser.h:59-66; the drawn pose
  handles run and stand only [summary] G-code:63.
- Physics layer, ragdoll, soft key: picture-side, upper body only, not for locomotion [summary] G-physics:59-79.
  The room ruled physics-balanced locomotion out ("research only, no shipped source") [summary] G-physics:238.
- Frame budget: about 1.2 ms of p99 headroom at 3.33 ms; both skinned models cost +0.39 ms average on the GPU
  [summary] G-constraints:24-31. No CPU cost of any pose function has been measured [summary] G-constraints:202.

Gaps the ground files name and I needed: no quadruped footfall source, no stalking gait, no runtime gait generator read,
Alexander & Jayes 1983 unread (403). I re-tried A&J 1983 at Wiley: an HTML wall again, not the paper.

## 2. What I read at source that is NEW

Rule 5 note: every item below is used for its IDEA or its published FIGURES (measured facts restated as constants, as
the room already does). No text, figure image, code or data file is copied. Where I give a licence it is for the record.

### 2.1 Spoor & Belterman 1986, "Locomotion in Hyaenidae", Bijdragen tot de Dierkunde 56(1):24-28 [read, whole]
URL https://repository.naturalis.nl/pub/503981/BD1986056001002.pdf (pdftotext). Licence: not stated in the PDF; I did not
read a repository licence page. Use: idea and figures only.
- Method: 16 mm film at 64 frames a second, Hildebrand's gait analysis; spotted hyena 15 walking fragments (4 adults),
  6 galloping; striped hyena 7 walking [read] p.24-25, Material and Methods.
- Walk: "lateral sequence ... and lateral couplets"; speed about 3-6 km/h, each stride 1.00-0.66 s; the limb phase (fore
  footfall after the hind on the same side, % of stride) is 13-18 for the spotted hyena, 9-11 for the striped [read] p.25,
  Results, Symmetrical gaits. Fig. 1A, the spotted hyena's walk: gait formula "(59/66,14)" = hind duty factor 59, fore 66,
  limb phase 14 [read] p.25, Fig. 1 caption.
- Fore feet stay down longer: fore duty factor 104-120% of the hind's (spotted), and the gap grows with speed [read] p.25.
- "Running symmetrical gaits (duty factors smaller than 50) were not observed." When they speed up "the walk abruptly
  changes into a slow gallop" [read] p.26. The gallop is transverse; a half-bound (hind footfalls together) starts it from
  rest [read] p.26, Asymmetrical gaits.
- Fig. 1C, the transverse gallop: "hind duty factor 42, fore duty factor 52, hind lead 49, fore lead 51, midtime-lag 33";
  9-15 km/h, strides 0.53-0.42 s; at the two highest speeds "a gathered suspension of 5-6% of the stride" [read] p.25-26.
- Why it looks the way it does: "the awkward look of galloping hyenas ... is due to the lack of bending movements of the
  spine in combination with the long neck. During the whole stride of the gallop hyenas keep their back and long neck
  almost in a straight line" [read] p.27, Discussion. The centre of mass sits forward (heavy forequarters) [read] p.27.
- Lateral couplets "are often used by long-legged mammals to avoid interference between the fore and hind limbs" [read]
  p.26, Discussion.

### 2.2 Shapiro, Cole, Young, Raichlen, Robinson & Adolph 2014, PLOS ONE 9(7):e101758 [read, whole text]
URL https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4100729/fullTextXML. Licence as printed in the article: "Creative
Commons Attribution License, which permits unrestricted use, distribution, and reproduction in any medium, provided the
original author and source are properly credited" (CC BY). Commercial use allowed with credit; no share-alike. I read the
licence line in the article, not the CC deed. Use: idea and figures only.
- 513 strides of ~~five adults walking on hands and feet~~ [2nd reader: DOWNGRADED. The five are siblings with Uner Tan syndrome (ages 14-32, "impaired cognitive abilities ... cerebellar hypoplasia, and habitual quadrupedal gait on hands and feet"), taken from a television documentary filmed at 25 frames/sec, overground; Methods and Introduction. Not a sample of ordinary adults, and the strides were not measured at known speeds ("not able to measure stride length"). Primary: Methods, "Family A" and Discussion.]: 98.6% lateral sequence; of those 85% lateral sequence diagonal
  couplets (LSDC), 12% lateral couplets (LSLC), 3.5% singlefoot [read] Results, "Family A", Table 2.
- Limb phase bands (Cartmill's): 0-25% LSLC, 25-50% LSDC, 50% trot, 50-75% DSDC (the primates'), 0/100% pace [read]
  Methods, "Quantification of footfall sequence". Walking = mean duty factor >= 50% [read] same section.
- Two worked strides: LSDC limb phase 0.36 at duty factor 0.75; LSLC limb phase 0.20 at duty factor 0.61 [read] Fig. 2.
- Faster means lower limb phase [2nd reader: DOWNGRADED, "for three of the individuals in our study", not all five; speed is inferred from duty factor, never measured]: "at higher speeds (lower duty factors), LSDC gaits transitioned into LSLC gaits" [read]
  Results, Fig. 5 text. Healthy adults on hands and feet: limb phases about 12-32% (Patrick et al., as they read it)
  [read] Discussion.
- The cause: long human hind limbs make the same-side fore and hind limbs interfere; lateral couplets avoid it; hands and
  KNEES shortens the hind limb and moves people toward diagonal couplets [read] Discussion.

### 2.3 Trank, Chen & Smith 1996, J Neurophysiol 76(4):2316-26 [read abstract only; full text behind a bot wall]
PubMed E-utilities, PMID 8899606. Licence: © American Physiological Society, not read. Use: figures only.
- Eight cats on a treadmill at 0.5-0.6 m/s under a low ceiling: "each cat lowered its entire body keeping its trunk
  horizontal"; "the head was lowered, with the top of the head in line with the dorsal surface of the trunk"; "Hip height
  ... was reduced by 30%"; cycle 766 +/- 30 ms with "swing (30%) and stance (70%)" the same as normal walking; knee and
  ankle "more flexed by 41-45 deg" through stance [read] abstract points 2, 3, 5.
- "Crouched walking requires a postural change that typically occurs when cats stalk prey" [read] abstract point 7.
  This is the first read source for the room's T5 "big-cat stalk", which the catalogue had as unsourced.

### 2.4 Kram, Domingo & Ferris 1997, J Exp Biol 200:821-826 [read abstract; PMID 9076966]
- Humans and other bipeds "switch from a walk to a run at different absolute speeds but at approximately the same Froude
  number (0.5)", with Fr = v^2/(g L), L = leg length; it held in simulated low gravity [read] abstract. This upgrades the
  room's "search summary only" (G-locomotion:86-87) to an abstract read. © Company of Biologists.

### 2.5 Heglund, Taylor & McMahon 1974, Science 186:1112 [read abstract; PMID 4469699]
- The trot-gallop transition "can be used as an equivalent speed for comparing animals of different size"; it comes at
  lower speeds and higher stride frequencies in smaller animals [read] abstract. No constants in the abstract.

### 2.6 Lizards that rise onto two legs when they accelerate [read abstracts only]
- Aerts et al. 2003, Phil Trans R Soc B 358:1525 (PMID 14561343): with the centre of mass toward the rear, accelerating
  "might result in a lift of the front part of the body"; their model gives "an important lift of the front part of the
  body ... as a consequence of the acceleration" [read] abstract.
- Clemente 2014, Evolution 68:2171 (PMID 24820255): 124 species; "a significant acceleration threshold between bipedal
  and quadrupedal runs" [read] abstract. [2nd reader: DOWNGRADED. The 124 species are the centre-of-mass survey; the
  threshold comes from "racetrack trials", number not in the abstract; and morphology explains only 56% of the
  thresholds, "dynamics have a significant influence". Also every lizard here has its mass REARWARD ("a significant
  rearward shift among bipedal lineages"); Aerts's own model needs the caudal centre of mass. See 3.4.] Clemente & Wu 2018, J R Soc Interface 15:20180276 (PMID 30257922): angular
  acceleration of the trunk about the hip predicts extended bipedal running [read] abstract. Full texts: Europe PMC
  returned errors; not read. Use: the idea only. This is the one read mechanism for item 208's rise.

### 2.7 Hecker et al. 2008, "Real-time Motion Retargeting to Highly Varied User-Created Morphologies" (Spore) [read, whole]
URL https://www.cse.chalmers.se/edu/year/2011/course/TDA361/Advanced%20Computer%20Graphics/027-hecker%20copy.pdf (a
course copy; the author's draft page is chrishecker.com). Licence: ACM copyright notice, personal and classroom use;
idea only, never code.
- Section 4.2 "Gaits", "Leg Groups": legs "clustered into one or more groups of roughly equal length", their length ratios
  approximated "with small rational numbers ... used to compute the relative frequency of the gait cycle applied to each
  group" [read].
- "Foot and Hip Posing": per foot a duty factor and a "step trigger", "the offset from the overall gait cycle at which the
  foot begins its particular cycle"; "The hips are translated and rotated as the feet are moved"; the swing path is
  authored in a normalised space and scaled "taking into account the leg length" [read].
- "Gait Styles": animators map speed to gait parameters; extra styles layer on ("limping, or a lumbering gait"); different
  leg groups may be in different gaits at once [read].
- Their own limit: "how to provide believable locomotion with anticipation in the face of discontinuous player and code
  inputs" [read] ~~section 7, Future Work~~ [2nd reader: WRONG section. The paper has no section 7; the sentence closes "Future Work" inside section 5, "Results and Discussion". The words are exact.].

### 2.8 Wampler & Popović 2009, "Optimal Gait and Form for Animal Locomotion", SIGGRAPH [read, whole]
URL https://grail.cs.washington.edu/wp-content/uploads/2015/08/wampler2009oga.pdf (author copy). © ACM; idea only.
- Foot timing as data: one contact interval per foot per cycle, "a single variable controlling the overall period" plus
  per foot "the start time and duration of the foot's contact interval, both measured as fractions of the gait's period"
  [read] section 4. The same representation as Spore's duty factor plus step trigger, and as Hildebrand's gait formula.
- Cost and limits: one spacetime solve takes "around a minute" to "10-20 minutes" for a horse, ~~run on a cluster~~ [2nd
  reader: DOWNGRADED. Section 5 puts the cluster on the outer morphology search ("In the Basin-CMA computation these
  spacetime optimizations are run in parallel on a cluster"), not on the single gait solve. Section 6 also says the method
  "can easily be used to optimize over a reduced subspace of all possible foot timings, so an artist can design some
  aspects of a gait": the scout's section 6 does not mention it]; "we were
  not able to obtain, for example, a gallop gait for the horse" [read] section 5 [2nd reader: it is in section 6, Results; they got "a four-beat phase shifted trot"].
- Their objective penalises head translation across the travel direction and keeps the head facing the travel [read]
  section 3 (objective terms).

### 2.9 Open code: `majidmanzarpour/threejs-procedural-spider` at 763f814 [read: LICENSE, src/spider/Spider.js]
Licence read in full: MIT ("Copyright (c) 2026 Majid Manzarpour"; LICENSE at the commit). Commercial use allowed; the
notice must ship with any copy; no share-alike; redistribution allowed. We would use the IDEA, not the code (it is JS).
- A phase clock plus reach triggers: `const freq = this.baseFreq * act; ... this.gaitPhase = frac(...)` [read]
  Spider.js:523; per-leg offsets in a wave, `{ az: 0.50, off: 0.50 }, { az: 1.12, off: 0.33 }` [read] Spider.js:121.
- A leg asks to step when its phase passes the duty factor, or it drifts too far from home, ~~or it over-reaches~~ [2nd
  reader: DOWNGRADED. Line 537's test is `phaseDue || dHome > this.stepThresh || outSec`; over-reach (`reachFrac > 0.9`) only adds +3 to the request's priority] [read]
  Spider.js:536-537; duty 0.7, base frequency 1.55 [read] Spider.js:66.
- Stride from speed over frequency, swing time from (1 - duty) / frequency [read] Spider.js:525-526.
- "Cruse rule 1": a leg does not lift while a neighbour is in the air, waived in an emergency [read] Spider.js:546.
- Swing arc: eased lerp plus a sine lift [read] Spider.js:576. It walks walls by stepping on any surface normal.
- Also found, NOT usable: `PhilS94/Unity-Procedural-IK-Wall-Walking-Spider`, no licence in the GitHub API answer, so study
  only; `jarllarsson/promenade` licence "NOASSERTION". Neither opened.

### 2.10 The hunter's own limbs, read from its model [read: content/models/hunter.glb skin, my node script]
Inverse bind matrices of the skin, rest pose, metres, Y up (script `scratchpad/gaits/tools/joints.js`, read-only):
- thigh 0.621, shin 0.501, ankle 0.091; hip height 1.196 (thigh head over the ball joint) [computed].
- upper arm 0.490, forearm 0.461, wrist to `middle_03` 0.208: shoulder to fingertip joint 1.159; standing shoulder-to-hip
  rise 0.572 [computed]. So its forelimb is as long as its hind limb: a long-armed body, like the hyena's long forelimbs.
- This disagrees with the record's "hip height 0.984 m" measured on add21fe [summary] G-sources:266. I did not reconcile
  it; the builder should read `gait_hip_height(hunter rest)` once before trusting either.
  [2nd reader: RECONCILED, and the scout's 1.196 is OK. I re-derived it from the same skin (inverse bind positions:
  thigh_l y 1.206, ball_l y 0.010, so hips over lowest foot joint 1.196; upper arm 0.489, forearm 0.46, shoulder-hip rise
  0.572, all match). The 0.984 is not the hunter: it is the TEST skeleton's, `game/tests/model_rig_tests.cpp:737-738` on
  main, "hips at 0.98 m over the lowest foot joint ... h = 0.984 m", `DZ_CHECK_NEAR(h, 0.984, 0.002)`, taken from
  `skeleton_rest()` at :727. So G-sources:266 / C9 is a number about a stand-in, not a disagreement.]

## 3. The design [ours unless marked]

### 3.1 What it is
One pure function and one clock, picture side only (it reads the chase and writes nothing; the rule in G-constraints
§2 holds unchanged).

`GaitPlan gait_plan(const GaitBody& body, const GaitRow& row, float speed, float accel_fwd, float clock)` [ours]

Inputs:
- `GaitBody`: the limbs (2 or 4), each with side, fore or hind, and its length to the ground in the current posture
  (hip height for legs, shoulder height for arms used as forelimbs). Read from the rest joints, as `gait_hip_height`
  does today [read] model_rig.cpp:725-730. ~~Mass is NOT an input: every law read here scales by leg length through the
  Froude number (Alexander via p-l187:29-33; Kram 2.4; Heglund 2.5)~~ [2nd reader: UNSUPPORTED as stated. Heglund 2.5 is
  cited in this very file (section 1, p-l187:36) as a MASS power law: "about the 0.2 power of body mass", frequencies
  "the -0.15 power", and its 1974 abstract gives the transition as a function of body mass, not leg length. Mass may still
  be droppable for one humanoid skeleton, but that is [ours], not read]; mass would only re-enter through the chase's speeds.
- `GaitRow`: the gait's name and its numbers (3.3). Speed and forward acceleration come from `ChaserPose` and
  `DrawnChaser` (velocity is already kept there [read] model_rig.h DrawnChaser, `velocity, accel_tilt`).
- `clock`: the gait phase 0..1, per chaser id, stepped at the 240 Hz tick next to `DrawnChaser` in `ease_poses`, and
  interpolated per frame like every other drawn quantity (G-code §1a step 3).

Outputs (`GaitPlan`):
- per limb: in stance or in swing; `u`, how far through its own stance or swing; the foothold for the next touchdown
  (distance ahead of its hip, from the stride law); and for a planted limb, the world point it landed on, kept until it
  lifts (held in the clock's per-id state, like Overgrowth's feet with memory [summary] G-sources:39-41).
  [2nd reader: RE-DERIVED. The scout cites feet with memory as a precedent; the ground file says it is already BUILT, "green
  at 55d1451, parked behind L200" (G-sources:39-40), and a planted stance leg ("`plant`", law of cosines, eased reach) is
  already on `l205-stomp-c` (G-code:345-348; G-code:67 "planted on l205-stomp-c"). Held footholds and the lap-1 row in
  section 4 (lines "while_a_foot_is_down_it_stays_where_it_landed") restate those two builds; the scout names L205 only as
  an edit-overlap and never says 55d1451 exists.]
- per body: stride period, step length, the posture heights (hind and fore), the back's pitch from those two heights,
  and the flight rise where a flight exists (main's g t^2/8 rule [read] model_rig.cpp:773-780).

### 3.2 Where it sits
- `game/gait.h/.cpp` (new) or inside `game/model_rig.*` [ours]. It needs nothing but `Vec3` and the rest joints.
- The clock: a per-id table in `WorldApp`, stepped in `ease_poses` [read] world_app.cpp:567 at the tick, so the phase
  stops depending on the frame rate (stage.cpp:269 today) and N figures each have their own (G-code:225-226).
- Upright bodies: `gait_pose` keeps its legs, pelvis and arms. It takes `u` per leg from the plan instead of from
  `phase` (model_rig.cpp:759-761 compute it today), and the plan's step is the same `stride_step`. ~~So the biped row
  reproduces today's numbers to the bit at first; nothing a reader sees changes until a row says so.~~ [2nd reader:
  CONTRADICTED by the file's own section 3.2 and 4. The clock moves from the frame's delta (stage.cpp:269) to the 240 Hz
  tick plus interpolation, and lap 1's new guard says the drawn phase is the same at 144 and 360 fps: today's phase is
  not. The biped row can match today's LEG CURVES at a given phase, not today's drawn numbers. A row that really is
  "to the bit" needs the old clock kept beside the new, [ours] and unwritten.]
- Four-limb bodies: a new `quad_pose(rest, plan, motion)` [ours] fills the same 21-joint `BodyPose` (body.h:38-45 has
  Wrist and Hand, which serve as fore feet; no new joint is needed): pelvis at the hind height, chest at the fore height,
  the trunk pitched between them; each limb by the two-bone reach that `apply_motion` already uses for legs (`reach_leg`,
  G-code §1a step 5a) toward its held foothold or its swing arc; then `apply_motion` unchanged (lean, chain, look, floor).
  The Rig palette is untouched (G-code §2), so any model on the MPFB skeleton can go on four limbs.
- The stage's `place_figures` calls `gait_pose` or `quad_pose` by the plan's row, per id, not only for the first hunter.

### 3.3 The table: few numbers, each with its source
| row | limbs, order | limb phase | duty factor | posture | from |
|---|---|---|---|---|---|
| `biped_run` (today) | L, R; 0 and 0.5 | - | `kStanceShare` law | standing hip h | main model_rig.h:384-389 [read] |
| `stalk` (hyena walk) | LH 0, LF 0.14, RH 0.5, RF 0.64 | 0.14 (band 0.13-0.18) | hind 0.59, fore 0.66 | hind at 0.70 h, back straight | Spoor Fig 1A [read]; Trank [read abstract] |
| `stalk_human` (alt.) | same order | ~~0.30~~ [2nd reader: 0.30 is not in Shapiro; the paper prints two worked strides, 0.20 at duty 0.61 and 0.36 at duty 0.75, and a positive trend of limb phase with duty in 3 of 5 siblings; 0.30 is [ours]] (band 0.20-0.36) | 0.61-0.75 | as above | Shapiro Fig 2 [read] (UTS siblings, see 2.2) |
| `gallop` (on fours) | LH 0, RH 0.21, LF 0.25, RF 0.52 | transverse | hind 0.42, fore 0.52 | back and neck straight | Spoor Fig 1C [read]; offsets [inferred] |
| `rhythm` (T4) | any; as the row it modifies | as base | as base | as base | Full & Tu [summary p-l187:156] |

[2nd reader on the row above: the phase and duty numbers are Spoor's, OK (13-18, 59/66,14); one fixed duty pair for a
speed range, though Spoor says duty "generally varies inversely with the speed of locomotion" and the fore/hind gap
grows with speed: the row has no speed law for its duty, so the 0.59/0.66 are one filmed stride, not a law. "hind at 0.70 h"
is a cat on a treadmill under a 17-20 cm ceiling (Trank), applied to a hyena-like body: [ours], not Spoor's.
Trank also says "keeping its trunk horizontal"; this design pitches the trunk 17-34 degrees (3.4), against the one
source it cites for the crouch.]

- The offsets in `stalk` are the limb phase applied to lateral sequence (hind, then the same side's fore) [inferred from
  Shapiro's definition, 2.2]. The `gallop` offsets are my conversion of Spoor's leads and midtime-lag, ASSUMING
  Hildebrand's midtime-lag is the stride share between the hind pair's and fore pair's contact midpoints; Hildebrand 1977
  is unread, so that conversion is [inferred] and must be checked before it is called sourced. [computed] calc.js.
  [2nd reader: consistent with Spoor, and the scout never says what the leads are. Spoor p.26 defines a lead "as
  percentage of the period of contact with the ground of each [fore] foot", not of the stride. So hind lead 49 of duty 42 =
  0.206 of the stride (the row's 0.21) and fore lead 51 of duty 52 = 0.265 (RF 0.25 + 0.27 = 0.52). From the row's own
  numbers I get contact midpoints of 0.313 (hind pair) and 0.643 (fore pair), gap 0.33 = Spoor's "midtime-lag 33". So the
  conversion reproduces the printed figures; "midtime-lag" itself stays undefined in what was read. A builder who reads
  "lead 49" as a stride share builds a different gait.]
- Stride length for every row: Alexander's law at the row's own hind height, the stride being two steps (main's rule).
  [2nd reader: WRONG against the source. The law's h is "the height of the hip joint from the ground in normal standing"
  (p-l187:30, quoting Mazzetta & Blanco, APP p.236), the room's own `gait_hip_height` reads the REST skeleton, and Trank,
  the scout's crouch source, finds cycle period and swing/stance share "similar for normal and crouched walking". Using
  the crouched 0.837 m shortens the stride 22%: at 2 m/s the law gives 1.99 m (period 1.0 s) at standing h 1.196, not 1.55 m
  (0.78 s) [computed, node, 3 lines]. Which h a crouched body should use is [ours] and untested.]
  [computed] The crouched hunter (h 0.837 m) at 2 m/s: stride 1.55 m, period 0.78 s. Read against the sources: a cat's
  crouched cycle 0.766 s (Trank), a hyena's walking stride 0.66-1.00 s (Spoor). Same order; different animals and speeds.
- Which row by speed: below Fr 0.5 a walk (Kram's human value [read abstract]; the mammal value 0.63 is the room's via
  Mazzetta & Blanco) [2nd reader: UNSUPPORTED for four limbs. Kram's 0.5 is "humans and other bipeds", walk to run, leg
  length L. Spoor gives the hyena's walk to gallop as 6 to 9 km/h with no Froude number, and no hip height is in the paper;
  the match at 2.03 m/s (7.3 km/h) is a coincidence of this body, not a law. The switch point is [ours]]; above it the stalker either gallops on fours (Spoor: no trot, an abrupt change to a slow gallop) or
  rises (3.4). [computed] For the crouched hunter Fr 0.5 is 2.03 m/s; for the standing hunter 2.42 m/s.
- The `rhythm` modifier holds the frequency at the value the row has at its walk limit and takes speed from length
  [ours: the rule; the shape is Full & Tu's]. For the pack, one clock shared by the three bodies is his pick's "one shared
  fixed rhythm" (brief:1154 [summary] G-his_words:413-416) [ours: keying the clock by pack].
- Fore duty factor 1.04-1.20 of the hind's, growing with speed (Spoor) [read]: one number, `fore_duty_ratio`, default
  1.12 (the middle of the band) [ours: the middle].

The parameters a builder may turn: the crouch (0.70, Trank), the limb phase (0.14, Spoor), the fore duty ratio (1.12),
and the rise's time (3.4). Everything else follows from the laws and the model's own limbs.

### 3.4 The hunter: stalk on four limbs, rise into the human run (items 207, 208)
- Posture [computed, calc.js, from 2.10]: hind limbs crouched to 0.70 of the standing hip (Trank's 30%): hip 0.837 m.
  Palm down, the shoulder sits at about 1.00 m: the back slopes UP to the front by about 17 degrees. On the fingers it
  sits at 1.16 m: about 34 degrees. Long forelimbs over crouched hind limbs give the hyena's sloping back from this
  body's own measurements, with no change to the model. Straight-legged on hands and feet the back slopes DOWN to the
  front by about 20 degrees, which is the human crawl (Shapiro's long hind limbs).
- Back and neck straight in line (Spoor's hyena; Trank's cat: head in line with the trunk). The rig has no spine joint
  and this needs none, unlike T3 [summary] G-locomotion:157. [2nd reader: the geometry above (17, 34 and -20 degrees)
  I re-derived from the glb and it is right: (1.00-0.837)/0.572 gives 16.6, (1.16-0.837)/0.572 gives 34.4, (1.00-1.196)/0.572
  gives -20.0. But no read source says a hyena's back slopes up to the shoulder; Spoor says straight line of back and neck
  in the gallop, nothing of a slope or of a walk. "gives the hyena's sloping back" (above) is [inferred] from general
  knowledge of the animal, unmarked. The head "in line with the trunk" (Trank, Spoor) plus a 17-34 degree trunk slope
  means a head pitched up 17-34 degrees on a body whose head is meant to stay humanlike for the hunter (item 169).]
- Footfalls: lateral sequence, lateral couplets, limb phase 0.14; fore feet down longer than hind (Spoor).
- [2nd reader on the next bullet: the read mechanism is for a REARWARD centre of mass (Aerts: "caudal shift of the centre of
  mass"; Clemente 2014: "rearward shift"). The scout's own 2.1 reads the hyena the other way: centre of mass "more cranial
  than in other large carnivores" (Spoor p.27), and the hunter's long arms put it forward too. So the one source for the
  rise describes the opposite mass layout, and the threshold a_fwd > g x_c / z_c is not evaluated: for x_c 0.4-0.6 m and
  z_c about 0.9 m [inferred, my guess at the pose] it is 4-6 m/s^2, a figure nobody has compared with the chase's
  accelerations. The trigger "seen" (item 208) is not the trigger "accelerating", and the file does not say who closes
  that gap.]
- The rise [ours, on a read mechanism]: the lizards rise because forward acceleration pitches the front up about the hind
  support (2.6). [inferred, statics] the front lifts when a_fwd x z_c > g x x_c (z_c the centre of mass's height, x_c its
  distance ahead of the hind feet). So the chase's own burst out of the stalk drives the rise: the plan's posture blends
  from `stalk` to `biped_run` as that inequality holds, through the room's critically damped spring (omega = 2/duration,
  [summary] G-code:124). One dial: the spring's duration, default 0.25 s [ours; his "split second" is the bar]. The fore
  limbs' duty falls to zero and they hand to the arm laws already in `gait_pose`.
- The chase owns when it stalks and when it is seen (A's lane, brief:1546-1550 [read]); this layer only draws it.
- Item 206's goal stands outside animation: the stalk must not make it undetectable. A tell in the motion is his call.

### 3.5 The same layer for a lesser chaser and for the player
- Crawler (on all fours, under a metre; climbs, `chase_entities-5` [summary] G-his_words:562): `stalk` or `gallop` with
  the `rhythm` modifier (his T4 pick). On a climb link (chase/chaser.h:64 [read]) the same plan with "up" = the wall's
  normal is the spider's idea (2.9) [ours: adopting it]; a later lap, since the floor probe returns a height only today
  [summary] G-sources:41.
- Pack: `biped_run` with `rhythm` and one clock for the three.
- Sprinter and charger (T3) need the spine joint; this layer gives them their footfalls, not the flex.
- The player: `gait_plan` with h 0.98 m would replace `stride_rate x sqrt(speed)` (camera.cpp:177) and the uncited duty
  factor (body.cpp:130). [computed] Alexander's frequency grows as v^0.4, close to today's v^0.5. This moves the view's
  sway (the camera reads `stride_phase_`), so it is a later "check it" lap with camera_tests as the guard, not the first.

### 3.6 Cost per character per frame [inferred; nothing timed]
- `gait_plan`: per body one `pow` and one `sqrt`, per limb one `fmod` and a compare: well under a microsecond.
- `quad_pose`: four two-bone reaches (a few `acos`/`sqrt` each), then today's chain and palette. Footholds are probed
  ONCE at touchdown, not every frame: at 1.3-2.4 Hz strides that is about 5-10 probes a second per body, against the
  hunter's 2 raycasts every frame today (G-code:233-234). Order of a few microseconds per body; with the 1 + 6 + 6 + 9 + 2
  slots (figures.h:28 [read]) still far under 0.1 ms of CPU [inferred].
- The real cost of more modelled bodies is GPU skinning and BVH refit (+0.39 ms for two full models today), not the
  gait. Lesser kinds on four limbs need the lighter models his `entity_bodies-2` pick allows [summary] G-his_words:569-571.
- Owed: a timing row (the room's R4.7 form, `DZ_BENCH=1`) before any landing that adds bodies.

## 4. The first lap

Smallest piece: the per-id gait clock at the tick plus `gait_plan` with the `biped_run` row and held footholds, used by
the hunter only. No four-limb pose yet.

Files: new `game/gait.h/.cpp` (or `game/model_rig.*`); `game/world/world_app.{h,cpp}` (the clock beside `ease_poses`);
`game/world/stage.cpp` (read the clock, drop `hunter_phase_`); `game/model_rig.cpp` (`gait_pose` takes `u` per leg);
`game/tests/model_rig_tests.cpp`, `game/tests/world_app_tests.cpp`; the CHANGELOG. It edits the same block of
`model_rig.cpp` as C's L205 (`l205-stomp-c`, the planted stance leg) [summary] G-code:345-349: it goes after L205 lands,
or on top of that branch, by the chair's routing.

The row, red today on a recorded case [ours; the bar is registered before code]:
- `while_a_foot_is_down_it_stays_where_it_landed`: play the bot's 60 s record (and one of his kept runs through
  `DZ_LEAN_RUN`) with the existing headless trace `hunter_lean_trace` [read] game/tests/world_app_tests.cpp:916-919; draw
  the hunter each frame with `gait_pose`; for every stance, the foot's world position moves at most 2 cm from touchdown
  to lift-off (bar [ours]; Overgrowth's foot memory is the precedent, not the number).
- Control, in the room's own pattern (the 1028 row keeps "the easing off ... as the control and fails both" [read]
  world_app_tests.cpp:1028-1031): today's rule, the phase advanced per frame as stage.cpp:269 does, must fail.
- Red today is [inferred], not measured: the legs come from Fukuchi's angles while the step comes from Alexander, and
  the feet follow the facing in turns (G-code:66-67), so a planted foot should slide. If main already holds 2 cm, the row
  is a guard and says so. Measure it first.
- [2nd reader: the cheapest way to pass this row without doing its job. The row bounds only the foot's world position
  during a stance. (a) Pin the ankle at touchdown and let the leg stretch or the pelvis lag: the foot never moves, the body
  slides over it, and the legs go past their length. (b) Shrink the stance window (duty to nearly 0): few frames, little
  to slide. (c) Pass on a record where the hunter is mostly slow or standing. (d) Pass in a test that reads the planned
  foothold rather than the posed ankle. The row has no companion that the planted leg stays within its reach, that pelvis
  travel matches the speed over a stance, or that the stance share is the duty the row says; a pelvis-speed row and a
  leg-length row (ankle-to-hip never above thigh + shin) would close (a) and (b). Since L205's `plant` already holds a
  stance foot on the floor, this row may already pass there: measure on `l205-stomp-c` first.]
- Guards that must stay green: every model_rig row (the yardstick's leg rows rms/sd <= 1), the replay rows (his kept runs
  byte for byte, G-constraints §2), and a new one: the drawn phase at each tick is the same at 144 and 360 frames a second.
- Tier: "check it" for the look; the clock's replay independence is "prove it" (it touches what replays read). The
  builder runs the touched files' tests and the mutation run on the new file.

Lap 2 (the owner's wish itself): `quad_pose` and the `stalk` row behind a stage switch, with a scripted stalk window on
the same record. Row: in the window, each hand is within 3 cm of the floor through its stance, the hips sit at 0.70 +/- 0.05
of the standing hip height, and the footfall order is hind then same-side fore (red today: the hunter is upright).

## 5. What only his eye can decide, and the fewest clips

The sources set the rhythm and the heights; whether it reads "alien hyena" is his (rule at brief:1211 [summary]
G-his_words:460-461).
1. Clip A, the stalk, two settings side by side at the same speed (about 1.5 m/s), from the look-behind and from the side:
   left `stalk` (limb phase 0.14, on the fingers, back up 34 degrees); right `stalk_human` (0.30, palm down, 17 degrees).
2. Clip B, the rise into the sprint, at the default 0.25 s and at 0.15 s, ending in today's run.
3. Clip C, today's upright sprint on current main as the baseline, labelled as now (item 216's rule: no "before" older
   than a fix he has seen; full frame rate, lit [summary] G-constraints:159-161).
His calls, besides what he sees: the head in the stalk (in line with the trunk, Trank and Spoor; or held humanlike and on
the player, his item 169 "its head stays humanlike" [summary] G-his_words:414). Whether the stalk has a tell (206).

## 6. What I would NOT build, and why

- Optimised gaits (Wampler & Popović): minutes per gait on a cluster, and it failed to find a horse's gallop (2.8). The
  measured footfall tables give the same representation for nothing at runtime.
- Learned or RL locomotion (the brief's learned-locomotion reference, item 131): no data on our skeleton, a training
  budget, and it would hand the look to a policy instead of to the sources and his eye.
- Motion matching or clips: no clips on this skeleton; his pick keeps clips out (G-sources:187-197).
- Physics-balanced walking for the stalk: the room ruled it research only (G-physics:238); picture-only must hold.
- Spore's whole system (its authoring tool and particle IK): built for unknown bodies; ours are known humanoids on one
  21-joint pose with a working two-bone reach. Take its two ideas only: duty factor plus offset per limb, and speed
  mapped to those numbers.
- The spider's reactive stepping (reach triggers, Cruse's rule) on flat ground: the chase gives speed and heading, so a
  clock is enough; keep the reach trigger only for climbing a wall, later.
- A spine flex for the hunter: the hyena keeps its back straight (Spoor); T3 belongs to the sprinter and charger.
- More than four limbs: every entity is humanoid (item 168 [summary] G-his_words:406-411). The plan stays general in limb
  count; only two and four are built.
- A mass input: no law read here needs it.

## What I did not open

- Hildebrand's papers (1965, 1976, 1977, 1989): the gait formula and midtime-lag definitions are taken through Spoor and
  Shapiro only; the gallop offsets rest on an unread definition.
- Alexander & Jayes 1983 (Wiley wall again), Alexander 1984 (SAGE, paywalled), Alexander 2004 (PMC record only, no text).
- Trank 1996, Kram 1997, Heglund 1974, Aerts 2003, Clemente 2014 and 2018 beyond their abstracts.
- The Spore draft on chrishecker.com (I read the course copy) and Spore's videos; Wampler's 2014 follow-up.
- Any hyena data beyond Spoor & Belterman: no hip heights, no speeds above 15 km/h, no joint angles.
- `l205-stomp-c`'s code (G-code and G-locomotion only), `game/body.cpp` beyond :124-131, `camera.cpp` beyond :176-178,
  `reach_leg` and `apply_motion` bodies, the kept runs themselves (`game/runs` is not in the tree at main).
- kid.glb's limbs; the record's hip height 0.984 m source (p-l180-lap2) against my 1.196 m.
- The plan files under `loop/` other than p-l187's hand-back, which I opened whole.

## Second reader

Adversarial second reader, 2026-11-13. Line numbers are the scout's ORIGINAL line numbers (before my in-place notes).
Primaries I downloaded and read in whole lines: Spoor & Belterman (pdftotext), Shapiro 2014 (Europe PMC XML), Hecker 2008
and Wampler & Popovic 2009 (pdftotext), `Spider.js` and `LICENSE` at 763f814 (raw GitHub), the CC BY 4.0 legal text, and
the PubMed abstracts of Trank, Kram, Heglund 1974, Aerts, Clemente 2014 and Clemente & Wu 2018. Local: dreamzone-3 `main`
(31d1c6d) by `git show`, the brief, the ground files, p-l187, and `hunter.glb`'s inverse bind matrices (a 20-line node read).

| line | claim (short) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 16 | game code is `main` at 31d1c6d | `git log -1 main` | OK | prints 31d1c6d |
| 23-28 | his items 207, 208, 206, 153, 217 quoted verbatim | brief:1554, 1558, 1550, 1109, 1607 | OK | text identical |
| 30-31 | "No source on a hyena's gait" note at brief:1554 | brief:1554-1556 | WRONG | line is brief:1556 |
| 35-36 | `stride_step`, hip height, phase lines in model_rig.cpp | model_rig.cpp:695, 725, 734-735 | OK | lines match |
| 37-38 | walk-trot Fr 0.63, trot-run 2.2 from s/h 2.0, 2.9 | recomputed (s/h / 2.3)^(1/0.3) | OK | 0.63 and 2.17 |
| 39-40 | duty factor matched at equal Froude (Donelan & Kram) | p-l187:35 | DOWNGRADED | reduced gravity; stride off by up to 67% |
| 41-43 | kStanceShare 0.36 at h:384-389; pelvis and rise 764-781 | model_rig.h, model_rig.cpp | OK | `0.5f*9.81f*t*t*x*(1-x)` at :780 |
| 48-50 | player clock `stride_rate x sqrt(speed)`, duty 0.62-0.37 uncited | body.cpp:126-131; camera.cpp:177 | OK | no source in the comment |
| 51-54 | hunter phase per frame; first hunter only; crawler "under a metre" | stage.cpp:267-269; figures.h:11 | OK | `last_dt_` at :269 |
| 55 | chase gaits Mesh, Ladder, Drop, Recover, Climb, Off | chase/chaser.h:59-66 | OK | enum matches |
| 71-86 | Spoor: 16 mm, 64 fps, 15+6+7 fragments, walk numbers, Fig 1A, 1C | Spoor pp.24-26 | OK | all figures match |
| 79 | fore duty 104-120% of hind (spotted), gap grows with speed | Spoor p.25 | OK | "difference ... increase with speed" |
| 80-82 | no running symmetrical gaits; abrupt walk to gallop; half-bound | Spoor p.26 | OK | verbatim |
| 86-87 | back and neck in a straight line; centre of mass forward | Spoor p.27 | OK | verbatim |
| 72 | Spoor PDF carries no licence; idea and figures only | the PDF text | OK | none printed; repository page unread by me too |
| 96 | 513 strides, "five adults" on hands and feet | Shapiro Methods, Intro | DOWNGRADED | five siblings with Uner Tan syndrome, TV footage at 25 fps |
| 96 | 98.6% lateral sequence; 85% LSDC, 12% LSLC, 3.5% singlefoot | Shapiro Results | OK | verbatim |
| 98-100 | limb-phase bands; walking = duty >= 50% | Shapiro Methods | OK | verbatim |
| 100 | worked strides 0.36 at 0.75; 0.20 at 0.61 | Shapiro Fig 2 caption | OK | verbatim |
| 101-102 | faster means lower limb phase | Shapiro Discussion | DOWNGRADED | "for three of the individuals", not five |
| 103-105 | long hind limbs cause lateral couplets; hands and knees shift | Shapiro Discussion | OK | stated |
| 93-95 | CC BY, commercial use with credit, no share-alike | article front matter; CC BY 4.0 legalcode | OK | no NC or SA term; article names no version |
| 109-113 | Trank: trunk horizontal, hip -30%, 766 ms, 70% stance, 41-45 deg | PubMed 8899606 abstract | OK | verbatim |
| 113-114 | crouch is the first read source for T5 | Trank abstract pt 7 | OK | a cat on a treadmill under a ceiling |
| 117-119 | Kram: bipeds switch walk-run at Fr 0.5, L leg length | PubMed 9076966 abstract | OK | verbatim |
| 122-123 | trot-gallop transition as equivalent speed | PubMed 4469699 abstract | OK | verbatim |
| 127-128 | Aerts: rear centre of mass, acceleration lifts the front | PubMed 14561343 abstract | OK | quote spliced with ellipsis, fair |
| 129 | Clemente 2014: 124 species, acceleration threshold | PubMed 24820255 abstract | DOWNGRADED | 124 is the mass survey; 56% explained |
| 130-131 | Clemente & Wu: trunk angular acceleration predicts bipedal runs | PubMed 30257922 abstract | OK | eight agamid lizards, unsaid |
| 138-143 | Hecker: leg groups, rational ratios, duty factor and step trigger | Hecker 4.2 | OK | verbatim |
| 144-145 | gait styles, speed mapped, different groups in different gaits | Hecker 4.2 | OK | "two short legs running, four trotting" |
| 146-147 | Hecker's own limit, "section 7, Future Work" | Hecker section list | WRONG | no section 7; it is in section 5 |
| 137 | Hecker licence: ACM, personal or classroom use | copyright notice | OK | text matches |
| 151-153 | Wampler: one period, start and duration per foot, fractions | Wampler section 4 | OK | verbatim |
| 154 | solve a minute to 10-20 min, "run on a cluster" | Wampler section 5 | DOWNGRADED | cluster is the outer morphology search |
| 155 | no horse gallop obtained | Wampler section 6 | OK | "four-beat phase shifted trot"; section is 6 |
| 156-157 | head objective penalises cross-track translation | Wampler 3.5 | OK | verbatim |
| 160 | spider repo MIT, copyright line | LICENSE at 763f814; GitHub API | OK | MIT, 21 lines, 2026 Manzarpour |
| 162-168 | `Spider.js` lines 523, 121, 525-526, 66, 546, 576 | Spider.js | OK | each token found |
| 164 | step request on phase, home drift, or over-reach | Spider.js:536-537 | DOWNGRADED | over-reach only raises priority |
| 169-170 | Unity spider no licence; promenade NOASSERTION | not opened | UNCHECKED | not opened |
| 174-176 | hunter thigh 0.621, shin 0.501, arm lengths, hip height 1.196 | hunter.glb IBMs, my node read | OK | 1.206 - 0.010 = 1.196 |
| 177-179 | 0.984 m disagrees with 1.196 m | model_rig_tests.cpp:737-738 | OK | reconciled: 0.984 is the test skeleton |
| 190-193 | mass not an input; every law scales by leg length | p-l187:36; Heglund abstract | UNSUPPORTED | Heglund is a mass power law |
| 209-211 | biped row reproduces today's numbers to the bit | scout 3.2 against section 4 | UNSUPPORTED | clock moves frame-dt to tick |
| 232-234 | stride from Alexander at the crouched hip height | p-l187:30; Trank abstract pt 3 | WRONG | h is standing height; Trank period unchanged |
| 235-237 | below Fr 0.5 a walk, above it gallop or rise, four limbs | Kram abstract; Spoor p.26 | UNSUPPORTED | 0.5 is a biped value |
| 241-242 | fore duty ratio default 1.12, middle of 1.04-1.20 | Spoor p.25 | OK | arithmetic right; ignores speed trend |
| 247-253 | crouched hip 0.837; back slope 17, 34, -20 degrees | recomputed from the glb | OK | 16.6, 34.4, -20.0 |
| 250 | "the hyena's sloping back" from long forelimbs | Spoor (whole) | UNSUPPORTED | Spoor gives no slope; unmarked inference |
| 256-261 | rise driven by acceleration, from lizards | Aerts, Clemente abstracts | DOWNGRADED | rear centre of mass; hyena's is forward |
| 233-237 | stride 1.55 m, period 0.78 s; Fr 0.5 at 2.03, 2.42 m/s | recomputed, node | OK | reproduce at h 0.837, 1.196 |
| 272-274 | Alexander frequency grows as v^0.4 | recomputed | OK | stride ~ v^0.6, so v/stride ~ v^0.4 |
| 296-306 | `hunter_lean_trace` :916-919; control row :1028-1031 | world_app_tests.cpp | OK | both found |

Tally: 54 rows. OK 39, DOWNGRADED 7, WRONG 3, UNSUPPORTED 4, UNCHECKED 1. WRONG: brief line 1554 for 1556, Hecker "section 7", the stride at the crouched h. UNSUPPORTED: mass dropped, "to the bit", Fr 0.5 for four limbs, the hyena slope.

RE-DERIVED: 1. The held foothold and the lap-1 row "a planted foot stays where it landed" (scout lines 199-201 and
288-310) restate feet with memory, built and green at 55d1451 (G-sources:39-40), and the planted stance leg already on
`l205-stomp-c` (G-code:345-348, G-code:67). The scout credits the precedent but never says it is already written. The
per-id clock table is credited to G-code:225-226 by the scout itself, so it is not counted.

Design checks:
- Cheapest pass of the first row without its purpose: see the bullet under "Red today is [inferred]" in section 4 (pin the
  ankle and stretch the leg, a near-zero stance window, a slow record, or a test that reads the planned foothold).
- Mechanisms with no source and not marked [ours]: the crouch height as a stride-law input (3.3); the Fr 0.5 switch for four
  limbs; the stalk's fixed duty pair across a speed range; the 0.30 limb phase of `stalk_human`; the hyena's sloping back;
  "to the bit". Marked [ours] and honest: the 0.25 s rise, the 1.12 ratio, the 2 cm bar, `rhythm`.
- The rise has a missing link: Aerts's lizards rise because their mass sits behind the hips; the hunter's sits ahead
  (Spoor, and long arms), and no file compares the needed acceleration (4-6 m/s^2, my guess) with what the chase gives.
  Item 208's trigger is being seen, not accelerating.
- Not a flaw, noted: the scout's `gallop` conversion checks out against Spoor's printed midtime-lag (note under the table);
  the "alien" half of item 207 has no source and is correctly left to his eye.

What I could not check:
- Heglund & Taylor 1988 and Full & Tu 1991 (cited through p-l187 only); Donelan & Kram 1997 beyond p-l187's lines.
- Alexander 1976 and Alexander & Jayes 1983 themselves (the stride law's primary): the 2.3 and 0.3 are verified only as
  the room's code and p-l187's summary.
- Hildebrand; Kram's, Trank's (bot wall), Aerts's and Clemente's full texts beyond abstracts.
- The two other repositories' licences (lines 169-170), the Spoor repository licence page, the CC BY version Shapiro used.
- Whether `hunter.glb` is scaled at load: I read the skin's bind pose, as the scout did; the in-game rest comes from
  `rest_from_bones` (model_rig.cpp:252), which I did not open.
- The scout's scratchpad scripts (`calc.js`, `joints.js`): I re-derived the numbers, not the scripts.
