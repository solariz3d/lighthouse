# Hand-back L221 (pane B, on L): "Compact warm seats" shows each seat's progress, says when it is done, and cuts the seats at once

Packet: `exo_memory/loop/packet_l221_compact_progress_B_2026-11-21.md` (blob 44bd793e, room main 9110d0fc).
Branch: `l221-compact-progress` in the room repo, on 9110d0fc. Pushed; its tip is named in the ring. **Not landed, not built, not installed.**
Evidence: `p-l221-compact-progress-B_2026-11-21_evidence/`.

## Owed from his restart (L216 R4), done first

- **whats-live (checked, 13:0xZ):** "Nothing stale: what is running matches what is committed". The app was built
  12:53:44 and started 13:02:10; its newest Rust is a77e2d8c.
- **The NO PROMPT line (checked):** `persist.log` lines 3418, 3424, 3430 and 3437 (`r4_no_prompt_lines.txt`) show
  `NO PROMPT pane=… --settings C:\Consonance\data\builder-no-prompt.settings.json` for four builder panes, at 13:02:11-15Z:
  6fe15f0a (A), 12fb81f6 (B), 0845a868 and a2122153. There are 0 such lines for the main seat (0c0c0c0b), the librarian
  (0c0c0c0a) or the Third Place (3d000000). L216's failure line (a builder pane held by a prompt, or a housed seat losing
  one) is not shown to have fired; it is watched across the day, not by one read.
- **Deleted (checked):** `C:\build\lighthouse-target\release\consonance.exe.running-before-l216`. A listing of `release\`
  afterwards finds 0 `running` files.

## What his press did at 13:00Z, read from the ledger (checked)

`C:\Consonance\data\close-small.jsonl` holds two rows:
- the click, 12:59:57.419Z, five seats;
- pane A's seat row, 13:01:23.503Z, "cut … 18k tokens left".

There is no row for the other four seats and no end row. **This is the run the next launch names** (item 5, below).

## What was built

1. **A line per seat, live, read from the ledger.** `close_small.rs` `progress(ledger)` reads the newest click's run.
   - **The rows it reads.** Each seat moves through `waiting` → `asked` → `answering` → `compacting` → `done`, `skipped`
     or `failed`. Each state comes from a ledger row the run now writes:
     - `stage` rows: `asked`, `answering`, `compacting`;
     - the existing `seat` row, the outcome;
     - the new `done` row.
   - **Who writes them.** Every row goes through `close_small_note` (main.rs). It writes the row first, then sends the
     whole run, as the ledger now reads, to the screen. **The screen draws only what the ledger says.**
   - **What each state shows.**
     - `asked` carries "queued behind its current turn or his typing" when the ask was queued.
     - `answering` is noted the first time a request starting after the ask is seen.
     - `compacting` carries its start time, and the screen counts its seconds once a second.
     - `done` carries the tokens before and after. `compaction_pre_tokens` reads `preTokens` from the transcript's own
       `compact_boundary`. `cut_outcome_tokens` gives "…, 412k before, 18k after".
   - **Pictures:** `l221_mid_run.png` and `l221_end.png`.
2. **One line for the run.**
   - **During the run:** "2 of 5 done, 3 to go". A skipped or failed seat counts as done here, because it is at its end.
   - **At the end:** "Done: 4 cut, 1 failed" (plus ", N skipped" and "(the run was interrupted: N never reached)" when
     they apply). This line stays, with a Close button, until he closes it. A run that ends while the view is hidden
     unhides it, so the "Done" line is seen.
   - **Reopening the view.** Pressing the toolbar button during a run opens the run, never a new list. The new command
     `close_small_progress` reads it, so a reloaded screen finds it too.
3. **The close question.**
   - **When it asks.** `close_on_x` now also asks when the run has seats to go (`close_small::close_must_ask(working,
     compacting)`), even with every seat ready. `close-confirm` carries `compacting: N`.
   - **What it says** (`leave.js`): "Compacting is still running (3 seats to go). Close anyway?" The working seats are
     listed below it.
   - **The buttons.** [Close] is today's Leave, once. [Keep working] invokes nothing.
4. **At once, not serial (R3, below).** `close_small_run` starts one thread a seat and joins them all, then writes
   `done`. A panic in one seat's cut is caught in that seat's thread and becomes its `failed` line. The ledger write is now
   one locked `write_all` per row, because the seats' threads write at once.
5. **An interrupted run is said at the next launch.** `close_small_interrupted_at_launch` runs in setup, after L218's
   refusal rows.
   - **The board line.** For a run with no end row, it posts one chair-audit board line: "compact warm seats: the run of
     the click at … was interrupted (the app closed before it ended); listed and never cut: B (asked), C (waiting) …".
   - **Said once.** It then writes an `interrupted` row, which ends the run, so the line is said once.
   - **At his first launch of this build**, that line names today's four seats (B, the librarian, main and the Third
     Place). **Inferred:** they will be named by the first 8 characters of their ids, because the 12:59 click row predates
     the `names` field that clicks now carry.

## Registered before code, each printed

- **R1, red first (checked).** 17 new rows in `close_small.rs` (`r1_…`, `r2_…`) were run against stubs of today's
  behaviour (no run read, nothing to go, no line, the X asking only for working seats): **9 passed (the old rows), 17
  failed** (`red_rows.txt`). With the reader built, **26 of 26**.
  - **Two more rows came from the mutant pass:** a compaction before the send is not this cut's (M14), and a seat at its
    end does not move (M1). That makes **28 of 28** in the scratch crate.
  - **Mutants** (`mutants2.txt`, `mutate.js`): **15 applied, 13 caught, 0 not applied.**
  - **The two not caught are equivalent:** M8 (`to_go` of a finished run) and M10 (the launch line for a finished run). An
    end row puts every seat at its end, so the guards they remove never decide anything. I have kept the guards as
    belts.
  - **The wiring rows** in `close_small_wiring_tests`:
    - `l221_every_row_of_a_run_goes_to_the_screen_through_the_note`;
    - `l221_the_seats_are_cut_at_once_and_done_follows_every_seat`;
    - `l221_the_x_asks_while_a_run_has_seats_to_go`;
    - `l221_an_interrupted_run_is_said_at_launch_once`.
  - **One row is AMENDED BY NAME:** `the_cut_of_a_seat_is_called_only_from_the_run_and_the_run_only_from_the_click`. Its
    "done" literal was the old event `{"done": true}`; it is now the ledger's `"event": "done"`. Its order checks are
    unchanged.
- **R2 (checked), the close-while-running ask, by rows on both sides.**
  - **Rust:** `r2_the_close_asks_while_compacting_has_seats_to_go` (pure), and the wiring row on `close_on_x`.
  - **The screen:** three rows in `ui/leave.test.js`. The first two failed on the base `leave.js`: 44 passed, 2 failed
    (`ui_red.txt`). The third pins that [Close] and [Keep working] behave as today, so it passes on the base too. All
    three pass on the branch: 46 of 46.
- **R3, serial or at once: AT ONCE.**
  - **Why it is safe (checked by reading the code):**
    - each seat's cut touches only its own pane: its PTY, its transcript and its inbox entry;
    - the shared things it uses are locked: the inbox, the board, the pane maps, and now the ledger;
    - the one reason for serial that existed, A's follow-up (a), was a seat going cold while it waited behind the others.
      At once, no seat waits, so one re-read of the list before the asks serves every seat.
  - **The cost it adds (inferred, not measured):** up to five compactions run at the same moment. Each is one summarising
    request. If the account's rate limit refused one, that seat would read "failed: … no compaction was recorded within
    15 min" and the others would go on.
  - **Measured time before (checked from the ledger):** one seat only. Pane A took 86 s from the click (12:59:57.4Z) to its
    cut (13:01:23.5Z). The other four were never reached.
  - **Serial, inferred:** about the sum of the seats' times; for five seats like A's, about 7 min.
  - **At once, inferred:** about the slowest seat's time.
  - **The measured after is owed at his next press.** The ledger now stamps every stage of every seat, so it is read
    straight from `close-small.jsonl`.
- **R4, his eye, before the build is installed.** Both pictures are in the evidence folder. They are the REAL
  `ui/close-small.js` and `ui/app.css`, drawn in Edge headless, fed by the REAL `close_small::progress`/`to_json` on a
  fixture ledger (`pictures.js`, `payloads.json`). They show the view mid-run (`l221_mid_run.png`) and at its end
  (`l221_end.png`). **Not shown:** the app's own window, a live run, and the close question as a picture (it is shown by
  its rows).

## The suite

- **Full bin suite on the branch (checked, under heavy-run): 1,281 passed, 1 failed, 7 ignored.** The one failure is `light_the_librarian_worst_case_intake_is_under_145_000`, which also fails on room main without this diff (L212 and L216 measured it at 147,621 B).
- **The first run read 1,278 passed, 2 failed.** The second failure was mine. My L221 wiring row quoted `compact_and_confirm(` as text, and L218's row `the_one_compact_send_has_three_callers…` counts that text over everything above `fn main()`, so it read 5 sites, not 4. That was a real catch of a row-text collision, not of the code. The fix splits the name with `concat!`, as that module already does; then the rerun above.
- **`ui/leave.test.js`: 46 of 46. `ui/scripts-load.test.js`: 4 of 4.**

## Not in this lap, and not touched

The rule for which seats are cut, the cut list and the window are not touched. L218's paths still call
`compact_and_confirm`. Their outcome line now carries the tokens before as well, when the transcript gives them.

## Could be wrong

- **That the five seats' asks and compactions at once never trouble one another** is inferred from the code. No live run
  has shown it.
- **The registered failure line** ("he cannot tell from the screen whether the run is finished") is judged at his next
  press, not here.
- **There is no CHANGELOG.md in the room repo.** I did not create one: the room's record of a change is its hand-back and
  its map line.

NEXT: librarian, read this; plan default: a second reader (pane A) reads `9110d0fc..` the tip of `l221-compact-progress`, then I land, build with the running exe moved aside, and he relaunches.
