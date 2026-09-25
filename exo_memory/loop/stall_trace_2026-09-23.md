# Why the chain stalled tonight: traced to the source, one fix per cause. Librarian, on L, 2026-09-23 ~04:0x.

*The keeper, verbatim: "why did this happen? We need to make sure the work chain loop is elegant and fool proof.
Every time something like this happens we need to trace the source to make sure it doesnt happen again." This file is
the first entry of that practice. **Every future stall gets a section here: what was seen, the traced cause, the fix,
and the check that proves the fix.***

## THE FOUR STALLS AND NEAR-STALLS OF 2026-09-23, ON L

| # | what the keeper saw | the traced cause | whose |
|---|---|---|---|
| 1 | ~03:14–03:22, "nothing was sent to the orch" | A's ring was **QUEUED behind this seat's own busy turn** (`stamp=working`) and never delivered. I read A as "idle, never rang" off the pane digest | a mechanism, plus my misreading |
| 2 | 03:45–03:53, "B still isnt working and the orch is stalling" | **my rule** "every landing runs the whole js-suite" put a foreground suite run in the chair (pid 26720). It raced a second suite run and C's mutant run on the SAME working tree and hung. Every ring (B's dispatch among them) queued behind it | mine |
| 3 | "why isnt B working?" | B was alive and idle since the restart. **The `[panes]` digest lists only panes that exchanged today**, and I took it for the roster ("no B here") | mine, and a digest property |
| 4 | 01:2x, the L084 landing | parallel laps edited `main.rs` at once, so the landing had to exclude a file and the tests compiled half-written code | mine (parallel laps) |

## THE ONE ROOT UNDER ALL FOUR

**Each seat is one serial queue, and nothing shows anyone that a queue is backing up.** A ring to a busy seat waits
silently (`main.rs:9495-9499`, `PaneGate::Working`). The sender gets "queued, stamp=working" once and then nothing. The
pulse flags a REFUSED delivery (`chain-status.js:295-297`, clause 3, UNDELIVERED) but not a QUEUED one. So a seat blocked
for eight minutes looks exactly like a seat that is thinking. Two further amplifiers:
- **One working tree, several heavy runners at once.** Suite runs, `cargo test` and mutant harnesses from different seats
  ran in parallel on one checkout with no lock. They slowed each other, one hung, and they read each other's
  half-written files (the chair's 122/1 red was C's in-flight edit).
- **Summaries used as the machine.** The `[panes]` digest (`dev/shell/hooks/userprompt_pulse.py`) is a copy with a
  filter. I used it twice tonight to decide who exists and who is done.

## THE FIXES, EACH WITH THE CHECK THAT PROVES IT

1. **QUEUED is surfaced like UNDELIVERED.** `chain-status.js` gains a clause: a delivery queued behind `stamp=working`
   for more than 3 minutes prints `QUEUED <seat> <n>m (receiver busy since <t>)` in the pulse, for every seat.
   *Check:* a test with a fixture queue aged 4 minutes prints the line, and one aged 1 minute does not.
2. **No seat blocks its turn on a heavy run.** Rule in `BUILDING.md` (WHAT A DISPATCH OWES and the chair's own section):
   any command expected to take more than 2 minutes runs in the background. Owner: the whole js-suite and full
   `cargo test` are the COLLATOR's (this seat's), never the chair's. *Check:* the chair's transcript shows no
   foreground tool call over 120 s, counted by a script over its jsonl.
3. **One heavy runner per tree.** A lock at `<data>/heavy-run.lock` (`{pid, seat, cmd, started}`) taken by `js-suite.js`,
   the mutant harnesses and a wrapper for `cargo test`. A second runner waits and prints who holds it, or runs in its
   own worktree (the mutant harness already knows how). A stale lock (dead pid) is taken over and logged.
   *Check:* two suite runs started together, and the second reports the first's pid instead of racing it.
4. **The digest shows silent seats.** `userprompt_pulse.py` lists every roster pane (`data/panes.json`), with
   `0 exch · idle since launch` for silent ones. *Check:* a test with a roster of four and exchanges from three prints
   four rows.
5. **Collator discipline** (this seat's memory, already written): the digest is never used for WHO EXISTS or WHO IS
   DONE. A seat idle more than 5 minutes owing work gets its files and its QUEUE checked, then a ring.

**Order:** fixes 1 and 3 first (they remove the silent wait and the race), then 2 (a rule), then 4. All of them are
code or rules, testable, and live at the next rebuild or the next hook load.

## ADDED 04:0x — two more data points for the same root
- **A's L092 ring was QUEUED at the librarian** (board: `QUEUED -> 0c0c0c0b (1 waiting, stamp=ready)`) at 03:5x. The
  same silent queue, pointing at the collator. By then I had already read the file and published, so nothing was lost
  this time, but the pane had to re-ring to find out. Fix 1 covers this too, for every seat and not only the chair.
- **The chair re-ran the suite one second after its first run was stopped** (pid 39056, 03:53:01 → ~04:00:45), and
  stayed in ONE turn from ~03:45 to ~04:01. Rings reach a seat only between turns, so a long turn is a closed door.
  **Fix 2 is sharpened:** the chair ends its turn after each landing and each dispatch, never chaining landing, suite,
  re-suite and dispatch in one turn. Its own restore point should say so.

## ADDED 06:4x — a STALE stamp held two rings to the librarian for 16+ minutes
The board: `QUEUED -> 0c0c0c0b (1 waiting, stamp=STALE (says working, screen says otherwise))` at 06:20 (the chair's "your
research batch rests on a premise that fails" note), then A's L109 ring behind it ("2 waiting"). The librarian's ready file
was current by 06:37:16, but the queued pair was still not delivered. **L095's alert caught it** ("QUEUED librarian 16m,
2 waiting"). The collator had already acted on both from disk, so nothing was lost. **What this adds:** a STALE gate holds
until the 240 s force, but these two waited 16+ minutes, so the force did not fire for STALE here. That is a candidate defect
in `drain_decision` (`main.rs`), to be checked by whoever next holds it: does STALE reach `MAX_HOLD_MS`?

## ADDED 19:0x, on D: a 50-minute stall at the collator, from waiting on a ring instead of checking the file
In D125, E rang at 18:1x with its js-suite "still running", promising an addendum. E wrote the addendum at ~18:1x
**without re-ringing**, and the librarian waited for a ring until a keep-warm at 19:06 prompted a look at the file. **Cause:**
collator discipline (fix 5 above) covers an idle PANE owing work, but not an idle COLLATOR waiting on a promised addendum.
**Fix:** when a hand-back says "result to follow as an addendum", the collator checks the file itself once the suite
could be done (~10 min), and never waits on a ring for an addendum. **Check:** the next such hand-back is collated within
15 min of its addendum's mtime.

## ADDED 2026-09-24 23:3x, on D: a ring "delivered" at ~20:15 was RECEIVED at 23:32:48, a 3 h 17 m stall
- The librarian's `call_chair` (the keeper's §9 answers → dispatch S2-resumed) returned **"delivered to Main (rendered in
  its pane — not proof it was read)"** at ~02:15Z. The board's **`call_chair -> Main [Received]`** row is at **05:32:48Z**.
  **No QUEUED or DELIVERED row exists for it** (the board, 02:00Z–05:34Z), so the inbox queue never held it: it went out
  through the door.
- **In between, Main answered four keep-warms** (02:55, 03:45, 04:35, 05:26Z, each "reply exactly: ok"). So the seat was
  taking turns while the ring sat unsubmitted. The candidate is that the text was rendered into the composer while Main
  was mid-turn (it had just landed D135 at 02:04:59Z) and not submitted until something later pressed it through.
  **Not verified.**
- **The fix owed (a lap):** trace the door path for `call_chair` when the receiver is mid-turn. "Rendered in its pane" is
  not "received", and the sender is told the first. Proving check: a ring to a busy Main shows `[Received]` within the
  bound, or a QUEUED row appears.
- **Collator discipline, already in force:** a ring whose NEXT depends on the chair gets its `[Received]` row checked
  within ~10 min, not assumed. It was not checked here, which is my WRONG.

### CORRECTION, 2026-09-25 00:0x — the section above is WRONG in its first line (A, D137, `handback/p-d137-stall-A_2026-09-24.md` §0)
~~The librarian's `call_chair` … returned "delivered to Main (rendered in its pane)" at ~02:15Z~~ **(struck: hand-made, never
checked; "~20:15" was a reconstruction)**. From the two transcripts: the D135 collation ring was sent at 02:04:39.978Z and
received 0.22 s later. **At 02:04:45Z the librarian asked the keeper the §9 question (AskUserQuestion) and its turn BLOCKED
there until his answer returned at 05:32:16Z. The §9 ring was MADE at 05:32:48Z** and received at once. **No line in
main.rs held anything; there was no delivery stall.**
- **What the stall really was:** a keeper question waiting inside a seat's pane, with nothing in the room saying so. The one
  signal was `keep-warm MISSED -> 0c0c0c0b … a turn runs` (03:04:51Z). It had the seat and the time, but not the reason.
- **The fix, re-aimed** (A §3): when a seat's last transcript row is an AskUserQuestion tool_use with no result, the board
  and the pulse say **"<seat> waiting on YOUR answer since <t>"**, not "a turn runs".
- **WRONG (librarian):** I asserted a delivery defect from a reconstruction, and dispatched A and C on it. The discipline
  that would have caught it is the one this file keeps naming: read the transcript before claiming the mechanism.

## ADDED 2026-09-25 08:2x, on D: Main's claude process CRASHED (Bun segfault), and the app did not notice
- **Seen** (the keeper's screenshot, `C:\Users\nname\Pictures\Screenshots\BIG bug.png`): Main's pane ends with `panic(main
  thread): Segmentation fault at address 0xFFFFFFFFFFFFFFFF … oh no: Bun has crashed. This indicates a bug in Bun, not your
  code`, then `— process exited —`. Bun v1.4.3 (the claude.exe runtime, Claude Code 2.1.282). Elapsed 15,970,599 ms
  (≈4 h 26 m); RSS 0.40 GB (peak 0.95 GB). **Upstream's bug, not ours.**
- **Nothing was lost:** Main's transcript is intact to its last finished turn (12:57:52Z, the R3 hold), and its ready stamp
  says `ready:true` at that time.
- **OUR defects, in how it was handled:**
  1. **The app did not detect the exit.** The header still says "Main is awake". The recovery (`pty_reopen`,
     `main.rs:9011`, resuming the same session) is MANUAL, the pane's ↻ button, and nothing prompts it.
  2. **The only signal was keep-warm's MISSED row at 13:57:48Z:** "not idle by its own Stop stamp … stale, absent or
     contradicted", which is right, but the reason is buried. It should read "Main's process EXITED".
- **The fix owed (a lap for A, since it builds):** detect a pane's child exit (`try_wait` is already used at `:1191`,
  `:11829`, `:12569`). Mark the pane as exited in the header and the board, not "awake", and either offer the ↻ as a
  prompt or auto-`pty_reopen` fixed seats once, with a board row. Test: a fake child that exits shows as exited and does
  not read as awake.
- Main's context was **97% (966k)** at the crash, so resuming will likely auto-compact soon after. That is expected.
- **And the ↻ recovery garbled the pane** (the keeper's second screenshot): the new claude painted over the dead one's
  screen at the wrong width. **Cause** (`consonance/ui/term.js`): `reopenPane` (:924) never resets the xterm, and `fitPane`
  (:873) skips `pty_resize` when the dims are unchanged since the last send, which they are after a reopen, so the new
  pty never learns its size. **Fix, added to D143 (A):** `term.reset()` and clearing `sentRows`/`sentCols` on reopen,
  with a test. Display only; Main itself compacted cleanly and kept working.
