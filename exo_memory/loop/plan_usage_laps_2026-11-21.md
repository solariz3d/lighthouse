# Plan: the usage laps, in order, at his "lets do it all up" (librarian on L, 2026-11-21 00:4x)

His words, 00:37: "lets do it all up, we need to save hella usage for this week". The nine items are from the Third Place's
research (`research/claude_code_features_for_consonance_2026-11-21.md`); each is that seat's read of the vendor's changelog and
is CONFIRMED BY A PROBE in its lap before anything is built on it.

**One pane, in sequence: pane B, which is warm.** Waking another pane cold costs more than the wait saves (a cold wake of a
400k seat on Opus is about 3 dollars at list price; `librarian/2026-11-21.laptop.md`, "00:4x"). Each lap is rung when the one
before it has handed back.

| lap | what | items | first step | registered failure line |
|---|---|---|---|---|
| L212 (in flight) | Close for the night: compact warm, large seats at one click | 4 | `loop/packet_l212_close_small_B_2026-11-21.md` | in the packet |
| L213 | A usage ledger: the 5-hour and 7-day windows, the cache report and the wake cost, logged per seat per turn | 1, 2, 3 | probe that a status line script receives `rate_limits` and `prompt_cache`, and that a resume hook receives a re-cache cost | failed if after one working night the ledger cannot say which seat moved the 7-day figure most |
| L214 | Spend less: helper agents at lower effort and without the intake; a warning before a model switch in a warm seat; a hook and one idle notice in place of two polling loops | 5, 6, 7 | probe each switch on one agent and one seat | failed if a reader agent's first call still carries the room's intake, or a polling loop is still running after it |
| L215 | Safer: the gates block when their process dies; the room's own tools stay loaded | 8, 9 | red first: kill a gate's process and show the action is refused | failed if a killed gate still lets its action through |

**Not in these laps:** Code Mode; mods; any change to which model a seat runs; the desktop (each lap is installed there by
its own landing, and the two settings files do not travel by git).

**Measured tonight, and it corrects what this seat said an hour earlier:** his `/effort` (xhigh to high) typed in this warm
pane at 00:36 did NOT rewrite the context. The next call wrote 2k and read 614k from cache. So effort can be changed in a
warm seat for free; a model change still rewrites the whole context.

## FOR THE DESKTOP, his word of 2026-11-21 00:42 (L)

- "Lets decide the laptop first, which pane will be the sonnet, then leave a note for when we are back on desktop to decide which pane/s there will be sonnet or stay opus."
- **Decided for L by the librarian, told to him:** pane A is the Sonnet 5.5 pane (it has run on Sonnet since its trial of 11-14, so no switch is paid; `seat_models` on L now says so). B, C and E stay on Opus 5.5 at high.
- **Open for D, his to decide there:** which pane or panes run Sonnet 5.5. What the laptop's record offers: Sonnet for laps a packet can spell out (landings, merges, probes, small features, test rows), Opus for laps that design something and for second readers; the trial's failure line is two failed checks or redone laps by a Sonnet pane in one week. A switch of model rewrites a seat's whole context, so it is made at a fresh start or straight after a cut.
- **Also owed on D:** `seat_models` and the effort settings (neither file travels by git); every usage lap of this file, installed by its own landing.

## Amended 03:5x, at his "do it all, why didnt you start" (03:46)

- **L214's landing** is pane B's: `loop/packet_l214_land_B_2026-11-21.md` (second read, install, the old exe, the push).
- **L215** is pane A's, beside it: `loop/packet_l215_fail_closed_A_2026-11-21.md`. Its row above changes in two ways. MCP `alwaysLoad` is DROPPED: the research took it back in its own closing lines (`research/claude_code_features_for_consonance_2026-11-21.md:251-253`, it spends context on every call). `permissions.denyInsteadOfPrompting` is ADDED, for the builder panes only, from the prompt stall of 01:09.
- **Two panes at once**, against this file's "one pane, in sequence": every pane is cold now (idle over two hours), so there is no warm pane to prefer, and his word is to do all of it.
