# P-READY-NOT-THE-CHILD — hand-back (pane E, lap D090, on D)

Packet: the chair's D090 dispatch. The defect: `exo_memory/librarian/2026-09-16.md`, the AUDIT entry (c34171c) — the
librarian's stamp read `ready:true, event:stop` mid-turn, with a session id that was not its own. Written 2026-09-19
22:5x (`date`). **Nothing committed, nothing installed.** Two files touched, both mine: `dev/shell/lib/ready.js` and the
new `dev/shell/lib/ready.test.js`.

## 0 · Headline

**Done, red-first, and the mutants are all dead — but two of them only after they found holes in my own test.**

    node dev/shell/lib/ready.test.js       BEFORE the guard: 5 passed, 1 failed — the overseer case, and only it
                                           AFTER:            8 passed, 0 failed
    git diff --numstat dev/shell/lib/ready.js      8 insertions, 0 deletions  (1 line of code, 7 of comment)
    sha256sum dev/shell/lib/ready.js               4abc155ec974746b3e9036a35688bb9e22162de51cbc8a46f99b9a09f4b84ec4
    sha256sum dev/shell/lib/ready.test.js          513175ca1e3442203bc2803d279acc73a2fec245217e6b0098def4f80ba79676
    node consonance/tools/js-suite.js --list       discovers it: row 100, `dev\shell\lib\ready.test.js`
    mutants (8 rows)                               8 caught · 0 SURVIVED · 0 INVALID · control NOT APPLIED

## 1 · The change

`dev/shell/lib/ready.js`, beside the dream guard, inside the same `try`:

    if (process.env.CLAUDE_OVERSEER_RUN === '1') return;

with the reason in seven comment lines above it: the overseer hooks spawn a `claude` that inherits the seat's
environment, so the CHILD's Stop hook stamped the PARENT pane ready mid-turn; the overseers already mark that child
(`dev/shell/hooks/l3-overseer.js:142`, `dev/shell/hooks/l2-overseer.js:132`, both `CLAUDE_OVERSEER_RUN: '1'`), and a
stamp is a pane's account of ITSELF. Nothing else in the file changed.

## 2 · The test, red first

`dev/shell/lib/ready.test.js`, 8 cases, every one against a fresh `fs.mkdtempSync` directory passed as
`CONSONANCE_READY_DIR`, with the four live variables deleted before each case and `process.env` restored after.
**No case can reach the live ready dir**, which is the one way this test could do damage: a stray real stamp tells
Consonance a busy pane is idle.

    an overseer child writes nothing, though it carries the parent pane in its environment   ← THE DEFECT, red first
    a real pane stamps ready true on stop            (ready, event, pane, session_id all asserted)
    a real pane stamps ready false on prompt
    the dream guard still holds
    a pane id that is not a plain id writes nothing  (../escape, a/b, "has space", "", 129 chars)
    with no ready dir and no pane, nothing is written and nothing throws
    only a literal true is ready: a truthy non-boolean stamps ready false      ← added by mutant 6
    a ready dir with no pane writes nothing — not a file named after a missing id   ← added by mutant 8

Before the guard, the first case failed with `[ 'parent-pane.json' ] != []` and the other five passed: the red was
the defect and nothing else.

## 3 · Mutants

**The tracked harness ran its GATES, not its kills, and the reason is a real limit worth recording.**

    node consonance/tools/mutant-harness.js scratchpad/ready/rows.js --audit
      → "d090-ready: 8 rows pass the gates (shape, dirty source, anchors)"   exit 0

It cannot SCORE this lap: it builds a detached worktree of **HEAD** and copies in only the mutated file
(`mutant-harness.js:107-110`), and `dev/shell/lib/ready.test.js` is untracked today, so the scorer would not exist
inside the worktree. Its shape gate (R3) also refuses an empty replacement, so each deletion row is written as a
comment-out — that is a property of the harness, not a defect, and it is why the rows read as they do.

So the kills were run by `node scratchpad/ready/mutants.js`, which loads **the same rows file** (no second list to
drift), applies each to a FRESH copy of both files in the OS temp dir, and re-hashes the live pair before and after
(`live files unchanged: true`).

    caught  1  the overseer guard is gone                    by the overseer case
    caught  2  the overseer guard tests the wrong value      by the overseer case
    caught  3  the overseer guard tests the wrong variable   by the overseer case
    caught  4  the dream guard is gone                       by the dream case
    caught  5  the pane-id shape check is gone               by the bad-id case
    caught  6  ready is no longer strictly true (!!ready)    by "only a literal true is ready"
    caught  7  the event label is inverted                   by both real-pane cases
    caught  8  the missing-variable guard is gone            by "a ready dir with no pane writes nothing"
    NOT APPLIED  control: an anchor that is not in the file

    first pass: 6 caught · 2 SURVIVED (6, 8) · final pass: 8 caught · 0 SURVIVED · 0 INVALID

**What the two survivors found, because it is the part worth keeping.** My first test set passed only literal
`true`/`false`, so `ready === true` → `!!ready` was invisible; and my "no variables" case set NEITHER variable, so
deleting the guard merely threw inside the `try` and wrote nothing anyway. The revealing case is a ready dir WITH NO
PANE: unguarded, `path.join(dir, undefined + '.json')` writes a stamp named `undefined.json` into the live directory.
Both cases exist because a mutant survived, not because I foresaw them.

## 4 · The wider case — STATED, NOT FIXED, as the packet asks

`consonance/src-tauri/src/main.rs:1150-1151` sets `CONSONANCE_PANE` and `CONSONANCE_READY_DIR` on the pane's command,
so **every process a pane starts inherits both** — not only the overseer's child. Any `claude` a seat spawns from its
own shell (a sub-agent, a probe, a one-shot `claude -p`, a script that shells out) carries the parent's pane id and
ready dir, and its Stop hook will stamp the PARENT pane. This lap closes the one case that is marked
(`CLAUDE_OVERSEER_RUN`); an unmarked child is still able to write a stamp about a pane it is not.

The shape of a fix, for whoever takes it (not mine, not this lap): the stamp could require a match between its own
session and the pane's, or the launcher could give each spawned child a marker of its own, or `ready.js` could refuse
when its process is not the pane's root process. Each needs something the stamp does not have today.

## 5 · NOT verified

- **Nothing was installed.** `~/.claude/shell/lib/ready.js` on this machine still has no overseer guard; the fix does
  nothing live until the chair installs it. The live copy was not read or compared this lap.
- **No overseer child was run.** The mechanism is asserted from the two hooks' source and the packet's verification,
  and tested by setting `CLAUDE_OVERSEER_RUN` directly — not by spawning a real L2/L3 worker and watching the stamp.
- **The full js-suite was not run**, only `--list` to prove discovery. The lap was short and the suite is ~102 files;
  the six pre-existing reds (N1b) are unrelated to this file.
- **The mutant kills are from my scratch runner, not the tracked harness** (§3), which scored nothing this lap.
- **One thing seen in passing, not mine and not touched:** the live `C:\Consonance\data\ready` holds a stale
  `…a01.json.30448.tmp` beside the stamps — a temp file from a rename that did not complete. It is harmless to the
  reader (the gate reads `<pane>.json`) but it is evidence that a write once died between `writeFileSync` and
  `renameSync`.
