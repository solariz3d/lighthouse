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
