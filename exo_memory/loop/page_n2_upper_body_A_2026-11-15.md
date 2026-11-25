# N2, the trunk, the arms, the head and the lean: the page (seat A, D677, 2026-11-15)

**A page only, no code.** Tier: just do it. It is item 5 of the plan's split (`loop/plan_animation_restart_2026-11-15.md:421`,
hash-object eba7aef9). **No code until he has seen the legs' film,** so that what he says of the legs can turn this page.
**Nothing of the old body** is called, filmed, set beside the new one or used as a judge (the plan's sections of 15:03 and 15:10).

**Read whole:**
- `loop/lessons_first_iteration_2026-11-15.md` (Lessons; git-blob f3c204da as the plan cites it);
- `loop/source_sheet_n2_upper_body_E_2026-11-15.md` (Sheet);
- the plan's sections on the system, the stages and N2 (:40-96, :340-425).

**Opened at source by me, at the lines the page leans on:**
- `loop/sprint_reference_2026-11-13/00_reference.md:136-166, :282` (Dorn's runner, shoulder and elbow by stride);
- `loop/animation_system_2026-11-13/ground_locomotion_and_yardstick.md:130-147, :196-206` (Bruening, Otsuka, the CMU arm bars);
- `loop/animation_system_2026-11-13/scout_upper_body_and_gaze.md:70-104` (Pontzer 2009, Dunbar/Pozzo, Authie 2015);
- `loop/b8_gaze_sources_B_2026-11-15.md:45-67` (arms passive from below; looking down);
- `handback/p-n1-legs-B_2026-11-15.md:95-116, :1049-1075, :1130-1141` (what N1 draws and what it leaves to N2).

**Not re-opened by me:** the primaries themselves. Every number is the record's at the line given, and the Sheet's marks of who read
what stand.

---

## 0. His words this page answers

| item | his words | what it asks of N2 |
|---|---|---|
| 239 (14:53) | "also i swear the elbows dont swing lol" | the elbow must swing through a sprinter's range |
| 180 | "the elbows should be flared out more, looks like someone with a suboptimal running technique with how they swing their arms, like there needs to be more bend in the elbow when swinging" | flare and bend |
| 186 | "v1 sourced flare looks the best" | the flare from Otsuka 2016, his pick |
| 177 | "the arms are like too close to the sides of the body while moving" | stand-off |
| 163 | "perhaps the head moves first when you look, then it moves the rest of the body underneath"; "torso and arms need to swing more" | the look: head first; more swing |
| 156 | "making the whole body work as one" | one body, not parts |
| 214 | "on the corners, the torso doesnt orient itseld into the banking of a turn" | the lean, whole body |
| 220 | "the body should orient itself where it is trying go, like a bird or a space ship banking into a turn" | the lean |
| 151 | "it will turn, and then lean, not lean into the turn" (`ground_his_words.md:296-314`) | the lean follows the turn, it does not lead it |
| 168, 169 | humanoid in nature, with its own uncanniness; the hunter's one cue is T1, greyhound cornering, "its head stays humanlike" | the head stays human on the hunter |
| 153, 236, 237 | the research, not our own numbers; "always take relevant research and use it" | every line has a source, or says it is ours |

**The look** (his 163 and the plan's step 4): the head goes to where it looks first, then the body under it, with a person's shares.

**His falsifiers, registered by the plan:**
- "the hands still reach forward as it runs" (`:91-92`);
- "the elbows still do not read as swinging" (`:364`).

## 1. What N2 stands on (N1, pane B's build `n1-shaped-wip-b` c15f071)

- **N1 draws the legs and the pelvis:** the pelvis's height from the held leg, and the runners' own pelvis tilt, 13.5 / 15.6 / 16.5 deg at
  2.5 / 3.5 / 4.5 m/s (Fukuchi 2017's pipeline; B §17.1, `:1062`).
- **It leaves the trunk, arms and head held at rest** behind `new_animation` (B §4, `:112-114`).
- **It does not draw the pelvis's turn about the vertical,** and B infers that turn lengthens a real stride (B §17.4, `:1140`).
  **That is the one seam with N1,** and it is named in section 3.
- **The clock is the simulation's tick, not the frame's** (Lessons, N1, WRONG: the old stride ran on the frame's time). N2 reads N1's stride
  phase (each foot's contact) on the same tick.

## 2. The pipeline, part by part, in the order each tick runs it

Each part reads only the simulation's state and the parts before it. One row of numbers per kind of body (runner, hunter). One spring layer
for every eased quantity (part 8).

### 2.1 The lean, the whole body (first, because every other part rides its frame)

| what | source | on file | ours? |
|---|---|---|---|
| The body leans from its feet so that the ground force passes near its centre of mass: roll = atan(a_lateral / g), a_lateral = v x turn rate; pitch = atan(a_forward / g) | Newton; no game rule found (R-tech's agent) | Sheet :203-204 | the law is physics |
| How much of gravity's lean a runner takes on a bend: 0.84 / 0.73 at about 33 m, 0.96 / 0.84 at lane 2 (7 sprinters, ~9.37 m/s) | Churchill, Salo & Trewartha 2011 | Sheet :205 | **the share is ours** past that one speed and radius |
| The trunk carries 0.89 of the body's lean | Churchill 2011, Table 2 | Sheet :207 | inferred from re-done columns |
| The body rolls about the feet, every joint together; the shares are angles in SPACE, so the trunk is not counted twice (1.89 theta) | Overgrowth `aschar.as:13922-13934`; the second reader's catch | Sheet :213, :219 | |
| The lean's ease: half-lives 0.1126 s and 0.0548 s, 0 off the feet | Overgrowth `aschar.as:7921-7940` | Sheet :212; Lessons, N2, RIGHT (the timing) | |
| Starts and stops: 43 deg at toe-off from blocks; hard stops -4.24 to -4.99 m/s^2 on average | King et al. 2022; Harper et al. 2020, 2022 | Sheet :204, :211 | four-step means |
| The cap: at grip mu the lean is at most atan(mu) | physics | Sheet :203 | **mu is his** (the grip pick, pending) |

- **His 151, as a rule of order:** the lean is computed from the body's measured acceleration after the turn has begun. It never leads it
  (the simulation's own a, low-passed by the ease above).
- **What the old build got wrong, and this does not do** (Lessons, N2): the lean computed each tick and discarded; a 1 deg per m/s^2 tilt,
  1/5.8 of gravity's; the feet held under the hips with only the hips and trunk rolling.
- **The cost of a large lean in space:** the feet sit L sin(theta) outside the path and the hips drop L(1 - cos theta). At the hunter's
  1.196 m hip, 45 deg is 0.85 m and 0.35 m (Sheet :218).
  - **The feet are N1's,** so the roll is applied about the planted foot, and N1's foot plan must place the landing outside the path by
    that much. **That is a second seam with N1,** a joint one: the lean cannot be added above legs that do not know of it.
- **Which g for the player** (the game rises at 23.4 and falls at 37.5 m/s^2) is a choice not yet made (Sheet :220). It is his.

### 2.2 The pelvis's turn and the thorax's counter-turn

| what | source | on file | ours? |
|---|---|---|---|
| Pelvis 6.5 deg each way, thorax 14.28 deg each way, in counter-turn with the stride | Perpiñá-Martínez 2023, Table 1; Ford 2013 | Sheet :78 | the speed it holds at is to be read at source |
| The thorax turns opposite the pelvis; more in phase running than walking | UMass thesis; Meyns 2013 | Sheet :79 | snippets |
| Pelvis-to-shoulder phase: 93.9 +-60.9 deg running (unsigned, at most 180) | Pontzer et al. 2009 | Sheet :80; opened at `scout_upper_body_and_gaze.md:77-80` | **who lags is not on file, so the sign is ours** |
| Arms are passive mass dampers powered from below | Pontzer 2009, Summary | `scout_upper_body_and_gaze.md:86-88` | |

- **Built:** the thorax's yaw is drawn as the counter-turn to the pelvis, with the measured amplitudes (thorax/pelvis 14.28/6.5), and a
  phase offset from the stride.
- **The offset is ours,** and printed. NOT the old exact antiphase pinned by a row (Lessons, N2, WRONG).
- **The seam:** the pelvis's turn is drawn here, and it moves the hip joints that N1's legs hang from. So either N1 takes the pelvis's turn
  into its foot plan, or N2 leaves the pelvis's yaw to N1 and turns the thorax only. **Pane B and I settle which before code,** with the
  stride B has measured beside it.

### 2.3 The trunk: forward lean and bounce

| what | source | on file | ours? |
|---|---|---|---|
| The trunk's vertical travel: a C7 marker oscillates 9.4 +-1.8 cm at 8.9-12.9 km/h | Smith et al. 2022 | Sheet :85 | |
| The pelvis's height comes from the stance leg, not authored | Kovar 2002; Johansen 2009 | Sheet :86 | N1 does this already |
| **The trunk's steady forward lean at a run, by speed** | **not on file** (Sheet :99) | | |
| **Dorn's markers carry the trunk line SACR to C7; its curve over the stride was not computed** | the sprint reference | `00_reference.md:46, :282` | **to compute, not to guess** |

- **Built:** the trunk rides N1's pelvis, so the bounce comes from the legs, as the source says.
- **Its forward lean by speed is measured, before code, from Dorn's markers** (the same data as the elbow), at 5.20 / 7.00 / 9.49 m/s. Below
  4.5 m/s it is measured from the CMU running clips that the yardstick already reads (2.67 to 4.15 m/s, three runners).
- **Until then the forward lean is zero, and said to be zero.** NOT the old 0.22 rad x speed/6 (Sheet :109, not carried over).

### 2.4 The arms

| what | source | on file | ours? |
|---|---|---|---|
| **The elbow at a sprint, by % of the right leg's cycle:** 5.20 m/s 65.5 to 132.6 (range 67.1); 7.00 m/s 60.4 to 129.0 (68.6); 9.49 m/s 38.2 to 121.2 (83.0). It folds most near 40% (121-133) and opens most after 60% | Dorn, Schache & Pandy 2012, SimTK (one runner, right arm, 44 cells re-run within 0.6 deg) | `00_reference.md:158-166`, opened | n = 1 |
| **The shoulder by % of the cycle** (upper arm against the trunk line, + forward): 5.20 m/s -68.3 to 4.3 (72.6); 7.00 m/s -68.8 to 24.1 (92.9); 9.49 m/s -89.0 to 30.0 (119.0) | the same | `00_reference.md:147-153`, opened | n = 1 |
| Below 4.15 m/s: 25 CMU running clips, three runners, 2.67-4.15 m/s; the yardstick's bars, elbow mean within 12.4 deg, shoulder ends within 3.7 / 7.0 | CMU Graphics Lab | `ground_locomotion_and_yardstick.md:196-204`, opened | "weak": three runners |
| The swing grows with speed and limb: shoulder range 43.72 F^0.671, elbow 21.68 F^0.718, F = v/sqrt(g l), measured to Froude 1.36 | Bruening et al. 2020, Table A3 | `ground_locomotion_and_yardstick.md:139-140`, opened | **not past F 1.36:** the hunter runs near 3.4 |
| The flare: the elbow stands off about 13.5 deg in front and 29 behind | Otsuka 2016, Fig. 2 (read off a plot); his pick V1 | `ground_locomotion_and_yardstick.md:145-147`; Lessons, N2, RIGHT + HIS 186 | read by eye off a plot |
| The arms hang from the shoulder girdle and swing relative to the CHEST, powered from below | Pontzer 2009; B's inference | B8 :51-53, :66-67 | inferred |
| A carried arm's pull toward its target: half-life 0.055 s at full speed, 0.19 s standing | Overgrowth `movementobject.cpp:1769-1788` | Sheet :127 | |

- **Built:** the shoulder and the elbow are drawn from the measured curves by the right leg's phase, the left arm half a cycle on. The
  table is already against the leg's cycle, so N1's phase drives it directly.
  - Between speeds the curves are blended. Below 4.15 m/s CMU's clips set the targets; 4.15 to 5.20 m/s is a blend (ours). Above 9.49 m/s
    the 9.49 curve is held (ours).
  - The flare is Otsuka's stand-off, his pick.
  - The arm hangs from the chest and swings relative to it.
  - Each arm angle eases toward its target through the spring layer at Overgrowth's half-lives.
- **The scale to our bodies:** the curves are angles, so they carry onto any arm length. The hunter's long arms take the same angles. The
  hand's path scales with the arm (ours; a body with different arms may need its own reading, said, not tuned).
- **What the old build got wrong, and this does not carry** (Lessons, N2; Sheet :154-157):
  - an elbow of 73.5 to 100 deg (26.5 of range) where a sprinter's moves 83;
  - the made-up numbers past Froude 1.36 (mean 90, abduction 15, hand to the midline 25, the twist share, the bisection solver);
  - arms turned with the chest as one piece.
- **The hand toward the midline:** not on file as a number. It is measured from the CMU clips before code, or left at the curves' own path.
  It is not set by eye.

### 2.5 The head, and the look

| what | source | on file | ours? |
|---|---|---|---|
| The head turns less than the shoulders with the stride: 0.26 of the shoulders' yaw running at 3.0 m/s (0.64 walking) | Pontzer 2009 | `scout_upper_body_and_gaze.md:74-75`, opened | n = 10, nothing above 3.0 m/s |
| The head pitches at most about 14 +-4 deg in a run, out of phase with its vertical travel by about 180 | Pozzo 1990 via Dunbar 2008 | `scout_upper_body_and_gaze.md:88-94`, opened | Pozzo's run was in place |
| **The look: gaze first, then the head, then the body; the head precedes the shoulders and the torso.** Gaze leads the pelvis by 557 ms, the head by 264 ms; toward a curve, gaze 27.5 and head 14.8 deg | Authie et al. 2015 (CC BY) | `scout_upper_body_and_gaze.md:96-104`, opened | walkers at 0.8 m/s: **its use for a runner is ours** |
| In turns the head anticipates by about 200 ms, starting 0.2 to 0.6 s before the trunk at 90 deg | Grasso 1996; Sreenivasa 2008; Prévost 2002 | Sheet :166 | snippets |
| The eyes carry the first ~18 deg of a look; the trunk turns more than the neck in large turns, the neck stays well inside 60-70 deg | Stahl; Anastasopoulos | B8 :15-31 (Sheet :168) | standing |
| The neck and head each take half of a look, clamped to +-80 deg | runevision `HeadLookController.cs` (MPL-2.0: the idea only) | Sheet :172 | |
| The chest takes 0.35 of the look while moving | Overgrowth `aschar.as:4358-4392` | Sheet :175 | a floor in max(), not a measure |
| The chase already turns the head to the player first (at least 7 rad/s, at most 1.6 rad off the heading) | the chase | Lessons, N2, RIGHT (his 163) | kept in the chase |

- **Built:** the stride's twist reaches the head at Pontzer's 0.26 of the shoulders'. On top of that, the look: the head is set first, then
  the neck, then a share of the chest, by his 163 and Authie's order.
  - The shares are the runevision halves for neck and head, and Overgrowth's 0.35 floor for the chest. **The shares are ours,** printed,
    and put to his eye.
  - The models have no eye bones, so the first ~18 deg of a look is the view's, not the drawn head's (B8 :58-60).
- **The hunter's head stays humanlike** (his 169). It takes no cue of its own, and its look is the same law as the runner's.
- **Not carried** (Sheet :192-197): the 0.55 head share of the thorax's twist, the head roll out of the turn, the 0.22 s spring, the 0.52 rad
  "new look" jump, the 0.25 spine pitch when looking down, the body hung from the camera.

### 2.6 First person (on the runner)

- **A camera on that body, steadied apart from the head bone.** No shipped game keeps a raw camera on a head bone. The plan rules it
  (`:115-117`), and B8 §5 gives the games' ways.
- **The view carries the eyes' ~18 deg** that the drawn head does not.

### 2.7 Breath (last, and small)

- **The breath locks to the stride,** 2 strides a breath the most common (Daley, Bramble & Carrier 2013, Sheet :92). Its sizes are
  Overgrowth's (chest 0.01 up and forward, Sheet :91).
- It is drawn only after everything above has been seen, and it is the first thing cut if it reads as noise.

### 2.8 One spring layer

- **Every eased quantity** (the lean, the arm angles, the look) steps through one damped spring that is exact at any time step: implicit
  Euler, denominator 1 + 2 h zeta omega + h^2 omega^2, from unity-cj-lib `NumericSpring.cs` (MIT, C#, the method only; Sheet :88). It runs
  on the simulation's 240 Hz tick. Overgrowth's springs do not convert to 240 Hz by changing dt (Sheet :88), which is why their half-lives
  are kept and their step is not.

## 3. What is OURS, where nothing published covers it

1. **The share of gravity's lean past Churchill's one speed and radius,** and how it changes with speed or radius (Sheet :223-224). The law
   atan(a/g) is physics; the share is ours.
2. **The sign of the pelvis-to-thorax phase** (Pontzer's is unsigned).
3. **The arm targets between 4.15 and 5.20 m/s and past 9.49 m/s;** that one runner's elbow stands for every runner, and for the hunter.
4. **The look's split between chest, neck and head:** no data (B8 :111).
5. **The joint between N1's planted foot and the whole body's roll** (2.1): no game source joins a planted-foot plan to a physics lean.
6. **Who draws the pelvis's turn,** N1 or N2 (2.2): a seam to settle with pane B.
7. **Breath's sizes** beyond Overgrowth's.

Each is printed beside the film as ours, and none is tuned by eye before he has seen it.

## 4. What would show it wrong (registered now, before any code)

**His eye first, the numbers to catch what it cannot:**
- **Failed on his terms if,** at N2's film, the hands still reach forward as it runs, or the elbows still do not read as swinging (the
  plan's own lines, `:91-92`, `:364`).
- **Failed on his terms if,** in the film's turn, the body still does not lean into it "like a bird or a space ship banking" (220), or
  leans before it has turned (151).

**Printed beside the film, each with its source's figure:**
- **The elbow's range at each speed the course runs, beside Dorn's** (67.1 / 68.6 / 83.0 deg at 5.20 / 7.00 / 9.49 m/s; least and most
  angle; where in the cycle it folds most, Dorn's near 40%).
  - **Bar:** each speed's range within 10 deg of Dorn's at that speed, the fold within 10% of the cycle. **The bar is ours:** n = 1, marker
    error about +-3 deg.
  - Below 4.15 m/s: the yardstick's own CMU bars (elbow mean within 12.4 deg, shoulder ends within 3.7 / 7.0).
- **The shoulder's range beside Dorn's** (72.6 / 92.9 / 119.0 deg).
- **The head's yaw over the shoulders' at a run,** beside Pontzer's 0.26 (at 3.0 m/s; printed above that speed, not barred).
- **The lean on the course's bend:**
  - the body's roll over gravity's, beside Churchill's 0.73 to 0.96;
  - the trunk's share beside his 0.89;
  - and the trunk's angle in space never more than the body's (no double count).
- **N1's own rows with N2 on:** a planted heel or toe moves at most 20 mm, a foot is never more than 5 mm under the floor
  (`scout_evaluation.md:142-143`). The upper body must not move the planted feet. If the lean's seam moves them, it is caught here.
- **The picture changes nothing a kept run replays** (the plan's test).

**Unwelcome, named now:**
- **The sprinter's elbow is one runner.** If his eye says the arms now swing too much, or swing like one person, the source is n = 1, and
  the next is Ralph Mann's 200 m finalists (84 deg fast, 67 slower, Sheet :140). That source is secondary only and is opened before it is
  used.
- **The pelvis's turn changes N1's stride.** If N1's rows go red with it on, the seam of 2.2 is the cause, and pane B is told before
  anything is tuned.

## 5. Lessons used (the plan's rule: a stage's page says which it used)

- **N2 RIGHT:**
  - Bruening's range and Otsuka's flare (his 186), kept within the speeds measured;
  - the lean's ease, Overgrowth's half-lives;
  - the head first, the chase's own look.
- **N2 WRONG, each not done:**
  - the 26.5 deg elbow past Froude 1.36;
  - arms turned with the chest;
  - the head's 0.55 share;
  - exact antiphase;
  - the look spread from a sample's slider;
  - the 1/5.8 lean and the feet held under the hips;
  - the spine bowed when looking down;
  - first person hung from the camera.
- **N1 WRONG that binds N2:** the picture's clock is the simulation's tick.
- **N5 RIGHT as a rule:** physics follows, it does not lead (his 151). The lean follows the measured acceleration.
- **The method:**
  - search the shelf before a finding: the elbow at a sprint was on the shelf, and the plan's first line missed it;
  - every number with its source or marked ours;
  - no law laid over an old pose function.

## 6. Before code (in order, once he has seen the legs' film)

1. **His words on the legs' film,** read; this page turned by them if they bear on it.
2. **Pane B and I settle the two seams:** who draws the pelvis's turn, and how the whole-body roll meets the planted feet.
3. **Measured, not guessed:**
   - the trunk's forward lean by speed, from Dorn's markers and the CMU clips;
   - the hand's path toward the midline, from the CMU clips;
   - Perpiñá-Martínez 2023's speed for its 6.5 / 14.28 deg, read at source.
4. **Then the build,** with the rows of section 4 red first where a number can be red.

---

## The "before code" list, worked (the plan's section of 15:50, hash-object 8b53f735)

**The seams:** proposed in writing for pane B's answer, `loop/n2_seams_with_n1_A_2026-11-15.md` (git-blob 2580a214).
- **Seam 1:** N1 draws the pelvis's turn, measured from its own runners.
- **Seam 2:** N2 computes the lean, N1 carries it in the feet and pelvis, and N2 draws everything above the pelvis in space.
- **B's answer is not in yet.** The seams are not settled until it is, and no code begins before.

### A correction to section 2.2 (and to E's sheet, :78), found by reading Perpiñá-Martínez 2023 at source

Read at PMC9961938, its Methods, Table 2 and Abstract (the CEU repository's PDF link redirected to a localhost address and was not
followed).
- **The 6.5 deg is pelvic TILT,** male, at the fast level: "The kinematic range in males was 5.92°–6.50°, according to tilt".
- **Its pelvic ROTATION is a whole range of 9.96 to 16.13 deg** by sex and speed: males 10.64 / 9.96 / 13.60, females 13.21 / 15.74 /
  16.13, at slow / medium / fast.
- **Its speeds:** self-selected, slow about 8.75-9.98 km/h, fast above 11.71 (males) or 10.11 (females) km/h, so about 2.4 to 3.3 m/s and
  up.
- **Its size and instrument:** 101 runners, one IMU at S1.
- **It reports NO thorax figure;** 14.28 is not in it. So page 2.2's "pelvis 6.5 deg each way, thorax 14.28 deg each way (Perpiñá-Martínez
  2023, Table 1)" is wrong as attributed. The thorax figure must be Ford 2013's, unread by me.
- **The measure below replaces both** as the source for N2. Perpiñá-Martínez's pelvic rotation range stays as a many-runner check at its
  slower speeds.

### The three measures, from Dorn, Schache & Pandy 2012's markers

Subject JA1, the SimTK package at `G:\consonance-scratch\simtk_ja1`, MIT as recorded by the sprint reference.
- **One runner, two strides a trial** (one at 7.00 m/s), each from the file's own right Foot Strike events.
- **Method:** `n2_measure.js` beside this page, a C3D reader written from the format's layout, so anyone can re-run it. Output:
  `n2_measure.txt`.
- **Axes:** running is +Y and vertical +Z, the sprint reference's reading of this package.

**1. The trunk's forward lean by speed** (the SACR-to-C7 line against the vertical, less its standing lean of 4.72 deg, the static trial
JA1Static05, 647 frames):

| speed | mean lean over the stride, less standing | its swing over the stride (raw) |
|---|---|---|
| 3.56 m/s | 6.5 / 6.0 deg | 7.7 to 15.3 deg |
| 5.20 m/s | 6.1 / 5.6 | 6.7 to 15.5 |
| 7.00 m/s | 4.8 | 5.7 to 15.2 |
| 9.49 m/s | 11.9 / 10.7 | 9.6 to 21.3 |

The lean rises and falls twice a stride, most near 10-15% and 60-70%, least near 30-40% and 80-90%.
- **N2 draws the mean by speed and leaves the swing to the stride.** The swing is ours to draw or not, said here.
- This replaces "zero until measured" (page 2.3). Below 3.56 m/s, the CMU clips would extend it; they are not on this disk and were not
  fetched.

**2. The hand's path toward the midline** (the wrist marker's distance from the trunk's midline, the mean of SACR and C7 across, + on its own
side):
- **The wrist never crosses the midline at any speed.** Right wrist, closest: 17.3 / 16.9 cm at 3.56 m/s, 16.5 / 17.2 at 5.20, 11.6 at 7.00,
  12.2 / 13.3 at 9.49, always near 30-40% of the stride (the forward swing). Farthest: 30 to 35 cm. The left wrist is the same, at its own
  half-cycle (9.2 to 17.7 cm closest).
- **For his "hands reach forward" falsifier:** the wrist's reach ahead of C7 at most is 28.6 / 28.7 cm (3.56), 29.9 / 30.9 (5.20), 45.3
  (7.00), 45.3 / 44.6 (9.49). Behind, it goes to -16 to -43 cm.
- **This is the hand's measured path:** N2's arm is solved so the wrist follows it. A drawn wrist that stays forward of C7 through the stride,
  or crosses the midline, is wrong by this measure.

**3. The pelvis's and the thorax's turn about the vertical** (the RASI-LASI and RSH-LSH lines in the ground plane, each less its stride mean):

| speed | pelvis, whole range | thorax, whole range | thorax / pelvis | the thorax against the pelvis |
|---|---|---|---|---|
| 3.56 m/s | 7.7 / 8.0 deg | 16.2 / 15.7 | 2.11 / 1.97 | opposed, about 32-38% of the stride later |
| 5.20 m/s | 11.1 / 11.6 | 15.1 / 13.7 | 1.36 / 1.19 | opposed, 25-29% later |
| 7.00 m/s | 16.1 | 14.6 | 0.90 | opposed, 23% later |
| 9.49 m/s | 26.9 / 22.7 | 12.4 / 9.6 | 0.46 / 0.42 | opposed, 26-28% later |

- **The thorax turns opposite the pelvis and LAGS it by about a quarter of a stride,** 85 to 115 deg of the cycle.
  - **That signs Pontzer's unsigned 93.9 deg,** which page 2.2 and section 3, item 2 had marked ours.
  - The best-fit routine reported 3.56 m/s (both strides) and 9.49 m/s stride 1 as "in step" at a shift of 88% and 76%. That is the same
    opposed curve half a stride on (38% and 26%), so every stride reads opposed.
- **The pelvis's turn grows with speed, and the thorax's stays near 10 to 16 deg,** so the ratio falls from about 2 to under 0.5. One runner.
  - Perpiñá-Martínez's many-runner pelvic rotation, 10 to 16 deg at 2.4-3.3 m/s and up, is larger than this runner's 8 deg at 3.56 m/s.
  - So the pelvis's size is the one figure here to take from many runners where they exist (Fukuchi's 28, seam 1) before this one runner.
- **What N2 builds from it:** the thorax's counter-turn on N1's pelvis, at the measured ratio and lag by speed. If seam 1 goes N2's way
  instead, the pelvis's turn comes from Fukuchi's runners at 2.5-4.5 m/s and this runner above.

**What page 3 still calls ours, after these measures:**
- the lean's share past Churchill's one bend;
- the arm targets between 4.15 and 5.20 m/s (now 3.56 to 5.20 from one runner) and past 9.49;
- the look's split;
- the planted-foot joint with the lean (seam 2);
- breath's sizes.

The sign of the pelvis-to-thorax phase is no longer ours; it is measured, n = 1.
