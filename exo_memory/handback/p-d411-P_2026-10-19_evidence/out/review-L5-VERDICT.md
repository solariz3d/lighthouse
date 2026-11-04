# Verdict: js-suite 120 s kill vs gen-consumer.test.js

Both diffs take the same approach. A file can declare its own time budget on a header line (`JS-SUITE: TIMEOUT-MS`), the budget is capped, gen-consumer.test.js declares 300 000 ms, and the 120 s default for every other file is unchanged. Neither diff deletes or weakens an existing test; both only add tests.

What I ran, all through `node review/hr.js -- …`:
- `js-suite.test.js` with each diff applied: **X 51/0, Y 48/0**.
- A 12-case probe (`probe.js`, kept outside the repo) that runs the patched runner against one-file fixture trees, with `JS_SUITE_TIMEOUT_MS=1000` and `JS_SUITE_MAX_TIMEOUT_MS=10000`.

I did **not** rerun the full suite or gen-consumer.test.js through the runner. Both authors did, and both report gen-consumer is now FAIL (it reaches its summary; its 41 failures are the missing `exo_memory/` in this checkout) rather than a timeout CRASH. The probes confirm that each runner honours the line its own diff added: X's `=300000` form, and Y's space form at line 22, inside the 40-line header window.

## Probe results

| declaration in fixture | X | Y |
|---|---|---|
| `TIMEOUT-MS=300000`, 2.5 s file | CLASS error (X's own form is `=`, and this is honoured) | **CRASH, no explanation**: the `=` form silently falls back to the 1 s default |
| `TIMEOUT-MS 300000`, 2.5 s file | CLASS error (wrong form, refused out loud) | green |
| `TIMEOUT-MS 3e5`, a *fast* green file | CLASS error | **CRASH**: `(\d+)` reads `3`, so the file is killed after 3 ms |
| `TIMEOUT-MS 300_000`, 2.5 s file | CLASS error | **CRASH after 300 ms**, no explanation |
| `TIMEOUT-MS 0` | CLASS error | silently uses the default |
| `TIMEOUT-MS 999999999`, 2.5 s file | CLASS error ("above the cap") | **green**: silently clamped to 5× the default |
| block comment ` * JS-SUITE: TIMEOUT-MS=…` | ignored, killed at 1 s, `TIMED OUT after 1000 ms` | ignored, CRASH |
| undeclared hang | CRASH + `TIMED OUT after 1000 ms` | CRASH (looks like any other crash) |
| `TIMEOUT-MS=5`, green file | CRASH, `TIMED OUT after 5 ms`, budget shown on the row | n/a (`=` form ignored) |

## X

- **Correct?** Yes.
  - A declared budget still ends in a kill, and the kill is CRASH.
  - The cap is 600 s (`JS_SUITE_MAX_TIMEOUT_MS`).
  - A budget that is over the cap, zero, malformed, or written in the wrong form is a CLASS error that fails the run. It is never clamped and never quietly replaced by the default.
  - Every kill prints `TIMED OUT after N ms`, so a hang no longer looks like any other crash. This works on Windows: `e.code === 'ETIMEDOUT'`, confirmed by probe.
  - A raised budget is printed on the file's row next to how long the file took, so a file creeping toward its limit is visible.
  - The new header section, THE TIME BUDGET, documents all of this.
  - A self-test pins gen-consumer's declaration to the range (default, cap].
- **Edge cases / nits (none blocking):**
  - A file whose budget is refused still runs once on the default budget before being classed. That can waste up to 120 s, but the result is still red.
  - `budgetDecl` is parsed twice: once in `runFile` and once in the loop.
  - A refused file's row reads `CLASS … (exit timeout/signal)`, which is a slightly confusing label.
  - Budgets *below* the default are allowed (e.g. 5 ms). That fails loudly, so it hides nothing.
  - Grandchild processes are still not tree-killed. That predates this change, and the hand-back says so.
- **Cut or weakened a test?** No. It adds 6 BUDGET rows; all existing rows still pass.
- **Changes needed to land:** none. The nits above are optional.

## Y

- **Correct for the one file?** Yes. gen-consumer gets 300 s, undeclared files are unchanged, and a hang is still killed at 5× the default at most.
- **Edge cases it misses:** the parser is loose and every error is silent, which is the "suppression by quiet default" this runner's own header warns about.
  - The `=` form (`TIMEOUT-MS=300000`) is silently ignored.
  - `0` silently becomes the default.
  - `3e5` becomes 3 ms, and `300_000` becomes 300 ms. That gives false CRASHes with nothing pointing at the declaration.
  - An over-cap budget is silently clamped. In the probe, a file declaring 999 999 999 went green on a 5 s budget it never asked for.
  - A kill is not labelled as a timeout, so a real hang still reads like any other crash.
  - The cap is buried in the code as `TIMEOUT_CAP = 5` × the default and cannot be overridden from the environment. The marker is documented only in a comment at the constant; the usage header is not updated.
- **Cut or weakened a test?** No. It adds 3 rows.
  - The cap test only checks that the run took under 30 s. It does not check that the clamp is reported, because it isn't.
  - Nothing pins gen-consumer's own declaration. A later edit that breaks that line would quietly bring the 120 s CRASH back.
- **Changes needed to land:** moderate, roughly 30–50 lines plus tests:
  - anchor the value to a whole positive integer;
  - make malformed or over-cap declarations a CLASS error instead of a clamp or a fallback;
  - label timeouts in the CRASHED output;
  - add a self-test for gen-consumer's declaration.

  That is essentially rewriting it into X.

## Which to land

**X.** Both fix gen-consumer, but only X refuses a bad or over-cap budget out loud and labels every kill as a timeout, so a hang stays visible.
Y's loose `(\d+)` parse and silent clamp or fallback turn a typo into a mysterious CRASH, or an over-cap ask into a silent green. Fixing that means rebuilding X.
