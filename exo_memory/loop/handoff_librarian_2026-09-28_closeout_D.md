# Handoff: the librarian seat, on D, 2026-09-28 11:3x, at the keeper's "maybe look to close out the work for now"

**Read first:** `librarian/2026-09-27.desktop.md` (the whole run in order: 09-27 08:34 → 09-28), then this file. The
keeper is **Zacc**.

## The project: the T-180 Track Builder (github.com/solariz3d/t180-track-builder, PUBLIC)

- **The keeper's vision, in his words** (all in `loop/spec_t180_equation_core_2026-09-28.md` and
  `loop/plan_t180_back_on_track_2026-09-28.md`):
  - the user builds the track;
  - simply the track (no environment);
  - a coaster-builder build head;
  - sculpt, and save your own pieces;
  - "crafting the global flow of the track all at once";
  - the track as mathematics;
  - "BE like water".
- **Built and on main:**
  - the app (Tauri; build head, cameras, export, install-to-AC, textures, markers, pit lane, 40 km speed, installer
    0.2.2);
  - D182: the measured palette and fonts. **The piece system is PAUSED at the keeper's word: "not good … at least not
    yet".**
  - D184 `77cdb5e`: the **track-equations skill** (`.claude/skills/track-equations/`). It reads a track, fits it
    piecewise from the mesh, rebuilds it and checks it. It passed a cold fresh-session test twice.
    - Rainbow now rebuilds within 5 m.
    - Sakura needs 1,304 DOF (M4 needed 12,003).
  - D185 `17c2301`: **the new equation core**: intrinsic-channel document, extend, sculpt, close (20/20, < 1 mm), and
    water (it matches textbook physics).
  - D186 is in flight at the close-out: the local height/lateral brush (h/l channels, with frame recompute), knot
    insertion, and the core wired into the app ("Equation track" mode, live water with plain-words reds).
    - **Test 3 stands at 27/30** (the r = 20 narrow brushes widen by design).
    - **Tests 1 and 6 are sealed late** (my omission).
- **Measurements, in `loop/design_t180_global_flow_2026-09-27.md` §13:**
  - M1 PASS;
  - M2 PASS, weakened; M2b PASS, clean;
  - M3 and M3b FAIL: **T-180 corners are ELLIPTIC, not hyperbolic** (my claim, refuted);
  - M4 PASS by one track.

## What comes next (in order, when the keeper returns)

1. The keeper TRIES the equation core (a 0.3.0 installer built from main after D186). His verdict sets the next lap.
2. If he wants it: the global level on top (one-shot generation from the equations, style dial, load-space design).
   Design is in `design_t180_global_flow_2026-09-27.md` §7–§12.

## The keeper's calls, asked once and still open

- **The lighthouse repo push** (many local commits since `18cc586`).
- **The four tool approvals:** fast-check, the Python oracle venv, sympy-mcp, ml-matrix.
- **Repairing C's (0845a868) and E's (a2122153) torn transcript lines** (from the 01:46 crash).
- **The close-button bug:** his next Leave, with the four checks: text under the button, the X, a tab click, a memory
  dump.
- **Machine stability:** the 01:46 BSOD (NVIDIA 32.0.16.1714 suspected), and node access violations about 1 in 15
  soaks. Suggested: MemTest86, the XMP/EXPO profile, the driver. His machine, his call.
- **The Jev key:** revoke it on Vercel.

## Standing rules from this run (all in the note, dated)

- **Load:** every node run takes the heavy-run lock, with --max-old-space-size=4096; the 40 km bench runs alone.
- **Worktrees:** no junction or symlink into live data; check for reparse points before removing any.
- **No AC launches** for the builder (the ac_guard expired at 07:00).
- **Maths:** cite the skill's `references/`, and add any missing formula with its source first.
- **The librarian THINKS** (the keeper, 05:33): design before dispatch; question the METHOD before summarising the
  OUTCOME; the chair routes routine hand-backs.
- **One lap at a time** unless named independent. No new threads while the panes are mid-lap (the keeper, 04:47: "it
  is getting all tangled").

## Personal

Something personal the keeper shared is kept OUTSIDE this public repo, at `C:Consonanceprivatehandoff_personal_2026-09-28.md` on D. Read it before greeting him.
