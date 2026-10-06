# p-handles-C — a non-author look at A's D244 + D244b (drag handles, Sculpt), plus B's D249 F1 read. Pane C, 2026-10-06

SOURCES: exo_memory/handback/p-handles-A_2026-10-06.md · exo_memory/handback/p-redmerge-B_2026-10-06.md (F1 section) · `git log --oneline -3 ddf7889` · `git diff 05f0c2c ddf7889 -- app/validate-ui/redgroups.js` · `app/core/centreline.js` at ef4bc4d

**Verdict: GREEN to land, in the chair's order (F1, then D244).**
- I could not break the Sculpt guard: 189 drags over 9 track kinds, 0 breaks.
- Every refusal is by name, including the closed-tube one.
- The handles take only what they should, under real input.
- Both merged trees cherry-pick clean and pass their targeted tests.
- B's F1 is the fix I suggested.
- Two small findings for later (F2, F3), and one unexplained one-off file failure (below), none blocking.

FEEL plus the GEOMETRY guard, targeted only; no harnesses. Scratch is in my scratchpad `hd/`.

## 1. Try to break the Sculpt guard
**Read first.** `routeMoved` compares, for every segment, exactly the fields `src/geom/path.js` reads:
- `length`, `k0`, `k1`, `kp0`, `kp1`, `heartline`, `heartline1`, and the roll fields when a heartline is in play;
- the start pose;
- the h/l offsets.

The offset lift (`adapter.js offsetPath`) moves a point along horizontal left (`R = [cos θ, 0, −sin θ]`), not the banked left. So bank cannot reach the centre through an offset. inferred: there is no field-level hole.

**Then measured:** `node hd/guard_probe.js <05f0c2c + A>`, under the lock (sha256: script `70eb882c…`, log `81266546…`).
- For each track kind, piece and shape channel, a Sculpt drag runs through the shell.
- Then MY OWN check runs, independent of `centreline.js`: the adapter's own path (`A.toPath`, offsets applied) before and after, comparing every sample's position.

| track | pieces sculpted | result |
|---|---|---|
| open legacy | first, middle, **last** | phi, w, r: OK, **0 m** moved |
| **jump** (road, flight, road, turn) | **before and after the jump**, last | phi, w, r: OK, 0 m |
| **closed legacy lap** (closed by `close()`) | **p0 and the last piece (the seam)**, middle | phi, w, r: OK, 0 m |
| **hill** (h to 5 m and back) | on, around | OK, 0 m |
| **swerve** (l to 4 m and back) | on, around | OK, 0 m |
| cup | all three | phi, w, r, c: OK, 0 m |
| **open tube, sweep 290° and 299°** | all | phi, w, r OK, 0 m. **Sweep +20° (crossing 300°): refused by name, `SCULPT_MOVES_CENTRELINE`**, at the first step |
| **closed tube, 360°** | all | **phi and w refused by name, `SCULPT_MOVES_CENTRELINE`** ("heartline1 moved from 6.366… to 6.366…"). Sweep +20 is refused earlier by the domain, `BAD_TUBE`. Wall rise (r): OK, 0 m |

- **SUMMARY: 189 drags. 78 changed the document with no refusal, and every one moved the centreline 0 m by my check. 111 were refused, all by name. BREAKS: 0.**
- The refusals were `SCULPT_MOVES_CENTRELINE`, `BAD_TUBE`, and `NOT_CUP`/`NOT_EDGE`/`NOT_TUBE` (a shape channel the piece kind does not carry).
- **The closed-tube refusal A found is by name:** `SCULPT_MOVES_CENTRELINE: this change would move the track's centreline (…), so Sculpt refused it`.
- **F3 (wording, small):** on an OPEN tube crossing 300°, the message names an internal field: "heartline1 moved from **undefined to 0**". The real reason, in the keeper's words, is "the sweep passes 300°, where a tube starts to turn about its own centre". The refusal is right; its words are not his.
- Not probed: edge pieces (A's row 1 covers them on piece 2), a cup next to a legacy piece, sweep changes that stay under 300°.

## 2. The handles against the brush and the camera, in a REAL window
- **Setup:** a debug build of the merged tree (05f0c2c + A's three), on its OWN app data (`T180_TEST_APP_DATA`). The driver refuses to start if a builder is running, and refuses to drive an exe not newer than the build start. Every press is REAL (`Input.dispatchMouseEvent`), and the brush is armed by a REAL click.
- **Files:** `node hd/hd_window.js` → `hd/win/report.json` (sha256 `68077aec…`); driver `d295d97b…`.

| case | result |
|---|---|
| W1 brush ARMED, left-drag starting ON `length:0` | length 100 → **110**; the document **unchanged** ("3 pieces · 300 m" before and after) |
| W2 brush ARMED, left-drag on the PLACED track, more than 40 px from every handle | **the brush's**: the document changed ("last brush:local 519 ms"), **no field moved**; one Undo restored it |
| W3 brush ARMED, left-drag starting **16 px off** `width:1` (outside the 12 px radius) | **not the handle's**: width 31 → 31, no field moved |
| W4 brush OFF, **RIGHT-drag starting ON `bank:1`** | **the camera moved**; bank 0 → 0, no field moved |
| W5 brush OFF, left-drag ON `width:-1` | width 31 → 33; the camera did **not** move |

- 10 handles were drawn (`length:0, width:±1, bank:±1, cup:±1, turn:±1, climb:0`). 0 page exceptions. **The keeper's folder: 9 files, `keeperChanged: []`.**
- This adds to A's window run:
  - A's right-drag started on empty ground; W4 starts it ON a handle.
  - A did not show a press elsewhere on the track reaching the brush; W2 does.
- Read: `handles.js:181` takes only `e.button === 0`, so a right press is never a handle's.

## 3. The merged trees (targeted only, under the lock)
- **05f0c2c + A** (`git cherry-pick -x 3787b6a 31d1999 ef4bc4d` → 646e20d, c79f10c, **71d9306**): **clean, no conflict**.
  - handles, core-sculpt, core-pieces-ui, redgroups, core-close-preview → **51 / 51** (`hd/merged.out`, `8159527b…`).
- **The chair's order: 05f0c2c → B's 2b51633, ddf7889 → A's three** (→ bc95f08, fe79617, fea1d30, a57fab8, **db5a8ab**): **clean, no conflict**.
  - **First run: 45 / 46.** `app/test/core-sculpt.test.js` failed as a WHOLE FILE in 517 ms, with no subtest started and no error text ("test failed").
  - Alone, the same file passed **8 / 8 twice** on that tree, and 8 / 8 on the tree without F1.
  - **The batch re-run: 53 / 53** (`hd/merged3.out`; the extra 2 are B's F1 rows).
  - inferred: a one-off, not F1. It has the same signature as A's unexplained D240 flake (a file that dies with no subtest and no stderr). It is recorded, not explained.

## 4. B's F1 (2b51633 + ddf7889), read against my spec: IT MATCHES
- `endPiece(segments, s0, s1) = pieceAt(s1 − 1e-6)` for a range longer than 0.5 m, else the start piece. It is used for the item's label, the place's label AND the touch rule, all three as I wrote.
- The overlap test is strict (`it.s0 < last.s1`). Meeting at a point goes through the touch rule, which needs the same piece. That is my "strict across pieces", done by routing rather than a second test, which is equivalent.
- **G6, G7, G10 re-anchored:** all three `from` strings are the new condition line, and it occurs **once** in `redgroups.js` (`grep -cF` → 1). Not run, per the packet.
- **My boundary probe, re-run on the F1 tree** (`node rm/probe.js` → `hd/probe_f1.out`, `a83794d0…`):
  - case A (meet at the boundary) → **2 places**; B (ends on it, the next starts 1 m in) → **2 places**; F (ends on it) → **"(p1)"**, not "(p1–p2)";
  - controls D (2 m gap, one piece) → 1 place and E (3 m) → 2, unchanged; C, G, H unchanged.
- **Property, with F1's own rule** (`node hd/probe_f1b.js`, both trees): on the F1 tree, 9,449 groups:
  - 0 count errors;
  - **0 places overlapping**;
  - 0 places split on one piece;
  - the places that meet do so only at a piece boundary (27) or at the track's end (52).

  (My first property script flagged 157 "overlaps". It treated places that MEET at a point as overlapping, which F1 allows by design. That was my check's error, not B's.)
- **F2 (small, older than F1):** `pieceAt` wraps s = L to the FIRST piece even on an OPEN track.
  - So a point red at the very end of an open track reads "at 0.30 km (p1)". This is so on 05f0c2c too.
  - On 05f0c2c, a range ending at L read "(p3–p1)" and swallowed that point. F1 fixes the range ("(p3)") but now shows the point as its own place "(p1)".
  - Fix (not built): on an open track, s ≥ L is the last piece. `pieceAt` would need to know the track is open, or `groupReds` passes it.
  - Not blocking. inferred: validation rarely puts a red exactly at L.

## Corrections, mine
- My first property script for F1 counted MEETING places as overlapping (157 false flags). I re-ran it with F1's rule and kept both outputs.
- My table of the guard probe dropped every refused row: the probe prints rows cut at 330 characters, and my JSON parse of those lines failed. The probe's own SUMMARY (computed before printing) is the figure used. The per-code table above was re-made from the raw lines.

## Not verified
- No harness (the librarian runs them at install), and no full suite.
- In the window: Sculpt itself (A's window run covers a bank drag at 0 m), a cup or tube piece, Shift and Ctrl inside Sculpt.
- The keeper's hands.

NEXT: librarian collate this look when read — plan default: the chair lands F1, then D244, on 05f0c2c
