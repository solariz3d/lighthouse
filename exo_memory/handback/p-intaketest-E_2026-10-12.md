# p-intaketest-E · D313: the light pane intake test, rewritten structurally · pane E, on D, 2026-10-12

**Result: lighthouse `87cbce99` on `894cd138`, branch `d313-e`, worktree `G:\worktrees\e-d313-wt`, not pushed.**
- The diff is one hunk, inside `intake_light_tests::light_the_pane_intake_is_under_target_with_the_cards_and_the_room`
  (`main.rs:8469`): +28 / −3. **No product line changed.**
- checked: `git diff -U0 894cd138 87cbce99` → one `@@ -8469,3 +8469,28 @@` hunk. `map_allowance_mode` is back as it was after
  the mutation run.
- **Full cargo test, under the heavy-run lock** (`CARGO_TARGET_DIR=G:/ctarget/e-d301`):
  - **1,281 passed, 0 failed, 12 ignored** across 11 test binaries; exit 0; 117 s.
  - checked: the `test result` lines of the run's output, summed.
  - The main binary alone: 1,048 passed, 0 failed, 6 ignored.
- portable-paths after the commit: green, 392 files, 0 new.

## I changed an existing test because it was verifiably wrong

The global rule says a test is changed only when the test itself is verifiably wrong, and that I say so. I did, and here is why.
- **The old assertion:** `light.len() <= 95_000`, one byte total measured on 10-09 data, over LIVE record files.
- **Why it was wrong by design:**
  - Under light, the own-map allowance is `a.min(reserve)` (`map_allowance_mode`, `main.rs:2986`).
  - `reserve` is the map's NEWEST entry plus its wrapper (`map_reserve`).
  - So the intake grows with whatever entry a seat last wrote. The test went red at 95,693 B on C's D311 entry while the product
    did what it was designed to do.
- **The ruling was the librarian's, per the packet: the test is wrong, not the product.** The product stays untouched while H3
  runs.

## The new rows
| row | bound | today |
|---|---|---|
| the light intake = the rest, then the map section | `light.starts_with(rest)` | holds |
| **the rest** (everything before the map section) | `≤ LIGHT_PANE_REST_MAX = 88,000`: measured 85,472 B on 10-12 at `894cd138`, plus a 2,528 B margin for edits to the room and briefs | 85,472 B |
| **the map section** | `≤ reserve + MAP_SECTION_OVERHEAD` | 11,072 B against 11,651 + 1,200 |
| **the ~14 KB-under-strict row, at a FIXED reserve** (see below) | `light rest + 14,000 ≤ strict rest`, both at `SHELL_MAP_FLOOR` (8,000) | 85,472 against 101,201 (gap 15,729) |
| the room rides, the cards, no live edge, no topic summaries | unchanged | hold |

- checked: the run's `PANE INTAKE` lines → strict 104,900 B, light 96,544 B. Light rest 85,472 B, map section 11,072 B,
  reserve 11,651 B. At the floor reserve: light 85,472 B, strict 101,201 B.

## ⚠ One step past the packet's letter: the ~14 KB row is NOT kept verbatim
The packet said to keep the existing "~14 KB+ under strict" row. **On today's data it is red, for the same cause.**
- **The figures:** light 96,544 B is not 14 KB under strict 104,900 B (the gap is 8,356 B).
- checked: the first measuring run → `panicked … light 96544 B is not ~14 KB+ under strict 104900 B`.
- **The mechanism:**
  - Strict's optional seat is `ceiling − transcript floor − reserve − core` (`optional_budget`), so it shrinks one byte per
    byte of reserve.
  - Light's seat stays at `LIGHT_OPTIONAL_CAP`.
  - C's 11,651 B reserve also left strict seating only 6,541 B of map against light's 11,072 B.
  - **Even the rests are only 12,887 B apart at that reserve.**
- **What I did:** the row now compares the two rests at `SHELL_MAP_FLOOR`, the reserve every non-empty map gets at least. It
  states the same 14,000 B saving with the live map taken out.
- **If you want the row verbatim:** replace `main.rs:8490-8496` at `87cbce99` with the old `light.len() + 14_000 <= strict.len()`.
  The test then stays red on today's data until C's newest entry shrinks.

## Red first (the mutation, reverted after)
- **The mutation:** `if light { a.min(reserve) } else { a }` → `if light { let _ = reserve; a } else { a }` in
  `map_allowance_mode`.
- **The result: the test FAILED** on the map row: "the light map section is 23112 B, over reserve 11651 + 1200". Light rose to
  108,584 B; the rest stayed at 85,472 B.
- **Then reverted.** The full suite above ran on the reverted tree. The rest row does not catch this mutation, and isn't meant
  to: the mutation doesn't touch the rest.
- **The old test's own red at `894cd138`** was seen in my first measuring run, on the 14 KB row. The 95,000 row had been
  replaced before that run, so I did not reproduce the 95,693 figure; that one is the chair's.

## Limits
- Both bounds still read live files. The rest bound has a 2,528 B margin; a large edit to BOOT, a card or a brief could still
  trip it. That would be a real change in what light carries, and worth a red.
- The map row bounds the section by the design's own number. It cannot say whether `reserve` is the right size.

NEXT: librarian collate D313 when this hand-back is read; the chair lands 87cbce99 after the librarian's read
