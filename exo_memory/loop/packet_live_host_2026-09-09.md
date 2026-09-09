# P-LIVE-HOST — one live host, enforced. Design and tests only. L049.

**To ECHO, 2026-09-09 ~00:25. Nothing here depends on the board measurement or on any other packet
in this lap.**

## 1 · THE TASK IS IN THE PLAN

    exo_memory/loop/two_machines_lap_plan_2026-09-09.md   §1, P-LIVE-HOST -- yours, in full
    the idea file §3.1 and §4                             the guard and its registered falsifier

**Open them.** This packet routes the object rather than restating it.

## 2 · DESIGN AND TESTS TONIGHT; THE RUST LANDS AT THE NEXT REBUILD

The plan says so and it is not a hedge: `main.rs` beside the mutex at `:5462` is a live surface, and
a change nobody can exercise tonight should not be folded tonight. **Deliver the design plus its
tests, wired to nothing** — your own proven shape, three times now.

## 3 · THE PART THAT DECIDES WHETHER IT WORKS

**A stale heartbeat and a live foreign host look identical to a naive reader, and that difference is
the whole guard.** The plan says stale heartbeats are **named, never silently overridden** — build to
that, and **say what "stale" is in seconds and why that number.**

**And rule on the failure DIRECTION.** A guard that refuses on a stale heartbeat locks the keeper out
of his own machine; one that proceeds on a fresh foreign heartbeat runs two live hosts and corrupts
the thing the lap exists to protect. **Say which way yours fails and why that is the right way
round.** You are the seat that has twice narrowed its own alarm rather than shipping the loud
version, which is why this ruling is yours.

**And it is done-vs-never-started on a new surface** — the tenth sighting this fortnight, and by now
the room's signature failure. **A heartbeat that never started and one that stopped are the same
absence** unless something distinguishes them. Say what does.

## 4 · WHAT YOU OWN

    exo_memory/loop/design_live_host_2026-09-09.md   (or the name you pick -- say which)
    the test file                                    (your name -- say which)
    exo_memory/handback/p-live-host_2026-09-09.md
    exo_memory/map/E.md

**DO NOT EDIT `consonance/src-tauri/src/main.rs` — C holds it this lap.** A holds `install.ps1` and
the manifest; B is on P-ATTRIBUTION. **Do not name any file `loop/packet_*.md`** — the commit gate
reads those as live packets and fails closed. **Do not commit.**

## 5 · PERMISSION TO REFUSE

**If one live host cannot be enforced without a shared clock the two machines do not have, say so.**
Clock skew between hosts makes every heartbeat comparison a guess, and naming that is worth more than
a guard that is right only when the clocks happen to agree.

## 6 · HAND-BACK

`exo_memory/handback/p-live-host_2026-09-09.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/E.md`.

    OBJECTIVE:  two machines, one Consonance, and the second one says so instead of racing.
    FALSIFIER:  the plan's -- two hosts live in the same minute by the heartbeats, or a board row on
                one machine and not the other after a completed sync.
