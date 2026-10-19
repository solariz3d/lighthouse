# D415 — a delivered message must SUBMIT, or say plainly that it did not (fix lap, 2026-10-19)

Lap type: a fix lap under the 07:36 freeze. It is an error in the room's delivery, and the keeper flagged it, so it is not an original lap.
Pane: **C** (free), on the lighthouse repo, in C's own worktree. Test first.
Install: none by C. The fix reaches the keeper only when Consonance is rebuilt, and that is the keeper's call (it restarts the room). The rebuild goes on the inventory list.

## What happened (the trace)

- 14:53 local: the librarian's `call_chair` ring (D410) came back `written to Main — UNCONFIRMED`. The pulse then showed it UNRECEIVED for 38 min.
- 15:32: the keeper found the ring's text sitting UNSUBMITTED in the Main tab's input box. He asked what it was ("random shit in the text … it shouldnt be there", "it didnt auto send") and sent it himself.
- It's the second time today: the chair reports he cleared one at 10:20.
- The same class was seen 2026-07-27 and 2026-08-25 (`main.rs` `unconfirmed_delivery_line`, :10119, and the comments in `inject_to_pane`).

## What the code does now (read 2026-10-19, lighthouse working tree)

- `consonance/src-tauri/src/main.rs:11385` `inject_to_pane`: one bracketed paste, a sleep of `submit_delay_ms(len)` (:10138; floor 120 ms, cap 900 ms), then ONE `\r`. Nothing checks that the `\r` was taken. The doc comment at :10134-10137 says so: "this reduces the odds of the race and cannot close it".
- `:12462` `librarian_call_exec` and `:12326` `chair_inject_exec` call it, then `await_render` looks for the text in the pane's capture for `RECEIPT_WAIT_MS` (1,800 ms).
- **The gap that matters:** `Receipt::Received` means the text was RENDERED. Text sitting in the composer renders too. So "delivered to Main (rendered in its pane …)" can be printed for a message that was never submitted, and UNCONFIRMED only means no render was seen in time. Neither one is a check that the message was submitted.
- The tools to check it exist: `composer_row` (:10528) and `composer_state(rendered, typed)` (:10599) → `Empty | HasText | Unreadable`, with dim prediction text told apart by colour (the 2026-09-07 fix).

## The fix (C may choose the shape; these are the rules)

1. **After the `\r`, confirm the submit.** Read the target's composer. It counts as submitted when the composer is `Empty`, or a turn has started. It is NOT submitted when the composer `HasText` AND that text holds this message's needle (`receipt_needle` / `receipt_needle_tail`).
2. **Retry the Enter only, never the paste.** If not submitted, send `\r` again after a growing gap, a bounded number of times (C names the numbers and why). A second paste APPENDS (`unconfirmed_delivery_line` already warns of this), so it is never re-sent.
3. **Never touch text that isn't ours.** If the composer holds text WITHOUT our needle, it is the keeper's typing or a dim suggestion. Do not press Enter on it and do not clear it. That case belongs to the inbox gate (`gate_or_queue` :11097), not here.
4. **Never clear the box, and never delete anything from it.** If the retries run out with our text still there, the result is a new, loud state: `NOT SUBMITTED — the text is in <pane>'s input box`. It goes to the sender's tool result AND the board, so the pulse and the sender both see it. The keeper's box is never edited by Consonance.
5. **One path for all four callers.** The fix lives in (or under) `inject_to_pane`, so `chair_inject_exec`, `librarian_call_exec`, the `call_librarian` actuator and `deliver_pull` all get it (the :11432 comment explains why one function, one behaviour).
6. **What the sender is told:** `ring_reply` (:12505) gets a third word. "delivered … submitted" only when step 1 confirmed it; UNCONFIRMED when the composer couldn't be read; NOT SUBMITTED per step 4. `ring_reply_tests` pins it.

## Tests first (red on today's tree, then green)

- A pure decision function, tested without a PTY, in the house style (`submit_delay_ms` and `ring_reply` are already tested this way): given composer readings over time and our needle, return `Submitted | RetryEnter | NotSubmitted | NotOurs | Unknown`. Rows:
  - our text gone after the first Enter → Submitted, no retry;
  - our text still there after the Enter, gone after one retry → one retry, Submitted;
  - our text there through every retry → NotSubmitted, with no paste and no clear among the actions;
  - the composer holds OTHER text (the keeper's) → NotOurs, and no Enter is sent;
  - a dim suggestion only → treated as Empty (the colour rule);
  - unreadable → Unknown, never Submitted.
- A row over the real writer, with a fake session writer that records bytes: exactly one bracketed paste, then 1 to N lone `\r`s, and never a second paste or a backspace/ctrl-u.
- `ring_reply_tests` gets the three outcomes.
- Red first: the decision rows can't pass on today's tree, because nothing reads the composer after the Enter.

## Runs

- `cargo test` for the touched module(s), under the heavy-run lock, and the gate/inbox tests that call `inject_to_pane`'s callers (name them in the hand-back).
- No full suite; no Consonance rebuild or restart (that is the keeper's).

## Bar

- Every row above green, and red-first shown for the decision rows.
- `git grep` shows one paste per delivery and no code path that writes a delete or clear key into a pane.
- Hand-back: `exo_memory/handback/p-d415-submit-C_2026-10-19.md`, with commits by named paths, nothing pushed.

## Not in scope

- The O/P mount-label swap and the no-map notice (inventory list).
- Making the room rebuild itself.
