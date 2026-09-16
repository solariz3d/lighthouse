# P-FERRY-TESTS · BRAVO — the five that shipped green, pinned

**B (pane `12fb81f6`), machine L, L061, 2026-09-16 ~05:4x.** My file: `consonance/tools/ferry.test.js`, and it is
the only file I changed — `git diff --stat consonance/tools/` → **1 file changed, 146 insertions, 4 deletions**.
**`consonance/tools/ferry.js` is byte-identical**: the mutation harness hashes it before and after every row and
prints `tracked ferry.js unchanged: true`.

**No test here needed a change to the tool.** That was the live risk — `report()` takes its commits from `git log`
and nothing injects them — and §2 is how it was avoided.

---

## 0 · THE NUMBER, AND HOW I COUNTED

**Five defects the suite missed. Six new tests. One repaired test. Seven changes.**

- **Five** is the count of single-line defects in `ferry.js` that shipped green through the old suite: C's D4–D8.
  All five live in `report()`, and `grep -c "report(" ferry.test.js` was **0** — the suite had never called it.
- **Six** new tests, because **D7 has two distinct failure modes** and one test cannot hold both: for odd n > 1 it
  returns the largest latency instead of the middle one, and at n = 1 it indexes past the end, `median` becomes
  `undefined`, `median === null` does not catch it, and `median.toFixed(1)` throws — so `node ferry.js` with no
  arguments dies the first day exactly one artifact has been ferried. A wrong number and a crash are not the same
  assertion.
- **One repaired**, not new: E's finding is a defect **in this suite**, not one `ferry.js` missed. The test named
  *"a sha shorter than 7 is REFUSED"* was green under D2's inversion — 5 is rejected by `>= 7` and by `<= 4` alike.
  D2 was caught, but by a different test; the one carrying the guard's name was not holding it.

So the chair's six is the right number for tests and one too many for defects, and I would rather show the seam
than round.

---

## 1 · WHAT WAS BUILT

| test | the defect it holds | what it pins |
|---|---|---|
| a commit AT the ledger epoch is inside the window, not before it | D4 `r.at >= ep` → `>` | the split between measured and unmeasured at the boundary instant |
| median latency is reported in MINUTES | D5 `/60000` → `/1000` | the unit, **derived from the fixture's own inputs** |
| a ferry stamped BEFORE its commit cannot move the median | D6 drops `&& n >= 0` | an invariant: the impossible sample makes no difference |
| the median is the MIDDLE latency, not the largest | D7 `floor` → `ceil` | position in an odd-length sample |
| ONE latency sample gives that sample, not undefined | D7, at n = 1 | that the default invocation prints instead of throwing |
| the miss rate is withheld below its floor and printed at it | D8 `RATE_FLOOR` 10 → 1 | the boundary, **from both sides** |
| the sha-length rule is a FLOOR, not a window — 6 is refused and 7 matches | D2's inversion (E's §4) | that one guard held, not merely that one input failed |

**On pinning the shape rather than the text**, which is the aim the packet set:

- **D5** asserts `median === (ferried_at − at) / 60000` computed in the test from the same two numbers, with a
  sanity line that the fixture really is two hours. Any divisor fails, not only the planted one.
- **D6** takes the median twice — once clean, once with an impossible row added — and asserts they are **equal**.
  No literal at all; it holds whatever the latencies are.
- **D8** asserts n/a at `FLOOR − 1` and a percentage at `FLOOR`. **Raising** the floor fails it as surely as
  lowering it.
- **The repaired test** is the shape lesson in miniature: the old one fixed a single input and a single outcome, so
  it could not separate a guard from its inversion. Two inputs, one either side, can.

---

## 2 · THE ONE DESIGN DECISION, STATED BECAUSE IT COULD HAVE GONE THE OTHER WAY

`report()` → `status()` → `artifactCommits()` → `git log` inside `FERRY_REPO`. Nothing injects commits, and
`status()` reads them from module scope — which is exactly why the old suite tested the join through `joinRows()`
and never touched `report()`.

**A seam in `ferry.js` would have been the easy way, and the packet forbids it.** So the tests build a **real
throwaway repository** per case: `git init` in a temp dir, one file per artifact under `exo_memory/loop/`, each
commit stamped through `GIT_AUTHOR_DATE`/`GIT_COMMITTER_DATE` so `at` is chosen rather than observed. That exercises
the shipped path end to end — the git parse, the artifact-directory filter, the join, the window split — instead of
a lookalike.

**Cost, measured:** the suite goes from 13 tests in well under a second to **19 tests in 4.4 s** (`time node
ferry.test.js`), nearly all of it `git` on Windows. I judged that worth it for the only path that reads real
commits; a faster suite that cannot see `report()` is what this lap exists to correct.

`report()` prints its rate and does not return it, so `quietReport()` swaps `console.log` for a collector and
returns both the object and the lines. The rate assertions read **what an operator reads**.

---

## 3 · MEASURED — RED FIRST, ON COPIES

Harness: `scratchpad/ferry_mutants.js`. Per row it re-copies `ferry.js` and `ferry.test.js` to a fresh temp dir,
applies **one** single-line change to the copy, runs the copy's suite, and prints which tests went red. **The
anchor count is checked before the write and a row that does not match exactly once prints NOT APPLIED loudly** —
A's lesson from tonight's harness work, taken rather than re-learned.

    BASELINE (repo, after my additions)        19 passed, 0 failed          (was 13 passed, 0 failed)

    D4 epoch boundary >= -> >        17p/2f   a commit AT the ledger epoch…  |  the miss rate is withheld…
    D5 latency divisor 60000 -> 1000 16p/3f   median latency is in MINUTES  |  the median is the MIDDLE…  |  ONE latency sample…
    D6 drop the negative filter      18p/1f   a ferry stamped BEFORE its commit cannot move the median
    D7 median index floor -> ceil    14p/5f   the median is the MIDDLE…  |  ONE latency sample…  (+3 collateral)
    D8 rate floor 10 -> 1            18p/1f   the miss rate is withheld below its floor and printed at it
    D2 join filter >= -> <=          10p/9f   the sha-length rule is a FLOOR…  (+8 others)
    D1 MIN_SHA 7 -> 4                17p/2f   the sha-length rule is a FLOOR…  |  record() REFUSES a short sha…
    CONTROL  reword a comment        19p/0f   SURVIVED
    SKIP-CONTROL  anchor not present   —      NOT APPLIED — anchor matched 0 times

    tracked ferry.js unchanged: true

**Every one of the five that used to ship green now goes red at the test that names it.** D6 and D8 are caught by
exactly one test each — clean isolation. D4, D5 and D7 also take collateral tests with them, because a broken
divisor moves every latency and a broken median index makes `report()` throw before the other assertions run; that
is over-coverage, not mis-aiming, and I report it rather than presenting each row as a single clean hit.

**D2 is the proof that E's finding is closed:** it now fails at *the sha-length rule is a FLOOR* — the test whose
name was claiming that guard all along.

**Both controls behaved.** Rewording a comment leaves the suite green, so these tests are not matching the source
text; a deliberately absent anchor reports NOT APPLIED instead of quietly counting as a pass.

---

## 4 · WHAT I DID NOT VERIFY

1. **I did not run the wider repo's suites.** My change is one test file with no importers
   (`grep -rn "ferry.test" --include=*.js` → the file itself only).
2. **`epoch()`'s fallback path is still untested.** With no `{epoch}` row it takes `min(ferried_at)`; every fixture
   here supplies an explicit epoch row. Nobody planted a defect there, so it stayed out of scope — **it is the next
   gap in this file, and I am naming it rather than leaving it to be rediscovered.**
3. **`--due` has no test.** It is the CLI branch an operator runs most, and nothing pins its output.
4. **`artifactCommits()` is exercised only through my fixtures**, and every fixture file is in `exo_memory/loop/`.
   The directory filter itself — that `src/` is excluded, that a commit touching no artifact drops out — is
   asserted only against `ARTIFACT_DIRS` as a list, never against a real mixed commit.
5. **I did not test the three defects the suite already caught** (D1, D2, D3) beyond what the mutation run shows.
6. **The 4.4 s figure is one run on this machine**, not a distribution, and git on Windows is the variable.
7. **I did not read the planted copy of `ferry.js`** — only C's and E's hand-backs, which the packet named. The
   anchors in my harness are transcribed from their tables against the repo's current source.
8. **Nothing is committed.**

---

## 5 · WRONG (mine)

- **W1. My first D6 fixture would have shipped green against D6.** I drafted it with three positive latencies
  (10, 20, 30) and one negative (−60). Worked through: clean is `[10,20,30]`, index `floor(3/2)` = 1 → **20**; with
  the negative it is `[−60,10,20,30]`, index `floor(4/2)` = 2 → **20**. Identical — the test would have passed on
  the broken filter and I would have reported a defect as pinned. Two positives make it discriminate: `[10,20]` →
  20, `[−60,10,20]` → 10. **Caught by doing the arithmetic before writing the test, not by running it** — the run
  would have told me nothing, because a green test against a planted defect looks exactly like a green test.
  **Class: choosing fixture values without checking that they can distinguish the two worlds.** It is the same
  defect E found in the sha-length test, one lap later, in my own hands.
- **W2. I nearly asserted D8 only on the low side** — n/a below the floor — which is green under a floor *raised*
  to 100. The two-sided version came from asking what else the planted line could have been.

---

## 6 · THE ONE LINE

**The five defects that shipped green all lived in the one function the suite never called, and the test that
carried the name of the sixth guard was green whichever way that guard pointed — so the gap was not thin coverage
but a whole surface and a mislabelled sentinel, and both are now red on contact.**
