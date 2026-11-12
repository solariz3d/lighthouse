# L169: how known games and open-source projects path and animate many pursuers. Librarian, 2026-11-12 00:4x (L)

His words: `briefs/dreamzone2_the_game.md` item 127. **Context:** the softer chase is his first open call (D's handoff
`loop/handoff_dreamzone3_2026-11-11-D.md`, "His open calls"; E's sweep `handback/p-d669-sweep-E_2026-11-11.md:268`, :295: flee never
caught 52 → 62 of 96 since D664; cutback caught sooner, 41.0 → 34.6 s). The lesser chasers' arc (hear, investigate, scare before the
catch, D666) is not built. **Research only, nothing built.** Three panes, disjoint. B is on L168 (setup).

**E: the games, from sources** (GDC talks, postmortems, developer interviews, numbers where published):
- **Left 4 Dead** (his ideal):
  - Valve's AI talk (Mike Booth, "The AI Systems of Left 4 Dead", GDC 2009): the nav mesh, reactive path following, path smoothing,
    climbing, how a horde avoids clumping, and the AI Director's pacing (build-up, peak, relax);
  - the infected's locomotion and animation;
  - what makes a horde read as alive.
- **Tower defense and mass-pathing:** flow fields (Supreme Commander 2's, Elijah Emerson in *Game AI Pro*; Planetary Annihilation), and
  where flow fields beat per-agent A*.
- **Horde games:** Days Gone, World War Z (Saber's Swarm engine), and Vampire Survivors' plain seek, for contrast.
- **For each,** the one idea Dreamzone could take, read against its chase as it stands (D's handoff: the hunter, pack, sprinter,
  interceptor and climber; organic pursuit since D664).

**A: the open-source code, read against `dreamzone-3` `chase/`** (A owns chase/):
- **Source SDK 2013's NextBot**, public on GitHub:
  - `NextBotPathFollower`, `NextBotChasePath` (how a chaser leads its target), and the locomotion interface;
  - give file and line.
- **Recast/Detour's DetourCrowd** (already a submodule in dreamzone-3): what its crowd steering and local avoidance do that
  `chase/` does not use.
- **RVO2/ORCA** (local collision avoidance) and a flow-field implementation, briefly.
- **Return,** each as a lever with a registrable bot test: what in these would restore **catch power** without undoing organic
  pursuit, and what would make the **cutback** pay (his item 18's juke). Use the 150-seed paired method from L161.

**C: the animation side** (C built the body):
- How Left 4 Dead's infected are animated: layered or blended locomotion, climbing and vaulting animations, hit reactions, and how
  animation and pathing stay in sync.
- Modern references: motion matching (Ubisoft's *For Honor*, Clavet GDC 2016), and procedural foot placement.
- **Return:** what fits the hunter and kid models now in-game (D663's loader, `content/models/*.glb`), and what it would cost.

**Hand-backs:**
- `handback/p-l169-games-E_2026-11-12.md`
- `handback/p-l169-code-A_2026-11-12.md`
- `handback/p-l169-anim-C_2026-11-12.md`

Each gives sources, and marks what is the source's against what is inferred. Quote nobody in dreamzone-3.

**Added at dispatch (his item 128, "or like they are millions"):** E adds *They Are Billions* (Numantian Games): how thousands of
infected path and swarm at once, from the developers' own accounts where published.

**Added 00:48 (his item 129), the focus for all three:**
- He remembers a Left 4 Dead pathing documentary or video: the player backpedals while being chased, and the infected's pathing and
  animation carry momentum and inertia that feel alive, "not just a straight line right at you, artificially most optimal path".
- **E:** find that piece (a talk, video or article), and say what it shows.
- **A:** find in NextBot and Booth's method exactly what makes a pursuer NOT take the optimal line:
  - path smoothing and look-ahead;
  - steering with momentum;
  - local avoidance;
  - path randomization;
  - animation-driven speed.
- **C:** how the animation carries that weight.

**Added 00:50 (his item 130):** the measure of success is what the **look-behind** shows. Glancing back mid-sprint, he sees pursuers
**slosh around corners**: swinging wide, overshooting, carrying momentum. A: the levers should also be scored on that (for example,
the lateral overshoot past a corner's inside line, measured from the runner's view). C: what animation sells a pursuer sliding wide
around a corner.
