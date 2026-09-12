# P1c · WHAT A RESUMED SEAT READS — and a window that measures itself. D060, pane E.

**Both rulings built. Neither refused — and §2's permission to refuse was a real question with a
real answer, not a formality: the race does not exist on this path, and the ordering is why.**

Nothing committed. Files touched: `consonance/src-tauri/src/main.rs` only.

---

## 0 · THE STATE I LANDED IN, READ AT THE LOG

    /c/Consonance/data/persist.log
    1789200238 resume pane=a2122153-a37e-41a6-a86f-534267ec0565 jsonl_existed=true -> RESUMED

Both D059 falsifiers scored and neither fired. A, B and C show `jsonl_existed=false -> fresh`, which
is **not** the falsifier — the falsifier was `jsonl_existed=true -> fresh`, i.e. the predicate
looking in the wrong place. Zero `RESUME_REFUSED`, zero "no conversation found".

**And I am the live case this packet is about.** Measured just now, in my own cwd:

    sibling-07b8a48f    116,302 B   'could not be resumed' x1     <- me, the pane that resumed

A seat that remembers, holding a document telling it that it does not. Three of the other cwds
carry the heading **twice** — once live, once baked inside the captured screen of the shell before
it — which is the stacking lineage visible in a single `grep -c`.

**One limit on the fix, stated first because it is the thing most easily over-claimed:** this
governs what a resumed seat reads *next*. The false sentence already inside a resumed pane's vendor
transcript is history and nothing can reach it. My own context carries it right now.

---

## 1 · §1 — THE INTAKE IS REWRITTEN

**One assembly, two callers.** The room a pane wakes into was inlined in `warm_resume_brief`. Lifted
to `intake_with_map(pane, cwd)` — the intake plus the pane's own map, seated in the budget the map
reserves — and both writers now take it:

    warm_resume_brief  ->  intake_with_map + the PRIOR CONVERSATION section + the capture
    resumed_intake     ->  intake_with_map, and nothing under it

Not two spellings of the room. Two spellings is how the room a resumed seat reads drifts from the
room a warm-spawned one reads, with no reader anywhere able to see the difference.

**Rewritten, not deleted**, per the ruling's load-bearing half: this file is the only place a
sibling receives BOOT and the deck. `resumed_intake` returns `false` for an unmanaged cwd (a room, a
project — not ours to write), and for an **unbriefed fresh dir** it removes the stale file rather
than leaving a zero-byte room, because unbriefed is a property that dir keeps for life and the
absence is what stock claude expects.

**Wired before the spawn**, in `resume_pane`'s Resume arm, and the RESUMED row now carries
`intake_rewritten=<bool>` so the falsifier has an instrument in `persist.log` and not only a grep.

### 1.1 · THE RACE — the refusal I was given permission to make, and did not

**It does not exist on this path, and the reason is the ordering rather than luck.** The only reader
of a pane's `CLAUDE.md` is the vendor process, and at the moment the rewrite runs
`spawn_claude_pane` has not been called: nothing between those two lines opens the file. A stale
brief read once would indeed be cheaper than a torn one — **so the condition under which I would
refuse is named in the code**, at the call site: if the rewrite were ever moved after the spawn, or
handed to a thread, the answer is to refuse, not to widen a sleep.

**And I made it cheaper than the status quo rather than merely equal to it.** `fs::write` opens with
`TRUNCATE`, so a crash between the truncate and the fill leaves a pane holding an empty or partial
room — the exact tearing the chair priced, reachable today without any concurrency at all. Both
writers now go through `write_intake`, which writes `CLAUDE.md.new` and renames over the target;
`std::fs::rename` is `MoveFileExW` with `MOVEFILE_REPLACE_EXISTING` on Windows, so a reader sees the
old file or the new one and never half of either. It falls back to a direct write if the temp cannot
be made, because a torn window is still better than no intake at all.

**The cost I am not hiding:** on a *refused* resume the intake is assembled twice — once by
`resumed_intake` before the attempt, once by `warm_resume_brief` in the fallback. That is a few
hundred KB of file reads on a path that has never fired in production. Moving the rewrite after the
spawn would remove it and reintroduce the race, so the double-assembly is the price and it is paid
knowingly.

---

## 2 · §2 — THE WINDOW REPORTS ITS OWN MARGIN

No test asserts `RESUME_CONFIRM`. The refusal row is now a value, not a format string inside a match
arm, and it carries the elapsed at which `try_wait` returned the exit:

    RESUME_REFUSED pane=<id> exit=<n> after=<N>ms

That string is both the `plog` row and the `Err` the fallback keys on, so **the board row the keeper
reads carries the margin too**. The happy path was never measured either, and it is charged to every
resumed pane at every launch, so it reports as well:

    resume pane=<id> confirm held after=<N>ms window=1000ms

Both falsifiers now read off a field instead of off a constant: **too tight** — a recorded latency
above half the window; **too short** — a pane up on one line of error text while the app counts it
as running, the 2026-07-11 shape that `alive` cannot see on ConPTY.

**What the test asserts is that the margin RIDES and VARIES** — `resume_refused_row("p",1,0)` and
`(...,412)` differ, and each carries its own `after=`. A row whose elapsed is a constant measures
nothing, and that is the failure a test on `RESUME_CONFIRM` could not have seen.

---

## 3 · THE BARS

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
    538 passed; 1 failed; 4 ignored              (532/1/4 before this packet; +7 tests)

**The 1 failure is the pre-existing composer red**
(`ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect`), verified
red at HEAD on 2026-09-12 by checking out HEAD's `main.rs` and running it alone. Not mine, not new.

### 3.1 · RED FIRST — demonstrated, and the ordering claim stated honestly

The two **wiring** tests compile at HEAD. Inserted into HEAD's `main.rs` with none of the
implementation:

    the_resume_arm_rewrites_the_intake_before_the_pane_that_reads_it_exists    FAILED
      -> "the resume path never rewrites the intake — the resumed seat reads the warm brief from
          its last life, headed 'could not be resumed'"
    the_refusal_row_has_exactly_one_author                                    FAILED
      -> "the spawn funnel does not build its refusal row through the one formatter that carries
          the margin"

2/2 red at HEAD, tree restored. **The four behavioural tests cannot be shown red this way** — they
name `resumed_intake` and `resume_refused_row`, which do not exist at HEAD, so their red is a
COMPILE failure. That is a weaker form and is reported as such rather than counted with the others.

**And the ordering, plainly: the implementation was written first and the red demonstrated
afterwards by reverting.** The evidence that each test fails without its implementation is the same
either way; the claim to have written tests first would not be true, so it is not made.

### 3.2 · MUTANTS — `node <p1c>/mutate.js`

Every mutant applied to the real source, the real suite run, source restored byte-for-byte
(verified).

| mutant | result | caught by |
|---|---|---|
| M1 skip the rewrite on the resume path | **CAUGHT** | `the_resume_arm_rewrites_the_intake_before_...` |
| M2 write the capture section on the resume path | **CAUGHT** | `a_resumed_pane_reads_a_room_that_does_not_say...` |
| M3 delete rather than rewrite (no intake at all) | **CAUGHT** | `a_resumed_pane_reads_a_room_that_does_not_say...` |
| M4 drop the elapsed field from the refusal row | **CAUGHT** | `the_refusal_row_carries_the_elapsed_margin_and_not_a_constant` |
| M5 `write_intake` truncates in place instead of replacing | **SURVIVED** | — |
| SURVIVE-CONTROL reword the happy-path confirm log | **SURVIVED** (as designed) | — |
| SKIP-CONTROL anchor that does not exist | **NOT APPLIED** | — |

`controls behaved: true`.

**The survivor, named and not folded into the pass: M5.** Atomicity is invisible to any test that
does not inject a fault between the truncate and the write — no assertion can distinguish
`fs::write` from write-and-rename on a run where nothing crashes. The test does check that no
`CLAUDE.md.new` is left behind, which catches a rename that silently fails; it cannot catch the
absence of the rename. **The right instrument would be fault injection, and it is not built here.**

**M2 would have been caught for the wrong reason, and that was fixed before the run.** The first
version of the test gave the pane no capture file, so routing the resume path through
`warm_resume_brief` was caught only because the capture was *missing* — a verdict that evaporates in
production, where every resumed pane has one. The test now seeds a real capture containing
`OLD-SCREEN-BYTES` and asserts those bytes do not appear, so the mutant is caught on the property
that matters.

---

## 4 · WHAT I DID NOT VERIFY

- **None of this has run in the app.** No pane has resumed through it. The `intake_rewritten=true`
  field on a RESUMED row after the next rebuild is the first real evidence, and one `grep -c 'could
  not be resumed'` in a resumed pane's cwd is the whole falsifier.
- **The size of a real resumed intake is unmeasured.** It has no capture section, so it should be
  far under the ~116 KB the warm briefs run at, but the only assembly exercised so far is against a
  scratch room of one line. If `intake_with_map` alone exceeds the ceiling, the `SHELL OVER CEILING`
  and `MAP FLOOR BREACHED` rows already in that code are what would say so — they were moved, not
  changed, and they have not fired in a scratch run.
- **Atomicity (M5).** Named above. `MOVEFILE_REPLACE_EXISTING` is asserted from the std docs and the
  Windows API, not observed here.
- **The fresh-dir removal branch has never run against a real fresh pane** — only the scratch test.
  A fresh pane that resumes is a case that has not occurred yet in this room.
- **The double-assembly on the refusal path** costs file I/O I did not time. The refusal path has
  never fired in production.
- **`prepare_sibling_dir`'s write was not routed through `write_intake`.** It is the birth path, not
  a rewrite, and widening the change there was outside what was asked. It keeps the truncate window.

---

## 5 · A CORRECTION TO MY OWN D059 CODE

The board row for a refused resume carried a 22-space gap mid-sentence — a Rust line-continuation
backslash eaten by a JS template literal while I was avoiding the PowerShell encoding problem.
Cosmetic, in text I wrote, in the landed commit. Repaired here.

---

## 6 · FALSIFIERS, REGISTERED

- **The packet's:** a resumed pane whose `CLAUDE.md` still contains "could not be resumed" — one
  grep in that cwd after the first resume post-rebuild; or a refusal row with no elapsed field.
- **Mine, on the rewrite:** if a resumed pane comes up with **no** room — no BOOT, no deck — then
  `intake_with_map` returned empty for a managed dir and the removal branch took a cwd it should
  never see. Checkable as a `CLAUDE.md` that is absent or tiny in a `sibling-*` dir after a resume.
- **Mine, on the window:** if a recorded `after=` on a refusal exceeds 500 ms, the 1000 ms window is
  tighter than it looks and the margin is not what D059 measured on this machine.
- **On the atomic write:** if a `CLAUDE.md.new` is ever found lying in a pane's cwd, the rename is
  failing and every pane has been taking the truncate fallback silently.
