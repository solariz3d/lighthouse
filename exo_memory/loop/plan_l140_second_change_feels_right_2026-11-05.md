# L140: the second change, shaped and shown the way he means it. Librarian, on L, 2026-11-05 04:2x, after his drive of L139

**Brief (his words first):** `exo_memory/briefs/t180_second_bank.md`, lines dated 2026-11-05 10:06Z and 10:15Z, and both his pictures.
**Evidence:** his save `AppData\Roaming\com.solariz3d.t180-track-builder\tracks\eq-TEST BANKING.t180track` (4,688 B, 04:00:39), read on
`35feaf9` with `scratchpad/l135viz/tb.js` (librarian, `librarian/2026-11-05.md` 04:0x). On piece 2, the bank climbs 0 → 80° across the
whole first 500 m and never holds; every change starts at exactly 500 m (the even split); the turn is two same-way corners; the bank ends
at 4.6°, not 0. The ride reads 1.00× the bar: smooth, but the wrong shape.

## Part 1, the shape (B; unambiguous, dispatched now)
1. **A first change reaches its value and HOLDS.** When a field has later changes, its first change no longer stretches to the first
   mark. It ramps over that field's own smooth minimum for its Δ (`secondMinM(ch, from, to)`, ≥ 20 m; for corners `cornerChangeMinM`),
   with "early" kept as it is. It then holds to its mark. His picture's shape: bank comes in, holds through the turn, comes back at the
   marks.
2. **Default marks sit toward the END, not the middle.** The first later change defaults to L − its own minimum (as close to the end as
   smooth allows, like his red marks). Each earlier default sits before the next by that change's minimum. The even split for corners
   goes.
3. **The end target.** Find why his second bank ended at 4.6° and not its target. Read his .t180undo / the panel path. Either a target
   that did not take, or a clamp; fix it or name it.

Rows, red on 35feaf9:
- his save's shape replayed through the panel holds the first bank within 0.5° from its ramp end to its mark;
- the default mark is at L − min;
- the end equals the typed target.

9′ stays a pass condition (`loop/l139_registration_2026-11-05.md`).

## Part 2, the UI (C; held until he confirms the reading below)
His words: "when you drag turn, it is in the front of the piece, so after the first turn, it adds something called extra turn, and its
like the same ui as the first grab turn, just added below it or around it in a way to be intuitive".

Reading, to confirm with him before C builds:
- No faint rings. Once a field has a value, a second handle appears that looks and drags exactly like that field's own handle, with the
  same arrows and colour.
- It is labelled **"extra turn"** (extra bank, extra climb, …).
- It sits right beside the original handle (below it, or just behind it along the road).
- In the panel, an "extra turn" row appears under the turn row, with the same input style.
- Dragging the extra handle sideways sets how much; its place along the road is its mark, and it can be slid.

## Then
- E reviews both against 9′ and these rows.
- C installs on L with no launch.
- Release only at his word.

NEXT: chair dispatch B (Part 1) now; C's Part 2 waits for his confirmation; librarian collates

## REVISED 2026-11-05 05:2x: Part 1 is parked (his 11:10Z words), and Part 2 is dispatched on the reading above, with (a) as the default
- His "no one is working" (11:20Z): don't wait on his answer. (a) is the librarian's call, and it is reversible: the extra handle slides along the road to set where its change starts, defaulting to where L139 put it (the flow he liked). He corrects it at the drive if it is wrong.
- Base: t180 `35feaf9` (the shape he drove). NOT e20f865.
- **C (build):** the "extra" handles per the reading above.
  - Each sits beside its field's handle, in the same look and colour, labelled "extra turn", "extra bank", ….
  - It appears once its field has a value and the piece has room.
  - Dragging it across the road sets the amount and snaps to level (or to the field's start value) on approach. Sliding it along the road moves its start, and a mark shows where.
  - The panel gets "extra …" rows under each field, in the same style.
  - The faint rings go.
  - Rows go red first in a fake DOM.
- **B (find the glitches first, read-only, in parallel):** on 35feaf9, drive the L139 UI in the fake DOM the way he did (drag turn, then bank, lengthen, drag offers) and list every jump, mis-target, vanishing mark or drag that does nothing, each with a repro. C's rows must cover each one.
- **E:** review C's tip against B's list and his words; then C installs on L (no launch).
