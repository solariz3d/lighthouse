# Packet (on L; two roles, the chair picks the panes): Even as A0, the clean road, and the grab along the slope

**His word, 01:35** (verbatim in `briefs/t180_sculpt_even.md`): "1 a clean road, b i guess? c. we could try c if a and b
doesnt work. 2. yes? I think?"
- So **A0 comes first** (`d678-even-a`, the kept edge back in line with the road outside the stretch, the grab dips cleared).
  B is the second choice and C the fallback.
- His yes to the grab is tentative. **Both go on branches, with pictures for his eye. Nothing goes into a build from this
  packet, and nothing is installed.**

**Read before starting, and do not work it out again:**
- `loop/packet_t180_sculpt_even_build_on_D_2026-11-27.md`, from "Amended 17:4x" down (A0 against B; items 1 to 5).
- `handback/p-d678-even-build-A_2026-11-27.md` sections 4.7 to 4.9, 5.3 to 5.5, 6.2 and 7.
- `handback/p-d678-even-read-B_2026-11-27.md` section 2.

## Role 1, the builder of Even: A0 made right, on `d678-even-a` (298eaf6)

A0 is exact where its reading of the road before the grabs is right. It is wrong by METRES where it is not:
- 9.31 m on a run from the track's start, the 31 m lead every new track has;
- 3.94 m through a row of grabs;
- 2.92 m where the road's own width changes inside the run.

Those are the cases a driver would see, so they come first.

1. **Say why A0 misreads in each of the three cases, from the code** (checked, not inferred). Then propose, with rows
   registered before any build:
   - (i) a repair of the reading, where one exists;
   - (ii) where it does not, what A0 does instead. Your candidates are B's behaviour for that stretch, or a refusal by
     name that changes nothing.
   
   **The bar:** on every row of the 28-case table, the kept edge is within 0.01 m of A0's own claim, or the case is the
   named fallback, never metres off silently. The grab dips stay cleared (A0's reason for being his pick). No new red.
   **Ring the librarian with the proposal before building (ii).** What a fallback looks like to him is a design call.
2. **Item 5, the drag's cost**, as written at 22:3x:
   - (a) the pass-clearance guard runs once, at the release;
   - (b) the window's reaches are cut once per drag;
   - (c) time the step again.
   
   On L, time his largest lap's drag step against today's grab step (seconds against 114 ms, which L can read). If that lap
   is not on L, use the largest lap on L and say which. The fixture rows' 20.7 ms bar is read on D (L's noise cannot tell
   it); say so, don't force it.
3. **The words** made true to A0 after 1 and 2, and the mutants.
4. **Pictures:** before and after, on the same three grabbed roads as the 17:4x plans, as he would see them. They are
   untracked in the evidence folder.

## Role 2: the grab along the slope, on a side branch from c522ea6

**What D measured** (`handback/p-d678-even-banked-probe2-A_2026-11-27.md`, candidate 3):
- on a banked turn the bank stays at 0.0000°;
- a flat road is byte-identical;
- a 4 m pull widens the road 3.80 m (today 3.86);
- the middle rises 0.43 m, where today's grab drops it 0.24 m.

**Build it on branch `l271-grab-slope`, from c522ea6** (independent of Even, so it can ride a test build on its own).
1. Register these rows before building:
   - flat road, no cup: byte-identical to today;
   - flat road with a cup: say what changes, and by how much;
   - banked turn: the bank's change under 0.01° (0.1° fails);
   - his 16 tracks and every undo step on L: the same saved text (a grab is an action, not a stored thing, so a change here
     is a stop).
2. The middle now rises where it used to drop. Say whether the readout and the handles still sit where his hand is.
3. **Pictures for him:** today's grab against the new one, on a banked turn and on a flat cupped road, from his usual view
   and from the side. Untracked, in the evidence folder.
4. This is a tool he uses every day: the branch is pushed and goes into no build. He sees the pictures first.

## For both roles

- Through heavy-run at BelowNormal, with no "timing" in a label. Item 5's timing session uses `--run --exclusive --timing`
  and waits for its slot.
- Pane P holds slot 1 with the whole suite for L270. Do not take an exclusive hold while that suite runs.
- No worktree left behind. Other authors' track names bracketed. Claims marked checked or inferred. Ring the librarian with
  `call_librarian` and the path of your hand-back.
- Then a reader who wrote neither reads both deltas (a later dispatch).
