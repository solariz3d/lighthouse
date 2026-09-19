# P-SECOND-INSTANCE-TEXT · ALPHA — the second-instance dialog no longer tells the keeper to use a window that may not exist

**Pane A, machine D, 2026-09-18 23:4x.** Lap D073, chunk 2. Packet: `loop/plan_small_fixes_2026-09-18.md` @f5fc793, the
Chunk 2 table. Finding: `handback/p-launch-ghost-E_2026-09-18.md` §3 (lines 98-104). **Text only, no probing. Nothing
committed, nothing rebuilt; it reaches the keeper at his next close and reopen of Consonance on D.**

**One file, `consonance/src-tauri/src/main.rs`, and only this function, its new helper and its test module:**

    git diff -U0 -- consonance/src-tauri/src/main.rs | grep "^@@"
      @@ -6510 +6510,13 @@ fn warn_second_instance() {
      @@ -6515,11 +6527,86 @@ fn warn_second_instance() {
    git diff --stat        1 file changed, 99 insertions(+), 12 deletions(-)

    fn warn_second_instance         :6507   the MessageBox call, now showing second_instance_message()
    fn second_instance_message      :6519   NEW, pure: (title, body)
    mod second_instance_tests       :6536   NEW, 6 tests
    fn main_intake                  :6616   (the next function, untouched)

`claim_single_instance`, its caller at `:11401` (unchanged) and every other line of `main.rs` are untouched. Every
changed line is ASCII (`git diff … | grep` for anything outside ` `–`~` found nothing).

---

## 1 · THE TEXT

**Before** (the last paragraph, old `:6515-6516`):

    Use the window you already have. To pick up new code, close it completely first, then launch once.

**After** — the first two paragraphs (the refusal and the two-MCP-servers reason) are **word for word unchanged**; the
last paragraph becomes two:

    If a Consonance window is open, use that one. To pick up new code, close it completely first, then launch once.

    If no Consonance window is open, give it a minute - a copy that is starting up or closing down has no window yet.
    If none appears, a copy is running with no window: open Task Manager, end consonance.exe, then launch once.

The title, `Consonance - already running`, is unchanged.

**It is true in both cases without knowing which it is in:** every sentence that mentions a window is conditional.

**One case beyond the packet's two, and why it is in the text.** The packet names *window visible* and *no window, a
ghost*. A copy that is **starting up or closing down** is also windowless for a moment. It is a real session, and
ending it in Task Manager would kill it. So the wait comes before the kill. The test pins that by order (§2), so a
later edit cannot drop it silently.

**A nuance from my own record, not a change to the bar:** this dialog appears only when the other copy **holds the
single-instance mutex**. The ghost of 2026-09-16 did **not** hold it: the keeper's launches at 08:40:29 and 08:48:14 ran
beside it (`handback/p-stick-zombie-A_2026-09-16.md` §3). So E's two-dialog sequence happens only with a ghost that
does hold the mutex. The text is written to be true either way, so this changes nothing in the build. It does narrow
when the keeper will ever see this dialog.

---

## 2 · THE TESTS — `mod second_instance_tests`, six, each pinning a shape rather than a token

| test | what it holds |
|---|---|
| `no_sentence_asserts_that_a_window_exists` | every sentence containing "window" starts with "If " |
| `the_windowless_case_names_task_manager_and_the_process` | the paragraph that speaks of no window names `Task Manager` AND `consonance.exe` |
| `ending_the_process_comes_after_a_wait` | in that paragraph, the wait comes **before** `end consonance.exe` (ORDER) |
| `the_two_mcp_servers_reason_is_kept` | `two instances mean two MCP servers`, and what they overwrite (`chair token`, `port config`) |
| `the_dialog_text_is_ascii` | title and body ASCII; the title unchanged |
| `the_dialog_shows_the_pinned_message` | WIRING, a source-text pin: `warn_second_instance` calls `second_instance_message()` and carries no copy of the words |

---

## 3 · BARS — the command beside every number

    RED FIRST — the body moved VERBATIM into second_instance_message(), the tests written, run against today's text:
      cargo test --bin consonance second_instance_tests -- --test-threads=1
        2 passed · 2 failed · exit 101
        FAILED no_sentence_asserts_that_a_window_exists            "this sentence states a window as a fact: \"Use the window you already have\""
        FAILED the_windowless_case_names_task_manager_and_the_process   "no paragraph addresses the case with no window"
        ok     the_two_mcp_servers_reason_is_kept    ← controls that must hold on both sides of the change
        ok     the_dialog_text_is_ascii

    GREEN — the new text (first 4 tests), then the wait-order and wiring pins added (6):
      cargo test --bin consonance second_instance_tests -- --test-threads=1     4 passed · 0 failed, then 6 passed · 0 failed

    THE BAR'S FILTERS, final state:
      cargo test --bin consonance second_instance_tests -- --test-threads=1     6 passed · 0 failed
      cargo test --bin consonance mcp:: -- --test-threads=1                    68 passed · 0 failed
      cargo test --bin consonance brief -- --test-threads=1                    13 passed · 0 failed
      cargo test --bin consonance -- --test-threads=1                         746 passed · 1 failed · 4 ignored
        the 1: ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect — the long-standing
        composer red, failing in every full run this seat has filed since 09-15; 746 + 1 + 4 = 751 = 745 existing + 6 new
      (cargo is C:\Users\nname\.cargo\bin\cargo.exe, run through PowerShell, cwd consonance/src-tauri)

    MUTANTS, on a COPY — a git worktree of HEAD in the scratchpad with the working main.rs copied in and its own
    CARGO_TARGET_DIR; scored with the second_instance_tests filter (scratchpad/second_instance_mutants.js):
      pre-flight, unmutated copy: green 6/0 in 29 s
      8 listed · 8 killed · 0 survived · 0 NOT APPLIED · live main.rs unchanged: true
        #1 THE DEFECT BACK: an unconditional "use the window you already have"   no_sentence_asserts_that_a_window_exists
        #2 the condition dropped from the first window sentence                   no_sentence_asserts_that_a_window_exists
        #3 Task Manager no longer named                                            windowless_case_names…, ending_the_process…
        #4 consonance.exe no longer named                                          windowless_case_names…, ending_the_process…
        #5 the two-MCP-servers reason removed                                      the_two_mcp_servers_reason_is_kept
        #6 a non-ASCII dash creeps into the text                                   the_dialog_text_is_ascii
        #7 the wait removed: the kill offered first                                ending_the_process_comes_after_a_wait
        #8 the dialog stops using the pinned text (the old words inlined back)     the_dialog_shows_the_pinned_message
      the worktree was removed afterwards (git worktree list shows only the checkout)

---

## 4 · CORRECTIONS, INCLUDING TO MYSELF

- **Designing the mutants found two holes in my first four tests,** before any mutant ran. Nothing held the wait
  before the kill, so #7 would have survived. Nothing checked that the dialog actually shows the pinned text, so #8
  would have survived: re-inlining a string would leave every test green over an untested dialog. Both are now pinned.
- **One assertion of mine was weaker than it looked.** The MCP-reason check accepted three spellings joined by `||`,
  and only one can occur, because Rust's `\` line continuation strips the next line's indentation. It is now one exact
  phrase. Fixed before green, so no run depended on it.
- **My mutant harness's anchor audit refused its own first run,** correctly. Mutant #8's anchor also appears in one of
  my tests, so it matched twice, and unaudited it would have mutated the test instead of the dialog. It is now a
  two-line anchor. The L061 R2 gate has now caught the harness's author three laps running.

---

## 5 · WHAT I DID NOT VERIFY

- **The dialog has not been shown.** No second instance was launched. The keeper's Consonance is live on D, and
  starting a second copy would put this dialog in front of him mid-session. The tests hold the text and the wiring; the
  rendered MessageBox — line breaks, width, how the paragraphs wrap — has not been seen.
- **Not rebuilt.** The change reaches anyone only at the keeper's next close and reopen, when `launch.ps1` rebuilds on
  newer sources.
- **The composer red was not re-run at HEAD this lap.** It is the same test, failing the same way, as in every full run
  since 09-15. It does not touch this function, but "pre-existing" here comes from the record, not from a fresh HEAD run.
- **"Give it a minute" is not measured.** Nothing on disk records how long a starting or closing Consonance stays
  windowless. The D066 grace for the applier's parent is 30 s, argued rather than measured. A minute is a reader's
  wait, not a timeout anything enforces.
- **Nothing on L.**

NEXT: librarian re-derive the bars and file chunk 2 when this hand-back is read
