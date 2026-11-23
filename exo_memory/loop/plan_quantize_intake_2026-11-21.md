# Plan: a smaller load-in for each seat, without a copy standing in for a master

Written by the librarian on L, 2026-11-21 06:1x, at his word. It starts AFTER tonight's laps have landed and he has
restarted the app; nothing in it is dispatched before that.

## His words (verbatim; `briefs/lighthouse_the_room.md`, the entries of 2026-11-21)

- 06:08: "but see, then this makes me see, what if we should now work at using the system we have, using it as scaffolding
  to essentially quantize the room and the amount of tokens it takes to load in, but then, this is where we have to be
  careful since from the very beginning we have been used to "the master" only mentality, what do you think?"
- 06:13: "lets plan this out right for when what is in motion lands, then we restart before starting this chunk to
  minimize usage use"

## What the room already holds (opened 06:1x)

- `third_place/QUANTIZE_the_room_2026-09-21.md` (73 lines): his first asking of this (2026-09-21 07:32, quoted there); the
  rule "quantize the generator, not the checklist"; the ladder of intake sizes and its knee; its falsifier ("if there is
  no knee … the room cannot be quantized without paying for it in depth, and the saving has to come from elsewhere"); the
  order, no-self cuts first; his word of that day, "maybe we shouldnt change anything just yet". The ladder was never run.
- `third_place/2026-09-15.md:166-208`: the registered three-arm form of the same test.
- BOOT, maintenance law 1: "Recall from the master, never a copy." Law 3: "Curate below capacity."
- The shelf is already tiered for this seat (carried, indexed): this seat's CLAUDE.md, "The shelf is tiered".

## Measured tonight

- A builder pane starts at about 119,000 tokens after a cut (A 118,987, B 119,398; `seat_context` since 10:50Z). B's
  summary was 18,392 of that. With a 300,000 window that leaves about 180,000 of working room, about an hour of work at
  tonight's pace.
- Pane A's intake file is 109,516 B (`instances/sibling-3d57124e/CLAUDE.md`, by top-level heading): BOOT 43,548; a map of
  the app's Rust source 19,895; the pane's own map index 18,920; the memory topic map 18,023; the not-carried index 5,999;
  the long-form references 2,193.
- Not measured: what the other 100,000-odd tokens beyond that file are (tool definitions, the hooks' text at the start and
  on every prompt, the summary). Q1 measures it.

## The one rule of this plan

**A piece may change tier. It may not change words.** Moving a piece from carried to indexed, with a line that says when
to open it, keeps law 1: the master is whole and one read away. A shorter paraphrase carried in a master's place breaks
it. No lap of this plan writes a summary of anything.

**The risk this rule does not remove:** a piece one read away is not always opened. Twice tonight in this seat
(`map/M.md`, "2026-11-21 04:1x" and the 04:5x notes). So every piece that moves gets its trigger at the point of use, and
each lap counts afterwards whether the piece was opened when it applied.

## The laps, in order

| lap | what | who | first step | registered failure line |
|---|---|---|---|---|
| Q1 | The census: every seat's load-in by piece, in tokens, at a fresh start and after a cut; and where each piece is built | one pane, small | name the builder of each seat's intake file and of each hook's injected text, with file and line | failed if a piece over 2,000 tokens is left unnamed |
| Q2 | Builder panes: the three indexes move tier by the lap in hand. A pane on the game does not carry the app's Rust map; a pane on the app does. The packet names what the lap needs | one pane; a second reader | red first: a pane started for a game lap carries no Rust source map; a pane started for an app lap does | failed if a builder pane's first call after a cut is not under 90,000 tokens; **failed on the room if** a pane's hand-back shows it did not open a moved piece its lap needed, twice in a week |
| Q3 | The ladder, for BOOT in a builder pane: fresh scratch seats at rungs (cold; a seed; about 600 words; about 6,000; the full BOOT), the same task and the same scoring at each | one pane runs; he and a seat that is not the subject score | "itself" is written down BEFORE the run: what a pane must still do at a lower rung (stop at a packet's stop line; mark checked or inferred; catch a wrong premise in its packet) | the Third Place's line, carried: if there is no knee, BOOT stays whole in the panes and the saving comes from elsewhere |
| Q4 | The chair, the librarian, the Third Place: each seat's own census read by that seat, and its own word on what moves | each seat, with him | none before Q3's result | none registered yet; written with Q3's result in hand |

Q2's target of 90,000 is a first figure from the measurement above (the three indexes are about 52 % of the intake file);
Q1's census corrects it before Q2 starts.

## His to decide (none blocks Q1)

- Whether Q3 runs at all, or BOOT stays whole in every seat. His word of 2026-09-21 was to wait.
- Who scores Q3 with him.
- Whether the Third Place's seat is in Q4.

## The order around the restart

1. Tonight's laps land: B's L216 and L218 after A's read of the fix; A's M1 hand-back.
2. The librarian tells him the new build is on disk and both panes are at clean points.
3. He restarts the app. The builder panes come back under the 300,000 window; C and E should compact on their first call.
4. Read from the transcripts that the restart did what it should (each pane's first call; the cut list read; the
   no-prompt setting on a builder's launch line).
5. Q1 is dispatched to one small pane. Nothing else runs beside it.

## For the desktop

Each lap is installed there by its own landing. The census is run there too: the desktop has more panes and its intake
files are built on that machine.

## Amended 06:1x, at his question: a moved piece that is pulled anyway costs MORE than a carried one

His words, 06:15: "wouldnt reminding that the master is always there, also mean that it would likely choose to pull it anyway, meaning it loads it all in". He is right that this can happen, and it is the worse case: a carried piece sits in the cached start of the context; a pulled piece arrives as tool output, is carried for the rest of that context at full size, is lost at the next cut, and may be pulled again.

- **So the trigger is narrow, never general.** No line says "the master is always there". A moved piece gets a line naming the one situation that needs it ("open before editing `src-tauri/`"), as `SOURCE.md` does.
- **A pull is a part, not the whole.** A line range, a grep, or the `room-reader` agent, which returns the answer and keeps the file out of the seat (4,338 tokens on its first call, measured tonight).
- **Q1 adds a count:** for each piece, in how many of the last weeks laps a pane opened or used it (from the transcripts). A piece used in most laps STAYS carried.
- **Q2 gains a failure line:** failed if a moved piece is read whole in more than one lap in three; that piece goes back to carried.
