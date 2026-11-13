# Scout: open motion data and its licences (2026-11-13)

1. NEW and the best fit: 100STYLE, CC BY 4.0 [2nd reader: RE-DERIVED for the licence label, G-con:180 and p-d659-models-E:136; contents, format and size are new], one actor, 100 styles (Neutral, Zombie, Cat, Dinosaur, Roadrunner, Crouched,
   OnToesCrouched...), each with forward, backward and sidestep walks and runs, BVH at 60 fps, 23 joints that map onto ours.
2. CMU's own pages, re-read: "free for all uses", "may be copied, modified, or redistributed without permission", but "may
   not resell this data directly"; it already holds run turns, sudden stops, run starts, sneaks, creeps, crawls and climbs.
3. Licensed for bands and for shipping: CMU, 100STYLE, ACCAD (CC BY 3.0), AddBiomechanics (CC BY 4.0, ~~273 people with
   force plates~~ [2nd reader: DOWNGRADED. 273 participants, but 57.55 of 71.47 h carry ground forces; some sources are mostly without, e.g. Lencioni 0.37 of 0.52 h (addbiomechanics.org/download_data.html, sources table)]), Fukuchi walking (CC BY 4.0), a working-dog trot set (CC BY 4.0). Look only: LAFAN1, Bandai Namco, AMASS, SFU, the MANN dog.
4. Design: a reference shelf in the yardstick, not in the game. Recordings become the game's 21 joints, then bands; human
   "uncanny" deltas measured as style minus Neutral (same actor). It costs 0 per character per frame until a constant ships.
5. First lap: a BVH reader for the yardstick, proved on 100STYLE Neutral_FR against CMU's runners. Red today: no BVH reader.

Scout, read-only. Marks: [read] I opened it; [summary] another file's or page's account; [inferred] mine; [ours] a proposal.
Game code: dreamzone-3 main **31d1c6d** [read: `git rev-parse --short HEAD`]. Record paths are under
`C:/Users/nname/Desktop/lighthouse/exo_memory/`; the six ground files are `G-his`, `G-src`, `G-phys`, `G-loco`, `G-code`,
`G-con` (the `ground_*.md` files in this folder). No outside request carried a local name, path or text.
Nothing here is legal advice; every "may ship" below is a reading of a licence text, for his word.

## (1) What the room already has for this aspect

- **The rule.** Item 150: "research open source alternatives, not to use, but to learn from" [read: briefs/
  dreamzone2_the_game.md:1102-1103]. Clips are out "by his pick" [read: loop/plan_l180_animation_from_the_sources_
  2026-11-12.md:67]. The yardstick's README: "Learn from, never use ... never shipped and never committed"
  [read: dreamzone-3 tools/yardstick/README.md:4-6 @31d1c6d]. So everything below is reference first.
- **Data in use, outside the repo, fetched by pinned script:** Fukuchi 2017 running (CC BY 4.0) for the legs; 25 CMU
  running clips (2.67-4.15 m/s) for the arms; Dorn's SimTK runner (MIT) for the legs past 4.5 m/s [summary: G-loco:223-244].
  `fetch_cmu.ps1` already pins 16_37 (veer), 16_41 (90-degree turn), 69_34, 69_50, 83_19 with sha256 [read: tools/
  yardstick/fetch_cmu.ps1:9-14 @31d1c6d].
- **Readers that exist:** CMU ASF/AMC to our `BodyPose` (`read_asf`, `read_amc`, `pose_frame`, `to_body`) [read: tools/
  yardstick/acclaim.h:55-67]; Fukuchi's text files [read: reference.h:36]. **No BVH, FBX, GLB-clip or C3D reader**:
  `grep -ri bvh` over tools/ and game/ code returns nothing [read]. The game's loader ignores clips in a GLB [summary: G-con:68-69].
- **Licences the room recorded** [summary: G-src:187-197; G-con:175-187; G-loco:223-246]: LAFAN1 CC BY-NC-ND 4.0, never
  ships; Mixamo royalty-free in games, read only through search (403); Quaternius UAL "CC0" through search; CMU terms read
  on its home page by E at L187 (handback/p-l187-animal-locomotion-E_2026-11-12.md:89-92) [read]; 100STYLE "CC BY 4.0"
  and Bandai Namco "non-commercial", no licence page cited (handback/p-d659-models-E_2026-11-11.md:136) [read];
  RGBD-Dog a release form, unread; DigiDogs non-commercial by search. "No open animal locomotion data cleared for shipping
  was found"; "The law ships; the data does not" [read: p-l187:94].
- **What the yardstick cannot score** [summary: G-loco:208-221]: bends, stops, starts, walks, climbs, sidesteps, a
  non-human trait, anything above 4.5 m/s (legs) or 4.15 m/s (arms).
- **Retargeting:** onto MPFB's `game_engine` skeleton "untried" for any clip set [read: p-l176-openanim-C_2026-11-12.md:149].
  But the game's own retarget is position-based: each bone is aimed from one game joint to another [summary: G-code:73-93].
  [inferred] So any recording that can be turned into our 21 joint positions is already "retargeted" for scoring and for
  the contact sheet; Blender is needed only to see a clip on a mesh outside our tools, or to bake clips (out by his pick).
- **Thin in the ground files:** none gives a dataset's size, frame rate or joint list; none read a licence for 100STYLE,
  Bandai, ACCAD, AddBiomechanics or any quadruped set at its source. That is this file's part (2).

## (2) What I read at source that is NEW

Corrections to the record come first.

- **C-a, CMU's terms are wider than the record quotes.** The home page (Wayback snapshot 20261109200202, because
  ~~mocap.cs.cmu.edu's own certificate has EXPIRED today: Windows curl "SEC_E_CERT_EXPIRED"~~ [2nd reader: WRONG as I could reproduce it. Windows curl.exe got HTTP 200 from https://mocap.cs.cmu.edu/ with no error at 21:11 GMT 2026-11-13, and the live home page and faqs.php carry the same words as the Wayback copy. The yardstick's own fetch_cmu.ps1:10-11 says its first fetch today was "over https with certificate checks on"]) says "This dataset of motions
  is free for all uses" and, in its terms box, "free for use in research projects. You may include this data in
  commercially-sold products, but you may not resell this data directly, even in converted form" [read:
  https://mocap.cs.cmu.edu/ via web.archive.org, page text]. Its FAQ, "How can I use this data?": "The motion capture data
  may be copied, modified, or redistributed without permission." [read: https://mocap.cs.cmu.edu/faqs.php, same archive].
  [inferred] The two pages agree on everything but resale; read together: use, modify, ship inside a game, credit asked
  ("The data used in this project was obtained from mocap.cs.cmu.edu..."), never sell the data itself. G-src:193 still
  says "NO: site failed a certificate check"; that is superseded by p-l187:89 and by this read. [2nd reader: RE-DERIVED for the resale clause: tools/yardstick/fetch_cmu.ps1:5-7 quotes it verbatim, as do G-con:183 and G-loco:230. New here: "free for all uses" and the FAQ's "copied, modified, or redistributed" line, both read live.]
- **C-b, Bandai Namco is CC BY-NC 4.0, not -ND.** README "License": both sets "CC BY-NC 4.0"; the set-2 LICENSE file opens
  "Attribution-NonCommercial 4.0 International" and its grant is "for NonCommercial purposes only" [read: github.com/
  BandaiNamcoResearchInc/Bandai-Namco-Research-Motiondataset, README.md "License"; dataset/...-2/LICENSE, section 2a].
  Same verdict as the record (look only), sharper reason. [2nd reader: DOWNGRADED. The README and the set-2 LICENSE do say CC BY-NC 4.0 (both read), but no ground file ever said "-ND" for Bandai: G-con:180 says "non-commercial", which was right. RE-DERIVED for the verdict (G-con:180-181).]
- **C-c, the Mixamo FAQ no longer carries the clauses the record quotes.** Wayback snapshot 20261105220906 of
  helpx.adobe.com/creative-cloud/faq/mixamo-faq.html (direct fetch: "Access Denied"): "You can use both characters and
  animations royalty free for personal, commercial, and non-profit projects including: ... Create video games." [read].
  I found no "no raw redistribution" or "no ML training" line on that page [read: grep "distribut|sell|AI" → nothing
  relevant]. [inferred] Those clauses, if current, sit in Adobe's general terms, which I did not read.

### 2.1 Human motion libraries

| set | holds | format, size | licence read at source; the deciding clause |
|---|---|---|---|
| **100STYLE** (Mason, Starke, Komura 2022) | One actor, 100 styles. Each: forwards, backwards and sidestep walk and run, idle, transitions [read: ianxmason.com/100style/, intro]. Styles include Neutral, Zombie, Cat, Dinosaur, Roadrunner, Quail, Chicken, Penguin, Crouched, OnToesCrouched, OnToesBentForward, BentForward, LeanBack, StartStop, CrossOver, Heavyset, Old, Stiff, WildArms, InTheDark, Followed, Rushed [read: same page, file table, 100 `_FR.bvh` names counted] | BVH, XSens ~~inertial~~ [2nd reader: the page says "XSens motion capture system", not inertial] suit, 60 fps; T-poses at the ends trimmed by `Frame_Cuts.csv`; 28-bone skeleton (23 joints + 5 ends) [read: same page, "BVH"]. ~~15.11 GB~~ [2nd reader: DOWNGRADED. The record page shows "Files (16.2 GB)"; the Zenodo API lists 100STYLE.zip 1,468,515,354 B (the BVH files, 1.47 GB) and 100Style-Labelled-Data.zip 14,751,560,934 B, 16,220,076,288 B in all; 15.11 appears only in the page's JSON-LD and is GiB] on Zenodo record 8127870 (BVH zip plus labelled data) [read: Wayback 20250717013246 of zenodo.org/records/8127870; Zenodo's own reply was 403] | **CC BY 4.0** [read: the project page, "Citation, Creditation & Licensing"; the Zenodo record's licence field]. Grant: "reproduce and Share ... produce, reproduce, and Share Adapted Material" [read: creativecommons.org/licenses/by/4.0/legalcode.txt, section 2a1]. Commercial: **yes**. Attribution: **yes** ("The 100STYLE Dataset - Ian Mason", the page's own wording). Share-alike: **no**. Redistribution: allowed with credit. |
| 100STYLE retargeted (Holden) | the set on one skinned skeleton, FBX and BVH | GitHub orangeduck/100style-retarget | GitHub's licence field: **CC-BY-4.0** [read: api.github.com repo JSON]. I did not read its LICENSE file. |
| **CMU Graphics Lab** | 2,331 animated trials in the archived index [read: count of "Animated" in search.php?subjectnumber=%&motion=%, Wayback]. Of use here: 16_41-44 and 16_51-54 run 90-degree turns; 16_37-40, 16_48-50 veers; 16_08, 16_57 "run/jog, sudden stop"; 104_53-55 StartRun, 104_56-57 RunStop; 127 (run, walk to run, turns, side steps, quick stops, dive over roll, jump over, duck under); 128 (run stop run); 139 sneaking, "Run To Sneak", sneak sideways; 77 "careful creeping", "creep and pause"; 111_3 and 133_1-2 crawling; 140 getting up from the ground; subject 1 playground climbs; ladder and "climb 3 steps" trials; 104_41-43 ZombieWalk [read: same index, trial lines] | ASF/AMC, C3D, 120 Hz Vicon, 41 markers; units ×0.056444 to metres [read: faqs.php, "How is this data captured?", "How do I convert"]. One zip of all ASF/AMC offered; ~~"Please don't crawl this database"~~ [2nd reader: DOWNGRADED. The FAQ says "Please don't crawl this database for all motions. Here is a zipfile of all asf's and amc's", and links allasfamc.zip and the C3D zips (faqs.php, "Can I download all the data?")] [read: faqs.php] | see C-a. Commercial use inside a product: **yes**. Attribution: **asked**. Share-alike: **no**. Redistribution: FAQ allows; home page forbids resale "even in converted form". |
| **ACCAD Open Motion Project** (Ohio State) | male and female running (27 files each), walking, martial-arts walks and turns, a figure "Dog Walk" [read: accad.osu.edu/research/motion-lab/mocap-system-and-data, download list] | ASF/AMC, C3D, BVH, FBX, TXT [read: same, "File Formats"] | "licensed under a Creative Commons Attribution 3.0 Unported License" [read: same page, footer]. I did not read the 3.0 legal code. [summary of CC 3.0, not read] commercial yes, attribution yes, no share-alike. |
| **HDM05** (MPI) | more than three hours, more than 70 motion classes in 10-50 realizations [read: Wayback 20250819000603 of resources.mpi-inf.mpg.de/HDM05/; direct fetch 403] | C3D and ASF/AMC [read: same] | "Creative Commons Attribution-ShareAlike 3.0 Unported" [read: same, "Copyright"]. **Share-alike**: an adapted work must carry the same licence [summary of CC BY-SA, not read]. |
| Bandai Namco Research sets 1 and 2 | set 2: 10 contents (walk, walk-turn-left/right, run, ...), 7 styles, 384,931 frames [read: dataset-2 README "Contents"] | BVH, 30 fps, three professional actors [read: README; dataset-2 README] | **CC BY-NC 4.0** (C-b). **Look only.** |
| LAFAN1 (Ubisoft) | not re-read | BVH | CC BY-NC-ND 4.0 as the room read it [summary: G-src:191]. **Look only.** |
| **AMASS** (MPI) | not opened beyond the licence | SMPL bodies | "Dataset Copyright License for non-commercial scientific research purposes"; "Any other use, in particular any use for commercial purposes, is prohibited. This includes ... production of other artefacts for commercial purposes"; no training for commercial use [read: amass.is.tue.mpg.de/license.html]. [inferred] Not even bands: a fitted constant in a sold game is such an artefact. |
| **SFU Motion Capture** | jumps, skips, runs, ... | BVH, C3D, FBX | "free for research purposes. The data cannot be used for commercial products or resale" [read: mocap.cs.sfu.ca, home text]. **Look only.** |
| KIT Whole-Body Human Motion DB | robots-oriented, MMM model | ~~C3D, MMM XML~~ [2nd reader: UNSUPPORTED. The home page has no "C3D", "MMM" or "XML"; it names humanoid robots in its abstract] | The home page asks for citations; no licence text found on it [read: motion-database.humanoids.kit.edu]. **Unknown: treat as look only.** |
| **Quaternius UAL 1 and 2** | 120+ and 130+ animations on "a universal humanoid rig"; UAL 2 lists "parkour movement" and "zombie locomotion" [read: quaternius.com/packs/universalanimationlibrary.html and ...2.html, description] | FBX, GLB, Blend [read: same, "Formats"] | "License CC0" [read: same pages]. CC0 waives "for any purposes, including without limitation commercial purposes" [read: creativecommons.org/publicdomain/zero/1.0/legalcode.txt, statement of purpose]. Commercial **yes**, attribution **no**, share-alike **no**. [inferred] Hand-keyed by an artist, not capture: no use as a measured reference. |
| Mixamo (Adobe) | humanoid clips via an auto-rigger | FBX via Adobe's site, Adobe ID required | C-c. Royalty free in games [read]. Adobe's general terms unread. |

### 2.2 Biomechanics with force plates

| set | holds | size | licence read at source |
|---|---|---|---|
| **AddBiomechanics Dataset** v1.0 | 273 participants, 71.47 h, 57.55 h with ground forces, "nine different activity types" from 15 public sources; scaled skeletons, joint positions, velocities, accelerations, ground forces, inverse-dynamics torques. Sources include Camargo 2021 (22 people, 19.87 h), Carter 2023 (50, 21.60 h), Hamner 2013 (10, 0.02 h), Moore 2015 (12, 6.22 h) [read: addbiomechanics.org/download_data.html, "Dataset Sources" table] | "~4 hours with a 50 Mbps connection" [read: same]. B3D files [2nd reader: UNSUPPORTED on this page, which has no "B3D"; it is stated at nimblephysics.org/docs/working-with-addbiomechanics-data.html] (OpenSim Rajagopal model [read: same, "We standardize on the Rajagopal 2015 model"]) | "free under a Creative Commons BY 4.0 license"; "note the LICENSE.txt file in each dataset, which lists the original uploaders of the data so that you can correctly credit them" [read: same]. Commercial **yes**, attribution **yes**, share-alike **no** (CC BY 4.0 text read, above). I did not open a per-source LICENSE.txt. |
| **Fukuchi et al. 2018 walking** | "A public data set of overground and treadmill walking kinematics and kinetics of healthy individuals" | 7 files, 2,238,113,177 bytes [read: api.figshare.com/v2/articles/5722711, files] | **CC BY 4.0** [read: same JSON, license.name]. Fills the yardstick's missing walk (G-loco:216). |

[inferred] Nothing above 9.49 m/s is in any open set I found; Dorn's runner stays the only full curve near the hunter's
speeds (G-loco:302-304). AddBiomechanics' "nine activity types" I did not list; whether it holds cutting or sprint starts
is unread.

### 2.3 Quadrupeds

| set | holds | licence read at source | use |
|---|---|---|---|
| **Liverpool, "The biomechanics of working dog locomotion I: Steady-state trotting"** | 27 dogs (Labradors, shepherds, spaniels), motion capture, force plates, modelling [read: datacat.liverpool.ac.uk/3038/, abstract] | Data.zip 248 kB and readme, each "Creative Commons: Attribution 4.0" [read: same, "Available Files"] | bands (trot only); 248 kB says summary data, not raw capture [inferred] |
| **PFERD** (horses, Sci Data 2024) | five horses, more than 100 markers, ten cameras; walk, trot, canter, circles, gait transitions, rearing, kicking [read: pmc.ncbi.nlm.nih.gov/articles/PMC11096353, abstract and the trial table] | Article CC BY 4.0 [read: same, "Copyright and License information"]. The DATA's terms are on Harvard Dataverse doi:10.7910/DVN/2EXONE [read: github.com/Celiali/PFERD README "License"]; Dataverse's API returned 500 twice. **Data terms unread.** [2nd reader: now readable. The Dataverse API (200) gives termsOfUse "Data Copyright License for non-commercial scientific research purposes ... Any other use is prohibited", naming "incorporation in a commercial product". Look only, confirmed] | look only until read |
| MANN dog (AI4Animation, SIGGRAPH 2018) | dog capture used for quadruped control | "only for research or education purposes ... The motion capture data is available only under ... CC BY-NC 4.0" [read: github.com/sebastianstarke/AI4Animation README "Copyright Information"] | look only |
| 3DDogs (Surrey) | 64 dogs, three walks and three trots each; RGB-D video plus optical marker ground truth [read: cvssp.org/data/3DDogs/] | ~~no licence text on the page [read: grep "licen" → none]~~ [2nd reader: WRONG. cvssp.org/data/3DDogs/ has a "License Agreement" block: "may be used for non-commercial research purposes only ... The data may not be redistributed." Verdict (look only) stands] | look only |
| Truebones zoo | "Over 75 animated animals", FBX/BVH [read: truebones.gumroad.com zoo page] | "royalty free and can be used for any and all purposes even commercial ... Games"; "Re-Distribution or ReSale of Truebones in .FBX, .BVH or i-Motion formats is strictly prohibited"; "Please provide credit" [read: truebones.gumroad.com/p/truebones-terms-of-use-for-truebones-motions-t-o-s, dated 01/01/2019]. Free only with a checkout code [read: zoo page] | [inferred] artist animation, not animal capture: not "data from wild animals" (item 166) |
| Vienna Horse Data Collection | — | site unreachable (connect timeout) | — |
| cats | **no open cat locomotion capture found** (one search) | — | — |

### 2.4 Which can be what

| | bands for the yardstick (numbers; nothing shipped) | may ship inside a game (if he ever says) | look only |
|---|---|---|---|
| CMU, 100STYLE, ACCAD, AddBiomechanics, Fukuchi 2017/2018, ~~Liverpool dogs,~~ [2nd reader: DOWNGRADED. 248 kB of summary data for a quadruped, not a clip that can ship] Dorn (MIT) | yes, with credit in CREDITS.md | yes (CMU: never sold as data; CC BY: credit) | — |
| HDM05 | yes | [inferred] a fitted constant may be "Adapted Material", which share-alike would bind: ask first | — |
| Quaternius UAL, Truebones, Mixamo | no: hand-keyed, not measurements [inferred] | yes (Truebones: credit, no FBX/BVH redistribution; Mixamo: Adobe terms unread) | — |
| LAFAN1, Bandai Namco, AMASS, SFU, MANN dog, 3DDogs, RGBD-Dog, KIT, PFERD data | **no** [inferred: tuning a sold game is commercial use] | no | yes: watch, never measure into a number |

### 2.5 Retargeting each format onto the game

The game drives 21 joints plus one lower spine; the MPFB rig has 53 bones and the Rig aims 18 of them from joint
positions [summary: G-con:64-81; G-code:73-93]. So the question is only "can the format give our 21 joint positions".

| format | sets | onto our 21 joints | headless Blender? |
|---|---|---|---|
| ASF/AMC | CMU, HDM05, ACCAD | done for CMU: `to_body` [read: acclaim.h:67]. HDM05 and ACCAD need only a bone-name table [inferred] | not needed |
| BVH | 100STYLE, ACCAD, Bandai, LAFAN1, SFU, Truebones | NEW reader. 100STYLE's joints: Hips, Chest, Chest2-4, Neck, Head, Left/Right Collar, Shoulder, Elbow, Wrist, Hip, Knee, Ankle, Toe [read: ianxmason.com/100style/, hierarchy]: near one to one with ours (Pelvis, Chest4→Chest, Neck, Head, Shoulder, Elbow, Wrist, Hip, Knee, Ankle, Toe; the Wrist's end site → Hand; Eye from the Head's end site, as `rest_from_bones` does) [inferred] | Blender imports BVH [inferred: its core BVH importer; not checked on 5.2.3]. Not needed for scoring |
| FBX | Mixamo, Quaternius, Truebones, ACCAD | needs Blender: import, read world joint heads per frame, write JSON; then the same mapping | **yes**, this is the one place Blender earns its keep (A's plan step 5 named copy-rotation then bake, p-d659-models-E:98) |
| GLB clips | Quaternius | the game's loader ignores clips [summary: G-con:68-69]; a node reader of the glTF JSON and accessors would do [inferred] | yes, or node |
| C3D | CMU, HDM05, PFERD, Liverpool (unknown) | markers only: needs a marker-to-joint model. Skip wherever ASF/AMC or BVH exists | yes with an add-on (unchecked) |
| B3D | AddBiomechanics | needs the `nimblephysics` Python reader [summary: addbiomechanics.org]; Python is allowed for Blender only [summary: G-con:198]. Use each source's own files (Camargo, Fukuchi) or ask his word | no |

What breaks in any retarget [inferred unless marked]: limb twist is lost (the Rig has no twist bones, G-code:76-78);
segment lengths differ, so positions drawn on our body float or sink, which is why the yardstick compares ANGLES (Cardan,
distal on proximal) and not positions [summary: G-loco:193]; speeds compare at equal Froude F = v/sqrt(g l) as the arms
already do [summary: G-loco:139-140]; XSens (100STYLE) root travel drifts, so trust its joint angles, not its root path.

## (3) The design for this aspect [ours, built from the sources above]

**One layer: the reference shelf.** Recorded motion is never in the game. It is fetched by pinned script into a folder
outside the repo, read by the yardstick into our `BodyPose`, and reduced to bands: numbers the yardstick scores against
and the builders fit constants to, as L200 did with Fukuchi (G-loco:90-95).

- **Inputs:** a shelf manifest per set: source URL, sha256 per file (the `fetch_cmu.ps1` pattern), licence name and the
  clause read, credit line. Formats: Fukuchi text, ASF/AMC (exist), BVH (new). Nothing else in the first season.
- **Outputs, three kinds:**
  1. **Cycle bands:** per joint angle, 101 points from the right foot's strike, mean and spread, at a speed or Froude
     number. As today, for more joints (pelvis and thorax turn, planned in P193 but not built, G-loco:221).
  2. **Event bands:** numbers about one event, for what has no cycle. Turns: trunk roll against centripetal acceleration
     through CMU 16_41-44, 16_51-54 and 127_15-16 (his item 214's bank). Stops and starts: pelvis drop, lean and step
     count from CMU 16_08, 16_57, 104_53-57, 127_5 and 127_17-20 (the player's ramp, item 13; G-loco:215's missing stop).
     Low gaits: trunk pitch, hip height and step rate from CMU 139 (sneak), 77 (creep) and 100STYLE Crouched and
     OnToesCrouched (the stalk, items 207-208, which no source covered: brief:1556 per G-his:514).
  3. **Style deltas** (the uncanny, item 217's method made measurable): for each 100STYLE style, per joint and per cycle
     point, the style's angle minus the SAME actor's Neutral angle at the same movement type. Because one actor did all
     ~~100, the delta is the style, not the person~~ [2nd reader: UNSUPPORTED. Styles differ in speed and cadence (a Zombie walk is not a Neutral walk), so an angle difference at the same cycle point mixes style with speed and phase; no source is given and the 100STYLE paper was not read] [inferred]. A real human performed it under gravity, so it "obeys physics"
     in the plain sense item 217 asks [inferred]. It is a catalogue for his eye, not a rule.
- **Where it sits:** `tools/yardstick/` beside `acclaim.*` (reader `bvh.h/.cpp`), `reference.*` (bands), `main.cpp` (flags),
  `sheet.cpp` (the contact sheet that already draws a CMU stride beside the hunter, main.cpp:186-215 [read]); new
  `fetch_100style.ps1`; `tools/CMakeLists.txt:7` adds the file to `dz_yardstick` [read]. In the game: nothing, until a
  lap fits a constant. Then the constants go where today's sourced curves live, `game/model_rig.h` (hunter and any chaser
  through `gait_pose`) and `game/body.h` (the player's crossover and backward dials, all "OURS" today) [summary:
  G-code:141-182].
- **Parameters, few, each sourced:**
  - cycle: 101 points from the right foot's strike, as Fukuchi and the yardstick [read: ~~README.md:20-22~~ [2nd reader: WRONG cite; the 101 points are at README.md:17, :20-22 is about Cardan angles]];
  - band: runners' mean and sd, bar rms/sd <= 1 (L193's registered bar) [summary: G-loco:203];
  - speed match: Froude, F = v/sqrt(g l) [summary: G-loco:139];
  - CMU scale 0.056444, 120 Hz [read: CMU FAQ; acclaim.h:30]; 100STYLE 60 fps and `Frame_Cuts.csv` trims [read: its page];
  - style delta scale s: 1 = as performed, 0 = none [ours]; his eye picks s, no table does (item 153's rule, G-his:321-325).
- **Cost per character per frame:** **0** for all of the above: it runs in an offline tool, never in the frame [inferred].
  If a style delta is ever fitted into the game as, say, 4 harmonics on 3 axes of 14 joints: about 170 sin/cos per figure
  per frame, about a microsecond [inferred, not measured; same order as G-code:239's estimate for today's gait].
- **Same layer, three bodies:**
  - **hunter:** cycle bands to 4.5 m/s (Fukuchi) and Dorn's runner past it, as now; the turn band scores item 214's bank.
    No style delta: item 169 keeps the hunter to T1 and a humanlike head (brief:1598 per G-his:532) [read via G-his];
  - **lesser chasers:** the same `gait_pose` scaled by their own legs (G-code:191-193); a style delta per kind, picked
    by him from the catalogue (Zombie, Dinosaur, Roadrunner, Cat, OnToesBentForward...). Their animal traits T2-T4 stay
    laws, because no open animal capture of those traits was found (2.3), and every entity stays humanoid (item 168);
  - **player:** 100STYLE Neutral sidestep and backward runs and walks, CMU 69_34, 69_50, 83_19 already pinned, and
    Fukuchi 2018 walking give bands for `Body`'s crossover, shuffle and toe-first rules, which are "OURS" today
    (body.h:177-183 per G-code:181-182); the stop and start bands give the sprint ramp a check.

## (4) The FIRST lap: a BVH reader for the yardstick, proved on a recorded case

Tier: prove it (a data format; a wrong reader is invisible in every number it feeds).

- **Smallest piece:** `tools/yardstick/bvh.h/.cpp`, the twin of `acclaim.*`: `read_bvh` (HIERARCHY, OFFSET, CHANNELS with
  each joint's own rotation order, MOTION, Frame Time), `pose_frame`, `to_body` (the 100STYLE name table above).
  `fetch_100style.ps1` fetches `Neutral_FR.bvh`, `Neutral_FW.bvh`, `Frame_Cuts.csv` into a folder outside the repo and
  pins each sha256 at the first fetch. A `--bvh <file>` flag scores it like `--cmu`. README gains "Step 3".
- **Files touched:** tools/yardstick/bvh.h, bvh.cpp (new), yardstick_tests.cpp, main.cpp, fetch_100style.ps1 (new),
  README.md; tools/CMakeLists.txt:7; CREDITS.md (the 100STYLE credit line, only if a number from it ever lands); CHANGELOG.
- **Rows, written red first:**
  - `a_bvh_joint_with_no_motion_points_along_its_offset` and
    `a_bvh_joint_turned_in_zxy_order_reads_back_all_three_angles` (no data needed; the mirrors of yardstick_tests.cpp:148
    [read] and of the Cardan row at :312 [summary: G-code:328]). Red today: `bvh.h` does not exist.
  - **The recorded case:** `the_neutral_run_of_100style_lands_inside_cmus_runners_knee_and_elbow_spread`: 100STYLE
    Neutral_FR read through the new reader, one actor, scored like any body against the 25 CMU running clips at matched
    Froude. Red today: `dz-yardstick --bvh` exits 2 (~~"unknown flag"~~ [2nd reader: DOWNGRADED. Exit 2 is true; the message is a usage line, no "unknown flag" text exists], main.cpp:336-339 [read]). Green after: a reader that
    gets channel order, offsets or units wrong puts the knee and elbow outside a band that a second, independent lab
    measured. [inferred risk] If Neutral_FR's speed falls outside CMU's 2.67-4.15 m/s, the row REPORTS and does not gate,
    and says so; the speed is not printed on the 100STYLE page.
- **Mutants to run:** swap two channels; drop the offset; skip the trim; read 60 fps as 120.

## (5) What only his eye can decide, and the fewest clips for it

Rendered on the hunter's own body through the Rig, at full frame rate and lit (brief:1606 per G-con:160), never a
"before" older than one he has seen (item 216):

1. **The baseline:** 100STYLE Neutral_FR beside the hunter at equal Froude, one stride, side and three-quarter. His
   "good metric for a really human looking sprint" (item 217) shown, not described. One clip.
2. **The uncanny catalogue:** the same human run with six style deltas at s = 1, on a lesser chaser's body: Zombie,
   Dinosaur, Roadrunner, Cat, OnToesBentForward, Crouched. He says which read creepy and which read goofy (item 195's
   word). One clip, six panels. The stalk (item 207) gets a second strip from CMU 139 sneaking and 100STYLE
   OnToesCrouched only if he asks.
3. **The turn:** CMU 16_51 (run, 90-degree left turn) beside the hunter's sharpest kept-run turn, from behind and from
   the look-behind. It answers item 214's bank by a recording, not a share. One clip.

Three clips. No table decides what is elegant or creepy (item 153's rule as the task gives it).

## (6) What I would NOT build, and why

- **No clip in the game, no motion matching, no blend tree of recordings:** clips are out by his pick (plan_l180:67) and
  item 150 says learn from, not use; Godot's blend space "fits only once clips exist" (G-src:86).
- **Nothing from a non-commercial set into any number:** LAFAN1, Bandai, AMASS, SFU, MANN dog. AMASS names "artefacts"
  explicitly; a band that tunes a sold game is one [inferred]. Watch them; never measure them.
- **No learned model trained on any of it:** AMASS forbids it for commercial use [read]; the rest would carry its data's
  licence into weights [inferred]; and no source in the record asks for it.
- **No quadruped skeleton or quadruped retarget:** every entity is humanoid (item 168); `BodyPose` is humanoid only
  (G-code:207-208). Animal data enters as laws and numbers (duty factor, Froude, trot timing), as L187 did.
- **No C3D marker pipeline and no B3D reader:** markers need a body model we would invent; B3D needs Python outside
  Blender. ASF/AMC and BVH cover every set that may be measured.
- **No Truebones, Quaternius or Mixamo as reference:** they are animators' work, not measurements [inferred]; they can
  ship but cannot be a yardstick, and shipping clips is out.
- **No bulk download:** ~~CMU asks not to be crawled~~ [2nd reader: CMU asks not to crawl "for all motions" and itself offers allasfamc.zip]; fetch named files, pinned, as `fetch_cmu.ps1` does.

## What I did not open

- Any data file itself: no BVH, AMC, C3D, B3D or zip was downloaded; every size and joint list is the publisher's page.
- The CC BY 3.0, CC BY-SA 3.0 and CC BY-NC 4.0 (set 1) legal codes; Adobe's general terms; Holden's retarget LICENSE file;
  AddBiomechanics' per-source LICENSE.txt files; PFERD's Dataverse terms (API 500); the 3DDogs and RGBD-Dog release terms;
  KIT's terms beyond its home page; the Vienna Horse site (unreachable); LAFAN1's pages (the room read them).
- The 100STYLE paper, so its run speeds are unknown; AddBiomechanics' list of activity types; Hamner 2013's speeds.
- Quaternius' animation list (the pages give counts and categories only).
- In the game: only `tools/yardstick/` (README.md, fetch_cmu.ps1:1-50, acclaim.h, reference.h, main.cpp:186-215 and
  :325-340, yardstick_tests.cpp:148-170) and `tools/CMakeLists.txt:7`; no game source beyond the ground files' citations.
- In the record: the six ground files whole; p-l176:15-30, :100-110, :138-150; p-l187:18-26, :85-96;
  p-d659-models-E:90-100, :128-142; plan_l180:67; the brief at :1102-1103 and :1607. Nothing else.

## Second reader

Adversarial second reader, read-only, 2026-11-13. Outside reads carried public topics only. Primaries I opened: the live
CMU home page and faqs.php (Windows curl.exe), the live search.php index, ianxmason.com/100style, the Zenodo API,
creativecommons.org legal codes (BY 4.0, CC0), addbiomechanics.org and the nimblephysics doc, figshare API 5722711,
datacat.liverpool.ac.uk/3038, the Bandai README and set-2 README and LICENSE, AI4Animation README, amass.is.tue.mpg.de,
mocap.cs.sfu.ca, accad.osu.edu, quaternius.com (two packs), PMC11096353, the PFERD README and Harvard Dataverse API,
cvssp.org/data/3DDogs, the Truebones terms page, GitHub API for the 100STYLE retarget repo, Wayback copies of Mixamo's FAQ,
HDM05 and CMU, and the game's yardstick files at 31d1c6d. Corrections are in place above, struck with ~~ ~~.

| line | claim | primary opened | verdict | evidence |
|---|---|---|---|---|
| 21-22 | Item 150 quote; clips out by his pick | brief:1102-1103; plan_l180:66-67 | OK | quote and "Clips, by his pick" match |
| 23-24 | README: "Learn from, never use" | yardstick README.md:3-6 | OK | text at :3-4 |
| 26-28 | fetch_cmu.ps1 pins 16_37, 16_41, 69_34, 69_50, 83_19 | fetch_cmu.ps1:9-14 | OK | clip names at :11-14 |
| 29-31 | CMU readers exist; no BVH anywhere | acclaim.h:55-67; grep -rli bvh tools game | OK | read_asf :55, to_body :67; no hit |
| 32-37 | the record's licence quotes and lines | p-l187:90,94; p-d659-E:136; p-l176:149 | OK | all match; "untried" at :149 |
| 3 | 100STYLE "NEW" with CC BY 4.0 | G-con:180; p-d659-E:136 | RE-DERIVED | licence label already held; contents are new |
| 7-8 | AddBiomechanics "273 people with force plates" | download_data.html sources table | DOWNGRADED | 57.55 of 71.47 h have ground forces |
| 51-53 | CMU certificate expired today | curl.exe on mocap.cs.cmu.edu; fetch_cmu.ps1:10-11 | WRONG | 200 and no error; the script fetched with checks on |
| 53-56 | CMU "free for all uses", terms box, FAQ copy clause | live home page and faqs.php | OK | same text live as in Wayback |
| 57-60 | C-a is wider than the record quotes | fetch_cmu.ps1:5-7; G-con:183; G-loco:230 | RE-DERIVED | resale clause held already; two phrases new |
| 60-62 | Bandai is CC BY-NC 4.0 | README "License"; set-2 LICENSE | OK | "CC BY-NC 4.0"; grant "NonCommercial purposes only" |
| 62-63 | "not -ND" corrects the record | G-con:180-181 | DOWNGRADED | record said "non-commercial"; nobody said -ND |
| 64-68 | Mixamo FAQ: royalty free, video games; no other clauses | Wayback 20261105220906 | OK | "Create video games"; grep found no other clause |
| 74 | 100STYLE: styles, 100 _FR files, forward/back/side | ianxmason.com/100style | OK | 100 distinct _FR names counted |
| 74 | BVH, 60 fps, XSens "inertial", Frame_Cuts, 28 bones | same | DOWNGRADED | "inertial" not on page; ROOT + 22 JOINT + 5 End Site |
| 74 | 15.11 GB on Zenodo | Zenodo API and page | DOWNGRADED | 16,220,076,288 B = 16.2 GB; 15.11 is GiB in JSON-LD |
| 74 | CC BY 4.0, credit wording, grant 2a1 | project page; BY 4.0 legalcode.txt:142-145 | OK | "produce, reproduce, and Share Adapted Material" |
| 75 | Holden retarget is CC-BY-4.0 | GitHub API | OK | spdx_id CC-BY-4.0; LICENSE file unread by both of us |
| 76 | CMU 2,331 animated trials | live search.php | OK | 2,331 "Animated" (a Wayback copy I fetched showed 782) |
| 76 | CMU trial list (16, 104, 127, 128, 139, 77, 111, 133, 140) | live search.php | OK | every named trial found, incl. ladder, "climb 3 steps", "creep and pause" |
| 76 | CMU 120 Hz, 41 markers, 0.056444; "don't crawl" | faqs.php | DOWNGRADED | numbers OK; the crawl ask is "for all motions", and a zip is offered |
| 77 | ACCAD CC BY 3.0, 27 files, Dog Walk | accad.osu.edu page | OK | footer link to by/3.0; "(27 files)"; dog_BVH.ZIP |
| 78 | HDM05 3 h, 70 classes, C3D+ASF/AMC, BY-SA 3.0 | Wayback 20250819000603 | OK | all four present |
| 79 | Bandai set 2: 10 contents, 7 styles, 384,931, 30 fps, BVH | set-2 README | OK | table matches |
| 81 | AMASS: commercial prohibited, artefacts, no training | amass license.html | OK | quotes verbatim |
| 82 | SFU: not for commercial products | mocap.cs.sfu.ca | OK | "cannot be used for commercial products or resale" |
| 83 | KIT holds C3D and MMM XML | KIT home page | UNSUPPORTED | none of those words on the page |
| 84 | Quaternius: counts, formats, CC0 | two pack pages; CC0 legalcode | OK | 120+, 130+; FBX/GLB/Blend; "License CC0"; file prices not read |
| 91 | AddBiomechanics table, CC BY 4.0, 4 h | download_data.html | OK | 273 / 71.47 / 57.55 and each source row match |
| 91 | "B3D files" on that page | same page; nimblephysics doc | UNSUPPORTED | page has no "B3D"; the doc does |
| 92 | Fukuchi 2018: 7 files, 2,238,113,177 B, CC BY 4.0 | figshare API 5722711 | OK | file sizes sum to 2,238,113,177 |
| 102 | Liverpool: 27 dogs, Data.zip 248 kB, CC BY 4.0 | datacat 3038 | OK | all present |
| 114 | Liverpool dogs in the "may ship" column | datacat 3038 | DOWNGRADED | 248 kB of summary data, quadruped, no clips |
| 103 | PFERD: five horses, 100+ markers, ten cameras, CC BY article | PMC11096353; README | OK | data terms now read: non-commercial research only |
| 104 | MANN dog: research or education, CC BY-NC 4.0 | AI4Animation README | OK | "Copyright Information" quoted |
| 105 | 3DDogs: no licence text on the page | cvssp.org/data/3DDogs | WRONG | "License Agreement": non-commercial, no redistribution |
| 106 | Truebones terms; 75 animals FBX/BVH | terms page; shop page | DOWNGRADED | terms quotes OK; the shop says "in .FBX format" |
| 127 | 100STYLE joints map to our 21 | body.h:38-46; 100STYLE hierarchy | OK | 21 named joints; mapping is [inferred] |
| 160 | CMakeLists:7; tests :148; main.cpp:186-215 | those files | OK | all at the cited lines |
| 165 | 101 points: README.md:20-22 | README.md:17 | WRONG | cite is off; :20-22 is Cardan angles |
| 199 | `--bvh` exits 2 with "unknown flag" | main.cpp:324-340 | DOWNGRADED | exit 2, usage text only |
| 94 | nothing above 9.49 m/s open | G-loco:302-304 | RE-DERIVED | G-loco:302-304 already says it |
| 156-157 | delta = the style, not the person | none | UNSUPPORTED | no source; speed and phase confound |
| 173-182 | items 13, 153, 166, 168, 169, 195, 207-208, 214, 216, 217 | briefs/dreamzone2_the_game.md | OK | each item says what is cited |

**Tally of 44 rows:** OK 27, DOWNGRADED 8, WRONG 3, UNSUPPORTED 3, RE-DERIVED 3 as row verdicts (the 4th, Bandai's
look-only verdict against G-con:180-181, rides in the "not -ND" row). **RE-DERIVED count: 4**, each with both lines in the
rows above.

**The three that matter most.**
1. The certificate claim and the "superseded" story. CMU's host answered over https with checks on, today, for the room's
   own script and for my curl.exe, and the live terms match the Wayback copy. The resale clause the scout calls new is in
   fetch_cmu.ps1:5-7, G-con:183 and G-loco:230.
2. 3DDogs does carry a licence block (non-commercial, no redistribution); KIT's "C3D, MMM XML" and AddBiomechanics' "B3D"
   are not on the pages cited. The verdicts stay look-only, but three [read] marks were not what the primary shows.
3. The first row can pass without doing its job (below), and the 100STYLE size is 16.2 GB, not 15.11.

**How the first row could pass without doing what it is for** [inferred]. The row asks that Neutral_FR lands "inside" CMU's
runners' knee and elbow spread. (a) A reader that ignores the file and returns CMU's own mean knee and elbow curves passes:
the row has no negative control, such as a Zombie file or channel-shuffled Neutral_FR that must fail. (b) The band is
runners' mean plus or minus sd, and the elbow bar is wide (G-loco:203, within 12.4 degrees), so a reader with a wrong
rotation order on the arms can still sit inside it. (c) The row "REPORTS and does not gate" when the speed is outside
2.67-4.15 m/s, and the speed is unknown (the page prints none; the scout says XSens root travel drifts, line 136), so it
may never gate at all. (d) Of the four mutants, "read 60 fps as 120" and "skip the trim" change speed and the T-pose ends,
not the 101-point angle curves cut from foot strikes, so both can survive a report-only row. The two no-data rows
(joint along its offset; ZXY order) are the ones that bite; the recorded-case row mostly adds a plausibility look.

**Mechanisms with no source and no [ours] mark.** (1) "Style minus the same actor's Neutral at the same cycle point" is
unsourced and confounded by speed and cadence (marked in place). (2) Applying whole-body style deltas (Zombie, Dinosaur,
Cat) to lesser chasers sits against the record's own finding that eeriness comes from one clear non-human cue on a human
body, not from motion made off everywhere (brief:1592, citing item 167), and against item 169's one cue per kind. The
scout never cites item 167. Section (3) is headed [ours], but this is the heart of it and should be said plainly as [ours]
and small, per item 153. (3) "Trunk roll against centripetal acceleration" has no named source for the metric. (4) How a
Froude speed is obtained for 100STYLE is not stated.

**What I could not check.** The 100STYLE paper, Neutral_FR's speed, any data file itself, Holden's LICENSE file (404 at
main/LICENSE.md), AddBiomechanics' per-source LICENSE.txt, the CC BY 3.0 and BY-SA 3.0 legal codes, the Vienna Horse site,
the "no cat capture" negative, Quaternius' file prices, whether Blender 5.2.3 imports BVH, the nimblephysics Python reader,
and the ground files' own line numbers beyond those quoted above. I did not run anything heavy.
