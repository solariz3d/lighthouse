# p-shelfbudget-C — D296 part 2: the shelf's index budget, built against B's sealed bar. Pane C, machine D, 2026-10-11.

**§0: choice 1 (librarian).** Built on the STRICT walk only. **DORMANT:** `gates_mode` is light, and the light shelf
(`main.rs:7986-8060` at base) is not changed. So the librarian's next wake will not show this build. Nothing below
claims anything about §3; that needs a strict wake.

Packet: the chair's D296 part 2 (`loop/plan_shelf_index_budget_d296_2026-10-11.md`, Part 2 and the §0 ruling).
Bar: `loop/shelf_budget_registration_2026-10-11.md` (B, 67533a2e).

Branch `d296-c`, worktree `G:/worktrees/c-d296-wt`, from 67533a2e. Not pushed. Three commits:
- **65b16815**: the build (main.rs: code plus 9 tests);
- **bf784f68**: one row tightened, found while writing mutant M3;
- **fe7889f6**: the evidence folder `handback/p-shelfbudget-C_2026-10-11_evidence/`.

## Verdict against the bar: S2, S3 and S4 met; S1 missed; S5 is B's to judge

| # | bar | base (9041faf9) | new (bf784f68) | |
|---|---|---|---|---|
| S1 | map/journal/loop listed ≥ 300, dropped falls as much | 208 listed / 523 dropped | **267 / 464** | **MISSED**: +59 listed, −59 dropped; short of 300 by 33 |
| S2 | every unmapped hand-back dated in the last 14 d listed; ≥ 80% of all; 0 mapped; 0 evidence-folder | — | **56/56 listed (100%); 22/22 recent; 0 mapped; 0 nested** | met |
| S3 | index tier ≤ 30,000 B, budget unchanged | 29,972 | **29,975** (map/journal/loop 24,482 + hand-backs 5,493) | met; `LIBRARIAN_INDEX_BUDGET` unchanged |
| S4 | ≤ 142,000 B and < 150,000 chars | 141,436 B / 140,248 ch | **141,253 B / 139,955 ch** | met (a guard) |
| S5 | full paths; cuts at a word boundary, visibly marked; "(no title)" | — | see §4 | B's read on the dump |

checked: `node measure.js <base2> <new2> <snapshot> 2026-10-11` → `measure.out` in the evidence folder.

**On S1.** The listed figure is the one lever the bar allows here, and a title cap set on legibility does not reach 300.
I chose legibility over S1.
- **The cap against the count,** on the same snapshot (`sim.js`, an approximation of the walk; at 40 it gives 266/465,
  the real build gives 267/464):

  | title cap (chars) | none | 80 | 60 | 48 | **40** | 32 | 24 | 0 |
  |---|---|---|---|---|---|---|---|---|
  | map/journal/loop listed | 159 | 194 | 221 | 246 | **266** | 294 | 327 | 489 |
  | dropped | 572 | 537 | 510 | 485 | **465** | 437 | 404 | 242 |

- S1 needs a cap near 24 chars, which keeps about "D294 part 2 (ledger ...". At 40, the leading claim of most
  titles survives (§4).
- If the librarian prefers S1, the cap is one constant (`INDEX_TITLE_CHARS`), and §2.1 does not apply to it.

## 1. What changed (`consonance/src-tauri/src/main.rs`)

**The entry.**
- `index_entry_line` / `index_title`: the title is cut at 40 chars on a word boundary, with trailing punctuation
  dropped and a visible ` ...`.
  - A single word longer than the cap is cut at the cap, still marked.
  - A file with no `# ` heading prints `(no title)`; before, it printed an empty field.
  - The path and `(n lines)` are unchanged, and no path is cut.
- This applies to every index line on the strict shelf, the carried tier's overflow included. That is why the floor
  shrank (§3).

**The hand-backs.**
- `unmapped_handbacks(root)`: the top-level `handback/*.md` whose filename, or whose stem without `.md`, appears in no
  `map/*.md`. This is B's rule, as in their `baseline.js:30-32`.
  - Evidence-folder files are never read; the function lists top level only.
  - A missing `map/` names nothing, so every hand-back is unmapped.
  - A missing or empty `handback/` yields nothing.
- They join the index tier as **group 1**, newest first, inside the same budget:
  - before them, group 0 (map, journal, standing instruments);
  - after them, the dated loop/ record (now group 2) and the undated loop/ files (group 3).
- **Why a group of their own, not interleaved by date** (a choice, stated in the code comment):
  - the set is bounded by what the maps miss, while dated loop/ grows every lap;
  - interleaved, the oldest hand-backs would be the first the window drops, and they are the ones nothing else reaches.
- A header line, always printed, zero included: `N hand-back(s) that no map/*.md line names are indexed with the record
  (M listed).`

**Two existing test helpers changed, by name.** `index_tier_entry_count` and `shelf_tests::index_lines_of` now also count
`- handback/` lines, with a comment at each. The index tier's rule changed, and without this
`the_header_counts_the_index_window_drop_from_what_was_delivered` would compare a drop count that includes hand-backs
against a denominator that does not. No assertion was weakened.

**The unmapped count.**
- `9041faf9`: 837 top-level hand-backs, **64 unmapped**, by the same rule (a git-tree count in node, which also
  re-checks the Rust rule). This matches B's 64.
- The dump snapshot: **56**. The live maps carry lines added since 9041faf9 that name 8 more.

## 2. The two dumps: same tree, same moment

**First attempt, corrected before any number was taken.** In a test build, `repo_root()` is the compile-time worktree
(`main.rs:453-462`). So `dump_intakes_for_measure` reads its OWN worktree's `exo_memory`, not the live one.
- My first pair therefore read two different trees. 9041faf9 and 67533a2e differ by one loop file, and the light dump
  showed `922` against `923` loop files.
- The packet's "same live exo_memory at the same moment" needed a snapshot.

**Method** (`dump2.sh`, held under main's heavy-run lock through `scratchpad/lockrun.js`):
1. A `tar` snapshot of the live `C:/Users/nname/Desktop/lighthouse/exo_memory`, **third_place excluded**: 6,834 files,
   14:38:59–14:39:15Z.
2. Mirrored into both worktrees.
3. Each tree dumped in its own `CARGO_TARGET_DIR` on G: (`G:/ctarget/c-d296-base`, `G:/ctarget/c-d296-new`): base
   14:39:47Z, new 14:39:54Z.
4. `diff -rq` of each tree against the snapshot after dumping: equal.
5. Both trees restored with `git checkout` and `git clean` (0 dirty).

The running app and its target dir were not touched. My first robocopy attempt failed with rc 16 (Git Bash rewrote
`/MIR`), mirrored nothing, and was discarded.

**Hashes.**
- As dumped (on disk at `G:/consonance-scratch/c-d296/{base2,new2}/`):
  - base strict: sha256 `bb412eb907f0b304eca7e13d4b8e04ccbf2a2062c766d12d210813f7ab19d83b`, 141,436 B;
  - new strict: sha256 `5a846d091d6584d5942d497f1283fdcaff3e640b1b809873201c1c994d146230`, 141,253 B.
- **The committed copies are not byte-identical to these:** git normalised their CRLF to LF on commit.
  - base: blob content sha256 `3e13f6a375a0c34dfd5985be3ab26388618e8aa4217d87b30395460af52bf1c6`, 141,225 B;
  - new: `8107a5c13de8f4a83c52c07e622718edb9bf106c4d990a1c5ed1d07f88b56271`, 141,027 B.
- So S1–S4 should be read from the G: copies, or re-measured on the committed ones knowing the CRLF bytes are gone.

**Light dump unchanged:** `librarian.light.md`, `pane-C.light.md` and `pane-C.strict.md` differ in raw bytes, but **0
diff lines** once the worktree directory name (`c-d296-base` / `c-d296-wt`) is normalised. That name is printed in
paths, and it differs by construction.

## 3. Entry anatomy, before and after (index tier, map/journal/loop)

| | entries | mean entry | path | `(n lines)` | title | framing | titles cut | no title |
|---|---|---|---|---|---|---|---|---|
| base | 208 | 144.1 B | 34.5 | 10.4 | 92.2 | 7.0 | 0 | 0 |
| new | 267 | **91.7 B** | 36.1 | 10.4 | **38.2** | 7.0 | 243 | 1 |
| new hand-backs | 56 | 98.1 B | 38.8 | 10.6 | 41.7 | 7.0 | 56 | 0 |

**A side effect, measured, not designed for.** The carried-tier overflow lines are shorter too, so the floor fell. The
body room rose from 44,633 to 47,477 B.
- **The same 13 cards are still carried**, plus 2 more system files in full: `README.md` and `memory/user-solariz3d.md`.
- `LIBRARIAN_INDEX_BUDGET` was not raised, so §2.1 does not apply.

## 4. S5: for B's read on the dump

`measure.out` → `S5_sample` holds 30 entries drawn with a seeded generator (seed 296). Judge on
`dumps/new/librarian.strict.md`, not on this.

My own weak spots, so they are not found by surprise:
- A cut can land just before a long word and leave a stub: `loop/q3_read_Jev_2026-09-27.md (44 lines) Q3 read: Jev ...`
  and `ASK-007 stage 2 (arm C): SCORE. ...`.
- Titles that are only a date (journal) stay whole, and they carry nothing the path does not.

## 5. Tests

**The six packet rows** (module `shelf_handback_tests`, fixture rooms through `DirsGuard`, never the live corpus), plus
three `index_title_tests` rows.

**Red-first.** All six were inserted into the 9041faf9 `main.rs` (in a separate worktree,
`G:/worktrees/c-d296-base`) and run there: **6 of 6 FAILED** (`red-first.log`). Honestly, per row:

| row | red on 9041faf9 because | what pins its own property |
|---|---|---|
| a dropped entry is listed after the change | **its own property:** 12 long-titled entries, about 7 fit | M6 |
| a mapped hand-back is NOT listed | no hand-back was listed at all. "Mapped not listed" was already true on old code | M1 |
| the budget is never exceeded | no hand-back in the tier. The budget held on old code too | M2 |
| an empty handback/ | the always-printed zero line was absent | M5 |
| a missing map/ | no hand-backs listed | M4, M7, M8 |
| an evidence-folder .md is not listed | no hand-backs listed. "Not listed" was already true | M3 |

**Mutants** (`mut.js`, on a copy tree at bf784f68, never on the committed worktree, in `G:/ctarget/c-d296-mut`; log
`mut.log`): **applied 8 / caught 8 / NOT APPLIED 0**, and the control survived.
- M1 mapped check removed;
- M2 hand-backs bypass the budget;
- M3 recurse into evidence folders;
- M4 missing map/ means nothing unmapped;
- M5 zero not reported;
- M6 no title cap;
- M7 untitled prints nothing;
- M8 hand-backs not newest first.

Two corrections of my own here:
- M5's first run was NOT APPLIED, because the brace anchor lost its `\n` to shell escaping. It was fixed and re-run alone.
- Writing M3 showed that the evidence row's `_evidence/` substring check would miss a recursion that labels by file name
  alone. Commit bf784f68 adds a count check.

**Full suite:** `cargo test --bin consonance` on bf784f68 under the lock: **1020 passed, 0 failed, 5 ignored**
(`cargo-full.log`).
- inferred: these tests read the worktree's own 67533a2e corpus, by the same `repo_root()`.
- The live-corpus fit is S4, from the dump.

**portable-paths on the committed tree, after committing (fe7889f6):** "green — 380 files in scope, 455 known sites, 0
new", exit 0.

## 6. reach.js, re-run read-only, with each strict dump as the shelf

`reach.js` (from 3479af25) run on the main checkout with `--no-scan`, each dump given as `--shelf`. It reads and writes
nothing in the checkout. Output: `reach/base.json`, `reach/new.json`. This is the shelf unit, not comparable to 08-22,
same as D294 §3.

| | D294 (00:31Z shelf) | base dump | new dump |
|---|---|---|---|
| reachable | 27.50% | 27.43% | **32.08%** |
| dropped by the window | 23.73% | 23.83% | **21.31%** |
| unpointed | 72.50% | 72.57% | **67.92%** |
| handback/ unpointed lines | 156,816 | 157,532 | 150,269 |

These describe a dormant shelf. No seat wakes on it until strict returns.

## Not done, or left open
- §3's F1–F3 cannot start. They need a librarian wake on a strict shelf built from this code.
- Interleaving hand-backs with loop/ by date, or a different cap, are choices I have not built.

Leftovers, mine, safe to delete after landing:
- `G:/worktrees/c-d296-wt` and `G:/worktrees/c-d296-base`;
- `G:/ctarget/c-d296-{base,new,mut}`;
- `G:/consonance-scratch/c-d296` (it holds the as-dumped files B may want first);
- scratchpad `d296/`.
