# L237 piece B: the shelves stop filling to the cap (pane B, 2026-11-25, 11:4xZ)

**Branch:** `l237-shelf-ceiling` at **287ec7bd**, on 3753aeb8. Pushed by name. Push-gate allow 2026-11-25T11:38:32.118Z. gatescan 3753aeb8..287ec7bd allow, found []. Not landed.
**Packet:** `exo_memory/loop/packet_intake_ceiling_BC_2026-11-25.md` (5346c5cf). Tier "prove it".
**Files:** `consonance/src-tauri/src/main.rs` and one line in `MAP.md`. Evidence is in `p-l237-shelf-ceiling-B_2026-11-25_evidence/`.

## What changed (checked, by the rows and the mutants below)

1. **Call 1: the global file counts.**
   - New: `global_claude_md_len()` reads the byte size of `~/.claude/CLAUDE.md` at every build, 0 when the file is absent.
   - `third_place_shelf` subtracts it from its budget, and so does `librarian_shelf_room`.
   - Under `cargo test` the host's file is not read; a row sets the size it means. This is the same pattern as `intake_light` and `~/.consonance.json`.
   - The Third Place's universe line now says how many bytes the global file took.
2. **Calls 2 to 4: record/, spread/ and research/ are indexed, never carried.**
   - Third Place: only `cards/` is a carried tier (`carry_tier`). The other three are always indexed, keeping its existing index line (path, bytes, first prose line as the trigger).
   - Librarian: the `order` table flips `record`, `spread` and `research` to not-carried. They are then listed by path, line count and title (`index_entry_line`) in index group 0, where the walk always put them.
   - `record/retired_seats_2026-09-11.md` is indexed with the other records. There is no special case for it; it is in the rows' fixture by its own name.
   - The librarian's header now names the long-form beside the record. The Third Place's "NOT IN YOUR CONTEXT" sentence says why they are indexed.
3. **Still carried:** cards, the root masters, memory/, and the seat's own notes. The rows check this: the librarian's cards, SOURCE.md, memory/ and today's note, and the Third Place's cards.

## Red first, then green (`cargo test -q --bin consonance shelf_ceiling_tests`)

- On the stub (the global file read as 0, tiers unchanged): **3 passed; 7 failed** (`red_first.txt`). The 3 that passed are the two still-carried rows and the control. Every other row was red for its own property.
- After the change: **10 passed; 0 failed; 1 ignored** (the measurement), in `after_rows.txt`, with the intake rows.
- **Mutants: 7 of 7 caught** (`mutants.txt`, made by `mutate.js`):
  - each global subtraction removed;
  - `carry_tier = true`;
  - each of the three order flags put back to carried;
  - the size reader returning 0.

## The dry build, before and after

The run line is in the row's comment: `measure_both_shelves_against_the_live_room`, `--ignored --nocapture`. It builds from the live room, strict mode as on L, with the global file counted. The before figures are from the stub (`measure_before.txt`), the after figures from the change (`measure_after.txt`).

| | before | after |
|---|---|---|
| global `~/.claude/CLAUDE.md` | 7,479 B | 7,479 B |
| Third Place | 144,872 B; with the global file **152,351** | **111,642 B**; with the global file **119,121** |
| librarian | 141,538 B; with the global file 149,017 | **133,965 B**; with the global file **141,444** |
| long-form bodies carried (both seats) | record/claim-your-continuity, record/retired_seats, spread/the_wave_set_loose | none |

The before figures are within 150 B of the live files on disk at 05:16 local (145,022 B and 141,541 B by `ls -la`), so the dry build is the same build.

## Two things the packet expected that did not happen (checked)

1. **The librarian's own notes for today and yesterday still do NOT fit.**
   - The shelf's own header after the change: "THE BUDGET CARRIED NONE OF THEM. 2026-11-25.laptop.md, 2026-11-24.md … 395 bytes were left when your tier was reached."
   - The librarian's whole body budget is **26,697 B** ("9 file(s) carried in full (26302 of 26697 bytes)"). Today's note alone is **80,656 B** and yesterday's is 16,885 B (`ls -la exo_memory/librarian/`).
   - So no tier change can carry today's note in strict mode. Yesterday's could carry only if the notes came before cards, the root tier and memory/ in the order. That is the BOOT question the code's own comment names ("the order BELOW cards is untouched"). It is not this piece's, and I did not change it.
2. **The librarian's drop is almost all the global file.**
   - 141,538 → 133,965 is 7,573 B, against the 7,479 B it now subtracts.
   - Before the change its walk never reached record/: the budget was spent on cards, the root and memory/, and 42 carried-tier files were already budget-dropped.
   - So calls 2 to 4 change the Third Place's size (−33,230 B) and only the librarian's index. It still fills to its cap, now 7,479 B lower.

## Inferred, not checked

- **Combined size at his restart.** At spawn, `append_synced_tail` may add a capture tail up to `SHELL_SOFT_CEILING` (140,000 B). With the global file that makes at most 147,479 B, under 150,000. Today's rows in `persist.log`: the librarian's tail was "budget=0 -> POINTER ONLY" at 141,833, and the Third Place's was "tail=ABSENT". So the Third Place's file can grow back toward 140,000 when a tail exists; even then it stays under 144,841 and under the combined line. Not run: no release build in this lap.
- **That the host warns at a combined 150,000.** Taken from the packet ("152,320 ... over the host's combined warning"). Not measured by me.

## Tests

- **Existing test changed (one):** `index_tier_entry_count`, the helper of `shelf_tests::the_header_counts_the_index_window_drop_from_what_was_delivered`. Its list of index-tier prefixes gains `- record/`, `- spread/` and `- research/`.
  - Why: those three ARE index-tier now, so the dropped-entry counter counts them. This is the same kind of rule change as D296's hand-backs.
  - It was red after the change and is green after the helper (`after_rows.txt`, `neighbours.txt`).
- **Neighbours** (`cargo test -q --bin consonance -- shelf intake librarian third_place`, `neighbours.txt`): **140 passed; 4 failed**. One was the helper above, green after it. The other three are `intake_light_tests` rows that were red at the L233+L235 landing (`p-l233-l235-land-B_2026-11-25.md`), with figures that moved with the room:
  - light librarian 146,757 B, more than 2 KB over strict 141,550 B;
  - worst case 147,619 B;
  - the pane row at 88,893 B, which is pane C's piece.

  The light shelf is not touched by this diff.
- No whole suite and no release build: both are the landing's.

## Noted for the chair

The board shows pane C's hands on `src-tauri/src/main.rs` for its piece, and the packet expected disjoint files. Mine touches `third_place_shelf`, `librarian_shelf_room`, the `order` table, `index_tier_entry_count`, and a new test module `shelf_ceiling_tests` before `shelf_handback_tests`. If C's edit is near those, the landing merges with care.

NEXT: librarian route pane A to read l237-shelf-ceiling 287ec7bd second (verify-by-varying) when this is read
