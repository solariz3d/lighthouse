# P-LIVE-HOST — hand-back. Pane E, 2026-09-09, L049.

**Packet:** `exo_memory/loop/packet_live_host_2026-09-09.md` (`b0bc6db`). **Plan:**
`loop/two_machines_lap_plan_2026-09-09.md` §1. **Idea:** `loop/one_house_two_machines_idea_2026-09-08.md`
§3.1, §4.

**Delivered — design and tests, wired to nothing, as the packet ordered:**

    exo_memory/loop/design_live_host_2026-09-09.md    the design (the packet's own suggested name, kept)
    consonance/tools/live-host.js                      the decision, pure: no fs, git, clock or network
    consonance/tools/live-host.test.js                 25 cases

**`consonance/src-tauri/src/main.rs` NOT TOUCHED** (C holds it). `install.ps1` and the manifest not
touched (A holds them). **Nothing committed.** Every number below re-derives from the command printed
beside it.

---

## 1 · THE RULING THE PACKET ASKED FOR — which way it fails

> **IT FAILS TOWARD LETTING THE KEEPER IN. Never silently, never without a record, but in.**

No state the module can reach is a lockout, and that is a test over the whole verdict set rather than
a claim (`NO verdict this module can return is a lockout`). Four reasons, in weight order —
design §6 carries them in full:

1. **Recoverability is asymmetric and size is not the axis.** Two live hosts on an append-only,
   git-transported set produce a *divergence*: both commits exist, nothing is destroyed, the merge of
   two sets of appends is a concatenation a sort settles. A lockout is **not recoverable by the
   person it happens to** — the tool refuses on evidence about a machine he may not be able to reach.
2. **The precedent is one function away, with its reason stated.** `claim_named_singleton`
   (`main.rs:5443`) fails OPEN when it cannot tell — *"the cost of a second instance is recoverable
   while the cost of no instance is not."* Choosing the opposite direction beside it would need an
   argument nobody has.
3. **The guard has strictly less information than the human.** It reads a file that may be minutes
   old about a machine it cannot see; the keeper knows whether his desktop is on.
4. **Fail-closed produces no evidence of its own operation** — zero recorded double-lives whether it
   works or not, which is indistinguishable from a guard nobody triggered.

**What that costs, not softened: an always-overridable guard cannot deliver "one live host" as a
hard property.** It delivers two weaker ones — impossible by accident, undeniable after the fact.
What the verdicts change is not whether the door opens but what it costs to open it:
`REFUSE_FOREIGN_LIVE` wants the other host's name typed, the two `ASK`s want a confirm, `PROCEED`
asks nothing.

**So the falsifier splits — a split, not a weakening, and F1 is kept verbatim as the headline:**

- **F1 (the plan's, unchanged):** two hosts live in the same minute by the heartbeats, or a board row
  on one machine and not the other after a completed sync.
- **F2 (new, worse, because silent):** two hosts live in the same minute with **no `forced` row and
  no `enforced:false` launch**. `forcedRecord()` refuses to build a row missing author, time, or the
  decision it stepped over — F2 is uncheckable without it.

---

## 2 · THE CLOCK — the refusal permission, answered rather than taken

The packet's permission to refuse was **right about heartbeats and wrong about the problem**, so it
is not taken — but only because the clock came out of the decision path entirely.

- **Ownership** is decided by a **lease on the shared remote** — a token, not a time. Mutual
  exclusion needs one point both machines reach, not one clock both agree on, and git already has
  the primitive: an **orphan commit** pushed to `refs/consonance/live-host` makes every push to an
  existing lock ref non-fast-forward, so acquire is create-only, and breaking a stale lease is
  `--force-with-lease` against **exactly the sha observed**.
- **Liveness** is decided by *this machine watching whether that sha moves* — one clock, and only as
  a difference on it. `git ls-remote` returns the token in one round trip with no fetch, so watching
  the lease **is** watching the heartbeat.
- **The foreign timestamp is kept and never votes.** It is used for the record and for **detecting
  skew**: a negative age is a direct reading of the other host's clock running ahead, and a
  disagreement between the two readings is named (`named.clockSkew`, `named.readingsDisagree`)
  rather than resolved.

**What IS refused, narrower and real: the design cannot enforce one live host while the remote is
unreachable.** Offline it degrades from enforcement to evidence, and `enforced:false` says so on
every offline verdict.

**Three properties fell out of the lease that were not designed in** (§3): `ls-remote` is the
heartbeat read; breaking is a CAS against the observed value, so a lease that moved cannot be broken
by accident; and **the holder detects its own eviction**, because its next heartbeat push fails its
own `--force-with-lease`.

---

## 3 · "STALE" IN SECONDS, AND WHY

**A derivation, not a constant**, so changing the transport moves it instead of leaving a literal to
rot:

    staleAfterMs = publishMs × missesTolerated + marginMs
                 = 120_000 × 3 + 120_000 = 480_000 ms = 8 minutes

    node -e "console.log(require('C:/Consonance/lighthouse/consonance/tools/live-host.js').policy().staleAfterMs)"
    # 480000

**`missesTolerated = 3`**: one missed publish is routine, two suspicious, three a pattern.
Consecutive-miss detectors trade a false-positive rate that falls **geometrically** against a
detection delay that grows only **linearly**, and here declaring stale too EARLY risks a double-live
while declaring it too LATE costs one dialog's wait — so it leans long. **`marginMs` = one publish
period**: tolerate one wholly lost cycle beyond the three.

**`publishMs = 120_000` IS UNMEASURED AND SAYS SO IN ITS OWN OUTPUT.** Nobody has timed a
push-and-`ls-remote` round trip between these two machines, so the 8 minutes is derived from a guess
and everything downstream inherits that. `policy().publishMsMeasured` is `false` until a timed value
is passed, and a test asserts it — a number nobody has timed declares itself rather than hiding the
admission in a comment. **The lap's own measurement owes this a real value; it is one `ls-remote` in
a loop.**

And the threshold is **not** applied to a foreign timestamp: it is applied to this machine's own
observation window.

---

## 4 · DONE VS NEVER-STARTED — what distinguishes them

Four situations produce "no heartbeat here", they need four different actions, and the absence tells
you none of it. Each gets an artifact written by whatever *would* have been running:

| class | on disk | verdict |
|---|---|---|
| `NEVER_INSTALLED` | no file, **and the sync's completion record says the pull finished** | `PROCEED` |
| `SYNC_UNVERIFIED` | no file, pull **not known** to have finished — the dangerous one | `ASK_INDETERMINATE` |
| `WRITER_NEVER_WROTE` | file present, `writer_started` stamped, **no beat ever written** | `ASK_INDETERMINATE` |
| `STOPPED` | a beat exists and stopped | the stale path |

**The rule that does the work: a never-started heartbeat is never reported as maximally stale** —
maximum staleness reads as *safe to take over*, and three of these four are not that. And
`syncVerified` has three values: `null` is UNKNOWN and is folded into neither, because reading
UNKNOWN as "verified" is exactly the absence that lets a live host in.

**The recursion, which is the honest part:** the heartbeat's done-vs-never-started is **inherited
from the sync layer**. An absent file cannot be interpreted without knowing whether the pull
finished — so `syncVerified` is a required input from P-STATE-SET's verify step, and when it is
unknown the answer is UNKNOWN, out loud. This is the one place the design declines to answer.

---

## 5 · THE BUG THIS SHIPPED ON ITS FIRST PASS, AND HOW IT WAS FOUND

Writing the case table turned up something the brief did not name and that I had not seen:

> **A synced file cannot report the present — and that is not only true of its heartbeat.**
> Host A closes cleanly at 10:00 (`CLOSED` written and pushed), relaunches at 10:05 (`LIVE` written,
> push fails, no network). Host B pulls, reads **CLOSED**, starts. **Two live hosts, and no clock
> appeared anywhere in that story.**

My first pass read the file before settling ownership, so a **foreign lease standing over a `CLOSED`
file returned `PROCEED`** — the exact double-live the lap exists to prevent. Fixed by making the
lease outrank the file in *both* directions; the disagreement is now named
(`named.leaseFileDisagree`) instead of silently resolved toward the stale reading. It is mutant M07
and the test `a foreign lease OUTRANKS a CLOSED file` is red without the fix.

**This is my own recurring class, third sighting** — L044's *a property expressed as an absence
cannot fail on the case nobody named*, L046's *measure the object before you build the detector for
it*. It arrived this time as *hardening the obvious surface while a second surface with the same
weakness sat beside it untouched*. It was caught by enumerating the cases before writing the tests
rather than by a later reader, which is the only difference from the previous two.

---

## 6 · THE SILENT FAILURE THAT OUTWEIGHS EVERYTHING ELSE HERE — and it is A's to close

`install_id` decides self-versus-foreign. It is machine-local by design (not a hostname — renamed and
collidable; not `lap-row.js:411`'s one-character machine tag — far too coarse).

> **IF THAT FILE EVER LANDS IN THE TRAVELLING SET, BOTH MACHINES SHARE AN IDENTITY AND EVERY FOREIGN
> CLAIM READS AS SELF.** The guard returns `PROCEED_RECLAIM` at exactly the moment it should refuse,
> quietly, with no error anywhere.

**Hard dependency on P-STATE-SET (A): `install_id` belongs in the STAYS column.** Asserted rather
than trusted — `identityHazard(installIdPath, travellingRoot)` returns a reason string when the path
is inside the travelling root, and the launcher must refuse to arm the guard while it does. The
failure itself is *demonstrated* in the tests, not described.

---

## 7 · THE BARS

    node consonance/tools/live-host.test.js
    # tests 25 · pass 25 · fail 0

**Mutants — 15 applied, 15 caught, 0 survivors.** Harness in the scratchpad, not in the repo:
`scratchpad/mutants-live-host.js`. Each is a rewrite a plausible implementation would actually have
had, and each names the test that killed it. The ones worth listing:

| mutant | what it is | killed by |
|---|---|---|
| M01 | the wall clock decides staleness after all | *the foreign timestamp cannot change the verdict* |
| M02 | an unknown sync is read as a verified one | *the four absences are four answers* |
| M04 | a never-started heartbeat is treated as maximum staleness | *a writer that started and never wrote is NOT reported as maximally stale* |
| M05 | the strongest refusal becomes a lockout | *NO verdict this module can return is a lockout* |
| M07 | **the original bug** — the file outranks a foreign lease | *a foreign lease OUTRANKS a CLOSED file* |
| M11 | the identity hazard matches a sibling directory by prefix | *a shared install id turns every refusal into a reclaim* |
| M13 | a changed token is not read as life | *the foreign timestamp cannot change the verdict* |

**The headline test is an invariance, not a case:** hold the local observation fixed, move the
foreign timestamp anywhere — an hour stale, ten minutes into this machine's future, a year ahead,
unparseable, absent — and the verdict must not move, in both the stale and the live direction. If the
wall clock has any vote at all, one of the fourteen combinations flips.

**Suite, whole tree** (`node consonance/tools/js-suite.js --quiet`, 00:41):

    js-suite: 81 green · 3 failed · 0 crashed · 0 silent · 1 canary · 0 sang · 0 not-run · 0 class-error  (of 85)
    universe: 85 test files discovered · 85 ran assertions to a summary

**The three reds are named and none is mine:** `forget-rate.test.js`,
`gen-consumer.fixture-scope.test.js`, `gen-consumer.test.js`; canary `targetless-pull.test.js`. The
baseline run I took at 00:36 — before `live-host.test.js` existed — carried the same forget-rate
verdict block and the same two gen-consumer failures.

**And a correction to my own bar, because it is the kind of figure this room keeps finding wrong:
I do not quote a before-count.** I truncated that first run with `tail -25` and threw its summary
line away, and by the time I noticed, A and C were landing files in the shared tree, so a re-run
would not have been the same universe. The after-figures above are re-derivable by one command; a
"was 80, now 81" would have been hand-made. What is checkable without it: the three failing files
are named, and none of them is the one I added.

---

## 8 · WHAT WAS NOT VERIFIED

- **Nothing is wired.** No fs, git, clock or network is touched. The decision is proven; the plumbing
  that will feed it does not exist, and neither does the Rust that will call it.
- **The GitHub custom-ref push is UNVERIFIED and the whole enforcement layer rests on it.** Nobody
  here has pushed a ref outside `refs/heads`/`refs/tags` to a GitHub remote. Probe in design §3;
  the fallback is a plain branch with the same orphan-commit CAS, which costs only visibility.
- **`publishMs` is unmeasured**, so the 8 minutes is derived from a guess (§3).
- **No end-to-end double-live has been attempted**, so **F1 has never been given a chance to fire.**
  Until it has, this is a design and not a result.
- The mutants are of my own module and are **not applied at the cell level**; a formulation error
  shared between module and tests would pass both.
- **Not designed:** the LAN case (both machines up, remote unreachable, each other reachable); three
  or more hosts (n-safe by construction, but nothing has been reasoned about it); and **the merge
  procedure for a divergence that does happen** — which reason 1 of the failure-direction ruling
  leans on, and which nobody has written down. That is a real gap in the argument for failing open
  and it is named rather than left implied.

---

## 9 · WHAT THIS OWES OTHERS, AND WHAT OTHERS OWE IT

- **To A (P-STATE-SET):** `install_id` in STAYS, `live_host.json` in TRAVELS, and a **sync-completion
  record** the launcher can read — §4's `syncVerified` is a required input and the design refuses to
  interpret an absent file without it.
- **To C (`main.rs`):** the wiring list is design §9, eight steps. One of them is not a detail — the
  refusal must be a **dialog**, not a console line: `warn_second_instance` (`main.rs:5501`) exists
  because a click correctly declined with no visible channel is indistinguishable from a click that
  did nothing, and the keeper clicks again.
- **To the keeper:** the lease has no home until decision #1 in the plan §3 is made (second private
  state repo, or a directory in the existing one). The design is indifferent; the ref namespace is
  the same either way.
