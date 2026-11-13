# Ground reader: his words on animation, bodies and entities (2026-11-13)

1. I read the whole brief, all 1611 lines: items 1 to 217 plus the dated state notes. About 110 items and decision-page
   picks bear on how something moves or looks when it moves. Each is below with its line, date and his words verbatim.
2. Standing: build from the sources (153, 165), his eye decides the look (180, 214, 217). Every entity is humanoid
   with its own uncanny cue (168). The hunter's one cue is greyhound cornering (169). Kinetic linking for all (156).
3. Rejected: the home-made lean (153), lock-on straight-line pursuit (88, 129), short churning strides (163), arms
   held in close (177), the up-down stomp (195), a footfall that sounds like a drum (190), and "too human" (214).
4. Not built: hands on walls (27, 159), the stalking hyena gait and the rise to upright (207, 208), the catch's
   ragdoll and drag (entity_bodies-3), the somersault with a flipping camera (movement-5, -11), the lesser kinds' bodies.
5. Conflicts shown at the end: the player's sprint speeds, the hunter's knowledge of you, the out-of-body camera,
   how rare wall runs are, how chasers turn, model detail, the trunk's share of the bank, and research against his eye.

## How to read this file

- `brief` means `C:/Users/nname/Desktop/lighthouse/exo_memory/briefs/dreamzone2_the_game.md`. `brief:N` is its line N.
  The brief was read on disk on 2026-11-13. It is uncommitted state as read, not tied to a commit. [read]
- The brief is the room's record of his words. Text inside quotation marks is copied from the brief as the brief gives
  it, typos included; `[…]` marks a cut I made. The brief's own notes ("Read as", "So", "Ruled") are the room's
  readings, not his words, and are labelled "brief's note" where I use them. [read]
- Some items are picks the room recorded without his verbatim words (155, 162, 169, 173, 176, 186). For those I quote
  the brief's record and say so. [read]
- Item 183 is his decision page. Each pick is cited by its call id (for example `entity_bodies-3`). Its times are UTC
  ("Z"), as the brief gives them. [read]
- "Decides" is my sorting of each item into pick, rejection, open wish or method. That sorting is mine. [inferred]
- Dates: items 1-9 are 2026-11-10. Items 10-126 are 2026-11-11. Items 127-176 are 2026-11-12 (127 carries the date,
  and the later items carry times only). Items 177-217 are 2026-11-13. [read] brief:6, :66, :1015, :1189

## The items, in order

**1** · 2026-11-10 · brief:8-11 · chase basis
> "running away from an exceedingly fast entity but can still be out maneuvered through skill and finesse with
> strategic movemeth through the environemnt" [read]
Decides: pick. The chaser is faster than you, and movement skill beats it. [inferred]

**3** · 2026-11-10 · brief:15-16 · entity kinds
> "then right away something is there to chase you, maybe even multiple entities with different chase architypes,
> agro levels, etc." [read]
Decides: pick. Several entities, of different archetypes. [inferred]

**7** · 2026-11-10 17:27 · brief:33-37 · player movement, climbing
> "You can sprint, it should be normal movement, you can walk, you can sprint, you can slide, you can dive, you can
> climb, you can do pretty much all movement from mirrors edge parkour, but the main aspect will be traversing areas
> on foot rather than parkour being a main element, it will be more of a way to evade in the rare circumstance, say
> there is a dead end but you can jump up in this one area and the entity has to route around." [read]
Decides: pick. The movement set; on foot first, parkour as the rare escape. [inferred]

**12** · 2026-11-11 00:37 · brief:71-72 · player feel
> "the gym course is interesting, i know the movement is very early stage, but it needs to feel more fluid with the
> animations, maybe even higher top speed slightly." [read]
Decides: open wish. More fluid movement animation. [inferred]

**13** · 2026-11-11 00:40 · brief:73-78 · player body, camera, sprint ramp
> "it should be like, the runner has a good burst of speed sprinting off the bat, but to achieve max sprint speed it
> ramps up and takes a little while just like a real sprinter, as well, id like to start this early, creating
> realistic animation and locomotion for the player character, can see arms and legs from a first person perspective
> and match the movements of the characters actions in game, it is expensive but worth it, then we sort of attach the
> camera to the player in a way to make it work" [read]
Decides: pick. A full first-person body that matches the actions, and the camera attached to it. [inferred]

**14** · 2026-11-11 00:42 · brief:79-82 · wall running
> "also the wall running should be minimal […] But the wall running should be rare and short, like a way across a floor
> that kills u" [read]
Decides: pick. Wall running is rare and short. (See the conflicts, with 137 and movement-13.) [inferred]

**15** · 2026-11-11 01:02 · brief:83 · player animation
> "when will the running feel/animation rework start" [read]
Decides: open wish. [inferred]

**16** · 2026-11-11 01:04 · brief:84-87 · entities, footsteps, catch
> "same with the animations for the entities, we did decent work for the entity on the older build, but you might be
> able to do it better now, as well the sound effects can be so much better, I want the main entities footsteps to be
> bassy and loud like thundering almost, eventually when we get to it, we need to make a brutal jumpscare lmfao, but not
> during testing will get old" [read]
Decides: open wish. Entity animation beyond the first game; the main entity's footsteps loud and bassy; a jumpscare
later. [inferred]

**17** · 2026-11-11 01:05 · brief:89-92 · entity traversal
> "they should traverse the world without clipping on anything, but also not be super OP, they should be OP but not
> like speed hacking" [read]
Decides: pick. No clipping; strong but not speed-hacking. [inferred]

**18** · 2026-11-11 02:03 · brief:97-102 · entity momentum and turning
> "when a runner gets cornered, the entities must also have momentum and inertia and cannot directly turn on a dime,
> letting you in a way juke the entities, perhaps the interceptor is more nimble, we can flesh out more the archetypes
> of each entity later. […] I liked the one idea where, the longer you run in a straight line, the entites slowly scale
> in top speed, making you have to turn, the entities then scrub speed turning." [read]
Decides: pick. Entities carry momentum and inertia and lose speed when they turn; the interceptor is more nimble.
[inferred]

**21** · 2026-11-11 02:18 · brief:112-115 · player sprint profile
> "the runners sprint should accelerate to a base amount decently quick like a real runner, and then slowly continues
> to pick up a bit of speed as they accelerate, similar to OG dreamzonert, from testing, perhaps it goes to 5ms fast,
> then eases into their top speed to around 10ms" [read]
Decides: pick, later revised. The two-stage sprint. (See the conflicts on speeds.) [inferred]

**26** · 2026-11-11 03:22 · brief:172-179, :191-192 · good entity, the field, catch, out-of-body
> "all the sound that occurs in the game, character heavy breathing from endless sprinting, the sounds of entities and
> the bending contorting horror of the field itself, it all quiets down when a good entity is near by, and it shines
> this resonant golden aura around the hallways, like an angel" [read]
> "when the player gets caught, i have this imagry of a brutally scary jumpscare of some sort, and the players camera
> and soul gets sucked into this rapturing portal leading back to the player awakening in their bed in the real world"
> [read]
> "Also, there shouldnt be out of body experiences in the dreamzone since you are already technically out of your
> body." [read]
Decides: open wish. A good entity like an angel with a golden aura, and a catch that pulls the camera into a portal.
Rejection: out-of-body experiences inside the dream. [inferred]

**27** · 2026-11-11 03:30 · brief:194-201 · camera FOV, look-behind, hands on walls
> "the fov could be dynamic in a way, the closer something gets to you, the fov slowly heightens, also the faster you
> run and go, it should never get too fish eyey, but enough to feel speed, as well we need to add the function back to
> look behind while running, that was good. Also just spit balling, once the player body and animations are ready to
> start, i want procedural animations when touching walls or objects like the user puts their hands on the wall, or
> like running against it diagonally you can feel the wall through the animation, in an FPS, what comes to my mind is
> when a player walks close to a wall, and the animation is aware to not clip the gun into the wall, like that but with
> the players body. And the animations are procedural relative to the environment" [read]
Decides: pick: FOV that widens with proximity and speed, never fish-eyed; the look-behind back. Open wish: procedural
hands on walls and objects, aware of the environment. [inferred]

**28** · 2026-11-11 03:46 · brief:211-212, :225-230 · frenzy, the malevolent god, the save
> "being closely purseued makes insanity meter go up, which then adds another layer to the AI entities aggression, they
> fixate on fear and instability" [read]
> "except its the malevolent god entity chasing you down, you cannot escape it, its like lighting fast next bot, it is
> cheating and it is there to devour you, even safe zones dont save you, just reroute it, since you cannot escape, what
> happens is when you get caught, the good god entity saves you last second, ripping the player out of the
> metaphorical jaws of the most powerful and horrifying manifestation of malice" [read]
Decides: pick. An end-of-run entity that is lightning fast and "cheating"; a last-second save. (See the conflicts, with
run_frame-4.) [inferred]

**29** · 2026-11-11 03:50 · brief:237-239 · player ability movement
> "something crazy like dream flight flying through the hallways like invincible or homelander, maybe no clipping but
> that might be too op" [read]
Decides: open wish. [inferred]

**30** · 2026-11-11 03:55 · brief:243-245 · catch
> "I guess the regular entities catch you you lose it all, when you die, it indirectly shows the player, that it was
> always the evil god entity chasing you but playing with its food, then it consumes a part of you" [read]
Decides: pick. The catch shows, indirectly, that it was the evil god playing with its food. [inferred]

**31** · 2026-11-11 04:05 · brief:258-260 · an invading figure in the waking room
> "if you look outside the window, sometimes there will be a figure that isnt usually there, if the player doesnt see
> it it slowly finds its way into the room, if its behind the player it will eventually grab them and jump scare the
> fuck outta them, but if they turn around or see them first it engages it there" [read]
Decides: open wish. A figure that approaches unseen and grabs from behind. [inferred]

**34** · 2026-11-11 04:25 · brief:330-333 · good entities freeze others; waking animation
> "the good entities can sometimes spawn in directly coming to you, freezing the entities in the world to show you the
> screen to press accept trinket. […] there is a waking up animation of the player in bed, first person, taking the
> covers off and realizing they have the trinket in their hand IRL." [read]
Decides: open wish. A first-person waking-up animation, and good entities that freeze the others. [inferred]

**37, 38, 39** · 2026-11-11 04:5x to 04:53 · brief:345-350 · entities reacting to the flashlight
> 37: "when shined upon entities, it slows them down or repels them for a short time" [read]
> 38: "but it frenzies all other entities that it isnt being pointed at" [read]
> 39: "the whole point is to stop the interceptor or future archetypes that spawn infront of you, it repels them creating
> a path ahead while they swarm and frenzy behind" [read]
Decides: open wish. Entities flee the beam and swarm behind. [inferred]

**41** · 2026-11-11 05:01 · brief:360-362 · agility, climbing, juking
> "then agility, it allows you to climb faster, and more nimble on your feet fighting inertia and momentum to juke
> entities" [read]
Decides: pick. The player has inertia, and agility fights it and speeds climbing. [inferred]

**49** · 2026-11-11 05:55 · brief:409-416 · chair camera: third person, out of the body and back
> "it goes to third person after you sit in the chair, and the rest of the room dissolves away, showing the ground where
> the beanbag chair is and the player […] the camera first rises out of the body, and moves upward as the room dissolves
> showing the cosmic void, when tweaking loadout is done, the camera lowers back, showing the body of the player and
> fades back into their head as the room comes back." [read]
Decides: open wish. The player body seen in third person, with the camera leaving and re-entering the head. (See the
conflicts, with look_fear-1.) [inferred]

**57** · 2026-11-11 06:39 · brief:450-458 · roll, somersault, parkour, Source-style movement
> "there could be an ability that gives you a super slide effect, or a dive into a roll that moves with the head to
> have this fun finessable movement, say like diving over top of the shorter enemies like summersault type shit. I think
> we need to do more research into parkour running type games like mirrors edge, or other types of games where you run
> from something, the best example is GMOD nexbot and there was this parkour swepe mod that worked decent for movement"
> [read]
> "This means we have to allow for it with the movement system, sort of mimicking the ancient movement system of games
> of old source engine type shit" [read]
Decides: open wish. A dive roll "that moves with the head", and a somersault over short enemies. Method: research the
parkour and chase games. [inferred]

**58** · 2026-11-11 06:45 · brief:469-471 · what entities know
> "a spell that temporarily makes the entities lose your location, it is different than the aura, the aura they still
> know where you are, but cannot touch you" [read]
Decides: open wish. Under the shroud, entities lose you; under the aura, they know where you are but cannot touch you.
[inferred]

**63** · 2026-11-11 07:30 · brief:507-508 · the player model moving through the lighting
> "sometimes it is too grainy or there are shimmering after images from the player model cutting through it in a funky
> way" [read]
Decides: rejection. Trails behind the moving player model. [inferred]

**65** · 2026-11-11 07:39 · brief:519-520 · the hunter knows
> "but no stealth isnt a thing, the main hunter always knows where you are, and if you stop running it will catch you"
> [read]
Decides: pick. The hunter is omniscient and always coming. (See the conflicts, with chase_entities-3 and 205.)
[inferred]

**73** · 2026-11-11 10:05 · brief:614-615 · animation quality
> "it just needs more refined animations and quality of style, idk where to even start" [read]
Decides: open wish. [inferred]

**79** · 2026-11-11 10:23 · brief:652-654 · faces, camera turned round
> "i almost want there to be a face for each character, something detailed and distinct for the art style, nothing
> crazy since it wont focus on the playable characters face often or barely at all beyond maybe the character pick
> screen, rare instances of where the camera might flip around idk" [read]
Decides: open wish. [inferred]

**81** · 2026-11-11 10:54 · brief:667-669 · sprint speed, chasers matched
> "I almost want the top speed of sprint to be a little faster, peraps tapering off at 10ms when holding it down for
> longer and taking good lines, then upgrading it from there makes you a speed demon, but we have to make sure that we
> also slightly make all mobs quicker too to compensate" [read]
Decides: pick, later revised. (See the conflicts on speeds.) [inferred]

**82** · 2026-11-11 11:06 · brief:677-680 · models, animation, camera on the face
> "continue to refine the player model and entities we have from their design/textures, and animations, remember, the
> design for the kid will be their persona and identity as well, so lets make it good, doesnt matter to me how he looks,
> and also remember, the camera the player sees through is attached to the face of the real model that is animated like
> how we have right? Make the models as detailed as you can go. And then we can do multiple passes if we have to." [read]
Decides: pick. The camera is attached to the animated model's face. Models as detailed as possible, in passes.
[inferred] The brief's note says the code had it the other way round (the camera is the simulation's eye, and the
body hangs from it). [read] brief:688-691

**85, correction** · 2026-11-11 13:0x · brief:711-715 · entity detail (the librarian's note, not his words)
- The brief withdraws "the entities stay the things never seen sharp" as the librarian's reading. It cites his item 82:
  the entities are made "as detailed as you can go". [read]

**88** · 2026-11-11 15:49 · brief:731-733 · pursuit after a corner
> "also, small quirk from the ai pathing logic currently, when it rounds a corner, it will lock onto you unnaturally in
> a straight line like you can tell its an AI and not something more organically intelligent you know?" [read]
Decides: rejection. Snapping onto a straight line after a corner. [inferred]

**92** · 2026-11-11 16:24 · brief:756-758 · lesser entities approach by sound
> "i feel like, things that come in front of you should like hear you, and then slowly move toward the sound until it
> sees you, remember, the evil god is playing with you at this point, the AI should try to scare you more than trying to
> catch you at first almost, besides the hunter who is always coming" [read]
Decides: pick. Lesser entities move slowly toward sound until they see you, and scare more than catch early on. The
hunter is always coming. [inferred]

**111** · 2026-11-11 17:58 · brief:911-912 · hair under a hat
> "haircuts still change underneath the hat, making the hair bend in ways it should. But this is later." [read]
Decides: open wish, deferred by him. [inferred]

**127, 128** · 2026-11-12 00:46 · brief:1016-1019 · crowd pathing and animation references
> "i guess it wouldnt hurt to look into the ai pathing logic of known games or even open source projects, say like, what
> comes to mind is tower defense like games where many mobs path towards you at once, or like left for dead would be the
> ideal comparison for peak animations and pathing" [read]
> 128: "or like they are millions" [read]
Decides: method. Left 4 Dead is the reference for animation and pathing; also many-mob pathing. [inferred]

**129, 130** · 2026-11-12 00:48 to 00:50 · brief:1022-1026 · momentum seen from the front
> "but remember the leftfordead pathing logic documentary, it was like, back peddaling while being chased, the infecteds
> pathing and animations had this like momentum or inertia with themm that felt life like, not just a straight line
> right at you artificially most optimal path" [read]
> "not just back pedalling, since you cant walk backwards fast enough, but looking back and seeing them behind you
> slosh around corners is scary." [read]
Decides: pick. Pursuers whose momentum shows, sloshing round corners, as seen through the look-behind. Rejection: the
straight, optimal path. [inferred]

**131** · 2026-11-12 00:55 · brief:1029-1030 · learned locomotion reference
> "one thing that comes to mind from a game i played recently, was arc raiders and their own proprietary system for
> training AI entities" [read]
Decides: method (a reference). The brief's note says the source uses reinforcement learning for locomotion only.
[read] brief:1031-1035

**134** · 2026-11-12 01:08 · brief:1041-1045 · movement mechanic
> "simply holding sprint and running isnt enough, there needs to be like running/movement mechanic, what comes to my
> mind is something like COD new age movement with slide cancelling and sprint reset" [read]
Decides: open wish. [inferred]

**135, 136** · 2026-11-12 01:10 to 01:11 · brief:1046-1049 · physics, and how a bend shows
> "to expand, it is a dream, or in the inbetween, so reality and common sense can be a little malluable, i want the
> physics to be mostly realistic, but it can be bent stylistically for gameplay purposes that make sense for the setting
> and lore" [read]
> "remember, that is the psychedelic replication distortions around the world, we hvent built that yet" [read]
Decides: method. Physics mostly realistic, bent only with a reason, and the bend shown by the distortion layer.
[inferred]

**137, 140** · 2026-11-12 01:16 to 01:22 · base movement, surge
> 137: "But what would be the base movement without the abilities? Sprint, slide, dive, wall run, I had this idea,
> getting close to corners or door ways or walls increases speed, say when you a near miss, and it compounds but loses
> speed over time" [read]
> 140: "diminishing returns, i mean, people should be able to create nutty speed lines, but say the basic gameplay
> mechanic is limited for the boost, until you get ability that upgrades it." [read]
Decides: pick. The base move set includes the wall run; a near-miss surge, limited at base. [inferred]

**141, 142** · 2026-11-12 01:26 to 01:33 · each chaser kind gets its own signature
> 141: "but see now i think we are making the player too fast now, need to make the ai pathing good, perhaps every mob
> gets their own unique ability or passive to level the field" [read]
> 142: "okay we can try it" [read]. The brief says this answered the wave list: the hunter's Appetite, the interceptor's
> Mirror, the pack's Call, the sprinter's Lunge and the charger first, then the stalker and the climber's Through. [read]
> brief:1075-1077
Decides: pick. One signature per kind, in two waves. [inferred]

**146** · 2026-11-12 02:01 · brief:1085-1086 · the hunter's lean
> "the animation of the hunter isnt good, it doesnt lean naturally its like glitchy back and forth not smooth into
> turns on a nice gradient. Like its pathing is still messing with the animation itself or something" [read]
Decides: rejection. A jittery lean; he wants a smooth lean into turns. [inferred]

**147** · 2026-11-12 02:02 · brief:1087-1088 · player body, look-back
> "the player character animation from first person perspective needs to be better too, as well look back clips into
> the characters neck and shoulder area" [read]
Decides: rejection. The look-back clipping into the neck and shoulder. [inferred]

**150** · 2026-11-12 02:22 · brief:1102-1103 · method
> "instead of making our own animations from scratch, dont you think it could be good to research open source
> alternatives, not to use, but to learn from" [read]
Decides: method. [inferred]

**151** · 2026-11-12 03:07 · brief:1104 · the lean's timing
> "it still doesnt look good, it will turn, and then lean, not lean into the turn, did we ever implement the insight
> learnt from the leftfordead ai pathing?" [read]
Decides: rejection. A lean that lags the turn; the lean must lead into it. [inferred]

**152** · 2026-11-12 03:08 · brief:1107 · both bodies
> "the overall animation as well needs a hard rework, same with the player animation looking down, it needs to be more
> accurate to real procedural movement" [read]
Decides: open wish. A hard rework of both bodies. [inferred]

**153** · 2026-11-12 03:09 · brief:1109-1110 · method
> "well why the fk did we do all the research just to ignore it and do our own thing????????????????" then "get rid of
> it" [read]
Decides: rejection and method. The home-made lean and the home-made plan are removed; build what the research found.
(The brief's note.) [read] brief:1110

**154** · 2026-11-12 03:11 · brief:1111 · method
> "cant we learn how they did animations too? we need to get them right first" [read]
Decides: method. Research before building. [inferred]

**155** · 2026-11-12 03:3x · brief:1113 · picks (the brief's record; no verbatim words)
- "**the lean is both, tilt first** (Overgrowth's tilt from acceleration now; Valve's slide when A's SLIP lands);
  **while sliding, the hunter faces you** (Valve: the facing holds on its target at a capped rate while the legs run
  along the travel); **the climb uses Overgrowth's grips** (procedural; no clips)" [read]
Decides: pick. [inferred]

**156** · 2026-11-12 03:4x · brief:1114 · kinetic linking
> "do you remember the idea we had for the first dreamzone entity animation, it had to do with kinetic linking, making
> the whole body work as one. We need to make that but better for all entities and even the player character" [read]
Decides: pick and open wish. A whole-body chain for every entity and the player. The brief's note names the first
game's pieces: a parent-mounted hierarchy, counterlean, hip and thorax counter-twist, spring follow-through, head-first
steering, and legs aimed at planted feet. [read] brief:1115

**157** · 2026-11-12 03:5x · brief:1117 · ruling on the sourced lean
> "Keep source, fix sway" [read]
Decides: pick. Land the sourced lean; remove the sway. [inferred]

**158** · 2026-11-12 03:50 · brief:1118 · physics-driven animation
> "it makes me think, wouldnt be ideal for what we want to make a physics engine itself that drives the procedural
> animations" [read]
Decides: open wish. [inferred]

**159** · 2026-11-12 03:57 · brief:1120 · the standard for the player's body
> "one thing i want to say bc it needs to be said, the player animation needs to look smooth from first person
> perspective, when the player looks down at their legs and body/arms, they should move how a real person would,
> looking down at the side, the legs and feet criss crossing eachother, walking backwards, when the charater rubs up
> against a wall you see their arms and hands touch up against it as you move, the character must interact with the
> world dynamically too" [read]
Decides: pick (the standard) and open wish. [inferred]

**160** · 2026-11-12 04:0x · brief:1122 · reactions against physics-balanced locomotion
> "hmmmmmmmm would there be a way to sort of mesh both techniques in a unique and cool way? if not do 1" [read]
Decides: pick. Mesh both if the sources allow; otherwise reactions only. [inferred]

**161** · 2026-11-12 04:10 · brief:1124-1125 · physics and the camera
> "physics could control the camera and controls, it would make sense to me if it is done right" [read]
Decides: open wish, narrowed by 162. [inferred]

**162** · 2026-11-12 04:1x · brief:1127 · pick (the brief's record; no verbatim words)
- "**(a) plus the inertia dial**. Physics owns what he sees: the eye rides a simulated head, filtered toward today's
  springs (K1), and the body's reactions are physical, with hands on walls, landings and hits (K2). The aim and the
  root stay as they are. Add a small K3 inertia dial on reversals only, off by default" [read]
Decides: pick. [inferred]

**163** · 2026-11-12 04:17 · brief:1128-1130 · stride, swing, a look chain that starts at the head
> "the current build, the animations still dont look good, its as if the hunter is moving too fast for the legs to keep
> up with needs to take longer strides, torso and arms need to swing more, as well the playable character walking
> sideways, the torso doesnt like twist with the sideways look like a real persons body would bend turning to look,
> like, perhaps the head moves first when you look, then it moves the rest of the body underneath" [read]
Decides: rejection: legs that churn too fast. Pick: longer strides, more torso and arm swing, and a player look chain
that starts at the head and works down the body. [inferred] The brief's note says he does not want legs that look as if
they fail to keep up, at least in the stride. [read] brief:1130

**164** · 2026-11-12 04:18 · brief:1131 · snags and turning at speed
> "also, i swear it gets caught on walls and door ways too much too, and is able to turn way too fast keeping speed, it
> needs to find better lines to keep speed, not abusing little speed scrub on turning" [read]
Decides: rejection. Snagging on walls and turning too fast at speed. Pick: better lines. [inferred]

**165** · 2026-11-12 04:22 · brief:1133-1134 · method
> "but see, all these ideas I bring, they have to link to the research, you have to build it in a way it will work, not
> just from my input alone" [read]
Decides: method. Each of his ideas is checked against research before it becomes a plan step. (The brief's note.)
[read] brief:1134

**166** · 2026-11-12 04:2x · brief:1138 · animal data
> "like we should take the data from wild animals in nature and their locomotion, as well as humans since they are
> animals too" [read]
Decides: method. [inferred]

**167** · 2026-11-12 04:25 · brief:1143 · the uncanny from animals
> "well see, the hunter, and other entities, can take things from different animals, while being humanlike at the same
> time, to create that uncanny valley effect" [read]
Decides: pick. The brief's note, from the studies: the uncanny comes from cues that disagree, not from motion that is
uniformly a bit off. [read] brief:1147

**168** · 2026-11-12 04:3x · brief:1150-1153 · cornering law; humanoid rule
> "I like 1, but believe it should still be humanoid in a way, all entities must be humanoid in nature with their own
> unique uncanniness, remember, not only is the dreamzone a manifestation of the characters psyche, but so are the
> entities and the shape they take." [read]
Decides: pick. The hunter corners by the hunting-animal law (H2) in a humanoid body. Every entity is humanoid, each with
its own uncanniness. (The brief's reading of "1".) [read] brief:1151-1152

**169** · 2026-11-12 04:3x · brief:1154-1155 · per-kind cues (the brief's record, plus his one line)
- "**hunter T1 only** (greyhound cornering, one clear cue; its head stays humanlike); **sprinter T3** (galloping back
  flex; needs a spine joint the body lacks); **pack T4** (one shared fixed rhythm, a swarm cue); **the rest as E
  proposed**: interceptor T2 (bird head hold), climber/crawler T4, stalker T2, charger T3." [read]
> "just re read what I said where is the confusion" [read]
Decides: pick. One cue per kind; the hunter's is greyhound cornering only. [inferred]

**172** · 2026-11-12 05:42 · brief:1165 · the thesis, as it bears on the chase and the catch
> "In a way, the game is all a representation from running away from death, all we can do, we cant stop and fight it,
> all we can do is run, and hope that at the end when it catches us, there is something else out there good, that saves
> us" [read]
Decides: pick. Running is the only verb; a catch is answered by a save. [inferred]

**173** · 2026-11-12 05:4x · brief:1175 · player body picks (the brief's record; no verbatim words)
- "**a shoulder sliver on the look-back** (Rust's tuck, at the edge of the view); **a loose fist** at the top of the
  sprint swing (not the open V hand); **show the leading leg in a slide.**" [read]
Decides: pick. [inferred]

**175** · 2026-11-12 06:56 · brief:1180 · hunter arms
> "the animation for the hunter is defintelly better, now the arms need to swing with the body more" [read]
Decides: open wish. [inferred]

**176** · 2026-11-12 07:1x · brief:1188 · arm swing (the brief's record, and his one word)
> "Both" [read]. The brief says this means a bigger swing at speed and the arms riding more of the torso's twist. [read]
> brief:1188
Decides: pick. [inferred]

**177** · 2026-11-13 00:38 · brief:1189 · arm shape
> "the arms are still not moving good, look into how arms should swing and it becomes obvious, its making me think you
> arent using the real reseaech. the arms are like too close to the sides of the body while moving" [read]
Decides: rejection: arms held too close to the body. Method: use the real research. [inferred]

**178** · 2026-11-13 02:33 · brief:1197 · pursuit arcs, mirror and cut-off, audible steps
> "in a square room, if you run straight from wall to wall, the pathing of the entities cannot get you, like they
> cannot turn quick enough to keep up, so there needs to be like a subtle pathing awareness when they are being
> finessed, nextbots have the same weakness, quick circle strafes etc. It still gets caught on corners, and doesnt know
> how to run in archs instead of sharp turns. I had this idea, what if the hunter in a way, simply mirrors the line of
> the player when behind them, but then they have a different state to change it up where it is predicting where youre
> headed to cut you off. once we get better sound it will be better player experience instead of constant ganks with no
> footsteps u can hear barely." [read]
Decides: rejection: sharp turns and snagging on corners. Open wish: the hunter runs arcs, mirrors your line from behind,
and has a state that predicts and cuts you off. Its footsteps must be heard. [inferred]

**180** · 2026-11-13 03:20 and 03:24 · brief:1205, :1211 · elbow flare and bend; research against his eye
> "from the video, does look better, but the elbows should be flared out more, looks like someone with a suboptimal
> running technique with how they swing their arms, like there needs to be more bend in the elbow when swinging" [read]
> "hmmm i guess if the research is right, but it doesnt look good to me at least" [read]
Decides: rejection of the look shown. The brief's note gives the librarian's ruling: his eye is the bar for the look,
the research is how it is built, and the baseline is shown beside it. [read] brief:1211

**184** · 2026-11-13 05:03 · brief:1479 · the hunter's footstep sound
> "the deeper bassy thud is better idea i think for the hunters sound, it should be like, heavy, like SCARY bassy
> stomps" [read]
Decides: pick. [inferred]

**186** · 2026-11-13 05:53 · brief:1485 · arm variant
> "v1 sourced flare looks the best" [read]
Decides: pick. V1, the sourced flare with the held elbow, by the brief's reading. [read] brief:1486

**190** · 2026-11-13 07:10 · brief:1497 · the stomp's character
> "also stomp 1 heavy is the best, but its still sounding like a drum more than loud heavy footsteps of a monster. But
> its getting better. Stomp 3 Giant is good too, but sounds even more like a drum which isnt good" [read]
Decides: rejection. A footfall that sounds like a drum. [inferred]

**192** · 2026-11-13 07:28 · brief:1505 · the hunter's footfall
> "recorded heavy hits, three to a step, is almost perfect, good for now" [read]
Decides: pick. [inferred]

**193** · 2026-11-13 07:28 · brief:1508-1509 · the player's steps
> "we just need to make the player steps better now" [read]
Decides: open wish. The brief reads it as sound, and notes it could mean how the legs step. [read] brief:1509

**195** · 2026-11-13 07:46 · brief:1514 · the hunter's vertical bob
> "the newest build, it is getting there, but now its like, they are stomping when they stride like up down up down up
> down in a weird goofy way" [read]
Decides: rejection. The body bobbing up and down at each step. The brief records a fix on a branch, not landed. [read]
brief:1588

**196** · 2026-11-13 09:14 · brief:1518 · in-run cutscenes end with the hunter
> "Like there could be pseudo cutscenes during a run, brief that sort of pause the moment, something happens during the
> cutscene, and the cutscene ends by the hunter finding the player or something along the lines of crashing the
> party/cutscene." [read]
Decides: open wish. [inferred]

**200** · 2026-11-13 09:30 · brief:1528 · props and how bodies flow
> "putting props on the running line can be done right and create more complexity if done right how the player and
> entities flow." [read]
Decides: open wish. Parked, by the brief. [read] brief:1529

**205, 206** · 2026-11-13 11:40 · brief:1546, :1550 · the hunter's stalking mode
> "when you dont see it, it can use a stealth mode to sneak up on you, eliminating footsteps or making them so quiet,
> and its pathing logic is literally this, stay out of the cone of vision of the player at all costs. But eventually
> the player will see the hunter, then the real chase begins, with the loud footsteps and chase etc" [read]
> "it should still keep chasing the player, i just dont want an OP undetectable hunter abusing the runner, they should
> know where it is most of the time or that is the goal" [read]
Decides: open wish, with a goal: the player knows where the hunter is most of the time. Not planned or built, by the
brief. [read] brief:1553

**207** · 2026-11-13 11:42 · brief:1554 · how the stalk moves
> "and then, we will have to do more animation work, there should be a stealth mode of animation, moving like an alien
> hyena or some shit" [read]
Decides: open wish. The brief notes that no gait source for a stalking animal has been read. [read] brief:1556

**208** · 2026-11-13 11:42 · brief:1558 · the moment of being seen
> "and then in that split second you see it, it turns up right and starts running like a human" [read]
Decides: open wish. A transition from the low gait to the upright sprint. [inferred]

**211, 212** · 2026-11-13 12:52 and 12:58 · brief:1569, :1574 · frame budget
> "we could realistically aim for a bit lower that 360. This is just my own personal preference for the ultimate vision
> of the game, not every player will have a 360hz oled, if anything, the standard for most users should be 144 to 240hz
> max, but can allow for up to my refresh rate for goated pcs" [read]
> "i should say, for our build i want it as close to 360 as we can get it for true ultra, but i can settle for a solid
> 300+" [read]
Decides: method (the budget). [inferred]

**214** · 2026-11-13 14:21 · brief:1589 · the torso in a bank; "too human"
> "on the corners, the torso doesnt orient itseld into the banking of a turn, it looks very good, but is starting to
> become too human looking, we need to almost start to tweak it to be creepy some how" [read]
Decides: open wish: the torso follows the bank further, and the run is made creepy. The brief's correction says the
only cue built for the hunter stays the cornering one, and the bank shares on screen are to be shown to him. [read]
brief:1595-1598

**215** · 2026-11-13 14:32 · brief:1599 · method
> "we did do tons of research, remember" [read]
Decides: method. Open the room's research before answering. [inferred]

**216** · 2026-11-13 14:41 · brief:1603 · a review page of animation
> "i think we devolved a shit ton with that artifact" [read]
Decides: rejection of a page that showed an older base as current. The brief rules that no before-and-after page goes
to him whose "before" is older than something he has already been shown fixed. [read] brief:1605-1606

**217** · 2026-11-13 14:43 · brief:1607 · method for the uncanny
> "i think from the idea i had in my head, we get the a good metric for a really human looking sprint which we had, and
> then we tweak it from there to look uncanny in a realistic way that obeys physics" [read]
Decides: method. [inferred]

## The decision page (item 183), picks that bear on motion

All on 2026-11-13, at the UTC time shown in the brief.

- `run_frame-4` 10:00:56Z · brief:1227-1228 · "Parks close in overtime" [read]. Picked over "It reroutes around". [read]
- `run_frame-5` 10:01:03Z · brief:1229-1230 · "A new creature": "it wears the hunter's shape as a stand-in". [read]
- `chase_entities-1` 10:01:47Z · brief:1231-1232 · "Grip above human": "The hunter corners better than a human
  ('monstrous')". [read]
- `chase_entities-2` 10:10:14Z · brief:1260-1262 · "Keep the wall pass?" He picked "Drop it", and his note is "ofc not."
  [read] Read together, the note agrees with dropping it. [inferred]
- `chase_entities-3` 10:12:24Z · brief:1263-1265 · "The hunter loses you briefly". His note: "it will randomly keep going
  in the direction you were going before shrouding. […] i wonder if we could make the AI in the game learn and adapt to
  the players playstyle for that one run" [read]
- `chase_entities-5` 10:14:17Z · brief:1266-1268 · "Only crawler and pack" climb. His note: "the hunter will be like
  fuck, and run into the shadows away, waiting for you to come down for it to route to you, it is a creepy thing to do,
  but i wish it had more of an intelligent awareness to the fact that the player might be cheesing it, hides out of
  their view maybe close by, to gank them when they think theyre safe jumping down" [read]
- `chase_entities-6` 10:15:28Z · brief:1269-1271 · "Tie hunter to player's surge". His note: "the hunter itself gains the
  same mechanic as the player, learning to utilize the speed buffs from near misses and doing good lines" [read]
- `entity_bodies-1` 10:15:28Z · brief:1272-1273 · "Decide kind by kind" (the sprinter's body shape). [read]
- `entity_bodies-2` 10:17:02Z · brief:1274-1276 · "Nearest two or three full detail". His note: "hunter full detail, the
  rest can be lower quality but still decent. […] a pseudo realistic look with intelligent low poly design that uses
  techniques to look like realism." [read]
- `entity_bodies-3` 11:30:22Z · brief:1376-1378 · "A face only at the catch". His note: "the face will bend and drift
  while becoming so fucking horrifying. If it grabs you from behind, it stops you, depending on the angle of attack,
  ragdolls your body and flips you around, all driven by procedurally generated animations depending on the seed and
  location of death, momentum and inertia relative to map geometry. Once your body settles after ragdoll, depending on
  how the player is oriented, the hunter drags them and turns them around to face it, and the face contorts, their head
  turning into a void that begins to grow, encompassing and replacing the surrounding environment, almost like, the face
  of the hunter turns into a portal that sucks him into it" [read]
- `player_body-1` 11:30:22Z · brief:1379-1380 · "Sideways turn speed?": "Keep and tune by eye". [read]
- `player_body-3` 10:18:24Z · brief:1279-1281 · "Real first, stage where you ask": "Score against recorded human
  motion, then stage by request". His note: "I dont understand what staged from start means." [read]
- `player_body-4` 10:18:24Z · brief:1282-1283 · "Tune the player's own" (his arm-shape notes do not bind the player).
  [read]
- `player_body-5` 10:20:23Z · brief:1284-1286 · "New joints" for a fist, not the page's suggestion. His note: "the hands
  could also clench or open when running, and remember the arms and hands need their own procedural animations for
  coming up against walls like standing infront of one. or running up against the wall sprinting you bump into it and
  drag against the wall the arms should move to show it." [read]
- `movement-1` 10:21:34Z · brief:1287-1289 · his note: "10ms is the standard sprint speed, you can run up to 12ms for a
  short time when first sprinting max speed, but then tapers off back to 10ms, if you slide it refreshes it for a short
  time again." [read]
- `movement-2` 10:23:16Z · brief:1290-1292 · his note: "Also jumping or mantling over objects, exiting a reprieve zone.
  Jumping into a slide gives you a very transient boost of speed" [read]
- `movement-4` 11:31:34Z and `movement-6` 11:31:48Z · brief:1381-1385 · "8ms is max speed sprint, then the tac sprint
  equilivent makes you go 10ms, then slows down, needed to do slide cancel to refresh it" and "8ms" [read]
- `movement-5` 10:25:14Z · brief:1295-1297 · his note: "we need to do the first person animation right for the
  summersault front flip, the camera from the first person view physically flips with the character to create that
  sense of awe doing a flip, then can be connected to a slide etc." [read]
- `movement-7` and `movement-8` 10:28Z · brief:1298-1303 · his note: "you should be able to press a or d while holding W
  retaining speed, changing course diaganolly […] right now you need to press W to go forward, letting go doesnt carry
  momentum." and "10% base" [read]
- `movement-9` 11:32:28Z · brief:1386-1388 · "Raise to 18 to 20". His note: "we will have to test the evil god to be
  right on your tail even then." [read]
- `movement-11` 10:30:48Z · brief:1306-1308 · "Full coupling". His note: "it should be player engaged, and the camera
  should follow where the players head is looking during it, following real locomotion telemetry." [read]
- `movement-12` 10:31:23Z · brief:1309-1311 · "By the run". His note: "the summsault will be straight ability. no air
  turning." [read]
- `movement-13` 11:32:47Z · brief:1389-1390 · his note: "voids should be rare, but perhaps you can even wall run to dodge
  infront of u lol" [read]
- `stress-2` 10:44:10Z · brief:1317-1319 · his note: "what if juking the hunter in a goofy way somehow tricking its
  pathing, has a tiny chance to trigger a frenzy just from frustration trying to get the player." [read]
- `stress-5` 11:40:02Z · brief:1408-1410 · his note: "For a solid 30 seconds, you have the equilivent to the mario star
  powerup, making you SPEED demon and invulnerable" [read]
- `stress-6` 10:44:40Z · brief:1320-1322 · "Felt only". His note: "The sound could be the players breathing is more
  ragged" [read]
- `abilities-5` and `abilities-6` 11:37Z to 11:38Z · brief:1396-1401 · "if a single entity is infront of you, it makes
  them flee […] perhaps it slows the hunter down to slow sprint." and "except for the entities the light is on, they
  flee." [read]
- `look_fear-1` 11:55:33Z · brief:1446-1447 · "Keep the haze, drop the camera-lifts-out beat" (the page's suggestion).
  [read]
- `look_fear-3` 10:08:17Z · brief:1249-1251 · "Key it to the peak". His note: "and then the closer the hunter gets to
  touching you, it modulates the fov to zoom out to feel like aAAAAA" [read]
- `run_frame-6` 11:22:41Z · brief:1368-1369 · his note: "every time you it gets you, i want there to be like a
  psychedelic horror cinematic, first is the jump scare and screamer, then it like drags you under the floor into a
  demonic fractal realm void, rising....rising.... then you wake up at the peak of the horror." [read]
- `run_frame-7` 11:24:06Z · brief:1370-1372 · "Two sequences". His note: "a glimpse at the raw demonic power." [read]
- `sound-1` 10:08:46Z · brief:1254-1255 · "Duck all but the hunter's footsteps, to a floor". [read]
- `sound-2` 10:09:06Z · brief:1256-1257 · "Build both, pick by ear" (settled later by 184 and 192). [read] brief:1480
- `sound-3` 11:05:00Z · brief:1349-1350 · "The living sounds (feet, breath, voices)" first. [read]
- `waking_room-1` 10:07:40Z · brief:1244-1246 · "A full walked room". His note: "fully interactable from what i said,
  can walk around, look out the window, sit at desk and go on pc, workout, customize setup." [read]

## (1) Decisions that stand

Built only from the items above. The latest word on each topic is given; a later item overrides an earlier one.
[inferred]

- The chase: you cannot fight, only run (172). A fast hunter that movement skill can beat (1). The hunter always comes
  (65, 92). Several kinds of chaser (3), each with its own signature (141, 142).
- Momentum: entities carry momentum and inertia and do not turn on a dime (18, 129). Wanted: arcs, not sharp turns, and
  no snagging (164, 178).
- The hunter corners by the hunting-animal law in a humanoid body, with grip above human (168, `chase_entities-1`).
- Every entity is humanoid, each with its own uncanniness, and each takes its shape from the character's psyche (168).
- Cues by kind (169): hunter T1 only (greyhound cornering; head humanlike); sprinter T3; pack T4; interceptor T2;
  climber/crawler T4; stalker T2; charger T3. Bodies are decided kind by kind (`entity_bodies-1`).
- Only the crawler and the pack climb (`chase_entities-5`).
- The lean: sourced tilt first, with the slide later; while sliding, the hunter faces you; the climb uses grips (155).
  "Keep source, fix sway" (157).
- Kinetic linking (the whole body working as one) for all entities and the player (156).
- Physics: mesh both techniques if the sources allow (160). The eye rides a simulated head; reactions are physical
  (hands on walls, landings, hits); the aim and the root stay as they are; a small inertia dial, off by default (162).
- The player's body: seen in first person, matching the actions, with the camera attached to it (13, 82). The standard
  is item 159. Look chain from the head down (163). Shoulder sliver on the look-back, loose fist, leading leg shown in a
  slide (173). New finger joints for the fist (`player_body-5`). The player's arms are tuned on their own
  (`player_body-4`). Sideways turn speed is kept and tuned by eye (`player_body-1`).
- The hunter's legs and arms: longer strides at speed (163); arms swing more, both bigger and riding the twist (175,
  176); V1, the sourced flare (186).
- Footsteps: the hunter's are recorded heavy hits, three to a step, "good for now" (192). The good entity ducks every
  sound but the hunter's footsteps (`sound-1`). Living sounds come first (`sound-3`).
- Camera: FOV widens with speed and as the hunter closes, never fish-eyed (27, `look_fear-3`). The look-behind exists
  (27).
- Somersault: full coupling, with the camera following where the head looks, from real locomotion data
  (`movement-11`). The dive goes straight along the run, with no turning in the air (`movement-12`).
- The catch shows a face, and only at the catch (`entity_bodies-3`).
- The dark one is a new creature; for now it wears the hunter's shape as a stand-in (`run_frame-5`).
- Detail: the hunter is full detail, the nearest two or three are full, the rest are lighter but decent; the style is
  pseudo-realistic with intelligent low poly (`entity_bodies-2`).
- The waking room is a full walked room with the body in it (`waking_room-1`).

## (2) Things he rejected

[inferred] for the sorting; each line cites its item.

- The home-made lean and the home-made plan (153).
- A jittery, back-and-forth lean (146). A lean that comes after the turn (151).
- A straight-line lock-on after a corner (88). A straight, artificially optimal path (129).
- Turning too fast while keeping speed, abusing the speed scrub, snagging on walls and doorways (164). Sharp turns
  instead of arcs (178).
- Legs that look as if they cannot keep up, and short churning steps (163).
- The body bobbing up and down at each step, "in a weird goofy way" (195).
- Arms held close to the sides (177). Elbows that read as poor running technique (180).
- A run that is "too human" (214).
- A footfall that sounds like a drum (190).
- The look-back clipping into the neck and shoulder (147).
- Trails behind the player model in the lighting (63).
- An FOV that gets "too fish eyey" (27).
- Entities that are "speed hacking" (17). An "OP undetectable hunter" (206).
- Out-of-body experiences inside the dream (26). The camera-lifts-out beat (`look_fear-1`).
- The wall pass (`chase_entities-2`, "Drop it", "ofc not.").
- A review page whose "before" was older than a fix he had already seen (216).

## (3) Wishes not yet built

The build state is given only where the brief states it. Elsewhere it was not checked here. [inferred]

- Procedural hands and arms on walls and objects: touching, running against a wall diagonally, bumping and dragging
  (27, 159, `player_body-5`). Hands that clench and open while running (`player_body-5`).
- The player body as in 159: legs crossing when looking down to the side, walking backwards.
- Kinetic linking for every entity and the player (156). A physics engine driving the procedural animation (158).
- The hunter's stalking mode: silent, out of view, an "alien hyena" gait, rising upright the moment it is seen
  (205-208). Not planned or built, by the brief. [read] brief:1553, :1557
- The hunter mirrors your line from behind, then switches to predicting and cutting you off (178). It learns the
  player's moves within a run (`chase_entities-3`, `-6`). It hides close by when the player is cheesing a ledge
  (`chase_entities-5`). Shrouded, it keeps going the way you were going (`chase_entities-3`).
- Lesser entities that hear you, move slowly toward the sound, and commit only on sight (92). Signatures for each kind
  (142). The lesser kinds' cues wait for humanoid models; they draw as boxes today. [read] brief:1154
- The catch: a ragdoll that depends on the angle and momentum, the drag, the turn to face the hunter, and the face
  becoming a portal (`entity_bodies-3`). Dragged under the floor into a fractal void (`run_frame-6`). A separate
  reveal (`run_frame-7`). The camera and soul sucked into a portal (26). A jumpscare (16).
- The invading figure that grabs from behind (31). In-run cutscenes that end with the hunter crashing in (196).
- The first-person waking-up animation (34). The chair's third-person, out-of-body camera (49; see the conflicts).
- The somersault front flip, with the camera flipping (57, `movement-5`). A dive roll that moves with the head, and a
  super slide (57). Dream flight (29).
- A good entity with a golden aura, "like an angel" (26), that freezes the other entities (34).
- Entities that flee the flashlight and swarm and frenzy behind it; the hunter slowed to a slow sprint (37-39,
  `abilities-5`). A goofy juke that may set off a frenzy (`stress-2`).
- The torso following the bank further, and creepiness tuned from a human sprint within physics (214, 217).
- Ragged breathing under stress (`stress-6`). Better steps for the player (193).
- Hair that bends under a hat, later (111).
- Entity animation better than the first game's (16).

## (4) Rulings about method

[inferred] for the sorting; each line cites its item.

- Learn from open source, "not to use, but to learn from" (150).
- Build what the research found; the home-made version goes (153). Research before building: "we need to get them right
  first" (154).
- Every idea of his is linked to research and built so it works, "not just from my input alone" (165).
- Use locomotion data from animals and from humans (166). Left 4 Dead is the reference for animation and pathing (127,
  129). The learned-locomotion reference (131). Parkour and chase games (57).
- The uncanny comes from animal traits on a humanlike body (167). Each entity is humanoid with its own uncanniness (168).
- The method for the uncanny: a measure of a really human sprint, then tweaks that stay realistic and obey physics
  (217).
- Physics mostly realistic, bent only for the setting and lore, with the bend shown by the distortion layer (135, 136).
- His eye judges the look (the brief's ruling at 180). Tune by eye (`player_body-1`).
- Score against recorded human motion first; stage only where he asks (`player_body-3`).
- Open the room's research before answering him (215).
- Show him the current base, never an older one dressed as current (216).
- Models as detailed as possible, in passes (82). A full body is "expensive but worth it" (13).
- Frame budget: 360 the aim and a solid 300 the least on his machine; 144 to 240 Hz for most players (211, 212).

## Where two items conflict

Shown as on disk. Resolving them is not this file's job. [inferred] for the pairing.

- **The player's sprint speeds.** 21: about 5 m/s, then easing toward about 10 (brief:114-115). 81: tapering off at
  10 m/s (brief:667-668). `movement-1`: 10 standard, 12 for a short time (brief:1289). `movement-4` and `movement-6`:
  "8ms is max speed sprint", tac sprint 10 (brief:1383, :1385). The last word by time is `movement-4`/`-6`. [read]
- **Does the hunter know where you are?** 65: "the main hunter always knows where you are" (brief:520). 58: under the
  aura, entities "still know where you are" (brief:470-471). `chase_entities-3`: "The hunter loses you briefly"
  (brief:1263). [read]
- **Does the player know where the hunter is?** 205: a stealth mode that eliminates the footsteps (brief:1546). 206: "they
  should know where it is most of the time" (brief:1550). 178: footsteps must be heard (brief:1197). [read]
- **The out-of-body camera.** 49: the camera rises out of the body in the chair and returns (brief:414-416).
  `look_fear-1`: "drop the camera-lifts-out beat" (brief:1446). 26: "there shouldnt be out of body experiences in the
  dreamzone" (brief:191-192). The brief does not say whether `look_fear-1`'s beat is the chair's. [read]
- **Wall running.** 14: "minimal", "rare and short" (brief:79-81). 137: the wall run is base movement (brief:1053).
  `movement-13`: "perhaps you can even wall run to dodge infront of u" (brief:1390). [read]
- **How chasers turn.** 18: "the entities then scrub speed turning" (brief:102). 164: "not abusing little speed scrub
  on turning" (brief:1131). 178: they "cannot turn quick enough to keep up", and wants arcs (brief:1197).
  `chase_entities-1`: "Grip above human" (brief:1231). [read]
- **Model detail.** 82: "Make the models as detailed as you can go" (brief:680). `entity_bodies-2`: "hunter full detail,
  the rest can be lower quality but still decent" (brief:1276). [read]
- **How human the hunter looks.** 169: hunter T1 only, "its head stays humanlike" (brief:1154). 214: "too human looking
  […] tweak it to be creepy" (brief:1589). 217: tweak from a human sprint within physics (brief:1607). The brief's
  correction keeps T1 as the only cue (brief:1598). [read]
- **The trunk's share of the bank.** 156 adopts the first game's counterlean (brief:1115). 214 says "the torso doesnt
  orient itseld into the banking" (brief:1589); the brief notes that the shares as built are that game's 1.0 / 0.35 /
  -0.30 (brief:1591). [read]
- **Research against his eye.** 180: "i guess if the research is right, but it doesnt look good to me at least"
  (brief:1211). 186: then he picked "v1 sourced flare" (brief:1485). [read]
- **Physics and the camera.** 161: "physics could control the camera and controls" (brief:1124). 162: "The aim and the
  root stay as they are" (brief:1127). [read]
- **The dark one in overtime.** 28: "even safe zones dont save you, just reroute it" (brief:228). `run_frame-4`: "Parks
  close in overtime", picked over "It reroutes around" (brief:1227). [read]
- **The first game's "non-human motion".** 156 records it in that game's figure (brief:1115). 163: the legs must not
  look as if they fail to keep up; the brief reads this as no such detuning in the stride (brief:1130). [read]

## What I did not open

- Every file the brief cites: the hand-backs (`handback/p-l*`, `p-d*`), the plans (`loop/plan_l18*`, `plan_l187`,
  `procgen_scout_*`, `buildpath_*`, `sprint_reference_2026-11-13/`, `absolute_sources_2026-11-13/`), the
  `third_place/` files, `librarian/2026-11-12.md` and `2026-11-13.md`, and `briefs/dreamzone3_biomes.md`.
- The game's code (dreamzone-3, on any branch) and the first game's code (dreamzone-rt). The code lines the brief cites
  (for example `game/model_rig.h:134-136`) are the brief's claims, not checked here.
- The decision page artifact and its store, `loop/his_calls_2026-11-13.json`, and every review page and clip the brief
  links.
- The research papers the brief names. Its research checks are the room's summaries, not read here.
- `animation-system.workflow.js` in this folder.
