# Packet L214-land (pane B, on L): second read of A's spend-less lap, its install, and two chores

Written by the librarian on L, 2026-11-21 03:5x, at his word of 03:46 ("do it all, why didnt you start"). For the chair to
dispatch to pane B. It runs BESIDE pane A's L215 (`loop/packet_l215_fail_closed_A_2026-11-21.md`); A works in its own
worktree and touches nothing on main.

## First, two chores (owed since the relaunch)

1. Delete `C:\build\lighthouse-target\release\consonance.exe.running-before-l212` (look at it first; the running exe was
   built 01:06:54 local and started 01:18:49).
2. Push the room's main. It is ahead of origin by the librarian's commits of tonight.

## Then the second read (you are not the author; vary what A fixed, do not repeat A's commands)

Read on branch `l214-spend-less` (f6fba66e), A's hand-back first:
`exo_memory/handback/p-l214-spend-less-A_2026-11-21.md`, then
`exo_memory/handback/p-l214-spend-less-A_2026-11-21_evidence/install_and_gate.diff` and
`consonance/hooks/model-switch-note.js` with its test.

**What the librarian's own read found (03:5x; check each, they are not rulings):**

- `p-l214-spend-less-A_2026-11-21_evidence/r3_live_warning.txt` is **0 bytes** on the branch
  (`git cat-file -s l214-spend-less:<that path>` prints 0). The hand-back cites it as holding the live warning. The row
  beside it (`r3_live_row.jsonl`: context_tokens 26536, warm true, est_usd 0.0053) is there. So the live warning's text is
  on record only in A's prose. Run R3 live once yourself, in a scratch session and never in a working seat, and keep the
  text in a file that is not empty. If you can see the note in a real terminal after `/model`, say so; A could not.
- A's 3,765 against 44,964 is a scratch folder on Haiku. The number on the room's real intake is A's `inferred:`. The
  librarian measures it after your install by starting one `room-reader` and reading its first call. Not yours to do.
- The hook writes `session` (8 characters) and model ids to `<data>/model-switch.jsonl`. Confirm a row holds no text
  longer than a model id, as L213's R4 did for the ledger.

## Rulings, so you need not ask (the librarian's; say so if the code disagrees)

- **The reader agent's definition** (`dev/shell/agents/room-reader.md`) is installed to `~/.claude/agents/room-reader.md`
  by `dev/shell/install.ps1`, as a new destination with its own row in the install tests. User level, so every seat's
  Agent tool can name it.
- **`CLAUDE_CODE_SUBAGENT_EFFORT`** is set to `medium` in the `env` block of the user settings, by `install.ps1`, with a
  backup and a check that nothing else in the file moved. Before you set it, probe once which wins when both are present:
  the variable, or `effort: low` in an agent's own definition. Print the answer. The room-reader is meant to run at low.
- **The model-switch hook** is registered as A's diff has it: `PreModelSwitch`, no matcher, warn only.

## Then land it

Merge `l214-spend-less` into main, run the install, and show it live.

## Registered before code (print each in the hand-back)

- **R1:** your read's findings, each marked seen or not seen, including the three above.
- **R2, red first:** a row that fails before the agents destination exists and passes after: a fresh home gets
  `agents/room-reader.md`.
- **R3:** the live warning's text in a non-empty file, from your own run.
- **R4:** after the install: `node --test consonance/hooks/dream-gate.test.js` green; `landed-live.js --all` with every
  entry live; the user settings hold the `PreModelSwitch` entry and the one `env` key, and no other key moved.
- **R5:** the precedence answer (variable against definition), with the two requests' effort values printed.

## Registered failure line (L214's, carried)

Failed if a reader agent's first call still carries the room's intake, or a polling loop named in the probe is still running
after its push form is switched on.

## Not in this lap

Any change to which model or effort a SEAT runs. The app's Rust code (no build, no relaunch). The desktop.

## Standing rules

Commit by named paths. No credentials or account details in any file or command. Hooks and settings change only with a
second reader: you are that reader here, and A or the librarian reads what you add (the agents destination, the `env` key)
before the install runs. Hand-back as a file in `exo_memory/handback/`, rung to the librarian as a pointer, each state claim
marked checked or inferred, ending with who acts next. When A rings with L215, its diff comes to you for the same read.
