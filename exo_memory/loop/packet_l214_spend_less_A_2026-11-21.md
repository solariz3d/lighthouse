# Packet L214 (pane A, on L): spend less without touching reasoning. Helper agents, model switches, polling

Written by the librarian on L, 2026-11-21 01:0x, at his word of 00:37 ("lets do it all up, we need to save hella usage for
this week"). Third lap of `loop/plan_usage_laps_2026-11-21.md`. For the chair to dispatch to pane A.

**Work in your own worktree and branch.** The room's main tree is where pane B installs the usage ledger from; do not edit
`dev/shell/install.ps1` or any hook on main until B has shown that install live. Probes need no edit at all.

## Why (measured tonight; `librarian/2026-11-21.laptop.md`, "00:4x" and "00:5x")

- The librarian's one reader agent of 11-14 cost 5.98 at list price over 110 calls with a largest context of 451k.
- Two model switches in warm seats that night rewrote 199k and 414k tokens; tonight's launch switched pane A twice, 300k and
  352k.
- Every poll by a watcher is a call that re-reads a whole context.

Each item below is the Third Place's read of the vendor's changelog
(`research/claude_code_features_for_consonance_2026-11-21.md`, the lines named); none is confirmed here until your probe.

## What to do, in this order

1. **Probe, no build, keys and numbers only** (as in L213, a scoped `--settings` file, never the user's):
   - helper agents: `omitClaudeMd` in an agent's definition (`:117-119`), `CLAUDE_CODE_SUBAGENT_EFFORT` (`:59-60`), the Agent
     tool's `effort` (`:99`). Show an agent's first call with and without each: its context tokens and its effort.
   - model switches: the `PreModelSwitch` and `PostModelSwitch` hook events (`:132-135`). Show the keys each receives, and
     whether `PreModelSwitch` can warn or block.
   - push in place of polling: the `StopFailure` hook (`:192-193`) and `notify_when_idle` (`:150-155`). Name each polling loop
     the room runs today, with file and line and how often it calls a model.
2. **Then build only what the probe showed real:**
   - an agent definition for this room's reader agents that omits the intake and runs at a named lower effort, and the one
     setting that makes it the default for agents the librarian spawns;
   - a `PreModelSwitch` hook that prints, before a switch in a seat whose cache is warm, how many tokens the switch will
     rewrite (from the status line's `prompt_cache.recache_tokens_if_cold` or the transcript). It warns; it does not block;
   - one polling loop replaced by its push form, the costliest one first, with the old loop left behind a switch.
3. **Registration** through `dev/shell/install.ps1`, read by pane B before it is installed, as in L213. Every new hook starts
   with the dream guard and carries the watchdog (B's catch of tonight, `handback/p-l213-read-B_2026-11-21.md`).

## Registered before code (print each in the hand-back)

- **R1:** the probe's findings, each marked seen or absent.
- **R2, red first:** a reader agent started the new way carries fewer context tokens on its first call than one started the old
  way; both numbers printed.
- **R3, red first:** the model-switch hook prints its warning on a warm scratch session and prints nothing on a cold one.
- **R4:** `node --test consonance/hooks/dream-gate.test.js` green with the new hooks in its table.

## Registered failure line

Failed if a reader agent's first call still carries the room's intake, or a polling loop named in the probe is still running
after its push form is switched on.

## Not in this lap

Changing which model or effort any seat runs. Code Mode. Mods. The gates' failure mode and the tool loading (L215). The desktop.

## Standing rules

Commit by named paths. Hooks and settings change only with a second reader. No credentials or account details in any file or
command. Hand-back as a file in `exo_memory/handback/`, rung to the librarian as a pointer, each state claim marked checked or
inferred, ending with who acts next.
