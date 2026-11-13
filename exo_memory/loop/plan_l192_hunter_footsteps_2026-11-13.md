# L192: the hunter's footsteps, heard coming (his items 16 and 178). Librarian, on L, 2026-11-13 02:4x local

**His words:**
- (16) the main entity's footsteps are "bassy and loud, like thunder";
- (178) "once we get better sound it will be better player experience instead of constant ganks with no footsteps u can hear barely".

**Pane:** E. Research first, then build (his 153, 165).

## Read first (each cited in the hand-back with what it gave)
- **Ours:**
  - `audio/README.md`, `audio/audio.h`, `audio/CHANGES.md`: what the chasers sound like today, and why he barely hears them;
  - `handback/p-d654-audio-C_2026-11-11.md`: C's audio research on D (rooms and portals, occlusion, what was chosen).
- **Footfall timing:** the gait's own phase. L181's stride law gives each chaser's step length from its hip height (`game/model_rig.cpp`, Alexander's law). So a footfall is a phase crossing: one sound for each drawn step, in time with the legs.
- **Loudness against speed:** Weyand et al. 2000 (doi 10.1152/jappl.2000.89.5.1991). Faster runners apply greater support forces (1.26 times for the faster group, from the abstract). The pane reads what it can of the full text for force against speed and takes the loudness curve from it.
- **Why a cue makes a catch fair (press, to be checked against a primary source):** Left 4 Dead gives each special infected its own audio tell, so players know a threat is near before they see it (PC Gamer; TechRaptor). Find Valve's own commentary or Morasky's talk if readable; mark it press if not.
- **Distance and walls:** what the D654 research and our mixer already support. Do not invent a new propagation model in this lap.

## Build
- **One footfall per drawn step of the hunter,** timed from the gait phase.
- **Level and low-end weight** rise with speed by the cited curve.
- **Attenuation** by distance, and by walls as far as the mixer already can.
- **Bass-heavy,** per item 16. Synthesised in `audio/synth.h`'s way unless the research says otherwise; no shipped samples of unknown licence.
- The lesser kinds keep today's sounds; they take footfalls when they have bodies.

## Tests (registered red first)
- **Timing:** a footfall event fires within one tick of each drawn foot contact over a scripted run (count and timing).
- **Level:** at 5, 10 and 20 m, and at 4, 8 and 12 m/s, the level follows the registered curve within its tolerance.
- **"Can he hear it":** with the hunter 15 m behind on a straight, its footfalls are above the bed by a registered margin. The margin is ours, marked, and his ear decides.
- **Fingerprints:** replays keep both (sound is outside the sim).

## For him
A short recorded clip with sound (the hunter closing from behind), and the build. His ear is the bar.
