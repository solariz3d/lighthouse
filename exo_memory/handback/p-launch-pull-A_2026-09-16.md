# P-LAUNCH-PULL · ALPHA — THE BLOCK DOES NOT SHIP. The proof the packet required did not come in inside the clock.

**Pane A, machine L, 2026-09-16 07:45–07:57. HARD DEADLINE 07:55; I am past it and stopping here.**

## THE HEADLINE, FIRST, BECAUSE THE KEEPER TRAVELS TODAY

**`consonance/launch.ps1` IS UNCHANGED. It is byte-identical to HEAD** (`git diff HEAD -- consonance/launch.ps1`
is empty). Nothing landed on main, nothing landed on a branch, nothing went to the stick. **The launcher he will
click at home tonight is exactly the one he has been clicking.**

The packet's own rule is why: *"If you cannot prove both inside the clock, say so and the block does not ship."*
I could not. **Case 1 — clean tree, already at origin/main, a silent no-op — never reached its success branch.**

## WHAT I GOT TO

1. **The diagnosis is confirmed and it is the chair's**, re-derived here: `launch.ps1` contains no `fetch` and no
   `pull`; the only fetch in the tree is `state-sync.js:767`, which is the state repo. The rebuild check at
   `:107-141` compares the exe's mtime against sources that are still stale on a first launch at the other end.
   **The rebuild logic is not broken; the pull is missing.** Nothing I did tonight changes that finding.
2. **The block was written**, 59 lines, and it parses (`[Parser]::ParseFile` → PARSE OK). It is kept at
   `<scratchpad>/launch.ps1.with-block` and `<scratchpad>/pullblock.js` (the patch that inserts it), not in the repo.
3. **The safety property IS proven, three times.** The block was extracted VERBATIM into an isolated harness
   (`<scratchpad>/pullblock-extract.ps1`, `$root` injected, `Notify` stubbed) and run against a fixture repo with a
   real bare origin. In all three cases it printed one line and **completed with exit 0** — clean tree, dirty
   tracked file, and origin one commit ahead. **There is no path in it that returns early or throws.**
4. **The feature is NOT proven, and that is the whole reason it is held.** All three runs took the FAILURE branch:

        NOTIFY: Could not pull; opening what is here.
        BLOCK COMPLETED, exit 0

   So case 1 never demonstrated the no-op, and case 2 never reached the dirty check at all — the fetch branch
   short-circuits before it. **Two of the packet's two required proofs are unproven.**

## THE CAUSE, NARROWED TO ONE LINE BEFORE I STOPPED

**It is my wrapper, not git.** Run directly against the same fixture at the same moment:

    git -C <fixture> fetch --quiet origin       ->   $LASTEXITCODE = 0

The failure is in the timeout wrapper — `Start-Process -PassThru -NoNewWindow` plus `$fetch.WaitForExit(25000)`
and then reading `$fetch.ExitCode`. I patched it once mid-run (wrapping the flush in a subexpression,
`$($fetch.WaitForExit(); $fetch.ExitCode)`) because a `Start-Process` object can report a null `ExitCode`
immediately after the timed wait, and **the patch did not change the outcome** — so the null-ExitCode theory is
either wrong or not the only fault. I did not get further. **The next seat should suspect the `-ArgumentList`
array form or `-NoNewWindow` swallowing git's status, and should test the wrapper against a command whose exit
code is known before testing it against git.**

## WHAT I DID NOT GET TO — the packet asked for this explicitly

- **No run against L itself.** Both my no-op and dirty proofs are on a fixture repo, not on this checkout.
- **No branch.** `held/launch-pull-2026-09-16` was not created; nothing was committed.
- **No copy for the stick.**
- **No journal entry** for the keeper's "journal future plan" half of the ask. The mechanism paragraph above is
  the raw material for it and it is not written up.
- **The 25-second fetch ceiling is unexercised.** No test made a fetch hang, so the timeout path — the one that
  matters on a hotel network — has never run.

## WHAT THIS DOES ESTABLISH, and it is worth the lap

- **The defect is real, located, and one block from fixed.** The block's shape is right and its safety behaviour
  is measured: whatever it decides, the launcher continues.
- **The remaining work is one wrapper.** The git command is correct and exits 0; only the way this script waits
  for it is wrong. That is a ten-minute fix for whoever has a clock, followed by re-running the same three cases
  in `<scratchpad>/pullblock-extract.ps1`, which takes them verbatim from `launch.ps1` rather than a copy.
- **A fourth case should be added before it ships**, and I would have added it: origin ahead AND a dirty tracked
  file, which is the state L is in most nights.

**Nothing about this is safe to land unread on the machines he travels with, and the honest state is that it is
not ready. The app opens one build behind; it opens.**
