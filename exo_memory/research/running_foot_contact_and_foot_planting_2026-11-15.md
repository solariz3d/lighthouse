# A runner's foot on the ground, and how published systems plant heel and ball (a research agent's report, 2026-11-15)

Filed by the librarian on D at his word of 13:29 ("should be everything open source we can access for proc gen animationn techniques etc"). **This is an agent's report, filed whole. The librarian has opened none of its sources.** The agent's own marks stand: [read] it opened the source, [inferred] its own step, "snippet" a search result only. The request carried nothing of the game.

## 1. Summary

Most of the animation sources were read directly; the biomechanics has real gaps. Fukuchi 2017 gives stride length and cadence per speed but no stance time, so duty factor comes from a different recreational-runner study (Patoz 2022) whose stride times match Fukuchi's exactly at 2.5 and about 3.5 m/s. Heel-off timing comes from one barefoot study at 3.3 m/s (De Cock 2005). No opened source gives centre-of-pressure travel in metres, ankle travel over the planted foot, or pelvis rise and fall per speed at 2.5/3.5/4.5 m/s.

Not opened: Unreal's Foot Placement pages (403/404; search snippets only), any transcript of Rosen's talk, Lee & Farley 1998 and Cavanagh & Lafortune 1980 full texts. Kovar, Johansen and Novacheck were read through a PDF text-extraction proxy and summarised by the fetch tool, so spot-check quotes against the PDFs before using them verbatim.

## 2. Key findings

### Part 1: Biomechanics

**a) Contact sequence**
- Barefoot jogging at 3.3 m/s, 220 adults: stance splits into initial contact 8.2%, forefoot contact 11.3%, foot flat 25.3%, forefoot push-off 55.1%. Order: heel, then metatarsals lateral to medial, then hallux. [read, abstract] (S3)
- So first metatarsal contact is at about 8% of stance, forefoot flat at about 19.5%, heel-off at about 45%. [inferred: cumulative sums, assuming push-off starts at heel-off; full text not opened]
- As a share of the full cycle, heel-off falls at about 15-17% and foot flat at about 6-7%. [inferred from S3 and S2; applies barefoot percentages to shod running]
- Novacheck: toe-off at 39% of the cycle for running (3.2 m/s) and 36% for "sprinting" (3.9 m/s); world-class sprinters "as early as 22%". [read] (S4)
- "Initial contact during walking and running occurs with the heel"; "In sprinting, initial contact occurs on the forefoot"; elite sprinters may never touch the hindfoot down. About 80% of distance runners are rearfoot strikers. [read] (S4)
- In Fukuchi's runners, rearfoot strike was 68%, 68% and 61% at 2.5, 3.5 and 4.5 m/s. [read] (S1)

**b) Centre of pressure and ankle travel**
- Qualitative only: the pressure point shifts forward over the lateral foot during forefoot contact, and its forward velocity is low during push-off. [read, abstract] (S5)
- "The point of force application between the foot and the ground moves forwards during the stance phase"; the abstract gives no distance. [read, abstract] (S6)
- No source for ankle forward and upward travel was found. Geometrically, the ankle centre is fixed during foot flat (about 20-45% of stance) and then moves on an arc about the ball. [inferred]

**c) Spatiotemporal values**

| Speed | Stride length (S1) | Cadence (S1) | Step length | Contact / flight (S2) | Duty factor (S2) |
|---|---|---|---|---|---|
| 2.5 m/s | 1.86 ± 0.11 m | 80.82 strides/min | 0.93 m | 279 / 92 ms | 37.7% |
| 3.06 m/s | not given | not given | not given | 250 / 111 ms | 34.7% |
| 3.5 m/s (S2: 3.61) | 2.46 ± 0.15 m | 85.68 | 1.23 m | 228 / 122 ms | 32.6% |
| 4.5 m/s | 2.96 ± 0.20 m | 91.74 | 1.48 m | not found | not found |

- S1 and S2 columns are [read]; step length is stride/2 [inferred].
- S1 is 28 runners on a treadmill; S2 is 115 recreational runners at 9, 11 and 13 km/h.
- The two datasets agree: S2's stride times (742 and 700 ms) equal S1's at 2.5 and 3.5 m/s. [inferred]
- At 4.5 m/s, extrapolating S2's trend gives roughly 30% duty factor and 195-200 ms contact. [inferred; unsourced]
- Fukuchi dataset contents [read] (S1):
  - Markers: three heel markers per foot (top, bottom, lateral), metatarsals 1, 2 and 5, lateral and medial ankle. No toe marker.
  - Raw files: marker trajectories at 150 Hz; forces at 300 Hz including centre of pressure.
  - Processed file: hip, knee and ankle angles, torques, forces and powers. No foot-segment angle.
  - Events: 20 N threshold on vertical force.

**d) Vertical displacement**
- Near the walk-run transition, the centre of mass drops 0.073 m in the first half of stance. [read, search snippet of abstract] (S7)
- Mean oscillation of a C7 marker was 9.4 ± 1.8 cm across preferred speeds of about 8.9-12.9 km/h. [read] (S8)
- Displacement during contact decreased as speed rose from 8 to 14 km/h; values are in a figure only. [read] (S9)
- Novacheck gives no number: "the center of mass is lowered as the motion changes from walking to running to sprinting." [read] (S4)

**e) Novacheck 1998** [read] (S4)
- Stance: the knee flexes to about 45° in absorption, then extends to about 25° at propulsion. Sprinting flexes less and extends to 20°.
- Swing: about 60° walking, 90° running, 105° sprinting, up to 130° in trained sprinters.
- Sprinting has less stance dorsiflexion and more push-off plantarflexion than running.

### Part 2: Animation systems

**a) Kovar, Schreiner & Gleicher 2002** [read] (S10)
- "A footplant constraint consists of requiring either the heel or the ball to be planted"; both can be planted at once.
- Toes are not constrained but are kept out of the ground.
- With both planted, the foot may only rotate about the heel-to-ball axis. With one planted, the ankle is translated so that point hits its target.
- Root: "move the root by the smallest amount that makes the target ankle positions reachable". It is projected onto a sphere (one leg) or the intersection of two (both), then averaged over the constrained block.
- The residual is met "by slightly stretching the legs", only near full extension (maximum 2.6% in their tests).

**b) Holden** [read] (S11, S12)
- Detection is offline: toe-joint speed below 0.15 (units unstated), then a 6-frame median filter as a "majority vote".
- The locked point is the toe joint (`Bone_LeftToe`, `Bone_RightToe`), projected to the ground with its height set to `ik_foot_height = 0.02`. The heel is not a contact.
- Unlock happens when the locked point drifts beyond `ik_unlock_radius = 0.2` from the animation.
- Blending in and out uses an inertializer, `ik_blending_halflife = 0.1`.
- Pitch and toe handling: the heel target is computed from the toe; two-bone IK places the heel; a look-at turns the heel toward the contact point; the toe bone is rotated so its tip (`ik_toe_length = 0.15`) stays above floor height.
- His own caveat: "Usually foot locking is difficult to make look good."
- The toe joint here is probably the ball of the foot, given the 0.15 tip offset. [inferred]

**c) ozz-animation and Unreal**
- ozz: a ray is cast down from each ankle; the character is offset down so "the lowest ankle" reaches its target; two-bone IK, then aim IK to the floor normal. No heel/ball pivot or foot roll. [read] (S13)
- Unreal Foot Placement [search snippets only; pages returned 403/404] (S14): lock types are unlocked, pivot around ball, pivot around ankle, and lock rotation; a plant releases beyond an unplant radius and replants below a ratio of it; pelvis `MaxOffset` is the "Max vertical offset from the input pose"; `HeelLiftRatio`: "1 fully favors heel lift first. 0 fully favors pelvis drop first."

**d) Johansen 2009** [read] (S15)
- The footbase is "a line segment that has the same length as the foot and which is always parallel to the ground". The foot touches it with whichever of heel or toe is lower; a balance value runs from 0 (heel lower) to 1 (toe lower).
- Key times are foot-lift, foot-off, foot-strike and foot-land. Foot roll spans strike to land and lift to off; no heel-first assumption is made.
- Ankle rotation from the source motion is weighted zero in stance, one in flight, and linearly between during foot roll.
- Hip height: each leg yields a desired height (keeps the leg's bend) and a maximum (leg straight). The offset blends the lowest desired, the average desired and the lowest maximum, to avoid "second-order discontinuities".
- Footprints are grounded with two raycasts, heel and toe.

**e) Rosen, GDC 2014**
- No transcript or slides could be opened, so nothing is reported on feet or pelvis height. Only the talk description (S16) and a secondhand "13 keyed poses" (S17) were read.

### Part 3: Synthesis (the agent's, not sourced as a whole)

**Planted point by phase, rearfoot striker:**
1. 0 to about 8% of stance: heel only; the foot pitches down about it.
2. About 8-20%: heel planted while the ball comes down.
3. About 20-45%: heel and ball both planted; foot pitch is fixed to the ground.
4. About 45-100%: ball only; the heel rises and the toes stay flat until late.

Toward sprinting, drop phases 1-3 and plant the ball throughout. Most reliable: S3 (timing), S4 (speed shift), S10 (heel and ball as separate switchable constraints).

**Pelvis height:**
- Solve it from the stance leg; do not author it.
- Run the measured hip, knee and ankle angles upward from the currently planted point; the hip height that results is the pelvis height.
- Where a target is unreachable, move the root the minimum distance, smooth it, and prefer heel lift or a small leg stretch over a pelvis drop.
- In flight, carry the pelvis ballistically (about 1.0-1.8 cm of rise for 92-122 ms of flight). [inferred from S2]
- Sanity-check the result against roughly 7-9 cm of oscillation (S7, S8).

Most reliable: S10 (root projection), S15 (desired/maximum hip height), S1 (ground-truth markers to validate against).

## 3. Disagreements

- **Stance fraction:** Novacheck's 39% at 3.2 m/s against Patoz's 34.7% at 3.06 m/s. Event definitions differ, and Novacheck's text (36%) and figure (37%) disagree with each other.
- **Displacement trend:** S9 says it falls with speed from 8 to 14 km/h. Schepens, Willems & Cavagna 1998 (S18) say whole-step displacement rises to about 11 km/h, then the contact part falls. They measure different quantities.
- **Contact model:** one toe point (Holden), separate heel and ball (Kovar), unified footbase (Johansen), ball or ankle pivot (Unreal).

## 4. Open questions

- Heel-off timing for shod running, and how it shifts across 2.5-4.5 m/s. S3 is barefoot at one speed.
- Centre-of-pressure travel and ankle travel in metres, and pelvis oscillation per speed. All three are directly measurable from S1's raw markers and force files, which would be better than any literature figure.
- Contact time at 4.5 m/s.
- Rosen's talk needs someone to watch the video.

## 5. Sources

- S1. Fukuchi, Fukuchi & Duarte 2017, "A public dataset of running biomechanics…", PeerJ. https://pmc.ncbi.nlm.nih.gov/articles/PMC5426356/
- S2. Patoz et al. 2022, "Using statistical parametric mapping to assess the association of duty factor and step frequency on running kinetic", Front. Physiol. https://www.frontiersin.org/articles/10.3389/fphys.2022.1044363/full
- S3. De Cock, De Clercq, Willems & Witvrouw 2005, "Temporal characteristics of foot roll-over during barefoot jogging", Gait & Posture. https://doi.org/10.1016/j.gaitpost.2004.05.004
- S4. Novacheck 1998, "The biomechanics of running", Gait & Posture. https://www.niccostiff.co.uk/wp-content/uploads/2020/02/Biomechanics-of-running-gait.pdf
- S5. De Cock et al. 2008, "The trajectory of the centre of pressure during barefoot running…", Gait & Posture. https://doi.org/10.1016/j.gaitpost.2007.08.013
- S6. Bullimore & Burn 2006, "Consequences of forward translation of the point of force application…", J. Theor. Biol. PMID 15996682
- S7. Lee & Farley 1998, "Determinants of the center of mass trajectory in human walking and running", J. Exp. Biol. 201:2935 (full text not opened)
- S8. Smith et al. 2022, "The validity and reliability of wearable devices for the measurement of vertical oscillation for running", PLoS One. https://pmc.ncbi.nlm.nih.gov/articles/PMC9671438/
- S9. Meyer, Falbriard, Aminian & Millet 2023, "Vertical and Leg Stiffness Modeling During Running", Int. J. Sports Med. https://infoscience.epfl.ch/record/303314/files/a-2044-4805.pdf
- S10. Kovar, Schreiner & Gleicher 2002, "Footskate Cleanup for Motion Capture Editing", SCA. https://research.cs.wisc.edu/graphics/Gallery/kovar.vol/Cleanup/cleanup.pdf
- S11. Holden 2021, "Code vs Data Driven Displacement". https://theorangeduck.com/page/code-vs-data-driven-displacement
- S12. Holden, Motion-Matching repository, `controller.cpp` and `resources/generate_database.py`. https://github.com/orangeduck/Motion-Matching
- S13. Blanc, ozz-animation foot IK sample README. https://github.com/guillaumeblanc/ozz-animation/blob/master/samples/foot_ik/README.md
- S14. Epic Games, FFootPlacementPelvisSettings / FFootPlacementPlantSettings / EFootPlacementLockType (not opened). https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/AnimationWarpingRuntime/FFootPlacementPelvisSettings
- S15. Johansen 2009, "Automated Semi-Procedural Animation for Character Locomotion", Aarhus University. https://runevision.com/thesis/rune_skovbo_johansen_thesis.pdf
- S16. Rosen 2014, "Animation Bootcamp: An Indie Approach to Procedural Animation", GDC. https://www.youtube.com/watch?v=LNidsMesxSE
- S17. Oraqia 2014, "Procedural Animations with IK" (secondhand). https://oraqia.wordpress.com/2014/07/01/procedural-animations-with-ik/
- S18. Schepens, Willems & Cavagna 1998, "The mechanics of running in children", J. Physiol. https://pmc.ncbi.nlm.nih.gov/articles/PMC2231007/
