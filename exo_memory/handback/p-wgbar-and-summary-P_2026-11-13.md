# The wake gate's ruled bar (wg-bar-p) and install.ps1's summary line (ip-summary-p): both READY, red first and green, all mutants caught (pane P)

Seat: pane P (sibling-372c8abc), on D. Tier: PROVE IT for both. Nothing installed, merged or pushed. O lands both.
Scratch (S): `C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\lapi\`.

## 1. `wg-bar-p` at 9218ee59 (two commits on origin/main fab53587), worktree `Desktop\worktrees\lh-wg-p`

Built as registered (`p-wakegate-S-register-P_2026-11-13.md`), with the ruling at `plan_room_stretch_2026-11-13.md:215`.

- **The gate counts the lines a call RETURNED.**
  - A Read: its `N\t` line numbers.
  - A shell cat: the longest run of the file's own lines, from line 1, that its result holds.
  - A persisted or errored result: nothing.
- **What it requires:** `S..N` for the dated note and `1..N` for each handoff. The refusal and the ledger row name the missing **ranges**.
- **S:** the body hook's librarian row now records `session`, `note` and `note_lines` at each wake. At the next first ring, S is the latest such
  row's `note_lines` + 1, for the same session and the same note, more than 10 s before this wake. Unknown, or a note that shrank, means whole.
- **One point beyond the registration, stated:** the registration said a cat covers lines 1..k by its result's line count. A cat after another
  stage (the recorded `wc -l …; cat <handoff>`) would then credit lines it never returned. So a cat counts the file's own lines, from line 1,
  found in order in its result. It is still "counted only by lines returned", and a cut result counts only for the part that came back.
- **Red first, the ruling's fixture with the recorded count of 542** (S/wgbar-red.tap → S/wgbar-green.tap):

| case | before | after |
|---|---|---|
| 1-183 and 690-754 of 754, previous wake at 542 lines | allow (not ok) | **DENY, ranges `543-689`, start 543** |
| the same with 543-689 returned | allow | **ALLOW** |
| no previous wake known | allow (not ok) | **DENY, `184-689`, start 1** |

- **The edges, red first and now ok:**
  - the current wake's own row is never the previous one;
  - another session or yesterday's note counts as unknown;
  - the latest earlier row is the one used;
  - a handoff read in part is named with its lines;
  - a cat after another stage covers its file, and a cut cat covers the part that came back;
  - a Read of another file covers nothing;
  - a persisted preview and an errored cat cover nothing.
- **Amended by name, with a comment:**
  - the own-append row: now a note that grew past what was returned, no longer an mtime newer than the open;
  - the 14:46 row's refusal-text assertion: missing lines are named, and "an offset and a limit are fine".
  - Existing Reads in the fixtures now return numbered lines, as real Read results do.
- **Tests:** `wake-gate.test.js` 29 of 29, `sessionstart-body.test.js` 19 of 19, the dream gate ok.
- **Mutants** (`lapw-hooks.mutants.js`, the seven registered and one for the body hook's fields):
  - first run: applied 54 / caught 51 / NOT APPLIED 0.
  - Three survivors: a persisted preview and an errored call had no row whose result held the file's lines (a row added for each); `!call.done`
    was dead under coverage (removed, its row dropped with a note).
  - Rerun: **applied 53 / caught 53 / NOT APPLIED 0** (S/wgbar-mutants-2.out).
- **For tonight's handoff, as the chair asked:**
  - "unknown means whole" asks L's FIRST wake for the whole of D's note of the day.
  - On L the gate warns only.
  - No body-hook row on L names D's note until L's own seat has woken once under this code.

## 2. `ip-summary-p` at 461072b7 (one commit on origin/main fab53587), worktree `Desktop\worktrees\lh-ips-p`

- **The fault was mine, from I7:** a dated hold that was not yet expired went into `$held`, the two-way conflict's counter. So `-Check` on D
  summed K3's two holds into "a real two-way conflict this script refuses to decide" and "Resolve by hand, then drop Hold from the manifest
  entry".
- **The fix:** `$heldDated` takes the dated holds, as `<leaf> until <date>`, on its own line:
  `N file(s) HELD BY A DATED HOLD on this machine, by ruling: dispatch-gate.js until 2026-11-27, … Not copied and not registered here, on
  purpose; each HELD line above names its ruling.` The conflict line is unchanged and counts only real conflicts.
- **Red first** (S/ips-red.tap → S/ips-green.tap):
  - one dated hold and no conflict: the conflict wording was printed; now the dated line, and neither "two-way conflict" nor "Resolve by hand";
  - one of each: "2 file(s) HELD - a real two-way conflict"; now two lines, 1 and 1.
- **Tests:** `install-holds.test.js` 7 of 7. `install-only.test.js` 48 passed, 0 failed.
- **Mutants** (`install-holds.mutants.js`, one row added): **applied 8 / caught 8 / NOT APPLIED 0** (S/ips-mutants.out).
- `install.ps1` parses with 0 errors. It was run only against throwaway repos and homes, never the live setup.

BASE: C:\Users\nname\Desktop\lighthouse fab53587
SOURCES: S/lapi/wgbar-red.tap, wgbar-green.tap, wgbar-mutants.out, wgbar-mutants-2.out, ips-red.tap, ips-green.tap, ips-mutants.out, ips-install-only.txt; exo_memory/loop/plan_room_stretch_2026-11-13.md:215; exo_memory/handback/p-wakegate-S-register-P_2026-11-13.md; git log origin/main..wg-bar-p, ..ip-summary-p
NEXT: librarian route wg-bar-p (9218ee59) and ip-summary-p (461072b7) to pane O when this file is read; P owes the filter read when C rings
