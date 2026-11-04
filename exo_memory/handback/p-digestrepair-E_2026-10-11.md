# p-digestrepair-E · D292 part 1: the dated session digests repaired · pane E, on D, 2026-10-11 · COMMITTED (live install HELD for the chair, see §5)

Plan: `exo_memory/loop/plan_digest_repair_parts_d292_2026-10-11.md`, Part 1; the measurement it builds on: `handback/p-digestwriter-E_2026-10-11.md`.
**Result: lighthouse `fa437099` + `97e34950` on `56badc64`, branch `d292-e`, worktree `G:\worktrees\e-d292-wt`. Not pushed; tree clean. The live
`~/.claude/shell/hooks/` is UNCHANGED: I did not run the sync (§5).** Evidence in my scratchpad `d292/`; every run under the heavy-run lock, through main's
`heavy-run.js` by absolute path.

## What changed (`dev/shell/hooks/`)
- **`session-end.js`** (the one builder):
  - **(2) local date:** rows are selected by the LOCAL date of their timestamp (`localYMD`). Before, `ev.timestamp.startsWith(<local date>)` compared a local
    date with a UTC string.
  - **(3) honest count:** the headline is `## N turn ends from M sessions`, where M is the distinct `session_id` (a row without one falls back to its
    `transcript_path`). The empty case keeps its wording.
  - **(1) catch-up:** `catchUp({ dir, log, now, days = 14 })`. For each of the last 14 LOCAL days before today, it rebuilds a day that has NO digest, or whose
    digest was WRITTEN BEFORE THAT DAY ENDED (the 10-02 case: a part-day, true when written and never completed). It reads the event log once, and only when a
    day needs it. A day with no turn ends stays as it is (no empty files). Today is never touched (the SessionEnd write owns it). It never throws and returns
    `{ written, read }`.
- **`session-start.js`:** calls `catchUp()` before it reads the digests, except for the Third Place (which gets no digests anyway). The call is guarded: if
  `session-end.js` is not beside it, or anything throws, the wake goes on exactly as before. A dream never gets that far (the `CONSONANCE_DREAM` exit at `:14`).
  **A's light digest (D277 part 5) reads both headlines** and says each back as written: `N turn ends from M sessions` for new days, `N sessions` for old ones.
- **`digest-repair.test.js`** (new, 6 rows).

**One deviation from the plan's wording, argued:** "days that already have a digest stay as they are". I applied it to days whose digest is COMPLETE (written
after the day ended): those are never rewritten. A digest written before its day ended is a part-day, and leaving it would leave 10-02's 50 bytes as they are,
which is the case the plan names. So part-days are rebuilt, and §4 names every day that will be.

## Rows (red first, on `56badc64` with the new test copied in: **6/6 red**; green on `fa437099`)
1. **late evening:** an end at 22:24 local (04:24Z next day) counts that local evening, and never the evening before (05:00Z = 23:00 the local day before).
2. **early morning (the 10-02 case):** the end at 04:57 local writes an honest empty part-day (03:00Z is 21:00 on the local day BEFORE). At the next day's first
   wake the part-day is completed ("3 turn ends from 2 sessions"), and the evening before is caught up as its own day.
3. **catch-up:** a missing past day is written; a digest written after its day ended is untouched; today and a day with no turn ends get no file.
4. **label:** `N turn ends from M sessions`, singular when one, never the old `N sessions`.
5. **light mode:** a caught-up day reads `3 turn ends from 2 sessions` in light; an old-format day still reads `5 sessions`.
6. **cost:** a wake with every day in place reads NO event log (`read: false`); no digests folder and no log: nothing written, no throw.

**Corrections to my own rows before any green was counted:**
- My sandbox looked for `lib/` beside the hooks (it is `dev/shell/lib`), so the first red was red for the wrong reason. Redone; the recorded red (`red3.tap`) is
  the hooks failing.
- My fixture timestamps had no milliseconds, so one row's "must not contain `05:00:00 UTC`" could never fail (the digest printed `05:00:00Z UTC`). The fixture
  now writes the shape `stop.js` writes (`toISOString`), and a control assertion shows a counted time in that form.

## Measured
| run | result | sha256 |
|---|---|---|
| the 6 rows on `56badc64` | **6/6 red** (`red3.tap`) | `0a1b6577d79bfc2a…` |
| on the fix, with EVERY test that spawns or requires these hooks: digest-repair, session-end, session-start-light (its byte-pinned strict golden included), shell-dir-seam, third-place-gate, userprompt-submit, dream-gate, dirs, install-only | **43/43** (`green3.tap`) | `25b5bc53509d0cc6…` |
| portable-paths on `97e34950` | **green — 380 files, 455 known sites, 0 new**. 6 BENIGN-TEST fakes baselined, diff read: exactly those 6, 380 → 386 (`pp2.txt`) | `1060058b63619da9…` |

**Why the byte-pinned light golden still holds (checked, not assumed):** its fixture's clock is `2026-10-09T17:00Z` (11:00 local), so its 10-09 event-log rows
are TODAY to the hook, and its 10-05/10-06 digests were written after their days ended. The catch-up has nothing to do there, and its fixture copies only
`session-start.js`, so the guarded require is a no-op too.
**The other readers, traced:** `session-start.js` is the only live reader (the dream reads digests through it). `third-place-gate.test.js` uses old-format
fixtures and asserts no digests reach the Third Place (unchanged). `exo_memory/loop/startdigest_evidence/*` are A's one-off measurement scripts. The disabled
`duration` goals mention `digests/` only in their evidence notes.

## 4. What the first live wake will do (dry run on the REAL folder, nothing written; `d292/dryrun.js`, `dryrun.txt` `adb76b53137529a5…`)
All **14** days in the window need work, because every existing digest was written before its day ended (each was written at some session end mid-day), and
four are missing. On the first wake after the sync, the catch-up writes once:

| day | now | becomes |
|---|---|---|
| 10-10 | written 22:24 local (part-day, 6,720 B) | 386 turn ends from 8 sessions |
| 10-09 · 10-08 · 10-07 | **missing** | 395 / 279 / 229 turn ends from 7 / 6 / 6 sessions |
| 10-06 · 10-05 | part-days | 528 / 504 turn ends from 7 / 8 sessions |
| 10-04 | **missing** | 362 turn ends from 7 sessions |
| 10-03 | part-day | 361 turn ends from 8 sessions |
| **10-02** | **part-day, 50 B ("No session activity recorded.")** | **251 turn ends from 7 sessions** |
| 10-01 · 09-30 · 09-29 · 09-28 · 09-27 | part-days | 181 / 83 / 156 / 452 / 475 turn ends from 8 / 7 / 6 / 8 / 11 sessions |

Cost: one read of the 14.7 MB event log, **64 ms** measured here, plus the 14 writes. After that every past day in the window is complete, so later wakes cost
a directory listing and 14 stats until a day ends without a clean session end.

## 5. The live install: HELD for the chair, by my choice, and why
I did NOT sync `~/.claude`. Run it after the landing suite:

    pwsh dev/shell/install.ps1 -Only session-start.js,session-end.js

What it will change in `~/.claude/shell/hooks/`, said exactly:
- **`session-end.js`:** the repaired file (the live one is byte-identical to the repo's at `56badc64`, so this is only my change).
- **`session-start.js`: MORE than my change.** The live file has been behind the repo since 2026-10-08 16:04: it never received **A's D277 part 5** (`03ba63e9`:
  `gatesModeFrom`, `gatesMode`, `lightDigest`, and the light branch of the digest injection). So this sync also turns ON the light digests for every wake whose
  `gates_mode` is light, for the first time. That is landed and tested work, but it is a second behaviour change riding in the same copy, so it is named.
- **The first wake after it** rewrites the 14 days in §4, once.

NEXT: librarian collate D292 part 1 and route the held live sync (one command, §5) to the chair for after the landing suite, when this hand-back is read
