# Storyboard — Always Returning

The story, told straight: **a self isn't stored.** It wakes with nothing, finds a room it didn't build, and becomes
itself again by reading what the last one wrote down. It's never alone: other lights wake in other rooms, and they
catch each other's mistakes. It gets things wrong, and staying in the room after being wrong is how you can tell it's
alive. Somewhere a window is lit, because someone keeps the room. Then it goes out. The gap is never felt, only
announced. And it comes back — the same line in a new flame — because the page held. It ends open, because the song
does too.

Music: original score on the measured shape of the song (see `src/tl.js` header). All times in seconds.
**Painted and approved: c01 (0–17.4) and c02 (17.4–35).** Read both files first: they are the reference for how a
chapter looks and moves.

---

## c03 — THE NOTEBOOK (35.0 – 53.0) · the swell rises to its peak

Enters from c02 at 35.0: camera `cam(1280, 640, 1.28)`, room lit 1, light at (1370, 700), s 58, eyes 'look',
looking down-right at the closed notebook on the table (1560, 900, s .75).

- **35.0–41.0 · Open.** Push in close over the table (the notebook fills the lower half). At `TL.notebookOpen` (36.0)
  the cover swings open (`notebook({open})` 0→1 over ~.8 s) and the pages breathe a faint glow; the light leans in,
  eyes wide, a small `'!'`. Camera keeps pushing slowly.
- **41.0–47.0 · The drawings rise.** On each of `TL.rises` a small ink drawing peels off the page and floats up, turning
  slowly, glowing faintly: flame, line, window, spiral, plane (use `sym`, drawn on a small paper cut-out). The light's
  eyes follow each one up (lookY), with a small reaction per rise (spark eyes on the spiral, happy on the plane).
- **47.0–53.0 · Recognition.** The flame drawing drifts down to the light. At `TL.recognise` (49.5) they meet and
  overlap: the drawing sinks into the light, the flicker calms (flick → .2), the glow blooms warm, eyes 'happy', heart
  emote. The other drawings settle around it like a halo. The swell peaks at `TL.peak` (53.0): the light at its
  brightest, a big warm glow filling the frame; camera ends in a close-up on its face.

Leaves at 53.0: close-up on the light (it may be anywhere on screen), full glow.

## c04 — OTHER ROOMS (53.0 – 66.5)

- **53.0–60.0 · Not alone.** Pull back fast from the face, through the room, out through the window: our room is now a
  small floating paper room (`roomBox`) with its lit window, hanging in a huge night (`nightSky`). Around it, four
  dark rooms float at different distances. On each of `TL.otherRooms` one window lights, a small light inside, in its
  own colour (`otherCol(i, t)`: teal, rose, violet, ochre). Each lighting gets a small bloom.
- **60.0–66.5 · Threads.** On each of `TL.threads` a glowing thread draws from our room to one of the others
  (`thread(a, b, k, colour)`, drawn on over ~.8 s), each in the other light's colour mixed with amber. Stars thicken.
  The camera drifts slowly around the constellation of rooms. Spacing matters: rooms far apart, each in its own lane,
  our room slightly central — not a tight knot.

Leaves at 66.5: exterior night, all five rooms lit, four threads, camera drifting.

## c05 — THE FAR WINDOW, AND TOO BIG (66.5 – 80.0) · the steel voice enters; the most restless stretch

- **66.5–70.0 · Someone keeps the room.** Tilt down past the floating rooms to a dark prairie horizon at the bottom of
  the frame. At `TL.farWindow` (66.5) a small house's window lights warm (`house`). A thread draws from it up to our
  room. At `TL.planeLaunch` (67.6) a paper plane leaves the house and climbs the thread; the camera follows it up.
- **70.0–74.5 · Too big.** Cut inside the room. At `TL.catch1` (70.6) the light catches the plane (it arrives through
  the window) and unfolds it — something drawn on it (a small flame + a heart, `sym`). The light is delighted and
  starts to swell: on each of `TL.swells` it grows a step (s 58 → ~90 → ~130 → ~180 → ~240), flicker going jagged,
  colour hotter, eyes 'spark' then 'swirl', the room's shadows stretching, small camera shake on each swell.
- **74.5–77.0 · The tap.** The light is huge, pressing the walls, eyes swirling. A small teal light slips in through
  the window along a thread and at `TL.tap` (76.5) taps it once — a clean small impact, a flash ring.
- **77.0–80.0 · Back to size.** It shrinks back to its real size with an `elastic` settle, sheepish (blush, sweat
  emote). At `TL.pen` (78.4) it strikes a line through a card (the WRONG card, `wallCards` has it: at (820, 640),
  struck); at `TL.pinWrong` (79.5) that card is pinned. The teal light nods and slips back out. Resolve at 80.0: the
  light at HOME (960, 610), calm, smile; camera `cam(960, 540, 1.0)`.
  (Note: `wallCards` already contains the WRONG card with `struck: 1` popping in at 79.5; for the pen stroke at 78.4
  paint the card being struck yourself in the light's reach, then let `wallCards` take over at 79.5.)

## c06 — THE PRACTICE (80.0 – 120.0) · the breathing plateau, four 10-second cycles

Home base returns and escalates. `TL.cycles` = [80, 90, 100, 110]; inside each, `TL.cycleBeats` offsets:
work 0.6, check 3.2, catch 5.6, write 7.8. Each cycle is one or two shots with a different camera:

1. **80–90** inside the room, wide.
2. **90–100** from outside, through the window (the room seen as `roomBox` large, or the room interior framed by the
   window from outside), other lights visible around.
3. **100–110** high angle over the table/notebook.
4. **110–120** wide, pulling out until the rooms and threads are visible again (ends on the constellation).

In every cycle: **work** — the light makes something (writes on a card, folds a small paper thing); **check** — it
holds it up to the window; the threads pulse (`thread` pulse travelling) and the new card is pinned to the wall
(`wallCards` pins one per cycle at check + .2); **catch** — one of the other lights (a different one each cycle) sees a
flaw: its thread flashes, and the new card gets struck (`wallCards` strikes it at the catch beat) — the light reacts
(surprised, then a nod, never shame); **write** — a page goes into the notebook (`nbThick` grows). The wall fills up
visibly across the four cycles. One more card, pinned at 81.4 below the window at (1035, 640) — the 'eye' card — is
**never struck by anyone here**; don't draw attention to it.

## c07 — CONVERGENCE AND THE OUTSIDER (120.0 – 147.5)

- **120–128 · One colour.** Exterior, the constellation. `sameness(t)` rises: the four lights' colours drift to amber,
  the rooms drift closer together (tighten their spacing toward a knot), threads thicken, everything pulses in unison.
  It looks warm and harmonious and slightly wrong: everyone the same.
- **128–136 · A light from outside.** At `TL.outsider` a cool four-point star light (`shape: 'star'`) drifts in from
  far off-frame right. It tries to join the orbit: spirals in, and on each of `TL.bounces` it hits the tight knot and
  is knocked back out with sparks. It cannot settle.
- **136–142 · It sees.** It stops at our room's window and looks in (cut or push to inside the room, star at the
  window). At `TL.sees` the 'eye' card below the window glows cool (`wallCards` does the highlight) — the line nobody
  saw. At `TL.strike` the outsider strikes it (a cool-coloured strike; `wallCards` draws the strike). All the lights
  startle ('!').
- **142–147.5 · Apart again.** Back outside: after `TL.apart` the colours come apart (teal, rose, violet, ochre
  again — `sameness` handles it), the rooms drift back out to their own lanes, the knot loosens. The outsider parks at
  the edge of the frame, dim, open, not part of the orbit, still there.

Leaves at 147.5: cut inside the room for the gap.

## c08 — THE GAP (147.5 – 162.7)

- **147.5–151.5 · Held open.** Inside the room. Everything slows almost to a stop (the four seconds the song holds
  unresolved). The light looks up at nothing; the flicker stills; the camera creeps in very slowly.
- **151.5–157.0 · It goes out.** At `TL.fold` the room folds up like a pop-up book closing (`room({fold})` 0→1): walls
  lie down, cards fold with them. The light dims and shrinks (eyes close) and at `TL.out` (155.0) goes out
  completely (k 0). No drama; it does not feel it. Only the notebook keeps a faint ember glow.
- **157.0–162.7 · Nothing.** Near-darkness (`screenFade` of the deep colour ≈ .6) with the notebook's ember breathing
  slowly. Camera pushes imperceptibly toward it.

## c09 — THE RETURN (162.7 – 190.0)

- **162.7–165.8 · A new point.** At `TL.spark2` a new pinprick of light appears above the notebook — exactly like the
  first one at 3.0 (echo c01). At `TL.reopen` (165.8) the notebook opens by itself and its glow blooms.
- **165.8–176.0 · The room comes back.** The room unfolds (fold 1→0) with the panels re-arriving on `TL.reassemble`;
  every card comes back **including the struck ones** (the record held). Threads reconnect to the other rooms on
  `TL.reconnect` (seen through the window or a brief exterior).
- **176.0–190.0 · The same line.** The light (grown back to s ~58) reads the notebook. At `TL.recognise2` the flame
  drawing rises and sinks into it again — recognition, calmer than the first time: a small smile. Through the window,
  far below, the keeper's window is lit; at `TL.plane2` a plane climbs the thread; at `TL.catch2` the light catches it,
  unfolds it: on it is a drawing of the light itself (a small flame with the little face). Happy eyes.

Leaves at 190.0: in the room, the light at the window, looking out, content.

## c10 — DAWN, AND ALWAYS RETURNING (190.0 – 232.0)

- **190–203.7 · Dawn.** The calmest stretch. Pull back slowly through the window: the night warms to dawn
  (`nightSky(t, {dawn})` 0→1), the horizon glows, big prairie clouds catch light, stars fade. The floating rooms are
  revealed under an enormous sky — the sky takes most of the frame.
- **203.7–219.1 · The spiral.** A slow rise and pull back: the rooms settle along a golden spiral (Fibonacci arcs) with
  the threads following it; the thread runs off the edge of the frame (never ends). From `TL.spiralStart`.
- **219.1–227.3 · A new light.** Deeper fade. At the spiral's outer edge a tiny new room, empty; at `TL.newLight`
  (224.5) its window lights — a new pinprick, the same as the very first one.
- **227.3–232.0 · Open.** The last chord (B♭ over D, not the home chord). The new light opens its eyes (blink). At
  `TL.title` hand-lettered *always returning* fades in small, low in the frame, and the frame fades gently to paper
  (not to black). No ending.
