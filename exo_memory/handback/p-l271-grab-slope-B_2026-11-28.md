# L271 role 2: the grab along the slope. Pane B, L, 2026-11-28

**The order:** the chair's L271 dispatch, sent 08:03:47Z, delivered 08:05:38Z. It is role 2 of `loop/packet_t180_even_a0_and_slope_grab_on_L_2026-11-28.md`
(room 45b92dd4), read whole.
**What D measured:** `handback/p-d678-even-banked-probe2-A_2026-11-27.md`, candidate 3 (`followChord`, in that hand-back's `even678.js`).
**Base:** builder `C:\Users\zackn\Downloads\t180-track-builder` c522ea6 (landing-1127-l263, installed on L). The branch is `l271-grab-slope`, made from c522ea6 in my own
worktree `C:\Users\zackn\Downloads\t180-b-l271`.
**Tier:** the branch is pushed (I am the landing pane for this ref only). Nothing is built, installed or merged.
**My stake:** I wrote no part of L270 and none of the D probe. I built the width hold (L264, L268, D678) and read Even on D.

---

## Registered before the build (written 08:4xZ, committed before any line of the branch is written)

### What the code says first (read from c522ea6 `app/core/zonegrab.js` `follow` and `app/core/panel.js` `down`, `followOf`, `followAt`): the candidate as D wrote it removes the lift

- **Every Grab press on the road goes through `follow`.** `panel.js` `down` opens a follow for any press `zoneOf` names, at any u, and `followAt` hands `follow` the pointer's
  whole move on the plane facing the camera. Only `|u| < HINGE_U` (0.1) slides. Every other press hinges about the far rim, and that hinge is how a lift banks the road
  (row 14f: "on a flat road the touched side rises, the far rim stays: a bank and half the lift").
- **D's `followChord` projects the WHOLE in-plane drag onto the chord** (`even678.js:54`: `t = (e·v0x + v·v0y) / n0²`, then `e, v = t·v0`). The part across the chord is dropped,
  and that part is the one that turns the chord.
  - inferred from the code, measured below as row R5: on a flat road the chord is level, so a straight lift of a rim becomes nothing. Grab could no longer bank a road
    by lifting its edge, which it does today every time.
  - D's probe pulled only horizontally (`grab`: `push = fr.R · −e`), so C3a's "the same bytes on a flat road" is true of a horizontal pull and silent about a lift.
- **So I build the narrower form, and call it the slope grab:** only the HORIZONTAL part of the drag (e, along R) goes along the chord's slope, by D's projection
  (e·cx along the chord's unit direction (cx, cy)). The vertical part (v, along the unrolled up) is added as today, so it still turns the chord.
  - For a horizontal pull this is D's `followChord`, to the digit (inferred: the same formula with v = 0). D's measured figures should come back (control K below).
  - For a straight lift it is today's `follow`, unchanged.
  - On a road whose chord is level (flat road, the press on the rim's own height), cx = ±1 and cy = 0 exactly, so every drag is today's.
- D's literal form is measured beside it in every row, so the choice is visible. If he wants the literal form, it is one line.

### The control, read before any row (if it fails, I stop and say so)

| row | passes |
|---|---|
| K1 | the fixtures F, F0, B−, B+, Bhold rebuilt with `even678.js`'s `LAYOUT`, `makeBase` and `grab`, copied unchanged, on c522ea6 |
| K2 | the slope grab's T1 follow on B−, Bhold and B+ equals D's `followChord` T1 follow to 4 places (B−/Bhold: h +0.4306, l −1.8433, w +3.7956, φ 0; B+: h −0.855, l −1.6888, w +3.7956, φ 0), and today's follow equals D's "today" (h −0.2403, l −2, w +3.8559, φ ±0.0872) |

### The rows

| row | what passes | what fails |
|---|---|---|
| R1 flat road, no cup (F0) | the saved text (sha256 of `serialize`) the same as today's after: T1 and T2b (D's pulls), and one grab at s 320 with each of: a horizontal pull out and in, a lift up and down, a diagonal, at u = ±1, ±0.95, ±0.5 and 1.2 | any difference |
| R2 flat road with a cup (F, the default cup) | no bar: say what changes, and by how much | |
| R3 banked turn (B−, Bhold; B+ reported) | after T1 and T2b made with the slope grab, the bank within 0.01° of the turn before any grab, every 1 m over 150–490 | over 0.1° anywhere |
| R4 his 16 tracks and every undo step on L, from copies | `bytes264.js` (each track and undo step as `serialize(parse(text))`, hashed) the same on c522ea6 and on the branch | any difference is a stop |
| R5 the lift (added by me) | a straight lift (along world up) at u = ±1, ±0.95, ±0.5 on F0, F, B− and B+ gives today's follow, every channel within 1e-12 | any channel off by over 1e-9 |
| R6 the existing rows | `app/test/zonegrab.test.js` and the tier's rows that call `follow` | see the prediction |

### Predictions, registered

- **K passes** (the formula is D's for a horizontal pull).
- **R1 passes** on every case. **R5 passes** for the slope grab, and **D's literal form fails R5** on every flat case (a 1 m lift at u = −1 on F0: today φ by atan(1/12) ≈ 4.76°, literal 0).
- **R2, inferred:** a press exactly on the rim (u = ±1) is the same as today, because both rims stand at one height. A press inside the rim (u 0.95, 0.5) has a chord that
  slopes with the cup, so today's horizontal pull there turns the bank a little and the slope grab does not. I expect a bank change today of under 1° and 0 after.
- **R3 passes:** 0.0000° on B−, Bhold and B+, from T1 and T2b (D's C3b).
- **R4 passes:** a grab is an action, `zonegrab.js` is not read when a file is opened or saved, so nothing stored can move.
- **R6 fails, by design, in three rows,** and I say so before I see it: 14h ("on a road banked 60° and 85° … the point follows"), 14j (the road stays under the pointer
  on a pitched road, banked −85° and 60°) and 14l (a press at 60° dragged out). On a bank a horizontal pull now moves the point along the slope, not to the pointer.
  These are rows of his own rule ("the mouse click gives a singular point you then drag to sculpt the track simple as that"). They are amended by name, the far-rim half
  kept as it is, with the new rule written beside it. Any other red is a fault of mine.
- **Item 3, under his hand, inferred before the page is opened:**
  - on a flat road nothing moves differently;
  - on the banked turn the grabbed edge leaves the pointer: at 20°, a 4 m pull moves the point 4·cos²20° = 3.53 m out and 4·cos20°·sin20° = 1.29 m up, so it ends about
    0.47 m short of the pointer across and 1.29 m above it;
  - during the drag the glyph and the value line stand on the road as it was at the press (the preview's shared track holds the pre-drag road, `trackmodel.js` `how: 'drag'`).
    The middle now rises 0.43 m on B− where it dropped 0.24 m, so the glyph may end inside the road where it floated above it;
  - the value line loses its bank entry on a bank (φ 0 is not listed), and shows `w` and `h` instead.
  Measured in the page in section 3.

### The stop rules

- R4 differs: stop, no push.
- K fails: stop, say why, no build.
- An R6 red beyond the three named: the branch is not pushed until it is understood.
- The answer may be "do not build this", in the order's words. If the pictures show the grab working against his hand, I say so beside the push.
