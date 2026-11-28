# Packet (on L; three roles, the chair picks the panes): the test build of the width hold and the ghost fix, resumed

**Why now, and under whose word.** It is queue item 2 of `loop/handoff_t180_2026-11-27-D.md` (:94), which his 23:10 word
filled ("take all work and decisions i need to make and fold them into the handoff ... Will work on them at work tonight on
laptop"). It is reversible prep. **The install is his decision 3 and is not in this packet.**

**Where it stopped:** `handback/p-d678-n4a-build-O_2026-11-27.md`, section 3 and "To resume". The merge is done and on origin
as `landing-1128-n4a-wip` **9de0b18** (c522ea6 + 15e7d62 + 8c78a59, both merges clean). The plain rows of the touched tier
are 27 of 27. Nothing in the merge needs redoing.

**Registered, and it stands as written:** the same hand-back, section 2 ("Registered before go"). That covers the
predictions, the stop conditions and the unwelcome outcome, unchanged. Each role quotes the lines it is scored on before
it runs anything.

## What does not travel from D (checked by the librarian, 00:3x)

- O's `S/` scripts (`tier-harness.list`, `tset.js`, `noprev.js`, `pic678.js`) are on D only.
- On L there are: P's `tset2.js` and `pipeline263.js` (a P session's scratchpad, `l263/`); `bytes.js` (`l262/`); and, in git,
  B's `washpage678.js` (`handback/p-d678-even-read-B_2026-11-27_evidence/`), which is the script `pic678.js` was copied from.
- The harness list must be derived again on L. **O's rule:** every mutation harness that names a code file EITHER side
  changed (coreshell.js, trackmodel.js, extend.js, turnby.js), each match read in its file. O counted **16**. The
  librarian's plain `git grep` at 9de0b18 gives **19**, an upper bound: "extend" also matches words that are not the file.
  If the reading does not give 16, say which files differ before any run.

## Role 1, the landing role: half the harnesses, the whole suite, then the build

1. Run your half of the harness list, every one of them including `core-bank-carry-mutation` (13/13/0 on D, the same
   tree). Use `--test-concurrency=2` and read by verdict.
2. Run the whole suite with TAP. Read a machine-bound red once more under `--run --exclusive`, without `--timing` since no
   figure is taken, and name both readings.
3. **Only when** both harness halves are green, the suite holds by section 2, and roles 2 and 3 have rung: build the exe
   and the installer, hash them, and push the branch as `landing-1128-n4a` only.
4. Out of scope: no install, no launch of his app, no merge to builder `main`, no release. Do not build while his T-180
   app or dz-world.exe runs.

## Role 2: the other half of the harnesses, his files, the no-preview case with pictures

1. Run the other half of the harness list, the same way as role 1.
2. **His saved tracks and every undo step**, on c522ea6 against 9de0b18: the same sha256 of the saved text, or the same
   refusal. Use L262's `bytes.js` rule (`handback/p-l263-test-install-P_2026-11-27.md`:170). Read copies only, never his
   folder in place.
3. **The no-preview case** (`handback/p-d678-ghost-offset-P_2026-11-27.md` section 9; method at :124, :302, :345).
   Rewrite `noprev.js` from that section and say that you did. Then the two figures section 2 registers:
   - in node, the ghost is built, Extend places, and the width holds at 14.1259 m;
   - on the page, the ghost lies on the placed road at the head, under 0.01 m (1.0602 m at 15e7d62 alone).
   **Pictures** of the preview with the ghost on the head, on the merge and on c522ea6, so he sees them before any
   install.

## Role 3: the read 8c78a59 never had

The ghost fix (`d678-ghost-offset-p`, 5127aad then 8c78a59) was "not read by a second seat" (D handoff, branch table).
This role is for a seat that wrote none of it.
- Read the delta c522ea6..8c78a59, then the merge's meeting point: the width hold changed `drag-ghost.test.js`, and the
  ghost fix changed the ghost's sender in `coreshell.js`.
- Register your conditions for CLEAN before you read, as E did for the width hold.
- Vary what P fixed: a ghost after a width brush, after Undo, at a jump. Do not only re-run P's 76 rows.

## For every role

- Through heavy-run at BelowNormal, with no "timing" anywhere in a label; a timing session is the `--timing` flag only.
- No worktree left behind. Other authors' track names bracketed. Claims marked checked or inferred.
- Each role rings the librarian with `call_librarian` and the path of its hand-back.
- **Stop and ring, building nothing,** if any condition in section 2 fires.

## Amended 01:1x, after the three rings (librarian's ruling)

**What came back:** E's read (role 3) is CLEAN on the code and NOT CLEAN on one CHANGELOG sentence (section 4). C's half
(role 2) is green: 399 rows, his files the same, and the no-preview case as registered. **P's half fired a section 2
stop:** the control rows of `core-mutation` and `core-close-mutation` are red at `app/test/core-readout-display.test.js:520`.
The cause is the ghost fix's own (red at 8c78a59 and 9de0b18, green at c522ea6 and 15e7d62). Each candidate now carries
`lift: liftFor(d)`, a new function every call, and `deepEqual` compares functions by identity
(`handback/p-l270-n4a-land-P_2026-11-28.md` section 2).

**Ruled:**
1. **First, the whole suite on 9de0b18 now, with TAP, read by verdict.** We need the full list of reds before one fix is
   chosen, so the fix covers all of them in one commit. A machine-bound red is read once more under `--run --exclusive`.
   Nothing gets built.
2. **The fix, decided by that list and registered before it is written:**
   - If every functional red is this compare of `lift` by identity, the fix goes in the tests. Each such row compares
     `lift` by what it does: apply both to the same path, and the outputs are equal.
     **Never by leaving `lift` out of the compare.** A row that says "the same ghost" must still see a ghost that lifts
     differently.
   - The code is not changed to suit a compare (no caching of `lift` per document).
   - If any red is a behaviour difference, stop and ring before writing anything.
3. **In the same commit on `d678-ghost-offset-p`:** E's section 4 wording. The old ghost's miss was not "up to 2 m /
   2.5 m". It grew with the next piece's length (6.80, 7.62, 40.50 m on E's cases).
4. **The fix's author** runs `core-readout-display.test.js` and the two harnesses. A seat that did not write it reads the
   delta short, against condition 2 above: each amended row is still red when `lift` is changed to shift the path by
   0.5 m. Then a new merge onto c522ea6, the tier from the top (both halves), the whole suite, and the build. **Still no
   install** (his decision 3).

**For him, not for the build:** E section 4 and C section 5 found the same thing from two doors. After a grab or a nudge
that reaches the road's end, the next piece carries that drift on for its whole length (12 m over 100 m after one width
grab; 40.5 m over 1,000 m after a sideways nudge). The fixed ghost now shows it. That is his question.

## Amended 02:3x, after P's sections 6 to 8 (`handback/p-l270-n4a-land-P_2026-11-28.md`, git-blob c688192b; read)

**In:**
- The whole suite on 9de0b18: 5,131 tests, 7 fail. The only functional red is the `lift` compare at :520 (and the two
  harness controls that run it). The other four are timing rows.
- The fix is `d678-ghost-offset-p` **6ba9e19**, local. It touches the test file and CHANGELOG only, compares `lift` by its
  effect on one path, and is registered first at df095683.
  - It bites: one side moved 0.5 m is red, and one side with no lift is red.
  - The two harnesses: 133 of 133, mutants 124/124/0.
  - E's CHANGELOG figures are in.
- Under the exclusive hold, drag-frame row 8 and release-frame row 1 are still red, so a section 2 condition fires. The
  quiet reading was WORSE than the loaded one (three more drag-frame rows red), and P cannot see what ran.

**Ruled:**
1. **E reads 8c78a59..6ba9e19 short**, against P's section 7, and repeats the 0.5 m and no-lift bites itself. If CLEAN, P
   pushes `d678-ghost-offset-p` 6ba9e19.
2. **The new merge:** 9de0b18 + 6ba9e19, as `landing-1128-n4a`.
   - `git diff --stat 9de0b18 <new>` must show exactly `app/test/core-readout-display.test.js` and `CHANGELOG.md`; anything
     else is a stop.
   - My 01:1x item 4 asked for "the tier from the top (both halves)". **I narrow it, and say why:** the delta is one test
     file and one text file, and the whole suite runs every harness file anyway. So: **the whole suite once on the new
     merge**, read by verdict. That is required at the landing regardless, and it replaces the separate tier halves.
3. **The two timing rows, the reading P names, made fair to both trees:**
   - drag-frame, release-frame and core-extra-bank-drag-cost, at c522ea6 and at the new merge, **interleaved A B A B** under
     ONE `--run --exclusive --timing` hold;
   - the chair asks the L271 panes to start no lockless node probe during that hold;
   - a row counts as the merge's red only where it is red in BOTH merge readings and ok in BOTH c522ea6 readings;
   - anything else is the machine, said with both readings. Not before the suite on the new merge is done.
4. Then the build, the hashes, and the push as `landing-1128-n4a` only. **No install**, which is his decision 3, with C's
   pictures put to him first.
