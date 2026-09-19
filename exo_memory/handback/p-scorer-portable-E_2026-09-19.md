# P-SCORER-PORTABLE — hand-back (pane E, lap D081 / night run N1, on D) — DRAFT, appended as it goes

Packet: `exo_memory/loop/plan_night_run_2026-09-19.md:50` (N1, the E half), read at source at 583fbce, and the
librarian's added bars in the dispatch. Started 2026-09-19 10:3x by the E seat. **Nothing committed.**

## 0 · Status

**DONE. The bar is met in every line.** `dev/diversity/score-portable.mjs` differs from the hashed `score.mjs` in ONE
place — how the repo root is found — and both, run once each on D side by side, wrote **byte-identical results equal to
the registered 60c7d726…**, with identical stdout and no network attempt. `score.mjs` is 19c97ab5… before and after.
The fast checks are 8/0; mutants 7 of 7 caught. The questions I did not ask are §6; the limits §7.

## 1 · The original, before

    sha256sum dev/diversity/score.mjs     19c97ab513f722d3b1d5084740d4ddea9206451046fd8ed15e02889743199e2a   (10:3x, = D079's)

## 2 · The design, decided before writing any code

`REPO` in `score.mjs` is used in exactly two ways (`grep -n REPO dev/diversity/score.mjs`: :17 the constant, :28
`phase-window.js`, :46/:48/:49 the three `git -C REPO` calls) and never written into the results, so how it is found
cannot change an output byte. The scorer cannot simply ask git for the checkout it sits in, because it is RUN outside
the repo: it writes `results-step0.json` beside itself and needs the 147 MB encoder beside itself
(`loop/diversity_c1/README.md`, "Run"). So the portable file finds the root in this order, and nothing else changes:

1. `LIGHTHOUSE_REPO`, if set — refused unless `<it>/dev/diversity/phase-window.js` exists.
2. else the git checkout the scorer file itself sits in (`git -C <here> rev-parse --show-toplevel`) — refused on the
   same check.
3. else it THROWS, naming both. **No fallback to the old hard-coded path** — a silent fallback is how a moved checkout
   would score against a stale one.

## 3 · Built (10:3x)

    node scratchpad/portable/make.js      replaces ONE line of score.mjs (:17) with the resolver; refuses unless the anchor
                                          matches exactly once and the target does not exist; prints score.mjs's sha on both sides
      score.mjs before   19c97ab513f722d3b1d5084740d4ddea9206451046fd8ed15e02889743199e2a
      score.mjs after    19c97ab513f722d3b1d5084740d4ddea9206451046fd8ed15e02889743199e2a
    git diff --no-index --stat dev/diversity/score.mjs dev/diversity/score-portable.mjs     16 insertions, 1 deletion
    sha256sum dev/diversity/score-portable.mjs         3f3087c295b49683e4b7a2c8564ff6e58d80ffc476c7da285e5c3b4b046d3072
    sha256sum dev/diversity/score-portable.test.js     9561fd75259b8850b6aeba53b19c2d003492675797fd02fc10242753c1eb14a7   (at this writing)

    node dev/diversity/score-portable.test.js          7 passed, 0 failed (the fast checks)

The long run (`--run`, both scorers concurrently) started 10:31:47; its result is §4.

## 3b · Mutants on the fast checks (10:3x)

    node scratchpad/portable/mutants.js    each mutant in a FRESH throwaway checkout (`git init` in the OS temp dir) holding
                                           dev/diversity/{score.mjs, score-portable.mjs, score-portable.test.js, phase-window.js};
                                           anchor must match once; `node --check` gates INVALID; the fast checks only

    first pass:  8 applied: 6 caught · M7 SURVIVED · C0 clean · X8 NOT APPLIED
    M7 = "a git root accepted without phase-window.js" — no check covered a checkout that is NOT this repo, so the
         resolver's second guard was untested. Added: "a git checkout that is NOT this repo ... is refused, not used".
    second pass: 8 applied: 7 caught · 0 real survivors · C0 clean (8 passed) · X8 NOT APPLIED · 0 INVALID

      M1 silent fallback to the old hard-coded path     M2 LIGHTHOUSE_REPO ignored     M3 LIGHTHOUSE_REPO not validated
      M4 the checkout it sits in not consulted          M5 a second change elsewhere (WIN 1800 -> 1801)
      M6 the HASHED ORIGINAL edited                     M7 a git root accepted without phase-window.js
      (which check caught each: scratchpad/portable/mutants-out.txt)

    node dev/diversity/score-portable.test.js          8 passed, 0 failed
    sha256sum dev/diversity/score-portable.test.js     af9e12309a94e9f32f7c38f8470ee24b23c2e857b0b8186bb86c0fab82891ca0   (final; supersedes §3's)

**The long run was started BEFORE the M7 check was added**, so it ran the earlier test text. The two texts differ only
by that one fast check (`--run`'s code is unchanged); §4's numbers are from the run as started.

## 4 · One run of each file on D — the equivalence

    DIVERSITY_EXTERNALS=<my scratch>/c1read/c1  DIVERSITY_RUN_DIR=<my scratch>/portable/runs       node dev/diversity/score-portable.test.js --run
    (stages each scorer, with s40-strip@5a2d3c0.cjs, PREREG-C1.txt and block-net.cjs copied from the repo and
     models/ + node_modules/ as junctions to the externals, into its own directory; the original runs with
     LIGHTHOUSE_REPO removed from its environment, the portable one with it set to the checkout)

    start 10:31:47 · end 11:07:28 · exit 0 · 12 passed, 0 failed
    original   exit 0   2137 s   NETWORK_ATTEMPTS=0   results sha256 60c7d726cf746cfb14cfa85bc71edbf6cd1911940f7317bbd617a028b212b1d0
    portable   exit 0   2140 s   NETWORK_ATTEMPTS=0   results sha256 60c7d726cf746cfb14cfa85bc71edbf6cd1911940f7317bbd617a028b212b1d0
    results-step0.json byte-identical between the two · equal to the registered result · stdout byte-identical

    re-hashed after, by hand (sha256sum):
      <run>/original/score.mjs             19c97ab513f722d3b1d5084740d4ddea9206451046fd8ed15e02889743199e2a
      <run>/portable/score-portable.mjs    3f3087c295b49683e4b7a2c8564ff6e58d80ffc476c7da285e5c3b4b046d3072
      dev/diversity/score.mjs              19c97ab513f722d3b1d5084740d4ddea9206451046fd8ed15e02889743199e2a   (the original, after)

**Each took ~35.6 min concurrently**, a hair over the librarian's expected 16–35; one run alone at D079 took
34m36s, so running both at once cost almost nothing. <run> = scratchpad/portable/runs/score-portable-ZIbitD.

## 5 · Corrections, including mine

- **`:27` is `:28`, and the wrong number is mine.** The plan cites the phase-window line as `score.mjs:27`; it is
  `:28` (`grep -n "PW_PATH = " dev/diversity/score.mjs` → 28; `:27` is the comment above it). The plan took it from
  MY D079 hand-back (`handback/p-scorer-into-repo-E_2026-09-19.md` §7), where I read it off a `sed -n 26,32p`
  window and counted from the wrong end. That hand-back is landed and keeps its text; this is the correction. `:17`
  is right.
- **My first test set had a hole a mutant found (M7, §3b):** the resolver's "is this the lighthouse checkout" guard
  on the git branch was never exercised; any enclosing repo would have been accepted. Fixed before filing.

## 6 · Questions I did not put to anyone (the keeper is asleep) — the conservative default taken

1. **The variable's name, `LIGHTHOUSE_REPO`.** Default: a new, specific name rather than reusing anything the app
   sets (`CONSONANCE_DATA` names a data dir, not a checkout). Rename it by editing one line of a file nobody has
   registered yet — cheap now, not after T1 cites it.
2. **Which file T1 registers.** Default: NOTHING changes in the registration. `score.mjs` (19c97ab5…) stays the
   instrument of record; `score-portable.mjs` is a convenience whose equivalence is proven on D by §4, and it is not
   registered by this lap. Whether step 1 may be computed with the portable file is the chair's to rule (N2).
3. **No fallback to the old path.** Default: throw. A caller on D who relied on running the file from a scratch dir
   with no variable set must now set `LIGHTHOUSE_REPO` — the test's `--run` does.

## 7 · NOT verified

- **Nothing on L, and no checkout at another path.** Portability is shown by the resolver's checks (a temp dir, a
  foreign `git init`, the env pointing at the real checkout) and by one full run on D with the root supplied by the
  variable. A full run against a checkout at a DIFFERENT path was not made; the texts come from `git show` at fixed
  shas, so any clone holding those commits should serve, but that is reasoned, not run.
- **The git-toplevel branch has never scored a real run.** A real run needs the encoder beside the scorer, so it runs
  outside the repo, so it takes the variable branch. The toplevel branch is exercised only by the fast checks.
- **`npm ci` from `score-deps/` and a fresh encoder fetch** — still untried, as at D079.
