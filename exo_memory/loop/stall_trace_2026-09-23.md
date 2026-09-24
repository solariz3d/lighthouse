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
