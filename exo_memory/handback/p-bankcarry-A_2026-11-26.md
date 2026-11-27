# D677: the bank past a full turn, built from my floors plan's (b): pane A, 2026-11-26 23:20 local (05:20Z on the 27th). STOPPED at the keeper's word, WIP

**Stopped** on the chair's order of 05:09:27Z (delivered 05:19:26Z). His word, 23:09: "stop at a good point here and prepare for the handoffs to the laptop later".

**Branch:** builder `l-bankcarry-a`, tip **`2067c88`** (2067c88a2be905b53717b031148ed312cbe2fc04), one WIP commit on `landing-1126-batch` `f3cd425`.
Pushed, the branch only; nothing was merged or installed. Worktree `C:\Users\nname\Desktop\worktrees\t180-bankcarry`.

    checked: git ls-remote origin l-bankcarry-a → 2067c88a2be905b53717b031148ed312cbe2fc04 (05:20:17Z)
    checked: landing-train.js privacyScan(worktree, origin, 2067c88) → ok, 0 found; push-gate.js decide("git push -u origin l-bankcarry-a") → allow

Tier: PROVE IT. Evidence (local, uncommitted): `G:/consonance-scratch/a-bankcarry/`.

## Where it stopped, and the next step

**Done and green:** the rows, red first; the new harness; the older xsec harness, whole; his tracks.
**Not done:**
1. **The 34 app test files that load `panel.js`.** The run was cut at the stop: 8 files ok and 0 failed when it was killed, which is not a result
   (`panel34.tap`). The six that pin the bank were run whole earlier (below). **Next step: run the 34 (`panelfiles.txt`) through heavy-run.**
2. The final re-run of my harness after a comment-only edit (the paraphrase below). Its anchors are on code lines the edit did not touch. `inferred:` it
   stands at 8/8; re-run it with the 34.
3. The two calls below, for the keeper.

## What it does (`app/core/panel.js`)

- `headTurns()`: the head's whole turns, in degrees (0 within one turn).
- `inHeadTurn(T)`: a typed bank T is laid as `T + headTurns()`, never wrapped.
- Used by `bankTarget` (the field), `secThen` (an extra bank row, and a flowing bank's mark), and the two extra-bank offer bases in `offersAt` (read back
  less `headTurns()`, so the handle stands in the field's turn).
- The field still SHOWS the head within one turn (`HEAD.bank`, `HD.wrapTurn`, unchanged), as D259 asked.
- The D641 (f) rewrite (a committed bank past one turn written back wrapped) is removed: the typed value is now what is laid.
- The drags are unchanged: the ghost's bank handle (`:1086`), the extra bank's ±360 hold (D641 R1), Sculpt's handle and the bank brush (`coreshell.js`
  `bankWithinTurn`). They follow his 2026-10-06 rule, as the chair ordered.

**His 10-06 ruling, from the record:**
- 18:21: "it continues after 360 forever instead of resetting back to 0" (`exo_memory/handback/p-bankwrap-B_2026-10-06.md:9`)
- 18:22: "like say with the dragging feature" (the same line)
- 18:24: "same for -360 if it banks the other way, instead of continuing another revolution past 360 it should reset back to 0". This unelided form is in
  builder `app/core/coreshell.js:54`, entered by `89b1859` (2026-10-06). My plan said it was not on disk, and it was.

    checked: git log -S "another revolution" -- app/core/coreshell.js → 89b1859 2026-10-06

## The rows (`app/test/core-bank-carry.test.js`), red then green

    checked: node --test app/test/core-bank-carry.test.js with panel.js at f3cd425 (git stash of panel.js only) → 7 tests, 2 pass, 5 fail (red4-f3cd425.tap)
    checked: the same at 2067c88's code → 7/7 (green.tap, and the six-file run below)

| row | f3cd425 | branch |
|---|---|---|
| W1 −: from −340 a typed −392 lays −340 → −392 one way, steepest within 10% of the core's own; the field shows −32 | red: the road ends at −32 | green |
| W1 +: the mirror | red: ends at 32 | green |
| W2: an extra row of −392 after −360 is laid | red: BAD_SECOND, "from -6.28319 to -0.558505" | green |
| W3: from a head at −392 (shown −32) a typed −60 lays −420 | red: ends at −60 | green |
| W4: from a head past a turn, the unused extra bank handle offers −60 and a drag to −80 lays the change at −440 | red: the change at −60 | green |
| G6 (guard): Close on a wound lap, same closed document (sha256 031cf9ad… at f3cd425), seam −360 ≡ 0 | green | green |
| G7 (guard): a document wound to −4π round-trips byte-identical, and so do the 16 test tracks in test/fixtures | green | green |

W1's roll on its 150 m piece: f3cd425 sent −32 and unwound at a steepest 2.21 °/m against the core's own 0.37; the branch sends −392, steepest 0.37.

    checked: G:/consonance-scratch/a-bankcarry/w1fig.js base / tip

## The rows amended by name (a changed rule: the typed wrap is gone)

    checked: heavy-run --run, node --test over core-pieces-ui, core-xsec, core-extra-bank-wind, core-sculpt, core-bank-flow-panel, core-second-bank-panel (six.tap)
             → before the amendments: 116 tests, 113 pass, 3 fail, exactly these three

| row | was | now |
|---|---|---|
| `core-pieces-ui` D259 typed | "a typed 400 becomes 40" | 400 rolls on to 400, the field shows 40 |
| `core-xsec` bank field (amended a third time) | "−540 is −180" | −540 rolls to −540, the field shows −180 |
| `core-extra-bank-wind` D641 (f) | "−654.70 … reads −294.70" | it stays −654.70, and the road is laid there |
| `core-xsec-mutation` X32 | its anchor was the ±360 exception, removed | the same failure on the new line: the typed value wrapped before it is laid |

Every drag row stays green unchanged: D259's drag rows, Sculpt's, the brush's and D641 R1.

## Mutation

    checked: heavy-run --run, app/test/core-bank-carry-mutation.test.js (mutation.tap) → 8/8: control, D352 stand-in,
             applied 6 / caught 6 / NOT APPLIED 0 (B1 the typed wrap back, B2 no turns carried, B3 nearest turn, B4 the row wrapped, B5 the offer in absolute, B6 D641 (f) back)
    checked: heavy-run --run, app/test/core-xsec-mutation.test.js whole (xsec-mutation.tap) → 35/35: control and 3 stand-ins, applied 31 / caught 31 / NOT APPLIED 0, X32 included
    checked: anchor scan of the 7 harnesses that name panel.js → 48 anchors once at f3cd425; at the branch every one is still once except X32's, amended above

Left out of my harness, and not caught by any row: the flowing bank's offer base (`- headTurns()` in `offersAt`'s flow branch). No row lays a flowing
bank from a head past one turn.

## His tracks unmoved

    checked: heavy-run --run, tracks.js on f3cd425 and on the branch, 27 copies in G:/consonance-scratch/o-smooth-work/tracks (tracks-base.json, tracks-tip.json)

- 26 documents; t27 is not a track document (BAD_DOC) on either tree.
- All 26 open with the same bytes and round-trip byte-identical on both trees, and their untouched panel options are identical.
- With the bank typed at the shown value + 10 on the 16 open tracks, 15 extend identically.
- The one that differs is **t13**, wound to −720 (shown −360): a typed −350 was laid at −350 (unwinding 370°) and is now laid at −710 (10° on). That is
  the change. Its closed twin t14 is not typed.

## For the keeper: two calls this build does not make

1. **A Sculpt bank drag on a piece wound past one turn unwinds a full turn.** By the 10-06 rule as built (`bankWithinTurn`), on a piece rolling −340 →
   −392, a Sculpt drag of −10 moves the middle from −366 to −16 (+350). That is the same on f3cd425 and the branch, and could only be reached on tracks
   like t13 before. Typing can now make such a piece.

       checked: G:/consonance-scratch/a-bankcarry/sculptwound.js base / tip → −366.0 by −10 → −16.0 (change 350.0), on both

   If his 10-06 words were about the number shown and not the road, the drags would carry as typing now does. That is the plan's third row, a ruling for him.
2. **The chair's example, "a typed −32 on a head at −340 lays −340 → −392", is not what I built.** Read literally it is the nearest-equivalent rule,
   which D259 ruled out on 10-06 (`4aba04d`); it would also make a typed 300 from upright roll −60. I built the plan's W1, a typed −392, and keep
   −32 meaning −32 within one turn. If he means the other reading, it is a different rule.

## Corrections (mine)

- **W2 first passed for the wrong reason.** A comment I added ran on to the end of its line and swallowed W2's two "laid, not refused" asserts. The base
  run then showed the road ending at −340 with no refusal reported. I found it by debugging that, put the comment on its own line, and re-ran W2 red
  (BAD_SECOND) at the base.
- **The rows' header said W4 was green at f3cd425.** That was a guess; it is red there, and the header was corrected.
- **I wrote his 23:00 words verbatim into the builder first**: in `panel.js`, the rows' header, three amended rows and the CHANGELOG. As at L254, where the
  rule's source was never found, I took the stricter side: before the commit they became a paraphrase plus a pointer to
  `briefs/t180_unmakeable_shapes.md:49-50`. The commit message does not quote him.
- **W2 needed a 300 m piece:** on 150 m the 32° change is refused for room ("178.2 m holds"). That is a real floor, not a test of the carry, and the
  row says so.
