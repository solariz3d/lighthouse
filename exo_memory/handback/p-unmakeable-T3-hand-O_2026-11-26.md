# [T3] by hand: the fewest pieces a person could type, per section (pane O, 2026-11-26, research only)

The chair's order (19:42:52Z): take the sections the [T3] table made with steered 15/8/4 m pieces, find the fewest pieces a person
could type with every control the app has, and name per section the one control that would cut the count most. Do not design it.
Base: t180 `ceb21f5` (landing-1126), worktree `G:/consonance-scratch/o-t3`, detached. No builder code changed; nothing pushed.
Beside `exo_memory/handback/p-unmakeable-T3-O_2026-11-26.md` (and its amendment). Section ranges are metres along the lap; no
coordinates, names or layout leave the machine.

## The totals

- **74 sections:** the chair's 73, plus section 102, made since by the apron route (Track ▸ Edge apron at 0 m) and steered.
- **Steered: 1,767 pieces. By hand: 560 pieces.** Every one of the 74 sections was made by hand, inside the same tolerance as [T3].
- Over the 15,949 m these sections cover: **9.0 m per piece steered, 28.5 m per piece by hand.**
- Per section, hand ÷ steered: p10 0.18, median 0.36, p90 0.59.
- **The control that would cut the count most** (inferred, from what failed when one piece fewer was tried):

| the control | sections |
|---|---|
| a turn whose rate changes along the piece through marks, faster than today's change rows allow | 53 |
| a climb whose rate changes along the piece through marks | 9 |
| width and edge that change along a piece without a cut | 6 |
| a bank that flows through closer marks, or rolls faster between them | 4 |
| none needed: one piece | 1 |
| not read | 1 |

## The finding under the totals: the panel already has the turn control, but too slow

The panel's change rows (`app/core/panel.js`, `SECOND_FIELDS`, :71) already let one piece's turn rate change at marks, as a C2
quintic step (`src/core/extend.js` changeLists, :511-517; D642, :1069-1080). **They laid on 20 sections and made none.** The core
refuses a turn change shorter than about **10.3 m per °/100m** of change ("needs at least X m before the piece's end", measured
with probes: −80 → −75 °/100m needs 51.5 m; → −70 needs 102.9 m; → −60 needs 205.9 m; two changes of −20 and +10 need 617.6 m).
[T3]'s turns change their rate by tens of °/100m over tens of metres, so every row form was refused (in the final run, 702 turn,
18 climb and 6 width refusals of that kind over 74 sections, and 2 `PASS_CLEARANCE`) or laid and missed. So the hand counts below are made of **cuts**, not rows: a person types a new piece wherever the
read's turn, climb or bank reaches an extreme. **The control in 53 of 74 lines is therefore not a new kind of row but a faster
one.** That is inferred from the refusal law and the binding measure, not from a built control; design waits for the merged
catalogue.

## Method (each step local, named, uncommitted; scripts in `G:/consonance-scratch/o-t3-work`)

1. **Cut where a person would see it** (`hand2.js`): at the read's extremes of turn rate (prominence 5 °/100m), climb rate (3) and
   bank (4°), merged within 8 m, plus a cut either side of a width or edge change. Each piece is typed through the panel and
   steered as [T3]'s pieces were (`steer.js`, closed loop on end heading and pitch, 4 tries). If not made, the longest piece is
   bisected, up to the steered count; then interior cuts are pruned, shortest join first, while the section stays made.
2. **The bank flowing** (`FLOWB=1`): no bank cuts; the bank flows through its extremes inside a piece (the panel's "bank flows
   through its marks"). It never made a section in fewer pieces than another form.
3. **From the steered cuts** (`STEP`): start from the steered route's own cuts, which made the section, and prune. This made the
   23 sections the first route did not, and beat it on others; on 10 sections it was re-run with full pruning (to a fixed point).
4. **Change rows** (`hand.js`): one or two pieces with the turn, climb and bank as rows. Section 38 was made by 2 equal plain
   pieces; no section was made with rows (above).
5. **The count kept** is the fewest pieces any route made. **The control line** is the measure family of the failures at the
   nearest count below it that was tried and failed (heading, position or curvature → turn; pitch or elevation → climb; bank or
   roll → bank; width or edge → width).

Tools available and used: the panel (pieces, rows, flow marks), Undo, Delete selected, Track ▸ Edge apron (section 102), the jump
(section 99). The Reference track overlay (View ▸ Reference track…, `app/reference/panel.js`) is how a person would aim by eye; the
scripts aim by the read instead, so its use is assumed, not tested.

## Limits, named

- **Not proven minimal.** Bisection assumes fewer pieces never helps after more failed; pruning is greedy. A person with a better
  eye might do better on some sections; none should need more.
- **Steered counts are [T3]'s,** except 99's (computed from the cut rule, 20, not laid).
- **Section 85's line is not read:** the one pruning pass that found its 6 removed every cut it tried.
- **"Worst / tol"** is the worst measure's error over its tolerance (≤ 1 is made), as in [T3].

## Per section

| section (m) | class | steered: route, pieces | by hand: pieces (form) | worst / tol | the one control that would cut the count most (inferred) |
|---|---|---|---|---|---|
| 1: 283–582 | straight, banked, level | K4, 73 | 6 (cut at the extremes) | 0.94 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 2: 586–734 | right turn, banked, level | G15, 10 | 4 (cut at the extremes) | 0.56 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 3: 738–1145 | left turn, banked, level | GW, 53 | 10 (cut at the extremes) | 0.99 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 4: 1149–1464 | straight, banked, level | GW, 36 | 11 (cut at the extremes) | 0.91 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 5: 1468–1868 | left turn, banked, level | G15, 27 | 13 (steered cuts, pruned) | 0.99 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 6: 1872–1932 | right turn, banked, grade | K4, 15 | 3 (cut at the extremes) | 0.98 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 7: 1936–2061 | straight, banked, grade | GW, 22 | 9 (cut at the extremes) | 0.99 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 8: 2065–2626 | straight, banked, level | G15, 37 | 22 (steered cuts, pruned) | 0.92 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 10: 2717–3028 | left turn, banked, level | GW, 47 | 13 (cut at the extremes) | 1.00 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 13: 3451–3662 | right turn, banked, level | G15, 14 | 6 (steered cuts, pruned) | 0.95 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 16: 3862–4013 | right turn, banked, grade | G15, 10 | 4 (steered cuts, pruned) | 0.95 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 17: 4017–4143 | straight, wall-banked, grade | PRE40-K4, 41 | 7 (cut at the extremes) | 0.98 | a climb whose rate changes along the piece through marks |
| 18: 4148–4615 | straight, banked, level | GW, 47 | 8 (cut at the extremes) | 0.93 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 19: 4619–5014 | right turn, banked, level | G15, 26 | 17 (steered cuts, pruned) | 1.00 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 20: 5018–5181 | left turn, banked, level | G15, 11 | 4 (steered cuts, pruned) | 0.97 | a climb whose rate changes along the piece through marks |
| 22: 5308–5416 | straight, banked, level | GW, 14 | 5 (cut at the extremes) | 0.96 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 23: 5420–5564 | straight, flat, grade | G15, 10 | 3 (cut at the extremes) | 0.88 | a climb whose rate changes along the piece through marks |
| 24: 5568–5650 | straight, pitch ≥60° | G8W, 11 | 8 (steered cuts, pruned) | 0.83 | a bank that flows through closer marks, or rolls faster between them |
| 25: 5654–5839 | straight, upside down, grade | G15, 12 | 9 (steered cuts, pruned) | 0.79 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 26: 5843–5936 | straight, pitch ≥60° | PP40-G8W, 27 | 14 (cut at the extremes) | 0.99 | a bank that flows through closer marks, or rolls faster between them |
| 27: 5941–6087 | straight, flat, grade | GW, 16 | 7 (cut at the extremes) | 0.99 | a climb whose rate changes along the piece through marks |
| 29: 6205–6340 | straight, banked, level | GW, 15 | 4 (cut at the extremes) | 0.92 | width and edge that change along a piece without a cut |
| 30: 6345–6550 | left turn, banked, level | GW, 29 | 5 (cut at the extremes) | 0.89 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 31: 6554–6686 | left turn, banked, grade | GW, 21 | 6 (steered cuts, pruned) | 0.82 | width and edge that change along a piece without a cut |
| 33: 6766–6923 | right turn, banked, level | G15, 10 | 6 (steered cuts, pruned) | 0.67 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 36: 7105–7357 | left turn, banked, level | G8W, 36 | 9 (cut at the extremes) | 0.84 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 37: 7361–7528 | right turn, banked, level | G15, 11 | 6 (steered cuts, pruned) | 0.76 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 38: 7532–7657 | straight, banked, level | G15, 8 | 2 (equal plain pieces) | 0.83 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 39: 7662–7964 | straight, flat, level | G8W, 46 | 11 (cut at the extremes) | 0.95 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 40: 7968–8436 | left turn, banked, level | GW, 62 | 15 (cut at the extremes) | 0.98 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 42: 8549–8964 | straight, banked, level | GW, 41 | 9 (cut at the extremes) | 0.80 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 43: 8968–9130 | right turn, banked, level | G15, 11 | 6 (steered cuts, pruned) | 0.76 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 44: 9134–9291 | straight, banked, level | G15, 10 | 5 (steered cuts, pruned) | 0.75 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 45: 9295–9379 | right turn, banked, level | POST40-K4, 31 | 5 (cut at the extremes) | 0.98 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 47: 9563–9624 | right turn, banked, level | PRE40-G8W, 20 | 8 (cut at the extremes) | 0.78 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 49: 9724–9852 | straight, flat, level | G15, 9 | 4 (steered cuts, pruned) | 0.83 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 51: 9930–10108 | left turn, banked, grade | GW, 27 | 9 (cut at the extremes) | 0.99 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 53: 10172–10268 | straight, upside down, grade | G15, 6 | 5 (cut at the extremes) | 0.88 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 54: 10272–10511 | straight, wall-banked, grade | G15, 16 | 4 (cut at the extremes) | 1.00 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 58: 10929–11002 | straight, banked, level | G15, 5 | 3 (steered cuts, pruned) | 0.99 | width and edge that change along a piece without a cut |
| 59: 11006–11155 | right turn, banked, level | G15, 10 | 2 (steered cuts, pruned) | 0.69 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 61: 11289–11468 | right turn, banked, level | GW, 23 | 7 (cut at the extremes) | 0.90 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 63: 11576–11895 | left turn, banked, level | G15, 21 | 11 (steered cuts, pruned) | 0.94 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 64: 11899–12047 | left turn, banked, grade | GW, 19 | 7 (cut at the extremes) | 0.85 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 65: 12051–12306 | straight, banked, grade | GW, 28 | 7 (cut at the extremes) | 0.93 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 67: 12403–12520 | straight, upside down, steep | G8W, 15 | 6 (steered cuts, pruned) | 0.99 | a bank that flows through closer marks, or rolls faster between them |
| 68: 12524–12688 | straight, upside down, grade | G15, 11 | 5 (steered cuts, pruned) | 0.92 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 69: 12692–13003 | straight, pitch ≥60° | G8W, 47 | 16 (steered cuts, pruned) | 0.98 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 71: 13228–13339 | right turn, banked, grade | G15, 7 | 4 (steered cuts, pruned) | 0.74 | a climb whose rate changes along the piece through marks |
| 73: 13408–13729 | straight, banked, level | GW, 34 | 8 (cut at the extremes) | 0.99 | a climb whose rate changes along the piece through marks |
| 74: 13734–13900 | right turn, banked, level | G15, 11 | 7 (cut at the extremes) | 1.00 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 78: 14254–14334 | right turn, banked, grade | G15, 5 | 2 (steered cuts, pruned) | 0.85 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 80: 14398–14715 | right turn, banked, grade | G15, 21 | 10 (steered cuts, pruned) | 1.00 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 81: 14719–14854 | right turn, banked, level | G15, 9 | 5 (steered cuts, pruned) | 0.68 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 85: 15195–15364 | left turn, banked, level | GW, 20 | 6 (steered cuts, pruned) | 0.75 | not read: the one pruning pass removed every cut it tried, so no refused removal names a measure |
| 86: 15368–15440 | left turn, banked, grade | GW, 11 | 3 (cut at the extremes) | 0.72 | width and edge that change along a piece without a cut |
| 88: 15531–15736 | straight, flat, grade | GW, 26 | 4 (steered cuts, pruned) | 0.76 | width and edge that change along a piece without a cut |
| 89: 15741–15810 | straight, banked, grade | GW, 6 | 4 (cut at the extremes) | 0.57 | width and edge that change along a piece without a cut |
| 90: 15814–16023 | right turn, wall-banked, grade | G15, 14 | 8 (steered cuts, pruned) | 0.95 | a climb whose rate changes along the piece through marks |
| 91: 16027–16104 | right turn, banked, grade | GW, 9 | 4 (cut at the extremes) | 0.95 | a bank that flows through closer marks, or rolls faster between them |
| 92: 16108–16517 | straight, flat, level | GW, 35 | 11 (cut at the extremes) | 0.84 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 93: 16521–16952 | straight, banked, grade | GW, 47 | 14 (cut at the extremes) | 0.94 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 94: 16956–17402 | left turn, banked, grade | GW, 64 | 24 (steered cuts, pruned) | 0.98 | a climb whose rate changes along the piece through marks |
| 97: 17595–17703 | straight, banked, level | GW, 8 | 3 (cut at the extremes) | 0.48 | a climb whose rate changes along the piece through marks |
| 99: 17830–17975 | straight, flat, grade | JUMP-G8W, 20 (computed from the cut rule, not laid) | 1 (cut at the extremes) | 0.94 | none needed: one piece |
| 102: 18449–19182 | right turn, banked, grade | APRON0-G8W, 114 | 21 (cut at the extremes) | 1.00 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 104: 19273–19401 | right turn, banked, grade | GW, 13 | 5 (cut at the extremes) | 0.73 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 107: 19551–19653 | straight, banked, level | G15, 7 | 2 (cut at the extremes) | 0.73 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 108: 19658–19843 | straight, banked, grade | GW, 19 | 11 (steered cuts, pruned) | 0.90 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 111: 19981–20124 | straight, banked, grade | GW, 21 | 6 (cut at the extremes) | 0.70 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 112: 20128–20236 | right turn, banked, grade | G15, 7 | 2 (steered cuts, pruned) | 0.89 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 114: 20325–20729 | right turn, banked, level | G15, 27 | 8 (steered cuts, pruned) | 1.00 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 116: 20869–21067 | right turn, banked, level | K, 25 | 9 (steered cuts, pruned) | 0.87 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
| 118: 21317–21720 | straight, flat, level | GW, 40 | 12 (cut at the extremes) | 0.98 | a turn whose rate changes along the piece through marks, as the bank flows (the turn rows need ~10 m per °/100m of change) |
