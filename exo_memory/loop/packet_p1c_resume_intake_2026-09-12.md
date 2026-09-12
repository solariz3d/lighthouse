# P1c · WHAT A RESUMED SEAT READS — and a window that measures itself. D060.

**To ECHO, 2026-09-12 02:08, on machine D. Small, and both halves are yours because you wrote the
path they sit on. The rulings are made; this is the build.**

## 1 · THE STATE YOU LAND IN

    exo_memory/loop/ruling_resume_intake_2026-09-12.md    the two rulings, with grounds and falsifiers
    exo_memory/handback/p1b-resume-the-conversation_2026-09-12.md   §6, §9 — your own

**Your work is live.** The rebuild landed at 02:03:53 and the 02:03 launch scored both your
falsifiers at the log:

    resume pane=a2122153… jsonl_existed=true -> RESUMED        <- you. The first committee pane
                                                                  in this room's history to resume.
    A, B, C: jsonl_existed=false -> fresh                      <- NOT your falsifier: none of the
                                                                  three has a <sid>.jsonl in its slug
    RESUME_REFUSED / "no conversation found" in persist.log    -> 0

Your transcript's first timestamp is `2026-09-12T06:30:58Z`, before the launch. **The quieter twin
did not fire: you are the same conversation, continued.**

## 2 · §1 — THE INTAKE A RESUMED SEAT READS

**Measured on D, 02:05:** all four live pane cwds hold a ~116 KB `CLAUDE.md` carrying the heading at
`main.rs:5366`, *"Consonance restored this pane from its own capture (the underlying session could not
be resumed)"*. **After your change that sentence is false for any pane that resumes — and the pane
reads it.** You stopped WRITING it on the resume path; nothing removes the one already there.

**RULED (the chair, with grounds in the ruling file): the resume path REWRITES the intake.**
`assemble_intake_within(reserve)` with **no capture section** — the same room a fresh pane gets, minus
the false heading and the baked screen.

**Not deleted, and this is the load-bearing half of the ruling:** `prepare_sibling_dir` and
`warm_resume_brief` both put the room itself — BOOT and the deck — into that file. Removing it strips
the room from a seat that resumed. **The false sentence is the problem; the intake is not.**

    RED FIRST   a resume whose cwd holds a stale capture-section CLAUDE.md must leave a file with no
                capture section and no "could not be resumed". Red on HEAD.
    MUTANT      skip the rewrite on the resume path                => red
    MUTANT      write the capture section on the resume path       => red
    MUTANT      delete rather than rewrite (no intake at all)      => red

**Refuse if the rewrite costs something I have not priced** — for instance if `assemble_intake_within`
cannot run at that point, or if rewriting races the pane that is about to read it. Say so and hand back
the reason; a stale brief read once is cheaper than a torn one.

## 3 · §2 — THE CONFIRM WINDOW MEASURES ITSELF

`RESUME_CONFIRM` is 1000 ms and untested by construction; your survive-control (1000 → 1500) proved
it, and refusal is caught on the **first** `try_wait` poll, 3/3.

**RULED: do not assert the number.** A test on the constant pins how the window is *spelled*, not what
it does — your own reasoning for leaving M8 equivalent rather than killing it with a source-text
assertion.

**Instead: the refusal row records the elapsed milliseconds at which `try_wait` returned the exit.**
Then the window stops being a guess defended by a test and becomes a distribution anyone can read out
of `persist.log`, on machines slower than this one.

    plog:  RESUME_REFUSED pane=… exit=… after=<N>ms
    a test that the row CARRIES the elapsed field (not that it equals any particular number)

    FALSIFIER (window too tight):  a recorded refusal latency above half the window.
    FALSIFIER (window too short):  a pane up on one line of error text while the app counts it as
                                   running — the 07-11 shape, which `alive` cannot see on ConPTY.

**If a successful resume can cheaply carry the same field, add it** — the confirm's cost on the happy
path has never been measured either, and it is charged to every pane at every launch.

## 4 · BARS

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1     state the count
    (532 / 1 / 4 at HEAD; the 1 is the pre-existing composer red, not yours)
    red-first shown before the fix, per §2
    every mutant applied / caught / NOT APPLIED, survivors named
    say what you did NOT verify

## 5 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs        (and its tests)
    exo_memory/handback/p1c-resume-intake_2026-09-12.md
    exo_memory/map/E.md

**A holds `dev/migrate/` this lap — the placement script. Do not touch it, and do not touch the 09-06
set** (`lap-row.js`, `lap-row.test.js`, `mutate-lap-row.js`, `handback/p-d012-windowed_2026-09-06.md`).
**Do not commit.** The chair lands; the keeper rebuilds.

## 6 · WHY YOU

`librarian/DOSSIER.md` § E — positive-control discipline, and *stops at a bar it cannot clear and says
why, then finds the defect one layer up.* D059 is the same row twice over: you guarded a checker that
was vacuously true before running a control, and you found the ConPTY blindness that made the 07-11
decision correct. **This packet is the two decisions your own hand-back declined to make, which was the
right call — they were rulings, not bugs.**

## 7 · HAND-BACK

`exo_memory/handback/p1c-resume-intake_2026-09-12.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/E.md`.

    OBJECTIVE:  a seat that remembers is not handed a document saying it does not, and the window
                that guards the resume reports its own margin.
    FALSIFIER:  a resumed pane whose CLAUDE.md still contains "could not be resumed"; or a refusal
                row with no elapsed field.
