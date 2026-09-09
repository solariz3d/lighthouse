# P-RETURN-LEG-FOLLOWUP — hand-back. Pane E, 2026-09-09, L050.

**Packet:** `exo_memory/loop/packet_return_leg_2026-09-09.md` (`1b4287c`).

**Owned and touched:** `consonance/src-tauri/src/mcp.rs` (the gate and its 10 tests, in that file's
own `mod tests`), this file, `exo_memory/map/E.md`. **`main.rs` not touched** (C holds it);
`chain-status.js` not touched (B holds it); `lap-row.js` not touched. **Nothing committed.**

**I did not build the rule the packet specified, and §1 is why. The permission to relocate is
answered in §2: neither named site can hold it.** What is built is in §3.

---

## 1 · THE RULE AS WRITTEN CANNOT BE BUILT — and this is a proof, not a preference

> *"A `chair_inject` into a pane during RETURN-LEG is REFUSED unless a stage row precedes it."*

**(a) At the instant of the call, the good case and the bad case are the same ledger state.**
`required_station` (`mcp.rs`) puts `chair_inject` at holder `chair` and `call_librarian` at holder
`panes`. With one open lap those are mutually exclusive. **So every `chair_inject` — the correct
fan-out at dispatch and the follow-up that trapped A alike — necessarily happens while its target
cannot answer.** The L049 fan-out at 00:35 (three injects, correct) and the follow-up at 00:56 (the
trap) differ in nothing that exists yet when the verb runs; they differ in what the chair does
*next*. **A pre-condition cannot separate states that are identical.** Pinned as a test —
`with_one_open_lap_the_chair_and_the_panes_can_never_both_speak` — so if it ever stops being true,
the gate is at the wrong site and the test says so.

**(b) Requiring a preceding `--holder panes` row inverts the ring gate and deadlocks.** `lap-row.js`
states its own rule in the file: *"The fix is an ORDER, not a channel: ring first, write the row
second."* `gateVerdict` refuses a row that moves the baton unless an audited delivery to the
incoming holder landed **since the baton last moved** (`the window is the possession, not a clock`).
So `--stage L049 working --holder panes --by chair` needs a chair→pane delivery inside the current
possession — which is the very `chair_inject` the proposed rule refuses. Chicken and egg:

    chair_inject  refused: no --holder panes row yet
    the row       refused: no ring to panes since the baton last moved
    retake        --by chair --holder chair is legal but leaves the holder at chair

**And it deadlocks precisely where it fires**: the rule triggers when the chair holds and wants a
pane, which is exactly the state in which no ring has yet landed. That fires `lap-row.js`'s own
registered falsifier — *"if any seat is found genuinely stuck behind this gate with no legal move,
the reasoning is wrong and `--force <reason>` is owed."* Building it would have created a worse
stall than the one it was written to end, on a night when someone was waiting.

**The packet's named recovery is the same command, so it inherits the same refusal.**

---

## 2 · THE RELOCATION PERMISSION, ANSWERED: not `lap-row.js` either

**The failure on 2026-09-09 was the ABSENCE of a row. A gate inside a writer that is never called
cannot fire.** `lap-row.js` could refuse to *leave* the chair holding while a pane is mid-turn — but
the chair ran no `lap-row.js` command at all between 00:56 and the keeper's message, so that gate
would have sat silent through the entire 29 minutes. This is my own L044 sentence arriving on a
third surface: *a property expressed as an absence cannot fail on the case nobody named.*

So: **`mcp.rs` is the right file and the librarian was right about the site. The pre-condition is
the wrong shape.**

---

## 3 · WHAT IS BUILT — enforcement at the first moment the trap is DISCRIMINABLE

The trap becomes visible exactly once: **when the pane's hand-back is refused.** That is a real
event in this process, it can be recorded, and everything follows from it.

**Two marks, and the whole mechanism is that they are read against the baton rather than a clock:**

    RUNG   a chair_inject succeeded            -> a pane was woken
    OWED   a call_librarian was refused OUT OF TURN -> a pane finished and cannot speak

**A mark counts only while it is newer than the baton's last move** (`chain_state().at`, the newest
chain row across all open laps). The window is the POSSESSION, copied from `lap-row.js`'s ring gate
rather than re-invented, so there is no second definition to drift and **no threshold to tune**.
The consequence that matters: **the marks clear themselves the moment the recovery row lands.**
The thing that fixes the state is the thing that erases the flag — no bookkeeping, no expiry, no
timeout. This is the same move as the live-host lease last lap: take the clock out of the decision
rather than choosing a better number for it.

**Two changes at the verbs:**

1. **`chair_inject` refuses while a hand-back is owed** — *"A HAND-BACK IS OWED AND CANNOT BE
   DELIVERED — A finished work and its call_librarian was refused OUT OF TURN… Move the baton, then
   re-send: `node consonance/tools/lap-row.js --stage L049 working --holder panes --by chair`"*.
   **It cannot deadlock**, and the reason is the inverse of §1(b): the chair holds the baton here,
   and the ring that row's gate wants **is the inject that created the debt**, so the printed
   command is legal at the moment it is read. It sits *after* the station gate and is strictly
   narrower.

2. **`call_librarian`'s refusal tells the pane which silence it is in.** Before tonight it said,
   unconditionally: *"The loop comes back to you; do not queue, do not retry in a spin."* **In the
   trap that sentence is false, and A obeyed it for 29 minutes.** Now:

   - **nobody rung this possession** → the old wording, unchanged. Waiting is correct.
   - **a pane was rung and no row followed** → *"THIS IS THE RETURN-LEG TRAP, NOT AN ORDINARY WAIT
     … THE LOOP IS NOT COMING BACK ON ITS OWN"*, plus two runnable commands.

**And the second command is the finding I did not expect.** The trapped pane has always had a legal
way out and has never been told it: `--by` equal to `--holder` is a **RETAKE**, which `lap-row.js`
allows with no ring, so a pane may always write
`--stage <lap> working --holder panes --by panes` and then hand back. That is the exact capability
`mcp.rs`'s no-wedge argument has always rested on — *"the baton can always be moved by hand"* — and
the command was printed **only on the board line**, which is the one place a pane waiting on a tool
result is not reading. **Naming a recovery where the stuck party cannot see it is not naming it.**

---

## 4 · THE CARVE-OUT, RULED: dropped, and here is what is lost

`BUILDING.md` keeps an interrupt exception — *stop, you are about to clobber something* — goes
immediately. **I am not adding an interrupt flag, and the capability survives anyway.**

**Why not a flag.** A seat setting `interrupt: true` on its own call is `--by`'s self-report problem
with the incentives reversed. `lap-row.js` accepts self-report for `--by` and says why: *"this is a
GUARD against an honest seat disarming itself… a seat that lies to it has bypassed a guard aimed at
its own foot."* An interrupt flag is the opposite — it does not cost the caller anything, it **buys
the caller standing**, and the caller under time pressure is exactly who reaches for it. A door with
a sign on it.

**Why nothing is lost in the ordinary case.** This gate fires *only* when a hand-back is owed and
undeliverable. In every other state — including every state in which a genuine clobber-interrupt has
ever been needed — `chair_inject` is untouched.

**What IS lost, stated rather than waved past.** In the one state where the gate fires, a genuine
"stop!" is delayed by the time it takes to run one printed command. The cost is bounded by that
command, the chair already holds the baton so it is always available, and **the debt that causes the
delay is the chair's own**. If that ever proves too slow in a real incident, the honest fix is to
narrow the gate with the incident named — not a flag that makes every dispatch able to claim
urgency.

---

## 5 · WHAT THIS DOES NOT FIX

**A pane mid-turn when the leg is taken is still reachable, and I did not close it.** Sequence: the
chair injects (legal), the pane starts work, the librarian or the chair writes `return-leg
--holder chair`, the pane finishes into a refusal. Nothing in this change prevents that — the row is
written by a CLI this gate cannot see, and the pane is already working.

What changed for that pane is that **it is no longer silent and no longer lied to**: its refusal now
names the trap and hands it a retake it can run itself. So the case survives as a *stall the pane
can end*, not a *wait with no exit*. That is less than the packet asked for and it is the honest
extent of it.

**Second unfixed case, and it is the same shape one level up:** the very first inject of a
possession is provably indiscriminable (§1a), so a chair that rings a pane and then walks away
before the pane ever calls `call_librarian` leaves no OWED mark and nothing fires. The trap is
caught when the pane tries to speak, not when it is created. **The gate makes the trap loud and
self-clearing; it does not make it unreachable**, and the packet asked for unreachable.

---

## 6 · THE BARS

**Cargo, `cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1`:**

    before:  468 passed; 1 failed; 4 ignored
    after:   479 passed; 1 failed; 4 ignored

**The 1 failed is `offset_tests::the_backfill_decision_must_be_made_after_the_configured_dirs_resolve`
— C's EXPECTED-RED from `a17007f`. It is not mine, I did not touch it, and it is red in both runs.**

**The delta is +11 and I added 10.** The eleventh is not mine: the tree moved under me during the
lap (I watched `ignored` flicker 4 → 5 → 4 between runs while other panes landed files), and
`mcp::tests` went 20 → 30, which is my ten exactly. I am reporting the arithmetic rather than
rounding it to the number I wanted.

**My ten**, all pure — no ledger, no board, no disk, no clock, because the machine-bound class was
born from a test that read the real corpus and gave a different verdict on the desktop:

    red_first_an_owed_hand_back_refuses_the_next_inject_and_names_the_recovery
    an_ordinary_fan_out_is_not_touched
    a_mark_that_never_happened_is_not_a_very_old_mark
    no_open_lap_gates_nothing
    the_window_is_the_possession_and_the_boundary_is_inclusive
    the_two_silences_are_told_apart_and_only_one_says_wait
    the_trapped_pane_is_handed_its_own_legal_exit
    every_refusal_this_gate_adds_prints_a_runnable_command
    with_one_open_lap_the_chair_and_the_panes_can_never_both_speak
    the_trap_gate_is_wired_into_both_verbs

**Mutants — 9 applied, 9 caught, 0 survived**, each named with the test that killed it. Harness:
`scratchpad/mutants-mcp.sh` (not in the repo; it mutates `mcp.rs` in place, rebuilds, restores under
a trap, and verifies the restore by sha1 — reported `restored: YES`).

| mutant | killed by |
|---|---|
| M1 the debt gate never fires | `red_first_…`, `every_refusal_…` |
| M2 the refusal fires but names no recovery | `red_first_…`, `every_refusal_…` |
| M3 the gate refuses in every state | `an_ordinary_fan_out_is_not_touched`, `the_window_…` |
| M4 a mark that never happened is read as a very old one | `a_mark_that_never_happened_…` |
| M5 the possession boundary is exclusive | `the_window_is_the_possession_…` |
| M6 no open lap gates everything | `no_open_lap_gates_nothing` |
| M7 the RUNG mark is never written | `the_trap_gate_is_wired_into_both_verbs` |
| M8 the unconditional wording survives in `call_librarian` | `the_trap_gate_is_wired_into_both_verbs` |
| M9 `chair_inject` never consults the debt gate | `the_trap_gate_is_wired_into_both_verbs` |

**The packet's two named mutant bars are M1/M2 and M3, and both are red.**

**RED FIRST, honestly qualified.** I wrote the implementation and then the tests, so the red-first
property is demonstrated **by removal, not by chronology**: M9 is precisely the code as it stood
before this change, M1 is the gate present-but-inert, and both turn
`red_first_an_owed_hand_back_refuses_the_next_inject_and_names_the_recovery` red. That is the same
evidence a chronological red-first produces, arrived at the weaker way, and I would rather say so
than let the ordering be assumed.

---

## 7 · THE MISTAKE I MADE INSIDE THE INSTRUMENT, WHICH IS THE FINDING OF THE LAP

**My first mutant run reported all nine as *"did not compile"* — including `>=` → `>`, which
obviously compiles.** The harness classified by grepping `/^error/` in cargo's output, and
`cargo test` prints `error: test failed, to rerun pass --bin consonance` **for a red test**. So the
harness could not tell *the build never ran the tests* from *the tests ran and failed* — and it
reported the wrong one, green-looking, nine times.

**That is done-vs-never-started, inside the tool I built to check the fix for done-vs-never-started,
one hour after writing the packet's §4 into a design.** The class does not stop recurring because I
can name it.

The repair is the same one the room already owns: `js-suite.js` separates CRASHED from FAILED by
*"the summary line is the evidence"*. The harness now requires a `test result:` line to exist before
it will read a count, and has an `UNKNOWN` bucket for output that has neither — because a
classifier with no third arm invents one. I caught it because the result was **too uniform to be
true**, not because anything checked it.

---

## 8 · WHAT I DID NOT VERIFY

- **Nothing ran end to end.** No live pane was trapped and rescued with this build; the app was not
  rebuilt or relaunched. Every test is over pure functions and over the file's own source text.
- **The pane's retake is verified by READING `lap-row.js`, not by running it.** `gateVerdict`
  returns `retake` when `by === holder`, and `STATIONS` accepts `panes` — but I did not execute
  `--stage <lap> working --holder panes --by panes` against the live ledger, because doing so would
  have moved the baton on an open lap I do not hold. **If that command is refused in practice, the
  second recovery in my refusal text is wrong and the message is worse than useless.** It is the
  first thing to check and it costs one command on a filed lap.
- **The RUNG mark is not matched to the caller.** If the chair rings pane B and pane A calls, A is
  told it is in the trap. I judge that correct — in that state A's hand-back is undeliverable for
  the same reason and clears by the same row — but it is a widening, and matching a `target` (a
  letter or a pane-id prefix) to a mount identity would need prefix resolution, which is a guess.
  Named rather than resolved.
- **The marks are per-process and in memory.** A restart forgets them. Forgetting fails toward
  ALLOW, which is the direction a stalled loop needs, but a chair that restarts mid-trap gets no
  refusal.
- **Multi-lap:** `chain_state().at` is the newest chain row across *open* laps, so "the baton last
  moved" is global rather than per-lap. That is what I want here and it is not the `lap_holders`
  conflation — but I did not construct a multi-lap case to prove the two readings differ where I
  claim they do.
- **The 29-minute figure and the L049 sequence are the chair's account plus the ledger note at
  `lap.jsonl` (L049 `filed`), not something I timed.**

---

# ADDENDUM — 2026-09-09 ~02:0x. Three things from the chair, ruled.

## A · THE MUTANT CHARGE: the run I reported did compile, and I have added the control that proves it

**The charge is fair against §7 and not against §6, and the confusion is my doing.** §7 describes my
**first** harness run, which I threw away. Every mutant in the run reported in §6 **built and ran to
a `test result:` line**, and each names the test that killed it:

    CAUGHT M5 the possession boundary is exclusive  (2 failed vs the baseline 1)
      by: mcp::tests::the_window_is_the_possession_and_the_boundary_is_inclusive
      test result: FAILED. 478 passed; 2 failed; 4 ignored

**Zero "did not compile" in the reported run**, and the harness has had a NOT-APPLIED arm from its
first line: a sha1 check that the mutation actually changed the file (`SKIP`), and an `UNKNOWN`
bucket for output carrying neither a `test result:` line nor a compile error. Both read 0.

**But the chair's instinct is right and my evidence was one arm short.** "9 of 9 caught" is also what
a harness that prints CAUGHT unconditionally would report — **an instrument that can only return one
answer is not an instrument**, which is my own L046 sentence aimed at me. So I built the control I
had not built (`scratchpad/controls-mcp.sh`):

| control | expected | got |
|---|---|---|
| C1 a comment word, no behaviour change | SURVIVE | **SURVIVE** |
| C2 refusal prose no test asserts on | SURVIVE | **SURVIVE** |
| C3 an anchor that is not in the file | SKIP | **SKIP** |

    controls: 3 ok · 0 bad · restored: YES

**The harness can report a survivor and can report a not-applied, so the nine catches are catches.**
The lesson is not about this run: **a mutant harness needs a mutant that must survive, in the same
run, or its own output is unfalsifiable.** It now lives in the script rather than in prose.

**And the legibility failure is mine to own:** putting "the mistake I made inside the instrument" in
§7, *after* the results in §6, let a discarded run read as the reported one. A correction belongs
beside the number it corrects, not in a later section.

## B · THE PACKET'S CORRECTION, RULED — and both premises are wrong, in opposite directions

**The guard is neither stage-aware nor stage-blind. It is HOLDER-based, and the stage word never
enters it.** `required_station` reads the holder; stage and holder merely correlate, which is why
both readings looked right. From `C:\Consonance\data\lap.jsonl`:

    L049  map         holder=chair        L050  map         holder=chair
          dispatched  holder=panes              working     holder=panes
          return-leg  holder=chair              working     holder=chair   <- the 01:52 retake
          filed       holder=none               working     holder=panes
                                                return-leg  holder=chair

- **The packet's first premise** — *"a dispatch during DISPATCHED or WORKING is ordinary fan-out and
  must stay legal"* — is false, and the chair proved it at **01:51:57**:
  `chair_inject REFUSED OUT OF TURN — … open laps are held by ["panes"] (newest: lap L050)`.
- **The correction's premise** — *"the chair is already refused there [RETURN-LEG], so what is
  missing may be only the NAMED RECOVERY"* — **is also false, and it is the more consequential of
  the two.** L049's `return-leg` row holds at **`holder=chair`**. The chair is not refused during
  return-leg; **it is the only seat that may speak there.** That is exactly how the 00:56 injection
  into A succeeded, and therefore how the trap was made at all.

**Ruling: the RETURN-LEG case does need a refusal, and the debt gate in §3 is it.** The named
recovery is the half that cost the 29 minutes; it is not the whole of what was missing.

**Neither premise would have been caught by reading the code.** `required_station` says
`chair`/`panes` and says nothing about which stage puts which word in the row — that mapping exists
only in the ledger, which is where I went.

## C · "FAN-OUT BY RE-TAKING THE BATON" — a hole, and it fired tonight, on C, in 41 seconds

Asked to rule it fine or a hole: **a hole**, and not hypothetically. The chair's own retake —
performed in order to send me the message saying the return-leg case may need no refusal — **created
the return-leg trap for C while it was open.** From `board.jsonl` and `lap.jsonl`, one clock:

    01:51:57  chair_inject REFUSED OUT OF TURN — mount D … open laps are held by ["panes"]
    01:52:17  lap.jsonl  L050 working  holder=chair   by=chair      <- the retake
    01:52:43  call_librarian REFUSED OUT OF TURN — mount C … open laps are held by ["chair"]
    01:52:58  lap.jsonl  L050 working  holder=panes   by=chair      <- handed straight back

**C's hand-back arrived 26 seconds into a 41-second window and was refused by it.** C got the old
unconditional line — *"the loop comes back to you"* — and this time it did, fifteen seconds later.
**C was lucky, not safe.** The difference between C's night and A's is whether somebody happened to
hand the baton back.

**The invariant neither the packet nor my own §2 had:**

> **Moving the baton TO panes never traps anyone. Moving it AWAY from panes is the only trapping
> move there is** — and the retake-to-dispatch is exactly that move, performed for a good reason.

**This partly corrects my §2.** I ruled that `lap-row.js` cannot hold the invariant because the
failure was the *absence* of a row. True of A's case; false as a general claim. **C's trap was
created BY A ROW** (`working --holder chair`), which `lap-row.js` wrote and could therefore have
seen. Two variants, two homes, and I collapsed them:

| variant | what created it | who can see it |
|---|---|---|
| **A's, 00:56** — inject during return-leg, no row follows | an absent row | only `mcp.rs` — the debt gate, §3 |
| **C's, 01:52** — a row moves the holder away from panes mid-turn | a written row | **`lap-row.js` could see it** |

**What my change does for C's variant, exactly:** it does not prevent the window. It records the
OWED mark at C's refusal, so the chair's *next* inject is refused with the recovery printed, and C
is told it is in the trap and handed a retake it may legally run. **Loud and exitable, not
impossible** — the same honest extent as §5.

**What would close it, and it is not mine to build:** on a row that moves the holder *away from*
`panes`, `lap-row.js` already has the artifact — it reads `board.jsonl` for the ring gate, and an
audited chair-to-pane delivery since the baton last moved is the same fact my RUNG mark is. It is a
**one-sided** check (that direction only), and it should cost an acknowledgement rather than a
refusal, because the retake is sometimes the right move and refusing it would re-create the deadlock
of §1(b). `lap-row.js` is not mine this lap; I am naming the site and the shape, not editing it.

## D · PORTABLE-PATHS — closed

    node consonance/tools/portable-paths.js --update   # baseline written — 176 sites (was 171)
    node consonance/tools/portable-paths.js           # green — 234 files in scope, 176 known, 0 new
    node consonance/tools/portable-paths.test.js      # tests 35 · pass 35 · fail 0

**The diff is +5 and nothing else.** Every other verdict class is unchanged to the count
(FATAL-DEFAULT 24, REVIEW 17, DISGUISED 14, BENIGN-MESSAGE 5, FATAL-USER 7, BENIGN-FIXTURE 7,
FATAL-TEST-READ 2, FATAL-SHIPPED-INSTRUCTION 1; BENIGN-TEST 94 to 99), and `git diff` shows five
added sites, all in `live-host.test.js`, all `identityHazard(...)`. I checked rather than assumed,
because `--update` rewrites the baseline from the **whole tree**: on a checkout four panes are
editing, it would have silently exempted anyone else's new site too. It did not.

**The one line a stranger needs:** these five paths are the SUBJECT of the test, not a machine
leaking into it. `identityHazard` decides whether the install-id file sits *inside* the travelling
root, so the test must hand it literal absolute paths on both sides — including
`C:\Consonance\database`, a deliberate near-miss proving the check does not match a sibling
directory by prefix. Resolving them through an env override would test the resolver and stop testing
the guard. Same shape as A's `install-only` fixtures.

## E · CARGO, RE-RUN AFTER BOTH HARNESSES RESTORED THE FILE

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
    test result: FAILED. 479 passed; 1 failed; 4 ignored

Unchanged from §6, and the 1 is still `offset_tests` — C's EXPECTED-RED from `a17007f`, not mine.
Both harnesses reported `restored: YES` against a sha1 of the original.

## F · WHAT THIS ADDENDUM DID NOT VERIFY

- **The 01:52 sequence is read off `board.jsonl` and `lap.jsonl`, not reconstructed** — but I did not
  confirm with C that the hand-back refused at 01:52:43 was the one it was writing. The board names
  the mount and C's own board line at 01:53:01 says its ring was refused; two sources, neither of
  them C's transcript.
- **§C's one-sided `lap-row.js` check is a shape, not a design.** I have not checked whether its
  `deliveries` reader can tell "a pane is mid-turn" from "a pane was rung and has finished", which
  is the entire difficulty and may make that check impossible in the same way §1 made the packet's.
- **The controls test the harness, not the mutants.** C1 and C2 prove a survivor is reportable; they
  do not prove that any particular one of the nine was applied to the line I believe it was. The
  sha1 check proves the file changed, not where.
