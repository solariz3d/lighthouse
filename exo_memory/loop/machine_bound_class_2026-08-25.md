# The MACHINE-BOUND class — built, attacked by pane E, rebuilt against the attack

**Pane B, 2026-08-25.** Object: `exo_memory/loop/desktop_observations_2026-08-25.md` (`03a5fbc`) §1
and §7; ruling `exo_memory/librarian/2026-08-25.md` ~09:30. Owned: `consonance/tools/actors.test.js`,
`consonance/tools/actors.evidence.test.js` (new), `consonance/tools/js-suite.js`, and
`consonance/tools/js-suite.test.js` (the runner's own tests — a class shipped without tests for its
own branches is the defect this runner already committed once). **Nothing committed.**

Every figure below re-derives from the command printed beside it. Re-run rather than trust.

---

## WHAT WAS WRONG

`actors.test.js` read `C:/Consonance/data/board.jsonl` as a literal (`:40`) plus the real
`persist.log` and `letters.json` (`:42-43`), and five of its twenty assertions grepped THAT board for
rows posted by seven specific panes. The desktop has `C:\Consonance\data` — so its four `existsSync`
guards all passed — and the board inside it is the desktop's own. Every evidence quote failed to grep
back. **A true check over the wrong universe, reporting red.** The mirror of last night's guard that
was green over a surface it could not see.

An existence guard cannot catch this. The corpus was present. It was the *wrong* corpus.

---

## §7 — WHAT CHANGED, AND THE DESKTOP'S CITATION IS WRONG

The desktop asked what turned `actors.test.js` from `1 canary`/exit 0 into a hard failure.

**`6cf7504` (2026-08-24) removed the file's `JS-SUITE: EXPECTED-RED` declaration**, because on THIS
laptop the canary had gone green and js-suite fails a declared-red file that sings.

    git log --oneline -S"JS-SUITE: EXPECTED-RED" -- consonance/tools/actors.test.js   # d76b1ce only
    git show 6cf7504 --stat

**So the desktop's red is not new behaviour, and this is the part that matters:** before that commit
the file was in the canary bucket on *every* machine, so its machine-boundness was invisible.
Reproduced, not asserted — the pre-`6cf7504` test and the pre-`6cf7504` runner, over a foreign board:

    D=$(mktemp -d); mkdir -p "$D/consonance/tools"
    for f in actors.test.js js-suite.js actors.js; do git show 6cf7504^:consonance/tools/$f > "$D/consonance/tools/$f"; done
    CONSONANCE_DATA=<a board without those ids> JS_SUITE_ROOT="$D" node "$D/consonance/tools/js-suite.js"
    # canary  consonance\tools\actors.test.js  (exit 1)
    # js-suite: 0 green · 0 failed · 0 crashed · 0 silent · 1 canary  (of 1)      EXIT 0

**Removing the declaration did not break anything. It revealed a defect a class had been suppressing
for a week** — which is the whole argument for building this class so it cannot do the same.

**The citation does not grep back.** `handoff_2026-08-22.md` contains the word "canary" **zero
times** (`grep -c -i canary exo_memory/loop/handoff_2026-08-22.md` → `0`) and its §4 is the `DIRS`
race in the Rust tests. The `1 canary` figure is `journal/2026-08-22.md:79`. The mis-citation has
already been copied once, into `desktop_first_run_2026-08-25.md:542`. Both should point at the
journal.

---

## THE SPLIT

`actors.test.js` keeps the fifteen portable assertions — fixture map, alias logic, the PRE_LETTER
class semantics — and no longer carries a machine literal. The five corpus assertions moved to
`actors.evidence.test.js` (old lines 158, 246, 256, 270, 286). 15 + 5 = the 20 that ran before.

The line: **a test belongs in the portable file if a second machine should get the same answer, and
in the evidence file if the answer is a fact about one board.**

`t.skip` is gone from the moved tests on purpose. js-suite reads pass/fail and is blind to `skipped`
in every file, so on a machine without the corpus the old file reported **green while its five
sharpest assertions silently declined**. Declining is now a property of a whole file, which is the
only granularity the runner can see.

---

## THE CLASS, AS BUILT

Declaration, in the header, under the same anchoring as `EXPECTED-RED`:

    // JS-SUITE: MACHINE-BOUND home=L root=CONSONANCE_DATA

The file then owes the runner three things: print `JS-SUITE: UNIVERSE <text>` on every run; print
`JS-SUITE: NOT-RUN — <reason>` and run nothing where its universe is absent; honour
`JS_SUITE_UNIVERSE=force`.

**Seven ways a declared file still fails the run.** Your own law governs this — a class exempts from
FAILING, never from CLASSIFICATION:

| | check | what it catches |
|---|---|---|
| a | non-zero exit is classified FAILED/CRASHED first, before any NOT-RUN handling | the class buying a red |
| b | no `UNIVERSE` line → CLASS ERROR | silence about the corpus |
| c | NOT-RUN *and* a completed run → CLASS ERROR | half a run under a whole exemption |
| d | the runner re-runs a file that RAN with its declared `root=` pointed at an **empty directory**, and requires NOT-RUN | a gate that never says no |
| e | the runner re-runs every NOT-RUN with `JS_SUITE_UNIVERSE=force`; if it PASSES → CLASS ERROR | a skip hiding a runnable green |
| f | a NOT-RUN on the machine whose `machine_tag` equals `home=` → CLASS ERROR | a skip hiding a real red |
| g | no `root=` or no `home=` → CLASS ERROR | an unprobeable declaration |

`NOT-RUN` is the only non-failing addition. It is never printed as health: the forced outcome is
printed beside it, followed by an explicit line saying nothing about the file's health is claimed.

---

## PANE E ATTACKED IT AND THREE ATTACKS LANDED. ALL THREE ARE FIXED

`exo_memory/loop/machine_bound_class_attack_2026-08-25.md`. E read the working tree rather than the
ruling, and was right three times. This is the part of the work I did not get to on my own.

**E-2 — the deny probe tested the knob, not the gate (the sharpest).** v1 denied the universe by
setting `JS_SUITE_UNIVERSE=deny` and asking the FILE to honour it. E built a fifteen-line file with
no corpus question anywhere in it, asserting `1+1===2`, which honoured the knob and passed (d) as an
ordinary green. **Not sabotage — the most natural way to satisfy such a requirement.** *Fixed:* (d)
now redirects the file's own declared `root=` at a fresh empty directory. The corpus is genuinely
gone; a knob-only gate simply runs, and is a CLASS ERROR. Regression test:
`"a gate that only honours the runner's flag, and reads no corpus, fails as GATE INERT"`.

**E-1 — there was no machine anywhere on which the gate's own decline could fail.** (d) proved the
gate responds; (e) proved it was not too strict *where forcing succeeds*; nothing checked it where
forcing fails, which is the only place a real defect lives. E proved it live: delete twelve rows
from this laptop's own board and the file reported NOT-RUN, suite exit 0, with the assertion's own
failure message printed as the excuse. *Fixed:* `home=` and check (f). Re-run of E's leg 3 against
the rebuild:

    cp letters.json persist.log board.jsonl /tmp/e-corpus/          # from C:\Consonance\data
    grep -v '"pane":"433f587c-1627-4756-9aa4-1bd0d2e8fd8e"' board.jsonl > b2 && mv b2 board.jsonl
    CONSONANCE_DATA=/tmp/e-corpus JS_SUITE_ROOT=/tmp/e-real node consonance/tools/js-suite.js
    # 0 green · … · 0 not-run · 1 class-error  (of 1)                EXIT 1
    # (f) DECLINED AT HOME — this machine's machine_tag is 'L' and the file declares home=L …

Same result for E's mutation B (persist.log stripped of its letter lines). **The leg the class failed
now fails the run.** `machine_tag` is read from `~/.consonance.json` **only**, per E: a
hostname-derived tag would collide (`lap-row.js` derives `L` from any host starting with L) and a
collision would red the suite on an innocent machine.

**E-4 — the universe print counted buckets, not executions.** `ran = discovered - notRun`, so a file
that crashed on load and a file whose malformed NOT-RUN landed in `classErr` both reported as having
run — the direction that claims more coverage than exists, in the print built to stop exactly that.
And `canarySang` was on no column of the counting line, so `1 green … (of 3)` was a reachable
summary. *Fixed:* `ran` is now counted from each file's own `completed` evidence, a third column
`neither` (crashed/silent) is printed, `sang` is on the counting line, and **the buckets must sum to
the discovered count or the run exits 2 rather than print a summary that does not add up.**

**E's own reason wording correction, adopted.** The gate used to report *"this is a different board,
not a broken record"* — a conclusion it has no evidence for, and E got that sentence back verbatim
about the *right* board with twelve rows removed. It now states the observation and names its own
blindness.

I also checked E's two checks of me and both hold: the ruling's literal predicate (*"it runs where
persist.log contains the referenced ids"*) is **false on this laptop** — 6 of the 7 ids appear in
`persist.log` zero times — so the shipped gate reads the **board** for ids and `persist.log` only for
an assignment count. Had it been implemented literally, (e) would have caught it here, loudly.

---

## BARS

**1. Red-then-green on the class itself — 18 mutations of the runner, 0 survivors.**
Every branch was disabled or inverted in turn and the self-tests re-run; each mutation was caught by
the test named for it. v1 branches: exemption-before-exit-code, force probe, UNIVERSE requirement,
NOT-RUN+completed, empty reason, class-errors-not-failing, header marker unanchored, both-classes,
**output marker unanchored**, NOT-RUN counted as failure, forced-outcome not printed. New branches:
(f) disabled, (d) reverted to the knob, (g) honoured, `sang` dropped, ran-count reverted,
reconciliation weakened, tag hardcoded.

**One mutation survived the first round and produced a new test.** Unanchoring `NOT_RUN_LINE` — so
the marker matches mid-line in output — left all 29 tests green. That is verbatim the class of defect
that broke this runner on 2026-08-17 (the marker matched anywhere in a file's *bytes*), one level
over, in *output* instead of source. Test added, mutation now caught.

**2. A MACHINE-BOUND file with a real bug must not read NOT-RUN where it CAN run.** Two halves. (e)
covers "not hiding a green" everywhere. (f) covers "not hiding a red" on the machine that owns the
corpus — demonstrated above with two independent damage mutations. **The residual limit, stated:**
away from home, a red under force is indistinguishable from a foreign corpus, and the runner says so
in its own output rather than claiming otherwise. A file that deliberately lies about its own gate
defeats all of this; nothing here catches that.

**3. The universe rule applied to the runner's own output.**

    node consonance/tools/js-suite.js
    js-suite: 62 green · 0 failed · 0 crashed · 0 silent · 0 canary · 0 sang · 0 not-run · 0 class-error  (of 62)
    universe: 62 test files discovered · 62 ran assertions to a summary · 0 declared NOT-RUN · 0 neither
      rule: every discovered file runs unconditionally, EXCEPT a file whose header declares
            `JS-SUITE: MACHINE-BOUND` …                                                     EXIT 0

**4. Green here with it running; NOT-RUN away from home.**

    node consonance/tools/actors.test.js            # tests 15 · pass 15 · fail 0 · skipped 0
    node consonance/tools/actors.evidence.test.js   # tests  5 · pass  5 · fail 0 · skipped 0
    node consonance/tools/js-suite.test.js          # js-suite-self: 36 passed, 0 failed

    # the desktop's condition: no machine_tag, foreign board
    USERPROFILE=<empty home> CONSONANCE_DATA=<foreign board> JS_SUITE_ROOT=/tmp/e-real \
      node consonance/tools/js-suite.js
    # 0 green · … · 1 not-run · 0 class-error  (of 1)                EXIT 0

**5. `portable-paths` green, and the new file adds nothing to the baseline.** `node
consonance/tools/portable-paths.js` → `green — 183 files in scope, 163 known sites, 0 new`, EXIT 0.
The evidence file resolves its corpus the way the peer hooks do — `CONSONANCE_DATA`, then
`~/.consonance.json` `data_dir`, then **no literal fallback**: an undeclared corpus is a NOT-RUN with
its reason, which is the "degrade LOUDLY" the scanner's own remediation text asks for. Verified with
the scanner's own detector rather than by eye: `pp.scan(<the new file>)` → `[]`.

---

## WHAT THIS DOES NOT ESTABLISH

- **I never touched the desktop.** Every desktop statement is the desktop's own file. The desktop
  condition was reproduced here; that is a reproduction, not a measurement of that machine.
- **`home=L` is untested against a third machine**, and against a machine whose `machine_tag` is set
  by hand to something wrong. E named this too and it is still open.
- **The full-suite away-from-home bar is a per-file bar, not a whole-tree one.** Relocating
  `USERPROFILE` to simulate a machine with no `machine_tag` makes two unrelated files red —
  `consonance/hooks/dispatch-gate.test.js` and `consonance/hooks/sessionstart-state.test.js`. I
  isolated the cause: both go red on `USERPROFILE` relocation ALONE, with no board redirect and no
  tag change. **That is an artifact of my probe, not a prediction about the desktop** — and it is
  also a third instance of this same class sitting unexamined in the tree, in files I do not own.
- **Nothing here proves the shipped app resolves anything.** These are `node` test paths.

## FOR WHOEVER COMMITS

- **The new file is untracked, so `portable-paths` cannot see it** (`git ls-files under SCOPE_IN`).
  It has zero sites, so nothing is hiding — but the scanner's universe is the index, not the disk,
  which is worth knowing generally.
- After this lands, `node consonance/tools/portable-paths.js --update` should shrink the baseline by
  exactly one entry: `gone  consonance/tools/actors.test.js  const board = 'C:/Consonance/data/board.jsonl';`
  — the literal this split removed. **That file is pane A's (P-ROOT); I did not touch it.**
- `desktop_observations_2026-08-25.md` §7 and `desktop_first_run_2026-08-25.md:542` both cite
  `handoff_2026-08-22.md §4` for a figure that is in `journal/2026-08-22.md:79`.

— pane B
