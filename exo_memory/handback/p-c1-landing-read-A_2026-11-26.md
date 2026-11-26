# Second read of C1, the landing's cross-section after a flight: pane A, 2026-11-26, chair D677 (PROVE IT, no edits)

**Read:** `ceb21f5..9e79648` (`o-c1-landing-start`, pane O's build 1; plan section (c) by pane B). I made no edits to the
branch. I did my own pass over the diff before reading O's account.

    checked: git fetch origin o-c1-landing-start → 9e79648259211a596f0a2adc0b049ab700e3e035; git diff --stat ceb21f5 9e79648 → 8 files, 346+/17-

**Verdict: NOT CLEAN, one finding (F1) in the code this branch changed.**
- F1: Sharp's probe still mismatches the corner after a flight when the typed cup changes the piece's kind, and Sharp then
  lays a corner the validator flags.
- F2 is pre-existing and widened by C1.
- F3 and F4 correct O's account; they are not code defects.
- Questions 1 and 4 come out clean, measured below.
- Question 2 is clean for opening and the built path. Its export half could not be compared as bytes: the two stored tracks
  with a flight are open, so both trees refuse their export the same way.

## F1. `src/core/sharp.js:96`: the probe takes the take-off's KIND, so a cup typed after a plain or tube take-off is probed as the wrong road

`const kind = D.endKind(doc), first = { …, w: from.w.v, …, e: from.e.v, s: from.s.v }; if (kind === 'cup') first.c = from.c.v; else if (kind === 'tube') first.t = …`

- `from` is now `landingStart` (typed w, c, e, er and s), but `kind` is still the take-off's.
- extend.js gives a different kind. At `:992`, after a flight, `startTyped && given(f0.c)` makes the landing a CUP piece
  starting at the typed c.
- The probe for a plain take-off is therefore not a cup. Its straight ends at the bowl's own edge, and its corner ramps from
  there to the target.
- For a tube take-off the probe takes the tube's t, not the typed cup.

    checked: G:/consonance-scratch/a-c1read/sp.js on a git archive of 9e79648 (synthetic only; it reads the probe through a scratch
             copy that exports it), angle 90°, ramp 4

| after the flight | the corner laid starts | the probe's corner starts | tightest from Sharp | tightest from a take-off already so |
|---|---|---|---|---|
| width 40 typed on a 12 m take-off (O's C-4, the control) | plain, w 40 | plain, w 40 | 19.8 | 19.8 |
| **cup 70 typed on a plain take-off** | **cup, c 70** | **cup, c 15.5** | **71.5** | **121.1** |
| right edge 30 typed on an edge take-off (e 5, er 5) | cup+edge, er 30 | cup+edge, **er 5** | 69.4 | 69.4 |
| **cup 70 typed on a tube take-off (t 200)** | **cup, c 70** | **cup, c 100** | 124.3 | n/a |

**Sharp lays a flagged corner:**

    checked: G:/consonance-scratch/a-c1read/sv.js 9e79648 110, Sharp's own validator call (csp, full speed, advisories dropped) over the corner's span

| | at R 110 |
|---|---|
| plain take-off, cup 70 typed after the flight | **LAID**, amber `load-sustained` on its own span |
| cup 70 take-off, cup 70 as the target | refused `SHARP_TOO_TIGHT` "tightest at this width: 121.1 m" |

- Before C1 this could not happen. The corner ignored `first` after a flight and ramped from the take-off as the probe did.
- **Not covered:** row C-4 (Sharp) types only a width, and mutant S1 reverts the whole `landingStart` call.
- **A shape for the fix, not made:** read the probe's kind as extend reads the landing's. After a flight with a typed `c`
  it is a cup starting at the typed c. A row: cup 70 typed after a plain take-off, Sharp's tightest equals that of a cup-70
  take-off (121.1 here), red at 9e79648.

## F2 (pre-existing, widened by C1). `src/core/sharp.js:96`: the probe never carries the right edge

- `first` has no `er`, so the probe's right edge is its left. That is true on any track whose head has er ≠ e.
- After a flight it now also drops a typed er (the table above: 30 laid, 5 probed).
- In the one case measured, the tightest radius is the same (69.4 both), so no wrong verdict was seen.

## F3 (O's account). The Jump button after a bare flight is NOT refused; it now lays its landing at the typed start

O's hand-back says: "jump.js: Jump after a flight is refused JUMP_AFTER_JUMP, so its take-off never sees `afterFlight`."
That holds only for `jumpHere(doc, null)`.

- The panel's Jump passes Extend's options (`app/core/panel.js:1121` `shell.jump(opts())`; the ghost too, `:1118`).
- `jumpHere` extends with them first (`src/core/jump.js:58`), and only then jumps.
- So after a bare flight the Jump button lays a road piece, now at the typed cross-section, and then a new flight.

      checked: node -e jumpHere on a bare flight (26 m take-off) with { targets: { w: 18 }, first: { w: 18 } }
               → base: laid r f r f r, piece 3 width at s = 0: 26 · tip: laid r f r f r, piece 3 width at s = 0: 18
               jumpHere(flight, null) → JUMP_AFTER_JUMP on both

This is consistent with C1 ("the current piece placed as Extend would place it", `coreshell.js:717`), so it is not a defect.
No row covers it, and O's consumer list should not say it is unreachable.

## F4 (O's account). One of his saved-track copies has a flight

- O: "None of the 91 has a flight, so this check cannot reach the changed path."
- Among the 27 copies in `G:/consonance-scratch/o-smooth-work/tracks`, **t21 has one**: piece 23 of 24, landing on road, open.
  Fixture F7 has one too.
- Neither ENDS in a flight, so O's conclusion stands: no saved track reaches the changed path.
- Both do reach the "a flight in the track" case for question 2 below.

## The four questions

**1. Can a document WITHOUT a flight change? No.**
- By inspection: every changed line is gated on the last piece being a flight.
  - `landingStart` returns `D.endState(doc)` unless `endsInFlight(doc)`.
  - `startTyped = !from0 || endsInFlight(doc)` equals the old `!from` and `!from0` when there is no flight at the end.
  - The panel sends `first` only when `afterFlight`, and its `rampStart` argument is unchanged otherwise.
  - `extendOptions`' other callers take the default `afterFlight = false`.
- Measured, on both trees, with no flight at the end:
  - the docs: synthetic (empty, plain, cup, edge, tube, and a flight in the MIDDLE), the 27 saved-track copies and F1–F9;
  - the calls: each extended 7 ways, including `first` with w, c, e, er, s, kh and phi, and an edge past the cap;
  - plus Sharp's tightest radius on the synthetic docs, with and without a typed `first`.

      checked: G:/consonance-scratch/a-c1read/nf.js on git archives of ceb21f5 and 9e79648 (through heavy-run --run)
               → 300 cases, 300 identical (94 of them refusals, identical code and message)

**2. Do old saved tracks with flights open and re-export byte-equal? They open byte-equal and build the same path; their export could not be compared as bytes.**

    checked: O's mnm.js (exo_memory/handback/p-smooth-bank-lap1-O_2026-11-24_evidence/scripts/mnm.js, unchanged) on 9e79648 against
             the ceb21f5 run of the same script and inputs (G:/consonance-scratch/a-pitgap-out/mnm-base.json), exportMs left out
             → items 36, same 36, differ none (G:/consonance-scratch/a-c1read/mnm-tip.json)

- Each item is compared on the serialised bytes, the built path, and every exported file's sha256 or its refusal code.
- t21 and F7 are the two with a flight. Their serialised text and built path are identical on both trees. **Both are open, so both exports refuse `OPEN_LOOP` on both trees: the same refusal, but no exported file was compared for a track with a flight.** No closed track with a flight exists among these copies.
- `inferred:` the export of a stored flight track cannot change, since nothing under src/export, src/geom, adapter.js or document.js requires extend.js or sharp.js (`git grep -E "require\(.*core/(extend|sharp)" 9e79648 -- src/export src/geom src/core/adapter.js src/core/document.js` → none), but that is by reading, not by bytes.
- The format claim is also O's row C-1, green at the base and the tip.

**3. Is the Sharp probe change in scope, and does any other caller rely on the old start?**
- **In scope:** the plan names it (`plan_t180_cross_section_2026-11-26.md`, consumers: "`src/core/sharp.js:95` builds its
  probe's start from the head. After a flight it would read the take-off's values, a site to check").
- **Incomplete:** see F1.
- **Other callers of the take-off state:** `landingStart` has one caller outside extend.js (sharp.js:93).
  `D.endState` is unchanged, so every other reader of the take-off state reads what it did.

      checked: git grep landingStart 9e79648 → extend.js (definition :912, :983, :990, the export :1176) and sharp.js:20, :93

- Callers that hand the panel's options to `extend` now see the typed landing start after a flight, as Extend does: Jump
  (F3), Sharp, and the shell's Extend and its ghost.

**4. Do the rows assert outcomes on the BUILT road after the landing? Only the width does.**
- Rows C-2, C-3, C-4 and C-5 assert the document's control points (`channels[ch][0]`).
- C-6 is the one built-road row. It checks the landing's first segment's half-width (9 m) from `toSegments`.
- No row checks the built cup, edges or edge start.
- I measured it instead. The landing's built profile (every segment's `u` and `psi`, the export's input) after a bare
  flight equals the same piece laid on an empty track with the same typed start.

      checked: G:/consonance-scratch/a-c1read/bt.js 9e79648, four typed sets ({w 18, c 70, e 3, er 9, s 0.85}, {w 34}, {c 70}, {e 20, er 4})
               → 30 segments each, 8,220 profile values each, largest difference 0, 1.42e-14, 0, 0

  So the outcome holds on the built road, but only width is pinned by a row.

## Re-derived from O's account

    checked: node --test test/core_landing_xsec.test.js app/test/core-landing-xsec-panel.test.js
             base (ceb21f5 + the two files) → tests 17, pass 6, fail 11 · tip → tests 17, pass 17, fail 0

This is O's "11 red, then 17 of 17", reproduced. I did not re-run the 15-mutant harness or test-fast; those are O's counts.

## A side note (pre-existing, not C1, measured at two radii only)

Sharp's tightest-radius search assumes the faults only shrink as R grows.
- The cup-70 reference above lays green at R 80 (sv.js 80) and is amber `load-sustained` at R 110.
- So "tightest at this width: 121.1 m" is not the tightest that works.

`inferred:` a sustained-load check grows with the corner's length, so it is not monotone in R. This is not raised as a finding
of this read.

## Corrections

- **I ran inside P's exclusive TIMING hold** ("P drag-frame alone at 1dfca3d … a timing session", from 21:50:58Z).
  - From about 21:51 to 21:52:30Z I ran, outside the lock: sv.js, bt.js (twice), the two row files on two trees, the jumpHere
    check and a profile-key probe.
  - The status had read "EXCLUSIVE HOLD: none" when I began the read at about 21:48Z, and I did not read it again before each
    run.
  - Any process spoils a timing session's quiet windows, so P's windows from 21:51 to 21:52:30Z should be treated as suspect.
  - The nf and mnm runs went through `heavy-run.js --run` and waited.
  - It is the same error as my pit-gap hand-back's §7, an hour earlier. The rule now in my memory: read the status before
    every run, or go through `--run`.
