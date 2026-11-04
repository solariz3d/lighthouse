# D277 part 6 (C): the assembled seat files, measured, and a draft of what stays indexed

**The draft** is `exo_memory/loop/assembly_draft_2026-10-09.md`, on branch **assembly-c, commit db2d7b04** (on main 9b5f40ba). Beside it are two instruments, `assembly_census_2026-10-09.{sections,sub}.js`, which reuse the census classifier unchanged. **Measure and draft only: no app code was touched, and nothing lands before 2026-10-10T11:55Z.**

## 1. Report: what the assembly adds
**The plan's premise was my sentence, and it was wrong for two of three seats.**
- The census said the assembled files are larger "because the live-edge claims and the maps add imperative-shaped lines" (`instruction_load_census_2026-10-09.md:54`). That was inferred, not measured.
- **Main and the librarian carry no maps and no live edges.**
- Checked: `sections.js` over the three CLAUDE.md files (written 02:52), under the lock at 2026-10-10T01:04Z.

| seat | total | brief | ROOM | added by the assembly |
|---|---|---|---|---|
| **main** | 110,181 B / 96 blocks | 69,300 B / 57 (BUILDING) | BOOT 40,036 / 38 | 845 B / 1 |
| **librarian** | 141,186 B / 135 blocks | 19,622 B / 29 | BOOT 38 + 11 cards 38,806 B / 47 | **shelf path index 40,906 B / 19**, shelf header 1,147 / 1, map pointer 618 / 1 |
| **pane** | 108,905 B / 130 blocks | COMMITTEE 15,823 / 20 | BOOT 38 + deck 24,184 / 36 | **live edge 10,011 / 11**, topic map 6,058 / 4, own map 7,395 / 14, pointers 5,009 / 6 |

**Where each file is assembled in `main.rs`:**
- **Main:** `main_intake` :6854-6874, written by `spawn_main` :8094.
- **Librarian:**
  - `librarian_intake` :7907;
  - its head, `librarian_intake_head` :7919;
  - the shelf: `librarian_shelf` :7883, `corpus_shelf_at_with_index` :7499 and the tier `order` table :7603.
- **Pane:** `assemble_intake_within` :2944-3112, with `curated_resonance` :3416 and `intake_with_map` :5578.

**THE STRUCTURAL FINDING:** the librarian and pane files are FILLED TO A BUDGET. Indexing a section alone moves the bytes to the next thing in line; it does not remove them.
- **Librarian:** `LIBRARIAN_INTAKE_LIMIT` − `INTAKE_HEADROOM` = 142,000. The source says so itself at :7365-7367. Measured: 141,186.
- **Pane:** `SHELL_SOFT_CEILING` − `SHELL_TRANSCRIPT_FLOOR` = 110,000, via `optional_budget` :3191. Measured: 108,905.

## 2. Draft (details and costs in the draft §2)
- **Main:** index nothing. It falls to ~72.3 KB with B's BUILDING draft alone.
- **Librarian: L1 + L2, which only work together.**
  - **L1:** a directory-level index replaces the 300 path lines (40.9 KB → ~1.5 KB).
  - **L2:** the carried tiers become cards plus the seat's windowed notes. Today the budget already reaches only cards, so nothing carried today stops being carried.
  - **Result:** ~102 KB (~25.6k tokens), down from 141 KB.
- **Pane: P1 + P2 + P3.**
  - **P1 and P2:** pointers replace the topic-map summaries and the 25 live-edge claims.
  - **P3:** a NEW cap used only for the optional briefs. Lowering `SHELL_SOFT_CEILING` would also move the warm-resume transcript window.
  - **Kept:** the own map stays carried.
  - **Result:** ~92.9 KB (~23.2k tokens), down from 108.9 KB.
- **The "after" figures are arithmetic over measured sections, not a build.**

## 3. Routing
- **APP (`main.rs`, a build):** L1, L2, P1/P2 and P3, each with its lines in the draft §3. Main needs nothing.
- **DOCUMENT:**
  - B's three brief drafts, already routed;
  - LIBRARIAN.md's shelf description;
  - the tier-cut comment at :7536-7602.
- **One decision for the keeper:** L2 narrows the keeper's 2026-08-24 cut, "the system is carried; the record is indexed", to "the cards are carried". De facto it already is.

## 4. What this does not establish
- **Usage is unmeasured:** whether seats use the per-path index or the live edge. The cost line in the draft is unweighed.
- **RULE counts** carry the census's 65% precision. The byte counts are exact.

## Corrections
- **The census sentence above** (mine) is corrected here, with what it had claimed.
- **In my own draft:** a row read "2 → 2" for main's assembly-added blocks; the measured figure is 1 (the header). Fixed before the commit.
- **A slip:** one quick `node … sub.js` check that the committed instrument runs from the repo path ran outside the heavy-run lock. It was read-only. Every measurement ran inside the lock.

## Build (the librarian's ruling; chair packet "D277 part 6, BUILD")

**The commit** is **73c61c8a** on branch **assembly-build-c**, from main 9b5f40ba, in the copy-only worktree `C:\Users\nname\Desktop\c-asmbuild-wt`. One file changed: `consonance/src-tauri/src/main.rs`, +391/−2. It lands and flips with parts 1–5 at the 10-10 timer, not before.

**The switch.** `intake_light()` reads the same `gates_mode` key as E's gates, through `mcp::gates_mode_from`.
- **Absent, unreadable or not "light":** off, and the intake is today's.
- **Under `cargo test`:** the live config is not read (`TEST_INTAKE_LIGHT`, off by default), the same as mcp.rs does for the gates.
- **Structure:** each light branch returns before the strict code, and the strict code is not edited.

**What light does, by seat:**
- **Librarian (L1 + L2), `librarian_shelf_light`:**
  - **Carried:** a fixed set. Every card, plus the seat's window notes (`librarian_note_is_carried`), whole, up to `LIGHT_NOTES_CAP` = 24,000 B.
  - **Indexed:** one line per directory the strict walk visits, giving the count, the newest file written and an `ls` command, plus one `grep -rl` line.
  - **Main:** unchanged.
- **Pane (P1 + P2 + P3):**
  - **Memory:** `memory_pointer` replaces `curated_resonance` with two pointers: the topics directory and atoms.jsonl, with `tail -n 25`.
  - **Optional briefs:** `optional_budget_mode` caps them at the NEW `LIGHT_OPTIONAL_CAP` = 44,000.
  - **Own map:** `map_allowance_mode` holds it to its reserve.
  - **The transcript window:** `SHELL_SOFT_CEILING` is untouched, so the warm-resume transcript window does not move.

**How backfill is stopped, in each of the three places it could happen:**
1. **The librarian shelf** is no longer a walk filled to `LIBRARIAN_INTAKE_LIMIT − INTAKE_HEADROOM`. It reads the cards and the window notes and nothing else, however much room is left. Row: `light_the_shelf_carries_a_fixed_set_and_never_backfills`, on a built corpus with a 200 KB system file, a record file, an 80 KB LEDGER and a note over the cap; none of them is read in.
2. **The pane's optional seat** is a remainder (`optional_budget`). `LIGHT_OPTIONAL_CAP` is the seat today's intake leaves a pane at the minimum map reserve (110,000 − 8,000 − ~58.1k core ≈ 43.9k). So light carries exactly the briefs today carries: the same 6 cards, with a deck section of 24,184 B in both.
3. **The pane's own map allowance** is also a remainder (`map_allowance`, which shrinks with the brief). Light holds it to `map_reserve`, the map's own stated need. **This third place was not in the draft;** I found it while building, at `intake_with_map` (`main.rs:5626` on base). Measured: the own-map section is 7,283 B strict and 7,283 B light.

**The rows, red first** (`intake_light_tests`, 8 rows plus 1 ignored measurement):
- **Red, before wiring:**
  - the light librarian row: light equalled strict, 141,742 B;
  - the light pane row: light equalled strict, 109,021 B.
- **Green on the new functions from the start** (they call them directly, so they were never red):
  - the switch;
  - the caps;
  - the fixed set;
  - the pointers resolve.
- **The two key-absent rows were green both times.** They are guards, not reds.
- **The real "key absent = today's" check is cross-tree:** `dump_intakes_for_measure` on this branch against the same dump on base 9b5f40ba, run back to back under the lock (a temporary uncommitted copy in the base worktree, since reverted). Result: the librarian and pane strict intakes are **byte-identical** apart from the worktree folder name in the two map paths, which is the only difference in the raw diff. After normalizing that name: sha256 74610e3a… (librarian, 141,731 B) and 88fa2d3b… (pane C, 108,847 B), each the same on both trees.

**Measured** (the census `sections.js` / `sub.js` over the light dumps):

| | strict | light | target in the draft | assembly-added RULE blocks |
|---|---|---|---|---|
| librarian | 141,742 B | **110,038 B** (~27.5k tokens) | ~102 KB | 21 → 13 |
| pane C | 109,021 B | **93,292 B** (~23.3k tokens) | ~93 KB | 36 → 19 |

- **Librarian is over my draft's target, and the draft was wrong.**
  - The window rule (the keeper's) carries `librarian/README.md` (2,619 B) whatever its date, and my draft's arithmetic left it out.
  - With B's LIBRARIAN draft (−5,489 B) the light intake is ~104.5 KB.
  - I kept README.md rather than cutting it to hit my own number. The test bound is now structural: head + every card + `LIGHT_NOTES_CAP` + 6,000 of shelf text.
  - The assembly-added RULE blocks are 13, not the ~3 I drafted: each directory line carries a `List:` command, which the classifier counts as an imperative.
- **Pane** is ~93.3 KB on today's COMMITTEE brief, and ~92.5 KB with B's draft. The cards, BOOT and the committee are carried exactly as today.
- **Pointers:** every absolute path in the light shelf's header and index, and in the light memory section, exists on this machine (row `light_every_pointer_resolves_to_a_file_that_exists`).

**Checks, all under the heavy-run lock:**
- **`cargo test` (all targets):** green. The bin is 1011 passed / 0 failed / 5 ignored; arch_test 13/0; the probe bins all ok.
- **`node --test` over portable-paths, carrier-drift and carrier-drift-watch:** 109/109.
- **`node consonance/tools/portable-paths.js`:** exit 0, 0 new sites.
- **`node consonance/tools/carrier-drift.js`:** GREEN.

**For the keeper with the flip (unchanged from §3):** L2 narrows the keeper's 2026-08-24 cut, "the system is carried; the record is indexed", to "the cards are carried". The cap had already made that true: all 11 bodies carried on 2026-10-09 were cards.

**Limits:**
- **"Newest written" on a directory line is the file mtime.** In a fresh worktree every mtime is the checkout time, so that column is arbitrary there. In the live room it is the real newest.
- **The light pane intake was measured for pane C only.** Other panes differ by their own map.
- **Usage is still unmeasured:** whether a seat misses the per-path index or the live edge.

**Corrections:**
- **The librarian target (mine):** README.md was omitted from the draft's arithmetic, so the real figure is 110,038 B, not ~102 KB. Above.
- **The map-allowance backfill (mine):** the draft named two backfill points; the build found a third, the pane's own map. Above.
- **The first red run never ran:** cargo isn't on the bash PATH and the lockrun shell printed "cargo: command not found" with exit 0. I reran with `~/.cargo/bin/cargo.exe`.
- **Lock exit 3:** one lock wait gave up after 30 min behind the chair's full suite (exit 3) and was retried, per the rule.
