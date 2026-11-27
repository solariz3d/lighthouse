# Second read of build 2, Sharp refuses on reds only: pane A, 2026-11-26, chair D677 (PROVE IT, no edits)

**Read:** `ceb21f5..d80c96a` (`d677-sharp-reds-b`, pane B's build 2). I made no edits to the branch. I did my own pass over
the diff and my own runs before reading B's account (`exo_memory/handback/p-d677-sharp-gate-B_2026-11-26.md`).

    checked: git fetch origin d677-sharp-reds-b → d80c96adcae1e70d11adfd40dc54e0f6252d98e7; git diff --stat ceb21f5 d80c96a → 5 files, 161+/13-

**Verdict: NOT CLEAN.** The rule itself is right and holds: every real red I tried is still refused by name, and the
message names only the reds. The findings are in the tests and the account. None is a wrong verdict by Sharp, though the
mislabelled S16 hides an untested input that lays.
- **F1:** row 4's comment and B's account explain it with a base behaviour that is false.
- **F2:** two survivors are left out of the harness as "EQUIVALENT", and neither is equivalent.
- **F3** (pre-existing, wording): the CHANGELOG says road running into itself still refuses. It refuses only when the crossing
  is on the corner.

## F1. `test/core_sharp.test.js:144`: row 4's "before D677" is false; row 4 is a guard

The comment says: "Before D677 no radius up to R_HI was green, for its bank-cup-edge AMBER, which no radius clears". B's
account says the same: "on base the off-camber corner named no radius because of its `bank-cup-edge` amber". On `ceb21f5`
the same corner names the same radius, and carries no amber at all.

    checked: G:/consonance-scratch/a-sgread/sg2.js on a git archive of ceb21f5 (sg2-base.json, "row4")
             → SHARP_TOO_TIGHT "R 48 m is too tight for this width (leaves-surface): tightest at this width: 308.5 m",
               faults { red: [leaves-surface], amber: [] }

- B's own table agrees with this: row 4 is "green (a guard on the red half)" on base. The row asserts a finite `needR` that
  lays, which could not pass on base if base named no radius.
- So the comment records an inference as a fact. B's correction section names that inference wrong on the branch, but not
  on base.
- Row 4 still earns its place: it is the row that catches S10 and S11. **The comment should say it is a guard, green
  before D677 too.**

## F2. `test/core_sharp_mutation.test.js:31-32`: S15 and S16 are not equivalent

The harness comment and B's account say both are equivalent, because the layer below refuses the same names. B marked this
`inferred`. The rows' own inputs (a closed track at R 22, a radius of 0) do get the same names. Other inputs do not.

    checked: G:/consonance-scratch/a-sgread/sg3.js on the tip archive, and on two copies of it with the mutant applied
             (one exact string each, applied once)

| input | d80c96a | S15: `if (doc.closed)` → `if (false)` | S16: `R > 0` dropped |
|---|---|---|---|
| R −22 m, width 24, 90° | BAD_TARGET | BAD_TARGET | **LAID**: 3 pieces, turns −90.105° |
| R −5 m | BAD_TARGET | BAD_TARGET | SHARP_TOO_TIGHT "R −5 m is too tight … tightest 11.9 m" |
| a closed track, R 5 m | CLOSED | **SHARP_TOO_TIGHT** (the fold is found first) | CLOSED |
| a closed track, R 22 m | CLOSED | CLOSED | CLOSED |

- **S16 is a real survivor.** A negative radius lays a corner that turns the opposite way from the 90° asked, and not
  exactly. 1/R = Infinity never arises for a negative R.
  - Row shape: "a negative radius is refused by name (BAD_TARGET), and nothing changes".
- **S15 is equivalent only where the radius clears.** It still refuses, but under the wrong name.
  - Row shape: "a closed track is refused CLOSED even at a radius too tight for it".

## F3 (pre-existing, not D677; the CHANGELOG's wording). Road crossing itself refuses only when the crossing is on the corner

`CHANGELOG.md:35` (new in this branch): "A red (a fold at the inner edge, road running into itself, the car leaving the
surface) still refuses by name". `faults` counts a red only within ±5 m of the corner (`sharp.js` `NEAR_M`). The probe's own
straights can cross each other.

    checked: sg.js and sg2.js on base and tip archives (synthetic heads)

| corner | base and tip | the road as laid, plus a 60 m straight |
|---|---|---|
| 200°, width 30, R 20 | **LAID** | `self-intersection` red at s 139–169 and 303–333; the corner is s 200–273 |
| 270°, width 20, refused at R 12 (`self-intersection`, on the corner) | its tightest named, 17.3 m, **LAID** | `self-intersection` at s 174–194 and 290–310; the corner is s 200–284.7 |

- This is the header's own design: "what the corner does to the REST of the track … is the validator's to show". It is the
  same on base and tip.
- But the probe's straights are Sharp's own probe, not the rest of the track. The 200° case is also the row B's account
  says nobody has written for **S7** ("no row puts a fault on the probe's straights"). Under S7 it would refuse.
- **Whether a corner whose own lead-in and lead-out cross should refuse is a call for the chair.** What I raise is only that
  the CHANGELOG sentence promises more than the code does.

## The five questions

**1. Do the rows assert what Sharp lays and shows on the BUILT road?** Partly. Row 1 and the amended row do; rows 3 and 4
judge on the probe.

| row | what it asserts |
|---|---|
| row 1 | **built road:** lays, adds a straight, runs the checker (csp, full speed), no red and `load-above-proven` on the corner's span |
| the amended width-24 row | **built road:** through `corner()`, no red at the tightest named |
| row 3 | "the tightest named lays" and "0.2 m under it is a red", on Sharp's probe |
| row 4 | "the tightest named lays" and "0.2 m under it is a red", on Sharp's probe |
| row 2 | a refusal and an unchanged document; nothing is built |

- "Shows" is the app's checker: `app/validate-ui/panel.js:69` runs `fullSpeed: true` when no design speed is set, as row 1
  does.
  - `inferred:` on a CLOSED lap `validate` fills the ghost lap's speed, not 970 km/h (`src/validate/index.js:181-183`). So an
    amber Sharp laid on an open track may not show once the lap is closed. That is the checker's existing rule, not this
    branch's.
- My own built-road checks, at each tightest named (sg-tip.json, `atNeedBuilt`): the fold case and both off-camber cases
  build with no red. The self-intersection case does not (F3).

**2. One varied case of my own with a REAL red: still refused, by name? Yes.**

    checked: G:/consonance-scratch/a-sgread/sg.js on base and tip (sg-base.json, sg-tip.json); identical codes, reds and tightest on both

| case (synthetic head) | tip's message | tightest | the road built at it |
|---|---|---|---|
| width 36, −120°, R 14 | "too tight for this width (fold, self-intersection): tightest at this width: 17.8 m" | 17.8 | no red |
| width 20, bank +12°, +50°, R 60 | "(leaves-surface) … 206.9 m" | 206.9 | no red, no amber |
| width 20, bank −12°, −50°, R 60 (the mirror) | the same, 206.9 m | 206.9 | no red, no amber |
| width 20, 270°, R 12 | "(self-intersection) … 17.3 m" | 17.3 | red off the corner (F3) |

- Base's messages also named the ambers ("fold, self-intersection, low-overhead"). The tip's name the reds alone, as the
  CHANGELOG says.

**3. The amended row: a changed rule, or a weakened test? A changed rule.**
- It is "width 24: R 11 is refused…", `test/core_sharp.test.js:73-81`, marked `AMENDED (D677)` at `:77`.
- Before, it asserted no amber but D515's two at the tightest named. That is exactly the rule D677 removes, and at width 24
  that radius carries `load-above-proven`.
- Everything else stays:
  - the fold refusal;
  - `needR > 11`;
  - no red on the BUILT road at the tightest;
  - 0.2 m under it refused.
- The two "green at full speed" rows at R 22 and R 24.25 still assert no amber, untouched and stronger than the rule.
- The row's name still says "green", as B notes. `inferred:` that is stale wording, not a weaker test.

**4. The mutation survivors: are B's reasons sound?**

    checked: node core_sharp_mutation.test.js at d80c96a (G:/consonance-scratch/a-sgread/mutation.tap, through heavy-run --run)
             → tests 13, pass 13: CONTROL green, the stand-in NOT TESTED, applied 11 / caught 11 / NOT APPLIED 0

| survivor | B's reason | my verdict |
|---|---|---|
| S12, S13, S17 | outside D677's change, gaps in the existing file | sound |
| S7 | not caught, no row puts a fault on the probe's straights | sound as stated; F3's 200° case is such a row, if the chair rules that it should refuse |
| S15, S16 | equivalent | **not sound:** F2 |

**5. The overlap with O's C1 for the landing pane.**

    checked: git diff -U0 over src/core/sharp.js; git merge-tree --write-tree --name-only for each pair

| branch | `src/core/sharp.js` lines (base side → its own side) |
|---|---|
| B, `d80c96a` | the header :11, :14-15 (→ :14-17); :110 (→ :112-113); :112 `ADVISORY` comment (→ :115-116); :114 `green` → `clear` (→ :118); :117 (→ :121); :124 (→ :128); :129 (→ :133); :131-132 (→ :135-136) |
| O, C1 `9e79648` | :20 (the require); :92 (→ :92-93, `from = landingStart`) |
| O, C1 repair `44885ef` (on 9e79648) | :20 (`landingKind`); :96 (→ :96-97, the probe's kind and `er`) |

| merge | `sharp.js` | conflicts |
|---|---|---|
| `9e79648` with `d80c96a` | auto-merges (tree `4e40cf73`) | CHANGELOG.md, MAP.md |
| `44885ef` with `d80c96a` | auto-merges (tree `e3a62e5f`) | CHANGELOG.md, MAP.md |

- O's nearest line, :97, is 13 lines above B's nearest, :110.
- **The two changes also meet in meaning.** My C1 read's F1 showed Sharp laying an amber at R 110 after a flight. Under build
  2 an amber lays by design, so that particular outcome stops being a fault. The probe mismatch still moves the RED verdict.
  I measured both merges (synthetic, my C1 read's `sp.js` and `sv.js`):

      checked: sp.js on the 9e79648+d80c96a merge → cup 70 typed after a plain take-off: probe c 15.5 vs laid c 70, tightest 9.8 vs a cup-70 take-off's 7.1
      checked: sp.js on the 44885ef+d80c96a merge → probe = laid in all four cases (c 70, er 30, the tube case c 70); tightest 7.1 vs 7.1, 8.9 vs 8.9, 19.8 vs 19.8
      checked: sv.js on the 9e79648+d80c96a merge, R 30, 60, 110 → typed and reference both LAID, red [] on the corner, the same ambers

- **So land build 2 with C1's repair (`44885ef`), not with `9e79648`.** On the older pair, Sharp after a flight refuses radii
  from 7.1 to 9.8 m whose laid corner carries no red.

## Re-derived from B's account

    checked: node --test test/core_sharp.test.js, B's file on a ceb21f5 archive → tests 12, pass 10, fail 2 (the D677 rows 1 and 3);
             on the tip → tests 12, pass 12

- This is B's "rows 1 and 3 red, 12 of 12" reproduced.
- B's 36 of 36 tracks unmoved and the touched files' 121/121 are B's; I did not re-run them.

## Not run

- A scan of every radius under each tightest named, to test whether `tightestSharp`'s bisection assumes faults that only
  shrink as R grows (my C1 read's side note).
  - Its first run was stopped by me inside P's hold (below). Its second gave up after 30 min waiting for a slot.
  - It answers none of the five questions, so I left it.

## Corrections

- **I ran inside P's exclusive hold again.** P's hold was "P lighthouse landing at d7c28d2f: js-suite + TAP (not a timing
  session)", from 22:32:32.617Z.
  - My `sg2.js` run on tip started at about 22:27Z, with the status reading none, and was still running when the hold began.
  - I saw the hold at 22:37:31Z, stopped the task, and killed its surviving node process at 22:37:46Z. So it ran about 5
    minutes inside the hold.
  - P's run was a correctness suite, so `inferred:` my load slowed it and did not change its verdict.
  - Every later run here was gated on the status read just before it, or went through `heavy-run --run`.
- **Two queues gave up, and I mistook them for waiting.** Their first items waited 30 min on that hold and exited 3. I
  restarted them after the hold cleared at about 23:39Z.
