# p-d621 — the two bookkeeping bugs: the station gate per lap, and the receipt from the pane's own row (O), 2026-11-02

Packet: the chair's D621 (00:00Z): the two bugs of `p-d620-stale-laps-O_2026-11-02.md` ("Why so many laps stayed open" and the dispatch section). Tier: CHECK IT. Seat: O.

## What landed
- Lighthouse branch **`d621-o`** (worktree `C:\Users\nname\Desktop\worktrees\lh-o621`), off origin/main `2f3048b1`: one commit **`5c1aa36e`**, NOT pushed.
- Three paths: `consonance/src-tauri/src/lap_holders.rs`, `main.rs`, `mcp.rs` (314 insertions, 7 deletions).
- **No exe rebuilt or swapped.** The fix reaches the room only when the app is rebuilt at his restart word.

## (1) The station gate reads the lap a dispatch serves

**The cause.**
- P-ONE-STATION (`mcp.rs` `required_station`, `auth_station`; the rule in `lap_holders.rs` `station_allows`) allows `chair_inject` only while SOME open lap is held by `chair`.
- With every open lap in `working` (holder `panes`), every dispatch was refused, so the chair re-took every working lap first.
- The gate could not ask about one lap: no gated verb carried one, as `lap_holders.rs`'s own header note says.

**How a dispatch names its lap now** (`ChairInjectArgs.lap`, then `lap_holders::lap_of_text`):
1. an explicit **`lap`** argument on `chair_inject` ("D621"), optional;
2. else the id after **"Ledger "** in the packet: a packet often names the lap it closes before the one it opens, as "D620 collated … Ledger D621:" does;
3. else the **first lap id** in the text (`D` or `L` and 3–5 digits).

**The rule** (`lap_holders::station_allows_for_lap`, through `mcp.rs` `auth_station_for`):
- **Allowed:**
  - the named lap is open and held by `chair`;
  - the named lap is not on the ledger yet (a new lap, before its rows);
  - the named lap is filed (a word after it closed).
- **Refused:** the named lap is open and held by another station, or by nobody. That is the original protection: no out-of-turn ring into the pane working that lap.
  - The refusal names that lap, its holder, and the `lap-row.js --stage <lap> … --by chair` that moves just that lap.
- **Unchanged:**
  - a dispatch that names no lap, or a ledger that cannot be read (`main.rs` `chain_lap_state` → None), gets the old any-lap rule;
  - `call_librarian` and the Third Place's exemption are as they were.
- **So the chair re-takes only the lap it is about to ring into, and only if the panes hold it.** A dispatch for lap X goes through while the panes hold lap Y.

## (2) The receipt reads the pane's own user row on the board

**The cause.**
- The receipt was the render check alone: `await_render`, 1,800 ms on the pane's capture, then the submit check.
- The receiving pane's user row carrying the message reached the board (the transcript tailer pushes it into the same ring) seconds before the chair's audit row. So all 32 of the D620 dispatches read UNCONFIRMED though they had arrived.

**Now** (`main.rs` `board_receipt`, `await_receipt`, `inject_receipt`, used by `chair_inject_exec`). On every poll it checks the board first, then the capture as before:
- **What counts:** a row from the target pane (its full id), role `user`, no older than the write less 5 s (`BOARD_RECEIPT_SLACK_MS`: the transcript's own stamp can sit a little before our clock read), carrying the message's opening (the same needle the render check uses, or its tail).
- **What it decides:** that row settles the receipt as Received, because the pane took the message in, so it was submitted. Without it, the render and submit checks decide exactly as before.
- **Scope:** only `chair_inject`'s delivery reads the board. The librarian's, the chair-call's and the Third Place's deliveries keep the render check (the brief named the dispatch).

## Tests (CHECK IT)
checked: `cargo test --bin consonance` (BelowNormal, under the heavy-run lock, target `G:\Consonance-tools\cargo-o621`) → **1175 passed, 0 failed, 6 ignored**, 618 s. Output: `S\d621\cargo-test.out`.
- **New, `lap_holders::tests`:**
  - `a_dispatch_names_its_lap_by_its_ledger_line_first`;
  - `lap_state_reads_the_newest_chain_row_of_that_lap`;
  - **`a_dispatch_for_lap_x_is_allowed_while_the_panes_hold_lap_y`**. Its control asserts the old rule refuses the same case, the D620 retakes;
  - **`a_ring_into_a_lap_another_station_holds_is_still_refused`**: held by the panes, by the librarian, or holderless;
  - `a_dispatch_naming_no_lap_keeps_the_old_rule`.
- **New, `chair_tests`:**
  - **`a_dispatch_reads_delivered_from_the_panes_own_board_row`**: the D612 delivery's own row shape; the old path alone reads Unconfirmed on it;
  - `only_the_receiving_panes_own_new_user_row_with_the_message_counts`: another pane, an assistant row, an older copy, other text and an empty needle do not count;
  - `without_a_board_row_the_render_and_submit_checks_decide_as_before`;
  - `the_chair_inject_receipt_reads_the_board_first` (the wiring).
- **Amended by name, each with its reason in place:** `chair_inject_is_gated_on_the_station`, `a_station_refusal_reaches_the_board_and_names_the_escape` and `the_third_place_ring_is_not_held_to_the_loop_station`. The gate's body moved from `auth_station` into `auth_station_for`, which `auth_station` now calls.
- The compile warnings in the output (main.rs :512, :16482, :16740; cochlea.rs) are not in this diff's hunks.

## What it does not do
- It does not remove the chair's own habit. A dispatch that names its lap no longer needs the retakes, but the chair has to stop writing them.
- It does not touch `lap-row.js`, which writes one lap per call and was not the batch.

## Gate fallback (the librarian's bounce, 18:19): a lap read from free text no longer opens the gate

**The hole, as the librarian found it.** At `5c1aa36e` the Unknown/Filed allowance applied to ANY lap the dispatch named, and with no "Ledger" line that was the first lap id anywhere in the text. "D615 is done; also …", or a typo like "D6177", passed into a pane working another lap, where the old any-lap rule refused it while the chair held nothing.

**The fix** (`lap_holders::LapSource`, `lap_of_text` → `Option<(String, LapSource)>`, `station_allows_for_lap(.., lap: Option<(&LapState, LapSource)>)`, `mcp.rs` `chair_inject` and `auth_station_for`):
- **Named:** the explicit `lap` argument, or the id after "Ledger ". A lap that is open passes only if its holder is the chair; a filed lap or one not on the ledger yet passes.
- **Inferred:** the first lap id in free text. It counts only if that lap is open (its holder decides). Filed or Unknown: **the old rule** (`station_allows`) decides, exactly as for a dispatch naming no lap.
- The refusal on the board still names the lap and its holder for an open lap; an inferred filed/unknown lap refused by the old rule gets the old message, since that lap is not the reason.

**Test rows, `lap_holders::tests`, one per case** (helper `gate()` composes the gate as `chair_inject` does). Red first:
checked: `S\d621\red.out` (at 5c1aa36e plus the rows only) → 16 passed, **2 FAILED**: `free_text_naming_a_filed_lap_falls_back_to_the_old_rule`, `free_text_naming_a_lap_not_on_the_ledger_falls_back_to_the_old_rule`.
- `an_explicit_lap_argument_naming_a_filed_or_new_lap_is_allowed`;
- `a_ledger_line_naming_a_filed_or_new_lap_is_allowed`;
- **`free_text_naming_a_filed_lap_falls_back_to_the_old_rule`** (red at 5c1aa36e): "D613 is done; also …" refused while the panes hold D617 and the chair holds nothing; allowed when the chair holds a lap;
- **`free_text_naming_a_lap_not_on_the_ledger_falls_back_to_the_old_rule`** (red at 5c1aa36e): "D6177 …", "D916 …";
- `free_text_naming_an_open_lap_counts`: allowed when the chair holds it, refused when the panes do;
- `a_packet_naming_a_filed_lap_then_ledger_an_open_one_is_decided_by_the_ledger_lap`: "D613 checked …; Ledger D614: …" is allowed when the chair holds D614 and refused when the panes do.

**Amended by name, reason in place:** `a_dispatch_names_its_lap_by_its_ledger_line_first` (asserts the source too), `a_dispatch_for_lap_x_is_allowed_while_the_panes_hold_lap_y`, `a_ring_into_a_lap_another_station_holds_is_still_refused` and `a_dispatch_naming_no_lap_keeps_the_old_rule` (new argument shape, same verdicts); in `mcp.rs`, `chair_inject_is_gated_on_the_station` (new call text, plus a check that the explicit argument is Named) and `the_third_place_ring_is_not_held_to_the_loop_station` (new signature).

checked: `S\d621\green.out` (`cargo test --bin consonance station`) → 16 passed, 0 failed: the wiring tests and the older station rows. That filter misses most of the new rows, whose names do not say "station" (my correction to my own first reading of it). They ran in the whole binary below.
checked: `S\d621\cargo-test2.out` (`cargo test --bin consonance`, BelowNormal, under the lock) → **1181 passed, 0 failed, 6 ignored**, 179 s; all six new rows `ok`.

**Commit:** d621-o **`846df413`** on top of `5c1aa36e` (2 paths, `lap_holders.rs` and `mcp.rs`), NOT pushed. Private-term scan of the diff: 0 / 0 / 0 / 0. No exe rebuilt or swapped.

## Landing (the chair, 00:27Z): pushed lighthouse main **5c64caf1**

- d621-o took origin/main (4 commits ahead, only the librarian's and my exo_memory files) as merge **`5c64caf1`**. The range brings 3 paths, `lap_holders.rs`, `main.rs`, `mcp.rs`, none dirty in the shared checkout, with 0 staged. So the shared main fast-forwarded to it, and main and origin stay one commit.
- checked: `S\d621\keyscan.js origin/main..HEAD` (push-gate.js `findKeys`, 6 key shapes; a planted `ghp_` line read 1, so it can fire) → 3 commits, 0 key hits.
- checked: `S\d505\lhpriv.js origin/main..HEAD` (13 alternatives) → 915 added lines, total 0. The four-term private grep (the dispatch's first term and three others) over the added lines → 0 0 0 0.
- **Correction, my slip:** this section's first version, `0352f872`, named that first private term literally, copied from the dispatch's wording. Both scans counted it (lhpriv total 1; four-term grep 1 0 0 0), but my command chain did not stop on a nonzero count, so it went to origin in `0352f872`. Origin already held the term in 1 file before it. This fix-forward commit removes the word from the file. The line stays in history at `0352f872`, and I did not rewrite it: a force-push is the keeper's call. General form: a scan inside an `&&` chain must exit nonzero on a hit, or it only prints.
- checked: `git push origin 5c64caf1:main` → `72753965..5c64caf1`; `C:\Consonance\data\push-gate.jsonl` → decision **allow**, 2026-11-03T00:28:22.659Z, src 5c64caf1.
- No exe rebuilt or swapped; that waits for his restart word.
- This section rides in its own commit after the push, scanned the same way before it went out.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-36313935\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`.

SOURCES: `consonance/src-tauri/src/mcp.rs` (required_station, auth_station, auth_station_for, chair_inject), `lap_holders.rs` (lap_of_text, station_allows_for_lap), `main.rs` (chain_holders, await_render, delivery_receipt, chair_inject_exec, the tailer's board push), `consonance/tools/lap-row.js` (gateVerdict), `S\d621\cargo-test.out`, `S\d621\red.out`, `S\d621\green.out`, `S\d621\cargo-test2.out`
NEXT: the librarian checks the gate-fallback diff (846df413) and its six rows when this ring is read; the app is rebuilt with it at the keeper's restart word, not before
