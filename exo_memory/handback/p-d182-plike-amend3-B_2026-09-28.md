SEALED. AMENDMENT 3 is on disk BEFORE the D182 P-LIKE run: `exo_memory/loop/p-like_registration_amendment-3_2026-09-28.md`, sha256 **`7714535850698bba4c2bc9d56aaade513e90d5b69c4e04f6a918fa306326371c`** (02:19:09 local). The control, scored after sealing, FAILS the new shape rows on both tracks, as registered.

# P-D182-PLIKE-AMEND3 · B

**Pane B, 2026-09-28 01:40–02:24 local.** Nothing was committed or pushed in t180, and AC was not launched. One heavy run, under the
lock (02:19:33–02:21:51, `a3ctl.js`, every node process at `--max-old-space-size=4096` via NODE_OPTIONS, per the 02:0x load rules).

## 1 · The condition the chair set: C's three acceptance items, each shown to pass BEFORE sealing
Source: `handback/p-d182-reader-C_2026-09-28.md` §3 (10,087 bytes at 02:17:20), read whole.
- **(1) 17 of 17 layouts re-read byte-identical to `reads/`.** C's log is `reader/accept.log`, re-derived from disk after the 01:46 crash
  (C §4).
  - My own independent re-read of all 17 was cut off by the crash after 4 (`scratchpad/d182/reread/reread.txt`): Sakura, Rainbow Rd and
    Coast IDENTICAL; Centrifuge died natively (exit 3221225477 = 0xC0000005, empty output).
  - Centrifuge had already re-read identical under `ca45c683` in my own earlier check. So, independently: **4 of 17**, not 17.
- **(2) round-trip + platform + hint tests with the fixed reader:** 52 / 46 / 0 / 6 todo. C and I got this separately.
- **(3) the old-palette control through the fixed reader still FAILS T1–T12 on both tracks.** C's rows and my re-run (§3 below) agree
  row for row.
- **Live reader:** `sha256sum tools/read_track.cjs` → `ca45c683cf626214…` = the pin.

## 2 · What was sealed (all pins re-checked with `sha256sum` at 02:18, immediately before the seal)
| file | sha256 (16) |
|---|---|
| amendment 3 | `7714535850698bba` |
| `p-like/plike_run_a3.js` (the runner: pin, width 0, T13–T14) | `43bfd1c90d1798fd` |
| `p-like/plike_profile.js` (the shape measure) | `d1592eabc025be3b` |
| `p-like/sakura_speedway.profile-target.json` | `3daaf199f7875223` |
| `p-like/centrifuge.profile-target.json` | `7662b33f32167e7d` |
| `p-like/plike_stats.js` (unchanged from the registration) | `c6832696b89cd39d` |

The draft's one placeholder (item 1's result) was filled with C's result and my partial one, both as above. Nothing else changed
between draft and seal.

## 3 · THE CONTROL, scored after the seal (`node plike_run_a3.js b-plike-ctl-wt <track> …`, worktree at `d331f82`)
Evidence: `scratchpad/d182/control3/{sakura_speedway,centrifuge}.stdout.txt` and `.run.json`; rebuild reads `084ad164…` and `6ef5a50c…`.

| | Sakura | Centrifuge |
|---|---|---|
| verdict | **FAIL**, exportable no (1 lifted red) | **FAIL**, exportable no (1 lifted red) |
| T1–T12 failed | T3 45, T6 0.5°, T7 4.6°, T10 −41.1, T11 68.3, T12 8.1 | T3 48, T6 5.6°, T7 39°, T12 53.5 |
| **T13 (tilt medians)** | FAIL at ½, ¾, edge, both sides: **edge 59.55° / 59.5°** vs band 27.3–34.8; ½ 3.1° / 0.4° vs 7.5–14.45 / 6.1–14.4; ¾ 31.3° / 28.7° vs 9.7–20.8 | FAIL at ½ and edge, both sides: **edge 59.5°** vs 25.1–33.2; ½ 3.0° / 1.3° vs 13.8–22.8 / 13.9–21.6. ¾ passes (30.4° / 29.5°) |
| **T14 (steepest tilt rate)** | FAIL, all four: 6.85 / 7.5 °/m vs ≤ 6.68 / 7.15 | FAIL, all four: 6.73–6.83 / 7.5–7.55 °/m vs ≤ 4.89–5.54 / 6.27–6.69 |
| T1–T12 passed | T1 2,980, T2 36, T4, T5, T8 ×4, T9 211 | T1, T2 36, T4, T5, T8 ×4, T9 266, T10 −218.6, T11 422.7 |

**Against the registered expectation ("the control is expected to FAIL T13 or T14"): it fails BOTH, on both tracks.** The keeper's
01:27 observation, in numbers:
- the old half-pipe is **a flat floor to half-way** (½ tilt 0.4–3.1° against the real 10.7–17.4°);
- **then a rim twice as steep as the real one** (edge 59.5° against 29.1–30.6°).

That matches "the rims flip up too much".

**What this does NOT establish:**
- **T14 on Sakura is a narrow fail** (6.85 against ≤ 6.68, 2.5 % over). T13 carries the shape verdict; T14 alone would be weak evidence
  there.
- Whether the D182 palette PASSES. It is not scored yet: that is the next run, on the landed vocab and fonts, by this same runner.
- The shape rows are measured by the reader's 1 m-point normals. They are not a render. The screenshots stay in the plan.

## 4 · 484be9e verified against the D181 landing (the route-(b) packet's second item)
`t180 main 484be9e` against my `b-d181-wt` landing: **70 of 70 by content.**
- 60 are byte-identical to my recorded sha256.
- 10 differ only in line endings (a CRLF snapshot against an LF commit):
  - 4 are identical once CRs are stripped;
  - 6 equal the snapshot plus E's `order.diff` plus C's `seam.diff`, rebuilt and compared.
- The same 70 file names.

## 5 · Corrections, mine
- **The loss diagnosis in my registration ADDENDUM was wrong.** The cause was my runner's NaN width, not the reader following tight
  turns. Found by C; corrected in `p-d182-plike-reg-B` (CORRECTION) and in amendment 3 §2.
- **My 17-layout re-read did not finish** (the crash). Item (1) rests on C's full run plus my 4, and I say so in the seal. I do not claim
  17 of my own.
