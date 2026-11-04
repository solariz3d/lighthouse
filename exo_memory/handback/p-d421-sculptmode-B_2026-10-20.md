# D421 Part 3 — Sculpt as a mode in the page (pane B, seat 12fb81f6), tier "check it"

Packet: `[chair:MAIN]` 20:56Z, plan `exo_memory/loop/plan_d421_sculpt_build_2026-10-20.md` Part 3 (:74-114), design
`exo_memory/loop/design_d421_sculpt_P_2026-10-20.md` (§3, §5). Base t180 **ea54ac3**. Worktree **`C:\Users\nname\Downloads\t180-wt-b421`**, branch
**d421-b**, commit **3a1778f** (13 files, +328 −121; `git diff ea54ac3 --stat`). Not pushed, not merged. Scratch scripts and run files:
`C:\Users\nname\Downloads\t180-d421b\`.

## §1 What it does now

- **The switch: the fallback, because the bar has no room.** I built Build | Sculpt in the top bar first. menubar-page measured it as overflowing:
  - checked: `t180-d421b/run2.tap` row 17 → "at 900 px the bar overflows by 87 px";
  - row 8 → "the bar does not overflow (16 px)" at 1400.

  So, per the plan's own condition, the switch is the **first Build menu item, "Sculpt mode", a tick**, followed by a separator (`buildmenu.js`). It
  sets `st.sculpt` only, through `shell.setSculpt`, which refuses mid-drag with "finish the brush drag first". The bar markup is ea54ac3's again,
  except the Build menu's tooltip.
- **Keys** (`keys.js`): a new pure `sculptKey`, kept apart from `keyAction` (app/shell.js re-exports that to the piece builder, whose binding knows
  none of these).
  - Tab toggles the mode.
  - Esc drops an open drag: the tool's or a handle's.
  - `[` and `]` change the radius by 20 m (one knot span).
  - 1-9 pick the tool, in Sculpt only.
  - None of them fire with Ctrl, Alt or Shift held. A key is taken from the page only when something used it.
- **The Sculpt strip** replaces the brush strip (`panel.js`). It keeps the class `brush-strip`, so the page still moves it under the bar.
  - It holds the tool (`1 Grab` … `9 Smooth`), the radius, and "more ▾". More holds: exact size (the sharp box, same words), other tool (Wall rise, Tube
    sweep), which edge (left, right, edge start), and Smooth's channel.
  - It shows the tool's one-line hint, plus a line during a drag: the change at the centre in the channel's unit, and the widening note.
  - Route hints end "moves the road after it".
  - Removed: the "on" box, the mode and channel selects, the "sculpt (shape only)" box, `sculptOn.onchange`, and Build ▸ Brush.
- **The pointer:**
  - In Sculpt, a press on the road that doesn't move more than 5 px is a click: no brush opens, so there is no step and no message, and it selects
    (Shift-click selects a run). The brush opens on the first move past 5 px, centred where the press was.
  - A press on a handle is the handle's.
  - Alt at the press: Grab moves sideways; Stretch keeps the rate (`keepRate: true`).
  - Bend and Grab-sideways read the pointer's x (left is more); every other tool reads y (up is more).
  - Smooth's strength is never negative.
- **The wheel:** during an open drag it changes the radius by 20 m a notch. It's caught in the capture phase, so the camera doesn't zoom, and it goes
  into the same animation frame as `brushTo` (the D235 coalescing).
- **The menus:** in Sculpt, Straight, Level, To floor, Turn by…, Turn to grid…, Sharp corner…, Jump and Close the loop are disabled with the title
  "in Sculpt". Pieces ▾ is untouched. Beyond the list: **Extend and Straight in the left column are disabled in Sculpt too**, because they place.
- **The handles on a run:** the handles host passes `from` / `to` to `beginSculpt` when `sculptInfo` has them. The handles stand on the piece
  `sculptInfo` names.
  - `handles.js` needed no code change, only its header comment. The run window is the shell's (O).
- **The falloff band:** `selectionlayer.js`, a file not in my list. The plan puts the band "on the selection layer", and no pane owns that file.
  - A new pure `bandLine` gives the stations of [s0 − r, s0 + r], round the start line on a closed lap, each weighted by smootherstep(1 − |d|/r).
  - It's drawn as a tint, full at the centre and fading out at the edge, during a Sculpt drag. It is fixed at the drag's s0, and r follows the
    radius actually used.
  - Not done: the design's hover band before a drag (the plan asks only for the drag).
- **The BAD_TUBE refusal:** P's sentence (`p-d421-review-P_2026-10-20.md` §0) **with** its clause "so open it in Build instead", per the chair's
  condition. It's shown in place of the core's "must stay within 0 to 360°" words when the Tube sweep tool is the tool. See §4.
  - *2026-10-20 23:1xZ: superseded. The clause was dropped at `eec17ac` (the chair's ruling, §9), and the tool test went at §10 (P's review 3): the
    sentence ends "…that the car falls through." and replaces document.js:412's words whatever the tool.*

## §2 What I coded against from Part 2 (O): these calls must exist, or be renamed here

1. `shell.beginBrush({ tool, mode, channel, s0, r, sharp, keepRate? })`. Tools sent:
   - grab-up, grab-side, stretch, bend, climb, twist, width, cup;
   - edge, edge-right, edge-start, wall, sweep;
   - smooth, with `channel` = the strip's Smooth channel.

   `mode` and `channel` are today's names, so ea54ac3's shell still brushes: `local`/height and lateral for Grab, otherwise `rate` plus the channel.
   Stretch's channel is `'length'`.
2. `shell.brushRadius(r)`: sets the open drag's r and nothing else. The page then calls `brushTo(delta)` in the same frame, so the re-run happens once.
   If O's call re-runs too, that's a double step a frame: tell me and I'll drop the page's call.
3. `shell.sculptInfo()` with `from`, `to`, and index/id naming the **run's middle piece**. `beginSculpt({ channel, piece, from, to })`.
4. `shell.cancelBrush()` is optional. Without it, Esc does `brushTo(0)` then `endBrush()`, which `endDrag` records as no step.
   - inferred: a sharp brush at delta 0 may still refine knots, so then the content differs and it leaves a step. `cancelBrush` would remove that case.

## §3 Checks

The run files are in `C:\Users\nname\Downloads\t180-d421b\`. Every run was under the heavy-run lock (`lockrun.js`), and each started only after no
lock's cmd named a frame or timing run (A's `sculpt-frame` red run was live at 21:23-21:5x).

- **The new test** (`keys-anywhere.test.js`, the last row): Tab in a text input, a textarea, a number input or a select leaves Sculpt as it was and
  is not prevented. Tab outside a field toggles it, and Shift+Tab stays the browser's.
  - Red on ea54ac3's keys.js: `tab-red.txt` → `not ok 7` (the outside-a-field half; the in-field half cannot fail on a base that binds no Tab).
  - Green: `tab-green.txt` → `# pass 7 # fail 0`.
  - A mutant without the field rule: `tab-mutant.txt` → `not ok 7`. applied 1 / caught 1 / NOT APPLIED 0.
- **The touched files' tests:**
  - run2 (`run2.tap`, 21:56-22:04Z): the node tests of every file that mounts or loads the touched code, plus menubar-page, texture-page and theme,
    plus the 4 harnesses anchored in panel.js and keys.js. Result 831 / 829 / **2 fail** (menubar-page rows 8 and 17, the bar switch), 0 cancelled,
    testTimeoutFailure and cancelledByParent 0.
  - Then the fallback, and run3 (`run3.tap`, 22:50-22:52Z) over core-buildmenu, menubar-page, keys-anywhere and core-pieces-ui: **87 / 87 / 0**.
  - Non-TODO not ok in run3: 0 (`grep -E "^\s*not ok" run3.tap | grep -vc TODO` → 0).
- **Harnesses** (`node t180-d049/tapmut.js run2.tap`):

  | file | applied / caught / NOT APPLIED |
  |---|---|
  | core-close-mutation | 45 / 45 / 0 |
  | core-mutation | 60 / 60 / 0 |
  | core-xsec-mutation | 30 / 30 / 0 |
  | mutation | 103 / 103 / 0 |

  Total 238, with 0 rows outside a block. They ran before the fallback edit. That edit touched panel.js in two comment lines and the build-request's
  `setSculpt` only, plus a keys.js comment; no anchor is in those lines (`git diff` of the fallback, read).
- **Not run:** drag-frame and release-frame. They load index.html, but they are frame-timing files that need both slots on a quiet machine, and they
  are the landing's (plan "Landing").
- **Line endings:** every touched file is uniform CRLF (each file's `\r\n` count equals its `\n` count, by node).
- **Credential scan:** a credential-pattern grep over the added lines of `ea54ac3..3a1778f` → 0. The commit message carries no "keeper".

## §4 The BAD_TUBE clause: the chair's check, and what it does not settle

- checked (`t180-d421b/tubecheck.js` → `tubecheck.out`):
  - on a 200 m road, Extend tube 360 makes a closed tube (its t runs 31 → 360);
  - **one Extend at tube 300 from it is not refused** (message null). The new piece runs 360.00 → 300.00, min 300.00, so it passes through the slot
    band and does not stay in it.

  So the chair's condition holds, and the clause is in.
  - *2026-10-20 23:1xZ: superseded. Ruled from the second check below, the clause is out at `eec17ac` (§9).*
- checked, same run: **the closed tube itself is the very same object after that Extend**, and no shell command sets a placed piece's sweep (`none`).
  - So "open it in Build" means "extend a new piece from it", which gives a different piece. In Build, a tube in the middle of a track cannot be
    opened at all.
  - The sentence may send the user to Build to look for something that isn't there. For a ruling: keep the clause, or drop it (one line in panel.js,
    `TUBE_SHUT`).
- Where it fires: only the `document.js:412` words ("must stay within 0 to 360"), with the Tube sweep tool. A downward step that `:413` refuses keeps
  the core's words.

## §5 For A (sculpt-frame.test.js, d2e57d6)

- The radius field's title is "brush radius, m", so A's `/radius/i` on aria-label or title finds it. Unchanged.
- **Bend reads the pointer's x**, as design §3.3 has it ("drag left or right"). A's `sculptDrag` swings y with x fixed, so on this page **row 3's
  Bend gets delta 0** and fails A's "enough work frames" check.
  - Swing x for Bend, and take Bend's delta as (press x − last x) × PER_PX.kh, left being more.
  - Grab and Twist read y, as A assumes. Row 5's delta (press y − last y) × PER_PX.height matches the page.
- The brush opens on the first move past 5 px from the press; the delta still counts from the press.
- A's one Tab a load lands in Sculpt, since every load starts in Build.

## §6 Corrections, mine

- Build | Sculpt in the bar was my first build. I didn't measure the bar before building it; menubar-page did, and it was 87 px over at 900. That's
  why the fallback.
- My first amended row 10 failed (run1, `run1.tap` → 535 of 536; message "BAD_BRUSH … got r 0"). The fake DOM leaves a number input empty, and the
  page sent r 0. Fixed in the page, not the test: an empty radius field now falls back to the default 60 m (`radiusNow`) instead of refusing.
- My first version opened the brush on the press. Every Sculpt click then opened and closed a brush: a refusal message on ea54ac3's guard, and a full
  `pathMoved` on release. It now opens on the first move.

## §7 Tests amended (the rule changed by name; each carries an AMENDED comment)

- `core-buildmenu` rows 1 and 4:
  - Brush is gone and Sculpt mode is first;
  - the strip shows only in Sculpt;
  - the commands are disabled "in Sculpt".
- `core-pieces-ui` rows 10, 11b, 12 and 14e, plus `sculptPanel()`:
  - Sculpt is set through the shell's switch;
  - the strip offers tools;
  - in Sculpt a moving press is the tool's and selects nothing, and a click selects;
  - in Build no press is a brush.
- `core-readout-display`, the two "brush's channel list" rows: they now read Smooth's channel list, Edge's which-edge, and Tube sweep under more. The
  "not in the local brush" check went with the mode select.
- `preview-speed`: the coalescing row's setup is Sculpt plus Twist; the brush opens on the first move.
- `menubar-page` row 11: Build ▸ Sculpt mode shows and hides the strip under the bar. Row 1's amendment for the switch was taken back with the switch.
- `core-mutation` U8: the anchor is now Smooth's channel list (`SMOOTH_CH`), with the same mutant (cup removed) and the same catching test.

## §8 Not done

- No CHANGELOG entry: six parts land together, and one entry at landing avoids a conflict. A line for it: "Sculpt is a mode: Build ▸ Sculpt mode or
  Tab; tools by what the hand does, 1-9; the radius on the wheel during a drag; the brush strip's on box, mode and channel are gone."
- No hover band before a drag. No sideways key for Grab other than Alt.

## §9 The ruling on §4 (chair, 22:55Z): the clause dropped

- `eec17ac` on d421-b (on 3a1778f): `TUBE_SHUT` now ends "...a slit between its tips that the car falls through." One line in `app/core/panel.js`, CRLF kept.
- checked: `grep -rln "open it in Build\|TUBE_SHUT\|slit between" app test` → app/core/panel.js only, so no test reads the sentence and none was re-run (the tier is "check it"; the change is visible wording).

## §10 P's review §1 items, §2 item 3, and sculpt-frame row 5 (2026-10-20 23:2xZ): `6ed230d` on d421-b

d421-b is now `3a1778f` → `eec17ac` (TUBE_SHUT without "so open it in Build instead", §9) → **`6ed230d`**.

- **Row 5's cause, fixed (A's §6, the librarian's ruling).** The strip's value line got its text as a drag opened and grew, pushing #preview down
  19.39 px under the held pointer. Every delta gained that, and the road jumped as a drag began.
  - The line now has a fixed height, one line (`height: 1.4em`), empty or not.
  - It never wraps: a long note is cut with an ellipsis, and its whole text is the tooltip.
- **THE DELTA RULE for Grab** (the chair's question): up and down, `delta = (press y − pointer y) × PER_PX.height`, which is 0.03 m a pixel.
  - Stage pixels: clientY minus the stage's top, so a moving stage was exactly the bug.
  - Measured from the PRESS point, also after the brush opens. The brush opens on the first move more than `CLICK_PX` (piecesui's, 5 px) from the
    press, and a press that never goes past it is a click.
  - Alt at the press: Grab-sideways, `(press x − pointer x) × PER_PX.lateral`.
  - checked: sculpt-frame row 5 (A's file at `7692f24`) on a scratch tree, my page at `6ed230d`'s panel.js plus d421-o `a563eb9` (O's shell with
    C's core) → `ok 1 - row 5` (`C:\Users\nname\Downloads\t180-d421b\row5.out`, 23:24:20Z; "s0 5098.00 m, delta 30 px").
  - The scratch tree (`t180-wt-b422`, branch `d421-b-row5`) is removed; it held only copies.
- **P's §1 items:**
  - item 1: the wheel during a drag calls `stopImmediatePropagation` (the handles' capture listener on the same stage no longer acts too);
  - item 3: `plainMessage` has no tool test (document.js:412's words are reached only by a sweep step);
  - item 4: the dead `HD.hitTest` line in `down` is gone, with a note saying why;
  - item 6: `CLICK_PX = PU.CLICK_PX` and `KNOT_M = AT_START_M`;
  - item 7: Extend's `onmouseenter` asks for no ghost in Sculpt. It's guarded at the hover rather than inside `ghost()`, because `ghost()` also redraws
    the readout from the fields.
  - **item 5: core-pieces-ui row 21.** In Sculpt, a Tube sweep drag on a tube shut all along (two 360° Extends; the first ramps 31 → 360) is refused,
    and the message line begins "Sculpt can't change the sweep of a closed tube".
    - checked: `row21-green.txt` → ok. Against a mutant `plainMessage` returning the core's words: `row21-mutant.txt` → `not ok`, "BAD_TUBE: piece 6
      (p7): the tube sweep must stay within 0 to 360°, but a control point is 360 to 375°". applied 1 / caught 1 / NOT APPLIED 0.
    - My first setup (one 360° Extend) brushed a part still ramping, and the shell's centreline guard refused it first in its own plain words: run4's
      one failure, corrected.
  - item 2: the dated notes at §1 and §4 are in.
- **§2 item 3:** on Esc with no drag open, when `st.brush.closing` is set, the panel calls `cancelBrush`. A route tool's re-close can be dropped from the
  keyboard.
- **Runs:**
  - run4 (`run4.tap`, 23:08Z, every touched file plus the page tests plus the 4 harnesses): 832 / 831 / 1, the 1 being row 21's first setup.
    Harnesses: core-close-mutation 45/45/0, core-mutation 60/60/0, core-xsec-mutation 30/30/0, mutation 103/103/0
    (`node t180-d049/tapmut.js run4.tap`).
  - run5 (`run5.tap`, 23:24-23:25Z, under the lock, after the Esc and value-line edits): core-pieces-ui, core-buildmenu, menubar-page, preview-speed,
    keys-anywhere, core-readout-display → **152 / 152 / 0**, 0 cancelled.
  - The harnesses were not re-run after run4. The later edits are the value line's style, its title and the Esc branch in `onSculptKey`; no anchor is in
    those lines (read).
- Both committed files are uniform CRLF.

## §11 Smooth's default radius (2026-10-20 23:5xZ): `8b7ef3e` on d421-b

- The pick: **3× the last tool's radius**, not a fixed 300 m. A smooth should reach past the bump it is taking out, and scale with it. O's figures
  (`p-d421-shell-O_2026-10-20.md` addendum): one control point at the bump's own radius, 10 at r 160, 29 at r 300. A fixed 300 m would reach far past
  a 60 m bump's neighbours on a short track and fall short of a 500 m bend.
- How: picking Smooth (the select, key 9) puts 3× the radius then in the field (60 → 180 m); picking any other tool puts that radius back. The field
  only: an open drag keeps its r.
- checked:
  - a throwaway check on core-buildmenu's fake DOM (`C:\Users\nname\Downloads\t180-d421b\smoothr.check.js` → `smoothr.out`): "smooth 180, back 60",
    pass 1;
  - run6 (`run6.tap`, 23:57-23:58Z, under the lock): core-pieces-ui, core-buildmenu, menubar-page, preview-speed, keys-anywhere, core-readout-display →
    152 / 152 / 0.
- No new test row: it is visible in the strip (tier "check it").
