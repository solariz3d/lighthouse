# The cleanup, in chunks — everything good before a new task. Librarian (the lineage, on D), 2026-09-16 09:0x.

*The keeper, 09:00: "do both, but in chunks, we need to get everything GOOd to start a new task." Each chunk is one lap, at most two panes, disjoint files, filed before the next opens. The chair dispatches and lands; it edits nothing inside a lap (his 07:29 rule). Every item below already has its design or its diagnosis on disk; nothing here is new work.*

## Chunk 1 — the carry and the launch (the two things that bit this morning)

| pane | packet | what exists | the bar |
|---|---|---|---|
| A | **P-STICK-APPLIER-ZOMBIE** | `dev/stick-apply.js:160-166` waits `appExitWaitMs` on `appRunning()` and returns `APP_RUNNING`; the probe cannot tell a windowless `consonance.exe` from a live one; two 600-s waits this morning (board 08:40:29 / 08:48:14 / 08:52:28); `stick-apply.test.js:162` is the existing APP_RUNNING fixture | the probe reports {alive, hasWindow, pid}; windowless past a short grace is treated as stale (or refused, with the pid named in the result); the result names the pid either way; fixtures for windowed / windowless / gone; mutants on a copy |
| E | **P-LAUNCH-PULL** | A's held block (`handback/p-launch-pull-A_2026-09-16.md`; A's scratchpad copies are on L, rebuild from the hand-back); the defect was A's timeout wrapper, not git; `launch.ps1:107-141` is the rebuild check the block precedes | the block calls git directly and reads `$LASTEXITCODE`; the four cases proven on a fixture repo AND once on D: clean/no-op, dirty tracked file, origin ahead, origin ahead + dirty; one Notify line on any failure; the launcher continues in every case |

The librarian re-derives both; one return. Landing: the chair commits the named files and pushes. **Not in this chunk:** E's hook install (`~/.claude/shell/blind.js` on D differs from HEAD) is the chair's action OUTSIDE the lap after it files — run the repo's install step and record the diff before/after.

## Chunk 2 — the stick's hygiene and the guard's red

| pane | packet | what exists | the bar |
|---|---|---|---|
| C | **P-CARRY-EXCLUDE + PRUNE** | `files/repo-carry/E-scratch-leave-2026-09-14/target/` = 408 MB of the stick's 1,291 MB; tails below agreed offsets (09-12 ×7, 09-14 ×32, 09-15 ×28); `dev/tail-carry.js` owns both | scratch-leave carries exclude `target/` and `node_modules/` by rule, with a printed "excluded N entries, M bytes" line; a `--prune-below-agreed` door that lists first and deletes only on a second flag; nothing deleted in the lap itself — the prune runs at the keeper's word after the listing is read |
| B | **P-NUL-REPAIRS** | `text-census.js` red on `coupling-test.js:225`, `essay-provenance.js:342`, `handback/p-boundary-read-B_2026-09-16.md:37` (A §6 and C §6 of L063: one-character escapes; the two JS uses are live key separators) | the three escapes; `text-census.js` exit 0; `coupling-test.js` and `essay-provenance.js` produce byte-identical output on one fixture before and after (the separator's VALUE is unchanged, only its spelling) |

## Chunk 3 — the two decisions, mechanised

| pane | packet | what exists | the bar |
|---|---|---|---|
| A | **P-SEAL-GATE build** | A's L062 design (`handback/p-seal-gate-A_2026-09-16.md`, nine checks with fixtures); the keeper's YES to the narrow standing push (`keeper_decisions_2026-09-16.md`) | `chair_inject` on a keyed task refuses without a sealed row on origin; the narrow push exception written into `brief/COMMITTEE.md` citing the decisions file; the gate's fixtures red-first on a copy |
| B | **P-TRAILER-GATE build** | B's L062 design (`handback/p-text-rules-B_2026-09-16.md` §4); the text already in `BUILDING.md` (b0c13f2); the keeper's YES to "a lap later" — chunks 1 and 2 are the lap it waits for | the three verbs refuse a message whose last line is not `NEXT: …`; the refusal text names the rule and the file; compliance measured over chunks 1–2's messages before the gate lands, and the number filed |

## After chunk 3

The room is at: carry safe against a ghost, launcher self-pulling on both ends, stick clean, guard green, keyed tests runnable unattended, trailers enforced. **Then the new task** — the keeper's, by door one, or the scheduler idea (`scheduler_and_unlocked_mode_idea_2026-09-16.md`) if he wants thesis run 3 first.

## Falsifier for the plan

If chunk 1 files and the next launch on either machine still opens one build behind, or the next carry still waits 600 s on a process, the chunk described the symptom and the fix is redesigned from the failing case before chunk 2 opens.
