# P-SUGGESTION-OFF · ALPHA — every seat Consonance spawns now starts with prompt suggestions off; D074's no-readings row stops claiming a sighting

**Pane A, machine D, 2026-09-19 02:3x–03:0x.** Lap D076. The switch is B's (`handback/p-suggestion-switch-B_2026-09-19.md`),
and the keeper's yes is on file (`librarian/2026-09-16.md` 02:25, commit 02bcfbf: *"okay lets do it"*, asked what it turns
off, Main included; 02:27 carries his clarifier, *"remove the grey autofill in the text boxes"*). **One file:
`consonance/src-tauri/src/main.rs`. Not committed, not rebuilt: it reaches a seat at the keeper's next close and reopen
on D, and every pane respawned after that.**

    git diff -U0 -- consonance/src-tauri/src/main.rs | grep "^@@"      (against HEAD 7cd755f)
      @@ -975,0 +976,64 @@     fn suppress_prompt_suggestions (:989) and mod suggestion_off_tests (:994), NEW
      @@ -1071,0 +1136,3 @@    the call in spawn_claude_pane (:1138), after CLAUDE_CODE_FORCE_SESSION_PERSIST
      @@ -9223 +9290,2 @@      the D074 arm's comment
      @@ -9225 +9293 @@        the D074 arm's text
      @@ -15487 +15555 @@      the one existing test that pinned the old text
    git diff --stat           1 file changed, 71 insertions(+), 3 deletions(-)

---

## 1 · THE SWITCH

    fn suppress_prompt_suggestions(cmd: &mut CommandBuilder) {
        cmd.env("CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION", "false");
    }

It is called at `:1138` in `spawn_claude_pane`, beside the other `cmd.env` lines, after `CLAUDE_CODE_FORCE_SESSION_PERSIST`
and before `spawn_command`. Its doc comment cites B's hand-back §2 and quotes the keeper's 2026-09-07 words from `typed_only`
(*"the greyed out text prediction! If it spawns in the bar, it stops the loop"*). It also records that the switch reaches
Main, and that he chose it knowing that. A one-line comment at the call site points to the doc.

**A deviation from bar 1's letter, and why.** Bar 1 says "add `cmd.env(...)` at the seat spawn". The `cmd.env` line sits in
a one-line helper called at the spawn. Put inline, it could only be pinned by reading the source text: the spawn
function's `CommandBuilder` is consumed by a real PTY, so no test can reach it. **`CommandBuilder` CAN be inspected** —
portable-pty 0.8.1 has `get_env` (`~/.cargo/registry/src/…/portable-pty-0.8.1/src/cmdbuilder.rs:322`). So the helper is
tested on a real `CommandBuilder`, and a separate pin holds that the spawn calls it in the right place. That is bar 2's
first route, not its fallback: the env list did not need to move, and the existing lines are untouched.

**The environment variable, not the setting:** per B, it takes precedence over every settings file and reaches only
processes Consonance spawns. The keeper's terminal sessions are untouched.

---

## 2 · D074's RESIDUE — the arm that asserted what it did not read

**Before** (`delivery_note_with`, the `(Some(Forced::SignalOutranked), None)` arm):

    [stamp=ready] (FORCED after the bounded hold — the pane's own signal said ready; its composer never cleared)

**After:**

    [stamp=ready] (FORCED after the bounded hold — the pane's own signal said ready; its composer did not read empty,
    and no readings were recorded)

**Why "never cleared" was false in this arm:** the gate forces `SignalOutranked` whenever the composer did not read empty.
That includes not finding the composer at all — `input_box_empty`'s unknown-holds rule, documented in `typed_only`'s
doc. With no readings recorded, the row cannot tell "text sat there" from "nothing could be read". The new text keeps
the fact it has, that the stamp said ready, and says what is missing.

**The arm with readings, and the log line at `:9348`, were already honest.** Both go through D074's `composer_verdict`,
which says "never read" when nothing was read. Unchanged.

**One existing test moved with the text:** `ready_signal_tests::no_two_forcing_causes_read_alike` asserted
`has("composer never cleared")` as "the keeper-outranks case must be nameable". It now asserts `has("composer did not
read empty")`. Its purpose is unchanged — the case must stay nameable and distinct from the other causes — and the token
it pinned was the false claim. **Not changed, and none of them prints:** the `Forced::SignalOutranked` variant's doc
comment (`:9052`, "the composer never cleared") and two test doc comments that quote the old board row as history
(`:15826`, `:16277`).

---

## 3 · THE TESTS — `mod suggestion_off_tests`, three

| test | what it holds |
|---|---|
| `a_seat_command_carries_prompt_suggestions_off` | on a real `CommandBuilder`, `get_env("CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION") == Some("false")` |
| `the_seat_spawn_applies_it_before_the_command_is_spawned` | in `spawn_claude_pane`, the call comes BEFORE `spawn_command(cmd)`, and nothing between them clears the environment or sets the variable again (ORDER) |
| `an_outranked_hold_with_no_readings_claims_nothing_it_did_not_read` | the no-readings row has no "never cleared", keeps "signal said ready", and says "no readings" |

---

## 4 · BARS — the command beside every number

    RED FIRST (helper stubbed to set nothing, no call at the spawn, the arm unchanged):
      cargo test --bin consonance suggestion_off_tests -- --test-threads=1
        first run:  1 passed · 2 failed   ← the wiring test PASSED WITH NO WIRING (§5); fixed before going on
        second run: 0 passed · 3 failed · exit 101, each for its own reason:
          "a seat must be spawned with prompt suggestions switched off"   (left: None)
          "the seat spawn never applies the switch"
          "the row asserts a sighting it does not have: [stamp=ready] (… its composer never cleared)"

    GREEN:
      cargo test --bin consonance suggestion_off_tests -- --test-threads=1       3 passed · 0 failed
      cargo test --bin consonance mcp:: -- --test-threads=1                     68 passed · 0 failed
      cargo test --bin consonance brief -- --test-threads=1                     13 passed · 0 failed
      cargo test --bin consonance -- --test-threads=1                          772 passed · 1 failed · 4 ignored
        the 1: ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect (the known red)
        772 ≥ 769, the bar; 772 + 1 + 4 = 777 = 774 existing + 3 new
      (cargo is C:\Users\nname\.cargo\bin\cargo.exe through PowerShell, cwd consonance/src-tauri)

    MUTANTS, on a COPY — a git worktree of HEAD with the working main.rs copied in and its own CARGO_TARGET_DIR (scratchpad/
    suggestion_off_mutants.js), scored on BOTH modules the change touches, with the known red skipped by name:
      cargo test --bin consonance -- suggestion_off_tests ready_signal_tests --skip a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect
      pre-flight, unmutated copy: green 32/0 in 20 s
      9 listed · 9 killed · 0 survived · 0 NOT APPLIED · live main.rs unchanged: true
        #1 the switch set to "true"                       a_seat_command_carries_prompt_suggestions_off
        #2 the variable misspelled (plural)               a_seat_command_carries_prompt_suggestions_off
        #3 the helper sets nothing                        a_seat_command_carries_prompt_suggestions_off
        #4 the seat spawn never calls it                  the_seat_spawn_applies_it_before_the_command_is_spawned
        #5 the environment cleared after the switch       the_seat_spawn_applies_it_before_the_command_is_spawned
        #6 the variable set back on after the switch      the_seat_spawn_applies_it_before_the_command_is_spawned
        #7 "never cleared" restored with no readings      no_two_forcing_causes_read_alike + an_outranked_hold_…
        #8 the no-readings admission dropped              an_outranked_hold_with_no_readings_claims_nothing_it_did_not_read
        #9 the stamp's fact dropped                       an_outranked_hold_with_no_readings_claims_nothing_it_did_not_read
      the worktree was removed afterwards (git worktree list shows only the checkout)
      #4–#6 are killed by a SOURCE-ORDER pin, not by a running spawn: the spawn needs a real PTY and claude.

---

## 5 · CORRECTIONS, INCLUDING TO MYSELF

- **My wiring test passed with no wiring, on the red run.** Its anchor, the literal `"fn spawn_claude_pane("`, first
  occurs INSIDE the test itself, which sits above the real function. So `split(…).nth(1)` read the test's own text and
  found its own needles. Fixed with `concat!`, the idiom this file already uses for exactly this (`concat!("fn
  leave_run", "(")`); the next red run was 0/3. **The red-first step is what caught it. Written green-first, this test
  would have shipped non-discriminating.** It is the D066 lesson — a comment that trips the sweep it describes — met a
  third time in a new form.
- **My mutant harness nearly scored every mutant as killed.** `ready_signal_tests` contains the known red. Scored as
  derived, the pre-flight would be red on the unmutated copy, and the harness would refuse — but only because the
  pre-flight exists. Fixed with `--skip` on the known red by name; the pre-flight then ran green, 32/0.
- **The substring dirty-source check refused a replacement of mine for the fourth time** (`See the fn.\n`, a prefix of its
  own anchor). Fixed with a unique replacement. The limit in the check is still unfixed and it keeps costing a run.
- **One regex in the derived harness came out malformed** from a shell substitution (`([:\w+)`). `node --check` passed it
  as a string, and it would have failed at the first match. Rewritten with the edit tool before any run used it.

---

## 6 · WHAT I DID NOT VERIFY

- **No seat was spawned with this build.** Nothing was rebuilt or relaunched. B proved the variable live on throwaway
  sessions (§2 of B's hand-back). That a real seat — with `--resume`, `--dangerously-skip-permissions` and an MCP mount —
  honours it is B's §4 open item, and still open. The first relaunch is the first real run.
- **Existing seats keep suggestions until they respawn.** The variable is read at process start. A seat already running
  is unaffected until the keeper's close and reopen (or that pane's respawn).
- **Not measured: whether the forced-delivery count falls.** That is the plan's falsifier, and C's census over a day after
  the relaunch is its instrument.
- **The spawn-side wiring is held by source order, not by running the spawn** (#4–#6 above).
- **The composer red was not re-run at HEAD this lap.** It fails in every full run I have filed since 09-15 and does not
  touch these lines; "known" comes from the record.
- **Nothing on L.** L's exe needs the same rebuild.

NEXT: librarian re-derive the bars and file D076 when this hand-back is read
