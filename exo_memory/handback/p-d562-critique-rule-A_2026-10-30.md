# D562: measure an outside critique before answering it (A, 2026-10-30)

Tier: just do it. Spec: Part 1 of `exo_memory/loop/plan_consonance_learns_from_the_reader_2026-10-30.md` (lines 9-11). I read the whole plan.

## 1. What landed: branch d562-a, worktree `C:\Users\nname\Desktop\worktrees\lh-d562-a`, off d556-o 0ca3eccd, not pushed

    checked: git log --oneline -2 (in the worktree)
    020c4776 BUILDING: measure an outside critique before answering it
    0ca3eccd Five pointer skills for the procedures panes re-read every lap, and the code-map habit in the brief

**What changed:**
- One bullet, 13 lines, in `consonance/src-tauri/brief/BUILDING.md`, in the file's own shape: the rule, a Why line citing the record, and a Falsifier line.
- No instance CLAUDE.md was touched.

**Where, and why there:** it sits in "Give the Librarian something to measure, not something to reach for", right after that section's first bullet.
- That section already holds the chair's rule that a claim is sent out to be measured rather than reached for. The new rule is the same move, applied to claims that arrive from outside.
- The curated-auditor reasoning is in BOOT, not in BUILDING.md (`grep -n curated consonance/src-tauri/brief/BUILDING.md` → nothing), so there was nothing in this file to sit beside.
- The Why line cites the curated-auditor reasoning in words ("the room's one exterior is uncurated measurement").

## 2. Checks

    checked: node --test consonance/tools/consumer-relabel.test.js → 34/34
    checked: node --test consonance/tools/consumer-relabel.test.js consonance/tools/portable-paths.test.js → 75 pass, 2 fail;
             the same 2 fail at 0ca3eccd with my edit stashed (75/2 there too): "the green line says how many baselined sites are FATAL"
             and "the real repo is green against its committed baseline", both portable-paths, not mine

## 3. Corrections

- **My first draft added a 25th line naming the keeper.** "The reply to the keeper carries…" turned consumer-relabel red (25 lines, 24 expected), because the shipped copy would need a new relabel. It now reads "The reply you send back carries…", which needs no relabel.
- **My first draft said D557 confirmed the missing maps and skills. It did not.** D557 is the offset-lift test, refused on measurement (`exo_memory/handback/p-d557-lift-test-E_2026-10-30.md` §1).
  - The plan's own account (its "What the day showed" section) is what the Why now cites: no maps, no skills, the wrong shape for "where is X" (conceded at 17:48Z), all true; only "redundant code" failed.
  - The figure is 0.68 % of non-test code (`p-d554-dupes-E_2026-10-30.md:21`).
  - The packet's phrase "D554 and D557 reversed half of it" is therefore not what the Why says; only D554 is cited.
- **The outside reader is "the reader"** in the bullet. An earlier draft used "he", and I don't know the reader's pronouns.

NEXT: librarian — read it and land d562-a with the next lighthouse landing, after d556-o is on main.
