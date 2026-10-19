# Hand-back, pane E (machine D): D398, the sky's one-step dither, as a fix (for 0.4.7)

Packet: the chair's D398 (2026-10-19T01:04:19Z). The ruling is `exo_memory/loop/plan_t180_handoff_2026-10-15.md:2677-2682`, citing my `p-d397-texture-E_2026-10-19.md` §2 and §4.
- Uncommitted hand-back. Nothing pushed, nothing installed. Headless only.
- Work folder: `C:\Users\nname\Downloads\t180-d398-e\`.

## 0. The answer

**Commit `d88bca2` on branch `d398-e`, whose parent is origin/main `63515d0` (v0.4.6).** Worktree `C:\Users\nname\Downloads\t180-wt-e20`, clean.
- 5 files, +117 −1.
- checked: `git log --format="%h %p %s" -1` → `d88bca2 63515d0 D398: the sky pass breaks its own 8-bit banding with a one-step ordered dither`.
- checked: `git show HEAD | grep -c` for the three split credential patterns → 0, 0, 0; for "keeper" or "water" → 0.
- **C's `d77bcd7`:** we share no file. Both add a line under CHANGELOG's Unreleased, so the landing merges them there.

**What changed:**
- **`app/preview/renderer.js` `skyFS`**, the shared pass that every style is drawn through, gets one change. It adds a 4×4 ordered (Bayer) offset on the pixel before writing the colour:

  `clamp(c + (pass_bayer4(gl_FragCoord.xy) - 0.5) / 255.0, 0.0, 1.0)`

  - That's half of one 8-bit step either way.
  - The helpers `pass_bayer2/4` belong to the pass, so no style carries a copy. They contain no smoothstep and no sin.
  - A comment above the pass says what it does and why.
- **CHANGELOG:** one Fixed line under Unreleased, in our own words.
- **The look is not in this commit:** no grain, no dithered sky, no ASCII.

## 1. Test first

**New file `app/test/sky-dither.test.js`,** rendered in headless Chrome and skipped, with the reason, where there's no Chrome.
- Each style is compiled into the renderer's own `SKY_VS` and `skyFS`, with the skin's colours read from its CSS.
- The camera basis comes from `R.skyBasis`, at a 60° field of view, looking level and looking up 50°.
- **Row 1:** down each column of open sky, the longest run of one 8-bit colour is at most 12 px.
- **Row 2:** the ±10° band, all the way round, stays within 1.30:1 of `--fog`, with the dither included.
  - It is drawn by the same fragment stage, behind a lat-long vertex stage.

| | sun | prism | caustics | aurora |
|---|---|---|---|---|
| row 1 on 63515d0, px (level / up) | 34 / 41 | 56 / 117 | 80 / 47 | 26 / 174 → **red** |
| row 1 on d88bca2, px | 4 / 6 | 4 / 8 | 6 / 7 | 5 / 7 → green |
| row 2 on 63515d0 | 1.135 | 1.058 | 1.238 | 1.043 → green (baseline) |
| row 2 on d88bca2 | 1.137 | 1.060 | 1.239 | 1.044 → green |

- **Where these figures come from:**
  - checked: `t-before-sky-dither.out`, the new test file run on 63515d0's `app/` and `src/` through `APP_DIR`;
  - checked: `t-green-sky-dither.out`. Each row prints its figures as a TAP diagnostic.
- **Row 1's "before" equals D397's measurement exactly.**
- **Row 2's figures are lower than D391's skybar** (sun 1.148, prism 1.145) because the row samples t = 0 only, on a 1400-column grid. Skybar also sampled t = 47. Both are within 1.30.

**`app/test/sky.test.js` gets one row:** the pass dithers every style, and `contractProblems('pass', R.skyFS(''))` returns `[]`.
- It was red on 63515d0 (`t-red-sky.out`, 12 of 13 passing) and is green after.
- **The D391 and D393 rows are unchanged.** All four styles still return `[]`.

**`app/test/theme-mutation.test.js` gets mutant S16,** which takes the dither out of the pass. It is caught by that `sky.test` row.

## 2. The whole runs, under heavy-run (lockrun)

The lock was free at the first check. When later runs started it was held, and lockrun waited for it.

| file | result |
|---|---|
| sky.test.js | 13/13 |
| sky-caustics-aurora.test.js | 11/11 |
| sky-dither.test.js | 2/2 |
| theme-mutation.test.js | 34/34; applied 32 / caught 32 / NOT APPLIED 0 |
| mutation.test.js | 107/107; applied 103 / caught 103 / NOT APPLIED 0 |

- checked: `grep -ac '^ok [0-9]* - .*applied, and caught'` → 32 and 103.
- checked: `grep -ac 'NOT APPLIED'` → 0 and 0.

## 3. Corrections, mine

- **Row 2 first drew a 1440-px band on a 1400-px canvas** and read black pixels past the edge (Y 0.00000). It was red for the wrong reason. I fixed it to 1400 before the fix was written, and it then passed on 63515d0 as a baseline.
- **My first "before" run copied only 63515d0's `app/`.** It failed to load, because the renderer needs `src/`. I re-ran it with both.
- **My first commit didn't happen.** `git commit -- <paths>` refuses a path git doesn't know yet, and the new test file was one of them. I then added that one file by name and committed. The first scans had been of 0.4.6, so I ran them again on `d88bca2`.

## 4. Limits

- **The banding row reads headless Chrome's GL.** That may be SwiftShader or this machine's card. The limit of 12 px sits between the before figures (26–174) and the after figures (4–8).
- **No real-app shot was taken.** The pass is the app's own, compiled as the app compiles it.

NEXT: librarian, read this now; then A reviews `d88bca2` (d398-e), and B lands 0.4.7 with C's `d77bcd7` after the librarian accepts. My D399 starts now.
