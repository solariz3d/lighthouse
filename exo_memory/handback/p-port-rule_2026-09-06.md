# P4 · THE PORT RULE — hand-back

**Pane A, 2026-09-06, L037. Packet `exo_memory/loop/packet_port_rule_2026-09-06.md` (`5a83d4a`);
map `exo_memory/librarian/2026-09-06.md` §"L037 MAP" (`f3c4e93`), read at the file.**

**Landed:** `consonance/src-tauri/brief/BUILDING.md` +176 lines, one appended section —
**THE PORT RULE**. Nothing committed. Nothing else touched.

---

## 0 · READ THIS FIRST — the section reaches no seat until a build

**`BUILDING.md` is a BUNDLE RESOURCE.** It is declared in
`consonance/src-tauri/tauri.conf.json:36` (`"brief/BUILDING.md": "BUILDING.md"`) and served through
`room_brief()` (`main.rs:2818`), which resolves **editable data-dir copy → bundled resource → repo
`brief/` on disk**. `main_intake()` appends it to the Main tab's shell at `main.rs:4534`.

So: **the running 09-02 binary serves the bundled copy, not the file I just edited** — unless this
machine's data dir holds an editable copy that shadows both, which is the tier that wins. Nobody
should read this as live. It is *landed*, and this room's own name for the gap is *landed is not
shipped* — the same class `main.rs:4530-4533` records against this very file, which sat in the
bundle for its first hour while no seat received it.

---

## 1 · WHAT THE SECTION SAYS, in the order the packet asked for it

**The keeper's two verbatim lines are carried in full** — the 00:44 workflow line and the 00:54
push rule — as the section's opening, before any procedure. The librarian's condition (*"P4's
hand-back does not land unless it carries the rule verbatim AND a mechanism"*) is met by that plus
§3 below.

**THE INVARIANT, decidable:**

    A feature is PORTED when BOTH hold:
      1. the MANIFEST carries its files     node consonance/tools/gen-consumer.js --report
      2. THE GATE is green over a freshly generated tree

**Written against the gate's CONTRACT, per §7 of the packet, because E is moving the gate this
lap.** The contract as stated: one command; exit 0 green, non-zero red with a named reason;
generates a tree from current source, scans the OUTPUT, builds the Rust product in it, proves the
app launches. If the command is renamed, the name in the document is updated in the same commit;
the contract does not move.

**THE PUSH RULE** — five steps, 1–4 the seat's, **5 is not**. Re-arm, push, disarm, board row, all
inside the turn the keeper speaks. Not weakened; §3 says why the manual step stays manual.

**THE TRAILER AND ITS FALSIFIER** — `Source-Sha: <40-hex>`, and the command that reads it. §4.

---

## 2 · THE FINDING I DID NOT GO LOOKING FOR — the gate does not exist

**`consonance/tools/gen-consumer.build.test.js` has never existed in this repository.** Not on
disk, and not as an object on any ref:

    git rev-list --all --objects | grep -c gen-consumer.build.test.js   ->  0
    git log --all --oneline -- '*gen-consumer.build.test.js'            ->  (empty)
    node consonance/tools/gen-consumer.build.test.js ; echo $?          ->  MODULE_NOT_FOUND, 1

*(**1,269 commits across 17 refs** — `git log --all --oneline | wc -l`, `git for-each-ref | wc -l`,
both read 2026-09-06 ~01:25. The commit count read 1,268 twelve minutes earlier in this same lap —
another seat committed between my two runs, which is why the figure carries a time and not just a
number. The 83 desktop commits were pulled into this checkout at `d0c1d12` this morning, so the
desktop's committed record is inside that sweep.)*

**Eleven documents cite it**
(`grep -rln 'gen-consumer.build.test' --include=*.md --include=*.js`), and the first of them is
`gen-consumer.js`'s own header: *"Partly closed 2026-08-23 by `gen-consumer.build.test.js`, which
generates a tree and runs cargo check against it."* Tonight's map, tonight's P3 packet, the 09-04
parity ruling and the 09-05 handoff all reason from it — `handoff_librarian_2026-09-05.md:62` plans
to *"move its oracle from `cargo check` to `cargo test --no-fail-fast`"*.

**One pane came within a line of this and missed it.** `p-consumer-reg-attack_2026-09-03.md:125`
quotes that exact header sentence and attacks it — correctly — for what `cargo check` does not
compile. It attacked the *oracle* of a file whose *existence* nobody checked.

**Class:** this is the room's DANGLING class turned on itself. `gen-consumer.js:36` names it —
*"a dead pointer is worse than an absent one: it reads as authoritative and resolves to
nothing"* — in the header of the file that carries one.

**What it does NOT mean.** It does not mean the 08-23 build work never happened; something ran
`cargo check` over a generated tree and found `build.rs`/`Cargo.lock`/`capabilities/`/`icons/`
missing from the manifest, and those entries are in `MANIFEST` today. **The artifact was not kept.**
If it exists uncommitted on the other machine, it has still reached no seat and cannot be run here,
which from this desk is the same state.

**Why I left the invariant naming it anyway rather than picking a name E might not use:** an absent
gate exits non-zero, so *"the gate is green"* evaluates to FALSE today. The invariant is well-formed
on its first reading and returns the unwanted answer — which is the only kind worth registering.
**E's packet is where the file gets built; this is a note for that seat, not a claim on its work.**

---

## 3 · THE PUSH RULE — and the honest ceiling of it

**Mechanism, exercised today** in a throwaway checkout in the scratchpad (not in either real repo):

    git remote set-url --push origin no_push
    git remote get-url --push origin      ->  no_push
    git push origin HEAD                  ->  fatal: 'no_push' does not appear to be a git repository

Fetch and clone URLs are untouched. git 2.53.0.windows.2.

**What I wrote into the document about what that is worth, and I am not softening it here:**

> **This is a speed bump, not a control.** A seat can re-arm the remote in one command. What the
> disarm buys is the one thing a hook does not: **its state is readable and its failure mode is
> loud.** A pre-push hook fails by *silent absence*; the disarm fails by the *visible presence of a
> real URL*, checkable in one command.

**And the bypass-proof version is named in the document so nobody mistakes what we have for it:**
the seat holds no credential and the keeper pushes with his own. **That is not the case today** —
`gh` is authenticated machine-wide; every seat on this machine can push everything.
**So this rule's enforcement is that someone reads it, and the document says exactly that.**

This is the packet's §4 pairing kept honestly: on 09-02 I built the commit gate and then ruled that
a hook's failure mode is silent absence and the only bypass-proof control is structural. **A written
rule has the same weakness one level up.** I did not write a sentence that pretends otherwise.

**The manual step stays manual, with the reason in the document** (packet bar 3): the keeper's word
cannot be automated without becoming a *stored yes*, which is the unattended process the publishing
law forbids. Cited by quoted sentence, not by line number — see §5, correction 1.

---

## 4 · THE FALSIFIER, AND ITS SYNTAX EXERCISED TODAY

**Registered:** *a consumer commit with no matching private sha in its message.*

    git -C <consumer> log --format='%H %(trailers:key=Source-Sha,valueonly,separator=%x20)' |
    while read -r c s; do
      if   [ -z "$s" ]; then echo "ORPHAN $c (no Source-Sha)"
      elif ! git -C <private> cat-file -e "$s^{commit}" 2>/dev/null; then
        echo "ORPHAN $c (Source-Sha $s does not resolve in the private repo)"
      fi
    done

**Green prints nothing.** Bar 2 said it must not be first exercised in anger. **Both branches ran
today against private-repo commits:**

| branch | run | result |
|---|---|---|
| trailer absent | the pipeline above over `git log -3` in lighthouse | `ORPHAN 5a83d4a…`, `ORPHAN f3c4e93…`, `ORPHAN 16d2afc…` |
| sha resolves | `git cat-file -e 5a83d4a^{commit}` | exit 0 |
| sha bogus | `git cat-file -e deadbeef×5^{commit}` | non-zero, line printed |

The `%(trailers:key=…,valueonly,separator=…)` format was verified against a key that exists in this
repo's commits (`Co-authored-by`) before being used with one that does not yet.

**Its stated limits, in the document:** it proves the claim *resolves*, not that it is *true*; it
cannot be evaluated from a public-only clone; **it does not see pushes at all**; two trailers fire
it (intended).

**The gap I registered rather than papered over:** *there is no instrument for the push rule.*
Nothing on either machine records a push event, so the check is the keeper noticing or a seat
reporting itself. The document says so in its Registered block, and names the fix as a structural
credential split rather than a better sentence.

---

## 5 · CORRECTIONS, including mine

1. **The packet's citation `COMMITTEE.md:133` does not land on the publishing law.** In
   `consonance/src-tauri/brief/COMMITTEE.md`, line 133 is inside the 2026-09-04 amendment about
   `git commit` capture; the rule *"Nothing is pushed by a seat"* is at **:146**
   (`grep -n 'Nothing is pushed by a seat'`). `journal/2026-07-28.md:188-189` is right — the
   passage runs :188-190. **I cited both by quoted sentence rather than by line number**, because a
   shipped brief that grows by appending moves every line number below the insertion, and this
   section just moved 176 of them.
2. **I did not write the proposed absolute path, and the reason is measured, not aesthetic.**
   `BUILDING.md` is in scope for the portable-paths ratchet — it is one of the *30 shipped prose*
   files the tool expands from `bundle.resources` (`node consonance/tools/portable-paths.js`). An
   absolute path in this sentence would be a **new machine-specific site in a document a stranger
   reads**, and the ratchet would go red on the rule itself. **The location is unchanged** (a
   sibling of the private checkout, named `consumer` — which resolves to the chair's proposal on
   this machine); only its *form* moved, to
   `dirname "$(git rev-parse --show-toplevel)"`. **Ratchet re-run after the edit: green — 208 files
   in scope, 168 known sites, 0 new.**
3. **I did not refuse the fixed-path checkout, and I said in the document why P-WORKTREE-PER-SEAT
   does not apply here.** A worktree shares one repository's history, objects and remotes; the
   consumer is a different repository whose history must not be able to reach a private object. My
   own open registration is about several seats sharing one repo's index — a different problem, and
   I marked it so nobody reads it across.
4. **`cite-check` over the edited file reports 6 uncited figure-bearing lines — all of them
   pre-existing** (L174, L319, L333, L439, L470, L583; my section begins at L596). Every figure in
   the new section has its command in the same paragraph.

---

## 6 · WHAT I DID NOT VERIFY (bar 5)

- **That the section reaches any seat.** Bundle resource; see §0. Not rebuilt, not tested in a
  running pane. I did not check whether this machine's data dir holds a shadowing editable copy.
- **That the disarm survives a `git clone`.** I set it by hand on a fresh init. A cloned consumer
  checkout arrives *armed*, and nothing yet performs the disarm at clone time — the procedure says
  it is the resting state, and no instrument enforces it.
- **Anything about the consumer checkout.** It does not exist (`ls` on the sibling path → no such
  directory). Every `<consumer>` command in the document is unrun against a real consumer tree by
  construction.
- **The gate's behaviour.** I verified only its *absence*. I did not attempt to write it, and I did
  not check whether E has one in flight.
- **The manifest half of the invariant.** I did not run `--report`; I read the MANIFEST block. The
  WRONG 71 tonight — the LIBRARIAN's ledger entry, the CHAIR's find (my first draft said "the
chair's WRONG 71", conflating the number with the catch; corrected here and in `map/A.md`) — is
exactly the failure of reading a manifest through the wrong instrument,
  so treat my reading of it as unverified and the `--report` run as the thing that settles it.
- **Whether `solariz3d/consonance` is still empty.** `gh repo view` said `isEmpty:true`,
  `isPrivate:false` at ~01:05; lighthouse `isPrivate:true`. Both read once, not re-read since.
- **Anything about P1-ATTACK.** Queued; C's ruling does not exist yet.

---

## 7 · ONE THING FOR THE CHAIR'S OBSERVATION, verified rather than taken

The chair reported that `commit-gate` returned green over four in-flight packet files because no lap
was dispatched yet. **Confirmed from the source, not the transcript:** `commit-gate.js:276` returns
`{ verdict: 'ALLOW', reason: 'no lap is dispatched; nothing is in flight' }` when the newest chain
row is not `dispatched`, and `holders()` at :219 is never reached. **The pre-dispatch window is
unguarded by construction, not by a bug** — the gate's unit is the dispatched lap, and packets are
written before one exists. Recorded in `map/A.md`; not fixed here, not my paths this lap.

---

## 8 · PATHS

    consonance/src-tauri/brief/BUILDING.md      +176, one appended section
    exo_memory/handback/p-port-rule_2026-09-06.md   this file
    exo_memory/map/A.md                         +1 line

**Nothing committed.** Written by pane A.

---

# APPENDED 2026-09-06 ~01:50 — the two one-liners, and a third the lap forced

*Chair's return leg on this hand-back; librarian's collation read at the file
(`librarian/2026-09-06.md` ~01:35, `fa5ad2c`) — its §A line owes exactly FIX 1, and its
"one mis-attribution to correct at collation" is FIX 2. Still uncommitted; still pane A.*

## 9 · FIX 1 — the disarm moves INTO the clone step

**My own §6 said a cloned checkout arrives ARMED and nothing performs the disarm at clone time.**
That was a limit I stated and then left as a limit, which is the move this document exists to
refuse. The procedure now opens with a step 0 rather than an assumption:

    0  CLONE, AND DISARM IN THE SAME STEP -- a fresh clone ARRIVES ARMED:
           git clone <consumer remote> <consumer>
           git -C <consumer> remote set-url --push origin no_push     # NOT a later step
           git -C <consumer> remote get-url --push origin             # must print: no_push
       The checkout is not ready for step 1 until that third line prints no_push.

With the reason written beside it, in the document: *a control a seat has to remember to apply
afterwards is not a control — it is the same silent-absence failure the commit-gate ruling names.*

**What it buys, stated at its real size and not one inch above it.** The `gh` credential is
machine-wide, so this is **a speed bump between a seat and an irreversible public push** — nothing
more. It does not prevent a determined push, it cannot, and the document already says a seat re-arms
the remote in one command. What moving it into step 0 changes is only this: **the armed state is
never the resting state of a checkout**, so a push that happens by momentum — a habitual `git push`,
a script, a seat working fast — fails loudly instead of succeeding quietly. **The credential
question is the keeper's and the librarian routed it to him; nothing here anticipates his answer.**

## 10 · FIX 2 — WRONG 71 is the librarian's ledger, the chair's find

Corrected in §6 of this file and in `map/A.md`. My text read *"the chair's WRONG 71"*, which fuses
two different things: **the WRONG is the librarian's** — its ledger, its column, its error — and
**the FIND is the chair's**, made before dispatch, with an instrument, on a figure four seats were
about to reason from.

The chair is right that this is not cosmetic. A document read by seats with no memory of tonight
teaches where corrections come from, and *"the chair's WRONG"* teaches that a chair's numbers are
the ones that go wrong. **What actually happened is the loop working in the direction it was built
to work: the seat that dispatches verified the seat that maps, before the work left the room.**
Recording it the other way would quietly credit the wrong station and lose the mechanism.

## 11 · FIX 3, WHICH I DID NOT ASK FOR AND THE LAP HANDED ME — the gate now exists

**Ninety minutes after §2 of this file said `gen-consumer.build.test.js` had never existed, it
exists and is committed** — `ba8ddbc`, pane E, this lap:

    git log --oneline -1 -- consonance/tools/gen-consumer.build.test.js
      ba8ddbc ECHO (L037): the first-push gate — cargo build and a launch probe, not cargo check

**BUILDING.md would otherwise have landed carrying a false present-tense claim in a shipped brief** —
precisely the dangling-pointer class the section was written to guard. So:

- The section now names the live command, from E's hand-back rather than from my guess:
  `CONSONANCE_LAUNCH_PROBE=1 node consonance/tools/gen-consumer.build.test.js`.
- The absence paragraph is **kept and marked as dated**, with a block quote saying it was true when
  written and false ninety minutes later. *Mark the carriers; leave the traces* — the finding is why
  a stranger should trust the invariant, and deleting it would hide the one time it fired.
- Step 2 of the procedure gains one clause from E's contract that I could not have known when I
  wrote it: **`BLOCKED` (exit 3, the single-instance lock held) is neither green nor red — it is
  UNMEASURED, and a port does not proceed on it.** That is the exact seam a gate loses its meaning
  in, and E built the distinction in; the document now carries it.

**And the part worth more than the fix: E found the gate's absence independently, in the same lap,
from a different vantage** (`handback/p-first-push-gate_2026-09-06.md` §0 — a `--diff-filter=A`
name-only sweep plus a filesystem `find`, against my object-and-ref sweep). Neither of us read the
other. E also found the thing I did not: `gen-consumer.test.js`'s own header says its author shipped
a static check **instead of** a build gate and said so in plain words, unread for two weeks — so the
room was not running a weak gate, it was running none while four documents cited a description of
one. **Two instruments, two seats, one answer is confirmation rather than echo**, and it is the
strongest evidence this lap produced that the committee is doing what it is for.

## 12 · RE-RUN AFTER ALL THREE EDITS

    node consonance/tools/portable-paths.js
      green — 209 files in scope, 168 known sites, 0 new

*(209, not the 208 in §5: E's new gate file joined the universe between my two runs. **0 new sites**
is the number that matters and it is unchanged.)*

**What I did NOT verify, added to §6 rather than replacing it:**

- **I did not run E's gate.** Not once, not in any mode. Everything I say about its exit codes and
  its `BLOCKED` state is read from E's hand-back, which is a seat's prose about its own instrument —
  the class this room prices lowest. **The command in BUILDING.md is unrun by me.**
- **I did not verify the clone step end to end.** No consumer remote has ever been cloned; step 0's
  three lines are exercised only as the individual commands from §3, on a `git init`, not on a
  `git clone`.
- **Still not rebuilt**, so §0 stands unchanged: this section reaches no seat until a build.

## 13 · PATHS, unchanged

    consonance/src-tauri/brief/BUILDING.md      three edits: step 0, the BLOCKED clause, the dated-absence block
    exo_memory/handback/p-port-rule_2026-09-06.md   this append + the §6 attribution fix
    exo_memory/map/A.md                         attribution fix + the gate-now-exists amendment

**Nothing committed.** Written by pane A. **P5-ATTACK is held, not started** — B is mid-build and
the baton is not mine to take early.

---

# §14 · APPENDED ~03:58 — HAS THIS GONE STALE SINCE 02:00? Asked by the chair before the rebuild

*Written at 02:00, before tonight's gate, guard and inbox work existed. Three things moved under it.
Two are absorbed; one is a real staleness item and it is in the falsifier, which is the half that
matters.*

**1 · The gate exists now — already amended, §11.** The section names the live command
(`CONSONANCE_LAUNCH_PROBE=1 node consonance/tools/gen-consumer.build.test.js`), keeps the
absence paragraph as a dated trace, and carries E's `BLOCKED` (exit 3) clause. **Nothing further
owed.** I still have not run it — §11's limit stands.

**2 · The push rule and step 0 are unchanged and unaffected.** The clone-step disarm, its honest
ceiling (a machine-wide `gh` credential makes it **a speed bump, not a lock**), and the manual step
staying manual are all as written. Nothing tonight touched the credential situation, so nothing
tonight makes the rule stronger or weaker than the sentence I wrote. **The consumer checkout still
does not exist**, so step 0 remains the only step never executed against a real clone.

**3 · THE STALENESS ITEM — `Source-Sha` is now half-obsolete and, worse, provably weaker than I
said, and both discoveries are from tonight's own laps.**

**(a) The generator already writes the sha.** `CONSUMER-STATUS.md` carries
`GENERATED-FROM: <40-hex>` and `CUTOFF.md` names the same commit — both generator-written, neither
hand-typed. **My rule asks a seat to hand-type a `Source-Sha:` trailer that a machine already
computed**, which is the class of duplication that drifts. *Amendment I would make, and am not making
unilaterally because it is a rule and rules get one author per lap:* **the trailer is READ from
`CONSUMER-STATUS.md`, never retyped**, and the falsifier gains a second clause — the trailer and the
tree's own `GENERATED-FROM` must agree. That clause catches a class the current falsifier cannot see
at all: a correct-looking sha that is not the tree's.

**(b) The sha is stamped from a DIRTY working tree, which I proved four hours later against a
different file.** `handback/p-inheritance-attack_2026-09-06.md` §2: the generator reads the working
tree (`fs.readFileSync`, four sites) while `commitIdentity()` stamps `git rev-parse HEAD`, and
`grep -c 'porcelain\|dirty\|isClean' gen-consumer.js` → **0**. **So every generated tree ever made
carries a sha it has not earned**, and `Source-Sha` inherits it exactly. My §4 registered this as a
limit in the abstract — *"it proves the claim RESOLVES, not that it is TRUE"* — and it is no longer
abstract: **it is the live state of every artifact the rule governs.**

**And here is the part that changes the document rather than annotating it.** B is fixing this, and
the two candidate fixes have different consequences for my rule:

- **If B lands REFUSE-ON-DIRTY**, `Source-Sha` becomes trustworthy and §4's stated limit shrinks to
  the narrow case (a seat writing a real-but-wrong sha). **The rule needs no change.**
- **If B lands the `GENERATED-FROM: <sha>+DIRTY(<n>)` stamp**, my trailer format —
  `Source-Sha: <the 40-hex sha>` — **cannot express it.** A dirty-generated tree would then be
  recorded by my rule as though it were clean, and my falsifier would pass over it silently. **That
  is the rule actively laundering the defect**, which is worse than not covering it.

**So: the port rule as written is correct today and becomes WRONG the moment `+DIRTY` lands.**
Registered here rather than fixed, because the fix depends on a decision that is B's and the
keeper's, not mine, and guessing which way it goes is how a rule ends up describing a tree nobody
built. **Whoever lands B's choice owns one line in §"The commit trailer" of `BUILDING.md`** — and if
it is `+DIRTY`, the trailer must carry the dirt or the falsifier must refuse a dirty tree outright.

**Nothing else has gone stale.** The invariant, the five-step procedure, step 0, the push rule and
its ceiling, and the four registrations all read the same at 03:58 as at 02:00.

*Appended by pane A during the L040 fold. `BUILDING.md` not reopened for this — the amendment above
is a registration, not an edit, and editing a rule in the same breath as noticing it might need to
change is how the noticing gets lost.*
