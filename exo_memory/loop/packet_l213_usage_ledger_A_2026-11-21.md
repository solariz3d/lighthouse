# Packet L213 (pane A, on L, Sonnet 5.5): a usage ledger, so the room sees what moves the weekly limit

Written by the librarian on L, 2026-11-21 00:4x, at his word. For the chair to dispatch to pane A. It runs BESIDE pane B's
L212 at his ask ("We need to get these fixes done as quick as we can to stop usage bleed"). It touches no file of L212
(`consonance/src-tauri/`, `consonance/tools/close-small.*`).

## His words (verbatim; `briefs/lighthouse_the_room.md`, the entries of 2026-11-21)

- 00:14: "i wonder if we could some how measure or deduce how to keep some things on but without limiting our reasoning ability.
  Basically the best we can be without tanking our weekly usage within the first few days"
- 00:37: "lets do it all up, we need to save hella usage for this week"

## Why

Tonight's count prices tokens at API list prices as a stand-in (`node exo_memory/loop/seat_cost_2026-11-21.js --since <ISO>`;
`librarian/2026-11-21.laptop.md`, "00:4x"). How the subscription weights its weekly limit is not published. The Third Place's
read of the vendor's changelog names three things the harness may already give
(`research/claude_code_features_for_consonance_2026-11-21.md:127-137`, `:190-191`; that seat's read, not checked):
a status line script receives `rate_limits` (the 5-hour and 7-day windows) and a `prompt_cache` object; `/cost` has a
per-session cache line; a SessionStart hook on resume receives the session's staleness and an estimated re-cache cost.

## What to do, in this order

1. **Probe first, no build:** for each of the three, show what the harness really hands over on this machine (version
   2.1.330): the KEYS of the JSON a status line script receives, and of a SessionStart resume hook's input. Keys and numbers
   only; no transcript text, no account name, no email. If one of the three does not exist as described, say so and go on with
   the others.
2. **The ledger:** one row per turn per seat appended to `C:\Consonance\data\usage-ledger.jsonl`: time, seat, model, the
   5-hour and 7-day figures, the cache fields (read, written, warm or cold), the context size. Numbers only.
3. **A reader:** `node consonance/tools/usage-ledger.js --since <ISO>` prints, per seat, how far the 7-day figure moved while
   that seat was the one working, beside its token counts by class.
4. **Wake cost:** if the resume hook gives a re-cache cost, write it to the ledger at each wake and say in the hand-back how
   it compares with this seat's hand count tonight (529k tokens written at the 06:05Z wake).
5. **Registration:** whatever must be added to the user settings goes through `dev/shell/install.ps1` as the other hooks do,
   and pane B reads that diff before it is installed. Say first whether a status line is already configured here and what
   would be displaced.

## Registered before code (print each in the hand-back)

- **R1:** the probe's findings for all three, each marked seen or absent.
- **R2, red first:** a row that feeds the reader two ledger lines and checks the per-seat movement it prints.
- **R3:** after one working hour tonight, the reader's output on L.
- **R4:** the ledger file holds no text field longer than a seat name or a model id (a row, not a reading).

## Registered failure line

Failed if, after one working night, the ledger cannot say which seat moved the 7-day figure most.

## Not in this lap

Any change to a model, an effort level, a compaction window or the keep-warm timing. The desktop.

## Standing rules

Commit by named paths. Hooks and settings change only with a second reader. No credentials or account details in any file or
command. Hand-back as a file in `exo_memory/handback/`, rung to the librarian as a pointer, each state claim marked checked or
inferred, ending with who acts next.
