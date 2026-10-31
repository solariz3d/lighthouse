# D430: an emptied equation field counts as 0 (librarian, 2026-10-22)

## The report

The keeper, 2026-10-22 09:10: "weird bug in track builder, if a part of the equation is blank, it doesnt count as 0. if one is blank auto set it to 0".

## The cause, read at local-0.4.13 6261a22 (checked by reading, not run)

- Each field shows the head's current value. `asTyped` (`app/core/panel.js:208`) sends a field only when its text differs from the shown value: "untouched = blank = continue".
- A field the user empties has the text `''`, which differs from the shown value, so `asTyped` returns `''`.
- `extendOptions`'s `num` (`panel.js:59`) then maps `''` to `null`, and a null sends no target.
- So an emptied turn, climb or bank does not go to 0. The piece **continues at the head's value**, the same as a field never touched.

## Part 1, pane C: the fix. Tier: check it, test first (a reported bug)

1. From local-0.4.13 6261a22, in your own worktree, on branch `d430-c`.
2. Write the test first in the file that already drives the panel (`core-pieces-ui.test.js` or its neighbour). It must fail now. Cover:
   - turn emptied after a turning head: the new piece eases to a turn rate of 0, not the head's rate;
   - the same for climb and for bank;
   - a field left untouched still continues as before.
3. The fix: a field the user **emptied** (empty text while the shown value is not empty) counts as 0. On change, the box is written back as `0`, so what the user sees is what is sent.
   - Applies to every field where 0 is a valid value: turn, climb, bank, cup, edge, tube.
   - Keep the current meaning for these, and say so at the code:
     - length and width: 0 is refused by the core;
     - grip: blank means the head's grip, by design (`panel.js:229`);
     - the right edge: blank follows the left edge, by design (`panel.js:76`);
     - the turn and climb in corner mode: these show blank as their resting state, so blank there is untouched, not emptied.
4. Run the tests for the touched files, and the core mutation anchors once.
5. Add a CHANGELOG line under Fixed, in plain words.
6. Hand back the cause (file:line), the test red then green, and the sha.

**Part 2:** the librarian rules. If it is accepted before Part 3 of D429 starts, B merges `d430-c` into local-0.4.14 with the rest; if not, it rides the next build.

NEXT: chair route Part 1 to C now (C is free since D426); the librarian rules on the hand-back.
