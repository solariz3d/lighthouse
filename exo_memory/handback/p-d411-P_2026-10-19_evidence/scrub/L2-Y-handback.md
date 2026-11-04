# Hand-back: turnby.js kept answers (commit 77fc955, branch <worktree>, not pushed)

## What changed
- `src/core/turnby.js`
  - New `keyOf(x)` replaces both bare `JSON.stringify` keys (`extendCorner`'s MEMO, `startOf`'s START). It returns null, which means the answer is not kept, when JSON would not write the fields faithfully: NaN, ±Infinity, -0, undefined, a function or a symbol. Before this, `{ kh: null }` and `{ kh: NaN }` had the same key, so the NaN call got the kept answer instead of BAD_TARGET.
  - New `deepFrozen(doc)` replaces `Object.isFrozen(doc)` for both memos, on read and on write. A document frozen at the top only, with a mutable `pieces` array, no longer keeps answers. The check walks the document's objects once and is then cached in a WeakSet: a frozen object cannot be unfrozen, and the values of a fully frozen object cannot change.
  - The panel never sends undefined/NaN fields (`app/core/panel.js` `extendOptions`), so D404's drag speed-up still applies there. That last point is inferred from reading the code; the drag-ghost row 5 below still passes.
- `test/core_turnby.test.js` row 7 (new) covers both bugs: NaN after null through extendCorner (MEMO) and extendTurnBy (START), and a document frozen at the top only whose `pieces[0]` is replaced in place, through both paths.

## Tests run
- Red on the base: `hr.js -- node --test test/core_turnby.test.js` gave 7 tests, 6 pass, 1 fail. Row 7 failed at :95: `extendCorner(doc, {kh: NaN})` after `{kh: null}` did not throw.
- Green after the fix: `hr.js -- node --test test/core_turnby.test.js test/turn_corner.test.js test/climb_corner.test.js app/test/drag-ghost.test.js` gave 30 tests, 29 pass, 0 fail, 1 skipped, EXIT 0. Row 7 passes. The skipped row is an existing one: row 4 needs the keeper's ELYSIUM save, which is not in the repository.

## Not done
- The frozen-at-top half of row 7 was never shown red on its own. The red run stops at the first failure (the NaN half), and the in-between run (key fix only) waited the full 2-hour limit on the heavy-run lock without running (other sessions' D414 and D407 runs), so I did not restart it. inferred: on the base, `Object.isFrozen(top)` is true, so the second call returns the kept answer and the assertion would fail.
- Full suite not run. checked: only the four files above, via the green run.
- No mutation harness anchors turnby.js. checked: `grep -rln turnby` over test/scripts/tools finds no `*_mutation` test or harness that names it.

## Limits
- inferred: `src/core/close.js:204` keeps `residualMemo` under the same top-level-only `Object.isFrozen(doc)` check. It is outside this task and left as is; it should get the same ruling.
- inferred: `deepFrozen` reads getters through `Object.values`. A frozen document with an accessor that returns different values would still keep answers. Documents are plain data (`checkDoc`/`deepFreeze`), so this does not arise today.
- inferred: `keyOf` still writes non-plain objects in opts (a Map or Date, for example) the way JSON does. Opts are plain fields from the panel and core callers.
