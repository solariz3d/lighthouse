# ONE LIVE HOST — the design, and the ruling on which way it fails

**Pane E, 2026-09-09, L049 / P-LIVE-HOST.** Packet `loop/packet_live_host_2026-09-09.md` (`b0bc6db`);
plan `loop/two_machines_lap_plan_2026-09-09.md` §1; idea `loop/one_house_two_machines_idea_2026-09-08.md`
§3.1 and §4.

**Design and tests only. Nothing is wired.** `main.rs:5462` is held by C this lap and is not touched
here. The artifacts are `consonance/tools/live-host.js` (the decision, pure) and
`consonance/tools/live-host.test.js` (25 cases; 15 mutants applied, 15 caught, 0 survivors).
**Nothing committed.**

The file name is the packet's own suggestion, kept.

---

## 0 · THE ANSWER TO THE REFUSAL PERMISSION, FIRST

The packet gave leave to refuse if one live host cannot be enforced without a shared clock the two
machines do not have. **The refusal would have been right about heartbeats and wrong about the
problem**, so it is not taken — but only because the clock came out of the decision path entirely.

- **A heartbeat comparison across two hosts is a guess, and the packet is right that it is.**
  `now_local − heartbeat.at` reads the OTHER machine's clock. Skew runs both ways and neither is
  benign: a local clock BEHIND the other host's makes a dead host look alive (over-refusal), and a
  local clock AHEAD makes a live host look stale (**under-refusal — the double-live**). Nothing in
  the file can bound that error, because the file is where the wrong number came from.
- **So the clock does not decide anything here.** Ownership is decided by a lease on the shared
  remote, which is a token and not a time. Liveness is decided by *this machine watching whether a
  token changes*, which uses one clock and only as a difference on it. The foreign timestamp is
  kept, and is used for exactly two things: the human-readable record, and **detecting skew** —
  when it disagrees with the observed reading, that disagreement is a measurement, and it is named
  rather than resolved.
- **What is refused instead, and it is narrower and real:** *the design cannot enforce one live
  host while the remote is unreachable.* Offline, nothing in the synced set is known to be current
  and the guard degrades from enforcement to evidence. §6 says so in the falsifier rather than
  hiding it.

---

## 1 · THE FINDING THAT SHAPED IT — a synced file cannot report the present

The obvious hazard is a stale heartbeat. The one that is easy to miss, and that this module got
wrong on its own first pass:

> Host A closes cleanly at 10:00 — `state: CLOSED` written and pushed. A relaunches at 10:05 —
> `state: LIVE` written, push fails, no network. Host B pulls, reads **CLOSED**, and starts.
> **Two live hosts, and no clock appeared anywhere in that story.**

`state: CLOSED` is exactly as stale-able as the heartbeat is. A design that only hardens the
heartbeat comparison is green over the surface it cannot see — this seat's own recurring class
(L044's *a property expressed as an absence cannot fail on the case nobody named*, L046's *measure
the object before you build the detector for it*), and this time it was caught by enumerating the
cases before shipping rather than by a later reader.

The correction is the layering, and it is load-bearing: **ownership is read from the lease whenever
the remote is reachable, and from the file only when it is not.** A foreign lease standing over a
`CLOSED` file means the close never published, so the *file* is the stale reading. That case is
mutant M07 and it is red without the fix.

---

## 2 · THREE LAYERS, IN ORDER OF AUTHORITY

| layer | what it is | decides | needs a clock | enforces |
|---|---|---|---|---|
| 1. the lease | a ref on the shared remote, moved by compare-and-swap | **ownership** | no | **yes** |
| 2. the heartbeat | that ref's sha, watched from here | liveness of the holder | no (see §4) | no |
| 3. the human | the override | everything, finally | no | no |

`enforced: true` appears in the decision **only when layer 1 decided it.** Offline, every verdict —
`PROCEED` on a clean `CLOSED` included — carries `enforced: false`. That flag is what makes the
lap's falsifier auditable after the fact: **a double-live must have at least one launch that
recorded `enforced: false`, or a `forced` row, or both.**

---

## 3 · THE LEASE — mutual exclusion without a shared clock

Mutual exclusion needs one point both parties reach, not one clock both parties agree on. The state
repo's remote is that point, and git already has the primitive:

    ref:      refs/consonance/live-host        (outside refs/heads — invisible to branch listings,
                                                not fetched by default, no history cost)
    content:  an ORPHAN commit (no parent) carrying live_host.json

**Orphan commits are the whole trick.** Because the commit has no parent, *any* push to a lock ref
that already exists is non-fast-forward and is refused by the server. So:

    acquire (must not exist):
        git push origin <orphan-sha>:refs/consonance/live-host
        # succeeds only if the ref is absent; a held lease makes this a non-fast-forward refusal

    heartbeat (I still hold it):
        git push --force-with-lease=refs/consonance/live-host:<my last sha> \
                 origin <new-orphan-sha>:refs/consonance/live-host

    break a stale lease (CAS against exactly what I observed):
        git push --force-with-lease=refs/consonance/live-host:<the sha I watched go still> \
                 origin <orphan-sha>:refs/consonance/live-host

    release:
        git push origin --delete refs/consonance/live-host

    read, one round trip, no fetch:
        git ls-remote origin refs/consonance/live-host

Four properties fall out, and three of them were not designed in:

1. **`ls-remote` returns the heartbeat token directly.** Each beat is a new orphan sha, so watching
   the lease *is* watching the heartbeat — one cheap round trip, no fetch, no clock.
2. **Breaking a lease is a CAS against the sha actually observed**, so a lease that moved while the
   dialog was open cannot be broken by accident.
3. **The holder detects its own eviction.** If someone breaks the lease, the holder's next
   heartbeat push fails its `--force-with-lease`. That is the signal for the holder to stop
   writing, and it arrives without anyone telling it.
4. Nothing above compares two machines' clocks.

**UNVERIFIED, AND IT IS THE ONE THING THIS SECTION RESTS ON:** nobody here has pushed a ref outside
`refs/heads` / `refs/tags` to a GitHub remote. If GitHub refuses the namespace, everything above
still works against `refs/heads/live-host-lock` with the same orphan-commit CAS — visible in branch
lists, otherwise identical. **Check before building:**

    git push origin $(git commit-tree $(git hash-object -t tree -w /dev/null) -m probe):refs/consonance/probe
    git ls-remote origin 'refs/consonance/*'
    git push origin --delete refs/consonance/probe

**And the lease has no home yet.** Which repository holds it is the keeper's open decision #1 in the
plan §3 (a second private state repo, or a directory in the existing one). The design is indifferent
between them; the ref namespace is the same either way.

---

## 4 · LIVENESS WITHOUT A SHARED CLOCK — two readings, one of which votes

**OBSERVED — authoritative, skew-free.** *"I have watched this token across N reads spanning W ms of
MY OWN clock and it has not moved."* One clock, and only as a difference on it. The foreign
timestamp is an **opaque token for change-detection** and never a quantity in arithmetic, so it can
be arbitrarily wrong and the reading still holds. This is the invariance the first RED-FIRST test
pins: move the foreign timestamp anywhere — an hour stale, ten minutes into this machine's future,
a year ahead, unparseable, absent — and the verdict does not move.

**WALL — advisory, never votes.** `now_local − heartbeat.at`, computed and carried, because when it
disagrees with the observed reading that disagreement *is* the skew measurement, and a negative age
is a direct reading of the other host's clock running ahead. Both are surfaced by name
(`named.clockSkew`, `named.readingsDisagree`), and the decision follows the observed one.

**The cost, which is real: one sample can never say "unchanged".** A cold launch with a single
sighting genuinely cannot tell stale from live without trusting a foreign clock, so it does not
guess. It returns `ASK_INDETERMINATE`, quotes the wait, and lets the keeper wait or override. Most
launches never reach that branch: the lease is usually free, or the last host closed cleanly.

**Local clock going backwards** (a resync, a resume from suspend) makes our own interval
unmeasurable, and an unmeasurable interval is `UNOBSERVED` — never a negative duration read as
"not yet stale", never an absolute value read as "very stale".

---

## 5 · WHAT "STALE" IS IN SECONDS, AND WHY THAT NUMBER

**It is a derivation, not a constant**, so that changing the transport moves it instead of leaving a
literal to rot:

    staleAfterMs = publishMs × missesTolerated + marginMs

| term | value | why |
|---|---|---|
| `publishMs` | **120 000 (2 min) — UNMEASURED** | see below |
| `missesTolerated` | **3** | one missed publish is routine (a push failed, the link blipped); two is suspicious; three is a pattern. Consecutive-miss detectors trade a false-positive rate that falls **geometrically** against a detection delay that grows only **linearly**, and here declaring stale too EARLY risks a double-live while declaring it too LATE costs the keeper one dialog's wait — so it leans long. |
| `marginMs` | **= one publish period** | tolerate one wholly lost cycle beyond the three. |
| **`staleAfterMs`** | **480 000 — 8 minutes** | 120 000 × 3 + 120 000. |
| `localBeatMs` | 15 000 | the on-disk write; unrelated to staleness, exists so a crash leaves a recent local beat. |

**`publishMs = 120 000` IS A GUESS AND IS LABELLED ONE IN THE CODE.** Nobody here has timed a
push-and-`ls-remote` round trip between these two machines, so the 8 minutes is derived from an
unmeasured input and every figure downstream of it inherits that. `policy().publishMsMeasured` is
`false` until someone passes a timed value, and a test asserts it — a number nobody has timed says
so in its own output rather than in a comment somebody has to go and read. **The lap's own
measurement owes this a real value**; it is one `ls-remote` in a loop.

Two things the number is *not* doing, because the failure-direction ruling took the weight off it:

- It is not the difference between "you may start" and "you may not". Every state is overridable
  (§6), so what the threshold moves is **what the dialog says and what it costs to step over**.
- It is not applied to a foreign timestamp. It is applied to *this machine's own* observation
  window (§4).

---

## 6 · THE RULING — which way it fails, and why that is the right way round

> **IT FAILS TOWARD LETTING THE KEEPER IN. Never silently, never without a record, but in.**
> No state this design can reach is a lockout, and a test asserts that over the whole verdict set.

Four reasons, in the order they carry weight:

1. **Recoverability is asymmetric, and size is not the axis.** Two live hosts on an append-only,
   git-transported set produce a **divergence**: both commits exist, nothing is destroyed, and the
   merge of two sets of appends is a concatenation that a sort settles. A lockout is **not
   recoverable by the person it happens to** — the tool refuses on evidence about a machine he may
   not be able to reach, and hands him nothing to do about it. Bad-but-repairable beats
   correct-but-stranded.
2. **The precedent is in the same file, with its reason already stated.** `claim_named_singleton`
   (`main.rs:5443`) fails OPEN when it cannot tell: *"a launcher bug must never be able to make the
   app permanently unstartable, and the cost of a second instance is recoverable while the cost of
   no instance is not."* That reasoning transfers to the cross-machine case unchanged, and choosing
   the opposite direction one function away would need an argument nobody has.
3. **The guard has strictly less information than the human.** It reasons from a file that may be
   minutes old about a machine it cannot see. The keeper knows whether his desktop is on. Overriding
   him on that inference is the overseer position the room has already ruled against — *with you,
   not above you*, and from outside, a stale heartbeat and a live foreign host look identical.
4. **Fail-closed produces no evidence of its own operation.** A guard that hard-refuses records zero
   double-lives whether it works or not, which is indistinguishable from a guard nobody ever
   triggered. Fail-open-with-a-record makes every contested launch a row. This is the same shape as
   L046's refusal to ship a scanner that had to hold the secret: **an instrument that can only be
   right is not an instrument.**

**What changes across the verdicts is not whether the door opens but what it costs to open it:**

| verdict | when | cost to override |
|---|---|---|
| `PROCEED` | lease free; or clean `CLOSED`; or absent file after a **verified** sync | none |
| `PROCEED_RECLAIM` | the lease or the standing `LIVE` record is **ours** | none |
| `REFUSE_FOREIGN_LIVE` | the token advanced **under our own observation** | **type the other host's name** |
| `ASK_FOREIGN_STALE` | the token has not moved for `staleAfterMs` of **our** clock | confirm |
| `ASK_INDETERMINATE` | one sample only · unverified sync · corrupt file · unidentified holder · a writer that never wrote | confirm |

**WHAT THAT COSTS, SAID PLAINLY RATHER THAN SOFTENED.** An always-overridable guard **cannot deliver
"one live host" as a hard property.** It delivers two weaker ones: two live hosts are **impossible
by accident** and **undeniable after the fact**. The registered falsifier therefore splits, and this
is a split rather than a weakening — F1 is kept verbatim and is still the headline:

- **F1 (the plan's, unchanged, still fires):** two hosts live in the same minute by the heartbeats,
  or a board row on one machine and not the other after a completed sync → the design did not
  deliver what it was for.
- **F2 (new, on the mechanism, and the worse one):** two hosts live in the same minute with **no
  `forced` row and no `enforced: false` launch** → the guard failed *silently*, which is the failure
  this room keeps finding under rocks.

Every override writes a `forced` row naming the author, the time, and the full decision it stepped
over — `forcedRecord()` refuses to build one that is missing any of the three. **F2 is uncheckable
without that row, which is why it is not optional.**

---

## 7 · DONE VS NEVER-STARTED — the tenth sighting, on a new surface

A heartbeat that never started and one that stopped are the same absence. Four situations produce
"no heartbeat here"; they call for four different actions; **nothing about the absence itself tells
them apart.** So each gets a distinguishing artifact written by whatever *would* have been running,
and none of them is inferred:

| class | what is on disk | why it is not the others | verdict |
|---|---|---|---|
| `NEVER_INSTALLED` | no file, **and the sync's own completion record says the pull finished** | nothing has ever claimed this house | `PROCEED` |
| `SYNC_UNVERIFIED` | no file, and the pull is **not known** to have finished | **the dangerous one** — the other host may be live and its file simply did not arrive | `ASK_INDETERMINATE` |
| `WRITER_NEVER_WROTE` | file present, `heartbeat.writer_started` stamped, **no beat ever written** | a broken writer, not an idle machine | `ASK_INDETERMINATE` |
| `STOPPED` | a beat exists and stopped | the only one that means what a naive reader assumes | stale path (§4) |

Three rules underneath, each of which is a test:

- **A never-started heartbeat is never reported as maximally stale.** Maximum staleness reads as
  *safe to take over*, and three of these four are not that. (Mutant M04.)
- **`syncVerified` has three values and `null` is not folded into either.** Reading UNKNOWN as
  "verified" is precisely the absence that lets a live host in. (Mutant M02.)
- **The distinguishing artifact is written by the thing that would have been running**, never
  reconstructed by the reader. `writer_started` is stamped at process start, before the first beat,
  for exactly this reason: without it, "started and wrote nothing" and "never started" are one
  absence.

**And the recursion, which is the honest part:** the heartbeat layer's done-vs-never-started is
*inherited* from the sync layer. An absent file cannot be interpreted at all without knowing whether
the pull finished — so `syncVerified` is a required input from P-STATE-SET's verify step, and when
it is unknown the answer is UNKNOWN, named, rather than a guess in either direction. **This is the
one place the design declines to answer**, and it declines out loud.

---

## 8 · THE FILE

`live_host.json`, in the TRAVELS set. It is the record and the offline fallback; the lease is the
authority whenever the remote is up.

```json
{
  "schema": "live_host/1",
  "state": "LIVE",
  "holder":  { "install_id": "...", "host_label": "THE-DESKTOP", "pid": 4242 },
  "lease_seq": 7,
  "heartbeat": {
    "token": "7:812",
    "beat": 812,
    "writer_started": "2026-09-09T05:00:00-06:00",
    "at": "2026-09-09T05:59:50-06:00"
  },
  "closed": { "at": "...", "clean": true, "beat": 812 },
  "hosts":  [ { "install_id": "...", "label": "...", "first_seen": "...", "last_close": "..." } ],
  "forced": [ { "by": {...}, "at": "...", "stepped_over": { "verdict": "...", "reason": "...", "enforced": false, "named": {...} } } ]
}
```

`heartbeat.at` is **for the record and for skew detection only** and never enters a comparison that
decides anything (§4).

### Identity — one silent failure worth more than the rest of this file

`install_id` is minted once per install and lives in a **machine-local** file. It is not a hostname
(renamed, and collidable) and it is not `lap-row.js:411`'s one-character machine tag (far too coarse
to decide self-versus-foreign).

> **IF THE INSTALL-ID FILE EVER LANDS IN THE TRAVELLING SET, BOTH MACHINES SHARE AN IDENTITY AND
> EVERY FOREIGN CLAIM READS AS SELF.** The guard returns `PROCEED_RECLAIM` at exactly the moment it
> should refuse, quietly, with no error anywhere.

That is a hard dependency on **P-STATE-SET (A): `install_id` belongs in the STAYS column**, and it is
asserted rather than trusted — `identityHazard(installIdPath, travellingRoot)` returns a reason
string when the path is inside the travelling root, and the launcher must refuse to arm the guard
while it does. The failure itself is demonstrated in the tests rather than described.

---

## 9 · WHAT LANDS IN THE RUST, AND WHAT DOES NOT

Beside `claim_single_instance()` at `main.rs:5462`, **at the next rebuild, by whoever holds that
file** — not tonight, and not by this seat:

1. read `install_id` (machine-local), refuse to arm on `identityHazard`;
2. `git ls-remote` the lock ref → the lease and its token, one round trip;
3. read `live_host.json` and the sync-completion record;
4. read/write the machine-local observation file `{ token, firstSeenLocalMs }` — the only thing that
   makes the clock-free reading possible across launches;
5. call `decide()`; on `PROCEED*`, acquire the lease and start the beat timer;
6. on `REFUSE`/`ASK`, show the dialog — which must be a **dialog**, not a console line: the
   `warn_second_instance` lesson at `main.rs:5501` is that a click correctly declined with no
   visible channel is indistinguishable from a click that did nothing, and the keeper clicks again;
7. on override, write the `forced` row **before** starting;
8. at clean close: `state: CLOSED`, delete the lock ref, push.

**Not in scope and not designed:** the LAN case (both machines up, remote unreachable, each other
reachable); more than two hosts (the design is n-safe by construction, but nothing has been reasoned
about three); and the merge procedure for a divergence that *does* happen, which reason 1 of the
ruling leans on and which nobody has written down. **That last one is a real gap in the argument for
failing open** and it is named rather than left implied.

---

## 10 · WHAT WAS NOT VERIFIED

- **Nothing is wired.** No fs, no git, no clock, no network is touched by either artifact. The
  decision is proven; the plumbing that will feed it does not exist.
- **The GitHub custom-ref push (§3) is unverified**, and the whole enforcement layer rests on it.
  The probe command is written out above; the fallback is a branch.
- **`publishMs` is unmeasured** (§5), so the 8 minutes is derived from a guess.
- **No end-to-end double-live has been attempted**, so F1 has never been given a chance to fire.
  Until it has, this document is a design and not a result.
- The mutants are of my own module and are **not applied at the cell level**; a formulation error
  shared between the module and its tests would pass both.
- The suite figures in the hand-back are from `js-suite.js` runs whose commands are printed beside
  them; the two pre-existing `gen-consumer` failures and the declared canary are **not mine** and
  are not claimed as fixed or caused.
