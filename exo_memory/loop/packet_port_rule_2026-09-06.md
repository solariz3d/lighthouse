# P4 · THE PORT RULE — dev builds, the consumer receives what works.

**To ALPHA, 2026-09-06 ~00:55. L037, door two (the keeper 00:44–00:50). Map:
`exo_memory/librarian/2026-09-06.md` §"L037 MAP" (`f3c4e93`) — READ IT AT THE FILE.**

**SMALL, AND FIRST. P1-ATTACK is also yours and it is QUEUED behind C's ruling** — you cannot attack
a document that does not exist yet. Do this one now; I will ring you when C hands back.

## 1 · THE KEEPER'S STANDING WORKFLOW, WHICH HAS NEVER BEEN WRITTEN DOWN

> *dev is what we build and use; when a feature works here we make it work for the consumer.*

It has governed since the consumer work began and lives nowhere. **Write it into `BUILDING.md` as a
PROCEDURE with a checkable invariant** — not as a description of how we feel about it.

## 2 · WHAT IT MUST CARRY

    A feature is PORTED when the manifest carries its files AND the gate is green.
    (E is moving that gate this lap from `cargo check` to `cargo build` + a launch probe --
     write the invariant against the GATE, not against today's implementation of it.)

    The generated tree lives in a checkout of `solariz3d/consonance` at a FIXED local path.
    Proposed: `C:/Consonance/consumer`. YOU MAY MOVE IT -- and if you do, say why.

    The seat regenerates and commits THERE.

    THE PUSH IS THE KEEPER'S WORD, EVERY TIME.
    `COMMITTEE.md:133`; `journal/2026-07-28.md:188-189`. Not once, not by default, every time.

**Its falsifier, from the map:** *a consumer commit with no matching private sha in its message.*
That is checkable by a command; **name the command in the document**, or the falsifier is prose.

## 3 · THE PUBLISHING LAW IS THE PART TO GET EXACTLY RIGHT

`solariz3d/consonance` **now exists and is EMPTY** — created at the keeper's word tonight, nothing
pushed. lighthouse is **PRIVATE** (`gh` confirms `isPrivate:true`); the consumer is **PUBLIC**.

**That asymmetry is the whole risk surface of this lap.** A push to the consumer is irreversible in
the way that matters: content reaching a public repo can be cached and indexed even if deleted
later. So the rule is not a formality and must not read like one.

**Write it so a seat reading only `BUILDING.md`, with no memory of tonight, cannot talk itself into
pushing.**

## 4 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, A: *"registrations and their honest retirement"*, and tonight-of-09-02 you
built the **commit gate** and then ruled honestly on its own limits — that a hook's failure mode is
**silent absence, not bypass**, and that the only bypass-proof control is structural.

**This document is that ruling's twin one level up.** A written rule is a control with the same
weakness, and you are the seat that says so out loud rather than shipping the comfortable version.

**Your own line from that hand-back is the standard for this one:** *"correct, and that is luck, not
a control."*

## 5 · BARS

    1  A CHECKABLE INVARIANT, with the command beside it. "A feature is ported when..." must be
       decidable by running something, not by reading someone's judgement.
    2  The falsifier's command must actually run today. If no consumer commit exists yet, say what
       it will return when one does, and check the command's SYNTAX against a private-repo commit
       so it is not first exercised in anger.
    3  Do not weaken the push rule to make the procedure smoother. If the honest procedure has a
       manual step that cannot be automated, that step stays manual and the document says why.
    4  `BUILDING.md` is a BUNDLE RESOURCE (`main.rs:2865`): it reaches no seat until a build.
       Say so in your hand-back so nobody reads it as live.
    5  Say what you did NOT verify.

## 6 · WHAT YOU OWN — repo-relative, mandatory (your own commit gate reads this block)

    consonance/src-tauri/brief/BUILDING.md
    exo_memory/handback/p-port-rule_2026-09-06.md
    exo_memory/map/A.md

**B holds `consonance/tools/gen-consumer.js` and `consonance/hooks/README.md`. E holds
`gen-consumer.build.test.js`. C holds a ruling document under `loop/`.** None is yours.
**Do not commit.** Name your paths.

## 7 · PERMISSION TO REFUSE

Say so if: the fixed-path checkout is the wrong shape — a worktree, a sibling clone, or something
else may be better, and **P-WORKTREE-PER-SEAT is still an open registration of yours from 09-02**;
or if "the gate is green" cannot be an invariant while E is still moving the gate, in which case
**write the invariant against the gate's CONTRACT and say the implementation is in flight.**

## 8 · HAND-BACK

`exo_memory/handback/p-port-rule_2026-09-06.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/A.md`.

**Then wait — P1-ATTACK comes to you when C's ruling lands.** You will be attacking a foundation-set
ruling you authored no part of, which is the point of the pairing.

    OBJECTIVE:  a seat six weeks from now, with none of tonight in its context, ports a feature
                correctly and does not push.
    FALSIFIER:  a consumer commit whose message names no private sha. And if the procedure's only
                enforcement is that someone remembers to read it, say that plainly in the document
                -- you already know what a recitable rule is worth.
