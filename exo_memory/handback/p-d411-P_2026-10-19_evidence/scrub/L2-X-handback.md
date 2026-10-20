# D411 hand-back: turnby's kept answers

## What changed (commit bacd8be, branch <worktree>, not pushed)
- `src/core/turnby.js`
  - `keyOf(v)` replaces the bare `JSON.stringify` key in `extendCorner` and `startOf`. It returns null (the answer is not kept) unless every value is one JSON prints faithfully: null, a boolean, a string, a finite number other than −0, an array with no holes, or a plain object made of these. NaN and ±Infinity used to print as `null`, −0 as `0`, and `undefined` as nothing. That is why `targets: { kh: NaN }` was served the answer kept for `kh: null`.
  - `frozenDeep(o)` replaces the `Object.isFrozen(doc)` / `(out)` / `(d0)` checks. It checks every level, and it remembers objects already found frozen in a WeakSet (freezing can't be undone), so each document is walked once. Before this, a document frozen only at the top kept its memo after its pieces array was edited in place.
- `test/core_turnby.test.js` row 7 (D411):
  - A fresh document refuses NaN. On one document, `kh: null` is accepted and NaN and Infinity are still refused.
  - On a document frozen only at the top, after `pieces.pop()`, both the plain path (extendCorner's memo) and the `turnDeg: -45` path (startOf's memo) build the new piece the same as a fresh document does.

## Tests
- Red on the base: row 7 failed with "Missing expected exception: kh NaN is refused". A separate script run on the base showed the stale answer for the top-frozen document on both paths: 3 pieces where 2 were right. After the fix it gives 2.
- Green, through the lock wrapper, all at once: core_turnby, turn_corner, climb_corner, core_sharp, app/test/drag-ghost, app/test/drag-frame, app/test/core-pieces-ui. 90 tests: 89 pass, 0 fail, 1 skipped.
- The per-file counts were then checked again, but **without** the lock wrapper (my slip):
  - core_turnby 7/7
  - turn_corner 8 pass + 1 skipped of 9
  - climb_corner 9/9
  - core_sharp 8/8
  - drag-ghost 5/5
  - drag-frame 5/5 (the 6.0 ms bar still holds)
  - core-pieces-ui 47/47

## Not done / Limits
- The full suite was not run, only the files that use turnby.
- I didn't look into the skipped row in turn_corner.test.js. My change didn't add it.
- Fields that `keyOf` refuses (NaN, −0, undefined values, non-plain objects) are now never kept. Each such call costs a full solve. That's correct, but a caller passing `undefined` values on every drag move would lose the memo. The panel's `extendOptions` was not checked for this.
- A document that isn't deep-frozen now never uses the memo, where before it did if only its top was frozen.
