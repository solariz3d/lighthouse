# Open data and measured numbers for human movement (a research agent's report, 2026-11-15)

Filed by the librarian on D at his word of 13:29 ("should be everything open source we can access for proc gen animationn techniques etc"). **This is an agent's report, filed whole. The librarian has opened none of its sources.** The agent says which pages it opened and which figures come from search snippets only. The request carried nothing of the game.

The agent's own opening: it has usable licence and content answers for most datasets in Part A. Part B is thinner. Many primary pages blocked it (403, logins, PDFs that would not render), so many figures come from search-result summaries rather than opened pages. Each item says which.

Two practical points:
- **Four open datasets would fill most of the gaps:** Reznick 2021, Scherpereel 2023, Camargo 2021 and Schreiber & Moissenet 2019. The licence is confirmed as CC BY 4.0 for three; Reznick's data licence is unconfirmed. Between them: acceleration from rest and back to a stop, walk-run transitions, stairs, ramps, cutting, jumps and full-body walking with arms.
- **Joint-angle targets should be measured from these datasets, not taken from the literature.** No primary joint-angle table for walking, running or sprinting could be opened.

## Part A: datasets

**1. Walking at multiple speeds**
- **Fukuchi, Fukuchi & Duarte 2018** (PeerJ). Data DOI 10.6084/m9.figshare.5722711. Licence CC BY 4.0, read from the figshare record. 42 adults (24 young, 18 older). Treadmill at 8 speeds: 40 to 145% of each person's comfortable speed, scaled by leg length (Froude). Overground at comfortable speed and 30% slower and faster. Pelvis and lower limbs only (26 markers); heel markers not explicitly listed. Markers at 150 Hz, forces at 300 Hz, processed pelvis/hip/knee/ankle/foot angles and moments. C3D and ASCII. Opened.
- **Schreiber & Moissenet 2019** (Scientific Data). Data DOI 10.6084/m9.figshare.7734767. CC BY 4.0, read from figshare. 50 adults aged 19 to 67, 1,143 trials. Five conditions: 0-0.4, 0.4-0.8, 0.8-1.2 m/s (metronome-paced), self-selected usual and fast. 52 full-body markers including trunk, arms, hands, heel and metatarsal heads; no head markers. Two force plates at 1500 Hz and 8-channel EMG. C3D only; joint angles must be computed. Opened. The one open walking set with arms.

**2. Running, acceleration, deceleration, bends**
- **Reznick et al. 2021** (Scientific Data). Data DOI 10.6084/m9.figshare.c.5175254. Opened. 10 adults. Walking at 0.8, 1.0, 1.2 m/s on 0, 5 and 10 degree inclines. Running at 1.8, 2.0, 2.2, 2.4 m/s. Accelerating from rest at 0.2 or 0.5 m/s², holding, then decelerating; walk-run transitions to 2.2 m/s. Stair inclines of 20, 25, 30, 35 degrees (no forces on stairs). Sit-to-stand. Markers, pelvic tilt, hip/knee/ankle angles; strides normalised to 150 points. MATLAB files. **Licence: the figshare collection has no licence field; only the article's CC BY 4.0 is confirmed.**
- **Sprint acceleration and bend running:** no open dataset of block starts, sprint acceleration or curve running with kinematics was found. A Royal Society Open Science 2018 study of first-stance block starts has data on Dryad; not opened.
- **Ferber et al. 2024** (Scientific Data). 1,798 healthy and injured people, treadmill walking and running across speeds, on Figshare+. Licence not checked.

**3. Turning, cutting, sidestepping, backwards, shuffling**
- **Scherpereel et al. 2023** (Scientific Data). Download DOI 10.35090/gatech/70296. 12 people, 31 tasks (11 cyclic, 20 non-cyclic, including cutting, jumping, lunging, sit-to-stand). Raw markers, joint angles and moments, plate forces, IMUs, 16-channel EMG. Licence "Attribution 4.0 International", from a search snippet only.
- **100STYLE** (Ian Mason). CC BY 4.0; the page explicitly allows commercial work with credit. Forward, backward and sidestep walking and running, idles and transitions, in 100 styles. More than 4 million frames at 60 fps, BVH, 28 bones. One performer. Opened.
- **Cutting with forces:** the Neptune cutting set on the ISB site is open to members only.

**4. Stairs, ramps, uneven ground**
- **Camargo et al. 2021** (J Biomech). Three parts on Mendeley Data, CC BY 4.0 (opened). 22 adults. Treadmill and level walking, stair ascent and descent, ramp ascent and descent, transitions. EMG and IMUs.
- **Reznick 2021:** stairs at four inclines (above).
- **Uneven ground:** no dataset found.

**5. Jumps, drops, landings, vaulting**
- **AddBiomechanics 1.0.** Core set CC BY 4.0 (opened). 273 subjects, 71.5 h, 57.6 h with ground forces, pooled from 15 public sources. Musculoskeletal models, joint angles and torques, centre-of-mass motion. A figure shows drop jumps and running.
- **GroundLink** (Han et al. 2023, csr.bu.edu/groundlink). 7 subjects, 368 trials, 19 movement types. Full-body mocap (96 markers) with ground forces and centre of pressure. C3D, FBX, SMPL-X. No licence stated on the site.
- **Vaulting or parkour:** none found. LAFAN1 has 17 obstacle sequences (below).

**6. General motion-capture libraries (the licence is what matters)**

| Library | Licence | Commercial use? | Status |
|---|---|---|---|
| CMU | "free for all uses"; may ship inside commercial products, may not be resold as data | Yes | Opened |
| 100STYLE | CC BY 4.0 | Yes, with credit | Opened |
| HDM05 | CC BY-SA 3.0 | Yes, derivatives share-alike | Snippet only; page returned 403 |
| LAFAN1 (Ubisoft) | CC BY-NC-ND 4.0. 5 subjects, 77 sequences, 4.6 h at 30 fps, BVH: sprint 2, run 4, jumps 3, obstacles 17, walk 12 | No | Opened |
| AMASS | Non-commercial research, education or art only; bans training networks for commercial use and redistribution | No | Opened |
| Bandai Namco Research | CC BY-NC 4.0. Set 2 mostly locomotion, 7 styles, 384,931 frames | No | Opened |
| Motorica Dance | Research only, no redistribution | No | Snippet from a mirror |
| Mixamo | Royalty-free inside commercial projects; raw files may not be redistributed | In projects only | Forum snippets only; Adobe FAQ returned 403 |
| KIT Whole-Body | No licence found | Unknown | Not found |

**7. Animals**
- **MANN dog mocap** (Zhang et al. 2018). Licence conflict: mirrors of the AI4Animation README say CC BY-NC 4.0; a University of Bath record of data extracted from it says CC BY 4.0. Unresolved.
- **PFERD horses** (Li et al. 2024). 5 horses, more than 100 markers, 10 cameras. C3D and FBX on Harvard Dataverse (doi.org/10.7910/DVN/2EXONE). The code is CC BY-NC-SA; the data terms were not read.

## Part B: numbers

**1. Gait transition and timing**
- Walk-to-run transition: about 2.0 m/s, at a Froude number of about 0.5, holding across leg lengths and in reduced gravity (Kram et al. 1997, snippet; Wikipedia, opened, secondary).
- Backward: preferred transition speed 1.63 m/s, against 1.85 m/s forwards (JSSM, snippet).
- Stance share of the gait cycle: 62% walking, 31% running, 22% sprinting (Mann & Hagy 1980, snippet).
- Running swing: 62% of the cycle, against 40% walking (secondary course PDF, opened).
- Flight time: about 0.12 s for fast and slow runners alike; top speeds 6.2 to 11.1 m/s across 33 runners, faster runners pushing the ground harder (Weyand 2000; the 0.12 s is from a citing source).
- Not found: a cadence or step-length table by speed. Fukuchi 2017/2018 and Reznick let it be computed directly.

**2. Vertical motion and lean**
- Walking: the centre of mass moves about 5 cm peak-to-peak, vertically and side to side, at natural speed (J Biomech 2014, snippet).
- Running: 7.2 cm at 3.5 m/s and 7.8 cm at 4.9 m/s; the difference not significant (ISBS conference paper, snippet).
- Disagreement: a consumer source says oscillation falls with speed; not settled.
- Bend sprinting (Churchill et al. 2015, snippet): speed drops 4.7% on the bend (9.86 to 9.39 m/s on left steps, 9.80 to 9.33 on right). The left step loses frequency (-0.11 Hz); the right step loses length (-0.10 m). Inward lean at touchdown 14 degrees on the left step and 11 on the right, from a citing paper.
- Pelvis ranges and trunk lean in acceleration or braking: no numbers found. Nagahara 2014 splits a 60 m sprint into three phases with breaks near steps 4 and 14 (snippet).

**3. Joint angles**
- Running, secondary only: hip about 50 degrees flexed at strike, knee 40 at strike rising to 60 in loading, peak swing knee about 125, ankle 10 dorsiflexed at strike rising to 25 (a course PDF of unclear provenance, opened). Placeholders; measure the real targets from the datasets.

**4. Foot strike**
- Elite half marathon at 15 km: 74.9% rearfoot, 23.7% midfoot, 1.4-2% forefoot (Hasegawa 2007, snippet).
- Recreational runners at 10 km: 88.9% rearfoot, 3.4% midfoot, 1.8% forefoot; among marathoners rearfoot rose from 87.8% at 10 km to 93.0% at 32 km (Larson 2011, snippet).
- Walking: heel rise at about 30-31% of the gait cycle; foot progression 5.1-6.8 degrees toe-out in adults (secondary).

**5. Arm swing**
- At very slow walking the arms swing twice per stride, switching to once per stride as speed rises; transitions around 1.0-2.5 km/h with hysteresis and large differences between people (Kerkman 2020, snippet).

**6. Head**
- Pitch stays within 20 degrees in walking, walking in place, running in place and hopping (Pozzo 1990 abstract, snippet). Dunbar 2011 disputes how stable this is.
- Turning: the head anticipates a change of direction by about 200 ms (Grasso 1996); for 90 degree turns the head starts turning 0.2-0.6 s before the trunk (Sreenivasa 2008); it turns at a constant distance from the corner, not a constant time (Prévost 2002). All three from snippets.

**7. Acceleration and deceleration**
- Harper et al. 2020 (Sports, opened, the strongest primary source here): 27 male team-sport athletes stopped hard after a 20 m sprint. Approach speed 7.37-7.80 m/s. Average deceleration -4.24 m/s² (low group) and -4.99 m/s² (high group). Match play counts anything harsher than -3 m/s² as high-intensity.
- Peaks, from a review (snippet): deceleration about -5.7 to -6.3 m/s², acceleration 4.4-4.7 m/s².
- Sprint starts: the largest forward acceleration happens in the first stance (snippet).
- Not found: steps to top speed or elite peak acceleration.

**8. Stairs**
- Peak knee flexion about 90-92 degrees (Riener 2002; Protopapadaki 2007; from a secondary table with ambiguous headers). Not found: stance share and where the foot lands on the tread.

**9. Backwards and sideways**
- Backward walking: stride time 8-14% shorter than forwards at the same speed, similar stance share (Thorstensson 1986, snippet).
- Backward running: about 29% slower at maximum, shorter strides, higher stride frequency, more time in stance (snippet).
- Sideways or shuffle: nothing measured found.

## The ten datasets most useful to add

| # | Dataset | Licence | What it lets us measure that we cannot now |
|---|---|---|---|
| 1 | Reznick 2021 | Data unconfirmed (article CC BY) | Starts and stops at set accelerations, walk-run switch, stairs at 4 inclines, slopes |
| 2 | Scherpereel 2023 | CC BY 4.0 (snippet) | Cutting, jumps, lunges and other non-cyclic moves, with forces |
| 3 | Camargo 2021 | CC BY 4.0 | Stair and ramp ascent and descent, level-to-stair transitions, 22 people |
| 4 | Schreiber & Moissenet 2019 | CC BY 4.0 | Full-body walking with arms, 50 people, down to 0-0.4 m/s |
| 5 | Fukuchi 2018 walking | CC BY 4.0 | Walking at 8 speeds scaled by leg length |
| 6 | 100STYLE | CC BY 4.0 | Backward, sidestep and transition clips (one performer) |
| 7 | AddBiomechanics 1.0 | CC BY 4.0 (core) | Centre-of-mass motion and joint torques at scale, drop jumps |
| 8 | GroundLink | Unstated | Full-body mocap with forces and centre of pressure |
| 9 | LAFAN1 | CC BY-NC-ND | Sprints, jumps, obstacles, falls; scoring reference only, and only if the build stays non-commercial |
| 10 | Ferber 2024 | Not checked | Treadmill walking and running speed norms across 1,798 people |

For animals, the MANN dog set and PFERD are the only open candidates, and both have licence questions.

**Before anything ships (the agent's cautions):** confirm the licences for Reznick, GroundLink, Ferber, Mixamo and PFERD. Whether the build could ever be sold decides whether LAFAN1, AMASS and Bandai Namco are usable at all; whether numbers measured from no-derivatives data count as a derivative is a legal question the agent could not answer.

## Pages the agent opened
https://pmc.ncbi.nlm.nih.gov/articles/PMC6610108/ · https://pmc.ncbi.nlm.nih.gov/articles/PMC8553836/ · https://pmc.ncbi.nlm.nih.gov/articles/PMC5922232/ · https://api.figshare.com/v2/articles/7734767 · https://api.figshare.com/v2/articles/5722711 · https://api.figshare.com/v2/collections/5175254 · https://data.mendeley.com/datasets/fcgm3chfff/1 · https://epic.gatech.edu/?p=3841 · https://arxiv.org/abs/2310.03930 · https://csr.bu.edu/groundlink/ · https://github.com/ubisoft/ubisoft-laforge-animation-dataset · https://amass.is.tue.mpg.de/license.html · https://www.ianxmason.com/100style/ · http://mocap.cs.cmu.edu/ · http://mocap.cs.cmu.edu/faqs.php · https://github.com/BandaiNamcoResearchInc/Bandai-Namco-Research-Motiondataset · https://github.com/Celiali/PFERD · https://addbiomechanics.org/download_data.html · https://en.wikipedia.org/wiki/Transition_from_walking_to_running · https://knowledge.lancashire.ac.uk/id/eprint/33478/1/sports-08-00076.pdf (Harper 2020) · https://gyansanchay.csjmu.ac.in/wp-content/uploads/2022/02/Biomechanics-of-Running.pdf (secondary course notes)

## Could not open
https://peerj.com/articles/4640 (403) · https://www.nature.com/articles/s41597-023-02840-6 (login) · https://doaj.org/article/a6913051bdf6477a84a8a13c8bfcb3ec (Ferber 2024, 403) · https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html (403) · https://resources.mpi-inf.mpg.de/HDM05/ (403) · https://pubmed.ncbi.nlm.nih.gov/7416353/ (cookie wall) · https://www.physio-pedia.com/Running_Biomechanics (403) · https://link.springer.com/content/pdf/10.1007/s40279-022-01693-0.pdf (login)

## Snippet-only sources
Churchill bend sprinting: https://ojs.ub.uni-konstanz.de/cpa/article/view/4874 · Foot strike: https://paulogentil.com/pdf/Foot%20strike%20patterns%20of%20recreational%20and%20sub-elite%20runners%20in%20a%20long-distance%20road%20race.pdf · Arm swing: https://pmc.ncbi.nlm.nih.gov/articles/PMC7394052 · Head and turning: https://link.springer.com/article/10.1007/s00221-008-1525-3 · Backward running: https://www.jssm.org/jssm-04-446.xml-Fulltext · Weyand: https://www.harvardmagazine.com/2001/03/the-source-of-human-spee-html · Kram 1997: https://cob.silverchair.com/jeb/article/200/4/821/7425/Effect-of-reduced-gravity-on-the-preferred-walk · Pozzo 1990: https://www.doi.org/10.1007/BF00230002 · Walking centre of mass: https://www.doi.org/10.1016/j.jbiomech.2014.02.002 · Scherpereel licence: https://repository.gatech.edu/entities/publication/20860ffb-71fd-4049-a033-cd0ff308339e · Stairs table: https://pmc.ncbi.nlm.nih.gov/articles/PMC3528906/table/Tab4
