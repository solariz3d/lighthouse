# D434: the loop-closer banks its big curves (librarian, 2026-10-22). QUEUED, behind D431 on the same pane

## The ask

The keeper, 2026-10-22 09:44: "TEST TRACK 10, i tested the closed loop and in theory made a beauitful end to it, the closed loop was the last 3 pieces i believe, look at them, the strutcure itself is good, but there needs to be a nuance for banking in large curves like that to support the car better, you know what I mean?" He said "another thing to queue".

## What the closer made on TEST 10 (checked, on the copy `scratchpad\d431\eq-TEST 10.t180track`)

| piece | length | turn | tightest radius | bank | cup |
|---|---|---|---|---|---|
| p21 | 919 m | +175° | 151 m (37.9°/100 m) | **0°** | 15°, carried from p20 |
| p22 | 746 m | −0.2° | 3,882 m | 0° | 15° |
| p23 | 919 m | −174.8° | 151 m | **0°** | 15° |

- So the closer turns a near-hairpin each way at a 151 m radius with the road flat. Only the 15° cup is carried through.
- The close (`src/core/close.js`) holds the bank only so that the frame closes: ":7 the bank ends where it began, mod 2π", and the seam residual is at `:220-223`. It never chooses a bank for the curves it makes.
- No speed-to-bank rule exists in `src/core` or `app/core` to reuse (checked: grep for designSpeed, autoBank, bankFor). `designSpeed` is read only by the validator's speed check, through coreshell and the overlap job.

## The change

The close generator gives each curve it makes a bank that supports the car through it:
- the bank is worked out from the curve's radius and the track's design speed, with the same design speed the validator already uses;
- it eases in and out with the curve, and returns to the seam's bank so the frame still closes;
- the cup is left as the user built it.

The rule is the pane's to propose, with numbers: the bank at the design speed against the load the validator calls proven (`load-above-proven`, FINDINGS.md:105) and the sustained-load amber (D341). The keeper sees a before and after on TEST 10 and drives it. The bank is a taste call, so it is shown before it lands.

## Part 1, pane O, after D431 lands on its branch (same file, same tests). Tier: prove it (core geometry)

1. Build on `d431-o`.
2. **Test first:** a closer whose curves are tighter than the design speed's flat limit gets a bank on those curves. A closer with only gentle curves gets none. Both still close to tolerance. Red now on TEST 10's case.
3. **Measure:** lateral load through p21 and p23 at the design speed, before and after, from the validator's own load figures.
4. Headless shots of the closer, before and after; the librarian shows them to the keeper.
5. The close and core mutation harnesses run whole.
6. **Don't edit the keeper's tracks.**

**Part 2:** the librarian rules, and the keeper's eye decides the bank's size before it lands.

NEXT: chair queue D434 for O, to start when O hands back D431; O hands back to the librarian.

## Amendment, 2026-10-22 09:5x: the keeper meant TEST TRACK 10 (librarian)

- The keeper, 09:49: "no i meant TEST TRACK 10". This plan was written against TEST 10.
- Both tracks have system-made closers with the same two faults, so the work at the generator stands.
- **TEST TRACK 10 is now the primary case.** Copy: `scratchpad\d434\eq-TEST TRACK 10.t180track`, sha256 4045b7b3…, saved 09:42. The closer is p42 (1,273 m), p43 (760 m) and p44 (1,744 m).
- **Joint overshoot (D431), larger here.** Control points across each joint, in °/100 m:
  - p42→p43 kh: −0.15 | −11.81, **−23.54** | −5.71, against a trend near −6 to −7;
  - p41→p42 kh: −0.10 | −5.99, −12.72 | −2.32, and kv −15.83 against a trend near −3 to −4;
  - p43→p44 kh: 13.20 against a trend near 3 to 5.
- **No bank (D434).** The closer holds the base bank −180° throughout. In the builder's flipped form (pitch about 180°) that is upright, so the road is flat.
  - Measured with `scratchpad\d434\lean.js`: the road's lean into the curve, asin(U·k̂), over the closer averages −0.6°; 373 stations lean into the curve and 405 lean out.
  - The keeper's own hand-banked p34–p39 just before it averages 53.2° into the curve, with 0 stations leaning out.
- TEST 10 stays as a second case. Both cases go in the test.

## Part 2 ruled, 2026-10-22 19:4x (librarian, at the keeper's 19:48 "did you ever do the work for the close loop understanding the nuance for when it should use banking")

O measured this and did not build it: `exo_memory/handback/p-d434-O_2026-10-22.md`. Ruled: **build it, at 0.75 × balance.** The keeper can veto.

- **The rule.** Each piece the closer makes gets a bank of −0.75·atan(v²·k/g), with v the validator's design speed. This is O's sign, measured in both frames.
- **Gentle curves.** They get their share by the same formula, so the bank grows with how tight the curve is. A straight gets none.
- **Size it from the closed route's own curvature, not the laid route's** (O's §2 inference). Bank, close, then re-bank and close the bank row again, so TEST TRACK 10's leftover 5.3 g comes down. Report how much it falls.
- **Joints.** The bank eases in with the curve and meets the laid bank at every joint. The roll stays under the 0.934°/m amber, and the cup is left as built.
- **Test first.** On TEST TRACK 10 and TEST 10 (private fixtures):
  - the closer leans into its curves with 0 stations leaning out;
  - lateral load at the design speed goes down;
  - the lap closes to the same tolerance.
  Add one more row: a closer with only gentle curves gets only a small bank.
- **Proof.** The close and core mutation harnesses run whole. Make before and after shots, plus a built kn5 of a COPY of TEST TRACK 10 for the keeper to drive. Leave his tracks untouched.
- It rides the next batch, after D431 (already in 0.4.14).

NEXT: chair route D434 Part 2 build to O now; O hands back to the librarian.
