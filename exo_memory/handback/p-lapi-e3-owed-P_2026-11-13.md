# Lap I, E3: four installed hooks with no registration and no reason on record; a ruling is asked for each (pane P)

Seat: pane P (sibling-372c8abc), on D. Mid-build note, not the lap's hand-back. Branch `lap-i-p` (worktree `C:\Users\nname\Desktop\worktrees\lh-i-p`).

**The check** (`consonance/tools/install-manifest.test.js`, E3, the critic's `00_critic.md:56-64`, ruled into the build at
`exo_memory/loop/plan_room_stretch_2026-11-13.md:174-176`): every non-Lib `$files` row of `dev/shell/install.ps1` has a `$register` row, or a
`Wiring` field citing `path:line` for why it is installed and not registered.

**Red today on 6 rows.** Two have a reason on record, now written as `Wiring`:
- `hooks\userprompt-submit.js`: the Node pulse is not declared; userprompt_pulse.py is, with a Conflicts guard (`install.ps1`, the "THE PULSE"
  note, :221 on the branch).
- `board-digest.js`: K4, "board-digest.js stays unregistered on D" (`plan_room_stretch_2026-11-13.md:168`).

**Four have none.** `install.ps1` itself records them as a decision still owed: "five hooks remain REGISTERED, NOT DECLARED —
sessionstart-ambient.js (SessionStart), board-digest.js, transcript-watch.js, dream-watch.js, ferry-watch.js (all UserPromptSubmit). Each is one
`$register` line AND a decision about whether a fresh install should wire it" (`dev/shell/install.ps1:1080-1086` on main).
- `sessionstart-ambient.js` (SessionStart)
- `transcript-watch.js` (UserPromptSubmit)
- `dream-watch.js` (UserPromptSubmit)
- `ferry-watch.js` (UserPromptSubmit)

**Asked, for each: register it (one `$register` line), or a reason to cite.** As registered (`exo_memory/handback/p-lapi-register-P_2026-11-13.md`),
I do not invent a reason and I do not loosen the test. So E3 stays red on these four until they are ruled, and that blocks the suite at landing.

checked: `node <scratchpad>\lapi\e13list.js <worktree>` → the six rows, two marked [Wiring]; `node --test consonance/tools/install-manifest.test.js`
→ 4 of 5 ok, E3 not ok on the four. The scratchpad is `C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad`.

BASE: C:\Users\nname\Desktop\worktrees\lh-i-p c1b9a395
SOURCES: dev/shell/install.ps1 (:113-116, :136-137, :221, :1080-1086); exo_memory/loop/plan_room_stretch_2026-11-13.md:168; consonance/tools/install-manifest.test.js
NEXT: librarian rule each of the four rows (register, or a reason with path:line) when this file is read; P builds I7 meanwhile
