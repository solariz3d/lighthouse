# L193: real motion as the yardstick. Our bodies scored against recorded human movement, joint by joint (his items 153, 165, 177, and "work right"). Librarian, on L, 2026-11-13 02:5x local

**Why:** every flaw in the bodies so far was found by his eye, one joint at a time: the lean after the turn (151), the legs that cannot keep up (163), the arms at the sides (177). His word each time was that the research was not used. One number read from one paper cannot hold a whole body to account. Recorded motion can.
**Rule kept:** learn from, not use. The data is a **test reference**. It is never shipped, never committed to dreamzone-3, and no clip is played in the game. The bodies stay procedural.
**Pane:** E. It stands on E's own `game/skeleton.{h,cpp}` (`to_rotations`: a pose as joint rotations). B and C are its users.

## The references (checked to exist by the librarian; the pane reads each one's own terms before fetching)
- **Fukuchi, Fukuchi & Duarte 2017,** "A public dataset of running biomechanics and the effects of running speed on lower extremity kinematics and kinetics", PeerJ 5:e3298.
  - 28 runners at 2.5, 3.5 and 4.5 m/s; processed joint angles in txt and c3d on Figshare (doi 10.6084/m9.figshare.4543435). The article is CC BY 4.0.
  - **Gives:** hip, knee and ankle angle curves through the stride against speed.
- **The CMU Graphics Lab Motion Capture Database.**
  - Terms as E read them in L187: free for research, may be included in products, not resold as data.
  - 2,605 sequences in ASF/AMC, with BVH conversions; a GitHub mirror exists (`meshula/cmu-mocap`, to be checked).
  - **Gives:** the whole body, arms and trunk included, for running, walking, turning, sidestepping and walking backwards. The site's motion index names the clips; the pane picks them from it and records which.
- **Sprint speeds** (the hunter runs 9–13 m/s, above both sets): the elite sprint kinematics C found for L191, and Alexander's stride law (L187). Where no data reaches, the hand-back says the yardstick does not cover it.

## Build (in `tools/`, outside the shipped game; data fetched by a script with checksums into an untracked folder)
1. **Read a clip:** an ASF/AMC or BVH reader with forward kinematics, giving joint positions per frame.
2. **Map it onto our 21 joints** and normalise by leg length. Detect foot contacts to get the stride's phase and the clip's speed.
3. **Score our body against it.** Drive `gait_pose` (the hunter) and `Body` (the player) at the clip's speed and phase, then compare per joint through the stride:
   - hip, knee and ankle flexion;
   - pelvis and thorax rotation;
   - shoulder flexion and abduction, and elbow flexion;
   - step length, cadence, and the share of the stride each foot is down.
   - **Output:** a table of errors per joint and per speed, and a contact sheet with the reference skeleton beside ours at eight phases, from the side, the front and above.
4. **The same for the moves he named (159):** the sidestep and crossover, walking backwards, and a turn. For the first-person body, also project both skeletons from the eye, so "what he sees looking down" is compared too.

## Tests of the yardstick itself (the L170 lesson: test a measuring tool on cases whose answer is known)
- A clip scored against itself reads zero.
- A clip scored against itself with the arms pinned to the sides reads a large shoulder-abduction error. That is his item 177, as a number.
- **Today's bodies are scored first, before any fix,** and the table is filed: it should name the arms, and whatever else is off that he has not yet said.

## Then
- B and C take the table as their work list, worst joint first, and iterate to registered tolerances (set from the spread between the reference runners, not invented).
- His eye stays the last bar. The contact sheet is what he is shown.

## Not verified
- CMU's sidestep and backward clips are assumed from its categories; the pane confirms from the index.
- The Figshare files' own licence line (the article is CC BY 4.0).
- Whether the references reach the hunter's speeds (they do not, as far as read).
