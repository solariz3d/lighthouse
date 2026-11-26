# D677 BUILD 1 (C1), the repair round: Sharp's probe starts as the corner does (pane O, 2026-11-26)

**The order:** the chair, 22:14:06Z. It answers pane A's read of `9e79648`
(`exo_memory/handback/p-c1-landing-read-A_2026-11-26.md`, blob `bf08575f`, NOT CLEAN), F1 to F4.
**Tier:** prove it. The rows were red first.
**BASE:** `C:\Users\nname\Downloads\t180-fresh`, branch `o-c1-landing-start`, `9e79648..44885ef`, pushed after the scans.
The worktree is `G:/consonance-scratch/o-c1`.

## What changed (6 files, +49/−7)

| file | what |
|---|---|
| `src/core/extend.js` | `landingKind(doc, first)`: the kind a piece with no cup or tube target starts as. It is a cup when a cup is typed as a landing's start after a bare flight, and the head's kind (`D.endKind`) otherwise. This is extend's own rule (`startTyped && given(f0.c)`), named so another reader can use it. Exported. extend's own kind line is untouched. |
| `src/core/sharp.js` | `probe()` takes its kind from `landingKind(doc, opts.first)` (F1) and carries `er: from.er.v` (F2). |
| `test/core_landing_xsec.test.js` | 3 rows: F1, F2, F3 |
| `test/core_landing_xsec_mutation.test.js` | 3 mutants (S2, S3, X11); its tests-ran floor goes 17 → 20 |
| `CHANGELOG.md` | the Changed entry's Sharp sentence is rewritten, and the Jump-after-a-jump sentence is added. A Fixed entry is added for the right edge. |
| `MAP.md` | the sharp.js line names `landingKind` and both edges |

### For the landing pane: the lines touched, to merge with pane B's BUILD 2 (Sharp, reds only), which also touches sharp.js

- **`src/core/sharp.js:20`**: the `require` line. It now also takes `landingKind`.
- **`src/core/sharp.js:96-97`** (was `:96`, one line): inside `probe()`, the `if (from)` branch's first statement. The new line 96 is a comment. Line 97 is
  `const kind = landingKind(doc, opts.first), first = { …, e: from.e.v, er: from.er.v, s: from.s.v };`.
- Nothing else in sharp.js changes: not `faults`, `green`, `tightestSharp`, `extendSharp`, nor the rest of `probe()`.
- `src/core/extend.js:918-922` is new, after `landingStart`. `:1181` is the export line, which adds `landingKind`.

## F1: the probe's KIND (fixed)

Sharp's tightest radius at angle 90°, ramp 4, corner 100 m, measured by `G:/consonance-scratch/o-c1-sharp2.js` on each tree:

| after the flight | before (`9e79648`) | after (`44885ef`) | a take-off already so |
|---|---|---|---|
| cup 70 typed on a plain take-off | 68.1 | **117.8** | 117.8 (a cup-70 take-off) |
| cup 70 typed on a tube take-off (t 200, width 31) | 120.5 | **117.8** | 117.8 (a cup-70 take-off at width 31) |

A measured 71.5 and 121.1 on its own setup, and my figures differ in setup only. The relation is the same: before the fix the typed cup read below
the reference, and now it is equal to it.

**Row** `C-4 (Sharp, KIND, A's F1)`: Sharp's tightest radius for a cup typed after a plain take-off, and after a tube take-off, equals that of a
take-off already at that cup. **Red at `9e79648`** (68.1 against 117.8); green after.

## F2: the probe's RIGHT EDGE (fixed; older than C1)

The probe dropped `er`, so it read a road's right edge as equal to its left. This is on every track, with or without a flight.

| head (cup 40, bowl, no flight) | turning +90° before → after | turning −90° before → after |
|---|---|---|
| e 5, er 30 | 45.2 → **114.5** | not run |
| e 5, er 60 | 45.2 → **123.1** | 45.2 → 45.2 |
| e 60, er 60 (the reference) | 123.1 → 123.1 | 123.1 → 123.1 |

The e5/er30 row's "before" was measured at the base `ceb21f5` (`G:/consonance-scratch/o-c1-er30.js`). With no flight, C1 did not change the probe's path there.
My first draft of the CHANGELOG quoted 64.9 for that head, which is the after-flight figure; I measured the no-flight head and corrected it to 45.2
before committing.

So after the fix the raised right edge reads as the mirror of a raised left edge. After a flight, with er typed on an e5/er5 take-off, the typed and
reference cases were already equal before (A's "69.4 both"). Both were wrong the same way: er 30 at +90° went 64.9 → **114.5**, and er 60 went
70.7 → **123.1**.

**Whether a verdict was wrong (A saw none):** yes, one. On the e5/er30 head with no flight, turning +90°, measured by
`G:/consonance-scratch/o-c1-sharp-er.js` (it lays the corner, then a 120 m straight, and runs the validator on the 30 m before the corner and everything after):

| R | before (base `ceb21f5`) | after |
|---|---|---|
| 70 | laid, no flags | laid, no flags |
| 90 | **laid, amber `load-sustained`** | refused `SHARP_TOO_TIGHT` |
| 120 | laid, no flags | laid, no flags |

R 70 laid clean on both trees, below the 114.5 tightest: that is A's side note, that the faults are not monotone in R, and it is not touched
here.

**Row** `Sharp (RIGHT EDGE, A's F2)`: on a road with e 5 / er 60, a +90° turn reads the same as the −90° turn on its mirror (e 60 / er 5), with and
without a flight. **Red at `9e79648`** (45.2 against 123.1); green after.

## F3: my account was wrong. Jump straight after a jump lays at the typed start

BUILD 1's hand-back said: "jump.js: Jump after a flight is refused JUMP_AFTER_JUMP, so its take-off never sees `afterFlight`." **That is wrong**, and
A's F3 is right. `jumpHere` lays Extend's piece with the panel's options first (jump.js:58), and only then the jump. So after a bare flight, the
road piece starts at the typed cross-section. Only `jumpHere(flight, null)` (no options) is refused `JUMP_AFTER_JUMP`.

**Row** `C-2 (Jump, A's F3)`: after a bare flight, `jumpHere` with width 18 typed lays piece 3 at width 18, and with no options it is still refused.
**Red at the base `ceb21f5`** (26 against 18); green at `9e79648` and after. It is a row for the behaviour C1 brought, not for this repair.

## F4, as A wrote it

> Among the 27 copies in `G:/consonance-scratch/o-smooth-work/tracks`, **t21 has one**: piece 23 of 24, landing on road, open. Fixture F7 has one
> too. Neither ENDS in a flight, so O's conclusion stands: no saved track reaches the changed path.

So my "none has a flight" was wrong as worded. The conclusion it served, that no saved track reaches the changed path, stands. The new reader
`landingKind` also reads only a track that ends in a flight, so the same holds for it. Without a flight, the probe changes for any road whose
right edge differs from its left (F2), and that is the Fixed entry.

## Runs

All runs under heavy-run at BelowNormal, with TEMP on G:. The first attempt never ran: heavy-run gave up after 30 min behind P's exclusive landing
hold. Separately, my new mutant ids had lost their quote escapes and did not parse. I fixed them and re-ran after the hold cleared.

| what | command | result |
|---|---|---|
| the eight test files that reach Sharp or C1 | `node --test --test-concurrency=2` over `test/core_sharp`, `test/core_landing_xsec`, `app/test/core-landing-xsec-panel`, `app/test/core-readout-display`, `app/test/core-startline-creep`, `test/ailine_vertical`, `test/core_close_banks_lap`, `test/core_sculpt_modes` | **189 tests, 188 pass, 0 fail, 1 skipped** (the skip is in the tree already: "the default brush is a HILL …") |
| the landing harness | `node --test --test-concurrency=1 test/core_landing_xsec_mutation.test.js` | **20/20**: the control, the D352 crash stand-in, and **18 of 18 mutants applied and caught** (X1–X11, S1–S3, P1–P4) |
| the three new rows red first | `--test-name-pattern="A's F"` at `9e79648`; the F3 row at `ceb21f5` | F1 and F2 red at `9e79648`, F3 green there; F3 red at `ceb21f5` (26 against 18) |
| existing harnesses that mutate sharp.js | `git grep` over the test folders' `*mutation*` files | none besides mine. My anchor check (`o-c1-anchors.js`, 419 edits, 140 anchors) finds 0 changed by the branch |

Not re-run for this repair: the seven extend.js harnesses (387/387 at `9e79648`), the fast suite, and his tracks. extend.js gains a new
function and an export, and no line of `extend()` changes. The landing pane runs the full suite.

## Scans

`push-gate.js decide` gives `allow`; `landing-train.js privacyScan` is ok with 0 found. The push published one commit, `9e79648..44885ef`.

Seat: pane O (sibling-36313935)
