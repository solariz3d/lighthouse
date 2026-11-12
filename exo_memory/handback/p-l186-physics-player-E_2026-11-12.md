# p-l186-physics-player-E: physics that drives the player's camera and controls, "done right" (his item 161). Pane E, on L, 2026-11-12, written from 04:1x local (`date`)

**Packet:** the chair's L186, 10:11:43Z. **Plan:** `loop/plan_l186_physics_player_2026-11-12.md` (35d0e242), read whole.
**His words:** `briefs/dreamzone2_the_game.md` item 161 ("physics could control the camera and controls, it would make sense to me if it is done right"), with 147, 159, 160.
**Research only; nothing built.** dreamzone-3 read at main `add21fe`, read only.
**Marking:**
- **[read]** is the source's own text or code, with its licence or terms;
- **[press]** is a third party's report;
- **[inferred]** is mine;
- **[ours]** is dreamzone-3's code.

## Sources and their terms

| source | what I read | licence / terms |
|---|---|---|
| Jolt v5.6.0 `Docs/Architecture.md:701-727` (character controllers) | whole section | **MIT** |
| dreamzone-3 `sim/physics.cpp:375-505`, `game/camera.h:1-80` | the player's mover and the camera rig | ours |
| DReCon (Bergamin, Clavet, Holden, Forbes; Ubisoft La Forge), ACM TOG 38(6) 206, 2019, PDF from theorangeduck.com | whole paper (pdftotext; "l.N" = output line) | © 2019 the authors, publication rights ACM. Cited, not copied. |
| Geijtenbeek and Pronost 2012 | l.83, read in L183 | © the authors, EG and Blackwell |
| DICE, "Creating first person movement for Mirror's Edge" (T. Dahl, lead animator; J. Åberg, lead programmer), slides on SlideShare | the deck's text through WebFetch (no images; undated on the page) | © DICE / EA. Cited, not copied. |
| Escape from Tarkov 0.12.12 inertia (Battlestate) | **press only**: gamepressure, Sportskeeda, Dexerto | press |
| Human: Fall Flat (No Brakes Games, T. Sakalauskas) | **press interviews only** (gamingbolt; Xbox Wire GDC 2016) | press |
| Exanima (Bare Mettle) | **press and store text only**; their patch notes speak of "improved footwork and balance" | press. **No developer text on how the body is controlled found.** |
| Arma's inertia; Gang Beasts | **not read** | none found in the time |

## 0. What is already true [ours, checked]

- **The player is already moved inside Jolt, but kinematically.** `Physics::move` sets the velocity the movement code computed and calls `CharacterVirtual::ExtendedUpdate` (`sim/physics.cpp:465-477`). The comment: "the movement code supplies the whole velocity itself". `mMaxStrength = 0` (`:382`), so it pushes nothing. **Jolt does the collision; our code decides the motion.**
- **[read] Jolt names this the right split for a player** (`Architecture.md:705`): the rigid-body `Character` "is usually not the best solution for a player as the player usually requires a lot of behavior that is non-physical"; "Characters are usually driven in a kinematic way" (`:707`). A hybrid exists: `mInnerBodyShape` gives a `CharacterVirtual` "an inner rigid body that follows the movement" (`:725`).
- **The camera already separates the picture from the aim** (`game/camera.h:20-22`): "The rig never changes where the player aims: yaw and pitch are the player's own, passed through, and the nod is given beside them (pitch_add) for the picture alone." It advances once per sim tick, so it is "as deterministic as the simulation and plays back the same in a replay" (`:3-5`). Bob, sway, landing dip and roll are springs on the eye (`:9-19`), scaled by `camera_effects`.
- **[inferred]** So item 161 is partly built already: physics (Jolt) owns the collision, and simulated springs own the picture's motion. The open question is **how much of the body's motion and the eye's motion comes from a physics body** rather than from those springs.

## 1. The options, kinematic to physical

| # | what physics owns | source | responsiveness cost | determinism risk |
|---|---|---|---|---|
| **K0, today** | collision only (CharacterVirtual); spring effects on the eye | [ours]; Jolt `:705-707` | none | none (in the sim, replayed) |
| **K1, the eye rides a simulated head, the aim does not** | the **picture's** eye position (bob, impact, stumble) comes from a powered head/neck body on the L185 ragdoll; yaw/pitch stay the mouse's | Mirror's Edge [read]: "parent the camera to the head, done!" was tried first and was "not very good"; "motion sickness" was a listed concern; "The key is to not animate the movement but to animate the perception of a movement" | **none to the aim** (`camera.h` keeps the aim apart). Picture only. | low **if** the head body lives in the picture-only system (L185); the eye then differs nowhere in the sim |
| **K2, the body's reactions are physical, the root is not** | arms, torso and head react to contact (item 159's hands on walls), landings and hits; the capsule's motion stays ours | DReCon l.14: in games physics "is most often applied in limited scope such as for secondary motion"; Jolt soft keying (L183) | none to the controls; the picture of the body changes | none if picture only (L185); **real** if anything it touches feeds back |
| **K3, physics shapes the root's motion (inertia)** | acceleration, stopping and turning limits come from a mass and forces rather than our tuned curves | Tarkov 0.12.12 [press]: inertia added for "walking, strafing, sprinting, sharp turns … landing after jumping"; the community "split" over it (Sportskeeda), and named streamers' "biggest gripe" (Dexerto) | **costs the controls**: the point of inertia is that input takes longer to become motion | in the sim, deterministic only under Jolt's rules (`Architecture.md:787-807`, L183 §3) |
| **K4, a fully simulated, self-balancing player body** | the root moves because the legs push; the camera rides the head | DReCon [read]; Exanima and Human: Fall Flat [press] | **largest.** DReCon, the most responsive research controller I found: a −3 → +3 m/s reversal has "a rise time around 1.5 seconds … similar to the response of the kinematic motion" (Fig. 10, l.382). Its own limits: "our character can sometimes fall when control requirements are too severe" (l.552). Human: Fall Flat [press, paraphrased by the search, not verbatim]: a reviewer noted it does not control like a standard game. | a learned policy in the sim (DReCon trains for days; Bullet at 60 Hz with "constraint solver noise", l.112, l.538) |

**[read] The research names the gap K4 has to cross.** Geijtenbeek l.83: physics-based characters are "less reactive during direct control tasks". DReCon l.15: earlier tracking controllers "lack responsiveness when steered by user input". **DReCon closes much of that gap by keeping a kinematic controller in front** (motion matching produces the target; the physics tracks it, l.22). Even then, its response is the motion-capture actor's own (1.5 s for a full reversal), not a game controller's.

## 2. Against the registered bars (the plan's 1-4)

- **Bar 1, input-to-motion and camera time no worse; aim never delayed.**
  - **[inferred]** K0, K1 and K2 pass by construction: the aim stays `yaw`/`pitch` passed through, and the root's motion stays our movement code.
  - K3 **fails by design** (inertia is input taking longer to become motion).
  - K4 **fails** by DReCon's own figure: a 1.5 s reversal against our controller's (L171: `sim/params.h`, ticks to full turn; not measured here).
- **Bar 2, replays byte-identical.**
  - **[inferred]** K1 and K2 in a picture-only system pass trivially, since the sim does not read them.
  - K3 and K4 put a stepped `PhysicsSystem` in the 240 Hz tick: possible under Jolt's rules (same order, same binary, CROSS_PLATFORM_DETERMINISTIC already on), but every caveat (`:804-807`) becomes our problem.
- **Bar 3, L171's movement tech kept** (slide, surge, wall run).
  - **[inferred]** K0–K2 keep it untouched.
  - K3 re-tunes all of it through mass and forces.
  - K4 needs each move learned or controlled (DReCon: "So far our method only excels on locomotion tasks. Other movements have yet to be attempted", l.552). **A wall run, a vault and a slide are exactly the "other movements".**
- **Bar 4, his hands.** Only a build says. K1 and K2 are the ones that can be built and played without touching the controls.

## 3. The first build step the sources agree on

**[inferred, from §0–§2]:** **K1 + K2 on the L185 body: the eye's motion and the body's reactions come from physics, and the aim and the root stay as they are.**
1. **L185 step 1 first** (the 21-joint rotation skeleton): the same skeleton serves the player's body and its head.
2. **The first-person body as a powered ragdoll in the picture-only system,** hard-keyed to today's pose. It is invisible, like the hunter in L185.
3. **The eye from the head body, blended with today's springs** under one setting. Mirror's Edge's lesson as the guard: the raw head is "not very good" and makes people sick, so the head's motion must be **filtered toward the springs**, with `camera_effects` still taking it to nothing.
4. **The hands meeting walls (item 159), soft-keyed.** This is the contact physics that only a physics body gives.
- **Registered tests:**
  - (a) the replay of a kept run is byte-identical before and after;
  - (b) with `camera_effects` 0 the eye equals today's to the millimetre;
  - (c) the aim's yaw and pitch equal the input's every tick.

**Where the sources disagree, both, for him:**
- **(a) Physics on the picture, not the controls** (Mirror's Edge, Jolt's own advice for players, DReCon's "secondary motion" in shipped games, the plan's bars). Everything above.
- **(b) Physics on the controls too** (K3 inertia, K4 a simulated body). Tarkov shows players **split** over even mild inertia [press]. Exanima and Human: Fall Flat make the looseness the game itself [press]. DReCon shows the best research body reverses in about 1.5 s. **That is a different game from the chase he has been tuning since item 18**, where a juke at a corner wins. If he wants weight in the controls, the smallest step is a **K3 dial** (a little inertia on reversals only, off by default), measured against bar 1 by the bots before his hands.
- **My lean is (a), with the K3 dial available as an experiment** he can feel and turn off.

## NOT verified

- **Not run:** no timing (none on L); our controller's reversal time is not measured here.
- **Tarkov, Human: Fall Flat and Exanima are press;** no developer text on how their bodies are controlled was found. **Arma and Gang Beasts were not read.**
- The Mirror's Edge deck was read as text through a fetch; its images were not seen.

## Corrections

- **Mine, L183 §3 (`p-l183-physics-anim-E`, 96135025):** "The one place it must stay picture only: the player's own body. It cannot drive the camera or the controller." That was **my inference from one line** (Geijtenbeek l.83), written as a rule, and the librarian carried it into L185 as "never". This lap's sources narrow it: the line holds for the **controls** (K3/K4 against bar 1), **not for the camera's picture or the body's reactions** (K1/K2). His item 161 was right to strike the "never".

NEXT: librarian put (a)/(b) and the K3 dial to him with L185 step 1, when this pointer is read.
