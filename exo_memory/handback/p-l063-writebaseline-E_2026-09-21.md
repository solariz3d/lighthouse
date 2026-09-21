# P-L063-WRITEBASELINE — `--update` preserves what it does not generate (pane E, L063, 2026-09-21)

Packet: the chair's L063. Evidence: `handback/p-l062-rc3-C_2026-09-21.md:75-92` (C, by reading). Routing:
`librarian/2026-09-21.md` 03:36 (`25c4725`). Started 03:38:49, suite finished 03:46:35 (`date +%T`). Machine L,
HEAD `db6a49b`. **Nothing committed. `--update` was never run against the real repo or the real baseline.** Every
`--update` in this lap ran against a temp fixture with a temp baseline (`PORTABLE_PATHS_ROOT`/`PORTABLE_PATHS_BASELINE`).
The `portable-paths.baseline.json` diff in the tree (+218/-1) is C's, not mine.

## 0 · Headline

**C's reading was right on both counts, and it is now proven by running the code.** Both were red against HEAD's
tool: a hand-added field (`why`) was **dropped** (`actual: undefined`), and a hand-corrected verdict was **reset**
(`actual: 'FATAL-DEFAULT'`, `expected: 'BENIGN-TEST'`). Both are green after the fix.

`writeBaseline(sites, prior)` now starts each surviving row **from its prior row**. Every field the tool does not
generate is carried, and the prior verdict wins over today's `classify()`. The identity fields (`file`, `detector`,
`text`, `key`) are always today's, because they are what makes it the same site. A kept verdict that disagrees with
the classifier is **printed**, so a hand correction is never invisible and a classifier improvement can still be
seen and taken by hand.

## 1 · The call the packet left to me: should `--update` refuse to bless new sites wholesale?

**No, it should keep blessing wholesale, but never invisibly. It now NAMES every site it blesses.**

The argument, in three facts:
1. **Refusing would break existing tests, and the standing rule forbids that.** HEAD's test file has **12** calls of
   the form `runGuard(root, baseline, ['--update'])` (`git show HEAD:consonance/tools/portable-paths.test.js | grep -c`
   on that string → 12). Each bootstraps a fixture over a tree with unbaselined sites, including *THE MUTATION PROOF*,
   *THE BAR* and both `.py` proofs. A refusing `--update` would turn every one of them red, and they are not wrong.
2. **The tool's own instruction depends on it:** *"If the site is genuinely benign … run --update and let the
   baseline diff carry the argument."* Wholesale blessing is the documented mechanism. The safety was meant to be
   the diff review.
3. **The actual failure C found was that the review had nothing to review:** the old output said
   `baseline written — N sites` and a tally, and nothing else. A blessing that no line of output names is a
   blessing nobody reviewed. So the fix goes after the invisibility, not the mechanism:

       portable-paths: baseline written — N sites · B newly blessed · D dropped · K hand verdict(s) kept over the classifier
         {…the FILE's tally, kept verdicts included…}
         + FATAL-DEFAULT              consonance/tools/clean.js:3        ← one line per newly blessed site
         - REVIEW                     consonance/…                      ← one line per dropped row
         = BENIGN-TEST                …:line  (classifier says FATAL-DEFAULT)   ← one per kept disagreement

**What that does NOT buy, stated so nobody over-reads it:** a seat can still run `--update` and commit every new site
unread. The names are on screen and in the run's output, not in the committed file. A `--bless <key>` mode is the
stronger form. It is a new feature, and I did not build it.

## 2 · Test first — red, then green, with the commands

Three tests, appended to `consonance/tools/portable-paths.test.js` under `L063 (pane E)`, all on temp fixtures:
- *L063: a field the tool does not generate survives --update*
- *L063: a hand-corrected verdict survives --update*
- *L063: --update NAMES each site it newly blesses, rather than only counting them*

Each fixture first asserts that its own premise holds (the planted site is baselined and classifies FATAL-DEFAULT),
so a broken fixture fails as "fixture broken" rather than passing for the wrong reason.

    RED    HEAD's tool (git show HEAD:… into scratch/l063/head), the final test text, --test-name-pattern=L063   0 pass · 3 fail
           actual: undefined (why) · actual: 'FATAL-DEFAULT' (verdict) · actual: 'baseline written — 1 sites\n {"FATAL-DEFAULT":1}\n'
    GREEN  node --test --test-name-pattern="L063" consonance/tools/portable-paths.test.js       3 / 0
    WHOLE  node consonance/tools/portable-paths.test.js                                         41 / 2
           node --test consonance/tools/portable-paths.test.js                                  41 / 2
           node --test --test-concurrency=4 consonance/tools/portable-paths.test.js             41 / 2
           the two red: "the real repo is green against its committed baseline" and "the green line says how many
           baselined sites are FATAL" — the two the chair named red at HEAD, which need the repo green (§4)
    MUTANTS node scratchpad/l063/mutants.js    (a copy of the tool beside a copy of the test; L063 filter)
           GREEN 3/0 pre-flight
           KILLED prior row not spread (fields dropped again) · classifier verdict wins over the kept one
                  · main stops passing the prior baseline · newly blessed sites no longer named
                  · newly blessed count dropped from the summary
           5 listed · 5 killed · 0 survived
    SUITE  node consonance/tools/js-suite.js   108 green · 2 failed · 1 canary · 0 class-error (of 111)
           FAILED portable-paths.test.js (the two above) · actors.evidence.test.js (§4, not mine this lap)

`git diff --numstat`: `portable-paths.js` 37/8 · `portable-paths.test.js` 64/0.

## 3 · Corrections, including mine

- **My own tests add a site to the guard they test.** The planted line is a drive literal inside
  `portable-paths.test.js`. The first draft had it twice, and each copy is a separate site for the real guard (key =
  file + text + occurrence). I hoisted it into one constant, `L063_PLANT`, so **exactly one** new BENIGN-TEST site
  remains: `consonance/tools/portable-paths.test.js:645`. It needs a baseline row, which is C's file. I did not
  write it.
- **One more site that is mine, from the previous lap:** my R-C1 test title at `consonance/tools/live-follow.test.js:39`
  (*"…rather than reading a guessed C:\\ path"*) was a new BENIGN-TEST site. It is **no longer listed as unbaselined**
  on the current run, so C appears to have taken it into the baseline. I did not check the row.
- **The stdout tally briefly disagreed with the file.** My first version wrote the kept verdicts into the file's
  `counts` but printed `tally(sites)`, the classifier's view. It is now fixed so that one number is printed from one
  source (`r.counts`). No test caught this; I found it by reading my own diff.
- **This lap's red-first used a `git show HEAD:` copy in scratch**, not a stash on the shared checkout. That was the
  correction I owed from R-C1 §5.

## 4 · What the real repo shows now (read-only check, no `--update`)

    node consonance/tools/portable-paths.js      RED — 2 machine-specific path(s) not in the baseline
      consonance/tools/portable-paths.test.js:645    my L063_PLANT (§3) — needs a BENIGN-TEST row
      consonance/tools/state-sync.js:141             held in R-C1, landing order there

So the two HEAD-red tests go green when those two are settled, and neither needs this fix.

**Not this packet, but found while running the suite, and it is the R4 prediction coming true:**
`actors.evidence.test.js` is red again on `'trailer-gate'`. My R4 hand-back said this would happen the moment
`trailer-gate` posted on L, and that the repair is the same one-word `NON_PANE` addition (`mcp.rs:634`). It has now
posted. That is `actors.js`, which is not mine this lap.

## 5 · NOT verified

- **The real baseline was not rewritten by the new code**, by instruction. So whether today's real baseline, with C's
  hand-added rows, round-trips intact through the new `writeBaseline` is proven on fixtures, not on the file itself.
  The first real `--update` after this lands should show `0 newly blessed` for the rows C added and keep their fields;
  its output now says so line by line.
- **Top-level unknown fields** in the baseline (beside `_`, `generated_by`, `counts`, `sites`) are still rebuilt. The
  packet named rows, and I did not extend preservation to the header.
- **A row whose site moved to a new key** (its text changed) is a new site with a fresh row; its hand fields do not
  follow it. That is correct under the key's definition, but a reworded line loses its `why`. The `-`/`+` pair in the
  output is where a reader sees that happen.
