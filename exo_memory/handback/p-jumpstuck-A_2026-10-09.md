# p-jumpstuck-A — D278, after placing a Jump the panel stays in landing mode (t180), seat A, 2026-10-09

t180 repo `C:\Users\nname\Desktop\t180-track-builder`, worktree `C:\Users\nname\Desktop\worktrees\a-js-wt`, branch `jumpstuck-a` from `d1bf901` (0.3.3). **One commit `2391ec7`**, named paths, local, **not pushed, not installed.**
Files: `app/core/panel.js`, `app/test/core-pieces-ui.test.js`, `CHANGELOG.md` (an entry under [Unreleased] / Fixed). FEEL tier: rows on the shell and a fake-host panel, no real window. **`src/core` untouched, so the jump harness was not re-run.**

## 1. Reproduced headless (the real panel on a fake host; a throwaway probe, not committed)
A five-piece track, handles on (the default), the keeper's flow. `landing` = `shell.landing().index`, handles after the frames settle:

| step | pieces (r road, f flight) | `shell.landing()` | landing box | handles |
|---|---|---|---|---|
| start | rrrrr | null | hidden | the Extend ghost's ten |
| after **Jump** | rrrrrrfr | 6 | shown | **the landing's four only** (`landfwd, landleft, landup, landturn`) |
| a normal length typed (not extended) | rrrrrrfr | 6 | shown | the landing's four only |
| hover Extend | rrrrrrfr | 6 | shown | the landing's four only |
| **Extend click** | rrrrrrfr**r** | null | hidden | the Extend ghost's ten (the road's) |
| second Extend | …rr | null | hidden | the ten |
| Undo, Undo | back to rrrrrrfr | 6 | shown | the landing's four only |

So **the piece IS placed by Extend, and everything does come back — but only after an Extend is committed.** Between Jump and that Extend the panel is in landing mode and the Extend ghost's handles never show, which is what the keeper described.

## 2. The cause, by the plan's candidates
- **(a) `landing()` stays true after a road piece follows: false.** `jump.js:65-71` `landingOf` reads `last` and `before`; with a road after the landing road, `before.type` is `road`, so it returns null. Probe: `landing=null` after Extend; `jump-ui` row 2 already asserts it.
- **(b) the Extend block never re-renders: false.** Its fields and Extend button are never hidden; `fillLanding` (`panel.js:358-359`) hides only the landing's box, and does so after an Extend (rows 14b, probe).
- **(c) no way to extend after a landing: false.** Extend places the piece (pieces 8 → 9 in the probe).
- **(d) the handles stay the landing's after the head moves on: false** after an Extend (ten road handles, no `land*`).
- **The actual cause (something else), with the line:** the handle host's precedence, `panel.js` (before the fix) **`model: () => landingModel() || sculptModel() || ghostModel()`**, with `landingModel()` (`:313-318`) non-null for as long as `shell.landing()` is, and a landing staying the head until a piece is extended from it (the keeper's own D258 rule: "perfect it before expanding it on outward"). The landing's four handles TOOK THE PLACE of the Extend ghost's ten (the D258 comment said so on purpose) — so right after Jump there was no way to use the base equation's handles at all without committing an Extend, which also fixes the landing.
  The plan's reading ("it never RETURNS") describes the state before Extend; once Extend is pressed it does return, as above. The bug is that nothing offers the Extend controls in between.

## 3. The fix, and why this one
**While the landing is the head, the handle model is the Extend ghost's with the landing's four added** (`panel.js`, `model:`). Each kind answers for itself (`base` and `ctx` route by whether the kind is a landing kind). The landing's arrows sit at the landing's start; the Extend ghost's ten sit on the piece that would follow the landing road. Result, right after Jump: fourteen handles; an Extend handle types into its field (no document edit); a landing handle or box still moves the landing in one undo step; **Extend places the piece, fixes the landing, hides its box and takes its four handles away**; deleting back to the landing brings its four back beside the ten. A jump's own ghost (hover on Jump) still carries none of Extend's, and Sculpt still shows only the selected piece's.
**A side effect I had to fix with it:** a landing move is a new document, and `draw()` refilled every Extend field from the head, so dragging turn and then nudging the landing wiped the turn. A landing move now keeps the fields that differ from what the panel last put there (`FIELDS.filter(unapplied)`); the fields nobody touched still follow the head (a landing bank change moves the bank field).
**Chosen over:** (B) a "done with the landing" switch, which adds a control and a state; (C) landing handles that yield whenever Extend controls are touched, which makes handles appear and vanish under the pointer. **What would change my mind:** if fourteen handles are too busy in the keeper's real view, (B) is the next step; I could not judge that, the rule is no real window.

## 4. Tests (rows red first, under no lock for the light ones; core-xsec under the lock)
- **Red first:** row 14d (both sets right after Jump; an Extend handle types into its field and edits no document; a landing handle still moves the landing in ONE undo step; the landing's boxes still tune it; typed fields survive a landing move while an untouched field follows the head; Extend fixes the landing and its boxes and handles go; deleting back brings them back; the switch turns all off) and row 14e (a jump's ghost has none of Extend's; Sculpt has no landing arrows). On the old code: `actual: []` for the Extend ten, and `4 !== 14`. A second red appeared and was fixed: the typed turn was wiped by a landing drag (`'0' !== '3.3'`).
- Also run, all 0 fail: `core-readout-display` 38, `core-shell` 28, `core-widthlike` 6, `keys-anywhere` 6, `markers-panel` 6, `texture-panel` 8, `undo-guard` 6, `validate-ui-incval` 18, `core-eqonly` 31.
- `app/test/core-pieces-ui.test.js`: **39 pass, 0 fail.** Targeted: `jump-ui` 5, `handles` 19, `validate-ui-jumps` 8, `validate-ui-jumpdefault` 9, `validate-ui-panel` 9, `palette-panels` 7, `shell-ghost` 5, `preview-async` 10, all 0 fail. **`app/test/core-xsec.test.js` 22 pass, 0 fail** (under the lock).
- **Mutants of the change: 9 of 11 caught.** The 2 survivors are equivalent or unreachable: `ctx` for a landing kind is never read (`targetFor` ignores it); the `!undone` guard on the new keep is redundant with the `lastStep.op === 'landing'` condition (an undone Extend's last step is not a landing's).
- **One existing assertion changed, and why:** row 14c asserted that the landing's handles REPLACE the Extend ghost's (`['landfwd', …]` as the whole list; `length 4` after deleting back). That replacement is the reported bug, so it now filters to the landing's four and its title says so. Nothing else in 14c changed.
- **Panel-anchored mutation harnesses** (`core-close-mutation`, `core-mutation`, `core-xsec-mutation`, which anchor on text in `panel.js`): `core-close-mutation` **37 pass, 0 fail** (under the lock); `core-mutation` and `core-xsec-mutation` were still running when I rang (they hold the lock a long time) and their results are appended below when they finish. `U1`'s anchor (`showHead(); if (undone) putBack(m.made); for`) is intact in the changed line.

## 5. Does not establish
How fourteen handles read in the real view (no window was opened); that the keeper's report is only this (it matches his words and the state I reproduced); anything about the installed build (nothing installed). The whole `app/test` directory was not run (a first attempt reached a heavy mutation file outside the lock and I stopped it; the panel-loading files were run individually).

NEXT: chair land jumpstuck-a (2391ec7) and install it for the keeper to try a Jump followed by dragging the Extend handles

## Appended later (2026-10-09 evening): the two panel-anchored mutation harnesses finished under the lock, on `2391ec7`: `core-mutation` 60 pass, 0 fail; `core-xsec-mutation` 31 pass, 0 fail (with `core-close-mutation` 37/0 above, all three clean).
