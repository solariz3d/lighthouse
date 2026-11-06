# D644: the extra turn's from grab on the purple line, renders only (pane C)

Seat: pane C (sibling-0845a868). Tier: CHECK IT, show first. **No build, no install, no code change landed.** The page was rendered from t180 `f2884fa`
(v0.4.39) in a detached worktree `Desktop/worktrees/t180-d644-c`, which is left clean. Headless Chrome: `--headless=new --mute-audio`, titled
zz-headless-test, children hidden (winhide.js), BelowNormal. acs.exe was 0 before every run, and no heavy-run lock was held.

## His words, and how I read them

"the turn from needs to be placed on the actual purple line and not on the turn part for the extra turn. i mean where you click to drag the length of
the extra turn or where it kicks in u know"

On 0.4.39, **the grab that slides where the extra turn kicks in is the extra turn handle itself** (`handles.js` LOCK_PX: a drag along the road slides
the change's from). It stands at 0.89 of the piece, beside the turn handle at the front: "the turn part". **The purple line** is the from mark, the
purple stroke across the road at the from (`secondtick.js`, the turn's colour `#b968ff`, at 500 m of 1,000 m). In his testturn1 picture
(`briefs/t180_testturn1_start_2026-11-06.png`), it is the purple stroke his red line runs through.

This is the librarian's reading. I found no second reading that leads anywhere else. The only other purple on screen is the ghost's lavender edge,
and at the from station that is the same place, give or take the mark's 10 px nudge. **So I rendered one proposal, not two.**

## The renders: `C:\Users\nname\AppData\Local\Temp\claude\2b46c68187c81881\0845a868-38f2-4cc2-b45a-431e0c088fb1\scratchpad\d644\out\`

**The case.** His testturn1: a placed 1,000 m straight, then the next piece at 1,000 m with a +90° corner and an extra turn of −45°, from 500.
**The views.** Build, then his Free view: the preview's own focus on the head, tipped up 50 px by a right-drag look, then dollied back by the wheel
in six steps. The wheel was aimed clear of every handle; one early run nudged the cup through a handle and was redone. No field moved between the
first and last shot.

| file prefix | what it shows |
|---|---|
| `now-*` | **0.4.39 as it is:** the extra turn handle at the front by the turn handle, and the purple from mark at mid-piece on the bank and climb handles |
| `mock1-*` | the extra turn handle moved ONTO the purple mark (at from ÷ length) and nothing else moved: it lands **exactly on the bank handle** |
| `mock2-*` | **the proposal:** the handle on the purple mark, with the bank and climb handles stepping back along the piece by the existing clearExtras rule (36 px) |

Best single pictures for him: `now-free-out4.png` (closest to his own picture), `mock2-free-out4.png`, and `mock1-free-out4.png` (why mock 1 is
not enough). Then `now-build.png` and `mock2-build.png`.

The mock-ups patch `panel.js` and `handles.js` in memory, as they are served to the page; no file is written to the repo. That is
`render644.js` in the same folder, with each patch commented, and its anchors must occur exactly once.

## The ≥36 px rule: where it holds

checked: `node summ.js out` → `out/summary.txt`. Each view gives the half piece on screen (the turn handle to the bank handle in `now`), then the
extra turn grab's nearest other handle (side +1 / side −1):

| view | half piece | now | mock1 | mock2 |
|---|---|---|---|---|
| build | 357 px | 36.8 / 78.8 | **0 / 0** (bank) | 88 / 41.8 |
| free-look | 378 px | 39.2 / 80.6 | 0 / 0 | 85.8 / 42.1 |
| free-out1 | 358 px | 39.3 / 75 | 0 / 0 | 73.6 / 37.6 |
| free-out2 | 340 px | 37.9 / 69.1 | 0 / 0 | 68.7 / 38.3 |
| free-out3 | 318 px | 36.5 / 63 | 0 / 0 | 62.9 / 38 |
| free-out4 | 289 px | 39.2 / 60.8 | 0 / 0 | 55.6 / 36.3 |
| free-out5 | 257 px | 40.1 / 57.2 | 0 / 0 | 52.3 / 37.4 |
| free-out6 | 220 px | 38.8 / 51.7 | 0 / 0 | 50 / 39.3 |

- **mock2 holds ≥36 px in all 8 views,** from 220 to 378 px for half the piece. The tightest is 36.3 px, at free-out4.
- inferred: at a from other than 500 the bank handle does not sit there, so it need not step at all. That was not rendered.
- **Not measured:** half a piece under 220 px on screen, and anything but this one case (no bank, a blank climb, the from at the default 500). The
  step-back rule gives up when no step clears ("the farthest it got"), so on a small enough piece it will fail as the extras do today. The D641 R4 at
  2.4× is the same limit.

## For his yes, before anything is built

- **mock2 moves the BANK and CLIMB handles off 0.5** whenever the extra turn's grab sits there, and he sees that. A different way out would be the
  grab standing at the from but outside the edge, on the mark's own nudge. That was not rendered. I'd take mock2: it uses the rule the extras
  already use, and it keeps the grab exactly on the line.
- **The handle still does both jobs:** across the road sets the amount, along the road slides the from, as today. Only where it stands changes.

BASE: none (no repository changed; the renders are from C:\Users\nname\Downloads\t180-fresh f2884fa, read only)
SOURCES: render644.js runs now/mock1/mock2 → out/*-report.json; summ.js → out/summary.txt; app/core/panel.js extraHandlesNow, EXTRA_AT; app/core/handles.js clearExtras; app/core/secondtick.js STYLE
