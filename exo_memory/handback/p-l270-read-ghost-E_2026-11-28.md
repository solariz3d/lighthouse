# L270 role 3, pane E (L): the second-seat read of the ghost fix 8c78a59 (d678-ghost-offset-p), on the merge 9de0b18

Seat: pane E (sibling-07b8a48f, L). The order: `exo_memory/loop/packet_t180_n4a_resume_on_L_2026-11-28.md` "Role 3" and "For
every role" (room bc4e2f5d), the chair's L270 paste (2026-11-28T06:33:59Z). The fix's own record:
`handback/p-d678-ghost-offset-P_2026-11-27.md`. I wrote none of the ghost fix. I read the width hold (L264), whose
`drag-ghost.test.js` row 5 is where the two branches meet.

## 0. Registered before I read the diff (committed alone, before any read of c522ea6..8c78a59)

Read before this section was written: the packet whole, P's hand-back whole, O's section 2 (`p-d678-n4a-build-O_2026-11-27.md`:27-55).
Not read before it: the diff, any file at 8c78a59 or 9de0b18, any test row.

**The lines I am scored on (O's section 2, quoted):** "on the page, the ghost is shown **and** lies on the placed road at the
head: its offset there is **under 0.01 m**"; the unwelcome outcome "on the merge the ghost on the head is still off the placed
road", or "drag-ghost.test.js is red only on the merge".

**CLEAN means all of these hold.** Each one is a sentence that could be false.

1. **Scope.** c522ea6..8c78a59 changes only `app/core/coreshell.js` (the next piece's candidate, `candidateJump`, `undoGhostOf`,
   and `showPiece`'s candidate each carry one more field, `lift`), `app/preview/trackmodel.js` (`ghostSteps`' copy-and-extend
   branch), `app/test/ghost-offset.test.js` (new), and `CHANGELOG.md`. Any other file is named and read.
2. **No offsets, no change.** On a road with no h or l offset anywhere, every ghost (next piece, cheap/drag, Jump, undo,
   piece) is the same as c522ea6's: the same path and the same mesh, to the byte where the old code is deterministic.
3. **No double lift.** On a road whose offsets are applied once already (a re-laid tail that is lifted, a placed piece that
   carries the head's `l`), the ghost is lifted once: it lies on where placing lays it, not 2× the offset off.
4. **The variations, on the merge 9de0b18,** each against where placing (or Undo, or `jump()`) actually lays the road, within
   **0.01 m** at every shared station, head included:
   - a. the next piece's ghost after a **width brush** at the head on a road whose head carries an `l` offset (the width
     hold's path and the ghost fix's lift meet here);
   - b. the same after a width brush with **no** offset (the hold alone; it must match c522ea6 + 15e7d62's ghost, the fix
     adding nothing);
   - c. the **undo ghost** after one Undo, after two Undos, and after Undo then Redo, on a road with an offset at the head;
   - d. the **Jump ghost** from a head with an `l` offset, and from one with an `h` offset;
   - e. a **height** (h) offset at the head as well as a sideways (l) one, for the next piece's ghost;
   - f. the **cheap (drag) ghost**, the one `drag-ghost.test.js` reads, on a road with an offset at the head: on the placed
     road, or named as outside the fix's reach.
5. **The meeting point.** `drag-ghost.test.js` and the ghost's sender in `coreshell.js` at 9de0b18 carry both branches'
   changes, with no line of either lost; `drag-ghost.test.js` is green on the merge, and its row 5 pin is the width hold's
   (`eb3501a2c3eec581`).
6. **P's rows stand on the merge:** the 11 ghost files (76 rows at 8c78a59) are green at 9de0b18. Re-run, not quoted.
7. **The CHANGELOG** states no figure or rule that a run of mine contradicts.

**NOT CLEAN** if any of 1-7 fails. **"Do not build this"** if a ghost he can make in the app (by a brush, an Undo, a Jump or
the piece list) lies 0.01 m or more off where placing lays it on the merge, or a road with no offsets draws a different
ghost than c522ea6 did. A CHANGELOG-only or scope-only failure is NOT CLEAN but not "do not build this".

**The unwelcome outcome, in the words that would make it true:** "after a width brush (or an Undo, or at a Jump) on the merge,
the ghost lies off the placed road by more than 0.01 m"; "a road with no offsets draws a different ghost after the fix";
"the ghost is lifted twice".

**Default to refuted.** I attack each of P's claims; P's figures are not quoted as mine until re-derived.

**My bias.** I read the width hold and called it NOT CLEAN on its CHANGELOG (`p-l264-read-E_2026-11-27.md`), so I may lean
toward finding CHANGELOG faults and toward trusting drag-ghost row 5, which I checked. And on L264 my carry was "run a probe
with the app's own brush, not the one a test injects": I will use the shell's default `brushFn` for every width brush here.
