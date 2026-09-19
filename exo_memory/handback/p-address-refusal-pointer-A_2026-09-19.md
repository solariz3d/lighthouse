# P-ADDRESS-REFUSAL-KEEPS-THE-POINTER · ALPHA — the address-table refusal of `call_librarian` keeps its pointer too

**Pane A, machine D, 2026-09-19 09:0x–09:2x.** Lap D078, chunk 1. Packet: `loop/plan_small_fixes_2_2026-09-19.md` @a5439e5,
the A row. It closes my own found-not-fixed item from D077 (`handback/p-refusal-keeps-pointer-A_2026-09-19.md` §5).
**One file, `consonance/src-tauri/src/mcp.rs`, +98 −1. Not committed, not rebuilt.** The gate's decisions are
unchanged: `auth_address`, `auth_station` and the address table are untouched.

    git diff -U0 -- consonance/src-tauri/src/mcp.rs | grep "^@@"      (HEAD a3e94fa; its commit did not touch mcp.rs)
      @@ -44,0 +45,12 @@    fn refused_address_row (:52) and the shared fn refused_row_labelled (:56), NEW
      @@ -53 +65 @@        the one line of D077's row that became the shared function's format (label passed in)
      @@ -779,0 +792,10 @@  the board_push on call_librarian's address-table branch (row built at :798)
      @@ -3019,0 +3042,75 @@ mod address_refusal_pointer_tests (:3045), NEW, 5 tests
    git diff --stat         1 file changed, 98 insertions(+), 1 deletion(-)

---

## 1 · WHAT IT DOES

The address-table branch now posts one row before its unchanged `return`:

    pane "chair", role "committee" — the same row family as the others
    call_librarian REFUSED (no address row) — the attempt, kept because a refused call is not delivered: mount M carried: <text>

- **The same row as D077's, built by the same code:** D077's body became `refused_row_labelled(label, who, text)`.
  `refused_attempt_row` and the new `refused_address_row` both call it and differ only in the label. So the bound
  (600 characters), the ` | ` for line breaks, and the "not kept" note are shared rather than copied.
- **Told apart in both directions:** the address row's label carries its cause, `(no address row)`, so it does not
  start with the out-of-turn row's `call_librarian REFUSED — the attempt`, and the out-of-turn row never says "no
  address row". **Neither matches `REFUSED OUT OF TURN — mount`**, C's refusal discriminator.
- **D077's row is byte-identical after the refactor.** A test pins its exact text.
- **The mount** is `self.identity` or `unattributed`, as `auth_address`'s own row names it.
- **Every refusal is posted, not through `refusal_should_post`,** for the D077 reason (the throttle would drop absorbed
  pointers). The flood trade is D077's: an unaddressed mount spinning on the verb writes one bounded row per attempt.
- **The returned text is byte-identical**, and its "(the attempt was posted to the board)" is now true of what the
  attempt carried.

---

## 2 · THE TESTS — `mod address_refusal_pointer_tests`, five

| test | holds |
|---|---|
| `an_address_refusal_row_carries_the_pointer_the_mount_and_its_cause` | path, NEXT line, `mount M`, "no address row"; no line break |
| `the_two_refusal_rows_are_told_apart_and_neither_reads_as_out_of_turn` | both directions, and neither contains `REFUSED OUT OF TURN — mount` |
| `an_address_refusal_row_is_bounded_like_the_other` | 600 kept of 610 multibyte characters, `+10` said |
| `the_out_of_turn_row_is_byte_identical_to_d077` | D077's row, exact string, after the refactor |
| `the_address_branch_posts_the_attempt_and_returns_the_same_text` | source ORDER in the real branch: `refused_address_row(&who, &text)` before the `return`, and the multi-line return exactly as before |

D077's five `refusal_pointer_tests` still pass. `an_admitted_call_does_not_post_the_row` still means what it did: the
out-of-turn row is built at one site only.

---

## 3 · BARS — the command beside every number

    RED FIRST (refused_address_row stubbed to "", the branch unwired; the refactor already in):
      cargo test --bin consonance refusal_pointer_tests -- --test-threads=1        7 passed · 3 failed · exit 101
        (the filter matches both modules: D077's 5 + the new 5)
        FAILED: …carries_the_pointer_the_mount_and_its_cause, …is_bounded_like_the_other, …the_address_branch_posts_…
        passed at red, and why:
          the_out_of_turn_row_is_byte_identical_to_d077 — a CONTROL: it must hold on both sides of the change
          the_two_refusal_rows_are_told_apart_… — VACUOUS at red (an empty row starts with nothing); mutants #1/#2 cover it
          D077's 5 — green through the refactor

    GREEN:
      cargo test --bin consonance refusal_pointer_tests -- --test-threads=1        10 passed · 0 failed
      cargo test --bin consonance mcp:: -- --test-threads=1                        78 passed · 0 failed   (73 + 5)
      cargo test --bin consonance brief -- --test-threads=1                        13 passed · 0 failed
      cargo test --bin consonance -- --test-threads=1                             782 passed · 1 failed · 4 ignored
        the 1: ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect (the known red)
      (cargo is C:\Users\nname\.cargo\bin\cargo.exe through PowerShell, cwd consonance/src-tauri)
      NB: B's brief/BUILDING.md edit was in the working tree for these runs (git status); `brief` is green with it.

    MUTANTS, on a COPY — a git worktree of HEAD with the working mcp.rs copied in and its own CARGO_TARGET_DIR, the live
    mcp.rs hashed before and after (scratchpad/address_pointer_mutants.js), scored with the refusal_pointer_tests filter:
      pre-flight, unmutated copy: green 10/0
      6 listed · 6 killed · 0 survived · 0 NOT APPLIED · live mcp.rs unchanged: true
        #1 the address row loses its cause                    …carries_the_pointer_the_mount_and_its_cause
        #2 the address label collides with the discriminator  …told_apart_and_neither_reads_as_out_of_turn
        #3 the address branch stops posting the attempt       …the_address_branch_posts_…
        #4 the address branch posts the out-of-turn row       …the_address_branch_posts_…, D077's an_admitted_call_…
        #5 the refusal text returned to the pane changes      …the_address_branch_posts_…
        #6 the refactor changes D077's out-of-turn row        …the_out_of_turn_row_is_byte_identical_to_d077
      #3–#5 are killed by source-order pins, not by driving the verb. The worktree was removed afterwards.

---

## 4 · CORRECTIONS

- **The harness's substring dirty-source check refused its first run, for the fifth lap running.** Mutant #4's
  replacement was a legitimate line in the out-of-turn branch. I made it unique (`&text.clone()`) and did not weaken the
  check. That check's limit is still unfixed in my tools, and at five occurrences it is worth fixing properly: compare
  the replacement against the anchor's own position, not the whole file.

---

## 5 · WHAT I DID NOT VERIFY

- **No live refusal.** The address branch fires only for a mount with no address row (the orchestrator, the librarian,
  human panes), and none was driven with this build — nothing is rebuilt. The row is tested as a function and the
  wiring by source order.
- **The two refusal rows now differ from D077 in one respect worth naming.** The D077 row is identified by the prefix
  `call_librarian REFUSED — the attempt`. Anything that counts kept attempts by the shorter `call_librarian REFUSED`
  will count both kinds. Nothing counts them yet; C's replay counts `auth_station`'s phrase, which neither matches.
- **The flood trade is unmeasured.**
- **Nothing on L; the composer red not re-run at HEAD this lap** (known from the record).

NEXT: librarian re-derive the bars and collate with B's brief when both D078 hand-backs are in
