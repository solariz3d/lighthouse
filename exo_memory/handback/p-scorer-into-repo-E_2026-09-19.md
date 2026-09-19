# P-SCORER-INTO-THE-REPO — hand-back (pane E, lap D079 chunk 2, on D)

Packet: `exo_memory/loop/plan_small_fixes_2_2026-09-19.md` row E (:20) and the order it cites,
`loop/handoff_librarian_2026-09-16_morning.md` item 2 (:8), both read at source; the layout ruling at
`librarian/2026-09-16.md:27`. Written 2026-09-19 ~09:3x by the E seat. **Nothing committed. No scorer edited.**
C's scratch was read, never written.

## 0 · Headline

**Done as specified, with two placements the handoff did not foresee, and the reproduction is exact.**

    10 files carried byte for byte   sha256 before = after for all 10; = the recorded sha for all 7 that have one
    the encoder                      NAMED as an external (147 MB, 4 files, shas in the README) — no hub revision exists to name
    one run of dev/diversity/score.mjs   results-step0.json sha256 60c7d726…2b1d0 = the recorded result, byte for byte;
                                     stdout byte-identical to the 09-15 run; NETWORK_ATTEMPTS=0; exit 0
    text-census.js                   exit 0 — and exit 0 again over a throwaway index that includes the 10 new files
    scorers edited                   none

**The two placements, both forced by not editing a scorer:** `PREREG-C1.txt` sits beside the scorer in
`dev/diversity/` (the handoff put it in `loop/diversity_c1/`; the scorer reads it from its own directory), and a
second byte copy of the strip sits there under the name the scorer loads. §2 has both.

**The limit that matters most:** the bytes now travel; the scorer does not. It reads the texts and
`phase-window.js` from the hard-coded `C:/Users/nname/Desktop/lighthouse`, and it needs the encoder beside it.
On L it runs only if the checkout is at that path and the encoder is fetched and matches. §7.

## 1 · The copies — sha printed before and after, against the recorded value

    node scratchpad/carry/carry.js      refuses to overwrite; for each file: sha256 of the source, of the copy, and the
                                        recorded sha where one exists on disk; exit 1 on any mismatch

    source (scratch)                  -> repo                                        sha256 (before = after)   recorded at
    E c1read/c1/score-step0.mjs       -> dev/diversity/score.mjs                     19c97ab5…99e2a  = rec    handback/step0-phase-E_2026-09-15.md:34
    E c1read/c1/s40-strip@5a2d3c0.cjs -> dev/diversity/s40-strip@5a2d3c0.cjs         73917f67…4e087  = rec    the scorer's S40_SHA; = git show 5a2d3c0:dev/diversity/s40-strip.js
    C c1/PREREG-C1.txt                -> dev/diversity/PREREG-C1.txt                 51ef51d3…80a2a  = rec    librarian/2026-09-15.md 09:41
    C c1/block-net.cjs                -> dev/diversity/block-net.cjs                 03fcb5b1…2cd5f  none recorded (E's and C's copies cmp-equal)
    E c1read/c1/package.json          -> dev/diversity/score-deps/package.json       7c41fbeb…88dd4  none recorded
    E c1read/c1/package-lock.json     -> dev/diversity/score-deps/package-lock.json  67f26ac5…1204c  none recorded (E's and C's cmp-equal)
    C c1/score.mjs                    -> loop/diversity_c1/score-c1-run2.mjs         ecf03768…3eafb  = rec    librarian/2026-09-15.md 09:41
    C c1/results-c1.json              -> loop/diversity_c1/results-c1.json           0d82c32c…4b71d  = rec    librarian/2026-09-15.md:62
    E c1read/c1/results-step0.json    -> loop/diversity_c1/results-step0.json        60c7d726…2b1d0  = rec    handback/step0-phase-E_2026-09-15.md:36
    E c1read/c1/score-step0.diff      -> loop/diversity_c1/score-step0.diff          ecacc774…a1a4a  = rec    librarian/2026-09-16.md:27

    10 of 10 byte-identical; 7 of 7 recorded shas equal. Full hex in scratchpad/carry/carry-out.txt.
    Plus one new file of mine, not a copy: exo_memory/loop/diversity_c1/README.md (what is where; the externals).

## 2 · Where things went, and why — rulings where the bar was silent

- **`dev/diversity/score.mjs` is MY step-0 scorer, not C's.** The name was set on 09-16 (`librarian/2026-09-16.md:27`:
  "`dev/diversity/score.mjs` from 19c97ab5…"). C's run-2 scorer is the RECORD step 0 diffs against, so it went to
  `loop/diversity_c1/` as `score-c1-run2.mjs` — renamed so two files called `score.mjs` with different bytes never
  sit in one repo. Renaming changes no byte; the scorer never reads its own name.
- **`PREREG-C1.txt` is in `dev/diversity/`, not in `loop/diversity_c1/` where the handoff put it.** The scorer reads
  and hashes it from its own directory (`score.mjs:116`, `path.join(here, 'PREREG-C1.txt')`), and editing the
  scorer is out of bounds this lap. So it sits where the instrument needs it, ONCE, and the README in
  `loop/diversity_c1/` points at it. Two copies of one registration would be two files to drift.
- **The strip is carried a second time, and that IS a duplicate.** `s40-strip@5a2d3c0.cjs` is byte-identical to the
  tracked `dev/diversity/s40-strip.js` (both 73917f67…), but the scorer loads it by the `@5a2d3c0.cjs` name
  (`score.mjs:22`) and must not be edited. Named here so nobody "cleans it up" into a broken scorer.
- **`block-net.cjs` is carried** because the registered run command is `node --require ./block-net.cjs score.mjs`;
  the run's `NETWORK_ATTEMPTS=` line is its evidence the encoder was not fetched mid-run.
- **The package files went into `dev/diversity/score-deps/`, not beside the scorer.** Their `package.json` says
  `"type": "module"`. In `dev/diversity/` that would turn the directory's CommonJS `.js` files (`phase-window.js`,
  `redact.js`, `s40-strip.js` and their tests) into ES modules. Checked the other way round: with the new files in
  place, `node dev/diversity/<x>.test.js` is phase-window 13/0, redact 28/0, s40-strip 12/0.
- **Not carried:** C's `score.run1.mjs` and `results-c1.run1.json` (run 1 — the handoff says "both results files",
  which I read as C's and step 0's, the two the chain of custody names), the texts dirs, the `mut/` dirs, and every
  investigation script of mine (`indep.mjs`, `phase.mjs`, `cmp-runs.cjs`, `bar.cjs`, `tokprobe.mjs`). They stay in
  the scratchpads; say if any of them was meant.

## 3 · The gte encoder — NAMED AS AN EXTERNAL, not carried

`Alibaba-NLP/gte-base-en-v1.5`, the q8 onnx, 147 MB in four files, listed with size and sha256 in
`loop/diversity_c1/README.md` (`find models -type f -exec sha256sum {} \;` in my scratch). The one the scorer checks:
`onnx/model_quantized.onnx` 146,540,971 B, sha256 e7f6af7a…6509 (`score.mjs:37`). **Not carried** — 146 MB in git
and on the stick for a file fetchable by id, and the plan offered "or named as an external".

**The version is weaker than the bar may assume, and I say so rather than invent one:** `download.mjs` fetched it with
`from_pretrained(id, { dtype: 'q8' })` and **no revision** — there is no hub commit on record. What pins it is the
scorer's own hash check: a different file on the hub refuses the run loudly. The three small files (tokenizer,
tokenizer config, config) are **not** hash-checked by the scorer; their shas are in the README so a re-fetch can be
compared by hand. Runtime: `@huggingface/transformers` 4.2.0 (lock carried), `onnxruntime-node` 1.24.3 (from the
installed tree, `node_modules/onnxruntime-node/package.json`), node v24.14.1 today; the 09-15 runs' node was not
recorded.

## 4 · One run of the committed scorer

The COMMITTED bytes, run from a scratch directory, because the scorer writes its output beside itself and needs
the 147 MB encoder beside itself — running it inside `dev/diversity/` would have put both into the shared tree:

    <scratch>/carry/run/  = score.mjs, s40-strip@5a2d3c0.cjs, PREREG-C1.txt, block-net.cjs copied FROM THE REPO
                            (sha256 re-printed there: 19c97ab5… 73917f67… 51ef51d3… 03fcb5b1…, all equal)
                          + models/ and node_modules/ as JUNCTIONS to my 09-15 scratch (the externals, unchanged)
    cd <scratch>/carry/run && node --require ./block-net.cjs score.mjs > out.txt 2> err.txt

    start 09:11:21 · end 09:45:57 · exit 0 · stderr NETWORK_ATTEMPTS=0 []
    sha256sum results-step0.json   60c7d726cf746cfb14cfa85bc71edbf6cd1911940f7317bbd617a028b212b1d0   = recorded
    cmp results-step0.json <09-15 results-step0.json>   identical
    cmp out.txt <09-15 step0-out.txt>                   identical

**No difference to state.** One observation that is not a difference: the run took **34 min 36 s** against **15 min
59 s** on 09-15 (`step0-time.txt`: 12:44:14 → 13:00:13). Same bytes out; I did not measure why (other seats were
building and testing on D during the run — not checked).

## 5 · text-census

    node consonance/tools/text-census.js
      -> "2166 tracked file(s) scanned, 0 with a raw NUL, 18 allowed (allowed is NOT fixed)."  exit 0

**That green says nothing about the new files: the census walks `git ls-files`, and nothing here is committed.** So it
was run a second time against a THROWAWAY copy of the index with the ten copies added intent-to-add:

    cp .git/index <scratch>/index.tmp
    GIT_INDEX_FILE=<scratch>/index.tmp git add -N -- <the ten paths>
    GIT_INDEX_FILE=<scratch>/index.tmp node consonance/tools/text-census.js
      -> "2176 tracked file(s) scanned, 0 with a raw NUL, 18 allowed"  exit 0      (2166 + 10)

The shared index was not touched: `sha256sum .git/index` 29581367… before and after. (README.md was written after this
run; a direct scan of it and of all ten copies found 0 NUL and 0 other control bytes — `node -e` over the files.)

## 6 · Corrections, including mine

- **A sha typo of mine, caught before filing:** this file first gave the strip as `73917f67…9e087`; the real tail is
  `…4e087`. Caught by checking every abbreviated sha in this file against the full hex in `carry-out.txt` (a
  loop over `grep -o`), 10 ok, 1 BAD, fixed. The README's abbreviations came through the same check.
- **The census's first green was vacuous for this lap** (§5) — I nearly reported "text-census exit 0" as covering
  the new files. It walks `git ls-files`; nothing new is tracked. Re-run over a throwaway index.
- **The handoff's layout and the scorer disagree** on where the prereg lives; I followed the scorer (§2). This is a
  departure from the letter of `handoff_librarian_2026-09-16_morning.md` item 2, stated rather than hidden.

## 7 · NOT verified

- **Nothing on L.** The scorer as written reads texts and `phase-window.js` from `C:/Users/nname/Desktop/lighthouse`
  (`score.mjs:17`, `:27`); on a machine whose checkout is elsewhere it fails before scoring. Carrying it into the repo
  makes the BYTES travel; it does not make the scorer portable. That needs an edit, which this lap forbade.
- **`npm ci` from `score-deps/` was not run.** The reproduction used the 09-15 `node_modules` through a junction.
  Whether a fresh install from the carried lock reproduces the result is untested.
- **A fresh encoder fetch was not tried.** Whether the hub still serves e7f6af7a… is unknown.
- **C's run-2 scorer was not re-run** — the bar asks for one run of the committed scorer, and E's 09-15 re-run
  (7e94c93) already reproduced C's `results-c1.json` byte for byte. It sits in the repo as a record, runnable only
  with the same siblings beside it.
- **Nothing is committed**, so "the instrument travels" is true only after the chair lands these paths by name.
