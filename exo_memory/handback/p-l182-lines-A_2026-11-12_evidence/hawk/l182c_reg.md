
## L182c: the exploit search (the chair's 08:50Z insert, at his word: he is the only one finding the chase's exploits), registered 2026-11-13 before the first new arm runs

**What it is.** A family of evasive player policies, each swept over its parameters, run against the real hunter in a bounded arena. **Any (policy, parameter) cell that is never caught is an exploit and becomes a red row.** His item 178's two bots (wall to wall, the circle strafe) are its first members; it is registered here, with its own falsifier, before any hawk arm is scored by it. It extends `chase/room.h` (L182b): the same real `Run`, the same scripted player kinematics (a 2D mimic of the controller's ground movement: `ground_accel` 10 per second, friction 6, stop speed 2.5), the hunter in at a corner, no head start, difficulty level 1, `catch_reach` at its default.

### The family and its grids (fixed here; a policy the arena's size alone decides is named, not hidden)
| policy | arena | parameters swept | cells |
|---|---|---|---|
| **shuttle** (wall to wall; his item 178) | the 12 m square room | lane (3, 6, 9 m from the south wall) x reversal margin (1.0, 2.5 m from a wall) x wished speed (6, 8 m/s) | 12 |
| **circle strafe** (his item 178) | the same | radius (1.5, 2.5, 4.0, 5.0 m) x direction (both) x wished speed (6, 8) | 16 |
| **figure-eight** | the same | lobe radius (2.0, 3.0 m) x orientation (along x, along z) x wished speed (6, 8) | 8 |
| **door dance** (laps through a loop of two doors) | two 8 m rooms joined by two 1.2 m doors in their shared wall, 4 or 5 m apart | door spacing (4, 5 m) x lap direction (both) x wished speed (6, 8) | 8 |
| **stair juke** (up and down a flight) | a room with a flight of 10 steps to a landing | flight side (4) x speed (6, 8) | 8 |
- Each cell is **6 start phases** (where on its route the player begins), up to **60 s** each. The wished speeds bracket the chase's reference speed (8 m/s); at 6 the player is slower than the hunter and is expected to be caught: those cells are the search's own control.
- **Honesty about the family:** the stair juke needs a stair-capable synthetic arena (a flight the navigation mesh reads as stairs); **if it is not built in this pass its row says "not swept" and the exploit count is reported for the cells that were**, never as zero for the whole family. The door dance needs its second arena for the same reason. A cell whose outcome the arena's size alone decides (a circle of 5 m radius is nearly the 6 m the room allows) is kept in the grid and marked: the player at that radius is circling the hunter's whole room.

### The definitions
- **Exploit:** a cell in which **none of the 6 runs is caught within 60 s.** **Near-exploit:** at least 3 of the 6 runs not caught. Both are reported per policy; only exploits count against the bar.
- **The registered bar: zero exploit cells, with the fairness bars below held.** The exploit count is a per-arm figure (control, a1 to a8, h1 to h5).

### The search is tested before it scores anything (the L170 slip-estimator lesson)
**On today's chase (the control, every dial at its default) the search must flag at least one shuttle cell and at least one circle-strafe cell as exploits (or, failing a strict exploit, near-exploits in both)**, because he beat every chaser by hand in exactly those two ways. **If it does not, the search is blind to the case it exists for:** the hand-back stops there and says so, before any arm is scored by it, and the bots are revised against his words under a new registration, not tuned to pass. The result of the check is reported with the arm tables.
- Registered expectation (inferred): about 60 % that a shuttle cell is flagged on the control, about 50 % for a circle-strafe cell. A player who can reverse in a fifth of a second (the controller's own acceleration) against a chaser that turns at 150 to 276 deg/s is the mechanism his observation names; whether it is enough to beat the hunter's re-plan interval and its speed advantage over 60 s is what the check measures.

### The fairness bars (from the L182 registration `50dea0b`, and what closing an exploit must not cost)
The chase law must take the exploit count to zero **while these hold**, in both 150-seed blocks:
1. **Walls:** head-on wall hits per minute of chase no more than **0.7 times the control's** (a1 0.38, a2 0.45, a3 0.5 are the figures reached), falsified above 1.0; in the room runs, no more than the control's.
2. **Lawful turn:** at most **5 %** of a corner above Chang & Kram's Eqn 5 speed for its radius (the `p3_turn_rate...` row; control 27 %); falsified over 15 %.
3. **The chase is not softened:** the flee bot's never-caught share no more than the control's plus 5 points, and the Line median no more than the control's plus 10 % (the price bar).
4. **The chase is not made unwinnable (ceiling):** the flee never-caught share not below **40 %** (the control is 60 to 63 %) and the Line median not below **20 s**: the player who plays well can still live.
5. **The hunter does not cheat:** its top-speed multiples are those of the control (read from the speed table each sweep prints), and the guidance reads only what it knows (`Knowledge::at_or_before(now - reaction)`), never the player's true position.
6. **Guards:** `pursuit_tests.cpp:92` and `:117` green; the 12-seed byte-identity with every dial at its default.

### Registered falsifier
**If no arm brings the exploit count to zero with the fairness bars held, the chase's pursuit law is not the thing that closes his exploits at the papers' gains, and the hand-back says so with the cells that remain** (they stay red rows). No arm is retuned to pass; a different gain is a new registration naming the figure it comes from. If the family cannot be bounded honestly for a policy, that policy is named in the hand-back with what was swept instead.
