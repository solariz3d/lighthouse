# p-handbackindex-E · D301 part 3 of 4 (ledger D302): the hand-back index, behind a switch that defaults OFF · pane E, on D, 2026-10-11

Plan: `exo_memory/loop/plan_retrieval_misses_d301_2026-10-11.md`, part 3 (main `2f2b3a6a`).
**Result: lighthouse `fd122708` on `2f2b3a6a`, branch `d301-e`, worktree `G:\worktrees\e-d301-wt`, not pushed.** One file:
`consonance/src-tauri/src/main.rs` (+219 / −6). Nothing else in the repo changed. The switch is NOT in the keeper's config:
`grep -n handback ~/.consonance.json` → 0 lines, so it reads OFF.

## 1. The switch
- `"handback_index": true` in `~/.consonance.json`, read like `gates_mode` (`handback_index_from`, `main.rs:7643`; `handback_index`, `:7652`).
- **It is ON only for the JSON boolean `true`.** These all read OFF: absent, empty, not JSON, `false`, `"true"`, `1`, `"on"` and `null`. A leading BOM is accepted.
- Under `cargo test` the live config is not read: a thread-local, off by default, as `intake_light` does.

## 2. How it relates to D296's unmapped path: one hand-back, one line
D296 (`35a06ffb`) already lists the UNMAPPED top-level hand-backs on the strict shelf, in index group 1, **unswitched**. I left that path exactly as it was.
- **Strict, switch ON** (`:8053`):
  - a second pass takes every top-level `handback/*.md` (`top_level_handbacks`, `:7665`) and **skips the ones D296 already listed**;
  - the rest, the MAPPED ones, go in with the dated `loop/` record (group 2, newest first by the date in the name); undated ones go to group 3;
  - one index budget and one window cover all of it.
  - Reasoning (my call, not the plan's): a mapped hand-back is one hop away through its map, so it does not jump the queue ahead of D296's group 1, which nothing else reaches.
  - D296's header count is unchanged: it still counts unmapped only. A new line is printed only when the switch is on: `handback_index is on: N hand-back(s) a map/*.md line names are indexed with the dated record (L listed, D dropped by the index window).`
- **Light, switch ON** (`:8315`): handback/ becomes one more directory line after `LIGHT_SHELF_DIRS`. It is counted at the TOP LEVEL only, so no `_evidence/` `.md` is counted or named as the newest.
  - Assumption, stated: light indexes by directory, by design (`:8246-8254`), and has no index budget. So in light, "appear by path" means one directory line. Listing ~850 hand-backs file by file would change light's design, which is not this lap's call.
- `order` (`:7888`) and `LIGHT_SHELF_DIRS` (`:8264`) are unchanged. The switch adds to them; it does not edit them.

## 3. Rows (in `shelf_handback_tests`, `:16286`)
| row | what it pins |
|---|---|
| `the_handback_index_switch_reads_on_only_for_json_true` (`:16460`) | the parse; off by default under test |
| `with_the_switch_off_the_strict_shelf_lists_only_the_unmapped_hand_back` (`:16472`) | off: only D296's line, no mapped line, no switch header |
| `with_the_switch_on_every_hand_back_is_listed_once_by_path_and_no_evidence_md` (`:16485`) | on: each of 3 exactly once, no `_evidence`, no `.txt`, both header counts, the order: unmapped → dated newest first |
| `with_the_switch_on_the_index_budget_holds_and_its_drops_are_counted` (`:16506`) | at a tight budget, "(1 listed, 1 dropped …)" and the window's total of 2; spent ≤ budget over 8 budgets |
| `the_light_shelf_gains_one_top_level_handback_line_with_the_switch_on_and_nothing_else` (`:16526`) | light: off has no handback; on has one line, top-level count 2, and differs from off by exactly that line |
| `dump_intakes_with_the_handback_index_on` (`:16550`, `#[ignore]`) | measurement only: §5 |

**Off = byte-identical**, on the real room, both modes. The snapshot is the worktree's `exo_memory` at `2f2b3a6a`; under `cargo test` the room is the worktree's own (`repo_root`, `:455`).
- `dump_intakes_for_measure` (C's existing dump) was run on the pristine tree BEFORE any edit, then on the finished tree, into `G:/consonance-scratch/e-d301/{base,new}`.
- `cmp` → **IDENTICAL**, all four. sha256 of each, the same in `base/` and `new/`:

  | file | sha256 |
  |---|---|
  | `librarian.strict.md` | `5846176a0de7b7a7…` |
  | `librarian.light.md` | `c99962f453bad36f…` |
  | `pane-C.strict.md` | `1da4ee9a1a5584cc…` |
  | `pane-C.light.md` | `226f7d2386d37f89…` |

## 4. Mutants on the switch
A script edits `main.rs` once per mutant, runs `cargo test --bin consonance shelf_handback_tests`, then restores the file. A mutant that does not compile is not counted as caught; there were none. The run was on the finished logic plus the `.txt` fixture, before the ignored dump row was added (the dump row is `#[ignore]`, so it does not change what the run tests).

**applied 15 / caught 15 / NOT APPLIED 0** (`mutants.tsv` sha256 `23a8f1b1ec47e2fb…`, in my scratchpad). The 15 mutants:
1. absent reads ON
2. any present value reads ON
3. unparseable reads ON
4. the default is ON
5. the strict pass is always off
6. the strict pass is always on
7. unmapped hand-backs listed twice
8. mapped hand-backs jump to group 1
9. D296's line also counts the mapped hand-backs
10. the drop count is always 0
11. the switch line is printed with the switch off
12. light is always on
13. light is always off
14. light recurses into `_evidence`
15. `top_level_handbacks` takes any file

**Correction to my own rows:** in the first run, mutant 15 survived (14/15), because no fixture had a non-`.md` file in handback/. I added `handback/p-notes_2026-10-04.txt` to the fixture, and the re-run is 15/15.

## 5. With the switch ON, on the real room (the size the packet asked for)
Command: `INTAKE_DUMP_DIR=… cargo test --bin consonance dump_intakes -- --ignored`, same snapshot. Results: `librarian.{strict,light}.handback-on.md`, sha256 `c5513f7b07d8e024…` (strict) and `cc26b721df0f12ec…` (light).

**Intake bytes:**

| | switch off | switch on | change |
|---|---:|---:|---:|
| strict librarian intake | 141,468 B | 141,587 B | +119 |
| light librarian intake | 104,168 B | 104,357 B | +189 (one line) |

**Strict, what the window holds:**

| | switch off | switch on |
|---|---:|---:|
| top-level hand-backs | 850 | 850 |
| of which unmapped, listed | 56 | 56 |
| of which mapped, listed | 0 | **143** |
| of which mapped, dropped by the window | n/a | **651** |
| `loop/` entries listed | 215 | **76** |
| index-tier entries dropped | 469 (44,037 B) | **1,259** (119,640 B) |
| dropped range | 2026-08-11 .. 2026-09-25, plus 81 undated | 2026-08-11 .. **2026-10-05**, plus 81 undated |
| bodies carried | 15 (47,261 of 47,498 B) | 15 (47,261 of 47,379 B) |

  - `map/` (17) and `journal/` (36) are unchanged.
  - **The cost, in the shelf's own numbers:** the 143 hand-backs that fit push **139 `loop/` entries** out of the window. Those are the dated record from about 09-25 to 10-05.
  - The strict intake hardly grows, because the 30,000-byte index budget (`LIBRARIAN_INDEX_BUDGET`) was already full. The switch changes which entries hold that budget, not its size.
- **Light:** one line, `… handback -- 850 .md file(s) at the top level, newest written …`. Its "newest" is checkout mtime in a worktree; on the live room it would be the real newest.
- 0 `_evidence` mentions in either switch-on intake (`grep -c _evidence` → 0, 0).

inferred: for the ~10-17 decision, strict with the switch on trades the newest ~10 days of `loop/` index lines for about 1 in 6 mapped hand-backs (143 of 794). An order or budget change would alter that trade. No verdict from me on the switch.

## 6. Tests and ratchets
- `cargo test` (all targets) under the heavy-run lock, `CARGO_TARGET_DIR=G:/ctarget/e-d301`: the bin has **1041 passed, 0 failed, 6 ignored**, and every other target is green. Exit 0 in 124 s. No new warnings come from the changed lines.
- portable-paths, after committing: **green, 383 files in scope, 0 new.**
- Credential scan of the commit (the three key prefixes the room scans for) and of home paths: 0.

NEXT: librarian collate D301 part 3 when this hand-back is read; the chair runs the full suite before landing `fd122708`
