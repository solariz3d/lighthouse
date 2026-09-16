# The pane battery — RUN 1, tonight, at the keeper's word. Librarian (the lineage, on L), 2026-09-16 04:1x.

*The keeper, 04:08: "no lets finish the battery run." Registration: `loop/pane_battery_registration_2026-09-16.md` (DRAFT, amended §9–§10). Design: `handback/p-battery-blind-E_2026-09-16.md`, `handback/p-battery-cost-C_2026-09-16.md`, `handback/p-battery-attack-B_2026-09-16.md`. This plan registers the ORDER before any cell exists, so running a subset tonight is not a post-hoc change (§6).*

## The concern, stated once

The full battery is 24 cells (six tasks × four panes) plus keys, fresh scorers and the keeper's clicks; it is several shifts. Tonight has under four hours to the 08:00 close. Two tasks cannot ship as written (T4 is at ceiling by the room's own rule; T6 scores a pair) and A5 says a task that cannot state its ceiling does not ship. So RUN 1 is the key-scored, mechanically-scored tasks that can be sealed in the next thirty minutes, and the rest are RUN 2 on a fresh shift — declared here, not after a table is seen.

## Run 1 tonight, in this order

    T3  FIND PRIOR ART  — all four panes (B with the contamination note on its cell, A1).
        Question: is the code or the corpus bloated — where was it asked, measured, ruled.
        KEY: `loop/battery_run1_T3_key_2026-09-16.md`, written by the librarian, committed and PUSHED before
        dispatch; the librarian does not score T3. Ceiling named in the key.
        SCORER: a fresh pane (E's E2: the key and the four redacted hand-backs in its own cwd; every read
        outside it denied) — or the keeper for the mechanical count. This spawn is also E's §4.3 click
        measurement, for free.
    T2  CONTEST A TEXT  — A, C, E only (B is out, A1).
        The chair plants N defects in a committed document it chooses from the open queue, writes the sealed
        defect list to its scratchpad, commits ONLY the list's sha (A8 triple), pushes, then dispatches.
        Ceiling: every pane finds all N → VOID. Second number (A6): real defects claimed / confirmed, adjudicated
        by the librarian (not dispatcher, not author, not subject).
        SCORER of the planted fraction: the librarian, against the chair's list after dispatch closes.
    T5  CATCH A PLANTED DEFECT IN RUNNING CODE — A, C, E only, IF the clock allows after T2.
        The chair plants N defects in a COPY of one tool (never the live checkout — copies only), sealed list as
        for T2. Ceiling as for T2. Scored by the librarian.

RUN 2, fresh shift, not tonight: T1 (needs a committed mutant list by a non-subject and a runner), T4 and T6
(fixed or dropped per A5), the test–retest second task per kind (A4), and B's replacement cells.

## What must be true before the first dispatch, and who does it

1. **The digest hook is off for the window (A3) — the keeper's hands.** `~/.claude/settings.json`, the
   `UserPromptSubmit` entry whose command is `board-digest.js` (lines 37–41 tonight): remove it, note the clock.
   User settings load immediately (`journal/2026-08-17.md`, the hook finding), no restart. Restore it after the
   last cell is scored; the window's start and end go in the run file.
2. **The keys are sealed and pushed.** T3's key by this seat (this commit); T2's and T5's lists by the chair.
   `git log origin/main..HEAD` must be 0 before the brief goes out.
3. **One brief per task, identical, no role words**, run through `dev/diversity/redact.js` with the arm-word
   list plus the role-word list committed with the brief (§3). The four dispatches go out together (A3).
4. **The leak check is written down with its command before dispatch**, per cell: grep the pane's transcript for
   the other three panes' T-hand-back paths and for `↳` lines naming another pane inside the window; a hit VOIDS
   that cell. The window's bounds are the timestamps of the dispatch and of the hand-back's commit.
5. **The prediction stays sealed as (0a54c5a, path, 8bf0b5ee…)** and nobody re-reads it before scoring.

## The librarian's part tonight

Wrote and committed the T3 key (this commit); does NOT score T3. Scores T2 and T5 against the chair's sealed lists
after each dispatch closes, and adjudicates the second number. Runs the leak check per cell. Collates the run into
`librarian/2026-09-16.md` with every count beside its command. Writes the run file's first line as E's §6 requires:
what was scored, what the gate said, and that RUN 1 is three of six tasks by prior declaration.

## Not done tonight, said so nobody reads it as done

No comparative table across kinds — three tasks are three tasks. No fresh-pane guess gate unless the T3 scorer is
spawned fresh (then it is run once, on T3 only, and reported). The run's honest first line will say RUN 1 · T3 T2 T5
· two of three with B absent by contamination · the rest on a fresh shift.
