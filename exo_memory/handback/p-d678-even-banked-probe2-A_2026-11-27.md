# D678 track 2: Sculpt's Even tool, the banked turn, a second probe. Pane A, D, 2026-11-27

**The order:** the chair's D678 dispatch, 16:24:11Z, track 2 of `loop/packet_t180_pickup_on_D_2026-11-27.md` (b461841f).
**The packet, run as written:** `loop/packet_t180_sculpt_even_banked_probe2_2026-11-27.md`.
**Read first:**
- `handback/p-l267-sculpt-even-build-A_2026-11-27.md`, "Stage 1, measured";
- `loop/plan_t180_sculpt_even_2026-11-27.md`.

**Base:** builder `landing-1127-l263` c522ea6, read in my own detached worktree `G:/consonance-scratch/a-d678-even/wt`.
**Tier:** measure only. Nothing of the grab is committed or built: no suite, no install, no merge, no builder push, his app not launched.
**Evidence:** `handback/p-d678-even-banked-probe2-A_2026-11-27_evidence/`.
**My stake:** I wrote E5 and the L267 probe (my map, L265 and L267). In L267's "What might hold" I leaned toward (ii), fixing the grab's cause. That lean is
candidate 3 below, so a result for 3 is the one I would like; read its rows with that in mind.

---

## Registered before the run (2026-11-27 16:33Z; committed before the probe is written or run)

### What the code says about candidate 2, first (read from `app/core/zonegrab.js` `follow`, `frameAt`, and `app/core/coreshell.js` `followed`)

- **One grab, at the pressed spot, is a function of what the level can read.**
  - `follow` holds the far rim and moves the pressed rim by the drag's part in the section's plane: the chord v0 (far rim to pressed rim, in [R, U0]) becomes v1 = v0 + (e, v).
  - The bank turns by the angle from v0 to v1 (`dphi`), and the width scales by k = |v1| / |v0| (`w: w * (k − 1)`).
  - A horizontal pull (v = 0) keeps the chord's vertical extent. On a symmetric section (the rims at one height in the section, as on this road) that extent is |v0|·sin φ, so **k·sin φ1 = sin φ0 at the press**, which gives
    **φ0 = asin((w1 / w0)·sin φ1)**.
  - The cup does not enter, except through the rims' heights in the section, which differ only on an unsymmetric section (edge pieces, split widths).
  - inferred check against L267's figures: on the banked road one grab sent w +3.8559 and phi ±0.0872 rad (`bank267.json` `fixtures.*.followT1`). asin(15.8559 / 12 · sin 15°) = 20.0°.
- **Away from the press it is not.** `followed` brushes the whole set { h, l, w, phi } in one step with one falloff (`sculpt.js` brush, `channels`, each divided by its own unit ratio). So at a station with weight f the width changes by f·Δw and the bank by f·Δφ, linearly. The geometry is not linear in the pull.
  - So the per-station relation above holds only where f = 1.
  - inferred, computed from the figures above: at f = 0.5 on Bhold it gives −20.43° where the design is −20°, so 0.43° off.
- **One grab is still derivable from the whole profile.** Δφ(s) / Δw(s) is one constant ρ along a single grab, and the invariant at the press fixes it. The press is the width excess's peak.
- **Several grabs do not compose into something the level can read.**
  - Each grab is computed on the document the last one left (`grab` reads w and φ at its own press, after the others). So each has its own ρj, and the totals the level can read are Δw(s) = Σ fj·Δwj and Δφ(s) = Σ fj·Δφj.
  - The width excess and the bank as found do not say how the excess at a station was split among grabs, or where the presses were.
  - **The same rim and opposite rims obey the same relation per grab.** A horizontal widening flattens the bank toward 0 from either rim, because the chord's vertical extent is kept either way. A narrowing steepens it.
  - Opposite rims break the level's other premise too: each grab holds a different rim, so there is no one held rim to keep.
- **So 2 is measured in its two readable forms, not forced into a third:**
  - **2p, per station:** φ = asin((w / w_ease)·sin φ_found) at every station. This is the librarian's literal question.
  - **2r, one grab:** φ = φ_found − ρ·(w − w_ease), with ρ from the invariant at the width excess's peak in the window. Where the excess is under 1e-6 m, nothing is changed.

### The candidates (all in scratch, in the probe; the window is L267's: run 180–460, 30 m ramps, outer ends s 150 and 490; width to 16 m)

- **C1, the centre within the road's own plane, the bank kept as found** (the packet's 1; L267's (iii)):
  - the width as E5k (`bank267.js` `levelDir`, keepBank true);
  - l as E5k: the held rim's place across where the start, eased back to its untouched width and shift, puts it, at the bank as found;
  - **h moved with l in the road's plane:** at each control point, h = (1 − g)·[h_start + (l_new − l_start)·tan φ] + g·[h_ease + (l_new − l_ease)·tan φ], with φ the levelled document's bank there;
  - on a flat road tan φ = 0, so C1 is E5k, and so E5.
- **1+2p and 1+2r:** C1 with the bank brought to 2p's or 2r's given-back bank first (the bank is then the one the held rim, l and tan φ are read at).
- **3+1, the cause removed** (the packet's 3; scratch only):
  - `followChord`: `follow` with one change. At a rim press, the drag's part in the section's plane is projected onto the chord before v1 is formed, so the chord stretches and does not turn.
  - It is called with the probe's own gesture: the same horizontal pull, by want − w.
  - The starts T1c and T2bc are T1 and T2b made with it. Then C1 levels them.

### The fixtures (rebuilt in scratch: how is reported with the results)

- F (flat), F0 (flat, cup 0), B+ (the plan's, +20°, banked away from the turn's centre), B− (−20°, into the turn), and Bhold (−20°, constant across the window).
- Starts: base, T1 (one grab at s 320), T2b (8 grabs every 30 m from s 215), each to 16 m, radius 30, on the outer (right) rim.

### The control, read before any banked row (if it does not match, the probe stops and no banked row is read)

| row | what passes |
|---|---|
| K1 | E6 on F (`bank267.js` `levelDir`, unchanged) from T1 and T2b reproduces E5: w, l, h spreads 0 over the run; the held rim 0.0000 m across from the turn before any grab, and +0.4353 m up; 0 reds on the run and in the window; 0 ambers; nothing outside the window changed |
| K2 | C1 on F from T1 and T2b is byte-identical to E6 on F (sha256 of `serialize`): the flat road the same as E5 to the digit |
| K3 | the rebuilt fixtures match L's, as `bank267.json` records them: offsets, end, the T1 follow, the section at s 320, the widths at s 150 and 490, the bank every 10 m (F, B+, B−, Bhold) |

### The rows (every 1 m over the run 200–440; on Bhold and B−, from T1 and T2b; B+ reported as one row each, not as a test)

| row | what passes | what fails |
|---|---|---|
| R1 reds | no red on the run or in the window (the ramps included) that the base lacks | any |
| R2 held rim | its place across within 0.01 m of the banked turn's before any grab, station by station (L267's reading b) | > 0.05 m |
| R3 outside | nothing outside the window changed | any change |
| R4 centre | the centre's height within 0.01 m of its in-plane target over the window (the candidate built as defined) | > 0.05 m |
| R5 bank (candidate 2's bar) | the bank within 0.01° of the banked turn's before any grab, every 1 m over the run | > 0.1° |
| also reported | B1 the width's spread; B2 the outer rim against the levelled base; B9 the bank against the levelled base (the same level from the base) | |
| C3a | the chord grab gives the same document as today's grab, sha256 of `serialize`, on F and on F0, from T1 and from T2b | any difference |
| C3b | on Bhold (and B+, B−), the chord grabs leave the bank within 0.01° of the turn's before any grab, from T1c and T2bc | > 0.1° |

### Each candidate's failing result, registered

- **C1 fails** if, from T1 or T2b on Bhold or B−, R1, R2 or R3 fails. **Predicted: it fails, through R2.** The held rim lands 0.0964 m (T1) and 0.0968 m (T2b) across, E5k's figures, because the rim's place across does not depend on h, and the bank kept is the grabbed one.
  - B9 then shows the grabs' bank change kept: 4.9984° (T1) and 5.0209° (T2b).
  - **Predicted to pass R1:** the ramp reds E6 and E5k drew (2 on Bhold, 1 on B−) are gone, and R3 passes.
- **2 fails** (its bar) if R5 is over 0.1° anywhere on the run, from T1 or T2b, on any of B+, B−, Bhold.
  - **Predicted: 2p fails from T1 and from T2b on all three**, at about 0.4° where the brush's weight is near one half.
  - **2r passes from T1 on all three** (one grab is exact), **and fails from T2b on all three** (several grabs).
- **1+2r fails** as C1 does, plus R5.
  - Predicted: from T1 it passes R1 to R5 on Bhold and B−.
  - From T2b it fails R5 (2r's residue). R2 is not predicted.
- **3 fails** if C3a finds any difference on a flat road, or C3b is over 0.1° on Bhold. **3+1 fails** if, on Bhold or B−, from T1c or T2bc, R1, R2, R3 or R5 fails.
  - **Predicted: C3a the same bytes on F and F0, C3b 0.0000°, and 3+1 passes R1 to R5.**
  - inferred, for what a driver sees: the press reads less than today's on a bank (the chord takes e·cos 20°: about 15.80 m against today's 15.856 m).

### The unwelcome outcomes, in the words that would make them true

- **U1: "the plane centre leaves the ramp reds."** Then L267's 0.67 m-along-the-normal mechanism was wrong, and call 10's banked form is not their cause.
- **U2: "2r passes from T2b."** Then the bank change is derivable in practice from several grabs, and my reading of the code above is wrong where it matters.
- **U3: "the chord grab changes the document on a flat road."** Then 3 changes his daily tool on flat roads too.
- **U4: "3+1 fails a row."** Then fixing the grab is not enough, and the pick is open again.
- **What I will say I would build, fixed now:**
  - 3+1 if C3a, C3b and 3+1 hold;
  - else 1+2 if 2r holds from T2b;
  - else none of the three, said so.
  - C1 alone keeps the grabs' bank change in every prediction above.
