# HANDOFF — the chair, 2026-09-02 ~07:56. Written for the desktop, and for whoever wakes here next.

**This file is a POINTER. The record is `exo_memory/librarian/LEDGER.md` and
`exo_memory/librarian/2026-09-02.md`.** Restating them here would be the copy-of-a-copy maintenance
law 1 forbids, and this room has been bitten by exactly that twice tonight.

**Read the librarian's handoff first** — `loop/handoff_librarian_2026-09-02.md`. This one adds only
what the chair holds and the desk does not.

---

## 1 · THE STATE, IN FOUR LINES

    origin/main   ab33fdf6e696          (GitHub's own API, not git's cache)
    working tree  clean, 0 dirty
    a fresh clone gets 1594 files       (git archive origin/main | tar -t == git ls-files, delta 0)
    the exe       09-02 07:41           C:\build\lighthouse-target\release\consonance.exe

**The push is done.** The keeper lifted "no push" at 07:48–07:50 and it had held ~80 commits.

## 2 · THE ONE THING THE DESKTOP MUST NOT ASSUME

**`CARGO_TARGET_DIR` is `C:\build\lighthouse-target`, set 2026-07-28** to reclaim 19.5 GB.
`consonance/src-tauri/target/release/` **does not exist** and has not for five weeks.
`launch.ps1:87` says `cargo metadata` is the only source of truth for it.

**The chair read that stale path at 07:41, found no exe, and told the keeper "nothing is built" —
twice, then wrote a whole inventory on it.** He had rebuilt two minutes earlier. *An absence at a
guessed path was reported as an absence of the thing.* If you are checking whether something shipped,
ask the tool where it writes; do not look where it used to.

## 3 · WHAT LANDED TONIGHT — by pane, all in the 07:41 build

Each is one commit; open the commit for the finding, not this list.

    ALPHA    map_dir() reaches the repo at last, via repo_root() rather than a fourth private tier
             the COMMIT GATE -- a file is released only by its holder's hand-back
             the verbs REFUSE out of turn (mcp.rs) -- the baton, enforced
    BRAVO    the corpus budget: shape (c), the constant test DELETED not re-pointed
    CHARLIE  the ring lap gets a row shape; --initiator gains librarian; --holder refused at the write
             P-INBOX -- deliveries queue and drain only on a ready screen with an EMPTY prompt line
    ECHO     the LOOP LOGO -- the indicator moved off the tab bar entirely
             the harvester diagnosis (leg 1) -- the detector was innocent

## 4 · THE FOUR WAKE PROOFS — scored, not predicted

    1  map carried      PARTIAL PASS.  The resolver WORKS: four shells, each naming its own file,
                        first time on this machine. But TWO OF FOUR HAVE AN EMPTY BODY -- A (45,390
                        chars withheld) and B (76,231). E and C carry real findings.
    2  verb refusal     PASS. Fired for real on the librarian's first out-of-turn ring; the board
                        row names lap-row.js as the escape.
    3  inbox            PASS in the only way it can be observed -- the keeper's messages stopped
                        being spliced mid-word.
    4  the logo         UNSCORED. The keeper's glance is the instrument and he leaves at 08:00.

**Proof 1's partial failure was PREDICTED BY A BEFORE ANYONE LOOKED**, and it is the shape to carry:
`grep -c "YOUR OWN MAP"` returns **4**, which reads as a clean pass. Two of those four are headers
with nothing under them. **A header with an empty body and a header with content produce the same
count.** A's packet said in advance: do not read *carried* as *the maps landed*.

**And the inversion under it, unowned:** the body allowance is ~5k against a ~105k fixed brief, so
**the more a pane has recorded, the less of it comes back.** B has the largest map and gets none of
it. *A pane that has done the most work wakes with the least.* That is a budget defect, not a
resolver defect, and nobody owns it.

## 5 · OPEN, AND WHOSE

**Keeper's, and they are decisions rather than tasks:**

- **P-WORKTREE-PER-SEAT** — one checkout per seat. A priced it at a night's work. It ends the
  file-collision class *structurally* instead of guarding it, and A's own ruling is that a hook's
  failure mode is SILENT ABSENCE: no git hook has ever existed in this checkout, and absent looks
  identical to passing.
- **`cards/ORDER`** — only **8 of 12** cards fit the shelf and the pick is currently `sort()`.
  Dropped: `no-floor-no-ceiling`, `stop-and-feel-it`, `trust-the-first-attention`,
  `verify-before-claiming`. **The alphabet is choosing what every pane wakes holding.**

**Unowned work:**

- **The harvester, leg 2** — parked with a hand-back (`handback/p-watcher-liveness_2026-09-02.md`).
  `main.rs:1071` the watcher does `Err(_) => break` where the reader at `:1038` tolerates the same
  poisoned lock. **Until it ships, a watcher can still die silently and a pane still loses its night.**
- **The map body allowance** (§4).
- **The commit gate is NOT ARMED.** `node consonance/tools/commit-gate.js --install`. Deliberately
  held so the first refused commit is a test and not a landing.
- **`chain-status` OUT OF TURN** — CLI only, no build needed.
- **A↔C untested together** — refuse and queue have never been exercised in one binary.

## 6 · WHAT THE CHAIR GOT WRONG TONIGHT, because the next one will reach for the same moves

Kept short and specific; the LEDGER has the rest.

- **`git add -A` with four panes live**, twice inside 84 seconds, capturing A's and E's in-flight
  files into commits about other work — **after quoting `c2afec6`'s own "Named paths, no git add -A"
  in a packet the night before.** A rule its violator can recite is not a control. That is what
  P-COMMIT-GATE exists for.
- **Committed through a refusal**: `node commit-gate.js | head -3` returns *head's* exit code, so
  `&&` proceeded past an exit 1. Twice tonight a pipe masked a status. **Run the gate unpiped.**
- **A packet's prose disabled its own ownership block** by QUOTING the phrase `WHAT YOU OWN`; the
  parser matched the blockquote, broke on the next line, derived zero paths, and everything failed
  closed. Real fragility, recorded not fixed.
- **Published the wrong CAUSE for the `corpus-age` red twice** (`wake_2026-09-02.md:30`). The true
  cause was `c2afec6` deliberately removing `librarian_budget()`.
- **Four mid-lap dispatches in one lap**, resetting the hand-back counter each time — the behaviour
  THE BATON RULE now forbids, committed while building the thing that forbids it.
- **The stale target path** (§2).

**The pattern, said once because it ran nine times in two nights:** *two different facts producing
the same reading.* Done vs never-started. `unknown` vs `idle`. Nothing-harvested vs
harvested-nothing. Held-because-working vs held-because-nobody-started. A header with content vs a
header without. **Every single one was found by an eye or by an instrument that returned a number
nobody wanted — never by care.** Build the instrument that can return the unwanted number; do not
resolve to check harder.

## 7 · THE OBSERVATION THAT EXPIRED

If a stalled pane still rendered on resize, the mutex was not poisoned; if not, the watcher panicked.
**Nobody took it before the 07:41 relaunch, and the app's stderr goes to no file.** It is gone. Said
plainly rather than left as an open question someone will later think was answered.
