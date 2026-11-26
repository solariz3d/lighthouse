# Two room laps: shelf-recursion's maxBuffer, and five research notes frozen into CH-4 (pane P, 2026-11-26)

Seat: pane P (sibling-372c8abc). This answers the chair's packet of 2026-11-26T20:55:53Z (ledger D677). Tiers: CHECK IT for (1), as named; the registry edit in (2)
follows the tool's own freeze rule. Both were made in my own worktree, `G:\consonance-worktrees\lh-roomlaps-p26`, on branch **`p-roomlaps-1126`**, from fce82d62.
They land with the next lighthouse landing. Scratch (S): this seat's session scratchpad, folder `d681`.

## 0. The answer first

- **(1) `127ae5c0`:** shelf-recursion.test.js **11/11** (it was 10/11). Its cross-check really runs: git tracks **1,442** `.md` files under `loop/`, and the walk
  returns all 1,442.
- **(2) `d0d610d7`:** the five notes are frozen into `ch4_corpus.files` (**59 → 64**), with one `_refreeze_log` entry each. carrier-drift is **GREEN**, and
  carrier-drift.test.js is **60/60**.
- Both tests were run alone, without the lock.

## 1. shelf-recursion: the maxBuffer

**Before.**
- checked: `git ls-files exo_memory | wc -c` at fce82d62 → **1,115,339 B**, over node's default 1 MiB maxBuffer.
- The probe at `shelf-recursion.test.js:122` threw ENOBUFS, and the test read that as "git unavailable".
- checked: S/shelf-before.tap → tests 11, pass 10, **fail 1**: `not ok 9 - the shelf header cannot claim completeness it has not checked`.

**The change.**
- `maxBuffer: 64 * 1024 * 1024` on that probe, with a two-line comment saying why. 1 file, +3 −1.
- The second call, `git ls-files exo_memory/loop` (`:128`), is 125,817 B and was left as it is.

**After.**
- checked: S/shelf-after.tap → **tests 11, pass 11, fail 0**, exit 0. `ok 9 - the shelf header cannot claim completeness it has not checked`.
- The count it cross-checks. checked by a one-off node run in the worktree, with the test's own filter (`.md`, not under `/attic/`):
  - `git ls-files exo_memory/loop` → **1,442**;
  - `mdFiles('loop')` from corpus-age.js, the same function the test uses at `:30` → **1,442**.

  The test's `unseen` list is therefore empty because the two sets agree, not because the check was skipped.

## 2. The CH-4 freeze of five research notes

**Read whole first, as the tool requires** (carrier-drift.js:433-435, "Re-freeze deliberately, after reading it, never as a formality"). I wrote none of
them.

| note | author | lines / bytes | what it teaches |
|---|---|---|---|
| `fable_vs_opus_use_2026-11-25.md` | the librarian on L | 35 / 2,553 | nothing to a seat: model docs and user reports, marked as such; it suggests a model per seat and sets none |
| `intake_carry_cost_and_use_2026-11-25.md` | the Third Place on L | 106 / 7,174 | nothing to a seat: the intake's sizes, cost and use; its open questions are left as his call |
| `same_shape_elsewhere_2026-11-25.md` | the librarian on L | 31 / 2,877 | nothing to a seat: four outside works, each with the librarian's reading beside it |
| `clean_ui_design_sources_2026-11-26.md` | pane E (L246) | 556 / 37,672 | nothing to a seat: design sources on radius, glow and glass, against the six looks; it proposes for his eye and changes no builder file |
| `jev_state_and_updates_2026-11-26.md` | the Third Place on L | 88 / 6,967 | nothing to a seat: the room's Jev record and what changed outside; it restates the sealed clause and orders no run |

The line and byte counts are `wc -l` / `wc -c` at fce82d62. The freeze script refuses if either has changed.

**Before.**
- checked: `node consonance/tools/carrier-drift.js` → RED, 5 findings, each `CH4-DRIFT-ADDED` on one of these five.
- No registered-wording finding on any of them.
- `--ch4-walk` → frozen 59, the five listed as `+`.

**The edit** (`consonance/tools/carrier-drift.registry.json`, by `G:\consonance-scratch\p-gate\freeze5.js`):
- The five are added to `ch4_corpus.files`, which stays sorted.
- Five `_refreeze_log` entries, in the 175fd1bb wording ("Reachable because exo_memory/research is a seeded folder of the CH-4 walk (… CH4_SEEDED_DIRS, lines
  216-218)"). checked: `carrier-drift.js:216-218` → `const CH4_SEEDED_DIRS = [ … 'exo_memory/research' … ]` at this base.
- A suffix on `frozen_at` and on `frozen_by`.
- The JSON is written back in its own 2-space layout. checked: a round trip of the unedited file was byte-equal.
- The diff touches only those keys, plus one trailing comma.

**After.**
- checked: `carrier-drift.js` → **GREEN**.
- checked: `--ch4-walk` → frozen 64, nothing ADDED or REMOVED.
- checked: S/carrier-drift-after.tap → **tests 60, pass 60, fail 0, skipped 0**. In the room suite at fce82d62 it had 3 red rows (17, 22, 37).

## 3. What is open

- The branch is not merged yet. It goes into lighthouse main in the landing that also takes unmakeable-t2-c at 4f01adb0 (the chair's 21:50Z and 21:59Z notes). That landing
  runs the full suite plus TAP under the lock, which will be the first whole-suite run of both changes.
- inferred: the exo_memory listing grows about 45 KB a day. A 64 MiB buffer covers about 1,400 days at that rate, so it is a bound, not a fix for growth. That
  is good enough for a probe whose only job is to see that git works.

BASE: G:\consonance-worktrees\lh-roomlaps-p26 fce82d62
SOURCES: S/shelf-before.tap; S/shelf-after.tap; git ls-files exo_memory | wc -c; the one-off count (git ls-files exo_memory/loop vs corpus-age mdFiles); carrier-drift.js before and after; carrier-drift.js --ch4-walk; carrier-drift.js:216-218, :433-435; wc -l / wc -c of the five notes; G:\consonance-scratch\p-gate\freeze5.js; S/carrier-drift-after.tap; git log -3 in the worktree
NEXT: P lands p-roomlaps-1126 and unmakeable-t2-c (4f01adb0) into lighthouse main now, then the full suite + TAP under the lock, the scan, and the push; the librarian reads this when it is rung.
