# P1b · RESUME THE CONVERSATION — the measurement, and the reversal it earned. D059, pane E.

**Verdict in one line: the 2026-07-11 decision rested on a premise that no longer holds on 2.1.269,
the reversal is landed with its fallback, and the fallback is only buildable because the refusal is
caught at the one place the app can still see it.**

Nothing committed. Files touched: `consonance/src-tauri/src/main.rs` only.

---

## 0 · WHAT THIS ANSWERS, AND WHAT IT DOES NOT

| question | answer |
|---|---|
| Does the current vendor lose a hard-killed session's transcript? | **No.** 36 completed turns over 12 trials in 4 cells, every one on disk. |
| Does it lose a turn that was IN FLIGHT at the kill? | **Yes, and only that one** — graded by how long it had been running. |
| Does `--resume` bring the real conversation back? | **Yes.** 4/4, the old turns rendered with their original timestamps. |
| Is a refusal detectable? | **Yes — but not by anything `spawn_claude_pane` keeps.** §4. This is the finding. |
| Should the app stop hard-killing panes instead? | **Not on this evidence.** §8. |

**This does not establish** that a present-but-CORRUPT transcript resumes (never trialled, §9), nor
that the landed code works in the app — it has never run there (§9), and the keeper's rebuild is
what would say.

---

## 1 · THE VERSION, AND THE KILL

    claude --version                                    ->  2.1.269 (Claude Code)

The packet said 2.1.266. That figure was inherited from C's hand-back and passed on unmeasured; the
one above is the measured one. **The recorded decision was taken against 2.1.207, so the gap is
sixty-two vendor patch versions, not three.**

**The kill is a true hard kill, traced rather than assumed:**

    pty_kill (main.rs:7419)  ->  s.killer.kill()
      ->  portable-pty 0.8.1  src/win/mod.rs:72  ->  TerminateProcess(handle, 1)

No signal, no flush, no cleanup — semantically identical to `taskkill /F`. The probe below makes
**the same two calls this app makes**: `native_pty_system().openpty(34x120)` +
`slave.spawn_command(...)` to start, `child.clone_killer().kill()` to end. It is not a kill *like*
the app's; it is the app's, through the same crate.

    C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-07b8a48f\
      a2122153-a37e-41a6-a86f-534267ec0565\scratchpad\p1b\        <- probe, checker, runner, screens

**And the probe reads nothing but PTY BYTES to decide a turn finished**, so the measurement cannot
presuppose the thing it measures.

---

## 2 · THE NUMBER

Each trial: spawn a scratch session in a scratch cwd with a scratch id, drive N turns each of which
must echo a unique nonce, hard-kill, then read the transcript with **one checker used identically
for every cell and both controls** (`check.js`).

    # one trial
    powershell -File <p1b>\run-cell.ps1 -Mode drive -Turns 2 -Delay 0 -Tag S2D0N1
    # the ledger every row below re-derives from
    node -e "require('fs').readFileSync('<p1b>/results.jsonl','utf8')"

| cell | N | completed turns | verdict |
|---|---|---|---|
| kill ~1.2 s after the last turn settled, 2 turns | 3 | 6 | 3/3 ALL_TURNS_PRESENT |
| kill ~2.2 s after, 2 turns | 3 | 6 | 3/3 ALL_TURNS_PRESENT |
| kill ~6.2 s after, 2 turns | 3 | 6 | 3/3 ALL_TURNS_PRESENT |
| kill ~1.2 s after, **6 turns** (volume axis) | 3 | 18 | 3/3 ALL_TURNS_PRESENT |

**12 trials, 36 completed turns, zero lost.** No trial was VOID and no turn timed out.

### 2.1 · THE POSITIVE CONTROLS — without these the table above is worth nothing

    node check.js 00000000-0000-4000-8000-000000000000 PCA-1-00000000
      -> {"found":0,"verdict":"ABSENT"}
    run-cell.ps1 -Mode killearly -Turns 2 -Delay 0     -> ABSENT
    run-cell.ps1 -Mode killearly -Turns 2 -Delay 3000  -> ABSENT

Three runs where the turns are known absent, and the same procedure reported absence in all three.
**A test that cannot fail did not pass.**

**And the checker had a hole that would have made "nothing was lost" unfalsifiable.** Its verdict
was `Object.values(nonces).every(v => v === 'UA')`, which is **vacuously true on an empty nonce
list** — hand it a run it never examined and it returns a clean pass. Guarded before any control was
run (`check.js:42-44`, `NO_NONCES_SUPPLIED -- CANNOT MEASURE`). The controls derive the nonces the
run *would* have produced, so a control asks the checker the same question a real cell does.

### 2.2 · THE SHARPEST CELL, and a second positive control inside one transcript

Whole-file ABSENT is a weak control: it cannot show the checker telling a survivor from a casualty.
So: drive 2 turns to completion, submit a 3rd, and kill while it is still streaming — **the
production shape**, since the app's kill lands whenever the app closes.

| kill lands after submitting turn 3 | turns 1–2 | turn 3 (in flight) |
|---|---|---|
| ~0.4 s | **present** 2/2 | `--` neither prompt nor reply |
| ~2.4 s | **present** 2/2 | `U-` **the prompt is on disk, the reply is not** |
| ~5.4 s | **present** 2/2 | `UA` the turn had finished in time |

**This is the whole answer to "is there a lazy-flush window", and it is graded.** The vendor writes
each record as it completes: the user record lands within ~2 s of submission, the assistant record
when the turn ends. Completed work is never waiting in a buffer. **What a kill destroys is a turn
that was never on disk to lose.**

---

## 3 · DOES `--resume` ACTUALLY COME BACK

    ptyprobe.exe resume <cwd> <sid>

| | trials | result |
|---|---|---|
| sid with a hard-killed transcript on disk | 4 | **alive past 20 s, 4/4** |
| sid that never existed | 6 | `No conversation found with session ID: <sid>`, **exit 1, 6/6** |

**And it is genuinely the old conversation, not a new session wearing the old id** — the falsifier's
quieter twin, checked rather than waved past. The resumed screens render the actual prior turns with
their **original** timestamps:

    resume-S2D0N1     ❯ Reply with exactly this token...: S2D0N1-1-84fbd3fc
                      ● S2D0N1-1-84fbd3fc      done 12:53 AM      (resumed at 12:58)

    resume-M2D2000N1  ● M2D2000N1-2-f23955f6   done 12:57 AM
                      ❯ Reply with exactly this token...: M2D2000N1-3-f23955f6    <- and NO reply

That last line is two instruments agreeing: the killed-mid-turn session came back showing the
in-flight prompt with no answer under it — exactly the `U-` the transcript reported.

**`--resume` APPENDS to the same jsonl under the same id.** `84fbd3fc...jsonl` was last written at
12:58:40, the minute of its resume, not the minute of its drive. The app's pane↔session identity
survives a resume; nothing forks.

---

## 4 · THE DEFECT ONE LAYER UP — and it is why §3(3) was the right question

**A refused `--resume` is invisible to every signal `spawn_claude_pane` keeps.**

    exit code (try_wait)     Some(1), on the FIRST poll, 3/3
    PTY reader EOF           never   3/3
    `alive` AtomicBool       stayed TRUE three seconds after the exit, 3/3

`PtySession` stores a writer, a master and a **killer** — the `Child` is dropped at the end of
`spawn_claude_pane`'s body. The only liveness the app retains is `alive`, flipped when the PTY
reader hits EOF. On Windows a ConPTY does not close while a handle is open, and the app holds
`pair.master` for the life of the pane, **so the reader never sees EOF and `alive` never flips.**

A refused resume would therefore produce a pane sitting on one line of error text that the app
counts as running. **That is the 2026-07-11 failure exactly, and it is the reason the decision to
never `--resume` was correct at the time it was made.**

The first reading of this was wrong in the direction that flatters — `alive=true, eof_ms=None` was
printed *the instant `try_wait` fired*, giving the reader thread zero milliseconds to notice. A 3 s
settle was added before the flag is read; the finding held. **An instrument that reports before the
thing it measures could have happened is not measuring.**

**So the refusal is detectable, cheaply and deterministically, but only from the Child, and the
Child is reachable in exactly one place: inside `spawn_claude_pane`, before it returns.** That is
where the check went.

---

## 5 · THE PRODUCTION KILL, n=1, UNCONTROLLED — the chair's window question

This pane was hard-killed by the app's own close path at 00:29:59, leaving
`a2122153-....jsonl.orphaned`, 914,608 bytes, 247 records.

    last record in the orphan     06:29:26.518Z   (tool_result)
    the kill                      ~06:29:59Z      (33 s later)

**The last COMPLETED exchange on the screen is the last record in the jsonl.** The capture log's
final pre-restart content is the `check.js` write-and-run and its result — both present. After it
the screen shows only a thinking spinner still turning when the restart seam lands.

**What was lost was a turn in flight, not a flushed record** — which is what §2.2 measured under
control. Supporting, from the orphan itself: 25 thinking records, each written as its own record
**before** the tool call that followed it (median gap 2.3 s, max 28.6 s), so records in this
transcript were landing continuously up to the kill.

**Limits, stated rather than implied.** n=1, uncontrolled, one kill. A redrawn TUI cannot
distinguish "a thinking block completed and was not flushed" from "a thinking block was still
running", so this case cannot *settle* the window on its own — §2.2 is what settles it. Treated as
a case, as instructed.

---

## 6 · WHAT LANDED

`consonance/src-tauri/src/main.rs`, +288 / −20. **Not committed.**

**`spawn_claude_pane`** — a bounded confirm on the resume path only:

    if resume { poll child.try_wait() for RESUME_CONFIRM (1000 ms);
                on exit -> plog + Err("RESUME_REFUSED pane=.. exit=..") }

Placed **before** the killer, the reader thread, the capture seam and the tailer, so a refused
resume leaves nothing behind. A `try_wait` that *errors* breaks the loop and lets the child live: a
child we cannot interrogate is not evidence of refusal, and inventing one would fresh-spawn over a
good session.

**`resume_pane`** — the shape the packet specified:

    jsonl present  -> spawn --resume     -> Ok: plog "-> RESUMED", board row
                                         -> RESUME_REFUSED: board row, then the fresh warm spawn
                                         -> any other error: propagates, as before
    jsonl absent   -> the fresh warm spawn, byte-identical to HEAD's behaviour

**The orphan rename lives inside the fallback and nowhere else** (§3(1)): it is what makes a resume
impossible, so it must not precede the attempt, and it is still needed underneath.

**§3(2) — the warm brief is NOT written on the resume path. My call, and the reason.**
`warm_resume_brief` bakes the pane's captured *screen* into `CLAUDE.md` under the heading
*"Consonance restored this pane from its own capture (the underlying session could not be
resumed)"*. On a real resume **that sentence is false**, and its content is the same conversation a
second time at a worse fidelity. That is the exact shape that put 8–9 stacked copies of one exchange
into a 204k `CLAUDE.md`. A seat that genuinely remembers must not also be handed a summary of what it
remembers. On the fallback the brief is written exactly as before.

---

## 7 · THE BARS

**RED FIRST — demonstrated, not asserted.** HEAD's `main.rs` was checked out, the four
source-wiring tests inserted verbatim with **none** of the implementation, and the suite run:

    a_kept_pane_whose_transcript_is_on_disk_attempts_a_real_resume            FAILED
    the_orphan_rename_is_reachable_only_through_the_fallback                  FAILED
    a_refused_resume_falls_back_to_a_fresh_pane_and_every_other_error_...     FAILED
    a_refused_resume_is_caught_from_the_childs_exit_while_it_is_still_...     FAILED

4/4 red at HEAD, then the tree restored. The two remaining tests (`plan_resume`, `pane_jsonl`) name
items that do not exist at HEAD, so **their red at HEAD is a compile failure, not a test failure** —
a weaker form of red, reported as such rather than counted with the others.

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
    532 passed; 1 failed; 4 ignored          (526 passed before this packet; +6 new)

**The 1 failure is `ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect`,
and it is red at HEAD** — verified by checking out HEAD's `main.rs` and running that test alone
(`0 passed; 1 failed`). It reads a vt100 screen fixture and touches nothing in this packet.

**MUTANTS** — `node <p1b>/mutate.js`. Every mutant applied to the real source, the real suite run,
source restored byte-for-byte (verified).

| mutant | result | caught by |
|---|---|---|
| M1 remove the fallback (a refusal propagates) | **CAUGHT** | `a_refused_resume_falls_back_...` |
| M2 rename the jsonl aside before the attempt | **CAUGHT** | `the_orphan_rename_is_reachable_only_through_the_fallback` |
| M3 attempt resume when no jsonl exists | **CAUGHT** | `a_resume_is_planned_exactly_when_the_transcript_is_there` |
| M4 never confirm the child (drop the try_wait gate) | **CAUGHT** | `a_refused_resume_is_caught_from_the_childs_exit_...` |
| SURVIVE-CONTROL widen `RESUME_CONFIRM` 1000→1500 ms | **SURVIVED** (as designed) | — |
| SKIP-CONTROL anchor that does not exist | **NOT APPLIED** | — |

`controls behaved: true`. **Survivors: none among the mutants.** The survive-control survived
because no test asserts the confirm window's width, which is true and is named in §9.

**Two instrument failures, both caught by controls, both worth more than the clean numbers:**

1. **The harness scored everything CAUGHT on its first run, survive-control included.** It keyed
   compile failure on `/^error(\[|:)/`, and `cargo test` prints `error: test failed, to rerun pass
   ...` on *any* red suite — so every mutant read as "does not compile". A harness with no way to
   say *"I could not tell"* says the thing that looks like a result. Re-keyed on rustc's own
   `error[EXXXX]` / `could not compile`.
2. **M4 SURVIVED on the first honest run, and it was my test's fault.** The test anchored on
   `"if resume {"` — and `spawn_claude_pane` has **two**, the first merely choosing `--resume` over
   `--session-id`. `find` landed on the wrong one, so a disabled gate read as present. Re-anchored
   on the gate's own first statement. **The mutant found a hole in the test written to catch it.**

And a third, in my own first ordering test: it compared the source *position* of the rename against
the attempt and went **red on correct code**, because the fallback is a closure whose body is
written above the call that may never reach it. **Definition order is not execution order.**
Re-pointed to assert containment — the rename lives inside the fallback, and every fallback call
site follows the attempt — which is both true and what M2 actually breaks.

---

## 8 · §8 — THE OTHER ROUTE, AND WHY THE MEASUREMENT DOES NOT SUPPORT IT

The packet asked, if loss is caused by the kill, whether the fix is to stop hard-killing. **The
measurement does not support that, and says so in the direction that costs me the tidier story:**
closing panes gracefully would buy **nothing for completed turns** — they are already on disk, 36/36
— and for the turn *in flight* a graceful close does not help either, because that turn has no
record to flush until it finishes. The only thing a graceful close could buy is time for an
in-flight turn to complete, which is a different feature (wait for quiescence before closing) with a
different cost (the app's close hangs on a pane mid-answer). **Not built, not recommended on this
evidence, and named so requirement A is not left dead.**

---

## 9 · WHAT I DID NOT VERIFY

- **The landed code has never run.** No pane has resumed through it; the app was not launched. Every
  claim in §6 is about source that compiles and passes tests. The keeper's rebuild is the test.
- **A present-but-CORRUPT transcript was never trialled.** Every refusal measured came from a sid
  with no file at all. `plan_resume` is a predicate on existence, which is what the vendor tests,
  but a truncated or malformed jsonl is unmeasured — that case falls to the fallback, which is
  exactly why the fallback exists underneath the predicate rather than instead of it.
- **`RESUME_CONFIRM`'s width is untested** — the survive-control proves it. 1000 ms is several times
  the observed refusal latency, and nothing in the suite would notice if it were wrong.
- **The sub-1.2 s window is unmeasured.** The probe's turn detector needs 1200 ms of PTY quiet, so no
  drive cell could kill sooner than that after the last byte. §2.2's `killmid` cells reach inside
  that window from the other direction, but a "kill at 200 ms after a completed turn" cell does not
  exist.
- **The tailer's offset across a resume is unexamined.** Today the rename gives each pane a fresh
  file starting at 0; a resumed pane's file continues growing. `data/tailer-offsets.json` may or may
  not carry the right offset into a resumed session. Nobody has looked, and it is adjacent enough to
  bite on the first real resume.
- **A stale `CLAUDE.md` sits in every pane's cwd** from previous warm restores. §6 stops *writing* a
  new one on the resume path; it does not remove the old one, and a resumed pane will still read it.
  Whether a resumed seat should read anything at all is a decision, not a bug fix, and it is the
  chair's.
- **Every non-Windows path.** Every finding here is ConPTY behaviour.

**One damage report.** Editing `main.rs` through PowerShell 5.1 (`Get-Content -Raw` + `Set-Content
-Encoding utf8`) decoded the file with the ANSI codepage and re-encoded it as UTF-8, turning every
em-dash in a 14,460-line source into mojibake and rewriting every line ending — `git diff --stat`
read 2,323 changed lines. Caught by `cat -A` before it went anywhere, reverted with
`git checkout --`, and every edit redone through Node. **PowerShell is not a safe editor for a
UTF-8 source file on this machine**, and that is worth more than this packet.

---

## 10 · FALSIFIERS, REGISTERED

- **The packet's:** a kept pane that dies with "no conversation found" after this lands — the 07-11
  failure reintroduced. Checkable in `data/persist.log`: a `-> RESUMED` row with no pane behind it.
- **Its quieter twin:** a pane reporting RESUMED whose first timestamp is the launch minute. Checked
  before landing (§3) and it did not fire; check it again on the first real launch.
- **Mine:** if the first real launch after the rebuild produces four `-> fresh` rows with
  `jsonl_existed=true`, then `plan_resume`'s predicate is wrong about where the vendor keeps a
  committee pane's transcript — `encode_cwd` is the suspect — and §2's numbers are about a path the
  app does not use.
- **And on §6's ruling:** if a resumed pane comes up *without* its conversation on screen, the warm
  brief was carrying more than a duplicate and withholding it was wrong.

---

## 11 · THE INHERITED FIGURE, CORRECTED

The packet's `2.1.266` was not measured; `2.1.269` is. The chair named this in advance as the
unchecked one. Recorded here so the next reader takes the measured number and not the relayed one.
