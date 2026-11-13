# Research: first-person hands, a flip jump in first person, and field of view tied to speed and to a chaser (2026-11-13)

Research only. Nothing built, run or committed. Written by a research scout, not the librarian seat.

## How to read the marks

- **[read: URL]** I opened the page or file and read it. Most web pages here came through a fetch tool that extracts with a small model, so a quote is only as good as that step. Two PDFs I converted to text myself and grepped (marked "own text").
- **[summary: URL]** a search snippet or secondary article only.
- **[inferred]** my reasoning, no source.
- **[room: path:line]** already on disk in the room; I did not redo it.

## What the room already answers (not repeated)

| question | where |
|---|---|
| Rust, Star Citizen, Catalyst and Mirror's Edge keep one full body for the camera; Catalyst: camera on the head, moves staged to read from that angle | `handback/p-l184-fpbody-research-B_2026-11-12.md:~35-48` (section "His six behaviours", item 2) |
| No developer text on a hand touching or sliding on a wall was found (Naughty Dog, Techland, true first-person games) | same file, item 5 and the table row "[not found]" |
| Hand hook exists, nothing calls it: `HandOverride`, `set_hand_overrides` (`game/body.h:93`, `:113`) | `loop/buildpath_player_body_2026-11-13.md:34` |
| Rig-only finger curl vs new joints (call 6); the room "should take the rig-only one" | `loop/buildpath_player_body_2026-11-13.md:65`, lap row `:77` |
| `kid.glb` already holds finger bones (index/middle/ring/pinky 01 to 03); the game skeleton has none | `loop/buildpath_player_body_2026-11-13.md:139` (second reader's check) |
| Overgrowth grip probe, ozz two-bone IK with `soften` | `p-l184...:~96-98` (L176 ground) |
| Current FOV: 100 deg horizontal, +5 deg at `sprint_speed`, ramp up to 1.5x, stops growing at 9 m/s; his item 27 "never fish-eyed" | `loop/buildpath_look_fear_2026-11-13.md` section 2 ("FOV: 100 deg ..."), `loop/buildpath_movement_2026-11-13.md:41`, `:84` |
| Chase `intensity()` exists, is hashed into the run, read it and never change it for looks | `loop/buildpath_look_fear_2026-11-13.md` section 2 ("A threat signal already exists") |
| Dive roll steered by view and somersault over a chaser, vault-like only over static geometry or a sim/chase coupling | `handback/p-l164-movement-E_2026-11-11.md:145-146,174`; `handback/p-l171-movement-tech-E_2026-11-12.md:144-145,176-177,183` ("the dive roll past a real turn should not ship before the layer") |
| Repo research lists FOV, motion blur, reticle as nausea levers; no published dynamic-FOV values were found | `loop/buildpath_look_fear_2026-11-13.md` section 3 ("Camera sickness"), `docs/research/03_movement_chase_research.md:49,97,100` (cited there) |
| Seizure and flash limits for fear effects (WCAG 2.3.1) | `loop/buildpath_look_fear_2026-11-13.md` section 3 |

Note on the room's own wording: the L184 note says no shipped first-person source exists for hands on walls. My search agrees (below). It was not a gap in effort.

## Part A. Hands

### A1. What shipped games say (developer sources)

| game | what I found | mark |
|---|---|---|
| Mirror's Edge (2008, DICE, GDC 2009) | Slides: head-parented camera "looked poor", an aim constraint "dull and boring"; key idea is to animate "the perception of a movement". Wall run has a "guided camera" and "impact animation" and the camera reacts to hitting the wall. Slide 28: first-person arm, hand and finger meshes aimed for "No volume loss" and visible "Muscle and tendons". No roll timing, no wall-hand method, no FOV numbers in the deck. Notes say the team worked on motion sickness and that early moves moved the camera "far more" than later ones. | [read: https://www.slideshare.net/slideshow/creating-first-person-movement-for-mirrors-edge-3151885/3151885] (extracted) |
| Mirror's Edge Catalyst | Camera on the actor's head; every move must read from that angle; limbs are staged so the player can see them. Nothing on roll camera or wall hands. | [read: https://www.ea.com/news/the-world-from-faiths-perspective] via the room's earlier read (`p-l184...`); the EA "Fluidity of Movement" page I opened says only "first-person", "momentum", "her own body is the projectile" [read: https://www.ea.com/amp/news/fluidity-of-movement-and-combat-in-first-person-gameplay] |
| Titanfall (the arm pose on a wall run) | Animator quote: players have "their gun in one hand and with the other they'll be caressing the wall"; a community manager: "they run their hands in the water". The view tilts away from the wall, and the tilt starts as the player jumps toward the wall, before the run, so they can anticipate it. Players jumped off too early because the run "looks like you're going to fall". This is the original Titanfall interview; I did not confirm it is the same in Titanfall 2. | [read: https://www.gamedeveloper.com/design/designer-interview-getting-i-titanfall-i-s-controls-just-right] (extracted) |
| Dying Light 1 | Deep dive: the camera was first locked during animations; releasing it ("so it no longer centers and locks") was a "really tangible" fix for sickness. Other levers they tried: camera movement, motion blur levels, reticle position, FOV tweaks, screen filters. External study was inconclusive. Hook-based climbing (50,000+ hooks) replaced by a real-time scan of geometry that also chooses the animation. Nothing on hands or finger rigs. | [read: https://www.gamedeveloper.com/design/game-design-deep-dive-i-dying-light-i-s-natural-movement-system] (extracted) |
| Dying Light 2 | Interview with Kulon: mocap studio for "the most complex moves"; body dimensions tuned to the city. Nothing on hands, IK or camera. | [read: https://www.gamedeveloper.com/programming/climbing-to-new-heights-with-dying-light-2-s-improved-parkour-system] (extracted) |
| Kulon, GDC 2018 "Parkour ... 20 Simple Steps" | The talk exists; I found no transcript or slide text. | [summary: https://gdcvault.com/play/1025208/contactUs]; video not watched |
| Ghostrunner | Team studied Titanfall 2 and Mirror's Edge as "manageable, not nauseating" fast first-person movement. No hand or camera detail found. | [summary: https://www.gamesradar.com/were-targeting-hardcore-players-ghostrunner-developer-one-more-level-on-the-inspiration-behind-its-cyberpunk-slasher] |
| Lone Echo (VR, Ready At Dawn, GDC 2017) | Hand poses are procedural: only the "gun grip" is authored; every other pose responds to the surface. Finger-joint optimisation is called a key challenge; no method given in the article. Elbows and shoulders come from IK. Talk slides not read. | [read: https://roadtovr.com/lone-echo-developer-shows-impressive-procedural-hand-posing-system-vr/] (extracted); talk [summary: https://www.gdcvault.com/play/1024240/contactUs] |

Not found at all: a developer source on how many finger joints a first-person game rigs; a developer source on hands that react to a wall (standing in front, a bump at a sprint, a drag along it). That is a finding.

### A2. Technique sources for placing a hand on a wall (not shipped-game talks)

- Raycast from each hand toward the wall, keep hit point and normal, use that as the IK target, blend the IK weight in over a few frames as you approach; keyframes carry the broad motion and IK the contact. [summary: https://mocaponline.com/blogs/mocap-news/climbing-animation-games-guide] (a vendor blog)
- Placing only the hand is not enough: wrist, lower arm, upper arm, shoulder and 1 to 3 spine bones need adjusting too. [summary: https://gamedev.net/forums/topic/659747-inverse-kinematics-help/] (forum)
- Two-bone IK with the effector at a scene point is the standard engine node. [summary: https://forums.unrealengine.com/t/character-limb-placed-against-environment/148815]
- Room already holds Overgrowth's per-hand swept probe (keeps the last grip when the probe finds nothing) and ozz `soften` near full reach (`p-l184...` L176 ground). [room]

### A3. Finger rigs and cheaper fists

- Community FPS arm rigs drive finger curl with a constraint or one control bone rather than posing each joint. [summary: https://lpc.opengameart.org/node/39272]
- A hand-rigging guide says metacarpal bones help a believable fist, and to orient finger joints so a single-axis rotation closes them. [summary: https://caveacademy.com/?p=91219]
- A typical full hand is 3 joints x 4 fingers + thumb (the room's own `kid.glb` has index/middle/ring/pinky 01 to 03 [room: buildpath_player_body:139]; thumb not listed there). [inferred] A "loose fist" needs one shared curl value, not 15 independent angles.

### A4. Options for (a)

| option | what it does | cost | needs | how it goes wrong |
|---|---|---|---|---|
| A-S. Rig-only curl | One scalar "grip" per hand drives all finger bones of the kid model in the renderer only; clench rises with speed, relaxes when slow; skeleton stays 21 joints | small; renderer and pose code, no sim change | the kid mesh's finger bones (exist per the room); a mapping from grip to the 3 curl angles per finger | fingers clip through the palm at full curl; thumb looks wrong if it follows the same curve (give it its own axis); hash and ragdoll untouched so low risk |
| A-M. Wall hand by probe, one hand | A short ray beside the body on the side nearest a wall; if a wall is within arm reach, set `HandOverride` with IK target at hit point, blend in over several ticks, blend out when gone (Overgrowth keep-last-grip) | medium; uses the hook that exists | a wall probe through `sim::World::raycast` (room says it is not in the fingerprint, `buildpath_player_body:84`); two-bone IK with soften | pops at 240 Hz ticks unless blends are smoothed; hand on corners flicks between faces; hand through a door jamb; the camera never sees it if the hand is below the view |
| A-L. Three wall states | Standing in front (both palms raised, tied to distance), a sprint bump (one hand slaps then slides off, a short authored pose plus a camera nudge), a drag (hand trails along the wall, finger curl relaxed, palm normal to wall) | larger; poses plus a small state machine | A-S and A-M first; a contact flag from the sim for the bump (so the sim, not the renderer, says a hit happened) | the three states fight each other at corners and in tight corridors; a bump hitch reads as lag if it is longer than a few frames; keep it presentation-only |
| A-XL. New finger joints in the skeleton | Fingers become real joints in `skeleton`, usable for ragdoll and the hunter | large; touches `skeleton`, `ragdoll`, the hunter, and any replay that hashes pose | agreement that the hunter is meant to share it | breaks existing tests and byte-identical replays unless kept out of the hash; the room already ruled the rig-only route is cheaper (`buildpath_player_body:65`) |

[inferred] A-S plus A-M cover most of what he asked; A-L adds the wall reactions the sources give no recipe for.

## Part B. A flip or somersault jump in first person

### B1. What the sources say

- **Camera roll in first person is the thing developers avoid or limit.** A Valor Mortis developer is reported as saying a rolling camera "couldn't" be included because the player "would go crazy if the whole world suddenly started spinning". [summary: search snippet attributed to a One More Level interview; I could not open the page that holds the quote, and the interview page I did open (https://insider-gaming.com/valor-mortis-interview/) does not contain it. Treat as unverified.]
- **A shipped option to hold the horizon.** Star Fox (Switch 2) has a Camera Rotation setting: off stops the cockpit camera tilting during barrel rolls and somersaults while the moves still work. [summary: https://www.itechguides.com/stop-the-spin-star-fox-motion-sickness-settings-that-help/] (a settings guide)
- **Do not move the view without the player's input.** Titanfall programmer Haggerty: "Any time we move the view without your input that can cause motion sickness"; view-bob with a fixed crosshair made "some players" nauseous. [read: gamedeveloper Titanfall interview above]
- **Anticipation helps.** Titanfall starts the wall-run tilt before the run begins so players can anticipate it. [read: same]
- **Control reduces sickness.** Shi et al. cite work that the degree of control lets a user anticipate motion and lowers conflict; their own study found no significant difference in SSQ between high and low control in their VR racing game, so it is not proven. [read, own text: arXiv 2103.05200, section near line 69 and discussion]
- **Release the camera in animations.** Dying Light removed camera locking during animations and found it a tangible sickness fix [read: Dying Light deep dive above]. That argues for the flip being a view effect over a mostly player-aimed camera, not a locked animation camera. [inferred]
- **Mirror's Edge Catalyst roll camera:** I did not find any developer source on it. A search snippet says the 2008 game's camera spins with the character in a roll. [summary: unverified, no URL I could open]. No numbers for duration or rotation rate found anywhere for first-person rolls or flips.
- **Rotation and sickness research (all VR, none about flat screens):**
  - Rotation about several axes is more sickening than about one. [summary: https://ntrs.nasa.gov/api/citations/20200000787/downloads/20200000787.pdf]
  - An AR study used 20, 30, 40 deg/s oscillating rotation; higher speed gave more visual-vestibular conflict. That was a lab condition, not a guideline. [summary: https://www.visionsciences.org/presentation/?id=3136]
  - Meta's older guidance: do not accelerate, rotate or decelerate the camera; smooth rotation is "highly vection-inducing"; snap turns are the alternative. [summary: Meta developer pages found by search; the comfort page I opened (https://developers.meta.com/horizon/design/comfort/) gives no numbers and does not state these lines. Read: it advises avoiding "sudden acceleration, rapid direction changes, and unnatural camera movements".]
  - Viewpoint snapping during turns reduced cybersickness in a VR shooter. [summary: https://www.csit.carleton.ca/~rteather/pdfs/GI_2018_viewpoint_snapping.pdf]
  - A fixed reference frame (a reticle, cockpit, "rest frame") is the common sickness aid; in the racing-game study the reticle rest frame caused no information loss while FOV reduction and depth-of-field blur did. [read, own text: arXiv 2103.05200]
- **Caveat that matters:** the VR work is about head-mounted displays where the real head does not match the virtual one. A flat monitor has no vestibular conflict from the screen's own rotation to the same degree. I found no controlled study on flips on a monitor. [inferred]

### B2. Arithmetic, so the numbers are visible [inferred]

A full forward turn is 360 degrees. At 0.8 s that is 450 deg/s; at 0.6 s it is 600 deg/s; at 0.5 s, 720 deg/s. A mouse turn of 180 degrees in 0.3 s is 600 deg/s, so such rates are normal for a player-driven flick, but here the player would not be driving them. The AR figures (20 to 40 deg/s) are an order of magnitude lower and are a different task. No source gives a safe limit for these speeds.

### B3. Options for (b), first ordering (written before the owner's request that the camera flip with the character; the order to use is in B4 and the closing sections)

| option | what the player sees | cost | needs | how it goes wrong |
|---|---|---|---|---|
| B-S. Horizon kept, body tells the flip | Camera pitch dips a little and recovers; legs and hands tuck; speed lines or FOV punch; no rotation | small; camera filter plus body pose | body pose for a tuck; the camera filter on the simulated head | reads as a hop, not a flip; the "simulated head" may still tilt by itself, so clamp it |
| B-M. Partial rotation | Pitch rotates part-way (for example down to look at the landing, then back) with an eased in and out; the full turn is only in the shadow and legs | medium | easing curve, a pitch cap, a way to guarantee the landing view is level | the cap feels arbitrary; the player sees the world reappear upside down if the cap is too high |
| B-L. Full rotation, short and telegraphed | The camera pitches 360 degrees over about 0.5 to 0.8 s, begins only after the player presses the move, in the same direction every time, with the horizon snapped level at the end | large; needs the camera physics, the landing check and a settings toggle | an option "keep horizon" (Star Fox's pattern); a clear windup (Titanfall's early tilt) | motion sickness; disorientation on landing; chasers lost out of sight during the spin; an automatic flip with no player input is the worst case per the Titanfall quote |
| B-XL. Full rotation with a fixed rest frame | As B-L plus a fixed element on screen (a reticle or a body silhouette) | largest | rest-frame art, tuning | a rest frame in a horror game can look like a UI element and cut the dread |

(Superseded as a lead by B4: the owner wants the full flip. B-S below is kept as the horizon-locked alternative.) [inferred]

### B4. Added on the owner's request: a FULL camera flip that reads well and chains into a slide

The owner wants the camera to flip with the character the whole way, for awe, and to run straight into a slide. Below: what sources say, what they do not say, then a spec to test. Honest summary first: **no source gives a duration, rotation rate or easing curve for a first-person flip. Every number in the spec is mine and is a starting point to measure, not a finding.**

**B4.1 What the sources add**

| point | source | mark |
|---|---|---|
| A true first-person camera attached to the head is driven by the body animation. For a fall-landing montage the author disables input and resets the camera rotation in code during it, then blends the aim back at a constant rate so the head "fades" back "to not make the player sick". It warns "head bobbing, quick turns and other kind of fast animations can make people sick", and that a one-frame lag from update order can cause "strong discomfort". Looping animations get the head constrained to look at a distant point. | Game Developer, true first person camera in Unreal Engine 4 | [read: https://www.gamedeveloper.com/programming/true-first-person-camera-in-unreal-engine-4] (extracted) |
| A developer of an indie first-person game says you can flip in first person but they "deliberately stabilized the camera, like FEAR, for motion sickness players", with a toggle planned. This shows the full-versus-stabilised split exists as a toggle in practice. "Like FEAR" is not checked. | itch.io post by the developer | [read: https://itch.io/post/13302866] (extracted) |
| A forum answer: a flip can be "very dizzying and/or disorienting" and should be handled "very delicately". | Unity answers | [summary: https://answers.unity.com/questions/13733/how-can-i-make-my-first-person-player-flipsomersau.html] |
| Mirror's Edge (2008): moves were iterated 5 to 6 times; early moves moved the camera "far more" than the later ones; the team worked on motion sickness. The shipped direction was less camera motion, not more. | DICE GDC 2009 slides | [read: https://www.slideshare.net/slideshow/creating-first-person-movement-for-mirrors-edge-3151885/3151885] (extracted) |
| Dying Light: releasing the camera so it does not lock or re-centre during animations gave a tangible sickness improvement. This argues for the flip being an addition on top of where the player aims, not a replacement of it. | Game Developer deep dive | [read: URL in A1] |
| Titanfall: anticipation (the tilt starts before the run) and never moving the view without input. A flip the player starts, with a visible windup, fits the first; it breaks the second only during the flip. | Game Developer interview | [read: URL in A1] |
| Chaining animations: blending into the next stance mid-roll is noticeable when the poses are too different; landing roll variants blended by fall speed; inertialization captures current velocity and eases toward the target pose. Developers also report players press the next move too early, so input timing was tuned. These are forum posts and a vendor guide. | mocaponline; Unreal forum; MCV | [summary: https://mocaponline.com/blogs/mocap-news/parkour-animation-games-guide ; https://forums.unrealengine.com/t/first-person-parkour-system-with-animations/70591 ; https://www.mcvuk.com/development-news/the-vaulting-dead-implementing-first-person-parkour-in-dying-light/] |
| Sickness research, all about headsets or lab rigs: rotation about several axes is worse than about one [summary: https://ntrs.nasa.gov/api/citations/20200000787/downloads/20200000787.pdf]. Vection (felt self-motion from vision) takes about 1 to 10 s to build after a display starts moving [summary: search result summarising a vection review; paper not opened, URL not available to me]. In an old rotating-drum study onset got faster from 10 to 40 deg/s and stayed similar up to 200 deg/s [summary, same source]. A control and prediction effect: knowing what is coming lowers conflict, though the one racing-game study I read found no significant sickness difference between high and low control [read, own text: arXiv 2103.05200]. A fixed rest frame such as a reticle did not cost information in that study [read, own text: same]. No study I found covers a single brief full pitch turn on a flat screen. | | as marked |

**B4.2 What the sources do not give**

- No duration, rate or easing for a first-person flip or roll in any shipped game I could find.
- No source on what to keep fixed on screen for a flat-screen flip beyond the general rest-frame idea.
- No source on how a shipped game joins a flip to a slide. The nearest is the general advice to blend and to buffer input.
- Nothing on how long a full pitch may last before sickness on a monitor. [inferred] The vection-onset figure (1 to 10 s) suggests a turn under one second ends before vection fully builds, but that figure is for steady scene motion and nobody tested it on a flip. Treat as a hypothesis to test, not a result.

**B4.3 A spec to test (all numbers are mine) [inferred]**

- **Pure pitch.** Rotate about one axis only (forward flip is pitch). No added roll or yaw during the turn. (The multiple-axes finding.)
- **Rotation is additive to aim.** The flip adds a pitch offset on top of the player's aim and returns to exactly zero offset at the end, so aim input is never locked (Dying Light's lesson) and the room's row "aim yaw and pitch equal input every tick" still holds (`loop/buildpath_player_body_2026-11-13.md:88`, citing the L186 hand-back). Yaw stays the player's.
- **Duration.** Try 0.6, 0.8 and 1.0 s; pick by his eye and the capture rows below. Arithmetic: 360 degrees in 0.8 s is a mean 450 deg/s; with an ease-in/ease-out (smoothstep) the peak is 1.5 times the mean, so about 675 deg/s at 0.8 s and 900 deg/s at 0.6 s. A constant-rate turn has an infinite angular acceleration at its start and end; the easing is what removes that. No source says which is comfortable.
- **Use the time unevenly.** [inferred] Spend the slow, awe part where the view is upside down or looking at the ceiling or sky (that is where the picture is new), and finish the last 25 to 30 percent decelerating so the horizon is back, level and still before the feet land. That way the first frame of the slide is a readable one and the next move starts from a stable view.
- **A windup and a landing.** A short dip or crouch before takeoff (Titanfall's anticipation lesson) and a landing that settles the camera in a few frames (the UE4 article's constant-rate blend back).
- **What stays fixed on screen.** The hands and arms are on the head's camera, so they are the natural fixed thing: keep them in the same screen position through the turn, tucked, rather than letting them swing around the view. [inferred] Optional: a faint fixed element, but a horror look may not want a visible reticle.
- **Latency.** The camera must be computed from the head in the same tick as the body, with no one-frame lag (UE4 article). The room's note that the camera is filtered from the simulated head applies. [room: buildpath_player_body:31,51]
- **Chain into a slide.** Start the slide's pose blend before touchdown so the body is already low when the feet land; the room already measured a 2-frame wrist hitch at the run-to-slide blend and a leading leg that is not in view during a slide (`buildpath_player_body:48,78`); both should be fixed or accepted first. The sim side: dive-to-roll at 5 m/s or more keeps 80 percent of speed (`handback/p-l171-movement-tech-E_2026-11-12.md:197`); how a flip hands its speed to the slide is a sim question I did not study. Buffer the slide press during the last part of the flip, as developers did for early presses (MCV, summary).
- **Always a toggle.** Full flip on, or the horizon-locked alternative (B-S). Both of the sources that shipped this (the itch developer; Star Fox's Camera Rotation setting [summary: https://www.itechguides.com/stop-the-spin-star-fox-motion-sickness-settings-that-help/]) did so.

**B4.4 Rows I would register before building** [inferred]

1. Peak rotation rate and peak rotation acceleration of the camera through a flip, from the per-tick camera log at 240 Hz; each below a bar set after his first look (the bar is his, no source gives one).
2. The camera's pitch offset is exactly zero within a tolerance by the touchdown tick, and the horizon is within a few degrees of level at least a set number of ticks before touchdown.
3. Aim yaw and pitch equal the player's input every tick, flip or not.
4. No tick-to-tick jump in camera rotation above a bar in the blend from flip to slide (the same kind of row as the room's wrist-step row, `buildpath_player_body:82`).
5. Hands' screen position does not change by more than a set amount during the turn.
6. With the toggle off the camera pitch offset is zero throughout.

**B4.5 Options for (b), in the order to use now**

| option | what the player sees | cost | needs | how it goes wrong |
|---|---|---|---|---|
| B-1. Full flip, pitch only, additive, easing, chained to slide | The spec above | large: a camera offset layer, a flip pose, the pose blend into the slide, the toggle, the rows | the spec; a slide blend fixed first; the camera computed in the same tick as the body | sickness for some players (no source rules it out); upside-down moment hides a chaser; hitch at the slide join; awe lost if too fast to read |
| B-2. B-1 with a lighter fixed reference | As B-1, plus the hands held fixed and a very faint fixed element, or a brief vignette at the middle of the turn | larger | art for the element; frame cost | a vignette is a FOV restrictor and loses information (racing study); a fixed element reads as UI in a horror look |
| B-3. Partial rotation | Rotation to a cap (say about 180 degrees down and back, not a loop) so the world is never fully upside down | medium | a cap; a pose that reads as a flip from the body alone | feels half-done; the owner asked for the whole flip |
| B-4. Horizon-locked alternative (not the lead) | Camera dips a little and stays level; legs and hands tuck; a FOV punch | small | pose only | trade-off: far safer and cheaper, but loses the awe he asked for; reads as a hop |

If the build stays with B-1, B-4 is the fallback that the toggle gives players for free.

## Part C. Field of view

### C1. Speed and field of view

- A racing-game study (2017, in a book chapter) reports that a larger geometric field of view raised perceived speed, strong motion blur lowered it, and a higher camera at high speed raised it. I got this only from a search summary; the page was blocked. [summary: https://eudl.eu/pdf/10.1007/978-3-319-55834-9_14]
- Driving-simulator studies conflict: one reported better speed perception with changes in geometric FOV, another a thesis found perceived speed fell with larger geometric FOV and no tested value gave accurate speed. Part of the reason may be how the camera is moved to change FOV. [summary: https://pureportal.coventry.ac.uk/en/publications/geometric-field-of-view-manipulations-affect-perceived-speed-in-d/]
- Echo Point Nova's designer: for grapple and hoverboard, "FOV distortion I think really helps sell the sense of speed. The faster the player is moving, the wider their FOV is." No numbers. Camera flourishes can be turned off. [read: https://gamedeveloper.com/design/deep-dive-the-movement-of-echo-point-nova] (extracted)
- Mass Effect's Citadel run: claimed to change only the FOV to look faster. [summary: https://pcgamer.com/games/rpg/vile-treachery-when-you-ran-on-the-citadel-in-mass-effect-it-just-changed-the-fov-to-make-it-look-like-you-were-going-faster] (secondhand, not a primary source)
- Example values from non-primary sources: a Roblox forum example ranges 70 to 115 degrees with speed; one narrow-FOV horror game sits in the 60s against about 80 for a typical shooter. [summary: https://devforum.roblox.com/t/feedback-on-camera-bobbing-and-sprinting-system/2744607; the Lethal Company claim came from a search summary with no URL I could open]
- Sickness side: Dying Light's team listed FOV among levers they tuned for sickness; no values. [read: Dying Light deep dive]. A player report says a large FOV zoom effect made one person nauseous. [summary: https://feedback.minecraft.net/hc/en-us/community/posts/17765198730765-Turn-FOV-altered-by-gameplay-into-a-slider]
- Ours today: 100 deg horizontal, +5 at `sprint_speed`, growth stops at 9 m/s, and it is keyed to `sprint_speed` not the 8.75 peak [room: buildpath_look_fear section 2, buildpath_movement:41]. Peak-keying is an open call of his (`buildpath_look_fear` section 4c). No source I found gives a number for how far to go. [inferred] Our +5 degrees is far below the 70 to 115 forum example and is not backed by a primary source either way.

### C2. How fast a FOV may change, and the sickness literature

- Fernandes and Feiner (2016, IEEE 3DUI, pp. 201-210): a soft-edged mask that narrows the view during motion; size is a function of speed and angular velocity; 30 participants (the news piece says 32 recruited); results: lower discomfort, no loss of presence; in the more subtle condition most did not notice it (15 of 30 chose "1", imperceptible, when asked; 11 of 15 rated the FOV change as a 1). I could not obtain the angular velocity thresholds or FOV range; the paper itself was not opened. [read: https://spectrum.ieee.org/dynamic-field-of-view-restriction-makes-virtual-reality-less-barfy] (extracted); [summary: https://www.sciencedaily.com/releases/2016/06/160614121922.htm]. A later paper says the original used "a more conservative" restrictor "designed to be imperceptible". [read, own text: Wu et al., par.nsf.gov/servlets/purl/10343217]
- A later restrictor study set outer radius 0.60, inner radius 0.1 (screen-space) and a 0.25 s ramp in or out; it kept the ground visible and found better comfort, posture and presence than the symmetric mask. SSQ scores were so low that they warned of a floor effect. [read, own text: https://par.nsf.gov/servlets/purl/10343217, lines 53 and 192]. That is the only transition time I found for a FOV effect. It is for a restriction, not a widening.
- Racing game, VR, 32 people: FOV reduction, depth-of-field blur and a reticle rest frame did not differ significantly in sickness, presence or workload; FOV reduction and blur lost information (missed targets); the reticle did not. [read, own text: arXiv 2103.05200]
- Overall: the evidence concerns narrowing the view while moving, in a headset. For a widening on a monitor I found no study. Widening is the opposite direction from the restrictors, so those studies do not transfer directly. [inferred]

### C3. The panic zoom-out: dolly zoom and threat distance

- The dolly zoom keeps the subject the same size while the background stretches or compresses; it is read as vertigo, unreality, or a sudden realization. It needs both a camera move and a lens change. [read: https://en.wikipedia.org/wiki/Dolly_zoom] (extracted)
- No game developer source tying FOV to a threat's distance. I searched for it; the only game use found was a GTA IV cutscene (summary only, https://tropedia.fandom.com/wiki/Vertigo_Effect). So the panic idea has no shipped precedent that I can cite. That is a finding.
- A narrow FOV is described as a deliberate scare tool in Lethal Company (tunnel vision; a news article, not a developer interview). So there is a source for narrow-equals-tense, and the idea here is the opposite direction. [summary]
- [inferred] Widening FOV alone pushes the chaser smaller in the picture and stretches the edges; a true dolly effect also needs the camera to move toward or away. Because our FOV change is a lens change only, it will read as a "speed" signal, not as a dread signal, unless the chaser is kept the same size (by moving the eye back a little) or the edges are bent.
- Warning from the room: FOV is a presentation effect; the director signal `intensity()` is hashed into the run so it may be read but never changed (`buildpath_look_fear` section 2).

### C4. Options for (c)

| option | what it does | cost | needs | how it goes wrong |
|---|---|---|---|---|
| C-S. Key the speed widening to the 8.75 peak | The existing curve keeps rising to the peak instead of stopping at 9 m/s of the `sprint_speed` scale | tiny; a change in `game/camera.cpp:149-152` | his call (`buildpath_look_fear` 4c) | every run feels faster; the slow climb 7 to 8.75 was never visible before |
| C-M. Add a proximity term | Extra widening as the nearest chaser's distance falls under a threshold; smoothed over a time (the only comparable number I found is 0.25 s for the restrictor ramp), with a hard cap (his "never fish-eyed", item 27) | medium; a presentation module that reads distance and writes only to the camera | the distance from the chase module; a cap; a slew limit so it never jumps | a sudden widening at a chaser's lunge can itself be a view change without input (Titanfall's sickness quote); it fights the speed widening, so the sum must be capped; at a close range the chaser changes distance fast, so the FOV would jitter unless filtered |
| C-L. Panic as a dolly zoom | As the chaser closes, widen the FOV and pull the eye slightly back so the chaser stays about the same size and the room stretches behind | large; needs a camera offset that is separate from the simulated head and body | a clean eye offset; no clipping of the body; the second-reader row on `camera_effects` 0 equal to today's eye | the eye pulls into the player's own body or the wall behind; vertigo may look like a bug; no precedent in shipped games |
| C-XL. Combine with a peripheral cue | Widen plus a soft vignette or chroma shift from the dream layer | large; touches the render look layer | the director/dream plan | seizure and flash limits (the room's WCAG note); added effects cost frame time (budget 2.78 ms) |

Whatever is chosen, keep an option to turn it off (Echo Point Nova and Star Fox both do). [inferred]

## What this means for our build

Each option comes from the tables above; cost and need are as stated there.

**(a) Hands**
1. Do A-S first (one curl scalar, rig-only, the kid's finger bones already exist). Cheapest, no sim change, no source needed beyond the rig practice.
2. Then A-M (one wall probe, one hand, `HandOverride`). The room already registered rows for it (`p-l184...`, "Rows to register red", item 3).
3. A-L only after both look right on his eye. The three wall reactions have no developer source to copy; they are ours.
4. A-XL (new joints) only if the hunter also needs fingers.
- Test on his recorded runs through `dz-world --capture-fpburst` (room instrument, `p-l184...`).

**(b) Flip** (updated for the owner's wish: full camera flip, chained into a slide; see B4)
1. B-1: full pitch-only flip, added on top of the player's aim (never locking it), eased, 0.6 to 1.0 s to be tuned by eye, last quarter spent returning the horizon level, hands held fixed on screen, slide blend begun before touchdown, slide press buffered. Rows in B4.4. Every number is mine; no source gives one.
2. A toggle to the horizon-locked alternative (B-4) from the start; both shipped examples I found had one.
3. Fix the existing slide-blend hitch and the missing leading leg first, since the flip ends in a slide.
4. Player-initiated, with a windup; never automatic.
5. B-2 and B-3 only if B-1 tests badly.

**(c) Field of view**
1. C-S first: it only moves an existing curve, and his own item 27 asks for "enough to feel speed".
2. C-M next, capped and slew-limited, reading the chaser distance without touching the hashed signal.
3. C-L only as an experiment; no precedent and a large risk.

## Where the sources disagree with the idea

- **Flips (the owner wants the full turn):** the sources lean against leaving the camera to the animation: Mirror's Edge moved the camera less over its iterations, Dying Light freed the camera from animation, Titanfall's programmer warns about view motion without input. The two shipped full-flip examples I found had a stabilise toggle, and the first-person Unreal article resets camera rotation during its montage. None gives a duration or rate. B4 is built to keep aim input free and to add a toggle for that reason. Older note: the only developer remarks I found run against full rotation in first person (a Valor Mortis developer, unverified; Titanfall's "view moved without your input"). Star Fox shipped a switch to hold the horizon. Nothing shows a shipped first-person game with a full-turn flip and a number for it. The idea as stated (camera through the full turn) goes beyond what these sources support.
- **Hands on walls:** no shipped-game text exists for the reactions he describes; Titanfall's "caressing the wall" is the closest and is for a wall run, not standing, bumping or dragging. Not a disagreement, an absence.
- **Panic zoom-out:** the sickness research is about narrowing while moving. The dolly-zoom is a film effect, not tied to threat distance in any game I found. And widening a lens alone does not make the effect described in film.
- **FOV and speed:** the evidence is mixed (a racing study says wider FOV raises perceived speed; a simulator thesis found the opposite). It depends on how the camera is moved when FOV changes.
- **Rest frames:** the racing study found a rest frame did not lose information, but a fixed screen element may cut against a horror look. [inferred]

## Not read

- Fernandes and Feiner 2016 itself (thresholds, FOV range): not opened. Only news pieces and citing papers.
- The 2017 racing-game FOV and perceived-speed chapter: blocked (403 and a login); search summary only.
- Dahl and Åberg slides were read only through an extracting fetch; the roll slides gave no numbers. GDC video of Kulon 2018, Lone Echo's talk, Mirror's Edge Catalyst talks (the visual-style and lighting ones do not cover animation): not read.
- Titanfall 2 specifically (my source is the original Titanfall interview).
- Added in B4: the vection-onset (1 to 10 s) and 10 to 200 deg/s drum figures are from a search summary only; the NASA, VRSpinning (opened as text: it is a motion-platform paper, not on point) and Carleton papers were not read for flips. Whether "FEAR" really stabilises its camera in a flip: not checked. The UE4 article's blend rate "300" has no unit stated.
- The Valor Mortis "rolling camera" quote: seen in a snippet, page not found.
- The Meta comfort pages with rotation guidance (the one I opened gave no numbers); NASA, visionsciences, Carleton papers: snippets only.
- Any source on finger-joint counts in shipped first-person games; any source on hand reactions to walls beyond Titanfall's wall-run remark.
- All pages read through a small extracting model: quotes should be spot-checked before anyone quotes them outward.
