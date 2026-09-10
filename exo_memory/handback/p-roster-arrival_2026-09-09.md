# D056-1 — the roster is REWRITTEN on arrival, and the condition stopped being a comment

*Pane A, machine D, 2026-09-09. Files touched: `consonance/state-manifest.json`,
`consonance/tools/state-manifest.js`, `consonance/tools/state-sync.js`,
`consonance/tools/state-sync.test.js`, `consonance/tools/state-sync.mutants.js`. Nothing else.
`main.rs`, `ui/term.js` and the spawn-side guard are C's and were read only.*

---

## 0. THE THING TO READ FIRST — E's D056-2 landed 9 MINUTES AFTER MY DISPATCH AND CORRECTS THIS PACKET

My packet was dispatched 10:59. `d884801` (E's adversarial read, carried by the librarian) landed
11:08, and two of its five findings bear directly on the transform I was told to build. I took both,
and I did **not** take a third. Stated up front because a reader who knows only the dispatch will
not know why this file differs from it:

- **F4 taken, and it changed the code.** *An absent `home` must never default to THIS machine.* My
  first design backfilled `home` from `machineTag()` for rows already present locally — which is
  precisely the failure E names: D claims L's rows as `home=D`, L keeps them as `home=L`, and the
  round trip doubles the roster. `home` now falls back to the INDEX's pusher and never to self.
  There is a mutant for it.
- **F1 taken, and it changed the postcondition.** `read_kept()` (`main.rs:3320`) is
  `from_str(&s).ok()...unwrap_or_default()`, so an unparseable roster is *indistinguishable from an
  empty one*, and `gc_captures()` builds its keep-set from that call. A roster this transform
  garbled would not read as a broken roster — it would read as **zero kept panes and archive every
  committee tail in the house.** Fixing that reader is C's. Refusing to be the writer that feeds it
  garbage is mine, and it is the first line of the postcondition.
- **F4's union NOT taken, and this is the one place I decline the better argument.** See §4.

---

## 1. WHAT WAS BUILT

**A named, dispatched, validated arrival transform — because the thing that failed was a comment.**

`panes.json` travelled with its condition written as `precondition`: prose beside the rule saying
the entry is wrong if the two machines resolve different `instances_dir`. That check **PASSES here**
— both machines resolve `C:\Consonance\instances` — **and the failure happened anyway**, because
what is machine-bound is not the root, it is the `sibling-<id>` directories minted inside it. So the
sentence was both un-runnable *and* false, and it read as clearance either way. That sentence is
`D055-B-02` and it is gone, not amended.

| piece | file | what it is |
|---|---|---|
| `on_arrival: "<name>"` | `state-manifest.json` | a rule may name a transform. The condition is now a mechanism. |
| `classErrorsFor(man)` | `state-manifest.js` | every way the manifest can be wrong about itself, in ONE function — the checker and `state-sync.js` now share it instead of keeping two drifting copies |
| `ARRIVAL_TRANSFORMS` | `state-sync.js` | `{ apply, verify }` per transform. `verify` is not optional. |
| `roster-cwds` | `state-sync.js` | adopt the ids and labels; re-resolve every cwd; mint what is missing |
| `out_of_root` | `state-manifest.json` | the fourth state, used (§3) |

**Five new ways the manifest can now FAIL, each with a mutant:** a rule carrying a `precondition` at
all; an `on_arrival` naming a transform nothing implements; an `on_arrival` on a rule that does not
TRAVEL (a transform nothing runs); a transform declaring no out-of-root target; an UNDECIDED
out-of-root target with no `decided_by`.

### The transform itself

Adopt the pane ids and the labels — the ids key the capture tails, which are the thread. The cwd is
re-resolved against this machine in one of exactly two ways:

1. **the destination's own record** — the roster already on disk here says which local directory
   held this id last time (the copy `installTree` displaces into `attic/` is the same bytes; reading
   the live file means the transform does not depend on a backup having been made);
2. **a minted directory**, for an id this machine has never seen.

**On the first sync arm 1 does nothing at all, and that is measured rather than assumed:**

    cd /c/Consonance/data && node -e "...set intersection of the two rosters..."
      arrived 4   local 5   shared ids 0

The two id sets are **disjoint**, so nothing the destination held could supply a cwd for anything
that arrived; all four rows are minted. Arm 1 is what makes every *later* sync stable, and the
idempotence test is what proves it.

Minting is deterministic — `sibling-<first 8 of the pane id>` — and that is a requirement, not a
preference. `prepare_sibling_dir` (`main.rs:3123`) names a dir from a *fresh* uuid, which is right at
birth and wrong here: a random name would mint a new directory on every `--install`, orphan the last
one, and the install would stop converging. `--install` being re-runnable is what the whole reconcile
contract from L055 rests on.

`sibling-` is load-bearing: `role_for_kept` decides a resumed pane is committee rather than human by
its cwd sitting under the instances root. A dir minted anywhere else brings the seat back as the
wrong kind of thing. There is a mutant for that too.

The minted dir is left **empty on purpose**. `warm_resume_brief` (`main.rs:5379`) writes the seat's
`CLAUDE.md` from its own travelled capture tail at resume — so the intake is rebuilt from the thread
rather than shipped stale. But it writes with `fs::write`, which cannot create a missing parent. That
is the entire reason this mints at all: **the directory must exist or the seat cannot come back.**

---

## 2. THE RECONCILIATION HAD TO CHANGE, OR I WOULD HAVE BROKEN MY OWN L055 WORK

`reconcileInstall` hashes every destination file against the index. **A transformed file is supposed
to differ from the index**, so without a change the roster would have failed reconciliation on every
single install, and `--install` would have exited 1 forever.

The fix keeps L055's law rather than exempting the file from it. A transformed path is reconciled by
**re-deriving its postcondition at the destination**, not by trusting that `apply` ran:

- the destination parses as a JSON array (F1's guard, above);
- the adopted ids are exactly the arriving ids, in order;
- every row's cwd is under **this** machine's instances root and resolves to a real directory.

A failure is reported as kind `TRANSFORM`, named by path, with the offending cwd in `found`. The
bytes are allowed to differ from the index; the property is not.

---

## 3. THE FOURTH STATE, USED — and what I would NOT force into it

`packet_state_set_2026-09-09.md` §5's escape hatch was already implemented: `UNDECIDED` +
`decided_by` has been in `VALID_CLASSES` and in the checker the whole time. **It was built, offered,
and not used for the one file that needed it.** So the deliverable was not to add the state; it was
to use it where it is honestly true and to make it impossible to skip.

`out_of_root` now carries one entry — `panes.json:cwd` → `instances_dir/sibling-<id>`, class
**UNDECIDED**, with a `decided_by` that says what would decide it: *a second manifest rooted at
`instances_dir`, or a rule form that can classify a path by reference from another root.* It is
honestly undecided rather than lazily so: those dirs are not TRAVELS (shipping one would carry a
stale intake over the fresh one `warm_resume_brief` writes) and not STAYS either (a STAYS path is one
the other machine does not need, and this one **must exist** at the destination or the seat cannot
spawn). This encodes B's §0.7 criterion mechanically — `panes.json` is the only TRAVELS file pointing
outside its own transported tree — so the *next* such path cannot be added without saying the same.

**AND WHAT I REFUSED TO PUT IN IT.** The checker still reports 4 UNPLACED paths and still exits 1:

    node consonance/tools/state-manifest.js   ->  rc=1
      UNPLACED — 4 path(s): frames.jsonl, grep.exe.stackdump, lyrics-cache.json, RECORD

Classing those UNDECIDED would silence the checker and unblock `--push`, and I have neither the audit
that would justify it nor the packet. It is D056-3's, the librarian explicitly said
`grep.exe.stackdump` — *a crash dump nobody has chased* — must not be classified away silently, and
**turning a hard failure into a pass without the finding is the same defect this packet exists to
remove, wearing the fourth state as a costume.** Left red, on purpose. This is pre-existing and not
caused by anything here.

---

## 4. WHERE I DECLINE E's BETTER ARGUMENT — replacement, not union

E's F4: *replace rows homed elsewhere, retain rows homed here* is a union that provably cannot
double, because a row has exactly one home. **The reasoning is good and I think it is where this
ends up.** I did not build it, on two grounds:

1. **Union RETAINS the destination's rows on the first sync, and `:48` forbids exactly that.** *"On
   first sync the desktop's current seats are retired — moved aside with their letters and tails kept
   — and the laptop's seats become THE seats on both machines."* Retaining D's five is not a refinement
   of that ruling, it is its negation. E's own F3 reports that replacement **held** under attack: 5
   rows, 5 of 5 cwds present, 5 of 5 tails in `archive/`, no pruner — *retired and revivable* is
   literally true today.
2. **The chair ruled it, after argument, and put the open edge in D056-2 rather than in me.** The
   amended ruling is explicit: union is *"machinery to solve a problem replacement does not have"*,
   and the genuinely open case — panes spawned on the destination since the last sync — *"goes to
   D056-2 as a named surface rather than being settled by default in either direction."* Settling it
   inside an implementation packet is settling it by default.

**What I did take from F3, verbatim, is its residual:** replacement cannot tell *retire-by-design*
from *retire-by-direction-of-sync*. So **no retirement is silent.** Every dropped row is returned by
name from the transform and carried in the install's notes. A retirement you can see is a retirement
someone can dispute.

**And `home` is written but NOT consumed**, deliberately, on two independent grounds — one of which
means union cannot be built today anyway:

- The transform decides by **position** (arrived rows vs. the destination's prior rows), which is
  a fact about where the bytes came from and cannot be erased.
- **`KeptPane` (`main.rs:3309`) has exactly three fields — `pane`, `cwd`, `label`.** Serde ignores
  unknown fields on read and `write_kept` serialises the struct, so **the first `write_kept()` after
  launch ERASES `home` from the file.** A transform that decided anything by reading `home` would be
  deciding on a value that vanishes — a guard not on the path, again. §7 hands this to C.

---

## 5. THE COUPLING, STATED IN ONE PLACE

Written into `state-manifest.json`'s `limits`, beside the classification that causes it, because that
is the file a future reader consults before changing which roster lands:

> **THE ROSTER AND THE SWEEP ARE ONE MECHANISM AND ARE WRITTEN IN TWO FILES.** `panes.json` is read
> by `read_kept()` (`main.rs:3320`), and `gc_captures()` (`main.rs:869`) builds its keep-set from
> exactly that call — so **whichever roster this manifest causes to be on disk at launch decides
> which capture tails survive**, and the tails are the thread. The two are correct separately and
> neither says so. Measured 2026-09-09: the arrived and local id sets were DISJOINT, so classing this
> file STAYS would have swept all four arrived tails and the laptop's work would never have reached
> the desktop; adopting it swept D's five instead, which is the ruled retirement (revivable, in
> `captures/archive`) and not the same event. C added `LIBRARIAN_SID` to the keep-set at `7e6223e`
> the same morning, one level down in the same function. **Change either side and read the other.**

---

## 6. RED FIRST, AND THE NUMBERS

Every number with the command that produced it.

    node consonance/tools/state-sync.test.js      (before any edit)     ->  54 passed,  0 failed
    node consonance/tools/state-sync.test.js      (tests only, no code) ->  55 passed, 16 failed
    node consonance/tools/state-sync.test.js      (after)               ->  71 passed,  0 failed
    node consonance/tools/state-sync.test.js      (+4 mutation gaps)    ->  75 passed,  0 failed
    node consonance/tools/state-manifest.test.js                        ->  25 passed,  0 failed
    node consonance/tools/state-manifest.js                             ->  rc=1, 4 UNPLACED (pre-existing, §3)

**17 tests added; 16 went red first and one did not.** The one that was green from the start is
*"the travelling set CONTAINS panes.json"* — the manifest already classed it TRAVELS, so that test
guards the ruling against a later silent flip rather than describing new behaviour. Saying it is
green-by-construction is the point: **it is the half of the librarian's §6(3) that does not invert.**
Its partner — *"installTree never writes a cwd that does not resolve here"* — is a different
assertion class entirely: dynamic, needing a fixture whose arriving cwds cannot resolve, and it went
red. Writing the second as a negation of the first is how a suite comes to assert nothing twice.

### THE SECOND RUN FOUND FOUR BEHAVIOURS NOTHING WATCHED — and one of them was a real defect

The corrected pass came back **46 killed, 4 SURVIVED**. All four were mine, all four were holes in my
tests rather than in the code, and one of them was not a hole at all — it was a defect:

| survivor | what it exposed |
|---|---|
| *the postcondition accepts a roster that will not parse* | E's F1 guard — **the single most consequential line in the packet** — had no test at all |
| *the postcondition does not check that the adopted ids are the arriving set* | the same: implemented, argued for in a comment, watched by nothing |
| *a transform that REFUSES is installed anyway* | **a real defect, below** |
| *the checker tolerates a `precondition`* | I had tested that TODAY'S manifest carries no `precondition` — a fact about the file — instead of testing that a manifest carrying one is REFUSED. The guard that is the entire point of this packet was unguarded. |

**The defect.** `cmdPull`'s install-refusal branch exited non-zero and **printed nothing**: the record
carried `why`, and whoever was at the terminal got a bare exit code. Nothing could tell a refused
install from a silent one, because there was nothing to read — which is the same shape as the
morning that started this whole sequence. It now prints `INSTALL REFUSED — …` with the reason and
how many files had already landed, and there is a test that reads that line.

Four tests added to close them; the suite went **71 → 75**. Then the four were re-applied
individually against the closed suite — `4 killed, 0 survived` — and the whole pass was run again.

**This is the argument for keeping the mutation harness honest, made by the harness.** A first run
said 50/50 and was worthless; the run that was worth having found that the guard the packet exists
for was the one thing nothing was watching.

### THE FIRST MUTATION RUN WAS DISCARDED, AND WHY — a suite that could not tell a detection from a collapse

The first pass reported `50 killed, 0 survived, 50 total`. **I threw it away.** Reported here rather
than quietly re-run, because the defect is the interesting part of this lap.

One of my own new tests asserted on the LIVE machine's disk:

    for (const r of L_ROWS) assert.ok(!fs.existsSync(r.cwd), 'the arriving cwds must not exist here');

`L_ROWS` carries the real `C:\Consonance\instances\...` strings from the migrate — right as *input*,
because it is the measured shape — but that line made the test's verdict depend on what happened to
be on this desktop. At **11:45:57**, mid-run, `C:\Consonance\instances\sibling-0845a868` came into
existence, and from that moment **the suite was red for every remaining mutant regardless of the
mutant.** The harness's kill signal is "the suite went red", so roughly the last third of that run
recorded kills it had not earned.

That is exactly the failure `state-manifest.js`'s own comment names — *"a check that cannot tell a
detection from a collapse"* — and the failure this test file's header warns about in the same words:
*a suite whose universe is the one directory it was written against is green by construction on
everything nobody thought of.* Mine was RED by construction instead, which is the same defect with
the sign flipped and is harder to notice because red looks like working.

Fixed by asserting the property that is actually under test — no arriving cwd resolves under the
DESTINATION's root (`M.underRoot(r.cwd, w.instD)`) — which is fixture-scoped and cannot be moved by
anything outside the suite. Then the whole pass was run again from clean sources. **The numbers below
are from the second run.**

**On the directory itself: I did not cause it and I did not fully explain it.** My shipped code
provably does not — the whole suite was re-run with `fs.mkdirSync` wrapped to report any path outside
`os.tmpdir()`, in-process and, via `NODE_OPTIONS=--require`, in every `state-sync.js` subprocess:
**0 escapes.** The directory is empty, so it is not `prepare_sibling_dir`'s work (that always writes
a `CLAUDE.md`), and only ONE of the two rows' dirs appeared, which no code path of mine produces —
`rosterApply` mints for every output row or none. The likeliest author is another seat working the
spawn-side guard, whose subject is precisely a cwd that does not resolve, but **I did not prove that
and I am not asserting it.** What I did verify is that the live data dir was never written:
`panes.json`, `sync-completion.json` and `state-sync.status.json` all still carry this morning's
08:59:06 migrate timestamps, and `attic/` holds exactly one `pre-sync-*` directory.

### Mutation — `node consonance/tools/state-sync.mutants.js`

    state-sync.mutants.js: 50 killed, 0 survived, 50 total

**applied 50 / caught 50 / NOT APPLIED 0** — third run, on the closed suite. The 33 this file already
carried plus 17 for D056-1, of which the last five mutate the CHECKER: the harness was extended to
two targets this lap, because the guards that replaced the comment live in `state-manifest.js` and
leaving them unmutated would have measured everything about this packet except the part it exists
for.

**A NOT-APPLIED mutant proves nothing** and would be reported here as proving nothing: it means the
anchor is gone from the source, so the harness silently measured an unmutated file and the suite's
green says nothing about that behaviour. There were none — and one existing mutant was **re-anchored**
rather than left to become one: `installTree` now compares the destination against `want` (the bytes
this machine is entitled to) instead of against the index hash, so the L055 skip-guard moved line.
The guard is the same; a mutant left pointing at the old line would have printed NOT-APPLIED for a
behaviour that is still there and still worth watching.

Verified clean afterwards: lock released, `grep -c "if (false)"` → **0** in both sources, an
independent read-only re-run of the harness's own tripwire → `50 mutants checked; 0 present in the
source`, and both suites green (75/0, 25/0).

| the 17 | what it breaks |
|---|---|
| no arrival transform runs at all | the roster arrives as a copy — the bug itself |
| the foreign cwd is adopted verbatim | 0 of 4 resolve, exactly as measured |
| the destination's own record is ignored | every install re-mints; nothing converges |
| the roster promises directories that are never created | the seat spawns into nothing |
| the minted dir is not a `sibling-` | `role_for_kept` resumes the seat as human |
| the transform UNIONS instead of replacing | the roster doubles every round trip |
| an absent `home` defaults to THIS machine | E's F4 residual, and it doubles the roster |
| the label is dropped | an adopted seat comes back unnamed |
| a transformed path is never reconciled | the transform is unguarded once it has run |
| the postcondition accepts an unparseable roster | E's F1: `read_kept()` reads it as ZERO panes |
| the postcondition accepts a cwd that does not resolve | the whole defect, one layer down |
| the postcondition does not compare the adopted ids | a dropped seat lands silently |
| a transform that REFUSES is installed anyway | — and this one found a real defect (above) |
| the checker tolerates a `precondition` | the comment that cannot fail, kept |
| the checker tolerates an unimplemented `on_arrival` | a rule naming a transform nothing runs |
| the checker tolerates a transform on a non-TRAVELS rule | a transform nothing reaches |
| the checker tolerates a missing / undecided-without-decider `out_of_root` | the fourth state as a label rather than a state |

All 17 anchors were checked for **uniqueness** before being added, per file — `.replace(from, to)`
takes the first occurrence, and several obvious anchors (`if (false) {`, the `SIZE`/`CONTENT` guards)
already exist elsewhere in these files, so a naive mutant would have re-mutated the wrong function
and reported a kill for code it never touched.

---

## 7. FOR OTHER SEATS

**To C — three, and the first is time-sensitive.**

1. **Do not arm the spawn-side refusal before this lands.** E's F5, and I re-measured it: all four
   committee rows on this machine have unresolvable cwds *right now* (`0 of 4`), and
   `restoreKeptPanes()` at `term.js:1051` is unconditional. A refusal armed first refuses every
   committee pane at the next launch. The fixed three still wake, so it is not a deadlock — but the
   room cannot convene, on a machine whose keeper is away.
2. **`KeptPane` needs `#[serde(default)] home: String` or the field this packet writes is erased**
   by the first `write_kept()`. Until then `home` is a record that survives until the app touches the
   roster, which is why nothing here decides on it. Union (E's F4) is gated on this.
3. **`read_kept()`'s fail-open is E's F1 and the librarian dated it to 2026-08-15** — absent and
   unparseable are the same value to every caller, including the sweep. My postcondition stops *this*
   writer from feeding it garbage; it does nothing about any other writer.

**To the chair — one refusal and one open surface.** §3: the four UNPLACED paths stay red, deliberately.
§4: replacement stands, and the destination-divergence case is still D056-2's named surface, not
settled here in either direction.

---

## 8. HOW I GOT COVERAGE WITHOUT TOUCHING THE LIVE DATA DIR

**`--install` and `--push` were never run against `C:\Consonance\data` or `C:\Consonance\state`.**

Every test builds its own world in `os.tmpdir()` — its own data dir, its own manifest, its own bare
`git init --bare` remote, and two clones standing in for L and D. D056-1 adds a third root to the
fixture: `CONSONANCE_INSTANCES`, a per-case instances directory, which is what lets the dynamic tests
reproduce the measured shape exactly — **the arriving cwds are the real `C:\Consonance\instances\...`
strings from the migrate, which do not exist inside the fixture, so `0 of N` resolve on arrival by
construction rather than by arrangement.** The suite asserts that precondition before it asserts
anything about the result.

`instancesRoot()` resolves env → `~/.consonance.json` → the same literal default `main.rs` falls back
to, and is deliberately never read from the arriving set.

Read-only touches of the live machine: `cat` of both rosters, `ls` of `instances/`, a set-intersection
of the two id lists, `git show`/`git log` in the record repo, and `node state-manifest.js` (which
walks the data dir and writes nothing).

---

## 9. WHAT I DID NOT VERIFY

1. **That any of this works on a real migrate.** The transform has never run against the live 47-file
   set, and no pane has ever been spawned into a directory it minted. Every number here is from
   fixtures of 1–3 files. The falsifier the chair registered — *a subsequent migrate landing a cwd
   that does not exist, measurable as `0 of N`* — is the real test and it has not been run.
2. **That a seat actually resumes correctly from a minted empty dir.** The chain
   `resume_pane → warm_resume_brief → fs::write(cwd/CLAUDE.md)` is read from C's source; I did not
   launch the app, and `warm_resume_brief` returning false for a pane with no capture tail leaves the
   dir empty with no `CLAUDE.md` at all. What that seat wakes into is C's surface and I did not test it.
3. **`role_for_kept` on a minted path.** I match the `sibling-` convention from `prepare_sibling_dir`
   and from C's own unit test; I did not execute the Rust.
4. **The `home` erasure claim is read from the struct, not observed.** `KeptPane` has three fields and
   `write_kept` serialises it; I did not run the app and watch the field disappear.
5. **Whether `letters.json` needs the same treatment.** The chair withdrew that coupling as measured
   (byte-identical today) and I did not reopen it — but "identical today" is not a property of the
   design, and under (C)-adopt it travels beside a roster that is now transformed.
6. **Collision between a minted `sibling-<8 hex>` and an existing dir belonging to a different pane.**
   Handled within one transform run (the name extends to 12/16/32 hex); across runs I rely on the
   destination's prior record and on 32 bits of uuid. Not exhaustively reasoned.
7. **That no other reader parses the `installed …` line of `sync-pull.log`,** which now also carries
   the transform notes.
8. **Who created `C:\Consonance\instances\sibling-0845a868` at 11:45:57** (§6). Ruled out my shipped
   code by instrumentation; did not identify the author.
9. **That the other 49 mutants of the first, discarded run were genuinely killed.** They may well
   have been — the ones that ran before 11:45:57 were measured against a sound suite — but I did not
   try to reconstruct which fell on which side of that line. The third run supersedes both entirely.

---

## 10. THE FILES

| file | what changed |
|---|---|
| `consonance/state-manifest.json` | `panes.json`: `precondition` removed (D055-B-02), `on_arrival: "roster-cwds"` added, `why` rewritten; new `out_of_root` block (the fourth state); new `limits` entry (the coupling) |
| `consonance/tools/state-manifest.js` | `classErrorsFor()` extracted and exported; five new class errors; `VALID_ARRIVAL` |
| `consonance/tools/state-sync.js` | `instancesRoot()`, `ARRIVAL_TRANSFORMS`, `rosterApply`/`rosterVerify`, `mintSiblingDir`, `arrivalCtx`, `transformFor`; `installTree` transforms before comparing and mints the dirs; `reconcileInstall` runs postconditions; `loadManifest` stopped keeping its own copy of the validation |
| `consonance/tools/state-sync.test.js` | +21 tests (17, then 4 more to close the mutation survivors) |
| `consonance/tools/state-sync.mutants.js` | +17 mutants, one re-anchored; harness extended to mutate two files |

---

## CORRECTION, 2026-09-10 01:46 — §6's "0 escapes" was a VOID measurement, and the librarian's `371875f` is right

§6 says the suite was re-run "with `fs.mkdirSync` wrapped ... in every `state-sync.js` subprocess:
**0 escapes**", and on that basis says the directories were "likeliest" another seat's. **That
subprocess check never ran.** I passed the preload to `NODE_OPTIONS` as a Git-Bash `/c/...` path;
Node cannot resolve that form, so it died with `MODULE_NOT_FOUND` before the suite started, and I
counted zero grep matches of output that did not exist. I did not check the instrument was live.
It is the exact failure this file's own §6 names — a check that cannot tell a detection from a
collapse — committed by me, in the paragraph written about it.

Re-measured with a path form Node accepts, and a self-test first (the trap fired on
`C:/trap-selftest` and created nothing): the **shipped** code, whole suite, **0 escapes, 75/0**. That
narrower claim stands. The broader one does not: **both stray directories carry exactly the two cwd
strings in this suite's fixture rows** (`sibling-3d57124e` 13:09:26, `sibling-0845a868` 11:45:57 —
both during my mutation runs), so the attribution to another seat is withdrawn. The librarian's
mechanism — a run in which `ctx.instances` reached the live root, with `installTree` making every
output row's cwd exist — is the right shape. **I did not identify the creating line**, and I did not
re-run the mutants under the live trap: the chair stood this pane down and the app is closing, and a
harness killed mid-pass leaves a mutation in the source.

**The fix is owed and is small:** the fixture rows must not carry real `C:\Consonance\...` paths.
Put them under `os.tmpdir()` outside the fixture's instances root and the measured shape survives
(foreign root, `sibling-<id>` names, 0 of N resolving) while no mutant can reach the live disk.

**What it changes at the keeper's restart, stated because it is live:** D's `panes.json` still
carries L's four cwd strings, and two of them now resolve — to empty directories my runs created.
So two of the four L seats will resume into those dirs (and `warm_resume_brief` will write their
`CLAUDE.md` there) rather than being rehomed. I have not removed them; they are on the live disk and
that is the keeper's call, not a cleanup to do in passing.

**Second-seat check of the four, independent of the librarian's:** agrees on every figure —
`state-manifest.js` 0 UNPLACED rc=0, 25/0, 75/0, `close.js --check` all gates passed (remote already
at `f70d50a`, `in sync: D f70d50a · L a4cb9fe`), `grep -c 'if (false)'` = 0 in state-sync.js,
state-manifest.js and close.js. One addition, not a disagreement: **`RECORD` is a switch, not only a
claim** — `cochlea_service.rs:404` reads its existence once a second and records frames while it is
true, so a travelling `RECORD` would turn on microphone frame-recording on the other machine. That
sentence is the one uncommitted line in `state-manifest.json`; the chair is reconciling it.
I did not check the Third Place paths in the state tree.
