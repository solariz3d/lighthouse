# P-CITECHECK — the false-green in the room's only prose guard. L043, pane A.

Packet: `exo_memory/loop/packet_citecheck_falsegreen_2026-09-07.md`. Time: ~55 minutes.
Owned and touched: `consonance/tools/cite-check.js`, `consonance/tools/cite-check.test.js`,
this file, `exo_memory/map/A.md`. Nothing committed. Nothing rebuilt.

**Headline, and it is not the packet's.** The indent strip is real and I reproduced it, but its
realized cost in verify is **zero** — no citation in this corpus was auto-greening because of it.
The defect **under** it is live and 1046 sites wide: `verify` returned **GREEN whenever there was
no figure to check**, including for a command that exited **127, command-not-found**. The strip
was one road into a green that could not lose; the green that could not lose was the defect.

---

## 1 · RED FIRST — the site, reproduced before anything was touched

Shipped `cite-check.js:73-74`:

    const inCode = inFence || /^\s{4,}/.test(line);
    const figures = inCode ? [] : [...stripped.matchAll(FIGURE_RE)].map(m => m[0].trim());

Fixture — the *same* sentence, the *same* wrong figure, the *same* command, differing only in four
leading spaces:

    # fixture

        The suite has 999 tests passing (`node -e "console.log(42)"`).

    Not indented: the suite has 999 tests passing (`node -e "console.log(42)"`).

`node consonance/tools/cite-check.js <fixture> --run` on the shipped tool:

    L   3  GREEN   `node -e "console.log(42)"`
    L   5  RED     `node -e "console.log(42)"`
           figure(s) 999 not in output: 42

The lint header on that same run read `1 figure-bearing lines` — the indented figure was not even
in the denominator, so the rate was computed over a universe that excluded it.

Five tests were written against the shipped tool and **all five went red before any fix**:

    ✖ lint: an indented figure is scanned, not dropped
    ✖ lint: an indented figure line is FLAGGED indented
    ✖ verify: a citation with NO figure to check is VOID — never GREEN
    ✖ verify: VOID is not a green even when the command succeeds and prints numbers
    ✖ END TO END: the same wrong figure goes RED indented and RED unindented

## 2 · WHAT THE STRIP WAS FOR — said before it was touched, as the packet required

It is the indented-code sibling of the fence strip one line above it. **In markdown a four-space
indent *is* a code block** — that is the spec, not a guess — so the strip was reading the document
the way a renderer would, and skipping what a renderer would set in monospace.

**And it cannot be repaired by a better rule, because the ambiguity is in markdown, not in the
regex.** This room writes its bars blocks, power tables, mutation counts and shelf figures at
exactly four spaces. The packet's own §3 BARS block is four-space indented. There is **no textual
difference** between an indented result table and an indented claim table; the same bytes render
the same way and mean different things.

So I took §5's permission and **did not write a heuristic.** What changed is not the classification
but the *decision*: the tool no longer decides.

- **Indented lines are scanned** and carry `row.indented` (`cite-check.js:93-94`).
- **The lint prints the count and says it cannot classify them** (`:152-155`) — "This guard CANNOT
  tell an indented code block from indented prose — markdown does not either — so it counts them
  and declines to classify them. Read those lines yourself."
- **The fence strip stays**, and that is the principled line: *a fence is an authorial act, an
  indent is a typographic accident.* The writer who typed ``` said "this is output." The writer who
  typed four spaces said nothing.

## 3 · THE FINDING — the number, and it is smaller than the packet expected in the half that
matters

Corpus: **737 `.md` files** (repo tree minus `.git`, `node_modules`, `attic`, `target`, `vendor`,
`dist` — my definition, stated because a different exclusion list moves every figure below).

    figure-bearing lines SEEN — before : 3919
    figure-bearing lines SEEN — after  : 4360
    newly visible                      :  441   = 10.1% of the true universe
    files affected                     :  119 of 737
    LINT split before                  :  715 cited / 3204 uncited
    LINT split after                   :  718 cited / 3642 uncited

Worst individual documents, by share of their own figures that were invisible:

    exo_memory/handback/p-loop-logo_2026-09-02.md     19 of 25  (76%)
    exo_memory/handback/p-l039-read-B_2026-09-07.md   11 of 13  (85%)
    exo_memory/map/B.md                               20 of 99

**And now the part that does not flatter the packet or me.** For VERIFY — the half that returns a
verdict — the strip's realized cost is **zero**:

    citations whose figure set went from EMPTY to non-empty : 0
    citations whose figure set changed size at all          : 4  (each 3->4 or 4->5 figures)
    indented figure-lines sitting in a cited block          : 3

All four changed citations are inline references, not commands
(`battery_attack:63,104,115`, `second_vantage_attack §6`,
`objectives_not_only_falsifiers_2026-09-01.md:5`, `chain_indicator_idea_2026-08-30.md`), so they
land on NOT-RUN either way. **The packet's "every figure this room has ever cite-checked inside an
indented block was never checked, and read as checked" is not true of this corpus — measured, that
set is empty.** The indent defect is a **lint-visibility** defect of 441 lines and a **verify**
defect of 0. It is worth fixing because the fixture proves it *can* green a wrong figure, not
because it has.

## 4 · THE DEFECT UNDERNEATH, which is live and 1046 sites wide

The false-green never needed indentation. `verify` computed `missing` from the figure list and
returned GREEN when `missing` was empty — and an **empty figure list is empty of missing figures.**
Any citation whose paragraph had no figure reported GREEN having compared nothing.

    citation INSTANCES in the corpus (main calls verify once per cite) : 1631
      of those, VOID — no figure in the paragraph                      : 1046   (64.1%)
    rows carrying at least one citation                                : 1544
      of those, VOID                                                   : 1000

**Demonstrated on a real document — my own hand-back from three hours ago.** Shipped tool:

    L  67  GREEN   `cite-check.js:29`
    L  86  GREEN   `tool_audit_tally.js:45`
    L 162  GREEN   `partition: instruments(46) + tests(55) != files(102)`

After:

    L  67  VOID    `cite-check.js:29`            no figure to check (exit 127)
    L  86  VOID    `tool_audit_tally.js:45`      no figure to check (exit 127)
    L 162  VOID    `partition: instruments(46)…` no figure to check (exit 2)

**Exit 127 is command-not-found. The shipped guard returned GREEN for a command that does not
exist**, which breaks the tool's own stated discipline in its own header (`:25`, *"NOT-RUN is never
a green and never a catch"*): the NOT-RUN branch is gated on `r.status !== 0 && missing.length`, and
`missing.length` is 0 when there are no figures, so a dead command falls through to GREEN.

**Root cause of the volume:** `CITE_RE` matches *any* parenthesised backticked span, so an inline
path, sha or identifier is read as a command. Static split of the 1046 by first token: **84 begin
with a known command name; 962 are paths, shas or identifiers** (`main.rs:4498`, `dae25f4`,
`~/.consonance/BOOT.md`, `if true`). Before the fix **all 1046 reported GREEN** regardless of which
kind they were — that is the corrected form of something I asserted mid-run and had wrong (§7).

The verdict `VOID` now covers this (`:126-127`). It is **never a green and never a catch**: it does
not set exit 1, and it is counted and printed with a line naming the cause.

## 5 · THE BLIND SPOT WAS KNOWN, NAMED, AND ROUTED AROUND — not unnoticed

`consonance/tools/librarian-route.js:75-77`, in its own header, unprompted:

    b. It treats a 4-space indent as CODE, deliberately - in a document, indented text is output.
       In a commit body the indented block IS the result table: "52.2% clean" sits inside one, and
       cite-check skips it. This tool reads indented lines as claims.

So another seat met this exact defect, **named it with a concrete cost figure**, and then
**reimplemented around it in a different tool instead of fixing the guard.** The packet's "nobody
noticed until someone tried to plant a defect there" is wrong, and what actually happened is worse
and more useful: it was noticed, written down, and left in place. The workaround made the defect
survivable, and survivable is how a defect becomes permanent. That is my 09-02 commit-gate ruling
in a second body — *a control's failure mode is silent absence* — with the added turn that here the
absence was documented and still absent.

## 6 · MUTANTS — three, each restored under md5 verification

Baseline `md5 c3fd5bc2502d89197b2bf7d0bf2f7e68`; `md5sum -c` returned OK after each.

    M1  restore the indent strip  (inFence || indented)        3 red — incl. END TO END
    M2  strip NOTHING (fence suppression removed too)          2 red — both fence tests
    M3  revert VOID to GREEN (my own fix, mutated)             2 red — both VOID tests

**Bar 2 is met in both directions.** M2 is the one that matters for the packet's warning: removing
the fence strip goes red on `lint: code blocks are output, not prose claims` (the pre-existing test)
and on the new `lint: a FENCED block is still output`. The fence strip is load-bearing and now
proven so, so this is not a false-green traded for a false-red.

## 7 · WHAT I GOT WRONG AND CORRECTED IN FLIGHT

- **The END TO END test passed on its first write, for the wrong reason.** It counted `/RED/` over
  the whole of stdout, and the legend line above the table contains the word RED — so one real red
  plus the legend read as two. I caught it because a test that was supposed to be red was green,
  and anchored the assertion to the verdict column (`^\s+L\s*\d+\s+RED\b`). Same class as the
  relaxed-twin correction in my L038 attack: *a check that does not check what you said it checks
  measures something else.*
- **Three different void counts came out of three of my own scripts: 982, 1000, 1046.** The
  authority is `main()`'s own loop, which calls `verify` once per *cite*, not per row: **1046**.
  1000 is the row count. **982 was simply my first script's fallback approximation and is wrong** —
  reported here rather than quietly dropped, because a figure that appears once in a draft is the
  class this tool exists for.
- **I asserted mid-run that the 962 non-command sites "were already landing on NOT-RUN."** The run
  showed exit 127 → GREEN. Withdrawn; the corrected statement is in §4.

## 8 · DOWNSTREAM — traced, because `verify` is exported

`consonance/tools/librarian-route.js:121` imports `{ FIGURE_RE, CITE_RE, verify }`. Its only
`verify` call sites are `:533` and `:535`, both inside a loop over `byCmd` groups that are non-empty
by construction, so **VOID cannot be produced there**. `:388` filters on `'RED'` and `:437` on
`!== 'GREEN'`; neither breaks on a new verdict name. `node --test consonance/tools/librarian-route.test.js`
→ **35 pass / 0 fail**.

No other file requires cite-check: `grep -n "cite-check"` across the four suite failures below and
their subjects returns only prose mentions in comments, no `require`.

## 9 · SUITE — bar 5

`node --test consonance/tools/cite-check.test.js` → **17 pass / 0 fail** (12 pre-existing, all still
green, plus the 5 added).

`node consonance/tools/js-suite.js` → **72 files ok / 5 failed, of 77.** It exceeds a two-minute
foreground bound and was run to a file; the count is `grep -c '^ ok'` and `grep -c '^FAIL   '` over
that file (the plain `FAIL` count is 10 because each failure prints a second `FAILED:` detail row —
a unit trap I fell into on the first read and corrected).

    ok     consonance\tools\cite-check.test.js
    ok     consonance\tools\librarian-route.test.js

    FAIL   consonance\tools\actors.evidence.test.js
    FAIL   consonance\tools\carrier-drift.test.js
    FAIL   consonance\tools\gen-consumer.fixture-scope.test.js
    FAIL   consonance\tools\gen-consumer.test.js
    FAIL   consonance\tools\portable-paths.test.js

**None of the five is mine, and that is checked rather than assumed.** `grep -rl "require.*cite-check"
consonance/tools/` returns exactly two files — `cite-check.test.js` and `librarian-route.js` — and
both are green. No failing file imports anything I touched. The tree was **14 paths dirty** during
this run with B holding `portable-paths.*`, C holding `main.rs` and E holding `harvest_guard.rs`, so
these reds belong to work in flight beside me. **I am not claiming they were red before I started —
I did not take a baseline, which I should have, and that is a gap in this hand-back, not a
conclusion about the other seats.**

## 10 · LIMITS — what this does not establish

- **I did not run `--run` over the corpus, deliberately.** That would execute ~1631 arbitrary
  strings lifted from 737 documents, and the tool's own header warns against exactly that. **1046 is
  therefore a STATIC count of sites that would VOID**, and the GREEN-on-exit-127 behaviour is
  demonstrated on three real sites plus fixtures — not on 1046.
- The **84 / 962** split is a first-token classification against a hand-written command list. It is
  an estimate of shape, not an execution, and the list is mine.
- **VOID does not set exit 1.** I followed the tool's own "never a catch" discipline. Whether VOID
  should break a build is a separate call and I did not make it.
- **NOT-RUN *does* set exit 1** (`:174`, `if (v.verdict !== 'GREEN') failed++`), which contradicts
  the same header sentence at `:25`. **Registered, not fixed** — changing a guard's exit semantics is
  outside this packet and could hide real breakage in whatever already consumes the exit code.
- `CITE_RE`'s over-match is **named, not narrowed.** Teaching it what a command looks like is a
  heuristic that rots, which is the thing §5 told me not to build. VOID makes the over-match
  *visible* instead; someone should decide separately whether the format needs a marker.
- The corpus universe (737 files, that exclusion list) is **mine, not an existing definition**. Every
  figure in §3 and §4 moves with it.
- Nothing here says the 441 newly-visible lines contain a wrong number. They contain **unchecked**
  numbers. What the fix bought is that they are now in the denominator.
- **No js-suite baseline was taken before I began**, so §9's five failures are attributed to other
  seats' in-flight work by import-tracing, not by a before/after. The import trace is solid; the
  timing claim is not.
- The lint's new indented-count line changes `cite-check`'s stdout shape. Nothing greps that output
  (`grep -rl "require.*cite-check"` → two files, neither reads stdout), but a human reading a saved
  transcript of an older run will see a different header.

## 11 · FALSIFIER, from the packet, evaluated

*"If after the fix an indented wrong figure still passes, the site was not the strip."* It does not:
the END TO END test asserts two REDs from one fixture and exit 1, and goes red under M1. **The site
was the strip — and the strip was not the whole site.**
