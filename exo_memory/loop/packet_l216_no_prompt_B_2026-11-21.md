# Packet L216 (pane B, on L): a builder pane no longer waits on a prompt nobody sees, by the app's launch and not by a settings file

Written by the librarian on L, 2026-11-21 04:1x, at his word of 03:46 ("do it all, why didnt you start"). It is step 5 of
L215, re-routed by A's probe. For the chair to dispatch to pane B AFTER B has landed L215.

## Why, and what A's probe changed (`handback/p-l215-fail-closed-A_2026-11-21.md`, R1 and "Step 5"; A's, seen by A)

- A builder pane sat on the harness's permission prompt tonight until he clicked (pane A, a Bash call with no result from
  07:09:33Z; `librarian/2026-11-21.laptop.md`, "01:1x: the ledger is installed").
- `permissions.denyInsteadOfPrompting` works from a `--settings` flag: the call is denied, the seat is told nobody can
  answer a prompt here, and the turn goes on.
- It is NOT honoured from `.claude/settings.local.json` or `.claude/settings.json` in a seat's folder (asked 1x, three runs).
  So the L215 packet's route (each builder's instance folder) does not work.
- It also denies a hook's own "ask". The dispatch gate asks on purpose, on `chair_inject|call_chair`
  (`dev/shell/install.ps1`, the dispatch gate's row). Builder panes use neither verb; the chair and the librarian do.
  So the setting must reach BUILDER panes only, never the chair, the librarian or the Third Place, where he sits.

## What to do, in this order

1. **Probe first:** how a builder pane is launched today (`consonance/src-tauri/src/main.rs`, `spawn_claude_pane` at about
   `:1163`, with `--resume`, `--model` and `--dangerously-skip-permissions` at `:1196-1209`; `spawn_sibling` `:4049`,
   `spawn_fresh` `:4086`). Say which seats pass `skip_perms`, and why pane A was still prompted tonight under it (the
   prompt's text is in A's transcript at that time). If the answer shows the prompt is of a kind this setting does not
   deny, stop and say so.
2. **Build:** the builder panes' launch gains `--settings` with `{"permissions":{"denyInsteadOfPrompting":true}}`. Not the
   chair's, the librarian's or the Third Place's launch. One switch in `~/.consonance.json` turns it off without a rebuild.
3. **Build and show it live as at L212's landing** (`handback/p-l212-land-B_2026-11-21.md`): the heavy-run status first, in
   one call with the build; the running exe is not replaced under a running app; his relaunch picks it up.

## Registered before code (print each in the hand-back)

- **R1:** the probe's answers, with file and line, and the prompt's own text from A's transcript.
- **R2, red first:** a source row: a builder pane's launch carries the setting; the chair's, the librarian's and the Third
  Place's do not; the config switch removes it.
- **R3, live in a scratch session launched with the same arguments:** a call that would prompt is denied and the turn goes
  on; the text the seat saw.
- **R4:** the Rust suite's count before and after, and `whats-live` after his relaunch (owed then, not now).

## Registered failure line

Failed if, after his next relaunch, a builder pane again sits on a permission prompt, or the chair, the librarian or the
Third Place loses a prompt it had (the dispatch gate's ask among them).

## Not in this lap

Any gate's failure mode (his ruling, asked). The user settings file. The desktop.

## Standing rules

`node consonance/tools/heavy-run.js --status && <run>` in one call before the build; exit 1 means run nothing. Commit by
named paths. A second reader who is not the author reads the diff before it lands (pane A). No credentials or account
details in any file or command. Hand-back as a file in `exo_memory/handback/`, rung to the librarian as a pointer, each
state claim marked checked or inferred, ending with who acts next.
