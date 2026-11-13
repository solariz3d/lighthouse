# Stall trace: a 403 from the API stopped three panes, and the packets delivered into them were eaten (2026-11-13)

Librarian, on L, 04:0x local (`date`: Fri Nov 13 03:54 CCST at the first check).

## What happened
Checked: `C:\Consonance\data\board.jsonl`, assistant lines matching "API Error: 403", times from each line's `ts`.
- **The error line, the same in every pane:** "Please run /login · API Error: 403 Attention Required! | Cloudflare".
- **Who got it, and when:**
  - E (a2122153): 5 times, 09:46:56Z to 09:47:08Z;
  - the librarian (0c0c0c0b): once, 09:46:57Z;
  - A (6fe15f0a): once, 09:47:54Z;
  - C (0845a868): 4 times, 09:50:07Z to 09:50:16Z.
- **Who did not:** B (12fb81f6) and the chair (0c0c0c0a) made no call in the window. Their last lines are 09:39:03Z and 09:41:30Z.
- **How it cleared:** the keeper ran `/login` in the librarian's pane and said "logged in" at about 09:53Z. The librarian's next calls succeeded.

## The source
- **Of the 403 itself: not established.** The reply is a Cloudflare block page, so the edge refused the request before the API answered. Whether the cause was the account's session (his limit reset and spend-limit changes came about an hour earlier) or six seats calling at once cannot be told from the board. Not checked: the client's own log.
- **Of the stall: ours, and checked.** The chair's delivery counts a packet as DELIVERED when it is pasted into the pane, whatever the pane replies (`consonance/src-tauri/src/main.rs:12230`, the `DELIVERED -> …` line).
  - E's three packets had been held 1,614 s, 1,225 s and 580 s behind its turn. They were released together at 09:47:01Z, :04 and :07, and each was answered by the error line.
  - C's three (held 1,404 s, 772 s and 534 s) went the same way at 09:50:09Z, :12 and :15.
  - A's task notification b9elk791o was answered by the error line too.
  - Every one of those deliveries carried the stamp "STALE (says working, screen says otherwise)" (`main.rs:11207`), and was delivered anyway.
- **So:** six orders and one task result were marked delivered, none was acted on, and no seat was told. The room looked busy until the keeper looked at the panes.

## The fix
1. **Now, done at 09:54Z:** the librarian rang the chair to nudge E, C and A with one line each. The packets are already in each pane's context above the error lines, so they are not re-sent.
2. **The durable fix, for a pane to build in `consonance/src-tauri/src/main.rs` (the delivery path) and the pulse hook:**
   - (a) a pane whose reply to a delivered packet begins "Please run /login" or "API Error" is recorded as NOT ACTED ON. The board says so in one line, and the packet is delivered again once that pane next replies without an error;
   - (b) queued packets are released one at a time. The rest are held until a reply that is not an error, so one failure cannot eat a queue;
   - (c) the pulse line names every pane whose last line is an API error, so each seat's hook shows it and the librarian rings without waiting for the keeper.
3. **The proving check, red first:** a test beside the delivery code. It feeds a pane reply of "Please run /login · API Error: 403 …" after a delivery and requires the delivery's state to be "not acted on, redelivery pending". Then it feeds one clean reply and requires exactly one redelivery. Today it fails: the state is DELIVERED.

## Not checked
- Whether a `/login` in one pane refreshes the other panes' sessions, or whether the block simply lifted. If a pane fails again on its first call after the nudge, each pane needs its own `/login`.
- Whether B's landing (lock holder pid 1272, alive at 09:54Z) was touched. B made no model call in the window, and its landing runs as a script.
