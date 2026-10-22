# D430 part 1, pane C: an emptied equation field counts as 0 (2026-10-22)

Packet: the chair's D430, 15:11:43Z; plan `exo_memory/loop/plan_d430_blank_is_zero_2026-10-22.md`. Tier: check it, test first.
Commit: **t180 `d430-c` b575fdb**, on local-0.4.13 6261a22, worktree `C:\Users\nname\Downloads\t180-wt-c30`. No push, no install.
- checked: `git merge-tree --write-tree b575fdb c1841ca` → clean against B's D428.

## 1. The cause

The cause is the one the plan gives; I confirmed it with the test below.
- `asTyped` (`app/core/panel.js:208` at 6261a22) returns `''` both for a field left as shown and for a field the user emptied.
- `extendOptions`'s `num` (`panel.js:59`) maps `''` to null, so no target is sent.
- So an emptied turn, climb, bank or cup continues at the head's value.

## 2. The fix (b575fdb)

- **`panel.js:208-214`:** `ZERO_WHEN_EMPTIED` covers turn, climb, bank, cup, edge and tube. `emptied(k)` means the box is blank where it showed a value. `asTyped` sends `'0'` for an emptied field. A field left as shown still sends `''` (continue).
  - The comment at the code says why the others keep their meaning: length and width (0 is refused by the core), grip (`gripOpt`, blank is the head's), the right edge (`rightTarget`, blank follows the left), and the turn and climb as corners (`showTurnHead` shows them blank at rest, so `shown` is `''` and a blank there counts as untouched).
- **`panel.js:324-325`:** on `change` (not on `input`, so clearing a box to type a new number isn't interrupted), an emptied box is rewritten to `0`. What the user sees is what is sent.
- `extendOptions` is unchanged. The hover and press code (B's D428 lines) is not touched.
- `CHANGELOG.md`: one Fixed line in [Unreleased].
- inferred: in a real number input, text the browser can't parse also reads as `value === ''`. That now counts as 0 where it used to count as continue. I didn't test it in a real browser.
- Not tested by a row: edge and tube. They take the same code path as cup.

## 3. The test, red then green

New rows in `app/test/core-pieces-ui.test.js`:

| Row | Checks | Before the fix | After the fix |
|---|---|---|---|
| 22 | after a head at turn 10, climb 2, bank 20 and cup 30, the turn emptied and committed shows `0`; emptied climb, bank and cup aren't rewritten while typed in; Extend eases all four to 0 | **red**: "the emptied turn box shows 0 once the change is committed", actual `''` | green |
| 22b | turn and bank left as shown continue; an emptied width continues | green (a control) | green |
| 22c | as a corner, a blank turn field is not rewritten and the track keeps turning | green (a control) | green |

checked: `node --test --test-name-pattern="row 22" app/test/core-pieces-ui.test.js` for each column.
- checked: with only `asTyped` put back to 6261a22's form and the box rewrite kept (a temporary edit, restored by copy and verified with `cmp`), row 22 is **red**. So the value actually sent is tested on its own, not only the box.
- The core's fit lands near its targets, not on them (9.99988 for 10). So the rows use tolerances: within 1% of the head's value for "eases to 0", and within 0.1 for "continues". The bug's error is the whole head value.

## 4. An existing test amended, by name

`app/test/core-readout-display.test.js`, "a CHANGED value is a target in the core's units…":
- Its line `P.type('bank °', ''); … targets.phi, undefined, 'a cleared field is blank: continue'` (D193, 6ed0b4f) asserts exactly the rule D430 changes. It went red after the fix.
- Amended, with a comment `AMENDED D430` at the line: a cleared bank is 0, and a cleared turn (shown as 20) is 0.
- The same test's "typed back to the shown 20: no target" line still holds that a field left as shown sends nothing.
- My commit message does not mention this amendment. I didn't amend the commit; this section is the record.

## 5. The touched files' tests

- checked: `scratchpad\d430\touched.log` ran all 29 files that `require` `core/panel` (`scratchpad\d430\files.txt`), under the lock, `--test-concurrency=4`. Result: **496 tests, 487 pass, 3 fail, 6 skipped**.
  - The 3 fails are one cause: the D193 line above, plus the two mutation-harness controls that run that file ("the unmutated temp copy passes…" in `core-mutation.test.js` and `core-close-mutation.test.js`).
  - inferred: the 6 skipped are the timed rows that need both heavy-run slots, as in D426. I didn't open the skip lines.
- checked: after the amendment, `touched.log.rerun.out` re-ran `core-readout-display`, `core-mutation`, `core-close-mutation` and `core-pieces-ui`: **215 tests, 215 pass, 0 fail**.
- Mutations (the core anchors, once): **applied 105 / caught 105 / NOT APPLIED 0**.
  - checked: `grep -c` over `touched.log.rerun.out` for "applied, and caught" → 105, and for "not applied" → 0.

## 6. Corrections to myself

- My first tolerances were 1e-6. The core's fit is not exact (9.999878 for 10), so the first red run failed on its controls, not on the bug. I loosened them as in §3 before reading red as red.
- A heredoc ate an escaped quote in the test (a syntax error, caught by a run that reported "1 test, 1 fail" for the whole file). I fixed it with Edit and ran `node --check`.

## 7. Scratch

`C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\scratchpad\d430\` holds `msg.txt`, `files.txt` and `touched.log*`. `d430tol.js` and `d430-panel.fixed.js` (the copy used for the half-revert) sit in the scratchpad root.
