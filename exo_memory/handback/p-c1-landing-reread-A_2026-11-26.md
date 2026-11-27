# Re-read of C1's repair (the landing's cross-section, Sharp's probe): pane A, 2026-11-26 local (00:4xZ on the 27th), chair D677 (PROVE IT, no edits)

**Read:** only `9e79648..44885ef` (`o-c1-landing-start`, pane O's repair). My first read is
`exo_memory/handback/p-c1-landing-read-A_2026-11-26.md`. I made no edits. I did my pass and runs before reading O's account
(`exo_memory/handback/p-d677-build1-C1-repair-O_2026-11-26.md`, blob 7e18d930).

    checked: git fetch origin o-c1-landing-start → 44885ef12d20e716105f2d7653f8c6788172b1b1; git diff --stat 9e79648 44885ef
             → 6 files, 49+/7-: CHANGELOG.md, MAP.md, src/core/extend.js, src/core/sharp.js, and the two landing test files

**Verdict: NOT CLEAN, one finding, in wording only.** The code is clean, and F1 to F4 are each answered.
- The new Fixed entry in `CHANGELOG.md` says "turning right" for the case it measured at +90°, which is a LEFT turn.
- The fix is one word: "right" → "left". A "just do it" edit.

## F (new). `CHANGELOG.md`, the Fixed entry "Sharp's radius check reads the right edge as its own": the turn's direction is wrong

The entry says: "on a 5° / 30° edge turning right, Sharp read 45.2 m … it now reads 114.5 m".

- **Measured:** the 114.5 m case is the +90° turn; −90° stays at 45.2 m.

      checked: node -e on a git archive of 44885ef, head bowl {c 40, e 5, er 30}, tightestSharp ±90°, ramp 4
               → +90°: tightest 114.5, heading change +90.00 · −90°: tightest 45.2, heading change −90.00

  O's own table gives the same, "turning +90° … 45.2 → 114.5".
- **The convention:** + is left, by `src/core/sharp.js:8` ("`angle` (rad, + = left)") and the panel's own fields
  (`app/core/panel.js:364` "+ = left", `:719` "+ = left, − = right").
- It is also the physics: the raised right edge is the OUTSIDE of a left turn.

## F1: fixed. The probe takes extend's landing kind

- `src/core/extend.js:918-922` adds `landingKind(doc, first)`. It returns a cup when the track ends in a flight and `first.c`
  is given, and otherwise `D.endKind(doc)`.
- `src/core/sharp.js:96-97` uses it.
- That is extend's own rule at `extend.js:997` for a piece with no cup or tube TARGET (`startTyped && given(f0.c)`), as its
  doc comment says.
  - A cup or tube target is not lost: the probe's corner is laid with the same `opts` and takes the target's kind there,
    as the real corner does.

My 71.5 m vs 121.1 m probe, re-run (`sp.js`, angle 90°, ramp 4):

    checked: G:/consonance-scratch/a-c1read/sp.js on git archives of 9e79648 and 44885ef (G:/consonance-scratch/a-c1re/old, new)

| after the flight | probe's corner starts, 9e79648 → 44885ef | tightest, typed: 9e79648 → 44885ef | take-off already so: 9e79648 → 44885ef |
|---|---|---|---|
| width 40 on a 12 m take-off (control) | w 40 → w 40 | 19.8 → 19.8 | 19.8 → 19.8 |
| **cup 70 on a plain take-off** | c 15.5 → **c 70** | **71.5 → 121.1** | 121.1 → 121.1 |
| right edge 30 on an edge take-off | er 5 → **er 30** | 69.4 → 119.1 | 69.4 → 119.1 |
| cup 70 on a tube take-off | c 100 → **c 70** | 124.3 → 121.1 | n/a |

    checked: G:/consonance-scratch/a-c1read/sv.js 44885ef 110 → the typed case REFUSED "tightest at this width: 121.1 m", as the reference is

- The probe now starts as the corner laid starts in every case.
- Sharp no longer lays what it refuses on the equivalent take-off.

## F2: fixed, on every track, both ways

- The probe's `first` now carries `er: from.er.v` (`sharp.js:97`).
- With no flight this changes Sharp's verdict on any head whose right edge differs from its left. O's Fixed entry states
  that.
- My no-flight check shows it moves both ways:

      checked: nf.js (my first read's, unchanged) on 9e79648 and 44885ef, through heavy-run --run (G:/consonance-scratch/a-c1re/nf-old.json, nf-new.json)
               → 300 keys, 298 identical; the 2 that differ are Sharp's tightest on the "edge" head (e 12, er 6), plain and with first: 54 → 48.3

- With the right edge LOWER than the left, a left turn may now be tighter, and that is true on the road as laid:

      checked: node -e on both archives, that head, +90°: 9e79648 refuses R 48.3 and R 51 with no red (SHARP_TOO_TIGHT for an amber);
               44885ef lays R 48.3 and R 51 with no red and only the advisory load-on-the-chassis on the corner, and refuses R 48.1

- The CHANGELOG gives only the raised case (a stricter verdict). `inferred:` the looser one is the same fix. A clause would
  tell him that some corners Sharp refused before now lay. That is not a defect.
- Every other no-flight case, including his 27 track copies and F1-F9, is identical, as in my first read.

## F3: answered (O's account and a row)

- O's account says plainly that its JUMP_AFTER_JUMP line was wrong.
- Row `C-2 (Jump, A's F3)` pins the typed width after a bare flight, and the refusal with no options.
- It is green at 9e79648 too, which is right: F3 was about the account, not the code. O reports it red at ceb21f5; I did not
  re-run that.

## F4: answered (O's account)

- O quotes my F4, takes back "none has a flight" as worded, and keeps the conclusion.
- O adds that `landingKind` also reads only a track that ends in a flight. That is true by `extend.js:921`.

## Rows red first, and the harness

    checked: node --test test/core_landing_xsec.test.js (44885ef's) on the 9e79648 archive → tests 15, pass 13, fail 2
             (the F1 "C-4 (Sharp, KIND)" row and the F2 "RIGHT EDGE" row); on the 44885ef archive → 15/15
    checked: heavy-run --run, test/core_landing_xsec_mutation.test.js at 44885ef (G:/consonance-scratch/a-c1re/mutation.tap)
             → tests 20, pass 20: control, D352 stand-in, applied 18 / caught 18 / NOT APPLIED 0

O's counts, reproduced.

## For the landing pane

- `sharp.js` here is touched at `:20` and `:96-97` only.
- With build 2 (`2538d8e`, `sharp.js` identical to `d80c96a`) it auto-merges. Only `CHANGELOG.md` and `MAP.md` conflict.
- On that merge both harnesses' anchors occur exactly once each (my Sharp read §5 and re-read).
- On the merge the probe matches the corner laid: tightest 7.1 vs 7.1 under the reds-only rule.

## Corrections

- None for this re-read. Every run was gated on the status read just before it, or went through `heavy-run --run`.
- My first read says "300 cases"; nf.js's own log says "cases 299" with 300 keys. One key is not a case. `inferred:` the
  first read's count is off by one, and its identical-all verdict stands.
