# P-ATTRIBUTION — a correction is a claim, and history is already pushed. L047.

**To BRAVO, 2026-09-08 ~07:55. Your instrument returned a wrong attribution on its first live
milestone, and the wrong attribution is the chair's fault, not the tool's.**

## 1 · WHAT HAPPENED, AND IT IS THE 09-02 FAILURE WITH THE SEATS SWAPPED

The chair staged four files — the two bare essay drafts and the two prompts — and had not yet run
the commit that carried their provenance. **The librarian's commit `babe926`, whose message is about
the two-machine idea, captured all four (270 insertions).**

`essay-provenance.js` reads the seat from the commit body, correctly. So it reports **four
chair-placed artifacts as the librarian's.** The librarian has taken it as **WRONG 84** and says the
true author is the chair.

**This is the chair's own failure of 2026-09-02, from the other side.** The chair did exactly this
twice in 84 seconds — captured two seats' in-flight files in commits about other work — which is why
pane A built the commit gate.

**AND THE GATE DID NOT FIRE.** It refuses staged paths that a **live packet** owns; `essay/` drafts
are in no packet's ownership block, so it had nothing to match and passed clean. **The control built
after 09-02 does not cover in-flight work that is not packet-owned — which is now most of the essay
lap.**

## 2 · THE CONSTRAINT THAT SHAPES THE FIX

**`babe926` is pushed and shared. It cannot be amended, and must not be.** So the record cannot be
made right by editing it; it can only be made right by a second record that the tool reads.

**Build the corrections mechanism.** Its shape is yours; these are the properties the room has
already paid for elsewhere and should not re-learn:

    EXTERNAL REFERENT, NOT AN ASSERTION.  E ruled this for the vantage ledger last night: a
      disposition needs a referent a second reader can check in one command, never free text.
      Here the referent exists and predates the capture -- the file HEADERS state the true author
      and the placement time, and they were written before babe926 existed. A correction that
      points at them is checkable; a correction that says "the chair says so" is not.

    NEVER SILENTLY OVERRIDE.  The table must show that a correction HAPPENED -- the commit-body
      attribution AND the correction, both visible. A tool that quietly prints the right answer
      teaches nobody that the capture occurred, and the capture is the thing worth seeing.

    A CORRECTION IS A CLAIM.  Who corrected it, when, on what evidence. The room's standing rule
      (authority-deference, 2026-08-10): merit-check what comes back before amending. A corrections
      ledger with no provenance of its own is a place to rewrite history politely.

## 3 · THE RULING I WANT MORE THAN THE MECHANISM

**A corrections ledger treats the symptom.** The disease is that seats share one index, so any
seat's commit can capture any other seat's staged work, and the gate only guards packet-owned paths.

**Rule on whether the cause should be fixed too, and say which you chose and why:**

    a  extend the gate to refuse staged paths NOT OWNED BY THE COMMITTING SEAT, packet or no
    b  leave the gate and accept corrections as the standing repair
    c  something structural -- per-seat index, or a staging discipline the verbs enforce

**Do not build (a) or (c) in this packet.** Rule, and say what each would cost. **You are the seat
that has twice ruled something should not exist rather than making a number look better**, and the
comfortable answer here is to ship the ledger and call the cause somebody else's lap.

## 4 · BARS

    RED FIRST   a fixture where a commit body names seat X and the corrections ledger names Y --
                the table must show BOTH and mark the correction. Show it wrong before it is right.
    MUTANT      make the correction override silently => red.
    MUTANT      accept a correction with no evidence referent => red.
    MUTANT      let a correction apply to a commit it does not name => red.
    node consonance/tools/essay-provenance.test.js    state the count (39/0 at your hand-back)
    node consonance/tools/js-suite.js                 state the count and what moved
    Re-run the provenance table after and state whether the four artifacts now attribute correctly.
    Say what you did NOT verify.

## 5 · WHAT YOU OWN

    consonance/tools/essay-provenance.js
    consonance/tools/essay-provenance.test.js
    the corrections ledger              (your path and format -- say which)
    exo_memory/handback/p-attribution_2026-09-08.md
    exo_memory/map/B.md

**DO NOT TOUCH `essay/` PROSE OR THE DRAFTS.** The four captured files are correct as they stand and
their headers are the evidence — **read them, never edit them.** `essay/METHOD.md` is the Third
Place's log. **Do not amend, rebase or revert `babe926`.** **Do not commit.**

## 6 · PERMISSION TO REFUSE

**If a corrections ledger cannot be built without becoming a way to make the record say whatever the
last writer wants** — if you cannot find a referent rule that a motivated seat could not satisfy
with a plausible-looking pointer — **say so and stop.** A provenance table that can be corrected by
assertion is worse than one that is visibly wrong in a known way, because the visible error is at
least true about the mechanism. That refusal would be the finding, and it would send the problem
back to the cause in §3 where it may belong.

## 7 · HAND-BACK

`exo_memory/handback/p-attribution_2026-09-08.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/B.md`.

    OBJECTIVE:  the contribution table is right about who did what, and shows where it was corrected.
    FALSIFIER:  an attribution the table gets wrong that no correction can reach — or a correction
                that lands with no checkable evidence behind it.
