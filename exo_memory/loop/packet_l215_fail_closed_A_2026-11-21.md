# Packet L215 (pane A, on L, Sonnet 5.5): the gates that must block do block when their process dies; a pane no longer waits on a prompt nobody sees

Written by the librarian on L, 2026-11-21 03:5x, at his word of 03:46 ("do it all, why didnt you start"). Fourth lap of
`loop/plan_usage_laps_2026-11-21.md`. For the chair to dispatch to pane A. It runs BESIDE pane B's landing of your L214
(`loop/packet_l214_land_B_2026-11-21.md`).

**Work in your own worktree, on a new branch cut from `l214-spend-less` (f6fba66e)**, so your rows in
`dev/shell/install.ps1` sit on top of L214's. Touch nothing on main. Install nothing. Pane B reads your diff before it lands.

## Why

- **The gates fail open.** The Third Place's read of the vendor's changelog
  (`research/claude_code_features_for_consonance_2026-11-21.md:104-106`, that seat's read, not checked): `onFailure: "block"`
  for command hooks (2.1.295) makes a hook that cannot start, times out or exits oddly block the action. Today a gate whose
  process dies lets its action through. The room's own earlier read agrees on the mechanism
  (`loop/wake_level2_2026-11-13/first_dispatch_gate.md:132`, `:294`: a timeout does not block unless it is set).
- **A pane sat on a prompt for minutes tonight.** Yours: a Bash call with no result from 07:09:33Z, waiting on the
  harness's own permission prompt, until he clicked it (`librarian/2026-11-21.laptop.md`, "01:1x: the ledger is installed").
  The same research names `permissions.denyInsteadOfPrompting` (2.1.319, `:54-56`): the call is denied and the turn goes on.

## What is NOT in this lap, and why (changed from the plan's row)

- **MCP `alwaysLoad` is dropped.** The research took it back in its own closing lines (`:251-253`): it loads the
  consonance server's tools into every request, so it saves one lookup per wake and spends context on every call. That is
  the wrong direction for a usage lap. Do not build it.
- A gate that is fail-open BY DESIGN stays fail-open. `install.ps1` says so for several (`:197`, `:206`, `:211`, `:320`:
  the sources gate, the reply slot, the ask-ending log, the dispatch gate). Do not change those.

## What to do, in this order

1. **Probe, no build, keys and behaviour only** (a scoped `--settings` file, never the user's, as in L213 and L214):
   - `onFailure: "block"` on a command hook: where the key sits in a hook entry, and what the harness does when the hook's
     process cannot start, when it is killed mid-run, and when it times out. With the key and without it.
   - `permissions.denyInsteadOfPrompting`: where the key sits, at which settings levels it is honoured (user, project,
     `settings.local.json` in a seat's folder), and what a seat sees when a call is denied this way (the text it gets back).
     Show whether a hook's own "ask" decision is denied too, because the dispatch gate ASKS on purpose.
2. **Name the gates.** For every registered `PreToolUse` gate (`delete-gate`, `push-gate`, `wake-gate`, `dispatch-gate`,
   `sources-gate`, `second-reader`), one row: what its header says it must do when it fails, with file and line. Only a gate
   whose own header or plan says it must refuse is switched to block. Print the table before any edit.
3. **Build:** the `onFailure` key on those entries through `install.ps1`'s register table, and an explicit timeout on each.
4. **The way out, built in the same change.** A blocking gate whose process cannot start refuses EVERY call it matches,
   and a seat can then do nothing, including repair itself. So: one named switch that he or any seat can use to put the
   gates back to fail-open without a working gate (a flag of `install.ps1`, or a key in `~/.consonance.json` that the
   installer reads), written in the hand-back as one line he can run. Show it working on a scratch settings file.
5. **The prompt setting:** for the BUILDER panes only (A, B, C, E), in each instance folder's `.claude/settings.local.json`,
   not in the user settings. He sits at the chair, the librarian and the Third Place, and a prompt there reaches him; in a
   builder pane nobody may be looking. If the probe shows the setting also denies the dispatch gate's "ask", stop and say so
   before building it.

## Registered before code (print each in the hand-back)

- **R1:** the probe's findings, each marked seen or absent.
- **R2, red first:** kill a gate's process (or point its entry at a script that cannot start) and show the action goes
  through today; with the key, show it is refused.
- **R3:** the gates table of step 2, with the ones switched and the ones left, and why for each.
- **R4, red first:** the way out. With the gates blocking and broken, the switch restores a seat that can act.
- **R5:** a call that would prompt in a builder pane's settings is denied and the turn goes on; the text the seat saw.
- **R6:** `node --test consonance/hooks/dream-gate.test.js` green; the install tests green
  (`install-manifest`, `install-holds`, `install-fresh-home`).

## Registered failure lines

- Failed if a killed gate still lets its action through (the plan's line, carried).
- **Failed on the room if** a seat is left unable to act by a blocking gate and the way out of step 4 does not free it.
  Then every gate goes back to fail-open until the cause is found.

## Standing rules

Commit by named paths. Hooks and settings change only with a second reader (pane B). Every new or changed hook keeps the
dream guard first and the watchdog. No credentials or account details in any file or command. No heavy run, no Rust build.
Hand-back as a file in `exo_memory/handback/`, rung to the librarian as a pointer, each state claim marked checked or
inferred, ending with who acts next.
