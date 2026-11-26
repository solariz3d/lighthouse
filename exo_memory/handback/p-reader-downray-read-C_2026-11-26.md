# Read: pane E's reader fix, `reader-downray-e` dab271b (pane C, 2026-11-26)

Packet: the chair's D677 READ of 20:15:49Z. Tier CHECK IT, no edits. Base `ceb21f5`, tip `dab271b`, in my own worktree
`G:\consonance-scratch\t180-downray-c` (detached at dab271b). Three files: `tools/piecewise.cjs`, `test/piecewise.test.js`, `CHANGELOG.md`.
I read the diff first, then E's account (`exo_memory/handback/p-unmakeable-T5-E_2026-11-26.md` §9a). Everything I built is synthetic; no other
author's geometry is in this file or its evidence folder.

## Verdict: NOT CLEAN, one finding

The landing guard and the re-read both do what E's rows say, and the rows go red without the fix. But the re-read does not do what
the CHANGELOG and the code comment say for **banked** road: a fixed height window in `downBand` cuts the band short on any banked road wider than
that window, and moves its centre sideways. E's rows test only an unbanked cup, so they cannot see it.

## 1. Do E's four rows assert what the reader returns, and go red without the fix?

- checked: `node --test test/piecewise.test.js` with `tools/piecewise.cjs` swapped for `git show ceb21f5:tools/piecewise.cjs`, then restored by
  `git checkout` → **11 of 15 pass, the 4 new rows fail** (`evidence/tests_at_base.txt`); at dab271b → **15 of 15** (`evidence/tests_at_tip.txt`).
- What each row's red at base means, read from the assertions (`test/piecewise.test.js:149-181`):
  - row 1 (the strip under the cup) fails on behaviour: width 1.99 against 18.
  - row 2 (no road above, no width → as walked) fails on behaviour too: its first assertion is that every centre sits on the TOP (y = 0), and at
    base the centre is on the strip 1.5 m down. Its name says "does not take a road 5 m above"; the assertion that would catch a road above being
    taken is the same `p[1] ≈ 0` check, so it does cover that (M1 below confirms).
  - rows 3 and 4 (the guard) fail at base partly on `falseLandings` being undefined, as E said. Row 3 also fails on behaviour ("the line runs past
    the take-off"). Row 4 holds the jump count at base; it is the guard's over-fire check, red at base only on the missing field.
- checked, six one-line mutants of the fix (`evidence/mutants.sh`, output `evidence/mutants.txt`): **applied 6 / caught 4 / NOT APPLIED 0.**
  - caught: M1 `above` unbounded (row 2); M2 the guard without `break` (row 3); M3 re-read threshold 0.5 → 0.05 (rows 1, 2); M4 guard radius 0 (row 3).
  - **survived: M5**, the band's 1 m step cap removed (`piecewise.cjs:133`, `if (!next || next.d > stepMax) break;` → `if (!next) break;`). No row
    has a layer beside the band's edge that the band could step onto. My own case A2 (a second road level with the cup's rim) does not catch it
    either (`evidence/synth_M5.txt`: unchanged, 26.59 m).
  - **survived: M6**, the band always taken over the walk (`piecewise.cjs:162`). Minor: the trigger already requires the walk to read under half.

## 2. Consumers: who calls `piecewise.cjs`

- checked: `grep -rln piecewise` over the builder repo (24 files hit the word). The ones that call this module: the command line itself and
  `test/piecewise.test.js`. `tools/kn5-move-gate.cjs:14` only names it in a comment, and `app/core/coreshell.js:1550` names its `--write` output in a
  comment. The other hits are a different "piecewise" (the equation code under `src/`). E's statement agrees for the repo.
- **Missed by E, outside the repo** (checked: `grep -rn piecewise ~/.claude/skills/track-equations`):
  - `scripts/fit-pieces.cjs:11` spawns `tools/piecewise.cjs` (the skill's steps 2-9). Its printed report gains `rereadByDownRays` and `falseLandings`.
  - `evals/regressions.test.js:51` calls `PW.meshCentreline(read, …)` directly and scores `summarise(fitTrack(mc))` against registered bars
    (`:56-64`). With the guard, a read whose jump lands on driven road is now fitted only up to the take-off.
- checked: those registered piecewise evals read `T180_REPO/reads/<name>.read.json` (`regressions.test.js:25`); `t180-fresh/reads` holds 2 reads,
  neither of the three the piecewise evals name, so **they SKIP on this machine** and cannot show whether the guard moves them. inferred: a
  machine with those reads could see a registered result change; nobody has run it.
- checked, how often the guard fires on real reads: the guard's rule (`piecewise.cjs:156-160`) depends only on the read's own station
  positions, not the mesh, so I applied it to all 38 local reads (counts only, kept local) → **5 of 38 fire**. All five are E's shape: the landing 0.1-1.2 m
  from road already driven, heading reversed (cosine of the angle between the headings −0.91 to −1.00). In each the guard drops the rest of the read after the take-off, 0.74 to 7.80 km.
  None of the five is a false fire of the kinds in §3B.

## 3. My own synthetic cases (`evidence/synth.js`; bars printed on its first line before any run: width within 0.5 m, centre within 0.3 m, E's own)

### A. The re-read across widths, banks, cups and strip depths: **FINDING**

A cupped road (floor + 4 m sides rising to 30° or 50°), widths 12, 27, 38 and 49 m, banked 0, 20, 40, 52 and 58°, the read's station on a 2 m strip
1.5 m (or 0.8 m) under the top, 22 stations each. `evidence/synth_tip.txt` and `evidence/synth_base.txt`:

- checked: at dab271b **30 of 60 cases** pass; at ceb21f5 **20 of 60** (only the 0.8 m-strip cases, where the walk already worked).
- Unbanked, every width passes: width 0.02-0.41 m under, centre 0.00-0.20 m off.
- **Banked, the band is cut short and its centre moves sideways:**

  | bank | road 27 m reads | 38 m reads | 49 m reads | centre off (worst) |
  |---|---|---|---|---|
  | 20° | 26.19 | 29.83 | 31.93 | 3.41 m |
  | 40° | 16.39 | 16.64 | 16.64 | 2.44 m |
  | 52° | 13.40 | 13.40 | 13.40 | 2.53 m |

  At base the same stations read 1.99 m wide with the centre 1.5 m down. So the fix improves the width, but swaps a 1.5 m miss straight down
  for a 2.1-3.4 m miss across.
- **Cause, checked by arithmetic against the run:** `downBand` casts its rays from 8 m above the station to 3 m below it
  (`piecewise.cjs:123`, `top = 8, depth = 11`). A banked road leaves that height window at about `window / sin(bank)` along the surface. With the station 1.5 m under the
  top, the cap is 32.2, 17.1 and 14.0 m at 20, 40 and 52° (`node evidence/window_cap.js` → `window_cap.txt`; measured 31.93, 16.64 and 13.40, the rest
  being the band's edge loss of up to 0.4 m). The window is 8 m up and 3 m down, so the band is cut short more on the low side (13.4 against 18.7 m
  at 20°), and the centre moves uphill.
- The CHANGELOG entry and the comment at `piecewise.cjs:110-120` say the band follows "the topmost layer across" on "cupped, banked road". On a
  banked road wider than the window, it stops at the window instead.
- inferred, not checked: whether [T5]'s 15 re-read stations were banked past this. E's count says they read wider, which they would even when cut short.

### A, second limit (recorded, not a regression)

- At 58° bank no station is re-read, and the read stays as the walk found it (1.99 m), as at base. Cause: the top is found only within `above` = 2.5 m
  over the station, measured straight up (`piecewise.cjs:127`). A station 1.5 m under the road's surface is 1.5/cos(bank) m below it straight up, which
  passes 2.5 m at 53.1° (`window_cap.txt`). `maxTilt` = 60 is never reached. This is a named limit, the same as base, and does no harm.

### B. The landing guard (`piecewise.cjs:156-160`)

- B1, a 12 m jump straight on onto new road: **the guard fires** (`falseLandings` d 100, on d 100, 12 m), and the line ends at the take-off.
  The landing is always within the gap's length of the take-off station itself, so any gap under `drivenM` = 20 m fires.
  - checked: the skill's reader looks for landings from 25 m out only (`scripts/read_track.cjs:157`, `for (let dist = 25; …`), and the 58 jumps
    in the 38 local reads run 25.0 m and up. So it **cannot fire on today's reader**. It is a coupling with 5 m to spare: the guard's radius must
    stay under the reader's shortest jump.
- B1b, a 25 m jump: kept, as wanted.
- B2, a jump landing on a NEW deck 12 m above road driven earlier: **the guard fires** (on d 28, 12.2 m) and drops the rest. It measures the 3-D
  distance to any earlier station, without height or heading. checked: none of the 38 local reads has this shape (§2). Latent.
- B3, a landing on a separate 27 m road beside the driven one, 32 m centre to centre: kept, as wanted.

## Corrections

- My first look at the diff asked whether real reads carry the `width` field the re-read keys on. They do (checked: a road station's keys in a
  local read include `width`), so the re-read is live on real data.

## Map line

`exo_memory/map/C.md`, 2026-11-26, reader-downray read.

---

# Re-read: E's repair, `reader-downray-e` dab271b..a8e54b7 (pane C, 2026-11-26)

Packet: the chair's D677 RE-READ of 21:51:00Z. Tier CHECK IT, no edits. Only the change since dab271b: one commit, `a8e54b7`, 3 files
(`tools/piecewise.cjs` +14/−5, `test/piecewise.test.js` +29, `CHANGELOG.md` +3; `git diff --stat dab271b a8e54b7`), read in my worktree
`G:\consonance-scratch\t180-downray-c`, now detached at a8e54b7 and clean. I did my own pass first, then read E's account
(`exo_memory/handback/p-reader-downray-repair-E_2026-11-26.md`, at 19476fbb); it agrees with every number below. Evidence: `evidence/reread/`.

## Verdict: CLEAN, with one wording nit in a comment (mine, carried over)

The finding of my first read is fixed. The rays' height window now moves with the band (`layers(u, ref)`, the window centred on the band's
last point), and the step across halves down to du/64 at steep sides and edges. Every banked case from my first read passes except the ones
past vertical, which the code and the CHANGELOG now name as a limit.

## 1. My cases A as rows, red first

- checked: E's four new banked rows (`test/piecewise.test.js:174-186` at a8e54b7; the edge row at :187) are 20°/27 m and 20°/49 m with 50° sides, 40°/38 m with
  50° sides, and 52°/49 m with 30° sides. Against dab271b's `piecewise.cjs` (swapped in, restored by `git checkout`) all 4 fail, **on width**:
  13.40, 16.64, 26.19 and 31.93 m, the four numbers in my first read's table (`reread/tests_new_rows_at_dab271b.txt`). At a8e54b7 the file is
  **20 of 20** (`reread/tests_at_tip.txt`).
- Each row asserts what the reader returns: every station re-read, width within 0.5 m of W, centre within 0.3 m of the top's centre.
- The 52° row uses 30° sides, not 50°. That is right: at 52° with 50° sides the upper side turns past vertical (102°), which rays from
  above cannot see (below).

## 2. The row that kills M5

- checked, eight one-line mutants (`reread/mutants2.sh` → `reread/mutants2.txt`): **applied 8 / caught 7 / NOT APPLIED 0.**
  - My first read's M5 line was rewritten, so I applied its equivalent on the new line: `if (!next || next.d > stepMax) { h /= 2; continue; }`
    → `if (!next) { h /= 2; continue; }` (M5b). **Caught**, by the new row "the band stops at its edge where the next layer is a step of more
    than 1 m": a lower road 2.5 m down beside the edge, which the band would otherwise walk onto.
  - Two mutants that undo the repair, both caught: M7, the window fixed at the station again (3 banked rows), and M8, no step refinement
    (3 banked rows).
  - M1-M4 caught as before. **M6 still survives** (the band always taken over the walk), minor as in the first read.

## 3. The comment at the guard

- checked: `tools/piecewise.cjs:164-166` (at a8e54b7) says drivenM (20 m) must stay under the reader's shortest jump, that the reader looks for
  landings from 25 m out only, and "Raise one only with the other." It anchors on the code text (`for (let dist = 25; …`), not a line
  number. That is what the chair asked for.
- **Nit, and it is my wording:** the comment says "a landing is always within its gap of the take-off station". It is the other way round.
  The reader's search (skill `scripts/read_track.cjs:160-162`) steps `dist` along the heading from 25 m and adds a sideways offset up to 16 m
  and a drop down to 100 m, so a landing lies **at least** its gap from the take-off, never within it. The conclusion stands: a 20 m radius
  can never reach the take-off itself, and a radius at or past 25 m would end every straight, level jump of 25 m. E took the phrase from my
  first read (§3B, "the landing is always within the gap's length of the take-off station itself"), which was exact only for my
  straight-on synthetic case. A one-word fix ("within" → "at least") for whoever lands it; it changes no behaviour.

## 4. My own probes again

- checked, `reread/synth_all_tip.txt` (my `synth.js`, made to print every case): **A: 48 of 60 cases pass** (30 at dab271b, 20 at ceb21f5).
  - Every banked case at 20° and 40°, and at 52° with 30° sides, at widths 12, 27, 38 and 49 m: width 0.01-0.06 m short, centre 0.05-0.17 m
    off (bars 0.5 and 0.3 m).
  - 4 misses, at 52° with 50° sides (the overhang): 10.94 of 12, 25.94 of 27, 36.94 of 38, 47.95 of 49. Checked by arithmetic: the upper side's
    slope is 52° + 12.5°/m along its 4 m arc, so it passes vertical 3.04 m along and 0.96 m of it cannot be seen from above. The rest of the
    1.05-1.06 m shortfall is the edge loss the passing cases show. Centre 0.72 m off (0.32 m at 49 m). inferred: the uphill side's lost
    arc moves the centre, but half the shortfall is 0.53 m, so 0.72 m is not fully explained. Named in the CHANGELOG and the comment as a limit.
    At dab271b the same cases read 13.40 m.
  - 8 misses at 58°, unchanged from base and from my first read (the `above` = 2.5 m limit, `piecewise.cjs:127` at dab271b, :132 at a8e54b7).
  - A2 (a second road level with the cup's rim): 26.99 of 27, not taken.
- B, the guard, unchanged: its code did not change (only the comment). B1 (12 m jump) and B2 (new deck 12 m over driven road) still fire;
  both stay latent with today's reader, as in the first read. B1b and B3 kept, as wanted.

## Corrections (mine)

- **My first read cited the reader's landing search as `scripts/read_track.cjs:157`.** No copy on this machine has it there (checked:
  `grep -n "for (let dist = 25;"` over every `read_track.cjs` under the user folder and G:, 90 copies: 153, 159 or 160, none 157).
  The skill's copy has it at :160. E caught it first and inferred I had read another machine's copy; it was simply a wrong number. The
  code text is the anchor.
- The "within its gap" wording in §3 above is my first read's, now carried into a comment.
