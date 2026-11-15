# Existing open systems for the bodies: pane A's four candidates, evaluated from source (seat A, D677, 2026-11-15)

**For:** the plan's section of 15:54 (`loop/plan_animation_restart_2026-11-15.md:445`, hash-object 67ad043c), his item 244 ("there has to
be open source gems that already exist which we can then modify?"). Tier: check it.
**Rules kept:**
- nothing entered the game's tree and nothing was copied into it;
- fetched files are in their own empty folders under `G:\oss-eval\`, never beside ours;
- every outside request was unauthenticated, with a generic client name, and carried nothing of the game, the room or him;
- nothing was installed.

**The answer in one line: none of my four can be filmed moving today without a call that is his.**
- **Overgrowth** needs the purchased game's data.
- **Holden's Motion-Matching** needs the raylib library installed, and a gamepad.
- **Esoterica** needs Visual Studio 2026 installed, and has no walking data in it at all.
- **The open motion data** is a 1.47 GB download at the least.

So **the demo clips' folder, `G:\oss-eval\clips\`, is empty,** and section 5 says what each would need.

**checked:** the GitHub API's repository records (size, licence, default branch, last push), read at 16:00 local; the licence and README files
fetched raw into `G:\oss-eval\{overgrowth,motion-matching,esoterica}\`; Esoterica's three nodes fetched into `G:\oss-eval\esoterica\nodes\`;
Holden's `controller.cpp` and its `resources` listing; 100STYLE's own page and its Zenodo record (8127870).

---

## 1. Overgrowth (Wolfire Games), github.com/WolfireGames/overgrowth

1. **The licence, opened** (`LICENSE`: Apache License 2.0; the README's section "License"):
   - The CODE is Apache-2.0: "you can use it for more or less whatever you want, including in closed source projects".
   - **A sold game with a private repository may take it.** It must:
     - include the whole LICENSE text in what it ships;
     - mark each changed file as modified;
     - keep every copyright notice.
   - **The game's DATA is not open:** "the game data (such as art assets and levels) can only be legally obtained by purchasing
     Overgrowth", and "if you would like to distribute any of the original Overgrowth assets, you must obtain explicit written permission
     from Wolfire Games."
2. **Builds and runs here?**
   - **Not fetched whole: the repository is about 2.3 GB** (GitHub reports 2,301,901 KB).
   - Its `COMPILING.md`: "To compile and run Overgrowth, you first need to have installed a commercial version of the game". It needs CMake and
     Visual Studio 2022; both are on this machine.
   - **Overgrowth is not installed here** (checked the Steam libraries and Program Files). Running it means buying it: **his call.**
3. **Its demo filmed:** no. It cannot run without the purchased data.
4. **What taking it would mean:**
   - Its procedural character is a few key poses, springs, the lean, IK and a ragdoll. The room has already read that code whole for its
     METHOD: `aschar.as` and `movementobject.cpp`, cited across the N2 sheet and the lessons sheet.
   - Taking it would mean lifting those systems, its AngelScript character script and its C++ engine side, into ours under Apache-2.0. Each
     file would be rewritten against Jolt and our 240 Hz tick. The sheet notes its springs "do not convert to 240 Hz by changing dt".
   - It keeps today's measured runners and the planted-foot rows as judges; it replaces the hand-built legs.
5. **What it would not give him:**
   - its animations (the key poses are its data, which is not open);
   - a recorded backwards walk;
   - anything measured: its numbers are a shipped game's, set by its makers.
   - The lessons sheet already lists which of its numbers the room took, and which proved wrong.

## 2. Holden's Motion-Matching, github.com/orangeduck/Motion-Matching

1. **The licence, opened** (`LICENSE`: MIT, "Copyright (c) 2021 Daniel Holden"):
   - **The code may go into a sold, closed game** with the copyright and permission notice kept.
   - **Its data may not:** the README says the database is built from LAFAN1 (ubisoft-laforge-animation-dataset), "licensed under Creative
     Commons Attribution-NonCommercial-NoDerivatives 4.0".
   - Its `resources/database.bin` (64.1 MB), `features.bin` and the trained networks are LAFAN1-derived, so none can ship in a sold game.
2. **Builds and runs here?**
   - The repository is about 133 MB.
   - The README: "This demo uses raylib and raygui so you will need to first install those". The Makefile assumes raylib's Windows install. raylib
     is not on this machine. **Installing it is his call.**
   - **The demo reads a gamepad only** (`controller.cpp:86-122`, `GetGamepadAxisMovement`; no keyboard path). Filming it driven needs a gamepad,
     or a small scripted-stick change made in the demo's own folder.
3. **Its demo filmed:** no. Not built, for the reason above.
4. **What taking it would mean:**
   - A whole controller: a motion-matching search (`database.h`), inertialization, foot locking and a simulated root. The lessons sheet
     already uses Holden's lock as a rule (the ball locked at the contact's edge, released past 0.2 m, half-life 0.1 s).
   - **A sold game would need its own recorded database:** 100STYLE or CMU (section 4), processed by its Python tools into the same form.
   - It replaces the gait plan and the legs with recorded motion. It keeps the planted-foot rows and the yardstick as judges, and the
     measured runners as a check.
   - It meets the simulation by reading our velocity as its desired velocity, in place of a gamepad's.
5. **What it would not give him:**
   - **No open recording reaches the hunter's speed** (`loop/animation_system_2026-11-13/scout_motion_matching.md:1-3`), so the hunter at
     9-13 m/s has no motion to match.
   - It gives no per-kind uncanniness, his 168, beyond what was recorded.
   - Recorded data cannot go wider than the recordings' bodies and their styles.

## 3. Esoterica, github.com/BobbyAnguelov/Esoterica (the licence and the three nodes only, as the section asks)

1. **The licence, opened** (`LICENSE.md`: MIT; "Copyright (c) 2022-2024 Bobby Anguelov", "2024-2026 Bobby Anguelov and Kirill Bazhenov"):
   - **Taking it into a sold, closed game is allowed,** with the notice kept.
   - GitHub reports the licence as "NOASSERTION" only because the file is `LICENSE.md`, not `LICENSE`.
2. **Builds and runs here?**
   - The repository is about 163 MB.
   - The README requires "Visual Studio 2026 (18.6.1+)" and an `External` dependencies archive from its releases. This machine has Visual
     Studio 2022. **Installing 2026 is his call.**
   - **It has no walking to show:** the README asks for "a technical animator to build out a locomotion and combat anim set". So even built,
     it has no backwards walk of its own.
3. **Its demo filmed:** no. There is no demo of locomotion in it.
4. **The three nodes, read at source** (`Code/Engine/Animation/Graph/Nodes/`, fetched into `G:\oss-eval\esoterica\nodes\`):
   - **FootIK** (`Animation_RuntimeGraphNode_FootIK.h:1-57`, `.cpp:111-185`): takes left and right foot targets from other graph nodes and
     runs a foot IK task, or a two-bone IK task per leg, under a blend weight that eases in and out. **It does not plan where a foot lands,
     or lock it;** the targets come from elsewhere.
   - **OrientationWarp** (`.h:22-23`): rotates a clip's root motion so that either the movement direction or the character's forward ends
     aligned to a desired orientation.
   - **TargetWarp** (`.h:34-36, :93-94`): warps a clip's root motion so the root arrives at a target transform, recalculating or offsetting it
     by warp events in the clip.
   - **Taking them** means an animation graph that plays and warps recorded or authored clips. Like Holden's, it needs a clip set we do not
     have.
5. **What it would not give him:** the clips themselves, and anything for a body with no clip, such as the hunter at speed.

## 4. Open motion data for a matching or blending base

| data | licence, opened | a sold game, private repository | what it has | its size |
|---|---|---|---|---|
| **100STYLE** (Ian Mason) | "Creative Commons Attribution 4.0 International", from the dataset's own page; Zenodo record 8127870 says cc-by-4.0 | **yes, with credit:** "For creative or commercial work please credit in an appropriate way" ("The 100STYLE Dataset - Ian Mason") | **forwards, backwards and sidestep walking and running, idling, transitions;** 100 styles; 60 fps; a 28-bone skeleton; BVH | `100STYLE.zip` **1,468.5 MB**; the labelled set 14,751.6 MB. **Not fetched** |
| **CMU** Graphics Lab | verbatim in the yardstick's `fetch_cmu.ps1`: "free for use in research projects. You may include this data in commercially-sold products, but you may not resell this data directly, even in converted form" | **yes,** not resold as data | running clips 2.7-4.15 m/s (already fetched once by the yardstick); walks; some backwards and turning clips | per clip, small |
| LAFAN1 (Holden's) | CC BY-NC-ND 4.0, as Holden's README says | **no** | the database his demo ships | in his repository |

- **What the data would NOT give him:** one performer (100STYLE) or a few (CMU); nothing at the hunter's speed; human bodies only.
- **100STYLE's backwards walks and runs are exactly the case of his item 244.** A clip of one, played on its own skeleton, is the cheapest
  "its own demo" of anything in this list. It needs the 1.47 GB fetch, and a BVH player.

## 5. What each would need before a clip of it can go on his page (all his calls; nothing done)

| candidate | to film it moving | his call |
|---|---|---|
| Overgrowth | buy Overgrowth (for its Data folder); clone 2.3 GB; build with the VS 2022 and CMake already here | the purchase; the 2.3 GB |
| Holden's | install raylib and raygui; build `controller.cpp`; a gamepad, or a scripted stick in the demo's own folder | the install |
| Esoterica | install Visual Studio 2026; it has no locomotion clips to show | the install; and it shows nothing of walking |
| 100STYLE | fetch 1.47 GB into its own folder; play one backwards-walk BVH with an open viewer | the download |

**What all four keep of today's work, whichever is chosen:** the judges. They are the planted-foot rows (20 mm, 5 mm), the measured runners'
spread (the yardstick), his turn test, the lessons sheet, and N2's page as the list of what the upper body must do (the plan's section of
15:54 holds that).

**What none of them gives:** **the hunter at its own speed.** No open recording reaches 9-13 m/s, so a matching base still needs the
procedural layer for the hunter, or a recording made for it.
