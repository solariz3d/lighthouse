# P-REFUSAL-KEEPS-THE-POINTER · ALPHA — a refused `call_librarian` now leaves its pointer on the board

**Pane A, machine D, 2026-09-19 07:4x–08:1x.** Lap D077, chunk 1. Packet: `loop/plan_return_leg_2026-09-19.md` @aaf0aba,
the A row. Case: C's §2 in `handback/p-return-leg-C_2026-09-16.md` (read at source). **One file, `consonance/src-tauri/src/mcp.rs`,
+112 −0. Not committed, not rebuilt: it reaches a seat at the next close and reopen of Consonance on D.** The gate's
decision is unchanged in every case: `auth_station`, `required_station` and `station_allows` are untouched.

    git diff -U0 -- consonance/src-tauri/src/mcp.rs | grep "^@@"      (against HEAD aaf0aba)
      @@ -31,0 +32,24 @@       REFUSED_ATTEMPT_MAX_CHARS (:35) and fn refused_attempt_row (:44), NEW
      @@ -765,0 +790,10 @@     the board_push in call_librarian's out-of-turn branch (row built at :796)
      @@ -2907,0 +2942,78 @@   mod refusal_pointer_tests (:2946), NEW, 5 tests
    git diff --stat           1 file changed, 112 insertions(+)

---

## 1 · WHAT IT DOES

On the out-of-turn branch, after `mark_owed` and before the unchanged `return`, the branch now posts one board row:

    pane "chair", role "committee" — the same row family as auth_station's
    call_librarian REFUSED — the attempt, kept because a refused call is not delivered: mount A carried: <the text>

- **The text is kept as sent**, trimmed, with line breaks turned into ` | ` so the NEXT trailer stays readable in one
  row. It is **bounded at 600 characters, counted in characters not bytes.** A longer attempt keeps 600 and says
  `… [+N chars not kept]`.
- **The label is deliberately not `REFUSED OUT OF TURN — mount`.** That phrase is `auth_station`'s own row, and C's
  replay counts refusals by it (the plan's discriminator: `pane == "chair"` and `REFUSED OUT OF TURN — mount`). Reusing
  it would double every count. A test holds that. C's replay will see this row as a new, separate row, and should.
- **Posted on every refusal, NOT through `refusal_should_post`.** That throttle keeps one `auth_station` row per verb per
  minute. An absorbed refusal would lose exactly the pointer this row exists to keep. The bound replaces the throttle.
  **The trade, named:** a pane that spins on `call_librarian` now writes one bounded row per attempt, where before it
  wrote at most one per minute. The refusal text already tells panes *"do not queue, do not retry in a spin"*.
- **The sentence "the attempt was posted to the board"** in `handback_refusal_text` (the text returned to the refused
  pane) is now true of what the attempt carried, not only that it happened. The returned text is byte-identical;
  a test pins that the branch still ends in `self.out_of_turn_handback_message()`.

---

## 2 · THE TESTS — `mod refusal_pointer_tests`, five

| test | holds |
|---|---|
| `a_refused_attempt_row_carries_the_pointer_and_the_mount` | the path, the NEXT line, `mount A`, the `call_librarian REFUSED` label; no line break in the row |
| `a_long_attempt_is_bounded_and_the_row_says_how_much_was_dropped` | multibyte input (`é` × 850): exactly 600 kept, `+250` said; a short one is not marked cut |
| `the_row_is_not_counted_as_another_out_of_turn_refusal` | the row does not contain `REFUSED OUT OF TURN — mount` |
| `the_refusal_branch_posts_the_attempt_and_returns_the_same_text` | source ORDER in the real branch: `refused_attempt_row(&who, &text)` before the `return`, and the return line exactly as before |
| `an_admitted_call_does_not_post_the_row` | the row is built at one site only in `call_librarian`, and that site is in the refusal branch |

The wiring tests read the source (the branch needs a live chain state to reach). Their anchors are built with
`concat!`, so they cannot match their own text — the D076 lesson.

---

## 3 · BARS — the command beside every number

    RED FIRST (the function stubbed to return "", the branch unwired):
      cargo test --bin consonance refusal_pointer_tests -- --test-threads=1        1 passed · 4 failed · exit 101
        the 1 pass: the_row_is_not_counted_… — VACUOUS at red (an empty row matches nothing). It is covered by mutant #6
        below, which gives the row the colliding label and turns that test red.

    GREEN:
      cargo test --bin consonance refusal_pointer_tests -- --test-threads=1        5 passed · 0 failed
      cargo test --bin consonance mcp:: -- --test-threads=1                        73 passed · 0 failed   (68 + 5)
      cargo test --bin consonance brief -- --test-threads=1                        13 passed · 0 failed
      cargo test --bin consonance -- --test-threads=1                             777 passed · 1 failed · 4 ignored
        the 1: ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect (the known red)
        777 + 1 + 4 = 782 = 777 existing + 5 new
      warnings: the only mcp.rs warning is the pre-existing `tool_router` field (:299)
      (cargo is C:\Users\nname\.cargo\bin\cargo.exe through PowerShell, cwd consonance/src-tauri)

    MUTANTS, on a COPY — a git worktree of HEAD with the working mcp.rs copied in and its own CARGO_TARGET_DIR; the live
    mcp.rs hashed before and after (scratchpad/refusal_pointer_mutants.js), scored with the refusal_pointer_tests filter:
      pre-flight, unmutated copy: green 5/0
      8 listed · 8 killed · 0 survived · 0 NOT APPLIED · live mcp.rs unchanged: true
        #1 the row drops the pointer                              a_refused_attempt_row_carries_…, a_long_attempt_is_bounded_…
        #2 the row drops the mount                                a_refused_attempt_row_carries_…
        #3 the bound removed                                      a_long_attempt_is_bounded_…
        #4 the bound off by one                                   a_long_attempt_is_bounded_…
        #5 line breaks kept in the row                            a_refused_attempt_row_carries_…
        #6 the label collides with the refusal discriminator      the_row_is_not_counted_…
        #7 the refusal branch stops posting the attempt           the_refusal_branch_posts_…, an_admitted_call_…
        #8 the refusal text returned to the pane changes          the_refusal_branch_posts_…
      #7 and #8 are killed by the source-order pins, not by driving the verb.
      the worktree was removed afterwards (git worktree list shows only the checkout)

---

## 4 · CORRECTIONS, INCLUDING TO MYSELF

- **Two of my first mutants did not compile.** Their replacements passed a named format argument that nothing used,
  which rustc rejects. The harness scored them NO RESULT, **not killed**, as it is built to. Rewritten to compile; the
  second run is the figure above.
- **One mutant anchor was wrong in my list**, not in the source (the line is `let kept = if n > …`). The harness's anchor
  audit refused before anything was mutated.
- **The red run had one vacuous pass**, stated in §3 rather than counted as a real control.

---

## 5 · FOUND, NOT FIXED — outside this packet's branch

**The address-table refusal in the same verb also discards `text`.** At `:781`,
`refused: no address row from this mount's seat to the librarian (the attempt was posted to the board)` returns
without reading the text, and `auth_address`'s own row carries no payload. That is the same overstated sentence one
branch up. It fires only for a mount with no address row — the orchestrator, the librarian, human panes — which by
design should not be handing back. So it is lower-stakes, and the packet named the out-of-turn branch. **One line, if
the chair wants it.**

---

## 6 · WHAT I DID NOT VERIFY

- **No real refusal was produced.** The row is tested as a pure function and its wiring by source order. No pane was
  refused out of turn with this build, because nothing is rebuilt. **The plan's falsifier is the live check:** the next
  refused `call_librarian` on either machine must leave a row from which the pointer can be read.
- **C's replay was not re-run against the new row.** The label was chosen, and tested, not to match the discriminator
  quoted in the plan. I did not open C's replay code (C is read-only this lap), so whether C's actual filter is exactly
  that phrase is taken from the plan.
- **The flood trade is unmeasured** — how many rows a spinning pane would write.
- **The composer red was not re-run at HEAD this lap**; known from the record.
- **Nothing on L.**

NEXT: librarian re-derive the bars and collate with C's replay when both D077 hand-backs are in
