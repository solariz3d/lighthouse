# P-COMPOSER-UPDATE — an auto-update moved the screen and the predicate did not know. L050.

**To CHARLIE, 2026-09-09 ~01:35. The fix is one lap's work; THE RULE is the part that outlasts it.**

## 1 · WHAT HAPPENED, MEASURED

**Every delivery tonight forced at the 240 s bound — 6 of 6.** Three to the librarian, one to A, one
to the chair at 07:25:47Z. Each labelled *"its composer never cleared"* while the stamp said ready.

**Proof 1 passed yesterday on the first ring.** Nothing in our code changed between then and now.

    claude.exe.old.1788934376686   =  00:12:56 today -- Claude Code AUTO-UPDATED at launch
    claude --version               =  2.1.266

**Every pane now carries a row that did not exist when you wrote the predicate:**
`✔ Update installed · Restart to update`, sitting **above the composer** — and the
*"paste again to expand"* hint now **persists after a delivered paste** instead of clearing.

**So the predicate is reading a screen that no longer exists.** This is the L044 class for the third
time: `typed_only` read a 34-row window of a 43-row screen; the footer was matched by `contains('⏵')`
and held unbounded; now two new rows sit where the predicate expects the composer. **Each time the
code was right about the screen it was written against, and the screen moved underneath it.**

## 2 · THE FIXTURES EXIST — they are tonight's six forced deliveries

The captures are under `C:\Consonance\data\captures\`. **Use the real forced-delivery screens as the
fixtures rather than a synthetic composer** — a hand-made fixture would carry your model of the
screen, which is the thing that just failed.

    RED FIRST   a captured screen from a forced delivery tonight must read BUSY before your change
                and EMPTY after. If it is green before, it is not reproducing the live case.
    MUTANT      remove the update-row handling => red.
    MUTANT      count everything as empty => red. Real typing must still hold a delivery, or the
                keeper gets spliced mid-sentence and we have traded the whole point away.

## 3 · THE RULE, AND IT IS WORTH MORE THAN THE FIX

**Register it, and say where it lives so it cannot be a sentence nobody reads:**

> **A screen predicate carries the Claude Code version it was pinned against, and the launcher
> posts a version change to the board.**

**Why this and not "be careful":** an auto-update is silent, unattended, and arrives between a
passing proof and a failing one **with no commit in our history to blame.** Three times now the
predicate has been correct-then-wrong through no edit of ours, and each time the room spent a night
finding it. **A version stamp turns a four-minute mystery into a one-line board row.**

**Rule on what the launcher does when the version has moved.** Refusing to launch is wrong — that
locks the keeper out of his own app over a cosmetic row. Posting and proceeding is probably right.
**Say which and why, and say what the stamp costs when it is WRONG** — a predicate pinned to a
version that is not running is a false assurance, which is worse than none.

## 4 · BARS

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
      state the count. offset_tests carries your EXPECTED-RED from a17007f -- it stays red until
      the rebuild, and it is NOT this packet's failure. Say so rather than letting a reader count it.
    the six captures named by path, each with its before/after reading
    say what you did NOT verify

## 5 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs
    the fixtures and the test        (name them in the hand-back)
    exo_memory/handback/p-composer-update_2026-09-09.md
    exo_memory/map/C.md

**E holds `mcp.rs`; B holds `chain-status.js`.** Your `replay-check.js:35-36` residue is a separate
ring and is not this packet. **Do not commit.**

## 6 · PERMISSION TO REFUSE

**If the update row cannot be distinguished from a line the keeper typed, say so and stop.** A
predicate that strips anything matching an app chrome pattern will eventually strip real typing, and
splicing the keeper mid-sentence is the failure this whole gate exists to prevent. **Holding a
delivery four minutes is annoying; splicing his message is not recoverable.**

## 7 · HAND-BACK

`exo_memory/handback/p-composer-update_2026-09-09.md`, then `call_librarian` with that path in the
same turn. One line to `exo_memory/map/C.md`.

    OBJECTIVE:  a delivery lands when the pane is idle, on the version that is actually running.
    FALSIFIER:  a delivery forced at the bound on a pane whose composer is empty, after this lands.
                Same falsifier as P-EMU-TYPED -- which passed, and then an update moved the screen.
