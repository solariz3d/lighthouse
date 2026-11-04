# D595: the unticked bank is a smooth S, not a slice (pane C)

Seat: pane C (sibling-0845a868). Tier: PROVE IT. Branch `d595-c` off land-0434 `a93ae51`, worktree `C:\Users\nname\Desktop\worktrees\t180-c595`.
Not pushed, not merged, not installed. Evidence: `exo_memory/handback/p-d595-bank-smooth-C/`.

**DROPPED (the chair, 18:11; the keeper's remark was about the apron on stronger cupping, which O's lip covers): do not land; `d595-c` is parked
as it is. Both the hold (18:05) and this reached the pane at 18:19, after the work below was finished.**

**STATUS (before the drop): DONE. Tip `8b9e3b2`. The renders went first (§1, rung at 18:1x); the proof is §4. Not built, not installed: it joins 0.4.35 after he has
seen the renders.**

## 1. The renders (his D521 piece: a 100 m straight, then 100 m turning +11.70° as a corner, bank −54.05°, width 31 m, nothing ticked)

Headless Chrome, the real page, muted, 1920 x 1080; the three documents laid by the same tree's core, only the bank shape differing
(`render595.js`). In `p-d595-bank-smooth-C/renders/`:

| | BEFORE (the beginning, the quintic) | TODAY (rounded, since 0.4.28) | NEW (the smooth S) |
|---|---|---|---|
| the D521 page's camera (focus at s = 112) | `d595-before-page.png` | `d595-today-page.png` | `d595-new-page.png` |
| close up at the joint, from behind (focus at s = 100, the joint's region at 2x) | `d595-before-behind.png` | `d595-today-behind.png` | `d595-new-behind.png` |
| from the side (the app's own Side camera) | `d595-before-side.png` | `d595-today-side.png` | `d595-new-side.png` |

Plus the 10-28 page's own "before": `d521-10-28-before.png` (O's, copied).
The checker panel in the page renders reads: BEFORE **0 red · 1 amber** ("rolls … faster than any measured track … at 142–158 m"), TODAY **0 · 0**, NEW **0 · 0**.

What the eye should see (inferred from the pictures, his to judge): TODAY's inner edge leaves the joint as a straight diagonal (the slice);
BEFORE's stays flat and then bends hard; NEW's bends away in one smooth curve.

## 2. The figures (`his.js` → `his-595.json`; from the stored spline every 0.1 m)

| | bank at 10 m | 20 m | 50 m | peak roll rate | peak change of rate | C2 at both joints | inner edge's fall at 10/20/40/60 m |
|---|---|---|---|---|---|---|---|
| BEFORE (quintic) | 0.33° | 2.68° | 27.03° | 1.023 °/m (amber over 0.93) | 0.040 °/m² | yes | 0.09 / 0.72 / 4.54 / 9.33 m |
| TODAY (rounded, ℓ = 10 m) | 2.99° | 9.01° | 27.02° | 0.603 °/m | 0.119 °/m² | yes | 0.81 / 2.43 / 5.56 / 8.45 m |
| **NEW (thirds)** | **0.50°** | **3.97°** | **27.03°** | **0.817 °/m** | **0.050 °/m²** | **yes** | **0.14 / 1.07 / 5.03 / 8.92 m** |
| smoothstep 3t²−2t³ (ideal, not laid) | 1.51° | 5.62° | 27.02° | 0.811 °/m | — | **no (C1)** | — |

Heading turned 11.7000° in all; the other channels within 2.9e-5 of TODAY's (`kh`) or exactly.

**Why thirds and not smoothstep, as the plan first named it:** smoothstep's second derivative is not 0 at its ends, so a bank laid with it
is C1 at the joint, and every cross-section channel must be C2 there (`test/core_joint_c2.test.js`; D521 kept the bank C2 for the same reason).
The plan allows "whichever smooth S keeps the peak rate under the amber line". Thirds is the core's own two-share ramp
(`src/core/extend.js rampShape`, rise 1/3, fall 1/3): the roll rate eases in over the first third, holds at 1.5 x the average, eases out over
the last third. Same peak as smoothstep (1.5 x), C2, and closer to the beginning at the joint (0.50° at 10 m against smoothstep's 1.51°).
Other widths, measured: shares 0.25 → 0.77° at 10 m, 0.722 °/m; 0.30 → 0.58°, 0.776; 0.40 → 0.37°, 0.918 (at the amber's edge).

## 3. The change

- `app/core/panel.js`: `BANK_S = { rise: 1/3, fall: 1/3 }`; a typed, unticked bank asks `bankShape: { ...BANK_S }` (was `'rounded'`). The core is
  untouched. "Early" (F) is unchanged: a ticked bank still takes `startShapeOf`.
- Commits on d595-c (`commits.txt`): `37e342b` red test, `113ed0b` the change, `8b9e3b2` the harness mutants, two more amended tests,
  CHANGELOG ("A bank you type now rolls in as one smooth curve, not a straight cut from the joint", under Changed) and the t180 MAP.md line
  (app/core/panel.js: `BANK_S`). 9 files, +47 −11.

## 4. Proof

- **Red first:** `test/core_bank_ramp.test.js` "his piece, unticked: the panel lays the bank as a smooth S, no slice and no amber" (0.50° at 10 m,
  3.97° at 20 m, 27.03° at 50 m, peak 0.78–0.85 °/m, C2 at both joints, laid through the panel's own extendOptions and extendCorner). Red at
  `37e342b` ("the panel asks thirds": it asked 'rounded'); green at `113ed0b`.
- **Tests amended BY NAME** (their rule is the one that changed; each carries an AMENDED comment): `app/test/core-shell.test.js` (extendOptions
  asks thirds), `test/core_at_start_f.test.js` (nothing ticked: thirds), `test/core_bank_ramp.test.js` UNMOVED (the 3 rows with an unticked bank
  moved, the 5 without stayed byte-identical), `test/core_extend_at_start.test.js` (nothing ticked lays the thirds' bytes), `test/core_bank_swell.test.js`
  GOLD (the 2 rows with a box-off bank moved; the edge and width-and-turn rows stayed). In every case exactly the rows with an unticked bank moved.
- **The ramp harness whole** (`test/core_ramp_mutation.test.js`, lock, BelowNormal; `ramp-harness-summary.txt`): 74/74; **applied and caught 72,
  NOT APPLIED 0**, the CONTROL passing. New: **Z1** the unticked bank is the rounded ramp again (the slice), **Z2** the S rises over a quarter:
  both applied and caught by the new row. (The first run's CONTROL failed: two harness files I had not run still pinned the rounded ramp;
  amended as above, then the whole harness was run again.)
- **Every test file that loads the panel or extendOptions (32) plus the fixtures** (lock; `touched-summary.txt`): 405 tests, 399 pass, 0 fail,
  6 skipped; fixtures **"0 of 9 differ"**.
- **His saved documents lay byte-identical** (`saved.js` / `compare.js`, O's D521 tools, on copies of his 19 `.t180track` files, read only;
  `saved-compare.txt`, `saved-originals.txt`): the a93ae51 tree and d595-c give the same re-serialised document sha256 and the same exported
  centreline geometry (every sample's s/pos/L/U to 1e-9) for all 18 core tracks, **ELYSIUM and "ELYSIUM as driven" included**; largest bank
  change at any 0.5 m station 0; "tracks that would export differently: 0"; one file not a core document (skipped). Loading never calls Extend.
  The originals' sha256s are the same before and after the copy. (Two track names carry a private term and are withheld in the evidence.)
- **The checker on his piece:** 0 red · 0 amber with the S (the page render's panel); the beginning drew 1 amber.
- **Scans** of `a93ae51..8b9e3b2` (added lines and messages): private terms 0, room words 0, credentials 0, "keeper" 0.
- All runs headless (Chrome through the app's launcher, no window) or node, BelowNormal, acs.exe checked before each.

## 5. Falsifier (the plan's)

If on his eye the S still reads as a cut at the joint, it must start slower: the same two-share ramp with a longer rise (shares 0.40 gives 0.37° at
10 m, 0.918 °/m, at the amber's edge) or a quintic rate rise; not a longer piece.

NEXT: librarian puts the renders on his page when it is ready; d595-c joins 0.4.35 after he has seen them and said yes.
