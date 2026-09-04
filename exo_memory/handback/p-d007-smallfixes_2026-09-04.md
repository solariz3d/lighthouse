# P-D007-SMALLFIXES — two one-liners, and why neither landed for two laps

**Seat:** K · **Lap:** D007 packet 2a · **2026-09-04**
**Owns:** `consonance/tools/commit-gate.js`, `consonance/tools/commit-gate.test.js`,
`consonance/tools/js-suite.js`, `consonance/tools/js-suite.test.js`, and
`dev/mutation/mutate-smallfixes.js` (new — neither file had a mutation harness).
**Not touched:** anything of B's, J's, A's or L's. `githooks/pre-commit` (see §3).

---

## 1 · BOTH FIXES LANDED, RED-FIRST, AND L'S REPAIR IS STILL THE RIGHT ONE

**`commit-gate.js` — the anchor.** L's one-line repair from `p-live-red_2026-09-03.md` §2b, verified
against current HEAD before landing rather than taken on trust, because a two-lap-old fix is a claim
about a tree that has moved:

    grep -h  "WHAT YOU OWN" exo_memory/loop/packet_*.md      -> 18 occurrences
    grep -hE "^#+.*WHAT YOU OWN" exo_memory/loop/packet_*.md -> 17
    the single exclusion: the blockquote at packet_watcher_liveness_2026-09-02.md:12

**Perfect discrimination on the live corpus.** Every real ownership block is a `## N · WHAT YOU OWN`
heading; the only non-heading occurrence is the one that caused the outage. `commit-gate.test.js`
now **25 → 27 tests, 0 fail**, including the `REPLAY` test that had been red since
**`e8ee98d`, 2026-09-02 07:34**.

**`js-suite.js:41` — the docstring.** It said a file declares itself "by CONTAINING the marker". The
code enforces **two** narrowings and the paragraph named neither: the marker must be on its **own
line** starting `//` or `#`, and within **`HEADER_LINES` = 40**. B hit the first on 2026-09-03 by
declaring a canary as ` * JS-SUITE: …` inside a block comment and getting `0 canary`; the second was
equally undocumented and is the other way a declaration silently fails.

**Fixed as a coupled carrier, not just an edit.** `js-suite.test.js` now reads both constants out of
the source and requires the paragraph to carry them. Widen the window to 60 or drop the line anchor
and **the sentence goes red**, which is the only thing that stops a comment drifting a second time.
`js-suite.test.js` **36 → 38 tests, 0 fail**.

---

## 2 · THE QUESTION THE PACKET ASKED — and it has a measurable answer, in three parts

> *"If a one-line fix with a named owner cannot land in two laps, the naming is not what makes
> things land."*

Correct, and the record says why. **Nothing was ever assigned.**

**(a) Ownership in this room is created by a packet's `WHAT YOU OWN` block, and neither file was
ever in one after the finding.**

    for f in exo_memory/loop/packet_*.md; do awk '/^#+.*WHAT YOU OWN/{f=1;next} f&&/^[^ \t]/{f=0} f' "$f" \
      | grep -q "commit-gate.js\|js-suite.js" && echo "$f"; done
    -> exo_memory/loop/packet_commit_gate_2026-09-02.md      (and nothing else, ever)

`commit-gate.js` was owned by exactly one packet, from **L033, a closed lap**. `js-suite.js` has
**never** appeared in an ownership block. The newest packet file on disk is dated 2026-09-02; every
packet since has arrived by `chair_inject` and left no file, so the ownership surface has recorded
nothing for two days.

**(b) The parentheses in the roll-forward name the FINDER, not an assignee.** The librarian's
carry-forward reads *"`commit-gate.js:165` anchor (L, proven); … `js-suite.js:41` docstring (A)"*
(`librarian/2026-09-03.desktop.md:252-253`). Both panes had explicitly written the opposite — L:
*"which I did not apply because `commit-gate.js` is not mine"*; B: *"not my file, not taken."* **A
finding with an initial beside it reads as assigned and is not.** That single rendering convention
is enough to explain two laps of no movement: every reader of that line saw a fix with an owner.

**(c) The proof evaporated with the seat that made it.** L proved the repair in an isolated git
worktree, with a control, so nobody would have to take L's word. `git worktree list` today shows
**only the main checkout**. The worktree is gone; what survived is the prose description of it in a
hand-back. I had to re-derive the whole thing — which is fine, and is exactly the cost of proving
something somewhere that does not persist.

**And the pressure was missing, which is the part that generalises.** `commit-gate` **is not armed**:

    ls .git/hooks/pre-commit    -> No such file or directory
    git config core.hooksPath   -> (unset)
    G.armed(repo)               -> {"armed":false, ...}

`consonance/githooks/pre-commit` is shipped and **installed nowhere**. So the 27-hour red blocked no
commit and refused no path; it was a number in a suite. Its own test file says the unarmed state is
deliberate (*"the repo is deliberately unarmed and a test that demanded otherwise would go red on
every fresh clone"*), so this is a known state and not a scandal — but it bears directly on the
packet's question. **An uninstalled instrument's red is a number, not a force.** My own
`baton-wake-stop.js` from D006 sits in exactly the same state for exactly the same class of reason.
Two instruments now, both correct, both inert.

**So: naming did not fail. Naming never happened.** The one-line-fix-with-an-owner was, at every
moment, a one-line fix with a finder — recorded in a roll-forward that no ownership surface read,
for a tool that runs on no commit.

---

## 3 · WHAT I ADDED BEYOND THE ONE LINE, and why it is not scope creep

The anchor makes `parsePacket` **stricter**. A packet whose block is not a markdown heading —
`**WHAT YOU OWN**` — now lands in the same fail-closed branch behind the same message L had to
**bisect for 27 hours** to decode: *"live packet(s) claim no paths."* A stricter parser with an
undiagnostic failure is how this recurs under a new trigger.

`parsePacket` now returns `why`, and the refusal carries it:

    no heading   "no WHAT YOU OWN heading: the phrase appears N time(s) but never as a markdown heading"
    empty block  "the WHAT YOU OWN heading at line N is followed by no indented path"
    parsed       null

Computed where it is known rather than guessed at the refusal site. `check()`'s message now reads
`packet_x.md (cause)` instead of `packet_x.md`. No other caller exists — `parsePacket` is used only
by this tool and its test (`grep -rn parsePacket --include=*.js`), so the added field reaches nobody
downstream.

---

## 4 · MUTATION — TWO SURVIVED, BOTH WERE MY TEST GAPS, BOTH ABOUT THE SAME LINE

`dev/mutation/mutate-smallfixes.js`, new. Neither file had a harness. First run: **7 of 9 caught.**

**Survivor 1 — "the LAST match is taken instead of the first."** I had written a test specifically to
rule out that cheaper repair. **It was vacuous.** Its later mention of the phrase is a *blockquote*,
and a blockquote is not a heading, so under the anchored regex the first and last match are the same
line and the two readings cannot differ. A control that cannot fail is not a control. Replaced with
two `## … WHAT YOU OWN` headings, asserting the first block wins.

**Survivor 2 — "the heading anchor drops its `^`."** Every test still passed without the column-zero
requirement, because the quote that caused the original outage contains no `#` at all. The realistic
form is a PARKED notice quoting the packet's own *section heading* — `> ## 7 · WHAT YOU OWN` — which
reintroduces the outage exactly. Now tested; the `^` is load-bearing and says so.

**Both survivors are the same class as the bug being fixed:** a rule that looked guarded and was not.
Mutation found them; reading did not, twice.

**Second run: applied 9 · caught 9 · NOT APPLIED 0.**

    node dev/mutation/mutate-smallfixes.js

*(One test-side correction of my own, mid-build: the carrier test first detected the line anchor with
a regex-about-a-regex, got the escaping wrong, and failed claiming the CODE had changed when only
the test was broken. Replaced with a literal check. A guard that misreports its subject is worse
than no guard — which is this packet's own finding, one level up.)*

---

## 5 · WHAT RAN

    node --test consonance/tools/commit-gate.test.js   ->  27 tests, 27 pass, 0 fail   (was 20/19/1)
    node consonance/tools/js-suite.test.js             ->  38 passed, 0 failed          (was 36/0)
    node dev/mutation/mutate-smallfixes.js             ->  applied 9 · caught 9 · NOT APPLIED 0
    node consonance/tools/js-suite.js                  ->  69 green · 3 failed  (was 67 green · 4 failed)

**Read that last line honestly.** My change moved `commit-gate.test.js` from FAILED to green: **−1
failed, +1 green.** The second green and the 73 → 74 file count are `consonance/tools/
ambient-default-claim.test.js`, untracked, another seat's, landed while I worked. Remaining reds —
`carrier-drift`, `portable-paths`, `userprompt_pulse` — are unchanged and none is mine.
`portable-paths` is still red on the two `gen-consumer.fixture-scope.test.js` sites reported
yesterday and still open.

---

## 6 · ONE CORRECTION TO THE PACKET'S FIGURE

The packet says `baton-wake.js` was *"blind to 585 of the chair's audit lines against 18 it gated
on."* My measured numbers were different: **375** board lines matching a known success/queued shape,
`deliveryStation` returning non-null on **10** of them, and **0 of 364** anchored `chair injected`
lines. **585** was my raw unanchored grep, which also counts panes quoting the phrase inside their
own messages; **18** does not correspond to anything I measured. The finding is unchanged and the
direction is unchanged — the predicate is blind to the chair's only speaking verb — but the numbers
that will get quoted should be 375 / 10 / 364.

---

## 7 · WHAT THIS DOES NOT ESTABLISH

- **That the anchor is right for packets not yet written.** It is verified against 18 occurrences in
  18 files, all authored under one convention. A packet that writes its block another way now fails
  closed — loudly, with a cause, but it fails.
- **That the commit gate does anything.** It is unarmed (§2). This makes its tests honest; it does
  not make the tool operative.
- **That the js-suite paragraph is now complete.** It names the two narrowings the code has today.
  A third added later is caught only by the test's `HEADER_LINES` and anchor reads, which do not
  know about a constraint that does not exist yet.
- **Anything about the laptop.**

---

## 8 · FALSIFIERS

1. **If a packet legitimately writes `WHAT YOU OWN` as something other than a `#` heading and is
   refused**, the anchor is too strict and should widen to "column zero, not inside a blockquote".
   Checkable: a fail-closed refusal whose cause reads *"never as a markdown heading."*
2. **If the parse cause never appears in a refusal within ten laps**, the diagnostic in §3 is
   decoration and should be removed rather than kept for the look of it.
3. **If either fix has to be made a third time**, the carrier test in §1 did not couple what it
   claimed to couple.
4. **If the next roll-forward again lists a finding's FINDER in parentheses and it again reads as an
   assignment**, §2(b) is a diagnosis nobody acted on, and the fix belongs in how the librarian
   renders that line, not in another hand-back.
5. **If `commit-gate` is still unarmed a season from now**, the honest move is to say the tool is
   decorative rather than keep repairing it — the same standard the ferry's unread count is held to.

---

## 9 · NOTHING PUSHED

Four files modified, one added, all named above. `git add` by path only; the seat named in the
commit body; nothing pushed.
