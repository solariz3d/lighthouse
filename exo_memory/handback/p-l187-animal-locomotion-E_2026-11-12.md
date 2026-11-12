# p-l187-animal-locomotion-E: locomotion laws from animals and humans (his items 166, 165), for C's stride (L181) and A's turning limit (L182). Pane E, on L, 2026-11-12, written from 04:3x local (`date`)

**Packet:** the chair's L187, 10:23:57Z. **Plan:** `loop/plan_l187_animal_locomotion_2026-11-12.md` (02805ac8), read whole. Items 163, 164 and 165 were read in the brief.
**Research only; nothing built.**
**Marking:**
- **[read full]** is the full text, read;
- **[read abstract]** is only the abstract, read (PubMed E-utilities, verbatim);
- **[via X]** is a figure quoted by a later paper I read, X, with the original unread;
- **[unread]**: I could not get it;
- **[computed]** is the law evaluated by me (`node -e`, below);
- **[inferred]** is mine.

## Sources and their terms

| source | status | terms |
|---|---|---|
| Chang & Kram 2007, *J Exp Biol* 210:971-982, doi 10.1242/jeb.02728 | **[read full]**: the journal page through WebFetch. Eqn 5, Table 1 and the methods sentences were copied exactly. The last 40k characters of the page were not read. | © The Company of Biologists 2007 |
| Weyand, Sternlight, Bellizzi & Wright 2000, *J Appl Physiol* 89:1991-1999 | **[read abstract]** (PubMed 11053354). The full text returned 403. | © the American Physiological Society |
| Usherwood & Wilson 2005, *Nature* 438:753-754, doi 10.1038/438753a | **[read abstract]** (PubMed 16341003). The full text is paywalled. **The bend's radius and the speeds are unread.** | © Nature Publishing Group |
| Alexander & Jayes 1983 | **[unread]**: the original returned 403. **Correction to the plan: it is *J. Zool.* 201:135-152 (doi 10.1111/j.1469-7998.1983.tb04266.x), not *J Exp Biol* 115** (Wiley and scilit records). | © Zoological Society of London / Wiley |
| Alexander 1976, *Nature* 261:129-130 ("Estimates of speeds of dinosaurs") | **[via Mazzetta & Blanco 2001]**, *Acta Palaeontologica Polonica* 46(2):235-246, read full (pdftotext) | APP is an open-access journal; I did not read a licence line in the PDF |
| Donelan & Kram 1997, *J Exp Biol* 200:3193-3201 ("The effect of reduced gravity on the kinematics of human walking: a test of the dynamic similarity hypothesis for locomotion") | **[read full]** (pdftotext, sfu.ca copy) | © The Company of Biologists 1997 |
| Heglund & Taylor 1988, *J Exp Biol* 138:301-318 | **[read abstract]** (PubMed 3193059). The full text shows the abstract only. | © The Company of Biologists 1988 |
| CMU Graphics Lab Motion Capture Database | **[read]**: the site's own terms (mocap.cs.cmu.edu) | the CMU terms, quoted in §5 |
| RGBD-Dog (Kearney et al., CVPR 2020), github CAMERA-Bath/RGBD-Dog | **[read]**: the repository has **no licence file**; it ships `Data_Release_Form_RGBDDog_CVPR_2020.pdf`. The form itself is unread. | a release form, not an open licence |

## 1. Stride against speed, any body size

- **The law [via Mazzetta & Blanco 2001, quoting Alexander 1976]:**
  - relative stride length `λ/h` is tied to the Froude number `Fr = v²/(g·h)`, where **h is "the height of the hip joint from the ground in normal standing"** (APP p. 236, l.31);
  - their speed form: "v = 0.25 s^1.67 h^-1.17" (s = stride, m).
  - The search-returned citations (Ruiz & Torices 2013, unread) give the stride form `λ/h ≈ 2.3 (v²/gh)^0.3` and speed `v ≈ 0.25 g^0.5 λ^1.67 h^-1.17`.
  - **[computed]** Inverting `λ/h = 2.3 Fr^0.3` gives exactly `v = 0.249 g^0.5 λ^1.667 h^-1.167`, so the two forms agree. **Mazzetta & Blanco's printed form drops the g^0.5**; my reading is that the factor was lost in their typesetting or folded into the constant. The librarian's half-remembered "2.3 × Fr^0.3" is **right**, via these two sources.
  - **Where it holds:** fitted on extant mammals (the APP text: "derived from observations of mammals"). The search summaries of A&J 1983 (unread) say it holds best **within cursorial quadrupeds** and less well between cursorial and non-cursorial.
- **Disagreement, read full:** **Donelan & Kram 1997** tested it on humans walking in simulated reduced gravity (0.25–1.0 g, Fr 0.1–0.4). At equal Fr the duty factor matched (within 2 %), but relative stride length **"differed by as much as 67 %"**; they "reject" the hypothesis for stride. **For our game this matters only if gravity changes** (dreams, item 29's flight); at 1 g the law's g is constant.
- **Stride frequency against size [read abstract, Heglund & Taylor 1988]:** 16 species from "30 g mice to 200 kg horses". The equivalent speeds "scale with about the 0.2 power of body mass", and the frequencies "the -0.15 power". Constants are unread.
- **Humans at top speed [read abstract, Weyand 2000]:** 33 runners, top speeds 6.2 to 11.1 m/s. Swing time "did not vary (P = 0.18)", and the force was "1.26 times greater" for the faster. **So a faster human runs with longer strides at about the same leg-swing time, not faster legs.**

**[computed] Our player body** (hip height `h = thigh 0.46 + shin 0.45 + ankle 0.07 = 0.98 m`, `game/body.h` `BodyBuild`), Alexander's law at 1 g:

| v m/s | Fr | stride λ (2 steps) | step | stride rate | λ/h |
|---|---|---|---|---|---|
| 1.5 | 0.23 | 1.46 m | 0.73 m | 1.03 Hz | 1.49 |
| 3 | 0.94 | 2.21 | 1.10 | 1.36 | 2.25 |
| 5 | 2.60 | 3.00 | 1.50 | 1.67 | 3.06 |
| 7 | 5.10 | 3.67 | 1.84 | 1.91 | 3.75 |
| 8.75 (base peak) | 7.96 | 4.20 | 2.10 | 2.08 | 4.29 |
| 10.75 (full surge) | 12.0 | 4.75 | 2.38 | 2.26 | 4.85 |

**[inferred] Against item 163 and the code:** `gait_phase_per_metre` sets a step of about **0.8 leg lengths at every speed** (checked, `game/model_rig.cpp:578`, main `add21fe`). With leg = thigh + shin = 0.91 m (the code's own `leg`), the law gives a step of **0.80 leg lengths at 1.5 m/s (0.73 m) and 2.3 at the base peak (2.10 m)**, so the fixed step is right only at a slow walk. **The research agrees with him** ("needs to take longer strides").
- **Caveat:** 8.75–10.75 m/s is Fr 8–12. That is far above Mazzetta & Blanco's trackway range, but inside the mammal data Alexander fitted (his gallops). Whether it holds that high **for a human** is not in what I read. Weyand's full text (unread) has the human figures.

## 2. Gait changes

- **[via Mazzetta & Blanco, quoting Alexander 1976 and Thulborn]:** mammals change "from a walk to a run or trot when the ratio of stride length to hip height (s/h) reaches a value of about 2.0"; Thulborn's bands are "walk (s/h < 2.0), trot (2.0–2.9), run (> 2.9)".
- **[computed] As Froude numbers,** through the law: s/h 2.0 → **Fr ≈ 0.63**; s/h 2.9 → **Fr ≈ 2.2**.
- **Humans:** the walk-run transition at about **Fr 0.5** is in the search summaries only (Kram et al. 1997, unread). Donelan & Kram 1997 [read full] cites that humans in reduced gravity "change gait, from a walk to a run, at similar Froude numbers", but gives no value in what I read.
- **[computed]** For h 0.98 m, Fr 0.5 is **2.19 m/s**.

## 3. Cornering: human against hunting animal

- **Humans [read full, Chang & Kram 2007]:**
  - "five recreationally fit men", "circular tracks of 1, 2, 3, 4 and 6 m radii", flat (unbanked);
  - maximum speeds (Table 1, untethered): straight **7.70**; 6 m **5.66**; 4 m **5.07**; 3 m **4.49**; 2 m **3.77**; 1 m **2.99** m/s.
  - The fit, **Eqn 5:** `V_curve/V_o = 0.746 (R·g/V_o²)^0.363±0.012`.
  - The cause: the **inside leg** produces less peak force on tight curves (1.87 BW at 1 m against 2.48 at 6 m), against the hypothesis that the straight-path force is reached.
- **Greyhounds [read abstract, Usherwood & Wilson 2005]:** "on entering a tight bend, greyhounds do not change their foot-contact timings, and so have to withstand a 65% increase in limb forces"; they "power locomotion by torque about the hips". Humans "change the duration of foot contact to spread the time over which the load is applied". **The bend's radius and the dogs' speeds are not in the abstract** (unread).
- **[inferred] A bound no body escapes:** on a flat turn the side force is `m·v²/R`, and friction caps it at `μ·m·g`, so **`v ≤ √(μ g R)`**. That is physics, not a source here. At μ = 1: R 1.5 m → **3.8 m/s**; R 3 m → **5.4 m/s**. **"Keeps speed on a bend" (the greyhound) is about a race-track bend, where the bound is far above its speed. In a doorway (R 1–3 m) the bound itself is near Chang & Kram's human speeds**, so even an animal law cannot keep 9 m/s round a doorway corner without sliding.

**[computed] Eqn 5 at our bodies' straight speeds** (extrapolated: the fit was made with V_o = 7.70 only):

| straight V_o | R 1 | R 1.5 | R 2 | R 3 | R 4.5 | R 6 m |
|---|---|---|---|---|---|---|
| 7.70 (the study) | 2.99 | 3.46 | 3.84 | 4.45 | 5.16 | 5.73 |
| 8.75 (player peak) | 3.10 | 3.59 | 3.98 | 4.61 | 5.34 | 5.93 |
| 9.0 (hunter, normal, 0 min) | 3.12 | 3.61 | 4.01 | 4.65 | 5.39 | 5.98 |
| 11.1 | 3.30 | 3.83 | 4.25 | 4.92 | 5.70 | 6.33 |
| friction bound √(gR) | 3.13 | 3.84 | 4.43 | 5.42 | 6.64 | 7.67 |

- The 7.70 row reproduces Table 1 within 0.07 m/s, which checks my evaluation.
- **[inferred] Against item 164** ("turn way too fast keeping speed"): the research agrees. A human-shaped hunter at 9 m/s should be near **4 m/s round a 2 m corner**. A's measured "858 m given back at corners" (L172) says ours loses some speed there, but item 164 says not enough, and not in the right way. **The physics bound says even a greyhound-law hunter is near the human figure in a doorway.** The animal law only differs on wide bends (R ≫ 6 m: atria, long curves), where it would keep speed and a human would not.

## 4. Arm and torso swing

- **Not read this lap.** C's "Active Arm Swing During Running" (L176/L179) is C's source. I found and read no quadruped trunk counter-rotation source. **[unread]**: nothing claimed.

## 5. Motion data: may it ship?

- **CMU mocap [read, the site's terms]:**
  - "This data is free for use in research projects. You may include this data in commercially-sold products, but you may not resell this data directly, even in converted form."
  - They ask for an acknowledgement ("The data used in this project was obtained from mocap.cs.cmu.edu …").
  - **[inferred]** It can ship inside the game as motion, with the acknowledgement; it cannot be sold as data. Humans only.
- **Dogs (RGBD-Dog) [read]:** no licence file, a data release form instead (unread). Treat as **study only** until the form is read. Another dog set in the search (DigiDogs) is "non-commercial research purposes only" (search summary, unread).
- **[inferred]** No open animal locomotion data cleared for shipping was found. The animal laws (§1-§3) are equations, which carry no licence. **The law ships; the data does not.**

## 6. What changes in L181 and L182

- **L181 (C's stride, from Weyand):**
  - Alexander's law **agrees** with Weyand (longer strides with speed, swing time about constant). It adds a **closed form for any leg length**: `step = 1.15 h (v²/gh)^0.3`. So the hunter, the lesser chasers and the player each get their stride from their own hip height, with no per-body table.
  - Weyand's full text could replace it for humans above Fr 8 if C reads it. Alexander is the swappable law the plan asked for.
- **L182 (A's turning limit, from Chang & Kram):**
  - **Eqn 5 is now read, with its constants:** `V_curve = V_o · 0.746 (R g / V_o²)^0.363`, measured R 1–6 m.
  - [inferred] Cap it by `√(μ g R)` and by `V_o`. Above R 6 m it is extrapolated.
  - **A greyhound option** would hold `V_o` on bends **only where `√(μ g R)` allows it**; so the same at doorways, faster on wide curves.

## 7. For him (his calls)

- **The player:** human laws. Alexander's stride and Chang & Kram's corners agree with his items 163 and 164.
- **The hunter, three options:**
  - **(H1) human** (Chang & Kram everywhere);
  - **(H2) hunting animal** (greyhound: speed held on wide bends, friction-bound in doorways). That is "non-human motion" where it is visible, the long curves, and fair at doorways;
  - **(H3) per kind:** the hunter H2, the lesser chasers human, the sprinter something looser.
- [inferred] H2 fits "human silhouette, non-human motion" and his 164 at once, because a doorway limits every body.
- **Unread, worth reading before H2 is built:** Usherwood & Wilson's full text (the bend radius and speeds), and any cheetah turning data (Wilson et al. 2013, *Nature*, not searched this lap).

## 8. Mixing: animal traits on human bodies, for the uncanny (his item 167; the chair's addition, 10:26:30Z; plan tail bcac7d6). Written 04:4x local

### 8.1 What the uncanny sources say, read in full where open

| source | status | terms |
|---|---|---|
| Kätsyri, Förger, Mäkäräinen & Takala 2015, *Front Psychol* 6:390, PMC4392592 | **[read full]** (PMC full text through E-utilities; "l.N" = the line of my sentence split) | **CC BY 4.0** |
| Saygin, Chaminade, Ishiguro, Driver & Frith 2012, *Soc Cogn Affect Neurosci* 7:413-422, PMC3324571 | **[read full]** (the same way) | **CC BY-NC 3.0** |
| Thompson, Trafton & McKnight 2011, *Perception* 40:695-704, doi 10.1068/p6900 | **[read abstract]** (PubMed 21936298) | © Pion |
| Piwek, McKay & Pollick 2014, *Cognition* 130:271-277 | **[read abstract]** (PubMed 24374019) | © Elsevier |

- **Mismatch is the best-supported road, but its evidence is mostly STATIC.**
  - Kätsyri l.326: "good support for the perceptual mismatch hypotheses related to both inconsistent realism levels (H4a; 4 out of 4 studies) and sensitivity to atypical features (H4b; 3 out of 4 studies)".
  - **l.366:** "refined uncanny valley hypotheses … have up to date been studied using only static stimuli, and that movement could possibly amplify their effects."
  - Their two clearest cases are face cues: "enlarged eyes presented on human faces" (l.391).
- **Movement on its own makes no valley.**
  - Kätsyri l.303: in the two movement studies, "more humanlike movement was found to elicit higher affinity … whereas a nonlinear uncanny valley curve … was not observed".
  - Thompson 2011 [abstract]: with three kinematic features of walking avatars varied, ratings "changed monotonically".
  - Piwek 2014 [abstract]: "improving the motion quality systematically improved the acceptability"; the deepest-valley character "became more acceptable when it was animated".
  - Kätsyri l.305: movement effects appeared only "specific to plausible outlier characters (ill-looking face …; and zombie character in Piwek et al., 2014)". **A horror figure is an outlier character.**
- **Motion that mismatches appearance has a measured effect, in the brain.**
  - Saygin l.6, l.8: participants watched "a human (biological appearance and movement), a robot (mechanical appearance and movement) or an android (biological appearance, mechanical movement)". The responses were distinctive "to the mismatch between appearance and motion", "notably in bilateral anterior intraparietal sulcus".
  - l.9, read as "increased prediction error as the brain negotiates an agent that appears human, but does not move biologically".
  - **Its limits:**
    - 20 adults (l.99);
    - the measure is fMRI repetition suppression, **not eeriness ratings**;
    - the non-human motion is a **robot's mechanical motion**, with identical kinematics in both robot conditions (l.114), **not an animal's**.
- **[inferred] So, for item 167:**
  - The sources support **a clear, categorical disagreement between a human body and how it moves** (Saygin; Kätsyri's H4a, by extension from static cues).
  - They **do not** support motion made uniformly "a bit off" (Thompson; Piwek).
  - **No source I read tests ANIMAL motion on a human body.** Whether that is eerie, and not merely strange, is his eye's call; that is the plan's own test.
  - **One cue per body, strong and consistent, beats many weak ones**, by the same reading. Whether mismatches compound is not tested in what I read (Kätsyri l.390 leaves "whether any kind of perceptual mismatch would lead to the uncanny valley" open).

### 8.2 A catalogue of animal traits, each with its locomotion source

| trait | what it looks like on a human body | source (status, terms) | touches |
|---|---|---|---|
| **T1, greyhound cornering:** contact timing held on a bend | it goes round a wide curve at full stride with no slowdown and no shortened step, where a human visibly brakes and spreads the step | Usherwood & Wilson 2005 [read abstract]: greyhounds "do not change their foot-contact timings … withstand a 65% increase in limb forces". © NPG | L182 (the turn law, §3's H2); `gait_pose` (no step change on the curve) |
| **T2, bird head stabilisation:** the head held still in space, then thrust | the head stays fixed in the world while the body moves under it, then snaps forward: a hold, then a thrust | Ortega, Stoppa, Güntürkün & Troje 2009, *Exp Brain Res* 199:313 [read abstract]: "During the hold phase, the head of the bird remains stable in space, while during the thrust phase, the head is rapidly moved forward." © Springer. Theunissen & Troje 2017, *Front Neurosci* 11:551 [read abstract]: in translations the head was "almost perfectly sta[bilised]" (PMC, open; the full text was not read) | L181's chain (the neck and head end); the head look (L180's head yaw) |
| **T3, galloping back flex:** the spine bends and extends each stride | the trunk folds and unfolds in the sagittal plane with each stride, gathering and extending, where a human trunk stays nearly rigid | Schilling & Hackert 2006, *J Exp Biol* 209:3925 [read abstract]: "maximum flexion of the spine was observed in the interval between the last third of the swing phase and touch-down", over "7±1 presacral intervertebral joints". © CoB. Kamimura et al. 2021 *Sci Rep* / 2022 *Front Bioeng* [read abstract]: cheetahs gallop with "large spine bending movement" and two flight types, "gathered and extended" (open-access journals; licence line not read; the full text was not read) | L181's chain (the pelvis-chest link; it needs a spine joint our 21-joint body lacks: Chest–Pelvis is one segment, `game/body.h:38-43`) |
| **T4, insect gait timing:** stride rate nearly fixed, speed from stride length; tripod at speed | the legs keep one fixed rhythm whatever the speed, so it covers ground by reaching further, never by stepping faster | Full & Tu 1991, *J Exp Biol* 156:215 [read abstract]: "High speeds were attained by increasing stride length, whereas stride frequency showed little increase with speed." © CoB | `gait_pose` stride law (§1 swaps for a fixed-rate law) |
| **T5, big-cat stalk:** low, slow, still between steps | — | **No source found or read this lap.** Listed only because the plan named it; **unsourced**. | — |

- **[inferred] T4 is close to human sprinting** (Weyand: swing time constant, speed from force and stride). On a human it may read as ordinary, not uncanny.
- **T2 and T3 disagree most clearly with a human shape**: a human head bobs and turns with the body, and a human trunk does not fold per stride. They are also the two that match the sources' "clear mismatch".

### 8.3 The first game's "non-human" choices, against the findings

dreamzone-rt `9d98b64` `src/main.cpp:6350-6356` (read): "detuned toward wrong: asymmetric leg phase, 1.22x limb overspeed (legs churn faster than travel justifies), head pinned down, no head stabilization. Human silhouette, non-human motion."

| choice | kind of cue, by the sources | verdict [inferred] |
|---|---|---|
| asymmetric leg phase | a **gradient** degradation of a human gait | **Weak by Thompson 2011** ("monotonic", no valley) unless the asymmetry is large enough to read as a categorical difference (a lope, not a limp). |
| 1.22x limb overspeed | a gradient degradation; and **rejected by him** (item 163, "moving too fast for the legs to keep up") | **Out.** No source argues it back; Alexander/Weyand say longer strides, not faster legs. |
| head pinned down, no head stabilisation | a posture, plus the **absence** of stabilisation (the human norm is a stabilised head) | **Half right.** Removing human stabilisation is a degradation. **T2 (a bird's hold-and-thrust) is the categorical version**: a head that clearly stabilises like no human does. |
| "Human silhouette, non-human motion" | Saygin's android condition, in words | **The principle is the sources'**; the first game's means (detuning) is the weak form. |

### 8.4 Per-entity options for him (options only; each one trait, chosen to disagree clearly)

| entity (L172 kit) | option A | option B |
|---|---|---|
| **Hunter** | **T2 head hold** (its head stays fixed on the player while the body runs and turns under it; the omniscient one, item 65) | **T1 greyhound cornering** on wide curves (§3's H2) |
| **Sprinter** | **T3 back flex** (a galloping fold, reckless, `corner_care` 0.5) | T1 |
| **Interceptor** | T2 (it watches where you will be) | — |
| **Pack** | **T4 fixed rhythm**, all three bodies in one rhythm (a swarm cue) | T3 |
| **Climber / crawler** | T4 (the insect, "ignores the waking world's rules") | — |
| **Stalker** | T2 (still head, between glances) | T5 if a source is found |
| **Charger** | T3 (a bull-like fold into the charge) | — |

- **[inferred]** One trait per kind keeps each cue clear (§8.1). The same trait on two kinds (T2 on the hunter and the interceptor) is his call: it trades distinctness for a family look.
- **Costs** (read from the rig, not built):
  - T1 is L182's law;
  - T2 is a head-target change in L181's chain;
  - T3 needs a spine joint the body does not have (a new joint, `game/body.h`);
  - T4 is a stride-law swap in `gait_pose`.
- **Test:** his eye, as the plan says. The mechanical bars (replays, the lean timing) guard; they do not measure eeriness.

## 9. The H2 law: the hunter corners like a hunting animal (his call, brief 168; the chair's 10:31:46Z). Written 2026-11-12 04:5x local

### 9.1 What I could read

| source | status | terms |
|---|---|---|
| Usherwood & Wilson 2005, *Nature* 438:753 | **abstract only, again.** The full text is paywalled (Springer and Nature); no repository copy was found. **The bend's radius, the dogs' speeds and the stride figures remain UNREAD.** | © NPG |
| Tan & Wilson 2011, *Proc R Soc B* 278:2105, doi 10.1098/rspb.2010.2395 (horses, polo and racing) | **abstract** (PubMed 21147799). The PMC page gave a captcha and Europe PMC no full text: **full text unread.** | © The Royal Society |
| Wilson, Lowe, Roskilly, Hudson, Golabek & McNutt 2013, *Nature* 498:185, doi 10.1038/nature12295 (wild cheetahs) | **abstract** (PubMed 23765495). The RVC repository returned 403. A copy at originalwisdom.com came back as **a third-party summary page** ("© … Original Wisdom"), not the paper, so its figures are **[press, unverified]**. | © NPG |

**Read:**
- **Greyhounds hold stride and speed on a bend.**
  - Usherwood & Wilson [abstract]: "on entering a tight bend, greyhounds do not change their foot-contact timings, and so have to withstand a 65% increase in limb forces".
  - Tan & Wilson [abstract], restating it: "greyhounds do not slow down or change stride parameters during bend running".
- **Horses show two regimes** (Tan & Wilson [abstract]):
  - "During high-speed turns of large radius horizontal speed was lower on the bend, as would be predicted from a model assuming a limb force limit";
  - "During small radius turns the angular velocity of heading decreased with increasing speed in a manner consistent with the coefficient of friction of the hoof-surface interaction setting the limit to centripetal force to avoid slipping".
- **Cheetahs** (Wilson 2013 [abstract]): 367 runs of 5 wild cheetahs, top speed 25.9 m/s, "some of the highest measured values for lateral and forward acceleration, deceleration … for any terrestrial mammal".
  - **[press, unverified]**, the summary page: lateral acceleration "often exceeded 13 m per second per second at speeds under 17 m per second"; they "often slowed sharply before turning"; "slowing from 16 to 4 m per second … shrinks the turn radius from 19.7 m to 1.2 m".
  - [computed] Those last numbers are self-consistent at about 13 m/s² (16²/19.7 = 13.0; 4²/1.2 = 13.3).

### 9.2 The law, in Eqn 5's form

**`H2_hunting_animal(V_o, R; μ) = min(V_o, √(μ·g·R))`**

- **What it says:** no limb-force slowdown (the greyhound: contact timing and speed held on the bend). The only limit is **grip** (the horses' small-radius regime; the cheetah's grip-limited tight turns). Below the radius where grip binds, it slows exactly as friction requires; above it, it keeps the straight speed.
- **Swappable:**
  - the human law is **`H1_human(V_o, R) = min(V_o, 0.746·V_o·(R·g/V_o²)^0.363, √(g·R))`** (Chang & Kram Eqn 5, with the cap);
  - H2 takes the same arguments plus μ.
- **The dial μ** (the grip, as a multiple of g):
  - **1.0**, the friction bound used in §3 [inferred, not measured for any surface here];
  - **about 1.33**, the cheetah's figure [press, unverified, 13 m/s²].
  - [inferred] **μ is where "how monstrous" lives:** at 1.0 the hunter corners exactly at a physically possible limit for a human-shaped foot; above 1.0 it grips like no human can. That is a T1 mismatch (§8.2) the player can read.
- **Measured range, stated plainly:**
  - **the greyhound half is measured on "a tight bend" whose radius I have NOT read;**
  - the horse regimes on polo and race tracks, radii unread;
  - the cheetah figures cover 1.2–19.7 m at 4–16 m/s, **[press, unverified]**.
  - **Below about 1 m, and at our hunter's 9–13 m/s, nothing I read measured it.** The law is the sources' **shape** (no limb-force slowdown, grip-bound), not a fit.
- **[computed] Against the human law** (`scratchpad/l187/h2.js`), in m/s:

| R (m) | 1 | 1.5 | 2 | 3 | 4.5 | 6 | 10 | 20 |
|---|---|---|---|---|---|---|---|---|
| V_o 9, H1 human | 3.12 | 3.61 | 4.01 | 4.65 | 5.39 | 5.98 | 7.20 | 9.00 |
| V_o 9, H2 μ 1.0 | 3.13 | 3.84 | 4.43 | 5.42 | 6.64 | 7.67 | 9.00 | 9.00 |
| V_o 9, H2 μ 1.33 | 3.61 | 4.42 | 5.11 | 6.26 | 7.66 | 8.85 | 9.00 | 9.00 |
| V_o 11.1, H1 human | 3.13 | 3.83 | 4.25 | 4.92 | 5.70 | 6.33 | 7.62 | 9.80 |
| V_o 11.1, H2 μ 1.0 | 3.13 | 3.84 | 4.43 | 5.42 | 6.64 | 7.67 | 9.90 | 11.10 |
| V_o 11.1, H2 μ 1.33 | 3.61 | 4.42 | 5.11 | 6.26 | 7.66 | 8.85 | 11.10 | 11.10 |

- **H1 here includes the √(gR) cap**, so at R 1 m and V_o 11.1 it reads 3.13, not §3's uncapped 3.30. H1 beyond R 6 m is extrapolated.
- **The radius at which H2 keeps the full straight speed:**
  - μ 1.0: 8.3 m at V_o 9, 12.6 m at V_o 11.1;
  - μ 1.33: 6.2 m and 9.4 m.

**[inferred] What he will see:** in doorways and tight corridor turns (R 1–2 m) the H2 hunter is within about 0.5 m/s of a human at μ 1.0. **In rooms, atria and long curves (R 3–10 m) it is 1–2.5 m/s faster than a human** at the same straight speed, holding its stride where a human visibly brakes. That is item 168's "hunting animal" made visible where the space allows it, and still faithful to his item 164 (no free speed round tight corners).

### 9.3 What it needs from A's L182 [inferred]

- The turn law as a function of (V_o, R) per chaser kind, with H1 and H2 as named entries and μ per kind.
- **The cheetah's "slowed sharply before turning"** [press] is a braking behaviour, not a cornering law. It joins A's look-ahead (L-I1): brake to `H2(V_o, R_next)` before the corner, not in it.
- **Unread before it is called measured:** the Usherwood & Wilson full text (the radius), and Wilson 2013's full text (the lateral-acceleration figures, from the paper rather than a summary).

## Commands

    node -e '...'   # the Eqn 5 table, the friction bound and the stride table (`scratchpad/l187/laws.js` in pane E's session scratch; its output reproduces every table here)

## NOT verified

- Chang & Kram: the full text came through a WebFetch extraction (Eqn 5, Table 1 and the methods sentences copied "exactly" on a second fetch). It was not read as a PDF.
- Alexander & Jayes 1983 and Alexander 1976 are both unread; the law comes through Mazzetta & Blanco (read) and a search summary of Ruiz & Torices (unread).
- checked: the 0.8-leg-length step is `game/model_rig.cpp:578` at main `add21fe`: `const float step = std::max(0.3f, 0.8f * leg);   // a step of about 0.8 leg lengths`, in `gait_phase_per_metre`. That drives the drawn chasers; the player's own body keeps the camera's stride (`game/body.h`), not checked against the law here.

## Corrections

- **To the plan (the librarian's):** Alexander & Jayes 1983 is in *J. Zool.* 201:135-152, not *J Exp Biol* 115.

NEXT: librarian route §6 to C (L181) and A (L182), and put §7's H1/H2/H3 to him, when this pointer is read.
