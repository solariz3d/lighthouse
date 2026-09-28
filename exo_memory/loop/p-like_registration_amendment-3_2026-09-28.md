# P-LIKE registration — AMENDMENT 3 (B, 2026-09-28, sealed before the D182 P-LIKE run: A's corrected vocab and C's measured fonts are not scored yet)

**Amends:** `p-like_registration_2026-09-27.md` (sha256 `37d9ede8…`), with amendments 1 (`3097aa89…`) and 2 (`cdf509ff…`) standing.
**Three parts:**
1. the reader is re-pinned to C's fixed reader;
2. the runner's width hint;
3. NEW cross-section SHAPE rows T13–T14 (the keeper, 01:27).

No sealed tolerance T1–T12, no target and no criterion-2 rule changes.

## 1 · The reader, re-pinned (route b; C's acceptance, `handback/p-d182-reader-C_2026-09-28.md`)

- **`tools/read_track.cjs` sha256 `ca45c683cf626214…`** replaces `ea4fb383…`. The only change is `hint()`: a length or width hint that is
  not a finite number ≥ 0 is refused by name (C §2); `test/read_track_hints.test.js` has 13 tests.
- **C's three acceptance conditions, each checked:**
  - (1) the 17 real layouts re-read byte-identical to `reads/`: **PASS, 17 of 17, 0 differ** (C, `handback/p-d182-reader-C_2026-09-28.md` §3.1, log `reader/accept.log` read back from disk after the 01:46 crash). B's own independent re-read of all 17 was cut off by the crash after 4 layouts (3 identical; the fourth, Centrifuge, died natively with 0xC0000005 and empty output). B re-read 2 of the 17 independently: Sakura `dcb039d3…`
    and Centrifuge `1fae0ae1…` are byte-identical under `ca45c683`, so **the sealed targets are unchanged**.
  - (2) the platform round-trip: B ran `node --test --test-concurrency=4 test/roundtrip.test.js test/platform_test.test.js
    test/read_track_hints.test.js` → **52 tests · 46 pass · 0 fail · 6 todo** (the 6 are the known p-d166 §3 reader todos, unchanged).
  - (3) the old-palette control re-read through the fixed reader **still FAILS**, on both tracks (§4 below).

## 2 · The runner's width hint (the cause of the reader losses: B's runner, p-d182-plike-reg-B CORRECTION)

- The builder writes `"width": ""` in `ui_track.json`. The runner used to pass `"NaN"`, which disarmed the old reader and is refused by
  the fixed one.
- **The runner now passes the reader's documented no-hint, `0`, whenever the export's width is not a finite number ≥ 0.** The same rule
  applies to the font calibration reads.
- **The runner changes are exactly three lines:** the pin (`READER_SHA = 'ca45c683cf626214'`) and the width argument at its two reader
  calls. The runner is `exo_memory/loop/p-like/plike_run_a3.js`, sha256 `43bfd1c90d1798fd…` (it also scores T13–T14, §3); the original `plike_run.js` is kept unchanged as the record of the runs before this amendment.

## 3 · NEW: the cross-section SHAPE rows (the keeper, 01:27, after the 0.2.2 run: "the rims flip up too much and dont make sense from what I seen")

**The measure:** `exo_memory/loop/p-like/plike_profile.js`, sha256 `d1592eabc025be3b…`, over the same stations as `plike_stats.js` (0–3,000
m). The reader's `READ_PROFILE=1` gives, per side:
- the tilt ψ (° from the centre's normal) at ¼, ½, ¾ of the way out and at the edge (FINDINGS §7f);
- the steepest tilt change between neighbouring quarter points, in °/m across.

**The targets:** `p-like/sakura_speedway.profile-target.json` `3daaf199f7875223…` and `p-like/centrifuge.profile-target.json`
`7662b33f32167e7d…`, measured from the pinned real reads. Medians (p10–p90), in degrees:

| | ¼ | ½ | ¾ | edge | steepest tilt rate °/m, median / p90 |
|---|---|---|---|---|---|
| Sakura L | 5.9 (1.9–6.2) | 10.8 (10.5–11.45) | 13.0 (12.7–17.8) | 30.6 (30.3–31.8) | 4.45 / 4.77 |
| Sakura R | 5.9 (0.1–6.1) | 10.7 (9.1–11.4) | 12.9 (12.7–17.75) | 30.6 (30.3–31.6) | 4.45 / 4.75 |
| Centrifuge L | 6.3 (0.85–12.0) | 17.4 (16.8–19.8) | 28.7 (27.5–29.6) | 29.1 (28.1–30.2) | 3.26 / 4.18 |
| Centrifuge R | 1.3 (0.1–6.45) | 17.4 (16.9–18.6) | 28.7 (24.45–29.4) | 29.1 (28.2–30.1) | 3.69 / 4.46 |

**The rows (PASS needs every one, on both tracks):**

| # | statistic | tolerance | reason |
|---|---|---|---|
| T13 | the rebuild's MEDIAN tilt at ¼, ½, ¾ and the edge, each side (8 values per track) | inside **[target p10 − 3°, target p90 + 3°]** at the same point and side | "reads like the stretch" means the rebuild's typical profile lies inside the real stretch's own range of profiles, point by point. 3° is the reader's margin: the tilt comes from normals at 1 m points, and where the real profile is steady its own p10–p90 at a point is about 1° (Sakura ½: 10.5–11.45). A rim that "flips up too much" moves the edge (and ¾) median out of band |
| T14 | the rebuild's STEEPEST TILT RATE, each side: median and p90 | **≤ 1.5 × the target's** median and p90, same side (Sakura ≈ 6.7 / 7.2 °/m; Centrifuge ≈ 4.9–5.5 / 6.3–6.7 °/m) | this catches the LIP: a flat floor with a sudden rise at the rim puts a large tilt change into one quarter, so its °/m jumps far past the real stretches' ~4.5. 1.5× allows for a different width (the rate divides by w/4) and for the reader's point spacing. It is an UPPER bound only: a smoother profile than the target is judged by T13, not T14 |

**Registered expectation, stated before any shape row is computed on a rebuild:** the keeper's 01:27 observation is of the 0.2.2 build, whose
palette is the pre-D182 one, i.e. the CONTROL's. **The control is expected to FAIL T13 or T14.** If it passes both, the shape rows do not
capture what the keeper saw, and the hand-back will say so rather than claim they do.

## 4 · The control through the fixed reader (acceptance item 3; T1–T12 as sealed, with the runner of §2)

| | Sakura | Centrifuge |
|---|---|---|
| reader | walked 3,440 m, CLOSED | walked 4,216 m, CLOSED |
| verdict | **FAIL**, exportable no (1 lifted lap-proof red) | **FAIL**, exportable no (1 lifted lap-proof red) |
| failed | T3 width p90 45, **T6 bank median 0.5° vs 36.2**, **T7 bank p90 4.6°**, T10 net Δy −41.1, T11 range 68.3, T12 grade 8.1 | T3 width p90 48, **T6 bank median 5.6° vs 31.6**, **T7 bank p90 39°**, T12 grade 53.5 |
| passed | T1 span 2,980, T2 width median 36, T4, T5, T8 all four, T9 radius 211 | T1 2,980, T2 36, T4, T5, T8 all four, T9 266, T10 −218.6, T11 422.7 |

(T13–T14 on the control are computed AFTER this amendment is sealed, and reported against §3's expectation.)

**Sealed** by B at 2026-09-28, 02:19:09 local, with C's three acceptance conditions shown to pass, before any D182 P-LIKE run and before T13–T14 are computed on anything but the real stretches.

