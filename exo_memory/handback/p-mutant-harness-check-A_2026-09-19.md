# P-MUTANT-HARNESS-CHECK · ALPHA — the dirty-source check now judges at the anchor's position, and the harness is tracked

**Pane A, machine D, 2026-09-19 10:3x–11:0x.** Lap D081, N1 (A half). Packet: `loop/plan_night_run_2026-09-19.md:50`,
the N1 row: *"its mutant harness's dirty-source check, misfired five laps running
(`handback/p-address-refusal-pointer-A_2026-09-19.md` §4) — compare the replacement against the anchor's position, not
the whole file."* The librarian's bars: say where the harness lives; if it is only in scratch, land it tracked with a
test that goes red first on the exact misfire; touch no product file.

**Two new files, both untracked: `consonance/tools/mutant-harness.js` and `consonance/tools/mutant-harness.test.js`.
No product file and no other file was touched.** Nothing is committed.

---

## 0 · WHERE THE HARNESS LIVED — only in scratch

There was one copy per lap, each a whole script edited from the last one:
`<scratchpad>/{leave2_rust,leave3_rust,redact,seal,second_instance,suggestion_off,refusal_pointer,address_pointer}_mutants.js`
(`ls <scratchpad> | grep mutants`). The newest, `address_pointer_mutants.js`, differs from the one before it only in
its rows, file, test filter and labels (`diff suggestion_off_mutants.js address_pointer_mutants.js`). The check, verbatim:

    const dirty = M.filter((m) => original.includes(m[2]));

It is now tracked as `consonance/tools/mutant-harness.js`. The per-lap part (the rows, the file, the scoring command)
moves into a rows module passed on the command line:

    node consonance/tools/mutant-harness.js <rows.js> [--only <n>] [--audit]

`--audit` runs the three gates only. Without it the tool works on a detached worktree of HEAD under the OS temp dir,
with the live file's working text copied in and its own `CARGO_TARGET_DIR`:
- the live file is hashed before and after, and a changed hash exits 2;
- the worktree is removed in `finally`;
- a mutant that does not compile is NO RESULT, never counted as killed;
- a survivor prints what it became.

The order is L061's: shape → dirty source → anchors → mutate.

## 1 · THE CHECK — what changed

```js
function carriesMutation(source, from, to) {
  if (!source.includes(from)) return source.includes(to);
  return to.includes(from) && source.includes(to);
}
```

- **The anchor is present** (the case that misfired). Its text is intact, so the replacement can stand at the anchor's
  position only if it contains the anchor, that is, an insertion before or after it. Any occurrence of such a
  replacement contains an occurrence of the anchor, so it necessarily stands on one. **Finding it anywhere IS finding
  it at the anchor's position.** A replacement that does not contain the anchor cannot be there, however often it
  appears elsewhere. That is the D078 #4 case, and the D071, D073, D076 and D077 refusals I recorded as the same limit.
- **The anchor is absent.** There is no position to compare at, so the replacement anywhere is still reported as a
  possible leftover. This cannot refuse a run that would otherwise proceed, because the anchor gate refuses a missing
  anchor either way. It keeps L061's diagnosis: RESTORE, rather than "an edit rewrote the line", which would invite
  re-pointing the anchor onto the mutation.
- **Side effect:** L061's own limit is fixed with it. A leftover mutation no longer names every row whose replacement
  appears somewhere; it names its own row.

## 2 · BARS — the command beside every number

    RED FIRST (the tool with the scratch rule, `return source.includes(to)`, verbatim in behaviour):
      node consonance/tools/mutant-harness.test.js         8 passed, 4 failed · exit 1
        FAIL THE MISFIRE: a replacement that already stands ELSEWHERE in the file is not a leftover mutation
        FAIL THE MISFIRE, through the gates: D078 #4 as written passes all three
             (the refusal printed: "#1 the address branch posts the out-of-turn row instead
              found: "                text: refused_attempt_row(&who, &text),"")
        FAIL a leftover mutation names ONLY its own row … (the L061 limit) — at "clean source must pass", the same misfire
        FAIL CLI --audit: the misfire case exits 0 and says the rows pass — exit 2
      The misfire fixture is mcp.rs at 136bdc9 :797-799 and :816-818, copied verbatim into the test.

    GREEN:
      node consonance/tools/mutant-harness.test.js         12 passed, 0 failed · exit 0

    ON THE REAL FILE — D078's six rows AS FIRST WRITTEN (<scratchpad>/address_pointer_list.txt; #4's replacement is
    `text: refused_attempt_row(&who, &text),`, not the `&text.clone()` I bent it to at D078), mcp.rs clean at 136bdc9:
      the scratch rule, same rows, same file (node -e …includes(m[2]) over <scratchpad>/d078_rows.js)   flags #4
      node consonance/tools/mutant-harness.js <scratchpad>/d078_rows.js --audit                          6 rows pass · exit 0
      node consonance/tools/mutant-harness.js <scratchpad>/d078_rows.js --only 4                         exit 0
        pre-flight (unmutated copy): green 10/0
        killed #4 (…address_refusal_pointer_tests::the_address_branch_posts_the_attempt_and_returns_the_same_text,
                   …refusal_pointer_tests::an_admitted_call_does_not_post_the_row)  — the same two tests as at D078
        1 listed · 1 killed · 0 survived · 0 no result · 0 not applied
        live consonance/src-tauri/src/mcp.rs unchanged: true
      git worktree list  ->  only the checkout (the tool removed its worktree)

    MUTANTS on the check itself, on a COPY (<scratchpad>/harness_check_mutants.js: each row mutates
    <scratchpad>/mutant-harness.copy.js and runs the test with MUTANT_HARNESS_UNDER_TEST pointing at it; the rows pass
    the tool's own gates first; the live tool is hashed before and after):
      pre-flight, unmutated copy: 12 passed, 0 failed
      8 listed · 8 killed · 0 survived · 0 NOT APPLIED · live mutant-harness.js unchanged: true
        #1 the whole-file check restored                    the misfire ×2, the L061 row, CLI misfire
        #2 anchor absent: never a leftover                  leftover-in-place, the L061 row, possible-leftover diagnosis
        #3 anchor present: never a leftover                 the INSERTION and PREFIX leftovers
        #4 the insertion test inverted                      6 tests
        #5 the dirty gate judges nothing                    5 tests
        #6 the anchor diagnosis outranks the leftover one   the possible-leftover diagnosis
        #7 the CLI runs past a refusal                      CLI leftover exits 2
        #8 the anchor gate accepts two matches              the two-matches test

    JS SUITE — node consonance/tools/js-suite.js (10:3x–10:5x, exit 0). I piped it through `tail -15`, which CUT THE
    TOTALS LINE, so there is no suite count here. Its tail shows:
      - a canary (targetless-pull, expected red);
      - FAILED dev/shell/hooks/userprompt_pulse.test.js, one of the six known reds (D has no Python);
      - FAILED consonance/tools/state-sync.test.js, 74 passed, 1 failed. That file is NOT in the 10:1x baseline's six reds.
    state-sync, run alone three times (node consonance/tools/state-sync.test.js):
      74/1 (this red), 74/1, then 75/0. It is INTERMITTENT, and I did not capture the name of the failing test: my
      grep for "FAIL" matched nothing in the first rerun, and the third run was green.
    It is not mine: `git status --short` shows state-sync.js and state-sync.test.js unmodified, and nothing references
    mutant-harness (`grep -n mutant-harness consonance/tools/state-sync*.js` → nothing).
    js-suite discovers every *.test.js under consonance/tools (js-suite.js:161). I did not confirm from this run's output
    that mutant-harness.test.js was one of the green ones; alone it is 12/0.

## 3 · CORRECTIONS, INCLUDING TO MYSELF

- **The first green version was more code than the rule.** It listed every anchor occurrence and every offset of the
  anchor inside the replacement, and tested alignment with `startsWith(to, i - k)`. Its first mutant run was 9 listed ·
  6 killed · 3 survived: the alignment replaced by `includes`, only the first offset kept, and the `i - k >= 0` guard
  dropped. I worked all three by hand and found them equivalent, for the reason in §1: a replacement that contains the
  anchor and occurs in the source always sits on an anchor occurrence. I did not add a test to kill them. I reduced the
  function to the two lines in §1, with that reason in its comment, and re-ran on a new list (§2, 8/8).
- **I got my own `eval` of the old row list wrong once** (a trailing `;`). That was a scratch parse error, not a
  harness result; it was re-run.

## 4 · OPEN QUESTIONS — the conservative default was taken; the keeper is asleep and none was asked

1. **Four TRACKED harnesses carry the same whole-file check, and I did not touch them:**
   - `consonance/tools/close.mutants.js:125`
   - `consonance/tools/state-sync.mutants.js:244`
   - `dev/place-conversations.mutants.js:78`
   - `dev/tail-carry.mutants.js:460` — this one is **in C's uncommitted tree now** (P-FLUSH-BEFORE-DONE)

   (`grep -n "alreadyMutated" -r consonance/tools dev --include=*.js`)

   The packet named my harness, and the bar says no other file. **Default:** name them; do not edit them. Each could
   `require('../../consonance/tools/mutant-harness.js').carriesMutation` (or a relative path) in a later lap, after C
   lands.
2. **Where the tool lives.** `consonance/tools/`, beside the other tracked instruments, and not `dev/`. js-suite picks
   up `*.test.js` there, so the test now runs with the suite.

## 5 · WHAT I DID NOT VERIFY

- **Only one row of the full mutate path ran through the tracked tool** (`--only 4`, §2). The other five D078 rows
  passed its gates but were not built and scored.
- **The tool scores cargo output only** (`test result: …`). The mutants on the harness itself ran from a scratch
  script, because the tool has no scorer for a node test. For a JS target it is not yet a replacement.
- **A missing rows file ends in node's raw MODULE_NOT_FOUND stack** (seen once, by my own typo): loud, but not a
  sentence.
- **The worktree's `CARGO_TARGET_DIR` stays** under `%TEMP%\mutant-harness-<label>\target` as a build cache. Nothing
  removes it.
- **The JS suite's totals were not captured** (§2). A re-run with the full output is owed, and it should name
  state-sync's intermittent red. That red is found, not fixed, and it is not in my lane (state-sync is C's/B's).
- **Nothing on L.** Not rebuilt: the tool is JS, and no product file changed.

NEXT: librarian re-derive the bars (mutant-harness.test.js red/green, the --only 4 run) and route the four tracked harnesses and state-sync's intermittent red when the file is read
