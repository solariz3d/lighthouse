# Packet B1b (pane C): the lean yields to walls, a human body keeps a human lean, and the view can ride the head

Written by the librarian on D, the night of 2026-11-14, at the collation of B1 (`handback/p-b1-lean-C_2026-11-14.md`,
git-blob 3d20a5b5, read whole). Plan: `loop/plan_new_system_2026-11-14.md`. Night's order: `loop/night_order_2026-11-14-D.md`.
Tier: check it, with the rows below. Everything stays behind `body_lean`, off.

**SOURCE: what produces this, and what limits it.** B1's law draws `atan(a/g)` about the feet, held to grip. Your own
finding says what limits it: the chase and the player's controller both turn at about 1 g and more, so the law lays the body
down (45 degrees at grip 1.0, 63 at 2.0), and in a corridor the head goes about a metre to the inside, into the wall. Looked at
by me: your sheet 1 (main upright; the new lean at grip 1.0 with the head in the wall; at 2.0 nearly flat) and sheet 3.

## His words (verbatim in `briefs/dreamzone2_the_game.md`, items 214, 220, 159, 227)

- "the body should orient itself where it is trying go, like a bird or a space ship banking into a turn"
- "the player animation needs to look smooth from first person perspective, when the player looks down at their legs and
  body/arms, they should move how a real person would"
- "when the charater rubs up against a wall you see their arms and hands touch up against it as you move, the character must
  interact with the world dynamically too"
- "its not just for the hunter, but all mobs we will make and even the players character animations as seen from first person
  view, but also consistent from the outside as well."

## Ruled at the collation of B1

1. **B1 is accepted as built and lands behind its switch, off.** One function for every body, the feet stay, the view does not
   move: the rows say so. Your withdrawal of the D675 line ("63 to 75 where 51 is asked") is recorded.
2. **You were right not to scale the law to look better.** What follows is not a scale on the law; it is two limits the law
   lacks, and each has its reason.
3. **Forward lean stays per body until B4,** as you say.

## What to build, for every body, in the kind's row and the one function

1. **The lean yields to walls.** A body cannot put its head or shoulder through what is solid. Before the tip is drawn, the
   room to the inside at head and shoulder height is read from the world the stage already casts rays in, and the lean is held
   to what that room allows. This is the first piece of "the world pushes back" for the picture; hands on the wall come later
   (B6).
2. **A lean limit in the kind's row.** The law's output is held to the kind's own limit:
   - **the player's body: 15 degrees.** It is a human body, and your source S1 gives 10 to 15 degrees for a runner on a bend.
     The player's controller turns harder than a person can; the body does not pretend otherwise. His pick for the player's
     body is "Real first, stage where you ask" (`player_body-3`).
   - **a chaser: its own grip, as B1 has it.** The hunter's one raised ability is grip, and a lean deeper than a person's is
     how that shows.
   - Both are numbers in the row for his eye, not constants in the function.
3. **The player's body does not rock on straights.** The straights bar of L182 (0.5 sign changes a second) becomes a gate for
   the player's body. How is yours to choose and register before code: a dead band on small asked leans, or a filter of the
   simulation's own number. Not a filter of drawn positions. R2's timing must still hold. The hunter's rocking is left: it is
   the chase's sway, which pane A's weave replaces.
4. **The view can ride the head, on a dial that starts at nothing.** One world setting from 0 to 1: at 0 the camera is where it
   is today; at 1 its position is the drawn eye's. Position only; the view does not roll. Default 0. This is his item 162 as
   the path of record names it; at 0 nothing he sees changes.

## Rows, registered before code, each with its red

- **The head stays out of the wall:** at your staged corner, at grip 1.0, 1.3 and 2.0, no joint of the head, neck or
  shoulders is inside a solid. Red today with `body_lean` on (your sheet 1).
- **The limit holds:** the player's body never leans more than its row's limit on his run 20:29 and the flee bot's run; a
  chaser never more than `atan(grip)`.
- **The straights:** the player's body changes the sign of its lean at most 0.5 times a second on the straights of his run.
  Red today (1.35).
- **R2 still holds** for both bodies with all of the above on.
- **The dial:** at 0, the camera's position and direction on his run are the same to the bit as main's. At 1, the camera is
  at the drawn eye within 1 mm on every frame, and the view's direction is the same as at 0.
- **Print, for his eye and not a bar:** the gap from the camera to the drawn eye at his run's sharpest lean, with the
  player's limit, at dial 0 (it was 1.243 m at 45 degrees).
- **Picture only:** fingerprints the same; his kept runs replay the same.

## For his eye

Pane E's pair film is on the remote now (`e1-two-cameras-e` 45d299a; `dz-world --capture-pair`). With it:
- the player's body through a hard turn of his own run, first person beside outside, at dial 0 and at dial 1;
- the hunter at your staged corner at grip 1.0: main, B1 as built, and B1b with the wall holding it.
Pane E is building a film light and a staged chase tonight (`loop/packet_e2_films_for_his_eye_E_2026-11-14.md`); use them if
they are on the remote when you film, and say which you used.

## Registered with this packet

- **This lap is wrong if** the limit or the wall is put anywhere but the one function and the kind's row.
- **The unwelcome outcome, named now:** with the wall holding it, the hunter's lean in a 3 m corridor is so small that the
  bank he asked for cannot be seen. Then say so with the numbers; the answer is in pane A's root (the line it takes through
  a corridor), not in a bigger lean.

## Rules that hold

Trees and builds on G:. `node consonance/tools/heavy-run.js --status` before a heavy run. His words stay out of the game's
repository. `game/config/world.local.txt` is his. Pane B lands. One hand-back with its digest and a `BASE:` line, rung once.

## RULED at the collation of B1b (D, the night of 2026-11-14; `handback/p-b1b-lean-limits-C_2026-11-14.md`, read whole)

**B1b is accepted as built and lands switched off** (`b1b-lean-limits-c` 69a04e0; `body_lean` and `view_on_head` both 0). Your stop at the registered unwelcome outcome, with no further values searched, was right.

**The two things you asked a ruling on. Both go into the lap after F1, with the picture clock (B2), and neither is a gate tonight.**

1. **The player's straights.** Your three questions, answered in order:
   - The bar of 0.5 sign changes a second was the hunter's straights bar, carried over by me to a body whose path really weaves. It is withdrawn as a gate for the player's body. The row stays a report, and it reports the lean's size as well as its sign: the median and the 95th percentile of the drawn lean on the straights.
   - "Straight" stays as the row reads it today. Reading it from his input would change what the row is about.
   - The smoothing has a reason that is not a look: a body changes its lean over a step, not inside one. Its time constant is one step of the player's own stride at that speed, taken from the game's own stride rate now and from the picture clock when B2 gives one. That is one value, derived, not chosen from a list. Print the report with it and without.
   - What he sees on a straight is then his to judge from a film.
2. **The wall's pop.** A body sees a wall coming. The room the lean is held to is read ahead along the body's own velocity, far enough that the lean can come upright at the row's rate before the wall is in reach: the time is the row's limit over its rate. The hard clamp stays underneath for a wall that appears faster than that. The row: the head, neck and shoulders still never enter a surface; and the lean's fastest change on his run and the bot's is printed again, with the count of frames where the hard clamp acted. Your second way (a brief overlap) is not taken: it gives up the row you just made green.

**One finding of yours that changes the morning's launch line:** with `body_lean` on and `view_on_head` at 0, pane E's row "one pose, two cameras" is red by design, and at 1 it is green. So he is offered two lines, not one, and the choice is his: the camera riding the head (the two views agree, the view sways with the lean, up to 0.42 m at his run's sharpest turn), or the camera where it is today (the body leans out from under it).
