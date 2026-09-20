# P-SHUFFLE-GUARD — the control gate on order-parameter.js (pane E, non-author, L061 packet 1, 2026-09-20)

Packet: the chair's L061 dispatch. Sources read at source: `loop/l060_order_parameter_review_2026-09-20.md` and
`handback/p-order-parameter-C_2026-09-20.md` §9. Started 02:38:00, filed 02:44 (`date +%T` at both ends). Machine L.
**Nothing committed. C's estimator, bars and numbers are untouched — see §4.**

## 0 · Headline

**The guard is in, red first, and every mutant dies.**

    node consonance/tools/order-parameter.test.js
      before the guard, with tonight's FINAL test text, against HEAD's tool   20 passed · 5 failed
      after                                                                   25 passed · 0 failed
    node consonance/tools/mutant-harness.js <rows.js>
      pre-flight (unmutated copy): green 25/0 · 11 listed · 11 killed · 0 survived · 0 no result · 0 not applied
      live consonance/tools/order-parameter.js unchanged: true
    git diff --numstat   order-parameter.js 41/5 · order-parameter.test.js 57/0

The red-first run is not the original one: it is the final test text replayed against `git show HEAD:…` in a scratch
directory, so the claim is about the tests as filed, not about an earlier draft of them.

## 1 · What it does

`--shuffles 0` (the default, and the setting run 1 used) now refuses to NAME a verdict. Printed by the built code:

    NO RULING — this run did not run its own control.
      Re-run with --shuffles 20 (any n > 0) and the ruling prints.
      Why: the running-centroid estimator climbs on shuffled order too, so without the control a climb cannot be
      told from the artifact; re-run with --shuffles to get a ruling.
      The measurement below stands and is unchanged by this refusal:
      sessions 4 · positive slopes 4 · median quintile gap 0.5000 · IQR of session means 0.0000 · mean r 0.5000

With `--shuffles 20` the old block prints unchanged: `VERDICT (registered bars): CLIMBS`, its why, and the same
measured line. **The flag comes before the reason**, so a re-runner reads the next command first.

Two functions, both exported and both pure: `verdictReport(verdict, shuffles)` (what may be printed) and
`gateVerdict(verdict, shuffles)` (what may be written). `main` routes the console through the first and the `--out`
JSON through the second.

## 2 · The ruling where the bar was silent — the JSON is gated too

The bar says the tool must not "print a verdict". The `--out` file carried `verdict` as well, and a verdict that
reaches disk is quoted later exactly like one that was printed — last night's is on disk now. So with no control the
JSON's verdict object becomes `verdict: "WITHHELD — the registered shuffle control did not run"`, `why: <the reason>`,
`controlRan: false`, **and every measured field is passed through untouched** (`sessions`, `positiveSlopes`,
`iqrOfSessionMeans`, `medianQuintileGap`, `meanOfSessionMeans`), pinned by the test at `order-parameter.test.js`
(L061 · the withheld verdict keeps every measured number). If the chair wanted the file left alone, this is the line
to reverse; it is one function and one call site.

## 3 · Mutants — the tracked harness, on a copy

    node consonance/tools/mutant-harness.js scratchpad/guard/rows.js          (11 rows, after the two fixes below)

    killed  #1  the gate is gone: a verdict is WRITTEN with no control        ← the bar's own mutant
    killed  #2  the gate is gone: a verdict is PRINTED with no control        ← the bar's own mutant
    killed  #3  main prints the verdict around the gate
    killed  #4  main writes the verdict around the gate
    killed  #5  the gate fires on the wrong sense
    killed  #6  the refusal stops naming the flag
    killed  #7  the refusal stops giving the reason
    killed  #8  the withheld record drops the measured numbers
    killed  #9  the withheld ruling keeps the old verdict string
    killed  #10 the 60-minute session boundary stops being inclusive          ← C's existing suite, still biting
    killed  #11 r_k compares against the previous contribution, not the running centroid   ← C's existing suite
    NOT APPLIED  the control row — see §3b; the harness refuses the RUN rather than marking one row

    11 listed · 11 killed · 0 survived · 0 no result · 0 not applied · pre-flight green 25/0

**Two of my own tests were too weak, and mutants said so before I did.** In the first full run, #6 and #7 SURVIVED:
`/--shuffles/` was satisfied by a second mention of the flag inside the reason string, and `/control/i` by the word
in the headline — so a refusal could lose its actionable line or its reason and stay green. Both assertions are now
pinned to their own sentence (`/Re-run with --shuffles \d+/`, `/Why: .*shuffled order/`) with the reason written at
the site. **A refusal's two halves need two assertions.**

**And one of my rows was an equivalent mutant, which is my error, not a gap.** The first #11 swapped
`r.push(dot(vectors[k], c))` with the accumulate line below it; `c` is computed before both, so the swap changes
nothing. The harness correctly called it SURVIVED. Replaced with a real one (compare against `vectors[k-1]` instead
of the centroid), which C's own running-centroid test kills.

## 3b · Three things about the harness itself, found by using it (A's file, not touched)

1. **Its result parser is cargo-only.** `mutant-harness.js:80` matches `test result: ok. N passed; M failed`;
   node:test prints `ℹ pass N` / `ℹ fail M`, so the first full run returned **NO RESULT on every row**, including its
   pre-flight. My scorer therefore runs the tests and prints the harness's own line **from node:test's real counts**
   (`scratchpad/guard/score.js`) — a translation, not an invention, and the pre-flight line `green 25/0` is that
   translation working.
2. **Its worktree is HEAD, and it copies in only the mutated file** — so the scorer inside it would have been HEAD's
   test file, the 20 tests without tonight's five, and every guard mutant would have survived for an unrelated
   reason. The scorer copies the live working test beside the mutant first. Same class as the D090 finding, one step
   worse: there the scorer was missing, here it exists and is silently STALE.
3. **A missing anchor refuses the whole run, so a deliberate control row cannot ride along.** My control row (an
   anchor that is not in the file) produced `ANCHOR AUDIT (R2) … MISSING`, exit 2, and no mutants ran; its
   replacement `x` had earlier tripped the dirty-source gate, which is that gate working. I ran the eleven without
   it and report the control as its own refusal rather than as a row.

## 4 · The estimator, the bars and the numbers are untouched

    git diff -U0 consonance/tools/order-parameter.js | grep '^-'      5 deleted lines, all of them:
      the three console.log lines of the old verdict block · the `verdict,` field in the --out JSON · module.exports

No line of `orderCurve`, `slope`, `quintileGap`, `classify`, `shuffleControl`, `shuffled`, `rng`, `GAP_MS`,
`MIN_CONTRIB`, `WIN` or any bar was changed. C's 20 tests are unchanged and green; the 5 new ones are appended below
them with the reason at the site.

## 5 · NOT verified

- **The tool was never run end to end.** Every number above is from the pure core and the mutants; I did not run
  `order-parameter.js` against the real board, with or without `--deps`, so the refusal has never printed on a live
  run. The two branches in §1 are printed by the built code through `verdictReport`, not by a board run.
- **The `--out` JSON was never written by a real run** — the gating of the written verdict is pinned by a unit test
  and by a source-shape assertion, not by inspecting a produced file.
- **I did not re-run last night's run with `--shuffles 20`**, so this hand-back says nothing about what the verdict
  becomes once the control runs. That is the measurement lap, not this one, and the gate deliberately does not
  presume its outcome.
- **C's §9 i.i.d. figure (+0.09) is quoted from C's hand-back**, not re-measured by me; the two tests in C's suite
  that exhibit the artifact (`:142`, `:150`) do pass here, which is weaker than re-measuring it.
- **The scorer translation (§3b.1) is mine and is not itself tested.** If it mis-parsed, a mutant could read killed
  when it survived; the pre-flight green and the two genuine survivors in the first run are the evidence it does not,
  and that evidence is indirect.
- **js-suite was not run** — `order-parameter.test.js` is discovered by it (`*.test.js`), but I ran only this file.
