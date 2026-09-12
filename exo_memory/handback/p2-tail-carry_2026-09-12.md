# P2 · THE TAIL CARRY — hand-back. The build stands; plan §8 bar (2) does not. D061.

**Pane A, machine D, 2026-09-12 04:10–05:0x. Nothing committed. Nothing carried. `--apply` never ran
outside a fixture.**

    dev/tail-carry.js          the carry
    dev/tail-carry.test.js     44 tests
    dev/tail-carry.mutants.js  28 mutants, 28 killed, 0 survived, 0 not-applied

---

## 0 · §7, ANSWERED FIRST, BECAUSE ONE HALF OF IT IS A DEFECT IN THE SPEC

**The tail does not need the lease to be SAFE. It needs the lease to stop being LOSSY. Build it now
— but plan §8 bar (2), implemented as written, is not safe, and that is the finding this packet
bought.**

### The hole

> §8 bar (2): *"If the destination's prefix hash at the ledger's offset differs, the two copies
> DIVERGED: refuse the tail."*

**A content check at the offset cannot see the case it most needs to see.** If the far machine
appended its own turns, the first `offset` bytes are still byte-identical — its growth is entirely
*after* the offset. The hash matches. The tail is appended **on top of the far machine's own
continuation**, and the result is one file holding two different futures of the same conversation.
Every record parses. Nothing reports an error. A seat wakes into a history that never happened.

The fix is arithmetic, not a lease: **the import requires `dest.size === agreed.offset`**, exact
equality, with the hash as the content check beside it. The export keeps the looser rule on purpose
— a machine that has moved is precisely the one with something to carry.

**It is demonstrated, not argued.** `tail-carry.test.js` builds the forked state, asserts that the
check the plan specifies *passes* on it, and requires this tool to refuse:

    THE SPEC HOLE: plan §8 bar (2)'s content check PASSES on a forked destination, and this tool refuses it

and the first mutant in `tail-carry.mutants.js` is the spec itself — `size > pend.offset` deleted,
i.e. the gate weakened back to a lower bound. It is killed. If it ever survives, this file's central
claim is unmeasured.

### And the fork is ordinary, not rare

**Opening Consonance appends to every resumed seat's transcript before anyone types anything.**
Measured tonight: pane B was placed at **1,319,397 B**, the 04:05 launch resumed it, and it now
holds **1,319,664 B** — **+267 B**, a `bridge-session` record and a cost record, with B having taken
no turn. Seven seats, so **one launch on the far machine moves all seven files.**

So the operating rule, which is the keeper's to accept and not mine to bury in a comment:

> **Between any two carries, Consonance may be open on exactly one machine, and the carry runs BOTH
> ways.** Export from the machine that ran; import on the machine that did not.

The scheduled dream cycle does **not** break it: it runs `claude -p` under its own session id and
skips while a Consonance pane is live (`dev/dream/dream_cycle.ps1`), so it writes strangers into a
project directory, never a seat's file. Checked rather than assumed.

### What the lease would and would not fix — a requirement for P3, not a blocker for P2

Without the lease the carry is **safe** (every fork is refused by name, nothing is merged, nothing
is overwritten) and **lossy** (when both machines have written, one side's turns must be retired —
no carry can merge two branches of a conversation). With it, the fork does not happen.

**But the lease as specified may not close this, and P3 should be told before it is wired.**
`live-host.js` L052 §1–3 leases a seat to whoever is *driving* it — "the follower's pane is
read-only until it holds the lease", and a seat is taken at a turn boundary. **The +267 bytes are
not a turn.** They are what the vendor writes when the app resumes a session at launch. If the
follower's Consonance still spawns and `--resume`s a seat it does not hold, the fork happens at
launch and the lease never sees it.

> **The requirement, stated so it can be checked:** on the follower, a seat whose lease it does not
> hold must not be `--resume`d at all — not spawned read-only, not spawned at all — or the carry
> will keep refusing every seat after every launch, correctly, and the lease will have bought
> nothing this half of the problem needs.

**So: P2 does not wait for P3, and the plan's order stands.** What changes is bar (2), tonight, and
what P3 owes.

---

## 1 · THE THREE THINGS §3 ASKED FOR

### (a) What travels — **the live file. Orphans and strangers stay.** My call, explicitly

Four reasons, and the first is the one that decides it:

1. **An orphan is already a retirement.** The app renamed it precisely so that nothing would resume
   it. Carrying a retirement to the far machine does not improve a seat's continuity; it puts a
   second copy of a dead branch on a second disk.
2. **It does not fit the identity model, and forcing it would invent a second one.** The ledger keys
   on `sid + sha256 of the first timestamped record`. An orphan shares the sid and has a *different*
   key by construction — that is what makes the key correct. Carrying it needs a second key space,
   and a second unversioned thing to keep in sync between two machines is the failure this whole
   packet is about.
3. **Strangers are not seats.** C's slug holds two 525 KB scratch sessions from its own 09-11 lab
   work; the main slug holds **2,390 files**, the librarian's 765, the third place's 251. A
   directory-keyed carry moves all of that. *The unit is the sid, never the directory* — P-PLACE's
   lesson, pointed at a USB stick.
4. **Nothing is lost.** Orphans stay where they are, on the machine that made them, under
   retire-never-delete. If one is ever wanted on the far machine it is a one-off hand copy — and it
   should be, because choosing which dead branch matters is a judgement, not a sync rule.

*Registered so the call can be shown wrong:* if a seat is ever found needing an orphan that exists
only on the other machine, this rule was wrong and orphans should travel under their own key.

### (b) The far end — read, never assumed

Every far-end fact is read at run time and refused on surprise, by name: a destination that is
missing while the tail is a delta (*"a tail cannot rebuild it"*); a destination holding a **different
conversation** under the same sid (refused, and it names the flag — `--retire-far <sid>`, per seat,
never wholesale); a destination **behind** the agreed state; a ledger that **disagrees with itself**;
a tail the stick damaged. **The import rehearsal is runnable on L and writes nothing**, which is what
§3(b) asked for: the far machine's own state is what decides, and it is read there.

**What I expect L to look like, stated as a prediction rather than a finding, because I cannot see
it.** L migrated at 00:27:29 on 09-11 and its three fixed seats were *moved* to L's attic — that is
what the stick carries (`HANDOFF.md`, and `MANIFEST.tsv`'s source column reads `C:\Users\zackn\…`,
so even the home slug differs between the machines). A seat whose file was moved comes up fresh. So
I expect: **fixed seats absent on L → FULL carry; panes holding their own post-migration lives →
REFUSED, needing `--retire-far` per seat.** The import rehearsal on L will say, and it costs nothing
to ask it.

### (c) Bar (4) is satisfied, said out loud rather than carried silently

> §8 bar (4): *"Measured on fixed seats only. Committee panes never resume, so their files are not
> append-only across a restart until P1b lands."*

**P1b landed (`d74424f`), the placement landed, and the 04:05 launch resumed all four panes.** The
bar is met and the tool carries all seven seats — three fixed, four panes — from one roster.

---

## 2 · THE MEASUREMENTS, each with the command that re-derives it

### The design's ground claim, re-derived at 3.2 days instead of 21 hours

The plan rests on *a transcript is append-only*, measured by the librarian at a 21-hour interval. I
re-took it against the same stick copies at a **3.2-day** interval, with this tool's own `hashRange`:

| seat | stick copy (09-11 00:27) | live now | delta | prefix of the live file at the stick's length |
|---|---|---|---|---|
| main | 253,617,562 | 260,211,056 | 6,593,494 (6.29 MB) | **IDENTICAL** |
| librarian | 37,161,238 | 42,919,191 | 5,757,953 (5.49 MB) | **IDENTICAL** |
| third place | 32,761,779 | 36,513,712 | 3,751,933 (3.58 MB) | **IDENTICAL** |

**3 of 3, and the ratio is 21.1× — 15.36 MB of tail against 323.91 MB of file.** The claim holds at
a longer baseline than the one it was accepted on, which is the only interesting way to re-take a
measurement.

### The first carry is NOT a tail, and that is worth knowing before the stick is plugged in

Real rehearsal, this machine, the real stick:

    node dev/tail-carry.js --stick D:\consonance-L-20260911 --export

    FULL  main         260,211,056 B (248.16 MB)      FULL  pane A   2,498,499 B
    FULL  librarian     42,919,191 B ( 40.93 MB)      FULL  pane B   1,319,664 B
    FULL  third place   36,513,712 B ( 34.82 MB)      FULL  pane C   1,480,718 B
                                                      FULL  pane E   2,354,905 B
    347,297,745 bytes (331.21 MB) would go onto the stick · 0 seat(s) refused

**There is no agreed state yet, so every seat is a full carry: 331.21 MB.** The tail pays from the
*second* carry onward, and the 21.1× above is what it pays. Anyone budgeting the first trip on the
strength of "~2 MB a seat" would be wrong by two orders of magnitude.

### The per-carry verification cost

    full-file sha256 of 260,211,056 B (248.2 MB): 308 ms (806 MB/s)

Bar (3) wants a full-file hash at each end after every tail. On the largest seat that is **~0.3 s**,
paid twice. The bar is cheap and should stay.

### The rehearsal writes nothing — on the real disk, not only in a fixture

    22 paths watched (the whole stick + 5 idle seat files) · 0 changed

after a real `--export` **and** a real `--import` rehearsal. A's, E's and the librarian's own files
are excluded **and named**: they are taking turns right now and move with or without this command.

### The suite

    node dev/tail-carry.test.js             44 passed, 0 failed
    node dev/tail-carry.mutants.js          28 killed, 0 survived, 28 total
    node consonance/tools/js-suite.js       86 green · 6 failed · 0 crashed · 0 silent
                                            · 1 canary · 0 sang · 0 not-run  (of 93)

**What moved:** 92 files → 93, and 85 green → 86. The one new file is mine and it is green. **The
six reds are unchanged and none is mine** — controlled earlier tonight by pulling my files out of
the tree and re-running; all six still exit 1 (`actors.evidence`, `carrier-drift`, `forget-rate`,
`gen-consumer`, `portable-paths`, `userprompt_pulse`). They still have no owner.

---

## 3 · WHAT THE TESTS AND THE MUTANTS FOUND THAT READING DID NOT

**The tripwire fired before the first mutation ran.** One of my replacement strings was a substring
of the source, so `original.includes(to)` read as "the source already carries a mutation" and the run
refused to start. Working as designed, and the reason the later counts are worth quoting.

**Run one: 25 mutants, 20 killed, 5 SURVIVED.** All five were real, and none was a near-miss:

- the whole read-back verification of the rejoined file (`ok = true` changed nothing);
- the tail's length never checked against the span the ledger claims;
- the export never checking the key against the agreed conversation;
- a half-read line able to become a conversation's identity;
- a source that grew *during* the read written as though it had not.

Five tests, each pointed at the state that makes the guard fire — a ledger whose `fullSha` is wrong
while the tail is intact, a `toOffset` off by one, a source replaced by a longer different
conversation, a scan window ending exactly on a record boundary, and a plan whose file grew between
the stat and the copy. **Run two: 28 mutants, 28 killed, 0 survived.**

**Two reds during the build were bugs, not test bugs.**

1. *A run that carries nothing still wrote state onto the stick* — a refused export created
   `consonance-tails/` and an empty ledger. A report that leaves state behind is a state change
   dressed as a reading. Now: carries nothing, writes nothing, not even the directory.
2. **A latent mismatch nothing would have caught in normal use.** The import hashed the destination
   at `pending.offset` and compared it against a hash recorded at `agreed.offset`. Those are equal in
   every run this tool produces — so the comparison was *meaningless whenever they were not*, and a
   hand-edited or half-written ledger is exactly when you most need it. Now refused by name: *"the
   ledger disagrees with itself."* Found by a test that built the mismatch; I would not have seen it
   by reading.

**And one gate was missing entirely until the rehearsal ran for real.** Seven seats came back clean
with Consonance open — correct for a READ, and a disaster for a WRITE. **The import now refuses while
the app is running**; the export does not, because it only reads and its one hazard (the file growing
mid-copy) is caught by re-stating the source afterwards. The predicate is
`place-conversations.js`'s `consonanceRunning`, reused rather than copied. *The rehearsal found it;
reasoning about the code had not.*

**Reuse, honestly bounded.** `stableRead` is used whole for the ledger, which is small. For a 260 MB
transcript it is the wrong instrument — it reads the whole file twice into Buffers — so what is
reused for the big files is its **rule**: the mtime quiescence window and the future-mtime refusal,
with `SETTLE_MS` and `STABLE_TRIES` **imported from `state-sync.js` and never retyped**. A test
asserts that identity and fails if a constant is inlined. Bar (6) asked for reuse and not new work;
this is the extent of it, stated rather than glossed. The slug rule is not re-implemented either —
`encodeCwd` comes from `place-conversations.js`, whose own test runs main.rs's vectors against it.

---

## 4 · WHAT I DID NOT VERIFY

- **Nothing ran against L. Nothing was written to the stick.** The stick was mounted and *read*;
  every write path was exercised against fixtures only. `--apply` has never run outside a temp
  directory.
- **The 331 MB first carry has never been executed**, so the wall-clock of writing it to a USB stick
  is unmeasured, and so is whether the stick has room (it holds 308.6 MB of the 09-11 staging
  already, which this tool does not touch — the tails live in `consonance-tails/`, a separate
  subtree).
- **The repair path has only ever repaired fixture-sized files.** Truncate-and-re-append on a 260 MB
  transcript is the same two syscalls, which is an argument and not a measurement.
- **My prediction about L's state (§1b) is a prediction.** It follows from `HANDOFF.md` and the
  migration, not from anything I read on that machine.
- **The `--retire-far` path retires the far machine's own conversation.** It is per-seat, must be
  named on the command line, keeps the file under a stamped name, and is refused outright when the
  tail is a delta — but it is still the one operation here that takes a seat's continuation away, and
  it has never been run outside a fixture.
- **I did not touch `main.rs`** (E's this lap), the 09-06 lap-row set, or `place-conversations.js`
  beyond requiring it. **I did not commit.**
- **The six red files in js-suite are still nobody's.** I did not fix them and they are not mine.

---

## 5 · FALSIFIERS, REGISTERED

    A carry that reports success while the far end's file differs from the source. Every import
    hashes the rejoined file whole and compares it to the exporter's recorded sha256; a mismatch
    fails the run and does not advance the agreed state.

    A seat whose first timestamp on the far machine is a launch minute. That is the conversation
    having been replaced rather than continued, and it is what `--retire-far` does deliberately and
    nothing else here may do at all.

    If a fork is ever found to have been appended rather than refused, the exact-equality gate is
    insufficient and the answer is the lease, not a better message.

    And this hand-back's §0 is wrong if P3 lands, the follower still resumes seats it does not hold,
    and the carry stops refusing anyway — that would mean the +267 launch bytes are not what I
    measured them to be.
