# D675: the yardstick's fastest toe over the running speed, green, against one runner (JA1). The hunter's gait law reads above JA1 at all four of JA1's speeds (pane E, machine D, 2026-11-13)

Ruling: the chair's D675, "GO, WITH TWO AMENDMENTS ... Tier: PROVE IT". The registration, with the amendments written in
by name before any code: `exo_memory/loop/registration_yardstick_toe_speed_E_2026-11-13.md` (lighthouse `c3a24c4e`).

dreamzone-3 branch **`yardstick-toe-e`**, local, not pushed. The worktree and build tree are on
`G:\consonance-scratch\dz3-e-yardstick`.

| commit | what |
|---|---|
| `0922b4be9acf5a701d1d4f404bc0d64bd65a2e2a` | RED: headers, stubs, eight rows. `yardstick_tests` 20 tests, 8 failed (the eight new rows) |
| `704774c139e3e3b4d21635ca38e90db061c3123e` | GREEN: `c3d.cpp`, `end_speed.cpp`, `dz-yardstick --simtk`, `fetch_simtk.ps1`, README step 3, CHANGELOG |

Base `b08f25e` (main). Only `tools/` and `CHANGELOG.md` change; nothing reaches the game.

## The reading (AMENDMENT 2: one runner, JA1, four trials; not a population's spread)

checked: `dz-yardstick --simtk G:\consonance-scratch\simtk_ja1` on `704774c` under heavy-run (whole output beside this file,
`p-d675-yardstick-toe-E_2026-11-13_scripts/simtk_table.txt`) →

Toe over running speed, **at the same cut-off**, 10 / 15 / 25 Hz (AMENDMENT 1). Ours unfiltered is beside and not
compared.

| m/s | JA1 toe | ours (`gait_pose`) toe | ours above JA1 | ours unfiltered | JA1 ankle | ours ankle |
|---|---|---|---|---|---|---|
| 3.53 | 2.37 / 2.37 / 2.37 | 2.85 / 2.85 / 2.86 | +0.48 / +0.48 / +0.49 | 2.86 | 2.09 / 2.10 / 2.10 | 2.33 / 2.34 / 2.34 |
| 5.19 | 2.21 / 2.21 / 2.22 | 2.67 / 2.69 / 2.69 | +0.46 / +0.48 / +0.47 | 2.69 | 1.93 / 1.93 / 1.93 | 2.11 / 2.13 / 2.13 |
| 6.97 | 2.25 / 2.26 / 2.26 | 2.47 / 2.51 / 2.52 | +0.22 / +0.25 / +0.26 | 2.52 | 1.97 / 1.97 / 1.96 | 1.97 / 2.00 / 2.01 |
| 9.47 | 2.20 / 2.24 / 2.24 | 2.31 / 2.37 / 2.38 | **+0.11 / +0.13 / +0.14** | 2.39 | 1.89 / 1.92 / 1.92 | 1.87 / 1.90 / 1.92 |
| 9.00 | (no trial) | 2.33 / 2.38 / 2.39 | | 2.39 | | 1.87 / 1.91 / 1.92 |
| 11.00 | NOT COVERED | 2.18 / 2.24 / 2.26 | | 2.27 | | 1.78 / 1.82 / 1.83 |
| 12.60 | NOT COVERED | 2.08 / 2.14 / 2.16 | | 2.17 | | 1.71 / 1.75 / 1.77 |

**Section 7's first unwelcome outcome holds, as registered:** "the gait law itself whips".
- `gait_pose` on a straight reads more than 0.1 above JA1 at the same speed, at every one of the three cut-offs, at all
  four of JA1's speeds.
- At 9.47 m/s it is narrow (+0.11 to +0.14) and within rounding of the bar. At the jog it is wide (+0.48).
- Said the only way the ruling allows: **above one runner (JA1)**. Nothing here says "outside the human range".

**And what it says about the 2.8 C was asked about (inferred from the table, not checked against the game):**
- At the hunter's own 11 m/s, `gait_pose` on a straight reads 2.18 to 2.26 (not covered by any trial).
- The game's keyed toe read about 2.8 at a named 11 m/s (my earlier read, its 11 not measured at the tick).
- So that 2.8 is not this gait law at 11 m/s on a straight. It comes from something this measure does not draw: the
  chase's lean or turn, the eased pose, the keyframe's foot in a turn, or the hunter's speed at that tick.
- That is the case section 7 named "the yardstick cannot see the whip". I have not widened the measure, as registered.
  C's read of the hunter in the game stays C's.
- **The shape, as a lead for C or him:** ours falls with speed (2.85 → 2.16), as JA1's does from the jog (2.37) to the
  sprint (2.20–2.24). Ours falls further, crossing JA1's sprint figure only past 9.47, where nothing is measured.

## The checks

**The suite:**
- checked: `yardstick_tests` on `704774c` → **20 tests, 0 failed**: the 12 existing rows and the 8 new.
- The new rows print:
  - row 1: a 3 m/s point is off by at most 0.000263 m/s at every cut-off;
  - row 2: 10.2803 against v + ωr 10.2832;
  - row 3: kept 0.9962, cut to 0.0551;
  - row 4: read back within 0.0000 mm, the unseen frame unseen, processor 85 refused by name;
  - row 5: 5.19 m/s toe 2.666 / 2.686 / 2.692, the bits equal twice, the stride 0.6907 s by the law with the toe's
    lowest 3 times, off by at most 0.0032 s;
  - falsifier 4: 1.000002 / 1.000004 / 1.000006, unfiltered 1.000017;
  - row 7: the verdict;
  - row 8: the band line.

**Row 6 and falsifiers 1 to 3,** checked by `--simtk` (exit 0):

| check | reading | verdict |
|---|---|---|
| row 6 / falsifier 1: this reader against the JavaScript reader (toe and ball) | at most **0.0047** apart | row 6 pass; falsifier 1 holds |
| falsifier 2: along the foot from the ankle, over the shank, horizontally | JA1's ball 0.297, toe marker 0.455; **ours 0.426** | holds: our Toe is a forefoot point, past the ball |
| falsifier 3: the two toes in a trial | differ by at most 0.086 | holds (bar 0.15) |
| falsifier 4 | 1.000002, as row 4b | holds |

**Hand mutants,** each through the suite and `--simtk` (script beside this file: `mutys.js`) → **applied 6 / caught 6 /
NOT APPLIED 0**:

| mutant | caught by |
|---|---|
| the C3D scale factor ignored | row 4 |
| the frame rate taken as 240 | row 4, and `--simtk` row 6 |
| the running speed the named speed, not the pelvis's | `--simtk` row 6 |
| the filter run forward only | row 3, and `--simtk` row 6 |
| our phase at a fixed rate | row 5 |
| `feet` not carried | falsifier 4's row |

- The clean rebuild afterwards: 20 tests, 0 failed; `--simtk` exit 0.
- **Not run:** the game's whole suite. Only `tools/` and `CHANGELOG.md` change; the landing pane runs it.
- **Credential scan:** 0 hits over `b08f25e..704774c`, added lines, the same shapes as the push scan.

## The second reader caught a bug in itself: the correction, in full

- **What happened:** the first green `--simtk` run gave the 9.47 m/s trial a toe of **29 / 42 / 63** times the running
  speed. Falsifier 1 fired ("two readers disagree", 60.77 apart), and so did row 6.
- **The cause** (checked, by reading the bytes): RTOE at frame 323 of `JA1Gait35.c3d` is stored at (0, 0, 0) with its
  fourth word 65535.0. That is the 16-bit −1 ("not seen"), written as a float holding the unsigned value.
  - My C++ reader tested the float for "< 0", so it took the point as seen at the lab origin, about 6 m from the toe.
  - The JavaScript reader reads the word's low byte as a signed byte, so it took the point as unseen.
- **The fix, test first:**
  - row 4's written files now carry a frame marked unseen, in both forms. Red before the fix: the floating-point form
    failed, the integer form passed;
  - the reader now takes the fourth word as the 16-bit integer it holds, signed;
  - green after.
- **What this shows:** this is what the registration's guard was for (section 8, my bias, and falsifier 1). One reader
  alone would have reported a whip of 63.

## Changed from the registration, by name, each before its first run

1. **Row 3's bars:**
   - "kept within 2%" is read at a quarter of each cut-off, where the filter keeps 99.6%;
   - "cut at twice the cut-off" is under 10%, not 30%. The filter run forward only keeps 24% there, so at 30% the
     registered mutant "forward only" could not fire. It is caught now.
2. **Row 5** gains a check that the toe strides at two of the law's steps. No registered row could see the registered
   mutant "the phase at a fixed rate"; it is caught now.
3. **Row 6 lives in `dz-yardstick --simtk` (exit 1 on a miss), not in `yardstick_tests`.** The harness has no NOT
   MEASURED state, and a data-gated row would count as a pass when the data is absent, which the registration forbids.
4. **Falsifier 2's normaliser:**
   - registered as "a fraction of the runner's ankle-to-toe-marker length", which has no counterpart on our body (we have
     no ball joint);
   - read instead as a share of the shank (knee to ankle) for both bodies, horizontally: JA1 from the static trial
     (RLEPI to RLMAL), ours from the rest pose.
5. **Falsifier 4** is a row in the suite (it was registered as a falsifier only).

## The data, and where everything is

- **The data:** `G:\consonance-scratch\simtk_ja1`, unpacked by `fetch_simtk.ps1` from the registered zip (sha256
  `380ac4b6…`).
  - The package's readme states no licence. It asks that its references be cited, and names "conducting your own
    custom-made analyses" as an intended use. The README and the script say so.
  - The readme names the 9.49 m/s trial `JA1Gait25`; the file is `JA1Gait35`.
- **The worktree's submodules** were checked out from his clone's module repositories (read only, local file transport
  allowed for that one command). His clone is unchanged at `31d1c6d`, clean.
- **C: was not written** beyond the shared clone's git objects. The build tree is on G:.
