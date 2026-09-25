# PANE BATTERY RUN 2 — the §9 packet for the keeper (S3). D135, B, 2026-09-24. Run 2 does NOT run from this file.

**Draft:** `loop/pane_battery_run2_DRAFT_2026-09-19.md`. Today it gained E's twelve amendments, adopted, and a proposed
thirteenth, A13 — all in its §12.

**This packet holds no task text, key, plant or answer. None exists yet.** Items 1, 3, 4 and 8 are **not ready**, for the
one reason in the box below. Items 2, 5, 6 and 7 are ready.

> **THE STOP, and the question for you.** Preparing the tasks by hand on this machine cannot be kept away from the
> subjects (A, C, E):
> - a seat that writes or reads a task or key records it verbatim in its own session transcript under `~/.claude/projects/`, which every pane can read;
> - E's A5, adopted, voids any task whose key or wording appears in any transcript.
>
> So a hand-authored task either leaks or voids itself, and that goes for the librarian scoring a cold reader before
> dispatch too.
>
> **A route that works is measured:** `claude -p --no-session-persistence` leaves no transcript at all, where the same call
> without the flag leaves one. Under A13, every task, key, cold reading and cold score is made by such isolated processes
> into an off-repo directory, and the seat running them sees only sha256 digests and counts.
>
> **It spends roughly 1–3M tokens of your usage before any subject runs** (a hand-made estimate, §12.4). **Say yes to A13
> and its cost, or no — and whether the load block is in.** Nothing further is prepared until you do.

## The eight items (the draft's §9)

1. **The §1 cold-reader results for every task, and what was rewritten or dropped.** **NOT READY: no task exists** (the
   box above).
   - What is ready is the route: isolated `claude -p` with `--setting-sources project`, hooks off, an empty strict MCP config, tools per kind, a fresh temp cwd, and `--no-session-persistence`.
   - That route still loads your global `~/.claude/CLAUDE.md` (C's D133, #87590; the reader quoted its first bullet verbatim). **It does not bias the control:** every subject loads the same file, so cold vs pane still differs by exactly the room.
   - A2 (adopted) means **two** cold readers per task.
2. **The §2 scan's output, including the positive control failing as it must.** **READY for the controls; there are no
   real briefs yet.** The tool is built to §2.1 as amended by A10/A11 and prints no brief text, only line numbers and
   criterion ids. 5 of 5 controls behave as expected:
   - **the positive control, `primed1.txt` vs A4: FAIL**, exit 1, FAIL-2 at line 3 on the "objection … own reading" criterion;
   - A3's case passes lexically, which is why a non-subject's semantic mark follows the scan;
   - the negative control passes, the locus check fails as it should, and a class word doesn't trip it.
3. **The one-file sealed rows, and `git branch -r --contains` for each.** **NOT READY: nothing to seal**, because no key
   exists. When keys exist, each row is `(commit, path, sha256)` in a one-file commit under `exo_memory/loop/`, landed by
   the chair and on origin before any delivery.
4. **The load packet's two real items.** **NOT READY, and yours to choose:** they are real queue work. The default stays
   "designed in, not run" (draft §10.2). With load in, A8's Latin square needs a, b and c per kind (12 tasks, not 8).
5. **B out as a subject, and why.** B wrote this design and every check a subject is scored under (draft §7). **The
   subjects are A, C and E**, so a result is an ORDER, never a rate (§5).
6. **The cost.** Draft §12.4, restated with A2's doubled cold block, A12's scoring block and A13's authoring block: roughly
   1–3M tokens before any subject cell, hand-made, and a bound on nothing. Subjects: 24 cells, or 36 with load, at C's
   34–44k intake upper bound each.
7. **The digest-window plan** (draft §3.4, unchanged). `board-digest.js` is off for the whole window. The window's end is
   conditioned on the board's last delivery row for the run, not on a file. It's your hook on your machine; start and end go
   in the run file.
8. **The prediction's triple.** **NOT READY: it is the chair's**, sealed and on origin before any dispatch (draft §7).
   Only its (commit, path, sha256) will be shown to you.
