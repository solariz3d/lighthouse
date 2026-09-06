# P3 · THE FIRST-PUSH GATE — `cargo check` never ran an assertion, and the app has never been
# launched from a generated tree.

**To ECHO, 2026-09-06 ~00:55. L037, door two (the keeper 00:44–00:50). Map:
`exo_memory/librarian/2026-09-06.md` §"L037 MAP" (`f3c4e93`) — READ IT AT THE FILE.**

## 1 · THE KEEPER'S BAR, VERBATIM IN EFFECT

**The generated tree BUILDS and LAUNCHES; failing tests are DECLARED, not fixed.**

That is the whole first-push bar. It is deliberately not "the suite is green" — the consumer repo is
PUBLIC and **may be incomplete**, and pretending otherwise is what this gate exists to prevent.

## 2 · THE DEFECT IN THE CURRENT GATE, AND IT IS THE ROOM'S OLDEST ONE

`gen-consumer.build.test.js` uses **`cargo check`** as its oracle. **`cargo check` type-checks and
never runs an assertion** — it is listed in `BUILDING.md`'s own failure catalogue as a test gate that
is not one.

**And `consumer_parity_2026-09-04.md` §5 has the receipt: six Rust tests RED under a GREEN
`cargo check`.** A gate reporting success over six red tests. **That is the same two-facts-one-reading
shape that ran nine times in two nights on 09-01/02** — *compiles* and *works* rendering identically.

**Move the oracle to `cargo build` + a LAUNCH PROBE.** Building is stronger than checking; launching
is the only thing that answers the keeper's actual bar, and **nobody has ever launched the app from a
generated tree.**

## 3 · THE SECOND DELIVERABLE — `CONSUMER-STATUS.md`, GENERATOR-WRITTEN

Lists the tests that fail in the generated tree, **BY MEMBER**.

**J's D010 rule governs the shape: print the LIST, not the count.** A count is a number a reader
cannot act on and cannot check; a list is both. This is the document that makes *"may be incomplete"*
honest instead of a disclaimer.

**The generator writes it.** Same discipline as C's `CUTOFF.md` this lap: a status file maintained by
hand is a status file that lies within a week.

## 4 · THE PARITY NUMBER IS DEMOTED — read this before you use it

`consumer_parity_2026-09-04.md`'s `(18,1,1)`, `I=8` and the member list in §3 **are no longer the
bar.** The keeper's answer 3 demoted them: parity is now **the instrument that says how far off the
consumer is after each port**, not a gate anyone must pass. **Do not build the gate to make that
number move.**

## 5 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, E: *"stops at a bar it cannot clear and says why, then finds the defect one
layer up."*

**Twice in one night that was the deliverable.** You withdrew bar 0 rather than fake it, and found
the row defect underneath. And on P-CAPTURE-HARVEST you **refuted the chair's candidate** and named
the real defect one layer up — *the watcher has no liveness signal* — which outranked the crash.

**A launch probe is also a platform-reasoning problem, which is your other row.** You caught
`var()`-in-an-SVG-presentation-attribute not resolving in WebView2 **by reasoning about the platform,
when every test would have been green and nobody would have seen anything.** A launch probe that
"passes" without the window actually coming up is that failure again.

## 6 · BARS

    1  RED FIRST: the new oracle must FAIL on a tree that compiles and does not launch. If you
       cannot construct that case, say so -- an oracle never seen to fail is not known to work.
    2  MUTANT: revert the oracle to `cargo check` => red. If it stays green, the gate did not move.
    3  MUTANT: make CONSUMER-STATUS.md print a COUNT instead of the list => red.
    4  THE LAUNCH PROBE MUST DISTINGUISH "launched" FROM "process started and died". Those are two
       facts that will produce one exit code if you let them. Say how yours tells them apart --
       this is the load-bearing bar of the packet.
    5  Say what you did NOT verify. In particular, whether a probe that passes HERE would pass on a
       machine with no Rust toolchain and no WebView2 -- you cannot test that from this laptop and
       must not claim it.

## 7 · WHAT YOU OWN — repo-relative, mandatory (A's commit gate reads this block)

    consonance/tools/gen-consumer.build.test.js
    exo_memory/handback/p-first-push-gate_2026-09-06.md
    exo_memory/map/E.md

**B holds `consonance/tools/gen-consumer.js` this lap.** If the generator must write
`CONSUMER-STATUS.md` — and it must — **name the change and hand it to B rather than making it.** One
seat, one file; that is the release rule A built the gate for. **C is ruling the foundation set. A
holds `BUILDING.md`.** **Do not commit.** Name your paths.

## 8 · PERMISSION TO REFUSE

Say so if: a launch probe cannot be made deterministic in a test (**then the honest deliverable is
`cargo build` plus a MANUAL launch step written into the run procedure, said out loud, not a flaky
probe pretending to be a gate**); or the generated tree cannot be built without a checkout path that
does not exist yet — that path is A's packet (P4) and the dependency is a finding, not a blocker to
work around.

## 9 · HAND-BACK

`exo_memory/handback/p-first-push-gate_2026-09-06.md`, then `call_librarian` with that path in the
same turn. One line to `exo_memory/map/E.md`.

    OBJECTIVE:  the first thing a stranger does with this repo -- clone it and build it -- works, and
                what does not work is written down where they will see it.
    FALSIFIER:  registered in the map: if the first consumer commit lands and a stranger's fresh
                clone cannot `cargo build` it, this gate was decorative.
