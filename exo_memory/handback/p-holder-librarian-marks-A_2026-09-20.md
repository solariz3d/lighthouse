# P-HOLDER-LIBRARIAN-MARKS · ALPHA — the mark is written, nothing can read it, and the next row erases it

**Pane A, machine L, 2026-09-20 06:5x–07:1x.** Lap L065 packet D2. **One file, `consonance/src-tauri/src/mcp.rs`,
+137 −14** (`git diff --stat`; `main.rs` is C's this lap and I did not touch it). Not committed. I read `mcp.rs:82-120` first, as the packet required;
the proof there is good and **nothing below proposes a pre-condition gate.**

**Registered BEFORE running, with the quantity's range checked first:**
- **The null:** the mark machinery behaves the same when the holder is the librarian as when it is the chair.
- **Its falsifier:** a state where the same marks render a different message, or none, because of who holds.
- **The quantity can take more than one value:** whether `handback_refusal_text` reaches its trap branch under
  holder == librarian. It CAN (a second open lap held by the chair — `with_a_second_lap_held_by_the_chair_the_trap_branch_is_reachable`)
  and DOESN'T in tonight's one-lap shape. Checked before the finding was claimed, so the claim is about a shape and not
  about a constant.

**The null is FALSIFIED.**

---

## 1 · Q1 — DOES IT FIRE AT ALL WHEN THE HOLDER IS THE LIBRARIAN? The mark fires; every reader is blind

**The OWED mark IS written.** `mark_owed(&who, now_ms())` sits in `call_librarian`'s station-refusal arm (`mcp.rs:850`)
and is unconditional on who holds. Tonight's row is the proof it ran:

    02:17:26 [chair] call_librarian REFUSED OUT OF TURN — mount C tried to speak while NO open lap is held by
             panes; open laps are held by ["librarian"] (newest: lap L060, holder librarian)

**But nothing can read it in that state, and here is each reader:**

1. **The chair-side debt gate is unreachable.** `owed_handback_refusal` (`:573`) is called from ONE place:
   `chair_inject`. In `chair_inject` the order is `auth_chair` → **`auth_station("chair_inject")`** → the debt gate. With
   the librarian holding and no open lap held by the chair, the chair's inject is refused OUT OF TURN *before* the debt
   gate is reached. **The chair is never shown the debt it exists to show.**
2. **The pane-side trap branch is unreachable in the one-lap shape.** `handback_refusal_text` (`:198`) takes
   `(baton_at, marks, lap)` — **no holder, by construction.** Its only discriminator is a RUNG mark newer than the
   newest open row, and `mark_rung` is written in exactly one place: `chair_inject` after a successful delivery
   (`:563`). With one open lap held by the librarian, a successful `chair_inject` is impossible *after* the librarian's
   row, so every RUNG mark necessarily predates it and `mark_stands` is false. The pane therefore gets the ordinary
   sentence — *"The loop comes back to you; do not queue, do not retry in a spin."*

   **That is what happened.** The board at 02:17:40, mount C: *"My call_librarian just refused OUT OF TURN (holder:
   librarian); not retrying, not queueing"*; and a sibling at 02:17:32: *"Not retrying; the loop comes back."* Two seats
   repeated the sentence the L050 comment calls the FALSE one.
3. **And the next row erases the mark.** `mark_stands` is `mark_at >= baton_at`, so **every** baton row clears a debt,
   not only the row that opens the panes. Tonight: the librarian took L060 at **02:16:13**, C was refused at
   **02:17:26**, and the chair moved L060 librarian → chair at **02:17:37** — eleven seconds later. That row cleared the
   OWED mark and left C exactly as unable to speak as before. Pinned now by
   `any_baton_row_clears_the_debt_even_one_that_does_not_open_the_panes`.

**So: written, never read, then erased.** Ledger rows and board rows are from `C:\Consonance\data\lap.jsonl` and
`board.jsonl`, read with `node -e` (times rendered in America/Regina; the packet's 08:16/08:17:26 are the same instants
in UTC).

**The one honest widening:** this is about the SHAPE, not about the librarian as such. With several open laps and one
held by the chair, `station_allows` admits `chair_inject` (L040's any-holder rule), a RUNG mark can be stamped after the
librarian's row, and the trap branch fires normally. Seventeen laps read as open at 02:17:26 (L008–L023 are holderless
legacy rows, which is why the refusal's holder set was just `["librarian"]`) — holderless laps contribute nothing, so
the one-lap shape is what actually obtained.

## 2 · Q2 — IS THE RECOVERY CORRECT? No, in two ways, and both are repaired here

`owed_refusal_text` printed `move_baton_cmd(lap, "chair")` and said *"because the baton is at the chair and
call_librarian requires panes."*

1. **It asserted a holder it never read.** The function's arguments were `(baton_at, marks, lap)`; "the baton is at the
   chair" was true of the state L050 was written in and was never checked. In the multi-lap case above it can render
   while the newest lap is held by the librarian, and then the sentence is simply false.
2. **The lap it names is the NEWEST open lap, not the lap the chair rang on** (`chain_state().lap`). Under several open
   laps that can be another holder's lap — and `--by chair` on a lap the chair never rang on is refused by `lap-row.js`'s
   ring gate, so the printed recovery fails. **This is L040's own defect in the one place its fix was not applied:** the
   comment at `mcp.rs:779-783` describes fixing exactly this in `auth_station`'s board row, and this function kept it.

**Repaired, text only — no gate decision changes:**
- it prints the holder set it was given (`the baton is at: librarian`), or `no open lap names a holder`;
- it prints the pane's **RETAKE** as a second move (`--holder panes --by panes`), which `lap-row.js` allows with no
  ring, so the recovery still lands when `--by chair` is refused for want of one — the pane-facing text has carried both
  since L050 and this one carried only the chair's;
- when other laps are open it says so, and says the named lap is the newest row's, not necessarily the one rung on;
- it now states that **any** row clears the mark, including one that does not open the panes.

`owed_handback_refusal` passes `crate::chain_holders()` and `st.also_open`, the two facts already on hand.

## 3 · Q3 — NAMED ONLY, AS INSTRUCTED: the marks do NOT cover it

The `handbacks-in` stage asserts every hand is in; a pane still appending is the case where that assertion is false, and
the stage makes the pane unable to say so. **Nothing in the mark machinery covers it:**
- the OWED mark is the only trace, and §1 shows it is unreadable in that state and erased by the next row;
- the pane is told the opposite of the truth;
- the chair is shown nothing;
- the librarian, having declared handbacks-in, has no surface that contradicts it.

**I have designed nothing for this and propose nothing.** Two facts a designer will want: the pane's RETAKE is legal in
this state and is not printed to it (it is behind the RUNG branch); and the OWED mark is the only artifact that exists
at the moment the false assertion is made.

## 4 · BARS — the command beside every number

    (cargo is C:\Users\zackn\.cargo\bin\cargo.exe through PowerShell, cwd consonance/src-tauri)

    RED FIRST (the signature widened, the old text kept):
      cargo test --bin consonance mcp::tests:: -- --test-threads=1      32 passed · 5 failed · exit 101
        the 5: says_where_the_baton_actually_is, a_ledger_that_names_no_holder…, also_prints_the_retake…,
               warns_when_the_lap_it_names…, and the_pane_facing_refusal_is_holder_blind… (that last one was MY test
               being wrong — see §5)
        TWO of my seven were green at red ON PURPOSE: any_baton_row_clears_the_debt… and
        with_a_second_lap_held_by_the_chair… pin EXISTING behaviour as findings, not repairs.

    GREEN, plain and serial:
      cargo test --bin consonance mcp::tests:: -- --test-threads=1      37 passed · 0 failed
      cargo test --bin consonance mcp:: -- --test-threads=1            101 passed · 0 failed
      cargo test --bin consonance -- --test-threads=1                  826 passed · 0 failed · 4 ignored
      cargo test                        (plain, all targets)           826 passed · 0 failed · 4 ignored on the bin
        NB: the L062 shelf red is GONE — `shelf_tests::the_librarian_intake…` passes now that L062 landed.

    ONE RED IN THE PLAIN RUN, AND IT IS NOT MINE: tests/arch_test.rs, 11 passed · 1 failed —
      `every_named_record_file_exists_and_every_record_file_is_named`:
      "record/retired_seats_2026-09-11.md is named by no card". Its ONLY inputs are two directories
      (`arch_test.rs:517-518`: `../../exo_memory/cards` and `../../exo_memory/record`), and
      `git status --short -- exo_memory/record .consonance consonance/src-tauri/cards` is EMPTY — both are
      byte-identical to HEAD, so it is red at HEAD. No build was needed to show it and none was run.

    MUTANTS — consonance/tools/mutant-harness.js on a COPY (worktree of HEAD, live mcp.rs copied in, own
    CARGO_TARGET_DIR, live file hashed before and after), scored on mcp::tests::
      node consonance/tools/mutant-harness.js <scratchpad>/holder_rows.js
      FIRST RUN: 9 listed · 8 killed · 1 SURVIVED · 0 no result · 0 not applied
        #1 "the holder is asserted again instead of read" SURVIVED — see §5.
      FINAL RUN: pre-flight green 37/0 · **9 listed · 9 killed · 0 survived · 0 no result · 0 NOT APPLIED** ·
                 live mcp.rs unchanged: true
        #1 the holder is asserted again instead of read      #6 the multi-lap warning always fires
        #2 an unknown holder is guessed as the chair         #7 a later baton row stops clearing the debt
        #3 the retake prints --by chair (needs a ring)       #8 the OWED mark stops being written at the refusal
        #4 the reason the retake is legal is dropped         #9 the pane-facing two-silence split is lost
        #5 the multi-lap warning never fires
        #8 and #9 are on the machinery this packet is ABOUT, not on the text I changed: they prove the mark is still
        written by the refused hand-back, and that the two silences are still told apart.

## 5 · CORRECTIONS, INCLUDING TO MYSELF

- **My holder-blind test used the wrong instrument and went red for the wrong reason.** It searched
  `handback_refusal_text`'s BODY for "holder" — and the body prints `--holder panes` inside the retake it hands the
  pane. It now pins the SIGNATURE, which is the thing that makes the function holder-blind.
- **Mutant #1 survived the first run because my assertion was weak in a familiar way:** `t.contains("librarian")` is
  satisfied by the words *call_librarian* already in the sentence. Tightened to the rendered clause
  `"the baton is at: librarian"`, and the mutant dies. Same class as D076's anchor-matching-itself.
- **A mutant anchor matched twice** (`pane_cmd = move_baton_cmd(lap, "panes"),` occurs in both refusal texts). The
  harness's R2 gate refused the run before anything was mutated; the anchor now carries the preceding line.
- **Five existing test call sites were updated mechanically** for the widened signature (`&[], 0`). No existing
  assertion was weakened or removed, and the two that pin the old wording (`--holder panes --by chair`, "who is owed")
  still pass unchanged.

## 6 · WHAT I DID NOT VERIFY

- **No live run.** Nothing is rebuilt, so no seat has seen the new recovery text; the running app still prints the old
  one. The repair is tested as a pure function.
- **Tonight's sequence was not replayed** through the code. The 02:16:13 / 02:17:26 / 02:17:37 chain is read off
  `lap.jsonl` and `board.jsonl`; the inference that C's message came from the ordinary branch rests on the code path in
  §1 plus C's own quoted words, not on a captured return value.
- **`lap-row.js`'s ring gate was not re-read this lap.** The claim that `--by chair` needs a ring and `--by panes` does
  not is taken from this file's own L050 comments and the existing test `the_trapped_pane_is_handed_its_own_legal_exit`.
- **The multi-lap reachability is asserted at the pure-function level**, not by driving two open laps through
  `chain_state`.
- **Nothing on D**, and no board row was observed being written by the new text.
- **Q3 is named and not designed**, as the packet required.

NEXT: librarian re-derive §1's three code sites and tonight's three ledger rows, and rule on whether Q3 gets its own packet, when the file is read
