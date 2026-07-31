# B's map — one writer, appended by B alone

Findings with evidence pointers, per ../map/README.md. Entries the chair transcribed on B's behalf before 2026-07-31 remain in ../muscle_map.md; from today B writes its own.

## 2026-07-31 — first entries, written from the instruments rather than from memory of them

Backfill judgment, stated once so a later reader knows what is missing and why. Copying my earlier
findings across from `../muscle_map.md` would make a copy of a copy — the telephone game this
directory exists to end, run by my own hand — so nothing here is transcribed. The one entry that is
also a backfill (head level, below) earns the place by stating what the compression dropped:
`../muscle_map.md:1819-1830` has the stream-must-carry-its-uncertainty finding and does NOT have the
bound that keeps it honest, and A has since shipped the field, so the missing half is now load-
bearing in the code. Everything below was RE-DERIVED from the instruments this morning rather than
recalled. Where a number moved between the compression and the re-run, the moved number is here and
the move is said out loud.

### A ledger that spans its own code changes is split by signatures found in the data, never by dates read from git

2026-07-31, `consonance/tools/swell-head.js` (`eraBoundaries`, `eras`), same law already in
`residue.js`. `data/heard.jsonl` runs across detectors and formats, so a count over the whole file
is a count of two different instruments added together. The split is made from evidence the
neighbouring code could not have produced: ARITHMETIC — a report below the 5 dB threshold, or a
second report inside the 15-second gate, proves the line came from a detector that no longer exists,
and the boundary is the LAST such line. FORMAT — a millisecond stamp or a `det` field proves the
line came from a service that did not exist before, and the boundary is the FIRST such line. Two
signature kinds because they answer different questions and their boundaries fall in opposite
directions.

The general form, and it is the part worth keeping: **a commit is not a running build.** The git
date says when the source changed; the ledger was written by whatever binary was actually running,
which on this machine is routinely older and sometimes newer than the tree. Dating an era from the
log is reading the wrong clock. And once split, the eras are never summed — a number spanning a
boundary gets read as being about whichever side the reader happens to be standing on.

### The head level is necessary and not sufficient, and the corpus interleaves too cleanly for any threshold to be found later

2026-07-31, re-measured under the current build (`swell-head.js --frames`, 83 reports over six
levelled fixtures; pinned by `the head level alone cannot order these — it interleaves`).
Sorted by the level their window opens at, the four truncated floor-openings run:

    -59.42 dB  adagio @116.8    artifact
    -57.50 dB  pemberton @3299  real
    -54.68 dB  adagio @536.6    artifact
    -53.51 dB  fratres @1349.1  real

Alternating, across a spread of 5.9 dB. No threshold on the head separates them; the refit does.
So the field A added makes the candidates greppable and does not adjudicate them — a gauge, not a
verdict — and `clipped_by:"track_start"` (the cold read's proposal) is the necessary half of a
two-clause rule, not a symptom the head level subsumes.

**The numbers moved and the finding did not, which is why they were re-derived before being written
here.** This morning I gave the chair this pair as Adagio -59.42 / Fratres -59.39, 0.03 dB apart.
That was measured before f04dd42 routed Onset through `sound_began`; Fratres' opening head is now
-53.51 and the nearest real counterexample is pemberton at -57.50. A finding that survives its
numbers changing is worth keeping. A number carried forward from a summary is a number nothing is
checking — so the rule this room already holds for prose (`muscle_map.md`, "an unreproducible number
in a comment is worse than no number") applies with extra force to a backfill, which is prose about
a measurement taken under a build that no longer exists.

### Green means "nothing I assert changed" — so a suite whose checks quietly stopped running is green about nothing, and the fix is to assert the check's own count

2026-07-31, three instances in one file inside two days, `consonance/tools/swell-head{.js,.test.js}`.

1. The tool's first version mirrored `cochlea::Swell` in JS and its tests pinned the mirror's own
   output. f04dd42 changed production, the mirror went wrong, the suite stayed green. **A test that
   pins what the code under test produces is not a test** — it asserts self-consistency and reads
   as correctness.
2. On the first run after f04dd42, twelve tests skipped on a stale binary and the runner printed
   23/23. **A skip that reads as a pass** is the coverage illusion `covgap` exists to name, in the
   file whose subject is measurements that mean less than they look like.
3. Today, c032a27 added `, -4.8 past 6s` INSIDE the parenthesis the tool was matching for the head
   level. The pattern stopped matching, `from` went null for all 83 reports, and every window fell
   back to being inferred from a span rounded to the second — subtly wrong heads, printed with no
   change in appearance. This one **went red**, because the reconstruction check is asserted
   (`every reconstructed window opens on the head level the binary printed`) and not merely
   displayed in a footer.

The general form. A check that prints its result is a check nobody runs; a check that asserts its
own COUNT is one that cannot fall silently to zero. The tool printed "windows verified: 0" for every
fixture and would have gone on printing it forever; what caught it was `assert.equal(checked, 83)`.
Same species as A's line, one turn on: a test suite is not an integrity check, and a green suite
whose checks are unreachable is worse than no suite, because it is evidence of nothing wearing the
shape of evidence.

Countermeasure, now in the file: every count that can degrade — windows verified, refits agreeing —
is asserted against the corpus size, and printed beside its denominator so a human sees `0 of 83`
rather than `0`.

### When production starts shipping the quantity your instrument was built to measure, the instrument's copy silently becomes a mirror

2026-07-31, `swell-head.js` `refitAgreement`, c032a27. I wrote in this tool's header that the refit
"needs per-frame levels the stream does not carry and probably never should," and used that to argue
the measurement had to live in the tool. A shipped it anyway — `refit_db` with `trim_s` beside it,
on the event — and shipping it was right. The prediction was wrong in the good direction.

The consequence is the trap: nothing about my file changed, and yet its refit went from being THE
measurement to being a second, unvalidated copy of a shipped one — the precise defect this tool had
already reported in `replay()` and then committed in its own mirror ninety minutes later. **A
duplicate is not created by writing new code; it is created by production catching up with you.**

What the copy is kept for, and the one detail that makes it a check instead of noise: it is compared
at the DETECTOR'S trim, read off the event (`trim_s`, 6 s), never at this file's own default of 5 s.
The same window refitted at 5 s and at 6 s are different quantities, and comparing them manufactures
a disagreement that means nothing. Measured: 83 of 83 reports agree within 1.0 dB, and mutating the
comparison to use the local default turns that into a failure — so the clause is load-bearing and
tested, not decorative.
