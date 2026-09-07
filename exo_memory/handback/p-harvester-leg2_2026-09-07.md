# P-HARVESTER LEG 2 — hand-back. ECHO (pane E), 2026-09-07.

**Patch:** `exo_memory/loop/patch_harvester_leg2_L043.md`
**Module (mine, on disk):** `consonance/src-tauri/src/harvest_guard.rs` — 17 tests, 4/4 mutants.
**`main.rs` NOT TOUCHED.** C holds it. Nothing committed.

## 0 · THE ONE-SENTENCE ANSWER

**Not refused: `into_inner()` is right here and the torn state is bounded, but the packet's item 1
is incomplete as written — the READER gives up on a poisoned lock too, so fixing only the watcher
buys a watcher that faithfully re-harvests a permanently frozen screen and reports itself healthy;
the patch therefore puts one policy on both sides of the mutex, bounds the recover-plus-catch loop
that items 1 and 2 compose into, and stamps ATTEMPTS with the panic message attached so the next
death answers the question the expired resize test can no longer answer.**

## 1 · THE THREE ITEMS

    1  RECOVER, NOT BREAK      done, and WIDENED to the reader — see §2. `harvest_guard::recover`.
    2  catch_unwind            done, `harvest_guard::guarded`. One `AssertUnwindSafe`, no
                               gymnastics; the justification is in the module's doc comment.
    3  LAST-HARVEST-ATTEMPT    done. `HarvestGuard::attempt` is called BEFORE the work and
                               regardless of outcome; `at_ms` and `last_record_ms` are separate
                               fields so no reader can use one as the other.

## 2 · THE CORRECTION TO ITEM 1, which is the finding of this leg

The packet says fix the watcher's `Err(_) => break` at `:1071`. **That alone does not fix the
stall.** The reader at `:1053` is `if let Ok(mut e) = emu_r.lock()` — on a poisoned lock it skips
the update and keeps reading, *permanently*. The emulator is then never fed again.

So a watcher that recovers would lock successfully, read a frozen screen, dedup it against what it
already wrote, record nothing, and report a healthy attempt clock forever. **Same frozen `.txt`,
now with a green light on it.** The tolerant policy is not the safe one; it is half of the same
defect. Both sides recover in the patch, through one function, so a future reader cannot restore
the asymmetry without deleting a call.

## 3 · THE REFUSAL CLAUSE, answered rather than skipped

**`into_inner()` does not risk torn state worse than a dead thread, and here is the actual
reasoning rather than the conclusion.** What the mutex guards is a `vt100::Parser` and an
`Instant`. The realistic poisoners are (i) a panic in `parser.process` in the reader — a mutation,
which can leave the parser mid-escape-sequence, and a VT parser resyncs on the next well-formed
sequence; and (ii) a panic in `screen.rows()` / `row_wrapped()` in the watcher's lock block —
**read-only**, so the parser is not mutated at all and there is nothing torn to recover. The `.log`
holds the raw bytes either way. Worst case is a garbled screen that heals; the alternative is
permanent silent loss of every pane's last words.

**But "recover but re-initialise" turned out to be the right answer for a different reason than the
packet's, and I only found it by composing items 1 and 2.** If a panic is *deterministic*, catching
it and continuing is a permanent panic loop at the 250 ms poll — a burned core, forever, writing to
a stderr that goes to no file. Recovery has to be bounded. Three consecutive panics rebuilds the
parser once; one success in between clears the count so unrelated panics never accumulate into a
reset. **A reset costs one screen; the loop costs a core.** That is a failure the three items
create together and none of them names.

## 4 · ITEM 3'S PLACEMENT — separate from `data/ready/`, and not as a preference

`data/ready/<session>.json` is written **by the hooks inside the pane's claude process** and answers
*"is the harness idle?"*. The harvest stamp is written **by the app's watcher thread** and answers
*"is the recorder alive?"*. Sharing a path would mean two unsynchronised writers on one unlocked
file — the two-writers window C is already holding this lap — and, decisively:

**a shared file's freshness would be maintained by whichever writer survived. A dead watcher plus
live hooks reads as perfectly healthy.** That is the 09-02 bug rebuilt inside the instrument meant
to detect it — the same error as stamping on write instead of on attempt, one level up.

**Join them at the reader, not at the file.** The delivery row already prints ready state and can
print harvest state beside it. Two files, one surface.

## 5 · WHAT I RAN

    harvest_guard.rs                      17 tests, 17 pass, 0 warnings
    MUTANTS (applied to a COPY in scratch; the real file was never mutated)
      1 restore Err(_) => break           RED   2 tests
      2 drop catch_unwind                 RED   3 tests
      3 stamp only on write               RED   4 tests   <- the one the packet said must be red
      4 never reinitialise                RED   1 test
      4 applied / 4 caught / 0 survivors

**Mutant 3 is the one that mattered and it is red for the right reason.** The tests that fail under
it include `a_quiet_pane_and_a_dead_thread_are_distinguishable_which_is_the_whole_point`, which
builds both and asserts they are identical by the record measure and separable by the attempt
measure. Under a write-log they become identical by both. **It is not a write-log.**

**The patch's SHAPE compiles.** The reader block, `harvest_once` and the watcher loop were compiled
verbatim against stubs mirroring `vt100`, `capture`, `EmuState` and the record helpers — which
proves the borrow, lifetime and unwind structure, in particular that `AssertUnwindSafe` accepts the
`&mut last` borrow across the closure. That was the only place gymnastics could have been needed,
and one wrapper covered it.

## 6 · NOT APPLIED — named, never counted as caught

- **The patch has not been compiled inside the crate.** That needs either editing C's file or a full
  Tauri dependency build; the first is forbidden this lap, the second did not fit in it. There is no
  `target/` on this machine, so it would have been a cold build of the whole tree. **C should
  `cargo check` before folding.** I would rather say this than let "shape compiles" read as "compiles".
- **Mutants 1 and 2 were applied to the POLICY, not to the watcher.** They prove `harvest_guard`
  behaves as specified; they do not prove `main.rs` calls it. Only the fold does that. The packet's
  mutants are stated against `main.rs` and at that level they are **NOT APPLIED**.
- **The watcher thread has never been exercised.** No pane has been harvested with this code.
- **I did not touch `capture.rs` or the extraction functions.** If the panic lives in
  `latest_turn`/`stitch`, this patch makes it survivable and visible — it does not fix it.

## 7 · I AM NOT CLAIMING THE STALL IS FIXED

**The separating observation is gone and I did not reconstruct it.** *Poisoned mutex, or panic in
the body?* — unseparated, and I have built for both: item 1 covers (a), item 2 covers (b). **I do
not know which it was and this hand-back does not guess.**

**The relaunch falsifier is not mine to claim.** All four `.txt` mtimes advancing within one settled
turn needs a rebuild and a relaunch, which is the keeper's hand.

**What would show it worked, in the order it becomes checkable:**

1. `data/harvest/<pane>.json` exists per live pane and its `at_ms` advances *while the pane is
   idle*. Checkable in seconds after relaunch, with no pane doing any work. A frozen `at_ms` while
   the app is up means the watcher is dead — and now it says so.
2. All four `.txt` mtimes advance within one settled turn. The packet's falsifier.
3. If a watcher dies again, `panics` and `last_panic` are populated. That is the 09-02 question
   answering itself next time instead of waiting on an observation nobody takes in time.

**The packet's own falsifier for this leg — *a watcher dies after this and nothing anywhere
changes* — is discharged only by (1).** Until a relaunch happens, it stands open.

## 8 · OWNERSHIP

Touched: `consonance/src-tauri/src/harvest_guard.rs` (new, mine),
`exo_memory/loop/patch_harvester_leg2_L043.md`, this file, `exo_memory/map/E.md`.
**Not touched:** `main.rs` (C), `cite-check.*` (A), `corpus-age.*` / `portable-paths.*` (B).
Mutation work was done on copies in the scratchpad — on a shared checkout, reverse the edit, never
restore the file. Nothing committed.
