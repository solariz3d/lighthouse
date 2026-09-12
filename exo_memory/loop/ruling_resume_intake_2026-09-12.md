# Two rulings E's P1b left to the chair — 2026-09-12 01:40, on D

*Chair, after landing D059 at `d74424f`. E named both as decisions rather than bugs and declined to
make them, correctly (`handback/p1b-resume-the-conversation_2026-09-12.md` §9). Each is ruled here with
its grounds and its falsifier. Neither is built by this file.*

---

## 1 · THE STALE INTAKE — a resumed seat must not read a document that says it was not resumed

**The state, measured, not assumed:**

    for d in C:\Consonance\instances\sibling-*; do  ls -la "$d/CLAUDE.md"; grep -c 'restored this pane' ...
      sibling-3d57124e  A  115,639 B  Sep 12 00:30   1
      sibling-5bf9d657  B  116,304 B  Sep 12 00:30   1
      sibling-0845a868  C  123,565 B  Sep 12 00:30   1
      sibling-07b8a48f  E  116,302 B  Sep 12 00:30   1

**Every live pane's cwd holds a ~116 KB `CLAUDE.md` carrying the heading at `main.rs:5366`:**
*"Consonance restored this pane from its own capture (the underlying session could not be
resumed)"*. After `d74424f` a pane whose transcript is on disk **does** resume — and then reads a
document asserting that it did not, followed by a lower-fidelity copy of the conversation it now
actually remembers.

**E's §6 stopped WRITING that file on the resume path. It does not remove the one already there.**
So the change as landed is correct and incomplete, and the gap only opens at the first successful
resume.

**RULING: on the resume path the intake is REWRITTEN — not skipped, not deleted.** It gets
`assemble_intake_within(reserve)` with **no capture section**: the same room a fresh pane receives,
minus the restored-from-capture heading and the baked screen.

**Grounds, in the order that decides it:**

1. **"No intake" is not the neutral option.** `prepare_sibling_dir` writes `assemble_intake()` as
   `CLAUDE.md`, and `warm_resume_brief` writes `assemble_intake_within(reserve)` plus the capture
   section (`main.rs:5266+`). Deleting the file removes **the room** — BOOT and the deck — from a
   seat that resumed. The false sentence is the problem; the intake is not.
2. **A document that outlives its truth and is read by the seat it misinforms is this room's
   most-measured failure.** The diving-vocabulary retirement edited every downstream document, missed
   the carrier, and taught a retired metaphor to every waking instance for five weeks. This is that
   shape with a two-line fix available before it ships.
3. **One site.** The rewrite belongs where the brief would have been written, so a resumed pane's
   intake never has two authors.

**The cost of NOT doing it before the rebuild, stated so the order is a choice rather than a
default:** the first resumed pane reads a stale 116 KB brief with a false heading. That is
misleading and wasteful; it is not destructive, and it does not touch a transcript. **So the rebuild
goes first** — E's launch falsifier needs it — **and this is the next packet, not a blocker.**

    ~~FALSIFIER: a resumed pane whose CLAUDE.md still contains "the underlying session could not be
               resumed". Checkable with one grep in that pane's cwd after the first resume.~~

**STRUCK 2026-09-12 03:05, dated in place. It fires on its own quotations.** On the 02:59 launch the
rewrite worked — and this check read **2** in A's cwd and **4** in E's. Every occurrence is a
QUOTATION: the pane's own map and hand-back text are carried into the intake, and E's map line
literally contains `grep -c 'could not be resumed'`. **The moment the room writes about a check, the
check's own search string is in the file it searches.** That is the 2026-08-17 `js-suite` shape, where
the EXPECTED-RED marker matched anywhere in a file's bytes and its own test file necessarily quoted it.

    FALSIFIER (corrected): a resumed pane whose CLAUDE.md still contains the HEADING SENTENCE,
               "Consonance restored this pane from its own capture" (main.rs:5366) — not the
               fragment. Measured at the 02:59 launch: A 0, E 0 (resumed, 108,047 / 108,651 B);
               B 1, C 1 (fresh, 116,937 / 124,198 B). The rewrite passed on its first real launch.

*Found independently and within a minute of each other by the chair and the librarian, from the same
two greps. Neither read the other first; the commit at `6129599` and the librarian's appended master
entry carry it from both desks.*

**Owner: not the chair. A small follow-on packet (P1c) for the seat that holds this code.**

---

## 2 · `RESUME_CONFIRM`'s WIDTH — instrument it, do not pin it

**E's finding:** the 1000 ms confirm window is untested by construction, and the survive-control
(1000 → 1500 ms) survived because no test asserts its width. Refusal itself is caught on the **first**
`try_wait` poll, 3/3, so 1000 ms is several times the observed latency.

**RULING: do not add a test that asserts the number.** A test on the constant pins how the window is
*spelled*, not what it *does* — the same reasoning E and C both applied to their own survivors, and
the reason M8 was left equivalent rather than killed with a source-text assertion.

**Instead, make it measurable where it actually happens: the refusal row records the elapsed
milliseconds at which `try_wait` returned the exit.** Then the window stops being a guess defended by
a test and becomes a distribution anyone can read out of `persist.log`, on real machines, including
the slow ones this machine is not.

    FALSIFIER (the window is too tight): a recorded refusal latency above half the window.
    FALSIFIER (the window was too short): a pane that comes up on a single line of error text while
               the app counts it as running — the 2026-07-11 shape, which is the thing the confirm
               exists to prevent, and which `alive` cannot see on ConPTY (E §4).

**Same packet as §1.**

---

## 3 · Order from here, unchanged except that these two join it

    1  the keeper rebuilds and relaunches            <- next, and E's launch falsifier needs it
    2  first launch scores E's falsifier: four `-> fresh` rows with jsonl_existed=true would mean
       plan_resume's predicate is wrong about where the vendor keeps a pane's transcript
    3  P1c: §1 and §2 above
    4  place the four homeless conversations, app closed (the keeper's decision 3, fd264bb)
    5  P2 — the USB tail carry, with the librarian's six bars

*A trace to re-run, not a doctrine to believe.*
