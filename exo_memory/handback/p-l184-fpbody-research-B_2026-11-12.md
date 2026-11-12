# p-l184-fpbody-research-B: the player's own body seen in first person, research only (his item 159). Pane B, on L, 2026-11-12, written from 04:17 local (`date`)

**Packet:** chair 10:11:42Z (L184; the ledger calls it L182). The master is `loop/plan_l184_first_person_body_2026-11-12.md` (cc8c9cf6), read whole. **Nothing built.** It was written while L174 waited on the heavy-run lock; L174 runs first when the lock frees.

**Marks:**
- **[read]**: I fetched the text and read it.
- **[read, extracted]**: fetched by a research agent through a fetch tool that extracts with a small model. The two quotes this note leans on hardest (Rust and JSSM) I re-fetched myself, and they matched.
- **[video only]**: the talk exists, but no transcript could be read.
- **[not found]**: searched for and not found.
- **[ours]**: read from our code.
- **[inferred]**: mine.
- Code lines are dreamzone-3 at main 682fb36, in my worktree.

## Sources and their terms

| source | what was read | licence / terms |
|---|---|---|
| Dahl and Åberg (DICE), "Creating First Person Movement for Mirror's Edge", GDC 2009 slides (SlideShare 3151885; GDC Vault 1012171) | the slides and notes [read, extracted] | no licence stated: all rights reserved. Cited, not copied. |
| EA news, "Mirror's Edge Catalyst: The World from Faith's Perspective", 2015-06-26 (Erik Odeldahl) | [read, extracted] | © Electronic Arts |
| Binkowski, Kulon and Milewski, "Game Design Deep Dive: Dying Light's Natural Movement system", Gamasutra, 2016-06-02 | [read, extracted] | all rights reserved |
| MCV/Develop, "The Vaulting Dead", 2016-05-18 (quoting Binkowski and Kulon) | [read, extracted] | press, all rights reserved |
| Kulon, GDC 2018, "Parkour: How to Improve Freedom of Movement in First-Person Games in 20 Simple Steps" | **[video only]** | GDC, free video, all rights reserved |
| Garry Newman (Facepunch), "Rusty legs", garry.net (Rust devblog 74, 2015) | **[read]**, re-fetched by me | personal blog, no licence: all rights reserved |
| Sean Tracy (CIG), GamersNexus interview, 2016-10-05; RSI comm-link 14873, 2015-08-01 | [read, extracted] | press / © CIG |
| Kuntze, Sellers and Mansfield, "Bilateral ground reaction forces and joint moments for lateral sidestepping and crossover stepping tasks", J Sports Sci Med 8(1):1-8, 2009 | **[read]**, re-fetched by me | **CC BY-NC-ND 4.0** (the article's own statement) |
| Balasukumaran, Gottlieb and Springer, "Spatiotemporal gait characteristics… of backward walking…", Sci Rep 10:11515, 2020 (PMC7359031) | [read]: sentences taken from the full-text XML by grep | **CC BY 4.0** |
| "Agreement of Gait Events Detection during Treadmill Backward Walking…", Sensors, 2020 (PMC7664179) | [read]: grep of the full text | **CC BY 4.0** |
| Dewolf et al., PLOS ONE, 2021 (PMC7888655) | [read]: grep of the full text | **CC BY 4.0** |
| Donno et al., "Forward and Backward Walking…", Sensors 23:4671, 2023 | abstract only [read, extracted] | CC BY according to search results; **not seen by me** |
| Holden, "Code vs Data Driven Displacement", theorangeduck.com, 2021 | [read, extracted] | no licence: all rights reserved |
| Rosen, GDC 2014, "Animation Bootcamp" (the stride wheel) | the abstract only; the talk is **[video only]** | GDC Vault, free, all rights reserved |
| Valve Developer Wiki, "Blend sequence" | **not readable** (403 on every fetch) | unknown |
| Room ground | L176 (Overgrowth `ledgegrab.as`, Apache-2.0; ozz two-bone IK, MIT), L179 both halves, L181, L183 (96135025), L185 (49ceebd2) | as those hand-backs give them |
| **[not found]** | Naughty Dog on hand-on-wall contact; Techland on hand IK; Escape from Tarkov, Arma 3, Bodycam, Trepang2 on the first-person body; any game text on backward locomotion; any paper giving the speed at which people switch from shuffling to crossing over | — |

## His six behaviours

**1. Smooth from first person: no pops as the view moves.**
- **Sources:**
  - Mirror's Edge: "The key is to not animate the movement but to animate the perception of a movement" (Dahl and Åberg, [read, extracted]).
  - Catalyst: "The camera is attached to the actor's head and we have to make sure that all moves read well from that angle" (Odeldahl, [read, extracted]).
- **Ours:** L174 measured a real pop on his own run.
  - The forward hand held at the top of its swing, then fell 12–16 cm in one 1/144 s frame, against a median step of 0.9–2.6 cm.
  - The cause: the arm copied the other foot's ground contact (`game/body.cpp`, `hand(-1, reach_r)`).
  - The fix, a pendulum swing, is in L174 and is not landed at the time of writing (see its hand-back).
- **[inferred]:** the instrument for this behaviour exists now: `dz-world --capture-fpburst RUN DIR` and the per-frame joint log (L174). Every later step can be scored on his recorded runs.

**2. Looking down: legs, body and arms move as a person's do.**
- **Sources:**
  - Rust copies the whole third-person model and moves its bones out of the view's way: "So what we do is basically copy the third person model (which creates the shadows) and manipulate the bones" [read].
  - "We also pull the view upwards a bit when you're crouching and looking down so you don't put your knee through your head" [read].
  - Star Citizen keeps one animation set for both views: "A fire animation in third is the same as first" (Tracy, [read, extracted]). It stabilises the head camera by the "vestibular-ocular reflex" (same source).
  - Catalyst: "In real life, we are so used to using our arms and legs without looking at them, but in a game that just doesn't work" (Odeldahl, [read, extracted]). The limbs are staged to be read, not only to be true.
  - Dying Light shows "the main character's two arms, and sometimes his feet" (MCV, [read, extracted]).
- **Ours:** we already do the shipped thing. One procedural body is drawn from the kid's model, and the head is put away for the eye (`game/world/stage.cpp`, `add_model`).
- **[inferred]:** the sources split on how much to "stage". Catalyst stages limbs to read; his item asks for "how a real person would". Both are possible from one body.

**3. Sideways: the legs and feet cross over.**
- **Sources:**
  - The sidestep "consisted of a lateral movement in the direction of the leading limb"; the crossover step adds "movement of the trailing limb beyond the midline of the body" (Kuntze et al. 2009, [read], CC BY-NC-ND 4.0).
  - Its forces are "generally lower and largely lack a vertical impact peak" next to running ([read, extracted]).
  - Holden gives a strafe of "just under 3 m/s" ([read, extracted]).
  - Rosen's stride wheel and Valve's `move_x`/`move_y` blend could not be read (see the table).
- **Ours, read from the code:**
  - `body.cpp:283` puts each foot at `feet + right·(±0.10) + heading·(reach·contact/2)`.
  - Strafing right, `heading` is the body's right, so both feet sweep along one line through the hips, 0.20 m apart across a stride several times that long. **They pass through each other, neither shuffling nor crossing.**
  - **inferred:** that is what his "criss crossing" sees today. Not yet captured.
- **Room ground:** L185 layer 1 suggests SIMBICON's foot-placement law inside the kinematic target. A body moving sideways steps wider or crosses over. That is the room's inference, not a shipped source (L185 marks it "ours").
- **No source gives the switch speed** from shuffle to crossover. That is a choice to register, or his eye.

**4. Backwards: a real backward walk.**
- **Sources:**
  - "initial contact during BW is done by the toe instead of the heel"; "Step length is shorter and gait speed is slightly slower during BW" (Balasukumaran et al. 2020, [read], CC BY 4.0).
  - Contact events are "toes-strike during BW" and "heel-off during BW" (PMC7664179, [read], CC BY 4.0).
  - The counter-view: "it has been suggested that backward walking is basically forward in reverse" (Dewolf et al. 2021 citing Grillner, [read], CC BY 4.0).
  - Donno et al. 2023 find hip and ankle moments "approximately mirrored" but hip and knee range of motion "significantly reduced" (abstract only, [read, extracted]).
  - Holden: backward running "around 2 m/s" ([read, extracted]).
- **Ours, read from the code:**
  - A backward step uses the same `leg_cycle` placed along `heading = −ahead`.
  - The knees still bend toward `ahead` (`body.cpp:485`, hint `right·(0.10·side) + ahead·0.15`), and the foot lies along `ahead`.
  - So it is the forward cycle laid behind: heel and toe contact are not distinguished, and the step is not shortened.
- **[inferred]:** the sources agree on what to change: toe first, shorter steps, less hip and knee travel. They disagree only on whether the joint pattern is otherwise a mirror. Both readings lead to the same first change.

**5. Against a wall: the hands touch it and slide.**
- **[not found]:** no developer text from Naughty Dog, Techland or the true-first-person games on a hand touching and sliding along a wall. GDC Vault 1027376 ("Character Technology of The Last of Us Part II") exists as a title only.
- **Room ground:**
  - Overgrowth's grips: a swept-sphere probe per hand along down-and-in, keeping its last grip when the probe finds nothing (`ledgegrab.as:197-215`, Apache-2.0, L176).
  - ozz two-bone IK with `soften` near full reach (`ik_two_bone_job.h:93-96`, MIT, L176).
  - L185 layer 3: a wall brush as the player's first reaction.
- **Ours:** the hook exists. `HandOverride` and `Body::set_hand_overrides` (`game/body.h:93`, `:113`): "A later probe of the walls round the body … sets these". Nothing sets it today.
- **[inferred]:** the technique is ours, composed from code sources, with no shipped first-person text behind it. That is said plainly, so his eye is the test.

**6. The body meets the world dynamically.**
- **Room ground:**
  - L183: picture-only powered ragdolls.
  - L185: per-bone strength (legs keyed, upper body on motors) and reactions that drop strength for a moment.
  - L186 (E, just landed): the physics player after item 161. **I did not read L186 here.**
- **[inferred]:** for the first-person body the near-term part is layer 1 (where the feet go) and the hand probe (5). Both live in the kinematic target and need no `PhysicsSystem`.

## The camera inside the body (bears on L174)
- **Sources:**
  - Mirror's Edge first parented the camera to the head ("First idea, do some mocap, parent the camera to the head, done!"). Its second idea was an aim constraint on the camera ([read, extracted]).
  - Catalyst attaches it to the head (above).
  - Rust keeps the eye where it is and moves the body: "it's just a case of tucking shit behind the camera"; "the upper torso is tucked behind the camera" [read].
  - **No source I found pivots the eye about the neck.**
- **Ours (L174, measured):**
  - The glance turned the view 166° about the eye; the neck is 9 cm behind the eye.
  - At the full glance the body covered 11–12 % of the picture and about 35 % of its bottom quarter.
  - Turning the eye around the neck took that to 0.0 % at every glance stage, standing and sprinting (`dz-world --capture-fpbody`).
- **Where the sources disagree with what we did, for him:**
  - **(a) Ours, L174:** the eye goes around the neck. The body leaves the look-back entirely, including "the shoulder stays in the turn" that the code's comment once wanted. Nothing in the body changes.
  - **(b) Rust's:** the eye stays put, and the upper torso is tucked behind the camera for the eye only. The shadow keeps the true body. A sliver of shoulder could be kept at the picture's edge.
  - **[inferred]:** (b) is the shipped one. (a) is the more physical one (a head turns about its neck). They can combine: (a) for the turn, plus a small tuck if he wants the shoulder back at the edge.

## The first build step
- **What the sources agree on:** one full body, its bones moved for the first-person view (Rust, Star Citizen, Catalyst), with the camera at the head. We have that.
- **[inferred] The first step, then, is foot placement for strafing and backing**, in `leg_cycle` and the `foot` lambda (`body.cpp`), before any hand IK.
  - The two have the most sourcing: Kuntze for crossing; Balasukumaran and PMC7664179 for backward.
  - Both are visible in his first look down, and both are kinematic.
  - **Strafe:** the trailing foot passes in front of or behind the leading one, crossing the midline, instead of through it.
  - **Backward:** toe first, shorter steps, and the knee and foot no longer laid out as if going forward.
- **Then the hand on the wall** through `HandOverride`, with a probe (Overgrowth's grips, ozz soften).
- **Then L185's layers**, on the L181 chain.

## Rows to register red before the build (not written yet; registered here)
1. **Strafe:**
   - On a scripted strafe at walking speed on a flat floor, the two ankles never come within 8 cm of each other.
   - In each stride, the trailing foot crosses the body's midline (Kuntze's definition) at least once.
   - **Predicted red today** (`body.cpp:283` sweeps them along one line).
2. **Backward:**
   - On a scripted backward walk, at each contact the toe is lower than the heel.
   - The mean step length is shorter than forward at the same speed.
   - **Predicted red today.**
3. **Wall:**
   - Running beside a wall 0.4 m from the body's centre, the near hand is within 5 cm of the wall's plane in at least half of the ticks it is in reach.
   - **Red today:** nothing sets `HandOverride`.
4. **Camera:** no part of the body in the picture at the full glance. **L174's row**, red on 682fb36, green with its fix.

**Each would be falsified, and the build stopped and brought back,** if its red state is not seen on today's code first.

## NOT verified
- **Not re-read by me:** quotes marked [read, extracted] other than Rust's and Kuntze's. They came through a fetch tool's model-extraction step and should be spot-checked before anyone quotes them outward.
- **Not read:** Rosen's and Kulon's talks (video only); Valve's blend page (403); Donno's licence; L186.
- **Not captured yet:** the strafe "through each other" and the backward cycle are read from the code. His run had no strafe or backward stretch to capture (L174's bursts: a slide, a sprint, an 81° turn).
- **Nothing built.**

## Corrections
- None.

NEXT: librarian put the camera choice (a)/(b) and the crossover switch speed to him, when L174 has landed and this pointer is read.
