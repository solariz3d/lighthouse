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
