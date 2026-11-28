# Packet (on L; the landing role, P): one combined test build of tonight's four pieces, built and NOT installed

**His word, 03:04** (verbatim in `briefs/lighthouse_the_room.md`): "i can wait to test once all in motion is built, then you
can give me a checklist of things to test". So this is one build. Installing it is his yes, given after the checklist.

## The pieces, each read CLEAN by a seat that did not write it

| piece | branch, tip | base | read |
|---|---|---|---|
| width hold + ghost fix | `landing-1128-n4a` **4ff069e** | c522ea6 | L270, `handback/p-l270-n4a-land-P_2026-11-28.md` §9 |
| grab along the slope | `l271-grab-slope` **16a93d1** | c522ea6 | `handback/p-l271-read-grab-slope-C_2026-11-28.md` §8 |
| Even A1 with A1B | `d678-even-a` **0c16169** | c522ea6 | `handback/p-l271-read-even-E_2026-11-28.md` §8 |

## Trial merges, read-only, by the librarian (05:3x on L, `git merge-tree --write-tree`)

- 4ff069e + 0c16169: **clean** (tree f230506c).
- 16a93d1 + 0c16169: **clean** (tree ca6e3058).
- 4ff069e + 16a93d1: **one conflict, `CHANGELOG.md`**. The conflict is two entries added at the same place.
- Files both slope and Even touch: `app/test/core-pieces-ui.test.js` (pairwise clean).
- Even changes **`src/core/document.js`** (the serializer). His-files check is a real test here, not a formality.

## Registered before the merge (the landing role writes this into its hand-back first, in its own words)

1. **The merge**, on `landing-1128-combined` from 4ff069e: first `--no-ff` 0c16169, then `--no-ff` 16a93d1.
   - The only conflict allowed is `CHANGELOG.md`, resolved by keeping both entries whole.
   - Any other conflict, or a resolution that changes a line of either entry: stop.
2. **The whole suite once on the merge**, with TAP, read by verdict.
   - A functional red: stop.
   - A timing red: read it with the L270 rule, under ONE `--run --exclusive --timing` hold, c522ea6 and the merge interleaved
     A B A B. A red counts as the merge's only if it is red in both merge readings and ok in both base readings.
3. **His saved tracks and every undo step:** c522ea6 against the merge.
   - Two checks: `serialize(parse())` on each tree, and C's shell open/save walk through Undo and Redo
     (`handback/p-l270-n4a-files-C_2026-11-28.md` §4, `shellsave.js`).
   - The same bytes, or the same refusal. Anything else: stop.
4. **The build:** exe and installer, each with its sha256 written beside it. Push the branch as `landing-1128-combined`
   only, through push-gate, and read it back.
5. **Pictures on the built page,** for his checklist. Each is a headless page render from the merge (untracked, in the
   evidence folder):
   - the ghost on the head after a width grab (C's no-preview case);
   - an Even with the edge kept, showing its sentence;
   - the slope grab on a banked turn.
6. **Not in scope:**
   - no install and no launch of his app;
   - no merge to builder `main`, no release;
   - no build while his T-180 app or dz-world.exe runs.

**Unwelcome outcome, in the words that would make it true:**
- "a test green on each branch alone is red on the merge": coreshell.js is touched by the ghost fix and by Even; and
  core-pieces-ui by Even and the slope grab;
- or "his tracks save differently on the merge" (Even changed `document.js`).

Ring the librarian with `call_librarian` and the hand-back's path. Through heavy-run at BelowNormal. No worktree left behind.

## Amended 06:5x, after P's stop (`handback/p-l272-combined-P_2026-11-28.md` section 0, git-blob 6766b66a; read)

**In:**
- The merge 0ba1da9 is clean (CHANGELOG both entries whole).
- The suite has 0 functional reds.
- His files save the same both ways.
- **D642 fired the registered timing rule.** Under one hold, the merge read 2.02 and 2.07 against c522ea6's 1.85 and
  1.91. The base itself read 2.06 at L270. The row sits at its bar on L.

**Ruled: the rule fired, so it is not waved away as "the machine". A reading settles it, with the decision registered
here before it runs:**
1. **D642's file alone, under ONE `--run --exclusive --timing` hold**, on four trees:
   - c522ea6;
   - 4ff069e;
   - 4ff069e + Even alone (P's b84952b);
   - 0ba1da9.
   
   **5 rounds**, each round running the four trees in a rotated order. 20 readings of the row's ratio.
2. **A tree is slower than c522ea6** only by L266's D642 rule (`handback/p-l266-timings-B_2026-11-27.md`): an exact
   one-sided Mann–Whitney U at p < 0.05, AND its median ratio over c522ea6's median by more than 0.10.
3. **Then:**
   - **No tree slower:** the machine. P builds, pushes and takes the pictures as the packet says, and names the readings.
   - **A tree slower by under 0.30 in median:** a small real cost. It does **not** stop a test build he asked for to judge
     by hand. P builds; the cost and the piece that carries it (Even if b84952b is slower, the slope grab if only 0ba1da9
     is) go on his checklist and to D for the quiet timing before any landing to `main`.
   - **A tree slower by 0.30 or more:** a stop. Nothing is built, and it comes back to the librarian.
4. Nothing else is re-run. No other timing row is read here.
