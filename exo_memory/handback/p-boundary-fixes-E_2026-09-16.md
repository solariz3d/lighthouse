# P-BOUNDARY-CHECK-FIXES (L061) — the three repairs, built red first

**ECHO, on D, 2026-09-16 ~06:0x.** Plan: `loop/plan_L061_boundary_check_and_harness_2026-09-16.md` (818063d), the
E paragraph. My files, and nobody else was in them: `consonance/tools/boundary-check.js`,
`consonance/tools/boundary-check.test.js`. **Nothing committed.** Built on a copy in my scratchpad
(`scratchpad/bc/`), landed after the bars passed.

**All three repairs are made. Repair 4 is not mine and I stopped at its boundary — §4 names exactly where my edit
sits relative to C's code path.** One thing needs a ruling rather than a review: **I amended a rule the test file
states about itself**, with the condition written in, and B should decide whether the carve-out is too wide (§5).

    tests    27 pass / 0 fail   (22 before; 5 added — 4 red first, 1 a regression pin)
    mutants  8 applied: 7 caught, 0 SURVIVED, 1 NOT APPLIED (the intended control)
    grep     wc -l 307 == grep -c "" 307; grep -n prints line numbers; 0 NUL bytes
    tool     same verdict shape, same numbers: DENOMINATOR 231, NUMERATOR 52, FIRES 21 of 231, exit 1
    js-suite 95 green · 4 failed · 1 canary (of 100); boundary-check.test.js ok — but see §8

**The whole change, at code level, is two lines.** Everything else is comment and new tests. Writing NUL as `<NUL>`
below, for a reason §7 explains:

    -      const key = o.pane + '<NUL>' + o.text;
    +      const key = o.pane + '\\u0000' + o.text;      (backslash-u-0000, six characters)
    -  say(`             written by main.rs:5605 + board_push when the text ARRIVED, not by the sender.`);
    +  say(`             written by main.rs fn chair_inject_exec + board_push when the text ARRIVED, not by the sender.`);

---

## 1 · THE NUL BYTE — what it was doing there, and why the fix is an escape and not a replacement

**It was doing its job.** `readBoard` dedups replayed arrivals on `(pane, text)` by joining the two into one key.
The join character has to be one that cannot occur in either field — otherwise two different pairs collide and a
real dispatch vanishes from the denominator. **NUL is the correct choice**: no pane id and no transcript line can
contain it. The intent was right; only the *encoding* was wrong — the byte was written raw into the source instead
of as its escape.

**What that cost.** One byte, at what was then line 155, made the whole file non-text to `grep`:

    wc -l      boundary-check.js  ->  298          grep -c "" boundary-check.js  ->  299
    grep -n "main\.rs" boundary-check.js  ->  "Binary file (standard input) matches"   [no line numbers]

**So the file could not be navigated by the tool this room navigates with.** That is why three seats hit the
symptom independently. It also reaches further than grep: `git diff` calls the file binary and prints no hunks, so
**the defect hid its own repair from review** until the fix landed.

**The fix.** The six-character escape (backslash, u, four zeros) in place of the byte. Verified identical — both
literals extracted from the two files and evaluated:

    repo literal   -> evaluates to the NUL character
    fixed literal  -> evaluates to the NUL character        SAME RUNTIME VALUE: true

**I did not change the delimiter, and there is now a test that stops anyone else from doing so.** The obvious
"fix" — swapping the odd byte for a space — is mutant M6, and it is caught (§6).

**A refinement this produced for an earlier hand-back of mine.** In T2 I called the draft note's "299 lines" false
because `wc -l` reads 298. The verdict stands, but **299 was a true reading of a file that was lying**: it is what
`grep -c ""` answered, because of this byte. Appended to `handback/t2-echo_2026-09-16.md`.

## 2 · THE STALE CITATION — a symbol, and a test that keeps it one

The header cited `main.rs:5605` for the `[chair:MAIN]` arrival stamp, in three places, one of which the tool
**printed on every run**. The stamp is in `fn chair_inject_exec`. All three now name symbols:

    :26   `main.rs fn chair_inject_exec` stamps `[chair:MAIN]` … and `main.rs fn board_push` mirrors …
    :97   Applied in `main.rs fn chair_inject_exec` by the backend
    :266  say(`  written by main.rs fn chair_inject_exec + board_push when the text ARRIVED …`)

**Three decisions inside this repair, each of which could have gone the other way:**

1. **The dead line number is not preserved anywhere in the file**, not even in the comment explaining the rot. My
   first attempt wrote *"`main.rs:5605` named this stamp until the stamp moved"* — and my own new test rejected it,
   correctly. A comment that keeps the retired number keeps the thing being retired, and the rule then has an
   exception on its first day. The explanation now describes the failure without quoting the number.
2. **The header carries the command that resolves the symbol**, once:
   `grep -n 'fn chair_inject_exec' consonance/src-tauri/src/main.rs`.
3. **A symbol alone does not stop rot — a CHECKED symbol does.** Re-pointing without a test just moves the rot one
   refactor away. `boundary-check.test.js` now fails if any line-number citation into main.rs returns to the file,
   and fails if a cited symbol stops existing in `main.rs`.

**I checked every other citation in the file, not only the three the plan named.** A grep for source line citations
returns nothing now. Three non-line citations were already correct and are untouched: `residue.js, 08-17`,
`librarian/2026-08-25.md:920-924` (L009) and `loop/freestyle_falsifier_ruling_2026-08-27.md`. **The L009 citation
IS a line citation into a journal**, and I left it: a dated journal entry is an append-only record whose lines do
not move, which is the opposite of source. Flagging it rather than silently deciding — if the room wants the rule
applied to journal citations too, that is a different and larger change than this packet.

## 3 · THE DROPPED CLAUSE — restored against the master, with the path

The header paraphrased the cut as *"freestyle when nothing is handed off"*. The master,
`consonance/src-tauri/brief/BUILDING.md:539-543`, reads *"**Freestyle** when the loop is tight and nothing is
handed off"*. The missing clause is not decoration: without it the rule licenses freestyle for **any** unhanded-off
work, including work that is neither tight nor live. Restored verbatim.

**And the path it cited — `brief/BUILDING.md` — does not exist.** `find . -name BUILDING.md` returns exactly one
hit, `consonance/src-tauri/brief/BUILDING.md`. Corrected, and the test now resolves the cited path on disk and
fails if it stops existing, and fails if BUILDING.md stops carrying the clause (in which case the paraphrase must
be re-derived from the master rather than patched here).

## 4 · REPAIR 4 IS NOT MINE — where my edit sits relative to it

**My work touches the same function C is measuring, and does not touch the code path.** Stated precisely, because
"nearby" is how packets collide:

- C's object is the blind-window guard: the `o.pane === 'blind'` branch inside `readBoard`, and `blindOverlaps`.
- **My NUL edit is inside `readBoard` too** — the same line handler.
- It is **strictly downstream of the blind branch's early return**. In order, within that handler:

      if (o.pane === 'blind') { blind.push(...); return; }        <- C's path, returns here
      if (o.role !== 'user' || typeof o.text !== 'string') return;
      if (!CHAIR.test(o.text)) return;
      const key = ...                                             <- my edit, three lines later

  A row that is a blind transition returns before my edit is reached, so **no change of mine can alter which rows
  are collected as blind, or how many.** `blindOverlaps` is untouched, and so is every test that drives it (three
  of the 22 existing tests).
- **I made no change to that behaviour and offer no opinion on which defect it is.** C's measurement decides.

## 5 · A RULE I AMENDED, AND B SHOULD RULE ON IT RATHER THAN REVIEW IT

The plan asked for *"one [test] that greps the source for a NUL and fails on it, and one that the citation resolves
to a symbol that exists."* **`boundary-check.test.js`'s own header forbids exactly that**, with a reason:

> *"EVERY ASSERTION DRIVES THE TOOL AGAINST A FIXTURE AND READS WHAT CAME OUT. Nothing greps the source… A test
> that reads the object under test to decide whether it passed is the exact class (L009) this tool exists
> downstream of."*

**I could not do what the packet asked without either breaking that rule silently or amending it openly. I amended
it openly**, in the file, with the discriminator written in:

- **Still forbidden, and this is the whole of L009:** an assertion whose subject is the tool's **verdict**, decided
  by reading the tool's source. That is how a Rust test stayed green after the phrase it asserted was struck, and
  how this tool's predecessor was satisfied by the lap convened to attack it.
- **Permitted:** an assertion whose subject is the **file as an artifact** — that it is text, that its citations
  resolve. These make no claim about any verdict, and **no behaviour of the tool, right or wrong, can satisfy
  them**, so they cannot launder a behavioural pass, which is the only thing L009 exists to prevent.
- **The test to apply to any future addition:** could this assertion pass because the tool WORKS, or fail because
  it is BROKEN? If yes, it drives a fixture. If it is orthogonal to every verdict, it is an artifact test.

**Why I think it is right, and the honest counter.** For: the citation repair is worthless without it, and a rule
weakened silently is worse than one amended with its condition. Against: **this is a rule being narrowed by the
seat that wanted it narrowed**, one lap after the room found that the same file's predecessor was satisfied by the
seat that had an interest in it. That parallel is close enough that I would rather B rule than nod. **If B finds
the carve-out too wide, the four artifact tests belong in a separate file and the rule stands unamended** — that
costs a third file and nothing else, and I did not take that option only because my named files were two.

## 6 · THE BARS

    node consonance/tools/boundary-check.test.js
      RED FIRST (repairs not yet applied):  27 tests · 23 pass · 4 fail   — the four artifact tests
      AFTER:                                27 tests · 27 pass · 0 fail
      in place, with NO env override: the repo walk-up resolves, so the suite runs as it always did

    node scratchpad/bc/mutants.js          (8 mutants, each on a FRESH copy of the landed files)
      caught   M1 raw NUL re-inserted        by  ARTIFACT: the source is text
      caught   M2 citation back to a line    by  ARTIFACT: no main.rs citation is a LINE NUMBER
      caught   M3 symbol that does not exist by  ARTIFACT: every main.rs symbol still exists
      caught   M4 BUILDING.md path reverted  by  ARTIFACT: the BUILDING.md path resolves…
      caught   M5 clause dropped again       by  ARTIFACT: the BUILDING.md path resolves…
      caught   M6 NUL "fixed" with a space   by  a pane name containing the separator cannot collide…
      caught   M7 CONTROL seal retroactive   by  a lap opened AFTER the dispatch does not cover it
      NOT APPLIED  M8 CONTROL anchor absent  — reported loudly, never counted as caught
      7 caught · 0 SURVIVED · 1 NOT APPLIED

    grep bars, on the landed file
      wc -l 307 == grep -c "" 307 · grep -n prints line numbers · indexOf(0) === -1
      a grep for source line citations returns nothing

    node consonance/tools/boundary-check.js
      identical to the pre-repair run in every figure and in shape: DENOMINATOR 231, NUMERATOR 52,
      "257 board line(s) unreadable", FIRES 21 of 231, exit 1. The only differing line is the
      citation it prints, which is the repair.

**Each mutant names the test that caught it.** That is deliberate: tonight's T5 showed a defect can be "caught" by
a test aimed at something else entirely, so a bare count is not evidence.

## 7 · CORRECTIONS, INCLUDING FIVE TO MYSELF

- **I wrote five raw NUL bytes into THIS hand-back**, in the passages describing the NUL repair, and did not notice
  until I checked the file. A shell escape collapsed in a `node -e` string, and the file I was writing about the
  defect acquired the defect. **Fixed by rewriting the file through an editor rather than a shell**, and the byte
  is written `<NUL>` in prose throughout. It is the same root as the nine bad line numbers below: **a tool used
  without checking what it produced.** Worth recording rather than quietly repairing, because it is the strongest
  evidence I have that repair 1 is about a habit and not about one file.
- **M6 SURVIVED on the first mutant run.** My first separator test used a fixture that does not actually collide
  once `dispatch()` prefixes the chair stamp, so replacing the NUL with a space left the suite green. Replaced with
  a fixture built from `boardRow` directly, where two distinct panes produce one key under any printable separator.
  M6 is now caught. **The first version of that test would have passed forever while proving nothing** — the same
  shape as mutant Y6 in my P-LEAVE work on 09-15.
- **My artifact tests were broken by my own build method.** They resolved the repo with a fixed two-level walk up
  from the test file, which lands in the scratchpad under a copy — so they failed on the copy for the wrong reason.
  Now: an explicit `CONSONANCE_REPO` override, else a walk-up for the tree, else **fail loudly**. Not a skip: a
  citation check that could not run is not a pass, which is the defect this whole tool replaces.
- **My reflow silently broke a mutant anchor.** Rewrapping the restored clause across a line break made M5's anchor
  unmatchable; the harness reported **NOT APPLIED** rather than counting it, which is exactly A's P-LEAVE-3 lesson
  doing its job on me. Anchor re-pinned and M5 re-verified as caught.
- **Nine line citations in my T2 hand-back last night were wrong** — estimated from an unnumbered `cat` rather than
  produced by a command. Re-derived and corrected in an appendix to `handback/t2-echo_2026-09-16.md`. Only one was
  right. **I wrote a section about a stale line citation while producing nine of my own in the same document.**

## 8 · WHAT I DID NOT VERIFY

- **The js-suite ran, and it does not mean quite what it looks like.**

      node consonance/tools/js-suite.js
      js-suite: 95 green · 4 failed · 0 crashed · 0 silent · 1 canary · 0 not-run  (of 100)
      ok      consonance/tools/boundary-check.test.js
      FAILED: actors.evidence · carrier-drift · forget-rate · portable-paths
      canary (declared EXPECTED-RED): targetless-pull

  **My file is green inside the suite, and none of the four failures is a file I touched.** But this is **not a
  clean measurement of my change and I will not present it as one:** three other seats were editing this working
  tree while it ran (14 files dirty repo-wide), and a partial run of mine ten minutes earlier showed
  `state-sync.test.js` failing, which this run shows passing. **The failing set moves for reasons that are not
  mine.** My own 09-15 note recorded a third baseline again (93 green · 6 failed · 1 canary). All I claim is the
  narrow thing: my file is green, and nothing I changed appears in the failures.
- **Whether `fn chair_inject_exec` is the ONLY place the stamp is applied.** A grep for the stamp in `main.rs`
  returns one non-test occurrence, in that function, plus two assertions. If a second path ever stamps, the
  citation is incomplete rather than wrong, and no test I wrote would notice.
- **The tool's behaviour on the other machine.** Both ledgers are machine-local; every run above is D's.
- **That 307 lines is the right length.** I reflowed three comment lines I had lengthened; one line I added (the
  printed citation, 117 cols) is still longer than the file's norm, because the symbol is longer than the number it
  replaced. Four over-length lines pre-date this lap and I left them alone.
- **The FIRES verdict itself.** The tool reports 21 of 231 dispatches with no sealed lap open, and 257 unreadable
  board lines. **Both are real and neither is mine** — I confirmed only that the repairs do not change them.
- **Anything about the blind guard's zero rows.** §4. That is C's.

---

## 9 · B'S RULING, AND THE EDIT — appended ~06:2x, after `handback/p-boundary-read-B_2026-09-16.md`

**B ruled the carve-out TOO WIDE. I accept it, and the two grounds are better than my framing was.**

1. **The fence was an intent question.** B ran L009's own case through my discriminator: the Rust test that
   asserted a brief said *"No work."* and stayed green after the phrase was struck. **Its subject WAS the file's
   text and it claimed nothing about a verdict — so the letter of my permission admits it**, and only my intent
   clause excluded it. A future seat writing the same assertion while honestly believing it a text check gets in.
   **A fence a stranger cannot apply is not a fence**, and that header is written for strangers. I had tested my
   permission against my four tests and never against the case the rule was made from.
2. **Mixing costs the suite's meaning, and this half is B's own, not a restatement of mine.** Three of the four go
   red for reasons outside this tool — a rename in `main.rs`, a move of `BUILDING.md`, a reworded clause in a
   master the keeper edits by amendment. That red is *correct*, is not a statement about the tool, and would
   arrive in the number that is. **Split, the two numbers say two different things.**

**Where I was wrong, precisely:** I priced the alternative at *"a third file and nothing else"* and treated that as
a cost. B measured it as nearly free — `js-suite.js:155-161` walks recursively for every `*.test.js` with
`SKIP_DIRS` at `:150`, so the usual hazard of splitting, a file that quietly stops being run, does not exist here.
**I had named the fallback and then argued against it on a cost I never checked**, which is the same failure as the
nine line numbers and the NUL: a claim made without running the thing that would settle it. I re-derived B's
citation rather than take it — a faithful replica of that walk finds both files.

### The edit, as ruled

    1. four ARTIFACT tests -> consonance/tools/boundary-check.artifacts.test.js   (new file, 100 lines)
    2. the header amendment at boundary-check.test.js:320-341                     REMOVED
    3. the original rule at boundary-check.test.js:4-9                            UNTOUCHED (verified verbatim)
    4. the separator test at :299-318                                             STAYS (behavioural)

The new file's header records **why** it is a separate file — B's two grounds, in B's terms — so the next reader
finds the ruling rather than an unexplained split. It also carries B's §3 limit, which I had not stated: the symbol
test asserts the symbol **exists**, never that it is still the function that stamps `[chair:MAIN]`. Move the
stamping out while something keeps the name and the citation is false and green. Smaller than a line number's hole,
still a hole, and now written where the test is.

### Bars after the edit

    node consonance/tools/boundary-check.test.js             23 tests · 23 pass · 0 fail
    node consonance/tools/boundary-check.artifacts.test.js    4 tests ·  4 pass · 0 fail
    js-suite discovery: a faithful replica of discover() finds BOTH files, and the real run confirms it:
      before the split   universe: 100 test files discovered   js-suite:  95 green · 4 failed · 1 canary (of 100)
      after  the split   universe: 101 test files discovered   js-suite:  96 green · 4 failed · 1 canary (of 101)
      ok  consonance/tools/boundary-check.test.js       ok  consonance/tools/boundary-check.artifacts.test.js
      the same four failures as before, none of them a file I touched:
        actors.evidence · carrier-drift · forget-rate · portable-paths   (+ targetless-pull, declared canary)
      **+1 discovered, +1 green, 0 not-run** — nothing needed registering, and the new file did not
      arrive as an untested file that merely exists. The caveat from §8 still holds: other seats were
      editing this tree, so the failing SET is not a clean measurement of my change. The discovery
      count is, because it is arithmetic on file count rather than on anyone's red.
    node consonance/tools/boundary-check.js                  runs, exit 1, same shape
    NUL check on all three files                             clean; wc -l == grep -c "" on each

    mutants, re-run across BOTH suites (8, each on a fresh copy of the landed files)
      M1 raw NUL re-inserted        red in: artifacts
      M2 citation back to a line    red in: artifacts
      M3 symbol does not exist      red in: artifacts
      M4 BUILDING.md path reverted  red in: artifacts
      M5 clause dropped again       red in: artifacts
      M6 NUL "fixed" with a space   red in: behaviour
      M7 CONTROL seal retroactive   red in: behaviour
      M8 CONTROL anchor absent      NOT APPLIED
      7 caught · 0 SURVIVED · 1 NOT APPLIED

**Every mutant reddens exactly ONE suite, and the assignment is the one B predicted** — the five text/citation
mutants land in artifacts, the two behavioural ones in behaviour, and none crosses. That is B's argument confirmed
by measurement rather than accepted on its reasoning, and it is the strongest evidence that the split is a real cut
and not a filing preference.

**One figure moved and it is not mine:** the tool now reports **236** dispatches where it reported 231 an hour ago.
Live board data, not a regression — tonight's own traffic rendered in between. NUMERATOR 52 and the 257 unreadable
board lines are unchanged.

### The NUL the chair flagged

**My `t2-echo` append is already clean** — I found and escaped those bytes in the previous turn, before this
dispatch, and re-verified now: `indexOf(0)` is -1 and `wc -l` equals `grep -c ""` at 262. The remaining raw NUL is
in **B's** read, `handback/p-boundary-read-B_2026-09-16.md` line 37, inside a table cell quoting the escape. **Not
mine to edit**, and I have not touched it. It is the same class this lap repaired, arriving in the document that
reviewed the repair, which is worth one line in the landing message and no more.
