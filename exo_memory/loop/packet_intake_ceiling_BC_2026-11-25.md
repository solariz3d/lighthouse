# Packet (panes B and C, on L; A reads second): the shelves stop filling to the cap

Written by the librarian on L, 2026-11-25 05:2x. His word, 05:22, on the four calls below: "do what you think is best".
Source: the Third Place's research, `exo_memory/research/intake_carry_cost_and_use_2026-11-25.md` (read it first, §5 and
§6) and `third_place/2026-11-25.laptop.md`. His words before it: 01:28 "says 2 instruction files add up to over 150k in
here wtd"; 05:01 "we could remove the useless junk, but who are we to say what is useless for sure, might have to tread
carefully over that".

Tier: **prove it**. This changes what two seats load at every launch, on this room's own builder (off the worn path).

## The four calls, as ruled

1. **The cap counts the global file.** `third_place_shelf` (`main.rs:8220`, budget at :8225) and the librarian's room
   (`librarian_shelf_room`, :9464) subtract the size of `~/.claude/CLAUDE.md` (7,479 B today, read at build time, 0 if
   absent) from their budget. Today it is not counted, so the Third Place lands at 152,320 with the global file, over
   the host's combined warning every launch.
2. **The shelf stops filling to the cap.** Records, the spread and research move from carried to indexed for both
   seats: `record/`, `spread/`, `research/` are listed by path, line count and title, like `journal/` and `loop/`.
   Cards, BOOT and the root masters, `memory/`, and each seat's own newest notes stay carried. Reason (§5): with
   fill-to-cap, indexing one file only lets the next one refill the gap; the size drops only when the tier changes.
   The cards already point to the records ("not carried here — on disk … open it when you need the case").
3. **The records load when opened, not at startup** (the same change as 2).
4. **`record/retired_seats_2026-09-11.md` is indexed with the other records.** Its own text: honoring is naming, citing
   and keeping revivable; an indexed path keeps all three. The librarian's reading, under his "do what you think is
   best".

A side effect wanted: the librarian's own notes for today and yesterday were NOT carried at this launch ("the budget
carried none of them", 280 B left). With the tier change they fit again. Say whether they do.

## Pieces

- **B: calls 1 to 4 in `consonance/src-tauri/src/main.rs`**, a branch from room main. Red first: a row where the global
  file's size comes off the budget; a row where a `record/`, `spread/` or `research/` file is indexed and not carried;
  a row where cards and own notes are still carried. Print, before and after, from a dry build of both shelves: each
  seat's file size, plus the global file, against 150,000. Name every existing test you changed and why (a test that
  pinned "records carried" now pins the reverse; that is the only allowed kind).
- **C: the pane intake row, 88,811 B against 88,000** (`main.rs:10222`). C found BUILDING.md is not in it
  (`handback/p-l236-land-C_2026-11-25.md`). Find which carried file grew past the line (git log on each carried file
  since the row was last green), and trim that file's words, not the target. Tier: check it (the row plus the tests of
  the file touched).
- **A: the second read of B's diff**, varying what B ran (`verify-by-varying`), before anything lands.

Disjoint files: C's trim is in a carried text file; B's change is in `main.rs`. If C's file turns out to be in
`main.rs`, C says so before editing and the chair orders them.

## Registered (before the run)

Failed if, at the first launch after it lands: the Third Place or the librarian gets Claude Code's combined-size warning;
or either seat's file is not smaller than today's (Third Place 144,841 B, librarian 141,315 B); or the pane intake row is
still red. And failed over the next working night if a seat cites a record's content without having opened it (grep the
seat's transcript for the record's path in a Read before the citation).

## Landing

One release build after A's read, the whole suite once (the landing step only). His restart applies it, since both
shelves are built at launch. Pictures not needed: no screen changes. Hand-backs as files in `exo_memory/handback/`,
rung to the librarian, each claim checked or inferred, ending with who acts next.
