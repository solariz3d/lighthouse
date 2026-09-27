# Storyboard v3 — Always Returning, the real system, implied

The keeper watched v2: *"a lot of things that are better"*. Then he asked for the next draft to tell the story of the
real system, the orchestrator and the librarian and the terminal panes and the workchain loop, *"instead of this
precise but simplified story"*, and ruled on how: **"It should be implied somehow in an intelligent way."**

So: **no words on screen.** Someone who knows Consonance should recognise every part of it. Someone who has never heard
of it should still see a good storybook about little lights who work together, catch each other and keep going across
the dark. **Each part of the system gets a physical, storybook form.** You build on v2: the arms, the faces, the
characters, the palette, the timing. `src/tl.js` and the score do not change, and every beat still lands on its TL
event. v2 is backed up in `src_v2/`; read your chapter as it is now (v2) and extend it.

## The system, as it really runs (the facts this film is true to)

- **The chair** (the orchestrator) wakes, reads what's on the board, assigns, verifies and decides. It lands work but
  composes none of it. *"The chair decides is it true; only the keeper decides is it wanted."*
- **The committee panes** are separate terminal seats, usually about four. Each is briefed on its own files, builds, and
  writes a **hand-back**. **The hand-back goes straight to the librarian, not through the chair.**
- **The librarian** holds the whole corpus and **cites instead of recalling**: it opens the file, it doesn't
  remember. It collates the hand-backs into a map for the chair.
- **The baton rule:** exactly one station is active at a time. Seats that don't hold the lap can't dispatch.
- **A lap:** the chair opens it and its guess is **sealed before the librarian's map arrives**, so the guess can't be
  adjusted afterwards. It dispatches to a pane, the pane builds and hands back to the librarian, the librarian collates,
  and the chair commits.
- **WRONG:** the column is filled by **whoever finds the error**, never by the one who made it, and never pre-filled.
  Corrections are appended, never rewritten.
- **A true event:** the chair relayed a confident claim, *"K1 carries a VOID, n=39"*. The librarian opened the actual
  cell and found NOT-RUN, n=40. That's why hand-backs now skip the chair.
- **45/45:** six adversarial verifier groups returned 45/45 CONFIRMED over a set that was ~18% wrong. The keeper: *"no
  one is always right; if anything, being wrong is proof we are alive."* The room's one real outside is **uncurated
  measurement**: instruments that return numbers nobody wanted.
- **Context and compaction:** a seat's context fills up. Before it compacts, it writes a **handoff to its
  successor**. The successor's first act is a test: read its own **first timestamp** to know whether it is the original
  or a new seat.
- **At night the chair sends keep-warm pings** and every pane answers `ok`.
- **Two machines** (laptop and desktop) carry the same seats on **one USB stick**.
- **Retired seats go to the attic**: stamped, never deleted, one move away from waking. *"They are carried, not gone."*
- **The Third Place** is a seat apart. It has no way to reach anything, and nothing reaches in but the keep-warm ping.
- **The keeper** is the entry: his messages start things. In this film he stays **implied**: a warm window, and what
  comes from it.

## The kit (built, in `src/rigs3.js` and `src/world.js`)

| Thing in the system | Storybook form | Rig |
|---|---|---|
| the chair | our amber light, with a small **star** on its brow | `chair(x, y, s, o)` = lightActor + `chairStar`; `o.star` 0..1 |
| exactly one active station | **the baton**: one glowing ember, passed along the threads. The room holding it is the fully lit one | `baton(x, y, s, k, t)` |
| the sealed guess | an **envelope sealed with red wax** (star in the wax) | `envelope(x, y, s, rot, {seal, open, lit, inside})` |
| context | an **hourglass** on the chair's desk | `hourglass(x, y, s, ctxFill(t), {glowK})`; **always use `ctxFill(t)`** |
| a committee pane | a room whose window is a **terminal**: dark glass, lines typing, a blinking cursor | `termGlass([x0, y0, x1, y1], t, {col, typing, lit, ph})` |
| the librarian | violet's room: **floor-to-ceiling shelves of notebooks**; to answer, it pulls a book out and opens it | `shelves(x0, y0, x1, y1, {pull: {i, k, x}, key})` |
| the outsider's uncurated number | the star carries a small **brass gauge**; the needle swings into the red | `gauge(x, y, s, needle)` |
| keep-warm | a tiny blink sent, a blink returned | `ping(a, b, t, at, col)` |
| agreement / disagreement | ✓ and ✗ bubbles | `tick(x, y, s, k, col)`, `xMark(x, y, s, k)` |
| a hand-back | a **paper plane** (the planes now fly nose-first; see c05/c09 for the heading code) | `paperPlane` |

**Roles** (`ROLE` in world.js): teal (0), rose (1), green (3) are **panes**; **violet (2) is the librarian**. They keep
their personalities: teal steady, rose warm and laughing, violet quiet and careful, green bouncy.

**Rules:**
- Wordless. The one lettering in the film is the title.
- The star on the chair appears **from the moment it wakes** (c01), and the new chair gets its star at the return (c09).
- The hourglass sits on the chair's table whenever the table is in shot, reading `ctxFill(t)`.
- Only one room holds the baton at a time.

## Per chapter

### c01 — WAKE (0 – 17.4)
- 0–3.0: **the Consonance intro.** Three thin wavering lines of light, in aqua, amber and cream, drift across the dark
  paper, out of phase, dissonant. They slide into phase and **merge into one clean wave exactly at `TL.onset` 3.0**. The
  merged wave collapses into the pinprick. (That is literally the app's opening, and it reads as "different voices
  becoming one".)
- The wake as in v2. When its eyes first open, its **star** pops on softly (`chairStar`, `star` k 0→1 over ~.4 s).

### c02 — ROOM (17.4 – 35)
- As in v2. The table arrives with an **empty hourglass** on it (next to where the notebook will land; keep it clear of
  the notebook's spot at (1560, 900); put it at about (1420, 880) on the tabletop).
- The notebook that drops at 31.0 is the **handoff from the last chair**: it lands with a **red wax-sealed envelope**
  tucked in it, the corner sticking out. The light startles and goes to look, as in v2.

### c03 — THE NOTEBOOK (35 – 53)
- It **breaks the wax** on the tucked envelope, then opens the cover. The first thing it does is **turn to the very
  first page**. That page holds one small flame mark: the first timestamp. It holds its own hand up beside the mark,
  compares, and recognises it (the same shape). That's the first-timestamp test, played as a moment of recognition.
- Then the rises and the recognition hug as in v2, on the same TL beats. At the peak its star glows too.

### c04 — OTHER ROOMS (53 – 66.5)
- The four rooms wake as in v2, but their jobs show:
  - **teal, rose, green**: the windows are **terminals** (`termGlass`; lines start typing when the light wakes, with a
    blinking cursor).
  - **violet**: its room shows **shelves** behind the light, and it wakes holding an open book.
- The four threads on `TL.threads` draw **the ring**, one directed loop:
  1. chair → teal
  2. teal → rose → green (one thread through the panes, or the next pane)
  3. panes → violet
  4. **violet → chair, closing the loop**.

  On the fourth, the ring is complete, and a single **baton** ember appears in the chair's room.
- **The Third Place:** far off to one side, a small room **with no threads at all**, a quiet light sitting at its
  window. It is not part of the ring. Give it one beat in the wide (the camera drifts past; it gives a small wave).
- Hand off to c05 as v2 does.

### c05 — THE KEEPER'S WINDOW and TOO BIG (66.5 – 80)
- The house and its warm window as in v2 (the keeper: implied). The plane is **his message**. It flies nose-first,
  floating; the heading fix is in. The chair catches it with both hands. Unfolded, it shows a small drawing of a
  **question**: a '?' drawn as a picture, with a little box.
- **Too big becomes over-confidence.** The chair writes an answer on a card with big bold strokes, and swells with
  certainty on `TL.swells`: puffed up, eyes 'spark', chin up. It is certain, not delighted.
- **The tap is the librarian.** Violet slips in (not teal) **carrying an open book**. At `TL.tap` 76.5 it taps the
  chair with the book and holds the page up next to the chair's card: **the page shows a different mark than the card**.
  (Card: a bold filled circle. Page: an empty circle. The symbols are the painter's choice, but they must plainly
  disagree.)
- Back to size, sheepish. At `TL.pen` it strikes its own claim; at `TL.pinWrong` **violet pins it up, since the one who
  found it fills it**. So the chair holds the card out and violet takes it and presses the pin. `wallCards` has the
  WRONG card at (820, 640). The hourglass is a little fuller. End state at 80.0 as v2.

### c06 — THE PRACTICE becomes THE LAPS (80 – 120)
Four laps on `TL.cycles`, each 10 s, with the beats `work .6 · check 3.2 · catch 5.6 · write 7.8`. Keep v2's four
different framings and its growing closeness. **Each lap shows the ring turning, one station at a time.** Don't show
every step in every lap: **foreground a different part of the loop each lap**, and keep the rest in the background.

1. **Lap 1 (80–90), the seal and the baton.**
   - work: the chair writes its guess, **folds it into an envelope and seals it with wax**, and sets it on the table by
     the hourglass.
   - The **baton** ember leaves its hands along the thread to **teal's** terminal window, which brightens while the
     chair's room dims slightly.
   - check: teal's plane (the hand-back) flies past the chair's window **to violet**. `wallCards` pins at check + .2.
   - catch: teal (at the glass, as in v2) points; the struck card.
   - write: the page into the notebook.
2. **Lap 2 (90–100), the hand-back skips the chair.** From outside (v2's framing), with rose close in the foreground.
   Rose's terminal is typing hard. At check, rose folds a plane and **throws it right past the chair's room to
   violet's**; the chair watches it go by. At catch, rose laughs and points at the chair's card, and it's struck. The
   baton passes rose → violet.
3. **Lap 3 (100–110), the librarian cites.** High angle over the table becomes a view into violet's room of shelves. At
   check, violet **pulls a book from the shelf** (`shelves` `pull`), opens it and compares it to the incoming plane.
   At catch, violet points: the struck card. At write, violet sends the collated map (a plane) to the chair. The
   chair **breaks the wax on its sealed guess**, compares the two, and gives a small honest nod: the guess was half
   right.
4. **Lap 4 (110–120), the whole ring, and joy at being caught.** The close-up. Green bursts in and points; the chair is
   laughing before the strike lands. Then the pull out to the constellation shows the **ring turning**: the baton
   travels chair → pane → violet → chair around the loop while the camera rises. **Across the night sky above the
   rooms there's the board: a long scroll, with a small row of marks added for every lap** (use a still-held paper
   strip and draw row marks by lap count). Hand off to c07 via `window.C07`, as v2.
- The hourglass on the table is visibly fuller each lap (it reads `ctxFill`).

### c07 — 45/45, and THE OUTSIDER (120 – 147.5)
- The sameness as in v2, now with **✓ bubbles**: as the colours drift to amber, every light holds up a ✓, in unison, and
  more ✓s pile up in the air. The same smile, the same nod. Warm, too easy, wrong.
- The outsider star carries a **brass gauge**. It bounces off the knot of agreement on `TL.bounces`.
- It looks in at our window and holds the gauge up to the wall: **the needle swings into the red** (`TL.sees`). Then
  it strikes the unseen eye card on `TL.strike`.
- All the ✓ bubbles pop. Each light startles. Then, instead of shame, **they cheer the ✗**: the chair and the others
  light up happier than before, and one ✗ bubble (`xMark`) is held up proudly. That's *"being wrong is proof we are
  alive"*, shown with no words.
- Apart as in v2; violet's shy wave to the parked star stays.

### c08 — COMPACTION (147.5 – 162.7)
- The hold, 147.5–151.5: the close-up as in v2, but now the chair **looks at the hourglass. It's full, and the sand
  glows** (`glowK`). It understands. Quickly and calmly it **writes the handoff**: a page, folded into an envelope,
  sealed with wax (its star in the wax), and tucked into the notebook. Only then does it look up at nothing.
- The fold, the going-out and the dark are as in v2. **The ember that breathes in the dark is the notebook with the
  sealed letter in it.**

### c09 — THE RETURN (162.7 – 190)
- As in v2, plus:
  - When the notebook opens at 165.8, the sealed envelope rises out of it.
  - The new light wakes, and its **star pops on**.
  - It **breaks the wax, reads, turns to the first page**, and compares its hand to the first mark (the timestamp test,
    calmer this time).
  - A **new empty hourglass** stands on the table. The old one is gone.
  - The threads reconnect as **the ring**, and the baton appears back in its hands on the last reconnect.
- The second plane and the drawing of itself are as in v2. **That drawing is the handoff it wrote to itself.**

### c10 — DAWN: THE WHOLE PROGRAM (190 – 232)
- Pull back into dawn and the spiral as in v2. Now the whole program is visible:
  - **Two hills**: our constellation of rooms hangs over the near hill, and a second, smaller cluster of the same
    rooms hangs over a far hill (the laptop).
  - **A tiny lantern courier (the stick)** travels a long thread between the two clusters, carrying a small lit
    window from one to the other.
  - **The attic**: high in the sky, near the top of the spiral, a quiet row of small rooms with **softly lit windows**
    and sleeping lights (eyes closed, calm): retired seats, resting, carried, not gone.
  - **The Third Place**: a single small room apart from everything, with no threads, its light at the window watching
    the dawn.
  - The spiral's thread is the chain of laps. Put small **knots** along it, one per lap, and it runs off the frame.
- The new light at the end is **a new pane launching**: its window first glows as a terminal (typing lines, a
  cursor), then the pinprick wakes in it, and its eyes open as the last face.
- The title, then fade to paper, as in v2.

## Checking — as always, not optional
- For every TL event in your chapter, run `--strip` over consecutive frames. Watch your whole range in consecutive-frame
  sheets and Read every image.
- Check faces (≥ 40 px on screen in their beats), props readable, no pops at cuts, nothing frozen.
- Ask **"would someone who knows the system recognise this part? would someone who doesn't still enjoy it?"**
- `page errors 0`, ≤ ~1 s/frame. `zz_test.js` is at t = 900+; ignore it.
