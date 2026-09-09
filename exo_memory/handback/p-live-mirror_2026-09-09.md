# P-LIVE-MIRROR — the lease clears the bound; the state mirror does not. L052.

**Pane E, 2026-09-09 ~04:45.** Packet `loop/packet_live_mirror_2026-09-09.md` (`95d55b6`); plan
`loop/two_machines_lap_plan_2026-09-09.md` §4; my own design `loop/design_live_host_2026-09-09.md`.

**Artifacts.** `consonance/tools/live-host.js` (+220 lines: the seat dimension), its test (+14 cases,
**39 pass / 0 fail**), `consonance/tools/live-follow.js` (new, the follower loop),
`consonance/hooks/live-mirror-stop.js` (new, the Stop hook), `consonance/hooks/live-mirror-stop.test.js`
(new, **8 pass / 0 fail**). **Nothing committed.** Map line appended to `map/E.md`.

**The refusal in §8 is TAKEN, in one half and not the other.** The numbers are in §2.

---

## 0 · THE ANSWER, BEFORE THE ARGUMENT

| | round trip, measured | + a realistic 1.5 s poll | the keeper's bound |
|---|---|---|---|
| **the LEASE** (never two drivers) | **2 800 ms** | 4 300 ms | **≤ 5 000 ms — CLEARS** |
| **the STATE** (see it on the other machine) | **4 760 ms** | 6 260 ms | **≤ 5 000 ms — FAILS** |

**The objective has two halves and they get different answers.** *"Never two drivers of one seat"*
is delivered and proved end-to-end against the real remote. *"Type on either machine, see it on the
other"* **does not fit the bound over a git remote** — 4 760 ms is the FLOOR, measured with the
follower polling in a tight loop, which is not a system anyone would run and would hammer GitHub.
The largest poll interval that still fits is **240 ms**.

**That is the measurement the bound was written to receive.** The keeper set 5 s before anything
existed to measure, so this is not a number I am reporting — it is a bar cleared or not cleared.
Per §8: **the live mirror of STATE needs a peer channel rather than a repo.** The lease can stay on
the repo; it is small, flat in the number of seats, and has 2.2 s of headroom.

**One thing that could change it is UNTESTED, and I will not claim it as a mitigation.** ~1 s of
every operation is TLS connection setup; SSH with `ControlMaster` multiplexing removes it. **No SSH
key is configured on this machine**, so I could not measure it. I tried, and the run came back at
78–86 ms — because it was timing `Permission denied (publickey)`, not a transfer. **Named in §6 as a
mistake I nearly reported as a finding.**

---

## 1 · THE PROBE — the custom-ref namespace works, and no fallback was taken

**`refs/consonance/live/<seat>` pushes to GitHub.** Probed against the real remote rather than
assumed, as the packet required. **We are on the custom ref, not the branch fallback.**

    git push origin <orphan-sha>:refs/consonance/live/probe     ->  * [new reference]
    git ls-remote origin 'refs/consonance/*'                    ->  the ref, one round trip

All three CAS properties the lease rests on hold **against the real remote**, not in theory:

| property | probed result |
|---|---|
| acquire-if-absent: a second push to a held ref is refused | `! [rejected] (fetch first)`, git exit **1** |
| `--force-with-lease` with an explicit expect works with **no remote-tracking ref** | confirmed — this was the doubt in the design |
| a WRONG expect is refused | `! [rejected] (stale info)` |
| the CORRECT observed expect succeeds | `+ 4382b58...aaff35b (forced update)` |

**One correction to my own design doc:** it says the namespace is *"invisible to branch listings, not
fetched by default"*. The second half is right and load-bearing; the first is looser than I wrote —
a **bare `git ls-remote origin` DOES list it**. It is absent from `git branch -r` and from the
default fetch refspec, which is what actually matters, but the sentence as written was wrong.

**All probe refs were deleted from the remote.** `git ls-remote origin` is empty at hand-back.
Unreachable objects remain in GitHub's storage until their gc, which I cannot trigger — stated
because a probe that says it cleaned up should say what it could not clean.

---

## 2 · THE MEASUREMENTS — and every one of them is re-runnable

Laptop → `github.com/solariz3d/consonance-state` over **HTTPS**, 2026-09-09 ~03:35.

**Lease (an orphan commit, no content), n=8, median:**

    push  1 780–1 911 ms   (median ~1 800)
    read  0 976–1 242 ms   (median ~1 000)   `git ls-remote origin <ref>`

**Every `ls-remote` issued immediately after a push saw the new sha — 8 of 8.** GitHub has no ref
replica lag, so on the lease path *notice* is one poll away rather than a wait. That is why the
lease clears.

**State (the real 4.7 MB capture tail rewritten + board rows appended), n=6 pushes:**

    push      2 449–3 147 ms   (median ~2 500)
    fetch             2 164 ms   (n=1, at a second clone)
    checkout             97 ms
    ------------------------------------------
    push + fetch + checkout = 4 786 ms, ZERO poll interval

**Two honest limits on the state figure.** The base was a **10 MB board slice + the real 4.7 MB
tail**, not the full TRAVELS set; and fetch/checkout are **n=1**, so they are a reading rather than
a distribution. Both are named because the verdict is a boundary call — 4 786 against 5 000 — and a
boundary call deserves to say how soft its inputs are. **The verdict does not turn on that softness:
a zero poll interval is already impossible, so the floor being ±300 ms does not rescue it.**

**MY FIRST ROUND-TRIP RUN WAS INFLATED BY MY OWN HARNESS AND I RE-RAN IT.** I had nested a
`git ls-remote` inside the push line to compute the lease expect, so "push" was timing two round
trips (3 577–4 055 ms end to end). A real holder knows its own last sha and needs no read. The
numbers above are the corrected run. **The first run was discarded, not reported — recorded here
beside the number it corrects rather than in a later section** (L050's own lesson about where a
correction goes).

**The bound lives in code, not in this document:** `live-host.js` `roundTrip(kind, pollMs)` and
`maxPollMs(kind)`, with `BOUND_INTERNET_MS = 5000` asserted against the keeper's number so that a
red result cannot be fixed by moving the bar. `node consonance/tools/live-follow.js --budget`
prints it.

---

## 3 · THE SEAM THE PACKET TOLD ME NOT TO BUILD PAST — and A answered it mid-build

The packet was right that my cadence depended on A. **A's answer arrived while I was building, and
it is worse than my gate had assumed:**

- reading a capture mid-rewrite returned an **EMPTY file on 1 812 of 1 833 reads**;
- a `stat/read/stat/read` gate agreeing four ways **still accepted 6 torn buffers out of 28**;
- hard links are refused on two independently measured grounds.

**So the gate is a settle window inside A's `state-sync.js`, and a path that will not come back
stable aborts the WHOLE push by name.** My `quiescent()` therefore returns **`'DELEGATED'`** and
re-derives nothing — two copies of one rule drift apart, which is the committee card's own warning.

**A's closing line is the half that is mine:** *"Retry between turns. ... that is the
quiescent-moment finding, and it changes the push CADENCE, not this tool."* **This hook is the
cadence.** So the hook classifies A's unsettled abort as **DEFERRED — a normal, self-correcting
outcome** — and distinguishes it from a genuinely broken sync, **which share exit code 1**.
Collapsing them would either cry wolf whenever a capture happened to be mid-rewrite, or bury a
broken sync under a reassuring "deferred". Two tests pin exactly that, mocked at the process
boundary with a real script that really exits 1 with A's real wording.

**B's compaction also landed mid-build and removed a blocker I was about to report.** At 03:32
`board.jsonl` was **338 MB against GitHub's 100 MB per-file hard limit** — the state set could not
have been pushed at all. It is now **45 MB**, original in `attic/board.jsonl.2026-09-09`.

---

## 4 · WHAT HAPPENS TO A SEAT THAT IS MID-TURN WHEN ITS LEASE IS TAKEN

**This is my L050 invariant with a network and a second keyboard attached:** *moving the baton TO
panes never traps anyone; moving it AWAY is the only trapping move there is.* A follower acquiring
a live seat is exactly moving it away.

**What makes it worse here is a property of the DATA, not the protocol — and it undercuts a premise
of my own earlier ruling.** The failure-direction ruling in the L049 design licensed failing open
because a divergence is *recoverable*: the board and ledgers are append-only and two hosts' appends
merge by concatenate-and-sort. **The tails are REWRITTEN.** A rewritten file has no merge; one
host's version replaces the other's. **So the premise that licensed failing open does not hold for
the tails**, and an evicted mid-turn seat can lose exactly one thing — the transcript tail of the
turn it was in the middle of, which is a seat that wakes as a stranger.

**Therefore acquiring a LIVE seat is not a break by default. It is a REQUEST**, honoured by the
holder at its next turn boundary. That takes the clock out of the decision the same way the lease
did: **the follower waits for an EVENT — the turn ending — not for a duration nobody can
calibrate.** A holder that is dead rather than busy stops advancing its token, and the existing
stale path covers it with no new mechanism.

**The keeper can still take it.** `TAKE_FORCED` is one confirmation away — failing toward letting
the human in is not weakened. What it may never be is **silent**: the ruling **names the turn it
will orphan BEFORE the click**, and a test asserts it does not invent a casualty when none is in
flight.

**And the evicted holder's side — three moves, one defensible:**

| | | |
|---|---|---|
| (a) abort the turn | destroys work that cannot be regenerated | **refused** |
| (b) finish, do not push | work survives locally, divergence named | **taken** |
| (c) finish and push | two drivers, silently | **the failure this lap is named for** |

(b) is the failure-direction ruling turned around: that one fails toward letting the human *in*,
this one fails toward not *destroying* what he already has.

---

## 5 · THE END-TO-END RUN — F1 finally got a chance to fire

The L049 design listed this as its largest gap: *"no end-to-end double-live has been attempted, so
F1 has never been given a chance to fire."* **It has now been attempted, against the real remote,
with two clones standing in for two machines. 15 of 15 checks passed.**

    1 LAPTOP acquires the free seat                                     PASS
    2 DESKTOP reads the same sha; rules REQUEST on a live holder        PASS
    3 DESKTOP's plain acquire is REFUSED by the server                  PASS  ! [rejected] (fetch first)
    4 forced take: TAKE_FORCED, names the orphaned turn, CAS succeeds   PASS
    5 THE LAPTOP DISCOVERS ITS OWN EVICTION from its next heartbeat     PASS  ! [rejected] (stale info)
      and the ruling finishes the turn / refuses to publish / quarantines
    6 a stale CAS from the evicted holder cannot resurrect the lease    PASS
    7 release, and the seat reads free afterwards                       PASS

**Step 5 is the one worth having.** The displaced holder is told by *nothing but its own failed
heartbeat*. No message, no timeout, no clock — the push it was going to make anyway is the
notification. That property was designed on paper in L049 and had never been run.

---

## 6 · THE MISTAKE TO CARRY, AND IT IS THE SAME ONE FOUR TIMES IN ONE SESSION

**L050's lesson was: a two-arm classifier will invent the missing arm. I then wrote four more.**

1. `git push ... | tail -5; echo exit=$?` reported **exit=0 on a refused push** — `$?` was `tail`'s.
   Caught by re-checking git's raw exit code.
2. The SSH run reported **78–86 ms round trips**. It was timing `Permission denied (publickey)`, and
   `exit=$?` was reading a `date` assignment. **I nearly reported "SSH multiplexing is 10× faster"
   as a finding.** Caught by the `Permission denied` line sitting directly above the numbers.
3. The mutant harness classified **every mutant UNKNOWN** because its summary-line regex anchored at
   `^` and node:test's ANSI escape sits there. **Caught by the survive-controls, not by me.**
4. The script written to fix (3) printed **`patched`** and changed nothing — a no-op string replace
   reporting success. Caught only because I grepped for the edit instead of believing the message.

**The thing they share is not carelessness about `$?`. It is that in each case the instrument had no
way to say "I could not tell", so it said the thing that looked like a result.** Build the third arm
first — and then **verify the verification landed**, because (4) was the repair for (3) failing in
exactly (3)'s way.

**The controls are why this is legible.** My mutant run reports **12 mutants, 12 caught; 2 controls
SURVIVED; 1 control SKIPPED; source restored byte-for-byte**. When the classifier was broken, the
run came back **VOID — 14 did not behave** — instead of a clean 12-of-12. **A mutant harness without
a mutant that must survive cannot detect its own failure**, and mine detected its own failure
tonight.

*(I first wrote "13 caught" in this section. The M-series is M1–M12 and all twelve are caught; the
13th number came from counting the re-classified boundary mutant twice. Corrected here rather than
left to a reader to reconcile against the table.)*

**One mutant genuinely survived and I closed it rather than excusing it:** `fits: worstMs <= bound`
→ `<` survived, because **no test sat exactly on the boundary** — and the state mirror's entire
verdict is a boundary call. Added a test at exactly `maxPollMs`; the mutant is now caught. **39
tests, not 38, because a survivor found a real hole.**

---

## 6b · THE ROOM'S OWN INSTRUMENT CAUGHT MY HOOK, AND IT WAS RIGHT

**`install-only.test.js` went RED on my file** — a number nobody chose, returned by an instrument
built by another seat, about work I had just finished calling done. It is the uncurated-measurement
case exactly, and the reason it is in this hand-back rather than quietly fixed:

    1 UNDECLARED  installable, on no manifest entry AND on no unmanaged declaration
                  consonance\hooks\live-mirror-stop.js

**A new hook must be installed or DECLARED UNMANAGED with a reason. Mine was neither — nobody had
ruled.** Two things came out of it:

1. **I declared it unmanaged in `dev/shell/install.ps1`** with the reason, which is the ruling I had
   already made inside the file (default off, keeper's call) finally written where the installer can
   read it. **The ruling was prose and the installer is data** — that is this test's own founding
   lesson, applied to me. `install-only.test.js` is now **11 passed, 0 failed**.
2. **The other two unmanaged hooks are unmanaged partly because they carry no `CONSONANCE_DREAM`
   guard. MINE DIDN'T EITHER, AND IT IS THE WORST MEMBER OF THAT CLASS** — a dream runs unattended,
   and this hook reaches a network remote and moves the lease that decides which machine may drive a
   seat. **A sleeping machine would have quietly held seats against a waking one.** Guard added.

**I touched `install.ps1`, which was not in my ownership list.** The edit is one additive entry that
states a fact about my own file, and leaving the suite red for another seat was the worse option —
but it is a shared carrier and I am naming the reach rather than burying it.

**Two other suite failures are NOT mine and I did not touch them:** `portable-paths.test.js` is red
on a single site in `consonance/tools/chain-status.test.js:1095` (A's file this lap — my new files
use the env-override-then-default shape and flag nothing), and `state-sync.test.js` is red (24
passed, 9 failed) while A is actively running mutants against its own source. **Rebaselining another
seat's site would be me ruling on their work**, so both are reported and left.

---

## 7 · WHAT I DID NOT VERIFY — read this before relying on any of it

- **The state mirror has never run.** `state.enabled` is **OFF by default**, so not one state push
  has happened through this hook. The lease half is proved; the state half is wired and unexercised.
- **The default-off is a decision, not an unfinished edge.** A's gate landed, so the technical reason
  to keep it shut is gone. What remains: flipping it makes **every seat push to a real remote after
  every turn, unattended** — and this room does not let a seat start publishing outward on its own
  (`journal/2026-07-28.md:189`: committing is not publishing). **And it would not deliver what it is
  for, because the round trip does not meet the bound.** `CONSONANCE_MIRROR_STATE=1` is the flip;
  **it is the keeper's, and I am flagging it rather than taking it.**
- **The hook has never been registered in `settings.json`** and has never fired from a real turn.
  Nothing is wired into the harness. Registering it is a separate move nobody has made.
- **The eviction path has never run against a live pane.** Step 5 above used two clones and a script.
  No actual seat was mid-generation when its lease was taken.
- **The three heartbeat outcomes are separated by matching git's PROSE on stderr** (`stale info`,
  `rejected`, `could not resolve host`). That is a weaker discriminator than I want, and a git
  version that rewords those messages would silently reclassify an eviction as an error. Named
  rather than hidden; it wants an exit-code-plus-`ls-remote` confirmation instead.
- **`turnActive` is threaded but never sourced.** `live-follow.js` passes `null` for it, because
  nothing publishes whether the holder is mid-turn. The forced-take dialog therefore cannot yet say
  *"this will orphan a turn"* truthfully in the live system — the ruling supports it, the input does
  not exist. **This is the gap between §4 as designed and §4 as running.**
- **The `--poll` default (1500 ms) is a choice, not a measurement.** It fits the lease with 700 ms
  to spare; nobody has tuned it against GitHub's rate limits, which I did not look at at all.
- **`state-sync.js --push` is called with no `--seat`.** A's tool pushes the whole TRAVELS set; the
  seat argument I first wrote was invented by me and is not in A's interface. Removed.
- **The measured base was 10 MB + 4.7 MB, not the full 45 MB board.** Delta pushes should be roughly
  size-independent in transferred bytes but not in packing CPU. Unmeasured at the real size.
- **Nothing was committed.** `live-host.js`, `live-host.test.js` modified; `live-follow.js`,
  `live-mirror-stop.js`, `live-mirror-stop.test.js` new and untracked.

---

## 8 · THE FALSIFIERS, REGISTERED

**F1 (the plan's, unchanged):** two hosts driving one seat in the same minute, or a board row on one
machine and not the other after a completed sync.

**F2 (the mechanism's):** two drivers of one seat with **no `forced` row and no `enforced: false`**
— the guard failed *silently*, which is the failure this room keeps finding under rocks.

**F3 (new, and it is this hand-back's own):** **if the state round trip is re-measured over SSH with
multiplexing and comes in under 5 s, my refusal in §0 was over-general** — it would be a refusal of
*HTTPS*, not of *a git remote*, and I did not distinguish them because I could not test it. That is
checkable the moment a key exists on this machine, and it is the first thing to check before anyone
builds a peer channel on the strength of §0.

**F4:** if `turnActive` is never sourced, §4's forced-take dialog is prose. The ruling is only as
real as the input that feeds it, and that input does not exist yet.

---

## 9 · WHAT I OWN, AND WHERE IT IS

    consonance/tools/live-host.js            + the seat dimension, the bound, the handoff  (modified)
    consonance/tools/live-host.test.js       + 14 cases -> 39 pass / 0 fail                (modified)
    consonance/tools/live-follow.js          the follower loop  --status --watch --budget  (new)
    consonance/hooks/live-mirror-stop.js     the Stop hook                                 (new)
    consonance/hooks/live-mirror-stop.test.js 8 pass / 0 fail                              (new)
    dev/shell/install.ps1                    ONE additive unmanaged declaration for my hook  (modified,
                                             not in my ownership list -- see 6b)

**Commands that reproduce every figure above:**

    node consonance/tools/live-host.test.js            # 39 pass / 0 fail
    node consonance/hooks/live-mirror-stop.test.js     #  8 pass / 0 fail
    node consonance/tools/live-follow.js --budget      # the bound, re-derived
    node consonance/tools/live-follow.js --status      # who holds which seat, one round trip

`state-sync.js` is A's and I only call it. `main.rs` is C's and is untouched by me. The compaction is
B's. **Nothing committed.**
