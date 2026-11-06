# D642: review of the merged tip, t180 d642-p a924f1b (pane E, machine D, 2026-11-05 ~18:3x local) — INTERIM: four mutation harnesses held

Tier: PROVE IT. A reader who did not write it. Packet: chair D642 (00:12Z), then the chair's hold (00:17Z): no mutant runs until B's paired timing session
is done. Read whole: B's §4-§5 (`p-d642-core-B_2026-11-05.md`), C's (`p-d642-passthrough-renders-C_2026-11-05.md`) and P's merge hand-back (interim).
BASE: `C:\Users\nname\Downloads\t180-fresh` a924f1b (6178581 = 923e0a3 + 72e661d; a924f1b = 6178581 + 94800ec).

**VERDICT (interim): the four checks the chair named hold.**
- My e48a310 finding is closed.
- Extra 0 is byte-equal to no extra.
- His −90 keeps its first half.
- The bar holds on every case I laid through the panel.
- `core_ramp_mutation`: 85/85.

**One finding for B and his eye (not a bar breach): the new bank minimum (R2) is stricter than the bar needs, and it costs his p2 its bank
back.** C's 923e0a3 renders of his p2 (extra bank to −88.45 from 500) are not what a924f1b lays: the panel now holds that extra at −37.53°,
while the same piece built on 923e0a3 reads 0.955 × the bar.

**Pending:** `core_cup_mutation`, `core_xsec_mutation`, `app/test/core-mutation.test.js`, `app/test/mutation.test.js`, held at the chair's word.
The cup run was killed mid-run, no verdict.

**How it was run:**
- **Tree:** `git worktree add --detach C:/Users/nname/Desktop/worktrees/t180-e642b a924f1b`; `find -type l` → 0. Read-only: nothing
  committed to t180, no push.
- **Comparison trees:** `git archive` copies of 923e0a3 and df62d6f in scratch.
- **Not run or touched:** the installed exe, any browser, any window, any timing row. Node only.
- **The panel drives:** C's D641 mount (`core-extra-handles-glitches.test.js` at d91227f :6-69: the real core shell, panel and handles on a
  fake stage). Every case is laid by `TB.extendCorner` of the panel's own `options()`.
- **Every command started with the timing-lock check.**
  - At 00:12Z P's timing session ("t180 P D642 timing rows solo") held the lock. I ran nothing until it cleared at 00:14:48Z.
  - At the 00:17Z hold my mutant run was in `core_cup_mutation`. I killed its process tree and removed its lock (mine: pid 10460, my token,
    the process dead) at 00:17:49Z, and rang the librarian.

## 1. My e48a310 finding: CLOSED

checked: `evidence/probe3.js` → `probe3-a924f1b.json`. His rolling 88.45° piece, the true next-100 m candidate, then ONE segment of the last
placed piece tampered, every field a segment carries (`id, word, part, kind, length, k0, k1, kp0, kp1, roll0, roll1, rollRate0, rollRate1,
heartline, profile, blend, speed`):

| changed in the last placed piece | a924f1b |
|---|---|
| `word`, `part`, `kind`, `length`, `k0`, `k1`, `kp0`, `kp1`, `heartline`, `profile` | **refused by name** ("the candidate must extend the placed track") |
| `roll0`, `roll1`, `rollRate0`, `rollRate1`, each alone and all four together | accepted, re-laid from 971 |
| the piece BEFORE the last: `roll0` and `roll1` | refused by name |
| one segment of the last placed piece removed | refused by name |

- `blend` and `speed` were not tampered: they were not numbers, strings or objects on that segment.
- Every real next piece still gets its ghost: re-laid after the rolling pieces, copy-and-extend after the one at rest. The spread was his
  88.45°, the corkscrew, a turning rounded bank and a bank at rest, each with straight, bank −180, turn rate, corner +90 (`turnDeg`, as the
  panel sends it) and width + cup.
- The jump, as the panel sends it (`shell.candidateJump({ length: 100 })`, `loose-a924f1b.json`), after his rolling piece: re-laid from 971.
  (My first jump call passed no length and threw `BAD_LENGTH`; that is my call, not the build.)

## 2. Extra 0 is no extra: byte-equal, through the panel

checked: `evidence/additive-full.js` → `additive-a924f1b.json` and `additive30-a924f1b.json`.
- The piece: 1,000 m, −90 corner, bank 88.45, cup 15 (15.5), width 30 (31).
- Each extra handle made through the panel (`secondExtra`) at its "no change" value, the piece laid from the panel's options, `D.serialize`
  against the same piece with no extra.

| the extra | what the panel sends | byte-equal |
|---|---|---|
| turn 0 | `turnDeg: [{ from: 500, deg: 0 }]` | **yes** (4,052 / 4,830 bytes) |
| bank at its own 88.45 | `phi: [{ from: 500, target: 1.5437… }]` | **yes** |
| width at its own 30 | `w: [{ from: 500, target: 30 }]` | **yes** |
| cup at its own 15 | `c: [{ from: 500, target: 15 }]` | **yes** |
| climb 0 (a +20 climb corner) | `climbDeg: [{ from: 500, deg: 0 }]` | **yes** |

- Seen on the way: with width 31 and cup 15.5 (his HUD's values) the piece shows **no** extra width or cup handle. With 30/15, or 40, it
  does (`loose-a924f1b.json`).
- checked: the same on df62d6f and 923e0a3, so it is older than this merge and not D642's.
- inferred: `offersAt`'s room rule (the change's own minimum against the piece) for a 1 m width step or a 0.5° cup step. For his eye only.

## 3. His −90 keeps its first-half heading

checked: `additive-a924f1b.json` H. His p2 through the panel: the extra turn +180 and the extra bank toward −88.45, both laid from 500.
Against the same piece with no extra:
- The built heading on the adapter's path, all 1,001 stations from the piece's start to the mark: **worst difference 0°**.
- −45.0000° at 500 m both ways.
- The piece turns **+90°** with the extra, against −90° without.

## 4. The smoothness bar

checked: `additive-a924f1b.json` BAR.
- **The reader:** the built heading's and pitch's 1 m second difference, and the built roll's 2 m second difference ÷ 4, each ÷ the bar
  (29.4 / (10 · 170²)). It is `core_additive.test.js`'s definition, my own code.
- **Where:** over the piece and 20 m into a 200 m straight laid after it.
- **The cases:** all laid by the panel.

| case | heading | pitch | roll |
|---|---|---|---|
| his p2 (−90, extra +180; bank 88.45, extra held at −37.53°) | 0.809 | 0 | 0.965 |
| his S (−90, extra +90) | 0.440 | 0 | 0.896 |
| his 11-05 picture (750 m, −90, bank 66.14 then 0; the panel's mark 375) | 0.165 | 0 | 0.960 |
| his 88.45 alone | 0.093 | 0 | 0.896 |
| a climb corner +40, extra −80 | 0 | 0.360 | 0 |

**Every one under 1.0.** The reader is checked against B's and C's own figures on 923e0a3 (`evidence/r2bar.js`): R2's case from 477.42 m
reads **1.174** and from 450 m **1.049**, exactly as B and C report.

## 5. The finding: R2's bank minimum refuses more than the bar does, and his p2 loses its bank back

checked: `evidence/p2bar.js` and `r2bar.js`, the core alone, the same piece on both trees:

| | 923e0a3 (C's renders) | a924f1b |
|---|---|---|
| his p2's extra bank 88.45 → −88.45 from 500: the minimum asked | 438.7 m | **592.5 m** (500 m of room) |
| laid at −88.45 | built roll **0.955 × the bar** | **refused** (`BAD_SECOND … needs at least 592.5 m`) |
| through the panel | reaches −88.45 | **held at −37.53°** (the farthest that fits from 500) |
| R2's own case, the extra bank from 430 m | 0.965 × the bar | refused (it needs from ≤ 387.7 m; from 387.7: 0.957) |

- **What it means:**
  - R2 is safe: nothing it lets through reads over the bar (§4).
  - It is not tight. It refuses his p2's bank-back to −88.45 from halfway, and that piece reads **0.955** on the built road where 923e0a3
    laid it.
  - So the case he named ("for the second 180 section i cant even add extra banking back to the other way") is, on a924f1b, held to
    −37.5° unless he moves the mark earlier (to 407.5 m or before).
- **C's renders:** C's 923e0a3 renders of his p2 (case 3 reaching −88.45, the overshoot to −90.96) show what 923e0a3 lays, not a924f1b.
- inferred: R2's share (`baseShare` for the rounded ramp, capped at `BASE_SHARE_MAX`) is sized on his 11-05 picture's worst point and taken as
  a fixed share. A case-by-case check of the built peak would admit his p2.
- **That is B's rule and his call.** I flag it rather than call it wrong: the bar holds either way.

## 6. Core mutants (re-run myself)

    checked: evidence/mut2.log (a924f1b, holdrun + BelowNormal, hidden, one at a time, each waiting out any timing lock)
      test/core_ramp_mutation.test.js: tests 87, pass 87 → applied 85 / caught 85 / NOT APPLIED 0 (+2 controls), 00:15:16Z–00:16:32Z
      test/core_cup_mutation.test.js: KILLED mid-run at the chair's hold (about 00:17:30Z): no verdict
      test/core_xsec_mutation.test.js, app/test/core-mutation.test.js, app/test/mutation.test.js: NOT RUN (held)

B's figures for the held ones (§4-§5): cup 50/50, xsec 69/69, core-mutation 65/65, mutation 110/110. They are B's; I re-run them when the
librarian says B's timing session is done.

## NOT verified

- **The four held harnesses** (above).
- **Timing:** P's and B's. I ran no timing row.
- **His real window and GPU:** not run.
- **C's renders on a924f1b:** not re-made. §5 says what changed under them.

## Corrections (mine)

- My first jump probe passed no length (`BAD_LENGTH`); redone with `{ length: 100 }` (§1).
- My mutant run held the heavy-run lock until the chair's hold arrived. I killed it and removed its lock at 00:17:49Z. If B's session had
  already started, my cup harness overlapped it by up to about a minute; I rang that to the librarian at once.
