## 5. Not done / Limits

- Nothing built or scored by me; the librarian scores.
- Two probe sessions outside the 15: probe 1 (context isolation and model, 2.3 s, 1 turn) and probe 2 (the exact
  builder spawn shape: prompt on stdin, `--safe-mode --dangerously-skip-permissions --add-dir`, one Bash call → result
  `probe-ok`, 2 turns, 6.1 s, 0 permission denials; `scratchpad/probe/probe2.json`).
- **The arm worktrees hang off `C:/Users/nname/Desktop/t180-track-builder`, which the chair's 13:20Z brief named as "never
  touch".** Found at 23:4x Z while locating `local-0.4.9` for D418 (it lives in `C:/Users/nname/Downloads/t180-track-builder`;
  the Desktop clone has no such branch). checked: `run.js:22` → `T180 = 'C:/Users/nname/Desktop/t180-track-builder'`;
  `git -C <Desktop clone> branch --list "d411-*"` → 8 branches; `git worktree list` → 8 `p-d411-*` entries beside the room's
  own a-/b-/c-/e-/lib- worktrees there. What was written to that clone: 8 branch refs and 8 `.git/worktrees/` entries; its own
  working tree was not touched (`git status --short` there shows only what was already dirty). The four lap bases resolve in
  it (the packet's shas were taken from it), so the trial's trees are the right trees. inferred: the chair's "never touch" meant
  the keeper's checkout itself, as with the installed builder; if it meant the clone's refs too, the review trees (not yet made)
  can be cut from the Downloads clone and the eight arm branches deleted after the librarian has read them. The librarian's call.

