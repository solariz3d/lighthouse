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

## The second burst, 10:15Z, and what it changes (added 04:2x local)
Checked: the same board file, assistant lines since 09:53Z, read at 10:23Z.
- **Who got it:** A at 10:15:26Z, C at 10:15:40Z, B at 10:15:44Z. Each error was the reply to the chair's packet of his picks.
- **Who did not, in the same seconds:** the chair replied at 10:15:00Z and 10:15:35Z; E had no error after 09:53Z.
- **B recovered with no login.** A task notification woke it and its replies from 10:21:21Z on are clean. No `/login` line is on the board after 10:14Z. A answered the chair's nudge by 10:24:35Z and C by 10:24:52Z, also with no login.
- **So the login is probably not what clears it.** The block lifts by itself within minutes. What stays broken is that a seat ends its turn on one 403 and waits.
- **Inferred, not established:** both bursts began when several seats started a call within the same seconds (the first while the chair released queued packets, the second while it sent three packets in 44 seconds). The reply is an edge block page, which fits a burst rule better than a session that expired.

**The fix that works today, with no rebuild:** `loop/api_error_watch_2026-11-13.js`.
- It reads the tail of the board every 10 seconds and exits, naming the seats, when any seat's last line is an API error older than 25 seconds.
- A seat runs it in the background. Its exit wakes the seat, which nudges (the librarian by ringing the chair; the chair by its own inject).
- **The proving check, done on the live board:** at 10:24:35Z `--once` printed "STOPPED: C (10:15:40Z)". After the chair's nudge, at 10:24:52Z, it printed "clear".
- **Armed** in the librarian's session at 10:25Z for 45 minutes. It must be armed again after each exit, and the chair should run its own copy, since the librarian's cannot see itself stop.

**Changed practice for the chair, from now:** space deliveries to different seats by about 30 seconds, and after each one check that the seat's next line is not the error.

**Still owed (B, as fix 2 above):** the `[panes]` hook line, then the delivery path in `main.rs`. With the second burst, fix 2a should also retry by itself: a reply that is an API error is followed by one automatic "carry on" after a pause, and only a second failure is raised to a seat.
