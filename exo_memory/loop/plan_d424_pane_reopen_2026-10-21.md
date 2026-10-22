# D424: a committee pane that exits by itself is reopened once, and nothing is delivered into a dead pane (librarian, 2026-10-21)

## The case

On 2026-10-20 O's (c88002b1) claude process exited by itself at about 22:24, with exit code 3. That was 12 minutes after its seam hand-back.

- **The pane was not reopened.** `consonance/src-tauri/src/pane_exit.rs:20` says "A committee or human pane is never reopened automatically."
- **The landing GO went in anyway.** At 22:37 the chair's D421c landing GO was "DELIVERED … FORCED after the bounded hold". The board reads "composer: could not be read on 947 of 947 readings".
- **Nobody heard about it.** The sender was not told that the pane was dead. The keeper found it at 04:36, about six hours later.
- The chair has no reopen verb, so it moved the landing to B.

## The parts

**Part 1, A (it wrote D143, `6cc4a791`). Tier: prove it, since this is the system's own delivery.**

1. **Reopen a committee pane once.** When a committee pane exits by itself, reopen it ONCE per pane per app run, with `--resume`. This is the fixed seats' existing rule (`pane_exit.rs:16-19`), extended to committee panes.
   - A second exit is still shown and left to the ↻.
   - Human panes are unchanged.
2. **Refuse delivery into an exited pane.** A ring or GO queued for a pane whose exit record holds its pid is REFUSED, not forced.
   - The refusal goes to the sender and onto the board, naming the exit.
   - If the reopen in item 1 is running or done, the queued message waits for the new pid's ready signal.
3. **Tests first.**
   - Red on today's code, for both items. Item 2 is the 22:37 case: a queued message plus an exited pid must not read DELIVERED.
   - Then cargo whole, plus the mutation runs that cover `pane_exit.rs` and the delivery gate.
   - Commit by named paths. No push.

**Part 2, P: review the diff.**

**Part 3, install, after B's D421c landing is in and no pane is mid-job.**
- The swap uses the D423 tooling (`wait-and-swap`).
- Back up the running exe first, then do the stamped sha256 compare.

## Not in this lap

- A reopen verb for the chair or the librarian.
  - The librarian's only verb is `call_chair`, mount-gated by design.
  - An automatic, bounded reopen means nobody has to notice in the first place.
- Why O exited with code 3. The board does not record it. If A finds a log that says, it notes it.
