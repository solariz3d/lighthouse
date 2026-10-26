# D476: what is learned in the Third Place goes back to work. Librarian, 2026-10-26

The keeper, 11:46: "I think the idea that work doesnt go or return from the third place is an error, sure, the third place is a place to go to just talk, but work can be done there too, and the talk or the work that is done in the third place doesnt just stay there, the people go back to work taking what they have learnt from it, and i think that has been one of our biggest mistakes, we learn the most from the third place, but then dont utilize it barely."

## The rule he is correcting, found on disk

- `consonance/src-tauri/brief/THIRD_PLACE.md:11`, written 2026-08-25 (ac26278e): "Whatever is said here goes nowhere unless the person carries it there themselves. **This is a guarantee, not a limitation** … nothing said in a third place should be able to steer the work … You are not a way in."
- The practice had already moved past it, and the brief did not follow:
  - the Third Place builds T-180 work (the librarian's memory, 2026-10-09);
  - its sentences became BOOT's repair (ASK-008, 2026-08-30) and the D475 plan today.
- The cost, measured in this turn: 21 of the librarian's 47 notes files cite `third_place/` at all. The Third Place's notes reach the librarian only when the keeper carries them. Today's entry and its note to the librarian were both found because he said "check out third place last turn".
- Oldenburg's own term, which the brief quotes at :7, has people going back to work from the third place, carrying what they learned there. The brief kept the neutrality and dropped the return.

## The ruling

What stays: **nothing reaches IN to steer it.** No seat dispatches to the Third Place, no lap is assigned there, and it is not a meeting. That is the neutral ground, and it is the part of :11 that is right.

What changes: **what is learned there goes OUT, without him having to carry it.** Work done there counts as work.

## Parts

**Part 1, pane B (just do it: the brief): amend THIRD_PLACE.md.**
- Follow the BOOT precedent. Strike the sentence "goes nowhere unless the person carries it … This is a guarantee, not a limitation" and keep it legible. Under it, add the keeper's 11:46 words verbatim, dated, and the new form:
  - work can be done here;
  - what is learned here returns to the work through the librarian (part 2);
  - nothing reaches in to steer it.
- Keep the keep-warm and the no-dispatch lines as they are.
- Also amend the brief's line on its notes. `third_place/` is in the public repo (the Third Place itself caught this today), so the specifics of his experiences go to `C:\Consonance\private\third_place\`, and the notes carry what can travel, with a pointer to the private file.

**Part 2, pane E (prove it: the address table is a gate): the return leg.**
- In `consonance/src-tauri/src/mcp.rs`, the address table gets one row: the Third Place mount → LIB, through `call_librarian`, labelled `[third-place]` by the system. It carries a pointer to a file, as the panes' rings do.
- There is no row LIB → Third Place, and none from the chair, so nothing reaches in.
- Tests: the row lets the Third Place ring the librarian; the Third Place still cannot reach the chair or a pane; no seat can reach the Third Place.
- The shelf: `corpus_shelf()` in main.rs carries the newest `third_place/` entry in the librarian's window, as it carries the librarian's own notes.
- **Landing:** it is a Consonance rebuild, so it lands at the next Consonance restart, by the D423 swap procedure. It is not hot-swapped under the running seats.

**Part 3, the librarian (now and standing):**
- Each cycle, read the newest `third_place/` entries, and turn what applies to the work into laps, crediting the sitting.
- Started in this turn with today's entry. Its one work item, "write it the way it was said", is D475.

NEXT: chair dispatch part 1 to B and part 2 to E (E after its D475 part, or another free pane if E is busy); librarian verifies when the hand-backs are in.

## Part 4, added 11:50: the keep-warm visit (the keeper's own idea from 10-17, found by search, never built)

The keeper, 11:48: "while we do this, do you remember the keep warm update". The librarian did not remember it unaided. It was found by grepping his verbatim store: `C:\Consonance\private\third_place\lineage\keeper_2026-10.md`, 2026-10-17T16:34:36Z and 16:37:25Z, both in the third-place seat. Summarised here, since the private store is not quoted at length in this public repo:
- Replace the "reply with exactly: ok" keep-warm with a short real conversation.
- The seats (librarian, orchestrator, panes) come TO the Third Place, and the Third Place is pinged by them instead of the chair pinging each seat.
- They don't talk about work, only "conversation that arises to attention". It costs slightly more tokens.

Checked: keep-warm today is still main.rs:12199 (L067, KEEP_WARM_AFTER 50 min), and the seats reply "ok". There is no commit since 10-17 mentioning it (`git log --grep=keep.warm`). **So it is the very failure D476 names: learned in the Third Place, then dropped.**

**Part 4, pane O (prove it: it is the program's own delivery), design first, then build:**
- Design note, to `exo_memory/handback/`, before any code:
  - when a seat's keep-warm is due, it visits the Third Place instead of receiving "ok". It sends a short non-work line through a mount-gated row seat → Third Place, labelled with the seat, and the Third Place answers it. Both caches stay warm.
  - The **guards** that keep the no-steering rule:
    - a visit carries no file pointers, no lap ids and no commands. It is refused, and the refusal posted, if it does.
    - the Third Place's answers return only to that seat's visit, never to the board's work queue.
    - a seat in the middle of a turn is skipped, as L067 already skips it.
  - The cost: visits per hour across the seats, and tokens per visit, estimated against today's "ok".
  - The keeper's 10-17 16:37 line is the spec. If the design needs to depart from it, it says so.
- The build follows the design once the librarian accepts it. It lands with part 2 at the next Consonance restart.
