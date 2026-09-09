# P-LIVE-MIRROR — both on, one driver per seat. L052.

**To ECHO, 2026-09-09 ~03:30. Your own design, wired. The keeper tests after 08:00.**

## 1 · THE TASK IS IN THE PLAN, AND HALF OF IT IS ALREADY YOURS

    exo_memory/loop/two_machines_lap_plan_2026-09-09.md   §4, P-LIVE-MIRROR -- yours in full
    exo_memory/loop/design_live_host_2026-09-09.md        YOUR design, from last night

**The unit changed and the design survived it.** You built a whole-machine lease; the keeper's spec
needs it **per seat** — `refs/consonance/live/<seat>` — because both machines are on at once and a
follower takes over one seat by being typed into. **A design that survives its unit changing is the
kind worth having, and yours did.**

## 2 · THE REMOTE IS REAL AS OF 03:28 — probe the custom ref against it

    solariz3d/consonance-state     private, verified
    C:\Consonance\state\           cloned, A is building the tree there now

**Probe the custom-ref push for real rather than assuming it works.** `refs/consonance/live/<seat>`
is not a branch and not a tag; some hosts and some configurations refuse arbitrary ref namespaces.
**The plan's fallback is a branch — take it if the probe fails, and say which you are on**, because
a lease that silently degraded to a branch is a lease nobody can reason about.

## 3 · THE BOUND WAS SET BEFORE THE BUILD, WHICH IS THE ONLY REASON IT MEANS ANYTHING

    <= 5 s   internet
    <= 1 s   LAN

**The keeper named those before anything existed to measure.** So `publishMs` is not a number you
report — it is a number that either clears a bar set in advance or does not.

    FALSIFIER: a measured latency above the bound, or two drivers of one seat inside a minute.

**Measure the ROUND TRIP, not the push.** A push that returns in 200 ms and a follower that notices
four seconds later is a four-second system, and the keeper will experience the second number.

## 4 · THE PER-TURN PUSH DEPENDS ON A THING A IS STILL MEASURING

Your Stop hook runs `state-sync.js --push` after each turn. **A is measuring right now whether the
writers tolerate linking or copy-on-close, and whether there is a window where the destination is
wrong.** If A comes back saying the state can only move at a quiescent moment, **your per-turn
cadence is the thing that changes, not A's copy.**

**Do not build past that seam without saying you have.** A hook that pushes mid-write would ship a
corrupt tail to the other machine at turn cadence — fast, automatic, and wrong.

## 5 · AND THE ONE YOU ALREADY NAMED, WHICH THIS MAKES LIVE

Your L050 addendum: **moving the baton TO panes never traps anyone; moving it AWAY is the only
trapping move.** A follower acquiring a seat's lease is exactly that move, across machines — the
laptop's seat becomes a follower mid-turn because someone typed at the desktop.

**Say what happens to a seat that is mid-turn when its lease is taken.** You named this case as
unfixed inside one machine; here it acquires a network and a second keyboard.

## 6 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, E: the lease with no clock votes, the harvester guard, the debt gate. **You
remove ambiguity rather than tuning thresholds**, and this packet has two available ambiguities —
stale-vs-live across machines, and mid-turn-vs-idle across a network.

## 7 · WHAT YOU OWN

    consonance/tools/live-host.js  + its test
    the Stop hook and the follower loop   (name them in the hand-back)
    exo_memory/handback/p-live-mirror_2026-09-09.md
    exo_memory/map/E.md

**A holds `state-sync.js` — you CALL it, you do not write it. C holds `main.rs`. B holds the
compaction.** **Do not commit.**

## 8 · PERMISSION TO REFUSE

**If the round trip cannot clear 5 s over the internet with a git remote in the middle, say so with
the number.** That is not a failure of your build — it is the measurement the bound was written to
receive, and it would mean the live mirror needs a peer channel rather than a repo. **The keeper
bounded this before building precisely so the answer could be no.**

## 9 · HAND-BACK

`exo_memory/handback/p-live-mirror_2026-09-09.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/E.md`.

    OBJECTIVE:  type on either machine, see it on the other, and never two drivers of one seat.
    FALSIFIER:  a measured latency above the bound, or two drivers of one seat inside a minute.
