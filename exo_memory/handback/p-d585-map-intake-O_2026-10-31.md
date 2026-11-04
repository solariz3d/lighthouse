# D585: the map travels with the packet (pane O, check it)

**Brief:** the chair's ring of 2026-10-31T15:06:40Z. Plan: `exo_memory/loop/plan_consonance_learns_from_the_reader_2026-10-30.md` Part 2, read whole.

**The change:** lighthouse branch **d585-o at `83b7d1af`** (off origin/main `e80b2af7`).
- **Paths touched:** `consonance/src-tauri/src/main.rs`, `consonance/src-tauri/brief/BUILDING.md`, `consonance/src-tauri/src/MAP.md`.
- **Not touched:** `mcp.rs` (E's Part 3).
- **No exe rebuild or swap:** that waits for his restart word (D507). Until then no seat wakes with this.

## What a pane now wakes with

**The packet:**
- It is the newest `[chair:MAIN]` record in the pane's own capture (`capture_text_path(pane)`), the one a respawned or resumed pane is working on.
- It is cut at its `[sent …]` stamp, so the pane's own reply is not read as the packet (`latest_packet`).

**The repositories it names** (`packet_repo_maps`), found from the packet, never from this machine's layout:
- **Every absolute path in the packet** (`C:\…`, `C:/…`, or Git Bash `/c/…`; `packet_paths`) is walked up to a checkout root:
  - lighthouse: `consonance/src-tauri/src/MAP.md` beside `exo_memory/`;
  - t180: a root `MAP.md` beside `src/core/` and `app/`.
- **The word "lighthouse" with no such path** means this repository (`repo_root()`).
- **The word "t180" with no checkout path is SAID in a note, not guessed.** Nothing in Consonance knows where a t180 checkout is, and a guessed path is the defect `repo_root`'s own comment describes.

**The section** (`repo_map_section`, placed by `assemble_intake_for`):
- It is headed "**The map of what you are about to change**" and placed **ahead of the deck**.
- **Each map rides WHOLE,** or, when it does not fit, **as a path line** ("one Read away, whole"), as a card does.
- **The seating:** the maps are seated first in the optional budget, and the deck and committee brief are seated in what is left. They have their own seating, not a place at the head of `fit_optional`'s list: that seats a prefix, so an indivisible map at its head would have indexed every card after it.

**Where it is wired:** `intake_with_map` (the one assembly both `resumed_intake` and `warm_resume_brief` use) calls `packet_maps_for(pane)` and passes the maps in. `assemble_intake_within(reserve)` keeps its signature for its other callers (the housed seats, `assemble_intake`) and is now `assemble_intake_for(reserve, &[], &[])`: no packet, no section.

## The template rule

`consonance/src-tauri/brief/BUILDING.md`, "What a dispatch carries", **item 9**: every "where" in a packet is an anchor in that repository's code map, or a path the librarian supplied, never the chair's memory; and a packet for a repository names its checkout by path.
- **The Why** cites Part 2, the outside reader's point 4 and the 115-that-was-70.
- **What it says the wake does:** reads the checkout from the packet's paths, so a t180 packet with no path wakes with a note instead of the map.
- **The plan's falsifier:** three laps on, packets still carry "where" lines with no anchor.

## Tests (check it)

checked: `cargo test --bin consonance -- repo_map_tests intake fork_note` in the d585-o crate, under the heavy-run lock, BelowNormal → **48 passed, 0 failed, 2 ignored** (`S\d585\test-maps.out`; `S` = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-36313935\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`).
- That run is the 8 new `repo_map_tests` plus every test whose name contains `intake` or `fork_note`.
- **The 8 new rows, in `repo_map_tests`:**
  - the packet is the newest chair record, cut at its sent stamp;
  - paths in all three spellings, and no false path in a ratio or a URL;
  - paths inside both kinds of checkout bring both maps, in the packet's order, each once;
  - "lighthouse" with no path means this repository, and with no root nothing is guessed;
  - "t180" with no path gives the note;
  - a packet naming nothing spends nothing;
  - a map that fits rides whole, one that does not is a path line;
  - the assembled intake carries the section ahead of the deck, and none without maps.
- **One existing test amended by name:** `fork_note_tests::the_intake_cuts_the_note_from_the_bundled_brief_after_the_header_and_before_the_room` reads the intake's SOURCE by slicing `fn assemble_intake_within(`. The body moved into `assemble_intake_for`, so the slice follows it, with an `AMENDED (D585 …)` comment. The rule it reads is unchanged. **It went red on my change first, and is green after.**
- **`cargo check --tests`:** clean of new warnings (one `unused mut` of mine, removed); the six other warnings are older.

## What this does not do, said before anyone relies on it

- **It is the WAKE, not the delivery.** A pane that is alive when its packet is injected gets the map at its next wake (a respawn, a resume or a warm resume), not at the inject. Carrying it at delivery is the drain's or mcp.rs's business: E's Part 3 area, or the plan's Part 8 PostCompact refocus.
- **"lighthouse" will match most packets,** since they name its paths or the repo. So the lighthouse map (15,084 characters) will ride in most wakes, and the t180 map (15,879) whenever a packet gives a t180 checkout path.
- **The budget cost:** in light mode the optional briefs share a 44,000-character cap (`LIGHT_OPTIONAL_CAP`), so carrying both maps leaves about 13,000 for the committee brief and the deck. More cards will be indexed by path rather than carried. That is the priority the plan asks for ("ahead of the deck"); the index line for each is unchanged.
- **A path with a bracket or a space is cut there** (e.g. `Program Files (x86)`). No repository root here has one.

## For the landing

- **Merge:** d585-o's three paths. E's Part 3 is `mcp.rs` only, so there is no overlap.
- **Install:** the change reaches a seat only after the exe is rebuilt and swapped, on his word.
- `MAP.md`'s two intake lines (the "what a seat reads when it wakes" row and the Intake section) name the new functions.

## Corrections

- **Two of my first new tests failed on their own setup, not the code:**
  - the scratch folder's name held `ThreadId(5)`, and a path stops at a bracket;
  - a 400-character seat still held a tiny map with its heading.
  - Both were fixed in the tests before the commit.
