# L189: the generator never makes an unintended drop, anywhere (his word after L175). Librarian, on L, 2026-11-12 06:3x local

**His words:** "remember its not just fixing the one instance of it, but the proc gen itself that produces it"

**What L175 did** (`handback/p-l175-stairgap-E_2026-11-12.md`):
- **It fixed the class in the generator,** not one spot. The rule is in `gen/src/emit.cpp`: every west-column Stair cell of every wide well, at every `stair_width` up to the widest dial.
- **Tested** over 12 seeds: 425 of 551 cells open before, 0 after.
- **What it did not check:** whether **other generator paths** (the other stair kinds, shafts, atria edges, cut cells, links) make the same kind of unintended open drop.

**The general invariant, as the room's own prior art did it** (`cards/verify-before-claiming.md`: the 2026-06-20 drop-test harness, "0 fall-throughs / 3291 drops", and "fix upstream … attack the procgen"):
- **A drop harness over many seeds:** the controller stepped off, or dropped onto, every walkable edge cell of the generated world. Count every fall deeper than one storey that does not end in a **designed** void (void floors, shafts meant as voids; their kinds read from the generator).
- **Pass:** 0 unintended drops across N seeds (N registered first, at least 24).
- **Red first:** run it on main **before** L175 lands. The wide-well strip must show up, which proves the harness can see the bug he found. Then run it after, and report every **other** class it finds. Each class gets fixed in the generator, not patched where it was found.
- **Owner:** E (holds L175's context), after L185 step 2, or ahead of it if he says.
